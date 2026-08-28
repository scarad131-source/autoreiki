import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Leaf, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { computeStreak, JOURNEY } from "@/lib/journey";
import JourneyBenefits from "@/components/JourneyBenefits";

export default function Recorrido() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [u, list, prog] = await Promise.all([
        base44.auth.me(),
        base44.entities.MeditationSession.list("-created_date", 100),
        base44.entities.JourneyProgress.list("-created_date", 100)]
        );
        setUser(u);
        setSessions(list);
        setProgress(prog);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tz = user?.reminder_timezone;
  const streak = computeStreak(sessions, tz);
  const completedDays = new Set((progress || []).map((p) => p.day_number));
  const completedCount = completedDays.size;
  const currentDay = Math.min(completedCount + 1, 21);
  const percent = Math.round(completedCount / 21 * 100);

  const progressText =
  completedCount === 0 ?
  { title: "Tu primer paso te espera", body: "Cada entrada que guardas ilumina el siguiente día del recorrido." } :
  completedCount >= 21 ?
  { title: "Recorrido completo", body: "Has cultivado un hábito sagrado. Celebra tu evolución y sigue adelante." } :
  { title: `Vas por el día ${currentDay}`, body: "Cada vez que regresas, tu práctica se vuelve más tuya." };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 rounded-2xl bg-accent/40 animate-pulse" />
        <div className="h-40 rounded-2xl bg-accent/40 animate-pulse" />
      </div>);

  }

  return (
    <div className="space-y-7">
      <header>
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground font-medium">Constancia</p>
        <h1 className="text-3xl font-semibold tracking-tight mt-1.5 [font-family:'Bodoni_Moda',_serif]">Reto de 21 días</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          No busques hacerlo perfecto. Solo regresar, una vez más, a tu centro.
        </p>
      </header>

      <JourneyBenefits />

      <section className="rounded-3xl bg-card border border-white/5 p-5 flex items-center gap-5">
        <ProgressRing percent={percent} value={completedCount} />
        <div>
          <p className="font-medium">{progressText.title}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{progressText.body}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Tu recorrido</h2>
        <div className="grid grid-cols-7 gap-2">
          {JOURNEY.map((j) => {
            const done = completedDays.has(j.day);
            const isCurrent = j.day === currentDay && !done;
            return (
              <button
                key={j.day}
                disabled={done || !isCurrent}
                onClick={isCurrent ? () => navigate("/meditar", { state: { meditarHoy: true, journeyDay: j.day } }) : undefined}
                className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${
                done ?
                "bg-primary/15 border-primary text-primary cursor-default opacity-70" :
                isCurrent ?
                "bg-accent border-primary/40 text-primary neon-glow active:scale-95" :
                "bg-card border-white/5 text-muted-foreground cursor-default opacity-60"}`
                }>
                
                {done ?
                <Check className="w-4 h-4" /> :
                isCurrent ?
                <span className="text-[10px] font-semibold uppercase tracking-wide">Iniciar</span> :

                <>
                    <span className="text-[9px] uppercase tracking-wide opacity-70">Día</span>
                    <span className="text-sm font-semibold tabular-nums">{j.day}</span>
                  </>
                }
              </button>);

          })}
        </div>
      </section>

      <section className="rounded-3xl bg-card border border-white/5 p-4 flex gap-3">
        <Leaf className="w-5 h-5 shrink-0 text-primary mt-0.5" />
        <p className="text-sm leading-relaxed">
          Si un día se interrumpe, no has perdido nada. Retoma cuando puedas y deja que la práctica vuelva a encontrarte.
        </p>
      </section>
    </div>);

}

function ProgressRing({ percent, value }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - percent / 100 * c;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--accent))" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="hsl(var(--glow))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 6px hsl(var(--glow) / 0.6))" }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-display font-semibold tabular-nums">{value}</p>
        <p className="text-[10px] text-muted-foreground -mt-0.5">días</p>
      </div>
    </div>);

}