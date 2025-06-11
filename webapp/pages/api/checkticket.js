import { checkDuplicateTicketId } from '../../lib/db';
import verifyCloudflare from '../../lib/verify-cloudflare';

export default async function handler(req, res) {
    const { ticket_id, turnstile_response } = req.query;

    // Verify Turnstile before proceeding
    const verifyData = await verifyCloudflare(turnstile_response);
    if (!verifyData.success) {
        return res.status(403).json({ error: 'Turnstile verification failed' });
    }

    try {
        const exists = await checkDuplicateTicketId(ticket_id);
        res.status(200).json({ exists });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
