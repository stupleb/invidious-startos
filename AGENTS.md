# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`, which provides the packaging guide and agent context. In this workspace the guide checkout is at `../../start-technologies`; in a bare clone, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../../start-technologies/projects/start-sdk/docs/src/recipes.md` (or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("expose a web UI", "configure via a file model") to the constructs, the reference pages, and a named production package to copy. Find the recipe before you copy a neighbour: a package you reach by grepping may be non-conformant, and the recipe outranks it.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- Two images track upstream and are bumped **together** on each release: `invidious` (built from `./Dockerfile`, which selects the arch-split upstream tag via `TARGETARCH`) and `companion` (a dated `YYYY.MM.DD-<sha>` tag in `startos/manifest/index.ts` — upstream cuts no release tags for it). `postgres` stays on its pinned Alpine base. The full bump procedure is `UPDATING.md`.
- Invidious reads `config.yml` as a plain file (`INVIDIOUS_CONFIG_FILE`), and the file model (`startos/fileModels/config.yml.ts`) rewrites that file only on install and on the Configure Invidious action. A `z.literal` there is therefore the value the running service reads, not just a form default — changing one changes service behaviour.
