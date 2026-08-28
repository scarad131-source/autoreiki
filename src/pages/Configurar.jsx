import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Mic, Bell, Volume2, Pause } from "lucide-react";
import ChakraFigure from "@/components/ChakraFigure";
import { AUDIO_SOURCES, audioUrlFor, isVoiceTrack } from "@/lib/audioSources";
import { CHAKRAS } from "@/lib/guidedScripts";
import { sessionAudio } from "@/lib/sessionAudio";
import { Image } from "@/components/ui/image";

const PRACTICE_TYPES = [
{ id: "reiki", name: "Autotratamiento Reiki", desc: "Siete posiciones corporales" },
{ id: "meditation", name: "Meditación", desc: "Respiración y atención corporal" }];

const GUIDANCE_OPTIONS = [
{ id: "guided", name: "Guiada" },
{ id: "unguided", name: "No guiada" }];


const DURATIONS = [15, 30, 45, 60, 75, 90];

const PREP_OPTIONS = [
{ min: 5, title: "5 minutos", desc: "Respiración y postura" },
{ min: 10, title: "10 minutos", desc: "Respiración, intención y exploración corporal" }];


const AMBIENT = [
{ id: "beach", name: "Río y aves", desc: "Corriente tranquila con cantos espaciados" },
{ id: "bowls", name: "Cuencos suaves", desc: "Tonos armónicos con pausas largas" },
{ id: "rain", name: "Lluvia tranquila", desc: "Textura continua de baja intensidad" },
{ id: "forest", name: "Bosque nocturno", desc: "Ambiente grave y sereno" }];


