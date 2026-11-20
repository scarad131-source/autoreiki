// Reproductor único de las sesiones de meditación.
//
// iOS/Android solo permiten reproducir audio con sonido si play() se invoca
// dentro de un gesto del usuario. La pantalla donde se toca "Comenzar sesión"
// desbloquea ESTE elemento (reproduce la pista real y la pausa al instante) y
// MeditationRunner reutiliza el mismo elemento al terminar la cuenta regresiva.
// Así hay un solo elemento de audio y ningún audio silencioso aparte.

class SessionAudio {
  constructor() {
    this.el = null;
    this.url = null;
    this.boostFactor = 1;
    // Identifica el desbloqueo en curso: si la sesión arranca antes de que
    // play() se resuelva, el pausado pendiente ya no debe detener el audio.
    this._unlockToken = 0;
  }

  // La sesión ya arrancó: cancela el pausado pendiente del desbloqueo.
  startSession() {
    this._unlockToken += 1;
  }

  _ensure() {
    if (!this.el) {
      this.el = new Audio();
      this.el.preload = "auto";
    }
    return this.el;
  }

  // Avisa al service worker de que hay (o no) una sesión en curso. Mientras dura,
  // la descarga de audios para uso sin conexión se detiene: son casi 150 MB y
  // competir con ella deja la pista guiada sin datos para sonar.
  setSessionActive(active) {
    try {
      const sw = navigator.serviceWorker && navigator.serviceWorker.controller;
      if (sw) sw.postMessage({ type: "SESSION_ACTIVE", active: !!active });
    } catch (e) {}
  }

  // Amplificación de pistas que suenan muy bajas (Frecuencias Sanadoras).
  setBoost(factor) {
    this.boostFactor = factor || 1;
    if (this.el && this.boostFactor > 1) this.el.volume = 1;
  }

  // Desbloquea el elemento dentro del gesto del usuario: reproduce la pista real
  // y la pausa en 0:00 (sin silenciarla ni crear otro audio).
  unlock(url, { loop, boost = 1 } = {}) {
    const el = this._ensure();
    try { el.pause(); } catch (e) {}
    if (this.url !== url) {
      el.src = url;
      this.url = url;
    }
    el.loop = !!loop;
    el.muted = false;
    el.volume = 1;
    this.setSessionActive(true);
    if (boost && boost !== 1) {
      this.setBoost(boost);
    } else if (this.boostFactor !== 1) {
      this.setBoost(1);
    }

    const token = ++this._unlockToken;
    const pauseAtStart = () => {
      if (this._unlockToken !== token) return;
      try { el.pause(); } catch (e) {}
      try { el.currentTime = 0; } catch (e) {}
    };

    // play() se invoca dentro del gesto del usuario: eso es lo que autoriza a
    // iOS a reproducir este mismo elemento después, ya sin gesto.
    let p = null;
    try { p = el.play(); } catch (e) { p = null; }
    if (p && typeof p.then === "function") {
      p.then(pauseAtStart).catch(() => {});
    } else {
      pauseAtStart();
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