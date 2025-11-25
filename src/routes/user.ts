import express from "express";
import { signUp, signIn, getProfile } from "../controllers/userController";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile", authMiddleware, getProfile);

export default router;
