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
    // Companion publishes no version tags — only `latest` and rolling
    // `master-<sha>` tags. Pin the current master sha for reproducibility.
    companion: {
      source: {
        dockerTag: 'quay.io/invidious/invidious-companion:master-5652eda',
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
  dependencies: {},
})
