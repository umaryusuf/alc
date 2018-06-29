const staticName = 'converter-v1'
self.addEventListener('install', event => {
  event.waitUntill(
    caches.open(staticName).then( cache => {
      return cache.addAll([
        'index.html',
        'js/app.js',
        'js/idb.js',
        'favicon.ico',
        'images/image128x128.png',
        'images/image256x256.png',
        'images/image512x512.png',
        'https://free.currencyconverterapi.com/api/v5/currencies'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then( resp => {
      return resp || fetch(event.request)
    })
  );
});