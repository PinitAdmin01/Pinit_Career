/**
 * PinIT Career OS — Groq-Powered Resume & Credential Intelligence Engine
 *
 * Mirrors the Groq API key architecture used in /api/auth/scan-id-card and /api/interview/chat:
 * - Reads GROQ_API_KEYS (comma-separated pool), GROQ_API_KEY, NEXT_PUBLIC_GROQ_API_KEY, or x-groq-api-key.
 * - Uses Groq Multimodal Vision for image resumes/certificates AND scanned image-only PDFs.
 * - Uses Groq LLM (llama-3.3-70b-versatile + model failover) for deep structured extraction of
 *   ALL real skills, projects, internships, certifications, and 3 brutal resume-specific defense questions.
 * - Uses Groq LLM to strictly grade the candidate's oral defense answers against their actual document claims.
 */

import {
  extractDocumentEvidence,
  extractEmbeddedImagesFromPdf,
  type ExtractionResult,
} from '@/lib/ats/pdfTextExtractor';
import {
  evaluateVaultDefenseResponses,
  type VaultDefenseResult,
} from '@/lib/vault/vaultDefenseEngine';

export interface AnalyzedDocumentProject {
  name: string;
  techStack: string[];
  claim: string;
}

export interface GroqDocumentAnalysis {
  candidateName: string;
  institution: string;
  documentType: 'resume' | 'certification' | 'internship' | 'project' | 'academic' | 'other';
  skills: string[];
  projects: AnalyzedDocumentProject[];
  certifications: string[];
  summary: string;
  defenseQuestions: string[];
  rawTextExcerpt?: string;
  source: 'groq-text' | 'groq-vision' | 'gemini-vision' | 'fallback';
}

type FetchLike = typeof fetch;
let customFetchForTests: FetchLike | null = null;

export function setGroqAnalyzerFetchForTests(fn: FetchLike | null): void {
  customFetchForTests = fn;
}

function getFetch(): FetchLike {
  return customFetchForTests || fetch;
}

