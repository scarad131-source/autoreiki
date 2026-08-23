import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";

const MOOD_AFTER = [
  { id: "relaxed", label: "Relajado", emoji: "🌿" },
  { id: "centered", label: "Centrado", emoji: "🧘" },
  { id: "energized", label: "Energizado", emoji: "✨" },
  { id: "peaceful", label: "En paz", emoji: "🕊️" },
  { id: "neutral", label: "Neutral", emoji: "😐" },
];

export default function ReflectionForm({ config, actualSeconds, onSave, onRepeat }) {
  const [moodAfter, setMoodAfter] = useState(null);
  const [notes, setNotes] = useState("");

  const mins = Math.round(actualSeconds / 60);

  return (
    <div className="space-y-7 pt-2">
      <div className="flex items-center -ml-1">
        <button
          onClick={onRepeat}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-card border border-white/5 text-xs font-medium hover:border-primary/30 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Volver a la meditación
        </button>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-glow-cyan flex items-center justify-center neon-glow mb-4">
          <Check className="w-8 h-8 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-2xl font-semibold">Sesión completada</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Meditaste <span className="font-medium text-foreground">{mins} min</span> · {config.level === "beginner" ? "Principiante" : "Intermedio"}
        </p>
      </div>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">¿Cómo te sientes ahora?</h3>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_AFTER.map((m) => (
            <button
              key={m.id}
              onClick={() => setMoodAfter(m.id)}
              className={`flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all ${
                moodAfter === m.id ? "border-primary bg-accent neon-glow" : "border-glow/20 bg-card/50 hover:border-primary/50"
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[10px] font-medium text-center leading-tight">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Notas (opcional)</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="¿Qué notaste durante la meditación?"
          className="w-full p-3.5 rounded-2xl border border-glow/20 bg-card/50 text-sm resize-none focus:outline-none focus:border-primary transition-colors"
        />
      </section>

      <button
        onClick={() => onSave({ moodAfter, notes })}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow hover:scale-[1.01] transition-transform active:scale-[0.99]"
      >
        Guardar sesión
      </button>
    </div>
  );
}