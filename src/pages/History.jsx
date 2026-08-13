import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SessionCard from "@/components/SessionCard";
import StatsOverview from "@/components/StatsOverview";
import { Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.MeditationSession.list("-created_date", 100);
        setSessions(list);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Tu historial</h1>
        <p className="text-sm text-muted-foreground mt-1">El viaje de tu práctica</p>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-accent animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-4">
            <Wind className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-medium">Aún no hay sesiones</p>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Comienza tu primera meditación</p>
          <button
            onClick={() => navigate("/meditar")}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-violet-600 text-white font-medium shadow-lg shadow-teal-600/20"
          >
            Meditar ahora
          </button>
        </div>
      ) : (
        <>
          <StatsOverview sessions={sessions} />
          <div className="space-y-2.5">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}