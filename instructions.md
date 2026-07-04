# Invidious

## Documentation

- [Invidious documentation](https://docs.invidious.io/) — the upstream guide covering features, the API, and troubleshooting.

## What you get on StartOS

- A **Web UI** interface — your private YouTube frontend: search, watch, subscribe, and build playlists without ads or tracking.
- The **Invidious companion** (required for video playback) and a **PostgreSQL** database run inside the package, fully configured — you don't manage either.

## Getting set up

There is nothing to set up. Install, start, and open the **Web UI** interface.

Creating an account (top-right → **Log in / Register**) is optional, but needed for subscriptions, playlists, and watch history. Accounts live entirely on your server.

## Using Invidious

- **Import your YouTube subscriptions**: in the Invidious UI, go to **Settings (cog) → Import/export data**. Invidious can import subscriptions from a Google Takeout export, a NewPipe export, or another Invidious instance.
- **Preferences** (theme, default quality, captions, autoplay) are set through the cog icon and stored per account (or in your browser if not logged in).
- **RSS**: every channel and playlist page has an RSS link, handy for feed readers.

### Actions

- **Configure Invidious** — toggle open registration, login, the "Popular" page, and the public statistics endpoint (`/api/v1/stats`). If you expose your instance publicly (e.g. via StartTunnel), consider disabling registration after creating your own account.

## Troubleshooting

- **Videos won't play**: YouTube frequently changes things and breaks all third-party frontends at once. Restart the service first; if it persists, check the [upstream issue tracker](https://github.com/iv-org/invidious/issues) — a package update usually follows shortly after upstream fixes it.
