import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

// Orbe de respiración con cuenco tibetano y anillo neón giratorio.
export default function BreathingOrb({ active = true, label }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-60 h-60 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30 blur-3xl"
          animate={active ? { scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 240 240"
          animate={active ? { rotate: 360 } : {}}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="neon-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--glow))" />
              <stop offset="50%" stopColor="hsl(var(--glow-cyan))" />
              <stop offset="100%" stopColor="hsl(var(--gold))" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="114" fill="none" stroke="url(#neon-ring)" strokeWidth="1.5" strokeDasharray="5 9" opacity="0.85" />
        </motion.svg>
        <motion.div
          className="relative w-44 h-44 rounded-full overflow-hidden neon-border"
          animate={active ? { scale: [0.92, 1.06, 0.92] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={IMAGES.singingBowl} alt="Cuenco de meditación" className="w-full h-full" fittingType="fill" />
        </motion.div>
        <div className="absolute -bottom-1 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-glow/30">
          <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-primary neon-text">{label}</span>
        </div>
      </div>
    </div>
  );
}