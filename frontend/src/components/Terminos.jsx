import React from "react";

function Terminos({ darkMode }) {
    const textColor = darkMode ? "#fff" : "#333";
    const sectionBg = darkMode ? "#222" : "#fff";
    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", color: textColor }}>📄 Términos y Condiciones</h2>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: "#667eea" }}>1. Aceptación de los términos</h3>
                <p style={{ fontSize: "14px", color: textColor, lineHeight: "1.7" }}>
                    Al usar Pardo Agenda, aceptas estos términos y condiciones. Si no estás de acuerdo, no utilices la aplicación.
                </p>
            </div>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: "#667eea" }}>2. Uso del servicio</h3>
                <ul style={{ fontSize: "14px", color: textColor, lineHeight: "1.8" }}>
                    <li>Uso personal y no comercial</li>
                    <li>No realizar actividades ilegales</li>
                    <li>No intentar acceder a datos de otros usuarios</li>
                    <li>Responsabilidad sobre el contenido creado</li>
                </ul>
            </div>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: "#667eea" }}>3. Propiedad intelectual</h3>
                <p style={{ fontSize: "14px", color: textColor, lineHeight: "1.7" }}>
                    La aplicación, su código y diseño son propiedad de Manuel Casimiro Carrasco. El contenido creado por el usuario pertenece al usuario.
                </p>
            </div>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px" }}>
                <h3 style={{ color: "#667eea" }}>4. Limitación de responsabilidad</h3>
                <p style={{ fontSize: "14px", color: textColor, lineHeight: "1.7" }}>
                    Pardo Agenda se proporciona "tal cual". No garantizamos disponibilidad continua ni ausencia de errores.
                </p>
            </div>
        </div>
    );
}

export default Terminos;
