import { withAdminAuth } from '../../../utils/withAdminAuth';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { setAdminSetting, getAdminSetting, deleteAllAdminSessions } from '../../../lib/db';

async function handler(req, res) {
    if (req.method === 'POST') {
        // Only allow setup if not already set up
        const existing = await getAdminSetting('2fa_secret');
        if (existing) {
            return res.status(400).json({ error: '2FA already set up' });
        }
        const secretObj = speakeasy.generateSecret({ name: 'AnonyConnect Admin' });
        const qr = await QRCode.toDataURL(secretObj.otpauth_url);
        // Do NOT store secret yet, wait for verification
        return res.status(200).json({ qr, secret: secretObj.base32 });
    } else if (req.method === 'PUT') {
        // Verify code and store secret if valid
        const { secret, code } = req.body;
        if (!secret || !code) return res.status(400).json({ error: 'Missing secret or code' });
        const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token: code, window: 1 });
        if (!verified) return res.status(401).json({ error: 'Invalid 2FA code' });
        await setAdminSetting('2fa_secret', secret);
        await deleteAllAdminSessions();
        return res.status(200).json({ success: true });
    } else if (req.method === 'GET') {
        // Check if 2FA is set up
        const existing = await getAdminSetting('2fa_secret');
        return res.status(200).json({ setup: !!existing });
    } else {
        return res.status(405).end();
    }
}

export default withAdminAuth(handler);
