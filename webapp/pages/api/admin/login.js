import jwt from 'jsonwebtoken';
import { db, getAdminSetting, createAdminLoginToken } from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import verifyCloudflare from '../../../lib/verify-cloudflare';
import { getNotificationSettings, sendCustomTelegramNotification } from '../../../scripts/sendTelegramNotification';
import fs from 'fs';
import path from 'path';

const secret = process.env.NEXTAUTH_SECRET;
const configPath = path.resolve(process.cwd(), 'storage', 'config.json');

function get2FAConfig() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return config.security?.admin?.['2fa']?.enabled;
}

async function is2FASetUp() {
  return !!(await getAdminSetting('2fa_secret'));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password, rememberMe, turnstileToken } = req.body;

  // Verify Turnstile before proceeding
  const verifyData = await verifyCloudflare(turnstileToken);
  if (!verifyData.success) {
    return res.status(403).json({ error: 'Cloudflare Turnstile verification failed' });
  }

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 60 * 60;
    const sessionId = uuidv4();
    const token = jwt.sign({ username, sessionId }, secret, { expiresIn: maxAge });
    // Create a one-time login token in DB, do not insert session or set cookie here
    const expires_at = Math.floor(Date.now() / 1000) + maxAge;
    await createAdminLoginToken(token, username, expires_at);
    // 2FA logic
    const twoFAEnabled = get2FAConfig();
    const twoFASetUp = twoFAEnabled ? await is2FASetUp() : false;
    if (twoFAEnabled && twoFASetUp) {
      // Return one-time token, do not set cookie
      return res.status(200).json({ sessionId, token, require2FA: true });
    }
    // If 2FA not enabled or not set up, allow login as before
    return res.status(200).json({ sessionId, token, require2FA: false });
  } else {
    // Notify on failed admin login attempt if enabled
    const notificationSettings = getNotificationSettings();
    if (notificationSettings.onAdminLoginAttempt) {
      await sendCustomTelegramNotification('AnonyConnect: Failed admin login attempt detected.');
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
