import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SessionForm from "@/components/SessionForm";
import MeditationRunner from "@/components/MeditationRunner";
import ReflectionForm from "@/components/ReflectionForm";
import { buildChakraScript } from "@/lib/guidedScripts";
import { unlockSpeech } from "@/lib/speech";

export default function Meditate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState("setup"); // setup | running | reflection
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);
  const [meditarHoy, setMeditarHoy] = useState(false);

  // Permite iniciar con un preset desde Recorrido o Configurar.
  useEffect(() => {
    const preset = location.state?.preset;
    if (preset) {
      unlockSpeech();
      const cfg = { ...preset };
      if (cfg.mode === "guided" && cfg.chakras && cfg.chakras.length) {
        cfg.customScript = buildChakraScript(cfg.chakras);
      }
      setConfig(cfg);
      setStage("running");
    }
  }, [location.state]);

  const start = (cfg) => {
    unlockSpeech();
    const finalCfg = { ...cfg };
    if (finalCfg.mode === "guided" && finalCfg.chakras && finalCfg.chakras.length) {
      finalCfg.customScript = buildChakraScript(finalCfg.chakras);
    }
    setConfig(finalCfg);
    setStage("running");
  };

  const finish = ({ actualSeconds, completed }) => {
    setResult({ actualSeconds, completed });
    setStage("reflection");
  };

  const save = async ({ moodAfter, notes }) => {
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
    }navigate("/historial");};

  if (stage === "running" && config) {
    return <MeditationRunner config={config} onFinish={finish} onCancel={() => setStage("setup")} />;
  }

  if (stage === "reflection" && config && result) {
    return <ReflectionForm config={config} actualSeconds={result.actualSeconds} onSave={save} />;
  }

  return (
    <div className="space-y-7">
      <header className="text-center pt-2">
        <p className="text-muted-foreground mt-1 [font-family:'Bodoni_Moda',_serif] text-xl">Configura tu espacio sagrado</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/recorrido")}
          className="text-left p-4 rounded-2xl border border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors active:scale-[0.99]">
          <p className="font-display text-lg font-semibold text-primary">Iniciar reto de 21 días</p>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">Sigue el recorrido guiado día a día.</p>
        </button>
        <button
          onClick={() => setMeditarHoy(true)}
          className={`text-left p-4 rounded-2xl border transition-colors active:scale-[0.99] ${
            meditarHoy ? "border-primary bg-accent neon-glow" : "border-white/10 bg-card/60 hover:border-primary/30"
          }`}>
          <p className="font-display text-lg font-semibold">Solo necesito meditar hoy</p>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">Configura una sesión a tu medida.</p>
        </button>
      </section>

      {meditarHoy && <SessionForm onStart={start} />}
    </div>);

}