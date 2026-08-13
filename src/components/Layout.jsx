import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Home as HomeIcon, Wind, History, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

const navItems = [
  { to: "/", label: "Inicio", icon: HomeIcon, end: true },
  { to: "/meditar", label: "Meditar", icon: Wind },
  { to: "/historial", label: "Historial", icon: History },
];

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await base44.auth.logout("/login");
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-violet-400 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-semibold tracking-tight">Reiki Sereno</p>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Asistente de meditación</p>
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

      <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-around">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all ${
                  isActive
                    ? "text-teal-600"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} strokeWidth={isActive ? 2.4 : 2} />
                  <span className="text-[11px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}