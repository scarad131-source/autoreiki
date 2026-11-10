import { useState } from "react";
import { X, Plus, Trash2, Clock } from "lucide-react";

const formatDay = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
};

const inputClass =
  "w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-glow/20 bg-card/50 text-base focus:outline-none focus:border-primary transition-colors";

export default function AgendaDayDialog({ dateStr, sessions, getSessionsFor, onClose, onSave }) {
  const [date, setDate] = useState(dateStr);
  const [list, setList] = useState(sessions || []);
  const [start, setStart] = useState("07:00");
  const [end, setEnd] = useState("08:00");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  // Cambiar la fecha carga las sesiones de ese día para editarlas ahí mismo.
  const changeDate = (value) => {
    setDate(value);
    setList(value && getSessionsFor ? getSessionsFor(value) : []);
  };

  const addSession = () => {
    if (!start || !name.trim()) return;
    const session = {
      time: start,
      endTime: end || "",
      label: name.trim(),
      details: details.trim(),
    };
    setList((prev) => [...prev, session].sort((a, b) => a.time.localeCompare(b.time)));
    setName("");
    setDetails("");
  };

  const removeSession = (idx) => {
    setList((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = () => {
    if (!date) return;
    onSave(date, list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-glow/20 bg-card shadow-[0_18px_45px_rgba(0,0,0,0.55)] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-md">
        {/* Encabezado fijo */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Agendar sesión</p>
            <h3 className="font-display text-lg font-semibold capitalize mt-0.5 truncate">
              {formatDay(date) || "Elige una fecha"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll propio para que todo sea alcanzable en celular */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-3">
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">Fecha</label>
            <input type="date" value={date} onChange={(e) => changeDate(e.target.value)} className={inputClass} />
          </div>

          {/* Sesiones del día */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Sesiones programadas
            </p>
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-3">Sin sesiones programadas este día.</p>
            ) : (
              list.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 rounded-2xl border border-glow/15 bg-accent/30 p-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium break-words">{s.label}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {s.time}
                        {s.endTime ? ` – ${s.endTime}` : ""}
                      </p>
                      {s.details && (
                        <p className="text-xs text-muted-foreground/80 mt-1 whitespace-pre-wrap break-words">
                          {s.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeSession(idx)}
                    className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    aria-label="Eliminar sesión"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Nueva sesión */}
          <div className="rounded-2xl border border-glow/20 bg-background/40 p-3 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Agregar sesión</p>

            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Horario</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block">Inicio</label>
                  <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground mb-1 block">Fin</label>
                  <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Nombre de la sesión</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSession()}
                placeholder="Ej. Reiki chakras, Sanación..."
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Detalles (opcional)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="Persona, chakras a trabajar, notas..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              onClick={addSession}
              disabled={!name.trim() || !start}
              className="w-full min-h-[44px] rounded-xl border border-primary/40 bg-primary/10 text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>

        {/* Guardar siempre visible */}
        <div className="border-t border-white/10 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            onClick={save}
            disabled={!date}
            className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow active:scale-[0.99] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Guardar agenda del día
          </button>
        </div>
      </div>
    </div>
  );
}