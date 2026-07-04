import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.20260626.0:0',
  releaseNotes: {
    en_US: 'Initial release of Invidious 2.20260626.0 for StartOS.',
    es_ES: 'Versión inicial de Invidious 2.20260626.0 para StartOS.',
    de_DE: 'Erste Version von Invidious 2.20260626.0 für StartOS.',
    pl_PL: 'Pierwsze wydanie Invidious 2.20260626.0 dla StartOS.',
    fr_FR: 'Version initiale de Invidious 2.20260626.0 pour StartOS.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
