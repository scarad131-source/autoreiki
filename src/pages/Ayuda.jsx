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
    body: "No luches contra los pensamientos. Activa la meditación de 5 minutos en la preparación y vuelve una y otra vez a la respiración.",
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
      <header className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">Ayuda</h1>
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}