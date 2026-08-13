import { motion } from "framer-motion";
import { CHAKRAS } from "@/lib/guidedScripts";

// Figura humana traslúcida en pose de loto con 7 chakras activables.
const POSITIONS = {
  crown: 20,
  third_eye: 45,
  throat: 78,
  heart: 108,
  solar: 138,
  sacral: 165,
  root: 188,
};

export default function ChakraFigure({ selected = [], onToggle }) {
  return (
    <div className="relative w-full max-w-[240px] mx-auto">
      <svg viewBox="0 0 200 245" className="w-full">
        <defs>
          <filter id="fig-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="body-fill" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="hsl(var(--glow))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--glow-cyan))" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* aura */}
        <circle cx="100" cy="120" r="116" fill="none" stroke="hsl(var(--glow))" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 7" />

        {/* columna */}
        <line x1="100" y1="45" x2="100" y2="188" stroke="hsl(var(--glow))" strokeOpacity="0.4" strokeWidth="1.5" />

        {/* cuerpo en loto */}
        <path
          d="M100,68 C84,68 74,80 73,95 L77,160 C77,172 66,180 52,190 C66,206 84,214 100,218 C116,214 134,206 148,190 C134,180 123,172 123,160 L127,95 C126,80 116,68 100,68 Z"
          fill="url(#body-fill)"
          stroke="hsl(var(--glow))"
          strokeOpacity="0.4"
          strokeWidth="1.2"
        />
        {/* cabeza */}
        <circle cx="100" cy="48" r="20" fill="url(#body-fill)" stroke="hsl(var(--glow))" strokeOpacity="0.4" strokeWidth="1.2" />

        {/* chakras */}
        {CHAKRAS.map((c) => {
          const y = POSITIONS[c.id];
          const isSel = selected.includes(c.id);
          return (
            <g key={c.id} onClick={() => onToggle(c.id)} style={{ cursor: "pointer" }}>
              {isSel && (
                <motion.circle
                  cx="100"
                  cy={y}
                  r="11"
                  fill={c.color}
                  fillOpacity="0.25"
                  animate={{ r: [9, 13, 9], opacity: [0.2, 0.45, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <circle
                cx="100"
                cy={y}
                r={isSel ? 6.5 : 5}
                fill={isSel ? c.color : "hsl(var(--card))"}
                stroke={c.color}
                strokeOpacity={isSel ? 1 : 0.5}
                strokeWidth={isSel ? 2 : 1.5}
                filter={isSel ? "url(#fig-glow)" : undefined}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}