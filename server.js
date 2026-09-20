const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Fix #14: Prevent directory traversal — normalize path and ensure it stays within __dirname
  const rawPath = req.url === '/' ? 'index.html' : req.url.split('?')[0];
  const safeFilePath = path.normalize(path.join(__dirname, rawPath));

  // Security check: block requests that escape the project root
  if (!safeFilePath.startsWith(path.normalize(__dirname + path.sep))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const filePath = safeFilePath;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      // Development: disable caching for JS and HTML to always serve fresh edits
      if (ext === '.js' || ext === '.html') {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        });
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
      }
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`LEARNPATH AI Platform running successfully!`);
  console.log(`Open in your browser: http://localhost:${PORT}`);
  console.log(`Tagline: "Understand your mistakes. Improve your concepts."`);
  console.log(`============================================================\n`);
});
