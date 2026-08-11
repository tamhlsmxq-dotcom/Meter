const CACHE_NAME = 'water-meter-v3';
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
  self.skipWaiting(); // ບັງຄັບໃຫ້ອັບເດດທັນທີ
});

self.addEventListener('activate', (event) => {
  // ລຶບຄວາມຈຳເກົ່າ (v1) ຖິ້ມທັງໝົດ
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

// ສຳຄັນ: ໃຫ້ດຶງຂໍ້ມູນຈາກເນັດກ່ອນສະເໝີ (Network-First) ຖ້າບໍ່ມີເນັດຈຶ່ງໃຊ້ Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
