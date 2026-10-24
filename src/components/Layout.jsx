import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import OfflineBanner from "@/components/OfflineBanner";
import BottomNav from "@/components/BottomNav";

export default function Layout() {
  const handleLogout = async () => {
    await base44.auth.logout("/login");
  };

  return (
    <div className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 pt-[env(safe-area-inset-top)]">
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

      <OfflineBanner />

      <main className="flex-1 max-w-3xl w-full mx-auto px-5 pb-32 pt-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}