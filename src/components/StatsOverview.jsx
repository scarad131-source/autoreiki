import { Clock, Flame, Sparkles } from "lucide-react";
import { computeStreak } from "@/lib/journey";

export default function StatsOverview({ sessions }) {
  const totalMinutes = sessions.reduce((sum, s) => sum + Math.round((s.actual_seconds || 0) / 60), 0);
  const streak = computeStreak(sessions);

  const stats = [
    { label: "Sesiones", value: sessions.length, icon: Sparkles, color: "text-primary" },
    { label: "Minutos", value: totalMinutes, icon: Clock, color: "text-glow-cyan" },
    { label: "Racha", value: `${streak}d`, icon: Flame, color: "text-gold" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-glow/20 bg-card/50 backdrop-blur-sm p-4 text-center">
          <s.icon className={`w-4 h-4 mx-auto mb-1.5 ${s.color}`} />
          <p className="text-2xl font-display font-semibold tabular-nums">{s.value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}