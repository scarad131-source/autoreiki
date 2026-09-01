import { useState } from "react";
import { Save, Lock, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";
import { SENSATIONS, sensationMap } from "@/lib/diarySensations";
import { MOODS, ZONES } from "@/lib/diaryOptions";
import IntensitySlider from "@/components/diary/IntensitySlider";

export default function NewEntryTab({ onSaved }) {
  const [mood, setMood] = useState(null);
  const [sensation, setSensation] = useState(null);
  const [zone, setZone] = useState("manos");
  const [intensity, setIntensity] = useState(2);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!mood && !sensation && !note.trim()) return;
    setSaving(true);
    try {
      await base44.entities.DiaryEntry.create({
        mood,
        sensation,
        zone,
        intensity,
        sensations: sensation ? [sensation] : [],
        note: note.trim(),
      });
      toast({ title: "Entrada guardada", description: "Tu registro quedó en tu diario." });
      setMood(null);
      setSensation(null);
      setIntensity(2);
      setNote("");
      onSaved && onSaved();
    } catch (e) {
      toast({ title: "No se pudo guardar", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mood */}
      <section>
        <h3 className="text-sm font-semibold mb-3">¿Cómo te sientes después de la sesión?</h3>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map((m) => {
            const Icon = m.icon;
            const active = mood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border transition-all ${
                  active
                    ? "border-primary bg-accent/60 neon-glow"
                    : "border-white/10 bg-card/50 hover:border-primary/30"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-[10px] text-center leading-tight">{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sensation */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Sensación principal</h3>
        <div className="flex flex-wrap gap-2">
          {SENSATIONS.map((s) => {
            const active = sensation === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSensation(s.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground neon-glow"
                    : "border-white/10 bg-card/50 text-muted-foreground hover:border-primary/30"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        {sensation && (
          <div className="mt-3 rounded-2xl bg-accent/40 border border-primary/30 p-3.5">
            <p className="text-sm text-foreground/85 leading-relaxed">{sensationMap[sensation].desc}</p>
          </div>
        )}
      </section>

      {/* Zone + Intensity */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-3">Zona</h3>
          <div className="relative">
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 rounded-xl bg-card border border-white/10 text-sm text-foreground outline-none focus:border-primary/50 cursor-pointer"
            >
              {ZONES.map((z) => (
                <option key={z.id} value={z.id} className="bg-card">{z.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Intensidad percibida</h3>
          <IntensitySlider value={intensity} onChange={setIntensity} />
        </div>
      </section>

      {/* Note */}
      <section>
        <h3 className="text-sm font-semibold mb-3">¿Qué aprendiste o qué quieres recordar?</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ejemplo: me ayudó aflojar los hombros antes de empezar..."
          rows={4}
          className="w-full rounded-2xl bg-card border border-white/10 p-4 text-sm resize-none focus:outline-none focus:border-primary/40 placeholder:text-muted-foreground/50"
        />
      </section>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="w-3 h-3" /> Se guarda solo en este navegador.
        </p>
        <button
          onClick={save}
          disabled={saving || (!mood && !sensation && !note.trim())}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar entrada"}
        </button>
      </div>
    </div>
  );
}