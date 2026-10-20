/**
 * SHEIKAH SLATE TRANSLATOR - NODE.JS PRODUCTION SERVER
 * Zero-dependency native HTTP server for Render, Docker, or local hosting.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0'; // Required for Render & Docker container routing

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // CORS & Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Normalize requested URL path
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Default to index.html for root or SPA fallback
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Prevent path traversal attacks
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  // Verify that target path is within project root
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Interdit');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: If requesting HTML-like page, serve index.html, else 404
      if (!path.extname(pathname)) {
        serveFile(path.join(__dirname, 'index.html'), res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Non Trouvé');
      return;
    }

    serveFile(filePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Cache policy
  if (ext === '.html') {
    res.setHeader('Cache-Control', 'no-cache');
  } else {
    // 7 days cache for static assets (css, js, svg, fonts)
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  }

  res.writeHead(200, { 'Content-Type': contentType });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);

  readStream.on('error', (err) => {
    console.error('Stream error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Erreur Interne');
    }
  });
}

server.listen(PORT, HOST, () => {
  console.log(`=========================================`);
  console.log(`🗡️  TABLETTE SHEIKAH - SERVEUR EN LIGNE`);
  console.log(`📡 URL: http://${HOST}:${PORT}`);
  console.log(`⚡ Mode: ${process.env.NODE_ENV || 'production'}`);
  console.log(`=========================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Signal SIGTERM reçu. Arrêt du serveur...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Signal SIGINT reçu. Arrêt du serveur...');
  server.close(() => process.exit(0));
});
