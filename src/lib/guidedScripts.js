// Guiones de meditación guiada enfocados en liberación emocional y preparación para Reiki.
// Tres versiones ajustadas a sesiones de 5, 10 y 20 minutos. La voz guía es lenta y con
// énfasis en respirar conscientemente para calmar los nervios y la mente; entre cada frase
// hay espacios de silencio (el resto de la sesión queda solo con la ambientación elegida).

export const RELEASE_SCRIPTS = {
  min5: {
    title: "Liberación emocional · Preparación para Reiki",
    subtitle: "Voz para 5 minutos",
    steps: [
      { seconds: 18, text: "Bienvenida. Cierra los ojos y respira… muy despacio. Deja que el aire te calme." },
      { seconds: 20, text: "Inhala suave… y exhala cualquier tensión. Sigue respirando, sin prisa." },
      { seconds: 22, text: "Si los nervios se agitan, no los pelees. Solo respira por ellos, con calma." },
      { seconds: 22, text: "Cada respiración lenta apacigua tu mente. Sigue respirando, conscientemente." },
      { seconds: 22, text: "Si hay una emoción pesada, obsérvala con ternura… y déjala ir al exhalar." },
      { seconds: 22, text: "No retienes nada. Estás a salvo soltando lo que ya no te nutre." },
      { seconds: 24, text: "Prepara tu cuerpo para recibir. Eres un canal sereno, dispuesta a sanar." },
    ],
  },
  min10: {
    title: "Liberación emocional · Preparación para Reiki",
    subtitle: "Voz para 10 minutos",
    steps: [
      { seconds: 24, text: "Bienvenida. Cierra los ojos y respira… muy despacio. Deja que el aire te calme." },
      { seconds: 26, text: "Inhala suave… y exhala cualquier tensión del día. Sigue respirando, sin prisa." },
      { seconds: 28, text: "Lleva la atención a los hombros, al rostro. Al exhalar, déjalos descansar." },
      { seconds: 30, text: "Si los nervios se agitan, no los pelees. Solo respira por ellos, con calma." },
      { seconds: 30, text: "Cada respiración lenta apacigua tu mente. Sigue respirando, conscientemente." },
      { seconds: 32, text: "Si hay una emoción pesada, mírala con ternura… y déjala ir al exhalar." },
      { seconds: 32, text: "No hace falta retener nada. Permítete soltar. Estás a salvo dejando ir." },
      { seconds: 32, text: "Imagina una luz cálida en el pecho que crece con cada respiración serena." },
      { seconds: 32, text: "Ese espacio es paz y claridad. Sigue respirando despacio, en esta quietud." },
      { seconds: 34, text: "Prepara tu cuerpo y tu energía para recibir. Eres un canal limpio, dispuesta a sanar." },
    ],
  },
  min20: {
    title: "Liberación emocional · Preparación para Reiki",
    subtitle: "Voz para 20 minutos",
    steps: [
      { seconds: 32, text: "Bienvenida. Cierra los ojos y respira… muy despacio. Deja que el aire te calme." },
      { seconds: 34, text: "Inhala suave… y exhala cualquier tensión del día. Sigue respirando, sin prisa." },
      { seconds: 36, text: "Lleva la atención a los pies, a las piernas, al abdomen. Al exhalar, déjalos descansar." },
      { seconds: 38, text: "Siente el calor de tu mano sobre el pecho. Tu propia presencia te acompaña." },
      { seconds: 40, text: "Si los nervios se agitan, no los pelees. Solo respira por ellos, con calma." },
      { seconds: 40, text: "Cada respiración lenta apacigua tu mente. Sigue respirando, conscientemente." },
      { seconds: 42, text: "Si hay una emoción pesada, mírala con ternura… y déjala ir al exhalar." },
      { seconds: 42, text: "Pregúntale qué quiere decirte. Escucha sin juzgar. Solo respira y acompáñala." },
      { seconds: 42, text: "No hace falta retener nada. Permítete soltar. Estás a salvo dejando ir." },
      { seconds: 42, text: "Imagina una luz cálida en el pecho que crece con cada respiración serena." },
      { seconds: 44, text: "Ese espacio es paz y claridad. Sigue respirando despacio, en esta quietud." },
      { seconds: 48, text: "Prepara tu cuerpo y tu energía para recibir. Eres un canal limpio, dispuesta a sanar." },
    ],
  },
};

