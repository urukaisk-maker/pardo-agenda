import React from "react";
import { useSyncStorage, fetchAPI } from "../hooks/useAPI";

function Habitos() {
    const [habits, setHabits] = useSyncStorage("pardo_habits", []);
    const [newHabit, setNewHabit] = React.useState("");
    const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"];

    const addHabit = () => {
        if (newHabit) {
            const habit = { id: Date.now(), name: newHabit, icon: "⭐", days: [false,false,false,false,false,false,false] };
            setHabits([...habits, habit]);
            setNewHabit("");
            fetchAPI("/api/habits", {
                method: "POST",
                body: JSON.stringify({ name: newHabit, icon: "⭐" })
            }).catch(() => {});
        }
    };

    const toggleDay = (habitId, dayIndex) => {
        const updated = habits.map(h => h.id === habitId ? { ...h, days: h.days.map((d, i) => i === dayIndex ? !d : d) } : h);
        setHabits(updated);
        const habit = updated.find(h => h.id === habitId);
        if (habit) {
            fetchAPI(`/api/habits/${habitId}`, {
                method: "PUT",
                body: JSON.stringify({ days: habit.days })
            }).catch(() => {});
        }
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
        fetchAPI(`/api/habits/${id}`, { method: "DELETE" }).catch(() => {});
    };

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>✅ Hábitos</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
                <input type="text" placeholder="Nuevo hábito..." value={newHabit} onChange={(e) => setNewHabit(e.target.value)} style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <button onClick={addHabit} style={{ padding: "10px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
            </div>
            {habits.map(h => <div key={h.id} style={{ background: "#fff", padding: "12px", borderRadius: "10px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><span>{h.icon}</span><span style={{ flex: 1, fontWeight: "bold", fontSize: "14px" }}>{h.name}</span><div style={{ display: "flex", gap: "4px" }}>{h.days.map((done, i) => <button key={i} onClick={() => toggleDay(h.id, i)} style={{ width: "26px", height: "26px", borderRadius: "50%", border: "2px solid #667eea", background: done ? "#667eea" : "#fff", color: done ? "#fff" : "#667eea", cursor: "pointer", fontSize: "9px" }}>{daysOfWeek[i]}</button>)}</div><button onClick={() => deleteHabit(h.id)} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", padding: "5px 8px" }}>🗑️</button></div>)}
        </div>
    );
}

export default Habitos;
