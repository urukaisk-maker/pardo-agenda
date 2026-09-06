const CACHE_NAME = "pardo-agenda-v3";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.svg",
    "/icons/icon.svg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    if (event.request.url.includes("/api/")) {
        event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
        return;
    }
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
        }))
    );
});

// ============ NOTIFICACIONES PUSH ============
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || "Tienes una nueva actualización",
        icon: "/icons/icon.svg",
        badge: "/icons/icon.svg",
        vibrate: [200, 100, 200],
        data: { url: data.url || "/" }
    };
    event.waitUntil(self.registration.showNotification(data.title || "🐕 Pardo Agenda", options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data.url || "/";
    event.waitUntil(clients.openWindow(url));
});
