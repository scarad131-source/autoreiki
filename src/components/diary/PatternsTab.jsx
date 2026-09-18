import { MOODS } from "@/lib/diaryOptions";
import DiaryPatterns from "@/components/DiaryPatterns";
import DiaryHistory from "@/components/DiaryHistory";

export default function PatternsTab({ entries = [], loaded = true }) {
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