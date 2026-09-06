// Production HTTP server for Canner / Cloud deployments
const { loadSimulatorEnv } = require('./simulator/loadEnv');
loadSimulatorEnv();

const http = require('http');
const fs = require('fs');
const path = require('path');
const { tryHandleAgentApi } = require('./simulator/agentHttp');
const { describeModels } = require('./simulator/openRouterBridge');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wav': 'audio/wav',
};

function serveFile(res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for client-side routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

function ensureDistThenListen() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    listen();
    return;
  }

  const { spawn } = require('child_process');
  console.log('[SOGN SAFE] dist/ missing — running expo export -p web');
  const child = spawn('npx', ['expo', 'export', '-p', 'web'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname,
  });
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error('[SOGN SAFE] expo export failed');
      process.exit(code || 1);
    }
    listen();
  });
}

const server = http.createServer(async (req, res) => {
  // Parse URL pathname safely
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);

  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (await tryHandleAgentApi(req, res, pathname)) {
    return;
  }

  // Normalize path
  let safePath = path.normalize(path.join(DIST_DIR, pathname));
  if (!safePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Health check endpoint or root
  if (pathname === '/' || pathname === '') {
    serveFile(res, path.join(DIST_DIR, 'index.html'));
    return;
  }

  // Check if direct file exists (e.g. static assets, index.html)
  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    serveFile(res, safePath);
    return;
  }

  // Check if .html file exists for route (e.g. /alert -> dist/alert.html)
  const htmlPath = `${safePath}.html`;
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    serveFile(res, htmlPath);
    return;
  }

  // Fallback to index.html
  serveFile(res, path.join(DIST_DIR, 'index.html'));
});

function listen() {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[SOGN SAFE] Production Web Server listening on port ${PORT}`);
    void describeModels().then((models) => {
      if (process.env.OPENROUTER_API_KEY) {
        console.log(`[OpenRouter] Agent SDK ready. Chat: ${models.chat.join(', ')}`);
      } else {
        console.log('[OpenRouter] No API key. Local verified-context assistant only.');
      }
    });
  });
}

ensureDistThenListen();
