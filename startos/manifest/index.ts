import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

export const manifest = setupManifest({
  id: 'invidious',
  title: 'Invidious',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/stupleb/invidious-startos',
  upstreamRepo: 'https://github.com/iv-org/invidious',
  marketingUrl: 'https://invidious.io',
  donationUrl: 'https://invidious.io/donate/',
  description: i18n.description,
  volumes: ['main', 'db'],
  images: {
    // Built from ./Dockerfile, which selects the upstream arch-split tag
    // (…:<version> for amd64, …:<version>-arm64 for arm64) via TARGETARCH.
    invidious: {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
    },
    // The companion cuts no release tags; pin one of its dated build tags.
    companion: {
      source: {
        dockerTag: 'quay.io/invidious/invidious-companion:2026.09.19-bb3b37f',
      },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: {
        dockerTag: 'postgres:14-alpine',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
