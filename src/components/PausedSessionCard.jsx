import { Play, RotateCcw } from "lucide-react";

export default function PausedSessionCard({ elapsed, onResume, onRestart }) {
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <section className="rounded-2xl border border-primary/40 bg-accent/40 p-4 purple-glow">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Sesión pausada</p>
          <p className="text-sm text-foreground/90 mt-0.5">Retoma donde te quedaste</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-display font-light tabular-nums text-primary leading-none">{mm}:{ss}</p>
          <p className="text-[10px] text-muted-foreground mt-1">min transcurridos</p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onResume}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Play className="w-4 h-4" /> Continuar
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-2.5 rounded-xl border border-white/15 bg-card/60 text-foreground font-medium text-sm flex items-center justify-center gap-2 hover:border-primary/40 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </button>
      </div>
    </section>
  );
}