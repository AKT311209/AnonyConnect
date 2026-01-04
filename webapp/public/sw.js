self.addEventListener('push', function (event) {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        data = { body: event.data ? event.data.text() : 'Your ticket was updated.' };
    }

    const title = 'AnonyConnect';
    const body = data.body || 'Your ticket was responded.';
    const options = {
        body,
        tag: data.tag || 'ticket-update',
        data: { ticket_id: data.ticket_id }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const ticketId = event.notification.data?.ticket_id;
    const url = ticketId ? `/ticket/${ticketId}` : '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === url && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});
