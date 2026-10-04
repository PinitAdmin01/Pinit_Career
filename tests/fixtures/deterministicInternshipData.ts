import type { ProductBrief, UserStory } from '../../src/lib/internships/productBrief';
import type { Tier2TaskItem } from '../../src/lib/internships/tier2Tasks';

/**
 * Deterministic product briefs for offline testing and fast unit verification.
 */
export function getDeterministicProductBrief(
  seed: string,
  isSolo: boolean = false
): ProductBrief {
  const domains = [
    {
      productName: 'ClinicFlow Appointment Backend',
      summary:
        'A high-performance simulated backend service for clinical appointment management, patient record routing, and doctor schedule conflict prevention. Designed for Python + PostgreSQL REST services.',
      dataModel: [
        {
          table: 'patients',
          columns: ['id UUID PRIMARY KEY', 'full_name TEXT NOT NULL', 'email TEXT UNIQUE', 'created_at TIMESTAMPTZ'],
        },
        {
          table: 'doctors',
          columns: ['id UUID PRIMARY KEY', 'name TEXT NOT NULL', 'specialization TEXT', 'active BOOLEAN'],
        },
        {
          table: 'appointments',
          columns: ['id UUID PRIMARY KEY', 'patient_id UUID REFERENCES patients(id)', 'doctor_id UUID REFERENCES doctors(id)', 'slot_time TIMESTAMPTZ', 'status TEXT'],
        },
        {
          table: 'consultation_notes',
          columns: ['id UUID PRIMARY KEY', 'appointment_id UUID REFERENCES appointments(id)', 'diagnosis TEXT', 'prescriptions JSONB'],
        },
      ],
      stories: [
        { id: 'US-01', title: 'Register new patient with duplicate email validation', acceptance: ['Validate email RFC compliance', 'Return 409 Conflict if email exists', 'Persist record'] },
        { id: 'US-02', title: 'List doctors by specialty and availability', acceptance: ['Filter by specialization', 'Order by seniority', 'Exclude inactive doctors'] },
        { id: 'US-03', title: 'Book appointment slot with race condition prevention', acceptance: ['Atomic transaction lock on doctor slot', 'Reject overlapping times', 'Return booking confirmation'] },
        { id: 'US-04', title: 'Cancel appointment with audit logging', acceptance: ['Update status to cancelled', 'Record cancellation reason', 'Release slot for rebooking'] },
        { id: 'US-05', title: 'Fetch daily appointment schedule for a clinic doctor', acceptance: ['Sort chronologically', 'Include patient name and contact', 'Omit cancelled slots'] },
        { id: 'US-06', title: 'Attach clinical consultation notes to appointment', acceptance: ['Authorize attending doctor', 'Store structured diagnosis', 'Append prescriptions'] },
        { id: 'US-07', title: 'Calculate doctor patient throughput analytics', acceptance: ['Aggregate count by month', 'Calculate average consultation duration', 'Return summary metrics'] },
        { id: 'US-08', title: 'Export patient medical history timeline', acceptance: ['Chronological list of all visits', 'Include prescription summary', 'Mask sensitive patient identifiers'] },
        { id: 'US-09', title: 'Automated appointment reminder dispatch queue', acceptance: ['Query appointments 24h away', 'Generate notification payload', 'Track notification status'] },
        { id: 'US-10', title: 'Doctor leave and unavailabilty blackout periods', acceptance: ['Block calendar date ranges', 'Prevent bookings during blackout', 'Notify affected patients'] },
        { id: 'US-11', title: 'Emergency priority triage booking', acceptance: ['Bypass standard queue', 'Flag appointment as urgent', 'Assign next on-duty physician'] },
        { id: 'US-12', title: 'Prescription inventory cross-reference validation', acceptance: ['Verify medication name against formulary', 'Warn on dosage thresholds', 'Store validation status'] },
        { id: 'US-13', title: 'Clinic revenue and billing ledger generator', acceptance: ['Sum completed visit fees', 'Calculate specialty breakdown', 'Output monthly balance'] },
        { id: 'US-14', title: 'Patient feedback and satisfaction ratings', acceptance: ['Accept 1-5 star ratings', 'Store optional text feedback', 'Compute rolling average'] },
      ],
    },
  ];

  const brief = domains[0];
  const storyCount = isSolo ? 7 : 14;
  return {
    ...brief,
    stories: brief.stories.slice(0, storyCount),
  };
}

/**
 * 8 high-quality deterministic seed tasks (1 Python + 1 SQL per week for 4 weeks)
 * for testing and test verification.
 */
