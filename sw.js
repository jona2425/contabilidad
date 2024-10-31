const cacheName = "v1";
const cacheAssets = [
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./script.js",
  "./icon-192x192.png",
  "./icon-512x512.png"
];

// Instalar el Service Worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Archivos en caché");
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activar el Service Worker
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Eliminando caché antigua", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar peticiones y cargar desde caché
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
