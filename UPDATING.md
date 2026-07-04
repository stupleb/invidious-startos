# Updating this package

Checklist for bumping Invidious to a new upstream release:

1. **Find the new release tag** at <https://github.com/iv-org/invidious/releases> (e.g. `v2.YYYYMMDD.0`). Confirm both image tags exist on quay:
   - `quay.io/invidious/invidious:<version>` (amd64)
   - `quay.io/invidious/invidious:<version>-arm64` (arm64)
2. **Update `Dockerfile`** — both `FROM` lines carry the pinned version.
3. **Bump the companion pin** in `startos/manifest/index.ts`: pick the newest `master-<sha>` tag from <https://quay.io/repository/invidious/invidious-companion?tab=tags> (it should match `latest`). Invidious releases and companion fixes often land together — always bump both.
4. **Update `startos/versions/current.ts`** — rename the file/const if keeping history, else edit in place per the workspace version-file rules. Version format: `<upstream>:0` (e.g. `2.20260626.0:0`), bumping the `:N` revision for package-only changes.
5. **Check upstream config changes**: diff `config/config.example.yml` between releases for new mandatory keys (the `invidious_companion` block was such a case). Update `startos/fileModels/config.yml.ts` if needed.
6. `npm run check && make` — then device-test: playback (the thing that breaks most), login, and the config action.
7. Update `README.md` / `instructions.md` if behavior changed.
