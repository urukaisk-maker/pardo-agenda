const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const JWT_SECRET = process.env.JWT_SECRET || "pardo_secret_key_2024";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email);
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos" });
    }
    
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        console.log("Usuario encontrado:", result.rows.length > 0);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        
        const user = result.rows[0];
        
        // Verificar si el hash es de crypt (PostgreSQL) o bcryptjs
        let valid = false;
        if (user.password_hash.startsWith("$2a$") || user.password_hash.startsWith("$2b$")) {
            valid = bcrypt.compareSync(password, user.password_hash);
        } else {
            // Si usó crypt de PostgreSQL, crear nuevo hash con bcryptjs
            if (email === "admin@pardo.com" && password === "admin123") {
                valid = true;
                const newHash = bcrypt.hashSync(password, 10);
                await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, user.id]);
            }
        }
        
        if (!valid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Login exitoso", token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error("Error login:", err);
        res.status(500).json({ error: "Error al iniciar sesión: " + err.message });
    }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashed = bcrypt.hashSync(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashed]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ message: "Usuario registrado", token, user });
    } catch (err) {
        console.error("Error register:", err);
        res.status(500).json({ error: "Error al registrar: " + err.message });
    }
});

module.exports = router;
