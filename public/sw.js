const CACHE_NAME = 'rulers-pwa-v1';
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'pwa-setup.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./');
        }
        return Promise.reject('Not found');
      })
  );
});
