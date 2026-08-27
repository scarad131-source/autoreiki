import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import BrunoChat from "@/components/BrunoChat";

export default function BrunoBubble() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Permite abrir la burbuja desde otros puntos de la app (ej. botón Guía IA en Inicio)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-bruno", handler);
    return () => window.removeEventListener("open-bruno", handler);
  }, []);

  // Cierra al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir Bruno, guía de meditación"
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, hsl(276 86% 36%), hsl(268 100% 24%) 70%, hsl(268 100% 18%))",
          boxShadow:
            "0 0 18px hsl(180 100% 50% / 0.55), 0 0 36px hsl(180 100% 50% / 0.25), inset 0 0 14px hsl(268 100% 18% / 0.6)"
        }}
      >
        <span
          className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
          style={{ boxShadow: "0 0 22px hsl(180 100% 50% / 0.45)" }}
        />
        <MessageCircle className="w-6 h-6 text-white relative z-10" strokeWidth={2} />
        <span
          className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full"
          style={{
            background: "hsl(157 100% 42%)",
            boxShadow: "0 0 6px hsl(157 100% 42% / 0.8), 0 0 0 2px hsl(268 100% 24%)"
          }}
        />
      </button>
      <BrunoChat open={open} onClose={() => setOpen(false)} />
    </>
  );
}