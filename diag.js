// MRT INTERNATIONAL - Diagnostic Mode (CommonJS)
const http = require('http');
const PORT = process.env.PORT || 3001;

console.log('--- MRT DIAGNOSTIC MODE ---');
console.log('Node:', process.version, '| Port:', PORT);

let appStatus = 'untested';
let appError = null;

const server = http.createServer(async (req, res) => {
  if (appStatus === 'untested') {
    try {
      appStatus = 'loading';
      const mod = await import('./server/index.js');
      appStatus = mod.default ? 'OK' : 'EMPTY';
    } catch (err) {
      appStatus = 'FAILED';
      appError = err.message;
      console.error('[DIAG] Error:', err.message);
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <body style="font-family:sans-serif;padding:40px;text-align:center;background:#0f172a;color:#f8fafc;">
      <div style="background:#1e293b;border-radius:16px;padding:40px;display:inline-block;border:1px solid #334155;min-width:400px;">
        <h1 style="color:#38bdf8;">MRT DIAGNOSTICS</h1>
        <div style="background:#0f172a;padding:15px;border-radius:8px;text-align:left;border:1px solid #334155;margin-top:20px;">
          <code style="color:#10b981;line-height:2;">
            [NODE] ${process.version}<br>
            [PORT] ${PORT}<br>
            [ENV] ${process.env.NODE_ENV || 'not set'}<br>
            [DB_URL] ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}<br>
            [APP] <span style="color:${appStatus === 'OK' ? '#10b981' : '#ef4444'}">${appStatus}</span><br>
            ${appError ? `[ERROR] <span style="color:#ef4444">${appError}</span><br>` : ''}
          </code>
        </div>
        <p style="margin-top:20px;color:#64748b;font-size:13px;">Set startup file to app.js for production.</p>
      </div>
    </body>
  `);
});

server.listen(PORT, '0.0.0.0', () => console.log('[DIAG] Listening on', PORT));
