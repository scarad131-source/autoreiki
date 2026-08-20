// Recorrido de 21 días: sensibilizar los sentidos y mejorar concentración.

export const JOURNEY = [
  // Fase 1 — Sensibilizar los sentidos
  { day: 1, title: "Despertar la respiración", focus: "Toma conciencia del aire que entra y sale", config: { mode: "guided", level: "beginner", audio: "beach", minutes: 5 } },
  { day: 2, title: "Escuchar el silencio", focus: "Atención a los sonidos sin juzgarlos", config: { mode: "guided", level: "beginner", audio: "forest", minutes: 5 } },
  { day: 3, title: "Sentir el cuerpo", focus: "Recorrido suave por cada zona del cuerpo", config: { mode: "guided", level: "beginner", audio: "forest", minutes: 5 } },
  { day: 4, title: "Aroma de calma", focus: "Imagina fragancias que te serenan", config: { mode: "guided", level: "beginner", audio: "healing", minutes: 5 } },
  { day: 5, title: "Textura del presente", focus: "Toca y siente sin nombrar", config: { mode: "guided", level: "beginner", audio: "beach", minutes: 5 } },
  { day: 6, title: "Gusto de la quietud", focus: "Saborea el instante con lentitud", config: { mode: "guided", level: "beginner", audio: "healing", minutes: 5 } },
  { day: 7, title: "Sentidos integrados", focus: "Los cinco sentidos en un solo instante", config: { mode: "guided", level: "beginner", audio: "forest", minutes: 5 } },
  // Fase 2 — Mejorar concentración
  { day: 8, title: "Anclar la mente", focus: "Fija la atención en un solo punto", config: { mode: "guided", level: "intermediate", audio: "healing", minutes: 10 } },
  { day: 9, title: "Respiración 4-7-8", focus: "Ritmo que calma y concentra", config: { mode: "guided", level: "intermediate", audio: "healing", minutes: 10 } },
  { day: 10, title: "Foco en un punto", focus: "Mantén la atención sin desviarte", config: { mode: "guided", level: "intermediate", audio: "forest", minutes: 10 } },
  { day: 11, title: "Contar sin juzgar", focus: "Cuenta respiraciones del 1 al 10", config: { mode: "guided", level: "intermediate", audio: "beach", minutes: 10 } },
  { day: 12, title: "Observar el pensamiento", focus: "Mira los pensamientos pasar como nubes", config: { mode: "guided", level: "intermediate", audio: "healing", minutes: 10 } },
  { day: 13, title: "Vacío y plenitud", focus: "Reposa en el espacio entre pensamientos", config: { mode: "guided", level: "intermediate", audio: "forest", minutes: 10 } },
  { day: 14, title: "Concentración estable", focus: "Atención sostenida sin esfuerzo", config: { mode: "guided", level: "intermediate", audio: "healing", minutes: 10 } },
  // Fase 3 — Integración
  { day: 15, title: "Fluir sin esfuerzo", focus: "Deja que la práctica suceda", config: { mode: "guided", level: "intermediate", audio: "beach", minutes: 20 } },
  { day: 16, title: "Equilibrio de chakras", focus: "Armoniza tus centros de energía", config: { mode: "guided", level: "intermediate", audio: "healing", minutes: 20 } },
  { day: 17, title: "Silencio activo", focus: "Quietud profunda y despierta", config: { mode: "guided", level: "intermediate", audio: "forest", minutes: 20 } },
  { day: 18, title: "Compasión interior", focus: "Trátate con amabilidad genuina", config: { mode: "guided", level: "intermediate", audio: "healing", minutes: 20 } },
  { day: 19, title: "Presencia total", focus: "Cuerpo, mente y energía en unidad", config: { mode: "guided", level: "intermediate", audio: "beach", minutes: 20 } },
  { day: 20, title: "Sanación profunda", focus: "Permite que la energía sane", config: { mode: "guided", level: "intermediate", audio: "healing", minutes: 20 } },
  { day: 21, title: "Integración completa", focus: "Celebra tu evolución", config: { mode: "guided", level: "intermediate", audio: "forest", minutes: 20 } },
];

export const PHASES = [
  { name: "Sensibilizar los sentidos", from: 1, to: 7 },
  { name: "Mejorar concentración", from: 8, to: 14 },
  { name: "Integración", from: 15, to: 21 },
];

// Clave de día local (YYYY-MM-DD) en la zona horaria del usuario, para que la
// racha y el historial semanal coincidan con el calendario real y no con UTC.
// Clave de día (YYYY-MM-DD). Si se indica `timezone` (IANA), se calcula en esa
// zona; si no, en la zona local del navegador.
export function localDayKey(date, timezone) {
  const d = date instanceof Date ? date : new Date(date);
  if (!timezone) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function computeStreak(sessions, timezone) {
  const days = new Set((sessions || []).map((s) => localDayKey(s.created_date, timezone)));
  let streak = 0;
  const cursor = new Date();
  // Si hoy aún no hay sesión, la racha se mantiene desde ayer: no se rompe
  // hasta que realmente pase un día sin meditar.
  if (!days.has(localDayKey(cursor, timezone))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(localDayKey(cursor, timezone))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// La racha más larga (días consecutivos) alcanzada alguna vez.
export function computeBestStreak(sessions, timezone) {
  const days = Array.from(
    new Set((sessions || []).map((s) => localDayKey(s.created_date, timezone)))
  ).sort();
  if (!days.length) return 0;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((new Date(days[i]) - new Date(days[i - 1])) / 86400000);
    if (diff === 1) {
      cur++;
      if (cur > best) best = cur;
    } else if (diff > 1) {
      cur = 1;
    }
  }
  return best;
}

export function getStreakMessage(streak) {
  if (streak === 0) return { title: "Hoy es un buen día para empezar", body: "Cada gran viaje comienza con una sola respiración consciente." };
  if (streak === 1) return { title: "¡Lo lograste! 🌱", body: "El primer día es el más importante. Mañana querrás volver." };
  if (streak <= 3) return { title: "Vas construyendo el hábito ✨", body: "La constancia se siembra día a día. Sigue así." };
  if (streak <= 6) return { title: "Tu práctica cobra fuerza 🔥", body: "La energía fluye cuando regresas. Un día más y completas la semana." };
  if (streak === 7) return { title: "¡Una semana completa! 🪷", body: "Tu mente y tu cuerpo te lo agradecen. Estás creando un hábito sagrado." };
  if (streak <= 13) return { title: "Estás en zona de flujo", body: "La concentración se afina día a día. Tu presencia se profundiza." };
  if (streak === 14) return { title: "Dos semanas de presencia", body: "Estás transformando tu práctica en parte de ti." };
  if (streak <= 20) return { title: "La magia ocurre cuando no te rindes", body: "Estás a pocos días de completar el recorrido. No te detengas." };
  if (streak === 21) return { title: "¡21 días! 🎉", body: "Has cultivado un hábito sagrado. Celebra tu evolución." };
  return { title: "Tu práctica es parte de ti", body: "Sigues creciendo, un día a la vez. El viaje continúa." };
}