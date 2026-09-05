import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

// ============ AUTH ============
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

// ============ LOGIN ============
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

// ============ FOOTER NEGRO ============
function Footer() {
    const [showOwner, setShowOwner] = React.useState(false);
    return (
        <footer style={{ background: "#000000", color: "#ffffff", padding: "25px 20px 10px", marginTop: "40px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
                <button onClick={() => setShowOwner(true)} style={{ padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontSize: "13px", marginBottom: "12px" }}>👤 Propietario</button>
                <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", marginBottom: "12px", fontSize: "12px" }}>
                    <a href="https://unique-biscochitos-31bcea.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none" }}>🌐 Manuel Casimiro</a>
                    <a href="https://thriving-otter-cc1e25.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none" }}>💻 Urukais KLick</a>
                    <a href="https://rad-dolphin-182dfb.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", textDecoration: "none" }}>✨ Guardianes</a>
                </div>
                <p style={{ fontSize: "10px", color: "#888", margin: 0 }}>© {new Date().getFullYear()} Pardo Agenda - Manuel Casimiro Carrasco</p>
            </div>
            {showOwner && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: "20px" }} onClick={() => setShowOwner(false)}>
                    <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", maxWidth: "450px", textAlign: "center", color: "#333" }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowOwner(false)} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
                        <div style={{ fontSize: "50px" }}>👨‍💻</div>
                        <h3 style={{ color: "#667eea" }}>Manuel Casimiro Carrasco</h3>
                        <p style={{ color: "#666", fontSize: "13px" }}>Desarrollador Web - Reus, Tarragona</p>
                    </div>
                </div>
            )}
        </footer>
    );
}

