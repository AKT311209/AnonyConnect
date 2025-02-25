import { getTicketById } from '../../../lib/db';

export default async function handler(req, res) {
    const { ticket_id } = req.query;

    try {
        const ticket = await getTicketById(ticket_id);
        if (ticket) {
            const { password, ...ticketData } = ticket; // Exclude password from response
            res.status(200).json(ticketData);
        } else {
            res.status(404).json({ error: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
