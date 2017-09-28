const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const webpush       = require('web-push');
const logger        = require('morgan');
const when          = require('when');
const debug         = require('debug')('pixels-camp-2017-workshop:server');

const app           = express();

webpush.setGCMAPIKey('AAAADcMS4MU:APA91bFL4gKoIbMpTDAUzb6yXK1YdpdZqbTtHaxrw8bUnPXnxHQWiWivH0SVmR7C-X_OyuCCykWfOBpSBb_zj2hrAOi_ofZP_7l5de2OsfoYtNEtWcfcNeEnyEspxSYoBrjxMHg1ektx');

const subscriptions = {};

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/subscribe', function (request, response) {
    const userToken = request.body.endpoint.split('/').pop();
    subscriptions[userToken] = request.body;
    response.send("User subscribed - token: " + userToken);
    debug('Subscriptions: ' + JSON.stringify(subscriptions));
});

app.get('/send-notification', (request, response) => {
    if (Object.keys(subscriptions).length) {
        const sentNotifications = [];

        Object.keys(subscriptions).forEach(pushSubscriptionKey => {
            const pushSubscription = subscriptions[pushSubscriptionKey];
            const payload = JSON.stringify({
                title: 'Hello Pixels Camp',
                body: 'Check out this new teaser released today!',
                icon: 'android-icon-192x192.png',
                badge: 'android-icon-96x96.png',
                requireInteraction: true,
                dir: 'ltr',
                tag: Date.now(),
                data: {
                    videoUrl: 'https://youtu.be/rhLNv9_HtIM',
                },
                actions: [
                    {
                        action: 'open',
                        title: 'Open Video'
                    },
                    {
                        action: 'close',
                        title: 'Close'
                    }
                ]
            });

            sentNotifications.push(webpush.sendNotification(pushSubscription, payload));

        });

        when.settle(sentNotifications).then(settledNotifications => {
            let anyRejected = settledNotifications.some(notification => notification.state === 'rejected');
            if (anyRejected) {
                response.send('Some notifications were not delivered');
                debug('Some notifications were not delivered');
            } else {
                response.send('All users were notified');
                debug('All users were notified');
            }
        });
    } else {
        response.send('No users to notify');
        debug('No users to notify');
    }
});

/**
 *
 * catch 404 and forward to error handler
 *
 * */
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 *
 * development error handler - will print stacktrace
 *
 * */
if (app.get('env') === 'development') {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
