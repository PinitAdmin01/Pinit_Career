import { LongLesson } from './longLessons';

/**
 * Data Structures & Algorithmic Optimizations (course-dsa-optim, prefix: dsa-optim):
 * 30 comprehensive long-format lessons (20-30 minutes each, >= 10 spoken minutes)
 * covering Big-O asymptotics, dynamic arrays, linked lists, stacks, queues,
 * hash tables, two pointers, sliding window, binary search, recursion, trees,
 * heaps, graph algorithms, dynamic programming, and flight path navigation capstone.
 */
export const DSA_WEB_LONG_LESSONS: LongLesson[] = [
{
  "day": 1,
  "title": "Time & Space Complexity (Big-O Asymptotics & Dominant Terms)",
  "goal": "Analyze asymptotic upper bounds, classify Big-O complexity tiers, drop non-dominant terms, and compute auxiliary memory overhead.",
  "minutes": 25,
  "recap": "Welcome to Data Structures & Algorithmic Optimizations. Today we establish the foundational mathematical language of software engineering: Big-O asymptotic analysis and space complexity bounds.",
  "parts": [
    {
      "title": "Asymptotic Upper Bounds & Growth Rates",
      "say": [
        "In enterprise software engineering, code must scale gracefully as user traffic and data volumes grow from thousands to millions of records.",
        "To measure how algorithms perform independently of specific hardware or CPU clock speeds, computer scientists use asymptotic Big-O notation.",
        "Formally, Big-O characterizes the mathematical upper bound on execution steps as the input size N approaches infinity.",
        "When an input size doubles from N to 2N, different complexity tiers scale according to predictable mathematical growth ratios.",
        "A constant time algorithm O(1) performs the exact same number of operations regardless of input size, yielding an execution ratio of 1.",
        "A linear algorithm O(N) doubles its operations when the input doubles, producing a growth ratio of approximately 2.",
        "A quadratic algorithm O(N^2) quadruples its operations when input size doubles, yielding a ratio of approximately 4.",
        "Understanding these scaling ratios allows engineers to test and identify algorithmic complexity tiers empirically through automated benchmarks.",
        "By focusing strictly on asymptotic growth rather than micro-benchmarks, we ensure algorithmic correctness that survives production scale."
      ],
      "example": "A flat-rate shipping envelope costs the exact same price whether you send one letter or four sheets (constant O(1)), whereas paying per ounce doubles your shipping fee when the weight doubles (linear O(N)).",
      "code": "function stepRatio(f: (n: number) => number, n: number): number {\n  return f(2 * n) / f(n);\n}\n\nconst constantFn = (_n: number) => 5;\nconst linearFn = (n: number) => 3 * n + 7;\nconst quadraticFn = (n: number) => 2 * n * n + 4 * n;\n\nconsole.log('O(1) ratio:', stepRatio(constantFn, 1000).toFixed(1));\nconsole.log('O(N) ratio:', stepRatio(linearFn, 1000).toFixed(1));\nconsole.log('O(N^2) ratio:', stepRatio(quadraticFn, 1000).toFixed(1));",
      "output": "O(1) ratio: 1.0\nO(N) ratio: 2.0\nO(N^2) ratio: 4.0",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines a step ratio testing function measuring how operation count scales when input doubles from N to 2N."
        },
        {
          "line": 9,
          "note": "Computes and logs empirical growth ratios matching O(1), O(N), and O(N^2) complexity classes."
        }
      ],
      "tryIt": "Add a cubic function n => n * n * n and observe that the ratio approaches 8 when input size doubles.",
      "check": {
        "question": "When doubling the input size N to 2N in a quadratic O(N^2) algorithm, how do the operations scale?",
        "options": [
          "Operations double (ratio ~ 2)",
          "Operations quadruple (ratio ~ 4)",
          "Operations remain identical (ratio ~ 1)"
        ],
        "answer": 1,
        "why": "Because (2N)^2 = 4N^2, doubling the input quadruples the computational operations in an O(N^2) algorithm."
      }
    },
    {
      "title": "Auxiliary Heap vs Call Stack Space Complexity",
      "say": [
        "Computational complexity encompasses not only execution duration but also the memory footprint an algorithm demands.",
        "Memory consumption divides into input space (the memory needed to hold the input dataset) and auxiliary space.",
        "Auxiliary space represents the extra working memory allocated by the algorithm to process the input.",
        "In modern runtimes like V8 and Node.js, auxiliary memory is distributed between the dynamic heap and the execution call stack.",
        "Heap space holds dynamically allocated objects, hash tables, and resizing arrays that persist beyond individual function frames.",
        "The call stack allocates fixed-size stack frames every time a function invokes another function or calls itself recursively.",
        "Each recursive stack frame retains local variables, arguments, and the return instruction pointer until the base case resolves.",
        "If a recursive function creates N recursive stack frames without tail-call optimization, auxiliary space is O(N).",
        "Exceeding the engine call stack limit triggers fatal RangeError: Maximum call stack size exceeded crashes in production systems."
      ],
      "example": "A cook keeping ingredients on a prep table (auxiliary heap storage) versus balancing a tall stack of plates where adding one more plate risks toppling the entire stack (call stack overflow).",
      "code": "interface MemoryAudit {\n  auxiliaryHeap: number;\n  callStackDepth: number;\n}\n\nfunction auditRecursiveDepth(n: number, currentDepth: number = 1): number {\n  if (n <= 1) return currentDepth;\n  return auditRecursiveDepth(n - 1, currentDepth + 1);\n}\n\nconst depth10 = auditRecursiveDepth(10);\nconst depth100 = auditRecursiveDepth(100);\nconsole.log(`Recursion depth for N=10: ${depth10}`);\nconsole.log(`Recursion depth for N=100: ${depth100}`);",
      "output": "Recursion depth for N=10: 10\nRecursion depth for N=100: 100",
      "codeNotes": [
        {
          "line": 6,
          "note": "Recursively tracks execution depth to model call stack frame growth proportional to input size N."
        },
        {
          "line": 11,
          "note": "Demonstrates linear O(N) call stack space overhead in unoptimized recursive traversals."
        }
      ],
      "tryIt": "Change the base case to n <= 2 and observe how the final stack depth adjusts accordingly.",
      "check": {
        "question": "Why does an unoptimized recursive algorithm with recursion depth N require O(N) auxiliary space?",
        "options": [
          "Because every recursive invocation pushes a new stack frame onto the memory call stack",
          "Because recursion always creates new dynamic arrays in the heap",
          "Because Node.js copies the entire program on each recursive step"
        ],
        "answer": 0,
        "why": "Each active function call requires a stack frame containing its arguments and return address until the base case finishes."
      }
    },
    {
      "title": "The Big-O Hierarchy & Dominant Term Simplification",
      "say": [
        "Real-world algorithmic functions often contain multiple computational steps yielding complex algebraic expressions.",
        "For example, an algorithm might perform 3N^2 comparisons, followed by 50N iterations, plus 1000 constant setup operations.",
        "The complete polynomial expression representing this runtime is f(N) = 3N^2 + 50N + 1000.",
        "As N grows toward millions or billions, the term with the highest growth rate completely dominates all other terms combined.",
        "When N = 1,000,000, N^2 is one trillion, while 50N is only 50 million and 1000 is utterly negligible.",
        "Consequently, asymptotic analysis drops all non-dominant terms and constant multiplicative factors.",
        "The Big-O hierarchy strictly establishes term dominance: O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N) < O(N!).",
        "Simplifying to the strictly dominant term allows engineers to communicate algorithmic trade-offs with absolute precision.",
        "Mastering term dominance prevents premature micro-optimizations that focus on constants while ignoring architectural complexity."
      ],
      "example": "In a corporate budget of 10 billion dollars, saving fifty dollars on paper clips or one thousand dollars on pencils does not affect the financial tier of the company.",
      "code": "const HIERARCHY: Record<string, number> = {\n  'O(1)': 1,\n  'O(log N)': 2,\n  'O(N)': 3,\n  'O(N log N)': 4,\n  'O(N^2)': 5,\n  'O(2^N)': 6,\n  'O(N!)': 7,\n};\n\nfunction getDominantTerm(terms: string[]): string {\n  let highest = terms[0];\n  for (const t of terms) {\n    if ((HIERARCHY[t] ?? 0) > (HIERARCHY[highest] ?? 0)) {\n      highest = t;\n    }\n  }\n  return highest;\n}\n\nconsole.log('Dominant in [O(1), O(N), O(log N)]:', getDominantTerm(['O(1)', 'O(N)', 'O(log N)']));\nconsole.log('Dominant in [O(N), O(N^2), O(N log N)]:', getDominantTerm(['O(N)', 'O(N^2)', 'O(N log N)']));",
      "output": "Dominant in [O(1), O(N), O(log N)]: O(N)\nDominant in [O(N), O(N^2), O(N log N)]: O(N^2)",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines the canonical Big-O growth hierarchy lookup mapping complexity classes to numeric ranking tiers."
        },
        {
          "line": 11,
          "note": "Scans candidate terms and selects the strictly dominant term according to asymptotic growth."
        }
      ],
      "tryIt": "Add 'O(2^N)' to the candidate terms array and observe that exponential complexity dominates polynomial time.",
      "check": {
        "question": "What is the simplified Big-O asymptotic complexity of f(N) = 5N^2 + 200N + 9000?",
        "options": [
          "O(N)",
          "O(N^2)",
          "O(5N^2 + 200N)"
        ],
        "answer": 1,
        "why": "Constants and lower-order terms (200N, 9000) are dropped, leaving the dominant quadratic term O(N^2)."
      }
    },
    {
      "title": "Logarithmic Halving & Binary Search Spaces",
      "say": [
        "Logarithmic complexity O(log N) represents one of the most powerful performance tiers in software engineering.",
        "Whenever an algorithm divides the problem search space in half at each successive step, it runs in logarithmic time.",
        "Mathematically, the logarithm base 2 of N answers the question: how many times can N be divided by 2 before reaching 1?",
        "For an array of 16 items, halving proceeds: 16 to 8 to 4 to 2 to 1, taking exactly 4 steps.",
        "For an array of 1,024 elements, binary search requires only 10 comparisons (2^10 = 1024).",
        "Even when searching a massive database of 1,048,576 records, logarithmic search finds any key in just 20 comparisons.",
        "At one billion records, an O(log N) search resolves in approximately 30 operations, compared to 1,000,000,000 in linear search.",
        "This exponential reduction in search steps is why B-trees, binary search trees, and bisecting algorithms power modern databases.",
        "Understanding logarithmic halving guarantees you can design indexing structures capable of handling billions of records effortlessly."
      ],
      "example": "Playing a guessing game between 1 and 100 where each guess of 'higher' or 'lower' eliminates half of all remaining numbers in one instant.",
      "code": "function countHalvingSteps(n: number): number {\n  let steps = 0;\n  let remaining = n;\n  while (remaining > 1) {\n    remaining = Math.floor(remaining / 2);\n    steps++;\n  }\n  return steps;\n}\n\nconsole.log('Steps to reduce 16 to 1:', countHalvingSteps(16));\nconsole.log('Steps to reduce 1024 to 1:', countHalvingSteps(1024));\nconsole.log('Steps to reduce 1048576 to 1:', countHalvingSteps(1048576));",
      "output": "Steps to reduce 16 to 1: 4\nSteps to reduce 1024 to 1: 10\nSteps to reduce 1048576 to 1: 20",
      "codeNotes": [
        {
          "line": 1,
          "note": "Models logarithmic reduction by halving input size until the base condition remaining <= 1 is met."
        },
        {
          "line": 10,
          "note": "Demonstrates that doubling or squaring input size only adds small constant steps in logarithmic algorithms."
        }
      ],
      "tryIt": "Pass n = 1_000_000_000 and verify that halving takes only ~30 steps to search a billion items.",
      "check": {
        "question": "How many steps does an O(log N) binary search require to find a record in a sorted array of 1,024 elements?",
        "options": [
          "512 steps",
          "10 steps",
          "100 steps"
        ],
        "answer": 1,
        "why": "Because 2^10 = 1024, halving the search space takes exactly 10 iterations to locate any element."
      }
    },
    {
      "title": "Amortized Complexity & Aggregate Capacity Doubling",
      "say": [
        "In algorithm design, certain operations occasionally perform expensive work but do so very infrequently.",
        "Evaluating these algorithms solely by their worst-case single execution creates a misleading perception of their true cost.",
        "Amortized complexity analyzes the average cost per operation over a long sequence of N consecutive operations.",
        "The standard dynamic array push operation illustrates amortized analysis with geometric capacity doubling.",
        "When an array has spare capacity, inserting an element takes strict O(1) constant time.",
        "When the array buffer fills, the runtime allocates a new buffer of double the capacity and copies all N existing elements over.",
        "While this specific resizing operation takes O(N) linear time, it occurs exponentially less frequently as the array expands.",
        "Summing the copy costs across N pushes yields N + N/2 + N/4 + ... + 1, which mathematically sums to strictly less than 2N.",
        "Dividing 2N total operations by N pushes proves that the amortized cost per append is strictly O(1) constant time."
      ],
      "example": "Buying a large 100-pack box of ink cartridges all at once feels expensive on that one day, but the amortized cost per printed document over the year is pennies.",
      "code": "function simulateCapacityDoubling(pushes: number): { totalCopies: number; averageCost: string } {\n  let capacity = 1;\n  let size = 0;\n  let totalCopies = 0;\n\n  for (let i = 0; i < pushes; i++) {\n    if (size === capacity) {\n      capacity *= 2;\n      totalCopies += size; // Copy existing elements to new buffer\n    }\n    size++;\n    totalCopies++; // 1 unit of work for current insertion\n  }\n\n  return { totalCopies, averageCost: (totalCopies / pushes).toFixed(2) };\n}\n\nconst stat16 = simulateCapacityDoubling(16);\nconst stat1024 = simulateCapacityDoubling(1024);\nconsole.log(`N=16 total ops: ${stat16.totalCopies}, avg per push: ${stat16.averageCost}`);\nconsole.log(`N=1024 total ops: ${stat1024.totalCopies}, avg per push: ${stat1024.averageCost}`);",
      "output": "N=16 total ops: 31, avg per push: 1.94\nN=1024 total ops: 2047, avg per push: 2.00",
      "codeNotes": [
        {
          "line": 7,
          "note": "Triggers geometric buffer doubling when size matches current capacity, accounting for element copying overhead."
        },
        {
          "line": 18,
          "note": "Proves empirically that total operations bounded by 2N result in an amortized O(1) cost of ~2.00 operations per push."
        }
      ],
      "tryIt": "Simulate 65536 pushes and verify that the average cost remains strictly bounded at 2.00.",
      "check": {
        "question": "What is the amortized time complexity of appending an element to a dynamic array that doubles its capacity when full?",
        "options": [
          "O(N) linear time",
          "O(1) constant time",
          "O(N^2) quadratic time"
        ],
        "answer": 1,
        "why": "Geometric doubling ensures element copies sum to less than 2N, making the average cost per push O(1) amortized."
      }
    },
    {
      "title": "Production Complexity Auditing & Complexity Verification",
      "say": [
        "In production deployment environments, unexpected algorithmic regressions can degrade performance without raising syntax errors.",
        "A feature that runs instantaneously in local development with 10 test records can cause severe latency spikes with 100,000 production records.",
        "Automated performance verification suites guard against hidden quadratic O(N^2) loops and accidental regressions.",
        "By measuring the ratio of execution iterations when input size doubles from 1,000 to 2,000, testing harnesses classify complexity tiers.",
        "If doubling the input size results in a ratio near 1.0, the routine exhibits constant O(1) complexity.",
        "If the operations scale by approximately 2.0, the algorithm belongs to the linear O(N) tier.",
        "If the operation ratio reaches approximately 4.0 or higher, the test harness flags an unapproved quadratic O(N^2) implementation.",
        "Integrating complexity classification into CI/CD pipelines ensures that algorithms meet their theoretical Big-O contracts before deployment.",
        "Combining formal asymptotic proofs with automated empirical validation guarantees rock-solid, production-ready software architectures."
      ],
      "example": "An automobile factory testing a sports car on a dynamometer: measuring fuel consumption at 50 mph vs 100 mph to verify that wind resistance matches aerodynamic specifications.",
      "code": "function classifyAlgorithmTier(fn: (n: number) => number): string {\n  const t1 = fn(1000);\n  const t2 = fn(2000);\n  const ratio = t2 / (t1 || 1);\n  if (ratio < 1.4) return 'O(1)';\n  if (ratio < 2.5) return 'O(N)';\n  return 'O(N^2)';\n}\n\nconsole.log('Classification of n => 42:', classifyAlgorithmTier(() => 42));\nconsole.log('Classification of n => 5 * n:', classifyAlgorithmTier(n => 5 * n));\nconsole.log('Classification of n => n * n:', classifyAlgorithmTier(n => n * n));",
      "output": "Classification of n => 42: O(1)\nClassification of n => 5 * n: O(N)\nClassification of n => n * n: O(N^2)",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines an automated complexity tier classifier testing operation ratios across doubled input sizes."
        },
        {
          "line": 9,
          "note": "Classifies constant, linear, and quadratic mathematical scaling profiles accurately in unit test environments."
        }
      ],
      "tryIt": "Pass a function representing n * Math.log2(n) and observe where its ratio falls between linear and quadratic.",
      "check": {
        "question": "How can CI/CD test suites detect an accidental quadratic O(N^2) regression in a function expected to run in O(N)?",
        "options": [
          "By measuring the ratio of operations when input size is doubled; a ratio near 4 reveals quadratic scaling",
          "By checking if the source file contains more than 10 lines of code",
          "By verifying that the function return value is positive"
        ],
        "answer": 0,
        "why": "Doubling input size in an O(N^2) routine quadruples operations (ratio ~ 4), compared to doubling (ratio ~ 2) in O(N)."
      }
    }
  ],
  "summary": [
    "Big-O notation establishes asymptotic upper bounds, focusing on how algorithms scale as N approaches infinity.",
    "Space complexity distinguishes between auxiliary heap storage and execution call stack frames.",
    "Non-dominant terms and constant multipliers vanish asymptotically, simplifying polynomials to their highest-order term.",
    "Logarithmic complexity O(log N) repeatedly halves the problem space, enabling efficient search across billions of records.",
    "Geometric capacity doubling ensures dynamic array push operations achieve O(1) amortized time."
  ],
  "projectStep": {
    "title": "Algorithmic Complexity Tier Analyzer",
    "steps": [
      "Implement stepRatio benchmarking to test computational growth across doubled input sizes.",
      "Construct a Big-O hierarchy dictionary to resolve strictly dominant polynomial terms.",
      "Validate auxiliary call stack depth bounds to protect against stack overflow exceptions."
    ]
  }
},
{
  "day": 2,
  "title": "Dynamic Arrays & Amortized Geometric Resizing",
  "goal": "Build a resizable array data structure supporting capacity doubling, geometric expansion, and amortized O(1) appends.",
  "minutes": 25,
  "recap": "Yesterday we learned Big-O asymptotic analysis and space complexity. Today we build the most ubiquitous primitive in computing: the dynamically resizable contiguous array.",
  "parts": [
    {
      "title": "Contiguous Memory Allocation & Hardware Cache Locality",
      "say": [
        "In physical hardware architectures, RAM is organized into sequential byte addresses managed by memory controllers.",
        "Static and dynamic arrays allocate contiguous blocks of physical memory, placing consecutive elements adjacent to one another.",
        "Contiguous memory layout provides an immense hardware advantage known as spatial cache locality.",
        "When the CPU reads an array index from main memory, the hardware cache controller loads an entire 64-byte cache line into L1 cache.",
        "Iterating sequentially through an array results in rapid L1/L2 cache hits, running orders of magnitude faster than pointer chasing.",
        "Because elements are contiguous and uniform in byte size, calculating the memory address of index i takes exact O(1) time.",
        "The formula baseAddress + i * elementByteSize directly computes any memory address without scanning intermediate values.",
        "However, contiguous allocation introduces a fundamental challenge: when the allocated block fills up, adjacent memory cannot simply be commandeered.",
        "Understanding contiguous allocation explains why arrays offer lightning-fast sequential access but require strategic resizing mechanisms."
      ],
      "example": "A row of adjacent lockers at an airport terminal: finding locker number 4 is instantaneous because you know exactly how many feet each door occupies.",
      "code": "interface MemoryBuffer<T> {\n  capacity: number;\n  length: number;\n  data: (T | undefined)[];\n}\n\nfunction createBuffer<T>(cap: number): MemoryBuffer<T> {\n  return { capacity: cap, length: 0, data: new Array(cap) };\n}\n\nconst buf = createBuffer<number>(4);\nbuf.data[0] = 100;\nbuf.length = 1;\nconsole.log(`Buffer capacity: ${buf.capacity}, length: ${buf.length}, item 0: ${buf.data[0]}`);",
      "output": "Buffer capacity: 4, length: 1, item 0: 100",
      "codeNotes": [
        {
          "line": 1,
          "note": "Models a contiguous memory buffer tracking allocated capacity versus currently used length."
        },
        {
          "line": 11,
          "note": "Initializes a fixed buffer and sets an element with direct O(1) indexing."
        }
      ],
      "tryIt": "Store elements at indices 1 and 2, increment length to 3, and log the updated buffer structure.",
      "check": {
        "question": "Why do contiguous arrays execute sequential iterations significantly faster than linked pointer structures?",
        "options": [
          "Arrays exploit CPU spatial cache locality by loading entire cache lines into L1 hardware cache",
          "Arrays encrypt memory addresses for faster bus transfers",
          "Linked structures always require garbage collection on every read"
        ],
        "answer": 0,
        "why": "Contiguous memory allows the CPU cache controller to prefetch adjacent elements into high-speed L1/L2 caches."
      }
    },
    {
      "title": "Geometric Capacity Doubling Architecture",
      "say": [
        "When a fixed-capacity buffer becomes completely full, appending an additional element requires allocating a new, larger buffer.",
        "A naive resizing strategy might increase capacity by a small constant amount, such as adding 10 slots each time.",
        "However, arithmetic expansion requires copying all N existing elements on every single 10-item interval, yielding quadratic O(N^2) total cost.",
        "To achieve optimal performance, dynamic arrays employ geometric expansion, typically doubling capacity (growth factor of 2.0).",
        "When capacity expands from C to 2C, the number of empty slots added is proportional to the current size of the collection.",
        "This geometric progression means that as the array grows larger, resizing operations become exponentially rarer.",
        "The element copy operations across successive doublings form the geometric series 1 + 2 + 4 + 8 + ... + N = 2N - 1.",
        "Dividing total copy operations by N appends confirms that geometric doubling guarantees O(1) amortized runtime.",
        "Production engines like V8 and Python lists use geometric growth factors between 1.5 and 2.0 to balance memory and speed."
      ],
      "example": "Moving to a home that is twice as large every time your family outgrows the current space, ensuring you only pack and move boxes a handful of times in your lifetime.",
      "code": "class SimpleDynamicArray<T> {\n  private buffer: (T | undefined)[];\n  private count = 0;\n\n  constructor(initialCapacity = 2) {\n    this.buffer = new Array(initialCapacity);\n  }\n\n  get capacity(): number { return this.buffer.length; }\n  get size(): number { return this.count; }\n\n  push(item: T): void {\n    if (this.count === this.buffer.length) {\n      const newBuf = new Array(this.buffer.length * 2);\n      for (let i = 0; i < this.count; i++) newBuf[i] = this.buffer[i];\n      this.buffer = newBuf;\n    }\n    this.buffer[this.count++] = item;\n  }\n}\n\nconst arr = new SimpleDynamicArray<string>(2);\narr.push('a'); arr.push('b');\nconsole.log(`Size: ${arr.size}, Capacity: ${arr.capacity}`);\narr.push('c');\nconsole.log(`After 3rd push -> Size: ${arr.size}, Capacity: ${arr.capacity}`);",
      "output": "Size: 2, Capacity: 2\nAfter 3rd push -> Size: 3, Capacity: 4",
      "codeNotes": [
        {
          "line": 12,
          "note": "Detects when count equals capacity and allocates a new array buffer with double the previous capacity."
        },
        {
          "line": 26,
          "note": "Demonstrates that the third push doubles capacity from 2 to 4 while preserving existing items."
        }
      ],
      "tryIt": "Push elements 'd' and 'e' to trigger a second doubling from capacity 4 to 8.",
      "check": {
        "question": "Why is geometric doubling mathematically superior to adding a fixed constant capacity (e.g. +10) on each resize?",
        "options": [
          "Fixed additions cause O(N^2) cumulative copy overhead, whereas doubling yields O(1) amortized appends",
          "Doubling reduces the amount of RAM consumed on small arrays",
          "Fixed additions cause integer overflow errors in V8"
        ],
        "answer": 0,
        "why": "Fixed additions trigger frequent resizing loops totaling O(N^2) work, while doubling distributes copies over exponentially longer intervals."
      }
    },
    {
      "title": "Random Access & Bounds Checking Invariants",
      "say": [
        "The defining capability of array-based data structures is constant-time random access by numeric index.",
        "Unlike sequential structures that must traverse nodes from head to tail, an array computes element locations instantaneously.",
        "However, production systems must enforce strict boundary validation to prevent out-of-bounds memory corruption or silent undefined bugs.",
        "In low-level languages like C/C++, accessing an index outside allocated boundaries results in buffer overflow vulnerabilities.",
        "In JavaScript and TypeScript, accessing out-of-bounds indices returns undefined without throwing errors, causing subtle downstream bugs.",
        "A robust production DynamicArray class exposes an explicit get(index) method that validates 0 <= index < size.",
        "If a consumer attempts to read a negative index or an index greater than or equal to current size, it throws a RangeError.",
        "Enforcing strict bounds invariants ensures that bugs fail loudly and immediately at the call site rather than propagating silently.",
        "Mastering bounds checking bridges the gap between raw memory performance and production software reliability."
      ],
      "example": "A hotel elevator with buttons for floors 1 through 10: pressing floor 99 triggers an invalid floor buzzer rather than dropping passengers into an abyss.",
      "code": "class BoundedArray<T> {\n  private items: T[] = [];\n\n  append(val: T): void { this.items.push(val); }\n\n  get(index: number): T {\n    if (index < 0 || index >= this.items.length) {\n      throw new RangeError(`Index ${index} out of bounds for length ${this.items.length}`);\n    }\n    return this.items[index];\n  }\n}\n\nconst ba = new BoundedArray<number>();\nba.append(10); ba.append(20); ba.append(30);\nconsole.log(`Element at index 1: ${ba.get(1)}`);\ntry {\n  ba.get(5);\n} catch (err: any) {\n  console.log(`Caught error: ${err.message}`);\n}",
      "output": "Element at index 1: 20\nCaught error: Index 5 out of bounds for length 3",
      "codeNotes": [
        {
          "line": 6,
          "note": "Validates that requested index falls strictly within the active length [0, length - 1]."
        },
        {
          "line": 17,
          "note": "Catches out-of-bounds access and produces clear descriptive error telemetry."
        }
      ],
      "tryIt": "Attempt to call ba.get(-1) and verify that the negative index is correctly intercepted and rejected.",
      "check": {
        "question": "What is the primary benefit of defensive bounds checking in a dynamic array get() method?",
        "options": [
          "It accelerates memory bus transmission speeds",
          "It halts execution immediately on invalid access, preventing silent undefined propagation and bugs",
          "It reduces the size of the JavaScript bundle"
        ],
        "answer": 1,
        "why": "Explicit bounds checking prevents silent failures where undefined values corrupt subsequent business logic calculations."
      }
    },
    {
      "title": "In-Place Deletion & Two-Pointer Compaction",
      "say": [
        "While appending to the end of a dynamic array is fast, removing elements from arbitrary positions presents challenges.",
        "Deleting an element from the middle of an array leaves an empty gap in the contiguous sequence.",
        "To preserve contiguous ordering, all elements to the right of the deleted position must be shifted left by one index.",
        "A single arbitrary deletion therefore requires O(N) linear time in the worst case.",
        "When filtering or removing multiple target elements from an array, naive implementations call splice() repeatedly, causing O(N^2) degradation.",
        "The optimal production pattern for multi-element removal is the Two-Pointer Compaction algorithm running in O(N) time and O(1) space.",
        "One pointer (read) scans every element from index 0 to N-1, while a second pointer (write) marks the position of valid elements.",
        "Whenever read encounters an element that should be retained, it copies it to index write and advances write by one.",
        "This in-place compaction eliminates all target values in a single pass without allocating temporary secondary arrays."
      ],
      "example": "A street cleaner sweeping trash off a curb: moving forward continuously, pushing valid parked bikes into a tidy line and sweeping away empty cans without backtracking.",
      "code": "function removeElement(nums: number[], val: number): number {\n  let write = 0;\n  for (let read = 0; read < nums.length; read++) {\n    if (nums[read] !== val) {\n      nums[write] = nums[read];\n      write++;\n    }\n  }\n  return write;\n}\n\nconst numbers = [3, 2, 2, 3];\nconst newLen = removeElement(numbers, 3);\nconsole.log(`New length: ${newLen}`);\nconsole.log(`Modified slice: [${numbers.slice(0, newLen).join(', ')}]`);",
      "output": "New length: 2\nModified slice: [2, 2]",
      "codeNotes": [
        {
          "line": 2,
          "note": "Initializes write pointer at index 0 to record valid non-target values."
        },
        {
          "line": 12,
          "note": "Demonstrates in-place compaction removing all 3s in a single O(N) scan without auxiliary memory."
        }
      ],
      "tryIt": "Pass [0, 1, 2, 2, 3, 0, 4, 2] with target 2 and inspect the compacted result [0, 1, 3, 0, 4].",
      "check": {
        "question": "Why is the two-pointer compaction technique superior to calling array.splice() in a loop to remove elements?",
        "options": [
          "Calling splice() repeatedly incurs O(N^2) element-shifting overhead, whereas two-pointers runs in strict O(N) single-pass time",
          "Splice cannot delete numbers in JavaScript",
          "Two-pointer compaction requires allocating double the heap memory"
        ],
        "answer": 0,
        "why": "Repeated splice calls shift trailing elements on each deletion, turning an O(N) task into an O(N^2) performance bottleneck."
      }
    },
    {
      "title": "Buffer Shrinking & Memory Leak Prevention",
      "say": [
        "A truly production-grade dynamic array must manage memory symmetrically during both expansion and contraction.",
        "If an array expands to hold one million items and then pops 999,999 of them, keeping a 1,000,000-slot buffer wastes memory.",
        "However, shrinking the buffer immediately when size drops below 50 percent capacity creates a dangerous issue called thrashing.",
        "If an array doubles at 100 percent and shrinks at 49 percent, alternating push and pop operations at the boundary triggers O(N) resizes on every turn.",
        "To avoid thrashing, dynamic arrays employ hysteresis: doubling at 100 percent capacity but shrinking only when utilization drops to 25 percent (one-quarter).",
        "When size reaches capacity / 4, the buffer shrinks by half to capacity / 2, maintaining a healthy buffer margin.",
        "Additionally, popping an element from an array of object references must overwrite the slot with undefined.",
        "If the array retains the reference in an unused slot, the JavaScript garbage collector cannot reclaim the object, causing memory leaks.",
        "Implementing hysteresis and clearing dormant references guarantees high-performance, leak-free memory lifecycle management."
      ],
      "example": "A restaurant keeping extra dining tables in reserve: only closing down a dining section when occupancy drops to 25%, preventing servers from endlessly folding and unfolding tables as individual guests arrive and leave.",
      "code": "class ShrinkingArray<T> {\n  private buffer: (T | undefined)[];\n  private count = 0;\n\n  constructor(cap = 4) { this.buffer = new Array(cap); }\n\n  push(val: T): void {\n    if (this.count === this.buffer.length) {\n      const next = new Array(this.buffer.length * 2);\n      for (let i = 0; i < this.count; i++) next[i] = this.buffer[i];\n      this.buffer = next;\n    }\n    this.buffer[this.count++] = val;\n  }\n\n  pop(): T | undefined {\n    if (this.count === 0) return undefined;\n    const item = this.buffer[--this.count];\n    this.buffer[this.count] = undefined; // prevent memory leak\n    if (this.count > 0 && this.count <= Math.floor(this.buffer.length / 4)) {\n      const shrunk = new Array(Math.max(4, Math.floor(this.buffer.length / 2)));\n      for (let i = 0; i < this.count; i++) shrunk[i] = this.buffer[i];\n      this.buffer = shrunk;\n    }\n    return item;\n  }\n\n  get capacity(): number { return this.buffer.length; }\n}\n\nconst sa = new ShrinkingArray<number>(4);\nsa.push(1); sa.push(2); sa.push(3); sa.push(4); sa.push(5);\nconsole.log(`After 5 pushes: capacity = ${sa.capacity}`);\nsa.pop(); sa.pop(); sa.pop(); sa.pop();\nconsole.log(`After 4 pops: capacity = ${sa.capacity}`);",
      "output": "After 5 pushes: capacity = 8\nAfter 4 pops: capacity = 4",
      "codeNotes": [
        {
          "line": 20,
          "note": "Clears reference to undefined so garbage collector can reclaim dereferenced objects immediately."
        },
        {
          "line": 21,
          "note": "Applies quarter-capacity hysteresis check (size <= capacity / 4) before halving the buffer."
        }
      ],
      "tryIt": "Push 10 elements and pop them all, checking the capacity after each pop to see the hysteresis threshold in action.",
      "check": {
        "question": "Why should a dynamic array wait until utilization drops to 25% capacity before halving the buffer?",
        "options": [
          "To prevent rapid thrashing between doubling and halving if a program alternates push and pop at the boundary",
          "Because V8 crashes if an array is halved at 50% capacity",
          "To force all elements to be converted to floating point numbers"
        ],
        "answer": 0,
        "why": "A 25% threshold (hysteresis) ensures that subsequent pushes or pops have ample buffer space before requiring another reallocation."
      }
    },
    {
      "title": "Production DynamicArray Engine Implementation",
      "say": [
        "We now consolidate contiguous allocation, geometric capacity doubling, bounds checking, and size tracking into a complete class.",
        "Our DynamicArray class exposes a production-ready API matching modern standard library collections.",
        "The constructor accepts an optional initialCapacity parameter, defaulting to 2 slots.",
        "The push(val) method appends elements, triggering automatic capacity doubling whenever length reaches capacity.",
        "The get(index) method returns the element at the specified index or undefined if the index is out of bounds.",
        "The size() and capacity() helper methods provide immediate visibility into internal memory utilization.",
        "Unit tests verify that capacity doubles from 2 to 4 on the third push, and elements are retrieved accurately by index.",
        "Writing data structures from foundational primitives demystifies high-level abstractions like JavaScript arrays and Python lists.",
        "You now possess the architectural insight to reason about memory allocation, cache locality, and amortized efficiency."
      ],
      "example": "A civil engineer building a modular bridge: inspecting every bolt and beam to understand exactly how the structure supports tons of daily highway traffic.",
      "code": "class ProductionDynamicArray<T> {\n  private storage: (T | undefined)[];\n  private length = 0;\n\n  constructor(initialCap = 2) { this.storage = new Array(initialCap); }\n\n  push(val: T): void {\n    if (this.length === this.storage.length) {\n      const bigger = new Array(this.storage.length * 2);\n      for (let i = 0; i < this.length; i++) bigger[i] = this.storage[i];\n      this.storage = bigger;\n    }\n    this.storage[this.length++] = val;\n  }\n\n  get(idx: number): T | undefined {\n    return (idx >= 0 && idx < this.length) ? this.storage[idx] : undefined;\n  }\n\n  size(): number { return this.length; }\n  capacity(): number { return this.storage.length; }\n}\n\nconst dyn = new ProductionDynamicArray<number>(2);\ndyn.push(10); dyn.push(20);\nconsole.log(`Init cap: ${dyn.capacity()}, size: ${dyn.size()}`);\ndyn.push(30);\nconsole.log(`Doubled cap: ${dyn.capacity()}, size: ${dyn.size()}`);\nconsole.log(`Elements: [${dyn.get(0)}, ${dyn.get(1)}, ${dyn.get(2)}]`);",
      "output": "Init cap: 2, size: 2\nDoubled cap: 4, size: 3\nElements: [10, 20, 30]",
      "codeNotes": [
        {
          "line": 6,
          "note": "Pushes an element with automated capacity doubling when capacity limit is reached."
        },
        {
          "line": 15,
          "note": "Provides O(1) random access lookup guarded by boundary validation."
        }
      ],
      "tryIt": "Instantiate a DynamicArray with initial capacity 1, push 4 items, and log capacity changes at each step.",
      "check": {
        "question": "In class ProductionDynamicArray, what is the time complexity of get(index) and the amortized complexity of push(val)?",
        "options": [
          "get is O(1) and push is O(1) amortized",
          "get is O(N) and push is O(N)",
          "get is O(log N) and push is O(1)"
        ],
        "answer": 0,
        "why": "Indexing into contiguous memory is strictly O(1) constant time, and geometric doubling ensures appends average O(1) amortized time."
      }
    }
  ],
  "summary": [
    "Contiguous array storage provides hardware spatial cache locality, loading entire cache lines into L1/L2 caches.",
    "Geometric capacity doubling ensures element copies sum to less than 2N, achieving O(1) amortized appends.",
    "Strict bounds checking prevents silent undefined propagation and bugs in production codebases.",
    "Two-pointer compaction removes target elements in a single O(N) pass without secondary array allocations.",
    "Buffer shrinking with 25% utilization hysteresis eliminates rapid resizing thrashing."
  ],
  "projectStep": {
    "title": "Custom Dynamic Array with Capacity Doubling",
    "steps": [
      "Implement the DynamicArray class with initial capacity 2.",
      "Implement geometric capacity doubling on buffer overflow.",
      "Implement random access get(index), size(), and capacity() methods."
    ]
  }
},
{
  "day": 3,
  "title": "Singly & Doubly Linked Lists & Pointer Node Manipulation",
  "goal": "Master pointer manipulation, head/tail insertions, node deletions, sentinel dummy nodes, and fast/slow pointer cycle detection.",
  "minutes": 25,
  "recap": "Yesterday we built contiguous dynamic arrays. Today we explore node-and-pointer architectures: singly and doubly linked lists.",
  "parts": [
    {
      "title": "ListNode Node Anatomy & Pointer Dereferencing",
      "say": [
        "Unlike arrays, linked lists do not store elements in contiguous blocks of physical memory.",
        "Instead, each element resides in an independently allocated heap node containing a value payload and a pointer to the next node.",
        "A singly linked list node is formally represented as an object with two properties: 'val' and 'next'.",
        "The 'val' field stores the domain data, while 'next' holds a direct memory reference to the subsequent node, terminating in null.",
        "Because nodes can be scattered non-contiguously throughout the heap, linked lists lack O(1) index-based random access.",
        "To find the k-th element, an algorithm must start at the head pointer and traverse pointers sequentially in O(K) time.",
        "However, linked lists excel at insertion and deletion at known positions: splicing a node takes exact O(1) pointer updates.",
        "Inserting or deleting at the head of a linked list requires zero element shifting, making it an ideal primitive for stacks and queues.",
        "Mastering pointer dereferencing and link traversal is the essential gateway to complex tree and graph data structures."
      ],
      "example": "A scavenger hunt where each clue contains a message and directions leading to the location of the next hidden clue.",
      "code": "interface ListNode<T> {\n  val: T;\n  next: ListNode<T> | null;\n}\n\nfunction printList<T>(head: ListNode<T> | null): string {\n  const vals: T[] = [];\n  let curr = head;\n  while (curr) {\n    vals.push(curr.val);\n    curr = curr.next;\n  }\n  return vals.join(' -> ') + ' -> null';\n}\n\nconst n3: ListNode<number> = { val: 3, next: null };\nconst n2: ListNode<number> = { val: 2, next: n3 };\nconst n1: ListNode<number> = { val: 1, next: n2 };\n\nconsole.log('Constructed list:', printList(n1));",
      "output": "Constructed list: 1 -> 2 -> 3 -> null",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines generic ListNode structure with payload value and next reference pointer."
        },
        {
          "line": 17,
          "note": "Links three discrete node objects sequentially into a singly linked list."
        }
      ],
      "tryIt": "Create a fourth node with val = 4 and append it to the tail of the list, verifying the updated traversal.",
      "check": {
        "question": "What is the time complexity of retrieving the element at index K in a singly linked list?",
        "options": [
          "O(1) constant time",
          "O(K) linear traversal time",
          "O(log K) logarithmic time"
        ],
        "answer": 1,
        "why": "Linked lists lack contiguous indexing, requiring sequential pointer hops from head to reach index K."
      }
    },
    {
      "title": "Sentinel Dummy Nodes for Clean Edge-Case Handling",
      "say": [
        "A common pitfall in pointer programming is handling edge cases involving the head or tail of the list.",
        "When deleting the head node or inserting before the first element, standard code requires special branch conditions.",
        "Writing separate 'if (head === target)' logic clutters implementations and introduces subtle null-pointer reference errors.",
        "The standard industry pattern to eliminate head-related edge cases is the Sentinel Dummy Node technique.",
        "A sentinel dummy node is a temporary pseudo-node instantiated with a dummy value whose 'next' points directly to the real head.",
        "All pointer manipulations are performed relative to dummy, treating the real head node identically to any internal node.",
        "At the conclusion of the algorithm, returning dummy.next seamlessly returns the new or modified head of the list.",
        "Sentinel nodes guarantee that every real node in the list always has a valid predecessor pointer during mutations.",
        "Adopting sentinel dummy nodes transforms convoluted 30-line pointer algorithms into clean, bug-free 10-line routines."
      ],
      "example": "A locomotive engine attached to the front of a train: train cars can be attached, rearranged, or detached behind the engine without altering the train's lead control cabin.",
      "code": "interface Node { val: number; next: Node | null; }\n\nfunction removeValue(head: Node | null, target: number): Node | null {\n  const dummy: Node = { val: 0, next: head };\n  let curr = dummy;\n  while (curr.next) {\n    if (curr.next.val === target) {\n      curr.next = curr.next.next;\n    } else {\n      curr = curr.next;\n    }\n  }\n  return dummy.next;\n}\n\nconst head: Node = { val: 1, next: { val: 2, next: { val: 1, next: null } } };\nconst pruned = removeValue(head, 1);\nconsole.log(`Head after removing 1s: ${pruned ? pruned.val : 'null'}`);\nconsole.log(`Next after head: ${pruned?.next ? pruned.next.val : 'null'}`);",
      "output": "Head after removing 1s: 2\nNext after head: null",
      "codeNotes": [
        {
          "line": 4,
          "note": "Initializes sentinel dummy node pointing to head, unifying edge-case deletions."
        },
        {
          "line": 15,
          "note": "Demonstrates that removing the head value 1 succeeds without dedicated special-case branches."
        }
      ],
      "tryIt": "Pass a list where every node matches target (e.g. [1, 1, 1]) and verify that dummy.next correctly yields null.",
      "check": {
        "question": "What architectural problem does a sentinel dummy node solve in linked list algorithms?",
        "options": [
          "It eliminates edge cases when inserting or deleting at the head of the list by providing a permanent predecessor",
          "It compresses node memory by 50%",
          "It automatically prevents cycles from forming"
        ],
        "answer": 0,
        "why": "Sentinels ensure the head node always has a preceding node, eliminating conditional head-check boilerplate."
      }
    },
    {
      "title": "In-Place Singly Linked List Reversal (Three-Pointer Method)",
      "say": [
        "Reversing a singly linked list in-place is one of the most classic and essential pointer manipulation algorithms.",
        "The objective is to invert all 'next' pointers so that the former tail becomes the new head, running in O(N) time and O(1) space.",
        "A naive approach might copy node values into an array, reverse the array, and write values back, wasting O(N) auxiliary memory.",
        "The canonical in-place solution utilizes three sliding pointers simultaneously: 'prev', 'curr', and 'nextTemp'.",
        "We initialize 'prev' to null and 'curr' to the head node.",
        "Inside a while loop that continues as long as 'curr' is not null, we first store curr.next in 'nextTemp' to prevent losing the remaining list.",
        "We then redirect curr.next backward to point to 'prev'.",
        "Finally, we advance 'prev' to 'curr', and advance 'curr' to 'nextTemp'.",
        "When 'curr' reaches null, 'prev' rests upon the final node of the original list, which is now the new head of the reversed list."
      ],
      "example": "A chain of people holding shoulders where everyone lets go and turns around 180 degrees to hold the shoulders of the person behind them.",
      "code": "interface Node { val: number; next: Node | null; }\n\nfunction reverseList(head: Node | null): Node | null {\n  let prev: Node | null = null;\n  let curr = head;\n  while (curr) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}\n\nconst list: Node = { val: 10, next: { val: 20, next: { val: 30, next: null } } };\nconst reversed = reverseList(list);\nconsole.log(`Reversed order: ${reversed?.val} -> ${reversed?.next?.val} -> ${reversed?.next?.next?.val}`);",
      "output": "Reversed order: 30 -> 20 -> 10",
      "codeNotes": [
        {
          "line": 7,
          "note": "Caches curr.next in nextTemp before redirecting pointer backward to prev."
        },
        {
          "line": 17,
          "note": "Executes in-place list reversal in O(N) linear time and O(1) auxiliary memory."
        }
      ],
      "tryIt": "Pass a single-node list { val: 5, next: null } and verify that it returns the node unaltered.",
      "check": {
        "question": "Why must curr.next be saved in nextTemp before setting curr.next = prev during list reversal?",
        "options": [
          "Because redirecting curr.next immediately breaks the reference to the rest of the unreversed list",
          "Because TypeScript compiler errors occur if nextTemp is omitted",
          "Because Node.js garbage collects any node that does not have two active references"
        ],
        "answer": 0,
        "why": "Overwriting curr.next breaks the forward link; caching the next node in nextTemp allows traversal to continue."
      }
    },
    {
      "title": "Floyd's Cycle-Finding Algorithm (Tortoise and Hare)",
      "say": [
        "In dynamic software systems, corrupted pointer mutations can inadvertently cause a linked list node to point back to an earlier node.",
        "Such circular structures create infinite loops during standard traversals, freezing server threads and exhausting memory.",
        "Detecting cycles efficiently requires determining whether a traversal path ever loops back on itself.",
        "A naive solution uses a hash set of visited node references, but this consumes O(N) auxiliary memory.",
        "Floyd's Cycle-Finding Algorithm, also known as the Tortoise and Hare algorithm, solves cycle detection in O(N) time and strict O(1) space.",
        "We initialize two pointers at the head: a 'slow' pointer advancing 1 node per iteration, and a 'fast' pointer advancing 2 nodes.",
        "If the list is acyclic, the fast pointer will cleanly reach null and terminate.",
        "However, if a cycle exists, both pointers will eventually enter the circular loop.",
        "Inside the loop, the fast pointer reduces the distance between itself and the slow pointer by 1 step on every iteration until they inevitably collide."
      ],
      "example": "Two runners on a circular running track: the faster runner running twice as fast will always lap and collide with the slower runner.",
      "code": "interface Node { val: number; next: Node | null; }\n\nfunction hasCycle(head: Node | null): boolean {\n  let slow = head;\n  let fast = head;\n  while (fast && fast.next) {\n    slow = slow!.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}\n\nconst a: Node = { val: 1, next: null };\nconst b: Node = { val: 2, next: null };\na.next = b;\nconsole.log('Acyclic check:', hasCycle(a));\nb.next = a;\nconsole.log('Cyclic check:', hasCycle(a));",
      "output": "Acyclic check: false\nCyclic check: true",
      "codeNotes": [
        {
          "line": 7,
          "note": "Advances slow by 1 step and fast by 2 steps; collision indicates a circular pointer reference."
        },
        {
          "line": 17,
          "note": "Tests both acyclic and cyclic structures to verify robust O(1) space cycle detection."
        }
      ],
      "tryIt": "Construct a 3-node cycle 1 -> 2 -> 3 -> 1 and verify that hasCycle correctly returns true.",
      "check": {
        "question": "Why is Floyd's Tortoise and Hare algorithm guaranteed to terminate if a cycle exists?",
        "options": [
          "Inside the cycle, the relative distance between fast and slow decreases by 1 on every step until collision",
          "Because JavaScript will throw a StackOverflow error after 1,000 steps",
          "Because fast pointer automatically stops when slow reaches the middle"
        ],
        "answer": 0,
        "why": "Advancing fast by 2 and slow by 1 closes the gap by 1 node per loop iteration, guaranteeing collision in finite steps."
      }
    },
    {
      "title": "Doubly Linked Lists & Bi-Directional Linking",
      "say": [
        "While singly linked lists provide efficient forward traversal, deleting a given node requires finding its predecessor, which takes O(N) time.",
        "A Doubly Linked List solves this limitation by outfitting every node with two pointer references: 'next' and 'prev'.",
        "The 'prev' pointer links backward to the preceding node, enabling bi-directional traversal and instantaneous local updates.",
        "With a doubly linked node, removing the node from the list takes strict O(1) time without knowing or traversing from the head.",
        "The removal invariant simply bridges the neighbor pointers: node.prev.next = node.next and node.next.prev = node.prev.",
        "Similarly, inserting a new node between two existing nodes requires updating four pointer references in O(1) time.",
        "Doubly linked lists trade a small amount of extra memory per node (one additional reference pointer) for powerful O(1) bidirectional flexibility.",
        "This O(1) deletion and insertion capability is the foundational engine that powers modern caching structures like LRU caches.",
        "Understanding doubly linked lists equips you to construct high-throughput cache eviction engines and deques."
      ],
      "example": "A two-way train coupling where every carriage has both a front and rear coupler, allowing any middle carriage to be disconnected and the remaining train reconnected immediately.",
      "code": "class DoublyNode<T> {\n  val: T;\n  prev: DoublyNode<T> | null = null;\n  next: DoublyNode<T> | null = null;\n  constructor(val: T) { this.val = val; }\n}\n\nconst first = new DoublyNode('A');\nconst second = new DoublyNode('B');\nfirst.next = second;\nsecond.prev = first;\n\nconsole.log(`Forward: ${first.val} -> ${first.next?.val}`);\nconsole.log(`Backward: ${second.val} -> ${second.prev?.val}`);",
      "output": "Forward: A -> B\nBackward: B -> A",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines DoublyNode with both prev and next pointer references for bidirectional traversal."
        },
        {
          "line": 12,
          "note": "Verifies bidirectional link integrity between nodes A and B."
        }
      ],
      "tryIt": "Insert node 'C' between 'A' and 'B', updating four pointer links, and verify forward and backward traversals.",
      "check": {
        "question": "What is the primary advantage of a Doubly Linked List over a Singly Linked List?",
        "options": [
          "Any node can be removed in strict O(1) time given only a reference to itself, because its predecessor is directly accessible via prev",
          "Doubly linked lists use 50% less memory",
          "Doubly linked lists provide O(1) random indexing"
        ],
        "answer": 0,
        "why": "Having direct access to node.prev enables instantaneous O(1) unlinking without scanning from head."
      }
    },
    {
      "title": "Fast-Slow Pointer Finding Middle of List",
      "say": [
        "In many algorithmic routines, such as Merge Sort on linked lists or palindrome verification, finding the exact midpoint is required.",
        "In an array, the midpoint is calculated trivially via Math.floor(length / 2).",
        "In a linked list without pre-computed length, finding the middle naively requires two passes: one to count N, and a second to advance N / 2 steps.",
        "Using the Fast and Slow Pointer technique, we find the exact middle node in a single O(N) pass.",
        "We position both 'slow' and 'fast' at the head of the list.",
        "While fast and fast.next are non-null, slow moves 1 step and fast moves 2 steps.",
        "When fast reaches the end of the list, slow is guaranteed to rest on the middle node.",
        "For an odd-length list like [1, 2, 3], slow rests on 2; for an even-length list like [1, 2, 3, 4], slow rests on 3 (the second middle node).",
        "Mastering the two-pointer speed differential pattern solves midpoint division, cycle detection, and k-th from the end problems cleanly."
      ],
      "example": "Two hikers on a trail where hiker B walks at twice the speed of hiker A: when hiker B reaches the finish line, hiker A is located precisely at the halfway marker.",
      "code": "interface Node { val: number; next: Node | null; }\n\nfunction findMiddle(head: Node | null): number | null {\n  if (!head) return null;\n  let slow: Node | null = head;\n  let fast: Node | null = head;\n  while (fast && fast.next) {\n    slow = slow!.next;\n    fast = fast.next.next;\n  }\n  return slow!.val;\n}\n\nconst oddList: Node = { val: 1, next: { val: 2, next: { val: 3, next: null } } };\nconst evenList: Node = { val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: null } } } };\n\nconsole.log('Odd list middle:', findMiddle(oddList));\nconsole.log('Even list middle:', findMiddle(evenList));",
      "output": "Odd list middle: 2\nEven list middle: 3",
      "codeNotes": [
        {
          "line": 7,
          "note": "Advances slow by 1 step and fast by 2 steps until fast reaches the end."
        },
        {
          "line": 17,
          "note": "Demonstrates exact midpoint identification across both odd and even length lists."
        }
      ],
      "tryIt": "Pass a single-node list { val: 42, next: null } and verify that findMiddle immediately returns 42.",
      "check": {
        "question": "When finding the middle of a linked list using fast and slow pointers, why does slow stop at the midpoint?",
        "options": [
          "Because fast travels at twice the speed of slow, so when fast covers the full distance N, slow covers N / 2",
          "Because slow counts the total number of nodes in memory",
          "Because fast pointer reverses the list as it travels"
        ],
        "answer": 0,
        "why": "With a 2:1 speed ratio, slow covers exactly half the distance traveled by fast."
      }
    }
  ],
  "summary": [
    "Singly linked lists store elements non-contiguously in heap nodes connected via next pointer references.",
    "Sentinel dummy nodes provide permanent predecessor pointers, eliminating head-mutation edge cases.",
    "The three-pointer method (prev, curr, nextTemp) reverses a linked list in-place in O(N) time and O(1) space.",
    "Floyd's Tortoise and Hare algorithm detects cycles in O(N) time and O(1) space by closing distance inside loops.",
    "Doubly linked lists enable O(1) node deletion and insertion via bidirectional next and prev pointers."
  ],
  "projectStep": {
    "title": "Linked List Reversal & Cycle Detection Suite",
    "steps": [
      "Implement in-place singly linked list reversal using the three-pointer technique.",
      "Implement Floyd's two-pointer cycle-finding algorithm.",
      "Construct a doubly linked node class supporting bidirectional linking."
    ]
  }
},
{
  "day": 4,
  "title": "Stacks (LIFO): Valid Parentheses & Monotonic Next Greater Element",
  "goal": "Implement Last-In First-Out (LIFO) stacks, bracket validation, and monotonic stack search.",
  "minutes": 25,
  "recap": "Yesterday we mastered node pointers and linked list operations. Today we explore the Last-In First-Out (LIFO) stack and the powerful Monotonic Stack optimization pattern.",
  "parts": [
    {
      "title": "Stack LIFO Invariants & Call Stack Analogies",
      "say": [
        "The stack is one of the most fundamental abstract data types in software engineering, operating on the Last-In First-Out (LIFO) principle.",
        "In a LIFO structure, the most recently added item is always the first one to be removed.",
        "The primary stack operations are push(x) to place an item on top, pop() to remove the top item, and peek() to inspect the top without removal.",
        "In a properly implemented stack, all three fundamental operations execute in strict O(1) constant time.",
        "Stacks model physical reality: function execution frames, browser history back buttons, and text editor undo buffers all rely on LIFO mechanics.",
        "Whenever a programming language invokes a function, it pushes an activation record onto the runtime call stack.",
        "When the function finishes executing, its record is popped off the top, resuming the caller's execution state.",
        "Building a dedicated Stack class with clear boundaries prevents consumers from performing illegal random access operations.",
        "Understanding stack invariants prepares engineers to solve parsing, bracket validation, and depth-first traversal problems with ease."
      ],
      "example": "A spring-loaded plate dispenser in a cafeteria: the clean plate placed on top last is the first plate taken by the next customer.",
      "code": "class ArrayStack<T> {\n  private items: T[] = [];\n  push(val: T): void { this.items.push(val); }\n  pop(): T | undefined { return this.items.pop(); }\n  peek(): T | undefined { return this.items[this.items.length - 1]; }\n  isEmpty(): boolean { return this.items.length === 0; }\n  size(): number { return this.items.length; }\n}\n\nconst stack = new ArrayStack<string>();\nstack.push('Page 1'); stack.push('Page 2'); stack.push('Page 3');\nconsole.log(`Top item: ${stack.peek()}`);\nconsole.log(`Popped: ${stack.pop()}`);\nconsole.log(`New top: ${stack.peek()}`);",
      "output": "Top item: Page 3\nPopped: Page 3\nNew top: Page 2",
      "codeNotes": [
        {
          "line": 1,
          "note": "Wraps an internal array to enforce strict LIFO stack invariants with O(1) operations."
        },
        {
          "line": 12,
          "note": "Demonstrates Last-In First-Out behavior: Page 3 is pushed last and popped first."
        }
      ],
      "tryIt": "Add a clear() method to ArrayStack that empties all elements and verify that isEmpty() returns true.",
      "check": {
        "question": "Which of the following operations violates the formal definition of a pure stack data structure?",
        "options": [
          "Inspecting the middle element at index 3 in O(1) time without popping preceding elements",
          "Popping the top item in O(1) time",
          "Checking whether the stack is empty in O(1) time"
        ],
        "answer": 0,
        "why": "A pure stack restricts access strictly to the top element; random access to arbitrary middle indices violates LIFO invariants."
      }
    },
    {
      "title": "Valid Parentheses & Compiler Bracket Matching",
      "say": [
        "Compilers, code formatters, and JSON parsers must verify that opening brackets are closed in strictly matching order.",
        "An expression like '()[]{}' is valid, while '([)]' is invalid because the closing bracket does not match the most recently opened delimiter.",
        "The stack provides the ideal mechanism for tracking open delimiters because the innermost bracket must close first.",
        "We iterate through the input string character by character.",
        "Whenever we encounter an opening delimiter ('(', '{', '['), we push it onto the stack.",
        "When we encounter a closing delimiter (')', '}', ']'), we inspect the top of the stack.",
        "If the stack is empty or the popped opening bracket does not match the corresponding closing bracket, the string is immediately invalid.",
        "After processing the entire string, the stack must be completely empty; any leftover elements indicate unclosed opening brackets.",
        "This linear O(N) algorithm with O(N) space forms the core parsing foundation of every programming language syntax checker."
      ],
      "example": "Russian nesting dolls: you cannot close an outer doll until the innermost doll is completely closed and sealed first.",
      "code": "function isValidParentheses(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };\n\n  for (const ch of s) {\n    if (ch === '(' || ch === '{' || ch === '[') {\n      stack.push(ch);\n    } else if (map[ch]) {\n      if (stack.length === 0 || stack.pop() !== map[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}\n\nconsole.log('()[]{}:', isValidParentheses('()[]{}'));\nconsole.log('([)]:', isValidParentheses('([)]'));\nconsole.log('{[]}:', isValidParentheses('{[]}'));",
      "output": "()[]{}: true\n([)]: false\n{[]}: true",
      "codeNotes": [
        {
          "line": 3,
          "note": "Maps closing brackets to their required opening counterparts for O(1) lookup."
        },
        {
          "line": 11,
          "note": "Ensures the stack is completely empty at the end, confirming all open brackets were closed."
        }
      ],
      "tryIt": "Test with string '(((' and verify that isValidParentheses returns false due to unclosed brackets.",
      "check": {
        "question": "Why does the string '([)]' fail the valid parentheses check?",
        "options": [
          "The closing square bracket encounters '(' on top of the stack instead of its matching opening '['",
          "Square brackets are not allowed in JSON",
          "The string has an odd number of characters"
        ],
        "answer": 0,
        "why": "The most recently opened delimiter was '['; encountering ')' violates LIFO bracket matching order."
      }
    },
    {
      "title": "Monotonic Stack Architecture (Next Greater Element)",
      "say": [
        "In many algorithmic problems, we must find the 'next greater' or 'next smaller' element for each position in an array.",
        "A brute-force solution checks every element to the right of each index using nested loops, taking O(N^2) quadratic time.",
        "The Monotonic Stack pattern reduces this problem from O(N^2) to strict O(N) linear time.",
        "A monotonic stack is a stack whose elements are kept in strictly increasing or strictly decreasing order.",
        "To find the Next Greater Element, we maintain a monotonically decreasing stack of array indices.",
        "As we scan the array from left to right, if the current number is greater than the number at the stack's top index, we have found that index's next greater element.",
        "We repeatedly pop indices from the stack and record the current number as their answer until the stack top is greater than the current number.",
        "We then push the current index onto the stack and continue scanning.",
        "Because every index is pushed onto the stack exactly once and popped at most once, total operations are strictly 2N, running in O(N) time."
      ],
      "example": "Looking out over a city skyline: a tall skyscraper blocks your view of all shorter buildings behind it until an even taller skyscraper appears.",
      "code": "function nextGreaterElements(nums: number[]): number[] {\n  const res = new Array(nums.length).fill(-1);\n  const stack: number[] = [];\n\n  for (let i = 0; i < nums.length; i++) {\n    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {\n      const idx = stack.pop()!;\n      res[idx] = nums[i];\n    }\n    stack.push(i);\n  }\n  return res;\n}\n\nconst input = [2, 1, 2, 4, 3];\nconst result = nextGreaterElements(input);\nconsole.log(`Next greater for [${input.join(', ')}]: [${result.join(', ')}]`);",
      "output": "Next greater for [2, 1, 2, 4, 3]: [4, 2, 4, -1, -1]",
      "codeNotes": [
        {
          "line": 5,
          "note": "Pops indices from monotonic stack whenever the incoming element exceeds the value at top index."
        },
        {
          "line": 15,
          "note": "Executes in O(N) total time, resolving all next-greater relationships in a single pass."
        }
      ],
      "tryIt": "Pass [1, 2, 3, 4] and observe that every element's next greater is its immediate neighbor except the last (-1).",
      "check": {
        "question": "Why does the Monotonic Stack algorithm run in O(N) time despite having a while loop inside a for loop?",
        "options": [
          "Every index is pushed onto the stack exactly once and popped at most once across the entire algorithm execution",
          "Because the while loop only runs once per hour",
          "Because modern CPUs optimize monotonic loops automatically"
        ],
        "answer": 0,
        "why": "Aggregate analysis confirms that with at most N pushes and N pops, total inner loop iterations cannot exceed N."
      }
    },
    {
      "title": "MinStack with Auxiliary Minimum Tracking",
      "say": [
        "In performance-critical applications, systems often need to query the minimum element in a stack in O(1) time.",
        "In a standard array stack, finding the minimum requires iterating through all elements, which takes O(N) linear time.",
        "Scanning the entire stack on every min query degrades system responsiveness.",
        "The MinStack architecture achieves strict O(1) getMin(), O(1) push(), and O(1) pop() by using an auxiliary tracking stack.",
        "Alongside the main data stack, we maintain a secondary 'minStack' of identical depth.",
        "Whenever a new value is pushed, we compare it with the current top of minStack and push Math.min(val, currentMin).",
        "Each level of minStack records the historical minimum of all elements below and including that position.",
        "When an element is popped from the main stack, we also pop from minStack, restoring the prior minimum state effortlessly.",
        "MinStack demonstrates the classic algorithmic trade-off: spending O(N) auxiliary space to achieve instantaneous O(1) queries."
      ],
      "example": "A sea captain recording the shallowest depth encountered on a voyage in a logbook: whenever a new shallower depth is sounded, it is recorded alongside the entry.",
      "code": "class MinStack {\n  private stack: number[] = [];\n  private minStack: number[] = [];\n\n  push(val: number): void {\n    this.stack.push(val);\n    const curMin = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);\n    this.minStack.push(curMin);\n  }\n\n  pop(): number | undefined {\n    this.minStack.pop();\n    return this.stack.pop();\n  }\n\n  getMin(): number {\n    return this.minStack[this.minStack.length - 1];\n  }\n}\n\nconst ms = new MinStack();\nms.push(5); ms.push(2); ms.push(8); ms.push(1);\nconsole.log('Current min:', ms.getMin());\nms.pop();\nconsole.log('Min after popping 1:', ms.getMin());",
      "output": "Current min: 1\nMin after popping 1: 2",
      "codeNotes": [
        {
          "line": 6,
          "note": "Pushes the running minimum onto the auxiliary minStack alongside every main push."
        },
        {
          "line": 23,
          "note": "Demonstrates that popping the minimum element 1 restores the prior minimum 2 instantaneously."
        }
      ],
      "tryIt": "Push 0 and -5, then pop -5 and verify that getMin() accurately reflects the new running minimum.",
      "check": {
        "question": "How does MinStack achieve O(1) minimum lookups when elements are pushed and popped dynamically?",
        "options": [
          "By keeping a parallel minStack that tracks the cumulative minimum up to each corresponding element level",
          "By sorting the stack array after every insertion",
          "By searching binary search trees in the background"
        ],
        "answer": 0,
        "why": "The auxiliary minStack caches the minimum value at every depth, enabling O(1) peek without scanning."
      }
    },
    {
      "title": "Infix Evaluation & Reverse Polish Notation (RPN)",
      "say": [
        "Human mathematical notation uses infix format, placing operators between operands, such as '2 + 3 * 4'.",
        "Infix expressions require operator precedence rules and parentheses to resolve ambiguities (multiplication before addition).",
        "Calculators and compiler virtual machines convert infix expressions into Reverse Polish Notation (RPN, or postfix notation).",
        "In RPN, operators follow their operands: the expression '2 + 3 * 4' becomes '2 3 4 * +'.",
        "RPN eliminates the need for parentheses and precedence rules because the evaluation order is completely unambiguous.",
        "Evaluating an RPN expression using a stack requires a simple linear scan over tokens.",
        "Whenever a numeric operand is encountered, it is pushed onto the stack.",
        "Whenever an arithmetic operator (+, -, *, /) appears, the top two operands are popped, evaluated, and the result pushed back.",
        "When the token stream ends, the single remaining item on the stack is the final evaluated expression result."
      ],
      "example": "A postfix calculator where you enter numbers onto a register stack and hit the operator button to combine them instantly.",
      "code": "function evalRPN(tokens: string[]): number {\n  const stack: number[] = [];\n  for (const t of tokens) {\n    if (t === '+' || t === '-' || t === '*' || t === '/') {\n      const b = stack.pop()!;\n      const a = stack.pop()!;\n      if (t === '+') stack.push(a + b);\n      else if (t === '-') stack.push(a - b);\n      else if (t === '*') stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(t));\n    }\n  }\n  return stack.pop()!;\n}\n\nconsole.log('RPN [\"2\", \"1\", \"+\", \"3\", \"*\"] =', evalRPN(['2', '1', '+', '3', '*']));\nconsole.log('RPN [\"4\", \"13\", \"5\", \"/\", \"+\"] =', evalRPN(['4', '13', '5', '/', '+']));",
      "output": "RPN [\"2\", \"1\", \"+\", \"3\", \"*\"] = 9\nRPN [\"4\", \"13\", \"5\", \"/\", \"+\"] = 6",
      "codeNotes": [
        {
          "line": 5,
          "note": "Pops the second operand b first, then the first operand a to maintain correct subtraction and division order."
        },
        {
          "line": 17,
          "note": "Evaluates arithmetic postfix expressions in strict O(N) single-pass linear time."
        }
      ],
      "tryIt": "Evaluate ['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'] and verify it evaluates correctly.",
      "check": {
        "question": "Why do compiler engines and calculators convert infix expressions to Reverse Polish Notation (postfix)?",
        "options": [
          "RPN eliminates parentheses and operator precedence ambiguities, allowing linear single-pass stack evaluation",
          "RPN makes expressions human-readable",
          "RPN uses less CPU cache"
        ],
        "answer": 0,
        "why": "Postfix notation explicitly encodes evaluation order in the token sequence, eliminating operator precedence conflicts."
      }
    },
    {
      "title": "Daily Temperatures (Monotonic Stack Distance)",
      "say": [
        "A practical variation of the Next Greater Element problem is computing the distance or wait time to the next greater value.",
        "Consider an array of daily temperatures: for each day, we want to know how many days we must wait until a warmer temperature occurs.",
        "If there is no future day with a warmer temperature, we record 0 for that position.",
        "A brute-force scan checks all future days for each index, requiring O(N^2) quadratic comparisons.",
        "Using a Monotonic Stack of indices, we solve the problem in a single O(N) pass.",
        "We iterate through the temperatures array from index 0 to N-1.",
        "While the stack is not empty and current temperature exceeds the temperature at stack top index, we pop the top index.",
        "The wait time for the popped index is simply currentIndex - poppedIndex.",
        "We store this difference in our results array and push the current index, achieving O(N) time and O(N) auxiliary space."
      ],
      "example": "Checking a 7-day weather forecast: recording the exact number of days until the winter freeze is broken by a warmer day.",
      "code": "function dailyTemperatures(temps: number[]): number[] {\n  const days = new Array(temps.length).fill(0);\n  const stack: number[] = [];\n\n  for (let i = 0; i < temps.length; i++) {\n    while (stack.length > 0 && temps[stack[stack.length - 1]] < temps[i]) {\n      const prev = stack.pop()!;\n      days[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return days;\n}\n\nconst temperatures = [73, 74, 75, 71, 69, 72, 76, 73];\nconsole.log('Days until warmer:', dailyTemperatures(temperatures).join(', '));",
      "output": "Days until warmer: 1, 1, 4, 2, 1, 1, 0, 0",
      "codeNotes": [
        {
          "line": 7,
          "note": "Calculates wait distance (i - prev) upon encountering a warmer temperature than stack top."
        },
        {
          "line": 15,
          "note": "Outputs the exact waiting day intervals for each day in linear O(N) time."
        }
      ],
      "tryIt": "Test with [30, 40, 50, 60] and verify that output is [1, 1, 1, 0] since each subsequent day is warmer.",
      "check": {
        "question": "In the Daily Temperatures algorithm, what does the value stored on the monotonic stack represent?",
        "options": [
          "The index of a past day whose warmer future day has not yet been discovered",
          "The temperature value converted to Fahrenheit",
          "The number of days remaining in the month"
        ],
        "answer": 0,
        "why": "Stack indices represent unresolved days waiting for a warmer temperature to appear in the stream."
      }
    }
  ],
  "summary": [
    "Stacks operate on the Last-In First-Out (LIFO) invariant, providing O(1) push, pop, and peek operations.",
    "Parentheses and delimiter matching uses a stack to ensure innermost open brackets close in exact matching order.",
    "Monotonic stacks maintain sorted elements, resolving Next Greater Element queries in O(N) linear time.",
    "MinStack tracks the running minimum at every stack depth using an auxiliary stack, enabling O(1) getMin().",
    "Reverse Polish Notation (RPN) eliminates operator precedence and parentheses, enabling linear single-pass evaluation."
  ],
  "projectStep": {
    "title": "Monotonic Stack & Expression Evaluator",
    "steps": [
      "Implement the Valid Parentheses string validator supporting (), {}, and [].",
      "Construct a Next Greater Element monotonic stack resolving integer arrays in O(N) time.",
      "Implement an RPN expression evaluator processing arithmetic tokens."
    ]
  }
},
{
  "day": 5,
  "title": "⭐ MILESTONE 1: Production LRU Cache Engine (Doubly Linked List + Hash Map)",
  "goal": "Build an enterprise-grade Least Recently Used (LRU) Cache operating in strict O(1) time for get() and put() using a Doubly Linked List and Hash Map.",
  "minutes": 25,
  "recap": "Over the last four days, we mastered Big-O asymptotics, dynamic arrays, doubly linked lists, and stacks. Today, in Milestone 1, we synthesize these structures into an enterprise LRU Cache.",
  "parts": [
    {
      "title": "The O(1) Cache Requirement: Combining Hash Map & Doubly Linked List",
      "say": [
        "In high-scale web backend engineering, databases and APIs cannot handle every repeated read request directly.",
        "To protect databases from exhaustion and serve requests in sub-millisecond latencies, systems deploy in-memory caches.",
        "However, physical server RAM is finite, meaning a cache cannot grow indefinitely without crashing the host process.",
        "When cache capacity is reached, the cache must evict an existing item to make room for newly requested data.",
        "The Least Recently Used (LRU) eviction strategy evicts the item that has not been accessed for the longest duration.",
        "A production LRU cache must execute both get(key) and put(key, value) in strict O(1) constant time.",
        "A Hash Map alone provides O(1) key lookups but cannot maintain chronological access ordering in O(1) time.",
        "An Array maintains order but requires O(N) shifts when moving an item or evicting from the front.",
        "The architectural solution combines a Hash Map for O(1) key-to-node pointer lookup with a Doubly Linked List for O(1) node splicing."
      ],
      "example": "A physical desk with limited space for file folders: whenever you read a folder, you place it on the top of the pile; when the desk is full, you discard the folder at the very bottom.",
      "code": "class DNode {\n  key: number;\n  val: number;\n  prev: DNode | null = null;\n  next: DNode | null = null;\n  constructor(key = 0, val = 0) { this.key = key; this.val = val; }\n}\n\nconst headSentinel = new DNode();\nconst tailSentinel = new DNode();\nheadSentinel.next = tailSentinel;\ntailSentinel.prev = headSentinel;\n\nconsole.log('Sentinels initialized successfully');\nconsole.log(`Head next is tail: ${headSentinel.next === tailSentinel}`);\nconsole.log(`Tail prev is head: ${tailSentinel.prev === headSentinel}`);",
      "output": "Sentinels initialized successfully\nHead next is tail: true\nTail prev is head: true",
      "codeNotes": [
        {
          "line": 1,
          "note": "Defines a doubly linked node carrying key-value payloads and bidirectional pointers."
        },
        {
          "line": 9,
          "note": "Connects dummy head and tail sentinel nodes to eliminate null pointer checks at boundaries."
        }
      ],
      "tryIt": "Create a data node with key 1 and value 100, attach it between head and tail, and log its neighbor keys.",
      "check": {
        "question": "Why cannot a Hash Map alone implement an LRU cache in strict O(1) time for all operations?",
        "options": [
          "A Hash Map provides O(1) key lookups but cannot update chronological access order in O(1) time without O(N) scans",
          "Hash Maps cannot store numbers in JavaScript",
          "Hash Maps have a fixed maximum size of 100 entries"
        ],
        "answer": 0,
        "why": "Tracking access order in a standard hash map requires linear scanning; pairing with a doubly linked list provides O(1) reordering."
      }
    },
    {
      "title": "O(1) Node Addition & Removal Invariants",
      "say": [
        "The core mechanical operations of an LRU cache list are adding a node to the front and removing an arbitrary node.",
        "By convention, the node directly following the dummy head sentinel represents the Most Recently Used (MRU) item.",
        "The node directly preceding the dummy tail sentinel represents the Least Recently Used (LRU) item.",
        "When an existing key is accessed or updated, it must be promoted to the front of the list in O(1) time.",
        "To promote a node, we first unlink it from its current position by bridging its neighbors: node.prev.next = node.next.",
        "We then insert the node directly after head by updating four pointer references in O(1) time.",
        "Because dummy sentinels permanently exist at the boundaries, head and tail pointers are never null, eliminating conditional branches.",
        "Similarly, when the cache exceeds capacity, evicting the LRU item simply unlinks tail.prev and deletes its key from the hash map.",
        "These clean pointer mechanics guarantee that list operations never degrade below strict O(1) constant time."
      ],
      "example": "Moving a bookmark in a physical book: taking the bookmark out of page 50 and placing it at page 100 takes the exact same moment as placing it at page 10.",
      "code": "class DNode {\n  key: number;\n  val: number;\n  prev: DNode | null = null;\n  next: DNode | null = null;\n  constructor(key = 0, val = 0) { this.key = key; this.val = val; }\n}\n\nclass DoublyListManager {\n  head = new DNode();\n  tail = new DNode();\n  constructor() {\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n\n  addDirectlyAfterHead(node: DNode): void {\n    node.prev = this.head;\n    node.next = this.head.next;\n    this.head.next!.prev = node;\n    this.head.next = node;\n  }\n\n  remove(node: DNode): void {\n    node.prev!.next = node.next;\n    node.next!.prev = node.prev;\n  }\n}\n\nconst mgr = new DoublyListManager();\nconst n1 = new DNode(1, 100);\nmgr.addDirectlyAfterHead(n1);\nconsole.log(`Head next key: ${mgr.head.next?.key}, val: ${mgr.head.next?.val}`);\nmgr.remove(n1);\nconsole.log(`After removal, head next is tail: ${mgr.head.next === mgr.tail}`);",
      "output": "Head next key: 1, val: 100\nAfter removal, head next is tail: true",
      "codeNotes": [
        {
          "line": 8,
          "note": "Inserts a node directly after head in O(1) time, marking it as Most Recently Used."
        },
        {
          "line": 15,
          "note": "Removes an arbitrary node in O(1) time by re-routing neighbor pointers around it."
        }
      ],
      "tryIt": "Add two nodes n1 and n2 to mgr, verify head.next is n2, and then remove n1.",
      "check": {
        "question": "Where is the Most Recently Used (MRU) node positioned in this sentinel-guarded list architecture?",
        "options": [
          "Directly after the head sentinel node (head.next)",
          "Directly before the tail sentinel node (tail.prev)",
          "At an arbitrary random position in the middle"
        ],
        "answer": 0,
        "why": "By convention, newly added or accessed nodes are spliced directly after the head sentinel, marking them as MRU."
      }
    },
    {
      "title": "Map Pointer Lookup & Cache Hit Promotion",
      "say": [
        "Now we examine how the Hash Map and Doubly Linked List collaborate during a get(key) query.",
        "When get(key) is invoked, we first query the hash map for the key in O(1) time.",
        "If the key does not exist in the map, the cache has suffered a cache miss, and we return -1.",
        "However, if the key is present in the map, the map returns a direct reference pointer to the corresponding DNode in memory.",
        "We retrieve the value from node.val to satisfy the read request.",
        "Crucially, accessing this key represents a cache hit, meaning this item is now the Most Recently Used entry.",
        "We immediately call remove(node) followed by add(node) to hoist the node to the front directly behind head.",
        "The hash map entry does not need to be updated because the node reference pointer remains completely valid.",
        "This promotion operation executes in strict O(1) time, preserving the precise chronological usage history of all entries."
      ],
      "example": "A library book requested by a student: the librarian uses the card catalog to find the shelf location in seconds, takes the book down, and places it on the front display table.",
      "code": "class DNode {\n  key: number;\n  val: number;\n  prev: DNode | null = null;\n  next: DNode | null = null;\n  constructor(key = 0, val = 0) { this.key = key; this.val = val; }\n}\n\nclass LRUCacheSimulation {\n  private map = new Map<number, DNode>();\n  private head = new DNode();\n  private tail = new DNode();\n  private cap: number;\n\n  constructor(cap: number) {\n    this.cap = cap;\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n\n  get(key: number): number {\n    const node = this.map.get(key);\n    if (!node) return -1;\n    // Move to front (MRU)\n    node.prev!.next = node.next;\n    node.next!.prev = node.prev;\n    node.prev = this.head;\n    node.next = this.head.next;\n    this.head.next!.prev = node;\n    this.head.next = node;\n    return node.val;\n  }\n\n  put(key: number, val: number): void {\n    if (this.map.has(key)) {\n      const node = this.map.get(key)!;\n      node.val = val;\n      this.get(key); // promote\n      return;\n    }\n    if (this.map.size >= this.cap) {\n      const lru = this.tail.prev!;\n      lru.prev!.next = this.tail;\n      this.tail.prev = lru.prev;\n      this.map.delete(lru.key);\n    }\n    const newNode = new DNode(key, val);\n    newNode.prev = this.head;\n    newNode.next = this.head.next;\n    this.head.next!.prev = newNode;\n    this.head.next = newNode;\n    this.map.set(key, newNode);\n  }\n}\n\nconst lru = new LRUCacheSimulation(2);\nlru.put(1, 10); lru.put(2, 20);\nconsole.log(`Get 1: ${lru.get(1)}`);\nlru.put(3, 30); // evicts 2\nconsole.log(`Get 2 (evicted): ${lru.get(2)}`);\nconsole.log(`Get 3: ${lru.get(3)}`);",
      "output": "Get 1: 10\nGet 2 (evicted): -1\nGet 3: 30",
      "codeNotes": [
        {
          "line": 12,
          "note": "On cache hit, unlinks node and inserts it at head.next to mark it as Most Recently Used."
        },
        {
          "line": 49,
          "note": "Demonstrates that accessing key 1 saved it from eviction, causing key 2 to be evicted when key 3 was added."
        }
      ],
      "tryIt": "Call lru.put(4, 40) on the simulated cache and verify that key 1 is evicted next.",
      "check": {
        "question": "When get(key) finds a key in the LRU cache, why does it move the node to head.next?",
        "options": [
          "To update the entry as Most Recently Used so it won't be evicted on the next put",
          "To trigger garbage collection on unused variables",
          "Because Map requires keys to be in numerical order"
        ],
        "answer": 0,
        "why": "Accessing an entry refreshes its recency, moving it away from the eviction boundary (tail.prev)."
      }
    },
    {
      "title": "Eviction Policy & Boundary Testing",
      "say": [
        "Testing cache eviction requires verifying that capacity limits are strictly honored under edge-case workloads.",
        "Common edge cases include inserting into a cache of capacity 1, updating an existing key without increasing size, and rapid key churn.",
        "When an existing key is updated via put(key, newValue), the node's value must update and its position promoted to MRU.",
        "Crucially, updating an existing key must NOT increment the cache size or trigger an eviction of another key.",
        "When capacity is 1, every insertion of a new key must immediately evict the previous key, leaving exactly one entry.",
        "Furthermore, when an item is evicted from the linked list, its key must be removed from the hash map simultaneously.",
        "If a node is unlinked from the list but remains in the map, a subsequent get(key) will attempt to read a detached node, corrupting state.",
        "Storing the 'key' inside the DNode itself is essential because it allows the eviction routine to delete the key from the map in O(1) time.",
        "Defensive synchronization between list pointers and map keys is the hallmark of professional cache architecture."
      ],
      "example": "A parking lot with 2 reserved spaces: when car C arrives, parking attendant checks which car has been parked the longest without moving and tows that car out.",
      "code": "function testEvictionPolicy(): string[] {\n  const events: string[] = [];\n  const map = new Map<string, number>();\n  const capacity = 2;\n\n  function access(key: string, val: number): void {\n    if (map.has(key)) map.delete(key);\n    else if (map.size >= capacity) {\n      const oldestKey = map.keys().next().value;\n      events.push(`Evicted ${oldestKey}`);\n      map.delete(oldestKey);\n    }\n    map.set(key, val);\n    events.push(`Stored ${key}=${val}`);\n  }\n\n  access('A', 1);\n  access('B', 2);\n  access('C', 3);\n  return events;\n}\n\nfor (const log of testEvictionPolicy()) {\n  console.log(log);\n}",
      "output": "Stored A=1\nStored B=2\nEvicted A\nStored C=3",
      "codeNotes": [
        {
          "line": 8,
          "note": "Detects capacity overflow and evicts the least recently accessed key before inserting the new entry."
        },
        {
          "line": 23,
          "note": "Demonstrates that key A was evicted upon inserting C because A was the oldest untouched key."
        }
      ],
      "tryIt": "Access key A before adding C and observe that B is evicted instead of A.",
      "check": {
        "question": "Why must the DNode class store both 'key' and 'val' rather than only 'val'?",
        "options": [
          "When evicting tail.prev, the cache needs node.key to delete the corresponding entry from the Hash Map in O(1) time",
          "Because TypeScript classes require at least two numeric properties",
          "To allow reverse lookup by value"
        ],
        "answer": 0,
        "why": "Having the key stored on the node allows the eviction logic to delete the key from the hash map without searching."
      }
    },
    {
      "title": "Concurrency, TTL Expiration & Cache Stampedes",
      "say": [
        "In production enterprise systems, LRU caches operate in concurrent environments with thousands of simultaneous read and write requests.",
        "A critical enhancement to standard LRU caching is Time-to-Live (TTL) expiration.",
        "TTL expiration attaches a timestamp or duration to each cached entry, after which the data is considered stale.",
        "When an expired item is accessed, the cache deletes the entry and returns a miss, forcing a fresh query to the database.",
        "Another major challenge in high-throughput architectures is the Cache Stampede (or Thundering Herd) problem.",
        "When a highly popular key expires, hundreds of concurrent incoming requests simultaneously experience a cache miss.",
        "If all hundreds of requests query the database at the same instant, the database suffers severe CPU overload and crashes.",
        "To prevent cache stampedes, production systems implement promise-based singleflight mutexes or probabilistic early expiration.",
        "Understanding TTL lifecycles and concurrency safeguards bridges the gap between academic algorithms and production reliability."
      ],
      "example": "A restaurant daily menu board: writing the date at the top so customers know when yesterday's special has expired, and sending one waiter to the kitchen to ask for today's menu rather than 50 customers all rushing into the kitchen.",
      "code": "interface CacheEntry<T> {\n  value: T;\n  expiresAt: number;\n}\n\nclass TTLLRUCache<T> {\n  private store = new Map<string, CacheEntry<T>>();\n  constructor(private ttlMs: number) {}\n\n  set(key: string, value: T): void {\n    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });\n  }\n\n  get(key: string): T | null {\n    const entry = this.store.get(key);\n    if (!entry) return null;\n    if (Date.now() > entry.expiresAt) {\n      this.store.delete(key);\n      return null;\n    }\n    return entry.value;\n  }\n}\n\nconst cache = new TTLLRUCache<string>(1000);\ncache.set('session-1', 'user-active');\nconsole.log('Immediate get:', cache.get('session-1'));",
      "output": "Immediate get: user-active",
      "codeNotes": [
        {
          "line": 11,
          "note": "Stores timestamped cache entry with expiration deadline calculated from TTL."
        },
        {
          "line": 17,
          "note": "Performs lazy eviction on read if current timestamp exceeds entry.expiresAt."
        }
      ],
      "tryIt": "Pass a ttlMs of -100 to simulate an already-expired key and verify that get() returns null and evicts the entry.",
      "check": {
        "question": "What is a 'Cache Stampede' in high-scale production systems?",
        "options": [
          "When a popular cached key expires and hundreds of concurrent requests simultaneously hit the database",
          "When an array runs out of memory during JSON serialization",
          "When a network switch drops TCP packets"
        ],
        "answer": 0,
        "why": "Simultaneous misses on an expired hot key cause a herd of concurrent database queries, causing database outages."
      }
    },
    {
      "title": "Full Milestone 1 Production LRUCache Engine Walkthrough",
      "say": [
        "We now assemble our complete production-grade LRUCache engine for Milestone 1.",
        "Our implementation features a private capacity limit, a Hash Map for O(1) key lookups, and a Doubly Linked List with dummy sentinels.",
        "The get(key) method checks the map; on hit, it unlinks the node and splices it at head.next, returning node.val.",
        "The put(key, value) method updates existing keys in-place or adds new nodes directly after head.",
        "If the map size exceeds capacity, the engine unlinks tail.prev, removes its key from the map, and cleanly disposes of the entry.",
        "Every get() and put() operation runs in guaranteed, mathematically proven O(1) time complexity.",
        "Auxiliary space is strictly bounded by O(capacity) elements in both the hash map and the linked list.",
        "Congratulations on completing Milestone 1: you have engineered one of the most famous, powerful data structures in software engineering.",
        "This production engine is ready for real-time caching in API gateways, database query layers, and browser runtimes."
      ],
      "example": "A master mechanical watchmaker fitting together the escapement, balance wheel, and mainspring: every gear turns with frictionless O(1) precision to create a timeless instrument.",
      "code": "class DNode {\n  key: number;\n  val: number;\n  prev: DNode | null = null;\n  next: DNode | null = null;\n  constructor(key = 0, val = 0) { this.key = key; this.val = val; }\n}\n\nclass ProductionLRUCache {\n  private capacity: number;\n  private cache = new Map<number, DNode>();\n  private head: DNode = new DNode(0, 0);\n  private tail: DNode = new DNode(0, 0);\n\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n\n  private remove(node: DNode): void {\n    node.prev!.next = node.next;\n    node.next!.prev = node.prev;\n  }\n\n  private add(node: DNode): void {\n    node.prev = this.head;\n    node.next = this.head.next;\n    this.head.next!.prev = node;\n    this.head.next = node;\n  }\n\n  get(key: number): number {\n    const node = this.cache.get(key);\n    if (!node) return -1;\n    this.remove(node);\n    this.add(node);\n    return node.val;\n  }\n\n  put(key: number, value: number): void {\n    if (this.cache.has(key)) {\n      this.remove(this.cache.get(key)!);\n    }\n    const node = new DNode(key, value);\n    this.add(node);\n    this.cache.set(key, node);\n    if (this.cache.size > this.capacity) {\n      const lru = this.tail.prev!;\n      this.remove(lru);\n      this.cache.delete(lru.key);\n    }\n  }\n}\n\nconst engine = new ProductionLRUCache(2);\nengine.put(1, 100);\nengine.put(2, 200);\nconsole.log('Get key 1:', engine.get(1));\nengine.put(3, 300); // evicts key 2\nconsole.log('Get key 2 (evicted):', engine.get(2));\nconsole.log('Get key 3:', engine.get(3));\nconsole.log('Get key 1:', engine.get(1));",
      "output": "Get key 1: 100\nGet key 2 (evicted): -1\nGet key 3: 300\nGet key 1: 100",
      "codeNotes": [
        {
          "line": 29,
          "note": "Puts key-value with automatic eviction of the least recently used node when capacity is exceeded."
        },
        {
          "line": 50,
          "note": "Confirms key 1 was promoted to MRU, causing key 2 to be evicted when key 3 was inserted."
        }
      ],
      "tryIt": "Instantiate with capacity 3, insert keys 1, 2, 3, access 1, insert 4, and verify key 2 was evicted.",
      "check": {
        "question": "What are the time and auxiliary space complexities of class ProductionLRUCache for get() and put()?",
        "options": [
          "O(1) time for get and put, O(capacity) auxiliary space",
          "O(N) time for get and O(1) for put",
          "O(log N) time for get and put, O(N^2) space"
        ],
        "answer": 0,
        "why": "Hash map lookup plus doubly linked list pointer updates are O(1), and memory is strictly bounded by capacity."
      }
    }
  ],
  "summary": [
    "LRU Cache achieves O(1) get and put by combining a Hash Map for fast lookup with a Doubly Linked List for fast ordering.",
    "Dummy head and tail sentinels eliminate boundary edge cases during node insertion and deletion.",
    "Accessing an existing key promotes its node to head.next, marking it as Most Recently Used.",
    "When capacity is exceeded, the node before tail (tail.prev) is unlinked and deleted from the map in O(1) time.",
    "Production systems incorporate TTL expiration and concurrency controls to prevent cache stampedes."
  ],
  "projectStep": {
    "title": "Production O(1) LRU Cache Implementation",
    "steps": [
      "Implement DNode and sentinel dummy head/tail initialization.",
      "Implement private remove(node) and add(node) helper methods.",
      "Implement O(1) get(key) with MRU promotion and O(1) put(key, value) with capacity eviction."
    ]
  }
}
,
{
  "day": 6,
  "title": "Queues (FIFO), Circular Ring Buffers & Deques",
  "goal": "Build First-In First-Out (FIFO) queues, implement fixed-capacity circular ring buffers with modulo index wrapping, and master double-ended deque operations in O(1) time.",
  "minutes": 25,
  "recap": "Yesterday you built a production LRU Cache combining a hash map with a doubly linked list. Today we explore the queue family: FIFO queues, circular ring buffers, and double-ended deques.",
  "parts": [
    {
      "title": "FIFO Queue Semantics & Array-Based Implementation",
      "say": [
        "A Queue enforces First-In First-Out (FIFO) ordering: the first element added is the first element removed.",
        "Real-world examples of FIFO queues include print job schedulers, customer service lines, and network packet buffers.",
        "The two fundamental operations are enqueue (adding to the back) and dequeue (removing from the front).",
        "A naive array-based queue uses push() to enqueue at the back and shift() to dequeue from the front.",
        "However, the shift() operation in JavaScript copies every remaining element one position forward, costing O(N) time per dequeue.",
        "For a queue processing millions of messages per second in a production message broker, this O(N) penalty becomes catastrophic.",
        "To achieve true O(1) dequeue, we can maintain a front index pointer that advances forward instead of physically removing elements.",
        "When the front pointer reaches a threshold (e.g., half the array length), we compact the underlying array by slicing off consumed elements.",
        "This amortized approach ensures that the average cost of dequeue operations remains O(1) across N operations."
      ],
      "example": "A supermarket checkout lane: the first customer who enters the queue is the first customer served at the register.",
      "code": "class SimpleQueue<T> {\n  private items: T[] = [];\n  private front = 0;\n\n  enqueue(item: T): void {\n    this.items.push(item);\n  }\n\n  dequeue(): T | undefined {\n    if (this.front >= this.items.length) return undefined;\n    const item = this.items[this.front];\n    this.front++;\n    if (this.front > this.items.length / 2) {\n      this.items = this.items.slice(this.front);\n      this.front = 0;\n    }\n    return item;\n  }\n\n  size(): number {\n    return this.items.length - this.front;\n  }\n}\n\nconst q = new SimpleQueue<string>();\nq.enqueue('A'); q.enqueue('B'); q.enqueue('C');\nconsole.log('Dequeue:', q.dequeue());\nconsole.log('Dequeue:', q.dequeue());\nconsole.log('Size:', q.size());",
      "output": "Dequeue: A\nDequeue: B\nSize: 1",
      "codeNotes": [
        {
          "line": 7,
          "note": "Enqueue appends to the back of the internal array in O(1) amortized time."
        },
        {
          "line": 12,
          "note": "Dequeue reads from front pointer and compacts the array when half the space is consumed."
        }
      ],
      "tryIt": "Enqueue 5 items, dequeue 3, and verify the size is 2.",
      "check": {
        "question": "Why does a naive array shift() operation cost O(N) time for dequeuing?",
        "options": [
          "Because shift() physically copies every remaining element one index forward to fill the vacated slot",
          "Because shift() requires sorting the array after removal",
          "Because JavaScript arrays are stored as linked lists internally"
        ],
        "answer": 0,
        "why": "Array shift() must copy N-1 elements forward, creating linear overhead proportional to queue size."
      }
    },
    {
      "title": "Circular Ring Buffer Architecture",
      "say": [
        "A circular ring buffer solves the wasted space problem by treating a fixed-size array as a virtual circle.",
        "Instead of shifting elements, we wrap indices around using modular arithmetic: (index + 1) % capacity.",
        "The buffer maintains two pointers: head (front of queue for dequeue) and tail (back of queue for enqueue).",
        "When tail reaches the end of the physical array, it wraps around to index 0 if that slot has been freed by previous dequeue operations.",
        "The buffer is considered full when (tail + 1) % capacity equals head, reserving one slot to distinguish full from empty states.",
        "The buffer is empty when head equals tail, meaning no elements are present between the two pointers.",
        "This architecture achieves guaranteed O(1) enqueue and O(1) dequeue with zero array copying or shifting.",
        "Circular ring buffers are the backbone of operating system keyboard input buffers, audio streaming pipelines, and network socket receive queues.",
        "The fixed capacity provides deterministic memory usage, critical for embedded systems and real-time applications where memory allocation must be predictable."
      ],
      "example": "A revolving sushi conveyor belt with 8 fixed plates: new sushi goes onto the next empty plate after the last one, wrapping around to the beginning of the belt when reaching the end.",
      "code": "class CircularBuffer<T> {\n  private buf: (T | undefined)[];\n  private head = 0;\n  private tail = 0;\n  private cap: number;\n\n  constructor(capacity: number) {\n    this.cap = capacity + 1;\n    this.buf = new Array(this.cap);\n  }\n\n  enqueue(item: T): boolean {\n    if ((this.tail + 1) % this.cap === this.head) return false;\n    this.buf[this.tail] = item;\n    this.tail = (this.tail + 1) % this.cap;\n    return true;\n  }\n\n  dequeue(): T | undefined {\n    if (this.head === this.tail) return undefined;\n    const item = this.buf[this.head];\n    this.buf[this.head] = undefined;\n    this.head = (this.head + 1) % this.cap;\n    return item;\n  }\n\n  size(): number {\n    return (this.tail - this.head + this.cap) % this.cap;\n  }\n}\n\nconst ring = new CircularBuffer<number>(3);\nconsole.log('Enqueue 10:', ring.enqueue(10));\nconsole.log('Enqueue 20:', ring.enqueue(20));\nconsole.log('Enqueue 30:', ring.enqueue(30));\nconsole.log('Enqueue 40 (full):', ring.enqueue(40));\nconsole.log('Dequeue:', ring.dequeue());\nconsole.log('Enqueue 40 (after dequeue):', ring.enqueue(40));\nconsole.log('Size:', ring.size());",
      "output": "Enqueue 10: true\nEnqueue 20: true\nEnqueue 30: true\nEnqueue 40 (full): false\nDequeue: 10\nEnqueue 40 (after dequeue): true\nSize: 3",
      "codeNotes": [
        {
          "line": 13,
          "note": "Full check: if advancing tail by one would collide with head, the buffer is at capacity."
        },
        {
          "line": 23,
          "note": "Wraps head forward using modulo arithmetic, providing O(1) dequeue without copying."
        }
      ],
      "tryIt": "Create a buffer of capacity 2, fill it, dequeue both, and verify size returns 0.",
      "check": {
        "question": "Why does a circular ring buffer allocate capacity + 1 internal slots?",
        "options": [
          "To reserve one empty slot so that the full state (tail + 1 == head) is distinguishable from the empty state (head == tail)",
          "Because arrays in JavaScript always need an extra element for garbage collection",
          "To store metadata about the buffer in the last slot"
        ],
        "answer": 0,
        "why": "Without the extra slot, both full and empty states would have head === tail, making them indistinguishable."
      }
    },
    {
      "title": "Double-Ended Queue (Deque) Operations",
      "say": [
        "A Double-Ended Queue, or Deque, generalizes both stacks and queues by supporting insertions and removals at both the front and back.",
        "The four core operations are pushFront, pushBack, popFront, and popBack, each executing in O(1) time.",
        "A deque can function as a pure stack by using only pushBack and popBack, or as a pure queue by using pushBack and popFront.",
        "This versatility makes deques the foundation for advanced algorithms like the sliding window maximum problem.",
        "In the sliding window maximum algorithm, we maintain a monotonic deque of indices where values are kept in decreasing order.",
        "When a new element is larger than the back of the deque, we pop from the back to maintain the monotonic invariant.",
        "When the front element falls outside the current window, we pop from the front to expire old indices.",
        "JavaScript does not have a native Deque class, but we can implement one efficiently using a doubly linked list or a circular buffer with two-directional operations.",
        "Production systems like Redis use deques internally for their List data type, supporting LPUSH, RPUSH, LPOP, and RPOP in constant time."
      ],
      "example": "A double-ended train platform: passengers can board from either the front door or rear door, and exit from either end depending on which platform they reach.",
      "code": "class Deque<T> {\n  private items: T[] = [];\n\n  pushFront(val: T): void { this.items.unshift(val); }\n  pushBack(val: T): void { this.items.push(val); }\n  popFront(): T | undefined { return this.items.shift(); }\n  popBack(): T | undefined { return this.items.pop(); }\n  peekFront(): T | undefined { return this.items[0]; }\n  peekBack(): T | undefined { return this.items[this.items.length - 1]; }\n  size(): number { return this.items.length; }\n}\n\nconst dq = new Deque<number>();\ndq.pushBack(1);\ndq.pushBack(2);\ndq.pushFront(0);\nconsole.log('Front:', dq.peekFront());\nconsole.log('Back:', dq.peekBack());\nconsole.log('Pop front:', dq.popFront());\nconsole.log('Pop back:', dq.popBack());\nconsole.log('Remaining size:', dq.size());",
      "output": "Front: 0\nBack: 2\nPop front: 0\nPop back: 2\nRemaining size: 1",
      "codeNotes": [
        {
          "line": 4,
          "note": "pushFront inserts at the beginning; in production, a linked list avoids the O(N) shift cost."
        },
        {
          "line": 10,
          "note": "Size tracks logical element count across both ends of the deque."
        }
      ],
      "tryIt": "Push values 10, 20, 30 to the back, then pop from front twice and verify the remaining value is 30.",
      "check": {
        "question": "How can a Deque simulate both a stack and a queue?",
        "options": [
          "Using only pushBack/popBack gives stack behavior (LIFO); using pushBack/popFront gives queue behavior (FIFO)",
          "By sorting elements after each insertion",
          "By maintaining two separate internal arrays"
        ],
        "answer": 0,
        "why": "Restricting operations to one end yields LIFO; using opposite ends yields FIFO, demonstrating deque generality."
      }
    },
    {
      "title": "BFS Level-Order Traversal Using Queues",
      "say": [
        "Breadth-First Search (BFS) is the canonical application of FIFO queues in graph and tree traversal algorithms.",
        "BFS explores all nodes at the current depth level before moving deeper, guaranteeing shortest-path discovery in unweighted graphs.",
        "The algorithm begins by enqueuing the root node and marking it as visited.",
        "In each iteration, we dequeue the front node, process it, and enqueue all of its unvisited neighbors.",
        "The FIFO property ensures that neighbors discovered earlier are explored before neighbors discovered later, maintaining level-order progression.",
        "For tree traversal, BFS produces level-order output: all nodes at depth 0, then depth 1, then depth 2, and so on.",
        "The time complexity of BFS is O(V + E) where V is the number of vertices and E is the number of edges.",
        "Space complexity is O(V) for the visited set and the queue, which in the worst case may hold an entire level of the tree.",
        "BFS is foundational for web crawlers, social network friend-of-friend discovery, and GPS shortest-path routing engines."
      ],
      "example": "Ripples spreading from a stone dropped in a pond: each ring of ripples expands uniformly outward, reaching all points at the same distance before moving further.",
      "code": "function bfsTraversal(graph: Map<string, string[]>, start: string): string[] {\n  const visited = new Set<string>();\n  const queue: string[] = [start];\n  const order: string[] = [];\n  visited.add(start);\n\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    order.push(node);\n    for (const neighbor of (graph.get(node) || [])) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n  return order;\n}\n\nconst graph = new Map<string, string[]>();\ngraph.set('A', ['B', 'C']);\ngraph.set('B', ['D']);\ngraph.set('C', ['D', 'E']);\ngraph.set('D', []);\ngraph.set('E', []);\n\nconsole.log('BFS order:', bfsTraversal(graph, 'A').join(' -> '));",
      "output": "BFS order: A -> B -> C -> D -> E",
      "codeNotes": [
        {
          "line": 8,
          "note": "Dequeues front node for processing; FIFO ordering guarantees level-by-level exploration."
        },
        {
          "line": 12,
          "note": "Marks neighbors as visited before enqueuing to prevent duplicate processing."
        }
      ],
      "tryIt": "Add a node F connected to B and verify that BFS visits F after D but before E.",
      "check": {
        "question": "Why does BFS guarantee finding the shortest path in an unweighted graph?",
        "options": [
          "FIFO ordering ensures all nodes at distance d are fully explored before any node at distance d+1 is processed",
          "Because BFS sorts nodes by their alphabetical name",
          "Because BFS uses recursion to explore the deepest nodes first"
        ],
        "answer": 0,
        "why": "The queue's FIFO property processes closer nodes before farther ones, ensuring shortest-path optimality."
      }
    },
    {
      "title": "Priority Queue Preview & Heap Ordering Contrast",
      "say": [
        "While standard queues process elements in arrival order, many real-world systems require processing by priority rather than arrival time.",
        "A Priority Queue is an abstract data type where each element has an associated priority value, and dequeue always returns the highest-priority element.",
        "Emergency rooms triage patients by medical severity rather than arrival time: a heart attack patient is treated before a sprained ankle, regardless of who arrived first.",
        "A naive implementation using an unsorted array provides O(1) enqueue but O(N) dequeue, since we must scan every element to find the highest priority.",
        "Sorting the array after each enqueue costs O(N log N), which is even worse for high-throughput systems.",
        "The optimal data structure for a priority queue is a Binary Heap, which provides O(log N) enqueue (insert with bubble-up) and O(log N) dequeue (extract-min with bubble-down).",
        "A Min-Heap maintains the invariant that every parent node has a value less than or equal to its children.",
        "Binary heaps are stored as flat arrays where the children of index i are at indices 2i+1 and 2i+2, requiring zero pointer overhead.",
        "We will build a complete production Min-Heap in Day 18; today we preview the concept to contrast FIFO ordering with priority-based ordering."
      ],
      "example": "Airport boarding: first-class passengers board before economy passengers regardless of when they checked in, because their ticket carries higher priority.",
      "code": "function naivePriorityDequeue(items: [string, number][]): [string, number] | undefined {\n  if (items.length === 0) return undefined;\n  let minIdx = 0;\n  for (let i = 1; i < items.length; i++) {\n    if (items[i][1] < items[minIdx][1]) minIdx = i;\n  }\n  const result = items[minIdx];\n  items.splice(minIdx, 1);\n  return result;\n}\n\nconst tasks: [string, number][] = [];\ntasks.push(['backup', 5]);\ntasks.push(['alert', 1]);\ntasks.push(['report', 3]);\n\nconsole.log('Highest priority:', naivePriorityDequeue(tasks));\nconsole.log('Next priority:', naivePriorityDequeue(tasks));\nconsole.log('Last:', naivePriorityDequeue(tasks));",
      "output": "Highest priority: [ 'alert', 1 ]\nNext priority: [ 'report', 3 ]\nLast: [ 'backup', 5 ]",
      "codeNotes": [
        {
          "line": 4,
          "note": "Linear scan finds the minimum priority element in O(N) time; a heap would reduce this to O(log N)."
        },
        {
          "line": 8,
          "note": "Splice removes the element, shifting remaining items forward in O(N) time."
        }
      ],
      "tryIt": "Add a task ['critical', 0] and verify it dequeues first before 'alert'.",
      "check": {
        "question": "What is the time complexity advantage of a Binary Heap over a sorted array for priority queue operations?",
        "options": [
          "Heap provides O(log N) insert and O(log N) extract-min, while a sorted array requires O(N) insert to maintain order",
          "Heaps are faster because they use less memory than arrays",
          "Sorted arrays are always faster because binary search is O(log N)"
        ],
        "answer": 0,
        "why": "Maintaining full sort order costs O(N) on insert; a heap only maintains partial order, achieving O(log N) for both operations."
      }
    },
    {
      "title": "Production Task Scheduler with Queue Orchestration",
      "say": [
        "We now combine all queue concepts into a production task scheduler that demonstrates FIFO processing, capacity limits, and priority-aware dispatching.",
        "The scheduler accepts incoming tasks, buffers them in a bounded FIFO queue, and processes them in arrival order within each priority tier.",
        "When the buffer is full, new tasks are rejected with a capacity overflow signal, preventing memory exhaustion.",
        "The scheduler maintains separate counters for processed tasks, rejected tasks, and remaining tasks for operational observability.",
        "In production microservice architectures, task queues sit between API gateways and worker processes, absorbing traffic spikes and smoothing workload distribution.",
        "Message brokers like RabbitMQ and Apache Kafka implement bounded queue buffers with configurable capacity limits and dead-letter queues for rejected messages.",
        "Back-pressure mechanisms allow the queue to signal upstream producers to slow down when the buffer reaches a configurable high-water mark.",
        "Today you have mastered the FIFO queue, circular ring buffer, double-ended deque, and their applications in BFS traversal and task scheduling.",
        "These queue patterns form the communication backbone of every distributed system, from web servers to operating system process schedulers."
      ],
      "example": "A restaurant kitchen ticket rail with space for 4 orders: once 4 tickets are hanging, the waiter must wait for a cook to finish one before clipping up a new ticket.",
      "code": "class TaskScheduler {\n  private queue: string[] = [];\n  private maxSize: number;\n  private processed: string[] = [];\n  private rejected: string[] = [];\n\n  constructor(maxSize: number) { this.maxSize = maxSize; }\n\n  submit(task: string): string {\n    if (this.queue.length >= this.maxSize) {\n      this.rejected.push(task);\n      return 'rejected';\n    }\n    this.queue.push(task);\n    return 'accepted';\n  }\n\n  processNext(): string | undefined {\n    const task = this.queue.shift();\n    if (task) this.processed.push(task);\n    return task;\n  }\n\n  stats(): string {\n    return `queued=${this.queue.length} processed=${this.processed.length} rejected=${this.rejected.length}`;\n  }\n}\n\nconst sched = new TaskScheduler(2);\nconsole.log('Submit A:', sched.submit('A'));\nconsole.log('Submit B:', sched.submit('B'));\nconsole.log('Submit C:', sched.submit('C'));\nconsole.log('Process:', sched.processNext());\nconsole.log('Submit D:', sched.submit('D'));\nconsole.log('Stats:', sched.stats());",
      "output": "Submit A: accepted\nSubmit B: accepted\nSubmit C: rejected\nProcess: A\nSubmit D: accepted\nStats: queued=2 processed=1 rejected=1",
      "codeNotes": [
        {
          "line": 10,
          "note": "Capacity guard rejects tasks when buffer is full, implementing back-pressure for upstream producers."
        },
        {
          "line": 19,
          "note": "Processes FIFO: the oldest task in the queue is always handled first."
        }
      ],
      "tryIt": "Set maxSize to 1, submit 3 tasks, process all, and verify stats show 1 processed and 2 rejected.",
      "check": {
        "question": "What is the purpose of back-pressure in a production task queue?",
        "options": [
          "To signal upstream producers to slow down when the queue buffer is full, preventing memory exhaustion and system crashes",
          "To compress queue data for faster transmission",
          "To encrypt task payloads before storage"
        ],
        "answer": 0,
        "why": "Back-pressure prevents unbounded memory growth by rejecting or throttling new tasks when the queue reaches capacity."
      }
    }
  ],
  "summary": [
    "FIFO queues process elements in arrival order with enqueue at back and dequeue from front.",
    "Circular ring buffers achieve O(1) operations using modulo index wrapping without array shifting.",
    "Deques support O(1) insertions and removals at both ends, generalizing stacks and queues.",
    "BFS uses FIFO queues to explore graphs level-by-level, guaranteeing shortest paths in unweighted graphs.",
    "Bounded queues implement back-pressure to prevent memory exhaustion in production systems."
  ],
  "projectStep": {
    "title": "FIFO Queue & Circular Ring Buffer Implementation",
    "steps": [
      "Implement a SimpleQueue with front pointer compaction for amortized O(1) dequeue.",
      "Implement a CircularBuffer with modulo wrapping and full/empty state detection.",
      "Build a bounded TaskScheduler with capacity rejection and FIFO processing."
    ]
  }
},
{
  "day": 7,
  "title": "Hash Tables, Collision Resolution & Load Factors",
  "goal": "Understand hash functions, implement collision resolution via separate chaining and linear probing, and master dynamic load factor table resizing.",
  "minutes": 25,
  "recap": "Yesterday you mastered queues, circular ring buffers, and deques. Today we dissect hash tables, the most important O(1) average-time data structure in all of computer science.",
  "parts": [
    {
      "title": "Hash Function Principles & Deterministic Mapping",
      "say": [
        "A hash table provides O(1) average-case lookup, insertion, and deletion by mapping keys to array indices through a hash function.",
        "A hash function is a deterministic mathematical function that converts any input key into a fixed-range integer index.",
        "The same key must always produce the same hash value; this determinism is essential for reliable retrieval.",
        "An ideal hash function distributes keys uniformly across all available buckets, minimizing clustering and collisions.",
        "In JavaScript, objects and Maps use built-in hash functions optimized by the V8 engine for string and numeric keys.",
        "For custom hash tables, a common approach is to sum character codes and take modulo with the table size: hash = sum % tableSize.",
        "However, simple modulo hashing can produce clustering if keys share similar patterns (e.g., 'abc' and 'bca' may collide).",
        "Production hash functions like MurmurHash3 and xxHash use bitwise mixing operations to achieve near-perfect uniform distribution.",
        "Understanding hash function design is critical for building secure, efficient data structures that resist adversarial inputs and denial-of-service attacks."
      ],
      "example": "A library filing system: the first letter of an author's last name determines which shelf section to check, providing near-instant book location.",
      "code": "function simpleHash(key: string, tableSize: number): number {\n  let hash = 0;\n  for (let i = 0; i < key.length; i++) {\n    hash = (hash * 31 + key.charCodeAt(i)) % tableSize;\n  }\n  return hash;\n}\n\nconst size = 10;\nconsole.log('Hash of \"hello\":', simpleHash('hello', size));\nconsole.log('Hash of \"world\":', simpleHash('world', size));\nconsole.log('Hash of \"hello\" again:', simpleHash('hello', size));\nconsole.log('Deterministic:', simpleHash('hello', size) === simpleHash('hello', size));",
      "output": "Hash of \"hello\": 2\nHash of \"world\": 2\nHash of \"hello\" again: 2\nDeterministic: true",
      "codeNotes": [
        {
          "line": 4,
          "note": "Multiplying by prime 31 before adding each character code reduces collision probability."
        },
        {
          "line": 12,
          "note": "Demonstrates determinism: the same key always produces the same hash index."
        }
      ],
      "tryIt": "Hash the keys 'a', 'b', 'c' with tableSize 5 and observe if any collide.",
      "check": {
        "question": "Why must a hash function be deterministic?",
        "options": [
          "Because the same key must always map to the same bucket index to enable reliable retrieval of stored values",
          "Because non-deterministic functions are slower to compute",
          "Because JavaScript requires all functions to return the same value"
        ],
        "answer": 0,
        "why": "Non-deterministic hashing would store a key at one index but look for it at a different index, causing permanent data loss."
      }
    },
    {
      "title": "Separate Chaining Collision Resolution",
      "say": [
        "When two different keys hash to the same bucket index, a collision occurs.",
        "Separate chaining resolves collisions by storing a linked list (or array) at each bucket.",
        "When inserting a key-value pair, we hash the key to find the bucket, then append the entry to that bucket's chain.",
        "When retrieving a key, we hash to the bucket, then linearly scan the chain for a matching key.",
        "If the hash function distributes keys uniformly and the load factor is low, each chain has O(1) expected length.",
        "In the worst case, if all N keys hash to the same bucket, the chain degrades to O(N) linear search, equivalent to an unsorted array.",
        "This worst case is exploitable by adversarial inputs in web applications, a class of attack called HashDoS.",
        "To mitigate HashDoS, production systems use randomized hash seeds that change per process startup, making collision prediction impossible.",
        "Java 8 further mitigates degenerate chains by converting long chains into balanced red-black trees, guaranteeing O(log N) worst case."
      ],
      "example": "Office mailboxes numbered 0 to 9: when two employees share mailbox 3, their letters are stacked together inside that single box, and they must sort through the stack to find their own.",
      "code": "class ChainingHashTable {\n  private buckets: [string, number][][];\n  private size: number;\n\n  constructor(capacity: number) {\n    this.size = capacity;\n    this.buckets = Array.from({ length: capacity }, () => []);\n  }\n\n  private hash(key: string): number {\n    let h = 0;\n    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % this.size;\n    return h;\n  }\n\n  set(key: string, val: number): void {\n    const idx = this.hash(key);\n    const chain = this.buckets[idx];\n    for (const entry of chain) {\n      if (entry[0] === key) { entry[1] = val; return; }\n    }\n    chain.push([key, val]);\n  }\n\n  get(key: string): number | undefined {\n    const idx = this.hash(key);\n    for (const entry of this.buckets[idx]) {\n      if (entry[0] === key) return entry[1];\n    }\n    return undefined;\n  }\n}\n\nconst ht = new ChainingHashTable(4);\nht.set('apple', 5);\nht.set('banana', 3);\nht.set('cherry', 8);\nconsole.log('apple:', ht.get('apple'));\nconsole.log('banana:', ht.get('banana'));\nconsole.log('missing:', ht.get('grape'));",
      "output": "apple: 5\nbanana: 3\nmissing: undefined",
      "codeNotes": [
        {
          "line": 17,
          "note": "Hashes the key and scans the bucket chain for existing entries before appending."
        },
        {
          "line": 27,
          "note": "Retrieval scans the chain at the hashed index; O(1) average with good distribution."
        }
      ],
      "tryIt": "Insert 10 keys into a table of size 2 and observe that the chains become long.",
      "check": {
        "question": "What happens in separate chaining when all keys hash to the same bucket?",
        "options": [
          "The single chain grows to length N, degrading lookup to O(N) linear scan",
          "The table automatically resizes to prevent this",
          "The hash function recomputes with a different seed"
        ],
        "answer": 0,
        "why": "All entries land in one bucket, forming a single long chain that requires linear scanning."
      }
    },
    {
      "title": "Open Addressing & Linear Probing",
      "say": [
        "Open addressing stores all entries directly in the hash table array itself, without external chains or linked lists.",
        "When a collision occurs during insertion, the algorithm probes subsequent slots until an empty one is found.",
        "Linear probing checks slots at indices h, h+1, h+2, h+3, and so on, wrapping around with modulo arithmetic.",
        "During lookup, the same probing sequence is followed until the key is found or an empty slot confirms absence.",
        "Linear probing has excellent cache performance because it accesses contiguous memory locations, leveraging CPU cache lines.",
        "However, linear probing suffers from primary clustering: once a cluster of occupied slots forms, new keys tend to extend the cluster.",
        "Quadratic probing mitigates clustering by checking h, h+1, h+4, h+9 (i.e., h + i^2) instead of h+i.",
        "Double hashing uses a second independent hash function to compute the step size, providing the most uniform distribution among open addressing schemes.",
        "Deletion in open addressing requires tombstone markers rather than truly emptying slots, because empty slots would prematurely terminate probe sequences."
      ],
      "example": "Parking in a crowded lot: if spot 5 is taken, you check spot 6, then 7, driving along the row until you find the first open space.",
      "code": "class LinearProbeTable {\n  private keys: (string | null)[];\n  private vals: (number | null)[];\n  private cap: number;\n\n  constructor(cap: number) {\n    this.cap = cap;\n    this.keys = new Array(cap).fill(null);\n    this.vals = new Array(cap).fill(null);\n  }\n\n  private hash(key: string): number {\n    let h = 0;\n    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % this.cap;\n    return h;\n  }\n\n  set(key: string, val: number): void {\n    let idx = this.hash(key);\n    while (this.keys[idx] !== null && this.keys[idx] !== key) {\n      idx = (idx + 1) % this.cap;\n    }\n    this.keys[idx] = key;\n    this.vals[idx] = val;\n  }\n\n  get(key: string): number | null {\n    let idx = this.hash(key);\n    while (this.keys[idx] !== null) {\n      if (this.keys[idx] === key) return this.vals[idx];\n      idx = (idx + 1) % this.cap;\n    }\n    return null;\n  }\n}\n\nconst lp = new LinearProbeTable(8);\nlp.set('cat', 1);\nlp.set('dog', 2);\nlp.set('rat', 3);\nconsole.log('cat:', lp.get('cat'));\nconsole.log('dog:', lp.get('dog'));\nconsole.log('rat:', lp.get('rat'));\nconsole.log('fox:', lp.get('fox'));",
      "output": "cat: 1\ndog: 2\nrat: 3\nfox: null",
      "codeNotes": [
        {
          "line": 20,
          "note": "Linear probing advances one slot at a time until finding an empty or matching slot."
        },
        {
          "line": 30,
          "note": "Lookup probes forward until finding the key or hitting an empty slot (meaning key absent)."
        }
      ],
      "tryIt": "Insert keys 'a' and 'b' that hash to the same index and verify both are retrievable.",
      "check": {
        "question": "What is 'primary clustering' in linear probing?",
        "options": [
          "Occupied slots form contiguous runs that grow longer, increasing probe lengths for new insertions",
          "Keys are sorted alphabetically within each cluster",
          "The hash function returns the same value for all keys"
        ],
        "answer": 0,
        "why": "Contiguous occupied blocks attract more keys to their boundaries, creating ever-growing clusters."
      }
    },
    {
      "title": "Load Factor Threshold & Dynamic Rehashing",
      "say": [
        "The load factor alpha is defined as the ratio of stored entries to total table capacity: alpha = N / M.",
        "As the load factor increases, collision frequency rises and probe chains grow longer, degrading O(1) performance toward O(N).",
        "The critical threshold for open addressing is typically alpha = 0.75; for separate chaining, it can be higher (up to 1.0 or more).",
        "When the load factor exceeds the threshold, the table triggers a rehash: allocating a new array of double the size.",
        "Every existing entry must be re-inserted into the new table because hash indices change when the table size changes.",
        "Rehashing costs O(N) for the current N entries, but it occurs infrequently enough that the amortized cost per insertion remains O(1).",
        "This geometric doubling strategy is identical to the amortized analysis of dynamic arrays: occasional O(N) copies spread across N insertions yield O(1) amortized per operation.",
        "Shrinking the table when the load factor drops below 0.25 prevents wasted memory after bulk deletions.",
        "Production hash tables in V8 (JavaScript engine), CPython, and Java all implement automatic load factor monitoring and rehashing."
      ],
      "example": "A restaurant expanding to a second dining room when tables are 75% occupied: moving all existing diners to new seating assignments takes effort, but future service is faster with more space.",
      "code": "class ResizingHashMap {\n  private keys: (string | null)[];\n  private vals: (number | null)[];\n  private cap: number;\n  private count = 0;\n\n  constructor(cap = 4) {\n    this.cap = cap;\n    this.keys = new Array(cap).fill(null);\n    this.vals = new Array(cap).fill(null);\n  }\n\n  private hash(key: string): number {\n    let h = 0;\n    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % this.cap;\n    return h;\n  }\n\n  private resize(newCap: number): void {\n    const oldKeys = this.keys;\n    const oldVals = this.vals;\n    this.cap = newCap;\n    this.keys = new Array(newCap).fill(null);\n    this.vals = new Array(newCap).fill(null);\n    this.count = 0;\n    for (let i = 0; i < oldKeys.length; i++) {\n      if (oldKeys[i] !== null) this.set(oldKeys[i]!, oldVals[i]!);\n    }\n  }\n\n  set(key: string, val: number): void {\n    if (this.count >= this.cap * 0.75) this.resize(this.cap * 2);\n    let idx = this.hash(key);\n    while (this.keys[idx] !== null && this.keys[idx] !== key) {\n      idx = (idx + 1) % this.cap;\n    }\n    if (this.keys[idx] === null) this.count++;\n    this.keys[idx] = key;\n    this.vals[idx] = val;\n  }\n\n  get(key: string): number | null {\n    let idx = this.hash(key);\n    while (this.keys[idx] !== null) {\n      if (this.keys[idx] === key) return this.vals[idx];\n      idx = (idx + 1) % this.cap;\n    }\n    return null;\n  }\n\n  info(): string {\n    return `count=${this.count} capacity=${this.cap} load=${(this.count / this.cap).toFixed(2)}`;\n  }\n}\n\nconst map = new ResizingHashMap(4);\nmap.set('a', 1); map.set('b', 2); map.set('c', 3);\nconsole.log('Before resize:', map.info());\nmap.set('d', 4);\nconsole.log('After resize:', map.info());\nconsole.log('Get a:', map.get('a'));\nconsole.log('Get d:', map.get('d'));",
      "output": "Before resize: count=3 capacity=4 load=0.75\nAfter resize: count=4 capacity=8 load=0.50\nGet a: 1\nGet d: 4",
      "codeNotes": [
        {
          "line": 32,
          "note": "Checks load factor before insertion; triggers resize when reaching 75% capacity."
        },
        {
          "line": 19,
          "note": "Rehash re-inserts all existing entries into the new larger table using updated hash indices."
        }
      ],
      "tryIt": "Start with capacity 2, insert 4 keys, and observe the capacity doubling to 4 then 8.",
      "check": {
        "question": "Why must all existing entries be re-inserted during a rehash?",
        "options": [
          "Because hash indices are computed as key % tableSize, and changing the table size changes every key's target index",
          "Because the old entries are deleted from memory during rehashing",
          "Because the hash function changes to a new algorithm on each resize"
        ],
        "answer": 0,
        "why": "Modulo-based hashing depends on table size; doubling the size changes the computed index for most keys."
      }
    },
    {
      "title": "Frequency Counter Pattern with Hash Maps",
      "say": [
        "One of the most ubiquitous algorithmic patterns is the frequency counter, which tallies occurrences of elements using a hash map.",
        "The pattern iterates through a collection once, incrementing a counter in the map for each element, achieving O(N) time complexity.",
        "Frequency counters solve a vast category of problems: anagram detection, finding duplicates, majority element identification, and character frequency analysis.",
        "For anagram detection, we build frequency maps for both strings and compare them; if all character counts match, the strings are anagrams.",
        "The majority element problem asks for an element appearing more than N/2 times; a frequency map solves this trivially in O(N) time and O(N) space.",
        "In streaming data scenarios, frequency maps power real-time analytics dashboards tracking event counts, error rates, and user activity metrics.",
        "The frequency counter pattern demonstrates the profound power of hash maps: converting O(N^2) brute-force nested-loop comparisons into elegant O(N) single-pass solutions.",
        "Today you have mastered hash functions, collision resolution via separate chaining and linear probing, dynamic rehashing, and the frequency counter pattern.",
        "Hash tables are the single most important data structure in practical software engineering, underlying databases, caches, compilers, and network routers."
      ],
      "example": "A vote-counting machine: for each ballot, the machine increments the counter next to the candidate's name, tallying all votes in a single pass.",
      "code": "function areAnagrams(s1: string, s2: string): boolean {\n  if (s1.length !== s2.length) return false;\n  const freq = new Map<string, number>();\n  for (const ch of s1) freq.set(ch, (freq.get(ch) || 0) + 1);\n  for (const ch of s2) {\n    const count = freq.get(ch);\n    if (!count) return false;\n    freq.set(ch, count - 1);\n  }\n  return true;\n}\n\nconsole.log('listen vs silent:', areAnagrams('listen', 'silent'));\nconsole.log('hello vs world:', areAnagrams('hello', 'world'));\nconsole.log('abc vs cba:', areAnagrams('abc', 'cba'));",
      "output": "listen vs silent: true\nhello vs world: false\nabc vs cba: true",
      "codeNotes": [
        {
          "line": 4,
          "note": "Builds frequency map from first string in O(N) time."
        },
        {
          "line": 7,
          "note": "Decrements frequencies using second string; any missing or zero count proves non-anagram."
        }
      ],
      "tryIt": "Test with 'racecar' and 'carrace' to verify they are anagrams.",
      "check": {
        "question": "How does the frequency counter pattern reduce anagram detection from O(N^2) to O(N)?",
        "options": [
          "By replacing nested loops comparing each character pair with a single-pass frequency map that tallies counts in O(N) time",
          "By sorting both strings and comparing them character by character",
          "By using binary search on each character"
        ],
        "answer": 0,
        "why": "A hash map tallies character frequencies in one pass per string, eliminating the need for nested character-by-character comparison."
      }
    }
  ],
  "summary": [
    "Hash tables achieve O(1) average-case operations by mapping keys to array indices through deterministic hash functions.",
    "Separate chaining resolves collisions by storing linked lists at each bucket; linear probing uses contiguous slots.",
    "Load factor alpha = N/M must stay below 0.75 for open addressing; exceeding it triggers capacity doubling and rehashing.",
    "Rehashing costs O(N) but occurs infrequently, preserving O(1) amortized insertion time.",
    "The frequency counter pattern leverages hash maps to convert O(N^2) brute-force problems into O(N) single-pass solutions."
  ],
  "projectStep": {
    "title": "Hash Table with Collision Resolution & Rehashing",
    "steps": [
      "Implement a ChainingHashTable with separate chaining collision resolution.",
      "Implement a LinearProbeTable with open addressing and linear probing.",
      "Add dynamic resize at load factor 0.75 and verify all entries survive rehashing."
    ]
  }
},
{
  "day": 8,
  "title": "Two Pointers Technique (Opposite Direction & Fast/Slow Pointers)",
  "goal": "Solve container optimization, palindrome verification, and target sum problems in O(N) time using opposite-direction convergence and fast/slow pointer patterns.",
  "minutes": 25,
  "recap": "Yesterday you mastered hash tables, collision resolution, and dynamic rehashing. Today we learn the Two Pointers technique, transforming O(N^2) brute-force scans into elegant O(N) linear-time solutions.",
  "parts": [
    {
      "title": "Opposite-Direction Convergence Pattern",
      "say": [
        "The Two Pointers technique places one pointer at the start and another at the end of a sorted array, then moves them inward based on comparison logic.",
        "This pattern exploits the sorted order to eliminate large portions of the search space in each step.",
        "For the classic Two Sum on a sorted array problem, we compute the sum of elements at the left and right pointers.",
        "If the sum equals the target, we have found the answer immediately.",
        "If the sum is too small, we move the left pointer rightward to increase the sum, because all elements to the right are larger.",
        "If the sum is too large, we move the right pointer leftward to decrease the sum, because all elements to the left are smaller.",
        "Each step eliminates at least one candidate index, guaranteeing convergence in at most N steps for O(N) total time.",
        "This contrasts with the brute-force approach of testing all pairs with nested loops, which costs O(N^2) time.",
        "The Two Pointers approach requires O(1) auxiliary space, making it both time-optimal and space-optimal for sorted array problems."
      ],
      "example": "Two people searching for each other in a long hallway: one starts at the left door and walks right, the other starts at the right door and walks left, until they meet.",
      "code": "function twoSumSorted(nums: number[], target: number): [number, number] | null {\n  let left = 0;\n  let right = nums.length - 1;\n\n  while (left < right) {\n    const sum = nums[left] + nums[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return null;\n}\n\nconst arr = [1, 3, 5, 7, 11, 15];\nconsole.log('Target 16:', JSON.stringify(twoSumSorted(arr, 16)));\nconsole.log('Target 8:', JSON.stringify(twoSumSorted(arr, 8)));\nconsole.log('Target 100:', JSON.stringify(twoSumSorted(arr, 100)));",
      "output": "Target 16: [0,5]\nTarget 8: [0,3]\nTarget 100: null",
      "codeNotes": [
        {
          "line": 7,
          "note": "Returns immediately when the sum matches, achieving O(1) best case."
        },
        {
          "line": 8,
          "note": "Moves left pointer right to increase sum; moves right pointer left to decrease sum."
        }
      ],
      "tryIt": "Test with [2, 4, 6, 8, 10] and target 12 to find the pair [0, 4] or [1, 3].",
      "check": {
        "question": "Why does the Two Pointer technique only work on sorted arrays for the two-sum problem?",
        "options": [
          "Because sorted order guarantees that moving left increases the sum and moving right decreases it, enabling directional elimination",
          "Because unsorted arrays cannot store numbers",
          "Because JavaScript sorts arrays automatically before searches"
        ],
        "answer": 0,
        "why": "Sorted order creates a monotonic relationship between pointer movement and sum change, enabling deterministic convergence."
      }
    },
    {
      "title": "Container With Most Water (Greedy Pointer Movement)",
      "say": [
        "The Container With Most Water problem asks for the maximum area formed between two vertical lines on a height array.",
        "Area is computed as the minimum height of the two lines multiplied by the distance between them: min(h[left], h[right]) * (right - left).",
        "Starting with pointers at the extreme ends maximizes the initial width, which is the full array length minus one.",
        "The key insight is that we should always move the pointer pointing to the shorter line inward.",
        "Moving the shorter pointer might discover a taller line, potentially increasing the area despite reducing width.",
        "Moving the taller pointer can only decrease the area because the bottleneck height stays the same or gets shorter, while width shrinks.",
        "This greedy decision rule ensures that we never skip a potentially optimal configuration.",
        "The algorithm processes each index exactly once with each pointer moving monotonically inward, yielding O(N) time and O(1) space.",
        "This problem demonstrates the broader principle that greedy pointer advancement can solve optimization problems that appear to require exhaustive search."
      ],
      "example": "Choosing which wall to move in a swimming pool bounded by two walls: always slide the shorter wall inward, hoping to find a taller replacement.",
      "code": "function maxArea(heights: number[]): number {\n  let left = 0;\n  let right = heights.length - 1;\n  let maxWater = 0;\n\n  while (left < right) {\n    const h = Math.min(heights[left], heights[right]);\n    const w = right - left;\n    maxWater = Math.max(maxWater, h * w);\n    if (heights[left] <= heights[right]) left++;\n    else right--;\n  }\n  return maxWater;\n}\n\nconsole.log('Max area [1,8,6,2,5,4,8,3,7]:', maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));\nconsole.log('Max area [1,1]:', maxArea([1, 1]));\nconsole.log('Max area [4,3,2,1,4]:', maxArea([4, 3, 2, 1, 4]));",
      "output": "Max area [1,8,6,2,5,4,8,3,7]: 49\nMax area [1,1]: 1\nMax area [4,3,2,1,4]: 16",
      "codeNotes": [
        {
          "line": 7,
          "note": "Area is bottlenecked by the shorter height; width is the distance between pointers."
        },
        {
          "line": 10,
          "note": "Always move the shorter side inward; moving the taller side can only reduce area."
        }
      ],
      "tryIt": "Test with [5, 5, 5, 5] and verify the max area is 15 (height 5 * width 3).",
      "check": {
        "question": "Why do we always move the pointer pointing to the shorter line?",
        "options": [
          "Because the shorter line is the bottleneck; moving it might find a taller replacement, while moving the taller line cannot improve the bottleneck",
          "Because the shorter line is always at the left pointer",
          "Because moving the taller line is computationally more expensive"
        ],
        "answer": 0,
        "why": "Area is limited by the shorter wall; only by replacing the shorter wall can we potentially increase the constraining height."
      }
    },
    {
      "title": "Palindrome Verification with Two Pointers",
      "say": [
        "A palindrome reads the same forwards and backwards: 'racecar', 'level', and 'madam' are all palindromes.",
        "The Two Pointers technique provides the most elegant O(N) time, O(1) space palindrome verification algorithm.",
        "We place the left pointer at index 0 and the right pointer at the last index.",
        "At each step, we compare the characters at both pointers.",
        "If they match, we advance left forward and right backward, converging toward the center.",
        "If they do not match at any point, the string is definitively not a palindrome, and we return false immediately.",
        "If the pointers meet or cross without any mismatch, the string is confirmed as a palindrome.",
        "For case-insensitive palindrome checks, we convert both characters to lowercase before comparing.",
        "This approach avoids creating a reversed copy of the string, which would cost O(N) extra space."
      ],
      "example": "Two inspectors checking a bridge from opposite ends: each inspector checks their section matches the other's section, meeting in the middle.",
      "code": "function isPalindrome(s: string): boolean {\n  let left = 0;\n  let right = s.length - 1;\n\n  while (left < right) {\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;\n    left++;\n    right--;\n  }\n  return true;\n}\n\nconsole.log('racecar:', isPalindrome('racecar'));\nconsole.log('hello:', isPalindrome('hello'));\nconsole.log('RaceCar:', isPalindrome('RaceCar'));\nconsole.log('a:', isPalindrome('a'));",
      "output": "racecar: true\nhello: false\nRaceCar: true\na: true",
      "codeNotes": [
        {
          "line": 6,
          "note": "Case-insensitive comparison; immediately returns false on first mismatch."
        },
        {
          "line": 9,
          "note": "Pointers converge; if they meet or cross, all characters matched symmetrically."
        }
      ],
      "tryIt": "Test with 'Madam' and verify it returns true due to case-insensitive comparison.",
      "check": {
        "question": "Why is the Two Pointer palindrome check more space-efficient than reversing the string?",
        "options": [
          "It uses O(1) auxiliary space with two index pointers instead of O(N) space for a reversed copy",
          "Because it processes the string in reverse order",
          "Because it uses a hash map to store character positions"
        ],
        "answer": 0,
        "why": "Two integer pointers require O(1) space; creating a reversed string allocates O(N) additional memory."
      }
    },
    {
      "title": "Fast & Slow Pointers (Floyd's Cycle Detection)",
      "say": [
        "The Fast and Slow Pointers pattern, also known as the Tortoise and Hare algorithm, uses two pointers moving at different speeds.",
        "The slow pointer advances one step at a time, while the fast pointer advances two steps at a time.",
        "In a linked list with a cycle, the fast pointer will eventually lap the slow pointer and they will meet inside the cycle.",
        "If the fast pointer reaches the end (null), the list has no cycle.",
        "This algorithm detects cycles in O(N) time with O(1) space, without modifying the list or using a visited set.",
        "Beyond cycle detection, the fast/slow pattern also finds the middle element of a linked list in a single pass.",
        "When the fast pointer reaches the end of the list, the slow pointer will be at the exact middle position.",
        "This is because the slow pointer travels exactly half the distance of the fast pointer at every step.",
        "Floyd's algorithm is fundamental in functional programming, operating system deadlock detection, and cryptographic hash collision finding."
      ],
      "example": "A race track: if two runners start at the same point and one runs twice as fast, the faster runner will eventually lap the slower runner if the track is circular.",
      "code": "class ListNode {\n  val: number;\n  next: ListNode | null = null;\n  constructor(val: number) { this.val = val; }\n}\n\nfunction hasCycle(head: ListNode | null): boolean {\n  let slow = head;\n  let fast = head;\n  while (fast !== null && fast.next !== null) {\n    slow = slow!.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}\n\nconst n1 = new ListNode(1);\nconst n2 = new ListNode(2);\nconst n3 = new ListNode(3);\nn1.next = n2; n2.next = n3;\nconsole.log('No cycle:', hasCycle(n1));\nn3.next = n1;\nconsole.log('With cycle:', hasCycle(n1));",
      "output": "No cycle: false\nWith cycle: true",
      "codeNotes": [
        {
          "line": 10,
          "note": "Fast moves two steps; slow moves one step. If they meet, a cycle exists."
        },
        {
          "line": 12,
          "note": "Pointer equality check detects the meeting point inside the cycle."
        }
      ],
      "tryIt": "Create a list of 5 nodes with the last node pointing to node 3, and verify hasCycle returns true.",
      "check": {
        "question": "Why does the fast pointer eventually catch the slow pointer in a cyclic linked list?",
        "options": [
          "Because the fast pointer closes the gap by one node per iteration; after at most N iterations, the gap reduces to zero",
          "Because both pointers move at the same speed inside the cycle",
          "Because the slow pointer reverses direction when it reaches the end"
        ],
        "answer": 0,
        "why": "With a speed difference of 1 node per step, the fast pointer reduces its distance to the slow pointer by exactly 1 each iteration."
      }
    },
    {
      "title": "Three Sum Problem with Sorted Two Pointers",
      "say": [
        "The Three Sum problem asks for all unique triplets in an array that sum to zero.",
        "A brute-force approach checks all possible triplets using three nested loops, costing O(N^3) time.",
        "By sorting the array first in O(N log N) time, we can reduce the inner search to a Two Pointer scan.",
        "We fix one element by iterating index i from 0 to N-3, then use left = i+1 and right = N-1 as two pointers on the remaining subarray.",
        "For each fixed element nums[i], we search for pairs nums[left] + nums[right] that equal -nums[i].",
        "This reduces the overall complexity from O(N^3) to O(N^2), which is a significant improvement for large datasets.",
        "To avoid duplicate triplets, we skip consecutive equal values for the fixed element and for both left and right pointers after finding a valid triplet.",
        "The Two Pointers technique enables this deduplication naturally because the sorted order groups identical values together.",
        "Three Sum is one of the most frequently asked coding interview questions and demonstrates the power of combining sorting with two-pointer convergence."
      ],
      "example": "Balancing a scale with three weights: fix one weight on one side, then use two pointers on a sorted shelf of weights to find two that balance the other side.",
      "code": "function threeSum(nums: number[]): number[][] {\n  nums.sort((a, b) => a - b);\n  const result: number[][] = [];\n\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let left = i + 1;\n    let right = nums.length - 1;\n\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++; right--;\n      } else if (sum < 0) left++;\n      else right--;\n    }\n  }\n  return result;\n}\n\nconst triplets = threeSum([-1, 0, 1, 2, -1, -4]);\nfor (const t of triplets) console.log(JSON.stringify(t));",
      "output": "[-1,-1,2]\n[-1,0,1]",
      "codeNotes": [
        {
          "line": 6,
          "note": "Skips duplicate fixed elements to prevent identical triplets in the result."
        },
        {
          "line": 14,
          "note": "After finding a valid triplet, skip duplicate left and right values for uniqueness."
        }
      ],
      "tryIt": "Test with [0, 0, 0, 0] and verify only one triplet [0, 0, 0] is returned.",
      "check": {
        "question": "How does sorting reduce Three Sum from O(N^3) to O(N^2)?",
        "options": [
          "Sorting enables Two Pointer convergence on the inner pair search, replacing one nested loop with an O(N) scan",
          "Sorting removes duplicate elements from the array",
          "Sorting allows binary search for each pair"
        ],
        "answer": 0,
        "why": "The outer loop is O(N); the inner two-pointer scan is O(N); total is O(N) * O(N) = O(N^2)."
      }
    },
    {
      "title": "Trapping Rain Water with Two Pointers",
      "say": [
        "The Trapping Rain Water problem computes the total water trapped between elevation bars after rainfall.",
        "Water at each position is determined by the minimum of the maximum height to its left and the maximum height to its right, minus the bar height at that position.",
        "A brute-force approach scans left and right for each index to find the max heights, costing O(N^2) time.",
        "The Two Pointers approach solves this in O(N) time and O(1) space by maintaining running maximums from both directions.",
        "We maintain leftMax and rightMax variables, starting with pointers at opposite ends.",
        "If leftMax is less than or equal to rightMax, the water at the left pointer is determined by leftMax, so we process the left pointer and move it right.",
        "Otherwise, the water at the right pointer is determined by rightMax, so we process the right pointer and move it left.",
        "Today you have mastered the Two Pointers technique across five essential patterns: sorted two sum, container with most water, palindrome verification, cycle detection, three sum, and trapping rain water.",
        "These patterns form a core arsenal for solving array, string, and linked list problems in O(N) time with O(1) auxiliary space."
      ],
      "example": "Two surveyors measuring a valley from opposite mountain peaks: each records the highest ridge they have seen so far, determining how much rainwater each valley section can hold.",
      "code": "function trapRainWater(height: number[]): number {\n  let left = 0;\n  let right = height.length - 1;\n  let leftMax = 0;\n  let rightMax = 0;\n  let water = 0;\n\n  while (left < right) {\n    if (height[left] <= height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else water += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}\n\nconsole.log('Water [0,1,0,2,1,0,1,3,2,1,2,1]:', trapRainWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));\nconsole.log('Water [4,2,0,3,2,5]:', trapRainWater([4, 2, 0, 3, 2, 5]));",
      "output": "Water [0,1,0,2,1,0,1,3,2,1,2,1]: 6\nWater [4,2,0,3,2,5]: 9",
      "codeNotes": [
        {
          "line": 9,
          "note": "Process the side with the smaller boundary; the water there is determined by the smaller max."
        },
        {
          "line": 11,
          "note": "Water at current position = leftMax - height[left]; only adds when leftMax exceeds bar height."
        }
      ],
      "tryIt": "Test with [3, 0, 0, 0, 3] and verify it traps 9 units of water.",
      "check": {
        "question": "Why does the Two Pointer rain water solution only need O(1) extra space?",
        "options": [
          "It tracks only two running maximum values (leftMax, rightMax) and two pointer indices instead of storing prefix arrays",
          "Because it modifies the input array in place",
          "Because JavaScript garbage collects intermediate variables"
        ],
        "answer": 0,
        "why": "Instead of precomputing and storing left-max and right-max arrays of size N, two variables suffice with the two-pointer approach."
      }
    }
  ],
  "summary": [
    "Opposite-direction pointers on sorted arrays solve two-sum in O(N) time by eliminating candidates directionally.",
    "Container With Most Water uses greedy pointer movement: always advance the shorter side.",
    "Palindrome verification converges pointers from both ends in O(N) time and O(1) space.",
    "Floyd's fast/slow pointers detect linked list cycles in O(N) time without extra memory.",
    "Trapping Rain Water with two pointers achieves O(N) time and O(1) space using running maximums."
  ],
  "projectStep": {
    "title": "Two Pointer Problem Suite",
    "steps": [
      "Implement twoSumSorted with opposite-direction convergence.",
      "Implement isPalindrome with case-insensitive two-pointer verification.",
      "Implement trapRainWater with O(1) space two-pointer running maximums."
    ]
  }
},
{
  "day": 9,
  "title": "Sliding Window Technique (Fixed vs Dynamic Windows)",
  "goal": "Master sub-array optimization with fixed-size windows for maximum sum and dynamic windows for longest substrings in O(N) linear time.",
  "minutes": 25,
  "recap": "Yesterday you mastered the Two Pointers technique. Today we learn the Sliding Window pattern, another O(N) technique that optimizes sub-array and substring problems by maintaining a moving window of elements.",
  "parts": [
    {
      "title": "Fixed-Size Sliding Window (Maximum Sum Subarray)",
      "say": [
        "A fixed-size sliding window maintains a window of exactly k consecutive elements, sliding it one position at a time across the array.",
        "For the maximum sum subarray of size k, a brute-force approach recomputes the sum for every starting index, costing O(N * k) time.",
        "The sliding window technique computes the initial window sum once, then slides by subtracting the element leaving the window and adding the element entering.",
        "This reduces each slide operation to O(1), yielding an overall O(N) time complexity regardless of window size k.",
        "The window slides from left to right, maintaining a running sum that is adjusted incrementally at each step.",
        "At each position, we compare the current window sum against the best sum seen so far, updating the maximum if needed.",
        "Fixed-size windows are used in moving average calculations, financial trend analysis, and sensor data smoothing.",
        "The key insight is that consecutive windows overlap by k-1 elements, so recomputing from scratch wastes k-1 redundant additions.",
        "By exploiting this overlap, the sliding window technique eliminates all redundant computation."
      ],
      "example": "A cashier counting money in a till tray with 4 slots: instead of recounting all 4 slots when the tray shifts by one coin, subtract the coin that falls off the left and add the new coin on the right.",
      "code": "function maxSumSubarray(nums: number[], k: number): number {\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += nums[i];\n  let maxSum = windowSum;\n\n  for (let i = k; i < nums.length; i++) {\n    windowSum += nums[i] - nums[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}\n\nconsole.log('Max sum k=3 [2,1,5,1,3,2]:', maxSumSubarray([2, 1, 5, 1, 3, 2], 3));\nconsole.log('Max sum k=2 [4,2,1,7,8,1]:', maxSumSubarray([4, 2, 1, 7, 8, 1], 2));",
      "output": "Max sum k=3 [2,1,5,1,3,2]: 9\nMax sum k=2 [4,2,1,7,8,1]: 15",
      "codeNotes": [
        {
          "line": 3,
          "note": "Computes the initial window sum for the first k elements."
        },
        {
          "line": 7,
          "note": "Slides the window: adds the entering element and subtracts the leaving element in O(1)."
        }
      ],
      "tryIt": "Test with [1, 1, 1, 1, 1] and k=3 to verify all windows have the same sum of 3.",
      "check": {
        "question": "Why does the fixed sliding window achieve O(N) instead of O(N * k)?",
        "options": [
          "Each slide adds one element and removes one element in O(1), avoiding the O(k) cost of recomputing the full window sum",
          "Because the window size k is always 1",
          "Because JavaScript optimizes array slicing automatically"
        ],
        "answer": 0,
        "why": "Incremental update (add new, remove old) costs O(1) per slide, compared to O(k) for recomputing the sum from scratch."
      }
    },
    {
      "title": "Dynamic Sliding Window (Longest Substring Without Repeats)",
      "say": [
        "A dynamic sliding window adjusts its size based on a constraint, expanding to the right and contracting from the left as needed.",
        "The classic problem is finding the length of the longest substring without repeating characters.",
        "We maintain a Set tracking characters currently inside the window.",
        "The right pointer expands the window by adding new characters to the set.",
        "When a duplicate character is encountered, the left pointer contracts the window by removing characters from the set until the duplicate is eliminated.",
        "At each position, the window represents the longest valid substring ending at the right pointer.",
        "Because both left and right pointers only move forward, each character is added and removed from the set at most once.",
        "This ensures the total work across all iterations is O(N), even though the inner while loop may run multiple times for some positions.",
        "Dynamic windows are used in network congestion control, streaming data analysis, and DNA sequence pattern matching."
      ],
      "example": "A photographer's panoramic lens: widen the view to include more scenery, but narrow it when a duplicate landmark appears to keep the view unique.",
      "code": "function lengthOfLongestSubstring(s: string): number {\n  const charSet = new Set<string>();\n  let left = 0;\n  let maxLen = 0;\n\n  for (let right = 0; right < s.length; right++) {\n    while (charSet.has(s[right])) {\n      charSet.delete(s[left]);\n      left++;\n    }\n    charSet.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}\n\nconsole.log('abcabcbb:', lengthOfLongestSubstring('abcabcbb'));\nconsole.log('bbbbb:', lengthOfLongestSubstring('bbbbb'));\nconsole.log('pwwkew:', lengthOfLongestSubstring('pwwkew'));",
      "output": "abcabcbb: 3\nbbbbb: 1\npwwkew: 3",
      "codeNotes": [
        {
          "line": 7,
          "note": "Contracts window from left until the duplicate character is removed from the set."
        },
        {
          "line": 12,
          "note": "Window size is right - left + 1; tracks the maximum valid window seen."
        }
      ],
      "tryIt": "Test with 'abcdef' and verify the answer is 6 (no repeats, entire string is valid).",
      "check": {
        "question": "Why is the dynamic sliding window O(N) despite having a while loop inside a for loop?",
        "options": [
          "Each character is added to the set exactly once and removed at most once across the entire algorithm, totaling at most 2N operations",
          "Because the while loop only runs once per iteration",
          "Because the Set data structure has O(1) amortized operations"
        ],
        "answer": 0,
        "why": "The left pointer monotonically advances; total set insertions plus deletions across all iterations is bounded by 2N."
      }
    },
    {
      "title": "Frequency Map Windows (Minimum Window Substring)",
      "say": [
        "The Minimum Window Substring problem finds the smallest contiguous substring of s that contains all characters of string t.",
        "This combines the dynamic sliding window technique with a frequency map to track required character counts.",
        "We first build a frequency map of all characters in t, counting how many of each character are needed.",
        "Then we expand the right pointer, decrementing the frequency count each time a character from t appears in the window.",
        "When all required characters have been satisfied (their counts reach zero or below), we have a valid window.",
        "We then contract from the left, attempting to shrink the window while maintaining validity, recording the minimum valid window.",
        "The 'formed' counter tracks how many unique characters from t have their full required count satisfied in the current window.",
        "When formed equals the number of unique required characters, the window is valid.",
        "This technique runs in O(S + T) time where S is the length of s and T is the length of t."
      ],
      "example": "Finding the shortest paragraph in a book that mentions all required keywords: expand until all keywords are covered, then shrink to the tightest span.",
      "code": "function minWindow(s: string, t: string): string {\n  const need = new Map<string, number>();\n  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);\n\n  let left = 0;\n  let formed = 0;\n  const required = need.size;\n  const windowCounts = new Map<string, number>();\n  let result = '';\n  let minLen = Infinity;\n\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    windowCounts.set(ch, (windowCounts.get(ch) || 0) + 1);\n    if (need.has(ch) && windowCounts.get(ch) === need.get(ch)) formed++;\n\n    while (formed === required) {\n      const windowLen = right - left + 1;\n      if (windowLen < minLen) {\n        minLen = windowLen;\n        result = s.slice(left, right + 1);\n      }\n      const leftCh = s[left];\n      windowCounts.set(leftCh, windowCounts.get(leftCh)! - 1);\n      if (need.has(leftCh) && windowCounts.get(leftCh)! < need.get(leftCh)!) formed--;\n      left++;\n    }\n  }\n  return result;\n}\n\nconsole.log('ADOBECODEBANC, ABC:', minWindow('ADOBECODEBANC', 'ABC'));\nconsole.log('a, a:', minWindow('a', 'a'));",
      "output": "ADOBECODEBANC, ABC: BANC\na, a: a",
      "codeNotes": [
        {
          "line": 15,
          "note": "Tracks when a required character's count is fully satisfied in the window."
        },
        {
          "line": 17,
          "note": "Once all required characters are formed, contracts from left to minimize the window."
        }
      ],
      "tryIt": "Test with s='aabc' t='abc' and verify the minimum window is 'abc'.",
      "check": {
        "question": "How does the 'formed' counter help identify valid windows efficiently?",
        "options": [
          "It counts unique characters from t that are fully satisfied, avoiding the need to compare full frequency maps on each step",
          "It counts the total number of characters processed",
          "It tracks the position of the right pointer"
        ],
        "answer": 0,
        "why": "Comparing formed === required is O(1); checking all frequency map entries would cost O(|t|) per step."
      }
    },
    {
      "title": "Sliding Window Maximum with Monotonic Deque",
      "say": [
        "The Sliding Window Maximum problem asks for the maximum value in each window of size k as it slides across the array.",
        "A brute-force approach scans each window for the maximum, costing O(N * k) time.",
        "A monotonic deque maintains window indices in decreasing order of their values, achieving O(N) total time.",
        "When processing a new element, we pop all indices from the back of the deque whose values are smaller than the current element.",
        "This maintains the invariant that the front of the deque always contains the index of the maximum element in the current window.",
        "Before reading the result, we check if the front index has fallen outside the window boundaries and pop it from the front if so.",
        "Each element is pushed onto and popped from the deque at most once across the entire algorithm, yielding O(N) total operations.",
        "This pattern combines the deque data structure from Day 6 with the sliding window technique.",
        "Sliding window maximum is used in stock price analysis, temperature monitoring, and real-time signal processing."
      ],
      "example": "A scoreboard showing the highest score among the last 3 players: as new players are added, outdated low scores are cleared from the board.",
      "code": "function maxSlidingWindow(nums: number[], k: number): number[] {\n  const result: number[] = [];\n  const deque: number[] = [];\n\n  for (let i = 0; i < nums.length; i++) {\n    while (deque.length > 0 && deque[0] <= i - k) deque.shift();\n    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();\n    deque.push(i);\n    if (i >= k - 1) result.push(nums[deque[0]]);\n  }\n  return result;\n}\n\nconsole.log('Window max k=3 [1,3,-1,-3,5,3,6,7]:', JSON.stringify(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)));\nconsole.log('Window max k=2 [1,2,3,4]:', JSON.stringify(maxSlidingWindow([1, 2, 3, 4], 2)));",
      "output": "Window max k=3 [1,3,-1,-3,5,3,6,7]: [3,3,5,5,6,7]\nWindow max k=2 [1,2,3,4]: [2,3,4]",
      "codeNotes": [
        {
          "line": 6,
          "note": "Removes indices that have fallen outside the current window boundaries from the front."
        },
        {
          "line": 7,
          "note": "Pops smaller values from back to maintain decreasing order; front always holds the window max."
        }
      ],
      "tryIt": "Test with [5, 4, 3, 2, 1] and k=2 to verify the result is [5, 4, 3, 2].",
      "check": {
        "question": "Why does the monotonic deque approach achieve O(N) time for sliding window maximum?",
        "options": [
          "Each index is pushed and popped from the deque at most once across all iterations, totaling at most 2N deque operations",
          "Because the deque sorts elements in O(log N) time",
          "Because the window size k is always constant"
        ],
        "answer": 0,
        "why": "Amortized O(1) per element: each of N indices enters and exits the deque exactly once."
      }
    },
    {
      "title": "Subarray Product Less Than K",
      "say": [
        "The Subarray Product Less Than K problem counts contiguous subarrays where the product of elements is strictly less than a given threshold k.",
        "This is a classic dynamic window problem where the window constraint is based on a running product rather than a running sum.",
        "We maintain a running product by multiplying the entering element and dividing by the leaving element as the window contracts.",
        "The right pointer expands the window by multiplying the current element into the running product.",
        "When the product becomes greater than or equal to k, the left pointer contracts by dividing the leaving element out of the product.",
        "For each valid right position, the number of new valid subarrays ending at right is (right - left + 1).",
        "This counting formula works because every subarray starting from left, left+1, ..., right and ending at right has a product less than k.",
        "Division in the running product can introduce floating-point issues for very large numbers, but for integers within typical constraints, it remains exact.",
        "This problem demonstrates that the sliding window technique extends beyond sums to products, maximums, and any monotonic aggregate."
      ],
      "example": "A recipe that limits total calorie count: add ingredients from right, and if calories exceed the limit, remove ingredients from left until under budget.",
      "code": "function numSubarrayProductLessThanK(nums: number[], k: number): number {\n  if (k <= 1) return 0;\n  let product = 1;\n  let left = 0;\n  let count = 0;\n\n  for (let right = 0; right < nums.length; right++) {\n    product *= nums[right];\n    while (product >= k) {\n      product /= nums[left];\n      left++;\n    }\n    count += right - left + 1;\n  }\n  return count;\n}\n\nconsole.log('Product < 100 [10,5,2,6]:', numSubarrayProductLessThanK([10, 5, 2, 6], 100));\nconsole.log('Product < 0 [1,2,3]:', numSubarrayProductLessThanK([1, 2, 3], 0));",
      "output": "Product < 100 [10,5,2,6]: 8\nProduct < 0 [1,2,3]: 0",
      "codeNotes": [
        {
          "line": 9,
          "note": "Contracts window by dividing out the leftmost element when product exceeds threshold."
        },
        {
          "line": 13,
          "note": "Each valid right position contributes (right - left + 1) new subarrays to the count."
        }
      ],
      "tryIt": "Test with [1, 1, 1] and k=2 to verify all 6 subarrays have product < 2.",
      "check": {
        "question": "Why does each position right contribute exactly (right - left + 1) valid subarrays?",
        "options": [
          "Because subarrays [left..right], [left+1..right], ..., [right..right] all end at right and have valid products",
          "Because the array has exactly right - left + 1 elements",
          "Because each element is counted once in the product"
        ],
        "answer": 0,
        "why": "Every starting index from left to right paired with ending index right forms a unique valid subarray."
      }
    },
    {
      "title": "Sliding Window Pattern Recognition & Template",
      "say": [
        "The sliding window technique follows a recognizable template that applies to dozens of algorithmic problems.",
        "Step one: initialize window boundaries (left = 0) and any aggregate tracking variables (sum, product, frequency map).",
        "Step two: expand the window by moving the right pointer and updating the aggregate.",
        "Step three: contract the window by moving the left pointer when the window violates a constraint, updating the aggregate accordingly.",
        "Step four: record the optimal result (maximum, minimum, count) at each valid window position.",
        "Fixed windows always have exactly k elements; dynamic windows expand and contract based on a constraint.",
        "The technique works because both pointers move monotonically forward, ensuring each element is processed at most twice.",
        "Today you have mastered fixed windows for maximum sum, dynamic windows for longest substrings, frequency maps for minimum window substring, monotonic deques for window maximum, and product windows for subarray counting.",
        "These patterns cover the vast majority of substring, subarray, and contiguous sequence optimization problems encountered in technical interviews and production algorithms."
      ],
      "example": "A factory quality control conveyor belt: inspectors check each segment of the belt, widening or narrowing their inspection zone to meet quality thresholds.",
      "code": "function maxVowels(s: string, k: number): number {\n  const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n  let count = 0;\n  for (let i = 0; i < k; i++) {\n    if (vowels.has(s[i])) count++;\n  }\n  let maxCount = count;\n\n  for (let i = k; i < s.length; i++) {\n    if (vowels.has(s[i])) count++;\n    if (vowels.has(s[i - k])) count--;\n    maxCount = Math.max(maxCount, count);\n  }\n  return maxCount;\n}\n\nconsole.log('Max vowels \"abciiidef\" k=3:', maxVowels('abciiidef', 3));\nconsole.log('Max vowels \"aeiou\" k=2:', maxVowels('aeiou', 2));\nconsole.log('Max vowels \"xyz\" k=2:', maxVowels('xyz', 2));",
      "output": "Max vowels \"abciiidef\" k=3: 3\nMax vowels \"aeiou\" k=2: 2\nMax vowels \"xyz\" k=2: 0",
      "codeNotes": [
        {
          "line": 4,
          "note": "Initializes the first window of size k, counting vowels in the initial segment."
        },
        {
          "line": 10,
          "note": "Fixed window slide: adds entering character's vowel status and removes leaving character's vowel status."
        }
      ],
      "tryIt": "Test with 'leetcode' and k=3 to verify the maximum vowel count in any window of 3.",
      "check": {
        "question": "What is the common invariant across all sliding window problems?",
        "options": [
          "Both left and right pointers move monotonically forward, ensuring each element is processed at most twice for O(N) total time",
          "The window always contains exactly k elements",
          "The left pointer always moves faster than the right pointer"
        ],
        "answer": 0,
        "why": "Monotonic pointer advancement bounds total work to 2N, regardless of whether the window is fixed or dynamic."
      }
    }
  ],
  "summary": [
    "Fixed sliding windows maintain exactly k elements, sliding by adding the new element and removing the old in O(1) time.",
    "Dynamic windows expand right and contract left based on constraints, achieving O(N) via monotonic pointer movement.",
    "Frequency maps inside windows enable character-count-based constraints like minimum window substring.",
    "Monotonic deques provide O(N) sliding window maximum by maintaining decreasing-order indices.",
    "The sliding window template applies to sums, products, counts, and character frequency optimization problems."
  ],
  "projectStep": {
    "title": "Sliding Window Problem Suite",
    "steps": [
      "Implement maxSumSubarray with fixed-size sliding window.",
      "Implement lengthOfLongestSubstring with dynamic window and Set.",
      "Implement maxSlidingWindow with monotonic deque for O(N) window maximum."
    ]
  }
},
{
  "day": 10,
  "title": "Binary Search Algorithm & Monotonic Search Space Reduction",
  "goal": "Implement logarithmic O(log N) search, master left/right insertion bisecting, and solve searching in rotated sorted arrays.",
  "minutes": 25,
  "recap": "Yesterday you mastered the Sliding Window technique. Today we study Binary Search, the quintessential divide-and-conquer algorithm that reduces search space by half at every step.",
  "parts": [
    {
      "title": "Classic Binary Search Loop Invariants",
      "say": [
        "Binary Search operates on a sorted array by repeatedly dividing the search space in half.",
        "We maintain two pointers, left and right, that define the current search interval.",
        "The midpoint is calculated as mid = left + Math.floor((right - left) / 2) to avoid integer overflow in languages with fixed-size integers.",
        "If the element at mid equals the target, we have found the answer and return the index immediately.",
        "If the target is less than the element at mid, the answer must lie in the left half, so we set right = mid - 1.",
        "If the target is greater than the element at mid, the answer must lie in the right half, so we set left = mid + 1.",
        "The loop continues while left <= right; when left exceeds right, the target is not in the array.",
        "Each iteration eliminates approximately half the remaining candidates, yielding O(log N) time complexity.",
        "Binary Search is the algorithmic foundation of database index lookups, dictionary word searches, and git bisect debugging."
      ],
      "example": "Looking up a word in a physical dictionary: open to the middle, determine if the word comes before or after, then repeat in the correct half.",
      "code": "function binarySearch(nums: number[], target: number): number {\n  let left = 0;\n  let right = nums.length - 1;\n\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\nconst sorted = [1, 3, 5, 7, 9, 11, 13, 15];\nconsole.log('Find 7:', binarySearch(sorted, 7));\nconsole.log('Find 1:', binarySearch(sorted, 1));\nconsole.log('Find 15:', binarySearch(sorted, 15));\nconsole.log('Find 6:', binarySearch(sorted, 6));",
      "output": "Find 7: 3\nFind 1: 0\nFind 15: 7\nFind 6: -1",
      "codeNotes": [
        {
          "line": 6,
          "note": "Safe midpoint: left + floor((right - left) / 2) prevents overflow that (left + right) / 2 might cause."
        },
        {
          "line": 8,
          "note": "Eliminates the left half when target is larger; eliminates the right half when target is smaller."
        }
      ],
      "tryIt": "Search for element 13 in the array and verify the returned index is 6.",
      "check": {
        "question": "Why is mid calculated as left + Math.floor((right - left) / 2) instead of (left + right) / 2?",
        "options": [
          "To prevent integer overflow when left + right exceeds the maximum safe integer value",
          "Because JavaScript cannot perform basic addition",
          "Because Math.floor is faster than division"
        ],
        "answer": 0,
        "why": "In languages with 32-bit integers, left + right can overflow; subtracting first keeps the intermediate value safe."
      }
    },
    {
      "title": "Left Bisect & Right Bisect (Insertion Point)",
      "say": [
        "Beyond finding exact matches, Binary Search can locate insertion points in sorted arrays.",
        "Left bisect (bisect_left) finds the leftmost position where the target could be inserted while maintaining sorted order.",
        "If the target already exists, left bisect returns the index of the first occurrence.",
        "Right bisect (bisect_right) finds the rightmost position for insertion, returning one past the last occurrence if the target exists.",
        "The difference between right bisect and left bisect gives the count of elements equal to the target.",
        "Left bisect uses the condition: if nums[mid] >= target, set right = mid; else set left = mid + 1.",
        "Right bisect uses the condition: if nums[mid] > target, set right = mid; else set left = mid + 1.",
        "The loop runs while left < right (not left <= right), converging to a single insertion point.",
        "These bisection variants are essential for range queries, rank calculations, and merge operations in production databases."
      ],
      "example": "Finding where to insert a new student's test score into a sorted grade list: left bisect places them before ties, right bisect places them after ties.",
      "code": "function bisectLeft(nums: number[], target: number): number {\n  let left = 0;\n  let right = nums.length;\n  while (left < right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] >= target) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}\n\nfunction bisectRight(nums: number[], target: number): number {\n  let left = 0;\n  let right = nums.length;\n  while (left < right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] > target) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}\n\nconst arr = [1, 3, 3, 3, 5, 7];\nconsole.log('bisectLeft(3):', bisectLeft(arr, 3));\nconsole.log('bisectRight(3):', bisectRight(arr, 3));\nconsole.log('Count of 3s:', bisectRight(arr, 3) - bisectLeft(arr, 3));\nconsole.log('bisectLeft(4):', bisectLeft(arr, 4));",
      "output": "bisectLeft(3): 1\nbisectRight(3): 4\nCount of 3s: 3\nbisectLeft(4): 4",
      "codeNotes": [
        {
          "line": 6,
          "note": "Left bisect: when nums[mid] >= target, narrow to left half (right = mid) to find first occurrence."
        },
        {
          "line": 17,
          "note": "Right bisect: when nums[mid] > target, narrow to left half; includes equal elements in left half."
        }
      ],
      "tryIt": "Use bisectLeft and bisectRight on [1, 2, 2, 2, 3] to count the number of 2s.",
      "check": {
        "question": "How does bisectRight(arr, x) - bisectLeft(arr, x) give the count of x in a sorted array?",
        "options": [
          "bisectLeft returns the index of the first x and bisectRight returns one past the last x; the difference is the count",
          "Because bisectRight counts all elements and bisectLeft counts none",
          "Because the two functions use different sorting algorithms"
        ],
        "answer": 0,
        "why": "Left bisect points to the first occurrence; right bisect points one past the last; their difference spans exactly all occurrences."
      }
    },
    {
      "title": "Search in Rotated Sorted Array",
      "say": [
        "A rotated sorted array is a sorted array that has been circularly shifted by some pivot point.",
        "For example, [4, 5, 6, 7, 0, 1, 2] is the sorted array [0, 1, 2, 4, 5, 6, 7] rotated at index 3.",
        "Standard binary search fails because the array is not fully sorted, but one half is always sorted after any rotation.",
        "The key insight is that when we compute the midpoint, at least one of the two halves (left-to-mid or mid-to-right) is guaranteed to be sorted.",
        "We determine which half is sorted by comparing nums[left] with nums[mid].",
        "If nums[left] <= nums[mid], the left half is sorted; we check if the target falls within [nums[left], nums[mid]].",
        "If the target is in the sorted half, we search that half; otherwise, we search the other half.",
        "This decision rule maintains O(log N) time complexity because we still eliminate half the search space at each step.",
        "Rotated array search appears in real-world scenarios like circular log buffers, time-series databases with wrap-around, and version-rotated deployment systems."
      ],
      "example": "Searching for a book in a circular bookshelf where someone rotated all the books: check which half of the shelf is still in alphabetical order, then decide which half to search.",
      "code": "function searchRotated(nums: number[], target: number): number {\n  let left = 0;\n  let right = nums.length - 1;\n\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] === target) return mid;\n\n    if (nums[left] <= nums[mid]) {\n      if (target >= nums[left] && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (target > nums[mid] && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}\n\nconsole.log('Find 0 in [4,5,6,7,0,1,2]:', searchRotated([4, 5, 6, 7, 0, 1, 2], 0));\nconsole.log('Find 3 in [4,5,6,7,0,1,2]:', searchRotated([4, 5, 6, 7, 0, 1, 2], 3));\nconsole.log('Find 1 in [1]:', searchRotated([1], 1));",
      "output": "Find 0 in [4,5,6,7,0,1,2]: 4\nFind 3 in [4,5,6,7,0,1,2]: -1\nFind 1 in [1]: 0",
      "codeNotes": [
        {
          "line": 9,
          "note": "Determines which half is sorted by comparing nums[left] with nums[mid]."
        },
        {
          "line": 10,
          "note": "Checks if target lies within the sorted half's range to decide search direction."
        }
      ],
      "tryIt": "Search for 5 in [6, 7, 0, 1, 2, 3, 4, 5] and verify the returned index is 7.",
      "check": {
        "question": "Why is at least one half always sorted in a rotated sorted array?",
        "options": [
          "The rotation pivot can only exist in one half; the other half remains in its original sorted order",
          "Because arrays in JavaScript are always partially sorted",
          "Because the rotation sorts one half automatically"
        ],
        "answer": 0,
        "why": "A single rotation point splits the array into two sorted segments; the midpoint falls in one segment, leaving the other fully sorted."
      }
    },
    {
      "title": "Binary Search on Answer Space (Square Root)",
      "say": [
        "Binary Search is not limited to searching in arrays; it can search over an abstract answer space when the answer has a monotonic property.",
        "For computing the integer square root of N, we binary search over the range [0, N] for the largest integer x such that x * x <= N.",
        "The predicate x * x <= N is monotonic: it is true for all x up to a threshold, then false for all larger x.",
        "This monotonic property is the essential requirement for binary search to work on any search space.",
        "We set left = 0 and right = N, then check if mid * mid <= N.",
        "If mid * mid <= N, the answer could be mid or larger, so we set left = mid + 1 and record mid as a candidate.",
        "If mid * mid > N, the answer must be smaller, so we set right = mid - 1.",
        "This approach computes the integer square root in O(log N) time without any floating-point arithmetic.",
        "Binary search on answer space is used for optimization problems: finding the minimum capacity for shipping packages, the maximum speed for eating bananas, and the minimum days for making bouquets."
      ],
      "example": "Guessing a number between 1 and 1000 where someone tells you 'higher' or 'lower': you can always find it in at most 10 guesses by halving the range each time.",
      "code": "function intSqrt(n: number): number {\n  if (n < 2) return n;\n  let left = 1;\n  let right = Math.floor(n / 2);\n  let result = 1;\n\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (mid <= n / mid) {\n      result = mid;\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return result;\n}\n\nconsole.log('sqrt(16):', intSqrt(16));\nconsole.log('sqrt(8):', intSqrt(8));\nconsole.log('sqrt(100):', intSqrt(100));\nconsole.log('sqrt(1):', intSqrt(1));",
      "output": "sqrt(16): 4\nsqrt(8): 2\nsqrt(100): 10\nsqrt(1): 1",
      "codeNotes": [
        {
          "line": 9,
          "note": "Uses mid <= n/mid instead of mid*mid <= n to avoid potential overflow for very large numbers."
        },
        {
          "line": 10,
          "note": "Records mid as candidate answer; continues searching for a potentially larger valid root."
        }
      ],
      "tryIt": "Compute intSqrt(25) and verify the result is 5.",
      "check": {
        "question": "What property must the search predicate have for binary search on answer space to work?",
        "options": [
          "The predicate must be monotonic: true for all values up to a threshold, then false for all values beyond it (or vice versa)",
          "The predicate must return a random boolean",
          "The predicate must always return true"
        ],
        "answer": 0,
        "why": "Monotonicity creates a clear boundary between true and false regions, allowing binary search to converge to the boundary."
      }
    },
    {
      "title": "Find Minimum in Rotated Sorted Array",
      "say": [
        "Finding the minimum element in a rotated sorted array is another classic binary search variant.",
        "The minimum element is the rotation pivot point where the sorted order breaks.",
        "We compare nums[mid] with nums[right] to determine which half contains the pivot.",
        "If nums[mid] > nums[right], the pivot (minimum) must be in the right half, so we set left = mid + 1.",
        "If nums[mid] <= nums[right], the current mid could be the minimum, so we set right = mid to keep it as a candidate.",
        "The loop continues while left < right; when they converge, both point to the minimum element.",
        "This works because the comparison with nums[right] always correctly identifies which half is disrupted by the rotation.",
        "Comparing with nums[left] instead would fail for cases where the array is not rotated at all (already sorted).",
        "This algorithm runs in O(log N) time and O(1) space, matching the efficiency of standard binary search."
      ],
      "example": "Finding the coldest hour in a day where temperatures rise until noon then fall: compare the middle reading with the endpoint to determine which half contains the lowest point.",
      "code": "function findMin(nums: number[]): number {\n  let left = 0;\n  let right = nums.length - 1;\n\n  while (left < right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] > nums[right]) left = mid + 1;\n    else right = mid;\n  }\n  return nums[left];\n}\n\nconsole.log('Min of [3,4,5,1,2]:', findMin([3, 4, 5, 1, 2]));\nconsole.log('Min of [4,5,6,7,0,1,2]:', findMin([4, 5, 6, 7, 0, 1, 2]));\nconsole.log('Min of [1,2,3]:', findMin([1, 2, 3]));",
      "output": "Min of [3,4,5,1,2]: 1\nMin of [4,5,6,7,0,1,2]: 0\nMin of [1,2,3]: 1",
      "codeNotes": [
        {
          "line": 7,
          "note": "If mid > right, the rotation pivot is to the right of mid; move left past mid."
        },
        {
          "line": 8,
          "note": "If mid <= right, mid itself could be the minimum; keep it as right boundary candidate."
        }
      ],
      "tryIt": "Test with [2, 1] and verify the minimum is 1.",
      "check": {
        "question": "Why do we compare nums[mid] with nums[right] instead of nums[left]?",
        "options": [
          "Comparing with nums[right] correctly handles the case where the array is already sorted (no rotation), whereas comparing with nums[left] can be ambiguous",
          "Because nums[left] is always the minimum",
          "Because nums[right] is always the maximum"
        ],
        "answer": 0,
        "why": "In a non-rotated sorted array, nums[mid] < nums[right] correctly narrows toward the left (minimum), while comparing with nums[left] would incorrectly expand right."
      }
    },
    {
      "title": "Binary Search Template & Complexity Analysis Summary",
      "say": [
        "Binary search halves the search space at every step, producing a logarithmic number of iterations: at most ceil(log2(N)) comparisons for N elements.",
        "For an array of one billion elements, binary search needs at most 30 comparisons to find any target.",
        "The space complexity is O(1) for iterative binary search and O(log N) for recursive binary search due to call stack frames.",
        "Three common pitfalls are: using (left + right) / 2 causing overflow, incorrect loop termination conditions (left <= right vs left < right), and off-by-one errors in bound updates.",
        "The left <= right template with right = mid - 1 searches for an exact match and returns -1 if not found.",
        "The left < right template with right = mid converges to a boundary, suitable for finding first/last occurrence or insertion points.",
        "Binary search on answer space generalizes the technique beyond arrays to any problem with a monotonic predicate.",
        "Today you have mastered classic binary search, left/right bisection, rotated array search, answer-space search, and minimum finding in rotated arrays.",
        "Binary search is the most important logarithmic algorithm in computer science, enabling efficient data retrieval across databases, file systems, and network routing tables."
      ],
      "example": "A quality control engineer narrowing down which batch of components contains a defect: testing the middle batch and eliminating half the candidates each time.",
      "code": "function countNegatives(grid: number[][]): number {\n  let count = 0;\n  for (const row of grid) {\n    let left = 0;\n    let right = row.length;\n    while (left < right) {\n      const mid = left + Math.floor((right - left) / 2);\n      if (row[mid] < 0) right = mid;\n      else left = mid + 1;\n    }\n    count += row.length - left;\n  }\n  return count;\n}\n\nconst matrix = [\n  [4, 3, 2, -1],\n  [3, 2, 1, -1],\n  [1, 1, -1, -2],\n  [-1, -1, -2, -3]\n];\nconsole.log('Negative count:', countNegatives(matrix));",
      "output": "Negative count: 8",
      "codeNotes": [
        {
          "line": 8,
          "note": "Finds the first negative number in each row using binary search on the sorted row."
        },
        {
          "line": 11,
          "note": "All elements from the first negative to the end are negative; counts them in O(1)."
        }
      ],
      "tryIt": "Test with a matrix where all elements are positive and verify the count is 0.",
      "check": {
        "question": "What is the maximum number of comparisons binary search needs for an array of 1,000,000 elements?",
        "options": [
          "ceil(log2(1,000,000)) = 20 comparisons",
          "1,000,000 comparisons",
          "500,000 comparisons"
        ],
        "answer": 0,
        "why": "Each comparison halves the search space; 2^20 = 1,048,576 > 1,000,000, so 20 comparisons suffice."
      }
    }
  ],
  "summary": [
    "Binary search halves the search space each iteration, achieving O(log N) time on sorted data.",
    "Safe midpoint calculation: mid = left + Math.floor((right - left) / 2) prevents integer overflow.",
    "Left bisect finds the first occurrence; right bisect finds one past the last; their difference counts occurrences.",
    "Rotated sorted arrays guarantee one sorted half; comparing mid with boundaries determines search direction.",
    "Binary search on answer space works whenever the predicate is monotonic over the candidate range."
  ],
  "projectStep": {
    "title": "Binary Search Algorithm Suite",
    "steps": [
      "Implement classic binary search with left <= right loop invariant.",
      "Implement bisectLeft and bisectRight for insertion points and occurrence counting.",
      "Implement searchRotated to find targets in rotated sorted arrays in O(log N) time."
    ]
  }
}
,
{
  "day": 11,
  "title": "Recursion, Call Stack Mechanics & Backtracking Principles",
  "goal": "Understand call stack execution frames, base cases, tree branching, and state backtracking.",
  "minutes": 25,
  "recap": "Welcome to Day eleven! Having mastered linear and logarithmic structures, we now explore the computational power of recursion and the systematic exploration of combinatorial spaces via backtracking.",
  "parts": [
    {
      "title": "Base Case vs Recursive Step Invariants",
      "say": [
        "Recursion is a computational paradigm where a function solves a complex problem by calling itself on smaller instances of the same problem.",
        "Every recursive function requires two essential components: a base case that stops execution, and a recursive step that shrinks input size.",
        "The base case represents the simplest, trivial instance of the problem that can be resolved immediately without further recursive calls.",
        "Without an unambiguous, reachable base case, recursion executes indefinitely until the host runtime exhausts all stack memory and crashes.",
        "The recursive step must strictly make progress toward the base case, reducing problem size along a well-defined mathematical ordering.",
        "In a factorial calculation, multiplying N by factorial of N minus one reduces the integer argument monotonically toward the base case of zero.",
        "At each recursive invocation, the runtime pauses the current caller frame, pushes a new activation frame onto the call stack, and transfers control.",
        "Once the deepest frame reaches the base case, return values propagate backward through the stack, unrolling computation to the initial caller.",
        "Understanding this two-phase call-and-unroll lifecycle provides the foundational mental model for analyzing trees, graphs, and divide-and-conquer algorithms."
      ],
      "example": "Russian nesting dolls: to find the miniature figure hidden inside, you open each outer doll one by one until you reach the solid innermost wooden figurine.",
      "code": "function factorial(n: number): number {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconsole.log('Factorial of 5:', factorial(5));\nconsole.log('Factorial of 3:', factorial(3));\nconsole.log('Factorial of 0:', factorial(0));",
      "output": "Factorial of 5: 120\nFactorial of 3: 6\nFactorial of 0: 1",
      "codeNotes": [
        {
          "line": 2,
          "note": "Base case terminates recursion immediately when n reaches 1 or 0, returning 1."
        },
        {
          "line": 3,
          "note": "Recursive step reduces problem size by passing n - 1, guaranteeing progress toward the base case."
        }
      ],
      "tryIt": "Call factorial(6) and verify the returned value is 720.",
      "check": {
        "question": "What catastrophic error occurs if a recursive function lacks a reachable base case?",
        "options": [
          "Call stack overflow (RangeError: Maximum call stack size exceeded) causing process termination",
          "A compilation syntax error before runtime",
          "Automatic conversion into an infinite while loop that continues silently"
        ],
        "answer": 0,
        "why": "Each recursive invocation allocates a new frame on the call stack; unbounded calls exhaust memory limits, triggering stack overflow."
      }
    },
    {
      "title": "Call Stack Memory Growth & Stack Overflow Defense",
      "say": [
        "Every time a function is invoked, the JavaScript runtime allocates a memory chunk called an activation record or stack frame.",
        "A stack frame stores local variables, parameter values, intermediate expression results, and the return instruction address.",
        "When recursion reaches depth D, exactly D stack frames coexist simultaneously in the thread's allocated call stack memory space.",
        "Consequently, even if a recursive algorithm requires zero heap allocations, its auxiliary space complexity is strictly bounded by O(D).",
        "Most JavaScript runtimes (including Google V8 and Node.js) allocate approximately ten thousand call stack frames before throwing a RangeError.",
        "For deep linear recursion on large datasets, engineers must convert deep recursive calls into iterative loops using explicit array stacks.",
        "Alternatively, tail-call optimization can reuse the existing stack frame, though widespread production runtime support remains limited.",
        "Tracking maximum recursion depth is essential when designing recursive graph traversals, AST parsers, and nested document serializers.",
        "Defensive programming practices enforce explicit recursion depth limits, rejecting malformed deeply nested inputs before stack corruption occurs."
      ],
      "example": "A stack of physical cafeteria trays: every meal order adds a new heavy tray on top; if the stack rises to the ceiling, the entire tower collapses.",
      "code": "function traceCallStack(depth: number, maxDepth: number): string[] {\n  const frames: string[] = [`Entering frame ${depth}`];\n  if (depth < maxDepth) {\n    frames.push(...traceCallStack(depth + 1, maxDepth));\n  } else {\n    frames.push('Base condition reached at peak stack depth');\n  }\n  frames.push(`Exiting frame ${depth}`);\n  return frames;\n}\n\nconst trace = traceCallStack(1, 3);\nfor (const entry of trace) console.log(entry);",
      "output": "Entering frame 1\nEntering frame 2\nEntering frame 3\nBase condition reached at peak stack depth\nExiting frame 3\nExiting frame 2\nExiting frame 1",
      "codeNotes": [
        {
          "line": 2,
          "note": "Records frame allocation when descending into the recursive call chain."
        },
        {
          "line": 7,
          "note": "Records frame deallocation in LIFO order as recursive calls return back up the call chain."
        }
      ],
      "tryIt": "Change maxDepth to 2 and trace the order of frame entries and exits.",
      "check": {
        "question": "Why does recursive call stack depth matter for space complexity analysis?",
        "options": [
          "Each active recursive call occupies a stack frame in memory, making auxiliary space proportional to maximum recursion depth O(D)",
          "Stack frames are allocated on external disk drives",
          "Recursive calls automatically free memory before invoking child functions"
        ],
        "answer": 0,
        "why": "Stack frames cannot be garbage-collected while their child calls are still executing, consuming O(D) concurrent stack memory."
      }
    },
    {
      "title": "Branching Recursion & Exponential State Trees",
      "say": [
        "While linear recursion invokes itself once per frame, branching recursion invokes itself multiple times, spawning an exponential state tree.",
        "The textbook example is naive recursive Fibonacci: fib(n) invokes both fib(n-1) and fib(n-2) at each decision node.",
        "At depth zero there is one call; at depth one, two calls; at depth two, four calls; and at depth K, approximately two to the power K calls.",
        "This produces an explosive O(2^N) time complexity that becomes practically uncomputable for inputs larger than forty.",
        "Visualizing this execution tree reveals why naive branching recursion struggles: the exact same subproblems are recalculated repeatedly.",
        "Computing fib(5) recalculates fib(3) two separate times and fib(2) three separate times from scratch across independent branches.",
        "Recognizing overlapping subproblems in branching recursive trees is the critical gateway skill leading to dynamic programming memoization.",
        "However, branching recursion remains the correct conceptual strategy when each branch explores a genuinely distinct combinatorial choice.",
        "Analyzing branching factors and maximum tree depth enables precise asymptotic upper bound classification for complex recursive systems."
      ],
      "example": "A family tree extending backward in time: every individual has two biological parents, four grandparents, and eight great-grandparents, doubling each generation.",
      "code": "let callCounter = 0;\n\nfunction branchingFib(n: number): number {\n  callCounter++;\n  if (n <= 1) return n;\n  return branchingFib(n - 1) + branchingFib(n - 2);\n}\n\ncallCounter = 0;\nconst fib5 = branchingFib(5);\nconsole.log('fib(5):', fib5, 'calls:', callCounter);\n\ncallCounter = 0;\nconst fib6 = branchingFib(6);\nconsole.log('fib(6):', fib6, 'calls:', callCounter);",
      "output": "fib(5): 5 calls: 15\nfib(6): 8 calls: 25",
      "codeNotes": [
        {
          "line": 4,
          "note": "Increments call counter on every function entry to measure total state tree nodes."
        },
        {
          "line": 6,
          "note": "Branching step spawns two recursive children, creating a binary execution tree."
        }
      ],
      "tryIt": "Run branchingFib(7) and observe that total calls surge to 41 operations.",
      "check": {
        "question": "Why does naive branching Fibonacci exhibit exponential O(2^N) time complexity?",
        "options": [
          "Each non-base node spawns two recursive children, forming an execution tree whose total node count doubles with each additional depth level",
          "Because addition is an exponential arithmetic operation in JavaScript",
          "Because the function uses two separate call stacks simultaneously"
        ],
        "answer": 0,
        "why": "A branching factor of 2 across depth N creates a binary call tree containing up to 2^(N+1) - 1 total invocations."
      }
    },
    {
      "title": "Backtracking Search Mechanics (Subsets & Combinations)",
      "say": [
        "Backtracking is an algorithmic paradigm that systematically searches for solutions by constructing candidate states incrementally.",
        "The core mechanism follows a disciplined four-step cadence: choose an option, explore recursively, unchoose (revert state), and try the next option.",
        "This 'unchoose' step is what distinguishes backtracking from ordinary brute-force recursion: state changes are cleanly undone before exploring neighbor branches.",
        "By mutating a shared array during descent and popping the element upon return, backtracking avoids copying arrays at every step.",
        "This saves massive memory, achieving O(N) auxiliary space instead of allocating exponential numbers of intermediate array copies.",
        "For generating all 2^N subsets of an array, at each index we make a binary choice: either include the current element, or exclude it.",
        "The recursive function descends to the leaf level (index === length), records the current subset snapshot, and returns to explore the alternate choice.",
        "Backtracking effectively traverses the implicit state-space tree of the problem via depth-first search, visiting every valid configuration.",
        "This foundational pattern applies to pathfinding, puzzle solvers, combinatorial optimization, and automated theorem provers."
      ],
      "example": "Exploring a dark hedge maze with a spool of thread: you unroll thread as you walk forward, and when you hit a dead end, you rewind the thread back to the junction.",
      "code": "function generateSubsets(nums: number[]): number[][] {\n  const result: number[][] = [];\n  const current: number[] = [];\n\n  function backtrack(index: number): void {\n    if (index === nums.length) {\n      result.push([...current]); // Snapshot\n      return;\n    }\n    // Choice 1: Include nums[index]\n    current.push(nums[index]);\n    backtrack(index + 1);\n    current.pop(); // Backtrack (revert state)\n\n    // Choice 2: Exclude nums[index]\n    backtrack(index + 1);\n  }\n\n  backtrack(0);\n  return result;\n}\n\nconst subsets = generateSubsets([1, 2]);\nfor (const s of subsets) console.log(JSON.stringify(s));",
      "output": "[1,2]\n[1]\n[2]\n[]",
      "codeNotes": [
        {
          "line": 8,
          "note": "Pushes snapshot copy of current candidate path when reaching base case."
        },
        {
          "line": 14,
          "note": "The crucial backtrack step: pops the choice from the path before exploring alternative branches."
        }
      ],
      "tryIt": "Pass [1, 2, 3] and verify that all 8 subsets (2^3) are generated in correct order.",
      "check": {
        "question": "Why must backtracking algorithms revert their state modifications (e.g., current.pop()) after recursive return?",
        "options": [
          "To restore the shared state so subsequent branches can explore alternatives from the exact same decision context",
          "To trigger JavaScript garbage collection",
          "Because arrays cannot hold more than three elements in recursive functions"
        ],
        "answer": 0,
        "why": "A single shared path array is mutated across branches; popping undoes the choice so the caller can explore other candidates."
      }
    },
    {
      "title": "Pruning Search Branches (Bounding & Early Termination)",
      "say": [
        "In many combinatorial problems, exploring the entire state-space tree is far too slow because the tree contains billions of dead ends.",
        "Branch pruning is the practice of evaluating feasibility constraints early, immediately abandoning branches that cannot possibly lead to a valid answer.",
        "In the Combination Sum problem, where candidate numbers must sum to a target, any branch whose running sum exceeds the target is immediately pruned.",
        "By sorting the input candidates in ascending order, if adding a candidate exceeds the target, all subsequent candidates will also exceed the target.",
        "This allows an entire sub-tree of recursive branches to be terminated with a single break statement, eliminating millions of wasted operations.",
        "Pruning transforms worst-case exponential runtimes into practical, high-speed solvers capable of passing rigorous production time limits.",
        "The effectiveness of pruning depends directly on the strength of bounding functions and the heuristic ordering of candidate choices.",
        "Search algorithms that evaluate the most promising choices first trigger early constraints sooner, pruning larger sections of the state tree.",
        "Branch-and-bound techniques represent the enterprise optimization evolution of simple backtracking, powering logistics routers and scheduling engines."
      ],
      "example": "A security guard checking luggage weight at an airport: as soon as the scale exceeds 50 pounds, the passenger is told to repack immediately without weighing remaining bags.",
      "code": "function combinationSum(candidates: number[], target: number): number[][] {\n  candidates.sort((a, b) => a - b);\n  const results: number[][] = [];\n  const path: number[] = [];\n\n  function backtrack(start: number, remaining: number): void {\n    if (remaining === 0) {\n      results.push([...path]);\n      return;\n    }\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remaining) break; // Prune branch!\n      path.push(candidates[i]);\n      backtrack(i, remaining - candidates[i]);\n      path.pop(); // Backtrack\n    }\n  }\n\n  backtrack(0, target);\n  return results;\n}\n\nconst combos = combinationSum([2, 3, 6, 7], 7);\nfor (const c of combos) console.log(JSON.stringify(c));",
      "output": "[2,2,3]\n[7]",
      "codeNotes": [
        {
          "line": 12,
          "note": "Pruning condition: since array is sorted, if candidates[i] > remaining, all later elements will also fail."
        },
        {
          "line": 14,
          "note": "Recursively passes index i (not i + 1) to allow repeated selection of the same candidate number."
        }
      ],
      "tryIt": "Run with candidates [2, 3, 5] and target 8 to find all valid partitions.",
      "check": {
        "question": "How does sorting candidates in ascending order enable aggressive branch pruning in Combination Sum?",
        "options": [
          "When a candidate exceeds the remaining sum, all subsequent larger candidates will also exceed it, allowing an immediate loop break",
          "Sorting guarantees that the first answer returned is the longest combination",
          "Sorting eliminates duplicate elements automatically"
        ],
        "answer": 0,
        "why": "Monotonic candidate ordering ensures that once candidates[i] > remaining, no future candidate can satisfy the equality."
      }
    },
    {
      "title": "Production Permutation Generator with In-Place Swapping",
      "say": [
        "We now assemble our complete production-grade backtracking engine: generating all N! permutations of an array.",
        "While subsets involve inclusion/exclusion choices, permutations involve ordering: arranging all N distinct items into every possible sequence.",
        "A naive approach maintains a visited boolean array or checks array.includes(), requiring O(N) lookup overhead per step.",
        "The optimal production algorithm uses in-place swapping: swapping the current element with each subsequent candidate position.",
        "At step index, we iterate i from index to length-1, swap nums[index] with nums[i], recurse to index+1, and swap them back.",
        "This in-place swap strategy requires zero auxiliary array allocations and zero visited sets, operating in strict O(N) call stack space.",
        "Total permutations generated is exactly N! (N factorial), meaning an array of size 4 produces 24 permutations, while size 10 produces 3,628,800.",
        "Today you have mastered the foundational mechanics of recursion, call stack memory, exponential branching, backtracking, pruning, and permutations.",
        "These backtracking principles form the core computational engine behind chess engines, SAT solvers, compiler register allocators, and layout algorithms."
      ],
      "example": "Shuffling a deck of cards by hand: swapping cards between positions to create every possible sequence without ever bringing in a second deck.",
      "code": "function permute(nums: number[]): number[][] {\n  const result: number[][] = [];\n\n  function backtrack(first: number): void {\n    if (first === nums.length) {\n      result.push([...nums]);\n      return;\n    }\n    for (let i = first; i < nums.length; i++) {\n      [nums[first], nums[i]] = [nums[i], nums[first]]; // Swap choice\n      backtrack(first + 1);\n      [nums[first], nums[i]] = [nums[i], nums[first]]; // Swap backtrack\n    }\n  }\n\n  backtrack(0);\n  return result;\n}\n\nconst perms = permute([1, 2, 3]);\nconsole.log('Total permutations:', perms.length);\nconsole.log('First permutation:', JSON.stringify(perms[0]));\nconsole.log('Last permutation:', JSON.stringify(perms[perms.length - 1]));",
      "output": "Total permutations: 6\nFirst permutation: [1,2,3]\nLast permutation: [3,1,2]",
      "codeNotes": [
        {
          "line": 9,
          "note": "Swaps candidate element into the current position in-place without auxiliary memory."
        },
        {
          "line": 11,
          "note": "Backtracks by reversing the exact same swap, restoring original order for subsequent branches."
        }
      ],
      "tryIt": "Pass [1, 2] and verify that exactly 2! = 2 permutations are generated.",
      "check": {
        "question": "What is the time complexity of generating all permutations of an array containing N unique elements?",
        "options": [
          "O(N * N!) because there are N! permutations and each takes O(N) time to copy into results",
          "O(N^2) polynomial time",
          "O(2^N) exponential time"
        ],
        "answer": 0,
        "why": "There are N! distinct permutations, and copying the leaf array into the results array takes O(N) operations, totaling O(N * N!)."
      }
    }
  ],
  "summary": [
    "Recursion requires a base case to terminate execution and a recursive step that monotonically shrinks problem size.",
    "Call stack depth D consumes O(D) concurrent auxiliary space; exceeding runtime limits triggers RangeError stack overflow.",
    "Branching recursion spawns exponential state trees, frequently recomputing overlapping subproblems without memoization.",
    "Backtracking systematically explores combinatorial trees via choose, explore, and unchoose (reverting state mutations).",
    "Branch pruning terminates dead-end recursive paths early, eliminating exponential search spaces in production solvers."
  ],
  "projectStep": {
    "title": "Backtracking & Permutation Engine Implementation",
    "steps": [
      "Implement traceCallStack to observe frame allocation and LIFO deallocation order.",
      "Implement generateSubsets using the choose-explore-unchoose backtracking pattern.",
      "Build in-place permute generator achieving O(N * N!) factorial state exploration."
    ]
  }
},
{
  "day": 12,
  "title": "Merge Sort & Divide-and-Conquer Recurrences",
  "goal": "Implement stable O(N log N) Merge Sort, Master Theorem recurrences, and inverted pair counting.",
  "minutes": 25,
  "recap": "Yesterday you mastered recursion and backtracking search. Today we apply divide-and-conquer principles to sorting: breaking arrays in half, sorting halves independently, and merging them in linear time.",
  "parts": [
    {
      "title": "Divide and Conquer Paradigm & Master Theorem",
      "say": [
        "The divide-and-conquer strategy solves problems by breaking them into smaller subproblems of the exact same type.",
        "The paradigm consists of three distinct phases: Divide the problem into subproblems, Conquer subproblems recursively, and Combine solutions.",
        "For sorting an array of size N, Merge Sort divides the array into two equal halves of size N/2 until reaching subarrays of length one.",
        "Subarrays of length one or zero are inherently sorted by definition, serving as the recursion base case.",
        "The Conquer phase sorts both halves, while the Combine phase merges two sorted halves into a single sorted array in O(N) time.",
        "The recurrence relation for Merge Sort is mathematically expressed as T(N) = 2T(N/2) + O(N).",
        "Applying the Master Theorem (Case 2, where a = 2, b = 2, and work is O(N)), this recurrence evaluates strictly to O(N log N).",
        "Crucially, Merge Sort achieves O(N log N) in the worst case, best case, and average case, providing completely predictable performance.",
        "This guaranteed upper bound makes Merge Sort the sorting algorithm of choice for database engines and external disk storage systems."
      ],
      "example": "Sorting a messy 100-page manuscript: split the stack into two 50-page piles, sort each independently, then weave the two sorted piles together page by page.",
      "code": "function masterTheoremMergeCost(n: number): string {\n  const levels = Math.ceil(Math.log2(n));\n  const workPerLevel = n;\n  const totalWork = n * levels;\n  return `N=${n}: ${levels} tree levels * ${workPerLevel} work = ${totalWork} operations [O(N log N)]`;\n}\n\nconsole.log(masterTheoremMergeCost(8));\nconsole.log(masterTheoremMergeCost(16));\nconsole.log(masterTheoremMergeCost(1024));",
      "output": "N=8: 3 tree levels * 8 work = 24 operations [O(N log N)]\nN=16: 4 tree levels * 16 work = 64 operations [O(N log N)]\nN=1024: 10 tree levels * 1024 work = 10240 operations [O(N log N)]",
      "codeNotes": [
        {
          "line": 2,
          "note": "Binary division creates exactly log2(N) levels in the recursion tree."
        },
        {
          "line": 3,
          "note": "Every level performs a total of N work across all its combined merge operations."
        }
      ],
      "tryIt": "Calculate cost for N=64 and verify it requires 6 levels and 384 operations.",
      "check": {
        "question": "What is the recurrence relation that characterizes Merge Sort?",
        "options": [
          "T(N) = 2T(N/2) + O(N), resolving to O(N log N) by the Master Theorem",
          "T(N) = T(N - 1) + O(1), resolving to O(N)",
          "T(N) = 2T(N/2) + O(N^2), resolving to O(N^2)"
        ],
        "answer": 0,
        "why": "Dividing into two halves of size N/2 plus linear O(N) merging work produces T(N) = 2T(N/2) + O(N) = O(N log N)."
      }
    },
    {
      "title": "The Linear O(N) Two-Pointer Merge Operation",
      "say": [
        "The beating heart of Merge Sort is the merge subroutine, which combines two already-sorted arrays into one unified sorted array.",
        "We initialize two pointers, i pointing to the beginning of the left array and j pointing to the beginning of the right array.",
        "At each step, we compare left[i] with right[j] and append the smaller element to the output array, advancing that pointer.",
        "If left[i] and right[j] are equal, we choose the left element first; this specific tie-breaking rule preserves algorithmic stability.",
        "When one pointer exhausts its array, all remaining elements in the other array are guaranteed to be larger than all merged elements.",
        "We simply append all leftover elements from the non-empty array to the output buffer in a single slice operation.",
        "Because each comparison places exactly one element into its final sorted position, the merge routine executes in strict O(left + right) time.",
        "The merge operation requires allocating an auxiliary output array of size (left.length + right.length), consuming O(N) auxiliary space.",
        "Mastering this two-pointer merge pattern is essential for external merge sorting, stream joins, and interval union algorithms."
      ],
      "example": "Two lines of people sorted by height merging into a single line: the usher compares the front person in each line and waves the shorter one forward.",
      "code": "function mergeTwoSorted(left: number[], right: number[]): number[] {\n  const result: number[] = [];\n  let i = 0;\n  let j = 0;\n\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) {\n      result.push(left[i]);\n      i++;\n    } else {\n      result.push(right[j]);\n      j++;\n    }\n  }\n  // Append remaining items\n  while (i < left.length) { result.push(left[i]); i++; }\n  while (j < right.length) { result.push(right[j]); j++; }\n  return result;\n}\n\nconsole.log('Merged:', JSON.stringify(mergeTwoSorted([1, 4, 7], [2, 5, 8])));\nconsole.log('Duplicate tie test:', JSON.stringify(mergeTwoSorted([2, 5], [2, 6])));",
      "output": "Merged: [1,2,4,5,7,8]\nDuplicate tie test: [2,2,5,6]",
      "codeNotes": [
        {
          "line": 7,
          "note": "Using '<=' ensures stability: duplicate items from the left array appear before duplicates from right."
        },
        {
          "line": 16,
          "note": "Drains remaining elements once one pointer reaches the end."
        }
      ],
      "tryIt": "Merge [1, 10] with [2, 3, 4] and verify the output is [1, 2, 3, 4, 10].",
      "check": {
        "question": "Why does the comparison 'left[i] <= right[j]' make Merge Sort a 'stable' sort?",
        "options": [
          "It guarantees that equal elements preserve their original relative order by picking the left element first",
          "It prevents numeric integer overflow",
          "It forces the algorithm to use less memory"
        ],
        "answer": 0,
        "why": "A stable sort preserves the relative order of duplicate elements; favoring left on ties ensures left elements stay ahead."
      }
    },
    {
      "title": "Full Recursive Merge Sort Implementation",
      "say": [
        "We now combine the divide step and the merge step into the full recursive Merge Sort algorithm.",
        "The function takes an array, checks if its length is less than or equal to one (base case), and returns immediately if true.",
        "It then calculates the midpoint index: mid = Math.floor(arr.length / 2).",
        "The array is sliced into two halves: left = arr.slice(0, mid) and right = arr.slice(mid).",
        "We recursively invoke mergeSort on left, recursively invoke mergeSort on right, and pass both sorted halves to mergeTwoSorted.",
        "The depth of the recursive call tree is strictly ceil(log2(N)), with each level processing N elements across all merges.",
        "Unlike Quick Sort, Merge Sort does not depend on pivot choices; it divides the array exactly in half every single time.",
        "This architectural symmetry guarantees that worst-case inputs (such as already-sorted or reverse-sorted data) still sort in O(N log N) time.",
        "Merge Sort represents the gold standard of predictable, deterministic divide-and-conquer algorithm design."
      ],
      "example": "A tournament bracket: 16 teams are split into two brackets of 8, each of which splits into 4, until 1v1 matchups resolve upward to crown the champion.",
      "code": "function mergeSort(arr: number[]): number[] {\n  if (arr.length <= 1) return arr;\n\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n\n  // Inlined merge\n  const merged: number[] = [];\n  let i = 0; let j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) merged.push(left[i++]);\n    else merged.push(right[j++]);\n  }\n  return merged.concat(left.slice(i)).concat(right.slice(j));\n}\n\nconst input = [38, 27, 43, 3, 9, 82, 10];\nconst sorted = mergeSort(input);\nconsole.log('Original:', JSON.stringify(input));\nconsole.log('Sorted:', JSON.stringify(sorted));",
      "output": "Original: [38,27,43,3,9,82,10]\nSorted: [3,9,10,27,38,43,82]",
      "codeNotes": [
        {
          "line": 2,
          "note": "Base case: arrays of 0 or 1 element are already sorted."
        },
        {
          "line": 5,
          "note": "Divides problem into two independent subproblems of equal size N/2."
        },
        {
          "line": 14,
          "note": "Concatenates leftover elements in O(remainder) time."
        }
      ],
      "tryIt": "Sort [5, 4, 3, 2, 1] and verify reverse-sorted arrays sort in the same O(N log N) steps.",
      "check": {
        "question": "What is the worst-case time complexity of Merge Sort, and why does it never degrade to O(N^2)?",
        "options": [
          "O(N log N), because the array is always split exactly in half regardless of data distribution",
          "O(N^2), when the array is already sorted in reverse order",
          "O(N), because merging is linear"
        ],
        "answer": 0,
        "why": "Splitting at the exact midpoint Math.floor(length / 2) guarantees a balanced binary recursion tree of depth log2(N)."
      }
    },
    {
      "title": "Stability & Auxiliary Space Trade-offs",
      "say": [
        "A sorting algorithm is classified as stable if elements with identical keys maintain their original relative order after sorting.",
        "Stability is critical when sorting records by multiple criteria, such as sorting employees by salary and then by last name.",
        "If the second sort is unstable, it shuffles the carefully ordered salary groupings, corrupting the multi-column sort.",
        "Merge Sort is naturally stable because the merge step intentionally prefers the left element whenever values tie.",
        "However, Merge Sort's stability and guaranteed O(N log N) bound come with a trade-off: auxiliary space consumption.",
        "Standard array-based Merge Sort requires O(N) additional memory to store the merged elements during combining.",
        "In naive implementations using arr.slice(), total allocated memory across all recursion levels can reach O(N log N).",
        "For linked lists, however, Merge Sort requires O(1) auxiliary space because nodes can be spliced by updating pointer references.",
        "This makes Merge Sort the universally preferred algorithm for sorting singly and doubly linked lists."
      ],
      "example": "Sorting a deck of cards by suit, then by number: a stable sort keeps all the Clubs in ascending number order when you group by suit.",
      "code": "interface RecordItem { id: number; score: number; label: string; }\n\nfunction stableMergeSort(items: RecordItem[]): RecordItem[] {\n  if (items.length <= 1) return items;\n  const mid = Math.floor(items.length / 2);\n  const left = stableMergeSort(items.slice(0, mid));\n  const right = stableMergeSort(items.slice(mid));\n\n  const res: RecordItem[] = [];\n  let i = 0; let j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i].score <= right[j].score) res.push(left[i++]);\n    else res.push(right[j++]);\n  }\n  return res.concat(left.slice(i)).concat(right.slice(j));\n}\n\nconst students: RecordItem[] = [\n  { id: 1, score: 90, label: 'Alice-First' },\n  { id: 2, score: 80, label: 'Bob' },\n  { id: 3, score: 90, label: 'Charlie-Second' }\n];\n\nconst ranked = stableMergeSort(students);\nfor (const s of ranked) console.log(`${s.score}: ${s.label}`);",
      "output": "80: Bob\n90: Alice-First\n90: Charlie-Second",
      "codeNotes": [
        {
          "line": 11,
          "note": "Tie-breaker '<=' preserves Alice before Charlie because Alice arrived from the left array."
        },
        {
          "line": 26,
          "note": "Verifies stability: Alice-First precedes Charlie-Second even though their scores are equal."
        }
      ],
      "tryIt": "Change Alice's score to 80 and observe that Alice appears before Bob.",
      "check": {
        "question": "Why is Merge Sort preferred over Quick Sort for sorting linked lists?",
        "options": [
          "Linked lists allow O(1) pointer splicing during merge without allocating O(N) auxiliary array buffers",
          "Quick Sort cannot access linked list nodes",
          "Linked lists cannot store numbers"
        ],
        "answer": 0,
        "why": "Linked list nodes can be repointed in O(1) space, eliminating the primary memory drawback of Merge Sort."
      }
    },
    {
      "title": "Counting Inversions via Merge Sort in O(N log N)",
      "say": [
        "An inversion in an array is a pair of indices (i, j) such that i < j but arr[i] > arr[j].",
        "The number of inversions measures how far an array is from being completely sorted; a sorted array has zero inversions.",
        "An inverted array in reverse order has the maximum possible number of inversions: N * (N - 1) / 2.",
        "In collaborative filtering engines, the number of inversions between two users' movie ratings measures their preference similarity.",
        "A brute-force solution checks all pairs using nested loops, costing O(N^2) quadratic time.",
        "We can count inversions in O(N log N) time by piggybacking directly on the merge step of Merge Sort.",
        "When an element from the right array is smaller than the current left element, it is smaller than all remaining elements in the left array.",
        "Therefore, right[j] forms an inversion with every remaining element in left, adding (mid - i) inversions in a single O(1) step.",
        "This ingenious reduction demonstrates how divide-and-conquer algorithms solve complex analytical problems beyond simple sorting."
      ],
      "example": "Comparing music playlists: if song A is above song B on your list but below it on a friend's list, that flip represents an inversion.",
      "code": "function countInversions(arr: number[]): { count: number; sorted: number[] } {\n  if (arr.length <= 1) return { count: 0, sorted: arr };\n\n  const mid = Math.floor(arr.length / 2);\n  const leftRes = countInversions(arr.slice(0, mid));\n  const rightRes = countInversions(arr.slice(mid));\n\n  let totalCount = leftRes.count + rightRes.count;\n  const merged: number[] = [];\n  let i = 0; let j = 0;\n  const left = leftRes.sorted;\n  const right = rightRes.sorted;\n\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) {\n      merged.push(left[i++]);\n    } else {\n      merged.push(right[j++]);\n      totalCount += left.length - i; // All remaining left items are inversions!\n    }\n  }\n  return {\n    count: totalCount,\n    sorted: merged.concat(left.slice(i)).concat(right.slice(j))\n  };\n}\n\nconsole.log('Inversions in [2, 4, 1, 3, 5]:', countInversions([2, 4, 1, 3, 5]).count);\nconsole.log('Inversions in [1, 2, 3]:', countInversions([1, 2, 3]).count);\nconsole.log('Inversions in [3, 2, 1]:', countInversions([3, 2, 1]).count);",
      "output": "Inversions in [2, 4, 1, 3, 5]: 3\nInversions in [1, 2, 3]: 0\nInversions in [3, 2, 1]: 3",
      "codeNotes": [
        {
          "line": 18,
          "note": "When right[j] is smaller than left[i], it is smaller than all (left.length - i) elements remaining in left."
        },
        {
          "line": 8,
          "note": "Aggregates inversions across left half, right half, and cross-boundary split pairs."
        }
      ],
      "tryIt": "Count inversions in [4, 3, 2, 1] and verify it returns 4 * 3 / 2 = 6.",
      "check": {
        "question": "Why does selecting right[j] during merge add exactly (left.length - i) to the inversion count?",
        "options": [
          "Because the left subarray is sorted; if right[j] is smaller than left[i], it is strictly smaller than every subsequent element in left",
          "Because the right subarray has left.length - i elements",
          "Because inversion counts must always be even numbers"
        ],
        "answer": 0,
        "why": "Since left is sorted, left[i] <= left[i+1] <= left[end]; right[j] < left[i] implies right[j] is inverted with all remaining left items."
      }
    },
    {
      "title": "Production Merge Sort with Single Auxiliary Buffer",
      "say": [
        "In production enterprise systems, allocating new arrays on every slice() creates severe garbage collection pressure.",
        "A production-grade Merge Sort allocates a single auxiliary scratch buffer of size N at the very beginning.",
        "Instead of slicing subarrays, the algorithm passes boundary indices (left, right) down the recursion stack.",
        "During the merge step, elements from the source array are copied into the auxiliary buffer, and merged back into the source array.",
        "This optimization bounds total heap allocations to exactly one array of size N, reducing memory footprint by over 60%.",
        "Many production runtimes use Timsort (a hybrid of Merge Sort and Insertion Sort) for their standard library sort functions.",
        "Timsort identifies already-sorted runs in the data and uses Insertion Sort on small chunks (under 32 items) before merging.",
        "Today you have mastered the Master Theorem, two-pointer merging, stability invariants, inversion counting, and buffer-optimized sorting.",
        "These divide-and-conquer principles form the bedrock of distributed map-reduce architectures and external sorting engines."
      ],
      "example": "A carpenter working with a single spare workbench: rather than buying twenty new tables, he uses the one spare bench to hold pieces while assembling the final cabinet.",
      "code": "function productionMergeSort(nums: number[]): number[] {\n  const aux = new Array(nums.length);\n\n  function sort(lo: number, hi: number): void {\n    if (lo >= hi) return;\n    const mid = lo + Math.floor((hi - lo) / 2);\n    sort(lo, mid);\n    sort(mid + 1, hi);\n\n    // Merge in-place using auxiliary buffer\n    for (let k = lo; k <= hi; k++) aux[k] = nums[k];\n    let i = lo;\n    let j = mid + 1;\n    for (let k = lo; k <= hi; k++) {\n      if (i > mid) nums[k] = aux[j++];\n      else if (j > hi) nums[k] = aux[i++];\n      else if (aux[i] <= aux[j]) nums[k] = aux[i++];\n      else nums[k] = aux[j++];\n    }\n  }\n\n  sort(0, nums.length - 1);\n  return nums;\n}\n\nconst arr = [9, 3, 7, 5, 6, 4, 8, 2];\nproductionMergeSort(arr);\nconsole.log('Buffer-optimized sorted:', JSON.stringify(arr));",
      "output": "Buffer-optimized sorted: [2,3,4,5,6,7,8,9]",
      "codeNotes": [
        {
          "line": 2,
          "note": "Allocates a single auxiliary buffer once upfront, avoiding O(N log N) slice allocations."
        },
        {
          "line": 6,
          "note": "Passes integer indices (lo, mid, hi) down the call stack to eliminate array slice overhead."
        },
        {
          "line": 15,
          "note": "Merges aux elements back into nums in-place, preserving stability."
        }
      ],
      "tryIt": "Sort [100, -5, 0, 50, -20] and verify it handles negative values correctly.",
      "check": {
        "question": "What is the primary memory advantage of passing boundary indices over using array.slice()?",
        "options": [
          "It avoids allocating new subarray objects at every recursive level, bounding heap allocation to a single buffer of size N",
          "It allows the algorithm to run in O(log N) time",
          "It converts the sort into an unstable sort"
        ],
        "answer": 0,
        "why": "Index-based recursion mutates within pre-allocated buffers, reducing garbage collection overhead from O(N log N) to O(N)."
      }
    }
  ],
  "summary": [
    "Merge Sort divides arrays in half, sorts halves recursively, and merges them in O(N) time, yielding O(N log N) guaranteed.",
    "Master Theorem recurrence T(N) = 2T(N/2) + O(N) proves worst-, average-, and best-case O(N log N) bounds.",
    "Stable sorting is preserved during merge by picking the left element whenever values tie (left[i] <= right[j]).",
    "Counting inversions runs in O(N log N) by accumulating (left.length - i) each time an element from right is chosen.",
    "Production implementations allocate a single auxiliary buffer upfront, eliminating array slice memory bloat."
  ],
  "projectStep": {
    "title": "Merge Sort & Inversion Counter Implementation",
    "steps": [
      "Implement mergeTwoSorted with stability tie-breaking.",
      "Implement recursive countInversions to calculate disordered pairs in O(N log N).",
      "Build productionMergeSort with a single pre-allocated auxiliary buffer."
    ]
  }
},
{
  "day": 13,
  "title": "Quick Sort & Quick Select (Kth Largest Element in O(N))",
  "goal": "Master in-place Lomuto/Hoare partitioning, randomized pivots, and finding Kth elements in average O(N) time.",
  "minutes": 25,
  "recap": "Yesterday you mastered Merge Sort's divide-and-conquer combining. Today we explore Quick Sort: partitioning in-place around a pivot, trading Merge Sort's O(N) auxiliary space for O(1) in-place sorting.",
  "parts": [
    {
      "title": "Lomuto Partitioning Mechanics",
      "say": [
        "Quick Sort is an in-place divide-and-conquer sorting algorithm centered around the concept of partitioning.",
        "A partition selects an element called the pivot and rearranges the array so all smaller elements move to the left and larger to the right.",
        "Once partitioned, the pivot element sits in its final, permanently sorted position in the array.",
        "The Lomuto partition scheme selects the last element as the pivot and maintains a boundary pointer i for smaller elements.",
        "A second pointer j scans from left to right; whenever arr[j] is less than or equal to the pivot, i advances and arr[i] swaps with arr[j].",
        "After the scan completes, swapping arr[i + 1] with the pivot places the pivot precisely between the two partitions.",
        "The partition routine executes in linear O(N) time while using strict O(1) auxiliary space, requiring zero new array allocations.",
        "Lomuto partitioning is straightforward to implement and reason about, making it the standard partitioning introductory pattern.",
        "However, Lomuto performs approximately three times more swaps than Hoare's scheme when elements are already sorted or identical."
      ],
      "example": "A gym teacher picking team captains: anyone shorter than the captain steps to the left; anyone taller steps to the right.",
      "code": "function lomutoPartition(arr: number[], lo: number, hi: number): number {\n  const pivot = arr[hi];\n  let i = lo - 1;\n\n  for (let j = lo; j < hi; j++) {\n    if (arr[j] <= pivot) {\n      i++;\n      [arr[i], arr[j]] = [arr[j], arr[i]];\n    }\n  }\n  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];\n  return i + 1; // Pivot index\n}\n\nconst nums = [10, 80, 30, 90, 40, 50, 70];\nconst pivotIdx = lomutoPartition(nums, 0, nums.length - 1);\nconsole.log('Pivot element:', nums[pivotIdx]);\nconsole.log('Partitioned array:', JSON.stringify(nums));",
      "output": "Pivot element: 70\nPartitioned array: [10,30,40,50,70,90,80]",
      "codeNotes": [
        {
          "line": 2,
          "note": "Chooses the last element arr[hi] as the pivot value."
        },
        {
          "line": 7,
          "note": "Swaps smaller elements behind the boundary pointer i."
        },
        {
          "line": 11,
          "note": "Places pivot at its exact final sorted position (i + 1)."
        }
      ],
      "tryIt": "Partition [5, 2, 8, 1, 3] and verify the pivot 3 ends up at index 2.",
      "check": {
        "question": "What is guaranteed about the pivot element after a partition operation completes?",
        "options": [
          "The pivot is placed at its exact final sorted position, with all smaller elements to its left and larger to its right",
          "The entire array is completely sorted",
          "The pivot is always placed at index 0"
        ],
        "answer": 0,
        "why": "Partitioning guarantees that the pivot is in its definitive position; only the left and right partitions need further sorting."
      }
    },
    {
      "title": "Hoare Partitioning Scheme & Efficiency Comparison",
      "say": [
        "Invented by Sir Tony Hoare in 1959, Hoare's partition scheme is the original and more efficient partitioning algorithm.",
        "Instead of a single forward scan, Hoare uses two pointers converging inward from both ends of the subarray.",
        "The left pointer moves rightward until it finds an element greater than or equal to the pivot.",
        "The right pointer moves leftward until it finds an element less than or equal to the pivot.",
        "If the pointers have not crossed, the two out-of-place elements are swapped, and the inward scan continues.",
        "When the pointers cross, the partition is complete, returning the split index where the two halves meet.",
        "Hoare's scheme performs on average three times fewer element swaps than Lomuto's scheme.",
        "Furthermore, Hoare handles duplicate elements gracefully by stopping both pointers on values equal to the pivot.",
        "This balanced convergence prevents the degenerate partitions that plague Lomuto when sorting arrays with many identical keys."
      ],
      "example": "Two inspectors starting from opposite ends of a row of parked cars: swapping poorly parked cars until the two inspectors meet in the middle.",
      "code": "function hoarePartition(arr: number[], lo: number, hi: number): number {\n  const pivot = arr[Math.floor(lo + (hi - lo) / 2)];\n  let i = lo - 1;\n  let j = hi + 1;\n\n  while (true) {\n    do { i++; } while (arr[i] < pivot);\n    do { j--; } while (arr[j] > pivot);\n    if (i >= j) return j;\n    [arr[i], arr[j]] = [arr[j], arr[i]];\n  }\n}\n\nconst data = [5, 3, 8, 4, 2, 7, 1, 10];\nconst splitIdx = hoarePartition(data, 0, data.length - 1);\nconsole.log('Split index:', splitIdx);\nconsole.log('Left partition max <= Right partition min:', Math.max(...data.slice(0, splitIdx + 1)) <= Math.min(...data.slice(splitIdx + 1)));",
      "output": "Split index: 3\nLeft partition max <= Right partition min: true",
      "codeNotes": [
        {
          "line": 2,
          "note": "Picks midpoint pivot to prevent worst-case performance on pre-sorted inputs."
        },
        {
          "line": 7,
          "note": "Pointers converge toward each other, swapping pairs of inverted elements."
        }
      ],
      "tryIt": "Partition [9, 1, 8, 2, 7, 3] and verify all items in left partition are <= right partition items.",
      "check": {
        "question": "Why is Hoare's partition scheme practically faster than Lomuto's?",
        "options": [
          "It converges from both ends, executing approximately three times fewer swaps on average",
          "It uses binary search inside the loop",
          "It sorts the array in O(log N) time"
        ],
        "answer": 0,
        "why": "Hoare only swaps when elements are strictly out of order on both sides, minimizing memory write operations."
      }
    },
    {
      "title": "Recursive Quick Sort Implementation",
      "say": [
        "Armed with a partition subroutine, Quick Sort recursively sorts the subarrays to the left and right of the pivot.",
        "Unlike Merge Sort, which does all its combining work after the recursive calls return, Quick Sort does its partition work before recursing.",
        "The divide step partitions the array in O(N) time; the conquer step recursively sorts arr[lo..pivot-1] and arr[pivot+1..hi].",
        "Because elements are already in their correct partitioned relative halves, zero combine work is needed upon return.",
        "The average-case time complexity is O(N log N) with an exceptionally small constant factor due to cache-friendly in-place operations.",
        "The auxiliary space complexity is O(log N) on average, required strictly for the call stack frames.",
        "However, if the pivot repeatedly splits the array into 0 and N-1 elements, the recursion tree degenerates into a linear chain of depth N.",
        "In this worst case, Quick Sort degrades to O(N^2) quadratic time, illustrating the paramount importance of good pivot selection.",
        "Engineers optimize Quick Sort by sorting the smaller partition first, guaranteeing call stack space never exceeds O(log N)."
      ],
      "example": "Organizing an encyclopedia: place volume M in the middle, then independently organize volumes A through L on the left shelf and N through Z on the right shelf.",
      "code": "function quickSort(arr: number[], lo = 0, hi = arr.length - 1): number[] {\n  if (lo < hi) {\n    // Lomuto partition\n    const pivot = arr[hi];\n    let i = lo - 1;\n    for (let j = lo; j < hi; j++) {\n      if (arr[j] <= pivot) {\n        i++;\n        [arr[i], arr[j]] = [arr[j], arr[i]];\n      }\n    }\n    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];\n    const p = i + 1;\n\n    quickSort(arr, lo, p - 1);\n    quickSort(arr, p + 1, hi);\n  }\n  return arr;\n}\n\nconst input = [10, 7, 8, 9, 1, 5];\nquickSort(input);\nconsole.log('QuickSorted:', JSON.stringify(input));",
      "output": "QuickSorted: [1,5,7,8,9,10]",
      "codeNotes": [
        {
          "line": 2,
          "note": "Base case: single-element or empty subarrays (lo >= hi) are inherently sorted."
        },
        {
          "line": 15,
          "note": "Recursively sorts left subarray up to p - 1, leaving the pivot in place."
        },
        {
          "line": 16,
          "note": "Recursively sorts right subarray from p + 1 to hi."
        }
      ],
      "tryIt": "Sort [3, -1, 4, 1, 5, 9, 2, 6] and verify all numbers are sorted in ascending order.",
      "check": {
        "question": "When does Quick Sort degrade to its worst-case O(N^2) time complexity?",
        "options": [
          "When the pivot selection repeatedly yields maximally unbalanced partitions (e.g., 0 elements on one side, N - 1 on the other)",
          "When the array contains floating-point numbers",
          "When the array size is a power of 2"
        ],
        "answer": 0,
        "why": "Unbalanced splits produce N recursive levels with O(N) work per level, resulting in O(N^2) total execution time."
      }
    },
    {
      "title": "Pivot Selection Strategies & Randomized Quick Sort",
      "say": [
        "The performance of Quick Sort hinges entirely on picking a pivot that splits the array into roughly equal halves.",
        "Choosing the first or last element causes worst-case O(N^2) behavior on already-sorted or reverse-sorted input arrays.",
        "To defend against this vulnerability, production implementations employ randomized pivot selection.",
        "Randomized Quick Sort chooses a random index between lo and hi, swaps that element with arr[hi], and proceeds with standard partitioning.",
        "By randomizing the pivot, no specific input ordering can reliably trigger the worst-case O(N^2) behavior.",
        "Another industry-standard strategy is the 'Median-of-Three' heuristic: inspecting arr[lo], arr[mid], and arr[hi] and using their median value.",
        "Median-of-three guarantees balanced partitions for sorted and nearly-sorted datasets while eliminating the overhead of random number generators.",
        "Randomized pivot selection is mathematically proven to achieve O(N log N) expected time on all possible input distributions.",
        "This probabilistic guarantee makes Randomized Quick Sort immune to algorithmic complexity denial-of-service attacks."
      ],
      "example": "Picking a fair referee: instead of always picking the first volunteer, draw a random name from a hat so no single player can manipulate the choice.",
      "code": "function randomizedPartition(arr: number[], lo: number, hi: number): number {\n  // Deterministic pseudo-random pick for reproducible testing\n  const randomIdx = lo + Math.floor((hi - lo) / 2); // Pick midpoint\n  [arr[randomIdx], arr[hi]] = [arr[hi], arr[randomIdx]];\n\n  const pivot = arr[hi];\n  let i = lo - 1;\n  for (let j = lo; j < hi; j++) {\n    if (arr[j] <= pivot) {\n      i++;\n      [arr[i], arr[j]] = [arr[j], arr[i]];\n    }\n  }\n  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];\n  return i + 1;\n}\n\nconst presorted = [1, 2, 3, 4, 5, 6, 7];\nconst p = randomizedPartition(presorted, 0, presorted.length - 1);\nconsole.log('Balanced pivot chosen:', presorted[p]);\nconsole.log('Left size:', p, 'Right size:', presorted.length - 1 - p);",
      "output": "Balanced pivot chosen: 4\nLeft size: 3 Right size: 3",
      "codeNotes": [
        {
          "line": 3,
          "note": "Picks pivot from center rather than extreme end to prevent O(N^2) on sorted data."
        },
        {
          "line": 4,
          "note": "Swaps chosen pivot to arr[hi] so standard partition logic runs unchanged."
        }
      ],
      "tryIt": "Verify that partitioning pre-sorted data produces balanced halves of size 3 on each side.",
      "check": {
        "question": "Why does randomized pivot selection protect against algorithmic complexity attacks?",
        "options": [
          "An attacker cannot construct an adversarial input that deterministically triggers worst-case O(N^2) splits",
          "Random numbers make the algorithm run in O(1) time",
          "It encrypts the array elements during sorting"
        ],
        "answer": 0,
        "why": "With random pivot choices, the probability of encountering catastrophic unbalance on every level is astronomically small."
      }
    },
    {
      "title": "Quick Select Algorithm (Kth Element in Average O(N))",
      "say": [
        "Finding the Kth smallest (or Kth largest) element in an unsorted array is one of the most common selection problems.",
        "A naive approach sorts the entire array in O(N log N) time and returns arr[k], doing unnecessary work sorting unneeded elements.",
        "Quick Select, also invented by Tony Hoare, solves the selection problem in average O(N) linear time.",
        "Quick Select partitions the array around a pivot, placing the pivot at its exact final sorted index p.",
        "If p equals the target index k, we have found our answer immediately and return arr[p].",
        "If k is less than p, the target must lie in the left partition, so we recurse only on the left subarray.",
        "If k is greater than p, the target must lie in the right partition, so we recurse only on the right subarray.",
        "Unlike Quick Sort, which recurses into both halves (T(N) = 2T(N/2) + O(N)), Quick Select recurses into only one half (T(N) = T(N/2) + O(N)).",
        "By the Master Theorem, N + N/2 + N/4 + ... converges to a geometric series sum of 2N, achieving strict O(N) average time."
      ],
      "example": "Finding the 10th tallest student among 100 students: divide into two groups around an average student; if the shorter group has 30 students, the 10th tallest is definitely in the shorter group.",
      "code": "function quickSelect(nums: number[], k: number, lo = 0, hi = nums.length - 1): number {\n  if (lo === hi) return nums[lo];\n\n  const pivot = nums[hi];\n  let i = lo - 1;\n  for (let j = lo; j < hi; j++) {\n    if (nums[j] <= pivot) {\n      i++;\n      [nums[i], nums[j]] = [nums[j], nums[i]];\n    }\n  }\n  [nums[i + 1], nums[hi]] = [nums[hi], nums[i + 1]];\n  const p = i + 1;\n\n  if (p === k) return nums[p];\n  if (k < p) return quickSelect(nums, k, lo, p - 1);\n  return quickSelect(nums, k, p + 1, hi);\n}\n\nfunction findKthLargest(nums: number[], k: number): number {\n  // Kth largest is (N - k)th smallest (0-indexed)\n  const targetIdx = nums.length - k;\n  return quickSelect([...nums], targetIdx);\n}\n\nconst list = [3, 2, 1, 5, 6, 4];\nconsole.log('1st largest (max):', findKthLargest(list, 1));\nconsole.log('2nd largest:', findKthLargest(list, 2));\nconsole.log('4th largest:', findKthLargest(list, 4));",
      "output": "1st largest (max): 6\n2nd largest: 5\n4th largest: 3",
      "codeNotes": [
        {
          "line": 15,
          "note": "If pivot index matches k, the Kth element is found without sorting the remaining elements."
        },
        {
          "line": 16,
          "note": "Recourses into only one half, reducing problem size by half on each iteration."
        }
      ],
      "tryIt": "Find the 3rd largest element in [7, 10, 4, 3, 20, 15] and verify the result is 10.",
      "check": {
        "question": "Why does Quick Select execute in O(N) average time while Quick Sort takes O(N log N)?",
        "options": [
          "Quick Select recurses into only one partition at each step, forming a geometric series N + N/2 + N/4 + ... = 2N",
          "Quick Select uses a hash map to skip comparisons",
          "Quick Select does not use partitioning"
        ],
        "answer": 0,
        "why": "Dropping half the elements at each step creates a geometric series that converges to 2N, achieving O(N) average time."
      }
    },
    {
      "title": "Three-Way Partitioning (Dutch National Flag & Duplicates)",
      "say": [
        "A major weakness of standard two-way Quick Sort is poor performance on arrays with many duplicate elements.",
        "When an array contains all identical values, standard Lomuto partitioning splits N into 0 and N-1, degrading to O(N^2) time.",
        "Edsger Dijkstra solved this problem with the Dutch National Flag 3-Way Partitioning algorithm.",
        "Three-way partitioning divides the array into three distinct sections: elements strictly less than pivot, equal to pivot, and greater than pivot.",
        "We maintain three pointers: lt (less than boundary), i (current inspection pointer), and gt (greater than boundary).",
        "If arr[i] < pivot, we swap arr[lt] with arr[i], increment both lt and i.",
        "If arr[i] > pivot, we swap arr[i] with arr[gt] and decrement gt (without advancing i, since the swapped item must be evaluated).",
        "If arr[i] === pivot, we simply advance i.",
        "When the scan finishes, all elements equal to the pivot are in their final positions; recursive calls only sort the < and > regions.",
        "This delivers linear O(N) performance on arrays with all identical elements, providing bulletproof sorting efficiency."
      ],
      "example": "Sorting laundry into three baskets: whites to the left, colors to the right, and delicates grouped in the center.",
      "code": "function threeWayQuickSort(arr: number[], lo = 0, hi = arr.length - 1): number[] {\n  if (lo >= hi) return arr;\n\n  const pivot = arr[lo];\n  let lt = lo;\n  let i = lo + 1;\n  let gt = hi;\n\n  while (i <= gt) {\n    if (arr[i] < pivot) {\n      [arr[lt], arr[i]] = [arr[i], arr[lt]];\n      lt++; i++;\n    } else if (arr[i] > pivot) {\n      [arr[i], arr[gt]] = [arr[gt], arr[i]];\n      gt--;\n    } else {\n      i++;\n    }\n  }\n\n  threeWayQuickSort(arr, lo, lt - 1);\n  threeWayQuickSort(arr, gt + 1, hi);\n  return arr;\n}\n\nconst duplicates = [2, 0, 2, 1, 1, 0, 2, 1, 0];\nthreeWayQuickSort(duplicates);\nconsole.log('3-Way QuickSorted duplicates:', JSON.stringify(duplicates));",
      "output": "3-Way QuickSorted duplicates: [0,0,0,1,1,1,2,2,2]",
      "codeNotes": [
        {
          "line": 10,
          "note": "Pushes items smaller than pivot before lt."
        },
        {
          "line": 13,
          "note": "Pushes items larger than pivot behind gt without advancing i."
        },
        {
          "line": 20,
          "note": "Recursively sorts only strictly smaller and strictly larger segments; equals are done."
        }
      ],
      "tryIt": "Sort [1, 1, 1, 1, 1] with threeWayQuickSort and verify it sorts in a single pass.",
      "check": {
        "question": "How does 3-way partitioning prevent Quick Sort from degrading on arrays with many duplicate elements?",
        "options": [
          "All elements equal to the pivot are grouped together in one pass and excluded from subsequent recursive calls",
          "It uses Counting Sort internally for duplicates",
          "It removes duplicate values from the output array"
        ],
        "answer": 0,
        "why": "Equal elements are placed in their final positions in the middle; recursion only processes strictly smaller and larger elements."
      }
    }
  ],
  "summary": [
    "Quick Sort partitions in-place around a pivot, placing the pivot at its final sorted position with O(1) auxiliary space.",
    "Hoare partitioning converges from both ends, executing three times fewer swaps than Lomuto's forward scan.",
    "Average time complexity is O(N log N); worst-case O(N^2) occurs on unbalanced partitions.",
    "Randomized pivot selection and median-of-three protect against adversarial worst-case inputs.",
    "Quick Select finds the Kth largest element in O(N) average time by recursing into only one partition.",
    "Dijkstra's 3-way partitioning groups duplicate elements, guaranteeing O(N) performance on duplicate-heavy arrays."
  ],
  "projectStep": {
    "title": "Quick Sort & Quick Select Implementation",
    "steps": [
      "Implement Lomuto and Hoare partition subroutines.",
      "Build quickSelect to find Kth largest elements in average O(N) time.",
      "Implement threeWayQuickSort with Dutch National Flag duplicate grouping."
    ]
  }
},
{
  "day": 14,
  "title": "Non-Comparison Sorting: Counting Sort & Radix Sort",
  "goal": "Sort integers in O(N + K) linear time by exploiting key distributions and byte digit buckets.",
  "minutes": 25,
  "recap": "Yesterday you mastered comparison-based Quick Sort and Quick Select. Today we break through the theoretical O(N log N) comparison barrier by exploiting numerical key properties to sort in linear O(N) time.",
  "parts": [
    {
      "title": "Comparison Lower Bound & Non-Comparison Feasibility",
      "say": [
        "In computer science, a comparison sort determines ordering exclusively by comparing pairs of elements with the less-than operator.",
        "Any comparison sort can be modeled as a binary decision tree where each leaf represents one of N! possible permutations.",
        "A binary tree with N! leaves must have a minimum height of ceil(log2(N!)), which by Stirling's approximation is Omega(N log N).",
        "Therefore, no comparison-based sorting algorithm (including Merge Sort, Quick Sort, or Heap Sort) can ever beat O(N log N) in the worst case.",
        "However, this lower bound applies strictly to algorithms that rely solely on pairwise element comparisons.",
        "If we know additional information about our keys—such as keys being integers within a bounded range—we can bypass comparisons entirely.",
        "Non-comparison sorting algorithms exploit the mathematical structure of keys, using digit values or integer values as direct array indices.",
        "By mapping values directly to index buckets, algorithms like Counting Sort and Radix Sort achieve linear O(N + K) time.",
        "Understanding this theoretical boundary enables engineers to select the optimal sorting strategy for specialized high-throughput systems."
      ],
      "example": "Sorting numbered raffle tickets: instead of comparing ticket 42 with ticket 87, you walk directly to bucket 42 and drop the ticket in.",
      "code": "function compareTheoreticalBounds(n: number): string {\n  // Stirling approximation: log2(n!) ~= n*log2(n) - n*log2(e)\n  const comparisonBound = Math.round(n * Math.log2(n) - n * Math.log2(Math.E));\n  const nonComparisonBound = n; // O(N) when K <= N\n  return `N=${n}: Comparison Min Ops = ${comparisonBound}, Non-Comparison Linear Ops = ${nonComparisonBound}`;\n}\n\nconsole.log(compareTheoreticalBounds(10));\nconsole.log(compareTheoreticalBounds(100));\nconsole.log(compareTheoreticalBounds(1000));",
      "output": "N=10: Comparison Min Ops = 19, Non-Comparison Linear Ops = 10\nN=100: Comparison Min Ops = 520, Non-Comparison Linear Ops = 100\nN=1000: Comparison Min Ops = 8523, Non-Comparison Linear Ops = 1000",
      "codeNotes": [
        {
          "line": 3,
          "note": "Computes theoretical minimum comparison count log2(N!) using Stirling's approximation."
        },
        {
          "line": 4,
          "note": "Demonstrates linear scaling advantage when non-comparison sorting conditions are met."
        }
      ],
      "tryIt": "Calculate bounds for N=10000 and observe that linear sorting is over 10x faster theoretically.",
      "check": {
        "question": "Why can non-comparison sorting algorithms achieve O(N) time while comparison sorts cannot beat O(N log N)?",
        "options": [
          "They treat keys as integer indices rather than performing pairwise comparisons, bypassing the decision tree lower bound",
          "They use multi-threaded GPU processors",
          "They only sort the first half of the array"
        ],
        "answer": 0,
        "why": "Using keys directly as array indices bypasses the binary decision tree height constraint of log2(N!)."
      }
    },
    {
      "title": "Counting Sort with Prefix Sum Reconstruction",
      "say": [
        "Counting Sort works by counting the occurrences of each distinct key value in an auxiliary frequency array.",
        "First, we find the minimum and maximum values in the input array to determine the range K = max - min + 1.",
        "We allocate a count array of size K, initialized to zero, and iterate through the input to increment counts for each element.",
        "To make Counting Sort stable, we transform the count array into a prefix sum array where count[i] stores the cumulative count of elements <= i.",
        "The prefix sum array indicates the exact ending position of each value in the final output array.",
        "We then iterate through the original array in reverse order, placing each element at its prefix-sum index and decrementing the count.",
        "Iterating in reverse preserves stability: identical elements maintain their original relative order in the output.",
        "The time complexity is O(N + K) where N is the number of elements and K is the range of values.",
        "When K is O(N) (range is proportional to element count), Counting Sort runs in strict linear O(N) time.",
        "However, if K is extremely large (e.g., sorting [1, 10^9]), allocating the count array causes severe memory exhaustion."
      ],
      "example": "Tallying votes in an election with 5 candidates: count the ballots for each candidate, then line up voters by candidate in one continuous line.",
      "code": "function countingSort(nums: number[]): number[] {\n  if (nums.length <= 1) return nums;\n  const min = Math.min(...nums);\n  const max = Math.max(...nums);\n  const range = max - min + 1;\n\n  const count = new Array(range).fill(0);\n  for (const n of nums) count[n - min]++;\n\n  // Build prefix sums\n  for (let i = 1; i < range; i++) count[i] += count[i - 1];\n\n  const output = new Array(nums.length);\n  // Iterate backward for stability\n  for (let i = nums.length - 1; i >= 0; i--) {\n    const val = nums[i];\n    const targetIdx = count[val - min] - 1;\n    output[targetIdx] = val;\n    count[val - min]--;\n  }\n  return output;\n}\n\nconst input = [4, 2, 2, 8, 3, 3, 1];\nconsole.log('Counting sorted:', JSON.stringify(countingSort(input)));",
      "output": "Counting sorted: [1,2,2,3,3,4,8]",
      "codeNotes": [
        {
          "line": 8,
          "note": "Counts frequencies of each integer offset by min."
        },
        {
          "line": 11,
          "note": "Computes prefix sums so count[i] gives ending index position."
        },
        {
          "line": 15,
          "note": "Traverses backward to preserve stability for duplicate items."
        }
      ],
      "tryIt": "Sort [10, -2, 5, 0, -2, 5] and verify negative numbers are handled via min offset.",
      "check": {
        "question": "When is Counting Sort practical to use over Quick Sort or Merge Sort?",
        "options": [
          "When the range of integer values K is small and roughly proportional to the number of elements N (K = O(N))",
          "When sorting arbitrary strings of varying lengths",
          "When memory is extremely limited and K = 1,000,000,000"
        ],
        "answer": 0,
        "why": "Counting Sort requires O(K) space for the count array; it is only efficient when the range K is compact."
      }
    },
    {
      "title": "Dutch National Flag Algorithm (3-Way In-Place Sort)",
      "say": [
        "A special case of non-comparison sorting occurs when the input contains only three distinct key values (e.g., 0, 1, and 2).",
        "The Dutch National Flag problem, proposed by Edsger Dijkstra, sorts such arrays in a single pass with O(1) auxiliary space.",
        "Instead of allocating count arrays, we maintain three pointers dividing the array into four regions: red (0s), white (1s), unexamined, and blue (2s).",
        "Pointer low tracks the boundary of 0s; pointer mid tracks the current element; pointer high tracks the boundary of 2s.",
        "If arr[mid] is 0, we swap arr[low] with arr[mid], increment low, and increment mid.",
        "If arr[mid] is 1, it belongs in the middle region, so we simply increment mid.",
        "If arr[mid] is 2, we swap arr[mid] with arr[high] and decrement high (without incrementing mid, as the swapped element must be inspected).",
        "The loop terminates when mid crosses high, guaranteeing all elements are sorted in exactly N iterations.",
        "This algorithm requires zero auxiliary memory allocations, achieving optimal O(N) time and O(1) space."
      ],
      "example": "Sorting laundry into three piles (whites, colors, darks) in a single pass across a laundry basket using two sorting hands.",
      "code": "function sortColors(nums: number[]): void {\n  let low = 0;\n  let mid = 0;\n  let high = nums.length - 1;\n\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++;\n      mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n}\n\nconst colors = [2, 0, 2, 1, 1, 0];\nsortColors(colors);\nconsole.log('Dutch National Flag sorted:', JSON.stringify(colors));",
      "output": "Dutch National Flag sorted: [0,0,1,1,2,2]",
      "codeNotes": [
        {
          "line": 8,
          "note": "Pushes 0s into the low region and advances both pointers."
        },
        {
          "line": 13,
          "note": "Pushes 2s into the high region; does not advance mid because swapped item must be evaluated."
        }
      ],
      "tryIt": "Sort [2, 0, 1] and verify all three values end up in [0, 1, 2] order.",
      "check": {
        "question": "Why does the Dutch National Flag algorithm not increment 'mid' when swapping with 'high'?",
        "options": [
          "The element swapped from 'high' was previously unexamined and must be evaluated on the next iteration",
          "Because high is always smaller than mid",
          "Because mid must only advance on even iterations"
        ],
        "answer": 0,
        "why": "The element at 'high' has not been inspected yet; advancing mid would skip validating that element."
      }
    },
    {
      "title": "Least Significant Digit (LSD) Radix Sort",
      "say": [
        "When integer keys span a large range, Counting Sort becomes impractical due to massive count array allocations.",
        "Radix Sort solves this limitation by sorting numbers digit by digit, from the Least Significant Digit (LSD) to the Most Significant Digit (MSD).",
        "At each digit place (units, tens, hundreds, thousands), Radix Sort uses a stable sub-sort—typically Counting Sort—with a base of 10.",
        "Because the base is fixed at 10, each digit pass requires a count array of only 10 buckets (indices 0 through 9).",
        "Crucially, the sub-sorting algorithm MUST be stable; if two numbers share the same tens digit, their relative units digit order must be preserved.",
        "After D passes (where D is the number of digits in the maximum value), the entire array is completely sorted.",
        "The time complexity is O(D * (N + B)) where D is digits, N is elements, and B is the number base (typically 10 or 256 for bytes).",
        "When D is treated as a small constant, Radix Sort achieves strict linear O(N) performance on arbitrary integer arrays.",
        "Radix Sort powers high-performance network packet sorting, graphics vertex processing, and financial ticker ordering engines."
      ],
      "example": "Sorting playing cards by rank and suit: first sort all cards by rank (2 through Ace), then stably sort them into four suit piles.",
      "code": "function radixSort(nums: number[]): number[] {\n  if (nums.length <= 1) return nums;\n  const max = Math.max(...nums);\n\n  // Run counting sort for each digit exp (1, 10, 100, ...)\n  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {\n    const count = new Array(10).fill(0);\n    const output = new Array(nums.length);\n\n    for (const n of nums) {\n      const digit = Math.floor(n / exp) % 10;\n      count[digit]++;\n    }\n    for (let i = 1; i < 10; i++) count[i] += count[i - 1];\n\n    for (let i = nums.length - 1; i >= 0; i--) {\n      const digit = Math.floor(nums[i] / exp) % 10;\n      output[count[digit] - 1] = nums[i];\n      count[digit]--;\n    }\n    for (let i = 0; i < nums.length; i++) nums[i] = output[i];\n  }\n  return nums;\n}\n\nconst data = [170, 45, 75, 90, 802, 24, 2, 66];\nconsole.log('Radix sorted:', JSON.stringify(radixSort(data)));",
      "output": "Radix sorted: [2,24,45,66,75,90,170,802]",
      "codeNotes": [
        {
          "line": 6,
          "note": "Loops over digit positions: 1 (units), 10 (tens), 100 (hundreds)."
        },
        {
          "line": 16,
          "note": "Stable backward iteration places numbers according to current digit prefix sums."
        }
      ],
      "tryIt": "Sort [329, 457, 657, 839, 436, 720, 355] and verify the output is fully sorted.",
      "check": {
        "question": "Why must the digit sub-sorting algorithm in LSD Radix Sort be stable?",
        "options": [
          "To preserve the sorted order established by less significant digits when sorting by more significant digits",
          "To keep memory usage under 10 megabytes",
          "Because unstable sorts cannot sort numbers larger than 100"
        ],
        "answer": 0,
        "why": "If the sub-sort were unstable, sorting by tens would shuffle the units order, destroying earlier digit work."
      }
    },
    {
      "title": "Bucket Sort for Uniformly Distributed Data",
      "say": [
        "Bucket Sort distributes elements across a fixed number of buckets, sorts each bucket individually, and concatenates the results.",
        "Bucket Sort is ideally suited for floating-point numbers uniformly distributed across a known range, such as [0.0, 1.0).",
        "We create N empty buckets and map each value to a bucket index using the formula: index = Math.floor(value * N).",
        "Under uniform distribution, each bucket receives an expected O(1) number of elements.",
        "Each bucket is sorted using a simple sorting algorithm like Insertion Sort; since buckets contain very few elements, this is near-instant.",
        "Finally, we iterate through the buckets in order, appending their sorted elements into the final output array.",
        "When inputs are uniformly distributed, Bucket Sort achieves linear O(N) average-case time complexity.",
        "However, if elements cluster heavily into a single bucket, performance degrades to the complexity of the bucket sort algorithm (O(N^2)).",
        "Bucket Sort is widely used in geospatial indexing, histogram equalization in image processing, and external merge buffers."
      ],
      "example": "Sorting mail by zip code: letters are distributed into zip code mailbags, each mailbag is sorted by street address, and bags are packed in numerical zip code order.",
      "code": "function bucketSort(arr: number[]): number[] {\n  if (arr.length <= 1) return arr;\n  const n = arr.length;\n  const buckets: number[][] = Array.from({ length: n }, () => []);\n\n  // Distribute into buckets\n  for (const x of arr) {\n    const bIdx = Math.min(n - 1, Math.floor(x * n));\n    buckets[bIdx].push(x);\n  }\n\n  // Sort each bucket and concatenate\n  const result: number[] = [];\n  for (const bucket of buckets) {\n    bucket.sort((a, b) => a - b);\n    result.push(...bucket);\n  }\n  return result;\n}\n\nconst floats = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12];\nconst sortedFloats = bucketSort(floats);\nconsole.log('Bucket sorted floats:', sortedFloats.map(x => x.toFixed(2)).join(', '));",
      "output": "Bucket sorted floats: 0.12, 0.17, 0.21, 0.26, 0.39, 0.72, 0.78, 0.94",
      "codeNotes": [
        {
          "line": 8,
          "note": "Maps floating point number in [0, 1) to bucket index in O(1) time."
        },
        {
          "line": 15,
          "note": "Sorts each small bucket independently and concatenates them in order."
        }
      ],
      "tryIt": "Pass [0.5, 0.2, 0.8, 0.1] and verify it returns [0.1, 0.2, 0.5, 0.8].",
      "check": {
        "question": "Under what input condition does Bucket Sort achieve optimal O(N) average time?",
        "options": [
          "When elements are uniformly distributed across the interval, distributing a constant number of items per bucket",
          "When all elements have the exact same value",
          "When the input array is already sorted in reverse order"
        ],
        "answer": 0,
        "why": "Uniform distribution ensures each of the N buckets receives O(1) expected elements, making per-bucket sorting O(1)."
      }
    },
    {
      "title": "Sorting Algorithm Taxonomy & Decision Matrix",
      "say": [
        "We now synthesize the complete landscape of sorting algorithms into a production engineering decision matrix.",
        "Quick Sort is the default general-purpose in-place sort: O(N log N) average time, O(log N) space, but unstable.",
        "Merge Sort is the gold standard for stability and guaranteed worst-case bounds: O(N log N) always, but requires O(N) auxiliary space.",
        "Heap Sort provides O(N log N) worst-case time with strict O(1) auxiliary space, but suffers from poor cache locality.",
        "Counting Sort runs in linear O(N + K) time, ideal for integers when range K <= O(N).",
        "Radix Sort sorts large integers in O(D * N) time with small bucket overhead, beating comparison sorts for large datasets.",
        "Insertion Sort excels on small arrays (N < 32) and nearly-sorted data, operating in O(N) time with zero allocation overhead.",
        "Production engines like V8 and Java implement hybrid sorters (Timsort or Dual-Pivot Quicksort) that switch algorithms dynamically based on size.",
        "Today you have mastered the theoretical limits of sorting, non-comparison linear techniques, and architectural trade-offs across all major sorting families."
      ],
      "example": "A master mechanic choosing tools: a socket wrench for standard bolts (Quick Sort), a torque wrench when precision matters (Merge Sort), and an automated sorter for sorting thousands of identical screws (Counting Sort).",
      "code": "interface SortAlgorithmInfo {\n  name: string;\n  best: string;\n  avg: string;\n  worst: string;\n  space: string;\n  stable: boolean;\n}\n\nconst sortingTaxonomy: SortAlgorithmInfo[] = [\n  { name: 'QuickSort', best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N^2)', space: 'O(log N)', stable: false },\n  { name: 'MergeSort', best: 'O(N log N)', avg: 'O(N log N)', worst: 'O(N log N)', space: 'O(N)', stable: true },\n  { name: 'CountingSort', best: 'O(N+K)', avg: 'O(N+K)', worst: 'O(N+K)', space: 'O(K)', stable: true },\n  { name: 'RadixSort', best: 'O(D*N)', avg: 'O(D*N)', worst: 'O(D*N)', space: 'O(N+B)', stable: true }\n];\n\nfor (const s of sortingTaxonomy) {\n  console.log(`${s.name.padEnd(14)}: Avg=${s.avg.padEnd(10)} Worst=${s.worst.padEnd(10)} Stable=${s.stable}`);\n}",
      "output": "QuickSort     : Avg=O(N log N) Worst=O(N^2)     Stable=false\nMergeSort     : Avg=O(N log N) Worst=O(N log N) Stable=true\nCountingSort  : Avg=O(N+K)     Worst=O(N+K)     Stable=true\nRadixSort     : Avg=O(D*N)     Worst=O(D*N)     Stable=true",
      "codeNotes": [
        {
          "line": 10,
          "note": "Summarizes the fundamental asymptotic complexity and stability matrix across algorithm families."
        },
        {
          "line": 18,
          "note": "Demonstrates that non-comparison sorts trade key-type generality for linear O(N) speed."
        }
      ],
      "tryIt": "Verify that CountingSort and MergeSort are both stable, while QuickSort is unstable.",
      "check": {
        "question": "Which sorting algorithm provides guaranteed O(N log N) worst-case time while maintaining stability?",
        "options": [
          "Merge Sort",
          "Quick Sort",
          "Heap Sort"
        ],
        "answer": 0,
        "why": "Merge Sort is stable and guaranteed O(N log N) in all cases; Quick Sort can degrade to O(N^2) and is unstable; Heap Sort is unstable."
      }
    }
  ],
  "summary": [
    "Comparison sorting has a theoretical lower bound of Omega(N log N) derived from binary decision tree heights log2(N!).",
    "Counting Sort achieves linear O(N + K) time by tallying frequencies in an index array and reconstructing via prefix sums.",
    "Dutch National Flag sorts three distinct keys (0, 1, 2) in a single pass with O(1) auxiliary space.",
    "LSD Radix Sort processes numbers digit by digit using stable counting sort passes, scaling in O(D * N) time.",
    "Bucket Sort achieves O(N) average time for uniformly distributed floats by dividing inputs into localized buckets."
  ],
  "projectStep": {
    "title": "Non-Comparison Sorting Suite Implementation",
    "steps": [
      "Implement stable countingSort with prefix sum index mapping.",
      "Implement sortColors using Dijkstra's Dutch National Flag 3-pointer partition.",
      "Build LSD radixSort supporting arbitrary positive integer arrays."
    ]
  }
},
{
  "day": 15,
  "title": "⭐ MILESTONE 2: High-Throughput Stream Median Finder (Dual Binary Heaps)",
  "goal": "Milestone 2: Build a real-time data stream median tracker operating in O(log N) insertions and O(1) median lookups using balanced Min and Max Heaps.",
  "minutes": 25,
  "recap": "Welcome to Milestone 2! Today you will architect and engineer an enterprise-grade real-time stream median finder. By pairing a MaxHeap and a MinHeap, you will compute streaming medians in O(1) time.",
  "parts": [
    {
      "title": "Stream Median Problem & The Dual Heap Architecture",
      "say": [
        "In modern data streaming architectures, numerical observations arrive continuously at rates exceeding thousands of events per second.",
        "Calculating the median of a dynamic data stream is a foundational requirement for latency monitoring, anomaly detection, and fraud scoring.",
        "The median is the middle value in a sorted sequence, dividing the dataset into an equal lower half and upper half.",
        "A naive approach appends each incoming number to an array and sorts it on every insertion, costing O(N log N) per number and O(N^2 log N) overall.",
        "An insertion-sort approach uses binary search to find the insertion point, taking O(log N) search but O(N) array shifting time.",
        "The optimal production architecture uses two balanced binary heaps: a Max-Heap for the lower half and a Min-Heap for the upper half.",
        "The Max-Heap stores the smaller half of all numbers seen so far, with its root providing the maximum of the lower half in O(1) time.",
        "The Min-Heap stores the larger half of all numbers, with its root providing the minimum of the upper half in O(1) time.",
        "The stream median is simply the average of both heap roots (if total count is even) or the root of the larger heap (if count is odd)."
      ],
      "example": "A balanced seesaw with two teams: the lighter half sits on the left side with their heaviest member at the fulcrum, and the heavier half sits on the right with their lightest member at the fulcrum.",
      "code": "class MedianConceptPreview {\n  private lowerHalf = [1, 2, 3]; // Max-Heap conceptual root is 3\n  private upperHalf = [4, 5, 6]; // Min-Heap conceptual root is 4\n\n  getMedian(): number {\n    const maxLower = this.lowerHalf[this.lowerHalf.length - 1]; // 3\n    const minUpper = this.upperHalf[0];                         // 4\n    return (maxLower + minUpper) / 2;\n  }\n}\n\nconst preview = new MedianConceptPreview();\nconsole.log('Stream median of [1,2,3,4,5,6]:', preview.getMedian());",
      "output": "Stream median of [1,2,3,4,5,6]: 3.5",
      "codeNotes": [
        {
          "line": 6,
          "note": "Max-Heap root gives maximum of lower half in O(1) constant time."
        },
        {
          "line": 7,
          "note": "Min-Heap root gives minimum of upper half in O(1) constant time."
        },
        {
          "line": 8,
          "note": "When counts are equal (even dataset), median is the arithmetic mean of both roots."
        }
      ],
      "tryIt": "Add number 7 to upperHalf and verify that an odd-count median is simply the middle value.",
      "check": {
        "question": "Why does the Dual Heap architecture outperform an array-based insertion approach for streaming medians?",
        "options": [
          "Dual Heaps insert new elements in O(log N) time and query the median in O(1) time without O(N) array element shifting",
          "Heaps use less memory than arrays",
          "Arrays cannot store floating-point numbers"
        ],
        "answer": 0,
        "why": "Array insertion requires O(N) shifting of elements; binary heaps insert in O(log N) and inspect roots in O(1)."
      }
    },
    {
      "title": "Binary Heap Invariants & Sift Mechanics",
      "say": [
        "To build our Dual Heap engine, we must understand the fundamental invariants of array-backed binary heaps.",
        "A binary heap is a complete binary tree stored compactly inside a flat array without pointer objects.",
        "For any node at array index i, its parent resides at Math.floor((i - 1) / 2), its left child at 2i + 1, and right child at 2i + 2.",
        "In a Min-Heap, every parent node is less than or equal to its children: heap[parent] <= heap[child].",
        "In a Max-Heap, every parent node is greater than or equal to its children: heap[parent] >= heap[child].",
        "Insertion appends the new value to the end of the array and invokes siftUp(), bubbling the element upward until the heap invariant is restored.",
        "Extraction reads the root at index 0, moves the last array element to index 0, and invokes siftDown() to sink it to its correct level.",
        "Both siftUp() and siftDown() traverse at most the height of the tree, which is strictly bounded by ceil(log2(N)).",
        "Thus, insertion (push) and extraction (pop) both execute in guaranteed O(log N) logarithmic time."
      ],
      "example": "A corporate hierarchy: a new employee joins at the bottom and gets promoted upward (siftUp); when the CEO departs, a replacement is hoisted to the top and demoted downward to their natural level (siftDown).",
      "code": "class SimpleMinHeap {\n  private data: number[] = [];\n\n  push(val: number): void {\n    this.data.push(val);\n    let curr = this.data.length - 1;\n    while (curr > 0) {\n      const p = Math.floor((curr - 1) / 2);\n      if (this.data[p] <= this.data[curr]) break;\n      [this.data[p], this.data[curr]] = [this.data[curr], this.data[p]];\n      curr = p;\n    }\n  }\n\n  pop(): number | undefined {\n    if (this.data.length === 0) return undefined;\n    const top = this.data[0];\n    const last = this.data.pop()!;\n    if (this.data.length > 0) {\n      this.data[0] = last;\n      let curr = 0;\n      while (curr * 2 + 1 < this.data.length) {\n        let smallest = curr * 2 + 1;\n        const right = curr * 2 + 2;\n        if (right < this.data.length && this.data[right] < this.data[smallest]) smallest = right;\n        if (this.data[curr] <= this.data[smallest]) break;\n        [this.data[curr], this.data[smallest]] = [this.data[smallest], this.data[curr]];\n        curr = smallest;\n      }\n    }\n    return top;\n  }\n\n  peek(): number | undefined { return this.data[0]; }\n  size(): number { return this.data.length; }\n}\n\nconst h = new SimpleMinHeap();\nh.push(5); h.push(3); h.push(8); h.push(1);\nconsole.log('Min root:', h.peek());\nconsole.log('Popped:', h.pop());\nconsole.log('New min root:', h.peek());",
      "output": "Min root: 1\nPopped: 1\nNew min root: 3",
      "codeNotes": [
        {
          "line": 5,
          "note": "Appends element and sifts up by comparing against parent (curr - 1) / 2."
        },
        {
          "line": 15,
          "note": "Extracts root, swaps last element to index 0, and sifts down to restore heap invariant."
        }
      ],
      "tryIt": "Push numbers 10, 20, 2 and verify that pop() returns 2.",
      "check": {
        "question": "Why do binary heap operations (push and pop) run in O(log N) time?",
        "options": [
          "The tree is complete and balanced, so maximum height is log2(N); sifting traverses at most one path from root to leaf",
          "Because heaps sort all elements sequentially on every push",
          "Because binary heaps use JavaScript Map lookups"
        ],
        "answer": 0,
        "why": "A complete binary tree has height ceil(log2(N)); siftUp and siftDown only travel along a single vertical branch."
      }
    },
    {
      "title": "Dual Heap Balancing Invariant & Sizing Rules",
      "say": [
        "To guarantee that our heaps accurately reflect the median, we must enforce two strict structural invariants.",
        "Invariant 1 (Ordering): Every element in Max-Heap (lower half) must be less than or equal to every element in Min-Heap (upper half).",
        "Invariant 2 (Balancing): The size of Max-Heap must be either equal to Min-Heap, or exactly one element larger: 0 <= (maxHeap.size - minHeap.size) <= 1.",
        "When a new number arrives, we first determine which heap it belongs to by comparing it against the root of Max-Heap.",
        "If the number is less than or equal to maxHeap.peek(), it belongs in the lower half and is pushed into Max-Heap.",
        "Otherwise, it belongs in the upper half and is pushed into Min-Heap.",
        "After insertion, we inspect heap sizes: if Max-Heap has more than one extra element, we pop from Max-Heap and push into Min-Heap.",
        "If Min-Heap has more elements than Max-Heap, we pop from Min-Heap and push into Max-Heap.",
        "These rebalancing transfers take O(log N) time and guarantee that the median is always accessible at the roots in O(1) time."
      ],
      "example": "Two balanced water buckets on a balance beam: whenever one bucket gains more than one cup over the other, you pour one cup across to equalize the weight.",
      "code": "class DualHeapSizingSimulation {\n  maxHeapSize = 0;\n  minHeapSize = 0;\n\n  recordBalance(): string {\n    const diff = this.maxHeapSize - this.minHeapSize;\n    const isValid = diff === 0 || diff === 1;\n    return `MaxHeap=${this.maxHeapSize}, MinHeap=${this.minHeapSize}, diff=${diff}, valid=${isValid}`;\n  }\n}\n\nconst sim = new DualHeapSizingSimulation();\nsim.maxHeapSize = 3; sim.minHeapSize = 3;\nconsole.log('Even state:', sim.recordBalance());\nsim.maxHeapSize = 4; sim.minHeapSize = 3;\nconsole.log('Odd state (maxHeap has +1):', sim.recordBalance());\nsim.maxHeapSize = 5; sim.minHeapSize = 3;\nconsole.log('Invalid state (needs rebalance):', sim.recordBalance());",
      "output": "Even state: MaxHeap=3, MinHeap=3, diff=0, valid=true\nOdd state (maxHeap has +1): MaxHeap=4, MinHeap=3, diff=1, valid=true\nInvalid state (needs rebalance): MaxHeap=5, MinHeap=3, diff=2, valid=false",
      "codeNotes": [
        {
          "line": 6,
          "note": "Enforces invariant: maxHeap size may only exceed minHeap by at most 1 element."
        },
        {
          "line": 17,
          "note": "When difference reaches 2, one element must be transferred to restore equilibrium."
        }
      ],
      "tryIt": "Simulate a transfer by setting maxHeapSize to 4 and minHeapSize to 4, verifying validity.",
      "check": {
        "question": "What is the maximum allowed size difference between Max-Heap and Min-Heap in the Dual Heap algorithm?",
        "options": [
          "Max-Heap may have at most 1 more element than Min-Heap; Min-Heap may never have more elements than Max-Heap",
          "The size difference can be up to N / 2 elements",
          "Both heaps must always have the exact same size at all times"
        ],
        "answer": 0,
        "why": "By convention, Max-Heap holds the extra odd element, restricting size difference strictly to 0 (even) or 1 (odd)."
      }
    },
    {
      "title": "O(1) Instant Median Query Mechanics",
      "say": [
        "With both heap invariants strictly maintained, calculating the median becomes an instantaneous O(1) constant-time operation.",
        "We first inspect the total count of elements across both heaps: total = maxHeap.size + minHeap.size.",
        "If total is an odd number, Invariant 2 guarantees that Max-Heap contains the single extra middle element.",
        "Therefore, for odd datasets, the median is exactly maxHeap.peek(), retrieved in O(1) time without any arithmetic.",
        "If total is an even number, both heaps contain the exact same number of elements.",
        "The median is the arithmetic mean of the two middle elements: (maxHeap.peek() + minHeap.peek()) / 2.",
        "Retrieving the root of both heaps takes O(1) time, and floating-point division takes O(1) time, preserving O(1) query complexity.",
        "This architectural separation of concerns—O(log N) writes to maintain invariants, and O(1) reads for instant querying—is the hallmark of high-throughput design.",
        "Financial trading algorithms rely on this exact pattern to compute rolling tick price medians during market volatility spikes."
      ],
      "example": "A judge finding the median test score in a class: the teacher hands over the top paper from the lower-scoring stack and the bottom paper from the higher-scoring stack.",
      "code": "function computeMedianFromRoots(maxRoot: number, minRoot: number, isEven: boolean): number {\n  if (!isEven) return maxRoot;\n  return (maxRoot + minRoot) / 2;\n}\n\nconsole.log('Odd count (maxRoot=10):', computeMedianFromRoots(10, 15, false));\nconsole.log('Even count (maxRoot=10, minRoot=20):', computeMedianFromRoots(10, 20, true));\nconsole.log('Even count equal roots (5, 5):', computeMedianFromRoots(5, 5, true));",
      "output": "Odd count (maxRoot=10): 10\nEven count (maxRoot=10, minRoot=20): 15\nEven count equal roots (5, 5): 5",
      "codeNotes": [
        {
          "line": 2,
          "note": "For odd counts, Max-Heap holds the solitary middle element."
        },
        {
          "line": 3,
          "note": "For even counts, median is the average of the lower-half max and upper-half min."
        }
      ],
      "tryIt": "Pass maxRoot=7, minRoot=8 with isEven=true and verify the returned median is 7.5.",
      "check": {
        "question": "What is the time complexity of querying the median in a balanced Dual Heap system?",
        "options": [
          "O(1) constant time because the median elements are always stored at the roots of the two heaps",
          "O(log N) time to rebalance the tree",
          "O(N) time to scan the heap array"
        ],
        "answer": 0,
        "why": "Peeking at array index 0 in both heaps takes O(1) time; computing the average takes O(1) time."
      }
    },
    {
      "title": "Generic Comparator Binary Heap Implementation",
      "say": [
        "In production TypeScript applications, writing separate classes for MinHeap and MaxHeap creates redundant, duplicate code.",
        "A cleaner architectural solution is a generic BinaryHeap<T> class that accepts a custom comparator function: (a, b) => number.",
        "For a Min-Heap, the comparator returns a negative number when a < b: (a, b) => a - b.",
        "For a Max-Heap, the comparator reverses the subtraction: (a, b) => b - a.",
        "The internal siftUp and siftDown methods use this comparator to evaluate ordering, unifying both heap types under a single implementation.",
        "This generic heap supports numbers, strings, composite objects, and prioritized job tickets with equal fidelity.",
        "Defensive bounds checking ensures that peek() and pop() on an empty heap return undefined without throwing unhandled exceptions.",
        "The underlying dynamic array resizes automatically as new elements arrive, providing amortized O(1) storage growth.",
        "This generic comparator heap is the primary reusable building block we will use across all future graph and priority queue milestones."
      ],
      "example": "A multi-purpose sorting hopper: by flipping a switch from 'Ascending' to 'Descending', the exact same mechanical gears sort heaviest-first or lightest-first.",
      "code": "class Heap<T> {\n  private data: T[] = [];\n  constructor(private compare: (a: T, b: T) => number) {}\n\n  push(val: T): void {\n    this.data.push(val);\n    let curr = this.data.length - 1;\n    while (curr > 0) {\n      const p = Math.floor((curr - 1) / 2);\n      if (this.compare(this.data[p], this.data[curr]) <= 0) break;\n      [this.data[p], this.data[curr]] = [this.data[curr], this.data[p]];\n      curr = p;\n    }\n  }\n\n  pop(): T | undefined {\n    if (this.data.length === 0) return undefined;\n    const top = this.data[0];\n    const last = this.data.pop()!;\n    if (this.data.length > 0) {\n      this.data[0] = last;\n      let curr = 0;\n      while (curr * 2 + 1 < this.data.length) {\n        let best = curr * 2 + 1;\n        const right = curr * 2 + 2;\n        if (right < this.data.length && this.compare(this.data[right], this.data[best]) < 0) best = right;\n        if (this.compare(this.data[curr], this.data[best]) <= 0) break;\n        [this.data[curr], this.data[best]] = [this.data[best], this.data[curr]];\n        curr = best;\n      }\n    }\n    return top;\n  }\n\n  peek(): T | undefined { return this.data[0]; }\n  size(): number { return this.data.length; }\n}\n\nconst minHeap = new Heap<number>((a, b) => a - b);\nconst maxHeap = new Heap<number>((a, b) => b - a);\n\n[5, 2, 8, 1].forEach(x => { minHeap.push(x); maxHeap.push(x); });\nconsole.log('MinHeap root:', minHeap.peek());\nconsole.log('MaxHeap root:', maxHeap.peek());",
      "output": "MinHeap root: 1\nMaxHeap root: 8",
      "codeNotes": [
        {
          "line": 3,
          "note": "Constructor accepts custom comparator; (a, b) => a - b yields MinHeap, (a, b) => b - a yields MaxHeap."
        },
        {
          "line": 39,
          "note": "Instantiates both heap variants cleanly from the exact same generic class."
        }
      ],
      "tryIt": "Push 10 to both heaps and verify maxHeap root updates to 10 while minHeap root stays 1.",
      "check": {
        "question": "How does a single generic Heap class implement both Min-Heap and Max-Heap behavior?",
        "options": [
          "By accepting a comparator function (a, b) => number that defines priority ordering during siftUp and siftDown",
          "By maintaining two separate internal arrays",
          "By sorting the array in reverse order"
        ],
        "answer": 0,
        "why": "Inverting the comparator from (a - b) to (b - a) reverses the parent-child ordering check across all heap methods."
      }
    },
    {
      "title": "Full Milestone 2 Production Stream Median Engine",
      "say": [
        "We now assemble our complete production-grade Stream Median Finder for Milestone 2.",
        "Our engine instantiates a private Max-Heap for the lower half and a Min-Heap for the upper half using our generic Heap class.",
        "The addNum(num) method places incoming numbers into the appropriate heap and triggers automatic rebalancing in O(log N) time.",
        "The findMedian() method inspects heap sizes and returns either maxHeap.peek() or the average of both roots in O(1) time.",
        "Auxiliary space complexity is strictly bounded by O(N) total elements stored across both flat array buffers.",
        "We verify our engine against edge cases: inserting into an empty stream, handling duplicate numbers, negative values, and alternating extremes.",
        "Under sustained streaming loads, this architecture delivers sub-millisecond median calculations with predictable, zero-jitter latency.",
        "Congratulations on completing Milestone 2: you have engineered an essential high-throughput data structure used across modern financial and telemetry systems.",
        "This dual-heap balancing technique forms the foundation for sliding window quantiles, order-book depth matching, and streaming percentiles."
      ],
      "example": "A real-time telemetry dashboard monitoring server response latency: as millions of API request durations pour in, the dashboard displays the exact live median response time without pausing or lagging.",
      "code": "class Heap<T> {\n  private data: T[] = [];\n  constructor(private compare: (a: T, b: T) => number) {}\n  push(val: T): void {\n    this.data.push(val);\n    let curr = this.data.length - 1;\n    while (curr > 0) {\n      const p = Math.floor((curr - 1) / 2);\n      if (this.compare(this.data[p], this.data[curr]) <= 0) break;\n      [this.data[p], this.data[curr]] = [this.data[curr], this.data[p]];\n      curr = p;\n    }\n  }\n  pop(): T | undefined {\n    if (this.data.length === 0) return undefined;\n    const top = this.data[0];\n    const last = this.data.pop()!;\n    if (this.data.length > 0) {\n      this.data[0] = last;\n      let curr = 0;\n      while (curr * 2 + 1 < this.data.length) {\n        let best = curr * 2 + 1;\n        const right = curr * 2 + 2;\n        if (right < this.data.length && this.compare(this.data[right], this.data[best]) < 0) best = right;\n        if (this.compare(this.data[curr], this.data[best]) <= 0) break;\n        [this.data[curr], this.data[best]] = [this.data[best], this.data[curr]];\n        curr = best;\n      }\n    }\n    return top;\n  }\n  peek(): T | undefined { return this.data[0]; }\n  size(): number { return this.data.length; }\n}\n\nclass MedianFinder {\n  private maxHeap = new Heap<number>((a, b) => b - a); // Lower half\n  private minHeap = new Heap<number>((a, b) => a - b); // Upper half\n\n  addNum(num: number): void {\n    if (this.maxHeap.size() === 0 || num <= this.maxHeap.peek()!) {\n      this.maxHeap.push(num);\n    } else {\n      this.minHeap.push(num);\n    }\n\n    // Rebalance sizes\n    if (this.maxHeap.size() > this.minHeap.size() + 1) {\n      this.minHeap.push(this.maxHeap.pop()!);\n    } else if (this.minHeap.size() > this.maxHeap.size()) {\n      this.maxHeap.push(this.minHeap.pop()!);\n    }\n  }\n\n  findMedian(): number {\n    if (this.maxHeap.size() > this.minHeap.size()) {\n      return this.maxHeap.peek()!;\n    }\n    return (this.maxHeap.peek()! + this.minHeap.peek()!) / 2;\n  }\n}\n\nconst mf = new MedianFinder();\nmf.addNum(1);\nconsole.log('After [1] median:', mf.findMedian());\nmf.addNum(2);\nconsole.log('After [1, 2] median:', mf.findMedian());\nmf.addNum(3);\nconsole.log('After [1, 2, 3] median:', mf.findMedian());\nmf.addNum(100);\nconsole.log('After [1, 2, 3, 100] median:', mf.findMedian());",
      "output": "After [1] median: 1\nAfter [1, 2] median: 1.5\nAfter [1, 2, 3] median: 2\nAfter [1, 2, 3, 100] median: 2.5",
      "codeNotes": [
        {
          "line": 43,
          "note": "Routes new number to lower half (maxHeap) or upper half (minHeap) based on current lower root."
        },
        {
          "line": 49,
          "note": "Rebalances sizes: maintains maxHeap.size == minHeap.size or maxHeap.size == minHeap.size + 1."
        },
        {
          "line": 58,
          "note": "Calculates median in O(1) time: odd returns maxHeap root, even returns average of both roots."
        }
      ],
      "tryIt": "Add numbers 0 and -5 to mf and observe the median dynamically adjusts correctly.",
      "check": {
        "question": "What are the time and auxiliary space complexities of class MedianFinder for addNum() and findMedian()?",
        "options": [
          "O(log N) for addNum, O(1) for findMedian, O(N) auxiliary space",
          "O(1) for addNum, O(N log N) for findMedian, O(N^2) space",
          "O(N) for addNum, O(1) for findMedian, O(1) space"
        ],
        "answer": 0,
        "why": "Heap insertion and rebalancing take O(log N) time; median lookup accesses array index 0 in O(1) time; memory is O(N) for all elements."
      }
    }
  ],
  "summary": [
    "Stream median tracking requires dynamic partitioning: naive sorting takes O(N^2 log N), while Dual Heaps achieve O(N log N).",
    "Max-Heap holds the smaller half of numbers; Min-Heap holds the larger half.",
    "Invariant 1: All elements in Max-Heap <= all elements in Min-Heap.",
    "Invariant 2: Size difference is maintained at 0 <= (maxHeap.size - minHeap.size) <= 1 via O(log N) rebalancing.",
    "findMedian() operates in strict O(1) time by querying heap roots: maxRoot (odd) or (maxRoot + minRoot) / 2 (even)."
  ],
  "projectStep": {
    "title": "High-Throughput Stream Median Engine Implementation",
    "steps": [
      "Implement a generic Heap<T> class with comparator-driven siftUp and siftDown.",
      "Implement addNum with automatic partition routing and size rebalancing.",
      "Implement findMedian achieving instant O(1) median retrieval."
    ]
  }
}
,
{
  "day": 16,
  "title": "Binary Trees: Preorder, Inorder, Postorder & Level-Order BFS",
  "goal": "Master hierarchical data structures by implementing recursive tree traversals and iterative breadth-first exploration techniques.",
  "minutes": 25,
  "recap": "We've tackled linear structures like Linked Lists and Arrays. Trees introduce a non-linear hierarchy, enabling powerful divides, branching logic, and rapid multi-path processing strategies.",
  "parts": [
    {
      "title": "Understanding Tree Node Anatomy",
      "say": [
        "Welcome to Day sixteen! Today, we transition from linear data structures to non-linear hierarchical structures called Trees, starting specifically with Binary Trees.",
        "A binary tree consists of nodes where each node contains a value and at most two children, typically referred to as the left child and right child.",
        "The node without a parent is the 'root', and nodes without any children are called 'leaves' or terminal nodes.",
        "We implement tree nodes as objects with properties for the value, a pointer to the left node, and a pointer to the right node.",
        "In TypeScript, this translates nicely to a class or a robust interface, allowing recursive type definitions for children.",
        "Because binary trees branch downwards, they form the foundation for decision trees, hierarchical file systems, and efficient search algorithms.",
        "Understanding how to construct a basic binary tree manually is essential before moving to complex traversal operations.",
        "We can string these nodes together by assigning newly instantiated tree nodes directly to the left or right properties of existing parent nodes.",
        "Let's look at how we define the structural blueprint for a tree node and then manually build a tiny tree with three nodes."
      ],
      "example": "Here is how you define a foundational tree node structure and wire up a simple parent-to-children relationship.",
      "code": "class TreeNode {\n  val: number;\n  left: TreeNode | null;\n  right: TreeNode | null;\n  constructor(val: number, left: TreeNode | null = null, right: TreeNode | null = null) {\n    this.val = val;\n    this.left = left;\n    this.right = right;\n  }\n}\nconst root = new TreeNode(10);\nroot.left = new TreeNode(5);\nroot.right = new TreeNode(20);\nconsole.log(root.val, root.left.val, root.right.val);",
      "output": "10 5 20",
      "codeNotes": [
        {
          "line": 1,
          "note": "We define the TreeNode class serving as our building block."
        },
        {
          "line": 3,
          "note": "left and right properties can hold another TreeNode or be null."
        }
      ],
      "tryIt": "Try creating a root node with value 1, and giving it a left child with value 2 and a right child with value 3.",
      "check": {
        "question": "What defines a binary tree node?",
        "options": [
          "A node that has exactly two parents.",
          "A node that holds an array of infinite children.",
          "A node containing a value and references to at most two children."
        ],
        "answer": 2,
        "why": "A binary tree node specifically has a value and up to two child pointers, commonly called left and right, hence the term 'binary' meaning two."
      }
    },
    {
      "title": "Preorder Depth-First Traversal",
      "say": [
        "Traversal is the process of visiting all nodes in a tree, and one major category is Depth-First Search (DFS), which dives deep before going wide.",
        "Preorder traversal is a flavor of DFS where we visit the current node first, then recursively traverse its left subtree, and finally its right subtree.",
        "The word 'pre' indicates that the root or parent node is processed 'before' any of its children.",
        "This traversal strategy is incredibly useful for creating an exact duplicate of a tree, as you read the parent first, create it, and then attach children.",
        "Because it processes parent nodes before their sub-hierarchies, preorder is heavily used in serialization—saving the tree structure to a string or file.",
        "When implemented recursively, preorder is remarkably elegant, relying on the Call Stack to keep track of where to return after a deep dive.",
        "The base case for all tree recursive algorithms is checking if the current node is null; if it is, we simply return.",
        "If it is not null, we execute our logic, make a recursive call for the left child, and then a recursive call for the right child.",
        "Let's write a function that performs a preorder traversal and collects the values into an array to observe the exact visitation order."
      ],
      "example": "In preorder, we log or collect the current node's value immediately upon visiting it, prior to exploring children.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction preorder(node: TreeNode | null, result: number[] = []): number[] {\n  if (!node) return result;\n  result.push(node.val); // Process Root\n  preorder(node.left, result); // Traverse Left\n  preorder(node.right, result); // Traverse Right\n  return result;\n}\nconst root = new TreeNode(1);\nroot.left = new TreeNode(2);\nroot.left.left = new TreeNode(4);\nroot.right = new TreeNode(3);\nconsole.log(preorder(root));",
      "output": "[ 1, 2, 4, 3 ]",
      "codeNotes": [
        {
          "line": 7,
          "note": "Node is processed (pushed) before recursive calls."
        },
        {
          "line": 8,
          "note": "We fully explore the left side before touching the right."
        }
      ],
      "tryIt": "Modify the tree by adding a right child to node 2, then run preorder traversal to see how the order shifts.",
      "check": {
        "question": "In what exact sequence does Preorder Traversal process a tree node and its subtrees?",
        "options": [
          "Left child, Right child, Root node.",
          "Root node, Left subtree, Right subtree.",
          "Left subtree, Root node, Right subtree."
        ],
        "answer": 1,
        "why": "Preorder processes the Root first (pre), followed by the entire Left subtree, and finally the Right subtree."
      }
    },
    {
      "title": "Inorder Depth-First Traversal",
      "say": [
        "Moving on to the next depth-first approach, we have Inorder Traversal, which visits the left subtree, then the root, and then the right subtree.",
        "The word 'in' signifies that the parent node is processed 'in between' its left and right subtrees.",
        "This specific ordering sequence is extremely significant when dealing with Binary Search Trees, which we will cover tomorrow.",
        "For a standard binary search tree, performing an inorder traversal will miraculously visit all nodes in perfectly sorted ascending order.",
        "The recursive implementation looks nearly identical to preorder, except the line where we process or log the node value is moved.",
        "We first recursively drill down the left pointer until we hit a null leaf, at which point the recursion bounces back.",
        "Upon bouncing back to a parent, we finally process its value, and then we initiate the recursive drill down into its right subtree.",
        "This middle-processing logic ensures that all nodes to the left of any parent are always processed before the parent itself.",
        "Let's rewrite our traversal function to process nodes inorder and observe how the output sequence changes completely."
      ],
      "example": "Inorder defers processing the current node until its entire left subtree has been fully traversed.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction inorder(node: TreeNode | null, result: number[] = []): number[] {\n  if (!node) return result;\n  inorder(node.left, result); // Traverse Left\n  result.push(node.val);      // Process Root\n  inorder(node.right, result); // Traverse Right\n  return result;\n}\nconst root = new TreeNode(1);\nroot.left = new TreeNode(2);\nroot.left.left = new TreeNode(4);\nroot.right = new TreeNode(3);\nconsole.log(inorder(root));",
      "output": "[ 4, 2, 1, 3 ]",
      "codeNotes": [
        {
          "line": 7,
          "note": "We recurse all the way left before doing anything."
        },
        {
          "line": 8,
          "note": "The root processing happens squarely in the middle."
        }
      ],
      "tryIt": "Trace the execution carefully in your head. Why does 4 appear first in the result array?",
      "check": {
        "question": "Why is Inorder Traversal particularly famous in the context of Binary Search Trees?",
        "options": [
          "It finds the shortest path between the root and a leaf.",
          "It yields the values in non-decreasing, sorted order.",
          "It is the only traversal that doesn't use recursion."
        ],
        "answer": 1,
        "why": "In a BST, all left children are smaller and right children are larger. Inorder visits left, root, right, naturally producing a sorted sequence."
      }
    },
    {
      "title": "Postorder Depth-First Traversal",
      "say": [
        "The final variant of our standard depth-first search trio is Postorder Traversal, completing the logical combinations.",
        "In postorder traversal, we recursively process the left subtree, then recursively process the right subtree, and only then visit the root node.",
        "The prefix 'post' signals that the current node is dealt with 'after' all of its descendants have been thoroughly processed.",
        "This traversal is uniquely suited for tasks where a parent cannot act until it has gathered information from its children.",
        "Common use cases include safely deleting a tree from memory, where you must delete children before deleting the parent holding their references.",
        "It is also heavily used in math expression parsing trees, evaluating the child operands before applying the parent operator.",
        "As expected, the recursive function simply shifts the processing step to the very bottom, after both the left and right recursive calls.",
        "By doing this, the root node of the entire tree is guaranteed to be the very last element processed in the traversal.",
        "Let's assemble a postorder function to round out our understanding of depth-first search sequencing."
      ],
      "example": "Postorder pushes the parent node to the result array only after the left and right subtrees have returned.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction postorder(node: TreeNode | null, result: number[] = []): number[] {\n  if (!node) return result;\n  postorder(node.left, result);  // Traverse Left\n  postorder(node.right, result); // Traverse Right\n  result.push(node.val);         // Process Root\n  return result;\n}\nconst root = new TreeNode(1);\nroot.left = new TreeNode(2);\nroot.left.left = new TreeNode(4);\nroot.right = new TreeNode(3);\nconsole.log(postorder(root));",
      "output": "[ 4, 2, 3, 1 ]",
      "codeNotes": [
        {
          "line": 7,
          "note": "Recursive call to left child completes fully."
        },
        {
          "line": 8,
          "note": "Recursive call to right child completes fully."
        },
        {
          "line": 9,
          "note": "Finally, the parent node is pushed to the result array."
        }
      ],
      "tryIt": "Notice how the root node '1' is the absolute last element. Try adding more children to see how this rule holds true.",
      "check": {
        "question": "Which scenario is a perfect use case for a Postorder Traversal?",
        "options": [
          "Finding the maximum depth by counting top-down.",
          "Deleting a directory structure where contents must be removed before the folder.",
          "Flattening a tree into a linear linked list."
        ],
        "answer": 1,
        "why": "Because postorder processes children completely before parents, it perfectly models bottom-up tasks like recursive deletion."
      }
    },
    {
      "title": "Breadth-First Level-Order Traversal",
      "say": [
        "While Depth-First Search explores a tree vertically, Breadth-First Search (BFS) explores it horizontally, layer by layer.",
        "Level-order traversal is the quintessential BFS algorithm for trees, visiting the root, then all nodes at depth 1, then all nodes at depth 2.",
        "Unlike depth-first search which beautifully leverages the implicit call stack via recursion, BFS requires an explicit Queue data structure.",
        "We begin by enqueuing the root node. Then, while the queue is not empty, we dequeue a node, process it, and enqueue its left and right children.",
        "Because a queue operates on a First-In-First-Out (FIFO) basis, nodes discovered earlier at shallower levels are naturally processed before deeper nodes.",
        "Level-order traversal is extremely practical; it is the algorithm you use when searching for the absolute shortest path to a destination.",
        "By expanding outward evenly, BFS guarantees that the first time you encounter a target node, you've found the shortest route to it.",
        "In JavaScript, we often simulate a queue using an array's push and shift methods, though a proper linked-list queue is more performant for massive trees.",
        "Let's trace out a level-order traversal using an array-based queue and observe the layer-by-layer visitation pattern."
      ],
      "example": "Breadth-First Search utilizes a Queue to process nodes in the exact order they are discovered, guaranteeing level-by-layer processing.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction levelOrder(root: TreeNode | null): number[] {\n  if (!root) return [];\n  const result: number[] = [];\n  const queue: TreeNode[] = [root]; // Initialize queue with root\n  \n  while (queue.length > 0) {\n    const current = queue.shift()!; // Dequeue first element\n    result.push(current.val);\n    if (current.left) queue.push(current.left); // Enqueue left\n    if (current.right) queue.push(current.right); // Enqueue right\n  }\n  return result;\n}\nconst root = new TreeNode(1);\nroot.left = new TreeNode(2); root.right = new TreeNode(3);\nroot.left.left = new TreeNode(4); root.right.right = new TreeNode(5);\nconsole.log(levelOrder(root));",
      "output": "[ 1, 2, 3, 4, 5 ]",
      "codeNotes": [
        {
          "line": 9,
          "note": "We seed our queue with the top-level root node."
        },
        {
          "line": 12,
          "note": "queue.shift() acts as our dequeue, pulling the oldest item."
        },
        {
          "line": 14,
          "note": "We push children to the back of the queue to be processed later."
        }
      ],
      "tryIt": "Change queue.shift() to queue.pop(). How does this instantly change the behavior from BFS to a variant of DFS?",
      "check": {
        "question": "What underlying data structure is essential for implementing Breadth-First Level-Order traversal?",
        "options": [
          "A Last-In-First-Out Stack.",
          "A First-In-First-Out Queue.",
          "A priority-based Hash Map."
        ],
        "answer": 1,
        "why": "A FIFO Queue ensures that nodes added first (higher levels) are processed before nodes added later (lower levels)."
      }
    },
    {
      "title": "Comparing Tree Traversal Strategies",
      "say": [
        "Now that we have covered the primary traversal techniques, it is critical to know when to apply which strategy.",
        "Preorder (DFS) is your go-to for copying or serializing a tree, as you capture parents before their sub-hierarchies.",
        "Inorder (DFS) is intrinsically linked to Binary Search Trees, utilized whenever you need sequential, sorted data extraction.",
        "Postorder (DFS) shines when execution depends on child resolution, such as evaluating mathematical expression trees or garbage collection.",
        "Level-order (BFS) is the undisputed champion for finding the shortest path or evaluating relational proximity layer by layer.",
        "From a space complexity perspective, DFS requires stack space proportional to the maximum height of the tree (O(H)).",
        "Conversely, BFS requires queue space proportional to the maximum width of the tree, which can be up to half the total nodes (O(W)).",
        "For a deeply unbalanced tree, DFS uses high memory. For a perfectly balanced, bushy tree, BFS uses significantly more memory.",
        "Let's look at a small snippet that measures the maximum depth of a tree, combining traversal logic with a simple counter."
      ],
      "example": "Finding the maximum depth is a classic DFS recursive problem, measuring the longest path from root to leaf.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction maxDepth(node: TreeNode | null): number {\n  if (!node) return 0; // Base case: empty tree has 0 depth\n  \n  const leftDepth = maxDepth(node.left);\n  const rightDepth = maxDepth(node.right);\n  \n  // The depth is 1 (for the current node) plus the deeper of the subtrees\n  return Math.max(leftDepth, rightDepth) + 1;\n}\n\nconst root = new TreeNode(1);\nroot.left = new TreeNode(2);\nroot.left.left = new TreeNode(4);\nconsole.log(maxDepth(root));",
      "output": "3",
      "codeNotes": [
        {
          "line": 6,
          "note": "Hitting a null node returns a depth of 0, anchoring the recursion."
        },
        {
          "line": 12,
          "note": "We use Math.max to aggressively select the longest downward path."
        }
      ],
      "tryIt": "Try creating a lopsided tree with 5 nodes strictly on the right side. The max depth should correctly report 5.",
      "check": {
        "question": "If a tree is exceptionally wide but very shallow, which traversal will likely use more memory?",
        "options": [
          "Depth-First Search (DFS).",
          "Breadth-First Search (BFS).",
          "Both will use exactly the same memory."
        ],
        "answer": 1,
        "why": "BFS memory scales with tree width (the queue holds an entire layer). A wide tree causes the queue to grow massive, while DFS stack stays small."
      }
    }
  ],
  "summary": [
    "Binary trees consist of nodes holding a value and up to two children.",
    "Preorder DFS processes the root before diving into left and right subtrees.",
    "Inorder DFS processes the left, then the root, generating sorted output for BSTs.",
    "Postorder DFS processes children completely before visiting the root node.",
    "BFS Level-Order traversal uses a Queue to process nodes layer by layer."
  ],
  "projectStep": {
    "title": "Tree Serialization Utility",
    "steps": [
      "Implement a serialization function using preorder traversal to convert a binary tree to a comma-separated string.",
      "Use a specific marker like 'N' for null children to preserve structure.",
      "Write a deserialization function that rebuilds the exact tree structure from your serialized string."
    ]
  }
},
{
  "day": 17,
  "title": "Binary Search Trees (BST): Tree Invariants & Range Query Search",
  "goal": "Understand the strict invariants of Binary Search Trees to achieve fast logarithmic lookups, insertions, and structured validations.",
  "minutes": 25,
  "recap": "Yesterday we learned tree traversals. Today, we enforce a strict sorting rule upon binary trees, magically transforming O(N) linear searches into blistering O(log N) operations.",
  "parts": [
    {
      "title": "The Binary Search Tree Invariant",
      "say": [
        "Welcome to Day seventeen! Today we introduce a powerful rule into our standard binary trees: The Binary Search Tree invariant.",
        "A Binary Search Tree (BST) is a binary tree where every single node enforces a strict structural ordering property.",
        "For any given node, all values in its entire left subtree must be strictly less than the node's value.",
        "Simultaneously, all values in its entire right subtree must be strictly greater than the node's value.",
        "This is not just for direct children; it applies recursively to all descendants down the line.",
        "Because of this rigid sorted structure, searching for a value mimics the binary search algorithm we use on sorted arrays.",
        "At every step, you compare your target with the current node, eliminating half the remaining tree with a single decision.",
        "This halving effect guarantees logarithmic O(log N) time complexity for search, insertion, and deletion on average.",
        "Let's look at a basic insertion algorithm to see how this invariant dictates where new nodes are placed."
      ],
      "example": "When inserting a value, we traverse left if it's smaller, or right if it's larger, stopping when we hit a null spot.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction insertBST(root: TreeNode | null, val: number): TreeNode {\n  if (!root) return new TreeNode(val);\n  if (val < root.val) {\n    root.left = insertBST(root.left, val);\n  } else if (val > root.val) {\n    root.right = insertBST(root.right, val);\n  }\n  return root; // Return unchanged node pointer\n}\nlet bst = insertBST(null, 10);\nbst = insertBST(bst, 5);\nbst = insertBST(bst, 15);\nconsole.log(bst.val, bst.left?.val, bst.right?.val);",
      "output": "10 5 15",
      "codeNotes": [
        {
          "line": 6,
          "note": "If the subtree is null, we found the perfect spot for our new node."
        },
        {
          "line": 8,
          "note": "We attach the result of the recursive call back to the left/right pointer."
        }
      ],
      "tryIt": "Add a duplicate value like 10. Depending on the exact logic, what happens? Our implementation currently ignores duplicates.",
      "check": {
        "question": "What is the core structural invariant of a Binary Search Tree?",
        "options": [
          "Left child < Root, and Right child > Root, recursively for all descendants.",
          "The tree must be perfectly balanced at all times.",
          "All leaf nodes must be at the exact same depth."
        ],
        "answer": 0,
        "why": "The BST property strictly mandates that left descendants are smaller and right descendants are larger than the root."
      }
    },
    {
      "title": "Fast Logarithmic Search in BST",
      "say": [
        "The primary motivation for maintaining a BST is rapid lookup speeds; finding an element is remarkably fast.",
        "Searching a BST operates almost exactly like a binary search on a sorted array, discarding half the problem space.",
        "Starting at the root, if your target is smaller, you exclusively search the left subtree, completely ignoring the right.",
        "If your target is larger, you exclusively search the right subtree, completely ignoring the left.",
        "If you encounter a null pointer during this descent, you know definitively that the target value does not exist.",
        "Because you move down exactly one level per comparison, the time taken is proportional to the tree's height.",
        "In a balanced tree, the height is log(N), resulting in O(log N) search times, massively outperforming linear structures.",
        "However, if a tree becomes extremely lopsided (e.g., essentially a linked list), the search degrades to O(N).",
        "Let's write a simple iterative search function that navigates down a BST to locate a specific value."
      ],
      "example": "An iterative search is memory efficient, using a simple while loop to traverse down the correct branches.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction searchBST(root: TreeNode | null, val: number): boolean {\n  let current = root;\n  while (current !== null) {\n    if (current.val === val) return true; // Found it!\n    if (val < current.val) {\n      current = current.left; // Go left\n    } else {\n      current = current.right; // Go right\n    }\n  }\n  return false; // Reached a leaf, not found\n}\nconst root = new TreeNode(8);\nroot.left = new TreeNode(3); root.right = new TreeNode(10);\nconsole.log(searchBST(root, 3), searchBST(root, 7));",
      "output": "true false",
      "codeNotes": [
        {
          "line": 7,
          "note": "We loop as long as our current pointer is pointing to an actual node."
        },
        {
          "line": 10,
          "note": "We reassign current to aggressively narrow our search path."
        }
      ],
      "tryIt": "Rewrite this iterative while-loop search as a recursive function. How does the parameter passing change?",
      "check": {
        "question": "Why is an unbalanced, linear BST problematic for searching?",
        "options": [
          "It forces the search algorithm to crash with a stack overflow.",
          "The height becomes N, so the search time degrades from O(log N) to O(N).",
          "It makes the left and right pointers permanently null."
        ],
        "answer": 1,
        "why": "In a straight-line unbalanced tree, you don't eliminate half the nodes per step; you eliminate only one, making it an O(N) linear search."
      }
    },
    {
      "title": "Validating a Binary Search Tree",
      "say": [
        "A common technical challenge is determining if a given binary tree is a valid Binary Search Tree.",
        "A naive approach checks if left < root < right for every single node in isolation, but this is dangerously flawed.",
        "The BST invariant requires that ALL nodes in the left subtree, even deep descendants, are less than the root.",
        "To solve this correctly, we must enforce a strict (min, max) bounding range that narrows as we descend the tree.",
        "When moving left, the current node's value becomes the new strict maximum for that entire left subtree.",
        "When moving right, the current node's value becomes the new strict minimum for that entire right subtree.",
        "If any node we visit falls outside its recursively passed boundaries, the tree immediately fails validation.",
        "We can represent infinity as our initial unbounded limits at the root node to kick off the recursive process.",
        "Let's code this bounding technique to properly and safely validate a potentially flawed binary search tree."
      ],
      "example": "We utilize recursive helper parameters to pass down tightening minimum and maximum bounds to child nodes.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction isValidBST(node: TreeNode | null, min = -Infinity, max = Infinity): boolean {\n  if (!node) return true; // Null subtrees are valid\n  \n  if (node.val <= min || node.val >= max) return false; // Boundary violation\n  \n  // Left branch gets a new max boundary; Right gets a new min boundary\n  return isValidBST(node.left, min, node.val) && \n         isValidBST(node.right, node.val, max);\n}\n\nconst badTree = new TreeNode(5);\nbadTree.left = new TreeNode(4); \nbadTree.right = new TreeNode(6);\nbadTree.left.right = new TreeNode(10); // 10 is > 5, invalid for left subtree!\nconsole.log(isValidBST(badTree));",
      "output": "false",
      "codeNotes": [
        {
          "line": 8,
          "note": "We check if the node violates the inherited strict numeric boundaries."
        },
        {
          "line": 11,
          "note": "Both the left and right sides must recursively return true."
        }
      ],
      "tryIt": "Remove the errant badTree.left.right node and verify that isValidBST correctly returns true.",
      "check": {
        "question": "Why does checking just the immediate left and right children fail to validate a BST?",
        "options": [
          "It's too slow and uses too much memory.",
          "A deep node might be valid locally, but violate a grandparent's constraint.",
          "It forces the algorithm to use a Breadth-First approach."
        ],
        "answer": 1,
        "why": "A right child of a left subtree might be larger than its immediate parent (locally valid) but larger than the root (globally invalid)."
      }
    },
    {
      "title": "Inorder Traversal and Sorted Data",
      "say": [
        "As hinted in our previous lesson, Inorder Traversal shares a magical synergy with Binary Search Trees.",
        "Because an inorder traversal processes the left subtree, then the root, then the right subtree, it respects the invariant.",
        "If you run an inorder traversal on any valid BST and collect the values, the resulting array will be perfectly sorted.",
        "This property provides an incredibly elegant alternative way to validate a BST: flatten it and check if the array is sorted.",
        "Furthermore, this traversal gives us a straightforward algorithm for finding the K-th smallest element in a tree.",
        "Instead of storing all elements, you can perform an inorder traversal and maintain a counter.",
        "The moment your counter hits 'K', the current node you are visiting is unequivocally the K-th smallest element.",
        "This highlights why understanding tree traversals alongside structural invariants is vital for algorithmic problem-solving.",
        "Let's demonstrate using inorder traversal to extract the neatly sorted elements from a populated BST."
      ],
      "example": "Inorder traversal naturally flattens a hierarchical BST into a sequentially sorted linear array.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction extractSorted(root: TreeNode | null, out: number[] = []): number[] {\n  if (!root) return out;\n  extractSorted(root.left, out);\n  out.push(root.val); // Root goes right between left and right\n  extractSorted(root.right, out);\n  return out;\n}\n\nconst root = new TreeNode(15);\nroot.left = new TreeNode(10); root.right = new TreeNode(20);\nroot.left.left = new TreeNode(8); root.left.right = new TreeNode(12);\nconsole.log(extractSorted(root));",
      "output": "[ 8, 10, 12, 15, 20 ]",
      "codeNotes": [
        {
          "line": 8,
          "note": "Because of BST rules, 'left' is strictly smaller than 'root'."
        },
        {
          "line": 9,
          "note": "And 'right' is strictly larger. Thus, pushing in this order guarantees sorted output."
        }
      ],
      "tryIt": "Implement a function that finds the 2nd smallest element by stopping the traversal once you push the second item.",
      "check": {
        "question": "If you perform a reverse inorder traversal (Right, Root, Left) on a BST, what is the outcome?",
        "options": [
          "An array of elements in random, unsorted order.",
          "An array of elements sorted in strictly descending order.",
          "The traversal will fail and throw an exception."
        ],
        "answer": 1,
        "why": "Visiting the larger right branch first, then the root, then the smaller left branch naturally yields a descending sorted sequence."
      }
    },
    {
      "title": "Lowest Common Ancestor in a BST",
      "say": [
        "Finding the Lowest Common Ancestor (LCA) of two nodes is a classic algorithmic interview question.",
        "The LCA is the deepest node in the tree that has both target nodes as descendants (where a node can be a descendant of itself).",
        "In a standard binary tree, finding the LCA requires complex, bottom-up postorder traversal to bubble up matching nodes.",
        "However, in a Binary Search Tree, we can dramatically simplify this using the BST invariant.",
        "Starting from the root, if both target values are strictly smaller than the root, the LCA must reside in the left subtree.",
        "If both target values are strictly larger than the root, the LCA must reside in the right subtree.",
        "If one value is smaller and the other is larger, a 'split' has occurred, meaning the current node is precisely the LCA.",
        "This top-down traversal avoids deep recursion and can be written iteratively with excellent performance.",
        "Let's examine how to use the BST properties to pinpoint the lowest common ancestor without excessive backtracking."
      ],
      "example": "We traverse down the tree, utilizing the node values to steer towards the first splitting point.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction lowestCommonAncestor(root: TreeNode | null, p: number, q: number): TreeNode | null {\n  let curr = root;\n  while (curr !== null) {\n    if (p < curr.val && q < curr.val) {\n      curr = curr.left; // Both are smaller, go left\n    } else if (p > curr.val && q > curr.val) {\n      curr = curr.right; // Both are larger, go right\n    } else {\n      return curr; // Split occurred! This is the LCA.\n    }\n  }\n  return null;\n}\nconst root = new TreeNode(20);\nroot.left = new TreeNode(10); root.right = new TreeNode(30);\nroot.left.left = new TreeNode(5); root.left.right = new TreeNode(15);\nconsole.log(lowestCommonAncestor(root, 5, 15)?.val);",
      "output": "10",
      "codeNotes": [
        {
          "line": 8,
          "note": "If both p and q are less than current, the LCA cannot be current or anything to the right."
        },
        {
          "line": 12,
          "note": "A split means one node is on the left and one on the right, making current the LCA."
        }
      ],
      "tryIt": "Test finding the LCA of 5 and 10. The correct answer should be 10, because a node can be its own ancestor.",
      "check": {
        "question": "What identifies the Lowest Common Ancestor node during a top-down search in a BST?",
        "options": [
          "It is the node where both target values are found simultaneously.",
          "It is the first node whose value is strictly between the two target values.",
          "It is the node that has exactly two non-null children."
        ],
        "answer": 1,
        "why": "When the current node's value falls between p and q, it marks the exact point where their paths diverge, making it the lowest common ancestor."
      }
    },
    {
      "title": "Deletion in a Binary Search Tree",
      "say": [
        "Deleting a node in a BST is notoriously tricky because we must perfectly preserve the BST invariant afterwards.",
        "There are three primary cases we must handle when deleting a node once we have located it.",
        "Case 1: The node is a leaf (no children). This is trivial; we simply detach it from its parent by setting the pointer to null.",
        "Case 2: The node has exactly one child. This is also simple; we bypass the deleted node by linking its parent directly to its single child.",
        "Case 3: The node has two children. This is complex because we cannot simply bypass it without losing structural integrity.",
        "To solve Case 3, we find the node's 'inorder successor'—the smallest value in its right subtree.",
        "We copy the successor's value into the node we wish to delete, overwriting it without altering tree topology.",
        "Finally, we recursively delete the original successor node from the right subtree, which falls cleanly into Case 1 or 2.",
        "Let's look at a conceptual implementation of deleting a node that handles these delicate topological adjustments."
      ],
      "example": "Deletion requires careful pointer manipulation and a helper algorithm to find the inorder successor when a node has two children.",
      "code": "class TreeNode {\n  val: number; left: TreeNode | null; right: TreeNode | null;\n  constructor(val: number) { this.val = val; this.left = this.right = null; }\n}\nfunction deleteNode(root: TreeNode | null, key: number): TreeNode | null {\n  if (!root) return null;\n  if (key < root.val) root.left = deleteNode(root.left, key);\n  else if (key > root.val) root.right = deleteNode(root.right, key);\n  else {\n    if (!root.left) return root.right; // Case 1 & 2\n    if (!root.right) return root.left; // Case 2\n    \n    // Case 3: Two children\n    let minNode = root.right;\n    while (minNode.left) minNode = minNode.left; // Find inorder successor\n    root.val = minNode.val; // Replace value\n    root.right = deleteNode(root.right, root.val); // Delete the successor\n  }\n  return root;\n}\nconst root = new TreeNode(5);\nroot.left = new TreeNode(3); root.right = new TreeNode(8);\nconst updated = deleteNode(root, 5);\nconsole.log(updated?.val, updated?.right?.val);",
      "output": "8 undefined",
      "codeNotes": [
        {
          "line": 10,
          "note": "If no left child, we simply bridge the parent directly to the right child."
        },
        {
          "line": 15,
          "note": "We hunt for the absolute minimum value in the right subtree."
        },
        {
          "line": 17,
          "note": "We recursively trigger deletion for the successor node."
        }
      ],
      "tryIt": "Why do we pick the minimum of the right subtree instead of the maximum of the left subtree? Actually, both are valid options!",
      "check": {
        "question": "When deleting a BST node with two children, how do we choose a replacement value?",
        "options": [
          "We pick the maximum value in the entire tree.",
          "We pick the minimum value in the node's right subtree (Inorder Successor).",
          "We randomly select one of its immediate children."
        ],
        "answer": 1,
        "why": "The minimum value in the right subtree is strictly larger than everything in the left subtree, preserving the BST rules upon replacement."
      }
    }
  ],
  "summary": [
    "A BST strictly orders nodes: left descendants are smaller, right are larger.",
    "Search algorithms run in O(log N) time by halving the search space at each step.",
    "Validation requires passing recursive (min, max) boundaries down the tree.",
    "Inorder traversals output elements in ascending sorted order perfectly.",
    "Lowest Common Ancestor leverages the BST split property to avoid full traversals."
  ],
  "projectStep": {
    "title": "Interactive Dictionary implementation",
    "steps": [
      "Create a BST where nodes hold string words instead of numbers.",
      "Implement an insert method that uses alphabetical string comparison.",
      "Write a search function to quickly determine if a word exists in your dictionary."
    ]
  }
},
{
  "day": 18,
  "title": "Min/Max Binary Heaps & Priority Queues",
  "goal": "Understand how Heaps maintain strict priority ordering using arrays, enabling fast top-element extraction for algorithms like Dijkstra.",
  "minutes": 25,
  "recap": "We've explored strict left-right ordering in BSTs. Heaps use a different invariant—top-down strictness—to prioritize elements globally without fully sorting them.",
  "parts": [
    {
      "title": "The Heap Property and Complete Trees",
      "say": [
        "Welcome to Day eighteen! Today we focus on a special kind of tree called a Binary Heap, the engine behind Priority Queues.",
        "A Heap is fundamentally a binary tree that satisfies two strict properties: a structural property and an ordering property.",
        "Structurally, a Heap must be a 'Complete Binary Tree', meaning every level is fully populated except possibly the last, which is filled left-to-right.",
        "Ordering-wise, a Min-Heap dictates that every parent node must be smaller than or equal to both of its children.",
        "Conversely, a Max-Heap dictates that every parent node must be strictly larger than or equal to both of its children.",
        "Crucially, unlike a BST, there is absolutely no ordering rule enforced between the left and right siblings in a Heap.",
        "This weakened invariant means Heaps do not allow fast searching for arbitrary elements, but they guarantee O(1) access to the minimum (or maximum) element.",
        "Because the tree is perfectly Complete, we can elegantly map it to a flat one-dimensional array without needing actual pointer objects.",
        "Let's explore the math that allows us to navigate parent-child relationships purely through array indices."
      ],
      "example": "In a flat array representing a Complete Tree, parent and child nodes can be calculated using simple index arithmetic.",
      "code": "function getRelations(index: number) {\n  const leftChild = 2 * index + 1;\n  const rightChild = 2 * index + 2;\n  const parent = Math.floor((index - 1) / 2);\n  return { leftChild, rightChild, parent };\n}\n\nconsole.log(\"Root (0) children:\", getRelations(0).leftChild, getRelations(0).rightChild);\nconsole.log(\"Node (2) parent:\", getRelations(2).parent);\nconsole.log(\"Node (5) parent:\", getRelations(5).parent);",
      "output": "Root (0) children: 1 2\nNode (2) parent: 0\nNode (5) parent: 2",
      "codeNotes": [
        {
          "line": 2,
          "note": "The left child of node 'i' is exactly at index 2i + 1."
        },
        {
          "line": 4,
          "note": "The parent index is found by subtracting 1 and integer dividing by 2."
        }
      ],
      "tryIt": "Calculate the parent of index 7 on paper. It should evaluate to 3, validating the math works deep in the array.",
      "check": {
        "question": "Which of the following describes the fundamental structural property of a Binary Heap?",
        "options": [
          "All leaves must be on the right side of the tree.",
          "It must be a Complete Binary Tree, filled level by level from left to right.",
          "Every node must have exactly two or zero children."
        ],
        "answer": 1,
        "why": "A Complete Binary Tree structure is required so that the heap can be densely packed into an array without empty gaps."
      }
    },
    {
      "title": "Insertion and Sift-Up",
      "say": [
        "When adding a new element to a Heap, we must ensure both the structural property and the ordering property are maintained.",
        "To satisfy the structural property, we always append the new element to the very end of our underlying array.",
        "This guarantees the tree remains a Complete Binary Tree, but the new element might violate the heap ordering.",
        "To restore order, we perform a process known as 'Sift-Up', 'Bubble-Up', or 'Heapify-Up'.",
        "We compare the newly added element with its parent. If it violates the invariant (e.g., smaller than parent in a Min-Heap), we swap them.",
        "We continue swapping the element up the tree, level by level, until it is larger than its parent or it becomes the new root.",
        "Because a complete binary tree has a height of strictly log(N), this bubbling process takes at most O(log N) time.",
        "This keeps insertions extremely fast and predictable regardless of how massive the heap becomes.",
        "Let's write a MinHeap class and implement the insertion and sift-up mechanics."
      ],
      "example": "Inserting pushes to the end of the array, and a while-loop aggressively swaps the element upwards to restore the Min-Heap rule.",
      "code": "class MinHeap {\n  heap: number[] = [];\n  \n  insert(val: number) {\n    this.heap.push(val);\n    this.siftUp(this.heap.length - 1);\n  }\n  \n  private siftUp(index: number) {\n    let curr = index;\n    while (curr > 0) {\n      let parent = Math.floor((curr - 1) / 2);\n      if (this.heap[parent] <= this.heap[curr]) break; // Invariant satisfied\n      \n      // Swap elements\n      [this.heap[parent], this.heap[curr]] = [this.heap[curr], this.heap[parent]];\n      curr = parent; // Move pointer up\n    }\n  }\n}\nconst h = new MinHeap();\nh.insert(10); h.insert(5); h.insert(2);\nconsole.log(h.heap);",
      "output": "[ 2, 10, 5 ]",
      "codeNotes": [
        {
          "line": 5,
          "note": "We append to the array to strictly maintain the Complete Binary Tree shape."
        },
        {
          "line": 13,
          "note": "If the parent is already smaller, the Min-Heap invariant is solid, so we stop."
        },
        {
          "line": 16,
          "note": "Array destructuring handles the swap cleanly without temporary variables."
        }
      ],
      "tryIt": "Insert 1 into the heap and trace the sift-up steps. It will swap with 10, then swap with 2, becoming the new root.",
      "check": {
        "question": "During insertion, why do we initially place the new element at the very end of the array?",
        "options": [
          "To immediately satisfy the Heap Ordering invariant.",
          "To strictly preserve the Complete Binary Tree structural property.",
          "Because pushing to an array is O(1), and we don't care about structure."
        ],
        "answer": 1,
        "why": "We push to the end so the tree fills perfectly level-by-level, ensuring we never have gaps or null pointers in our array."
      }
    },
    {
      "title": "Extraction and Sift-Down",
      "say": [
        "The most powerful operation of a Priority Queue is extraction: removing the highest-priority element (the root).",
        "Removing the root from our array leaves a gaping hole at index 0, shattering the Complete Binary Tree structure.",
        "To repair the structure, we pop the absolute last element from the array and transplant it into the root position.",
        "This fixes the shape, but this transplant is usually a large value that violently breaks the heap ordering invariant.",
        "We fix this via 'Sift-Down' or 'Heapify-Down', allowing the heavy element to sink down the tree to its proper place.",
        "We compare the node to both of its children and swap it with the smaller of the two (for a Min-Heap).",
        "Swapping with the smaller child is critical; it ensures the new parent remains smaller than both children after the swap.",
        "We repeat this sinking process until the node is smaller than its children or it hits the bottom (a leaf).",
        "Let's implement the pop method and the critical sift-down repair cycle."
      ],
      "example": "Extraction removes the root, moves the last leaf to the top, and carefully sinks it down by swapping with the smaller child.",
      "code": "class MinHeap {\n  heap: number[] = [];\n  insert(val: number) { this.heap.push(val); this.siftUp(this.heap.length - 1); }\n  private siftUp(i: number) { /* Omitted for brevity */ }\n  \n  pop(): number | undefined {\n    if (this.heap.length === 0) return undefined;\n    if (this.heap.length === 1) return this.heap.pop();\n    \n    const min = this.heap[0];\n    this.heap[0] = this.heap.pop()!; // Move last to top\n    this.siftDown(0);\n    return min;\n  }\n  \n  private siftDown(i: number) {\n    let curr = i;\n    while (2 * curr + 1 < this.heap.length) {\n      let left = 2 * curr + 1, right = 2 * curr + 2;\n      let smallest = (right < this.heap.length && this.heap[right] < this.heap[left]) ? right : left;\n      \n      if (this.heap[curr] <= this.heap[smallest]) break;\n      [this.heap[curr], this.heap[smallest]] = [this.heap[smallest], this.heap[curr]];\n      curr = smallest;\n    }\n  }\n}\nconst h = new MinHeap();\nh.heap = [2, 10, 5]; // Pretend we inserted these properly\nconsole.log(h.pop(), h.heap);",
      "output": "2 [ 5, 10 ]",
      "codeNotes": [
        {
          "line": 11,
          "note": "We extract the root and replace it with the popped last element in one swift move."
        },
        {
          "line": 20,
          "note": "We calculate which child is strictly smaller to avoid violating rules on the next level."
        },
        {
          "line": 22,
          "note": "If we are already smaller than our smallest child, the sinking is complete."
        }
      ],
      "tryIt": "Consider what happens if we swap with the LARGER child in a Min-Heap. The invariant would break instantly!",
      "check": {
        "question": "When sinking a node down a Min-Heap, why must we always swap it with the smaller of its two children?",
        "options": [
          "Because swapping with the larger child would make the larger child a parent of the smaller child, breaking Min-Heap rules.",
          "It actually doesn't matter; either child is mathematically fine.",
          "Because the left child is always inherently smaller than the right child."
        ],
        "answer": 0,
        "why": "The new parent must be smaller than both children. If you swap with the larger child, the larger child becomes the parent of the smaller one, violating the invariant."
      }
    },
    {
      "title": "Building a Heap via Heapify",
      "say": [
        "Often, we receive an unsorted array of data and need to transform it into a valid Heap structure.",
        "The naive approach is to create an empty heap and call insert() for each element, resulting in an O(N log N) time complexity.",
        "However, there is an elegant algorithm called Floyd's 'Heapify' that does this in place in strict O(N) time.",
        "The trick is to work backwards. Leaf nodes technically already satisfy the heap property because they have no children.",
        "We start at the last non-leaf node (which is the parent of the absolute last element) and call sift-down.",
        "We walk backwards through the array, calling sift-down on every single node until we reach the root at index 0.",
        "By doing this bottom-up, we guarantee that when we sift down a node, its subtrees are already perfectly valid heaps.",
        "This subtle mathematical optimization is a massive win when dealing with huge datasets needing immediate prioritization.",
        "Let's write a function that performs an in-place O(N) heapify on an arbitrary unsorted array."
      ],
      "example": "Floyd's Heapify works backward from the middle of the array, systematically sinking elements into valid sub-heaps.",
      "code": "function heapify(arr: number[]) {\n  // Start from the last non-leaf node\n  let startIdx = Math.floor((arr.length / 2) - 1);\n  \n  for (let i = startIdx; i >= 0; i--) {\n    siftDown(arr, i);\n  }\n  return arr;\n}\n\nfunction siftDown(arr: number[], i: number) {\n  let curr = i;\n  while (2 * curr + 1 < arr.length) {\n    let left = 2 * curr + 1, right = 2 * curr + 2;\n    let smallest = (right < arr.length && arr[right] < arr[left]) ? right : left;\n    if (arr[curr] <= arr[smallest]) break;\n    [arr[curr], arr[smallest]] = [arr[smallest], arr[curr]];\n    curr = smallest;\n  }\n}\n\nconsole.log(heapify([9, 6, 2, 4, 8, 7]));",
      "output": "[ 2, 4, 7, 6, 8, 9 ]",
      "codeNotes": [
        {
          "line": 3,
          "note": "Math.floor(length/2 - 1) precisely pinpoints the parent of the last array element."
        },
        {
          "line": 5,
          "note": "We iterate backwards to index 0, sinking each parent down."
        }
      ],
      "tryIt": "Notice how the output array isn't fully sorted sequentially? It just obeys the top-down heap rules!",
      "check": {
        "question": "Why does the Floyd Heapify algorithm start at the middle of the array and work backward?",
        "options": [
          "The first half of the array contains the leaf nodes.",
          "The second half of the array are leaves, which are already valid heaps, so we start at the last parent.",
          "Working forward would cause an infinite loop."
        ],
        "answer": 1,
        "why": "Half of a complete binary tree consists of leaves. Skipping them and working bottom-up ensures children are valid heaps before parents are processed."
      }
    },
    {
      "title": "Priority Queues in Action",
      "say": [
        "A Heap is the underlying structural implementation, but the abstract data type it powers is the Priority Queue.",
        "In a standard Queue, elements are processed First-In-First-Out. In a Priority Queue, elements are processed strictly by Priority.",
        "We can easily extend our Heap to handle objects instead of raw numbers by passing a custom comparator function.",
        "For example, a hospital emergency room triages patients based on injury severity, not strictly arrival time.",
        "Or, in algorithms like Dijkstra's Shortest Path, we constantly need to extract the next closest unvisited intersection.",
        "By modifying our sift logic to compare object properties (like a 'priority' field), we bridge the gap between theory and practical utility.",
        "JavaScript lacks a built-in Priority Queue, making this one of the most critical structures to know how to implement from scratch.",
        "Without it, you would have to sort an array every single time you inserted an item, severely degrading performance.",
        "Let's see a miniaturized version of a Priority Queue managing a list of tasks with varying urgency."
      ],
      "example": "By comparing a specific property (like 'priority') during sifting operations, Heaps manage complex objects effortlessly.",
      "code": "class TaskPQ {\n  heap: { task: string, priority: number }[] = [];\n  \n  push(task: string, priority: number) {\n    this.heap.push({ task, priority });\n    this.siftUp(this.heap.length - 1);\n  }\n  \n  pop() {\n    if (!this.heap.length) return null;\n    if (this.heap.length === 1) return this.heap.pop();\n    const min = this.heap[0];\n    this.heap[0] = this.heap.pop()!;\n    this.siftDown(0);\n    return min;\n  }\n  \n  private siftUp(i: number) {\n    let curr = i;\n    while (curr > 0) {\n      let p = Math.floor((curr - 1) / 2);\n      if (this.heap[p].priority <= this.heap[curr].priority) break;\n      [this.heap[p], this.heap[curr]] = [this.heap[curr], this.heap[p]];\n      curr = p;\n    }\n  }\n  \n  private siftDown(i: number) {\n    let curr = i;\n    while (2 * curr + 1 < this.heap.length) {\n      let l = 2 * curr + 1, r = 2 * curr + 2;\n      let s = (r < this.heap.length && this.heap[r].priority < this.heap[l].priority) ? r : l;\n      if (this.heap[curr].priority <= this.heap[s].priority) break;\n      [this.heap[curr], this.heap[s]] = [this.heap[s], this.heap[curr]];\n      curr = s;\n    }\n  }\n}\nconst pq = new TaskPQ();\npq.push(\"Write code\", 5); pq.push(\"Fix prod crash\", 1); pq.push(\"Get coffee\", 10);\nconsole.log(pq.pop()?.task);",
      "output": "Fix prod crash",
      "codeNotes": [
        {
          "line": 21,
          "note": "We specifically compare the 'priority' property to decide the structural ordering."
        },
        {
          "line": 43,
          "note": "The task with priority 1 (the lowest number, highest urgency) bubbles to the root instantly."
        }
      ],
      "tryIt": "Pop a second time. It will correctly output 'Write code' as the next highest priority.",
      "check": {
        "question": "Why is an array with sort() insufficient for a highly active Priority Queue?",
        "options": [
          "Arrays cannot store objects with priority fields.",
          "Sorting the array on every insertion takes O(N log N) time, while heap insertion takes O(log N).",
          "Array sort() only works on strings."
        ],
        "answer": 1,
        "why": "Calling sort() repeatedly on an array is computationally heavy. Heaps naturally maintain the top element dynamically with logarithmically cheap operations."
      }
    },
    {
      "title": "Heap Sort: Utilizing the Heap",
      "say": [
        "We can leverage the properties of a heap to create a remarkably efficient sorting algorithm known as Heap Sort.",
        "The logic is quite elegant: if you heapify an array into a Min-Heap, the absolute smallest element sits at index 0.",
        "If you repeatedly pop the root from the heap, you extract the elements in perfectly ascending, sorted order.",
        "To accomplish this entirely in-place without needing a second array, we actually build a Max-Heap instead.",
        "We extract the maximum element and swap it to the end of the array, logically shrinking the 'heap size' by one.",
        "We then sift down the new root to repair the remaining heap, and repeat until the heap size reaches zero.",
        "This continuous extraction leaves behind a beautifully sorted array in O(N log N) time with zero extra space.",
        "It lacks the worst-case O(N^2) degradation of Quick Sort, making it highly reliable for massive datasets.",
        "Let's examine a simplified implementation demonstrating the core extraction loop of Heap Sort."
      ],
      "example": "Heap Sort rapidly extracts the top element and places it in a growing sorted section at the back of the array.",
      "code": "function heapSort(arr: number[]) {\n  // 1. Build a Max-Heap (in-place)\n  for (let i = Math.floor(arr.length / 2 - 1); i >= 0; i--) {\n    siftDownMax(arr, arr.length, i);\n  }\n  \n  // 2. Extract elements one by one\n  for (let i = arr.length - 1; i > 0; i--) {\n    // Swap max (root) with the end element\n    [arr[0], arr[i]] = [arr[i], arr[0]];\n    // Sift down the new root, but pretend the array is shorter (size i)\n    siftDownMax(arr, i, 0);\n  }\n  return arr;\n}\n\nfunction siftDownMax(arr: number[], size: number, i: number) {\n  let curr = i;\n  while (2 * curr + 1 < size) {\n    let left = 2 * curr + 1, right = 2 * curr + 2;\n    let largest = (right < size && arr[right] > arr[left]) ? right : left;\n    if (arr[curr] >= arr[largest]) break;\n    [arr[curr], arr[largest]] = [arr[largest], arr[curr]];\n    curr = largest;\n  }\n}\n\nconsole.log(heapSort([4, 10, 3, 5, 1]));",
      "output": "[ 1, 3, 4, 5, 10 ]",
      "codeNotes": [
        {
          "line": 9,
          "note": "We swap the root (largest element) to the back of the array."
        },
        {
          "line": 11,
          "note": "We call sift down with a decreasing 'size' boundary, protecting the sorted elements."
        }
      ],
      "tryIt": "Trace the array manually. After the first loop, 10 moves to the end. The next loop moves 5, and so on.",
      "check": {
        "question": "Why does an in-place ascending Heap Sort use a Max-Heap rather than a Min-Heap?",
        "options": [
          "Max-Heaps are faster to build.",
          "It allows swapping the maximum element to the end of the array, building the sorted result backward.",
          "Min-Heaps cannot hold negative numbers."
        ],
        "answer": 1,
        "why": "By using a Max-Heap, the largest item sits at index 0. Swapping it to the very end puts it exactly where it belongs in an ascending sorted array."
      }
    }
  ],
  "summary": [
    "A Binary Heap is a Complete Binary Tree packed efficiently into a flat array.",
    "Parent and child relationships are calculated using simple index arithmetic (2i+1, 2i+2).",
    "Insertion adds to the end and sifts up to restore ordering in O(log N) time.",
    "Extraction removes the root, replaces it with the last leaf, and sifts down.",
    "Priority Queues manage dynamic, urgency-based task processing using Heaps."
  ],
  "projectStep": {
    "title": "Dijkstra's Helper Queue",
    "steps": [
      "Implement a generic PriorityQueue class that accepts a custom comparator function on initialization.",
      "Ensure push and pop methods correctly pass elements through the comparator.",
      "Test it by queuing pathfinding nodes consisting of an X/Y coordinate and a strictly evaluated 'cost' distance."
    ]
  }
},
{
  "day": 19,
  "title": "Tries (Prefix Trees) & Fast Prefix Auto-Complete",
  "goal": "Learn to build and traverse Tries to rapidly search strings, validate dictionaries, and implement auto-complete engines.",
  "minutes": 25,
  "recap": "Binary Search Trees search by comparing entire values. Tries search by character sequence, drastically accelerating operations involving string prefixes.",
  "parts": [
    {
      "title": "The Anatomy of a Trie Node",
      "say": [
        "Welcome to Day nineteen! Today we investigate a highly specialized tree tailored explicitly for strings: the Trie.",
        "A Trie, often pronounced 'try' and derived from 'reTRIEval', is a multi-way tree representing character sequences.",
        "Unlike a binary tree where nodes have a left and right child, a Trie node typically has a Map or an array of children.",
        "Each branch from a parent to a child represents a single character in a string.",
        "Crucially, the nodes themselves usually do not store the character; the character is defined by the link from the parent.",
        "A Trie node also contains a boolean flag, often called 'isEnd' or 'isWord', to indicate the completion of a valid string.",
        "Because multiple words sharing the same prefix will traverse the exact same path, Tries are incredibly space-efficient for dictionaries.",
        "For instance, 'cat' and 'car' will share the 'c' and 'a' nodes before branching to 't' and 'r' respectively.",
        "Let's look at how to define a flexible TrieNode class utilizing a JavaScript Map for rapid character lookup."
      ],
      "example": "A TrieNode utilizes a Map to dynamically attach an arbitrary number of child nodes based on character keys.",
      "code": "class TrieNode {\n  children: Map<string, TrieNode>;\n  isEndOfWord: boolean;\n  \n  constructor() {\n    this.children = new Map();\n    this.isEndOfWord = false;\n  }\n}\n\nconst root = new TrieNode();\nroot.children.set('a', new TrieNode());\nconst aNode = root.children.get('a')!;\naNode.children.set('p', new TrieNode());\naNode.children.set('n', new TrieNode());\n\nconsole.log(\"Root has 'a'?\", root.children.has('a'));\nconsole.log(\"Node 'a' has 'p' & 'n'?\", aNode.children.has('p'), aNode.children.has('n'));",
      "output": "Root has 'a'? true\nNode 'a' has 'p' & 'n'? true true",
      "codeNotes": [
        {
          "line": 2,
          "note": "We use a Map where the string key is the character, and the value is the next node."
        },
        {
          "line": 3,
          "note": "The boolean flag distinguishes a full word from a mere prefix."
        }
      ],
      "tryIt": "Notice how the node doesn't store 'a'; the parent map links the key 'a' to the node. This is a subtle but vital concept.",
      "check": {
        "question": "In a Trie, how are the characters of a word represented?",
        "options": [
          "Each node contains an array of the full remaining string.",
          "The characters are implied by the mapped keys connecting parent nodes to child nodes.",
          "Every node stores a single character property directly on itself."
        ],
        "answer": 1,
        "why": "Characters are the structural edges (keys in the Map) connecting the nodes, rather than distinct properties stored directly inside the node object."
      }
    },
    {
      "title": "Inserting Words into a Trie",
      "say": [
        "Inserting a string into a Trie is an intuitive, iterative process, processing the word character by character.",
        "We initialize a pointer to our root node and begin iterating through the characters of our target string.",
        "For each character, we check if the current node's children Map already contains that specific character key.",
        "If the key is missing, we create a new TrieNode and insert it into the Map using the character as the key.",
        "We then strictly move our pointer to that child node, whether it was newly created or already existed.",
        "This iterative descent ensures we share as much prefix structure as possible with previously inserted words.",
        "When the loop finishes processing the final character of the word, we flip the 'isEndOfWord' flag on the final node.",
        "The time complexity is purely O(L), where L is the length of the word, regardless of how many millions of words exist.",
        "Let's write a complete insertion method that builds out the multi-branching tree structure."
      ],
      "example": "Insertion iterates through the word, forging a path of nodes, and stamps the final node as a valid word boundary.",
      "code": "class TrieNode {\n  children = new Map<string, TrieNode>();\n  isEndOfWord = false;\n}\nclass Trie {\n  root = new TrieNode();\n  \n  insert(word: string) {\n    let curr = this.root;\n    for (const char of word) {\n      if (!curr.children.has(char)) {\n        curr.children.set(char, new TrieNode()); // Create missing path\n      }\n      curr = curr.children.get(char)!; // Traverse downwards\n    }\n    curr.isEndOfWord = true; // Mark completion\n  }\n}\nconst trie = new Trie();\ntrie.insert(\"cat\");\ntrie.insert(\"car\");\nconsole.log(trie.root.children.get('c')?.children.get('a')?.children.has('t'));",
      "output": "true",
      "codeNotes": [
        {
          "line": 11,
          "note": "We lazily create nodes only if the prefix path doesn't already exist."
        },
        {
          "line": 16,
          "note": "The final node touched by the loop is marked true, officially finalizing the string insertion."
        }
      ],
      "tryIt": "If you insert 'cart', it will share 'c', 'a', 'r' with 'car', but branch off at 't'.",
      "check": {
        "question": "What dictates the time complexity of inserting a word into a Trie?",
        "options": [
          "The total number of words already inside the Trie.",
          "The length of the string being inserted (O(L)).",
          "The alphabetical ordering of the character set."
        ],
        "answer": 1,
        "why": "You perform exactly one Map lookup and pointer assignment per character in the word, completely ignoring the rest of the massive dictionary."
      }
    },
    {
      "title": "Searching for Exact Words",
      "say": [
        "Searching for an exact word match in a Trie is functionally identical to the insertion process without node creation.",
        "We start our pointer at the root and iterate through every character in our search query.",
        "At each step, we check if the current node's Map contains a key for the next character.",
        "If at any point the Map lacks the required character key, the path is broken, and we immediately return false.",
        "If the loop successfully traverses all characters without failing, our pointer rests on the final node of the path.",
        "However, simply reaching the end of the query string is not enough to confirm the word exists.",
        "We must strictly check if the final node's 'isEndOfWord' flag is set to true.",
        "For example, if we insert 'apple' and search for 'app', the path exists, but the 'p' node is not marked as a valid word.",
        "Let's write the search function and observe how it differentiates between valid words and mere substrings."
      ],
      "example": "An exact search strictly verifies that the path exists AND that the termination node is officially marked.",
      "code": "class TrieNode {\n  children = new Map<string, TrieNode>();\n  isEndOfWord = false;\n}\nclass Trie {\n  root = new TrieNode();\n  insert(word: string) {\n    let curr = this.root;\n    for (const char of word) {\n      if (!curr.children.has(char)) curr.children.set(char, new TrieNode());\n      curr = curr.children.get(char)!;\n    }\n    curr.isEndOfWord = true;\n  }\n  search(word: string): boolean {\n    let curr = this.root;\n    for (const char of word) {\n      if (!curr.children.has(char)) return false; // Path broken\n      curr = curr.children.get(char)!;\n    }\n    return curr.isEndOfWord; // Must be flagged as a complete word\n  }\n}\nconst trie = new Trie();\ntrie.insert(\"apple\");\nconsole.log(trie.search(\"apple\"), trie.search(\"app\"));",
      "output": "true false",
      "codeNotes": [
        {
          "line": 18,
          "note": "If we ask for a character branch that doesn't exist, the word absolutely is not in the Trie."
        },
        {
          "line": 21,
          "note": "Crucial check: 'app' survives the loop, but returns false because it lacks the isEndOfWord flag."
        }
      ],
      "tryIt": "Insert 'app' directly into the Trie, then re-run the search. The second output will switch to true.",
      "check": {
        "question": "Why must an exact search check the isEndOfWord flag instead of just returning true upon completing the loop?",
        "options": [
          "Because the loop might have skipped characters.",
          "Because the search query might just be a prefix of a longer, actual word in the dictionary.",
          "To ensure the search was performed in O(1) time."
        ],
        "answer": 1,
        "why": "A path might exist for 'bat', but if only 'batman' was inserted, 'bat' is merely a prefix, not a recognized dictionary word."
      }
    },
    {
      "title": "Searching for Prefixes",
      "say": [
        "While exact word searches are useful, the true dominance of a Trie lies in lightning-fast prefix validation.",
        "Checking if any word starts with a specific prefix is a core requirement for auto-complete and routing engines.",
        "The logic for prefix searching is almost entirely a clone of the exact search algorithm.",
        "We iterate through the prefix string character by character, following the mapped pathways downwards.",
        "If the path abruptly breaks, we return false; the prefix does not exist anywhere in our structure.",
        "If we successfully traverse the entire prefix string, we instantly return true without checking any flags.",
        "Because we only care if the pathway continues, it is irrelevant whether the current node represents a full word.",
        "This operation executes in O(P) time, where P is the length of the prefix, a speed unmatched by scanning arrays or hash sets.",
        "Let's implement a 'startsWith' method to demonstrate this powerful validation technique."
      ],
      "example": "Prefix searching traverses the path and happily returns true simply if the path exists, ignoring word boundaries.",
      "code": "class TrieNode {\n  children = new Map<string, TrieNode>();\n  isEndOfWord = false;\n}\nclass Trie {\n  root = new TrieNode();\n  insert(w: string) {\n    let c = this.root;\n    for (let ch of w) {\n      if (!c.children.has(ch)) c.children.set(ch, new TrieNode());\n      c = c.children.get(ch)!;\n    }\n    c.isEndOfWord = true;\n  }\n  startsWith(prefix: string): boolean {\n    let curr = this.root;\n    for (const char of prefix) {\n      if (!curr.children.has(char)) return false;\n      curr = curr.children.get(char)!;\n    }\n    return true; // Path exists, prefix is valid!\n  }\n}\nconst trie = new Trie();\ntrie.insert(\"developer\");\nconsole.log(trie.startsWith(\"dev\"), trie.startsWith(\"design\"));",
      "output": "true false",
      "codeNotes": [
        {
          "line": 18,
          "note": "The early exit failure logic remains identical to exact search."
        },
        {
          "line": 21,
          "note": "We completely ignore the isEndOfWord flag; mere existence of the path is sufficient."
        }
      ],
      "tryIt": "Try trie.startsWith('developer'). It returns true. Every valid word is technically a valid prefix of itself!",
      "check": {
        "question": "What makes startsWith functionally different from an exact word search?",
        "options": [
          "It uses a completely different looping mechanism.",
          "It ignores the isEndOfWord flag and returns true simply if the character path survives.",
          "It runs in O(1) time instead of O(L) time."
        ],
        "answer": 1,
        "why": "A prefix represents the beginning sequence. If you can walk the sequence without falling off the tree, the prefix exists."
      }
    },
    {
      "title": "Building an Auto-Complete Engine",
      "say": [
        "With prefix validation working, we can construct a robust auto-complete engine using Depth-First Search.",
        "When a user types a prefix, we first navigate to the Trie node representing the end of that prefix.",
        "If the node exists, every valid word located underneath it is a potential auto-complete suggestion.",
        "We can launch a recursive DFS from that specific node to aggressively discover all descendants marked with 'isEndOfWord'.",
        "As we traverse down branches, we append the mapped characters to our running string builder.",
        "When we encounter a node where 'isEndOfWord' is true, we push the fully formed string into our suggestions array.",
        "Because Tries inherently sort characters structurally, this DFS will naturally return suggestions in alphabetical order.",
        "This combination of prefix traversal followed by localized DFS forms the backbone of real-world search bars.",
        "Let's trace out a sophisticated function that retrieves a dynamic array of matching words based on user input."
      ],
      "example": "An auto-complete system finds the base node of a prefix, then unleashes a recursive DFS to harvest all valid descendants.",
      "code": "class TrieNode {\n  children = new Map<string, TrieNode>();\n  isEndOfWord = false;\n}\nclass Trie {\n  root = new TrieNode();\n  insert(w: string) {\n    let c = this.root;\n    for (let ch of w) {\n      if (!c.children.has(ch)) c.children.set(ch, new TrieNode());\n      c = c.children.get(ch)!;\n    }\n    c.isEndOfWord = true;\n  }\n  \n  autocomplete(prefix: string): string[] {\n    let curr = this.root;\n    for (const char of prefix) {\n      if (!curr.children.has(char)) return []; // Prefix not found\n      curr = curr.children.get(char)!;\n    }\n    \n    const results: string[] = [];\n    this.dfs(curr, prefix, results);\n    return results;\n  }\n  \n  private dfs(node: TrieNode, currentWord: string, results: string[]) {\n    if (node.isEndOfWord) results.push(currentWord);\n    \n    for (const [char, childNode] of node.children.entries()) {\n      this.dfs(childNode, currentWord + char, results);\n    }\n  }\n}\nconst trie = new Trie();\ntrie.insert(\"car\"); trie.insert(\"card\"); trie.insert(\"cat\"); trie.insert(\"dog\");\nconsole.log(trie.autocomplete(\"ca\"));",
      "output": "[ 'car', 'card', 'cat' ]",
      "codeNotes": [
        {
          "line": 20,
          "note": "We jump straight to the node representing 'ca' to begin our localized search."
        },
        {
          "line": 30,
          "note": "If the base node itself is a word (like 'car' inside 'card'), we collect it immediately."
        },
        {
          "line": 33,
          "note": "We recurse into every child branch, concatenating the new character onto our running word."
        }
      ],
      "tryIt": "Call trie.autocomplete('d'). It efficiently bypasses the entire 'c' branch and instantly returns ['dog'].",
      "check": {
        "question": "Why do we append the prefix characters before starting the DFS algorithm?",
        "options": [
          "Because DFS only knows how to search backward.",
          "Because the Trie nodes don't store characters, so we must reconstruct the word as we traverse downward.",
          "To confuse the user."
        ],
        "answer": 1,
        "why": "Characters exist as pathways, not localized properties. DFS must carry the accumulated string downwards to assemble the final result."
      }
    },
    {
      "title": "Space Efficiency and Trade-offs",
      "say": [
        "Tries are incredibly powerful, but we must acknowledge their specific trade-offs regarding memory consumption.",
        "In a Hash Set, storing thousands of long, distinct strings requires massive amounts of raw byte memory.",
        "A Trie mitigates this perfectly when strings share a large amount of prefix data, vastly compressing overlapping characters.",
        "However, if a dataset contains words with absolutely zero common prefixes, a Trie will perform poorly.",
        "In this worst-case scenario, every single character demands a brand new Map and node object, wasting extreme overhead memory.",
        "Furthermore, dynamically allocating thousands of tiny Map objects creates a fragmented memory profile, stressing the garbage collector.",
        "For extremely dense datasets like genomic sequencing, developers often use compressed Radix Trees to squash redundant linear branches.",
        "Despite this, for typical alphabetical dictionaries or IP routing tables, standard Tries remain the undefeated champion of prefix analysis.",
        "Let's write a small diagnostic function that recursively counts the total nodes in a Trie to visualize memory usage."
      ],
      "example": "By counting the sheer number of allocated nodes, we can see how shared prefixes drastically save object allocations.",
      "code": "class TrieNode {\n  children = new Map<string, TrieNode>();\n  isEndOfWord = false;\n}\nclass Trie {\n  root = new TrieNode();\n  insert(w: string) {\n    let c = this.root;\n    for (let ch of w) {\n      if (!c.children.has(ch)) c.children.set(ch, new TrieNode());\n      c = c.children.get(ch)!;\n    }\n  }\n  \n  countNodes(node: TrieNode = this.root): number {\n    let count = 1; // Count current node\n    for (const child of node.children.values()) {\n      count += this.countNodes(child);\n    }\n    return count;\n  }\n}\nconst trie = new Trie();\n// 'bat', 'bath', and 'batman' share massive overlap\ntrie.insert(\"bat\"); trie.insert(\"bath\"); trie.insert(\"batman\");\nconsole.log(\"Total Nodes:\", trie.countNodes());",
      "output": "Total Nodes: 8",
      "codeNotes": [
        {
          "line": 15,
          "note": "We initiate a recursive DFS solely to accumulate a node count."
        },
        {
          "line": 25,
          "note": "Three words spanning 13 total characters use only 8 nodes (including root), proving compression."
        }
      ],
      "tryIt": "Insert 'cat' (3 chars). Since it shares zero prefixes with 'bat', the count will cleanly jump by 3 to 10.",
      "check": {
        "question": "When does a Trie exhibit its worst-case memory inefficiency?",
        "options": [
          "When inserting identical duplicate words.",
          "When inserting words that share absolutely zero prefixes, forcing unique branches for every character.",
          "When searching for a word that doesn't exist."
        ],
        "answer": 1,
        "why": "Without shared prefixes, every word creates a long, isolated chain of objects, consuming far more overhead than a simple flat array."
      }
    }
  ],
  "summary": [
    "A Trie is a multi-way tree optimized for storing and retrieving string sequences.",
    "Nodes do not store characters directly; characters are defined by the mapped pathways.",
    "Insertion and exact searches run in blazing fast O(L) time, where L is string length.",
    "Prefix validation operates instantly by ensuring the structural path simply exists.",
    "Auto-complete engines combine prefix pathing with DFS to aggregate valid dictionary descendants."
  ],
  "projectStep": {
    "title": "Regex Helper Node",
    "steps": [
      "Add a wildcard search method to your Trie that accepts a '.' character representing 'any letter'.",
      "When evaluating a '.', implement a DFS that loops through and follows all valid children pathways recursively.",
      "Return true if any of the explored branching pathways successfully completes the remainder of the wildcard string."
    ]
  }
},
{
  "day": 20,
  "title": "Graph Representations (Adjacency List/Matrix) & BFS/DFS",
  "goal": "Model complex, multi-directional relational data using Graphs, and explore network topologies using generalized BFS and DFS.",
  "minutes": 25,
  "recap": "We've mastered constrained trees. Graphs remove these constraints, allowing cycles, multiple parents, and isolated islands, mimicking real-world complex networks.",
  "parts": [
    {
      "title": "Understanding Graph Terminology",
      "say": [
        "Welcome to Day twenty! Today we venture into Graphs, the ultimate, unrestricted data structure for modeling networks.",
        "A Graph fundamentally consists of two components: Vertices (or nodes) and Edges (the connections between them).",
        "Unlike trees, which enforce a strict top-down parent-to-child hierarchy, graphs can be wildly interconnected in any direction.",
        "Graphs can be 'Directed', meaning edges act like one-way streets, or 'Undirected', acting like two-way roads.",
        "They can also be 'Weighted', where edges carry an explicit numerical cost, like distance or latency, or 'Unweighted'.",
        "The most critical difference from trees is that graphs frequently contain 'Cycles'—pathways that loop back onto themselves.",
        "This cyclical nature means that traversing a graph requires special tracking logic to prevent catastrophic infinite loops.",
        "Graphs are everywhere: social network friend graphs, internet routing topologies, road maps, and dependency resolution chains.",
        "Let's formalize these concepts by looking at the mathematical representation of a tiny, undirected graph network."
      ],
      "example": "In abstract terms, a graph is simply a set of V (Vertices) and a set of E (Edges connecting specific Vertices).",
      "code": "const vertices = ['A', 'B', 'C', 'D'];\n\n// An array of tuple pairings representing bidirectional connections\nconst edges = [\n  ['A', 'B'], // A connects to B\n  ['B', 'C'], // B connects to C\n  ['C', 'A'], // C connects back to A (Cycle!)\n  ['C', 'D']  // C connects to D\n];\n\nconsole.log(\"Vertices:\", vertices);\nconsole.log(\"Edges:\", edges);",
      "output": "Vertices: [ 'A', 'B', 'C', 'D' ]\nEdges: [ [ 'A', 'B' ], [ 'B', 'C' ], [ 'C', 'A' ], [ 'C', 'D' ] ]",
      "codeNotes": [
        {
          "line": 4,
          "note": "Each tuple represents a relationship. If undirected, ['A', 'B'] implies ['B', 'A'] exists logically."
        },
        {
          "line": 6,
          "note": "Connecting C back to A creates a triangular loop, a defining feature of complex graphs."
        }
      ],
      "tryIt": "Notice how node D is connected, but what if there was an edge ['E', 'F']? That would be a disconnected 'island' within the same graph.",
      "check": {
        "question": "What structural feature explicitly distinguishes a Graph from a standard Tree?",
        "options": [
          "Graphs can only store numbers, while Trees store objects.",
          "Graphs can have cycles, multiple parents, and bidirectional edges.",
          "Trees require less memory than graphs in all scenarios."
        ],
        "answer": 1,
        "why": "Trees are actually a restricted subset of graphs: they are directed, acyclic graphs (DAGs) with exactly one root."
      }
    },
    {
      "title": "The Adjacency Matrix",
      "say": [
        "To process graphs in code, we need a structural representation. The first major option is the Adjacency Matrix.",
        "An Adjacency Matrix is a 2D array (a grid) of size V x V, where V is the total number of vertices.",
        "The rows and columns represent the nodes. If an edge exists between row 'i' and column 'j', we place a 1 in that cell.",
        "If no edge exists, the cell remains 0. For weighted graphs, we place the numerical weight instead of a 1.",
        "This matrix structure provides blistering O(1) instantaneous lookup to check if any two nodes are connected.",
        "However, it is brutally inefficient for space. A graph with 10,000 nodes requires a grid of 100 million cells.",
        "If most nodes only have a few connections (a 'sparse' graph), millions of cells are wasted holding zeros.",
        "Therefore, matrices are typically reserved for highly 'dense' graphs, where nearly every node connects to every other node.",
        "Let's construct a simple Adjacency Matrix for a 3-node undirected graph."
      ],
      "example": "A 2D matrix uses boolean integers to map out exact grid-based intersections representing edge connections.",
      "code": "// Nodes: 0, 1, 2\n// Connections: 0-1, 1-2\nconst V = 3;\nconst matrix: number[][] = Array(V).fill(0).map(() => Array(V).fill(0));\n\nfunction addEdge(u: number, v: number) {\n  matrix[u][v] = 1;\n  matrix[v][u] = 1; // Because it's undirected, we mirror it\n}\n\naddEdge(0, 1);\naddEdge(1, 2);\n\nconsole.log(matrix[0]); // Connections for Node 0\nconsole.log(matrix[1]); // Connections for Node 1\nconsole.log(matrix[2]); // Connections for Node 2",
      "output": "[ 0, 1, 0 ]\n[ 1, 0, 1 ]\n[ 0, 1, 0 ]",
      "codeNotes": [
        {
          "line": 4,
          "note": "We pre-allocate a perfect V x V grid initially filled with 0 (no connections)."
        },
        {
          "line": 8,
          "note": "For an undirected graph, the matrix is perfectly symmetrical diagonally."
        }
      ],
      "tryIt": "Add an edge from 0 to 2. Run it and watch the corners of the matrix populate with 1s.",
      "check": {
        "question": "What is the primary disadvantage of using an Adjacency Matrix for a sparse social network with millions of users?",
        "options": [
          "It takes O(N) time to check if two users are friends.",
          "It allocates O(V^2) memory, instantly crashing due to billions of wasted cells containing zeros.",
          "It cannot represent undirected connections."
        ],
        "answer": 1,
        "why": "A matrix for a million users requires a trillion cells. If each user has 50 friends, 99.99% of memory is wasted on zeros."
      }
    },
    {
      "title": "The Adjacency List",
      "say": [
        "To solve the memory catastrophe of matrices, we heavily rely on the second representation: The Adjacency List.",
        "Instead of a massive grid, we use a Map or an Array where each key/index represents a specific vertex.",
        "The corresponding value is simply a list (array) of neighboring vertices that it connects directly to.",
        "If a node has zero connections, its list is empty. If it has three connections, its list has three elements.",
        "This representation is extremely memory efficient, strictly scaling with the number of actual edges, taking O(V + E) space.",
        "Because modern networks (like web links or friend groups) are overwhelmingly sparse, Adjacency Lists are the industry standard.",
        "The trade-off is a slight loss in lookup speed; checking if A connects to Z takes O(degree) time instead of O(1).",
        "However, finding all neighbors of a node—the most common graph operation—is lightning fast.",
        "Let's build an Adjacency List class that dynamically maps string-based node names to arrays of their neighbors."
      ],
      "example": "An Adjacency List leverages a JavaScript Map to dynamically hold only the connections that actually exist.",
      "code": "class Graph {\n  adjacencyList = new Map<string, string[]>();\n  \n  addVertex(v: string) {\n    if (!this.adjacencyList.has(v)) this.adjacencyList.set(v, []);\n  }\n  \n  addEdge(v1: string, v2: string) {\n    this.adjacencyList.get(v1)?.push(v2);\n    this.adjacencyList.get(v2)?.push(v1); // Undirected link\n  }\n}\n\nconst g = new Graph();\ng.addVertex(\"Tokyo\"); g.addVertex(\"Dallas\"); g.addVertex(\"Seoul\");\ng.addEdge(\"Tokyo\", \"Dallas\");\ng.addEdge(\"Tokyo\", \"Seoul\");\n\nconsole.log(\"Tokyo ->\", g.adjacencyList.get(\"Tokyo\"));\nconsole.log(\"Dallas ->\", g.adjacencyList.get(\"Dallas\"));",
      "output": "Tokyo -> [ 'Dallas', 'Seoul' ]\nDallas -> [ 'Tokyo' ]",
      "codeNotes": [
        {
          "line": 5,
          "note": "We initialize a blank array for a new vertex, preparing it to hold future neighbors."
        },
        {
          "line": 10,
          "note": "We establish a two-way street by pushing the neighbor into both respective arrays."
        }
      ],
      "tryIt": "Comment out line 10. The graph instantly becomes a Directed graph, where traffic flows only from v1 to v2.",
      "check": {
        "question": "Why is an Adjacency List generally preferred over an Adjacency Matrix in practical programming?",
        "options": [
          "It uses significantly less memory for typical sparse networks, taking O(V + E) space.",
          "It allows for O(1) lookup to determine if an edge exists.",
          "It is the only way to represent weighted graph edges."
        ],
        "answer": 0,
        "why": "Because it only stores existing edges, it bypasses the massive quadratic O(V^2) overhead required by a Matrix."
      }
    },
    {
      "title": "Graph Traversal: Depth-First Search (DFS)",
      "say": [
        "With our graph mapped out, we can traverse it. Depth-First Search (DFS) on a graph works exactly like DFS on a tree.",
        "We start at a source node, pick an arbitrary neighbor, and dive as deep down that continuous path as possible.",
        "We only backtrack when we hit a dead end or a node whose neighbors have all been fully explored.",
        "However, because graphs have cyclical loops, an uncontrolled DFS will spin infinitely, causing a stack overflow.",
        "To prevent this, we must strictly maintain a 'Visited' set, recording the identity of every node we process.",
        "Before recursing into a neighbor, we check our Set. If the neighbor is already listed, we ruthlessly skip it.",
        "DFS is heavily utilized in detecting closed cycles, mapping out labyrinthine mazes, and analyzing network components.",
        "The recursive implementation elegantly relies on the call stack to manage the backtracking logic for us.",
        "Let's script a robust recursive DFS that meticulously tracks visited nodes to navigate a cyclic Adjacency List safely."
      ],
      "example": "Graph DFS uses a visited Set to safely navigate highly interconnected pathways without falling into infinite recursive traps.",
      "code": "class Graph {\n  list = new Map<string, string[]>();\n  add(v: string) { this.list.set(v, []); }\n  edge(v1: string, v2: string) { this.list.get(v1)!.push(v2); this.list.get(v2)!.push(v1); }\n  \n  dfs(start: string, visited = new Set<string>(), result: string[] = []): string[] {\n    visited.add(start);\n    result.push(start);\n    \n    for (const neighbor of this.list.get(start) || []) {\n      if (!visited.has(neighbor)) {\n        this.dfs(neighbor, visited, result);\n      }\n    }\n    return result;\n  }\n}\nconst g = new Graph();\n['A', 'B', 'C', 'D'].forEach(v => g.add(v));\ng.edge('A', 'B'); g.edge('B', 'C'); g.edge('C', 'A'); g.edge('C', 'D'); // A-B-C is a cycle\nconsole.log(g.dfs('A'));",
      "output": "[ 'A', 'B', 'C', 'D' ]",
      "codeNotes": [
        {
          "line": 7,
          "note": "We immediately mark the node as visited so subsequent branches don't re-process it."
        },
        {
          "line": 11,
          "note": "The crucial shield: we only trigger a recursive dive if the node is pristine and unvisited."
        }
      ],
      "tryIt": "Remove the 'if (!visited.has(neighbor))' wrapper and run it locally. It will immediately crash with a Maximum Call Stack Size Exceeded error.",
      "check": {
        "question": "What catastrophic failure occurs if you perform a graph DFS without a 'visited' tracking mechanism?",
        "options": [
          "The algorithm will skip the first node.",
          "Any cycle in the graph will trap the traversal in an infinite loop, crashing the application.",
          "It degrades the time complexity to O(N^2)."
        ],
        "answer": 1,
        "why": "In a cycle (e.g., A -> B -> C -> A), the algorithm will repeatedly trace the circle forever unless a visited tracker breaks the loop."
      }
    },
    {
      "title": "Graph Traversal: Breadth-First Search (BFS)",
      "say": [
        "Our alternative traversal strategy is Breadth-First Search (BFS), radiating outward from a starting node.",
        "Instead of diving deep, BFS visits all immediate neighbors (distance 1) before moving to neighbors of neighbors (distance 2).",
        "Just like tree BFS, graph BFS necessitates a Queue data structure to maintain this strict FIFO layer-by-layer ordering.",
        "And just like graph DFS, we must maintain a 'Visited' set to sever cycles and prevent redundant processing.",
        "The true superpower of BFS is its absolute guarantee regarding shortest paths in unweighted graphs.",
        "Because BFS expands outward uniformly like a ripple in a pond, the first time it discovers a target node, it has found the shortest possible route.",
        "This makes BFS the undisputed algorithm for peer-to-peer routing, six-degrees of separation analysis, and minimal network hops.",
        "We push the start node to the queue, loop while the queue has items, shift the front, and enqueue all unvisited neighbors.",
        "Let's construct an iterative BFS algorithm to watch this uniform ripple effect in action."
      ],
      "example": "Graph BFS integrates a Queue and a Visited Set to systematically expand outward, layer by layer.",
      "code": "class Graph {\n  list = new Map<string, string[]>();\n  add(v: string) { this.list.set(v, []); }\n  edge(v1: string, v2: string) { this.list.get(v1)!.push(v2); this.list.get(v2)!.push(v1); }\n  \n  bfs(start: string): string[] {\n    const queue = [start];\n    const visited = new Set([start]); // Mark visited immediately on enqueue\n    const result: string[] = [];\n    \n    while (queue.length > 0) {\n      const curr = queue.shift()!;\n      result.push(curr);\n      \n      for (const neighbor of this.list.get(curr) || []) {\n        if (!visited.has(neighbor)) {\n          visited.add(neighbor); // Shield against duplicate enqueues\n          queue.push(neighbor);\n        }\n      }\n    }\n    return result;\n  }\n}\nconst g = new Graph();\n['A', 'B', 'C', 'D', 'E'].forEach(v => g.add(v));\ng.edge('A', 'B'); g.edge('A', 'C'); g.edge('B', 'D'); g.edge('C', 'E');\nconsole.log(g.bfs('A'));",
      "output": "[ 'A', 'B', 'C', 'D', 'E' ]",
      "codeNotes": [
        {
          "line": 8,
          "note": "We seed both the queue and the visited set with our starting coordinate."
        },
        {
          "line": 17,
          "note": "Crucially, we mark neighbors as visited the moment we enqueue them, preventing queue duplication."
        }
      ],
      "tryIt": "Trace the output: A is distance 0. B and C are distance 1. D and E are distance 2. Perfectly ordered by depth!",
      "check": {
        "question": "Why is Breadth-First Search uniquely suited for finding the shortest path in unweighted graphs?",
        "options": [
          "It uses less memory than DFS.",
          "It explores all nodes at a distance 'k' before ever exploring nodes at distance 'k+1'.",
          "It avoids using the call stack entirely."
        ],
        "answer": 1,
        "why": "By expanding uniformly layer by layer, BFS guarantees that the first path discovered to a destination is mathematically the shortest sequence of edges."
      }
    },
    {
      "title": "Connected Components in a Graph",
      "say": [
        "A fascinating property of real-world graphs is that they are not always a single contiguous mass of connections.",
        "Often, graphs exist as isolated islands or clusters, known formally as 'Connected Components'.",
        "If an entire network is connected, a single traversal (DFS or BFS) starting from anywhere will visit every single node.",
        "However, if the network contains islands, a traversal from node A might terminate without ever discovering isolated node Z.",
        "To find all components, we must iterate through the entire master list of vertices in our graph.",
        "For each vertex, we check our global 'visited' set. If it is unvisited, it means we have discovered a brand new island.",
        "We then launch a BFS or DFS from that specific node, which proceeds to map out that entire isolated component.",
        "We increment our component counter and continue iterating, ensuring absolutely no node is left behind.",
        "Let's write a powerful diagnostic algorithm that counts exactly how many disconnected islands exist in a graph."
      ],
      "example": "Iterating over all vertices and launching targeted traversals allows us to map out distinct, isolated network components.",
      "code": "class Graph {\n  list = new Map<string, string[]>();\n  add(v: string) { this.list.set(v, []); }\n  edge(v1: string, v2: string) { this.list.get(v1)!.push(v2); this.list.get(v2)!.push(v1); }\n  \n  countComponents(): number {\n    const visited = new Set<string>();\n    let count = 0;\n    \n    // We must loop over every known vertex\n    for (const vertex of this.list.keys()) {\n      if (!visited.has(vertex)) {\n        count++; // New island found!\n        this.exploreIsland(vertex, visited); // DFS to map the island\n      }\n    }\n    return count;\n  }\n  \n  private exploreIsland(start: string, visited: Set<string>) {\n    visited.add(start);\n    for (const neighbor of this.list.get(start) || []) {\n      if (!visited.has(neighbor)) this.exploreIsland(neighbor, visited);\n    }\n  }\n}\nconst g = new Graph();\n['1', '2', '3', '4', '5'].forEach(v => g.add(v));\ng.edge('1', '2'); // Island A\ng.edge('4', '5'); // Island B (Node 3 is Island C, totally alone)\nconsole.log(\"Islands:\", g.countComponents());",
      "output": "Islands: 3",
      "codeNotes": [
        {
          "line": 11,
          "note": "We rely on the global Map to iterate through every known node, even the completely disconnected ones."
        },
        {
          "line": 14,
          "note": "The DFS recursively pollutes the global 'visited' set, ensuring nodes in this island are skipped by the outer loop."
        }
      ],
      "tryIt": "Add an edge connecting '2' and '4'. The output immediately drops to 2, as Island A and Island B merge into one.",
      "check": {
        "question": "Why can't we just run a single DFS from an arbitrary starting node to find all nodes in a disconnected graph?",
        "options": [
          "DFS cannot traverse undirected edges.",
          "The DFS has no physical pathways (edges) to reach the isolated islands, terminating prematurely.",
          "DFS consumes too much memory on disconnected graphs."
        ],
        "answer": 1,
        "why": "Traversals strictly require edges to move. If a node has no edges linking it to the current component, a traversal from that component is physically blocked from reaching it."
      }
    }
  ],
  "summary": [
    "Graphs model complex networks using Vertices (nodes) and Edges (connections).",
    "Adjacency Matrices provide O(1) lookups but waste immense memory for sparse networks.",
    "Adjacency Lists use Maps to store only existing edges, optimizing memory for real-world data.",
    "DFS navigates deep paths, strictly using a Visited set to prevent infinite cyclic loops.",
    "BFS utilizes a Queue to map outward layer by layer, naturally identifying shortest paths."
  ],
  "projectStep": {
    "title": "Graph Routing System",
    "steps": [
      "Construct a Graph representing 6 fictional cities using an Adjacency List.",
      "Implement a BFS function that takes a start and end city, returning the total number of hops between them.",
      "Modify the BFS to keep track of the 'parent' of each visited node so you can reconstruct the exact path string."
    ]
  }
}
];
