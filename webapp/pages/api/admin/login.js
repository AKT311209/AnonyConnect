import jwt from 'jsonwebtoken';
import { db } from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { serialize } from 'cookie';
import verifyCloudflare from '../../../lib/verify-cloudflare';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password, rememberMe, turnstileToken } = req.body;

  // Verify Turnstile before proceeding
  const verifyData = await verifyCloudflare(turnstileToken);
  if (!verifyData.success) {
    return res.status(403).json({ error: 'Cloudflare Turnstile verification failed' });
  }

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 60 * 60;
    const sessionId = uuidv4();
    const token = jwt.sign({ username, sessionId }, secret, { expiresIn: maxAge });

    db.run('INSERT INTO sessions (session_id, username, max_age) VALUES (?, ?, ?)', [sessionId, username, maxAge], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const cookie = serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge,
        path: '/',
      });

      res.setHeader('Set-Cookie', cookie);

      return res.status(200).json({ sessionId });
    });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
