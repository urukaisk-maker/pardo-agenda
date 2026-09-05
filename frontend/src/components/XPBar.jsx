import React, { useState, useEffect } from "react";

function XPBar() {
    const [xpData, setXPData] = useState({ xp: 0, level: 1, name: "Cachorro", progress: 0 });
    const [achievements, setAchievements] = useState([]);
    const [showAchievements, setShowAchievements] = useState(false);
    const [accessories, setAccessories] = useState([]);
    const [showAccessories, setShowAccessories] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
        fetchXP();
        fetchAchievements();
        fetchAccessories();
    }, []);

    const fetchXP = async () => {
        try {
            const response = await fetch(`${API_URL}/api/xp/level`);
            const data = await response.json();
            setXPData(data);
        } catch (err) {
            console.error("Error fetching XP:", err);
        }
    };

    const fetchAchievements = async () => {
        try {
            const response = await fetch(`${API_URL}/api/xp/achievements`);
            const data = await response.json();
            setAchievements(data.achievements || []);
        } catch (err) {
            console.error("Error fetching achievements:", err);
        }
    };

    const fetchAccessories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/accessories`);
            const data = await response.json();
            setAccessories(data.accessories || []);
        } catch (err) {
            console.error("Error fetching accessories:", err);
        }
    };

    const earnXP = async () => {
        try {
            const response = await fetch(`${API_URL}/api/xp/earn`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ xp: 10 })
            });
            const data = await response.json();
            if (data.leveledUp) {
                alert(`🎉 ¡Subiste al nivel ${data.level.level}: ${data.level.name}!`);
            }
            fetchXP();
            fetchAchievements();
        } catch (err) {
            console.error("Error earning XP:", err);
        }
    };

    const purchaseAccessory = async (accessoryId) => {
        try {
            const response = await fetch(`${API_URL}/api/accessories/purchase`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessoryId })
            });
            const data = await response.json();
            alert(data.message);
        } catch (err) {
            console.error("Error purchasing accessory:", err);
        }
    };

    const styles = {
        container: {
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px"
        },
        levelBadge: {
            backgroundColor: "#667eea",
            color: "white",
            padding: "5px 10px",
            borderRadius: "20px",
            fontWeight: "bold"
        },
        progressBar: {
            width: "100%",
            height: "20px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "10px"
        },
        progressFill: {
            height: "100%",
            backgroundColor: "#667eea",
            borderRadius: "10px",
            transition: "width 0.5s"
        },
        button: {
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
        },
        achievementsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "10px",
            marginTop: "15px"
        },
        achievementCard: {
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
            backgroundColor: "#f8f9fa"
        },
        unlocked: {
            backgroundColor: "#d4edda",
            border: "2px solid #28a745"
        },
        locked: {
            opacity: 0.5
        },
        accessoriesGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "10px",
            marginTop: "15px"
        },
        accessoryCard: {
            padding: "10px",
            textAlign: "center",
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor: "#f8f9fa",
            transition: "all 0.3s"
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h3>⭐ Nivel {xpData.level || 1} - {xpData.name || "Cachorro"}</h3>
                    <p>XP: {xpData.xp || 0} / {xpData.nextLevel || 100}</p>
                </div>
                <div>
                    <button style={styles.button} onClick={earnXP}>Ganar XP</button>
                    <button style={styles.button} onClick={() => setShowAchievements(!showAchievements)}>Logros</button>
                    <button style={styles.button} onClick={() => setShowAccessories(!showAccessories)}>Accesorios</button>
                </div>
            </div>
            
            <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${xpData.progress || 0}%`}} />
            </div>
            
            {showAchievements && (
                <div>
                    <h4>🏆 Logros</h4>
                    <div style={styles.achievementsGrid}>
                        {achievements.map(achievement => (
                            <div 
                                key={achievement.id}
                                style={{...styles.achievementCard, ...(achievement.unlocked ? styles.unlocked : styles.locked)}}
                            >
                                <div style={{ fontSize: "30px" }}>{achievement.icon}</div>
                                <div><strong>{achievement.name}</strong></div>
                                <div style={{ fontSize: "12px" }}>{achievement.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {showAccessories && (
                <div>
                    <h4>🎨 Accesorios</h4>
                    <div style={styles.accessoriesGrid}>
                        {accessories.map(accessory => (
                            <div 
                                key={accessory.id}
                                style={styles.accessoryCard}
                                onClick={() => purchaseAccessory(accessory.id)}
                                title={`Comprar ${accessory.name} por ${accessory.price} XP`}
                            >
                                <div style={{ fontSize: "30px" }}>{accessory.icon}</div>
                                <div style={{ fontSize: "12px" }}>{accessory.name}</div>
                                <div style={{ fontSize: "12px", color: "#666" }}>{accessory.price} XP</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default XPBar;
