import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MeditationRunner from "@/components/MeditationRunner";
import ReflectionForm from "@/components/ReflectionForm";
import { buildChakraScript, CHAKRAS } from "@/lib/guidedScripts";
import { unlockSpeech } from "@/lib/speech";
import { audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { sessionAudio } from "@/lib/sessionAudio";

export default function Meditate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState("setup"); // setup | running | reflection
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);
  const [journeyDay, setJourneyDay] = useState(null);
  const [mode, setMode] = useState("guided");
  const [userLevel, setUserLevel] = useState("beginner");

  useEffect(() => {
    base44.auth.me()
      .then((u) => setUserLevel(u?.practice_level || "beginner"))
      .catch(() => {});
  }, []);

  // Permite iniciar con un preset desde Recorrido o Configurar.
  useEffect(() => {
    const preset = location.state?.preset;
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

  const MODES = [
    { id: "guided", name: "Guiada", desc: "Asistente que te guía paso a paso" },
    { id: "unguided", name: "No guiada", desc: "Solo tú y el sonido ambiente" }
  ];

  const handleStart = () => {
    const chakras = CHAKRAS.map((c) => c.id);
    const audio = mode === "guided" ? "reikiGuided" : "bowls";
    start({ mode, level: userLevel, audio, minutes: 30, chakras });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center -ml-1">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Atrás"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <header>
        <h1 className="uppercase tracking-[0.14em] text-2xl font-display font-semibold">Configura tu espacio sagrado</h1>
      </header>

      <section className="grid grid-cols-2 gap-4">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex flex-col items-center justify-center text-center min-h-[110px] px-3 py-4 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] ${
                active ? "border-primary neon-glow scale-[1.01]" : "border-white/10 bg-card/60 hover:border-primary/40"
              }`}>
              <p className="font-semibold text-lg" style={{ color: active ? "hsl(var(--primary))" : undefined }}>{m.name}</p>
              <p className="text-muted-foreground mt-1.5 leading-snug text-sm max-w-[150px]">{m.desc}</p>
            </button>
          );
        })}
      </section>

      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 neon-glow active:scale-[0.99] transition-transform">
        Comenzar sesión
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );

}