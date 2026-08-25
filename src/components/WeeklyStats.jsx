import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Clock, Activity } from "lucide-react";
import { localDayKey, computeActiveDays } from "@/lib/journey";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function buildWeek(sessions, diaryEntries, journeyProgress, timezone) {
  const today = new Date();
  const activeDays = computeActiveDays(sessions, diaryEntries, journeyProgress, timezone);
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = localDayKey(d, timezone);
    const mins = (sessions || [])
      .filter((s) => localDayKey(s.created_date, timezone) === key)
      .reduce((sum, s) => sum + Math.round((s.actual_seconds || 0) / 60), 0);
    data.push({ day: DAYS[d.getDay()], mins, active: activeDays.has(key) });
  }
  return data;
}

function ConsistencyRing({ percent, days }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--accent))" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="hsl(var(--glow))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 6px hsl(var(--glow) / 0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-display font-semibold tabular-nums">{days}<span className="text-sm text-muted-foreground">/7</span></p>
        <p className="text-[10px] text-muted-foreground -mt-0.5">días</p>
      </div>
    </div>
  );
}

export default function WeeklyStats({ sessions, diaryEntries, journeyProgress, timezone, streak = 0 }) {
  const data = buildWeek(sessions, diaryEntries, journeyProgress, timezone);
  const totalMin = data.reduce((sum, d) => sum + d.mins, 0);
  const activeDays = data.filter((d) => d.active).length;
  // El anillo refleja la racha unificada (mismo contador que Tu Perfil e Insignias),
  // no solo los días activos de esta semana.
  const ringDays = Math.min(streak, 7);
  const consistency = Math.round((ringDays / 7) * 100);
  const avg = activeDays ? Math.round(totalMin / activeDays) : 0;

  return (
    <section className="rounded-3xl border border-glow/20 bg-card/50 backdrop-blur-sm p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tu semana</h2>
        <span className="text-[11px] text-muted-foreground">últimos 7 días</span>
      </div>

      <div className="flex items-center gap-5">
        <ConsistencyRing percent={consistency} days={ringDays} />
        <div className="flex-1 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-accent/50 p-3">
            <Clock className="w-4 h-4 text-glow-cyan mb-1" />
            <p className="text-xl font-display font-semibold tabular-nums">{totalMin}<span className="text-xs text-muted-foreground"> min</span></p>
            <p className="text-[10px] text-muted-foreground">minutos totales</p>
          </div>
          <div className="rounded-2xl bg-accent/50 p-3">
            <Activity className="w-4 h-4 text-gold mb-1" />
            <p className="text-xl font-display font-semibold tabular-nums">{avg}<span className="text-xs text-muted-foreground"> min</span></p>
            <p className="text-[10px] text-muted-foreground">promedio por día activo</p>
          </div>
        </div>
      </div>

      <div className="h-40 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--glow-cyan))" />
                <stop offset="100%" stopColor="hsl(var(--glow))" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent) / 0.4)" }}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--glow) / 0.3)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(v) => [`${v} min`, "Meditación"]}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Bar dataKey="mins" radius={[6, 6, 6, 6]} maxBarSize={34}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.active ? "url(#barGrad)" : "hsl(var(--accent))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-glow/10">
        <span>Consistencia semanal</span>
        <span className="text-primary font-medium">{consistency}%</span>
      </div>
    </section>
  );
}