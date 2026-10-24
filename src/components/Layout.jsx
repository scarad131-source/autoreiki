import { Outlet, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import OfflineBanner from "@/components/OfflineBanner";
import BottomNav from "@/components/BottomNav";

export default function Layout() {
  const { pathname } = useLocation();
  // Inicio trae su propio encabezado (saludo + perfil); ahí se oculta la barra
  // superior para no duplicarla. El resto de pantallas la mantienen igual.
  const showTopBar = pathname !== "/";

  const handleLogout = async () => {
    await base44.auth.logout("/login");
  };

  return (
    <div className="app-shell min-h-svh w-full flex flex-col overflow-x-clip">
      {showTopBar &&
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 pt-[env(safe-area-inset-top)]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
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
      }

      <OfflineBanner />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        {!showTopBar && <div className="h-[env(safe-area-inset-top)]" />}
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}