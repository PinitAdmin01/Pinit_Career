import assert from 'assert';

// Set up environment for dev auth bypass
process.env.NODE_ENV = 'test';
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';

async function runTests() {
  console.log('=== VERIFYING SUB-BATCH 4.5: Issue 28 - AI Projects Generator Integrity ===\n');

  const { POST, getDomainFallback, LLM_GENERATION_TIMEOUT_MS } = await import('../src/app/api/projects/generate/route');

  // Test 1: LLM timeout is raised to at least 20,000ms (not 3,500ms)
  console.log('Test 1: Verifying LLM timeout threshold...');
  assert.ok(
    typeof LLM_GENERATION_TIMEOUT_MS === 'number' && LLM_GENERATION_TIMEOUT_MS >= 20000,
    `Expected LLM_GENERATION_TIMEOUT_MS >= 20000ms, got ${LLM_GENERATION_TIMEOUT_MS}ms`
  );
  console.log(`✓ Timeout verified: ${LLM_GENERATION_TIMEOUT_MS}ms (raised from 3,500ms)`);

  // Test 2: Unauthenticated request without preview returns 401 UNAUTHORIZED
  console.log('\nTest 2: Verifying unauthenticated request is blocked with 401 UNAUTHORIZED...');
  const unauthReq = new Request('http://localhost:3000/api/projects/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '198.51.100.1'
    },
    body: JSON.stringify({
      goal: 'Full Stack Engineer',
      skills: ['React', 'Node.js']
    })
  });

  const unauthRes = await POST(unauthReq);
  assert.strictEqual(unauthRes.status, 401, `Expected status 401 for unauthenticated request, got ${unauthRes.status}`);
  const unauthJson = await unauthRes.json();
  assert.ok(unauthJson.error === 'UNAUTHORIZED', `Expected error UNAUTHORIZED, got ${unauthJson.error}`);
  console.log('✓ Unauthenticated request blocked from triggering LLM token spend (401 UNAUTHORIZED)');

  // Test 3: Unauthenticated preview request returns 200 with honest blueprint labeling (ZERO LLM spend)
  console.log('\nTest 3: Verifying unauthenticated preview mode returns curated blueprints at zero LLM cost...');
  const previewReq = new Request('http://localhost:3000/api/projects/generate?preview=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '198.51.100.2'
    },
    body: JSON.stringify({
      goal: 'Frontend Engineer',
      skills: ['Vue', 'TypeScript']
    })
  });

  const previewRes = await POST(previewReq);
  assert.strictEqual(previewRes.status, 200, `Expected status 200 for preview mode, got ${previewRes.status}`);
  const previewJson = await previewRes.json();
  assert.strictEqual(previewJson.success, true);
  assert.strictEqual(previewJson.isTemplate, true, 'Preview response must have isTemplate: true');
  assert.strictEqual(previewJson.source, 'curated_template', 'Preview response must have source: curated_template');
  assert.strictEqual(previewJson.authenticated, false, 'Preview response must indicate unauthenticated');
  assert.ok(Array.isArray(previewJson.projects) && previewJson.projects.length === 5, 'Must return 5 curated projects');
  assert.ok(previewJson.projects[0].isTemplate === true, 'Projects must carry isTemplate: true');
  console.log('✓ Unauthenticated preview mode returns curated blueprints with honest isTemplate labeling');

  // Test 4: Dynamic Domain Fallback produces domain-specific projects across all disciplines
  console.log('\nTest 4: Verifying expanded domain fallback diversity and skill injection...');
  
  // 4a: AI & Machine Learning
  const aiProjects = getDomainFallback('AI / Machine Learning Engineer', ['PyTorch', 'LangChain']);
  assert.strictEqual(aiProjects.length, 5);
  assert.ok(aiProjects.some(p => p.name.includes('RAG') || p.name.includes('Neural') || p.name.includes('Agent')), 'Must include AI-specific projects');
  assert.ok(aiProjects[0].techStack.includes('PyTorch'), 'Must dynamically inject candidate PyTorch skill into techStack');
  assert.ok(aiProjects.every(p => p.isTemplate === true), 'All fallback projects must carry isTemplate: true');
  console.log('  ✓ AI/ML domain projects verified with dynamic skill injection');

  // 4b: Mobile Development
  const mobileProjects = getDomainFallback('Mobile Developer (Android / iOS)', ['Flutter', 'Dart']);
  assert.strictEqual(mobileProjects.length, 5);
  assert.ok(mobileProjects.some(p => p.name.includes('Offline') || p.name.includes('GPS') || p.name.includes('BLE')), 'Must include Mobile-specific projects');
  assert.ok(mobileProjects[0].techStack.includes('Flutter'), 'Must dynamically inject candidate Flutter skill into techStack');
  console.log('  ✓ Mobile domain projects verified with dynamic skill injection');

  // 4c: Data Engineering
  const dataProjects = getDomainFallback('Data Engineer (Lakehouse / Streaming)', ['PySpark', 'Kafka']);
  assert.strictEqual(dataProjects.length, 5);
  assert.ok(dataProjects.some(p => p.name.includes('ELT') || p.name.includes('Lakehouse') || p.name.includes('CDC')), 'Must include Data-specific projects');
  assert.ok(dataProjects[0].techStack.includes('PySpark') || dataProjects[1].techStack.includes('PySpark'), 'Must inject PySpark skill');
  console.log('  ✓ Data Engineering domain projects verified');

  // 4d: Cybersecurity
  const cyberProjects = getDomainFallback('Cybersecurity Specialist', ['Go', 'Rust']);
  assert.strictEqual(cyberProjects.length, 5);
  assert.ok(cyberProjects.some(p => p.name.includes('Argon2') || p.name.includes('WAF') || p.name.includes('Intrusion')), 'Must include Cyber-specific projects');
  console.log('  ✓ Cybersecurity domain projects verified');

  // 4e: Cloud & DevOps
  const devopsProjects = getDomainFallback('DevOps & Cloud Architect', ['Terraform', 'Kubernetes']);
  assert.strictEqual(devopsProjects.length, 5);
  assert.ok(devopsProjects.some(p => p.name.includes('Docker') || p.name.includes('Terraform') || p.name.includes('Kubernetes')), 'Must include DevOps-specific projects');
  console.log('  ✓ Cloud/DevOps domain projects verified');

  // Test 5: Server-Sent Events (SSE) Streaming Generation
  console.log('\nTest 5: Verifying Server-Sent Events (SSE) streaming support...');
  const streamReq = new Request('http://localhost:3000/api/projects/generate?preview=true&stream=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'x-forwarded-for': '198.51.100.3'
    },
    body: JSON.stringify({
      goal: 'AI Engineer',
      skills: ['Python', 'FastAPI'],
      stream: true,
      preview: true
    })
  });

  const streamRes = await POST(streamReq);
  assert.strictEqual(streamRes.status, 200);
  const contentType = streamRes.headers.get('content-type') || '';
  assert.ok(contentType.includes('text/event-stream'), `Expected text/event-stream content-type, got ${contentType}`);

  const text = await streamRes.text();
  assert.ok(text.includes('data: {"type":"start"'), 'Stream must emit start event');
  assert.ok(text.includes('data: {"type":"project"'), 'Stream must emit individual project events');
  assert.ok(text.includes('data: {"type":"complete"'), 'Stream must emit complete event');
  assert.ok(text.includes('data: [DONE]'), 'Stream must terminate with data: [DONE]');
  assert.ok(text.includes('"isTemplate":true'), 'Streamed payload must declare isTemplate: true');
  console.log('✓ SSE streaming generation verified with structured event payloads and honest metadata');

  // Test 6: Authenticated request fallback flow
  console.log('\nTest 6: Verifying authenticated user synthesis fallback...');
  // Clear keys so it tests instantaneous fallback path without network latency
  const origOpenRouter = process.env.OPENROUTER_API_KEY;
  const origGroq = process.env.GROQ_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.GROQ_API_KEYS;
  delete process.env.GROQ_API_KEY;

  const authReq = new Request('http://localhost:3000/api/projects/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token-bypass',
      'x-forwarded-for': '198.51.100.4'
    },
    body: JSON.stringify({
      goal: 'Full Stack Engineer',
      skills: ['TypeScript', 'Next.js']
    })
  });

  const authRes = await POST(authReq);
  assert.strictEqual(authRes.status, 200, `Expected 200 for authenticated user, got ${authRes.status}`);
  const authJson = await authRes.json();
  assert.strictEqual(authJson.success, true);
  assert.strictEqual(authJson.isTemplate, true);
  assert.strictEqual(authJson.source, 'curated_template');
  assert.ok(Array.isArray(authJson.projects) && authJson.projects.length === 5);
  console.log('✓ Authenticated request fallback successfully processed');

  // Test 7: Mocked Live LLM synthesis returns isTemplate: false and source: 'llm'
  console.log('\nTest 7: Verifying live LLM synthesis response structure...');
  process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
  const originalFetch = global.fetch;

  const mockLLMProjects = [
    {
      name: 'Custom AI Vector Gateway',
      description: 'Dynamic synthesis project 1',
      techStack: 'Python, Qdrant, FastAPI',
      problem: 'Vector database latency under load',
      deliverable: 'FastAPI gateway service',
      guideSteps: ['Step 1', 'Step 2'],
      tips: ['Tip 1'],
      verificationReqs: ['Req 1'],
      minScore: 85
    },
    {
      name: 'Custom AI Autonomous Agent',
      description: 'Dynamic synthesis project 2',
      techStack: 'Python, LangChain',
      problem: 'Agent hallucination',
      deliverable: 'Autonomous agent coordinator',
      guideSteps: ['Step 1', 'Step 2'],
      tips: ['Tip 1'],
      verificationReqs: ['Req 1'],
      minScore: 85
    },
    {
      name: 'Custom AI Real-Time Fine-Tuner',
      description: 'Dynamic synthesis project 3',
      techStack: 'PyTorch, Ray',
      problem: 'Slow model fine-tuning',
      deliverable: 'Ray fine-tuning orchestrator',
      guideSteps: ['Step 1', 'Step 2'],
      tips: ['Tip 1'],
      verificationReqs: ['Req 1'],
      minScore: 85
    },
    {
      name: 'Custom AI Model Registry',
      description: 'Dynamic synthesis project 4',
      techStack: 'Go, MLflow, Docker',
      problem: 'Unversioned model weights in prod',
      deliverable: 'Model registry service',
      guideSteps: ['Step 1', 'Step 2'],
      tips: ['Tip 1'],
      verificationReqs: ['Req 1'],
      minScore: 85
    },
    {
      name: 'Custom AI Zero-Knowledge Verifier',
      description: 'Dynamic synthesis project 5',
      techStack: 'Rust, WASM',
      problem: 'Unverifiable inference',
      deliverable: 'ZK inference validator',
      guideSteps: ['Step 1', 'Step 2'],
      tips: ['Tip 1'],
      verificationReqs: ['Req 1'],
      minScore: 85
    }
  ];

  global.fetch = async (input: any, init?: any) => {
    if (typeof input === 'string' && input.includes('openrouter.ai')) {
      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify(mockLLMProjects) } }]
        })
      } as any;
    }
    return originalFetch(input, init);
  };

  try {
    const liveReq = new Request('http://localhost:3000/api/projects/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token-bypass',
        'x-forwarded-for': '198.51.100.5'
      },
      body: JSON.stringify({
        goal: 'AI Engineer',
        skills: ['Python', 'FastAPI']
      })
    });

    const liveRes = await POST(liveReq);
    assert.strictEqual(liveRes.status, 200);
    const liveJson = await liveRes.json();
    assert.strictEqual(liveJson.success, true);
    assert.strictEqual(liveJson.isTemplate, false, 'LLM response must declare isTemplate: false');
    assert.strictEqual(liveJson.source, 'llm', 'LLM response must declare source: llm');
    assert.strictEqual(liveJson.projects.length, 5);
    assert.strictEqual(liveJson.projects[0].isTemplate, false);
    assert.strictEqual(liveJson.projects[0].source, 'llm');
    assert.strictEqual(liveJson.projects[0].name, 'Custom AI Vector Gateway');
    console.log('✓ Live LLM synthesis successfully returns honest isTemplate: false and source: llm');
  } finally {
    global.fetch = originalFetch;
    if (origOpenRouter) process.env.OPENROUTER_API_KEY = origOpenRouter;
    if (origGroq) process.env.GROQ_API_KEY = origGroq;
  }

  console.log('\n======================================================');
  console.log('ALL SUB-BATCH 4.5 TESTS PASSED SUCCESSFULLY! (7/7)');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error('\n❌ SUB-BATCH 4.5 VERIFICATION FAILED:', err);
  process.exit(1);
});