export function getDeterministicTier2Tasks(stories: UserStory[]): Tier2TaskItem[] {
  const getStoryId = (idx: number) => (stories[idx % stories.length]?.id || `US-0${idx + 1}`);

  return [
    // ── Week 1 ─────────────────────────────────────────────────────────────
    {
      seq: 1,
      week: 1,
      kind: 'data_validation',
      language: 'python',
      storyId: getStoryId(0),
      model: 'seed-task',
      task: {
        title: 'Validate and Clean Patient Intake Records',
        brief: 'Implement `validate_patient_record(payload)` which validates patient email and age, returning cleaned dict or raising ValueError.',
        starter_code: `def validate_patient_record(payload):\n    # TODO: Validate email has @ and age >= 0\n    return {}\n`,
        visible_tests: `assert validate_patient_record({'name': 'John Doe', 'email': 'john@test.com', 'age': 30}) == {'name': 'John Doe', 'email': 'john@test.com', 'age': 30}\nassert validate_patient_record({'name': 'Alice', 'email': 'alice@domain.org', 'age': 25})['age'] == 25\n`,
        hidden_tests: `assert validate_patient_record({'name': 'Baby', 'email': 'b@med.com', 'age': 0}) == {'name': 'Baby', 'email': 'b@med.com', 'age': 0}\ntry:\n    validate_patient_record({'name': 'Bad', 'email': 'no-at', 'age': 20})\n    assert False, 'Should raise ValueError'\nexcept ValueError:\n    pass\ntry:\n    validate_patient_record({'name': 'BadAge', 'email': 'ok@med.com', 'age': -5})\n    assert False, 'Should raise ValueError on negative age'\nexcept ValueError:\n    pass\n`,
        reference_solution: `def validate_patient_record(payload):\n    if '@' not in str(payload.get('email', '')):\n        raise ValueError('Invalid email')\n    age = int(payload.get('age', -1))\n    if age < 0:\n        raise ValueError('Age cannot be negative')\n    return {\n        'name': str(payload.get('name', '')).strip(),\n        'email': str(payload.get('email', '')).strip(),\n        'age': age,\n    }\n`,
        skills: ['Data Parsing and Validation', 'Exception Handling and Error States'],
        sql_setup: null,
      },
    },
    {
      seq: 2,
      week: 1,
      kind: 'query_filter',
      language: 'sql',
      storyId: getStoryId(1),
      model: 'seed-task',
      task: {
        title: 'Filter Active Patient Database Records',
        brief: 'Write a SQL query against the `patients` table to select active patients over age 18 ordered by name.',
        starter_code: `SELECT id, name, email, age FROM patients WHERE false;`,
        visible_tests: `SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Alice Johnson','Bob Smith'] AS ok, 'Returns the two active adult patients' AS msg;`,
        hidden_tests: `SELECT (SELECT array_agg(email ORDER BY email) FROM answer) = ARRAY['alice@test.com','bob@test.com'] AS ok, 'Emails match active adult patients' AS msg;\nSELECT (SELECT array_agg(age ORDER BY age) FROM answer) = ARRAY[28, 45] AS ok, 'Ages match active adult patients' AS msg;`,
        reference_solution: `SELECT id, name, email, age FROM patients WHERE active = true AND age >= 18 ORDER BY name ASC;`,
        skills: ['SELECT with WHERE and ORDER BY'],
        sql_setup: `CREATE TABLE patients (id INT PRIMARY KEY, name TEXT, email TEXT, age INT, active BOOLEAN);\nINSERT INTO patients VALUES (1, 'Diana Prince', 'diana@test.com', 32, false), (2, 'Charlie Brown', 'charlie@test.com', 12, true), (3, 'Alice Johnson', 'alice@test.com', 28, true), (4, 'Bob Smith', 'bob@test.com', 45, true);`,
      },
    },

    // ── Week 2 ─────────────────────────────────────────────────────────────
    {
      seq: 3,
      week: 2,
      kind: 'slot_manager',
      language: 'python',
      storyId: getStoryId(2),
      model: 'seed-task',
      task: {
        title: 'Doctor Appointment Slot Conflict Resolver',
        brief: 'Implement `check_slot_available(booked_slots, requested_slot)` to prevent overlapping time appointments.',
        starter_code: `def check_slot_available(booked_slots, requested_slot):\n    # Return False on collision\n    return True\n`,
        visible_tests: `assert check_slot_available(['09:00', '10:00'], '11:00') is True\nassert check_slot_available(['09:00', '10:00'], '09:00') is False\n`,
        hidden_tests: `assert check_slot_available([], '09:00') is True\nassert check_slot_available(['14:00', '15:00', '16:00'], '15:00') is False\nassert check_slot_available(['14:00', '15:00', '16:00'], '17:00') is True\n`,
        reference_solution: `def check_slot_available(booked_slots, requested_slot):\n    return requested_slot not in set(booked_slots)\n`,
        skills: ['Dictionary Hash Mapping', 'Algorithm Efficiency (O(N))'],
        sql_setup: null,
      },
    },
    {
      seq: 4,
      week: 2,
      kind: 'multi_table_join',
      language: 'sql',
      storyId: getStoryId(3),
      model: 'seed-task',
      task: {
        title: 'Join Doctors with Completed Appointment Totals',
        brief: 'Write a SQL query joining `doctors` and `appointments` to calculate completed appointment count per doctor.',
        starter_code: `SELECT d.name, COUNT(a.id) AS total FROM doctors d JOIN appointments a ON d.id = a.doctor_id WHERE false GROUP BY d.name;`,
        visible_tests: `SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Dr. Evans','Dr. Harris'] AS ok, 'Returns doctors with appointments' AS msg;`,
        hidden_tests: `SELECT (SELECT total FROM answer WHERE name = 'Dr. Evans') = 2 AS ok, 'Dr. Evans has 2 completed appointments' AS msg;\nSELECT (SELECT total FROM answer WHERE name = 'Dr. Harris') = 1 AS ok, 'Dr. Harris has 1 completed appointment' AS msg;\nSELECT (SELECT array_agg(total ORDER BY total) FROM answer) = ARRAY[1::bigint, 2::bigint] AS ok, 'Total completed appointment counts match' AS msg;`,
        reference_solution: `SELECT d.name, COUNT(a.id) AS total FROM doctors d JOIN appointments a ON d.id = a.doctor_id WHERE a.status = 'completed' GROUP BY d.name ORDER BY total DESC, d.name ASC;`,
        skills: ['Multi-table INNER and LEFT JOINs', 'GROUP BY and Aggregate Functions (COUNT, SUM, AVG)'],
        sql_setup: `CREATE TABLE doctors (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE appointments (id INT PRIMARY KEY, doctor_id INT, status TEXT);\nINSERT INTO doctors VALUES (1, 'Dr. Harris'), (2, 'Dr. Evans');\nINSERT INTO appointments VALUES (1, 1, 'completed'), (2, 2, 'completed'), (3, 2, 'completed'), (4, 1, 'cancelled');`,
      },
    },

    // ── Week 3 ─────────────────────────────────────────────────────────────
    {
      seq: 5,
      week: 3,
      kind: 'priority_triage',
      language: 'python',
      storyId: getStoryId(4),
      model: 'seed-task',
      task: {
        title: 'Emergency Patient Priority Triage Queue',
        brief: 'Implement `sort_triage_queue(patients)` that sorts patients by emergency triage urgency (1=highest, 5=lowest).',
        starter_code: `def sort_triage_queue(patients):\n    return patients\n`,
        visible_tests: `pts = [{'name': 'A', 'urgency': 3}, {'name': 'B', 'urgency': 1}]\nassert [p['name'] for p in sort_triage_queue(pts)] == ['B', 'A']\n`,
        hidden_tests: `pts = [{'name': 'A', 'urgency': 4}, {'name': 'B', 'urgency': 1}, {'name': 'C', 'urgency': 2}]\nassert [p['name'] for p in sort_triage_queue(pts)] == ['B', 'C', 'A']\nassert sort_triage_queue([]) == []\nassert len(sort_triage_queue([{'name': 'X', 'urgency': 1}])) == 1\n`,
        reference_solution: `def sort_triage_queue(patients):\n    return sorted(patients, key=lambda p: (p.get('urgency', 99), p.get('name', '')))\n`,
        skills: ['Stack and Queue Operations', 'List Filtering and Transformations'],
        sql_setup: null,
      },
    },
    {
      seq: 6,
      week: 3,
      kind: 'subquery_filter',
      language: 'sql',
      storyId: getStoryId(5),
      model: 'seed-task',
      task: {
        title: 'Locate Patients with Urgent Care Flag Subquery',
        brief: 'Write a SQL query using a subquery to find patients who have had at least one appointment with urgency <= 2.',
        starter_code: `SELECT id, name FROM patients WHERE false;`,
        visible_tests: `SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['David'] AS ok, 'Finds urgent patient David' AS msg;`,
        hidden_tests: `SELECT (SELECT array_agg(id ORDER BY id) FROM answer) = ARRAY[2] AS ok, 'Patient ID is 2' AS msg;\nSELECT (SELECT count(*) FROM answer WHERE name = 'Emma') = 0 AS ok, 'Non-urgent patient Emma is excluded' AS msg;`,
        reference_solution: `SELECT id, name FROM patients WHERE id IN (SELECT patient_id FROM appointments WHERE urgency <= 2) ORDER BY name ASC;`,
        skills: ['Subqueries and EXISTS Filtering'],
        sql_setup: `CREATE TABLE patients (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE appointments (id INT PRIMARY KEY, patient_id INT, urgency INT);\nINSERT INTO patients VALUES (1, 'Emma'), (2, 'David');\nINSERT INTO appointments VALUES (10, 1, 4), (11, 2, 1);`,
      },
    },

    // ── Week 4 ─────────────────────────────────────────────────────────────
    {
      seq: 7,
      week: 4,
      kind: 'ledger_audit',
      language: 'python',
      storyId: getStoryId(6),
      model: 'seed-task',
      task: {
        title: 'Clinic Revenue Ledger and Fee Reconciliation',
        brief: 'Implement `calculate_revenue(ledger_items)` calculating net revenue after discounts, discarding negative or corrupted fee entries.',
        starter_code: `def calculate_revenue(ledger_items):\n    return 0.0\n`,
        visible_tests: `assert calculate_revenue([{'fee': 100, 'discount': 10}, {'fee': 50, 'discount': 0}]) == 140.0\nassert calculate_revenue([]) == 0.0\n`,
        hidden_tests: `assert calculate_revenue([{'fee': 200, 'discount': 50}]) == 150.0\nassert calculate_revenue([{'fee': -50, 'discount': 0}, {'fee': 100, 'discount': 0}]) == 100.0\nassert calculate_revenue([{'fee': 80, 'discount': 100}]) == 0.0\n`,
        reference_solution: `def calculate_revenue(ledger_items):\n    total = 0.0\n    for item in ledger_items:\n        fee = float(item.get('fee', 0))\n        discount = float(item.get('discount', 0))\n        if fee > 0:\n            net = max(0.0, fee - discount)\n            total += net\n    return round(total, 2)\n`,
        skills: ['Algorithm Efficiency (O(N))', 'Data Parsing and Validation'],
        sql_setup: null,
      },
    },
    {
      seq: 8,
      week: 4,
      kind: 'revenue_report',
      language: 'sql',
      storyId: getStoryId(7),
      model: 'seed-task',
      task: {
        title: 'Generate Monthly Department Revenue Ledger',
        brief: 'Write a SQL query aggregating total revenue and average fee by department for settled transactions.',
        starter_code: `SELECT dept, SUM(amount) AS total_rev, AVG(amount) AS avg_rev FROM transactions WHERE false GROUP BY dept;`,
        visible_tests: `SELECT (SELECT array_agg(dept ORDER BY dept) FROM answer) = ARRAY['Cardiology','Pediatrics'] AS ok, 'Aggregates settled departments Cardiology and Pediatrics' AS msg;`,
        hidden_tests: `SELECT (SELECT total_rev FROM answer WHERE dept = 'Cardiology') = 450 AS ok, 'Cardiology settled total is 450' AS msg;\nSELECT (SELECT total_rev FROM answer WHERE dept = 'Pediatrics') = 200 AS ok, 'Pediatrics settled total is 200' AS msg;\nSELECT (SELECT count(*) FROM answer WHERE dept = 'Neurology') = 0 AS ok, 'Unsettled department excluded' AS msg;`,
        reference_solution: `SELECT dept, SUM(amount) AS total_rev, AVG(amount) AS avg_rev FROM transactions WHERE settled = true GROUP BY dept ORDER BY total_rev DESC, dept ASC;`,
        skills: ['GROUP BY and Aggregate Functions (COUNT, SUM, AVG)'],
        sql_setup: `CREATE TABLE transactions (id INT PRIMARY KEY, dept TEXT, amount INT, settled BOOLEAN);\nINSERT INTO transactions VALUES (1, 'Neurology', 100, false), (2, 'Cardiology', 300, true), (3, 'Cardiology', 150, true), (4, 'Pediatrics', 200, true), (5, 'Pediatrics', 100, false);`,
      },
    },
  ];
}

