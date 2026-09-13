// scripts/verify_api_parity.ts
// Dual-Router Parity Linter (Friend 2 - Task 2.1)
// Verifies that all server API endpoints under src/app/api/ are covered by LIVE_API_PREFIXES in client.ts

import fs from 'fs';
import path from 'path';

// Excluded routes from client-side live prefix coverage
const EXCLUDED_PREFIXES = [
  '/api/admin', // Deliberately absent for client-side RBAC (profile.role) evaluation
  '/api/cron',  // Internal background cron worker triggers
];

function getApiRoutes(dir: string, base: string = '/api'): string[] {
  let routes: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes = routes.concat(getApiRoutes(fullPath, `${base}/${entry.name}`));
    } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
      routes.push(base);
    }
  }

  return routes;
}

function extractLiveApiPrefixes(): string[] {
  const clientPath = path.join(process.cwd(), 'src', 'lib', 'api', 'client.ts');
  const content = fs.readFileSync(clientPath, 'utf8');

  const match = content.match(/const\s+LIVE_API_PREFIXES[^=]*=\s*\[([\s\S]*?)\];/);
  if (!match || !match[1]) {
    throw new Error('Could not parse LIVE_API_PREFIXES from src/lib/api/client.ts');
  }

  // Parse quoted strings inside the array
  const rawEntries = match[1].match(/['"][^'"]+['"]/g) || [];
  return rawEntries.map(s => s.replace(/['"]/g, '').trim());
}

async function verifyApiParity() {
  console.log('========================================================================');
  console.log('🔍 DUAL-ROUTER API PARITY LINTER (FRIEND 2 - TASK 2.1)');
  console.log('========================================================================\n');

  const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
  if (!fs.existsSync(apiDir)) {
    console.error(`❌ API directory does not exist at ${apiDir}`);
    process.exit(1);
  }

  const livePrefixes = extractLiveApiPrefixes();
  console.log(`✅ Loaded ${livePrefixes.length} prefixes from LIVE_API_PREFIXES in client.ts`);

  const allRoutes = getApiRoutes(apiDir);
  console.log(`✅ Discovered ${allRoutes.length} total active route handlers under src/app/api/\n`);

  const uncovered: string[] = [];
  let coveredCount = 0;
  let excludedCount = 0;

  for (const route of allRoutes) {
    const isExcluded = EXCLUDED_PREFIXES.some(p => route === p || route.startsWith(p + '/'));
    if (isExcluded) {
      excludedCount++;
      continue;
    }

    const isCovered = livePrefixes.some(p => route === p || route.startsWith(p + '/'));
    if (isCovered) {
      coveredCount++;
    } else {
      uncovered.push(route);
    }
  }

  console.log('────────────────────────────────────────────────────────────────────────');
  console.log(`📊 Covered Active Endpoints : ${coveredCount}`);
  console.log(`🛡️  Excluded Internal/Admin  : ${excludedCount}`);
  console.log(`❌ Uncovered Missing Routes  : ${uncovered.length}`);
  console.log('────────────────────────────────────────────────────────────────────────\n');

  if (uncovered.length > 0) {
    console.error('🚨 PARITY CHECK FAILED: The following endpoints exist on server but lack LIVE_API_PREFIXES:');
    for (const u of uncovered) {
      console.error(`   - ${u}`);
    }
    console.error('\nFix: Add the missing prefix(es) to LIVE_API_PREFIXES in src/lib/api/client.ts.\n');
    process.exit(1);
  } else {
    console.log('🎉 100% ROUTER PARITY: All server endpoints are properly declared in LIVE_API_PREFIXES!');
    process.exit(0);
  }
}

verifyApiParity().catch((err) => {
  console.error('Fatal error running API parity check:', err);
  process.exit(1);
});
