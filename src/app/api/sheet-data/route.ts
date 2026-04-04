import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sheet = searchParams.get('sheet') || 'Clients';
    const action = searchParams.get('action') || 'read';

    // Build request to Google Apps Script
    const queryParams = new URLSearchParams();
    queryParams.set('sheet', sheet);
    queryParams.set('action', action);

    if (action === 'verifyCode') {
      const code = searchParams.get('code');
      if (code) queryParams.set('code', code);
    }

    if (action === 'lookup') {
      const query = searchParams.get('search');
      if (query) queryParams.set('search', query);
    }

    const response = await fetch(`${GAS_URL}?${queryParams.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Sheet API returned ${response.status}: ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Sheet API] GET error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch from Google Sheets', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sheet, action, data } = body;

    if (!GAS_URL || GAS_URL === 'your_google_apps_script_url_here') {
      return NextResponse.json(
        { error: 'Google Apps Script URL not configured', gasUrl: false },
        { status: 500 }
      );
    }

    // Forward request to Google Apps Script
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        sheet,
        data,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Sheet API returned ${response.status}: ${text}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error('[Sheet API] POST error:', err);
    return NextResponse.json(
      { error: 'Failed to write to Google Sheets', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    );
  }
}
