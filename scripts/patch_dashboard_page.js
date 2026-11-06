const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add attendance state and event listener
const targetState = `  const [roleReadiness,        setRoleReadiness]        = useState<DynamicRoleReadiness | null>(null);`;
const additionState = `${targetState}
  const [attendanceRefresh,    setAttendanceRefresh]    = useState<number>(0);

  useEffect(() => {
    const handleAttendanceChange = () => setAttendanceRefresh((v) => v + 1);
    if (typeof window !== 'undefined') {
      window.addEventListener('pinit:attendance_checked_in', handleAttendanceChange);
      return () => window.removeEventListener('pinit:attendance_checked_in', handleAttendanceChange);
    }
  }, []);`;

if (code.includes(targetState) && !code.includes('attendanceRefresh')) {
  code = code.replace(targetState, additionState);
}

// 2. Enhance getContributionsForDate
const oldGetContrib = `  const getContributionsForDate = useCallback((date: Date) => {
    const str = date.toDateString();
    let count = 0;
    const qTs: string[] = (onboardingAnswers as any)?.completedQuestsTimestamps || [];
    const mTs: string[] = (onboardingAnswers as any)?.completedMissionsTimestamps || [];

    // Parse ISO timestamp safely, stripping any "|courseId" suffix so Date is valid
    qTs.forEach(ts => {
      if (!ts) return;
      const iso = ts.includes('|') ? ts.split('|')[0] : ts;
      const d = new Date(iso);
      if (!isNaN(d.getTime()) && d.toDateString() === str) count++;
    });

    mTs.forEach(ts => {
      if (!ts) return;
      const iso = ts.includes('|') ? ts.split('|')[0] : ts;
      const d = new Date(iso);
      if (!isNaN(d.getTime()) && d.toDateString() === str) count++;
    });

    return count;
  }, [onboardingAnswers]);`;

const newGetContrib = `  const getContributionsForDate = useCallback((date: Date) => {
    const str = date.toDateString();
    let count = 0;
    const qTs: string[] = (onboardingAnswers as any)?.completedQuestsTimestamps || [];
    const mTs: string[] = (onboardingAnswers as any)?.completedMissionsTimestamps || [];

    // 1. Parse quest completion timestamps safely
    qTs.forEach(ts => {
      if (!ts) return;
      const iso = ts.includes('|') ? ts.split('|')[0] : ts;
      const d = new Date(iso);
      if (!isNaN(d.getTime()) && d.toDateString() === str) count++;
    });

    // 2. Parse daily missions timestamps safely
    mTs.forEach(ts => {
      if (!ts) return;
      const iso = ts.includes('|') ? ts.split('|')[0] : ts;
      const d = new Date(iso);
      if (!isNaN(d.getTime()) && d.toDateString() === str) count++;
    });

    // 3. Check official campus attendance records for this date
    if (typeof window !== 'undefined' && user?.id) {
      try {
        const raw = localStorage.getItem(\`pinit_attendance_v2_\${user.id}\`);
        if (raw) {
          const parsed = JSON.parse(raw);
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const dy = String(date.getDate()).padStart(2, '0');
          const ymd = \`\${y}-\${m}-\${dy}\`;
          if (Array.isArray(parsed.attended_days) && parsed.attended_days.includes(ymd)) {
            count++;
          }
        }
      } catch {}
    }

    return count;
  }, [onboardingAnswers, user?.id, attendanceRefresh]);`;

if (code.includes(oldGetContrib)) {
  code = code.replace(oldGetContrib, newGetContrib);
}

fs.writeFileSync(path, code, 'utf8');
console.log('src/app/dashboard/page.tsx successfully patched with attendance-aware heatmap logic.');
