import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { JOURNEY, PHASES } from "@/lib/journey";
import { Check } from "lucide-react";

export default function Recorrido() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.JourneyProgress.list("-created_date", 100);
        setCompleted(new Set(list.map((p) => p.day_number)));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startDay = (day) => {
    navigate("/meditar", { state: { preset: { ...day.config, journeyDay: day.day } } });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Recorrido de 21 días</h1>
        <p className="text-sm text-muted-foreground mt-1">Sensibiliza tus sentidos y mejora tu concentración</p>
      </header>

      <div className="rounded-2xl border border-glow/20 bg-card/50 backdrop-blur-sm p-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Progreso</span>
          <span className="text-primary font-medium">{completed.size}/21 días</span>
        </div>
        <div className="h-2 rounded-full bg-accent overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-glow-cyan transition-all"
            style={{ width: `${(completed.size / 21) * 100}%` }}
          />
        </div>
      </div>

      {PHASES.map((phase) => {
        const days = JOURNEY.filter((d) => d.day >= phase.from && d.day <= phase.to);
        return (
          <section key={phase.name} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{phase.name}</h2>
            <div className="space-y-2.5">
              {days.map((day) => {
                const isDone = completed.has(day.day);
                return (
                  <div
                    key={day.day}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      isDone ? "border-primary/50 bg-accent/40" : "border-glow/20 bg-card/50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold ${
                        isDone ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : day.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Día {day.day} · {day.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {day.focus} · {day.config.minutes} min
                      </p>
                    </div>
                    <button
                      onClick={() => startDay(day)}
                      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground neon-glow"
                    >
                      {isDone ? "Repetir" : "Iniciar"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}