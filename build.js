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
  // Do not pre-create .next/server/pages stubs — that makes Next look for
  // pages/_document and fail with PageNotFoundError during collect.
  ensureDir(outDir);
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
  const appServerDir = path.join(__dirname, '.next', 'server', 'app');
  const staticDir = path.join(__dirname, '.next', 'static');
  const publicDir = path.join(__dirname, 'public');
  const outStaticDir = path.join(outDir, '_next', 'static');

  // 1. Copy public assets (avatars, brand, audio, voices.bin, tts-worker) -> out/
  if (fs.existsSync(publicDir)) {
    console.log('Copying public assets to out/ ...');
    copyDirSync(publicDir, outDir);
  }

  // 2. Copy compiled static HTML and route pages -> out/
  if (fs.existsSync(appServerDir)) {
    console.log('Copying static HTML route pages to out/ ...');
    copyDirSync(appServerDir, outDir);
  }

  // 3. Copy Next.js static JS/CSS bundles -> out/_next/static/
  if (fs.existsSync(staticDir)) {
    console.log('Copying Next.js static assets to out/_next/static/ ...');
    copyDirSync(staticDir, outStaticDir);
  }

  console.log('\n--- Build and static bundle export completed successfully! ---');
} catch (err) {
  console.error('\n[ERROR] Next.js build failed. Refusing to treat as success.', err?.message || err);
  process.exit(1);
}
