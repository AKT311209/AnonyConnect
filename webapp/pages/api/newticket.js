import { createTicket, checkDuplicateTicketId } from '../../lib/db'
import bcrypt from 'bcrypt'

function generateTicketId () {
  const randomString = () => Math.random().toString(36).substring(2, 5)
  return `${randomString()}-${randomString()}`
}

export default async function handler (req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, message, password } = req.body

      // Reject if message is shorter than 15 characters
      if (message.length < 15) {
        return res.status(400).json({ error: 'Message too short' })
      }

      let ticket_id = generateTicketId()
      const status = 'Pending'
      const response = null

      // Check for duplicate ticket_id
      while (await checkDuplicateTicketId(ticket_id)) {
        ticket_id = generateTicketId()
      }

      // Hash the password before saving
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null

      createTicket(ticket_id, name, email, message, hashedPassword, status, response, (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Failed to create ticket' })
        } else {
          res.status(200).json({ ticket_id })
        }
      })
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
