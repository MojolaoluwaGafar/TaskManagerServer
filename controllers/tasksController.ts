import { Request, Response } from "express";
import * as TaskModel from "../models/taskModel";

interface TaskRequest extends Request {
  userId?: number;
  body: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    completed?: boolean;
  };
}

// GET /api/tasks
export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.getAllTasks();
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/tasks
export const addTask = async (req: TaskRequest, res: Response) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const userId = Number(req.userId);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const task = await TaskModel.createTask(userId,title, description, priority, dueDate);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/tasks/:id
export const updateTask = async (req: TaskRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid task ID" });

    const { completed, title, description, priority, dueDate } = req.body;
    const task = await TaskModel.updateTask(id, completed, title, description, priority, dueDate);

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/tasks/:id
export const removeTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid task ID" });

    const success = await TaskModel.deleteTask(id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tasks/search?q=...
export const searchTasks = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";
    if (!q.trim()) return res.json([]);

    const tasks = await TaskModel.searchTasks(q);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tasks/:id
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid task ID" });

    const task = await TaskModel.getTaskById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
