import React, { useEffect, useState } from "react";

function AdminPanel({ user }) {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const isAdmin = user && user.email === "admin@pardo.com";

    const loadUsers = async () => {
        setLoading(true);
        setMessage("");
        const token = localStorage.getItem("pardo_token");
        if (!token) {
            setMessage("No hay sesión. Inicia sesión como admin@pardo.com");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch((process.env.REACT_APP_API_URL || "https://pardo-backend-3fp6.onrender.com") + "/api/admin/users", {
                headers: { Authorization: "Bearer " + token }
            });
            const contentType = response.headers.get("content-type");
            if (response.status === 401) {
                setMessage("No autorizado. Asegúrate de ser admin@pardo.com.");
                setLoading(false);
                return;
            }
            if (response.status === 403) {
                setMessage("Requiere permisos de administrador.");
                setLoading(false);
                return;
            }
            if (response.ok && contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setUsers(data.users || []);
            } else {
                const text = await response.text();
                setMessage("Respuesta no JSON: " + text);
            }
        } catch (err) {
            setMessage("Error de red: " + err.message);
        }
        setLoading(false);
    };

    useEffect(() => { loadUsers(); }, []);

    const deleteUser = async (id) => {
        if (!window.confirm("Eliminar este usuario?")) return;
        const token = localStorage.getItem("pardo_token");
        try {
            const response = await fetch((process.env.REACT_APP_API_URL || "https://pardo-backend-3fp6.onrender.com") + "/api/admin/users/" + id, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token }
            });
            if (response.ok) {
                setMessage("Usuario eliminado");
                loadUsers();
            } else {
                const text = await response.text();
                setMessage("Error al eliminar: " + text);
            }
        } catch (err) {
            setMessage("Error de red: " + err.message);
        }
    };

    if (!isAdmin) {
        return <div style={{ padding: "40px", textAlign: "center" }}><h2>Acceso denegado</h2><p>Solo el administrador puede ver este panel.</p></div>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Panel de Administración</h2>
            {message && <p style={{ color: "#f44336" }}>{message}</p>}
            {loading ? <p>Cargando...</p> : null}
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
