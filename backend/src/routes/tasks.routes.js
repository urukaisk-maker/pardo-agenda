const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/tasks - Obtener todas las tareas del usuario
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date, due_time",
            [req.user.id]
        );
        res.json({ tasks: result.rows });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Error al obtener tareas" });
    }
});

// POST /api/tasks - Crear tarea
router.post("/", authenticateToken, async (req, res) => {
    const { title, dueDate, dueTime, category, priority } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO tasks (user_id, title, due_date, due_time, category, priority) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [req.user.id, title, dueDate, dueTime, category, priority]
        );
        res.status(201).json({ task: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al crear tarea" });
    }
});

// PUT /api/tasks/:id - Actualizar tarea
router.put("/:id", authenticateToken, async (req, res) => {
    const { title, dueDate, dueTime, category, priority, completed } = req.body;
    try {
        const result = await pool.query(
            "UPDATE tasks SET title = $1, due_date = $2, due_time = $3, category = $4, priority = $5, completed = $6, updated_at = NOW() WHERE id = $7 AND user_id = $8 RETURNING *",
            [title, dueDate, dueTime, category, priority, completed, req.params.id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Tarea no encontrada" });
        res.json({ task: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar tarea" });
    }
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: "Tarea eliminada" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar tarea" });
    }
});

module.exports = router;
