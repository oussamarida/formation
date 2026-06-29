export type UserRole = "manager" | "client";

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface SeedUser {
  username: string;
  password: string;
  role?: UserRole;
}

export const USER_ROLES = {
  MANAGER: "manager",
  CLIENT: "client",
} as const;
