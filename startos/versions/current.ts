import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.20261022.0:0',
  releaseNotes: {
    en_US: 'Updates Invidious to 2.20261022.0.',
    es_ES: 'Actualiza Invidious a la versión 2.20261022.0.',
    de_DE: 'Aktualisiert Invidious auf Version 2.20261022.0.',
    pl_PL: 'Aktualizuje Invidious do wersji 2.20261022.0.',
    fr_FR: 'Met à jour Invidious vers la version 2.20261022.0.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
