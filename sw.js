const CACHE_NAME = 'docscanner-cache-v1';

// បញ្ជីឯកសារ និង Libraries ដែលត្រូវ Save ទុកឲ្យប្រើ Offline បាន
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // រូប Icon (ប្រសិនបើអ្នកបាន Download វាមកដាក់ក្នុង Folder គួរតែប្តូរទៅជា './icon.jpg')
  'https://img.freepik.com/premium-vector/scan-documents-icon_268104-3391.jpg?w=360',
  // Libraries ទាំងអស់ដែលបានប្រើ
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Service Worker និង Cache ឯកសារ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch ឯកសារពេលគ្មានអ៊ីនធឺណិត (Cache First Strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ប្រសិនបើមានក្នុង Cache គឺយកពី Cache មកបង្ហាញ
        if (response) {
          return response;
        }
        // ប្រសិនបើគ្មានទេ ទើបទាញយកពីអ៊ីនធឺណិត
        return fetch(event.request);
      })
  );
});

// Update Service Worker ពេលមានការផ្លាស់ប្តូរ (លុប Cache ចាស់ចោល)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