// ============ INSTALL PWA ============
function InstallPWA() {
    const [isInstalled, setIsInstalled] = React.useState(() => localStorage.getItem("pardo_installed") === "true");
    const [showInstructions, setShowInstructions] = React.useState(false);
    
    const handleInstall = () => {
        setShowInstructions(!showInstructions);
    };
    
    const markInstalled = () => {
        setIsInstalled(true);
        localStorage.setItem("pardo_installed", "true");
    };
    
    if (isInstalled) return null;
    
    return (
        <div style={{ marginTop: "20px", display: "inline-block" }}>
            <button onClick={handleInstall} style={{ padding: "15px 30px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}>
                📱 Instalar App
            </button>
            {showInstructions && (
                <div style={{ marginTop: "10px", background: "#fff", padding: "15px", borderRadius: "10px", textAlign: "left", fontSize: "12px" }}>
                    <p><strong>Android:</strong> Menú ⋮ → "Instalar aplicación"</p>
                    <p><strong>iPhone:</strong> Compartir → "Añadir a pantalla de inicio"</p>
                    <p><strong>Desktop:</strong> Icono ⊕ en barra de direcciones</p>
                    <button onClick={markInstalled} style={{ marginTop: "8px", padding: "8px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "12px" }}>✅ Ya la he instalado</button>
                </div>
            )}
        </div>
    );
}

// ============ LOGROS ============
function Logros() {
    const [xp] = React.useState(() => parseInt(localStorage.getItem("pardo_xp") || "0"));
    const achievements = [
        { icon: "🎯", name: "Primer Paso", desc: "Completa tu primera tarea" },
        { icon: "📔", name: "Escritor", desc: "Escribe en el diario" },
        { icon: "✅", name: "Creador", desc: "Crea un hábito" },
        { icon: "📝", name: "Notero", desc: "Crea una nota" },
        { icon: "⭐", name: "Soñador", desc: "Añade un deseo" },
        { icon: "🔥", name: "Racha", desc: "3 días seguidos" },
        { icon: "🌟", name: "Nivel 5", desc: "Alcanza 100 XP" },
        { icon: "👑", name: "Leyenda", desc: "Alcanza 500 XP" }
    ];
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>🏆 Logros</h2>
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "35px" }}>🐕</div>
                <h3>{xp} XP Total</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                {achievements.map((a, i) => (
                    <div key={i} style={{ background: "#fff", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
                        <div style={{ fontSize: "30px" }}>{a.icon}</div>
                        <h4 style={{ fontSize: "13px", margin: "8px 0" }}>{a.name}</h4>
                        <p style={{ fontSize: "11px", color: "#666" }}>{a.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============ HOME CON INSTALL ============
function Home({ user }) {
    const [tasks] = useLocalStorage("pardo_calendar", {});
    const [habits] = useLocalStorage("pardo_habits", []);
    const [diary] = useLocalStorage("pardo_diary", []);
    const greeting = new Date().getHours() < 12 ? "Buenos días" : new Date().getHours() < 20 ? "Buenas tardes" : "Buenas noches";
    return (
        <div style={{ padding: "25px", textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ fontSize: "70px" }}>🐕</div>
            <h1>{greeting}, {user?.username}!</h1>
            <p style={{ color: "#666" }}>Tienes {Object.keys(tasks).length} días con tareas, {habits.length} hábitos, {diary.length} entradas de diario</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginTop: "20px" }}>
                <div style={{ background: "#667eea", color: "#fff", padding: "15px", borderRadius: "10px" }}><div style={{ fontSize: "25px", fontWeight: "bold" }}>{Object.keys(tasks).length}</div><div style={{ fontSize: "11px" }}>Días con tareas</div></div>
                <div style={{ background: "#4CAF50", color: "#fff", padding: "15px", borderRadius: "10px" }}><div style={{ fontSize: "25px", fontWeight: "bold" }}>{habits.length}</div><div style={{ fontSize: "11px" }}>Hábitos</div></div>
                <div style={{ background: "#FF9800", color: "#fff", padding: "15px", borderRadius: "10px" }}><div style={{ fontSize: "25px", fontWeight: "bold" }}>{diary.length}</div><div style={{ fontSize: "11px" }}>Diario</div></div>
            </div>
            <InstallPWA />
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
        days.push(<div key={d} onClick={() => setSelectedDate(dateKey)} style={{ padding: "10px", textAlign: "center", background: isToday ? "#667eea" : "#fff", color: isToday ? "#fff" : "#333", borderRadius: "5px", border: "1px solid #ddd", cursor: "pointer" }}>{d}</div>);
    }
    return (
        <div style={{ padding: "20px", maxWidth: "850px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📅 Calendario</h2>
            <div style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ padding: "8px 15px", border: "none", background: "#667eea", color: "#fff", borderRadius: "5px", cursor: "pointer" }}>←</button>
                <h3 style={{ margin: 0 }}>{months[month]} {year}</h3>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ padding: "8px 15px", border: "none", background: "#667eea", color: "#fff", borderRadius: "5px", cursor: "pointer" }}>→</button>
            </div>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>{daysOfWeek.map(d => <div key={d} style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>{d}</div>)}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>{days}</div>
            </div>
            {selectedDate && (
                <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginTop: "15px" }}>
                    <h3>📋 {selectedDate}</h3>
                    {(tasks[selectedDate] || []).map((t, i) => <div key={i} style={{ display: "flex", gap: "8px", padding: "8px" }}><span style={{ flex: 1 }}>{t}</span><button onClick={() => { const updated = { ...tasks }; updated[selectedDate] = updated[selectedDate].filter((_, x) => x !== i); setTasks(updated); }} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>🗑️</button></div>)}
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}><input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nueva tarea..." style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }} /><button onClick={() => { if (newTask) { setTasks({ ...tasks, [selectedDate]: [...(tasks[selectedDate] || []), newTask] }); setNewTask(""); } }} style={{ padding: "8px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button></div>
                </div>
            )}
        </div>
    );
}

function Diario() {
    const [entries, setEntries] = useLocalStorage("pardo_diary", []);
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [mood, setMood] = React.useState("😊");
    const moods = ["😊", "😢", "😴", "😡", "🤗", "😰", "🤩", "😌"];
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📔 Mi Diario</h2>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
                <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "8px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <div style={{ display: "flex", gap: "5px", marginBottom: "8px" }}>{moods.map(m => <button key={m} onClick={() => setMood(m)} style={{ fontSize: "22px", background: "none", border: m === mood ? "2px solid #667eea" : "none", borderRadius: "50%", cursor: "pointer" }}>{m}</button>)}</div>
                <textarea placeholder="Escribe..." value={content} onChange={(e) => setContent(e.target.value)} style={{ width: "100%", padding: "10px", minHeight: "80px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "8px" }} />
                <button onClick={() => { if (title && content) { setEntries([{ id: Date.now(), title, content, mood, date: new Date().toLocaleDateString("es-ES") }, ...entries]); setTitle(""); setContent(""); } }} style={{ padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>💾 Guardar</button>
            </div>
            {entries.map(e => <div key={e.id} style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", borderLeft: "4px solid #fcb69f", position: "relative" }}><button onClick={() => setEntries(entries.filter(x => x.id !== e.id))} style={{ position: "absolute", top: "10px", right: "10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer" }}>🗑️</button><h3 style={{ fontSize: "15px", marginRight: "40px" }}>{e.mood} {e.title}</h3><p style={{ fontSize: "13px", fontStyle: "italic" }}>{e.content}</p><small style={{ color: "#999" }}>{e.date}</small></div>)}
        </div>
    );
}

function Habitos() {
    const [habits, setHabits] = useLocalStorage("pardo_habits", []);
    const [newHabit, setNewHabit] = React.useState("");
    const daysOfWeek = ["L", "M", "X", "J", "V", "S", "D"];
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>✅ Hábitos</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
                <input type="text" placeholder="Nuevo hábito..." value={newHabit} onChange={(e) => setNewHabit(e.target.value)} style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <button onClick={() => { if (newHabit) { setHabits([...habits, { id: Date.now(), name: newHabit, icon: "⭐", days: [false,false,false,false,false,false,false] }]); setNewHabit(""); } }} style={{ padding: "10px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
            </div>
            {habits.map(h => <div key={h.id} style={{ background: "#fff", padding: "12px", borderRadius: "10px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><span>{h.icon}</span><span style={{ flex: 1, fontWeight: "bold", fontSize: "14px" }}>{h.name}</span><div style={{ display: "flex", gap: "4px" }}>{h.days.map((done, i) => <button key={i} onClick={() => setHabits(habits.map(x => x.id === h.id ? { ...x, days: x.days.map((d, di) => di === i ? !d : d) } : x))} style={{ width: "26px", height: "26px", borderRadius: "50%", border: "2px solid #667eea", background: done ? "#667eea" : "#fff", color: done ? "#fff" : "#667eea", cursor: "pointer", fontSize: "9px" }}>{daysOfWeek[i]}</button>)}</div><button onClick={() => setHabits(habits.filter(x => x.id !== h.id))} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", padding: "5px 8px" }}>🗑️</button></div>)}
        </div>
    );
}

function Notas() {
    const [notes, setNotes] = useLocalStorage("pardo_notes", []);
    const [newNote, setNewNote] = React.useState("");
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>📝 Notas</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
                <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Escribe una nota..." style={{ flex: 1, padding: "10px", minHeight: "70px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <button onClick={() => { if (newNote) { setNotes([{ id: Date.now(), text: newNote }, ...notes]); setNewNote(""); } }} style={{ padding: "10px 15px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
            </div>
            {notes.map(n => <div key={n.id} style={{ background: "#fff", padding: "12px", borderRadius: "8px", marginBottom: "8px", position: "relative" }}><button onClick={() => setNotes(notes.filter(x => x.id !== n.id))} style={{ position: "absolute", top: "5px", right: "5px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}>✕</button><p>{n.text}</p></div>)}
        </div>
    );
}

function Deseos() {
    const [wishes, setWishes] = useLocalStorage("pardo_wishes", []);
    const [newWish, setNewWish] = React.useState("");
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>⭐ Deseos</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
                <input type="text" placeholder="Añadir deseo..." value={newWish} onChange={(e) => setNewWish(e.target.value)} style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <button onClick={() => { if (newWish) { setWishes([{ id: Date.now(), text: newWish, done: false }, ...wishes]); setNewWish(""); } }} style={{ padding: "10px 15px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
            </div>
            {wishes.map(w => <div key={w.id} style={{ background: "#fff", padding: "10px", borderRadius: "8px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><input type="checkbox" checked={w.done} onChange={() => setWishes(wishes.map(x => x.id === w.id ? { ...x, done: !x.done } : x))} /><span style={{ flex: 1 }}>{w.text}</span><button onClick={() => setWishes(wishes.filter(x => x.id !== w.id))} style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", padding: "5px 8px" }}>🗑️</button></div>)}
        </div>
    );
}

function Frases() {
    const quotes = [
        { text: "La disciplina es el puente entre metas y logros", author: "Jim Rohn", icon: "🎯" },
        { text: "El éxito es la suma de pequeños esfuerzos", author: "Robert Collier", icon: "💪" },
        { text: "No cuentes los días, haz que cuenten", author: "Muhammad Ali", icon: "📅" }
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
        { name: "YouTube", icon: "▶️", url: "https://youtube.com", color: "#FF0000" },
        { name: "Spotify", icon: "🎵", url: "https://spotify.com", color: "#1DB954" },
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

function MainApp({ user, logout }) {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menu = [
        { path: "/", icon: "🏠", name: "Hoy" },
        { path: "/calendario", icon: "📅", name: "Calendario" },
        { path: "/diario", icon: "📔", name: "Diario" },
        { path: "/habitos", icon: "✅", name: "Hábitos" },
        { path: "/notas", icon: "📝", name: "Notas" },
        { path: "/deseos", icon: "⭐", name: "Deseos" },
        { path: "/logros", icon: "🏆", name: "Logros" },
        { path: "/frases", icon: "💬", name: "Frases" },
        { path: "/servicios", icon: "🔧", name: "Servicios" }
    ];
    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Arial", display: "flex", flexDirection: "column" }}>
            <nav style={{ background: "#fff", padding: "10px 15px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link to="/" style={{ fontSize: "20px", fontWeight: "bold", color: "#667eea", textDecoration: "none" }}>🐕 Pardo</Link>
                    {isMobile ? (
                        <button onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}>{menuOpen ? "✕" : "☰"}</button>
                    ) : (
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                            {menu.map(m => <Link key={m.path} to={m.path} style={{ padding: "7px 10px", borderRadius: "20px", textDecoration: "none", color: "#333", background: "#f0f0f0", fontSize: "12px" }}>{m.icon} {m.name}</Link>)}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px" }}>👤 {user?.username}</span>
                        <button onClick={logout} style={{ padding: "5px 10px", background: "#f44336", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "11px" }}>Salir</button>
                    </div>
                </div>
                {isMobile && menuOpen && (
                    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
                        {menu.map(m => <Link key={m.path} to={m.path} onClick={() => setMenuOpen(false)} style={{ padding: "10px 15px", borderRadius: "8px", textDecoration: "none", color: "#333", background: "#f8f9fa", fontSize: "14px" }}>{m.icon} {m.name}</Link>)}
                    </div>
                )}
            </nav>
            <div style={{ flex: 1, padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/calendario" element={<Calendario />} />
                    <Route path="/diario" element={<Diario />} />
                    <Route path="/habitos" element={<Habitos />} />
                    <Route path="/notas" element={<Notas />} />
                    <Route path="/deseos" element={<Deseos />} />
                    <Route path="/logros" element={<Logros />} />
                    <Route path="/frases" element={<Frases />} />
                    <Route path="/servicios" element={<Servicios />} />
                </Routes>
            </div>
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
