import { NextRequest, NextResponse } from 'next/server';
import { decryptSession } from '@/lib/crypto';

// ─── Route access levels ─────────────────────────────────────────────
const PUBLIC_PATHS = ['/login'];
const MASTER_ONLY = ['/admin-dashboard'];
const STAFF_PLUS_MASTER = ['/upload', '/consultation', '/cases', '/clients', '/dashboard', '/analytics', '/settings', '/staff-portal'];

// ─── Middleware ──────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Public routes — no guard
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 2. Static / image / font pass-through
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|woff2?|ttf)$/)
  ) {
    return NextResponse.next();
  }

  // 3. Read and decrypt session cookie
  const cookie = req.cookies.get('__farrukh_ai_session');
  if (!cookie) return redirectLogin(req, 'Session not found');

  const session = await decryptSession(cookie.value);
  if (!session) {
    const res = redirectLogin(req, 'Session invalid or expired');
    res.cookies.delete('__farrukh_ai_session');
    return res;
  }

  // Session exists and is valid — extract role
  const role = session['role'] as string | undefined;
  if (!role) return redirectLogin(req, 'Invalid session');

  const isMaster = role === 'master';
  const isStaff = role === 'staff';

  // 4. Route authorization
  if (MASTER_ONLY.some(p => pathname.startsWith(p))) {
    if (!isMaster) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  if (STAFF_PLUS_MASTER.some(p => pathname.startsWith(p))) {
    if (!isMaster && !isStaff) return redirectLogin(req, 'Access denied');
  }

  // 5. Allow request through — user is authorized
  return NextResponse.next();
}

function redirectLogin(req: NextRequest, reason?: string) {
  const url = new URL('/login', req.url);
  if (reason) url.searchParams.set('msg', reason);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp|woff2?|ttf)$).*)',
  ],
};
