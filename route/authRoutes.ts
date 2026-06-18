// Route publique de connexion (pas de requireAuth)
import express from "express";
import * as authController from "../controller/authController.js";

const router = express.Router();

router.post("/login", authController.login);

export default router;
