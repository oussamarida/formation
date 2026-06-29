export const ROLES = {
  MANAGER: "manager",
  CLIENT: "client",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function isManager(role: string): boolean {
  return role === ROLES.MANAGER;
}
