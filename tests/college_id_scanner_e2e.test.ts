import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCollegeCardFromText,
  generateCollegePinItId,
  generateMemorableGlobalId,
  isValidPinItId,
} from '../src/lib/utils/pinitIdGenerator';

test('1. Extracts real student credentials from Vinay BGS Management ID Card', () => {
  const rawCardText = `
|| Jai Sri Gurudev ||
BGS INSTITUTE OF MANAGEMENT
Mahalakshmipuram, B'lore-86
Ph:8660468132
www.bimb.info | principalbimb@gmail.com
VINAY N
BCA ADMINOS
Address : #17,14TH,CROSS,RAMA
TEMPLE,KAMMAGONDAHALLI,
JALAHALLI WEST,OPPOSIT TO
ASHOK INTERNATIONAL PUBLIC SCHOOL
Contact : 8618530726
Principal
Valid : 2023-26
  `.trim();

  const result = parseCollegeCardFromText(rawCardText);

  assert.strictEqual(result.collegeCode, 'BGS');
  assert.ok(result.collegeName.includes('BGS INSTITUTE OF MANAGEMENT'));
  assert.strictEqual(result.departmentCode, 'BCA');
  assert.strictEqual(result.studentName.toUpperCase(), 'VINAY N');
  assert.strictEqual(result.rollNumber, '726');

  const pinitId = generateCollegePinItId({
    collegeCode: result.collegeCode,
    departmentCode: result.departmentCode,
    rollNumber: result.rollNumber,
  });

  assert.strictEqual(pinitId, 'PIN-BGS-BCA-726');
  assert.strictEqual(isValidPinItId(pinitId), true);
});

test('2. Extracts student credentials from an Engineering College ID (RVCE)', () => {
  const rawCardText = `
R.V. COLLEGE OF ENGINEERING
Autonomous Institution affiliated to VTU
RAHUL SHARMA
B.TECH COMPUTER SCIENCE & ENGG
USN : 1RV21CS042
Valid : 2021-2025
  `.trim();

  const result = parseCollegeCardFromText(rawCardText);

  assert.strictEqual(result.collegeCode, 'RVCE');
  assert.strictEqual(result.departmentCode, 'CSE');
  assert.strictEqual(result.studentName.toUpperCase(), 'RAHUL SHARMA');
  assert.strictEqual(result.rollNumber, '042');

  const pinitId = generateCollegePinItId({
    collegeCode: result.collegeCode,
    departmentCode: result.departmentCode,
    rollNumber: result.rollNumber,
  });

  assert.strictEqual(pinitId, 'PIN-RVCE-CSE-042');
  assert.strictEqual(isValidPinItId(pinitId), true);
});

test('3. Extracts student credentials from Commerce College ID (SRCC Delhi)', () => {
  const rawCardText = `
SHRI RAM COLLEGE OF COMMERCE
UNIVERSITY OF DELHI
ANANYA GUPTA
B.COM HONOURS
Roll No : 2023BCOM089
  `.trim();

  const result = parseCollegeCardFromText(rawCardText);

  assert.strictEqual(result.collegeCode, 'SRCC');
  assert.strictEqual(result.departmentCode, 'BCOM');
  assert.strictEqual(result.studentName.toUpperCase(), 'ANANYA GUPTA');
  assert.strictEqual(result.rollNumber, '089');

  const pinitId = generateCollegePinItId({
    collegeCode: result.collegeCode,
    departmentCode: result.departmentCode,
    rollNumber: result.rollNumber,
  });

  assert.strictEqual(pinitId, 'PIN-SRCC-BCOM-089');
  assert.strictEqual(isValidPinItId(pinitId), true);
});

test('4. Falls back gracefully on arbitrary non-standard college names', () => {
  const rawCardText = `
VIDYA VARDHAKA POLYTECHNIC
KUMAR S
DIPLOMA CIVIL ENGG
ID: 994
  `.trim();

  const result = parseCollegeCardFromText(rawCardText);
  assert.ok(result.collegeCode.length >= 2);
  assert.strictEqual(result.studentName.toUpperCase(), 'KUMAR S');
  assert.strictEqual(result.rollNumber, '994');
});

