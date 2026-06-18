import type { Request, Response } from "express";
import * as departementService from "../service/departementService.js";

// GET /api/departements — retourne la liste des départements
export async function getAllDepartements(_req: Request, res: Response): Promise<void> {
  const departements = await departementService.getAllDepartements();
  res.json(departements);
}
