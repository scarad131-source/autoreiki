import { useState } from "react";
import { ListChecks } from "lucide-react";

const ITEMS = [
"Espacio sin interrupciones",
"Postura cómoda",
"Intención simple",
"Agua al alcance"];


export default function PrepChecklist() {
  const [checked, setChecked] = useState([]);

  const toggle = (i) =>
  setChecked((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]);

  const count = checked.length;

  return (
    <div
      className="mx-auto max-w-md w-full rounded-2xl border border-border bg-[#FDFBF5] px-5 py-4"
      style={{ boxShadow: "0 0 18px 6px hsl(270 80% 55% / 0.10)" }}>
      
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Ritual de 2 minutos
        </p>
        <ListChecks className="w-5 h-5 text-primary" />
      </div>

      <h2 className="font-semibold mt-2 mb-3 text-foreground [font-family:'Cabin',_sans-serif] text-xl">
        Checklist de preparación
      </h2>

      <ul className="space-y-2.5">
        {ITEMS.map((item, i) => {
          const isChecked = checked.includes(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className="flex items-center gap-3 w-full text-left active:scale-[0.99] transition-transform">
                
                <span
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderColor: isChecked ? "hsl(var(--primary))" : "hsl(var(--border))",
                    background: isChecked ? "hsl(var(--primary))" : "transparent"
                  }}>
                  
                  {isChecked &&
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                </span>
                <span className="text-sm text-muted-foreground">{item}</span>
              </button>
            </li>);

        })}
      </ul>

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mt-4">
        {count} de {ITEMS.length} preparados
      </p>
    </div>);

}