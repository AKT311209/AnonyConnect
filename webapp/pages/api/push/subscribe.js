import { getTicketById, addPushSubscription } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { subscription, ticket_id } = req.body;
        if (!subscription || !ticket_id) return res.status(400).json({ error: 'Missing subscription or ticket_id' });

        const ticket = await getTicketById(ticket_id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Store subscription JSON (stringified) and endpoint; do not store any PII.
        const endpoint = subscription.endpoint || (subscription?.keys && subscription.endpoint) || '';
        await addPushSubscription(ticket_id, endpoint, JSON.stringify(subscription));
        return res.status(200).json({ message: 'Subscribed' });
    } catch (err) {
        console.error('subscribe error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
