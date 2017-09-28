const cacheVersion = 'PixelsCampTodoApp';
const appCachedResources = [
    '/',
    '/manifest.json',
    '/android-icon-96x96.png',
    '/android-icon-144x144.png',
    '/android-icon-192x192.png',
    '/static/js/bundle.js',
    '/static/media/heroMoon.bb1442b6.jpg',
    '/static/media/pixelsCamp.9a750d05.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheVersion).then(cache => {
            cache.addAll(appCachedResources);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('push', event => {
    const notification = event.data.json();
    event.waitUntil(
        self.registration.showNotification(notification.title, notification)
    );
});

self.addEventListener('notificationclick', event => {
    const { videoUrl } = event.notification.data;
    switch (event.action) {
        case 'close':
            event.notification.close();
            break;
        case 'open':
        default:
            if (clients.openWindow) {
                clients.openWindow(videoUrl);
            }
            event.notification.close();
    }
});
