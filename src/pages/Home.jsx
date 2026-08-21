import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Sparkles, Calendar, ChevronRight, Flame, BookOpen } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StatsOverview from "@/components/StatsOverview";
import WeeklyStats from "@/components/WeeklyStats";
import SessionCard from "@/components/SessionCard";
import HowItWorks from "@/components/HowItWorks";
import { computeStreak, JOURNEY } from "@/lib/journey";

const audioMeta = {
  beach: { name: "Mar tranquilo", icon: Sparkles },
  forest: { name: "Bosque", icon: Sparkles },
  healing: { name: "Frecuencias", icon: Sparkles }
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

  const tz = user?.reminder_timezone;
  const streak = computeStreak(sessions, tz);
  const firstName = user?.full_name?.split(" ")[0] || "presencia";
  const recent = sessions.slice(0, 3);

  // Práctica de hoy según el recorrido de 21 días
  const currentDay = Math.min(streak + 1, 21);
  const todayJourney = JOURNEY[currentDay - 1];
  const audio = audioMeta[todayJourney.config.audio] || audioMeta.healing;
  const AudioIcon = audio.icon;

  const startToday = () => navigate("/meditar");

  const navRows = [
    { label: "Sesión de Reiki", icon: Sparkles, to: "/configurar" },
    { label: "Recorrido 21 días", icon: Calendar, to: "/recorrido" },
    { label: "Diario", icon: BookOpen, to: "/diario" },
    { label: "Historial", icon: Clock, to: "/historial" }
  ];

  return (
    <div className="space-y-10">
      {/* Encabezado */}
      <header className="pt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.28em] uppercase text-primary/80 font-medium">AutoReiki</p>
          <h1 className="font-display text-[26px] font-semibold tracking-tight leading-tight mt-1.5">
            {greeting()}, {firstName}
          </h1>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1.5">
          <Flame className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold tabular-nums">{streak}/21</span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center pt-2">
        <div
          className="h-40 w-40 rounded-full mb-7"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, hsl(38 80% 66% / 0.55), hsl(255 92% 76% / 0.20) 42%, transparent 72%)",
            filter: "blur(6px)"
          }}
        />
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Vuelve a ti</p>
        <h2 className="font-display text-3xl font-semibold leading-snug mt-3 max-w-md">
          Una pausa para escuchar lo que tu cuerpo ya sabe.
        </h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-sm">
          Auto-Reiki guiado, a tu ritmo y con una señal clara en cada paso.
        </p>
        <button
          onClick={() => navigate("/meditar")}
          className="mt-6 rounded-full bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-semibold px-7 py-3 neon-glow active:scale-[0.99] transition-transform"
        >
          Comenzar a meditar
        </button>
      </section>

      {/* Práctica de hoy */}
      <section
        onClick={startToday}
        className="cursor-pointer rounded-2xl border border-primary/20 bg-primary/5 p-4 hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Tu práctica de hoy</p>
            <p className="font-display text-lg font-semibold mt-0.5 truncate">{todayJourney.title}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-primary shrink-0" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" /> {todayJourney.config.minutes} min
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            <AudioIcon className="w-3.5 h-3.5 text-primary" /> {audio.name}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Día {currentDay}
          </span>
        </div>
      </section>

      {/* Lista de navegación */}
      <nav className="border-t border-white/5">
        {navRows.map(({ label, icon: Icon, to }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="flex w-full items-center gap-4 py-4 border-b border-white/5 text-left hover:bg-white/[0.02] transition-colors">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-primary border border-white/5">
              <Icon className="w-4 h-4" />
            </span>
            <span className="flex-1 text-sm font-medium">{label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </nav>

      {/* Datos */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Datos</h2>
        {loading ? (
          <div className="h-24 rounded-2xl bg-card/60 animate-pulse" />
        ) : (
          <StatsOverview sessions={sessions} timezone={tz} />
        )}
      </section>

      {/* Semana */}
      {!loading && sessions.length > 0 && <WeeklyStats sessions={sessions} timezone={tz} />}

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