import { Outlet, NavLink } from "react-router-dom";
import { Star, CalendarDays, CalendarClock, BookOpen, HelpCircle, LogOut, Lock, Sparkles } from "lucide-react";
import LotusIcon from "@/components/LotusIcon";
import ChakraCircleIcon from "@/components/ChakraCircleIcon";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

const navItems = [
  { to: "/", label: "Hoy", icon: Star, end: true },
  { to: "/configurar", label: "Mi sesión", icon: ChakraCircleIcon },
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
    <div className="min-h-svh flex">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 h-svh sticky top-0 text-white"
        style={{
          background:
            "radial-gradient(ellipse at top left, #1A1629 0%, #0B0A12 70%)",
        }}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/15">
              <Image src={IMAGES.logo} alt="AutoReiki" className="w-full h-full" fittingType="fill" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#FFC885] ring-2 ring-[#1A1629]" />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold tracking-[0.12em] uppercase">Asistente Reiki</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-2 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-white/40">Tu práctica</p>
          <ul className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-[#4A356A]/70 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FFC885] shadow-[0_0_8px_#FFC885]" />
                      )}
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${isActive ? "ml-1" : "ml-2.5"}`}
                        strokeWidth={1.8}
                      />
                      <span className="font-medium">{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4">
          <div className="rounded-xl border border-white/10 px-3 py-3">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#C8A885]" strokeWidth={1.8} />
              <p className="text-xs font-medium text-white/85">Datos locales</p>
            </div>
            <p className="text-[11px] text-white/45 mt-1 leading-snug">
              Tu información permanece en este navegador.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.8} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 backdrop-blur-xl bg-background/70 pt-[env(safe-area-inset-top)]">
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
        <main className="flex-1 max-w-3xl w-full mx-auto px-5 pb-28 md:pb-10 pt-4">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pointer-events-none">
          <div
            className="max-w-md mx-auto pointer-events-auto rounded-full border border-white/10 backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-lg shadow-black/40"
            style={{ backgroundColor: "#4B0082" }}
          >
            {navItems.slice(0, 5).map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1.5 px-1.5 py-1 transition-all ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive ? "bg-white/20 shadow-[0_0_16px_hsl(var(--primary)/0.6)]" : "bg-white/5"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} strokeWidth={isActive ? 2.4 : 2} />
                    </span>
                    <span className="text-[10px] font-medium">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}