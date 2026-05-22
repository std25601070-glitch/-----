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

// الاستماع لحدث وصول الإشعار من السيرفر (نسخة آمنة ومحدثة)
self.addEventListener('push', (event) => {
  let title = 'تنبيه طبي عاجل';
  let body = 'تم تحديث بياناتك الطبية بنجاح.';

  // حماية: التحقق من أن السيرفر أرسل بيانات بالفعل
  if (event.data) {
    try {
      // محاولة قراءة البيانات كـ JSON
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
    } catch (e) {
      // إذا فشل وقرأها كنص عادي (Plain Text)
      body = event.data.text();
    }
  }

  const options = {
    body: body,
    icon: '/icon-light-32x32.png', // تم تعديل المسار ليتطابق مع الـ Cache بالاعلى
    badge: '/icon-light-32x32.png', 
    vibrate: [200, 100, 200],
    data: {
      url: '/' 
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// فتح الموقع عند الضغط على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
