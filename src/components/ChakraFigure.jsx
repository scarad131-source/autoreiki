import { motion } from "framer-motion";
import { CHAKRAS } from "@/lib/guidedScripts";

// Avatar de terapia personalizada: silueta negra en loto, halo dorado,
// mandala geométrico cian/morado, fondo cósmico y 7 chakras neón activables.
const POSITIONS = {
  crown: 26,
  third_eye: 40,
  throat: 66,
  heart: 96,
  solar: 124,
  sacral: 150,
  root: 174,
};

const PETALS_OUTER = Array.from({ length: 16 }, (_, i) => i * 22.5);
const PETALS_MID = Array.from({ length: 12 }, (_, i) => i * 30 + 15);
const PETALS_INNER = Array.from({ length: 8 }, (_, i) => i * 45);
const RAYS = Array.from({ length: 24 }, (_, i) => i * 15);
const PARTICLES = [
  { x: 28, y: 38 }, { x: 172, y: 52 }, { x: 20, y: 108 }, { x: 182, y: 118 },
  { x: 38, y: 168 }, { x: 162, y: 174 }, { x: 52, y: 24 }, { x: 148, y: 28 },
  { x: 34, y: 144 }, { x: 166, y: 148 }, { x: 96, y: 16 }, { x: 112, y: 214 },
  { x: 24, y: 78 }, { x: 176, y: 84 }, { x: 58, y: 204 }, { x: 142, y: 208 },
  { x: 12, y: 50 }, { x: 188, y: 60 }, { x: 16, y: 140 }, { x: 184, y: 140 },
];

function Starburst({ cx, cy, color, active }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g opacity={active ? 0.9 : 0.35}>
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const len = active ? 11 : 7;
        return (
          <line
            key={deg}
            x1={cx + Math.cos(rad) * 4}
            y1={cy + Math.sin(rad) * 4}
            x2={cx + Math.cos(rad) * (4 + len)}
            y2={cy + Math.sin(rad) * (4 + len)}
            stroke={color}
            strokeWidth={active ? 1.6 : 1}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

export default function ChakraFigure({ selected = [], onToggle }) {
  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <svg viewBox="0 0 200 260" className="w-full">
        <defs>
          <filter id="fig-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nebula" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="gold-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#FF9500" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="floor-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8000FF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ray-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* nebulosa cósmica */}
        <circle cx="60" cy="70" r="60" fill="#8000FF" fillOpacity="0.25" filter="url(#nebula)" />
        <circle cx="150" cy="90" r="55" fill="#FF00FF" fillOpacity="0.2" filter="url(#nebula)" />
        <circle cx="100" cy="150" r="70" fill="#4B0082" fillOpacity="0.22" filter="url(#nebula)" />
        <circle cx="40" cy="170" r="45" fill="#00FFFF" fillOpacity="0.14" filter="url(#nebula)" />

        {/* rayos de luz radiales */}
        <g transform="translate(100 100)">
          {RAYS.map((deg) => (
            <line
              key={deg}
              x1="0" y1="0" x2="0" y2="-120"
              stroke="url(#ray-grad)"
              strokeWidth="1"
              opacity="0.18"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>

        {/* anillos del mandala */}
        {[96, 78, 60].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#00FFFF" strokeOpacity="0.18" strokeWidth="0.8" strokeDasharray="2 5" />
        ))}

        {/* pétalos geométricos exteriores (morado) */}
        {PETALS_OUTER.map((deg) => (
          <path
            key={`po-${deg}`}
            d="M100,28 C108,58 108,86 100,100 C92,86 92,58 100,28 Z"
            fill="#8000FF"
            fillOpacity="0.14"
            stroke="#8000FF"
            strokeOpacity="0.4"
            strokeWidth="0.8"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
        {/* pétalos medios (cian) */}
        {PETALS_MID.map((deg) => (
          <path
            key={`pm-${deg}`}
            d="M100,48 C106,70 106,90 100,100 C94,90 94,70 100,48 Z"
            fill="#00FFFF"
            fillOpacity="0.18"
            stroke="#00FFFF"
            strokeOpacity="0.45"
            strokeWidth="0.8"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
        {/* pétalos internos (morado) */}
        {PETALS_INNER.map((deg) => (
          <path
            key={`pi-${deg}`}
            d="M100,68 C104,82 104,96 100,100 C96,96 96,82 100,68 Z"
            fill="#8000FF"
            fillOpacity="0.2"
            stroke="#FF00FF"
            strokeOpacity="0.4"
            strokeWidth="0.7"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}

        {/* partículas cósmicas */}
        {PARTICLES.map((p, i) => (
          <motion.circle
            key={`p-${i}`}
            cx={p.x}
            cy={p.y}
            r={i % 3 === 0 ? 1.4 : 1}
            fill={i % 2 ? "#00FFFF" : "#FF00FF"}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
          />
        ))}

        {/* halo dorado detrás de la cabeza */}
        <circle cx="100" cy="46" r="34" fill="url(#gold-halo)" />

        {/* columna / sushumna */}
        <line x1="100" y1="58" x2="100" y2="174" stroke="#00FFFF" strokeOpacity="0.5" strokeWidth="1.5" />

        {/* silueta negra — torso + piernas en loto */}
        <path
          d="M100,66 C86,66 76,74 74,88 C72,102 80,120 82,136 C80,150 70,158 58,170 C72,184 86,192 100,194 C114,192 128,184 142,170 C130,158 120,150 118,136 C120,120 128,102 126,88 C124,74 114,66 100,66 Z"
          fill="#000000"
          stroke="#00FFFF"
          strokeOpacity="0.55"
          strokeWidth="1.3"
          filter="url(#soft-glow)"
        />
        {/* brazos en mudra */}
        <path d="M78,84 C64,104 58,134 64,164" fill="none" stroke="#00FFFF" strokeOpacity="0.55" strokeWidth="1.3" filter="url(#soft-glow)" />
        <path d="M122,84 C136,104 142,134 136,164" fill="none" stroke="#00FFFF" strokeOpacity="0.55" strokeWidth="1.3" filter="url(#soft-glow)" />
        {/* cabeza */}
        <ellipse cx="100" cy="44" rx="17" ry="20" fill="#000000" stroke="#00FFFF" strokeOpacity="0.55" strokeWidth="1.3" filter="url(#soft-glow)" />
        <path d="M93,62 L93,70 M107,62 L107,70" stroke="#00FFFF" strokeOpacity="0.45" strokeWidth="1.3" />

        {/* reflejo magenta en el suelo */}
        <ellipse cx="100" cy="206" rx="76" ry="10" fill="url(#floor-grad)" />

        {/* chakras con starburst */}
        {CHAKRAS.map((c) => {
          const y = POSITIONS[c.id];
          const isSel = selected.includes(c.id);
          return (
            <g key={c.id} onClick={() => onToggle(c.id)} style={{ cursor: "pointer" }}>
              {isSel && (
                <motion.circle
                  cx="100"
                  cy={y}
                  r="13"
                  fill={c.color}
                  fillOpacity="0.3"
                  animate={{ r: [10, 15, 10], opacity: [0.25, 0.5, 0.25] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <Starburst cx={100} cy={y} color={c.color} active={isSel} />
              <circle
                cx="100"
                cy={y}
                r={isSel ? 6.5 : 5}
                fill={isSel ? c.color : "#0f0a14"}
                stroke={c.color}
                strokeOpacity={isSel ? 1 : 0.6}
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