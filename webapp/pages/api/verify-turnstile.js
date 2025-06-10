import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { turnstileResponse } = req.body;
  if (!turnstileResponse) {
    return res.status(400).json({ error: 'Missing turnstile response' });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: 'Turnstile secret not configured' });
  }

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: turnstileResponse
      })
    });
    const data = await verifyRes.json();
    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(403).json({ success: false, ...data });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify turnstile' });
  }
}
