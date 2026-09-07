import React, { useEffect, useState } from "react";
import { fetchAPI } from "../hooks/useAPI";


function AdminPanel({ user }) {
    const { user } = props;
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    const isAdmin = user && user.email === "admin@pardo.com";

    const loadUsers = async () => {
        if (!isAdmin) return;
        const data = await fetchAPI("/api/admin/users");
        if (data && data.users) setUsers(data.users);
        else setMessage("No se pudo cargar usuarios");
    };

    useEffect(() => { loadUsers(); }, [isAdmin]);

    const deleteUser = async (id) => {
        if (window.confirm("¿Eliminar este usuario?")) {
            const result = await fetchAPI(`/api/admin/users/${id}`, { method: "DELETE" });
            if (result && result.error) setMessage(result.error);
            else { setMessage("Usuario eliminado"); loadUsers(); }
        }
    };

    if (!isAdmin) {
        return <div style={{ padding: \"40px\", textAlign: \"center\" }}><h2>🛡️ Acceso denegado</h2><p>Solo el administrador puede ver este panel.</p></div>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>🛡️ Panel de Administración</h2>
            {message && <p>{message}</p>}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#667eea", color: "#fff" }}><th>Usuario</th><th>Email</th><th>Acciones</th></tr></thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: "1px solid #ddd" }}>
                            <td>{u.username}</td><td>{u.email}</td><td>
                                {u.email !== "admin@pardo.com" && <button onClick={() => deleteUser(u.id)}>🗑️</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPanel;
