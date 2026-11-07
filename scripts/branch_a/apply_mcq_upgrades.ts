import fs from 'fs';
import path from 'path';
import { COMP_FUND_LONG_LESSONS } from '../../src/lib/data/compFundLongLessons';
import { SOFT_SKILLS_LONG_LESSONS } from '../../src/lib/data/softSkillsLongLessons';

// 1. COMP_FUND upgrades for Days 1 & 2
const compFundUpgrades: Record<string, any> = {
  // Day 1
  "1_0": {
    question: "What distinguishes path resolution in a POSIX unified single-root Virtual File System (VFS) from drive-letter architectures?",
    options: [
      "POSIX path resolution traverses a single logical tree rooted at /, resolving intermediate directory inodes via namei() without coupling to physical partition identifiers",
      "POSIX paths resolve directly via physical disk block sector offsets without consulting directory inode structures",
      "POSIX paths require user applications to maintain explicit hardware driver mappings for each mounted volume",
      "POSIX path traversal requires linear searches through the entire physical filesystem on every file open call"
    ],
    answer: 0,
    why: "The POSIX VFS abstracts physical block devices behind a single root directory tree. The kernel resolves paths by traversing directory inodes in-memory via namei(), decoupling application logic from underlying storage geometry."
  },
  "1_1": {
    question: "What kernel mechanism causes ls -l on a directory with millions of files to induce severe disk I/O latency?",
    options: [
      "Each file entry requires an independent stat() system call to query inode metadata blocks from storage, triggering random disk reads",
      "The ls utility loads the entire binary content of every file into user-space heap memory before sorting",
      "The kernel locks the global process table in uninterruptible sleep state D for the duration of the directory read",
      "The directory entry buffer requires synchronous writeback to storage to update filesystem access timestamps"
    ],
    answer: 0,
    why: "Executing ls -l forces a secondary stat() system call for every file in the directory to retrieve permission modes, timestamps, and link counts from disk inodes, causing massive random I/O when metadata is not cached in RAM."
  },
  "1_2": {
    question: "Why does the C runtime library switch standard output (stdout) from line-buffering to block-buffering when redirected to a file or pipe?",
    options: [
      "To minimize costly write() system calls and context switches by aggregating payloads into 4KB or 8KB buffer blocks",
      "To enforce thread-safe mutual exclusion locks on the terminal device driver",
      "Because the Linux page cache cannot store data unless submitted in exact 64KB chunks",
      "To allow the operating system kernel to encrypt stream payloads prior to disk serialization"
    ],
    answer: 0,
    why: "Line-buffering flushes on newlines to provide immediate terminal interactivity, whereas block-buffering buffers several kilobytes into user space to minimize expensive system call transitions when writing bulk data to disk or pipes."
  },
  "1_3": {
    question: "How does the Linux kernel enforce backpressure when a fast producer pipes data into a slow consumer via an anonymous pipe?",
    options: [
      "When the 64KB kernel ring buffer fills, the scheduler suspends the producer's write() call until the consumer reads data",
      "The kernel spills excess stream bytes onto temporary disk storage in the /tmp partition",
      "The kernel dynamically doubles the producer process nice priority to throttle CPU execution time",
      "The kernel delivers an immediate SIGBUS signal that aborts the producer process without recovery"
    ],
    answer: 0,
    why: "Anonymous pipes use a fixed-size kernel ring buffer (typically 65,536 bytes). When the buffer is full, subsequent write() calls block automatically, providing hardware-efficient backpressure that prevents memory exhaustion."
  },
  "1_4": {
    question: "Why does the POSIX uniq utility require input streams to be sorted beforehand to achieve complete deduplication?",
    options: [
      "Because uniq operates as a single-pass streaming filter with O(1) memory, comparing each line only to its immediate predecessor",
      "Because uniq requires input lines to be indexed by cryptographic SHA-256 hashes",
      "Because the Linux Virtual File System rejects unsorted text buffers during pipe transmission",
      "Because sort generates an in-memory B-tree index required by uniq to validate record schemas"
    ],
    answer: 0,
    why: "The uniq utility maintains only the previous line in memory to achieve O(1) space efficiency. It cannot detect identical lines separated by intervening text; sorting establishes adjacent ordering so all duplicates are collapsed."
  },

  // Day 2
  "2_0": {
    question: "In POSIX file permissions, why is the execute (x) bit mandatory on a directory for a process to open files within it?",
    options: [
      "The execute bit grants traversal permission, allowing the kernel to resolve directory entries and access contained inodes",
      "The execute bit instructs the CPU to load the directory into instruction cache as an ELF binary",
      "Without the execute bit, directory file descriptors cannot be closed by user-space runtimes",
      "The execute bit enables kernel copy-on-write page deduplication for directory data blocks"
    ],
    answer: 0,
    why: "On directories, the execute bit represents traversal privilege rather than program execution. Without 'x' permission, the kernel's namei() path resolver cannot search the directory to locate child inodes."
  },
  "2_1": {
    question: "What kernel mechanism allows head -n 10 at the end of a long pipeline to terminate upstream producers early without reading the entire dataset?",
    options: [
      "head exits and closes its stdin, causing the kernel to deliver a SIGPIPE signal to the upstream process on its next write()",
      "head sends an asynchronous SIGKILL directly to the parent process group via the terminal driver",
      "The kernel rewinds the storage device read head to the beginning of the block partition",
      "The upstream process file descriptor table is immediately zeroed out in kernel task memory"
    ],
    answer: 0,
    why: "When head completes its requested line count, it closes its file descriptor and exits. Any subsequent write() into the broken pipe by an upstream producer triggers an EPIPE error or SIGPIPE signal, cleanly halting computation."
  },
  "2_2": {
    question: "Why does grep -F (fixed strings) significantly outperform standard regular expression grep during forensic log analysis?",
    options: [
      "It bypasses regular expression finite automaton compilation and utilizes vectorized Aho-Corasick or Boyer-Moore string algorithms",
      "It mounts the log file directly into CPU L1 cache using hardware virtualization instructions",
      "It pre-compiles log files into compressed SQLite database tables before executing queries",
      "It runs exclusively in kernel space via an eBPF filter injected into the storage controller"
    ],
    answer: 0,
    why: "By treating search patterns as literal fixed strings rather than regular expressions, grep -F avoids NFA/DFA state machine evaluation overhead and leverages SIMD-accelerated string scanning algorithms."
  },
  "2_3": {
    question: "Why might wc -l return a count that is one less than the number of visible lines rendered in a text editor?",
    options: [
      "Because wc -l counts ASCII newline bytes (0x0A); if the final line lacks a trailing newline, it is not counted",
      "Because wc -l skips the first line assuming it contains column headers",
      "Because the C standard library subtracts one from line counters to prevent buffer overflow",
      "Because text editors automatically inject a synthetic carriage return at byte offset zero"
    ],
    answer: 0,
    why: "The wc utility strictly counts the recurrence of the newline character (0x0A). If an incomplete final line ends at EOF without a terminating newline byte, it does not trigger the line counter."
  },
  "2_4": {
    question: "How does the shell operator && prevent cascading failures in multi-stage deployment scripts compared to ;?",
    options: [
      "&& evaluates the preceding command's exit code ($?) and short-circuits execution if the status is non-zero",
      "&& runs both commands in isolated background threads with synchronized memory barriers",
      "&& rolls back all filesystem modifications if the secondary command encounters a runtime exception",
      "; enforces atomic transactions across commands whereas && allows non-deterministic execution"
    ],
    answer: 0,
    why: "The double ampersand && implements boolean short-circuit evaluation: it checks $? after each command and executes the next command only if the preceding command returned exit code 0 (success)."
  }
};

