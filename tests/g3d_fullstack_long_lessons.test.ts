import test from 'node:test';
import assert from 'node:assert/strict';
import { getLongLesson, getLongLessonLanguage, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('G3D & Fullstack-JS Long Lessons: Resolution & Language Invariants', () => {
  // 1. g3d
  const g3dLesson = getLongLesson('g3d', 1);
  assert.ok(g3dLesson, 'g3d Day 1 long lesson must resolve');
  assert.equal(g3dLesson.day, 1);
  assert.equal(g3dLesson.parts.length, 5, 'g3d Day 1 must contain exactly 5 parts');
  assert.ok(g3dLesson.summary.length >= 4, 'g3d Day 1 must contain comprehensive summary');
  assert.ok(g3dLesson.projectStep, 'g3d Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('g3d'), 'typescript');

  // 2. fullstack-js
  const fullstackLesson = getLongLesson('fullstack-js', 1);
  assert.ok(fullstackLesson, 'fullstack-js Day 1 long lesson must resolve');
  assert.equal(fullstackLesson.day, 1);
  assert.equal(fullstackLesson.parts.length, 5, 'fullstack-js Day 1 must contain exactly 5 parts');
  assert.ok(fullstackLesson.summary.length >= 4, 'fullstack-js Day 1 must contain comprehensive summary');
  assert.ok(fullstackLesson.projectStep, 'fullstack-js Day 1 must have a hands-on project step');
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');
});

test('G3D Day 1: WebGL2 & Shader Math Code Snippets & Socratic Checks Verification', () => {
  const g3dLesson = getLongLesson('g3d', 1);
  assert.ok(g3dLesson);

  for (const part of g3dLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable TypeScript code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
  }
});

test('Fullstack-JS Day 1: React Server Components & Streaming SSR Code Snippets & Socratic Checks Verification', () => {
  const fullstackLesson = getLongLesson('fullstack-js', 1);
  assert.ok(fullstackLesson);

  for (const part of fullstackLesson.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable TypeScript code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);

    // Verify Socratic MCQ Check
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');

    // Structural code invariants
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
  }
});

test('G3D Day 2: Resolution & Structural Invariants for PBR, Shadows & WebGPU', () => {
  const g3dD2 = getLongLesson('g3d', 2);
  assert.ok(g3dD2, 'g3d Day 2 long lesson must resolve');
  assert.equal(g3dD2.day, 2);
  assert.equal(g3dD2.parts.length, 5, 'g3d Day 2 must contain exactly 5 parts');
  assert.ok(g3dD2.summary.length >= 4, 'g3d Day 2 must contain comprehensive summary');
  assert.ok(g3dD2.projectStep, 'g3d Day 2 must have a hands-on project step');
  assert.ok(g3dD2.minutes >= 15, 'g3d Day 2 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of g3dD2.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('G3D Day 2: Domain-Specific Content Assertions', () => {
  const g3dD2 = getLongLesson('g3d', 2);
  assert.ok(g3dD2);

  // Part 1 – PBR Cook-Torrance
  assert.ok(g3dD2.parts[0].title.includes('PBR') || g3dD2.parts[0].title.includes('Cook-Torrance'));
  assert.ok(g3dD2.parts[0].output.includes('Energy Conserved: YES'));

  // Part 2 – Shadow Mapping & PCF
  assert.ok(g3dD2.parts[1].title.includes('Shadow'));
  assert.ok(g3dD2.parts[1].output.includes('PCF'));

  // Part 3 – Deferred Shading
  assert.ok(g3dD2.parts[2].title.includes('Deferred'));
  assert.ok(g3dD2.parts[2].output.includes('3.0x Faster'));

  // Part 4 – WebGPU
  assert.ok(g3dD2.parts[3].title.includes('WebGPU'));
  assert.ok(g3dD2.parts[3].output.includes('IMMUTABLE'));

  // Part 5 – Frustum Culling
  assert.ok(g3dD2.parts[4].title.includes('Culling') || g3dD2.parts[4].title.includes('AABB'));
  assert.ok(g3dD2.parts[4].output.includes('Culled Draw Calls Eliminated: 2'));
});

test('Fullstack-JS Day 2: Resolution & Structural Invariants for EventEmitter, Buffers, UTF-8 & Backpressure', () => {
  const fsD2 = getLongLesson('fullstack-js', 2);
  assert.ok(fsD2, 'fullstack-js Day 2 long lesson must resolve');
  assert.equal(fsD2.day, 2);
  assert.equal(fsD2.parts.length, 5, 'fullstack-js Day 2 must contain exactly 5 parts');
  assert.ok(fsD2.summary.length >= 4, 'fullstack-js Day 2 must contain comprehensive summary');
  assert.ok(fsD2.projectStep, 'fullstack-js Day 2 must have a hands-on project step');
  assert.ok(fsD2.minutes >= 15, 'fullstack-js Day 2 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of fsD2.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Fullstack-JS Day 2: Domain-Specific Content Assertions', () => {
  const fsD2 = getLongLesson('fullstack-js', 2);
  assert.ok(fsD2);

  // Part 1 – Observer Pattern / EventEmitter
  assert.ok(fsD2.parts[0].title.includes('EventEmitter') || fsD2.parts[0].title.includes('Observer Pattern'));
  assert.ok(fsD2.parts[0].output.includes('Total Audit Logs: 2'));

  // Part 2 – Binary Data & Memory Buffers
  assert.ok(fsD2.parts[1].title.includes('Buffers') || fsD2.parts[1].title.includes('Binary Data'));
  assert.ok(fsD2.parts[1].output.includes('Safe Buffer Verified Zero-Filled: true'));

  // Part 3 – Character Encodings & UTF-8 Multi-Byte Drift
  assert.ok(fsD2.parts[2].title.includes('Character Encodings') || fsD2.parts[2].title.includes('UTF-8'));
  assert.ok(fsD2.parts[2].output.includes('ENCODING DRIFT AUDIT MATRIX'));

  // Part 4 – Streaming Data & Backpressure
  assert.ok(fsD2.parts[3].title.includes('Backpressure') || fsD2.parts[3].title.includes('Streaming Data'));
  assert.ok(fsD2.parts[3].output.includes('Backpressure Triggered!'));

  // Part 5 – Production Event Bus & Memory Leak Detection
  assert.ok(fsD2.parts[4].title.includes('Event Bus') || fsD2.parts[4].title.includes('Memory Leak'));
  assert.ok(fsD2.parts[4].output.includes('After Cleanup - Active Listeners: 1'));
});

test('Fullstack-JS Day 3: Resolution & Structural Invariants for HTTP Framing, Verbs, Idempotency & REST Contracts', () => {
  const fsD3 = getLongLesson('fullstack-js', 3);
  assert.ok(fsD3, 'fullstack-js Day 3 long lesson must resolve');
  assert.equal(fsD3.day, 3);
  assert.equal(fsD3.parts.length, 5, 'fullstack-js Day 3 must contain exactly 5 parts');
  assert.ok(fsD3.summary.length >= 4, 'fullstack-js Day 3 must contain comprehensive summary');
  assert.ok(fsD3.projectStep, 'fullstack-js Day 3 must have a hands-on project step');
  assert.ok(fsD3.minutes >= 15, 'fullstack-js Day 3 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of fsD3.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Fullstack-JS Day 3: Domain-Specific Content Assertions', () => {
  const fsD3 = getLongLesson('fullstack-js', 3);
  assert.ok(fsD3);

  // Part 1 – HTTP/1.1 & HTTP/2 Framing
  assert.ok(fsD3.parts[0].title.includes('HTTP/1.1') || fsD3.parts[0].title.includes('HTTP/2'));
  assert.ok(fsD3.parts[0].output.includes('Target Path: /v1/checkout'));

  // Part 2 – Semantic Verbs & Safe Operations
  assert.ok(fsD3.parts[1].title.includes('Semantic Verbs') || fsD3.parts[1].title.includes('PATCH'));
  assert.ok(fsD3.parts[1].output.includes('Created via POST (201)'));

  // Part 3 – Idempotency Physics
  assert.ok(fsD3.parts[2].title.includes('Idempotency'));
  assert.ok(fsD3.parts[2].output.includes('Total Actual Bank Charges Incurred: 1'));

  // Part 4 – Status Code Hierarchy & Fault Isolation
  assert.ok(fsD3.parts[3].title.includes('Status Code') || fsD3.parts[3].title.includes('Fault Isolation'));
  assert.ok(fsD3.parts[3].output.includes("category: 'SERVER_FAULT'"));

  // Part 5 – Uniform API Envelopes & RESTful Error Contracts
  assert.ok(fsD3.parts[4].title.includes('API Envelopes') || fsD3.parts[4].title.includes('Error Contract'));
  assert.ok(fsD3.parts[4].output.includes('200 Response Success Flag: true'));
});

test('G3D Day 3: Resolution & Structural Invariants for Skeletal Skinning, SSAO, Compute & BVH', () => {
  const g3dD3 = getLongLesson('g3d', 3);
  assert.ok(g3dD3, 'g3d Day 3 long lesson must resolve');
  assert.equal(g3dD3.day, 3);
  assert.equal(g3dD3.parts.length, 5, 'g3d Day 3 must contain exactly 5 parts');
  assert.ok(g3dD3.summary.length >= 4, 'g3d Day 3 must contain comprehensive summary');
  assert.ok(g3dD3.projectStep, 'g3d Day 3 must have a hands-on project step');
  assert.ok(g3dD3.minutes >= 15, 'g3d Day 3 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of g3dD3.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('G3D Day 3: Domain-Specific Content Assertions', () => {
  const g3dD3 = getLongLesson('g3d', 3);
  assert.ok(g3dD3);

  // Part 1 – Skeletal Mesh Animation & Dual Quaternion Skinning
  assert.ok(g3dD3.parts[0].title.includes('Skinning') || g3dD3.parts[0].title.includes('Dual Quaternion'));
  assert.ok(g3dD3.parts[0].output.includes('CANDY-WRAPPER ARTIFACT COMPLETELY MITIGATED'));

  // Part 2 – Screen-Space Ambient Occlusion (SSAO)
  assert.ok(g3dD3.parts[1].title.includes('SSAO') || g3dD3.parts[1].title.includes('Ambient Occlusion'));
  assert.ok(g3dD3.parts[1].output.includes('Ambient Light Blocked'));

  // Part 3 – WebGPU Compute Shaders & Particle Simulation
  assert.ok(g3dD3.parts[2].title.includes('Compute') || g3dD3.parts[2].title.includes('Particle'));
  assert.ok(g3dD3.parts[2].output.includes('ZERO CPU READBACK'));

  // Part 4 – HDR & ACES Filmic Tone Mapping
  assert.ok(g3dD3.parts[3].title.includes('Tone Mapping') || g3dD3.parts[3].title.includes('HDR'));
  assert.ok(g3dD3.parts[3].output.includes('ACES Filmic Tone Mapped'));

  // Part 5 – Bounding Volume Hierarchy (BVH) & Slab Traversal
  assert.ok(g3dD3.parts[4].title.includes('BVH') || g3dD3.parts[4].title.includes('Slab'));
  assert.ok(g3dD3.parts[4].output.includes('HIT at t=15.0'));
});

test('Fullstack-JS Day 4: Resolution & Structural Invariants for Middleware Pipelines, RFC 7807 & Observability', () => {
  const fsD4 = getLongLesson('fullstack-js', 4);
  assert.ok(fsD4, 'fullstack-js Day 4 long lesson must resolve');
  assert.equal(fsD4.day, 4);
  assert.equal(fsD4.parts.length, 5, 'fullstack-js Day 4 must contain exactly 5 parts');
  assert.ok(fsD4.summary.length >= 4, 'fullstack-js Day 4 must contain comprehensive summary');
  assert.ok(fsD4.projectStep, 'fullstack-js Day 4 must have a hands-on project step');
  assert.ok(fsD4.minutes >= 15, 'fullstack-js Day 4 must be at least 15 minutes');

  // Structural invariants for every part
  for (const part of fsD4.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Fullstack-JS Day 4: Domain-Specific Content Assertions', () => {
  const fsD4 = getLongLesson('fullstack-js', 4);
  assert.ok(fsD4);

  // Part 1 – Chain of Responsibility (req, res, next)
  assert.ok(fsD4.parts[0].title.includes('Chain of Responsibility') || fsD4.parts[0].title.includes('next'));
  assert.ok(fsD4.parts[0].output.includes('Logger: Request received for /dashboard'));
  assert.ok(fsD4.parts[0].output.includes('Final response status: 200'));

  // Part 2 – Request Augmentation & Context Propagation
  assert.ok(fsD4.parts[1].title.includes('Request Augmentation') || fsD4.parts[1].title.includes('Context Propagation'));
  assert.ok(fsD4.parts[1].output.includes('Augmented Order Response'));
  assert.ok(fsD4.parts[1].output.includes('ord_771'));

  // Part 3 – Async Middleware & Express 4 vs Express 5
  assert.ok(fsD4.parts[2].title.includes('Async Middleware') || fsD4.parts[2].title.includes('Express'));
  assert.ok(fsD4.parts[2].output.includes('Global Error Handler caught'));
  assert.ok(fsD4.parts[2].output.includes('Database connection timed out'));

  // Part 4 – 4-Parameter Error Handling Middleware & RFC 7807
  assert.ok(fsD4.parts[3].title.includes('Error Handling Middleware') || fsD4.parts[3].title.includes('RFC 7807'));
  assert.ok(fsD4.parts[3].output.includes('Centralized Error Result Status: 422'));
  assert.ok(fsD4.parts[3].output.includes('RFC 7807 Error Envelope Detail'));

  // Part 5 – Production Observability Pipeline
  assert.ok(fsD4.parts[4].title.includes('Observability Pipeline') || fsD4.parts[4].title.includes('Rate Limiting'));
  assert.ok(fsD4.parts[4].output.includes('Captured X-Response-Time: 15ms'));
  assert.ok(fsD4.parts[4].output.includes('Payload delivered safely: ok'));
});

test('G3D Day 4: Resolution & Structural Invariants for Multi-Pass Deferred, Clustered & Compute Physics', () => {
  const g3dD4 = getLongLesson('g3d', 4);
  assert.ok(g3dD4, 'g3d Day 4 long lesson must resolve');
  assert.equal(g3dD4.day, 4);
  assert.equal(g3dD4.parts.length, 5, 'g3d Day 4 must contain exactly 5 parts');
  assert.ok(g3dD4.summary.length >= 4, 'Summary must contain at least 4 items');
  assert.ok(g3dD4.projectStep, 'Day 4 must declare a projectStep');
  assert.ok(g3dD4.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(g3dD4);
  const totalMin = estimateLessonMinutes(g3dD4);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of g3dD4.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('G3D Day 4: Domain-Specific Content Assertions', () => {
  const g3dD4 = getLongLesson('g3d', 4);
  assert.ok(g3dD4);

  // Part 1 – Multi-Pass Deferred Shading & WebGPU G-Buffer
  assert.ok(g3dD4.parts[0].title.includes('Deferred') || g3dD4.parts[0].title.includes('G-Buffer'));
  assert.ok(g3dD4.parts[0].output.includes('Pass 1 (G-Buffer Raster)'));
  assert.ok(g3dD4.parts[0].output.includes('Pass 2 (Deferred Composite)'));

  // Part 2 – Clustered Forward & Tiled Light Culling
  assert.ok(g3dD4.parts[1].title.includes('Clustered') || g3dD4.parts[1].title.includes('Light Culling'));
  assert.ok(g3dD4.parts[1].output.includes('Frustum Clusters'));
  assert.ok(g3dD4.parts[1].output.includes('Cluster Near'));

  // Part 3 – Cook-Torrance GGX Specular BRDF & Energy Conservation
  assert.ok(g3dD4.parts[2].title.includes('Cook-Torrance') || g3dD4.parts[2].title.includes('BRDF'));
  assert.ok(g3dD4.parts[2].output.includes('Dielectric Surface'));
  assert.ok(g3dD4.parts[2].output.includes('Metallic Surface'));

  // Part 4 – WebGPU Compute Broadphase & Spatial Hash Grid Physics
  assert.ok(g3dD4.parts[3].title.includes('Broadphase') || g3dD4.parts[3].title.includes('Spatial Hash'));
  assert.ok(g3dD4.parts[3].output.includes('100,000 Particle Physics'));
  assert.ok(g3dD4.parts[3].output.includes('Broadphase Clustered Pairs'));

  // Part 5 – Mipmap Generation & Anisotropic Texture Filtering
  assert.ok(g3dD4.parts[4].title.includes('Mipmap') || g3dD4.parts[4].title.includes('Anisotropic'));
  assert.ok(g3dD4.parts[4].output.includes('Texture Base: 1024x1024'));
  assert.ok(g3dD4.parts[4].output.includes('Mip LOD'));
});

test('G3D Day 5: Resolution & Structural Invariants for WebGPU Ray Tracing, Compute Particles & Fog', () => {
  const g3dD5 = getLongLesson('g3d', 5);
  assert.ok(g3dD5, 'g3d Day 5 long lesson must resolve');
  assert.equal(g3dD5.day, 5);
  assert.equal(g3dD5.parts.length, 5, 'g3d Day 5 must contain exactly 5 parts');
  assert.ok(g3dD5.summary.length >= 4, 'Summary must contain at least 4 items');
  assert.ok(g3dD5.projectStep, 'Day 5 must declare a projectStep');
  assert.ok(g3dD5.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(g3dD5);
  const totalMin = estimateLessonMinutes(g3dD5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of g3dD5.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('G3D Day 5: Domain-Specific Content Assertions', () => {
  const g3dD5 = getLongLesson('g3d', 5);
  assert.ok(g3dD5);

  // Part 1 – WebGPU Ray Tracing & Möller-Trumbore
  assert.ok(g3dD5.parts[0].title.includes('Ray Tracing') || g3dD5.parts[0].title.includes('BVH'));
  assert.ok(g3dD5.parts[0].output.includes('HIT_CONFIRMED'));
  assert.ok(g3dD5.parts[0].output.includes('Möller-Trumbore'));

  // Part 2 – WebGPU Compute Particles (1 Million)
  assert.ok(g3dD5.parts[1].title.includes('Compute Particle') || g3dD5.parts[1].title.includes('1 Million'));
  assert.ok(g3dD5.parts[1].output.includes('1,000,000 Active Particles'));
  assert.ok(g3dD5.parts[1].output.includes('Ping-Pong'));

  // Part 3 – Screen-Space Reflections (SSR)
  assert.ok(g3dD5.parts[2].title.includes('Screen-Space Reflections') || g3dD5.parts[2].title.includes('SSR'));
  assert.ok(g3dD5.parts[2].output.includes('SURFACE_HIT_FOUND'));
  assert.ok(g3dD5.parts[2].output.includes('Schlick Fresnel Reflectance'));

  // Part 4 – Volumetric Fog & Beer-Lambert
  assert.ok(g3dD5.parts[3].title.includes('Volumetric') || g3dD5.parts[3].title.includes('Beer-Lambert'));
  assert.ok(g3dD5.parts[3].output.includes('Beer-Lambert Transmittance'));
  assert.ok(g3dD5.parts[3].output.includes('Henyey-Greenstein Phase'));

  // Part 5 – HDR ACES Tone Mapping & TAA
  assert.ok(g3dD5.parts[4].title.includes('ACES') || g3dD5.parts[4].title.includes('Tone Mapping'));
  assert.ok(g3dD5.parts[4].output.includes('ACES Filmic Curve'));
  assert.ok(g3dD5.parts[4].output.includes('Temporal Anti-Aliasing (TAA)'));
});

test('Fullstack-JS Day 5: Resolution & Structural Invariants for API Gateways, Rate Limiting & Health Probes', () => {
  const fsD5 = getLongLesson('fullstack-js', 5);
  assert.ok(fsD5, 'fullstack-js Day 5 long lesson must resolve');
  assert.equal(fsD5.day, 5);
  assert.equal(fsD5.parts.length, 5, 'fullstack-js Day 5 must contain exactly 5 parts');
  assert.ok(fsD5.summary.length >= 4, 'Summary must contain at least 4 items');
  assert.ok(fsD5.projectStep, 'Day 5 must declare a projectStep');
  assert.ok(fsD5.projectStep.steps.length >= 4, 'projectStep must have >= 4 steps');

  const spokenMin = estimateSpokenMinutes(fsD5);
  const totalMin = estimateLessonMinutes(fsD5);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  // Structural invariants for every part
  for (const part of fsD5.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    // Socratic MCQ
    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length >= 3, 'MCQ must provide at least 3 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Fullstack-JS Day 5: Domain-Specific Content Assertions', () => {
  const fsD5 = getLongLesson('fullstack-js', 5);
  assert.ok(fsD5);

  // Part 1 – API Gateway Pattern
  assert.ok(fsD5.parts[0].title.includes('API Gateway'));
  assert.ok(fsD5.parts[0].output.includes('Unauthorized Request Status: 401'));
  assert.ok(fsD5.parts[0].output.includes('Authorized Request Status: 200'));
  assert.ok(fsD5.parts[0].output.includes('gw_abc123'));

  // Part 2 – Route Dispatching Trees
  assert.ok(fsD5.parts[1].title.includes('Route Dispatching') || fsD5.parts[1].title.includes('Path Matching'));
  assert.ok(fsD5.parts[1].output.includes('Match /users/me: Current User Profile'));
  assert.ok(fsD5.parts[1].output.includes('Match /users/usr_9942'));

  // Part 3 – Token Bucket Rate Limiting Physics
  assert.ok(fsD5.parts[2].title.includes('Token Bucket') || fsD5.parts[2].title.includes('Rate Limiting'));
  assert.ok(fsD5.parts[2].output.includes('TOKEN BUCKET EXECUTION TRACE'));
  assert.ok(fsD5.parts[2].output.includes('Req 1 (Burst): ALLOWED'));

  // Part 4 – Liveness vs Readiness Health Check Probes
  assert.ok(fsD5.parts[3].title.includes('Health Check') || fsD5.parts[3].title.includes('Readiness'));
  assert.ok(fsD5.parts[3].output.includes('Liveness Status: 200'));
  assert.ok(fsD5.parts[3].output.includes('Readiness Status: 503'));

  // Part 5 – Milestone 1 API Gateway Assembly
  assert.ok(fsD5.parts[4].title.includes('Milestone 1') || fsD5.parts[4].title.includes('API Gateway'));
  assert.ok(fsD5.parts[4].output.includes('Unauthorized Gateway Dispatch Status: 401'));
  assert.ok(fsD5.parts[4].output.includes('Authorized Gateway Dispatch Status: 200'));
  assert.ok(fsD5.parts[4].output.includes('Authorized Gateway User List Count: 2'));
});

test('G3D Days 6–10 & Milestone 2 Capstone: Resolution, Word Counts & Invariants', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('g3d', day);
    assert.ok(lesson, `G3D Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `G3D Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.minutes >= 35, `G3D Day ${day} must be >= 35 minutes`);
    assert.ok(lesson.summary.length >= 4, `G3D Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `G3D Day ${day} must have a hands-on project step`);

    // Total Spoken Words check (>= 2,940 words)
    let totalWords = 0;
    for (const part of lesson.parts) {
      assert.ok(part.code, `Day ${day} Part '${part.title}' must contain code`);
      assert.ok(part.output, `Day ${day} Part '${part.title}' must declare expected output`);
      assert.ok(part.check, `Day ${day} Part '${part.title}' must have Socratic check`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part '${part.title}' MCQ must have 4 options`);
      assert.ok(part.check.answer >= 0 && part.check.answer <= 3, `Day ${day} Part '${part.title}' answer must be in 0..3`);
      assert.ok(part.check.why.length > 20, `Day ${day} Part '${part.title}' explanation must be rigorous`);

      const text = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const w = text.trim().split(/\s+/).filter(Boolean).length;
      totalWords += w;
    }
    assert.ok(totalWords >= 2940, `G3D Day ${day} must have >= 2,940 spoken words (actual: ${totalWords})`);
  }
});

test('G3D Days 6–10: Domain-Specific Content Assertions', () => {
  // Day 6: Spherical Harmonics & GI
  const d6 = getLongLesson('g3d', 6);
  assert.ok(d6.title.includes('Spherical Harmonics') || d6.title.includes('Irradiance Probes'));
  assert.ok(d6.parts[0].output.includes('SH Pipeline'));
  assert.ok(d6.parts[1].output.includes('Chebyshev Test'));

  // Day 7: Cascaded Shadow Maps & PCSS
  const d7 = getLongLesson('g3d', 7);
  assert.ok(d7.title.includes('Cascaded Shadow Maps') || d7.title.includes('PCSS'));
  assert.ok(d7.parts[0].output.includes('CSM Pipeline'));
  assert.ok(d7.parts[0].output.includes('Texel Snapping'));

  // Day 8: GPU-Driven Rendering & Mesh Shaders
  const d8 = getLongLesson('g3d', 8);
  assert.ok(d8.title.includes('GPU-Driven') || d8.title.includes('Mesh Shaders'));
  assert.ok(d8.parts[0].output.includes('GPU-Driven Pipeline'));
  assert.ok(d8.parts[2].output.includes('Hi-Z'));

  // Day 9: TAA & Motion Vectors
  const d9 = getLongLesson('g3d', 9);
  assert.ok(d9.title.includes('Temporal Anti-Aliasing') || d9.title.includes('TAA'));
  assert.ok(d9.parts[0].output.includes('Velocity Pipeline'));
  assert.ok(d9.parts[1].output.includes('Halton'));
  assert.ok(d9.parts[2].output.includes('YCoCg'));

  // Day 10: ⭐ Milestone 2 Capstone
  const d10 = getLongLesson('g3d', 10);
  assert.ok(d10.title.includes('Milestone 2 Capstone'));
  assert.ok(d10.parts[0].title.includes('Tier 1'));
  assert.ok(d10.parts[1].title.includes('Tier 2'));
  assert.ok(d10.parts[2].title.includes('Tier 3'));
  assert.ok(d10.parts[3].title.includes('Tier 4'));
  assert.ok(d10.parts[4].title.includes('Tier 5'));
  assert.ok(d10.parts[4].output.includes('5-GATE ARCHITECTURE VIVA VOCE DEFENSE MATRIX'));
  assert.ok(d10.parts[4].output.includes('109.89 FPS @ 4K Resolution'));
  assert.ok(d10.parts[4].output.includes('Principal 3D Computer Graphics & WebGPU Shader Architect Certification'));
});

test('G3D Days 11–15 & Milestone 3 Capstone: Resolution, Word Counts & Invariants', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = getLongLesson('g3d', day);
    assert.ok(lesson, `G3D Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `G3D Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.minutes >= 35, `G3D Day ${day} must be >= 35 minutes`);
    assert.ok(lesson.summary.length >= 4, `G3D Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `G3D Day ${day} must have a hands-on project step`);

    // Total Spoken Words check (>= 2,940 words)
    let totalWords = 0;
    for (const part of lesson.parts) {
      assert.ok(part.code, `Day ${day} Part '${part.title}' must contain code`);
      assert.ok(part.output, `Day ${day} Part '${part.title}' must declare expected output`);
      assert.ok(part.check, `Day ${day} Part '${part.title}' must have Socratic check`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part '${part.title}' MCQ must have 4 options`);
      assert.ok(part.check.answer >= 0 && part.check.answer <= 3, `Day ${day} Part '${part.title}' answer must be in 0..3`);
      assert.ok(part.check.why.length > 20, `Day ${day} Part '${part.title}' explanation must be rigorous`);

      const text = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const w = text.trim().split(/\s+/).filter(Boolean).length;
      totalWords += w;
    }
    assert.ok(totalWords >= 2940, `G3D Day ${day} must have >= 2,940 spoken words (actual: ${totalWords})`);
  }
});

test('G3D Days 11–15: Domain-Specific Content Assertions', () => {
  // Day 11: Real-Time Volumetric Rendering & Atmospheric Scattering
  const d11 = getLongLesson('g3d', 11);
  assert.ok(d11.title.includes('Volumetric Rendering') || d11.title.includes('Atmospheric Scattering'));
  assert.ok(d11.parts[0].output.includes('Volumetric Pipeline'));
  assert.ok(d11.parts[1].output.includes('Phase Pipeline'));

  // Day 12: Ocean Waves Simulation, FFT & Phillips Spectrum
  const d12 = getLongLesson('g3d', 12);
  assert.ok(d12.title.includes('Ocean Waves') || d12.title.includes('Phillips Spectrum'));
  assert.ok(d12.parts[0].output.includes('Tessendorf FFT Spectrum'));
  assert.ok(d12.parts[3].output.includes('Jacobian Foam'));

  // Day 13: Subsurface Scattering (SSS) & Human Skin
  const d13 = getLongLesson('g3d', 13);
  assert.ok(d13.title.includes('Subsurface Scattering') || d13.title.includes('Human Skin'));
  assert.ok(d13.parts[0].output.includes('Dipole BSSRDF'));
  assert.ok(d13.parts[1].output.includes('Burley Normalized SSS'));

  // Day 14: Hardware Ray Tracing Pipelines: DXR, Vulkan KHR & WebGPU Binding
  const d14 = getLongLesson('g3d', 14);
  assert.ok(d14.title.includes('Hardware Ray Tracing') || d14.title.includes('DXR'));
  assert.ok(d14.parts[0].output.includes('RT Acceleration Structure'));
  assert.ok(d14.parts[1].output.includes('SBT Generator'));

  // Day 15: ⭐ Milestone 3 Capstone: Real-Time Cinematic Digital Twin Engine
  const d15 = getLongLesson('g3d', 15);
  assert.ok(d15.title.includes('Milestone 3 Capstone'));
  assert.ok(d15.parts[0].output.includes('Digital Twin FrameGraph'));
  assert.ok(d15.parts[4].output.includes('Grand Master Certification'));
  assert.ok(d15.parts[4].output.includes('CONFERRED'));
  assert.ok(d15.parts[4].output.includes('Grand Master of 3D Graphics & Real-Time Simulation Systems'));
});

test('G3D Days 16–20: Resolution, Word Counts & Invariants', () => {
  for (let day = 16; day <= 20; day++) {
    const lesson = getLongLesson('g3d', day);
    assert.ok(lesson, `G3D Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `G3D Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.minutes >= 35, `G3D Day ${day} must be >= 35 minutes`);
    assert.ok(lesson.summary.length >= 4, `G3D Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `G3D Day ${day} must have a hands-on project step`);

    // Total Spoken Words check (>= 2,940 words)
    let totalWords = 0;
    for (const part of lesson.parts) {
      assert.ok(part.code, `Day ${day} Part '${part.title}' must contain code`);
      assert.ok(part.output, `Day ${day} Part '${part.title}' must declare expected output`);
      assert.ok(part.check, `Day ${day} Part '${part.title}' must have Socratic check`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part '${part.title}' MCQ must have 4 options`);
      assert.ok(part.check.answer >= 0 && part.check.answer <= 3, `Day ${day} Part '${part.title}' answer must be in 0..3`);
      assert.ok(part.check.why.length > 20, `Day ${day} Part '${part.title}' explanation must be rigorous`);

      const text = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const w = text.trim().split(/\s+/).filter(Boolean).length;
      totalWords += w;
    }
    assert.ok(totalWords >= 2940, `G3D Day ${day} must have >= 2,940 spoken words (actual: ${totalWords})`);
  }
});

test('G3D Days 16–20: Domain-Specific Content Assertions', () => {
  // Day 16: Skeletal Rigging: Bone Hierarchies & Joint Matrices
  const d16 = getLongLesson('g3d', 16);
  assert.ok(d16.title.includes('Skeletal Rigging'));
  assert.ok(d16.parts[0].output.includes('Forward Kinematics'));
  assert.ok(d16.parts[2].output.includes('Joint Palette'));

  // Day 17: Linear Blend Skinning (LBS) & Dual Quaternions
  const d17 = getLongLesson('g3d', 17);
  assert.ok(d17.title.includes('Linear Blend Skinning') || d17.title.includes('Dual Quaternions'));
  assert.ok(d17.parts[0].output.includes('Linear Blend Skinning'));
  assert.ok(d17.parts[3].output.includes('Candy-Wrapper Analysis'));
  assert.ok(d17.parts[4].output.includes('Dual Quaternion Skinning'));

  // Day 18: Inverse Kinematics (IK): FABRIK & CCD Algorithms
  const d18 = getLongLesson('g3d', 18);
  assert.ok(d18.title.includes('Inverse Kinematics') || d18.title.includes('FABRIK'));
  assert.ok(d18.parts[1].output.includes('Analytical Two-Bone IK'));
  assert.ok(d18.parts[2].output.includes('CCD Solver Engine'));
  assert.ok(d18.parts[3].output.includes('FABRIK Engine'));

  // Day 19: Keyframe Animation & Quaternion Slerp Interpolation
  const d19 = getLongLesson('g3d', 19);
  assert.ok(d19.title.includes('Keyframe Animation') || d19.title.includes('Quaternion Slerp'));
  assert.ok(d19.parts[0].output.includes('Quaternion Mathematics Engine'));
  assert.ok(d19.parts[1].output.includes('SLERP Animation Engine'));
  assert.ok(d19.parts[2].output.includes('glTF 2.0 Keyframe Sampler'));

  // Day 20: Animation State Machines & Cross-Fade Blending
  const d20 = getLongLesson('g3d', 20);
  assert.ok(d20.title.includes('Animation State Machines') || d20.title.includes('Cross-Fade Blending'));
  assert.ok(d20.parts[0].output.includes('Animation State Machine'));
  assert.ok(d20.parts[1].output.includes('Cross-Fade Joint Blender'));
  assert.ok(d20.parts[4].output.includes('Avatar Animation Controller'));
});

test('G3D Days 21–25: Resolution, Word Counts & Invariants', () => {
  for (let day = 21; day <= 25; day++) {
    const lesson = getLongLesson('g3d', day);
    assert.ok(lesson, `G3D Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `G3D Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.minutes >= 35, `G3D Day ${day} must be >= 35 minutes`);
    assert.ok(lesson.summary.length >= 4, `G3D Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `G3D Day ${day} must have a hands-on project step`);

    // Total Spoken Words check (>= 2,940 words)
    let totalWords = 0;
    for (const part of lesson.parts) {
      assert.ok(part.code, `Day ${day} Part '${part.title}' must contain code`);
      assert.ok(part.output, `Day ${day} Part '${part.title}' must declare expected output`);
      assert.ok(part.check, `Day ${day} Part '${part.title}' must have Socratic check`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part '${part.title}' MCQ must have 4 options`);
      assert.ok(part.check.answer >= 0 && part.check.answer <= 3, `Day ${day} Part '${part.title}' answer must be in 0..3`);
      assert.ok(part.check.why.length > 20, `Day ${day} Part '${part.title}' explanation must be rigorous`);

      const text = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const w = text.trim().split(/\s+/).filter(Boolean).length;
      totalWords += w;
    }
    assert.ok(totalWords >= 2940, `G3D Day ${day} must have >= 2,940 spoken words (actual: ${totalWords})`);
  }
});

test('G3D Days 21–25: Domain-Specific Content Assertions', () => {
  // Day 21: ⭐ Milestone 4 Capstone: Interactive 3D Avatar Skeletal Animation Engine
  const d21 = getLongLesson('g3d', 21);
  assert.ok(d21.title.includes('Milestone 4 Capstone') || d21.title.includes('Avatar Skeletal Animation'));
  assert.ok(d21.parts[0].output.includes('Total Humanoid Bones: 54'));
  assert.ok(d21.parts[4].output.includes('MILESTONE 4'));

  // Day 22: Facial Rigging: Morph Targets & ARKit Blendshapes (52 Shapes)
  const d22 = getLongLesson('g3d', 22);
  assert.ok(d22.title.includes('Facial Rigging') || d22.title.includes('ARKit'));
  assert.ok(d22.parts[0].output.includes('Linear Additive Invariant'));
  assert.ok(d22.parts[1].output.includes('ARKit Taxonomy Audit'));

  // Day 23: Audio Lip-Sync & Viseme Mapping (Speech-to-Face) & Secondary Motion
  const d23 = getLongLesson('g3d', 23);
  assert.ok(d23.title.includes('Audio Lip-Sync') || d23.title.includes('Viseme Mapping'));
  assert.ok(d23.parts[0].output.includes('Linguistic Invariant'));
  assert.ok(d23.parts[4].output.includes('Speech-to-Face & Secondary Motion Engine Online'));

  // Day 24: 3D Physics: Raycasting, Collisions & Bounding Volumes (AABB / OBB)
  const d24 = getLongLesson('g3d', 24);
  assert.ok(d24.title.includes('3D Physics') || d24.title.includes('Raycasting'));
  assert.ok(d24.parts[0].output.includes('AABB'));
  assert.ok(d24.parts[3].output.includes('Möller-Trumbore Test'));
  assert.ok(d24.parts[4].output.includes('3D Spatial Collision & Raycast Engine Online'));

  // Day 25: Particle Systems & GPU Instanced Rendering
  const d25 = getLongLesson('g3d', 25);
  assert.ok(d25.title.includes('Particle Systems') || d25.title.includes('GPU Instanced'));
  assert.ok(d25.parts[0].output.includes('Hardware Instanced Draw'));
  assert.ok(d25.parts[4].output.includes('100K_GPU_PARTICLE_ENGINE_ACTIVE'));
});

test('G3D Days 26–30 & 🏆 Grand Final Capstone: Resolution, Word Counts & Invariants', () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = getLongLesson('g3d', day);
    assert.ok(lesson, `G3D Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `G3D Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.minutes >= 35, `G3D Day ${day} must be >= 35 minutes`);
    assert.ok(lesson.summary.length >= 4, `G3D Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `G3D Day ${day} must have a hands-on project step`);

    // Total Spoken Words check (>= 2,940 words)
    let totalWords = 0;
    for (const part of lesson.parts) {
      assert.ok(part.code, `Day ${day} Part '${part.title}' must contain code`);
      assert.ok(part.output, `Day ${day} Part '${part.title}' must declare expected output`);
      assert.ok(part.check, `Day ${day} Part '${part.title}' must have Socratic check`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part '${part.title}' MCQ must have 4 options`);
      assert.ok(part.check.answer >= 0 && part.check.answer <= 3, `Day ${day} Part '${part.title}' answer must be in 0..3`);
      assert.ok(part.check.why.length > 20, `Day ${day} Part '${part.title}' explanation must be rigorous`);

      const text = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const w = text.trim().split(/\s+/).filter(Boolean).length;
      totalWords += w;
    }
    assert.ok(totalWords >= 2940, `G3D Day ${day} must have >= 2,940 spoken words (actual: ${totalWords})`);
  }
});

test('G3D Days 26–30: Domain-Specific Content Assertions', () => {
  // Day 26: Level of Detail (LOD) & Occlusion Culling
  const d26 = getLongLesson('g3d', 26);
  assert.ok(d26.title.includes('Level of Detail') || d26.title.includes('Occlusion Culling'));
  assert.ok(d26.parts[0].output.includes('LOD Invariant'));
  assert.ok(d26.parts[2].output.includes('Gribb-Hartmann'));
  assert.ok(d26.parts[4].output.includes('ENTERPRISE_LOD_OCCLUSION_PIPELINE_ACTIVE'));

  // Day 27: WebXR: VR Headsets, AR Spatial Anchors & 6-DoF Tracking
  const d27 = getLongLesson('g3d', 27);
  assert.ok(d27.title.includes('WebXR') || d27.title.includes('6-DoF Tracking'));
  assert.ok(d27.parts[0].output.includes('Motion-To-Photon') || d27.parts[0].output.includes('6-DoF Tracking'));
  assert.ok(d27.parts[1].output.includes('Stereoscopic Invariant'));
  assert.ok(d27.parts[4].output.includes('WEBXR_METAVERSE_ENGINE_CERTIFIED'));

  // Day 28: Screen-Space Ambient Occlusion (SSAO) & Depth Post-Passes
  const d28 = getLongLesson('g3d', 28);
  assert.ok(d28.title.includes('SSAO') || d28.title.includes('Screen-Space Ambient Occlusion'));
  assert.ok(d28.parts[0].output.includes('SSAO Invariant'));
  assert.ok(d28.parts[2].output.includes('Kernel Invariant'));
  assert.ok(d28.parts[4].output.includes('SSAO_DEPTH_PIPELINE_ACTIVE'));

  // Day 29: Procedural 3D Geometry Generation & Perlin Noise Terrains
  const d29 = getLongLesson('g3d', 29);
  assert.ok(d29.title.includes('Procedural 3D Geometry') || d29.title.includes('Perlin Noise'));
  assert.ok(d29.parts[0].output.includes('Perlin Invariant'));
  assert.ok(d29.parts[2].output.includes('Chunk Invariant'));
  assert.ok(d29.parts[4].output.includes('PROCEDURAL_TERRAIN_STREAMING_ACTIVE'));

  // Day 30: 🏆 FINAL CAPSTONE: Enterprise Real-Time 3D Interactive Metaverse Avatar Engine
  const d30 = getLongLesson('g3d', 30);
  assert.ok(d30.title.includes('FINAL CAPSTONE') && d30.title.includes('Metaverse Avatar Engine'));
  assert.ok(d30.parts[0].output.includes('CAPSTONE MASTER ARCHITECTURAL BLUEPRINT'));
  assert.ok(d30.parts[1].output.includes('Tier 1 & 2 Invariant'));
  assert.ok(d30.parts[3].output.includes('Master Frame Pipeline Orchestrator'));
  assert.ok(d30.parts[4].output.includes('5-GATE GRAND MASTER VIVA VOCE DEFENSE MATRIX'));
  assert.ok(d30.parts[4].output.includes('100% COMPLETE'));
});

