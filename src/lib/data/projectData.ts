export interface Project {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise' | 'Future-Tech';
  description: string;
  techStack: string;
  problem: string;
  deliverable: string;
  xpReward: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  githubLink?: string;
  demoLink?: string;
  guideSteps?: string[];
  tips?: string[];
  verificationReqs?: string[];
  minScore?: number;
  verificationScore?: number;
  vivaPassed?: boolean;
  certificateType?: 'standard' | 'excellence';
  certificateId?: string;
  issueDate?: string;
}

export const GITHUB_REPO_REGEX = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

export const SWAP_POOLS: Record<string, Record<string, Partial<Project>>> = {
  'AI Engineer': {
    'Beginner': {
      name: 'AI Text Summarizer CLI',
      description: 'Build a command-line tool that extracts key sentences from documents using HuggingFace pipelines.',
      techStack: 'Python, Transformers, Click, NLTK',
      problem: 'Reading multi-page documents is time-consuming; simple regex truncation loses key context.',
      deliverable: 'CLI utility accepting text path and length parameters, outputting semantic bulleted summaries.',
      verificationReqs: ['CLI Argument Parsing', 'NLP Sentence Extraction', 'Length Threshold Controls', 'README.md Documentation'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Semantic Code Search Engine',
      description: 'Upload repositories, vector-embed functions, and search logic using natural language queries.',
      techStack: 'FastAPI, Sentence-Transformers, Qdrant, React',
      problem: 'Traditional git grep search fails when programmers use different synonyms for the same logic.',
      deliverable: 'Interactive code query console returning matching functions with similarity scores.',
      verificationReqs: ['GitHub API Hooking', 'Qdrant Indexing', 'FastAPI Query Endpoint', 'React Code View UI'],
      minScore: 80
    },
    'Advanced': {
      name: 'AI Financial Advisor Agents',
      description: 'Deploy dual-agents tracking company stock earnings call PDFs and running sentiment calculations.',
      techStack: 'CrewAI, Python, Yahoo Finance API, Streamlit',
      problem: 'Manually cross-referencing market indicators with long financial reports causes delayed transactions.',
      deliverable: 'Streamlit dashboard generating advisory reports with buy/sell recommendations.',
      verificationReqs: ['CrewAI Multi-Agent loop', 'PDF parsing scripts', 'Yahoo Finance API bindings', 'Streamlit output view'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Distributed Vector Sync Broker',
      description: 'Build a microservice pipeline synchronizing DB updates to Qdrant vector databases in real-time.',
      techStack: 'Kafka, Go, PostgreSQL, Qdrant, Docker',
      problem: 'Distributed vector writing causes inconsistent states on failures.',
      deliverable: 'Fault-tolerant sync listener reprocessing failed events from Dead Letter Queues.',
      verificationReqs: ['Kafka Consumer', 'Postgres query logs listener', 'Vector database inserts', 'Dead Letter Queue redirects'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Decentralized Federated Learning Node',
      description: 'Train local models on edge devices and aggregate weights to a central server securely.',
      techStack: 'Flower (flwr), PyTorch, gRPC, Python',
      problem: 'Centralized model training compromises private user telemetry and triggers regulatory blocks.',
      deliverable: 'Client node pipeline receiving weights, running local training steps, and returning weight differentials.',
      verificationReqs: ['gRPC client socket broker', 'Local PyTorch training steps', 'Weight differential calculus', 'Flower node handshakes'],
      minScore: 80
    }
  },
  'Cybersecurity Engineer': {
    'Beginner': {
      name: 'Secure Password Manager CLI',
      description: 'A command-line vault encrypting credential records using AES-256-GCM keys.',
      techStack: 'Python, Cryptography.io, SQLite, MasterKey Hash',
      problem: 'Keeping passwords in plaintext files makes them easy targets for basic host compromise.',
      deliverable: 'CLI utility requiring master passwords to decrypt and copy site secrets to the clipboard.',
      verificationReqs: ['AES-256-GCM encryption key generation', 'SQLite storage credentials', 'Secure memory clipboard locks', 'Password hashing verification'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Asymmetric File Encrypter Portal',
      description: 'Web dashboard allowing users to upload public keys, encrypting files client-side before storage.',
      techStack: 'React, WebCrypto API, Node.js, Express',
      problem: 'Files uploaded directly to cloud servers can be intercepted by rogue cloud admins.',
      deliverable: 'Web app executing asymmetric file encryption inside the browser runtime sandbox.',
      verificationReqs: ['Asymmetric key generation API', 'Browser-based file encryption', 'Node storage destination pathing', 'Public key metadata uploads'],
      minScore: 80
    },
    'Advanced': {
      name: 'API Rate Limiting Sentinel',
      description: 'Deploy token bucket sliding window limits to block brute force credential attacks.',
      techStack: 'Go, Redis, Lua Scripts',
      problem: 'Static IP blocks are bypassable via proxy rotation; default API libraries consume high memory under load.',
      deliverable: 'WASM edge middleware throttling request flows under heavy concurrent load.',
      verificationReqs: ['Token Bucket sliding window checks', 'Redis Lua integration', 'WASM build compatibility', 'Rate limiting status header injection'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Zero-Trust File Integrity Monitor (FIM)',
      description: 'Continuous daemon hashing critical system files and logging alerts on file modifications.',
      techStack: 'Rust, ClickHouse, Systemd Services',
      problem: 'Intruders modify system binaries (like sshd) to persist backdoor access without generating logs.',
      deliverable: 'FIM agent triggering system alerts when cryptographic hashes differ from baseline configs.',
      verificationReqs: ['Rust System filesystem listener', 'Cryptographic hashing algorithm calculations', 'ClickHouse logger updates', 'FIM alerts dashboard panel'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Post-Quantum Encrypted Vault',
      description: 'Secure credentials vault signed with Kyber algorithm keys to withstand quantum computing decryption.',
      techStack: 'Rust, PQClean, WebAssembly',
      problem: 'Standard RSA/ECC vault encryptions can be cracked by future quantum algorithms.',
      deliverable: 'Kyber-signed vault library storing data in local files.',
      verificationReqs: ['PQClean Kyber-1024 encryption keys', 'Rust file system encryption modules', 'WASM build parameters', 'README file integration'],
      minScore: 80
    }
  },
  'Backend Engineer': {
    'Beginner': {
      name: 'Static Blog Markdown Parser',
      description: 'High-performance parser converting markdown directories to pre-rendered HTML static sites.',
      techStack: 'Go, Goldmark, HTML Templates',
      problem: 'Dynamic blog databases add database load and slow down client initial page rendering speeds.',
      deliverable: 'Static site builder creating optimized HTML layouts.',
      verificationReqs: ['Markdown metadata header parser', 'Go HTML template bindings', 'Static directory file writing modules', 'Site rendering benchmark checks'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Distributed Task Queue Broker',
      description: 'Task queuing system managing job retries, prioritization, and concurrent execution pools.',
      techStack: 'Go, Redis, JSON RPC',
      problem: 'Running long-running background tasks inside HTTP request threads locks web servers.',
      deliverable: 'Task worker processing jobs in order of priority.',
      verificationReqs: ['Go concurrent goroutine processing pools', 'Redis message queue ingestion', 'Job retry and fallback logs', 'Task priority evaluation algorithms'],
      minScore: 80
    },
    'Advanced': {
      name: 'P2P WebRTC Signaling Gateway',
      description: 'Signaling server coordinating real-time WebRTC connections and connection channels.',
      techStack: 'Node.js, WebSockets, Redis Adapter',
      problem: 'Direct Peer-to-Peer calls fail if servers cannot reliably route peer candidate information.',
      deliverable: 'WebSocket gateway managing room state and peer handshakes.',
      verificationReqs: ['WebSocket room connection router', 'STUN/TURN candidate JSON message forwarding', 'Redis pub/sub channel state tracking', 'Connection teardown cleanup listeners'],
      minScore: 80
    },
    'Enterprise': {
      name: 'High-Throughput Order Matching Engine',
      description: 'Low-latency financial order book matching buy/sell bids with price-time priority queues.',
      techStack: 'C++, Lock-free Lockers, Memory Mapped Files',
      problem: 'Traditional relational database locks create bottleneck bottlenecks on trade execution.',
      deliverable: 'Order matching engine processing trades in microsecond timeframes.',
      verificationReqs: ['Double-ended order book queue structure', 'Price-Time priority matching algorithm', 'Lock-free atomic memory state handlers', 'Execution confirmation event dispatcher'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Autonomous Micro-Transaction State Mesh',
      description: 'Layer-2 payment mesh executing instant state channel transitions across edge nodes.',
      techStack: 'Rust, WASM, Tokio, RocksDB',
      problem: 'Main-chain blockchain transaction costs prevent micro-payments for web API calls.',
      deliverable: 'Node mesh routing payment state channels offline with periodic zero-knowledge rollups.',
      verificationReqs: ['Tokio async network listeners', 'RocksDB state channel storage', 'Off-chain signature validation', 'ZK-rollup state proof verifiers'],
      minScore: 80
    }
  }
};

export function getGuideStepsForProject(name: string, goal: string = 'AI Engineer') {
  const defaultData = {
    steps: [
      'Initialize your repository and set up your local development environment.',
      'Implement the foundational data schemas and REST API endpoints.',
      'Integrate authentication, configuration files, and database queries.',
      'Construct the user interface or CLI handlers to interact with your backend.',
      'Write end-to-end integration tests and publish your code to GitHub.'
    ],
    tips: [
      'Keep your commits atomic and write clear, concise commit messages.',
      'Ensure all environment variables are loaded via `.env.example` templates.',
      'Include a detailed `README.md` with system architecture diagrams.'
    ],
    reqs: [
      'Git repository with clean commit history',
      'Environment variable configuration template (`.env.example`)',
      'Comprehensive `README.md` documentation',
      'Automated unit/integration test suite passing'
    ],
    minScore: 80
  };

  const projectGuides: Record<string, { steps: string[]; tips: string[]; reqs: string[]; minScore: number }> = {
    'AI Resume Analyzer': {
      steps: [
        'Set up a Python environment with `pdfplumber` and `spacy` or `transformers`.',
        'Build a text extraction module to parse PDF and DOCX resume files into structured text.',
        'Implement TF-IDF or cosine similarity matching between resume skills and Job Description keywords.',
        'Create a scoring algorithm that rates ATS match percentage and highlights missing hard skills.',
        'Build a minimal Streamlit or React frontend to upload resumes and render match reports.'
      ],
      tips: [
        'Handle multi-column PDF layouts cleanly by sorting text blocks by vertical coordinates.',
        'Normalize skill strings (e.g., "React.js" -> "React", "NodeJS" -> "Node.js") for accurate matching.'
      ],
      reqs: ['PDF Text Parser', 'Keyword Similarity Calculation', 'ATS Score Generator', 'Missing Skills Output', 'Interactive UI/CLI'],
      minScore: 80
    },
    'RAG Knowledge-Base Chatbot': {
      steps: [
        'Choose a vector store (Qdrant, ChromaDB, or Pinecone) and initialize an index.',
        'Build a document ingestion pipeline to chunk markdown/PDF files into 500-token chunks with overlap.',
        'Generate embeddings using OpenAI embeddings or SentenceTransformers (`all-MiniLM-L6-v2`).',
        'Construct a retrieval API query endpoint that performs similarity search on user questions.',
        'Pass retrieved context chunks into an LLM prompt and stream the grounded answer to the user.'
      ],
      tips: [
        'Use semantic chunking instead of naive character counts for better context retrieval.',
        'Implement fallback prompts when vector similarity scores drop below 0.7.'
      ],
      reqs: ['Document Ingestion Pipeline', 'Vector Store Indexing', 'Context Retrieval Engine', 'LLM Prompt Builder', 'Streaming Chat UI'],
      minScore: 80
    },
    'Argon2 Authentication Portal': {
      steps: [
        'Set up a Node.js/Go backend with support for Argon2id password hashing.',
        'Create database schemas for User profiles, session tokens, and refresh tokens.',
        'Build `/register` and `/login` endpoints with rate-limiting and input sanitization.',
        'Implement short-lived JWT access tokens alongside HTTP-only secure refresh cookies.',
        'Add a React login frontend with password strength meters and CSRF token protection.'
      ],
      tips: [
        'Tune Argon2id memory cost and time cost parameters to balance security and server latency.',
        'Never store raw password strings anywhere in memory or logs during authentication.'
      ],
      reqs: ['Argon2id Password Hashing', 'JWT Access & Refresh Strategy', 'Rate Limiting Middleware', 'CSRF Protection', 'React Auth UI'],
      minScore: 80
    },
    'Payment Webhook Broker': {
      steps: [
        'Create a lightweight web server (Go or Node.js) with endpoints for receiving webhooks.',
        'Implement cryptographic signature verification (HMAC-SHA256) for incoming payload headers.',
        'Set up a background worker queue (Redis / BullMQ) to process event webhooks asynchronously.',
        'Build idempotency key checks to prevent duplicate charge processing on webhook retries.',
        'Create a dashboard view displaying incoming webhook statuses, retry logs, and failure alerts.'
      ],
      tips: [
        'Always return a 200 OK fast response to the payment gateway before starting heavy processing.',
        'Use exponential backoff timing for webhook retry attempts.'
      ],
      reqs: ['HMAC Signature Validation', 'Asynchronous Task Queue', 'Idempotency Key Verification', 'Retry Logic Handler', 'Dashboard Logs UI'],
      minScore: 80
    }
  };

  return projectGuides[name] || defaultData;
}