// 2. SOFT_SKILLS upgrades for Days 1, 2, and 4
const softSkillsUpgrades: Record<string, any> = {
  // Day 1
  "1_0": {
    question: "In executive STAR interviews, why is over-indexing on team efforts ('we') considered a critical failure mode compared to articulating personal ownership ('I')?",
    options: [
      "Interviewers evaluate individual technical agency, architectural trade-offs owned, and specific contributions rather than team ambiguity",
      "Using 'we' triggers an automated disqualification filter in applicant tracking systems",
      "Team collaboration is considered a negative liability in senior and staff engineering roles",
      "Corporate legal frameworks prohibit candidates from mentioning colleagues during interviews"
    ],
    answer: 0,
    why: "Senior interview loops specifically evaluate personal technical competence, decision-making ownership, and individual leverage. Speaking exclusively about 'we' obscures your personal contribution."
  },
  "1_1": {
    question: "Why does the Bottom-Line-Up-Front (BLUF) principle dramatically increase alignment when presenting to C-suite technical leaders?",
    options: [
      "It frames the strategic decision, capital ask, or risk immediately, reducing cognitive load before presenting supporting data",
      "It prevents executive stakeholders from interrupting the presentation with unexpected technical questions",
      "It allows presenters to skip preparing supporting architecture diagrams and benchmark data",
      "Executive presentation software automatically terminates slide decks that exceed sixty seconds"
    ],
    answer: 0,
    why: "Executives make decisions under heavy cognitive constraints. Stating the primary recommendation or conclusion first grounds the conversation and ensures that all subsequent supporting evidence is interpreted in context."
  },
  "1_2": {
    question: "What architectural risk is introduced when an engineer jumps into drawing database schemas without clarifying functional and non-functional requirements?",
    options: [
      "It risks solving the wrong scaling bottleneck, leading to over-engineered distributed systems that misalign with actual throughput and availability SLAs",
      "It forces the compiler to re-generate database migration scripts during the interview",
      "It violates UML modeling standards and triggers automatic candidate rejection",
      "It exposes backend API endpoints to unauthenticated cross-origin resource sharing vulnerabilities"
    ],
    answer: 0,
    why: "System design problems are deliberately ambiguous. Designing without clarifying throughput, latency budgets, read/write ratios, and consistency requirements inevitably results in brittle or over-engineered architectures."
  },
  "1_3": {
    question: "Why does punitive finger-pointing in incident retrospectives actively compromise long-term production reliability?",
    options: [
      "Blame incentivizes engineers to conceal operational anomalies and near-misses, preventing teams from implementing systemic automated safeguards",
      "Punitive reviews cause cloud hosting providers to revoke enterprise uptime service level agreements",
      "Blameless post-mortems are mandated by international ISO 27001 data protection standards",
      "Identifying human error automatically resets team agile sprint velocity metrics to zero"
    ],
    answer: 0,
    why: "A blame-oriented culture fosters fear and concealment. In contrast, blameless post-mortems acknowledge that humans are fallible and focus engineering effort on building resilient systems with automated guardrails."
  },
  "1_4": {
    question: "Why is a well-defined BATNA (Best Alternative to a Negotiated Agreement) the single most decisive factor in compensation negotiation?",
    options: [
      "It establishes an objective, uncompromised walk-away threshold that anchors market leverage and prevents fear-based concession making",
      "It legally binds the prospective employer to match industry percentile salary bands published by compensation databases",
      "It allows candidates to bypass technical background checks and coding assessments",
      "It converts equity stock option grants into guaranteed cash bonuses upon signing"
    ],
    answer: 0,
    why: "BATNA represents your actual walk-away power. Without a viable alternative, candidates negotiate from perceived vulnerability; with a strong BATNA, negotiations remain grounded in market reality and objective value."
  },

  // Day 2
  "2_0": {
    question: "What distinguishes Minto Pyramid document structure from traditional academic engineering prose?",
    options: [
      "Minto structure presents the core thesis and actionable recommendation first, followed by MECE (mutually exclusive, collectively exhaustive) logic pillars",
      "Minto structure presents historical background and implementation chronologies before drawing any conclusions",
      "Minto structure requires engineering proposals to be formatted strictly as flowchart diagrams without prose",
      "Minto structure eliminates data citations and benchmarks in favor of qualitative emotional appeals"
    ],
    answer: 0,
    why: "The Minto Pyramid inverts traditional academic writing by leading with the apex conclusion, followed by supporting arguments grouped into mutually exclusive, collectively exhaustive categories."
  },
  "2_1": {
    question: "What does the 'Commit' phase of 'Disagree and Commit' strictly demand from an engineer whose architectural proposal was rejected?",
    options: [
      "Pivoting 100% of effort toward executing the chosen path with full dedication, eliminating passive resistance or waiting for failure",
      "Continuing to write internal dissent memos while refactoring code to align with their original design",
      "Escalating the decision to the Board of Directors while halting sprint development",
      "Demanding that their name be removed from the service git commit history and documentation"
    ],
    answer: 0,
    why: "Disagree and Commit allows vigorous intellectual debate during decision-making, but requires complete, unreserved alignment once a decision is finalized to ensure high team velocity and unified execution."
  },
  "2_2": {
    question: "How does the Iron Triangle (Scope, Time, Resources) guide engineering leadership when business stakeholders mandate an immovable launch date?",
    options: [
      "It demonstrates that holding time and quality fixed requires either reducing feature scope or increasing resource allocation",
      "It proves that adding more software developers to a late project will linearly accelerate the completion date",
      "It requires engineers to work continuous overtime while holding all deliverables constant",
      "It automatically postpones marketing release dates through automated CI/CD pipeline triggers"
    ],
    answer: 0,
    why: "The Iron Triangle dictates trade-off physics: you cannot hold Scope, Time, and Resources fixed simultaneously without sacrificing quality. When time is fixed, scope must be pruned or resources increased."
  },
  "2_3": {
    question: "Why should software engineering teams delegate stylistic formatting and import conventions entirely to automated CI linters rather than human reviewers?",
    options: [
      "It preserves human reviewer cognitive bandwidth for architectural invariants, concurrency safety, and edge-case correctness while eliminating bikeshedding",
      "Human code reviewers are legally prohibited from inspecting whitespace indentation in enterprise repositories",
      "Automated linters compile TypeScript code directly into native ARM64 machine instructions",
      "It allows developers to merge unreviewed pull requests directly into production branches"
    ],
    answer: 0,
    why: "Bikeshedding over syntax formatting drains reviewer attention. Automating style checks via linters frees engineers to focus on architectural soundness, state management, security boundaries, and test coverage."
  },
  "2_4": {
    question: "Why is a 'lighthouse pilot' with a single forward-leaning team more effective for cross-org platform adoption than a top-down mandate?",
    options: [
      "It generates empirical proof of developer productivity wins and irons out tooling friction before scaling, fostering voluntary organic adoption",
      "Top-down mandates require approval from external regulatory compliance agencies",
      "Lighthouse pilots bypass enterprise code security audits and container vulnerability scans",
      "Other engineering teams are legally required to adopt platforms developed by pilot teams"
    ],
    answer: 0,
    why: "Mandates breed resentment and resistance. Co-developing a successful migration with an early-adopter partner creates undeniable production proof and eliminates developer friction, driving organic adoption."
  },

  // Day 4
  "4_0": {
    question: "How does focusing on 'interests' rather than 'positions' resolve deadlocks in technical cross-team negotiations?",
    options: [
      "Interests uncover the underlying technical requirements and business outcomes, unlocking multiple creative architectural compromises",
      "Focusing on interests forces the opposing team to abandon their technical requirements unconditionally",
      "Positions are legally binding in software engineering whereas interests are purely informal guidelines",
      "It allows engineering teams to bypass budget constraints by transferring costs to marketing departments"
    ],
    answer: 0,
    why: "Positions are rigid stances ('We must use Kafka'); interests are the underlying needs ('We need event replayability and low latency'). Uncovering interests allows architects to devise solutions satisfying both parties."
  },
  "4_1": {
    question: "What fundamental capital allocation error is prevented by including 'Effort' in the RICE prioritization formula?",
    options: [
      "It prevents organizations from prioritizing massive vanity initiatives that yield modest impact relative to the engineering resources consumed",
      "It guarantees that engineering teams never undertake projects lasting longer than two weeks",
      "It automatically calculates cloud server amortization costs for accounting departments",
      "It eliminates the need for product managers and engineering directors to review roadmaps"
    ],
    answer: 0,
    why: "Dividing Reach * Impact * Confidence by Effort calculates Return on Investment (ROI). It prevents teams from sinking person-years into low-leverage initiatives when smaller projects yield superior cumulative value."
  },
  "4_2": {
    question: "What must an engineering manager verify before determining that an engineer's delayed delivery is an individual competency failure?",
    options: [
      "They must rule out environmental blockers, such as broken local development environments, ambiguous requirements, or missing team dependencies",
      "They must administer a formal timed algorithms exam to evaluate the engineer's memory retention",
      "They must verify that the engineer has read all internal documentation from the past five years",
      "They must ensure the engineer worked overtime on weekends during the preceding quarter"
    ],
    answer: 0,
    why: "Environmental blockers—such as unstable CI/CD, unclear PRDs, or blocked cross-team dependencies—often disguise themselves as individual slowness. Leaders must eliminate systemic friction before diagnosing capability."
  },
  "4_3": {
    question: "What distinguishes the 'Solver' Staff engineer archetype from the 'Tech Lead' archetype in Tanya Reilly's framework?",
    options: [
      "The Solver parachutes into deep, intractable organization-critical technical bottlenecks to find solutions, whereas Tech Leads manage ongoing team execution",
      "Solvers manage reporting lines and compensation reviews while Tech Leads write unit tests",
      "Tech Leads work exclusively on open-source libraries whereas Solvers write internal documentation",
      "Solvers are prohibited from writing code and focus entirely on executive boardroom presentations"
    ],
    answer: 0,
    why: "The Solver is a deep technical specialist deployed to crack high-risk, intractable problems (e.g., non-deterministic kernel race conditions), whereas Tech Leads guide the broad, day-to-day delivery of a squad."
  },
  "4_4": {
    question: "Why does an effective Incident Commander (IC) deliberately avoid writing code or debugging during a high-severity production outage?",
    options: [
      "To maintain top-level situational awareness, coordinate triage streams, prevent duplicate work, and communicate with external stakeholders",
      "Because incident commanders lack the technical access credentials to edit production source code",
      "To ensure that other engineers take full legal liability for any code changes committed during the outage",
      "Because the incident command system requires the IC to spend all their time writing the final post-mortem document"
    ],
    answer: 0,
    why: "If the incident commander dives into code, they lose the macro view of the incident. The IC's job is orchestration: tracking hypotheses, allocating specialists, eliminating bottlenecks, and shielding the team from outside noise."
  }
};

