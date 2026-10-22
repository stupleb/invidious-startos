# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`, which provides the packaging guide and agent context. In this workspace the guide checkout is at `../../start-technologies`; in a bare clone, the full guide is at <https://docs.start9.com/packaging>.

- Two images track upstream and are bumped **together** on each release: `invidious` (built from `./Dockerfile`, which selects the arch-split upstream tag via `TARGETARCH`) and `companion` (built from `./companion.Dockerfile`; a dated `YYYY.MM.DD-<sha>` tag passed as its `IMAGE` build arg in `startos/manifest/index.ts` — upstream cuts no release tags for it). `postgres` stays on its pinned Alpine base. The full bump procedure is `UPDATING.md`.
- Invidious reads `config.yml` as a plain file (`INVIDIOUS_CONFIG_FILE`), and the file model (`startos/fileModels/config.yml.ts`) re-applies its values to that file on every container init and on the Configure Invidious action, writing only when something changed. A `z.literal` there is therefore the value the running service reads, not just a form default — changing one changes service behaviour.
- Keep `DENO_TLS_CA_STORE=system` in `companion.Dockerfile` while it exists: without it the companion ignores the CA bundle the layer installs.
