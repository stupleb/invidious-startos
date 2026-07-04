<p align="center">
  <img src="icon.svg" alt="Invidious Logo" width="21%">
</p>

# Invidious on StartOS

> **Upstream docs:** <https://docs.invidious.io/>
>
> Everything not listed in this document should behave the same as upstream
> Invidious. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

This repository packages [Invidious](https://github.com/iv-org/invidious) for StartOS. Invidious is an open source alternative frontend to YouTube: browse, search, and watch videos and manage subscriptions without ads, tracking, or a Google account.

This package runs Invidious with its required [Invidious companion](https://github.com/iv-org/invidious-companion) sidecar (video playback) and a PostgreSQL database, fully wired together — no manual configuration needed.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

This package runs **3 containers**:

| Container | Image | Purpose |
|-----------|-------|---------|
| invidious | `quay.io/invidious/invidious` (via local `Dockerfile`) | Web frontend and API |
| companion | `quay.io/invidious/invidious-companion` | Handles YouTube video stream resolution; required for playback |
| postgres | `postgres` (alpine) | Subscriptions, users, playlists, video metadata cache |

- **Architectures:** x86_64, aarch64
- **Entrypoints:** Default upstream entrypoints for all three containers.
- Upstream publishes arch-split Invidious tags (`<version>` for amd64, `<version>-arm64` for arm64). The local `Dockerfile` selects the correct pinned tag per architecture via `TARGETARCH`.
- The companion image has no version tags upstream; the package pins a specific `master-<sha>` tag.

## Volume and Data Layout

| Volume | Mount Point | Contents |
|--------|-------------|----------|
| `main` | `/data` (invidious container) | `config.yml` — the Invidious configuration file, managed by StartOS |
| `db` | `/var/lib/postgresql` (postgres container) | PostgreSQL data directory (`PGDATA=/var/lib/postgresql/data`) |

The companion's player cache (`/var/tmp/youtubei.js`) is ephemeral and lives in the container filesystem; it is rebuilt automatically as needed.

Invidious reads its config from the `main` volume via the `INVIDIOUS_CONFIG_FILE` environment variable.

## Installation and First-Run Flow

- On first install, `config.yml` is seeded with everything Invidious needs: a random PostgreSQL password, a random `hmac_key`, a random 16-character `invidious_companion_key` (shared with the companion as `SERVER_SECRET_KEY`), and the companion's private URL.
- `check_tables: true` makes Invidious create and repair its own database schema on startup — the upstream `init-invidious-db.sh` step is not used.
- No setup wizard and no required tasks: the service is usable immediately after install and start.
- Accounts are optional; registration is open by default (see Actions to lock it down).

## Configuration Management

| StartOS-Managed (`config.yml`, do not edit by hand) | Upstream-Managed |
|------------------------------------------------------|------------------|
| Database connection (localhost, credentials) | Per-user preferences (theme, quality, captions, etc. via the web UI) |
| `hmac_key`, `invidious_companion_key`, companion URL | User accounts, subscriptions, playlists |
| `port` (3000), `host_binding`, `https_only: false`, `check_tables: true`, no `domain` | |
| `registration_enabled`, `login_enabled`, `popular_enabled`, `statistics_enabled` (via the Configure Invidious action) | |

The `domain` option is deliberately left unset because a StartOS service is reachable at several hostnames (`.local`, `.onion`, tunneled clearnet). Invidious derives URLs from the request Host header instead.

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|-----------|------|----------|---------|
| Web UI | 3000 | HTTP | Invidious web frontend and REST API (`/api/v1/…`) |

Accessible via all StartOS address types: `.local`, LAN IP, `.onion`, and StartTunnel/clearnet if configured. The companion (port 8282) is internal-only — Invidious proxies all companion traffic itself.

## Actions (StartOS UI)

| Action | Purpose | Availability |
|--------|---------|--------------|
| **Configure Invidious** (`set-config`) | Toggle registration, login, the Popular page, and the public statistics endpoint | Any status |

Changing settings restarts the service to apply them.

## Backups and Restore

- **Database:** backed up with `pg_dump` (SDK-managed), restored automatically on restore.
- **`main` volume:** backed up as files (`config.yml` including all generated secrets).
- The companion cache is not backed up (ephemeral).

## Health Checks

| Daemon | Check | Notes |
|--------|-------|-------|
| postgres | `pg_isready` | Internal, not user-visible |
| companion | Port 8282 listening | Internal, not user-visible |
| invidious | Port 3000 listening | Shown as "Web Interface"; 20s grace period; requires postgres + companion healthy first |

## Dependencies

None. All three containers ship inside this package.

## Limitations and Differences

1. **No `domain` / `https_only`** — TLS and hostnames are handled by StartOS; Invidious runs plain HTTP behind the StartOS proxy. Features keyed to a single canonical domain (e.g. publishing your instance in the public instance list) are not supported.
2. **Companion is not separately reachable** — `public_url` is unset, so all companion traffic is proxied through Invidious. There is no separate companion interface.
3. **`config.yml` is owned by StartOS** — hand edits to options the package manages (db, keys, port, companion) will be overwritten; other keys are preserved by the file model only if added to the schema.
4. **YouTube breakage happens upstream** — when YouTube changes break playback, the fix is a new upstream release and a package bump; there is nothing to configure locally.

## What Is Unchanged from Upstream

- The entire web UI and REST API (`/api/v1/…`), including RSS feeds
- User accounts, subscriptions, playlists, watch history, import/export (including from YouTube)
- Per-user preferences set through the web UI
- The `check_tables` schema management behavior

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Quick Reference for AI Consumers

```yaml
package_id: invidious
architectures: [x86_64, aarch64]
volumes:
  main: /data (invidious container)
  db: /var/lib/postgresql (postgres container)
ports:
  ui: 3000
internal_ports:
  companion: 8282
  postgres: 5432
dependencies: none
startos_managed_env_vars:
  - INVIDIOUS_CONFIG_FILE (invidious)
  - SERVER_SECRET_KEY (companion)
  - POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, PGDATA (postgres)
config_file: config.yml (main volume, YAML file model)
actions:
  - set-config
```
