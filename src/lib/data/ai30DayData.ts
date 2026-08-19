import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const AI_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "Generative AI Foundations & Transformer Architecture",
    desc: "Dissect self-attention mechanisms, multi-head attention, positional encoding, and transformer blocks.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Generative AI Foundations & Transformer Architecture.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Generative AI Foundations & Transformer Architecture Validation",
    eDesc: "Implement a JavaScript validation function for Generative AI Foundations & Transformer Architecture.",
    eStarter: "function aiTaskDay1(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay1 !== 'function') throw new Error('Function aiTaskDay1 not found');\nif (aiTaskDay1('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Generative AI Foundations & Transformer Architecture Practice",
    aDesc: "Write an auxiliary helper function for Generative AI Foundations & Transformer Architecture.",
    aStarter: "function aiTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "LLM Tokenization & Context Windows",
    desc: "Understand Byte-Pair Encoding (BPE), token vocabularies, context length limits, and token cost economics.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of LLM Tokenization & Context Windows.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: LLM Tokenization & Context Windows Validation",
    eDesc: "Implement a JavaScript validation function for LLM Tokenization & Context Windows.",
    eStarter: "function aiTaskDay2(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay2 !== 'function') throw new Error('Function aiTaskDay2 not found');\nif (aiTaskDay2('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: LLM Tokenization & Context Windows Practice",
    aDesc: "Write an auxiliary helper function for LLM Tokenization & Context Windows.",
    aStarter: "function aiTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "System Prompts, Personas & Role Boundaries",
    desc: "Structure high-precision system instructions with explicit persona roles, boundaries, and tone constraints.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of System Prompts, Personas & Role Boundaries.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: System Prompts, Personas & Role Boundaries Validation",
    eDesc: "Implement a JavaScript validation function for System Prompts, Personas & Role Boundaries.",
    eStarter: "function aiTaskDay3(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay3 !== 'function') throw new Error('Function aiTaskDay3 not found');\nif (aiTaskDay3('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: System Prompts, Personas & Role Boundaries Practice",
    aDesc: "Write an auxiliary helper function for System Prompts, Personas & Role Boundaries.",
    aStarter: "function aiTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Few-Shot Prompting & In-Context Learning",
    desc: "Provide canonical input-output demonstration pairs to guide model reasoning for domain-specific tasks.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Few-Shot Prompting & In-Context Learning.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Few-Shot Prompting & In-Context Learning Validation",
    eDesc: "Implement a JavaScript validation function for Few-Shot Prompting & In-Context Learning.",
    eStarter: "function aiTaskDay4(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay4 !== 'function') throw new Error('Function aiTaskDay4 not found');\nif (aiTaskDay4('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Few-Shot Prompting & In-Context Learning Practice",
    aDesc: "Write an auxiliary helper function for Few-Shot Prompting & In-Context Learning.",
    aStarter: "function aiTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Chain-of-Thought (CoT) & Step-by-Step Reasoning",
    desc: "Instruct models to break complex multi-step reasoning into sequential verifiable logic steps.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Chain-of-Thought (CoT) & Step-by-Step Reasoning.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Chain-of-Thought (CoT) & Step-by-Step Reasoning Validation",
    eDesc: "Implement a JavaScript validation function for Chain-of-Thought (CoT) & Step-by-Step Reasoning.",
    eStarter: "function aiTaskDay5(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay5 !== 'function') throw new Error('Function aiTaskDay5 not found');\nif (aiTaskDay5('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Chain-of-Thought (CoT) & Step-by-Step Reasoning Practice",
    aDesc: "Write an auxiliary helper function for Chain-of-Thought (CoT) & Step-by-Step Reasoning.",
    aStarter: "function aiTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Structured Outputs & JSON Schema Validation",
    desc: "Constrain model completions to strict, parseable JSON schemas with validated keys using regex fences.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Structured Outputs & JSON Schema Validation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Structured Outputs & JSON Schema Validation Validation",
    eDesc: "Implement a JavaScript validation function for Structured Outputs & JSON Schema Validation.",
    eStarter: "function aiTaskDay6(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay6 !== 'function') throw new Error('Function aiTaskDay6 not found');\nif (aiTaskDay6('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Structured Outputs & JSON Schema Validation Practice",
    aDesc: "Write an auxiliary helper function for Structured Outputs & JSON Schema Validation.",
    aStarter: "function aiTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Temperature, Top-P, and Sampling Parameters",
    desc: "Tune temperature for deterministic outputs (0.0) versus creative outputs (0.8) and configure Top-P sampling.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Temperature, Top-P, and Sampling Parameters.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Temperature, Top-P, and Sampling Parameters Validation",
    eDesc: "Implement a JavaScript validation function for Temperature, Top-P, and Sampling Parameters.",
    eStarter: "function aiTaskDay7(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay7 !== 'function') throw new Error('Function aiTaskDay7 not found');\nif (aiTaskDay7('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Temperature, Top-P, and Sampling Parameters Practice",
    aDesc: "Write an auxiliary helper function for Temperature, Top-P, and Sampling Parameters.",
    aStarter: "function aiTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Vector Embeddings & Semantic Similarity",
    desc: "Generate dense text embeddings, compute cosine similarities, and measure semantic distance.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Vector Embeddings & Semantic Similarity.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Vector Embeddings & Semantic Similarity Validation",
    eDesc: "Implement a JavaScript validation function for Vector Embeddings & Semantic Similarity.",
    eStarter: "function aiTaskDay8(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay8 !== 'function') throw new Error('Function aiTaskDay8 not found');\nif (aiTaskDay8('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Vector Embeddings & Semantic Similarity Practice",
    aDesc: "Write an auxiliary helper function for Vector Embeddings & Semantic Similarity.",
    aStarter: "function aiTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Vector Databases & Indexing (Pinecone / Qdrant / Chroma)",
    desc: "Store embedding vectors, configure HNSW graph indexes, and perform approximate nearest neighbor queries.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Vector Databases & Indexing (Pinecone / Qdrant / Chroma).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Vector Databases & Indexing (Pinecone / Qdrant / Chroma) Validation",
    eDesc: "Implement a JavaScript validation function for Vector Databases & Indexing (Pinecone / Qdrant / Chroma).",
    eStarter: "function aiTaskDay9(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay9 !== 'function') throw new Error('Function aiTaskDay9 not found');\nif (aiTaskDay9('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Vector Databases & Indexing (Pinecone / Qdrant / Chroma) Practice",
    aDesc: "Write an auxiliary helper function for Vector Databases & Indexing (Pinecone / Qdrant / Chroma).",
    aStarter: "function aiTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Retrieval-Augmented Generation (RAG) Pipeline",
    desc: "Build chunking, embedding, vector retrieval, and augmented context prompt injection pipelines.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Retrieval-Augmented Generation (RAG) Pipeline.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Retrieval-Augmented Generation (RAG) Pipeline Validation",
    eDesc: "Implement a JavaScript validation function for Retrieval-Augmented Generation (RAG) Pipeline.",
    eStarter: "function aiTaskDay10(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay10 !== 'function') throw new Error('Function aiTaskDay10 not found');\nif (aiTaskDay10('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Retrieval-Augmented Generation (RAG) Pipeline Practice",
    aDesc: "Write an auxiliary helper function for Retrieval-Augmented Generation (RAG) Pipeline.",
    aStarter: "function aiTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "RAG Chunking Strategies (Fixed, Recursive, Semantic)",
    desc: "Compare fixed-size token chunking against recursive syntax-aware and semantic boundary chunking.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of RAG Chunking Strategies (Fixed, Recursive, Semantic).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: RAG Chunking Strategies (Fixed, Recursive, Semantic) Validation",
    eDesc: "Implement a JavaScript validation function for RAG Chunking Strategies (Fixed, Recursive, Semantic).",
    eStarter: "function aiTaskDay11(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay11 !== 'function') throw new Error('Function aiTaskDay11 not found');\nif (aiTaskDay11('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: RAG Chunking Strategies (Fixed, Recursive, Semantic) Practice",
    aDesc: "Write an auxiliary helper function for RAG Chunking Strategies (Fixed, Recursive, Semantic).",
    aStarter: "function aiTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Hybrid Search (Dense Embeddings + BM25 Keyword)",
    desc: "Combine dense semantic embeddings with sparse BM25 keyword matching using Reciprocal Rank Fusion (RRF).",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Hybrid Search (Dense Embeddings + BM25 Keyword).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Hybrid Search (Dense Embeddings + BM25 Keyword) Validation",
    eDesc: "Implement a JavaScript validation function for Hybrid Search (Dense Embeddings + BM25 Keyword).",
    eStarter: "function aiTaskDay12(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay12 !== 'function') throw new Error('Function aiTaskDay12 not found');\nif (aiTaskDay12('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Hybrid Search (Dense Embeddings + BM25 Keyword) Practice",
    aDesc: "Write an auxiliary helper function for Hybrid Search (Dense Embeddings + BM25 Keyword).",
    aStarter: "function aiTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Re-Ranking & Context Compression in RAG",
    desc: "Apply cross-encoder re-ranking models (Cohere Rerank) to elevate high-precision chunks and compress context.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Re-Ranking & Context Compression in RAG.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Re-Ranking & Context Compression in RAG Validation",
    eDesc: "Implement a JavaScript validation function for Re-Ranking & Context Compression in RAG.",
    eStarter: "function aiTaskDay13(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay13 !== 'function') throw new Error('Function aiTaskDay13 not found');\nif (aiTaskDay13('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Re-Ranking & Context Compression in RAG Practice",
    aDesc: "Write an auxiliary helper function for Re-Ranking & Context Compression in RAG.",
    aStarter: "function aiTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Hallucination Detection & Verification Safeguards",
    desc: "Cross-examine generated assertions against source documents and implement automated fact checking.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Hallucination Detection & Verification Safeguards.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Hallucination Detection & Verification Safeguards Validation",
    eDesc: "Implement a JavaScript validation function for Hallucination Detection & Verification Safeguards.",
    eStarter: "function aiTaskDay14(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay14 !== 'function') throw new Error('Function aiTaskDay14 not found');\nif (aiTaskDay14('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Hallucination Detection & Verification Safeguards Practice",
    aDesc: "Write an auxiliary helper function for Hallucination Detection & Verification Safeguards.",
    aStarter: "function aiTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Function Calling & Dynamic Tool Integration",
    desc: "Equip LLMs with executable function declarations to query APIs, databases, and calculation engines.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Function Calling & Dynamic Tool Integration.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Function Calling & Dynamic Tool Integration Validation",
    eDesc: "Implement a JavaScript validation function for Function Calling & Dynamic Tool Integration.",
    eStarter: "function aiTaskDay15(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay15 !== 'function') throw new Error('Function aiTaskDay15 not found');\nif (aiTaskDay15('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Function Calling & Dynamic Tool Integration Practice",
    aDesc: "Write an auxiliary helper function for Function Calling & Dynamic Tool Integration.",
    aStarter: "function aiTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Autonomous ReAct Agents (Reason + Act)",
    desc: "Implement Reason + Act loops where the agent iteratively evaluates tool outputs and adjusts next actions.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Autonomous ReAct Agents (Reason + Act).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Autonomous ReAct Agents (Reason + Act) Validation",
    eDesc: "Implement a JavaScript validation function for Autonomous ReAct Agents (Reason + Act).",
    eStarter: "function aiTaskDay16(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay16 !== 'function') throw new Error('Function aiTaskDay16 not found');\nif (aiTaskDay16('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Autonomous ReAct Agents (Reason + Act) Practice",
    aDesc: "Write an auxiliary helper function for Autonomous ReAct Agents (Reason + Act).",
    aStarter: "function aiTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Multi-Agent Collaboration Graphs (LangGraph / CrewAI)",
    desc: "Orchestrate specialized agents (Researcher, Coder, Critic) in collaborative task execution graphs.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Multi-Agent Collaboration Graphs (LangGraph / CrewAI).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Multi-Agent Collaboration Graphs (LangGraph / CrewAI) Validation",
    eDesc: "Implement a JavaScript validation function for Multi-Agent Collaboration Graphs (LangGraph / CrewAI).",
    eStarter: "function aiTaskDay17(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay17 !== 'function') throw new Error('Function aiTaskDay17 not found');\nif (aiTaskDay17('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Multi-Agent Collaboration Graphs (LangGraph / CrewAI) Practice",
    aDesc: "Write an auxiliary helper function for Multi-Agent Collaboration Graphs (LangGraph / CrewAI).",
    aStarter: "function aiTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Agent Memory: Short-Term vs Long-Term Vector Memory",
    desc: "Persist conversation history buffers, extract episodic user facts, and retrieve relevant memories.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Agent Memory: Short-Term vs Long-Term Vector Memory.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Agent Memory: Short-Term vs Long-Term Vector Memory Validation",
    eDesc: "Implement a JavaScript validation function for Agent Memory: Short-Term vs Long-Term Vector Memory.",
    eStarter: "function aiTaskDay18(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay18 !== 'function') throw new Error('Function aiTaskDay18 not found');\nif (aiTaskDay18('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Agent Memory: Short-Term vs Long-Term Vector Memory Practice",
    aDesc: "Write an auxiliary helper function for Agent Memory: Short-Term vs Long-Term Vector Memory.",
    aStarter: "function aiTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Fine-Tuning Open LLMs (LoRA & QLoRA)",
    desc: "Prepare instruction datasets, apply parameter-efficient Low-Rank Adaptation (LoRA), and evaluate loss curves.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Fine-Tuning Open LLMs (LoRA & QLoRA).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Fine-Tuning Open LLMs (LoRA & QLoRA) Validation",
    eDesc: "Implement a JavaScript validation function for Fine-Tuning Open LLMs (LoRA & QLoRA).",
    eStarter: "function aiTaskDay19(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay19 !== 'function') throw new Error('Function aiTaskDay19 not found');\nif (aiTaskDay19('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Fine-Tuning Open LLMs (LoRA & QLoRA) Practice",
    aDesc: "Write an auxiliary helper function for Fine-Tuning Open LLMs (LoRA & QLoRA).",
    aStarter: "function aiTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Quantization & Local Model Inference (Ollama / vLLM)",
    desc: "Deploy 4-bit / 8-bit quantized models on local GPUs with continuous batching and PagedAttention.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Quantization & Local Model Inference (Ollama / vLLM).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Quantization & Local Model Inference (Ollama / vLLM) Validation",
    eDesc: "Implement a JavaScript validation function for Quantization & Local Model Inference (Ollama / vLLM).",
    eStarter: "function aiTaskDay20(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay20 !== 'function') throw new Error('Function aiTaskDay20 not found');\nif (aiTaskDay20('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Quantization & Local Model Inference (Ollama / vLLM) Practice",
    aDesc: "Write an auxiliary helper function for Quantization & Local Model Inference (Ollama / vLLM).",
    aStarter: "function aiTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Model Serving & High-Throughput Inference (vLLM)",
    desc: "Configure Tensor Parallelism, continuous batching, KV caching, and asynchronous ASGI streaming.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Model Serving & High-Throughput Inference (vLLM).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Model Serving & High-Throughput Inference (vLLM) Validation",
    eDesc: "Implement a JavaScript validation function for Model Serving & High-Throughput Inference (vLLM).",
    eStarter: "function aiTaskDay21(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay21 !== 'function') throw new Error('Function aiTaskDay21 not found');\nif (aiTaskDay21('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Model Serving & High-Throughput Inference (vLLM) Practice",
    aDesc: "Write an auxiliary helper function for Model Serving & High-Throughput Inference (vLLM).",
    aStarter: "function aiTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Multi-Modal AI: Vision & Image Understanding",
    desc: "Analyze architectural diagrams, UI mockups, and receipts using vision-capable multi-modal LLMs.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Multi-Modal AI: Vision & Image Understanding.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Multi-Modal AI: Vision & Image Understanding Validation",
    eDesc: "Implement a JavaScript validation function for Multi-Modal AI: Vision & Image Understanding.",
    eStarter: "function aiTaskDay22(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay22 !== 'function') throw new Error('Function aiTaskDay22 not found');\nif (aiTaskDay22('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Multi-Modal AI: Vision & Image Understanding Practice",
    aDesc: "Write an auxiliary helper function for Multi-Modal AI: Vision & Image Understanding.",
    aStarter: "function aiTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AI Voice Agents: Speech-to-Text & Neural TTS",
    desc: "Stream real-time audio through Whisper STT, process agent logic, and synthesize Kokoro neural speech.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AI Voice Agents: Speech-to-Text & Neural TTS.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AI Voice Agents: Speech-to-Text & Neural TTS Validation",
    eDesc: "Implement a JavaScript validation function for AI Voice Agents: Speech-to-Text & Neural TTS.",
    eStarter: "function aiTaskDay23(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay23 !== 'function') throw new Error('Function aiTaskDay23 not found');\nif (aiTaskDay23('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AI Voice Agents: Speech-to-Text & Neural TTS Practice",
    aDesc: "Write an auxiliary helper function for AI Voice Agents: Speech-to-Text & Neural TTS.",
    aStarter: "function aiTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AI Evaluation Benchmarks & LLM-as-a-Judge",
    desc: "Automate benchmark evaluation suites using larger evaluator models to grade accuracy, safety, and coherence.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AI Evaluation Benchmarks & LLM-as-a-Judge.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AI Evaluation Benchmarks & LLM-as-a-Judge Validation",
    eDesc: "Implement a JavaScript validation function for AI Evaluation Benchmarks & LLM-as-a-Judge.",
    eStarter: "function aiTaskDay24(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay24 !== 'function') throw new Error('Function aiTaskDay24 not found');\nif (aiTaskDay24('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AI Evaluation Benchmarks & LLM-as-a-Judge Practice",
    aDesc: "Write an auxiliary helper function for AI Evaluation Benchmarks & LLM-as-a-Judge.",
    aStarter: "function aiTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AI Safety, Red-Teaming & Prompt Injection Defense",
    desc: "Simulate adversarial jailbreak attacks, protect sensitive system prompts, and sanitize untrusted inputs.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AI Safety, Red-Teaming & Prompt Injection Defense.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AI Safety, Red-Teaming & Prompt Injection Defense Validation",
    eDesc: "Implement a JavaScript validation function for AI Safety, Red-Teaming & Prompt Injection Defense.",
    eStarter: "function aiTaskDay25(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay25 !== 'function') throw new Error('Function aiTaskDay25 not found');\nif (aiTaskDay25('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AI Safety, Red-Teaming & Prompt Injection Defense Practice",
    aDesc: "Write an auxiliary helper function for AI Safety, Red-Teaming & Prompt Injection Defense.",
    aStarter: "function aiTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AI Observability & Cost Tracking (Langfuse / Helicone)",
    desc: "Monitor token expenditures, latency distributions, trace agent step execution, and track user feedback.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AI Observability & Cost Tracking (Langfuse / Helicone).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AI Observability & Cost Tracking (Langfuse / Helicone) Validation",
    eDesc: "Implement a JavaScript validation function for AI Observability & Cost Tracking (Langfuse / Helicone).",
    eStarter: "function aiTaskDay26(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay26 !== 'function') throw new Error('Function aiTaskDay26 not found');\nif (aiTaskDay26('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AI Observability & Cost Tracking (Langfuse / Helicone) Practice",
    aDesc: "Write an auxiliary helper function for AI Observability & Cost Tracking (Langfuse / Helicone).",
    aStarter: "function aiTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Semantic Caching for LLMs (GPTCache)",
    desc: "Cache frequent prompt responses using vector similarity thresholds to eliminate latency and API costs.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Semantic Caching for LLMs (GPTCache).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Semantic Caching for LLMs (GPTCache) Validation",
    eDesc: "Implement a JavaScript validation function for Semantic Caching for LLMs (GPTCache).",
    eStarter: "function aiTaskDay27(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay27 !== 'function') throw new Error('Function aiTaskDay27 not found');\nif (aiTaskDay27('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Semantic Caching for LLMs (GPTCache) Practice",
    aDesc: "Write an auxiliary helper function for Semantic Caching for LLMs (GPTCache).",
    aStarter: "function aiTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "AI Governance, Privacy & Data Compliance",
    desc: "Implement PII scrubbing, zero-retention API policies, and audit logs for enterprise regulatory compliance.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of AI Governance, Privacy & Data Compliance.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: AI Governance, Privacy & Data Compliance Validation",
    eDesc: "Implement a JavaScript validation function for AI Governance, Privacy & Data Compliance.",
    eStarter: "function aiTaskDay28(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay28 !== 'function') throw new Error('Function aiTaskDay28 not found');\nif (aiTaskDay28('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: AI Governance, Privacy & Data Compliance Practice",
    aDesc: "Write an auxiliary helper function for AI Governance, Privacy & Data Compliance.",
    aStarter: "function aiTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Building Production Autonomous Coding Assistants",
    desc: "Assemble syntax AST parsers, workspace file tools, and multi-file code refactoring pipelines.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Building Production Autonomous Coding Assistants.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Building Production Autonomous Coding Assistants Validation",
    eDesc: "Implement a JavaScript validation function for Building Production Autonomous Coding Assistants.",
    eStarter: "function aiTaskDay29(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay29 !== 'function') throw new Error('Function aiTaskDay29 not found');\nif (aiTaskDay29('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Building Production Autonomous Coding Assistants Practice",
    aDesc: "Write an auxiliary helper function for Building Production Autonomous Coding Assistants.",
    aStarter: "function aiTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Production Autonomous AI Engineering Assistant",
    desc: "Build an end-to-end agentic coding assistant with vector RAG, tool calling, multi-agent critique, and local LLMs.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Capstone: Production Autonomous AI Engineering Assistant.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Capstone: Production Autonomous AI Engineering Assistant Validation",
    eDesc: "Implement a JavaScript validation function for Capstone: Production Autonomous AI Engineering Assistant.",
    eStarter: "function aiTaskDay30(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof aiTaskDay30 !== 'function') throw new Error('Function aiTaskDay30 not found');\nif (aiTaskDay30('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Production Autonomous AI Engineering Assistant Practice",
    aDesc: "Write an auxiliary helper function for Capstone: Production Autonomous AI Engineering Assistant.",
    aStarter: "function aiTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof aiTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const AI_30_DAYS_QUESTS = AI_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('ai', i + 1, cfg)
);
