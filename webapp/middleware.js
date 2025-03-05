import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(`${origin}/admin/login`);
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const validateSessionResponse = await fetch(`${origin}/api/admin/validate-session`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`
        }
      });

      if (!validateSessionResponse.ok) {
        return NextResponse.redirect(`${origin}/admin/login`);
      }
    } catch (err) {
      return NextResponse.redirect(`${origin}/admin/login`);
    }
  }

  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login' && pathname !== '/api/admin/validate-session') {
    if (!token) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const validateSessionResponse = await fetch(`${origin}/api/admin/validate-session`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`
        }
      });

      if (!validateSessionResponse.ok) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    } catch (err) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  }

  return NextResponse.next();
}
