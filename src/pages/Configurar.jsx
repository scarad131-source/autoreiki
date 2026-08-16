import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import ChakraFigure from "@/components/ChakraFigure";
import { AUDIO_SOURCES } from "@/lib/audioSources";
import { CHAKRAS } from "@/lib/guidedScripts";

const MODES = [
{ id: "guided", name: "Guiada", desc: "Voz interior que te acompasa paso a paso", color: "#00C698" },
{ id: "unguided", name: "No guiada", desc: "Solo tú, tu respiración y el sonido", color: "#FF7A00" }];


const LEVELS = [
{ id: "beginner", name: "Principiante", desc: "Base suave para empezar" },
{ id: "intermediate", name: "Intermedio", desc: "Profundiza con chakras" }];


const DURATIONS = [30, 60, 90];

export default function Configurar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState("guided");
  const [level, setLevel] = useState("intermediate");
  const [minutes, setMinutes] = useState(30);
  const [audio, setAudio] = useState("bowls");

  const toggle = (id) =>
  setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const selectAll = () => setSelected(CHAKRAS.map((c) => c.id));

  const start = () => {
    if (!selected.length) return;
    navigate("/meditar", {
      state: {
        preset: {
          mode,
          level,
          audio: mode === "unguided" ? audio : "healing",
          minutes,
          chakras: selected
        }
      }
    });
  };

  return (
    <div className="space-y-7">
      <header className="text-center pt-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Sesión de Reiki</h1>
        <p className="text-sm text-muted-foreground mt-1">Toca los chakras que quieras trabajar</p>
      </header>

      <ChakraFigure selected={selected} onToggle={toggle} />

      <div className="flex justify-center">
        <button
          onClick={selectAll}
          className="inline-flex py-2 px-4 rounded-full border border-primary/40 bg-card text-primary font-semibold text-xs uppercase tracking-[0.14em] hover:bg-accent transition-colors active:scale-[0.99]">
          Seleccionar todos
        </button>
      </div>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Modo</h2>
        <div className="grid grid-cols-2 gap-4">
          {MODES.map((m) => {
          const active = mode === m.id;
          return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              borderColor: m.color,
              background: "#1A1426",
              boxShadow: active ? `0 0 22px ${m.color}66, inset 0 0 14px ${m.color}22` : "none",
              opacity: active ? 1 : 0.55
            }}
            className={`flex flex-col items-center justify-center text-center min-h-[112px] px-4 py-5 rounded-full border-2 transition-all duration-300 active:scale-[0.98] ${
            active ? "scale-[1.01]" : "hover:opacity-80"}`
            }>
              <p className="font-display text-base font-semibold tracking-tight" style={{ color: m.color }}>{m.name}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug max-w-[140px]">{m.desc}</p>
            </button>
          );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Nivel</h2>
        <div className="grid grid-cols-2 gap-3">
          {LEVELS.map((l) =>
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            className={`text-left p-4 rounded-2xl border transition-all ${
            level === l.id ?
            "border-primary bg-accent neon-glow" :
            "border-glow/20 bg-card/50 hover:border-primary/50"}`
            }>
            
              <p className="font-medium text-sm">{l.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{l.desc}</p>
            </button>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Duración
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          {DURATIONS.map((d) =>
          <button
            key={d}
            onClick={() => setMinutes(d)}
            className={`py-3 rounded-2xl border text-sm font-medium transition-all ${
            minutes === d ?
            "border-primary bg-accent text-primary neon-glow" :
            "border-glow/20 bg-card/50 text-foreground hover:border-primary/50"}`
            }>
            
              {d}
            </button>
          )}
        </div>
      </section>

      {mode === "unguided" &&
      <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Sonido ambiente</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(AUDIO_SOURCES).map((a) =>
          <button
            key={a.id}
            onClick={() => setAudio(a.id)}
            className={`text-left p-4 rounded-2xl border transition-all ${
            audio === a.id ?
            "border-primary bg-accent neon-glow" :
            "border-glow/20 bg-card/50 hover:border-primary/50"}`
            }>
            
                <p className="font-medium text-sm">{a.name}</p>
              </button>
          )}
          </div>
        </section>
      }

      <p className="text-center text-sm text-muted-foreground mb-3">
        <span className="text-primary font-semibold">{selected.length}</span> de 7 zonas elegidas
      </p>

      <button
        onClick={start}
        disabled={!selected.length}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]">
        
        {selected.length ?
        `Iniciar terapia · ${selected.length} chakra${selected.length > 1 ? "s" : ""}` :
        "Selecciona al menos un chakra"}
        {selected.length ? <ArrowRight className="w-4 h-4" /> : null}
      </button>
    </div>);

}