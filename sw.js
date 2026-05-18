const CACHE = 'bank-baguwen-v2';

const ASSETS = [
  // Root
  'index.html',
  'styles.css',
  'nav.js',
  'manifest.json',
  'icon.svg',
  // Module pages
  '01-MySQL/MySQL八股文.html',
  '02-Redis/Redis八股文.html',
  '03-集合/集合八股文.html',
  '04-多线程/多线程八股文.html',
  '05-JVM/JVM八股文.html',
  '06-计算机网络/计算机网络八股文.html',
  '07-SSM/SSM八股文.html',
  '08-场景题/场景题八股文.html',
  '09-Agent技术/Agent技术八股文.html',
  '10-银行业务/银行业务八股文.html',
  '11-银行智能化/银行智能化八股文.html',
  // External (cached for offline)
  'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js',
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; })
        .map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(resp) {
        if (resp.ok) {
          var clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      });
    })
  );
});
