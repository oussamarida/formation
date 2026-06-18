import fs from "fs";
import { AppDataSource } from "./data-source.js";
import { DepartementEntity } from "./entities/Departement.js";
import type { SeedDepartement } from "../types/departement.js";

// Insère les départements depuis data/departements.json si la table est vide
export async function seedDepartementsIfEmpty(): Promise<void> {
  const departementRepo = AppDataSource.getRepository(DepartementEntity);
  const count = await departementRepo.count();

  if (count > 0) {
    console.log(`Departements table already contains ${count} departement(s)`);
    return;
  }

  const departements = JSON.parse(
    fs.readFileSync("data/departements.json", "utf-8")
  ) as SeedDepartement[];

  for (const departementData of departements) {
    const departement = departementRepo.create(departementData);
    await departementRepo.save(departement);
  }

  console.log(`Seeded ${departements.length} departement(s)`);
}
