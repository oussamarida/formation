import crypto from "crypto";
import * as userService from "./userService.js";
import type { UserRole } from "../types/user.js";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-secret-change-in-production";
}

function sign(body: string): string {
  return crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
}

// Génère un token signé (HMAC) valide 24h pour l'utilisateur connecté
export function createToken(
  username: string,
  role: UserRole
): { token: string; expiresIn: number; username: string; role: UserRole } {
  const payload = { sub: username, role, exp: Date.now() + TOKEN_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const token = `${body}.${sign(body)}`;
  return { token, expiresIn: TOKEN_TTL_MS / 1000, username, role };
}

// Vérifie le token et retourne le username, ou null si invalide/expiré
export function verifyToken(token: string): string | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      sub: string;
      exp: number;
    };
    if (!payload.sub || payload.exp < Date.now()) return null;
    return payload.sub;
  } catch {
    return null;
  }
}

// Authentifie username/password contre la table users
export async function login(
  username: string,
  password: string
): Promise<{ token: string; expiresIn: number; username: string; role: UserRole } | null> {
  const user = await userService.authenticate(username, password);
  if (!user) return null;

  return createToken(user.username, user.role);
}
