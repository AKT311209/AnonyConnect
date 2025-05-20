import { checkDuplicateTicketId } from '../../lib/db';

export default async function handler(req, res) {
    const { ticket_id } = req.query;

    try {
        const exists = await checkDuplicateTicketId(ticket_id);
        res.status(200).json({ exists });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
