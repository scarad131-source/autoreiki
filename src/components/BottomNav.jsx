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
    // Cápsula flotante de cristal con borde dorado, siempre visible al desplazar.
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto rounded-full border border-primary/50 bg-white/5 backdrop-blur-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
        <div className="grid grid-cols-5 px-2 py-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-full py-1 font-body transition-colors ${
                  isActive ? "text-primary" : "text-foreground/55 hover:text-foreground/85"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Halo dorado sobre el icono de la sección activa */}
                  <span
                    className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive ?
                    "w-8 h-8 bg-primary/15 shadow-[0_0_14px_hsl(var(--gold)/0.55),0_0_28px_hsl(var(--gold)/0.28),inset_0_0_10px_hsl(var(--gold)/0.18)]" :
                    "w-8 h-8 bg-transparent"}`
                    }>
                    
                    <Icon
                      className={`w-[18px] h-[18px] transition-colors duration-300 ${isActive ? "text-primary" : ""}`}
                      strokeWidth={isActive ? 2.2 : 1.7}
                      style={isActive ? { filter: "drop-shadow(0 0 6px hsl(var(--gold) / 0.9))" } : undefined} />
                    
                  </span>
                  <span className={`text-[9px] leading-none tracking-wide ${isActive ? "font-semibold" : "font-medium"}`}>
                    {label}
                  </span>
                  <span
                    className={`h-1 w-1 rounded-full transition-all duration-300 ${
                    isActive ? "bg-primary shadow-[0_0_8px_hsl(var(--gold)/0.9)]" : "bg-transparent"}`
                    } />
                  
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}