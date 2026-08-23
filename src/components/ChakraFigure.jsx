import { useState } from "react";
import { CHAKRAS } from "@/lib/guidedScripts";

const FIGURE_URL =
  "https://media.base44.com/images/public/6a7d30a899098694894dbd88/1e13ded10_image.png";

// Posición vertical (en % de la altura) de cada chakra sobre el eje central
const POSITIONS = {
  crown: 18,
  third_eye: 30,
  throat: 41,
  heart: 50,
  solar: 59,
  sacral: 68,
  root: 77,
};

export default function ChakraFigure({ selected = [], onToggle }) {
  const [hovered, setHovered] = useState(null);
  // Etiquetas de arriba (corona) a abajo (raíz)
  const ordered = [...CHAKRAS].reverse();
  const active = hovered ? CHAKRAS.find((c) => c.id === hovered) : null;

  return (
    <div className="rounded-3xl border border-primary/30 bg-card/40 p-4 neon-glow">
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        {/* Silueta con mandala de fondo y puntos de chakras */}
        <div className="relative w-full max-w-[260px] aspect-[3/5] flex items-center justify-center">
          {/* mandala radiante de fondo */}
          <div
            className="absolute inset-[8%] rounded-full opacity-50"
            style={{
              background:
                "conic-gradient(from 0deg, hsl(280 70% 45% / 0.55), hsl(320 80% 55% / 0.45), hsl(260 75% 50% / 0.55), hsl(300 78% 52% / 0.45), hsl(280 70% 45% / 0.55))",
              filter: "blur(10px)",
            }}
          />
          <img
            src={FIGURE_URL}
            alt="Silueta en meditación con chakras"
            className="relative z-10 max-h-full w-auto"
            draggable={false}
          />
          {/* puntos de chakras sobre la silueta */}
          {CHAKRAS.map((c) => {
            const isSel = selected.includes(c.id);
            const isHover = hovered === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onToggle(c.id)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all"
                style={{ left: "50%", top: `${POSITIONS[c.id]}%` }}
                aria-label={c.name}
              >
                <span
                  className="block rounded-full transition-all"
                  style={{
                    width: isHover ? 22 : 16,
                    height: isHover ? 22 : 16,
                    background: c.color,
                    boxShadow:
                      isSel || isHover
                        ? `0 0 14px ${c.color}, 0 0 28px ${c.color}aa`
                        : `0 0 6px ${c.color}88`,
                    opacity: isSel ? 1 : 0.5,
                    border: "2px solid hsl(var(--card))",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Lista de nombres a la derecha */}
        <div className="flex-1 w-full space-y-2">
          {ordered.map((c) => {
            const isSel = selected.includes(c.id);
            const isHover = hovered === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onToggle(c.id)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-full border transition-all text-left ${
                  isSel ? "bg-accent/60" : "bg-card/60"
                }`}
                style={{
                  borderColor: isHover || isSel ? `${c.color}88` : "hsl(var(--border))",
                  boxShadow: isHover ? `0 0 12px ${c.color}66` : "none",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: isHover || isSel ? c.color : "hsl(var(--foreground))" }}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explicación que aparece solo al pasar el cursor */}
      {active && (
        <div
          className="mt-4 rounded-2xl border p-4"
          style={{ borderColor: `${active.color}55`, background: `${active.color}11` }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: active.color, boxShadow: `0 0 8px ${active.color}` }}
            />
            <p className="font-display text-lg font-semibold" style={{ color: active.color }}>
              {active.name}
            </p>
            <span className="text-xs text-muted-foreground italic">{active.sanskrit}</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{active.benefits}</p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{active.placement}</p>
        </div>
      )}
    </div>
  );
}