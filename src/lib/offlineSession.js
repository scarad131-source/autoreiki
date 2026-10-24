// Última sesión verificada en este dispositivo.
// Permite abrir la app y meditar sin conexión, cuando no se puede comprobar la
// sesión con el servidor.
const KEY = 'autoreiki_offline_user';

export function saveOfflineSession(user) {
  if (!user || !user.id) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      preferred_name: user.preferred_name,
      role: user.role,
      access_active: user.access_active,
      practice_level: user.practice_level,
      reminder_timezone: user.reminder_timezone,
      reiki_schedule: user.reiki_schedule,
    }));
  } catch (e) {}
}

export function getOfflineSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearOfflineSession() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {}
}