import { encrypt, decrypt } from './crypto';

const SESSION_KEY = '___farrukh_ai_session_v1';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface SessionData {
  userId: string;
  role: 'master' | 'staff';
  staffCode?: string;
  loginTime: number;
  expiresAt: number;
}

/**
 * Saves an encrypted session to localStorage.
 * Stores both the encrypted session payload and a timestamp guard.
 */
export function saveSession(data: SessionData): void {
  const payload: SessionData = {
    ...data,
    loginTime: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  const json = JSON.stringify(payload);
  const encrypted = encrypt(json);
  localStorage.setItem(SESSION_KEY, encrypted);
}

/**
 * Reads and decrypts the session from localStorage.
 * Returns null if expired, tampered, or missing.
 */
export function loadSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  const encrypted = localStorage.getItem(SESSION_KEY);
  if (!encrypted) return null;

  const decrypted = decrypt(encrypted);
  if (!decrypted) return null;

  try {
    const session: SessionData = JSON.parse(decrypted);
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

/**
 * Clears the current session from localStorage.
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
