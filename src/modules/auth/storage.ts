export const AUTH_STORAGE_KEY = "linkyun_auth";

export interface AuthSession {
  apiKey: string;
  username: string;
}

export function readAuthSession(storage?: Storage): AuthSession | null {
  if (!storage && typeof window === "undefined") return null;
  const target = storage || window.localStorage;
  try {
    const raw = target.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed.apiKey || !parsed.username) return null;
    return { apiKey: parsed.apiKey, username: parsed.username };
  } catch {
    return null;
  }
}

export function writeAuthSession(session: AuthSession, storage?: Storage): void {
  const target = storage || window.localStorage;
  target.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(storage?: Storage): void {
  const target = storage || window.localStorage;
  target.removeItem(AUTH_STORAGE_KEY);
}
