import { removePushSubscriptionByEndpoint } from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { endpoint } = req.body;
        if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

        await removePushSubscriptionByEndpoint(endpoint);
        return res.status(200).json({ message: 'Unsubscribed' });
    } catch (err) {
        console.error('unsubscribe error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
