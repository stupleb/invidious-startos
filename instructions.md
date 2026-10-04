# Invidious

## Documentation

- [Invidious documentation](https://docs.invidious.io/) — the upstream guide to features, the API, and troubleshooting.

## What you get on StartOS

Opening the **Web UI** interface gives you Invidious's full web frontend and API. The companion that resolves video playback and the PostgreSQL database that holds your accounts, subscriptions, and playlists both run inside the package and are configured for you, so there is nothing to set up behind the scenes.

## Getting set up

Open the **Web UI** interface — there is nothing to configure first.

An account is optional, but subscriptions, playlists, and watch history need one. Create it from **Log in / Register** at the top right; accounts and their data live entirely on your server.

If you expose your instance publicly, create your own account first, then use the **Configure Invidious** action to turn off open registration.

## Using Invidious

- **Import your YouTube subscriptions** from the cog menu → **Import/export data**. Invidious accepts a Google Takeout export, a NewPipe export, or a subscriptions file from another Invidious instance.
- **Set your preferences** (theme, default quality, captions, autoplay) from the same cog menu. They are stored per account, or in your browser when you are not logged in.
- **Subscribe to RSS feeds** — every channel and playlist page links an RSS feed for your reader.

### Actions

- **Configure Invidious** — turn open registration, login, the home-page "Popular" tab, and the public statistics endpoint on or off.

## Troubleshooting

**Videos won't play.** YouTube changes frequently and breaks third-party frontends all at once. Restart the service first; if playback is still broken, check the [upstream issue tracker](https://github.com/iv-org/invidious/issues) — a package update usually follows soon after upstream ships a fix.
