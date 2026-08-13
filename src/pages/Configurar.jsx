import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import ChakraFigure from "@/components/ChakraFigure";
import { CHAKRAS } from "@/lib/guidedScripts";

const DURATIONS = [5, 10, 15, 20, 30, 45];
// Mostrar de corona (arriba) a raíz (abajo) como en la referencia.
const ORDERED = [...CHAKRAS].reverse();

export default function Configurar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [minutes, setMinutes] = useState(10);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const start = () => {
    if (!selected.length) return;
    navigate("/meditar", {
      state: {
        preset: {
          mode: "guided",
          level: "intermediate",
          audio: "healing",
          minutes,
          chakras: selected,
        },
      },
    });
  };

  return (
    <div className="space-y-7">
      <header className="text-center pt-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Terapia personalizada</h1>
        <p className="text-sm text-muted-foreground mt-1">Toca los chakras que quieras trabajar</p>
      </header>

      <ChakraFigure selected={selected} onToggle={toggle} />

      {/* lista de objetivos por chakra (corona → raíz) */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          ¿Qué resuelve cada chakra?
        </h3>
        {ORDERED.map((c) => {
          const isSel = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                isSel ? "bg-accent/60" : "border-glow/20 bg-card/50"
              }`}
              style={isSel ? { borderColor: c.color, boxShadow: `0 0 18px ${c.color}33` } : {}}
            >
              <span
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: isSel ? c.color : `${c.color}22`, boxShadow: isSel ? `0 0 12px ${c.color}88` : "none" }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: isSel ? "#fff" : c.color }} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{c.objective}</p>
              </div>
            </button>
          );
        })}
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Duración
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setMinutes(d)}
              className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                minutes === d
                  ? "border-primary bg-accent text-primary neon-glow"
                  : "border-glow/20 bg-card/50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={start}
        disabled={!selected.length}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        {selected.length
          ? `Iniciar terapia · ${selected.length} chakra${selected.length > 1 ? "s" : ""}`
          : "Selecciona al menos un chakra"}
        {selected.length ? <ArrowRight className="w-4 h-4" /> : null}
      </button>
    </div>
  );
}