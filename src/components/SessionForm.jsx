import { useState } from "react";
import { Waves, Trees, Sparkles, Clock, ArrowRight } from "lucide-react";
import { AUDIO_OPTIONS } from "@/lib/audioEngine";
import { ambient } from "@/lib/audioEngine";

const iconMap = { Waves, Trees, Sparkles };

const MODES = [
  { id: "guided", name: "Guiada", desc: "Voz interior que te acompaña paso a paso" },
  { id: "unguided", name: "No guiada", desc: "Solo tú, tu respiración y el sonido" },
];

const LEVELS = [
  { id: "beginner", name: "Principiante", desc: "Base suave para empezar" },
  { id: "intermediate", name: "Intermedio", desc: "Profundiza con chakras" },
];

const DURATIONS = [5, 10, 15, 20];

export default function SessionForm({ onStart }) {
  const [mode, setMode] = useState("guided");
  const [level, setLevel] = useState("beginner");
  const [audio, setAudio] = useState("beach");
  const [minutes, setMinutes] = useState(10);
  const [previewing, setPreviewing] = useState(null);

  const preview = async (id) => {
    if (previewing === id) {
      ambient.stop();
      setPreviewing(null);
      return;
    }
    await ambient.play(id);
    ambient.setVolume(0.4);
    setPreviewing(id);
  };

  const start = () => {
    ambient.stop();
    setPreviewing(null);
    onStart({ mode, level, audio, minutes });
  };

  return (
    <div className="space-y-8">
      {/* Modo */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Modo</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                mode === m.id
                  ? "border-teal-500 bg-teal-50 shadow-sm"
                  : "border-border bg-card hover:border-teal-300"
              }`}
            >
              <p className="font-medium text-sm">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{m.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Nivel */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Nivel</h2>
        <div className="grid grid-cols-2 gap-3">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                level === l.id
                  ? "border-violet-500 bg-violet-50 shadow-sm"
                  : "border-border bg-card hover:border-violet-300"
              }`}
            >
              <p className="font-medium text-sm">{l.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{l.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Audio */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Ambiente sonoro</h2>
        <div className="space-y-2.5">
          {AUDIO_OPTIONS.map((a) => {
            const Icon = iconMap[a.icon];
            const active = audio === a.id;
            const playing = previewing === a.id;
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  active ? "border-teal-500 bg-teal-50/60 shadow-sm" : "border-border bg-card"
                }`}
              >
                <button onClick={() => setAudio(a.id)} className="flex items-center gap-3 flex-1 text-left">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{a.name}</p>
                    <p className="text-xs text-muted-foreground leading-snug truncate">{a.description}</p>
                  </div>
                </button>
                <button
                  onClick={() => preview(a.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    playing ? "bg-teal-600 text-white" : "bg-accent text-foreground hover:bg-accent/70"
                  }`}
                >
                  {playing ? "Detener" : "Probar"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Duración */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Duración
        </h2>
        <div className="grid grid-cols-4 gap-2.5">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setMinutes(d)}
              className={`py-3 rounded-2xl border text-sm font-medium transition-all ${
                minutes === d
                  ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm"
                  : "border-border bg-card text-foreground hover:border-teal-300"
              }`}
            >
              {d} min
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={start}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-violet-600 text-white font-medium shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        Comenzar sesión <ArrowRight className="w-4.5 h-4.5" />
      </button>
    </div>
  );
}