import moment from "moment";
import {
  CalendarDays,
  Clock,
  Sparkles,
  StickyNote,
  Heart,
  CheckCircle2,
  CircleSlash,
  Waves,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const AUDIO_NAMES = {
  beach: "Mar",
  rain: "Lluvia",
  forest: "Bosque",
  healing: "Frecuencias sanadoras",
  bowls: "Cuencos tibetanos",
};

const MOOD_BEFORE = {
  calm: "En calma",
  anxious: "Ansioso",
  tired: "Cansado",
  stressed: "Estresado",
  neutral: "Neutral",
};

const MOOD_AFTER = {
  relaxed: "Relajado",
  centered: "Centrado",
  energized: "Energizado",
  peaceful: "En paz",
  neutral: "Neutral",
};

const LEVELS = { beginner: "Principiante", intermediate: "Intermedio" };

function formatDuration(seconds) {
  if (!seconds || seconds < 60) return `${Math.round(seconds || 0)} s`;
  return `${Math.round(seconds / 60)} min`;
}

function Row({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="font-body text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <p className="font-body text-sm text-foreground mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

// Ventanita de detalle de una sesión pasada. Se cierra con la ✕, tocando fuera
// o con el botón "Cerrar".
export default function SessionDetailDialog({ session, open, onOpenChange }) {
  if (!session) return null;

  const done = !!session.completed;
  const date = moment(session.created_date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl border-primary/40 bg-gradient-to-b from-[rgba(46,20,74,0.96)] to-[rgba(18,8,34,0.98)] p-5 gap-3 backdrop-blur-[10px]">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="font-display text-xl">Detalle de la sesión</DialogTitle>
          <DialogDescription className="font-body text-xs text-muted-foreground">
            {session.mode === "guided" ? "Meditación guiada" : "Meditación no guiada"}
          </DialogDescription>
        </DialogHeader>

        <div>
          <Row icon={CalendarDays} label="Día" value={date.format("dddd D [de] MMMM [de] YYYY")} />
          <Row icon={Clock} label="Hora" value={`${date.format("HH:mm")} h`} />
          <Row
            icon={done ? CheckCircle2 : CircleSlash}
            label="Estado de la sesión"
            value={done ? "Completada" : "Interrumpida antes de terminar"}
          />
          <Row
            icon={Clock}
            label="Duración"
            value={
              session.planned_minutes
                ? `${formatDuration(session.actual_seconds)} de ${session.planned_minutes} min`
                : formatDuration(session.actual_seconds)
            }
          />
          <Row icon={Waves} label="Ambiente sonoro" value={AUDIO_NAMES[session.audio] || session.audio} />
          <Row icon={Sparkles} label="Nivel" value={LEVELS[session.level] || session.level} />
          <Row icon={Heart} label="Ánimo antes" value={MOOD_BEFORE[session.mood_before] || session.mood_before} />
          <Row icon={Heart} label="Ánimo después" value={MOOD_AFTER[session.mood_after] || session.mood_after} />

          <div className="flex items-start gap-3 pt-3">
            <StickyNote className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-body text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Notas</p>
              <p className="font-body text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
                {session.notes?.trim() ? session.notes : "Sin notas en esta sesión."}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-body text-sm font-semibold active:scale-[0.99] transition-transform"
        >
          Cerrar
        </button>
      </DialogContent>
    </Dialog>
  );
}