export function getGroqApiKeys(customGroqKey?: string | null): string[] {
  const keys: string[] = [];
  const push = (val?: string | null) => {
    const clean = String(val || '').trim();
    if (clean && !keys.includes(clean)) keys.push(clean);
  };

  push(customGroqKey);
  const pool = String(process.env.GROQ_API_KEYS || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  for (const k of pool) push(k);
  push(process.env.GROQ_API_KEY);
  push(process.env.NEXT_PUBLIC_GROQ_API_KEY);

  return keys;
}

function getGroqTextModels(): string[] {
  const candidates = [
    'llama-3.3-70b-versatile',
    process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
  ];
  return Array.from(new Set(candidates.map((m) => String(m || '').trim()).filter(Boolean)));
}

function getGroqVisionModels(): string[] {
  const candidates = [
    'meta-llama/llama-4-scout-17b-16e-instruct',
    'meta-llama/llama-4-maverick-17b-128e-instruct',
    process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b',
  ];
  return Array.from(new Set(candidates.map((m) => String(m || '').trim()).filter(Boolean)));
}

function parseJsonSafely(raw: string): any | null {
  const cleaned = String(raw || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

const GENERIC_NON_SKILLS = new Set([
  'resume',
  'cv',
  'curriculum vitae',
  'hardworking',
  'team player',
  'good communication',
  'communication',
  'analytical',
  'problem solving',
  'quick learner',
  'self motivated',
  'ms word',
]);

function normalizeSkillList(rawSkills: unknown): string[] {
  if (!Array.isArray(rawSkills)) return [];
  const seen = new Map<string, string>();
  for (const item of rawSkills) {
    const clean = String(item || '')
      .replace(/^[-•*\d.)\s]+/, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean || clean.length < 2 || clean.length > 48) continue;
    const lower = clean.toLowerCase();
    if (GENERIC_NON_SKILLS.has(lower)) continue;
    if (!seen.has(lower)) seen.set(lower, clean);
  }
  return Array.from(seen.values()).slice(0, 15);
}

function normalizeProjects(rawProjects: unknown): AnalyzedDocumentProject[] {
  if (!Array.isArray(rawProjects)) return [];
  const out: AnalyzedDocumentProject[] = [];
  for (const p of rawProjects) {
    if (!p || typeof p !== 'object') continue;
    const obj = p as any;
    const name = String(obj.name || obj.title || '').trim();
    if (!name) continue;
    const techStack = normalizeSkillList(obj.techStack || obj.tech_stack || obj.skills || []);
    const claim = String(obj.claim || obj.description || obj.summary || '').trim().slice(0, 240);
    out.push({ name: name.slice(0, 100), techStack: techStack.slice(0, 8), claim });
    if (out.length >= 5) break;
  }
  return out;
}

function normalizeQuestions(rawQuestions: unknown): string[] {
  if (!Array.isArray(rawQuestions)) return [];
  return rawQuestions
    .map((q) => String(q || '').replace(/\s+/g, ' ').trim())
    .filter((q) => q.length >= 25)
    .slice(0, 3);
}

function normalizeDocType(rawType: unknown): GroqDocumentAnalysis['documentType'] {
  const t = String(rawType || '').toLowerCase().trim();
  if (t.includes('cert')) return 'certification';
  if (t.includes('intern')) return 'internship';
  if (t.includes('proj')) return 'project';
  if (t.includes('acad') || t.includes('mark') || t.includes('transcript')) return 'academic';
  if (t.includes('resume') || t.includes('cv')) return 'resume';
  return 'other';
}

function sanitizeGroqAnalysis(
  parsed: any,
  source: GroqDocumentAnalysis['source']
): GroqDocumentAnalysis | null {
  if (!parsed || typeof parsed !== 'object') return null;

  const skills = normalizeSkillList(parsed.skills);
  const projects = normalizeProjects(parsed.projects);
  const certifications = Array.isArray(parsed.certifications)
    ? parsed.certifications
        .map((c: any) => String(c || '').trim())
        .filter((c: string) => c.length >= 3)
        .slice(0, 8)
    : [];
  const defenseQuestions = normalizeQuestions(parsed.defenseQuestions || parsed.questions);
  const summary = String(parsed.summary || '').trim().slice(0, 320);
  const rawTextExcerpt =
    typeof parsed.rawText === 'string' && parsed.rawText.trim().length > 20
      ? parsed.rawText.trim().slice(0, 6000)
      : undefined;

  if (skills.length === 0 && projects.length === 0 && defenseQuestions.length === 0 && !rawTextExcerpt) {
    return null;
  }

  return {
    candidateName: String(parsed.candidateName || '').trim(),
    institution: String(parsed.institution || '').trim(),
    documentType: normalizeDocType(parsed.documentType),
    skills,
    projects,
    certifications,
    summary,
    defenseQuestions,
    rawTextExcerpt,
    source,
  };
}

function buildDocumentAnalysisSystemPrompt(auditorName: string): string {
  return `You are ${auditorName}, a ruthless, forensic Technical & Domain Credential Auditor reading a candidate's ACTUAL uploaded resume, certificate, or proof document.
Extract ONLY real facts explicitly written in the document — NEVER fabricate skills, tools, or projects that are not in the document.
NEVER default to generic "System Design" or "Problem Solving" unless those exact words or architectures are genuinely claimed in the document.

Return ONLY valid JSON matching this exact schema:
{
  "candidateName": "Exact candidate full name if visible, else empty string",
  "institution": "University, college, company, or certificate issuer if visible, else empty string",
  "documentType": "resume | certification | internship | project | academic | other",
  "skills": ["Extract ALL concrete technical, domain, programming, framework, tool, finance, marketing, IoT, or software skills explicitly listed in the document (up to 15 exact items)"],
  "projects": [
    {
      "name": "Exact project, internship, or achievement title from the document",
      "techStack": ["Tools/skills used in this specific project"],
      "claim": "One concrete technical or business claim made about this project in the document"
    }
  ],
  "certifications": ["Exact certification names if listed"],
  "summary": "2 concise sentences summarizing what this document actually claims",
  "defenseQuestions": [
    "Question 1 of 3: Ruthless, specific interrogation question directly referencing a REAL project, experience, or core skill from THIS document (name the actual project/tool/skill from the resume and demand concrete implementation details, failure modes, or reasoning).",
    "Question 2 of 3: Second brutal question probing a DIFFERENT real skill, tool, or technical/domain claim listed in THIS document (not generic textbook fluff).",
    "Question 3 of 3: Third hard cross-examination question combining a real project/certification and another real skill from THIS document to verify the candidate actually built or mastered it themselves."
  ]
}

CRITICAL RULES:
- Read EVERY section of the resume (Skills, Projects, Experience, Internships, Certifications, Tools, Education).
- Every single defense question MUST reference real skills, projects, tools, or claims from THIS specific document.
- Keep each question sharp, direct, spoken-friendly (2-3 sentences max), and uncompromising.`;
}

/**
 * Analyzes extracted resume/certificate text via Groq LLM (multi-key + multi-model failover).
 */
export async function analyzeDocumentTextWithGroq(
  rawText: string,
  opts?: {
    fileName?: string;
    title?: string;
    auditorName?: string;
    customGroqKey?: string | null;
  }
): Promise<GroqDocumentAnalysis | null> {
  const cleanText = String(rawText || '').trim();
  if (cleanText.length < 20) return null;

  const keys = getGroqApiKeys(opts?.customGroqKey);
  if (keys.length === 0) return null;

  const auditorName = opts?.auditorName || 'Mr. Akash';
  const systemPrompt = buildDocumentAnalysisSystemPrompt(auditorName);
  const userPrompt = `Document Title/Filename: ${opts?.title || opts?.fileName || 'Uploaded Document'}

--- DOCUMENT CONTENT START ---
${cleanText.slice(0, 12000)}
--- DOCUMENT CONTENT END ---

Extract EVERY real skill, project, experience claim, and certification written above, and generate 3 brutal, document-specific interrogation questions grounded strictly in what this candidate wrote.`;

  const models = getGroqTextModels();
  const fetchFn = getFetch();

  for (const key of keys) {
    for (const model of models) {
      try {
        const res = await fetchFn('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.15,
            max_tokens: 1200,
            response_format: { type: 'json_object' },
          }),
          signal: AbortSignal.timeout(12000),
        });

        if (!res.ok) {
          console.warn(`[GroqDocumentAnalyzer] Text model ${model} returned HTTP ${res.status}`);
          continue;
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        const parsed = parseJsonSafely(content);
        const sanitized = sanitizeGroqAnalysis(parsed, 'groq-text');
        if (sanitized) return sanitized;
      } catch (err: any) {
        console.warn(`[GroqDocumentAnalyzer] Text model ${model} error:`, err?.message || String(err));
      }
    }
  }

  return null;
}

