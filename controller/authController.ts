import type { Request, Response } from "express";
import * as authService from "../service/authService.js";

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
