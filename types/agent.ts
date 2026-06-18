import type { Departement } from "./departement.js";

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
  departement: Departement | null;
  conges: Conge[];
}

export interface SeedAgent {
  id: number;
  matricule: string;
  nom: string;
  departement: string;
  conges: Conge[];
}
