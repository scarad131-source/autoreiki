import { useNavigate } from "react-router-dom";
import { Image } from "@/components/ui/image";

// Ilustraciones premium de los accesos (imágenes de marca del usuario).
const DIARIO_ART =
  "https://media.base44.com/images/public/6a7d30a899098694894dbd88/0f3e36f7d_AutoReiki_Boton_Diario.png";
const AYUDA_ART =
  "https://media.base44.com/images/public/6a7d30a899098694894dbd88/e617d5608_AutoReiki_Boton_Ayuda.png";
const HISTORIAL_ART =
  "https://media.base44.com/images/public/6a7d30a899098694894dbd88/461158263_AutoReiki_Boton_Historial.png";

// Galería de accesos: misma proporción y mismo borde en las tres tarjetas.
const ACTIONS = [
  { label: "Diario", sub: "Tus emociones", to: "/diario", image: DIARIO_ART },
  { label: "Ayuda", sub: "Acompañamiento", to: "/ayuda", image: AYUDA_ART },
  { label: "Historial", sub: "Tu evolución", to: "/historial", image: HISTORIAL_ART },
];

export default function HomeQuickAccess() {
  const navigate = useNavigate();

  return (
    <nav className="grid grid-cols-3 gap-3">
      {ACTIONS.map(({ label, to, image }) => (
        <button
          key={to}
          onClick={() => navigate(to)}
          aria-label={label}
          // Proporción 2:3 (la de la ilustración) para que la fila se mantenga
          // uniforme en móvil y tablet, sin recortar el arte.
          className="relative aspect-[2/3] rounded-[20px] overflow-hidden border border-primary/40 bg-white/5 backdrop-blur-[10px] transition-all duration-300 active:scale-[0.97] hover:border-primary/70 hover:shadow-[0_0_24px_rgba(212,175,55,0.22)]"
        >
          <Image src={image} alt={label} className="block w-full h-full" fittingType="fill" />
        </button>
      ))}
    </nav>
  );
}