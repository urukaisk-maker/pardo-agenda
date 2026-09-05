const CACHE_NAME = "pardo-agenda-v2";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.svg",
    "/icons/icon.svg"
];

// Instalar Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Activar Service Worker
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia: Cache first, luego network
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    
    // API requests: Network first
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // Static assets: Cache first
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request).then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            })
            .catch(() => {
                if (event.request.mode === "navigate") {
                    return caches.match("/index.html");
                }
            })
    );
});

// Notificaciones push
self.addEventListener("push", (event) => {
    const options = {
        body: event.data ? event.data.text() : "Nueva notificación de Pardo",
        icon: "/icons/icon.svg",
        badge: "/icons/icon.svg",
        vibrate: [200, 100, 200]
    };
    event.waitUntil(
        self.registration.showNotification("🐕 Pardo Agenda", options)
    );
});

// Click en notificación
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("/")
    );
});
