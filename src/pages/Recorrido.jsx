import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, ChevronRight, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { computeUnifiedStreak, JOURNEY } from "@/lib/journey";

const audioMeta = {
  beach: { name: "Mar tranquilo", icon: Sparkles },
  forest: { name: "Bosque", icon: Sparkles },
  healing: { name: "Frecuencias", icon: Sparkles },
  meditation21: { name: "Meditación 21", icon: Sparkles },
  rain: { name: "Lluvia", icon: Sparkles },
  bowls: { name: "Cuencos", icon: Sparkles }
};

export default function Recorrido() {
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
          base44.entities.JourneyProgress.list("-created_date", 100)
        ]);
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
  const streak = computeUnifiedStreak(sessions, diaryEntries, journey, tz);
  const currentDay = Math.min(streak + 1, 21);
  const todayJourney = JOURNEY[currentDay - 1];
  const audio = audioMeta[todayJourney.config.audio] || audioMeta.healing;
  const AudioIcon = audio.icon;

  const startToday = () => navigate("/meditar");

  return (
    <div className="space-y-10">
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
    </div>
  );
}