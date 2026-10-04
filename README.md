<p align="center">
  <img src="icon.svg" alt="Invidious Logo" width="21%">
</p>

# Invidious on StartOS

> Everything not listed in this document should behave the same as upstream
> Invidious. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Invidious](https://github.com/iv-org/invidious) is an open source alternative frontend to YouTube. This package runs it with its required [Invidious companion](https://github.com/iv-org/invidious-companion) (which resolves video streams) and a PostgreSQL database, wired together so the service is usable the moment it starts — there is nothing to configure by hand.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Three subcontainers run as one service, each on the upstream image with its default entrypoint. Attach to a running install with `start-cli package attach invidious -n <name>`.

| Subcontainer | Image | Purpose |
|-----------|-------|---------|
| `invidious` | `quay.io/invidious/invidious`, built via the local `Dockerfile` | Web frontend and REST API |
| `companion` | `quay.io/invidious/invidious-companion` | Resolves YouTube video streams; required for playback |
| `postgres` | `postgres` (Alpine) | Subscriptions, accounts, playlists, and the video-metadata cache |

- **Architectures:** x86_64, aarch64.
- Upstream publishes arch-split Invidious tags (one for amd64, an `-arm64` variant for arm64) rather than a multi-arch tag; the local `Dockerfile` selects the right one per architecture via `TARGETARCH`.
- The companion has no release tags upstream, so it is pinned to a specific dated build in `startos/manifest/index.ts`.

## Volume and Data Layout

Two volumes hold all persistent state; the companion is stateless.

| Volume | Mount Point | Contents |
|--------|-------------|----------|
| `main` | `/data` (invidious) | `config.yml` — the Invidious configuration file |
| `db` | `/var/lib/postgresql` (postgres) | PostgreSQL data directory (`PGDATA` is its `data/` subdirectory) |

The companion keeps only a disposable player cache under `/var/tmp` in its own container filesystem; it has no volume and the cache is rebuilt as needed. There is no `store.json`.

## File Models

The package owns one configuration file, `config.yml` on the `main` volume, written as a YAML file model. It is seeded once at install (the model's defaults generate the secrets) and rewritten only on install and whenever the Configure Invidious action runs. Invidious reads the same file directly, so what the model writes is what the service loads at its next start.

Three classes of keys, which is what decides whether a hand edit sticks:

- **Generated once, then yours.** The PostgreSQL password, the `hmac_key` (cookie/CSRF secret), and the 16-character `invidious_companion_key` are random at first install and preserved from then on — across restarts, updates, and the config action. They are never regenerated.
- **Re-asserted to fixed values.** The database connection (user, host, port, database name), `check_tables`, the UI `port`, `host_binding`, `https_only`, and the companion's `private_url` are held at the values the package requires. A hand edit to any of these is read by Invidious until the next rewrite, then reverted — change them in code, not on disk.
- **Owned by an action.** `registration_enabled`, `login_enabled`, `popular_enabled`, and `statistics_enabled` are seeded with defaults and thereafter set through the Configure Invidious action.

Keys the package does not manage are left untouched. `check_tables` is held on so Invidious creates and repairs its own schema at startup, which is why the package does not run the upstream `init-invidious-db.sh` step.

## Dependencies

None. The companion and PostgreSQL both ship inside this package, so there is nothing to install first.

## Network Access and Interfaces

One interface is exported; the other two ports are internal to the package.

| Interface | Type | Port | Protocol | Purpose |
|-----------|------|------|----------|---------|
| `ui` ("Web UI") | ui | 3000 | HTTP | Invidious web frontend and REST API (`/api/v1/…`) |

The companion (8282) and PostgreSQL (5432) listen only inside the package; Invidious proxies companion traffic itself, so the companion is never reachable on its own. Invidious serves plain HTTP and StartOS supplies TLS and every address the interface is reached at.

## Installation and First-Run Flow

There is no setup wizard and no first-run task — the service is usable as soon as it starts. On first install the file model seeds `config.yml` with a random database password, a random `hmac_key`, a random `invidious_companion_key` (handed to the companion as `SERVER_SECRET_KEY`), and the companion's internal URL. Accounts are optional and registration is open by default; the Actions below lock that down. The first start also builds the database schema, so the web interface can take longer to report ready than on later starts (see Health Checks).

## Actions

One user-facing action; no hidden actions.

### Configure Invidious (`set-config`)

- **When to run it.** To change who can use the instance — typically to close open registration after you have created your own account on a publicly exposed instance.
- **What it changes.** The `registration_enabled`, `login_enabled`, `popular_enabled`, and `statistics_enabled` keys in `config.yml` (open registration, the ability to log in, the home-page "Popular" tab, and the public `/api/v1/stats` endpoint).
- **Cost and repeat safety.** Runs in seconds, idempotent, available at any status. Applying it restarts the service so Invidious reloads the file.
- **Outputs.** None.

## Tasks

None. The service is never held on a prompt, and its ordinary controls are always available.

## Health Checks

Each subcontainer has a readiness check; only Invidious's is shown in the UI. Startup is ordered — Invidious is not started until PostgreSQL and the companion both report ready.

| Subcontainer | Check | Failure means |
|--------|-------|---------------|
| `postgres` | `pg_isready` (not shown in UI) | The database is not accepting connections yet; a long first start usually means it is still initializing the data directory. |
| `companion` | Port 8282 listening (not shown in UI) | The companion is not up; playback will fail until it is. It fetches a token from YouTube at startup, which takes a few seconds. |
| `invidious` | Port 3000 listening, shown as "Web Interface" | The web frontend is not up. It has a 20-second grace period and waits on the other two; on the very first start it is also building the schema, so a slow first ready is normal — a persistent failure after that is a real fault. |

## Backups and Restore

The strategy differs by volume, and one of them is not copied at all.

- **`db` is dumped, not copied.** Backup runs `pg_dump` against the database; the volume's files are never captured. Restore starts a fresh PostgreSQL and replays the dump, so the restored database is rebuilt rather than copied back.
- **`main` is copied wholesale.** `config.yml` — including all generated secrets — is backed up and restored as files, so a restored instance keeps the same database password, `hmac_key`, and companion key.
- **The companion cache is excluded** because it is a disposable cache that rebuilds on demand.

A restored instance needs nothing re-entered: the secrets come back with `main`, and the database comes back from the dump.

## Limitations and Differences

1. **No `domain` / `https_only`.** TLS and hostnames are StartOS's job, so Invidious runs plain HTTP behind the proxy with no single canonical domain. Features that assume one — such as listing your instance in the public instance list — do not work.
2. **The companion is not separately reachable.** Its `public_url` is unset and all its traffic is proxied through Invidious, so there is no companion interface to expose.
3. **`config.yml` structural fields are owned by StartOS.** Hand edits to the database connection, ports, keys, or companion URL are reverted on the next rewrite (see File Models).
4. **Playback breakage is upstream.** When YouTube changes something and breaks playback — as it does periodically for every third-party frontend — the fix is a new upstream release and a package bump, not a local setting.

---

## Quick Reference for AI Consumers

```yaml
package_id: invidious
architectures: [x86_64, aarch64]
subcontainers: [invidious, companion, postgres]
images:
  invidious: quay.io/invidious/invidious # built via ./Dockerfile
  companion: quay.io/invidious/invidious-companion
  postgres: postgres
volumes:
  main: /data # invidious: config.yml
  db: /var/lib/postgresql # postgres: PGDATA
file_models:
  - config.yml # main volume, YAML
startos_managed_env_vars:
  - INVIDIOUS_CONFIG_FILE # invidious
  - SERVER_SECRET_KEY # companion
  - POSTGRES_DB # postgres
  - POSTGRES_USER
  - POSTGRES_PASSWORD
  - PGDATA
dependencies: none
interfaces:
  ui: { type: ui, port: 3000 }
internal_ports: # not exported as interfaces
  companion: 8282
  postgres: 5432
actions:
  - set-config
tasks: none
health_checks:
  - postgres
  - companion
  - invidious
```
