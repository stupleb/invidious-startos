import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.20261103.0:0',
  releaseNotes: {
    en_US:
      'Updates Invidious to 2.20261103.0. The 720p quality option and Reddit comments are no longer available.',
    es_ES:
      'Actualiza Invidious a la versión 2.20261103.0. La opción de calidad 720p y los comentarios de Reddit ya no están disponibles.',
    de_DE:
      'Aktualisiert Invidious auf Version 2.20261103.0. Die Qualitätsoption 720p und Reddit-Kommentare sind nicht mehr verfügbar.',
    pl_PL:
      'Aktualizuje Invidious do wersji 2.20261103.0. Opcja jakości 720p i komentarze z Reddita nie są już dostępne.',
    fr_FR:
      'Met à jour Invidious vers la version 2.20261103.0. L’option de qualité 720p et les commentaires Reddit ne sont plus disponibles.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
