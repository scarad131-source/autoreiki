import { useState } from "react";
import { ArrowRight } from "lucide-react";

const MODES = [
  { id: "guided", name: "Guiada", desc: "Asistente que te guía paso a paso" },
  { id: "unguided", name: "No guiada", desc: "Solo tú y el sonido ambiente" }
];

const DURATIONS = [5, 10, 20, 30, 45];

const SOUNDS = [
  { id: "beach", name: "Playa calmada con aves" },
  { id: "bowls", name: "Frecuencias sanadoras" },
  { id: "rain", name: "Lluvia relajante" }
];

export default function SessionForm({ onStart }) {
  const [mode, setMode] = useState("guided");
  const [minutes, setMinutes] = useState(10);
  const [audio, setAudio] = useState("beach");

  const start = () => {
    onStart({
      mode,
      level: "intermediate",
      audio: mode === "unguided" ? audio : "meditation21",
      minutes: mode === "unguided" ? minutes : 20
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Hoy quiero mi meditación...</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                mode === m.id ? "border-primary bg-accent neon-glow" : "border-glow/20 bg-card/50 hover:border-primary/50"
              }`}>
              <p className="font-medium text-sm">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{m.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {mode === "unguided" && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Elige tu tiempo para meditar</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setMinutes(d)}
                className={`w-16 h-16 rounded-full border text-sm font-medium flex items-center justify-center transition-all ${
                  minutes === d ? "border-primary bg-accent text-primary neon-glow" : "border-glow/20 bg-card/50 text-foreground hover:border-primary/50"
                }`}>
                {d} min
              </button>
            ))}
          </div>
        </section>
      )}

      {mode === "unguided" && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Sonido ambiente</h2>
          <div className="grid grid-cols-2 gap-3">
            {SOUNDS.map((s) => (
              <button
                key={s.id}
                onClick={() => setAudio(s.id)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  audio === s.id ? "border-primary bg-accent neon-glow" : "border-glow/20 bg-card/50 hover:border-primary/50"
                }`}>
                <p className="font-medium text-sm">{s.name}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <button
        onClick={start}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 active:scale-[0.99]">
        Comenzar sesión <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}