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
    // fixed: barra anclada al borde inferior de la pantalla, siempre visible al desplazar.
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-glow/20 bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      {/* Los 5 accesos se reparten en partes iguales (grid) con tamaño de tacto cómodo */}
      <div className="max-w-2xl mx-auto grid grid-cols-5 px-1.5 py-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-colors ${
                isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-primary/20 shadow-[0_0_12px_hsl(var(--primary)/0.45)]"
                      : "bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] ${isActive ? "scale-105" : ""} transition-transform`}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                </span>
                <span className="text-[10px] leading-none font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}