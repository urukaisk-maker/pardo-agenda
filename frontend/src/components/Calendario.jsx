import React from "react";
import { useSyncStorage, fetchAPI } from "../hooks/useAPI";

function Calendario() {
    const [tasks, setTasks] = useSyncStorage("pardo_calendar", {});
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [newTask, setNewTask] = React.useState("");

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={"e"+i}></div>);
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
        const dateKey = year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
        const dayTasks = tasks[dateKey] || [];
        days.push(<div key={d} onClick={() => setSelectedDate(dateKey)} style={{ padding: "10px", textAlign: "center", background: isToday ? "#667eea" : "#fff", color: isToday ? "#fff" : "#333", borderRadius: "5px", border: dayTasks.length > 0 ? "2px solid #4CAF50" : "1px solid #ddd", cursor: "pointer" }}>{d}</div>);
    }

    const deleteTask = (dateKey, id) => {
        const updated = { ...tasks };
        updated[dateKey] = updated[dateKey].filter(t => t.id !== id);
        setTasks(updated);
        fetchAPI(`/api/tasks/${id}`, { method: "DELETE" }).catch(() => {});
    };

    const addTask = () => {
        if (newTask && selectedDate) {
            const newTaskObj = { id: Date.now(), text: newTask, due_date: selectedDate };
            const updated = { ...tasks, [selectedDate]: [...(tasks[selectedDate] || []), newTaskObj] };
            setTasks(updated);
            setNewTask("");
            fetchAPI("/api/tasks", {
                method: "POST",
                body: JSON.stringify({ title: newTask, due_date: selectedDate })
            }).catch(() => {});
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "850px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📅 Calendario</h2>
            <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ padding: "8px 15px", border: "none", background: "#667eea", color: "#fff", borderRadius: "5px", cursor: "pointer" }}>←</button>
                <h3 style={{ margin: 0 }}>{months[month]} {year}</h3>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ padding: "8px 15px", border: "none", background: "#667eea", color: "#fff", borderRadius: "5px", cursor: "pointer" }}>→</button>
            </div>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>{daysOfWeek.map(d => <div key={d} style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>{d}</div>)}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>{days}</div>
            </div>
            {selectedDate && (
                <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginTop: "15px" }}>
                    <h3>📋 {selectedDate}</h3>
                    {(tasks[selectedDate] || []).map(t => <div key={t.id} style={{ display: "flex", gap: "8px", padding: "8px" }}><span style={{ flex: 1 }}>{t.text}</span><button onClick={() => deleteTask(selectedDate, t.id)} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>🗑️</button></div>)}
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}><input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nueva tarea..." style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }} /><button onClick={addTask} style={{ padding: "8px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button></div>
                </div>
            )}
        </div>
    );
}

export default Calendario;
