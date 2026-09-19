// apps/web/src/lib/missions/aiArchitectReviewer.ts
// Socratic AI Senior Architect PR Reviewer & Deterministic Diagnostic Fallback Engine

export interface ArchitectReviewInput {
  missionId: string;
  missionTitle: string;
  targetRole: string;
  failingStackTraces: string[];
  studentCodeDiff: string;
  attemptCount: number;
  runtimeErrors?: string[];
}

export interface ArchitectReviewResult {
  missionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reviewSummary: string;
  architecturalFlaw: string;
  socraticHint: string;
  documentationRef: string;
  shouldEscalateToHuman: boolean;
  escalationReason?: string;
  suggestedFocusArea: string;
}

/**
 * AI Senior Architect PR Review Engine.
 * Evaluates student failure traces using deterministic pattern heuristics first.
 * Never gives the solution code away directly; guides the student via Socratic debugging.
 */
export class AiArchitectReviewer {
  static async reviewSubmission(input: ArchitectReviewInput): Promise<ArchitectReviewResult> {
    const {
      missionId,
      missionTitle,
      targetRole,
      failingStackTraces = [],
      studentCodeDiff = '',
      attemptCount = 1,
    } = input;

    const stackText = failingStackTraces.join('\n').toLowerCase();
    const codeText = studentCodeDiff.toLowerCase();

    // Escalation Policy: If student failed 3 or more times on the same mission
    const shouldEscalateToHuman = attemptCount >= 3;
    const escalationReason = shouldEscalateToHuman
      ? `Candidate has failed ${attemptCount} consecutive attempts on mission "${missionTitle}". Automated hints exhausted; routing to Human Mentor in Teacher Inbox.`
      : undefined;

    // Pattern 1: Null Pointer / Undefined Property
    if (stackText.includes('cannot read propert') || stackText.includes('null') || stackText.includes('undefined')) {
      return {
        missionId,
        severity: 'medium',
        reviewSummary: 'Your implementation attempted to access properties on a null or uninitialized reference.',
        architecturalFlaw: 'Unchecked Null Pointer Dereference: Lack of defensive guard clauses or optional chaining.',
        socraticHint: 'Before invoking methods on nested objects, check whether the root object exists. In modern TypeScript, consider using the optional chaining operator (?.) or an early return pattern.',
        documentationRef: 'MDN Web Docs: Optional Chaining (?.) and Nullish Coalescing (??)',
        shouldEscalateToHuman,
        escalationReason,
        suggestedFocusArea: 'Defensive Programming & Type Guards',
      };
    }

    // Pattern 2: Async / Promise Handling
    if (stackText.includes('promise') || stackText.includes('pending') || stackText.includes('await') || stackText.includes('unhandledrejection')) {
      return {
        missionId,
        severity: 'high',
        reviewSummary: 'An asynchronous operation returned an unresolved Promise instead of the awaited payload.',
        architecturalFlaw: 'Unhandled Asynchronous Execution: Missing await keyword or unhandled Promise rejection.',
        socraticHint: 'Review your asynchronous flow. When calling async functions or database queries, ensure execution pauses with await, and wrap concurrent operations using Promise.all() or Promise.allSettled().',
        documentationRef: 'MDN Web Docs: async function and Promise.allSettled',
        shouldEscalateToHuman,
        escalationReason,
        suggestedFocusArea: 'Asynchronous Control Flow & Concurrency',
      };
    }

    // Pattern 3: Database & SQL Bottlenecks
    if (stackText.includes('syntax error at or near') || stackText.includes('deadlock') || stackText.includes('timeout') || stackText.includes('relation') || codeText.includes('select *')) {
      return {
        missionId,
        severity: 'critical',
        reviewSummary: 'Database transaction failed or experienced an unexpected query constraint violation.',
        architecturalFlaw: 'Database Query Malformation / Lock Contention: Potential unindexed scan or transaction ordering mismatch.',
        socraticHint: 'Inspect the SQL error clause carefully. Check column names, ensure foreign key constraints match, and verify that transactions acquire locks in a globally consistent order to prevent deadlocks.',
        documentationRef: 'PostgreSQL Docs: Chapter 13. Concurrency Control and Explicit Locking',
        shouldEscalateToHuman,
        escalationReason,
        suggestedFocusArea: 'Database Schema Design & ACID Transactions',
      };
    }

    // Pattern 4: Auth, JWT & Permissions
    if (stackText.includes('jwt') || stackText.includes('401') || stackText.includes('unauthorized') || stackText.includes('signature') || stackText.includes('token')) {
      return {
        missionId,
        severity: 'high',
        reviewSummary: 'Security assertion failed: Authentication token validation was rejected.',
        architecturalFlaw: 'Broken Token Verification: Secret key mismatch, expired signature, or missing Authorization bearer header.',
        socraticHint: 'Check how the token payload is decoded versus verified. Verify that process.env.JWT_SECRET is passed consistently and that token expiration (exp claim) is handled gracefully.',
        documentationRef: 'RFC 7519: JSON Web Token (JWT) Security Considerations',
        shouldEscalateToHuman,
        escalationReason,
        suggestedFocusArea: 'API Security & Cryptographic Token Authentication',
      };
    }

    // Default Fallback
    return {
      missionId,
      severity: shouldEscalateToHuman ? 'critical' : 'low',
      reviewSummary: `Unit test assertion failed for role requirement "${targetRole}".`,
      architecturalFlaw: 'Assertion Mismatch: Code output does not satisfy the required interface contract.',
      socraticHint: 'Compare your function return value against the exact type interface in the mission spec. Ensure edge cases like empty arrays, zero values, and unexpected types are handled.',
      documentationRef: 'Clean Architecture: Enforcing Boundaries and Interface Contracts',
      shouldEscalateToHuman,
      escalationReason,
      suggestedFocusArea: 'Unit Testing & Edge Case Hardening',
    };
  }
}
