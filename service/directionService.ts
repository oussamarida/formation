import * as departementService from "./departementService.js";

// Retourne la liste des codes département (compatibilité /api/directions)
export async function getAllDirections(): Promise<string[]> {
  const departements = await departementService.getAllDepartements();
  return departements.map((departement) => departement.code);
}
