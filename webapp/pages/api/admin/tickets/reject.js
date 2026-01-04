import { rejectTicket, getSubscriptionsByTicketId, removePushSubscriptionByEndpoint, getTicketById } from '../../../../lib/db';
import webpush from 'web-push';
import fs from 'fs';
import path from 'path';
import { withAdminAuth } from '../../../../utils/withAdminAuth';

export default withAdminAuth(async function handler(req, res) {
    if (req.method === 'POST') {
        const { ticketId } = req.body;

        try {
            await rejectTicket(ticketId);

            // schedule push notification similar to respond flow
            try {
                const configPath = path.join(process.cwd(), 'storage', 'config.json');
                let enabled = true;
                let timeoutSec = 1800;
                try {
                    const raw = fs.readFileSync(configPath, 'utf-8');
                    const cfg = JSON.parse(raw);
                    enabled = Boolean(cfg.browserPush?.enabled);
                    if (typeof cfg.browserPush?.timeout === 'number') timeoutSec = cfg.browserPush.timeout;
                } catch (e) {
                    enabled = true;
                    timeoutSec = 1800;
                }

                const sendPushNow = async () => {
                    try {
                        // Re-check ticket is still Rejected
                        const t = await getTicketById(ticketId);
                        if (!t || t.status !== 'Rejected') return;

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
                                    const payload = JSON.stringify({ ticket_id: ticketId, body: `Your ticket ${ticketId} is updated - click to view` });
                                    await webpush.sendNotification(subscription, payload);
                                } catch (err) {
                                    if (err && err.statusCode && (err.statusCode === 404 || err.statusCode === 410)) {
                                        try { await removePushSubscriptionByEndpoint(row.endpoint); } catch (e) { }
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.error('delayed push send error (reject)', err);
                    }
                };

                if (enabled) {
                    if (!timeoutSec || timeoutSec <= 0) {
                        await sendPushNow();
                    } else {
                        setTimeout(sendPushNow, timeoutSec * 1000);
                    }
                }
            } catch (err) {
                console.error('push send scheduling error (reject)', err);
            }

            res.status(200).json({ message: 'Ticket rejected successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update ticket status' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
