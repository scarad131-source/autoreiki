import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CHAKRAS } from "@/lib/guidedScripts";
import { audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { sessionAudio } from "@/lib/sessionAudio";

const TIMES = [15, 30, 45];
const GOALS = [
  { id: "calma", label: "Calma" },
  { id: "enfoque", label: "Enfoque" },
  { id: "reiki", label: "Practicar Reiki" }
];

const SUGGESTIONS = {
  calma: { title: "Meditación de calma", desc: "sonido ambiental y respiración", mode: "unguided", audio: "beach" },
  enfoque: { title: "Enfoque mental", desc: "ambiente sonoro y quietud", mode: "unguided", audio: "forest" },
  reiki: { title: "Autotratamiento guiado", desc: "avisos visuales y sonoros", mode: "guided", audio: "reikiGuided" }
};

export default function HomeQuickSelector({ level }) {
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState(15);
  const [goal, setGoal] = useState("reiki");
  const s = SUGGESTIONS[goal];
  const chakras = goal === "reiki" ? CHAKRAS.map((c) => c.id) : [];

  const handleUse = () => {
    const trackId = s.audio;
    sessionAudio.unlock(audioUrlFor(trackId), { loop: !isVoiceTrack(trackId) });
    navigate("/meditar", {
      state: {
        preset: {
          mode: s.mode,
          level: level || "beginner",
          audio: trackId,
          minutes,
          chakras
        }
      }
    });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-card/80 p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-primary">Selector rápido</p>
      <h3 className="text-lg font-semibold mt-1">¿Qué necesitas hoy?</h3>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Tengo</p>
        <div className="flex flex-wrap gap-2">
          {TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setMinutes(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                minutes === t
                  ? "bg-gradient-to-r from-amber-light to-primary text-primary-foreground"
                  : "border border-white/10 bg-background/60 text-foreground hover:border-primary/40"
              }`}>
              {t} min
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Busco</p>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                goal === g.id
                  ? "bg-gradient-to-r from-amber-light to-primary text-primary-foreground"
                  : "border border-white/10 bg-background/60 text-foreground hover:border-primary/40"
              }`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-background/40 p-3.5">
        <p className="text-xs text-muted-foreground">Ruta sugerida</p>
        <p className="text-sm font-semibold text-primary mt-0.5">{s.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{minutes} minutos · {s.desc}</p>
      </div>

      <button
        onClick={handleUse}
        className="w-full mt-3 rounded-xl border border-white/10 bg-background/60 text-foreground font-medium py-3 flex items-center justify-center gap-2 hover:border-primary/40 active:scale-[0.99] transition-all">
        Usar esta recomendación
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}