import { NextResponse } from 'next/server';

const TRUSTED_ORIGINS = ['https://example.com', 'https://admin.example.com'];

async function validateSession(origin, token) {
  if (!TRUSTED_ORIGINS.includes(origin)) {
    throw new Error('Untrusted origin');
  }
  try {
    const res = await fetch(`${origin}/api/admin/validate-session`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  const needsAdminAuth = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const needsApiAuth = pathname.startsWith('/api/admin') && !['/api/admin/login', '/api/admin/validate-session'].includes(pathname);

  if (needsAdminAuth || needsApiAuth) {
    if (!token) {
      if (needsAdminAuth) return NextResponse.redirect(`${origin}/admin/login`);
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const valid = await validateSession(origin, token);
    if (!valid) {
      if (needsAdminAuth) return NextResponse.redirect(`${origin}/admin/login`);
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  }
  return NextResponse.next();
}
