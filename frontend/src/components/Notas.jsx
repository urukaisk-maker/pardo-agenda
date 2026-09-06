import React from "react";
import { useSyncStorage, fetchAPI } from "../hooks/useAPI";

function Notas() {
    const [notes, setNotes] = useSyncStorage("pardo_notes", []);
    const [newNote, setNewNote] = React.useState("");
    const [color, setColor] = React.useState("#FFF9C4");
    const colors = ["#FFF9C4", "#FFCCBC", "#C8E6C9", "#BBDEFB", "#F8BBD0", "#D1C4E9", "#FFE0B2", "#B2DFDB"];

    const addNote = () => {
        if (newNote) {
            const newNoteObj = { id: Date.now(), text: newNote, color };
            setNotes([newNoteObj, ...notes]);
            setNewNote("");
            fetchAPI("/api/notes", {
                method: "POST",
                body: JSON.stringify({ text: newNote, color })
            }).catch(() => {});
        }
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(n => n.id !== id));
        fetchAPI(`/api/notes/${id}`, { method: "DELETE" }).catch(() => {});
    };

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📝 Notas</h2>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
                <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Escribe una nota..." style={{ width: "100%", padding: "10px", minHeight: "70px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "8px" }} />
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {colors.map(c => <button key={c} onClick={() => setColor(c)} style={{ width: "25px", height: "25px", borderRadius: "50%", background: c, border: color === c ? "2px solid #333" : "1px solid #ddd", cursor: "pointer" }}></button>)}
                    <button onClick={addNote} style={{ marginLeft: "auto", padding: "8px 15px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕ Añadir</button>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                {notes.map(n => <div key={n.id} style={{ background: n.color, padding: "12px", borderRadius: "8px", minHeight: "100px", position: "relative" }}><button onClick={() => deleteNote(n.id)} style={{ position: "absolute", top: "5px", right: "5px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}>✕</button><p style={{ fontSize: "13px" }}>{n.text}</p></div>)}
            </div>
        </div>
    );
}

export default Notas;
