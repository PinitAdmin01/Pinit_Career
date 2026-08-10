const fs = require('fs');
const path = 'src/lib/api/client.ts';
let t = fs.readFileSync(path, 'utf8');

if (!t.includes('async function getActorIdentity')) {
  t = t.replace(
    `async function getUid(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if(!user) throw new ApiError(401,'UNAUTHORIZED','Not logged in');
  return user.id;
}`,
    `async function getUid(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if(!user) throw new ApiError(401,'UNAUTHORIZED','Not logged in');
  return user.id;
}

async function getActorIdentity(): Promise<{ name: string; email: string }> {
  try {
    const uid = await getUid();
    const profile = await fs.getUserProfile(uid) as any;
    return {
      name: profile?.displayName || profile?.display_name || profile?.username || 'Student',
      email: profile?.email || '',
    };
  } catch {
    return { name: 'Student', email: '' };
  }
}`
  );
}

const seedReplacements = [
  [
    `if (!borrowed) {
        const initialBorrowed = [
          { id: 'BRW-102', isbn: '978-0262033848', title: 'Introduction to Algorithms', studentName: 'Ashwanth Kumar', studentEmail: 'student@pinit.in', borrowedOn: '2026-07-02T10:00:00Z', dueOn: '2026-07-16T10:00:00Z', returned: false, returnedOn: null }
        ];
        localStorage.setItem('library_borrowed', JSON.stringify(initialBorrowed));
        borrowed = JSON.stringify(initialBorrowed);
      }`,
    `if (!borrowed) {
        localStorage.setItem('library_borrowed', JSON.stringify([]));
        borrowed = '[]';
      }`,
  ],
  [
    `if (!attendance) {
        const initialAttendance = [
          { id: 'ATT-901', studentName: 'Ashwanth Kumar', room: 'A-102', type: 'check-in', timestamp: '2026-07-15T20:30:00Z' }
        ];
        localStorage.setItem('hostel_attendance', JSON.stringify(initialAttendance));
        attendance = JSON.stringify(initialAttendance);
      }`,
    `if (!attendance) {
        localStorage.setItem('hostel_attendance', JSON.stringify([]));
        attendance = '[]';
      }`,
  ],
  [
    `if (!complaints) {
        const initialComplaints = [
          { id: 'CMP-704', category: 'Plumbing', title: 'Water leakage in bathroom pipe', description: 'The pipe near the basin is constantly dripping water.', status: 'Pending', studentName: 'Ashwanth Kumar', timestamp: '2026-07-14T08:00:00Z' }
        ];
        localStorage.setItem('hostel_complaints', JSON.stringify(initialComplaints));
        complaints = JSON.stringify(initialComplaints);
      }`,
    `if (!complaints) {
        localStorage.setItem('hostel_complaints', JSON.stringify([]));
        complaints = '[]';
      }`,
  ],
  [
    `if (!leaves) {
        const initialLeaves = [
          { id: 'LEV-501', studentName: 'Ashwanth Kumar', startDate: '2026-07-20', endDate: '2026-07-22', reason: 'Attending sibling marriage event', type: 'Personal', status: 'Pending' }
        ];
        localStorage.setItem('student_leaves', JSON.stringify(initialLeaves));
        leaves = JSON.stringify(initialLeaves);
      }`,
    `if (!leaves) {
        localStorage.setItem('student_leaves', JSON.stringify([]));
        leaves = '[]';
      }`,
  ],
  [
    `if (!requests) {
        const initialRequests = [
          { id: 'SRV-801', studentName: 'Ashwanth Kumar', category: 'ID Card Replacement', description: 'RFID card chip damaged, not registering at library turnstile', status: 'In Progress' }
        ];
        localStorage.setItem('student_requests', JSON.stringify(initialRequests));
        requests = JSON.stringify(initialRequests);
      }`,
    `if (!requests) {
        localStorage.setItem('student_requests', JSON.stringify([]));
        requests = '[]';
      }`,
  ],
  [
    `if (!appointments) {
        const initialAppointments = [
          { id: 'APT-101', studentName: 'Ashwanth Kumar', staffName: 'Dr. Priya Sharma (CSE Professor)', date: '2026-07-17', time: '11:00 AM', purpose: 'Project thesis proposal review', status: 'Confirmed' }
        ];
        localStorage.setItem('student_appointments', JSON.stringify(initialAppointments));
        appointments = JSON.stringify(initialAppointments);
      }`,
    `if (!appointments) {
        localStorage.setItem('student_appointments', JSON.stringify([]));
        appointments = '[]';
      }`,
  ],
  [
    `if (!counselling) {
        const initialCounselling = [
          { id: 'CNS-201', studentName: 'Ashwanth Kumar', counselorName: 'Dr. Evelyn (Mental Health Advisor)', date: '2026-07-18', time: '02:00 PM', status: 'Scheduled' }
        ];
        localStorage.setItem('student_counselling', JSON.stringify(initialCounselling));
        counselling = JSON.stringify(initialCounselling);
      }`,
    `if (!counselling) {
        localStorage.setItem('student_counselling', JSON.stringify([]));
        counselling = '[]';
      }`,
  ],
  [
    `if (!grievances) {
        const initialGrievances = [
          { id: 'GRV-120', reporterType: 'student', reporterName: 'Ashwanth Kumar', category: 'Hostel Facilities', title: 'Hot water availability issue', description: 'Hot water is not available in Block A showers during early mornings.', anonymous: false, status: 'In Investigation', filedOn: '2026-07-12T09:00:00Z', resolvedOn: null, resolution: null },
          { id: 'GRV-305', reporterType: 'faculty', reporterName: 'Dr. Priya Sharma', category: 'Lab Equipment', title: 'Faulty A/C units in Lab 2', description: 'Lab 2 cooling is failing, causing computer units to overheat.', anonymous: false, status: 'Open', filedOn: '2026-07-15T11:00:00Z', resolvedOn: null, resolution: null },
          { id: 'GRV-509', reporterType: 'student', reporterName: 'Anonymous', category: 'Academic Integrity', title: 'Exam cheating incident report', description: 'Observed standard code sharing during internal quizzes last Friday.', anonymous: true, status: 'Resolved', filedOn: '2026-07-10T14:00:00Z', resolvedOn: '2026-07-11T16:00:00Z', resolution: 'Investigated by committee. Invigilators warned to monitor labs.' }
        ];
        localStorage.setItem('grievances_ledger', JSON.stringify(initialGrievances));
        grievances = JSON.stringify(initialGrievances);
      }`,
    `if (!grievances) {
        localStorage.setItem('grievances_ledger', JSON.stringify([]));
        grievances = '[]';
      }`,
  ],
  [
    `if (!rsvps) {
        const initialRsvps = [
          { eventId: 'EVT-01', studentName: 'Ashwanth Kumar', hasCertificate: false, certificateCode: null },
          { eventId: 'EVT-09', studentName: 'Ashwanth Kumar', hasCertificate: true, certificateCode: 'CERT-NOV-78923' }
        ];
        localStorage.setItem('events_rsvps', JSON.stringify(initialRsvps));
        rsvps = JSON.stringify(initialRsvps);
      }`,
    `if (!rsvps) {
        localStorage.setItem('events_rsvps', JSON.stringify([]));
        rsvps = '[]';
      }`,
  ],
  [
    `if (!papers) {
        const initialPapers = [
          { id: 'PUB-102', title: 'Decentralized Identity Verification on Hedera Consensus Service', authors: 'Ashwanth Kumar, Dr. Priya Sharma', journal: 'IEEE Transactions on Network Security', status: 'Published', date: '2026-04-12', link: 'https://ieee.org/papers/102' },
          { id: 'PUB-205', title: 'Deep Reinforcement Learning for Dynamic Traffic Signals Control', authors: 'Ashwanth Kumar, Prof. R. K. Shastri', journal: 'ACM Transactions on Intelligent Systems', status: 'Accepted', date: '2026-06-25', link: '' },
          { id: 'PUB-308', title: 'Cross-chain Interoperability Bridges: A Comprehensive Vulnerability Survey', authors: 'Ashwanth Kumar', journal: 'Springer Journal of Cryptographic Engineering', status: 'Under Review', date: '2026-07-05', link: '' },
          { id: 'PUB-401', title: 'Optimization of LoRA Adapters for Low-resource Indic Language Translation', authors: 'Ashwanth Kumar', journal: 'EMNLP Indicator Proceedings', status: 'Draft', date: '2026-07-14', link: '' }
        ];
        localStorage.setItem('research_papers', JSON.stringify(initialPapers));
        papers = JSON.stringify(initialPapers);
      }`,
    `if (!papers) {
        localStorage.setItem('research_papers', JSON.stringify([]));
        papers = '[]';
      }`,
  ],
  [
    `if (!projects) {
        const initialProjects = [
          { id: 'PRJ-50', title: 'Indo-UK Cybersecurity Alliance Grant', pi: 'Dr. Priya Sharma', coPi: 'Dr. Vijay Kumar', fundingAgency: 'DST & British Council', grantAmount: 4500000, duration: '3 Years (Active)', progress: 65 },
          { id: 'PRJ-51', title: 'Smart Agriculture IoT Sensing Grid', pi: 'Prof. R. K. Shastri', coPi: 'Ashwanth Kumar', fundingAgency: 'Ministry of Electronics (MeitY)', grantAmount: 2800000, duration: '2 Years (Active)', progress: 40 }
        ];
        localStorage.setItem('research_projects', JSON.stringify(initialProjects));
        projects = JSON.stringify(initialProjects);
      }`,
    `if (!projects) {
        localStorage.setItem('research_projects', JSON.stringify([]));
        projects = '[]';
      }`,
  ],
  [
    `if (!patents) {
        const initialPatents = [
          { id: 'PAT-82', title: 'Cryptographic Hardware Module for Decentralized Trust Scoring', inventors: 'Ashwanth Kumar, Dr. Priya Sharma', status: 'Published / Awaiting Grant', fileNo: 'TEMP-PAT-2026-098234', filedOn: '2026-02-15' },
          { id: 'PAT-83', title: 'Non-Invasive Wearable Biometric Punch Check-in System', inventors: 'Vijay (SysAdmin)', status: 'Filed / Under Audit', fileNo: 'TEMP-PAT-2026-098235', filedOn: '2026-05-10' }
        ];
        localStorage.setItem('research_patents', JSON.stringify(initialPatents));
        patents = JSON.stringify(initialPatents);
      }`,
    `if (!patents) {
        localStorage.setItem('research_patents', JSON.stringify([]));
        patents = '[]';
      }`,
  ],
];

