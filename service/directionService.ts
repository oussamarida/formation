import { getAllAgents } from "./agentService.js";

// Retourne la liste unique et triée de toutes les directions depuis les agents
export async function getAllDirections(): Promise<string[]> {
  const agents = await getAllAgents();
  return [...new Set(agents.map((agent) => agent.direction))].sort();
}
