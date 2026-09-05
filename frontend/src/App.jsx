import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";

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

// ============ LOCAL STORAGE HOOK ============
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

// ============ PANEL HOY INTELIGENTE ============
function PanelHoy({ user }) {
    const [tasks] = useLocalStorage("pardo_calendar", {});
    const [habits] = useLocalStorage("pardo_habits", []);
    const [diary] = useLocalStorage("pardo_diary", []);
    
    const today = new Date();
    const todayKey = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");
    const todayTasks = tasks[todayKey] || [];
    const pendingHabits = habits.filter(h => h.days && !h.days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
    const lastDiaryEntry = diary.length > 0 ? diary[0] : null;
    const streak = habits.filter(h => h.days && h.days.every(d => d)).length;
    
    const greeting = today.getHours() < 12 ? "Buenos días" : today.getHours() < 20 ? "Buenas tardes" : "Buenas noches";
    
    return (
        <div style={{ padding: "25px", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
                <div style={{ fontSize: "60px" }}>🐕</div>
                <h1 style={{ fontSize: "24px" }}>{greeting}, {user?.username}!</h1>
                <p style={{ color: "#666" }}>
                    Tienes {todayTasks.length} tareas hoy, {pendingHabits.length} hábitos pendientes
                    {lastDiaryEntry ? ` y tu último diario fue "${lastDiaryEntry.title}"` : ""}.
                    {streak > 0 ? ` Tu racha es de ${streak} hábitos completados.` : ""}
                </p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "25px" }}>
                <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>📋</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{todayTasks.length}</div>
                    <div style={{ fontSize: "12px" }}>Tareas hoy</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #4CAF50, #45a049)", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>✅</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{pendingHabits.length}</div>
                    <div style={{ fontSize: "12px" }}>Hábitos pendientes</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #FF9800, #f57c00)", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>📔</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{diary.length}</div>
                    <div style={{ fontSize: "12px" }}>Entradas de diario</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #f44336, #d32f2f)", color: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>🔥</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{streak}</div>
                    <div style={{ fontSize: "12px" }}>Racha</div>
                </div>
            </div>
            
            {todayTasks.length > 0 && (
                <div style={{ background: "#fff", padding: "20px", borderRadius: "15px", marginBottom: "15px" }}>
                    <h3 style={{ fontSize: "16px" }}>📋 Tareas de hoy</h3>
                    {todayTasks.map((t, i) => <div key={i} style={{ padding: "10px", borderBottom: "1px solid #f0f0f0", fontSize: "14px" }}>• {t}</div>)}
                </div>
            )}
            
            {lastDiaryEntry && (
                <div style={{ background: "#fff", padding: "20px", borderRadius: "15px" }}>
                    <h3 style={{ fontSize: "16px" }}>📔 Última entrada de diario</h3>
                    <p style={{ fontSize: "14px", fontStyle: "italic" }}>{lastDiaryEntry.mood} "{lastDiaryEntry.title}"</p>
                    <p style={{ fontSize: "13px", color: "#555" }}>{lastDiaryEntry.content}</p>
                </div>
            )}
        </div>
    );
}

// ============ CALENDARIO CON PRIORIDADES ============
function Calendario() {
    const [tasks, setTasks] = useLocalStorage("pardo_calendar", {});
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [newTask, setNewTask] = React.useState("");
    const [priority, setPriority] = React.useState("media");
    const [tag, setTag] = React.useState("personal");
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const tags = ["personal", "trabajo", "salud", "estudios", "familia"];
    const priorities = [
        { id: "alta", icon: "🔴", color: "#f44336" },
        { id: "media", icon: "🟡", color: "#FF9800" },
        { id: "baja", icon: "🟢", color: "#4CAF50" }
    ];
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
        days.push(
            <div key={d} onClick={() => setSelectedDate(dateKey)} style={{ padding: "10px", textAlign: "center", background: isToday ? "#667eea" : "#fff", color: isToday ? "#fff" : "#333", borderRadius: "5px", border: dayTasks.length > 0 ? "2px solid #4CAF50" : "1px solid #ddd", cursor: "pointer" }}>
                {d}
                {dayTasks.length > 0 && <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginTop: "3px" }}>{dayTasks.slice(0,3).map((t, i) => <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: t.priority === "alta" ? "#f44336" : t.priority === "media" ? "#FF9800" : "#4CAF50" }} />)}</div>}
            </div>
        );
    }
    const addTask = () => {
        if (newTask && selectedDate) {
            const updated = { ...tasks, [selectedDate]: [...(tasks[selectedDate] || []), { id: Date.now(), text: newTask, priority, tag }] };
            setTasks(updated);
            setNewTask("");
        }
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
                            <span>{t.priority === "alta" ? "🔴" : t.priority === "media" ? "🟡" : "🟢"}</span>
                            <span style={{ flex: 1, fontSize: "14px" }}>{t.text}</span>
                            <span style={{ fontSize: "10px", background: "#f0f0f0", padding: "2px 8px", borderRadius: "10px" }}>{t.tag}</span>
                            <button onClick={() => setTasks({ ...tasks, [selectedDate]: tasks[selectedDate].filter((x, xi) => xi !== i) })} style={{ background: "none", border: "none", cursor: "pointer" }}>🗑️</button>
                        </div>
                    ))}
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nueva tarea..." style={{ flex: 1, minWidth: "150px", padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }} />
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }}>
                            {priorities.map(p => <option key={p.id} value={p.id}>{p.icon} {p.id}</option>)}
                        </select>
                        <select value={tag} onChange={(e) => setTag(e.target.value)} style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }}>
                            {tags.map(t => <option key={t} value={t}>#{t}</option>)}
                        </select>
                        <button onClick={addTask} style={{ padding: "8px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============ DIARIO ============
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
            {entries.map(e => <div key={e.id} style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", borderLeft: "4px solid #fcb69f" }}><h3 style={{ fontSize: "15px" }}>{e.mood} {e.title}</h3><p style={{ fontSize: "13px", fontStyle: "italic" }}>{e.content}</p><small style={{ color: "#999" }}>{e.date}</small></div>)}
        </div>
    );
}

// ============ HÁBITOS ============
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
            {habits.map(h => <div key={h.id} style={{ background: "#fff", padding: "12px", borderRadius: "10px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><span>{h.icon}</span><span style={{ flex: 1, fontWeight: "bold", fontSize: "14px" }}>{h.name}</span><div style={{ display: "flex", gap: "4px" }}>{h.days.map((done, i) => <button key={i} onClick={() => setHabits(habits.map(x => x.id === h.id ? { ...x, days: x.days.map((d, di) => di === i ? !d : d) } : x))} style={{ width: "28px", height: "28px", borderRadius: "50%", border: "2px solid #667eea", background: done ? "#667eea" : "#fff", color: done ? "#fff" : "#667eea", cursor: "pointer", fontSize: "10px" }}>{daysOfWeek[i]}</button>)}</div></div>)}
        </div>
    );
}

// ============ NOTAS ============
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
                    <button onClick={() => { if (newNote) { setNotes([{ id: Date.now(), text: newNote, color }, ...notes]); setNewNote(""); } }} style={{ marginLeft: "auto", padding: "8px 15px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕ Añadir</button>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                {notes.map(n => <div key={n.id} style={{ background: n.color, padding: "12px", borderRadius: "8px", minHeight: "100px", position: "relative" }}><button onClick={() => setNotes(notes.filter(x => x.id !== n.id))} style={{ position: "absolute", top: "5px", right: "5px", background: "none", border: "none", cursor: "pointer" }}>✕</button><p style={{ fontSize: "13px" }}>{n.text}</p></div>)}
            </div>
        </div>
    );
}

// ============ DESEOS ============
function Deseos() {
    const [wishes, setWishes] = useLocalStorage("pardo_wishes", []);
    const [newWish, setNewWish] = React.useState("");
    const [category, setCategory] = React.useState("🌟");
    const cats = [{ icon: "🌟", name: "General" }, { icon: "📚", name: "Libros" }, { icon: "🎬", name: "Películas" }, { icon: "✈️", name: "Viajes" }];
    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>⭐ Deseos</h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px", flexWrap: "wrap" }}>
                <input type="text" placeholder="Añadir deseo..." value={newWish} onChange={(e) => setNewWish(e.target.value)} style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }} />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>{cats.map(c => <option key={c.icon} value={c.icon}>{c.icon} {c.name}</option>)}</select>
                <button onClick={() => { if (newWish) { setWishes([{ id: Date.now(), text: newWish, category, done: false }, ...wishes]); setNewWish(""); } }} style={{ padding: "10px 15px", background: "#FF9800", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>➕</button>
            </div>
            {wishes.map(w => <div key={w.id} style={{ background: "#fff", padding: "10px", borderRadius: "8px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}><input type="checkbox" checked={w.done} onChange={() => setWishes(wishes.map(x => x.id === w.id ? { ...x, done: !x.done } : x))} /><span>{w.category}</span><span style={{ flex: 1, fontSize: "14px" }}>{w.text}</span></div>)}
        </div>
    );
}

// ============ FRASES ============
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

// ============ SERVICIOS ============
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

// ============ AJUSTES ============
function Ajustes() {
    const [soundOn, setSoundOn] = React.useState(true);
    const [notifOn, setNotifOn] = React.useState(true);
    const [showPardo, setShowPardo] = React.useState(true);
    const [fontSize, setFontSize] = React.useState("mediano");
    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center" }}>⚙️ Ajustes</h2>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}><span>🔊 Sonidos</span><button onClick={() => setSoundOn(!soundOn)} style={{ width: "50px", height: "26px", borderRadius: "13px", background: soundOn ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", marginLeft: soundOn ? "26px" : "2px" }} /></button></div>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}><span>🔔 Notificaciones</span><button onClick={() => setNotifOn(!notifOn)} style={{ width: "50px", height: "26px", borderRadius: "13px", background: notifOn ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", marginLeft: notifOn ? "26px" : "2px" }} /></button></div>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}><span>🐕 Mostrar Pardo</span><button onClick={() => setShowPardo(!showPardo)} style={{ width: "50px", height: "26px", borderRadius: "13px", background: showPardo ? "#4CAF50" : "#ccc", border: "none", cursor: "pointer" }}><div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fff", marginLeft: showPardo ? "26px" : "2px" }} /></button></div>
            <div style={{ background: "#fff", padding: "15px", borderRadius: "10px" }}><span>🔤 Tamaño de letra</span><div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>{["pequeño", "mediano", "grande"].map(s => <button key={s} onClick={() => setFontSize(s)} style={{ padding: "8px 15px", borderRadius: "20px", border: fontSize === s ? "2px solid #667eea" : "1px solid #ddd", background: fontSize === s ? "#667eea" : "#fff", color: fontSize === s ? "#fff" : "#333", cursor: "pointer" }}>{s}</button>)}</div></div>
        </div>
    );
}

// ============ MAIN ============
function MainApp({ user, logout }) {
    const menu = [
        { path: "/", icon: "🏠", name: "Hoy" },
        { path: "/calendario", icon: "📅", name: "Calendario" },
        { path: "/diario", icon: "📔", name: "Diario" },
        { path: "/habitos", icon: "✅", name: "Hábitos" },
        { path: "/notas", icon: "📝", name: "Notas" },
        { path: "/deseos", icon: "⭐", name: "Deseos" },
        { path: "/frases", icon: "💬", name: "Frases" },
        { path: "/servicios", icon: "🔧", name: "Servicios" },
        { path: "/ajustes", icon: "⚙️", name: "Ajustes" }
    ];
    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Arial", display: "flex", flexDirection: "column" }}>
            <nav style={{ background: "#fff", padding: "10px 15px", display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
                {menu.map(m => <Link key={m.path} to={m.path} style={{ padding: "8px 12px", borderRadius: "20px", textDecoration: "none", color: "#333", background: "#f0f0f0", fontSize: "13px" }}>{m.icon} {m.name}</Link>)}
                <span style={{ marginLeft: "auto", fontSize: "13px" }}>👤 {user?.username}</span>
                <button onClick={logout} style={{ padding: "6px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: "15px", cursor: "pointer" }}>Salir</button>
            </nav>
            <div style={{ flex: 1, padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<PanelHoy user={user} />} />
                    <Route path="/calendario" element={<Calendario />} />
                    <Route path="/diario" element={<Diario />} />
                    <Route path="/habitos" element={<Habitos />} />
                    <Route path="/notas" element={<Notas />} />
                    <Route path="/deseos" element={<Deseos />} />
                    <Route path="/frases" element={<Frases />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/ajustes" element={<Ajustes />} />
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
