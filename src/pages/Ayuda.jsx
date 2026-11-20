import { Clock, Pause, Brain, PersonStanding } from "lucide-react";

const TIPS = [
  {
    icon: Clock,
    title: "Miro el reloj y me distraigo",
    body: "Confía en el aviso de cada cambio de zona. Puedes mantener los ojos cerrados y dejar que el ritmo te sostenga.",
  },
  {
    icon: Pause,
    title: "Tuve que interrumpir la sesión",
    body: "No pasa nada ni pierdes el efecto. Al volver, coloca tus manos sobre el corazón durante dos minutos para cerrar con calma.",
  },
  {
    icon: Brain,
    title: "No logro acallar la mente",
    body: "No hay que vaciar la mente: basta con volver, sin juicio, cada vez que te des cuenta de que te fuiste. Elige la opción que te resulte más fácil hoy.",
    options: [
      "Nombra lo que llega en voz baja: «pensamiento», «ruido», «prisa». Nombrarlo lo afloja y te devuelve al sonido.",
      "Deja que el pensamiento pase como una nube y regresa a la respiración, sin pelear con él.",
      "Cuenta las respiraciones del 1 al 10 y empieza otra vez. Cuando pierdas la cuenta, ese momento ya es meditación.",
      "Apoya las manos sobre el pecho y siente cómo se mueve al respirar: el cuerpo te ancla cuando la cabeza no para.",
      "Elige una sesión no guiada de 10 minutos con sonido ambiente y limítate a escuchar. Menos instrucciones, menos exigencia.",
      "Si hoy hay demasiado ruido interno, acorta: termina antes de tiempo y guarda la sesión. La constancia importa más que la duración.",
    ],
  },
  {
    icon: PersonStanding,
    title: "Me cansé de una postura",
    body: "El confort es esencial. Cambia la posición o apoya los brazos en cojines; esta práctica no exige rigidez.",
  },
];

export default function Ayuda() {
  return (
    <div className="space-y-6">
      <header className="pt-2 text-center">
        <h1 className="font-display !text-3xl font-semibold neon-text">Ayuda</h1>
      </header>

      <section>
        <h2 className="font-display text-3xl font-semibold tracking-tight">Sin hacerlo perfecto</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Respuestas sencillas para que una duda no se convierta en una barrera.
        </p>
      </section>

      <div className="space-y-3">
        {TIPS.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.title} className="rounded-2xl bg-card border border-white/5 p-4 flex gap-3">
              <Icon className="w-5 h-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">{t.title}</p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{t.body}</p>
                {t.options && (
                  <ul className="mt-3 space-y-2">
                    {t.options.map((o) => (
                      <li key={o} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}