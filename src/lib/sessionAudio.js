// Audio element singleton para sesiones de meditación.
// iOS/Android bloquean el audio con sonido a menos que play() se invoque
// dentro de un gesto del usuario. Este singleton permite "desbloquear" el
// elemento durante el click (en Configurar/SessionForm) y reutilizarlo en
// MeditationRunner sin perder la activación del gesto.

class SessionAudio {
  constructor() {
    this.el = null;
  }

  _ensure() {
    if (!this.el) {
      this.el = new Audio();
      this.el.preload = "auto";
    }
    return this.el;
  }

  // Debe llamarse dentro del gesto del usuario (onClick).
  // Activa el elemento reproduciéndolo y luego lo pausa en 0:00 para que
  // MeditationRunner pueda reanudarlo tras la cuenta regresiva sin gesto.
  unlock(url, { loop, volume = 0.5 }) {
    const el = this._ensure();
    try { el.pause(); } catch (e) {}
    el.src = url;
    el.loop = !!loop;
    el.muted = false;
    el.volume = volume;
    try { el.currentTime = 0; } catch (e) {}
    const p = el.play();
    const pauseBack = () => {
      try { el.pause(); } catch (e) {}
      try { el.currentTime = 0; } catch (e) {}
    };
    if (p && typeof p.then === "function") {
      p.then(pauseBack).catch(pauseBack);
    } else {
      pauseBack();
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