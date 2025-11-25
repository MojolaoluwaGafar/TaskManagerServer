const pool = require("../db");
const { createUser, findUserByEmail, findUserById } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    

    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const user = await createUser(name, email, password);
    console.log(user);
    

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signUp,
  signIn,
  getProfile,
};