let applied = 0;
for (const [from, to] of seedReplacements) {
  if (t.includes(from)) {
    t = t.replace(from, to);
    applied++;
  } else {
    console.log('SEED MISS:', from.slice(0, 90).replace(/\n/g, ' '));
  }
}
console.log('seeds applied', applied);

const writeBlocks = [
  [
    `if (cleanPath === '/api/library/borrow') {
    if (typeof window !== 'undefined') {
      const { isbn } = safeBody(body);
      let books = JSON.parse(localStorage.getItem('library_books') || '[]');
      let borrowed = JSON.parse(localStorage.getItem('library_borrowed') || '[]');
      
      const bookIdx = books.findIndex((b: any) => b.isbn === isbn);
      if (bookIdx !== -1 && books[bookIdx].available > 0) {
        books[bookIdx].available -= 1;
        const newBorrow = {
          id: 'BRW-' + Math.floor(100 + Math.random() * 900),
          isbn,
          title: books[bookIdx].title,
          studentName: 'Ashwanth Kumar',
          studentEmail: 'student@pinit.in',`,
    `if (cleanPath === '/api/library/borrow') {
    if (typeof window !== 'undefined') {
      const { isbn } = safeBody(body);
      let books = JSON.parse(localStorage.getItem('library_books') || '[]');
      let borrowed = JSON.parse(localStorage.getItem('library_borrowed') || '[]');
      const actor = await getActorIdentity();
      
      const bookIdx = books.findIndex((b: any) => b.isbn === isbn);
      if (bookIdx !== -1 && books[bookIdx].available > 0) {
        books[bookIdx].available -= 1;
        const newBorrow = {
          id: 'BRW-' + Math.floor(100 + Math.random() * 900),
          isbn,
          title: books[bookIdx].title,
          studentName: actor.name,
          studentEmail: actor.email,`,
  ],
  [
    `if (cleanPath === '/api/library/reserve') {
    if (typeof window !== 'undefined') {
      const { isbn } = safeBody(body);
      let books = JSON.parse(localStorage.getItem('library_books') || '[]');
      let reserves = JSON.parse(localStorage.getItem('library_reserves') || '[]');
      
      const book = books.find((b: any) => b.isbn === isbn);
      if (book) {
        const matchingRes = reserves.filter((r: any) => r.isbn === isbn);
        const newReserve = {
          id: 'RSV-' + Math.floor(100 + Math.random() * 900),
          isbn,
          title: book.title,
          studentName: 'Ashwanth Kumar',
          studentEmail: 'student@pinit.in',`,
    `if (cleanPath === '/api/library/reserve') {
    if (typeof window !== 'undefined') {
      const { isbn } = safeBody(body);
      let books = JSON.parse(localStorage.getItem('library_books') || '[]');
      let reserves = JSON.parse(localStorage.getItem('library_reserves') || '[]');
      const actor = await getActorIdentity();
      
      const book = books.find((b: any) => b.isbn === isbn);
      if (book) {
        const matchingRes = reserves.filter((r: any) => r.isbn === isbn);
        const newReserve = {
          id: 'RSV-' + Math.floor(100 + Math.random() * 900),
          isbn,
          title: book.title,
          studentName: actor.name,
          studentEmail: actor.email,`,
  ],
  [
    `if (cleanPath === '/api/hostel/log-attendance') {
    if (typeof window !== 'undefined') {
      const { type, roomCode } = safeBody(body);
      let attendance = JSON.parse(localStorage.getItem('hostel_attendance') || '[]');
      const newLog = {
        id: 'ATT-' + Math.floor(100 + Math.random() * 900),
        studentName: 'Ashwanth Kumar',`,
    `if (cleanPath === '/api/hostel/log-attendance') {
    if (typeof window !== 'undefined') {
      const { type, roomCode } = safeBody(body);
      let attendance = JSON.parse(localStorage.getItem('hostel_attendance') || '[]');
      const actor = await getActorIdentity();
      const newLog = {
        id: 'ATT-' + Math.floor(100 + Math.random() * 900),
        studentName: actor.name,`,
  ],
  [
    `if (cleanPath === '/api/hostel/raise-complaint') {
    if (typeof window !== 'undefined') {
      const { category, title, description } = safeBody(body);
      let complaints = JSON.parse(localStorage.getItem('hostel_complaints') || '[]');
      const newComplaint = {
        id: 'CMP-' + Math.floor(100 + Math.random() * 900),
        category,
        title,
        description,
        status: 'Pending',
        studentName: 'Ashwanth Kumar',`,
    `if (cleanPath === '/api/hostel/raise-complaint') {
    if (typeof window !== 'undefined') {
      const { category, title, description } = safeBody(body);
      let complaints = JSON.parse(localStorage.getItem('hostel_complaints') || '[]');
      const actor = await getActorIdentity();
      const newComplaint = {
        id: 'CMP-' + Math.floor(100 + Math.random() * 900),
        category,
        title,
        description,
        status: 'Pending',
        studentName: actor.name,`,
  ],
  [
    `rooms[roomIdx].residents.push('Ashwanth Kumar');`,
    `const actor = await getActorIdentity();
        rooms[roomIdx].residents.push(actor.name);`,
  ],
  [
    `if (cleanPath === '/api/services/apply-leave') {
    if (typeof window !== 'undefined') {
      const { startDate, endDate, reason, type } = safeBody(body);
      let leaves = JSON.parse(localStorage.getItem('student_leaves') || '[]');
      const newLeave = {
        id: 'LEV-' + Math.floor(500 + Math.random() * 500),
        studentName: 'Ashwanth Kumar',`,
    `if (cleanPath === '/api/services/apply-leave') {
    if (typeof window !== 'undefined') {
      const { startDate, endDate, reason, type } = safeBody(body);
      let leaves = JSON.parse(localStorage.getItem('student_leaves') || '[]');
      const actor = await getActorIdentity();
      const newLeave = {
        id: 'LEV-' + Math.floor(500 + Math.random() * 500),
        studentName: actor.name,`,
  ],
  [
    `if (cleanPath === '/api/services/file-request') {
    if (typeof window !== 'undefined') {
      const { category, description } = safeBody(body);
      let requests = JSON.parse(localStorage.getItem('student_requests') || '[]');
      const newRequest = {
        id: 'SRV-' + Math.floor(800 + Math.random() * 200),
        studentName: 'Ashwanth Kumar',`,
    `if (cleanPath === '/api/services/file-request') {
    if (typeof window !== 'undefined') {
      const { category, description } = safeBody(body);
      let requests = JSON.parse(localStorage.getItem('student_requests') || '[]');
      const actor = await getActorIdentity();
      const newRequest = {
        id: 'SRV-' + Math.floor(800 + Math.random() * 200),
        studentName: actor.name,`,
  ],
  [
    `if (cleanPath === '/api/services/book-appointment') {
    if (typeof window !== 'undefined') {
      const { staffName, date, time, purpose } = safeBody(body);
      let appointments = JSON.parse(localStorage.getItem('student_appointments') || '[]');
      const newAppointment = {
        id: 'APT-' + Math.floor(100 + Math.random() * 900),
        studentName: 'Ashwanth Kumar',`,
    `if (cleanPath === '/api/services/book-appointment') {
    if (typeof window !== 'undefined') {
      const { staffName, date, time, purpose } = safeBody(body);
      let appointments = JSON.parse(localStorage.getItem('student_appointments') || '[]');
      const actor = await getActorIdentity();
      const newAppointment = {
        id: 'APT-' + Math.floor(100 + Math.random() * 900),
        studentName: actor.name,`,
  ],
];

