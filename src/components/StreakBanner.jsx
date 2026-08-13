import { getStreakMessage } from "@/lib/journey";
import { Flame } from "lucide-react";

export default function StreakBanner({ streak }) {
  const msg = getStreakMessage(streak);
  return (
    <div className="rounded-2xl border border-glow/20 bg-gradient-to-r from-primary/10 to-glow-cyan/10 p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0 gold-glow">
        <Flame className="w-4 h-4 text-gold" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{msg.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{msg.body}</p>
      </div>
    </div>
  );
}