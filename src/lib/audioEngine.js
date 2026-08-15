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
    else if (type === "rain") this.playRain();
    else if (type === "forest") this.playForest();
    else if (type === "bowls") this.playBowls();
    else if (type === "healing") this.playHealing();
  }

  setVolume(v) {
    if (this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, v)), t + 0.1);
    }
  }

  async suspend() {
    if (this.ctx && this.ctx.state === "running") {
      try { await this.ctx.suspend(); } catch (e) {}
    }
  }

  async resumeCtx() {
    if (this.ctx && this.ctx.state === "suspended") {
      try { await this.ctx.resume(); } catch (e) {}
    }
  }

  // Cuenco tibetano sintetizado: golpe con armónicos inarmónicos y decay largo
  playBowl(freq = 440, gain = 0.7) {
    this.init();
    if (this.ctx.state === "suspended") this.ctx.resume();
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.connect(this.master);
    const partials = [
      { ratio: 1, gain: 0.5 },
      { ratio: 2.76, gain: 0.22 },
      { ratio: 5.4, gain: 0.1 },
    ];
    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * p.ratio;
      const og = ctx.createGain();
      og.gain.value = p.gain;
      osc.connect(og);
      og.connect(bus);
      osc.start(now);
      osc.stop(now + 4.5);
    });
    bus.gain.setValueAtTime(0, now);
    bus.gain.linearRampToValueAtTime(gain, now + 0.03);
    bus.gain.exponentialRampToValueAtTime(0.0001, now + 4);
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

  // Lluvia suave: ruido agudo filtrado con gotas esporádicas
  playRain() {
    const ctx = this.ctx;
    const noise = ctx.createBufferSource();
    noise.buffer = this.makeNoiseBuffer(2, false);
    noise.loop = true;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 600;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1500;
    bp.Q.value = 0.6;

    const g = ctx.createGain();
    g.gain.value = 0.16;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);

    noise.connect(hp);
    hp.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    noise.start();
    lfo.start();
    this.nodes.push(noise, hp, bp, g, lfo, lfoGain);

    const dropId = setInterval(() => {
      if (this.currentType !== "rain") return;
      this.droplet();
    }, 300);
    this.intervals.push(dropId);
  }

  droplet() {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 1700 + Math.random() * 1300;
    const g = ctx.createGain();
    g.gain.value = 0;
    osc.connect(g);
    g.connect(this.master);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.028, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Cuencos tibetanos: golpes periódicos con resonancia larga
  playBowls() {
    const freqs = [396, 417, 528, 639];
    this.playBowl(freqs[0], 0.3);
    const id = setInterval(() => {
      if (this.currentType !== "bowls") return;
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      this.playBowl(f, 0.28);
    }, 5200);
    this.intervals.push(id);
  }
}

export const ambient = new AmbientAudio();

export const AUDIO_OPTIONS = [
  {
    id: "beach",
    name: "Mar tranquilo",
    description: "Olas lentas para soltar",
    icon: "Waves",
    gradient: "from-sky-200 to-teal-300",
  },
  {
    id: "rain",
    name: "Lluvia suave",
    description: "Gotas constantes que arrullan",
    icon: "CloudRain",
    gradient: "from-slate-400 to-indigo-400",
  },
  {
    id: "forest",
    name: "Bosque al amanecer",
    description: "Aves y brisa entre los árboles",
    icon: "Trees",
    gradient: "from-emerald-700 to-indigo-900",
  },
  {
    id: "bowls",
    name: "Cuencos tibetanos",
    description: "Resonancias largas que centran",
    icon: "Disc3",
    gradient: "from-amber-300 to-rose-300",
  },
  {
    id: "healing",
    name: "Frecuencias suaves",
    description: "Tonos armónicos sostenidos",
    icon: "Sparkles",
    gradient: "from-violet-300 to-amber-200",
  },
];