export const CHAKRAS = [
  { id: "root", name: "Raíz", sanskrit: "Muladhara", color: "#EF4444", colorName: "roja", position: "la base de la columna", zone: "Pelvis", placement: "Coloca las manos en forma de V sobre la pelvis o los muslos superiores.", benefits: "Aporta enraizamiento y seguridad; ayuda a calmar el miedo y a sentir estabilidad en el cuerpo.", affirmation: "Estoy a salvo y enraizado.", objective: "Bases en la vida, supervivencia, seguridad, instinto y temores", freq: 396 },
  { id: "sacral", name: "Sacro", sanskrit: "Svadhisthana", color: "#F97316", colorName: "naranja", position: "el bajo abdomen", zone: "Abdomen bajo", placement: "Deja las manos sobre el abdomen bajo, justo debajo del ombligo.", benefits: "Nutre la creatividad y el disfrute; ayuda a relajar el abdomen bajo y a fluir con las emociones.", affirmation: "Mi creatividad y emociones fluyen en equilibrio.", objective: "Emociones, creatividad, relación con otros, necesidades y placeres", freq: 417 },
  { id: "solar", name: "Plexo solar", sanskrit: "Manipura", color: "#EAB308", colorName: "amarilla", position: "el plexo solar", zone: "Abdomen superior", placement: "Descansa las manos sobre la boca del estómago, debajo de las costillas.", benefits: "Fortalece la confianza y la voluntad; ayuda a aliviar el nerviosismo que se siente en el estómago.", affirmation: "Mi poder personal resplandece sin esfuerzo.", objective: "Voluntad, energía, mente, poder y libertad propia", freq: 528 },
  { id: "heart", name: "Corazón", sanskrit: "Anahata", color: "#22C55E", colorName: "verde esmeralda", position: "el centro del pecho", zone: "Centro del pecho", placement: "Cruza o junta ambas manos sobre el centro del pecho.", benefits: "Invita a la compasión y el equilibrio emocional; ayuda a liberar tristeza y abrir el pecho a la calma.", affirmation: "Soy amor y me abro a recibir.", objective: "Amor, respeto, autoestima, sanación y tolerancia", freq: 639 },
  { id: "throat", name: "Garganta", sanskrit: "Vishuddha", color: "#8B5CF6", colorName: "violeta", position: "la garganta", zone: "Cuello", placement: "Ahueca las manos sobre la garganta sin ejercer presión directa.", benefits: "Favorece la expresión y la comunicación; ayuda a soltar la tensión acumulada en cuello y mandíbula.", affirmation: "Mi voz es verdad y me expreso con libertad.", objective: "Comunicación interna y externa, habla y auto-expresión", freq: 741 },
  { id: "third_eye", name: "Tercer ojo", sanskrit: "Ajna", color: "#A78BFA", colorName: "índigo", position: "entre las cejas", zone: "Frente y ojos", placement: "Cubre suavemente los ojos o coloca una mano en la frente y otra en la nuca.", benefits: "Apoya la intuición y la concentración; ayuda a aliviar la tensión ocular y el exceso de pensamientos.", affirmation: "Mi intuición es clara y confío en ella.", objective: "Intuición, imaginación y percepción extrasensorial", freq: 852 },
  { id: "crown", name: "Corona", sanskrit: "Sahasrara", color: "#D8B4FE", colorName: "violeta claro", position: "la coronilla", zone: "Cabeza", placement: "Apoya las manos suavemente sobre la coronilla o a los lados de la cabeza.", benefits: "Favorece la conexión espiritual, la claridad mental y la sensación de calma profunda.", affirmation: "Me abro a la conexión con algo más grande que yo.", objective: "Conexión con lo divino y la espiritualidad", freq: 963 },
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