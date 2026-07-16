const CACHE_NAME = 'water-meter-v2'; // ປ່ຽນເວີຊັ່ນເປັນ v2 ເພື່ອລຶບຂອງເກົ່າຖິ້ມ
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './record.html',
  './summary.html',
  './manage-items.html',
  './receive-items.html',
  './firebase-config.js',
  './items-data.js',
  './sidebar.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
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
