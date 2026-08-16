import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Clock, Waves, Trees, Sparkles, Calendar, ChevronRight, Flame } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StatsOverview from "@/components/StatsOverview";
import WeeklyStats from "@/components/WeeklyStats";
import SessionCard from "@/components/SessionCard";
import HowItWorks from "@/components/HowItWorks";
import { computeStreak, JOURNEY } from "@/lib/journey";

const audioMeta = {
  beach: { name: "Mar tranquilo", icon: Waves },
  forest: { name: "Bosque", icon: Trees },
  healing: { name: "Frecuencias", icon: Sparkles },
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

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

  const streak = computeStreak(sessions);
  const firstName = user?.full_name?.split(" ")[0] || "presencia";
  const recent = sessions.slice(0, 3);

  // Práctica de hoy según el recorrido de 21 días
  const currentDay = Math.min(streak + 1, 21);
  const todayJourney = JOURNEY[currentDay - 1];
  const audio = audioMeta[todayJourney.config.audio] || audioMeta.healing;
  const AudioIcon = audio.icon;

  const startToday = () =>
    navigate("/meditar", { state: { preset: { ...todayJourney.config, journeyDay: currentDay } } });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <header className="pt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.28em] uppercase text-primary/80 font-medium">AutoReiki</p>
          <h1 className="font-display text-[28px] font-semibold tracking-tight leading-tight mt-1.5">
            {greeting()}, {firstName}
          </h1>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1.5">
          <Flame className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold tabular-nums">{streak}/21</span>
        </div>
      </header>

      {/* Tarjeta principal */}
      <section className="relative overflow-hidden rounded-3xl bg-card border border-white/5 p-6">
        <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Sun className="w-5 h-5 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground tracking-wide">Vuelve a ti</p>
        <h2 className="font-display text-[22px] font-semibold leading-snug mt-2">
          Una pausa para escuchar lo que tu cuerpo ya sabe.
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Auto-Reiki guiado, a tu ritmo y con una señal clara en cada paso.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/meditar")}
            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity active:scale-[0.99]"
          >
            <Waves className="w-5 h-5" />
            <span className="text-sm">Meditación</span>
            <span className="text-[11px] font-normal opacity-80">5 · 10 · 30 min</span>
          </button>
          <button
            onClick={() => navigate("/configurar")}
            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border border-primary/40 bg-card text-foreground font-semibold hover:border-primary/60 transition-colors active:scale-[0.99]"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm">Sesión de Reiki</span>
            <span className="text-[11px] font-normal text-muted-foreground">30 · 45 · 60 · 90 min</span>
          </button>
        </div>
      </section>

      {/* Práctica de hoy */}
      <section
        onClick={startToday}
        className="rounded-3xl bg-card border border-white/5 p-5 cursor-pointer hover:border-primary/30 transition-colors"
      >
        <h2 className="font-display text-lg font-semibold">Tu práctica de hoy</h2>
        <p className="text-sm text-muted-foreground mt-1">Un espacio breve también puede cambiar tu día.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 border border-white/5 px-3 py-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-primary" /> {todayJourney.config.minutes} min
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 border border-white/5 px-3 py-1.5 text-xs">
            <AudioIcon className="w-3.5 h-3.5 text-primary" /> {audio.name}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/60 border border-white/5 px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Día {currentDay}
          </span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <span className="text-sm text-muted-foreground">Continuar preparación</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </section>

      {/* Datos */}
      {loading ? (
        <div className="h-24 rounded-2xl bg-card/60 animate-pulse" />
      ) : (
        <>
          <StatsOverview sessions={sessions} />
          {sessions.length > 0 && <WeeklyStats sessions={sessions} />}
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