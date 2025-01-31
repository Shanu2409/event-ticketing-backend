import express from "express";
import {
  addEvent,
  updateEvent,
  cancelEvent,
} from "../controllers/eventController";
import { authenticateToken } from "../middleware/authMiddleware";
import { getEvents } from "../controllers/eventController";
import { getEventById } from "../controllers/eventController";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", authenticateToken, getEventById); // Protected route
router.post("/", authenticateToken, addEvent); // Protected route
router.put("/:id", authenticateToken, updateEvent); // Protected route
router.delete("/:id", authenticateToken, cancelEvent); // Protected route

export default router;
