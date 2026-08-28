import { useNavigate } from "react-router-dom";
import { MoonStar, Hand } from "lucide-react";
import { Image } from "@/components/ui/image";
import { CHAKRAS } from "@/lib/guidedScripts";
import { audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { sessionAudio } from "@/lib/sessionAudio";

const CARDS = [
  { id: "calma", Icon: MoonStar, title: "Calma rápida", minutes: 5, mode: "unguided", audio: "beach", chakras: [] },
  { id: "dormir", image: "https://media.base44.com/images/public/6a7d30a899098694894dbd88/9076803fa_botonantesdedormir.png", title: "Antes de dormir", minutes: 10, mode: "unguided", audio: "rain", chakras: [] },
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
            className="relative flex flex-col items-center justify-end gap-2 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-sm overflow-hidden aspect-square hover:border-primary/40 transition-all active:scale-[0.97]">
            {card.image ? (
              <>
                <Image
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full"
                  fittingType="fill"
                />
                <div className="relative w-full text-center pb-2.5 pt-8 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm font-semibold text-white leading-tight">{card.title}</p>
                </div>
              </>
            ) : (
              <>
                <Icon className="w-7 h-7" style={{ color: "hsl(225 35% 62%)" }} />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground leading-tight">{card.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.minutes} min</p>
                </div>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}