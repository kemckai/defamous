// Minimal static file server for Playwright tests. We intentionally
// avoid any framework so the tests boot quickly and can be reasoned
// about: GET /<path> serves files from the repo root.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/' || rel === '') rel = '/tests/fixtures/empty.html';
  const safe = path
    .normalize(rel)
    .replace(/^([.][.][/\\])+/, '');
  const full = path.join(ROOT, safe);
  if (!full.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }
  fs.readFile(full, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('not found: ' + safe);
      return;
    }
    const ext = path.extname(full).toLowerCase();
    res.writeHead(200, {
      'content-type': MIME[ext] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(data);
  });
});

const PORT = Number(process.env.PORT || 4173);
server.listen(PORT, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log('[test-server] listening on http://127.0.0.1:' + PORT);
});
