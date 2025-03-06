import { getAllTickets } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const tickets = await getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}
