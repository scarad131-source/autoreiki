// Captura el evento "beforeinstallprompt" en cuanto se carga el módulo, para no
// perderlo si la pantalla que muestra el botón monta más tarde.
let deferredPrompt = null;
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(!!deferredPrompt));

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

export function subscribeInstallAvailability(fn) {
  listeners.add(fn);
  fn(!!deferredPrompt);
  return () => listeners.delete(fn);
}

/** true si la app ya se abrió como instalada (pantalla de inicio) */
export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

/** true en iPhone / iPad (iPadOS 13+ se identifica como Mac táctil) */
export function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

/** Lanza el diálogo nativo de instalación. Devuelve accepted | dismissed | unavailable. */
export async function promptInstall() {
  const ev = deferredPrompt;
  if (!ev) return "unavailable";
  deferredPrompt = null;
  notify();
  try {
    await ev.prompt();
    const choice = await ev.userChoice;
    return choice?.outcome === "accepted" ? "accepted" : "dismissed";
  } catch (e) {
    return "unavailable";
  }
}