import { rejectTicket } from '../../../../lib/db';
import { withAdminAuth } from '../../../../utils/withAdminAuth';

export default withAdminAuth(async function handler(req, res) {
    if (req.method === 'POST') {
        const { ticketId } = req.body;

        try {
            await rejectTicket(ticketId);
            res.status(200).json({ message: 'Ticket rejected successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update ticket status' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
