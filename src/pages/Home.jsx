import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import StatsOverview from "@/components/StatsOverview";
import SessionCard from "@/components/SessionCard";
import HowItWorks from "@/components/HowItWorks";
import StreakBanner from "@/components/StreakBanner";
import { computeStreak } from "@/lib/journey";

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
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const recent = sessions.slice(0, 3);
  const streak = computeStreak(sessions);
  const firstName = user?.full_name?.split(" ")[0] || "alma";

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="text-center pt-2">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden neon-glow mb-4">
          <Image src={IMAGES.logo} alt="AutoReiki" className="w-full h-full" fittingType="fill" />
        </div>
        <p className="text-xs text-primary tracking-[0.24em] uppercase neon-text font-medium">AutoReiki</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-2 leading-tight">
          Tu guía personal de meditación y Reiki
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          Practica hoy con una guía clara, a tu ritmo y sin recordar cada paso.
        </p>
      </header>

      {/* CTA */}
      <button
        onClick={() => navigate("/meditar")}
        className="w-full rounded-3xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground p-5 text-left neon-glow hover:scale-[1.01] transition-transform flex items-center justify-between active:scale-[0.99]"
      >
        <div>
          <p className="font-heading text-lg font-semibold tracking-tight">Comenzar mi primera sesión</p>
          <p className="text-sm text-primary-foreground/80 mt-0.5">Elige tu ambiente y respira</p>
        </div>
        <ArrowRight className="w-5 h-5 text-primary-foreground/90" />
      </button>

      {/* Cita */}
      <div className="rounded-3xl border border-glow/20 bg-card/50 backdrop-blur-sm p-5">
        <Quote className="w-4 h-4 text-primary mb-2" />
        <p className="text-[15px] leading-relaxed font-light italic">{quote}</p>
      </div>

      {loading ? (
        <div className="h-24 rounded-2xl bg-accent/40 animate-pulse" />
      ) : (
        <>
          <StatsOverview sessions={sessions} />
          {sessions.length > 0 && <StreakBanner streak={streak} />}
        </>
      )}

      <HowItWorks />

      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sesiones recientes</h2>
            <button onClick={() => navigate("/historial")} className="text-xs text-primary font-medium">
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

      <p className="text-center text-[11px] text-muted-foreground/60 pt-2">Bienvenida de nuevo, {firstName} ✦</p>
    </div>
  );
}