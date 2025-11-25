const express = require("express");
const { signUp, signIn, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
