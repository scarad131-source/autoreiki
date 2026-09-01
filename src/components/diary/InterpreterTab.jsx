import { useState } from "react";
import { ChevronDown, Sparkles, ArrowRight, HeartHandshake, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { SENSATIONS } from "@/lib/diarySensations";
import { ZONES } from "@/lib/diaryOptions";
import IntensitySlider from "@/components/diary/IntensitySlider";

export default function InterpreterTab() {
  const [sensation, setSensation] = useState("hormigueo");
  const [zone, setZone] = useState("manos");
  const [intensity, setIntensity] = useState(2);
  const [persists, setPersists] = useState(false);
  const [worries, setWorries] = useState(false);
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);

  const getGuidance = async () => {
    setLoading(true);
    setGuidance(null);
    try {
      const res = await base44.functions.invoke("interpretSensation", {
        sensation, zone, intensity, persists, worries,
      });
      setGuidance(res.data.guidance);
    } catch (e) {
      setGuidance("No se pudo obtener la orientación en este momento. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left: Form */}
      <div className="rounded-2xl border border-white/10 bg-card/50 p-5 space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-medium">Orientación educativa</p>
          <h3 className="font-display text-2xl font-semibold mt-1">Describe lo que experimentaste.</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Sensación</label>
            <div className="relative mt-1.5">
              <select
                value={sensation}
                onChange={(e) => setSensation(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-accent/40 border border-white/10 text-sm text-foreground outline-none focus:border-primary/50 cursor-pointer"
              >
                {SENSATIONS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-card">{s.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Zona</label>
            <div className="relative mt-1.5">
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl bg-accent/40 border border-white/10 text-sm text-foreground outline-none focus:border-primary/50 cursor-pointer"
              >
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id} className="bg-card">{z.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-2 block">Intensidad</label>
            <IntensitySlider value={intensity} onChange={setIntensity} />
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={persists}
                onChange={(e) => setPersists(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span className="text-sm text-foreground/85">La sensación persiste después de la sesión</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={worries}
                onChange={(e) => setWorries(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span className="text-sm text-foreground/85">La sensación me preocupa</span>
            </label>
          </div>
        </div>

        <button
          onClick={getGuidance}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow disabled:opacity-40 flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
        >
          {loading ? "Analizando..." : "Recibir orientación"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Info / Result */}
      <div className="rounded-2xl border border-white/10 bg-card/50 p-5 flex flex-col">
        {!guidance && !loading && (
          <div className="flex flex-col items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-medium">Sin misterio añadido</p>
              <h3 className="font-display text-2xl font-semibold mt-1 leading-tight">Recibirás una explicación prudente y un siguiente paso claro.</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
              No asignamos significados absolutos a una sensación ni sustituimos atención sanitaria.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 flex-1 py-10">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Preparando tu orientación...</p>
          </div>
        )}

        {guidance && !loading && (
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-medium">Tu orientación</p>
            </div>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{guidance}</div>
            {(persists || worries) && (
              <div className="flex items-start gap-2 mt-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Si la sensación persiste o te preocupa, considera consultar con un profesional de la salud.
                </p>
              </div>
            )}
            <button
              onClick={getGuidance}
              className="mt-auto text-xs text-primary hover:underline self-start"
            >
              Volver a consultar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}