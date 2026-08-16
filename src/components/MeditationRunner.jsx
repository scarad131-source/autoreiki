import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, Pause, Play, Square, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ambient } from "@/lib/audioEngine";
import { RELEASE_SCRIPTS, CHAKRAS } from "@/lib/guidedScripts";
import BreathingOrb from "@/components/BreathingOrb";

// Sonido ambiental único para todas las meditaciones (mar al amanecer).
// Se reproduce en bucle hasta completar el tiempo total de la sesión.
const AMBIENT_URL =
  "https://media.base44.com/videos/public/6a7d30a899098694894dbd88/af73fce44_sonidodeplayatranqullaalamanecer.mp4";

// Voz guía en español (síntesis del navegador, sin archivos externos)
let cachedVoices = [];
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

function pickFemaleEsVoice() {
  const pool = cachedVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
  const list = pool.length ? pool : cachedVoices;
  if (!list.length) return null;
  const female = list.find((v) =>
    /female|mujer|femenino|helena|laura|monic|paulina|sabina|marisol|lucia|soledad|esperanza|carmen|elvira|victoria|lorena|isabel/i.test(v.name)
  );
  return female || list[0];
}

function speak(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  u.rate = 0.58;
  u.pitch = 0.98;
  const v = pickFemaleEsVoice();
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

function cancelSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

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
  let script = config.customScript || null;
  if (!script && isGuided) {
    // Meditación guiada de liberación emocional (preparación para Reiki):
    // sesiones de 5, 10 y 20 min con su propio guion; el resto queda con ambientación.
    const m = config.minutes;
    script = m <= 5 ? RELEASE_SCRIPTS.min5 : m <= 10 ? RELEASE_SCRIPTS.min10 : RELEASE_SCRIPTS.min20;
  }
  const scriptTotalSec = script ? script.steps.reduce((a, s) => a + s.seconds, 0) : 0;
  const voiceActive = script ? elapsed < scriptTotalSec : false;

  // Chakras a tratar y espaciado de cuencos: un cuenco por chakra repartido en la duración total
  const bowlChakras = useMemo(
    () => (config.chakras || []).map((id) => CHAKRAS.find((c) => c.id === id)).filter(Boolean),
    [config.chakras]
  );
  const bowlIntervalSec = bowlChakras.length ? (config.minutes * 60) / bowlChakras.length : 0;
  const bowlIdxRef = useRef(0);
  const isReikiUnguided = !isGuided && bowlChakras.length > 0;

  // cuenta regresiva de inicio (3 segundos)
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

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

  // Reiki no guiado: solo voz de bienvenida breve tras la cuenta regresiva, luego silencio.
  useEffect(() => {
    if (!started || paused || !isReikiUnguided) return;
    const msg = `Bienvenida a la sesión de Reiki. Hoy trabajaremos con ${bowlChakras.length} chakras. Relaja tus manos y deja que el sonido del cuenco marque cada cambio de posición.`;
    const t = setTimeout(() => speak(msg), 400);
    return () => clearTimeout(t);
  }, [started, isReikiUnguided]);

  // Marcador de cuenco tibetano: un cuenco por chakra, espaciado según duración / nº de chakras
  useEffect(() => {
    if (!started || !bowlIntervalSec || !bowlChakras.length) return;
    const target = Math.min(Math.floor(elapsed / bowlIntervalSec) + 1, bowlChakras.length);
    while (bowlIdxRef.current < target) {
      const c = bowlChakras[bowlIdxRef.current];
      if (c) {
        ambient.playBowl(c.freq, 0.7);
        setTimeout(() => ambient.playBowl(c.freq, 0.7), 650);
      }
      bowlIdxRef.current++;
    }
  }, [elapsed, bowlIntervalSec, bowlChakras, started]);

  // fin de sesión
  useEffect(() => {
    if (!started) return;
    if (elapsed >= totalSeconds) {
      const el = audioRef.current;
      if (el) el.pause();
      cancelSpeech();
      onFinish({ actualSeconds: totalSeconds, completed: true });
    }
  }, [elapsed, totalSeconds, started]);

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
      <audio ref={audioRef} src={AMBIENT_URL} loop preload="auto" className="hidden" />

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