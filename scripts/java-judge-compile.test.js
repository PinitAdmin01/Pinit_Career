/**
 * Bootstrap for scripts/java-judge-compile.test.ts.
 * Usage: node scripts/java-judge-compile.test.js
 * Exit codes: 0 = all pass, 1 = failure, 2 = skipped (no JDK available).
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
require('./java-judge-compile.test.ts');
