import { useState } from "react";
import { base44 } from "@/api/base44Client";
import SessionForm from "@/components/SessionForm";
import MeditationRunner from "@/components/MeditationRunner";
import ReflectionForm from "@/components/ReflectionForm";
import { useNavigate } from "react-router-dom";

export default function Meditate() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("setup"); // setup | running | reflection
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);

  const start = (cfg) => {
    setConfig(cfg);
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
        completed: result.completed,
      });
    } catch (e) {
      // ignore save errors
    }
    navigate("/historial");
  };

  if (stage === "running" && config) {
    return <MeditationRunner config={config} onFinish={finish} onCancel={() => setStage("setup")} />;
  }

  if (stage === "reflection" && config && result) {
    return <ReflectionForm config={config} actualSeconds={result.actualSeconds} onSave={save} />;
  }

  return (
    <div className="space-y-6">
      <header className="text-center pt-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Nueva sesión</h1>
        <p className="text-sm text-muted-foreground mt-1">Configura tu espacio sagrado</p>
      </header>
      <SessionForm onStart={start} />
    </div>
  );
}