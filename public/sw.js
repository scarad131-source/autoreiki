// Service worker para modo offline (modo avión).
// Guarda tres cosas para que la meditación no se interrumpa sin conexión:
//   1) el app shell (HTML/JS/CSS)                         -> SHELL_CACHE
//   2) imágenes y fuentes que usa la interfaz             -> MEDIA_CACHE
//   3) los audios de las sesiones (ambiente y voz guiada) -> AUDIO_CACHE

const SHELL_CACHE = 'autoreiki-shell-v2';
const MEDIA_CACHE = 'autoreiki-media-v2';
const AUDIO_CACHE = 'autoreiki-audio-v2';
const CACHES = [SHELL_CACHE, MEDIA_CACHE, AUDIO_CACHE];

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
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
});

// Descarga cada audio completo (sin cabecera Range, para poder guardarlo entero)
// y lo deja disponible sin conexión. Los que ya están guardados se omiten.
async function cacheAudios(urls) {
  const cache = await caches.open(AUDIO_CACHE);
  for (const url of urls) {
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

// Sirve un audio desde la caché. Los reproductores piden fragmentos (Range), así
// que cuando hay una copia completa guardada se responde el fragmento solicitado.
async function serveAudio(req) {
  const cache = await caches.open(AUDIO_CACHE);
  const cached = await cache.match(req.url, { ignoreVary: true });
  if (cached) {
    const range = req.headers.get('range');
    if (range && cached.status === 200) return rangedResponse(cached, range);
    return cached;
  }

  const res = await fetch(req);
  // Solo se guardan respuestas completas (las parciales no se pueden almacenar).
  if (res.status === 200) cache.put(req.url, res.clone()).catch(() => {});
  return res;
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

  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone()).catch(() => {});
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Audios de las sesiones: disponibles sin conexión.
  if (AUDIO_RE.test(url.pathname)) {
    e.respondWith(serveAudio(req));
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
    e.respondWith(fetch(req).catch(() => caches.match('/index.html', { ignoreVary: true })));
    return;
  }

  // Assets (JS/CSS): caché primero para que la app abra sin conexión.
  e.respondWith(cacheFirst(req, SHELL_CACHE));
});
