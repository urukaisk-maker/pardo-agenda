import React from "react";

function LogrosAvanzados({ darkMode }) {
    const [xp] = React.useState(() => parseInt(localStorage.getItem("pardo_xp") || "0"));
    const [achievements, setAchievements] = React.useState(() => JSON.parse(localStorage.getItem("pardo_achievements") || "[]"));
    
    const niveles = [
        { nivel: 1, nombre: "Cachorro", minXP: 0, icon: "🐣" },
        { nivel: 2, nombre: "Aprendiz", minXP: 50, icon: "🐕" },
        { nivel: 3, nombre: "Compañero", minXP: 100, icon: "🦊" },
        { nivel: 4, nombre: "Guardián", minXP: 200, icon: "🦁" },
        { nivel: 5, nombre: "Héroe", minXP: 350, icon: "🐉" },
        { nivel: 6, nombre: "Maestro", minXP: 500, icon: "🌟" },
        { nivel: 7, nombre: "Leyenda", minXP: 750, icon: "👑" }
    ];
    
    const nivelActual = niveles.filter(n => xp >= n.minXP).pop() || niveles[0];
    const siguienteNivel = niveles.find(n => n.minXP > xp);
    const progreso = siguienteNivel ? Math.round(((xp - nivelActual.minXP) / (siguienteNivel.minXP - nivelActual.minXP)) * 100) : 100;
    
    const allAchievements = [
        { id: "tarea1", icon: "🎯", nombre: "Primer Paso", desc: "Completa tu primera tarea", xp: 10 },
        { id: "tarea10", icon: "📋", nombre: "Productivo", desc: "Completa 10 tareas", xp: 50 },
        { id: "tarea50", icon: "💪", nombre: "Imparable", desc: "Completa 50 tareas", xp: 200 },
        { id: "diario1", icon: "📔", nombre: "Escritor", desc: "Primera entrada de diario", xp: 15 },
        { id: "diario30", icon: "✍️", nombre: "Autor", desc: "30 días escribiendo", xp: 300 },
        { id: "habito1", icon: "✅", nombre: "Creador", desc: "Crea tu primer hábito", xp: 10 },
        { id: "habito7", icon: "🔥", nombre: "Constante", desc: "7 días de racha", xp: 100 },
        { id: "nota1", icon: "📝", nombre: "Notero", desc: "Primera nota", xp: 5 },
        { id: "deseo1", icon: "⭐", nombre: "Soñador", desc: "Primer deseo", xp: 5 },
        { id: "explorador", icon: "🧭", nombre: "Explorador", desc: "Usa 5 secciones", xp: 50 },
        { id: "nivel5", icon: "🌟", nombre: "Nivel 5", desc: "Alcanza 350 XP", xp: 0 },
        { id: "nivel7", icon: "👑", nombre: "Leyenda", desc: "Alcanza 750 XP", xp: 0 }
    ];
    
    const unlock = (id) => {
        if (!achievements.includes(id)) {
            const newAch = [...achievements, id];
            setAchievements(newAch);
            localStorage.setItem("pardo_achievements", JSON.stringify(newAch));
            const ach = allAchievements.find(a => a.id === id);
            if (ach && ach.xp > 0) {
                const newXP = xp + ach.xp;
                localStorage.setItem("pardo_xp", newXP.toString());
            }
        }
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", color: darkMode ? "#fff" : "#333" }}>🏆 Logros y Niveles</h2>
            
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", padding: "25px", borderRadius: "15px", textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "60px" }}>{nivelActual.icon}</div>
                <h3 style={{ margin: "10px 0" }}>Nivel {nivelActual.nivel} - {nivelActual.nombre}</h3>
                <p style={{ fontSize: "14px" }}>{xp} XP total</p>
                <div style={{ height: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "5px", marginTop: "10px" }}>
                    <div style={{ height: "100%", width: progreso + "%", background: "#fff", borderRadius: "5px" }} />
                </div>
                <p style={{ fontSize: "11px", marginTop: "5px" }}>{siguienteNivel ? `${xp}/${siguienteNivel.minXP} XP para nivel ${siguienteNivel.nivel}` : "¡Nivel máximo!"}</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
                {allAchievements.map(ach => {
                    const unlocked = achievements.includes(ach.id);
                    return (
                        <div key={ach.id} style={{
                            background: unlocked ? "#d4edda" : (darkMode ? "#222" : "#fff"),
                            padding: "15px",
                            borderRadius: "10px",
                            textAlign: "center",
                            border: unlocked ? "2px solid #28a745" : "1px solid #ddd",
                            opacity: unlocked ? 1 : 0.7
                        }}>
                            <div style={{ fontSize: "30px" }}>{ach.icon}</div>
                            <h4 style={{ fontSize: "13px", margin: "8px 0", color: darkMode ? "#fff" : "#333" }}>{ach.nombre}</h4>
                            <p style={{ fontSize: "11px", color: darkMode ? "#aaa" : "#666" }}>{ach.desc}</p>
                            <p style={{ fontSize: "11px", color: "#667eea", fontWeight: "bold" }}>+{ach.xp} XP</p>
                            {!unlocked && <button onClick={() => unlock(ach.id)} style={{ padding: "5px 12px", background: "#667eea", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "11px" }}>Desbloquear</button>}
                            {unlocked && <p style={{ color: "#28a745", fontSize: "12px", fontWeight: "bold" }}>✓</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default LogrosAvanzados;
