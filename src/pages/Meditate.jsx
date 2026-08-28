import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SessionForm from "@/components/SessionForm";
import MeditationRunner from "@/components/MeditationRunner";
import ReflectionForm from "@/components/ReflectionForm";
import { buildChakraScript } from "@/lib/guidedScripts";
import { unlockSpeech } from "@/lib/speech";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import { audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { sessionAudio } from "@/lib/sessionAudio";
import PrepChecklist from "@/components/PrepChecklist";

export default function Meditate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState("setup"); // setup | running | reflection
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);
  const [meditarHoy, setMeditarHoy] = useState(false);
  const [journeyDay, setJourneyDay] = useState(null);

  // Permite iniciar con un preset desde Recorrido o Configurar.
  useEffect(() => {
    const preset = location.state?.preset;
    if (location.state?.meditarHoy) {
      setMeditarHoy(true);
    }
    if (location.state?.journeyDay) {
      setJourneyDay(location.state.journeyDay);
    }
    if (preset) {
      unlockSpeech();
      const cfg = { ...preset, journeyDay: location.state?.journeyDay ?? preset.journeyDay ?? null };
      if (cfg.mode === "guided" && cfg.chakras && cfg.chakras.length) {
        cfg.customScript = buildChakraScript(cfg.chakras);
      }
      setConfig(cfg);
      setStage("running");
    }
  }, [location.state]);

  const start = (cfg) => {
    unlockSpeech();
    const finalCfg = { ...cfg, journeyDay };
    if (finalCfg.mode === "guided" && finalCfg.chakras && finalCfg.chakras.length) {
      finalCfg.customScript = buildChakraScript(finalCfg.chakras);
    }
    // Desbloquea el audio dentro del gesto para que iOS permita reproducirlo.
    sessionAudio.unlock(audioUrlFor(finalCfg.audio), { loop: !isVoiceTrack(finalCfg.audio) });
    setConfig(finalCfg);
    setStage("running");
  };

  const finish = ({ actualSeconds, completed }) => {
    setResult({ actualSeconds, completed });
    setStage("reflection");
  };

  const save = async ({ moodAfter, notes }, to = "/") => {
    try {
      await base44.entities.MeditationSession.create({
        mode: config.mode,
        level: config.level,
        audio: config.audio,
        planned_minutes: config.minutes,
        actual_seconds: result.actualSeconds,
        mood_after: moodAfter,
        notes,
        completed: result.completed
      });
      if (config.journeyDay) {
        await base44.entities.JourneyProgress.create({ day_number: config.journeyDay });
      }
    } catch (e) {


      // ignore save errors
    }navigate(to);};

  if (stage === "running" && config) {
    return <MeditationRunner config={config} onFinish={finish} onCancel={() => navigate("/configurar")} />;
  }

  if (stage === "reflection" && config && result) {
    return (
      <ReflectionForm
        config={config}
        actualSeconds={result.actualSeconds}
        onSave={save}
        onRepeat={() => setStage("running")}
      />
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center -ml-1">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Atrás"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <header className="text-center pt-0">
        <p className="text-muted-foreground mt-1 [font-family:'Bodoni_Moda',_serif] text-xl">Configura tu espacio sagrado</p>
      </header>

      {!meditarHoy && (
        <PrepChecklist />
      )}

      {!meditarHoy && (
        <p className="text-center text-sm text-muted-foreground italic">
          Recuerda tener tu checklist listo antes de iniciar tu terapia
        </p>
      )}

      {!meditarHoy && (
        <section className="flex flex-col items-center gap-3">
          <button
            onDoubleClick={() => setMeditarHoy(true)}
            className="group text-left rounded-2xl border border-border bg-card hover:border-primary hover:bg-accent/50 hover:shadow-[0_0_20px_6px_hsl(270_80%_55%/0.20)] transition-all active:scale-[0.99] inline-flex items-center gap-2.5 px-2.5 py-2 w-fit max-w-full">
            <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/40 transition-all">
              <Image src={IMAGES.meditarHoyBtn} alt="Meditar hoy" className="w-full h-full block" fittingType="fill" quality={68} />
            </div>
            <div>
              <p className="font-display text-base font-semibold leading-tight whitespace-nowrap group-hover:text-primary transition-colors">Solo necesito meditar hoy</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug whitespace-nowrap">Configura una sesión a tu medida.</p>
            </div>
          </button>
          <button
            onDoubleClick={() => navigate("/recorrido")}
            className="group text-left rounded-2xl border border-primary/40 bg-card hover:border-primary hover:bg-accent/50 hover:shadow-[0_0_22px_6px_hsl(270_80%_55%/0.28)] transition-all active:scale-[0.99] inline-flex items-center gap-2.5 px-2.5 py-2 w-fit max-w-full">
            <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all">
              <Image src={IMAGES.meditar21Btn} alt="Reto 21 días" className="w-full h-full block" fittingType="fill" quality={68} />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-primary leading-tight whitespace-nowrap group-hover:text-primary-hover transition-colors">Iniciar reto de 21 días</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug whitespace-nowrap">Sigue el recorrido guiado día a día.</p>
            </div>
          </button>
        </section>
      )}

      {meditarHoy && <SessionForm onStart={start} />}
    </div>);

}