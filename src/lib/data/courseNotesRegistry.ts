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
    summary: 'Master strongly-typed Java syntax, JVM bytecode execution, Object-Oriented Programming (OOP) pillars, Exception handling, and collections.',
    realWorldAnalogy: 'Java is like a heavy-duty industrial assembly plant. Strict blueprints (Classes) enforce safety rules so machines never break on production lines.',
    keyConcepts: [
      {
        heading: '1. OOP Pillars: Encapsulation & Abstraction',
        explanation: 'Hiding internal state variables behind private access modifiers and exposing safe public getters and setters.',
        codeOrExample: 'public class BankAccount {\n    private double balance;\n    public void deposit(double amt) {\n        if (amt > 0) balance += amt;\n    }\n}'
      },
      {
        heading: '2. Polymorphism & Method Overriding',
        explanation: 'Subclasses providing specific implementations of methods declared in parent classes or interfaces.',
        codeOrExample: 'public interface PaymentProcessor {\n    boolean processPayment(double amount);\n}'
      }
    ],
    cheatsheet: [
      'Primitive vs Reference: int/boolean (Stack) vs String/Object (Heap)',
      'Collection List: List<String> list = new ArrayList<>();',
      'Try-With-Resources: try (BufferedReader br = new BufferedReader(...)) { ... }'
    ],
    commonPitfalls: [
      'NullPointerException (NPE) when calling methods on uninitialized object references.',
      'Comparing Strings with == instead of string1.equals(string2).',
      'Forgetting break statements inside classic switch cases.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between JVM, JRE, and JDK?',
        answer: 'JDK is the full development kit containing compiler tools; JRE is the runtime environment containing JVM libraries; JVM executes compiled bytecode.'
      }
    ]
  },

  'course-fullstack-js': {
    courseId: 'course-fullstack-js',
    courseTitle: 'Full-Stack JavaScript (React, Node.js & Web APIs)',
    category: 'Web Development',
    summary: 'Master asynchronous JS, ES6+ features, React Virtual DOM, state hooks, Node.js Express REST APIs, and client-server HTTP request cycles.',
    realWorldAnalogy: 'Think of Full-Stack JS like a modern restaurant. React is the interactive dining table menu, Node.js is the kitchen order system, and HTTP JSON is the food waiter.',
    keyConcepts: [
      {
        heading: '1. React State & Reactive UI Rendering',
        explanation: 'Components automatically re-render whenever state changes via hooks.',
        codeOrExample: 'const [count, setCount] = useState(0);\n<button onClick={() => setCount(count + 1)}>Count: {count}</button>'
      },
      {
        heading: '2. Express REST API Routes',
        explanation: 'Handling client HTTP requests (GET, POST, PUT, DELETE) and returning JSON data payloads.',
        codeOrExample: 'app.get("/api/users", (req, res) => {\n    res.json({ status: "success", data: users });\n});'
      }
    ],
    cheatsheet: [
      'Async/Await: const data = await fetch(url).then(r => r.json());',
      'Destructuring: const { name, age } = userProfile;',
      'Array Map: items.map(item => <ItemCard key={item.id} {...item} />)'
    ],
    commonPitfalls: [
      'Directly mutating state variables (`state.count = 5`) instead of using setter functions.',
      'Forgetting dependency arrays in `useEffect`, causing infinite re-render loops.',
      'Omitting unique `key` props on mapped JSX lists.'
    ],
    interviewPrep: [
      {
        question: 'How does the React Virtual DOM work?',
        answer: 'React keeps a lightweight virtual copy of the DOM in memory. On state changes, it diffs the virtual tree with the snapshot and updates ONLY changed nodes in the real browser DOM.'
      }
    ]
  },

  'course-ai-eng': {
    courseId: 'course-ai-eng',
    courseTitle: 'AI Engineering, LLMs & PyTorch',
    category: 'Artificial Intelligence',
    summary: 'Master neural network architecture, matrix tensor operations, PyTorch training loops, prompt engineering, RAG vector search, and LLM fine-tuning.',
    realWorldAnalogy: 'AI Engineering is like training a blindfolded master sculptor. Loss functions act as tactile feedback, gradient descent adjusts chisel pressure, and weights shape the final sculpture.',
    keyConcepts: [
      {
        heading: '1. PyTorch Tensors & Forward Pass',
        explanation: 'Multi-dimensional mathematical arrays flowing through neural network layers.',
        codeOrExample: 'import torch\nx = torch.tensor([[1.0, 2.0], [3.0, 4.0]])\nlinear = torch.nn.Linear(2, 1)\noutput = linear(x)'
      },
      {
        heading: '2. RAG (Retrieval-Augmented Generation)',
        explanation: 'Enhancing LLM responses by fetching relevant document chunks from a 3D vector database in real-time.',
        codeOrExample: 'embeddings = model.encode(user_query)\ncontext = vector_db.query(embeddings, top_k=3)'
      }
    ],
    cheatsheet: [
      'Tensor Shape: tensor.shape, tensor.reshape(new_shape)',
      'Optimizer Step: optimizer.zero_grad(); loss.backward(); optimizer.step()',
      'Cos Similarity: dot_product(a, b) / (norm(a) * norm(b))'
    ],
    commonPitfalls: [
      'Forgetting to run `zero_grad()` in PyTorch training loops (causes exploding gradients).',
      'Overfitting model weights on small training datasets without regularization.',
      'Passing un-normalized input vectors into cosine similarity search.'
    ],
    interviewPrep: [
      {
        question: 'What is RAG and why is it preferred over fine-tuning for enterprise docs?',
        answer: 'RAG dynamically retrieves real-time private enterprise context into prompts without expensive model retraining, avoiding hallucinations and reducing GPU costs.'
      }
    ]
  },

  'course-computer-fundamentals': {
    courseId: 'course-computer-fundamentals',
    courseTitle: 'Computer Literacy, Digital Productivity & OS Fundamentals',
    category: 'Universal Foundations',
    summary: 'Master operating system navigation, file systems, terminal CLI commands, keyboard shortcuts, cloud storage, browser developer tools, and digital security hygiene.',
    realWorldAnalogy: 'Operating systems are like air traffic control towers. The kernel directs CPU flight lanes, RAM is the temporary taxi runway, and SSD is the long-term hanger storage.',
    keyConcepts: [
      {
        heading: '1. File System Hierarchy & CLI Commands',
        explanation: 'Directories organize files hierarchically. Terminal CLI allows rapid text-based management.',
        codeOrExample: 'cd ~/documents\nmkdir project\nls -la\ncat config.json'
      },
      {
        heading: '2. Memory Hierarchy: RAM vs Storage',
        explanation: 'RAM is volatile high-speed temporary working memory; SSD/HDD is persistent long-term storage.',
        codeOrExample: 'CPU Cache (0.5ns) -> RAM (10ns) -> NVMe SSD (50,000ns)'
      }
    ],
    cheatsheet: [
      'CLI Navigation: `cd ..` (up), `pwd` (current directory), `rm -rf` (delete folder)',
      'Keyboard Shortcuts: Ctrl/Cmd + Z (Undo), Ctrl/Cmd + Shift + T (Reopen Tab)',
      'Browser DevTools: Inspect (Ctrl+Shift+I), Console log audit'
    ],
    commonPitfalls: [
      'Running destructive terminal commands without checking current directory (`pwd`).',
      'Not backing up critical files to cloud storage before system updates.',
      'Using identical weak passwords across work and personal email accounts.'
    ],
    interviewPrep: [
      {
        question: 'What is the main role of an Operating System Kernel?',
        answer: 'The Kernel is the core program that manages system hardware resources (CPU, RAM, Disk, IO devices) and provides a secure abstraction layer for software application execution.'
      }
    ]
  },

  'course-digital-accounting': {
    courseId: 'course-digital-accounting',
    courseTitle: 'Financial Accounting & Digital Taxation (B.Com / BBA)',
    category: 'Commerce & Accounting',
    summary: 'Master double-entry bookkeeping, debit vs credit rules, Tally Prime ERP workflows, GST tax returns, financial statements, and balance sheet audits.',
    realWorldAnalogy: 'Double-entry accounting is like a balanced precision seesaw. For every credit entry on the left side, there MUST be an equal debit entry on the right side to keep financial balance at 100%.',
    keyConcepts: [
      {
        heading: '1. Golden Rules of Accounting',
        explanation: 'Real Accounts (Debit what comes in, Credit what goes out), Personal Accounts (Debit receiver, Credit giver), Nominal Accounts (Debit expenses, Credit income).',
        codeOrExample: '// Debit: Cash Asset (+100,000 INR)\n// Credit: Sales Revenue (+100,000 INR)'
      },
      {
        heading: '2. Balance Sheet Equation',
        explanation: 'Total Assets must always equal Total Liabilities plus Owner Equity.',
        codeOrExample: 'Assets = Liabilities + Equity'
      }
    ],
    cheatsheet: [
      'Assets Increase = Debit; Assets Decrease = Credit',
      'Liabilities Increase = Credit; Liabilities Decrease = Debit',
      'GST Input Tax Credit (ITC) = Output GST Tax - Input GST Tax Paid'
    ],
    commonPitfalls: [
      'Mismatched trial balance due to single-entry posting mistakes.',
      'Mixing personal business expenses with corporate business bank accounts.',
      'Forgetting depreciation adjustments at year-end book closing.'
    ],
    interviewPrep: [
      {
        question: 'What is the difference between Accrual Accounting and Cash Accounting?',
        answer: 'Accrual accounting records revenues and expenses when earned or incurred regardless of when cash moves; Cash accounting records transactions only when physical cash changes hands.'
      }
    ]
  },

  'course-devops-cicd': {
    courseId: 'course-devops-cicd',
    courseTitle: 'DevOps, Docker & CI/CD Pipelines',
    category: 'Cloud & Infrastructure',
    summary: 'Master Linux administration, Docker containerization, GitHub Actions CI/CD pipelines, Kubernetes orchestration, and cloud infrastructure deployment.',
    realWorldAnalogy: 'Docker containers are like standardized intermodal shipping cargo containers. Regardless of whether a container holds electronics or coffee, cargo ships and trucks load them identically without worrying about internal contents.',
    keyConcepts: [
      {
        heading: '1. Dockerfile Container Blueprint',
        explanation: 'Declarative script defining environment layers, system dependencies, and application startup commands.',
        codeOrExample: 'FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ["npm", "start"]'
      },
      {
        heading: '2. Automated CI/CD Workflow Pipeline',
        explanation: 'GitHub Actions running automated unit tests on every code push before deploying to production.',
        codeOrExample: 'on: [push]\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: npm test'
      }
    ],
    cheatsheet: [
      'Docker Build: `docker build -t myapp:v1 .`',
      'Docker Run: `docker run -d -p 8080:80 myapp:v1`',
      'Docker Compose: `docker-compose up -d`'
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
  }
};

