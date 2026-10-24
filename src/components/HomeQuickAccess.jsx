import { useNavigate } from "react-router-dom";
import { BookOpen, History } from "lucide-react";
import LotusIcon from "@/components/LotusIcon";

// Galería de accesos: tarjetas cuadradas de cristal con icono dorado.
const ACTIONS = [
  { label: "Diario", sub: "Tus emociones", icon: BookOpen, to: "/diario" },
  { label: "Ayuda", sub: "Acompañamiento", icon: LotusIcon, to: "/ayuda" },
  { label: "Historial", sub: "Tu evolución", icon: History, to: "/historial" },
];

export default function HomeQuickAccess() {
  const navigate = useNavigate();

  return (
    <nav className="grid grid-cols-3 gap-3">
      {ACTIONS.map(({ label, sub, icon: Icon, to }) => (
        <button
          key={to}
          onClick={() => navigate(to)}
          className="aspect-square rounded-[20px] border border-primary/40 bg-white/5 backdrop-blur-[10px] flex flex-col items-center justify-center gap-2 px-2 text-center transition-transform active:scale-[0.97] hover:border-primary/70"
        >
          <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
          <span className="font-display text-base leading-none">{label}</span>
          <span className="font-body text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{sub}</span>
        </button>
      ))}
    </nav>
  );
}