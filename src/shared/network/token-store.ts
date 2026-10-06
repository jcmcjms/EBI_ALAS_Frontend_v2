interface TokenState {
  accessToken: string | null;
  accessTokenExpiry: number | null;
}

const TOKEN_STORAGE_KEY = 'alas_auth_token';

function getStoredToken(): TokenState {
  if (typeof window === 'undefined') {
    return { accessToken: null, accessTokenExpiry: null };
  }
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { accessToken: null, accessTokenExpiry: null };
}

function setStoredToken(token: string | null, expiry: number | null): void {
  if (typeof window === 'undefined') return;
  if (token && expiry) {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({ accessToken: token, accessTokenExpiry: expiry }));
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getAccessToken(): string | null {
  const { accessToken, accessTokenExpiry } = getStoredToken();
  if (accessToken && accessTokenExpiry && Date.now() < accessTokenExpiry) {
    return accessToken;
  }
  return null;
}

export function setAccessToken(token: string, expiresAt: string): void {
  const expiry = new Date(expiresAt).getTime();
  const safeExpiry = expiry - 60_000; // 1 minute buffer
  setStoredToken(token, safeExpiry);
}

export function clearAccessToken(): void {
  setStoredToken(null, null);
}

export function isTokenExpired(): boolean {
  const { accessTokenExpiry } = getStoredToken();
  if (!accessTokenExpiry) return true;
  return Date.now() >= accessTokenExpiry;
}