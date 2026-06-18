import fs from "fs";
import { AppDataSource } from "./data-source.js";
import { UserEntity } from "./entities/User.js";
import * as userService from "../service/userService.js";
import type { SeedUser } from "../types/user.js";

// Insère les utilisateurs depuis data/users.json si la table est vide
export async function seedUsersIfEmpty(): Promise<void> {
  const userRepo = AppDataSource.getRepository(UserEntity);
  const count = await userRepo.count();

  if (count > 0) {
    console.log(`Users table already contains ${count} user(s)`);
    return;
  }

  const users = JSON.parse(fs.readFileSync("data/users.json", "utf-8")) as SeedUser[];

  for (const userData of users) {
    await userService.createUser({
      username: userData.username,
      password: userData.password,
      role: userData.role ?? "user",
    });
  }

  console.log(`Seeded ${users.length} user(s)`);
}
