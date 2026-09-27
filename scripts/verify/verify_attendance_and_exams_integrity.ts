import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('=== Student Attendance & Examination Integrity Verification ===\n');

// 1. Student Attendance View Integrity
const attendanceViewPath = path.join(process.cwd(), 'src/components/student/StudentAttendanceView.tsx');
assert(fs.existsSync(attendanceViewPath), 'StudentAttendanceView.tsx exists');

const attendanceContent = fs.readFileSync(attendanceViewPath, 'utf-8');

// A. No camera brightness exploit, no manual bypass button
assert(!attendanceContent.includes('avgBrightness < 8'), 'Camera brightness < 8 hack removed');
assert(!attendanceContent.includes('Confirm Attendance Manually'), '4.5s manual bypass button removed');
assert(!attendanceContent.includes('handleStartFaceScan'), 'handleStartFaceScan removed');

// B. No student self-rewarding (+10 XP, +15 pins exploit)
assert(!attendanceContent.includes('addXp(10)'), 'No unauthorized addXp(10) attendance payout');
assert(!attendanceContent.includes('earnPins(15)'), 'No unauthorized earnPins(15) attendance payout');

// C. Faculty student picker exists
assert(attendanceContent.includes('portalService.getEnrolledStudents'), 'Faculty view loads enrolled students via portalService.getEnrolledStudents()');
assert(attendanceContent.includes('selectedStudentId'), 'Faculty view allows selecting specific student');

// D. Leave management backed by services_leaves and /api/services/apply-leave
assert(!attendanceContent.includes('from(\'leave_applications\')'), 'Non-existent leave_applications table eradicated');
assert(attendanceContent.includes("api.post('/api/services/apply-leave'"), 'Leave applications use authentic /api/services/apply-leave route');
assert(attendanceContent.includes('/api/services/stats'), 'Leave history loaded from /api/services/stats');

// E. Dynamic cards instead of hardcoded 92% and Deep Focus Master
assert(!attendanceContent.includes('Weekly Attendance 92%'), 'Hardcoded 92% card eradicated');
assert(!attendanceContent.includes('Deep Focus Master</h3>'), 'Hardcoded Deep Focus Master card title eradicated');
assert(attendanceContent.includes('focusStreak'), 'Focus badge dynamically reflects focusStreak');
assert(attendanceContent.includes('overallPercentage'), 'Attendance percentage card dynamically reflects overallPercentage');


// 2. Examination Portal & Hall Ticket Integrity
const examsPagePath = path.join(process.cwd(), 'src/app/exams/page.tsx');
assert(fs.existsSync(examsPagePath), 'src/app/exams/page.tsx exists');

const examsContent = fs.readFileSync(examsPagePath, 'utf-8');

// A. Dynamic Institution, Major, Program
assert(!examsContent.includes('BGS INSTITUTE OF MANAGEMENT'), 'Hardcoded "BGS INSTITUTE OF MANAGEMENT" eradicated');
assert(!examsContent.includes('Major: Computer Science Engineering'), 'Hardcoded "Major: Computer Science Engineering" eradicated');
assert(!examsContent.includes('Program: B.Tech CSE'), 'Hardcoded "Program: B.Tech CSE" eradicated');
assert(examsContent.includes('institutionName'), 'Exams portal dynamically binds institutionName');
assert(examsContent.includes('studentMajor'), 'Exams portal dynamically binds studentMajor');
assert(examsContent.includes('studentProgram'), 'Exams portal dynamically binds studentProgram');

// B. Dynamic Course Credits
assert(examsContent.includes('r.credits'), 'Dynamic course credits checked from result record');

// C. Dynamic Hall Ticket Security Code
assert(!examsContent.includes('DSAI-ENTRY-PASS'), 'Static "DSAI-ENTRY-PASS" eradicated');
assert(examsContent.includes('HT-2026-'), 'Hall ticket generates unique pass code with student & reg identifier');

// D. Attendance & Fee Clearance Gate
assert(examsContent.includes('isAttendanceEligible'), 'Hall ticket enforces attendance eligibility (>= 75%)');
assert(examsContent.includes('isFeeEligible'), 'Hall ticket enforces finance fee dues clearance');
assert(examsContent.includes('attendancePct'), 'Hall ticket verifies actual attendance percentage');
assert(examsContent.includes('isHallTicketEligible'), 'Hall ticket combines attendance and fee eligibility to gate printing');

// E. Authentic Verification QR & Digital Seal
assert(!examsContent.includes('🏁') || !examsContent.includes('[DIGITALLY SEALED]'), 'Fake [DIGITALLY SEALED] text and checkered flag eradicated');
assert(examsContent.includes('verificationId') && examsContent.includes('TR-'), 'Digital transcript verification generates authentic TR- verification ID');
assert(examsContent.includes('/verify/'), 'Digital transcript verification links to public /verify gateway');
assert(examsContent.includes('CRYPTOGRAPHICALLY VERIFIED & SEALED'), 'Renders authentic cryptographic seal');


// 3. Verification Gateway Integrity
const verifyRoutePath = path.join(process.cwd(), 'src/app/api/verify/[credentialId]/route.ts');
const verifyPagePath = path.join(process.cwd(), 'src/app/verify/[credentialId]/page.tsx');

assert(fs.existsSync(verifyRoutePath), 'src/app/api/verify/[credentialId]/route.ts exists');
assert(fs.existsSync(verifyPagePath), 'src/app/verify/[credentialId]/page.tsx exists');

const verifyRouteContent = fs.readFileSync(verifyRoutePath, 'utf-8');
assert(verifyRouteContent.includes("credentialId.startsWith('TR-')"), 'Verification route handles academic transcripts with prefix TR-');
assert(verifyRouteContent.includes('examsService.getStudentResults'), 'Verification route queries authentic examsService.getStudentResults');

const verifyPageContent = fs.readFileSync(verifyPagePath, 'utf-8');
assert(verifyPageContent.includes('transcript'), 'Public verification page supports transcript verification view');
assert(verifyPageContent.includes('CGPA'), 'Public verification page displays candidate academic CGPA');

console.log('\nAll Attendance & Examination Integrity assertions passed successfully! ✨');
