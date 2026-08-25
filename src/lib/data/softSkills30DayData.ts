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
    "eDesc": "Implement function formatBlufEmail(actionRequiredTag, coreBottomLineSentence, detailedContext, callToAction) constructing a standardized BLUF email structure.",
    "eStarter": "function formatBlufEmail(tag, bluf, context, cta) {\n  if (!tag || !bluf || !cta) throw new Error('Missing BLUF components');\n  const isTagValid = tag.startsWith('[') && tag.endsWith(']');\n  const isBlufConcise = bluf.trim().length >= 10 && bluf.trim().length <= 150;\n  const isApproved = isTagValid && isBlufConcise;\n  return {\n    subjectLinePrefix: tag,\n    bottomLineUpFront: bluf,\n    callToAction: cta,\n    isBlufCompliant: isApproved,\n    status: isApproved ? 'BLUF_EMAIL_FORMATTED_NOMINAL' : 'BLUF_STRUCTURE_DEFECT'\n  };\n}",
    "eHint": "Verify tag starts with [ and ends with ], and bluf length is between 10 and 150 chars.",
    "eTest": "const pass = formatBlufEmail('[Action Required: by 5 PM]', 'We need approval to merge the auth refactor into production today.', 'Context details...', 'Please reply with LGTM.');\nconst fail = formatBlufEmail('No brackets', 'Short', 'Context', 'CTA');\nif (!pass.isBlufCompliant || fail.isBlufCompliant || pass.status !== 'BLUF_EMAIL_FORMATTED_NOMINAL') throw new Error('BLUF email formatting failed');",
    "aTitle": "BLUF Acronym Expanded Formatter",
    "aDesc": "Implement function getBlufAcronymMeaning() returning `'Bottom Line Up Front'`.",
    "aStarter": "function getBlufAcronymMeaning() { return 'Bottom Line Up Front'; }",
    "aHint": "Return Bottom Line Up Front.",
    "aTest": "if (getBlufAcronymMeaning() !== 'Bottom Line Up Front') throw new Error('BLUF meaning check failed');"
  },
  {
    "day": 2,
    "title": "Technical Documentation & README Engineering: The Standard 5-Section Architecture",
    "desc": "Write production-grade developer documentation: The Standard 5-Section README (1. Project Overview & Value Proposition, 2. Quickstart & Installation, 3. Architecture & Data Flow, 4. API Reference / Configuration, 5. Contributing Guidelines), Writing Clear Runbooks for On-Call Engineers, and Calibrating Documentation for Diverse Audiences.",
    "syllabus": [
      "The 5 mandatory architectural pillars of an open-source or internal README.",
      "Writing clear step-by-step Quickstart commands with zero implicit assumptions.",
      "Audience calibration between junior onboarding engineers and principal architects."
    ],
    "eTitle": "Technical README 5-Section Completeness Auditor",
    "eDesc": "Implement function auditReadmeCompleteness(markdownSectionsArray) verifying that the documentation contains all 5 required structural sections (`Overview`, `Quickstart`, `Architecture`, `API`, `Contributing`).",
    "eStarter": "function auditReadmeCompleteness(sections) {\n  const required = ['Overview', 'Quickstart', 'Architecture', 'API', 'Contributing'];\n  const missing = required.filter(r => !sections.some(s => s.toLowerCase().includes(r.toLowerCase())));\n  const isComplete = missing.length === 0;\n  return {\n    totalSectionsProvided: sections.length,\n    missingSections: missing,\n    isDocumentationProductionReady: isComplete,\n    status: isComplete ? 'TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL' : 'README_INCOMPLETE_SECTIONS_MISSING'\n  };\n}",
    "eHint": "Verify all 5 required sections exist in the array.",
    "eTest": "const ready = auditReadmeCompleteness(['Project Overview', 'Quickstart Guide', 'System Architecture Diagram', 'API Reference', 'Contributing Guidelines']);\nconst incomplete = auditReadmeCompleteness(['Overview', 'Installation']);\nif (!ready.isDocumentationProductionReady || incomplete.isDocumentationProductionReady || ready.status !== 'TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL') throw new Error('README audit failed');",
    "aTitle": "Total Mandatory README Sections Formatter",
    "aDesc": "Implement function getMandatoryReadmeSectionsCount() returning `5`.",
    "aStarter": "function getMandatoryReadmeSectionsCount() { return 5; }",
    "aHint": "Return 5.",
    "aTest": "if (getMandatoryReadmeSectionsCount() !== 5) throw new Error('Sections count check failed');"
  },
  {
    "day": 3,
    "title": "Active Listening & Paraphrasing in Engineering Meetings: The 3-Step Protocol",
    "desc": "Master high-fidelity communication in technical discussions: The 3-Step Paraphrase Protocol (1. Listen without interrupting, 2. Reflect Core Intent in your own words: \"What I am hearing is that our primary constraint is database write latency...\", 3. Validate Understanding: \"Is that accurate?\"), Validating Underspecified Requirements, and Eliminating Defensive Reactions.",
    "syllabus": [
      "The 3-Step Paraphrasing Protocol for technical alignment.",
      "Identifying underlying business constraints behind ambiguous feature requests.",
      "Eliminating defensive interruptions during architecture reviews."
    ],
    "eTitle": "Active Listening 3-Step Paraphrase Response Generator",
    "eDesc": "Implement function generateParaphrasedReflection(speakerName, coreTechnicalPoint) generating a professional intent reflection phrase (\"What I am hearing from [Speaker] is that [CorePoint]. Does that accurately reflect your intent?\").",
    "eStarter": "function generateParaphrasedReflection(speaker, point) {\n  const formatted = `What I am hearing from ${speaker} is that ${point}. Does that accurately reflect your intent?`;\n  return {\n    speakerName: speaker,\n    extractedTechnicalPoint: point,\n    paraphrasedReflectionString: formatted,\n    isParaphraseValid: true,\n    status: 'ACTIVE_LISTENING_PARAPHRASE_GENERATED_NOMINAL'\n  };\n}",
    "eHint": "Construct reflection string with speaker and point.",
    "eTest": "const res = generateParaphrasedReflection('Sarah', 'we need to shard the user database before Black Friday traffic peaks');\nif (!res.isParaphraseValid || !res.paraphrasedReflectionString.includes('Sarah') || !res.paraphrasedReflectionString.includes('shard the user database') || res.status !== 'ACTIVE_LISTENING_PARAPHRASE_GENERATED_NOMINAL') throw new Error('Paraphrase generation failed');",
    "aTitle": "Active Listening Protocol Steps Count Formatter",
    "aDesc": "Implement function getActiveListeningStepsCount() returning `3`.",
    "aStarter": "function getActiveListeningStepsCount() { return 3; }",
    "aHint": "Return 3.",
    "aTest": "if (getActiveListeningStepsCount() !== 3) throw new Error('Steps count check failed');"
  },
  {
    "day": 4,
    "title": "Asynchronous Communication & Slack/Teams Etiquette: The \"No-Hello\" Standard",
    "desc": "Optimize distributed team productivity: The Anti-Pattern of \"Hey\" without Context (The No-Hello Rule: Stating greeting, context, question, and links in a single atomic message), Managing Asynchronous Thread Discipline, Formatting Code Blocks with Syntax Highlighting, Setting Clear Expected Response SLAs, and Declaring Status.",
    "syllabus": [
      "The No-Hello rule and eliminating synchronous interruptions in Slack/Teams.",
      "Multi-thread hygiene and preventing channel notification noise.",
      "Formatting asynchronous technical requests with code blocks and reproduction steps."
    ],
    "eTitle": "Asynchronous Message Quality & \"No-Hello\" Auditor",
    "eDesc": "Implement function auditAsyncSlackMessage(messageText) certifying that the message is NOT a bare greeting (\"Hey\", \"Hi\") and contains both context and an actionable question.",
    "eStarter": "function auditAsyncSlackMessage(msg) {\n  const text = msg.trim();\n  const isBareGreeting = /^(hey|hi|hello|morning|good morning)[.! ]*$/i.test(text);\n  const hasActionableQuestion = text.includes('?') && text.length >= 25;\n  const isAsyncCompliant = !isBareGreeting && hasActionableQuestion;\n  return {\n    rawMessageText: text,\n    isBareGreetingAntiPattern: isBareGreeting,\n    hasActionableQuestion,\n    isAsyncCommunicationCompliant: isAsyncCompliant,\n    status: isAsyncCompliant ? 'ASYNC_MESSAGE_QUALITY_COMPLIANT_NOMINAL' : 'ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION'\n  };\n}",
    "eHint": "Check if text is bare greeting or lacks ? with length < 25.",
    "eTest": "const pass = auditAsyncSlackMessage('Hi Dave, could you review the auth PR #42 when you get a chance? Link: github.com/org/repo/pull/42');\nconst fail = auditAsyncSlackMessage('Hi');\nif (!pass.isAsyncCommunicationCompliant || fail.isAsyncCommunicationCompliant || pass.status !== 'ASYNC_MESSAGE_QUALITY_COMPLIANT_NOMINAL') throw new Error('Async message audit failed');",
    "aTitle": "Async Communication Golden Etiquette Rule Formatter",
    "aDesc": "Implement function getAsyncEtiquetteRuleName() returning `'NO_HELLO_RULE'`.",
    "aStarter": "function getAsyncEtiquetteRuleName() { return 'NO_HELLO_RULE'; }",
    "aHint": "Return NO_HELLO_RULE.",
    "aTest": "if (getAsyncEtiquetteRuleName() !== 'NO_HELLO_RULE') throw new Error('Rule name check failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Professional Written Communication, Technical README, Active Listening & Async Collaboration Engine",
    "desc": "Milestone 1: Build a complete foundational tech communication and collaboration engine: BLUF email structure validation (`[Action Required]`), 5-Section README completeness verification, 3-Step active listening paraphrase generation, and \"No-Hello\" asynchronous Slack message compliance.",
    "syllabus": [
      "Synthesis of written email architecture, technical documentation, meeting active listening, and async team etiquette.",
      "Foundational communication quality gate verification.",
      "Milestone 1 certification."
    ],
    "eTitle": "Communication Foundations Master Engine",
    "eDesc": "Implement function executeCommunicationFoundationsMaster(blufOk, readmeOk, listeningOk, asyncOk) certifying combined communication foundations execution.",
    "eStarter": "function executeCommunicationFoundationsMaster(bluf, rdme, list, asnc) {\n  const isNominal = bluf && rdme && list && asnc;\n  return {\n    blufEmailsFormatted: bluf,\n    readmeSectionsVerified: rdme,\n    activeListeningReflected: list,\n    asyncEtiquetteCompliant: asnc,\n    foundationsCertified: isNominal,\n    engineStatus: isNominal ? 'COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE' : 'COMMUNICATION_FOUNDATIONS_DEFECT'\n  };\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeCommunicationFoundationsMaster(true, true, true, true);\nif (res.engineStatus !== 'COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE') throw new Error('Milestone 1 master engine failed');",
    "aTitle": "Communication Foundations Status Formatter",
    "aDesc": "Implement function formatCommFoundationsStatus(ok) returning `COMM_FOUNDATIONS_${ok ? 'ACTIVE' : 'OFFLINE'}`.",
    "aStarter": "function formatCommFoundationsStatus(o) { return `COMM_FOUNDATIONS_${o ? 'ACTIVE' : 'OFFLINE'}`; }",
    "aHint": "Format status.",
    "aTest": "if (formatCommFoundationsStatus(true) !== 'COMM_FOUNDATIONS_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 6,
    "title": "Cross-Functional Alignment & Non-Technical Translation: The ELI5 Framework",
    "desc": "Bridge the gap between engineering and business stakeholders: The \"Explain Like I'm 5\" (ELI5) / Business Value Translation Framework, Translating Technical Debt into Business Risk (\"Refactoring the auth service reduces customer login errors by 40% and saves $15k/mo in support tickets\"), and Collaborating with Product Managers, Designers, and Sales Teams.",
    "syllabus": [
      "Translating architectural complexity into business KPIs and customer impact.",
      "Framing technical debt and refactoring proposals in financial terms.",
      "Cross-functional stakeholder management across Product, Design, and Executive leadership."
    ],
    "eTitle": "Technical-to-Business Value Translation Matcher",
    "eDesc": "Implement function translateTechnicalJargonToBusinessValue(technicalTerm) mapping technical jargon (`'REFACTOR_DATABASE'`, `'ADD_CACHE_LAYER'`, `'UPGRADE_K8S_CLUSTER'`) to user/revenue business impact.",
    "eStarter": "function translateTechnicalJargonToBusinessValue(term) {\n  const map = {\n    'REFACTOR_DATABASE': 'Improves page load speed by 2x, reducing user churn during checkout',\n    'ADD_CACHE_LAYER': 'Reduces cloud server costs by 35% while keeping the app fast during traffic spikes',\n    'UPGRADE_K8S_CLUSTER': 'Prevents customer outage downtime and satisfies enterprise compliance requirements'\n  };\n  const desc = map[term];\n  if (!desc) throw new Error('Unknown technical term');\n  return {\n    technicalTerm: term,\n    businessValueExplanation: desc,\n    isBusinessAligned: true,\n    status: 'TECHNICAL_TRANSLATION_COMPLETED_NOMINAL'\n  };\n}",
    "eHint": "Map technical terms to business value explanations.",
    "eTest": "const res = translateTechnicalJargonToBusinessValue('REFACTOR_DATABASE');\nif (!res.isBusinessAligned || !res.businessValueExplanation.includes('churn') || res.status !== 'TECHNICAL_TRANSLATION_COMPLETED_NOMINAL') throw new Error('Technical translation failed');",
    "aTitle": "Non-Technical Translation Framework Acronym Formatter",
    "aDesc": "Implement function getTranslationFrameworkAcronym() returning `'ELI5'`.",
    "aStarter": "function getTranslationFrameworkAcronym() { return 'ELI5'; }",
    "aHint": "Return ELI5.",
    "aTest": "if (getTranslationFrameworkAcronym() !== 'ELI5') throw new Error('Acronym check failed');"
  },
  {
    "day": 7,
    "title": "Constructive Feedback & Code Review Psychology: The SBI Feedback Framework",
    "desc": "Deliver high-impact, non-defensive feedback: The SBI Framework (Situation $\\to$ Behavior $\\to$ Impact: \"In yesterday's PR review [Situation], you merged the PR without waiting for CI tests to finish [Behavior], which broke the staging deployment for 2 hours [Impact]\"), Separating Author Self-Worth from Code Quality, and Prefixing Review Comments (`nit:`, `suggestion:`, `blocker:`).",
    "syllabus": [
      "The Situation-Behavior-Impact (SBI) feedback delivery model.",
      "Psychological safety and separating identity from code artifacts.",
      "Structured comment prefixing for clear reviewer intent."
    ],
    "eTitle": "SBI Constructive Feedback Message Generator",
    "eDesc": "Implement function formatSbiFeedback(situation, behavior, impact, proposedNextStep) constructing a complete, non-violent SBI feedback record.",
    "eStarter": "function formatSbiFeedback(situation, behavior, impact, nextStep) {\n  if (!situation || !behavior || !impact || !nextStep) throw new Error('Missing SBI components');\n  const fullText = `Situation: ${situation}. Behavior: ${behavior}. Impact: ${impact}. Next Step: ${nextStep}`;\n  return {\n    situation,\n    behavior,\n    impact,\n    proposedNextStep: nextStep,\n    formattedFeedbackString: fullText,\n    isSbiCompliant: true,\n    status: 'SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL'\n  };\n}",
    "eHint": "Construct feedback object containing situation, behavior, impact, and nextStep.",
    "eTest": "const res = formatSbiFeedback('In yesterday\\'s release', 'untested code was pushed to main', 'the login service was down for 30 minutes', 'let\\'s pair on writing unit tests before the next release');\nif (!res.isSbiCompliant || !res.formattedFeedbackString.includes('login service was down') || res.status !== 'SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL') throw new Error('SBI feedback formatting failed');",
    "aTitle": "SBI Feedback Framework Component Count Formatter",
    "aDesc": "Implement function getSbiComponentsCount() returning `3`.",
    "aStarter": "function getSbiComponentsCount() { return 3; }",
    "aHint": "Return 3.",
    "aTest": "if (getSbiComponentsCount() !== 3) throw new Error('Components count check failed');"
  },
  {
    "day": 8,
    "title": "Conflict Resolution & De-escalation in Tech Teams: The IBR Approach",
    "desc": "De-escalate intense engineering disagreements: The Interest-Based Relational (IBR) Approach (1. Keep people and problems separate, 2. Focus on underlying interests rather than entrenched positions, 3. Establish objective evaluation metrics like latency, memory, or maintenance cost, 4. Explore options for mutual gain), and Managing Technical Debates (e.g. Tab vs Spaces / REST vs GraphQL).",
    "syllabus": [
      "The Interest-Based Relational (IBR) conflict resolution framework.",
      "Separating positional ego from objective technical architecture requirements.",
      "Establishing shared North Star metrics to break engineering deadlocks."
    ],
    "eTitle": "Interest-Based Conflict De-escalation Evaluator",
    "eDesc": "Implement function evaluateConflictResolutionStrategy(isPersonalAttacksEliminated, isObjectiveCriteriaDefined, isMutualGainExplored) certifying whether a technical conflict resolution aligns with the IBR standard.",
    "eStarter": "function evaluateConflictResolutionStrategy(noAttacks, objectiveCriteria, mutualGain) {\n  const isCompliant = noAttacks && objectiveCriteria && mutualGain;\n  return {\n    personalAttacksEliminated: noAttacks,\n    objectiveEvaluationCriteriaDefined: objectiveCriteria,\n    mutualGainOptionsExplored: mutualGain,\n    isIbrResolutionCompliant: isCompliant,\n    status: isCompliant ? 'IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL' : 'CONFLICT_RESOLUTION_DEFECT_POSITIONAL_DISPUTE'\n  };\n}",
    "eHint": "Verify all 3 flags evaluate to true.",
    "eTest": "const pass = evaluateConflictResolutionStrategy(true, true, true);\nconst fail = evaluateConflictResolutionStrategy(true, false, true);\nif (!pass.isIbrResolutionCompliant || fail.isIbrResolutionCompliant || pass.status !== 'IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL') throw new Error('Conflict resolution evaluation failed');",
    "aTitle": "Interest-Based Relational Approach Acronym Formatter",
    "aDesc": "Implement function getIbrAcronym() returning `'IBR'`.",
    "aStarter": "function getIbrAcronym() { return 'IBR'; }",
    "aHint": "Return IBR.",
    "aTest": "if (getIbrAcronym() !== 'IBR') throw new Error('Acronym check failed');"
  },
  {
    "day": 9,
    "title": "Effective Agile Standups & Synchronous Meetings: The 90-Second Update",
    "desc": "Deliver high-signal, concise daily standup reports: The 3-Part Standup Format (1. What I completed yesterday that moved our sprint goal, 2. What I will deliver today, 3. Blockers/Dependencies needing help), Keeping updates strictly under 90 seconds, and Utilizing the \"Parking Lot\" for deep architectural discussions.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Effective Agile Standups & Synchronous Meetings: The 90-Second Update.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "90-Second Standup Update Parser & Timer Auditor",
    "eDesc": "Implement function formatStandupUpdate(yesterdayWork, todayTarget, blockerDetails, durationSeconds) verifying that the update contains all 3 components and took $\\le 90$ seconds.",
    "eStarter": "function formatStandupUpdate(yesterday, today, blocker, durationSec) {\n  const hasComponents = !!(yesterday && today);\n  const isUnder90Sec = durationSec <= 90;\n  const isApproved = hasComponents && isUnder90Sec;\n  return {\n    yesterdayDelivered: yesterday,\n    todayPlanned: today,\n    blockersReported: blocker || 'None',\n    durationSeconds: durationSec,\n    isStandupHighSignal: isApproved,\n    status: isApproved ? 'STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL' : 'STANDUP_UPDATE_OVERTIME_OR_INCOMPLETE'\n  };\n}",
    "eHint": "Verify yesterday, today, and durationSec <= 90.",
    "eTest": "const pass = formatStandupUpdate('Finished JWT auth tests', 'Will integrate Stripe webhooks', null, 45);\nconst fail = formatStandupUpdate('Finished tests', 'Will integrate', null, 120);\nif (!pass.isStandupHighSignal || fail.isStandupHighSignal || pass.status !== 'STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL') throw new Error('Standup update formatting failed');",
    "aTitle": "Maximum Recommended Standup Update Duration Formatter",
    "aDesc": "Implement function getMaxStandupDurationSeconds() returning `90`.",
    "aStarter": "function getMaxStandupDurationSeconds() { return 90; }",
    "aHint": "Return 90.",
    "aTest": "if (getMaxStandupDurationSeconds() !== 90) throw new Error('Duration check failed');"
  },
  {
    "day": 10,
    "title": "Technical Presentations & Slide Deck Architecture: The Minto Pyramid Principle",
    "desc": "Structure persuasive executive presentations: The Minto Pyramid Principle (Lead with the Core Conclusion / Recommendation $\\to$ Group key supporting logical pillars $\\to$ Provide supporting evidentiary data), Cognitive Load Reduction (1 idea per slide, 0 dense bullet walls), and Structuring Technical Demo Days.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Technical Presentations & Slide Deck Architecture: The Minto Pyramid Principle.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Minto Pyramid Presentation Outline Validator",
    "eDesc": "Implement function validateMintoPyramidOutline(governingThought, supportingPillarsArray) verifying that the outline leads with a single governing thought and 2 to 4 supporting pillars.",
    "eStarter": "function validateMintoPyramidOutline(thought, pillars) {\n  const hasThought = typeof thought === 'string' && thought.trim().length >= 15;\n  const hasValidPillars = Array.isArray(pillars) && pillars.length >= 2 && pillars.length <= 4;\n  const isApproved = hasThought && hasValidPillars;\n  return {\n    governingThought: thought,\n    supportingPillarsCount: pillars ? pillars.length : 0,\n    isMintoStructureCompliant: isApproved,\n    status: isApproved ? 'MINTO_PYRAMID_OUTLINE_VALID_NOMINAL' : 'MINTO_STRUCTURE_DEFECT'\n  };\n}",
    "eHint": "Check thought length >= 15 and pillars length between 2 and 4.",
    "eTest": "const pass = validateMintoPyramidOutline('We should migrate our monolithic backend to microservices to support 10x traffic growth.', ['Improves system scalability', 'Isolates deployment failure domains', 'Allows independent team velocity']);\nconst fail = validateMintoPyramidOutline('Short', ['One pillar']);\nif (!pass.isMintoStructureCompliant || fail.isMintoStructureCompliant || pass.status !== 'MINTO_PYRAMID_OUTLINE_VALID_NOMINAL') throw new Error('Minto outline validation failed');",
    "aTitle": "Minto Pyramid Top Tier Name Formatter",
    "aDesc": "Implement function getMintoTopTierName() returning `'Governing Thought'`.",
    "aStarter": "function getMintoTopTierName() { return 'Governing Thought'; }",
    "aHint": "Return Governing Thought.",
    "aTest": "if (getMintoTopTierName() !== 'Governing Thought') throw new Error('Tier name check failed');"
  },
  {
    "day": 11,
    "title": "Executive Presence & Delivering Bad News: The SCR Communication Framework",
    "desc": "Communicate crises, outages, and delays with composure: The Situation-Complication-Resolution (SCR) Framework, Early Outage Communication (Transparency over concealing delays), Presenting Mitigation Options with Explicit Tradeoffs, and Taking Accountability.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Executive Presence & Delivering Bad News: The SCR Communication Framework.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "SCR Executive Crisis Communication Generator",
    "eDesc": "Implement function formatScrCrisisCommunication(situation, complication, resolutionOptionsArray) generating a structured executive incident briefing.",
    "eStarter": "function formatScrCrisisCommunication(sit, comp, resolutions) {\n  if (!sit || !comp || !resolutions || resolutions.length < 2) throw new Error('Invalid SCR parameters');\n  return {\n    situation: sit,\n    complication: comp,\n    resolutionOptions: resolutions,\n    isScrCompliant: true,\n    status: 'SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL'\n  };\n}",
    "eHint": "Verify situation, complication, and at least 2 resolution options.",
    "eTest": "const res = formatScrCrisisCommunication('Payment processing API is live in US region', 'Third-party gateway latency spiked to 8 seconds causing 15% transaction timeouts', ['Option A: Failover to backup Stripe gateway immediately (5 min downtime)', 'Option B: Throttle non-critical traffic (0 downtime, partial capacity)']);\nif (!res.isScrCompliant || res.resolutionOptions.length !== 2 || res.status !== 'SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL') throw new Error('SCR communication formatting failed');",
    "aTitle": "SCR Framework Acronym Formatter",
    "aDesc": "Implement function getScrAcronymExpanded() returning `'Situation-Complication-Resolution'`.",
    "aStarter": "function getScrAcronymExpanded() { return 'Situation-Complication-Resolution'; }",
    "aHint": "Return Situation-Complication-Resolution.",
    "aTest": "if (getScrAcronymExpanded() !== 'Situation-Complication-Resolution') throw new Error('SCR expanded check failed');"
  },
  {
    "day": 12,
    "title": "Negotiation & Persuasion for Engineers: Establishing ZOPA & BATNA",
    "desc": "Persuade stakeholders and negotiate technical scope: Establishing the Zone of Possible Agreement (ZOPA) and Best Alternative to a Negotiated Agreement (BATNA), Pitching Major Architectural Refactors to skeptical product leaders, and Securing Engineering Time in sprint planning.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Negotiation & Persuasion for Engineers: Establishing ZOPA & BATNA.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "ZOPA Scope Negotiation Range Evaluator",
    "eDesc": "Implement function calculateZopaAgreementRange(engineeringMinSprintAllocation, businessMaxSprintAllocation) determining whether a viable ZOPA negotiation overlap exists.",
    "eStarter": "function calculateZopaAgreementRange(engMin, bizMax) {\n  const hasZopa = bizMax >= engMin;\n  const overlapPoints = hasZopa ? bizMax - engMin : 0;\n  return {\n    engineeringMinimumRequested: engMin,\n    businessMaximumAllowed: bizMax,\n    hasViableZopa: hasZopa,\n    zopaOverlapRangePoints: overlapPoints,\n    status: hasZopa ? 'ZOPA_AGREEMENT_RANGE_ESTABLISHED_NOMINAL' : 'NO_VIABLE_ZOPA_DEADLOCK'\n  };\n}",
    "eHint": "hasZopa is true when bizMax >= engMin.",
    "eTest": "const pass = calculateZopaAgreementRange(20, 30); // 20% min vs 30% max -> 10% overlap\nconst fail = calculateZopaAgreementRange(35, 20); // Deadlock\nif (!pass.hasViableZopa || fail.hasViableZopa || pass.zopaOverlapRangePoints !== 10 || pass.status !== 'ZOPA_AGREEMENT_RANGE_ESTABLISHED_NOMINAL') throw new Error('ZOPA negotiation evaluation failed');",
    "aTitle": "BATNA Acronym Expanded Formatter",
    "aDesc": "Implement function getBatnaAcronymExpanded() returning `'Best Alternative to a Negotiated Agreement'`.",
    "aStarter": "function getBatnaAcronymExpanded() { return 'Best Alternative to a Negotiated Agreement'; }",
    "aHint": "Return Best Alternative to a Negotiated Agreement.",
    "aTest": "if (getBatnaAcronymExpanded() !== 'Best Alternative to a Negotiated Agreement') throw new Error('BATNA check failed');"
  },
  {
    "day": 13,
    "title": "Time Management & Deep Work Boundary Setting: Maker's Schedule vs Manager's Schedule",
    "desc": "Protect engineering flow and productivity: Paul Graham's Maker's Schedule vs Manager's Schedule (Why a 15-minute meeting in the middle of a 4-hour coding block destroys an entire afternoon), Time Blocking 3-Hour Deep Work Windows, Declaring Focus Status, and Saying Professional \"No\" with Alternative Timelines.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Time Management & Deep Work Boundary Setting: Maker's Schedule vs Manager's Schedule.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Maker's Schedule Deep Work Block Auditor",
    "eDesc": "Implement function auditMakersSchedule(scheduleEventsArray) calculating total uninterrupted 2+ hour focus blocks and flagging fragmented days.",
    "eStarter": "function auditMakersSchedule(events) {\n  let focusBlocks = 0;\n  events.forEach(e => {\n    if (e.durationHours >= 2.0 && e.isUninterrupted) focusBlocks++;\n  });\n  const isDeepWorkProtected = focusBlocks >= 2;\n  return {\n    totalFocusBlocksCount: focusBlocks,\n    isMakerScheduleProtected: isDeepWorkProtected,\n    status: isDeepWorkProtected ? 'MAKERS_SCHEDULE_DEEP_WORK_PROTECTED_NOMINAL' : 'SCHEDULE_FRAGMENTED_BY_MEETINGS'\n  };\n}",
    "eHint": "Count events with durationHours >= 2 and isUninterrupted.",
    "eTest": "const protectedSched = auditMakersSchedule([{ durationHours: 3.0, isUninterrupted: true }, { durationHours: 2.5, isUninterrupted: true }, { durationHours: 0.5, isUninterrupted: false }]);\nconst fragmented = auditMakersSchedule([{ durationHours: 0.5, isUninterrupted: false }]);\nif (!protectedSched.isMakerScheduleProtected || fragmented.isMakerScheduleProtected || protectedSched.totalFocusBlocksCount !== 2) throw new Error('Maker schedule audit failed');",
    "aTitle": "Maker vs Manager Schedule Essay Author Formatter",
    "aDesc": "Implement function getMakersScheduleAuthor() returning `'Paul Graham'`.",
    "aStarter": "function getMakersScheduleAuthor() { return 'Paul Graham'; }",
    "aHint": "Return Paul Graham.",
    "aTest": "if (getMakersScheduleAuthor() !== 'Paul Graham') throw new Error('Author check failed');"
  },
  {
    "day": 14,
    "title": "Mental Health, Imposter Syndrome & Burnout Prevention: Psychological Safety",
    "desc": "Sustain a long-term engineering career: The Dunning-Kruger vs Imposter Phenomenon Cycle, Reframing \"I don't know\" into high-signal learning (\"I haven't worked with that specific tool yet, but I will investigate and document a prototype by tomorrow\"), Establishing Healthy Remote Work Boundaries, and Fostering Psychological Safety.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Mental Health, Imposter Syndrome & Burnout Prevention: Psychological Safety.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Constructive Learning Reframing Response Generator",
    "eDesc": "Implement function generateConstructiveLearningReframing(unfamiliarTechnology) transforming an insecure \"I don't know\" into an empowered engineering commitment.",
    "eStarter": "function generateConstructiveLearningReframing(tech) {\n  const reframing = `I have not worked with ${tech} in production yet, but I understand the core principles and will build a working POC to evaluate it by tomorrow.`;\n  return {\n    technologyTarget: tech,\n    empoweredResponse: reframing,\n    isPsychologicallySafe: true,\n    status: 'CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL'\n  };\n}",
    "eHint": "Construct empoweredResponse string.",
    "eTest": "const res = generateConstructiveLearningReframing('Kubernetes Operators');\nif (!res.isPsychologicallySafe || !res.empoweredResponse.includes('Kubernetes Operators') || res.status !== 'CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL') throw new Error('Learning reframing failed');",
    "aTitle": "Growth Mindset Inquiry Phrase Formatter",
    "aDesc": "Implement function getGrowthMindsetPhrase() returning `'I will investigate and document a POC'`.",
    "aStarter": "function getGrowthMindsetPhrase() { return 'I will investigate and document a POC'; }",
    "aHint": "Return I will investigate and document a POC.",
    "aTest": "if (getGrowthMindsetPhrase() !== 'I will investigate and document a POC') throw new Error('Phrase check failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine",
    "desc": "Milestone 2: Build a complete intermediate soft skills and leadership engine: Technical-to-business translation, SBI constructive feedback delivery, IBR conflict resolution certification, 90-second standup timing, Minto Pyramid presentation validation, and ZOPA negotiation range calculation.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of ⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Tech Leadership Communication Master Engine",
    "eDesc": "Implement function executeTechLeadershipMaster(translationOk, sbiOk, ibrOk, standupOk, mintoOk, zopaOk) certifying combined intermediate communication execution.",
    "eStarter": "function executeTechLeadershipMaster(t, s, i, st, m, z) {\n  const isNominal = t && s && i && st && m && z;\n  return {\n    businessTranslationVerified: t,\n    sbiFeedbackCompliant: s,\n    ibrConflictResolved: i,\n    standupDisciplined: st,\n    mintoPyramidStructured: m,\n    zopaNegotiated: z,\n    engineStatus: isNominal ? 'TECH_LEADERSHIP_MASTER_ACTIVE' : 'TECH_LEADERSHIP_DEFECT'\n  };\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeTechLeadershipMaster(true, true, true, true, true, true);\nif (res.engineStatus !== 'TECH_LEADERSHIP_MASTER_ACTIVE') throw new Error('Milestone 2 leadership master failed');",
    "aTitle": "Tech Leadership Master Status Formatter",
    "aDesc": "Implement function getTechLeadershipMasterStatus() returning `'TECH_LEADERSHIP_MASTER_ACTIVE'`.",
    "aStarter": "function getTechLeadershipMasterStatus() { return 'TECH_LEADERSHIP_MASTER_ACTIVE'; }",
    "aHint": "Return status.",
    "aTest": "if (getTechLeadershipMasterStatus() !== 'TECH_LEADERSHIP_MASTER_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 16,
    "title": "Tech Resume Engineering: The Google X-Y-Z Formula & Impact Quantification",
    "desc": "Write an elite software engineering resume: The Google X-Y-Z Formula (\"Accomplished [X] as measured by [Y], by doing [Z]\"), ATS-Friendly Formatting, Choosing High-Impact Technical Action Verbs (\"Architected\", \"Engineered\", \"Optimized\" vs passive \"Assisted\"), and Quantifying Engineering Metrics (Latency $-45\\%$, Cloud costs $-\\$20k/mo$).",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Tech Resume Engineering: The Google X-Y-Z Formula & Impact Quantification.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Google X-Y-Z Resume Bullet Point Structure Validator",
    "eDesc": "Implement function validateGoogleXyzBullet(bulletText) certifying that the resume bullet point contains an Accomplishment (X), a Quantitative Metric (Y), and an Action Method (Z).",
    "eStarter": "function validateGoogleXyzBullet(bullet) {\n  const hasActionVerb = /^(Architected|Engineered|Optimized|Developed|Redesigned|Implemented)/i.test(bullet.trim());\n  const hasQuantitativeMetric = /\\d+(?:%|ms|x|k|\\$|M)/i.test(bullet);\n  const hasByDoingClause = /(?:by|using|via|through)\\s+[a-z0-9]/i.test(bullet);\n  const isApproved = hasActionVerb && hasQuantitativeMetric && hasByDoingClause;\n  return {\n    rawBulletText: bullet,\n    hasActionVerb,\n    hasQuantitativeMetric,\n    hasByDoingClause,\n    isGoogleXyzCompliant: isApproved,\n    status: isApproved ? 'GOOGLE_XYZ_BULLET_VALID_NOMINAL' : 'RESUME_BULLET_DEFECT_MISSING_XYZ_COMPONENTS'\n  };\n}",
    "eHint": "Check action verb, quantitative metric (%/ms/$/k), and by/using clause.",
    "eTest": "const pass = validateGoogleXyzBullet('Optimized database query latency by 45% by implementing Redis caching and indexing slow Postgres queries.');\nconst fail = validateGoogleXyzBullet('Helped team with database tasks.');\nif (!pass.isGoogleXyzCompliant || fail.isGoogleXyzCompliant || pass.status !== 'GOOGLE_XYZ_BULLET_VALID_NOMINAL') throw new Error('Google XYZ bullet validation failed');",
    "aTitle": "Google Resume Formula Acronym Formatter",
    "aDesc": "Implement function getGoogleFormulaName() returning `'X-Y-Z Formula'`.",
    "aStarter": "function getGoogleFormulaName() { return 'X-Y-Z Formula'; }",
    "aHint": "Return X-Y-Z Formula.",
    "aTest": "if (getGoogleFormulaName() !== 'X-Y-Z Formula') throw new Error('Formula name check failed');"
  },
  {
    "day": 17,
    "title": "LinkedIn Optimization & Personal Branding: High-Signal Engineering Profiles",
    "desc": "Attract inbound recruiting opportunities on LinkedIn: Crafting High-Signal Professional Headlines (\"Full-Stack Engineer | React, Node.js, Distributed Systems | Building High-Throughput Fintech APIs\"), Showcasing Open-Source Contributions & GitHub Badges, Writing Technical Articles, and Reaching Out to Hiring Managers.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of LinkedIn Optimization & Personal Branding: High-Signal Engineering Profiles.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "LinkedIn Technical Headline Signal Evaluator",
    "eDesc": "Implement function evaluateLinkedInHeadline(headlineString) validating that the headline includes target role, primary tech stack, and specialty/impact domain.",
    "eStarter": "function evaluateLinkedInHeadline(headline) {\n  const parts = headline.split('|').map(s => s.trim());\n  const isHighSignal = parts.length >= 3 && headline.length >= 30;\n  return {\n    headlinePartsCount: parts.length,\n    targetRole: parts[0] || null,\n    coreTechStack: parts[1] || null,\n    specialtyDomain: parts[2] || null,\n    isHeadlineHighSignal: isHighSignal,\n    status: isHighSignal ? 'LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL' : 'HEADLINE_DEFECT_GENERIC'\n  };\n}",
    "eHint": "Verify at least 3 pipe-separated segments and length >= 30.",
    "eTest": "const pass = evaluateLinkedInHeadline('Senior Software Engineer | React, TypeScript, Node.js | Scaling Cloud SaaS Systems');\nconst fail = evaluateLinkedInHeadline('Looking for opportunities');\nif (!pass.isHeadlineHighSignal || fail.isHeadlineHighSignal || pass.status !== 'LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL') throw new Error('LinkedIn headline evaluation failed');",
    "aTitle": "Recommended LinkedIn Headline Delimiter Formatter",
    "aDesc": "Implement function getHeadlineDelimiter() returning `'|'`.",
    "aStarter": "function getHeadlineDelimiter() { return '|'; }",
    "aHint": "Return |.",
    "aTest": "if (getHeadlineDelimiter() !== '|') throw new Error('Delimiter check failed');"
  },
  {
    "day": 18,
    "title": "The Behavioral Interview Framework: The STAR Method & Time Allocation",
    "desc": "Master behavioral tech interviews at top tech companies: The STAR Method (Situation $10\\%$, Task $10\\%$, Action $70\\%$ (Where you shine: specific technical decisions, leadership, collaboration), Result $10\\%$ (Quantifiable business impact)), and Crafting 5 Versatile Core Stories (Conflict, Technical Failure, Tight Deadline, Mentorship, Innovation).",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of The Behavioral Interview Framework: The STAR Method & Time Allocation.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "STAR Behavioral Response Time Allocation Auditor",
    "eDesc": "Implement function auditStarTimeAllocation(situationSec, taskSec, actionSec, resultSec) verifying that the candidate allocated at least $60\\%$ of speaking time to the Action section.",
    "eStarter": "function auditStarTimeAllocation(sit, tsk, act, res) {\n  const total = sit + tsk + act + res;\n  const actionPct = Number(((act / total) * 100).toFixed(1));\n  const isOptimal = actionPct >= 60.0 && total <= 180;\n  return {\n    totalDurationSeconds: total,\n    actionPercentage: actionPct,\n    isStarAllocationOptimal: isOptimal,\n    status: isOptimal ? 'STAR_TIME_ALLOCATION_OPTIMAL_NOMINAL' : 'STAR_ACTION_UNDERALLOCATED'\n  };\n}",
    "eHint": "actionPct >= 60.0 and total <= 180 seconds.",
    "eTest": "const pass = auditStarTimeAllocation(15, 15, 80, 15); // Total 125s, Action 80s = 64.0%\nconst fail = auditStarTimeAllocation(60, 60, 30, 10); // Total 160s, Action 30s = 18.8%\nif (!pass.isStarAllocationOptimal || fail.isStarAllocationOptimal || pass.actionPercentage !== 64.0) throw new Error('STAR allocation audit failed');",
    "aTitle": "Target STAR Action Section Percentage Formatter",
    "aDesc": "Implement function getTargetStarActionPercentage() returning `70`.",
    "aStarter": "function getTargetStarActionPercentage() { return 70; }",
    "aHint": "Return 70.",
    "aTest": "if (getTargetStarActionPercentage() !== 70) throw new Error('Percentage check failed');"
  },
  {
    "day": 19,
    "title": "Answering \"Tell Me About Yourself\": The 90-Second Present-Past-Future Pitch",
    "desc": "Deliver a compelling opening interview response: The 90-Second Present-Past-Future Narrative Arc (1. Present: Who you are today & current core technical strengths, 2. Past: Key relevant project milestones and crucible experiences, 3. Future: Why this exact company, team, and problem space is the natural next step), Radiating Energy and Cultural Alignment.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Answering \"Tell Me About Yourself\": The 90-Second Present-Past-Future Pitch.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Present-Past-Future Pitch Structure Validator",
    "eDesc": "Implement function validateElevatorPitch(presentSection, pastSection, futureSection, targetCompany) verifying that the pitch touches all 3 temporal pillars and customizes the future vision to the target company.",
    "eStarter": "function validateElevatorPitch(pres, past, fut, company) {\n  const hasPres = typeof pres === 'string' && pres.length >= 20;\n  const hasPast = typeof past === 'string' && past.length >= 20;\n  const hasFut = typeof fut === 'string' && fut.includes(company);\n  const isApproved = hasPres && hasPast && hasFut;\n  return {\n    targetCompany: company,\n    isPitchCompleteAndTailored: isApproved,\n    status: isApproved ? 'ELEVATOR_PITCH_TAILORED_NOMINAL' : 'PITCH_GENERIC_OR_INCOMPLETE'\n  };\n}",
    "eHint": "Verify present, past, and fut.includes(company).",
    "eTest": "const pass = validateElevatorPitch('Currently a fullstack dev building React/Node apps', 'Previously led database migrations at fintech startup', 'Excited to bring this expertise to Stripe to scale payments infrastructure', 'Stripe');\nconst fail = validateElevatorPitch('Dev here', 'Did stuff', 'Looking for job', 'Stripe');\nif (!pass.isPitchCompleteAndTailored || fail.isPitchCompleteAndTailored || pass.status !== 'ELEVATOR_PITCH_TAILORED_NOMINAL') throw new Error('Elevator pitch validation failed');",
    "aTitle": "Elevator Pitch Narrative Arc Model Formatter",
    "aDesc": "Implement function getElevatorPitchArcModel() returning `'Present-Past-Future'`.",
    "aStarter": "function getElevatorPitchArcModel() { return 'Present-Past-Future'; }",
    "aHint": "Return Present-Past-Future.",
    "aTest": "if (getElevatorPitchArcModel() !== 'Present-Past-Future') throw new Error('Arc model check failed');"
  },
  {
    "day": 20,
    "title": "Tackling \"Tell Me About a Time You Failed\": Blameless Postmortem Storytelling",
    "desc": "Turn past mistakes into your strongest interview proof point: The Blameless Postmortem Mindset, Owning the Technical Defect Honestly without blaming teammates or managers, Conducting Root Cause Analysis (5 Whys), and Highlighting the Permanent Automated Guardrail (CI test, linter, alerting rule) You Built to Ensure the Failure Never Happens Again.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Tackling \"Tell Me About a Time You Failed\": Blameless Postmortem Storytelling.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Blameless Failure Story & Prevention Guardrail Auditor",
    "eDesc": "Implement function auditFailureStory(technicalMistakeOwned, rootCauseIdentified, automatedGuardrailBuilt) certifying that the candidate demonstrated extreme ownership and systemic prevention.",
    "eStarter": "function auditFailureStory(mistake, rootCause, guardrail) {\n  const isEmpowered = mistake && rootCause && guardrail;\n  return {\n    technicalOwnershipDemonstrated: mistake,\n    rootCauseAnalyzed: rootCause,\n    permanentGuardrailConstructed: guardrail,\n    isFailureStoryHighSignal: isEmpowered,\n    status: isEmpowered ? 'BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL' : 'FAILURE_STORY_DEFECT_DEFENSIVE_OR_UNRESOLVED'\n  };\n}",
    "eHint": "Verify all 3 flags evaluate to true.",
    "eTest": "const pass = auditFailureStory(true, true, true);\nconst fail = auditFailureStory(true, true, false);\nif (!pass.isFailureStoryHighSignal || fail.isFailureStoryHighSignal || pass.status !== 'BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL') throw new Error('Failure story audit failed');",
    "aTitle": "Root Cause Analysis Investigation Method Formatter",
    "aDesc": "Implement function getRootCauseMethodName() returning `'5 Whys Analysis'`.",
    "aStarter": "function getRootCauseMethodName() { return '5 Whys Analysis'; }",
    "aHint": "Return 5 Whys Analysis.",
    "aTest": "if (getRootCauseMethodName() !== '5 Whys Analysis') throw new Error('Method check failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine",
    "desc": "Milestone 3: Build a complete advanced tech career acceleration engine: Google X-Y-Z resume bullet point validation, high-signal LinkedIn headline auditing, STAR behavioral interview time allocation ($70\\%$ Action allocation), Present-Past-Future tailored pitch generation, and blameless failure guardrail verification.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of ⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Tech Career & Interview Master Engine",
    "eDesc": "Implement function executeCareerInterviewMaster(xyzOk, linkedinOk, starOk, pitchOk, failureOk) certifying combined career acceleration execution.",
    "eStarter": "function executeCareerInterviewMaster(xyz, li, star, pitch, fail) {\n  const isNominal = xyz && li && star && pitch && fail;\n  return {\n    googleXyzBulletsValidated: xyz,\n    linkedinHeadlinesAudited: li,\n    starTimeAllocated: star,\n    tailoredPitchesCrafted: pitch,\n    blamelessFailureGuardrailsVerified: fail,\n    engineStatus: isNominal ? 'CAREER_INTERVIEW_MASTER_ACTIVE' : 'CAREER_INTERVIEW_DEFECT'\n  };\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeCareerInterviewMaster(true, true, true, true, true);\nif (res.engineStatus !== 'CAREER_INTERVIEW_MASTER_ACTIVE') throw new Error('Milestone 3 career master failed');",
    "aTitle": "Tech Career Master Status Formatter",
    "aDesc": "Implement function getCareerInterviewMasterStatus() returning `'CAREER_INTERVIEW_MASTER_ACTIVE'`.",
    "aStarter": "function getCareerInterviewMasterStatus() { return 'CAREER_INTERVIEW_MASTER_ACTIVE'; }",
    "aHint": "Return status.",
    "aTest": "if (getCareerInterviewMasterStatus() !== 'CAREER_INTERVIEW_MASTER_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 22,
    "title": "High-Signal Reverse Interviewing: Questions to Ask the Interviewer",
    "desc": "Evaluate team culture and uncover red flags during interviews: High-Signal Reverse Questions (Evaluating CI/CD automation: \"How long does it take from git merge to production deployment?\", On-Call Health: \"How often are engineers paged after hours?\", Psychological Safety: \"Can you tell me about the last major production incident and how the team handled the postmortem?\").",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of High-Signal Reverse Interviewing: Questions to Ask the Interviewer.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Reverse Interview Question Signal & Category Classifier",
    "eDesc": "Implement function classifyReverseInterviewQuestion(questionText) classifying candidate questions into `'DEPLOYMENT_HEALTH'`, `'ON_CALL_CULTURE'`, or `'TEAM_PSYCHOLOGICAL_SAFETY'`.",
    "eStarter": "function classifyReverseInterviewQuestion(q) {\n  const text = q.toLowerCase();\n  if (text.includes('deploy') || text.includes('ci/cd') || text.includes('release')) return { category: 'DEPLOYMENT_HEALTH', isHighSignal: true, status: 'QUESTION_CLASSIFIED_NOMINAL' };\n  if (text.includes('on-call') || text.includes('paged') || text.includes('incident')) return { category: 'ON_CALL_CULTURE', isHighSignal: true, status: 'QUESTION_CLASSIFIED_NOMINAL' };\n  if (text.includes('postmortem') || text.includes('mistake') || text.includes('psychological')) return { category: 'TEAM_PSYCHOLOGICAL_SAFETY', isHighSignal: true, status: 'QUESTION_CLASSIFIED_NOMINAL' };\n  return { category: 'GENERIC_INQUIRY', isHighSignal: false };\n}",
    "eHint": "Match keywords to determine category.",
    "eTest": "const d = classifyReverseInterviewQuestion('How long does a deployment take from merge to prod?');\nconst o = classifyReverseInterviewQuestion('How often are engineers paged on-call?');\nif (d.category !== 'DEPLOYMENT_HEALTH' || o.category !== 'ON_CALL_CULTURE' || !d.isHighSignal) throw new Error('Reverse question classification failed');",
    "aTitle": "High Signal Question Category Total Formatter",
    "aDesc": "Implement function getHighSignalCategoryTotal() returning `3`.",
    "aStarter": "function getHighSignalCategoryTotal() { return 3; }",
    "aHint": "Return 3.",
    "aTest": "if (getHighSignalCategoryTotal() !== 3) throw new Error('Category total check failed');"
  },
  {
    "day": 23,
    "title": "Live Coding & Whiteboard Communication Protocols: \"Think Aloud\" Protocol",
    "desc": "Succeed in live coding and algorithm interviews: The \"Think Aloud\" Protocol (Narrating your thought process continuously), Clarifying Edge Cases & Assumptions Before Typing Code, Stating Time & Space Complexity Upfront ($O(N \\log N)$), and Receiving Interviewer Hints with Gratitude and Flexibility.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Live Coding & Whiteboard Communication Protocols: \"Think Aloud\" Protocol.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Live Coding Whiteboard Protocol Step Evaluator",
    "eDesc": "Implement function validateLiveCodingProtocol(askedClarifications, statedComplexity, narratedThoughtProcess) verifying that candidate followed standard live coding protocols.",
    "eStarter": "function validateLiveCodingProtocol(clarified, complexity, narrated) {\n  const isCompliant = clarified && complexity && narrated;\n  return {\n    clarifiedEdgeCases: clarified,\n    statedComplexityUpfront: complexity,\n    narratedThoughtProcess: narrated,\n    isLiveCodingProtocolPassed: isCompliant,\n    status: isCompliant ? 'LIVE_CODING_PROTOCOL_PASSED_NOMINAL' : 'PROTOCOL_DEFECT_SILENT_CODING'\n  };\n}",
    "eHint": "Verify clarified, complexity, and narrated are all true.",
    "eTest": "const pass = validateLiveCodingProtocol(true, true, true);\nconst fail = validateLiveCodingProtocol(true, false, true);\nif (!pass.isLiveCodingProtocolPassed || fail.isLiveCodingProtocolPassed || pass.status !== 'LIVE_CODING_PROTOCOL_PASSED_NOMINAL') throw new Error('Live coding protocol validation failed');",
    "aTitle": "Live Coding Core Communication Rule Formatter",
    "aDesc": "Implement function getLiveCodingCoreRule() returning `'THINK_ALOUD_PROTOCOL'`.",
    "aStarter": "function getLiveCodingCoreRule() { return 'THINK_ALOUD_PROTOCOL'; }",
    "aHint": "Return THINK_ALOUD_PROTOCOL.",
    "aTest": "if (getLiveCodingCoreRule() !== 'THINK_ALOUD_PROTOCOL') throw new Error('Rule check failed');"
  },
  {
    "day": 24,
    "title": "System Design Interview Communication: The RADIO Framework",
    "desc": "Lead high-stakes system design interviews: The RADIO Framework (1. Requirements & Scoping, 2. Architecture & High-Level Design, 3. Data Model & Schema, 4. Interfaces & APIs, 5. Optimizations & Bottlenecks), Calculating Non-Functional Constraints (10M DAU, 5,000 QPS, 99.99% Availability), and Driving the Virtual Whiteboard.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of System Design Interview Communication: The RADIO Framework.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "System Design RADIO Framework Completeness Auditor",
    "eDesc": "Implement function auditRadioSystemDesign(sectionsCompletedArray) certifying that the candidate executed all 5 RADIO phases.",
    "eStarter": "function auditRadioSystemDesign(sections) {\n  const radioPillars = ['Requirements', 'Architecture', 'DataModel', 'Interfaces', 'Optimizations'];\n  const missing = radioPillars.filter(p => !sections.includes(p));\n  const isComplete = missing.length === 0;\n  return {\n    completedCount: sections.length,\n    missingPillars: missing,\n    isRadioDesignComplete: isComplete,\n    status: isComplete ? 'SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL' : 'SYSTEM_DESIGN_INCOMPLETE'\n  };\n}",
    "eHint": "Check that sections contains Requirements, Architecture, DataModel, Interfaces, Optimizations.",
    "eTest": "const pass = auditRadioSystemDesign(['Requirements', 'Architecture', 'DataModel', 'Interfaces', 'Optimizations']);\nconst fail = auditRadioSystemDesign(['Requirements', 'Architecture']);\nif (!pass.isRadioDesignComplete || fail.isRadioDesignComplete || pass.status !== 'SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL') throw new Error('RADIO system design audit failed');",
    "aTitle": "RADIO System Design Framework Acronym Formatter",
    "aDesc": "Implement function getRadioAcronym() returning `'RADIO'`.",
    "aStarter": "function getRadioAcronym() { return 'RADIO'; }",
    "aHint": "Return RADIO.",
    "aTest": "if (getRadioAcronym() !== 'RADIO') throw new Error('Acronym check failed');"
  },
  {
    "day": 25,
    "title": "Salary Negotiation & Compensation Mastery: Total Compensation (TC) Mechanics",
    "desc": "Maximize engineering offers: Total Compensation Breakdown ($TC = \\text{Base Salary} + \\text{Annual Bonus} + \\text{Equity / RSUs}$), Anchoring Strategy, Deflecting Early Salary Questions (\"I want to focus on mutual fit; I trust your offer will be competitive with market rates\"), Evaluating Competing Offers, and Negotiating Benefits & Sign-on Bonuses.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Salary Negotiation & Compensation Mastery: Total Compensation (TC) Mechanics.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Total Compensation (TC) Annual Package Calculator",
    "eDesc": "Implement function calculateTotalCompensation(baseSalary, annualBonusPct, fourYearEquityGrantVal, signOnBonusFirstYear) calculating first-year and recurring annualized TC.",
    "eStarter": "function calculateTotalCompensation(base, bonusPct, equity4Yr, signOn) {\n  const bonusVal = base * (bonusPct / 100);\n  const annualizedEquity = equity4Yr / 4;\n  const recurringTc = base + bonusVal + annualizedEquity;\n  const firstYearTc = recurringTc + (signOn || 0);\n  return {\n    baseSalary: base,\n    annualBonusValue: bonusVal,\n    annualizedEquityValue: annualizedEquity,\n    recurringAnnualTc: recurringTc,\n    firstYearTotalCompensation: firstYearTc,\n    status: 'TOTAL_COMPENSATION_CALCULATED_NOMINAL'\n  };\n}",
    "eHint": "firstYearTc = base + bonus + (equity4Yr / 4) + signOn.",
    "eTest": "const tc = calculateTotalCompensation(150000, 10, 200000, 20000); // 150k base + 15k bonus + 50k equity/yr + 20k sign-on = 235k first year\nif (tc.recurringAnnualTc !== 215000 || tc.firstYearTotalCompensation !== 235000 || tc.status !== 'TOTAL_COMPENSATION_CALCULATED_NOMINAL') throw new Error('TC calculation failed');",
    "aTitle": "Standard Tech Equity Vesting Period Years Formatter",
    "aDesc": "Implement function getStandardEquityVestingYears() returning `4`.",
    "aStarter": "function getStandardEquityVestingYears() { return 4; }",
    "aHint": "Return 4.",
    "aTest": "if (getStandardEquityVestingYears() !== 4) throw new Error('Vesting years check failed');"
  },
  {
    "day": 26,
    "title": "First 90 Days Engineering Onboarding Strategy: The 30-60-90 Day Plan",
    "desc": "Accelerate career momentum in a new role: The 30-60-90 Day Plan (Day 30: Understand architecture, set up dev environment, and ship 1 small bugfix; Day 60: Own a feature independently and contribute to code reviews; Day 90: Propose architectural improvements, lead a sprint feature, and build cross-team social capital).",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of First 90 Days Engineering Onboarding Strategy: The 30-60-90 Day Plan.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "30-60-90 Day Onboarding Milestone Tracker",
    "eDesc": "Implement function trackOnboardingMilestone(dayNumber) returning target focus objective for Day 30 (`'LEARN_AND_SHIP_BUGFIX'`), Day 60 (`'OWN_FEATURE_INDEPENDENTLY'`), or Day 90 (`'LEAD_AND_IMPROVE_ARCHITECTURE'`).",
    "eStarter": "function trackOnboardingMilestone(day) {\n  if (day <= 30) return { milestone: 'LEARN_AND_SHIP_BUGFIX', phase: 'DAYS_1_TO_30', status: 'ONBOARDING_DAY_30_NOMINAL' };\n  if (day <= 60) return { milestone: 'OWN_FEATURE_INDEPENDENTLY', phase: 'DAYS_31_TO_60', status: 'ONBOARDING_DAY_60_NOMINAL' };\n  return { milestone: 'LEAD_AND_IMPROVE_ARCHITECTURE', phase: 'DAYS_61_TO_90', status: 'ONBOARDING_DAY_90_NOMINAL' };\n}",
    "eHint": "Return milestones based on day <= 30, <= 60, > 60.",
    "eTest": "const d30 = trackOnboardingMilestone(30);\nconst d60 = trackOnboardingMilestone(60);\nconst d90 = trackOnboardingMilestone(90);\nif (d30.milestone !== 'LEARN_AND_SHIP_BUGFIX' || d60.milestone !== 'OWN_FEATURE_INDEPENDENTLY' || d90.milestone !== 'LEAD_AND_IMPROVE_ARCHITECTURE') throw new Error('Onboarding milestone tracking failed');",
    "aTitle": "Day 30 Primary Onboarding Goal Formatter",
    "aDesc": "Implement function getDay30OnboardingGoal() returning `'LEARN_AND_SHIP_BUGFIX'`.",
    "aStarter": "function getDay30OnboardingGoal() { return 'LEARN_AND_SHIP_BUGFIX'; }",
    "aHint": "Return LEARN_AND_SHIP_BUGFIX.",
    "aTest": "if (getDay30OnboardingGoal() !== 'LEARN_AND_SHIP_BUGFIX') throw new Error('Goal check failed');"
  },
  {
    "day": 27,
    "title": "Mentorship, Peer Coaching & Knowledge Sharing: Writing Team RFCs",
    "desc": "Scale your impact as a senior engineer: The \"Watch One, Do One, Teach One\" Medical Model for Developer Onboarding, Authoring RFCs (Requests for Comment) to propose technical designs asynchronously, Conducting Architecture Lunch & Learns, and Coaching Junior Engineers to solve problems independently.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Mentorship, Peer Coaching & Knowledge Sharing: Writing Team RFCs.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "RFC (Request for Comments) Proposal Structure Auditor",
    "eDesc": "Implement function auditRfcProposalStructure(rfcMarkdown) verifying that RFC includes `Summary`, `Motivation`, `Proposed Design`, and `Drawbacks/Alternatives`.",
    "eStarter": "function auditRfcProposalStructure(rfc) {\n  const hasSummary = rfc.includes('# Summary');\n  const hasMotivation = rfc.includes('# Motivation');\n  const hasDesign = rfc.includes('# Proposed Design');\n  const hasAlternatives = rfc.includes('# Alternatives');\n  const isApproved = hasSummary && hasMotivation && hasDesign && hasAlternatives;\n  return {\n    hasSummary,\n    hasMotivation,\n    hasProposedDesign: hasDesign,\n    hasAlternatives,\n    isRfcStructureCompliant: isApproved,\n    status: isApproved ? 'RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL' : 'RFC_DEFECT_MISSING_SECTIONS'\n  };\n}",
    "eHint": "Check presence of # Summary, # Motivation, # Proposed Design, # Alternatives.",
    "eTest": "const validRfc = '# Summary\\nDetails\\n# Motivation\\nWhy\\n# Proposed Design\\nHow\\n# Alternatives\\nOther options';\nconst pass = auditRfcProposalStructure(validRfc);\nconst fail = auditRfcProposalStructure('# Summary\\nJust notes');\nif (!pass.isRfcStructureCompliant || fail.isRfcStructureCompliant || pass.status !== 'RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL') throw new Error('RFC structure audit failed');",
    "aTitle": "RFC Acronym Expanded Formatter",
    "aDesc": "Implement function getRfcAcronymExpanded() returning `'Request for Comments'`.",
    "aStarter": "function getRfcAcronymExpanded() { return 'Request for Comments'; }",
    "aHint": "Return Request for Comments.",
    "aTest": "if (getRfcAcronymExpanded() !== 'Request for Comments') throw new Error('RFC expanded check failed');"
  },
  {
    "day": 28,
    "title": "Global Remote & Multi-Cultural Team Dynamics: Low-Context vs High-Context",
    "desc": "Excel in international engineering teams: Erin Meyer's Culture Map (Low-Context direct communication in US/Germany/Netherlands vs High-Context nuanced communication in Japan/India/Brazil), Navigating Time-Zone Asynchrony, Writing Inclusive & Clear English, and Building Remote Team Cohesion.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Global Remote & Multi-Cultural Team Dynamics: Low-Context vs High-Context.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Communication Context Style Matcher: High-Context vs Low-Context",
    "eDesc": "Implement function matchCulturalCommunicationStyle(cultureContextType) recommending direct documentation for `'LOW_CONTEXT'` or relationship-first alignment for `'HIGH_CONTEXT'`.",
    "eStarter": "function matchCulturalCommunicationStyle(type) {\n  if (type === 'LOW_CONTEXT') {\n    return { style: 'EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION', feedbackStyle: 'DIRECT_UPFRONT', status: 'LOW_CONTEXT_MATCHED' };\n  }\n  return { style: 'RELATIONAL_NUANCED_CONTEXT_AWARE', feedbackStyle: 'INDIRECT_DIPLOMATIC', status: 'HIGH_CONTEXT_MATCHED' };\n}",
    "eHint": "If LOW_CONTEXT return EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION.",
    "eTest": "const low = matchCulturalCommunicationStyle('LOW_CONTEXT');\nconst high = matchCulturalCommunicationStyle('HIGH_CONTEXT');\nif (low.style !== 'EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION' || high.style !== 'RELATIONAL_NUANCED_CONTEXT_AWARE') throw new Error('Cultural matching failed');",
    "aTitle": "Culture Map Author Formatter",
    "aDesc": "Implement function getCultureMapAuthor() returning `'Erin Meyer'`.",
    "aStarter": "function getCultureMapAuthor() { return 'Erin Meyer'; }",
    "aHint": "Return Erin Meyer.",
    "aTest": "if (getCultureMapAuthor() !== 'Erin Meyer') throw new Error('Author check failed');"
  },
  {
    "day": 29,
    "title": "Tech Lead & Engineering Leadership Communication: Servant Leadership Principles",
    "desc": "Step into engineering leadership: Servant Leadership Principles (Measuring your success by team output rather than individual code commits), Shielding the Team from Executive Noise, Delegating Tasks with Clear Context & Desired Outcomes, and Conducting Blameless Incident Retrospectives.",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of Tech Lead & Engineering Leadership Communication: Servant Leadership Principles.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Tech Lead Delegation & Outcome Clarity Auditor",
    "eDesc": "Implement function auditTechLeadDelegation(taskContextProvided, clearSuccessMetricDefined, psychologicalSupportOffered) certifying whether delegation aligns with servant leadership principles.",
    "eStarter": "function auditTechLeadDelegation(context, metric, support) {\n  const isApproved = context && metric && support;\n  return {\n    taskContextProvided: context,\n    clearSuccessMetricDefined: metric,\n    psychologicalSupportOffered: support,\n    isServantLeadershipCompliant: isApproved,\n    status: isApproved ? 'TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL' : 'DELEGATION_DEFECT_MICROMANAGEMENT_OR_VAGUE'\n  };\n}",
    "eHint": "Verify context, metric, and support are all true.",
    "eTest": "const pass = auditTechLeadDelegation(true, true, true);\nconst fail = auditTechLeadDelegation(true, false, true);\nif (!pass.isServantLeadershipCompliant || fail.isServantLeadershipCompliant || pass.status !== 'TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL') throw new Error('Tech lead delegation audit failed');",
    "aTitle": "Core Tech Lead Leadership Philosophy Formatter",
    "aDesc": "Implement function getTechLeadPhilosophy() returning `'Servant Leadership'`.",
    "aStarter": "function getTechLeadPhilosophy() { return 'Servant Leadership'; }",
    "aHint": "Return Servant Leadership.",
    "aTest": "if (getTechLeadPhilosophy() !== 'Servant Leadership') throw new Error('Philosophy check failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Professional Tech Communication & Executive Career Suite",
    "desc": "Final Capstone Synthesis: The complete sovereign tech communication and career acceleration master suite: 1. Written Documentation & Async Etiquette (BLUF emails, 5-section README, and No-Hello Slack hygiene); 2. Interpersonal Alignment & Feedback (SBI feedback delivery, IBR conflict resolution, and 90-second standups); 3. Executive Storytelling & Negotiation (Minto Pyramid decks, SCR crisis briefings, and ZOPA/BATNA persuasion); 4. Interview Mastery (Google X-Y-Z resume bullets, STAR behavioral responses, and RADIO system design communication); 5. Career & Leadership Acceleration (Total Compensation negotiation, 30-60-90 onboarding, team RFC authoring, and Servant Leadership).",
    "syllabus": [
      "Core Foundations: Principles and communication frameworks of 🏆 FINAL CAPSTONE: Sovereign Professional Tech Communication & Executive Career Suite.",
      "Practical Applications: Scenarios, scripts, templates, and execution workflows.",
      "Professional Best Practices: Quality benchmarks, behavioral psychology, and leadership standards."
    ],
    "eTitle": "Sovereign Tech Communication & Career Suite Orchestrator",
    "eDesc": "Implement function orchestrateTechCommMasterSuite(foundationsOk, leadershipOk, careerOk, interviewOk, scalingOk) certifying comprehensive tech communication and executive career mastery.",
    "eStarter": "function orchestrateTechCommMasterSuite(foundations, leadership, career, interview, scaling) {\n  const isCertified = foundations && leadership && career && interview && scaling;\n  return {\n    writtenAndAsyncModule: foundations,\n    interpersonalAndFeedbackModule: leadership,\n    executiveAndNegotiationModule: career,\n    interviewMasteryModule: interview,\n    careerAndLeadershipModule: scaling,\n    sovereignTechCommCertified: isCertified,\n    certified: true,\n    status: isCertified ? 'SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL' : 'TECH_COMM_MASTER_SUITE_DEFECT'\n  };\n}",
    "eHint": "Verify all 5 pillars evaluate to true.",
    "eTest": "const ok = orchestrateTechCommMasterSuite(true, true, true, true, true);\nconst fail = orchestrateTechCommMasterSuite(true, true, false, true, true);\nif (!ok.sovereignTechCommCertified || fail.sovereignTechCommCertified || !ok.certified || ok.status !== 'SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL') throw new Error('Capstone orchestrator failed');",
    "aTitle": "Tech Communication Master Certification Auditor",
    "aDesc": "Implement function auditTechCommMasterCert() returning `{ certified: true, score: '100/100', tier: 'SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED' }`.",
    "aStarter": "function auditTechCommMasterCert() { return { certified: true, score: '100/100', tier: 'SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED' }; }",
    "aHint": "Return certification object.",
    "aTest": "if (!auditTechCommMasterCert().certified) throw new Error('Capstone cert failed');"
  }
];

export const SOFT_SKILLS_30_DAYS_QUESTS: CourseQuest[] = SOFT_SKILLS_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('softskills', idx + 1, cfg)
);
