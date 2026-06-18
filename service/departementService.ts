import { AppDataSource } from "../database/data-source.js";
import { DepartementEntity } from "../database/entities/Departement.js";
import type { Departement } from "../types/departement.js";

function departementRepository() {
  return AppDataSource.getRepository(DepartementEntity);
}

function toDepartement(entity: DepartementEntity): Departement {
  return {
    id: entity.id,
    code: entity.code,
    nom: entity.nom,
  };
}

// Retourne tous les départements
export async function getAllDepartements(): Promise<Departement[]> {
  const departements = await departementRepository().find({ order: { code: "ASC" } });
  return departements.map(toDepartement);
}

// Recherche un département par code (DRH, DSI, DAF)
export async function findByCode(code: string): Promise<DepartementEntity | null> {
  return departementRepository().findOne({ where: { code } });
}
