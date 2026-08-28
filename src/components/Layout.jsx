import { Outlet, NavLink } from "react-router-dom";
import { Star, CalendarDays, CalendarClock, BookOpen, HelpCircle, LogOut, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

const navItems = [
  { to: "/", label: "Hoy", icon: Star, end: true },
  { to: "/configurar", label: "Mi sesión", icon: Star },
  { to: "/recorrido", label: "21 días", icon: CalendarDays },
  { to: "/agenda-reiki", label: "Agenda", icon: CalendarClock },
  { to: "/diario", label: "Diario", icon: BookOpen },
  { to: "/ayuda", label: "Ayuda", icon: HelpCircle },
];

export default function Layout() {
  const handleLogout = async () => {
    await base44.auth.logout("/login");
  };

  return (
    <div className="min-h-svh flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border pt-[env(safe-area-inset-top)]">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-primary/40">
              <Image src={IMAGES.logo} alt="AutoReiki" className="w-full h-full" fittingType="fill" />
            </div>
            <p className="text-[13px] font-semibold tracking-[0.12em] uppercase text-primary neon-text">Asistente Reiki</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 pb-28 md:pb-10 pt-4">
        <Outlet />
      </main>

      {/* Horizontal bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-none">
        <div
          className="max-w-3xl mx-auto pointer-events-auto rounded-full border border-primary/30 backdrop-blur-xl px-1.5 py-1.5 flex items-center justify-around shadow-lg shadow-black/40 neon-glow"
          style={{ backgroundColor: "hsl(270 50% 10%)" }}
        >
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-1 py-0.5 transition-all ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isActive ? "bg-primary/20 shadow-[0_0_12px_hsl(var(--glow)/0.6)]" : "bg-transparent"
                    }`}
                  >
                    <Icon className={`w-[15px] h-[15px] ${isActive ? "scale-110" : ""} transition-transform`} strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  <span className="text-[9px] font-medium leading-none">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}