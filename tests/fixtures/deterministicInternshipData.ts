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
