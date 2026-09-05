import React from "react";

function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = React.useState(null);
    const [isInstalled, setIsInstalled] = React.useState(false);
    const [showInstructions, setShowInstructions] = React.useState(false);
    
    React.useEffect(() => {
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        const handleInstalled = () => {
            setIsInstalled(true);
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
            if (result.outcome === "accepted") setIsInstalled(true);
            setDeferredPrompt(null);
        } else {
            setShowInstructions(true);
        }
    };
    
    if (isInstalled) {
        return <div style={{ padding: "10px", textAlign: "center", color: "#4CAF50", fontWeight: "bold" }}>✅ Aplicación instalada</div>;
    }
    
    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
            <h3>📱 Instalar Pardo Agenda</h3>
            <p style={{ fontSize: "13px", color: "#666" }}>Instala la app en tu dispositivo para acceso rápido</p>
            <button onClick={handleInstall} style={{ padding: "15px 30px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
                📱 Instalar App
            </button>
            
            {showInstructions && (
                <div style={{ marginTop: "20px", background: "#f8f9fa", padding: "15px", borderRadius: "10px", textAlign: "left", fontSize: "13px" }}>
                    <h4>📋 Instrucciones de instalación:</h4>
                    <p><strong>Android (Chrome):</strong> Menú ⋮ → "Instalar aplicación" o "Añadir a pantalla de inicio"</p>
                    <p><strong>iPhone/iPad (Safari):</strong> Botón Compartir → "Añadir a pantalla de inicio"</p>
                    <p><strong>Desktop (Chrome):</strong> Icono ⊕ en la barra de direcciones</p>
                </div>
            )}
        </div>
    );
}

export default InstallPWA;
