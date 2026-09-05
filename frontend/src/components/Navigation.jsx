import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navigation({ user, logout, darkMode }) {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [openCategory, setOpenCategory] = React.useState(null);
    
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    const categories = [
        {
            name: "Organización",
            icon: "📋",
            items: [
                { path: "/calendario", icon: "📅", name: "Calendario" },
                { path: "/habitos", icon: "✅", name: "Hábitos" },
                { path: "/notas", icon: "📝", name: "Notas" },
                { path: "/deseos", icon: "⭐", name: "Deseos" },
                { path: "/recordatorios", icon: "⏰", name: "Recordatorios" }
            ]
        },
        {
            name: "Personal",
            icon: "👤",
            items: [
                { path: "/diario", icon: "📔", name: "Diario" },
                { path: "/logros", icon: "🏆", name: "Logros" },
                { path: "/frases", icon: "💬", name: "Frases" },
                { path: "/idiomas", icon: "🌍", name: "Idiomas" }
            ]
        },
        {
            name: "Herramientas",
            icon: "🔧",
            items: [
                { path: "/servicios", icon: "🔗", name: "Servicios" },
                { path: "/calculadora", icon: "🔢", name: "Calculadora" },
                { path: "/pomodoro", icon: "🍅", name: "Pomodoro" },
                { path: "/compras", icon: "🛒", name: "Compras" },
                { path: "/contactos", icon: "📇", name: "Contactos" }
            ]
        },
        {
            name: "Datos",
            icon: "📊",
            items: [
                { path: "/estadisticas", icon: "📈", name: "Estadísticas" },
                { path: "/exportar", icon: "📤", name: "Exportar" },
                { path: "/notificaciones", icon: "🔔", name: "Alertas" },
                { path: "/juego", icon: "🎮", name: "Juego" }
            ]
        }
    ];
    
    const textColor = darkMode ? "#fff" : "#333";
    const bgColor = darkMode ? "#111" : "#fff";
    const itemBg = darkMode ? "#333" : "#f8f9fa";
    
    return (
        <nav style={{ background: bgColor, padding: "10px 15px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
                <Link to="/" style={{ fontSize: "20px", fontWeight: "bold", color: "#667eea", textDecoration: "none" }}>🐕 Pardo</Link>
                
                {!isMobile && (
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", flex: 1, justifyContent: "center", padding: "0 10px" }}>
                        {categories.map(cat => (
                            <div key={cat.name} style={{ position: "relative" }}>
                                <button onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)} style={{ padding: "7px 12px", borderRadius: "20px", border: "none", background: "#f0f0f0", color: textColor, cursor: "pointer", fontSize: "12px" }}>
                                    {cat.icon} {cat.name} ▾
                                </button>
                                {openCategory === cat.name && (
                                    <div style={{ position: "absolute", top: "100%", left: 0, background: bgColor, borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", padding: "5px", minWidth: "150px", zIndex: 600 }}>
                                        {cat.items.map(item => (
                                            <Link key={item.path} to={item.path} onClick={() => setOpenCategory(null)} style={{ display: "block", padding: "8px 12px", borderRadius: "8px", textDecoration: "none", color: textColor, fontSize: "12px", whiteSpace: "nowrap" }}>
                                                {item.icon} {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {isMobile ? (
                        <button onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: "26px", background: "none", border: "none", cursor: "pointer", color: textColor }}>{menuOpen ? "✕" : "☰"}</button>
                    ) : (
                        <span style={{ fontSize: "12px", color: textColor }}>👤 {user?.username}</span>
                    )}
                    {!isMobile && <button onClick={logout} style={{ padding: "5px 10px", background: "#f44336", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "11px" }}>Salir</button>}
                </div>
            </div>
            
            {isMobile && menuOpen && (
                <div style={{ marginTop: "10px", background: bgColor, borderRadius: "10px", padding: "10px", maxHeight: "70vh", overflowY: "auto" }}>
                    <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 15px", borderRadius: "8px", textDecoration: "none", color: textColor, background: itemBg, fontSize: "15px", fontWeight: "bold", marginBottom: "5px" }}>🏠 Inicio</Link>
                    
                    {categories.map(cat => (
                        <div key={cat.name} style={{ marginBottom: "5px" }}>
                            <button onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)} style={{ width: "100%", padding: "12px 15px", borderRadius: "8px", border: "none", background: itemBg, color: textColor, cursor: "pointer", fontSize: "15px", fontWeight: "bold", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>{cat.icon} {cat.name}</span>
                                <span>{openCategory === cat.name ? "▴" : "▾"}</span>
                            </button>
                            {openCategory === cat.name && (
                                <div style={{ paddingLeft: "15px", marginTop: "3px" }}>
                                    {cat.items.map(item => (
                                        <Link key={item.path} to={item.path} onClick={() => { setMenuOpen(false); setOpenCategory(null); }} style={{ display: "block", padding: "10px 15px", borderRadius: "8px", textDecoration: "none", color: textColor, background: darkMode ? "#222" : "#fff", fontSize: "13px", marginBottom: "2px" }}>
                                            {item.icon} {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 15px", borderTop: "1px solid #ddd", marginTop: "5px" }}>
                        <span style={{ fontSize: "13px", color: textColor }}>👤 {user?.username}</span>
                        <button onClick={logout} style={{ padding: "6px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "11px" }}>Salir</button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navigation;
