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

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Set environment variable and run next build — fail closed on error
console.log('Running Next.js build...');
ensureBuildDirs();
try {
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env
    }
  });
  const nextExportDir = path.join(__dirname, '.next', 'export');
  if (fs.existsSync(nextExportDir)) {
    copyDirSync(nextExportDir, outDir);
  }
  console.log('\n--- Build completed successfully! ---');
} catch (err) {
  console.error('\n[ERROR] Next.js build failed. Refusing to treat as success.', err?.message || err);
  process.exit(1);
}
