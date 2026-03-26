const CACHE_NAME = 'arzhop-po-v1';

// Daftar file yang akan disimpan secara offline
const urlsToCache = [
'./',
'./index.html',
'./manifest.json',
'./Arzhop%20new.png'
];

// Saat diinstal, Service Worker mendownload & menyimpan file di atas
self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => {
return cache.addAll(urlsToCache);
})
);
});

// Jika tidak ada koneksi, Service Worker memanggil data dari cache
self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request)
.then(response => {
// Jika ada di cache, gunakan itu, jika tidak fetch ke internet
return response || fetch(event.request);
})
);
});

// Membersihkan cache versi lama jika ada update
self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
);
})
);
});