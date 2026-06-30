import axios from "axios";
import { clearToken, getToken } from "@/lib/authStorage";
import type {
  Agent,
  Conge,
  CreateAgentInput,
  Departement,
  LoginResponse,
  AuthUser,
  UpdateAgentInput,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  console.log("token", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", { username, password });
  return data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/api/auth/me");
  return data;
}

export async function getAgents(departement?: string): Promise<Agent[]> {
  const { data } = await api.get<Agent[]>("/api/agents", {
    params: departement ? { departement } : undefined,
  });
  return data;
}

export async function getAgent(id: number): Promise<Agent> {
  const { data } = await api.get<Agent>(`/api/agents/${id}`);
  return data;
}

export async function createAgent(input: CreateAgentInput): Promise<Agent> {
  const { data } = await api.post<Agent>("/api/agents", input);
  return data;
}

export async function updateAgent(id: number, input: UpdateAgentInput): Promise<Agent> {
  const { data } = await api.put<Agent>(`/api/agents/${id}`, input);
  return data;
}

export async function deleteAgent(id: number): Promise<void> {
  await api.delete(`/api/agents/${id}`);
}

export async function getAgentConges(id: number): Promise<Conge[]> {
  const { data } = await api.get<Conge[]>(`/api/agents/${id}/conges`);
  return data;
}

export async function getDepartements(): Promise<Departement[]> {
  const { data } = await api.get<Departement[]>("/api/departements");
  return data;
}

export default api;
