import React from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://pardo-backend-3fp6.onrender.com";

function getToken() {
    return localStorage.getItem("pardo_token");
}

export async function fetchAPI(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (err) {
        console.warn("API no disponible, usando localStorage", err);
        return null;
    }
}

export function registerActivity() {
    const today = new Date().toISOString().split("T")[0];
    const activity = JSON.parse(localStorage.getItem("pardo_activity") || "{}");
    activity[today] = (activity[today] || 0) + 1;
    localStorage.setItem("pardo_activity", JSON.stringify(activity));
}

export function useSyncStorage(key, initialValue) {
    const [data, setData] = React.useState(() => {
        try {
            const local = localStorage.getItem(key);
            return local ? JSON.parse(local) : initialValue;
        } catch {
            return initialValue;
        }
    });

    React.useEffect(() => {
        const endpoint = key.replace("pardo_", "/api/");
        fetchAPI(endpoint).then(serverData => {
            if (serverData) {
                const serverArray = serverData.tasks || serverData.notes || serverData.entries || serverData.habits || serverData.wishes;
                if (serverArray) {
                    setData(serverArray);
                    localStorage.setItem(key, JSON.stringify(serverArray));
                }
            }
        });
    }, [key]);

    const updateData = (newData) => {
        setData(newData);
        localStorage.setItem(key, JSON.stringify(newData));
        registerActivity();
    };

    return [data, updateData];
}

export { API_URL };
