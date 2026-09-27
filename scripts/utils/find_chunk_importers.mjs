import fs from 'fs';
import path from 'path';

// Let us inspect the HTML generator or webpack manifest
const manifestPath = '.next/build-manifest.json';
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log('--- pages from build-manifest ---');
  for (const [page, files] of Object.entries(manifest.pages)) {
    const huge = files.filter(f => f.includes('5896') || f.includes('9083'));
    if (huge.length > 0) {
      console.log(page, huge);
    }
  }
}

const appManifestPath = '.next/app-build-manifest.json';
if (fs.existsSync(appManifestPath)) {
  const appManifest = JSON.parse(fs.readFileSync(appManifestPath, 'utf8'));
  console.log('--- pages from app-build-manifest ---');
  for (const [page, files] of Object.entries(appManifest.pages)) {
    const huge = files.filter(f => f.includes('5896') || f.includes('9083'));
    if (huge.length > 0) {
      console.log(page, huge);
    }
  }
}
