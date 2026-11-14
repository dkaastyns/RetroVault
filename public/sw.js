const CACHE_VERSION = 'retrovault-v2';
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const APP_SHELL = ['/', '/games', '/consoles', '/wishlist', '/profile'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(PAGE_CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('retrovault-') && !key.startsWith(CACHE_VERSION)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/')) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(PAGE_CACHE);
          await cache.put(request, response.clone());
          if (/^\/games\/\d+\/?$/.test(url.pathname)) await cache.put(url.pathname, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match(url.pathname)) || (await caches.match('/'));
      }
    })());
    return;
  }

  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith((async () => {
      const cache = await caches.open(ASSET_CACHE);
      const cached = await cache.match(request);
      const network = fetch(request).then(response => {
        if (response.ok && response.type === 'basic') cache.put(request, response.clone());
        return response;
      }).catch(() => null);
      return cached || (await network) || Response.error();
    })());
  }
});
