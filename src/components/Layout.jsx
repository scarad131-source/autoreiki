import { Outlet, NavLink } from "react-router-dom";
import { Home as HomeIcon, Wind, History, LogOut, Footprints, Settings } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

const navItems = [
  { to: "/", label: "Inicio", icon: HomeIcon, end: true },
  { to: "/recorrido", label: "21 días", icon: Footprints },
  { to: "/meditar", label: "Meditar", icon: Wind },
  { to: "/configurar", label: "Configurar", icon: Settings },
  { to: "/historial", label: "Historial", icon: History },
];

export default function Layout() {
  const handleLogout = async () => {
    await base44.auth.logout("/login");
  };

  return (
    <div className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/60 border-b border-glow/20">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden neon-glow shrink-0">
              <Image src={IMAGES.logo} alt="AutoReiki" className="w-full h-full" fittingType="fill" />
            </div>
            <div className="leading-tight">
              <p className="font-heading text-[13px] font-semibold tracking-[0.2em] uppercase neon-text">AutoReiki</p>
              <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">Asistente de meditación</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-5 pb-28 pt-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-glow/20 bg-background/85 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-2 h-16 flex items-center justify-around">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1.5 rounded-2xl transition-all ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 ${isActive ? "scale-110 neon-text" : ""} transition-transform`}
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