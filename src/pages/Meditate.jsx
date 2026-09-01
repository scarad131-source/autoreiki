import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Headphones, Waves, CloudRain, Trees, CircleDot } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MeditationRunner from "@/components/MeditationRunner";
import ReflectionForm from "@/components/ReflectionForm";
import PrepChecklist from "@/components/PrepChecklist";
import { buildChakraScript, CHAKRAS } from "@/lib/guidedScripts";
import { unlockSpeech } from "@/lib/speech";
import { audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { sessionAudio } from "@/lib/sessionAudio";

export default function Meditate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState("setup"); // setup | running | reflection
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);
  const [journeyDay, setJourneyDay] = useState(null);
  const [mode, setMode] = useState("guided");
  const [userLevel, setUserLevel] = useState("beginner");

  // Configuración para modo no guiada
  const [minutes, setMinutes] = useState(30);
  const [audio, setAudio] = useState("beach");
  const [bowlsMarkers, setBowlsMarkers] = useState(false);

  useEffect(() => {
    base44.auth.me().
    then((u) => setUserLevel(u?.practice_level || "beginner")).
    catch(() => {});
  }, []);

  // Permite iniciar con un preset desde Recorrido o Configurar.
  useEffect(() => {
    const preset = location.state?.preset;
    if (location.state?.journeyDay) {
      setJourneyDay(location.state.journeyDay);
    }
    if (preset) {
      unlockSpeech();
      const cfg = { ...preset, journeyDay: location.state?.journeyDay ?? preset.journeyDay ?? null };
      if (cfg.mode === "guided" && cfg.chakras && cfg.chakras.length) {
        cfg.customScript = buildChakraScript(cfg.chakras);
      }
      setConfig(cfg);
      setStage("running");
    }
  }, [location.state]);

  const start = (cfg) => {
    unlockSpeech();
    const finalCfg = { ...cfg, journeyDay };
    if (finalCfg.mode === "guided" && finalCfg.chakras && finalCfg.chakras.length) {
      finalCfg.customScript = buildChakraScript(finalCfg.chakras);
    }
    // Desbloquea el audio dentro del gesto para que iOS permita reproducirlo.
    // "Frecuencias Sanadoras" (bowls) recibe un boost de ganancia para sonar más fuerte.
    sessionAudio.unlock(audioUrlFor(finalCfg.audio), {
      loop: !isVoiceTrack(finalCfg.audio),
      boost: finalCfg.audio === "bowls" ? 2.5 : 1
    });
    setConfig(finalCfg);
    setStage("running");
  };

  const finish = ({ actualSeconds, completed }) => {
    setResult({ actualSeconds, completed });
    setStage("reflection");
  };

  const save = async ({ moodAfter, notes }, to = "/") => {
    try {
      await base44.entities.MeditationSession.create({
        mode: config.mode,
        level: config.level,
        audio: config.audio,
        planned_minutes: config.minutes,
        actual_seconds: result.actualSeconds,
        mood_after: moodAfter,
        notes,
        completed: result.completed
      });
      if (config.journeyDay) {
        await base44.entities.JourneyProgress.create({ day_number: config.journeyDay });
      }
    } catch (e) {








      // ignore save errors
    }navigate(to);};if (stage === "running" && config) {return <MeditationRunner config={config} onFinish={finish} onCancel={() => navigate("/configurar")} />;}if (stage === "reflection" && config && result) {
    return (
      <ReflectionForm
        config={config}
        actualSeconds={result.actualSeconds}
        onSave={save}
        onRepeat={() => setStage("running")} />);


  }

  const MODES = [
  { id: "guided", name: "Guiada", desc: "Asistente que te guía paso a paso" },
  { id: "unguided", name: "No guiada", desc: "Solo tú y el sonido ambiente" }];


  const handleStart = () => {
    if (mode === "guided") {
      const chakras = CHAKRAS.map((c) => c.id);
      start({ mode, level: userLevel, audio: "reikiGuided", minutes: 26, chakras });
    } else {
      start({ mode, level: userLevel, audio, minutes, chakras: CHAKRAS.map((c) => c.id), bowlsMarkers });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center -ml-1">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Atrás">
          
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <header className="text-center">
        <h1 className="uppercase tracking-[0.14em] text-2xl font-display font-semibold">Configura tu espacio sagrado</h1>
      </header>

      <PrepChecklist />

      <section className="grid grid-cols-2 gap-4">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex flex-col items-center justify-center text-center min-h-[110px] px-3 py-4 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] ${
              active ? "border-primary scale-[1.01]" : "border-white/10 bg-card/60 hover:border-primary/40"}`
              }
              style={active ? { boxShadow: "0 0 34px hsl(var(--primary) / 0.8), 0 0 60px hsl(var(--primary) / 0.4), inset 0 0 18px hsl(var(--primary) / 0.25)" } : undefined}>
              <p className="font-semibold text-lg" style={{ color: active ? "hsl(var(--primary))" : undefined }}>{m.name}</p>
              <p className="text-muted-foreground mt-1.5 leading-snug text-sm max-w-[150px]">{m.desc}</p>
            </button>);

        })}
      </section>

      {mode === "unguided" &&
      <>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Duración</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[20, 30, 45, 60, 90].map((d) =>
            <button
              key={d}
              onClick={() => setMinutes(d)}
              className={`w-14 h-14 rounded-full border text-xs font-medium transition-all flex items-center justify-center ${
              minutes === d ? "border-primary bg-accent text-primary neon-glow" : "border-glow/20 bg-card/50 text-foreground hover:border-primary/50"}`
              }>
              
                  {d}
                </button>
            )}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start py-1 px-1">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-semibold leading-tight text-2xl text-[hsl(var(--primary))]">Ambiente sonoro</h2>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5">Elige el paisaje que sostendrá tu práctica.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
              { id: "beach", icon: Waves, title: "Playa tranquila", desc: "Corriente tranquila con cantos espaciados" },
              { id: "rain", icon: CloudRain, title: "Lluvia relajante", desc: "Textura continua de baja intensidad" },
              { id: "forest", icon: Trees, title: "Bosque nocturno", desc: "Ambiente grave y sereno" },
              { id: "bowls", icon: CircleDot, title: "Frecuencias Sanadoras", desc: "Tono continuo de cuencos armónicos" }].
              map((s) => {
                const active = audio === s.id;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setAudio(s.id)}
                    className={`flex items-center gap-2.5 rounded-2xl border text-left transition-all active:scale-[0.98] my-1 px-2 py-3 ${
                    active ? "border-primary bg-accent/60 neon-glow" : "border-white/10 bg-card/50 hover:border-primary/40"}`
                    }>
                    
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-primary/20" : "bg-white/5"}`}>
                        <Icon className={active ? "text-primary" : "text-muted-foreground"} style={{ width: 18, height: 18 }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[12px] leading-tight" style={{ color: active ? "hsl(var(--primary))" : undefined }}>{s.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{s.desc}</p>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${active ? "bg-primary" : "bg-white/15"}`} />
                    </button>);

              })}
              </div>

            </div>
          </section>

        </>
      }

      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 neon-glow active:scale-[0.99] transition-transform">
        Comenzar sesión
        <span aria-hidden="true">→</span>
      </button>
    </div>);

}