import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AgendaDayDialog from "@/components/AgendaDayDialog";
import AgendaHistory from "@/components/AgendaHistory";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, isSameMonth, isToday } from "date-fns";
import { es } from "date-fns/locale";

const WD = ["L", "M", "M", "J", "V", "S", "D"];

export default function AgendaReiki() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cursor, setCursor] = useState(new Date());
  const [dialogDate, setDialogDate] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setSchedule(u.reiki_schedule || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next) => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ reiki_schedule: next });
      setSchedule(next);
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  const saveDay = (dateStr, sessions) => {
    let next = schedule.filter((e) => e.date !== dateStr);
    if (sessions && sessions.length) {
      next = [...next, { date: dateStr, sessions }];
      // Registra las sesiones programadas en la hoja centralizada de Google Sheets
      base44.functions
        .invoke("logAgendaToSheet", { date: dateStr, sessions })
        .catch(() => {});
    }
    persist(next);
  };

  const sessionsFor = (dateStr) =>
    schedule.find((e) => e.date === dateStr)?.sessions || [];

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const totalSessions = schedule.reduce((a, e) => a + (e.sessions?.length || 0), 0);

  return (
    <div className="space-y-7">
      <header className="text-center pt-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-glow-cyan flex items-center justify-center neon-glow mb-3">
          <CalendarDays className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="font-display text-2xl font-semibold">Agenda Reiki</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Toca cualquier día para programar tus sesiones por hora y etiqueta.
        </p>
      </header>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-glow/15 bg-card/50 p-4 text-center">
          <p className="text-2xl font-display font-semibold text-primary">{loading ? "–" : totalSessions}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Sesiones programadas</p>
        </div>
        <div className="rounded-2xl border border-glow/15 bg-card/50 p-4 text-center">
          <p className="text-2xl font-display font-semibold text-primary">{loading ? "–" : schedule.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Días con práctica</p>
        </div>
      </div>

      {/* Calendario */}
      <section className="rounded-3xl border border-glow/20 bg-card/50 p-4">
        {/* Navegación de mes */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCursor((c) => addMonths(c, -1))}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-display text-lg font-semibold capitalize">
            {format(cursor, "MMMM yyyy", { locale: es })}
          </h2>
          <button
            onClick={() => setCursor((c) => addMonths(c, 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Encabezados de día */}
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {WD.map((d, i) => (
            <div key={i} className="text-center text-[11px] font-medium text-muted-foreground/70 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Cuadrícula de días */}
        {loading ? (
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-accent/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const inMonth = isSameMonth(day, cursor);
              const today = isToday(day);
              const daySessions = sessionsFor(dateStr);
              const hasSessions = daySessions.length > 0;
              return (
                <button
                  key={dateStr}
                  onClick={() => setDialogDate(dateStr)}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all relative ${
                    today
                      ? "border-primary bg-primary/10"
                      : hasSessions
                      ? "bg-accent/40 hover:bg-accent/60"
                      : "border-border bg-background/30 hover:border-glow/30"
                  } ${!inMonth ? "opacity-30" : ""}`}
                  style={
                    hasSessions
                      ? {
                          borderColor: "hsl(var(--primary) / 0.55)",
                          boxShadow: "0 0 12px hsl(var(--primary) / 0.35), inset 0 0 8px hsl(var(--primary) / 0.12)",
                        }
                      : undefined
                  }
                >
                  <span
                    className={`text-xs font-medium tabular-nums ${
                      today ? "text-primary" : hasSessions ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {hasSessions && (
                    <div className="flex gap-0.5 flex-wrap justify-center max-w-[80%]">
                      {daySessions.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="w-1 h-1 rounded-full bg-primary"
                        />
                      ))}
                      {daySessions.length > 3 && (
                        <span className="text-[8px] text-primary leading-none">+</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground/60 text-center mt-3">
          {saving ? "Guardando..." : "Los puntos indican sesiones programadas ese día."}
        </p>
      </section>

      {/* Historial de agenda */}
      {!loading && <AgendaHistory schedule={schedule} />}

      {dialogDate && (
        <AgendaDayDialog
          dateStr={dialogDate}
          sessions={sessionsFor(dialogDate)}
          onClose={() => setDialogDate(null)}
          onSave={(sessions) => saveDay(dialogDate, sessions)}
        />
      )}
    </div>
  );
}