export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export function buildEnrichedDayQuests(prefix: string, dayNum: number, cfg: DayConfig) {
  // ── Part 1: Story & Real-World Industry Context ─────────────────────────
  const teachingTask1 = {
    id: `${prefix}-lecture1-day-${dayNum}`,
    title: `Day ${dayNum} Part 1: ${cfg.title} — Real-World Architecture & Story Context`,
    desc: `In real production software engineering, ${cfg.title.toLowerCase()} is not just a theoretical concept — it is a critical building block used by high-scale tech companies like Zomato, Swiggy, Netflix, Amazon, and Google.

Imagine building a real-world digital system. Every component must communicate clearly, process input payload state without crashing, and guarantee data consistency under high traffic. ${cfg.desc}

Why do we need this concept? In large production systems, messy unorganized code leads to memory leaks, race conditions, security vulnerabilities, and system downtime. By mastering ${cfg.title.toLowerCase()}, you learn to structure logic cleanly, prevent edge-case failures, and write self-documenting code that team members can audit easily.

Visualizing the system flow: Think of how an order flows on Amazon or Swiggy. When a user taps 'Checkout', the app doesn't just calculate a sum — it validates user authentication tokens, verifies inventory lock status, computes GST and delivery fees, and updates database state in a transaction audit boundary. Step 1: Input state is validated. Step 2: Transformation logic is applied. Step 3: Output payload is safely dispatched. Every step relies directly on the principles of ${cfg.title.toLowerCase()}.`,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: [
      `Real-world relevance of ${cfg.title}: Used in production microservices and scalable enterprise apps.`,
      `System Architecture visualization: How data flows through input validation, logic processing, and output dispatching.`,
      `Engineering rationale: Why clean structure prevents system crashes, memory bloat, and security flaws.`
    ],
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };

  // ── Part 2: Syntax Mechanics & Line-by-Line Execution ───────────────────
  const teachingTask2 = {
    id: `${prefix}-lecture2-day-${dayNum}`,
    title: `Day ${dayNum} Part 2: ${cfg.title} — Syntax Mechanics & Line-by-Line Execution`,
    desc: `Let us break down the exact syntax, keywords, parameters, and memory mechanics behind ${cfg.title.toLowerCase()} line by line.

Core Mechanics Breakdown:
1. Declarations & Types: Every variable, function, or schema definition establishes a strict memory contract. You declare parameters clearly, specifying expected data types and return bounds.
2. Execution Order: Code executes in strict sequential order from top to bottom. Line 1 allocates memory or validates inputs; Line 2 applies transformation operations; Line 3 evaluates conditional boundaries or loop steps; Line 4 produces the final return state or side effect.
3. Memory Representation (Stack vs Heap): Primitive values and function execution call-frames live on the CPU execution Stack for instant speed. Dynamic arrays, objects, and reference pointers live on the Heap memory area.

Key Syllabus Principles:
${cfg.syllabus.map((s, idx) => `Step ${idx + 1}: ${s}`).join('\n')}

Step-by-Step Code Walkthrough:
Always verify parameter bounds before processing values. If an input is invalid, zero, or null, throw a descriptive error or return a safe default fallback. Never allow invalid data to propagate deeper into downstream microservice layers.`,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };

  // ── Part 3: Workshop, Edge Cases, Pitfall Warnings & Mental Models ──────
  const teachingTask3 = {
    id: `${prefix}-lecture3-day-${dayNum}`,
    title: `Day ${dayNum} Part 3: ${cfg.title} — Practical Workshop, Mental Models & Pitfall Warnings`,
    desc: `In this practical workshop, we examine edge cases, off-by-one errors, performance traps, and mental models to help you visualize ${cfg.title.toLowerCase()} effortlessly.

Mental Model Visualization Guide:
- Think of array indices like post office boxes labeled 0 to N-1. Accessing index N causes an Out-Of-Bounds index error.
- Think of conditional logic like a multi-lane highway fork: the computer evaluates the top condition first. If satisfied, it takes that lane immediately and bypasses all lower lanes.
- Think of loop execution like a factory conveyor belt: every iteration moves one item down the line, applies transformation rules, and increments the progress counter.

Common Production Pitfalls & Warnings:
1. Off-by-One Traps: In 0-indexed structures, the last element is at length - 1. Loop conditions must use '< length' instead of '<= length'.
2. Type Mismatch & Overflow Traps: Ensure math operations involving integer calculations do not truncate precision or overflow integer limits.
3. Unhandled Null / Undefined Parameters: Always guard against missing input parameters before calling methods or accessing properties.

Mastering these boundary checks separates beginner coders from senior software engineers who write bulletproof production code.`,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: [
      `Mental Model Visualizations: Arrays as labeled boxes, conditionals as highway forks, loops as conveyor belts.`,
      `Common Production Pitfalls: Off-by-one index bugs, precision truncation, and missing guard checks.`,
      `Senior Engineering Standard: Defensive coding patterns, boundary verification, and clean error handling.`
    ],
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };

  // ── Coding Exam Task ───────────────────────────────────────────────────
  const examTask = {
    id: `${prefix}-exam-day-${dayNum}`,
    title: `Day ${dayNum} Exam: ${cfg.eTitle}`,
    desc: cfg.eDesc,
    type: "coding" as const,
    requiresAvatar: false,
    starterCode: cfg.eStarter,
    hint: cfg.eHint,
    testSuite: cfg.eTest,
    skillCategory: "programming" as const,
    xp: 120,
    pins: 6
  };

  // ── Assignment Task ────────────────────────────────────────────────────
  const assignmentTask = {
    id: `${prefix}-assign-day-${dayNum}`,
    title: `Day ${dayNum} Assignment: ${cfg.aTitle}`,
    desc: cfg.aDesc,
    type: "coding" as const,
    requiresAvatar: false,
    starterCode: cfg.aStarter,
    hint: cfg.aHint,
    testSuite: cfg.aTest,
    skillCategory: "programming" as const,
    xp: 150,
    pins: 8
  };

  return [teachingTask1, teachingTask2, teachingTask3, examTask, assignmentTask];
}