// Apply to COMP_FUND
for (let d = 0; d < 2; d++) {
  const day = COMP_FUND_LONG_LESSONS[d];
  day.parts.forEach((p, idx) => {
    const key = `${day.day}_${idx}`;
    if (compFundUpgrades[key]) {
      p.check = compFundUpgrades[key];
    }
  });
}

// Apply to SOFT_SKILLS
[0, 1, 3].forEach(dIdx => {
  const day = SOFT_SKILLS_LONG_LESSONS[dIdx];
  day.parts.forEach((p, idx) => {
    const key = `${day.day}_${idx}`;
    if (softSkillsUpgrades[key]) {
      p.check = softSkillsUpgrades[key];
    }
  });
});

// Write COMP_FUND
const compOutput = `import type { LongLesson } from './longLessonTypes';\n\nexport const COMP_FUND_LONG_LESSONS: LongLesson[] = ${JSON.stringify(COMP_FUND_LONG_LESSONS, null, 2)};\n`;
fs.writeFileSync(path.resolve('src/lib/data/compFundLongLessons.ts'), compOutput, 'utf8');
console.log('✅ Updated compFundLongLessons.ts with 4-option MCQs');

// Write SOFT_SKILLS
const softOutput = `import type { LongLesson } from './longLessonTypes';\n\nexport const SOFT_SKILLS_LONG_LESSONS: LongLesson[] = ${JSON.stringify(SOFT_SKILLS_LONG_LESSONS, null, 2)};\n`;
fs.writeFileSync(path.resolve('src/lib/data/softSkillsLongLessons.ts'), softOutput, 'utf8');
console.log('✅ Updated softSkillsLongLessons.ts with 4-option MCQs');
