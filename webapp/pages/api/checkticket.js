import { checkDuplicateTicketId } from '../../lib/db';

export default async function handler(req, res) {
    const { ticket_id, turnstile_response } = req.query;

    // Verify Turnstile before proceeding
    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/verify-turnstile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnstileResponse: turnstile_response })
    });
    const verifyData = await verifyRes.json();
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
