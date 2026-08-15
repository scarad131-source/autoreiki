import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAKRAS } from "@/lib/guidedScripts";

const FIGURE_URL =
  "https://media.base44.com/images/public/6a7d30a899098694894dbd88/685c375af_siluetameditacionconchackras.png";

// Posición vertical (en % de la altura de la imagen) de cada chakra sobre el eje central
const POSITIONS = {
  crown: 11,
  third_eye: 19,
  throat: 30,
  heart: 42,
  solar: 53,
  sacral: 64,
  root: 74,
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
    <div className="relative w-full max-w-[300px] mx-auto">
      {/* ilustración base */}
      <img
        src={FIGURE_URL}
        alt="Silueta en meditación con chakras"
        className="block w-full h-auto rounded-3xl"
        draggable={false}
      />

      {/* marcadores interactivos sobre los orbes */}
      <div className="absolute inset-0">
        {CHAKRAS.map((c) => {
          const top = POSITIONS[c.id];
          const isSel = selected.includes(c.id);
          const side = LABEL_SIDE[c.id];
          return (
            <div
              key={c.id}
              className="absolute"
              style={{ left: "50%", top: `${top}%`, transform: "translate(-50%, -50%)" }}
            >
              <div
                onClick={() => handleTap(c)}
                className="relative flex items-center justify-center"
                style={{ width: 48, height: 48, cursor: "pointer" }}
              >
                {isSel && (
                  <div
                    className="absolute rounded-full"
                    style={{ width: 42, height: 42, background: c.color, opacity: 0.28, filter: "blur(10px)" }}
                  />
                )}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 26,
                    height: 26,
                    border: `2px ${isSel ? "solid" : "dashed"} ${c.color}`,
                    opacity: isSel ? 1 : 0.6,
                    boxShadow: isSel ? `0 0 12px ${c.color}` : "none",
                    background: isSel ? `${c.color}22` : "transparent",
                  }}
                />
              </div>
              <span
                className="absolute whitespace-nowrap rounded-full select-none"
                style={{
                  left: side === "right" ? 30 : "auto",
                  right: side === "left" ? 30 : "auto",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#2E1A47",
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 10px",
                  border: `1px solid ${isSel ? c.color : "rgba(255,255,255,0.15)"}`,
                  boxShadow: isSel ? `0 0 10px ${c.color}aa` : "none",
                }}
              >
                {c.name}
              </span>
            </div>
          );
        })}
      </div>

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