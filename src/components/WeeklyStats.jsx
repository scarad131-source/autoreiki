import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Clock, ArrowRight } from "lucide-react";
import LotusIcon from "@/components/LotusIcon";
import { localDayKey, computeActiveDays } from "@/lib/journey";

// Etiquetas de una letra (Domingo primero, según el día real de cada barra).
const DAYS = ["D", "L", "M", "M", "J", "V", "S"];

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

export default function WeeklyStats({ sessions, diaryEntries, journeyProgress, timezone }) {
  const data = buildWeek(sessions, diaryEntries, journeyProgress, timezone);
  const totalMin = data.reduce((sum, d) => sum + d.mins, 0);
  const activeDays = data.filter((d) => d.active).length;

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold leading-none">Tu Semana</h2>
          <p className="mt-1.5 font-body text-[9px] uppercase tracking-[0.24em] text-primary">
            Tu constancia te transforma
          </p>
        </div>
        <Link
          to="/historial"
          className="inline-flex items-center gap-1 font-body text-[11px] text-primary shrink-0"
        >
          Ver más <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Sin recuadros: gráfico a la izquierda, datos a la derecha */}
      <div className="mt-5 flex items-center gap-6">
        <div className="basis-[55%] min-w-0">
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--amber-light))" />
                    <stop offset="100%" stopColor="hsl(var(--gold))" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={false} height={2} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--gold) / 0.08)" }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--gold) / 0.4)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(v) => [`${v} min`, "Meditación"]}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                />
                <Bar dataKey="mins" radius={[3, 3, 3, 3]} maxBarSize={6}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.active ? "url(#goldBar)" : "hsl(var(--gold) / 0.22)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex w-full items-center justify-between mt-2">
            {data.map((d, i) => (
              <span key={i} className="flex-1 text-center font-body text-[10px] text-muted-foreground">
                {d.day}
              </span>
            ))}
          </div>
        </div>

        <div className="basis-[45%] min-w-0 flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-primary shrink-0" strokeWidth={1.6} />
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold leading-none tabular-nums">
                {totalMin}
                <span className="font-body text-[11px] text-muted-foreground"> min</span>
              </p>
              <p className="font-body text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-1.5">
                Esta semana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <LotusIcon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.6} />
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold leading-none tabular-nums">
                {activeDays}
                <span className="font-body text-[11px] text-muted-foreground"> de 7</span>
              </p>
              <p className="font-body text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-1.5">
                Días de constancia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}