/**
 * Reads an image resume/certificate OR a scanned PDF page directly via Groq Multimodal Vision
 * (same architecture as /api/auth/scan-id-card), with optional Gemini 2.0 Flash Vision fallback.
 */
export async function extractDocumentWithGroqVision(
  mimeType: string,
  base64Image: string,
  opts?: {
    fileName?: string;
    auditorName?: string;
    customGroqKey?: string | null;
  }
): Promise<GroqDocumentAnalysis | null> {
  if (!base64Image || base64Image.length < 100) return null;

  const auditorName = opts?.auditorName || 'Mr. Akash';
  const visionSystemPrompt = `${buildDocumentAnalysisSystemPrompt(auditorName)}
ALSO include a "rawText" field containing a clean transcription of the visible text on the resume/certificate.`;

  const keys = getGroqApiKeys(opts?.customGroqKey);
  const visionModels = getGroqVisionModels();
  const fetchFn = getFetch();

  for (const key of keys) {
    for (const model of visionModels) {
      try {
        const res = await fetchFn('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: visionSystemPrompt },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Read this entire uploaded document image ("${opts?.fileName || 'resume'}") carefully. Transcribe all visible text into "rawText", extract ALL real skills, projects, tools, and certifications explicitly shown on the document, and write 3 brutal interrogation questions referencing the candidate's actual resume items. Return ONLY valid JSON.`,
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${mimeType};base64,${base64Image}`,
                    },
                  },
                ],
              },
            ],
            temperature: 0.1,
            max_tokens: 1500,
            response_format: { type: 'json_object' },
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (!res.ok) {
          console.warn(`[GroqDocumentAnalyzer] Vision model ${model} returned HTTP ${res.status}`);
          continue;
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        const parsed = parseJsonSafely(content);
        const sanitized = sanitizeGroqAnalysis(parsed, 'groq-vision');
        if (sanitized) return sanitized;
      } catch (err: any) {
        console.warn(`[GroqDocumentAnalyzer] Vision model ${model} error:`, err?.message || String(err));
      }
    }
  }

  // Fallback Layer 1B: Gemini 2.0 Flash Vision (if configured, matching scan-id-card)
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    try {
      const res = await fetchFn(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: visionSystemPrompt },
                  {
                    inlineData: {
                      mimeType,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json',
            },
          }),
          signal: AbortSignal.timeout(12000),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = parseJsonSafely(rawReply);
        const sanitized = sanitizeGroqAnalysis(parsed, 'gemini-vision');
        if (sanitized) return sanitized;
      }
    } catch (err: any) {
      console.warn('[GroqDocumentAnalyzer] Gemini vision fallback error:', err?.message || String(err));
    }
  }

  return null;
}

