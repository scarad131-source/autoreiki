import { useState } from "react";
import { Lock, RefreshCw, LogOut, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const SALES_URL = "https://www.ebookmaker.online/builder/gerador-de-pagina/pagina-de-vendas-9aa15497-6fe9-42fc-a517-57f6818e9902";

export default function NoAccess() {
  const { checkUserAuth, logout } = useAuth();
  const [checking, setChecking] = useState(false);

  const recheck = async () => {
    setChecking(true);
    try {
      await base44.functions.invoke("syncUserAccess", {});
      await checkUserAuth();
    } catch (e) {
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center neon-glow">
          <Lock className="w-9 h-9 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold text-primary neon-text">Aún no tienes acceso</h1>
          <p className="text-muted-foreground leading-relaxed">
            Tu acceso a <span className="text-foreground font-semibold">AUTOREIKI</span> se activa automáticamente al
            completar tu compra. Usa el mismo correo con el que compraste para registrarte.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={SALES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-purple text-primary-foreground font-semibold neon-glow active:scale-[0.99] transition-transform"
          >
            Obtener acceso <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={recheck}
            disabled={checking}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl border border-primary/30 bg-card/60 text-foreground font-medium hover:border-primary/60 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
            {checking ? "Verificando..." : "Ya compré, revisar acceso"}
          </button>

          <button
            onClick={() => logout(true)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}