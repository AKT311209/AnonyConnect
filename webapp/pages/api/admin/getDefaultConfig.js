// Next.js API route to serve the default config from components/defaultConfig.json
import fs from 'fs';
import path from 'path';
import { withAdminAuth } from '../../../utils/withAdminAuth';

const defaultConfigPath = path.join(process.cwd(), 'components', 'defaultConfig.json');

export default withAdminAuth(function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(defaultConfigPath, 'utf-8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Failed to read default config' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
});
