import type { Request, Response } from "express";
import * as authService from "../service/authService.js";

// Vérifie le header Authorization: Bearer <token> — à appeler dans les controllers (pas de middleware)
export function requireAuth(req: Request, res: Response): string | null {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized — Bearer token required" });
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  const username = authService.verifyToken(token);

  if (!username) {
    res.status(401).json({ message: "Unauthorized — invalid or expired token" });
    return null;
  }

  return username;
}
