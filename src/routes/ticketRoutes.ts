import express from "express";
import {
  bookTicket,
  getTicketsByContact,
} from "../controllers/ticketController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/book", authenticateToken, bookTicket); // Protected route
router.get("/user/:contact", authenticateToken, getTicketsByContact); // Protected route

export default router;
