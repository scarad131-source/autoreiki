// Nombres legibles de las pistas de audio guardadas en las sesiones.
// Se usa en el historial (tarjeta y ventana de detalle) para que ninguna
// sesión aparezca como "Ambiente" o con el identificador técnico.
export const AUDIO_LABELS = {
  beach: "Playa tranquila",
  rain: "Lluvia relajante",
  forest: "Bosque nocturno",
  bowls: "Frecuencias Sanadoras",
  healing: "Frecuencias Sanadoras",
  meditation21: "Meditación guiada 21 días",
  reikiGuided: "Reiki guiada",
  reikiGuided26: "Reiki guiada 26 min",
};

export const audioLabel = (id) => AUDIO_LABELS[id] || "Ambiente sonoro";

// Las pistas de voz definen una sesión guiada (Reiki o meditación 21 días).
export const isGuidedTrack = (id) =>
  ["meditation21", "reikiGuided", "reikiGuided26"].includes(id);