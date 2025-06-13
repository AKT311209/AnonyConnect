import speakeasy from 'speakeasy';
import { clear2FASettings, getAdminSetting, setAdminSetting, getValidAdminLoginToken, markAdminLoginTokenUsed, db } from '../../../lib/db';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import fs from 'fs';
import path from 'path';
import { send } from 'process';

const secret = process.env.NEXTAUTH_SECRET;
const configPath = path.resolve(process.cwd(), 'storage', 'config.json');

function get2FAConfig() {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config.security?.admin?.['2fa']?.enabled;
}

async function getAdmin2FASecret() {
    return await getAdminSetting('2fa_secret');
}


async function is2FASetUp() {
    const secret = await getAdmin2FASecret();
    return !!secret;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { token, code, setup, rememberMe } = req.body;
        // Always validate the token using DB one-time token
        const loginToken = await getValidAdminLoginToken(token);
        if (!loginToken) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        // Mark token as used
        await markAdminLoginTokenUsed(token);
        const username = loginToken.username;
        const sessionId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sessionId;
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 60 * 60;
        const twoFAEnabled = get2FAConfig();
        if (!twoFAEnabled) {
            // 2FA not enabled, remove all 2FA configs
            await clear2FASettings();
            // Grant session immediately
            db.run('INSERT INTO sessions (session_id, username, max_age) VALUES (?, ?, ?)', [sessionId, username, maxAge], async (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                const newToken = jwt.sign({ username, sessionId }, secret, { expiresIn: maxAge });
                const cookie = serialize('token', newToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge,
                    path: '/',
                });
                res.setHeader('Set-Cookie', cookie);
                // Notify on admin login if enabled
                const { getNotificationSettings, sendCustomTelegramNotification } = await import('../../../scripts/sendTelegramNotification.js');
                const notificationSettings = getNotificationSettings();
                if (notificationSettings.onAdminLogin) {
                    await sendCustomTelegramNotification('AnonyConnect: Someone has just logged to admin account');
                }
                return res.status(200).json({ success: true });
            });
            return;
        }
        if (setup) {
            // Setup 2FA is now handled in /api/admin/2fa-setup
            return res.status(405).json({ error: 'Use /api/admin/2fa-setup for setup' });
        }
        // Normal 2FA verification
        const adminSecret = await getAdmin2FASecret();
        if (!adminSecret) {
            // Not set up, allow login
            db.run('INSERT INTO sessions (session_id, username, max_age) VALUES (?, ?, ?)', [sessionId, username, maxAge], async (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                const newToken = jwt.sign({ username, sessionId }, secret, { expiresIn: maxAge });
                const cookie = serialize('token', newToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    maxAge,
                    path: '/',
                });
                res.setHeader('Set-Cookie', cookie);
                // Notify on admin login if enabled
                const { getNotificationSettings, sendCustomTelegramNotification } = await import('../../../scripts/sendTelegramNotification.js');
                const notificationSettings = getNotificationSettings();
                if (notificationSettings.onAdminLogin) {
                    await sendCustomTelegramNotification('AnonyConnect: Someone has just logged to admin account');
                }
                return res.status(200).json({ success: true });
            });
            return;
        }
        // Validate code
        const verified = speakeasy.totp.verify({
            secret: adminSecret,
            encoding: 'base32',
            token: code,
            window: 1,
        });
        if (!verified) {
            const { getNotificationSettings, sendCustomTelegramNotification } = await import('../../../scripts/sendTelegramNotification.js');
            const notificationSettings = getNotificationSettings();
            if (notificationSettings.onAdminLoginAttempt) {
                await sendCustomTelegramNotification('AnonyConnect: Failed admin 2FA verification attempt detected.');
            }
            return res.status(401).json({ error: 'Invalid 2FA code' });
        }
        // Grant session after 2FA
        db.run('INSERT INTO sessions (session_id, username, max_age) VALUES (?, ?, ?)', [sessionId, username, maxAge], async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            const newToken = jwt.sign({ username, sessionId }, secret, { expiresIn: maxAge });
            const cookie = serialize('token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge,
                path: '/',
            });
            res.setHeader('Set-Cookie', cookie);
            // Notify on admin login if enabled
            const { getNotificationSettings, sendCustomTelegramNotification } = await import('../../../scripts/sendTelegramNotification.js');
            const notificationSettings = getNotificationSettings();
            if (notificationSettings.onAdminLogin) {
                await sendCustomTelegramNotification('AnonyConnect: Someone has just logged to admin account');
            }
            return res.status(200).json({ success: true });
        });
        return;
    } else if (req.method === 'GET') {
        // Check if 2FA is enabled and set up
        const twoFAEnabled = get2FAConfig();
        if (!twoFAEnabled) return res.status(200).json({ enabled: false, setup: false });
        const setup = await is2FASetUp();
        return res.status(200).json({ enabled: true, setup });
    } else {
        return res.status(405).end();
    }
}

export const config = {
    api: {
        bodyParser: true,
    },
};
