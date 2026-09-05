import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navigation({ user, logout }) {
    const location = useLocation();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = React.useState(false);
    
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    const menu = [
        { path: "/", icon: "🏠", name: "Hoy" },
        { path: "/calendario", icon: "📅", name: "Calendario" },
        { path: "/diario", icon: "📔", name: "Diario" },
        { path: "/habitos", icon: "✅", name: "Hábitos" },
        { path: "/notas", icon: "📝", name: "Notas" },
        { path: "/deseos", icon: "⭐", name: "Deseos" },
        { path: "/frases", icon: "💬", name: "Frases" },
        { path: "/logros", icon: "🏆", name: "Logros" },
        { path: "/estadisticas", icon: "📊", name: "Stats" },
        { path: "/servicios", icon: "🔧", name: "Servicios" },
        { path: "/exportar", icon: "📤", name: "Exportar" },
        { path: "/ajustes", icon: "⚙️", name: "Ajustes" }
    ];
    
    return (
        <nav style={{ background: "linear-gradient(135deg, #fff, #f8f9fa)", padding: "10px 15px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 200 }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link to="/" style={{ fontSize: "20px", fontWeight: "bold", color: "#667eea", textDecoration: "none" }}>🐕 Pardo</Link>
                
                {isMobile ? (
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: "28px", background: "none", border: "none", cursor: "pointer", color: "#667eea" }}>
                        {menuOpen ? "✕" : "☰"}
                    </button>
                ) : (
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {menu.map(m => (
                            <Link key={m.path} to={m.path} style={{
                                padding: "8px 12px",
                                borderRadius: "20px",
                                textDecoration: "none",
                                color: location.pathname === m.path ? "#fff" : "#333",
                                background: location.pathname === m.path ? "linear-gradient(135deg, #667eea, #764ba2)" : "#f0f0f0",
                                fontSize: "12px",
                                fontWeight: location.pathname === m.path ? "bold" : "normal",
                                whiteSpace: "nowrap"
                            }}>{m.icon} {m.name}</Link>
                        ))}
                    </div>
                )}
                
                {!isMobile && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "13px", color: "#666" }}>👤 {user?.username}</span>
                        <button onClick={logout} style={{ padding: "6px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "11px" }}>Salir</button>
                    </div>
                )}
            </div>
            
            {isMobile && menuOpen && (
                <div style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}>
                    {menu.map(m => (
                        <Link key={m.path} to={m.path} onClick={() => setMenuOpen(false)} style={{
                            padding: "12px 15px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: location.pathname === m.path ? "#fff" : "#333",
                            background: location.pathname === m.path ? "#667eea" : "#f8f9fa",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}>{m.icon} {m.name}</Link>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 15px", borderTop: "1px solid #f0f0f0" }}>
                        <span style={{ fontSize: "13px" }}>👤 {user?.username}</span>
                        <button onClick={logout} style={{ padding: "6px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "11px" }}>Salir</button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navigation;
