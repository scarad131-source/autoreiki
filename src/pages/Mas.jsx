import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, ChevronRight, History, Award } from "lucide-react";

const ITEMS = [
  {
    to: "/diario",
    icon: BookOpen,
    title: "Diario",
    desc: "Registra tu evolución después de cada práctica y vuelve a leer lo que descubriste.",
    tone: "gold",
  },
  {
    to: "/ayuda",
    icon: Sparkles,
    title: "Ayuda",
    desc: "Respuestas cálidas y sencillas para que ninguna duda se convierta en barrera.",
    tone: "purple",
  },
];

export default function Mas() {
  const navigate = useNavigate();
  return (
    <div className="space-y-7">
      <header className="pt-2">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground font-medium">Más</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-1.5">Tu espacio personal</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md">
          Registra tu evolución y encuentra acompañamiento cuando lo necesites.
        </p>
      </header>

      <div className="space-y-3">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.to}
              onClick={() => navigate(it.to)}
              className="w-full text-left rounded-3xl bg-card border border-white/5 p-5 flex items-center gap-4 hover:border-primary/30 transition-colors active:scale-[0.99]"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  it.tone === "gold"
                    ? "bg-primary/15 text-primary gold-glow"
                    : "bg-purple/15 text-purple purple-glow"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{it.title}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-snug">{it.desc}</p>
              </div>
              <ChevronRight
                className={`w-5 h-5 shrink-0 ${it.tone === "gold" ? "text-primary" : "text-muted-foreground"}`}
              />
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => navigate("/historial")}
          className="rounded-2xl bg-card border border-white/5 p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
        >
          <History className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Historial</span>
        </button>
        <button
          onClick={() => navigate("/perfil")}
          className="rounded-2xl bg-card border border-white/5 p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
        >
          <Award className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
}