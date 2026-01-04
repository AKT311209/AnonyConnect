import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    try {
        const configPath = path.join(process.cwd(), 'storage', 'config.json');
        const raw = fs.readFileSync(configPath, 'utf-8');
        const cfg = JSON.parse(raw);
        const enabled = Boolean(cfg.browserPush?.enabled);
        res.status(200).json({ enabled });
    } catch (err) {
        console.error('Failed to read config for browser push enabled:', err);
        res.status(200).json({ enabled: true });
    }
}
