import { useNavigate } from "react-router-dom";
import { MoonStar, CloudMoon, Hand } from "lucide-react";
import { CHAKRAS } from "@/lib/guidedScripts";
import { audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { sessionAudio } from "@/lib/sessionAudio";

const CARDS = [
  { id: "calma", Icon: MoonStar, title: "Calma rápida", minutes: 5, mode: "unguided", audio: "beach", chakras: [] },
  { id: "dormir", Icon: CloudMoon, title: "Antes de dormir", minutes: 10, mode: "unguided", audio: "rain", chakras: [] },
  { id: "manos", Icon: Hand, title: "Solo manos", minutes: 7, mode: "guided", audio: "reikiGuided", chakras: CHAKRAS.map((c) => c.id) },
];

export default function HomeQuickSelector({ level }) {
  const navigate = useNavigate();

  const handleSelect = (card) => {
    const trackId = card.audio;
    sessionAudio.unlock(audioUrlFor(trackId), { loop: !isVoiceTrack(trackId) });
    navigate("/meditar", {
      state: {
        preset: {
          mode: card.mode,
          level: level || "beginner",
          audio: trackId,
          minutes: card.minutes,
          chakras: card.chakras,
        },
      },
    });
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {CARDS.map((card) => {
        const Icon = card.Icon;
        return (
          <button
            key={card.id}
            onClick={() => handleSelect(card)}
            className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm p-4 aspect-square hover:border-primary/40 hover:bg-card/60 transition-all active:scale-[0.97]">
            <Icon className="w-7 h-7" style={{ color: "hsl(225 35% 62%)" }} />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground leading-tight">{card.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.minutes} min</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}