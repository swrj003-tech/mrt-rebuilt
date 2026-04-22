// MRT INTERNATIONAL - Final High-Resilience Entry Point
// CommonJS Bridge to Consolidated ESM Backend

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

console.log('--- MRT PRODUCTION STARTUP ---');

let expressApp = null;
let loadError = null;

// Background Loader
async function loadExpressApp() {
  if (expressApp) return expressApp;
  try {
    const mod = await import('./server/index.js');
    expressApp = mod.default;
    console.log('[MRT] ✅ Backend Ready');
    return expressApp;
  } catch (err) {
    loadError = err;
    console.error('[MRT] ❌ Failed to load backend:', err.message);
    throw err;
  }
}

// Start loading immediately
loadExpressApp().catch(() => {});

// High-speed static bridge (Bypasses Express for core UI)
function serveStatic(req, res) {
  const distDir = path.join(__dirname, 'dist');
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  if (urlPath === '/admin' || urlPath === '/admin/') urlPath = '/admin/index.html';
  
  const fullPath = path.join(distDir, urlPath);
  
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const ext = path.extname(fullPath).toLowerCase();
    const mime = { 
      '.html':'text/html', '.js':'application/javascript', '.css':'text/css', 
      '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp',
      '.ico':'image/x-icon', '.woff2':'font/woff2'
    };
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    return res.end(fs.readFileSync(fullPath));
  }
  
  // SPA Fallback (Only for UI routes)
  if (!req.url.startsWith('/api') && !req.url.startsWith('/debug-db') && !req.url.startsWith('/health')) {
    const isAdmin = req.url.startsWith('/admin');
    const indexPath = path.join(distDir, isAdmin ? 'admin/index.html' : 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(fs.readFileSync(indexPath));
    }
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  console.log(`[BRIDGE] Request: ${req.method} ${req.url}`);
  const start = Date.now();
  
  res.on('finish', () => {
    console.log(`[BRIDGE] Response: ${req.url} - ${res.statusCode} (${Date.now() - start}ms)`);
  });

  try {
    // 1. Health
    if (req.url === '/health' || req.url === '/ping') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        status: expressApp ? 'ready' : (loadError ? 'error' : 'booting'),
        node: process.version
      }));
    }

    // 2. Load and delegate to Express
    const app = await loadExpressApp();
    return app(req, res);

  } catch (err) {
    console.error('[BRIDGE] Fatal Error:', err.message);
    if (req.url.startsWith('/api')) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Backend error', details: err.message }));
    }
    res.writeHead(503, { 'Content-Type': 'text/html' });
    res.end(`
      <body style="font-family:sans-serif;padding:40px;background:#0f172a;color:#f8fafc;">
        <h1>503 Service Unavailable</h1>
        <p>The system encountered a critical error during initialization.</p>
        <pre style="background:#1e293b;padding:20px;border-radius:8px;color:#ef4444;">${err.stack || err.message}</pre>
        <p>This usually indicates missing build files (dist/) or database connectivity issues.</p>
      </body>
    `);
  }
});

server.listen(PORT, '0.0.0.0', () => console.log('[MRT] Listening on port ' + PORT));
