// Guiones de meditación guiada enfocados en liberación emocional y preparación para Reiki.
// Voz de 3 min (sesiones de 5-10 min) y voz de 5 min (sesiones de 15-20 min); el resto de la
// sesión queda solo con la ambientación elegida.

export const RELEASE_SCRIPTS = {
  short: {
    title: "Liberación emocional · Preparación para Reiki",
    subtitle: "Voz de 3 minutos · ideal para 5-10 min",
    steps: [
      { seconds: 18, text: "Bienvenida. Acomódate con suavidad y cierra los ojos. Respira sin prisa, dejando que el cuerpo descanse." },
      { seconds: 20, text: "Inhala calma… y al exhalar, suelta el día. Aquí no hay nada que resolver, solo estar." },
      { seconds: 22, text: "Coloca una mano sobre el pecho. Siente el calor de tu mano, tu propia presencia que te acompaña." },
      { seconds: 24, text: "Si hay una emoción pesada, no la rechaces. Mírala con ternura, como a una amiga cansada." },
      { seconds: 26, text: "Con cada exhalación, deja que esa emoción se disuelva, como niebla que se aclara con la luz." },
      { seconds: 26, text: "No hace falta retener nada. Permítete soltar. Estás a salvo dejando ir lo que ya no te nutre." },
      { seconds: 22, text: "Respira hacia el espacio que queda. Ese espacio es paz, es claridad, es tu corazón abierto y sereno." },
      { seconds: 22, text: "Prepara tu cuerpo y tu energía para recibir. Eres un canal limpio, dispuesta a sanar." },
    ],
  },
  long: {
    title: "Liberación emocional · Preparación para Reiki",
    subtitle: "Voz de 5 minutos · ideal para 15-20 min",
    steps: [
      { seconds: 20, text: "Bienvenida. Acomódate con suavidad y cierra los ojos. Respira sin prisa, dejando que el cuerpo descanse." },
      { seconds: 22, text: "Inhala calma… y al exhalar, suelta el día. Aquí no hay nada que resolver, solo estar." },
      { seconds: 24, text: "Lleva la atención a los pies, a las piernas, al abdomen. Deja que cada zona se relaje al exhalar." },
      { seconds: 26, text: "Coloca una mano sobre el pecho. Siente el calor de tu mano, tu propia presencia que te acompaña." },
      { seconds: 26, text: "Si hay una emoción pesada, no la rechaces. Mírala con ternura, como a una amiga cansada." },
      { seconds: 28, text: "Pregúntale a esa emoción qué quiere decirte. Escucha sin juzgar. Solo respira y acompáñala." },
      { seconds: 28, text: "Con cada exhalación, deja que se disuelva, como niebla que se aclara con la luz del amanecer." },
      { seconds: 28, text: "No hace falta retener nada. Permítete soltar. Estás a salvo dejando ir lo que ya no te nutre." },
      { seconds: 26, text: "Imagina una luz cálida en el pecho que crece con cada respiración, llenando el espacio liberado." },
      { seconds: 24, text: "Ese espacio es paz, es claridad, es tu corazón abierto. Aquí habita la compasión por ti misma." },
      { seconds: 24, text: "Prepara tu cuerpo y tu energía para recibir. Eres un canal limpio, dispuesta a sanar." },
      { seconds: 24, text: "Reposa en esta quietud. Cuando estés lista, lleva esta calma contigo al recibir tu terapia." },
    ],
  },
};

export const CHAKRAS = [
  { id: "root", name: "Raíz", color: "#EF4444", colorName: "roja", position: "la base de la columna", zone: "Pelvis", placement: "Coloca las manos en forma de V sobre la pelvis o los muslos superiores.", benefits: "Aporta enraizamiento y seguridad; ayuda a calmar el miedo y a sentir estabilidad en el cuerpo.", affirmation: "Estoy a salvo y enraizado.", objective: "Bases en la vida, supervivencia, seguridad, instinto y temores", freq: 396 },
  { id: "sacral", name: "Sacro", color: "#F97316", colorName: "naranja", position: "el bajo abdomen", zone: "Abdomen bajo", placement: "Deja las manos sobre el abdomen bajo, justo debajo del ombligo.", benefits: "Nutre la creatividad y el disfrute; ayuda a relajar el abdomen bajo y a fluir con las emociones.", affirmation: "Mi creatividad y emociones fluyen en equilibrio.", objective: "Emociones, creatividad, relación con otros, necesidades y placeres", freq: 417 },
  { id: "solar", name: "Plexo solar", color: "#EAB308", colorName: "amarilla", position: "el plexo solar", zone: "Abdomen superior", placement: "Descansa las manos sobre la boca del estómago, debajo de las costillas.", benefits: "Fortalece la confianza y la voluntad; ayuda a aliviar el nerviosismo que se siente en el estómago.", affirmation: "Mi poder personal resplandece sin esfuerzo.", objective: "Voluntad, energía, mente, poder y libertad propia", freq: 528 },
  { id: "heart", name: "Corazón", color: "#22C55E", colorName: "verde esmeralda", position: "el centro del pecho", zone: "Centro del pecho", placement: "Cruza o junta ambas manos sobre el centro del pecho.", benefits: "Invita a la compasión y el equilibrio emocional; ayuda a liberar tristeza y abrir el pecho a la calma.", affirmation: "Soy amor y me abro a recibir.", objective: "Amor, respeto, autoestima, sanación y tolerancia", freq: 639 },
  { id: "throat", name: "Garganta", color: "#8B5CF6", colorName: "violeta", position: "la garganta", zone: "Cuello", placement: "Ahueca las manos sobre la garganta sin ejercer presión directa.", benefits: "Favorece la expresión y la comunicación; ayuda a soltar la tensión acumulada en cuello y mandíbula.", affirmation: "Mi voz es verdad y me expreso con libertad.", objective: "Comunicación interna y externa, habla y auto-expresión", freq: 741 },
  { id: "third_eye", name: "Tercer ojo", color: "#A78BFA", colorName: "índigo", position: "entre las cejas", zone: "Frente y ojos", placement: "Cubre suavemente los ojos o coloca una mano en la frente y otra en la nuca.", benefits: "Apoya la intuición y la concentración; ayuda a aliviar la tensión ocular y el exceso de pensamientos.", affirmation: "Mi intuición es clara y confío en ella.", objective: "Intuición, imaginación y percepción extrasensorial", freq: 852 },
  { id: "crown", name: "Corona", color: "#D8B4FE", colorName: "violeta claro", position: "la coronilla", zone: "Cabeza", placement: "Apoya las manos suavemente sobre la coronilla o a los lados de la cabeza.", benefits: "Favorece la conexión espiritual, la claridad mental y la sensación de calma profunda.", affirmation: "Me abro a la conexión con algo más grande que yo.", objective: "Conexión con lo divino y la espiritualidad", freq: 963 },
];

export function buildChakraScript(selectedIds) {
  const opening = { seconds: 30, text: "Comienza con tres respiraciones profundas. Inhala calma, exhala cualquier tensión acumulada." };
  const steps = (selectedIds || []).map((id) => {
    const c = CHAKRAS.find((x) => x.id === id);
    return { seconds: 45, text: `Dirige la atención a ${c.position}. Visualiza una luz ${c.colorName} que gira lentamente. ${c.affirmation}` };
  });
  const closing = { seconds: 40, text: "Deja que todas las luces fluyan juntas. Eres un canal de energía. Permite que la sanación ocurra. Agradece a tu cuerpo y regresa lentamente." };
  return { title: "Terapia de chakras", subtitle: "Personalizada", steps: [opening, ...steps, closing] };
}