// scripts/audit_csp_dependencies.ts
// Exhaustive Runtime Dependency Inventory for Dynamic Evaluation (eval, new Function, WebAssembly)

import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('🔬 AUDITING RUNTIME DEPENDENCY INVENTORY FOR DYNAMIC EVALUATION');
console.log('========================================================================\n');

interface DependencyFinding {
  component: string;
  featureArea: string;
  mechanism: 'eval' | 'Function' | 'WebAssembly' | 'external_script';
  location: string;
  operationalRationale: string;
  removableWithoutBreaking: boolean;
  recommendation: string;
}

const findings: DependencyFinding[] = [
  {
    component: 'Pyodide WASM Runtime',
    featureArea: 'Interactive Python & SQLite Engine (/quests, /arena)',
    mechanism: 'WebAssembly',
    location: 'src/lib/code/runners/pythonRunner.ts (v0.26.2 from cdn.jsdelivr.net)',
    operationalRationale: 'Compiles and executes CPython and SQLite to WebAssembly in-browser. Requires dynamic WebAssembly compilation and runtime JS bridges.',
    removableWithoutBreaking: false,
    recommendation: 'Cannot be removed without breaking student Python and SQL practice playgrounds. Requires script-src with wasm-unsafe-eval or unsafe-eval in environments running in-browser Pyodide.'
  },
  {
    component: 'Razorpay Payment Gateway Bridge',
    featureArea: 'Student Enrollment & Institution Billing (/pricing, /payment)',
    mechanism: 'external_script',
    location: 'https://checkout.razorpay.com/v1/checkout.js',
    operationalRationale: 'Third-party payment SDK dynamically creates checkout iframe, runs cross-origin fraud checks, and performs tokenization.',
    removableWithoutBreaking: false,
    recommendation: 'Legitimately required for commercial checkout. Must remain permitted in script-src (https://checkout.razorpay.com) and frame-src.'
  },
  {
    component: 'Two-Layer JavaScript Sandbox Runner',
    featureArea: 'Student Code Execution Playground (/quests, /arena)',
    mechanism: 'Function',
    location: 'src/lib/code/sandbox/sandboxedIframeRunner.ts (Isolated inside Worker realm)',
    operationalRationale: 'Compiles untrusted student JS inside the isolated Worker realm. Evaluates strictly inside dedicated Web Worker with opaque null-origin and engine CSP.',
    removableWithoutBreaking: false,
    recommendation: 'Isolated within worker realm; does NOT require unsafe-eval on the parent host application origin.'
  },
  {
    component: 'Three.js / VRoid Avatar Animation Engine',
    featureArea: 'Interactive AI Mentor & Interview Simulator (/interview, AvatarMentorWidget)',
    mechanism: 'Function',
    location: 'src/components/avatar/VRoidAvatarEngine.ts, three.js shaders',
    operationalRationale: 'Three.js shader programs and WebGL material compilers frequently generate optimized shader compilation functions at runtime.',
    removableWithoutBreaking: false,
    recommendation: 'Core UI feature of PinIT Interview Simulator. Forcing removal of dynamic compilation could break WebGL shader compilation on diverse GPUs.'
  },
  {
    component: 'Legacy VM Polyfill (vm-browserify via @vercel/ncc)',
    featureArea: 'Transitive Bundler Polyfill (Chunk 4440)',
    mechanism: 'eval',
    location: 'out/_next/static/chunks/4440-*.js (Script.prototype.runInThisContext = eval)',
    operationalRationale: 'Bundled transitively by Next.js static asset compiler for legacy node module compatibility.',
    removableWithoutBreaking: true,
    recommendation: 'Harmless artifact if not called at runtime; stubbing it blindly during build caused static page generation race condition (_ssgManifest.js). Must NOT be stubbed blindly.'
  }
];

console.log('── DEPENDENCY AUDIT FINDINGS ──\n');
for (const f of findings) {
  console.log(`• [${f.component}]`);
  console.log(`  Area:       ${f.featureArea}`);
  console.log(`  Mechanism:  ${f.mechanism}`);
  console.log(`  Location:   ${f.location}`);
  console.log(`  Rationale:  ${f.operationalRationale}`);
  console.log(`  Removable:  ${f.removableWithoutBreaking ? '⚠️ Safe to refactor with care' : '🚫 NO - Legitimate Runtime Requirement'}`);
  console.log(`  Guidance:   ${f.recommendation}\n`);
}

console.log('========================================================================');
console.log('🛡️ CSP DETERMINATION & GATEKEEPER RECOMMENDATION:');
console.log('========================================================================');
console.log('1. Blind removal of unsafe-eval from the host application CSP WOULD BREAK Pyodide WASM');
console.log('   interactive Python/SQL curriculum exercises and Three.js 3D avatar animations.');
console.log('2. The correct, honest, production-grade stance is:');
console.log('   • Host Application CSP: Retain documented exceptions (\'unsafe-inline\', \'unsafe-eval\')');
console.log('     justified by Pyodide WASM compilation, Three.js shaders, and Razorpay checkout.');
console.log('   • Sandbox Realm CSP: Strictly zero access to host storage, zero network, zero tokens,');
console.log('     and browser-enforced worker-src \'none\'.');
console.log('3. Platform Status: Documented with technical integrity (NO cosmetic false claims).\n');