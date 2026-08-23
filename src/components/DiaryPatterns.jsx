import { SENSATIONS } from "@/lib/diarySensations";

// Mandala de patrones: anillos concéntricos con las sensaciones más frecuentes
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

  const ringDefs = [
    { r: 128, color: "hsl(var(--primary))" },
    { r: 92, color: "hsl(var(--glow-cyan))" },
    { r: 56, color: "hsl(var(--purple))" },
  ];

  const groups = [[], [], []];
  ranked.forEach((s, i) => {
    const idx = i < 3 ? 0 : i < 6 ? 1 : 2;
    groups[idx].push(s);
  });

  const nodes = [];
  groups.forEach((g, gi) => {
    const r = ringDefs[gi].r;
    g.forEach((s, i) => {
      const angle = ((2 * Math.PI) / g.length) * i - Math.PI / 2;
      nodes.push({
        ...s,
        x: 150 + r * Math.cos(angle),
        y: 150 + r * Math.sin(angle),
      });
    });
  });

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground font-medium">Tus patrones</p>
      </div>

      <div className="relative w-full max-w-[300px] mx-auto aspect-square">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <filter id="mandala-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {ringDefs.map((rd, i) => (
            <circle
              key={i}
              cx="150"
              cy="150"
              r={rd.r}
              fill="none"
              stroke={rd.color}
              strokeWidth="1"
              strokeOpacity="0.35"
              strokeDasharray="3 6"
            />
          ))}
          {nodes.map((n) => (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r="16"
              fill="hsl(var(--card))"
              stroke={n.colorHex}
              strokeWidth="2"
              filter="url(#mandala-glow)"
            />
          ))}
          <circle
            cx="150"
            cy="150"
            r="44"
            fill="hsl(var(--card))"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            filter="url(#mandala-glow)"
          />
        </svg>

        {nodes.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${(n.x / 300) * 100}%`, top: `${(n.y / 300) * 100}%` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: n.colorHex }} />
              <span
                className="text-[8px] font-semibold tabular-nums leading-none mt-0.5"
                style={{ color: n.colorHex }}
              >
                {n.count}×
              </span>
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="font-display text-3xl font-semibold leading-none neon-text">{total}</p>
          <p className="text-[7px] tracking-[0.2em] uppercase text-muted-foreground mt-1">entradas</p>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">Lo que más aparece en tu práctica</p>
    </div>
  );
}