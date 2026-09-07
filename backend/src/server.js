const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// ==================== MIDDLEWARES ====================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["*"],
            scriptSrc: ["*", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["*", "'unsafe-inline'"],
            imgSrc: ["*", "data:", "blob:"]
        }
    }
}));
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "100kb" }));

// ==================== INICIALIZAR TABLAS ====================
async function initDB() {
    try {
        await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS tasks (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(200) NOT NULL,
                due_date DATE,
                completed BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS notes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                text TEXT,
                color VARCHAR(7),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS diary_entries (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(200),
                content TEXT,
                mood VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS habits (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(100),
                icon VARCHAR(10),
                days JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS wishes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                text VARCHAR(200),
                category VARCHAR(20),
                done BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Tablas listas");
    } catch (err) {
        console.error("Error initDB:", err.message);
    }
}
initDB();

// ==================== AUTH ROUTES ====================
app.post("/api/auth/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Todos los campos requeridos" });
    if (password.length < 6) return res.status(400).json({ error: "Contraseña muy corta" });
    try {
        const existing = await pool.query("SELECT id FROM users WHERE email = $1 OR username = $2", [email, username]);
        if (existing.rows.length > 0) return res.status(400).json({ error: "Usuario o email ya existe" });
        const hashed = bcrypt.hashSync(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashed]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "pardo_secret_key_2024", { expiresIn: "7d" });
        res.status(201).json({ message: "Registrado", token, user });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Error interno: " + err.message });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email y contraseña requeridos" });
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: "Credenciales inválidas" });
        const user = result.rows[0];
        let valid = false;
        if (user.password_hash.startsWith("$2a$") || user.password_hash.startsWith("$2b$")) {
            valid = bcrypt.compareSync(password, user.password_hash);
        } else if (email === "admin@pardo.com" && password === "admin123") {
            valid = true;
            const newHash = bcrypt.hashSync(password, 10);
            await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, user.id]);
        }
        if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "pardo_secret_key_2024", { expiresIn: "7d" });
        res.json({ message: "Login exitoso", token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Error interno: " + err.message });
    }
});

app.get("/api/auth/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "pardo_secret_key_2024");
        const result = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [decoded.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ user: result.rows[0] });
    } catch (err) {
        res.status(401).json({ error: "Token inválido" });
    }
});

// ==================== ADMIN MIDDLEWARE ====================
function isAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "pardo_secret_key_2024");
        if (decoded.email !== "admin@pardo.com") {
            return res.status(403).json({ error: "Requiere permisos de administrador" });
        }
        req.userEmail = decoded.email;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
}

// ==================== ADMIN ROUTES ====================
app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, email, created_at FROM users ORDER BY created_at DESC");
        res.json({ users: result.rows });
    } catch (err) {
        console.error("Admin users error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    const userId = req.params.id;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM tasks WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM notes WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM diary_entries WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM habits WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM wishes WHERE user_id = $1", [userId]);
        await client.query("DELETE FROM users WHERE id = $1", [userId]);
        await client.query("COMMIT");
        res.json({ message: "Usuario eliminado" });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Delete user error:", err);
        res.status(500).json({ error: "Error al eliminar: " + err.message });
    } finally {
        client.release();
    }
});

// ==================== HEALTH ====================
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "Pardo Agenda API", pardo: "🐕" });
});

app.get("/", (req, res) => {
    res.json({ message: "🐕 Pardo Agenda API" });
});


app.get("/api/admin/stats", isAdmin, async (req, res) => {
    try {
        const users = await pool.query("SELECT COUNT(*) FROM users");
        const tasks = await pool.query("SELECT COUNT(*) FROM tasks");
        const notes = await pool.query("SELECT COUNT(*) FROM notes");
        const diary = await pool.query("SELECT COUNT(*) FROM diary_entries");
        const habits = await pool.query("SELECT COUNT(*) FROM habits");
        const wishes = await pool.query("SELECT COUNT(*) FROM wishes");
        res.json({
            users: parseInt(users.rows[0].count),
            tasks: parseInt(tasks.rows[0].count),
            notes: parseInt(notes.rows[0].count),
            diary: parseInt(diary.rows[0].count),
            habits: parseInt(habits.rows[0].count),
            wishes: parseInt(wishes.rows[0].count)
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log("🐕 Pardo API running on port " + PORT);
});
