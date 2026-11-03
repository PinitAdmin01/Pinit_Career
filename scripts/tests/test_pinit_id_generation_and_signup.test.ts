import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateMemorableGlobalId,
  generateCollegePinItId,
  parseCollegeIdCard,
  validatePinItId,
} from '../../src/lib/utils/pinitIdGenerator';

test('Task 7 Verification: Memorable Global PinIT ID Generation', () => {
  // Test 1: Standard Name and Username
  const id1 = generateMemorableGlobalId('Vinay Kashyap', 'vinay@campus.edu');
  assert.match(id1, /^PIN-GLB-[A-Z0-9]{3,8}-[0-9]{3}$/, `Expected valid global ID format, got ${id1}`);
  assert.ok(id1.startsWith('PIN-GLB-VINAY-'), `Expected name slug VINAY, got ${id1}`);

  // Test 2: Single name
  const id2 = generateMemorableGlobalId('Priya');
  assert.match(id2, /^PIN-GLB-PRIYA-[0-9]{3}$/, `Expected PIN-GLB-PRIYA-..., got ${id2}`);

  // Test 3: Empty name fallback
  const id3 = generateMemorableGlobalId('', '');
  assert.match(id3, /^PIN-GLB-STUDENT-[0-9]{3}$/, `Expected fallback slug STUDENT, got ${id3}`);

  // Test 4: Special characters and spaces sanitized
  const id4 = generateMemorableGlobalId('Dr. Alan-Turing Jr.!!');
  assert.match(id4, /^PIN-GLB-DR-[0-9]{3}$/, `Expected sanitized slug DR, got ${id4}`);

  // Test 5: Readability invariant — No lowercase, no whitespace, length bounded
  assert.strictEqual(id1, id1.toUpperCase());
  assert.ok(!id1.includes(' '), 'ID must not contain spaces');
  assert.ok(id1.length <= 22, `Global ID must be easily memorizable (len=${id1.length})`);
});

test('Task 6 & 7 Verification: College PinIT ID Generation & Roll Suffix Logic', () => {
  // Case 1: Standard Indian VTU USN (1RV21CS042 -> 042)
  const id1 = generateCollegePinItId({
    collegeCode: 'RVCE',
    departmentCode: 'CSE',
    rollNumber: '1RV21CS042',
  });
  assert.strictEqual(id1, 'PIN-RVCE-CSE-042', `Expected PIN-RVCE-CSE-042, got ${id1}`);

  // Case 2: IIT Bombay Electrical Engineering (104)
  const id2 = generateCollegePinItId({
    collegeCode: 'IITB',
    departmentCode: 'EE',
    rollNumber: '104',
  });
  assert.strictEqual(id2, 'PIN-IITB-EE-104', `Expected PIN-IITB-EE-104, got ${id2}`);

  // Case 3: PES University AIML (PES120220089 -> 089)
  const id3 = generateCollegePinItId({
    collegeCode: 'PES',
    departmentCode: 'AIML',
    rollNumber: 'PES120220089',
  });
  assert.strictEqual(id3, 'PIN-PES-AIML-089', `Expected PIN-PES-AIML-089, got ${id3}`);

  // Case 4: Missing roll number generates deterministic 3-digit suffix
  const id4 = generateCollegePinItId({
    collegeCode: 'BMS',
    departmentCode: 'MECH',
    rollNumber: '',
  });
  assert.match(id4, /^PIN-BMS-MECH-[0-9]{3}$/, `Expected deterministic roll suffix, got ${id4}`);

  // Case 5: Special characters in college/dept sanitized
  const id5 = generateCollegePinItId({
    collegeCode: 'M.S. Ramaiah (MSRIT)',
    departmentCode: 'AI & ML',
    rollNumber: '025',
  });
  assert.strictEqual(id5, 'PIN-MSRAMA-AIML-025', `Expected sanitized uppercase slugs, got ${id5}`);
});

