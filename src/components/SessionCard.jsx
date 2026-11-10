import { Waves, Trees, Sparkles, CloudRain, Calendar, ChevronRight, Music } from "lucide-react";
import moment from "moment";
import { audioLabel } from "@/lib/sessionLabels";

const iconMap = { beach: Waves, rain: CloudRain, forest: Trees, healing: Sparkles, bowls: Music };
const audioIcons = {
  beach: Waves,
  rain: CloudRain,
  forest: Trees,
  bowls: Music,
  healing: Sparkles,
  meditation21: Sparkles,
  reikiGuided: Sparkles,
  reikiGuided26: Sparkles,
};

export default function SessionCard({ session, onOpen }) {
  const Icon = audioIcons[session.audio] || iconMap[session.audio] || Sparkles;
  const mins = Math.round((session.actual_seconds || session.planned_minutes * 60) / 60);

  return (
    <button
      type="button"
      onClick={() => onOpen && onOpen(session)}
      className="w-full text-left flex items-center gap-3.5 p-3.5 rounded-2xl border border-glow/20 bg-card/50 backdrop-blur-sm hover:border-primary/50 active:scale-[0.995] transition-all"
      aria-label="Ver detalles de la sesión"
    >
      <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {session.mode === "guided" ? "Guiada" : "No guiada"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
          <Calendar className="w-3 h-3" />
          {moment(session.created_date).format("DD MMM, HH:mm")} · {audioLabel(session.audio)} · {mins} min
          {session.notes?.trim() ? <span className="text-primary/80">· con notas</span> : null}
        </p>
      </div>
      {session.completed ? (
        <span className="text-[10px] px-2 py-1 rounded-full bg-primary/20 text-primary font-medium shrink-0 neon-text">
          ✓
        </span>
      ) : (
        <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-muted-foreground font-medium shrink-0">
          Incompleta
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}