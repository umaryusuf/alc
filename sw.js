const staticName = 'converter-v1'
self.addEventListener('install', event => {
  event.waitUntill(
    caches.open(staticName).then( cache => {
      return cache.addAll([
        'index.html',
        'css/bootstrap.min.css',
        'css/styles.css',
        'js/app.js',
        'js/idb.js',
        'https://free.currencyconverterapi.com/api/v5/currencies'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntill(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('converter-') && cacheName !== staticName;
        }).map(cacheName => {
          caches.delete(cacheName)
        })
      )
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then( resp => {
      return resp || fetch(event.request).then( response => {
        return caches.open(staticName).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});