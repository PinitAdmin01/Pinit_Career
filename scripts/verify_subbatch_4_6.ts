// scripts/verify_subbatch_4_6.ts
/**
 * Verification Suite for Issue 29:
 * Résumé, Vault, Certificates & Document Verification Integrity
 * 
 * Tests:
 * 1. Native PDF Extraction: extracts actual candidate text; zero leaked browser/PDF metadata.
 * 2. Pure Node.js DOCX Extraction: decompresses PKZip XML paragraphs and text runs.
 * 3. Honest Refusal: unreadable PDF, empty DOCX, and flat images return UNREADABLE_DOCUMENT / IMAGE_OCR_UNAVAILABLE.
 * 4. Vault Upload API Gateway: HTTP 422 UNREADABLE_DOCUMENT when document text < 30 chars.
 * 5. Anti-Fraud Identity Sentinel: Sibling/friend surname match ("Rohan Sharma" vs "Priya Sharma") returns isMatch: false.
 * 6. Legitimate Identity Check: Initial matching ("Rohan Sharma" vs "R. Sharma") returns isMatch: true.
 * 7. GPA / Degree Fact-Check Hardening: "Mozilla/5.0" != "5.0 GPA", "Adobe Systems" != "Adobe" degree.
 */

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';

import zlib from 'zlib';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { extractDocumentEvidence, extractTextFromDocxBuffer } from '../src/lib/ats/pdfTextExtractor';
import { extractTextFromImageBuffer } from '../src/lib/ats/imageOcrWorker';
import { checkNameSimilarity } from '../src/lib/ats/documentAuditEngine';
import { groundAndValidateEvidence } from '../src/lib/ats/factCheckValidator';
import { POST as vaultUploadHandler } from '../src/app/api/vault/upload/route';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

