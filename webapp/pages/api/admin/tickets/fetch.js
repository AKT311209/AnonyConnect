import { fetchTicketDetails } from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { ticketId } = req.query;

        try {
            const ticket = await fetchTicketDetails(ticketId);
            res.status(200).json(ticket);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch ticket details' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
