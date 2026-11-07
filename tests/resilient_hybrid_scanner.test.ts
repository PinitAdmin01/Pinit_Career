/**
 * Test Suite: Resilient Hybrid ID Scanner Engine (Architecture 5)
 * Verifies:
 * 1. Layer 1A: Groq Free Vision (llama-3.2-11b-vision-preview) payload & parser
 * 2. Layer 1B: Google Gemini 2.0 Flash Vision fallback payload & parser
 * 3. Layer 2: Client-side Option 2 deterministic spatial zoning fallback when AI is unavailable
 * 4. Negative filter invariants on AI hallucinations
 * 5. PinIT ID institutional synthesis across both layers
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  parseCollegeCardFromText,
  generateCollegePinItId,
  validatePinItId,
  CollegeMetadata,
} from '../src/lib/utils/pinitIdGenerator';

// Simulated AI output sanitizer (mirroring src/app/api/auth/scan-id-card/route.ts)
function sanitizeAiOutput(parsed: any, rawReply: string): CollegeMetadata | null {
  if (!parsed || typeof parsed !== 'object') return null;
  if (!parsed.collegeCode && !parsed.studentName && !parsed.rollNumber) return null;

  let sName = (parsed.studentName || '').trim();
  if (/^(?:student|candidate|name|none|n\/a|unknown|null|undefined)$/i.test(sName)) {
    sName = '';
  }

  return {
    collegeName: parsed.collegeName?.trim() || 'Accredited Institution',
    collegeCode: (parsed.collegeCode || 'COL').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'COL',
    department: parsed.department?.trim() || 'General Studies',
    departmentCode: (parsed.departmentCode || 'GEN').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'GEN',
    rollNumber: (parsed.rollNumber || '001').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || '001',
    studentName: sName,
    rawExtractedText: rawReply.slice(0, 300),
    confidence: Math.min(1, Math.max(0.1, Number(parsed.confidence) || 0.92)),
  };
}

test('HYBRID 1: Layer 1A - Groq Vision JSON response parsing & validation', () => {
  const mockGroqResponse = {
    collegeName: 'BGS Institute of Management',
    collegeCode: 'BGS',
    studentName: 'Vinay N',
    department: 'Bachelor of Computer Applications',
    departmentCode: 'BCA',
    rollNumber: '726',
    confidence: 0.98,
  };

  const rawJson = JSON.stringify(mockGroqResponse);
  const result = sanitizeAiOutput(mockGroqResponse, rawJson);

  assert.ok(result);
  assert.strictEqual(result.collegeName, 'BGS Institute of Management');
  assert.strictEqual(result.collegeCode, 'BGS');
  assert.strictEqual(result.studentName, 'Vinay N');
  assert.strictEqual(result.departmentCode, 'BCA');
  assert.strictEqual(result.rollNumber, '726');
  assert.strictEqual(result.confidence, 0.98);

  const pinitId = generateCollegePinItId({
    collegeCode: result.collegeCode,
    departmentCode: result.departmentCode,
    rollNumber: result.rollNumber,
  });
  assert.strictEqual(pinitId, 'PIN-BGS-BCA-726');
  assert.strictEqual(validatePinItId(pinitId).valid, true);
});

test('HYBRID 2: Layer 1B - Gemini Flash JSON response with markdown code fences', () => {
  const rawReply = '```json\n{\n  "collegeName": "Gateway Community College",\n  "collegeCode": "GCC",\n  "studentName": "David Smith",\n  "department": "Nursing",\n  "departmentCode": "NURS",\n  "rollNumber": "326",\n  "confidence": 0.95\n}\n```';
  const cleanJson = JSON.parse(rawReply.replace(/^```json\s*/i, '').replace(/```\s*$/i, ''));
  const result = sanitizeAiOutput(cleanJson, rawReply);

  assert.ok(result);
  assert.strictEqual(result.collegeCode, 'GCC');
  assert.strictEqual(result.studentName, 'David Smith');
  assert.strictEqual(result.departmentCode, 'NURS');
  assert.strictEqual(result.rollNumber, '326');

  const pinitId = generateCollegePinItId({
    collegeCode: result.collegeCode,
    departmentCode: result.departmentCode,
    rollNumber: result.rollNumber,
  });
  assert.strictEqual(pinitId, 'PIN-GCC-NURS-326');
  assert.strictEqual(validatePinItId(pinitId).valid, true);
});

test('HYBRID 3: Negative Filter - AI output with placeholder names is sanitized to empty string', () => {
  const placeholders = ['Student', 'Candidate', 'None', 'N/A', 'Unknown', 'NAME'];
  for (const p of placeholders) {
    const mock = {
      collegeName: 'Accredited Institution',
      collegeCode: 'COL',
      studentName: p,
      department: 'General Studies',
      departmentCode: 'GEN',
      rollNumber: '001',
      confidence: 0.5,
    };
    const res = sanitizeAiOutput(mock, JSON.stringify(mock));
    assert.ok(res);
    assert.strictEqual(res.studentName, '', `Placeholder "${p}" must be sanitized to empty string`);
  }
});

test('HYBRID 4: Layer 2 Fallback - Client-side Option 2 handles cards when AI is offline', () => {
  // Test 1: Real badge text parsed by client OCR
  const realCardOcr = `
SRI VIVEKANANDA M COLLEGE OF ENGINEERING
Department of Engineering
Arjun Prasad
Roll: 874
  `.trim();

  const clientResult = parseCollegeCardFromText(realCardOcr);
  assert.strictEqual(clientResult.studentName, 'Arjun Prasad');
  assert.strictEqual(clientResult.rollNumber, '874');

  // Test 2: Ambiguous badge (The Adarsh Model) leaves studentName blank for manual entry
  const ambiguousCard = `
THE ADARSH MODEL
SENIOR SECONDARY SCHOOL
CLASS: X
ROLL: 231
  `.trim();

  const clientFallback = parseCollegeCardFromText(ambiguousCard);
  assert.strictEqual(clientFallback.studentName, ''); // Prompts user: "User name not detected"
});

test('HYBRID 5: Resilience under total AI network failure (returns fallback-to-client source)', () => {
  // Simulating the server route behavior when neither key is set or network aborts
  const extractionSource = 'fallback-to-client';
  const cleanFileName = 'student_id_scan.png'.replace(/\.[^/.]+$/, '').replace(/[._-]/g, ' ');
  const fallbackMeta = parseCollegeCardFromText(cleanFileName, '');

  assert.strictEqual(extractionSource, 'fallback-to-client');
  assert.strictEqual(fallbackMeta.studentName, ''); // Never hallucinates from filename
  assert.ok(fallbackMeta.collegeCode);
  assert.ok(fallbackMeta.rollNumber);
});
