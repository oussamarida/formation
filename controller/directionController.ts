import type { Request, Response } from "express";
import * as directionService from "../service/directionService.js";

export async function getAllDirections(_req: Request, res: Response): Promise<void> {
  const directions = await directionService.getAllDirections();
  res.json(directions);
}
