import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/tasks";
import userRoutes from "./routes/user";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