function SectionCard({ index, title, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-xs font-semibold text-primary tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <h3 className="text-base font-display font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </section>);

}

export default function Configurar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState("unguided");
  const [practiceType, setPracticeType] = useState("reiki");
  const [level, setLevel] = useState("intermediate");
  const [minutes, setMinutes] = useState(30);
  const [audio, setAudio] = useState("beach");
  const [prepMinutes, setPrepMinutes] = useState(5);
  const [spokenInstructions, setSpokenInstructions] = useState(false);
  const [changeBell, setChangeBell] = useState(true);
  const [previewing, setPreviewing] = useState(null);
  const [previewEl, setPreviewEl] = useState(null);

  const toggle = (id) => {
    if (practiceType !== "reiki" || mode === "guided") return;
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  const selectAll = () => setSelected(CHAKRAS.map((c) => c.id));

  useEffect(() => {
    if (practiceType === "reiki" && mode === "guided") {
      setSelected(CHAKRAS.map((c) => c.id));
      setSpokenInstructions(true);
    } else if (practiceType === "reiki" && mode === "unguided") {
      setSelected([]);
      setSpokenInstructions(false);
    } else {
      setSelected([]);
      setSpokenInstructions(mode === "guided");
    }
  }, [mode, practiceType]);

  // Limpia preview al desmontar
  useEffect(() => {
    return () => {
      if (previewEl) {
        try {previewEl.pause();} catch (e) {}
      }
    };
  }, [previewEl]);

  const togglePreview = (id) => {
    if (previewing === id) {
      if (previewEl) {try {previewEl.pause();} catch (e) {}}
      setPreviewing(null);
      return;
    }
    if (previewEl) {try {previewEl.pause();} catch (e) {}}
    const el = new Audio(audioUrlFor(id));
    el.loop = true;
    el.volume = 0.45;
    el.play().catch(() => {});
    setPreviewEl(el);
    setPreviewing(id);
    el.addEventListener("ended", () => setPreviewing(null));
  };

  const start = () => {
    if (!selected.length) return;
    if (previewEl) {try {previewEl.pause();} catch (e) {}}
    setPreviewing(null);
    const trackId = mode === "unguided" ? audio : "reikiGuided";
    sessionAudio.unlock(audioUrlFor(trackId), { loop: !isVoiceTrack(trackId) });
    navigate("/meditar", {
      state: {
        preset: {
          mode,
          level,
          audio: trackId,
          minutes,
          chakras: selected,
          changeBell,
          prepMinutes
        }
      }
    });
  };

  const perChakra = selected.length ? Math.max(1, Math.round(minutes / selected.length)) : 0;
  const ambientName = AMBIENT.find((a) => a.id === audio)?.name || "—";
  const sessionTitle = practiceType === "reiki"
    ? (mode === "guided" ? "Reiki guiado" : "Autotratamiento Reiki")
    : (mode === "guided" ? "Meditación guiada" : "Meditación");

  return (
    <div className="space-y-8">
      {/* Back */}
      <div className="flex items-center -ml-1">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Atrás">
          
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Hero */}
      <header className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Configurador</p>
          <h1 className="font-display text-4xl font-semibold leading-tight mt-2">Crea tu ritual de práctica</h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-md">
            Elige solo lo esencial. Asistente Reiki organiza el ritmo, el ambiente y los cambios de posición para acompañarte con calma.
          </p>
        </div>
        <div className="hidden md:block w-44 h-44 rounded-2xl overflow-hidden shrink-0 shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1612346285-eb1e9b83c9b8?w=600&h=600&fit=crop"
            alt="Ritual de Reiki con cristales"
            className="w-full h-full"
            fittingType="fill" />
          
        </div>
      </header>

      {/* Progress banner */}
      <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Un momento para ti</p>
          <p className="text-sm text-foreground/80 mt-1">Cinco decisiones sencillas. Una sesión hecha a tu ritmo.</p>
        </div>
        <span className="text-xs font-medium text-muted-foreground tabular-nums tracking-widest">01 – 05</span>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Left: config cards */}
        <div className="space-y-5">
          {/* 01 Tipo de práctica */}
          <SectionCard index={1} title="Tipo de práctica">
            <p className="text-xs text-muted-foreground mb-3">El recorrido visual se adapta al objetivo elegido.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PRACTICE_TYPES.map((t) => {
                const active = practiceType === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setPracticeType(t.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                    active ?
                    "border-primary bg-accent" :
                    "border-border bg-card hover:border-primary/40"}`
                    }>
                    
                    <p className="font-medium text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{t.desc}</p>
                  </button>);

              })}
            </div>
            <div className="mt-3 flex gap-3">
              {GUIDANCE_OPTIONS.map((g) => {
                const active = mode === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setMode(g.id)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    active ?
                    "border-primary bg-primary/10 text-primary" :
                    "border-border bg-card text-muted-foreground hover:border-primary/40"}`
                    }>
                    
                    {g.name}
                  </button>);

              })}
            </div>
          </SectionCard>

          {/* 02 Duración total */}
          <SectionCard index={2} title="Duración total">
            <p className="text-xs text-muted-foreground mb-3">Entre 15 y 90 minutos. El tiempo se reparte automáticamente.</p>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => {
                const active = minutes === d;
                return (
                  <button
                    key={d}
                    onClick={() => setMinutes(d)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    active ?
                    "bg-secondary text-secondary-foreground" :
                    "bg-muted text-foreground hover:bg-accent"}`
                    }>
                    
                    {d} min
                  </button>);

              })}
            </div>
          </SectionCard>

          {/* 03 Preparación */}
          <SectionCard index={3} title="Preparación">
            <p className="text-xs text-muted-foreground mb-3">Una entrada breve reduce decisiones antes de comenzar.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PREP_OPTIONS.map((p) => {
                const active = prepMinutes === p.min;
                return (
                  <button
                    key={p.min}
                    onClick={() => setPrepMinutes(p.min)}
                    className={`text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                    active ?
                    "border-primary bg-accent" :
                    "border-border bg-card hover:border-primary/40"}`
                    }>
                    
                    <p className="font-medium text-sm text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{p.desc}</p>
                  </button>);

              })}
            </div>
          </SectionCard>

          {/* 04 Ambiente sonoro */}
          <SectionCard index={4} title="Ambiente sonoro">
            <p className="text-xs text-muted-foreground mb-3">Elige el paisaje que sostendrá tu práctica y escucha una muestra.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {AMBIENT.map((a) => {
                const active = audio === a.id;
                const isPreviewing = previewing === a.id;
                return (
                  <div
                    key={a.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                    active ?
                    "border-primary bg-accent" :
                    "border-border bg-card hover:border-primary/40"}`
                    }>
                    
                    <button
                      onClick={() => setAudio(a.id)}
                      className="text-left w-full">
                      
                      <p className="font-medium text-sm text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{a.desc}</p>
                    </button>
                    <button
                      onClick={() => togglePreview(a.id)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:text-accent-foreground transition-colors">
                      
                      {isPreviewing ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      {isPreviewing ? "Detener muestra" : "Escuchar muestra"}
                    </button>
                  </div>);

              })}
            </div>
          </SectionCard>

          {/* 05 Acompañamiento */}
          <SectionCard index={5} title="Acompañamiento">
            <p className="text-xs text-muted-foreground mb-3">Activa solo lo que te ayude a no mirar continuamente la pantalla.</p>
            <div className="space-y-3">
              <button
                onClick={() => mode === "unguided" && setSpokenInstructions((v) => !v)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                spokenInstructions ?
                "border-primary bg-accent" :
                "border-border bg-card hover:border-primary/40"} ${
                mode === "guided" ? "opacity-70 cursor-default" : "active:scale-[0.99]"}`}>
                
                <Mic className={`w-5 h-5 shrink-0 mt-0.5 ${spokenInstructions ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm text-foreground">Instrucciones habladas</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {mode === "guided" ? "Incluidas en la meditación guiada" : "Indicaciones breves antes de cada zona"}
                  </p>
                </div>
              </button>
              <button
                onClick={() => setChangeBell((v) => !v)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left active:scale-[0.99] ${
                changeBell ?
                "border-primary bg-accent" :
                "border-border bg-card hover:border-primary/40"}`
                }>
                
                <Bell className={`w-5 h-5 shrink-0 mt-0.5 ${changeBell ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm text-foreground">Campana de cambio</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">Aviso suave entre posiciones</p>
                </div>
              </button>
            </div>
          </SectionCard>

          {/* Chakra selection (Autotratamiento) */}
          {practiceType === "reiki" &&
          <section className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-display font-semibold text-foreground mb-1">Zonas a tratar</h3>
              <p className="text-xs text-muted-foreground mb-4">Toca los chakras que quieras trabajar.</p>
              <ChakraFigure selected={selected} onToggle={toggle} onSelectAll={selectAll} selectAllEnabled={practiceType === "reiki" && mode === "unguided"} />
            </section>
          }
        </div>

        {/* Right: Tu sesión summary */}
        <aside className="lg:sticky lg:top-4 rounded-2xl border border-primary/20 bg-gradient-to-b from-accent/50 to-card p-5 space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Tu sesión</p>
            <h3 className="font-display text-xl font-semibold text-foreground mt-1">{sessionTitle}</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Duración</span>
              <span className="text-foreground font-medium text-right">
                {minutes} min de práctica + {prepMinutes} de prep.
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Ambiente</span>
              <span className="text-foreground font-medium text-right">
                {mode === "guided" ? "Voz guía" : ambientName}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Zonas</span>
              <span className="text-foreground font-medium text-right">{selected.length} de 7</span>
            </div>
          </div>

          {selected.length > 0 &&
          <div className="border-t border-border pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Recorrido</p>
              <ol className="space-y-1.5">
                {selected.map((id, i) => {
                const c = CHAKRAS.find((x) => x.id === id);
                if (!c) return null;
                return (
                  <li key={id} className="flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0" style={{ backgroundColor: c.color }}>
                        {i + 1}
                      </span>
                      <span className="text-foreground/85 flex-1">{c.zone}</span>
                      <span className="text-muted-foreground tabular-nums">~ {perChakra} min</span>
                    </li>);

              })}
              </ol>
            </div>
          }

          <button
            onClick={start}
            disabled={!selected.length}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99] transition-transform">
            
            {selected.length ?
            `Iniciar terapia · ${selected.length} zona${selected.length > 1 ? "s" : ""}` :
            "Selecciona al menos una zona"}
            {selected.length ? <ArrowRight className="w-4 h-4" /> : null}
          </button>
        </aside>
      </div>
    </div>);

}