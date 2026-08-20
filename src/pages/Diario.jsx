import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";
import { SENSATIONS, sensationMap } from "@/lib/diarySensations";
import DiaryHistory from "@/components/DiaryHistory";

export default function Diario() {
  const navigate = useNavigate();
  const [view, setView] = useState("nueva");
  const [selected, setSelected] = useState([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const save = async () => {
    setSaving(true);
    try {
      await base44.entities.DiaryEntry.create({ sensations: selected, note: note.trim() });
      toast({ title: "Entrada guardada", description: "Tu registro quedó en tu diario." });
      setSelected([]);
      setNote("");
      setView("historial");
    } catch (e) {
      toast({ title: "No se pudo guardar", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      <header className="flex items-center justify-between -ml-1">
        <button
          onClick={() => navigate("/mas")}
          className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Volver"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-semibold">Diario</h1>
        <div className="w-10" />
      </header>

      <div className="flex p-1 rounded-full bg-card border border-white/5">
        <button
          onClick={() => setView("nueva")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            view === "nueva" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Nueva entrada
        </button>
        <button
          onClick={() => setView("historial")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            view === "historial" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Mis entradas
        </button>
      </div>

      {view === "historial" ? (
        <DiaryHistory />
      ) : (
        <>
          <section>
            <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground font-medium">Integración</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight mt-1.5">Escucha lo que quedó</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Ponerle palabras a tu experiencia también es una forma de cuidarte.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-3">¿Qué apareció hoy?</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {SENSATIONS.map((s) => {
                const active = selected.includes(s.id);
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => toggle(s.id)}
                    className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border transition-all ${
                      active
                        ? "border-primary bg-accent neon-glow"
                        : "border-white/5 bg-card hover:border-primary/30"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${s.color}`} />
                    <span className="text-[11px] text-center leading-tight">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {selected.length > 0 && (
            <div className="space-y-3">
              {selected.map((id) => {
                const s = sensationMap[id];
                if (!s) return null;
                return (
                  <div
                    key={id}
                    className="rounded-2xl bg-card border border-primary/30 p-4 flex gap-3 gold-glow"
                  >
                    <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <section>
            <h3 className="text-sm font-semibold mb-3">Una línea para ti</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="¿Cómo llegaste y cómo te vas?"
              rows={4}
              className="w-full rounded-2xl bg-card border border-white/5 p-4 text-sm resize-none focus:outline-none focus:border-primary/40"
            />
          </section>

          <button
            onClick={save}
            disabled={saving || (!selected.length && !note.trim())}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-glow-cyan text-primary-foreground font-medium neon-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar entrada"}
          </button>
        </>
      )}
    </div>
  );
}