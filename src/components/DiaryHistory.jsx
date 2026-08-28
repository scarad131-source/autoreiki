import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { format, startOfISOWeek, endOfISOWeek, getISOWeek, getISOWeekYear } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import DiaryPatterns from "@/components/DiaryPatterns";
import DiaryEntryCard from "@/components/DiaryEntryCard";

export default function DiaryHistory() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openWeek, setOpenWeek] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.DiaryEntry.list("-created_date", 100);
        setEntries(list);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="h-24 rounded-2xl bg-card/60 animate-pulse" />;
  if (!entries.length)
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        Aún no hay entradas. Cuando escribas la primera, aparecerá aquí.
      </p>
    );

  // Agrupar por mes y luego por semana ISO
  const months = {};
  entries.forEach((e) => {
    const d = new Date(e.created_date);
    const mk = format(d, "yyyy-MM");
    const wk = `${getISOWeekYear(d)}-W${String(getISOWeek(d)).padStart(2, "0")}`;
    if (!months[mk]) months[mk] = { label: format(d, "MMMM yyyy", { locale: es }), weeks: {} };
    if (!months[mk].weeks[wk])
      months[mk].weeks[wk] = { key: wk, start: startOfISOWeek(d), end: endOfISOWeek(d), entries: [] };
    months[mk].weeks[wk].entries.push(e);
  });

  const monthList = Object.entries(months)
    .map(([mk, m]) => ({
      key: mk,
      ...m,
      weeks: Object.values(m.weeks).sort((a, b) => b.start - a.start),
    }))
    .sort((a, b) => b.key.localeCompare(a.key));

  return (
    <div className="space-y-7">
      <DiaryPatterns entries={entries} />

      <div className="space-y-6">
        {monthList.map((m) => (
          <div key={m.key} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground capitalize">
              {m.label}
            </h3>
            <div className="space-y-2.5">
              {m.weeks.map((w) => {
                const open = openWeek === w.key;
                return (
                  <div
                    key={w.key}
                    className={`rounded-2xl border bg-card/50 overflow-hidden transition-all ${
                      open ? "border-primary/40 neon-glow" : "border-border"
                    }`}
                  >
                    <button
                      onClick={() => setOpenWeek(open ? null : w.key)}
                      className="w-full flex items-center justify-between px-4 py-3.5"
                    >
                      <span className="text-sm font-medium">
                        Semana del {format(w.start, "d")}–{format(w.end, "d MMM", { locale: es })}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {w.entries.length} entrada{w.entries.length !== 1 ? "s" : ""}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-primary transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                    {open && (
                      <div className="px-4 pb-4 pt-1 space-y-3">
                        {w.entries.map((e) => (
                          <DiaryEntryCard key={e.id} entry={e} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}