const express = require("express");
const router = express.Router();

// GET /api/pardo/state
router.get("/state", (req, res) => {
    res.json({
        pardo: {
            name: "Pardo",
            happiness: 100,
            energy: 85,
            hunger: 30,
            level: 3,
            mood: "happy"
        }
    });
});

// POST /api/pardo/feed
router.post("/feed", (req, res) => {
    res.json({ message: "Pardo ha sido alimentado", happiness: 100, hunger: 0 });
});

// POST /api/pardo/play
router.post("/play", (req, res) => {
    res.json({ message: "Pardo está jugando", happiness: 100, energy: 70 });
});

module.exports = router;
