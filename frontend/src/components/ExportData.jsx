import React from "react";

function ExportData() {
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [message, setMessage] = React.useState("");
    
    const exportData = () => {
        const data = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            calendar: JSON.parse(localStorage.getItem("pardo_calendar") || "{}"),
            diary: JSON.parse(localStorage.getItem("pardo_diary") || "[]"),
            habits: JSON.parse(localStorage.getItem("pardo_habits") || "[]"),
            notes: JSON.parse(localStorage.getItem("pardo_notes") || "[]"),
            wishes: JSON.parse(localStorage.getItem("pardo_wishes") || "[]"),
            xp: parseInt(localStorage.getItem("pardo_xp") || "0"),
            achievements: JSON.parse(localStorage.getItem("pardo_achievements") || "[]")
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pardo-agenda-backup-" + new Date().toISOString().split("T")[0] + ".json";
        a.click();
        URL.revokeObjectURL(url);
        setMessage("✅ Datos exportados correctamente");
    };
    
    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.calendar) localStorage.setItem("pardo_calendar", JSON.stringify(data.calendar));
                if (data.diary) localStorage.setItem("pardo_diary", JSON.stringify(data.diary));
                if (data.habits) localStorage.setItem("pardo_habits", JSON.stringify(data.habits));
                if (data.notes) localStorage.setItem("pardo_notes", JSON.stringify(data.notes));
                if (data.wishes) localStorage.setItem("pardo_wishes", JSON.stringify(data.wishes));
                if (data.xp) localStorage.setItem("pardo_xp", data.xp.toString());
                if (data.achievements) localStorage.setItem("pardo_achievements", JSON.stringify(data.achievements));
                setMessage("✅ Datos importados correctamente. Recarga la página.");
            } catch (err) {
                setMessage("❌ Error al importar: archivo inválido");
            }
        };
        reader.readAsText(file);
    };
    
    const clearAllData = () => {
        if (window.confirm("¿Estás seguro? Se borrarán TODOS tus datos.")) {
            localStorage.removeItem("pardo_calendar");
            localStorage.removeItem("pardo_diary");
            localStorage.removeItem("pardo_habits");
            localStorage.removeItem("pardo_notes");
            localStorage.removeItem("pardo_wishes");
            localStorage.removeItem("pardo_xp");
            localStorage.removeItem("pardo_achievements");
            setMessage("🗑️ Todos los datos han sido eliminados");
            setShowConfirm(false);
        }
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📤 Exportar / Importar Datos</h2>
            
            {message && <div style={{ background: "#d4edda", color: "#155724", padding: "10px", borderRadius: "8px", marginBottom: "15px", textAlign: "center" }}>{message}</div>}
            
            <div style={{ background: "#fff", padding: "20px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3>📤 Exportar</h3>
                <p style={{ fontSize: "13px", color: "#666" }}>Descarga todos tus datos en formato JSON para hacer backup.</p>
                <button onClick={exportData} style={{ padding: "12px 25px", background: "#667eea", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>📥 Descargar Backup</button>
            </div>
            
            <div style={{ background: "#fff", padding: "20px", borderRadius: "15px", marginBottom: "15px" }}>
                <h3>📥 Importar</h3>
                <p style={{ fontSize: "13px", color: "#666" }}>Restaura tus datos desde un archivo JSON.</p>
                <input type="file" accept=".json" onChange={importData} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }} />
            </div>
            
            <div style={{ background: "#fff", padding: "20px", borderRadius: "15px" }}>
                <h3>🗑️ Zona de peligro</h3>
                <p style={{ fontSize: "13px", color: "#666" }}>Elimina todos tus datos permanentemente.</p>
                {!showConfirm ? (
                    <button onClick={() => setShowConfirm(true)} style={{ padding: "10px 20px", background: "#f44336", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>🗑️ Borrar todo</button>
                ) : (
                    <div>
                        <p style={{ color: "#f44336", fontWeight: "bold", fontSize: "13px" }}>¿Estás seguro? Esta acción no se puede deshacer.</p>
                        <button onClick={clearAllData} style={{ padding: "10px 20px", background: "#f44336", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", marginRight: "10px" }}>Sí, borrar</button>
                        <button onClick={() => setShowConfirm(false)} style={{ padding: "10px 20px", background: "#ddd", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancelar</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExportData;
