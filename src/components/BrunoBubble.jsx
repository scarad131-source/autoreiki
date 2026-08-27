import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function BrunoBubble() {
  const navigate = useNavigate();
  const location = useLocation();

  // Oculta la burbuja dentro de la propia pantalla del asistente
  if (location.pathname === "/guia-meditacion") return null;

  return (
    <button
      onClick={() => navigate("/guia-meditacion")}
      aria-label="Abrir Bruno, guía de meditación"
      className="fixed top-[calc(0.75rem+env(safe-area-inset-top))] right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95"
      style={{
        background:
          "radial-gradient(circle at 32% 28%, hsl(276 86% 36%), hsl(268 100% 24%) 70%, hsl(268 100% 18%))",
        boxShadow:
          "0 0 18px hsl(180 100% 50% / 0.55), 0 0 36px hsl(180 100% 50% / 0.25), inset 0 0 14px hsl(268 100% 18% / 0.6)"
      }}
    >
      {/* Halo neón cian */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
        style={{ boxShadow: "0 0 22px hsl(180 100% 50% / 0.45)" }}
      />
      <MessageCircle className="w-6 h-6 text-white relative z-10" strokeWidth={2} />
      {/* Notificación esmeralda */}
      <span
        className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full"
        style={{
          background: "hsl(157 100% 42%)",
          boxShadow: "0 0 6px hsl(157 100% 42% / 0.8), 0 0 0 2px hsl(268 100% 24%)"
        }}
      />
    </button>
  );
}