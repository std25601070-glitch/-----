const CACHE_NAME = 'nurai-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-light-32x32.png',
  '/apple-icon.png',
]

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      return fetch(event.request).catch(() => {
        return caches.match('/')
      })
    })
  )
})
// الاستماع لحدث وصول الإشعار من السيرفر
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png', // غيره لمسار لوجو مشروعك
    badge: '/icons/badge.png',        // أيقونة صغيرة تظهر في شريط التنبيهات علوياً
    vibrate: [200, 100, 200],          // نمط الاهتزاز في الهواتف
    data: {
      url: '/' // الصفحة التي سيفتحها المستخدم عند الضغط على الإشعار
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// فتح الموقع عند الضغط على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
