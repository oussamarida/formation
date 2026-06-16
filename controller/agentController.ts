import type { Request, Response } from "express";
import { VALID_DIRECTIONS, type Direction } from "../types/agent.js";
import { parseId } from "../utils/parseId.js";
import * as agentService from "../service/agentService.js";

function isValidDirection(value: string): value is Direction {
  return VALID_DIRECTIONS.includes(value as Direction);
}

function parseRequestId(idParam: string | string[] | undefined): number | null {
  if (typeof idParam !== "string") return null;
  return parseId(idParam);
}

export async function getAllAgents(req: Request, res: Response): Promise<void> {
  const direction = req.query.direction as string | undefined;

  if (direction && !isValidDirection(direction)) {
    res.status(400).json({ message: "Bad request — invalid direction" });
    return;
  }

  const agents = direction
    ? await agentService.getAgentsByDirection(direction)
    : await agentService.getAllAgents();

  res.json(agents);
}

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

export async function createAgent(req: Request, res: Response): Promise<void> {
  const { matricule, nom, direction } = req.body;

  if (!matricule || !nom) {
    res.status(400).json({ message: "Bad request — matricule and nom required" });
    return;
  }

  if (direction && !isValidDirection(direction)) {
    res.status(400).json({ message: "Bad request — invalid direction" });
    return;
  }

  const agent = await agentService.createAgent({ matricule, nom, direction });
  if (!agent) {
    res.status(409).json({ message: "Conflict — matricule already exists" });
    return;
  }

  res.status(201).json(agent);
}

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

  if (req.body.direction && !isValidDirection(req.body.direction)) {
    res.status(400).json({ message: "Bad request — invalid direction" });
    return;
  }

  const agent = await agentService.updateAgent(id, req.body);
  if (!agent) {
    res.status(404).json({ message: "Not found — agent does not exist" });
    return;
  }

  res.json(agent);
}

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
