import { useEffect, useState } from "react";
import { Download, Share, Plus, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { promptInstall, isStandalone, isIOS, subscribeInstallAvailability } from "@/lib/pwaInstall";

export default function InstallAppButton() {
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(() => isStandalone());
  const [canPrompt, setCanPrompt] = useState(false);
  const ios = isIOS();

  // El navegador avisa cuándo ofrece el diálogo nativo de instalación.
  useEffect(() => subscribeInstallAvailability(setCanPrompt), []);

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setInstalled(isStandalone());
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const handleClick = async () => {
    // Sin evento nativo (iOS o navegadores sin soporte): instrucciones paso a paso.
    if (!canPrompt) {
      setOpen(true);
      return;
    }
    const result = await promptInstall();
    if (result === "accepted") setInstalled(true);
    if (result === "unavailable") setOpen(true);
  };

  // Si la app ya está instalada no tiene sentido mostrar el botón.
  if (installed) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center justify-center gap-2 rounded-full border border-primary/60 bg-primary/15 px-5 py-2.5 font-body text-sm font-semibold text-primary shadow-[0_0_18px_hsl(var(--gold)/0.45),0_0_40px_hsl(var(--gold)/0.22),inset_0_0_12px_hsl(var(--gold)/0.12)] hover:bg-primary/25 hover:shadow-[0_0_26px_hsl(var(--gold)/0.6),0_0_55px_hsl(var(--gold)/0.3),inset_0_0_14px_hsl(var(--gold)/0.16)] transition-all active:scale-[0.99]"
      >
        <Download className="w-4 h-4" />
        Instalar App
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl border-primary/40 bg-gradient-to-b from-[rgba(46,20,74,0.92)] to-[rgba(18,8,34,0.96)] backdrop-blur-[10px] shadow-[0_0_30px_hsl(var(--gold)/0.38),0_0_80px_hsl(var(--gold)/0.20),0_18px_45px_rgba(0,0,0,0.55)]"
        >
          <DialogHeader>
            <DialogTitle>Instala AutoReiki</DialogTitle>
            <DialogDescription>
              {ios
                ? "Añádela a tu pantalla de inicio para abrirla como una app."
                : "Sigue estos pasos en tu navegador para instalarla."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {ios ? (
              <>
                <Step
                  icon={Share}
                  text="Toca el botón Compartir en la barra de Safari (el cuadro con la flecha hacia arriba)."
                />
                <Step icon={Plus} text="Elige “Añadir a pantalla de inicio”." />
                <Step icon={Download} text="Confirma con “Añadir”. El ícono aparecerá en tu inicio." />
              </>
            ) : (
              <>
                <Step
                  icon={MoreVertical}
                  text="Abre el menú del navegador (los tres puntos ⋮ arriba a la derecha)."
                />
                <Step icon={Plus} text="Elige “Instalar app” o “Añadir a pantalla de inicio”." />
                <Step icon={Download} text="Confirma y ábrela desde el ícono de tu inicio." />
              </>
            )}

            <p className="pt-1 font-body text-xs leading-relaxed text-muted-foreground">
              Nota: en iPhone debes usar Safari; en Android, Chrome.
            </p>

            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-gradient-to-r from-amber-light to-primary py-3 font-body font-semibold text-primary-foreground neon-glow active:scale-[0.99] transition-transform"
            >
              Entendido
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Step({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-card/60 p-3">
      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="font-body text-sm leading-snug text-foreground/90">{text}</p>
    </div>
  );
}