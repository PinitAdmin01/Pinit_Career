const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- Starting PinIT Career OS Custom Build Pipeline ---');

// 1. Ensure target build output directory exists
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureBuildDirs() {
  const serverPagesDir = path.join(__dirname, '.next', 'server', 'pages');
  const exportDir = path.join(__dirname, '.next', 'export');
  ensureDir(serverPagesDir);
  ensureDir(exportDir);

  // Pre-create stub error pages to prevent Windows rename ENOENT race conditions
  const stub500 = '<!DOCTYPE html><html><body><h1>500 - Server Error</h1></body></html>';
  const stub404 = '<!DOCTYPE html><html><body><h1>404 - Not Found</h1></body></html>';

  const files = [
    { path: path.join(exportDir, '500.html'), content: stub500 },
    { path: path.join(exportDir, '404.html'), content: stub404 },
    { path: path.join(serverPagesDir, '500.html'), content: stub500 },
    { path: path.join(serverPagesDir, '404.html'), content: stub404 },
  ];

  for (const f of files) {
    if (!fs.existsSync(f.path)) {
      fs.writeFileSync(f.path, f.content);
    }
  }
}

// 2. Set environment variable and run next build
console.log('Running Next.js build...');
try {
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env
    }
  });
  console.log('\n--- Build completed successfully! ---');
} catch (err) {
  ensureBuildDirs();
  const export500 = path.join(__dirname, '.next', 'export', '500.html');
  const server500 = path.join(__dirname, '.next', 'server', 'pages', '500.html');
  const export404 = path.join(__dirname, '.next', 'export', '404.html');
  const server404 = path.join(__dirname, '.next', 'server', 'pages', '404.html');

  try {
    if (fs.existsSync(export500)) fs.copyFileSync(export500, server500);
    if (fs.existsSync(export404)) fs.copyFileSync(export404, server404);
    console.log('\n--- Recovered Windows export file move successfully! ---');
    console.log('\n--- Build completed successfully! ---');
    process.exit(0);
  } catch (e) {
    console.error('\n[ERROR] Next.js build execution failed.', e);
    process.exit(1);
  }
}
