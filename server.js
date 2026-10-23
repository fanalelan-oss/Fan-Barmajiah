const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

// Serve static files with proper MIME types & extensions
app.use(express.static(PUBLIC_DIR, {
  extensions: ['html', 'htm'],
  maxAge: 0,
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    if (filePath.endsWith('.glb')) {
      res.setHeader('Content-Type', 'model/gltf-binary');
    }
  }
}));

// Route handling for clean URLs (e.g. /services -> services.html)
app.get('*', (req, res) => {
  const cleanPath = req.path.replace(/^\//, '');
  const candidateHtml = path.join(PUBLIC_DIR, `${cleanPath}.html`);

  if (fs.existsSync(candidateHtml) && fs.statSync(candidateHtml).isFile()) {
    return res.sendFile(candidateHtml);
  }

  // Default fallback to index.html
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Fan-Barmajiah server running on http://0.0.0.0:${PORT}`);
});
