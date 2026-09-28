import { WifiOff, RefreshCw, CloudOff, AlertTriangle } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

// Banner de advertencia: visible cuando no hay conexión, hay datos
// pendientes de sincronizar, o la sincronización está en curso.
export default function OfflineBanner() {
  const { online, queueCount, syncing } = useOfflineStatus();

  if (online && queueCount === 0 && !syncing) return null;

  return (
    <div className="max-w-3xl mx-auto px-5 pt-2">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/70 backdrop-blur-xl px-4 py-3 shadow-lg">
        {!online && (
          <div className="flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-amber-100">Modo sin conexión</p>
              <p className="text-xs text-amber-200/80 leading-snug mt-0.5">
                {queueCount > 0
                  ? `Tienes ${queueCount} ${queueCount === 1 ? 'dato guardado' : 'datos guardados'} localmente.`
                  : 'Tus datos se guardarán en este dispositivo.'}
              </p>
              <p className="text-xs text-amber-300 font-medium leading-snug mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                No cierres la app antes de conectarte a internet para sincronizar tus datos.
              </p>
            </div>
          </div>
        )}
        {online && syncing && (
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0 animate-spin" />
            <p className="text-sm text-emerald-100">
              Sincronizando {queueCount} {queueCount === 1 ? 'dato' : 'datos'}…
            </p>
          </div>
        )}
        {online && !syncing && queueCount > 0 && (
          <div className="flex items-center gap-3">
            <CloudOff className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-100">
              {queueCount} {queueCount === 1 ? 'dato pendiente' : 'datos pendientes'} de sincronizar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}