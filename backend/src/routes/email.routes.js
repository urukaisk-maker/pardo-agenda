const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || "urukaisk@gmail.com",
        pass: process.env.SMTP_PASS || ""
    }
});

// POST /api/email/welcome
router.post("/welcome", async (req, res) => {
    const { email, username } = req.body;
    try {
        await transporter.sendMail({
            from: "Pardo Agenda <urukaisk@gmail.com>",
            to: email,
            subject: "🐕 ¡Bienvenido a Pardo Agenda!",
            html: `
                <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #667eea;">🐕 ¡Hola ${username}!</h1>
                    <p>Bienvenido a Pardo Agenda. Tu mascota virtual te ayudará a organizarte.</p>
                    <p>Empieza creando tus primeras tareas, hábitos y notas.</p>
                    <a href="http://localhost:3000" style="background: #667eea; color: #fff; padding: 12px 25px; border-radius: 25px; text-decoration: none;">Ir a mi agenda</a>
                </div>
            `
        });
        res.json({ message: "Email de bienvenida enviado" });
    } catch (err) {
        res.status(500).json({ error: "Error al enviar email" });
    }
});

// POST /api/email/daily-summary
router.post("/daily-summary", async (req, res) => {
    const { email, username, tasksCount, habitsPending } = req.body;
    try {
        await transporter.sendMail({
            from: "Pardo Agenda <urukaisk@gmail.com>",
            to: email,
            subject: "📊 Tu resumen diario de Pardo Agenda",
            html: `
                <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2>📊 Resumen de ${username}</h2>
                    <p>Tareas hoy: ${tasksCount}</p>
                    <p>Hábitos pendientes: ${habitsPending}</p>
                    <p>¡Sigue así! 🐕</p>
                </div>
            `
        });
        res.json({ message: "Resumen enviado" });
    } catch (err) {
        res.status(500).json({ error: "Error al enviar" });
    }
});

module.exports = router;
