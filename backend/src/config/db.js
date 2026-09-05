const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://pardo:pardo2024@postgres:5432/pardodb",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.on("error", (err) => {
    console.error("Error en PostgreSQL:", err);
});

module.exports = pool;
