import { useState } from "react";
import { Plus } from "lucide-react";
import { CHAKRAS } from "@/lib/guidedScripts";

const FIGURE_URL =
"https://media.base44.com/images/public/6a7d30a899098694894dbd88/dbb94a092_image.png";

const ALL_COLOR = "#8A82B6";

export default function ChakraFigure({ selected = [], onToggle, onSelectAll, selectAllEnabled }) {
  const [described, setDescribed] = useState(null);

  const handleToggle = (c) => {
    onToggle(c.id);
    setDescribed(selected.includes(c.id) ? null : c.id);
  };

  const active = described && selected.includes(described) ?
  CHAKRAS.find((c) => c.id === described) :
  null;

  const allSelected = selected.length === CHAKRAS.length;

  return (
    <div className="max-w-[460px] mx-auto">
      {/* Imagen de la silueta con mandala */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          WebkitMaskImage:
          "radial-gradient(ellipse 92% 92% at 50% 50%, #000 62%, transparent 100%)",
          maskImage:
          "radial-gradient(ellipse 92% 92% at 50% 50%, #000 62%, transparent 100%)"
        }}>
        
        <img
          src={FIGURE_URL}
          alt="Silueta en meditación con chakras"
          className="block w-full h-auto px-3"
          draggable={false} />
        
      </div>

      {/* Círculos de selección debajo de la imagen */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-3">
        {CHAKRAS.map((c) => {
          const isSel = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => handleToggle(c)}
              className="flex flex-col items-center gap-1 w-[64px]">
              
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: isSel ? `${c.color}33` : "transparent",
                  border: `2px ${isSel ? "solid" : "dashed"} ${c.color}`,
                  boxShadow: isSel ? `0 0 14px ${c.color}, 0 0 24px ${c.color}88` : "none",
                  opacity: isSel ? 1 : 0.45
                }}>
                
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: c.color, boxShadow: isSel ? `0 0 8px ${c.color}` : "none" }} />
                
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-wide leading-none"
                style={{ color: isSel ? c.color : "hsl(var(--muted-foreground))" }}>
                
                {c.name}
              </span>
            </button>);

        })}
      </div>

      {/* Botón Todas — píldora lavanda, solo disponible en modo no guiada */}
      {onSelectAll && selectAllEnabled &&
      <div className="mt-4 flex justify-center">
          <button
          onClick={onSelectAll}
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 transition-all duration-300 active:scale-[0.98]"
          style={{
            background: ALL_COLOR,
            boxShadow: allSelected ?
            `0 0 16px ${ALL_COLOR}, 0 0 28px ${ALL_COLOR}99` :
            `0 0 10px ${ALL_COLOR}55`,
            opacity: allSelected ? 1 : 0.9
          }}>
          
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white leading-none">
              Todas
            </span>
            <Plus className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      }

      {/* Descripción breve, solo cuando se selecciona */}
      {active &&
      <div
        className="mt-5 rounded-2xl border p-4"
        style={{ borderColor: `${active.color}55`, background: `${active.color}11` }}>
        
          <div className="flex items-center gap-2 mb-1.5">
            <span
            className="w-3 h-3 rounded-full"
            style={{ background: active.color, boxShadow: `0 0 8px ${active.color}` }} />
          
            <p className="font-display text-lg font-semibold" style={{ color: active.color }}>
              {active.name}
            </p>
            <span className="text-xs text-muted-foreground italic">{active.sanskrit}</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{active.benefits}</p>
        </div>
      }
    </div>);

}