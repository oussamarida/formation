import "reflect-metadata";
import "dotenv/config";
import fs from "fs";
import { AppDataSource } from "./data-source.js";
import { AgentEntity } from "./entities/Agent.js";
import { CongeEntity } from "./entities/Conge.js";
import { DepartementEntity } from "./entities/Departement.js";
import { UserEntity } from "./entities/User.js";
import * as userService from "../service/userService.js";
import type { SeedAgent } from "../types/agent.js";
import type { SeedDepartement } from "../types/departement.js";
import type { SeedUser } from "../types/user.js";

async function seedUsers(): Promise<void> {
  const userRepo = AppDataSource.getRepository(UserEntity);
  const users = JSON.parse(fs.readFileSync("data/users.json", "utf-8")) as SeedUser[];
  let created = 0;

  for (const userData of users) {
    const role = userData.role ?? "client";
    const existing = await userRepo.findOne({ where: { username: userData.username } });

    if (!existing) {
      await userService.createUser({
        username: userData.username,
        password: userData.password,
        role,
      });
      created++;
      continue;
    }

    if (existing.role !== role) {
      existing.role = role;
      await userRepo.save(existing);
    }

    await userService.resetPassword(userData.username, userData.password);
  }

  console.log(`Users synced from data/users.json (${created} created, ${users.length} total)`);
}

async function seedDepartementsIfEmpty(): Promise<void> {
  const departementRepo = AppDataSource.getRepository(DepartementEntity);
  if ((await departementRepo.count()) > 0) {
    console.log("Departements already seeded");
    return;
  }

  const departements = JSON.parse(
    fs.readFileSync("data/departements.json", "utf-8")
  ) as SeedDepartement[];

  for (const departementData of departements) {
    await departementRepo.save(departementRepo.create(departementData));
  }
  console.log(`Seeded ${departements.length} departement(s)`);
}

async function seedAgentsIfEmpty(): Promise<void> {
  const agentRepo = AppDataSource.getRepository(AgentEntity);
  const congeRepo = AppDataSource.getRepository(CongeEntity);
  const departementRepo = AppDataSource.getRepository(DepartementEntity);

  if ((await agentRepo.count()) > 0) {
    console.log("Agents already seeded");
    return;
  }

  const agents = JSON.parse(fs.readFileSync("data/agents.json", "utf-8")) as SeedAgent[];

  for (const agentData of agents) {
    const departement = agentData.departement
      ? await departementRepo.findOne({ where: { code: agentData.departement } })
      : null;

    const agent = await agentRepo.save(
      agentRepo.create({
        id: agentData.id,
        matricule: agentData.matricule,
        nom: agentData.nom,
        departement,
      })
    );

    for (const conge of agentData.conges) {
      await congeRepo.save(
        congeRepo.create({
          id: conge.id,
          type: conge.type,
          dateDebut: new Date(conge.dateDebut),
          dateFin: new Date(conge.dateFin),
          jours: conge.jours,
          statut: conge.statut,
          agent,
        })
      );
    }
  }

  console.log(`Seeded ${agents.length} agents`);
}

async function main(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("TypeORM connected — tables created/updated from entities");
    await seedUsers();
    await seedDepartementsIfEmpty();
    await seedAgentsIfEmpty();
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
