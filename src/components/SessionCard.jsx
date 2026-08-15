import { Waves, Trees, Sparkles, CloudRain, Disc3, Calendar } from "lucide-react";
import moment from "moment";

const iconMap = { beach: Waves, rain: CloudRain, forest: Trees, bowls: Disc3, healing: Sparkles };
const audioNames = { beach: "Mar", rain: "Lluvia", forest: "Bosque", bowls: "Cuencos", healing: "Frecuencias" };

export default function SessionCard({ session }) {
  const Icon = iconMap[session.audio] || Sparkles;
  const mins = Math.round((session.actual_seconds || session.planned_minutes * 60) / 60);

  return (
    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-glow/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
      <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium capitalize">
            {session.mode === "guided" ? "Guiada" : "No guiada"}
          </p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-muted-foreground capitalize">
            {session.level === "beginner" ? "Principiante" : "Intermedio"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {moment(session.created_date).format("DD MMM, HH:mm")} · {audioNames[session.audio]} · {mins} min
        </p>
      </div>
      {session.completed && (
        <span className="text-[10px] px-2 py-1 rounded-full bg-primary/20 text-primary font-medium shrink-0 neon-text">
          ✓
        </span>
      )}
    </div>
  );
}