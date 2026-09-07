import React, { useEffect, useState } from "react";

function AdminPanel({ user }) {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const isAdmin = user && user.email === "admin@pardo.com";

    const loadUsers = async () => {
        const token = localStorage.getItem("pardo_token");
        if (!token) return;
        try {
            const response = await fetch(process.env.REACT_APP_API_URL || "https://pardo-backend-3fp6.onrender.com" + "/api/admin/users", {
                headers: { Authorization: "Bearer " + token }
            });
            const data = await response.json();
            if (response.ok) setUsers(data.users || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadStats = async () => {
        const token = localStorage.getItem("pardo_token");
        if (!token) return;
        try {
            const response = await fetch(process.env.REACT_APP_API_URL || "https://pardo-backend-3fp6.onrender.com" + "/api/admin/stats", {
                headers: { Authorization: "Bearer " + token }
            });
            const data = await response.json();
            if (response.ok) setStats(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadUsers();
        loadStats();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm("Eliminar este usuario?")) return;
        const token = localStorage.getItem("pardo_token");
        try {
            const response = await fetch(process.env.REACT_APP_API_URL || "https://pardo-backend-3fp6.onrender.com" + "/api/admin/users/" + id, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token }
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Usuario eliminado");
                loadUsers();
                loadStats();
            } else {
                setMessage(data.error || "Error al eliminar");
            }
        } catch (err) {
            setMessage("Error de red: " + err.message);
        }
    };

    if (!isAdmin) {
        return <div style={{ padding: "40px", textAlign: "center" }}><h2>Acceso denegado</h2><p>Solo el administrador puede ver este panel.</p></div>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <h2>Panel de Administración</h2>
            {message && <p style={{ color: "#f44336" }}>{message}</p>}
            {loading ? <p>Cargando...</p> : null}

            {stats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginBottom: "25px" }}>
                    <div style={{ background: "#667eea", color: "#fff", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.users}</div>
                        <div style={{ fontSize: "11px" }}>Usuarios</div>
                    </div>
                    <div style={{ background: "#4CAF50", color: "#fff", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.tasks}</div>
                        <div style={{ fontSize: "11px" }}>Tareas</div>
                    </div>
                    <div style={{ background: "#FF9800", color: "#fff", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.notes}</div>
                        <div style={{ fontSize: "11px" }}>Notas</div>
                    </div>
                    <div style={{ background: "#9C27B0", color: "#fff", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.diary}</div>
                        <div style={{ fontSize: "11px" }}>Diario</div>
                    </div>
                    <div style={{ background: "#f44336", color: "#fff", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.habits}</div>
                        <div style={{ fontSize: "11px" }}>Hábitos</div>
                    </div>
                    <div style={{ background: "#00bcd4", color: "#fff", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.wishes}</div>
                        <div style={{ fontSize: "11px" }}>Deseos</div>
                    </div>
                </div>
            )}

            {users.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ background: "#667eea", color: "#fff" }}><th>Usuario</th><th>Email</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: "1px solid #ddd" }}>
                                <td>{u.username}</td><td>{u.email}</td><td>
                                    {u.email !== "admin@pardo.com" && <button onClick={() => deleteUser(u.id)}>Eliminar</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminPanel;
