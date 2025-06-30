// server.js
const express = require('express');
const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const WebSocket = require('ws');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 HTTP + WS server listening on http://localhost:${PORT}`);
});

// Attach WebSocket to same HTTP server:
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('🔌 New WebSocket connection');
  const filename = `recording-${Date.now()}.webm`;
  const filepath = path.join(__dirname, filename);
  const fileStream = fs.createWriteStream(filepath);

  ws.on('message', data => {
    fileStream.write(data);
  });

  ws.on('close', () => {
    fileStream.end();
    console.log(`✅ Stream ended — file saved as ${filename}`);
  });

  ws.on('error', err => {
    console.error('⚠️ WebSocket error:', err);
  });
});
