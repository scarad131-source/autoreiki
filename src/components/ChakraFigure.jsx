import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAKRAS } from "@/lib/guidedScripts";

// Posiciones verticales de cada chakra sobre el eje central (x=100)
const POSITIONS = {
  crown: 30,
  third_eye: 48,
  throat: 70,
  heart: 100,
  solar: 126,
  sacral: 150,
  root: 174,
};

// Lado donde aparece la etiqueta cápsula (alterna para no amontonarse)
const LABEL_SIDE = {
  crown: "right",
  third_eye: "left",
  throat: "right",
  heart: "left",
  solar: "right",
  sacral: "left",
  root: "right",
};

const STARS = [
  { x: 18, y: 24, r: 1.1 }, { x: 40, y: 14, r: 0.8 }, { x: 62, y: 22, r: 1 },
  { x: 88, y: 10, r: 0.9 }, { x: 120, y: 16, r: 1.2 }, { x: 150, y: 12, r: 0.8 },
  { x: 178, y: 22, r: 1 }, { x: 30, y: 50, r: 0.9 }, { x: 170, y: 48, r: 1.1 },
  { x: 14, y: 90, r: 0.8 }, { x: 186, y: 88, r: 1 }, { x: 22, y: 130, r: 1.1 },
  { x: 180, y: 128, r: 0.9 }, { x: 12, y: 170, r: 1 }, { x: 188, y: 168, r: 1.1 },
  { x: 36, y: 200, r: 0.8 }, { x: 164, y: 202, r: 1 }, { x: 70, y: 250, r: 0.9 },
  { x: 130, y: 252, r: 1 }, { x: 100, y: 262, r: 0.8 }, { x: 50, y: 260, r: 1 },
  { x: 152, y: 258, r: 0.9 }, { x: 24, y: 230, r: 0.8 }, { x: 176, y: 232, r: 1 },
];

