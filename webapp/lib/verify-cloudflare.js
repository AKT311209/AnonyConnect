import fetch from 'node-fetch';

export default async function verifyCloudflare(turnstileResponse) {
  // Bypass Turnstile checks in local development for easier testing.
  if (process.env.NODE_ENV === 'development') {
    return { success: true, bypass: true };
  }

  if (!turnstileResponse) {
    return { success: false, error: 'Missing turnstile response' };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { success: false, error: 'Turnstile secret not configured' };
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
      return { success: true };
    } else {
      return { success: false, ...data };
    }
  } catch (error) {
    return { success: false, error: 'Failed to verify turnstile' };
  }
}
