import jwt from 'jsonwebtoken';
import { getSessionById } from '../../../lib/db';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { sessionId } = jwt.verify(token, secret);
    const session = await getSessionById(sessionId);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ valid: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
