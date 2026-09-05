import React from "react";

function Footer() {
    const [showOwner, setShowOwner] = React.useState(false);
    
    return (
        <footer style={{ background: "linear-gradient(135deg, #2c3e50, #34495e)", color: "#fff", padding: "30px 15px", marginTop: "40px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                <button onClick={() => setShowOwner(true)} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: "25px", cursor: "pointer", fontSize: "13px", marginBottom: "15px" }}>👤 Propietario</button>
                <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", marginBottom: "15px", fontSize: "12px" }}>
                    <a href="https://unique-biscochitos-31bcea.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#a8c0e0", textDecoration: "none" }}>🌐 Manuel Casimiro</a>
                    <a href="https://thriving-otter-cc1e25.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#a8c0e0", textDecoration: "none" }}>💻 Urukais KLick</a>
                    <a href="https://rad-dolphin-182dfb.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", textDecoration: "none" }}>✨ Guardianes Silenciosos</a>
                </div>
                <p style={{ fontSize: "11px", color: "#888" }}>© {new Date().getFullYear()} Pardo Agenda - Manuel Casimiro Carrasco</p>
            </div>
            
            {showOwner && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px" }} onClick={() => setShowOwner(false)}>
                    <div style={{ background: "#fff", padding: "30px", borderRadius: "20px", maxWidth: "450px", maxHeight: "80vh", overflowY: "auto", textAlign: "center", color: "#333" }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowOwner(false)} style={{ float: "right", background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>✕</button>
                        <div style={{ fontSize: "50px", marginBottom: "10px" }}>👨‍💻</div>
                        <h3 style={{ color: "#667eea" }}>Manuel Casimiro Carrasco</h3>
                        <p style={{ color: "#666", fontSize: "14px" }}>Desarrollador Web - Reus, Tarragona (España)</p>
                        <div style={{ textAlign: "left", fontSize: "13px", lineHeight: "1.8", color: "#555" }}>
                            <p>Es un desarrollador web con experiencia en el campo de la tecnología.</p>
                            <p>Nuestra visión es tu visión y somos buenos en imaginar visiones que tú estás imaginando y haremos que esa visión que estás imaginando se convierta en realidad y lo hacemos bien.</p>
                            <p>Esa pasión lo llevó a estudiar una carrera relacionada con el desarrollo web. Durante sus años de formación, Manuel se destacó por su dedicación y su habilidad para resolver problemas de manera creativa.</p>
                            <p>Manuel es una persona con una amplia gama de intereses. Disfruta de la lectura, la música y los deportes, y también se mantiene actualizado sobre las últimas tendencias y avances en el campo de la tecnología. Habla con fluidez español, su lengua materna, y también domina el inglés a un nivel avanzado.</p>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}

export default Footer;