/**
 * Deterministic full-stack web product brief (React + Node.js + PostgreSQL).
 */
export function getDeterministicWebProductBrief(
  seed: string,
  isSolo: boolean = false
): ProductBrief {
  const brief = {
    productName: 'DevPulse Operations Portal',
    summary:
      'A production-grade simulated full-stack operations and incident monitoring portal for cloud-native web teams. Features a responsive React frontend, a Node.js & TypeScript REST backend service, and a PostgreSQL relational database. Built for collaborative sprint delivery and training.',
    dataModel: [
      {
        table: 'services',
        columns: ['id UUID PRIMARY KEY', 'name TEXT NOT NULL', 'latency INT', 'active BOOLEAN', 'created_at TIMESTAMPTZ'],
      },
      {
        table: 'incidents',
        columns: ['id UUID PRIMARY KEY', 'service_id UUID REFERENCES services(id)', 'title TEXT NOT NULL', 'severity TEXT', 'status TEXT', 'created_at TIMESTAMPTZ'],
      },
      {
        table: 'team_members',
        columns: ['id UUID PRIMARY KEY', 'name TEXT NOT NULL', 'email TEXT UNIQUE', 'role TEXT', 'active BOOLEAN'],
      },
      {
        table: 'incident_updates',
        columns: ['id UUID PRIMARY KEY', 'incident_id UUID REFERENCES incidents(id)', 'author_id UUID REFERENCES team_members(id)', 'message TEXT', 'posted_at TIMESTAMPTZ'],
      },
    ],
    stories: [
      { id: 'US-01', title: 'Build ServiceStatusCard React component with status badge and latency indicator', acceptance: ['Render service name and latency in ms', 'Apply status-healthy or status-down CSS class', 'Render within service-card container'] },
      { id: 'US-02', title: 'Query active monitored services with low latency in PostgreSQL', acceptance: ['Filter active = true and latency < 100ms', 'Order by name ascending', 'Exclude disabled services'] },
      { id: 'US-03', title: 'Implement validateIncidentPayload API request validator in TypeScript', acceptance: ['Validate title is non-empty string', 'Validate severity is one of low, medium, critical', 'Return valid boolean and descriptive error message'] },
      { id: 'US-04', title: 'Join incidents with services to report unresolved outage count per service', acceptance: ['INNER JOIN services and incidents', 'Filter out status = resolved', 'Group by service name and order by count descending'] },
      { id: 'US-05', title: 'Build SeverityFilter interactive button bar in React', acceptance: ['Render buttons for all, medium, and critical', 'Apply btn-active to selected severity button', 'Trigger onSelect callback with clicked severity'] },
      { id: 'US-06', title: 'Locate services with multiple critical incidents using subquery', acceptance: ['Subquery on incidents with severity critical', 'HAVING count >= 2', 'Select id and name ordered by name'] },
      { id: 'US-07', title: 'Format incident Slack notification message in TypeScript', acceptance: ['Include uppercase severity prefix', 'Include service name and duration in minutes', 'Include incident ID tag'] },
      { id: 'US-08', title: 'Generate service incident summary ledger in PostgreSQL', acceptance: ['Group by service name', 'Calculate total incidents and count of resolved incidents', 'Order by total DESC then service name ASC'] },
      { id: 'US-09', title: 'Build TeamMemberAvatar component with role badge in React', acceptance: ['Render member name and initial', 'Apply role styling', 'Handle inactive member styling'] },
      { id: 'US-10', title: 'Query recent incident updates posted in the last 24 hours', acceptance: ['Join updates with authors', 'Order chronologically descending', 'Limit to recent posts'] },
      { id: 'US-11', title: 'Implement parseIncidentLogPayload utility in TypeScript', acceptance: ['Parse incoming JSON log payload', 'Handle missing optional fields safely', 'Format timestamp ISO string'] },
      { id: 'US-12', title: 'Calculate mean time to acknowledge per team member in PostgreSQL', acceptance: ['Aggregate time delta from incident creation to first update', 'Group by team member ID', 'Filter out zero update records'] },
      { id: 'US-13', title: 'Build IncidentTimelineFeed React component', acceptance: ['Render list of timestamped updates', 'Display author name and role', 'Empty state placeholder when no updates'] },
      { id: 'US-14', title: 'Audit service uptime SLA compliance report in PostgreSQL', acceptance: ['Calculate percentage of healthy checks', 'Filter by reporting window', 'Flag services below 99.9%'] },
    ],
  };

  const storyCount = isSolo ? 7 : 14;
  return {
    ...brief,
    stories: brief.stories.slice(0, storyCount),
  };
}

