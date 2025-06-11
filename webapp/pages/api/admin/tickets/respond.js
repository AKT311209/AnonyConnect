import { respondToTicket } from '../../../../lib/db';
import { withAdminAuth } from '../../../../utils/withAdminAuth';

export default withAdminAuth(async function handler(req, res) {
    if (req.method === 'POST') {
        const { ticketId, response } = req.body;

        try {
            await respondToTicket(ticketId, response);
            res.status(200).json({ message: 'Ticket responded successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update ticket response' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
