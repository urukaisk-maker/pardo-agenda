const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "pardo_secret_key_2024");
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token inválido" });
    }
}

// ============ TASKS ============
router.get("/tasks", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
            [req.userId]
        );
        res.json({ tasks: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/tasks", authenticate, async (req, res) => {
    const { title, due_date, completed } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO tasks (user_id, title, due_date, completed) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.userId, title, due_date, completed || false]
        );
        res.status(201).json({ task: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/tasks/:id", authenticate, async (req, res) => {
    const { title, due_date, completed } = req.body;
    try {
        const result = await pool.query(
            "UPDATE tasks SET title = $1, due_date = $2, completed = $3, updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *",
            [title, due_date, completed, req.params.id, req.userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Tarea no encontrada" });
        res.json({ task: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/tasks/:id", authenticate, async (req, res) => {
    try {
        await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
        res.json({ message: "Tarea eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ NOTES ============
router.get("/notes", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
            [req.userId]
        );
        res.json({ notes: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/notes", authenticate, async (req, res) => {
    const { text, color } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO notes (user_id, text, color) VALUES ($1, $2, $3) RETURNING *",
            [req.userId, text, color || "#FFF9C4"]
        );
        res.status(201).json({ note: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/notes/:id", authenticate, async (req, res) => {
    try {
        await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
        res.json({ message: "Nota eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ DIARY ============
router.get("/diary", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM diary_entries WHERE user_id = $1 ORDER BY created_at DESC",
            [req.userId]
        );
        res.json({ entries: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/diary", authenticate, async (req, res) => {
    const { title, content, mood } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO diary_entries (user_id, title, content, mood) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.userId, title, content, mood]
        );
        res.status(201).json({ entry: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/diary/:id", authenticate, async (req, res) => {
    try {
        await pool.query("DELETE FROM diary_entries WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
        res.json({ message: "Entrada eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ HABITS ============
router.get("/habits", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at",
            [req.userId]
        );
        res.json({ habits: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/habits", authenticate, async (req, res) => {
    const { name, icon, days } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO habits (user_id, name, icon, days) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.userId, name, icon || "⭐", JSON.stringify(days || [false,false,false,false,false,false,false])]
        );
        res.status(201).json({ habit: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/habits/:id", authenticate, async (req, res) => {
    const { days } = req.body;
    try {
        const result = await pool.query(
            "UPDATE habits SET days = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *",
            [JSON.stringify(days), req.params.id, req.userId]
        );
        res.json({ habit: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/habits/:id", authenticate, async (req, res) => {
    try {
        await pool.query("DELETE FROM habits WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
        res.json({ message: "Hábito eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ WISHES ============
router.get("/wishes", authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM wishes WHERE user_id = $1 ORDER BY created_at DESC",
            [req.userId]
        );
        res.json({ wishes: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/wishes", authenticate, async (req, res) => {
    const { text, category, done } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO wishes (user_id, text, category, done) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.userId, text, category || "🌟", done || false]
        );
        res.status(201).json({ wish: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/wishes/:id", authenticate, async (req, res) => {
    const { done } = req.body;
    try {
        const result = await pool.query(
            "UPDATE wishes SET done = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *",
            [done, req.params.id, req.userId]
        );
        res.json({ wish: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/wishes/:id", authenticate, async (req, res) => {
    try {
        await pool.query("DELETE FROM wishes WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
        res.json({ message: "Deseo eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
