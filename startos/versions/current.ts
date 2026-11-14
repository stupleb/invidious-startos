import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.20261113.0:0',
  releaseNotes: {
    en_US:
      'Updates Invidious to 2.20261113.0. Videos YouTube marks as AI-made now show an indicator.',
    es_ES:
      'Actualiza Invidious a la versión 2.20261113.0. Los vídeos que YouTube marca como creados con IA ahora muestran un indicador.',
    de_DE:
      'Aktualisiert Invidious auf Version 2.20261113.0. Videos, die YouTube als KI-generiert kennzeichnet, zeigen jetzt einen Hinweis.',
    pl_PL:
      'Aktualizuje Invidious do wersji 2.20261113.0. Filmy oznaczone przez YouTube jako utworzone przez AI mają teraz oznaczenie.',
    fr_FR:
      'Met à jour Invidious vers la version 2.20261113.0. Les vidéos que YouTube signale comme créées par IA affichent désormais un indicateur.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
