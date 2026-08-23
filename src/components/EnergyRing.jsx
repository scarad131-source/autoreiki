import { motion } from "framer-motion";

// Anillo de energía luminosa: múltiples hebras de luz entrelazadas que fluyen
// y respiran, reemplazando el círculo punteado estático por un efecto orgánico.
// Azul/cian a la izquierda, ámbar/magenta/violeta a la derecha, destello superior.
export default function EnergyRing({ active = true }) {
  const breath = { duration: 10, repeat: Infinity, ease: "easeInOut" };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.svg
        viewBox="0 0 240 240"
        className="w-full h-full"
        animate={active ? { rotate: 360 } : {}}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          {/* gradiente espectral: cian/azul -> blanco (destello superior) -> ámbar -> magenta -> violeta */}
          <linearGradient id="energy-strand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="22%" stopColor="#4169E1" />
            <stop offset="45%" stopColor="#E0F7FF" />
            <stop offset="55%" stopColor="#FFFAEE" />
            <stop offset="72%" stopColor="#FF8C00" />
            <stop offset="86%" stopColor="#FF00FF" />
            <stop offset="100%" stopColor="#8A2BE2" />
          </linearGradient>
          <linearGradient id="energy-strand-2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A2BE2" />
            <stop offset="30%" stopColor="#FF00FF" />
            <stop offset="55%" stopColor="#FF8C00" />
            <stop offset="80%" stopColor="#4169E1" />
            <stop offset="100%" stopColor="#00BFFF" />
          </linearGradient>
          <radialGradient id="top-flare" cx="50%" cy="6%" r="22%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#E0F7FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00BFFF" stopOpacity="0" />
          </radialGradient>
          <filter id="bloom" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="soft-bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* halo difuso de fondo */}
        <motion.circle
          cx="120" cy="120" r="100" fill="none"
          stroke="url(#energy-strand)" strokeWidth="10" opacity="0.25"
          filter="url(#soft-bloom)"
          animate={active ? { opacity: [0.18, 0.4, 0.18], scale: [1, 1.04, 1] } : {}}
          transition={breath}
          style={{ transformOrigin: "center" }}
        />

        {/* hebras entrelazadas con distintos patrones de guion para efecto orgánico */}
        <g filter="url(#bloom)">
          <circle cx="120" cy="120" r="104" fill="none" stroke="url(#energy-strand)" strokeWidth="1.8" strokeDasharray="2 7" opacity="0.9" />
          <circle cx="120" cy="120" r="100" fill="none" stroke="url(#energy-strand-2)" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.8" />
          <circle cx="120" cy="120" r="108" fill="none" stroke="url(#energy-strand)" strokeWidth="1.1" strokeDasharray="1 10" opacity="0.7" />
          <circle cx="120" cy="120" r="96" fill="none" stroke="url(#energy-strand-2)" strokeWidth="0.9" strokeDasharray="9 3" opacity="0.6" />
        </g>

        {/* destello brillante en la parte superior (12 en punto) */}
        <motion.circle
          cx="120" cy="120" r="112" fill="url(#top-flare)"
          animate={active ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.4 }}
          transition={breath}
        />

        {/* hebra principal más densa que fluye */}
        <motion.circle
          cx="120" cy="120" r="102" fill="none"
          stroke="url(#energy-strand)" strokeWidth="2.4" opacity="0.95"
          strokeDasharray="40 18 8 14 26 10"
          filter="url(#bloom)"
          animate={active ? { strokeDashoffset: [0, -116] } : {}}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>

      {/* chispas/bokeh flotantes alrededor del anillo */}
      {active && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const left = 50 + Math.cos(angle) * 44;
        const top = 50 + Math.sin(angle) * 44;
        const colors = ["#00BFFF", "#FF8C00", "#FF00FF", "#8A2BE2", "#E0F7FF", "#4169E1", "#FFD580", "#C77DFF"];
        return (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${left}%`, top: `${top}%`,
              background: colors[i],
              boxShadow: `0 0 8px ${colors[i]}, 0 0 14px ${colors[i]}`,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4] }}
            transition={{ duration: 3.5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
          />
        );
      })}
    </div>
  );
}