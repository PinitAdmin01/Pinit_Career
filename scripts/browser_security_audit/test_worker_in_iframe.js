// scripts/browser_security_audit/test_worker_in_iframe.js
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  const res = await page.evaluate(() => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      
      const scriptContent = `
        try {
          const blob = new Blob(['self.postMessage("WORKER_RUNNING");'], { type: 'application/javascript' });
          const url = URL.createObjectURL(blob);
          const w = new Worker(url);
          w.onmessage = (e) => {
            window.parent.postMessage({ status: 'SUCCESS', msg: e.data }, '*');
          };
          w.onerror = (e) => {
            window.parent.postMessage({ status: 'WORKER_ERROR', msg: e.message }, '*');
          };
        } catch(err) {
          window.parent.postMessage({ status: 'THREW', msg: err.message }, '*');
        }
      `;

      iframe.srcdoc = '<!DOCTYPE html><html><body><script>' + scriptContent + '<\/script></body></html>';
      
      window.addEventListener('message', (e) => {
        if (e.data && e.data.status) {
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
      setTimeout(() => resolve({ status: 'TIMEOUT' }), 3000);
    });
  });

  console.log('Result of Worker in null-origin iframe:', res);
  await browser.close();
})();
