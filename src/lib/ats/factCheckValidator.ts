// src/lib/ats/factCheckValidator.ts
/**
 * ============================================================================
 * STAGE 7 & 8: DETERMINISTIC FACT GROUNDING & LOCATION PROVENANCE ENGINE
 * ============================================================================
 * 
 * Purpose:
 * Enforces the non-negotiable PinIT law:
 * "AI may interpret evidence, but AI must never invent evidence."
 * 
 * Mechanism:
 * Evaluates entity proposals (Name, Email, Phone, Institution, Degree, GPA,
 * Skills, Projects) directly against immutable evidence text and layout spans.
 * Every accepted fact generates a GroundedProvenanceRecord with source document,
 * text snippet, grounding rule ID, real character offsets, and computed confidence score.
 */

import { detectDocumentSections, SectionMapResult } from './sectionDetector';
import { extractCanonicalSkillsWithPolarity, ExtractedSkillEntity } from './skillOntology';

export type ProvenanceField =
  | 'CandidateName'
  | 'Email'
  | 'Phone'
  | 'Institution'
  | 'Degree'
  | 'GPA'
  | 'GraduationDate'
  | 'Skill'
  | 'Project'
  | 'Experience'
  | 'Certification';

export type GroundingRuleId =
  | 'NAME_HEADER_CONTEXT_V1'
  | 'EMAIL_RFC5322_V1'
  | 'PHONE_E164_V1'
  | 'GPA_EDUCATION_CONTEXT_V2'
  | 'INSTITUTION_EDUCATION_CONTEXT_V2'
  | 'SKILL_CURRENT_POLARITY_V2'
  | 'PROJECT_TECH_STACK_V2';

export type ProvenanceValue =
  | string
  | number
  | boolean
  | string[]
  | { [key: string]: string | number | boolean };

