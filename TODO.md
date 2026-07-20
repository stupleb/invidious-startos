# TODO

- [ ] Device-test on StartOS. **Verified 2026-07-20** (SDK 2.0.6, x86_64): fresh install, all three daemons start, `check_tables` builds the schema, companion generates and validates a PO token, **video playback**, **account creation**, and the **Configure Invidious action** (toggles apply, `.const()` fires the reactive restart, db volume persists). Crucially, an authenticated `200 GET /api/v1/auth/subscriptions` *after* that restart confirms all three generated secrets survive `merge()` — `hmac_key` (session cookie still valid), the db password (postgres skips re-init and keeps its original password, so a regenerated one would fail auth), and `invidious_companion_key` (companion logs an identical `secret_key`). **Still to exercise: backup and restore** (`pg_dump` has never run on this package).
- [ ] Consider `runAsInit: true` on the invidious and companion daemons. Both images use tini, which warns at startup that it is not PID 1 and therefore cannot reap zombies. `exec.runAsInit` makes the SDK `launch()` the command as PID 1 instead of `spawn()`ing it. Not urgent and not a 2.0 regression — but it changes signal delivery and teardown, so it needs its own device test.
- [ ] Low priority: on **first boot only**, ~24s elapses between postgres reporting ready and invidious launching (2026-07-20: postgres ready 14:07:54, `Launching invidious...` 14:08:18). A restart the same day showed a 2s gap (14:20:55 → 14:20:57), so this is not a per-start cost — it looks like the `pg_isready` poll landing unluckily after `initdb`'s long first run, not a wiring problem. Only worth chasing if a user reports a slow first start.
- [ ] Consider a "Set Primary URL" action wired to `external_port`/`domain` if users report broken absolute URLs (RSS, OAuth-style flows).
- [ ] Watch upstream for versioned companion tags to replace the pinned `master-<sha>`.

## Known benign log noise

Both of these look like failures and will be reported as bugs; neither is one.

- `ERROR: relation "<table>" does not exist` (×8) on **first start only** — this is `check_tables` probing each table with `SELECT * FROM x LIMIT 0` and creating the ones that error. It is the mechanism replacing upstream's `init-invidious-db.sh`.
- `InstanceListRefreshJob: failed to parse information from '<host>'` — Invidious fetching the public instance list and choking on Yggdrasil-network entries. Upstream noise.
- The companion prints its full loaded config at startup, **including `secret_key`** (the `invidious_companion_key`). Upstream behavior, not something the package sets out to log. Low impact — port 8282 exports no interface and the companion runs with `verify_requests: false` — but it does mean the shared secret lands in service logs, so treat a shared log as leaking it.
