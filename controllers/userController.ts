import { Request, Response } from "express";
import { createUser, findUserByEmail, findUserById } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

interface AuthRequest extends Request {
  userId?: string;
  body: {
    name?: string;
    email?: string;
    password?: string;
  };
}

// Sign Up
export const signUp = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const user = await createUser(name, email, password);
    console.log(user)
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Sign In
export const signIn = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await findUserByEmail(email);
    if (!user || !user.password)
      return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
};

// Get Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

    const userIdNum = Number(req.userId);
    if (isNaN(userIdNum))
      return res.status(400).json({ error: "Invalid user ID" });

    const user = await findUserById(userIdNum);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
