import { NavLink } from "react-router-dom";
import { Star, CalendarDays, CalendarClock } from "lucide-react";
import LotusIcon from "@/components/LotusIcon";
import ChakraCircleIcon from "@/components/ChakraCircleIcon";

// Rutas principales de las pantallas internas (el Login queda fuera del Layout).
const navItems = [
  { to: "/", label: "Inicio", icon: Star, end: true },
  { to: "/meditar", label: "Meditar", icon: LotusIcon },
  { to: "/recorrido", label: "21 días", icon: CalendarDays },
  { to: "/configurar", label: "Reiki", icon: ChakraCircleIcon },
  { to: "/agenda-reiki", label: "Agenda", icon: CalendarClock },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-none">
      {/* Superficie oscura semitransparente con borde dorado sutil: contrasta con el degradado morado */}
      <div className="max-w-md mx-auto pointer-events-auto rounded-full border border-glow/30 bg-background/90 backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-lg shadow-black/60">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1.5 px-1.5 py-1 transition-all ${
                isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-primary/20 shadow-[0_0_16px_hsl(var(--primary)/0.5)]"
                      : "bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                </span>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}