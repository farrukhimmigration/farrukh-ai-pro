import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      caseType,
      visaCountry,
      caseResult,
      documents,
      assessment,
      recommendations,
      successProbability,
    } = body;

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!appsScriptUrl || appsScriptUrl === 'your_google_apps_script_url_here') {
      return NextResponse.json(
        { error: 'Google Apps Script URL not configured' },
        { status: 500 }
      );
    }

    // Format the data for Google Sheets
    const payload = {
      timestamp: new Date().toISOString(),
      clientName: clientName || 'Unknown',
      caseType: caseType || 'Not specified',
      visaCountry: visaCountry || 'Not specified',
      caseResult: JSON.stringify(caseResult || {}),
      documentsUploaded: documents ? documents.join(', ') : 'None',
      assessment: assessment || 'Not assessed',
      recommendations: recommendations || 'No recommendations',
      successProbability: successProbability || 'N/A',
      consultant: 'Farrukh Consultancy',
    };

    // Send to Google Apps Script
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Google Apps Script responded with ${response.status}: ${responseText}`);
    }

    const appsScriptResult = await response.json().catch(() => ({ message: 'Data received' }));

    console.log(`[Google Sheets] Case result sent for client: ${clientName}`);

    return NextResponse.json({
      status: 'success',
      message: 'Case result forwarded to Google Sheets successfully',
      clientName,
      appsScriptResponse: appsScriptResult,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Google Sheets] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send result to Google Sheets', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
