// In production, we register a service worker to serve assets from local cache and to subscribe to push notifications.

export default function register() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');

        navigator.serviceWorker.ready
            .then(serviceWorkerRegistration => {
                console.log('Service Worker is ready and I have a registration object');
                // userVisibleOnly: A boolean indicating that the returned push subscription
                // will only be used for messages whose effect is made visible to the user.
                return serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true });
            })
            .then(pushSubscription => {
                const subscription = pushSubscription.toJSON();
                console.log('I have a subscription', subscription);
                fetch('/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subscription)
                }).catch(error => console.error('Subscribing to notifications failure', error));
            }, error => console.log('User rejected notifications permission or there is a problem with secure origins: ' + error))
            .catch(error => console.log('Error: ', error));
    }
}