import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Sparkles, Calendar, Flame, ArrowRight, User } from "lucide-react";
import { base44 } from "@/api/base44Client";
import WeeklyStats from "@/components/WeeklyStats";
import HomeQuickAccess from "@/components/HomeQuickAccess";
import Badges from "@/components/Badges";
import ReminderSettings from "@/components/ReminderSettings";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import HelpButton from "@/components/HelpButton";
import PersonalizationCard from "@/components/PersonalizationCard";
import { computeActiveDays, getStreakMessage, JOURNEY } from "@/lib/journey";
import { getDailyPhrase } from "@/lib/dailyPhrases";
import { Image } from "@/components/ui/image";
import { format } from "date-fns";

const HERO_ART =
  "https://media.base44.com/images/public/6a7d30a899098694894dbd88/5e7e162ba_siluetameditacionconchackras.webp";

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
  // Días completados del recorrido de 21 días (registros de JourneyProgress),
  // misma fuente que el calendario de "Recorrido" para que ambas vistas coincidan.
  const completedJourneyDays = new Set((journey || []).map((p) => p.day_number)).size;
  // Días activos totales (cualquier práctica): base para insignias y racha general.
  const activeDaysTotal = computeActiveDays(sessions, diaryEntries, journey, tz).size;
  const bestStreak = activeDaysTotal;
  const journeyProgress = Math.min(completedJourneyDays, 21);
  const msg = getStreakMessage(journeyProgress);
  const firstName = user?.preferred_name || user?.full_name?.split(" ")[0] || "presencia";
  const personalized = !!user?.practice_level;

  const refreshUser = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
    } catch (e) {}
  };

  // Práctica de hoy según el recorrido de 21 días
  const currentDay = Math.min(Math.max(1, completedJourneyDays), 21);
  const todayJourney = JOURNEY[currentDay - 1];
  const audio = audioMeta[todayJourney.config.audio] || audioMeta.healing;
  const AudioIcon = audio.icon;

  // Terapias agendadas para hoy (agenda Reiki)
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const schedule = user?.reiki_schedule || [];
  const todaySessions = (schedule.find((e) => e.date === todayStr)?.sessions || []).
  slice().
  sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-8">
      {/* Encabezado: saludo y subtítulo centrados, con el perfil debajo */}
      <header className="flex flex-col items-center text-center gap-4 pt-1">
        <div className="min-w-0">
          <h1 className="font-display !text-4xl md:!text-5xl font-semibold leading-tight">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-3 font-body text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Bienvenida a AutoReiki
          </p>
        </div>
        <button
          onClick={() => navigate("/mas")}
          aria-label="Tu perfil"
          className="w-14 h-14 shrink-0 rounded-full border border-primary/70 bg-white/5 backdrop-blur-[10px] flex items-center justify-center text-primary transition-transform active:scale-95"
        >
          <User className="w-6 h-6" strokeWidth={1.6} />
        </button>
      </header>

      {/* Ilustración principal */}
      <section className="flex flex-col items-center text-center">
        <div className="relative mb-6" style={{ height: "18rem", width: "18rem" }}>
          <div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.3) 0%, transparent 70%)" }}
          />
          <Image
            src={HERO_ART}
            alt="Silueta de meditación con chakras"
            className="relative block w-full h-full rounded-[20px] opacity-90"
            fittingType="fill"
          />
        </div>
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary">Vuelve a ti</p>
        <h2 className="font-display text-2xl font-semibold leading-snug mt-2 max-w-md">
          Equilibra tu cuerpo, despierta tu luz.
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm">
          Auto-Reiki guiado, a tu ritmo en cada paso.
        </p>
      </section>

      {/* Personalización breve */}
      {!personalized &&
      <PersonalizationCard user={user} onSaved={refreshUser} />
      }

      {/* Tarjeta principal: tu práctica de hoy */}
      <section className="rounded-[20px] border border-primary/50 bg-white/5 backdrop-blur-[10px] p-6 text-center">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
          Tu práctica de hoy
        </p>
        <h3 className="font-display text-2xl font-semibold leading-snug mt-3">{getDailyPhrase()}</h3>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-3 py-1 font-body text-[11px] text-foreground/85">
            <Calendar className="w-3.5 h-3.5 text-primary" strokeWidth={1.6} /> Día {currentDay} · 21 días
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-3 py-1 font-body text-[11px] text-foreground/85">
            <Clock className="w-3.5 h-3.5 text-primary" strokeWidth={1.6} /> {todayJourney.config.minutes} min
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-3 py-1 font-body text-[11px] text-foreground/85">
            <AudioIcon className="w-3.5 h-3.5 text-primary" strokeWidth={1.6} /> {audio.name}
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 px-4 py-3">
          <p className="font-body text-[9px] uppercase tracking-[0.24em] text-muted-foreground">Agenda hoy</p>
          {todaySessions.length > 0 ?
          <div className="mt-2 space-y-1">
              {todaySessions.map((s, i) =>
            <p key={i} className="font-body text-xs leading-snug text-primary">
                  <span className="tabular-nums font-semibold">{s.time}</span>
                  <span className="text-muted-foreground/70"> · </span>
                  {s.label || "Reiki"}
                </p>
            )}
            </div> :

          <p className="mt-2 font-body text-xs text-muted-foreground/70">Sin sesiones programadas</p>
          }
        </div>

        <button
          onClick={() => navigate("/configurar")}
          className="w-full mt-5 rounded-full bg-gradient-to-r from-primary to-bone text-primary-foreground font-body font-semibold py-3 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
        >
          Preparar mi sesión
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Galería de accesos */}
      <HomeQuickAccess />

      {/* Tu semana */}
      {!loading && sessions.length > 0 &&
      <WeeklyStats sessions={sessions} diaryEntries={diaryEntries} journeyProgress={journey} timezone={tz} />
      }

      {/* Tu perfil */}
      <section className="space-y-5">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Tu perfil</p>

        <div className="rounded-[20px] border border-primary/40 bg-white/5 backdrop-blur-[10px] p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary/15 border border-primary/40 shrink-0">
            <Flame className="w-7 h-7 text-primary" strokeWidth={1.6} />
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

        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-primary mb-3">Insignias</p>
          {loading ?
          <div className="flex flex-wrap justify-center gap-3">
              {[...Array(3)].map((_, i) =>
            <div key={i} className="w-36 h-28 rounded-2xl bg-white/5 animate-pulse" />
            )}
            </div> :

          <Badges bestStreak={bestStreak} />
          }
        </div>

        {!loading &&
        <p className="text-center font-body text-sm text-muted-foreground">
            {bestStreak >= 21 ?
          "Has completado el recorrido. Sigue cultivando tu hábito sagrado." :
          `Mejor racha: ${bestStreak} días · sigue sumando para desbloquear tu próxima insignia.`}
          </p>
        }
      </section>

      {!loading && <ReminderSettings user={user} onSaved={refreshUser} />}

      <div className="pt-4 pb-2 flex flex-col items-center gap-3">
        <HelpButton user={user} onSaved={refreshUser} />
        <DeleteAccountButton />
      </div>
    </div>);

}