import React from "react";

function DarkModeToggle() {
    const [darkMode, setDarkMode] = React.useState(() => localStorage.getItem("pardo_dark") === "true");
    
    React.useEffect(() => {
        localStorage.setItem("pardo_dark", darkMode.toString());
        if (darkMode) {
            document.body.style.backgroundColor = "#1a1a2e";
            document.body.style.color = "#fff";
        } else {
            document.body.style.backgroundColor = "#f5f5f5";
            document.body.style.color = "#333";
        }
    }, [darkMode]);
    
    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
                padding: "8px 15px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                background: darkMode ? "#1a1a2e" : "#fff",
                color: darkMode ? "#FFD700" : "#333",
                cursor: "pointer",
                fontSize: "13px"
            }}
        >
            {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>
    );
}

export default DarkModeToggle;
