// Configuration TypeORM : connexion Oracle et entités agents/conges
import "reflect-metadata";
import { DataSource } from "typeorm";
import { AgentEntity } from "./entities/Agent.js";
import { CongeEntity } from "./entities/Conge.js";
import { UserEntity } from "./entities/User.js";

export const AppDataSource = new DataSource({
  type: "oracle",
  username: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
  entities: [AgentEntity, CongeEntity, UserEntity],
  synchronize: true,
  logging: false,
});
