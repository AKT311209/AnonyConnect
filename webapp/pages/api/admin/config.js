// Next.js API route for reading and writing config.json
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'storage', 'config.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(configPath, 'utf-8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Failed to read config' });
    }
  } else if (req.method === 'POST') {
    try {
      fs.writeFileSync(configPath, JSON.stringify(req.body, null, 4), 'utf-8');
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to write config' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
