// Définit la route HTTP GET pour lister les directions
import express from "express";
import * as directionController from "../controller/directionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", directionController.getAllDirections);

export default router;
