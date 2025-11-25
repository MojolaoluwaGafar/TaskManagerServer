const TaskModel = require("../models/taskModel");
const pool = require("../db");

const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = await TaskModel.createTask(title);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, title } = req.body;
    const task = await TaskModel.updateTask(id, completed, title);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await TaskModel.deleteTask(id);
    res.json({ success });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchTasks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const tasks = await TaskModel.searchTasks(q);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.getTaskById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getTasks,
  addTask,
  updateTask,
  removeTask,
  searchTasks,
  getTaskById
};
