import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use env variable

// ✅ Buyer Login API
export const loginBuyer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    // Find buyer by email
    const buyer = await prisma.buyer.findUnique({ where: { email } });

    if (!buyer) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    // Compare hashed passwords
    if (!buyer.password) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, buyer.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: buyer.id, email: buyer.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in", error: (error as Error).message });
  }
};

// ✅ Create Buyer (Register)
export const createBuyer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const existingBuyer = await prisma.buyer.findUnique({ where: { email } });

    if (existingBuyer) {
      res
        .status(400)
        .json({ message: "Buyer with this email already exists." });
      return;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const buyer = await prisma.buyer.create({
      data: { email, phone, password: hashedPassword },
    });

    res.status(201).json({ message: "Buyer created successfully", buyer });
  } catch (error) {
    res.status(500).json({
      message: "Error creating buyer",
      error: (error as Error).message,
    });
  }
};