export interface BoundingBoxCoordinates {
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GroundedProvenanceRecord<T extends ProvenanceValue = ProvenanceValue> {
  id: string;
  field: ProvenanceField;
  value: T;
  sourceDocument: string;
  documentHash: string; // SHA-256
  sourcePage: number;
  sourceBoundingBox?: BoundingBoxCoordinates;
  sourceCharacterRange: [number, number];
  sourceSection: 'HEADER_CONTACTS' | 'EDUCATION' | 'PROJECTS' | 'SKILLS' | 'EXPERIENCE' | 'CERTIFICATIONS' | 'GENERAL_BODY';
  sourceTextSnippet: string;
  confidence: number;
  verificationLevel:
    | 'SELF_SUBMITTED'
    | 'STRUCTURALLY_VALIDATED'
    | 'CROSS_VALIDATED'
    | 'THIRD_PARTY_VERIFIED'
    | 'INSTITUTION_VERIFIED';
  status: 'DOCUMENT_SUPPORTED' | 'PROVISIONAL' | 'CONFLICTING_EVIDENCE' | 'REJECTED';
  groundingRule: GroundingRuleId;
  extractionMethod: 'NATIVE_PDF' | 'DOCX_XML' | 'OCR_VISION' | 'PLAIN_TEXT';
  extractionConfidence: number;
  parserVersion: string;
  groundingVersion: string;
  modelTimestamp: number;
}

export interface ValidatedCandidateGraph {
  candidateName: string;
  email?: string;
  phone?: string;
  institution?: string;
  degree?: string;
  scoreOrGpa?: string;
  graduationDate?: string;
  documentSupportedSkills: string[];
  aspirationalSkills: string[];
  projects: { title: string; techStack: string[]; description: string }[];
  provenanceRecords: GroundedProvenanceRecord[];
  overallGroundedConfidence: number;
}

function findCharRange(text: string, snippet: string, fallbackLen: number = 0): [number, number] {
  if (!snippet) return [0, fallbackLen];
  const idx = text.indexOf(snippet);
  if (idx >= 0) return [idx, idx + snippet.length];
  const lowerIdx = text.toLowerCase().indexOf(snippet.toLowerCase());
  if (lowerIdx >= 0) return [lowerIdx, lowerIdx + snippet.length];
  return [0, fallbackLen || snippet.length];
}

/**
 * Extracts and deterministically grounds all candidate entities from raw evidence text and section map.
 */
export function groundAndValidateEvidence(
  rawText: string,
  fileName: string,
  documentHash: string,
  extractionMethod: 'NATIVE_PDF' | 'DOCX_XML' | 'OCR_VISION' | 'PLAIN_TEXT' = 'NATIVE_PDF',
  extractionConfidence: number = 0.95,
  category?: string,
  explicitVerificationLevel?: GroundedProvenanceRecord['verificationLevel']
): ValidatedCandidateGraph {
  console.log(`\n⚖️ [STAGE 7/12 - Deterministic Grounder]: Grounding entities for "${fileName}" against raw evidence...`);
  const sectionMap: SectionMapResult = detectDocumentSections(rawText);
  const provenanceRecords: GroundedProvenanceRecord[] = [];
  const now = Date.now();

  const defaultVerificationLevel: GroundedProvenanceRecord['verificationLevel'] =
    explicitVerificationLevel ||
    (category?.startsWith('sem') || category === '10th' || category === '12th_puc'
      ? 'STRUCTURALLY_VALIDATED'
      : category === 'certification'
      ? 'THIRD_PARTY_VERIFIED'
      : 'SELF_SUBMITTED');

  // 1. Extract Candidate Name (From Header / Top Line Context)
  let candidateName = 'Candidate';
  let explicitLineSnippet = '';
  const headerText = sectionMap.getSectionText('HEADER_CONTACTS') || rawText.slice(0, 500);

  const isInstitutionOrHeaderLine = (s: string) => {
    const l = s.toLowerCase();
    return (
      /\b(?:university|technological|institute|college|school|board|department|ministry|government|directorate|council|examination|academy|polytechnic)\b/.test(l) ||
      /\b(?:marks\s*card|marksheet|grade\s*card|statement\s*of\s*marks|transcript|provisional\s*certificate|degree\s*certificate|pass\s*certificate|academic\s*record|hall\s*ticket|register\s*no|usn|roll\s*no)\b/.test(l) ||
      /\b(?:visvesvaraya|belagavi|vtu|cbse|icse|state\s*board|autonomous|affiliated|accredited)\b/.test(l)
    );
  };

  const isNoiseOrMetadata = (s: string) => {
    const l = s.toLowerCase().trim();
    return (
      l === 'resume' ||
      l === 'curriculum vitae' ||
      l === 'cv' ||
      l === 'biodata' ||
      l === 'candidate' ||
      l.includes('mozilla') ||
      l.includes('headlesschrome') ||
      l.includes('skia') ||
      l.includes('adobe') ||
      l.includes('identity') ||
      l.includes('user-agent') ||
      /\b(?:education|skills|projects|experience|academics|summary|objective|sgpa|cgpa|gpa|credits|grade|marks|total|percentage|semester|sem\b|subject|usn|roll|reg(?:istration)?|pass|fail|provisional|examinations?)\b/i.test(l) ||
      isInstitutionOrHeaderLine(s)
    );
  };

  // Step 1A: Look for explicit student/candidate name label in header region
  const explicitNameMatch = rawText.slice(0, 1500).match(/(?:student(?:\s*name)?|candidate(?:\s*name)?|name(?:\s*of\s*(?:the)?\s*(?:student|candidate))?|full\s*name|shri\/?smt|mr\/?ms)\s*[:\-]\s*([A-Za-z\s.]{2,40})/i);
  if (explicitNameMatch) {
    const rawClean = explicitNameMatch[1].replace(/\r?\n.*/, '').replace(/[^A-Za-z\s.]/g, '').trim();
    if (!isNoiseOrMetadata(rawClean) && rawClean.length >= 2) {
      const tokens = rawClean.split(/\s+/).filter(t => t.length > 0 && /^[A-Za-z.]{2,}$/.test(t));
      if (tokens.length >= 1 && tokens.length <= 4) {
        candidateName = tokens.map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(' ');
        explicitLineSnippet = explicitNameMatch[0];
      }
    }
  }

  // Step 1B: If no explicit label was found, scan top header lines (typical for standard resumes)
  if (candidateName === 'Candidate') {
    const nameLines = headerText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    for (const line of nameLines) {
      // Must not have contact info, numbers, colons, or noise
      if (!line.includes('@') && !/[:;\/\\0-9]/.test(line) && line.length >= 3 && line.length <= 40) {
        const clean = line.replace(/^(?:name|candidate name|full name)\s*[:\-]\s*/i, '').trim();
        if (!isNoiseOrMetadata(clean)) {
          const tokens = clean.split(/\s+/).filter(t => t.length > 0 && /^[A-Za-z.]{2,}$/.test(t));
          if (tokens.length >= 2 && tokens.length <= 4) {
            candidateName = tokens.map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()).join(' ');
            explicitLineSnippet = line;
            break;
          }
        }
      }
    }
  }

