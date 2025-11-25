import express from "express";
import {
  getTasks,
  addTask,
  updateTask,
  removeTask,
  searchTasks,
  getTaskById,
} from "../controllers/tasksController";
import authMiddleware from "../Middleware/Auth";
const router = express.Router();

router.get("/search", searchTasks);
router.get("/", getTasks);
router.post("/",authMiddleware, addTask);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", removeTask);

export default router;
