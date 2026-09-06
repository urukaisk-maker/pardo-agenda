import React from "react";
import { useSyncStorage, fetchAPI } from "../hooks/useAPI";

function Deseos() {
    const [wishes, setWishes] = useSyncStorage("pardo_wishes", []);
    const [newWish, setNewWish] = React.useState("");
    const [category, setCategory] = React.useState("🌟");
    const cats = [{ icon: "🌟", name: "General" }, { icon: "📚", name: "Libros" }, { icon: "🎬", name: "Películas" }, { icon: "✈️", name: "Viajes" }];

    const addWish = () => {
        if (newWish) {
            const wish = { id: Date.now(), text: newWish, category, done: false };
            setWishes([wish, ...wishes]);
            setNewWish("");
            fetchAPI("/api/wishes", {
                method: "POST",
                body: JSON.stringify({ text: newWish, category })
            }).catch(() => {});
        }
    };

    const toggleWish = (id) => {
        const updated = wishes.map(w => w.id === id ? { ...w, done: !w.done } : w);
        setWishes(updated);
        const wish = updated.find(w => w.id === id);
        if (wish) {
            fetchAPI(`/api/wishes/${id}`, {
                method: "PUT",
                body: JSON.stringify({ done: wish.done })
            }).catch(() => {});
        }
    };

    const deleteWish = (id) => {
        setWishes(wishes.filter(w => w.id !== id));
        fetchAPI(`/api/wishes/${id}`, { method: "DELETE" }).catch(() => {});
    };

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>⭐ Deseos</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px", flexWrap: "wrap" }}>
                <input type="text" placeholder="Añadir deseo..." value={newWish} onChange={(e) => setNewWish(e.target.value)} style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>{cats.map(c => <option key={c.icon} value={c.icon}>{c.icon} {c.name}</option>)}</select>
                <button onClick={addWish} style={{ padding: "10px 15px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
            </div>
            {wishes.map(w => <div key={w.id} style={{ background: "#fff", padding: "10px", borderRadius: "8px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><input type="checkbox" checked={w.done} onChange={() => toggleWish(w.id)} /><span style={{ flex: 1 }}>{w.text}</span><button onClick={() => deleteWish(w.id)} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", padding: "5px 8px" }}>🗑️</button></div>)}
        </div>
    );
}

export default Deseos;
