import { getTicketById } from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    const { ticket_id } = req.query;

    try {
        const ticket = await getTicketById(ticket_id);
        if (ticket) {
            const { password, ...ticketData } = ticket; // Exclude password from response
            if (ticket.password) {
                const { password: providedPassword, 'cf-turnstile-response': turnstileResponse } = req.body;
                if (!providedPassword) {
                    return res.status(401).json({ error: 'Password required' });
                }
                // Verify Turnstile before proceeding
                const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/verify-turnstile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ turnstileResponse })
                });
                const verifyData = await verifyRes.json();
                if (!verifyData.success) {
                    return res.status(403).json({ error: 'Turnstile verification failed' });
                }
                const isValid = await bcrypt.compare(providedPassword, ticket.password);
                if (!isValid) {
                    return res.status(401).json({ error: 'Invalid password' });
                }
            }
            return res.status(200).json({
                ...ticketData,
                password: password ? 'Yes' : 'No'
              });
        } else {
            return res.status(404).json({ error: 'Ticket not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
