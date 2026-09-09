// src/lib/ats/sectionDetector.ts
/**
 * ============================================================================
 * STAGE 5: SECTION & LAYOUT REGION DETECTOR
 * ============================================================================
 * 
 * Purpose:
 * Analyzes unstructured multi-line document evidence and tags distinct functional
 * regions (HEADER_CONTACTS, EDUCATION, SKILLS, PROJECTS, EXPERIENCE, ASPIRATIONS_FUTURE).
 * 
 * Critical Role:
 * Allows the grounding engine to enforce context boundaries. For instance, skills
 * listed in an "ASPIRATIONS / INTERESTED IN LEARNING" section are tagged as ASPIRATIONAL
 * and will NEVER be admitted into the student's current verified capabilities!
 */

export type DocumentSectionTag =
  | 'HEADER_CONTACTS'
  | 'EDUCATION'
  | 'EXPERIENCE'
  | 'PROJECTS'
  | 'SKILLS'
  | 'ASPIRATIONS_FUTURE'
  | 'CERTIFICATIONS'
  | 'GENERAL_BODY';

export interface TaggedDocumentSpan {
  section: DocumentSectionTag;
  text: string;
  charStart: number;
  charEnd: number;
}

export interface SectionMapResult {
  spans: TaggedDocumentSpan[];
  sectionsPresent: DocumentSectionTag[];
  getSectionText: (section: DocumentSectionTag) => string;
}

const SECTION_HEADER_PATTERNS: { section: DocumentSectionTag; regex: RegExp }[] = [
  {
    section: 'ASPIRATIONS_FUTURE',
    regex: /^(?:interested\s+in\s+learning|future\s+skills|aspirations|learning\s+goals|to\s+learn|interests)(?:\s*[:\-])?/i
  },
  {
    section: 'SKILLS',
    regex: /^(?:technical\s+skills|skills\s*(?:&|and)?\s*abilities|core\s+competencies|technologies|skills|proficiencies|tech\s+stack)(?:\s*[:\-])?/i
  },
  {
    section: 'EDUCATION',
    regex: /^(?:education|academic\s+background|academics|qualifications|degrees|educational\s+history|university\s+education)(?:\s*[:\-])?/i
  },
  {
    section: 'PROJECTS',
    regex: /^(?:projects|academic\s+projects|personal\s+projects|key\s+projects|selected\s+projects|project\s+work)(?:\s*[:\-])?/i
  },
  {
    section: 'EXPERIENCE',
    regex: /^(?:work\s+experience|experience|employment\s+history|internships|professional\s+experience|career\s+history)(?:\s*[:\-])?/i
  },
  {
    section: 'CERTIFICATIONS',
    regex: /^(?:certifications|licenses\s*(?:&|and)?\s*certifications|certificates|courses\s*(?:&|and)?\s*certifications|achievements)(?:\s*[:\-])?/i
  }
];

/**
 * Detects section layout boundaries across multi-line extracted text.
 * Returns mapped spans and quick section lookup helper.
 */
export function detectDocumentSections(rawText: string): SectionMapResult {
  console.log(`\n📑 [STAGE 5/12 - Section Detector]: Mapping document layout regions...`);
  const lines = rawText.split(/\r?\n/);
  const spans: TaggedDocumentSpan[] = [];
  let currentSection: DocumentSectionTag = 'HEADER_CONTACTS';
  let currentBuffer: string[] = [];
  let charOffset = 0;
  let spanStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      charOffset += lines[i].length + 1;
      continue;
    }

    // Check if this line matches a section heading
    let matchedHeading: DocumentSectionTag | null = null;
    for (const { section, regex } of SECTION_HEADER_PATTERNS) {
      if (regex.test(line)) {
        matchedHeading = section;
        break;
      }
    }

    if (matchedHeading) {
      if (currentBuffer.length > 0) {
        spans.push({
          section: currentSection,
          text: currentBuffer.join('\n'),
          charStart: spanStart,
          charEnd: charOffset
        });
        currentBuffer = [];
      }
      currentSection = matchedHeading;
      spanStart = charOffset;
      const stripped = line.replace(/^[A-Za-z\s&/]+[:\-]\s*/, '').trim();
      if (stripped.length > 0 && stripped !== line) {
        currentBuffer.push(stripped);
      }
    } else {
      currentBuffer.push(line);
    }

    charOffset += lines[i].length + 1;
  }

  if (currentBuffer.length > 0) {
    spans.push({
      section: currentSection,
      text: currentBuffer.join('\n'),
      charStart: spanStart,
      charEnd: charOffset
    });
  }

  const sectionsPresent = Array.from(new Set(spans.map(s => s.section)));
  console.log(`✅ [STAGE 5/12 - Sections Identified]: [${sectionsPresent.join(', ')}] (${spans.length} discrete layout spans).`);

  return {
    spans,
    sectionsPresent,
    getSectionText: (sec: DocumentSectionTag) => {
      return spans
        .filter(s => s.section === sec)
        .map(s => s.text)
        .join('\n');
    }
  };
}
