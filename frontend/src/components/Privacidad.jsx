import React from "react";

function Privacidad({ darkMode }) {
    const textColor = darkMode ? "#fff" : "#333";
    const sectionBg = darkMode ? "#222" : "#fff";
    
    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", color: textColor }}>🔒 Política de Privacidad</h2>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: "#667eea" }}>1. Responsable del tratamiento</h3>
                <p style={{ fontSize: "14px", color: textColor, lineHeight: "1.7" }}>
                    <strong>Manuel Casimiro Carrasco</strong><br />
                    Reus, Tarragona (España)<br />
                    Email: urukaisk@gmail.com
                </p>
            </div>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: "#667eea" }}>2. Datos que recopilamos</h3>
                <ul style={{ fontSize: "14px", color: textColor, lineHeight: "1.8" }}>
                    <li>Nombre de usuario y email (registro)</li>
                    <li>Tareas, notas, diario, hábitos (contenido del usuario)</li>
                    <li>Preferencias de configuración</li>
                    <li>Datos de uso (cookies analíticas)</li>
                </ul>
            </div>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: "#667eea" }}>3. Finalidad del tratamiento</h3>
                <ul style={{ fontSize: "14px", color: textColor, lineHeight: "1.8" }}>
                    <li>Proporcionar el servicio de agenda personal</li>
                    <li>Guardar y sincronizar datos del usuario</li>
                    <li>Mejorar la experiencia de usuario</li>
                    <li>Enviar notificaciones (si el usuario lo autoriza)</li>
                </ul>
            </div>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: "#667eea" }}>4. Derechos del usuario</h3>
                <p style={{ fontSize: "14px", color: textColor, lineHeight: "1.7" }}>
                    Según el RGPD (Reglamento General de Protección de Datos), tienes derecho a:
                </p>
                <ul style={{ fontSize: "14px", color: textColor, lineHeight: "1.8" }}>
                    <li>✅ Acceder a tus datos</li>
                    <li>✅ Rectificar datos incorrectos</li>
                    <li>✅ Solicitar la eliminación</li>
                    <li>✅ Oponerte al tratamiento</li>
                    <li>✅ Portabilidad de datos</li>
                    <li>✅ Retirar el consentimiento</li>
                </ul>
            </div>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: "#667eea" }}>5. Conservación de datos</h3>
                <p style={{ fontSize: "14px", color: textColor, lineHeight: "1.7" }}>
                    Los datos se conservan mientras la cuenta esté activa. Al eliminar la cuenta, se borran todos los datos asociados.
                </p>
            </div>
            
            <div style={{ background: sectionBg, padding: "25px", borderRadius: "15px" }}>
                <h3 style={{ color: "#667eea" }}>6. Seguridad</h3>
                <p style={{ fontSize: "14px", color: textColor, lineHeight: "1.7" }}>
                    Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos:
                </p>
                <ul style={{ fontSize: "14px", color: textColor, lineHeight: "1.8" }}>
                    <li>🔐 Cifrado en tránsito (HTTPS)</li>
                    <li>🔑 Autenticación segura (JWT)</li>
                    <li>🛡️ Protección contra accesos no autorizados</li>
                    <li>📤 Copias de seguridad regulares</li>
                </ul>
            </div>
        </div>
    );
}

export default Privacidad;
