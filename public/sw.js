// Service Worker for The Blog Spot PWA
// Provides offline functionality, caching, and background sync

const CACHE_NAME = 'the-blog-spot-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Resources to cache immediately
const STATIC_CACHE_URLS = [
    '/the-blog-spot/',
    '/the-blog-spot/index.html',
    '/the-blog-spot/manifest.json',
    '/the-blog-spot/about',
    '/the-blog-spot/membership',
    '/the-blog-spot/community',
    // Add other critical routes
];

// Resources to cache on demand
const RUNTIME_CACHE_URLS = [
    // API endpoints
    '/api/',
    // Images
    '/images/',
    '/assets/',
    // External resources
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
    console.log('💾 Service Worker installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('💾 Caching static resources');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('💾 Service Worker installed successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('💾 Service Worker installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('🔄 Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    // Update cache in background for next time
                    if (shouldUpdateCache(url)) {
                        updateCacheInBackground(request);
                    }
                    return cachedResponse;
                }

                // Fetch from network
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Cache successful responses
                        if (shouldCache(url)) {
                            const responseToCache = response.clone();
                            caches.open(getRuntimeCacheName(url))
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                        }

                        return response;
                    })
                    .catch((error) => {
                        console.log('🌐 Network fetch failed, serving offline page:', error);

                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/the-blog-spot/offline.html') ||
                                createOfflineResponse();
                        }

                        // Return offline indicator for other requests
                        return createOfflineResponse();
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);

    if (event.tag === 'story-submission') {
        event.waitUntil(syncStorySubmissions());
    }

    if (event.tag === 'comment-submission') {
        event.waitUntil(syncCommentSubmissions());
    }

    if (event.tag === 'newsletter-signup') {
        event.waitUntil(syncNewsletterSignups());
    }
});

// Push notification handler
self.addEventListener('push', (event) => {
    console.log('🔔 Push notification received');

    let notificationData = {
        title: 'The Blog Spot',
        body: 'You have a new notification',
        icon: '/the-blog-spot/icons/icon-192x192.png',
        badge: '/the-blog-spot/icons/badge-72x72.png',
        tag: 'default',
        requireInteraction: false,
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/the-blog-spot/icons/action-view.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/the-blog-spot/icons/action-dismiss.png'
            }
        ]
    };

    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (error) {
            console.error('🔔 Error parsing push data:', error);
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event.notification.tag);

    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    // Default action or 'view' action
    const urlToOpen = event.notification.data?.url || '/the-blog-spot/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.includes('/the-blog-spot/') && 'focus' in client) {
                        client.navigate(urlToOpen);
                        return client.focus();
                    }
                }

                // Open new window if app is not open
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Utility functions

function shouldCache(url) {
    // Cache images, fonts, and API responses
    return url.pathname.startsWith('/the-blog-spot/assets/') ||
        url.pathname.startsWith('/the-blog-spot/images/') ||
        url.pathname.startsWith('/api/') ||
        url.hostname === 'fonts.googleapis.com' ||
        url.hostname === 'fonts.gstatic.com';
}

function shouldUpdateCache(url) {
    // Update cache for API endpoints and dynamic content
    return url.pathname.startsWith('/api/') ||
        url.pathname.includes('/stories/') ||
        url.pathname.includes('/community/');
}

function getRuntimeCacheName(url) {
    if (url.pathname.startsWith('/api/')) {
        return 'api-cache-v1';
    }
    if (url.pathname.includes('/images/') || url.pathname.includes('/assets/')) {
        return 'assets-cache-v1';
    }
    return RUNTIME_CACHE;
}

function updateCacheInBackground(request) {
    fetch(request)
        .then((response) => {
            if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(getRuntimeCacheName(new URL(request.url)))
                    .then((cache) => {
                        cache.put(request, responseToCache);
                    });
            }
        })
        .catch((error) => {
            console.log('🌐 Background cache update failed:', error);
        });
}

function createOfflineResponse() {
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'You are currently offline. Please check your internet connection.',
            timestamp: new Date().toISOString()
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

// Background sync functions

async function syncStorySubmissions() {
    try {
        const submissions = await getStoredSubmissions('story-submissions');

        for (const submission of submissions) {
            try {
                const response = await fetch('/api/stories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submission.data)
                });

                if (response.ok) {
                    await removeStoredSubmission('story-submissions', submission.id);
                    console.log('📝 Story submission synced successfully');
                }
            } catch (error) {
                console.error('📝 Story submission sync failed:', error);
            }
        }
    } catch (error) {
        console.error('📝 Story submission sync error:', error);
    }
}

async function syncCommentSubmissions() {
    try {
        const submissions = await getStoredSubmissions('comment-submissions');

        for (const submission of submissions) {
            try {
                const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submission.data)
                });

                if (response.ok) {
                    await removeStoredSubmission('comment-submissions', submission.id);
                    console.log('💬 Comment submission synced successfully');
                }
            } catch (error) {
                console.error('💬 Comment submission sync failed:', error);
            }
        }
    } catch (error) {
        console.error('💬 Comment submission sync error:', error);
    }
}

async function syncNewsletterSignups() {
    try {
        const submissions = await getStoredSubmissions('newsletter-signups');

        for (const submission of submissions) {
            try {
                const response = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submission.data)
                });

                if (response.ok) {
                    await removeStoredSubmission('newsletter-signups', submission.id);
                    console.log('📧 Newsletter signup synced successfully');
                }
            } catch (error) {
                console.error('📧 Newsletter signup sync failed:', error);
            }
        }
    } catch (error) {
        console.error('📧 Newsletter signup sync error:', error);
    }
}

// IndexedDB helpers for background sync
async function getStoredSubmissions(storeName) {
    // Simplified implementation - in production, use IndexedDB
    const stored = localStorage.getItem(storeName);
    return stored ? JSON.parse(stored) : [];
}

async function removeStoredSubmission(storeName, submissionId) {
    const submissions = await getStoredSubmissions(storeName);
    const filtered = submissions.filter(sub => sub.id !== submissionId);
    localStorage.setItem(storeName, JSON.stringify(filtered));
}

console.log('💾 Service Worker script loaded'); 