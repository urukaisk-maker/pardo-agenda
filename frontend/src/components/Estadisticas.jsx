import React from "react";

function Estadisticas() {
    const [tasks] = React.useState(() => JSON.parse(localStorage.getItem("pardo_calendar") || "{}"));
    const [habits] = React.useState(() => JSON.parse(localStorage.getItem("pardo_habits") || "[]"));
    const [diary] = React.useState(() => JSON.parse(localStorage.getItem("pardo_diary") || "[]"));
    const [notes] = React.useState(() => JSON.parse(localStorage.getItem("pardo_notes") || "[]"));
    const [wishes] = React.useState(() => JSON.parse(localStorage.getItem("pardo_wishes") || "[]"));
    
    const totalTasks = Object.values(tasks).reduce((sum, arr) => sum + arr.length, 0);
    const completedHabits = habits.reduce((sum, h) => sum + (h.days ? h.days.filter(d => d).length : 0), 0);
    const totalHabitDays = habits.length * 7;
    const habitRate = totalHabitDays > 0 ? Math.round((completedHabits / totalHabitDays) * 100) : 0;
    
    const weeklyData = ["L", "M", "X", "J", "V", "S", "D"].map((day, i) => {
        const dayHabits = habits.filter(h => h.days && h.days[i]).length;
        return { day, count: dayHabits, total: habits.length || 1 };
    });
    
    const maxBarHeight = 100;
    
    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📊 Estadísticas</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginBottom: "25px" }}>
                <div style={{ background: "#667eea", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>📋</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{totalTasks}</div>
                    <div>Total tareas</div>
                </div>
                <div style={{ background: "#4CAF50", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>✅</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{completedHabits}</div>
                    <div>Hábitos completados</div>
                </div>
                <div style={{ background: "#FF9800", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>📔</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{diary.length}</div>
                    <div>Entradas diario</div>
                </div>
                <div style={{ background: "#9C27B0", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>📝</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{notes.length}</div>
                    <div>Notas</div>
                </div>
            </div>
            
            <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", marginBottom: "20px" }}>
                <h3>📊 Actividad semanal de hábitos</h3>
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "150px", marginTop: "20px" }}>
                    {weeklyData.map((d, i) => (
                        <div key={i} style={{ textAlign: "center", flex: 1 }}>
                            <div style={{
                                height: (d.count / d.total) * maxBarHeight + "px",
                                width: "30px",
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                borderRadius: "5px 5px 0 0",
                                margin: "0 auto",
                                transition: "height 0.5s"
                            }} />
                            <div style={{ fontSize: "12px", marginTop: "5px" }}>{d.day}</div>
                            <div style={{ fontSize: "10px", color: "#999" }}>{d.count}/{d.total}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div style={{ background: "#fff", padding: "25px", borderRadius: "15px" }}>
                <h3>📈 Resumen general</h3>
                <div style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}><span>✅ Tasa de hábitos</span><span>{habitRate}%</span></div>
                    <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", marginTop: "5px" }}><div style={{ height: "100%", width: habitRate + "%", background: "#4CAF50", borderRadius: "4px" }} /></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "13px" }}>
                    <div>📋 Tareas: {totalTasks}</div>
                    <div>✅ Hábitos: {habits.length}</div>
                    <div>📔 Diario: {diary.length}</div>
                    <div>📝 Notas: {notes.length}</div>
                    <div>⭐ Deseos: {wishes.length}</div>
                    <div>🔥 Tasa: {habitRate}%</div>
                </div>
            </div>
        </div>
    );
}

export default Estadisticas;
