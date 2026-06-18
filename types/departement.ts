export interface Departement {
  id: number;
  code: string;
  nom: string;
}

export type DepartementCode = "DRH" | "DSI" | "DAF";

export const VALID_DEPARTEMENT_CODES: DepartementCode[] = ["DRH", "DSI", "DAF"];

export interface SeedDepartement {
  code: string;
  nom: string;
}
