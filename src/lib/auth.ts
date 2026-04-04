/**
 * Client-side auth utilities.
 * Reads the __farrukh_ai_session cookie for the client UI
 * (e.g., to show/hide admin panels).
 * The actual session is created and managed server-side by /api/auth/login.
 */

export interface SessionData {
  userId: string;
  role: 'master' | 'staff';
  staffCode?: string;
  staffName?: string;
  createdAt: string;
  lastActive: string;
  expiresAt: number;
}

/**
 * Reads and decrypts the session cookie from the browser cookie store.
 * Uses the same algorithm as the server (AES-256-GCM via crypto.subtle).
 */
async function decryptCookie(raw: string): Promise<SessionData | null> {
  try {
    const ENCRYPTION_SEED = process.env.NEXT_PUBLIC_ENCRYPTION_SEED || 'FarrukhAiPro-2026-Dev-Fallback-Key-!';
    
    // Decode base64url buffer
    let b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const combined = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

    // Must have at least 12-byte IV + 16-byte auth tag
    if (combined.length < 28) return null;

    // Derive key the same way as server
    const encoder = new TextEncoder();
    const keyHash = await crypto.subtle.digest('SHA-256', encoder.encode(ENCRYPTION_SEED));
    const key = await crypto.subtle.importKey('raw', keyHash, { name: 'AES-GCM' }, false, ['decrypt']);

    // Extract IV and decrypt
    const iv = combined.slice(0, 12);
    const cipherBytes = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBytes);
    const payload: SessionData = JSON.parse(new TextDecoder().decode(decrypted));

    // Check expiration client-side too
    if (Date.now() > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getClientSession(): Promise<SessionData | null> {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split('; ');
  const sessionCookie = cookies.find(c => c.startsWith('__farrukh_ai_session='));
  if (!sessionCookie) return null;
  
  const raw = sessionCookie.split('=')[1];
  return decryptCookie(raw);
}
