import { DayConfig } from './curriculumEnricher';

/**
 * Applied AI Engineering & Autonomous Systems (course-ai-eng, prefix: ai):
 * 30 course days covering LLM foundations, transformer attention mechanisms,
 * tokenization (BPE) & economics, structured prompting & XML guardrails,
 * few-shot in-context learning, function calling & tool use, structured JSON
 * outputs with Zod schemas, vector embeddings & cosine distance, RAG pipeline
 * architectures (chunking, semantic search), re-ranking & hybrid retrieval,
 * context window management & compression, local inference (Ollama, llama.cpp),
 * conversational memory buffers & summarization, multi-turn dialogue state,
 * autonomous agent loops (ReAct), multi-agent orchestration & supervisor patterns,
 * LangChain / LangGraph patterns, semantic caching (Redis), LLM evaluation &
 * RAGAS metrics, red teaming & prompt injection defense (jailbreaks, guardrails),
 * fine-tuning data preparation (JSONL format), LoRA parameter-efficient tuning,
 * synthetic dataset generation, streaming responses (SSE), cost & latency
 * telemetry (OpenInference, OpenTelemetry), audio & multimodal vision APIs,
 * production deployment & vLLM serving, agentic workflow automation, and
 * enterprise autonomous AI engineering capstone.
 *
 * Practice tasks are in ai30DayData.ts; lessons in aiWebLongLessons.ts.
 */
