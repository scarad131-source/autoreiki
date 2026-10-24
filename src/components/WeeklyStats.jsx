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

      {/* Dos columnas sin recuadros: gráfico a la izquierda, datos a la derecha */}
      <div className="flex flex-row items-stretch gap-4">

        {/* Columna izquierda: círculo de días activos (aislado) sobre el gráfico de la semana */}
        <div className="flex-1 min-w-0 flex flex-col items-center gap-2">
          <ConsistencyRing percent={consistency} days={activeDays} />

          <div className="h-20 w-full -ml-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--glow-cyan))" />
                    <stop offset="100%" stopColor="hsl(var(--glow))" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
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
                <Bar dataKey="mins" radius={[4, 4, 4, 4]} maxBarSize={14}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.active ? "url(#barGrad)" : "hsl(var(--accent))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Columna derecha: minutos y consistencia, alineados a la izquierda y sin fondo */}
        <div className="flex-[2] min-w-0 border-l border-white/10 pl-4 flex flex-col justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-glow-cyan shrink-0" />
            <div className="min-w-0">
              <p className="text-lg font-display font-semibold tabular-nums leading-none">
                {totalMin}<span className="text-[10px] text-muted-foreground"> min</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">minutos totales</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-gold shrink-0" />
            <div className="min-w-0">
              <p className="text-lg font-display font-semibold tabular-nums leading-none">
                {avg}<span className="text-[10px] text-muted-foreground"> min</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">promedio por día activo</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Consistencia semanal</span>
              <span className="text-primary font-medium">{consistency}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-accent/60">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${consistency}%`,
                  background: "linear-gradient(90deg, hsl(var(--glow-cyan)), hsl(var(--glow)))",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}