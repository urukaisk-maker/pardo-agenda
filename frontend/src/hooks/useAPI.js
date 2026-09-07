import React from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://pardo-backend-3fp6.onrender.com";

function getToken() {
    return localStorage.getItem("pardo_token");
}

function isOnline() {
    return navigator.onLine;
}

function getQueue() {
    try {
        return JSON.parse(localStorage.getItem("pardo_offline_queue") || "[]");
    } catch {
        return [];
    }
}

function setQueue(queue) {
    localStorage.setItem("pardo_offline_queue", JSON.stringify(queue));
}

function addToQueue(endpoint, options) {
    const queue = getQueue();
    queue.push({ endpoint, options, timestamp: Date.now() });
    setQueue(queue);
}

export async function fetchAPI(endpoint, options = {}) {
    const method = options.method || "GET";
    if (!isOnline() && method !== "GET") {
        addToQueue(endpoint, options);
        console.warn("Offline: operación encolada", endpoint);
        return { offline: true, queued: true };
    }
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {})
    };
    try {
        const response = await fetch(API_URL + endpoint, {
            ...options,
            headers: { ...headers, ...options.headers }
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
        return await response.json();
    } catch (err) {
        if (!isOnline() && method !== "GET") {
            addToQueue(endpoint, options);
            return { offline: true, queued: true };
        }
        console.warn("API no disponible", err);
        return null;
    }
}

export function useOnlineStatus() {
    const [online, setOnline] = React.useState(navigator.onLine);
    React.useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);
    return online;
}

export async function flushOfflineQueue() {
    const queue = getQueue();
    if (!queue.length) return;
    const remaining = [];
    for (const item of queue) {
        try {
            await fetchAPI(item.endpoint, item.options);
        } catch (err) {
            console.warn("No se pudo sincronizar:", item.endpoint, err);
            remaining.push(item);
        }
    }
    setQueue(remaining);
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

export { API_URL, isOnline };
