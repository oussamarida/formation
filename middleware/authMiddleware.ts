import type { NextFunction, Request, Response } from "express";
import * as authService from "../service/authService.js";

// Middleware : vérifie Authorization: Bearer <token> avant d'atteindre les controllers
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized — Bearer token required" });
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  const username = authService.verifyToken(token);

  if (!username) {
    res.status(401).json({ message: "Unauthorized — invalid or expired token" });
    return;
  }

  req.username = username;
  next();
}
