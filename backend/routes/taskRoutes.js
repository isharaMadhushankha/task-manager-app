const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskStats,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// All task routes require authentication
router.use(verifyToken);

// ── Dashboard Statistics Route (Must come before :id route) ────────────────────
router.get('/stats', getTaskStats);

// ── CRUD Routes ─────────────────────────────────────────────────────────────────
router.get('/', getTasks);            // GET /api/tasks (supports ?search= &status= &priority= &sort=)
router.post('/', createTask);          // POST /api/tasks
router.get('/:id', getTaskById);       // GET /api/tasks/:id
router.put('/:id', updateTask);        // PUT /api/tasks/:id
router.delete('/:id', deleteTask);     // DELETE /api/tasks/:id

module.exports = router;
