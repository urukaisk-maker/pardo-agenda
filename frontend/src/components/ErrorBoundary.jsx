import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error capturado:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <div style={{ fontSize: "60px" }}>🐕</div>
                    <h2>¡Ups! Algo salió mal</h2>
                    <p>Pardo está trabajando para arreglarlo</p>
                    <button onClick={() => window.location.reload()} style={{ padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>🔄 Recargar</button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
