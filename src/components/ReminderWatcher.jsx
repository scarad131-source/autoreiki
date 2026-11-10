import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { initReminderAudio, playReminderChime } from "@/lib/reminderAlarm";
import { getDailyPhrase } from "@/lib/dailyPhrases";

const FIRED_KEY = "reiki_reminder_fired";
// Si abres la app hasta 3 h después de tu hora, el recordatorio igual aparece.
const CATCH_UP_MINUTES = 180;

const dayStamp = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const minutesNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).slice(0, 5).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

export default function ReminderWatcher() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setUser(await base44.auth.me());
    } catch (e) {}
  }, []);

  useEffect(() => {
    const stopUnlock = initReminderAudio();
    load();
    const onBack = () => {
      if (document.visibilityState === "visible") load();
    };
    window.addEventListener("focus", onBack);
    window.addEventListener("pageshow", onBack);
    return () => {
      stopUnlock();
      window.removeEventListener("focus", onBack);
      window.removeEventListener("pageshow", onBack);
    };
  }, [load]);

  // Revisa la hora local cada 20 s mientras la app está abierta.
  useEffect(() => {
    if (!user?.reminder_enabled || !user?.reminder_time) return;
    const target = toMinutes(user.reminder_time);

    const check = () => {
      if (document.visibilityState === "hidden") return;
      const diff = minutesNow() - target;
      if (diff < 0 || diff > CATCH_UP_MINUTES) return;
      try {
        if (localStorage.getItem(FIRED_KEY) === dayStamp()) return;
        localStorage.setItem(FIRED_KEY, dayStamp());
      } catch (e) {
        return;
      }
      playReminderChime();
      setOpen(true);
    };

    check();
    const id = setInterval(check, 20000);
    return () => clearInterval(id);
  }, [user]);

  if (!open) return null;

  const firstName = user?.preferred_name || user?.full_name?.split(" ")[0] || "";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-sm rounded-3xl border border-primary/40 bg-card p-6 text-center shadow-[0_0_30px_hsl(var(--gold)/0.35),0_18px_45px_rgba(0,0,0,0.55)]"
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2 w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
          aria-label="Cerrar recordatorio"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-glow-cyan flex items-center justify-center neon-glow">
          <Bell className="w-8 h-8 text-primary-foreground" />
        </div>

        <h3 className="font-display text-2xl font-semibold mt-4">Es hora de tu Reiki</h3>
        <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed">
          {firstName ? `${firstName}, ` : ""}
          {getDailyPhrase()}
        </p>

        <button
          onClick={() => {
            setOpen(false);
            navigate("/configurar");
          }}
          className="w-full mt-5 min-h-[48px] rounded-full bg-gradient-to-r from-primary to-bone text-primary-foreground font-body font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
        >
          Empezar mi sesión
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setOpen(false)}
          className="w-full mt-2 min-h-[44px] rounded-full border border-white/10 text-muted-foreground font-body text-sm hover:bg-accent/40 transition-colors"
        >
          Más tarde
        </button>
      </motion.div>
    </div>
  );
}