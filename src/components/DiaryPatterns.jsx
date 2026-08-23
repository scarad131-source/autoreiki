import { SENSATIONS } from "@/lib/diarySensations";

// Patrones: barras horizontales con brillo neón, fáciles de leer
export default function DiaryPatterns({ entries }) {
  const counts = {};
  entries.forEach((e) =>
    (e.sensations || []).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    })
  );
  const total = entries.length;
  const ranked = SENSATIONS.map((s) => ({ ...s, count: counts[s.id] || 0 }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const max = ranked.length ? ranked[0].count : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground font-medium">Tus patrones</p>
          <h3 className="font-display text-xl font-semibold mt-1">
            {total} entrada{total !== 1 ? "s" : ""} registrada{total !== 1 ? "s" : ""}
          </h3>
        </div>
      </div>

      {ranked.length ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Lo que más aparece en tu práctica:</p>
          <div className="space-y-2.5">
            {ranked.map((s) => {
              const Icon = s.icon;
              const pct = Math.round((s.count / max) * 100);
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border"
                    style={{ borderColor: `${s.colorHex}55`, background: "hsl(var(--card))" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: s.colorHex }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm truncate">{s.label}</span>
                      <span className="text-xs font-semibold tabular-nums" style={{ color: s.colorHex }}>
                        {s.count}×
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-accent/40 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${s.colorHex}cc, ${s.colorHex})`,
                          boxShadow: `0 0 10px ${s.colorHex}88`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Aún no hay sensaciones suficientes para ver patrones. Sigue registrando con calma.
        </p>
      )}
    </div>
  );
}