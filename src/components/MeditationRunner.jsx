import { useState, useEffect, useRef, useMemo } from "react";
import { Pause, Play, Headphones, Rewind, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RELEASE_SCRIPTS, CHAKRAS } from "@/lib/guidedScripts";
import { ambient } from "@/lib/audioEngine";
import { isVoiceTrack } from "@/lib/audioSources";

// Fondo de pantalla para la sesión de meditación (piedras zen sobre el agua).
const ZEN_BG = "https://media.base44.com/images/public/6a7d30a899098694894dbd88/c9ee16c53_Piedraszen2.jpeg";
import { sessionAudio } from "@/lib/sessionAudio";

// Una pista de voz guiada dura minutos: cualquier duración menor es una
// estimación temporal del reproductor y cerraría la sesión al instante.
const MIN_VOICE_DURATION = 60;

export default function MeditationRunner({ config, onFinish, onCancel }) {
  const [audioDuration, setAudioDuration] = useState(null);
  // En meditaciones guiadas la sesión dura lo que dura la voz, pero nunca más
  // que el tiempo previsto: los días cortos del reto (5 min) no deben registrar
  // la pista completa.
  const totalSeconds = isVoiceTrack(config.audio)
    ? Math.min(audioDuration ? Math.ceil(audioDuration) : Infinity, config.minutes * 60)
    : config.minutes * 60;
  const [countdown, setCountdown] = useState(isVoiceTrack(config.audio) ? 2 : 3);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  // El navegador puede bloquear el audio guiado (política de autoplay): en ese
  // caso se muestra un botón para activar el sonido con un toque.
  const [needsTap, setNeedsTap] = useState(false);
  // "Frecuencias Sanadoras" (bowls) suena bajo: subimos el volumen base y
  // aplicamos una amplificación extra vía Web Audio para que se escuche claro.
  const isBowls = config.audio === "bowls";
  // La voz guiada suena a volumen pleno: es lo que el usuario necesita oír.
  const [volume, setVolume] = useState(isVoiceTrack(config.audio) ? 1 : isBowls ? 0.7 : 0.5);
  const [muted, setMuted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const bowlsOn = config.bowlsMarkers === true;
  const timerRef = useRef(null);
  const audioRef = useRef(sessionAudio.element());
  const finishedRef = useRef(false);
  const lastBowlStepRef = useRef(-1);
  // Tiempo practicado según el reloj de la sesión (lo usan los detectores de
  // fin de audio, que viven fuera del render).
  const elapsedRef = useRef(0);
  // ¿El audio llegó a sonar? Evita registrar como "completada" una sesión muda.
  const playedRef = useRef(false);

  const started = countdown === 0;
  const el = audioRef.current;

  // Reproductor con aviso: si el navegador rechaza el play (autoplay), se pide
  // un toque del usuario en lugar de quedarse en silencio.
  const playAudio = () => {
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
    }
  };

  // Reintento manual (dentro del toque del usuario): recarga la pista desde
  // cero, por si la carga falló (sin conexión, error del reproductor).
  const retryAudio = () => {
    setNeedsTap(false);
    try { el.load(); } catch (e) {}
    el.muted = muted;
    el.volume = muted ? 0 : volume;
    el.loop = !isVoiceTrack(config.audio);
    playAudio();
  };

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

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  // Listeners del elemento de audio singleton (metadata, timeupdate, ended)
  useEffect(() => {
    const finishGuided = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const d = el.duration;
      // Duración real del audio; si aún no se conoce, el tiempo del reloj.
      const secs = d && isFinite(d) && d > 1 ? d : Math.max(el.currentTime || 0, elapsedRef.current);
      onFinish({ actualSeconds: Math.max(1, Math.round(secs)), completed: true });
    };
    const onLoaded = () => {
      const d = el.duration;
      if (isVoiceTrack(config.audio) && d && isFinite(d)) setAudioDuration(d);
    };
    const onTime = (e) => {
      const cur = e.currentTarget.currentTime;
      const d = e.currentTarget.duration;
      if (cur > 1) playedRef.current = true;
      if (isVoiceTrack(config.audio)) {
        // Solo se acepta la duración real de una pista guiada (minutos): una
        // estimación mínima del reproductor cerraría la sesión al instante.
        if (d && isFinite(d) && d > MIN_VOICE_DURATION) setAudioDuration(d);
        if (started && !paused && !finishedRef.current) {
          // El reloj lo lleva únicamente el intervalo de 1 s (más abajo). Aquí
          // solo se detecta el final: si además escribiera el tiempo, ambos
          // valores chocarían y el temporizador saltaría hacia atrás.
          // Detección de fin: cuando el audio llega casi al final. Se exige una
          // duración real (> 2 s) para no cerrar la sesión si el reproductor
          // informa un final vacío antes de cargar la pista.
          if (d && isFinite(d) && d > MIN_VOICE_DURATION && cur >= d - 0.4) finishGuided();
        }
      }
    };
    const onEnded = () => {
      if (isVoiceTrack(config.audio)) {
        // Solo cuenta como final válido si el audio realmente avanzó.
        const dur = el.duration;
        if ((dur && isFinite(dur) && dur > MIN_VOICE_DURATION) || el.currentTime > 2) finishGuided();
        return;
      }
      // No guiada: si el loop falla y el audio termina, reiniciarlo manualmente
      if (started && !paused && !finishedRef.current) {
        try { el.currentTime = 0; } catch (e) {}
        el.play().catch(() => {});
      }
    };
    // El audio llegó a sonar (para el registro) y nunca debe quedar en silencio
    // sin avisar: si el navegador no puede cargarlo, se ofrece reintentar.
    const onPlaying = () => {
      playedRef.current = true;
      setNeedsTap(false);
    };
    const onError = () => {
      if (!finishedRef.current) setNeedsTap(true);
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("error", onError);
    // Si la metadata ya cargó antes de montar, léela ahora.
    if (el.duration && isFinite(el.duration)) onLoaded();
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("error", onError);
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
    // Solo se rebobina si la pista ya tiene metadata: en archivos largos pedir
    // currentTime antes de cargar reinicia la descarga y retrasa el sonido.
    if (el.readyState >= 1) { try { el.currentTime = 0; } catch (e) {} }
    if (el.paused) playAudio();
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

  // Reloj único de la sesión (todos los modos): es el valor que se muestra.
  useEffect(() => {
    if (!started || paused) return;
    // El reloj corre también en las sesiones guiadas: si el audio no llega a
    // sonar (autoplay bloqueado, sin conexión), la sesión avanza y termina igual
    // para que quede registrada en el historial.
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
      playAudio();
    }
  }, [paused, started]); // eslint-disable-line react-hooks/exhaustive-deps

  // iOS/Android: al bloquear el teléfono, entrar una llamada o volver de otra app,
  // el sistema pausa el audio. Reanudamos al instante (visibilitychange/pageshow)
  // y además revisamos cada 2 s que la sesión siga sonando, para que el sonido de
  // fondo no se corte a media meditación.
  useEffect(() => {
    if (!started) return;
    const onVisible = () => {
      if (document.visibilityState !== "visible" || paused || finishedRef.current) return;
      sessionAudio.ensurePlaying();
    };
    let silentTicks = 0;
    const watchdog = setInterval(() => {
      if (paused || finishedRef.current || document.visibilityState === "hidden") return;
      sessionAudio.ensurePlaying();
      // Si el sistema mantiene el audio detenido (bloqueo de autoplay, corte del
      // contexto), se ofrece el toque de reactivación en pantalla.
      if (el.paused && !el.ended) setNeedsTap(true);
      // Si el audio aún no ha sonado nada, se ofrece el mismo toque: recarga la
      // pista en lugar de dejar la sesión en silencio sin avisar.
      if (!playedRef.current) {
        silentTicks += 1;
        if (silentTicks >= 4) setNeedsTap(true);
      }
    }, 2000);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      clearInterval(watchdog);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [started, paused, el]);

  // Mantiene la pantalla encendida durante la sesión: si el teléfono se bloquea,
  // Android e iOS detienen el audio. Soportado en Chrome/Android y Safari 16.4+.
  useEffect(() => {
    if (!started || paused) return;
    let lock = null;
    const request = async () => {
      try {
        if ("wakeLock" in navigator) lock = await navigator.wakeLock.request("screen");
      } catch (e) {}
    };
    request();
    const onVisible = () => {
      if (document.visibilityState === "visible" && !lock) request();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      try { if (lock) lock.release(); } catch (e) {}
      lock = null;
    };
  }, [started, paused]);

  // cuencos: suenan al cambiar de zona según el cronograma (duración / nº de chakras)
  useEffect(() => {
    if (!started || !bowlsOn || paused || !bowlChakras.length) return;
    const perChakra = Math.round((config.minutes * 60) / bowlChakras.length);
    if (perChakra <= 0) return;
    const step = Math.floor(elapsed / perChakra);
    if (step <= lastBowlStepRef.current) return;
    lastBowlStepRef.current = step;
    const c = bowlChakras[step % bowlChakras.length];
    ambient.playBowl(c.freq, 0.7);
  }, [elapsed, started, bowlsOn, paused, bowlChakras, config.minutes]);

  useEffect(() => {
    if (!bowlsOn) lastBowlStepRef.current = -1;
  }, [bowlsOn, started]);

  // Precarga el timbre del cuenco real al activar marcadores para que suene al instante
  useEffect(() => {
    if (bowlsOn) ambient.preloadBowl();
  }, [bowlsOn]);

  // fin de sesión (todos los modos): por temporizador. Es la red de seguridad
  // cuando el audio guiado no puede reproducirse y no dispara "ended".
  useEffect(() => {
    if (!started || finishedRef.current) return;
    if (elapsed >= totalSeconds) {
      finishedRef.current = true;
      try { el.pause(); } catch (e) {}
      // Si el audio nunca sonó (autoplay bloqueado, sin conexión) el registro
      // queda como sesión no completada, para no acreditar tiempo no escuchado.
      onFinish({ actualSeconds: totalSeconds, completed: playedRef.current });
    }
  }, [elapsed, totalSeconds, started, onFinish, config.audio]); // eslint-disable-line react-hooks/exhaustive-deps

  // fin de sesión (guiadas): watchdog de respaldo por si onTime/onEnded fallan
  useEffect(() => {
    if (!started || !isVoiceTrack(config.audio)) return;
    const id = setInterval(() => {
      if (finishedRef.current) return;
      const d = el.duration;
      const knownDuration = d && isFinite(d) && d > MIN_VOICE_DURATION;
      const realEnd = el.ended && (knownDuration || el.currentTime > 2);
      const nearEnd = knownDuration && el.currentTime >= d - 0.4;
      if (realEnd || nearEnd) {
        finishedRef.current = true;
        clearInterval(id);
        const secs = knownDuration ? d : Math.max(el.currentTime || 0, elapsedRef.current);
        onFinish({ actualSeconds: Math.max(1, Math.round(secs)), completed: true });
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

  // Fade in suave en los primeros 3 segundos (solo sesiones no guiadas).
  // Depende solo de `started` y `config.audio` para no reiniciarse cuando el
  // usuario ajusta el volumen durante la sesión.
  useEffect(() => {
    if (!started || isVoiceTrack(config.audio)) return;
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
  }, [started, config.audio]); // eslint-disable-line react-hooks/exhaustive-deps

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
      // La sesión terminó: la descarga de audios para uso sin conexión puede
      // reanudarse sin quitarle ancho de banda a nada.
      sessionAudio.setSessionActive(false);
    };
  }, [el]);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = elapsed / totalSeconds * 100;
  const currentStep = script ? script.steps[stepIndex] : null;

  const handleRewind = () => {
    setElapsed((e) => Math.max(0, e - 10));
    try { el.currentTime = Math.max(0, (el.currentTime || 0) - 10); } catch (err) {}
  };

  const handleRestart = () => {
    setElapsed(0);
    try { el.currentTime = 0; } catch (err) {}
  };

  // Cierra la sesión antes de tiempo y la guarda igual (queda marcada como
  // incompleta en el historial, con el tiempo realmente practicado).
  const handleFinishEarly = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try { el.pause(); } catch (err) {}
    const seconds = Math.max(1, elapsed, Math.round(el.currentTime || 0));
    onFinish({ actualSeconds: seconds, completed: false });
  };

  return (
    <div className="relative -mt-4 mx-auto w-full max-w-[440px] flex flex-col overflow-hidden rounded-[1.75rem] ring-1 ring-primary/40 shadow-[0_0_30px_hsl(var(--gold)/0.35),0_0_70px_hsl(var(--gold)/0.18),0_18px_45px_rgba(0,0,0,0.55)] min-h-[calc(100svh-3.5rem-8rem)]">
      <img src={ZEN_BG} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />

      <div className="relative z-10 flex flex-col min-h-[calc(100svh-3.5rem-8rem)] justify-between py-6 px-4">
        <div className="w-full flex items-center justify-end">
          <span className="uppercase tracking-[0.18em] text-xs text-foreground/80 drop-shadow">
            {isGuided ? "Guiada" : "No guiada"}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
          {countdown > 0 ? (
            <div className="text-center">
              <motion.p
                key={countdown}
                initial={{ opacity: 0, scale: 1.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="text-7xl font-display font-light tabular-nums neon-text drop-shadow-lg"
              >
                {countdown}
              </motion.p>
              <p className="text-xs text-foreground/70 uppercase tracking-[0.18em]">Preparando tu espacio</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-5xl font-display font-light tracking-tight tabular-nums drop-shadow-lg">
                  {mm}:{ss}
                </p>
                <p className="text-xs text-foreground/70 mt-2 uppercase tracking-[0.18em]">
                  {paused ? "En pausa" : "Respira con calma"}
                </p>
              </div>

              {needsTap && (
                <button
                  onClick={retryAudio}
                  className="min-h-[44px] px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg active:scale-[0.98]"
                >
                  Toca para activar el sonido
                </button>
              )}

              <AnimatePresence mode="wait">
                {currentStep && !paused && voiceActive && !hideVisualCues && (
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 1.2 }}
                    className="max-w-md text-center px-2"
                  >
                    <p className="text-[15px] leading-relaxed text-foreground/95 font-light drop-shadow">{currentStep.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-glow-cyan"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="flex items-center justify-center gap-6">
            {started && (
              <button
                onClick={handleRewind}
                className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-sm text-foreground/80 hover:text-foreground hover:border-primary/40 transition-colors"
                aria-label="Retroceder 10 segundos"
                title="Retroceder 10s"
              >
                <Rewind className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setPaused((p) => !p)}
              disabled={countdown > 0}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-glow-cyan text-primary-foreground neon-glow transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={paused ? "Reanudar" : "Pausar"}
            >
              {paused ? <Play className="w-6 h-6 ml-0.5" /> : <Pause className="w-6 h-6" />}
            </button>
            {started && (
              <button
                onClick={handleRestart}
                className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-sm text-foreground/80 hover:text-foreground hover:border-primary/40 transition-colors"
                aria-label="Reiniciar meditación"
                title="Reiniciar"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>

          {started && (
            <button
              onClick={handleFinishEarly}
              className="mx-auto block min-h-[44px] px-5 rounded-full border border-white/25 bg-black/35 backdrop-blur-sm text-[13px] text-foreground/85 hover:border-primary/50 hover:text-foreground transition-colors"
            >
              Terminar y guardar
            </button>
          )}
        </div>
      </div>

      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 max-w-[128px]">
        <div className="inline-flex items-start gap-1.5 px-2.5 py-2 rounded-xl border border-primary/30 bg-black/45 backdrop-blur-sm">
          <Headphones className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-foreground/85 font-light leading-tight text-left">
            Sugerimos audífonos para un viaje sonoro más profundo ✦
          </p>
        </div>
      </div>
    </div>);
}