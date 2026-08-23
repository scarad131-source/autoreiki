import { Brain, HeartPulse, Sparkles, Moon, Shield, Wind } from "lucide-react";

const PSICOLOGICOS = [
{ icon: Sparkles, title: "Reducción del estrés y la ansiedad", desc: "Baja los niveles de cortisol (hormona del estrés)." },
{ icon: Brain, title: "Mayor claridad mental", desc: "Ayuda a tomar decisiones con calma y menos reactividad." },
{ icon: HeartPulse, title: "Mejor regulación emocional", desc: "Aprendes a observar tus pensamientos sin dejarte arrastrar por ellos." },
{ icon: Sparkles, title: "Incremento de empatía y compasión", desc: "Hacia ti mismo y hacia los demás." }];


const FISICOS = [
{ icon: Moon, title: "Mejora del sueño", desc: "Disminuye el insomnio y favorece un descanso profundo." },
{ icon: Shield, title: "Fortalecimiento del sistema inmunológico", desc: "La práctica constante apoya la salud general." },
{ icon: Wind, title: "Relajación corporal", desc: "Reduce tensión muscular y mejora la respiración." }];


const CEREBRALES = [
"Neuroplasticidad: el cerebro crea nuevas conexiones y hábitos.",
"Mayor densidad de materia gris en el hipocampo (memoria) y corteza prefrontal (atención y control emocional).",
"Reducción del volumen de la amígdala, lo que disminuye la respuesta de miedo."];


function Card({ item }) {
  const Icon = item.icon;
  return (
    <div className="rounded-2xl border border-white/5 bg-card/60 p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary shrink-0">
          <Icon className="w-4 h-4" />
        </span>
        <div>
          <p className="font-medium text-sm">{item.title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>);

}

export default function JourneyBenefits() {
  return (
    <section className="space-y-6 rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/5 to-transparent p-5 neon-glow">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-primary font-medium">Reto de 21 días</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight mt-1.5">
          Beneficios principales de meditar 21 días seguidos
        </h2>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Beneficios psicológicos y emocionales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PSICOLOGICOS.map((item) =>
          <Card key={item.title} item={item} />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Beneficios físicos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FISICOS.map((item) =>
          <Card key={item.title} item={item} />
          )}
        </div>
      </div>

      












      
    </section>);

}