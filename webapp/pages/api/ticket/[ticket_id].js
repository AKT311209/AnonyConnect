import { getTicketById } from '../../../lib/db';

export default async function handler(req, res) {
  const { ticket_id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const ticket = await getTicketById(ticket_id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
