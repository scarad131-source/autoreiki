import { useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Congela el contenido de la ruta al montarse, para que al salir se siga
// animando la pantalla anterior y no la nueva.
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

// Transición entre pantallas: entra deslizando desde la derecha y sale hacia
// la izquierda. El header fijo y la barra inferior quedan fuera de este bloque.
export default function RouteTransition() {
  const { pathname } = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <FrozenOutlet />
      </motion.div>
    </AnimatePresence>
  );
}