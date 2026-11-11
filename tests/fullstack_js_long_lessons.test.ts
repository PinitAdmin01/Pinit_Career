import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import crypto from 'node:crypto';
import esbuild from 'esbuild';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';

test('Full-Stack JavaScript Long Lessons: Resolution & Language Invariants', () => {
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');

  for (let day = 1; day <= 30; day++) {
    const lesson = getLongLesson('fullstack-js', day);
    assert.ok(lesson, `fullstack-js Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `fullstack-js Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `fullstack-js Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `fullstack-js Day ${day} must have a hands-on project step`);
  }
});

test('Full-Stack JS Day 6: Schema Validation & Runtime Boundary Safety: Zod, Type Coercion & Input Sanitization', async () => {
  const lesson = getLongLesson('fullstack-js', 6);
  assert.ok(lesson, 'fullstack-js Day 6 long lesson must resolve');
  assert.equal(lesson.day, 6);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 6 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 6 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 6 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      String,
      Boolean,
      TypeError,
      Error,
      parseInt,
      URL: global.URL
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('handleUnsafeSignup'));
  assert.ok(lesson.parts[1].code?.includes('SimpleUserSchema'));
  assert.ok(lesson.parts[2].code?.includes('StrictProfileValidator'));
  assert.ok(lesson.parts[3].code?.includes('formatValidationErrorResponse'));
  assert.ok(lesson.parts[4].code?.includes('validateRequestBody'));
});

test('Full-Stack JS Day 7: CORS Architecture & Web Security Headers: Same-Origin Policy, Preflights & Defense-in-Depth', async () => {
  const lesson = getLongLesson('fullstack-js', 7);
  assert.ok(lesson, 'fullstack-js Day 7 long lesson must resolve');
  assert.equal(lesson.day, 7);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 7 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 7 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 7 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      String,
      Boolean,
      TypeError,
      Error,
      parseInt,
      URL: global.URL
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('parseOrigin'));
  assert.ok(lesson.parts[1].code?.includes('requiresCorsPreflight'));
  assert.ok(lesson.parts[2].code?.includes('CorsPolicyManager'));
  assert.ok(lesson.parts[3].code?.includes('securityHeadersMiddleware'));
  assert.ok(lesson.parts[4].code?.includes('corsMiddleware'));
});

test('Full-Stack JS Day 8: REST Query Architecture: Pagination Physics, Cursor Streams & Multi-Field Sorting', async () => {
  const lesson = getLongLesson('fullstack-js', 8);
  assert.ok(lesson, 'fullstack-js Day 8 long lesson must resolve');
  assert.equal(lesson.day, 8);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 8 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 8 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 8 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      String,
      Boolean,
      TypeError,
      Error,
      parseInt,
      URL: global.URL
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('parseCollectionQueryParams'));
  assert.ok(lesson.parts[1].code?.includes('offsetPagination'));
  assert.ok(lesson.parts[2].code?.includes('SortParameterParser'));
  assert.ok(lesson.parts[3].code?.includes('SafeParameterizedQueryBuilder'));
  assert.ok(lesson.parts[4].code?.includes('paginateCollection'));
});

test('Full-Stack JS Day 9: Authentication Architecture: Stateless JWTs, Cryptographic Signatures & Token Lifecycle', async () => {
  const lesson = getLongLesson('fullstack-js', 9);
  assert.ok(lesson, 'fullstack-js Day 9 long lesson must resolve');
  assert.equal(lesson.day, 9);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 9 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 9 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 9 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      String,
      Boolean,
      TypeError,
      Error,
      parseInt,
      URL: global.URL
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 80));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('base64UrlEncode'));
  assert.ok(lesson.parts[1].code?.includes('computeSimulatedSignature'));
  assert.ok(lesson.parts[2].code?.includes('validateRegisteredClaims'));
  assert.ok(lesson.parts[3].code?.includes('isJwtExpiredWithLeeway'));
  assert.ok(lesson.parts[4].code?.includes('verifyEnterpriseJwt'));
});

test('Full-Stack JS Day 10: Session Security & Token Transport: Secure HttpOnly Cookies, SameSite Policies & Refresh Token Rotation', async () => {
  const lesson = getLongLesson('fullstack-js', 10);
  assert.ok(lesson, 'fullstack-js Day 10 long lesson must resolve');
  assert.equal(lesson.day, 10);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 10 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 10 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 10 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      String,
      Boolean,
      TypeError,
      Error,
      parseInt,
      URL: global.URL
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 100));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('InMemoryTokenStore'));
  assert.ok(lesson.parts[1].code?.includes('buildSecureCookieHeader'));
  assert.ok(lesson.parts[2].code?.includes('evaluateCookieInclusion'));
  assert.ok(lesson.parts[3].code?.includes('RefreshTokenManager'));
  assert.ok(lesson.parts[4].code?.includes('parseCookieHeader'));
});
test('Full-Stack JS Day 11: Password Hashing with Argon2/Bcrypt & Salt Invariants', async () => {
  const lesson = getLongLesson('fullstack-js', 11);
  assert.ok(lesson, 'fullstack-js Day 11 long lesson must resolve');
  assert.equal(lesson.day, 11);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 11 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 11 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 11 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      Uint32Array,
      parseInt
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 100));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('SaltDefenseEngine'));
  assert.ok(lesson.parts[1].code?.includes('BcryptArchitectureEngine'));
  assert.ok(lesson.parts[2].code?.includes('Argon2idSimulationEngine'));
  assert.ok(lesson.parts[3].code?.includes('ConstantTimeComparisonEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterprisePasswordLifecycleEngine'));
});

test('Full-Stack JS Day 12: Prisma ORM, Schema Migrations & Relational Modeling', async () => {
  const lesson = getLongLesson('fullstack-js', 12);
  assert.ok(lesson, 'fullstack-js Day 12 long lesson must resolve');
  assert.equal(lesson.day, 12);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 12 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 12 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 12 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 100));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('PrismaSchemaEngine'));
  assert.ok(lesson.parts[1].code?.includes('PrismaMigrationEngine'));
  assert.ok(lesson.parts[2].code?.includes('PrismaQueryCompilerEngine'));
  assert.ok(lesson.parts[3].code?.includes('PrismaTransactionEngine'));
  assert.ok(lesson.parts[4].code?.includes('ServerlessConnectionPoolEngine'));
});

test('Full-Stack JS Day 13: The N+1 Query Problem & DataLoader Batching', async () => {
  const lesson = getLongLesson('fullstack-js', 13);
  assert.ok(lesson, 'fullstack-js Day 13 long lesson must resolve');
  assert.equal(lesson.day, 13);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 13 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 13 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 13 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 100));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('NPlusOneDegradationEngine'));
  assert.ok(lesson.parts[1].code?.includes('MicrotaskDataLoader'));
  assert.ok(lesson.parts[2].code?.includes('RequestScopedDataLoaderManager'));
  assert.ok(lesson.parts[3].code?.includes('OneToManyBatchingEngine'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseDataLoaderOrchestratorEngine'));
});

test('Full-Stack JS Day 14: Redis In-Memory Caching & Cache-Aside Invalidation', async () => {
  const lesson = getLongLesson('fullstack-js', 14);
  assert.ok(lesson, 'fullstack-js Day 14 long lesson must resolve');
  assert.equal(lesson.day, 14);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 14 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 14 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 14 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('InVirtualRedisEngine'));
  assert.ok(lesson.parts[1].code?.includes('CacheAsideService'));
  assert.ok(lesson.parts[2].code?.includes('StampedeProtectedCache'));
  assert.ok(lesson.parts[3].code?.includes('VirtualRedisServer'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseCacheManager'));
});

test('Full-Stack JS Day 15 ⭐ Milestone 3 Capstone: Enterprise Multi-Tenant Authentication & Session Hub', async () => {
  const lesson = getLongLesson('fullstack-js', 15);
  assert.ok(lesson, 'fullstack-js Day 15 long lesson must resolve');
  assert.equal(lesson.day, 15);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 15 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 15 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 15 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('TenantResolutionEngine'));
  assert.ok(lesson.parts[1].code?.includes('CryptographicAuthHub'));
  assert.ok(lesson.parts[2].code?.includes('DistributedSessionHub'));
  assert.ok(lesson.parts[3].code?.includes('MultiTenantPermissionLoader'));
  assert.ok(lesson.parts[4].code?.includes('EndToEndAuthCapstoneSuite'));
});

test('Full-Stack JS Day 16: GraphQL APIs, Resolvers & Query Complexity Cost Analysis', async () => {
  const lesson = getLongLesson('fullstack-js', 16);
  assert.ok(lesson, 'fullstack-js Day 16 long lesson must resolve');
  assert.equal(lesson.day, 16);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 16 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 16 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 16 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('VirtualGraphQLSchemaRegistry'));
  assert.ok(lesson.parts[1].code?.includes('VirtualGraphQLExecutor'));
  assert.ok(lesson.parts[2].code?.includes('GraphQLSecurityAnalyzer'));
  assert.ok(lesson.parts[3].code?.includes('DirectiveSchemaDecorator'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseGraphQLGateway'));
});

test('Full-Stack JS Day 17: End-to-End Type Safety with tRPC & Zod Invariants', async () => {
  const lesson = getLongLesson('fullstack-js', 17);
  assert.ok(lesson, 'fullstack-js Day 17 long lesson must resolve');
  assert.equal(lesson.day, 17);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 17 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 17 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 17 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('VirtualTrpcRouter'));
  assert.ok(lesson.parts[1].code?.includes('ProcedureBuilder'));
  assert.ok(lesson.parts[2].code?.includes('VirtualZodType'));
  assert.ok(lesson.parts[3].code?.includes('TrpcHttpBatchLinkEngine'));
  assert.ok(lesson.parts[4].code?.includes('SuperJsonSerializer'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseTrpcRouter'));
});

test('Full-Stack JS Day 18: Real-Time Bidirectional Streaming with WebSockets & Server-Sent Events', async () => {
  const lesson = getLongLesson('fullstack-js', 18);
  assert.ok(lesson, 'fullstack-js Day 18 long lesson must resolve');
  assert.equal(lesson.day, 18);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 18 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 18 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 18 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('RealtimeProtocolAnalyzer'));
  assert.ok(lesson.parts[1].code?.includes('WebSocketHandshakeSimulator'));
  assert.ok(lesson.parts[2].code?.includes('WebSocketHeartbeatManager'));
  assert.ok(lesson.parts[3].code?.includes('DistributedPubSubCluster'));
  assert.ok(lesson.parts[4].code?.includes('BackpressureManagedSocket'));
});

test('Full-Stack JS Day 19: Message Queues & Background Job Processing with BullMQ, Redis & Dead-Letter Queues', async () => {
  const lesson = getLongLesson('fullstack-js', 19);
  assert.ok(lesson, 'fullstack-js Day 19 long lesson must resolve');
  assert.equal(lesson.day, 19);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 19 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 19 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 19 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('DistributedJobQueueEngine'));
  assert.ok(lesson.parts[1].code?.includes('SandboxedWorkerPoolSimulator'));
  assert.ok(lesson.parts[2].code?.includes('RetryAndDeadLetterEngine'));
  assert.ok(lesson.parts[3].code?.includes('PriorityRateLimitedQueueCoordinator'));
  assert.ok(lesson.parts[4].code?.includes('IdempotentWorkflowEngine'));
});

test('Full-Stack JS Day 20 ⭐ Milestone 4 Capstone: Real-Time Event-Driven Collaboration & Background Processing Engine', async () => {
  const lesson = getLongLesson('fullstack-js', 20);
  assert.ok(lesson, 'fullstack-js Day 20 long lesson must resolve');
  assert.equal(lesson.day, 20);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 20 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 20 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 20 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 5, `Part ${i + 1} must have at least 5 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
    assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
    assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
    assert.ok(check.why && check.why.length > 20, `Part ${i + 1} check must have a detailed explanation`);

    // Deterministic execution verification
    let stdout = '';
    const sandbox = {
      console: {
        log: (...args: any[]) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        }
      },
      setTimeout,
      Promise,
      Date,
      Map,
      Set,
      Array,
      JSON,
      Math,
      Number,
      isNaN,
      Object,
      Buffer,
      process,
      crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    await new Promise(r => setTimeout(r, 150));
    assert.equal(stdout.trim(), part.output.trim(), `Part ${i + 1} stdout mismatch`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('HybridGatewayDispatcher'));
  assert.ok(lesson.parts[1].code?.includes('CrdtMultiplayerSyncEngine'));
  assert.ok(lesson.parts[2].code?.includes('DistributedMultiTenantPubSubMesh'));
  assert.ok(lesson.parts[3].code?.includes('OffloadJobDagPipeline'));
  assert.ok(lesson.parts[4].code?.includes('EnterpriseResilienceTelemetryHub'));
});

test('Full-Stack JS Day 21: Next.js Route Handlers, Web Streams & Edge Streaming Architecture', async () => {
  const lesson = getLongLesson('fullstack-js', 21);
  assert.ok(lesson, 'fullstack-js Day 21 long lesson must resolve');
  assert.equal(lesson.day, 21);
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 21 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 21 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 21 must have projectStep');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0);
    assert.ok(part.say.length >= 5);
    assert.ok(part.example && part.example.length > 0);
    assert.ok(part.code && part.code.includes('console.log('));
    assert.ok(part.output && part.output.length > 0);
    assert.ok(part.tryIt && part.tryIt.length > 0);

    const check = part.check as any;
    assert.ok(check.question.length > 10);
    assert.ok(check.options.length >= 4);
    assert.ok(check.answer >= 0 && check.answer < check.options.length);
    assert.ok(check.why.length > 15);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n').replace(/timestamp":\d+/g, 'timestamp":0');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n').replace(/timestamp":\d*/g, 'timestamp":0');
    assert.equal(normActual, normExpected, `Day 21 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('WebStreamChunkTransformer'));
  assert.ok(lesson.parts[1].code?.includes('NdjsonStreamingProtocolEngine'));
  assert.ok(lesson.parts[2].code?.includes('BackpressuredStreamPipeline'));
  assert.ok(lesson.parts[3].code?.includes('SseProtocolEngine'));
  assert.ok(lesson.parts[4].code?.includes('StreamingGatewayEngine'));
});

test('Full-Stack JS Day 22: Distributed Microservices, gRPC & Protocol Buffers (Protobuf)', async () => {
  const lesson = getLongLesson('fullstack-js', 22);
  assert.ok(lesson, 'fullstack-js Day 22 long lesson must resolve');
  assert.equal(lesson.day, 22);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n');
    assert.equal(normActual, normExpected, `Day 22 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('ProtobufBinaryEncoder'));
  assert.ok(lesson.parts[1].code?.includes('GrpcHttp2MultiplexedTransport'));
  assert.ok(lesson.parts[2].code?.includes('GrpcDeadlineManager'));
  assert.ok(lesson.parts[3].code?.includes('GrpcBidirectionalSyncEngine'));
  assert.ok(lesson.parts[4].code?.includes('GrpcJsonTranscodingEngine'));
});

test('Full-Stack JS Day 23: Event-Driven Architecture with Apache Kafka & Distributed Log Streaming', async () => {
  const lesson = getLongLesson('fullstack-js', 23);
  assert.ok(lesson, 'fullstack-js Day 23 long lesson must resolve');
  assert.equal(lesson.day, 23);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n');
    assert.equal(normActual, normExpected, `Day 23 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('KafkaPartitionCommitLog'));
  assert.ok(lesson.parts[1].code?.includes('KafkaPartitionHasher'));
  assert.ok(lesson.parts[2].code?.includes('ConsumerGroupCoordinator'));
  assert.ok(lesson.parts[3].code?.includes('IdempotentProducerTransactionalMesh'));
  assert.ok(lesson.parts[4].code?.includes('SchemaRegistryValidator'));
});

test('Full-Stack JS Day 24: Docker Containerization, Multi-Stage Production Builds & Alpine Security', async () => {
  const lesson = getLongLesson('fullstack-js', 24);
  assert.ok(lesson, 'fullstack-js Day 24 long lesson must resolve');
  assert.equal(lesson.day, 24);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n');
    assert.equal(normActual, normExpected, `Day 24 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('DockerLayerCacheEngine'));
  assert.ok(lesson.parts[1].code?.includes('NextjsMultiStageBuilder'));
  assert.ok(lesson.parts[2].code?.includes('ContainerSecurityAuditor'));
  assert.ok(lesson.parts[3].code?.includes('ContainerHealthProbeManager'));
  assert.ok(lesson.parts[4].code?.includes('DockerComposeOrchestrator'));
});

test('Full-Stack JS Day 25: ⭐ Milestone 5 Capstone: Distributed Event-Driven Cloud Microservices Architecture', async () => {
  const lesson = getLongLesson('fullstack-js', 25);
  assert.ok(lesson, 'fullstack-js Day 25 long lesson must resolve');
  assert.equal(lesson.day, 25);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = stdout.trim().replace(/\r\n/g, '\n').replace(/PID=\d+/g, 'PID=0');
    const normExpected = part.output.trim().replace(/\r\n/g, '\n').replace(/PID=\d*/g, 'PID=0');
    assert.equal(normActual, normExpected, `Day 25 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('EdgeGrpcGatewayBridge'));
  assert.ok(lesson.parts[1].code?.includes('GrpcServiceContractEnforcer'));
  assert.ok(lesson.parts[2].code?.includes('KafkaEventFabricManager'));
  assert.ok(lesson.parts[3].code?.includes('ContainerWorkerSupervisor'));
  assert.ok(lesson.parts[4].code?.includes('Milestone5CapstoneCertificationMatrix'));
});

function normalizeDayOutput(str: string): string {
  return str.trim()
    .replace(/\r\n/g, '\n')
    .replace(/timestamp":\d+/g, 'timestamp":0')
    .replace(/PID=\d+/g, 'PID=0')
    .replace(/ASIA-TEMP-[A-Z0-9]+/g, 'ASIA-TEMP-000000000000')
    .replace(/sha256:[a-f0-9]{20}/g, 'sha256:6eeb0bf41d6f1bf249f3')
    .replace(/00-[a-f0-9]{32}-[a-f0-9]{16}-01/g, '00-00000000000000000000000000000000-1111111111111111-01')
    .replace(/"traceId":"[a-f0-9]{8}\.\.\."/g, '"traceId":"00000000..."')
    .replace(/"spanId":"[a-f0-9]{6}\.\.\."/g, '"spanId":"00000000..."')
    .replace(/ID: lock-[a-f0-9]{8}\.\.\./g, 'ID: lock-00000000...')
    .replace(/Lock lock-[a-f0-9]{8}\.\.\./g, 'Lock lock-00000000...')
    .replace(/#+/g, '#####');
}

test('Full-Stack JS Day 26: Kubernetes Microservices Orchestration, Helm Charts, ConfigMaps & Secrets', async () => {
  const lesson = getLongLesson('fullstack-js', 26);
  assert.ok(lesson, 'fullstack-js Day 26 long lesson must resolve');
  assert.equal(lesson.day, 26);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = normalizeDayOutput(stdout);
    const normExpected = normalizeDayOutput(part.output);
    assert.equal(normActual, normExpected, `Day 26 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('KubernetesClusterSimulator'));
  assert.ok(lesson.parts[1].code?.includes('RollingDeploymentController'));
  assert.ok(lesson.parts[2].code?.includes('KubernetesNetworkMesh'));
  assert.ok(lesson.parts[3].code?.includes('KubernetesVolumeReloader'));
  assert.ok(lesson.parts[4].code?.includes('HelmReleaseManager'));
});

test('Full-Stack JS Day 27: CI/CD Pipelines with GitHub Actions, Semantic Versioning & Multi-Arch Docker Builds', async () => {
  const lesson = getLongLesson('fullstack-js', 27);
  assert.ok(lesson, 'fullstack-js Day 27 long lesson must resolve');
  assert.equal(lesson.day, 27);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = normalizeDayOutput(stdout);
    const normExpected = normalizeDayOutput(part.output);
    assert.equal(normActual, normExpected, `Day 27 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('PipelineDagEngine'));
  assert.ok(lesson.parts[1].code?.includes('GitHubActionsScheduler'));
  assert.ok(lesson.parts[2].code?.includes('CiSecurityAndCacheEngine'));
  assert.ok(lesson.parts[3].code?.includes('ContainerBuildAndSecurityPipeline'));
  assert.ok(lesson.parts[4].code?.includes('AutomatedReleaseAndCanaryEngine'));
});

test('Full-Stack JS Day 28: Cloud Observability, OpenTelemetry (OTel), Prometheus Metrics & Distributed Tracing', async () => {
  const lesson = getLongLesson('fullstack-js', 28);
  assert.ok(lesson, 'fullstack-js Day 28 long lesson must resolve');
  assert.equal(lesson.day, 28);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = normalizeDayOutput(stdout);
    const normExpected = normalizeDayOutput(part.output);
    assert.equal(normActual, normExpected, `Day 28 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('ObservabilityTelemetryHub'));
  assert.ok(lesson.parts[1].code?.includes('OpenTelemetryTraceEngine'));
  assert.ok(lesson.parts[2].code?.includes('PrometheusRegistry'));
  assert.ok(lesson.parts[3].code?.includes('TraceWaterfallVisualizer'));
  assert.ok(lesson.parts[4].code?.includes('SreReliabilityCalculator'));
});

test('Full-Stack JS Day 29: Cloud Infrastructure as Code (IaC) with Terraform, Cloudflare CDN & Edge Security', async () => {
  const lesson = getLongLesson('fullstack-js', 29);
  assert.ok(lesson, 'fullstack-js Day 29 long lesson must resolve');
  assert.equal(lesson.day, 29);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = normalizeDayOutput(stdout);
    const normExpected = normalizeDayOutput(part.output);
    assert.equal(normActual, normExpected, `Day 29 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('TerraformDagEngine'));
  assert.ok(lesson.parts[1].code?.includes('TerraformStateBackend'));
  assert.ok(lesson.parts[2].code?.includes('TerraformModuleEngine'));
  assert.ok(lesson.parts[3].code?.includes('CloudflareEdgeCdnPoP'));
  assert.ok(lesson.parts[4].code?.includes('CloudflareEdgeWafAndTunnel'));
});

test('Full-Stack JS Day 30: ⭐ Milestone 6 Capstone: Enterprise Cloud-Native Production Platform & Grand Master Certification', async () => {
  const lesson = getLongLesson('fullstack-js', 30);
  assert.ok(lesson, 'fullstack-js Day 30 long lesson must resolve');
  assert.equal(lesson.day, 30);
  assert.equal(lesson.parts.length, 5);
  assert.ok(lesson.summary.length >= 4);
  assert.ok(lesson.projectStep);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 35 && totalMin <= 40, `Total minutes should be between 35 and 40 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.check.options.length >= 4);

    let stdout = '';
    const sandbox = {
      console: { log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; } },
      setTimeout, Promise, Date, Map, Set, Array, JSON, Math, Number, isNaN, Object, Buffer, process, crypto
    };
    vm.createContext(sandbox);
    const compiled = esbuild.transformSync(part.code, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox);
    const normActual = normalizeDayOutput(stdout);
    const normExpected = normalizeDayOutput(part.output);
    assert.equal(normActual, normExpected, `Day 30 Part ${i + 1} stdout mismatch`);
  }

  assert.ok(lesson.parts[0].code?.includes('CapstoneEdgeIngressGateway'));
  assert.ok(lesson.parts[1].code?.includes('CapstoneKubernetesMesh'));
  assert.ok(lesson.parts[2].code?.includes('CapstoneEventFabricSupervisor'));
  assert.ok(lesson.parts[3].code?.includes('CapstoneTelemetryHub'));
  assert.ok(lesson.parts[4].code?.includes('FullStackMasterCertificationMatrix'));
});

