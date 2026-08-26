/**
 * Bootstrap for scripts/java-judge-routing.test.ts.
 * Usage: node scripts/java-judge-routing.test.js
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
require('./java-judge-routing.test.ts');
