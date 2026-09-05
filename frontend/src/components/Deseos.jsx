import React from "react";

function Deseos() {
    const [wishes, setWishes] = React.useState(() => {
        try { return JSON.parse(localStorage.getItem("pardo_wishes") || "[]"); }
        catch { return []; }
    });
    const [newWish, setNewWish] = React.useState("");
    const [category, setCategory] = React.useState("🌟");
    const cats = [{ icon: "🌟", name: "General" }, { icon: "📚", name: "Libros" }, { icon: "🎬", name: "Películas" }, { icon: "✈️", name: "Viajes" }, { icon: "🎁", name: "Regalos" }];
    
    const saveWishes = (newWishes) => {
        setWishes(newWishes);
        localStorage.setItem("pardo_wishes", JSON.stringify(newWishes));
    };
    
    const addWish = () => {
        if (newWish.trim()) {
            saveWishes([{ id: Date.now(), text: newWish, category, done: false }, ...wishes]);
            setNewWish("");
        }
    };
    
    const deleteWish = (id) => {
        saveWishes(wishes.filter(w => w.id !== id));
    };
    
    const toggleWish = (id) => {
        saveWishes(wishes.map(w => w.id === id ? { ...w, done: !w.done } : w));
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>⭐ Deseos</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px", flexWrap: "wrap" }}>
                <input type="text" placeholder="Añadir deseo..." value={newWish} onChange={(e) => setNewWish(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addWish()} style={{ flex: 1, minWidth: "150px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>{cats.map(c => <option key={c.icon} value={c.icon}>{c.icon} {c.name}</option>)}</select>
                <button onClick={addWish} style={{ padding: "10px 15px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
            </div>
            {wishes.length === 0 && <p style={{ textAlign: "center", color: "#999" }}>No hay deseos. ¡Añade uno!</p>}
            {wishes.map(w => (
                <div key={w.id} style={{ background: "#fff", padding: "12px", borderRadius: "10px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <input type="checkbox" checked={w.done} onChange={() => toggleWish(w.id)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                    <span style={{ fontSize: "18px" }}>{w.category}</span>
                    <span style={{ flex: 1, fontSize: "14px", textDecoration: w.done ? "line-through" : "none" }}>{w.text}</span>
                    <button onClick={() => deleteWish(w.id)} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", padding: "6px 10px" }} title="Eliminar deseo">🗑️</button>
                </div>
            ))}
        </div>
    );
}

export default Deseos;
