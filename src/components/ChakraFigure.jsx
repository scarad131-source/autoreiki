import { motion } from "framer-motion";
import { CHAKRAS } from "@/lib/guidedScripts";

// Figura humana traslúcida en pose de loto con mandala, aura cósmica y 7 chakras activables.
const POSITIONS = {
  crown: 26,
  third_eye: 40,
  throat: 66,
  heart: 96,
  solar: 124,
  sacral: 150,
  root: 174,
};

const PETALS_OUTER = Array.from({ length: 12 }, (_, i) => i * 30);
const PETALS_INNER = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
const PARTICLES = [
  { x: 30, y: 40 }, { x: 170, y: 55 }, { x: 22, y: 110 }, { x: 180, y: 120 },
  { x: 40, y: 170 }, { x: 160, y: 175 }, { x: 55, y: 25 }, { x: 145, y: 30 },
  { x: 35, y: 145 }, { x: 165, y: 150 }, { x: 95, y: 18 }, { x: 110, y: 215 },
  { x: 25, y: 80 }, { x: 175, y: 85 }, { x: 60, y: 205 }, { x: 140, y: 210 },
];

export default function ChakraFigure({ selected = [], onToggle }) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <svg viewBox="0 0 200 250" className="w-full">
        <defs>
          <filter id="fig-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="body-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="mandala-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--glow-cyan))" stopOpacity="0.35" />
            <stop offset="60%" stopColor="hsl(var(--glow))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(var(--glow))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="floor-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--glow))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--glow))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* halo radial */}
        <circle cx="100" cy="95" r="92" fill="url(#mandala-grad)" />

        {/* anillos concéntricos */}
        {[82, 64, 46].map((r) => (
          <circle key={r} cx="100" cy="95" r={r} fill="none" stroke="hsl(var(--glow))" strokeOpacity="0.18" strokeWidth="0.8" strokeDasharray="2 6" />
        ))}

        {/* pétalos de loto exteriores (violeta) */}
        {PETALS_OUTER.map((deg) => (
          <path
            key={`po-${deg}`}
            d="M100,25 C106,55 106,80 100,93 C94,80 94,55 100,25 Z"
            fill="hsl(var(--glow))"
            fillOpacity="0.12"
            stroke="hsl(var(--glow))"
            strokeOpacity="0.3"
            strokeWidth="0.8"
            transform={`rotate(${deg} 100 95)`}
          />
        ))}
        {/* pétalos interiores (cian) */}
        {PETALS_INNER.map((deg) => (
          <path
            key={`pi-${deg}`}
            d="M100,55 C104,72 104,88 100,95 C96,88 96,72 100,55 Z"
            fill="hsl(var(--glow-cyan))"
            fillOpacity="0.16"
            stroke="hsl(var(--glow-cyan))"
            strokeOpacity="0.35"
            strokeWidth="0.8"
            transform={`rotate(${deg} 100 95)`}
          />
        ))}

        {/* partículas cósmicas */}
        {PARTICLES.map((p, i) => (
          <motion.circle
            key={`p-${i}`}
            cx={p.x}
            cy={p.y}
            r="1.1"
            fill="hsl(var(--glow-cyan))"
            animate={{ opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        ))}

        {/* columna / sushumna */}
        <line x1="100" y1="58" x2="100" y2="174" stroke="hsl(var(--glow))" strokeOpacity="0.5" strokeWidth="1.5" />

        {/* silueta oscura — torso + piernas en loto */}
        <path
          d="M100,66 C86,66 76,74 74,88 C72,102 80,120 82,136 C80,150 70,158 58,170 C72,184 86,192 100,194 C114,192 128,184 142,170 C130,158 120,150 118,136 C120,120 128,102 126,88 C124,74 114,66 100,66 Z"
          fill="#0f0a14"
          stroke="hsl(var(--glow))"
          strokeOpacity="0.6"
          strokeWidth="1.3"
          filter="url(#body-glow)"
        />
        {/* brazos */}
        <path d="M78,84 C64,104 58,134 64,164" fill="none" stroke="hsl(var(--glow))" strokeOpacity="0.6" strokeWidth="1.3" filter="url(#body-glow)" />
        <path d="M122,84 C136,104 142,134 136,164" fill="none" stroke="hsl(var(--glow))" strokeOpacity="0.6" strokeWidth="1.3" filter="url(#body-glow)" />
        {/* cabeza */}
        <ellipse cx="100" cy="44" rx="17" ry="20" fill="#0f0a14" stroke="hsl(var(--glow))" strokeOpacity="0.6" strokeWidth="1.3" filter="url(#body-glow)" />
        <path d="M93,62 L93,70 M107,62 L107,70" stroke="hsl(var(--glow))" strokeOpacity="0.5" strokeWidth="1.3" />

        {/* reflejo en el suelo */}
        <ellipse cx="100" cy="206" rx="74" ry="9" fill="url(#floor-grad)" />

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
                strokeOpacity={isSel ? 1 : 0.55}
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