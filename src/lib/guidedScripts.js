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
  intermediate: {
    title: "Equilibrio de chakras",
    subtitle: "Profundiza tu práctica Reiki",
    steps: [
      { seconds: 35, text: "Comienza con tres respiraciones profundas. Inhala calma, exhala cualquier tensión acumulada." },
      { seconds: 45, text: "Dirige tu atención a la base de la columna. Visualiza un disco de luz roja que gira lentamente. Es tu raíz." },
      { seconds: 45, text: "Sube al abdomen. Imagina un disco naranja brillante. Siente tu creatividad y emociones fluir en equilibrio." },
      { seconds: 45, text: "En el plexo solar, un sol amarillo. Tu poder personal, tu voluntad, resplandecen sin esfuerzo." },
      { seconds: 45, text: "En el centro del pecho, una luz verde esmeralda. Ábrela con cada respiración. Eres amor." },
      { seconds: 45, text: "En la garganta, un cielo azul claro. Tu voz es verdad. Permítete expresar y escucharte." },
      { seconds: 45, text: "Entre las cejas, un índigo profundo. Tu intuición se afina, ves con claridad interior." },
      { seconds: 45, text: "En la corona, una luz violeta que se abre hacia arriba. Conectas con algo más grande que tú." },
      { seconds: 50, text: "Deja que todas las luces fluyan juntas. Eres un canal de energía. Permite que la sanación ocurra." },
      { seconds: 40, text: "Agradece a tu cuerpo y a tu práctica. Regresa lentamente, integrando esta energía." },
    ],
  },
};