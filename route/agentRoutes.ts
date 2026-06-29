// Définit les routes HTTP pour les agents (GET, POST, PUT, DELETE)
import express from "express";
import * as agentController from "../controller/agentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireManager } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", agentController.getAllAgents);
router.get("/:id/conges", agentController.getCongesById);
router.get("/:id", agentController.getAgentById);
router.post("/", requireManager, agentController.createAgent);
router.put("/:id", requireManager, agentController.updateAgent);
router.delete("/:id", requireManager, agentController.deleteAgent);

export default router;
