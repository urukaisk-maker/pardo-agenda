const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/diary
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM diary_entries WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json({ entries: result.rows });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener diario" });
    }
});

// POST /api/diary
router.post("/", authenticateToken, async (req, res) => {
    const { title, content, mood } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO diary_entries (user_id, title, content, mood) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, title, content, mood]
        );
        res.status(201).json({ entry: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al crear entrada" });
    }
});

// DELETE /api/diary/:id
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM diary_entries WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: "Entrada eliminada" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

module.exports = router;
