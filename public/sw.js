// Service Worker برای Lingo
// نکته: برای force کردن پاک‌شدن کش‌های قدیمی کاربرها بعد از یک تغییر بزرگ،
// همین کافیه که CACHE_VERSION رو یکی بالاتر ببری (مثلاً lingo-v2).
const CACHE_VERSION = "lingo-v1";
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = ["/", "/index.html", "/manifest.webmanifest"];

// APIهای دینامیک: خودِ اپ برای این‌ها کش جدا با TTL داره (lib/cache.ts)،
// پس Service Worker اصلاً نباید دست به کش این‌ها بزنه.
const NEVER_CACHE_HOSTS = [
  "lingo-proxy.amirkhalvatastam.workers.dev",
  "api.mymemory.translated.net",
  "api.datamuse.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== PRECACHE && key !== RUNTIME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // درخواست‌های دینامیک: دست‌نخورده بذار به شبکه بره (نه cache، نه fallback)
  if (NEVER_CACHE_HOSTS.includes(url.hostname)) {
    return;
  }

  // بارگذاری صفحه: همیشه اول شبکه، تا آخرین نسخه‌ی دیپلوی‌شده لود بشه.
  // فقط وقتی آفلاینه، آخرین نسخه‌ی کش‌شده رو نشون بده.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PRECACHE).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // فونت گوگل: stale-while-revalidate (نسخه‌ی کش‌شده رو فوری نشون بده، پشت‌صحنه آپدیت کن)
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(RUNTIME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // assetهای هم‌مبدأ (JS/CSS هش‌دار، آیکون‌ها و ...): cache-first
  // چون فایل‌های build شده‌ی Vite هش دارن و immutable هستن.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});