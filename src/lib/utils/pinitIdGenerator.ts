/**
 * PinIT ID Generator & College ID Parser
 * 
 * Provides deterministic, human-readable, and memorable PinIT IDs:
 * - College PinIT ID: PIN-[COLLEGE]-[BRANCH]-[ROLL] (e.g., PIN-RVCE-CSE-042)
 * - Global PinIT ID:  PIN-GLB-[NAME]-[3_DIGITS]     (e.g., PIN-GLB-VINAY-742)
 */

export interface CollegeMetadata {
  collegeName: string;
  collegeCode: string;
  department: string;
  departmentCode: string;
  rollNumber: string;
  batchYear?: string;
  studentName?: string;
  rawExtractedText?: string;
  confidence: number;
}

export interface PinItIdResult {
  pinitId: string;
  type: 'college' | 'global';
  displayBadge: string;
  metadata?: Partial<CollegeMetadata>;
}

// Stopwords to discard when calculating college acronyms
const STOPWORDS = new Set([
  'of', 'and', 'the', 'for', 'in', 'to', 'at', 'an', 'a', 'by', 'with', 'from',
  'affiliated', 'autonomous', 'approved', 'accredited', 'institution', 'institutions',
  'trust', 'educational', 'education', 'society', 'foundation'
]);

// Known College/University Lexicon for intelligent recognition
const COLLEGE_DICTIONARY: Array<{ patterns: RegExp[]; code: string; name: string }> = [
  { patterns: [/bgs\s*inst/i, /\bbgs\b/i, /bimb/i], code: 'BGS', name: 'BGS Institute of Management' },
  { patterns: [/shri\s*ram\s*college/i, /\bsrcc\b/i], code: 'SRCC', name: 'Shri Ram College of Commerce' },
  { patterns: [/st\.?\s*joseph/i, /\bsjcc\b/i, /\bsjc\b/i], code: 'SJCC', name: "St. Joseph's College of Commerce" },
  { patterns: [/dayananda\s*sagar/i, /\bdsce\b/i], code: 'DSCE', name: 'Dayananda Sagar College of Engineering' },
  { patterns: [/r\.?\s*v\.?\s*college/i, /\brvce\b/i, /rashtreeya\s*sikshana/i], code: 'RVCE', name: 'R.V. College of Engineering' },
  { patterns: [/pes\s*univ/i, /pes\s*institute/i, /pesit/i, /pesu/i], code: 'PES', name: 'PES University' },
  { patterns: [/b\.?\s*m\.?\s*s\.?\s*college/i, /bms\s*college/i, /bmsce/i, /bmsit/i], code: 'BMS', name: 'B.M.S. College of Engineering' },
  { patterns: [/ramaiah/i, /msrit/i, /m\.?\s*s\.?\s*ramaiah/i], code: 'MSRIT', name: 'M.S. Ramaiah Institute of Technology' },
  { patterns: [/indian\s*inst.*tech.*bombay/i, /iit\s*bombay/i, /iitb/i], code: 'IITB', name: 'IIT Bombay' },
  { patterns: [/indian\s*inst.*tech.*delhi/i, /iit\s*delhi/i, /iitd/i], code: 'IITD', name: 'IIT Delhi' },
  { patterns: [/indian\s*inst.*tech.*madras/i, /iit\s*madras/i, /iitm/i], code: 'IITM', name: 'IIT Madras' },
  { patterns: [/indian\s*inst.*tech.*kanpur/i, /iit\s*kanpur/i, /iitk/i], code: 'IITK', name: 'IIT Kanpur' },
  { patterns: [/indian\s*inst.*tech.*kharagpur/i, /iit\s*kgp/i], code: 'IITKGP', name: 'IIT Kharagpur' },
  { patterns: [/national\s*inst.*tech.*surathkal/i, /nitk/i, /nit\s*surathkal/i], code: 'NITK', name: 'NIT Surathkal' },
  { patterns: [/national\s*inst.*tech.*trichy/i, /nitt/i, /nit\s*trichy/i], code: 'NITT', name: 'NIT Trichy' },
  { patterns: [/bits\s*pilani/i, /birla\s*inst/i], code: 'BITS', name: 'BITS Pilani' },
  { patterns: [/vellore\s*inst/i, /vit\s*univ/i, /\bvit\b/i], code: 'VIT', name: 'Vellore Institute of Technology' },
  { patterns: [/manipal\s*inst/i, /\bmit\s*manipal\b/i, /manipal\s*univ/i], code: 'MIT', name: 'Manipal Institute of Technology' },
  { patterns: [/srm\s*inst/i, /srm\s*univ/i], code: 'SRM', name: 'SRM Institute of Science & Technology' },
  { patterns: [/delhi\s*univ/i, /univ.*delhi/i, /\bdu\b/i], code: 'DU', name: 'Delhi University' },
  { patterns: [/anna\s*univ/i], code: 'ANNA', name: 'Anna University' },
  { patterns: [/visvesvaraya\s*tech/i, /\bvtu\b/i], code: 'VTU', name: 'VTU Belagavi' },
  { patterns: [/mehtab\s*college/i], code: 'MC', name: 'Mehtab College of BBA/BCA' },
];

