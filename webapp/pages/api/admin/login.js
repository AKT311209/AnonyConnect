import jwt from 'jsonwebtoken';
import { db } from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';


const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
    const sessionId = uuidv4();

    db.run('INSERT INTO sessions (session_id, username, token) VALUES (?, ?, ?)', [sessionId, username, token], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      return res.status(200).json({ token, sessionId });
    });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
