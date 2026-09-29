export interface CourseNote {
  courseId: string;
  courseTitle: string;
  category: string;
  summary: string;
  realWorldAnalogy: string;
  keyConcepts: {
    heading: string;
    explanation: string;
    codeOrExample?: string;
  }[];
  cheatsheet: string[];
  commonPitfalls: string[];
  interviewPrep: {
    question: string;
    answer: string;
  }[];
}

export const COURSE_NOTES_REGISTRY: Record<string, CourseNote> = {
  'course-python-backend': {
    courseId: 'course-python-backend',
    courseTitle: 'Python Foundations & Data Structures',
    category: 'Backend & Data Science',
    summary: 'Master core Python syntax, dynamic typing, control flow, functions, dictionaries, list comprehensions, and object-oriented paradigms from zero.',
    realWorldAnalogy: 'Think of Python like a universal Swiss Army Knife. Functions are pre-sharpened tools, dictionaries are labeled toolboxes, and modules are specialized toolboxes you snap on demand.',
    keyConcepts: [
      {
        heading: '1. Variables & Dynamic Type Allocation',
        explanation: 'Python automatically assigns object types in memory at runtime without explicit type declarations.',
        codeOrExample: 'user_count = 500  # int\nprice_usd = 19.99  # float\nis_active = True   # bool'
      },
      {
        heading: '2. Functions & Variable Scope (`def`)',
        explanation: 'Functions encapsulate reusable logic block calls. Local variables inside functions expire when execution returns.',
        codeOrExample: 'def calculate_total(subtotal, tax_rate=0.05):\n    return subtotal * (1 + tax_rate)'
      },
      {
        heading: '3. Hash Maps & Dictionaries (`dict`)',
        explanation: 'Dictionaries map unique keys to values for instant O(1) time complexity lookups.',
        codeOrExample: 'user_session = {"user_id": 984, "role": "admin", "token": "xyz_123"}\nprint(user_session["role"]) # "admin"'
      }
    ],
    cheatsheet: [
      'List Comprehension: [x*2 for x in numbers if x > 0]',
      'Dict Lookup: dict.get(key, default_value)',
      'Tuple Unpacking: x, y = (10, 20)',
      'String Formatting: f"Hello {name}, balance: {amount:.2f}"'
    ],
    commonPitfalls: [
      'Mutating a list while iterating over it (creates skipped elements).',
      'Using mutable default arguments in functions (`def append_to(element, target=[])`).',
      'Confusing equality (`==`) with identity (`is`).'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between a List and a Tuple in Python?',
        answer: 'Lists are mutable (modifiable) surrounded by square brackets `[]`. Tuples are immutable (read-only) surrounded by parentheses `()` and take less memory.'
      },
      {
        question: 'How does Python handle memory management?',
        answer: 'Python uses private heap memory managed by reference counting and an automatic Garbage Collector for detecting reference cycles.'
      }
    ]
  },

  'course-java-logic': {
    courseId: 'course-java-logic',
    courseTitle: 'Java 21 Core Logic & OOP Principles',
    category: 'Enterprise Software',
    summary: 'Master Java 21 fundamentals, strongly typed class compilation, JVM memory zones (Stack vs Heap), and object-oriented encapsulation.',
    realWorldAnalogy: 'Think of Java like an industrial manufacturing facility. Classes are precise steel stamping dies, interfaces are universal power sockets, and the JVM is the climate-controlled facility floor.',
    keyConcepts: [
      {
        heading: '1. Strong Typing & Primitive Boundaries',
        explanation: 'Java enforces compile-time type safety preventing runtime type corruption.',
        codeOrExample: 'int studentCount = 42;\ndouble tuitionUsd = 12500.50;\nboolean isEnrolled = true;'
      },
      {
        heading: '2. Classes, Objects & Encapsulation',
        explanation: 'Encapsulate private instance variables behind public getter and setter accessors.',
        codeOrExample: 'public class Student {\n  private String name;\n  public Student(String name) { this.name = name; }\n  public String getName() { return this.name; }\n}'
      },
      {
        heading: '3. Interfaces & Polymorphic Contracts',
        explanation: 'Decouple business logic implementations using contract-driven interfaces.',
        codeOrExample: 'public interface PaymentGateway {\n  boolean processPayment(double amount);\n}'
      }
    ],
    cheatsheet: [
      'Compile Java: javac Main.java',
      'Run Bytecode: java Main',
      'String Comparison: str1.equals(str2) (Never use == for strings)',
      'List Initialization: List<String> list = new ArrayList<>();'
    ],
    commonPitfalls: [
      'NullPointerException caused by accessing uninitialized reference objects.',
      'Using == instead of .equals() for object content comparisons.',
      'Failing to close database or file I/O streams.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between JVM, JRE, and JDK?',
        answer: 'JDK is the development kit containing compiler and tools. JRE provides runtime libraries. JVM is the engine executing compiled bytecode.'
      },
      {
        question: 'Why is String immutable in Java?',
        answer: 'Strings are immutable for security, thread-safety, caching in the String Constant Pool, and hashcode caching in HashMaps.'
      }
    ]
  },

  'course-fullstack-js': {
    courseId: 'course-fullstack-js',
    courseTitle: 'Full-Stack JavaScript & Node.js Architecture',
    category: 'Web Engineering',
    summary: 'End-to-end JavaScript architecture spanning asynchronous event loops, Express/Next.js API routing, REST/GraphQL design, and database persistence.',
    realWorldAnalogy: 'Think of Full-Stack JS like a modern restaurant where the front-of-house waiter (React), order carousel (Node event loop), and kitchen pantry (Database) all communicate in the exact same language (JavaScript/JSON).',
    keyConcepts: [
      {
        heading: '1. Asynchronous Event Loop & Promises',
        explanation: 'Node.js processes millions of I/O events on a single thread using libuv event loops and non-blocking worker pools.',
        codeOrExample: 'async function fetchUserData(userId) {\n  const res = await db.users.findUnique({ where: { id: userId } });\n  return res;\n}'
      },
      {
        heading: '2. Express / Next.js API Routes',
        explanation: 'Expose deterministic REST endpoints that parse HTTP requests and stream JSON responses.',
        codeOrExample: 'app.post("/api/checkout", async (req, res) => {\n  const { cartId } = req.body;\n  res.json({ success: true, orderId: "ord_99" });\n});'
      },
      {
        heading: '3. Relational ORM Mapping (Prisma)',
        explanation: 'Type-safe database transactions and relational schema migrations with Prisma.',
        codeOrExample: 'const user = await prisma.user.create({\n  data: { email: "dev@career.os", name: "Dev" }\n});'
      }
    ],
    cheatsheet: [
      'Async/Await: const data = await promiseFn();',
      'Destructuring: const { id, title } = item;',
      'Array Transform: arr.map(x => x * 2).filter(Boolean);',
      'JSON Stringify: JSON.stringify(payload, null, 2);'
    ],
    commonPitfalls: [
      'Blocking the Node.js event loop with CPU-heavy synchronous computation (like synchronous crypto or infinite while loops).',
      'Unhandled promise rejections causing ungraceful process crashes in production.',
      'SQL injection or unescaped query parameters in raw SQL queries.'
    ],
    interviewPrep: [
      {
        question: 'Explain how the Node.js Event Loop works.',
        answer: 'Node.js uses a single-threaded event loop that delegates async I/O tasks (file, network, timers) to the OS kernel or libuv worker threads, executing callbacks in structured phases: Timers, I/O Polling, Check (setImmediate), and Close callbacks.'
      }
    ]
  },

  'course-ai-eng': {
    courseId: 'course-ai-eng',
    courseTitle: 'AI Engineering & LLM Integration',
    category: 'Artificial Intelligence',
    summary: 'Production AI systems engineering covering prompt orchestration, RAG architectures, vector embeddings, function calling, and deterministic evaluation.',
    realWorldAnalogy: 'Think of an LLM as an ultra-smart consultant with vast knowledge who needs a clear briefing memo (System Prompt), reference library cards (Vector RAG), and authorized phone lines (Function Calling Tools) to complete enterprise tasks.',
    keyConcepts: [
      {
        heading: '1. Retrieval-Augmented Generation (RAG)',
        explanation: 'Index proprietary enterprise documents into high-dimensional vector embeddings to augment prompt contexts with semantic search.',
        codeOrExample: 'const queryVector = await getEmbeddings(userQuery);\nconst relevantChunks = await vectorStore.similaritySearch(queryVector, { topK: 3 });'
      },
      {
        heading: '2. Structured Function Calling',
        explanation: 'Force LLMs to produce schema-valid JSON function call arguments for deterministic execution.',
        codeOrExample: 'const tools = [{\n  type: "function",\n  function: { name: "bookFlight", parameters: { type: "object", properties: { city: { type: "string" } } } }\n}];'
      },
      {
        heading: '3. Temperature & Nucleus Sampling',
        explanation: 'Control creativity vs determinism: temperature=0 for deterministic JSON extraction; temperature=0.7 for creative writing.',
        codeOrExample: 'const completion = await openai.chat.completions.create({\n  model: "gpt-4o",\n  temperature: 0.1,\n  messages: [{ role: "user", content: prompt }]\n});'
      }
    ],
    cheatsheet: [
      'RAG Formula: Raw Prompt + Retrieved Context + Grounding Guardrails = Reliable Output',
      'Vector Distance: Cosine Similarity = dot(A, B) / (||A|| * ||B||)',
      'Deterministic Output: Set temperature=0 and provide explicit JSON schema',
      'Chunking Strategy: 512 tokens with 10% overlap for high semantic recall'
    ],
    commonPitfalls: [
      'Sending unbounded user prompt inputs directly to LLMs without sanitization (prompt injection risk).',
      'Failing to validate LLM JSON output against a Zod schema before database insertion.',
      'Exceeding model context window token limits during massive document summarization.'
    ],
    interviewPrep: [
      {
        question: 'What is RAG and why is it preferred over fine-tuning for domain knowledge?',
        answer: 'RAG retrieves real-time, authoritative facts from vector databases at inference time, preventing hallucinations without costly GPU retraining, and allows instant updates whenever source data changes.'
      }
    ]
  },

  'course-ai-python': {
    courseId: 'course-ai-python',
    courseTitle: 'AI Engineering in Python',
    category: 'Artificial Intelligence',
    summary: 'Production AI systems engineering in Python: prompt orchestration, structured output with Pydantic, function calling, embeddings, RAG, agents and evaluation.',
    realWorldAnalogy: 'Think of an LLM as an ultra-smart consultant with vast knowledge who needs a clear briefing memo (System Prompt), reference library cards (Vector RAG), and authorized phone lines (Function Calling Tools) to complete enterprise tasks.',
    keyConcepts: [
      {
        heading: '1. Retrieval-Augmented Generation (RAG)',
        explanation: 'Index proprietary enterprise documents into high-dimensional vector embeddings to augment prompt contexts with semantic search.',
        codeOrExample: 'query_vector = embed(user_query)\nrelevant_chunks = vector_store.similarity_search(query_vector, k=3)'
      },
      {
        heading: '2. Structured Function Calling',
        explanation: 'Force LLMs to produce schema-valid JSON function call arguments for deterministic execution.',
        codeOrExample: "tools = [{\n    'type': 'function',\n    'function': {'name': 'book_flight', 'parameters': {'type': 'object', 'properties': {'city': {'type': 'string'}}}},\n}]"
      },
      {
        heading: '3. Temperature & Nucleus Sampling',
        explanation: 'Control creativity vs determinism: temperature=0 for deterministic JSON extraction; temperature=0.7 for creative writing.',
        codeOrExample: "completion = client.chat.completions.create(\n    model='gpt-4o',\n    temperature=0.1,\n    messages=[{'role': 'user', 'content': prompt}],\n)"
      }
    ],
    cheatsheet: [
      'RAG Formula: Raw Prompt + Retrieved Context + Grounding Guardrails = Reliable Output',
      'Vector Distance: Cosine Similarity = dot(A, B) / (||A|| * ||B||)',
      'Deterministic Output: Set temperature=0 and validate with a Pydantic model',
      'Chunking Strategy: 512 tokens with 10% overlap for high semantic recall'
    ],
    commonPitfalls: [
      'Sending unbounded user prompt inputs directly to LLMs without sanitization (prompt injection risk).',
      'Failing to validate LLM JSON output against a Pydantic model before database insertion.',
      'Exceeding model context window token limits during massive document summarization.'
    ],
    interviewPrep: [
      {
        question: 'What is RAG and why is it preferred over fine-tuning for domain knowledge?',
        answer: 'RAG retrieves real-time, authoritative facts from vector databases at inference time, preventing hallucinations without costly GPU retraining, and allows instant updates whenever source data changes.'
      }
    ]
  },

  'course-computer-fundamentals': {
    courseId: 'course-computer-fundamentals',
    courseTitle: 'Computer Literacy, Digital Productivity & OS Fundamentals',
    category: 'Foundational Systems',
    summary: 'Universal computing foundations covering OS process architectures, file systems, terminal CLI mastery, networking fundamentals, and digital security hygiene.',
    realWorldAnalogy: 'Think of an Operating System like a city government. The CPU is the mayor making decisions, RAM is the temporary work desk, SSD is the city archives, and the Kernel is the police ensuring programs do not crash into each other.',
    keyConcepts: [
      {
        heading: '1. File System Tree & Absolute vs Relative Paths',
        explanation: 'All modern operating systems organize files hierarchically from root (`/` or `C:\\`).',
        codeOrExample: '# CLI Navigation:\ncd /var/log\npwd\nls -la'
      },
      {
        heading: '2. Process Lifecycle & Resource Allocation',
        explanation: 'Every executing program is a Process with a unique PID, allocated virtual memory space, and OS threads.',
        codeOrExample: '# Inspect running processes:\nps aux | grep node\nkill -9 <PID>'
      },
      {
        heading: '3. IP Addresses, DNS & Port Multiplexing',
        explanation: 'DNS resolves human domains to IP addresses. Ports route packets to specific applications (e.g. 80=HTTP, 443=HTTPS, 5432=Postgres).',
        codeOrExample: 'curl -I https://career-os.com\nnetstat -tuln'
      }
    ],
    cheatsheet: [
      'List Files: ls -la / dir',
      'Create Directory: mkdir -p path/to/folder',
      'Network Ping: ping -c 4 8.8.8.8',
      'View Disk Space: df -h'
    ],
    commonPitfalls: [
      'Hardcoding absolute local file paths (e.g. `C:\\Users\\john\\`) that fail in Linux production servers.',
      'Running commands with elevated root/admin privileges unnecessarily.',
      'Leaving default database or SSH ports unauthenticated on public IP addresses.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between a Process and a Thread?',
        answer: 'A Process is an isolated program execution unit with its own private address space. A Thread is a lightweight sub-execution flow inside a process that shares memory with sibling threads.'
      }
    ]
  },

  'course-digital-accounting': {
    courseId: 'course-digital-accounting',
    courseTitle: 'Digital Accounting & Taxation (B.Com / BBA)',
    category: 'Finance & Accounting',
    summary: 'University-grade digital accounting covering double-entry bookkeeping, Tally Prime ERP, GST compliance, input tax credit reconciliation, and corporate balance sheet preparation.',
    realWorldAnalogy: 'Think of double-entry accounting like Newton third law of motion: every financial action has an equal and opposite reaction. For every rupee entering your business asset column, there is an exact corresponding credit to income or liability.',
    keyConcepts: [
      {
        heading: '1. The Golden Rules of Accounting',
        explanation: 'Debit what comes in / Credit what goes out (Real). Debit the receiver / Credit the giver (Personal). Debit expenses & losses / Credit income & gains (Nominal).',
        codeOrExample: '// Journal Entry: Paid Office Rent ₹25,000 via Bank\nDebit: Rent Expense Account (Nominal)  ₹25,000\nCredit: Bank Account (Asset/Real)     ₹25,000'
      },
      {
        heading: '2. GST Framework & Input Tax Credit (ITC)',
        explanation: 'Goods and Services Tax (GST) is a destination-based consumption tax. Businesses offset GST paid on purchases (ITC) against GST collected on sales.',
        codeOrExample: 'Net GST Payable = Output GST Collected - Eligible Input Tax Credit (ITC)'
      },
      {
        heading: '3. Three Core Financial Statements',
        explanation: 'Balance Sheet (Financial position at a point in time: Assets = Liabilities + Equity), P&L (Profitability over a period), and Cash Flow Statement.',
        codeOrExample: 'Assets (₹10,00,000) = Liabilities (₹4,00,000) + Shareholder Equity (₹6,00,000)'
      }
    ],
    cheatsheet: [
      'Accounting Equation: Assets = Liabilities + Equity',
      'Working Capital: Current Assets - Current Liabilities',
      'GST Rates: 0%, 5%, 12%, 18%, 28%',
      'Bank Reconciliation: Cash Book Balance adjusted against Bank Passbook'
    ],
    commonPitfalls: [
      'Claiming Input Tax Credit (ITC) without verified vendor invoice matching on GSTR-2B.',
      'Treating capital expenditures (buying machinery) as operational revenue expenses.',
      'Failing to record non-cash depreciation entries before calculating net corporate profit.'
    ],
    interviewPrep: [
      {
        question: 'Explain the difference between Accrual Accounting and Cash Accounting.',
        answer: 'Cash accounting records revenue and expenses only when physical cash changes hands. Accrual accounting records transactions when earned or incurred regardless of cash settlement, which is required by GAAP and IFRS standards.'
      }
    ]
  },

  'course-devops-cicd': {
    courseId: 'course-devops-cicd',
    courseTitle: 'DevOps & CI/CD Pipeline Automation',
    category: 'Cloud & Infrastructure',
    summary: 'Industrial CI/CD pipeline automation covering Docker multi-stage containerization, GitHub Actions runners, Kubernetes pod orchestration, and zero-downtime blue-green deployments.',
    realWorldAnalogy: 'Think of DevOps like an automated assembly line in an aircraft plant. Instead of mechanics manually testing bolts on the runway, automated robotic rigs run thousands of stress tests on every wing segment before it ever flies.',
    keyConcepts: [
      {
        heading: '1. Multi-Stage Docker Builds',
        explanation: 'Compile application binaries in a heavyweight builder image, then copy only the stripped runtime binary into a minimal scratch image.',
        codeOrExample: 'FROM golang:1.22 AS builder\nWORKDIR /app\nCOPY . .\nRUN CGO_ENABLED=0 go build -o server\n\nFROM alpine:3.19\nCOPY --from=builder /app/server /server\nCMD ["/server"]'
      },
      {
        heading: '2. GitHub Actions CI Pipeline Matrix',
        explanation: 'Automate linting, unit tests, and container image builds on every pull request before merging to main.',
        codeOrExample: 'name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test'
      },
      {
        heading: '3. Kubernetes Deployment & Pod Auto-Scaling',
        explanation: 'Declare desired state with declarative YAML specifications that automatically heal crashed pods and scale with traffic.',
        codeOrExample: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-service\nspec:\n  replicas: 3'
      }
    ],
    cheatsheet: [
      'Build Docker Image: docker build -t app:v1 .',
      'Run Container: docker run -d -p 8080:8080 app:v1',
      'Kubectl Pods: kubectl get pods -n production',
      'Check Container Logs: docker logs -f <container_id>'
    ],
    commonPitfalls: [
      'Hardcoding API keys or secret credentials directly inside Dockerfiles.',
      'Building massive multi-gigabyte Docker images by neglecting `.dockerignore`.',
      'Running production containers as the `root` administrative user.'
    ],
    interviewPrep: [
      {
        question: 'What is the main benefit of Containerization over Traditional Virtual Machines?',
        answer: 'Containers share the host operating system kernel, making them lightweight (megabytes vs gigabytes) and bootable in milliseconds, whereas VMs require guest OS overhead.'
      }
    ]
  },

  'course-react-web': {
    courseId: 'course-react-web',
    courseTitle: 'Full-Stack React Web Development',
    category: 'Frontend Engineering',
    summary: 'Deep dive into JSX, functional components, hooks, custom state managers, virtual DOM reconciliation, and Server-Side Rendering (SSR).',
    realWorldAnalogy: 'Think of React like high-tech modular Lego blocks powered by unidirectional electricity. Components are reusable plastic blocks, props flow downward like current, and state powers internal motors that re-render automatically.',
    keyConcepts: [
      {
        heading: '1. Virtual DOM Reconciliation & Fiber',
        explanation: 'React compares virtual DOM trees in memory using diffing algorithms to commit minimal batch updates to the real DOM.',
        codeOrExample: 'const element = <h1 className="title">Hello World</h1>;'
      },
      {
        heading: '2. React Hooks (`useState`, `useEffect`, `useMemo`)',
        explanation: 'Hooks let functional components manage local state, execute lifecycle side-effects, and memoize expensive computations.',
        codeOrExample: 'const [count, setCount] = useState(0);\nconst doubled = useMemo(() => count * 2, [count]);'
      },
      {
        heading: '3. React Server Components (RSC) & Streaming SSR',
        explanation: 'Server components fetch data on the server with zero client JavaScript bundle impact, streaming UI to the browser progressively.',
        codeOrExample: 'export default async function UserPage({ params }) {\n  const user = await db.user.findUnique({ where: { id: params.id } });\n  return <div><h1>{user.name}</h1></div>;\n}'
      }
    ],
    cheatsheet: [
      'State Hook: const [state, setState] = useState(initialVal);',
      'Effect Hook: useEffect(() => { return () => cleanup(); }, [deps]);',
      'Context Consumer: const theme = useContext(ThemeContext);',
      'Custom Hook: function useDebounce(value, delay) { ... }'
    ],
    commonPitfalls: [
      'Mutating state directly instead of using setter functions (e.g. `state.count = 5`).',
      'Omitting dependencies in `useEffect` dependency arrays causing stale closures.',
      'Using array index as React `key` prop on lists with dynamic reordering.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between React Server Components (RSC) and Client Components?',
        answer: 'Server Components execute exclusively on the server, have direct database access, and ship zero JavaScript bundle to the browser. Client Components execute in the browser to handle interactivity, event listeners, and browser state hooks.'
      }
    ]
  },

  'course-cloud-native': {
    courseId: 'course-cloud-native',
    courseTitle: 'Cloud Native Architectures (AWS)',
    category: 'Cloud & Infrastructure',
    summary: 'Explore Amazon Web Services, EC2 clusters, serverless Lambda, microservice routers, API gateways, S3 storage buckets, and IAM security.',
    realWorldAnalogy: 'Think of Cloud Native AWS like a municipal power grid. Instead of maintaining an expensive diesel generator in your backyard (on-prem servers), you plug into regional substations and pay only for the exact kilowatt-hours consumed.',
    keyConcepts: [
      {
        heading: '1. IAM Least Privilege & Role Assumption',
        explanation: 'Enforce zero-trust access controls by granting services IAM Roles with temporary STS credentials rather than long-lived keys.',
        codeOrExample: '{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject"],\n    "Resource": "arn:aws:s3:::company-bucket/*"\n  }]\n}'
      },
      {
        heading: '2. Serverless Event-Driven Architectures',
        explanation: 'Trigger stateless Lambda compute functions from S3 uploads, SQS message queues, or API Gateway HTTP requests.',
        codeOrExample: 'export const handler = async (event) => {\n  const record = event.Records[0];\n  return { statusCode: 200, body: JSON.stringify({ processed: record.messageId }) };\n};'
      },
      {
        heading: '3. VPC Subnets & Multi-AZ High Availability',
        explanation: 'Isolate database instances in private subnets behind NAT Gateways across multiple Availability Zones to ensure 99.99% uptime.',
        codeOrExample: '# Public Subnet: Internet Gateway -> ALB\n# Private Subnet: Backend ECS/Lambda -> RDS Database'
      }
    ],
    cheatsheet: [
      'AWS S3 CLI: aws s3 sync ./dist s3://my-prod-bucket',
      'Lambda Invocation: aws lambda invoke --function-name MyFunction out.json',
      'CloudWatch Logs: aws logs tail /aws/lambda/MyFunction --follow',
      'Storage Classes: S3 Standard -> S3 Infrequent Access -> S3 Glacier'
    ],
    commonPitfalls: [
      'Leaving S3 buckets publicly readable without bucket policies or block public access enabled.',
      'Placing databases directly in public subnets with public IP addresses.',
      'Unbounded Lambda concurrency consuming all RDS database connection pools.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between horizontal scaling and vertical scaling in AWS?',
        answer: 'Vertical scaling upgrades the compute capacity (CPU, RAM) of a single instance (e.g. t3.micro to m5.2xlarge). Horizontal scaling provisions additional instance replicas in an Auto Scaling Group behind an Application Load Balancer.'
      }
    ]
  },

  'course-cloud-python': {
    courseId: 'course-cloud-python',
    courseTitle: 'Cloud Engineering in Python (AWS)',
    category: 'Cloud & Infrastructure',
    summary: 'Build on Amazon Web Services with Python: VPCs, IAM policies, EC2 auto scaling, load balancers, S3, Lambda, DynamoDB, RDS, SQS/SNS/EventBridge, Terraform, CloudWatch, KMS, WAF, FinOps and disaster recovery.',
    realWorldAnalogy: 'Think of Cloud Native AWS like a municipal power grid. Instead of maintaining an expensive diesel generator in your backyard (on-prem servers), you plug into regional substations and pay only for the exact kilowatt-hours consumed.',
    keyConcepts: [
      {
        heading: '1. IAM Least Privilege & Role Assumption',
        explanation: 'Enforce zero-trust access controls by granting services IAM Roles with temporary STS credentials rather than long-lived keys.',
        codeOrExample: '{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject"],\n    "Resource": "arn:aws:s3:::company-bucket/*"\n  }]\n}'
      },
      {
        heading: '2. Serverless Event-Driven Architectures',
        explanation: 'Trigger stateless Lambda compute functions from S3 uploads, SQS message queues, or API Gateway HTTP requests.',
        codeOrExample: "import json\n\ndef handler(event, context):\n    record = event['Records'][0]\n    return {'statusCode': 200, 'body': json.dumps({'processed': record['messageId']})}"
      },
      {
        heading: '3. VPC Subnets & Multi-AZ High Availability',
        explanation: 'Isolate database instances in private subnets behind NAT Gateways across multiple Availability Zones to ensure 99.99% uptime.',
        codeOrExample: '# Public Subnet: Internet Gateway -> ALB\n# Private Subnet: Backend ECS/Lambda -> RDS Database'
      }
    ],
    cheatsheet: [
      'AWS S3 CLI: aws s3 sync ./dist s3://my-prod-bucket',
      'Lambda Invocation: aws lambda invoke --function-name MyFunction out.json',
      'CloudWatch Logs: aws logs tail /aws/lambda/MyFunction --follow',
      'Storage Classes: S3 Standard -> S3 Infrequent Access -> S3 Glacier'
    ],
    commonPitfalls: [
      'Leaving S3 buckets publicly readable without bucket policies or block public access enabled.',
      'Placing databases directly in public subnets with public IP addresses.',
      'Unbounded Lambda concurrency consuming all RDS database connection pools.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between horizontal scaling and vertical scaling in AWS?',
        answer: 'Vertical scaling upgrades the compute capacity (CPU, RAM) of a single instance (e.g. t3.micro to m5.2xlarge). Horizontal scaling provisions additional instance replicas in an Auto Scaling Group behind an Application Load Balancer.'
      }
    ]
  },

  'course-design-systems': {
    courseId: 'course-design-systems',
    courseTitle: 'UI/UX Design Systems & Visual Frontend',
    category: 'Frontend & UI/UX',
    summary: 'Create scalable design systems, typography grids, atomic components, CSS design tokens, WCAG accessibility standards, and responsive layouts.',
    realWorldAnalogy: 'Think of a Design System like a standardized architectural construction catalog. Every architect on the project builds from the exact same standardized bricks, window dimensions, and color palettes so the entire university campus looks cohesive.',
    keyConcepts: [
      {
        heading: '1. Design Tokens Architecture',
        explanation: 'Abstract visual design values (colors, spacing, typography scales) into platform-agnostic token variables.',
        codeOrExample: ':root {\n  --color-primary-500: #6366f1;\n  --space-4: 1rem;\n  --font-display: "Inter", sans-serif;\n}'
      },
      {
        heading: '2. Atomic Design Methodology',
        explanation: 'Compose UI from Atoms (buttons, inputs) into Molecules (search bars) into Organisms (navigation headers) and Templates.',
        codeOrExample: '// Atom: <Icon />, <Badge />\n// Molecule: <SearchBar input={<Input />} button={<Button />} />\n// Organism: <TopNavbar />'
      },
      {
        heading: '3. WCAG 2.1 AA Accessibility Standards',
        explanation: 'Ensure high color contrast ratios (minimum 4.5:1), keyboard focus indicators, and semantic ARIA landmark roles.',
        codeOrExample: '<button aria-label="Close dialog" aria-expanded="false" className="btn-close">\n  <span aria-hidden="true">&times;</span>\n</button>'
      }
    ],
    cheatsheet: [
      'Spacing Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px',
      'Text Contrast: 4.5:1 for normal body text, 3:1 for large headers',
      'CSS Clamp: font-size: clamp(1rem, 2.5vw, 2rem);',
      'Focus Visible: :focus-visible { outline: 2px solid var(--accent); }'
    ],
    commonPitfalls: [
      'Hardcoding arbitrary pixel values (e.g. `margin: 17px`) rather than using standard token spacing scales.',
      'Removing focus outlines (`outline: none`) without providing an accessible alternative for keyboard users.',
      'Using low-contrast light grey text on white backgrounds that fails accessibility audits.'
    ],
    interviewPrep: [
      {
        question: 'What are Design Tokens and why are they fundamental to enterprise design systems?',
        answer: 'Design tokens are single-source-of-truth variables storing visual design values that sync automatically across Figma, CSS/Tailwind, iOS Swift, and Android XML, ensuring brand consistency across all platforms.'
      }
    ]
  },

  'course-dsa-optim': {
    courseId: 'course-dsa-optim',
    courseTitle: 'Data Structures & Algorithmic Optimizations',
    category: 'Computer Science Core',
    summary: 'Optimize logic space-time complexity. Study binary trees, hash tables, graph traversals, dynamic programming, and amortized Big-O performance.',
    realWorldAnalogy: 'Think of Data Structures & Algorithms like a GPS Navigation Engine. Instead of blindly driving down every dead-end street (brute force O(N!)), the navigation algorithm uses graph heuristics (A* / Dijkstra) to calculate the absolute optimal highway route.',
    keyConcepts: [
      {
        heading: '1. Big-O Space-Time Complexity Analysis',
        explanation: 'Measure asymptotic growth rates: O(1) constant, O(log N) logarithmic, O(N) linear, O(N log N) linearithmic, and O(N^2) quadratic.',
        codeOrExample: '// Binary Search: O(log N) time, O(1) space\nlet left = 0, right = arr.length - 1;\nwhile (left <= right) {\n  const mid = (left + right) >> 1;\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) left = mid + 1; else right = mid - 1;\n}'
      },
      {
        heading: '2. Non-Linear Structures: Trees & Graphs',
        explanation: 'Traverse hierarchically linked data structures using Breadth-First Search (queue) and Depth-First Search (stack/recursion).',
        codeOrExample: 'function dfs(node, visited = new Set()) {\n  if (!node || visited.has(node.id)) return;\n  visited.add(node.id);\n  node.neighbors.forEach(n => dfs(n, visited));\n}'
      },
      {
        heading: '3. Dynamic Programming & Memoization',
        explanation: 'Break complex recursive problems into overlapping subproblems, caching results to convert exponential time O(2^N) to polynomial time O(N).',
        codeOrExample: 'const memo = new Map();\nfunction fib(n) {\n  if (n <= 1) return n;\n  if (!memo.has(n)) memo.set(n, fib(n - 1) + fib(n - 2));\n  return memo.get(n);\n}'
      }
    ],
    cheatsheet: [
      'HashMap Lookup: O(1) average, O(N) worst case',
      'Binary Search Tree: O(log N) balanced, O(N) unbalanced',
      'QuickSort / MergeSort: O(N log N) average',
      'Two Pointers Technique: Find pairs in sorted arrays in O(N) time'
    ],
    commonPitfalls: [
      'Uncontrolled recursion leading to StackOverflowError due to missing base cases.',
      'Confusing worst-case complexity with average-case complexity in hash maps.',
      'Allocating nested arrays inside tight inner loops causing memory bloat.'
    ],
    interviewPrep: [
      {
        question: 'When would you choose an Array over a LinkedList, and vice versa?',
        answer: 'Arrays provide O(1) random index access and superior CPU cache locality due to contiguous memory. LinkedLists provide O(1) insertions/deletions at known nodes without reallocation overhead but require O(N) traversal.'
      }
    ]
  },

  'course-dsa-python': {
    courseId: 'course-dsa-python',
    courseTitle: 'Data Structures & Algorithms in Python',
    category: 'Computer Science Core',
    summary: 'The DSA course in Python: Big-O, lists, linked lists, stacks, queues, hash maps (dict), trees, heaps (heapq), graphs and dynamic programming.',
    realWorldAnalogy: 'Think of Data Structures & Algorithms like a GPS Navigation Engine. Instead of blindly driving down every dead-end street (brute force O(N!)), the navigation algorithm uses graph heuristics (A* / Dijkstra) to calculate the absolute optimal highway route.',
    keyConcepts: [
      {
        heading: '1. Big-O Space-Time Complexity Analysis',
        explanation: 'Measure asymptotic growth rates: O(1) constant, O(log N) logarithmic, O(N) linear, O(N log N) linearithmic, and O(N^2) quadratic.',
        codeOrExample: '# Binary Search: O(log N) time, O(1) space\nleft, right = 0, len(arr) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if arr[mid] == target:\n        return mid\n    if arr[mid] < target:\n        left = mid + 1\n    else:\n        right = mid - 1'
      },
      {
        heading: '2. Non-Linear Structures: Trees & Graphs',
        explanation: 'Traverse hierarchically linked data structures using Breadth-First Search (collections.deque as a queue) and Depth-First Search (a list as a stack, or recursion).',
        codeOrExample: 'def dfs(node, visited=None):\n    visited = visited if visited is not None else set()\n    if node is None or node.id in visited:\n        return\n    visited.add(node.id)\n    for n in node.neighbors:\n        dfs(n, visited)'
      },
      {
        heading: '3. Dynamic Programming & Memoization',
        explanation: 'Break complex recursive problems into overlapping subproblems, caching results to convert exponential time O(2^N) to polynomial time O(N).',
        codeOrExample: 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)'
      }
    ],
    cheatsheet: [
      'dict / set lookup: O(1) average, O(N) worst case',
      'list.append and list.pop(): O(1); list.pop(0) and list.insert(0, x): O(N), so use collections.deque',
      'heapq.heappush / heapq.heappop: O(log N) (a min-heap)',
      'sorted() / list.sort(): O(N log N)'
    ],
    commonPitfalls: [
      'Recursion without a base case hits RecursionError (Python stops at about 1000 levels).',
      'Using a mutable default argument (def f(x=[])): the same list is shared between calls.',
      'Using list.pop(0) as a queue, which makes BFS O(N^2) instead of O(N).'
    ],
    interviewPrep: [
      {
        question: 'When would you choose a list over a linked list, and vice versa?',
        answer: 'A Python list gives O(1) index access and appends at the end, and its items sit together in memory. A linked list gives O(1) insertions and deletions at a node you already hold, without shifting items, but finding a node takes O(N).'
      }
    ]
  },

  'course-mobile-dev': {
    courseId: 'course-mobile-dev',
    courseTitle: 'Mobile Application Development',
    category: 'Mobile Engineering',
    summary: 'Build cross-platform mobile apps with React Native, touch gestures, hardware device APIs, offline SQLite synchronization, and app store deployment.',
    realWorldAnalogy: 'Think of Mobile Development like designing an astronaut pocket communicator. It must operate flawlessly with one thumb, survive intermittent signal drops underground (offline cache), and sip battery power with extreme frugality.',
    keyConcepts: [
      {
        heading: '1. React Native Fabric & New Architecture',
        explanation: 'Direct C++ JSI (JavaScript Interface) invocation replaces the legacy asynchronous JSON serialization bridge for 60 FPS rendering.',
        codeOrExample: 'import { View, Text, StyleSheet, Pressable } from "react-native";\n\nexport const Card = ({ title, onPress }) => (\n  <Pressable onPress={onPress} style={styles.card}>\n    <Text style={styles.title}>{title}</Text>\n  </Pressable>\n);'
      },
      {
        heading: '2. Offline-First SQLite Synchronization',
        explanation: 'Store app data in an on-device SQLite database, queuing mutation operations until network connectivity resumes.',
        codeOrExample: 'const db = SQLite.openDatabase("career.db");\ndb.transaction(tx => {\n  tx.executeSql("INSERT INTO local_sync_queue (payload) VALUES (?)", [payload]);\n});'
      },
      {
        heading: '3. Device Hardware Sensors & Permissions',
        explanation: 'Request operating system permission grants to access device GPS geolocation, camera feeds, and push notification tokens.',
        codeOrExample: 'const { status } = await Location.requestForegroundPermissionsAsync();\nif (status === "granted") {\n  const location = await Location.getCurrentPositionAsync({});\n}'
      }
    ],
    cheatsheet: [
      'React Native Styles: StyleSheet.create({ container: { flex: 1 } })',
      'Safe Area Handling: <SafeAreaView style={{ flex: 1 }}>',
      'Device Platform Check: Platform.OS === "ios" ? 44 : 56',
      'Hermes Engine: High-performance pre-compiled bytecode execution'
    ],
    commonPitfalls: [
      'Rendering un-virtualized large lists using ScrollView instead of FlatList (causing massive memory leaks).',
      'Triggering heavy UI re-renders on every minor touch gesture without using native driver animations.',
      'Failing to handle Android back button hardware events gracefully.'
    ],
    interviewPrep: [
      {
        question: 'Why should you use FlatList instead of ScrollView for large data sets in React Native?',
        answer: 'ScrollView renders all items in memory simultaneously regardless of visibility. FlatList virtualizes list items, rendering only items within the active viewport window and recycling off-screen views to preserve memory.'
      }
    ]
  },

  'course-cybersecurity': {
    courseId: 'course-cybersecurity',
    courseTitle: 'Cybersecurity Principles & Secure Systems',
    category: 'Information Security',
    summary: 'Protect code against OWASP Top 10 vulnerabilities, SQL injection, Cross-Site Scripting (XSS), CSRF attacks, cryptographic hashing, and Zero-Trust access control.',
    realWorldAnalogy: 'Think of Cybersecurity like a high-security international bullion vault. You do not just put a lock on the front door; you employ biometric multi-factor authentication, tamper-evident seals, encrypted courier manifests, and assume any single barrier can be breached.',
    keyConcepts: [
      {
        heading: '1. OWASP Top 10 Defense: SQLi & XSS',
        explanation: 'Never trust user input. Use parameterized SQL statements to stop SQLi, and escape rendered HTML to neutralize XSS attacks.',
        codeOrExample: '// Vulnerable: db.query(`SELECT * FROM users WHERE name = "${userInput}"`)\n// Secure Parameterized Query:\ndb.query("SELECT * FROM users WHERE name = $1", [userInput]);'
      },
      {
        heading: '2. Cryptographic Salted Password Hashing',
        explanation: 'Store passwords using slow, compute-intensive cryptographic hashing functions (Argon2id or bcrypt) with random salts to defeat rainbow tables.',
        codeOrExample: 'import bcrypt from "bcrypt";\nconst saltRounds = 12;\nconst hash = await bcrypt.hash(rawPassword, saltRounds);\nconst match = await bcrypt.compare(attemptPassword, hash);'
      },
      {
        heading: '3. Zero-Trust Architecture & OAuth2/JWT Tokens',
        explanation: 'Never verify trust based on internal network perimeter. Authenticate and authorize every single HTTP request using signed cryptographic tokens.',
        codeOrExample: 'const token = jwt.sign({ sub: userId, role: "auditor" }, privateKey, { algorithm: "RS256", expiresIn: "15m" });'
      }
    ],
    cheatsheet: [
      'SQLi Prevention: Parameterized queries & prepared statements only',
      'XSS Prevention: Content-Security-Policy (CSP) headers & output encoding',
      'Cookie Security: Set HttpOnly, Secure, and SameSite=Strict flags',
      'Principle of Least Privilege: Grant only the minimum permissions required'
    ],
    commonPitfalls: [
      'Storing user passwords in plain text or using obsolete hash functions like MD5 or SHA-1.',
      'Exposing internal database primary keys directly in URLs without IDOR authorization checks.',
      'Committing `.env` files with secret API credentials into public git repositories.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between Symmetric and Asymmetric encryption?',
        answer: 'Symmetric encryption (like AES-256) uses the exact same secret key to encrypt and decrypt data, making it ultra-fast for bulk data. Asymmetric encryption (like RSA/ECC) uses a public key for encryption and a distinct private key for decryption, making it ideal for key exchange and digital signatures.'
      }
    ]
  },

  'course-database-eng': {
    courseId: 'course-database-eng',
    courseTitle: 'Database Engineering & Query Performance',
    category: 'Database & Storage Systems',
    summary: 'Optimize relational indexes, query execution pathways, database isolation modes, replication models, Write-Ahead Logging (WAL), and transaction safety.',
    realWorldAnalogy: 'Think of Database Engineering like a national archive repository. Having 100 million documents in filing cabinets is useless if librarians must flip through every folder page-by-page. A B-Tree index is like an immaculate Dewey decimal system that points to the exact drawer in 3 hops.',
    keyConcepts: [
      {
        heading: '1. B-Tree Index Internals & Execution Plans',
        explanation: 'Relational databases navigate self-balancing B+ Trees to reduce disk I/O lookups from O(N) table scans to O(log N) index seeks.',
        codeOrExample: 'EXPLAIN ANALYZE\nSELECT id, customer_id, total_usd\nFROM orders\nWHERE customer_id = 984 AND status = "completed";'
      },
      {
        heading: '2. ACID Guarantees & Transaction Isolation Levels',
        explanation: 'Ensure Atomicity, Consistency, Isolation, and Durability. Balance isolation levels (Read Committed vs Repeatable Read vs Serializable) against locking contention.',
        codeOrExample: 'BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nUPDATE accounts SET balance = balance - 1000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 1000 WHERE id = 2;\nCOMMIT;'
      },
      {
        heading: '3. Database Connection Pooling & MVCC',
        explanation: 'Multi-Version Concurrency Control (MVCC) lets readers read older snapshots without blocking concurrent writers, while connection pools prevent process exhaustion.',
        codeOrExample: 'CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);'
      }
    ],
    cheatsheet: [
      'Explain Query: EXPLAIN (ANALYZE, BUFFERS) SELECT ...',
      'Composite Index Rule: Equality columns first, range columns last',
      'Prevent Table Scans: Avoid leading wildcards (`WHERE name LIKE "%abc"`)',
      'Connection Pool Formula: connections = ((core_count * 2) + effective_spindle_count)'
    ],
    commonPitfalls: [
      'Creating indexes indiscriminately on every column, causing massive write penalty on INSERTs and UPDATEs.',
      'Selecting all columns (`SELECT *`) instead of only needed attributes, forcing full table reads instead of index-only scans.',
      'Running unbounded batch DELETE queries that lock millions of rows and blow out the transaction log.'
    ],
    interviewPrep: [
      {
        question: 'What is the N+1 query problem and how do you resolve it?',
        answer: 'The N+1 query problem occurs when an application executes 1 initial query to fetch N parent records, and then executes N separate individual queries to fetch children for each record. It is resolved using SQL JOINs or ORM eager loading (e.g. `include` / `preload`).'
      }
    ]
  },

  'course-distributed-sys': {
    courseId: 'course-distributed-sys',
    courseTitle: 'High-Scale Distributed System Design',
    category: 'Systems Architecture',
    summary: 'Design systems carrying millions of transactions. Cover load distribution routers, key-value caches, CAP theorem, consensus protocols, and partition tolerance models.',
    realWorldAnalogy: 'Think of a Distributed System like a global diplomatic alliance. When an embassy in Tokyo receives a treaty update, it must broadcast it to London and Washington. If the Pacific undersea cable gets severed (network partition), the alliance must decide whether to continue trading with slightly outdated notes (Availability) or freeze trades until the cable is fixed (Consistency).',
    keyConcepts: [
      {
        heading: '1. CAP Theorem & PACELC Tradeoffs',
        explanation: 'In the presence of network Partitioning (P), you must choose between Consistency (C) and Availability (A). If no partition (Else), choose between Latency (L) and Consistency (C).',
        codeOrExample: '// CP System: ZooKeeper, etcd (Strict consensus, rejects writes if quorum lost)\n// AP System: Cassandra, DynamoDB (Always accepts writes, resolves conflicts eventually)'
      },
      {
        heading: '2. Distributed Consensus (Raft Protocol)',
        explanation: 'Nodes elect a Leader through randomized heartbeats and replicate log entries across a majority quorum (N/2 + 1) before committing state.',
        codeOrExample: 'Quorum Requirement: For cluster size N=5, Quorum = (5 / 2) + 1 = 3 nodes.'
      },
      {
        heading: '3. Resiliency Patterns: Circuit Breakers & Idempotency',
        explanation: 'Prevent cascading system crashes using Circuit Breakers that fail fast when downstream services degrade, and enforce Idempotency Keys on mutations.',
        codeOrExample: '// HTTP Header on payment requests:\nIdempotency-Key: "req_unique_guid_84920"'
      }
    ],
    cheatsheet: [
      'Consistent Hashing: Distributes data across dynamically changing server rings',
      'Idempotent Operation: f(f(x)) = f(x) (Safe to retry multiple times)',
      'Exponential Backoff: wait = min(max_wait, base * 2 ^ attempt) + jitter',
      'Gossip Protocol: Decentralized peer-to-peer heartbeat state dissemination'
    ],
    commonPitfalls: [
      'Assuming network calls are instantaneous and 100% reliable (Fallacies of Distributed Computing).',
      'Retrying failed API requests simultaneously without randomized jitter, creating thundering herd stampedes.',
      'Relying on physical machine clock synchronization (`System.currentTimeMillis()`) to order events instead of logical Lamport/Vector clocks.'
    ],
    interviewPrep: [
      {
        question: 'Explain the difference between Strong Consistency and Eventual Consistency.',
        answer: 'Strong consistency guarantees that any read operation will immediately return the latest written value across all nodes, sacrificing latency. Eventual consistency guarantees that if no new updates are made, all replicas will eventually converge to the same value, optimizing for high write availability and ultra-low latency.'
      }
    ]
  },

  'course-distributed-python': {
    courseId: 'course-distributed-python',
    courseTitle: 'Distributed Systems in Python',
    category: 'Systems Architecture',
    summary: 'Design systems carrying millions of transactions, in Python: retries with backoff, consistent hashing, fencing-token locks, Raft consensus, sagas, idempotent queues, CRDTs, sharding and circuit breakers.',
    realWorldAnalogy: 'Think of a Distributed System like a global diplomatic alliance. When an embassy in Tokyo receives a treaty update, it must broadcast it to London and Washington. If the Pacific undersea cable gets severed (network partition), the alliance must decide whether to continue trading with slightly outdated notes (Availability) or freeze trades until the cable is fixed (Consistency).',
    keyConcepts: [
      {
        heading: '1. CAP Theorem & PACELC Tradeoffs',
        explanation: 'In the presence of network Partitioning (P), you must choose between Consistency (C) and Availability (A). If no partition (Else), choose between Latency (L) and Consistency (C).',
        codeOrExample: '# CP system: ZooKeeper, etcd (strict consensus, rejects writes if quorum lost)\n# AP system: Cassandra, DynamoDB (always accepts writes, resolves conflicts eventually)'
      },
      {
        heading: '2. Distributed Consensus (Raft Protocol)',
        explanation: 'Nodes elect a Leader through randomized heartbeats and replicate log entries across a majority quorum (N/2 + 1) before committing state.',
        codeOrExample: 'def quorum(cluster_size):\n    return cluster_size // 2 + 1\n\nquorum(5)  # 3 nodes'
      },
      {
        heading: '3. Resiliency Patterns: Circuit Breakers & Idempotency',
        explanation: 'Prevent cascading system crashes using Circuit Breakers that fail fast when downstream services degrade, and enforce Idempotency Keys on mutations.',
        codeOrExample: "headers = {'Idempotency-Key': 'req_unique_guid_84920'}  # safe to retry the payment"
      }
    ],
    cheatsheet: [
      'Consistent Hashing: Distributes data across dynamically changing server rings (bisect for the lookup)',
      'Idempotent Operation: f(f(x)) = f(x) (Safe to retry multiple times)',
      'Exponential Backoff: wait = min(max_wait, base * 2 ** attempt) + jitter',
      'Gossip Protocol: Decentralized peer-to-peer heartbeat state dissemination'
    ],
    commonPitfalls: [
      'Assuming network calls are instantaneous and 100% reliable (Fallacies of Distributed Computing).',
      'Retrying failed API calls all at once without random jitter, creating thundering herd stampedes.',
      'Ordering events by wall-clock time (time.time()) on different machines instead of logical Lamport/Vector clocks.'
    ],
    interviewPrep: [
      {
        question: 'Explain the difference between Strong Consistency and Eventual Consistency.',
        answer: 'Strong consistency guarantees that any read operation will immediately return the latest written value across all nodes, sacrificing latency. Eventual consistency guarantees that if no new updates are made, all replicas will eventually converge to the same value, optimizing for high write availability and ultra-low latency.'
      }
    ]
  },

  'course-iot-embedded': {
    courseId: 'course-iot-embedded',
    courseTitle: 'IoT, Firmware & Embedded Systems',
    category: 'Hardware & Embedded Systems',
    summary: 'Develop embedded microcontroller firmware, configure analog sensor ADC conversions, structure MQTT telemetry payloads, and optimize RTOS task schedulers.',
    realWorldAnalogy: 'Think of an Embedded System like a spacecraft probe orbiting Mars. It has no keyboard or monitor, tiny battery reserves, and must wake up for 50 milliseconds, measure temperature, broadcast a radio telemetry packet, and sleep for 10 minutes without ever crashing.',
    keyConcepts: [
      {
        heading: '1. Memory-Mapped Hardware Registers & GPIO Control',
        explanation: 'Microcontrollers control physical pins and internal peripherals by reading and writing to specific 32-bit hardware register addresses.',
        codeOrExample: '#define GPIOA_ODR *((volatile uint32_t*)0x40020014)\n// Turn ON Pin 5:\nGPIOA_ODR |= (1 << 5);'
      },
      {
        heading: '2. FreeRTOS Preemptive Task Scheduling',
        explanation: 'Manage concurrent hardware sensing, communications, and power states using real-time kernel priority queues and semaphores.',
        codeOrExample: 'void vTelemetryTask(void *pvParameters) {\n  for(;;) {\n    float temp = read_sensor_adc();\n    vTaskDelay(pdMS_TO_TICKS(1000));\n  }\n}'
      },
      {
        heading: '3. MQTT Telemetry Protocol & QoS Levels',
        explanation: 'Lightweight publish/subscribe protocol designed for constrained networks with minimal header overhead and configurable Quality of Service (QoS 0, 1, 2).',
        codeOrExample: 'client.publish("factory/sensor_01/temperature", payload, 1);'
      }
    ],
    cheatsheet: [
      'ADC Conversion: Voltage = (ADC_Value / Max_ADC_Resolution) * Vref',
      'I2C Protocol: Two-wire bidirectional serial bus (SDA: Data, SCL: Clock)',
      'SPI Protocol: High-speed four-wire bus (MOSI, MISO, SCK, CS)',
      'Watchdog Timer (WDT): Automatically resets system if main firmware loop hangs'
    ],
    commonPitfalls: [
      'Executing slow blocking operations (like delays or memory allocations) inside Interrupt Service Routines (ISRs).',
      'Neglecting the `volatile` keyword on variables shared between interrupts and main loops.',
      'Floating GPIO input pins that pick up ambient electromagnetic noise without pull-up or pull-down resistors.'
    ],
    interviewPrep: [
      {
        question: 'Why is the volatile keyword required in embedded C?',
        answer: 'The volatile keyword tells the C compiler that a variable can be modified at any time by hardware outside the program control (e.g. an interrupt or hardware register), preventing the compiler from dangerously optimizing away repeated reads into CPU registers.'
      }
    ]
  },

  'course-3d-graphics': {
    courseId: 'course-3d-graphics',
    courseTitle: '3D Interactive Graphics & Avatar Animation',
    category: 'Computer Graphics',
    summary: 'Structure WebGL renderer canvas, calculate perspective projection matrices, rig bone joints skinning weights, and map morph targets blendshapes.',
    realWorldAnalogy: 'Think of 3D Graphics like an automated holographic film studio. The 3D scene is a physical stage with wireframe puppets (polygonal meshes), motion actors inside the puppets (skeletal bone rigs), studio spotlights (shaders), and a high-speed camera rendering 60 frames per second.',
    keyConcepts: [
      {
        heading: '1. The WebGL Graphics Pipeline',
        explanation: '3D vertex coordinates pass through Vertex Shaders (transforming 3D space to 2D screen clip space), rasterization, and Fragment Shaders (calculating pixel colors).',
        codeOrExample: '// Vertex Shader (GLSL):\nattribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}'
      },
      {
        heading: '2. Skeletal Mesh Rigging & Skinning Weights',
        explanation: 'Bind vertex meshes to hierarchical skeleton joints using blend weights so moving an elbow joint smoothly deforms the forearm skin.',
        codeOrExample: 'skinnedMesh.bind(skeleton, mesh.matrixWorld);'
      },
      {
        heading: '3. Morph Targets & Facial Blendshapes',
        explanation: 'Animate lifelike speech and facial expressions by interpolating between base face geometry and target expression shapes.',
        codeOrExample: 'avatarMesh.morphTargetInfluences[smileIndex] = 0.85;'
      }
    ],
    cheatsheet: [
      'Renderer Initialization: const renderer = new THREE.WebGLRenderer({ antialias: true })',
      'Camera Perspective: new THREE.PerspectiveCamera(fov, aspect, near, far)',
      'Vector Rotation: Quaternion representation prevents Gimbal Lock',
      'Draw Call Optimization: Batch similar geometries to reduce CPU-to-GPU overhead'
    ],
    commonPitfalls: [
      'Creating new materials, textures, or geometries inside the 60 FPS animation loop without disposing old ones (causing GPU VRAM memory leaks).',
      'Using Euler angle rotations for 3D orbital cameras resulting in Gimbal Lock.',
      'Neglecting Frustum Culling on complex scenes, forcing the GPU to render invisible off-screen triangles.'
    ],
    interviewPrep: [
      {
        question: 'What is the purpose of Frustum Culling in 3D rendering engines?',
        answer: 'Frustum Culling checks whether the bounding box or sphere of a 3D object falls inside the camera visible pyramidal field of view (frustum). If an object is completely outside the camera view, the engine discards it before sending draw calls to the GPU, dramatically boosting frame rates.'
      }
    ]
  },

  'course-blockchain-web3': {
    courseId: 'course-blockchain-web3',
    courseTitle: 'Blockchain, Web3 & Smart Contracts',
    category: 'Distributed Ledgers & Web3',
    summary: 'Deploy Solidity smart contracts, analyze SHA-256 block difficulty parameters, hash transaction Merkle Trees, and connect MetaMask JSON-RPC providers.',
    realWorldAnalogy: 'Think of a Blockchain like a public stone monument in the center of town. Every financial transaction is engraved into stone by community vote. Once engraved, no king or hacker can erase a single chisel mark, and rules execute automatically via self-enforcing contracts.',
    keyConcepts: [
      {
        heading: '1. Cryptographic Hashing & Merkle Trees',
        explanation: 'Transactions are grouped and hashed into binary Merkle Trees. The single 32-byte Merkle Root in the block header verifies millions of transactions via O(log N) proofs.',
        codeOrExample: 'bytes32 leaf = keccak256(abi.encodePacked(account, amount));\nrequire(MerkleProof.verify(proof, root, leaf), "Invalid proof");'
      },
      {
        heading: '2. Solidity Smart Contract Architecture',
        explanation: 'Immutable state machine programs executed deterministically across EVM nodes with metered Gas computational limits.',
        codeOrExample: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract Escrow {\n    address public immutable owner;\n    constructor() { owner = msg.sender; }\n}'
      },
      {
        heading: '3. Reentrancy Protection & Checks-Effects-Interactions',
        explanation: 'Prevent reentrancy draining attacks by updating internal balance state before transferring external ether.',
        codeOrExample: 'function withdraw() external {\n    uint256 amount = balances[msg.sender];\n    require(amount > 0, "No funds");\n    balances[msg.sender] = 0; // Effect first\n    (bool success, ) = msg.sender.call{value: amount}(""); // Interaction second\n    require(success, "Transfer failed");\n}'
      }
    ],
    cheatsheet: [
      'Solidity Visibility: public, external, internal, private',
      'Gas Optimization: Pack uint128 state variables into single 256-bit storage slots',
      'Web3 Provider: const provider = new ethers.BrowserProvider(window.ethereum)',
      'ERC-20 Interface: transfer, approve, transferFrom, balanceOf'
    ],
    commonPitfalls: [
      'Sending external Ether calls before updating contract balances (the classic DAO Reentrancy exploit).',
      'Using `block.timestamp` as a secure source of randomness for high-stakes games.',
      'Unchecked loop iterations over unbounded dynamic arrays that exceed block gas limits.'
    ],
    interviewPrep: [
      {
        question: 'What is the Checks-Effects-Interactions pattern in Solidity?',
        answer: 'It is a fundamental security design pattern where a function first validates conditions (Checks), then mutates all internal contract state variables (Effects), and only finally interacts with external addresses or transfers Ether (Interactions), neutralizing reentrancy attacks.'
      }
    ]
  },

  'course-iot-network': {
    courseId: 'course-iot-network',
    courseTitle: 'IoT Wireless Networks & Protocols',
    category: 'Embedded Networking',
    summary: 'Master LoRaWAN gateway setups, cellular NB-IoT frequencies, BLE characteristics services, and CoAP UDP packet serializations.',
    realWorldAnalogy: 'Think of IoT Wireless Networks like communication in a dense rainforest. Wi-Fi is like shouting loudly across a clearing (high power, short distance). LoRaWAN is like an elephant low-frequency rumble that travels for miles through dense trees on almost zero physical energy.',
    keyConcepts: [
      {
        heading: '1. LoRaWAN Long-Range Star-of-Stars Topology',
        explanation: 'Sub-gigahertz chirp spread spectrum (CSS) modulation transmits low-bandwidth sensor telemetry over 10+ km with 10-year battery life.',
        codeOrExample: '// LoRaWAN Uplink Frame: DevEUI + AppEUI + FrameCounter + Payload\nlora.sendPacket(payloadBuffer, payloadSize);'
      },
      {
        heading: '2. Bluetooth Low Energy (BLE) GATT Architecture',
        explanation: 'Structure peripheral sensor communications into Profiles, Services, and Characteristics with 128-bit UUIDs for mobile synchronization.',
        codeOrExample: 'BLEService tempService("181A");\nBLEFloatCharacteristic tempCharacteristic("2A6E", BLERead | BLENotify);'
      },
      {
        heading: '3. Constrained Application Protocol (CoAP)',
        explanation: 'Specialized web transfer protocol running over UDP for constrained nodes, implementing compact 4-byte binary headers and REST semantics.',
        codeOrExample: '# CoAP Request:\ncoap-client -m get coap://[fd00::1]/sensors/temperature'
      }
    ],
    cheatsheet: [
      'LoRa Spreading Factor: SF7 (fast, short range) to SF12 (slow, maximum range)',
      'BLE Advertising Interval: 20ms to 10.24s (balances latency vs battery)',
      'NB-IoT Bandwidth: 200 kHz narrow band utilizing existing cellular infrastructure',
      'CoAP vs HTTP: UDP datagrams with binary headers vs TCP with bulky ASCII headers'
    ],
    commonPitfalls: [
      'Violating regional radio regulatory duty cycle limits (e.g. max 1% transmission time on 868 MHz in Europe).',
      'Transmitting unencrypted cleartext sensor data over open wireless radio frequencies.',
      'Neglecting network loss acknowledgements on critical industrial emergency shutoff signals.'
    ],
    interviewPrep: [
      {
        question: 'Why is UDP preferred over TCP for constrained IoT sensor networks?',
        answer: 'TCP requires a three-way handshake, continuous keep-alive heartbeats, and retransmission buffers, which consumes excessive battery power and packet overhead. UDP delivers lightweight datagrams instantly without connection setup latency.'
      }
    ]
  },

  'course-iot-edge-ai': {
    courseId: 'course-iot-edge-ai',
    courseTitle: 'Edge AI, DSP & TinyML Systems',
    category: 'Embedded Machine Learning',
    summary: 'Deploy quantized neural networks, configure DSP sampling intervals, optimize window moving averages, and validate accelerometer confidence scores.',
    realWorldAnalogy: 'Think of Edge AI like having a trained sound engineer standing right next to a jet engine. Instead of recording 24 hours of audio and beaming gigabytes to the cloud to check for engine wear, the engineer listens on-site and triggers an alarm the second an anomalous rattle begins.',
    keyConcepts: [
      {
        heading: '1. Model Post-Training Quantization (PTQ)',
        explanation: 'Convert 32-bit floating point weights (FP32) to 8-bit integers (INT8), shrinking model footprint by 75% and enabling execution on microcontrollers without FPUs.',
        codeOrExample: 'converter = tf.lite.TFLiteConverter.from_saved_model(model_path)\nconverter.optimizations = [tf.lite.Optimize.DEFAULT]\ntflite_quant_model = converter.convert()'
      },
      {
        heading: '2. Digital Signal Processing (DSP) & Spectrograms',
        explanation: 'Extract frequency domain features from raw accelerometer and audio sensors using Fast Fourier Transforms (FFT) before neural network classification.',
        codeOrExample: '// Compute FFT on 256-sample sensor window\narm_rfft_fast_f32(&fft_instance, raw_samples, fft_output, 0);'
      },
      {
        heading: '3. TensorFlow Lite for Microcontrollers (TFLM)',
        explanation: 'Run inference inside a fixed, pre-allocated C++ static memory arena with zero dynamic heap allocation.',
        codeOrExample: 'constexpr int tensor_arena_size = 60 * 1024;\nuint8_t tensor_arena[tensor_arena_size];\ntflite::MicroInterpreter interpreter(model, resolver, tensor_arena, tensor_arena_size);'
      }
    ],
    cheatsheet: [
      'Quantization Benefit: 4x smaller binary, 3x faster inference, zero dynamic RAM allocation',
      'Sampling Theorem: Nyquist rate requires sampling frequency fs > 2 * fmax',
      'Fixed-Point Math: Q7 / Q15 arithmetic replaces floating point operations',
      'Microcontroller Target: ARM Cortex-M4 / Cortex-M7 with CMSIS-NN DSP acceleration'
    ],
    commonPitfalls: [
      'Exceeding microcontroller static SRAM limits (many microcontrollers only have 64KB - 256KB of RAM).',
      'Training machine learning models on raw un-normalized sensor data with DC offset drift.',
      'Deploying unquantized FP32 models on processors without hardware floating-point units (FPUs).'
    ],
    interviewPrep: [
      {
        question: 'What is the primary constraint when deploying machine learning models to microcontrollers (TinyML)?',
        answer: 'The primary constraint is SRAM memory. While Flash storage (ROM) holds the model weights, all intermediate layer activation tensors must fit simultaneously within tightly constrained SRAM (often under 128 KB), requiring tensor arena reuse and INT8 quantization.'
      }
    ]
  },

  'course-iot-security': {
    courseId: 'course-iot-security',
    courseTitle: 'Industrial IoT Security & Device Lifecycle',
    category: 'Hardware Security',
    summary: 'Verify secure boot public key hashes, check AES IV block size constraints, prevent firmware versions downgrade rollbacks, and manage cert expiries.',
    realWorldAnalogy: 'Think of Industrial IoT Security like a military field radio with tamper-resistant explosives. If an enemy soldier physically captures the radio, secure hardware fuses ensure secret cryptographic keys cannot be read from the silicon, and it will only execute firmware cryptographically signed by high command.',
    keyConcepts: [
      {
        heading: '1. Hardware Root of Trust & Secure Boot',
        explanation: 'Boot ROM permanently etched in silicon verifies the RSA/ECDSA digital signature of second-stage bootloader firmware before executing a single instruction.',
        codeOrExample: '// Hardware eFuse verification checks sha256(bootloader_pubkey) against burned OTP register'
      },
      {
        heading: '2. Secure Over-The-Air (OTA) Anti-Rollback',
        explanation: 'Prevent attackers from forcing devices to reinstall older firmware containing known exploits by tracking monotonic security version counters in eFuses.',
        codeOrExample: 'if (new_image_security_version < current_efuse_version) {\n  abort_ota_installation("Rollback exploit rejected");\n}'
      },
      {
        heading: '3. Mutual TLS (mTLS) with Hardware Secure Elements',
        explanation: 'Authenticate both the cloud server and the IoT device using X.509 certificates where private keys are generated inside secure crypto chips (e.g. ATECC608A).',
        codeOrExample: '// Device private key never leaves the hardware cryptographic co-processor'
      }
    ],
    cheatsheet: [
      'Cryptographic Co-processor: ATECC608B / TPM 2.0 dedicated crypto element',
      'Anti-Rollback: Monotonic hardware counters burned during OTA upgrades',
      'Firmware Encryption: AES-256-XTS flash encryption protects IP from physical dumping',
      'JTAG Port Security: Blow physical eFuse to disable debugging interfaces before shipment'
    ],
    commonPitfalls: [
      'Leaving hardware JTAG / UART debugging interfaces active and accessible on production circuit boards.',
      'Sharing a single universal private key across all manufactured IoT devices instead of per-device certificates.',
      'Failing to implement dual-bank flash rollback recovery when an OTA firmware update gets corrupted midway.'
    ],
    interviewPrep: [
      {
        question: 'How does Secure Boot establish a Chain of Trust in embedded hardware?',
        answer: 'The immutable Hardware Root of Trust (ROM) verifies the signature of the bootloader. The bootloader verifies the signature of the OS kernel. The OS kernel verifies application binaries. Each stage cryptographically validates the next before handing over execution.'
      }
    ]
  },

  'course-quant-systems': {
    courseId: 'course-quant-systems',
    courseTitle: 'Quantitative Engineering & Low-Latency Trading Systems',
    category: 'Quantitative Finance',
    summary: 'Master Limit Order Book (LOB) matching queues, volume-weighted average price (VWAP) execution algorithms, market slippage modeling, TCP socket kernel bypass, and nanosecond latency.',
    realWorldAnalogy: 'Think of Quantitative High-Frequency Trading like a laser-speed digital auction room. When an institutional investor wants to buy 100,000 shares of stock, algorithmic matching engines analyze order books in 500 nanoseconds, calculating volume curves to prevent price spikes.',
    keyConcepts: [
      {
        heading: '1. Limit Order Book (LOB) Architecture',
        explanation: 'Maintain sorted bid (buy) and ask (sell) price ladders using double-linked lists indexed by array rings for O(1) order additions, cancellations, and matches.',
        codeOrExample: 'struct Order {\n    uint64_t order_id;\n    uint32_t price;\n    uint32_t qty;\n    Order* next;\n    Order* prev;\n};'
      },
      {
        heading: '2. Kernel Bypass & Zero-Copy Networking',
        explanation: 'Bypass the operating system Linux network stack using Solarflare OpenOnload or DPDK to read UDP multicast market data packets directly from NIC ring buffers.',
        codeOrExample: '// Direct NIC ring buffer poll (Kernel Bypass zero context-switch):\nonload_zc_recv(socket_fd, &msg, flags);'
      },
      {
        heading: '3. VWAP / TWAP Algorithmic Execution',
        explanation: 'Execute massive institutional parent orders by slicing them into small child orders distributed across time and historical trading volume profiles to minimize slippage.',
        codeOrExample: 'VWAP = sum(Price_i * Volume_i) / sum(Volume_i)'
      }
    ],
    cheatsheet: [
      'Order Book Complexity: Price-Time Priority FIFO queue lookup in O(1) time',
      'Kernel Bypass: Eliminates OS kernel context switching saving 2-4 microseconds',
      'Memory Strategy: Zero dynamic allocation (no malloc/free) in critical trading hot path',
      'L1 Data Cache: Keep order structs cache-line aligned to 64 bytes'
    ],
    commonPitfalls: [
      'Allocating heap memory or triggering garbage collection pauses in the critical order matching path.',
      'Neglecting market impact and slippage in backtested quantitative trading models.',
      'Failing to implement automated kill-switches when market price limits trip.'
    ],
    interviewPrep: [
      {
        question: 'What is Kernel Bypass in low-latency trading and why is it used?',
        answer: 'Kernel bypass allows user-space trading applications to communicate directly with the Network Interface Card (NIC) hardware without routing packets through the standard operating system TCP/IP stack, eliminating OS context switches, CPU interrupts, and buffer copies, cutting latency to sub-microsecond levels.'
      }
    ]
  },

  'course-quant-python': {
    courseId: 'course-quant-python',
    courseTitle: 'Quantitative Trading Systems in Python',
    category: 'Quantitative Finance',
    summary: 'Master Limit Order Book (LOB) matching queues, volume-weighted average price (VWAP) execution algorithms, market slippage modeling, TCP socket kernel bypass, and nanosecond latency.',
    realWorldAnalogy: 'Think of Quantitative High-Frequency Trading like a laser-speed digital auction room. When an institutional investor wants to buy 100,000 shares of stock, algorithmic matching engines analyze order books in 500 nanoseconds, calculating volume curves to prevent price spikes.',
    keyConcepts: [
      {
        heading: '1. Limit Order Book (LOB) Architecture',
        explanation: 'Maintain sorted bid (buy) and ask (sell) price ladders using double-linked lists indexed by array rings for O(1) order additions, cancellations, and matches.',
        codeOrExample: 'struct Order {\n    uint64_t order_id;\n    uint32_t price;\n    uint32_t qty;\n    Order* next;\n    Order* prev;\n};'
      },
      {
        heading: '2. Kernel Bypass & Zero-Copy Networking',
        explanation: 'Bypass the operating system Linux network stack using Solarflare OpenOnload or DPDK to read UDP multicast market data packets directly from NIC ring buffers.',
        codeOrExample: '// Direct NIC ring buffer poll (Kernel Bypass zero context-switch):\nonload_zc_recv(socket_fd, &msg, flags);'
      },
      {
        heading: '3. VWAP / TWAP Algorithmic Execution',
        explanation: 'Execute massive institutional parent orders by slicing them into small child orders distributed across time and historical trading volume profiles to minimize slippage.',
        codeOrExample: 'VWAP = sum(Price_i * Volume_i) / sum(Volume_i)'
      }
    ],
    cheatsheet: [
      'Order Book Complexity: Price-Time Priority FIFO queue lookup in O(1) time',
      'Kernel Bypass: Eliminates OS kernel context switching saving 2-4 microseconds',
      'Memory Strategy: Zero dynamic allocation (no malloc/free) in critical trading hot path',
      'L1 Data Cache: Keep order structs cache-line aligned to 64 bytes'
    ],
    commonPitfalls: [
      'Allocating heap memory or triggering garbage collection pauses in the critical order matching path.',
      'Neglecting market impact and slippage in backtested quantitative trading models.',
      'Failing to implement automated kill-switches when market price limits trip.'
    ],
    interviewPrep: [
      {
        question: 'What is Kernel Bypass in low-latency trading and why is it used?',
        answer: 'Kernel bypass allows user-space trading applications to communicate directly with the Network Interface Card (NIC) hardware without routing packets through the standard operating system TCP/IP stack, eliminating OS context switches, CPU interrupts, and buffer copies, cutting latency to sub-microsecond levels.'
      }
    ]
  },

  'course-finance-investment': {
    courseId: 'course-finance-investment',
    courseTitle: 'Business Finance & Investment Management (B.Com / BBA)',
    category: 'Corporate Finance & Capital Markets',
    summary: 'University-grade foundation curriculum covering financial statements, time value of money, capital budgeting (NPV/IRR), cost of capital (WACC), equity valuation, and portfolio risk management.',
    realWorldAnalogy: 'Think of Corporate Finance like piloting an airliner across the ocean. Fuel is your cash flow, altitude is your enterprise valuation, and the engine dials are your financial ratios. If your burn rate is too high, no matter how fast you fly, you crash before reaching the destination.',
    keyConcepts: [
      {
        heading: '1. Time Value of Money (TVM) & Net Present Value (NPV)',
        explanation: 'A rupee today is worth more than a rupee tomorrow due to inflation and earning potential. Projects are approved only if Net Present Value (NPV) is positive.',
        codeOrExample: 'NPV = sum( Cash_Flow_t / (1 + r)^t ) - Initial_Investment\n// If NPV > 0, project creates shareholder value.'
      },
      {
        heading: '2. Weighted Average Cost of Capital (WACC)',
        explanation: 'The blended average rate of return a company must pay to all its capital providers (equity shareholders and debt lenders).',
        codeOrExample: 'WACC = (E/V * Cost_of_Equity) + (D/V * Cost_of_Debt * (1 - Corporate_Tax_Rate))'
      },
      {
        heading: '3. Working Capital & Liquidity Ratios',
        explanation: 'Measure a firm ability to pay short-term obligations using Current Ratio (Current Assets / Current Liabilities) and Quick Acid-Test Ratio.',
        codeOrExample: 'Current Ratio = ₹5,00,000 / ₹2,50,000 = 2.0x (Healthy liquidity threshold >= 1.5x)'
      }
    ],
    cheatsheet: [
      'NPV Rule: Accept investment if NPV > 0',
      'Capital Asset Pricing Model (CAPM): Expected Return = Rf + Beta * (Rm - Rf)',
      'DuPont ROE: Net Profit Margin * Asset Turnover * Financial Leverage',
      'Current Ratio: Current Assets / Current Liabilities'
    ],
    commonPitfalls: [
      'Confusing accounting net profit with actual operating cash flow (profitable companies can still go bankrupt due to cash dry-ups).',
      'Using the company overall WACC to discount high-risk exploratory capital projects.',
      'Ignoring working capital lockup in overdue accounts receivable.'
    ],
    interviewPrep: [
      {
        question: 'Why is EBITDA widely used by investment bankers and corporate analysts?',
        answer: 'EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) measures pure operational profitability across companies by stripping out differences in capital structure (debt), tax jurisdictions, and non-cash accounting depreciation policies.'
      }
    ]
  },

  'course-business-analytics': {
    courseId: 'course-business-analytics',
    courseTitle: 'Business Analytics & Decision Intelligence (B.Com / BBA / MBA)',
    category: 'Business Analytics',
    summary: 'University-grade foundation curriculum covering data literacy, Excel analytics, visualization, Power BI, SQL fundamentals, KPI performance tracking, and AI decision intelligence.',
    realWorldAnalogy: 'Think of Business Analytics like a hospital intensive care telemetry monitor. Raw physiological data (heartbeats, blood pressure) are turned into visual trend lines and predictive alarms so doctors can intervene before an emergency occurs.',
    keyConcepts: [
      {
        heading: '1. Descriptive, Diagnostic, Predictive & Prescriptive Analytics',
        explanation: 'Analytics progresses from what happened (descriptive) to why it happened (diagnostic) to what will happen (predictive) to what action to take (prescriptive).',
        codeOrExample: '# Descriptive: Sales fell 8% last month\n# Diagnostic: Supply chain delayed delivery of bestsellers\n# Predictive: Stockouts will worsen next week\n# Prescriptive: Reroute warehouse stock via air freight'
      },
      {
        heading: '2. SQL Aggregations & Customer Cohort Retention',
        explanation: 'Query relational databases to measure customer retention, average order values, and churn curves across acquisition cohorts.',
        codeOrExample: 'SELECT cohort_month, COUNT(DISTINCT user_id) AS cohort_size,\n       SUM(order_total) / COUNT(order_id) AS average_order_value\nFROM analytics_orders\nGROUP BY cohort_month;'
      },
      {
        heading: '3. Power BI Star Schema Data Modeling & DAX',
        explanation: 'Structure data into central Fact tables surrounded by Dimension tables (Customer, Date, Product) with optimized DAX measure formulas.',
        codeOrExample: 'Customer_LTV = CALCULATE(SUM(Fact_Sales[Revenue]), ALLEXCEPT(Dim_Customer, Dim_Customer[ID]))'
      }
    ],
    cheatsheet: [
      'Star Schema: 1 Central Fact Table (numerical measures) + Multiple Dimension Tables (attributes)',
      'Customer Churn Rate: (Lost Customers during period) / (Total Customers at start of period)',
      'Customer Acquisition Cost: Total Marketing Spend / New Customers Acquired',
      'SQL Filter: WHERE filters raw rows before aggregation; HAVING filters aggregated groups'
    ],
    commonPitfalls: [
      'Confusing correlation with causation in business trend analysis.',
      'Building flat, de-normalized giant tables in Power BI instead of clean Star Schemas.',
      'Presenting complex raw statistical metrics to executive stakeholders without clear business context.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between a Fact Table and a Dimension Table in data warehousing?',
        answer: 'A Fact table contains quantitative numerical measurements and metrics (e.g. sales amount, quantity sold, order timestamp) and foreign keys. A Dimension table contains descriptive contextual attributes (e.g. customer name, product category, store location) used for filtering and slicing facts.'
      }
    ]
  },

  'course-marketing-branding': {
    courseId: 'course-marketing-branding',
    courseTitle: 'Marketing & Brand Management (B.Com / BBA / MBA)',
    category: 'Marketing Strategy',
    summary: 'University-grade foundation curriculum covering customer research, market segmentation, brand positioning, product lifecycle, pricing strategies, and distribution channels.',
    realWorldAnalogy: 'Think of Brand Management like building a reputation as a master surgeon. Anyone can buy surgical scalpels (products), but patients wait months and pay a premium because of the trust, authority, and emotional reassurance built around the surgeon name (the Brand).',
    keyConcepts: [
      {
        heading: '1. The STP Strategic Framework',
        explanation: 'Segmentation (dividing market by demographic, psychographic, behavioral traits), Targeting (selecting high-value segments), and Positioning (owning a unique mental category in consumer minds).',
        codeOrExample: '// Volvo = "Safety" | Apple = "Premium Innovation" | Tesla = "Sustainable Performance"'
      },
      {
        heading: '2. Brand Equity & Customer Lifetime Value (CLV)',
        explanation: 'Measure brand value through price premium resilience, customer loyalty, and long-term customer monetization over churned acquisition.',
        codeOrExample: 'CLV = (Average Purchase Value * Purchase Frequency) * Customer Lifespan'
      },
      {
        heading: '3. The 4 Ps Marketing Mix & Pricing Models',
        explanation: 'Harmonize Product features, Price architectures (Skimming, Penetration, Value-Based), Place (omnichannel distribution), and Promotion.',
        codeOrExample: '// Value-Based Pricing: Price set by perceived customer value, not cost-plus manufacturing markup'
      }
    ],
    cheatsheet: [
      'STP: Segmentation -> Targeting -> Positioning',
      '4 Ps: Product, Price, Place, Promotion',
      'Net Promoter Score (NPS): % Promoters (9-10) - % Detractors (1-6)',
      'AIDA Model: Attention -> Interest -> Desire -> Action'
    ],
    commonPitfalls: [
      'Engaging in destructive price wars instead of building differentiated brand value.',
      'Attempting to target everyone instead of dominating a well-defined niche customer segment.',
      'Focusing exclusively on top-of-funnel customer acquisition while ignoring post-purchase retention.'
    ],
    interviewPrep: [
      {
        question: 'Explain the difference between Brand Identity and Brand Image.',
        answer: 'Brand Identity is how the company internally defines and projects its brand through logo, messaging, values, and product design. Brand Image is the actual perception and emotional association held in the minds of external consumers.'
      }
    ]
  },

  'course-digital-marketing': {
    courseId: 'course-digital-marketing',
    courseTitle: 'Digital Marketing & Growth Strategy (B.Com / BBA / MBA)',
    category: 'Digital Growth',
    summary: 'University-grade foundation curriculum covering customer journeys, SEO, content strategy, paid performance advertising, email automation, CRO analytics, and growth hacking systems.',
    realWorldAnalogy: 'Think of Digital Marketing like a high-performance aircraft engine. Search Engine Optimization (SEO) is the aerodynamic wings providing steady organic lift, Paid Performance Ads (Meta/Google) are the rocket boosters, and Conversion Rate Optimization (CRO) ensures fuel does not leak through the tank.',
    keyConcepts: [
      {
        heading: '1. Technical & Content SEO Architecture',
        explanation: 'Optimize website crawlability, Core Web Vitals, schema markup, search intent keywords, and backlink authority to dominate organic search results.',
        codeOrExample: '// Meta Robots & Canonical Tag:\n<link rel="canonical" href="https://career-os.com/guides/accounting" />\n<meta name="robots" content="index, follow" />'
      },
      {
        heading: '2. Paid Performance Marketing & ROAS',
        explanation: 'Manage digital ad spend across Meta Ads and Google Search, optimizing for Return on Ad Spend (ROAS) and Customer Acquisition Cost (CAC).',
        codeOrExample: 'ROAS = Revenue Generated from Campaign / Total Campaign Ad Spend\n// Target: ROAS >= 3.5x for profitable scale'
      },
      {
        heading: '3. Conversion Rate Optimization (CRO) & A/B Testing',
        explanation: 'Systematically test landing page headlines, call-to-action buttons, and checkout funnels to maximize conversion percentages.',
        codeOrExample: 'Conversion Rate = (Total Conversions / Total Unique Landing Page Visitors) * 100%'
      }
    ],
    cheatsheet: [
      'CAC Formula: Total Ad Spend / New Customers Acquired',
      'Click-Through-Rate (CTR): (Clicks / Impressions) * 100%',
      'Target LTV:CAC Ratio: 3:1 or higher indicates healthy unit economics',
      'UTM Tracking: ?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale'
    ],
    commonPitfalls: [
      'Scaling paid ad spend on landing pages that have broken mobile checkout conversion funnels.',
      'Relying on vanity metrics (social media likes, impressions) instead of revenue conversions and customer acquisition costs.',
      'Failing to set up server-side Conversions API (CAPI) tracking to overcome browser ad-blockers.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between CPM, CPC, and CPA pricing models in digital advertising?',
        answer: 'CPM (Cost Per Mille) charges per 1,000 ad impressions, best for brand awareness. CPC (Cost Per Click) charges only when a user clicks the ad, standard for search intent. CPA (Cost Per Action) charges only when a user completes a desired conversion (e.g. signup or purchase), minimizing advertiser financial risk.'
      }
    ]
  },

  'course-ecommerce-digital-biz': {
    courseId: 'course-ecommerce-digital-biz',
    courseTitle: 'E-Commerce & Digital Business (B.Com / BBA / MBA)',
    category: 'Commerce & Digital Retail',
    summary: 'University-grade foundation curriculum covering digital business models, product catalog management, pricing, online store UX, payment gateways, logistics fulfillment, and analytics.',
    realWorldAnalogy: 'Think of an E-Commerce Business like an automated robotic mega-store that never closes. Millions of shoppers can walk down aisles simultaneously, pay through encrypted digital registers, and trigger automated warehouse robots that pack and dispatch parcels within minutes.',
    keyConcepts: [
      {
        heading: '1. E-Commerce Unit Economics & Margins',
        explanation: 'Calculate Gross Margins, Average Order Value (AOV), return rate provisions, and payment gateway processing fees.',
        codeOrExample: 'Net Margin = Revenue - (COGS + Shipping + Return Costs + Payment Fees + Marketing CAC)'
      },
      {
        heading: '2. Payment Gateway Architecture & 3D Secure Fraud Defense',
        explanation: 'Integrate payment orchestrators (Stripe, Razorpay) with PCI-DSS tokenization and two-factor 3DS verification to prevent fraudulent chargebacks.',
        codeOrExample: 'const paymentIntent = await stripe.paymentIntents.create({\n  amount: 249900,\n  currency: "inr",\n  payment_method_types: ["card", "upi"]\n});'
      },
      {
        heading: '3. Omnichannel Supply Chain & Reverse Logistics',
        explanation: 'Manage inventory distribution across central warehouses, dark stores, and return processing hubs with real-time stock sync.',
        codeOrExample: 'Order Status Pipeline: Placed -> Picked -> Packed -> Dispatched -> Out for Delivery -> Delivered'
      }
    ],
    cheatsheet: [
      'Average Order Value (AOV): Total Revenue / Total Number of Orders',
      'Cart Abandonment Rate: (1 - (Completed Purchases / Created Carts)) * 100%',
      'Stock Keeping Unit (SKU): Unique alphanumeric identifier for inventory tracking',
      'Cash on Delivery (COD) Provisioning: Reserve 15-20% margin for RTO (Return to Origin)'
    ],
    commonPitfalls: [
      'Underestimating customer return and RTO rates, wiping out paper operating profits.',
      'Allowing out-of-stock items to remain purchasable online due to delayed inventory synchronization.',
      'Over-complicating checkout forms with unnecessary account registration requirements.'
    ],
    interviewPrep: [
      {
        question: 'What strategies can an e-commerce platform deploy to reduce shopping cart abandonment?',
        answer: 'Key strategies include enabling 1-click guest checkout, providing upfront shipping cost transparency, offering local payment methods (UPI, Apple Pay, Buy-Now-Pay-Later), displaying security trust badges, and sending automated cart recovery emails or SMS notifications.'
      }
    ]
  },

  'course-entrepreneurship-biz-mgmt': {
    courseId: 'course-entrepreneurship-biz-mgmt',
    courseTitle: 'Entrepreneurship & Business Management (B.Com / BBA / MBA)',
    category: 'Business Leadership',
    summary: 'University-grade foundation curriculum covering business fundamentals, Business Model Canvas (BMC), strategic planning, startup finance & break-even analysis, leadership, innovation, and risk assessment.',
    realWorldAnalogy: 'Think of Entrepreneurship like captaining an expedition ship into uncharted waters. You cannot control the ocean storms (market dynamics), but with a solid navigation map (Business Model Canvas), a disciplined crew, and emergency provisions (Cash Runway), you discover new continents.',
    keyConcepts: [
      {
        heading: '1. The Business Model Canvas (BMC)',
        explanation: 'Map enterprise mechanics across 9 building blocks: Value Propositions, Customer Segments, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, and Cost Structure.',
        codeOrExample: '// BMC maps the complete operational and economic engine of a startup on a single visual canvas'
      },
      {
        heading: '2. Break-Even Analysis & Startup Unit Economics',
        explanation: 'Calculate the exact sales volume required where total revenues equal total fixed and variable costs.',
        codeOrExample: 'Break-Even Point (Units) = Total Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)'
      },
      {
        heading: '3. Burn Rate & Cash Runway Management',
        explanation: 'Monitor net monthly cash outflow (burn rate) to determine how many months of operational survival remain before requiring cash profitability or external funding.',
        codeOrExample: 'Cash Runway (Months) = Total Cash Balance / Net Monthly Cash Burn Rate'
      }
    ],
    cheatsheet: [
      'Minimum Viable Product (MVP): Smallest build delivering core customer value',
      'Product-Market Fit (PMF): 40%+ of surveyed users state they would be "very disappointed" if product vanished',
      'Bootstrapping: Building a business funded entirely by internal operational cash flow',
      'Pivot: Shifting business strategy or target audience while staying anchored to the core vision'
    ],
    commonPitfalls: [
      'Premature scaling: hiring large teams and spending on advertising before validating product-market fit.',
      'Running out of cash runway due to lack of strict monthly financial budget discipline.',
      'Building products based on personal assumptions without interviewing real prospective customers.'
    ],
    interviewPrep: [
      {
        question: 'What is the Lean Startup Build-Measure-Learn feedback loop?',
        answer: 'It is an iterative methodology where entrepreneurs turn business ideas into Minimum Viable Products (Build), test them in the real market to gather quantitative customer data (Measure), and decide whether to persevere or pivot based on validated insights (Learn), minimizing wasted capital.'
      }
    ]
  },

  'course-sales-crm-success': {
    courseId: 'course-sales-crm-success',
    courseTitle: 'Sales, Customer Success & CRM (B.Com / BBA / MBA)',
    category: 'Enterprise Sales & CRM',
    summary: 'University-grade foundation curriculum covering sales prospecting, BANT lead qualification, active listening, LAER objection handling, customer onboarding, CRM database architecture, and Key Account Management.',
    realWorldAnalogy: 'Think of Enterprise Sales and CRM like a master physician practice. A physician never pushes drugs onto pedestrians on the street. They ask diagnostic questions, identify the acute pain, prescribe the exact cure, and provide attentive follow-up care so the patient thrives.',
    keyConcepts: [
      {
        heading: '1. Lead Qualification: The BANT & MEDDIC Frameworks',
        explanation: 'Qualify enterprise prospective clients based on Budget, Authority (economic decision-maker), Need (urgent business pain), and Timeline.',
        codeOrExample: '# BANT Scorecard:\n# Budget: Confirmed enterprise budget allocated ($50k+)\n# Authority: VP of Engineering with sign-off authority\n# Need: Migrating legacy monolith to cloud to stop outages\n# Timeline: Production launch required within 90 days'
      },
      {
        heading: '2. LAER Objection Handling Framework',
        explanation: 'Listen actively to client hesitation, Acknowledge their concern empathetically, Explore the root cause with open-ended questions, and Respond with tailored evidence.',
        codeOrExample: '// Client: "Your product is too expensive."\n// Response: "I completely understand budget scrutiny. May I ask what downtime currently costs your team per hour?"'
      },
      {
        heading: '3. CRM Architecture & Pipeline Velocity',
        explanation: 'Track enterprise deals through pipeline stages (Lead -> Qualified -> Discovery -> Demo -> Proposal -> Closed Won) and calculate sales velocity.',
        codeOrExample: 'Sales Velocity = (Number of Opportunities * Win Rate % * Average Deal Size) / Length of Sales Cycle'
      }
    ],
    cheatsheet: [
      'BANT: Budget, Authority, Need, Timeline',
      'Net Revenue Retention (NRR): (Beginning ARR + Expansion - Churn - Contraction) / Beginning ARR',
      'MEDDIC: Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion',
      'CRM Pipeline Stages: Prospect -> Qualified -> Proposal -> Negotiation -> Closed'
    ],
    commonPitfalls: [
      'Pitching product features before identifying the prospect business pain points.',
      'Failing to identify and engage the actual economic buyer with budget signing authority.',
      'Treating sales and customer success as disconnected silos, leading to high post-sale customer churn.'
    ],
    interviewPrep: [
      {
        question: 'What is Net Revenue Retention (NRR) and why do enterprise SaaS companies prioritize it?',
        answer: 'NRR measures the percentage of recurring revenue retained from existing customers over a period, including upsells and cross-sells, minus cancellations and downgrades. An NRR above 100% means the business grows organically even without acquiring a single new customer.'
      }
    ]
  },

  'course-operations-supplychain-compliance': {
    courseId: 'course-operations-supplychain-compliance',
    courseTitle: 'Operations, Supply Chain & Business Compliance (B.Com / BBA / MBA)',
    category: 'Supply Chain & Operations',
    summary: 'University-grade foundation curriculum covering business process mapping, procurement workflows, inventory control (EOQ/ROP), Lean/Six Sigma quality management, statutory compliance, and ERP systems.',
    realWorldAnalogy: 'Think of Supply Chain & Operations like a high-precision Swiss mechanical watch. Hundreds of tiny gears, springs, and levers must mesh with sub-millimeter precision. If a single supplier cog arrives late, the entire watch movement stops dead.',
    keyConcepts: [
      {
        heading: '1. Economic Order Quantity (EOQ) & Reorder Point (ROP)',
        explanation: 'Calculate the optimal inventory order size to minimize the sum of ordering costs and holding costs, triggering purchase orders at the safety reorder point.',
        codeOrExample: 'EOQ = sqrt( (2 * Annual_Demand * Order_Cost) / Annual_Holding_Cost_per_Unit )\nROP = (Daily_Usage * Lead_Time_Days) + Safety_Stock'
      },
      {
        heading: '2. Lean Manufacturing & Six Sigma (DMAIC)',
        explanation: 'Eliminate operational waste (Muda: transport, inventory, motion, waiting, overproduction, defects) and achieve 99.99966% defect-free execution.',
        codeOrExample: '// DMAIC Steps: Define problem -> Measure baseline -> Analyze root causes -> Improve processes -> Control sustainability'
      },
      {
        heading: '3. Statutory Compliance, ISO Audits & Enterprise Risk',
        explanation: 'Establish internal controls and audit trails to comply with statutory corporate governance (Sarbanes-Oxley, ISO 9001 quality, ESG environmental standards).',
        codeOrExample: '// Segregation of Duties (SoD): The employee who creates a purchase invoice cannot be the same employee who approves payment'
      }
    ],
    cheatsheet: [
      'EOQ Formula: sqrt((2 * D * S) / H)',
      'DMAIC: Define, Measure, Analyze, Improve, Control',
      '5S Principles: Sort, Set in order, Shine, Standardize, Sustain',
      'Six Sigma Metric: 3.4 defects per million opportunities (DPMO)'
    ],
    commonPitfalls: [
      'Holding excessive buffer inventory that ties up corporate working capital and risks obsolescence.',
      'Relying on single-source suppliers for mission-critical components without secondary vendor contingency plans.',
      'Failing to maintain audit-proof documentation for statutory and environmental compliance reviews.'
    ],
    interviewPrep: [
      {
        question: 'What is Just-In-Time (JIT) manufacturing and what is its primary operational vulnerability?',
        answer: 'JIT is an inventory management strategy where raw materials are received and products manufactured only as needed for customer orders, minimizing storage and holding costs. Its primary vulnerability is extreme susceptibility to supply chain shocks, transport delays, or geopolitical disruptions.'
      }
    ]
  },

  'course-ai-digital-transformation': {
    courseId: 'course-ai-digital-transformation',
    courseTitle: 'AI & Digital Transformation for Business (B.Com / BBA / MBA)',
    category: 'Enterprise AI & Strategy',
    summary: 'University-grade foundation curriculum covering AI literacy, prompt engineering for business, functional AI across departments, Robotic Process Automation (RPA), ERP AI integration, and AI ethics.',
    realWorldAnalogy: 'Think of Digital Transformation like upgrading an old coal-fired railway network to a maglev electric bullet train system. You cannot just put a sleek new locomotive on rusted tracks; you must modernize the rail beds (data infrastructure), the signals (APIs), and train the engineers (workforce AI literacy).',
    keyConcepts: [
      {
        heading: '1. Enterprise AI Maturity Matrix & Value Sizing',
        explanation: 'Assess organizational readiness across Data Foundations, Cloud Modernization, Talent, and Governance to prioritize high-ROI AI use cases.',
        codeOrExample: '// High Impact / High Feasibility: Invoice automation, customer support triage\n// High Impact / Low Feasibility: Fully autonomous supply chain prediction'
      },
      {
        heading: '2. Robotic Process Automation (RPA) & Workflow Automation',
        explanation: 'Automate repetitive, rule-based cross-application tasks (extracting PDF invoice data, validating GST numbers, updating SAP ERP ledgers).',
        codeOrExample: '# RPA Pipeline:\n1. Ingest email attachment -> 2. OCR Extract Data -> 3. Validate against PO -> 4. Submit to ERP'
      },
      {
        heading: '3. AI Governance, Ethics & Corporate Risk Mitigation',
        explanation: 'Establish policies preventing proprietary company data leaks to public AI models, ensuring algorithmic fairness, and complying with the EU AI Act.',
        codeOrExample: '// Enterprise Policy: Zero training retention on proprietary company IP; mandatory human-in-the-loop on financial filings'
      }
    ],
    cheatsheet: [
      'Transformation Pillars: People, Processes, Data, Technology',
      'RPA vs AI: RPA handles repetitive rules-based clicks; AI handles cognitive reasoning and unstructured text',
      'Data Lakehouse: Combines data warehouse SQL analytics with low-cost object storage',
      'Change Management: Kotter 8-Step change model for enterprise tech adoption'
    ],
    commonPitfalls: [
      'Viewing AI as an IT department project rather than a core CEO-level business strategy overhaul.',
      'Deploying AI algorithms on dirty, fragmented, unstandardized departmental legacy data silos.',
      'Neglecting employee change management and training, resulting in organizational resistance and abandoned software.'
    ],
    interviewPrep: [
      {
        question: 'Why do many corporate digital transformation initiatives fail to achieve projected ROI?',
        answer: 'Most transformations fail not due to technological shortcomings, but due to cultural resistance, lack of executive sponsorship, fragmented siloed data architecture, and failing to redesign business workflows around the new capabilities before software deployment.'
      }
    ]
  },

  'course-ai-prompt-literacy': {
    courseId: 'course-ai-prompt-literacy',
    courseTitle: 'Everyday AI Literacy & Prompt Engineering',
    category: 'Applied Artificial Intelligence',
    summary: 'Essential AI skills for every modern professional. Master prompt architecture, multi-turn steering, role-based prompting, automated document summarization, and workflow automation.',
    realWorldAnalogy: 'Think of Prompt Engineering like delegating tasks to a brilliant Harvard graduate intern who reads 10,000 words per second. If you give vague instructions ("Write something about sales"), you get a bland generic answer. If you provide context, explicit constraints, and target examples, you get executive-grade deliverables.',
    keyConcepts: [
      {
        heading: '1. The Core Prompt Architecture Framework',
        explanation: 'Structure prompts using Role (persona), Context (background facts), Task (specific action), Constraints (boundaries), and Output Format (tables, JSON, markdown).',
        codeOrExample: 'You are a senior CFO auditor. [ROLE]\nReview the attached Q3 balance sheet. [CONTEXT]\nIdentify the top 3 working capital liquidity risks. [TASK]\nDo not exceed 300 words; use bullet points. [CONSTRAINTS]\nOutput as a Markdown table with Risk, Severity, and Action. [FORMAT]'
      },
      {
        heading: '2. Few-Shot In-Context Demonstration',
        explanation: 'Provide 2-3 input-output exemplar pairs in the prompt to condition the LLM to follow exact formatting and classification standards without training.',
        codeOrExample: 'Input: "Delivery was 3 days late, ruined my wedding." -> Sentiment: Negative | Intent: Complaint\nInput: "Can I exchange for size Large?" -> Sentiment: Neutral | Intent: Exchange\nInput: "Love the new interface, so fast!" -> Sentiment: Positive | Intent: Praise'
      },
      {
        heading: '3. Chain-of-Thought (CoT) & Structured Reasoning',
        explanation: 'Instruct the model to "think step by step" or decompose multi-step business problems into logical intermediate phases to prevent reasoning errors.',
        codeOrExample: 'Before providing your final recommendation, write out your intermediate calculation steps and assumption checks.'
      }
    ],
    cheatsheet: [
      'Prompt Formula: Role + Context + Task + Constraints + Format',
      'Few-Shot: 2-3 real examples dramatically boost formatting precision',
      'Delimiters: Use triple backticks (```) or XML tags (<doc>) to separate data from instructions',
      'Temperature: 0.0 - 0.2 for analytical/factual tasks; 0.7+ for creative brainstorming'
    ],
    commonPitfalls: [
      'Giving vague, one-line prompts and expecting nuanced, expert-level outputs.',
      'Blindly accepting factual citations without verifying against ground-truth source documents (hallucination risk).',
      'Pasting confidential customer PII or proprietary trade secrets into consumer AI tools without enterprise data protection agreements.'
    ],
    interviewPrep: [
      {
        question: 'What is Chain-of-Thought prompting and why does it improve mathematical and logical accuracy?',
        answer: 'Chain-of-Thought prompting directs the LLM to generate explicit intermediate reasoning steps before generating the final answer. Because LLMs predict the next token based on all prior tokens, writing out intermediate reasoning builds the necessary context tokens that guide the model to mathematically sound conclusions.'
      }
    ]
  },

  'course-excel-data-viz': {
    courseId: 'course-excel-data-viz',
    courseTitle: 'Excel & Data Analysis Fundamentals',
    category: 'Data Analysis & Business Tools',
    summary: 'The universal language of business and finance. Master modern Excel formulas, XLOOKUP, dynamic arrays, Pivot Tables, data cleaning, and executive dashboard design.',
    realWorldAnalogy: 'Think of Excel like a digital ledger workshop. While other software tools come and go, Excel remains the universal operating system of global commerce. From Wall Street merger models to local supply shops, the entire world runs on row-and-column calculations.',
    keyConcepts: [
      {
        heading: '1. Modern Lookup Mechanics: `XLOOKUP` vs `VLOOKUP`',
        explanation: '`XLOOKUP` looks up values both vertically and horizontally, searches left or right without breaking when columns are inserted, and defaults to exact matching.',
        codeOrExample: '=XLOOKUP(lookup_value, lookup_array, return_array, "Not Found", 0)'
      },
      {
        heading: '2. Dynamic Arrays: `FILTER`, `UNIQUE`, `SORT`',
        explanation: 'Formulas that automatically spill calculated results across multiple rows and columns without legacy `Ctrl+Shift+Enter` array formulas.',
        codeOrExample: '=SORT(FILTER(Orders[Amount], Orders[Region]="North"), 1, -1)'
      },
      {
        heading: '3. Pivot Tables & Calculated Fields',
        explanation: 'Summarize millions of data rows in seconds into multi-dimensional matrices with grouping, slicers, and calculated profit margins.',
        codeOrExample: '// Drag "Region" to Rows, "Quarter" to Columns, and "Sales Revenue" to Values (Summarize by SUM)'
      }
    ],
    cheatsheet: [
      'XLOOKUP: =XLOOKUP(F2, A:A, C:C)',
      'SUMIFS: =SUMIFS(sum_range, criteria_range1, criteria1)',
      'INDEX/MATCH: =INDEX(C:C, MATCH(F2, A:A, 0))',
      'Absolute Referencing: $A$1 locks cell; A$1 locks row; $A1 locks column'
    ],
    commonPitfalls: [
      'Failing to lock cell references with dollar signs (`$A$1`) when dragging formulas across rows.',
      'Using `VLOOKUP` with hardcoded column numbers that break when new columns are inserted.',
      'Storing numbers formatted as text, causing `SUM` and lookup formulas to return 0 or `#N/A` errors.'
    ],
    interviewPrep: [
      {
        question: 'What are the main advantages of XLOOKUP over the traditional VLOOKUP function?',
        answer: 'XLOOKUP defaults to exact match (no more accidental TRUE range lookups), can look up values to the left of the lookup column, does not break when columns are inserted or deleted, supports horizontal lookups, and includes a built-in default value handler when results are not found.'
      }
    ]
  },

  'course-git-version-control': {
    courseId: 'course-git-version-control',
    courseTitle: 'Git, GitHub & Version Control Basics',
    category: 'Software Engineering Core',
    summary: 'Essential collaboration skills for modern engineering teams. Master Git DAG architectures, commits, branching workflows, merge conflict resolution, and GitHub pull requests.',
    realWorldAnalogy: 'Think of Git like a time-travel machine with a multiverse branch recorder. You can build experimental features in parallel universes (branches), test them thoroughly, and merge them back into the main timeline without ever risking the production reality.',
    keyConcepts: [
      {
        heading: '1. The Git Object Model & Directed Acyclic Graph (DAG)',
        explanation: 'Git stores code as content-addressable SHA-1/SHA-256 hashes representing Blobs (file contents), Trees (directories), and Commits (snapshots pointing to parent commits).',
        codeOrExample: '# Inspect commit object structure:\ngit cat-file -p HEAD'
      },
      {
        heading: '2. Branching & Merge Strategies (Merge vs Rebase)',
        explanation: '`git merge` creates a non-destructive merge commit combining history. `git rebase` reapplies feature commits onto the tip of main for a clean linear history.',
        codeOrExample: 'git checkout feature-auth\ngit fetch origin\ngit rebase origin/main'
      },
      {
        heading: '3. Resolving Merge Conflicts Defensively',
        explanation: 'Understand conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) and resolve differences while preserving both teams intended logic.',
        codeOrExample: 'git status\n# Edit conflicted files to resolve markers\ngit add resolved_file.ts\ngit commit -m "fix: resolve auth token conflict"'
      }
    ],
    cheatsheet: [
      'Create & Switch Branch: git checkout -b feature/name',
      'Stage All Changes: git add -A',
      'Commit with Message: git commit -m "feat: add user login"',
      'Stash Work: git stash save "WIP" && git stash pop'
    ],
    commonPitfalls: [
      'Force-pushing (`git push --force`) to shared branches like `main`, overwriting teammates work.',
      'Committing large binary files or node_modules into git repositories instead of adding them to `.gitignore`.',
      'Making massive 2,000-line commits with vague messages like "updates" or "fix".'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between git fetch and git pull?',
        answer: '`git fetch` downloads the latest commits, branches, and tags from the remote repository into your local `.git` metadata store without modifying your working directory. `git pull` executes `git fetch` immediately followed by `git merge` (or rebase), merging remote changes into your active branch.'
      }
    ]
  },

  'course-softskills-communication': {
    courseId: 'course-softskills-communication',
    courseTitle: 'Professional Tech Communication & Interview Mastery',
    category: 'Career Acceleration',
    summary: 'Essential soft skills for career acceleration. Master professional executive writing, technical documentation, pitch presentations, behavioral interviews, and leadership communication.',
    realWorldAnalogy: 'Think of Professional Communication like the high-speed fiber-optic bus connecting the CPU to the motherboard. You can be the most brilliant engineering mind in the room (processing speed), but if your output bus cannot transmit clear signals to non-technical executives, your ideas will never get funded.',
    keyConcepts: [
      {
        heading: '1. The Minto Pyramid Principle & Executive Brevity',
        explanation: 'Lead with the answer or recommendation first (Bottom Line Up Front / BLUF), then summarize supporting arguments, and provide technical data last.',
        codeOrExample: '// Executive Format:\n// 1. Recommendation: Migrate auth service to Redis.\n// 2. Business Impact: Reduces login latency by 72% and prevents server crashes.\n// 3. Cost & Timeline: 2 engineering weeks, $400/mo infrastructure.'
      },
      {
        heading: '2. Behavioral Interview Mastery: The STAR Framework',
        explanation: 'Structure behavioral interview stories: Situation (context), Task (your specific challenge), Action (concrete decisions you made), and Result (quantified business outcome).',
        codeOrExample: '# STAR Story Structure:\n# Situation: E-commerce platform checkout failed during Diwali sale.\n# Task: I had to restore payment processing within 30 minutes.\n# Action: Identified deadlock in payment DB, rolled back migration, rerouted traffic.\n# Result: Restored $1.2M in sales within 18 minutes with zero customer data loss.'
      },
      {
        heading: '3. Cross-Functional Engineering Collaboration',
        explanation: 'Bridge technical constraints with business priorities when communicating with Product Managers, Designers, and C-suite leaders.',
        codeOrExample: '// Instead of: "The microservice is throwing 504 Gateway Timeouts due to connection starvation."\n// Say: "Users in Mumbai are experiencing checkout loading failures during peak traffic; here is the plan to fix it."'
      }
    ],
    cheatsheet: [
      'BLUF: Bottom Line Up Front — state your key takeaway in the first sentence',
      'STAR: Situation, Task, Action, Result',
      'Active Listening: Paraphrase what you heard before responding to ensure mutual understanding',
      'Negotiation: Seek win-win outcomes by uncovering the underlying interests behind fixed positions'
    ],
    commonPitfalls: [
      'Giving lengthy, rambling interview answers without structured punchlines or quantified results.',
      'Using dense technical jargon when presenting proposals to non-technical executive stakeholders.',
      'Becoming defensive during code reviews or peer design critiques instead of viewing feedback objectively.'
    ],
    interviewPrep: [
      {
        question: 'How do you handle disagreements with team members or managers regarding technical architecture decisions?',
        answer: 'I depersonalize the discussion by anchoring back to objective business requirements, latency SLAs, and maintenance costs. I present concrete trade-offs for both approaches, actively listen to their concerns, and if alignment cannot be reached, follow the "disagree and commit" leadership principle once a decision is finalized.'
      }
    ]
  },

  'course-nlp': {
    courseId: 'course-nlp',
    courseTitle: 'Natural Language Processing & Computational Linguistics',
    category: 'Artificial Intelligence Core',
    summary: 'Master computational linguistics, subword tokenization, word embeddings, sequence modeling, Multi-Head Transformer Self-Attention, BERT/GPT architectures, and LoRA fine-tuning.',
    realWorldAnalogy: 'Think of Natural Language Processing like building a universal mathematical dictionary for human thought. Words and phrases are not just letters; they are multidimensional coordinates in space where words with similar contextual meanings cluster together like stars in a galaxy.',
    keyConcepts: [
      {
        heading: '1. Subword Tokenization & Dense Vector Spaces',
        explanation: 'Byte-Pair Encoding (BPE) breaks vocabulary into subword units, mapped into high-dimensional embedding spaces where semantic relationships reflect vector arithmetic.',
        codeOrExample: '# Semantic Vector Arithmetic:\n# vector("King") - vector("Man") + vector("Woman") ≈ vector("Queen")'
      },
      {
        heading: '2. Scaled Dot-Product Self-Attention',
        explanation: 'Compute query-key affinities to dynamically weight which surrounding words provide context to each token in parallel across multi-head projections.',
        codeOrExample: 'Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V'
      },
      {
        heading: '3. Parameter-Efficient Fine-Tuning (PEFT / LoRA)',
        explanation: 'Freeze the massive pre-trained weight matrices W and train low-rank decomposition matrices A and B (rank r << d), updating under 1% of total parameters.',
        codeOrExample: 'from peft import LoraConfig, get_peft_model\nconfig = LoraConfig(r=8, lora_alpha=32, target_modules=["q_proj", "v_proj"])\npeft_model = get_peft_model(base_model, config)'
      }
    ],
    cheatsheet: [
      'Self-Attention Complexity: O(N^2 * d) where N is sequence length and d is dimension',
      'Temperature Sampling: P(token_i) = exp(logit_i / T) / sum(exp(logit_j / T))',
      'LoRA Decomposition: W_updated = W_frozen + (B * A) * (alpha / r)',
      'Perplexity (PPL): Exponential of cross-entropy loss measuring language model uncertainty'
    ],
    commonPitfalls: [
      'Applying quadratic O(N^2) vanilla attention to ultra-long 100,000-token documents without FlashAttention or chunking.',
      'Training language models on raw text without Unicode normalization (causing broken subword token splits).',
      'Overfitting small domain datasets during full-parameter fine-tuning instead of using LoRA or prompt tuning.'
    ],
    interviewPrep: [
      {
        question: 'Why did the Transformer architecture replace recurrent neural networks (RNNs and LSTMs) in modern NLP?',
        answer: 'RNNs process tokens sequentially step-by-step, creating an architectural bottleneck that prevents parallel GPU computation and suffers from vanishing gradients over long sequences. Transformers process all tokens simultaneously using multi-head self-attention, allowing massive distributed GPU pre-training over trillions of tokens.'
      }
    ]
  },

  'course-nlp-python': {
    courseId: 'course-nlp-python',
    courseTitle: 'NLP in Python',
    category: 'Artificial Intelligence Core',
    summary: 'Master computational linguistics, subword tokenization, word embeddings, sequence modeling, Multi-Head Transformer Self-Attention, BERT/GPT architectures, and LoRA fine-tuning.',
    realWorldAnalogy: 'Think of Natural Language Processing like building a universal mathematical dictionary for human thought. Words and phrases are not just letters; they are multidimensional coordinates in space where words with similar contextual meanings cluster together like stars in a galaxy.',
    keyConcepts: [
      {
        heading: '1. Subword Tokenization & Dense Vector Spaces',
        explanation: 'Byte-Pair Encoding (BPE) breaks vocabulary into subword units, mapped into high-dimensional embedding spaces where semantic relationships reflect vector arithmetic.',
        codeOrExample: '# Semantic Vector Arithmetic:\n# vector("King") - vector("Man") + vector("Woman") ≈ vector("Queen")'
      },
      {
        heading: '2. Scaled Dot-Product Self-Attention',
        explanation: 'Compute query-key affinities to dynamically weight which surrounding words provide context to each token in parallel across multi-head projections.',
        codeOrExample: 'Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V'
      },
      {
        heading: '3. Parameter-Efficient Fine-Tuning (PEFT / LoRA)',
        explanation: 'Freeze the massive pre-trained weight matrices W and train low-rank decomposition matrices A and B (rank r << d), updating under 1% of total parameters.',
        codeOrExample: 'from peft import LoraConfig, get_peft_model\nconfig = LoraConfig(r=8, lora_alpha=32, target_modules=["q_proj", "v_proj"])\npeft_model = get_peft_model(base_model, config)'
      }
    ],
    cheatsheet: [
      'Self-Attention Complexity: O(N^2 * d) where N is sequence length and d is dimension',
      'Temperature Sampling: P(token_i) = exp(logit_i / T) / sum(exp(logit_j / T))',
      'LoRA Decomposition: W_updated = W_frozen + (B * A) * (alpha / r)',
      'Perplexity (PPL): Exponential of cross-entropy loss measuring language model uncertainty'
    ],
    commonPitfalls: [
      'Applying quadratic O(N^2) vanilla attention to ultra-long 100,000-token documents without FlashAttention or chunking.',
      'Training language models on raw text without Unicode normalization (causing broken subword token splits).',
      'Overfitting small domain datasets during full-parameter fine-tuning instead of using LoRA or prompt tuning.'
    ],
    interviewPrep: [
      {
        question: 'Why did the Transformer architecture replace recurrent neural networks (RNNs and LSTMs) in modern NLP?',
        answer: 'RNNs process tokens sequentially step-by-step, creating an architectural bottleneck that prevents parallel GPU computation and suffers from vanishing gradients over long sequences. Transformers process all tokens simultaneously using multi-head self-attention, allowing massive distributed GPU pre-training over trillions of tokens.'
      }
    ]
  }
};

// Course Notes getter ensuring all registered courses receive authoritative notes
export function getCourseNotes(courseId: string, courseTitle?: string): CourseNote {
  if (COURSE_NOTES_REGISTRY[courseId]) {
    return COURSE_NOTES_REGISTRY[courseId];
  }

  // Fallback if course ID is completely unknown
  console.warn(`[CourseNotesRegistry] Unknown courseId: ${courseId}. Requested title: ${courseTitle}`);
  return {
    courseId,
    courseTitle: courseTitle || courseId,
    category: 'Core Curriculum',
    summary: `Comprehensive study notes for ${courseTitle || courseId}.`,
    realWorldAnalogy: `Real-world systems application for ${courseTitle || courseId}.`,
    keyConcepts: [
      {
        heading: 'Core Architecture',
        explanation: `Foundational principles and operational standards for ${courseTitle || courseId}.`
      }
    ],
    cheatsheet: ['Enforce clean design boundaries', 'Validate edge cases defensively'],
    commonPitfalls: ['Neglecting edge cases', 'Skipping automated tests'],
    interviewPrep: [
      {
        question: `What are the core best practices for ${courseTitle || courseId}?`,
        answer: `Enforce modular design, write automated tests, and handle errors defensively.`
      }
    ]
  };
}
