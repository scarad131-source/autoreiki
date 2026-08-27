import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, BellOff, Clock } from "lucide-react";

export default function ReminderSettings({ user, onSaved }) {
  const [enabled, setEnabled] = useState(!!user?.reminder_enabled);
  const [time, setTime] = useState(user?.reminder_time || "09:00");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // null | "saved"

  useEffect(() => {
    setEnabled(!!user?.reminder_enabled);
    setTime(user?.reminder_time || "09:00");
  }, [user]);

  const save = async () => {
    setSaving(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      await base44.auth.updateMe({
        reminder_enabled: enabled,
        reminder_time: time,
        reminder_timezone: tz,
      });
      setStatus("saved");
      setTimeout(() => setStatus(null), 2500);
      onSaved && onSaved();
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl border border-glow/20 bg-card/50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/15 shrink-0">
            {enabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm">Recordatorio diario</p>
            <p className="text-xs text-muted-foreground leading-snug">
              Notificación push para tu sesión de Reiki
            </p>
          </div>
        </div>
        <button
          onClick={() => setEnabled((e) => !e)}
          className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
            enabled ? "bg-primary" : "bg-accent"
          }`}
          aria-label="Activar recordatorio"
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-background transition-all ${
              enabled ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Hora del recordatorio
          </label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              step={900}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-accent/40 border border-glow/20 text-foreground text-sm font-medium outline-none focus:border-primary/60"
            />
            <button
              onClick={save}
              disabled={saving}
              className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground text-sm font-medium neon-glow disabled:opacity-40 flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              {saving
                ? "Guardando…"
                : status === "saved"
                ? "Guardado ✓"
                : "Guardar"}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Las notificaciones push se entregan en la app móvil nativa. Configura
            tu hora igual: el recordatorio comenzará a funcionar al publicar la
            app con notificaciones push habilitadas.
          </p>
        </div>
      )}
    </section>
  );
}