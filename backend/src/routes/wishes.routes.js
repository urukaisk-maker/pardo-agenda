const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// GET /api/wishes
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM wishes WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json({ wishes: result.rows });
    } catch (err) {
        res.status(500).json({ error: "Error al obtener deseos" });
    }
});

// POST /api/wishes
router.post("/", authenticateToken, async (req, res) => {
    const { text, category } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO wishes (user_id, text, category) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, text, category]
        );
        res.status(201).json({ wish: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al crear deseo" });
    }
});

// PUT /api/wishes/:id - Marcar completado
router.put("/:id", authenticateToken, async (req, res) => {
    const { done } = req.body;
    try {
        const result = await pool.query(
            "UPDATE wishes SET done = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *",
            [done, req.params.id, req.user.id]
        );
        res.json({ wish: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar" });
    }
});

// DELETE /api/wishes/:id
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM wishes WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        res.json({ message: "Deseo eliminado" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

module.exports = router;
