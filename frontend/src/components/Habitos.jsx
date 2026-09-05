import React from "react";

function Habitos() {
    const [habits, setHabits] = React.useState(() => {
        try { return JSON.parse(localStorage.getItem("pardo_habits") || "[]"); }
        catch { return []; }
    });
    const [newHabit, setNewHabit] = React.useState("");
    const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"];
    
    const saveHabits = (newHabits) => {
        setHabits(newHabits);
        localStorage.setItem("pardo_habits", JSON.stringify(newHabits));
    };
    
    const addHabit = () => {
        if (newHabit.trim()) {
            saveHabits([...habits, { id: Date.now(), name: newHabit, icon: "⭐", days: [false,false,false,false,false,false,false] }]);
            setNewHabit("");
        }
    };
    
    const deleteHabit = (id) => {
        saveHabits(habits.filter(h => h.id !== id));
    };
    
    const toggleDay = (habitId, dayIndex) => {
        saveHabits(habits.map(h => h.id === habitId ? { ...h, days: h.days.map((d, i) => i === dayIndex ? !d : d) } : h));
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>✅ Hábitos</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
                <input type="text" placeholder="Nuevo hábito..." value={newHabit} onChange={(e) => setNewHabit(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addHabit()} style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <button onClick={addHabit} style={{ padding: "10px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
            </div>
            {habits.length === 0 && <p style={{ textAlign: "center", color: "#999" }}>No hay hábitos. ¡Crea uno!</p>}
            {habits.map(h => (
                <div key={h.id} style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "22px" }}>{h.icon}</span>
                    <span style={{ flex: 1, fontWeight: "bold", fontSize: "14px" }}>{h.name}</span>
                    <div style={{ display: "flex", gap: "4px" }}>
                        {h.days.map((done, i) => <button key={i} onClick={() => toggleDay(h.id, i)} style={{ width: "28px", height: "28px", borderRadius: "50%", border: "2px solid #667eea", background: done ? "#667eea" : "#fff", color: done ? "#fff" : "#667eea", cursor: "pointer", fontSize: "10px" }}>{daysOfWeek[i]}</button>)}
                    </div>
                    <button onClick={() => deleteHabit(h.id)} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", padding: "6px 10px", fontSize: "14px" }} title="Eliminar hábito">🗑️</button>
                </div>
            ))}
        </div>
    );
}

export default Habitos;
