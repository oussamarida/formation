export type UserRole = "admin" | "user";

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
