import { AppDataSource } from "../database/data-source.js";
import { AgentEntity } from "../database/entities/Agent.js";
import type { DepartementEntity } from "../database/entities/Departement.js";
import type { Agent, Conge } from "../types/agent.js";
import * as departementService from "./departementService.js";

// Convertit une date Oracle/JS en chaîne ISO (YYYY-MM-DD) pour l'API
function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    return date.slice(0, 10);
  }
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }
  return new Date(date as unknown as string).toISOString().slice(0, 10);
}

// Transforme une entité congé TypeORM en objet Conge JSON pour la réponse API
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

// Transforme une entité agent TypeORM en objet Agent JSON (avec ses congés)
function toAgent(entity: AgentEntity): Agent {
  return {
    id: entity.id,
    matricule: entity.matricule,
    nom: entity.nom,
    departement: entity.departement
      ? {
          id: entity.departement.id,
          code: entity.departement.code,
          nom: entity.departement.nom,
        }
      : null,
    conges: (entity.conges ?? []).map(toConge),
  };
}

const agentRelations = { conges: true, departement: true } as const;

// Retourne le repository TypeORM pour la table agents
function agentRepository() {
  return AppDataSource.getRepository(AgentEntity);
}

// Récupère tous les agents avec leurs congés depuis Oracle
export async function getAllAgents(): Promise<Agent[]> {
  const agents = await agentRepository().find({ relations: agentRelations });
  return agents.map(toAgent);
}

// Récupère les agents filtrés par code département (DRH, DSI, DAF)
export async function getAgentsByDepartement(code: string): Promise<Agent[]> {
  const agents = await agentRepository().find({
    where: { departement: { code } },
    relations: agentRelations,
  });
  return agents.map(toAgent);
}

// Récupère un agent par son id, ou null si introuvable
export async function getAgentById(id: number): Promise<Agent | null> {
  const agent = await agentRepository().findOne({
    where: { id },
    relations: agentRelations,
  });
  return agent ? toAgent(agent) : null;
}

// Récupère les congés d'un agent, ou null si l'agent n'existe pas
export async function getCongesById(id: number): Promise<Conge[] | null> {
  const agent = await agentRepository().findOne({
    where: { id },
    relations: agentRelations,
  });
  if (!agent) return null;
  return (agent.conges ?? []).map(toConge);
}

// Résout un département par code, retourne undefined si le code est absent
async function resolveDepartement(
  code?: string
): Promise<DepartementEntity | null | undefined> {
  if (code === undefined) return undefined;
  if (!code) return null;
  return departementService.findByCode(code);
}

// Crée un nouvel agent en base, retourne null si le matricule existe déjà
export async function createAgent({
  matricule,
  nom,
  departementCode,
}: {
  matricule: string;
  nom: string;
  departementCode?: string;
}): Promise<Agent | null> {
  const repo = agentRepository();
  const existing = await repo.findOne({ where: { matricule } });
  if (existing) return null;

  const departement = await resolveDepartement(departementCode);
  if (departementCode && !departement) return null;

  const agent = repo.create({
    matricule,
    nom,
    departement: departement ?? null,
  });
  const saved = await repo.save(agent);

  const withRelations = await repo.findOne({
    where: { id: saved.id },
    relations: agentRelations,
  });
  return withRelations ? toAgent(withRelations) : null;
}

// Met à jour un agent existant en base, retourne null si introuvable
export async function updateAgent(
  id: number,
  updates: {
    matricule?: string;
    nom?: string;
    departementCode?: string;
  }
): Promise<Agent | null> {
  const repo = agentRepository();
  const agent = await repo.findOne({ where: { id }, relations: agentRelations });
  if (!agent) return null;

  if (updates.matricule !== undefined) agent.matricule = updates.matricule;
  if (updates.nom !== undefined) agent.nom = updates.nom;

  if (updates.departementCode !== undefined) {
    if (!updates.departementCode) {
      agent.departement = null;
    } else {
      const departement = await departementService.findByCode(updates.departementCode);
      if (!departement) return null;
      agent.departement = departement;
    }
  }

  const saved = await repo.save(agent);
  const withRelations = await repo.findOne({
    where: { id: saved.id },
    relations: agentRelations,
  });
  return withRelations ? toAgent(withRelations) : null;
}

// Supprime un agent par id, retourne true si supprimé
export async function deleteAgent(id: number): Promise<boolean> {
  const result = await agentRepository().delete(id);
  return (result.affected ?? 0) > 0;
}
