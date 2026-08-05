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

export const DSA_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is an Algorithm? — Step-by-Step Logic, Linear Search and Finding Items",
    desc: "An ALGORITHM is simply a step-by-step set of instructions to solve a problem. You use algorithms every single day in real life. When you follow a recipe to make tea, that is an algorithm. When you search for a name in a physical address book by flipping pages one by one, that is a linear search algorithm. In computer science, an algorithm takes some inputs (like a list of numbers), performs steps, and returns an output (like finding if a number is in the list). Let us learn the simplest search algorithm: LINEAR SEARCH. Imagine you have a box of 10 cards, and each card has a name written on it. The cards are not sorted. You are looking for a card with the name 'Rahul'. How do you find it? You start with the first card. Is it 'Rahul'? No. Move to the second card. Is it 'Rahul'? No. You repeat this one by one, from left to right, until you find 'Rahul' or reach the end of the box. This is linear search. In JavaScript, we represent the cards as an array: const names = [\"Amit\", \"Priya\", \"Rahul\", \"Karan\"]. An array is a list of items. Each item has a position number called an INDEX, starting at 0. So names[0] is \"Amit\", names[1] is \"Priya\", names[2] is \"Rahul\", names[3] is \"Karan\". To find \"Rahul\", we write a loop that starts at index 0 and goes up to index 3, checking names[index] === \"Rahul\". If it matches, we return the index. If we check every card and never find it, we return -1 (meaning not found). (Real world: Finding a contact in a phone book when you do not remember the name and must scroll through the whole list, or finding a specific bill in a stack of paper receipts, is linear search. It is simple but slow if you have 10,000 items because you have to look at every single one.)",
    syllabus: ["Algorithm = step-by-step instructions to solve a problem. Recipe analogy: make tea steps. Linear search = searching a list from start to end, checking one item at a time. Simplest search algorithm.", "Array basics: list of items. Zero-based indexing: index 0 is first item, index 1 is second, index length-1 is last. const arr = [10, 20, 30] means arr[0]=10, arr[1]=20, arr[2]=30.", "Linear search implementation: loop from index 0 to end of array. Check if current element equals target. Return index if found, or -1 if missing. Slow for huge lists (10,000+ items) but works on unsorted lists."],
    eTitle: "Exam: Array Element Finder",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Occurrence Counter",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Array Extremes — Finding Min, Max and Guarding Against Boundary Bugs",
    desc: "Now that you know how to search an array sequentially, let us learn how to find the largest (maximum) or smallest (minimum) value in an array. This is a very common task in coding. Imagine a teacher has a stack of 5 exam papers with marks: [85, 92, 78, 95, 88]. How does the teacher find the highest marks? The teacher picks up the first paper (85) and assumes it is the highest so far. Then they pick up the second paper (92). Since 92 is greater than 85, the teacher updates their mental record: highest so far is now 92. They pick up the third paper (78). Since 78 is not greater than 92, they ignore it. The fourth paper is 95. Since 95 is greater than 92, the record becomes 95. The fifth paper is 88. Ignore. The final answer is 95. In code, we write this exact algorithm using a variable called 'max' and a loop. First, we check if the array is empty. If it is empty, we cannot find a maximum — we must return an error or null. This is called guarding against empty inputs. If not empty, we set let max = arr[0] (our initial guess). Then we loop from index 1 to the end of the array. Inside the loop, we compare the current element arr[i] with our max. If arr[i] > max, we update: max = arr[i]. When the loop finishes, max contains the highest value. Finding the minimum is the exact same, but we check if arr[i] < min. One of the most common beginner bugs in this algorithm is initializing max to 0. If the array only contains negative temperatures like [-5, -12, -3], initializing max to 0 will output 0 as the maximum temperature, which is wrong because 0 was not even in the array! Always initialize max to the first element arr[0] or a very small number like Number.MIN_SAFE_INTEGER. (Real world: An e-commerce app like Amazon scans prices of 100 products to find the cheapest (min) and most expensive (max) items to show at the top of filter sliders. A weather app scans the last 24 hours of logs to find the high and low temperatures.)",
    syllabus: ["Finding Max/Min: sequential search pattern. Initialise max = first element arr[0], loop through remaining elements. If current element > max, update max. Same logic for min using <. Never initialise max to 0.", "Empty array guard: check if array is empty (length === 0) before starting loop. Accessing index 0 of an empty array causes a crash (out-of-bounds error). Always write safe guards first in your functions.", "Loop boundaries: start loop at index 1 since index 0 is already the initial max. Loop until index < array.length. Going beyond array.length causes undefined errors in JS or crashes in other languages."],
    eTitle: "Exam: Array Maximum Finder",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Display Box Mapper",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Binary Search: Logarithmic Scaling in Indexed Stores",
    desc: "Understand binary search algorithms. (Real world: Relational database indexes use binary searches to identify row IDs inside sorted blocks, reducing time from O(N) to O(log N).)",
    syllabus: ["Sorted array intervals math", "Calculating midpoints preventing overflow", "Interval divisions (O(log N) scaling)"],
    eTitle: "Exam: Logarithmic Index Finder",
    eDesc: "Write a JS function `binarySearch(arr, target)` returning target index inside sorted arr. Return -1 if missing.",
    eStarter: "function binarySearch(arr, target) {\n    // Write your code here\n    \n}",
    eHint: "Use left/right boundary pointers, updating boundary loops based on comparison against arr[mid].",
    eTest: "if (typeof binarySearch !== 'function') throw new Error('Method binarySearch not found');\nif (binarySearch([10, 20, 30, 40], 30) !== 2) throw new Error('Standard binary search failed');\nif (binarySearch([10, 20, 30, 40], 15) !== -1) throw new Error('Missing binary search failed');",
    aTitle: "Assignment: Midpoint Boundary check",
    aDesc: "Write a JS function `getMidpoint(low, high)` returning Math.floor(low + (high - low) / 2).",
    aStarter: "function getMidpoint(low, high) {\n    // Write your code here\n    \n}",
    aHint: "Calculate midpoint safely to prevent integer overflow.",
    aTest: "if (typeof getMidpoint !== 'function') throw new Error('Method getMidpoint not found');"
  },
  {
    title: "Hashing: Cache registries & constant O(1) searches",
    desc: "Master key-value dictionaries. (Real world: Distributed memory caches store tokens hashes in RAM, achieving constant-time O(1) sessions validation lookup.)",
    syllabus: ["Hash map index collisions", "Constant time O(1) memory mapping rules", "Object map lookup structures"],
    eTitle: "Exam: Cache Registry Finder",
    eDesc: "Write a JS function `getCachedToken(cache, key)` returning cache[key] if present. Return 'EXPIRED' if cache[key] is missing or null.",
    eStarter: "function getCachedToken(cache, key) {\n    // Write your code here\n    \n}",
    eHint: "Check key presence in map object properties. Return fallback.",
    eTest: "if (typeof getCachedToken !== 'function') throw new Error('Method getCachedToken not found');\nif (getCachedToken({ 'user1': 't123' }, 'user1') !== 't123') throw new Error('Cache lookup failed');\nif (getCachedToken({}, 'user2') !== 'EXPIRED') throw new Error('Cache fallback failed');",
    aTitle: "Assignment: Cache key presence tester",
    aDesc: "Write a JS function `isKeyCached(cache, key)` returning true if key is in cache object.",
    aStarter: "function isKeyCached(cache, key) {\n    // Write your code here\n    \n}",
    aHint: "Verify property key existence.",
    aTest: "if (typeof isKeyCached !== 'function') throw new Error('Method isKeyCached not found');"
  },
  {
    title: "Linked Lists: LRU Caches memory nodes routing",
    desc: "Master linked node references. (Real world: File buffers link memory headers sequentially, removing least recently used elements to maintain memory bounds.)",
    syllabus: ["Linked nodes next/prev properties", "LRU cache double links eviction", "Linked head tail insertions"],
    eTitle: "Exam: LL Node Insertion Auditor",
    eDesc: "Write a JS function `insertAfterNode(node, newPayload)` returning new node object `{ payload: newPayload, next: node.next }` and modifying `node.next = (new node)`.",
    eStarter: "function insertAfterNode(node, newPayload) {\n    // Write your code here\n    \n}",
    eHint: "Build new node object, updating current node's next property link.",
    eTest: "if (typeof insertAfterNode !== 'function') throw new Error('Method insertAfterNode not found');\nconst first = { payload: 'A', next: null };\nconst added = insertAfterNode(first, 'B');\nif (first.next !== added || added.payload !== 'B') throw new Error('Linked node insertion failed');",
    aTitle: "Assignment: Linked List size compiler",
    aDesc: "Write a JS function `countNodes(head)` returning total linked node count until next is null.",
    aStarter: "function countNodes(head) {\n    // Write your code here\n    \n}",
    aHint: "Traverse list incrementally while head is not null.",
    aTest: "if (typeof countNodes !== 'function') throw new Error('Method countNodes not found');"
  },
  {
    title: "Stacks & Queues: System undo buffers & microservice queues",
    desc: "Master stack and queue bounds. (Real world: Text editor buffers push updates to stacks to handle Undo, while routers queue requests to buffer network load.)",
    syllabus: ["LIFO stack operations (push, pop)", "FIFO queue operations (enqueue, dequeue)", "Evaluating buffer capacity limits"],
    eTitle: "Exam: Stack Undo Buffer Auditor",
    eDesc: "Write a JS function `popUndoStack(stack)` returning top element. Return 'EMPTY' if stack length is 0.",
    eStarter: "function popUndoStack(stack) {\n    // Write your code here\n    \n}",
    eHint: "Use array pop() checking length bounds.",
    eTest: "if (typeof popUndoStack !== 'function') throw new Error('Method popUndoStack not found');\nif (popUndoStack(['v1', 'v2']) !== 'v2') throw new Error('Stack pop failed');",
    aTitle: "Assignment: Queue capacity checker",
    aDesc: "Write a JS function `isQueueFull(queue, limit)` returning true if queue.length >= limit.",
    aStarter: "function isQueueFull(queue, limit) {\n    // Write your code here\n    \n}",
    aHint: "Compare length against limit constraints.",
    aTest: "if (typeof isQueueFull !== 'function') throw new Error('Method isQueueFull not found');"
  },
  {
    title: "Trees: Trie-based Autocomplete search bar",
    desc: "Master Trie structure routing. (Real world: Web search engines route prefix keys inside Trie structures, compiling completions lists in milliseconds.)",
    syllabus: ["Prefix trees (Trie) nodes architecture", "Inserting search keywords prefixes", "Searching prefixes completions sets"],
    eTitle: "Exam: Trie Node Prefix Matcher",
    eDesc: "Write a JS function `trieHasPrefix(root, prefix)` returning true if walking the characters of prefix exists in root.children map. Returns false otherwise.",
    eStarter: "function trieHasPrefix(root, prefix) {\n    // Write your code here\n    \n}",
    eHint: "Loop characters in prefix, stepping root = root.children[char] variables. Return false if undefined.",
    eTest: "if (typeof trieHasPrefix !== 'function') throw new Error('Method trieHasPrefix not found');\nconst r = { children: { 'a': { children: {} } } };\nif (trieHasPrefix(r, 'a') !== true) throw new Error('Trie lookup failed');\nif (trieHasPrefix(r, 'b') !== false) throw new Error('Trie incorrect match failed');",
    aTitle: "Assignment: Trie node character inserter",
    aDesc: "Write a JS function `addTrieChar(node, char)` returning `node.children[char] = node.children[char] || { children: {} }`.",
    aStarter: "function addTrieChar(node, char) {\n    // Write your code here\n    \n}",
    aHint: "Insert child node map if missing.",
    aTest: "if (typeof addTrieChar !== 'function') throw new Error('Method addTrieChar not found');"
  },
  {
    title: "Graphs: Microservice Dependency Resolvers",
    desc: "Master graph structures. (Real world: Compile tools parse system packages, using Topological Sort algorithms to map builds dependency ordering.)",
    syllabus: ["Directed Acyclic Graphs (DAG) structures", "Adjacency lists representations", "Topological sorting and dependency loops detection"],
    eTitle: "Exam: Package Dependency Loop Checker",
    eDesc: "Write a JS function `hasDirectDependencyLoop(adjList, pkg)` returning true if pkg is listed in adjList[pkg] (self-dependency) or if adjList[pkg].includes(pkg).",
    eStarter: "function hasDirectDependencyLoop(adjList, pkg) {\n    // Write your code here\n    \n}",
    eHint: "Verify adjacency list for package elements self reference. Check null.",
    eTest: "if (typeof hasDirectDependencyLoop !== 'function') throw new Error('Method hasDirectDependencyLoop not found');\nif (hasDirectDependencyLoop({ 'p1': ['p1'] }, 'p1') !== true) throw new Error('Loop detection failed');",
    aTitle: "Assignment: Graph path presence validator",
    aDesc: "Write a JS function `isDependencyDirect(adjList, p1, p2)` returning true if adjList[p1] includes p2.",
    aStarter: "function isDependencyDirect(adjList, p1, p2) {\n    // Write your code here\n    \n}",
    aHint: "Check array inclusion.",
    aTest: "if (typeof isDependencyDirect !== 'function') throw new Error('Method isDependencyDirect not found');"
  },
  {
    title: "Final Capstone: System Scaling & Routing Performance Audit",
    desc: "Perform evaluations of search queries latency, check Trie prefix nodes, evaluate dependency loops presence, and compile system performance scores. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Algorithm complexity evaluations", "Trie search performance metrics", "Dependency trees recursion limits checks"],
    eTitle: "Exam: System Complexity compliance auditor",
    eDesc: "Write a JS function `evaluateSystemPerformance(report)` returning true if report.timeComplexity === 'O(log N)' || report.timeComplexity === 'O(1)'. Returns false otherwise.",
    eStarter: "function evaluateSystemPerformance(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report time complexity properties against targets.",
    eTest: "if (typeof evaluateSystemPerformance !== 'function') throw new Error('Method evaluateSystemPerformance not found');\nif (evaluateSystemPerformance({ timeComplexity: 'O(log N)' }) !== true) throw new Error('Performance evaluation failed');",
    aTitle: "Assignment: Latency rating evaluator",
    aDesc: "Write a JS function `getLatencyRating(ms)` returning 'fast' if ms <= 50, 'slow' otherwise.",
    aStarter: "function getLatencyRating(ms) {\n    // Write your code here\n    \n}",
    aHint: "Check threshold bounds.",
    aTest: "if (typeof getLatencyRating !== 'function') throw new Error('Method getLatencyRating not found');"
  },
  {
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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
    title: "Final Capstone: System Scaling & Routing Performance Audit (Review)",
    desc: "Review system scaling performance audits, analyze topological sorting results, evaluate Trie prefix traversals, and verify algorithmic bounds. (Real world: Infrastructure architects audit algorithms complexity, verifying APIs respond inside budget targets.)",
    syllabus: ["Reviewing recursive execution bounds", "Assembling performance metrics report", "Verifying algorithm scale limits"],
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

export const DSA_30_DAYS_QUESTS = DSA_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `dsa-basics-lecture-day-${dayNum}`,
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
        id: `dsa-basics-lecture2-day-1`,
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
        id: `dsa-basics-lecture3-day-1`,
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
        id: `dsa-basics-lecture2-day-2`,
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
        id: `dsa-basics-lecture3-day-2`,
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
  return buildEnrichedDayQuests('dsa-basics', dayNum, cfg);
});
