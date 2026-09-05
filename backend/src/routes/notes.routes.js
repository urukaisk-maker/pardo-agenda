const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/notes - Todas las notas del usuario
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json({ notes: result.rows });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener notas" });
    }
});

// POST /api/notes - Crear nota
router.post("/", authenticateToken, async (req, res) => {
    const { text, color, category } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO notes (user_id, text, color, category) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, text, color, category]
        );
        res.status(201).json({ note: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al crear nota" });
    }
});

// DELETE /api/notes/:id
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: "Nota eliminada" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar nota" });
    }
});

module.exports = router;
