import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, BellOff, Clock, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ReminderSettings({ user, onSaved }) {
  const [enabled, setEnabled] = useState(!!user?.reminder_enabled);
  const [time, setTime] = useState(user?.reminder_time || "09:00");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // null | "saved"
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.functions.invoke("deleteMyAccount", {});
    } catch (e) {
    } finally {
      await base44.auth.logout("/login");
    }
  };

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
          <input
            type="time"
            step={900}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-accent/40 border border-glow/20 text-foreground font-medium outline-none focus:border-primary/60"
          />
          <p className="text-[11px] text-muted-foreground leading-snug">
            Las notificaciones push se entregan en la app móvil nativa. Configura
            tu hora igual: el recordatorio comenzará a funcionar al publicar la
            app con notificaciones push habilitadas.
          </p>
        </div>
      )}

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow disabled:opacity-40 flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        {saving
          ? "Guardando…"
          : status === "saved"
          ? "Guardado ✓"
          : "Guardar recordatorio"}
      </button>

      <div className="pt-4 mt-2 border-t border-white/5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="mx-auto py-1.5 px-3 text-xs rounded-full border border-destructive/30 bg-destructive/5 text-destructive/80 font-medium flex items-center justify-center gap-1.5 hover:bg-destructive/15 transition-colors active:scale-[0.99]"
            >
              <Trash2 className="w-3 h-3" />
              Eliminar cuenta
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm rounded-3xl border-destructive/30">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar tu cuenta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción es permanente y borrará todo tu progreso, sesiones y
                datos de AutoReiki. No podrás recuperarlo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-2">
              <AlertDialogCancel className="mt-0">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Eliminando…" : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}