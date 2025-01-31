import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// ✅ Extend Express Request to Include `user`
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // ✅ Attach decoded JWT payload to `req.user`

    next(); // ✅ Continue to the next middleware
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
