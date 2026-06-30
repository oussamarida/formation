import type { Request, Response } from "express";
import { VALID_DEPARTEMENT_CODES, type DepartementCode } from "../types/departement.js";
import { parseId } from "../utils/parseId.js";
import * as agentService from "../service/agentService.js";

// Vérifie si un code département est valide (DRH, DSI ou DAF)
function isValidDepartementCode(value: string): value is DepartementCode {
  return VALID_DEPARTEMENT_CODES.includes(value as DepartementCode);
}

// Extrait et valide l'id numérique depuis les paramètres URL Express
function parseRequestId(idParam: string | string[] | undefined): number | null {
  if (typeof idParam !== "string") return null;
  return parseId(idParam);
}

// GET /api/agents — liste tous les agents ou filtre par ?departement=
export async function getAllAgents(req: Request, res: Response): Promise<void> {
  console.log("agents (1) controller backend");
  const departement =
    (req.query.departement as string | undefined) ??
    (req.query.direction as string | undefined);

  if (departement && !isValidDepartementCode(departement)) {
    res.status(400).json({ message: "Bad request — invalid departement code" });
    return;
  }

  const agents = departement
    ? await agentService.getAgentsByDepartement(departement)
    : await agentService.getAllAgents();
  console.log("agents (2) controller backend",agents);
  res.json(agents);
}

// GET /api/agents/:id — retourne un agent par son id
export async function getAgentById(req: Request, res: Response): Promise<void> {
  const id = parseRequestId(req.params.id);
  if (!id) {
    res.status(400).json({ message: "Bad request — invalid id" });
    return;
  }

  const agent = await agentService.getAgentById(id);
  if (!agent) {
    res.status(404).json({ message: "Not found — agent does not exist" });
    return;
  }

  res.json(agent);
}

// GET /api/agents/:id/conges — retourne les congés d'un agent
export async function getCongesById(req: Request, res: Response): Promise<void> {
  const id = parseRequestId(req.params.id);
  if (!id) {
    res.status(400).json({ message: "Bad request — invalid id" });
    return;
  }

  const conges = await agentService.getCongesById(id);
  if (conges === null) {
    res.status(404).json({ message: "Not found — agent does not exist" });
    return;
  }

  res.json(conges);
}

// POST /api/agents — crée un nouvel agent
export async function createAgent(req: Request, res: Response): Promise<void> {
  const { matricule, nom, departement, departementCode, direction } = req.body;
  const code = departementCode ?? departement ?? direction;

  if (!matricule || !nom) {
    res.status(400).json({ message: "Bad request — matricule and nom required" });
    return;
  }

  if (code && !isValidDepartementCode(code)) {
    res.status(400).json({ message: "Bad request — invalid departement code" });
    return;
  }

  const agent = await agentService.createAgent({ matricule, nom, departementCode: code });
  if (!agent) {
    res.status(409).json({ message: "Conflict — matricule already exists or invalid departement" });
    return;
  }

  res.status(201).json(agent);
}

// PUT /api/agents/:id — modifie un agent existant
export async function updateAgent(req: Request, res: Response): Promise<void> {
  const id = parseRequestId(req.params.id);
  if (!id) {
    res.status(400).json({ message: "Bad request — invalid id" });
    return;
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Bad request — body cannot be empty" });
    return;
  }

  const code = req.body.departementCode ?? req.body.departement ?? req.body.direction;
  if (code && !isValidDepartementCode(code)) {
    res.status(400).json({ message: "Bad request — invalid departement code" });
    return;
  }

  const agent = await agentService.updateAgent(id, {
    matricule: req.body.matricule,
    nom: req.body.nom,
    departementCode: code,
  });
  if (!agent) {
    res.status(404).json({ message: "Not found — agent does not exist or invalid departement" });
    return;
  }

  res.json(agent);
}

// DELETE /api/agents/:id — supprime un agent
export async function deleteAgent(req: Request, res: Response): Promise<void> {
  const id = parseRequestId(req.params.id);
  if (!id) {
    res.status(400).json({ message: "Bad request — invalid id" });
    return;
  }

  const deleted = await agentService.deleteAgent(id);
  if (!deleted) {
    res.status(404).json({ message: "Not found — agent does not exist" });
    return;
  }

  res.status(204).end();
}
