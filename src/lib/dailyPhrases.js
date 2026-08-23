// Frases alentadoras para el recordatorio diario de práctica.
// Se muestra una por día y se repiten en bucle cada 30 días.
export const DAILY_PHRASES = [
  "Cada día que meditas, tu energía se expande",
  "La sanación no ocurre de golpe, sino gota a gota",
  "Tu compromiso con la calma es tu mayor poder",
  "La energía responde a la constancia, no a la prisa",
  "Hoy también es un buen día para sanar",
  "Tu práctica diaria es una conversación con el universo",
  "La magia sucede cuando no abandonas",
  "Cada sesión es una semilla de luz que florece en ti",
  "El Reiki no se forza, se cultiva",
  "Tu energía se fortalece con cada respiración consciente",
  "No estás repitiendo, estás profundizando",
  "La paz que buscas se construye día a día",
  "Tu alma agradece cada minuto de atención",
  "Meditar no es escapar, es regresar a ti",
  "La disciplina espiritual también es amor propio",
  "Incluso cuando no sientes nada, la energía sigue fluyendo",
  "Tu constancia es tu mejor maestro",
  "Cada práctica te acerca más a tu esencia",
  "La energía nunca se pierde, solo se transforma",
  "Tu compromiso con sanar inspira a otros sin que lo notes",
  "Confía en el proceso, aunque no veas resultados inmediatos",
  "La luz interior crece en silencio",
  "Tu energía hoy es más fuerte que ayer",
  "El Reiki te enseña a escuchar lo invisible",
  "Meditar es recordar quién eres realmente",
  "La paciencia también es una forma de sanación",
  "Cada día que eliges continuar, el universo te aplaude",
  "Tu práctica es una ofrenda de amor hacia ti mismo",
  "La energía se vuelve más pura cuando la nutres con constancia",
  "No abandones: tu alma ya siente el cambio",
];

// Devuelve la frase correspondiente al día actual (bucle de 30 días).
export function getDailyPhrase(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return DAILY_PHRASES[dayOfYear % DAILY_PHRASES.length];
}