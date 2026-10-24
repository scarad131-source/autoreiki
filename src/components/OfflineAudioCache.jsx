import { useEffect } from "react";
import { AUDIO_SOURCES } from "@/lib/audioSources";
import { BOWL_HIT_URL } from "@/lib/audioEngine";

// Audios que necesita una sesión: ambiente, voz guiada y el cuenco que marca los
// cambios de zona en las sesiones no guiadas.
const AUDIO_URLS = [...new Set([...Object.values(AUDIO_SOURCES).map((s) => s.url), BOWL_HIT_URL])];

// Pide al service worker que guarde los audios para poder meditar sin conexión.
// Se hace en segundo plano al abrir la app con conexión y solo se descarga una
// vez por audio.
export default function OfflineAudioCache() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !navigator.onLine) return;

    const conn = navigator.connection;
    // Respeta el ahorro de datos y las conexiones muy lentas.
    if (conn && (conn.saveData || conn.effectiveType === "slow-2g" || conn.effectiveType === "2g")) return;

    navigator.serviceWorker.ready
      .then((registration) => {
        const worker = registration.active || navigator.serviceWorker.controller;
        if (worker) worker.postMessage({ type: "CACHE_AUDIO", urls: AUDIO_URLS });
      })
      .catch(() => {});
  }, []);

  return null;
}