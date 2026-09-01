const CACHE_NAME = 'water-meter-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './404.html',
  './manifest.json',
  './firebase-config.js',
  './js/components/sidebar.js',
  './js/components/auth-guard.js',
  './js/components/notifications.js',
  './js/data/stock-audit.js',
  './js/data/materials.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(async (cache) => {
    await Promise.all(ASSETS_TO_CACHE.map(async (asset) => {
      try {
        await cache.add(asset);
      } catch (error) {
        console.warn(`Unable to cache ${asset}`, error);
      }
    }));
  }));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const isSameOrigin = request.url.startsWith(self.location.origin);
  const isHtmlRequest = request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');

  if (!isSameOrigin && !isHtmlRequest) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
  );
});
