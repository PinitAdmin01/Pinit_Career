'use client';

import StudentAttendanceView from '@/components/student/StudentAttendanceView';

export default function AttendancePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #f8fafc)', padding: '16px 0' }}>
      <StudentAttendanceView />
    </div>
  );
}