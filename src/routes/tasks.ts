const express = require("express");
const {
  getTasks,
  addTask,
  updateTask,
  removeTask,
  searchTasks,
  getTaskById 
} = require("../controllers/tasksController");

const router = express.Router();

router.get("/search", searchTasks);
router.get("/", getTasks);
router.post("/", addTask);
router.get("/:id", getTaskById); 
router.patch("/:id", updateTask);
router.delete("/:id", removeTask);

module.exports = router;