let writes = 0;
for (const [find, replace] of writeBlocks) {
  if (t.includes(find)) {
    t = t.replace(find, replace);
    writes++;
  } else {
    console.log('WRITE MISS:', find.slice(0, 90).replace(/\n/g, ' '));
  }
}
console.log('writes applied', writes);

// Remaining counselling write + any leftover studentName literals
t = t.replace(/studentName: 'Ashwanth Kumar'/g, 'studentName: (await getActorIdentity()).name');
t = t.replace(/authors: authors \|\| 'Ashwanth Kumar'/g, 'authors: authors || (await getActorIdentity()).name');
t = t.replace(
  `{ id: 'STU-01', display_name: 'Ashwanth Kumar', register_number: '1RV22CS045', ats_score: 89, trust_score: 92, career_dna_score: 87, recruiter_visibility: 85 },`,
  `{ id: 'STU-01', display_name: 'Ananya Rao', register_number: '1RV22CS045', ats_score: 89, trust_score: 92, career_dna_score: 87, recruiter_visibility: 85 },`
);

const remaining = (t.match(/Ashwanth Kumar/g) || []).length;
console.log('remaining Ashwanth', remaining);
if (remaining) {
  const lines = t.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('Ashwanth Kumar')) console.log(i + 1, line.trim().slice(0, 120));
  });
}
fs.writeFileSync(path, t);
