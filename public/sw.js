// Service worker para modo offline (modo avión).
// Guarda tres cosas para que la meditación no se interrumpa sin conexión:
//   1) el app shell (HTML/JS/CSS)                         -> SHELL_CACHE
//   2) imágenes y fuentes que usa la interfaz             -> MEDIA_CACHE
//   3) los audios de las sesiones (ambiente y voz guiada) -> AUDIO_CACHE

const SHELL_CACHE = 'autoreiki-shell-v4';
const MEDIA_CACHE = 'autoreiki-media-v4';
const AUDIO_CACHE = 'autoreiki-audio-v4';
const CACHES = [SHELL_CACHE, MEDIA_CACHE, AUDIO_CACHE];

// La app avisa cuando hay una sesión sonando: la descarga anticipada se detiene
// mientras dura para no quitarle ancho de banda a la reproducción.
let sessionActive = false;

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
];

// Recursos estáticos de otros dominios que conviene tener guardados.
const MEDIA_HOSTS = ['media.base44.com', 'static.wixstatic.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

const AUDIO_RE = /\.(mp3|m4a|ogg|oga|wav)(\?.*)?$/i;

// --- Instalación: guarda el app shell para que la app abra sin conexión ---
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(SHELL_ASSETS.map((asset) => cache.add(asset).catch(() => {})));
    })()
  );
});

// --- Activación: borra cachés antiguas y toma el control de las pestañas ---
self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !CACHES.includes(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// --- Mensajes de la app: descarga anticipada de los audios de las sesiones ---
self.addEventListener('message', (e) => {
  const data = e.data || {};
  if (data.type === 'CACHE_AUDIO' && Array.isArray(data.urls)) {
    e.waitUntil(cacheAudios(data.urls));
  }
  if (data.type === 'SESSION_ACTIVE') {
    sessionActive = !!data.active;
  }
});

// Descarga cada audio completo (sin cabecera Range, para poder guardarlo entero)
// y lo deja disponible sin conexión. Los que ya están guardados se omiten.
async function cacheAudios(urls) {
  const cache = await caches.open(AUDIO_CACHE);
  for (const url of urls) {
    // Con una sesión sonando la descarga espera: primero el audio de la sesión.
    while (sessionActive) {
      await new Promise((r) => setTimeout(r, 5000));
    }
    try {
      const cached = await cache.match(url, { ignoreVary: true });
      if (cached) continue;
      const res = await fetch(new Request(url, { mode: 'cors', credentials: 'omit' }));
      if (res.status === 200) await cache.put(url, res);
    } catch (err) {
      // Sin conexión o sin cuota: se reintenta en el próximo acceso a la app.
    }
  }
}

// Sirve un audio guardado, solo sin conexión. Los reproductores piden fragmentos
// (Range), así que cuando hay una copia completa se responde el fragmento pedido.
// En línea NO se reenvía la petición desde aquí: el CDN no acepta el encabezado
// Range en una petición de este tipo y el audio se quedaría sin cargar.
async function serveAudioCached(req) {
  const cache = await caches.open(AUDIO_CACHE);
  const cached = await cache.match(req.url, { ignoreVary: true });
  if (cached) {
    const range = req.headers.get('range');
    if (range && cached.status === 200) return rangedResponse(cached, range);
    return cached;
  }
  // Sin red y sin copia guardada: 503 en lugar de una excepción de la página.
  return new Response(null, { status: 503 });
}

// Recorta la copia guardada al fragmento de bytes que pidió el reproductor.
async function rangedResponse(res, range) {
  const buffer = await res.arrayBuffer();
  const size = buffer.byteLength;
  const match = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const start = match[1] ? parseInt(match[1], 10) : 0;
  const end = match[2] ? parseInt(match[2], 10) : size - 1;

  if (start >= size) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }

  const body = buffer.slice(start, Math.min(end, size - 1) + 1);
  const headers = {
    'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
    'Content-Range': `bytes ${start}-${start + body.byteLength - 1}/${size}`,
    'Content-Length': String(body.byteLength),
    'Accept-Ranges': 'bytes',
    // El reproductor pide el audio con CORS, así que la respuesta recortada
    // necesita conservar el permiso de origen.
    'Access-Control-Allow-Origin': res.headers.get('Access-Control-Allow-Origin') || '*',
  };
  return new Response(body, { status: 206, headers });
}

// Caché primero (para abrir sin conexión) con red de respaldo la primera vez.
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req, { ignoreVary: true });
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch (err) {
    // Sin conexión y sin copia guardada: respuesta vacía, sin excepciones.
    return new Response(null, { status: 503 });
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Audios de las sesiones: disponibles sin conexión.
  if (AUDIO_RE.test(url.pathname)) {
    // En línea el audio va directo del CDN al reproductor: es la ruta fiable
    // (soporta las peticiones por partes que pide el navegador). El service
    // worker solo responde cuando no hay conexión, con la copia guardada.
    if (navigator.onLine) return;
    e.respondWith(serveAudioCached(req));
    return;
  }

  if (url.origin !== self.location.origin) {
    // Imágenes y fuentes: se guardan al primer uso.
    if (MEDIA_HOSTS.includes(url.hostname)) e.respondWith(cacheFirst(req, MEDIA_CACHE));
    return;
  }

  // Llamadas a la API: siempre a la red, nunca se guardan.
  if (url.pathname.startsWith('/api/')) return;

  // Navegación: red primero, con respaldo en el index guardado.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(async () => {
        const shell = await caches.match('/index.html', { ignoreVary: true });
        return shell || new Response('', { status: 503, headers: { 'Content-Type': 'text/html' } });
      })
    );
    return;
  }

  // Assets (JS/CSS): caché primero para que la app abra sin conexión.
  e.respondWith(cacheFirst(req, SHELL_CACHE));
});

// --- Avisos push: los entrega el sistema aunque la app esté cerrada ---
self.addEventListener('push', (e) => {
  let payload = {};
  try {
    payload = e.data ? e.data.json() : {};
  } catch (err) {
    payload = {};
  }

  e.waitUntil(
    self.registration.showNotification(payload.title || 'AutoReiki', {
      body: payload.body || 'Es hora de tu sesión de Reiki.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'autoreiki-recordatorio',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: payload.url || '/' },
    })
  );
});

// Al tocar el aviso se abre (o se trae al frente) la app.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clientsList) {
        if ('focus' in client) {
          await client.focus();
          if ('navigate' in client) await client.navigate(target).catch(() => {});
          return;
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});
