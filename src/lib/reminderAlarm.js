// Alarma suave de recordatorio: campanillas cálidas sintetizadas con Web Audio.
// No usa archivos externos y suena incluso sin conexión.

let ctx = null;

const getCtx = () => {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
  }
  return ctx;
};

// iOS/Android bloquean el audio hasta el primer gesto: lo desbloqueamos en
// cuanto el usuario toca la pantalla, para que la alarma pueda sonar sola.
export const initReminderAudio = () => {
  if (typeof window === "undefined") return () => {};
  const unlock = () => {
    const c = getCtx();
    if (c && c.state !== "running") c.resume().catch(() => {});
  };
  ["pointerdown", "touchstart", "keydown"].forEach((ev) =>
    window.addEventListener(ev, unlock, { once: true, passive: true })
  );
  return () => {
    ["pointerdown", "touchstart", "keydown"].forEach((ev) => window.removeEventListener(ev, unlock));
  };
};

// Arpegio de campanillas (Do–Mi–Sol–Do) con caída larga y brillo tenue.
export function playReminderChime({ volume = 0.32 } = {}) {
  const c = getCtx();
  if (!c) return;
  if (c.state !== "running") c.resume().catch(() => {});

  const notes = [523.25, 659.25, 783.99, 1046.5];
  const start = c.currentTime + 0.05;

  notes.forEach((freq, i) => {
    const t0 = start + i * 0.24;

    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(volume, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.6);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + 2.7);
    osc.onended = () => {
      try {
        osc.disconnect();
        g.disconnect();
      } catch (e) {}
    };

    // Armónico suave que da el brillo de campana real.
    const shine = c.createOscillator();
    shine.type = "triangle";
    shine.frequency.value = freq * 2;
    const g2 = c.createGain();
    g2.gain.setValueAtTime(0, t0);
    g2.gain.linearRampToValueAtTime(volume * 0.16, t0 + 0.03);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
    shine.connect(g2);
    g2.connect(c.destination);
    shine.start(t0);
    shine.stop(t0 + 1.2);
    shine.onended = () => {
      try {
        shine.disconnect();
        g2.disconnect();
      } catch (e) {}
    };
  });
}