// Persistencia local de una sesión guiada pausada para poder reanudarla luego.
const KEY = "autoreiki_paused_session";

export function savePausedSession(config, elapsed) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ config, elapsed: Math.max(0, Math.floor(elapsed || 0)), savedAt: Date.now() })
    );
  } catch (e) {
    // ignore storage errors
  }
}

export function getPausedSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearPausedSession() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // ignore storage errors
  }
}