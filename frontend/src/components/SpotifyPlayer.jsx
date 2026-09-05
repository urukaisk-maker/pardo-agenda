import React from "react";

function SpotifyPlayer() {
    const [topTracks, setTopTracks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    
    const TOKEN = "BQDWNAdbK6raf5HA0lFjj0eoNCGd3proIvLrivTqxutiQCSrdkcZ0dEZqLpkrA9gufPY6OpuwkZANdWJCxps0ImhFNNiJ7zG4UCmezJbeKWvbjlgYhV3HCUWCwDUxcEJX31OqS1NSbs4PqYkj9DFNpoSYNmdwGXvW-xUNuM70GTnHEPEdBtHLUTmRsAaRlFd2zK4GcyF9KyJyVZGIUpccAPmFDjV_MtnWsqAh3CbHpNwooDu7MMPnW6e2YceSF_X-U2FXjNccxnq9oyQEVehmaLRM4ByfJZfzlX2LnoR3XxPaaft2Mq1PW-oJGEmvkxG9NlFaWk";
    
    React.useEffect(() => {
        fetchTopTracks();
    }, []);
    
    const fetchWebApi = async (endpoint, method = "GET", body = null) => {
        try {
            const res = await fetch("https://api.spotify.com/" + endpoint, {
                headers: { Authorization: "Bearer " + TOKEN },
                method,
                body: body ? JSON.stringify(body) : null
            });
            return await res.json();
        } catch (err) {
            console.error("Error Spotify:", err);
            return null;
        }
    };
    
    const fetchTopTracks = async () => {
        setLoading(true);
        try {
            const data = await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=10");
            if (data && data.items) {
                setTopTracks(data.items);
            } else if (data && data.error) {
                setError("Token expirado. Necesitas renovarlo.");
            }
        } catch (err) {
            setError("Error al cargar Spotify");
        }
        setLoading(false);
    };
    
    const searchTracks = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const data = await fetchWebApi("v1/search?q=" + encodeURIComponent(searchQuery) + "&type=track&limit=10");
            if (data && data.tracks && data.tracks.items) {
                setSearchResults(data.tracks.items);
            }
        } catch (err) {
            setError("Error en búsqueda");
        }
        setLoading(false);
    };
    
    const playTrack = (track) => {
        if (track.preview_url) {
            const audio = new Audio(track.preview_url);
            audio.play().catch(() => {});
        } else if (track.external_urls && track.external_urls.spotify) {
            window.open(track.external_urls.spotify, "_blank");
        }
    };
    
    return (
        <div style={{ background: "#1DB954", color: "#fff", padding: "20px", borderRadius: "15px", marginBottom: "15px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>🎵 Spotify <span style={{ fontSize: "11px", background: "#000", padding: "3px 8px", borderRadius: "10px" }}>Premium</span></h3>
            
            <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar canción..." style={{ flex: 1, padding: "10px", border: "none", borderRadius: "20px", fontSize: "13px" }} />
                <button onClick={searchTracks} style={{ padding: "10px 20px", background: "#000", color: "#1DB954", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}>🔍</button>
            </div>
            
            {error && <p style={{ color: "#FFD700", fontSize: "13px" }}>⚠️ {error}</p>}
            
            {loading && <p style={{ fontSize: "13px" }}>Cargando...</p>}
            
            {searchResults.length > 0 && (
                <div>
                    <h4 style={{ fontSize: "14px" }}>Resultados de búsqueda:</h4>
                    {searchResults.map((track, i) => (
                        <div key={track.id} onClick={() => playTrack(track)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", cursor: "pointer", borderRadius: "8px", background: "rgba(0,0,0,0.2)", marginBottom: "5px" }}>
                            <span style={{ fontSize: "14px" }}>{i + 1}</span>
                            <img src={track.album?.images?.[2]?.url || ""} alt="" style={{ width: "40px", height: "40px", borderRadius: "5px" }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "13px", fontWeight: "bold" }}>{track.name}</div>
                                <div style={{ fontSize: "11px", opacity: 0.8 }}>{track.artists?.map(a => a.name).join(", ")}</div>
                            </div>
                            <span>▶️</span>
                        </div>
                    ))}
                </div>
            )}
            
            {topTracks.length > 0 && searchResults.length === 0 && (
                <div>
                    <h4 style={{ fontSize: "14px" }}>🔥 Tus top tracks:</h4>
                    {topTracks.map((track, i) => (
                        <div key={track.id} onClick={() => playTrack(track)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", cursor: "pointer", borderRadius: "8px", background: "rgba(0,0,0,0.2)", marginBottom: "5px" }}>
                            <span style={{ fontSize: "14px" }}>{i + 1}</span>
                            <img src={track.album?.images?.[2]?.url || ""} alt="" style={{ width: "40px", height: "40px", borderRadius: "5px" }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "13px", fontWeight: "bold" }}>{track.name}</div>
                                <div style={{ fontSize: "11px", opacity: 0.8 }}>{track.artists?.map(a => a.name).join(", ")}</div>
                            </div>
                            <span>▶️</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SpotifyPlayer;
