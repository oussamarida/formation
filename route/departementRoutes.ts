// Définit la route HTTP GET pour lister les départements
import express from "express";
import * as departementController from "../controller/departementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", departementController.getAllDepartements);

export default router;
