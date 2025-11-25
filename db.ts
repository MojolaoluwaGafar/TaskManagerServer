import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
      }
);

export const query = (text: string, params?: any[]) => pool.query(text, params);

pool.query("SELECT NOW()")
  .then(res => console.log("🔥 PostgreSQL connected successfully at", res.rows[0].now))
  .catch(err => console.error("❌ Database connection error:", err));

export default pool;