const fs = require('fs');
const path = require('path');
const logPath = path.join(process.cwd(), 'debug-ea5c88.log');

function log(hypothesisId, location, message, data) {
  const row = {
    sessionId: 'ea5c88',
    runId: 'post-fix',
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  };
  fs.appendFileSync(logPath, JSON.stringify(row) + '\n');
  console.log(JSON.stringify(row));
}

function resolveUser(rawPayload) {
  return rawPayload?.user && typeof rawPayload.user === 'object' && !rawPayload.id
    ? rawPayload.user
    : rawPayload;
}

const nested = {
  user: { id: 'usr_dev_test', name: 'Vinay', role: 'student' },
  token: 'jwt_dev',
};
const flat = { id: 'usr_flat', name: 'Flat' };
const r1 = resolveUser(nested);
const r2 = resolveUser(flat);

log('A', 'verify:flatten', 'nested envelope resolves id', {
  flattened: true,
  resolvedId: r1.id,
  wouldHaveRejectedBefore: !nested.id && !!nested.user.id,
  acceptsFlat: r2.id === 'usr_flat',
  earlyReturn: !r1?.id,
});

const ig = fs.readFileSync('src/lib/services/identityGateway.ts', 'utf8');
log('B', 'verify:identityGateway', 'uses api client not raw /api/v1 fetch', {
  usesApiImport: ig.includes("from '@/lib/api/client'"),
  hasRawVaultFetch: /fetch\(\s*['"]\/api\/v1\/auth\/vault-challenge['"]/.test(ig),
});

const client = fs.readFileSync('src/lib/api/client.ts', 'utf8');
const authCtx = fs.readFileSync('src/lib/context/AuthContext.tsx', 'utf8');
log('C', 'verify:profile-role', 'role stripped on profile update', {
  hasDeleteRole: client.includes('delete raw.role'),
  signupForcedStudent: /role:\s*'student'/.test(authCtx),
  flattensEnvelope: authCtx.includes('rawPayload?.user'),
});

const usersRoute = fs.readFileSync('src/app/api/admin/users/route.ts', 'utf8');
const requestSection = client.split('async function request')[1]?.split('firestoreRouter')[0] || '';
log('D', 'verify:admin-gate', 'admin gated and not live-preferred', {
  requireAdminImport: usersRoute.includes('requireAdminFromRequest'),
  livePreferIncludesAdmin: requestSection.includes("path.startsWith('/api/admin')"),
  superadminAllowed: client.includes("profile?.role !== 'superadmin'"),
});

log('E', 'verify:middleware', 'middleware removed for static export', {
  middlewareExists: fs.existsSync('src/middleware.ts'),
});
