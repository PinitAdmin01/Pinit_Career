import json

def get_day_07():
    return {
    "day": 7,
    "title": "Constructive Feedback & Code Review Psychology: The SBI Feedback Framework",
    "goal": "Master high-trust psychological feedback and code review communication in engineering teams: the Situation-Behavior-Impact (SBI) model, eliminating accusatory 'You' statements, deploying Conventional Comments prefixes ([blocking], [nit], [question], [suggestion]), conducting blameless technical disagreements, and building a high-trust engineering culture.",
    "minutes": 30,
    "recap": "Yesterday we mastered Cross-Functional Alignment & Non-Technical Translation: The ELI5 Framework, learning how to bridge the gap between engineering complexity and executive business metrics. Today, we turn inward to examine interpersonal engineering dynamics: Constructive Feedback and Code Review Psychology.",
    "parts": [
        {
            "title": "The Psychology of Code Reviews: Eliminating Accusatory 'You' Statements & Ego Defensiveness",
            "say": [
                "Welcome to Day 7 of Workplace Soft Skills and Engineering Leadership. Today we examine the crucible of engineering collaboration: Code Review Psychology and Constructive Feedback.",
                "In software engineering, code reviews are the primary asynchronous interaction point between developers. A pull request is not merely a technical diff of text strings; for many developers, code represents an extension of their intellect, creativity, and professional identity. When an engineer submits a pull request containing 500 lines of code they labored over for three days, their subconscious mind is in a heightened state of vulnerability. How colleagues review that pull request directly dictates whether the team fosters a culture of psychological safety and continuous learning, or one of toxic defensiveness, territorial politics, and imposter syndrome.",
                "The most catastrophic, destructive mistake inexperienced engineers make during code reviews is framing feedback as personal, accusatory 'You' statements: 'You forgot to close the database connection,' 'Why did you use a while loop here?', 'You don't understand how React hooks work,' or 'You are making this way too complicated.' When a developer reads the word 'You' followed by criticism, their brain's amygdala instantly triggers a biological threat response. They feel personally attacked, their intellectual competence is insulted, and their immediate subconscious reaction is to become defensive, argue over trivial details, and dig their heels in.",
                "Elite software engineers and engineering managers replace accusatory 'You' statements with Collaborative 'We' and 'The Code' statements: 'Notice that on line 42, the database connection remains open if an exception is thrown; how should we handle the cleanup in a finally block?', 'Could we consider whether a map operation here would make the transformation more declarative?', or 'I am concerned that under high concurrent load, this block might trigger a race condition; what do you think about synchronizing access?'",
                "Notice the profound psychological difference: The criticism has been decoupled from the person and anchored strictly to the code. The reviewer and the author are no longer adversaries squaring off in an intellectual arena; they are two collaborative teammates standing side-by-side, looking at the code together, and asking: 'How can WE make this system more robust, maintainable, and resilient?'",
                "Furthermore, code review psychology requires balancing criticism with explicit praise and encouragement. Many junior and mid-level engineers treat code reviews as an adversarial bug hunt where their sole objective is to find flaws. If a colleague authors an exceptionally clean abstraction, writes thorough unit tests, or adds clear documentation, the reviewer stays silent, assuming that good work is merely expected. This creates a deeply demoralizing experience where developers only receive negative feedback. Elite technical leaders deliberately call out brilliant design choices: 'I love how you decoupled the payment gateway here—this makes future testing so much cleaner!', or 'Great catch handling that edge case with null tokens!' Positive reinforcement builds immense trust, making subsequent constructive criticism far easier to receive and implement.",
                "Psychological safety in code reviews also requires recognizing power differentials: When a Staff Engineer or Tech Lead comments on a junior engineer's pull request, the junior engineer often interprets a casual suggestion as an absolute mandatory directive. Senior leaders must explicitly qualify their comments, clarifying whether a remark is a non-negotiable architectural requirement or simply a casual musing meant to spark discussion.",
                "In this first part, we construct an automated Code Review Comment Psychological Tone and Sentiment Analyzer in TypeScript. We parse code review comments, detect accusatory 'You' statements, flag emotionally charged language, and generate collaborative, blameless phrasing alternatives.",
                "Let us examine how to handle code reviews on large cross-functional refactors: When an author submits a massive pull request spanning thousands of lines across multiple microservices, reviewers experience severe cognitive exhaustion, often resulting in superficial 'looks good to me' rubber-stamping or hyper-focused trivial nitpicking on formatting. Elite engineering leaders establish PR Size Governance: Pull requests should ideally be scoped between 200 and 400 lines of diff. If a feature inherently requires 2,000 lines of modifications, the author breaks the work down into stacked, atomic pull requests that can be reviewed independently. This reduces cognitive load on reviewers, ensures thorough scrutiny of critical architectural invariants, and protects psychological safety by preventing reviewers from feeling overwhelmed by impossible review burdens."
            ],
            "example": "Changing 'You wrote an inefficient O(N^2) nested loop that will kill performance' to 'Could we explore using a Map here to reduce lookup complexity from O(N^2) to O(N)?'",
            "code": "// Code Review Psychological Tone & Sentiment Analyzer\ninterface CommentSentimentReport {\n  originalComment: string;\n  isAccusatory: boolean;\n  containsCollaborativePhrasing: boolean;\n  psychologicalSafetyScore: number; // 0 - 100\n  critiqueTone: 'TOXIC_DEFENSIVE' | 'NEUTRAL_TRANSACTIONAL' | 'HIGH_TRUST_COLLABORATIVE';\n  recommendedRefactor: string;\n}\n\nclass CodeReviewPsychologyAuditor {\n  auditComment(comment: string): CommentSentimentReport {\n    const text = comment.toLowerCase();\n    \n    // Detect accusatory patterns\n    const accusatoryPatterns = [\n      /\\byou forgot\\b/, /\\byou didn't\\b/, /\\byou should have\\b/,\n      /\\byou don't understand\\b/, /\\bwhy did you\\b/, /\\byour code is\\b/\n    ];\n    \n    // Detect collaborative patterns\n    const collaborativePatterns = [\n      /\\bcould we\\b/, /\\bwhat do you think about\\b/, /\\bhow should we\\b/,\n      /\\bnotice that\\b/, /\\bi love how\\b/, /\\bwould it make sense\\b/\n    ];\n\n    const hasAccusatory = accusatoryPatterns.some(p => p.test(text));\n    const hasCollaborative = collaborativePatterns.some(p => p.test(text));\n\n    let score = 70; // baseline\n    if (hasAccusatory) score -= 45;\n    if (hasCollaborative) score += 30;\n    score = Math.max(0, Math.min(100, score));\n\n    let tone: CommentSentimentReport['critiqueTone'] = 'NEUTRAL_TRANSACTIONAL';\n    let refactor = comment;\n\n    if (score < 50) {\n      tone = 'TOXIC_DEFENSIVE';\n      refactor = comment\n        .replace(/why did you write/gi, 'Could we explore rewriting')\n        .replace(/you forgot to/gi, 'Could we also ensure we')\n        .replace(/your code/gi, 'this implementation');\n    } else if (score >= 85) {\n      tone = 'HIGH_TRUST_COLLABORATIVE';\n      refactor = 'EXCELLENT: Highly empathetic and psychologically safe phrasing.';\n    }\n\n    return {\n      originalComment: comment,\n      isAccusatory: hasAccusatory,\n      containsCollaborativePhrasing: hasCollaborative,\n      psychologicalSafetyScore: score,\n      critiqueTone: tone,\n      recommendedRefactor: refactor\n    };\n  }\n}\n\nconst auditor = new CodeReviewPsychologyAuditor();\nconst harshComment = \"Why did you write an unindexed query here? You forgot to check for null tokens.\";\nconst audit = auditor.auditComment(harshComment);\n\nconsole.log(\"=== CODE REVIEW PSYCHOLOGY AUDIT ===\");\nconsole.log(\"Original Comment:      \\\"\" + audit.originalComment + \"\\\"\");\nconsole.log(\"Accusatory Detected:   \" + audit.isAccusatory);\nconsole.log(\"Safety Score:          \" + audit.psychologicalSafetyScore + \"/100\");\nconsole.log(\"Tone Classification:   \" + audit.critiqueTone);\nconsole.log(\"Refactored Phrasing:   \\\"\" + audit.recommendedRefactor + \"\\\"\");\nconsole.log(\"Psychology Invariant:  Critique the code, never the coder; collaborative phrasing builds high-trust teams.\");",
            "output": "=== CODE REVIEW PSYCHOLOGY AUDIT ===\nOriginal Comment:      \"Why did you write an unindexed query here? You forgot to check for null tokens.\"\nAccusatory Detected:   true\nSafety Score:          25/100\nTone Classification:   TOXIC_DEFENSIVE\nRefactored Phrasing:   \"Could we explore rewriting an unindexed query here? Could we also ensure we check for null tokens.\"\nPsychology Invariant:  Critique the code, never the coder; collaborative phrasing builds high-trust teams.",
            "codeNotes": [
                {
                    "line": 2,
                    "note": "Defines sentiment diagnostic interface scoring psychological safety in peer code reviews."
                },
                {
                    "line": 14,
                    "note": "Implements regex detection targeting accusatory 'You' statements triggering defensive threat responses."
                },
                {
                    "line": 20,
                    "note": "Detects collaborative 'Could we' framing that anchors criticism to shared team goals."
                },
                {
                    "line": 48,
                    "note": "Audits a harsh developer comment, scoring it at 25/100 and generating an empathetic refactor."
                },
                {
                    "line": 56,
                    "note": "Outputs psychological safety audit confirming collaborative phrasing invariant."
                }
            ],
            "tryIt": "Test a comment like 'I love how clean this helper is, could we add one test case for empty strings?' and observe the score.",
            "check": {
                "question": "Why is framing code review comments as collaborative 'We' questions far more effective than accusatory 'You' statements?",
                "options": [
                    "It decouples technical criticism from personal ego, eliminating defensive threat responses and encouraging shared problem-solving",
                    "It automatically suppresses all GitHub automated CI test failures",
                    "It prevents the git commit history from being visible to external auditors",
                    "It allows developers to merge unreviewed code directly into production"
                ],
                "answer": 0,
                "why": "Collaborative phrasing ('Could we consider...') shifts focus from personal fault to code quality, fostering psychological safety and constructive dialogue."
            }
        },
        {
            "title": "The Situation-Behavior-Impact (SBI) Model: Objective Grounding in Observable Evidence",
            "say": [
                "Now let us examine the premier gold standard framework for delivering high-trust, constructive feedback in professional engineering organizations: The Situation-Behavior-Impact (SBI) Model.",
                "Developed by the Center for Creative Leadership, the SBI framework is designed to eliminate ambiguity, subjective judgments, and emotional hostility from feedback conversations. Whether delivered asynchronously on a pull request or synchronously in a 1-on-1 meeting, vague or personality-based criticism always fails. Statements like 'You have a bad attitude in meetings,' 'Your code is sloppy,' or 'You aren't being proactive enough' are catastrophic. Why? Because they are subjective personality judgments! When someone is told their code is 'sloppy,' they immediately become indignant, debate your definition of sloppy, and dismiss your feedback as unfair bias.",
                "The SBI Model resolves this by anchoring all feedback into three indisputable, verifiable components: 1. Situation: Anchor the feedback to a specific time, place, and context; 2. Behavior: Describe the exact, observable physical action or code change without interpretation or judgment; and 3. Impact: Explain the concrete, measurable outcome of that behavior on system performance, team velocity, customer experience, or colleague workload.",
                "Let us analyze an end-to-end example contrasting ineffective subjective feedback against the SBI model: An engineering manager is frustrated because a developer skipped writing unit tests for a critical billing refactor. Ineffective feedback: 'You are cutting corners and being careless with our test coverage.' Notice how the developer feels insulted and argues: 'I am not careless! I worked until 10 PM to hit the sprint deadline!' Communication has broken down completely.",
                "Now observe the exact same feedback delivered using the SBI Model: Situation: 'Yesterday afternoon during the Sprint 24 release of PR #182 on the billing service...'; Behavior: '...the PR was merged with four new database endpoints, but without accompanying integration test suites covering credit card timeout edge cases...'; Impact: '...when third-party payment gateways experienced intermittent packet loss last night, the unhandled timeout caused 45 user transactions to stall in a pending state, requiring the on-call engineer to spend three hours manually reconciling database balances at 2 AM.'",
                "Notice the mathematical perfection of the SBI formulation: The engineer cannot argue with the Situation—PR #182 happened yesterday. They cannot argue with the Behavior—the test files were objectively missing from the commit tree. They cannot argue with the Impact—the on-call engineer verifiably spent three hours reconciling transactions. The engineer does not feel attacked as a human being; they see the verifiable causal chain connecting their specific action to real-world consequences.",
                "To complete the SBI framework, high-performing leaders add a fourth forward-looking element: SBI-R (Alternative Behavior & Recommendation). After establishing the Situation, Behavior, and Impact, the leader invites collaboration: 'Moving forward, how can we ensure that all PRs touching financial ledgers require passing integration test suites before review? Let's pair on adding an automated GitHub Actions check to prevent this from ever happening again.' This transforms feedback from a punitive post-mortem into an empowering engineering mentorship moment.",
                "In this second part, we construct an automated SBI Constructive Feedback Message Generator and Validator in TypeScript. We parse feedback components, verify that all three tiers are populated with concrete evidence, reject subjective personality adjectives, and format structured, high-trust feedback dispatches.",
                "Let us explore how to deliver SBI feedback during high-stakes incident retrospectives: In post-incident post-mortems following a Tier-1 production outage, engineers often feel immense guilt, anxiety, and fear of termination. If the retrospective meeting begins with executive leadership asking, 'Who broke the build?' or 'Why didn't anyone catch this bug in QA?', psychological safety is shattered, and engineers learn to conceal future mistakes. By enforcing the SBI framework within the blameless post-mortem, the facilitator guides the conversation strictly toward system invariants: 'During yesterday's peak checkout surge at 14:00 UTC (Situation), the cache invalidation job executed without rate limiting (Behavior), which caused 10,000 concurrent database connections and a 20-minute database failover (Impact). Moving forward, what automated circuit breakers can we engineer into the cache worker to eliminate this failure mode permanently?'",
                "This rigorous grounding in observable behavior and systemic impact shifts the retrospective from a punitive witch hunt into an empowering engineering resilience session. When developers realize that failure is treated as a learning opportunity rather than a personal character flaw, team transparency skyrockets, incident detection times decrease, and engineers eagerly share near-misses before they escalate into customer-facing catastrophes."
            ],
            "example": "Using SBI: 'In yesterday's architecture review (Situation), when you interrupted the designer three times (Behavior), it caused her to shut down and we missed hearing her critical usability insights on checkout (Impact).'",
            "code": "// Situation-Behavior-Impact (SBI) Constructive Feedback Generator\ninterface SbiFeedbackDraft {\n  situationContext: string;\n  observableBehavior: string;\n  verifiableImpact: string;\n  recommendedNextStep: string;\n}\n\ninterface SbiEvaluationResult {\n  isValidSbi: boolean;\n  subjectiveAdjectivesDetected: string[];\n  formattedSbiMessage: string;\n  psychologicalClarityScore: number;\n}\n\nclass SbiFeedbackEngine {\n  private subjectiveAdjectives = [\n    'sloppy', 'lazy', 'careless', 'unprofessional', 'bad attitude',\n    'incompetent', 'arrogant', 'clueless', 'reckless', 'selfish'\n  ];\n\n  generateFeedback(draft: SbiFeedbackDraft): SbiEvaluationResult {\n    const fullText = (draft.situationContext + ' ' + draft.observableBehavior + ' ' + draft.verifiableImpact).toLowerCase();\n    const flaggedWords: string[] = [];\n\n    for (const adj of this.subjectiveAdjectives) {\n      if (fullText.includes(adj)) {\n        flaggedWords.push(adj);\n      }\n    }\n\n    const hasSituation = draft.situationContext.length >= 10;\n    const hasBehavior = draft.observableBehavior.length >= 10;\n    const hasImpact = draft.verifiableImpact.length >= 10;\n    const isClean = flaggedWords.length === 0;\n\n    const isValid = hasSituation && hasBehavior && hasImpact && isClean;\n    const score = (hasSituation ? 25 : 0) + (hasBehavior ? 25 : 0) + (hasImpact ? 25 : 0) + (isClean ? 25 : 0);\n\n    let formatted = '';\n    if (isValid) {\n      formatted = [\n        \\`[SITUATION]: \\${draft.situationContext}\\`,\n        \\`[OBSERVABLE BEHAVIOR]: \\${draft.observableBehavior}\\`,\n        \\`[VERIFIABLE IMPACT]: \\${draft.verifiableImpact}\\`,\n        \\`[RECOMMENDATION]: \\${draft.recommendedNextStep}\\`\n      ].join('\\n');\n    } else {\n      formatted = \\`FEEDBACK REJECTED: Contains subjective judgments [\\${flaggedWords.join(', ')}] or missing SBI tiers.\\`;\n    }\n\n    return {\n      isValidSbi: isValid,\n      subjectiveAdjectivesDetected: flaggedWords,\n      formattedSbiMessage: formatted,\n      psychologicalClarityScore: score\n    };\n  }\n}\n\nconst engine = new SbiFeedbackEngine();\nconst draft: SbiFeedbackDraft = {\n  situationContext: \"Yesterday during the Sprint 24 deployment of the billing microservice (PR #182)\",\n  observableBehavior: \"the PR merged without integration tests covering gateway timeout edge cases\",\n  verifiableImpact: \"an unhandled exception stalled 45 transactions, requiring 3 hours of emergency triage at 2 AM\",\n  recommendedNextStep: \"let us pair on adding an automated mock integration test suite before merging financial endpoints\"\n};\n\nconst result = engine.generateFeedback(draft);\n\nconsole.log(\"=== SBI CONSTRUCTIVE FEEDBACK DISPATCH ===\");\nconsole.log(result.formattedSbiMessage);\nconsole.log(\"Clarity Assessment:    \" + result.psychologicalClarityScore + \"/100 (SBI_COMPLIANT)\");\nconsole.log(\"Subjective Judgments:  \" + (result.subjectiveAdjectivesDetected.length === 0 ? \"NONE (Zero Personality Attacks)\" : \"FLAGGED\"));\nconsole.log(\"SBI Invariant: Ground feedback strictly in observable facts and verifiable business impact.\");",
            "output": "=== SBI CONSTRUCTIVE FEEDBACK DISPATCH ===\n[SITUATION]: Yesterday during the Sprint 24 deployment of the billing microservice (PR #182)\n[OBSERVABLE BEHAVIOR]: the PR merged without integration tests covering gateway timeout edge cases\n[VERIFIABLE IMPACT]: an unhandled exception stalled 45 transactions, requiring 3 hours of emergency triage at 2 AM\n[RECOMMENDATION]: let us pair on adding an automated mock integration test suite before merging financial endpoints\nClarity Assessment:    100/100 (SBI_COMPLIANT)\nSubjective Judgments:  NONE (Zero Personality Attacks)\nSBI Invariant: Ground feedback strictly in observable facts and verifiable business impact.",
            "codeNotes": [
                {
                    "line": 2,
                    "note": "Defines core interface strictly separating Situation, Behavior, Impact, and Recommendation tiers."
                },
                {
                    "line": 15,
                    "note": "Maintains blocklist of subjective personality adjectives that invalidate constructive feedback."
                },
                {
                    "line": 25,
                    "note": "Validates minimum descriptive length across all 3 tiers ensuring actionable specificity."
                },
                {
                    "line": 49,
                    "note": "Generates structured feedback for a production billing defect without personal attacks."
                },
                {
                    "line": 56,
                    "note": "Outputs audited SBI dispatch verifying zero subjective judgments and 100/100 clarity."
                }
            ],
            "tryIt": "Inject a word like 'careless' into the behavior description and observe how the engine rejects the feedback.",
            "check": {
                "question": "What is the primary strength of the Situation-Behavior-Impact (SBI) feedback model?",
                "options": [
                    "It anchors criticism strictly to verifiable, observable actions and concrete business impacts, eliminating subjective personality judgments",
                    "It automatically generates a performance improvement plan in human resources software",
                    "It forces developers to accept all code review suggestions without discussion",
                    "It deletes all git branches that have not been updated in 48 hours"
                ],
                "answer": 0,
                "why": "The SBI model eliminates emotional hostility by focusing on observable facts (Situation, Behavior) and undeniable outcomes (Impact), bypassing defensiveness."
            }
        },
        {
            "title": "Categorizing Feedback Intent: Conventional Comments ([blocking], [nit], [question], [suggestion])",
            "say": [
                "Now let us examine the premier asynchronous tooling standard for eliminating friction in GitHub pull requests: The Conventional Comments Specification.",
                "In traditional software development, code review comments suffer from a massive Ambiguity Deficit: An author receives thirty separate comments on a pull request. One comment points out a critical SQL injection vulnerability; another comment suggests renaming a local variable to match team conventions; another comment asks an exploratory question about why an algorithm was chosen; another comment is a minor styling nitpick about a trailing comma. To the author, all thirty comments appear visually identical in the GitHub UI! The author experiences severe cognitive overwhelm, does not know which comments are critical blockers versus optional preferences, and frequently spends three hours debating a styling preference while missing the security vulnerability.",
                "To solve this problem definitively, elite engineering teams adopt Conventional Comments: a standardized labeling convention that prefixes every single code review comment with a clear Semantic Tag indicating the reviewer's exact intent and severity level.",
                "Let us analyze the four primary Conventional Comment categories: First, `[blocking]`: A non-negotiable issue that must be resolved before the pull request can be merged into production. Examples include security vulnerabilities, data corruption risks, memory leaks, broken unit tests, or violations of core architectural invariants. When an author sees `[blocking]`, they know: 'This is a hard gate; I must resolve this code issue.'",
                "Second, `[suggestion]`: A concrete proposal to improve the code that the author is strongly encouraged to consider, but does not strictly block merging if an alternative rationale exists. Reviewers using `[suggestion]` frequently provide GitHub Suggested Changes (````suggestion`) allowing the author to apply the refactoring with a single click.",
                "Third, `[question]`: An exploratory inquiry seeking information or clarification, not requesting a code change. For example: `[question] How does this cache invalidation interact with our secondary replica database?` The author simply needs to explain the architecture in a reply; no code changes are required unless the answer reveals an unhandled edge case.",
                "Fourth, `[nit]` (or Nitpick): A trivial, optional observation—such as typo fixes in documentation, minor styling preferences, or minor naming suggestions. Crucially, a `[nit]` explicitly communicates: 'This is an optional preference; you do NOT need to change this to merge the PR, and I will approve the PR regardless.' This completely liberates the author from feeling obligated to rewrite code over personal cosmetic preferences.",
                "Furthermore, Conventional Comments includes two vital high-trust tags: `[praise]`: Explicitly celebrating exceptional craftsmanship (`[praise] This recursion termination logic is so clean!`), and `[chore]`: Minor administrative tasks like updating a changelog. Tagging feedback establishes immediate clarity, dramatically accelerates review velocity, and completely eliminates passive-aggressive misunderstandings.",
                "In this third part, we construct an automated Conventional Comments Parser and Pull Request Gating Classifier in TypeScript. We categorize comments, verify that blocking issues prevent merge approval, and quantify reviewer feedback distribution.",
                "Let us analyze how Conventional Comments transform junior engineer mentorship: For early-career developers and new hires, the first few months at a technology company are fraught with imposter syndrome. When a junior engineer opens their first pull request and receives twenty comments from senior colleagues, they frequently misinterpret every single comment as evidence that they are inadequate and failing. When the team adopts Conventional Comments, the junior engineer can immediately triage the feedback: 'Ah, fifteen of these twenty comments are tagged [nit] or [suggestion], which means my core logic is sound and the team is simply teaching me their formatting conventions and idiomatic design patterns!' This eliminates debilitating anxiety and accelerates the junior developer's learning velocity by orders of magnitude.",
                "Furthermore, Conventional Comments includes the `[thought]` tag: used when a reviewer wants to share an interesting architectural observation or alternative approach without expecting any action from the author (`[thought] In Go or Rust, this pattern would typically use a channel or actor model; interesting to see how cleanly TypeScript handles it with async iterators`). This encourages intellectual curiosity, turns routine PR reviews into masterclasses in software architecture, and builds an enriching engineering culture where colleagues learn from each other every day."
            ],
            "example": "Reviewer comments: '[nit] Consider renaming `res` to `customerResponse` for readability' vs '[blocking] Missing authentication check on admin deletion route.'",
            "code": "// Conventional Comments Severity Classifier & PR Gating Engine\ntype CommentSeverity = 'BLOCKING' | 'SUGGESTION' | 'QUESTION' | 'NITPICK' | 'PRAISE';\n\ninterface ReviewComment {\n  id: string;\n  author: string;\n  rawText: string;\n}\n\ninterface ParsedComment {\n  id: string;\n  severity: CommentSeverity;\n  isMergeBlocker: boolean;\n  cleanText: string;\n}\n\nclass ConventionalCommentsClassifier {\n  classifyComment(comment: ReviewComment): ParsedComment {\n    const text = comment.rawText.trim();\n    const prefixMatch = text.match(/^\\[([a-zA-Z]+)\\]/);\n\n    let severity: CommentSeverity = 'SUGGESTION';\n    let cleanText = text;\n\n    if (prefixMatch) {\n      const tag = prefixMatch[1].toLowerCase();\n      cleanText = text.slice(prefixMatch[0].length).trim();\n\n      switch (tag) {\n        case 'blocking':\n          severity = 'BLOCKING';\n          break;\n        case 'suggestion':\n          severity = 'SUGGESTION';\n          break;\n        case 'question':\n          severity = 'QUESTION';\n          break;\n        case 'nit':\n        case 'nitpick':\n          severity = 'NITPICK';\n          break;\n        case 'praise':\n          severity = 'PRAISE';\n          break;\n        default:\n          severity = 'SUGGESTION';\n      }\n    } else {\n      // Unprefixed comment heuristic\n      if (text.toLowerCase().includes('must') || text.toLowerCase().includes('security')) {\n        severity = 'BLOCKING';\n      }\n    }\n\n    return {\n      id: comment.id,\n      severity,\n      isMergeBlocker: severity === 'BLOCKING',\n      cleanText\n    };\n  }\n\n  evaluatePullRequestMergeReadiness(comments: ReviewComment[]): {\n    canMerge: boolean;\n    blockingCount: number;\n    suggestionCount: number;\n    nitCount: number;\n    praiseCount: number;\n    readinessStatus: string;\n  } {\n    const parsed = comments.map(c => this.classifyComment(c));\n    const blocking = parsed.filter(p => p.severity === 'BLOCKING');\n    const suggestions = parsed.filter(p => p.severity === 'SUGGESTION');\n    const nits = parsed.filter(p => p.severity === 'NITPICK');\n    const praise = parsed.filter(p => p.severity === 'PRAISE');\n\n    const canMerge = blocking.length === 0;\n\n    return {\n      canMerge,\n      blockingCount: blocking.length,\n      suggestionCount: suggestions.length,\n      nitCount: nits.length,\n      praiseCount: praise.length,\n      readinessStatus: canMerge ? 'APPROVED_FOR_MERGE' : 'BLOCKED_BY_CRITICAL_COMMENTS'\n    };\n  }\n}\n\nconst classifier = new ConventionalCommentsClassifier();\nconst prComments: ReviewComment[] = [\n  { id: 'c1', author: 'alice_staff', rawText: '[blocking] Missing CSRF protection header on session refresh route.' },\n  { id: 'c2', author: 'bob_senior', rawText: '[nit] Consider extracting this regex into a reusable constants file.' },\n  { id: 'c3', author: 'carol_lead', rawText: '[question] How does this timeout behavior handle Redis replica lag?' },\n  { id: 'c4', author: 'dave_peer', rawText: '[praise] Outstanding performance optimization on the b-tree index!' }\n];\n\nconst evaluation = classifier.evaluatePullRequestMergeReadiness(prComments);\n\nconsole.log(\"=== PULL REQUEST CODE REVIEW AUDIT ===\");\nconsole.log(\"Total Comments Analyzed: \" + prComments.length);\nconsole.log(\"Blocking Issues:         \" + evaluation.blockingCount + \" (Must resolve before merge)\");\nconsole.log(\"Suggestions / Nits:      \" + (evaluation.suggestionCount + evaluation.nitCount) + \" (Non-blocking preferences)\");\nconsole.log(\"Praise / Accolades:      \" + evaluation.praiseCount + \" (Psychological positive reinforcement)\");\nconsole.log(\"PR Merge Readiness:      \" + evaluation.readinessStatus);\nconsole.log(\"Conventional Invariant:  Explicit semantic tags ([blocking], [nit]) eliminate review ambiguity and accelerate delivery.\");",
            "output": "=== PULL REQUEST CODE REVIEW AUDIT ===\nTotal Comments Analyzed: 4\nBlocking Issues:         1 (Must resolve before merge)\nSuggestions / Nits:      1 (Non-blocking preferences)\nPraise / Accolades:      1 (Psychological positive reinforcement)\nPR Merge Readiness:      BLOCKED_BY_CRITICAL_COMMENTS\nConventional Invariant:  Explicit semantic tags ([blocking], [nit]) eliminate review ambiguity and accelerate delivery.",
            "codeNotes": [
                {
                    "line": 2,
                    "note": "Defines Conventional Comments semantic taxonomy establishing exact reviewer intent."
                },
                {
                    "line": 15,
                    "note": "Parses comment prefixes extracting tags ([blocking], [nit], [question], [praise])."
                },
                {
                    "line": 52,
                    "note": "Evaluates overall PR merge readiness, guaranteeing that only [blocking] tags gate merges."
                },
                {
                    "line": 74,
                    "note": "Audits a multi-reviewer PR comment batch, identifying 1 blocking security issue and 1 praise."
                },
                {
                    "line": 84,
                    "note": "Confirms PR gating status preventing premature deployment until blocking items resolve."
                }
            ],
            "tryIt": "Remove the [blocking] prefix from comment c1 and observe how PR readiness transitions to APPROVED_FOR_MERGE.",
            "check": {
                "question": "What is the primary benefit of prefixing a code review comment with `[nit]` according to the Conventional Comments standard?",
                "options": [
                    "It explicitly tells the author that the comment is a minor, optional preference that does NOT block merging, saving hours of unnecessary debate",
                    "It automatically deletes the author's local git stash",
                    "It converts the pull request into a draft PR without notifying the team",
                    "It charges a financial micro-penalty to the reviewer's corporate credit card"
                ],
                "answer": 0,
                "why": "The `[nit]` tag communicates that the feedback is a non-blocking cosmetic preference, liberating the author to merge without feeling forced into trivial refactors."
            }
        },
        {
            "title": "Navigating Disagreements & Escalations: Seeking Alignment over Compliance",
            "say": [
                "Now let us examine how engineering leaders navigate high-stakes technical disagreements during code reviews: Seeking Genuine Alignment over Forced Compliance.",
                "In software development, brilliant engineers will inevitably disagree on architectural decisions. Engineer A advocates for an event-driven asynchronous architecture; Engineer B insists on a synchronous REST API with transaction boundaries. When two senior engineers reach an impasse in a GitHub PR comment thread with fifty nested replies, the situation becomes dangerous. Asynchronous text is the worst possible medium for resolving emotional or deeply philosophical engineering disputes. Context is lost, tone is misinterpreted, and public comment threads turn into political battles where neither engineer wants to lose face.",
                "To resolve technical disagreements with emotional intelligence, elite engineering organizations follow the 3-Comment Rule: If an architectural disagreement on a pull request cannot be resolved in three comment exchanges, asynchronous commenting is immediately halted! The reviewer or author posts a polite circuit-breaker message: 'We have distinct perspectives on this caching layer. Let's hop on a 10-minute huddle to align so we can keep the PR moving.'",
                "A 10-minute synchronous voice or video conversation accomplishes what fifty PR comments never can: You hear each other's tone of voice, see facial expressions, establish human empathy, and can sketch ideas on a shared virtual whiteboard. Over 90 percent of PR deadlocks dissolve within five minutes of face-to-face dialogue when developers realize they are actually trying to achieve the same underlying goal.",
                "During technical debates, senior engineers practice the 'Steel-Manning' technique: Before you attempt to refute your colleague's proposal, you must first state their argument so clearly, fairly, and persuasively that they respond: 'Yes, exactly! That is my point.' If you cannot summarize your colleague's architectural position accurately, you have no right to criticize it. Steel-manning demonstrates deep intellectual respect and forces you to understand the genuine merits of their perspective.",
                "Furthermore, elite leaders understand the distinction between Compliance and Alignment: Compliance is when an engineer surrenders to an authoritarian senior lead while silently believing the decision is foolish. Compliance leads to passive-aggressive apathy: when the system fails in production, the compliant engineer thinks, 'I knew it would crash; that is what they get for ignoring me.' Alignment, by contrast, is rooted in Amazon's famous leadership principle: 'Have Backbone; Disagree and Commit.' During the decision phase, you vigorously debate the trade-offs with data. But once the decision is finalized, everyone commits 100 percent to making the chosen solution successful, with zero retroactive finger-pointing.",
                "If an impasse persists even after synchronous discussion, engineering teams follow a clean, blameless Escalation Path: They consult an objective third-party Tech Lead or Staff Architect who evaluates the trade-offs against explicit company architectural principles, rendering a binding decision so the team can maintain sprint velocity.",
                "In this fourth part, we construct an Architectural Disagreement Resolution and Escalation Protocol Simulator in TypeScript. We model the 3-Comment circuit breaker, evaluate alignment vs compliance dynamics, simulate trade-off consensus scoring, and verify conflict de-escalation invariants.",
                "Let us examine how senior engineers cultivate the emotional resilience required to Disagree and Commit: Many junior developers mistakenly believe that 'Disagree and Commit' means silently fuming while someone else's bad idea gets built. True commitment requires emotional maturity and intellectual humility: You advocate passionately for your proposal during the evaluation phase, presenting benchmark data, architectural trade-off analyses, and risk matrices. But once the Tech Lead or team consensus decides to move forward with the alternative approach, you make a conscious mental choice: You discard your attachment to being 'right', take full personal ownership of the chosen strategy, and dedicate your engineering talent to making it wildly successful.",
                "If the chosen strategy later encounters unexpected edge cases in production, an aligned engineer never says, 'I told you so; if we used my approach this wouldn't have happened.' Instead, they jump onto the incident call with empathy, roll up their sleeves, and help solve the problem collaboratively. This unwavering commitment to collective team success over individual ego is the definitive characteristic that executive leadership looks for when promoting engineers into Staff, Principal, and Director positions."
            ],
            "example": "Invoking the 3-Comment circuit breaker after 3 back-and-forth PR exchanges to transition an ORM vs raw SQL debate to a quick 10-minute huddle, reaching consensus in 7 minutes.",
            "code": "// Architectural Disagreement Resolution & Escalation Simulator\ninterface PullRequestThread {\n  threadId: string;\n  topic: string;\n  exchangeCount: number;\n  isEscalatedToHuddle: boolean;\n  consensusMethod: 'ASYNC_CONSENSUS' | 'SYNCHRONOUS_HUDDLE' | 'TECH_LEAD_ARBITRATION';\n  status: 'IN_DISCUSSION' | 'CIRCUIT_BREAKER_TRIGGERED' | 'ALIGNED_AND_COMMITTED';\n}\n\nclass CodeReviewResolutionEngine {\n  processExchange(thread: PullRequestThread): PullRequestThread {\n    const updated = { ...thread };\n    updated.exchangeCount += 1;\n\n    // Apply 3-Comment Circuit Breaker rule\n    if (updated.exchangeCount >= 3 && updated.status === 'IN_DISCUSSION') {\n      updated.isEscalatedToHuddle = true;\n      updated.status = 'CIRCUIT_BREAKER_TRIGGERED';\n      updated.consensusMethod = 'SYNCHRONOUS_HUDDLE';\n    }\n\n    return updated;\n  }\n\n  resolveViaHuddle(thread: PullRequestThread, chosenStrategy: string): {\n    threadId: string;\n    finalDecision: string;\n    alignmentPrinciple: string;\n    status: string;\n  } {\n    return {\n      threadId: thread.threadId,\n      finalDecision: chosenStrategy,\n      alignmentPrinciple: 'HAVE_BACKBONE_DISAGREE_AND_COMMIT',\n      status: 'ALIGNED_AND_COMMITTED'\n    };\n  }\n}\n\nconst engine = new CodeReviewResolutionEngine();\nlet thread: PullRequestThread = {\n  threadId: 'THREAD_PR_304_CACHE',\n  topic: 'Redis Distributed Cache vs Local In-Memory Cache',\n  exchangeCount: 2,\n  isEscalatedToHuddle: false,\n  consensusMethod: 'ASYNC_CONSENSUS',\n  status: 'IN_DISCUSSION'\n};\n\n// Author and Reviewer post 3rd comment exchange\nthread = engine.processExchange(thread);\n\nconsole.log(\"=== PULL REQUEST CONFLICT CIRCUIT BREAKER ===\");\nconsole.log(\"Thread Topic:          \" + thread.topic);\nconsole.log(\"Exchange Count:        \" + thread.exchangeCount + \" (Threshold: 3 comments)\");\nconsole.log(\"Circuit Breaker State: \" + thread.status);\nconsole.log(\"Prescribed Protocol:   \" + thread.consensusMethod);\n\n// Simulate 10-minute synchronous huddle resolution\nconst resolution = engine.resolveViaHuddle(thread, 'Deploy Redis Distributed Cache with 60s TTL');\nconsole.log(\"\");\nconsole.log(\"=== SYNCHRONOUS HUDDLE CONSENSUS REACHED ===\");\nconsole.log(\"Resolved Strategy:     \" + resolution.finalDecision);\nconsole.log(\"Engineering Principle: \" + resolution.alignmentPrinciple);\nconsole.log(\"Terminal State:        \" + resolution.status);\nconsole.log(\"Resolution Invariant:  Stop arguing in PR comments after 3 exchanges; hop on a 10-minute huddle to align.\");",
            "output": "=== PULL REQUEST CONFLICT CIRCUIT BREAKER ===\nThread Topic:          Redis Distributed Cache vs Local In-Memory Cache\nExchange Count:        3 (Threshold: 3 comments)\nCircuit Breaker State: CIRCUIT_BREAKER_TRIGGERED\nPrescribed Protocol:   SYNCHRONOUS_HUDDLE\n\n=== SYNCHRONOUS HUDDLE CONSENSUS REACHED ===\nResolved Strategy:     Deploy Redis Distributed Cache with 60s TTL\nEngineering Principle: HAVE_BACKBONE_DISAGREE_AND_COMMIT\nTerminal State:        ALIGNED_AND_COMMITTED\nResolution Invariant:  Stop arguing in PR comments after 3 exchanges; hop on a 10-minute huddle to align.",
            "codeNotes": [
                {
                    "line": 2,
                    "note": "Defines PR discussion thread state machine tracking comment exchange volume."
                },
                {
                    "line": 15,
                    "note": "Implements 3-Comment Circuit Breaker halting text debates and triggering synchronous huddle."
                },
                {
                    "line": 25,
                    "note": "Formalizes Disagree and Commit principle ensuring 100% team alignment behind final decision."
                },
                {
                    "line": 45,
                    "note": "Demonstrates automated circuit breaker activation after 3 consecutive comment exchanges."
                },
                {
                    "line": 56,
                    "note": "Outputs consensus resolution verifying rapid de-escalation and velocity preservation."
                }
            ],
            "tryIt": "Set initial exchangeCount to 0 and simulate gradual progression through the circuit breaker.",
            "check": {
                "question": "What is the primary rationale behind the '3-Comment Rule' in code reviews?",
                "options": [
                    "Asynchronous text easily escalates emotional conflict; transitioning to a 10-minute synchronous huddle after 3 exchanges resolves 90% of deadlocks with empathy",
                    "It automatically charges developers money if they write more than 3 comments on a pull request",
                    "It locks the git branch permanently to prevent further code modification",
                    "It triggers an automated alert to the legal department"
                ],
                "answer": 0,
                "why": "Text comments lack vocal inflection and empathy, leading to entrenched positions. A quick synchronous huddle restores human connection and resolves impasses rapidly."
            }
        },
        {
            "title": "Master Code Review & Constructive Feedback Suite: High-Trust Engineering Culture Index",
            "say": [
                "Now, in this fifth and concluding part of Day 7, we synthesize all four foundational pillars of code review excellence into an integrated enterprise governance system: The Master Code Review & Constructive Feedback Suite and High-Trust Engineering Culture Index.",
                "Let us review the complete intellectual framework we have established today: Pillar 1: Code Review Psychology, eliminating accusatory 'You' statements and replacing them with collaborative 'Could we explore' questions to protect psychological safety; Pillar 2: The Situation-Behavior-Impact (SBI) Model, anchoring feedback strictly to observable actions and verifiable business consequences while purging subjective personality attacks; Pillar 3: Conventional Comments, deploying explicit semantic tags (`[blocking]`, `[suggestion]`, `[nit]`, `[praise]`) to eliminate ambiguity and streamline PR throughput; and Pillar 4: Disagreement De-escalation & The 3-Comment Rule, halting asynchronous comment wars and fostering true 'Disagree and Commit' alignment.",
                "To evaluate and elevate team culture, high-performing engineering organizations monitor the High-Trust Engineering Culture Index. This composite metric assesses the health of a team's review dynamics across four quantifiable dimensions: 1. Psychological Safety Ratio (proportion of collaborative vs accusatory comments); 2. Semantic Clarity (percentage of comments adopting Conventional Comments prefixes); 3. PR Velocity & Circuit Breaker Adherence (resolving debates within 3 exchanges); and 4. Positive Reinforcement Index (ensuring code reviews contain praise alongside critique).",
                "Teams that achieve a 100/100 High-Trust Culture Index experience extraordinary benefits: Junior engineers learn three times faster because feedback feels like empowering coaching rather than punitive hazing; senior engineers spend less time in unproductive political arguments; production defect escape rates drop by over 40 percent because developers eagerly seek feedback rather than hiding questionable code; and team retention reaches industry-leading heights.",
                "In this final part, we construct the Master High-Trust Culture Certification Suite in TypeScript. We audit comprehensive engineering team review dossiers, evaluate compliance across all four pillars, and award official 100/100 High-Trust Engineering Culture Certification.",
                "Let us explore how high-performing engineering squads maintain culture accountability over time: High-trust engineering culture is not a static milestone that is achieved once and forgotten; it is an active institutional discipline that requires continuous hygiene, role modeling, and proactive feedback. Elite engineering organizations conduct quarterly Code Review Retrospectives where the entire team reviews anonymized PR comment threads together, celebrating examples of exceptional empathy, discussing ambiguous feedback tags, and refining team working agreements.",
                "When new engineers join the organization, they are not merely handed a linter config and told to read the documentation; they are paired with a seasoned culture mentor who reviews their first five PRs side-by-side, demonstrating how to write empathetic comments, how to tag feedback with Conventional Comments, and how to invoke the 3-Comment circuit breaker gracefully. By deliberately onboarding every new hire into high-trust communication protocols, the engineering organization preserves its psychological safety even as the department scales from twenty engineers to two thousand.",
                "By mastering the complete Master Code Review & Constructive Feedback Suite, you become a catalyst for cultural excellence. You transform routine code reviews from a stressful corporate chore into an empowering engine of continuous learning, mutual respect, and accelerated engineering velocity. You become the engineer everyone wants on their pull requests—not only because you catch critical bugs, but because working with you makes everyone on the team a better engineer.",
                "Furthermore, elite technology organizations recognize that code review culture is the single greatest predictor of engineering onboarding velocity. In a toxic or hyper-critical review culture, newly hired engineers take four to six months before they feel confident enough to submit non-trivial pull requests without extreme performance anxiety. In contrast, within a high-trust culture powered by Conventional Comments and collaborative SBI feedback, new hires submit their first production PR within their first week, receive constructive, encouraging guidance from peers, and reach full independent productivity in less than 30 days. By cultivating this environment, senior engineers actively multiply the human capital and engineering capacity of the entire company, creating a sustainable competitive advantage that outlasts any single product release."
            ],
            "example": "An engineering team that adopts Conventional Comments and the 3-Comment rule, cutting PR cycle times from 4 days to 4 hours while boosting junior developer onboarding velocity by 250%.",
            "code": "// Master High-Trust Engineering Culture Certification Suite\ninterface TeamReviewMetrics {\n  teamName: string;\n  collaborativePhrasingRatio: number; // Target: >= 90%\n  sbiModelCompliancePercent: number;  // Target: >= 95%\n  conventionalCommentsAdoption: number; // Target: >= 90%\n  threeCommentRuleAdherence: boolean;  // Target: true\n}\n\ninterface HighTrustCertification {\n  teamName: string;\n  pillar1Psychology: string;\n  pillar2SbiModel: string;\n  pillar3ConventionalComments: string;\n  pillar4ConflictResolution: string;\n  compositeCultureIndex: number;\n  accreditationLevel: 'HIGH_TRUST_ELITE_SQUAD' | 'CULTURE_REMEDIATION_REQUIRED';\n}\n\nclass CultureCertificationEngine {\n  evaluateTeamCulture(metrics: TeamReviewMetrics): HighTrustCertification {\n    const isPsychSafe = metrics.collaborativePhrasingRatio >= 90;\n    const isSbiValid = metrics.sbiModelCompliancePercent >= 95;\n    const isConventional = metrics.conventionalCommentsAdoption >= 90;\n    const isCircuitBreakerActive = metrics.threeCommentRuleAdherence;\n\n    let score = 0;\n    if (isPsychSafe) score += 25;\n    if (isSbiValid) score += 25;\n    if (isConventional) score += 25;\n    if (isCircuitBreakerActive) score += 25;\n\n    return {\n      teamName: metrics.teamName,\n      pillar1Psychology: isPsychSafe ? 'VERIFIED: ' + metrics.collaborativePhrasingRatio + '% collaborative phrasing' : 'FAIL: High accusatory language',\n      pillar2SbiModel: isSbiValid ? 'VERIFIED: ' + metrics.sbiModelCompliancePercent + '% SBI objective feedback adherence' : 'FAIL: Subjective judgments present',\n      pillar3ConventionalComments: isConventional ? 'VERIFIED: ' + metrics.conventionalCommentsAdoption + '% Conventional Comments adoption' : 'FAIL: Ambiguous comment prefixes',\n      pillar4ConflictResolution: isCircuitBreakerActive ? 'VERIFIED: 3-Comment circuit breaker actively enforced' : 'FAIL: Unbounded PR thread wars',\n      compositeCultureIndex: score,\n      accreditationLevel: score === 100 ? 'HIGH_TRUST_ELITE_SQUAD' : 'CULTURE_REMEDIATION_REQUIRED'\n    };\n  }\n}\n\nconst engine = new CultureCertificationEngine();\nconst eliteTeamMetrics: TeamReviewMetrics = {\n  teamName: 'Core Backend & Distributed Systems Squad',\n  collaborativePhrasingRatio: 96,\n  sbiModelCompliancePercent: 100,\n  conventionalCommentsAdoption: 98,\n  threeCommentRuleAdherence: true\n};\n\nconst cert = engine.evaluateTeamCulture(eliteTeamMetrics);\n\nconsole.log(\"=== HIGH-TRUST ENGINEERING CULTURE CERTIFICATION ===\");\nconsole.log(\"Squad Name:             \" + cert.teamName);\nconsole.log(\"Pillar 1 (Psychology):  \" + cert.pillar1Psychology);\nconsole.log(\"Pillar 2 (SBI Model):   \" + cert.pillar2SbiModel);\nconsole.log(\"Pillar 3 (Convention):  \" + cert.pillar3ConventionalComments);\nconsole.log(\"Pillar 4 (Resolution):  \" + cert.pillar4ConflictResolution);\nconsole.log(\"Composite Culture Score: \" + cert.compositeCultureIndex + \"/100\");\nconsole.log(\"Accreditation Standing:  \" + cert.accreditationLevel);\nconsole.log(\"Culture Invariant: High-trust code reviews transform quality control into accelerated engineering mentorship.\");",
            "output": "=== HIGH-TRUST ENGINEERING CULTURE CERTIFICATION ===\nSquad Name:             Core Backend & Distributed Systems Squad\nPillar 1 (Psychology):  VERIFIED: 96% collaborative phrasing\nPillar 2 (SBI Model):   VERIFIED: 100% SBI objective feedback adherence\nPillar 3 (Convention):  VERIFIED: 98% Conventional Comments adoption\nPillar 4 (Resolution):  VERIFIED: 3-Comment circuit breaker actively enforced\nComposite Culture Score: 100/100\nAccreditation Standing:  HIGH_TRUST_ELITE_SQUAD\nCulture Invariant: High-trust code reviews transform quality control into accelerated engineering mentorship.",
            "codeNotes": [
                {
                    "line": 2,
                    "note": "Initializes comprehensive scorecard evaluating team culture across all 4 code review pillars."
                },
                {
                    "line": 18,
                    "note": "Calculates composite culture score awarding 25 points to each rigorous feedback standard."
                },
                {
                    "line": 39,
                    "note": "Evaluates enterprise engineering squad metrics against institutional benchmarks."
                },
                {
                    "line": 49,
                    "note": "Outputs audited culture certification verifying 100/100 composite index."
                },
                {
                    "line": 56,
                    "note": "Certifies squad as High-Trust Elite Engineering Team with zero communication friction."
                }
            ],
            "tryIt": "Set threeCommentRuleAdherence to false and observe how the score drops to 75 and requires remediation.",
            "check": {
                "question": "What is the primary indicator of an engineering team operating at a 100/100 High-Trust Culture Index?",
                "options": [
                    "Reviews use collaborative phrasing, SBI objective feedback, Conventional Comments prefixes, and resolve debates in 3 exchanges",
                    "Developers never review each other's code and merge directly to main",
                    "The team only communicates through anonymous automated survey forms",
                    "All pull requests are permanently rejected on first submission to test developer grit"
                ],
                "answer": 0,
                "why": "A high-trust engineering culture combines psychological safety, objective SBI feedback, semantic Conventional Comments, and rapid synchronous de-escalation."
            }
        }
    ],
    "summary": [
        "Eliminating accusatory 'You' statements in code reviews protects psychological safety; collaborative 'Could we' phrasing shifts focus to shared quality.",
        "The SBI Model grounds feedback strictly in observable facts (Situation, Behavior) and measurable outcomes (Impact), eliminating personal hostility.",
        "Conventional Comments tags ([blocking], [suggestion], [nit], [praise]) eliminate feedback ambiguity, saving hours of unnecessary debate.",
        "The 3-Comment Rule halts asynchronous PR wars; transitioning to a 10-minute synchronous huddle restores empathy and achieves 'Disagree and Commit' alignment.",
        "High-trust review culture accelerates developer onboarding, reduces defect escape rates, and elevates engineering retention across the enterprise."
    ],
    "projectStep": {
        "title": "Architect an Enterprise High-Trust Code Review & Feedback Portfolio",
        "steps": [
            "Audit an existing pull request review thread, identifying accusatory phrasing and refactoring it into collaborative inquiries.",
            "Author a formal SBI feedback memo regarding a missed test suite or architectural defect without using subjective adjectives.",
            "Implement a Conventional Comments review guide for your engineering squad defining [blocking], [suggestion], [nit], and [praise].",
            "Establish a team working agreement documenting the 3-Comment Circuit Breaker and synchronous huddle de-escalation protocol.",
            "Assemble a High-Trust Culture Scorecard evaluating team review metrics and certifying a 100/100 High-Trust Engineering Culture Index."
        ]
    }
}

if __name__ == "__main__":
    d = get_day_07()
    words = [len(" ".join(p["say"]).split()) for p in d["parts"]]
    total = sum(words)
    print(f"Day 7 Total Words: {total} (~{total/150:.1f} mins), Parts: {words}")
