/**
 * Edge-compatible AES-256-GCM encryption for Farrukh AI Pro session tokens.
 * Uses the Web Crypto API (crypto.subtle) which is available in both
 * Edge Runtime (middleware) and Node.js (API routes / Server Components).
 */

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * Derives a deterministic 32-byte (AES-256) key from process.env.ENCRYPTION_KEY.
 * Uses SHA-256 hashing so the key is always 256 bits regardless of input length.
 */
async function getAesKey(): Promise<CryptoKey> {
  const raw = process.env.ENCRYPTION_KEY || 'FarrukhAiPro-2026-Dev-Fallback-Key-!';
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(raw));
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

/**
 * Encrypt a JSON-serializable session payload.
 * Returns a base64 string formatted as: Base64URL([IV(12 bytes)] + [Ciphertext + AuthTag])
 * This format is safe to place directly inside an HTTP cookie.
 */
export async function encryptSession(payload: Record<string, unknown>): Promise<string> {
  const aesKey = await getAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    new TextEncoder().encode(JSON.stringify(payload))
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined))
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Decrypt a session token and validate its expiration.
 * Returns null on: invalid base64, wrong key, tampered data, or expired token.
 */
export async function decryptSession(token: string): Promise<Record<string, unknown> | null> {
  try {
    const aesKey = await getAesKey();

    // Reconstruct binary buffer from base64url
    let b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

    // Must have enough bytes: 12 (IV) + 16 (min auth tag) = 28
    if (raw.length < 28) return null;

    // Extract 12-byte IV and decrypt
    const iv = raw.slice(0, 12);
    const cipherBytes = raw.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, cipherBytes);

    const payload = JSON.parse(new TextDecoder().decode(decrypted)) as Record<string, unknown>;

    // ── Expiration Guard (FAP-2026 timestamp) ──
    const expiresAt = payload['expiresAt'] as number | undefined;
    const lastActive = payload['lastActive'] as string | undefined;

    if (!expiresAt || Date.now() > expiresAt) return null; // Hard expiry
    if (lastActive && Date.now() - new Date(lastActive).getTime() > SESSION_DURATION_MS) {
      return null; // 24-hour inactivity timeout
    }

    // Refresh the lastActive sliding window for the caller
    payload['lastActive'] = new Date().toISOString();

    return payload;
  } catch {
    return null;
  }
}

export const MASTER_ID = '7586373';
