import { useEffect, useState } from "react";
import { CalendarClock, Plus, Trash2, Bell } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const FULL_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function AgendaReiki() {
  const [user, setUser] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("07:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        setReminders(u.reiki_reminders || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addReminder = async () => {
    if (!selectedDay || !selectedTime) return;
    const entry = { day: selectedDay, time: selectedTime };
    const updated = [...reminders, entry];
    setSaving(true);
    try {
      await base44.auth.updateMe({ reiki_reminders: updated });
      setReminders(updated);
      setSelectedDay("");
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  const removeReminder = async (idx) => {
    const updated = reminders.filter((_, i) => i !== idx);
    setSaving(true);
    try {
      await base44.auth.updateMe({ reiki_reminders: updated });
      setReminders(updated);
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      <header className="text-center pt-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-glow-cyan flex items-center justify-center neon-glow mb-3">
          <CalendarClock className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="font-display text-2xl font-semibold">Agenda Reiki</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Programa tus sesiones de Reiki y recibe recordatorios para mantener tu práctica sagrada.
        </p>
      </header>

      {/* Crear recordatorio */}
      <section className="rounded-2xl border border-primary/20 bg-card/50 p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nuevo recordatorio</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Día de la semana</label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(String(i + 1))}
                  className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                    selectedDay === String(i + 1)
                      ? "border-primary bg-primary/15 text-primary neon-glow"
                      : "border-white/10 bg-accent/30 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Hora</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 rounded-2xl border border-glow/20 bg-card/50 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={addReminder}
            disabled={!selectedDay || saving}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow flex items-center justify-center gap-2 active:scale-[0.99] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Agregar a mi agenda
          </button>
        </div>
      </section>

      {/* Lista de recordatorios */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mis recordatorios</h2>

        {loading ? (
          <div className="h-20 rounded-2xl bg-card/50 animate-pulse" />
        ) : reminders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 p-8 text-center">
            <Bell className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Aún no tienes recordatorios.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Crea uno arriba para empezar a cuidar tu práctica.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {reminders
              .slice()
              .sort((a, b) => Number(a.day) - Number(b.day) || a.time.localeCompare(b.time))
              .map((r, idx) => {
                const origIdx = reminders.indexOf(r);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-2xl border border-glow/20 bg-card/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Bell className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{FULL_DAYS[Number(r.day) - 1]}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">{r.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeReminder(origIdx)}
                      disabled={saving}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors disabled:opacity-40"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}