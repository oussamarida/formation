import "reflect-metadata";
import "dotenv/config";
import fs from "fs";
import { AppDataSource } from "./data-source.js";
import { UserEntity } from "./entities/User.js";
import * as userService from "../service/userService.js";
import type { SeedUser } from "../types/user.js";

async function main(): Promise<void> {
  const userRepo = AppDataSource.getRepository(UserEntity);
  const users = JSON.parse(fs.readFileSync("data/users.json", "utf-8")) as SeedUser[];
  let created = 0;

  for (const userData of users) {
    const role = userData.role ?? "client";
    const existing = await userRepo.findOne({ where: { username: userData.username } });

    if (!existing) {
      await userService.createUser({
        username: userData.username,
        password: userData.password,
        role,
      });
      created++;
      continue;
    }

    if (existing.role !== role) {
      existing.role = role;
      await userRepo.save(existing);
    }

    await userService.resetPassword(userData.username, userData.password);
  }

  console.log(`Users synced (${created} created): ${users.map((u) => u.username).join(", ")}`);
}

AppDataSource.initialize()
  .then(main)
  .catch((error) => {
    console.error("User seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });
