// DEBUG TEMPORAL: caja visible con los datos del audio de la sesión guiada.
// Se elimina junto con el bloque marcado "DEBUG TEMPORAL" de MeditationRunner.
export default function AudioDebugPanel({ url, format, playError, mediaError, endedReason, state }) {
  const rows = [
    ["URL de audio", url || "—"],
    ["Formato", format || "—"],
    ["play()", playError || "sin error"],
    ["evento 'error'", mediaError || "sin error"],
    ["Fin de sesión", endedReason || "no disparado"],
    ["Estado", state || "—"],
  ];

  return (
    <div className="fixed inset-x-2 top-2 z-[9999] max-h-[42svh] overflow-y-auto rounded-xl border border-red-400/70 bg-black/90 p-2.5 text-[10px] leading-snug text-white shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      <p className="mb-1.5 font-bold uppercase tracking-[0.12em] text-red-300">Debug audio (temporal)</p>
      <dl className="space-y-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-1.5">
            <dt className="shrink-0 font-semibold text-amber-300">{label}:</dt>
            <dd className="break-all font-mono text-white/90">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}