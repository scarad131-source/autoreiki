import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, Pause, Play, BellRing, Headphones, Rewind, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RELEASE_SCRIPTS, CHAKRAS } from "@/lib/guidedScripts";
import { ambient } from "@/lib/audioEngine";
import BreathingOrb from "@/components/BreathingOrb";
import { isVoiceTrack } from "@/lib/audioSources";
import { sessionAudio } from "@/lib/sessionAudio";

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
  const audioRef = useRef(sessionAudio.element());
  const finishedRef = useRef(false);
  const lastBowlStepRef = useRef(-1);

  const started = countdown === 0;
  const el = audioRef.current;

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

  // Listeners del elemento de audio singleton (metadata, timeupdate, ended)
  useEffect(() => {
    const finishGuided = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const d = el.duration;
      onFinish({ actualSeconds: Math.round((d && isFinite(d)) ? d : (el.currentTime || 0)), completed: true });
    };
    const onLoaded = () => {
      const d = el.duration;
      if (isVoiceTrack(config.audio) && d && isFinite(d)) setAudioDuration(d);
    };
    const onTime = (e) => {
      const cur = e.currentTarget.currentTime;
      const d = e.currentTarget.duration;
      if (isVoiceTrack(config.audio)) {
        if (d && isFinite(d)) setAudioDuration(d);
        if (started && !paused && !finishedRef.current) {
          const t = Math.floor(cur);
          setElapsed((prev) => (t !== prev ? t : prev));
          // Detección de fin: cuando el audio llega casi al final
          if (d && isFinite(d) && cur >= d - 0.4) finishGuided();
        }
      }
    };
    const onEnded = () => {
      if (isVoiceTrack(config.audio)) { finishGuided(); return; }
      // No guiada: si el loop falla y el audio termina, reiniciarlo manualmente
      if (started && !paused && !finishedRef.current) {
        try { el.currentTime = 0; } catch (e) {}
        el.play().catch(() => {});
      }
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    // Si la metadata ya cargó antes de montar, léela ahora.
    if (el.duration && isFinite(el.duration)) onLoaded();
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [el, config.audio, started, paused, onFinish]);

  // cuenta regresiva de inicio
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // al terminar la cuenta, reproducir el audio (ya desbloqueado en el gesto)
  useEffect(() => {
    if (!started) return;
    el.muted = muted;
    el.volume = muted ? 0 : volume;
    el.loop = !isVoiceTrack(config.audio);
    try { el.currentTime = 0; } catch (e) {}
    if (el.paused) el.play().catch(() => {});
  }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // pausa: detener audio
  useEffect(() => {
    if (!started) return;
    if (paused) {
      try { el.pause(); } catch (e) {}
    } else {
      el.play().catch(() => {});
    }
  }, [paused, started]); // eslint-disable-line react-hooks/exhaustive-deps

  // cuencos: suenan cada 3 minutos de sesión cuando están activados (solo Reiki).
  useEffect(() => {
    if (!started || !bowlsOn || paused || !bowlChakras.length) return;
    const step = Math.floor(elapsed / 180);
    if (step <= lastBowlStepRef.current) return;
    lastBowlStepRef.current = step;
    const c = bowlChakras[step % bowlChakras.length];
    ambient.playBowl(c.freq, 0.7);
  }, [elapsed, started, bowlsOn, paused, bowlChakras]);

  useEffect(() => {
    if (!bowlsOn) lastBowlStepRef.current = -1;
  }, [bowlsOn]);

  // fin de sesión (no guiadas): por temporizador
  useEffect(() => {
    if (!started || finishedRef.current) return;
    if (isVoiceTrack(config.audio)) return;
    if (elapsed >= totalSeconds) {
      finishedRef.current = true;
      try { el.pause(); } catch (e) {}
      onFinish({ actualSeconds: totalSeconds, completed: true });
    }
  }, [elapsed, totalSeconds, started, onFinish, config.audio]); // eslint-disable-line react-hooks/exhaustive-deps

  // fin de sesión (guiadas): watchdog de respaldo por si onTime/onEnded fallan
  useEffect(() => {
    if (!started || !isVoiceTrack(config.audio)) return;
    const id = setInterval(() => {
      if (finishedRef.current) return;
      const d = el.duration;
      if (el.ended || (d && isFinite(d) && el.currentTime >= d - 0.4)) {
        finishedRef.current = true;
        clearInterval(id);
        onFinish({ actualSeconds: Math.round((d && isFinite(d)) ? d : (el.currentTime || 0)), completed: true });
      }
    }, 500);
    return () => clearInterval(id);
  }, [started, config.audio, onFinish, el]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (started) {
      el.muted = muted;
      el.volume = muted ? 0 : volume;
    }
  }, [volume, muted, started]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade in suave en los primeros 3 segundos (solo sesiones no guiadas)
  useEffect(() => {
    if (!started || isVoiceTrack(config.audio) || muted) return;
    el.volume = 0;
    const target = volume;
    const duration = 3000;
    let startTs = null;
    let rafId;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      el.volume = target * p;
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, config.audio, volume, muted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade out suave en los últimos 3 segundos (solo sesiones no guiadas)
  useEffect(() => {
    if (!started || isVoiceTrack(config.audio) || muted) return;
    const remaining = totalSeconds - elapsed;
    if (remaining <= 3 && remaining > 0) {
      el.volume = volume * (remaining / 3);
    }
  }, [elapsed, totalSeconds, started, config.audio, volume, muted]); // eslint-disable-line react-hooks/exhaustive-deps

  // limpieza al desmontar: pausar el audio
  useEffect(() => {
    return () => {
      try { el.pause(); } catch (e) {}
    };
  }, [el]);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = elapsed / totalSeconds * 100;
  const currentStep = script ? script.steps[stepIndex] : null;
  const phase = elapsed % 10 < 4 ? "Inhala" : "Exhala";

  const handleRewind = () => {
    setElapsed((e) => Math.max(0, e - 10));
    try { el.currentTime = Math.max(0, (el.currentTime || 0) - 10); } catch (err) {}
  };

  const handleRestart = () => {
    setElapsed(0);
    try { el.currentTime = 0; } catch (err) {}
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] justify-between py-6">
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

      <div className="w-full h-1 bg-accent rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-glow-cyan"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }} />
      </div>

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

      <div className="flex items-center justify-center gap-4">
        {isGuided && started && (
          <button
            onClick={handleRewind}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-xs"
            aria-label="Retroceder 10 segundos"
            title="Retroceder 10s"
          >
            <Rewind className="w-4 h-4" />
            <span>10s</span>
          </button>
        )}
        <button
          onClick={() => setPaused((p) => !p)}
          disabled={countdown > 0}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-glow-cyan text-primary-foreground neon-glow transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={paused ? "Reanudar" : "Pausar"}>
          {paused ? <Play className="w-6 h-6 ml-0.5" /> : <Pause className="w-6 h-6" />}
        </button>
        {isGuided && started && (
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-xs"
            aria-label="Reiniciar meditación"
            title="Reiniciar"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>
        )}
      </div>
    </div>);
}