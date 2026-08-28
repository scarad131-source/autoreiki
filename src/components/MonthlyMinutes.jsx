import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { CalendarRange } from "lucide-react";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function sessionMinutes(s) {
  if (s.actual_seconds && s.actual_seconds > 0) return s.actual_seconds / 60;
  return s.planned_minutes || 0;
}

export default function MonthlyMinutes({ sessions }) {
  const data = useMemo(() => {
    const byKey = new Map();
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    sessions.forEach((s) => {
      const d = new Date(s.created_date);
      if (d < start) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      byKey.set(key, (byKey.get(key) || 0) + sessionMinutes(s));
    });

    const out = [];
    const cursor = new Date(start);
    while (cursor <= now) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
      out.push({
        label: `${MONTHS[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(2)}`,
        minutes: Math.round((byKey.get(key) || 0)),
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return out;
  }, [sessions]);

  const total = data.reduce((a, b) => a + b.minutes, 0);

  return (
    <section className="rounded-3xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Minutos por mes</h2>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">{total} min totales</span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent))", opacity: 0.3 }}
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(v) => [`${v} min`, "Meditación"]}
            />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.minutes > 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}