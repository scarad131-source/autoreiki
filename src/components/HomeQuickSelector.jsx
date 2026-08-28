import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TIMES = [15, 30, 45];

export default function HomeQuickSelector({ level }) {
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState(15);

  const handleMeditate = () => {
    navigate("/configurar", { state: { minutes } });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-card/80 p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-primary">Selector rápido</p>
      <h3 className="text-lg font-semibold mt-1">¿Qué necesitas hoy?</h3>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Tengo</p>
        <div className="flex flex-wrap gap-2">
          {TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setMinutes(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                minutes === t
                  ? "bg-gradient-to-r from-amber-light to-primary text-primary-foreground"
                  : "border border-white/10 bg-background/60 text-foreground hover:border-primary/40"
              }`}>
              {t} min
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleMeditate}
        className="w-full mt-5 rounded-xl bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-semibold py-3.5 flex items-center justify-center gap-2 neon-glow active:scale-[0.99] transition-transform">
        MEDITAR
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}