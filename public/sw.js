const CACHE_NAME = 'rulers-pwa-v6';
const PRECACHE_URLS = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.webp',
  'icon-512.webp'
];

// Pre-cache static assets on install
self.addEventListener('install', (event) => {
  console.log('SW: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Clean up old caches on activate
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

// Offline & Stale-While-Revalidate Fetch Handler
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Handle SPA navigation routing gracefully when offline
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

  // Stale-While-Revalidate for all assets
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately for speed and offline availability
          // Attempt background revalidation ONLY if network is likely available
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const url = new URL(event.request.url);
              if (url.protocol.startsWith('http')) {
                cache.put(event.request, networkResponse.clone()).catch(() => {});
              }
            }
          }).catch(() => {
            // Silently swallow fetch errors when offline
          });
          return cachedResponse;
        }

        // Cache miss: fetch from network and store in cache
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const url = new URL(event.request.url);
            if (url.protocol.startsWith('http')) {
              cache.put(event.request, networkResponse.clone()).catch(() => {});
            }
          }
          return networkResponse;
        }).catch(() => {
          // If fetch fails and nothing in cache for this sub-resource, fallback gracefully
          return new Response('Offline content not cached', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      });
    })
  );
});

// Handle SKIP_WAITING message from UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
