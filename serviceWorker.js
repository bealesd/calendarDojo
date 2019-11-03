const cacheName = `calendarCache_v1`;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll([
                    // `./`,
                    './calendarController.js',
                    './calendarEvents.js',
                    './calendarHelper.js',
                    './calendarRepo.js',
                    './calendarService.js',
                    './calendarSubMenu.js',
                    './customEvents.js',
                    './style.css',
                    './dataStore.js',
                    './dateHelper.js',
                    './drawCalendar.js',
                    './formHelper.js',
                    './menuEvents.js',
                    './webTimeHelper.js',
                ])
                    .then(() =>
                        self.skipWaiting());
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheKeeplist = [cacheName];
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (req.method.toLowerCase() === "get") {
        return event.respondWith(networkElseCache(event));
    }
    else if (req.method.toLowerCase() === "post" ||eq.method.toLowerCase() === "delete"  ||eq.method.toLowerCase() === "put" ) {
        return;
    }
    else if (url.origin.toLowerCase() !== 'https://calservice.azurewebsites.net/') {
        return cacheFirst(event);
    }
})

function cacheFirst(event) {
    event.respondWith(
        caches.open(cacheName)
            .then(cache =>
                cache.match(event.request, { ignoreSearch: true }))
            .then(response => {
                if (response) {
                    return response;
                }
                else {
                    return fetch(event.request)
                        .then((response) => {
                            return caches.open(cacheName)
                                .then((cache) => {
                                    cache.put(event.request, response.clone());
                                    return response;
                                })
                        }).catch((e) => {
                            console.log(`Network Error, could not request resource: ${e.message}`)
                        })
                }
            })
    );
}

function networkElseCache(event) {
    return caches.match(event.request)
        .then(match => {
            if (!match) {
                return fetch(event.request).then((response) => {
                    const responseClone = response.clone();
                    caches.open(cacheName).then(cache => {
                        cache.put(event.request, responseClone);
                    })
                    return response;
                }).catch(() => {
                    return new Response(JSON.stringify([]), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
            }
            return fetch(event.request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(cacheName).then(cache => {
                        cache.put(event.request, responseClone);
                    })
                    return response;
                }).catch(() => {
                    return match;
                })
        });
}