import React from "react";
import usePushNotifications from "../hooks/usePushNotifications";

function PushManager({ darkMode }) {
    const { permission, subscription, error, subscribe, unsubscribe } = usePushNotifications();
    const [sending, setSending] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const sendTest = async () => {
        setSending(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL || "https://pardo-backend-3fp6.onrender.com"}/api/push/send-test`, { method: "POST" });
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || "Notificación enviada");
        setSending(false);
    };

    return (
        <div style={{ background: darkMode ? "#1a1a2e" : "#fff", padding: "20px", borderRadius: "15px", maxWidth: "500px", margin: "0 auto" }}>
            <h3 style={{ color: darkMode ? "#fff" : "#333" }}>🔔 Notificaciones Push</h3>
            <p style={{ color: darkMode ? "#aaa" : "#666", fontSize: "14px" }}>
                Estado: {permission === "granted" ? "✅ Permitidas" : permission === "denied" ? "❌ Bloqueadas" : "⚠️ No decididas"}
            </p>
            {error && <p style={{ color: "#f44336", fontSize: "13px" }}>{error}</p>}
            {permission !== "granted" && (
                <button onClick={subscribe} style={{ padding: "12px 25px", background: "#667eea", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontWeight: "bold" }}>🔔 Activar notificaciones</button>
            )}
            {permission === "granted" && subscription && (
                <div>
                    <p style={{ color: darkMode ? "#aaa" : "#666", fontSize: "12px" }}>Suscripción activa</p>
                    <button onClick={sendTest} disabled={sending} style={{ padding: "12px 25px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", marginRight: "10px" }}>{sending ? "Enviando..." : "📬 Enviar prueba"}</button>
                    <button onClick={unsubscribe} style={{ padding: "12px 25px", background: "#f44336", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer" }}>Desactivar</button>
                </div>
            )}
            {message && <p style={{ marginTop: "15px", color: "#4CAF50" }}>{message}</p>}
        </div>
    );
}

export default PushManager;
