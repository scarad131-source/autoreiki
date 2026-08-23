import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { JOURNEY, computeActiveDays } from "@/lib/journey";
import { Check, ChevronLeft } from "lucide-react";
import JourneyBenefits from "@/components/JourneyBenefits";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function Recorrido() {
  const navigate = useNavigate();
  const [progressCount, setProgressCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [sessions, diary, prog] = await Promise.all([
        base44.entities.MeditationSession.list("-created_date", 100),
        base44.entities.DiaryEntry.list("-created_date", 100),
        base44.entities.JourneyProgress.list("-created_date", 100)]
        );
        const days = computeActiveDays(sessions, diary, prog);
        setProgressCount(Math.min(days.size, 21));
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
    <div className="space-y-7">
      <div className="flex items-center -ml-1">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Atrás"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <header className="text-center pt-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Recorrido de 21 días</h1>
        <p className="text-sm text-muted-foreground mt-1">Un viaje guiado día a día hacia tu práctica constante.</p>
      </header>

      <JourneyBenefits />

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Tu progreso</h2>
          <span className="text-primary font-medium">{progressCount}/21 días</span>
        </div>
        <div className="h-2 rounded-full bg-accent overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-glow-cyan transition-all"
            style={{ width: `${(progressCount / 21) * 100}%` }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold mb-3">Días del recorrido</h2>
        <div className="grid grid-cols-7 gap-2">
          {JOURNEY.map((day) => {
            const isDone = day.day <= progressCount;
            const isCurrent = day.day === progressCount + 1;
            return (
              <button
                key={day.day}
                onClick={() => startDay(day)}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                  isDone
                    ? "border-primary bg-primary/15 text-primary"
                    : isCurrent
                    ? "border-primary bg-accent neon-glow text-foreground"
                    : "border-white/10 bg-card/60 text-muted-foreground hover:border-primary/30"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-semibold">{day.day}</span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );





















































}