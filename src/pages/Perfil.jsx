import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Flame } from "lucide-react";
import Badges from "@/components/Badges";
import ReminderSettings from "@/components/ReminderSettings";
import { computeStreak, computeBestStreak, getStreakMessage } from "@/lib/journey";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [u, list] = await Promise.all([
          base44.auth.me(),
          base44.entities.MeditationSession.list("-created_date", 100),
        ]);
        setUser(u);
        setSessions(list);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshUser = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
    } catch (e) {}
  };

  const tz = user?.reminder_timezone;
  const currentStreak = computeStreak(sessions, tz);
  const bestStreak = computeBestStreak(sessions, tz);
  const msg = getStreakMessage(currentStreak);

  return (
    <div className="space-y-7">
      <header className="text-center pt-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Tu perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? "Cargando…" : user?.full_name || user?.email || "Tu viaje de práctica"}
        </p>
      </header>

      {/* racha actual */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-accent/50 to-card/40 p-5 flex items-center gap-4 neon-glow">
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary/15 shrink-0">
          <Flame className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-3xl font-display font-semibold leading-none">
            {loading ? "–" : currentStreak}
            <span className="text-sm font-body font-normal text-muted-foreground ml-2">días consecutivos</span>
          </p>
          <p className="text-sm text-foreground/80 mt-1.5 leading-snug">{loading ? "" : msg.title}</p>
          <p className="text-xs text-muted-foreground leading-snug">{loading ? "" : msg.body}</p>
        </div>
      </div>

      {/* recordatorio diario */}
      {!loading && <ReminderSettings user={user} onSaved={refreshUser} />}

      {/* insignias */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Insignias</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-accent/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <Badges bestStreak={bestStreak} />
        )}
      </section>

      {/* siguiente meta */}
      {!loading && (
        <p className="text-center text-sm text-muted-foreground">
          {bestStreak >= 21
            ? "Has completado el recorrido. Sigue cultivando tu hábito sagrado."
            : `Mejor racha: ${bestStreak} días · sigue sumando para desbloquear tu próxima insignia.`}
        </p>
      )}
    </div>
  );
}