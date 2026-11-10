import moment from "moment";
import { Calendar, Clock, Sparkles, StickyNote, Heart, CheckCircle2, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
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

// Detalle completo de una sesión pasada: duración, ajustes, ánimo y notas.
export default function SessionDetailDialog({ session, open, onOpenChange }) {
  if (!session) return null;

  const done = !!session.completed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border-primary/40 bg-gradient-to-b from-[rgba(46,20,74,0.96)] to-[rgba(18,8,34,0.98)] backdrop-blur-[10px]">
        <DialogHeader>
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-primary/80">
            {moment(session.created_date).format("dddd D [de] MMMM")}
          </p>
          <DialogTitle className="font-display text-2xl">
            {session.mode === "guided" ? "Sesión guiada" : "Sesión no guiada"}
          </DialogTitle>
          <p className="font-body text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {moment(session.created_date).format("HH:mm")} h
          </p>
        </DialogHeader>

        <div className="mt-1">
          <Row
            icon={done ? CheckCircle2 : Circle}
            label="Cómo terminó"
            value={done ? "Completada" : "Interrumpida antes de terminar"}
          />
          <Row
            icon={Clock}
            label="Duración"
            value={
              done
                ? `${formatDuration(session.actual_seconds)}${session.planned_minutes ? ` de ${session.planned_minutes} min planeados` : ""}`
                : `${formatDuration(session.actual_seconds)} de ${session.planned_minutes} min`
            }
          />
          <Row icon={Sparkles} label="Ambiente sonoro" value={AUDIO_NAMES[session.audio] || session.audio} />
          <Row icon={Sparkles} label="Nivel" value={LEVELS[session.level] || session.level} />
          <Row icon={Heart} label="Ánimo antes" value={MOOD_BEFORE[session.mood_before] || session.mood_before} />
          <Row icon={Heart} label="Ánimo después" value={MOOD_AFTER[session.mood_after] || session.mood_after} />

          <div className="flex items-start gap-3 pt-3">
            <StickyNote className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-body text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Tus notas</p>
              <p className="font-body text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
                {session.notes?.trim() ? session.notes : "Sin notas en esta sesión."}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}