const RAYS = Array.from({ length: 24 }, (_, i) => i * 15);
const PETALS = Array.from({ length: 12 }, (_, i) => i * 30);

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function ChakraFigure({ selected = [], onToggle }) {
  const [info, setInfo] = useState(null);
  const timerRef = useRef(null);

  const handleTap = (c) => {
    onToggle(c.id);
    setInfo(c.id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setInfo(null), 4500);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const infoChakra = CHAKRAS.find((c) => c.id === info);
  const infoIncluded = infoChakra ? selected.includes(infoChakra.id) : false;

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <svg viewBox="0 0 200 280" className="w-full" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="cf-bg" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#2A1248" />
            <stop offset="100%" stopColor="#1A0B2E" />
          </radialGradient>
          <radialGradient id="cf-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#FF9500" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cf-purple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9B30FF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6A0DAD" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cf-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9B30FF" />
            <stop offset="100%" stopColor="#6A0DAD" />
          </linearGradient>
          <filter id="cf-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="cf-bigglow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* fondo cósmico */}
        <rect x="0" y="0" width="200" height="280" rx="20" fill="url(#cf-bg)" />

        {/* estrellas centelleantes */}
        {STARS.map((s, i) => (
          <motion.circle
            key={`st-${i}`}
            cx={s.x} cy={s.y} r={s.r}
            fill="#FFFFFF"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        ))}

        {/* ondas de energía púrpura */}
        <circle cx="100" cy="48" r="52" fill="url(#cf-purple)" />

        {/* halo mandala dorado detrás de la cabeza */}
        <circle cx="100" cy="48" r="40" fill="url(#cf-gold)" />
        <g transform="translate(100 48)">
          {[20, 28, 36].map((r) => (
            <circle key={r} r={r} fill="none" stroke="#FFD700" strokeOpacity="0.45" strokeWidth="0.7" strokeDasharray="1.5 3" />
          ))}
          {RAYS.map((deg) => (
            <line key={deg} x1="0" y1="-18" x2="0" y2="-40" stroke="#FFD700" strokeOpacity="0.4" strokeWidth="0.7" transform={`rotate(${deg})`} />
          ))}
          {PETALS.map((deg) => (
            <path
              key={deg}
              d="M0,-22 C5,-32 5,-40 0,-44 C-5,-40 -5,-32 0,-22 Z"
              fill="#FFD700" fillOpacity="0.18" stroke="#FFD700" strokeOpacity="0.5" strokeWidth="0.6"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>

        {/* silueta en loto, púrpura neón semitransparente */}
        <g filter="url(#cf-glow)">
          <path
            d="M100,64 C86,64 78,74 77,90 C76,108 81,124 85,138 L60,198 Q100,214 140,198 L115,138 C119,124 124,108 123,90 C122,74 114,64 100,64 Z"
            fill="url(#cf-body)" fillOpacity="0.5" stroke="#B266FF" strokeOpacity="0.85" strokeWidth="1.2"
          />
          <path d="M70,150 Q100,170 130,150" fill="none" stroke="#B266FF" strokeOpacity="0.6" strokeWidth="1" />
          <path d="M80,96 C66,132 64,172 70,196" fill="none" stroke="#B266FF" strokeOpacity="0.85" strokeWidth="1.2" />
          <path d="M120,96 C134,132 136,172 130,196" fill="none" stroke="#B266FF" strokeOpacity="0.85" strokeWidth="1.2" />
          <circle cx="100" cy="48" r="15" fill="url(#cf-body)" fillOpacity="0.5" stroke="#B266FF" strokeOpacity="0.85" strokeWidth="1.2" />
          <line x1="100" y1="62" x2="100" y2="66" stroke="#B266FF" strokeOpacity="0.7" strokeWidth="1.2" />
        </g>

        {/* mandala base dorada/púrpura */}
        <g transform="translate(100 224)">
          <ellipse rx="46" ry="9" fill="url(#cf-purple)" />
          {[40, 30, 20].map((r) => (
            <ellipse key={r} rx={r} ry={r * 0.28} fill="none" stroke="#FFD700" strokeOpacity="0.4" strokeWidth="0.7" strokeDasharray="1.5 3" />
          ))}
          {Array.from({ length: 16 }, (_, i) => i * 22.5).map((deg) => (
            <line key={deg} x1="0" y1="-6" x2="0" y2="-12" stroke="#FFD700" strokeOpacity="0.5" strokeWidth="0.7" transform={`rotate(${deg})`} />
          ))}
        </g>

        {/* orbes de chakra (arte, siempre brillantes en su color) */}
        {CHAKRAS.map((c) => {
          const y = POSITIONS[c.id];
          return (
            <g key={`orb-${c.id}`}>
              <circle cx="100" cy={y} r="11" fill={c.color} fillOpacity="0.18" filter="url(#cf-bigglow)" />
              <motion.circle
                cx="100" cy={y} r="4.5" fill={c.color}
                filter="url(#cf-glow)"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          );
        })}

        {/* marcadores interactivos + etiquetas cápsula */}
        {CHAKRAS.map((c) => {
          const y = POSITIONS[c.id];
          const isSel = selected.includes(c.id);
          const side = LABEL_SIDE[c.id];
          const labelW = 76;
          const labelH = 20;
          const lx = side === "right" ? 112 : 88 - labelW;
          const ly = y - labelH / 2;
          return (
            <g key={`mk-${c.id}`} onClick={() => handleTap(c)} style={{ cursor: "pointer" }}>
              <circle cx="100" cy={y} r="15" fill="transparent" />
              {isSel ? (
                <>
                  <circle cx="100" cy={y} r="13" fill={c.color} fillOpacity="0.25" filter="url(#cf-bigglow)" />
                  <circle cx="100" cy={y} r="9" fill="none" stroke={c.color} strokeWidth="2.2" filter="url(#cf-glow)" />
                </>
              ) : (
                <circle cx="100" cy={y} r="9" fill="none" stroke={c.color} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="1.5 2" />
              )}
              <foreignObject x={lx} y={ly} width={labelW} height={labelH} pointerEvents="none">
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: "100%", width: "100%", boxSizing: "border-box",
                    background: "#2E1A47", color: "#FFFFFF",
                    fontSize: "9px", fontWeight: 600, letterSpacing: "0.04em",
                    borderRadius: "9999px", padding: "0 8px",
                    border: `1px solid ${isSel ? c.color : "rgba(255,255,255,0.15)"}`,
                    boxShadow: isSel ? `0 0 10px ${c.color}aa` : "none",
                    whiteSpace: "nowrap", overflow: "hidden",
                    pointerEvents: "none",
                  }}
                >
                  {c.name}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* recuadro de información al seleccionar */}
      <AnimatePresence>
        {infoChakra && (
          <motion.div
            key={infoChakra.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="mt-3 rounded-2xl border bg-card/80 backdrop-blur-sm p-4"
            style={{ borderColor: `${infoChakra.color}88`, boxShadow: `0 0 18px ${infoChakra.color}33` }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-display text-lg font-semibold" style={{ color: infoChakra.color }}>{infoChakra.name}</p>
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: infoIncluded ? infoChakra.color : "rgba(255,255,255,0.1)",
                  color: infoIncluded ? "#1A0B2E" : "hsl(var(--muted-foreground))",
                }}
              >
                {infoIncluded ? "Incluida" : "Fuera"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground"><span className="text-foreground/70 font-medium">Zona: </span>{cap(infoChakra.position)}</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed"><span className="text-foreground/70 font-medium">Beneficios: </span>{infoChakra.objective}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}