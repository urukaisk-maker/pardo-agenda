import React from "react";

function Rachas({ darkMode }) {
    const [streak, setStreak] = React.useState(() => parseInt(localStorage.getItem("pardo_streak") || "0"));
    const [bestStreak, setBestStreak] = React.useState(() => parseInt(localStorage.getItem("pardo_best_streak") || "0"));
    const [lastVisit, setLastVisit] = React.useState(() => localStorage.getItem("pardo_last_visit"));
    
    React.useEffect(() => {
        const today = new Date().toDateString();
        if (lastVisit !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastVisit === yesterday) {
                const newStreak = streak + 1;
                setStreak(newStreak);
                if (newStreak > bestStreak) {
                    setBestStreak(newStreak);
                    localStorage.setItem("pardo_best_streak", newStreak.toString());
                }
            } else if (lastVisit !== null) {
                setStreak(1);
            } else {
                setStreak(1);
            }
            localStorage.setItem("pardo_streak", streak.toString());
            localStorage.setItem("pardo_last_visit", today);
        }
    }, []);
    
    const textColor = darkMode ? "#fff" : "#333";
    
    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ color: textColor }}>🔥 Rachas</h2>
            <div style={{ background: darkMode ? "#222" : "#fff", padding: "30px", borderRadius: "20px", marginTop: "20px" }}>
                <div style={{ fontSize: "50px" }}>🔥</div>
                <div style={{ fontSize: "60px", fontWeight: "bold", color: "#FF9800" }}>{streak}</div>
                <p style={{ color: textColor }}>días seguidos</p>
                <div style={{ marginTop: "20px", padding: "15px", background: "#FFF3E0", borderRadius: "10px" }}>
                    <span style={{ fontSize: "13px", color: "#E65100" }}>🏆 Mejor racha: {bestStreak} días</span>
                </div>
            </div>
        </div>
    );
}

export default Rachas;
