import { respondToTicket, getSubscriptionsByTicketId, removePushSubscriptionByEndpoint } from '../../../../lib/db';
import webpush from 'web-push';
import fs from 'fs';
import path from 'path';
import { withAdminAuth } from '../../../../utils/withAdminAuth';

export default withAdminAuth(async function handler(req, res) {
    if (req.method === 'POST') {
        const { ticketId, response } = req.body;

        try {
            await respondToTicket(ticketId, response);
            // Send web-push notifications to subscribers for this ticket if enabled in config
            try {
                const configPath = path.join(process.cwd(), 'storage', 'config.json');
                let enabled = true;
                try {
                    const raw = fs.readFileSync(configPath, 'utf-8');
                    const cfg = JSON.parse(raw);
                    enabled = Boolean(cfg.browserPush?.enabled);
                } catch (e) {
                    // default to enabled
                    enabled = true;
                }

                if (enabled) {
                    const vapidPublic = process.env.VAPID_PUBLIC;
                    const vapidPrivate = process.env.VAPID_PRIVATE;
                    if (vapidPublic && vapidPrivate) {
                        webpush.setVapidDetails(
                            `mailto:${process.env.ADMIN_EMAIL || 'admin@example.com'}`,
                            vapidPublic,
                            vapidPrivate
                        );
                        const subs = await getSubscriptionsByTicketId(ticketId);
                        for (const row of subs) {
                            try {
                                const subscription = JSON.parse(row.subscription_json);
                                const payload = JSON.stringify({ ticket_id: ticketId, body: 'Your ticket was answered — tap to view.' });
                                await webpush.sendNotification(subscription, payload);
                            } catch (err) {
                                // remove invalid subscriptions
                                if (err && err.statusCode && (err.statusCode === 404 || err.statusCode === 410)) {
                                    try { await removePushSubscriptionByEndpoint(row.endpoint); } catch (e) { }
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('push send error', err);
            }
            res.status(200).json({ message: 'Ticket responded successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update ticket response' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
