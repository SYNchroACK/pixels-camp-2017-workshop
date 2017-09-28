// In production, we register a service worker to serve assets from local cache and to subscribe to push notifications.

export default function register() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }
}