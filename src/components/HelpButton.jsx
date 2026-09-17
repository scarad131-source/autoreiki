import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, LifeBuoy, UserCog, ArrowLeft, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function HelpButton({ user, onSaved }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("menu"); // menu | support | name
  const [name, setName] = useState(user?.preferred_name || "");
  const [saving, setSaving] = useState(false);

  const reset = () => setView("menu");

  const handleOpenChange = (v) => {
    setOpen(v);
    if (!v) setTimeout(reset, 200);
    else setName(user?.preferred_name || "");
  };

  const goSupport = () => {
    setOpen(false);
    setTimeout(reset, 200);
    navigate("/ayuda");
  };

  const saveName = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ preferred_name: name.trim() || undefined });
      onSaved?.();
      toast({ title: "Nombre actualizado", description: "Tu nombre se guardó correctamente." });
      setOpen(false);
      setTimeout(reset, 200);
    } catch (e) {
      toast({
        title: "No se pudo guardar",
        description: "Inténtalo de nuevo en un momento.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="py-1.5 px-3 text-xs rounded-full border border-primary/30 bg-primary/5 text-primary/90 font-medium flex items-center justify-center gap-1.5 hover:bg-primary/15 transition-colors active:scale-[0.99]"
        >
          <HelpCircle className="w-3 h-3" />
          Ayuda
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-3xl border-primary/20">
        {view === "menu" && (
          <>
            <DialogHeader>
              <DialogTitle>¿En qué podemos ayudarte?</DialogTitle>
              <DialogDescription>Elige una opción para continuar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 mt-2">
              <button
                onClick={() => setView("support")}
                className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-card/60 hover:border-primary/40 transition-colors text-left active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Contactar a soporte</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Resuelve dudas con nuestra ayuda.</p>
                </div>
              </button>
              <button
                onClick={() => setView("name")}
                className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-card/60 hover:border-primary/40 transition-colors text-left active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <UserCog className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Cambiar nombre</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Actualiza cómo te llamamos.</p>
                </div>
              </button>
            </div>
          </>
        )}

        {view === "support" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <button
                  onClick={reset}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                Contactar a soporte
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Estamos aquí para acompañarte. Para dudas sobre tu práctica, revisa la sección de Ayuda con respuestas rápidas. Para problemas con tu cuenta, nuestro equipo te responderá a la brevedad.
              </p>
              <button
                onClick={goSupport}
                className="w-full rounded-xl bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-semibold py-3 neon-glow active:scale-[0.99] transition-transform"
              >
                Ver sección de Ayuda
              </button>
            </div>
          </>
        )}

        {view === "name" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <button
                  onClick={reset}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                Cambiar nombre
              </DialogTitle>
              <DialogDescription>¿Cómo quieres que te llamemos?</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-white/10 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={saveName}
                disabled={saving}
                className="w-full rounded-xl bg-gradient-to-r from-amber-light to-primary text-primary-foreground font-semibold py-3 neon-glow active:scale-[0.99] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}