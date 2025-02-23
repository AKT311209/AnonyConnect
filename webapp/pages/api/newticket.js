import { v4 as uuidv4 } from 'uuid';
import { createTicket } from '../../lib/db';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message, password } = req.body;
    const ticket_id = uuidv4();
    const status = 'Pending';

    createTicket(ticket_id, name, email, message, password, status, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Failed to create ticket' });
      } else {
        res.status(200).json({ ticket_id });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
