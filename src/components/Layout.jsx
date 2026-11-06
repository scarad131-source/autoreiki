import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import OfflineBanner from "@/components/OfflineBanner";
import BottomNav from "@/components/BottomNav";
import RouteTransition from "@/components/RouteTransition";

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // Botón de retroceso en las pantallas internas: nunca en Inicio y solo si
  // hay historial previo al que volver.
  const canGoBack = pathname !== "/" && window.history.length > 1;
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
          <div className="flex items-center gap-1.5 min-w-0">
            {canGoBack && (
              <button
                onClick={() => navigate(-1)}
                className="w-11 h-11 -ml-2.5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground transition-colors shrink-0"
                aria-label="Atrás"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
              <Image src={IMAGES.logo} alt="AutoReiki" className="block w-full h-full" fittingType="fill" />
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>
      }

      <OfflineBanner />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] overscroll-none">
        {!showTopBar && <div className="h-[env(safe-area-inset-top)]" />}
        <RouteTransition />
      </main>

      <BottomNav />
    </div>
  );
}