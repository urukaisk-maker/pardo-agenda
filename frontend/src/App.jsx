import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import InstallPWA from "./components/InstallPWA";
import Diario from "./components/Diario";
import Habitos from "./components/Habitos";
import Deseos from "./components/Deseos";
import SpotifyPlayer from "./components/SpotifyPlayer";
import Logros from "./components/Logros";
import DarkModeToggle from "./components/DarkModeToggle";
import Estadisticas from "./components/Estadisticas";
import ExportData from "./components/ExportData";
import Configuracion from "./components/Configuracion";

const API = "http://localhost:5000";

const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        const token = localStorage.getItem("pardo_token");
        if (token) {
            fetch(API + "/api/auth/me", { headers: { Authorization: "Bearer " + token } })
                .then(r => r.json()).then(d => { if (d.user) setUser(d.user); }).catch(() => {}).finally(() => setLoading(false));
        } else { setLoading(false); }
    }, []);
    const login = async (email, password) => {
        const res = await fetch(API + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (data.token) { localStorage.setItem("pardo_token", data.token); setUser(data.user); return { success: true }; }
        return { success: false, error: data.error || "Error" };
    };
    const register = async (username, email, password) => {
        const res = await fetch(API + "/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, email, password }) });
        const data = await res.json();
        if (data.token) { localStorage.setItem("pardo_token", data.token); setUser(data.user); return { success: true }; }
        return { success: false, error: data.error || "Error" };
    };
    const logout = () => { localStorage.removeItem("pardo_token"); setUser(null); };
    return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
}

function useAuth() { return React.useContext(AuthContext); }

function useLocalStorage(key, initial) {
    const [value, setValue] = React.useState(() => {
        try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initial; }
        catch { return initial; }
    });
    React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
    return [value, setValue];
}

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const submit = async (e) => { e.preventDefault(); const r = await login(email, password); if (r.success) navigate("/"); else setError(r.error); };
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "20px" }}>
            <div style={{ background: "#fff", padding: "35px", borderRadius: "20px", maxWidth: "360px", width: "100%" }}>
                <h1 style={{ textAlign: "center" }}>🐕 Pardo Agenda</h1>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <form onSubmit={submit}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", padding: "12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "5px" }} />
                    <button type="submit" style={{ width: "100%", padding: "12px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Entrar</button>
                </form>
                <p style={{ textAlign: "center", marginTop: "15px" }}><Link to="/registro" style={{ color: "#667eea" }}>Registrarse</Link></p>
            </div>
        </div>
    );
}

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const submit = async (e) => { e.preventDefault(); const r = await register(username, email, password); if (r.success) navigate("/"); else setError(r.error); };
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "20px" }}>
            <div style={{ background: "#fff", padding: "35px", borderRadius: "20px", maxWidth: "360px", width: "100%" }}>
                <h1 style={{ textAlign: "center" }}>📝 Registro</h1>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <form onSubmit={submit}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" required style={{ width: "100%", padding: "12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", padding: "12px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "5px" }} />
                    <button type="submit" style={{ width: "100%", padding: "12px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Crear cuenta</button>
                </form>
                <p style={{ textAlign: "center", marginTop: "15px" }}><Link to="/login" style={{ color: "#667eea" }}>Ya tengo cuenta</Link></p>
            </div>
        </div>
    );
}

