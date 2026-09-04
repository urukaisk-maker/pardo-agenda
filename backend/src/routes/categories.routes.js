const express = require("express");
const router = express.Router();

const defaultCategories = [
    { id: 1, name: "Trabajo y Profesional", icon: "💼" },
    { id: 2, name: "Educación y Aprendizaje", icon: "📚" },
    { id: 3, name: "Salud y Bienestar", icon: "💪" },
    { id: 4, name: "Hogar y Personal", icon: "🏠" },
    { id: 5, name: "Familia y Amigos", icon: "👨‍👩‍👧‍👦" },
    { id: 6, name: "Finanzas", icon: "💰" },
    { id: 7, name: "Metas y Proyectos", icon: "🎯" },
    { id: 8, name: "Alimentación", icon: "🍽️" },
    { id: 9, name: "Medio Ambiente", icon: "🌱" },
    { id: 10, name: "Creatividad y Ocio", icon: "🎨" }
];

// GET /api/categories
router.get("/", (req, res) => {
    res.json({ categories: defaultCategories });
});

// POST /api/categories
router.post("/", (req, res) => {
    const { name, icon, color } = req.body;
    res.status(201).json({ 
        message: "Categoría creada", 
        category: { name, icon, color } 
    });
});

module.exports = router;
