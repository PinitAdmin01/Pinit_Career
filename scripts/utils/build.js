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
  const nextDir = path.join(__dirname, '.next');

  // ── INTERMITTENT BUILD FAILURE FIX ───────────────────────────────────────
  // Symptom: identical source would sometimes fail mid-build with
  //   ENOENT: no such file or directory, open '.next\server\pages-manifest.json'
  // and other times succeed.
  //
  // Cause: this function wiped .next before every build and swallowed any
  // failure with `catch {}`. On Windows, fs.rmSync can throw EBUSY/EPERM when
  // a file in .next is still held open — by a previous build worker that has
  // not fully exited, by the dev server, or by an antivirus scanner. The empty
  // catch meant the build then started against a PARTIALLY deleted .next
  // directory, so Next.js wrote into a tree that was still disappearing
  // underneath it and its own manifest went missing.
  //
  // Fix: retry the removal, and if it genuinely cannot be removed, FAIL LOUDLY
  // instead of silently proceeding into a corrupt directory. A build that stops
  // with a clear message is strictly better than one that fails randomly later
  // with an unrelated-looking error.
  if (fs.existsSync(nextDir)) {
    const MAX_ATTEMPTS = 5;
    let removed = false;
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
        // Confirm it is actually gone — rmSync can return without throwing
        // while the directory is still being released by the OS.
        if (!fs.existsSync(nextDir)) {
          removed = true;
          if (attempt > 1) {
            console.log(`[Build] .next removed on attempt ${attempt}.`);
          }
          break;
        }
        lastError = new Error('.next still present after rmSync returned');
      } catch (err) {
        lastError = err;
      }

      // Synchronous back-off: give Windows time to release lingering handles.
      const waitMs = attempt * 400;
      console.warn(
        `[Build] Could not remove .next (attempt ${attempt}/${MAX_ATTEMPTS}): ` +
        `${lastError && lastError.message}. Retrying in ${waitMs}ms...`
      );
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, waitMs);
    }

    if (!removed) {
      console.error(
        '\n[ERROR] Unable to clear the .next build directory after ' +
        `${MAX_ATTEMPTS} attempts.\n` +
        'Something is holding files open. Common causes:\n' +
        '  - a dev server still running (stop `npm run dev`)\n' +
        '  - a previous build that has not fully exited\n' +
        '  - antivirus or file indexing scanning the folder\n' +
        'Refusing to build against a partially deleted directory, because that ' +
        'produces confusing downstream errors such as a missing pages-manifest.json.\n'
      );
      process.exit(1);
    }
  }

  ensureDir(outDir);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    try {
      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    } catch (err) {
      // Silently skip transient locked files on Windows
    }
  }
}

// 2. Set environment variable and run next build — fail closed on error
console.log('Running Next.js build...');
ensureBuildDirs();
try {
  // ── REPRODUCIBLE HEAP ────────────────────────────────────────────────────
  // Node derives its default heap limit from installed RAM, so the same source
  // can build on one machine and fail on another purely because of available
  // memory. Pinning it makes the build behave identically everywhere.
  const buildEnv = {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--max-old-space-size=4096']
      .filter(Boolean)
      .join(' '),
  };

  console.log(`[Build] NODE_OPTIONS = ${buildEnv.NODE_OPTIONS}`);

  // ── TRANSIENT FILESYSTEM RETRY ───────────────────────────────────────────
  // This project builds on Windows with Defender real-time protection active.
  // Defender opens each newly written file to scan it, briefly holding a
  // handle. The build writes and renames thousands of files in quick
  // succession, so occasionally the two collide and Node raises a filesystem
  // error on a file that definitely exists — observed twice, in two different
  // places:
  //
  //   ENOENT ... open   '.next\server\pages-manifest.json'
  //   ENOENT ... rename '.next\export\500.html' -> '.next\server\pages\500.html'
  //
  // The second one is raised inside Next.js's own build code, so it cannot be
  // fixed here — only retried. Re-running the identical source succeeds.
  //
  // SAFETY PROPERTIES — why this cannot hide a real failure:
  //   1. Success requires execSync to return normally, i.e. exit code 0.
  //      A retry can never turn a failing build into a reported success.
  //   2. Attempts are bounded. If all of them fail, the ORIGINAL error is
  //      rethrown and the existing catch below exits non-zero as before.
  //   3. .next is fully cleared between attempts, so a retry never builds on
  //      top of a half-written tree.
  //
  // KNOWN COST — a genuine compile error now fails 3x slower, because a real
  // error also fails on every retry. That is a deliberate trade: wasted time
  // on a broken build is far cheaper than a green build you cannot trust.
  //
  // ROOT CAUSE, not fixed here: excluding node_modules and .next from Windows
  // Defender removes the collision entirely. That is a machine setting, not a
  // code change, so it is left to the developer.
  const MAX_BUILD_ATTEMPTS = 4;
  let buildSucceeded = false;
  let lastBuildError = null;

  for (let attempt = 1; attempt <= MAX_BUILD_ATTEMPTS; attempt++) {
    try {
      if (attempt > 1) {
        const waitMs = attempt * 2500;
        console.warn(
          `\n[Build] Attempt ${attempt - 1} failed. Clearing .next and retrying ` +
          `(attempt ${attempt}/${MAX_BUILD_ATTEMPTS}) after ${waitMs}ms...\n` +
          `[Build] Reason: ${lastBuildError && lastBuildError.message}`
        );
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, waitMs);
        ensureBuildDirs();
      }

      execSync('npx next build --no-lint', {
        stdio: 'inherit',
        env: buildEnv
      });

      buildSucceeded = true;
      if (attempt > 1) {
        console.log(`\n[Build] Succeeded on attempt ${attempt}/${MAX_BUILD_ATTEMPTS}.`);
      }
      break;
    } catch (err) {
      lastBuildError = err;
    }
  }

  if (!buildSucceeded) {
    console.error(
      `\n[Build] All ${MAX_BUILD_ATTEMPTS} attempts failed. This is very unlikely ` +
      `to be the filesystem race — treat it as a real build error and read the ` +
      `compiler output above.`
    );
    throw lastBuildError;
  }
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

  // 4. Create directory aliases for every page (e.g., out/problem.html -> out/problem/index.html)
  // This guarantees 100% redirect-free SPA hosting on all static providers and Firebase.
  if (fs.existsSync(outDir)) {
    console.log('Creating clean URL index aliases for SPA continuity...');
    for (const file of fs.readdirSync(outDir)) {
      if (file.endsWith('.html') && file !== 'index.html' && file !== '404.html' && file !== '_not-found.html') {
        const routeName = file.replace('.html', '');
        const routeDir = path.join(outDir, routeName);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        const targetIndex = path.join(routeDir, 'index.html');
        fs.copyFileSync(path.join(outDir, file), targetIndex);
      }
    }
  }

  console.log('\n--- Build and static bundle export completed successfully! ---');
} catch (err) {
  console.error('\n[ERROR] Next.js build failed. Refusing to treat as success.', err?.message || err);
  process.exit(1);
}
