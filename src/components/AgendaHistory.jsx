import { parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Clock, History, Calendar } from "lucide-react";

export default function AgendaHistory({ schedule }) {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const all = schedule
    .filter((e) => e.sessions?.length)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (all.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
          <History className="w-3.5 h-3.5" /> Historial de agenda
        </h2>
        <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 p-8 text-center">
          <History className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">Aún no hay sesiones en tu historial.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Programa sesiones en el calendario para verlas aquí.</p>
        </div>
      </section>
    );
  }

  const past = all.filter((e) => e.date < todayStr);
  const upcoming = all.filter((e) => e.date >= todayStr);

  const DayBlock = ({ entry, isPast }) => {
    const date = parseISO(entry.date + "T00:00:00");
    return (
      <div className="rounded-2xl border border-glow/15 bg-card/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 ${
            isPast ? "bg-accent/40" : "bg-primary/15"
          }`}>
            <span className="text-[10px] text-muted-foreground uppercase">
              {format(date, "EEE", { locale: es })}
            </span>
            <span className={`text-base font-semibold leading-none ${isPast ? "text-muted-foreground" : "text-primary"}`}>
              {format(date, "d")}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium capitalize">{format(date, "EEEE d 'de' MMMM", { locale: es })}</p>
            <p className="text-xs text-muted-foreground">
              {entry.sessions.length} {entry.sessions.length === 1 ? "sesión" : "sesiones"}
              {isPast && " · realizada"}
            </p>
          </div>
        </div>
        <div className="space-y-1.5 pl-1">
          {entry.sessions
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Clock className={`w-3.5 h-3.5 shrink-0 ${isPast ? "text-muted-foreground/50" : "text-primary"}`} />
                <span className="tabular-nums text-muted-foreground w-12">{s.time}</span>
                <span className={isPast ? "text-muted-foreground/70" : "text-foreground/90"}>{s.label}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
        <History className="w-3.5 h-3.5" /> Historial de agenda
      </h2>

      {upcoming.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 font-medium flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Próximas ({upcoming.length})
          </p>
          {upcoming.map((e) => (
            <DayBlock key={e.date} entry={e} isPast={false} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 font-medium pt-2">
            Realizadas ({past.length})
          </p>
          {past.map((e) => (
            <DayBlock key={e.date} entry={e} isPast={true} />
          ))}
        </div>
      )}
    </section>
  );
}