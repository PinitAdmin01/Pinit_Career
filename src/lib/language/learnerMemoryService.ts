/**
 * PinIT Persistent Learner Memory Service
 * 
 * Clean-Room TypeScript Implementation for 5 Independent Language Programs
 * Categorizes & Filters Memory Context (student_facts, learning_weaknesses, conversation_context)
 * Prevents blind injection by selecting relevant & fresh memories for AI prompt context.
 */

import { LanguageCode } from './languageTypes';

export type MemoryCategory = 'student_facts' | 'learning_weaknesses' | 'conversation_context';

export interface LearnerMemoryFact {
  id: string;
  studentId: string;
  languageCode: LanguageCode;
  category: MemoryCategory;
  content: string;
  createdAt: string;
  relevanceKeywords?: string[];
}

const MEMORY_STORAGE_KEY = 'pinit_student_language_memories_v1';
const MAX_MEMORIES_PER_STUDENT_LANG = 100;
const MAX_PROMPT_INJECTED_MEMORIES = 10;

/**
 * Saves a new durable fact into memory cache/DB ledger
 */
export function saveLearnerMemory(
  studentId: string,
  languageCode: LanguageCode,
  category: MemoryCategory,
  content: string
): LearnerMemoryFact {
  const cleanContent = content.trim();
  if (!cleanContent) throw new Error('Memory content cannot be empty');

  // Extract simple keywords for relevance matching
  const keywords = cleanContent
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(w => w.length >= 4);

  const newFact: LearnerMemoryFact = {
    id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    studentId,
    languageCode,
    category,
    content: cleanContent,
    createdAt: new Date().toISOString(),
    relevanceKeywords: keywords
  };

  if (typeof localStorage !== 'undefined') {
    try {
      const existingRaw = localStorage.getItem(MEMORY_STORAGE_KEY) || '[]';
      const existing: LearnerMemoryFact[] = JSON.parse(existingRaw);

      // Filter out duplicate content or enforce capacity cap per student/lang
      const filtered = existing.filter(
        m => !(m.studentId === studentId && m.languageCode === languageCode && m.content.toLowerCase() === cleanContent.toLowerCase())
      );

      filtered.push(newFact);

      // Enforce FIFO cap per student/lang
      const studentLangMemories = filtered.filter(m => m.studentId === studentId && m.languageCode === languageCode);
      if (studentLangMemories.length > MAX_MEMORIES_PER_STUDENT_LANG) {
        const oldestId = studentLangMemories[0].id;
        const removeIdx = filtered.findIndex(m => m.id === oldestId);
        if (removeIdx !== -1) filtered.splice(removeIdx, 1);
      }

      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // Graceful fallback for non-browser or storage quota limits
    }
  }

  return newFact;
}

/**
 * Retrieves all stored memories for a student in a specific language
 */
export function getLearnerMemories(
  studentId: string,
  languageCode: LanguageCode,
  category?: MemoryCategory
): LearnerMemoryFact[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY) || '[]';
    const all: LearnerMemoryFact[] = JSON.parse(raw);
    return all.filter(m =>
      m.studentId === studentId &&
      m.languageCode === languageCode &&
      (!category || m.category === category)
    );
  } catch {
    return [];
  }
}

/**
 * Formats top relevant & fresh memories for injection into AI speaking/listening prompts
 */
export function formatMemoriesForPrompt(
  memories: LearnerMemoryFact[],
  activeTopicPrompt: string = ''
): string {
  if (!memories || memories.length === 0) return '';

  const topicKeywords = activeTopicPrompt
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(w => w.length >= 3);

  // Score relevance based on topic keyword overlap and freshness
  const scored = memories.map(mem => {
    let relevanceScore = 0;
    if (mem.relevanceKeywords && topicKeywords.length > 0) {
      const matchCount = mem.relevanceKeywords.filter(k => topicKeywords.includes(k)).length;
      relevanceScore += matchCount * 10;
    }
    if (mem.category === 'learning_weaknesses') relevanceScore += 5; // prioritize addressing past mistakes
    return { mem, relevanceScore };
  });

  scored.sort((a, b) => b.relevanceScore - a.relevanceScore || new Date(b.mem.createdAt).getTime() - new Date(a.mem.createdAt).getTime());

  const selected = scored.slice(0, MAX_PROMPT_INJECTED_MEMORIES).map(s => s.mem);

  const facts = selected.filter(m => m.category === 'student_facts').map(m => `- Fact: ${m.content}`);
  const weaknesses = selected.filter(m => m.category === 'learning_weaknesses').map(m => `- Target Practice Area: ${m.content}`);

  let result = '';
  if (facts.length > 0) {
    result += `STUDENT BACKGROUND CONTEXT:\n${facts.join('\n')}\n`;
  }
  if (weaknesses.length > 0) {
    result += `PAST LEARNING WEAKNESSES TO REMEDIATE:\n${weaknesses.join('\n')}\n`;
  }

  return result.trim();
}
