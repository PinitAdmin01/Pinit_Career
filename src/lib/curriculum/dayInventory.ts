// src/lib/curriculum/dayInventory.ts
// Single Source of Truth for PinIT Curriculum Day Accounting & Centralized Calendar Mapping
// Enforces programmatic invariants: Learning Day Number != Calendar Week Number,
// exact 120 Semester 1 core instructional days, exactly 2 consolidation days, and seamless semester transitions.

export type DayClassification = 
  | 'CORE_INSTRUCTION' 
  | 'CONSOLIDATION' 
  | 'GATE_ASSESSMENT' 
  | 'DEFENSE';

export interface DayInventoryEntry {
  dayNumber: number;                       // Monotonic program day: 1..125
  semester: 1 | 2;                         // Academic semester: 1 or 2
  monthNumber: number;                     // 1..24
  calendarWeekNumber: number;              // 1..48
  dayType: DayClassification;              // Exact functional category
  batchId?: string;                        // Standard batch identifier
  blockId?: string;                        // Milestone block identifier
  coreInstructionalDayIndex: number | null; // 1..120 for Semester 1 core; null for consolidation
}

/**
 * Builds the canonical day inventory for Days 1 through 125.
 */
function generateCanonicalDayInventory(): DayInventoryEntry[] {
  const entries: DayInventoryEntry[] = [];

  // ── 1. Days 1–60: Months 1–3 Core Instruction (Batches 001–012, 60 days) ──
  // Month 1 (Weeks 1–4, Days 1–20): Batches 001–004
  // Month 2 (Weeks 5–8, Days 21–40): Batches 005–008
  // Month 3 (Weeks 9–12, Days 41–60): Batches 009–012 (Day 60 is Gate 1 Assessment)
  for (let d = 1; d <= 60; d++) {
    const monthNumber = Math.ceil(d / 20);
    const calendarWeekNumber = Math.ceil(d / 5);
    const batchNum = String(calendarWeekNumber).padStart(3, '0');
    const isGate1 = d === 60;

    entries.push({
      dayNumber: d,
      semester: 1,
      monthNumber,
      calendarWeekNumber,
      dayType: isGate1 ? 'GATE_ASSESSMENT' : 'CORE_INSTRUCTION',
      batchId: `batch-pfs-m${monthNumber}-w${String(calendarWeekNumber).padStart(2, '0')}-${batchNum}`,
      coreInstructionalDayIndex: d,
    });
  }

  // ── 2. Days 61–62: Post-Gate 1 Consolidation Block (2 Milestone Days) ──
  entries.push({
    dayNumber: 61,
    semester: 1,
    monthNumber: 3,
    calendarWeekNumber: 12, // Post-Week 12 Consolidation
    dayType: 'CONSOLIDATION',
    blockId: 'block-pfs-m3-post-gate01',
    coreInstructionalDayIndex: null,
  });

  entries.push({
    dayNumber: 62,
    semester: 1,
    monthNumber: 3,
    calendarWeekNumber: 12, // Post-Week 12 Retrospective & Defense
    dayType: 'DEFENSE',
    blockId: 'block-pfs-m3-post-gate01',
    coreInstructionalDayIndex: null,
  });

  // ── 3. Days 63–122: Months 4–6 Core Instruction (Batches 013–024, 60 days) ──
  // Month 4: Days 63–82 (Batches 013–016, 20 days) -> Core Indexes 61..80
  // Month 5: Days 83–102 (Batches 017–020, 20 days) -> Core Indexes 81..100
  // Month 6: Days 103–122 (Batches 021–024, 20 days) -> Core Indexes 101..120
  for (let d = 63; d <= 122; d++) {
    const coreIndex = d - 2; // Subtract 2 consolidation days
    let monthNumber: number;
    if (d <= 82) monthNumber = 4;
    else if (d <= 102) monthNumber = 5;
    else monthNumber = 6;

    // Batch mapping: Batch 013 starts at Day 63
    const batchOffset = Math.floor((d - 63) / 5);
    const batchNumInt = 13 + batchOffset;
    const batchNum = String(batchNumInt).padStart(3, '0');
    const isGate2 = d === 122;

    entries.push({
      dayNumber: d,
      semester: 1,
      monthNumber,
      calendarWeekNumber: batchNumInt, // e.g. Week 13 through Week 24
      dayType: isGate2 ? 'GATE_ASSESSMENT' : 'CORE_INSTRUCTION',
      batchId: `batch-pfs-m${monthNumber}-w${String(batchNumInt).padStart(2, '0')}-${batchNum}`,
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // ── 4. Days 123–139: Semester 2 (Month 7 Weeks 25–28, 17 days) ──
  // Days 123–127: Month 7 Week 25 (Batch 025 Days 1–5, 5 days) -> Core Indexes 121..125
  for (let d = 123; d <= 127; d++) {
    const coreIndex = d - 2; // Subtract 2 consolidation days: 121..125
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 7,
      calendarWeekNumber: 25,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m7-w25-025',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // Days 128–132: Month 7 Week 26 (Batch 026 Days 1–5, 5 days) -> Core Indexes 126..130
  for (let d = 128; d <= 132; d++) {
    const coreIndex = d - 2; // 126..130
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 7,
      calendarWeekNumber: 26,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m7-w26-026',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // Days 133–137: Month 7 Week 27 (Batch 027 Days 1–5, 5 days) -> Core Indexes 131..135
  for (let d = 133; d <= 137; d++) {
    const coreIndex = d - 2; // 131..135
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 7,
      calendarWeekNumber: 27,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m7-w27-027',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // Days 138–142: Month 7 Week 28 (Batch 028 Days 1–5, 5 days) -> Core Indexes 136..140
  for (let d = 138; d <= 142; d++) {
    const coreIndex = d - 2; // 136..140
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 7,
      calendarWeekNumber: 28,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m7-w28-028',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // Days 143–147: Month 8 Week 29 (Batch 029 Days 1–5, 5 days) -> Core Indexes 141..145
  for (let d = 143; d <= 147; d++) {
    const coreIndex = d - 2; // 141..145
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 8,
      calendarWeekNumber: 29,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m8-w29-029',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // Days 148–152: Month 8 Week 30 (Batch 030 Days 1–5, 5 days) -> Core Indexes 146..150
  for (let d = 148; d <= 152; d++) {
    const coreIndex = d - 2; // 146..150
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 8,
      calendarWeekNumber: 30,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m8-w30-030',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // Days 153–157: Month 8 Week 31 (Batch 031 Days 1–5, 5 days) -> Core Indexes 151..155
  for (let d = 153; d <= 157; d++) {
    const coreIndex = d - 2; // 151..155
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 8,
      calendarWeekNumber: 31,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m8-w31-031',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // Days 158–162: Month 8 Week 32 (Batch 032 Days 1–5, 5 days) -> Core Indexes 156..160
  for (let d = 158; d <= 162; d++) {
    const coreIndex = d - 2; // 156..160
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 8,
      calendarWeekNumber: 32,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m8-w32-032',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  // Days 163–167: Month 9 Week 33 (Batch 033 Days 1–5, 5 days) -> Core Indexes 161..165
  for (let d = 163; d <= 167; d++) {
    const coreIndex = d - 2; // 161..165
    entries.push({
      dayNumber: d,
      semester: 2,
      monthNumber: 9,
      calendarWeekNumber: 33,
      dayType: 'CORE_INSTRUCTION',
      batchId: 'batch-pfs-m9-w33-033',
      coreInstructionalDayIndex: coreIndex,
    });
  }

  return entries;
}

export const CANONICAL_DAY_INVENTORY: DayInventoryEntry[] = generateCanonicalDayInventory();

export interface InventoryValidationResult {
  valid: boolean;
  totalDays: number;
  semester1CoreCount: number;
  consolidationDaysCount: number;
  semester2CoreCount: number;
  errors: string[];
}

/**
 * Validates all structural, contiguity, and boundary invariants of the day inventory.
 */
export function validateDayInventory(inventory: DayInventoryEntry[] = CANONICAL_DAY_INVENTORY): InventoryValidationResult {
  const errors: string[] = [];

  // 1. Total Days Count
  if (inventory.length !== 167) {
    errors.push(`Expected exactly 167 days in inventory, found ${inventory.length}`);
  }

  // 2. Strict Contiguity of dayNumber (1..153) without gaps or duplicates
  const seenDays = new Set<number>();
  for (let i = 0; i < inventory.length; i++) {
    const expectedDay = i + 1;
    const entry = inventory[i];
    if (entry.dayNumber !== expectedDay) {
      errors.push(`Day index mismatch at array index ${i}: expected dayNumber ${expectedDay}, found ${entry.dayNumber}`);
    }
    if (seenDays.has(entry.dayNumber)) {
      errors.push(`Duplicate dayNumber found: ${entry.dayNumber}`);
    }
    seenDays.add(entry.dayNumber);
  }

  // 3. Semester 1 Core Instructional Days: exactly 120 contiguous days
  const sem1CoreEntries = inventory.filter(d => d.semester === 1 && d.coreInstructionalDayIndex !== null);
  if (sem1CoreEntries.length !== 120) {
    errors.push(`Expected exactly 120 Semester 1 core instructional days, found ${sem1CoreEntries.length}`);
  }
  for (let i = 0; i < sem1CoreEntries.length; i++) {
    const expectedCoreIndex = i + 1;
    const entry = sem1CoreEntries[i];
    if (entry.coreInstructionalDayIndex !== expectedCoreIndex) {
      errors.push(`Semester 1 coreInstructionalDayIndex gap: expected ${expectedCoreIndex}, found ${entry.coreInstructionalDayIndex} at dayNumber ${entry.dayNumber}`);
    }
  }

  // 4. Milestone / Consolidation Days: exactly Days 61 and 62 with null core index
  const nullCoreEntries = inventory.filter(d => d.coreInstructionalDayIndex === null);
  if (nullCoreEntries.length !== 2) {
    errors.push(`Expected exactly 2 consolidation days with null core index, found ${nullCoreEntries.length}`);
  }
  const nullDayNumbers = nullCoreEntries.map(d => d.dayNumber).sort((a, b) => a - b);
  if (nullDayNumbers[0] !== 61 || nullDayNumbers[1] !== 62) {
    errors.push(`Expected consolidation days to be exactly [61, 62], found [${nullDayNumbers.join(', ')}]`);
  }

  // 5. Day 122 is Core Instructional Day 120 and is the Gate 2 Assessment
  const day122 = inventory.find(d => d.dayNumber === 122);
  if (!day122) {
    errors.push('Day 122 missing from inventory');
  } else {
    if (day122.coreInstructionalDayIndex !== 120) {
      errors.push(`Day 122 must have coreInstructionalDayIndex === 120, found ${day122.coreInstructionalDayIndex}`);
    }
    if (day122.dayType !== 'GATE_ASSESSMENT') {
      errors.push(`Day 122 must have dayType === 'GATE_ASSESSMENT', found ${day122.dayType}`);
    }
    if (day122.semester !== 1) {
      errors.push(`Day 122 must be in semester 1, found ${day122.semester}`);
    }
  }

  // 6. Day 123 is Semester 2 Launch (Core Instructional Day 121)
  const day123 = inventory.find(d => d.dayNumber === 123);
  if (!day123) {
    errors.push('Day 123 missing from inventory');
  } else {
    if (day123.coreInstructionalDayIndex !== 121) {
      errors.push(`Day 123 must have coreInstructionalDayIndex === 121, found ${day123.coreInstructionalDayIndex}`);
    }
    if (day123.semester !== 2) {
      errors.push(`Day 123 must be in semester 2, found ${day123.semester}`);
    }
  }

  // 7. Semester 2 Core Days: exactly 45 days (121..165)
  const sem2CoreEntries = inventory.filter(d => d.semester === 2);
  if (sem2CoreEntries.length !== 45) {
    errors.push(`Expected exactly 45 Semester 2 days in active horizon, found ${sem2CoreEntries.length}`);
  }
  for (let i = 0; i < sem2CoreEntries.length; i++) {
    const expectedCoreIndex = 121 + i;
    const entry = sem2CoreEntries[i];
    if (entry.coreInstructionalDayIndex !== expectedCoreIndex) {
      errors.push(`Semester 2 coreInstructionalDayIndex gap: expected ${expectedCoreIndex}, found ${entry.coreInstructionalDayIndex}`);
    }
  }

  return {
    valid: errors.length === 0,
    totalDays: inventory.length,
    semester1CoreCount: sem1CoreEntries.length,
    consolidationDaysCount: nullCoreEntries.length,
    semester2CoreCount: sem2CoreEntries.length,
    errors,
  };
}
