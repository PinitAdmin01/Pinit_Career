const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// The 3 OpenRouter keys to rotate in a round-robin loop
const KEYS = [
  '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',
  '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',
  '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'
];

let currentKeyIndex = 0;
const PORT = 35432;

function getCurrentKey() {
  return KEYS[currentKeyIndex];
}

function rotateKey(reason = '') {
  const oldIdx = currentKeyIndex;
  currentKeyIndex = (currentKeyIndex + 1) % KEYS.length;
  console.log(`[KeyRotator] ${reason} -> Switched from Key #${oldIdx + 1} to Key #${currentKeyIndex + 1} (${getCurrentKey().substring(0, 18)}...)`);
}

function forwardRequest(clientReq, clientRes, bodyBuffer, attempt = 0) {
  if (attempt >= KEYS.length) {
    console.error('[KeyRotator] All 3 keys have exceeded rate limits or failed!');
    clientRes.writeHead(429, { 'Content-Type': 'application/json' });
    clientRes.end(JSON.stringify({ error: { message: 'All 3 OpenRouter keys hit rate limits. Please wait or add another key.' } }));
    return;
  }

  const activeKey = getCurrentKey();
  const headers = { ...clientReq.headers };
  headers['authorization'] = `Bearer ${activeKey}`;
  headers['host'] = 'openrouter.ai';

  const options = {
    hostname: 'openrouter.ai',
    port: 443,
    path: clientReq.url,
    method: clientReq.method,
    headers: headers,
    timeout: 120000
  };

  const proxyReq = https.request(options, (proxyRes) => {
    // If rate limited or quota exceeded, rotate to the next key and retry automatically!
    if (proxyRes.statusCode === 429 || proxyRes.statusCode === 402) {
      console.warn(`[KeyRotator] Received HTTP ${proxyRes.statusCode} on Key #${currentKeyIndex + 1}.`);
      proxyRes.resume(); // consume stream
      rotateKey(`HTTP ${proxyRes.statusCode} rate limit reached`);
      return forwardRequest(clientReq, clientRes, bodyBuffer, attempt + 1);
    }

    // Otherwise stream normal response back to Claude Code
    clientRes.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on('error', (err) => {
    console.error(`[KeyRotator] Network error on Key #${currentKeyIndex + 1}:`, err.message);
    rotateKey('Network error');
    forwardRequest(clientReq, clientRes, bodyBuffer, attempt + 1);
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    console.warn(`[KeyRotator] Upstream timeout on Key #${currentKeyIndex + 1}.`);
    rotateKey('Timeout');
    forwardRequest(clientReq, clientRes, bodyBuffer, attempt + 1);
  });

  if (bodyBuffer && bodyBuffer.length > 0) {
    proxyReq.write(bodyBuffer);
  }
  proxyReq.end();
}

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const bodyBuffer = Buffer.concat(chunks);
    forwardRequest(req, res, bodyBuffer, 0);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`=======================================================`);
  console.log(`OpenRouter Key Rotator Proxy running on http://127.0.0.1:${PORT}`);
  console.log(`Active: Key #1 of ${KEYS.length} (${getCurrentKey().substring(0, 18)}...)`);
  console.log(`Automatic failover enabled for HTTP 429 / 402 rate limits.`);
  console.log(`=======================================================`);
});
