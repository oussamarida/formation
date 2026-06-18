// Point d'entrée : configure Express, connecte Oracle via TypeORM et démarre l'API
import "reflect-metadata";
import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import agentRoutes from "./route/agentRoutes.js";
import authRoutes from "./route/authRoutes.js";
import directionRoutes from "./route/directionRoutes.js";
import { AppDataSource } from "./database/data-source.js";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Agents API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/directions", directionRoutes);

// Handles invalid JSON payloads (Express `express.json()` throws a SyntaxError).
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError && (err as any).body !== undefined) {
    res.status(400).json({ message: "Bad request — invalid JSON body" });
    return;
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Démarre l'API : connecte TypeORM à Oracle puis lance le serveur Express sur le port 3001
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