test('5. Generates consistent memorable Global PinIT IDs', () => {
  const gid = generateMemorableGlobalId('Vinay Kumar', 'vinay_k');
  assert.match(gid, /^PIN-GLB-VINAY-\d{3,4}$/);
  assert.strictEqual(isValidPinItId(gid), true);
});

test('6. Accurately extracts BCA and Vinay N even with noisy header text and address lines', () => {
  const noisyOcr = `
Jai Sri Gurudev
BGS INSTITUTE OF MANAGEMENT
Mahalakshmipuram, B'lore-86
Ph:8660468132
principalbimb@gmail.com
VINAY N
BCA ADMINOS
Address : #17, 14TH CROSS, RAMA TEMPLE, JALAHALLI
Contact : 8618530726
Valid : 2023-26
  `.trim();

  const result = parseCollegeCardFromText(noisyOcr);
  assert.strictEqual(result.collegeCode, 'BGS');
  assert.strictEqual(result.studentName.toUpperCase(), 'VINAY N');
  assert.strictEqual(result.departmentCode, 'BCA');
  assert.strictEqual(result.rollNumber, '726');
});

test('7. Extracts Sri Vivekananda College of Engineering (Arjun Prasad) from Chrome test badge', () => {
  const chromeImageOcr = `
SRI VIVEKANANDA an
COLLEGE OF ENGINEERING ANd
Autonomous nsttion — ==
Remi | —————
+ Thi ID cardi the property of
-~ Si Vivkananda Coleg of Engineering
i + This cards ron-vansfersl.
: + Student must cary tis 1D card |
b Stall times in the colege campus
| + This cord must be produced on demend |
| bythe sborizodparscrvel
ARJUN PRASAD
Fommteitinans + found, less retin to the
AND ENGINEERING. oaoge fen.
| 22csoss B
At Ho. 2022051045 Q
ONEOFBRTH © 15/08/2004 ar
soooGawP ov orn
VAUO PTO 0/06/2026 oa pe
Pp——
fois]
Se LITTERS
  `.trim();

  const result = parseCollegeCardFromText(chromeImageOcr);

  // College: Sri Vivekananda College of Engineering -> SVCE
  assert.strictEqual(result.collegeCode, 'SVCE');
  // Student Name: Arjun Prasad
  assert.strictEqual(result.studentName, 'Arjun Prasad');
  // Department: Computer Science & Engineering (from 22csoss / CS branch) -> CSE
  assert.strictEqual(result.departmentCode, 'CSE');
  // Roll Number: 045
  assert.strictEqual(result.rollNumber, '045');

  const pinitId = generateCollegePinItId({
    collegeCode: result.collegeCode,
    departmentCode: result.departmentCode,
    rollNumber: result.rollNumber,
  });

  assert.strictEqual(pinitId, 'PIN-SVCE-CSE-045');
  assert.strictEqual(isValidPinItId(pinitId), true);
});

test('8. Never throws TypeError: Cannot read properties of undefined on empty string tokens', () => {
  const weirdSpacing = `
      
   SRI    VIVEKANANDA   
   COLLEGE    OF   ENGINEERING   
   ARJUN PRASAD
   22CS045
  `;

  assert.doesNotThrow(() => {
    const res = parseCollegeCardFromText(weirdSpacing);
    assert.strictEqual(res.collegeCode, 'SVCE');
    assert.strictEqual(res.studentName, 'Arjun Prasad');
  });
});

test('9. Ignores card disclaimers and legal instructions from two-sided card mockups', () => {
  const disclaimerText = `
NATIONAL COLLEGE OF ARTS
This card is the property of the institution.
Student must carry this ID card at all times.
This card must be produced on demand.
RAKESH SHETTY
B.COM HONOURS
Roll No: 2024BC102
  `.trim();

  const result = parseCollegeCardFromText(disclaimerText);
  assert.strictEqual(result.studentName, 'Rakesh Shetty');
  assert.strictEqual(result.departmentCode, 'BCOM');
  assert.strictEqual(result.rollNumber, '102');
});
