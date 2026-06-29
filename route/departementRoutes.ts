// Définit la route HTTP GET pour lister les départements
import express from "express";
import * as departementController from "../controller/departementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireManager } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", requireManager, departementController.getAllDepartements);

export default router;
