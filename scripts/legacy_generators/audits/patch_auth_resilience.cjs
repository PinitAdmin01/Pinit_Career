const fs = require('fs');
const path = require('path');

const file = path.resolve('src/lib/context/AuthContext.tsx');
let content = fs.readFileSync(file, 'utf8');

const anchor = '// Defect 002: Require server session verification before trusting any local cache';
const endAnchor = 'if (sbUser) {\r\n        await loadProfile(sbUser);';
const endAnchorLF = 'if (sbUser) {\n        await loadProfile(sbUser);';

const targetEnd = content.includes(endAnchor) ? endAnchor : endAnchorLF;
const startIndex = content.indexOf(anchor);
const endIndex = content.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('Failed to locate anchors:', { startIndex, endIndex });
  process.exit(1);
}

const replacement = `// Multi-tier session hydration: Option 1 (Supabase) -> Option 2 (Server HttpOnly) -> Option 3 (Local Storage)
      if (!sbUser && typeof window !== 'undefined') {
        try {
          const sRes = await fetch('/api/auth/session').catch(() => null);
          if (sRes && sRes.ok) {
            const sData = await sRes.json().catch(() => null);
            if (sData?.authenticated && sData?.uid) {
              const cached = profileCacheRef.current[sData.uid];
              let cachedProfile = cached && Date.now() - cached.ts < CACHE_TTL ? cached.data : null;
              if (!cachedProfile) {
                try {
                  const saved = localStorage.getItem(\`pinit_\${sData.uid}_profile\`) || localStorage.getItem('pinit_current_user');
                  if (saved) cachedProfile = JSON.parse(saved);
                } catch {}
              }
              if (!cachedProfile) {
                cachedProfile = {
                  id: sData.uid,
                  uid: sData.uid,
                  email: \`\${sData.uid}@pinit.in\`,
                  displayName: 'Student',
                  role: sData.role || 'student',
                };
              }
              sbUser = {
                id: sData.uid,
                email: cachedProfile.email || \`\${cachedProfile.username || 'user'}@pinit.app\`,
                user_metadata: { display_name: cachedProfile.displayName || cachedProfile.full_name || 'User' }
              } as any;
            }
          }
        } catch {}

        // Option 3: Local storage fallback for standalone demo / offline sessions
        if (!sbUser) {
          try {
            const rawCurrent = localStorage.getItem('pinit_current_user');
            if (rawCurrent) {
              const parsedCurrent = JSON.parse(rawCurrent);
              if (parsedCurrent && parsedCurrent.id) {
                sbUser = {
                  id: parsedCurrent.id,
                  email: parsedCurrent.email || \`\${parsedCurrent.id}@pinit.in\`,
                  user_metadata: { display_name: parsedCurrent.displayName || parsedCurrent.name || 'User' }
                } as any;
              }
            }
          } catch {}
        }
      }
      `;

const isCRLF = content.includes('\r\n');
const formattedReplacement = isCRLF ? replacement.replace(/\n/g, '\r\n') : replacement.replace(/\r\n/g, '\n');

content = content.slice(0, startIndex) + formattedReplacement + content.slice(endIndex);
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched AuthContext.tsx with multi-tier session fallback!');
