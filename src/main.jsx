import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// In dev, a stale service worker can cache-serve old JS chunks and break
// React resolution ("Cannot read properties of null (reading 'useState')").
// Unregister any workers and clear caches before booting.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then(async (regs) => {
      await Promise.all(regs.map((r) => r.unregister()));
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if (regs.length > 0) window.location.reload();
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)