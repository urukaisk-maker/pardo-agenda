import React from "react";
import SpotifyPlayer from "./SpotifyPlayer";

function Diario() {
    const [entries, setEntries] = React.useState(() => {
        try { return JSON.parse(localStorage.getItem("pardo_diary") || "[]"); }
        catch { return []; }
    });
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [mood, setMood] = React.useState("😊");
    const [showSpotify, setShowSpotify] = React.useState(false);
    const moods = ["😊", "😢", "😴", "😡", "🤗", "😰", "🤩", "😌"];
    
    const saveEntry = () => {
        if (title.trim() && content.trim()) {
            const newEntries = [{ id: Date.now(), title, content, mood, date: new Date().toLocaleDateString("es-ES") }, ...entries];
            setEntries(newEntries);
            localStorage.setItem("pardo_diary", JSON.stringify(newEntries));
            setTitle("");
            setContent("");
        }
    };
    
    const deleteEntry = (id) => {
        const newEntries = entries.filter(e => e.id !== id);
        setEntries(newEntries);
        localStorage.setItem("pardo_diary", JSON.stringify(newEntries));
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "750px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📔 Mi Diario</h2>
            
            <button onClick={() => setShowSpotify(!showSpotify)} style={{ display: "block", margin: "0 auto 15px", padding: "10px 20px", background: showSpotify ? "#1DB954" : "#fff", color: showSpotify ? "#fff" : "#333", border: "2px solid #1DB954", borderRadius: "25px", cursor: "pointer", fontWeight: "bold" }}>
                {showSpotify ? "🎵 Ocultar Spotify" : "🎵 Escuchar Spotify"}
            </button>
            
            {showSpotify && <SpotifyPlayer />}
            
            <div style={{ background: "#fff", padding: "20px", borderRadius: "15px", marginBottom: "15px" }}>
                <input type="text" placeholder="Título de tu entrada" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "10px", border: "2px solid #e0e0e0", borderRadius: "8px", fontSize: "14px" }} />
                <div style={{ display: "flex", gap: "5px", marginBottom: "10px", flexWrap: "wrap" }}>
                    {moods.map(m => <button key={m} onClick={() => setMood(m)} style={{ fontSize: "24px", background: "none", border: m === mood ? "3px solid #667eea" : "none", borderRadius: "50%", cursor: "pointer", padding: "5px" }}>{m}</button>)}
                </div>
                <textarea placeholder="¿Cómo te sientes hoy?..." value={content} onChange={(e) => setContent(e.target.value)} style={{ width: "100%", padding: "12px", minHeight: "100px", border: "2px solid #e0e0e0", borderRadius: "8px", fontSize: "14px", marginBottom: "10px" }} />
                <button onClick={saveEntry} style={{ padding: "12px 25px", background: "#667eea", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>💾 Guardar</button>
            </div>
            
            {entries.length === 0 && <p style={{ textAlign: "center", color: "#999" }}>No hay entradas. ¡Escribe tu primera!</p>}
            
            {entries.map(e => (
                <div key={e.id} style={{ background: "#fff", padding: "20px", borderRadius: "15px", marginBottom: "10px", borderLeft: "5px solid #fcb69f", position: "relative" }}>
                    <button onClick={() => deleteEntry(e.id)} style={{ position: "absolute", top: "10px", right: "10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px" }}>🗑️</button>
                    <h3 style={{ fontSize: "16px", marginRight: "45px" }}>{e.mood} {e.title}</h3>
                    <p style={{ fontSize: "14px", fontStyle: "italic", color: "#555", marginRight: "45px" }}>{e.content}</p>
                    <small style={{ color: "#999" }}>{e.date}</small>
                </div>
            ))}
        </div>
    );
}

export default Diario;