/**
 * 8 high-quality deterministic seed tasks for Web Tier 2 Virtual Internship:
 * 1 TSX/TypeScript + 1 SQL per member per week across 4 weekly sprints.
 */
export function getDeterministicWebTier2Tasks(stories: UserStory[]): Tier2TaskItem[] {
  const getStoryId = (idx: number) => (stories[idx % stories.length]?.id || `US-0${idx + 1}`);

  return [
    // ── Week 1 ─────────────────────────────────────────────────────────────
    {
      seq: 1,
      week: 1,
      kind: 'ui_component',
      language: 'tsx',
      storyId: getStoryId(0),
      model: 'seed-task',
      task: {
        title: 'Build ServiceStatusCard Component',
        brief: 'Implement ServiceStatusCard which receives name (string), status ("healthy" | "degraded" | "down"), and latency (number). Render a div with class "service-card", an h3 with the service name, and a span with class "status-indicator status-{status}". Display "{latency}ms" inside.',
        starter_code: `export function ServiceStatusCard(props: { name: string; status: string; latency: number }) {\n  return <div>TODO</div>;\n}\n`,
        visible_tests: `const h1 = render(ServiceStatusCard, { name: "Auth Service", status: "healthy", latency: 15 });\nassert(h1.includes("Auth Service"));\nassert(h1.includes("status-healthy"));\nassert(h1.includes("15ms"));\n`,
        hidden_tests: `const h2 = render(ServiceStatusCard, { name: "Billing API", status: "degraded", latency: 250 });\nassert(h2.includes("Billing API"));\nassert(h2.includes("status-degraded"));\nassert(h2.includes("250ms"));\nconst h3 = render(ServiceStatusCard, { name: "DB", status: "down", latency: 999 });\nassert(h3.includes("status-down"));\nassert(h3.includes('class="service-card"'));\n`,
        reference_solution: `export function ServiceStatusCard({ name, status, latency }: { name: string; status: string; latency: number }) {\n  return (\n    <div className="service-card">\n      <h3 className="service-name">{name}</h3>\n      <span className={\`status-indicator status-\${status}\`}>{latency}ms</span>\n    </div>\n  );\n}\n`,
        skills: ['React Components', 'Props and Typing', 'JSX and Element Rendering'],
        sql_setup: null,
      },
    },
    {
      seq: 2,
      week: 1,
      kind: 'query_filter',
      language: 'sql',
      storyId: getStoryId(1),
      model: 'seed-task',
      task: {
        title: 'Query Active Services with Low Latency',
        brief: 'Write a SQL query against the `services` table selecting active services with latency under 100ms, ordered by name ascending.',
        starter_code: `SELECT id, name, latency FROM services WHERE false;`,
        visible_tests: `SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Auth API','Web Gateway'] AS ok, 'Returns fast active services' AS msg;`,
        hidden_tests: `SELECT (SELECT array_agg(latency ORDER BY latency) FROM answer) = ARRAY[25, 45] AS ok, 'Latencies match' AS msg;\nSELECT (SELECT count(*) FROM answer WHERE name = 'Payment Engine') = 0 AS ok, 'Excluded degraded service' AS msg;`,
        reference_solution: `SELECT id, name, latency FROM services WHERE active = true AND latency < 100 ORDER BY name ASC;`,
        skills: ['SELECT with WHERE and ORDER BY', 'PostgreSQL DDL and Table Constraints'],
        sql_setup: `CREATE TABLE services (id INT PRIMARY KEY, name TEXT, latency INT, active BOOLEAN);\nINSERT INTO services VALUES (1, 'Web Gateway', 45, true), (2, 'Auth API', 25, true), (3, 'Payment Engine', 350, true), (4, 'Legacy Batch', 80, false);`,
      },
    },

    // ── Week 2 ─────────────────────────────────────────────────────────────
    {
      seq: 3,
      week: 2,
      kind: 'api_handler',
      language: 'typescript',
      storyId: getStoryId(2),
      model: 'seed-task',
      task: {
        title: 'Validate Incident Submission Payload',
        brief: 'Implement `validateIncidentPayload(payload: Record<string, any>)` for our Node.js API. Verify that title is a non-empty string, severity is one of "low", "medium", "critical", and serviceId is a positive integer. Return an object with { valid: boolean, error?: string }.',
        starter_code: `export function validateIncidentPayload(payload: Record<string, any>): { valid: boolean; error?: string } {\n  return { valid: false };\n}\n`,
        visible_tests: `const r1 = validateIncidentPayload({ title: "Disk Full", severity: "critical", serviceId: 10 });\nassert(r1.valid === true);\nconst r2 = validateIncidentPayload({ title: "", severity: "low", serviceId: 2 });\nassert(r2.valid === false);\nassert(r2.error !== undefined);\n`,
        hidden_tests: `const r3 = validateIncidentPayload({ title: "OOM Crash", severity: "invalid-sev", serviceId: 5 });\nassert(r3.valid === false);\nconst r4 = validateIncidentPayload({ title: "Network Spike", severity: "medium", serviceId: -1 });\nassert(r4.valid === false);\nconst r5 = validateIncidentPayload({ title: "Database High Lag", severity: "low", serviceId: 42 });\nassert(r5.valid === true);\n`,
        reference_solution: `export function validateIncidentPayload(payload: Record<string, any>): { valid: boolean; error?: string } {\n  if (!payload.title || typeof payload.title !== 'string' || payload.title.trim() === '') {\n    return { valid: false, error: 'Title must not be empty' };\n  }\n  const allowedSev = ['low', 'medium', 'critical'];\n  if (!allowedSev.includes(payload.severity)) {\n    return { valid: false, error: 'Invalid severity' };\n  }\n  if (typeof payload.serviceId !== 'number' || payload.serviceId <= 0) {\n    return { valid: false, error: 'serviceId must be positive integer' };\n  }\n  return { valid: true };\n}\n`,
        skills: ['TypeScript Functions and Generics', 'Node.js Request Validation', 'HTTP Status Codes and Error Responses'],
        sql_setup: null,
      },
    },
    {
      seq: 4,
      week: 2,
      kind: 'multi_table_join',
      language: 'sql',
      storyId: getStoryId(3),
      model: 'seed-task',
      task: {
        title: 'Join Services with Incident Counts',
        brief: 'Write a SQL query joining `services` and `incidents` to find all services with their count of unresolved incidents (status != "resolved"), ordered by count descending then name ascending.',
        starter_code: `SELECT s.name, COUNT(i.id) AS unresolved_count FROM services s JOIN incidents i ON s.id = i.service_id WHERE false GROUP BY s.name;`,
        visible_tests: `SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Auth Service','Data Pipeline'] AS ok, 'Identifies services with unresolved incidents' AS msg;`,
        hidden_tests: `SELECT (SELECT unresolved_count FROM answer WHERE name = 'Auth Service') = 2::bigint AS ok, 'Auth Service has 2 open incidents' AS msg;\nSELECT (SELECT unresolved_count FROM answer WHERE name = 'Data Pipeline') = 1::bigint AS ok, 'Data Pipeline has 1 open incident' AS msg;\nSELECT (SELECT count(*) FROM answer WHERE name = 'Web App') = 0 AS ok, 'Web App with only resolved incidents is excluded' AS msg;`,
        reference_solution: `SELECT s.name, COUNT(i.id) AS unresolved_count FROM services s JOIN incidents i ON s.id = i.service_id WHERE i.status != 'resolved' GROUP BY s.name ORDER BY unresolved_count DESC, s.name ASC;`,
        skills: ['Multi-table INNER and LEFT JOINs', 'GROUP BY and Aggregate Functions (COUNT, SUM, AVG)'],
        sql_setup: `CREATE TABLE services (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE incidents (id INT PRIMARY KEY, service_id INT, status TEXT);\nINSERT INTO services VALUES (1, 'Auth Service'), (2, 'Data Pipeline'), (3, 'Web App');\nINSERT INTO incidents VALUES (101, 1, 'investigating'), (102, 1, 'identified'), (103, 2, 'investigating'), (104, 3, 'resolved');`,
      },
    },

    // ── Week 3 ─────────────────────────────────────────────────────────────
    {
      seq: 5,
      week: 3,
      kind: 'interactive_feature',
      language: 'tsx',
      storyId: getStoryId(4),
      model: 'seed-task',
      task: {
        title: 'Build SeverityFilter Component',
        brief: 'Implement SeverityFilter component that accepts "selected" (string) and "onSelect" (callback). Render 3 buttons inside a container with class "severity-filter" for "all", "medium", and "critical". The button matching "selected" must have class "btn-active".',
        starter_code: `export function SeverityFilter(props: { selected: string; onSelect?: (val: string) => void }) {\n  return <div>TODO</div>;\n}\n`,
        visible_tests: `const h1 = render(SeverityFilter, { selected: "critical" });\nassert(h1.includes('class="severity-filter"'));\nassert(h1.includes("btn-active"));\nassert(h1.includes("critical"));\n`,
        hidden_tests: `const h2 = render(SeverityFilter, { selected: "all" });\nassert(h2.includes('class="severity-filter"'));\nassert(h2.includes("all"));\nconst h3 = render(SeverityFilter, { selected: "medium" });\nassert(h3.includes("medium"));\nassert(h3.includes("<button"));\n`,
        reference_solution: `export function SeverityFilter({ selected, onSelect }: { selected: string; onSelect?: (val: string) => void }) {\n  const tiers = ['all', 'medium', 'critical'];\n  return (\n    <div className="severity-filter">\n      {tiers.map((t) => (\n        <button\n          key={t}\n          type="button"\n          className={\`filter-btn \${selected === t ? 'btn-active' : ''}\`}\n          onClick={() => onSelect && onSelect(t)}\n        >\n          {t}\n        </button>\n      ))}\n    </div>\n  );\n}\n`,
        skills: ['React Components', 'State Management (useState)', 'Conditional Rendering and Lists'],
        sql_setup: null,
      },
    },
    {
      seq: 6,
      week: 3,
      kind: 'subquery_filter',
      language: 'sql',
      storyId: getStoryId(5),
      model: 'seed-task',
      task: {
        title: 'Find Services Having Multiple Critical Incidents Subquery',
        brief: 'Write a SQL query using a subquery to select id and name of services that have experienced 2 or more incidents with severity = "critical".',
        starter_code: `SELECT id, name FROM services WHERE false;`,
        visible_tests: `SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Search Engine'] AS ok, 'Finds Search Engine service' AS msg;`,
        hidden_tests: `SELECT (SELECT array_agg(id ORDER BY id) FROM answer) = ARRAY[2] AS ok, 'Returns service ID 2' AS msg;\nSELECT (SELECT count(*) FROM answer WHERE name = 'Gateway') = 0 AS ok, 'Excludes services with fewer than 2 criticals' AS msg;`,
        reference_solution: `SELECT id, name FROM services WHERE id IN (SELECT service_id FROM incidents WHERE severity = 'critical' GROUP BY service_id HAVING count(*) >= 2) ORDER BY name ASC;`,
        skills: ['Subqueries and EXISTS Filtering'],
        sql_setup: `CREATE TABLE services (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE incidents (id INT PRIMARY KEY, service_id INT, severity TEXT);\nINSERT INTO services VALUES (1, 'Gateway'), (2, 'Search Engine'), (3, 'Cache');\nINSERT INTO incidents VALUES (1, 1, 'critical'), (2, 2, 'critical'), (3, 2, 'critical'), (4, 3, 'low');`,
      },
    },

    // ── Week 4 ─────────────────────────────────────────────────────────────
    {
      seq: 7,
      week: 4,
      kind: 'service_integration',
      language: 'typescript',
      storyId: getStoryId(6),
      model: 'seed-task',
      task: {
        title: 'Format Incident Slack Webhook Notification',
        brief: 'Implement `formatIncidentAlert(incident: { id: string; service: string; severity: string; durationMin: number })` returning an alert string formatted as "[SEVERITY] Service: <service> has been down for <duration>m (Incident #<id>)". The severity must be uppercase.',
        starter_code: `export function formatIncidentAlert(incident: { id: string; service: string; severity: string; durationMin: number }): string {\n  return "";\n}\n`,
        visible_tests: `const msg1 = formatIncidentAlert({ id: "INC-12", service: "Redis Cache", severity: "critical", durationMin: 45 });\nassert(msg1 === "[CRITICAL] Service: Redis Cache has been down for 45m (Incident #INC-12)");\nconst msg2 = formatIncidentAlert({ id: "INC-15", service: "Database", severity: "low", durationMin: 10 });\nassert(msg2 === "[LOW] Service: Database has been down for 10m (Incident #INC-15)");\n`,
        hidden_tests: `const msg3 = formatIncidentAlert({ id: "INC-99", service: "API Gateway", severity: "high", durationMin: 12 });\nassert(msg3 === "[HIGH] Service: API Gateway has been down for 12m (Incident #INC-99)");\nconst msg4 = formatIncidentAlert({ id: "INC-1", service: "Auth", severity: "low", durationMin: 5 });\nassert(msg4.startsWith("[LOW]"));\nassert(msg4.includes("Auth"));\n`,
        reference_solution: `export function formatIncidentAlert(incident: { id: string; service: string; severity: string; durationMin: number }): string {\n  return \`[\${incident.severity.toUpperCase()}] Service: \${incident.service} has been down for \${incident.durationMin}m (Incident #\${incident.id})\`;\n}\n`,
        skills: ['TypeScript Functions and Generics', 'Data Parsing and Transformation', 'String and Object Manipulation'],
        sql_setup: null,
      },
    },
    {
      seq: 8,
      week: 4,
      kind: 'revenue_report',
      language: 'sql',
      storyId: getStoryId(7),
      model: 'seed-task',
      task: {
        title: 'Generate Service Incident Severity Summary Ledger',
        brief: 'Write a SQL query grouping by service_name to compute total incident count and count of resolved incidents as resolved_count, ordered by total DESC then service_name ASC.',
        starter_code: `SELECT service_name, COUNT(*) AS total, SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_count FROM incident_reports WHERE false GROUP BY service_name;`,
        visible_tests: `SELECT (SELECT array_agg(service_name ORDER BY service_name) FROM answer) = ARRAY['Auth','Database'] AS ok, 'Groups by service_name Auth and Database' AS msg;`,
        hidden_tests: `SELECT (SELECT total FROM answer WHERE service_name = 'Database') = 3::bigint AS ok, 'Database has 3 total incidents' AS msg;\nSELECT (SELECT resolved_count FROM answer WHERE service_name = 'Database') = 2::bigint AS ok, 'Database has 2 resolved incidents' AS msg;\nSELECT (SELECT resolved_count FROM answer WHERE service_name = 'Auth') = 1::bigint AS ok, 'Auth has 1 resolved incident' AS msg;`,
        reference_solution: `SELECT service_name, COUNT(*) AS total, SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END)::bigint AS resolved_count FROM incident_reports GROUP BY service_name ORDER BY total DESC, service_name ASC;`,
        skills: ['GROUP BY and Aggregate Functions (COUNT, SUM, AVG)', 'PostgreSQL DDL and Table Constraints'],
        sql_setup: `CREATE TABLE incident_reports (id INT PRIMARY KEY, service_name TEXT, status TEXT);\nINSERT INTO incident_reports VALUES (1, 'Database', 'resolved'), (2, 'Database', 'resolved'), (3, 'Database', 'open'), (4, 'Auth', 'resolved'), (5, 'Auth', 'investigating');`,
      },
    },
  ];
}

