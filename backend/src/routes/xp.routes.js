const express = require("express");
const router = express.Router();

// Sistema de niveles
const levels = [
    { level: 1, name: "Cachorro", minXP: 0 },
    { level: 2, name: "Aprendiz", minXP: 100 },
    { level: 3, name: "Compañero", minXP: 250 },
    { level: 4, name: "Guardián", minXP: 500 },
    { level: 5, name: "Héroe", minXP: 1000 },
    { level: 6, name: "Maestro", minXP: 2000 },
    { level: 7, name: "Sabio", minXP: 3500 },
    { level: 8, name: "Campeón", minXP: 5000 },
    { level: 9, name: "Élite", minXP: 7500 },
    { level: 10, name: "Leyenda", minXP: 10000 }
];

// Función para calcular nivel basado en XP
function getLevelFromXP(xp) {
    let currentLevel = levels[0];
    for (let i = 0; i < levels.length; i++) {
        if (xp >= levels[i].minXP) {
            currentLevel = levels[i];
        }
    }
    const nextLevel = levels.find(l => l.level === currentLevel.level + 1);
    return {
        ...currentLevel,
        nextLevel: nextLevel ? nextLevel.minXP : null,
        progress: nextLevel ? Math.round(((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100) : 100
    };
}

// Estado global de XP (en producción usar base de datos)
let userXP = 0;
let totalTasksCompleted = 0;

// GET /api/xp/level - Obtener nivel actual
router.get("/level", (req, res) => {
    const levelInfo = getLevelFromXP(userXP);
    res.json({
        xp: userXP,
        totalTasksCompleted: totalTasksCompleted,
        ...levelInfo
    });
});

// POST /api/xp/earn - Ganar XP
router.post("/earn", (req, res) => {
    const { taskId, xp = 10, category } = req.body;
    
    const bonusXP = category ? 5 : 0;
    const totalXP = xp + bonusXP;
    userXP += totalXP;
    totalTasksCompleted += 1;
    
    const oldLevel = getLevelFromXP(userXP - totalXP);
    const newLevel = getLevelFromXP(userXP);
    const leveledUp = oldLevel.level !== newLevel.level;
    
    res.json({
        message: leveledUp ? "🎉 ¡Subiste de nivel!" : `¡${totalXP} XP ganados!`,
        xpEarned: totalXP,
        totalXP: userXP,
        leveledUp: leveledUp,
        level: newLevel
    });
});

// POST /api/xp/reset - Reiniciar XP
router.post("/reset", (req, res) => {
    userXP = 0;
    totalTasksCompleted = 0;
    res.json({ message: "Progreso reiniciado", xp: 0 });
});

// GET /api/xp/achievements - Logros desbloqueados
router.get("/achievements", (req, res) => {
    const achievements = [
        { id: 1, name: "Primer Paso", description: "Completa tu primera tarea", icon: "🎯", unlocked: totalTasksCompleted >= 1 },
        { id: 2, name: "En Camino", description: "Completa 10 tareas", icon: "📈", unlocked: totalTasksCompleted >= 10 },
        { id: 3, name: "Productivo", description: "Completa 25 tareas", icon: "⚡", unlocked: totalTasksCompleted >= 25 },
        { id: 4, name: "Imparable", description: "Completa 50 tareas", icon: "💪", unlocked: totalTasksCompleted >= 50 },
        { id: 5, name: "Leyenda", description: "Completa 100 tareas", icon: "🌟", unlocked: totalTasksCompleted >= 100 },
        { id: 6, name: "Nivel 5", description: "Alcanza el nivel 5", icon: "🏆", unlocked: userXP >= 1000 },
        { id: 7, name: "Nivel 10", description: "Alcanza el nivel 10", icon: "👑", unlocked: userXP >= 10000 }
    ];
    res.json({ achievements });
});

module.exports = router;