function PanelHoy({ user }) {
    const [tasks] = useLocalStorage("pardo_calendar", {});
    const [habits] = useLocalStorage("pardo_habits", []);
    const [diary] = useLocalStorage("pardo_diary", []);
    const today = new Date();
    const todayKey = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");
    const todayTasks = tasks[todayKey] || [];
    return (
        <div style={{ padding: "25px", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <div style={{ fontSize: "60px" }}>🐕</div>
                <h1>¡Hola {user?.username}!</h1>
                <p style={{ color: "#666" }}>Tienes {todayTasks.length} tareas hoy</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
                <div style={{ background: "#667eea", color: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{todayTasks.length}</div><div style={{ fontSize: "12px" }}>Tareas hoy</div></div>
                <div style={{ background: "#4CAF50", color: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{habits.length}</div><div style={{ fontSize: "12px" }}>Hábitos</div></div>
                <div style={{ background: "#FF9800", color: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}><div style={{ fontSize: "28px", fontWeight: "bold" }}>{diary.length}</div><div style={{ fontSize: "12px" }}>Diario</div></div>
            </div>
        </div>
    );
}

function Calendario() {
    const [tasks, setTasks] = useLocalStorage("pardo_calendar", {});
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [newTask, setNewTask] = React.useState("");
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={"e"+i}></div>);
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
        const dateKey = year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
        const dayTasks = tasks[dateKey] || [];
        days.push(<div key={d} onClick={() => setSelectedDate(dateKey)} style={{ padding: "10px", textAlign: "center", background: isToday ? "#667eea" : "#fff", color: isToday ? "#fff" : "#333", borderRadius: "5px", border: dayTasks.length > 0 ? "2px solid #4CAF50" : "1px solid #ddd", cursor: "pointer" }}>{d}</div>);
    }
    const deleteTask = (dateKey, index) => {
        const updated = { ...tasks };
        updated[dateKey] = updated[dateKey].filter((_, i) => i !== index);
        if (updated[dateKey].length === 0) delete updated[dateKey];
        setTasks(updated);
    };
    return (
        <div style={{ padding: "20px", maxWidth: "850px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📅 Calendario</h2>
            <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ padding: "8px 15px", border: "none", background: "#667eea", color: "#fff", borderRadius: "5px", cursor: "pointer" }}>←</button>
                <h3 style={{ margin: 0 }}>{months[month]} {year}</h3>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ padding: "8px 15px", border: "none", background: "#667eea", color: "#fff", borderRadius: "5px", cursor: "pointer" }}>→</button>
            </div>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px", marginBottom: "8px" }}>{daysOfWeek.map(d => <div key={d} style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>{d}</div>)}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>{days}</div>
            </div>
            {selectedDate && (
                <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginTop: "15px" }}>
                    <h3>📋 Tareas del {selectedDate}</h3>
                    {(tasks[selectedDate] || []).map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                            <span style={{ flex: 1 }}>{t}</span>
                            <button onClick={() => deleteTask(selectedDate, i)} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", padding: "5px 10px" }}>🗑️</button>
                        </div>
                    ))}
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nueva tarea..." style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }} />
                        <button onClick={() => { if (newTask) { setTasks({ ...tasks, [selectedDate]: [...(tasks[selectedDate] || []), newTask] }); setNewTask(""); } }} style={{ padding: "8px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Notas() {
    const [notes, setNotes] = useLocalStorage("pardo_notes", []);
    const [newNote, setNewNote] = React.useState("");
    const [color, setColor] = React.useState("#FFF9C4");
    const colors = ["#FFF9C4", "#FFCCBC", "#C8E6C9", "#BBDEFB", "#F8BBD0", "#D1C4E9", "#FFE0B2", "#B2DFDB"];
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📝 Notas</h2>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
                <textarea placeholder="Escribe una nota..." value={newNote} onChange={(e) => setNewNote(e.target.value)} style={{ width: "100%", padding: "10px", minHeight: "70px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "8px" }} />
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {colors.map(c => <button key={c} onClick={() => setColor(c)} style={{ width: "25px", height: "25px", borderRadius: "50%", background: c, border: color === c ? "2px solid #333" : "1px solid #ddd", cursor: "pointer" }}></button>)}
                    <button onClick={() => { if (newNote) { setNotes([{ id: Date.now(), text: newNote, color }, ...notes]); setNewNote(""); } }} style={{ marginLeft: "auto", padding: "8px 15px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                {notes.map(n => <div key={n.id} style={{ background: n.color, padding: "12px", borderRadius: "8px", minHeight: "100px", position: "relative" }}><button onClick={() => setNotes(notes.filter(x => x.id !== n.id))} style={{ position: "absolute", top: "5px", right: "5px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}>✕</button><p style={{ fontSize: "13px" }}>{n.text}</p></div>)}
            </div>
        </div>
    );
}

function Frases() {
    const quotes = [
        { text: "La disciplina es el puente entre metas y logros", author: "Jim Rohn", icon: "🎯" },
        { text: "El éxito es la suma de pequeños esfuerzos", author: "Robert Collier", icon: "💪" },
        { text: "No cuentes los días, haz que cuenten", author: "Muhammad Ali", icon: "📅" },
        { text: "El futuro se crea", author: "Peter Drucker", icon: "🔮" },
        { text: "Cada día es una nueva oportunidad", author: "Anónimo", icon: "🌅" }
    ];
    const [current, setCurrent] = React.useState(0);
    return (
        <div style={{ padding: "30px", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
            <h2>💬 Frases</h2>
            <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", marginTop: "15px" }}><div style={{ fontSize: "45px" }}>{quotes[current].icon}</div><p style={{ fontStyle: "italic" }}>"{quotes[current].text}"</p><p style={{ color: "#667eea", fontWeight: "bold" }}>— {quotes[current].author}</p></div>
            <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "15px" }}><button onClick={() => setCurrent((current - 1 + quotes.length) % quotes.length)} style={{ padding: "8px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer" }}>←</button><button onClick={() => setCurrent((current + 1) % quotes.length)} style={{ padding: "8px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer" }}>→</button></div>
        </div>
    );
}

function Servicios() {
    const services = [
        { name: "Drive", icon: "📁", url: "https://drive.google.com", color: "#4285F4" },
        { name: "Calendar", icon: "📅", url: "https://calendar.google.com", color: "#34A853" },
        { name: "Gmail", icon: "📧", url: "https://mail.google.com", color: "#EA4335" },
        { name: "Maps", icon: "🗺️", url: "https://maps.google.com", color: "#FBBC05" },
        { name: "YouTube", icon: "▶️", url: "https://youtube.com", color: "#FF0000" },
        { name: "Spotify", icon: "🎵", url: "https://spotify.com", color: "#1DB954" },
        { name: "Wikipedia", icon: "📚", url: "https://wikipedia.org", color: "#000" },
        { name: "ChatGPT", icon: "🤖", url: "https://chat.openai.com", color: "#10A37F" }
    ];
    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>🔧 Servicios</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px", marginTop: "20px" }}>
                {services.map(s => <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ padding: "15px", background: "#fff", borderRadius: "10px", textDecoration: "none", color: "#333", borderTop: "3px solid " + s.color, textAlign: "center" }}><div style={{ fontSize: "25px" }}>{s.icon}</div><div style={{ fontSize: "13px" }}>{s.name}</div></a>)}
            </div>
        </div>
    );
}

function Ajustes() {
    const [soundOn, setSoundOn] = React.useState(true);
    const [notifOn, setNotifOn] = React.useState(true);
    const [showPardo, setShowPardo] = React.useState(true);
    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>⚙️ Ajustes</h2>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}><span>🔊 Sonidos</span><button onClick={() => setSoundOn(!soundOn)} style={{ width: "50px", height: "26px", borderRadius: "13px", background: soundOn ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", marginLeft: soundOn ? "26px" : "2px" }} /></button></div>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}><span>🔔 Notificaciones</span><button onClick={() => setNotifOn(!notifOn)} style={{ width: "50px", height: "26px", borderRadius: "13px", background: notifOn ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", marginLeft: notifOn ? "26px" : "2px" }} /></button></div>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}><span>🐕 Mostrar Pardo</span><button onClick={() => setShowPardo(!showPardo)} style={{ width: "50px", height: "26px", borderRadius: "13px", background: showPardo ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", marginLeft: showPardo ? "26px" : "2px" }} /></button></div>
        </div>
    );
}

function MainApp({ user, logout }) {
    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Arial", display: "flex", flexDirection: "column" }}>
            <Navigation user={user} logout={logout} />
            <div style={{ flex: 1, padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<PanelHoy user={user} />} />
                    <Route path="/calendario" element={<Calendario />} />
                    <Route path="/diario" element={<Diario />} />
                    <Route path="/habitos" element={<Habitos />} />
                    <Route path="/notas" element={<Notas />} />
                    <Route path="/deseos" element={<Deseos />} />
                    <Route path="/frases" element={<Frases />} />
                    <Route path="/logros" element={<Logros />} />
                    <Route path="/estadisticas" element={<Estadisticas />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/exportar" element={<ExportData />} />
                    <Route path="/ajustes" element={<Ajustes />} />
                </Routes>
            </div>
            <InstallPWA />
            <Footer />
        </div>
    );
}

function App() {
    const { user, logout, loading } = useAuth();
    if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "60px" }}>🐕</div>;
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/*" element={user ? <MainApp user={user} logout={logout} /> : <Login />} />
            </Routes>
        </Router>
    );
}

function AppWrapper() {
    return <AuthProvider><App /></AuthProvider>;
}

export default AppWrapper;
