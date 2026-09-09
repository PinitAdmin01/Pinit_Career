// src/lib/ats/skillOntology.ts
/**
 * ============================================================================
 * STAGE 6: CANONICAL SKILL ONTOLOGY, POLARITY & EVIDENCE STRENGTH ENGINE
 * ============================================================================
 * 
 * Purpose:
 * Normalizes variations of technical skills (e.g. "js", "javascript", "es6" -> "JavaScript")
 * while enforcing strict word-boundary matching and contextual polarity.
 * 
 * Why this is critical:
 * 1. Prevents substring traps: Random stream bytes like `/TS`, `s3`, `http` will NEVER
 *    falsely trigger "TypeScript", "AWS Cloud", or "Computer Networks".
 * 2. Distinct Technologies: Enforces React != Next.js, Node.js != Express.
 * 3. Polarity Filtering: Distinguishes CURRENT vs ASPIRATIONAL vs NEGATED skills.
 */

export type SkillPolarity = 'CURRENT' | 'ASPIRATIONAL' | 'NEGATED';

export type SkillEvidenceStrength =
  | 'EXPERT_CLAIM'
  | 'EXPERIENCE'
  | 'PROJECT_USAGE'
  | 'EXPOSURE'
  | 'ASSESSMENT_VERIFIED';

export interface ExtractedSkillEntity {
  canonicalName: string;
  matchedSurfaceForm: string;
  polarity: SkillPolarity;
  evidenceStrength: SkillEvidenceStrength;
  section: string;
  confidence: number;
}

export interface CanonicalSkillDefinition {
  canonical: string;
  category: 'languages' | 'frameworks' | 'databases' | 'cloud_devops' | 'tools' | 'core_cs';
  aliases: string[];
}

