import "reflect-metadata";
import { DataSource } from "typeorm";
import { AgentEntity } from "./entities/Agent.js";
import { CongeEntity } from "./entities/Conge.js";

export const AppDataSource = new DataSource({
  type: "oracle",
  username: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
  entities: [AgentEntity, CongeEntity],
  synchronize: true,
  logging: false,
});
