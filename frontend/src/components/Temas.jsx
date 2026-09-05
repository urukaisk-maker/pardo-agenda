import React from "react";

function Temas({ darkMode }) {
    const [theme, setTheme] = React.useState(() => localStorage.getItem("pardo_theme") || "morado");
    
    const themes = [
        { id: "morado", name: "Morado", color1: "#667eea", color2: "#764ba2", icon: "💜" },
        { id: "verde", name: "Verde", color1: "#4CAF50", color2: "#2E7D32", icon: "💚" },
        { id: "azul", name: "Azul", color1: "#2196F3", color2: "#0D47A1", icon: "💙" },
        { id: "rojo", name: "Rojo", color1: "#f44336", color2: "#B71C1C", icon: "❤️" },
        { id: "naranja", name: "Naranja", color1: "#FF9800", color2: "#E65100", icon: "🧡" },
        { id: "rosa", name: "Rosa", color1: "#E91E63", color2: "#880E4F", icon: "💗" }
    ];
    
    const selectTheme = (id) => {
        setTheme(id);
        localStorage.setItem("pardo_theme", id);
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", color: darkMode ? "#fff" : "#333" }}>🎨 Temas</h2>
            <p style={{ textAlign: "center", color: darkMode ? "#aaa" : "#666" }}>Selecciona tu tema favorito</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px", marginTop: "20px" }}>
                {themes.map(t => (
                    <div key={t.id} onClick={() => selectTheme(t.id)} style={{
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: theme === t.id ? "linear-gradient(135deg, " + t.color1 + ", " + t.color2 + ")" : (darkMode ? "#222" : "#fff"),
                        border: theme === t.id ? "none" : "1px solid #ddd",
                        color: theme === t.id ? "#fff" : (darkMode ? "#fff" : "#333")
                    }}>
                        <div style={{ fontSize: "30px" }}>{t.icon}</div>
                        <div style={{ fontSize: "14px", fontWeight: "bold", marginTop: "8px" }}>{t.name}</div>
                        {theme === t.id && <div style={{ fontSize: "11px", marginTop: "5px" }}>✓ Activo</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Temas;
