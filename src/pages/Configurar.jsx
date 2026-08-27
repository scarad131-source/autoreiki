import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import ChakraFigure from "@/components/ChakraFigure";
import { AUDIO_SOURCES } from "@/lib/audioSources";
import { CHAKRAS } from "@/lib/guidedScripts";

const MODES = [
{ id: "guided", name: "GUIADA - Principiante", desc: "Audio con voz que te guía durante tu meditación", color: "#00C698" },
{ id: "unguided", name: "NO GUIADA - Avanzado", desc: "Solo tú, tu respiración y el sonido", color: "#FF7A00" }];


export default function Configurar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState("guided");
  const [level, setLevel] = useState("intermediate");
  const [minutes, setMinutes] = useState(30);
  const [audio, setAudio] = useState("bowls");

  const toggle = (id) => {
    if (mode === "guided") return;
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  const selectAll = () => setSelected(CHAKRAS.map((c) => c.id));

  // Guiada: selecciona automáticamente todos los chakras. No guiada: limpia la selección.
  useEffect(() => {
    if (mode === "guided") {
      setSelected(CHAKRAS.map((c) => c.id));
    } else {
      setSelected([]);
    }
  }, [mode]);

  const start = () => {
    if (!selected.length) return;
    navigate("/meditar", {
      state: {
        preset: {
          mode,
          level,
          audio: mode === "unguided" ? audio : "reikiGuided",
          minutes,
          chakras: selected
        }
      }
    });
  };

  return (
    <div className="space-y-7">
      <div className="flex items-center -ml-1">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Atrás">
          
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <header className="text-center pt-0">
        <h1 className="font-display text-[33px] font-semibold tracking-tight">Sesión de Reiki</h1>
        <p className="text-sm text-muted-foreground mt-1">Toca los chakras que quieras trabajar</p>
      </header>

      <h2 className="text-sm font-semibold">Zonas a tratar</h2>

      <ChakraFigure selected={selected} onToggle={toggle} onSelectAll={selectAll} selectAllEnabled={mode === "unguided"} />

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Elige tipo de terapia</h2>
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
                className={`flex flex-col items-center justify-center text-center min-h-[80px] px-3 py-3 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] ${
                active ? "scale-[1.01]" : "hover:opacity-80"}`
                }>
              <p className="tracking-tight font-normal [font-family:'Aether',_sans-serif] text-lg" style={{ color: m.color }}>{m.name}</p>
              <p className="text-muted-foreground mt-1 leading-snug max-w-[140px] text-sm">{m.desc}</p>
            </button>);

          })}
        </div>
      </section>

      {mode === "unguided" &&
      <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Elige tu tiempo de sesión</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[20, 30, 45, 60, 90].map((d) =>
          <button
            key={d}
            onClick={() => setMinutes(d)}
            className={`w-14 h-14 rounded-full border text-xs font-medium transition-all flex items-center justify-center ${
            minutes === d ? "border-primary bg-accent text-primary neon-glow" : "border-glow/20 bg-card/50 text-foreground hover:border-primary/50"}`
            }>
                {d}
              </button>
          )}
          </div>
        </section>
      }

      {mode === "unguided" &&
      <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Sonido ambiente</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(AUDIO_SOURCES).filter((a) => a.id !== "meditation21" && a.id !== "reikiGuided").map((a) =>
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