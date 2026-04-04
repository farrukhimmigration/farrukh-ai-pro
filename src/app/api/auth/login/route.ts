import { NextRequest, NextResponse } from 'next/server';
import { encryptSession } from '@/lib/crypto';

/**
 * Server-side authentication for Farrukh AI Pro.
 *
 * MASTER_ID is sourced from process.env.NEXT_PUBLIC_MASTER_ID.
 * In production, this must be set via .env or server config.
 * NEVER expose this to the browser — this constant is only on the server.
 */
const MASTER_ID = process.env.MASTER_ID || process.env.NEXT_PUBLIC_MASTER_ID || '';

/** Google Apps Script URL for staff code verification */
const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

/**
 * Constant-time comparison to prevent timing attacks on the master key.
 * This is not a full crypto library, but it prevents simple timing leaks.
 */
function secureCompare(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const ka = encoder.encode(a);
  const kb = encoder.encode(b);

  if (ka.length !== kb.length) return false;

  let mismatch = 0;
  for (let i = 0; i < ka.length; i++) {
    mismatch |= ka[i] ^ kb[i];
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessKey } = body;

    if (!accessKey || typeof accessKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ── Master key check (server-side only) ──
    if (MASTER_ID && accessKey.length === 7 && secureCompare(accessKey, MASTER_ID)) {
      const session = {
        userId: `master_${MASTER_ID}`,
        role: 'master' as const,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      const encrypted = await encryptSession(session);
      const response = NextResponse.json({
        success: true,
        redirect: '/admin-dashboard',
      });

      response.cookies.set('__farrukh_ai_session', encrypted, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    // ── Staff code check (8 digits, verified via Google Apps Script) ──
    if (accessKey.length === 8 && /^\d{8}$/.test(accessKey)) {
      if (!GAS_URL || GAS_URL === 'your_google_apps_script_url_here') {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      try {
        const verification = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'verifyStaffCode',
            code: accessKey,
            timestamp: Date.now(),
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (!verification.ok) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        const staffData = await verification.json();

        if (!staffData?.valid || staffData?.status !== 'Active') {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        // Valid staff code — create session
        const session = {
          userId: `staff_${staffData.staffId || accessKey}`,
          role: 'staff' as const,
          staffCode: accessKey,
          staffName: staffData.name || 'Staff Member',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };

        const encrypted = await encryptSession(session);
        const response = NextResponse.json({
          success: true,
          redirect: '/dashboard',
        });

        response.cookies.set('__farrukh_ai_session', encrypted, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60,
          path: '/',
        });

        return response;
      } catch {
        // Network timeout or GAS error — still return generic denial
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // ── Fallback: key length doesn't match any known format ──
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (_error) {
    // NEVER expose the error details to the client
    console.error('[Auth API] Unexpected error:', _error);
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
}
