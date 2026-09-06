import React from "react";
import { fetchAPI } from "./useAPI";

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function usePushNotifications() {
    const [permission, setPermission] = React.useState(Notification.permission);
    const [subscription, setSubscription] = React.useState(null);
    const [error, setError] = React.useState(null);

    const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY || "BLSvMpGvLrhbuNlAL8BfQOFCmrkli6zwnKb-2vEybyqpA1zNZDr4BXqgzWbH_nysoPw4SN1Gth7i-bacLbap7iY";

    const subscribe = async () => {
        try {
            setError(null);
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                throw new Error("Push no soportado en este navegador");
            }
            const perm = await Notification.requestPermission();
            setPermission(perm);
            if (perm !== "granted") throw new Error("Permiso denegado");
            const registration = await navigator.serviceWorker.ready;
            const existing = await registration.pushManager.getSubscription();
            if (existing) {
                setSubscription(existing);
                await fetchAPI("/api/push/subscribe", {
                    method: "POST",
                    body: JSON.stringify({ subscription: existing })
                });
                return existing;
            }
            const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
            const newSub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });
            setSubscription(newSub);
            await fetchAPI("/api/push/subscribe", {
                method: "POST",
                body: JSON.stringify({ subscription: newSub })
            });
            return newSub;
        } catch (err) {
            setError(err.message);
            console.error("Error en push:", err);
            return null;
        }
    };

    const unsubscribe = async () => {
        try {
            if (!subscription) return;
            await subscription.unsubscribe();
            setSubscription(null);
            await fetchAPI("/api/push/unsubscribe", {
                method: "POST",
                body: JSON.stringify({ endpoint: subscription.endpoint })
            });
        } catch (err) {
            console.error("Error al desuscribir", err);
        }
    };

    React.useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => registration.pushManager.getSubscription().then(setSubscription));
        }
    }, []);

    return { permission, subscription, error, subscribe, unsubscribe };
}

export default usePushNotifications;
