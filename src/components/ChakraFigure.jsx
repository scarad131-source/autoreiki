import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAKRAS } from "@/lib/guidedScripts";

const FIGURE_URL =
"https://media.base44.com/images/public/6a7d30a899098694894dbd88/1e13ded10_image.png";

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
    <div className="max-w-[560px] mx-auto">
      {/* figura con marcadores tocables */}
      <div className="relative w-full max-w-[440px] mx-auto">
        <img
          src={FIGURE_URL}
          alt="Silueta en meditación con chakras"
          className="block w-full h-auto rounded-3xl"
          draggable={false} />
        

      </div>

      {/* círculos de chakras para elegir */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-3">
        {CHAKRAS.map((c) => {
          const isSel = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => onToggle(c.id)}
              className="flex flex-col items-center gap-1 w-[64px]">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: isSel ? `${c.color}33` : "transparent",
                  border: `2px ${isSel ? "solid" : "dashed"} ${c.color}`,
                  boxShadow: isSel ? `0 0 14px ${c.color}, 0 0 24px ${c.color}88` : "none",
                  opacity: isSel ? 1 : 0.45
                }}>
                <span className="w-2 h-2 rounded-full" style={{ background: c.color, boxShadow: isSel ? `0 0 8px ${c.color}` : "none" }} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide leading-none" style={{ color: isSel ? c.color : "hsl(var(--muted-foreground))" }}>{c.name}</span>
              <span className="text-[9px] text-muted-foreground/60 leading-none">{c.sanskrit}</span>
            </button>);

        })}
      </div>

      {/* tooltip debajo de la figura */}
      

































      
    </div>);

}