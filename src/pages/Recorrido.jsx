import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { JOURNEY } from "@/lib/journey";
import { Check } from "lucide-react";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

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

      <section className="rounded-3xl border border-white/10 bg-card/80 backdrop-blur-xl p-4">
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {JOURNEY.map((day) => {
            const isDone = completed.has(day.day);
            return (
              <button
                key={day.day}
                onClick={() => startDay(day)}
                title={`Día ${day.day} · ${day.title}`}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                  isDone
                    ? "bg-primary text-primary-foreground gold-glow"
                    : "bg-background/40 border border-white/5 text-muted-foreground hover:border-primary/30"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-semibold tabular-nums">{day.day}</span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}