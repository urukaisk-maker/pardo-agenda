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

// ============ RATE LIMITING ============
const rateLimit = new Map();
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutos
const MAX_REQUESTS = 100;

function rateLimiter(req, res, next) {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
    const now = Date.now();
    
    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
        return next();
    }
    
    const data = rateLimit.get(ip);
    if (now > data.resetAt) {
        data.count = 1;
        data.resetAt = now + RATE_WINDOW;
        return next();
    }
    
    if (data.count >= MAX_REQUESTS) {
        return res.status(429).json({ error: "Demasiadas solicitudes. Intenta más tarde." });
    }
    
    data.count++;
    next();
}

// ============ VALIDACIÓN DE INPUTS ============
function validateLogin(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email y contraseña requeridos" });
    if (typeof email !== "string" || typeof password !== "string") return res.status(400).json({ error: "Formato inválido" });
    if (email.length > 100) return res.status(400).json({ error: "Email demasiado largo" });
    if (password.length < 6 || password.length > 100) return res.status(400).json({ error: "Contraseña inválida" });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Email inválido" });
    next();
}

function validateRegister(req, res, next) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Todos los campos requeridos" });
    if (username.length < 2 || username.length > 50) return res.status(400).json({ error: "Usuario inválido" });
    if (password.length < 6) return res.status(400).json({ error: "Contraseña muy corta (mín 6)" });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Email inválido" });
    next();
}

const apiRoutes = require("./routes/api.routes");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["*"],
            scriptSrc: ["*", "unsafe-inline", "unsafe-eval"],
            styleSrc: ["*", "unsafe-inline"],
            imgSrc: ["*", "data:", "blob:"]
        }
    }
}));
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "100kb" }));
app.use("/api", apiRoutes);

// Login con rate limiting y validación
app.post("/api/auth/login", rateLimiter, validateLogin, async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
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
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Error interno" });
    }
});

// Register con validación
app.post("/api/auth/register", rateLimiter, validateRegister, async (req, res) => {
    const { username, email, password } = req.body;
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
        console.error("Register error:", err.message);
        res.status(500).json({ error: "Error interno" });
    }
});

app.get("/api/auth/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "pardo_secret_key_2024");
        const result = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [decoded.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "No encontrado" });
        res.json({ user: result.rows[0] });
    } catch (err) {
        res.status(401).json({ error: "Token inválido" });
    }
});

app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "Pardo Agenda API", pardo: "🐕" });
});


// ============ PUSH NOTIFICATIONS ============
const webpush = require("web-push");
let pushSubscriptions = [];

const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || "BEl62iM1j1tCqT7jDz4O7f4F4z0z9YJX6q0zB7zC7oJ5K6z5P5tK0V4nM5mZqN2w3w3f5D3t5j5i5v5n5",
    privateKey: process.env.VAPID_PRIVATE_KEY || "i5cT3Qm8z6jXxE5nR2wW7tY0pL1dK9sH4gU6vB3aQ1o"
};
webpush.setVapidDetails(
    "mailto:urukaisk@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.post("/api/push/subscribe", (req, res) => {
    const { subscription } = req.body;
    if (!subscription) return res.status(400).json({ error: "Suscripción requerida" });
    const existing = pushSubscriptions.find(s => s.endpoint === subscription.endpoint);
    if (!existing) pushSubscriptions.push(subscription);
    res.json({ message: "Suscripción guardada", count: pushSubscriptions.length });
});

app.post("/api/push/unsubscribe", (req, res) => {
    const { endpoint } = req.body;
    pushSubscriptions = pushSubscriptions.filter(s => s.endpoint !== endpoint);
    res.json({ message: "Suscripción eliminada", count: pushSubscriptions.length });
});

app.post("/api/push/send-test", async (req, res) => {
    if (pushSubscriptions.length === 0) return res.json({ message: "No hay suscripciones" });
    const payload = JSON.stringify({
        title: "🐕 Pardo Agenda",
        body: "¡Notificación de prueba!",
        url: "/"
    });
    try {
        await Promise.all(pushSubscriptions.map(sub => webpush.sendNotification(sub, payload)));
        res.json({ message: `Notificación enviada a ${pushSubscriptions.length} dispositivo(s)` });
    } catch (err) {
        console.error("Error enviando push:", err);
        res.status(500).json({ error: "Error al enviar notificación" });
    }
});

app.listen(PORT, () => {
    console.log("🐕 Pardo API running on port " + PORT);
});
