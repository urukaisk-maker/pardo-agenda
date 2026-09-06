import React from "react";

function PushNotifications() {
    const [permission, setPermission] = React.useState(Notification.permission);
    const [subscription, setSubscription] = React.useState(null);
    
    const requestPermission = async () => {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === "granted") {
            // En producción, enviar subscription al backend
            console.log("Notificaciones activadas");
        }
    };
    
    const sendTestNotification = () => {
        if (Notification.permission === "granted") {
            const notification = new Notification("🐕 Pardo Agenda", {
                body: "¡Tienes 3 tareas pendientes hoy!",
                icon: "/favicon.svg",
                badge: "/favicon.svg"
            });
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
            <h2>🔔 Notificaciones Push</h2>
            <p style={{ color: "#666" }}>Estado: {permission === "granted" ? "✅ Activadas" : permission === "denied" ? "❌ Bloqueadas" : "⚠️ Sin decidir"}</p>
            {permission !== "granted" && (
                <button onClick={requestPermission} style={{ padding: "12px 25px", background: "#667eea", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontWeight: "bold" }}>🔔 Activar notificaciones</button>
            )}
            {permission === "granted" && (
                <button onClick={sendTestNotification} style={{ padding: "12px 25px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer" }}>📬 Enviar prueba</button>
            )}
        </div>
    );
}

export default PushNotifications;
