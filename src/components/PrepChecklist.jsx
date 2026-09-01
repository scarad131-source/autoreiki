import { useState } from "react";
import { Check, ListChecks } from "lucide-react";

const ITEMS = [
"Espacio sin interrupciones",
"Postura cómoda",
"Intención simple",
"Agua al alcance"];


export default function PrepChecklist() {
  const [checked, setChecked] = useState(() => ITEMS.map(() => false));

  const toggle = (i) =>
  setChecked((prev) => prev.map((v, idx) => idx === i ? !v : v));

  const count = checked.filter(Boolean).length;

  return (
    <section className="space-y-3">
      <p className="text-center text-sm text-muted-foreground leading-relaxed px-2">
        Antes de comenzar, tómate un momento para preparar tu espacio. Tu práctica será más profunda si cumples este pequeño ritual.
      </p>

      <div
        className="rounded-xl border p-3 mx-auto"
        style={{ background: "#fcfaf4", borderColor: "#E8E0D4", maxWidth: "16rem" }}>
        
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.16em] font-semibold"
              style={{ color: "#6b3fa0" }}>
              
              Ritual de 2 minutos
            </p>
            <h3
              className="font-semibold leading-tight text-lg px-3 mt-2"
              style={{ color: "#1a1a1a", fontFamily: "'Cormorant Garamond', serif" }}>
              
              Checklist de preparación
            </h3>
          </div>
          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0">
            <ListChecks className="w-4 h-4" style={{ color: "#6b3fa0" }} />
          </div>
        </div>

        <div className="mt-2.5 space-y-2">
          {ITEMS.map((label, i) =>
          <button
            key={label}
            onClick={() => toggle(i)}
            className="flex items-center gap-2 w-full text-left active:scale-[0.99] transition-transform">
            
              <span
              className="w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors shrink-0"
              style={
              checked[i] ?
              { background: "#6b3fa0", borderColor: "#6b3fa0" } :
              { background: "#FFFDF8", border: "1.5px solid #dcd0c0" }
              }>
              
                {checked[i] && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </span>
              <span
              className="text-xs leading-tight"
              style={{ color: checked[i] ? "#1a1a1a" : "#999999" }}>
              
                {label}
              </span>
            </button>
          )}
        </div>

        <div className="mt-2.5 pt-2 border-t" style={{ borderColor: "#E8E0D4" }}>
          <p className="text-[11px] font-semibold" style={{ color: "#6b3fa0" }}>
            {count} de {ITEMS.length} preparados
          </p>
        </div>
      </div>
    </section>);

}