import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// In dev, a stale service worker can cache-serve old JS chunks and break
// React resolution ("Cannot read properties of null (reading 'useState')").
// Clear caches so the next load fetches fresh chunks. We do NOT unregister
// the Base44 visual-edit worker or reload — that would loop, since the
// plugin re-registers it on every load.
if (import.meta.env.DEV && 'caches' in window) {
  window.addEventListener('load', () => {
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)