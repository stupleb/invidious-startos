# TODO

- [ ] Device-test on StartOS: fresh install, playback (companion), account creation, backup/restore, config action.
- [ ] Verify the invidious container user can read `config.yml` from the `main` volume (file model files are written host-side; may need a chmod oneshot).
- [ ] Consider a "Set Primary URL" action wired to `external_port`/`domain` if users report broken absolute URLs (RSS, OAuth-style flows).
- [ ] Watch upstream for versioned companion tags to replace the pinned `master-<sha>`.
