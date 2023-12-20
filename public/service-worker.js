// public/service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.2/workbox-sw.js');

// Set up Workbox with caching strategies
workbox.setConfig({
  debug: false, // Set to true for development
});

// Precache and route all assets
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the Google Fonts webfont files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);

// Cache images with a cache-first strategy for 30 days.
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Fallback to the network if a route is not cached (for dynamic content)
workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst());

// A common strategy for API calls
workbox.routing.registerRoute(
  // Match API routes
  /\/api\//,
  // Use the NetworkFirst strategy
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Max 50 entries in the cache
        maxAgeSeconds: 60 * 5, // 5 minutes
      }),
    ],
  })
);

// A common strategy for other external resources
workbox.routing.registerRoute(
  // Match other external resources
  /^https:\/\/api\.example\.com\//,
  // Use the NetworkFirst strategy
  new workbox.strategies.NetworkFirst({
    cacheName: 'external-resources-cache',
  })
);
