import { motion } from "framer-motion";
import { CHAKRAS } from "@/lib/guidedScripts";

// Figura humana traslúcida en pose de loto con 7 chakras activables.
const POSITIONS = {
  crown: 16,
  third_eye: 38,
  throat: 66,
  heart: 96,
  solar: 124,
  sacral: 150,
  root: 174,
};

export default function ChakraFigure({ selected = [], onToggle }) {
  return (
    <div className="relative w-full max-w-[260px] mx-auto">
      <svg viewBox="0 0 200 250" className="w-full">
        <defs>
          <filter id="fig-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="body-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="body-fill" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="hsl(var(--glow))" stopOpacity="0.22" />
            <stop offset="60%" stopColor="hsl(var(--glow))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--glow-cyan))" stopOpacity="0.04" />
          </radialGradient>
        </defs>

        {/* aura */}
        <circle cx="100" cy="118" r="118" fill="none" stroke="hsl(var(--glow))" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="100" cy="118" r="96" fill="none" stroke="hsl(var(--glow-cyan))" strokeOpacity="0.12" strokeWidth="1" />

        {/* columna / sushumna */}
        <line x1="100" y1="58" x2="100" y2="174" stroke="hsl(var(--glow))" strokeOpacity="0.45" strokeWidth="1.5" />

        {/* torso + piernas en loto */}
        <path
          d="M100,66 C86,66 76,74 74,88 C72,102 80,120 82,136 C80,150 70,158 58,170 C72,184 86,192 100,194 C114,192 128,184 142,170 C130,158 120,150 118,136 C120,120 128,102 126,88 C124,74 114,66 100,66 Z"
          fill="url(#body-fill)"
          stroke="hsl(var(--glow))"
          strokeOpacity="0.5"
          strokeWidth="1.3"
          filter="url(#body-glow)"
        />

        {/* brazos descansando sobre las rodillas */}
        <path
          d="M78,84 C64,104 58,134 64,164"
          fill="none"
          stroke="hsl(var(--glow))"
          strokeOpacity="0.5"
          strokeWidth="1.3"
          filter="url(#body-glow)"
        />
        <path
          d="M122,84 C136,104 142,134 136,164"
          fill="none"
          stroke="hsl(var(--glow))"
          strokeOpacity="0.5"
          strokeWidth="1.3"
          filter="url(#body-glow)"
        />

        {/* cabeza */}
        <ellipse
          cx="100"
          cy="44"
          rx="17"
          ry="20"
          fill="url(#body-fill)"
          stroke="hsl(var(--glow))"
          strokeOpacity="0.5"
          strokeWidth="1.3"
          filter="url(#body-glow)"
        />
        {/* cuello */}
        <path d="M93,62 L93,70 M107,62 L107,70" stroke="hsl(var(--glow))" strokeOpacity="0.4" strokeWidth="1.3" />

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