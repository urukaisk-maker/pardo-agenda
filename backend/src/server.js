const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes");
const notesRoutes = require("./routes/notes.routes");
const diaryRoutes = require("./routes/diary.routes");
const habitsRoutes = require("./routes/habits.routes");
const wishesRoutes = require("./routes/wishes.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar helmet SIN bloquear estilos inline
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["*"],
            scriptSrc: ["*", "unsafe-inline", "unsafe-eval"],
            styleSrc: ["*", "unsafe-inline"],
            imgSrc: ["*", "data:", "blob:"],
            connectSrc: ["*"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/habits", habitsRoutes);
app.use("/api/wishes", wishesRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "Pardo Agenda API", pardo: "🐕" });
});

app.get("/", (req, res) => {
    res.json({ message: "🐕 Pardo Agenda API", version: "1.0.0" });
});

app.listen(PORT, () => {
    console.log("🐕 Pardo API running on port " + PORT);
});
