import pool from "../db";
import bcrypt from "bcrypt";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at?: string;
}

export const createUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  return res.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const res = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  return res.rows[0] || null;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const res = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id=$1",
    [id]
  );
  return res.rows[0] || null;
};
