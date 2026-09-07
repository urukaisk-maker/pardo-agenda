import React, { useRef } from "react";
import html2canvas from "html2canvas";

function ProgressCard({ darkMode }) {
    const cardRef = useRef(null);
    const [tasks] = React.useState(() => JSON.parse(localStorage.getItem("pardo_calendar") || "{}"));
    const [habits] = React.useState(() => JSON.parse(localStorage.getItem("pardo_habits") || "[]"));
    const [xp] = React.useState(() => parseInt(localStorage.getItem("pardo_xp") || "0"));
    const [streak] = React.useState(() => parseInt(localStorage.getItem("pardo_streak") || "0"));

    const totalTasks = Object.values(tasks).reduce((sum, arr) => sum + arr.length, 0);
    const completedHabits = habits.reduce((sum, h) => sum + (h.days ? h.days.filter(d => d).length : 0), 0);

    const downloadImage = async () => {
        if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current, { useCORS: true, backgroundColor: darkMode ? "#1a1a2e" : "#ffffff" });
            const link = document.createElement("a");
            link.download = "mi-progreso-pardo.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <div ref={cardRef} style={{ background: darkMode ? "#1a1a2e" : "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", padding: "25px", borderRadius: "15px", maxWidth: "400px", margin: "0 auto", boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}>
                <div style={{ fontSize: "50px" }}>🐕</div>
                <h2 style={{ margin: "10px 0", fontSize: "20px" }}>Mi Progreso</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "15px" }}>
                    <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px", borderRadius: "8px" }}>
                        <div style={{ fontSize: "25px", fontWeight: "bold" }}>{totalTasks}</div>
                        <div style={{ fontSize: "11px" }}>Tareas</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px", borderRadius: "8px" }}>
                        <div style={{ fontSize: "25px", fontWeight: "bold" }}>{completedHabits}</div>
                        <div style={{ fontSize: "11px" }}>Hábitos ✓</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px", borderRadius: "8px" }}>
                        <div style={{ fontSize: "25px", fontWeight: "bold" }}>{streak}</div>
                        <div style={{ fontSize: "11px" }}>Racha 🔥</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px", borderRadius: "8px" }}>
                        <div style={{ fontSize: "25px", fontWeight: "bold" }}>{xp}</div>
                        <div style={{ fontSize: "11px" }}>XP</div>
                    </div>
                </div>
            </div>
            <button onClick={downloadImage} style={{ marginTop: "20px", padding: "12px 25px", background: "#667eea", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontWeight: "bold" }}>
                📸 Descargar imagen
            </button>
        </div>
    );
}

export default ProgressCard;
