import { getTicketById } from '../../../lib/db'
import bcrypt from 'bcrypt'

export default async function handler (req, res) {
  const { ticket_id } = req.query

  try {
    const ticket = await getTicketById(ticket_id)
    if (ticket) {
      const { password, ...ticketData } = ticket // Exclude password from response
      if (ticket.password) {
        const { password: providedPassword } = req.body
        if (!providedPassword) {
          return res.status(401).json({ error: 'Password required' })
        }
        const isValid = await bcrypt.compare(providedPassword, ticket.password)
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid password' })
        }
      }
      res.status(200).json({
        ...ticketData,
        password: password ? 'Yes' : 'No'
      })
    } else {
      res.status(404).json({ error: 'Ticket not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
