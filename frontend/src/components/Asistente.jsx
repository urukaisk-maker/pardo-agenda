import React from "react";

function Asistente({ darkMode }) {
    const [sugerencias, setSugerencias] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    
    const generarSugerencias = () => {
        setLoading(true);
        setTimeout(() => {
            const sugerenciasBase = [
                "📅 Planifica tu día con 3 tareas prioritarias",
                "💧 Bebe 2 litros de agua hoy",
                "📔 Escribe en tu diario sobre tu día",
                "✅ Completa al menos 3 hábitos",
                "🎯 Revisa tus metas semanales",
                "📝 Toma notas de tus ideas",
                "🧘 Dedica 10 minutos a meditar",
                "📚 Lee 20 páginas de un libro",
                "🏃 Haz 30 minutos de ejercicio",
                "😴 Duerme 8 horas esta noche"
            ];
            const random = sugerenciasBase.sort(() => Math.random() - 0.5).slice(0, 5);
            setSugerencias(random);
            setLoading(false);
        }, 1000);
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", color: darkMode ? "#fff" : "#333" }}>🤖 Asistente Pardo</h2>
            <p style={{ textAlign: "center", color: darkMode ? "#aaa" : "#666" }}>Sugerencias inteligentes para tu día</p>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={generarSugerencias} style={{ padding: "15px 30px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontWeight: "bold" }}>
                    {loading ? "🤔 Pensando..." : "✨ Generar sugerencias"}
                </button>
            </div>
            {sugerencias.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    {sugerencias.map((s, i) => (
                        <div key={i} style={{ background: darkMode ? "#222" : "#fff", padding: "15px", borderRadius: "10px", marginBottom: "8px", fontSize: "14px", color: darkMode ? "#fff" : "#333" }}>
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Asistente;
