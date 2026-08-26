/**
 * Bootstrap for scripts/java-judge-runner.test.ts — same ts-node/tsconfig-paths
 * approach as the other Stage 0/1 test scripts. No new dependency.
 *
 * Usage: node scripts/java-judge-runner.test.js
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
  lib: ['ES2020', 'DOM'],
  baseUrl: '.',
  paths: { '@/*': ['./src/*'] },
});

require('ts-node/register');
require('tsconfig-paths/register');
require('./java-judge-runner.test.ts');
