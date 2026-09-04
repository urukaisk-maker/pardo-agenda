const express = require("express");
const router = express.Router();

// GET /api/tasks
router.get("/", (req, res) => {
    res.json({ message: "Lista de tareas", tasks: [] });
});

// POST /api/tasks
router.post("/", (req, res) => {
    const { title, description, category_id, due_date } = req.body;
    res.status(201).json({ 
        message: "Tarea creada", 
        task: { title, description, category_id, due_date } 
    });
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
    res.json({ message: "Tarea encontrada", id: req.params.id });
});

// PUT /api/tasks/:id
router.put("/:id", (req, res) => {
    res.json({ message: "Tarea actualizada", id: req.params.id });
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
    res.json({ message: "Tarea eliminada", id: req.params.id });
});

module.exports = router;
