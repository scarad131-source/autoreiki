import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";
import { Image } from "@/components/ui/image";

// Ilustraciones premium de los accesos (imágenes de marca del usuario).
const DIARIO_ART =
  "https://media.base44.com/images/public/6a7d30a899098694894dbd88/0f3e36f7d_AutoReiki_Boton_Diario.png";
const AYUDA_ART =
  "https://media.base44.com/images/public/6a7d30a899098694894dbd88/e617d5608_AutoReiki_Boton_Ayuda.png";

// Galería de accesos: misma proporción y mismo borde en las tres tarjetas.
const ACTIONS = [
  { label: "Diario", sub: "Tus emociones", to: "/diario", image: DIARIO_ART },
  { label: "Ayuda", sub: "Acompañamiento", to: "/ayuda", image: AYUDA_ART },
  { label: "Historial", sub: "Tu evolución", icon: History, to: "/historial" },
];

export default function HomeQuickAccess() {
  const navigate = useNavigate();

  return (
    <nav className="grid grid-cols-3 gap-3">
      {ACTIONS.map(({ label, sub, icon: Icon, image, to }) => (
        <button
          key={to}
          onClick={() => navigate(to)}
          aria-label={label}
          // Proporción 2:3 (la de la ilustración) para que la fila se mantenga
          // uniforme en móvil y tablet, sin recortar el arte.
          className="relative aspect-[2/3] rounded-[20px] overflow-hidden border border-primary/40 bg-white/5 backdrop-blur-[10px] transition-all duration-300 active:scale-[0.97] hover:border-primary/70 hover:shadow-[0_0_24px_rgba(212,175,55,0.22)]"
        >
          {image ? (
            <Image src={image} alt={label} className="block w-full h-full" fittingType="fill" />
          ) : (
            <span className="w-full h-full flex flex-col items-center justify-center gap-2 px-2 text-center">
              <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <span className="font-display text-base leading-none">{label}</span>
              <span className="font-body text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{sub}</span>
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}