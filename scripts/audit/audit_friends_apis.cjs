const fs = require('fs');
const path = require('path');

const clientFiles = [
  'src/app/friends/page.tsx',
  'src/app/friends/[id]/page.tsx',
  'src/components/friends/FriendChatView.tsx',
  'src/components/friends/FriendProfileDrawer.tsx',
  'src/components/friends/ArenaChallengeModal.tsx',
  'src/components/friends/ArenaChallengesView.tsx',
  'src/components/friends/PrivacySettingsModal.tsx',
  'src/components/friends/ProjectInviteModal.tsx',
  'src/components/friends/ReportStudentModal.tsx',
  'src/components/friends/SmartMatchModal.tsx',
  'src/components/friends/SquadProjectsView.tsx',
  'src/components/friends/StudentCard.tsx'
];

console.log('========================================================================');
console.log('🔍 EXHAUSTIVE API CALL MATRIX AUDIT');
console.log('========================================================================\n');

const calls = [];
clientFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('fetch(')) {
      const snippet = lines.slice(idx, idx + 12).join('\n');
      
      let url = 'unknown';
      const m1 = snippet.match(/fetch\(\s*['"`]([^'"`]+)['"`]/);
      const m2 = snippet.match(/fetch\(\s*(`[^`]+`)/);
      const mVar = snippet.match(/fetch\(\s*([a-zA-Z0-9_]+)\s*\)/);

      if (m1) {
        url = m1[1];
      } else if (m2) {
        url = m2[1];
      } else if (mVar) {
        const varName = mVar[1];
        // Look backwards 1-5 lines for const varName = ...
        for (let b = Math.max(0, idx - 5); b < idx; b++) {
          const varMatch = lines[b].match(new RegExp(`const\\s+${varName}\\s*=\\s*['"\`]?([^;'"\`]+)['"\`]?`));
          if (varMatch) {
            url = varMatch[1].trim();
            break;
          }
        }
      }

      let method = 'GET';
      const mm = snippet.match(/method:\s*['"]([A-Z]+)['"]/);
      if (mm) method = mm[1];

      calls.push({ file, line: idx + 1, method, url, snippet });
    }
  });
});

console.log(`Found ${calls.length} API invocations across all client components:\n`);

// Route handlers mapped
const availableRoutes = {
  '/api/friends': ['GET', 'POST', 'PATCH', 'DELETE'],
  '/api/friends/[id]': ['GET'],
  '/api/friends/search': ['GET'],
  '/api/friends/suggestions': ['GET'],
  '/api/friends/respond': ['POST'],
  '/api/friends/challenges': ['GET', 'POST', 'PATCH'],
  '/api/friends/projects': ['GET', 'POST', 'PATCH'],
  '/api/friends/messages': ['GET', 'POST', 'PATCH'],
  '/api/friends/report': ['POST'],
  '/api/friends/block': ['GET', 'POST'],
  '/api/friends/privacy': ['GET', 'PUT', 'POST']
};

let missingCount = 0;
calls.forEach((c, i) => {
  // Normalize URL to route pattern
  let cleanUrl = c.url.replace(/\?.*$/, '').replace(/`/g, '');
  if (cleanUrl.startsWith('/api/friends/') && cleanUrl !== '/api/friends/search' && cleanUrl !== '/api/friends/suggestions' && cleanUrl !== '/api/friends/respond' && cleanUrl !== '/api/friends/challenges' && cleanUrl !== '/api/friends/projects' && cleanUrl !== '/api/friends/messages' && cleanUrl !== '/api/friends/report' && cleanUrl !== '/api/friends/block' && cleanUrl !== '/api/friends/privacy') {
    cleanUrl = '/api/friends/[id]';
  }

  const supported = availableRoutes[cleanUrl];
  const isValidMethod = supported && supported.includes(c.method);

  if (isValidMethod) {
    console.log(`  ✅ [${i + 1}] ${c.method.padEnd(6)} ${c.url.padEnd(45)} -> MATCHES ${cleanUrl} (${path.basename(c.file)}:${c.line})`);
  } else {
    console.error(`  ❌ [${i + 1}] ${c.method.padEnd(6)} ${c.url.padEnd(45)} -> MISSING OR INVALID! Supported: ${supported ? supported.join(',') : 'NONE'} (${c.file}:${c.line})`);
    missingCount++;
  }
});

console.log('\n========================================================================');
if (missingCount === 0) {
  console.log(`🎉 100% PERFECT: ALL ${calls.length} API INVOCATIONS MATCH VALID BACKEND ENDPOINTS`);
} else {
  console.log(`⚠️ FOUND ${missingCount} MISMATCHED OR MISSING API ROUTES`);
  process.exit(1);
}
console.log('========================================================================\n');
