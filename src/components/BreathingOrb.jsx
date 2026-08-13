import { motion } from "framer-motion";

// Orbe de respiración: se expande 4s (inhala) y contrae 6s (exhala).
export default function BreathingOrb({ active = true, label }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-300/40 to-violet-400/40 blur-2xl"
          animate={active ? { scale: [1, 1.35, 1], opacity: [0.5, 0.8, 0.5] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-6 rounded-full bg-gradient-to-br from-teal-200 to-violet-300 shadow-inner"
          animate={active ? { scale: [0.85, 1.15, 0.85] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-16 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center"
          animate={active ? { scale: [0.9, 1.05, 0.9] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-teal-700">{label}</span>
        </motion.div>
      </div>
    </div>
  );
}