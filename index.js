// MRT INTERNATIONAL - Alternative Entry Point (ESM)
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

console.log('[MRT] index.js entry point');

let expressApp = null;

async function loadExpressApp() {
  if (expressApp) return expressApp;
  try {
    const mod = await import('./server/index.js');
    expressApp = mod.default;
    return expressApp;
  } catch (err) {
    console.error('[MRT] ❌ Failed to load Express app:', err.message);
    throw err;
  }
}

function serveStaticFallback(req, res) {
  const distDir = path.join(__dirname, 'dist');
  let filePath = req.url.split('?')[0];
  if (filePath === '/' || filePath === '') filePath = '/index.html';
  const fullPath = path.join(distDir, filePath);
  if (!fullPath.startsWith(distDir)) { res.writeHead(403); return res.end('Forbidden'); }
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const ext = path.extname(fullPath).toLowerCase();
    const types = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    return res.end(fs.readFileSync(fullPath));
  }
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync(indexPath, 'utf-8'));
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/ping' || req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: expressApp ? 'ready' : 'loading' }));
    }
    const app = await loadExpressApp();
    app(req, res);
  } catch (err) {
    const served = serveStaticFallback(req, res);
    if (served !== false) return;
    res.writeHead(500);
    res.end('Server Initialization Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[MRT] index.js listening on port ' + PORT);
  loadExpressApp().catch(() => {});
});
