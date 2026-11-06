// Audio element singleton para sesiones de meditación.
// iOS/Android bloquean el audio con sonido a menos que play() se invoque
// dentro de un gesto del usuario. Este singleton permite "desbloquear" el
// elemento durante el click (en Configurar/SessionForm) y reutilizarlo en
// MeditationRunner sin perder la activación del gesto.
//
// Además, enruta el elemento a través de Web Audio API para permitir
// amplificar (boost) el volumen por encima del límite nativo de 1.0,
// útil para pistas como "Frecuencias Sanadoras" que suenan muy bajas.

class SessionAudio {
  constructor() {
    this.el = null;
    this.audioCtx = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.boostFactor = 1;

    // iOS y Android suspenden el audio cuando la app pasa a segundo plano o una
    // llamada interrumpe el AudioContext. Al volver a la app se reanuda para que
    // la sesión no se quede en silencio.
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") this._resumeCtx();
      });
    }
  }

  _ensure() {
    if (!this.el) {
      this.el = new Audio();
      this.el.preload = "auto";
      this.el.crossOrigin = "anonymous";
    }
    return this.el;
  }

  // Configura la cadena Web Audio (element -> gain -> destination) una sola vez.
  // Esto permite aplicar un factor de ganancia > 1 al audio reproducido.
  _setupWebAudio() {
    if (this.audioCtx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.audioCtx = new AC();
      this.sourceNode = this.audioCtx.createMediaElementSource(this.el);
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.boostFactor;
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
    } catch (e) {
      // Si falla, el audio sigue saliendo por el elemento nativo.
      this.audioCtx = null;
      this.sourceNode = null;
      this.gainNode = null;
    }
  }

  // Reanuda el AudioContext si quedó suspendido (políticas de autoplay).
  _resumeCtx() {
    // "interrupted" es el estado que usa iOS cuando otra app (o una llamada) se
    // lleva el audio: también hay que reanudarlo al volver.
    if (this.audioCtx && this.audioCtx.state !== "running") {
      this.audioCtx.resume().catch(() => {});
    }
  }

  // Expuesto para reanudar el contexto desde fuera (al volver del segundo plano).
  resumeCtx() {
    this._resumeCtx();
  }

  // Define un factor de amplificación (> 1 sube el volumen por encima del
  // límite nativo). Debe llamarse dentro o cerca de un gesto del usuario.
  setBoost(factor) {
    this.boostFactor = factor || 1;
    this._setupWebAudio();
    this._resumeCtx();
    if (this.gainNode) {
      try {
        const t = this.audioCtx.currentTime;
        this.gainNode.gain.cancelScheduledValues(t);
        this.gainNode.gain.linearRampToValueAtTime(this.boostFactor, t + 0.05);
      } catch (e) {}
    }
  }

  // Debe llamarse dentro del gesto del usuario (onClick).
  // Activa el elemento reproduciéndolo y luego lo pausa en 0:00 para que
  // MeditationRunner pueda reanudarlo tras la cuenta regresiva sin gesto.
  unlock(url, { loop, volume = 0.5, boost = 1 }) {
    const el = this._ensure();
    try { el.pause(); } catch (e) {}
    el.src = url;
    el.loop = !!loop;
    // Silenciamos durante el ciclo play-pause del desbloqueo: en pistas largas
    // (p. ej. Reiki guiada 26 min) la promesa de play() se resuelve tarde, solo
    // cuando el audio realmente empieza a sonar, y sin mute se escucharía durante
    // la cuenta regresiva. MeditationRunner reactiva el sonido al iniciar.
    el.muted = true;
    el.volume = volume;
    try { el.currentTime = 0; } catch (e) {}
    if (boost && boost !== 1) {
      this.setBoost(boost);
    } else if (this.boostFactor !== 1) {
      // Restablece el boost si la pista nueva no lo necesita
      this.setBoost(1);
    }
    this._resumeCtx();
    // Pausamos en cuanto el audio realmente empieza a sonar (aún muteado, así
    // que no se escucha) para dejarlo en 0:00 listo para la sesión. Si la carga
    // tarda más que la cuenta regresiva y el sonido ya se reactivó, no pausamos
    // (gracias a la verificación de el.muted) y la sesión no se corta.
    const onPlaying = () => {
      if (el.muted) {
        try { el.pause(); } catch (e) {}
        try { el.currentTime = 0; } catch (e) {}
      }
      el.removeEventListener("playing", onPlaying);
    };
    el.addEventListener("playing", onPlaying);
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.catch(() => el.removeEventListener("playing", onPlaying));
    }
    return el;
  }

  element() {
    return this._ensure();
  }

  reset() {
    if (!this.el) return;
    try { this.el.pause(); } catch (e) {}
    try { this.el.currentTime = 0; } catch (e) {}
  }
}

export const sessionAudio = new SessionAudio();