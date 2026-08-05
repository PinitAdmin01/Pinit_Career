import { buildEnrichedDayQuests } from './curriculumEnricher';
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

export const AI_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is AI, ML and Deep Learning? — The Core Concepts and the Generative AI Boom",
    desc: "Artificial Intelligence (AI) has become the most discussed technology of our time. But what actually is it? Let us break down the terminology from the outside in: (1) Artificial Intelligence (AI) is the broadest term. It refers to any computer system or program that can perform tasks that would normally require human intelligence — like playing chess, recognizing faces, or translating languages. Even simple rule-based programs (like an automated tax calculator) are technically AI. (2) Machine Learning (ML) is a subset of AI. Instead of writing rigid rules manually, you feed a computer program thousands of examples (data) and let the program learn the rules and patterns automatically. (3) Deep Learning (DL) is a subset of ML. It uses artificial neural networks (mathematical structures inspired by the human brain) with many layers to process complex data like images, audio, and text. (4) Generative AI (GenAI) is a subset of Deep Learning that can create NEW content — text, code, images, music, or videos. Large Language Models (LLMs) like ChatGPT, Claude, and Google Gemini are the engines of Generative AI. How do LLMs work? At their core, LLMs are text predictors. They are trained on massive datasets (millions of books, articles, code repositories). When you write a prompt, the model calculates the probability of every possible next word based on what it learned from its training data, and outputs the most likely word. It does this word-by-word, hundreds of times per second, to generate a response. (Real world: Tesla's self-driving cars use Deep Learning to process live video feeds from cameras and predict steering wheel angles. ChatGPT uses Generative AI to read your question and predict the next words to construct a programming tutorial.)",
    syllabus: ["AI vs ML vs Deep Learning: AI is any program mimicking human intelligence. ML is programs learning from data examples instead of hardcoded rules. Deep Learning uses multi-layered neural networks for complex patterns like image recognition.", "Generative AI: models that create new content (text, images, code). Large Language Models (LLMs) are text predictors that calculate the mathematical probability of the next word to construct complete human-like responses.", "Real-world integrations: how developers connect applications to model APIs (Gemini, Llama, OpenAI) over the internet to add translation, summarization, or chat interfaces to standard software tools."],
    eTitle: "Exam: AI Ecosystem Classifier",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: First Chatbot Setup",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "How LLMs Think — Tokenization, Context Windows and the Attention Mechanism",
    desc: "To write applications using LLMs, you must understand how these models process information internally. LLMs do not think or read like humans. Let us explore the three core limits of LLM inputs: (1) Tokenization: LLMs do not read words. They break text down into smaller chunks called TOKENS. A token can be a whole word (like 'cat'), a part of a word (like 'ing'), or a single character. On average, 1 token is about 4 characters of English text. 100 words is roughly 130 tokens. When you send a prompt, the model converts your text into a list of numbers representing these tokens before processing. (2) Context Window: the maximum number of tokens an LLM can process in a single request (including your prompt and the model's generated response combined). Think of the context window as the model's active memory. If a model has an 8,000-token context window, sending a 10,000-token document will cause the model to forget the beginning or fail entirely. (3) The Attention Mechanism: the breakthrough created in 2017 by Google researchers (the Transformer architecture). Attention allows the model to analyze every token in a prompt and determine which other tokens are most relevant to it, capturing context. (Real world: When you ask an LLM: 'The bank of the river is muddy, but the bank where I store money is safe', the attention mechanism links 'bank' in the first clause to 'river' and 'bank' in the second clause to 'money', helping the model understand the double meaning of the word.)",
    syllabus: ["Tokenization: LLMs convert words into integer tokens (approx. 4 characters per token). Emojis, spaces, and punctuation count as separate tokens. Developers use token counts to estimate API costs.", "Context Window: the memory limit of an LLM request (input + output tokens combined). Exceeding this limit causes data truncation or out-of-memory errors. Modern models have windows from 8K to 1M+ tokens.", "The Attention Mechanism: how models capture relationships between words. Calculates attention weights to focus on relevant context (e.g. mapping pronouns like 'it' back to the correct noun in a long paragraph)."],
    eTitle: "Exam: Token Counter",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Context Window Monitor",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "LLM APIs & Chat Completions: System vs User Prompts",
    desc: "Master chat completions endpoints parameters, streaming responses, and routing system, user, and assistant messages. (Real world: Application gateways construct Chat Completion messages, injecting custom system instructions to lock models into specific behaviors.)",
    syllabus: ["Formatting Chat Completions API messages structures", "Streaming responses over Server-Sent Events (SSE)", "Role separation guidelines (System, User, Assistant)"],
    eTitle: "Exam: System Prompt Constructor",
    eDesc: "Write a JS function `buildSystemPrompt(role)` returning 'You are a professional [role] assistant.'. If role is empty or null, default to 'You are a professional assistant.'.",
    eStarter: "function buildSystemPrompt(role) {\n    // Write your code here\n    \n}",
    eHint: "Check if the input is a valid string, then return a formatted prompt using templates or default fallbacks.",
    eTest: "if (typeof buildSystemPrompt !== 'function') throw new Error('Method buildSystemPrompt not found.');\nif (buildSystemPrompt('coding') !== 'You are a professional coding assistant.') throw new Error('System prompt formatting failed');\nif (buildSystemPrompt(null) !== 'You are a professional assistant.') throw new Error('Null fallback validation failed');",
    aTitle: "Assignment: Token Estimator",
    aDesc: "Write a JS function `estimateTokens(text)` returning text length divided by 4. Return 0 if text is empty or null.",
    aStarter: "function estimateTokens(text) {\n    // Write your code here\n    \n}",
    aHint: "Divide string length by 4, handling null/empty checks.",
    aTest: "if (typeof estimateTokens !== 'function') throw new Error('Method estimateTokens not found.');\nif (estimateTokens('hello') !== 1.25) throw new Error('Token estimator failed');"
  },
  {
    title: "LLM Orchestration: Model Temperature & Token limits check",
    desc: "Master API request payload controls. (Real world: Gateways restrict prompt dimensions, matching temperature scales and token boundaries before executing model queries.)",
    syllabus: ["Model generation parameters (temperature, top_p)", "Configuring max_tokens limitations", "Payload validation rules for model calls"],
    eTitle: "Exam: LLM Parameter Auditor",
    eDesc: "Write a JS function `isLlmParamAllowed(temp, tokens, limit)` returning true if temp >= 0 and temp <= 2.0 and tokens <= limit. Returns false otherwise.",
    eStarter: "function isLlmParamAllowed(temp, tokens, limit) {\n    // Write your code here\n    \n}",
    eHint: "Validate temperature limits and token limits comparison. Check positive.",
    eTest: "if (typeof isLlmParamAllowed !== 'function') throw new Error('Method isLlmParamAllowed not found');\nif (isLlmParamAllowed(0.7, 1000, 2000) !== true) throw new Error('LLM parameter check failed');",
    aTitle: "Assignment: Prompt length estimator",
    aDesc: "Write a JS function `isPromptSafe(promptText)` returning true if promptText.length <= 4000.",
    aStarter: "function isPromptSafe(promptText) {\n    // Write your code here\n    \n}",
    aHint: "Check length against 4000 boundary.",
    aTest: "if (typeof isPromptSafe !== 'function') throw new Error('Method isPromptSafe not found');"
  },
  {
    title: "Retrieval-Augmented Generation: Vector distance similarity",
    desc: "Master RAG similarity search mechanics. (Real world: Search engines compute vector distances between prompt embeddings and doc databases, fetching top semantic results.)",
    syllabus: ["RAG database pipelines architecture", "Cosine similarity vs Euclidean distance", "Structuring vector document contexts"],
    eTitle: "Exam: Euclidean Vector Distance Calculator",
    eDesc: "Write a JS function `calculateEuclideanDistance(v1, v2)` returning square root of sum of squared differences of matching elements. Return 0 if lengths mismatch.",
    eStarter: "function calculateEuclideanDistance(v1, v2) {\n    // Write your code here\n    \n}",
    eHint: "Loop indexes, summing `(v1[i] - v2[i]) * (v1[i] - v2[i])`, returning square root of totals.",
    eTest: "if (typeof calculateEuclideanDistance !== 'function') throw new Error('Method calculateEuclideanDistance not found');\nif (calculateEuclideanDistance([1, 2], [4, 6]) !== 5) throw new Error('Euclidean distance calculation failed');",
    aTitle: "Assignment: Vector threshold filter",
    aDesc: "Write a JS function `isVectorMatch(distance, maxLimit)` returning true if distance <= maxLimit.",
    aStarter: "function isVectorMatch(distance, maxLimit) {\n    // Write your code here\n    \n}",
    aHint: "Compare values.",
    aTest: "if (typeof isVectorMatch !== 'function') throw new Error('Method isVectorMatch not found');"
  },
  {
    title: "AI Agents: Tool calling & Function validation mapping",
    desc: "Master agentic function schema mappings. (Real world: Agent routers parse model outputs, matching JSON tool structures to local APIs to run commands.)",
    syllabus: ["Agent tool calling schema layouts", "Parsing JSON tool parameters", "Mapping model outputs to execution calls"],
    eTitle: "Exam: Agent Tool Schema Validator",
    eDesc: "Write a JS function `isValidToolCall(toolCall)` returning true if toolCall contains non-empty 'name' and 'arguments' object. Returns false otherwise.",
    eStarter: "function isValidToolCall(toolCall) {\n    // Write your code here\n    \n}",
    eHint: "Verify properties keys presence, validating arguments is type object. Check null.",
    eTest: "if (typeof isValidToolCall !== 'function') throw new Error('Method isValidToolCall not found');\nif (isValidToolCall({ name: 'calc', arguments: {} }) !== true) throw new Error('Tool call validation failed');",
    aTitle: "Assignment: Tool name formatter",
    aDesc: "Write a JS function `formatToolName(rawName)` returning rawName formatted to lowercase with spaces replaced by '_'.",
    aStarter: "function formatToolName(rawName) {\n    // Write your code here\n    \n}",
    aHint: "Convert to lowercase, replacing space matches.",
    aTest: "if (typeof formatToolName !== 'function') throw new Error('Method formatToolName not found');"
  },
  {
    title: "Model Evaluations: Accuracy & Hallucination rates",
    desc: "Master AI evaluation diagnostics. (Real world: Pipeline engines run tests lists, tracking accuracy ratios and hallucination indicators before deployments.)",
    syllabus: ["AI metrics (precision, recall, BLEU)", "Hallucinations detection algorithms", "Validating system model benchmarks"],
    eTitle: "Exam: Hallucination Rate Auditor",
    eDesc: "Write a JS function `isModelAccAllowed(accuracy, hallucinationRate)` returning true if accuracy >= 0.85 and hallucinationRate <= 0.05. Returns false otherwise.",
    eStarter: "function isModelAccAllowed(accuracy, hallucinationRate) {\n    // Write your code here\n    \n}",
    eHint: "Compare parameters against model metrics thresholds limits.",
    eTest: "if (typeof isModelAccAllowed !== 'function') throw new Error('Method isModelAccAllowed not found');\nif (isModelAccAllowed(0.9, 0.02) !== true) throw new Error('Model accuracy checks failed');",
    aTitle: "Assignment: Model score compiler",
    aDesc: "Write a JS function `getAccuracyPct(correct, total)` returning Math.round((correct / total) * 100).",
    aStarter: "function getAccuracyPct(correct, total) {\n    // Write your code here\n    \n}",
    aHint: "Divide correct by total, rounding output.",
    aTest: "if (typeof getAccuracyPct !== 'function') throw new Error('Method getAccuracyPct not found');"
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit",
    desc: "Perform evaluations of agent tool configurations, check RAG search similarity scoring, evaluate model parameters safety boundaries, and compile model compliance reports. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Agent tool calling schema audits", "Vector database RAG similarity validation", "Model generation bounds compliance checks"],
    eTitle: "Exam: AI Agent Compliance Auditor",
    eDesc: "Write a JS function `evaluateAgentCompliance(report)` returning true if report.toolSchemasValid === true and report.ragSimilarityPass === true and report.paramBoundsOk === true.",
    eStarter: "function evaluateAgentCompliance(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.toolSchemasValid, report.ragSimilarityPass, and report.paramBoundsOk boolean properties in report.",
    eTest: "if (typeof evaluateAgentCompliance !== 'function') throw new Error('Method evaluateAgentCompliance not found');\nconst rep = { toolSchemasValid: true, ragSimilarityPass: true, paramBoundsOk: true };\nif (evaluateAgentCompliance(rep) !== true) throw new Error('Agent compliance validation failed');",
    aTitle: "Assignment: Hallucination penalty calculator",
    aDesc: "Write a JS function `calcHallucinationPenalty(rate)` returning rate > 0.05 ? 'block_release' : 'allow_release'.",
    aStarter: "function calcHallucinationPenalty(rate) {\n    // Write your code here\n    \n}",
    aHint: "Verify rate limits.",
    aTest: "if (typeof calcHallucinationPenalty !== 'function') throw new Error('Method calcHallucinationPenalty not found');"
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: AI Integration & Model Compliance Audit (Review)",
    desc: "Review AI agent compliance audits, evaluate tool schemas configurations, check RAG vector distance bounds, and check parameters limits. (Real world: Security engineers audit LLM integrations, verifying systems protect customer data privacy.)",
    syllabus: ["Reviewing RAG database structures", "Assembling agent compliance checklists", "Verifying model safety thresholds"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const AI_30_DAYS_QUESTS = AI_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `ai-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `ai-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `ai-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `ai-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `ai-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('ai-basics', dayNum, cfg);
});
