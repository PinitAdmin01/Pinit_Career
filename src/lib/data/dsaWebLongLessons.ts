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
];
