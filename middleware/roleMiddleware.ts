import type { NextFunction, Request, Response } from "express";
import * as authService from "../service/authService.js";
import { USER_ROLES, type UserRole } from "../types/user.js";

function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

// Middleware : autorise uniquement les rôles donnés (ex: manager)
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ message: "Unauthorized — Bearer token required" });
      return;
    }

    const payload = authService.verifyTokenPayload(token);
    if (!payload) {
      res.status(401).json({ message: "Unauthorized — invalid or expired token" });
      return;
    }

    if (!roles.includes(payload.role)) {
      res.status(403).json({ message: "Forbidden — insufficient role" });
      return;
    }

    next();
  };
}

export const requireManager = requireRole(USER_ROLES.MANAGER);
