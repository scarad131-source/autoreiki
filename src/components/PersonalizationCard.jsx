import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const LEVELS = [
{ id: "beginner", label: "Estoy empezando" },
{ id: "intermediate", label: "Ya practico" }];


export default function PersonalizationCard({ user, onSaved }) {
  const { toast } = useToast();
  const [name, setName] = useState(user?.preferred_name || "");
  const [level, setLevel] = useState(user?.practice_level || "beginner");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        preferred_name: name.trim() || undefined,
        practice_level: level
      });
      onSaved?.();
    } catch (e) {
      toast({
        title: "No se pudo guardar",
        description: "Inténtalo de nuevo en un momento.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-card/80 p-5 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Personalización breve
      </p>
      <h3 className="text-lg leading-snug mt-2 [font-family:'Cabin',_sans-serif] font-medium">
        Antes de guiarte, cuéntame cómo practicas.
      </h3>
      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">Dos respuestas permiten ajustar el lenguaje y el nivel de ayuda.

      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground/80 mb-2 block">
            ¿Cómo quieres que te llamemos?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre opcional"
            className="w-full rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50" />
          
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/80 mb-2 block">
            Tu nivel actual
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((l) =>
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              level === l.id ?
              "bg-gradient-to-r from-amber-light to-primary text-primary-foreground neon-glow" :
              "border border-white/10 bg-background/60 text-foreground hover:border-primary/40"}`
              }>
              
                {l.label}
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-5 rounded-xl bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-semibold py-3.5 neon-glow active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-not-allowed">
        
        {saving ? "Guardando…" : "Guardar y continuar"}
      </button>
    </section>);

}