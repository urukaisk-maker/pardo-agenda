import React from "react";
import { Link } from "react-router-dom";

function RecuperarPassword({ darkMode }) {
    const [email, setEmail] = React.useState("");
    const [sent, setSent] = React.useState(false);
    const [error, setError] = React.useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) { setError("Introduce tu email"); return; }
        // Simular envío de email
        setSent(true);
        setError("");
    };
    
    if (sent) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px" }}>
                <div style={{ background: darkMode ? "#222" : "#fff", padding: "30px", borderRadius: "15px", textAlign: "center", maxWidth: "400px" }}>
                    <div style={{ fontSize: "50px" }}>📧</div>
                    <h2 style={{ color: darkMode ? "#fff" : "#333" }}>Revisa tu email</h2>
                    <p style={{ color: darkMode ? "#aaa" : "#666", fontSize: "14px" }}>
                        Hemos enviado un enlace de recuperación a <strong>{email}</strong>
                    </p>
                    <Link to="/login" style={{ display: "inline-block", marginTop: "15px", padding: "10px 20px", background: "#667eea", color: "#fff", textDecoration: "none", borderRadius: "5px" }}>Volver al login</Link>
                </div>
            </div>
        );
    }
    
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "20px" }}>
            <div style={{ background: "#fff", padding: "35px", borderRadius: "20px", maxWidth: "360px", width: "100%" }}>
                <h2 style={{ textAlign: "center", color: "#333" }}>🔑 Recuperar Contraseña</h2>
                <p style={{ textAlign: "center", color: "#666", fontSize: "13px" }}>Introduce tu email y te enviaremos un enlace</p>
                {error && <p style={{ color: "#f44336", textAlign: "center" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "5px" }} />
                    <button type="submit" style={{ width: "100%", padding: "12px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>📧 Enviar enlace</button>
                </form>
                <p style={{ textAlign: "center", marginTop: "15px", fontSize: "13px" }}><Link to="/login" style={{ color: "#667eea" }}>Volver al login</Link></p>
            </div>
        </div>
    );
}

export default RecuperarPassword;