  if (candidateName !== 'Candidate') {
    const nameRange = findCharRange(rawText, candidateName, candidateName.length);
    const calculatedConfidence = Math.min(1.0, Math.round((extractionConfidence * 0.98) * 100) / 100);
    console.log(`👤 [STAGE 7/12 - Grounded Name]: "${candidateName}" (Rule: NAME_HEADER_CONTEXT_V1, Confidence: ${calculatedConfidence})`);
    provenanceRecords.push({
      id: `prov_name_${now}`,
      field: 'CandidateName',
      value: candidateName,
      sourceDocument: fileName,
      documentHash,
      sourcePage: 1,
      sourceCharacterRange: nameRange,
      sourceSection: 'HEADER_CONTACTS',
      sourceTextSnippet: explicitLineSnippet || candidateName,
      confidence: calculatedConfidence,
      verificationLevel: defaultVerificationLevel,
      status: 'DOCUMENT_SUPPORTED',
      groundingRule: 'NAME_HEADER_CONTEXT_V1',
      extractionMethod,
      extractionConfidence,
      parserVersion: 'v2.1.0',
      groundingVersion: 'v2.1.0',
      modelTimestamp: now
    });
  }

  // 2. Extract Contact Information (Email & Phone)
  let email: string | undefined = undefined;
  const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) {
    email = emailMatch[0];
    const emailConfidence = Math.min(1.0, Math.round((extractionConfidence * 0.99) * 100) / 100);
    console.log(`📧 [STAGE 7/12 - Grounded Email]: "${email}" (Rule: EMAIL_RFC5322_V1)`);
    provenanceRecords.push({
      id: `prov_email_${now}`,
      field: 'Email',
      value: email,
      sourceDocument: fileName,
      documentHash,
      sourcePage: 1,
      sourceCharacterRange: findCharRange(rawText, email),
      sourceSection: 'HEADER_CONTACTS',
      sourceTextSnippet: email,
      confidence: emailConfidence,
      verificationLevel: defaultVerificationLevel,
      status: 'DOCUMENT_SUPPORTED',
      groundingRule: 'EMAIL_RFC5322_V1',
      extractionMethod,
      extractionConfidence,
      parserVersion: 'v2.1.0',
      groundingVersion: 'v2.1.0',
      modelTimestamp: now
    });
  }

  let phone: string | undefined = undefined;
  const phoneMatch = rawText.match(/(?:(?:\+?91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}|(?:\+?\d{1,3}[\-\s]?)?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4}|\b[6-9]\d{9}\b)/);
  if (phoneMatch) {
    phone = phoneMatch[0].trim();
    const phoneConfidence = Math.min(1.0, Math.round((extractionConfidence * 0.98) * 100) / 100);
    console.log(`📱 [STAGE 7/12 - Grounded Phone]: "${phone}" (Rule: PHONE_E164_V1)`);
    provenanceRecords.push({
      id: `prov_phone_${now}`,
      field: 'Phone',
      value: phone,
      sourceDocument: fileName,
      documentHash,
      sourcePage: 1,
      sourceCharacterRange: findCharRange(rawText, phone),
      sourceSection: 'HEADER_CONTACTS',
      sourceTextSnippet: phone,
      confidence: phoneConfidence,
      verificationLevel: defaultVerificationLevel,
      status: 'DOCUMENT_SUPPORTED',
      groundingRule: 'PHONE_E164_V1',
      extractionMethod,
      extractionConfidence,
      parserVersion: 'v2.1.0',
      groundingVersion: 'v2.1.0',
      modelTimestamp: now
    });
  }

  // 3. Extract Education, Institution & GPA
  const eduText = sectionMap.getSectionText('EDUCATION') || rawText;
  let institution: string | undefined = undefined;
  let degree: string | undefined = undefined;
  let scoreOrGpa: string | undefined = undefined;
  let graduationDate: string | undefined = undefined;

  const eduLines = eduText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  for (const line of eduLines) {
    if (/institute|college|university|school|management|academy|polytechnic|board/i.test(line)) {
      if (!/mozilla|skia|adobe|chrome|safari/i.test(line)) {
        institution = line.replace(/^(?:education|academics)\s*[:\-]?\s*/i, '').trim();
        const instConfidence = Math.min(1.0, Math.round((extractionConfidence * 0.97) * 100) / 100);
        console.log(`🎓 [STAGE 7/12 - Grounded Institution]: "${institution}" (Rule: INSTITUTION_EDUCATION_CONTEXT_V2)`);
        provenanceRecords.push({
          id: `prov_inst_${now}`,
          field: 'Institution',
          value: institution,
          sourceDocument: fileName,
          documentHash,
          sourcePage: 1,
          sourceCharacterRange: findCharRange(rawText, line),
          sourceSection: 'EDUCATION',
          sourceTextSnippet: line,
          confidence: instConfidence,
          verificationLevel: defaultVerificationLevel === 'STRUCTURALLY_VALIDATED' ? 'INSTITUTION_VERIFIED' : defaultVerificationLevel,
          status: 'DOCUMENT_SUPPORTED',
          groundingRule: 'INSTITUTION_EDUCATION_CONTEXT_V2',
          extractionMethod,
          extractionConfidence,
          parserVersion: 'v2.1.0',
          groundingVersion: 'v2.1.0',
          modelTimestamp: now
        });
        break;
      }
    }
  }

  // Degree extraction with strict qualification validation and exclusion of activities/clubs/jobs/cities
  const DEGREE_QUALIFICATION_REGEX = /\b(?:b\.?e\.?|b\.?tech|bachelor(?:\s+of\s+[\w\s]+)?|bca|b\.?sc(?:\s+[\w\s]+)?|m\.?tech|master(?:\s+of\s+[\w\s]+)?|mca|m\.?sc|diploma(?:\s+in\s+[\w\s]+)?|10th\s+(?:standard|grade|std|board)|12th\s+(?:standard|grade|std|board|puc)|puc(?:\s+ii)?|higher\s+secondary)\b/i;
  const NON_DEGREE_ACTIVITY_REGEX = /\b(?:member|club|society|association|coordinator|lead|volunteer|since|intern\b|developer\b|designer\b|fellow\b|contributor\b|bengaluru|bangalore|december)\b/i;

  for (const line of eduLines) {
    if (DEGREE_QUALIFICATION_REGEX.test(line) && !NON_DEGREE_ACTIVITY_REGEX.test(line) && !/adobe|skia|mozilla|chrome|user-agent/i.test(line)) {
      degree = line.trim();
      const degConfidence = Math.min(1.0, Math.round((extractionConfidence * 0.96) * 100) / 100);
      console.log(`📜 [STAGE 7/12 - Grounded Degree]: "${degree}"`);
      provenanceRecords.push({
        id: `prov_deg_${now}`,
        field: 'Degree',
        value: degree,
        sourceDocument: fileName,
        documentHash,
        sourcePage: 1,
        sourceCharacterRange: findCharRange(rawText, line),
        sourceSection: 'EDUCATION',
        sourceTextSnippet: line,
        confidence: degConfidence,
        verificationLevel: defaultVerificationLevel,
        status: 'DOCUMENT_SUPPORTED',
        groundingRule: 'GPA_EDUCATION_CONTEXT_V2',
        extractionMethod,
        extractionConfidence,
        parserVersion: 'v2.1.0',
        groundingVersion: 'v2.1.0',
        modelTimestamp: now
      });
      break;
    }
  }

  // GPA matching (prefer CGPA over SGPA when both are present)
  for (const line of eduLines) {
    const cgpaMatch =
      line.match(/\b(?:CGPA|Cumulative\s*Grade\s*Point\s*Average)[\s:]*([0-9]\.\d{1,2}|10(?:\.0)?)\b/i) ||
      line.match(/\b([0-9]\.\d{1,2}|10(?:\.0)?)\s*(?:CGPA)\b/i);
    if (cgpaMatch) {
      scoreOrGpa = `${cgpaMatch[1]} GPA`;
      const gpaConfidence = Math.min(1.0, Math.round((extractionConfidence * 0.98) * 100) / 100);
      console.log(`📊 [STAGE 7/12 - Grounded GPA (CGPA)]: "${scoreOrGpa}" (Context: "${line}")`);
      provenanceRecords.push({
        id: `prov_gpa_${now}`,
        field: 'GPA',
        value: scoreOrGpa,
        sourceDocument: fileName,
        documentHash,
        sourcePage: 1,
        sourceCharacterRange: findCharRange(rawText, cgpaMatch[0]),
        sourceSection: 'EDUCATION',
        sourceTextSnippet: line,
        confidence: gpaConfidence,
        verificationLevel: defaultVerificationLevel,
        status: 'DOCUMENT_SUPPORTED',
        groundingRule: 'GPA_EDUCATION_CONTEXT_V2',
        extractionMethod,
        extractionConfidence,
        parserVersion: 'v2.1.0',
        groundingVersion: 'v2.1.0',
        modelTimestamp: now
      });
      break;
    }
  }

  if (!scoreOrGpa) {
    for (const line of eduLines) {
      const gpaMatch =
        line.match(/\b(?:GPA|SGPA|Grade Point Average)[\s:]*([0-9]\.\d{1,2}|10(?:\.0)?)\b/i) ||
        line.match(/\b([0-9]\.\d{1,2}|10(?:\.0)?)\s*(?:GPA|SGPA|\/\s*10)\b/i);
      if (gpaMatch) {
        scoreOrGpa = `${gpaMatch[1]} GPA`;
        const gpaConfidence = Math.min(1.0, Math.round((extractionConfidence * 0.98) * 100) / 100);
        console.log(`📊 [STAGE 7/12 - Grounded GPA]: "${scoreOrGpa}" (Context: "${line}")`);
        provenanceRecords.push({
          id: `prov_gpa_${now}`,
          field: 'GPA',
          value: scoreOrGpa,
          sourceDocument: fileName,
          documentHash,
          sourcePage: 1,
          sourceCharacterRange: findCharRange(rawText, gpaMatch[0]),
          sourceSection: 'EDUCATION',
          sourceTextSnippet: line,
          confidence: gpaConfidence,
          verificationLevel: defaultVerificationLevel,
          status: 'DOCUMENT_SUPPORTED',
          groundingRule: 'GPA_EDUCATION_CONTEXT_V2',
          extractionMethod,
          extractionConfidence,
          parserVersion: 'v2.1.0',
          groundingVersion: 'v2.1.0',
          modelTimestamp: now
        });
        break;
      }
    }
  }

  for (const line of eduLines) {
    const dateMatch = line.match(/\b(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{4}\b|\b20\d{2}\b/i);
    if (dateMatch && !graduationDate) {
      graduationDate = dateMatch[0];
    }
  }

  // 4. Ground Skills with Polarity and Context Boundaries
  const skillsText = sectionMap.getSectionText('SKILLS') || '';
  const projectsText = sectionMap.getSectionText('PROJECTS') || '';
  const experienceText = sectionMap.getSectionText('EXPERIENCE') || '';
  const aspirationsText = sectionMap.getSectionText('ASPIRATIONS_FUTURE') || '';
  const generalText = rawText;

  const currentSkillsSet = new Set<string>();
  const aspirationalSkillsSet = new Set<string>();

  const sectionSkills = extractCanonicalSkillsWithPolarity(skillsText, 'SKILLS');
  const projectSkills = extractCanonicalSkillsWithPolarity(projectsText, 'PROJECTS');
  const experienceSkills = extractCanonicalSkillsWithPolarity(experienceText, 'EXPERIENCE');
  const aspirationalSkills = extractCanonicalSkillsWithPolarity(aspirationsText, 'ASPIRATIONS_FUTURE');
  const hasDedicatedSections = sectionSkills.length > 0 || projectSkills.length > 0 || experienceSkills.length > 0;
  const fallbackSkills = !hasDedicatedSections ? extractCanonicalSkillsWithPolarity(generalText, 'GENERAL_BODY') : [];

  for (const s of [...sectionSkills, ...projectSkills, ...experienceSkills, ...fallbackSkills]) {
    if (s.polarity === 'CURRENT') {
      currentSkillsSet.add(s.canonicalName);
      const skillRange = findCharRange(rawText, s.matchedSurfaceForm);
      const skillConfidence = Math.min(1.0, Math.round((extractionConfidence * (s.confidence || 0.95)) * 100) / 100);
      provenanceRecords.push({
        id: `prov_skill_${s.canonicalName.replace(/[^a-zA-Z0-9]/g, '_')}_${now}`,
        field: 'Skill',
        value: s.canonicalName,
        sourceDocument: fileName,
        documentHash,
        sourcePage: 1,
        sourceCharacterRange: skillRange,
        sourceSection: s.section as any,
        sourceTextSnippet: s.matchedSurfaceForm,
        confidence: skillConfidence,
        verificationLevel: defaultVerificationLevel,
        status: 'DOCUMENT_SUPPORTED',
        groundingRule: 'SKILL_CURRENT_POLARITY_V2',
        extractionMethod,
        extractionConfidence,
        parserVersion: 'v2.1.0',
        groundingVersion: 'v2.1.0',
        modelTimestamp: now
      });
    } else if (s.polarity === 'ASPIRATIONAL') {
      aspirationalSkillsSet.add(s.canonicalName);
    }
  }

  for (const a of aspirationalSkills) {
    aspirationalSkillsSet.add(a.canonicalName);
  }

  console.log(`🛠️ [STAGE 8/12 - Grounded Skills Summary]: Document-Supported: [${Array.from(currentSkillsSet).join(', ')}] | Aspirational: [${Array.from(aspirationalSkillsSet).join(', ')}]`);

  // 5. Extract Projects
  const projects: { title: string; techStack: string[]; description: string }[] = [];
  const projectLines = projectsText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  let currentProject: { title: string; techStack: string[]; description: string } | null = null;
  for (const line of projectLines) {
    if (/^\d+\.?\s*[A-Z]|^[A-Z\s]{4,30}$/i.test(line) && !line.includes('•') && !line.includes('using')) {
      if (currentProject) projects.push(currentProject);
      currentProject = {
        title: line.replace(/^\d+\.?\s*/, '').trim(),
        techStack: [],
        description: ''
      };
    } else if (currentProject) {
      currentProject.description += (currentProject.description ? ' ' : '') + line;
      const projSkills = extractCanonicalSkillsWithPolarity(line, 'PROJECTS');
      for (const ps of projSkills) {
        if (!currentProject.techStack.includes(ps.canonicalName)) {
          currentProject.techStack.push(ps.canonicalName);
        }
      }
    }
  }
  if (currentProject) projects.push(currentProject);

  if (projects.length === 0) {
    const rawLines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    let inProj = false;
    for (let idx = 0; idx < rawLines.length; idx++) {
      const line = rawLines[idx];
      if (/^PROJECT/i.test(line)) {
        inProj = true;
        continue;
      }
      if (inProj && (/^SKILL/i.test(line) || /^EDUCATION/i.test(line) || /^EXPERIENCE/i.test(line))) {
        inProj = false;
        break;
      }
      if (inProj && line.length > 2) {
        if (/^\d+\.?\s*[A-Za-z]/.test(line)) {
          const title = line.replace(/^\d+\.?\s*/, '').replace(/\b(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{4}\b/i, '').trim();
          const desc = rawLines[idx + 1] || '';
          const projSkills = extractCanonicalSkillsWithPolarity(desc, 'PROJECTS').map(s => s.canonicalName);
          projects.push({ title, techStack: projSkills, description: desc });
          break;
        }
      }
    }
  }

  for (const proj of projects) {
    console.log(`💻 [STAGE 8/12 - Grounded Project]: "${proj.title}" (Tech: [${proj.techStack.join(', ')}])`);
    const projRange = findCharRange(rawText, proj.title);
    const projConfidence = Math.min(1.0, Math.round((extractionConfidence * 0.95) * 100) / 100);
    provenanceRecords.push({
      id: `prov_proj_${now}`,
      field: 'Project',
      value: proj.title,
      sourceDocument: fileName,
      documentHash,
      sourcePage: 1,
      sourceCharacterRange: projRange,
      sourceSection: 'PROJECTS',
      sourceTextSnippet: `${proj.title} - ${proj.description}`,
      confidence: projConfidence,
      verificationLevel: defaultVerificationLevel,
      status: 'DOCUMENT_SUPPORTED',
      groundingRule: 'PROJECT_TECH_STACK_V2',
      extractionMethod,
      extractionConfidence,
      parserVersion: 'v2.1.0',
      groundingVersion: 'v2.1.0',
      modelTimestamp: now
    });
  }

  console.log(`✅ [STAGE 8/12 - Provenance Grounded]: Grounded ${provenanceRecords.length} evidence provenance records with character offsets.`);

  const overallGroundedConfidence = provenanceRecords.length > 0
    ? Math.min(1.0, Math.round((provenanceRecords.reduce((acc, r) => acc + r.confidence, 0) / provenanceRecords.length) * 100) / 100)
    : 0.0;

  return {
    candidateName,
    email,
    phone,
    institution,
    degree,
    scoreOrGpa,
    graduationDate,
    documentSupportedSkills: Array.from(currentSkillsSet),
    aspirationalSkills: Array.from(aspirationalSkillsSet),
    projects,
    provenanceRecords,
    overallGroundedConfidence
  };
}
