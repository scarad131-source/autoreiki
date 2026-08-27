import { Sprout, Flame, Trophy, Lock } from "lucide-react";

const BADGES = [
  { target: 7, title: "Semana sagrada", desc: "7 días de práctica", Icon: Sprout, color: "#22C55E" },
  { target: 14, title: "Quincena de presencia", desc: "14 días de constancia plena", Icon: Flame, color: "#C9821A" },
  { target: 21, title: "Recorrido completo", desc: "21 días de transformación", Icon: Trophy, color: "#A78BFA" },
];

export default function Badges({ bestStreak = 0 }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {BADGES.map((b, i) => {
        const unlocked = bestStreak >= b.target;
        const progress = Math.min(bestStreak / b.target, 1);
        const pct = Math.round(progress * 100);
        const prevTarget = i === 0 ? 0 : BADGES[i - 1].target;
        const inRange = !unlocked && bestStreak > prevTarget;
        // Mostrar gradualmente: la insignia aparece cuando el usuario entra
        // en su rango de días (1-7, 8-14, 15-21)
        if (bestStreak <= prevTarget) return null;
        return (
          <div
            key={b.target}
            className={`relative rounded-2xl border p-2 w-36 flex flex-col items-center text-center transition-all ${
              unlocked
                ? "border-amber-light/50 bg-accent/40"
                : "border-glow/10 bg-card/40"
            }`}
            style={{
              boxShadow: unlocked
                ? "0 0 40px 8px hsl(36 77% 45% / 0.45), 0 0 80px 20px hsl(255 92% 76% / 0.25), inset 0 0 18px hsl(var(--gold) / 0.12)"
                : `0 0 30px 6px ${b.color}40, 0 0 60px 16px ${b.color}20`,
            }}
          >
            {/* medalla */}
            <div className="relative mb-2">
              {/* luz de fondo detrás de la insignia */}
              <div
                className="absolute inset-0 rounded-full blur-2xl transition-opacity"
                style={{
                  background: unlocked
                    ? "radial-gradient(circle, hsl(var(--amber-light) / 0.7), transparent 70%)"
                    : `radial-gradient(circle, ${b.color}66, transparent 70%)`,
                  transform: "scale(2.6)",
                }}
              />
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  unlocked ? "" : "opacity-50 grayscale"
                }`}
                style={{
                  background: unlocked
                    ? "radial-gradient(circle at 50% 35%, hsl(var(--amber-light) / 0.5), hsl(var(--gold) / 0.15))"
                    : "hsl(var(--muted))",
                  boxShadow: unlocked ? "0 0 24px hsl(var(--amber-light) / 0.75), inset 0 0 14px hsl(var(--gold) / 0.35)" : "none",
                  border: `2px solid ${unlocked ? "hsl(var(--amber-light))" : "hsl(var(--border))"}`,
                }}
              >
                <b.Icon
                  className="w-4 h-4"
                  style={{ color: unlocked ? "hsl(var(--amber-light))" : "hsl(var(--muted-foreground))" }}
                  strokeWidth={2.2}
                />
              </div>
              {!unlocked && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                  <Lock className="w-2 h-2 text-muted-foreground" />
                </div>
              )}
            </div>

            <p className="font-display text-sm font-semibold" style={{ color: unlocked ? "hsl(var(--amber-light))" : "hsl(var(--foreground))" }}>
              {b.title}
            </p>
            <p className="text-[10px] text-muted-foreground leading-snug mt-1 mb-2 min-h-[24px]">{b.desc}</p>

            {/* barra de progreso */}
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: unlocked ? "linear-gradient(90deg, hsl(var(--gold)), hsl(var(--amber-light)))" : "hsl(var(--primary))",
                  boxShadow: unlocked ? "0 0 10px hsl(var(--amber-light) / 0.85)" : "none",
                }}
              />
            </div>
            {(unlocked || inRange) && (
              <p className="text-[10px] font-medium mt-1.5" style={{ color: unlocked ? "hsl(var(--amber-light))" : "hsl(var(--muted-foreground))" }}>
                {unlocked ? "Desbloqueada" : `${Math.min(bestStreak, b.target)} / ${b.target} días`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}