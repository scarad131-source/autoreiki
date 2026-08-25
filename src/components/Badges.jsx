import { Sprout, Flame, Trophy, Lock } from "lucide-react";

const BADGES = [
  { target: 7, title: "Semana sagrada", desc: "7 días de práctica", Icon: Sprout, color: "#22C55E" },
  { target: 14, title: "Quincena de presencia", desc: "14 días de constancia plena", Icon: Flame, color: "#C9821A" },
  { target: 21, title: "Recorrido completo", desc: "21 días de transformación", Icon: Trophy, color: "#A78BFA" },
];

export default function Badges({ bestStreak = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {BADGES.map((b, i) => {
        const unlocked = bestStreak >= b.target;
        const progress = Math.min(bestStreak / b.target, 1);
        const pct = Math.round(progress * 100);
        return (
          <div
            key={b.target}
            className={`relative rounded-2xl border p-4 flex flex-col items-center text-center transition-all ${
              unlocked
                ? "border-primary/40 bg-accent/40 neon-glow"
                : "border-glow/10 bg-card/40"
            }`}
          >
            {/* medalla */}
            <div className="relative mb-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  unlocked ? "" : "opacity-50 grayscale"
                }`}
                style={{
                  background: unlocked
                    ? `radial-gradient(circle at 50% 35%, ${b.color}33, ${b.color}11)`
                    : "hsl(var(--muted))",
                  boxShadow: unlocked ? `0 0 18px ${b.color}55, inset 0 0 12px ${b.color}22` : "none",
                  border: `2px solid ${unlocked ? b.color : "hsl(var(--border))"}`,
                }}
              >
                <b.Icon
                  className="w-7 h-7"
                  style={{ color: unlocked ? b.color : "hsl(var(--muted-foreground))" }}
                  strokeWidth={2.2}
                />
              </div>
              {!unlocked && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
            </div>

            <p className="font-display text-base font-semibold" style={{ color: unlocked ? b.color : "hsl(var(--foreground))" }}>
              {b.title}
            </p>
            <p className="text-[11px] text-muted-foreground leading-snug mt-1 mb-3 min-h-[28px]">{b.desc}</p>

            {/* barra de progreso */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: unlocked ? b.color : "hsl(var(--primary))",
                  boxShadow: unlocked ? `0 0 10px ${b.color}88` : "none",
                }}
              />
            </div>
            {(unlocked || i === 0) && (
              <p className="text-[11px] font-medium mt-2" style={{ color: unlocked ? b.color : "hsl(var(--muted-foreground))" }}>
                {unlocked ? "Desbloqueada" : `${Math.min(bestStreak, b.target)} / ${b.target} días`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}