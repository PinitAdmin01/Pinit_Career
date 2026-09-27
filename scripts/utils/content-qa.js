/**
 * Bootstrap for scripts/content-qa.ts (Stage 0.1).
 *
 * The repository tsconfig targets the Next.js bundler (module: esnext,
 * moduleResolution: bundler, jsx: preserve, noEmit), which ts-node cannot execute
 * directly. This shim applies a CommonJS override for the harness run only — it
 * does not alter the project's tsconfig or the app build in any way.
 *
 * Uses ts-node + tsconfig-paths, both already present in devDependencies.
 * No new dependency is introduced.
 *
 * Usage:
 *   node scripts/content-qa.js                    # measure + compare to baseline
 *   node scripts/content-qa.js --write-baseline   # freeze the current measurement
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
require('./content-qa.ts');
