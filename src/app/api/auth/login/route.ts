import { NextRequest, NextResponse } from 'next/server';
import { encryptSession } from '@/lib/crypto';

const MASTER_KEY = '7586373';
const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

export async function POST(request: NextRequest) {
  try {
    const { accessKey } = await request.json();

    if (!accessKey) {
      return NextResponse.json({ error: 'Access key required' }, { status: 400 });
    }

    // Master key check
    if (accessKey === MASTER_KEY) {
      const session = {
        userId: 'master_7586373',
        role: 'master' as const,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      const encrypted = await encryptSession(session);
      const response = NextResponse.json({
        success: true,
        role: 'master',
        redirect: '/admin-dashboard',
      });

      response.cookies.set('___farrukh_ai_session', encrypted, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        path: '/',
      });

      // Also store localStorage-friendly version
      response.cookies.set('___farrukh_fs', encrypted, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    // Staff code check (8 digits)
    if (accessKey.length !== 8) {
      return NextResponse.json(
        { error: 'Invalid code format. Must be 8 digits for staff.' },
        { status: 400 }
      );
    }

    // Query Google Apps Script to verify staff code
    const staffResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verifyStaffCode',
        code: accessKey,
        timestamp: Date.now(),
      }),
    });

    if (!staffResponse.ok) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    const staffData = await staffResponse.json();

    if (!staffData.valid || staffData.status !== 'Active') {
      return NextResponse.json(
        { error: 'Invalid or inactive access code' },
        { status: 401 }
      );
    }

    // Valid staff - create session
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
      role: 'staff',
      redirect: '/staff-portal',
      staffName: staffData.name,
    });

    response.cookies.set('__farrukh_ai_session', encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('[Auth API] Error:', error);
    return NextResponse.json(
      { error: 'Internal authentication error' },
      { status: 500 }
    );
  }
}