// Department / Branch Lexicon
const DEPARTMENT_DICTIONARY: Array<{ patterns: RegExp[]; code: string; name: string }> = [
  { patterns: [/comp.*sci.*eng/i, /computer\s*science/i, /\bcse\b/i], code: 'CSE', name: 'Computer Science & Engineering' },
  { patterns: [/info.*sci/i, /information\s*technology/i, /\bise\b/i], code: 'ISE', name: 'Information Science & Engineering' },
  { patterns: [/artif.*intel/i, /\baiml\b/i, /ai\s*&\s*ml/i], code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
  { patterns: [/data\s*sci/i, /\baids\b/i], code: 'AIDS', name: 'Data Science & AI' },
  { patterns: [/electron.*commun/i, /electronics\s*(?:&|and)\s*comm/i, /\bece\b/i], code: 'ECE', name: 'Electronics & Communication' },
  { patterns: [/electrical\s*(?:&|and)\s*electr/i, /\beee\b/i], code: 'EEE', name: 'Electrical & Electronics' },
  { patterns: [/mechanical/i, /\bmech\b/i], code: 'MECH', name: 'Mechanical Engineering' },
  { patterns: [/civil\s*eng/i, /\bcivil\b/i], code: 'CIVIL', name: 'Civil Engineering' },
  { patterns: [/biotech/i, /\bbiotech\b/i], code: 'BIOTECH', name: 'Biotechnology' },
  { patterns: [/internet\s*of\s*things/i, /\biot\b/i], code: 'IOT', name: 'Internet of Things' },
  { patterns: [/commerce/i, /\bb\.?com\b/i], code: 'BCOM', name: 'Bachelor of Commerce' },
  { patterns: [/business\s*admin/i, /\bbba\b/i, /\bmba\b/i], code: 'BBA', name: 'Business Administration' },
  { patterns: [/computer\s*app/i, /\bbca\b/i, /\bmca\b/i], code: 'BCA', name: 'Computer Applications' },
];

// 2-Letter branch acronyms embedded inside Indian USN / Roll numbers (e.g. 22CS045 -> CS -> CSE)
const ROLL_BRANCH_MAP: Record<string, { code: string; name: string }> = {
  CS: { code: 'CSE', name: 'Computer Science & Engineering' },
  IS: { code: 'ISE', name: 'Information Science & Engineering' },
  EC: { code: 'ECE', name: 'Electronics & Communication' },
  EE: { code: 'EEE', name: 'Electrical & Electronics' },
  ME: { code: 'MECH', name: 'Mechanical Engineering' },
  CV: { code: 'CIVIL', name: 'Civil Engineering' },
  AI: { code: 'AIML', name: 'Artificial Intelligence & ML' },
  DS: { code: 'AIDS', name: 'Data Science' },
  BT: { code: 'BIOTECH', name: 'Biotechnology' },
};

/**
 * Identify boilerplate text common on the back of ID cards or in footer disclaimers.
 */
function isBoilerplateInstruction(line: string): boolean {
  return /(?:property\s*of|non[-\s]*transferable|must\s*carry|carry\s*this|produced\s*on\s*demand|authorized\s*personnel|if\s*found|please\s*return|college\s*office|instructions|campus\s*rules|valid\s*in|rules\s*and\s*regulations|terms\s*and\s*conditions)/i.test(line);
}

/**
 * Generate a clean, 3-digit deterministic hash from a string.
 */
function hashTo3Digits(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const positive = (Math.abs(hash) % 900) + 100;
  return positive.toString();
}

/**
 * Clean and normalize a string to an alphanumeric slug.
 */
function cleanSlug(text: string, maxLen = 8): string {
  const cleaned = text
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return cleaned.slice(0, maxLen) || 'STUDENT';
}

/**
 * Generate an easy-to-read, memorable Global PinIT ID.
 * Format: PIN-GLB-[NAME_SLUG]-[3_DIGITS]
 * E.g., "PIN-GLB-VINAY-842"
 */
export function generateMemorableGlobalId(displayName: string, username = ''): string {
  const namePart = (displayName || username || 'STUDENT').trim().split(/\s+/)[0];
  const slug = cleanSlug(namePart, 8);
  const seed = `${displayName}_${username}_${Date.now()}`;
  const digits = hashTo3Digits(seed);
  return `PIN-GLB-${slug}-${digits}`;
}

/**
 * Generate an institutional, memorable College PinIT ID.
 * Format: PIN-[COLLEGE]-[BRANCH]-[ROLL]
 * E.g., "PIN-RVCE-CSE-042"
 */
export function generateCollegePinItId(
  paramsOrCollege: {
    collegeCode?: string;
    departmentCode?: string;
    rollNumber?: string;
    batchYear?: string;
  } | string,
  departmentCodeParam?: string,
  rollNumberParam?: string
): string {
  let collegeCode = 'COLLEGE';
  let deptCode = 'GEN';
  let roll = '001';

  if (typeof paramsOrCollege === 'object' && paramsOrCollege !== null) {
    collegeCode = (paramsOrCollege.collegeCode || 'COLLEGE').trim().toUpperCase();
    deptCode = (paramsOrCollege.departmentCode || 'GEN').trim().toUpperCase();
    roll = (paramsOrCollege.rollNumber || '001').trim().toUpperCase();
  } else if (typeof paramsOrCollege === 'string') {
    collegeCode = paramsOrCollege.trim().toUpperCase();
    if (departmentCodeParam) deptCode = departmentCodeParam.trim().toUpperCase();
    if (rollNumberParam) roll = rollNumberParam.trim().toUpperCase();
  }

  const cleanCollege = cleanSlug(collegeCode, 6);
  const cleanDept = cleanSlug(deptCode, 6);
  const cleanRoll = cleanSlug(roll, 6);

  return `PIN-${cleanCollege}-${cleanDept}-${cleanRoll}`;
}

/**
 * Parse raw extracted OCR text from a student ID card into structured metadata.
 */
export function parseCollegeCardFromText(
  rawText: string,
  fallbackDisplayName = ''
): CollegeMetadata {
  if (!rawText || typeof rawText !== 'string') {
    return {
      collegeName: 'Institution',
      collegeCode: 'COL',
      department: 'General',
      departmentCode: 'GEN',
      rollNumber: '001',
      studentName: fallbackDisplayName || 'Student',
      rawExtractedText: '',
      confidence: 0.3,
    };
  }

  const rawLines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Identify College Name & Canonical Acronym
  let collegeName = '';
  let collegeCode = '';
  let collegeFound = false;

  const headerLines = rawLines.slice(0, 8);
  const collegeLineIdx = headerLines.findIndex(l =>
    /(?:institute|college|university|academy|vidyalaya|polytechnic|school\s+of)/i.test(l) &&
    !/(?:near|opposite|opposit|cross|road|street|behind|temple|nagar|address|property|instruction)/i.test(l)
  );

  if (collegeLineIdx !== -1) {
    let matchedLine = headerLines[collegeLineIdx];
    matchedLine = matchedLine
      .replace(/^[^a-zA-Z]+/, '')
      .replace(/[^a-zA-Z0-9\s/&-]/g, ' ')
      .trim();

    let fullCollege = matchedLine;

    // Stitch line above if it contains the college title (e.g. "Sri Vivekananda" + "College of Engineering")
    if (collegeLineIdx > 0) {
      let prevLine = headerLines[collegeLineIdx - 1];
      const isPrevBoilerplate = /(?:gurudev|satyamev|welcome|om|ph|phone|email|www|http|contact|address|near|cross|road|property)/i.test(prevLine);
      if (!isPrevBoilerplate) {
        // Strip leading OCR symbols like "7 1 ", "of °F > "
        prevLine = prevLine
          .replace(/^(?:of|the|in|at|for)\s+/i, '')
          .replace(/^[^a-zA-Z]+/, '')
          .replace(/[^a-zA-Z0-9\s]/g, ' ')
          .trim();

        const words = prevLine.split(/\s+/).filter(w => w.length >= 2);
        if (words.length >= 1 && words.length <= 4) {
          fullCollege = `${prevLine} ${matchedLine}`;
        }
      }
    }

    collegeName = fullCollege
      .replace(/\s+(?:an|and|the|a|of|to|in)\s*$/i, '')
      .trim();

    // Check dictionary
    for (const c of COLLEGE_DICTIONARY) {
      if (c.patterns.some(p => p.test(collegeName) || p.test(matchedLine))) {
        collegeCode = c.code;
        collegeFound = true;
        break;
      }
    }

    if (!collegeFound) {
      // Discard single-letter OCR noise tokens (e.g. "M" from "M@", "F" from "°F")
      const words = collegeName
        .replace(/[^A-Za-z\s]/g, ' ')
        .split(/\s+/)
        .map(w => w.trim())
        .filter(w => {
          const lower = w.toLowerCase();
          if (STOPWORDS.has(lower)) return false;
          if (w.length < 2) return false;
          if (w.length === 2 && !['st', 'rv'].includes(lower)) return false;
          return true;
        });

      collegeCode = words.map(w => w.charAt(0).toUpperCase()).join('').slice(0, 5);
      if (collegeCode.length < 2 && words.length > 0) {
        collegeCode = words[0].toUpperCase().slice(0, 4);
      }
      collegeFound = true;
    }
  }

  // Fallback dictionary scan
  if (!collegeFound) {
    for (const c of COLLEGE_DICTIONARY) {
      if (c.patterns.some(p => p.test(rawText))) {
        collegeName = c.name;
        collegeCode = c.code;
        collegeFound = true;
        break;
      }
    }
  }

  if (!collegeName) {
    collegeName = 'Accredited Institution';
    collegeCode = 'COL';
  }

  // 2. Identify Course / Department
  let department = 'General Studies';
  let departmentCode = 'GEN';
  let deptFound = false;
  let deptLineIdx = -1;

  for (let i = 0; i < rawLines.length; i++) {
    const l = rawLines[i];
    const isNonDept = /(?:institute|college|university|polytechnic|address|cross|road|street|temple|near|behind|ph|phone|mobile|cell|contact|call|email|www|http|valid|date|signature|principal|dean)/i.test(l);
    if (isNonDept) continue;

    for (const d of DEPARTMENT_DICTIONARY) {
      if (d.patterns.some(p => p.test(l))) {
        department = d.name;
        departmentCode = d.code;
        deptFound = true;
        deptLineIdx = i;
        break;
      }
    }
    if (deptFound) break;

    const directDegreeMatch = l.match(/\b(BCA|MCA|B\.?TECH|B\.?COM|BBA|MBA|B\.?SC|MSC|CSE|ISE|ECE|EEE|MECH|CIVIL|AIDS|AIML)\b/i) ||
                             l.match(/\b(BE|B\.E\.)\b/);
    if (directDegreeMatch) {
      departmentCode = directDegreeMatch[1].toUpperCase().replace(/\./g, '');
      const dictEntry = DEPARTMENT_DICTIONARY.find(d => d.code === departmentCode);
      department = dictEntry ? dictEntry.name : (departmentCode === 'BE' ? 'Bachelor of Engineering' : departmentCode);
      deptFound = true;
      deptLineIdx = i;
      break;
    }
  }

  // Check Roll / USN for 2-letter branch code (e.g. 22CS045 -> CS -> CSE)
  if (!deptFound) {
    const rollBranchMatch = rawText.match(/\b(?:\d{2}|20\d{2})([A-Za-z]{2})[A-Za-z0-9]{2,4}\b/);
    if (rollBranchMatch) {
      const code = rollBranchMatch[1].toUpperCase();
      if (ROLL_BRANCH_MAP[code]) {
        departmentCode = ROLL_BRANCH_MAP[code].code;
        department = ROLL_BRANCH_MAP[code].name;
        deptFound = true;
      }
    }
  }

  if (!deptFound && /engineering/i.test(rawText)) {
    department = 'Engineering';
    departmentCode = 'ENG';
    deptFound = true;
  }

  // 3. Identify Student Name
  let studentName = '';

  // Pattern A: Check if Father's/Mother's/Guardian's Name exists!
  // In 95% of cards with a "Father's Name" row, the student name is the line right ABOVE Father's Name!
  const fatherIdx = rawLines.findIndex(l => /\b(?:father|mother|parent|guardian|husband)(?:'s)?\s*name\b/i.test(l));
  if (fatherIdx > 0) {
    for (let k = fatherIdx - 1; k >= 0; k--) {
      const prevCandidate = rawLines[k].replace(/[^A-Za-z\s.]/g, '').trim();
      const prevWords = prevCandidate.split(/\s+/).filter(Boolean);
      const isHeader = /(?:college|institute|university|school|dept|jammu|kashmir|govt|affiliated|recognized|autonomous|instructions)/i.test(prevCandidate);
      if (!isHeader && prevWords.length >= 1 && prevWords.length <= 4 && prevCandidate.length >= 3) {
        studentName = prevCandidate;
        break;
      }
    }
  }

  // Pattern B: Labeled student name (EXPLICIT: Never match Father's / Mother's Name!)
  if (!studentName) {
    const studentLabelMatch = rawText.match(/(?:^|\n)\s*(?:student\s*name|candidate\s*name|name\s*of\s*student)\s*[:#=-]?\s*([A-Za-z\s.]{3,30})/i);
    if (studentLabelMatch) {
      studentName = studentLabelMatch[1].trim();
    }
  }

  // Pattern C: Scored line search among clean candidates
  if (!studentName) {
    interface Candidate {
      line: string;
      score: number;
    }
    const candidates: Candidate[] = [];

    // Strictly forbidden words that can NEVER be a student name
    const isForbidden = /(?:college|institute|university|polytechnic|school|management|autonomous|approved|affiliated|recognized|address|cross|road|street|temple|near|behind|ph|phone|mobile|cell|contact|call|tel|help|email|www|http|valid|date|birth|blood|group|roll|reg|usn|principal|signature|dean|director|student\s*id|identity\s*card|father|mother|parent|guardian|husband|course|branch|dept|department|bba|bca|btech|be|mba|mca|bcom)/i;

    for (let i = 0; i < rawLines.length; i++) {
      const l = rawLines[i];
      if (isBoilerplateInstruction(l)) continue;
      if (isForbidden.test(l)) continue;
      // Skip the college header lines
      if (i === collegeLineIdx || (collegeLineIdx > 0 && i === collegeLineIdx - 1)) continue;

      const clean = l.replace(/[^A-Za-z\s.]/g, ' ').trim();
      const words = clean.split(/\s+/).filter(Boolean);

      // Strict validation:
      // Must be at least 2 words (e.g. "Vinay N", "Arjun Prasad", "Seema Sharma"),
      // OR 1 word with at least 4 letters (e.g. "Vinay")
      // NEVER allow single 2-3 letter syllables like "Ees .", "Kes ."
      if (words.length === 1 && words[0].length < 4) continue;
      if (words.length > 4 || clean.length < 3 || clean.length > 32) continue;

      let score = 0;
      if (words.length === 2 || words.length === 3) score += 40;
      if (clean === clean.toUpperCase()) score += 20;
      if (deptLineIdx !== -1 && i < deptLineIdx) score += 30;

      candidates.push({ line: clean, score });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      studentName = candidates[0].line;
    }
  }

  if (studentName) {
    studentName = studentName
      .toLowerCase()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } else {
    studentName = fallbackDisplayName || 'Student';
  }

  // 4. Identify Roll Number / USN / Contact Suffix
  let rollNumber = '';
  const usnRegex = /\b[0-9][A-Z]{2}[0-9]{2}[A-Z]{2,4}[0-9]{3}\b/i;
  const usnMatch = rawText.match(usnRegex);
  if (usnMatch) {
    rollNumber = usnMatch[0].toUpperCase().slice(-3);
  } else {
    const rollMatch = rawText.match(/\b(?:roll(?:\s*no|\s*number)?|usn|reg(?:istration)?(?:\s*no|\s*number)?|id\s*(?:no|number|#|:))\s*[:#=-]?\s*([A-Za-z0-9/-]{2,20})/i);
    if (rollMatch) {
      const val = rollMatch[1].trim().toUpperCase();
      if (!/(?:card|student|identity|valid|date|manipal)/i.test(val) && /\d/.test(val)) {
        const trailingDigits = val.match(/(\d{3,4})$/);
        if (trailingDigits) {
          rollNumber = trailingDigits[1];
        } else {
          const parts = val.split(/[/_-]/).filter(Boolean);
          rollNumber = parts[parts.length - 1].slice(-3);
        }
      }
    }

    if (!rollNumber) {
      const rollPatternMatch = rawText.match(/\b(?:\d{2}|20\d{2})[A-Za-z]{2,4}(\d{3,4})\b/i);
      if (rollPatternMatch) {
        rollNumber = rollPatternMatch[1];
      }
    }

    if (!rollNumber) {
      const longRegMatch = rawText.match(/\b20\d{2}[0-9]{5,8}\b/);
      if (longRegMatch) {
        rollNumber = longRegMatch[0].slice(-3);
      }
    }

    if (!rollNumber) {
      const contactMatch = rawText.match(/\b(?:contact|mobile|cell|phone)\s*[:#=-]?\s*([0-9]{6,12})/i);
      if (contactMatch) {
        rollNumber = contactMatch[1].slice(-3);
      } else {
        rollNumber = hashTo3Digits(`${collegeCode}_${departmentCode}_${studentName}`).slice(0, 3);
      }
    }
  }

  const confidence = (collegeFound ? 0.45 : 0.2) + (deptFound ? 0.35 : 0.2) + (usnMatch ? 0.2 : 0.15);

  return {
    collegeName,
    collegeCode: cleanSlug(collegeCode || 'COL', 6),
    department,
    departmentCode: cleanSlug(departmentCode || 'GEN', 6),
    rollNumber: cleanSlug(rollNumber || '001', 6),
    studentName,
    rawExtractedText: rawText.slice(0, 400),
    confidence: Math.min(0.99, Math.max(0.65, confidence)),
  };
}

export async function parseCollegeIdCard(
  input: File | { text?: string; name?: string; size?: number } | string,
  fallbackDisplayName = ''
): Promise<CollegeMetadata> {
  let cleanFileName = '';
  let extractedText = '';

  if (typeof input === 'string') {
    extractedText = input;
    cleanFileName = fallbackDisplayName;
  } else if (input && typeof (input as any).text === 'function') {
    const file = input as File;
    cleanFileName = (file.name || '').replace(/\.(pdf|png|jpe?g|webp|gif|txt)$/i, '').replace(/[._-]/g, ' ');
    extractedText = cleanFileName;
    try {
      const textBuffer = await file.text().catch(() => '');
      if (textBuffer && textBuffer.length > 10 && textBuffer.length < 50000) {
        extractedText += ' ' + textBuffer;
      }
    } catch { /* binary fallback */ }
  } else if (input && typeof input === 'object') {
    const obj = input as { text?: string; name?: string };
    cleanFileName = (obj.name || '').replace(/\.(pdf|png|jpe?g|webp|gif|txt)$/i, '').replace(/[._-]/g, ' ');
    extractedText = `${cleanFileName} ${obj.text || ''}`;
  }

  return parseCollegeCardFromText(extractedText, fallbackDisplayName);
}

export function isValidPinItId(id: string): boolean {
  return validatePinItId(id).valid;
}

export function validatePinItId(id: string): { valid: boolean; type: 'college' | 'global' | 'invalid'; error?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, type: 'invalid', error: 'PinIT ID cannot be empty' };
  }

  if (/[a-z]/.test(id)) {
    return { valid: false, type: 'invalid', error: 'PinIT ID must be strictly uppercase' };
  }

  const trimmed = id.trim().toUpperCase();

  if (trimmed.startsWith('PIN-GLB-')) {
    const globalRegex = /^PIN-GLB-[A-Z0-9]{2,12}-[0-9]{3,4}$/;
    if (globalRegex.test(trimmed)) {
      return { valid: true, type: 'global' };
    }
    return { valid: false, type: 'invalid', error: 'Global PinIT ID must end with 3 or 4 digits' };
  }

  const collegeRegex = /^PIN-[A-Z0-9]{2,6}-[A-Z0-9]{2,6}-[A-Z0-9]{1,6}$/;
  if (collegeRegex.test(trimmed)) {
    return { valid: true, type: 'college' };
  }

  return { valid: false, type: 'invalid', error: 'Invalid PinIT ID format (Expected: PIN-GLB-NAME-123 or PIN-COLLEGE-DEPT-042)' };
}
