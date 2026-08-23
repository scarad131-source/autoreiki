import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import EnergyRing from "@/components/EnergyRing";

const LOGO_URL = "https://media.base44.com/images/public/6a7d30a899098694894dbd88/5900e68b3_logomorado.webp";

// Orbe de respiración con el logo de AutoReiki: respira y su brillo se atenúa
// y resalta suavemente, como si estuviera vivo, mientras dura el temporizador.
export default function BreathingOrb({ active = true, label }) {
  const breath = { duration: 10, repeat: Infinity, ease: "easeInOut" };
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-60 h-60 flex items-center justify-center">
        {/* resplandor ambiental que pulsa con la respiración */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30 blur-3xl"
          animate={active ? { scale: [1, 1.25, 1], opacity: [0.35, 0.75, 0.35] } : { scale: 1, opacity: 0.3 }}
          transition={breath}
        />

        {/* anillo de energía luminosa que fluye y respira */}
        <EnergyRing active={active} />

        {/* halo dorado que se atenúa y resalta suavemente */}
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.55) 0%, hsl(var(--gold) / 0) 70%)" }}
          animate={active ? { scale: [0.9, 1.12, 0.9], opacity: [0.45, 1, 0.45] } : { opacity: 0.4 }}
          transition={breath}
        />

        {/* logo central con movimiento de respiración */}
        <motion.div
          className="relative w-44 h-44 rounded-full overflow-hidden"
          animate={active ? { scale: [0.92, 1.06, 0.92] } : { scale: 1 }}
          transition={breath}
        >
          <Image src={LOGO_URL} alt="Mandala de meditación" className="w-full h-full" fittingType="fit" />
        </motion.div>

        {/* partículas de polvo estelar flotando */}
        {active && [0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-light/80"
            style={{ left: `${18 + i * 13}%`, top: `${12 + (i % 3) * 30}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          />
        ))}

        <div className="absolute -bottom-1 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-glow/30">
          <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-primary neon-text">{label}</span>
        </div>
      </div>
    </div>
  );
}