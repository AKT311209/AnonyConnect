import { getTicketById, getValidToken, markTokenUsed } from '../../../lib/db';


export default async function handler(req, res) {
    const { ticket_id } = req.query;

    try {
        const ticket = await getTicketById(ticket_id);
        if (ticket) {
            const { password, ...ticketData } = ticket; // Exclude password from response
            if (ticket.password) {
                const { token: providedToken } = req.body;
                if (!providedToken) {
                    return res.status(401).json({ error: 'Token required' });
                }
                const validToken = await getValidToken(providedToken, ticket_id);
                if (!validToken) {
                    return res.status(401).json({ error: 'Invalid or expired token' });
                }
                await markTokenUsed(providedToken);
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
