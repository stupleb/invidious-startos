import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.20261114.0:0',
  releaseNotes: {
    en_US: 'Updates Invidious to 2.20261114.0, which includes security fixes.',
    es_ES:
      'Actualiza Invidious a la versión 2.20261114.0, que incluye correcciones de seguridad.',
    de_DE:
      'Aktualisiert Invidious auf Version 2.20261114.0, die Sicherheitskorrekturen enthält.',
    pl_PL:
      'Aktualizuje Invidious do wersji 2.20261114.0, która zawiera poprawki bezpieczeństwa.',
    fr_FR:
      'Met à jour Invidious vers la version 2.20261114.0, qui inclut des correctifs de sécurité.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
