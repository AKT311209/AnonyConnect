import jwt from 'jsonwebtoken';
import { getSessionById } from './db';

const secret = process.env.NEXTAUTH_SECRET;

export async function validateToken(token) {
  if (!token) return null;
  try {
    const { sessionId } = jwt.verify(token, secret);
    const session = await getSessionById(sessionId);
    if (!session) return null;
    return session;
  } catch {
    return null;
  }
}
