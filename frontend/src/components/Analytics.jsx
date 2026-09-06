import React from "react";

function Analytics() {
    const [stats, setStats] = React.useState(() => JSON.parse(localStorage.getItem("pardo_stats") || "{}"));
    
    React.useEffect(() => {
        const today = new Date().toDateString();
        const updated = { ...stats };
        updated[today] = (updated[today] || 0) + 1;
        setStats(updated);
        localStorage.setItem("pardo_stats", JSON.stringify(updated));
    }, []);
    
    const days = Object.keys(stats).slice(-7);
    const maxVisits = Math.max(...days.map(d => stats[d]), 1);
    
    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📊 Actividad</h2>
            <div style={{ background: "#fff", padding: "20px", borderRadius: "15px" }}>
                <h3>Visitas por día</h3>
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "100px" }}>
                    {days.map(d => (
                        <div key={d} style={{ textAlign: "center" }}>
                            <div style={{ height: (stats[d] / maxVisits) * 80 + "px", width: "25px", background: "#667eea", borderRadius: "5px 5px 0 0" }} />
                            <div style={{ fontSize: "10px" }}>{d.slice(0, 5)}</div>
                            <div style={{ fontSize: "10px", color: "#999" }}>{stats[d]}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Analytics;
