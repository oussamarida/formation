export interface Conge {
  id: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  jours: number;
  statut: string;
}

export interface Agent {
  id: number;
  matricule: string;
  nom: string;
  direction: string;
  conges: Conge[];
}

export type Direction = "DRH" | "DSI" | "DAF";

export const VALID_DIRECTIONS: Direction[] = ["DRH", "DSI", "DAF"];
