import express from "express";
import {
  getTasks,
  addTask,
  updateTask,
  removeTask,
  searchTasks,
  getTaskById,
} from "../controllers/tasksController";

const router = express.Router();

router.get("/search", searchTasks);
router.get("/", getTasks);
router.post("/", addTask);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", removeTask);

export default router;