// Fallback notes generator for courses missing explicit customized notes
export function getCourseNotes(courseId: string, courseTitle: string): CourseNote {
  if (COURSE_NOTES_REGISTRY[courseId]) {
    return COURSE_NOTES_REGISTRY[courseId];
  }

  return {
    courseId,
    courseTitle,
    category: 'Core Curriculum',
    summary: `University-grade structured study notes for ${courseTitle}. Master foundational concepts, core syntax blueprints, industry production use cases, and interview preparation.`,
    realWorldAnalogy: `Think of ${courseTitle} as a standardized professional toolkit where every concept solves a specific high-scale industry problem.`,
    keyConcepts: [
      {
        heading: `1. Foundational Architecture of ${courseTitle}`,
        explanation: `Core mechanics, memory boundaries, and execution rules governing ${courseTitle}.`,
        codeOrExample: `// Production Implementation Blueprint for ${courseTitle}`
      },
      {
        heading: `2. Design Patterns & Best Practices`,
        explanation: `Structuring modular, scalable, and bug-free systems using ${courseTitle} standards.`,
        codeOrExample: `// Scalable Architecture Blueprint`
      }
    ],
    cheatsheet: [
      `Core Principle 1: Always enforce clean modular boundaries.`,
      `Core Principle 2: Optimize for Big-O execution efficiency.`,
      `Core Principle 3: Handle edge cases and null validations gracefully.`
    ],
    commonPitfalls: [
      `Neglecting edge case input validation.`,
      `Skipping automated unit testing before deployment.`,
      `Ignoring memory cleanup and resource management.`
    ],
    interviewPrep: [
      {
        question: `What are the core best practices for ${courseTitle}?`,
        answer: `Enforce clean modular design, write clean self-documenting code, cover critical edge cases with automated tests, and handle errors defensively.`
      }
    ]
  };
}
