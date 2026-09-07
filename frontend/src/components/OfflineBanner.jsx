import React, { useEffect, useState } from "react";
import { useOnlineStatus, flushOfflineQueue } from "../hooks/useAPI";

function OfflineBanner() {
    const online = useOnlineStatus();
    const [syncing, setSyncing] = useState(false);
    const [pending, setPending] = useState(0);

    useEffect(() => {
        if (online) {
            const queue = JSON.parse(localStorage.getItem("pardo_offline_queue") || "[]");
            setPending(queue.length);
            if (queue.length > 0) {
                setSyncing(true);
                flushOfflineQueue().finally(() => {
                    setSyncing(false);
                    setPending(0);
                });
            }
        } else {
            const queue = JSON.parse(localStorage.getItem("pardo_offline_queue") || "[]");
            setPending(queue.length);
        }
    }, [online]);

    if (online && pending === 0 && !syncing) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: online ? "#4CAF50" : "#f44336",
            color: "#fff",
            textAlign: "center",
            padding: "8px",
            fontSize: "14px",
            zIndex: 2000
        }}>
            {!online ? "📡 Sin conexión - Los cambios se guardarán localmente" : syncing ? "🔄 Sincronizando cambios..." : "✅ Sincronizado"}
        </div>
    );
}

export default OfflineBanner;
