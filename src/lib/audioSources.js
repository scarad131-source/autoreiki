// Fuentes de audio ambiental disponibles para sesiones no guiadas.
// Se reproducen en bucle durante toda la sesión.
export const AUDIO_SOURCES = {
  beach: {
    id: "beach",
    name: "Playa tranquila",
    url: "https://media.base44.com/files/public/6a7d30a899098694894dbd88/200ce5b7d_Sonidoplayatranquila30mmp3.mp3",
  },
  bowls: {
    id: "bowls",
    name: "Frecuencias Sanadoras",
    url: "https://media.base44.com/files/public/6a7d30a899098694894dbd88/fccced0cf_completerebalancing7chakrasSingingBowls.mp3",
  },
  meditation21: {
    id: "meditation21",
    name: "Meditación 21 días",
    url: "https://media.base44.com/files/public/6a7d30a899098694894dbd88/c504ee3dd_meditacionguiadaAUTOREIKI_final27_ago.mp3",
  },
  reikiGuided: {
    id: "reikiGuided",
    name: "Reiki Guiada",
    url: "https://media.base44.com/files/public/6a7d30a899098694894dbd88/c81714508_Sesion_Reiki_guiada_26minmp3.mp3",
  },
  rain: {
    id: "rain",
    name: "Lluvia relajante",
    url: "https://media.base44.com/files/public/6a7d30a899098694894dbd88/5c8cb3241_soundreality-rain-sound-550289.mp3",
  },
  forest: {
    id: "forest",
    name: "Bosque nocturno",
    url: "https://media.base44.com/files/public/6a7d30a899098694894dbd88/6119d03a8_eryliaa-forest-wind-with-crickets-and-cuckoo-355613_Bosquenocturno.mp3",
  },
};

export const AMBIENT_URL_DEFAULT = AUDIO_SOURCES.beach.url;

// Tracks de voz guiada: se reproducen una sola vez y su duración define el
// temporizador de la sesión (a diferencia del ambiente, que va en bucle).
export const VOICE_TRACK_IDS = ["meditation21", "reikiGuided"];
export const isVoiceTrack = (id) => VOICE_TRACK_IDS.includes(id);

export function audioUrlFor(id) {
  return (AUDIO_SOURCES[id] && AUDIO_SOURCES[id].url) || AMBIENT_URL_DEFAULT;
}