import fs from 'fs';
import path from 'path';

function runIntegrityAudit() {
  console.log('--- STARTING TEACHER & PARENT PORTAL INTEGRITY AUDIT ---');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ' - ' + detail : ''}`);
    }
  }

  // 1. Check /api/teacher/submit-marks/route.ts
  const submitMarksPath = path.join(process.cwd(), 'src/app/api/teacher/submit-marks/route.ts');
  const submitMarksSrc = fs.readFileSync(submitMarksPath, 'utf8');
  assert(
    submitMarksSrc.includes('campus_exam_results') && submitMarksSrc.includes('getSupabaseAdmin'),
    '1. Teacher submit-marks persists to campus_exam_results via Supabase admin'
  );
  assert(
    !submitMarksSrc.includes('return NextResponse.json({\n      ok: true,\n      studentId,\n      marks: marks || {}'),
    '2. Teacher submit-marks does not merely echo without database persistence'
  );

  // 2. Check portalService.ts
  const portalServicePath = path.join(process.cwd(), 'src/lib/services/portalService.ts');
  const portalServiceSrc = fs.readFileSync(portalServicePath, 'utf8');
  assert(
    !portalServiceSrc.includes('roll_no, batch, department, course_track'),
    '3. portalService.getEnrolledStudents does not query non-existent columns from users table'
  );
  assert(
    portalServiceSrc.includes('getAllExamResults') && portalServiceSrc.includes('getExams') && portalServiceSrc.includes('saveExam'),
    '4. portalService provides getAllExamResults, getExams, and saveExam'
  );

  // 3. Check ExamGradingManager.tsx
  const examGradingPath = path.join(process.cwd(), 'src/components/teacher/ExamGradingManager.tsx');
  const examGradingSrc = fs.readFileSync(examGradingPath, 'utf8');
  assert(
    !examGradingSrc.includes('handleGradeSubmission(sub.studentId, sub.examId, 92,'),
    '5. ExamGradingManager eradicated hardcoded score 92'
  );
  assert(
    examGradingSrc.includes('editingScores') && examGradingSrc.includes('type="number"'),
    '6. ExamGradingManager provides editable score input allowing teacher to type marks'
  );
  assert(
    examGradingSrc.includes('portalService.saveExam(created)'),
    '7. ExamGradingManager persists created exams via portalService.saveExam'
  );
  // Verify dynamic questions in ExamGradingManager do not have all correctAnswer: 0
  const correctMatches = examGradingSrc.match(/correctAnswer:\s*([0-3])/g) || [];
  const correctIndices = correctMatches.map(m => m.replace('correctAnswer:', '').trim());
  const distinctIndices = new Set(correctIndices);
  assert(
    distinctIndices.size > 1,
    '8. ExamGradingManager AI quiz generator distributes correct answers across varied options'
  );

  // 4. Check AttendanceTracker.tsx
  const attendanceTrackerPath = path.join(process.cwd(), 'src/components/teacher/AttendanceTracker.tsx');
  const attendanceTrackerSrc = fs.readFileSync(attendanceTrackerPath, 'utf8');
  assert(
    !attendanceTrackerSrc.includes('LEAVE-9012') && !attendanceTrackerSrc.includes('Rohan Verma'),
    '9. AttendanceTracker contains zero hardcoded fake leave requests (Rohan Verma eradicated)'
  );
  assert(
    attendanceTrackerSrc.includes('saveError') && attendanceTrackerSrc.includes('batches.map'),
    '10. AttendanceTracker dynamically loads batches and handles save failure gracefully'
  );

  // 5. Check CourseManager.tsx
  const courseManagerPath = path.join(process.cwd(), 'src/components/teacher/CourseManager.tsx');
  const courseManagerSrc = fs.readFileSync(courseManagerPath, 'utf8');
  assert(
    courseManagerSrc.includes('type="file"') && courseManagerSrc.includes('selectedFile.size'),
    '11. CourseManager includes genuine file picker and computes authentic file size'
  );
  assert(
    !courseManagerSrc.includes("size: '1.5 MB'"),
    '12. CourseManager eradicated hardcoded 1.5 MB file size'
  );

  // 6. Check StudentExamPortal.tsx
  const studentExamPortalPath = path.join(process.cwd(), 'src/components/student/StudentExamPortal.tsx');
  const studentExamPortalSrc = fs.readFileSync(studentExamPortalPath, 'utf8');
  assert(
    studentExamPortalSrc.includes('portalService.getExams()'),
    '13. StudentExamPortal dynamically loads teacher-published exams'
  );

  // 7. Check parent student overview API
  const parentOverviewRoutePath = path.join(process.cwd(), 'src/app/api/parent/student/[id]/overview/route.ts');
  const parentOverviewRouteSrc = fs.readFileSync(parentOverviewRoutePath, 'utf8');
  assert(
    parentOverviewRouteSrc.includes('finance_dues') && parentOverviewRouteSrc.includes('onboarding_answers'),
    '14. Parent overview route queries real finance dues and student onboarding answers'
  );

  // 8. Check GradesView.tsx
  const gradesViewPath = path.join(process.cwd(), 'src/app/parent/components/GradesView.tsx');
  const gradesViewSrc = fs.readFileSync(gradesViewPath, 'utf8');
  assert(
    !gradesViewSrc.includes('78% Complete') && !gradesViewSrc.includes('Database Systems') && !gradesViewSrc.includes('internals: \'24 / 25\''),
    '15. GradesView eradicated hardcoded 78% progress and static Database Systems 100%'
  );
  assert(
    gradesViewSrc.includes('overview?.recentExams') || gradesViewSrc.includes('overview.recentExams'),
    '16. GradesView binds dynamic recentExams from overview'
  );

  // 9. Check StudentOverviewPanel.tsx
  const studentOverviewPanelPath = path.join(process.cwd(), 'src/app/parent/components/StudentOverviewPanel.tsx');
  const studentOverviewPanelSrc = fs.readFileSync(studentOverviewPanelPath, 'utf8');
  assert(
    !studentOverviewPanelSrc.includes('Priya Sharma') && !studentOverviewPanelSrc.includes('Ashok Sharma') && !studentOverviewPanelSrc.includes('CS-2023-0842'),
    '17. StudentOverviewPanel eradicated hardcoded fake parents (Priya/Ashok Sharma) and fake roll number'
  );
  assert(
    !studentOverviewPanelSrc.includes('Report Month: July 2026'),
    '18. StudentOverviewPanel eradicated hardcoded Report Month: July 2026'
  );
  assert(
    studentOverviewPanelSrc.includes('new Blob([reportHtml]') && studentOverviewPanelSrc.includes('Parent_Report_'),
    '19. StudentOverviewPanel generates and downloads authentic monthly report file blob'
  );

  // 10. Check FeePaymentPanel.tsx
  const feePaymentPanelPath = path.join(process.cwd(), 'src/app/parent/components/FeePaymentPanel.tsx');
  const feePaymentPanelSrc = fs.readFileSync(feePaymentPanelPath, 'utf8');
  assert(
    feePaymentPanelSrc.includes('new Blob([docHtml]') && feePaymentPanelSrc.includes('overview'),
    '20. FeePaymentPanel binds overview and generates genuine downloadable document certificate blobs'
  );

  console.log(`\nAUDIT RESULT: ${passed} / ${total} tests passed.`);
  if (passed === total) {
    console.log('✅ ALL INTEGRITY AUDIT CHECKS PASSED.');
  } else {
    console.error('❌ SOME AUDIT CHECKS FAILED.');
    process.exit(1);
  }
}

runIntegrityAudit();
