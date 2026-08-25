import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SessionCard from "@/components/SessionCard";

export default function Historial() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.MeditationSession.list("-created_date", 200);
        setSessions(list);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          aria-label="Volver"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-[11px] tracking-[0.22em] uppercase text-primary/80 font-medium">AutoReiki</p>
          <h1 className="font-display text-2xl font-semibold leading-tight">Historial de sesiones</h1>
        </div>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-card/60 animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-glow/15 bg-card/50 p-10 text-center">
          <p className="font-display text-lg text-foreground">Aún no hay sesiones registradas</p>
          <p className="text-sm text-muted-foreground mt-1.5">
            Cuando completes una meditación, aparecerá aquí tu historial completo.
          </p>
          <button
            onClick={() => navigate("/meditar")}
            className="mt-5 rounded-full bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-semibold px-6 py-2.5 neon-glow active:scale-[0.99] transition-transform"
          >
            Comenzar a meditar
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}