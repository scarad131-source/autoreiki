import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, Pause, Play, Volume2, VolumeX, BellRing, Headphones, Rewind, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RELEASE_SCRIPTS, CHAKRAS } from "@/lib/guidedScripts";
import { ambient } from "@/lib/audioEngine";
import BreathingOrb from "@/components/BreathingOrb";
import { audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { Slider } from "@/components/ui/slider";

export default function MeditationRunner({ config, onFinish, onCancel }) {
  const [audioDuration, setAudioDuration] = useState(null);
  // En meditaciones guiadas el temporizador coincide con la duración real del audio
  const totalSeconds = isVoiceTrack(config.audio) && audioDuration ? Math.ceil(audioDuration) : config.minutes * 60;
  const [countdown, setCountdown] = useState(isVoiceTrack(config.audio) ? 2 : 3);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [bowlsOn, setBowlsOn] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const finishedRef = useRef(false);
  const lastBowlStepRef = useRef(-1);

  const started = countdown === 0;

  const isGuided = config.mode === "guided";
  const isJourney = !!config.journeyDay;
  const bowlChakras = useMemo(
    () => (config.chakras || []).map((id) => CHAKRAS.find((c) => c.id === id)).filter(Boolean),
    [config.chakras]
  );
  const isReiki = bowlChakras.length > 0;
  // Reiki guiada: la voz del audio guía la sesión; sin indicaciones visuales ni cuencos.
  const hideVisualCues = isGuided && isReiki;
  const script = useMemo(() => {
    if (config.customScript) return config.customScript;
    if (!isGuided) return null;
    const m = config.minutes;
    const base = m <= 5 ? RELEASE_SCRIPTS.min5 : m <= 10 ? RELEASE_SCRIPTS.min10 : RELEASE_SCRIPTS.min20;
    if (isJourney) {
      return { ...base, steps: [{ seconds: 8, text: "Realiza tres respiraciones lentas y profundas." }, ...base.steps] };
    }
    return base;
  }, [config.customScript, config.minutes, isGuided, isJourney]);
  const scriptTotalSec = script ? script.steps.reduce((a, s) => a + s.seconds, 0) : 0;
  const voiceActive = script ? elapsed < scriptTotalSec : false;

  // cuenta regresiva de inicio (3 segundos)
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // desbloquear el audio al montar (gesto del usuario reciente): se reproduce
  // silencioso durante la cuenta regresiva para que el navegador no bloquee el play()
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {});
    return () => {
      try {el.pause();} catch (e) {}
    };
  }, []);

  // al terminar la cuenta, subir el volumen y reiniciar el track de voz desde el inicio
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !started) return;
    el.muted = muted;
    el.volume = muted ? 0 : volume;
    // Reiniciar desde el inicio para no saltarse los primeros segundos
    try { el.currentTime = 0; } catch (e) {}
    if (el.paused) el.play().catch(() => {});
  }, [started, volume, muted]);

  // calcular paso actual guiado (solo para texto visual en pantalla)
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

  // timer (solo sesiones no guiadas; las guiadas se sincronizan con timeupdate)
  useEffect(() => {
    if (!started || paused) return;
    if (isVoiceTrack(config.audio)) return;
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, paused, config.audio]);

  // pausa: detener audio ambiental
  useEffect(() => {
    if (!started) return;
    const el = audioRef.current;
    if (paused) {
      if (el) el.pause();
    } else {
      if (el) el.play().catch(() => {});
    }
  }, [paused, started]);

  // cuencos: suenan cada 3 minutos de sesión cuando están activados (solo Reiki).
  // Basado en el tiempo transcurrido para mantener la cadencia aun al pausar/reanudar.
  useEffect(() => {
    if (!started || !bowlsOn || paused || !bowlChakras.length) return;
    const step = Math.floor(elapsed / 180);
    if (step <= lastBowlStepRef.current) return;
    lastBowlStepRef.current = step;
    const c = bowlChakras[step % bowlChakras.length];
    ambient.playBowl(c.freq, 0.7);
  }, [elapsed, started, bowlsOn, paused, bowlChakras]);

  // reinicia el conteo de cuencos al desactivarlos
  useEffect(() => {
    if (!bowlsOn) lastBowlStepRef.current = -1;
  }, [bowlsOn]);

  // fin de sesión
  useEffect(() => {
    if (!started || finishedRef.current) return;
    if (isVoiceTrack(config.audio)) {
      // Las guiadas terminan cuando el audio termina (onEnded). Fallback por si falla.
      if (elapsed >= totalSeconds + 5) {
        finishedRef.current = true;
        onFinish({ actualSeconds: Math.round(audioDuration || totalSeconds), completed: true });
      }
      return;
    }
    if (elapsed >= totalSeconds) {
      finishedRef.current = true;
      const el = audioRef.current;
      if (el) el.pause();
      onFinish({ actualSeconds: totalSeconds, completed: true });
    }
  }, [elapsed, totalSeconds, started, onFinish, config.audio, audioDuration]);

  useEffect(() => {
    const el = audioRef.current;
    if (el && started) {
      el.muted = muted;
      el.volume = muted ? 0 : volume;
    }
  }, [volume, muted, started]);

  // Fade out suave en los últimos 3 segundos (solo sesiones no guiadas)
  useEffect(() => {
    if (!started || isVoiceTrack(config.audio) || muted) return;
    const el = audioRef.current;
    if (!el) return;
    const remaining = totalSeconds - elapsed;
    if (remaining <= 3 && remaining > 0) {
      el.volume = volume * (remaining / 3);
    }
  }, [elapsed, totalSeconds, started, config.audio, volume, muted]);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = elapsed / totalSeconds * 100;
  const currentStep = script ? script.steps[stepIndex] : null;
  const phase = elapsed % 10 < 4 ? "Inhala" : "Exhala";

  // Retroceder 10s (solo guiada): regresa el audio y el temporizador, sin adelantar
  const handleRewind = () => {
    const el = audioRef.current;
    setElapsed((e) => Math.max(0, e - 10));
    if (el) {
      try { el.currentTime = Math.max(0, (el.currentTime || 0) - 10); } catch (err) {}
    }
  };

  // Reiniciar (solo guiada): vuelve al inicio del audio y del temporizador
  const handleRestart = () => {
    const el = audioRef.current;
    setElapsed(0);
    if (el) {
      try { el.currentTime = 0; } catch (err) {}
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] justify-between py-6">
      <audio
        ref={audioRef}
        src={audioUrlFor(config.audio)}
        loop={!isVoiceTrack(config.audio)}
        preload="auto"
        className="hidden"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (isVoiceTrack(config.audio) && d && isFinite(d)) setAudioDuration(d);
        }}
        onTimeUpdate={(e) => {
          if (isVoiceTrack(config.audio) && started && !paused && !finishedRef.current) {
            const t = Math.floor(e.currentTarget.currentTime);
            if (t !== elapsed) setElapsed(t);
          }
        }}
        onEnded={() => {
          if (isVoiceTrack(config.audio) && !finishedRef.current) {
            finishedRef.current = true;
            onFinish({ actualSeconds: Math.round(audioDuration || elapsed), completed: true });
          }
        }} />
      

      <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors -ml-1"
          aria-label="Volver">
          
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <span className="uppercase tracking-[0.18em]">
          {isGuided ? "Guiada" : "No guiada"}
        </span>
      </div>

      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-primary/30 bg-primary/5">
        <Headphones className="w-4 h-4 text-primary shrink-0" />
        <p className="text-[13px] text-foreground/85 font-light leading-snug max-w-xs text-left">Sugerimos el uso de audífonos y deja que el sonido te abrace por completo ✦ tu viaje sonoro será más profundo.

        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
        <BreathingOrb active={started && !paused} label={countdown > 0 ? "Comienza" : paused ? "Pausa" : phase} />

        {countdown > 0 ?
        <div className="text-center">
            <motion.p
            key={countdown}
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="text-7xl font-display font-light tabular-nums neon-text">
            
              {countdown}
            </motion.p>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">Preparando tu espacio</p>
          </div> :

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
              {currentStep && !paused && voiceActive && !hideVisualCues &&
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 1.2 }}
              className="max-w-md text-center px-2">
              
                  <p className="text-[15px] leading-relaxed text-foreground/90 font-light">{currentStep.text}</p>
                </motion.div>
            }
            </AnimatePresence>
          </>
        }
      </div>

      {/* controles de retroceso / reinicio (solo sesiones guiadas) */}
      {isGuided && started && (
        <div className="flex items-center justify-center gap-3 mb-3">
          <button
            onClick={handleRewind}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-xs"
            aria-label="Retroceder 10 segundos"
            title="Retroceder 10s"
          >
            <Rewind className="w-3.5 h-3.5" />
            <span>10s</span>
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-xs"
            aria-label="Reiniciar meditación"
            title="Reiniciar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      )}

      {/* barra de progreso */}
      <div className="w-full h-1 bg-accent rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-glow-cyan"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }} />
        
      </div>

      {/* toggle de cuencos (solo Reiki) */}
      {isReiki && !hideVisualCues &&
      <button
        onClick={() => setBowlsOn((v) => !v)}
        disabled={countdown > 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        bowlsOn ?
        "border-primary bg-primary/15 text-primary neon-glow" :
        "border-white/10 bg-card/80 text-muted-foreground hover:text-foreground"}`
        }
        aria-label={bowlsOn ? "Desactivar cuencos" : "Activar cuencos"}>
        
          <BellRing className="w-4 h-4" />
          {bowlsOn ? "Desactivar cuencos" : "Activar cuencos"}
        </button>
      }

      {/* controles */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setPaused((p) => !p)}
          disabled={countdown > 0}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-glow-cyan text-primary-foreground neon-glow transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={paused ? "Reanudar" : "Pausar"}>
          
          {paused ? <Play className="w-6 h-6 ml-0.5" /> : <Pause className="w-6 h-6" />}
        </button>
      </div>
    </div>);

}