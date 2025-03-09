'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"favicon-32x32.png": "695747174cf71b8688747efc237448fc",
"splash/img/light-2x.png": "8140aabe8083049e762a80e441b292bd",
"splash/img/dark-2x.png": "8140aabe8083049e762a80e441b292bd",
"splash/img/light-1x.png": "77b4bd1429b40e727b04e100edf222b7",
"splash/img/dark-3x.png": "c808fce2dacb7213cefa42604baeef02",
"splash/img/light-3x.png": "c808fce2dacb7213cefa42604baeef02",
"splash/img/dark-1x.png": "77b4bd1429b40e727b04e100edf222b7",
"splash/img/dark-4x.png": "4aac30c433101a358b560af1ed0d479e",
"splash/img/light-4x.png": "4aac30c433101a358b560af1ed0d479e",
"android-chrome-192x192.png": "b2486502a04779c307c8cb9839945e6c",
"canvaskit/canvaskit.wasm": "efeeba7dcc952dae57870d4df3111fad",
"canvaskit/skwasm.wasm": "f0dfd99007f989368db17c9abeed5a49",
"canvaskit/canvaskit.js.symbols": "68eb703b9a609baef8ee0e413b442f33",
"canvaskit/skwasm_st.wasm": "56c3973560dfcbf28ce47cebe40f3206",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/skwasm_st.js.symbols": "c7e7aac7cd8b612defd62b43e3050bdd",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/canvaskit.js": "6cfe36b4647fbfa15683e09e7dd366bc",
"canvaskit/skwasm.js.symbols": "80806576fa1056b43dd6d0b445b4b6f7",
"canvaskit/chromium/canvaskit.wasm": "64a386c87532ae52ae041d18a32a3635",
"canvaskit/chromium/canvaskit.js.symbols": "5a23598a2a8efd18ec3b60de5d28af8f",
"canvaskit/chromium/canvaskit.js": "ba4a8ae1a65ff3ad81c6818fd47e348b",
"manifest.json": "f8938a0436e1e2bcb86bdba9b9bd4f02",
"favicon.png": "16c574b576a6a4c34126f5221febd566",
"version.json": "8c8631d15eb6684d909e38a85f90410c",
"index.html": "3afe6afcc6b4560a3ba5742d5e106134",
"/": "3afe6afcc6b4560a3ba5742d5e106134",
"main.dart.js": "c5bb4afe991e7d5fc6e6ae496cdacc89",
"apple-touch-icon.png": "2ffc8fdd63050e03eacf7a68a070458a",
"icons/Icon-512.png": "2f723f410022da808b8189950a561c38",
"icons/Icon-maskable-1922.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "92cd054ded1798531361e5b4cfb9dd53",
"icons/Icon-maskable-512.png": "2f723f410022da808b8189950a561c38",
"icons/Icon-1922.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "92cd054ded1798531361e5b4cfb9dd53",
"icons/Icon-maskable-5122.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-5122.png": "96e752610906ba2a93c65f8abe1645f1",
"android-chrome-512x512.png": "2f09d2315275b4a2f5f5ec3a8bfa42a2",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"assets/AssetManifest.json": "d9f8e713dbd863267f82fd160d3d1c68",
"assets/NOTICES": "89b4018cc9d0b834f49712841297ffe4",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin": "59c9c303ba4b54638ddc1dbbf8b2a621",
"assets/AssetManifest.bin.json": "6c8a73a5bd533c0fccec9cb030c6b499",
"assets/icon/blackM.png": "a751a3d34887205c4940ec482090067a",
"assets/icon/icon2.png": "3c6aa40a4dd204a71154893e44c15148",
"assets/icon/icon.png": "7676c2f41f6ee13eb1b32c0b2dcd9d8f",
"assets/icon/splash.png": "aa735fe705c29e091af89c66f6b09978",
"assets/icon/whiteM.png": "0c2ea9691bd152fa81eee99e2beaffe0",
"assets/icon/splash2.png": "ee25e0d487a66b2dc10c61732a5f761b",
"assets/fonts/MaterialIcons-Regular.otf": "c270349552cf9afeb9dd735228220c78",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "5f72d664707e4d711a1c0c240912cd50",
"flutter_bootstrap.js": "40e7533c584852160f94e56ee8aa4b68"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
