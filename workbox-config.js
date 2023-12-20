// workbox-config.js
module.exports = {
    "globDirectory": "build/",
    "globPatterns": [
      "**/*.{json,ico,html,png,js,css}"
    ],
    "swDest": "build/sw.js",
    "swSrc": "src/service-worker.js"
  };
  