export async function runSubbatch4_6Tests(): Promise<{ passed: number; failed: number }> {
  console.log('\n===============================================================');
  console.log('🧪 VERIFYING ISSUE 29: DOCUMENT EXTRACTION & VERIFICATION INTEGRITY');
  console.log('===============================================================\n');

  // Test 1: Native PDF Extraction (Edge print-to-PDF)
  console.log('Test 1: PDF Extractor on real browser print-to-PDF document...');
  const pdfPath = path.join(os.tmpdir(), 'edge_resume.pdf');
  if (fs.existsSync(pdfPath)) {
    const pdfBuf = fs.readFileSync(pdfPath);
    const pdfRes = extractDocumentEvidence(pdfBuf, 'PDF');
    assert(pdfRes.extractionConfidence >= 0.90, 'PDF extraction confidence >= 0.90');
    assert(pdfRes.rawText.includes('Vinay Kumar'), 'PDF extracted candidate name "Vinay Kumar"');
    assert(pdfRes.rawText.includes('vinay@example.com'), 'PDF extracted candidate email');
    assert(pdfRes.rawText.includes('B.Tech in Computer Science'), 'PDF extracted degree');
    assert(pdfRes.rawText.includes('GPA: 8.8 CGPA'), 'PDF extracted GPA');
    assert(!pdfRes.rawText.includes('Mozilla/5.0'), 'PDF does NOT contain leaked "Mozilla/5.0" browser user-agent');
    assert(!pdfRes.rawText.includes('Skia/PDF'), 'PDF does NOT contain leaked "Skia/PDF" producer metadata');
    assert(!pdfRes.rawText.includes('Adobe'), 'PDF does NOT contain leaked "Adobe" font registry string');
  } else {
    console.warn('  ⚠️ edge_resume.pdf not found in temp, generating synthetic PDF test...');
    // Create minimal valid PDF with text stream
    const streamContent = 'BT /F1 12 Tf 10 10 Td (Rohan Sharma) Tj T* (Software Engineer) Tj T* (GPA: 9.0 CGPA) Tj ET';
    const compStream = zlib.deflateSync(Buffer.from(streamContent));
    const pdfStr = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length ' + compStream.length + ' /Filter /FlateDecode >>\nstream\n' + compStream.toString('binary') + '\nendstream\nendobj\nxref\n0 5\ntrailer\n<< /Root 1 0 R >>\n%%EOF';
    const pdfRes = extractDocumentEvidence(Buffer.from(pdfStr, 'binary'), 'PDF');
    assert(pdfRes.rawText.includes('Rohan Sharma'), 'Synthetic PDF extracted candidate text');
    assert(!pdfRes.rawText.includes('Mozilla/5.0'), 'Synthetic PDF has no user-agent metadata');
  }

  // Test 2: Pure Node.js DOCX Extraction via PKZip & word/document.xml
  console.log('\nTest 2: Pure Node.js DOCX extraction...');
  const xmlContent = Buffer.from(`
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p><w:r><w:t>Aarav Patel</w:t></w:r></w:p>
        <w:p><w:r><w:t>Email: aarav@example.com | Phone: +91 9988776655</w:t></w:r></w:p>
        <w:p><w:r><w:t>Education: Indian Institute of Technology Bombay - B.Tech Computer Science</w:t></w:r></w:p>
        <w:p><w:r><w:t>CGPA: 9.2</w:t></w:r></w:p>
      </w:body>
    </w:document>
  `);
  const compXml = zlib.deflateRawSync(xmlContent);
  const fn = Buffer.from('word/document.xml');
  const localH = Buffer.alloc(30 + fn.length);
  localH.writeUInt32LE(0x04034b50, 0);
  localH.writeUInt16LE(20, 4);
  localH.writeUInt16LE(0, 6);
  localH.writeUInt16LE(8, 8);
  localH.writeUInt32LE(compXml.length, 18);
  localH.writeUInt32LE(xmlContent.length, 22);
  localH.writeUInt16LE(fn.length, 26);
  fn.copy(localH, 30);
  const cdH = Buffer.alloc(46 + fn.length);
  cdH.writeUInt32LE(0x02014b50, 0);
  cdH.writeUInt16LE(20, 4);
  cdH.writeUInt16LE(20, 6);
  cdH.writeUInt16LE(8, 10);
  cdH.writeUInt32LE(compXml.length, 20);
  cdH.writeUInt32LE(xmlContent.length, 24);
  cdH.writeUInt16LE(fn.length, 28);
  cdH.writeUInt32LE(0, 42);
  fn.copy(cdH, 46);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(1, 8);
  eocd.writeUInt16LE(1, 10);
  eocd.writeUInt32LE(cdH.length, 12);
  eocd.writeUInt32LE(localH.length + compXml.length, 16);
  const docxBuf = Buffer.concat([localH, compXml, cdH, eocd]);

  const docxRes = extractTextFromDocxBuffer(docxBuf);
  assert(docxRes.extractionConfidence >= 0.90, 'DOCX extraction confidence >= 0.90');
  assert(docxRes.rawText.includes('Aarav Patel'), 'DOCX extracted candidate name');
  assert(docxRes.rawText.includes('aarav@example.com'), 'DOCX extracted email');
  assert(docxRes.rawText.includes('CGPA: 9.2'), 'DOCX extracted CGPA');

  // Test 3: Honest Refusal on unreadable documents
  console.log('\nTest 3: Honest refusal on unreadable files...');
  const emptyPdfBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< >>\nendobj\nxref\n0 1\ntrailer\n<< >>\n%%EOF');
  const emptyPdfRes = extractDocumentEvidence(emptyPdfBuf, 'PDF');
  assert(emptyPdfRes.extractionConfidence === 0.0, 'Empty PDF returns extractionConfidence: 0.0');
  assert(emptyPdfRes.error?.includes('UNREADABLE_DOCUMENT') === true, 'Empty PDF returns error: UNREADABLE_DOCUMENT');

  const emptyDocxBuf = Buffer.from([0x50, 0x4B, 0x05, 0x06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const emptyDocxRes = extractTextFromDocxBuffer(emptyDocxBuf);
  assert(emptyDocxRes.extractionConfidence === 0.0, 'Empty DOCX returns extractionConfidence: 0.0');
  assert(emptyDocxRes.error?.includes('UNREADABLE_DOCUMENT') === true, 'Empty DOCX returns error: UNREADABLE_DOCUMENT');

  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 1, 0, 0, 0, 1, 0, 8, 2, 0, 0, 0]);
  const imgRes = extractTextFromImageBuffer(pngHeader);
  assert(imgRes.ocrConfidence === 0.0, 'Image OCR returns honest 0.0 confidence (no fake 0.85)');
  assert(imgRes.rawText === '', 'Image OCR returns empty text (no raw binary ASCII scraping)');

  // Test 4: Anti-Fraud Identity Sentinel (Surname vulnerability fix)
  console.log('\nTest 4: Anti-Fraud Identity Sentinel surname vulnerability...');
  const friendResult = checkNameSimilarity('Rohan Sharma', 'Priya Sharma');
  assert(friendResult.isMatch === false, 'Sibling/friend with same surname ("Rohan Sharma" vs "Priya Sharma") returns isMatch: false');
  assert(friendResult.reason?.includes('same surname') === true, 'Reason identifies different individual with same surname');

  const diffResult = checkNameSimilarity('Rohan Sharma', 'Vikram Verma');
  assert(diffResult.isMatch === false, 'Completely different names return isMatch: false');

  const initialResult = checkNameSimilarity('Rohan Sharma', 'R. Sharma');
  assert(initialResult.isMatch === true, 'Initial matching ("Rohan Sharma" vs "R. Sharma") returns isMatch: true');

  const candidatePlaceholder = checkNameSimilarity('Candidate', 'Rohan Sharma');
  assert(candidatePlaceholder.isMatch === false, 'Generic placeholder "Candidate" is rejected (isMatch: false)');

  // Test 5: Fact-Check Entity Grounding False Positive Prevention
  console.log('\nTest 5: Fact-Check Entity Grounding hardening...');
  const fakeMetadataText = 'Resume\nMozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\nSkia/PDF m153\nAdobe Systems Inc.\n';
  const fakeGraph = groundAndValidateEvidence(fakeMetadataText, 'test.pdf', 'fakehash');
  assert(fakeGraph.candidateName === 'Candidate', 'Metadata "Resume" / "Mozilla/5.0" is not accepted as candidate name');
  assert(fakeGraph.scoreOrGpa === undefined, '"Mozilla/5.0" does NOT extract "5.0 GPA"');
  assert(fakeGraph.degree === undefined, '"Adobe Systems" does NOT extract degree "Adobe"');

  const validText = 'Rohan Sharma\nEmail: rohan@example.com\nNational Institute of Technology - B.Tech in Computer Science\nCGPA: 8.8\n';
  const validGraph = groundAndValidateEvidence(validText, 'resume.pdf', 'validhash');
  assert(validGraph.candidateName === 'Rohan Sharma', 'Valid resume extracts candidate name "Rohan Sharma"');
  assert(validGraph.scoreOrGpa === '8.8 GPA', 'Valid resume extracts GPA "8.8 GPA"');
  assert(validGraph.degree?.includes('B.Tech') === true, 'Valid resume extracts degree "B.Tech in Computer Science"');

  // Test 6: Route HTTP 422 Honest Refusal on Vault Upload
  console.log('\nTest 6: Vault Upload route returns 422 on unreadable document...');
  const mockJwt = 'demo-token-bypass';
  const unreadableFormData = new FormData();
  const tinyBlob = new Blob(['%PDF-1.4 empty'], { type: 'application/pdf' });
  unreadableFormData.append('file', tinyBlob, 'corrupt.pdf');

  const req = new Request('http://localhost:3000/api/vault/upload', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${mockJwt}`,
      'x-mock-user-id': 'student_subbatch_test',
      'content-length': '14'
    },
    body: unreadableFormData
  });

  const response = await vaultUploadHandler(req);
  const respJson = await response.json();
  assert(response.status === 422, 'Vault upload returns HTTP 422 for unreadable document');
  assert(respJson.error === 'UNREADABLE_DOCUMENT', 'Vault upload returns error code UNREADABLE_DOCUMENT');

  console.log(`\n===============================================================`);
  console.log(`Subbatch 4_6 Tests Completed: ${passed} passed, ${failed} failed.`);
  console.log(`===============================================================\n`);

  return { passed, failed };
}

if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('verify_subbatch_4_6'))) {
  runSubbatch4_6Tests().then(({ passed, failed }) => {
    if (failed > 0) process.exit(1);
  });
}
