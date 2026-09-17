const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Pool of 11 OpenRouter API keys rotated in a round-robin loop
const KEYS = [
  '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',
  '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',
  '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',
  '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',
  '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',
  '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',
  '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',
  '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',
  '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',
  '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',
  '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'
];

let currentKeyIndex = 0;
const PORT = 35432;
const MAX_RETRIES = KEYS.length * 2; // Try through all keys twice with backoff

function getCurrentKey() {
  return KEYS[currentKeyIndex];
}

function rotateKey(reason = '') {
  const oldIdx = currentKeyIndex;
  currentKeyIndex = (currentKeyIndex + 1) % KEYS.length;
  console.log(`[KeyRotator] ${reason} -> Switched from Key #${oldIdx + 1} to Key #${currentKeyIndex + 1} (${getCurrentKey().substring(0, 18)}...)`);
}

function forwardRequest(clientReq, clientRes, bodyBuffer, attempt = 0) {
  if (clientRes.headersSent || clientRes.writableEnded) {
    return;
  }

  if (attempt >= MAX_RETRIES) {
    console.error(`[KeyRotator] All ${KEYS.length} keys exceeded limits after ${attempt} attempts.`);
    if (!clientRes.headersSent) {
      clientRes.writeHead(429, { 'Content-Type': 'application/json' });
      clientRes.end(JSON.stringify({
        error: {
          message: `All ${KEYS.length} OpenRouter keys hit rate limits. Please wait 15 seconds or add another key.`
        }
      }));
    }
    return;
  }

  // If we cycled through all keys once, pause briefly (2s) to allow per-second rate limits to clear
  if (attempt > 0 && attempt % KEYS.length === 0) {
    console.log(`[KeyRotator] Full cycle completed. Pausing 2.5s for sliding window rate limits to refresh...`);
    setTimeout(() => {
      forwardRequest(clientReq, clientRes, bodyBuffer, attempt + 1);
    }, 2500);
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

  let handled = false;

  const proxyReq = https.request(options, (proxyRes) => {
    if (handled || clientRes.headersSent) return;

    // If rate limited (429) or payment required (402), rotate to next key
    if (proxyRes.statusCode === 429 || proxyRes.statusCode === 402) {
      handled = true;
      console.warn(`[KeyRotator] Received HTTP ${proxyRes.statusCode} on Key #${currentKeyIndex + 1} (${activeKey.substring(0, 18)}...). Rotating...`);
      proxyRes.resume(); // drain response
      rotateKey(`HTTP ${proxyRes.statusCode} rate limit reached`);
      return forwardRequest(clientReq, clientRes, bodyBuffer, attempt + 1);
    }

    // Success or normal upstream response -> pipe back to client
    handled = true;
    clientRes.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on('error', (err) => {
    if (handled || clientRes.headersSent) return;
    handled = true;
    console.error(`[KeyRotator] Network error on Key #${currentKeyIndex + 1}:`, err.message);
    rotateKey('Network error');
    // Brief 500ms delay on network error before retry
    setTimeout(() => {
      forwardRequest(clientReq, clientRes, bodyBuffer, attempt + 1);
    }, 500);
  });

  proxyReq.on('timeout', () => {
    if (handled || clientRes.headersSent) return;
    handled = true;
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
  console.log(`🚀 OpenRouter 11-Key Rotator Proxy running on http://127.0.0.1:${PORT}`);
  console.log(`🔑 Total Keys Configured: ${KEYS.length}`);
  console.log(`⚡ Active: Key #1 (${getCurrentKey().substring(0, 18)}...)`);
  console.log(`🔄 Automatic Failover & Exponential Backoff Enabled.`);
  console.log(`=======================================================`);
});
