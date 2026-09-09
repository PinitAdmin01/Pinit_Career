import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const SOFT_SKILLS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Professional Written Communication & Email Architecture: The BLUF Principle",
    "desc": "Master executive-grade written communication in technology organizations: The BLUF Principle (Bottom Line Up Front: Stating the core decision or request in sentence 1), Subject Line Engineering (`[Action Required: by Friday 5 PM] Database Migration Sign-Off`), Eliminating Passive-Aggressive Phrasing (\"As per my last email\" $\\to$ \"Re-sharing the link below for convenience\"), and Structuring Clear Calls to Action (CTA).",
    "syllabus": [
      "The BLUF framework and cognitive load reduction for leadership.",
      "Subject line tagging protocols and urgency calibration.",
      "Constructive, empathetic tone engineering in written correspondence."
    ],
    "eTitle": "BLUF Email Structure & Urgency Tag Validator",
    "eDesc": "Implement function `formatBlufEmail(actionRequiredTag, coreBottomLineSentence, detailedContext, callToAction)` constructing a standardized BLUF email structure.",
    "eStarter": "function formatBlufEmail(tag, bluf, context, cta) {\n  // TODO: Validate tag starts with [ and ends with ], bluf is between 10 and 150 chars, and return formatted email object\n  \n}",
    "eHint": "Check if tag starts with '[' and ends with ']'; check if bluf string length is between 10 and 150 chars; return { subjectLinePrefix: tag, bottomLineUpFront: bluf, callToAction: cta, isBlufCompliant: isApproved, status: isApproved ? 'BLUF_EMAIL_FORMATTED_NOMINAL' : 'BLUF_STRUCTURE_DEFECT' }.",
    "eTest": "const pass = formatBlufEmail('[Action Required: by 5 PM]', 'We need approval to merge the auth refactor into production today.', 'Context details...', 'Please reply with LGTM.');\nconst fail = formatBlufEmail('No brackets', 'Short', 'Context', 'CTA');\nif (!pass.isBlufCompliant || fail.isBlufCompliant || pass.status !== 'BLUF_EMAIL_FORMATTED_NOMINAL') throw new Error('BLUF email formatting failed');\nconst tooLong = formatBlufEmail('[Action Required]', 'A'.repeat(200), 'Ctx', 'CTA');\nif (tooLong.isBlufCompliant) throw new Error('Overly long BLUF should not be compliant');\nif (fail.status !== 'BLUF_STRUCTURE_DEFECT') throw new Error('Defect status check failed');",
    "aTitle": "Action Tag Urgency Categorizer",
    "aDesc": "Implement function `categorizeEmailUrgency(subjectTag)` determining whether tag is 'HIGH_URGENCY' (Action Required), 'MEDIUM_URGENCY' (Feedback/Review), or 'LOW_URGENCY' (FYI/Info).",
    "aStarter": "function categorizeEmailUrgency(tag) {\n  // TODO: Inspect tag text and classify as HIGH_URGENCY, MEDIUM_URGENCY, or LOW_URGENCY\n  \n}",
    "aHint": "Convert tag to uppercase: if includes 'ACTION' or 'URGENT' return 'HIGH_URGENCY'; if includes 'REVIEW' or 'FEEDBACK' return 'MEDIUM_URGENCY'; if includes 'FYI' or 'INFO' return 'LOW_URGENCY'; default 'STANDARD'.",
    "aTest": "if (categorizeEmailUrgency('[ACTION REQUIRED: TODAY]') !== 'HIGH_URGENCY') throw new Error('Action tag urgency failed');\nif (categorizeEmailUrgency('[FEEDBACK NEEDED]') !== 'MEDIUM_URGENCY') throw new Error('Feedback tag urgency failed');\nif (categorizeEmailUrgency('[FYI ONLY]') !== 'LOW_URGENCY') throw new Error('FYI tag urgency failed');"
  },
  {
    "day": 2,
    "title": "Technical Documentation & README Engineering: The Standard 5-Section Architecture",
    "desc": "Architect world-class open-source and internal technical README files: The 5 Canonical Sections (1. Project Title & One-Line Value Proposition; 2. Architecture & Tech Stack; 3. Quickstart & Local Setup in 3 Commands; 4. Environment Configuration (.env.example); 5. Testing, Contributing & License).",
    "syllabus": [
      "The 5-minute onboarding test for new team engineers.",
      "Markdown formatting, copy-pasteable bash code blocks, and badge standards.",
      "Documenting edge cases, troubleshooting FAQs, and architectural trade-offs."
    ],
    "eTitle": "Technical README Completeness & Structure Auditor",
    "eDesc": "Implement function `auditReadmeStructure(readmeMarkdown)` verifying presence of Title, Quickstart, Architecture, Environment, and License sections.",
    "eStarter": "function auditReadmeStructure(readmeMarkdown) {\n  // TODO: Check markdown headers for Title, Quickstart/Setup, Architecture/Stack, Environment/Config, and License\n  \n}",
    "eHint": "Search for markdown header patterns matching '# ', '## Quickstart'|'## Setup', '## Architecture'|'## Tech Stack', '## Environment'|'## Config', and '## License'; return { isProductionGrade: boolean, missingSectionsCount: number, completenessPercent: number }.",
    "eTest": "const full = '# PinIT Engine\\n\\n## Architecture\\nMicroservices\\n\\n## Quickstart\\nnpm run dev\\n\\n## Environment\\nPORT=3000\\n\\n## License\\nMIT';\nconst res = auditReadmeStructure(full);\nif (!res.isProductionGrade || res.missingSectionsCount !== 0 || res.completenessPercent !== 100) throw new Error('Full README was rejected');\nconst incomplete = '# PinIT Engine\\n\\n## Quickstart\\nnpm install';\nconst incompRes = auditReadmeStructure(incomplete);\nif (incompRes.isProductionGrade || incompRes.missingSectionsCount < 3) throw new Error('Incomplete README passed in error');\nconst emptyRes = auditReadmeStructure('');\nif (emptyRes.completenessPercent !== 0) throw new Error('Empty README completeness should be 0');",
    "aTitle": "README Quickstart Command Extractor",
    "aDesc": "Implement function `extractQuickstartCommands(quickstartSectionText)` extracting executable bash commands from triple-backtick bash code blocks.",
    "aStarter": "function extractQuickstartCommands(text) {\n  // TODO: Extract all lines inside ```bash ... ``` or ```sh ... ``` code blocks\n  \n}",
    "aHint": "Use regex /```(?:bash|sh)?\\n([\\s\\S]*?)```/g; extract captured group, split by newline, filter non-empty lines; return command strings array.",
    "aTest": "const md = '## Quickstart\\n```bash\\ngit clone repo\\nnpm install\\nnpm run dev\\n```';\nconst cmds = extractQuickstartCommands(md);\nif (cmds.length !== 3 || cmds[0] !== 'git clone repo' || cmds[2] !== 'npm run dev') throw new Error('Command extraction failed');"
  },
  {
    "day": 3,
    "title": "Active Listening & Paraphrasing in Engineering Meetings: The 3-Step Protocol",
    "desc": "Eliminate costly misalignments with Active Listening: The 3-Step Protocol (1. Validate emotional state/context; 2. Paraphrase core technical constraint without distortion; 3. Clarify with an open-ended question: \"Did I capture that correctly?\").",
    "syllabus": [
      "Passive hearing vs Active listening in synchronous sprint planning.",
      "The 'Reflective Mirror' technique for unblocking tense stakeholder discussions.",
      "Synthesizing scattered requirements into a coherent execution statement."
    ],
    "eTitle": "Active Listening 3-Step Paraphrase Response Generator",
    "eDesc": "Implement function `formatActiveListeningParaphrase(contextValidation, technicalParaphrase, clarifyingQuestion)` constructing empathetic active listening responses.",
    "eStarter": "function formatActiveListeningParaphrase(validation, paraphrase, question) {\n  // TODO: Verify all 3 components are present and construct structured response with isProtocolComplete flag\n  \n}",
    "eHint": "Verify validation.length >= 10, paraphrase.length >= 15, question.endsWith('?'); return { validatedStatement: validation, coreParaphrase: paraphrase, clarifyingPrompt: question, isProtocolComplete: boolean, formattedResponse: string }.",
    "eTest": "const r = formatActiveListeningParaphrase('I understand this latency bottleneck is critical for the release.', 'You need the Redis cache hit ratio brought above 95% before Friday.', 'Does this align with your priorities?');\nif (!r.isProtocolComplete || !r.formattedResponse.includes('Redis cache')) throw new Error('Active listening response failed');\nconst bad = formatActiveListeningParaphrase('Got it.', 'Fix cache.', 'Okay');\nif (bad.isProtocolComplete) throw new Error('Incomplete active listening response accepted');\nif (typeof r.isProtocolComplete !== 'boolean') throw new Error('Return type check failed');",
    "aTitle": "Paraphrase Accuracy & Distortion Scorer",
    "aDesc": "Implement function `scoreParaphraseKeywordOverlap(speakerText, listenerParaphrase)` calculating percentage keyword overlap to verify technical fidelity.",
    "aStarter": "function scoreParaphraseKeywordOverlap(speaker, listener) {\n  // TODO: Extract lowercase words (> 3 chars) from speaker, count how many exist in listener, return percentage overlap\n  \n}",
    "aHint": "Split speaker into words of length > 3; count unique words present in listener; return Number(((matchedCount / uniqueSpeakerWords.length) * 100).toFixed(1));",
    "aTest": "const spk = 'We must migrate PostgreSQL database cluster to AWS RDS Aurora by Monday';\nconst lst = 'You want us to migrate the PostgreSQL database to AWS RDS Aurora before Monday';\nconst score = scoreParaphraseKeywordOverlap(spk, lst);\nif (score < 75.0) throw new Error('Keyword overlap calculation failed');"
  },
  {
    "day": 4,
    "title": "Asynchronous Communication & Slack/Teams Etiquette: The \"No-Hello\" Standard",
    "desc": "Transform team velocity with high-signal asynchronous communication: The \"No-Hello\" Standard (Never send \"Hi\" followed by silence; include context, links, and questions in message 1), Public-by-Default Channel transparency, and Thread discipline.",
    "syllabus": [
      "Context-rich messaging: Context + Problem + Proposed Solution + Links in a single message.",
      "The 'No-Hello' rule (nohello.net) and reducing attention fragmentation.",
      "Emoji reaction protocol: 👀 (looking), ✅ (done), 🚀 (deployed), ❓ (need clarification)."
    ],
    "eTitle": "Asynchronous Message Quality & \"No-Hello\" Auditor",
    "eDesc": "Implement function `auditAsyncMessage(messageText)` auditing message for greeting-only antipattern, presence of context, and actionability.",
    "eStarter": "function auditAsyncMessage(msg) {\n  // TODO: Flag greeting-only messages (<= 15 chars like 'Hi', 'Hello') as antipattern, require >= 30 chars and context\n  \n}",
    "eHint": "Check if trimmed msg is short greeting ('hi', 'hello', 'hey', 'quick question') without body -> return { isNoHelloCompliant: false, penaltyReason: 'GREETING_ONLY_ANTIPATTERN' }; if msg.length >= 30 return { isNoHelloCompliant: true, qualityGrade: 'HIGH_SIGNAL_ASYNC' };",
    "eTest": "const bad = auditAsyncMessage('Hi Vinay, quick question');\nif (bad.isNoHelloCompliant || bad.penaltyReason !== 'GREETING_ONLY_ANTIPATTERN') throw new Error('No-Hello violation failed to trigger');\nconst good = auditAsyncMessage('Hi team, the staging auth service is failing with 500s on /login. PR #42 contains the fix: https://github.com/org/repo/pull/42. Could someone review?');\nif (!good.isNoHelloCompliant || good.qualityGrade !== 'HIGH_SIGNAL_ASYNC') throw new Error('Good async message was rejected');\nconst empty = auditAsyncMessage('');\nif (empty.isNoHelloCompliant) throw new Error('Empty message should fail audit');",
    "aTitle": "Slack Channel Tag Notification Impact Analyzer",
    "aDesc": "Implement function `analyzeNotificationReach(messageText, teamMemberCount)` calculating disruption index for `@here` vs `@channel` vs direct mentions.",
    "aStarter": "function analyzeNotificationReach(text, members) {\n  // TODO: If @channel disruption is members, if @here disruption is members*0.6, if specific mention disruption is 1\n  \n}",
    "aHint": "If message contains '@channel' reached = teamMemberCount; else if message contains '@here' reached = Math.round(teamMemberCount * 0.6); else reached = 1; return { notifiedUsersCount: reached, disruptionLevel: reached > 20 ? 'HIGH_BROADCAST' : 'TARGETED' }.",
    "aTest": "const b1 = analyzeNotificationReach('Hey @channel urgent fix', 50);\nif (b1.notifiedUsersCount !== 50 || b1.disruptionLevel !== 'HIGH_BROADCAST') throw new Error('Channel reach calculation failed');\nconst b2 = analyzeNotificationReach('Hey @alice check this', 50);\nif (b2.notifiedUsersCount !== 1 || b2.disruptionLevel !== 'TARGETED') throw new Error('Targeted reach calculation failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Professional Written Communication, Technical README, Active Listening & Async Collaboration Engine",
    "desc": "Milestone 1: Build an enterprise-grade Tech Communication Gateway synthesizing BLUF email drafting, 5-section README validation, Active Listening 3-step protocols, and asynchronous No-Hello message auditing.",
    "syllabus": [
      "End-to-end written tech communication pipeline.",
      "Automated linting for asynchronous collaboration artifacts.",
      "Executive scorecard generation for software engineers."
    ],
    "eTitle": "Communication Foundations Master Engine",
    "eDesc": "Implement function `executeCommunicationGateway(blufResult, readmeResult, listeningResult, asyncResult)` evaluating composite communication score.",
    "eStarter": "function executeCommunicationGateway(bluf, readme, listening, asyncMsg) {\n  // TODO: Validate that all 4 communication artifacts pass compliance checks and return overall certification\n  \n}",
    "eHint": "Check bluf.isBlufCompliant && readme.isProductionGrade && listening.isProtocolComplete && asyncMsg.isNoHelloCompliant; return { allPassed: boolean, compositeScore: number, gatewayStatus: allPassed ? 'COMM_FOUNDATIONS_CERTIFIED' : 'REMEDIATION_REQUIRED' }.",
    "eTest": "const r = executeCommunicationGateway({ isBlufCompliant: true }, { isProductionGrade: true }, { isProtocolComplete: true }, { isNoHelloCompliant: true });\nif (!r.allPassed || r.gatewayStatus !== 'COMM_FOUNDATIONS_CERTIFIED' || r.compositeScore !== 100) throw new Error('Milestone 1 master gateway failed');\nconst fail = executeCommunicationGateway({ isBlufCompliant: false }, { isProductionGrade: true }, { isProtocolComplete: true }, { isNoHelloCompliant: true });\nif (fail.allPassed || fail.gatewayStatus !== 'REMEDIATION_REQUIRED') throw new Error('Failed gateway accepted in error');\nif (typeof r.compositeScore !== 'number') throw new Error('Composite score type check failed');",
    "aTitle": "Communication Gateway Score Aggregator",
    "aDesc": "Implement function `calculateWeightedCommScore(emailScore, readmeScore, asyncScore, listeningScore)` computing composite percentage (25% each).",
    "aStarter": "function calculateWeightedCommScore(email, readme, asyncS, list) {\n  // TODO: Compute arithmetic average of the 4 scores, formatted to 1 decimal place\n  \n}",
    "aHint": "average = (emailScore + readmeScore + asyncScore + listeningScore) / 4; return Number(average.toFixed(1));",
    "aTest": "const avg = calculateWeightedCommScore(90, 80, 100, 90); // 360 / 4 = 90.0\nif (avg !== 90.0) throw new Error('Weighted score calculation failed');\nif (calculateWeightedCommScore(100, 100, 100, 100) !== 100.0) throw new Error('Perfect score failed');"
  },
  {
    "day": 6,
    "title": "Cross-Functional Alignment & Non-Technical Translation: The ELI5 Framework",
    "desc": "Translate complex engineering architecture into business value for Product Managers, Designers, and Executives: The ELI5 Framework (Explain Like I'm 5: Real-world analogies over implementation details), Focusing on Business Impact (Revenue, Latency, Risk, Churn).",
    "syllabus": [
      "The 'Curse of Knowledge' cognitive bias and simplifying technical explanations.",
      "Mapping architectural refactors to user-facing latency and cost reductions.",
      "Presenting engineering trade-offs to non-technical stakeholders."
    ],
    "eTitle": "Technical-to-Business Value Translation Matcher",
    "eDesc": "Implement function `translateTechnicalToBusiness(technicalTerm, analogyDescription, businessImpact)` structuring clear non-technical translation cards.",
    "eStarter": "function translateTechnicalToBusiness(tech, analogy, impact) {\n  // TODO: Validate that tech, analogy, and impact strings are provided and construct structured translation card\n  \n}",
    "eHint": "Verify technicalTerm.length > 0 && analogyDescription.length >= 15 && businessImpact.length >= 15; return { technicalTerm, analogyExplanation: analogyDescription, businessValue: businessImpact, isTranslationClear: true, cardId: `TRANS_${technicalTerm.toUpperCase().replace(/\\s+/g, '_')}` }.",
    "eTest": "const card = translateTechnicalToBusiness('Database Sharding', 'Splitting a massive library book catalog across 4 distinct checkout counters.', 'Reduces user checkout wait times during Black Friday surges by 80%.');\nif (!card.isTranslationClear || card.cardId !== 'TRANS_DATABASE_SHARDING' || !card.businessValue.includes('80%')) throw new Error('Technical translation card failed');\nconst badCard = translateTechnicalToBusiness('', 'Short', 'Impact');\nif (badCard.isTranslationClear) throw new Error('Incomplete translation card accepted');\nif (!card.analogyExplanation) throw new Error('Analogy field missing');",
    "aTitle": "Jargon Density Index Calculator",
    "aDesc": "Implement function `calculateJargonDensity(text, technicalJargonList)` computing percentage of jargon words in stakeholder communications.",
    "aStarter": "function calculateJargonDensity(text, jargonList) {\n  // TODO: Count words in text matching jargonList, divide by total words, return percentage\n  \n}",
    "aHint": "Split text into words; count occurrences matching jargonList (case-insensitive); return Number(((jargonCount / words.length) * 100).toFixed(1));",
    "aTest": "const list = ['kubernetes', 'sharding', 'mutex', 'epoll'];\nconst text = 'We deployed kubernetes with sharding to fix the mutex bottleneck today'; // 11 words, 3 jargon -> 27.3%\nconst d = calculateJargonDensity(text, list);\nif (d !== 27.3) throw new Error('Jargon density calculation failed');"
  },
  {
    "day": 7,
    "title": "Constructive Feedback & Code Review Psychology: The SBI Feedback Framework",
    "desc": "Master high-trust feedback in code reviews and 1-on-1s: The SBI Model (Situation: Where/when it happened; Behavior: Observable actions, not personality judgments; Impact: How it affected system performance or team velocity).",
    "syllabus": [
      "The Psychology of Code Reviews: Avoiding accusatory 'You' statements; using collaborative 'We' questions.",
      "The SBI Feedback Model: Grounding criticism strictly in verifiable data and business impact.",
      "Distinguishing 'Nitpicks' vs 'Blocking Architectural Changes' in GitHub Pull Requests."
    ],
    "eTitle": "SBI Constructive Feedback Message Generator",
    "eDesc": "Implement function `formatSbiFeedback(situation, observableBehavior, concreteImpact, suggestedNextStep)` constructing structured high-trust feedback.",
    "eStarter": "function formatSbiFeedback(sit, beh, imp, step) {\n  // TODO: Validate that situation, behavior, impact, and step are non-empty and construct SBI feedback object\n  \n}",
    "eHint": "Verify situation.length >= 10, observableBehavior.length >= 10, concreteImpact.length >= 10, suggestedNextStep.length >= 10; return { situation, behavior: observableBehavior, impact: concreteImpact, recommendation: suggestedNextStep, isSbiCompliant: true, structuredMessage: `In ${situation}, when ${observableBehavior}, it caused ${concreteImpact}. Moving forward, ${suggestedNextStep}.` }.",
    "eTest": "const f = formatSbiFeedback('yesterday\\'s PR #104 review', 'unindexed queries were introduced on the users table', 'staging DB CPU spikes to 100% on load tests', 'let\\'s add a composite index on (tenant_id, created_at)');\nif (!f.isSbiCompliant || !f.structuredMessage.includes('PR #104') || !f.structuredMessage.includes('composite index')) throw new Error('SBI feedback construction failed');\nconst bad = formatSbiFeedback('', '', '', '');\nif (bad.isSbiCompliant) throw new Error('Empty SBI feedback accepted');\nif (typeof f.isSbiCompliant !== 'boolean') throw new Error('Type check failed');",
    "aTitle": "Code Review Comment Severity Classifier",
    "aDesc": "Implement function `classifyPrCommentPrefix(commentText)` categorizing comments starting with `[nit]`, `[blocking]`, `[question]`, or `[suggestion]`.",
    "aStarter": "function classifyPrCommentPrefix(comment) {\n  // TODO: Return BLOCKING, NITPICK, QUESTION, or SUGGESTION based on comment prefix\n  \n}",
    "aHint": "Convert prefix to lowercase: if startsWith('[blocking]') return 'BLOCKING'; if startsWith('[nit]') return 'NITPICK'; if startsWith('[question]') return 'QUESTION'; default 'SUGGESTION'.",
    "aTest": "if (classifyPrCommentPrefix('[blocking] Missing null check on line 42') !== 'BLOCKING') throw new Error('Blocking prefix classification failed');\nif (classifyPrCommentPrefix('[nit] Prefer const over let') !== 'NITPICK') throw new Error('Nitpick prefix classification failed');\nif (classifyPrCommentPrefix('What does this function return?') !== 'SUGGESTION') throw new Error('Default suggestion prefix failed');"
  },
  {
    "day": 8,
    "title": "Conflict Resolution & De-escalation in Tech Teams: The IBR Approach",
    "desc": "De-escalate high-stakes engineering disputes: Interest-Based Relational (IBR) Approach (Separate people from the problem, Focus on underlying architectural goals rather than entrenched positions, Establish objective decision criteria).",
    "syllabus": [
      "The IBR 6-Step Conflict Resolution Architecture.",
      "Moving from Positions ('We MUST use Rust') to Interests ('We need sub-millisecond memory safety').",
      "Building a Weighted Decision Matrix (Pugh Matrix) to resolve technical impasses objectively."
    ],
    "eTitle": "Interest-Based Conflict De-escalation Evaluator",
    "eDesc": "Implement function `evaluateIbrConflict(statedPosition, underlyingInterest, objectiveCriteria)` structuring collaborative resolution proposals.",
    "eStarter": "function evaluateIbrConflict(pos, interest, criteria) {\n  // TODO: Validate position, interest, criteria array, and compute resolution alignment score\n  \n}",
    "eHint": "Verify statedPosition.length > 0 && underlyingInterest.length >= 10 && criteria.length >= 2; return { statedPosition, identifiedInterest: underlyingInterest, evaluationCriteria: criteria, isObjectiveResolutionReady: true, consensusMethod: 'WEIGHTED_DECISION_MATRIX' }.",
    "eTest": "const res = evaluateIbrConflict('Insisting on custom ORM', 'Preventing N+1 queries and enforcing strict tenant isolation', ['Query Latency p99 < 10ms', 'Developer Onboarding Time < 2 days', 'Type Safety']);\nif (!res.isObjectiveResolutionReady || res.evaluationCriteria.length !== 3 || res.consensusMethod !== 'WEIGHTED_DECISION_MATRIX') throw new Error('IBR conflict evaluation failed');\nconst bad = evaluateIbrConflict('', '', []);\nif (bad.isObjectiveResolutionReady) throw new Error('Empty IBR conflict accepted');\nif (res.identifiedInterest.length < 10) throw new Error('Interest validation failed');",
    "aTitle": "Decision Matrix Weighted Score Calculator",
    "aDesc": "Implement function `calculatePughMatrixScore(criterionWeights, optionScores)` calculating composite weighted score across competing technical choices.",
    "aStarter": "function calculatePughMatrixScore(weights, scores) {\n  // TODO: Compute sum of (weights[i] * scores[i]), divide by sum of weights, return weighted average\n  \n}",
    "aHint": "totalWeight = weights.reduce((a, b) => a + b, 0); weightedSum = weights.reduce((sum, w, i) => sum + w * scores[i], 0); return Number((weightedSum / totalWeight).toFixed(2));",
    "aTest": "const w = [0.5, 0.3, 0.2];\nconst s = [9, 7, 8]; // 4.5 + 2.1 + 1.6 = 8.2\nconst score = calculatePughMatrixScore(w, s);\nif (score !== 8.20) throw new Error('Pugh matrix calculation failed');"
  },
  {
    "day": 9,
    "title": "Effective Agile Standups & Synchronous Meetings: The 90-Second Update",
    "desc": "Run crisp, high-impact synchronous meetings: The 90-Second Standup Protocol (1. What was completed yesterday; 2. What will be shipped today; 3. Urgent blockers requiring assistance), Eliminating technical rabbit holes (\"Let's park that for a parking-lot breakout\").",
    "syllabus": [
      "The 3-point standup format and eliminating conversational storytelling.",
      "The 'Parking Lot' pattern: Taking deep dives offline to respect 10 engineers' time.",
      "Meeting cost calculation: Cost of 1-hour meeting = $10 \\times \\text{Hourly Rate}$."
    ],
    "eTitle": "90-Second Standup Update Parser & Timer Auditor",
    "eDesc": "Implement function `auditStandupUpdate(yesterdayCompleted, todayCommitted, blockers, estimatedSeconds)` verifying concise, blocker-focused standup delivery.",
    "eStarter": "function auditStandupUpdate(yesterday, today, blockers, seconds) {\n  // TODO: Verify yesterday, today, blockers are non-empty, and seconds <= 90 to pass standup audit\n  \n}",
    "eHint": "Check yesterday.length > 0 && today.length > 0; isTimeCompliant = estimatedSeconds <= 90; hasBlocker = Boolean(blockers && blockers.length > 0); return { isStandupConcise: isTimeCompliant, durationSeconds: estimatedSeconds, needsParkingLot: estimatedSeconds > 90, blockerFlagged: hasBlocker }.",
    "eTest": "const pass = auditStandupUpdate('Merged auth PR', 'Implementing Redis caching', 'Waiting on AWS IAM permissions from DevOps', 60);\nif (!pass.isStandupConcise || pass.needsParkingLot || !pass.blockerFlagged) throw new Error('Standard 60s standup failed');\nconst longUpdate = auditStandupUpdate('Did lots of things...', 'More things...', '', 180);\nif (longUpdate.isStandupConcise || !longUpdate.needsParkingLot) throw new Error('180s rambling standup passed in error');\nif (pass.durationSeconds !== 60) throw new Error('Duration mismatch');",
    "aTitle": "Meeting Cost Impact Financial Calculator",
    "aDesc": "Implement function `calculateMeetingCost(attendeeCount, durationMinutes, averageHourlyRate = 85)` calculating engineering payroll cost of meeting.",
    "aStarter": "function calculateMeetingCost(attendees, durationMin, rate = 85) {\n  // TODO: Compute (attendees * (durationMin / 60) * rate) and return formatted cost\n  \n}",
    "aHint": "cost = attendeeCount * (durationMinutes / 60) * averageHourlyRate; return Number(cost.toFixed(2));",
    "aTest": "const cost = calculateMeetingCost(10, 60, 100); // 10 * 1h * $100 = $1,000\nif (cost !== 1000.00) throw new Error('Meeting cost calculation failed');\nconst halfHour = calculateMeetingCost(6, 30, 80); // 6 * 0.5 * 80 = $240\nif (halfHour !== 240.00) throw new Error('Half-hour meeting cost failed');"
  },
  {
    "day": 10,
    "title": "Technical Presentations & Slide Deck Architecture: The Minto Pyramid Principle",
    "desc": "Deliver captivating technical presentations to executives and teams: Barbara Minto's Pyramid Principle (Lead with the conclusion/answer $\\to$ Group key supporting arguments $\\to$ Provide backing technical data only as needed), 1 Idea per Slide rule, and High-Signal Architecture Diagrams.",
    "syllabus": [
      "Top-Down vs Bottom-Up Storytelling in engineering slide decks.",
      "The SCQA Framework (Situation, Complication, Question, Answer).",
      "Designing slide deck visuals that executives can grasp in 5 seconds."
    ],
    "eTitle": "Minto Pyramid Presentation Outline Validator",
    "eDesc": "Implement function `validateMintoPresentation(governingThought, supportingArguments, detailedEvidence)` ensuring top-down hierarchical flow.",
    "eStarter": "function validateMintoPresentation(thought, args, evidence) {\n  // TODO: Verify governingThought is concise, args.length >= 2, and evidence array matches args count\n  \n}",
    "eHint": "Verify thought.length >= 15 && args.length >= 2 && evidence.length >= args.length; return { isMintoCompliant: boolean, governingThought: thought, keyPillarsCount: args.length, structureStatus: 'TOP_DOWN_NOMINAL' }.",
    "eTest": "const p = validateMintoPresentation('We must migrate from REST to gRPC to cut inter-service latency by 75%', ['gRPC uses HTTP/2 binary framing', 'Protobuf delivers strict schema typing'], [['Benchmark shows 4ms vs 18ms', 'Multiplexing saves 40 TCP conns'], ['Generated TypeScript types reduce runtime bugs']]);\nif (!p.isMintoCompliant || p.keyPillarsCount !== 2 || p.structureStatus !== 'TOP_DOWN_NOMINAL') throw new Error('Minto presentation validation failed');\nconst bad = validateMintoPresentation('Short', [], []);\nif (bad.isMintoCompliant) throw new Error('Empty Minto presentation passed in error');\nif (typeof p.keyPillarsCount !== 'number') throw new Error('Pillars count type error');",
    "aTitle": "Slide Presentation Time Pacing Estimator",
    "aDesc": "Implement function `calculateSlidePacing(slideCount, totalPresentationMinutes)` calculating average seconds allocated per slide against 120s rule.",
    "aStarter": "function calculateSlidePacing(slides, totalMins) {\n  // TODO: Compute (totalMins * 60) / slides and evaluate if within healthy pacing (60s - 180s per slide)\n  \n}",
    "aHint": "secPerSlide = (totalPresentationMinutes * 60) / slideCount; isPacingHealthy = secPerSlide >= 60 && secPerSlide <= 180; return { secondsPerSlide: Number(secPerSlide.toFixed(1)), isHealthyPacing: isPacingHealthy }.",
    "aTest": "const pace = calculateSlidePacing(15, 30); // 1800s / 15 = 120s -> Healthy\nif (pace.secondsPerSlide !== 120.0 || !pace.isHealthyPacing) throw new Error('Slide pacing calculation failed');\nconst rushed = calculateSlidePacing(60, 20); // 1200s / 60 = 20s -> Unhealthy\nif (rushed.isHealthyPacing) throw new Error('Rushed pacing flagged healthy in error');"
  },
  {
    "day": 11,
    "title": "Executive Presence & Delivering Bad News: The SCR Communication Framework",
    "desc": "Communicate incidents, delayed milestones, and architectural failures with executive presence: The SCR Framework (Situation: Baseline context; Complication: What broke and business impact; Resolution: Concrete recovery plan with owner and ETA).",
    "syllabus": [
      "Delivering bad news without defensiveness or finger-pointing.",
      "The 'Own It, Fix It, Prevent It' crisis communication triad.",
      "Managing up: Giving executives options with explicit risk-benefit trade-offs."
    ],
    "eTitle": "SCR Executive Crisis Communication Generator",
    "eDesc": "Implement function `generateScrIncidentBrief(situation, complication, resolutionPlan, estimatedRecoveryMinutes)` generating structured crisis briefs.",
    "eStarter": "function generateScrIncidentBrief(sit, comp, plan, eta) {\n  // TODO: Validate situation, complication, resolutionPlan, and etaMinutes > 0, returning executive incident brief\n  \n}",
    "eHint": "Verify situation.length >= 10 && complication.length >= 10 && resolutionPlan.length >= 10 && etaMinutes > 0; return { situation, complication, resolution: resolutionPlan, etaMinutes: estimatedRecoveryMinutes, isExecutiveReady: true, briefType: 'INCIDENT_RECOVERY_DISPATCH' }.",
    "eTest": "const brief = generateScrIncidentBrief('Payment gateway processing 10,000 tx/min', 'Third-party webhook SSL certificate expired, causing 30% checkout failure', 'Switched traffic to backup Stripe gateway and notified vendor', 15);\nif (!brief.isExecutiveReady || brief.etaMinutes !== 15 || brief.briefType !== 'INCIDENT_RECOVERY_DISPATCH') throw new Error('SCR incident brief failed');\nconst badBrief = generateScrIncidentBrief('', '', '', 0);\nif (badBrief.isExecutiveReady) throw new Error('Incomplete SCR brief accepted');\nif (!brief.resolution) throw new Error('Resolution field missing');",
    "aTitle": "Incident Severity Level Evaluator",
    "aDesc": "Implement function `classifyIncidentSeverity(affectedUsersPercentage, financialLossPerHour)` returning 'SEV_1_CRITICAL', 'SEV_2_MAJOR', or 'SEV_3_MINOR'.",
    "aStarter": "function classifyIncidentSeverity(usersPct, lossPerHour) {\n  // TODO: If usersPct >= 25 or lossPerHour >= 10000 -> SEV_1; if usersPct >= 5 -> SEV_2; else SEV_3\n  \n}",
    "aHint": "If (usersPct >= 25.0 || lossPerHour >= 10000) return 'SEV_1_CRITICAL'; if (usersPct >= 5.0 || lossPerHour >= 1000) return 'SEV_2_MAJOR'; return 'SEV_3_MINOR';",
    "aTest": "if (classifyIncidentSeverity(30, 50000) !== 'SEV_1_CRITICAL') throw new Error('SEV 1 classification failed');\nif (classifyIncidentSeverity(10, 500) !== 'SEV_2_MAJOR') throw new Error('SEV 2 classification failed');\nif (classifyIncidentSeverity(1, 100) !== 'SEV_3_MINOR') throw new Error('SEV 3 classification failed');"
  },
  {
    "day": 12,
    "title": "Negotiation & Persuasion for Engineers: Establishing ZOPA & BATNA",
    "desc": "Negotiate engineering scope, timelines, and technical debt allocation: Zone of Possible Agreement (ZOPA), Best Alternative to a Negotiated Agreement (BATNA), The Anchor Effect in sprint estimations, and Principled Negotiation (Fisher & Ury).",
    "syllabus": [
      "The Harvard Principled Negotiation Model for software engineering deadlines.",
      "Calculating ZOPA overlap between Engineering Quality requirements and Product launch dates.",
      "Establishing strong BATNAs before committing to unrealistic sprint roadmaps."
    ],
    "eTitle": "ZOPA Scope Negotiation Range Evaluator",
    "eDesc": "Implement function `calculateZopaRange(engineerMinDays, engineerMaxDays, productMinDays, productMaxDays)` finding feasible agreement overlap.",
    "eStarter": "function calculateZopaRange(engMin, engMax, prodMin, prodMax) {\n  // TODO: Find overlap between [engineerMinDays, engineerMaxDays] and [productMinDays, productMaxDays]\n  \n}",
    "eHint": "overlapStart = Math.max(engineerMinDays, productMinDays); overlapEnd = Math.min(engineerMaxDays, productMaxDays); hasZopa = overlapStart <= overlapEnd; return { hasZopaAgreementZone: hasZopa, zopaMinDays: hasZopa ? overlapStart : null, zopaMaxDays: hasZopa ? overlapEnd : null, overlapDaysCount: hasZopa ? (overlapEnd - overlapStart) : 0 }.",
    "eTest": "const res = calculateZopaRange(10, 20, 15, 25); // Overlap is [15, 20] (5 days)\nif (!res.hasZopaAgreementZone || res.zopaMinDays !== 15 || res.zopaMaxDays !== 20 || res.overlapDaysCount !== 5) throw new Error('ZOPA calculation failed');\nconst noZopa = calculateZopaRange(20, 30, 5, 10); // No overlap\nif (noZopa.hasZopaAgreementZone || noZopa.overlapDaysCount !== 0) throw new Error('Disjoint ZOPA flagged agreement in error');\nconst exact = calculateZopaRange(10, 10, 10, 10);\nif (!exact.hasZopaAgreementZone || exact.zopaMinDays !== 10) throw new Error('Exact point ZOPA failed');",
    "aTitle": "Negotiation Scope Trade-off Triangle Evaluator",
    "aDesc": "Implement function `evaluateIronTriangle(scopePoints, budgetDollars, deadlineWeeks, fixedConstraint)` enforcing Project Management Iron Triangle.",
    "aStarter": "function evaluateIronTriangle(scope, budget, deadline, fixed) {\n  // TODO: Verify that if one constraint is FIXED, at least one of the other two remains FLEXIBLE\n  \n}",
    "aHint": "Verify fixedConstraint is one of ['SCOPE', 'BUDGET', 'DEADLINE']; return { fixedConstraint, isFeasiblePlan: true, recommendation: `Allow flexibility in ${fixedConstraint === 'DEADLINE' ? 'SCOPE' : 'DEADLINE'}` }.",
    "aTest": "const t = evaluateIronTriangle(100, 50000, 6, 'DEADLINE');\nif (!t.isFeasiblePlan || !t.recommendation.includes('SCOPE')) throw new Error('Iron triangle trade-off failed');"
  },
  {
    "day": 13,
    "title": "Time Management & Deep Work Boundary Setting: Maker's Schedule vs Manager's Schedule",
    "desc": "Protect engineering focus: Paul Graham's Maker's Schedule vs Manager's Schedule (4-hour continuous uninterrupted blocks vs 30-minute meeting slots), Setting Asynchronous Boundaries, Batching Communication, and saying \"No\" with empathy.",
    "syllabus": [
      "The cognitive cost of context switching ($23\\text{ minutes}$ to regain deep focus).",
      "Designing 'No-Meeting Wednesdays' and morning deep work blocks.",
      "Empathetic boundary defense: \"I can deliver feature X on time, or attend this meeting, which is higher priority?\""
    ],
    "eTitle": "Maker's Schedule Deep Work Block Auditor",
    "eDesc": "Implement function `auditMakersSchedule(dayScheduleSlots)` checking for at least one uninterrupted 3.5+ hour deep work coding block.",
    "eStarter": "function auditMakersSchedule(slots) {\n  // TODO: Find consecutive uninterrupted coding slots (where isMeeting === false), checking if max block >= 210 minutes\n  \n}",
    "eHint": "Iterate slots; calculate longest consecutive stretch where slot.isMeeting === false (summing durationMinutes); return { hasDeepWorkBlock: maxBlock >= 210, longestDeepWorkMinutes: maxBlock, fragmentationScore: Math.round(100 - (meetingsCount * 15)) }.",
    "eTest": "const good = [{ durationMinutes: 240, isMeeting: false }, { durationMinutes: 30, isMeeting: true }, { durationMinutes: 60, isMeeting: false }];\nconst r1 = auditMakersSchedule(good);\nif (!r1.hasDeepWorkBlock || r1.longestDeepWorkMinutes !== 240) throw new Error('Valid deep work block rejected');\nconst fragmented = [{ durationMinutes: 60, isMeeting: false }, { durationMinutes: 30, isMeeting: true }, { durationMinutes: 60, isMeeting: false }, { durationMinutes: 30, isMeeting: true }];\nconst r2 = auditMakersSchedule(fragmented);\nif (r2.hasDeepWorkBlock || r2.longestDeepWorkMinutes !== 60) throw new Error('Fragmented schedule passed in error');\nconst emptySchedule = auditMakersSchedule([]);\nif (emptySchedule.hasDeepWorkBlock) throw new Error('Empty schedule deep work check failed');",
    "aTitle": "Context Switching Overhead Time Calculator",
    "aDesc": "Implement function `calculateContextSwitchingLoss(meetingCount, standardRecoveryMinutes = 23)` calculating total lost engineering focus hours per day.",
    "aStarter": "function calculateContextSwitchingLoss(meetings, recovery = 23) {\n  // TODO: Compute (meetings * recovery) / 60 and return lost focus hours\n  \n}",
    "aHint": "lostHours = (meetingCount * standardRecoveryMinutes) / 60; return Number(lostHours.toFixed(2));",
    "aTest": "const lost = calculateContextSwitchingLoss(4, 23); // 4 * 23 = 92 mins = 1.53 hours\nif (lost !== 1.53) throw new Error('Context switching loss calculation failed');\nif (calculateContextSwitchingLoss(0, 23) !== 0.00) throw new Error('Zero meeting loss check failed');"
  },
  {
    "day": 14,
    "title": "Mental Health, Imposter Syndrome & Burnout Prevention: Psychological Safety",
    "desc": "Thrive in high-intensity software engineering cultures: Amy Edmondson's Psychological Safety, De-constructing Imposter Syndrome with factual proof-of-work logs, Recognizing Burnout Warning Signs, and Constructive Learning Mindsets.",
    "syllabus": [
      "Psychological safety as the #1 predictor of high-performing engineering teams (Google Project Aristotle).",
      "Maintaining a 'Brag Document' (Achievements, PRs merged, Incidents resolved).",
      "Reframing 'I don't know this' to 'I haven't investigated this codebase yet'."
    ],
    "eTitle": "Constructive Learning Reframing Response Generator",
    "eDesc": "Implement function `reframeFixedMindset(fixedMindsetStatement, growthMindsetAlternative, actionableProof)` generating growth-oriented cognitive reframes.",
    "eStarter": "function reframeFixedMindset(fixed, growth, proof) {\n  // TODO: Validate that fixed, growth, and proof strings are provided and construct cognitive reframing record\n  \n}",
    "eHint": "Verify fixedMindsetStatement.length >= 10 && growthMindsetAlternative.length >= 10 && actionableProof.length >= 10; return { fixedThought: fixedMindsetStatement, reframedMindset: growthMindsetAlternative, objectiveEvidence: actionableProof, isConstructiveReframe: true, psychologicalSafetyScore: 100 }.",
    "eTest": "const ref = reframeFixedMindset('I am not smart enough to write distributed consensus algorithms.', 'Distributed consensus requires studying Paxos and Raft step by step, which I can master with deliberate practice.', 'Successfully implemented Redis pub/sub queue and passed all multi-broker integration tests.');\nif (!ref.isConstructiveReframe || !ref.reframedMindset.includes('Raft') || ref.psychologicalSafetyScore !== 100) throw new Error('Mindset reframing failed');\nconst bad = reframeFixedMindset('', '', '');\nif (bad.isConstructiveReframe) throw new Error('Empty reframing accepted in error');\nif (!ref.objectiveEvidence) throw new Error('Evidence field missing');",
    "aTitle": "Team Psychological Safety Index Scorer",
    "aDesc": "Implement function `calculatePsychologicalSafetyScore(surveyAnswers)` computing average score across Amy Edmondson's 7 psychological safety dimensions.",
    "aStarter": "function calculatePsychologicalSafetyScore(answers) {\n  // TODO: Sum surveyAnswers (1-5 scale), divide by answers.length, return score normalized to 100%\n  \n}",
    "aHint": "avg = answers.reduce((a, b) => a + b, 0) / answers.length; pct = (avg / 5) * 100; return { averageRating: Number(avg.toFixed(2)), safetyScorePercent: Number(pct.toFixed(1)), isHighSafetyTeam: pct >= 80 };",
    "aTest": "const res = calculatePsychologicalSafetyScore([5, 4, 5, 4, 5]); // Avg = 4.6 / 5 = 92.0%\nif (res.averageRating !== 4.60 || res.safetyScorePercent !== 92.0 || !res.isHighSafetyTeam) throw new Error('Psychological safety score failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine",
    "desc": "Milestone 2: Construct an executive tech leadership communication orchestration kernel: ELI5 business translation, SBI feedback generation, IBR conflict mediation, and SCR executive crisis communication.",
    "syllabus": [
      "Enterprise Tech Leadership communication pipeline.",
      "Multi-stakeholder alignment and conflict de-escalation validation.",
      "Executive board presentation and crisis mitigation mastery."
    ],
    "eTitle": "Tech Leadership Communication Master Engine",
    "eDesc": "Implement function `executeTechLeadershipGateway(translationCard, sbiFeedback, ibrResolution, scrBrief)` certifying tech leadership communication readiness.",
    "eStarter": "function executeTechLeadershipGateway(card, sbi, ibr, scr) {\n  // TODO: Validate that all 4 leadership components pass compliance checks and return certification status\n  \n}",
    "eHint": "Verify card.isTranslationClear && sbi.isSbiCompliant && ibr.isObjectiveResolutionReady && scr.isExecutiveReady; return { isCertified: boolean, leadershipScore: 100, masterStatus: isCertified ? 'TECH_LEADERSHIP_MASTER_ACTIVE' : 'REMEDIATION_REQUIRED' }.",
    "eTest": "const r = executeTechLeadershipGateway({ isTranslationClear: true }, { isSbiCompliant: true }, { isObjectiveResolutionReady: true }, { isExecutiveReady: true });\nif (!r.isCertified || r.masterStatus !== 'TECH_LEADERSHIP_MASTER_ACTIVE' || r.leadershipScore !== 100) throw new Error('Milestone 2 leadership master failed');\nconst fail = executeTechLeadershipGateway({ isTranslationClear: false }, { isSbiCompliant: true }, { isObjectiveResolutionReady: true }, { isExecutiveReady: true });\nif (fail.isCertified || fail.masterStatus !== 'REMEDIATION_REQUIRED') throw new Error('Failed leadership gateway passed in error');\nif (typeof r.isCertified !== 'boolean') throw new Error('Return type check failed');",
    "aTitle": "Leadership Communication Competency Matrix Aggregator",
    "aDesc": "Implement function `aggregateLeadershipCompetency(translationScore, feedbackScore, negotiationScore, presentationScore)` computing composite index.",
    "aStarter": "function aggregateLeadershipCompetency(t, f, n, p) {\n  // TODO: Compute weighted score (Translation 25%, Feedback 30%, Negotiation 25%, Presentation 20%)\n  \n}",
    "aHint": "weighted = translationScore * 0.25 + feedbackScore * 0.30 + negotiationScore * 0.25 + presentationScore * 0.20; return { weightedScore: Number(weighted.toFixed(2)), isMasteryAchieved: weighted >= 85 };",
    "aTest": "const ag = aggregateLeadershipCompetency(90, 85, 90, 80); // 22.5 + 25.5 + 22.5 + 16 = 86.5\nif (ag.weightedScore !== 86.50 || !ag.isMasteryAchieved) throw new Error('Leadership matrix aggregation failed');"
  },
  {
    "day": 16,
    "title": "Tech Resume Engineering: The Google X-Y-Z Formula & Impact Quantification",
    "desc": "Engineer a high-signal tech resume that passes ATS parsers and catches engineering directors' attention: The Google X-Y-Z Formula (\"Accomplished [X] as measured by [Y], by doing [Z]\"), Eliminating weak buzzwords (\"Responsible for...\"), and Quantifying scale (QPS, Latency, Revenue, Memory).",
    "syllabus": [
      "The 6-second resume screening test by hiring managers.",
      "Transforming task descriptions into quantified business achievements.",
      "Formatting single-page software engineer resumes for maximum ATS parse rate."
    ],
    "eTitle": "Google X-Y-Z Resume Bullet Point Structure Validator",
    "eDesc": "Implement function `validateGoogleXyzBullet(accomplishedX, measuredByY, byDoingZ)` verifying strict adherence to the Google X-Y-Z impact formula.",
    "eStarter": "function validateGoogleXyzBullet(x, y, z) {\n  // TODO: Validate that X (Action), Y (Quantified Metric with digits/%), and Z (Technical Method) are present and format bullet\n  \n}",
    "eHint": "Verify x.length >= 10; check if y contains digits or '%' or '$' (metric verification); check z.length >= 10; return { isXyzCompliant: boolean, formattedBullet: `Accomplished ${x} as measured by ${y}, by doing ${z}.`, metricDetected: y }.",
    "eTest": "const b = validateGoogleXyzBullet('reduced p99 API latency from 450ms to 85ms', '81% latency decrease', 'implementing multi-tier Redis caching and database connection pooling');\nif (!b.isXyzCompliant || !b.formattedBullet.includes('81%') || !b.formattedBullet.includes('Redis')) throw new Error('Google X-Y-Z bullet validation failed');\nconst unquantified = validateGoogleXyzBullet('worked on backend', 'a lot of improvement', 'coding in python');\nif (unquantified.isXyzCompliant) throw new Error('Unquantified bullet passed in error');\nconst emptyBullet = validateGoogleXyzBullet('', '', '');\nif (emptyBullet.isXyzCompliant) throw new Error('Empty bullet check failed');",
    "aTitle": "Resume Action Verb Impact Rater",
    "aDesc": "Implement function `rateActionVerbStrength(verb)` categorizing verbs as 'HIGH_IMPACT_LEADERSHIP' (Architected, Engineered, Optimized) vs 'WEAK_PASSIVE' (Helped, Worked on, Handled).",
    "aStarter": "function rateActionVerbStrength(verb) {\n  // TODO: Map strong verbs to HIGH_IMPACT_LEADERSHIP and passive verbs to WEAK_PASSIVE\n  \n}",
    "aHint": "strong = ['architected', 'engineered', 'optimized', 'spearheaded', 'automated', 'slashed']; weak = ['helped', 'worked', 'handled', 'assisted', 'responsible']; check word and return rating string.",
    "aTest": "if (rateActionVerbStrength('Architected') !== 'HIGH_IMPACT_LEADERSHIP') throw new Error('Strong verb rating failed');\nif (rateActionVerbStrength('Worked on') !== 'WEAK_PASSIVE') throw new Error('Weak verb rating failed');\nif (rateActionVerbStrength('Optimized') !== 'HIGH_IMPACT_LEADERSHIP') throw new Error('Optimized verb rating failed');"
  },
  {
    "day": 17,
    "title": "LinkedIn Optimization & Personal Branding: High-Signal Engineering Profiles",
    "desc": "Build an inbound recruiter magnet on LinkedIn: The 3-Part Technical Headline (`Role | Core Stack (e.g. Node, React, AWS) | Quantified Achievement or Niche Focus`), About section narrative arc, and Showcasing Open Source / GitHub Proof-of-Work.",
    "syllabus": [
      "Recruiter search algorithms (Boolean search and skill keyword matching).",
      "Writing a technical 'About' section that demonstrates passion and engineering rigor.",
      "Optimizing featured sections with live production demos, architecture whitepapers, and repositories."
    ],
    "eTitle": "LinkedIn Technical Headline Signal Evaluator",
    "eDesc": "Implement function `evaluateLinkedInHeadline(headlineString)` verifying role clarity, core tech stack listing, and value quantification.",
    "eStarter": "function evaluateLinkedInHeadline(headline) {\n  // TODO: Check if headline contains pipe '|' or '•' separators, mentions tech keywords, and is between 30 and 220 chars\n  \n}",
    "eHint": "Check if headline has delimiter ('|' or '•'); check length >= 30 && <= 220; check if contains keywords like 'Engineer' or 'Developer'; return { isHighSignal: boolean, sectionCount: parts.length, headlineLength: headline.length }.",
    "eTest": "const hl = 'Senior Backend Engineer | Node.js, Go, AWS, Kubernetes | Scaled FinTech API to 10M DAU';\nconst res = evaluateLinkedInHeadline(hl);\nif (!res.isHighSignal || res.sectionCount !== 3 || res.headlineLength < 30) throw new Error('High signal headline failed');\nconst lowHl = 'Looking for opportunities';\nconst lowRes = evaluateLinkedInHeadline(lowHl);\nif (lowRes.isHighSignal) throw new Error('Generic headline passed in error');\nconst emptyHl = evaluateLinkedInHeadline('');\nif (emptyHl.isHighSignal) throw new Error('Empty headline check failed');",
    "aTitle": "LinkedIn Profile Keyword Density Counter",
    "aDesc": "Implement function `countProfileSkillKeywords(profileAboutText, targetSkills)` counting matched target skills for recruiter search visibility.",
    "aStarter": "function countProfileSkillKeywords(text, skills) {\n  // TODO: Count occurrences of each target skill in profile text (case-insensitive) and return matchedSkills array\n  \n}",
    "aHint": "Lower text; matched = skills.filter(s => text.toLowerCase().includes(s.toLowerCase())); return { matchedCount: matched.length, matchedSkills: matched, searchVisibilityScore: Math.min(100, matched.length * 20) };",
    "aTest": "const text = 'Full-stack software engineer specializing in TypeScript, React, PostgreSQL, Docker, and AWS cloud architectures.';\nconst res = countProfileSkillKeywords(text, ['TypeScript', 'React', 'Docker', 'Rust', 'GraphQL']);\nif (res.matchedCount !== 3 || !res.matchedSkills.includes('React')) throw new Error('Skill keyword counter failed');"
  },
  {
    "day": 18,
    "title": "The Behavioral Interview Framework: The STAR Method & Time Allocation",
    "desc": "Conquer behavioral interviews at FAANG/Tier-1 tech companies: The STAR Method (Situation: 15%, Task: 10%, Action: 60%, Result: 15%), Focusing ruthlessly on \"I\" instead of \"We\", and Anchoring on measurable business outcomes.",
    "syllabus": [
      "Amazon's 16 Leadership Principles & Google's Googleyness behavioral rubrics.",
      "The 60% Action Rule: Why interviewers fail candidates who spend 3 minutes setting up context.",
      "Structuring 2-minute concise behavioral story units."
    ],
    "eTitle": "STAR Behavioral Response Time Allocation Auditor",
    "eDesc": "Implement function `auditStarTimeAllocation(situationSec, taskSec, actionSec, resultSec)` ensuring Action section receives at least 50% of total response duration.",
    "eStarter": "function auditStarTimeAllocation(sitSec, taskSec, actSec, resSec) {\n  // TODO: Compute total seconds and verify action percentage is >= 50% and total duration is between 90s and 180s\n  \n}",
    "eHint": "total = situationSec + taskSec + actionSec + resultSec; actionPct = (actionSec / total) * 100; isCompliant = actionPct >= 50.0 && total >= 90 && total <= 180; return { totalDurationSeconds: total, actionPercentage: Number(actionPct.toFixed(1)), isTimeAllocatedOptimally: isCompliant }.",
    "eTest": "const opt = auditStarTimeAllocation(15, 15, 75, 15); // Total = 120s, Action = 75s (62.5%)\nif (!opt.isTimeAllocatedOptimally || opt.actionPercentage !== 62.5 || opt.totalDurationSeconds !== 120) throw new Error('Optimal STAR allocation failed');\nconst storyHeavy = auditStarTimeAllocation(60, 40, 20, 10); // Total = 130s, Action = 20s (15.4%)\nif (storyHeavy.isTimeAllocatedOptimally) throw new Error('Context-heavy STAR response passed in error');\nconst tooLong = auditStarTimeAllocation(40, 40, 150, 40); // 270s -> Over 3 mins\nif (tooLong.isTimeAllocatedOptimally) throw new Error('Overly long STAR response should fail');",
    "aTitle": "STAR Story Action Keyword Density Evaluator",
    "aDesc": "Implement function `evaluateStarActionFocus(actionText)` counting first-person active verbs ('I designed', 'I wrote', 'I benchmarked') vs team passive phrasing ('we decided').",
    "aStarter": "function evaluateStarActionFocus(text) {\n  // TODO: Count occurrences of 'I ' vs 'We ', returning ownership ratio and isIndividualContributorFocused flag\n  \n}",
    "aHint": "iCount = (text.match(/\\bI\\s+[a-zA-Z]+/g) || []).length; weCount = (text.match(/\\bWe\\s+[a-zA-Z]+/g) || []).length; return { individualActionsCount: iCount, teamActionsCount: weCount, isOwnershipFocused: iCount >= weCount && iCount > 0 };",
    "aTest": "const act = 'I designed the caching schema, I benchmarked redis latency, and I deployed the canary release';\nconst res = evaluateStarActionFocus(act);\nif (!res.isOwnershipFocused || res.individualActionsCount !== 3) throw new Error('STAR action focus evaluator failed');"
  },
  {
    "day": 19,
    "title": "Answering \"Tell Me About Yourself\": The 90-Second Present-Past-Future Pitch",
    "desc": "Craft the definitive opening impression in interviews: The Present-Past-Future Narrative Arc (Present: Current role, seniority, and primary tech superpowers; Past: Pivotal formative project or engineering crucible; Future: Why this specific company/role aligns with your trajectory).",
    "syllabus": [
      "The fatal flaw of reciting your resume chronologically.",
      "The 90-second sweet spot for the opening pitch.",
      "Hooking the interviewer with 1 remarkable engineering accomplishment."
    ],
    "eTitle": "Present-Past-Future Pitch Structure Validator",
    "eDesc": "Implement function `validateElevatorPitch(presentSummary, pastCrucibleProject, futureAlignmentReason, durationSeconds)` validating opening interview pitches.",
    "eStarter": "function validateElevatorPitch(present, past, future, seconds) {\n  // TODO: Verify present, past, and future strings are non-empty and duration is between 60s and 100s\n  \n}",
    "eHint": "Verify presentSummary.length >= 15 && pastCrucibleProject.length >= 15 && futureAlignmentReason.length >= 15 && durationSeconds >= 60 && durationSeconds <= 100; return { isPitchOptimal: boolean, narrativeArc: 'PRESENT_PAST_FUTURE', durationSeconds }.",
    "eTest": "const p = validateElevatorPitch('I am a senior backend engineer specializing in distributed data pipelines and high-throughput APIs.', 'Previously at FinTech Corp, I led the real-time settlement engine refactor cutting processing time by 60%.', 'I am excited by PinIT\\'s scale challenges and eager to architect your core data streaming infrastructure.', 85);\nif (!p.isPitchOptimal || p.durationSeconds !== 85 || p.narrativeArc !== 'PRESENT_PAST_FUTURE') throw new Error('Elevator pitch validation failed');\nconst tooShort = validateElevatorPitch('I write code', 'Did projects', 'Want job', 25);\nif (tooShort.isPitchOptimal) throw new Error('Incomplete pitch passed in error');\nconst tooLong = validateElevatorPitch('Present...', 'Past...', 'Future...', 150);\nif (tooLong.isPitchOptimal) throw new Error('150s rambling pitch passed in error');",
    "aTitle": "Pitch Section Time Allocation Calculator",
    "aDesc": "Implement function `calculatePitchTimePacing(presentSec, pastSec, futureSec)` ensuring balanced 30s-30s-30s pacing across the 90-second pitch.",
    "aStarter": "function calculatePitchTimePacing(present, past, future) {\n  // TODO: Check if total duration <= 90s and each section is between 20s and 40s\n  \n}",
    "aHint": "total = presentSec + pastSec + futureSec; isBalanced = total <= 90 && presentSec >= 20 && pastSec >= 20 && futureSec >= 20; return { totalPitchSeconds: total, isPacingBalanced: isBalanced };",
    "aTest": "const b = calculatePitchTimePacing(30, 30, 30); // 90s -> Balanced\nif (!b.isPacingBalanced || b.totalPitchSeconds !== 90) throw new Error('Balanced pitch pacing failed');\nconst unbal = calculatePitchTimePacing(60, 20, 10); // 90s but skewed\nif (unbal.isPacingBalanced) throw new Error('Skewed pitch pacing passed in error');"
  },
  {
    "day": 20,
    "title": "Tackling \"Tell Me About a Time You Failed\": Blameless Postmortem Storytelling",
    "desc": "Master the most dangerous interview question with radical accountability: Blameless Postmortem Storytelling (1. Own the mistake directly without blaming external factors; 2. Detail immediate containment actions; 3. Explain systemic prevention guardrails implemented to ensure it never recurs).",
    "syllabus": [
      "The 'Blameless Postmortem' mindset borrowed from Site Reliability Engineering (SRE).",
      "Why fake failures (\"I worked too hard\") get candidates rejected immediately.",
      "The 5 Whys Root Cause Analysis technique in behavioral interviews."
    ],
    "eTitle": "Blameless Failure Story & Prevention Guardrail Auditor",
    "eDesc": "Implement function `auditFailureStory(incidentMistake, containmentAction, systemicGuardrailImplemented, fiveWhysRootCause)` verifying blameless failure narratives.",
    "eStarter": "function auditFailureStory(mistake, containment, guardrail, fiveWhys) {\n  // TODO: Verify mistake is owned, containment is documented, guardrail is systemic, and fiveWhys has depth\n  \n}",
    "eHint": "Verify mistake.length >= 10 && containment.length >= 10 && guardrail.length >= 15 && fiveWhys.length >= 10; return { isStoryHighSignal: true, systemicImprovementVerified: true, narrativeCategory: 'BLAMELESS_SRE_POSTMORTEM' }.",
    "eTest": "const f = auditFailureStory('Deployed unmigrated database schema during peak hours causing 500 errors', 'Immediately executed automated rollback script within 90 seconds', 'Implemented CI pre-deploy migration linting and automated staging canary tests', 'Root cause was lack of mandatory pre-flight migration check in GitHub Actions');\nif (!f.isStoryHighSignal || !f.systemicImprovementVerified || f.narrativeCategory !== 'BLAMELESS_SRE_POSTMORTEM') throw new Error('Failure story audit failed');\nconst bad = auditFailureStory('My teammate gave me bad code', 'Told manager', 'None', '');\nif (bad.isStoryHighSignal) throw new Error('Blame-shifting failure story passed in error');\nif (typeof f.isStoryHighSignal !== 'boolean') throw new Error('Return type check failed');",
    "aTitle": "5 Whys Root Cause Chain Depth Validator",
    "aDesc": "Implement function `validateFiveWhysChain(whysArray)` verifying that root-cause analysis contains at least 5 cascading cause-and-effect steps.",
    "aStarter": "function validateFiveWhysChain(whys) {\n  // TODO: Verify whysArray has at least 5 non-empty string elements and return validation report\n  \n}",
    "aHint": "Check Array.isArray(whysArray) && whysArray.length >= 5 && whysArray.every(w => w.length > 5); return { isValidFiveWhys: boolean, depthCount: whysArray.length };",
    "aTest": "const chain = ['Service crashed', 'Out of memory', 'Memory leak in cache', 'Map had no TTL eviction', 'No lint rule enforcing TTLs'];\nconst v = validateFiveWhysChain(chain);\nif (!v.isValidFiveWhys || v.depthCount !== 5) throw new Error('5 Whys chain validation failed');\nif (validateFiveWhysChain(['Server crashed', 'No RAM']).isValidFiveWhys) throw new Error('Shallow 2-why chain passed in error');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine",
    "desc": "Milestone 3: Construct a comprehensive career & interview performance engine: Google X-Y-Z resume parsing, STAR time allocation auditing, Present-Past-Future pitch validation, and 5-Whys failure postmortems.",
    "syllabus": [
      "Master behavioral interview synthesis.",
      "Quantified resume bullet verification pipeline.",
      "Executive interview readiness benchmark certification."
    ],
    "eTitle": "Tech Career & Interview Master Engine",
    "eDesc": "Implement function `executeCareerInterviewGateway(xyzResult, starResult, pitchResult, failureResult)` evaluating overall interview readiness.",
    "eStarter": "function executeCareerInterviewGateway(xyz, star, pitch, failure) {\n  // TODO: Verify all 4 career artifacts pass compliance checks and return career readiness certification\n  \n}",
    "eHint": "Check xyz.isXyzCompliant && star.isTimeAllocatedOptimally && pitch.isPitchOptimal && failure.isStoryHighSignal; return { isCandidateReady: boolean, compositeCareerScore: 100, masterStatus: isCandidateReady ? 'CAREER_INTERVIEW_MASTER_ACTIVE' : 'REMEDIATION_REQUIRED' }.",
    "eTest": "const r = executeCareerInterviewGateway({ isXyzCompliant: true }, { isTimeAllocatedOptimally: true }, { isPitchOptimal: true }, { isStoryHighSignal: true });\nif (!r.isCandidateReady || r.masterStatus !== 'CAREER_INTERVIEW_MASTER_ACTIVE' || r.compositeCareerScore !== 100) throw new Error('Milestone 3 career master failed');\nconst fail = executeCareerInterviewGateway({ isXyzCompliant: false }, { isTimeAllocatedOptimally: true }, { isPitchOptimal: true }, { isStoryHighSignal: true });\nif (fail.isCandidateReady || fail.masterStatus !== 'REMEDIATION_REQUIRED') throw new Error('Failed career gateway passed in error');\nif (typeof r.isCandidateReady !== 'boolean') throw new Error('Type check failed');",
    "aTitle": "Interview Readiness Score Aggregator",
    "aDesc": "Implement function `aggregateInterviewReadiness(resumeScore, starScore, pitchScore, failureScore)` computing composite percentage readiness index.",
    "aStarter": "function aggregateInterviewReadiness(res, star, pitch, fail) {\n  // TODO: Compute arithmetic average of the 4 scores, returning composite score and readiness tier\n  \n}",
    "aHint": "avg = (resumeScore + starScore + pitchScore + failureScore) / 4; return { compositeScore: Number(avg.toFixed(1)), isReadyForTier1Interviews: avg >= 85.0 };",
    "aTest": "const agg = aggregateInterviewReadiness(95, 90, 85, 90); // 360 / 4 = 90.0\nif (agg.compositeScore !== 90.0 || !agg.isReadyForTier1Interviews) throw new Error('Interview readiness aggregation failed');"
  },
  {
    "day": 22,
    "title": "High-Signal Reverse Interviewing: Questions to Ask the Interviewer",
    "desc": "Reverse interview the engineering team to evaluate company culture and engineering health: The 3 High-Signal Categories (1. Engineering Rigor: CI/CD, Testing culture, On-call rotations; 2. Team Autonomy & Velocity: Roadmaps, RFCs, tech debt allocation; 3. Leadership & Growth: Mentorship, Promotion rubrics).",
    "syllabus": [
      "The Joel Test for software teams (12 questions to evaluate engineering health).",
      "Red-flag questions that signal low engineering maturity.",
      "How reverse interview questions signal senior-level engineering maturity to hiring managers."
    ],
    "eTitle": "Reverse Interview Question Signal & Category Classifier",
    "eDesc": "Implement function `classifyReverseInterviewQuestion(questionText)` determining question category (ENGINEERING_RIGOR, TEAM_AUTONOMY, LEADERSHIP_GROWTH) and signal strength.",
    "eStarter": "function classifyReverseInterviewQuestion(q) {\n  // TODO: Classify question category based on keywords (deploy, on-call, test -> ENGINEERING_RIGOR; rfc, debt, autonomy -> TEAM_AUTONOMY)\n  \n}",
    "eHint": "Lower text: if includes 'deploy'|'test'|'on-call'|'incident' -> 'ENGINEERING_RIGOR'; if includes 'debt'|'roadmap'|'rfc'|'autonomy' -> 'TEAM_AUTONOMY'; if includes 'mentor'|'growth'|'career'|'feedback' -> 'LEADERSHIP_GROWTH'; return { category, isHighSignal: q.length >= 25 }.",
    "eTest": "const q1 = classifyReverseInterviewQuestion('How does the team handle on-call rotations and post-incident blameless reviews?');\nif (q1.category !== 'ENGINEERING_RIGOR' || !q1.isHighSignal) throw new Error('Engineering rigor question classification failed');\nconst q2 = classifyReverseInterviewQuestion('What percentage of sprint capacity is dedicated strictly to addressing technical debt and architectural refactors?');\nif (q2.category !== 'TEAM_AUTONOMY') throw new Error('Team autonomy question failed');\nconst shortQ = classifyReverseInterviewQuestion('Do you work hard?');\nif (shortQ.isHighSignal) throw new Error('Low signal question flagged high in error');",
    "aTitle": "The Joel Test Engineering Score Evaluator",
    "aDesc": "Implement function `evaluateJoelTestScore(yesAnswersCount)` calculating software engineering maturity score out of 12 (12 = Top Tier, < 8 = High Risk).",
    "aStarter": "function evaluateJoelTestScore(yesCount) {\n  // TODO: Evaluate yesAnswersCount out of 12 and assign engineering maturity grade\n  \n}",
    "aHint": "tier = yesAnswersCount >= 10 ? 'TOP_TIER_ENGINEERING_ORGANIZATION' : (yesAnswersCount >= 8 ? 'ACCEPTABLE_MATURITY' : 'HIGH_ENGINEERING_RISK'); return { scoreOutOf12: yesAnswersCount, maturityGrade: tier, passRate: Number(((yesAnswersCount / 12) * 100).toFixed(1)) };",
    "aTest": "const j = evaluateJoelTestScore(11); // 11/12 = 91.7%\nif (j.maturityGrade !== 'TOP_TIER_ENGINEERING_ORGANIZATION' || j.passRate !== 91.7) throw new Error('Joel test evaluation failed');\nconst badJ = evaluateJoelTestScore(5);\nif (badJ.maturityGrade !== 'HIGH_ENGINEERING_RISK') throw new Error('Low Joel test score failed');"
  },
  {
    "day": 23,
    "title": "Live Coding & Whiteboard Communication Protocols: \"Think Aloud\" Protocol",
    "desc": "Excel in live coding and algorithm interviews: The \"Think Aloud\" Protocol (Constantly narrating thoughts, validating assumptions with the interviewer, stating time/space complexity before writing code, writing pseudo-code, testing with edge cases before claiming \"done\").",
    "syllabus": [
      "The 5-Step Live Coding Communication Protocol: 1. Clarify constraints; 2. Propose naive brute force; 3. Optimize to target complexity; 4. Implement cleanly; 5. Dry-run edge cases.",
      "Handling hints gracefully without panicking.",
      "Collaborating as a pair programming partner rather than taking an exam."
    ],
    "eTitle": "Live Coding Whiteboard Protocol Step Evaluator",
    "eDesc": "Implement function `auditLiveCodingSteps(hasClarifiedConstraints, hasStatedComplexity, hasWrittenCleanCode, hasDryRunEdgeCases)` auditing live coding interview protocol completeness.",
    "eStarter": "function auditLiveCodingSteps(clarified, complexity, cleanCode, edgeCases) {\n  // TODO: Verify that all 4 live coding steps are executed in proper sequence and return score\n  \n}",
    "eHint": "Verify all 4 boolean flags: isPerfect = hasClarifiedConstraints && hasStatedComplexity && hasWrittenCleanCode && hasDryRunEdgeCases; return { isProtocolFullyCompliant: isPerfect, completedStepsCount: [hasClarifiedConstraints, hasStatedComplexity, hasWrittenCleanCode, hasDryRunEdgeCases].filter(Boolean).length, interviewImpression: isPerfect ? 'STRONG_HIRE' : 'NEEDS_COMMUNICATION_IMPROVEMENT' }.",
    "eTest": "const perfect = auditLiveCodingSteps(true, true, true, true);\nif (!perfect.isProtocolFullyCompliant || perfect.completedStepsCount !== 4 || perfect.interviewImpression !== 'STRONG_HIRE') throw new Error('Perfect live coding protocol rejected');\nconst noEdgeCases = auditLiveCodingSteps(true, true, true, false);\nif (noEdgeCases.isProtocolFullyCompliant || noEdgeCases.interviewImpression !== 'NEEDS_COMMUNICATION_IMPROVEMENT') throw new Error('Missing edge cases passed in error');\nconst emptySteps = auditLiveCodingSteps(false, false, false, false);\nif (emptySteps.completedStepsCount !== 0) throw new Error('Empty steps count failed');",
    "aTitle": "Algorithmic Complexity Communication Formatter",
    "aDesc": "Implement function `formatComplexityNotation(timeBigO, spaceBigO)` formatting standardized Big-O complexity strings (e.g. `O(N log N) time | O(1) auxiliary space`).",
    "aStarter": "function formatComplexityNotation(time, space) {\n  // TODO: Format and return string formatted as 'O(${time}) time | O(${space}) auxiliary space'\n  \n}",
    "aHint": "Return `O(${timeBigO}) time | O(${spaceBigO}) auxiliary space`; verify formatted string output.",
    "aTest": "const f = formatComplexityNotation('N log N', '1');\nif (f !== 'O(N log N) time | O(1) auxiliary space') throw new Error('Complexity notation formatting failed');\nif (formatComplexityNotation('N', 'N') !== 'O(N) time | O(N) auxiliary space') throw new Error('Linear complexity formatting failed');"
  },
  {
    "day": 24,
    "title": "System Design Interview Communication: The RADIO Framework",
    "desc": "Lead 45-minute System Design interviews with executive structure: The RADIO Framework (Requirements: Functional/Non-functional & Scale estimates; Architecture: High-level block diagram; Data Model: Schema & storage choice; Interface: API endpoints; Operational Deep Dive: Scaling, Caching, Sharding, Bottlenecks).",
    "syllabus": [
      "The 45-minute time management allocation for System Design interviews.",
      "Back-of-the-envelope capacity estimations (QPS, Bandwidth, Storage over 5 years).",
      "Proactively identifying Single Points of Failure (SPOFs) and driving architectural trade-offs."
    ],
    "eTitle": "System Design RADIO Framework Completeness Auditor",
    "eDesc": "Implement function `auditRadioSystemDesign(requirements, architectureDiagram, dataModel, apiInterface, operationalDeepDive)` auditing system design structure.",
    "eStarter": "function auditRadioSystemDesign(req, arch, data, api, ops) {\n  // TODO: Verify all 5 RADIO sections are defined with adequate depth and return audit report\n  \n}",
    "eHint": "Verify req.length >= 2 && arch.length >= 2 && data.length >= 2 && api.length >= 2 && ops.length >= 2; return { isRadioCompliant: true, totalSectionsCompleted: 5, evaluationGrade: 'SYSTEM_DESIGN_EXCELLENT' }.",
    "eTest": "const r = auditRadioSystemDesign(['10k QPS reads', '500 QPS writes'], ['Load Balancer -> API Gateway -> Stateless App Servers', 'Read Replicas'], ['Users Table (UUID, Email)', 'Posts Table (ID, Content)'], ['POST /v1/posts', 'GET /v1/posts/{id}'], ['Redis cache-aside for top 10% posts', 'Multi-AZ DB failover']);\nif (!r.isRadioCompliant || r.totalSectionsCompleted !== 5 || r.evaluationGrade !== 'SYSTEM_DESIGN_EXCELLENT') throw new Error('RADIO system design audit failed');\nconst bad = auditRadioSystemDesign([], [], [], [], []);\nif (bad.isRadioCompliant) throw new Error('Empty RADIO design passed in error');\nif (typeof r.isRadioCompliant !== 'boolean') throw new Error('Type check failed');",
    "aTitle": "Back-of-Envelope QPS & Storage Estimator",
    "aDesc": "Implement function `calculateCapacityEstimates(dailyActiveUsers, writesPerUserPerDay, averagePayloadBytes)` computing write QPS and daily storage in GB.",
    "aStarter": "function calculateCapacityEstimates(dau, writesPerDay, bytesPerWrite) {\n  // TODO: Compute totalWritesPerDay = dau * writesPerDay; writeQps = totalWritesPerDay / 86400; dailyGb = (totalWritesPerDay * bytesPerWrite) / (1024^3)\n  \n}",
    "aHint": "totalWrites = dailyActiveUsers * writesPerUserPerDay; writeQps = totalWrites / 86400; dailyGb = (totalWrites * averagePayloadBytes) / (1024 * 1024 * 1024); return { writeQps: Math.round(writeQps), dailyStorageGb: Number(dailyGb.toFixed(2)) };",
    "aTest": "const cap = calculateCapacityEstimates(10000000, 2, 500); // 20M writes / 86400 = 231 QPS; 10GB / 1.07 = 9.31 GB\nif (cap.writeQps !== 231 || cap.dailyStorageGb < 9.0) throw new Error('Capacity estimation failed');"
  },
  {
    "day": 25,
    "title": "Salary Negotiation & Compensation Mastery: Total Compensation (TC) Mechanics",
    "desc": "Negotiate software engineer offers with confidence and data: Total Compensation (TC = Base Salary + Annual Bonus + Equity/RSUs per year + Sign-on Bonus), Evaluating 4-Year Vesting Schedules with 1-Year Cliffs, Establishing Leverage without burning bridges.",
    "syllabus": [
      "TC Breakdown: Base vs Equity (RSUs vs ISO Stock Options) vs Performance Bonuses.",
      "The 'Rule of 3 Offers' and creating competitive negotiation leverage.",
      "Writing a professional counter-offer email that increases offer value by 15-30%."
    ],
    "eTitle": "Total Compensation (TC) Annual Package Calculator",
    "eDesc": "Implement function `calculateAnnualTotalCompensation(baseSalary, annualBonusPercent, totalFourYearEquityGrant, signOnBonusFirstYear)` computing Year 1 and Ongoing Annual Total Compensation.",
    "eStarter": "function calculateAnnualTotalCompensation(base, bonusPct, equity4Yr, signOn) {\n  // TODO: Compute annualBonus = base * (bonusPct/100); annualEquity = equity4Yr / 4; year1Tc = base + bonus + equity + signOn; ongoingTc = base + bonus + equity\n  \n}",
    "eHint": "bonus = baseSalary * (annualBonusPercent / 100); annualEquity = totalFourYearEquityGrant / 4; year1 = baseSalary + bonus + annualEquity + signOnBonusFirstYear; ongoing = baseSalary + bonus + annualEquity; return { yearOneTotalCompensation: Number(year1.toFixed(2)), ongoingAnnualTotalCompensation: Number(ongoing.toFixed(2)), equityPortionPercent: Number(((annualEquity / ongoing) * 100).toFixed(1)) }.",
    "eTest": "const tc = calculateAnnualTotalCompensation(160000, 15, 200000, 25000); // Base = 160k, Bonus = 24k, Eq = 50k -> Year 1 = 160+24+50+25 = 259k; Ongoing = 234k\nif (tc.yearOneTotalCompensation !== 259000.00 || tc.ongoingAnnualTotalCompensation !== 234000.00 || tc.equityPortionPercent !== 21.4) throw new Error('TC calculation failed');\nconst zeroBonus = calculateAnnualTotalCompensation(100000, 0, 0, 0);\nif (zeroBonus.yearOneTotalCompensation !== 100000.00) throw new Error('Zero bonus TC failed');\nif (typeof tc.yearOneTotalCompensation !== 'number') throw new Error('Type check failed');",
    "aTitle": "Counter-Offer Percentage Lift Calculator",
    "aDesc": "Implement function `calculateNegotiationLift(initialOfferTc, finalOfferTc)` calculating percentage and dollar lift achieved through offer negotiation.",
    "aStarter": "function calculateNegotiationLift(initialTc, finalTc) {\n  // TODO: Compute dollarLift = finalTc - initialTc, percentageLift = (dollarLift / initialTc) * 100\n  \n}",
    "aHint": "dollarLift = finalOfferTc - initialOfferTc; pctLift = (dollarLift / initialOfferTc) * 100; return { dollarIncrease: dollarLift, percentageIncrease: Number(pctLift.toFixed(2)), isSuccessfulNegotiation: dollarLift > 0 };",
    "aTest": "const lift = calculateNegotiationLift(180000, 215000); // +35k / +19.44%\nif (lift.dollarIncrease !== 35000 || lift.percentageIncrease !== 19.44 || !lift.isSuccessfulNegotiation) throw new Error('Negotiation lift calculation failed');"
  },
  {
    "day": 26,
    "title": "First 90 Days Engineering Onboarding Strategy: The 30-60-90 Day Plan",
    "desc": "Accelerate time-to-impact in a new software engineering role: The 30-60-90 Day Framework (Day 1-30: Learn architecture, run local environment, ship first small bug fix to prod; Day 31-60: Own a medium feature, collaborate across teams, identify tech debt; Day 61-90: Propose architectural RFC, mentor junior team members, drive sprint commitments).",
    "syllabus": [
      "The 'First Commit on Day 1' ideal onboarding experience.",
      "Mapping the engineering organizational chart and key domain experts.",
      "Conducting 1-on-1 listening tours across Product, Design, and QA."
    ],
    "eTitle": "30-60-90 Day Onboarding Milestone Tracker",
    "eDesc": "Implement function `trackOnboardingProgress(day30MilestoneShipped, day60FeatureShipped, day90RfcAuthored)` tracking onboarding execution.",
    "eStarter": "function trackOnboardingProgress(day30, day60, day90) {\n  // TODO: Verify each phase has completed key milestone, calculating onboarding velocity grade\n  \n}",
    "eHint": "completedCount = [day30MilestoneShipped, day60FeatureShipped, day90RfcAuthored].filter(Boolean).length; return { completedPhasesCount: completedCount, onboardingScorePercent: Math.round((completedCount / 3) * 100), isOnTrack: completedCount >= 2, status: completedCount === 3 ? 'FULLY_RAMPED_SENIOR_ENGINEER' : 'ONBOARDING_IN_PROGRESS' }.",
    "eTest": "const ramped = trackOnboardingProgress(true, true, true);\nif (!ramped.isOnTrack || ramped.onboardingScorePercent !== 100 || ramped.status !== 'FULLY_RAMPED_SENIOR_ENGINEER') throw new Error('Fully ramped onboarding failed');\nconst mid = trackOnboardingProgress(true, true, false);\nif (!mid.isOnTrack || mid.onboardingScorePercent !== 67 || mid.status !== 'ONBOARDING_IN_PROGRESS') throw new Error('Mid onboarding check failed');\nconst struggling = trackOnboardingProgress(false, false, false);\nif (struggling.isOnTrack || struggling.onboardingScorePercent !== 0) throw new Error('Struggling onboarding flagged on track in error');",
    "aTitle": "Onboarding PR Time-to-Merge Metric Calculator",
    "aDesc": "Implement function `calculateFirstPrDays(startDateTimestamp, firstMergedPrTimestamp)` computing calendar days to first production code shipment.",
    "aStarter": "function calculateFirstPrDays(startMs, firstPrMs) {\n  // TODO: Compute (firstPrMs - startMs) / (1000 * 60 * 60 * 24), returning rounded integer days\n  \n}",
    "aHint": "days = (firstMergedPrTimestamp - startDateTimestamp) / (1000 * 60 * 60 * 24); return { daysToFirstPr: Math.round(days), isFastRamp: days <= 14 };",
    "aTest": "const start = Date.now();\nconst prMerged = start + (7 * 24 * 60 * 60 * 1000); // 7 days later\nconst res = calculateFirstPrDays(start, prMerged);\nif (res.daysToFirstPr !== 7 || !res.isFastRamp) throw new Error('First PR days calculation failed');"
  },
  {
    "day": 27,
    "title": "Mentorship, Peer Coaching & Knowledge Sharing: Writing Team RFCs",
    "desc": "Scale your engineering impact across the entire organization: Authoring Request for Comments (RFCs / Design Docs), Mentoring junior engineers using the Socratic Method (Guiding with questions instead of giving answers), and Running effective Tech Talks.",
    "syllabus": [
      "The Anatomy of an RFC: Context, Proposed Architecture, Drawbacks, Alternatives Considered.",
      "The Socratic Mentorship Technique: Developing problem-solving independence in junior engineers.",
      "Creating durable engineering wikis and runbooks that outlive personnel changes."
    ],
    "eTitle": "RFC (Request for Comments) Proposal Structure Auditor",
    "eDesc": "Implement function `auditRfcStructure(rfcTitle, problemContext, proposedArchitecture, alternativesConsidered, securityTradeoffs)` verifying RFC completeness.",
    "eStarter": "function auditRfcStructure(title, context, arch, alts, security) {\n  // TODO: Validate that title, context, arch, alternatives array, and security tradeoffs are provided and compliant\n  \n}",
    "eHint": "Verify title.length >= 10 && problemContext.length >= 20 && proposedArchitecture.length >= 20 && Array.isArray(alternativesConsidered) && alternativesConsidered.length >= 2 && securityTradeoffs.length >= 15; return { isRfcApprovedForReview: boolean, rfcId: `RFC-${title.toUpperCase().slice(0, 8)}`, alternativesCount: alternativesConsidered.length }.",
    "eTest": "const rfc = auditRfcStructure('Migrating Session Store to Redis Cluster', 'Single Node Redis instance is reaching 90% memory limit causing connection drops during sales.', 'Deploy AWS ElastiCache Redis Cluster with 3 shards and 1 read replica per shard.', ['Scale vertical instance to r6g.4xlarge', 'Migrate sessions to DynamoDB DAX'], 'Ensure in-transit and at-rest KMS encryption is enforced with TLS 1.3.');\nif (!rfc.isRfcApprovedForReview || rfc.alternativesCount !== 2 || !rfc.rfcId.startsWith('RFC-')) throw new Error('RFC structure audit failed');\nconst badRfc = auditRfcStructure('Short', 'Short', 'Short', [], '');\nif (badRfc.isRfcApprovedForReview) throw new Error('Incomplete RFC approved in error');\nif (typeof rfc.alternativesCount !== 'number') throw new Error('Alternatives count type error');",
    "aTitle": "Mentorship Socratic Inquiry Prompt Generator",
    "aDesc": "Implement function `formatSocraticPrompt(codeSymptom, hintQuestion)` constructing guided discovery mentorship questions.",
    "aStarter": "function formatSocraticPrompt(symptom, question) {\n  // TODO: Combine symptom and hintQuestion into structured Socratic inquiry format\n  \n}",
    "aHint": "Return `I noticed ${codeSymptom}. ${hintQuestion} What do you think would happen if this receives 10k requests concurrently?`;",
    "aTest": "const p = formatSocraticPrompt('an unclosed database connection in the try block', 'How does the finally clause help with resource cleanup?');\nif (!p.includes('unclosed database connection') || !p.includes('finally clause')) throw new Error('Socratic prompt format failed');"
  },
  {
    "day": 28,
    "title": "Global Remote & Multi-Cultural Team Dynamics: Low-Context vs High-Context",
    "desc": "Excel in global distributed engineering teams: Erin Meyer's Culture Map (Low-Context vs High-Context communication, Direct vs Indirect negative feedback), Overcoming timezone friction with asynchronous transparency, and Cultural empathy in asynchronous code reviews.",
    "syllabus": [
      "Low-Context (Explicit, clear, detailed) vs High-Context (Nuanced, layered, relational) communication.",
      "Direct vs Indirect Feedback across North America, Europe, Asia, and Latin America.",
      "Asynchronous timezone handoffs (Creating daily recap digests for teams waking up in opposite timezones)."
    ],
    "eTitle": "Communication Context Style Matcher: High-Context vs Low-Context",
    "eDesc": "Implement function `evaluateCulturalContextClarity(messageText, targetCultureType)` checking if low-context technical messages contain explicit specifications, deadliness, and action owners.",
    "eStarter": "function evaluateCulturalContextClarity(msg, targetType) {\n  // TODO: If targetType is LOW_CONTEXT, verify message contains explicit deadline, owner, and action item\n  \n}",
    "eHint": "If targetCultureType === 'LOW_CONTEXT', check if messageText contains '@' (owner), explicit dates/times (deadline), and clear bullet points; return { isClaritySufficient: boolean, recommendedStyle: 'EXPLICIT_WRITTEN_LOW_CONTEXT' }.",
    "eTest": "const lowContextMsg = 'Task: Migrate auth DB. Owner: @david. Deadline: Friday, Oct 25 at 5 PM EST. Action items:\\n1. Run schema migration\\n2. Verify healthcheck';\nconst r1 = evaluateCulturalContextClarity(lowContextMsg, 'LOW_CONTEXT');\nif (!r1.isClaritySufficient || r1.recommendedStyle !== 'EXPLICIT_WRITTEN_LOW_CONTEXT') throw new Error('Low context message evaluation failed');\nconst vagueMsg = 'Hey, could you maybe look at the auth DB whenever you have time?';\nconst r2 = evaluateCulturalContextClarity(vagueMsg, 'LOW_CONTEXT');\nif (r2.isClaritySufficient) throw new Error('Vague message passed low context check in error');\nconst emptyMsg = evaluateCulturalContextClarity('', 'LOW_CONTEXT');\nif (emptyMsg.isClaritySufficient) throw new Error('Empty message check failed');",
    "aTitle": "Global Timezone Overlap Window Calculator",
    "aDesc": "Implement function `calculateTimezoneOverlap(tz1UtcOffsetHours, tz2UtcOffsetHours, workStartHour = 9, workEndHour = 17)` calculating synchronous working hours overlap.",
    "aStarter": "function calculateTimezoneOverlap(offset1, offset2, start = 9, end = 17) {\n  // TODO: Compute UTC working hours range for both offsets, find overlap count, return overlapHours\n  \n}",
    "aHint": "Compute s1 = 9 - offset1, e1 = 17 - offset1; s2 = 9 - offset2, e2 = 17 - offset2; overlap = Math.max(0, Math.min(e1, e2) - Math.max(s1, s2)); return { overlapHours: overlap, isSufficientSyncOverlap: overlap >= 2 };",
    "aTest": "const o = calculateTimezoneOverlap(-5, -8); // EST (-5) vs PST (-8) -> 5 hours overlap\nif (o.overlapHours !== 5 || !o.isSufficientSyncOverlap) throw new Error('Timezone overlap calculation failed');"
  },
  {
    "day": 29,
    "title": "Tech Lead & Engineering Leadership Communication: Servant Leadership Principles",
    "desc": "Transition from Individual Contributor to Tech Lead / Engineering Manager: Servant Leadership (Removing blockers, unblocking team members, shielding engineers from organizational noise), Delegating with explicit outcomes, and Running 1-on-1s that foster psychological safety.",
    "syllabus": [
      "The Tech Lead Triangle: Architecture, Execution, and People.",
      "Delegation Framework: Task description + Success Criteria + Check-in Milestones + Autonomy Boundary.",
      "High-Output 1-on-1s: Focusing 80% on engineer career growth, feelings, and roadblocks rather than project status updates."
    ],
    "eTitle": "Tech Lead Delegation & Outcome Clarity Auditor",
    "eDesc": "Implement function `auditDelegationBrief(taskObjective, successCriteriaMetrics, autonomyBoundary, checkInMilestones)` verifying complete engineering delegation briefs.",
    "eStarter": "function auditDelegationBrief(obj, criteria, autonomy, checkins) {\n  // TODO: Verify objective, criteria metrics, autonomy boundaries, and checkins array are defined\n  \n}",
    "eHint": "Verify taskObjective.length >= 15 && successCriteriaMetrics.length >= 10 && autonomyBoundary.length >= 10 && Array.isArray(checkInMilestones) && checkInMilestones.length >= 2; return { isDelegationComplete: boolean, autonomyScore: 100, briefStatus: 'DELEGATION_READY' }.",
    "eTest": "const b = auditDelegationBrief('Implement distributed rate limiting on API gateway', 'p99 latency under 2ms, zero dropped requests under 5,000 RPS surge', 'Free to choose between Token Bucket and Leaky Bucket algorithm without prior manager sign-off', ['POC review on Wednesday 2 PM', 'Final load test demo on Friday 3 PM']);\nif (!b.isDelegationComplete || b.autonomyScore !== 100 || b.briefStatus !== 'DELEGATION_READY') throw new Error('Tech lead delegation audit failed');\nconst bad = auditDelegationBrief('Fix code', '', '', []);\nif (bad.isDelegationComplete) throw new Error('Incomplete delegation brief passed in error');\nif (typeof b.isDelegationComplete !== 'boolean') throw new Error('Type check failed');",
    "aTitle": "One-on-One Meeting Agenda Topic Balance Auditor",
    "aDesc": "Implement function `auditOneOnOneAgenda(careerMinutes, roadblocksMinutes, projectStatusMinutes, totalMinutes = 45)` ensuring project status does not exceed 20% of meeting.",
    "aStarter": "function auditOneOnOneAgenda(career, roadblocks, status, total = 45) {\n  // TODO: Verify projectStatusMinutes <= total * 0.20 and (career + roadblocks) >= total * 0.70\n  \n}",
    "aHint": "statusPct = (projectStatusMinutes / totalMinutes) * 100; isHealthy = statusPct <= 20.0; return { statusPercentage: Number(statusPct.toFixed(1)), isHighYieldOneOnOne: isHealthy };",
    "aTest": "const a = auditOneOnOneAgenda(25, 15, 5, 45); // 5/45 = 11.1% status -> High yield\nif (!a.isHighYieldOneOnOne || a.statusPercentage !== 11.1) throw new Error('One-on-one balance audit failed');\nconst statusHeavy = auditOneOnOneAgenda(5, 5, 35, 45); // 35/45 = 77.8% status -> Low yield\nif (statusHeavy.isHighYieldOneOnOne) throw new Error('Status heavy one-on-one passed in error');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Professional Tech Communication & Executive Career Suite",
    "desc": "Final Capstone Synthesis: Master the complete software engineering communication and career lifecycle: Written BLUF emails, 5-section README documentation, Active Listening, No-Hello async communication, ELI5 translation, SBI feedback, IBR conflict resolution, Minto Pyramid presentations, Google X-Y-Z resumes, STAR interviews, RADIO system design, and Total Compensation negotiation.",
    "syllabus": [
      "Master Tech Communication Lifecycle Synthesis.",
      "Executive Boardroom & Hiring Committee Calibration.",
      "Sovereign Professional Software Engineer Certification."
    ],
    "eTitle": "Sovereign Tech Communication & Career Suite Orchestrator",
    "eDesc": "Implement function `orchestrateSovereignTechSuite(writtenCommScore, leadershipCommScore, careerInterviewScore, negotiationScore)` evaluating master certification.",
    "eStarter": "function orchestrateSovereignTechSuite(written, leadership, career, neg) {\n  // TODO: Validate that all 4 communication pillars score >= 85, computing composite sovereign index\n  \n}",
    "eHint": "isCertified = writtenCommScore >= 85 && leadershipCommScore >= 85 && careerInterviewScore >= 85 && negotiationScore >= 85; composite = (writtenCommScore + leadershipCommScore + careerInterviewScore + negotiationScore) / 4; return { isSovereignCertified: isCertified, compositeScore: Number(composite.toFixed(1)), certificationTier: isCertified ? 'SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED' : 'REMEDIATION_REQUIRED' }.",
    "eTest": "const cert = orchestrateSovereignTechSuite(95, 90, 92, 88); // Composite = 91.3\nif (!cert.isSovereignCertified || cert.compositeScore !== 91.3 || cert.certificationTier !== 'SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED') throw new Error('Sovereign communication master failed');\nconst weak = orchestrateSovereignTechSuite(95, 60, 90, 85);\nif (weak.isSovereignCertified || weak.certificationTier !== 'REMEDIATION_REQUIRED') throw new Error('Weak pillar accepted in error');\nconst perfect = orchestrateSovereignTechSuite(100, 100, 100, 100);\nif (perfect.compositeScore !== 100.0) throw new Error('Perfect composite score failed');",
    "aTitle": "Sovereign Tech Communication Final Scorecard Auditor",
    "aDesc": "Implement function `auditFinalCommunicationScorecard(scorecardObject)` verifying that all 30 days of communication milestones are completed and verified.",
    "aStarter": "function auditFinalCommunicationScorecard(sc) {\n  // TODO: Verify milestonesCompleted === 3 and totalQuestsPassed === 60\n  \n}",
    "aHint": "isComplete = scorecardObject.milestonesCompleted >= 3 && scorecardObject.totalQuestsPassed >= 60; return { isMasteryAchieved: isComplete, finalStatus: isComplete ? 'CAREER_READY_DISTINCTION' : 'INCOMPLETE' };",
    "aTest": "const sc = { milestonesCompleted: 3, totalQuestsPassed: 60 };\nconst res = auditFinalCommunicationScorecard(sc);\nif (!res.isMasteryAchieved || res.finalStatus !== 'CAREER_READY_DISTINCTION') throw new Error('Final scorecard audit failed');\nconst incomp = { milestonesCompleted: 2, totalQuestsPassed: 40 };\nif (auditFinalCommunicationScorecard(incomp).isMasteryAchieved) throw new Error('Incomplete scorecard passed in error');"
  }
];

export const SOFT_SKILLS_30_DAYS_QUESTS: CourseQuest[] = SOFT_SKILLS_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('soft-skills', idx + 1, cfg)
);
