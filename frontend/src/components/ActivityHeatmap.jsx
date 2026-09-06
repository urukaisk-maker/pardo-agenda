import React from "react";

function ActivityHeatmap({ darkMode }) {
    const [activity] = React.useState(() => JSON.parse(localStorage.getItem("pardo_activity") || "{}"));
    const [habitLogs] = React.useState(() => JSON.parse(localStorage.getItem("pardo_habit_logs") || "{}"));
    
    // Generar los últimos 90 días
    const days = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const count = (activity[key] || 0) + (habitLogs[key] || 0);
        days.push({ date: d, key, count });
    }

    // Calcular racha actual
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) {
            streak++;
        } else if (streak > 0 || i !== days.length - 1) {
            break;
        }
    }

    const maxCount = Math.max(...days.map(d => d.count), 1);
    const getColor = (count) => {
        if (count === 0) return darkMode ? "#1e1e1e" : "#ebedf0";
        const intensity = count / maxCount;
        if (intensity > 0.75) return "#1b5e20";
        if (intensity > 0.5) return "#2e7d32";
        if (intensity > 0.25) return "#66bb6a";
        return "#a5d6a7";
    };

    const monthLabels = [...new Set(days.map(d => d.date.toLocaleString("es", { month: "short" })))];

    return (
        <div style={{ background: darkMode ? "#1a1a2e" : "#fff", padding: "20px", borderRadius: "15px", marginBottom: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ color: darkMode ? "#fff" : "#333", fontSize: "15px" }}>📊 Actividad diaria</h3>
                <span style={{ color: "#FF9800", fontSize: "14px", fontWeight: "bold" }}>🔥 Racha: {streak} días</span>
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {days.map(day => (
                    <div key={day.key} title={`${day.key}: ${day.count} actividades`} style={{ width: "14px", height: "14px", borderRadius: "3px", backgroundColor: getColor(day.count), cursor: "pointer" }} />
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11px", color: darkMode ? "#aaa" : "#666" }}>
                <span>{monthLabels[0] || ""}</span>
                <span>{monthLabels[Math.floor(monthLabels.length/2)] || ""}</span>
                <span>{monthLabels[monthLabels.length-1] || ""}</span>
            </div>
        </div>
    );
}

export default ActivityHeatmap;
