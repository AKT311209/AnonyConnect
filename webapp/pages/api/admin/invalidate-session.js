import { deleteSessionById } from '../../../lib/db';
import { withAdminAuth } from '../../../utils/withAdminAuth';
import jwt from 'jsonwebtoken';

export default withAdminAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Get token from cookie header
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  let sessionId;
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const decoded = jwt.verify(token, secret);
    sessionId = decoded.sessionId;
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    await deleteSessionById(sessionId);
    // Clear the cookie
    res.setHeader('Set-Cookie', 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly;');
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
