import { ClipboardList, Sparkles, BarChart3 } from "lucide-react";

const TABS = [
  { id: "nueva", label: "Nueva entrada", icon: ClipboardList },
  { id: "interprete", label: "Intérprete", icon: Sparkles },
  { id: "patrones", label: "Mis patrones", icon: BarChart3 },
];

export default function DiaryTabNav({ active, onChange }) {
  return (
    <div className="flex p-1 rounded-full bg-card border border-white/10">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              isActive
                ? "bg-primary text-primary-foreground neon-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(" ")[0]}</span>
          </button>
        );
      })}
    </div>
  );
}