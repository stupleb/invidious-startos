import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.20260804.1:1',
  releaseNotes: {
    en_US:
      'Video playback is more reliable, and backups of large databases complete.',
    es_ES:
      'La reproducción de vídeo es más fiable y las copias de seguridad de bases de datos grandes se completan.',
    de_DE:
      'Die Videowiedergabe ist zuverlässiger, und Sicherungen großer Datenbanken werden abgeschlossen.',
    pl_PL:
      'Odtwarzanie wideo jest bardziej niezawodne, a kopie zapasowe dużych baz danych kończą się powodzeniem.',
    fr_FR:
      'La lecture vidéo est plus fiable et les sauvegardes des bases de données volumineuses aboutissent.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
