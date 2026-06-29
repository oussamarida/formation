// Routes auth : login public, /me protégé par token
import express from "express";
import * as authController from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);

export default router;
