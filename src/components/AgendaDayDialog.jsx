import { useState } from "react";
import { X, Plus, Trash2, Clock } from "lucide-react";

export default function AgendaDayDialog({ dateStr, sessions, onClose, onSave }) {
  const [list, setList] = useState(sessions || []);
  const [time, setTime] = useState("07:00");
  const [label, setLabel] = useState("");

  const addSession = () => {
    if (!time || !label.trim()) return;
    setList((prev) =>
      [...prev, { time, label: label.trim() }].sort((a, b) => a.time.localeCompare(b.time))
    );
    setLabel("");
  };

  const removeSession = (idx) => {
    setList((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = () => {
    onSave(list);
    onClose();
  };

  const dateObj = new Date(dateStr + "T00:00:00");
  const formatted = dateObj.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-glow/20 bg-card p-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Agendar sesión</p>
            <h3 className="font-display text-lg font-semibold capitalize mt-0.5">{formatted}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de sesiones del día */}
        <div className="space-y-2 mb-4">
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Sin sesiones programadas este día.</p>
          ) : (
            list.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-glow/15 bg-accent/30 p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.label}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{s.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeSession(idx)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors shrink-0"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Agregar nueva sesión */}
        <div className="rounded-2xl border border-glow/20 bg-background/40 p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Agregar sesión</p>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[11px] text-muted-foreground mb-1 block">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-glow/20 bg-card/50 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex-[2]">
              <label className="text-[11px] text-muted-foreground mb-1 block">Etiqueta</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSession()}
                placeholder="Ej. Reiki chakras, Sanación..."
                className="w-full p-2.5 rounded-xl border border-glow/20 bg-card/50 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            onClick={addSession}
            disabled={!label.trim()}
            className="w-full py-2.5 rounded-xl border border-primary/40 bg-primary/10 text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        <button
          onClick={save}
          className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow active:scale-[0.99] transition-transform"
        >
          Guardar agenda del día
        </button>
      </div>
    </div>
  );
}