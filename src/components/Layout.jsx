import { Outlet, NavLink } from "react-router-dom";
import { Star, SlidersHorizontal, CalendarDays, CalendarClock, LogOut } from "lucide-react";
import LotusIcon from "@/components/LotusIcon";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

const navItems = [
  { to: "/", label: "Inicio", icon: Star, end: true },
  { to: "/configurar", label: "Mi sesión", icon: SlidersHorizontal },
  { to: "/meditar", label: "Meditar", icon: LotusIcon },
  { to: "/recorrido", label: "21 días", icon: CalendarDays },
  { to: "/agenda-reiki", label: "Agenda", icon: CalendarClock },
];

export default function Layout() {
  const handleLogout = async () => {
    await base44.auth.logout("/login");
  };

  return (
    <div className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
            <Image src={IMAGES.logo} alt="AutoReiki" className="w-full h-full" fittingType="fill" />
          </div>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-5 pb-32 pt-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 px-4 pb-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto rounded-full border border-white/10 bg-card/80 backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-lg shadow-black/40">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                  isActive ? "bg-primary/15 text-primary shadow-[0_0_14px_hsl(var(--primary)/0.35)]" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}