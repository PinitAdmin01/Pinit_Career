/**
 * Bootstrap for scripts/completion-xp-authorization.test.ts.
 *
 * ⚠ Mutates a live Supabase project (creates one throwaway auth account per
 * run). Run manually/on demand — not part of the routine tsc/content-qa loop.
 *
 * Usage: node scripts/completion-xp-authorization.test.js
 * Exit codes: 0 = blocked (secure), 1 = vulnerable or test failure, 2 = skipped.
 */

process.env.TS_NODE_TRANSPILE_ONLY = 'true';
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: 'commonjs',
  moduleResolution: 'node',
  target: 'ES2020',
  esModuleInterop: true,
  allowJs: true,
  noEmit: false,
  isolatedModules: false,
  skipLibCheck: true,
  baseUrl: '.',
  paths: { '@/*': ['./src/*'] },
});

require('ts-node/register');
require('tsconfig-paths/register');
require('./completion-xp-authorization.test.ts');
