import React from "react";

function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = React.useState(null);
    const [isInstalled, setIsInstalled] = React.useState(false);
    const [showInstructions, setShowInstructions] = React.useState(false);
    const [isStandalone, setIsStandalone] = React.useState(false);
    
    React.useEffect(() => {
        setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);
        
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        
        const handleInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };
        
        window.addEventListener("beforeinstallprompt", handleBeforeInstall);
        window.addEventListener("appinstalled", handleInstalled);
        
        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
            window.removeEventListener("appinstalled", handleInstalled);
        };
    }, []);
    
    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            if (result.outcome === "accepted") {
                setIsInstalled(true);
            }
            setDeferredPrompt(null);
        } else {
            setShowInstructions(true);
        }
    };
    
    if (isInstalled || isStandalone) {
        return (
            <div style={{ background: "#d4edda", color: "#155724", padding: "20px", borderRadius: "10px", textAlign: "center", marginBottom: "15px" }}>
                <h3>✅ ¡Pardo Agenda está instalada!</h3>
                <p style={{ fontSize: "13px" }}>La aplicación está funcionando en modo instalado.</p>
            </div>
        );
    }
    
    return (
        <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", marginBottom: "15px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📱</div>
            <h3>Instalar Pardo Agenda</h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "15px" }}>
                Instala la app en tu dispositivo para acceso rápido y funcionamiento offline
            </p>
            
            {deferredPrompt && (
                <button onClick={handleInstall} style={{
                    padding: "15px 30px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    animation: "pulse 2s infinite"
                }}>
                    📱 Instalar Ahora
                </button>
            )}
            
            {!deferredPrompt && (
                <button onClick={() => setShowInstructions(!showInstructions)} style={{
                    padding: "15px 30px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px"
                }}>
                    📱 Ver Instrucciones
                </button>
            )}
            
            {showInstructions && (
                <div style={{ marginTop: "20px", background: "#f8f9fa", padding: "15px", borderRadius: "10px", textAlign: "left", fontSize: "13px" }}>
                    <h4>📋 Cómo instalar:</h4>
                    <p><strong>🟢 Android (Chrome):</strong></p>
                    <p>1. Abre el menú ⋮ (3 puntos arriba)</p>
                    <p>2. Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"</p>
                    <p><strong>🍎 iPhone/iPad (Safari):</strong></p>
                    <p>1. Toca el botón Compartir (cuadrado con flecha)</p>
                    <p>2. Selecciona "Añadir a pantalla de inicio"</p>
                    <p><strong>💻 Desktop (Chrome/Edge):</strong></p>
                    <p>1. Mira el icono ⊕ o 📱 en la barra de direcciones</p>
                    <p>2. Click en "Instalar"</p>
                </div>
            )}
        </div>
    );
}

export default InstallPWA;