export const CANONICAL_SKILL_LEXICON: CanonicalSkillDefinition[] = [
  // Programming Languages
  { canonical: 'Python', category: 'languages', aliases: ['python', 'py', 'python3'] },
  { canonical: 'JavaScript', category: 'languages', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
  { canonical: 'TypeScript', category: 'languages', aliases: ['typescript', 'ts'] },
  { canonical: 'Java', category: 'languages', aliases: ['java', 'jdk', 'jvm', 'j2ee'] },
  { canonical: 'C++', category: 'languages', aliases: ['c++', 'cpp'] },
  { canonical: 'C Programming', category: 'languages', aliases: ['c language', 'ansi c'] },
  { canonical: 'Go', category: 'languages', aliases: ['golang', 'go lang'] },
  { canonical: 'Rust', category: 'languages', aliases: ['rust'] },
  { canonical: 'SQL', category: 'languages', aliases: ['sql', 'structured query language'] },
  { canonical: 'HTML5 & CSS3', category: 'languages', aliases: ['html', 'html5', 'css', 'css3', 'html/css'] },

  // Frameworks & Libraries (Distinct Entities)
  { canonical: 'React', category: 'frameworks', aliases: ['react', 'reactjs', 'react.js'] },
  { canonical: 'Next.js', category: 'frameworks', aliases: ['nextjs', 'next.js', 'next'] },
  { canonical: 'Node.js', category: 'frameworks', aliases: ['nodejs', 'node.js', 'node'] },
  { canonical: 'Express', category: 'frameworks', aliases: ['express', 'expressjs', 'express.js'] },
  { canonical: 'Django', category: 'frameworks', aliases: ['django'] },
  { canonical: 'FastAPI', category: 'frameworks', aliases: ['fastapi', 'fast-api'] },
  { canonical: 'Flask', category: 'frameworks', aliases: ['flask'] },
  { canonical: 'Spring Boot', category: 'frameworks', aliases: ['springboot', 'spring-boot', 'spring framework'] },
  { canonical: 'Tailwind CSS', category: 'frameworks', aliases: ['tailwind', 'tailwindcss'] },

  // Databases & Storage
  { canonical: 'PostgreSQL', category: 'databases', aliases: ['postgresql', 'postgres', 'psql'] },
  { canonical: 'MySQL', category: 'databases', aliases: ['mysql'] },
  { canonical: 'MongoDB', category: 'databases', aliases: ['mongodb', 'mongo'] },
  { canonical: 'Redis', category: 'databases', aliases: ['redis'] },
  { canonical: 'Supabase', category: 'databases', aliases: ['supabase'] },

  // Cloud & DevOps
  { canonical: 'AWS Cloud', category: 'cloud_devops', aliases: ['aws', 'amazon web services', 'ec2', 's3 bucket', 'aws lambda'] },
  { canonical: 'Docker', category: 'cloud_devops', aliases: ['docker', 'containerization'] },
  { canonical: 'Kubernetes', category: 'cloud_devops', aliases: ['kubernetes', 'k8s'] },
  { canonical: 'CI/CD', category: 'cloud_devops', aliases: ['ci/cd', 'github actions', 'jenkins', 'pipeline'] },
  { canonical: 'Git & GitHub', category: 'tools', aliases: ['git', 'github', 'gitlab', 'version control'] },

  // Core Computer Science
  { canonical: 'Data Structures & Algorithms', category: 'core_cs', aliases: ['dsa', 'data structures', 'algorithms'] },
  { canonical: 'System Design', category: 'core_cs', aliases: ['system design', 'microservices', 'distributed systems'] },
  { canonical: 'Computer Networks', category: 'core_cs', aliases: ['computer networks', 'tcp/ip', 'http protocol', 'dns networking'] },
  { canonical: 'Operating Systems', category: 'core_cs', aliases: ['operating systems', 'linux', 'unix system'] },
  { canonical: 'DBMS', category: 'core_cs', aliases: ['dbms', 'database management systems', 'rdbms'] }
];

/**
 * Normalizes and extracts canonical skills from text with strict word-boundary checks and polarity detection.
 */
export function extractCanonicalSkillsWithPolarity(
  text: string,
  sectionTag: string = 'GENERAL_BODY'
): ExtractedSkillEntity[] {
  const results: ExtractedSkillEntity[] = [];
  const foundCanonical = new Set<string>();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  let currentLineAspirational = sectionTag === 'ASPIRATIONS_FUTURE';

  for (const rawLine of lines) {
    const lowerLine = rawLine.toLowerCase();

    if (/interested\s+in\s+learning|future\s+skills|aspirations|learning\s+goals|to\s+learn/i.test(lowerLine)) {
      currentLineAspirational = true;
    } else if (/^(?:skills|technical\s+skills|projects|experience)/i.test(lowerLine)) {
      currentLineAspirational = false;
    }

    for (const def of CANONICAL_SKILL_LEXICON) {
      for (const alias of def.aliases) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+-])${escaped}(?:$|[^a-zA-Z0-9_#+-])`, 'i');

        if (regex.test(lowerLine)) {
          if (!foundCanonical.has(def.canonical)) {
            let polarity: SkillPolarity = 'CURRENT';
            let evidenceStrength: SkillEvidenceStrength = 'EXPERIENCE';

            if (currentLineAspirational || /interested\s+in\s+learning|future\s+goal/i.test(lowerLine)) {
              polarity = 'ASPIRATIONAL';
            }
            if (new RegExp(`(?:no|without|zero|lack\\s+of)\\s+(?:experience\\s+in\\s+)?${escaped}`, 'i').test(lowerLine)) {
              polarity = 'NEGATED';
            }

            if (sectionTag === 'PROJECTS' || /built|created|developed|implemented|portal|app|web/i.test(lowerLine)) {
              evidenceStrength = 'PROJECT_USAGE';
            } else if (/expert|advanced|proficient/i.test(lowerLine)) {
              evidenceStrength = 'EXPERT_CLAIM';
            } else if (/basic|exposure|elementary/i.test(lowerLine)) {
              evidenceStrength = 'EXPOSURE';
            }

            foundCanonical.add(def.canonical);
            results.push({
              canonicalName: def.canonical,
              matchedSurfaceForm: alias,
              polarity,
              evidenceStrength,
              section: sectionTag,
              confidence: 0.95
            });

            console.log(`💡 [STAGE 6/12 - Skill Token]: Match "${alias}" -> Canonical "${def.canonical}" [Polarity: ${polarity}, Strength: ${evidenceStrength}, Section: ${sectionTag}]`);
          }
          break;
        }
      }
    }
  }

  return results;
}
