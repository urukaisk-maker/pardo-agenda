import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    const [showOwner, setShowOwner] = React.useState(false);
    return (
        <footer style={{ background: "#000000", color: "#ffffff", padding: "30px 20px 10px", marginTop: "40px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
                <button onClick={() => setShowOwner(true)} style={{ padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontSize: "13px", marginBottom: "15px" }}>👤 Propietario</button>
                
                <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", marginBottom: "15px", fontSize: "12px" }}>
                    <a href="https://unique-biscochitos-31bcea.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none" }}>🌐 Manuel Casimiro</a>
                    <a href="https://thriving-otter-cc1e25.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none" }}>💻 Urukais KLick</a>
                    <a href="https://rad-dolphin-182dfb.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", textDecoration: "none" }}>✨ Guardianes</a>
                </div>
                
                <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", marginBottom: "15px", fontSize: "11px" }}>
                    <a href="https://github.com/urukaisk-maker/pardo-agenda" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none", background: "#333", padding: "4px 10px", borderRadius: "15px" }}>📁 Repositorio del Proyecto</a>
                    <a href="https://pardo-agenda.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none", background: "#333", padding: "4px 10px", borderRadius: "15px" }}>🌐 Sitio en Producción</a>
                </div>
                
                <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", marginBottom: "15px", fontSize: "11px" }}>
                    <Link to="/privacidad" style={{ color: "#888", textDecoration: "none" }}>🔒 Privacidad</Link>
                    <Link to="/terminos" style={{ color: "#888", textDecoration: "none" }}>📄 Términos</Link>
                    <Link to="/cookies" style={{ color: "#888", textDecoration: "none" }}>🍪 Cookies</Link>
                </div>
                
                <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>© {new Date().getFullYear()} Pardo Agenda - Manuel Casimiro Carrasco - Reus, Tarragona (España)</p>
            </div>
            
            {showOwner && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: "20px" }} onClick={() => setShowOwner(false)}>
                    <div style={{ background: "#fff", padding: "30px", borderRadius: "20px", maxWidth: "450px", textAlign: "center", color: "#333" }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowOwner(false)} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
                        <div style={{ fontSize: "50px" }}>👨‍💻</div>
                        <h3 style={{ color: "#667eea" }}>Manuel Casimiro Carrasco</h3>
                        <p style={{ color: "#666", fontSize: "13px" }}>Desarrollador Web - Reus, Tarragona (España)</p>
                        <p style={{ fontSize: "13px", lineHeight: "1.7", textAlign: "left" }}>Es un desarrollador web con experiencia. Nuestra visión es tu visión y haremos que esa visión se convierta en realidad.</p>
                    </div>
                </div>
            )}
        </footer>
    );
}

export default Footer;
