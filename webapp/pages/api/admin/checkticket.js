import { checkDuplicateTicketId } from '../../../lib/db';
import { withAdminAuth } from '../../../utils/withAdminAuth';

export default withAdminAuth(async function handler(req, res) {
    const { ticket_id } = req.query;
    try {
        const exists = await checkDuplicateTicketId(ticket_id);
        if (exists) {
            res.status(200).json({ exists: true });
        } else {
            res.status(404).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
