const pool = require("../db");
const bcrypt = require("bcrypt");

const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  return res.rows[0];
};

const findUserById = async (id) => {
  const res = await pool.query("SELECT id, name, email, created_at FROM users WHERE id=$1", [id]);
  return res.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
