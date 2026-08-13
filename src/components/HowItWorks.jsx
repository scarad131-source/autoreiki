import { Route, Headphones, Timer, BookOpen } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

const FEATURES = [
  { icon: Route, title: "Te guía paso a paso", body: "Practica con seguridad, incluso si estás comenzando." },
  { icon: Headphones, title: "Prepara mente y energía", body: "Limpieza de aura y meditación antes de cada sesión." },
  { icon: Timer, title: "Organiza cada sesión", body: "Temporizador de 15 a 90 min con cuencos o campanas." },
  { icon: BookOpen, title: "Registra tu evolución", body: "Recordatorios, agenda y diario de progreso." },
];

export default function HowItWorks() {
  return (
    <section className="space-y-5">
      <div className="text-center">
        <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Cómo funciona</h2>
        <p className="font-display text-2xl font-semibold tracking-tight mt-1">¿Qué hace AutoReiki por ti?</p>
      </div>

      <div className="rounded-3xl overflow-hidden neon-border">
        <Image src={IMAGES.howItWorks} alt="Qué hace AutoReiki por ti" className="w-full aspect-square" fittingType="fill" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="p-4 rounded-2xl border border-glow/20 bg-card/60 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-2.5">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-medium text-sm">{f.title}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-glow/40" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Practica a tu ritmo</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-glow-cyan/40" />
      </div>
    </section>
  );
}