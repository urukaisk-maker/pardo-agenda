import React from "react";

function Logros() {
    const [xp, setXP] = React.useState(() => parseInt(localStorage.getItem("pardo_xp") || "0"));
    const [achievements, setAchievements] = React.useState(() => JSON.parse(localStorage.getItem("pardo_achievements") || "[]"));
    
    const allAchievements = [
        { id: "first_task", icon: "🎯", name: "Primer Paso", desc: "Completa tu primera tarea", xp: 10 },
        { id: "first_diary", icon: "📔", name: "Escritor", desc: "Escribe tu primera entrada de diario", xp: 15 },
        { id: "first_habit", icon: "✅", name: "Creador de Hábitos", desc: "Crea tu primer hábito", xp: 10 },
        { id: "first_note", icon: "📝", name: "Notero", desc: "Crea tu primera nota", xp: 5 },
        { id: "first_wish", icon: "⭐", name: "Soñador", desc: "Añade tu primer deseo", xp: 5 },
        { id: "level_5", icon: "🌟", name: "Nivel 5", desc: "Alcanza 100 XP", xp: 0 },
        { id: "level_10", icon: "👑", name: "Nivel 10", desc: "Alcanza 500 XP", xp: 0 },
        { id: "explorer", icon: "🧭", name: "Explorador", desc: "Usa todas las secciones", xp: 50 },
        { id: "streak_3", icon: "🔥", name: "Racha de 3", desc: "3 días seguidos completando hábitos", xp: 30 },
        { id: "streak_7", icon: "⚡", name: "Racha de 7", desc: "7 días seguidos completando hábitos", xp: 100 }
    ];
    
    const level = Math.floor(xp / 50) + 1;
    const nextLevelXP = level * 50;
    const progress = Math.round((xp / nextLevelXP) * 100);
    
    const addXP = (amount) => {
        setXP(prev => {
            const newXP = prev + amount;
            localStorage.setItem("pardo_xp", newXP.toString());
            return newXP;
        });
    };
    
    const unlockAchievement = (id) => {
        if (!achievements.includes(id)) {
            const newAch = [...achievements, id];
            setAchievements(newAch);
            localStorage.setItem("pardo_achievements", JSON.stringify(newAch));
            const ach = allAchievements.find(a => a.id === id);
            if (ach && ach.xp > 0) addXP(ach.xp);
        }
    };
    
    const unlockedCount = achievements.length;
    const totalCount = allAchievements.length;
    
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>🏆 Logros</h2>
            
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", padding: "25px", borderRadius: "15px", textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "40px" }}>🐕</div>
                <h3 style={{ margin: "10px 0" }}>Nivel {level}</h3>
                <p style={{ fontSize: "14px" }}>{xp} XP total</p>
                <div style={{ height: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "5px", marginTop: "10px" }}>
                    <div style={{ height: "100%", width: progress + "%", background: "#fff", borderRadius: "5px" }} />
                </div>
                <p style={{ fontSize: "11px", marginTop: "5px" }}>{xp}/{nextLevelXP} XP para nivel {level + 1}</p>
            </div>
            
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
                <h3>📊 Progreso: {unlockedCount}/{totalCount} logros</h3>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                {allAchievements.map(ach => {
                    const unlocked = achievements.includes(ach.id);
                    return (
                        <div key={ach.id} style={{
                            background: unlocked ? "#d4edda" : "#fff",
                            padding: "15px",
                            borderRadius: "10px",
                            textAlign: "center",
                            border: unlocked ? "2px solid #28a745" : "1px solid #ddd",
                            opacity: unlocked ? 1 : 0.6
                        }}>
                            <div style={{ fontSize: "30px" }}>{ach.icon}</div>
                            <h4 style={{ fontSize: "13px", margin: "8px 0" }}>{ach.name}</h4>
                            <p style={{ fontSize: "11px", color: "#666" }}>{ach.desc}</p>
                            <p style={{ fontSize: "11px", color: "#667eea", fontWeight: "bold" }}>+{ach.xp} XP</p>
                            {!unlocked && <button onClick={() => unlockAchievement(ach.id)} style={{ marginTop: "8px", padding: "5px 12px", background: "#667eea", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "11px" }}>Desbloquear</button>}
                            {unlocked && <p style={{ color: "#28a745", fontSize: "12px", fontWeight: "bold" }}>✓ Desbloqueado</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Logros;
