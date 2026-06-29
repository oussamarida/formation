const TOKEN_KEY = "token";

export interface TokenPayload {
  sub: string;
  role: string;
  exp: number;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Décode le payload du token API (format base64url + signature HMAC)
export function decodeToken(token: string): TokenPayload | null {
  try {
    const body = token.split(".")[0];
    const json = atob(body.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return payload.exp < Date.now();
}
