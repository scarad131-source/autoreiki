import { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { REMEMBER_KEY, TAB_KEY } from "@/lib/sessionPreference";

/**
 * Aplica la preferencia "Recordarme" al abrir la app.
 * Si el usuario desmarcó la casilla al iniciar sesión, su sesión solo vale para
 * la pestaña/ventana en la que entró: al cerrar el navegador, sessionStorage se
 * vacía y aquí se cierra la sesión guardada. Si la marcó (o nunca la tocó), la
 * sesión se mantiene como siempre.
 */
export default function SessionPersistence() {
  useEffect(() => {
    (async () => {
      try {
        if (!(await base44.auth.isAuthenticated())) {
          // Sin sesión no hay nada que cerrar; se limpia la marca para que el
          // próximo inicio de sesión decida de nuevo según la casilla.
          localStorage.removeItem(REMEMBER_KEY);
          return;
        }
        if (localStorage.getItem(REMEMBER_KEY) !== "0") return;
        if (sessionStorage.getItem(TAB_KEY)) return;
        localStorage.removeItem(REMEMBER_KEY);
        await base44.auth.logout("/login");
      } catch (e) {
        // Si la comprobación falla, no se interrumpe la sesión del usuario.
      }
    })();
  }, []);

  return null;
}