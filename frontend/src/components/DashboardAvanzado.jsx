import React from "react";

function DashboardAvanzado({ darkMode }) {
    const [tasks] = React.useState(() => JSON.parse(localStorage.getItem("pardo_calendar") || "{}"));
    const [habits] = React.useState(() => JSON.parse(localStorage.getItem("pardo_habits") || "[]"));
    const [diary] = React.useState(() => JSON.parse(localStorage.getItem("pardo_diary") || "[]"));
    const [notes] = React.useState(() => JSON.parse(localStorage.getItem("pardo_notes") || "[]"));
    const [wishes] = React.useState(() => JSON.parse(localStorage.getItem("pardo_wishes") || "[]"));
    const [xp] = React.useState(() => parseInt(localStorage.getItem("pardo_xp") || "0"));
    
    const totalTasks = Object.values(tasks).reduce((s, arr) => s + arr.length, 0);
    const completedHabits = habits.reduce((s, h) => s + (h.days ? h.days.filter(d => d).length : 0), 0);
    const habitRate = habits.length > 0 ? Math.round((completedHabits / (habits.length * 7)) * 100) : 0;
    
    const weeklyData = ["L", "M", "X", "J", "V", "S", "D"].map((day, i) => ({
        day, count: habits.filter(h => h.days && h.days[i]).length, total: habits.length || 1
    }));
    
    const textColor = darkMode ? "#fff" : "#333";
    const cardBg = darkMode ? "#222" : "#fff";
    
    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", color: textColor }}>📊 Dashboard</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginBottom: "20px" }}>
                <div style={{ background: "#667eea", color: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{totalTasks}</div><div style={{ fontSize: "11px" }}>Tareas</div></div>
                <div style={{ background: "#4CAF50", color: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{completedHabits}</div><div style={{ fontSize: "11px" }}>Hábitos ✓</div></div>
                <div style={{ background: "#FF9800", color: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{diary.length}</div><div style={{ fontSize: "11px" }}>Diario</div></div>
                <div style={{ background: "#9C27B0", color: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{notes.length}</div><div style={{ fontSize: "11px" }}>Notas</div></div>
                <div style={{ background: "#f44336", color: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{wishes.length}</div><div style={{ fontSize: "11px" }}>Deseos</div></div>
                <div style={{ background: "#FFD700", color: "#333", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{xp}</div><div style={{ fontSize: "11px" }}>XP</div></div>
            </div>
            
            <div style={{ background: cardBg, padding: "20px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3 style={{ color: textColor, fontSize: "15px" }}>📈 Actividad semanal de hábitos</h3>
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "150px", marginTop: "15px" }}>
                    {weeklyData.map((d, i) => (
                        <div key={i} style={{ textAlign: "center", flex: 1 }}>
                            <div style={{ height: (d.count / d.total) * 120 + "px", width: "30px", background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: "5px 5px 0 0", margin: "0 auto" }} />
                            <div style={{ fontSize: "12px", marginTop: "5px", color: textColor }}>{d.day}</div>
                            <div style={{ fontSize: "10px", color: "#999" }}>{d.count}/{d.total}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div style={{ background: cardBg, padding: "20px", borderRadius: "15px" }}>
                <h3 style={{ color: textColor, fontSize: "15px" }}>📊 Tasa de cumplimiento</h3>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: textColor }}><span>Hábitos completados</span><span>{habitRate}%</span></div>
                <div style={{ height: "12px", background: "#f0f0f0", borderRadius: "6px", marginTop: "8px" }}>
                    <div style={{ height: "100%", width: habitRate + "%", background: "linear-gradient(135deg, #4CAF50, #45a049)", borderRadius: "6px" }} />
                </div>
            </div>
        </div>
    );
}

export default DashboardAvanzado;
