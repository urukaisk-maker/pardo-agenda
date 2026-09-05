const express = require("express");
const router = express.Router();

const accessories = [
    { id: 1, name: "Sombrero", icon: "🎩", price: 100, category: "hats" },
    { id: 2, name: "Gafas de Sol", icon: "🕶️", price: 150, category: "glasses" },
    { id: 3, name: "Collar Rojo", icon: "🔴", price: 200, category: "collars" },
    { id: 4, name: "Collar Azul", icon: "🔵", price: 200, category: "collars" },
    { id: 5, name: "Pelota", icon: "🎾", price: 50, category: "items" },
    { id: 6, name: "Hueso", icon: "🦴", price: 75, category: "items" },
    { id: 7, name: "Corona", icon: "👑", price: 500, category: "hats" },
    { id: 8, name: "Bufanda", icon: "🧣", price: 300, category: "clothes" }
];

// GET /api/accessories - Listar accesorios
router.get("/", (req, res) => {
    res.json({ accessories });
});

// GET /api/accessories/:id - Obtener accesorio específico
router.get("/:id", (req, res) => {
    const accessory = accessories.find(a => a.id === parseInt(req.params.id));
    if (accessory) {
        res.json({ accessory });
    } else {
        res.status(404).json({ error: "Accesorio no encontrado" });
    }
});

// POST /api/accessories/purchase - Comprar accesorio
router.post("/purchase", (req, res) => {
    const { accessoryId } = req.body;
    const accessory = accessories.find(a => a.id === accessoryId);
    if (accessory) {
        res.json({ 
            message: `¡Has comprado ${accessory.name}!`, 
            accessory: accessory,
            remainingXP: 1000 - accessory.price
        });
    } else {
        res.status(404).json({ error: "Accesorio no encontrado" });
    }
});

module.exports = router;
