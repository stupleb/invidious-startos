import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.20260804.1:0',
  releaseNotes: {
    en_US:
      'Updates Invidious to 2.20260804.1 and refreshes the bundled companion. Comment rendering in videos and community posts is fixed, new interface languages are added, and the package tracks the latest upstream YouTube-compatibility work.',
    es_ES:
      'Actualiza Invidious a 2.20260804.1 y renueva el companion incluido. Se corrige la representación de los comentarios en vídeos y publicaciones de la comunidad, se añaden nuevos idiomas de interfaz y el paquete incorpora las últimas correcciones de compatibilidad con YouTube.',
    de_DE:
      'Aktualisiert Invidious auf 2.20260804.1 und erneuert den mitgelieferten Companion. Die Darstellung von Kommentaren in Videos und Community-Beiträgen wird korrigiert, neue Oberflächensprachen kommen hinzu, und das Paket übernimmt die neuesten Upstream-Korrekturen zur YouTube-Kompatibilität.',
    pl_PL:
      'Aktualizuje Invidious do wersji 2.20260804.1 i odświeża dołączony companion. Naprawiono wyświetlanie komentarzy w filmach i wpisach społeczności, dodano nowe języki interfejsu, a pakiet zawiera najnowsze poprawki zgodności z YouTube.',
    fr_FR:
      "Met à jour Invidious vers 2.20260804.1 et actualise le companion inclus. Le rendu des commentaires dans les vidéos et les publications de la communauté est corrigé, de nouvelles langues d'interface sont ajoutées, et le paquet intègre les dernières corrections de compatibilité avec YouTube.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
