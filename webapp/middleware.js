import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Only forward the request, do not check token or session here
  return NextResponse.next();
}
