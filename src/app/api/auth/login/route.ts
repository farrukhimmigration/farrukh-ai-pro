import { NextRequest, NextResponse } from 'next/server';
import { encryptSession } from '@/lib/crypto';

/**
 * Server-side authentication for Farrukh AI Pro.
 *
 * MASTER_ID resolution (in order):
 *   1. process.env.MASTER_ID          (private Vercel env var — preferred)
 *   2. process.env.NEXT_PUBLIC_MASTER_ID (fallback)
 *   3. Hardcoded fallback '7586373'  (last resort — never rely on this long-term)
 *
 * The hardcoded fallback exists ONLY because Vercel env var injection has
 * been unreliable. Fix this by confirming the Vercel env var name is exactly
 * "MASTER_ID" (case-sensitive) and redeploy.
 */
const rawMaster = [
  process.env.MASTER_ID,
  process.env.NEXT_PUBLIC_MASTER_ID,
  '7586373',  // hardcoded fallback — NEVER change this without updating Vercel env vars
].filter(Boolean)[0];

const MASTER_ID = (rawMaster as string).trim();

/** Google Apps Script URL for staff code verification */
const GAS_URL = (process.env.GOOGLE_APPS_SCRIPT_URL || '').trim();

/**
 * Diagnostic log — prints once at module load time (on cold start in Vercel).
 * Helps confirm the env var is actually being read.
 * Only safe because it logs LENGTH and SOURCE, never the value.
 */
console.log('[Auth API] MASTER_ID loaded:', {
  length: MASTER_ID.length,
  source: process.env.MASTER_ID ? 'MASTER_ID' : process.env.NEXT_PUBLIC_MASTER_ID ? 'NEXT_PUBLIC_MASTER_ID' : 'NOT_FOUND',
  isEmpty: MASTER_ID === '',
});

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
    const accessKey = (body?.accessKey || '').trim();

    if (!accessKey || typeof accessKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ── Master key check (server-side only) ──
    if (MASTER_ID && accessKey.length === MASTER_ID.length && secureCompare(accessKey, MASTER_ID)) {
      console.log('[Auth API] ✅ Master key match — creating session');
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

    // Debug: help diagnose why master key didn't match
    if (accessKey.length === 7) {
      console.log('[Auth API] ❌ 7-digit key submitted — comparison result:', {
        masterIdLength: MASTER_ID.length,
        inputLength: accessKey.length,
        masterIdSource: process.env.MASTER_ID ? 'MASTER_ID' : process.env.NEXT_PUBLIC_MASTER_ID ? 'NEXT_PUBLIC_MASTER_ID' : 'NONE',
        masterIdEmpty: MASTER_ID === '',
        lengthMatch: accessKey.length === MASTER_ID.length,
      });
    }

    // ── Staff code check (8 digits, verified via Google Apps Script) ──
    if (accessKey.length === 8 && /^\d{8}$/.test(accessKey)) {
      if (!GAS_URL || GAS_URL.startsWith('your_google_apps_script')) {
        console.log('[Auth API] ❌ 8-digit staff code but GAS not configured');
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
