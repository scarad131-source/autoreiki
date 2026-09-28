import { useState, useEffect } from 'react';
import { isOnline, getQueueCount, flushQueue } from '@/lib/offlineSync';
import { base44 } from '@/api/base44Client';

// Hook que rastrea el estado de conexión, el conteo de la cola offline
// y sincroniza automáticamente al volver a internet.
export function useOfflineStatus() {
  const [online, setOnline] = useState(isOnline());
  const [queueCount, setQueueCount] = useState(getQueueCount());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const doSync = async () => {
      const count = getQueueCount();
      if (count === 0) return;
      setSyncing(true);
      try {
        await flushQueue(base44);
      } catch (e) {}
      setSyncing(false);
      setQueueCount(getQueueCount());
    };

    const onOnline = () => {
      setOnline(true);
      doSync();
    };
    const onOffline = () => setOnline(false);
    const onQueueChanged = () => setQueueCount(getQueueCount());

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('offline-queue-changed', onQueueChanged);

    // Si arrancamos online con items pendientes, sincronizar al montar.
    if (isOnline() && getQueueCount() > 0) doSync();

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('offline-queue-changed', onQueueChanged);
    };
  }, []);

  return { online, queueCount, syncing };
}