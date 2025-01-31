import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes";
import buyerRoutes from "./routes/buyerRoutes";
import ticketRoutes from "./routes/ticketRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes); // ✅ Make sure this is present
app.use("/api/buyers", buyerRoutes);
app.use("/api/tickets", ticketRoutes); // Register ticket routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
