const CACHE_NAME = 'rulers-pwa-v5';
const PRECACHE_URLS = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.webp',
  'icon-512.webp'
];

// Pre-cache static assets
self.addEventListener('install', (event) => {
  console.log('SW: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate Strategy for offline work
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Handle SPA navigation routing gracefully in offline mode
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('./').then((response) => {
          return response || caches.match('index.html');
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-While-Revalidate: serve from cache but update in background if online
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const url = new URL(event.request.url);
              if (url.protocol.startsWith('http')) {
                cache.put(event.request, networkResponse.clone()).catch(() => {});
              }
            }
          }).catch(() => {
            // Silently swallow errors (e.g., when offline)
          });
          return cachedResponse;
        }

        // Cache miss: must fetch from network and cache
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const url = new URL(event.request.url);
            if (url.protocol.startsWith('http')) {
              cache.put(event.request, networkResponse.clone()).catch(() => {});
            }
          }
          return networkResponse;
        });
      });
    })
  );
});

// Handle SKIP_WAITING from UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
