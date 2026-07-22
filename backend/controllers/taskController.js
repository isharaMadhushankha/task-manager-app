const pool = require('../config/db');

// Helper function to check if a date is earlier than today (comparing YYYY-MM-DD)
const isDateBeforeToday = (dateString) => {
  const inputDate = new Date(dateString);
  inputDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate < today;
};

/**
 * POST /api/tasks
 * Create a new task
 */
const createTask = async (req, res) => {
  const { title, description, priority, status = 'Pending', due_date } = req.body;
  const userId = req.user.id;

  // Validation
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required');
  }

  if (!priority || !['Low', 'Medium', 'High'].includes(priority)) {
    errors.push('Priority is required and must be Low, Medium, or High');
  }

  if (!due_date) {
    errors.push('Due date is required');
  } else if (isNaN(Date.parse(due_date))) {
    errors.push('Invalid due date format');
  } else if (isDateBeforeToday(due_date)) {
    errors.push('Due date cannot be earlier than today');
  }

  if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    errors.push('Status must be Pending, In Progress, or Completed');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const query = `
      INSERT INTO tasks (user_id, title, description, priority, status, due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [userId, title.trim(), description || null, priority, status, due_date];
    const result = await pool.query(query, values);

    return res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating task:', err.message);
    return res.status(500).json({ error: 'Failed to create task' });
  }
};

/**
 * GET /api/tasks
 * Fetch tasks with search, filtering, and sorting
 */
const getTasks = async (req, res) => {
  const userId = req.user.id;
  const { search, status, priority, sort } = req.query;

  try {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const queryParams = [userId];
    let paramIndex = 2;

    // Search by title (case-insensitive)
    if (search && search.trim() !== '') {
      query += ` AND title ILIKE $${paramIndex}`;
      queryParams.push(`%${search.trim()}%`);
      paramIndex++;
    }

    // Filter by status
    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    // Filter by priority
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query += ` AND priority = $${paramIndex}`;
      queryParams.push(priority);
      paramIndex++;
    }

    // Sorting options
    if (sort === 'oldest') {
      query += ' ORDER BY created_at ASC';
    } else if (sort === 'due_date') {
      query += ' ORDER BY due_date ASC';
    } else {
      // Default: newest created
      query += ' ORDER BY created_at DESC';
    }

    const result = await pool.query(query, queryParams);

    return res.status(200).json({
      count: result.rows.length,
      tasks: result.rows,
    });
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

/**
 * GET /api/tasks/stats
 * Dashboard task statistics (Total, Pending, In Progress, Completed, Overdue)
 */
const getTaskStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const statsQuery = `
      SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'Completed') AS completed,
        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'Completed') AS overdue
      FROM tasks
      WHERE user_id = $1;
    `;

    const result = await pool.query(statsQuery, [userId]);
    const row = result.rows[0];

    return res.status(200).json({
      total: parseInt(row.total, 10) || 0,
      pending: parseInt(row.pending, 10) || 0,
      inProgress: parseInt(row.in_progress, 10) || 0,
      completed: parseInt(row.completed, 10) || 0,
      overdue: parseInt(row.overdue, 10) || 0,
    });
  } catch (err) {
    console.error('Error fetching task stats:', err.message);
    return res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

/**
 * GET /api/tasks/:id
 * Fetch single task by ID
 */
const getTaskById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ task: result.rows[0] });
  } catch (err) {
    console.error('Error fetching task by ID:', err.message);
    return res.status(500).json({ error: 'Failed to fetch task' });
  }
};

/**
 * PUT /api/tasks/:id
 * Update task by ID
 */
const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, priority, status, due_date } = req.body;

  // Validation
  const errors = [];

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    errors.push('Title cannot be empty');
  }

  if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority)) {
    errors.push('Priority must be Low, Medium, or High');
  }

  if (status !== undefined && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    errors.push('Status must be Pending, In Progress, or Completed');
  }

  if (due_date !== undefined) {
    if (isNaN(Date.parse(due_date))) {
      errors.push('Invalid due date format');
    } else if (isDateBeforeToday(due_date)) {
      errors.push('Due date cannot be earlier than today');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if task exists and belongs to user
    const existingTask = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const currentTask = existingTask.rows[0];

    const updatedTitle = title !== undefined ? title.trim() : currentTask.title;
    const updatedDescription = description !== undefined ? description : currentTask.description;
    const updatedPriority = priority !== undefined ? priority : currentTask.priority;
    const updatedStatus = status !== undefined ? status : currentTask.status;
    const updatedDueDate = due_date !== undefined ? due_date : currentTask.due_date;

    const updateQuery = `
      UPDATE tasks
      SET title = $1,
          description = $2,
          priority = $3,
          status = $4,
          due_date = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING *;
    `;

    const values = [
      updatedTitle,
      updatedDescription,
      updatedPriority,
      updatedStatus,
      updatedDueDate,
      id,
      userId,
    ];

    const result = await pool.query(updateQuery, values);

    return res.status(200).json({
      message: 'Task updated successfully',
      task: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating task:', err.message);
    return res.status(500).json({ error: 'Failed to update task' });
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete task by ID
 */
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ message: 'Task deleted successfully', id: parseInt(id, 10) });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskStats,
  getTaskById,
  updateTask,
  deleteTask,
};
