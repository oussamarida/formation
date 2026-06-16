import { AppDataSource } from "../database/data-source.js";
import { AgentEntity } from "../database/entities/Agent.js";
import type { Agent, Conge } from "../types/agent.js";

function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    return date.slice(0, 10);
  }
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }
  return new Date(date as unknown as string).toISOString().slice(0, 10);
}

function toConge(conge: {
  id: string;
  type: string;
  dateDebut: Date | string;
  dateFin: Date | string;
  jours: number;
  statut: string;
}): Conge {
  return {
    id: conge.id,
    type: conge.type,
    dateDebut: formatDate(conge.dateDebut),
    dateFin: formatDate(conge.dateFin),
    jours: conge.jours,
    statut: conge.statut,
  };
}

function toAgent(entity: AgentEntity): Agent {
  return {
    id: entity.id,
    matricule: entity.matricule,
    nom: entity.nom,
    direction: entity.direction,
    conges: (entity.conges ?? []).map(toConge),
  };
}

function agentRepository() {
  return AppDataSource.getRepository(AgentEntity);
}

export async function getAllAgents(): Promise<Agent[]> {
  const agents = await agentRepository().find({ relations: { conges: true } });
  return agents.map(toAgent);
}

export async function getAgentsByDirection(direction: string): Promise<Agent[]> {
  const agents = await agentRepository().find({
    where: { direction },
    relations: { conges: true },
  });
  return agents.map(toAgent);
}

export async function getAgentById(id: number): Promise<Agent | null> {
  const agent = await agentRepository().findOne({
    where: { id },
    relations: { conges: true },
  });
  return agent ? toAgent(agent) : null;
}

export async function getCongesById(id: number): Promise<Conge[] | null> {
  const agent = await agentRepository().findOne({
    where: { id },
    relations: { conges: true },
  });
  if (!agent) return null;
  return (agent.conges ?? []).map(toConge);
}

export async function createAgent({
  matricule,
  nom,
  direction,
}: {
  matricule: string;
  nom: string;
  direction?: string;
}): Promise<Agent | null> {
  const repo = agentRepository();
  const existing = await repo.findOne({ where: { matricule } });
  if (existing) return null;

  const agent = repo.create({
    matricule,
    nom,
    direction: direction ?? "Non affecté",
  });
  const saved = await repo.save(agent);
  return toAgent({ ...saved, conges: [] });
}

export async function updateAgent(id: number, updates: Partial<Agent>): Promise<Agent | null> {
  const repo = agentRepository();
  const agent = await repo.findOne({ where: { id }, relations: { conges: true } });
  if (!agent) return null;

  if (updates.matricule !== undefined) agent.matricule = updates.matricule;
  if (updates.nom !== undefined) agent.nom = updates.nom;
  if (updates.direction !== undefined) agent.direction = updates.direction;

  const saved = await repo.save(agent);
  return toAgent(saved);
}

export async function deleteAgent(id: number): Promise<boolean> {
  const result = await agentRepository().delete(id);
  return (result.affected ?? 0) > 0;
}
