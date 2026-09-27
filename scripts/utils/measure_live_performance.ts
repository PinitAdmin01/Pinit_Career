// scripts/measure_live_performance.ts
// Real Synthetic Performance & Timing Audit for PinIT Production Portal

import https from 'https';

console.log('========================================================================');
console.log('? PRODUCTION RUNTIME PERFORMANCE & TIMING AUDIT');
console.log('========================================================================\n');

interface MetricResult {
  route: string;
  statusCode: number;
  ttfbMs: number;
  totalTimeMs: number;
  contentLengthBytes: number;
  cacheStatus: string;
}

async function measureRoute(path: string): Promise<MetricResult> {
  return new Promise((resolve, reject) => {
    const start = process.hrtime.bigint();
    let ttfb = 0;

    const req = https.get(`https://pinit-careers.web.app${path}`, (res) => {
      const ttfbBig = process.hrtime.bigint();
      ttfb = Number(ttfbBig - start) / 1e6; // ms

      let bytes = 0;
      res.on('data', chunk => { bytes += chunk.length; });
      res.on('end', () => {
        const endBig = process.hrtime.bigint();
        const total = Number(endBig - start) / 1e6;
        resolve({
          route: path,
          statusCode: res.statusCode || 0,
          ttfbMs: parseFloat(ttfb.toFixed(2)),
          totalTimeMs: parseFloat(total.toFixed(2)),
          contentLengthBytes: bytes,
          cacheStatus: (res.headers['x-cache'] as string) || 'MISS'
        });
      });
    });

    req.on('error', reject);
  });
}

(async () => {
  const routes = ['/', '/login', '/dashboard', '/quests', '/onboarding', '/profile', '/internships'];
  console.log('-- LIVE ROUTE RESPONSE TIMINGS (CDN EDGE) --');
  for (const r of routes) {
    try {
      const res = await measureRoute(r);
      const sizeKb = (res.contentLengthBytes / 1024).toFixed(2);
      console.log(`  • ${r.padEnd(16)} | Status: ${res.statusCode} | TTFB: ${res.ttfbMs.toString().padStart(6)} ms | Total: ${res.totalTimeMs.toString().padStart(6)} ms | Size: ${sizeKb.padStart(6)} KB | Cache: ${res.cacheStatus}`);
    } catch (e: any) {
      console.error(`  ? Failed route ${r}:`, e.message);
    }
  }
  console.log('\n========================================================================');
})();
