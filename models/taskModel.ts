import pool from "../db";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
  priority?: string;
  due_date?: string;
  created_at?: string;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await pool.query("SELECT * FROM tasks ORDER BY created_at DESC");
  return res.rows;
};

export const createTask = async (
  title: string,
  description?: string,
  priority?: string,
  dueDate?: string
): Promise<Task> => {
  const res = await pool.query(
    `INSERT INTO tasks (title, completed, description, priority, due_date)
     VALUES ($1, false, $2, $3, $4)
     RETURNING *`,
    [title, description, priority, dueDate]
  );
  return res.rows[0];
};

export const updateTask = async (
  id: number,
  completed?: boolean,
  title?: string,
  description?: string,
  priority?: string,
  dueDate?: string
): Promise<Task | null> => {
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
      id,
    ]
  );

  return updated.rows[0];
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const res = await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
  return res.rowCount! > 0;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const res = await pool.query("SELECT * FROM tasks WHERE id=$1", [id]);
  return res.rows[0] || null;
};

export const searchTasks = async (query: string): Promise<Task[]> => {
  const res = await pool.query(
    "SELECT * FROM tasks WHERE LOWER(title) LIKE LOWER($1) ORDER BY created_at DESC",
    [`%${query}%`]
  );
  return res.rows;
};
