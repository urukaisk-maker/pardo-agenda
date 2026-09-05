const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "pardo_secret_key_2024";

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "No autorizado" });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}

module.exports = { authenticateToken };
