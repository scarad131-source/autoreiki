import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, Pause, Play, Square, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ambient } from "@/lib/audioEngine";
import { RELEASE_SCRIPTS, CHAKRAS } from "@/lib/guidedScripts";
import BreathingOrb from "@/components/BreathingOrb";
import { speak, cancelSpeech, COUNTDOWN_WORDS, unlockSpeech } from "@/lib/speech";
import { audioUrlFor } from "@/lib/audioSources";
import { Slider } from "@/components/ui/slider";

// Posición concisa de las manos por chakra para las instrucciones de voz
const HAND_HINTS = {
  root: "cerca de la pelvis",
  sacral: "debajo del ombligo",
  solar: "sobre el plexo solar, debajo de las costillas",
  heart: "en el centro del pecho",
  throat: "cerca de la garganta",
  third_eye: "entre las cejas",
  crown: "sobre la coronilla",
};

export default function MeditationRunner({ config, onFinish, onCancel }) {
  const totalSeconds = config.minutes * 60;
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const started = countdown === 0;

  const isGuided = config.mode === "guided";
  const isJourney = !!config.journeyDay;
  // Sesiones no guiadas simples (sin chakras y fuera del recorrido): sin voz,
  // únicamente el audio ambiental.
  const silentUnguided = !isGuided && !isJourney && !(config.chakras && config.chakras.length);
  // Voz extra (cuenta hablada, recordatorio de respiración y cierre) solo en
  // sesiones no guiadas con chakras (Reiki) y en el recorrido de 21 días.
  const voiceExtras = (!isGuided || isJourney) && !silentUnguided;
  const script = useMemo(() => {
    if (config.chakras && config.chakras.length) return null; // Reiki: secuencia de cuencos, sin narración guiada
    if (config.customScript) return config.customScript;
    if (!isGuided) return null;
    const m = config.minutes;
    const base = m <= 5 ? RELEASE_SCRIPTS.min5 : m <= 10 ? RELEASE_SCRIPTS.min10 : RELEASE_SCRIPTS.min20;
    if (isJourney) {
      return { ...base, steps: [{ seconds: 8, text: "Realiza tres respiraciones lentas y profundas." }, ...base.steps] };
    }
    return base;
  }, [config.customScript, config.minutes, isGuided, isJourney, config.chakras]);
  const scriptTotalSec = script ? script.steps.reduce((a, s) => a + s.seconds, 0) : 0;
  const voiceActive = script ? elapsed < scriptTotalSec : false;

  // Chakras a tratar y espaciado de cuencos: un cuenco por chakra repartido en la duración total
  const bowlChakras = useMemo(
    () => (config.chakras || []).map((id) => CHAKRAS.find((c) => c.id === id)).filter(Boolean),
    [config.chakras]
  );
  // Mínimo 3 minutos (180 s) de canalización por chakra
  const bowlIntervalSec = bowlChakras.length ? Math.max(180, (config.minutes * 60) / bowlChakras.length) : 0;
  const closingSpokenRef = useRef(false);
  const finishedRef = useRef(false);

  // desbloquear la síntesis de voz lo antes posible
  useEffect(() => {
    unlockSpeech();
  }, []);

  // cuenta regresiva de inicio (3 segundos)
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // cuenta regresiva hablada al inicio de toda sesión (no en sesiones no guiadas simples)
  useEffect(() => {
    if (countdown <= 0 || silentUnguided) return;
    speak(COUNTDOWN_WORDS[countdown]);
  }, [countdown, silentUnguided]);

  // desbloquear el audio ambiental al montar (gesto del usuario reciente) y mantenerlo silencioso durante la cuenta
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0;
    el.play().catch(() => {});
    return () => {
      try { el.pause(); } catch (e) {}
      cancelSpeech();
    };
  }, []);

  // al terminar la cuenta, subir el volumen del ambiental
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !started) return;
    el.volume = muted ? 0 : volume;
  }, [started, volume, muted]);

  // calcular paso actual guiado
  useEffect(() => {
    if (!started || !script) return;
    let acc = 0;
    for (let i = 0; i < script.steps.length; i++) {
      acc += script.steps[i].seconds;
      if (elapsed < acc) {
        setStepIndex(i);
        return;
      }
    }
    setStepIndex(script.steps.length - 1);
  }, [elapsed, script, started]);

  // timer
  useEffect(() => {
    if (!started || paused) return;
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, paused]);

  // pausa: detener audio ambiental y voz
  useEffect(() => {
    if (!started) return;
    const el = audioRef.current;
    if (paused) {
      if (el) el.pause();
      cancelSpeech();
    } else {
      if (el) el.play().catch(() => {});
    }
  }, [paused, started]);

  // voz guía + cuenco al cambiar de chakra
  useEffect(() => {
    if (!started || paused || !script) return;
    const step = script.steps[stepIndex];
    if (!step) return;
    if (step.bowl) ambient.playBowl(step.bowlFreq || 440);
    const delay = step.bowl ? 950 : 250;
    const t = setTimeout(() => speak(step.text), delay);
    return () => clearTimeout(t);
  }, [stepIndex, paused, script, started]);

  // Bienvenida tras la cuenta regresiva: Reiki (guiada o no) y sesiones no guiadas simples
  useEffect(() => {
    if (!started || silentUnguided) return;
    let msg;
    if (bowlChakras.length) {
      msg = `Realiza tres respiraciones lentas y profundas. Bienvenida a la sesión de Reiki. Hoy trabajaremos con ${bowlChakras.length} chakras. Deja que el sonido del cuenco marque cada cambio de posición.`;
    } else if (!isGuided) {
      msg = "Realiza tres respiraciones lentas y profundas.";
    } else {
      return; // guiada sin chakras: la narración abre la sesión
    }
    const t = setTimeout(() => speak(msg), 400);
    return () => clearTimeout(t);
  }, [started, bowlChakras.length, isGuided, silentUnguided]);

  // Secuencia de chakras (Reiki): cuenco + instrucción de voz según modo/nivel, luego
  // mínimo 3 min de silencio antes del siguiente chakra.
  useEffect(() => {
    if (!started || !bowlChakras.length) return;
    let cancelled = false;
    const timers = [];
    const welcomeMs = 12000;
    const runChakra = (i) => {
      if (cancelled || i >= bowlChakras.length) return;
      const c = bowlChakras[i];
      ambient.playBowl(c.freq, 0.7);
      timers.push(setTimeout(() => ambient.playBowl(c.freq, 0.7), 650));
      if (isGuided) {
        const text = config.level === "beginner"
          ? `Chakra ${c.name}. Posiciona tus manos ${HAND_HINTS[c.id]}, sin toque físico. Siente la energía que fluye.`
          : `Chakra ${c.name}.`;
        timers.push(setTimeout(() => { if (!cancelled) speak(text); }, 1400));
      }
      timers.push(setTimeout(() => runChakra(i + 1), bowlIntervalSec * 1000));
    };
    timers.push(setTimeout(() => runChakra(0), welcomeMs));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [started, bowlChakras, bowlIntervalSec, isGuided, config.level]);

  // voz de cierre en los últimos segundos (solo no guiadas y recorrido de 21 días)
  useEffect(() => {
    if (!started || !voiceExtras) return;
    if (elapsed >= totalSeconds - 10 && !closingSpokenRef.current) {
      closingSpokenRef.current = true;
      speak("Has terminado tu sesión del día de hoy. Éxito, amor y bendiciones para ti.");
    }
  }, [elapsed, totalSeconds, started, voiceExtras]);

  // fin de sesión
  useEffect(() => {
    if (!started || finishedRef.current) return;
    if (elapsed >= totalSeconds) {
      finishedRef.current = true;
      const el = audioRef.current;
      if (el) el.pause();
      if (!voiceExtras) {
        cancelSpeech();
        onFinish({ actualSeconds: totalSeconds, completed: true });
      } else {
        // dejar que la voz de cierre termine antes de salir
        setTimeout(() => onFinish({ actualSeconds: totalSeconds, completed: true }), 4000);
      }
    }
  }, [elapsed, totalSeconds, started, voiceExtras, onFinish]);

  useEffect(() => {
    const el = audioRef.current;
    if (el && started) el.volume = muted ? 0 : volume;
  }, [volume, muted, started]);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = (elapsed / totalSeconds) * 100;
  const currentStep = script ? script.steps[stepIndex] : null;
  const phase = elapsed % 10 < 4 ? "Inhala" : "Exhala";

  const handleStop = () => {
    const el = audioRef.current;
    if (el) el.pause();
    cancelSpeech();
    onFinish({ actualSeconds: elapsed, completed: elapsed >= totalSeconds * 0.5 });
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] justify-between py-6">
      <audio ref={audioRef} src={audioUrlFor(config.audio)} loop preload="auto" className="hidden" />

      <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors -ml-1"
          aria-label="Volver"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <span className="uppercase tracking-[0.18em]">
          {isGuided ? "Guiada" : "No guiada"} · {config.level === "beginner" ? "Principiante" : "Intermedio"}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
        <BreathingOrb active={started && !paused} label={countdown > 0 ? "Comienza" : paused ? "Pausa" : phase} />

        {countdown > 0 ? (
          <div className="text-center">
            <motion.p
              key={countdown}
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="text-7xl font-display font-light tabular-nums neon-text"
            >
              {countdown}
            </motion.p>
            <p className="text-xs text-muted-foreground mt-3 uppercase tracking-[0.18em]">Preparando tu espacio</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-5xl font-display font-light tracking-tight tabular-nums">
                {mm}:{ss}
              </p>
              <p className="text-xs text-muted-foreground mt-2 uppercase tracking-[0.18em]">
                {paused ? "En pausa" : "Respira con calma"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {currentStep && !paused && voiceActive && (
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
          </>
        )}
      </div>

      {/* barra de progreso */}
      <div className="w-full h-1 bg-accent rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-glow-cyan"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* volumen */}
      <div className="w-full max-w-[240px] flex items-center gap-3 mb-3">
        <button
          onClick={() => setMuted((m) => !m)}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Silenciar"
        >
          {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <Slider
          value={[muted ? 0 : volume]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={([v]) => { setVolume(v); setMuted(v === 0); }}
          className="flex-1"
          aria-label="Volumen"
        />
      </div>

      {/* controles */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setPaused((p) => !p)}
          disabled={countdown > 0}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-glow-cyan text-primary-foreground neon-glow transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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