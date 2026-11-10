import { useEffect, useState } from "react";
import { BellRing, BellOff, Loader2, Smartphone } from "lucide-react";
import {
  isPushSupported,
  isiOSDevice,
  getPushState,
  enablePush,
  disablePush,
  sendTestPush,
} from "@/lib/push";

function standaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

// Aviso que llega al teléfono con la app cerrada (notificación push).
export default function ReminderPushCard() {
  const [supported] = useState(isPushSupported());
  const [installed] = useState(standaloneMode);
  const [subscribed, setSubscribed] = useState(false);
  const [permission, setPermission] = useState("default");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!supported) return;
    let active = true;
    getPushState()
      .then((state) => {
        if (!active) return;
        setSubscribed(state.subscribed);
        setPermission(state.permission);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [supported]);

  const activate = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await enablePush();
      setSubscribed(true);
      setPermission("granted");
      const result = await sendTestPush();
      setMessage(
        result && result.sent > 0
          ? "Aviso de prueba enviado. Debería llegar en unos segundos."
          : "Activado. Si no llega el aviso, revisa los permisos de notificaciones del teléfono."
      );
    } catch (e) {
      const reason = e && e.message;
      if (reason === "denied") {
        setPermission("denied");
        setMessage("Bloqueaste los avisos. Actívalos en los ajustes del navegador y vuelve a intentar.");
      } else if (reason === "no-service-worker") {
        setMessage("Abre la app instalada en tu pantalla de inicio para activar los avisos.");
      } else if (reason === "unsupported") {
        setMessage("Este navegador no permite avisos con la app cerrada.");
      } else {
        setMessage("No se pudo activar el aviso en este dispositivo.");
      }
    } finally {
      setBusy(false);
    }
  };

  const deactivate = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await disablePush();
      setSubscribed(false);
    } catch (e) {
      setMessage("No se pudo desactivar el aviso en este dispositivo.");
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await sendTestPush();
      setMessage(
        result && result.sent > 0
          ? "Aviso de prueba enviado."
          : "No hay ningún dispositivo activo. Vuelve a activar el aviso."
      );
    } catch (e) {
      setMessage("No se pudo enviar el aviso de prueba.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center gap-2.5">
        <Smartphone className="w-4 h-4 text-primary shrink-0" />
        <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Aviso con la app cerrada
        </p>
      </div>

      {!supported && (
        <p className="font-body text-[11px] leading-snug text-muted-foreground">
          Este navegador no permite avisos con la app cerrada. Instala AutoReiki o ábrela en Chrome o Safari.
        </p>
      )}

      {supported && isiOSDevice() && !installed && (
        <p className="font-body text-[11px] leading-snug text-muted-foreground">
          En iPhone los avisos solo funcionan en la app instalada. Añádela a tu pantalla de inicio y ábrela
          desde el ícono para activarlos.
        </p>
      )}

      {supported && !(isiOSDevice() && !installed) && (
        <>
          {permission === "denied" ? (
            <p className="font-body text-[11px] leading-snug text-muted-foreground">
              Los avisos están bloqueados para este navegador. Actívalos en los ajustes del teléfono y
              vuelve a intentar.
            </p>
          ) : subscribed ? (
            <div className="space-y-2">
              <p className="font-body text-[11px] leading-snug text-foreground/85">
                Activo en este dispositivo. El aviso suena aunque la app esté cerrada.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={test}
                  disabled={busy}
                  className="flex-1 min-h-[44px] rounded-xl bg-primary/15 border border-primary/40 text-primary font-body text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <BellRing className="w-4 h-4" />}
                  Probar
                </button>
                <button
                  type="button"
                  onClick={deactivate}
                  disabled={busy}
                  className="flex-1 min-h-[44px] rounded-xl border border-white/15 text-muted-foreground font-body text-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  <BellOff className="w-4 h-4" />
                  Desactivar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={activate}
              disabled={busy}
              className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-primary to-bone text-primary-foreground font-body text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <BellRing className="w-4 h-4" />}
              Activar aviso en este dispositivo
            </button>
          )}

          {message && (
            <p className="font-body text-[11px] leading-snug text-primary/90">{message}</p>
          )}
        </>
      )}
    </div>
  );
}