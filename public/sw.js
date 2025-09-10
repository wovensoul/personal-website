// Service Worker for caching strategies
const CACHE_NAME = 'portfolio-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/robots.txt', '/sitemap.xml']

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache
        return cachedResponse
      }

      // Network request with caching
      return fetch(request)
        .then((networkResponse) => {
          // Don't cache non-successful responses
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse
          }

          // Clone the response for caching
          const responseClone = networkResponse.clone()

          // Determine cache strategy based on request type
          const cacheName = isStaticAsset(request.url) ? STATIC_CACHE : DYNAMIC_CACHE

          caches.open(cacheName).then((cache) => {
            cache.put(request, responseClone)
          })

          return networkResponse
        })
        .catch(() => {
          // Offline fallback
          if (request.destination === 'document') {
            return caches.match('/index.html')
          }

          // Return a fallback response for other requests
          return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable',
          })
        })
    }),
  )
})

// Helper function to determine if asset should be statically cached
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf', '.eot']
  const staticPaths = ['/assets/', '/fonts/']

  return (
    staticExtensions.some((ext) => url.includes(ext)) ||
    staticPaths.some((path) => url.includes(path))
  )
}

// Background sync for offline actions (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered')
    // Handle background sync tasks
  }
})

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    console.log('Push notification received:', data)

    // Show notification
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
      }),
    )
  }
})
