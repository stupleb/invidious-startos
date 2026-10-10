# TODO

- [ ] Device-tested on StartOS (x86_64), record of what's been exercised:
  - **2026-07-20** (v2.20260626.0_0, SDK 2.0.6): fresh install, all three daemons start, `check_tables` builds the schema, companion generates/validates a PO token, **video playback**, **account creation**, the **Configure Invidious action** (toggles apply, `.const()` fires the reactive restart, db volume persists), **secret survival** across that restart (an authenticated `200 GET /api/v1/auth/subscriptions` proves `hmac_key`, the db password, and `invidious_companion_key` all survive `merge()`), and **backup/restore**.
  - **2026-08-05** (in-place upgrade to v2.20260804.1_0): the browse path (trending/search — the thing that had been throwing the upstream YouTube 400) and playback, verified by the maintainer.
- [ ] Consider exposing the new upstream optional config keys as Configure-Invidious toggles if users ask: `disable_abusable_api` (blocks easily-spammed `/api/v1/videos|clips|transcripts`, for public instances) and the `videojs` buffer lengths (`goal_buffer_length`/`max_goal_buffer_length`). Both arrived in v2.20260804.0 with upstream defaults, so absent from our `config.yml.ts` they simply take those defaults — no action required, just optional surface area.
- [ ] Optional: `runAsInit: true` on the invidious and companion daemons. Both images use tini, which warns at startup that it is not PID 1; StartOS 0.4.0.2 reaps orphaned processes itself, so the warning is cosmetic, and the SDK changelog notes `runAsInit` suits tini-based images. It changes signal delivery and teardown, so it needs its own device test.
- [ ] Low priority: on **first boot only**, ~24s elapses between postgres reporting ready and invidious launching (2026-07-20: postgres ready 14:07:54, `Launching invidious...` 14:08:18). A restart the same day showed a 2s gap (14:20:55 → 14:20:57), so this is not a per-start cost — it looks like the `pg_isready` poll landing unluckily after `initdb`'s long first run, not a wiring problem. Only worth chasing if a user reports a slow first start.
- [ ] Consider a "Set Primary URL" action wired to `external_port`/`domain` if users report broken absolute URLs (RSS, OAuth-style flows).

## Known benign log noise

These look like failures and will be reported as bugs; none is one.

- `ERROR: relation "<table>" does not exist` (×8) on **first start only** — this is `check_tables` probing each table with `SELECT * FROM x LIMIT 0` and creating the ones that error. It is the mechanism replacing upstream's `init-invidious-db.sh`.
- `InstanceListRefreshJob: failed to parse information from '<host>'` — Invidious fetching the public instance list and choking on Yggdrasil-network entries. Upstream noise.
- The companion prints its full loaded config at startup, **including `secret_key`** (the `invidious_companion_key`). Upstream behavior, not something the package sets out to log. Low impact — port 8282 exports no interface and the companion runs with `verify_requests: false` — but it does mean the shared secret lands in service logs, so treat a shared log as leaking it.
