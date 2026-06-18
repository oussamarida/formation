import type { Request, Response } from "express";
import { requireAuth } from "../utils/requireAuth.js";
import * as directionService from "../service/directionService.js";

// GET /api/directions — retourne la liste des directions
export async function getAllDirections(req: Request, res: Response): Promise<void> {
  if (!requireAuth(req, res)) return;

  const directions = await directionService.getAllDirections();
  res.json(directions);
}
