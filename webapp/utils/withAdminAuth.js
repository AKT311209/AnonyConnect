import { validateToken } from '../lib/auth';

export function withAdminAuth(handler) {
  return async (req, res) => {
    const token = req.cookies.token;
    const session = await validateToken(token);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.session = session;
    return handler(req, res);
  };
}
