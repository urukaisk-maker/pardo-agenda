const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const tasksRoutes = require("./routes/tasks.routes");
const categoriesRoutes = require("./routes/categories.routes");
const pardoRoutes = require("./routes/pardo.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/tasks", tasksRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/pardo", pardoRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        service: "Pardo Agenda API",
        timestamp: new Date().toISOString(),
        pardo: "🐕"
    });
});

// Welcome route
app.get("/", (req, res) => {
    res.json({
        message: "🐕 Pardo Agenda API",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            tasks: "/api/tasks",
            categories: "/api/categories",
            pardo: "/api/pardo"
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log("🐕 Pardo API running on port " + PORT);
});
