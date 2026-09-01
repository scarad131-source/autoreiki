import { Sun, SunDim, CloudSun, Cloud, Moon } from "lucide-react";

const LEVELS = [
  { value: 1, label: "Muy suave", icon: Moon, desc: "Apenas perceptible" },
  { value: 2, label: "Suave", icon: Cloud, desc: "Sensación ligera" },
  { value: 3, label: "Moderada", icon: CloudSun, desc: "Clara pero cómoda" },
  { value: 4, label: "Intensa", icon: SunDim, desc: "Vibración fuerte" },
  { value: 5, label: "Muy intensa", icon: Sun, desc: "Muy poderosa" },
];

export default function IntensitySlider({ value, onChange }) {
  const current = LEVELS.find((l) => l.value === value) || LEVELS[1];
  const CurrentIcon = current.icon;
  const pct = ((value - 1) / 4) * 100;

  return (
    <div className="space-y-3">
      {/* Current value display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: `hsl(var(--primary) / ${0.15 + pct / 100 * 0.35})`,
              boxShadow: `0 0 ${8 + pct / 100 * 16}px hsl(var(--glow) / ${0.2 + pct / 100 * 0.3})`,
            }}
          >
            <CurrentIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">{current.label}</p>
            <p className="text-[11px] text-muted-foreground">{current.desc}</p>
          </div>
        </div>
        <span className="font-display text-2xl font-semibold tabular-nums text-primary">
          {value}<span className="text-sm text-muted-foreground">/5</span>
        </span>
      </div>

      {/* Slider track */}
      <div className="relative pt-1">
        {/* Track background */}
        <div className="h-2 rounded-full bg-accent/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-300"
            style={{ width: `${pct}%`, boxShadow: "0 0 12px hsl(var(--glow) / 0.4)" }}
          />
        </div>

        {/* Clickable segments */}
        <div className="absolute inset-0 flex">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => onChange(l.value)}
              className="flex-1 group relative"
              aria-label={`Intensidad ${l.value}: ${l.label}`}
            >
              {/* Tick mark */}
              <span
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-2 rounded-full transition-all ${
                  value >= l.value ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />
              {/* Hover label */}
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {l.value}
              </span>
            </button>
          ))}
        </div>

        {/* Thumb */}
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-primary border-2 border-background pointer-events-none transition-all duration-300"
          style={{
            left: `calc(${pct}% - 10px)`,
            boxShadow: "0 0 14px hsl(var(--glow) / 0.5)",
          }}
        />
      </div>

      {/* Level labels */}
      <div className="flex justify-between px-0.5">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            onClick={() => onChange(l.value)}
            className={`text-[10px] transition-colors ${
              value === l.value ? "text-primary font-semibold" : "text-muted-foreground/60 hover:text-muted-foreground"
            }`}
          >
            {l.value}
          </button>
        ))}
      </div>
    </div>
  );
}