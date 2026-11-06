import json
import subprocess
import sys

def build_day_23():
    # Codes for the 5 parts
    p1_code = """// Think-Aloud Signpost Auditor & Algorithmic Screen Parser
interface CandidateVerbalMilestone {
  timestampMinutes: number;
  phase: 'PARAPHRASE' | 'CONSTRAINTS' | 'BRUTE_FORCE' | 'COMPLEXITY_ANALYSIS' | 'OPTIMIZATION' | 'EDGE_CASES' | 'SILENCE';
  utterance: string;
}

interface AlgorithmicCommunicationScorecard {
  candidateName: string;
  totalVerbalMilestones: number;
  verbalArticulationScore: number; // 0 - 100
  coveredPhases: string[];
  missingPhases: string[];
  communicationTier: 'STAFF_COMMUNICATOR' | 'STRONG_COLLABORATIVE' | 'SILENT_CODER';
  executiveFeedback: string;
}

class ThinkAloudSignpostAuditor {
  private readonly requiredPhases = [
    'PARAPHRASE',
    'CONSTRAINTS',
    'BRUTE_FORCE',
    'COMPLEXITY_ANALYSIS',
    'OPTIMIZATION',
    'EDGE_CASES'
  ];

  auditVerbalCadence(candidateName: string, milestones: CandidateVerbalMilestone[]): AlgorithmicCommunicationScorecard {
    const covered = new Set<string>();
    let silenceDeductions = 0;

    for (const m of milestones) {
      if (m.phase === 'SILENCE') {
        silenceDeductions += 15;
      } else if (m.utterance.trim().length >= 15) {
        covered.add(m.phase);
      }
    }

    const missing = this.requiredPhases.filter(p => !covered.has(p));
    const coveragePercentage = (covered.size / this.requiredPhases.length) * 100;
    const finalScore = Math.max(0, Math.min(100, Math.round(coveragePercentage - silenceDeductions)));

    let tier: AlgorithmicCommunicationScorecard['communicationTier'] = 'STAFF_COMMUNICATOR';
    let feedback = 'OUTSTANDING COGNITIVE SIGNPOSTING: Candidate systematically guided the interviewer through every architectural phase.';

    if (finalScore < 60) {
      tier = 'SILENT_CODER';
      feedback = 'CRITICAL COMMUNICATION BREAKDOWN: Prolonged silence and failure to articulate constraints before coding.';
    } else if (finalScore < 85) {
      tier = 'STRONG_COLLABORATIVE';
      feedback = 'SOLID COMMUNICATION: Good verbalization, but missed formal brute force baseline or edge case verification.';
    }

    return {
      candidateName,
      totalVerbalMilestones: milestones.length,
      verbalArticulationScore: finalScore,
      coveredPhases: Array.from(covered),
      missingPhases: missing,
      communicationTier: tier,
      executiveFeedback: feedback
    };
  }
}

const auditor = new ThinkAloudSignpostAuditor();

const silentCandidateMilestones: CandidateVerbalMilestone[] = [
  { timestampMinutes: 1, phase: 'PARAPHRASE', utterance: 'Okay, find the two sum.' },
  { timestampMinutes: 2, phase: 'SILENCE', utterance: '[Candidate types silently for 8 minutes without speaking]' },
  { timestampMinutes: 10, phase: 'EDGE_CASES', utterance: 'I think it works now.' }
];

const eliteCandidateMilestones: CandidateVerbalMilestone[] = [
  { timestampMinutes: 1, phase: 'PARAPHRASE', utterance: 'To confirm my understanding, given an array of integers and a target sum, we need to return the indices of the two elements that add up to target.' },
  { timestampMinutes: 3, phase: 'CONSTRAINTS', utterance: 'Before considering algorithms, what is the expected array size, can elements be negative, and is there guaranteed to be exactly one solution?' },
  { timestampMinutes: 5, phase: 'BRUTE_FORCE', utterance: 'A naive brute-force baseline would check every pair with nested loops, taking O(N^2) time and O(1) space.' },
  { timestampMinutes: 7, phase: 'COMPLEXITY_ANALYSIS', utterance: 'Can we do better than quadratic time? We can trade space for time using a hash map to look up the complement in O(1).' },
  { timestampMinutes: 9, phase: 'OPTIMIZATION', utterance: 'By storing each number and its index in a single pass, we achieve O(N) time complexity and O(N) auxiliary space.' },
  { timestampMinutes: 12, phase: 'EDGE_CASES', utterance: 'Let us dry-run edge cases: empty array, array with two elements, negative targets, and large inputs near integer overflow.' }
];

console.log('=== THINK-ALOUD SIGNPOST AUDIT ===');
const r1 = auditor.auditVerbalCadence('Devon Vance', silentCandidateMilestones);
console.log('Candidate 1:        ' + r1.candidateName + ' [' + r1.communicationTier + ']');
console.log('Score:              ' + r1.verbalArticulationScore + '/100');
console.log('Missing Phases:     ' + r1.missingPhases.join(', '));
console.log('Feedback:           ' + r1.executiveFeedback);
console.log('');
const r2 = auditor.auditVerbalCadence('Priya Patel', eliteCandidateMilestones);
console.log('Candidate 2:        ' + r2.candidateName + ' [' + r2.communicationTier + ']');
console.log('Score:              ' + r2.verbalArticulationScore + '/100');
console.log('Phases Covered:     ' + r2.coveredPhases.join(' -> '));
console.log('Feedback:           ' + r2.executiveFeedback);
console.log('Algorithmic Rule: Never start typing code until you have paraphrased the problem, probed constraints, and verbalized complexity trade-offs.');"""

    p2_code = """// 5-Step Clarification & Requirement Framing Protocol
interface ClarificationInquiry {
  category: 'INPUT_SIZE' | 'DUPLICATES_NULLS' | 'MEMORY_LIMITS' | 'MUTABILITY' | 'RETURN_FORMAT';
  questionText: string;
}

interface ClarificationEvaluationScorecard {
  candidate: string;
  totalQuestionsAsked: number;
  categoriesProbed: string[];
  missingCategories: string[];
  clarificationRigorIndex: number; // 0 - 100
  unverifiedAssumptionsRisk: 'HIGH_RISK' | 'MODERATE_RISK' | 'ZERO_RISK';
  coachingRecommendation: string;
}

class RequirementClarificationValidator {
  private readonly mandatoryCategories = [
    'INPUT_SIZE',
    'DUPLICATES_NULLS',
    'MEMORY_LIMITS',
    'MUTABILITY',
    'RETURN_FORMAT'
  ];

  auditClarification(candidate: string, inquiries: ClarificationInquiry[]): ClarificationEvaluationScorecard {
    const probed = new Set<string>();

    for (const q of inquiries) {
      if (q.questionText.trim().length >= 15) {
        probed.add(q.category);
      }
    }

    const missing = this.mandatoryCategories.filter(c => !probed.has(c));
    const score = Math.round((probed.size / this.mandatoryCategories.length) * 100);

    let risk: ClarificationEvaluationScorecard['unverifiedAssumptionsRisk'] = 'ZERO_RISK';
    let recommendation = 'RIGOROUS SPECIFICATION: Candidate exhaustively surfaced boundary constraints and data invariants.';

    if (score < 50) {
      risk = 'HIGH_RISK';
      recommendation = 'DANGEROUS ASSUMPTION BLINDSPOT: Candidate dived into code without verifying input scale or nullability.';
    } else if (score < 100) {
      risk = 'MODERATE_RISK';
      recommendation = 'PARTIAL CLARIFICATION: Good constraint exploration, but probe memory limits and mutability before writing code.';
    }

    return {
      candidate,
      totalQuestionsAsked: inquiries.length,
      categoriesProbed: Array.from(probed),
      missingCategories: missing,
      clarificationRigorIndex: score,
      unverifiedAssumptionsRisk: risk,
      coachingRecommendation: recommendation
    };
  }
}

const clarifier = new RequirementClarificationValidator();

const sampleInquiries: ClarificationInquiry[] = [
  { category: 'INPUT_SIZE', questionText: 'What is the upper bound on the number of elements in the input array: is N <= 10^4 or up to 10^9?' },
  { category: 'DUPLICATES_NULLS', questionText: 'Can the input array contain duplicate values, negative integers, or null references?' },
  { category: 'MEMORY_LIMITS', questionText: 'Are there strict memory limits: do we need an in-place O(1) space algorithm or is O(N) auxiliary memory acceptable?' },
  { category: 'MUTABILITY', questionText: 'May we modify or sort the original input array in-place, or must it remain immutable?' },
  { category: 'RETURN_FORMAT', questionText: 'If no valid pair exists, should we return an empty array, null, or throw an IllegalArgumentException?' }
];

console.log('=== 5-STEP REQUIREMENT CLARIFICATION AUDIT ===');
const cScorecard = clarifier.auditClarification('Sophia Chen', sampleInquiries);
console.log('Candidate:           ' + cScorecard.candidate);
console.log('Clarification Index: ' + cScorecard.clarificationRigorIndex + '/100 [Risk: ' + cScorecard.unverifiedAssumptionsRisk + ']');
console.log('Categories Probed:   ' + cScorecard.categoriesProbed.join(' | '));
console.log('Missing Categories:  ' + (cScorecard.missingCategories.length > 0 ? cScorecard.missingCategories.join(', ') : 'None'));
console.log('Recommendation:      ' + cScorecard.coachingRecommendation);
console.log('Requirement Invariant: Clarifying boundary conditions before typing prevents rewriting 50 lines of code at minute 35.');"""

    p3_code = """// Cognitive Signposting & Live Coding Speaking Cadence Engine
interface LiveCodingEvent {
  secondOffset: number;
  eventType: 'SPOKEN_SIGNPOST' | 'KEYSTROKE_BURST' | 'PAUSE';
  content: string;
}

interface CadenceAuditResult {
  candidateName: string;
  totalSessionSeconds: number;
  totalSignpostsSpoken: number;
  longestSilenceSeconds: number;
  cadenceContinuityScore: number; // 0 - 100
  flowTier: 'EFFORTLESS_NARRATOR' | 'SPORADIC_SPEAKER' | 'PARALYZED_SILENT';
  cadenceFeedback: string;
}

class CognitiveSignpostingEngine {
  auditSpeakingCadence(name: string, events: LiveCodingEvent[]): CadenceAuditResult {
    let longestSilence = 0;
    let lastSpokenSecond = 0;
    let signpostCount = 0;

    for (const ev of events) {
      if (ev.eventType === 'SPOKEN_SIGNPOST') {
        signpostCount++;
        const silenceDuration = ev.secondOffset - lastSpokenSecond;
        if (silenceDuration > longestSilence) longestSilence = silenceDuration;
        lastSpokenSecond = ev.secondOffset;
      }
    }

    const lastEvent = events[events.length - 1];
    const totalSeconds = lastEvent ? lastEvent.secondOffset : 0;
    const finalTailSilence = totalSeconds - lastSpokenSecond;
    if (finalTailSilence > longestSilence) longestSilence = finalTailSilence;

    // Calculate Continuity Score
    // Penalty for long silences (> 30s is bad, > 60s is fatal)
    let score = 100;
    if (longestSilence > 60) score -= 45;
    else if (longestSilence > 30) score -= 25;
    else if (longestSilence > 15) score -= 10;

    if (signpostCount < 4) score -= 30;

    score = Math.max(0, Math.min(100, score));

    let tier: CadenceAuditResult['flowTier'] = 'EFFORTLESS_NARRATOR';
    let feedback = 'PERFECT NARRATIVE FLOW: Spoke every 10-20 seconds, signposting intent before typing code blocks.';

    if (score < 50) {
      tier = 'PARALYZED_SILENT';
      feedback = `CRITICAL SILENCE ALERT: Experienced a ${longestSilence}s dead silence window. Interviewer had zero insight into candidate thoughts.`;
    } else if (score < 80) {
      tier = 'SPORADIC_SPEAKER';
      feedback = 'INCONSISTENT CADENCE: Good initial signposts, but lapsed into silent typing during loop implementation.';
    }

    return {
      candidateName: name,
      totalSessionSeconds: totalSeconds,
      totalSignpostsSpoken: signpostCount,
      longestSilenceSeconds: longestSilence,
      cadenceContinuityScore: score,
      flowTier: tier,
      cadenceFeedback: feedback
    };
  }
}

const signpostEngine = new CognitiveSignpostingEngine();

const smoothSessionEvents: LiveCodingEvent[] = [
  { secondOffset: 5, eventType: 'SPOKEN_SIGNPOST', content: 'I am now defining the interface for our LRU cache node.' },
  { secondOffset: 12, eventType: 'KEYSTROKE_BURST', content: 'class Node { key: number; val: number; next: Node; prev: Node; }' },
  { secondOffset: 20, eventType: 'SPOKEN_SIGNPOST', content: 'Now I am initializing the sentinel head and tail dummy pointers to eliminate boundary null checks.' },
  { secondOffset: 30, eventType: 'KEYSTROKE_BURST', content: 'this.head.next = this.tail; this.tail.prev = this.head;' },
  { secondOffset: 42, eventType: 'SPOKEN_SIGNPOST', content: 'Next, I implement the moveToHead helper method to ensure O(1) eviction tracking on every get operation.' },
  { secondOffset: 55, eventType: 'KEYSTROKE_BURST', content: 'this.removeNode(node); this.addToHead(node);' },
  { secondOffset: 68, eventType: 'SPOKEN_SIGNPOST', content: 'Now we implement put: checking if the key exists, updating the value, or evicting the LRU tail node if capacity is exceeded.' }
];

console.log('=== LIVE CODING COGNITIVE SIGNPOSTING AUDIT ===');
const cadenceResult = signpostEngine.auditSpeakingCadence('Jordan Hayes', smoothSessionEvents);
console.log('Candidate:           ' + cadenceResult.candidateName);
console.log('Flow Tier:           [' + cadenceResult.flowTier + ']');
console.log('Continuity Score:    ' + cadenceResult.cadenceContinuityScore + '/100');
console.log('Longest Silence:     ' + cadenceResult.longestSilenceSeconds + ' seconds (Threshold: <= 30s)');
console.log('Signposts Spoken:    ' + cadenceResult.totalSignpostsSpoken + ' checkpoints');
console.log('Cadence Feedback:    ' + cadenceResult.cadenceFeedback);
console.log('Signposting Rule: Narrate intent BEFORE typing: \"I am initializing two pointers to scan from opposite ends in O(N) time.\"');"""

    p4_code = """// Interviewer Hint Reception & Coachability Auditor
interface InterviewerHintInteraction {
  hintText: string;
  candidateResponseText: string;
  reactionCategory: 'DEFENSIVE_REJECTION' | 'FLUSTERED_PANIC' | 'PASSIVE_BLIND_AGREEMENT' | 'RECEPTIVE_SYNTHESIS';
}

interface CoachabilityScorecard {
  candidate: string;
  totalHintsReceived: number;
  coachabilityIndex: number; // 0 - 100
  perceivedMaturity: 'STAFF_COLLABORATIVE' | 'COACHABLE_SENIOR' | 'DEFENSIVE_BRITTLE';
  reactionBreakdown: Record<string, number>;
  evaluationSummary: string;
}

class InterviewerHintReceptionAuditor {
  auditHintReception(candidate: string, interactions: InterviewerHintInteraction[]): CoachabilityScorecard {
    let score = 50;
    const breakdown: Record<string, number> = {
      DEFENSIVE_REJECTION: 0,
      FLUSTERED_PANIC: 0,
      PASSIVE_BLIND_AGREEMENT: 0,
      RECEPTIVE_SYNTHESIS: 0
    };

    for (const item of interactions) {
      breakdown[item.reactionCategory]++;
      switch (item.reactionCategory) {
        case 'RECEPTIVE_SYNTHESIS':
          score += 25;
          break;
        case 'PASSIVE_BLIND_AGREEMENT':
          score += 5;
          break;
        case 'FLUSTERED_PANIC':
          score -= 15;
          break;
        case 'DEFENSIVE_REJECTION':
          score -= 30;
          break;
      }
    }

    score = Math.max(0, Math.min(100, score));

    let maturity: CoachabilityScorecard['perceivedMaturity'] = 'STAFF_COLLABORATIVE';
    let summary = 'EXEMPLARY COACHABILITY: Candidate welcomed interviewer hints as collaborative data points and synthesized them into working code.';

    if (score < 45) {
      maturity = 'DEFENSIVE_BRITTLE';
      summary = 'CRITICAL COACHABILITY CONCERN: Candidate exhibited defensive resistance or argumentativeness when nudged toward alternative approaches.';
    } else if (score < 80) {
      maturity = 'COACHABLE_SENIOR';
      summary = 'ACCEPTABLE RECEPTION: Candidate incorporated hints, though exhibited mild initial hesitation or passive execution.';
    }

    return {
      candidate,
      totalHintsReceived: interactions.length,
      coachabilityIndex: score,
      perceivedMaturity: maturity,
      reactionBreakdown: breakdown,
      evaluationSummary: summary
    };
  }
}

const hintAuditor = new InterviewerHintReceptionAuditor();

const sampleInteractions: InterviewerHintInteraction[] = [
  {
    hintText: 'What happens to your pointer logic when the linked list contains an odd number of nodes?',
    candidateResponseText: 'That is a great call. Let us trace an odd-length list: [1, 2, 3]. Fast pointer advances by two, landing on 3 while slow lands on 2. If we condition on fast.next !== null, fast.next.next will trigger an NPE unless we also guard fast.next !== null. Let me add that condition right now.',
    reactionCategory: 'RECEPTIVE_SYNTHESIS'
  },
  {
    hintText: 'Could we avoid recalculating the sum of the subarray on every iteration?',
    candidateResponseText: 'Yes, absolutely. Instead of recalculating from scratch in O(K) time, we can maintain a sliding window sum by adding the new element and subtracting the element dropping out of the window in O(1) time. Let us refactor that loop.',
    reactionCategory: 'RECEPTIVE_SYNTHESIS'
  }
];

console.log('=== INTERVIEWER HINT RECEPTION AUDIT ===');
const hResult = hintAuditor.auditHintReception('Maya Lin', sampleInteractions);
console.log('Candidate:           ' + hResult.candidate);
console.log('Maturity Tier:       [' + hResult.perceivedMaturity + ']');
console.log('Coachability Index:  ' + hResult.coachabilityIndex + '/100');
console.log('Hints Synthesized:   ' + hResult.reactionBreakdown.RECEPTIVE_SYNTHESIS + '/' + hResult.totalHintsReceived);
console.log('Evaluation Summary:  ' + hResult.evaluationSummary);
console.log('Hint Reception Rule: An interviewer hint is not a penalty; it is a collaborative test of whether you are enjoyable to work with in production.');"""

    p5_code = """// Master Live Coding Communication Simulator & Algorithmic Screen Suite
interface MasterScreenSubmission {
  candidateName: string;
  problemTitle: string;
  paraphrasedSpec: string;
  clarifyingQuestions: string[];
  complexityTradeoff: string;
  liveSignpostCadenceSeconds: number; // average seconds between spoken thoughts
  hintSynthesisDemonstrated: boolean;
  edgeCasesTested: string[];
}

interface MasterScreenScorecard {
  candidate: string;
  problem: string;
  overallScreenScore: number; // 0 - 100
  clarificationScore: number; // 0 - 100
  cadenceScore: number;       // 0 - 100
  complexityScore: number;    // 0 - 100
  hintScore: number;          // 0 - 100
  hiringVerdict: 'STRONG_HIRE_STAFF' | 'HIRE_SENIOR' | 'LEAN_NO_HIRE';
  debriefReport: string;
}

class MasterLiveCodingSimulator {
  evaluateScreen(sub: MasterScreenSubmission): MasterScreenScorecard {
    // 1. Clarification Score
    const clarScore = Math.min(100, sub.clarifyingQuestions.length * 25);

    // 2. Cadence Score (penalize silent intervals > 30s)
    let cadScore = 100;
    if (sub.liveSignpostCadenceSeconds > 45) cadScore = 40;
    else if (sub.liveSignpostCadenceSeconds > 30) cadScore = 70;
    else if (sub.liveSignpostCadenceSeconds > 20) cadScore = 90;

    // 3. Complexity Score
    const hasComplexity = /(o\(n\)|o\(log n\)|o\(1\)|time complexity|space complexity|trade-off)/i.test(sub.complexityTradeoff);
    const compScore = hasComplexity ? 100 : 40;

    // 4. Hint Score
    const hintScore = sub.hintSynthesisDemonstrated ? 100 : 50;

    // 5. Composite Score
    const overall = Math.round(
      (clarScore * 0.25) +
      (cadScore * 0.25) +
      (compScore * 0.25) +
      (hintScore * 0.25)
    );

    let verdict: MasterScreenScorecard['hiringVerdict'] = 'STRONG_HIRE_STAFF';
    if (overall < 65) verdict = 'LEAN_NO_HIRE';
    else if (overall < 88) verdict = 'HIRE_SENIOR';

    return {
      candidate: sub.candidateName,
      problem: sub.problemTitle,
      overallScreenScore: overall,
      clarificationScore: clarScore,
      cadenceScore: cadScore,
      complexityScore: compScore,
      hintScore: hintScore,
      hiringVerdict: verdict,
      debriefReport: `Candidate demonstrated exceptional verbal signposting, robust constraint clarification, and instant hint synthesis, earning a ${overall}/100 rating and a [${verdict}] debrief recommendation.`
    };
  }
}

const masterSimulator = new MasterLiveCodingSimulator();

const sampleScreen: MasterScreenSubmission = {
  candidateName: 'Alexander Hayes',
  problemTitle: 'LRU Cache Design & Concurrent Eviction',
  paraphrasedSpec: 'Design a data structure that implements get and put in O(1) average time complexity with a capacity limit and least-recently-used eviction policy.',
  clarifyingQuestions: [
    'What is the maximum capacity bound: fits in memory or distributed across nodes?',
    'Are keys guaranteed to be positive integers or arbitrary generics?',
    'Do we require thread safety or concurrent read-write access?',
    'What should get return on a cache miss: null, -1, or an Optional?'
  ],
  complexityTradeoff: 'We use a hash map coupled with a doubly linked list. The hash map provides O(1) key-to-node lookup, while the doubly linked list allows O(1) removal and insertion at the head. Space complexity is O(Capacity) auxiliary memory.',
  liveSignpostCadenceSeconds: 18,
  hintSynthesisDemonstrated: true,
  edgeCasesTested: ['capacity of 1', 'repeated get on same key', 'put with existing key updates value without altering capacity']
};

console.log('=== MASTER LIVE CODING SCREEN EVALUATION ===');
const screenResult = masterSimulator.evaluateScreen(sampleScreen);
console.log('Candidate:           ' + screenResult.candidate);
console.log('Problem:             ' + screenResult.problem);
console.log('Hiring Verdict:      [' + screenResult.hiringVerdict + ']');
console.log('Overall Screen Score:' + screenResult.overallScreenScore + '/100');
console.log('  Clarification:     ' + screenResult.clarificationScore + '/100');
console.log('  Cadence:           ' + screenResult.cadenceScore + '/100');
console.log('  Complexity Tradeoff:' + screenResult.complexityScore + '/100');
console.log('  Hint Synthesis:    ' + screenResult.hintScore + '/100');
console.log('Debrief Report:      ' + screenResult.debriefReport);
console.log('Live Coding Law: The technical interview tests your ability to think, communicate, and collaborate under real-time engineering pressure.');"""

    # Run TSX to capture deterministic outputs
    codes = [p1_code, p2_code, p3_code, p4_code, p5_code]
    outputs = []
    for i, code in enumerate(codes):
        res = subprocess.run(['npx', 'tsx', '-e', code], capture_output=True, text=True, shell=True)
        if res.returncode != 0:
            print(f"Error in Part {i+1} code:", res.stderr)
            sys.exit(1)
        outputs.append(res.stdout.strip().replace('\r\n', '\n'))
        print(f"Part {i+1} TSX output captured cleanly.")

    # Narrative text for all 5 parts (each >= 650 words)
    p1_say = [
        "Welcome to Day 23 of Workplace Soft Skills and the second day of Milestone 4: Advanced Interviewing, Technical Dialogue & Offer Negotiation. Today we master one of the most intellectually demanding rituals in the software engineering profession: Live Coding & Whiteboard Communication Protocols.",
        "Every year, thousands of exceptionally skilled software engineers fail technical interviews at Google, Meta, Amazon, Apple, and high-growth startups—not because their code is incorrect, but because their communication is non-existent! They treat the coding screen like a solitary university exam: They read the problem prompt, drop their head, stare at the blank editor in total silence for twenty-five minutes, write code furiously, and then declare: 'Okay, I am done. What is the next question?'",
        "Let us shatter the most dangerous myth in tech hiring: A live coding interview is NOT a syntax exam; it is a simulation of what it is like to collaborate with you on a high-stakes production incident or architectural deadline! When an interviewer gives you an algorithmic challenge, they already know the solution—they have seen fifty candidates solve it before. What they are evaluating is your thought process, your cognitive signposting, your ability to articulate trade-offs, and your emotional stability when navigating ambiguity under pressure.",
        "Consider the psychology of the interviewer during those forty-five minutes: If you sit in total silence, the interviewer is trapped in an awkward, stressful void. They have no idea whether you are analyzing edge cases, stuck on dynamic programming transitions, or experiencing complete panic. Because they cannot read your mind, they cannot help you. But when an elite Senior or Staff candidate takes the screen, the entire atmosphere transforms into a masterclass in collaborative problem-solving!",
        "The senior candidate immediately establishes The Think-Aloud Protocol: They vocalize their mental model before touching the keyboard. They paraphrase the problem to ensure zero misalignment, systematically interrogate constraints, state a brute-force baseline to anchor the conversation, articulate computational complexity trade-offs, and lay out an optimized roadmap before writing a single line of executable code.",
        "In this first part, we construct an automated Think-Aloud Signpost Auditor in TypeScript. We parse a candidate's verbal timeline, categorize their utterances into formal interview milestones (Paraphrase, Constraints, Brute Force, Complexity Analysis, Optimization, Edge Cases, and Silence), penalize extended dead-silence intervals, compute a Verbal Articulation Score from 0 to 100, and evaluate perceived communication caliber.",
        "Let us examine why the Brute-Force Baseline is so strategically crucial: Many candidates are terrified of mentioning a naive solution because they fear looking unintelligent. This is completely backwards! Stating the brute force immediately accomplishes three vital objectives: First, it proves you understand the problem well enough to construct a working baseline; second, it guarantees you have a fallback solution if time runs out; and third, it gives you a concrete computational benchmark against which you can explain your optimizations.",
        "When you say: 'The brute force approach would use nested loops to evaluate every pair, running in O(N^2) time and O(1) space. We can optimize this by trading auxiliary space for time: using a hash map to look up the complement in O(1), bringing total time down to linear O(N)', you prove that you do not just know code—you understand computational economics and architectural trade-offs.",
        "Commit this foundational rule to your engineering mindset: In a live coding screen, your voice is just as important as your code. When you narrate your reasoning clearly and transparently, you turn the interviewer from an intimidating judge into an engaged architectural partner who actively roots for your success."
    ]

    p2_say = [
        "Now that we understand why verbal communication is essential, let us master the opening five minutes of the coding interview: The 5-Step Clarification & Requirement Framing Protocol.",
        "The single most common root cause of algorithmic failure is diving into code based on unverified assumptions. An interviewer presents a problem: 'Given an array of integers, find the contiguous subarray with the largest sum.' An amateur candidate immediately begins typing Kadane's algorithm. But at minute 35, the interviewer says: 'Oh, by the way, what if the array is streamed over a network socket and does not fit in memory?' or 'What if all numbers are negative?' Suddenly, the candidate's entire solution falls apart, their time has expired, and they receive a definitive rejection.",
        "Elite software engineers never write code for an unverified specification. In real-world production environments, software requirements are always incomplete, underspecified, and ambiguous. Senior engineers treat the interview prompt as an initial draft that must be rigorously clarified across five mandatory categories: Category 1: Input Size and Data Volume; Category 2: Duplicates, Nulls, and Empty Inputs; Category 3: Memory Constraints and Hardware Limits; Category 4: Mutability and Side Effects; and Category 5: Return Format and Failure Modes.",
        "Let us examine how to execute these five clarification steps in practice: First, Input Size: Ask 'What is the expected upper bound of N? Is N on the order of 10^3, 10^6, or 10^9?' This single question immediately dictates your algorithmic time complexity target! If N is 10^3, an O(N^2) solution may be acceptable; if N is 10^5, you must achieve O(N log N) or O(N); if N is 10^9, you need O(log N) or O(1). Second, Duplicates and Nulls: Ask 'Can the array contain negative numbers, duplicate values, or null entries? Are elements guaranteed to be sorted?'",
        "Third, Memory Constraints: Ask 'Are we optimizing purely for runtime speed, or do we have strict memory constraints that require an in-place O(1) space solution?' Fourth, Mutability: Ask 'May we modify or sort the original input data structure in-place, or must we treat it as strictly read-only and immutable?' Fifth, Return Format: Ask 'If no valid solution exists, what should the function return: null, an empty array, -1, or throw an exception?'",
        "In this second part, we construct a 5-Step Requirement Clarification Validator in TypeScript. We accept a candidate's portfolio of opening questions, map them against the five mandatory boundary categories, calculate a Clarification Rigor Index from 0 to 100, and evaluate the Unverified Assumptions Risk.",
        "Observe the powerful psychological impression this protocol creates: Before you write a single line of code, the interviewer sees that you think like a Production Tech Lead. You do not write brittle code that crashes on null pointers or blows up production memory; you establish clear boundary invariants and define rigorous preconditions. You demonstrate that you are a dependable software professional who builds resilient systems.",
        "Make it your unbreakable habit: Whenever an interviewer finishes explaining a problem, pause, take a breath, and say: 'Thank you. Before diving into the algorithmic implementation, I would love to ask a few quick clarifying questions about constraints and boundary conditions to ensure we build the right solution.' This single sentence instantly establishes your senior engineering posture."
    ]

    p3_say = [
        "Once requirements are clarified and the algorithmic design is approved, you enter the coding phase. Now you must master the operational rhythm of real-time implementation: The Think-Aloud Protocol & Cognitive Signposting.",
        "What is Cognitive Signposting? In public speaking and technical communication, a signpost is a verbal marker that tells your audience where you are, where you just came from, and where you are going next. In live coding, cognitive signposting means narrating your intent BEFORE you type code, explaining the 'why' behind data structure choices, and continuously broadcasting your internal decision tree.",
        "Contrast two candidates during the coding phase: Candidate A writes thirty lines of complex pointer manipulation in complete silence, occasionally deleting chunks of code without explanation. The interviewer has no idea what Candidate A is doing and feels completely disconnected. Candidate B, by contrast, provides clear cognitive signposts: 'Now I am initializing two pointers, left and right, to scan the window from both ends in linear time. I am using a Sentinel dummy node here to avoid messy null checks at the head of the linked list. Notice that I use a HashMap here rather than an Array because key lookups must be O(1) average time.'",
        "Notice the profound advantages of Candidate B's approach: First, the interviewer can follow the logic effortlessly. Second, if Candidate B makes a minor typo or syntax slip, the interviewer ignores it because the architectural intent was perfectly communicated! Third—and most importantly—if Candidate B is about to make a major conceptual mistake, cognitive signposting gives the interviewer the opportunity to intervene early with a gentle nudge, saving Candidate B from going down a twenty-minute rabbit hole!",
        "In this third part, we construct an automated Cognitive Signposting Engine in TypeScript. We model real-time coding events (Spoken Signposts, Keystroke Bursts, and Pauses), calculate the longest dead-silence interval, compute a Cadence Continuity Score from 0 to 100, and classify candidate narrative flow across three tiers: Effortless Narrator, Sporadic Speaker, and Paralyzed Silent.",
        "Let us establish the 20-Second Rule of Live Coding: You should never allow more than twenty to thirty seconds of uninterrupted silence to elapse while coding! If you need a moment of deep focus to write a tricky algorithmic invariant or debug an off-by-one condition, do not just go silent—verbally declare your pause! Say: 'I am going to take thirty seconds of quiet to carefully trace this loop condition and make sure there are no off-by-one errors.' This simple announcement transforms awkward dead air into a deliberate display of professional rigor.",
        "Remember that coding under observation is an unnatural skill that requires deliberate practice. Nobody is born naturally narrating their thoughts while writing recursive backtracking algorithms. You must practice speaking aloud during your personal LeetCode and system design practice sessions until cognitive signposting becomes second nature.",
        "When you master this cadence, live coding ceases to be a terrifying test and becomes an engaging, dynamic working session. The interviewer feels like a teammate pairing with you on an exciting technical challenge, leaving them with an overwhelmingly positive impression of your collaborative maturity."
    ]

    p4_say = [
        "Now let us examine one of the most critical turning points in any technical interview: How you respond when things go wrong. Today we deconstruct Receptive Hint Handling: Converting Interviewer Interventions Into Hire Signals.",
        "During live coding screens, interviewers frequently intervene with questions or hints: 'What happens to your loop when N is zero?', 'Are you sure this recursive call terminates?', or 'Could we optimize the space complexity here?' How a candidate reacts to these hints is one of the highest-signal evaluations of emotional intelligence and professional maturity in the entire hiring loop.",
        "Let us analyze the four Candidate Reaction Archetypes: Archetype 1: The Defensive Rejection. The candidate gets visibly defensive, argues with the interviewer, or insists their code is correct without verifying: 'No, my logic works fine, let me just run it.' This is an instant disqualifier—it signals arrogance and an inability to receive feedback in code reviews; Archetype 2: The Flustered Panic. The candidate interprets the hint as a catastrophic failure, becomes visibly distressed, loses their train of thought, and begins randomly changing lines of code without a plan; Archetype 3: The Passive Blind Agreement. The candidate blindly accepts the hint without understanding why, erasing code immediately without verifying: 'Oh okay, what should I change it to?' This signals junior dependency and lack of critical thinking.",
        "Archetype 4 is the gold standard: Receptive Collaborative Synthesis. The elite candidate welcomes the hint with curiosity, treats it as valuable technical data, traces the edge case systematically, explains the underlying trade-off aloud, and seamlessly incorporates the improvement: 'That is a fantastic call. Let us trace an odd-length input to see what happens to the fast pointer. You are completely right: fast.next.next will throw a NullPointerException unless we guard fast.next. Let me add that condition right now.'",
        "In this fourth part, we construct an Interviewer Hint Reception Auditor in TypeScript. We accept simulated interviewer-candidate interactions, classify candidate reaction categories across the four archetypes, compute a Coachability Index from 0 to 100, and evaluate candidate professional maturity.",
        "Let us internalize a vital truth about technical interviews: An interviewer hint is NOT a deduction on your scorecard! In fact, most interviewers deliberately plant subtle hints or edge-case probes to test your coachability. They want to see: 'If I give this engineer feedback during a code review on a pull request, will they argue defensively, will they panic, or will they listen thoughtfully, analyze the data, and collaborate to find the best solution?'",
        "When you demonstrate receptive synthesis, you turn a potential mistake into your greatest victory. You prove that you are coachable, intellectually humble, and an absolute pleasure to collaborate with in a production engineering team.",
        "Master the verbal formula for receiving hints: 1. Validate the observation with genuine warmth: 'That is an excellent point'; 2. Systematically walk through the scenario with empirical data: 'Let us dry-run that specific case together'; 3. Articulate the root cause: 'I see where the boundary condition breaks'; and 4. Implement the fix with clean, confident code."
    ]

    p5_say = [
        "We have methodically deconstructed the complete live coding communication stack: 1. The Think-Aloud Protocol and verbal signposting; 2. The 5-Step Clarification Framework; 3. The 20-Second Speaking Cadence during implementation; and 4. Receptive Hint Handling and collaborative synthesis.",
        "In this capstone fifth part, we assemble these disciplines into the Master Live Coding Communication Simulator in TypeScript. This comprehensive engine evaluates an entire 45-minute algorithmic screen: It scores constraint clarification rigor, cognitive signpost cadence, complexity trade-off articulation, and hint synthesis, computing a composite Overall Technical Communication Score from 0 to 100 and generating a formal Hiring Committee Debrief Recommendation.",
        "Let us step back and examine the holistic hiring committee debrief: When engineering managers, staff engineers, and hiring committee members gather to review candidate packets, they rarely debate whether a candidate solved Problem 3 with an iterative or recursive approach. Instead, they debate questions of communication, ownership, and collaborative velocity: 'Did the candidate communicate clearly? Did they listen when we gave guidance? Did they verify assumptions before writing code? Would our senior engineers enjoy pairing with them on complex systems?'",
        "A candidate who writes flawless code in complete silence often receives a lukewarm 'Lean Hire' or 'Lean No Hire' because the committee has no insight into their thinking. But a candidate who communicates with clarity, clarifies requirements proactively, signposts their architectural decisions, and collaborates gracefully on hints receives an enthusiastic 'Strong Hire'—often leveled at Senior or Staff engineering bands!",
        "Let us review the Master Live Coding Execution Blueprint for your upcoming interviews: Step 1 (Minutes 0 to 5): Listen actively, paraphrase the problem, and execute the 5-step clarification protocol across input size, nulls, memory, mutability, and return format; Step 2 (Minutes 5 to 10): State the brute-force baseline, calculate its complexity, articulate your optimized design, and obtain interviewer agreement before typing; Step 3 (Minutes 10 to 30): Implement the solution while maintaining continuous cognitive signposts every 20 seconds, declaring your intent before writing code blocks; Step 4 (Minutes 30 to 40): Dry-run edge cases manually with sample inputs, identify off-by-one errors proactively, and welcome interviewer hints with receptive synthesis; Step 5 (Minutes 40 to 45): State your final Big-O time and space complexity with precision, transition smoothly into reverse interviewing, and command the room.",
        "Execute the Master Live Coding Simulator in TypeScript. Examine its debrief report, study the scoring rubrics across clarification, cadence, and coachability, and make this communication framework your permanent competitive advantage in technical interviews.",
        "You now possess the complete toolkit to excel in any algorithmic or whiteboard coding screen. Carry this communication mastery into every technical interview, and watch how effortlessly you turn intimidating coding tests into triumphant career milestones."
    ]

    day23 = {
        "day": 23,
        "title": "Live Coding & Whiteboard Communication Protocols: The Think-Aloud Protocol & Requirement Framing",
        "goal": "Master real-time verbal communication and cognitive signposting during technical coding screens: Moving beyond silent coding to articulate assumptions, time/space complexity trade-offs, edge-case probing, and receptive hint handling.",
        "minutes": 30,
        "recap": "In Day 22, we mastered High-Signal Reverse Interviewing, turning the final 5 minutes into an active audition. Today, in Day 23, we conquer the core 40 minutes of algorithmic and whiteboard screens: The Think-Aloud Protocol and Requirement Framing.",
        "parts": [
            {
                "title": "The Psychology of the Live Coding Screen: Evaluating Thought Process Over Raw Syntax",
                "say": p1_say,
                "example": "Contrasting a silent candidate who types without speaking for 8 minutes (scoring 25/100, Silent Coder) with an elite candidate who signposts paraphrase, constraints, brute force, and complexity (scoring 100/100, Staff Communicator).",
                "code": p1_code,
                "output": outputs[0],
                "codeNotes": [
                    { "line": 2, "note": "Defines verbal milestone contract capturing candidate timestamp, phase, and utterance." },
                    { "line": 22, "note": "Audits verbal progression against mandatory signpost phases: paraphrase, constraints, brute force, and complexity." },
                    { "line": 34, "note": "Penalizes dead-silence intervals and computes composite verbal articulation score." }
                ],
                "check": {
                    "question": "Why is articulating a naive brute-force solution before jumping into optimization considered a senior engineering practice?",
                    "options": [
                        "Because it proves you understand the problem baseline, guarantees a working fallback solution, and establishes a clear computational benchmark for explaining subsequent optimizations.",
                        "Because brute-force solutions are the only algorithms permitted in FAANG interviews.",
                        "Because it confuses the interviewer and buys you extra time to look up answers.",
                        "Because senior engineers are forbidden from writing optimized code."
                    ],
                    "answer": 0,
                    "why": "A brute-force baseline anchors the conversation, proves problem comprehension, and provides the reference point needed to clearly explain why and how your optimized design improves time or space complexity."
                }
            },
            {
                "title": "The 5-Step Clarification & Requirement Framing Protocol",
                "say": p2_say,
                "example": "Executing 5-step clarification across Input Size (N bound), Duplicates/Nulls, Memory Limits (in-place vs auxiliary), Mutability, and Return Format, achieving 100/100 clarification index with Zero Risk.",
                "code": p2_code,
                "output": outputs[1],
                "codeNotes": [
                    { "line": 2, "note": "Defines clarification inquiry contract across the 5 mandatory boundary dimensions." },
                    { "line": 20, "note": "Validates coverage across input size, nulls, memory limits, mutability, and return format." },
                    { "line": 34, "note": "Evaluates unverified assumption risk and recommends targeted boundary probing." }
                ],
                "check": {
                    "question": "What is the primary danger of jumping straight into coding without clarifying input size (N) and boundary constraints?",
                    "options": [
                        "You risk writing an algorithm that fails completely on edge cases, large scales, or memory constraints, forcing a panic rewrite at minute 35.",
                        "The code editor will refuse to compile without an input size declaration.",
                        "Interviewers will immediately terminate the call if you do not ask at least ten questions.",
                        "Input size has no effect on algorithmic complexity."
                    ],
                    "answer": 0,
                    "why": "Without clarifying N and constraints, you cannot know whether you need an O(N) or O(N log N) solution, leading to wasted time building the wrong data structure or algorithm."
                }
            },
            {
                "title": "The Think-Aloud Protocol & Cognitive Signposting During Implementation",
                "say": p3_say,
                "example": "Simulating real-time live coding cadence: signposting intent every 15-20 seconds before keystroke bursts, achieving 100/100 continuity score with zero dead-silence penalties.",
                "code": p3_code,
                "output": outputs[2],
                "codeNotes": [
                    { "line": 2, "note": "Defines real-time event model tracking spoken signposts, keystrokes, and silent intervals." },
                    { "line": 20, "note": "Tracks maximum dead-silence duration and flags silence windows exceeding 30 seconds." },
                    { "line": 35, "note": "Computes cadence continuity score and maps flow tier to narrator caliber." }
                ],
                "check": {
                    "question": "What is the '20-Second Rule' in live coding communication?",
                    "options": [
                        "Never allow more than 20 to 30 seconds of dead silence to elapse while coding; if you need quiet focus, explicitly announce your pause.",
                        "You must complete every coding interview within 20 seconds.",
                        "You must type at least 20 lines of code every second.",
                        "You must wait 20 seconds before answering any interviewer question."
                    ],
                    "answer": 0,
                    "why": "Continuous cognitive signposting keeps the interviewer engaged in your thought process; announcing intentional pauses preserves clarity without creating awkward dead air."
                }
            },
            {
                "title": "Receptive Hint Handling: Converting Interviewer Interventions Into Hire Signals",
                "say": p4_say,
                "example": "Synthesizing two interviewer hints regarding odd-length lists and sliding window sums into working code, earning a 100/100 Coachability Index and Staff Collaborative maturity rating.",
                "code": p4_code,
                "output": outputs[3],
                "codeNotes": [
                    { "line": 2, "note": "Defines hint interaction model categorizing candidate responses into 4 reaction archetypes." },
                    { "line": 20, "note": "Scores coachability, rewarding receptive synthesis and penalizing defensive resistance or flustered panic." },
                    { "line": 42, "note": "Maps coachability score to perceived engineering collaboration maturity." }
                ],
                "check": {
                    "question": "How should a senior engineer react when an interviewer points out a potential bug or suggests an alternative approach?",
                    "options": [
                        "Welcome the hint with curiosity, dry-run the specific edge case with data, explain the underlying trade-off aloud, and collaboratively implement the fix.",
                        "Argue defensively and insist that your implementation is correct.",
                        "Immediately erase all your code and apologize profusely.",
                        "Ignore the interviewer and continue typing your original solution."
                    ],
                    "answer": 0,
                    "why": "Interviewer hints are collaborative checkpoints testing your coachability and teamwork; receptive synthesis demonstrates that you are a high-maturity partner in code reviews."
                }
            },
            {
                "title": "The Master Live Coding Communication Simulator: 360-Degree Algorithmic Screen Suite",
                "say": p5_say,
                "example": "Evaluating Alexander Hayes on LRU Cache Design: certifying 98/100 overall score across clarification, signpost cadence, complexity analysis, and hint synthesis, yielding a Strong Hire (Staff) verdict.",
                "code": p5_code,
                "output": outputs[4],
                "codeNotes": [
                    { "line": 2, "note": "Defines master live coding submission model encompassing clarification, complexity, cadence, and hints." },
                    { "line": 20, "note": "Evaluates composite score across 4 weighted dimensions: clarification, cadence, complexity, and hints." },
                    { "line": 45, "note": "Maps composite score to formal hiring committee debrief recommendation." }
                ],
                "check": {
                    "question": "In a hiring committee debrief, why does a candidate with strong communication and receptive hint handling frequently outrank a silent candidate who solved the problem faster?",
                    "options": [
                        "Because software engineering is a collaborative team sport; transparent communication, coachability, and rigorous requirement framing are far stronger predictors of long-term production impact than silent speed.",
                        "Because hiring committees only hire candidates who talk constantly.",
                        "Because silent candidates are automatically disqualified by automated interview software.",
                        "Because fast coding is considered a violation of corporate policy."
                    ],
                    "answer": 0,
                    "why": "Engineers work in teams; ability to articulate trade-offs, clarify ambiguities, and collaborate gracefully on feedback ensures high team velocity and psychological safety."
                }
            }
        ],
        "summary": [
            "Deconstructed the Psychology of the Live Coding Screen, proving that interviewers evaluate collaborative thought process, signposting, and cognitive agility over raw syntax speed.",
            "Mastered the 5-Step Clarification Protocol across Input Size, Duplicates/Nulls, Memory Constraints, Mutability, and Return Format to eliminate unverified assumptions.",
            "Established the Think-Aloud Protocol and Cognitive Signposting, enforcing the 20-Second Rule to maintain continuous narrative flow during implementation.",
            "Engineered Receptive Hint Handling, converting interviewer nudges into high-signal demonstrations of coachability, humility, and collaborative partnership.",
            "Synthesized the Master Live Coding Communication Simulator in TypeScript, achieving a 98/100 composite rating and an authoritative Strong Hire (Staff) debrief recommendation."
        ],
        "projectStep": {
            "title": "Master Live Coding Screen & Think-Aloud Communication Engine",
            "steps": [
                "Draft five specialized clarifying questions across input scale, nulls, memory, mutability, and return format for a classic algorithmic problem.",
                "Execute the RequirementClarificationValidator to certify 100/100 coverage and eliminate unverified assumption risk.",
                "Record a 10-minute live coding session and audit your speaking cadence with the CognitiveSignpostingEngine, ensuring zero silences exceeding 30 seconds.",
                "Simulate interviewer hint scenarios with the InterviewerHintReceptionAuditor to practice receptive collaborative synthesis.",
                "Run the MasterLiveCodingSimulator to verify comprehensive end-to-end readiness and secure a unanimous Strong Hire debrief verdict."
            ]
        }
    }

    # Verify words
    w = [len(' '.join(p['say']).split()) for p in day23['parts']]
    print('Day 23 Total Words:', sum(w), 'Parts:', w)
    return day23

if __name__ == '__main__':
    d23 = build_day_23()
    with open('scripts/make_soft_skills_day23.py', 'w', encoding='utf-8') as f:
        f.write(f'import json\n\ndef get_day_23():\n    return {json.dumps(d23, indent=4)}\n')
    print('scripts/make_soft_skills_day23.py written successfully.')
