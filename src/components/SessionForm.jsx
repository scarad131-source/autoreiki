import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import ChakraFigure from "@/components/ChakraFigure";

const TYPES = [
  { id: "meditation", name: "Meditación", desc: "Calma mental y respiración consciente" },
  { id: "reiki", name: "Sesión de Reiki", desc: "Sanación por chakras con cuencos" },
];

const MODES = [
  { id: "guided", name: "Guiada", desc: "Voz interior que te acompasa paso a paso" },
  { id: "unguided", name: "No guiada", desc: "Solo tú, tu respiración y el sonido" },
];

const LEVELS = [
  { id: "beginner", name: "Principiante", desc: "Base suave para empezar" },
  { id: "intermediate", name: "Intermedio", desc: "Profundiza con chakras" },
];

const DURATIONS_BY_TYPE = {
  meditation: [5, 10, 30],
  reiki: [30, 45, 60, 90],
};

export default function SessionForm({ onStart, initialTipo }) {
  const [tipo, setTipo] = useState(initialTipo || "meditation");
  const [mode, setMode] = useState("guided");
  const [level, setLevel] = useState("beginner");
  const [minutes, setMinutes] = useState(10);
  const [chakras, setChakras] = useState([]);

  const durations = DURATIONS_BY_TYPE[tipo];

  const selectTipo = (id) => {
    setTipo(id);
    setMinutes(DURATIONS_BY_TYPE[id][0]);
    setChakras([]);
  };

  const toggleChakra = (id) =>
    setChakras((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const start = () => {
    if (tipo === "reiki" && !chakras.length) return;
    onStart({
      tipo,
      mode,
      level,
      audio: tipo === "reiki" ? "healing" : "beach",
      minutes,
      chakras: tipo === "reiki" ? chakras : [],
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Tipo de sesión</h2>
        <div className="grid grid-cols-2 gap-3">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTipo(t.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                tipo === t.id
                  ? "border-primary bg-accent neon-glow"
                  : "border-glow/20 bg-card/50 hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{t.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Modo</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                mode === m.id
                  ? "border-primary bg-accent neon-glow"
                  : "border-glow/20 bg-card/50 hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{m.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Nivel</h2>
        <div className="grid grid-cols-2 gap-3">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                level === l.id
                  ? "border-primary bg-accent neon-glow"
                  : "border-glow/20 bg-card/50 hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm">{l.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{l.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Duración
        </h2>
        <div className={`grid gap-2.5 ${tipo === "reiki" ? "grid-cols-4" : "grid-cols-3"}`}>
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setMinutes(d)}
              className={`py-3 rounded-2xl border text-sm font-medium transition-all ${
                minutes === d
                  ? "border-primary bg-accent text-primary neon-glow"
                  : "border-glow/20 bg-card/50 text-foreground hover:border-primary/50"
              }`}
            >
              {d} min
            </button>
          ))}
        </div>
      </section>

      {tipo === "reiki" && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Chakras</h2>
          <ChakraFigure selected={chakras} onToggle={toggleChakra} />
          <p className="text-center text-sm text-muted-foreground mt-3">
            <span className="text-primary font-semibold">{chakras.length}</span> de 7 zonas elegidas
          </p>
        </section>
      )}

      <button
        onClick={start}
        disabled={tipo === "reiki" && !chakras.length}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {tipo === "reiki" && !chakras.length
          ? "Selecciona al menos un chakra"
          : `Comenzar ${tipo === "reiki" ? "Reiki" : "meditación"}`}
        {!(tipo === "reiki" && !chakras.length) && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}