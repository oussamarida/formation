import express from "express";
import * as agentController from "../controller/agentController.js";

const router = express.Router();

router.get("/", agentController.getAllAgents);
router.get("/:id/conges", agentController.getCongesById);
router.get("/:id", agentController.getAgentById);
router.post("/", agentController.createAgent);
router.put("/:id", agentController.updateAgent);
router.delete("/:id", agentController.deleteAgent);

export default router;
