// Définit la route HTTP GET pour lister les directions
import express from "express";
import * as directionController from "../controller/directionController.js";

const router = express.Router();

router.get("/", directionController.getAllDirections);

export default router;