export const AI_DAYS: DayConfig[] = [
  {
    "day": 1,
    "title": "Generative AI Foundations & Transformer Self-Attention",
    "desc": "Dissect the transformer architecture, Scaled Dot-Product Attention: Query (Q), Key (K), Value (V) matrices, softmax normalization, and multi-head projection.",
    "syllabus": [
      "Transformer Mechanism: Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V.",
      "Self-Attention vs Cross-Attention in Encoder-Decoder and Decoder-Only models.",
      "Positional Encodings: RoPE (Rotary Position Embeddings) and preserving sequence order."
    ]
  },
  {
    "day": 2,
    "title": "LLM Tokenization, Byte-Pair Encoding (BPE) & Context Economics",
    "desc": "Understand Byte-Pair Encoding (BPE), vocabulary compression ratios, special tokens (`<|im_start|>`), and pricing economics per 1M tokens.",
    "syllabus": [
      "Tokenization Math: Average English word ≈ 1.33 tokens (0.75 words/token).",
      "Byte-Pair Encoding (BPE) merge rules and sub-word segmentation.",
      "Token Budget Calculator: Input token pricing vs Output token pricing."
    ]
  },
  {
    "day": 3,
    "title": "System Prompts, Personas & Guardrail Instructions",
    "desc": "Structure high-precision system instructions: explicit persona definitions, role boundaries, negative constraints, and output schema contracts.",
    "syllabus": [
      "Anatomy of Production System Prompts: Role, Scope, Tone, Constraints, Fallback.",
      "Negative Constraints: Explicitly banning forbidden actions (e.g. \"Never offer legal advice\").",
      "Delimiters & Defensive Prompting: XML tags (`<context>`, `<instructions>`) to prevent injection."
    ]
  },
  {
    "day": 4,
    "title": "Few-Shot Prompting & Chain-of-Thought (CoT) Reasoning",
    "desc": "Maximize LLM reasoning accuracy with Few-Shot exemplar formatting and Chain-of-Thought (\"Let's think step by step\") decomposition.",
    "syllabus": [
      "Zero-Shot vs Few-Shot Learning: In-context exemplars boosting accuracy by 40%+.",
      "Chain-of-Thought (CoT) & Zero-Shot CoT (\"Let's think step by step\").",
      "Self-Consistency Decoding: Sampling multiple CoT paths and taking majority vote."
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Structured JSON Outputs & Pydantic/Zod Schema Enforcement",
    "desc": "Milestone 1: Build a production-grade LLM output validator enforcing JSON schema contracts (Zod / JSON Schema mode) with automated retry correction on validation errors.",
    "syllabus": [
      "JSON Mode vs Constrained Grammar Decoding (OpenAI Structured Outputs / Instructor / Zod).",
      "Automated Self-Correction Loop: Feeding JSON parse errors back to LLM for instant recovery.",
      "Schema Validation Invariant: Guaranteeing 100% type-safe downstream database consumption."
    ]
  },
  {
    "day": 6,
    "title": "Function Calling & Tool Declaration Protocols",
    "desc": "Master LLM function calling protocols: tool definitions, JSON Schema parameters, model decision to call tools, and executing local tool handlers.",
    "syllabus": [
      "Tool Declaration Schema: `name`, `description`, `parameters.properties`, `required`.",
      "Tool Call Lifecycle: User Prompt $\\to$ LLM returns `tool_calls` $\\to$ App executes handler $\\to$ Returns `tool_result` to LLM $\\to$ Final answer.",
      "Parallel Tool Calling: Executing multiple tool invocations concurrently in 1 round trip."
    ]
  },
  {
    "day": 7,
    "title": "Text Embeddings & Vector Cosine Similarity Mathematics",
    "desc": "Transform unstructured text into 1536-dimensional semantic vectors; calculate Dot Product, Euclidean Distance, and Cosine Similarity.",
    "syllabus": [
      "Vector Embeddings: Mapping semantic meaning into high-dimensional geometric space.",
      "Cosine Similarity Formula: `dot(A, B) / (norm(A) * norm(B))` (Range: -1.0 to 1.0).",
      "Normalized Vector Optimization: For unit vectors, Cosine Similarity simplifies to pure Dot Product."
    ]
  },
  {
    "day": 8,
    "title": "Vector Databases: Indexing & Approximate Nearest Neighbors (HNSW)",
    "desc": "Scale semantic search to 100M+ vectors with Vector Databases (Chroma, Pinecone, Qdrant, pgvector) and HNSW / IVF graphs.",
    "syllabus": [
      "Exact KNN (O(N) brute force) vs Approximate Nearest Neighbors (ANN: HNSW graph search in O(log N)).",
      "Hierarchical Navigable Small World (HNSW): Multi-layer skip-list graph traversal.",
      "Metadata Filtering: Combining vector similarity with relational SQL filters (`category == 'tech'`)."
    ]
  },
  {
    "day": 9,
    "title": "Document Chunking Strategies & Overlap Math",
    "desc": "Partition enterprise documentation into semantically coherent chunks using Recursive Character, Markdown Header, and Semantic Splitting.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Document Chunking Strategies & Overlap Math.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 10,
    "title": "Naive RAG vs Hybrid Search (Dense Vectors + BM25 Sparse)",
    "desc": "Combine semantic vector embeddings with keyword-exact BM25 sparse search using Reciprocal Rank Fusion (RRF) to eliminate search blind spots.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Naive RAG vs Hybrid Search (Dense Vectors + BM25 Sparse).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 11,
    "title": "Cross-Encoder Reranking & Context Precision (Cohere Rerank)",
    "desc": "Filter and re-order vector search results with Cross-Encoder models to elevate the most relevant chunks into top context positions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cross-Encoder Reranking & Context Precision (Cohere Rerank).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 12,
    "title": "Context Compression & The 'Lost in the Middle' Invariant",
    "desc": "Mitigate LLM attention degradation (LLMs pay high attention to start and end of context, ignoring the middle) via strategic chunk placement.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Context Compression & The 'Lost in the Middle' Invariant.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 13,
    "title": "RAG Evaluation: Faithfulness, Answer Relevance & Context Recall (Ragas)",
    "desc": "Quantify RAG pipeline quality using Ragas / TruLens triad: Faithfulness (Grounded in context?), Answer Relevance, and Context Recall.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of RAG Evaluation: Faithfulness, Answer Relevance & Context Recall (Ragas).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 14,
    "title": "LLM Security: Prompt Injection & Jailbreak Defenses",
    "desc": "Harden LLM applications against direct & indirect prompt injection, DAN jailbreaks, data exfiltration, and system prompt leakage.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LLM Security: Prompt Injection & Jailbreak Defenses.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Production End-to-End Hybrid RAG Pipeline with Reranking",
    "desc": "Milestone 2: Build a production-grade enterprise RAG pipeline: Hybrid Search (Chroma vector + BM25) $\\to$ Reciprocal Rank Fusion $\\to$ Cohere Cross-Encoder Reranking $\\to$ Lost-in-the-Middle context arrangement $\\to$ Guardrail faithfulness evaluation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Production End-to-End Hybrid RAG Pipeline with Reranking.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 16,
    "title": "LLM Memory Architectures: Sliding Windows & Summary Buffers",
    "desc": "Manage multi-turn conversational context with ConversationBuffer, ConversationSummaryBufferMemory, and Entity Memory stores.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LLM Memory Architectures: Sliding Windows & Summary Buffers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 17,
    "title": "Autonomous Agents: The ReAct (Reason + Act) Pattern",
    "desc": "Build autonomous reasoning agents using the ReAct framework: interleaving Thought $\\to$ Action $\\to$ Observation $\\to$ Final Answer loops.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Autonomous Agents: The ReAct (Reason + Act) Pattern.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 18,
    "title": "Multi-Agent Collaboration: Supervisor & Swarm Architectures",
    "desc": "Coordinate specialized LLM subagents with Supervisor routing (Supervisor $\\to$ Coder / Researcher / Reviewer) and LangGraph state machines.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Multi-Agent Collaboration: Supervisor & Swarm Architectures.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 19,
    "title": "Agentic Planning: Plan-and-Solve & Reflection Self-Correction",
    "desc": "Enhance agent reliability with Plan-and-Solve (Decomposing goals into sub-tasks) and Reflection loops (Critiquing and repairing code errors).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Agentic Planning: Plan-and-Solve & Reflection Self-Correction.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 20,
    "title": "Real-Time Token Streaming with Server-Sent Events (SSE)",
    "desc": "Stream real-time LLM token chunks over HTTP using Server-Sent Events (SSE), Delta parsing (`data: {\"choices\": [{\"delta\": {\"content\": \"tok\"}}]}`), and client rendering.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Real-Time Token Streaming with Server-Sent Events (SSE).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Autonomous Multi-Agent Research Assistant with Web & Code Tools",
    "desc": "Milestone 3: Build a production autonomous research team: Supervisor Agent coordinates Search Subagent + Python Code Sandbox Subagent + Critic Agent to produce verified research reports with citations.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Autonomous Multi-Agent Research Assistant with Web & Code Tools.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 22,
    "title": "LLM Caching: Exact vs Semantic Caching with Vector DBs (GPTCache)",
    "desc": "Slash LLM latency from 2,000ms to 5ms and cut API bills by 80% using Exact Caching (Redis SHA-256) and Semantic Caching (Vector similarity threshold > 0.95).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LLM Caching: Exact vs Semantic Caching with Vector DBs (GPTCache).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 23,
    "title": "PEFT: LoRA & QLoRA Fine-Tuning Adapters",
    "desc": "Fine-tune 70B parameter open models on single consumer GPUs using Low-Rank Adaptation (LoRA: $W = W_0 + B \\times A$) and 4-bit Quantization (QLoRA).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of PEFT: LoRA & QLoRA Fine-Tuning Adapters.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 24,
    "title": "Direct Preference Optimization (DPO) & RLHF Alignment",
    "desc": "Align LLMs with human preferences without complex PPO reward models using Direct Preference Optimization (DPO loss on chosen vs rejected pairs).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Direct Preference Optimization (DPO) & RLHF Alignment.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 25,
    "title": "Open-Source LLMs: vLLM High-Throughput Serving & GGUF Quantization",
    "desc": "Deploy open models (Llama-3, Mistral, DeepSeek) with vLLM PagedAttention (20x higher throughput) and Ollama local inference.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Open-Source LLMs: vLLM High-Throughput Serving & GGUF Quantization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 26,
    "title": "Multimodal AI: Vision-Language Models & Cross-Modal Embeddings",
    "desc": "Process images, charts, and audio with Multimodal LLMs (CLIP, GPT-4o, Gemini 1.5 Pro) using visual token patches and cross-attention.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Multimodal AI: Vision-Language Models & Cross-Modal Embeddings.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 27,
    "title": "LLMOps: Token Rate Limiting & Cost Budget Allocation",
    "desc": "Enforce multi-tenant LLM rate limits using Token Bucket algorithms (TPM: Tokens Per Minute, RPM: Requests Per Minute) and monthly team cost budgets.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LLMOps: Token Rate Limiting & Cost Budget Allocation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 28,
    "title": "LLM Observability & Distributed Tracing (Langfuse / Helicone)",
    "desc": "Trace complex multi-step agent and RAG workflows with Langfuse / Helicone: prompt versioning, generation latency, token usage tracking, and user feedback scores.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of LLM Observability & Distributed Tracing (Langfuse / Helicone).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 29,
    "title": "Knowledge Graph RAG (GraphRAG) with Neo4j",
    "desc": "Overcome vector search context fragmentation using Knowledge Graph RAG (GraphRAG): extracting Entities and Relationships into Neo4j graph nodes and traversing multi-hop facts.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Knowledge Graph RAG (GraphRAG) with Neo4j.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Agentic RAG Platform with Guardrails, Semantic Caching & Multi-Tool Execution",
    "desc": "Final Capstone Synthesis: The complete production enterprise AI platform featuring Hybrid RAG (Dense + BM25), Cross-Encoder Reranking, Semantic Vector Caching, ReAct Autonomous Agents, Tool Calling, PII Redaction, and Langfuse distributed tracing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise Agentic RAG Platform with Guardrails, Semantic Caching & Multi-Tool Execution.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  }
];
