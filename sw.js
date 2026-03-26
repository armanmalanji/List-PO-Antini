const CACHE_NAME = 'antini-po-cache-v1';
const urlsToCache = [
'./',
'./index.html',
'./manifest.json',
'./Arzhop new.png' // Pastikan nama file gambar sesuai dengan yang Anda miliki
];

// Event Install: Menyimpan file-file dasar ke dalam Cache
self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => {
console.log('Cache Antini PO berhasil dibuka');
return cache.addAll(urlsToCache);
})
);
// Langsung mengaktifkan service worker baru tanpa menunggu
self.skipWaiting();
});

// Event Activate: Membersihkan cache lama yang tidak terpakai
self.addEventListener('activate', event => {
const cacheWhitelist = [CACHE_NAME];
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.map(cacheName => {
if (cacheWhitelist.indexOf(cacheName) === -1) {
console.log('Menghapus cache lama:', cacheName);
return caches.delete(cacheName);
}
})
);
})
);
// Mengambil alih kontrol halaman dengan segera
self.clients.claim();
});

// Event Fetch: Mengambil data dari Cache jika offline, atau dari jaringan jika online
self.addEventListener('fetch', event => {
// Hanya memproses request GET agar tidak mengganggu submit form/API jika ada ke depannya
if (event.request.method !== 'GET') return;

event.respondWith(
caches.match(event.request)
.then(response => {
// Jika file ada di cache, gunakan itu (cepat dan bisa offline)
if (response) {
return response;
}
// Jika tidak ada di cache, ambil dari internet
return fetch(event.request).catch(() => {
// Jika gagal fetch (misal offline dan file belum di-cache)
console.log('Gagal memuat asset:', event.request.url);
});
})
);
});