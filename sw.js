// غيّر رقم النسخة مع كل تحديث للتطبيق
const CACHE = 'miyahi-v2.1.0';
const SHELL = ['./', './index.html', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;                 // بيانات قوقل ما تنحفظ هنا
  if (u.pathname.endsWith('version.json')) return;          // فحص التحديث دايمًا من الشبكة
  // الشبكة أولًا (بدون كاش المتصفح) عشان أي تحديث على GitHub يوصل على طول، والكاش لو ما فيه نت
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
