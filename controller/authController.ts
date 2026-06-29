import type { Request, Response } from "express";
import * as authService from "../service/authService.js";

function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

// POST /api/auth/login — retourne un token si les identifiants sont valides
export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    res.status(400).json({ message: "Bad request — username and password required" });
    return;
  }

  try {
    const result = await authService.login(username, password);
    if (!result) {
      res.status(401).json({ message: "Unauthorized — invalid credentials" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/auth/me — retourne l'utilisateur courant depuis Oracle
export async function getMe(req: Request, res: Response): Promise<void> {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ message: "Unauthorized — Bearer token required" });
    return;
  }

  const user = await authService.getCurrentUser(token);
  if (!user) {
    res.status(401).json({ message: "Unauthorized — user not found or invalid token" });
    return;
  }

  res.json(user);
}
