import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAKRAS } from "@/lib/guidedScripts";

const FIGURE_URL =
"https://media.base44.com/images/public/6a7d30a899098694894dbd88/685c375af_siluetameditacionconchackras.png";

// Posición vertical (en % de la altura de la imagen) de cada chakra sobre el eje central
// Posición vertical (en % de la altura de la imagen) de cada chakra sobre el eje central.
// Valores ajustados a los orbes reales de la silueta.
const POSITIONS = {
  crown: 20, // Corona – violeta claro en la coronilla
  third_eye: 32, // Tercer ojo – índigo en la frente
  throat: 43, // Garganta – violeta en el cuello
  heart: 51, // Corazón – verde en el pecho
  solar: 59, // Plexo solar – amarillo en el abdomen superior
  sacral: 67, // Sacro – naranja en el abdomen bajo
  root: 75 // Raíz – rojo en la pelvis
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

  useEffect(() => () => {if (timerRef.current) clearTimeout(timerRef.current);}, []);

  const infoChakra = CHAKRAS.find((c) => c.id === info);
  const infoIncluded = infoChakra ? selected.includes(infoChakra.id) : false;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[300px_1fr] sm:gap-6 max-w-[560px] mx-auto">
      {/* figura con marcadores tocables */}
      <div className="relative w-full max-w-[300px] mx-auto sm:mx-0 justify-self-center sm:justify-self-start">
        <img
          src={FIGURE_URL}
          alt="Silueta en meditación con chakras"
          className="block w-full h-auto rounded-3xl"
          draggable={false} />
        
        <div className="absolute inset-0 rounded-lg">
          {CHAKRAS.map((c) => {
            const top = POSITIONS[c.id];
            const isSel = selected.includes(c.id);
            return (
              <div
                key={c.id}
                className="absolute"
                style={{ left: "50%", top: `${top}%`, transform: "translate(-50%, -50%)" }}>
                
                <div
                  onClick={() => handleTap(c)}
                  className="absolute rounded-full"
                  style={{
                    width: 26,
                    height: 26,
                    border: `2px ${isSel ? "solid" : "dashed"} ${c.color}`,
                    opacity: isSel ? 1 : 0.6,
                    boxShadow: isSel ? `0 0 12px ${c.color}, 0 0 22px ${c.color}66` : "none",
                    background: isSel ? `${c.color}22` : "transparent",
                    cursor: "pointer"
                  }} />
                
              </div>);

          })}
        </div>
      </div>

      {/* columna lateral: el tooltip aparece aquí, no sobre la figura */}
      <div className="relative">
        <AnimatePresence>
          {infoChakra &&
          <motion.div
            key={infoChakra.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="static sm:absolute sm:left-0 sm:-translate-y-1/2 w-full sm:w-[180px]"
            style={{ top: `${POSITIONS[infoChakra.id]}%` }}>
            
              <div
              className="mt-3 sm:mt-0 rounded-xl border bg-card/95 backdrop-blur p-3 shadow-lg"
              style={{ borderColor: `${infoChakra.color}88`, boxShadow: `0 0 16px ${infoChakra.color}33` }}>
              
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-display text-sm font-semibold" style={{ color: infoChakra.color }}>{infoChakra.name}</p>
                  <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: infoIncluded ? infoChakra.color : "rgba(255,255,255,0.1)",
                    color: infoIncluded ? "#1A0B2E" : "hsl(var(--muted-foreground))"
                  }}>
                  
                    {infoIncluded ? "Incluida" : "Fuera"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug"><span className="text-foreground/70 font-medium">Zona: </span>{infoChakra.zone}</p>
                <p className="text-[11px] text-muted-foreground leading-snug mt-1"><span className="text-foreground/70 font-medium">Manos: </span>{infoChakra.placement}</p>
                <p className="text-[11px] text-muted-foreground leading-snug mt-1"><span className="text-foreground/70 font-medium">Beneficios: </span>{infoChakra.benefits}</p>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

}