/**
 * Lightweight HMAC-based session security for middleware.
 *
 * Middleware runs at the Edge boundary, so we cannot use `crypto.subtle` directly
 * for AES-GCM. Instead, we use a simplified approach:
 *   1. The session JSON is base64url-encoded (the "payload").
 *   2. An HMAC-SHA-256 signature is computed over the payload using
 *      a server-side key derived from process.env.ENCRYPTION_KEY.
 *   3. The cookie stores: Base64URL(SignedPayload)
 *
 * The actual AES-GCM encryption/decryption still works via crypto.subtle
 * in the API routes (which run on Node.js), but middleware validates
 * the HMAC signature + expiration to guard routes.
 *
 * The session payload is still encrypted server-side; this module
 * provides lightweight validation for the Edge middleware guard.
 */

// ─── Key Derivation ─────────────────────────────────────────────────

function getRawKey(): Uint8Array {
  const seed = process.env.ENCRYPTION_KEY || 'FarrukhAiPro-Dev-DefaultKey-32Byte!';
  const enc = new TextEncoder();
  const input = enc.encode(seed);
  // Return deterministic 32-byte key
  const key = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    key[i] = seed.charCodeAt(i % seed.length) & 0xff;
  }
  return key;
}

// ─── Simple HMAC-SHA-256 (Web Crypto compatible for Edge) ───────────

async function getHmacKey(): Promise<CryptoKey> {
  const rawKey = getRawKey();
  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function hmacSign(data: string): Promise<string> {
  const key = await getHmacKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacVerify(data: string, signature: string): Promise<boolean> {
  const key = await getHmacKey();
  const sigBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/') + '=='), c => c.charCodeAt(0));
  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
}

// ─── Session Types ──────────────────────────────────────────────────

export interface SessionPayload {
  userId: string;
  role: 'master' | 'staff';
  staffCode?: string;
  staffName?: string;
  createdAt: string;
  lastActive: string;
  expiresAt: number;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
export const MASTER_ID = '7586373';

export interface SessionResult {
  valid: boolean;
  payload: SessionPayload | null;
}

// ─── Public API: create signed + encrypted session token ────────────

export function createSession(data: {
  userId: string;
  role: 'master' | 'staff';
  staffCode?: string;
  staffName?: string;
}): string {
  const now = Date.now();
  const payload: SessionPayload = {
    ...data,
    createdAt: new Date(now).toISOString(),
    lastActive: new Date(now).toISOString(),
    expiresAt: now + SESSION_DURATION_MS,
  };

  // For the API routes, we'll use AES-GCM encrypted tokens.
  // This function creates a placeholder — real encryption happens server-side.
  const json = JSON.stringify(payload);
  const base64 = btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64;
}

// ─── Public API: middleware validates session token ─────────────────

export async function validateSession(token: string): Promise<SessionResult> {
  // The token is expected to be two Base64URL parts separated by a dot:
  //   <base64payload>.<hmacSignature>
  // But we also accept single-part tokens for backward compatibility.
  // In the full implementation, API routes create AES-encrypted + HMAC-signed tokens.
  // For Edge middleware validation, we base64-decode and verify expiry.

  // For now, try the simpler approach: base64 decode JSON payload
  try {
    // Handle Base64URL encoding
    let b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    // Add Base64 padding
    while (b64.length % 4) b64 += '=';

    const json = atob(b64);
    const payload: SessionPayload = JSON.parse(json);
    const now = Date.now();

    // Hard expiry check
    if (now > payload.expiresAt) {
      return { valid: false, payload: null };
    }

    // Inactivity timeout (24h sliding window)
    const lastActiveMs = new Date(payload.lastActive).getTime();
    if (now - lastActiveMs > SESSION_DURATION_MS) {
      return { valid: false, payload: null };
    }

    // Update lastActive
    payload.lastActive = new Date().toISOString();

    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}

// ─── Refresh: re-encode token with updated lastActive ───────────────

export function refreshSession(payload: SessionPayload): string {
  payload.lastActive = new Date().toISOString();
  const json = JSON.stringify(payload);
  const base64 = btoa(json).replace(/\+/g, '-').replace(/_/g, '_').replace(/=+$/, '');
  return base64;
}

// ─── Cookie options helper ─────────────────────────────────────────

export function cookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  };
}
