import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart3 } from "lucide-react";
import { SENSATIONS, sensationMap } from "@/lib/diarySensations";
import { MOODS } from "@/lib/diaryOptions";
import DiaryPatterns from "@/components/DiaryPatterns";
import DiaryHistory from "@/components/DiaryHistory";

export default function PatternsTab() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.DiaryEntry.list("-created_date", 100);
        setEntries(list);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = entries.length;

  // Emoción frecuente
  const moodCounts = {};
  entries.forEach((e) => {
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  const moodLabel = topMood ? MOODS.find((m) => m.id === topMood[0])?.label : "Sin datos";

  // Intensidad media
  const intensities = entries.map((e) => e.intensity).filter((i) => i != null && i > 0);
  const avgIntensity = intensities.length
    ? (intensities.reduce((a, b) => a + b, 0) / intensities.length).toFixed(1)
    : "0";

  // Últimas 7 sesiones para el gráfico
  const recent = entries.slice(0, 7).reverse();

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-card/50 p-4">
          <p className="text-[11px] text-muted-foreground">Entradas</p>
          <p className="font-display text-3xl font-semibold mt-1">{total}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">registros personales</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-card/50 p-4">
          <p className="text-[11px] text-muted-foreground">Emoción frecuente</p>
          <p className="font-display text-2xl font-semibold mt-1">{moodLabel}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">según tus entradas</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-card/50 p-4">
          <p className="text-[11px] text-muted-foreground">Intensidad media</p>
          <p className="font-display text-3xl font-semibold mt-1">{avgIntensity}/5</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">percepción registrada</p>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-white/10 bg-card/50 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-medium">Últimas sesiones</p>
            <h3 className="font-display text-2xl font-semibold mt-0.5">Intensidad percibida</h3>
          </div>
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>

        {recent.length > 0 ? (
          <div className="flex items-end justify-between gap-2 h-40">
            {recent.map((e, i) => {
              const val = e.intensity || 0;
              const heightPct = (val / 5) * 100;
              return (
                <div key={e.id || i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex items-end justify-center flex-1">
                    <div
                      className="w-8 rounded-t-full bg-gradient-to-t from-primary/40 to-primary transition-all"
                      style={{ height: `${Math.max(heightPct, 4)}%`, boxShadow: "0 0 12px hsl(var(--glow) / 0.3)" }}
                      title={`Intensidad: ${val}/5`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{i + 1}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="flex items-end justify-between gap-2 h-32 w-full max-w-xs opacity-30">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-8 rounded-t-full bg-primary/30" style={{ height: `${20 + Math.random() * 60}%` }} />
                  <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Guarda una primera entrada para comenzar a observar patrones.
            </p>
          </div>
        )}
      </div>

      {/* Existing patterns + history */}
      {entries.length > 0 && (
        <div className="space-y-6 pt-2">
          <DiaryPatterns entries={entries} />
          <DiaryHistory />
        </div>
      )}
    </div>
  );
}