test('Task 6 Verification: College ID Card Heuristic Parser', async () => {
  // Test File 1: Mock RVCE CSE card
  const mockFile1 = new File(['RV College of Engineering Department of Computer Science 1RV21CS084'], 'rvce_student_id.png', { type: 'image/png' });
  const result1 = await parseCollegeIdCard(mockFile1, 'Vinay');

  assert.strictEqual(result1.collegeCode, 'RVCE');
  assert.strictEqual(result1.departmentCode, 'CSE');
  assert.strictEqual(result1.rollNumber, '1RV21CS084');
  assert.ok(result1.confidence >= 0.8, `Confidence should be high for matching text, got ${result1.confidence}`);

  // Test File 2: PES University AIML card
  const mockFile2 = new File(['PES University AI & ML Department USN: PES120220055'], 'pes_aiml_card.jpg', { type: 'image/jpeg' });
  const result2 = await parseCollegeIdCard(mockFile2, 'Ananya');

  assert.strictEqual(result2.collegeCode, 'PES');
  assert.strictEqual(result2.departmentCode, 'AIML');
  assert.strictEqual(result2.rollNumber, 'PES120220055');

  // Test File 3: IIT Bombay Electrical Engineering card
  const mockFile3 = new File(['IIT Bombay Electrical Engineering Roll: 104'], 'iitb_id.pdf', { type: 'application/pdf' });
  const result3 = await parseCollegeIdCard(mockFile3, 'Karthik');

  assert.strictEqual(result3.collegeCode, 'IITB');
  assert.strictEqual(result3.departmentCode, 'EEE');
  assert.strictEqual(result3.rollNumber, '104');
});

test('Task 7 Verification: PinIT ID Format Validator', () => {
  // Valid Global IDs
  const v1 = validatePinItId('PIN-GLB-VINAY-842');
  assert.strictEqual(v1.valid, true);
  assert.strictEqual(v1.type, 'global');

  // Valid College IDs
  const v2 = validatePinItId('PIN-RVCE-CSE-042');
  assert.strictEqual(v2.valid, true);
  assert.strictEqual(v2.type, 'college');

  const v3 = validatePinItId('PIN-IITB-EE-104');
  assert.strictEqual(v3.valid, true);
  assert.strictEqual(v3.type, 'college');

  // Invalid IDs
  const inv1 = validatePinItId('7f9b8c2a-9e12-4c3d-8b9a-1a2b3c4d5e6f');
  assert.strictEqual(inv1.valid, false);
  assert.strictEqual(inv1.type, 'invalid');

  const inv2 = validatePinItId('usr_random_garbage');
  assert.strictEqual(inv2.valid, false);

  const inv3 = validatePinItId('');
  assert.strictEqual(inv3.valid, false);
});

test('Task 6 & 7 Verification: File Component & Signup Integration Audit', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // 1. Verify CollegeIdScanner exists and contains key UI elements
  const scannerPath = path.resolve(process.cwd(), 'src/components/auth/CollegeIdScanner.tsx');
  assert.ok(fs.existsSync(scannerPath), 'CollegeIdScanner.tsx must exist');
  const scannerSrc = fs.readFileSync(scannerPath, 'utf8');

  assert.ok(scannerSrc.includes('Choose Your PinIT ID Type'), 'Must contain mode selector header');
  assert.ok(scannerSrc.includes('btn-select-college-mode'), 'Must contain College ID selector button');
  assert.ok(scannerSrc.includes('college-id-file-input'), 'Must contain college ID file input');
  assert.ok(scannerSrc.includes('generated-college-pinit-id'), 'Must display live preview of generated college PinIT ID');
  assert.ok(scannerSrc.includes('generated-global-pinit-id'), 'Must display live preview of generated global PinIT ID');

  // 2. Verify SignupPage mounts CollegeIdScanner and passes registerNumber
  const signupPath = path.resolve(process.cwd(), 'src/app/signup/page.tsx');
  const signupSrc = fs.readFileSync(signupPath, 'utf8');
  assert.ok(signupSrc.includes('<CollegeIdScanner'), 'SignupPage must render CollegeIdScanner');
  assert.ok(signupSrc.includes('registerNumber: pinitId'), 'SignupPage must pass pinitId as registerNumber');
  assert.ok(signupSrc.includes('pinitId: pinitId'), 'SignupPage must pass pinitId in signup payload');

  // 3. Verify AuthContext persists readable PinIT ID
  const authPath = path.resolve(process.cwd(), 'src/lib/context/AuthContext.tsx');
  const authSrc = fs.readFileSync(authPath, 'utf8');
  assert.ok(authSrc.includes('generateMemorableGlobalId'), 'AuthContext must import generateMemorableGlobalId');
  assert.ok(authSrc.includes('pinit_id:        resolvedId'), 'AuthContext must persist resolvedId as pinit_id');
});
