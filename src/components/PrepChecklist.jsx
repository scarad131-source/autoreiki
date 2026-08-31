import { useState } from "react";
import { Check, ListChecks } from "lucide-react";

const ITEMS = [
  "Espacio sin interrupciones",
  "Postura cómoda",
  "Intención simple",
  "Agua al alcance"
];

export default function PrepChecklist() {
  const [checked, setChecked] = useState(() => ITEMS.map(() => false));

  const toggle = (i) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const count = checked.filter(Boolean).length;

  return (
    <section className="space-y-3">
      <p className="text-center text-sm text-muted-foreground leading-relaxed px-2">
        Antes de comenzar, tómate un momento para preparar tu espacio. Tu práctica será más profunda si cumples este pequeño ritual.
      </p>

      <div
        className="rounded-2xl border p-5"
        style={{ background: "#F9F5EF", borderColor: "#E8E0D4" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.18em] font-semibold"
              style={{ color: "#6A329F" }}
            >
              Ritual de 2 minutos
            </p>
            <h3
              className="text-xl font-semibold mt-1"
              style={{ color: "#1A1A1A", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Checklist de preparación
            </h3>
          </div>
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#6A329F15" }}
          >
            <ListChecks className="w-5 h-5" style={{ color: "#6A329F" }} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {ITEMS.map((label, i) => (
            <button
              key={label}
              onClick={() => toggle(i)}
              className="flex items-center gap-3 w-full text-left active:scale-[0.99] transition-transform"
            >
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                style={
                  checked[i]
                    ? { background: "#6A329F", borderColor: "#6A329F" }
                    : { background: "#FFFDF8", border: "1.5px solid #D8CFC0" }
                }
              >
                {checked[i] && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </span>
              <span
                className="text-sm"
                style={{ color: checked[i] ? "#1A1A1A" : "#555555" }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t" style={{ borderColor: "#E8E0D4" }}>
          <p className="text-xs font-semibold" style={{ color: "#6A329F" }}>
            {count} de {ITEMS.length} preparados
          </p>
        </div>
      </div>
    </section>
  );
}