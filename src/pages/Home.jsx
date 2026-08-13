import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, ArrowRight, Quote } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StatsOverview from "@/components/StatsOverview";
import SessionCard from "@/components/SessionCard";

const QUOTES = [
  "Cada respiración es una oportunidad de volver al presente.",
  "La calma no se busca, se permite.",
  "Donde va la atención, fluye la energía.",
  "Hoy no tienes que hacerlo todo. Solo respirar.",
];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        const list = await base44.entities.MeditationSession.list("-created_date", 50);
        setSessions(list);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const recent = sessions.slice(0, 3);
  const firstName = user?.full_name?.split(" ")[0] || "alma";

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm text-muted-foreground">Bienvenida de nuevo</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-0.5 capitalize">{firstName}</h1>
      </header>

      {/* cita del día */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-500/10 to-violet-500/10 border border-teal-200/40 p-5">
        <Quote className="w-4 h-4 text-teal-600 mb-2" />
        <p className="text-[15px] leading-relaxed font-light italic">{quote}</p>
      </div>

      {/* CTA principal */}
      <button
        onClick={() => navigate("/meditar")}
        className="w-full rounded-3xl bg-gradient-to-br from-teal-600 to-violet-600 text-white p-6 text-left shadow-xl shadow-teal-600/20 hover:shadow-teal-600/30 transition-all active:scale-[0.99] flex items-center justify-between"
      >
        <div>
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <Wind className="w-5 h-5 text-white" />
          </div>
          <p className="font-display text-xl font-semibold">Empezar a meditar</p>
          <p className="text-sm text-white/80 mt-0.5">Elige tu ambiente y respira</p>
        </div>
        <ArrowRight className="w-5 h-5 text-white/90" />
      </button>

      {loading ? (
        <div className="h-24 rounded-2xl bg-accent animate-pulse" />
      ) : (
        <StatsOverview sessions={sessions} />
      )}

      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sesiones recientes</h2>
            <button onClick={() => navigate("/historial")} className="text-xs text-teal-600 font-medium">
              Ver todas
            </button>
          </div>
          <div className="space-y-2.5">
            {recent.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}