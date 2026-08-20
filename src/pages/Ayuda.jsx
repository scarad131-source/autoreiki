import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const FAQ = [
  {
    q: "¿Necesito experiencia previa?",
    a: "No. AutoReiki está diseñado para acompañarte desde tu primera sesión, sin importar tu nivel.",
  },
  {
    q: "¿Cuánto dura una sesión?",
    a: "Puedes elegir entre 5, 10 o 30 minutos. Lo importante es la constancia, no la duración.",
  },
  {
    q: "¿Qué es el recorrido de 21 días?",
    a: "Una guía diaria que te lleva de la toma de conciencia a la integración, paso a paso.",
  },
  {
    q: "¿Puedo practicar sin voz guía?",
    a: "Sí. En modo no guiado solo tú, tu respiración y el sonido ambiente.",
  },
];

export default function Ayuda() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between -ml-1">
        <button
          onClick={() => navigate("/mas")}
          className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center hover:border-primary/30 transition-colors"
          aria-label="Volver"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-semibold">Ayuda</h1>
        <div className="w-10" />
      </header>

      <div className="space-y-3">
        {FAQ.map((f) => (
          <div key={f.q} className="rounded-2xl bg-card border border-white/5 p-4">
            <p className="font-medium text-sm">{f.q}</p>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}