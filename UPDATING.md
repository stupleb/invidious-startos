# Updating this package

Checklist for bumping Invidious to a new upstream release:

1. **Find the new release tag** at <https://github.com/iv-org/invidious/releases> (e.g. `v2.YYYYMMDD.0`). Upstream ships arch-split tags (`<version>` for amd64, `<version>-arm64` for arm64), not a multi-arch tag, so confirm **both** exist on quay before pinning:
   ```bash
   docker buildx imagetools inspect quay.io/invidious/invidious:<version>
   docker buildx imagetools inspect quay.io/invidious/invidious:<version>-arm64
   ```
2. **Update `Dockerfile`** — both `FROM` lines carry the pinned version. If the new release's image is built on Alpine `ca-certificates-bundle` `20261020-r0` or later (no emSign ECC Root CA - G3), drop the CA-upgrade layer below the `FROM`s; until then keep it, since removing it early brings the compromised root back.
3. **Bump the companion pin** — the `IMAGE` build arg in `startos/manifest/index.ts`: the companion cuts no release tags, so pick the newest dated `YYYY.MM.DD-<sha>` build from <https://quay.io/repository/invidious/invidious-companion?tab=tags> (it should match `latest`), and confirm it with `docker buildx imagetools inspect`. Invidious releases and companion fixes often land together — always bump both. Once a companion build is compiled with Deno 2.9.8 or later (the `denoland/deno:bin-*` tag in its upstream `Dockerfile`), switch it back to `dockerTag` and delete `companion.Dockerfile`; until then keep the layer and move its `IMAGE` build arg.
4. **Update `startos/versions/current.ts` in place** — the new version and its release notes. Version format: `<upstream>:0` (e.g. `2.20260626.0:0`), bumping the `:N` revision for package-only changes. Spin off a version file only when the version already in `current.ts` carries a migration.
5. **Check upstream config changes**: diff `config/config.example.yml` between releases for new mandatory keys (the `invidious_companion` block was such a case). Update `startos/fileModels/config.yml.ts` if needed.
6. `make` type-checks, lints, checks formatting and packs (`make format` fixes formatting) — then device-test: playback (the thing that breaks most), login, and the config action.
7. Update `README.md` / `instructions.md` if behavior changed.
