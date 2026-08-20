import { sensationMap } from "@/lib/diarySensations";

export default function DiaryPatterns({ entries }) {
  const counts = {};
  entries.forEach((e) =>
    (e.sensations || []).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    })
  );
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 3);
  const total = entries.length;

  return (
    <div className="rounded-3xl bg-card border border-white/5 p-5 space-y-4">
      <div>
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground font-medium">Tus patrones</p>
        <h3 className="font-display text-xl font-semibold mt-1">
          {total} entrada{total !== 1 ? "s" : ""} registrada{total !== 1 ? "s" : ""}
        </h3>
      </div>
      {top.length ? (
        <div className="space-y-2.5">
          <p className="text-sm text-muted-foreground">Lo que más aparece en tu práctica:</p>
          {top.map(([id, n]) => {
            const s = sensationMap[id];
            if (!s) return null;
            const Icon = s.icon;
            return (
              <div key={id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <span className="text-sm flex-1">{s.label}</span>
                <span className="text-sm font-medium tabular-nums">{n}×</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Aún no hay sensaciones suficientes para ver patrones. Sigue registrando con calma.
        </p>
      )}
    </div>
  );
}