import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { AUDIO_SOURCES } from "@/lib/audioSources";

const MODES = [
{ id: "guided", name: "Guiada", desc: "Asistente durante la meditacion que te guia paso a paso" },
{ id: "unguided", name: "No guiada", desc: "Me quedo unicamente con el aido" }];


const LEVELS = [
{ id: "beginner", name: "Principiante", desc: "Base suave para empezar" },
{ id: "intermediate", name: "Intermedio", desc: "Profundiza con chakras" }];


const DURATIONS = [5, 10, 30];

export default function SessionForm({ onStart }) {
  const [mode, setMode] = useState("guided");
  const [level, setLevel] = useState("beginner");
  const [minutes, setMinutes] = useState(10);
  const [audio, setAudio] = useState("beach");

  const start = () => {
    onStart({ mode, level, audio: mode === "unguided" ? audio : "beach", minutes });
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Hoy quiero mi meditación...</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) =>
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`text-left p-4 rounded-2xl border transition-all ${
            mode === m.id ?
            "border-primary bg-accent neon-glow" :
            "border-glow/20 bg-card/50 hover:border-primary/50"}`
            }>
            
              <p className="font-medium text-sm">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{m.desc}</p>
            </button>
          )}
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
        <div className="grid grid-cols-3 gap-2.5">
          {DURATIONS.map((d) =>
          <button
            key={d}
            onClick={() => setMinutes(d)}
            className={`py-3 rounded-2xl border text-sm font-medium transition-all ${
            minutes === d ?
            "border-primary bg-accent text-primary neon-glow" :
            "border-glow/20 bg-card/50 text-foreground hover:border-primary/50"}`
            }>
            
              {d} min
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

      <button
        onClick={start}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 active:scale-[0.99]">
        
        Comenzar sesión <ArrowRight className="w-4 h-4" />
      </button>
    </div>);

}