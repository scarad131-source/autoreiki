import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Sparkles, Calendar, Flame } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StatsOverview from "@/components/StatsOverview";
import WeeklyStats from "@/components/WeeklyStats";
import SessionCard from "@/components/SessionCard";
import Badges from "@/components/Badges";
import ReminderSettings from "@/components/ReminderSettings";
import { computeActiveDays, getStreakMessage, JOURNEY } from "@/lib/journey";
import { getDailyPhrase } from "@/lib/dailyPhrases";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import { format } from "date-fns";

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
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        const [list, diary, prog] = await Promise.all([
        base44.entities.MeditationSession.list("-created_date", 100),
        base44.entities.DiaryEntry.list("-created_date", 100),
        base44.entities.JourneyProgress.list("-created_date", 100)]
        );
        setSessions(list);
        setDiaryEntries(diary);
        setJourney(prog);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tz = user?.reminder_timezone;
  // Fuente única de verdad: días activos totales (cualquier práctica). No se
  // reinicia al faltar un día, así refleja siempre el avance real del usuario
  // y coincide en todos los módulos (Tu semana, Tu perfil, Insignias, Tu práctica).
  const activeDaysTotal = computeActiveDays(sessions, diaryEntries, journey, tz).size;
  const bestStreak = activeDaysTotal;
  const msg = getStreakMessage(activeDaysTotal);
  const firstName = user?.full_name?.split(" ")[0] || "presencia";
  const journeyProgress = Math.min(activeDaysTotal, 21);

  const refreshUser = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
    } catch (e) {}
  };
  const recent = sessions.slice(0, 3);

  // Práctica de hoy según el recorrido de 21 días
  const currentDay = Math.min(activeDaysTotal + 1, 21);
  const todayJourney = JOURNEY[currentDay - 1];
  const audio = audioMeta[todayJourney.config.audio] || audioMeta.healing;
  const AudioIcon = audio.icon;

  // Terapias agendadas para hoy (agenda Reiki)
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const schedule = user?.reiki_schedule || [];
  const todaySessions = (schedule.find((e) => e.date === todayStr)?.sessions || [])
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time));

  const quickActions = [
  { label: "Diario", img: IMAGES.diarioBtn, to: "/diario" },
  { label: "Ayuda", img: IMAGES.ayudaBtn, to: "/ayuda" },
  { label: "Historial", img: IMAGES.historialBtn, to: "/historial" }];


  return (
    <div className="space-y-10">
      {/* Encabezado */}
      <header className="pt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.28em] uppercase text-primary/80 font-medium">AutoReiki</p>
          <h1 className="font-display text-[26px] font-semibold tracking-tight leading-tight mt-1.5">
            Bienvenido(a), {firstName}
          </h1>
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
          }} />
        
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Vuelve a ti</p>
        <h2 className="font-display text-3xl font-semibold leading-snug mt-3 max-w-md">
          Una pausa para escuchar lo que tu cuerpo ya sabe.
        </h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-sm">
          Auto-Reiki guiado, a tu ritmo y con una señal clara en cada paso.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate("/meditar")}
            className="rounded-full bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-semibold px-7 py-3 neon-glow active:scale-[0.99] transition-transform">
            
            Comenzar a meditar
          </button>
          <button
            onClick={() => navigate("/configurar")}
            className="rounded-full border border-primary/40 bg-card/60 text-foreground font-semibold px-7 py-3 hover:bg-accent active:scale-[0.99] transition-transform">
            
            Sesión de Reiki
          </button>
          <button
            onClick={() => navigate("/guia-meditacion")}
            className="rounded-full border border-glow-cyan/40 bg-glow-cyan/10 text-foreground font-semibold px-7 py-3 hover:bg-glow-cyan/20 active:scale-[0.99] transition-transform flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-glow-cyan" />
            Guía IA
          </button>
        </div>
      </section>

      {/* Práctica de hoy */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Tu práctica de hoy</p>
            <p className="font-display text-lg font-semibold mt-0.5 leading-snug">
              {getDailyPhrase()}
            </p>
          </div>
          <div className="shrink-0 border-l border-white/10 pl-4 text-right max-w-[45%]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-body">Agenda hoy</p>
            {todaySessions.length > 0 ? (
              <div className="mt-1 space-y-1">
                {todaySessions.map((s, i) => (
                  <div key={i} className="font-body text-xs leading-snug" style={{ color: "rgb(94, 234, 212)" }}>
                    <span className="tabular-nums font-semibold">{s.time}</span>
                    <span className="text-muted-foreground/70"> · </span>
                    {s.label || "Reiki"}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-xs text-muted-foreground/60 mt-1">Sin sesiones</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Día {currentDay} · 21 días
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" /> {todayJourney.config.minutes} min
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            <AudioIcon className="w-3.5 h-3.5 text-primary" /> {audio.name}
          </span>
        </div>
      </section>

      {/* Accesos rápidos */}
      <nav className="grid grid-cols-3 gap-3 mx-5">
        {quickActions.map(({ label, img, to }) =>
        <button
          key={to}
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/8 bg-card/50 hover:border-primary/40 hover:bg-accent/40 transition-colors active:scale-[0.98] px-3 py-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10">
              <Image src={img} alt={label} className="w-full h-full block" fittingType="fill" />
            </div>
            <span className="text-sm font-medium tracking-wide">{label}</span>
          </button>
        )}
      </nav>

      {/* Datos */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Datos</h2>
        {loading ?
        <div className="h-24 rounded-2xl bg-card/60 animate-pulse" /> :

        <StatsOverview sessions={sessions} timezone={tz} />
        }
      </section>

      {/* Semana */}
      {!loading && sessions.length > 0 && <WeeklyStats sessions={sessions} diaryEntries={diaryEntries} journeyProgress={journey} timezone={tz} />}

      {/* Tu perfil */}
      <section className="space-y-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tu perfil</h2>

        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-accent/50 to-card/40 p-5 flex items-center gap-4 neon-glow">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary/15 shrink-0">
            <Flame className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-3xl font-display font-semibold leading-none">
              {loading ? "–" : journeyProgress}
              <span className="text-sm font-body font-normal text-muted-foreground ml-2">/ 21 días del recorrido</span>
            </p>
            <p className="text-sm text-foreground/80 mt-1.5 leading-snug">{loading ? "" : msg.title}</p>
            <p className="text-xs text-muted-foreground leading-snug">{loading ? "" : msg.body}</p>
          </div>
        </div>

        {!loading && <ReminderSettings user={user} onSaved={refreshUser} />}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Insignias</h3>
          {loading ?
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) =>
            <div key={i} className="h-44 rounded-2xl bg-accent/30 animate-pulse" />
            )}
            </div> :

          <Badges bestStreak={bestStreak} />
          }
        </div>

        {!loading &&
        <p className="text-center text-sm text-muted-foreground">
            {bestStreak >= 21 ?
          "Has completado el recorrido. Sigue cultivando tu hábito sagrado." :
          `Mejor racha: ${bestStreak} días · sigue sumando para desbloquear tu próxima insignia.`}
          </p>
        }
      </section>

      {recent.length > 0 &&
      <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sesiones recientes</h2>
            <button onClick={() => navigate("/historial")} className="text-xs text-primary font-medium">
              Ver todas
            </button>
          </div>
          <div className="space-y-2.5">
            {recent.map((s) =>
          <SessionCard key={s.id} session={s} />
          )}
          </div>
        </section>
      }

      <p className="text-center text-[11px] text-muted-foreground/60 pt-2">Bienvenida de nuevo, {firstName} ✦</p>
    </div>);

}