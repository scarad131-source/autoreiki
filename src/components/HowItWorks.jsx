import { Route, Headphones, Timer, BookOpen } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

const FEATURES = [
{ icon: Route, title: "Te guía paso a paso", body: "Practica con seguridad, incluso si estás comenzando." },
{ icon: Headphones, title: "Prepara mente y energía", body: "Limpieza de aura y meditación antes de cada sesión." },
{ icon: Timer, title: "Organiza cada sesión", body: "Temporizador de 15 a 90 min con cuencos o campanas." },
{ icon: BookOpen, title: "Registra tu evolución", body: "Recordatorios, agenda y diario de progreso." }];


export default function HowItWorks() {
  return (
    <section className="space-y-5">
      <div className="text-center">
        
        
      </div>

      

      

      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((f) => null







        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-glow/40" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Practica a tu ritmo</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-glow-cyan/40" />
      </div>
    </section>);

}