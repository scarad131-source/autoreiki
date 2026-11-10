import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, BellOff, Clock, Volume2 } from "lucide-react";
import { initReminderAudio, playReminderChime } from "@/lib/reminderAlarm";

export default function ReminderSettings({ user, onSaved }) {
  const [enabled, setEnabled] = useState(!!user?.reminder_enabled);
  const [time, setTime] = useState(user?.reminder_time || "09:00");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // null | "saved"

  useEffect(() => {
    setEnabled(!!user?.reminder_enabled);
    setTime(user?.reminder_time || "09:00");
  }, [user]);

  useEffect(() => initReminderAudio(), []);

  const save = async (overrides = {}) => {
    setSaving(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      await base44.auth.updateMe({
        reminder_enabled: overrides.enabled ?? enabled,
        reminder_time: overrides.time ?? time,
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

  // El interruptor se guarda al instante: antes solo cambiaba en pantalla.
  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    save({ enabled: next });
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
              Alarma suave para tu sesión de Reiki
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={saving}
          className={`relative w-12 h-7 rounded-full transition-colors shrink-0 disabled:opacity-60 ${
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
              className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-accent/40 border border-glow/20 text-foreground text-base font-medium outline-none focus:border-primary/60"
            />
            <button
              onClick={() => save()}
              disabled={saving}
              className="shrink-0 min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground text-sm font-medium neon-glow disabled:opacity-40 flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              {saving ? "Guardando…" : status === "saved" ? "Guardado ✓" : "Guardar"}
            </button>
          </div>

          <button
            onClick={() => playReminderChime()}
            className="w-full min-h-[44px] rounded-xl border border-primary/40 bg-primary/10 text-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            Escuchar la alarma
          </button>

          <p className="text-[11px] text-muted-foreground leading-snug">
            A esa hora suena una campanilla suave dentro de la app. Si la app está
            cerrada, te llega el recordatorio por correo.
          </p>
        </div>
      )}
    </section>
  );
}