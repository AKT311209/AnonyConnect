import { getTicketById, createOneTimeToken } from '../../../lib/db';
import bcrypt from 'bcrypt';
import verifyCloudflare from '../../../lib/verify-cloudflare';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const { ticket_id } = req.query;

    try {
        const ticket = await getTicketById(ticket_id);
        if (ticket) {
            if (req.method === 'GET') {
                res.status(200).json({ passwordExists: Boolean(ticket.password) });
            } else if (req.method === 'POST') {
                // Verify Turnstile before proceeding
                const { password, turnstileResponse } = req.body;
                
                const verifyData = await verifyCloudflare(turnstileResponse);
                if (!verifyData.success) {
                    return res.status(403).json({ error: 'Turnstile verification failed' });
                }
                const isValid = await bcrypt.compare(password, ticket.password);
                if (isValid) {
                    // Generate one-time token, valid for 5 minutes
                    const token = uuidv4();
                    const expires_at = Math.floor(Date.now() / 1000) + 5 * 60;
                    await createOneTimeToken(ticket_id, token, expires_at);
                    res.status(200).json({ isValid: true, token });
                } else {
                    res.status(401).json({ isValid: false });
                }
            } else {
                res.status(405).json({ error: 'Method not allowed' });
            }
        } else {
            res.status(404).json({ error: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
