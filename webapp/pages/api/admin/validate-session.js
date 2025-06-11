import { validateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  const token = req.cookies.token;

  const session = await validateToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({ valid: true });
}
