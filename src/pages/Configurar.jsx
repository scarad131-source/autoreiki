import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Headphones, Waves, CloudRain, Trees, CircleDot } from "lucide-react";
import ChakraFigure from "@/components/ChakraFigure";
import PrepChecklist from "@/components/PrepChecklist";
import { AUDIO_SOURCES, audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { CHAKRAS } from "@/lib/guidedScripts";
import { sessionAudio } from "@/lib/sessionAudio";

const MODES = [
{ id: "guided", name: "GUIADA - Principiante", desc: "Audio con voz que te guía durante tu meditación", color: "#00C698", duration: 26 },
{ id: "unguided", name: "NO GUIADA - Avanzado", desc: "Solo tú, tu respiración y el sonido", color: "#FF7A00" }];


export default function Configurar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState("guided");
  const [level, setLevel] = useState("intermediate");
  const [minutes, setMinutes] = useState(30);
  const [audio, setAudio] = useState("beach");
  const [bowlsMarkers, setBowlsMarkers] = useState(false);

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
    const trackId = mode === "unguided" ? audio : "reikiGuided";
    // Desbloquea el audio dentro del gesto para que iOS permita reproducirlo.
    sessionAudio.unlock(audioUrlFor(trackId), { loop: !isVoiceTrack(trackId) });
    navigate("/meditar", {
      state: {
        preset: {
          mode,
          level,
          audio: trackId,
          minutes,
          chakras: selected,
          bowlsMarkers
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center -ml-1">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Atrás">
          
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <header className="text-center -mt-1">
        <h1 className="font-display font-semibold tracking-tight text-[hsl(var(--primary))] text-4xl">Sesión de Reiki</h1>
        <p className="text-sm text-muted-foreground mt-1">Toca los chakras que quieras trabajar</p>
      </header>

      <PrepChecklist />

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
                className={`flex items-center justify-between text-left min-h-[56px] px-3 py-2 rounded-xl border-2 transition-all duration-300 active:scale-[0.98] ${
                active ? "scale-[1.01]" : "hover:opacity-80"}`
                }>
              <div className="min-w-0 flex-1">
                <p className="tracking-tight font-normal [font-family:'Aether',_sans-serif] text-sm" style={{ color: m.color }}>{m.name}</p>
                <p className="text-muted-foreground mt-0.5 leading-tight text-[11px]">{m.desc}</p>
              </div>
              <span className="shrink-0 ml-2 pl-2 border-l border-white/10 text-xs font-semibold tabular-nums" style={{ color: m.color }}>
                {m.id === "guided" ? `${m.duration} Min` : `${minutes} Min`}
              </span>
            </button>);

          })}
        </div>
      </section>

      {mode === "unguided" &&
      <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Duración</h2>
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
      <section className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold leading-tight text-2xl text-[hsl(var(--primary))]">Ambiente sonoro</h2>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">Elige el paisaje que sostendrá tu práctica.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
          { id: "beach", icon: Waves, title: "Playa tranquila", desc: "Corriente tranquila con cantos espaciados" },
          { id: "rain", icon: CloudRain, title: "Lluvia relajante", desc: "Textura continua de baja intensidad" },
          { id: "forest", icon: Trees, title: "Bosque nocturno", desc: "Ambiente grave y sereno" },
          { id: "bowls", icon: CircleDot, title: "Frecuencias Sanadoras", desc: "Tono continuo de cuencos armónicos" }].
          map((s) => {
            const active = audio === s.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setAudio(s.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                active ?
                "border-primary bg-accent/60 neon-glow" :
                "border-white/10 bg-card/50 hover:border-primary/40"}`
                }>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-primary/20" : "bg-white/5"}`}>
                    <Icon className={active ? "text-primary" : "text-muted-foreground"} style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[12px] leading-tight" style={{ color: active ? "hsl(var(--primary))" : undefined }}>{s.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{s.desc}</p>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${active ? "bg-primary" : "bg-white/15"}`} />
                </button>);

          })}
          </div>

          <button
          onClick={() => setBowlsMarkers((v) => !v)}
          className={`w-full py-3 rounded-xl border text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 ${
          bowlsMarkers ?
          "border-primary bg-accent text-primary neon-glow" :
          "border-glow/20 bg-card/50 text-muted-foreground hover:border-primary/50"}`
          }>
            {bowlsMarkers ? "✓ " : ""}ACTIVAR MARCADORES CON CUENCOS
          </button>
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