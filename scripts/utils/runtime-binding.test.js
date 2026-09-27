/**
 * Bootstrap for scripts/runtime-binding.test.ts — same ts-node/tsconfig-paths
 * approach as scripts/content-qa.js (see that file for rationale). No new
 * dependency; does not alter the app's tsconfig or build.
 *
 * Usage: node scripts/runtime-binding.test.js
 */

process.env.TS_NODE_TRANSPILE_ONLY = 'true';
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: 'commonjs',
  moduleResolution: 'node',
  target: 'ES2020',
  jsx: 'react-jsx',
  esModuleInterop: true,
  allowJs: true,
  noEmit: false,
  isolatedModules: false,
  skipLibCheck: true,
  resolveJsonModule: true,
  baseUrl: '.',
  paths: { '@/*': ['./src/*'] },
});

require('ts-node/register');
require('tsconfig-paths/register');
require('./runtime-binding.test.ts');
