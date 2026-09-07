import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
            { path: "/notificaciones-push", icon: "🔔", name: "Push" },
            { path: "/progreso", icon: "📸", name: "Progreso" },
            { path: "/admin", icon: "🛡️", name: "Admin" },
            { path: "/juego", icon: "🎮", name: "Juego" }
        ]
    }
];

function Navigation({ user, logout, darkMode }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const allSections = [
        { path: "/", name: "Inicio", icon: "🏠" },
        { path: "/calendario", name: "Calendario", icon: "📅" },
        { path: "/diario", name: "Diario", icon: "📔" },
        { path: "/habitos", name: "Hábitos", icon: "✅" },
        { path: "/notas", name: "Notas", icon: "📝" },
        { path: "/deseos", name: "Deseos", icon: "⭐" },
        { path: "/logros", name: "Logros", icon: "🏆" },
        { path: "/frases", name: "Frases", icon: "💬" },
        { path: "/estadisticas", name: "Estadísticas", icon: "📊" },
        { path: "/servicios", name: "Servicios", icon: "🔧" },
        { path: "/exportar", name: "Exportar", icon: "📤" },
        { path: "/notificaciones", name: "Alertas", icon: "🔔" },
        { path: "/notificaciones-push", name: "Push", icon: "🔔" },
        { path: "/progreso", name: "Progreso", icon: "📸" },
        { path: "/admin", name: "Admin", icon: "🛡️" },
        { path: "/temas", name: "Temas", icon: "🎨" },
        { path: "/asistente", name: "Asistente IA", icon: "🤖" },
        { path: "/idiomas", name: "Idiomas", icon: "🌍" },
        { path: "/pomodoro", name: "Pomodoro", icon: "🍅" },
        { path: "/compras", name: "Compras", icon: "🛒" },
        { path: "/contactos", name: "Contactos", icon: "📇" },
        { path: "/calculadora", name: "Calculadora", icon: "🔢" },
        { path: "/juego", name: "Juego", icon: "🎮" },
        { path: "/recordatorios", name: "Recordatorios", icon: "⏰" },
        { path: "/diagnostico", name: "Diagnóstico", icon: "🧭" }
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!e.ctrlKey) return;
            const shortcuts = {
                "1": "/",
                "2": "/calendario",
                "3": "/diario",
                "4": "/habitos",
                "5": "/notas",
                "6": "/deseos",
                "7": "/logros",
                "8": "/frases",
                "9": "/estadisticas",
                "0": "/servicios"
            };
            const key = e.key;
            if (shortcuts[key]) {
                e.preventDefault();
                navigate(shortcuts[key]);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [navigate]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            setShowSearch(false);
        } else {
            const filtered = allSections.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filtered);
            setShowSearch(true);
        }
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const textColor = darkMode ? "#fff" : "#333";
    const bgColor = darkMode ? "#111" : "#fff";
    const itemBg = darkMode ? "#333" : "#f8f9fa";

    return (
        <nav style={{ background: bgColor, padding: "10px 15px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
                <Link to="/" style={{ fontSize: "20px", fontWeight: "bold", color: "#667eea", textDecoration: "none" }}>🐕 Pardo</Link>
                <div ref={searchRef} style={{ position: "relative", flex: 1, maxWidth: "300px", margin: "0 10px" }}>
                    <input
                        type="text"
                        placeholder="🔍 Buscar sección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "20px", border: `1px solid ${darkMode ? "#555" : "#ddd"}`, background: darkMode ? "#222" : "#fff", color: textColor, fontSize: "13px" }}
                    />
                    {showSearch && searchResults.length > 0 && (
                        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: bgColor, borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", zIndex: 600, maxHeight: "300px", overflowY: "auto", marginTop: "5px" }}>
                            {searchResults.map((section, index) => (
                                <Link
                                    key={section.path}
                                    to={section.path}
                                    onClick={() => { setSearchTerm(""); setShowSearch(false); setMenuOpen(false); }}
                                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 15px", textDecoration: "none", color: textColor, fontSize: "13px", borderBottom: index < searchResults.length - 1 ? `1px solid ${darkMode ? "#444" : "#f0f0f0"}` : "none" }}
                                >
                                    <span>{section.icon}</span>
                                    {section.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {!isMobile && (
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", flex: 1, justifyContent: "center" }}>
                        {categories.map(cat => (
                            <div key={cat.name} style={{ position: "relative" }}>
                                <button onClick={() => setOpenCategory(openCategory === cat.name ? null : cat.name)} style={{ padding: "7px 12px", borderRadius: "20px", border: "none", background: itemBg, color: textColor, cursor: "pointer", fontSize: "12px" }}>
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
