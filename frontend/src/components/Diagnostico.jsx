import React from "react";
import { Link } from "react-router-dom";

function Diagnostico() {
    const secciones = [
        { path: "/", name: "Inicio" },
        { path: "/calendario", name: "Calendario" },
        { path: "/diario", name: "Diario" },
        { path: "/habitos", name: "Hábitos" },
        { path: "/notas", name: "Notas" },
        { path: "/deseos", name: "Deseos" },
        { path: "/logros", name: "Logros" },
        { path: "/estadisticas", name: "Estadísticas" },
        { path: "/servicios", name: "Servicios" },
        { path: "/exportar", name: "Exportar" },
        { path: "/notificaciones", name: "Alertas" },
        { path: "/notificaciones-push", name: "Push" },
        { path: "/progreso", name: "Progreso" },
        { path: "/admin", name: "Admin" },
        { path: "/buscador", name: "Buscador" },
        { path: "/temas", name: "Temas" },
        { path: "/asistente", name: "Asistente IA" },
        { path: "/idiomas", name: "Idiomas" },
        { path: "/pomodoro", name: "Pomodoro" },
        { path: "/compras", name: "Compras" },
        { path: "/contactos", name: "Contactos" },
        { path: "/calculadora", name: "Calculadora" },
        { path: "/juego", name: "Juego" },
        { path: "/recordatorios", name: "Recordatorios" }
    ];
    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>🧭 Página de Diagnóstico</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {secciones.map(s => (
                    <Link key={s.path} to={s.path} style={{ padding: "10px", background: "#f0f0f0", borderRadius: "8px", textDecoration: "none", color: "#333" }}>
                        {s.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Diagnostico;
