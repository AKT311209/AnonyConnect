import jwt from 'jsonwebtoken';
import { db } from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';

const secret = process.env.NEXTAUTH_SECRET;

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password, rememberMe } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 60 * 60;
    const token = jwt.sign({ username }, secret, { expiresIn: maxAge });
    const sessionId = uuidv4();

    db.run('INSERT INTO sessions (session_id, username, token, max_age) VALUES (?, ?, ?, ?)', [sessionId, username, token, maxAge], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge,
        path: '/',
      }));

      return res.status(200).json({ sessionId });
    });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
