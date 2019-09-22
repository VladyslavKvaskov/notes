//app-version 1
const cacheName='notes-cache-v1';
const filesToCache = [
  '/',
  'manifest.json',
  'sw.js',
  'icons/notes-64.png',
  'icons/notes-192.png',
  'icons/notes-512.png',
  'icons/notes-64-ios.png'
];

self.addEventListener('install',function(event){
  self.skipWaiting().then(function(){
    //delete all files cached if there have been changes in service worker
    caches.open(cacheName).then(function(cache){
      for(let fileToCache of filesToCache)
        cache.delete(fileToCache);
    });
  });
  event.waitUntil(
    //cache all files
    caches.open(cacheName).then(function(cache){
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                var fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    function (response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        var responseToCache = response.clone();
                        caches.open(cacheName)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});
