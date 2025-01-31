import express from "express";
import { createBuyer, loginBuyer } from "../controllers/buyerController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createBuyer); // Protected route
router.post("/login", loginBuyer); // Protected route

export default router;
