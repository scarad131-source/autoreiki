// Fuentes de audio ambiental disponibles para sesiones no guiadas.
// Se reproducen en bucle durante toda la sesión.
export const AUDIO_SOURCES = {
  beach: {
    id: "beach",
    name: "Playa tranquila",
    url: "https://media.base44.com/videos/public/6a7d30a899098694894dbd88/af73fce44_sonidodeplayatranqullaalamanecer.mp4",
  },
  bowls: {
    id: "bowls",
    name: "Frecuencias Sanadoras",
    url: "https://media.base44.com/files/public/6a7d30a899098694894dbd88/fccced0cf_completerebalancing7chakrasSingingBowls.mp3",
  },
  meditation21: {
    id: "meditation21",
    name: "Meditación 21 días",
    url: "https://media.base44.com/files/public/6a7d30a899098694894dbd88/3bb166317_MEDITACION21DIAS_02.mp3",
  },
};

export const AMBIENT_URL_DEFAULT = AUDIO_SOURCES.beach.url;

export function audioUrlFor(id) {
  return (AUDIO_SOURCES[id] && AUDIO_SOURCES[id].url) || AMBIENT_URL_DEFAULT;
}