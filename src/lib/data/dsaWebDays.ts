import { DayConfig } from './curriculumEnricher';

/**
 * Data Structures & Algorithmic Optimizations (course-dsa-optim, prefix: dsa-optim):
 * 30 course days covering Big-O asymptotics, dynamic arrays, linked lists,
 * stacks, queues, hash tables, two pointers, sliding window, binary search,
 * recursion, trees (BST, AVL, Red-Black), heaps & priority queues,
 * graph algorithms (BFS, DFS, Dijkstra, Bellman-Ford, A*), dynamic programming,
 * greedy algorithms, bit manipulation, and real-time flight navigation capstone.
 *
 * Practice tasks are in dsa30DayData.ts; lessons in dsaWebLongLessons.ts.
 */
export const DSA_DAYS: DayConfig[] = [
  {
    "day": 1,
    "title": "Time & Space Complexity (Big-O Asymptotics & Dominant Terms)",
    "desc": "Analyze asymptotic execution bounds (O(1), O(log N), O(N), O(N log N), O(N^2)) and auxiliary memory overhead.",
    "syllabus": [
      "Big-O Asymptotic Upper Bounds: Growth rates and dropping non-dominant constants.",
      "Space Complexity: Auxiliary heap space vs call stack frame recursion memory.",
      "Common Complexity Classes: Constant O(1), Logarithmic O(log N), Linear O(N), Quadratic O(N^2)."
    ]
  },
  {
    "day": 2,
    "title": "Dynamic Arrays & Amortized Geometric Resizing",
    "desc": "Build a resizable array data structure supporting capacity doubling, geometric expansion, and amortized O(1) appends.",
    "syllabus": [
      "Contiguous Memory Allocation: Cache locality and pointer arithmetic.",
      "Geometric Capacity Doubling: Why copying N elements periodically yields amortized O(1) push.",
      "Manual Buffer Allocation & Array Shrinking."
    ]
  },
  {
    "day": 3,
    "title": "Singly & Doubly Linked Lists & Pointer Node Manipulation",
    "desc": "Master pointer manipulation, head/tail insertions, node deletions, and fast/slow pointer cycles.",
    "syllabus": [
      "ListNode Node Anatomy: Value and `next` pointer reference.",
      "Head/Tail Invariants: Sentinel dummy nodes for clean edge case handling.",
      "Reversing Linked Lists in O(N) time and O(1) auxiliary space."
    ]
  },
  {
    "day": 4,
    "title": "Stacks (LIFO): Valid Parentheses & Monotonic Next Greater Element",
    "desc": "Implement Last-In First-Out (LIFO) stacks, bracket validation, and monotonic stack search.",
    "syllabus": [
      "Stack Operations: push(), pop(), peek(), isEmpty() in O(1).",
      "Bracket Balance Matching with Hash Map Lookups.",
      "Monotonic Stack: Finding the next greater element in O(N) total time."
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Production LRU Cache Engine (Doubly Linked List + Hash Map)",
    "desc": "Milestone 1: Build an enterprise-grade Least Recently Used (LRU) Cache operating in strict O(1) time for get() and put() using a Doubly Linked List and Hash Map.",
    "syllabus": [
      "LRU Cache Architecture: Combining Hash Map for O(1) lookup with Doubly Linked List for O(1) eviction.",
      "Sentinel Head and Tail Nodes: Eliminating null pointer edge conditions.",
      "Evicting Least Recently Used item when capacity exceeds limit."
    ]
  },
  {
    "day": 6,
    "title": "Queues (FIFO), Circular Ring Buffers & Deques",
    "desc": "Build First-In First-Out (FIFO) queues, fixed circular ring buffers, and double-ended deques with O(1) operations.",
    "syllabus": [
      "FIFO Invariant: Enqueue at tail, dequeue from head.",
      "Circular Ring Buffer: Modulo index wrapping `(tail + 1) % capacity` without array shifting.",
      "Double-Ended Queue (Deque): O(1) pushFront, pushBack, popFront, popBack."
    ]
  },
  {
    "day": 7,
    "title": "Hash Tables, Collision Resolution & Load Factors",
    "desc": "Understand hash functions, collision resolution via separate chaining, open addressing linear probing, and dynamic load factor table resizing.",
    "syllabus": [
      "Hash Function Principles: Uniform distribution and deterministic hashing.",
      "Collision Handling: Separate Chaining (Linked list buckets) vs Open Addressing (Linear Probing).",
      "Load Factor Threshold (alpha = N / M > 0.75) and Table Rehashing."
    ]
  },
  {
    "day": 8,
    "title": "Two Pointers Technique (Opposite Direction & Fast/Slow Pointers)",
    "desc": "Solve container optimization, palindrome verification, and target sums in O(N) time with Two Pointers.",
    "syllabus": [
      "Opposite Ends Convergence: Left and right pointers moving inward.",
      "Fast & Slow Pointers: Finding midpoints and cycle boundaries.",
      "Container With Most Water: Greedy proof of optimal pointer advancement."
    ]
  },
  {
    "day": 9,
    "title": "Sliding Window Technique (Fixed vs Dynamic Windows)",
    "desc": "Master sub-array optimization, longest substrings, and maximum sum windows in O(N) linear time.",
    "syllabus": [
      "Fixed Window: Fixed length k updates.",
      "Dynamic Window: Expanding right and contracting left.",
      "Frequency Maps in Windows."
    ]
  },
  {
    "day": 10,
    "title": "Binary Search Algorithm & Monotonic Search Space Reduction",
    "desc": "Implement logarithmic O(log N) search, left/right insertion bisecting, and searching rotated sorted arrays.",
    "syllabus": [
      "Binary Search Loop Invariants: left <= right.",
      "Midpoint Calculation: left + (right - left) / 2 avoiding integer overflow.",
      "Searching in Rotated Arrays."
    ]
  },
  {
    "day": 11,
    "title": "Recursion, Call Stack Mechanics & Backtracking Principles",
    "desc": "Understand call stack execution frames, base cases, tree branching, and state backtracking.",
    "syllabus": [
      "Base Case vs Recursive Step.",
      "Call Stack Memory Growth.",
      "Pruning Search Branches."
    ]
  },
  {
    "day": 12,
    "title": "Merge Sort & Divide-and-Conquer Recurrences",
    "desc": "Implement stable O(N log N) Merge Sort, Master Theorem recurrences, and inverted pair counting.",
    "syllabus": [
      "Divide Phase: Halving arrays until length 1.",
      "Conquer Phase: Merging two sorted pointers in O(N).",
      "Auxiliary Space Trade-off."
    ]
  },
  {
    "day": 13,
    "title": "Quick Sort & Quick Select (Kth Largest Element in O(N))",
    "desc": "Master in-place Lomuto/Hoare partitioning, randomized pivots, and finding Kth elements in average O(N) time.",
    "syllabus": [
      "Lomuto Partitioning: Swapping smaller elements behind pivot.",
      "Quick Select: O(N) expected selection.",
      "Pivot Selection Strategies."
    ]
  },
  {
    "day": 14,
    "title": "Non-Comparison Sorting: Counting Sort & Radix Sort",
    "desc": "Sort integers in O(N + K) linear time by exploiting key distributions and byte digit buckets.",
    "syllabus": [
      "Counting Sort: Direct index frequency arrays.",
      "Dutch National Flag: 3-way partitioning.",
      "Radix Sort: Multi-pass digit buckets."
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: High-Throughput Stream Median Finder (Dual Binary Heaps)",
    "desc": "Milestone 2: Build a real-time data stream median tracker operating in O(log N) insertions and O(1) median lookups using balanced Min and Max Heaps.",
    "syllabus": [
      "Dual Heap Architecture: MaxHeap for lower half, MinHeap for upper half.",
      "Balancing Heap Sizes: Keeping size difference <= 1.",
      "O(1) Instant Median Query."
    ]
  },
  {
    "day": 16,
    "title": "Binary Trees: Preorder, Inorder, Postorder & Level-Order BFS",
    "desc": "Traverse hierarchical tree data structures using recursive DFS and queue-based BFS level-order scans.",
    "syllabus": [
      "Tree Node Anatomy: val, left, right.",
      "Depth-First Traversals: Pre, In, Post.",
      "Breadth-First Level-Order Queues."
    ]
  },
  {
    "day": 17,
    "title": "Binary Search Trees (BST): Tree Invariants & Range Query Search",
    "desc": "Validate Binary Search Tree properties using recursive bounded ranges and implement logarithmic O(log N) node search and insertion.",
    "syllabus": [
      "BST Invariant: Left < Root < Right.",
      "Range Bounding: (min, max) validation.",
      "Lowest Common Ancestor in BST."
    ]
  },
  {
    "day": 18,
    "title": "Min/Max Binary Heaps & Priority Queues",
    "desc": "Implement array-backed binary heaps with siftUp() and siftDown() heapify operations in O(log N) time.",
    "syllabus": [
      "Complete Binary Tree Array Representation: Parent at (i-1)/2, children at 2i+1, 2i+2.",
      "Heap Order Invariant: Parent <= Children for MinHeap.",
      "SiftUp and SiftDown Operations."
    ]
  },
  {
    "day": 19,
    "title": "Tries (Prefix Trees) & Fast Prefix Auto-Complete",
    "desc": "Build n-ary prefix trees for O(K) word insertions, prefix lookups, and dictionary word searches.",
    "syllabus": [
      "TrieNode Architecture: children map and isEnd flag.",
      "Prefix Traversal in O(Length).",
      "Dictionary Word Search."
    ]
  },
  {
    "day": 20,
    "title": "Graph Representations (Adjacency List/Matrix) & BFS/DFS",
    "desc": "Represent directed and undirected graphs and execute breadth-first and depth-first traversals.",
    "syllabus": [
      "Adjacency List vs Matrix Space Trade-offs.",
      "Breadth-First Search (Shortest Path in Unweighted Graph).",
      "Depth-First Search (Cycle Detection & Components)."
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Fast Auto-Complete Engine (Trie + Frequency Min-Heap)",
    "desc": "Milestone 3: Build an enterprise-scale search auto-complete system returning the top-K highest frequency keyword suggestions in sub-millisecond time.",
    "syllabus": [
      "Prefix Indexing with Trie.",
      "Frequency Ranking.",
      "Sub-millisecond Search Suggestions."
    ]
  },
  {
    "day": 22,
    "title": "Dijkstra's Shortest Path Algorithm & Weighted Graphs",
    "desc": "Compute shortest paths in weighted directed graphs with non-negative edge costs using Priority Queues.",
    "syllabus": [
      "Greedy Edge Relaxation.",
      "Priority Queue / MinHeap Distance Tracking.",
      "Handling Dense vs Sparse Weighted Networks."
    ]
  },
  {
    "day": 23,
    "title": "Topological Sort (Kahn's In-Degree Algorithm) & DAGs",
    "desc": "Schedule build tasks and course prerequisites using in-degree reduction and cycle detection.",
    "syllabus": [
      "Directed Acyclic Graphs (DAG).",
      "Kahn's In-Degree Queue Algorithm.",
      "Detecting Circular Dependencies."
    ]
  },
  {
    "day": 24,
    "title": "Disjoint Set Union (Union-Find) with Path Compression",
    "desc": "Maintain disjoint partitions in near O(1) amortized time with rank heuristics and path compression.",
    "syllabus": [
      "Disjoint Set Forest Representation.",
      "Path Compression Optimization.",
      "Union by Rank Heuristic."
    ]
  },
  {
    "day": 25,
    "title": "Dynamic Programming: 1D Memoization vs Tabulation",
    "desc": "Transform exponential recursive algorithms into polynomial time using state caching and bottom-up DP tables.",
    "syllabus": [
      "Overlapping Subproblems & Optimal Substructure.",
      "Top-Down Memoization with Hash Map / Array.",
      "Bottom-Up Tabulation with Space Optimization."
    ]
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Optimization Engine",
    "desc": "Milestone 4: Build a 2D dynamic programming optimization engine for optimal resource allocation and currency change making.",
    "syllabus": [
      "0/1 Knapsack State Space (i, w).",
      "Unbounded Knapsack & Coin Change.",
      "Space Compression to 1D Array."
    ]
  },
  {
    "day": 27,
    "title": "2D Dynamic Programming: Longest Common Subsequence & Edit Distance",
    "desc": "Solve string alignment, diff generation algorithms, and Levenshtein minimum edit distance transformations in O(M * N) time.",
    "syllabus": [
      "LCS Grid State Transitions.",
      "Edit Distance (Insert, Delete, Replace).",
      "Matrix Traversal for Reconstruction."
    ]
  },
  {
    "day": 28,
    "title": "Backtracking: N-Queens & Constraint Satisfaction",
    "desc": "Solve constraint satisfaction puzzles using recursion trees, pruning invalid states, and state restoration.",
    "syllabus": [
      "Constraint Satisfaction State Trees.",
      "Diagonal Bitmask / Set Pruning.",
      "State Restoration and Clean Backtracking."
    ]
  },
  {
    "day": 29,
    "title": "Bit Manipulation & XOR Tricks (O(1) Space Magic)",
    "desc": "Solve single number detection, bit shifting, and bitmask subset states with bitwise operators.",
    "syllabus": [
      "Bitwise AND, OR, XOR, NOT, Shifting.",
      "XOR Self-Inverse Property (A ^ A = 0).",
      "Brian Kernighan's Bit Counting Algorithm."
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Real-Time Global Flight Path Routing & Navigation Optimizer",
    "desc": "Final Capstone Synthesis: The complete algorithmic navigation operating system bringing together A* graph search, disjoint sets, priority queues, and dynamic programming flight cost optimization.",
    "syllabus": [
      "Multi-Hop Shortest Path with Vertex Bounds.",
      "Bellman-Ford Relaxation Iterations.",
      "End-to-End Dynamic Routing System."
    ]
  }
];

export const DSA_WEB_DAYS: DayConfig[] = DSA_DAYS;
