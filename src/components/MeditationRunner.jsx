import { useState, useEffect, useRef } from "react";
import { Pause, Play, Square, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ambient } from "@/lib/audioEngine";
import { GUIDED_SCRIPTS } from "@/lib/guidedScripts";
import BreathingOrb from "@/components/BreathingOrb";

export default function MeditationRunner({ config, onFinish, onCancel }) {
  const totalSeconds = config.minutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const timerRef = useRef(null);

  const isGuided = config.mode === "guided";
  let script = config.customScript || null;
  if (!script && isGuided) {
    if (config.level === "beginner") {
      const day = new Date().getDay();
      script = day % 2 === 0 ? GUIDED_SCRIPTS.beginner : GUIDED_SCRIPTS.beginner2;
    } else {
      script = GUIDED_SCRIPTS.intermediate;
    }
  }

  // calcular paso actual guiado
  useEffect(() => {
    if (!script) return;
    let acc = 0;
    for (let i = 0; i < script.steps.length; i++) {
      acc += script.steps[i].seconds;
      if (elapsed < acc) {
        setStepIndex(i);
        return;
      }
    }
    setStepIndex(script.steps.length - 1);
  }, [elapsed, script]);

  // iniciar audio
  useEffect(() => {
    ambient.play(config.audio);
    ambient.setVolume(0.5);
    return () => ambient.stop();
  }, [config.audio]);

  // timer
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  // fin
  useEffect(() => {
    if (elapsed >= totalSeconds) {
      ambient.stop();
      onFinish({ actualSeconds: totalSeconds, completed: true });
    }
  }, [elapsed, totalSeconds]);

  useEffect(() => {
    ambient.setVolume(muted ? 0 : volume);
  }, [volume, muted]);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = (elapsed / totalSeconds) * 100;
  const currentStep = script ? script.steps[stepIndex] : null;
  const phase = elapsed % 10 < 4 ? "Inhala" : "Exhala";

  const handleStop = () => {
    ambient.stop();
    onFinish({ actualSeconds: elapsed, completed: elapsed >= totalSeconds * 0.5 });
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] justify-between py-6">
      <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
        <span className="uppercase tracking-[0.18em]">
          {isGuided ? "Guiada" : "No guiada"} · {config.level === "beginner" ? "Principiante" : "Intermedio"}
        </span>
        <button onClick={onCancel} className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Square className="w-3.5 h-3.5" /> Salir
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
        <BreathingOrb active={!paused} label={paused ? "Pausa" : phase} />

        <div className="text-center">
          <p className="text-5xl font-display font-light tracking-tight tabular-nums">
            {mm}:{ss}
          </p>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-[0.18em]">
            {paused ? "En pausa" : "Respira con calma"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {currentStep && !paused && (
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 1.2 }}
              className="max-w-md text-center px-2"
            >
              <p className="text-[15px] leading-relaxed text-foreground/90 font-light">{currentStep.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* barra de progreso */}
      <div className="w-full h-1 bg-accent rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-glow-cyan"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* controles */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMuted((m) => !m)}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-accent hover:bg-accent/70 transition-colors"
          aria-label="Silenciar"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setPaused((p) => !p)}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-glow-cyan text-primary-foreground neon-glow transition-transform active:scale-95"
          aria-label={paused ? "Reanudar" : "Pausar"}
        >
          {paused ? <Play className="w-6 h-6 ml-0.5" /> : <Pause className="w-6 h-6" />}
        </button>
        <button
          onClick={handleStop}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-accent hover:bg-accent/70 transition-colors"
          aria-label="Terminar"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}