export function detectBufferFormat(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
): { format: 'PDF' | 'DOCX' | 'IMAGE' | 'TEXT' | 'UNSUPPORTED'; mimeType: string } {
  const lower = String(fileName || '').toLowerCase();
  const mime = String(mimeType || '').toLowerCase();

  if (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { format: 'PDF', mimeType: 'application/pdf' };
  }
  if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && (lower.endsWith('.docx') || mime.includes('wordprocessingml'))) {
    return { format: 'DOCX', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
  }
  if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { format: 'IMAGE', mimeType: 'image/png' };
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { format: 'IMAGE', mimeType: 'image/jpeg' };
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { format: 'IMAGE', mimeType: 'image/webp' };
  }
  if (lower.endsWith('.txt') || lower.endsWith('.md') || mime.startsWith('text/')) {
    return { format: 'TEXT', mimeType: 'text/plain' };
  }
  if (lower.endsWith('.pdf')) return { format: 'PDF', mimeType: 'application/pdf' };
  if (lower.endsWith('.png')) return { format: 'IMAGE', mimeType: 'image/png' };
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return { format: 'IMAGE', mimeType: 'image/jpeg' };
  return { format: 'UNSUPPORTED', mimeType: mime || 'application/octet-stream' };
}

/**
 * Full binary-to-Groq pipeline for both live uploads AND existing files fetched from Supabase Storage.
 */
export async function analyzeVaultFileBufferWithGroq(
  buffer: Buffer,
  fileName: string,
  mimeType?: string,
  opts?: {
    title?: string;
    auditorName?: string;
    customGroqKey?: string | null;
  }
): Promise<{
  extraction: ExtractionResult;
  groqAnalysis: GroqDocumentAnalysis | null;
  effectiveRawText: string;
}> {
  const detected = detectBufferFormat(buffer, fileName, mimeType);
  const extraction = extractDocumentEvidence(buffer, detected.format);
  let effectiveRawText = (extraction.rawText || '').trim();
  let groqAnalysis: GroqDocumentAnalysis | null = null;

  // 1. Direct Image upload -> Groq Vision OCR + Skill/Project Extraction
  if (detected.format === 'IMAGE') {
    const base64 = buffer.toString('base64');
    groqAnalysis = await extractDocumentWithGroqVision(detected.mimeType, base64, {
      fileName,
      auditorName: opts?.auditorName,
      customGroqKey: opts?.customGroqKey,
    });
    if (groqAnalysis?.rawTextExcerpt && groqAnalysis.rawTextExcerpt.length > effectiveRawText.length) {
      effectiveRawText = groqAnalysis.rawTextExcerpt;
    } else if (groqAnalysis && effectiveRawText.length < 30) {
      effectiveRawText = [
        groqAnalysis.candidateName,
        groqAnalysis.institution,
        groqAnalysis.summary,
        groqAnalysis.skills.join(', '),
        groqAnalysis.projects.map((p) => `${p.name}: ${p.claim}`).join('\n'),
      ]
        .filter(Boolean)
        .join('\n');
    }
    return { extraction, groqAnalysis, effectiveRawText };
  }

  // 2. Scanned / Canva Image-Only PDF -> Extract embedded JPEG and send to Groq Vision!
  if (detected.format === 'PDF' && effectiveRawText.length < 80) {
    const embeddedImages = extractEmbeddedImagesFromPdf(buffer, 1);
    if (embeddedImages.length > 0) {
      groqAnalysis = await extractDocumentWithGroqVision(
        embeddedImages[0].mimeType,
        embeddedImages[0].base64,
        {
          fileName,
          auditorName: opts?.auditorName,
          customGroqKey: opts?.customGroqKey,
        }
      );
      if (groqAnalysis?.rawTextExcerpt && groqAnalysis.rawTextExcerpt.length > effectiveRawText.length) {
        effectiveRawText = groqAnalysis.rawTextExcerpt;
      } else if (groqAnalysis && effectiveRawText.length < 30) {
        effectiveRawText = [
          groqAnalysis.candidateName,
          groqAnalysis.institution,
          groqAnalysis.summary,
          groqAnalysis.skills.join(', '),
          groqAnalysis.projects.map((p) => `${p.name}: ${p.claim}`).join('\n'),
        ]
          .filter(Boolean)
          .join('\n');
      }
      if (groqAnalysis) {
        return { extraction, groqAnalysis, effectiveRawText };
      }
    }
  }

  // 3. Readable PDF / DOCX / TXT -> Groq structured extraction of ALL skills, projects & defense questions
  if (effectiveRawText.length >= 30) {
    groqAnalysis = await analyzeDocumentTextWithGroq(effectiveRawText, {
      fileName,
      title: opts?.title,
      auditorName: opts?.auditorName,
      customGroqKey: opts?.customGroqKey,
    });
  }

  return { extraction, groqAnalysis, effectiveRawText };
}

