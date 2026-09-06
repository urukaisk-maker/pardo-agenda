import React from "react";
import { useSyncStorage } from "../hooks/useAPI";

function Diario() {
    const [entries, setEntries] = useSyncStorage("pardo_diary", []);
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [mood, setMood] = React.useState("😊");
    const moods = ["😊", "😢", "😴", "😡", "🤗", "😰", "🤩", "😌"];
    
    const saveEntry = () => {
        if (title && content) {
            const newEntry = { id: Date.now(), title, content, mood, date: new Date().toLocaleDateString("es-ES") };
            const newEntries = [newEntry, ...entries];
            setEntries(newEntries);
            setTitle("");
            setContent("");
            
            // Sincronizar con backend (POST)
            fetchAPI("/api/diary", {
                method: "POST",
                body: JSON.stringify({ title, content, mood })
            }).catch(() => {});
        }
    };
    
    const deleteEntry = (id) => {
        const newEntries = entries.filter(e => e.id !== id);
        setEntries(newEntries);
        // Sincronizar con backend (DELETE)
        fetchAPI(`/api/diary/${id}`, { method: "DELETE" }).catch(() => {});
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📔 Mi Diario</h2>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
                <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "8px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <div style={{ display: "flex", gap: "5px", marginBottom: "8px" }}>{moods.map(m => <button key={m} onClick={() => setMood(m)} style={{ fontSize: "22px", background: "none", border: m === mood ? "2px solid #667eea" : "none", borderRadius: "50%", cursor: "pointer" }}>{m}</button>)}</div>
                <textarea placeholder="Escribe..." value={content} onChange={(e) => setContent(e.target.value)} style={{ width: "100%", padding: "10px", minHeight: "80px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "8px" }} />
                <button onClick={saveEntry} style={{ padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>💾 Guardar</button>
            </div>
            {entries.map(e => (
                <div key={e.id} style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", borderLeft: "4px solid #fcb69f", position: "relative" }}>
                    <button onClick={() => deleteEntry(e.id)} style={{ position: "absolute", top: "10px", right: "10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer" }}>🗑️</button>
                    <h3 style={{ fontSize: "15px", marginRight: "40px" }}>{e.mood} {e.title}</h3>
                    <p style={{ fontSize: "13px", fontStyle: "italic" }}>{e.content}</p>
                    <small style={{ color: "#999" }}>{e.date}</small>
                </div>
            ))}
        </div>
    );
}

export default Diario;
