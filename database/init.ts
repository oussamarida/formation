import "reflect-metadata";
import "dotenv/config";
import fs from "fs";
import { AppDataSource } from "./data-source.js";
import { AgentEntity } from "./entities/Agent.js";
import { CongeEntity } from "./entities/Conge.js";
import { seedUsersIfEmpty } from "./seedUsers.js";
import type { Agent } from "../types/agent.js";

// Insère les données initiales depuis agents.json si les tables sont vides
async function seedIfEmpty(): Promise<void> {
  const agentRepo = AppDataSource.getRepository(AgentEntity);
  const congeRepo = AppDataSource.getRepository(CongeEntity);
  const agentCount = await agentRepo.count();
  const congeCount = await congeRepo.count();

  if (agentCount > 0 && congeCount > 0) {
    console.log(`Tables already contain data: ${agentCount} agents, ${congeCount} conges`);
    return;
  }

  if (agentCount > 0) {
    await congeRepo.clear();
    await agentRepo.clear();
  }

  const agents = JSON.parse(fs.readFileSync("data/agents.json", "utf-8")) as Agent[];

  for (const agentData of agents) {
    const agent = agentRepo.create({
      id: agentData.id,
      matricule: agentData.matricule,
      nom: agentData.nom,
      direction: agentData.direction,
    });
    await agentRepo.save(agent);

    for (const conge of agentData.conges) {
      const congeEntity = congeRepo.create({
        id: conge.id,
        type: conge.type,
        dateDebut: new Date(conge.dateDebut),
        dateFin: new Date(conge.dateFin),
        jours: conge.jours,
        statut: conge.statut,
        agent,
      });
      await congeRepo.save(congeEntity);
    }
  }

  const finalCongeCount = await congeRepo.count();
  console.log(`Seeded ${agents.length} agents and ${finalCongeCount} conges`);
}

// Script d'initialisation : crée les tables TypeORM et remplit les données
async function main(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("TypeORM connected — tables created/updated from entities");
    await seedUsersIfEmpty();
    await seedIfEmpty();
  } catch (error) {
    console.error("Database init failed:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

main();
