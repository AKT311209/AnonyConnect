import { getTicketById } from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    const { ticket_id } = req.query;

    try {
        const ticket = await getTicketById(ticket_id);
        if (ticket) {
            if (req.method === 'GET') {
                res.status(200).json({ passwordExists: Boolean(ticket.password) });
            } else if (req.method === 'POST') {
                const { password } = req.body;
                const isValid = await bcrypt.compare(password, ticket.password);
                if (isValid) {
                    res.status(200).json({ isValid: true });
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
