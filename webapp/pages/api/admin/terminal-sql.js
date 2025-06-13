import { join } from 'path';
import { promises as fs } from 'fs';
import { runArbitrarySql } from '../../../lib/db';
import { withAdminAuth } from '../../../utils/withAdminAuth';

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

const dbPath = join(process.cwd(), 'storage', 'database.sqlite');

export default withAdminAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { sql } = req.body;
  if (!sql || typeof sql !== 'string') return res.status(400).json({ error: 'Missing SQL' });
  try {
    const output = await runArbitrarySql(sql);
    res.status(200).json({ output });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});
