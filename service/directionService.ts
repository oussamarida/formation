import { getAllAgents } from "./agentService.js";

export async function getAllDirections(): Promise<string[]> {
  const agents = await getAllAgents();
  return [...new Set(agents.map((agent) => agent.direction))].sort();
}
