/* ============================================================
   DIG SITE 404 — SERVICE WORKER
   sw.js
   ============================================================ */

const CACHE_NAME = "dig-site-404-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./data.js",
    "./game.js",
    "./manifest.json"
];


/* ============================================================
   INSTALL
   ============================================================ */

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});


/* ============================================================
   ACTIVATE
   ============================================================ */

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});


/* ============================================================
   FETCH
   ============================================================ */

self.addEventListener("fetch", event => {

    /*
     * Only handle GET requests.
     */

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {

                /*
                 * Serve cached files first.
                 */

                if (cachedResponse) {
                    return cachedResponse;
                }

                /*
                 * If the file is not cached, try the network.
                 */

                return fetch(event.request)
                    .then(networkResponse => {

                        /*
                         * Cache successful same-origin responses.
                         */

                        if (
                            networkResponse &&
                            networkResponse.status === 200 &&
                            networkResponse.type === "basic"
                        ) {
                            const responseClone =
                                networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(
                                        event.request,
                                        responseClone
                                    );
                                });
                        }

                        return networkResponse;
                    })
                    .catch(() => {

                        /*
                         * Offline fallback for navigation requests.
                         */

                        if (
                            event.request.mode === "navigate"
                        ) {
                            return caches.match("./index.html");
                        }

                        return new Response(
                            "DIG SITE 404 is currently offline.",
                            {
                                status: 503,
                                statusText: "Offline"
                            }
                        );
                    });
            })
    );
});