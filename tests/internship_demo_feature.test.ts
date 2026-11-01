import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET as demoDataHandler } from '../src/app/api/internship/demo-data/route';
import { POST as submitHandler } from '../src/app/api/internship/tasks/[taskId]/submit/route';
import { POST as reportHandler } from '../src/app/api/internship/report/route';
import { POST as certHandler } from '../src/app/api/internship/certificate/route';

test('Internship Demo Feature Suite (Testing & Evaluation Mode)', async (t) => {
  await t.test('1. GET /api/internship/demo-data produces 5 Python AI tasks with NexaCommerce manifests', async () => {
    const req = new NextRequest('http://localhost:3000/api/internship/demo-data?track=python_ai');
    const res = await demoDataHandler(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.track, 'python_ai');
    assert.equal(data.companyProfile.name, 'NexaCommerce Core Systems');
    assert.equal(data.tasks.length, 5);

    // Sequence & lock states
    assert.equal(data.tasks[0].status, 'open');
    assert.equal(data.tasks[1].status, 'locked');
    assert.equal(data.tasks[4].status, 'locked');

    // Milestones details
    for (let i = 0; i < 5; i++) {
      const task = data.tasks[i];
      assert.equal(task.seq, i + 1);
      assert.ok(task.title.length > 5);
      assert.ok(task.starterCode.length > 10);
      assert.ok(task.visibleTests.length > 10);
      assert.ok(task.referenceSolution.length > 10);
    }
  });

  await t.test('2. GET /api/internship/demo-data produces 5 Web Full-Stack tasks with PulseSync manifests', async () => {
    const req = new NextRequest('http://localhost:3000/api/internship/demo-data?track=web_fullstack');
    const res = await demoDataHandler(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.track, 'web_fullstack');
    assert.equal(data.companyProfile.name, 'PulseSync Systems');
    assert.equal(data.tasks.length, 5);
  });

  await t.test('3. POST /api/internship/tasks/[taskId]/submit evaluates demo task submission without DB or auth', async () => {
    // A) Empty code fails
    {
      const req = new NextRequest('http://localhost:3000/api/internship/tasks/demo-python_ai-1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: '   ' }),
      });
      const res = await submitHandler(req, { params: { taskId: 'demo-python_ai-1' } });
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error, 'EMPTY_CODE');
    }

    // B) Faulty code fails tests
    {
      const req = new NextRequest('http://localhost:3000/api/internship/tasks/demo-python_ai-1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'def calculate_subtotal(items):\n    return 0\ndef apply_basic_discount(subtotal, promo_code=None):\n    return 0\n' }),
      });
      const res = await submitHandler(req, { params: { taskId: 'demo-python_ai-1' } });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.ok, true);
      assert.equal(data.passed, false);
    }

    // C) Reference solution passes tests
    {
      const validCode = `from decimal import Decimal, ROUND_HALF_UP

def calculate_subtotal(items):
    total = Decimal('0.00')
    if not items:
        return total
    for item in items:
        price = Decimal(str(item['price']))
        qty = Decimal(str(item['qty']))
        total += price * qty
    return total.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def apply_basic_discount(subtotal, promo_code=None):
    if promo_code and promo_code.strip().upper() == "SAVE10":
        discount = subtotal * Decimal('0.10')
        return discount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    return Decimal('0.00')
`;
      const req = new NextRequest('http://localhost:3000/api/internship/tasks/demo-python_ai-1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: validCode }),
      });
      const res = await submitHandler(req, { params: { taskId: 'demo-python_ai-1' } });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.ok, true);
      assert.equal(data.passed, true);
    }
  });

  await t.test('4. POST /api/internship/report accepts demo stand-up report with valid word count', async () => {
    // Too short (< 100 words)
    {
      const req = new NextRequest('http://localhost:3000/api/internship/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: 'demo-enrollment-id', report: 'Too short report.' }),
      });
      const res = await reportHandler(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error, 'INVALID_REPORT_LENGTH');
    }

    // Valid (145 words)
    {
      const validReport = `In this 14-day engineering simulation for NexaCommerce, I investigated and resolved core checkout defects, implemented high-precision decimal calculations with ROUND_HALF_UP, built an O(N) catalog indexing engine with null guards, sanitized ASCII promotion codes, and unified the entire flow under NexaCommerceCore.process_checkout(). All visible and hidden tests passed with zero regressions. The implementation ensures that float rounding penny discrepancies are eliminated across all orders and volume discounts are capped at one hundred dollars as specified by product leadership. Catalog queries now perform in constant time without iterating full inventory arrays, and legacy promotion strings containing Unicode or punctuation are stripped cleanly before parsing.`;
      const req = new NextRequest('http://localhost:3000/api/internship/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: 'demo-enrollment-id', report: validReport }),
      });
      const res = await reportHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.ok, true);
    }
  });

  await t.test('5. POST /api/internship/certificate issues demo tamper-proof certificate', async () => {
    const req = new NextRequest('http://localhost:3000/api/internship/certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId: 'demo-enrollment-id' }),
    });
    const res = await certHandler(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.ok, true);
    assert.ok(data.certificate.id.startsWith('PINIT-DEMO-CERT-'));
    assert.equal(data.certificate.projectName, 'NexaCommerce Core Systems');
  });
});
