// Cola offline: guarda escrituras localmente cuando no hay conexión
// y las sincroniza con el servidor al volver a internet.

const QUEUE_KEY = 'autoreiki_offline_queue';

export const isOnline = () => (typeof navigator !== 'undefined' ? navigator.onLine : true);

export function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveQueue(q) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export function getQueueCount() {
  return getQueue().length;
}

// Ejecuta la acción inmediatamente si hay conexión; si no, la encola.
export async function queueIfOffline(action, descriptor) {
  if (isOnline()) {
    return action();
  }
  const q = getQueue();
  q.push({ ...descriptor, ts: Date.now() });
  saveQueue(q);
  window.dispatchEvent(new CustomEvent('offline-queue-changed'));
  return { __offline_queued: true };
}

// Reproduce todas las escrituras encoladas cuando vuelve la conexión.
export async function flushQueue(base44) {
  const q = getQueue();
  if (!q.length) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  const remaining = [];

  for (const item of q) {
    try {
      if (item.kind === 'entity') {
        await base44.entities[item.entity][item.method](item.data);
      } else if (item.kind === 'auth') {
        await base44.auth[item.method](item.data);
      }
      synced++;
    } catch (e) {
      failed++;
      remaining.push(item);
    }
  }

  saveQueue(remaining);
  window.dispatchEvent(new CustomEvent('offline-queue-changed'));
  return { synced, failed };
}