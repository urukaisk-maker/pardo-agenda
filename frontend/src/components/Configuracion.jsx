import React from "react";

function Configuracion() {
    const [settings, setSettings] = React.useState(() => JSON.parse(localStorage.getItem("pardo_settings") || "{}"));
    
    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem("pardo_settings", JSON.stringify(newSettings));
    };
    
    const toggle = (key) => {
        updateSetting(key, !settings[key]);
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>⚙️ Configuración</h2>
            
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🔊 Sonidos</span>
                <button onClick={() => toggle("sound")} style={{ width: "50px", height: "26px", borderRadius: "13px", background: settings.sound !== false ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer", position: "relative" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: settings.sound !== false ? "26px" : "2px", transition: "all 0.3s" }} /></button>
            </div>
            
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🔔 Notificaciones</span>
                <button onClick={() => toggle("notifications")} style={{ width: "50px", height: "26px", borderRadius: "13px", background: settings.notifications !== false ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer", position: "relative" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: settings.notifications !== false ? "26px" : "2px", transition: "all 0.3s" }} /></button>
            </div>
            
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🐕 Mostrar Pardo</span>
                <button onClick={() => toggle("showPardo")} style={{ width: "50px", height: "26px", borderRadius: "13px", background: settings.showPardo !== false ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer", position: "relative" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: settings.showPardo !== false ? "26px" : "2px", transition: "all 0.3s" }} /></button>
            </div>
            
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🌙 Modo oscuro</span>
                <button onClick={() => toggle("darkMode")} style={{ width: "50px", height: "26px", borderRadius: "13px", background: settings.darkMode ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer", position: "relative" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: settings.darkMode ? "26px" : "2px", transition: "all 0.3s" }} /></button>
            </div>
            
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px" }}>
                <span>🔤 Tamaño de letra</span>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                    {["pequeño", "mediano", "grande"].map(size => (
                        <button key={size} onClick={() => updateSetting("fontSize", size)} style={{ padding: "8px 15px", borderRadius: "20px", border: settings.fontSize === size ? "2px solid #667eea" : "1px solid #ddd", background: settings.fontSize === size ? "#667eea" : "#fff", color: settings.fontSize === size ? "#fff" : "#333", cursor: "pointer" }}>{size}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Configuracion;
