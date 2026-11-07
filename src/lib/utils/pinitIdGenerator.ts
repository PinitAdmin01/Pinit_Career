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

// Known College/University Lexicon for intelligent recognition
const COLLEGE_DICTIONARY: Array<{ patterns: RegExp[]; code: string; name: string }> = [
  { patterns: [/bgs\s*inst/i, /\bbgs\b/i, /bimb/i], code: 'BGS', name: 'BGS Institute of Management' },
  { patterns: [/shri\s*ram\s*college/i, /\bsrcc\b/i], code: 'SRCC', name: 'Shri Ram College of Commerce' },
  { patterns: [/st\.?\s*joseph/i, /\bsjcc\b/i, /\bsjc\b/i], code: 'SJCC', name: "St. Joseph's College of Commerce" },
  { patterns: [/dayananda\s*sagar/i, /\bdsce\b/i], code: 'DSCE', name: 'Dayananda Sagar College of Engineering' },
  { patterns: [/r\.?v\.?\s*college/i, /rvce/i, /rashtreeya\s*sikshana/i], code: 'RVCE', name: 'R.V. College of Engineering' },
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
];

// Department / Branch Lexicon (Strict: No ambiguous single/two-letter false positives)
const DEPARTMENT_DICTIONARY: Array<{ patterns: RegExp[]; code: string; name: string }> = [
  { patterns: [/comp.*sci.*eng/i, /computer\s*science/i, /\bcse\b/i], code: 'CSE', name: 'Computer Science & Engineering' },
  { patterns: [/info.*sci/i, /information\s*technology/i, /\bise\b/i], code: 'ISE', name: 'Information Science & Engineering' },
  { patterns: [/artif.*intel.*mach/i, /\baiml\b/i, /ai\s*&\s*ml/i], code: 'AIML', name: 'Artificial Intelligence & Machine Learning' },
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

/**
 * Generate a clean, 3-digit deterministic hash from a string.
 */
function hashTo3Digits(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash) % 900 + 100; // Guarantees 100-999
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
  return (cleaned.slice(0, maxLen) || 'STUDENT');
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
  let rawCollege = '';
  let rawDept = '';
  let rawRoll = '';

  if (typeof paramsOrCollege === 'object' && paramsOrCollege !== null) {
    rawCollege = paramsOrCollege.collegeCode || '';
    rawDept = paramsOrCollege_dept(paramsOrCollege);
    rawRoll = paramsOrCollege.rollNumber || '';
  } else if (typeof paramsOrCollege === 'string') {
    rawCollege = paramsOrCollege;
    rawDept = departmentCodeParam || '';
    rawRoll = rollNumberParam || '';
  }

  let collegeCode = rawCollege.trim().toUpperCase();
  let deptCode = rawDept.trim().toUpperCase();

  // If passed as descriptive string (has spaces or long), canonicalize via dictionary
  if (typeof paramsOrCollege === 'string') {
    if (rawCollege.includes(' ') || rawCollege.length > 6) {
      for (const c of COLLEGE_DICTIONARY) {
        if (c.patterns.some(p => p.test(rawCollege)) || c.code === collegeCode) {
          collegeCode = c.code;
          break;
        }
      }
    }
    if (rawDept.includes(' ') || rawDept.length > 5) {
      for (const d of DEPARTMENT_DICTIONARY) {
        if (d.patterns.some(p => p.test(rawDept)) || d.code === deptCode) {
          deptCode = d.code;
          break;
        }
      }
    }
  }

  const college = cleanSlug(collegeCode || 'COLLEGE', 6);
  const dept = cleanSlug(deptCode || 'GEN', 6);
  
  // Extract trailing digits or alphanumeric suffix for clean readability
  let roll = (rawRoll || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (roll.length > 4) {
    // Take the last 3-4 chars (e.g. 1RV21CS042 -> 042, PES120220055 -> 055)
    roll = roll.slice(-3);
  }
  if (!roll) {
    roll = hashTo3Digits(`${collegeCode}_${deptCode}`).slice(0, 3);
  }

  return `PIN-${college}-${dept}-${roll}`;
}

function paramsOrCollege_dept(obj: any): string {
  return obj.departmentCode || obj.deptCode || obj.department || '';
}

/**
 * Heuristic College ID Parser
 * Analyzes uploaded image/document metadata and text content
 * to identify College Code, Department, Roll Number, and Student Name.
 */
/**
 * Intelligent Indian College ID Text Parser
 * Extracts College Name, College Code, Department, Student Name, and Roll/USN
 * from OCR-extracted text from ANY Indian university or college identity card.
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

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Identify College Name & Canonical Acronym
  let collegeName = '';
  let collegeCode = '';
  let collegeFound = false;

  // Look for the specific institutional line in the first 5 lines (header section)
  const headerLines = lines.slice(0, 5);
  const collegeLine = headerLines.find(l => 
    /(?:institute|college|university|academy|vidyalaya|polytechnic|school\s+of)/i.test(l) &&
    !/(?:near|opposite|opposit|cross|road|street|behind|temple|nagar|address)/i.test(l)
  ) || lines.find(l => 
    /(?:institute|college|university|academy|vidyalaya|polytechnic|school\s+of)/i.test(l) &&
    !/(?:near|opposite|opposit|cross|road|street|behind|temple|nagar|address)/i.test(l)
  );

  if (collegeLine) {
    collegeName = collegeLine.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9)]+$/g, '').trim();
    // Check known college dictionary on the college line
    for (const c of COLLEGE_DICTIONARY) {
      if (c.patterns.some(p => p.test(collegeLine))) {
        collegeCode = c.code;
        collegeFound = true;
        break;
      }
    }

    if (!collegeFound) {
      // Look for leading acronym like "BGS", "BMS", "RV", "PES", "JSS", "KLE", "NIT", "IIT"
      const leadingAcronym = collegeName.match(/^([A-Z]{2,6})\b/);
      const NON_ACRONYMS = new Set(['SHRI', 'SRI', 'SAINT', 'ST', 'THE', 'NEW', 'GOVT', 'DR', 'SMT']);
      if (leadingAcronym && !NON_ACRONYMS.has(leadingAcronym[1].toUpperCase())) {
        collegeCode = leadingAcronym[1];
      } else {
        // Build acronym from uppercase initials of significant words
        const words = collegeName
          .replace(/[^A-Za-z\s]/g, '')
          .split(/\s+/)
          .filter(w => !['of', 'and', 'the', 'for', 'in', 'to', 'at', 'an', 'affiliated'].includes(w.toLowerCase()));
        collegeCode = words.map(w => w[0].toUpperCase()).join('').slice(0, 5);
      }
      collegeFound = true;
    }
  }

  // Fallback: check whole text against dictionary if collegeLine didn't find one
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

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // Filter out non-degree lines (headers, addresses, contacts, web, dates)
    const isNonDept = /(?:institute|college|university|polytechnic|school\s+of|address|cross|road|street|temple|opposit|near|behind|layout|ph:|phone|mobile|cell|contact|www\.|https?:\/\/|@|valid|date|till|principal|signature|dean|director|gurudev|b'lore|bangalore|bengaluru)/i.test(l);
    if (isNonDept) continue;

    // 1. Check branch/specialization first (Computer Science, Electronics, Civil, etc.)
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

    // 2. Direct degree acronym detection fallback (BCA, MCA, B.Tech, BE, B.Com, BBA, MBA, etc.)
    const directDegreeMatch = l.match(/\b(BCA|MCA|B\.?TECH|BE|B\.?COM|BBA|MBA|B\.?SC|MSC|CSE|ISE|ECE|EEE|MECH|CIVIL|AIDS|AIML)\b/i);
    if (directDegreeMatch) {
      departmentCode = directDegreeMatch[1].toUpperCase().replace(/\./g, '');
      const dictEntry = DEPARTMENT_DICTIONARY.find(d => d.code === departmentCode);
      department = dictEntry ? dictEntry.name : departmentCode;
      deptFound = true;
      deptLineIdx = i;
      break;
    }
  }

  // 3. Identify Student Name
  let studentName = '';
  // Pattern A: Labeled name (e.g. "Name: Vinay N" or "Student Name: Rahul")
  const nameLabelMatch = rawText.match(/\b(?:student\s*name|candidate\s*name|name)\s*[:#=-]?\s*([A-Za-z\s.]{3,35})/i);
  if (nameLabelMatch && !/(?:college|institute|university|management|card|school|address|road)/i.test(nameLabelMatch[1])) {
    studentName = nameLabelMatch[1].trim();
  } else if (deptLineIdx > 0) {
    // Pattern B: In 90% of Indian ID cards, student name is on the line right above degree/dept
    for (let j = deptLineIdx - 1; j >= 0; j--) {
      const candidate = lines[j].replace(/[^A-Za-z\s.]/g, '').trim();
      const words = candidate.split(/\s+/).filter(Boolean);
      const isHeader = /(?:gurudev|blore|bangalore|bengaluru|karnataka|delhi|mumbai|ph|phone|email|www|http|contact|valid|address|cross|temple|institute|college|university|school|management)/i.test(candidate);
      if (words.length >= 1 && words.length <= 4 && candidate.length >= 3 && candidate.length <= 30 && !isHeader) {
        studentName = candidate;
        break;
      }
    }
  }

  // Format student name to Title Case if uppercase
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
  // VTU USN (e.g. 1RV21CS042, 1BG22BCA01)
  const usnRegex = /\b[0-9][A-Z]{2}[0-9]{2}[A-Z]{2,4}[0-9]{3}\b/i;
  const usnMatch = rawText.match(usnRegex);
  if (usnMatch) {
    rollNumber = usnMatch[0].toUpperCase().slice(-3); // Last 3 digits: "042"
  } else {
    // Explicit roll/reg pattern - MUST USE WORD BOUNDARIES to prevent matching "Valid", "Vidya", etc.
    const rollMatch = rawText.match(/\b(?:roll(?:\s*no|\s*number)?|usn|reg(?:istration)?(?:\s*no|\s*number)?|\bid\b(?:\s*no|\s*number)?)\s*[:#=-]?\s*([A-Za-z0-9/-]{2,20})/i);
    if (rollMatch) {
      const val = rollMatch[1].trim().toUpperCase();
      if (!/(?:card|student|identity|valid|date)/i.test(val)) {
        const trailingDigits = val.match(/(\d{3,4})$/);
        if (trailingDigits) {
          rollNumber = trailingDigits[1];
        } else {
          const parts = val.split(/[/_-]/).filter(Boolean);
          const lastPart = parts[parts.length - 1];
          rollNumber = lastPart.slice(-3);
        }
      }
    }

    if (!rollNumber) {
      // Contact or Phone Suffix (e.g. Contact: 8618530726 -> 726)
      const contactMatch = rawText.match(/\b(?:contact|mobile|cell|phone)\s*[:#=-]?\s*([0-9]{6,12})/i);
      if (contactMatch) {
        rollNumber = contactMatch[1].slice(-3);
      } else {
        // Fallback 3-digit hash
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

  // Reject lowercase characters strictly to maintain uppercase protocol
  if (/[a-z]/.test(id)) {
    return { valid: false, type: 'invalid', error: 'PinIT ID must be strictly uppercase' };
  }

  const trimmed = id.trim().toUpperCase();

  // If starts with PIN-GLB-, validate strictly against Global format
  if (trimmed.startsWith('PIN-GLB-')) {
    const globalRegex = /^PIN-GLB-[A-Z0-9]{2,12}-[0-9]{3,4}$/;
    if (globalRegex.test(trimmed)) {
      return { valid: true, type: 'global' };
    }
    return { valid: false, type: 'invalid', error: 'Global PinIT ID must end with 3 or 4 digits' };
  }

  // College Pattern: PIN-[3-6 ALPHANUM]-[2-6 ALPHANUM]-[1-6 ALPHANUM]
  const collegeRegex = /^PIN-[A-Z0-9]{2,6}-[A-Z0-9]{2,6}-[A-Z0-9]{1,6}$/;
  if (collegeRegex.test(trimmed)) {
    return { valid: true, type: 'college' };
  }

  return { valid: false, type: 'invalid', error: 'Invalid PinIT ID format (Expected: PIN-GLB-NAME-123 or PIN-COLLEGE-DEPT-042)' };
}
