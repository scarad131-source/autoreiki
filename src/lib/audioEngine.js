// Motor de audio ambiental sintetizado con Web Audio API.
// No requiere archivos externos: genera playa, bosque nocturno y frecuencias sanadoras.

export class AmbientAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.nodes = [];
    this.intervals = [];
    this.currentType = null;
  }

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
  }

  cleanup() {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
    this.nodes.forEach((n) => {
      try {
        if (n.stop) n.stop();
      } catch (e) {}
      try {
        n.disconnect();
      } catch (e) {}
    });
    this.nodes = [];
  }

  stop() {
    if (!this.ctx) return;
    this.cleanup();
    this.currentType = null;
  }

  async play(type) {
    this.init();
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.stop();
    this.currentType = type;
    if (type === "beach") this.playBeach();
    else if (type === "forest") this.playForest();
    else if (type === "healing") this.playHealing();
  }

  setVolume(v) {
    if (this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, v)), t + 0.1);
    }
  }

  makeNoiseBuffer(seconds = 2, brown = false) {
    const ctx = this.ctx;
    const size = seconds * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < size; i++) {
      if (brown) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      } else {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }

  // Playa calmada: olas suaves con ruido marrón filtrado y modulación lenta
  playBeach() {
    const ctx = this.ctx;
    const noise = ctx.createBufferSource();
    noise.buffer = this.makeNoiseBuffer(2, true);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.7;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.5;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.master);

    noise.start();
    lfo.start();
    this.nodes.push(noise, filter, waveGain, lfo, lfoGain);
  }

  // Bosque nocturno: ruido verde suave + grillos esporádicos
  playForest() {
    const ctx = this.ctx;
    const noise = ctx.createBufferSource();
    noise.buffer = this.makeNoiseBuffer(2, false);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.4;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.06;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.master);
    noise.start();
    this.nodes.push(noise, filter, noiseGain);

    // viento leve modulado
    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.05;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 0.04;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(noiseGain.gain);
    windLfo.start();
    this.nodes.push(windLfo, windLfoGain);

    // grillos
    const chirpId = setInterval(() => {
      if (this.currentType !== "forest") return;
      this.chirp();
    }, 1400);
    this.intervals.push(chirpId);
  }

  chirp() {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 4600 + Math.random() * 400;
    const g = ctx.createGain();
    g.gain.value = 0;
    osc.connect(g);
    g.connect(this.master);
    const t = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const s = t + i * 0.09;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.025, s + 0.01);
      g.gain.linearRampToValueAtTime(0, s + 0.05);
    }
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // Frecuencias sanadoras: solfeggio 396, 417, 528 Hz con vibración lenta
  playHealing() {
    const ctx = this.ctx;
    const freqs = [396, 417, 528];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;

      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3 + idx);

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.04 + idx * 0.02;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(g);
      g.connect(this.master);
      osc.start();
      lfo.start();
      this.nodes.push(osc, g, lfo, lfoGain);
    });
  }
}

export const ambient = new AmbientAudio();

export const AUDIO_OPTIONS = [
  {
    id: "beach",
    name: "Playa calmada",
    description: "Olas suaves que mecen tu respiración",
    icon: "Waves",
    gradient: "from-sky-200 to-teal-300",
  },
  {
    id: "forest",
    name: "Bosque nocturno",
    description: "Grillos y viento entre los árboles",
    icon: "Trees",
    gradient: "from-emerald-900 to-indigo-900",
  },
  {
    id: "healing",
    name: "Frecuencias sanadoras",
    description: "Tonos solfeggio 396 · 417 · 528 Hz",
    icon: "Sparkles",
    gradient: "from-violet-300 to-amber-200",
  },
];