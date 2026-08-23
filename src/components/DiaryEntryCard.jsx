import { sensationMap } from "@/lib/diarySensations";

export default function DiaryEntryCard({ entry }) {
  const date = new Date(entry.created_date);
  const dateLabel = date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sensations = (entry.sensations || [])
    .map((id) => sensationMap[id])
    .filter(Boolean);

  return (
    <div className="rounded-2xl bg-card/60 border border-primary/25 p-4 neon-glow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium capitalize">{dateLabel}</p>
        <p className="text-xs text-muted-foreground tabular-nums">{timeLabel}</p>
      </div>
      {sensations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {sensations.map((s) => {
            const Icon = s.icon;
            return (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                style={{
                  borderColor: `${s.colorHex}66`,
                  color: s.colorHex,
                  background: "hsl(var(--card))",
                }}
              >
                <Icon className="w-3 h-3" /> {s.label}
              </span>
            );
          })}
        </div>
      )}
      {entry.note && (
        <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{entry.note}</p>
      )}
    </div>
  );
}