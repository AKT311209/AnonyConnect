import { deleteSessionById } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { sessionId } = req.body;

  try {
    await deleteSessionById(sessionId);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
