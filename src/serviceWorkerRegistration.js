// src/service-worker.js
import { precaching, registerRoute } from 'workbox-precaching';
import { NetworkFirst } from 'workbox-strategies';

// Pre-cache all resources in the manifest
precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Use NetworkFirst strategy for all API requests
registerRoute(
  ({ request }) => request.destination === 'document' || request.destination === 'script',
  new NetworkFirst()
);
