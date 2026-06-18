import { AppDataSource } from "../database/data-source.js";
import { UserEntity } from "../database/entities/User.js";
import type { User, UserRole } from "../types/user.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

function userRepository() {
  return AppDataSource.getRepository(UserEntity);
}

function toUser(entity: UserEntity): User {
  return {
    id: entity.id,
    username: entity.username,
    role: entity.role as UserRole,
  };
}

// Recherche un utilisateur par username
export async function findByUsername(username: string): Promise<UserEntity | null> {
  return userRepository().findOne({ where: { username } });
}

// Vérifie username/password et retourne l'utilisateur si valide
export async function authenticate(username: string, password: string): Promise<User | null> {
  const user = await findByUsername(username);
  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return toUser(user);
}

// Crée un utilisateur avec mot de passe hashé (utilisé par le seeder)
export async function createUser({
  username,
  password,
  role = "user",
}: {
  username: string;
  password: string;
  role?: UserRole;
}): Promise<User> {
  const passwordHash = await hashPassword(password);
  const entity = userRepository().create({ username, passwordHash, role });
  const saved = await userRepository().save(entity);
  return toUser(saved);
}
