import React from "react";

function CookieBanner() {
    const [visible, setVisible] = React.useState(() => !localStorage.getItem("pardo_cookies_accepted"));
    
    const acceptAll = () => {
        localStorage.setItem("pardo_cookies_accepted", "all");
        localStorage.setItem("pardo_cookie_analytics", "true");
        localStorage.setItem("pardo_cookie_marketing", "true");
        setVisible(false);
    };
    
    const acceptEssential = () => {
        localStorage.setItem("pardo_cookies_accepted", "essential");
        localStorage.setItem("pardo_cookie_analytics", "false");
        localStorage.setItem("pardo_cookie_marketing", "false");
        setVisible(false);
    };
    
    if (!visible) return null;
    
    return (
        <div style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            zIndex: 5000,
            maxWidth: "500px",
            width: "90%",
            animation: "slideIn 0.5s"
        }}>
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <span style={{ fontSize: "40px" }}>🍪</span>
                <h3 style={{ margin: "10px 0" }}>Usamos cookies</h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
                    Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar el contenido.
                </p>
            </div>
            
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={acceptAll} style={{
                    padding: "12px 25px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px"
                }}>✅ Aceptar todas</button>
                
                <button onClick={acceptEssential} style={{
                    padding: "12px 25px",
                    background: "transparent",
                    color: "#667eea",
                    border: "2px solid #667eea",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px"
                }}>Solo esenciales</button>
            </div>
            
            <p style={{ textAlign: "center", marginTop: "15px", fontSize: "11px", color: "#999" }}>
                Al continuar aceptas nuestra <a href="/privacidad" style={{ color: "#667eea" }}>Política de Privacidad</a> y <a href="/terminos" style={{ color: "#667eea" }}>Términos de uso</a>
            </p>
        </div>
    );
}

export default CookieBanner;
