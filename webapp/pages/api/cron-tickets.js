// API route to trigger auto-reject and auto-cleanup based on config.json
import path from 'path';
import fs from 'fs';
import { autoRejectAndCleanup } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const configPath = path.resolve(process.cwd(), 'storage', 'config.json');
  let config;
  try {
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configRaw);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to read config file' });
  }

  autoRejectAndCleanup(config, (err, result) => {
    if (err) return res.status(500).json({ error: err.message || 'DB error' });
    return res.status(200).json(result);
  });
}
