// Guiones de meditación guiada por nivel. Cada paso dura `seconds` segundos.

export const GUIDED_SCRIPTS = {
  beginner: {
    title: "Introducción a la calma",
    subtitle: "Ideal para tus primeras sesiones",
    steps: [
      { seconds: 40, text: "Siéntate cómodamente. Cierra los ojos suavemente y deja que tu cuerpo se acomode en su posición natural." },
      { seconds: 40, text: "Lleva la atención a tu respiración. No la cambies, solo obsérvala. Entra… y sale." },
      { seconds: 45, text: "Coloca una mano en el pecho y otra en el abdomen. Siente cómo se elevan al inhalar y se relajan al exhalar." },
      { seconds: 45, text: "Inhala contando hasta cuatro… y exhala contando hasta seis. Deja que la exhalación sea más larga." },
      { seconds: 50, text: "Imagina una luz suave en el centro del pecho. Con cada respiración, esa luz crece un poco más." },
      { seconds: 50, text: "Si aparece un pensamiento, no lo juzgues. Obsérvalo como una nube que pasa y vuelve a tu respiración." },
      { seconds: 45, text: "Repite en silencio: «Estoy en calma. Estoy a salvo. Estoy en paz»." },
      { seconds: 40, text: "Deja que la respiración vuelva a su ritmo natural. Solo reposa aquí, en este instante." },
      { seconds: 35, text: "Poco a poco, toma conciencia de tu cuerpo, de la superficie donde estás sentado." },
      { seconds: 30, text: "Cuando estés listo, abre los ojos suavemente. Lleva esta calma contigo." },
    ],
  },
  beginner2: {
    title: "Relajación profunda",
    subtitle: "Suelta tensiones paso a paso",
    steps: [
      { seconds: 40, text: "Siéntate o acuéstate cómodamente. Cierra los ojos y respira profundo tres veces." },
      { seconds: 45, text: "Lleva la atención a los pies. Suelta cualquier tensión que encuentres. Se vuelven pesados y cálidos." },
      { seconds: 45, text: "Sube por las piernas, las caderas, el abdomen. Cada zona se relaja al exhalar." },
      { seconds: 45, text: "Siente la espalda, los hombros. Deja que caigan, sin sostener nada. Suelta el peso del día." },
      { seconds: 45, text: "Relaja brazos, manos, cuello y rostro. Afloja la mandíbula y el espacio entre las cejas." },
      { seconds: 50, text: "Ahora todo el cuerpo reposa. Respira y con cada exhalación, suéltate un poco más." },
      { seconds: 50, text: "Repite en silencio: «Me permito descansar. Estoy en paz. Todo está bien»." },
      { seconds: 40, text: "Reposa en esta quietud. No hay nada que hacer, solo estar." },
      { seconds: 35, text: "Poco a poco, vuelve a sentir tu cuerpo y el ritmo de tu respiración." },
      { seconds: 30, text: "Cuando estés listo, abre los ojos suavemente, llevando esta calma contigo." },
    ],
  },
  intermediate: {
    title: "Equilibrio de chakras",
    subtitle: "Profundiza tu práctica Reiki",
    steps: [
      { seconds: 35, text: "Comienza con tres respiraciones profundas. Inhala calma, exhala cualquier tensión acumulada." },
      { seconds: 45, bowl: true, bowlFreq: 396, text: "Dirige tu atención a la base de la columna. Visualiza un disco de luz roja que gira lentamente. Es tu raíz." },
      { seconds: 45, bowl: true, bowlFreq: 417, text: "Sube al abdomen. Imagina un disco naranja brillante. Siente tu creatividad y emociones fluir en equilibrio." },
      { seconds: 45, bowl: true, bowlFreq: 528, text: "En el plexo solar, un sol amarillo. Tu poder personal, tu voluntad, resplandecen sin esfuerzo." },
      { seconds: 45, bowl: true, bowlFreq: 639, text: "En el centro del pecho, una luz verde esmeralda. Ábrela con cada respiración. Eres amor." },
      { seconds: 45, bowl: true, bowlFreq: 741, text: "En la garganta, un cielo azul claro. Tu voz es verdad. Permítete expresar y escucharte." },
      { seconds: 45, bowl: true, bowlFreq: 852, text: "Entre las cejas, un índigo profundo. Tu intuición se afina, ves con claridad interior." },
      { seconds: 45, bowl: true, bowlFreq: 963, text: "En la corona, una luz violeta que se abre hacia arriba. Conectas con algo más grande que tú." },
      { seconds: 50, text: "Deja que todas las luces fluyan juntas. Eres un canal de energía. Permite que la sanación ocurra." },
      { seconds: 40, text: "Agradece a tu cuerpo y a tu práctica. Regresa lentamente, integrando esta energía." },
    ],
  },
};

export const CHAKRAS = [
  { id: "root", name: "Raíz", color: "#FF0000", colorName: "roja", position: "la base de la columna", affirmation: "Estoy a salvo y enraizado.", objective: "Bases en la vida, supervivencia, seguridad, instinto y temores", freq: 396 },
  { id: "sacral", name: "Sacro", color: "#FF8000", colorName: "naranja", position: "el bajo abdomen", affirmation: "Mi creatividad y emociones fluyen en equilibrio.", objective: "Emociones, creatividad, relación con otros, necesidades y placeres", freq: 417 },
  { id: "solar", name: "Plexo solar", color: "#FFFF00", colorName: "amarilla", position: "el plexo solar", affirmation: "Mi poder personal resplandece sin esfuerzo.", objective: "Voluntad, energía, mente, poder y libertad propia", freq: 528 },
  { id: "heart", name: "Corazón", color: "#00FF00", colorName: "verde esmeralda", position: "el centro del pecho", affirmation: "Soy amor y me abro a recibir.", objective: "Amor, respeto, autoestima, sanación y tolerancia", freq: 639 },
  { id: "throat", name: "Garganta", color: "#00BFFF", colorName: "azul cielo", position: "la garganta", affirmation: "Mi voz es verdad y me expreso con libertad.", objective: "Comunicación interna y externa, habla y auto-expresión", freq: 741 },
  { id: "third_eye", name: "Tercer ojo", color: "#4B0082", colorName: "índigo", position: "entre las cejas", affirmation: "Mi intuición es clara y confío en ella.", objective: "Intuición, imaginación y percepción extrasensorial", freq: 852 },
  { id: "crown", name: "Corona", color: "#8000FF", colorName: "violeta", position: "la coronilla", affirmation: "Me abro a la conexión con algo más grande que yo.", objective: "Conexión con lo divino y la espiritualidad", freq: 963 },
];

export function buildChakraScript(selectedIds) {
  const opening = { seconds: 30, text: "Comienza con tres respiraciones profundas. Inhala calma, exhala cualquier tensión acumulada." };
  const steps = (selectedIds || []).map((id) => {
    const c = CHAKRAS.find((x) => x.id === id);
    return { seconds: 45, bowl: true, bowlFreq: c.freq, text: `Dirige la atención a ${c.position}. Visualiza una luz ${c.colorName} que gira lentamente. ${c.affirmation}` };
  });
  const closing = { seconds: 40, text: "Deja que todas las luces fluyan juntas. Eres un canal de energía. Permite que la sanación ocurra. Agradece a tu cuerpo y regresa lentamente." };
  return { title: "Terapia de chakras", subtitle: "Personalizada", steps: [opening, ...steps, closing] };
}