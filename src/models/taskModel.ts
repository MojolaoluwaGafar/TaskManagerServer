const pool = require("../db");

const createTask = async (title, description, priority, dueDate) => {
  const res = await pool.query(
    `INSERT INTO tasks (title, completed, description, priority, due_date)
     VALUES ($1, false, $2, $3, $4)
     RETURNING *`,
    [title, description, priority, dueDate]
  );
  return res.rows[0];
};

const getAllTasks = async () => {
  const res = await pool.query("SELECT * FROM tasks ORDER BY created_at DESC");
  return res.rows;
};

const searchTasks = async (query) => {
  const res = await pool.query(
    "SELECT * FROM tasks WHERE LOWER(title) LIKE LOWER($1) ORDER BY created_at DESC",
    [`%${query}%`]
  );
  return res.rows;
};


const updateTask = async (id, completed, title, description, priority, dueDate) => {
  const existing = await pool.query("SELECT * FROM tasks WHERE id=$1", [id]);
  if (existing.rows.length === 0) return null;

  const task = existing.rows[0];

  const updated = await pool.query(
    `UPDATE tasks 
     SET title=$1, completed=$2, description=$3, priority=$4, due_date=$5
     WHERE id=$6
     RETURNING *`,
    [
      title ?? task.title,
      completed ?? task.completed,
      description ?? task.description,
      priority ?? task.priority,
      dueDate ?? task.due_date,
      id
    ]
  );

  return updated.rows[0];
};

const deleteTask = async (id) => {
  const res = await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
  return res.rowCount > 0;
};

const getTaskById = async (id) => {
  const res = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
  return res.rows[0];
};


module.exports = {
  getAllTasks,
  searchTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,  
};