/**
 * Strictly evaluates the candidate's 3 oral defense answers using Groq LLM against the exact
 * questions asked and their actual resume skills/projects. Falls back cleanly to deterministic grading.
 */
export async function evaluateDefenseWithGroq(opts: {
  title: string;
  auditorName: string;
  claimedSkills: string[];
  projects?: AnalyzedDocumentProject[];
  summary?: string;
  questions: string[];
  answers: string[];
  customGroqKey?: string | null;
}): Promise<VaultDefenseResult & { gradingSource: 'groq' | 'fallback' }> {
  const validAnswers = (opts.answers || []).map((a) => String(a || '').trim()).filter(Boolean);
  if (validAnswers.length === 0) {
    return {
      ...evaluateVaultDefenseResponses(opts.claimedSkills, []),
      gradingSource: 'fallback',
    };
  }

  const keys = getGroqApiKeys(opts.customGroqKey);
  if (keys.length === 0) {
    return {
      ...evaluateVaultDefenseResponses(opts.claimedSkills, opts.answers),
      gradingSource: 'fallback',
    };
  }

  const qaTranscript = opts.questions
    .map((q, idx) => `Q${idx + 1}: ${q}\nCandidate Answer ${idx + 1}: ${opts.answers[idx] || '[No answer]'}`)
    .join('\n\n');

  const systemPrompt = `You are ${opts.auditorName}, a strict, fair, adversarial Credential & Resume Auditor grading a candidate's oral defense of their uploaded document "${opts.title}".

Your job is to separate genuine practitioners from people who copied buzzwords onto a resume or certificate.
- PASS (score >= 65) if the candidate explains real, accurate technical or domain concepts, architecture, workflow, code/tool usage, or concrete experience that genuinely answers the questions asked about their resume. Short-to-medium clear spoken answers that show real understanding SHOULD pass.
- FAIL (score < 65) if the candidate says "I don't know", gives gibberish, evades the questions, gives factually wrong fundamentals, or only repeats buzzwords with zero real explanation.

Return ONLY valid JSON:
{
  "passed": true or false,
  "score": integer 5 to 98 (must be >= 65 if passed is true, < 65 if passed is false),
  "critique": "2-3 crisp sentences directly referencing what the candidate got right or failed to defend from their actual resume."
}`;

  const userPrompt = `Document: ${opts.title}
Claimed Skills: ${opts.claimedSkills.join(', ')}
${opts.projects?.length ? `Claimed Projects:\n${opts.projects.map((p) => `- ${p.name} (${p.techStack.join(', ')}): ${p.claim}`).join('\n')}` : ''}
${opts.summary ? `Document Summary: ${opts.summary}` : ''}

--- INTERROGATION TRANSCRIPT ---
${qaTranscript}
--- END TRANSCRIPT ---

Grade strictly and accurately in JSON.`;

  const models = getGroqTextModels();
  const fetchFn = getFetch();

  for (const key of keys) {
    for (const model of models) {
      try {
        const res = await fetchFn('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.1,
            max_tokens: 400,
            response_format: { type: 'json_object' },
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) continue;

        const data = await res.json();
        const parsed = parseJsonSafely(data?.choices?.[0]?.message?.content);
        if (parsed && typeof parsed.score === 'number') {
          const score = Math.max(5, Math.min(98, Math.round(parsed.score)));
          const passed = Boolean(parsed.passed) && score >= 65;
          const critique =
            String(parsed.critique || '').trim() ||
            (passed
              ? `Passed oral defense (${score}/100). Verified real command over claimed resume skills.`
              : `Failed oral defense (${score}/100). Claims were not substantiated under questioning.`);

          return {
            passed,
            score,
            verdict: passed ? 'Verified Authentic' : 'Rejected — Unsubstantiated Claims',
            trustDelta: passed ? 5 : -5,
            verifiedSkillsAdded: passed ? opts.claimedSkills : [],
            critique,
            gradingSource: 'groq',
          };
        }
      } catch (err: any) {
        console.warn(`[GroqDocumentAnalyzer] Grading model ${model} error:`, err?.message || String(err));
      }
    }
  }

  return {
    ...evaluateVaultDefenseResponses(opts.claimedSkills, opts.answers),
    gradingSource: 'fallback',
  };
}
