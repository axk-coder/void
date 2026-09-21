const CACHE_NAME = "angry-birds-2-cache-ts-port-peak";
const TARGETS = [
  "AngryBirds2WebPortFinal.wasm.code.unityweb",
  "AngryBirds2WebPortFinal.data.unityweb"
];

function isTarget(url) {
  return TARGETS.some(t => url.endsWith(t));
}

self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  const url = e.request.url;
  if (e.request.method !== "GET" || !isTarget(url)) return;
  e.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(e.request).then(hit => {
        if (hit) return hit;
        return fetch(e.request).then(resp => {
          if (resp && resp.ok) cache.put(e.request, resp.clone());
          return resp;
        });
      })
    )
  );
});