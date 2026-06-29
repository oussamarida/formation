export interface Departement {
  id: number;
  code: string;
  nom: string;
}

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

export interface LoginResponse {
  token: string;
  expiresIn: number;
  username: string;
  role: string;
}

export interface CreateAgentInput {
  matricule: string;
  nom: string;
  departementCode?: string;
}

export interface UpdateAgentInput {
  matricule?: string;
  nom?: string;
  departementCode?: string;
}
