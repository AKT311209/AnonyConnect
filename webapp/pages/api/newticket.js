import { createTicket, checkDuplicateTicketId } from '../../lib/db';
import bcrypt from 'bcrypt';
import sendTelegramNotification from '../../scripts/sendTelegramNotification';
import verifyCloudflare from '../../lib/verify-cloudflare';

function generateTicketId() {
  const randomString = () => Math.random().toString(36).substring(2, 5);
  return `${randomString()}-${randomString()}`;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, message, password, 'cf-turnstile-response': turnstileResponse } = req.body;

      // Verify Turnstile before proceeding
      const verifyData = await verifyCloudflare(turnstileResponse);
      if (!verifyData.success) {
        return res.status(403).json({ error: 'Turnstile verification failed' });
      }

      // Reject if message is shorter than 15 characters
      if (message.length < 15) {
        return res.status(400).json({ error: 'Message too short' });
      }

      // Reject if name or email is too long
      if ((name && name.length > 25) || (email && email.length > 25)) {
        return res.status(413).json({ error: 'Name or email too long' });
      }

      let ticket_id = generateTicketId();
      const status = 'Pending';
      const response = null;

      // Check for duplicate ticket_id
      while (await checkDuplicateTicketId(ticket_id)) {
        ticket_id = generateTicketId();
      }

      // Hash the password before saving
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      try {
        await createTicket({
          ticket_id,
          sender_name: name,
          sender_email: email,
          message,
          password: hashedPassword,
          status,
          response
        });
        // Notify via Telegram directly from server
        await sendTelegramNotification(ticket_id, name, email, message);
        res.status(200).json({ ticket_id });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
