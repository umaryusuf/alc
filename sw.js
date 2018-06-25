const cacheName = 'v1'
self.addEventListener('install', event => {
  event.waitUntill(
    caches.open(cacheName).then( cache => {
      return cache.addAll([
        '/index.html',
        '/css/bootstrap.min.css',
        '/css/styles.css',
        '/js/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then( resp => {
      return resp || fetch(event.request).then( response => {
        return caches.open(cacheName).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});