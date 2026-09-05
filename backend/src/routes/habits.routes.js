const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/habits
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at",
            [req.user.id]
        );
        res.json({ habits: result.rows });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener hábitos" });
    }
});

// POST /api/habits
router.post("/", authenticateToken, async (req, res) => {
    const { name, icon } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO habits (user_id, name, icon) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, name, icon]
        );
        res.status(201).json({ habit: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al crear hábito" });
    }
});

// PUT /api/habits/:id - Actualizar días
router.put("/:id", authenticateToken, async (req, res) => {
    const { days } = req.body;
    try {
        const result = await pool.query(
            "UPDATE habits SET days = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *",
            [JSON.stringify(days), req.params.id, req.user.id]
        );
        res.json({ habit: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar" });
    }
});

// DELETE /api/habits/:id
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM habits WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: "Hábito eliminado" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

module.exports = router;
