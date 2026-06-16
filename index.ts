import "reflect-metadata";
import "dotenv/config";
import express from "express";
import agentRoutes from "./route/agentRoutes.js";
import directionRoutes from "./route/directionRoutes.js";
import { AppDataSource } from "./database/data-source.js";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Agents API is running" });
});

app.use("/api/agents", agentRoutes);
app.use("/api/directions", directionRoutes);

async function startServer(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("Oracle database connected (TypeORM)");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Structure API running on http://localhost:${PORT}`);
  });
}

process.on("SIGINT", async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(0);
});

startServer();
