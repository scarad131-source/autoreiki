import { ArrowUpRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeGreetingCard({ name }) {
  const navigate = useNavigate();
  return (
    <section className="rounded-2xl border border-white/10 bg-card/80 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Tu práctica de hoy</p>
          <h3 className="text-2xl font-display font-semibold mt-1 leading-tight">Hola, {name}</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Elige una acción. AutoReiki organiza el resto para que practiques sin improvisar.
          </p>
        </div>
        <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div>
      <button
        onClick={() => navigate("/configurar")}
        className="w-full mt-4 rounded-xl bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-semibold py-3.5 flex items-center justify-center gap-2 neon-glow active:scale-[0.99] transition-transform">
        Preparar mi sesión
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </section>
  );
}