import { undoTicketAction } from '../../../../lib/db';
import { withAdminAuth } from '../../../../utils/withAdminAuth';

export default withAdminAuth(async function handler(req, res) {
    if (req.method === 'POST') {
        const { ticketId } = req.body;
        try {
            await undoTicketAction(ticketId);
            res.status(200).json({ message: 'Ticket status reverted to Pending' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to undo ticket action' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});
