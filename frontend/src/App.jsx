import React, { useState } from "react";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [pardoMood, setPardoMood] = useState("happy");

    const categories = [
        { id: 1, name: "Trabajo y Profesional", icon: "💼" },
        { id: 2, name: "Educación y Aprendizaje", icon: "📚" },
        { id: 3, name: "Salud y Bienestar", icon: "💪" },
        { id: 4, name: "Hogar y Personal", icon: "🏠" },
        { id: 5, name: "Familia y Amigos", icon: "👨‍👩‍👧‍👦" },
        { id: 6, name: "Finanzas", icon: "💰" },
        { id: 7, name: "Metas y Proyectos", icon: "🎯" },
        { id: 8, name: "Alimentación", icon: "🍽️" },
        { id: 9, name: "Medio Ambiente", icon: "🌱" },
        { id: 10, name: "Creatividad y Ocio", icon: "🎨" }
    ];

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
            setNewTask("");
            setPardoMood("excited");
            setTimeout(() => setPardoMood("happy"), 2000);
        }
    };

    const completeTask = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
        setPardoMood("celebrating");
        setTimeout(() => setPardoMood("happy"), 3000);
    };

    const pardoEmojis = {
        happy: "🐕",
        excited: "🐕✨",
        celebrating: "🐕🎉"
    };

    const styles = {
        container: {
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            maxWidth: "1200px",
            margin: "0 auto",
            backgroundColor: "#f5f5f5",
            minHeight: "100vh"
        },
        header: {
            textAlign: "center",
            marginBottom: "30px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        },
        pardoSection: {
            textAlign: "center",
            marginBottom: "30px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        },
        pardoEmoji: {
            fontSize: "80px",
            animation: "bounce 2s infinite"
        },
        stats: {
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "15px"
        },
        statBadge: {
            backgroundColor: "#f0f0f0",
            padding: "8px 15px",
            borderRadius: "20px",
            fontWeight: "bold"
        },
        content: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
        },
        section: {
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        },
        categoriesGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "10px",
            marginTop: "15px"
        },
        categoryCard: {
            border: "2px solid #e0e0e0",
            padding: "15px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },
        taskInput: {
            display: "flex",
            gap: "10px",
            marginBottom: "20px"
        },
        input: {
            flex: 1,
            padding: "10px",
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            fontSize: "16px"
        },
        button: {
            padding: "10px 20px",
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
        },
        taskList: {
            listStyle: "none",
            padding: 0
        },
        taskItem: {
            padding: "10px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "10px"
        },
        completedTask: {
            textDecoration: "line-through",
            color: "#999"
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>🐕 Pardo Agenda</h1>
                <p>Tu mascota virtual te ayuda a organizarte</p>
            </header>

            <div style={styles.pardoSection}>
                <div style={styles.pardoEmoji}>{pardoEmojis[pardoMood]}</div>
                <div style={styles.stats}>
                    <span style={styles.statBadge}>❤️ 100</span>
                    <span style={styles.statBadge}>⚡ 85</span>
                    <span style={styles.statBadge}>🍖 30</span>
                    <span style={styles.statBadge}>⭐ Level 3</span>
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.section}>
                    <h2>Mis Categorías</h2>
                    <div style={styles.categoriesGrid}>
                        {categories.map(cat => (
                            <div key={cat.id} style={styles.categoryCard}>
                                <span style={{ fontSize: "24px" }}>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.section}>
                    <h2>Mis Tareas</h2>
                    <div style={styles.taskInput}>
                        <input 
                            type="text" 
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addTask()}
                            placeholder="Añadir nueva tarea..."
                            style={styles.input}
                        />
                        <button onClick={addTask} style={styles.button}>Añadir</button>
                    </div>
                    <ul style={styles.taskList}>
                        {tasks.map(task => (
                            <li key={task.id} style={styles.taskItem}>
                                <input 
                                    type="checkbox" 
                                    checked={task.completed}
                                    onChange={() => completeTask(task.id)}
                                />
                                <span style={task.completed ? styles.completedTask : {}}>
                                    {task.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
