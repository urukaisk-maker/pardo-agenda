const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "pardo_secret_key_2024";

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Todos los campos son requeridos" });
    if (password.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    try {
        const existing = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
        if (existing.rows.length > 0) return res.status(400).json({ error: "Email o usuario ya existe" });
        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ message: "Usuario registrado", token, user });
    } catch (err) {
        console.error("Error register:", err);
        res.status(500).json({ error: "Error al registrar" });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email y contraseña requeridos" });
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
        const valid = bcrypt.compareSync(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Login exitoso", token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error("Error login:", err);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const result = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [decoded.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ user: result.rows[0] });
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
});

module.exports = router;
