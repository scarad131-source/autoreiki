// Preferencia "Recordarme" elegida al iniciar sesión.
// - Marcado (valor "1"): la sesión se mantiene activa aunque se cierre el navegador.
// - Sin marcar (valor "0"): la sesión solo dura la pestaña actual. sessionStorage
//   se vacía al cerrar el navegador, así que su ausencia indica una sesión nueva.
export const REMEMBER_KEY = "autoreiki_remember";
export const TAB_KEY = "autoreiki_tab";

export function saveRememberPreference(remember) {
  // El almacenamiento puede estar bloqueado (navegación privada en iOS/Android):
  // nunca debe impedir que el inicio de sesión continúe.
  try {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, "1");
    } else {
      localStorage.setItem(REMEMBER_KEY, "0");
      sessionStorage.setItem(TAB_KEY, "1");
    }
  } catch (e) {}
}