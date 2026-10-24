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
    <div className="relative w-16 h-16 shrink-0">
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
        <p className="text-base font-display font-semibold tabular-nums leading-none">{days}<span className="text-[10px] text-muted-foreground">/7</span></p>
        <p className="text-[8px] text-muted-foreground mt-0.5 leading-none">días</p>
      </div>
    </div>
  );
}

export default function WeeklyStats({ sessions, diaryEntries, journeyProgress, timezone }) {
  const data = buildWeek(sessions, diaryEntries, journeyProgress, timezone);
  const totalMin = data.reduce((sum, d) => sum + d.mins, 0);
  const activeDays = data.filter((d) => d.active).length;
  const consistency = Math.round((activeDays / 7) * 100);
  const avg = activeDays ? Math.round(totalMin / activeDays) : 0;

  return (
    <section className="rounded-3xl border border-glow/20 bg-card/50 backdrop-blur-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tu semana</h2>
        <span className="text-[11px] text-muted-foreground">últimos 7 días</span>
      </div>

      {/* Métricas en una sola fila: el círculo a la izquierda de su recuadro y los minutos a la derecha del suyo */}
      <div className="flex flex-row items-stretch gap-2.5">
        <div className="flex items-center gap-2.5 rounded-2xl bg-accent/50 px-3 py-2">
          <ConsistencyRing percent={consistency} days={activeDays} />
          <p className="text-[10px] uppercase tracking-[0.12em] leading-tight text-muted-foreground">
            días<br />activos
          </p>
        </div>

        <div className="flex-1 min-w-0 rounded-2xl bg-accent/50 px-3 py-2 flex flex-col justify-center gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10px] leading-tight text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-glow-cyan shrink-0" /> minutos totales
            </span>
            <p className="shrink-0 text-lg font-display font-semibold tabular-nums leading-none">
              {totalMin}<span className="text-[10px] text-muted-foreground"> min</span>
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10px] leading-tight text-muted-foreground">
              <Activity className="w-3.5 h-3.5 text-gold shrink-0" /> promedio por día activo
            </span>
            <p className="shrink-0 text-lg font-display font-semibold tabular-nums leading-none">
              {avg}<span className="text-[10px] text-muted-foreground"> min</span>
            </p>
          </div>
        </div>
      </div>

      <div className="h-20 -ml-2 -mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 6, left: 0, bottom: 0 }}>
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
            <Bar dataKey="mins" radius={[5, 5, 5, 5]} maxBarSize={22}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.active ? "url(#barGrad)" : "hsl(var(--accent))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-glow/10">
        <span>Consistencia semanal</span>
        <span className="text-primary font-medium">{consistency}%</span>
      </div>
    </section>
  );
}