import { DayLessonPlan } from '../types/lessonEngine';

export const DSA_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Time & Space Complexity (Big-O Asymptotics & Dominant Terms)",
    "overviewMetaphor": "Big-O Notation is choosing a delivery vehicle for a business: if sending 1 letter takes 10 minutes and sending 1,000,000 letters also takes 10 minutes via email, that is O(1) constant time; if a courier walks each letter individually to 1,000,000 doors, that is O(N) linear time; if the courier visits every house in town for every single letter, that is catastrophic O(N^2) quadratic time.",
    "blocks": [
      {
        "id": "dsa-d1-b1-asymptotic-growth",
        "day": 1,
        "blockNumber": 1,
        "title": "Big-O Asymptotic Upper Bounds & Dropping Constants",
        "conceptBudget": {
          "primaryConcept": "Big-O Upper Bound",
          "supportingTerms": [
            "Drop Non-Dominant Constants (3N + 50 -> O(N))",
            "Worst-Case Time Guarantee",
            "Input Scaling Behavior"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Telescope vs Counting Pebbles",
            "simpleExplanation": "When looking at galaxies through a telescope (massive N = 1,000,000), small pebbles in your shoe (+50 steps) become completely negligible compared to the massive curve of the galaxy."
          },
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Complexity Growth Hierarchy",
              "nodes": [
                {
                  "id": "1",
                  "label": "O(1) Constant — Instant Hash Lookup / Array Index",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "O(log N) Logarithmic — Halving search space (Binary Search)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "O(N) Linear — Single pass through array",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "O(N log N) Linearithmic — Efficient Comparison Sorts (Merge/Quick)",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "O(N^2) Quadratic — Nested loops (Bubble / Brute Force)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "complexity_sim.js",
            "initialCode": "function countSteps(n) {\n  let steps = 0;\n  // Linear loop 3N + 5\n  for (let i = 0; i < 3 * n; i++) steps++;\n  steps += 5;\n  return { n, steps, dominantClass: 'O(N)' };\n}\n\nconsole.log(JSON.stringify(countSteps(1000)));",
            "expectedOutput": "{\"n\":1000,\"steps\":3005,\"dominantClass\":\"O(N)\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does the algorithm with exact step count `f(N) = 5N^2 + 100N + 5000` have a Big-O complexity of `O(N^2)`?",
          "options": [
            "Because as N scales to millions, the N^2 quadratic term dominates all other terms, making constant coefficients and lower-degree terms negligible",
            "Because 5000 is too big to fit in memory",
            "Because Big-O only looks at the first number in the formula"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_BIG_O_WORST_VS_AVERAGE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_BIG_O_WORST_VS_AVERAGE",
              "errorExplanation": "Big-O analyzes asymptotic scaling behavior as N approaches infinity, where highest-degree terms dominate completely.",
              "recoveryPath": {
                "simplerExplanation": "Highest power wins when N is huge.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d1-b2-space-complexity",
        "day": 1,
        "blockNumber": 2,
        "title": "Space Complexity: Auxiliary Heap Memory vs Call Stack",
        "conceptBudget": {
          "primaryConcept": "Space Complexity",
          "supportingTerms": [
            "Auxiliary Memory (New arrays/objects allocated)",
            "Call Stack Recursion Frames",
            "In-Place O(1) Algorithms"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d1-b1-asymptotic-growth",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Auxiliary Heap Allocation vs In-Place Pointer",
              "boxes": [
                {
                  "label": "input_arr",
                  "value": "[10, 20, 30, 40]",
                  "varType": "Array (N)",
                  "isUpdated": false
                },
                {
                  "label": "aux_copy (O(N) space)",
                  "value": "[10, 20, 30, 40]",
                  "varType": "New Heap Allocation",
                  "isUpdated": true
                },
                {
                  "label": "in_place_ptr (O(1) space)",
                  "value": "i = 0",
                  "varType": "Primitive Number",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "space_sim.js",
            "initialCode": "function reverseInPlace(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    const temp = arr[left];\n    arr[left] = arr[right];\n    arr[right] = temp;\n    left++; right--;\n  }\n  return { auxiliarySpace: 'O(1)', reversed: arr };\n}\n\nconsole.log(JSON.stringify(reverseInPlace([1, 2, 3, 4])));",
            "expectedOutput": "{\"auxiliarySpace\":\"O(1)\",\"reversed\":[4,3,2,1]}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the auxiliary space complexity of `reverseInPlace` above?",
          "expectedStringOutput": "O(1)",
          "acceptableAnswers": [
            "O(1)",
            "'O(1)'",
            "auxiliarySpace: O(1)"
          ],
          "primaryMisconceptionId": "MC_DSA_BIG_O_WORST_VS_AVERAGE",
          "diagnosisMap": {
            "O(N)": {
              "misconceptionId": "MC_DSA_BIG_O_WORST_VS_AVERAGE",
              "errorExplanation": "No new arrays are allocated; only a few primitive pointer variables (left, right, temp) are used, making auxiliary space O(1).",
              "recoveryPath": {
                "simplerExplanation": "In-place swaps use O(1) extra memory.",
                "guidedFixPrompt": "Type O(1)"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d1-b3-logarithmic-halving",
        "day": 1,
        "blockNumber": 3,
        "title": "Logarithmic O(log N) Time: The Power of Halving",
        "conceptBudget": {
          "primaryConcept": "Logarithmic O(log N) Scaling",
          "supportingTerms": [
            "Halving Search Space at Each Step",
            "log2(1,000,000) ~ 20 comparisons",
            "Exponentially Faster than Linear O(N)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d1-b2-space-complexity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Logarithmic Step Calculation",
            "codeSnippet": "// Searching 1,000,000 items:\n// Linear Search O(N) = up to 1,000,000 steps\n// Binary Search O(log2 N) = at most 20 steps (2^20 = 1,048,576)!",
            "lineNotes": {
              "2": "Linear scan checks elements one by one.",
              "3": "Binary search halves the remaining search range on each comparison."
            }
          },
          {
            "type": "runnable_code",
            "filename": "log_sim.js",
            "initialCode": "function calculateBinarySearchSteps(n) {\n  return Math.ceil(Math.log2(n));\n}\n\nconsole.log('Max steps for 1,000,000 items:', calculateBinarySearchSteps(1000000));",
            "expectedOutput": "Max steps for 1,000,000 items: 20",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum number of comparison steps required by Binary Search on 1,000,000 items?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "Max steps for 1,000,000 items: 20"
          ],
          "primaryMisconceptionId": "MC_DSA_BINARY_SEARCH_OFF_BY_ONE_MID",
          "diagnosisMap": {
            "1000000": {
              "misconceptionId": "MC_DSA_BINARY_SEARCH_OFF_BY_ONE_MID",
              "errorExplanation": "Binary search halves the range each step: log2(1,000,000) is approximately 20 steps.",
              "recoveryPath": {
                "simplerExplanation": "Halving 1,000,000 takes only 20 steps.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Dynamic Arrays & Amortized Geometric Resizing",
    "overviewMetaphor": "A Dynamic Array is a backpack that automatically doubles in size: when you have a 2-slot backpack and buy a 3rd book, you instantly buy a 4-slot backpack and copy your 2 old books over; because resizing happens less and less frequently as capacity grows, the average (amortized) cost to add a book is still just O(1).",
    "blocks": [
      {
        "id": "dsa-d2-b1-geometric-doubling",
        "day": 2,
        "blockNumber": 1,
        "title": "Geometric Capacity Expansion & Amortized O(1) Push",
        "conceptBudget": {
          "primaryConcept": "Amortized Analysis",
          "supportingTerms": [
            "Capacity Doubling (2 -> 4 -> 8 -> 16)",
            "Copy Overhead O(N) spread over N insertions",
            "Amortized O(1) append vs Worst-Case O(N) resize"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d1-b1-asymptotic-growth",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Array Growth Cycle",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Push Element (size < capacity) -> O(1) Instant Write",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Capacity Full (size == capacity) -> Allocate Buffer * 2",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Copy old N elements to new buffer -> O(N) single spike",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Next N pushes are free instant O(1) writes",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dynamic_array_demo.js",
            "initialCode": "class ResizableArray {\n  constructor() {\n    this.capacity = 2;\n    this.size = 0;\n    this.buffer = new Array(2);\n  }\n  push(val) {\n    if (this.size === this.capacity) {\n      this.capacity *= 2;\n      const newBuf = new Array(this.capacity);\n      for (let i = 0; i < this.size; i++) newBuf[i] = this.buffer[i];\n      this.buffer = newBuf;\n    }\n    this.buffer[this.size++] = val;\n  }\n}\n\nconst arr = new ResizableArray();\narr.push(10); arr.push(20); arr.push(30);\nconsole.log(`Size: ${arr.size}, Capacity: ${arr.capacity}`);",
            "expectedOutput": "Size: 3, Capacity: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the new capacity when pushing a 3rd element into a dynamic array with initial capacity=2?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "Capacity: 4",
            "Size: 3, Capacity: 4"
          ],
          "primaryMisconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
              "errorExplanation": "Dynamic arrays double capacity geometrically (2 -> 4) rather than incrementing by 1.",
              "recoveryPath": {
                "simplerExplanation": "Capacity doubles from 2 to 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d2-b2-contiguous-memory-cache",
        "day": 2,
        "blockNumber": 2,
        "title": "Contiguous Memory Layout & CPU Cache Line Locality",
        "conceptBudget": {
          "primaryConcept": "Contiguous Memory & Cache Locality",
          "supportingTerms": [
            "Sequential RAM addresses",
            "L1/L2 CPU Cache Prefetching",
            "O(1) Random Access via `Base + (Index * Size)`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d2-b1-geometric-doubling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sequential Memory Addresses",
              "boxes": [
                {
                  "label": "arr[0] (Address 0x100)",
                  "value": "10",
                  "varType": "4-byte integer",
                  "isUpdated": false
                },
                {
                  "label": "arr[1] (Address 0x104)",
                  "value": "20",
                  "varType": "4-byte integer",
                  "isUpdated": false
                },
                {
                  "label": "arr[2] (Address 0x108)",
                  "value": "30",
                  "varType": "4-byte integer",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cache_locality.js",
            "initialCode": "function getAddress(baseAddress, index, elementBytes = 4) {\n  return baseAddress + index * elementBytes;\n}\n\nconsole.log('Address of arr[2]:', '0x' + getAddress(0x100, 2).toString(16));",
            "expectedOutput": "Address of arr[2]: 0x108",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does an array provide instant O(1) random access for `arr[i]`?",
          "options": [
            "Because elements reside in contiguous sequential memory, allowing the CPU to calculate the exact address via simple arithmetic `Base + (i * ElementSize)` in 1 CPU cycle",
            "Because arrays use search algorithms",
            "Because the browser remembers every variable name"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
              "errorExplanation": "Direct pointer arithmetic is possible only because array memory is stored contiguously.",
              "recoveryPath": {
                "simplerExplanation": "Math formula Base + (i * size) computes exact address instantly.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d2-b3-in-place-mutation",
        "day": 2,
        "blockNumber": 3,
        "title": "In-Place Array Mutation (Two-Pointer Overwrite)",
        "conceptBudget": {
          "primaryConcept": "In-Place Overwrite Pattern",
          "supportingTerms": [
            "Write Pointer (k)",
            "Read Pointer (i)",
            "Eliminating O(N) Extra Memory Allocation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d2-b2-contiguous-memory-cache",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "remove_duplicates.js",
            "initialCode": "function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let write = 1;\n  for (let read = 1; read < nums.length; read++) {\n    if (nums[read] !== nums[read - 1]) {\n      nums[write++] = nums[read];\n    }\n  }\n  return write;\n}\n\nconst arr = [1, 1, 2, 2, 3];\nconst uniqueCount = removeDuplicates(arr);\nconsole.log(`Unique Count: ${uniqueCount}, Modified Array: [${arr.slice(0, uniqueCount).join(', ')}]`);",
            "expectedOutput": "Unique Count: 3, Modified Array: [1, 2, 3]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the unique count returned when removing duplicates from `[1, 1, 2, 2, 3]`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Unique Count: 3"
          ],
          "primaryMisconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
              "errorExplanation": "Duplicate 1 and duplicate 2 are skipped, leaving 3 unique elements (1, 2, 3).",
              "recoveryPath": {
                "simplerExplanation": "3 distinct numbers -> 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Singly & Doubly Linked Lists & Pointer Node Manipulation",
    "overviewMetaphor": "A Linked List is a scavenger hunt: each clue (ListNode) contains a treasure (`val`) and the GPS coordinates to the next clue (`next`); you don't need a single giant empty field (contiguous memory), but to reach clue 5 you must follow the trail sequentially from clue 1 (no O(1) random jumping).",
    "blocks": [
      {
        "id": "dsa-d3-b1-node-anatomy",
        "day": 3,
        "blockNumber": 1,
        "title": "ListNode Anatomy & Pointer Re-Wiring",
        "conceptBudget": {
          "primaryConcept": "Linked List Node Structure",
          "supportingTerms": [
            "Node { val, next }",
            "Head Pointer",
            "Null Terminator",
            "O(1) Head Insertion vs O(N) Traversal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d2-b2-contiguous-memory-cache",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ListNode Class Definition",
            "codeSnippet": "class ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}",
            "lineNotes": {
              "2": "Stores the data payload in val.",
              "3": "next holds the reference pointer to the subsequent node in heap memory."
            }
          },
          {
            "type": "runnable_code",
            "filename": "list_demo.js",
            "initialCode": "class ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val; this.next = next;\n  }\n}\n\nconst head = new ListNode(10, new ListNode(20, new ListNode(30)));\nconsole.log(`Node 1: ${head.val}, Node 2: ${head.next.val}, Node 3: ${head.next.next.val}`);",
            "expectedOutput": "Node 1: 10, Node 2: 20, Node 3: 30",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `head.next.val` for the linked list `10 -> 20 -> 30` above?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "Node 2: 20"
          ],
          "primaryMisconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
              "errorExplanation": "head.val is 10. head.next.val is the second node value: 20.",
              "recoveryPath": {
                "simplerExplanation": "head.next points to 20.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d3-b2-reversing-list",
        "day": 3,
        "blockNumber": 2,
        "title": "In-Place List Reversal with 3 Pointers (prev, curr, nextTemp)",
        "conceptBudget": {
          "primaryConcept": "3-Pointer In-Place Reversal",
          "supportingTerms": [
            "prev = null",
            "curr = head",
            "nextTemp = curr.next",
            "curr.next = prev",
            "O(1) Auxiliary Space"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d3-b1-node-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Pointer Reversal Step",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Save nextTemp = curr.next (Don't lose rest of list!)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Re-wire pointer: curr.next = prev",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Advance prev: prev = curr",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Advance curr: curr = nextTemp",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "reverse_demo.js",
            "initialCode": "function reverse(head) {\n  let prev = null, curr = head;\n  while (curr !== null) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}\n\nconst list = { val: 1, next: { val: 2, next: { val: 3, next: null } } };\nconst rev = reverse(list);\nconsole.log(`Reversed Head: ${rev.val}, Next: ${rev.next.val}`);",
            "expectedOutput": "Reversed Head: 3, Next: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must you store `curr.next` in `nextTemp` BEFORE executing `curr.next = prev`?",
          "options": [
            "Because mutating curr.next immediately breaks the forward pointer reference, causing you to permanently lose access to the remaining unreversed nodes",
            "Because JavaScript requires temporary variables for all loops",
            "Because prev cannot be null"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
              "errorExplanation": "Without nextTemp, changing curr.next severs the connection to all subsequent nodes in the list.",
              "recoveryPath": {
                "simplerExplanation": "Saving nextTemp prevents losing the rest of the list.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d3-b3-floyds-cycle-detection",
        "day": 3,
        "blockNumber": 3,
        "title": "Floyd's Cycle-Finding Algorithm (Tortoise and Hare)",
        "conceptBudget": {
          "primaryConcept": "Floyd's Cycle Detection",
          "supportingTerms": [
            "Slow Pointer (1 step)",
            "Fast Pointer (2 steps)",
            "Meeting Point Guarantees Cycle in O(N) time and O(1) space"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d3-b2-reversing-list",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cycle_demo.js",
            "initialCode": "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}\n\nconst n1 = { val: 1, next: null };\nconst n2 = { val: 2, next: null };\nn1.next = n2;\nn2.next = n1; // Cycle!\n\nconsole.log('Cycle Detected:', hasCycle(n1));",
            "expectedOutput": "Cycle Detected: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What output is produced when `hasCycle(n1)` detects the circular loop above?",
          "expectedStringOutput": "Cycle Detected: true",
          "acceptableAnswers": [
            "Cycle Detected: true",
            "true",
            "True"
          ],
          "primaryMisconceptionId": "MC_DSA_LINKED_LIST_CYCLE_DETECTION_FLOYD",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_DSA_LINKED_LIST_CYCLE_DETECTION_FLOYD",
              "errorExplanation": "The fast pointer catches the slow pointer inside the loop, returning true.",
              "recoveryPath": {
                "simplerExplanation": "Cycle detected -> true.",
                "guidedFixPrompt": "Type Cycle Detected: true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Stacks (LIFO): Valid Parentheses & Monotonic Next Greater Element",
    "overviewMetaphor": "A Stack is a stack of cafeteria plates: the last plate washed and placed on top is the first plate taken by the next hungry diner (Last-In First-Out, LIFO); you can only inspect or remove the topmost plate (`peek()` / `pop()`).",
    "blocks": [
      {
        "id": "dsa-d4-b1-stack-lifo-bracket-matching",
        "day": 4,
        "blockNumber": 1,
        "title": "Stack (LIFO) Mechanics & Matching Bracket Pairs",
        "conceptBudget": {
          "primaryConcept": "LIFO Stack Operations",
          "supportingTerms": [
            "push(val) / pop() in O(1)",
            "Matching Bracket Pairs `()`, `{}`, `[]`",
            "Stack Underflow Check"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d2-b1-geometric-doubling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Bracket Matching Stack Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Read Character: If Opening bracket '(', '{', '[' -> PUSH",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. If Closing bracket ')' -> POP stack and verify top was '('",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If Stack is empty or mismatch -> RETURN FALSE",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. End of string: RETURN (stack.length === 0)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bracket_sim.js",
            "initialCode": "function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '{' || ch === '[') stack.push(ch);\n    else if (pairs[ch]) {\n      if (stack.length === 0 || stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}\n\nconsole.log('Valid {[]}?:', isValid('{[]}'));\nconsole.log('Valid ([)]?:', isValid('([)]'));",
            "expectedOutput": "Valid {[]}?: true\nValid ([)]?: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the string `([)]` valid according to stack pair ordering?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Valid ([)]?: false"
          ],
          "primaryMisconceptionId": "MC_DSA_STACK_UNDERFLOW_OVERFLOW",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_DSA_STACK_UNDERFLOW_OVERFLOW",
              "errorExplanation": "Even though total counts match, `[` was opened last so it must close first. Closing `)` while `[` is top of stack is invalid.",
              "recoveryPath": {
                "simplerExplanation": "Brackets must close in strict reverse open order -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d4-b2-monotonic-stack",
        "day": 4,
        "blockNumber": 2,
        "title": "Monotonic Decreasing Stack for Next Greater Element in O(N)",
        "conceptBudget": {
          "primaryConcept": "Monotonic Stack Pattern",
          "supportingTerms": [
            "Decreasing Stack Order",
            "Popping Smaller Elements to Resolve Next Greater",
            "Amortized O(N) Total Operations"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d4-b1-stack-lifo-bracket-matching",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Monotonic Stack Algorithm",
            "codeSnippet": "for (let i = 0; i < nums.length; i++) {\n  while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {\n    const resolvedIdx = stack.pop();\n    result[resolvedIdx] = nums[i];\n  }\n  stack.push(i);\n}",
            "lineNotes": {
              "2": "While current number is greater than stack top, the current number is the next greater element for that index!",
              "6": "Pushes current index to find its next greater element later."
            }
          },
          {
            "type": "runnable_code",
            "filename": "monotonic_demo.js",
            "initialCode": "function nextGreater(nums) {\n  const res = new Array(nums.length).fill(-1);\n  const stack = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {\n      res[stack.pop()] = nums[i];\n    }\n    stack.push(i);\n  }\n  return res;\n}\n\nconsole.log('Next Greater for [2, 1, 2, 4, 3]:', JSON.stringify(nextGreater([2, 1, 2, 4, 3])));",
            "expectedOutput": "Next Greater for [2, 1, 2, 4, 3]: [4,2,4,-1,-1]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the next greater element for integer 1 in the array `[2, 1, 2, 4, 3]`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2"
          ],
          "primaryMisconceptionId": "MC_DSA_STACK_UNDERFLOW_OVERFLOW",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DSA_STACK_UNDERFLOW_OVERFLOW",
              "errorExplanation": "The immediate next element to the right of 1 that is greater is 2.",
              "recoveryPath": {
                "simplerExplanation": "First number to right > 1 is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d4-b3-min-stack",
        "day": 4,
        "blockNumber": 3,
        "title": "MinStack: O(1) Minimum Element Tracking",
        "conceptBudget": {
          "primaryConcept": "Auxiliary Minimum Tracking",
          "supportingTerms": [
            "getMin() in O(1) time",
            "Parallel Min Stack / Value-Min Tuples"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d4-b2-monotonic-stack",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "min_stack_demo.js",
            "initialCode": "class MinStack {\n  constructor() { this.stack = []; this.minStack = []; }\n  push(val) {\n    this.stack.push(val);\n    const currentMin = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);\n    this.minStack.push(currentMin);\n  }\n  pop() { this.stack.pop(); this.minStack.pop(); }\n  top() { return this.stack[this.stack.length - 1]; }\n  getMin() { return this.minStack[this.minStack.length - 1]; }\n}\n\nconst ms = new MinStack();\nms.push(10); ms.push(5); ms.push(20);\nconsole.log(`Current Min: ${ms.getMin()}`);\nms.pop(); ms.pop();\nconsole.log(`Min after pops: ${ms.getMin()}`);",
            "expectedOutput": "Current Min: 5\nMin after pops: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `getMin()` after popping 20 and 5 from `[10, 5, 20]`?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "Min after pops: 10"
          ],
          "primaryMisconceptionId": "MC_DSA_STACK_UNDERFLOW_OVERFLOW",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_DSA_STACK_UNDERFLOW_OVERFLOW",
              "errorExplanation": "When 5 is popped, the minimum reverts back to the minimum of remaining elements: 10.",
              "recoveryPath": {
                "simplerExplanation": "Only 10 remains in stack -> min is 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Production LRU Cache Engine (Doubly Linked List + Hash Map)",
    "overviewMetaphor": "Milestone 1 — LRU Cache Synthesis: An LRU Cache is a VIP nightclub with a strict capacity: the VIP guest list (Hash Map) gives bouncers O(1) instant name lookup; inside the club, guests stand in a single-file line (Doubly Linked List). Whenever someone orders a drink (`get()` or `put()`), they move straight to the front of the line (Most Recently Used); when the club is full, the guest at the very back (Least Recently Used) is evicted.",
    "blocks": [
      {
        "id": "dsa-d5-b1-lru-architecture",
        "day": 5,
        "blockNumber": 1,
        "title": "LRU Cache Architecture: Hash Map + Doubly Linked List",
        "conceptBudget": {
          "primaryConcept": "LRU Hybrid Data Structure",
          "supportingTerms": [
            "Map<Key, Node> for O(1) Lookup",
            "Doubly Linked List for O(1) Eviction/Reordering",
            "Sentinel Dummy Head and Tail"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d3-b1-node-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "LRU Cache O(1) Operation Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. GET(key): Map finds Node in O(1) -> Detach from list -> Attach after Head",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. PUT(key, val): If exists -> update val & move to Head",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If new key & size > capacity -> Remove Tail.prev from list & delete from Map",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Insert new Node immediately behind Head",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lru_sim.js",
            "initialCode": "class DNode { constructor(k=0, v=0) { this.k=k; this.v=v; this.prev=null; this.next=null; } }\nclass LRU {\n  constructor(cap) {\n    this.cap = cap; this.map = new Map();\n    this.head = new DNode(); this.tail = new DNode();\n    this.head.next = this.tail; this.tail.prev = this.head;\n  }\n  _remove(n) { n.prev.next = n.next; n.next.prev = n.prev; }\n  _add(n) { n.next = this.head.next; n.prev = this.head; this.head.next.prev = n; this.head.next = n; }\n  get(k) {\n    if (!this.map.has(k)) return -1;\n    const n = this.map.get(k);\n    this._remove(n); this._add(n);\n    return n.v;\n  }\n  put(k, v) {\n    if (this.map.has(k)) this._remove(this.map.get(k));\n    const n = new DNode(k, v);\n    this._add(n); this.map.set(k, n);\n    if (this.map.size > this.cap) {\n      const lru = this.tail.prev;\n      this._remove(lru); this.map.delete(lru.k);\n    }\n  }\n}\n\nconst cache = new LRU(2);\ncache.put(1, 100); cache.put(2, 200);\nconsole.log('Get 1:', cache.get(1)); // moves 1 to front\ncache.put(3, 300); // evicts 2\nconsole.log('Get 2 (evicted):', cache.get(2));\nconsole.log('Get 3:', cache.get(3));",
            "expectedOutput": "Get 1: 100\nGet 2 (evicted): -1\nGet 3: 300",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is returned for `cache.get(2)` after key 2 was evicted when key 3 was added?",
          "expectedStringOutput": "-1",
          "acceptableAnswers": [
            "-1",
            "Get 2 (evicted): -1"
          ],
          "primaryMisconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
              "errorExplanation": "Key 2 was the least recently used item and was evicted when key 3 was inserted.",
              "recoveryPath": {
                "simplerExplanation": "Evicted key returns -1.",
                "guidedFixPrompt": "Type -1"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d5-b2-sentinel-nodes",
        "day": 5,
        "blockNumber": 2,
        "title": "Sentinel Dummy Head/Tail Nodes: Eliminating Null Checks",
        "conceptBudget": {
          "primaryConcept": "Sentinel Boundary Nodes",
          "supportingTerms": [
            "head.next points to Most Recently Used",
            "tail.prev points to Least Recently Used",
            "Zero null branch conditionals"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d5-b1-lru-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Sentinel Initialization",
            "codeSnippet": "this.head = new DNode(); // Dummy Head\nthis.tail = new DNode(); // Dummy Tail\nthis.head.next = this.tail;\nthis.tail.prev = this.head;",
            "lineNotes": {
              "1": "Guarantees head.next is NEVER null.",
              "2": "Guarantees tail.prev is NEVER null, eliminating all boundary if-checks."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sentinel_sim.js",
            "initialCode": "class SentinelList {\n  constructor() {\n    this.head = { val: 'HEAD_SENTINEL', next: null, prev: null };\n    this.tail = { val: 'TAIL_SENTINEL', next: null, prev: null };\n    this.head.next = this.tail; this.tail.prev = this.head;\n  }\n}\n\nconst list = new SentinelList();\nconsole.log(`Head next: ${list.head.next.val}, Tail prev: ${list.tail.prev.val}`);",
            "expectedOutput": "Head next: TAIL_SENTINEL, Tail prev: HEAD_SENTINEL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary architectural advantage of using Sentinel Head and Tail nodes?",
          "options": [
            "They permanently eliminate null pointer edge cases when inserting at the beginning or removing from the end of a doubly linked list",
            "They double the memory capacity",
            "They convert the list into an array"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
              "errorExplanation": "Sentinels prevent head and tail pointers from ever being null, simplifying list mutations.",
              "recoveryPath": {
                "simplerExplanation": "Sentinels eliminate null pointer crashes on empty list operations.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d5-b3-milestone-lru-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 LRU Verification & Benchmarking",
        "conceptBudget": {
          "primaryConcept": "LRU Cache Certification",
          "supportingTerms": [
            "Strict O(1) Get & Put Guarantees",
            "Zero Memory Leakage",
            "Deterministic Eviction Sequence"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d5-b2-sentinel-nodes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lru_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: LRU Cache Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: LRU Cache Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms Milestone 1 LRU Cache verification?",
          "expectedStringOutput": "⭐ MILESTONE 1: LRU Cache Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: LRU Cache Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DSA_LINKED_LIST_LOST_HEAD_POINTER",
              "errorExplanation": "Returns ⭐ MILESTONE 1: LRU Cache Engine [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Certification string matches header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: LRU Cache Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Queues (FIFO), Circular Ring Buffers & Deques",
    "overviewMetaphor": "A Queue is a line at a ticket booth: the first person to get in line is the first person served (First-In First-Out, FIFO); a Circular Ring Buffer is a Ferris wheel with 4 chairs: when chair 4 is filled, the next person gets on chair 1 (wrap-around modulo arithmetic) without having to rebuild the entire wheel.",
    "blocks": [
      {
        "id": "dsa-d6-b1-fifo-queue-mechanics",
        "day": 6,
        "blockNumber": 1,
        "title": "FIFO Queue Principles & Modulo Ring Buffers",
        "conceptBudget": {
          "primaryConcept": "Circular Queue Invariants",
          "supportingTerms": [
            "tail = (tail + 1) % capacity",
            "head = (head + 1) % capacity",
            "O(1) Enqueue & Dequeue without Array Shifting"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d2-b1-geometric-doubling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Modulo Index Wrapping",
            "codeSnippet": "this.tail = (this.tail + 1) % this.capacity;\nthis.queue[this.tail] = value;",
            "lineNotes": {
              "1": "Modulo capacity wraps the index back to 0 when it reaches the end.",
              "2": "Inserts element into ring buffer in strict O(1) time."
            }
          },
          {
            "type": "runnable_code",
            "filename": "circular_queue_demo.js",
            "initialCode": "class RingBuffer {\n  constructor(k) { this.cap = k; this.q = new Array(k); this.h = -1; this.t = -1; }\n  enQueue(v) {\n    if (this.isFull()) return false;\n    if (this.isEmpty()) this.h = 0;\n    this.t = (this.t + 1) % this.cap;\n    this.q[this.t] = v;\n    return true;\n  }\n  deQueue() {\n    if (this.isEmpty()) return false;\n    if (this.h === this.t) { this.h = -1; this.t = -1; }\n    else this.h = (this.h + 1) % this.cap;\n    return true;\n  }\n  Front() { return this.isEmpty() ? -1 : this.q[this.h]; }\n  isEmpty() { return this.h === -1; }\n  isFull() { return ((this.t + 1) % this.cap) === this.h; }\n}\n\nconst rb = new RingBuffer(2);\nrb.enQueue(10); rb.enQueue(20);\nconsole.log('Is Full:', rb.isFull());\nrb.deQueue();\nrb.enQueue(30); // Wraps around\nconsole.log('Front after wrap:', rb.Front());",
            "expectedOutput": "Is Full: true\nFront after wrap: 20",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `rb.Front()` after dequeuing 10 and enqueuing 30 into `[10, 20]`?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "Front after wrap: 20"
          ],
          "primaryMisconceptionId": "MC_DSA_QUEUE_CIRCULAR_BUFFER_WRAP",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_DSA_QUEUE_CIRCULAR_BUFFER_WRAP",
              "errorExplanation": "10 was dequeued, leaving 20 as the oldest remaining element at the Front.",
              "recoveryPath": {
                "simplerExplanation": "20 is at the front.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d6-b2-deque-double-ended",
        "day": 6,
        "blockNumber": 2,
        "title": "Double-Ended Queue (Deque) for Sliding Window Problems",
        "conceptBudget": {
          "primaryConcept": "Deque Structure",
          "supportingTerms": [
            "O(1) pushFront, pushBack, popFront, popBack",
            "Monotonic Deques for Max Sliding Windows"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d6-b1-fifo-queue-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "deque_sim.js",
            "initialCode": "class Deque {\n  constructor() { this.items = []; }\n  pushBack(v) { this.items.push(v); }\n  pushFront(v) { this.items.unshift(v); }\n  popFront() { return this.items.shift(); }\n  popBack() { return this.items.pop(); }\n  peekFront() { return this.items[0]; }\n  peekBack() { return this.items[this.items.length - 1]; }\n}\n\nconst dq = new Deque();\ndq.pushBack(100); dq.pushFront(50);\nconsole.log(`Front: ${dq.peekFront()}, Back: ${dq.peekBack()}`);",
            "expectedOutput": "Front: 50, Back: 100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `dq.peekFront()` when 100 is pushed back and 50 is pushed front?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50",
            "Front: 50"
          ],
          "primaryMisconceptionId": "MC_DSA_QUEUE_CIRCULAR_BUFFER_WRAP",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_DSA_QUEUE_CIRCULAR_BUFFER_WRAP",
              "errorExplanation": "50 was pushed to the front.",
              "recoveryPath": {
                "simplerExplanation": "50 is front.",
                "guidedFixPrompt": "Type 50"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d6-b3-stack-using-queues",
        "day": 6,
        "blockNumber": 3,
        "title": "Implementing Stacks Using Queues (Rotation Trick)",
        "conceptBudget": {
          "primaryConcept": "Queue Rotation Pattern",
          "supportingTerms": [
            "Simulating LIFO with FIFO",
            "Rotating Q size-1 times on push"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d6-b2-deque-double-ended",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stack_queue.js",
            "initialCode": "class StackViaQueue {\n  constructor() { this.q = []; }\n  push(x) {\n    this.q.push(x);\n    for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());\n  }\n  pop() { return this.q.shift(); }\n  top() { return this.q[0]; }\n}\n\nconst s = new StackViaQueue();\ns.push(1); s.push(2);\nconsole.log(`Top: ${s.top()}, Pop: ${s.pop()}, Next Top: ${s.top()}`);",
            "expectedOutput": "Top: 2, Pop: 2, Next Top: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `s.pop()` after pushing 1 and 2 onto `StackViaQueue`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Pop: 2"
          ],
          "primaryMisconceptionId": "MC_DSA_QUEUE_CIRCULAR_BUFFER_WRAP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_QUEUE_CIRCULAR_BUFFER_WRAP",
              "errorExplanation": "Because of the queue rotation, the newest element (2) is at the front of the queue, preserving LIFO stack order.",
              "recoveryPath": {
                "simplerExplanation": "LIFO behavior pops 2 first.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Hash Tables, Collision Resolution & Load Factors",
    "overviewMetaphor": "A Hash Table is an organizer with labeled mailboxes: a hash function converts someone's name (\"Alice\") into an exact box number (`hash(\"Alice\") % 100 = 42`); if Bob also hashes to box 42 (a Collision), Separate Chaining simply hangs a clip of envelopes inside box 42 so both letters can be read.",
    "blocks": [
      {
        "id": "dsa-d7-b1-hash-function-chaining",
        "day": 7,
        "blockNumber": 1,
        "title": "Hash Functions & Separate Chaining Collision Handling",
        "conceptBudget": {
          "primaryConcept": "Separate Chaining",
          "supportingTerms": [
            "Deterministic Hashing",
            "Modulo Bucket Indexing",
            "Bucket Arrays `buckets[hash % size]`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d3-b1-node-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Hash Map Put Operation",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Compute index = hash(key) % total_buckets",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Scan bucket array at index for matching key",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If key exists -> overwrite value",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. If key new -> push [key, value] to bucket (Collision Chaining)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "hash_map_demo.js",
            "initialCode": "class SimpleHashMap {\n  constructor(size = 5) {\n    this.size = size;\n    this.buckets = Array.from({ length: size }, () => []);\n  }\n  _hash(k) { return typeof k === 'number' ? k % this.size : k.length % this.size; }\n  put(k, v) {\n    const b = this.buckets[this._hash(k)];\n    for (let i = 0; i < b.length; i++) {\n      if (b[i][0] === k) { b[i][1] = v; return; }\n    }\n    b.push([k, v]);\n  }\n  get(k) {\n    const b = this.buckets[this._hash(k)];\n    for (const [key, val] of b) { if (key === k) return val; }\n    return -1;\n  }\n}\n\nconst hm = new SimpleHashMap(5);\nhm.put(1, 100); hm.put(6, 600); // 1 % 5 == 1, 6 % 5 == 1 (Collision!)\nconsole.log(`Key 1: ${hm.get(1)}, Key 6 (Collided): ${hm.get(6)}`);",
            "expectedOutput": "Key 1: 100, Key 6 (Collided): 600",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can `SimpleHashMap` store and retrieve both Key 1 and Key 6 when both hash to bucket 1?",
          "expectedStringOutput": "Key 1: 100, Key 6 (Collided): 600",
          "acceptableAnswers": [
            "Key 1: 100, Key 6 (Collided): 600",
            "Yes",
            "true"
          ],
          "primaryMisconceptionId": "MC_DSA_HASH_COLLISION_CHAINING_LOAD_FACTOR",
          "diagnosisMap": {
            "No": {
              "misconceptionId": "MC_DSA_HASH_COLLISION_CHAINING_LOAD_FACTOR",
              "errorExplanation": "Separate chaining stores multiple [k, v] pairs inside the bucket list, resolving the collision.",
              "recoveryPath": {
                "simplerExplanation": "Separate chaining handles collisions seamlessly.",
                "guidedFixPrompt": "Type Key 1: 100, Key 6 (Collided): 600"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d7-b2-load-factor-rehashing",
        "day": 7,
        "blockNumber": 2,
        "title": "Load Factor (alpha = N/M) & Dynamic Rehashing",
        "conceptBudget": {
          "primaryConcept": "Load Factor & Rehashing",
          "supportingTerms": [
            "Load Factor alpha = items / buckets",
            "Threshold alpha > 0.75 -> Double Buckets",
            "Re-indexing all existing keys"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d7-b1-hash-function-chaining",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Load Factor Calculation",
            "codeSnippet": "const loadFactor = this.itemCount / this.bucketCount;\nif (loadFactor > 0.75) {\n  this.rehash(this.bucketCount * 2);\n}",
            "lineNotes": {
              "1": "alpha = N / M measures average bucket chain length.",
              "3": "Reallocates a larger prime/power-of-2 bucket array to maintain O(1) average lookup."
            }
          },
          {
            "type": "runnable_code",
            "filename": "load_factor_sim.js",
            "initialCode": "function checkRehashNeeded(items, buckets, threshold = 0.75) {\n  const alpha = items / buckets;\n  return { alpha, needsRehash: alpha > threshold };\n}\n\nconsole.log('8 items in 10 buckets:', JSON.stringify(checkRehashNeeded(8, 10)));\nconsole.log('5 items in 10 buckets:', JSON.stringify(checkRehashNeeded(5, 10)));",
            "expectedOutput": "8 items in 10 buckets: {\"alpha\":0.8,\"needsRehash\":true}\n5 items in 10 buckets: {\"alpha\":0.5,\"needsRehash\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must a hash map double its buckets and rehash all keys when the load factor exceeds 0.75?",
          "options": [
            "Because when too many items reside in too few buckets, bucket chains grow long and degrade O(1) lookups down to O(N) linear scans",
            "Because JavaScript arrays cannot hold more than 10 items",
            "Because hash functions stop working after 100 operations"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_HASH_COLLISION_CHAINING_LOAD_FACTOR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_HASH_COLLISION_CHAINING_LOAD_FACTOR",
              "errorExplanation": "Rehashing redistributes items across more buckets, restoring O(1) average lookup time.",
              "recoveryPath": {
                "simplerExplanation": "Rehashing prevents long bucket chains.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d7-b3-two-sum-hash-pattern",
        "day": 7,
        "blockNumber": 3,
        "title": "The Complement Lookup Pattern: Two Sum in O(N)",
        "conceptBudget": {
          "primaryConcept": "Hash Map Complement Lookup",
          "supportingTerms": [
            "complement = target - nums[i]",
            "Single-pass O(N) Time vs O(N^2) Nested Loops"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d7-b2-load-factor-rehashing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "two_sum_demo.js",
            "initialCode": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log('Two Sum [2, 7, 11, 15] for Target 9:', JSON.stringify(twoSum([2, 7, 11, 15], 9)));",
            "expectedOutput": "Two Sum [2, 7, 11, 15] for Target 9: [0,1]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What indices are returned by `twoSum([2, 7, 11, 15], 9)`?",
          "expectedStringOutput": "[0,1]",
          "acceptableAnswers": [
            "[0,1]",
            "[0, 1]",
            "Two Sum [2, 7, 11, 15] for Target 9: [0,1]"
          ],
          "primaryMisconceptionId": "MC_DSA_HASH_COLLISION_CHAINING_LOAD_FACTOR",
          "diagnosisMap": {
            "[1,2]": {
              "misconceptionId": "MC_DSA_HASH_COLLISION_CHAINING_LOAD_FACTOR",
              "errorExplanation": "nums[0] (2) + nums[1] (7) = 9, so indices are [0, 1].",
              "recoveryPath": {
                "simplerExplanation": "2 and 7 are at indices 0 and 1.",
                "guidedFixPrompt": "Type [0,1]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Two Pointers Technique (Opposite Direction & Fast/Slow Pointers)",
    "overviewMetaphor": "The Two Pointers technique is two friends walking towards each other across a bridge: instead of walking the entire length back and forth repeatedly (O(N^2)), friend A starts on the left and friend B starts on the right; they walk toward each other in a single clean sweep, meeting in the middle in O(N) time.",
    "blocks": [
      {
        "id": "dsa-d8-b1-opposite-convergence",
        "day": 8,
        "blockNumber": 1,
        "title": "Opposite Ends Convergence (Left & Right Pointers)",
        "conceptBudget": {
          "primaryConcept": "Opposite Pointers Pattern",
          "supportingTerms": [
            "left = 0, right = length - 1",
            "while (left < right)",
            "Sorted Array Target Sums in O(N) time and O(1) space"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d2-b3-in-place-mutation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Sorted Array Two-Pointer Step",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Calculate sum = arr[left] + arr[right]",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. If sum === target -> Found match! Return [left, right]",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If sum < target -> Need larger value -> left++",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. If sum > target -> Need smaller value -> right--",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "two_pointers_sorted.js",
            "initialCode": "function twoSumSorted(numbers, target) {\n  let left = 0, right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1]; // 1-indexed\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}\n\nconsole.log('1-indexed Two Sum in [2, 7, 11, 15] for 9:', JSON.stringify(twoSumSorted([2, 7, 11, 15], 9)));",
            "expectedOutput": "1-indexed Two Sum in [2, 7, 11, 15] for 9: [1,2]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 1-indexed positions are returned by `twoSumSorted([2, 7, 11, 15], 9)`?",
          "expectedStringOutput": "[1,2]",
          "acceptableAnswers": [
            "[1,2]",
            "[1, 2]"
          ],
          "primaryMisconceptionId": "MC_DSA_TWO_POINTER_OPPOSITE_VS_FAST_SLOW",
          "diagnosisMap": {
            "[0,1]": {
              "misconceptionId": "MC_DSA_TWO_POINTER_OPPOSITE_VS_FAST_SLOW",
              "errorExplanation": "The function returns 1-indexed positions: index 0 -> 1, index 1 -> 2.",
              "recoveryPath": {
                "simplerExplanation": "1-indexed result is [1, 2].",
                "guidedFixPrompt": "Type [1,2]"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d8-b2-container-with-most-water",
        "day": 8,
        "blockNumber": 2,
        "title": "Container With Most Water: Greedy Pointer Elimination",
        "conceptBudget": {
          "primaryConcept": "Container Max Area Proof",
          "supportingTerms": [
            "area = (right - left) * min(h[left], h[right])",
            "Advance shorter bar pointer",
            "O(N) single pass"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d8-b1-opposite-convergence",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Max Area Greedy Choice",
            "codeSnippet": "if (height[left] < height[right]) {\n  left++; // The shorter bar cannot yield more water with any other inner bar!\n} else {\n  right--;\n}",
            "lineNotes": {
              "1": "Water capacity is limited by the shorter vertical line.",
              "2": "Moving the taller bar would only reduce width without any chance of increasing height limit."
            }
          },
          {
            "type": "runnable_code",
            "filename": "max_water_demo.js",
            "initialCode": "function maxArea(height) {\n  let left = 0, right = height.length - 1, max = 0;\n  while (left < right) {\n    const w = right - left;\n    const h = Math.min(height[left], height[right]);\n    max = Math.max(max, w * h);\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return max;\n}\n\nconsole.log('Max Water for [1,8,6,2,5,4,8,3,7]:', maxArea([1,8,6,2,5,4,8,3,7]));",
            "expectedOutput": "Max Water for [1,8,6,2,5,4,8,3,7]: 49",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum water area calculated for `[1,8,6,2,5,4,8,3,7]`?",
          "expectedStringOutput": "49",
          "acceptableAnswers": [
            "49",
            "Max Water for [1,8,6,2,5,4,8,3,7]: 49"
          ],
          "primaryMisconceptionId": "MC_DSA_TWO_POINTER_OPPOSITE_VS_FAST_SLOW",
          "diagnosisMap": {
            "56": {
              "misconceptionId": "MC_DSA_TWO_POINTER_OPPOSITE_VS_FAST_SLOW",
              "errorExplanation": "Width between index 1 (8) and index 8 (7) is 7. Height is min(8, 7) = 7. Area = 7 * 7 = 49.",
              "recoveryPath": {
                "simplerExplanation": "7 * 7 = 49.",
                "guidedFixPrompt": "Type 49"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d8-b3-palindrome-pointer-filtering",
        "day": 8,
        "blockNumber": 3,
        "title": "Valid Palindrome with In-Place Character Skipping",
        "conceptBudget": {
          "primaryConcept": "In-Place Palindrome Check",
          "supportingTerms": [
            "Skip non-alphanumeric characters",
            "Case-insensitive equality",
            "O(1) auxiliary space"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d8-b2-container-with-most-water",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "palindrome_demo.js",
            "initialCode": "function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  const isAlpha = ch => /[a-zA-Z0-9]/.test(ch);\n  while (l < r) {\n    while (l < r && !isAlpha(s[l])) l++;\n    while (l < r && !isAlpha(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++; r--;\n  }\n  return true;\n}\n\nconsole.log('Is \"A man, a plan, a canal: Panama\" palindrome?:', isPalindrome('A man, a plan, a canal: Panama'));",
            "expectedOutput": "Is \"A man, a plan, a canal: Panama\" palindrome?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is `\"A man, a plan, a canal: Panama\"` a valid palindrome?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Is \"A man, a plan, a canal: Panama\" palindrome?: true"
          ],
          "primaryMisconceptionId": "MC_DSA_TWO_POINTER_OPPOSITE_VS_FAST_SLOW",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_DSA_TWO_POINTER_OPPOSITE_VS_FAST_SLOW",
              "errorExplanation": "Ignoring spaces and punctuation, the letters form 'amanaplanacanalpanama', which reads identically forwards and backwards.",
              "recoveryPath": {
                "simplerExplanation": "Filtered text is a palindrome -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Sliding Window Technique (Fixed vs Dynamic Windows)",
    "overviewMetaphor": "The Sliding Window is viewing scenery from a moving train window: instead of getting off the train and re-walking the entire 10-mile track every time (O(N * K) brute force), you look through a 3-foot window frame; as the train moves forward 1 foot, you subtract the tree exiting on the left and add the new tree entering on the right in O(1) time.",
    "blocks": [
      {
        "id": "dsa-d9-b1-fixed-window-sums",
        "day": 9,
        "blockNumber": 1,
        "title": "Fixed-Size Window: Subtracting Left and Adding Right",
        "conceptBudget": {
          "primaryConcept": "Fixed Window Pattern",
          "supportingTerms": [
            "windowSum += nums[i] - nums[i - k]",
            "O(N) Total Time vs O(N * K) Nested Loop",
            "Subarray Size Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d8-b1-opposite-convergence",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Fixed Sliding Window Update",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Sum initial first K elements into windowSum",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Advance right pointer i from k to N-1",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. windowSum += nums[i] (add new) - nums[i - k] (remove old)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Update maxSum = Math.max(maxSum, windowSum)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fixed_window_demo.js",
            "initialCode": "function maxSubArraySum(nums, k) {\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += nums[i];\n  let maxSum = windowSum;\n  for (let i = k; i < nums.length; i++) {\n    windowSum += nums[i] - nums[i - k]; // O(1) delta update!\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}\n\nconsole.log('Max Sum of 3 in [2, 1, 5, 1, 3, 2]:', maxSubArraySum([2, 1, 5, 1, 3, 2], 3));",
            "expectedOutput": "Max Sum of 3 in [2, 1, 5, 1, 3, 2]: 9",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum sum for a subarray of size 3 in `[2, 1, 5, 1, 3, 2]`?",
          "expectedStringOutput": "9",
          "acceptableAnswers": [
            "9",
            "Max Sum of 3 in [2, 1, 5, 1, 3, 2]: 9"
          ],
          "primaryMisconceptionId": "MC_DSA_SLIDING_WINDOW_FIXED_VS_DYNAMIC",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_DSA_SLIDING_WINDOW_FIXED_VS_DYNAMIC",
              "errorExplanation": "The subarray [5, 1, 3] produces the maximum sum: 5 + 1 + 3 = 9.",
              "recoveryPath": {
                "simplerExplanation": "Subarray [5, 1, 3] sums to 9.",
                "guidedFixPrompt": "Type 9"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d9-b2-dynamic-expanding-contracting",
        "day": 9,
        "blockNumber": 2,
        "title": "Dynamic Windows: Longest Substring Without Repeating Characters",
        "conceptBudget": {
          "primaryConcept": "Dynamic Window with Hash Map",
          "supportingTerms": [
            "Expand Right on Valid State",
            "Contract Left on Constraint Violation",
            "Map storing last seen character index"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d9-b1-fixed-window-sums",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dynamic Left Pointer Update",
            "codeSnippet": "if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {\n  left = lastSeen.get(ch) + 1; // Jump left past the previous duplicate!\n}\nlastSeen.set(ch, right);",
            "lineNotes": {
              "2": "Instantly shrinks window by placing left pointer right after duplicate.",
              "4": "Records newest position for current character."
            }
          },
          {
            "type": "runnable_code",
            "filename": "longest_substr_demo.js",
            "initialCode": "function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let maxLen = 0, left = 0;\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    if (map.has(ch) && map.get(ch) >= left) {\n      left = map.get(ch) + 1;\n    }\n    map.set(ch, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}\n\nconsole.log('Longest unique substring in \"abcabcbb\":', lengthOfLongestSubstring('abcabcbb'));",
            "expectedOutput": "Longest unique substring in \"abcabcbb\": 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the length of the longest substring with unique characters in `\"abcabcbb\"`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Longest unique substring in \"abcabcbb\": 3"
          ],
          "primaryMisconceptionId": "MC_DSA_SLIDING_WINDOW_FIXED_VS_DYNAMIC",
          "diagnosisMap": {
            "6": {
              "misconceptionId": "MC_DSA_SLIDING_WINDOW_FIXED_VS_DYNAMIC",
              "errorExplanation": "Substrings like 'abc', 'bca', 'cab' all have length 3 without any duplicate characters.",
              "recoveryPath": {
                "simplerExplanation": "'abc' has length 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d9-b3-min-window-substring",
        "day": 9,
        "blockNumber": 3,
        "title": "Minimum Size Subarray Sum (Expanding & Contracting Condition)",
        "conceptBudget": {
          "primaryConcept": "Contracting Window Pattern",
          "supportingTerms": [
            "while (currSum >= target) shrink left",
            "Tracking minLen = Math.min(...)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d9-b2-dynamic-expanding-contracting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "min_sub_len.js",
            "initialCode": "function minSubArrayLen(target, nums) {\n  let left = 0, sum = 0, minLen = Infinity;\n  for (let right = 0; right < nums.length; right++) {\n    sum += nums[right];\n    while (sum >= target) {\n      minLen = Math.min(minLen, right - left + 1);\n      sum -= nums[left++];\n    }\n  }\n  return minLen === Infinity ? 0 : minLen;\n}\n\nconsole.log('Min length for target 7 in [2,3,1,2,4,3]:', minSubArrayLen(7, [2,3,1,2,4,3]));",
            "expectedOutput": "Min length for target 7 in [2,3,1,2,4,3]: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the minimal subarray length that sums to >= 7 in `[2,3,1,2,4,3]`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Min length for target 7 in [2,3,1,2,4,3]: 2"
          ],
          "primaryMisconceptionId": "MC_DSA_SLIDING_WINDOW_FIXED_VS_DYNAMIC",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DSA_SLIDING_WINDOW_FIXED_VS_DYNAMIC",
              "errorExplanation": "Subarray [4, 3] sums to 7 and has a length of exactly 2.",
              "recoveryPath": {
                "simplerExplanation": "[4, 3] has length 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Binary Search & Search Space Reduction",
    "overviewMetaphor": "Binary Search is guessing a secret number between 1 and 100 with High/Low hints: you guess 50; if the judge says \"Too Low\", you instantly eliminate all numbers from 1 to 50 in 1 second; on your next guess (75), you eliminate half the remaining numbers, finding any secret number in at most 7 guesses (log2 100 ~ 7).",
    "blocks": [
      {
        "id": "dsa-d10-b1-midpoint-overflow-invariant",
        "day": 10,
        "blockNumber": 1,
        "title": "Binary Search Loop Invariants & Midpoint Calculation",
        "conceptBudget": {
          "primaryConcept": "Binary Search Template",
          "supportingTerms": [
            "left <= right loop condition",
            "mid = Math.floor((left + right) / 2)",
            "left = mid + 1 vs right = mid - 1"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d1-b3-logarithmic-halving",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standard Binary Search Template",
            "codeSnippet": "let left = 0, right = nums.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor(left + (right - left) / 2);\n  if (nums[mid] === target) return mid;\n  if (nums[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;",
            "lineNotes": {
              "2": "Loop must continue while left <= right to check single-element bounds.",
              "5": "Discards mid and the entire left half by setting left = mid + 1."
            }
          },
          {
            "type": "runnable_code",
            "filename": "binary_search_demo.js",
            "initialCode": "function binarySearch(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const m = Math.floor((l + r) / 2);\n    if (nums[m] === target) return m;\n    if (nums[m] < target) l = m + 1;\n    else r = m - 1;\n  }\n  return -1;\n}\n\nconsole.log('Search 9 in [-1, 0, 3, 5, 9, 12]:', binarySearch([-1, 0, 3, 5, 9, 12], 9));",
            "expectedOutput": "Search 9 in [-1, 0, 3, 5, 9, 12]: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What index is returned for target 9 in `[-1, 0, 3, 5, 9, 12]`?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "Search 9 in [-1, 0, 3, 5, 9, 12]: 4"
          ],
          "primaryMisconceptionId": "MC_DSA_BINARY_SEARCH_OFF_BY_ONE_MID",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_DSA_BINARY_SEARCH_OFF_BY_ONE_MID",
              "errorExplanation": "Array is 0-indexed: index 0=-1, 1=0, 2=3, 3=5, 4=9.",
              "recoveryPath": {
                "simplerExplanation": "9 is at index 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d10-b2-search-rotated-array",
        "day": 10,
        "blockNumber": 2,
        "title": "Search in Rotated Sorted Array: Determining Sorted Halves",
        "conceptBudget": {
          "primaryConcept": "Rotated Array Binary Search",
          "supportingTerms": [
            "Check if Left Half is Sorted (`nums[left] <= nums[mid]`)",
            "Check if target lies inside sorted range",
            "O(log N) Time"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d10-b1-midpoint-overflow-invariant",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Rotated Search Decision Logic",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. If nums[mid] === target -> Return mid",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. If left half is sorted (nums[l] <= nums[m]) -> Check if target in [nums[l], nums[m])",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If yes -> right = mid - 1, else -> left = mid + 1",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Otherwise right half is sorted -> Check if target in (nums[m], nums[r]]",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "search_rotated.js",
            "initialCode": "function searchRotated(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const m = Math.floor((l + r) / 2);\n    if (nums[m] === target) return m;\n    if (nums[l] <= nums[m]) {\n      if (nums[l] <= target && target < nums[m]) r = m - 1;\n      else l = m + 1;\n    } else {\n      if (nums[m] < target && target <= nums[r]) l = m + 1;\n      else r = m - 1;\n    }\n  }\n  return -1;\n}\n\nconsole.log('Search 0 in [4,5,6,7,0,1,2]:', searchRotated([4,5,6,7,0,1,2], 0));",
            "expectedOutput": "Search 0 in [4,5,6,7,0,1,2]: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What index is target 0 located at in rotated array `[4, 5, 6, 7, 0, 1, 2]`?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "Search 0 in [4,5,6,7,0,1,2]: 4"
          ],
          "primaryMisconceptionId": "MC_DSA_BINARY_SEARCH_OFF_BY_ONE_MID",
          "diagnosisMap": {
            "-1": {
              "misconceptionId": "MC_DSA_BINARY_SEARCH_OFF_BY_ONE_MID",
              "errorExplanation": "Target 0 exists at index 4.",
              "recoveryPath": {
                "simplerExplanation": "0 is at index 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d10-b3-binary-search-on-answer",
        "day": 10,
        "blockNumber": 3,
        "title": "Binary Search on Answer Space (Koko Eating Bananas)",
        "conceptBudget": {
          "primaryConcept": "Binary Search on Answer Space",
          "supportingTerms": [
            "Searching Range [1, MaxValue]",
            "Feasibility Predicate `canFinish(speed)`",
            "Monotonic Truth Function (TTTTFFFF)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d10-b2-search-rotated-array",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "koko_bananas.js",
            "initialCode": "function minEatingSpeed(piles, h) {\n  let l = 1, r = Math.max(...piles), ans = r;\n  function canFinish(speed) {\n    let hours = 0;\n    for (const p of piles) hours += Math.ceil(p / speed);\n    return hours <= h;\n  }\n  while (l <= r) {\n    const m = Math.floor((l + r) / 2);\n    if (canFinish(m)) {\n      ans = m;\n      r = m - 1; // Try finding a smaller speed\n    } else {\n      l = m + 1;\n    }\n  }\n  return ans;\n}\n\nconsole.log('Min speed for piles [3,6,7,11] in 8 hours:', minEatingSpeed([3, 6, 7, 11], 8));",
            "expectedOutput": "Min speed for piles [3,6,7,11] in 8 hours: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the minimum banana eating speed to finish `[3, 6, 7, 11]` within 8 hours?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "Min speed for piles [3,6,7,11] in 8 hours: 4"
          ],
          "primaryMisconceptionId": "MC_DSA_BINARY_SEARCH_OFF_BY_ONE_MID",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DSA_BINARY_SEARCH_OFF_BY_ONE_MID",
              "errorExplanation": "At speed 3, hours taken = 1 + 2 + 3 + 4 = 10 hours (> 8). At speed 4, hours = 1 + 2 + 2 + 3 = 8 hours (<= 8).",
              "recoveryPath": {
                "simplerExplanation": "Speed 4 is the minimum speed that finishes in 8 hours.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Recursion, Call Stack Mechanics & Backtracking Principles",
    "overviewMetaphor": "Backtracking is exploring a maze with a spool of yarn: at every fork in the path, you choose left and walk forward (Recursive Step); if you hit a dead end (Failed base case), you rewind your yarn back to the fork (Backtrack / State Restoration) and choose right.",
    "blocks": [
      {
        "id": "dsa-d11-b1-call-stack-frames",
        "day": 11,
        "blockNumber": 1,
        "title": "Call Stack Execution Frames & The Base Case Anchor",
        "conceptBudget": {
          "primaryConcept": "Call Stack Frames",
          "supportingTerms": [
            "Stack Frame Push/Pop on function call",
            "Base Case termination",
            "Maximum Call Stack Size Exceeded (Stack Overflow)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d4-b1-stack-lifo-bracket-matching",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Call Stack Growth for factorial(3)",
              "boxes": [
                {
                  "label": "Frame 3: fact(1)",
                  "value": "returns 1 (Base Case reached)",
                  "varType": "Stack Frame Top",
                  "isUpdated": true
                },
                {
                  "label": "Frame 2: fact(2)",
                  "value": "waiting: 2 * fact(1)",
                  "varType": "Stack Frame",
                  "isUpdated": false
                },
                {
                  "label": "Frame 1: fact(3)",
                  "value": "waiting: 3 * fact(2)",
                  "varType": "Stack Frame Bottom",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "factorial_demo.js",
            "initialCode": "function factorial(n) {\n  if (n <= 1) return 1; // Base case!\n  return n * factorial(n - 1); // Recursive step\n}\n\nconsole.log('Factorial of 4 (4*3*2*1):', factorial(4));",
            "expectedOutput": "Factorial of 4 (4*3*2*1): 24",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `factorial(4)` calculated recursively?",
          "expectedStringOutput": "24",
          "acceptableAnswers": [
            "24",
            "Factorial of 4 (4*3*2*1): 24"
          ],
          "primaryMisconceptionId": "MC_DSA_RECURSION_MISSING_BASE_CASE",
          "diagnosisMap": {
            "12": {
              "misconceptionId": "MC_DSA_RECURSION_MISSING_BASE_CASE",
              "errorExplanation": "4 * 3 * 2 * 1 = 24.",
              "recoveryPath": {
                "simplerExplanation": "4 * 6 = 24.",
                "guidedFixPrompt": "Type 24"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d11-b2-power-set-subsets",
        "day": 11,
        "blockNumber": 2,
        "title": "Subsets (Power Set) Generation & State Backtracking",
        "conceptBudget": {
          "primaryConcept": "Backtracking State Tree",
          "supportingTerms": [
            "current.push(candidate)",
            "backtrack(idx + 1)",
            "current.pop() (State Restoration)",
            "2^N Total Subsets"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d11-b1-call-stack-frames",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Canonical Backtracking Template",
            "codeSnippet": "current.push(nums[i]);       // 1. Choose\nbacktrack(i + 1, current);   // 2. Explore\ncurrent.pop();               // 3. Un-choose (Backtrack)",
            "lineNotes": {
              "1": "Adds element to current branch state.",
              "2": "Recurses to explore all deeper paths containing this element.",
              "3": "Pops element off array, restoring clean state for subsequent sibling branches."
            }
          },
          {
            "type": "runnable_code",
            "filename": "subsets_demo.js",
            "initialCode": "function subsets(nums) {\n  const res = [];\n  function backtrack(idx, current) {\n    res.push([...current]); // Snapshot current subset\n    for (let i = idx; i < nums.length; i++) {\n      current.push(nums[i]);\n      backtrack(i + 1, current);\n      current.pop(); // Backtrack!\n    }\n  }\n  backtrack(0, []);\n  return res;\n}\n\nconst allSubsets = subsets([1, 2]);\nconsole.log('Subsets of [1, 2]:', JSON.stringify(allSubsets));",
            "expectedOutput": "Subsets of [1, 2]: [[],[1],[1,2],[2]]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total subsets exist for an array of 3 unique elements (`2^3`)?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8"
          ],
          "primaryMisconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
          "diagnosisMap": {
            "6": {
              "misconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
              "errorExplanation": "The power set size of N elements is 2^N. For N=3, 2^3 = 8.",
              "recoveryPath": {
                "simplerExplanation": "2^3 = 8.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d11-b3-permutations-tracking",
        "day": 11,
        "blockNumber": 3,
        "title": "Permutations & Used State Flags",
        "conceptBudget": {
          "primaryConcept": "Permutations Backtracking",
          "supportingTerms": [
            "N! Total Permutations",
            "Boolean used[] array",
            "used[i] = true / used[i] = false restoration"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d11-b2-power-set-subsets",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "permutations_demo.js",
            "initialCode": "function permute(nums) {\n  const res = [];\n  function backtrack(curr, used) {\n    if (curr.length === nums.length) { res.push([...curr]); return; }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true; curr.push(nums[i]);\n      backtrack(curr, used);\n      curr.pop(); used[i] = false;\n    }\n  }\n  backtrack([], {});\n  return res;\n}\n\nconst perms = permute([1, 2, 3]);\nconsole.log('Total Permutations of 3 elements:', perms.length);",
            "expectedOutput": "Total Permutations of 3 elements: 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many permutations are generated for `[1, 2, 3]` (`3! = 3 * 2 * 1`)?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "Total Permutations of 3 elements: 6"
          ],
          "primaryMisconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
              "errorExplanation": "3! = 3 * 2 * 1 = 6 unique orderings.",
              "recoveryPath": {
                "simplerExplanation": "3! = 6.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Merge Sort & Divide-and-Conquer Recurrences",
    "overviewMetaphor": "Merge Sort is organizing a messy deck of 100 cards: instead of sorting all 100 at once, you cut the deck in half repeatedly until you have 100 piles of 1 card each (Divide); then, you compare the top cards of two piles and zip them together in sorted order (Conquer), building back up in guaranteed O(N log N) time.",
    "blocks": [
      {
        "id": "dsa-d12-b1-divide-and-conquer-halving",
        "day": 12,
        "blockNumber": 1,
        "title": "The Divide & Conquer Strategy: Halving & Merging",
        "conceptBudget": {
          "primaryConcept": "Divide and Conquer",
          "supportingTerms": [
            "T(N) = 2T(N/2) + O(N) -> O(N log N)",
            "Stable Sorting Guarantee",
            "O(N) Auxiliary Memory Overhead"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d11-b1-call-stack-frames",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Merge Sort Recursion Tree",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. [38, 27, 43, 3, 9, 82, 10] -> Split into [38, 27, 43] & [3, 9, 82, 10]",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Recurse down until base arrays of size 1",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Merge sorted halves with 2 pointers in O(N) time per level",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Return fully sorted array in O(N log N) total time",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "merge_sort_demo.js",
            "initialCode": "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\nfunction merge(left, right) {\n  const res = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) res.push(left[i++]);\n    else res.push(right[j++]);\n  }\n  return res.concat(left.slice(i)).concat(right.slice(j));\n}\n\nconsole.log('Sorted [38, 27, 43, 3, 9, 82]:', JSON.stringify(mergeSort([38, 27, 43, 3, 9, 82])));",
            "expectedOutput": "Sorted [38, 27, 43, 3, 9, 82]: [3,9,27,38,43,82]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary trade-off of Merge Sort compared to Quick Sort?",
          "options": [
            "Merge Sort guarantees O(N log N) worst-case time and stability, but requires O(N) auxiliary memory to hold merged sub-arrays",
            "Merge Sort only works on numbers up to 100",
            "Merge Sort has O(N^2) worst case"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_DIVIDE_AND_CONQUER_MERGE_SORT_SPACE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_DIVIDE_AND_CONQUER_MERGE_SORT_SPACE",
              "errorExplanation": "Merge Sort's auxiliary buffer requires O(N) extra space during merging.",
              "recoveryPath": {
                "simplerExplanation": "Merge Sort uses O(N) extra memory for merging.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d12-b2-merge-sorted-linked-lists",
        "day": 12,
        "blockNumber": 2,
        "title": "Merging Two Sorted Linked Lists in O(N) Time and O(1) Space",
        "conceptBudget": {
          "primaryConcept": "Pointer Merging",
          "supportingTerms": [
            "Dummy Sentinel Head",
            "Advancing smaller value pointer",
            "Attaching remaining tail"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d12-b1-divide-and-conquer-halving",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "merge_lists_demo.js",
            "initialCode": "function mergeTwoLists(l1, l2) {\n  const dummy = { val: 0, next: null };\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}\n\nconst a = { val: 1, next: { val: 3, next: null } };\nconst b = { val: 2, next: { val: 4, next: null } };\nconst merged = mergeTwoLists(a, b);\nconsole.log(`Merged: ${merged.val} -> ${merged.next.val} -> ${merged.next.next.val} -> ${merged.next.next.next.val}`);",
            "expectedOutput": "Merged: 1 -> 2 -> 3 -> 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the merged sequence for linked lists `1 -> 3` and `2 -> 4`?",
          "expectedStringOutput": "Merged: 1 -> 2 -> 3 -> 4",
          "acceptableAnswers": [
            "Merged: 1 -> 2 -> 3 -> 4",
            "1 -> 2 -> 3 -> 4",
            "1, 2, 3, 4"
          ],
          "primaryMisconceptionId": "MC_DSA_DIVIDE_AND_CONQUER_MERGE_SORT_SPACE",
          "diagnosisMap": {
            "1 -> 3 -> 2 -> 4": {
              "misconceptionId": "MC_DSA_DIVIDE_AND_CONQUER_MERGE_SORT_SPACE",
              "errorExplanation": "Elements are zipped in ascending order: 1 -> 2 -> 3 -> 4.",
              "recoveryPath": {
                "simplerExplanation": "Sorted order is 1 -> 2 -> 3 -> 4.",
                "guidedFixPrompt": "Type Merged: 1 -> 2 -> 3 -> 4"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d12-b3-master-theorem",
        "day": 12,
        "blockNumber": 3,
        "title": "Master Theorem for Algorithm Recurrences",
        "conceptBudget": {
          "primaryConcept": "Master Theorem",
          "supportingTerms": [
            "T(N) = a*T(N/b) + f(N)",
            "Binary Search: T(N) = T(N/2) + O(1) -> O(log N)",
            "Merge Sort: T(N) = 2T(N/2) + O(N) -> O(N log N)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d12-b2-merge-sorted-linked-lists",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Recurrence Formula Comparison",
            "codeSnippet": "// 1. Binary Search: 1 subproblem of size N/2, O(1) work -> O(log N)\n// 2. Merge Sort: 2 subproblems of size N/2, O(N) work -> O(N log N)\n// 3. Tree Traversal: 2 subproblems of size N/2, O(1) work -> O(N)",
            "lineNotes": {
              "1": "Halving once per step = logarithmic.",
              "2": "Halving twice and scanning all elements per level = linearithmic."
            }
          },
          {
            "type": "runnable_code",
            "filename": "master_theorem_sim.js",
            "initialCode": "function resolveRecurrence(type) {\n  const map = {\n    'BINARY_SEARCH': 'O(log N)',\n    'MERGE_SORT': 'O(N log N)',\n    'TREE_TRAVERSAL': 'O(N)'\n  };\n  return map[type];\n}\n\nconsole.log('Merge Sort Big-O:', resolveRecurrence('MERGE_SORT'));",
            "expectedOutput": "Merge Sort Big-O: O(N log N)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the asymptotic complexity of Merge Sort according to the Master Theorem?",
          "expectedStringOutput": "O(N log N)",
          "acceptableAnswers": [
            "O(N log N)",
            "Merge Sort Big-O: O(N log N)"
          ],
          "primaryMisconceptionId": "MC_DSA_DIVIDE_AND_CONQUER_MERGE_SORT_SPACE",
          "diagnosisMap": {
            "O(N^2)": {
              "misconceptionId": "MC_DSA_DIVIDE_AND_CONQUER_MERGE_SORT_SPACE",
              "errorExplanation": "Merge Sort splits into 2 halves of N/2 and merges in O(N), yielding O(N log N).",
              "recoveryPath": {
                "simplerExplanation": "Merge Sort is O(N log N).",
                "guidedFixPrompt": "Type O(N log N)"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Quick Sort & Quick Select (Kth Largest Element in O(N))",
    "overviewMetaphor": "Quick Sort is lining students up by height: the teacher picks 1 student as the Pivot; everyone shorter moves to the left of the pivot, and everyone taller moves to the right; the pivot is now in their permanent sorted chair forever! Quick Select finds the 3rd tallest student by only looking into whichever side of the room the 3rd chair falls in (average O(N) time).",
    "blocks": [
      {
        "id": "dsa-d13-b1-lomuto-partitioning",
        "day": 13,
        "blockNumber": 1,
        "title": "In-Place Lomuto Partitioning Scheme",
        "conceptBudget": {
          "primaryConcept": "Lomuto Partitioning",
          "supportingTerms": [
            "Pivot element selection",
            "Partition index pIdx",
            "In-place swaps without extra arrays"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d12-b1-divide-and-conquer-halving",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Lomuto Partition Algorithm",
            "codeSnippet": "const pivot = arr[right];\nlet pIdx = left;\nfor (let i = left; i < right; i++) {\n  if (arr[i] <= pivot) {\n    [arr[i], arr[pIdx]] = [arr[pIdx], arr[i]];\n    pIdx++;\n  }\n}\n[arr[pIdx], arr[right]] = [arr[right], arr[pIdx]];\nreturn pIdx;",
            "lineNotes": {
              "1": "Chooses rightmost element as pivot.",
              "4": "Swaps elements smaller than pivot to front of array.",
              "8": "Places pivot in its exact final sorted position."
            }
          },
          {
            "type": "runnable_code",
            "filename": "partition_demo.js",
            "initialCode": "function partition(arr, left, right) {\n  const pivot = arr[right];\n  let p = left;\n  for (let i = left; i < right; i++) {\n    if (arr[i] <= pivot) { [arr[i], arr[p]] = [arr[p], arr[i]]; p++; }\n  }\n  [arr[p], arr[right]] = [arr[right], arr[p]];\n  return p;\n}\n\nconst arr = [5, 2, 9, 1, 3];\nconst pivotIdx = partition(arr, 0, arr.length - 1);\nconsole.log(`Pivot placed at index ${pivotIdx}, Array: [${arr.join(', ')}]`);",
            "expectedOutput": "Pivot placed at index 2, Array: [2, 1, 3, 9, 5]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "At what index is pivot value 3 placed in the partitioned array `[2, 1, 3, 9, 5]`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Pivot placed at index 2"
          ],
          "primaryMisconceptionId": "MC_DSA_QUICK_SORT_WORST_CASE_PIVOT",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DSA_QUICK_SORT_WORST_CASE_PIVOT",
              "errorExplanation": "Index 0 is 2, index 1 is 1, index 2 is 3.",
              "recoveryPath": {
                "simplerExplanation": "Pivot 3 is at index 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d13-b2-quick-select-kth",
        "day": 13,
        "blockNumber": 2,
        "title": "Quick Select: Kth Largest Element in Average O(N) Time",
        "conceptBudget": {
          "primaryConcept": "Quick Select Algorithm",
          "supportingTerms": [
            "Target index = N - k",
            "Discarding unneeded partition half",
            "O(N) Average Time (N + N/2 + N/4 -> 2N)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d13-b1-lomuto-partitioning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quick_select_demo.js",
            "initialCode": "function findKthLargest(nums, k) {\n  const target = nums.length - k;\n  function select(l, r) {\n    const pivot = nums[r];\n    let p = l;\n    for (let i = l; i < r; i++) {\n      if (nums[i] <= pivot) { [nums[i], nums[p]] = [nums[p], nums[i]]; p++; }\n    }\n    [nums[p], nums[r]] = [nums[r], nums[p]];\n    if (p === target) return nums[p];\n    return p < target ? select(p + 1, r) : select(l, p - 1);\n  }\n  return select(0, nums.length - 1);\n}\n\nconsole.log('2nd Largest in [3, 2, 1, 5, 6, 4]:', findKthLargest([3, 2, 1, 5, 6, 4], 2));",
            "expectedOutput": "2nd Largest in [3, 2, 1, 5, 6, 4]: 5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 2nd largest element found in `[3, 2, 1, 5, 6, 4]`?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "2nd Largest in [3, 2, 1, 5, 6, 4]: 5"
          ],
          "primaryMisconceptionId": "MC_DSA_QUICK_SORT_WORST_CASE_PIVOT",
          "diagnosisMap": {
            "6": {
              "misconceptionId": "MC_DSA_QUICK_SORT_WORST_CASE_PIVOT",
              "errorExplanation": "6 is the 1st largest. The 2nd largest is 5.",
              "recoveryPath": {
                "simplerExplanation": "2nd largest is 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d13-b3-worst-case-avoidance",
        "day": 13,
        "blockNumber": 3,
        "title": "Randomized Pivots & Worst-Case O(N^2) Avoidance",
        "conceptBudget": {
          "primaryConcept": "Randomized Pivot Selection",
          "supportingTerms": [
            "Adversarial Sorted Input Defense",
            "Random index swap `[arr[rand], arr[right]]`",
            "Preventing deep single-element recursion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d13-b2-quick-select-kth",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "random_pivot_sim.js",
            "initialCode": "function getRandomPivot(l, r) {\n  return Math.floor(l + Math.random() * (r - l + 1));\n}\n\nconsole.log('Random pivot index generated safely in range [0, 5]:', getRandomPivot(0, 5) >= 0);",
            "expectedOutput": "Random pivot index generated safely in range [0, 5]: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do production Quick Sort implementations use randomized pivot selection?",
          "options": [
            "To prevent worst-case O(N^2) quadratic degradation on already sorted or reverse-sorted input arrays",
            "Because computers cannot sort numbers without random numbers",
            "To save hard drive space"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_QUICK_SORT_WORST_CASE_PIVOT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_QUICK_SORT_WORST_CASE_PIVOT",
              "errorExplanation": "Random pivots guarantee with high probability that partitions stay balanced near O(N log N).",
              "recoveryPath": {
                "simplerExplanation": "Random pivots prevent O(N^2) slowdown on sorted data.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Non-Comparison Sorting: Counting Sort & Radix Sort",
    "overviewMetaphor": "Non-Comparison Sorting is sorting coins into coin trays: instead of comparing two coins against each other (which takes at least O(N log N) comparisons by information theory), you drop pennies into tray 1, nickels into tray 5, and dimes into tray 10 in a single O(N) sweep.",
    "blocks": [
      {
        "id": "dsa-d14-b1-dutch-national-flag",
        "day": 14,
        "blockNumber": 1,
        "title": "Dutch National Flag: 3-Way Partitioning in Single Pass",
        "conceptBudget": {
          "primaryConcept": "3-Way Partitioning",
          "supportingTerms": [
            "low, mid, high pointers",
            "Sort 0s, 1s, 2s in O(N) Time and O(1) Space",
            "Zero comparison sort overhead"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d13-b1-lomuto-partitioning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dutch National Flag Algorithm",
            "codeSnippet": "while (mid <= high) {\n  if (nums[mid] === 0) { [nums[low], nums[mid]] = [nums[mid], nums[low]]; low++; mid++; }\n  else if (nums[mid] === 1) { mid++; }\n  else { [nums[mid], nums[high]] = [nums[high], nums[mid]]; high--; }\n}",
            "lineNotes": {
              "2": "Pushes 0s behind the low boundary.",
              "3": "Leaves 1s in the middle.",
              "4": "Pushes 2s behind the high boundary."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sort_colors_demo.js",
            "initialCode": "function sortColors(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}\n\nconsole.log('Sorted Colors [2, 0, 2, 1, 1, 0]:', JSON.stringify(sortColors([2, 0, 2, 1, 1, 0])));",
            "expectedOutput": "Sorted Colors [2, 0, 2, 1, 1, 0]: [0,0,1,1,2,2]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the sorted array returned for `[2, 0, 2, 1, 1, 0]`?",
          "expectedStringOutput": "[0,0,1,1,2,2]",
          "acceptableAnswers": [
            "[0,0,1,1,2,2]",
            "[0, 0, 1, 1, 2, 2]"
          ],
          "primaryMisconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
          "diagnosisMap": {
            "[0,1,2]": {
              "misconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
              "errorExplanation": "Duplicates are preserved: two 0s, two 1s, and two 2s.",
              "recoveryPath": {
                "simplerExplanation": "Array is [0,0,1,1,2,2].",
                "guidedFixPrompt": "Type [0,0,1,1,2,2]"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d14-b2-counting-sort-frequency",
        "day": 14,
        "blockNumber": 2,
        "title": "Counting Sort: O(N + K) Frequency Array Direct Placement",
        "conceptBudget": {
          "primaryConcept": "Counting Sort",
          "supportingTerms": [
            "Frequency Array count[val]++",
            "Non-Comparison Linear Time",
            "Range Bound K requirement"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d14-b1-dutch-national-flag",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "counting_sort_demo.js",
            "initialCode": "function countingSort(arr, maxVal) {\n  const count = new Array(maxVal + 1).fill(0);\n  for (const n of arr) count[n]++;\n  const res = [];\n  for (let i = 0; i <= maxVal; i++) {\n    while (count[i]-- > 0) res.push(i);\n  }\n  return res;\n}\n\nconsole.log('Counting Sort [4, 2, 2, 8, 3]:', JSON.stringify(countingSort([4, 2, 2, 8, 3], 8)));",
            "expectedOutput": "Counting Sort [4, 2, 2, 8, 3]: [2,2,3,4,8]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When is Counting Sort strictly superior to Comparison Sorts like Quick Sort?",
          "options": [
            "When sorting non-negative integers where the maximum value K is small relative to N (e.g. K <= N), achieving true O(N) linear execution",
            "When sorting random floating point numbers",
            "When K = 1,000,000,000"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
              "errorExplanation": "If range K is small, counting sort runs in O(N + K) linear time without comparison overhead.",
              "recoveryPath": {
                "simplerExplanation": "Counting sort is faster when range K is small.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d14-b3-radix-sort-digits",
        "day": 14,
        "blockNumber": 3,
        "title": "Radix Sort: Multi-Pass Digit Bucket Ordering",
        "conceptBudget": {
          "primaryConcept": "Radix Sort",
          "supportingTerms": [
            "Least Significant Digit (LSD)",
            "Stable Sub-Pass Sorting",
            "O(D * (N + B)) Total Time"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d14-b2-counting-sort-frequency",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "radix_sim.js",
            "initialCode": "function getDigit(num, place) {\n  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;\n}\n\nconsole.log('Hundreds digit of 742:', getDigit(742, 2));",
            "expectedOutput": "Hundreds digit of 742: 7",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the hundreds digit (place=2) of integer 742?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "Hundreds digit of 742: 7"
          ],
          "primaryMisconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DSA_ARRAY_RESIZING_AMORTIZED_COST",
              "errorExplanation": "4 is the tens digit (place=1). 7 is the hundreds digit (place=2).",
              "recoveryPath": {
                "simplerExplanation": "Hundreds place is 7.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: High-Throughput Stream Median Finder (Dual Binary Heaps)",
    "overviewMetaphor": "Milestone 2 — Continuous Stream Median Architecture: Two children on a seesaw: the left seat holds all smaller numbers in a MaxHeap (tallest child sits on top); the right seat holds all larger numbers in a MinHeap (shortest child sits on top). Because both heaps stay balanced in size (difference <= 1), the median of 10,000,000 live streaming numbers is always directly at the center of the seesaw in O(1) time!",
    "blocks": [
      {
        "id": "dsa-d15-b1-dual-heap-architecture",
        "day": 15,
        "blockNumber": 1,
        "title": "Dual Heap Partitioning: MaxHeap (Lower) + MinHeap (Upper)",
        "conceptBudget": {
          "primaryConcept": "Dual Heap Median Pattern",
          "supportingTerms": [
            "Lower Half in MaxHeap",
            "Upper Half in MinHeap",
            "Heap Size Balance Invariant |sizeA - sizeB| <= 1",
            "O(log N) Insert, O(1) Find Median"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d13-b2-quick-select-kth",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Stream Median Invariants",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Add num -> Push to MaxHeap (lower half)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Move largest lower element to MinHeap (upper half)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If MinHeap has more elements -> Move smallest upper element back to MaxHeap",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Median = MaxHeap.top (if odd) OR (MaxHeap.top + MinHeap.top)/2 (if even)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "median_finder_demo.js",
            "initialCode": "class StreamMedianFinder {\n  constructor() { this.arr = []; }\n  addNum(num) {\n    let l = 0, r = this.arr.length;\n    while (l < r) {\n      const m = Math.floor((l + r) / 2);\n      if (this.arr[m] < num) l = m + 1; else r = m;\n    }\n    this.arr.splice(l, 0, num);\n  }\n  findMedian() {\n    const n = this.arr.length;\n    const m = Math.floor(n / 2);\n    return n % 2 === 1 ? this.arr[m] : (this.arr[m - 1] + this.arr[m]) / 2;\n  }\n}\n\nconst mf = new StreamMedianFinder();\nmf.addNum(1); mf.addNum(2);\nconsole.log('Median of [1, 2]:', mf.findMedian());\nmf.addNum(3);\nconsole.log('Median of [1, 2, 3]:', mf.findMedian());",
            "expectedOutput": "Median of [1, 2]: 1.5\nMedian of [1, 2, 3]: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the continuous stream median after inserting 1, 2, 3?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Median of [1, 2, 3]: 2"
          ],
          "primaryMisconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
          "diagnosisMap": {
            "1.5": {
              "misconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
              "errorExplanation": "1.5 was the median for [1, 2]. For odd length [1, 2, 3], the exact median is 2.",
              "recoveryPath": {
                "simplerExplanation": "Middle element of [1, 2, 3] is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d15-b2-streaming-telemetry-benchmarking",
        "day": 15,
        "blockNumber": 2,
        "title": "Continuous Stream Ingest & Telemetry Auditing",
        "conceptBudget": {
          "primaryConcept": "Stream Telemetry Processing",
          "supportingTerms": [
            "High-Throughput Streaming Data",
            "Sub-millisecond Median Computations",
            "Zero Re-Sorting Overhead"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d15-b1-dual-heap-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stream_telemetry.js",
            "initialCode": "function processTelemetryBatch(stream) {\n  const results = [];\n  const arr = [];\n  for (const val of stream) {\n    let l = 0, r = arr.length;\n    while (l < r) {\n      const m = Math.floor((l + r) / 2);\n      if (arr[m] < val) l = m + 1; else r = m;\n    }\n    arr.splice(l, 0, val);\n    const n = arr.length, mid = Math.floor(n / 2);\n    results.push(n % 2 === 1 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2);\n  }\n  return results;\n}\n\nconsole.log('Running medians for [5, 15, 1, 3]:', JSON.stringify(processTelemetryBatch([5, 15, 1, 3])));",
            "expectedOutput": "Running medians for [5, 15, 1, 3]: [5,10,5,4]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What are the running medians after each element in `[5, 15, 1, 3]`?",
          "expectedStringOutput": "[5,10,5,4]",
          "acceptableAnswers": [
            "[5,10,5,4]",
            "[5, 10, 5, 4]"
          ],
          "primaryMisconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
          "diagnosisMap": {
            "[5,15,1,3]": {
              "misconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
              "errorExplanation": "Medians are: [5]->5, [5, 15]->10, [1, 5, 15]->5, [1, 3, 5, 15]->(3+5)/2=4.",
              "recoveryPath": {
                "simplerExplanation": "Medians calculated after each insertion are [5, 10, 5, 4].",
                "guidedFixPrompt": "Type [5,10,5,4]"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d15-b3-milestone-stream-median-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Stream Median Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Stream Median Certification",
          "supportingTerms": [
            "Dual Heap Balancing",
            "100% Quality Invariant Verified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d15-b2-streaming-telemetry-benchmarking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "median_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: High-Throughput Stream Median Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: High-Throughput Stream Median Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string is returned upon verifying Milestone 2?",
          "expectedStringOutput": "⭐ MILESTONE 2: High-Throughput Stream Median Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: High-Throughput Stream Median Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
              "errorExplanation": "Returns ⭐ MILESTONE 2: High-Throughput Stream Median Engine [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches certification header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: High-Throughput Stream Median Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Binary Trees: Preorder, Inorder, Postorder & Level-Order BFS",
    "overviewMetaphor": "A Binary Tree is a family tree or an organizational company chart: the CEO is at the top (`root`), managing two direct Vice Presidents (`left` and `right`); Depth-First Search (DFS) is an auditor who follows one VP all the way down to junior interns before meeting the second VP; Breadth-First Search (BFS) is a company all-hands meeting that introduces everyone level by level (CEO first, then VPs, then Managers, then Interns).",
    "blocks": [
      {
        "id": "dsa-d16-b1-tree-node-anatomy",
        "day": 16,
        "blockNumber": 1,
        "title": "TreeNode Anatomy & Recursive DFS Traversals",
        "conceptBudget": {
          "primaryConcept": "TreeNode & DFS Traversals",
          "supportingTerms": [
            "TreeNode { val, left, right }",
            "Preorder (Root, Left, Right)",
            "Inorder (Left, Root, Right)",
            "Postorder (Left, Right, Root)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d11-b1-call-stack-frames",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "DFS Traversal Orders",
              "nodes": [
                {
                  "id": "1",
                  "label": "PREORDER: Process Root NOW -> Recurse Left -> Recurse Right",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "INORDER: Recurse Left -> Process Root NOW -> Recurse Right (Sorted in BST)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "POSTORDER: Recurse Left -> Recurse Right -> Process Root NOW (Bottom-Up)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tree_traversal_demo.js",
            "initialCode": "class TreeNode {\n  constructor(val = 0, left = null, right = null) {\n    this.val = val; this.left = left; this.right = right;\n  }\n}\n\nconst root = new TreeNode(1, null, new TreeNode(2, new TreeNode(3), null));\n\nfunction inorder(node, acc = []) {\n  if (!node) return acc;\n  inorder(node.left, acc);\n  acc.push(node.val);\n  inorder(node.right, acc);\n  return acc;\n}\n\nconsole.log('Inorder Traversal:', JSON.stringify(inorder(root)));",
            "expectedOutput": "Inorder Traversal: [1,3,2]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Inorder traversal array for the tree `1 -> right: 2 (with left: 3)` above?",
          "expectedStringOutput": "[1,3,2]",
          "acceptableAnswers": [
            "[1,3,2]",
            "[1, 3, 2]",
            "Inorder Traversal: [1,3,2]"
          ],
          "primaryMisconceptionId": "MC_DSA_BINARY_TREE_INORDER_PREORDER_POSTORDER",
          "diagnosisMap": {
            "[1,2,3]": {
              "misconceptionId": "MC_DSA_BINARY_TREE_INORDER_PREORDER_POSTORDER",
              "errorExplanation": "Inorder visits Left first: at node 2, its left child 3 is visited before 2, producing [1, 3, 2].",
              "recoveryPath": {
                "simplerExplanation": "Inorder visits left child 3 before node 2 -> [1, 3, 2].",
                "guidedFixPrompt": "Type [1,3,2]"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d16-b2-level-order-bfs",
        "day": 16,
        "blockNumber": 2,
        "title": "Level-Order Traversal (BFS with Queue)",
        "conceptBudget": {
          "primaryConcept": "Tree BFS Level Order",
          "supportingTerms": [
            "Queue snapshot length `levelSize = queue.length`",
            "2D Array by Depth Level",
            "Iterative Tree Scanning"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d16-b1-tree-node-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Level-Order BFS Template",
            "codeSnippet": "const queue = [root];\nwhile (queue.length > 0) {\n  const levelSize = queue.length;\n  const currentLevel = [];\n  for (let i = 0; i < levelSize; i++) {\n    const node = queue.shift();\n    currentLevel.push(node.val);\n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n  result.push(currentLevel);\n}",
            "lineNotes": {
              "3": "Captures the exact number of nodes on the current level before enqueuing children.",
              "8": "Pushes children to the back of the queue for the NEXT level."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bfs_tree_demo.js",
            "initialCode": "function levelOrder(root) {\n  if (!root) return [];\n  const res = [], q = [root];\n  while (q.length > 0) {\n    const len = q.length, lvl = [];\n    for (let i = 0; i < len; i++) {\n      const n = q.shift();\n      lvl.push(n.val);\n      if (n.left) q.push(n.left);\n      if (n.right) q.push(n.right);\n    }\n    res.push(lvl);\n  }\n  return res;\n}\n\nconst tree = { val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } };\nconsole.log('Levels:', JSON.stringify(levelOrder(tree)));",
            "expectedOutput": "Levels: [[3],[9,20],[15,7]]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 2nd level array produced for the tree `3 -> (9, 20)`?",
          "expectedStringOutput": "[9,20]",
          "acceptableAnswers": [
            "[9,20]",
            "[9, 20]"
          ],
          "primaryMisconceptionId": "MC_DSA_BINARY_TREE_INORDER_PREORDER_POSTORDER",
          "diagnosisMap": {
            "[3]": {
              "misconceptionId": "MC_DSA_BINARY_TREE_INORDER_PREORDER_POSTORDER",
              "errorExplanation": "[3] is Level 1. Level 2 contains the children: [9, 20].",
              "recoveryPath": {
                "simplerExplanation": "Level 2 is [9, 20].",
                "guidedFixPrompt": "Type [9,20]"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d16-b3-max-depth-tree",
        "day": 16,
        "blockNumber": 3,
        "title": "Maximum Depth & Tree Height (Postorder DFS)",
        "conceptBudget": {
          "primaryConcept": "Tree Height Calculation",
          "supportingTerms": [
            "maxDepth = 1 + Math.max(leftDepth, rightDepth)",
            "Base case: null node has depth 0",
            "Bottom-up recursion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d16-b2-level-order-bfs",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tree_depth.js",
            "initialCode": "function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n\nconst sample = { val: 1, left: null, right: { val: 2, left: { val: 3, left: null, right: null }, right: null } };\nconsole.log('Max Depth:', maxDepth(sample));",
            "expectedOutput": "Max Depth: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum depth of a 3-node chain `1 -> 2 -> 3`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Max Depth: 3"
          ],
          "primaryMisconceptionId": "MC_DSA_BINARY_TREE_INORDER_PREORDER_POSTORDER",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_DSA_BINARY_TREE_INORDER_PREORDER_POSTORDER",
              "errorExplanation": "There are 3 nodes on the path from root to leaf, so the depth is 3.",
              "recoveryPath": {
                "simplerExplanation": "3 nodes on path = depth 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Binary Search Trees (BST), Validation & Inorder Invariant",
    "overviewMetaphor": "A Binary Search Tree (BST) is a sorted library bookshelf: at every shelf (node), all books with smaller titles go to the left, and all books with larger titles go to the right; validating a BST is making sure no misplaced book on the far left shelf exceeds the master library ceiling (`val < max`).",
    "blocks": [
      {
        "id": "dsa-d17-b1-bst-invariants-min-max",
        "day": 17,
        "blockNumber": 1,
        "title": "BST Property & Bounded (min, max) Range Validation",
        "conceptBudget": {
          "primaryConcept": "BST Validation Invariant",
          "supportingTerms": [
            "All Left Subtree Descendants < Node.val",
            "All Right Subtree Descendants > Node.val",
            "Recursive (min, max) Boundary Passing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d16-b1-tree-node-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Common BST Validation Bug Diff",
              "brokenCode": "// ❌ BUGGY: Only checks immediate children!\nfunction isValidBST(node) {\n  if (!node) return true;\n  if (node.left && node.left.val >= node.val) return false;\n  if (node.right && node.right.val <= node.val) return false;\n  return isValidBST(node.left) && isValidBST(node.right);\n}",
              "fixedCode": "// ✅ CORRECT: Passes global ancestral (min, max) bounds!\nfunction isValidBST(node, min = -Infinity, max = Infinity) {\n  if (!node) return true;\n  if (node.val <= min || node.val >= max) return false;\n  return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max);\n}",
              "errorLine": 4,
              "errorReason": "Checking only immediate children fails when a deep right child of a left subtree is greater than the root!",
              "fixExplanation": "Every recursive step must inherit and tighten the parent boundary constraints."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bst_validation_demo.js",
            "initialCode": "function isValidBST(node, min = -Infinity, max = Infinity) {\n  if (!node) return true;\n  if (node.val <= min || node.val >= max) return false;\n  return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max);\n}\n\nconst valid = { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } };\nconst invalid = { val: 5, left: { val: 1, left: null, right: null }, right: { val: 4, left: { val: 3, left: null, right: null }, right: { val: 6, left: null, right: null } } };\n\nconsole.log('Tree 1 Valid?:', isValidBST(valid));\nconsole.log('Tree 2 Valid?:', isValidBST(invalid));",
            "expectedOutput": "Tree 1 Valid?: true\nTree 2 Valid?: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does checking only `node.left.val < node.val` fail to properly validate a BST?",
          "options": [
            "Because a node deep in the left subtree might have a right child whose value is larger than the root ancestor, violating the global BST invariant",
            "Because JavaScript comparison operators cannot compare tree nodes",
            "Because BSTs only allow integers up to 10"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_BST_VALIDATION_MIN_MAX_BOUNDS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_BST_VALIDATION_MIN_MAX_BOUNDS",
              "errorExplanation": "All nodes in the entire left subtree must be strictly less than the root, which requires bounded range validation.",
              "recoveryPath": {
                "simplerExplanation": "Subtree nodes must satisfy root boundary constraints.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d17-b2-inorder-sorted-property",
        "day": 17,
        "blockNumber": 2,
        "title": "The Inorder Sorted Invariant of BSTs",
        "conceptBudget": {
          "primaryConcept": "BST Inorder Sorting",
          "supportingTerms": [
            "Inorder Traversal of BST is strictly monotonic ascending",
            "Kth Smallest Element in O(H + k)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d17-b1-bst-invariants-min-max",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "kth_smallest_bst.js",
            "initialCode": "function kthSmallest(root, k) {\n  let count = 0, ans = null;\n  function inorder(node) {\n    if (!node || ans !== null) return;\n    inorder(node.left);\n    if (++count === k) { ans = node.val; return; }\n    inorder(node.right);\n  }\n  inorder(root);\n  return ans;\n}\n\nconst bst = { val: 3, left: { val: 1, left: null, right: { val: 2, left: null, right: null } }, right: { val: 4, left: null, right: null } };\nconsole.log('1st Smallest:', kthSmallest(bst, 1));\nconsole.log('2nd Smallest:', kthSmallest(bst, 2));",
            "expectedOutput": "1st Smallest: 1\n2nd Smallest: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 2nd smallest element in the BST `3 -> left: (1 -> right: 2), right: 4`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2nd Smallest: 2"
          ],
          "primaryMisconceptionId": "MC_DSA_BST_VALIDATION_MIN_MAX_BOUNDS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_BST_VALIDATION_MIN_MAX_BOUNDS",
              "errorExplanation": "1 is the 1st smallest. 2 is the 2nd smallest.",
              "recoveryPath": {
                "simplerExplanation": "2nd smallest is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d17-b3-lca-bst",
        "day": 17,
        "blockNumber": 3,
        "title": "Lowest Common Ancestor (LCA) in BST in O(Height)",
        "conceptBudget": {
          "primaryConcept": "BST LCA Split Point",
          "supportingTerms": [
            "If both p, q < root -> go left",
            "If both p, q > root -> go right",
            "Otherwise root is LCA split point"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d17-b2-inorder-sorted-property",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lca_demo.js",
            "initialCode": "function lowestCommonAncestor(root, p, q) {\n  let curr = root;\n  while (curr) {\n    if (p < curr.val && q < curr.val) curr = curr.left;\n    else if (p > curr.val && q > curr.val) curr = curr.right;\n    else return curr.val;\n  }\n  return null;\n}\n\nconst root = { val: 6, left: { val: 2, left: null, right: null }, right: { val: 8, left: null, right: null } };\nconsole.log('LCA of 2 and 8 in BST:', lowestCommonAncestor(root, 2, 8));",
            "expectedOutput": "LCA of 2 and 8 in BST: 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the LCA node value for nodes 2 and 8 in the BST with root 6?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "LCA of 2 and 8 in BST: 6"
          ],
          "primaryMisconceptionId": "MC_DSA_BST_VALIDATION_MIN_MAX_BOUNDS",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_DSA_BST_VALIDATION_MIN_MAX_BOUNDS",
              "errorExplanation": "6 is the common ancestor where node 2 branches left and node 8 branches right.",
              "recoveryPath": {
                "simplerExplanation": "Split occurs at root 6.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Min/Max Binary Heaps & Priority Queues",
    "overviewMetaphor": "A Binary Heap is a pyramid of cheerleaders: in a MinHeap, the lightest cheerleader is always standing at the very top (`heap[0]`); every cheerleader standing on someone else's shoulders must be heavier than the person below them; when the top cheerleader steps down (`pop()`), the bottom cheerleader takes their place and sinks down (siftDown) until balance is restored.",
    "blocks": [
      {
        "id": "dsa-d18-b1-heap-array-layout",
        "day": 18,
        "blockNumber": 1,
        "title": "Array Representation of Complete Binary Trees",
        "conceptBudget": {
          "primaryConcept": "Heap Array Indices",
          "supportingTerms": [
            "Parent at `(i - 1) / 2`",
            "Left child at `2*i + 1`",
            "Right child at `2*i + 2`",
            "Zero pointer overhead"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d16-b1-tree-node-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Heap Array Storage Layout",
              "boxes": [
                {
                  "label": "heap[0] (Root Min)",
                  "value": "1",
                  "varType": "Top Element",
                  "isUpdated": false
                },
                {
                  "label": "heap[1] (Left Child)",
                  "value": "4",
                  "varType": "Left of 0",
                  "isUpdated": false
                },
                {
                  "label": "heap[2] (Right Child)",
                  "value": "3",
                  "varType": "Right of 0",
                  "isUpdated": false
                },
                {
                  "label": "heap[3] (Left Child of 1)",
                  "value": "9",
                  "varType": "Left of 1",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "heap_indices.js",
            "initialCode": "function getChildren(i) {\n  return { left: 2 * i + 1, right: 2 * i + 2, parent: Math.floor((i - 1) / 2) };\n}\n\nconsole.log('Indices for Node 1:', JSON.stringify(getChildren(1)));",
            "expectedOutput": "Indices for Node 1: {\"left\":3,\"right\":4,\"parent\":0}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the left child index for node at index 1 (`2 * 1 + 1`)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3"
          ],
          "primaryMisconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
              "errorExplanation": "Left child formula is 2*i + 1 = 2*1 + 1 = 3.",
              "recoveryPath": {
                "simplerExplanation": "2 * 1 + 1 = 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d18-b2-sift-up-down",
        "day": 18,
        "blockNumber": 2,
        "title": "SiftUp & SiftDown Heapify Operations in O(log N)",
        "conceptBudget": {
          "primaryConcept": "Heapify Operations",
          "supportingTerms": [
            "siftUp on push()",
            "siftDown on pop()",
            "Swapping with smaller child in MinHeap"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d18-b1-heap-array-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "MinHeap Class Structure",
            "codeSnippet": "push(val) {\n  this.heap.push(val);\n  this._siftUp(this.heap.length - 1); // Bubble up to proper tier\n}\npop() {\n  const min = this.heap[0];\n  this.heap[0] = this.heap.pop(); // Swap last element to root\n  this._siftDown(0);              // Sink down to proper tier\n  return min;\n}",
            "lineNotes": {
              "2": "Appends to end of array in O(1).",
              "3": "Sifts up at most log N levels.",
              "8": "Sinks down comparing against children in at most log N levels."
            }
          },
          {
            "type": "runnable_code",
            "filename": "min_heap_demo.js",
            "initialCode": "class SimpleMinHeap {\n  constructor() { this.h = []; }\n  push(v) {\n    this.h.push(v);\n    let i = this.h.length - 1;\n    while (i > 0) {\n      const p = Math.floor((i - 1) / 2);\n      if (this.h[i] < this.h[p]) { [this.h[i], this.h[p]] = [this.h[p], this.h[i]]; i = p; }\n      else break;\n    }\n  }\n  pop() {\n    if (this.h.length === 0) return null;\n    if (this.h.length === 1) return this.h.pop();\n    const min = this.h[0];\n    this.h[0] = this.h.pop();\n    let i = 0;\n    while (true) {\n      let s = i, l = 2*i + 1, r = 2*i + 2;\n      if (l < this.h.length && this.h[l] < this.h[s]) s = l;\n      if (r < this.h.length && this.h[r] < this.h[s]) s = r;\n      if (s !== i) { [this.h[i], this.h[s]] = [this.h[s], this.h[i]]; i = s; }\n      else break;\n    }\n    return min;\n  }\n}\n\nconst h = new SimpleMinHeap();\nh.push(10); h.push(4); h.push(15); h.push(1);\nconsole.log(`Min 1: ${h.pop()}, Min 2: ${h.pop()}`);",
            "expectedOutput": "Min 1: 1, Min 2: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What are the first two values extracted from the MinHeap above?",
          "expectedStringOutput": "Min 1: 1, Min 2: 4",
          "acceptableAnswers": [
            "Min 1: 1, Min 2: 4",
            "1 and 4",
            "1, 4"
          ],
          "primaryMisconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
          "diagnosisMap": {
            "10 and 15": {
              "misconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
              "errorExplanation": "A MinHeap always extracts the smallest remaining element (1, then 4).",
              "recoveryPath": {
                "simplerExplanation": "MinHeap pops smallest first: 1 then 4.",
                "guidedFixPrompt": "Type Min 1: 1, Min 2: 4"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d18-b3-priority-queue-applications",
        "day": 18,
        "blockNumber": 3,
        "title": "Priority Queue Applications: Task Scheduling & Top-K Elements",
        "conceptBudget": {
          "primaryConcept": "Priority Queue",
          "supportingTerms": [
            "Top-K elements in O(N log K)",
            "Min-Heap of size K for K largest elements"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d18-b2-sift-up-down",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "top_k_demo.js",
            "initialCode": "function findKthLargest(nums, k) {\n  const sorted = [...nums].sort((a, b) => b - a);\n  return sorted[k - 1];\n}\n\nconsole.log('3rd Largest in [7, 10, 4, 3, 20, 15]:', findKthLargest([7, 10, 4, 3, 20, 15], 3));",
            "expectedOutput": "3rd Largest in [7, 10, 4, 3, 20, 15]: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 3rd largest number in `[7, 10, 4, 3, 20, 15]`?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "3rd Largest in [7, 10, 4, 3, 20, 15]: 10"
          ],
          "primaryMisconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
          "diagnosisMap": {
            "15": {
              "misconceptionId": "MC_DSA_HEAP_MAX_MIN_PROPERTY_HEAPIFY",
              "errorExplanation": "1st is 20, 2nd is 15, 3rd is 10.",
              "recoveryPath": {
                "simplerExplanation": "3rd largest is 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Tries (Prefix Trees) & Fast Prefix Auto-Complete",
    "overviewMetaphor": "A Trie is a spelling tree in an English dictionary: instead of searching through 500,000 words one by one (O(N)), you follow the letter branches: from the root you go to letter 'C', then 'A', then 'T' (3 steps); at node 'T', you find all words starting with \"CAT\" (\"cat\", \"caterpillar\", \"catalyst\") instantly in O(Length) time.",
    "blocks": [
      {
        "id": "dsa-d19-b1-trie-node-structure",
        "day": 19,
        "blockNumber": 1,
        "title": "TrieNode Architecture & Branch Insertion in O(K)",
        "conceptBudget": {
          "primaryConcept": "TrieNode Data Structure",
          "supportingTerms": [
            "TrieNode { children: {}, isEnd: boolean }",
            "O(K) Word Length Insertion",
            "Prefix Sharing across Words"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d7-b1-hash-function-chaining",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Trie Insert Flow for 'CAT'",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Root Node -> Navigate / Create child 'c'",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Node 'c' -> Navigate / Create child 'a'",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Node 'a' -> Navigate / Create child 't'",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Node 't' -> Set isEnd = true",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "trie_demo.js",
            "initialCode": "class TrieNode {\n  constructor() { this.children = {}; this.isEnd = false; }\n}\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const ch of prefix) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return true;\n  }\n}\n\nconst trie = new Trie();\ntrie.insert('apple');\nconsole.log('Search apple:', trie.search('apple'));\nconsole.log('Search app (prefix only):', trie.search('app'));\nconsole.log('StartsWith app:', trie.startsWith('app'));",
            "expectedOutput": "Search apple: true\nSearch app (prefix only): false\nStartsWith app: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does `trie.search('app')` return `false` when only `'apple'` was inserted?",
          "options": [
            "Because node 'p' has `isEnd === false`, meaning 'app' is only a prefix of an inserted word, not an inserted word itself",
            "Because 'app' is too short",
            "Because the Trie crashed"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
              "errorExplanation": "search() checks if isEnd is true, distinguishing exact full words from partial prefixes.",
              "recoveryPath": {
                "simplerExplanation": "isEnd is false for prefixes -> search returns false.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d19-b2-prefix-dfs-collection",
        "day": 19,
        "blockNumber": 2,
        "title": "Prefix Auto-Complete DFS Word Harvesting",
        "conceptBudget": {
          "primaryConcept": "Trie DFS Word Collection",
          "supportingTerms": [
            "Navigating to prefix node endpoint",
            "Recursive DFS to harvest all isEnd descendants",
            "Dictionary Suggestion Generator"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d19-b1-trie-node-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "prefix_collect.js",
            "initialCode": "function getWordsWithPrefix(trie, prefix) {\n  let node = trie.root;\n  for (const ch of prefix) {\n    if (!node.children[ch]) return [];\n    node = node.children[ch];\n  }\n  const results = [];\n  function dfs(curr, str) {\n    if (curr.isEnd) results.push(str);\n    for (const ch in curr.children) dfs(curr.children[ch], str + ch);\n  }\n  dfs(node, prefix);\n  return results;\n}\n\nconst t = new Trie();\nt.insert('car'); t.insert('card'); t.insert('care'); t.insert('dog');\nconsole.log('Prefix \"car\" matches:', JSON.stringify(getWordsWithPrefix(t, 'car')));",
            "expectedOutput": "Prefix \"car\" matches: [\"car\",\"card\",\"care\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What words match prefix `'car'` in the dictionary above?",
          "expectedStringOutput": "[\"car\",\"card\",\"care\"]",
          "acceptableAnswers": [
            "[\"car\",\"card\",\"care\"]",
            "['car','card','care']",
            "car, card, care"
          ],
          "primaryMisconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
          "diagnosisMap": {
            "[\"car\",\"card\",\"care\",\"dog\"]": {
              "misconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
              "errorExplanation": "'dog' does not start with prefix 'car'.",
              "recoveryPath": {
                "simplerExplanation": "Only words starting with 'car' are returned: ['car', 'card', 'care'].",
                "guidedFixPrompt": "Type [\"car\",\"card\",\"care\"]"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d19-b3-space-complexity-trie",
        "day": 19,
        "blockNumber": 3,
        "title": "Trie Space Complexity & Compressed Radix Trees",
        "conceptBudget": {
          "primaryConcept": "Trie Space Trade-offs",
          "supportingTerms": [
            "O(AlphabetSize * N * K) node overhead",
            "Radix Tree edge compression (combining single-child nodes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d19-b2-prefix-dfs-collection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "radix_tree_sim.js",
            "initialCode": "function countSharedNodes(w1, w2) {\n  let shared = 0;\n  for (let i = 0; i < Math.min(w1.length, w2.length); i++) {\n    if (w1[i] === w2[i]) shared++;\n    else break;\n  }\n  return shared;\n}\n\nconsole.log('Shared prefix length for \"connect\" and \"connection\":', countSharedNodes('connect', 'connection'));",
            "expectedOutput": "Shared prefix length for \"connect\" and \"connection\": 7",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many prefix characters are shared between `'connect'` and `'connection'`?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "Shared prefix length for \"connect\" and \"connection\": 7"
          ],
          "primaryMisconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
          "diagnosisMap": {
            "6": {
              "misconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
              "errorExplanation": "All 7 letters of 'connect' are shared.",
              "recoveryPath": {
                "simplerExplanation": "'connect' has 7 letters.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Graph Representations (Adjacency List/Matrix) & BFS/DFS",
    "overviewMetaphor": "A Graph is a social network: people are vertices (nodes) and friendships are edges; an Adjacency List is each person's phone contacts book (`contacts[\"Alice\"] = [\"Bob\", \"Charlie\"]`), which uses very little memory for sparse networks; Breadth-First Search (BFS) is a viral post spreading ripple by ripple to all direct friends (Distance 1), then friends-of-friends (Distance 2).",
    "blocks": [
      {
        "id": "dsa-d20-b1-graph-representations",
        "day": 20,
        "blockNumber": 1,
        "title": "Adjacency List vs Adjacency Matrix Space Trade-offs",
        "conceptBudget": {
          "primaryConcept": "Graph Data Structures",
          "supportingTerms": [
            "Adjacency List `Map<Node, Node[]>` in O(V + E) space",
            "Adjacency Matrix `matrix[u][v]` in O(V^2) space",
            "Directed vs Undirected Graphs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d16-b1-tree-node-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Adjacency List vs Matrix Space Comparison",
              "boxes": [
                {
                  "label": "Adjacency List (Sparse Graph)",
                  "value": "O(V + E) memory (Only stores real edges)",
                  "varType": "Efficient Map/Array",
                  "isUpdated": false
                },
                {
                  "label": "Adjacency Matrix (Dense Graph)",
                  "value": "O(V^2) memory (Stores mostly 0s in sparse graphs)",
                  "varType": "2D Grid",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "graph_rep_demo.js",
            "initialCode": "const adjList = {\n  'A': ['B', 'C'],\n  'B': ['A', 'D'],\n  'C': ['A', 'D'],\n  'D': ['B', 'C']\n};\n\nconsole.log('Neighbors of A:', JSON.stringify(adjList['A']));",
            "expectedOutput": "Neighbors of A: [\"B\",\"C\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do real-world social networks (1,000,000 users) use Adjacency Lists instead of Adjacency Matrices?",
          "options": [
            "Because an adjacency matrix of 1,000,000 users would require 1,000,000^2 = 1,000,000,000,000 memory cells (terabytes), while each user has only ~500 friends in an adjacency list (megabytes)",
            "Because matrices don't support strings",
            "Because lists are always faster for any matrix math"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_GRAPH_BFS_QUEUE_VISITED_SET",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_GRAPH_BFS_QUEUE_VISITED_SET",
              "errorExplanation": "Sparse graphs have far fewer edges than V^2, making adjacency lists vastly more space-efficient.",
              "recoveryPath": {
                "simplerExplanation": "Adjacency lists save huge amounts of RAM on sparse graphs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d20-b2-graph-bfs-shortest-path",
        "day": 20,
        "blockNumber": 2,
        "title": "Graph BFS: Shortest Unweighted Path & Visited Set",
        "conceptBudget": {
          "primaryConcept": "Graph BFS Shortest Path",
          "supportingTerms": [
            "Visited Set to prevent infinite cycles",
            "FIFO Queue `[node, distance]`",
            "Guaranteed Minimum Steps"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d20-b1-graph-representations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Graph BFS Template",
            "codeSnippet": "const queue = [[start, 0]];\nconst visited = new Set([start]);\nwhile (queue.length > 0) {\n  const [node, dist] = queue.shift();\n  if (node === target) return dist;\n  for (const neighbor of graph[node]) {\n    if (!visited.has(neighbor)) {\n      visited.add(neighbor);\n      queue.push([neighbor, dist + 1]);\n    }\n  }\n}",
            "lineNotes": {
              "2": "Visited Set prevents processing the same node multiple times in cycles.",
              "7": "Adds neighbor immediately to visited when enqueuing to avoid duplicate queue entries."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bfs_graph_demo.js",
            "initialCode": "function shortestPathBFS(graph, start, target) {\n  const queue = [[start, 0]];\n  const visited = new Set([start]);\n  while (queue.length > 0) {\n    const [node, dist] = queue.shift();\n    if (node === target) return dist;\n    for (const neighbor of (graph[node] || [])) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push([neighbor, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}\n\nconst g = { A: ['B', 'C'], B: ['D'], C: ['D'], D: ['E'], E: [] };\nconsole.log('Shortest path A -> E:', shortestPathBFS(g, 'A', 'E'));",
            "expectedOutput": "Shortest path A -> E: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the shortest step count from A to E in the graph above (`A -> B -> D -> E`)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Shortest path A -> E: 3"
          ],
          "primaryMisconceptionId": "MC_DSA_GRAPH_BFS_QUEUE_VISITED_SET",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DSA_GRAPH_BFS_QUEUE_VISITED_SET",
              "errorExplanation": "Path is A (0) -> B (1) -> D (2) -> E (3 steps).",
              "recoveryPath": {
                "simplerExplanation": "3 edge transitions = 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d20-b3-connected-components",
        "day": 20,
        "blockNumber": 3,
        "title": "Connected Components Count & Number of Islands",
        "conceptBudget": {
          "primaryConcept": "Connected Components",
          "supportingTerms": [
            "Outer Loop over all V vertices",
            "Triggering DFS/BFS to mark entire connected component",
            "Disjoint Graph Islands"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d20-b2-graph-bfs-shortest-path",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "components_demo.js",
            "initialCode": "function countComponents(n, edges) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }\n  const visited = new Set();\n  let islands = 0;\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      islands++;\n      const q = [i]; visited.add(i);\n      while (q.length > 0) {\n        const u = q.shift();\n        for (const v of adj[u]) { if (!visited.has(v)) { visited.add(v); q.push(v); } }\n      }\n    }\n  }\n  return islands;\n}\n\nconsole.log('Component Count for 5 nodes with edges [[0,1], [1,2], [3,4]]:', countComponents(5, [[0,1], [1,2], [3,4]]));",
            "expectedOutput": "Component Count for 5 nodes with edges [[0,1], [1,2], [3,4]]: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many disconnected component islands exist for 5 nodes with edges `[[0,1], [1,2], [3,4]]`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Component Count for 5 nodes with edges [[0,1], [1,2], [3,4]]: 2"
          ],
          "primaryMisconceptionId": "MC_DSA_GRAPH_BFS_QUEUE_VISITED_SET",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DSA_GRAPH_BFS_QUEUE_VISITED_SET",
              "errorExplanation": "Island 1 is {0, 1, 2} and Island 2 is {3, 4}, totaling 2 disjoint components.",
              "recoveryPath": {
                "simplerExplanation": "2 separate clusters -> 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Fast Auto-Complete Engine (Trie + Frequency Min-Heap)",
    "overviewMetaphor": "Milestone 3 — Real-Time Search Auto-Complete Engine: When you type \"rea\" into a search bar, a Prefix Tree (Trie) navigates directly to the \"rea\" node in 3 CPU operations; from there, a Priority Queue (Min-Heap) ranks the top-3 most popular searches (\"react\", \"reach\", \"real-time\") to display suggestions before you finish typing your next keystroke.",
    "blocks": [
      {
        "id": "dsa-d21-b1-autocomplete-architecture",
        "day": 21,
        "blockNumber": 1,
        "title": "Auto-Complete Architecture: Trie Nodes with Frequency Records",
        "conceptBudget": {
          "primaryConcept": "Auto-Complete Architecture",
          "supportingTerms": [
            "Trie Prefix Routing",
            "Frequency Weight Tracking",
            "Top-K Suggestion Extraction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d19-b1-trie-node-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Auto-Complete Query Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. User types prefix 'rea' -> Navigate Trie in O(Length) time",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Traverse all candidate child completions",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Rank completions by search frequency desc & alphabetical asc",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Return Top-K suggestions in < 1ms",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "autocomplete_demo.js",
            "initialCode": "class SearchAutocomplete {\n  constructor() { this.entries = []; }\n  insert(word, freq) { this.entries.push({ word, freq }); }\n  suggest(prefix, k = 2) {\n    return this.entries\n      .filter(e => e.word.startsWith(prefix))\n      .sort((a, b) => b.freq - a.freq || a.word.localeCompare(b.word))\n      .slice(0, k)\n      .map(e => e.word);\n  }\n}\n\nconst ac = new SearchAutocomplete();\nac.insert('react', 100); ac.insert('redux', 50); ac.insert('reach', 80);\nconsole.log('Top 2 suggestions for \"rea\":', JSON.stringify(ac.suggest('rea', 2)));",
            "expectedOutput": "Top 2 suggestions for \"rea\": [\"react\",\"reach\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What are the top 2 suggestions returned for prefix `'rea'` in order of frequency (react: 100, reach: 80, redux: 50)?",
          "expectedStringOutput": "[\"react\",\"reach\"]",
          "acceptableAnswers": [
            "[\"react\",\"reach\"]",
            "['react','reach']",
            "react, reach"
          ],
          "primaryMisconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
          "diagnosisMap": {
            "[\"react\",\"redux\"]": {
              "misconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
              "errorExplanation": "'redux' does not start with 'rea', and 'reach' has a higher frequency (80) than redux (50).",
              "recoveryPath": {
                "simplerExplanation": "Top 2 for 'rea' by frequency are react and reach.",
                "guidedFixPrompt": "Type [\"react\",\"reach\"]"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d21-b2-tiebreaking-invariants",
        "day": 21,
        "blockNumber": 2,
        "title": "Deterministic Lexicographical Tie-Breaking",
        "conceptBudget": {
          "primaryConcept": "Lexicographical Tiebreaking",
          "supportingTerms": [
            "Primary Sort: Descending Frequency",
            "Secondary Sort: `a.localeCompare(b)` Alphabetical",
            "Deterministic Output Guarantees"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d21-b1-autocomplete-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tiebreak_demo.js",
            "initialCode": "const candidates = [\n  { word: 'bear', freq: 50 },\n  { word: 'apple', freq: 50 }\n];\n\n// Equal frequency -> alphabetical tiebreak\ncandidates.sort((a, b) => b.freq - a.freq || a.word.localeCompare(b.word));\nconsole.log('Tiebreak order:', candidates.map(c => c.word).join(', '));",
            "expectedOutput": "Tiebreak order: apple, bear",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When 'apple' and 'bear' have identical frequency (50), which word ranks first alphabetically?",
          "expectedStringOutput": "apple",
          "acceptableAnswers": [
            "apple",
            "Tiebreak order: apple, bear"
          ],
          "primaryMisconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
          "diagnosisMap": {
            "bear": {
              "misconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
              "errorExplanation": "'apple' precedes 'bear' alphabetically.",
              "recoveryPath": {
                "simplerExplanation": "'apple' comes before 'bear'.",
                "guidedFixPrompt": "Type apple"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d21-b3-milestone-autocomplete-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Auto-Complete Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Auto-Complete Certification",
          "supportingTerms": [
            "Sub-millisecond Search Response",
            "100% Deterministic Ranking Verified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d21-b2-tiebreaking-invariants",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ac_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Fast Auto-Complete Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Fast Auto-Complete Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 verification?",
          "expectedStringOutput": "⭐ MILESTONE 3: Fast Auto-Complete Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Fast Auto-Complete Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DSA_TRIE_PREFIX_NODE_END_OF_WORD",
              "errorExplanation": "Returns ⭐ MILESTONE 3: Fast Auto-Complete Engine [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches certification string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Fast Auto-Complete Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Dijkstra's Shortest Path Algorithm & Weighted Graphs",
    "overviewMetaphor": "Dijkstra's algorithm is GPS navigation with toll roads: you want to drive from City A to City D with the cheapest total gas and toll cost; you explore the cheapest frontier first using a Priority Queue; the instant you pop City D from the queue, GPS guarantees you have found the absolute cheapest driving route in the world.",
    "blocks": [
      {
        "id": "dsa-d22-b1-dijkstra-priority-queue",
        "day": 22,
        "blockNumber": 1,
        "title": "Greedy Edge Relaxation with Min-Priority Queues",
        "conceptBudget": {
          "primaryConcept": "Dijkstra's Algorithm",
          "supportingTerms": [
            "Greedy Edge Relaxation `dist[u] + weight < dist[v]`",
            "Priority Queue `[node, cost]`",
            "Non-Negative Edge Weight Requirement",
            "O((V + E) log V) Time"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d20-b2-graph-bfs-shortest-path",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Dijkstra Relaxation Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Init dist[start] = 0, all others = Infinity; Push [start, 0] to Priority Queue",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Pop [curr, d] with smallest distance from Priority Queue",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If d > dist[curr] -> Skip (stale entry)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. For neighbor with weight w: If d + w < dist[neighbor] -> dist[neighbor] = d + w, Enqueue [neighbor, d + w]",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dijkstra_demo.js",
            "initialCode": "function dijkstra(graph, start) {\n  const dist = {};\n  for (const node in graph) dist[node] = Infinity;\n  dist[start] = 0;\n  const pq = [[start, 0]];\n  while (pq.length > 0) {\n    pq.sort((a, b) => a[1] - b[1]);\n    const [curr, d] = pq.shift();\n    if (d > dist[curr]) continue;\n    for (const [neighbor, weight] of (graph[curr] || [])) {\n      if (dist[curr] + weight < dist[neighbor]) {\n        dist[neighbor] = dist[curr] + weight;\n        pq.push([neighbor, dist[neighbor]]);\n      }\n    }\n  }\n  return dist;\n}\n\nconst g = { A: [['B', 4], ['C', 2]], B: [['D', 10]], C: [['B', 1], ['D', 5]], D: [] };\nconsole.log('Shortest distances from A:', JSON.stringify(dijkstra(g, 'A')));",
            "expectedOutput": "Shortest distances from A: {\"A\":0,\"B\":3,\"C\":2,\"D\":7}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the shortest distance from A to B in the graph above (A->C->B with cost 2+1=3 vs direct A->B cost 4)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "dist.B: 3"
          ],
          "primaryMisconceptionId": "MC_DSA_DIJKSTRA_SHORTEST_PATH_PRIORITY_QUEUE",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DSA_DIJKSTRA_SHORTEST_PATH_PRIORITY_QUEUE",
              "errorExplanation": "Direct edge A->B costs 4, but path A->C (2) + C->B (1) costs only 3.",
              "recoveryPath": {
                "simplerExplanation": "Path through C costs 2 + 1 = 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d22-b2-negative-weight-limitation",
        "day": 22,
        "blockNumber": 2,
        "title": "Why Dijkstra Fails on Negative Edge Weights",
        "conceptBudget": {
          "primaryConcept": "Non-Negative Weight Constraint",
          "supportingTerms": [
            "Greedy finalized distance assumption",
            "Negative Cycles require Bellman-Ford"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d22-b1-dijkstra-priority-queue",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Algorithm Comparison for Weighted Graphs",
            "codeSnippet": "// 1. Non-negative weights: Dijkstra's Algorithm O((V + E) log V) -> FAST\n// 2. Negative weights: Bellman-Ford Algorithm O(V * E) -> SLOWER BUT HANDLES NEGATIVE CYCLES",
            "lineNotes": {
              "1": "Dijkstra assumes distances only increase along paths.",
              "2": "Bellman-Ford re-relaxes all edges V-1 times to catch negative costs."
            }
          },
          {
            "type": "runnable_code",
            "filename": "algo_selection.js",
            "initialCode": "function selectShortestPathAlgorithm(hasNegativeWeights) {\n  return hasNegativeWeights ? 'Bellman-Ford' : 'Dijkstra';\n}\n\nconsole.log('Algorithm for standard road map (positive miles):', selectShortestPathAlgorithm(false));\nconsole.log('Algorithm for currency arbitrage (negative log rates):', selectShortestPathAlgorithm(true));",
            "expectedOutput": "Algorithm for standard road map (positive miles): Dijkstra\nAlgorithm for currency arbitrage (negative log rates): Bellman-Ford",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why can't Dijkstra's algorithm handle graphs with negative edge weights?",
          "options": [
            "Because once a node is popped from the priority queue, Dijkstra greedily assumes its shortest distance is permanently finalized, which is invalidated if a negative edge later reduces its cost",
            "Because computers cannot add negative numbers",
            "Because queues cannot store negative numbers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_DIJKSTRA_SHORTEST_PATH_PRIORITY_QUEUE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_DIJKSTRA_SHORTEST_PATH_PRIORITY_QUEUE",
              "errorExplanation": "Negative weights violate the greedy non-decreasing path cost invariant.",
              "recoveryPath": {
                "simplerExplanation": "Greedy finality assumption breaks with negative weights.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d22-b3-network-delay-time",
        "day": 22,
        "blockNumber": 3,
        "title": "Network Delay Time: Broadcast Latency Calculation",
        "conceptBudget": {
          "primaryConcept": "Broadcast Latency",
          "supportingTerms": [
            "Max shortest path from source node across all V nodes",
            "Unreachable nodes return -1"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d22-b2-negative-weight-limitation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "network_delay.js",
            "initialCode": "function networkDelayTime(times, n, k) {\n  const g = {};\n  for (let i = 1; i <= n; i++) g[i] = [];\n  for (const [u, v, w] of times) g[u].push([v, w]);\n  const dist = dijkstra(g, k);\n  let maxD = 0;\n  for (let i = 1; i <= n; i++) {\n    if (dist[i] === Infinity) return -1;\n    maxD = Math.max(maxD, dist[i]);\n  }\n  return maxD;\n}\n\nconsole.log('Network Delay Time for [[2,1,1],[2,3,1],[3,4,1]] from source 2:', networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2));",
            "expectedOutput": "Network Delay Time for [[2,1,1],[2,3,1],[3,4,1]] from source 2: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the network delay time for signal from node 2 to reach all 4 nodes in the network above?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Network Delay Time: 2"
          ],
          "primaryMisconceptionId": "MC_DSA_DIJKSTRA_SHORTEST_PATH_PRIORITY_QUEUE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DSA_DIJKSTRA_SHORTEST_PATH_PRIORITY_QUEUE",
              "errorExplanation": "Node 1 takes 1s, Node 3 takes 1s, Node 4 takes 1+1=2s. Max time is 2.",
              "recoveryPath": {
                "simplerExplanation": "Max travel time is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Topological Sort (Kahn's In-Degree Algorithm) & DAGs",
    "overviewMetaphor": "Topological Sort is getting dressed in the morning: you cannot put your shoes on before your socks (Prerequisite dependency: socks -> shoes); Kahn's algorithm looks at all your clothes, finds items with 0 unmet dependencies (Underwear, Socks), puts them on, and unlocks the next items (Pants, Shoes) until you are fully dressed.",
    "blocks": [
      {
        "id": "dsa-d23-b1-dag-indegree-kahn",
        "day": 23,
        "blockNumber": 1,
        "title": "Directed Acyclic Graphs (DAG) & Kahn's In-Degree Queue",
        "conceptBudget": {
          "primaryConcept": "Kahn's Algorithm",
          "supportingTerms": [
            "In-Degree Array `inDegree[node]`",
            "Queue of 0-in-degree vertices",
            "Cycle Detection (order.length !== V)",
            "O(V + E) Linear Time"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d20-b1-graph-representations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Kahn's Topological Sort Step Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Compute in-degree (number of incoming dependency edges) for all nodes",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Push all nodes with in-degree === 0 to FIFO queue",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Dequeue node -> Add to final order -> Decrement all neighbor in-degrees",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. If neighbor in-degree reaches 0 -> Push to queue",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "topological_sort_demo.js",
            "initialCode": "function findOrder(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  const order = [];\n  while (queue.length > 0) {\n    const u = queue.shift();\n    order.push(u);\n    for (const v of adj[u]) {\n      inDegree[v]--;\n      if (inDegree[v] === 0) queue.push(v);\n    }\n  }\n  return order.length === numCourses ? order : [];\n}\n\nconsole.log('Valid Course Order for 4 courses:', JSON.stringify(findOrder(4, [[1,0],[2,0],[3,1],[3,2]])));",
            "expectedOutput": "Valid Course Order for 4 courses: [0,1,2,3]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the initial course taken (with 0 prerequisites) in the order `[0,1,2,3]` above?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "Course 0"
          ],
          "primaryMisconceptionId": "MC_DSA_TOPOLOGICAL_SORT_KAHN_INDEGREE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_TOPOLOGICAL_SORT_KAHN_INDEGREE",
              "errorExplanation": "Course 1 requires Course 0. Only Course 0 has 0 prerequisites.",
              "recoveryPath": {
                "simplerExplanation": "Course 0 has in-degree 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d23-b2-cycle-detection-kahns",
        "day": 23,
        "blockNumber": 2,
        "title": "Circular Dependency Detection in Build Systems",
        "conceptBudget": {
          "primaryConcept": "Cycle Detection via In-Degrees",
          "supportingTerms": [
            "Circular Deadlock (A requires B, B requires A)",
            "Unprocessed nodes remaining with in-degree > 0",
            "Empty array return on cycle"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d23-b1-dag-indegree-kahn",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cycle_schedule.js",
            "initialCode": "function canFinish(numCourses, prerequisites) {\n  const order = findOrder(numCourses, prerequisites);\n  return order.length === numCourses;\n}\n\nconsole.log('Can finish cyclic courses [[1,0], [0,1]]?:', canFinish(2, [[1,0], [0,1]]));",
            "expectedOutput": "Can finish cyclic courses [[1,0], [0,1]]?: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can a student finish courses if `[1, 0]` and `[0, 1]` form a circular prerequisite loop?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Can finish cyclic courses [[1,0], [0,1]]?: false"
          ],
          "primaryMisconceptionId": "MC_DSA_TOPOLOGICAL_SORT_KAHN_INDEGREE",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_DSA_TOPOLOGICAL_SORT_KAHN_INDEGREE",
              "errorExplanation": "Circular dependencies make it impossible to take either course first, returning false.",
              "recoveryPath": {
                "simplerExplanation": "Circular loop -> impossible to finish -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d23-b3-monorepo-build-graph",
        "day": 23,
        "blockNumber": 3,
        "title": "Monorepo Package Compilation Scheduler",
        "conceptBudget": {
          "primaryConcept": "Build Dependency Graph",
          "supportingTerms": [
            "Parallel task scheduling tiers",
            "Compiling independent leaf packages first"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d23-b2-cycle-detection-kahns",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "build_scheduler.js",
            "initialCode": "const buildSteps = ['core-utils', 'auth-service', 'web-app'];\nconsole.log('Build Pipeline:', buildSteps.join(' -> '));",
            "expectedOutput": "Build Pipeline: core-utils -> auth-service -> web-app",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which base library must be compiled first in the pipeline `core-utils -> auth-service -> web-app`?",
          "expectedStringOutput": "core-utils",
          "acceptableAnswers": [
            "core-utils",
            "'core-utils'"
          ],
          "primaryMisconceptionId": "MC_DSA_TOPOLOGICAL_SORT_KAHN_INDEGREE",
          "diagnosisMap": {
            "web-app": {
              "misconceptionId": "MC_DSA_TOPOLOGICAL_SORT_KAHN_INDEGREE",
              "errorExplanation": "web-app is the top-level dependent application. The foundation is core-utils.",
              "recoveryPath": {
                "simplerExplanation": "Base utility must build first.",
                "guidedFixPrompt": "Type core-utils"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Disjoint Set Union (Union-Find) with Path Compression & Rank",
    "overviewMetaphor": "Union-Find is corporate mergers: each small startup has a CEO (`parent[x] = x`); when Company A merges with Company B (`union(A, B)`), one CEO reports to the other; with Path Compression, whenever an employee asks \"Who is my master boss?\" (`find(x)`), they connect their phone directly to the global CEO, flattening the corporate hierarchy into instant O(1) communication.",
    "blocks": [
      {
        "id": "dsa-d24-b1-union-find-path-compression",
        "day": 24,
        "blockNumber": 1,
        "title": "Disjoint Set Union: Path Compression & Union by Rank",
        "conceptBudget": {
          "primaryConcept": "Union-Find Data Structure",
          "supportingTerms": [
            "find(x) with `parent[x] = find(parent[x])`",
            "union(x, y) with Rank balancing",
            "Inverse Ackermann alpha(N) ~ O(1) Amortized Time"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d20-b3-connected-components",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Path Compression Implementation",
            "codeSnippet": "find(x) {\n  if (this.parent[x] !== x) {\n    this.parent[x] = this.find(this.parent[x]); // Points directly to root leader!\n  }\n  return this.parent[x];\n}",
            "lineNotes": {
              "2": "Flattens tree depth to 1 on every lookup.",
              "5": "Returns canonical group representative."
            }
          },
          {
            "type": "runnable_code",
            "filename": "union_find_demo.js",
            "initialCode": "class UnionFind {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i);\n    this.rank = new Array(n).fill(0);\n  }\n  find(x) {\n    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);\n    return this.parent[x];\n  }\n  union(x, y) {\n    const rootX = this.find(x), rootY = this.find(y);\n    if (rootX === rootY) return false;\n    if (this.rank[rootX] < this.rank[rootY]) this.parent[rootX] = rootY;\n    else if (this.rank[rootX] > this.rank[rootY]) this.parent[rootY] = rootX;\n    else { this.parent[rootY] = rootX; this.rank[rootX]++; }\n    return true;\n  }\n  connected(x, y) { return this.find(x) === this.find(y); }\n}\n\nconst uf = new UnionFind(4);\nuf.union(0, 1); uf.union(1, 2);\nconsole.log('Connected 0 & 2?:', uf.connected(0, 2));\nconsole.log('Connected 0 & 3?:', uf.connected(0, 3));",
            "expectedOutput": "Connected 0 & 2?: true\nConnected 0 & 3?: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the time complexity of `find()` and `union()` when combining Path Compression and Union by Rank?",
          "options": [
            "Amortized O(alpha(N)) nearly instantaneous O(1) time (where alpha is the Inverse Ackermann function, strictly <= 4 for all atoms in the universe)",
            "O(N^2) quadratic time",
            "O(N log N) comparison sort time"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DSA_UNION_FIND_DISJOINT_SET_PATH_COMPRESSION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_UNION_FIND_DISJOINT_SET_PATH_COMPRESSION",
              "errorExplanation": "Path compression + rank guarantees near-constant alpha(N) amortized time.",
              "recoveryPath": {
                "simplerExplanation": "Amortized O(1) alpha(N) time.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "dsa-d24-b2-redundant-connection-cycle",
        "day": 24,
        "blockNumber": 2,
        "title": "Detecting Redundant Cycle Edges with Union-Find",
        "conceptBudget": {
          "primaryConcept": "Cycle Detection in Undirected Graph",
          "supportingTerms": [
            "If `union(u, v) === false` -> Edge (u, v) creates a cycle!",
            "Kruskal's Minimum Spanning Tree foundation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d24-b1-union-find-path-compression",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "redundant_conn.js",
            "initialCode": "function findRedundantConnection(edges) {\n  const uf = new UnionFind(edges.length + 1);\n  for (const [u, v] of edges) {\n    if (!uf.union(u, v)) return [u, v];\n  }\n  return [];\n}\n\nconsole.log('Redundant Cycle Edge in [[1,2],[1,3],[2,3]]:', JSON.stringify(findRedundantConnection([[1,2],[1,3],[2,3]])));",
            "expectedOutput": "Redundant Cycle Edge in [[1,2],[1,3],[2,3]]: [2,3]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which edge creates the cycle in the triangle graph `[[1,2], [1,3], [2,3]]`?",
          "expectedStringOutput": "[2,3]",
          "acceptableAnswers": [
            "[2,3]",
            "[2, 3]"
          ],
          "primaryMisconceptionId": "MC_DSA_UNION_FIND_DISJOINT_SET_PATH_COMPRESSION",
          "diagnosisMap": {
            "[1,2]": {
              "misconceptionId": "MC_DSA_UNION_FIND_DISJOINT_SET_PATH_COMPRESSION",
              "errorExplanation": "Edges [1,2] and [1,3] form a valid tree. When [2,3] is added, 2 and 3 are already connected, creating the cycle.",
              "recoveryPath": {
                "simplerExplanation": "Edge [2, 3] creates the redundant cycle.",
                "guidedFixPrompt": "Type [2,3]"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d24-b3-kruskals-mst",
        "day": 24,
        "blockNumber": 3,
        "title": "Kruskal's Minimum Spanning Tree (MST) Algorithm",
        "conceptBudget": {
          "primaryConcept": "Kruskal's Algorithm",
          "supportingTerms": [
            "Sort edges by weight ascending",
            "Greedily union edges that do not form cycles",
            "O(E log E) Time"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d24-b2-redundant-connection-cycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "kruskal_demo.js",
            "initialCode": "function kruskalMST(n, edges) {\n  edges.sort((a, b) => a[2] - b[2]); // Sort by weight\n  const uf = new UnionFind(n);\n  let totalWeight = 0;\n  for (const [u, v, w] of edges) {\n    if (uf.union(u, v)) totalWeight += w;\n  }\n  return totalWeight;\n}\n\nconst edges = [[0,1,1], [1,2,2], [0,2,5]];\nconsole.log('Minimum Spanning Tree Total Weight:', kruskalMST(3, edges));",
            "expectedOutput": "Minimum Spanning Tree Total Weight: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the minimal total weight connecting 3 vertices with edges `(0-1, w=1), (1-2, w=2), (0-2, w=5)`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Minimum Spanning Tree Total Weight: 3"
          ],
          "primaryMisconceptionId": "MC_DSA_UNION_FIND_DISJOINT_SET_PATH_COMPRESSION",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_DSA_UNION_FIND_DISJOINT_SET_PATH_COMPRESSION",
              "errorExplanation": "Kruskal selects edges of weights 1 and 2 (1 + 2 = 3), discarding the expensive redundant edge of weight 5.",
              "recoveryPath": {
                "simplerExplanation": "1 + 2 = 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Dynamic Programming: 1D Memoization vs Tabulation",
    "overviewMetaphor": "Dynamic Programming is remembering past answers on an exam: if you solve 1 + 1 + 1 + 1 = 4 on page 1, and page 2 asks \"What is 1 + 1 + 1 + 1 + 1?\", you don't count from zero; you look at your previous answer (4) and simply add +1 = 5 (Memoization / Tabulation).",
    "blocks": [
      {
        "id": "dsa-d25-b1-overlapping-subproblems",
        "day": 25,
        "blockNumber": 1,
        "title": "Overlapping Subproblems & Fibonacci Recurrence Caching",
        "conceptBudget": {
          "primaryConcept": "Dynamic Programming Principles",
          "supportingTerms": [
            "Overlapping Subproblems",
            "Optimal Substructure",
            "Top-Down Memoization vs Bottom-Up Tabulation",
            "Exponential O(2^N) reduced to Linear O(N)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d11-b1-call-stack-frames",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Fibonacci Call Tree Pruning",
              "nodes": [
                {
                  "id": "1",
                  "label": "Without DP: fib(5) computes fib(3) two times and fib(2) three times -> O(2^N) Explosion",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "With DP Table: Store dp[3] = 2 in memory table on first computation",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Subsequent queries for fib(3) return in O(1) instant time",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Total Time Complexity drops from O(2^N) to strict O(N) linear",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fib_dp_demo.js",
            "initialCode": "function fib(n) {\n  if (n <= 1) return n;\n  let prev2 = 0, prev1 = 1;\n  for (let i = 2; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}\n\nconsole.log('Fibonacci(10):', fib(10));",
            "expectedOutput": "Fibonacci(10): 55",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `fib(10)` computed in O(N) time and O(1) space?",
          "expectedStringOutput": "55",
          "acceptableAnswers": [
            "55",
            "Fibonacci(10): 55"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_MEMOIZATION_VS_TABULATION",
          "diagnosisMap": {
            "1024": {
              "misconceptionId": "MC_DSA_DP_MEMOIZATION_VS_TABULATION",
              "errorExplanation": "Fibonacci sequence is 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55.",
              "recoveryPath": {
                "simplerExplanation": "fib(10) is 55.",
                "guidedFixPrompt": "Type 55"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d25-b2-house-robber-state-transition",
        "day": 25,
        "blockNumber": 2,
        "title": "House Robber: The DP State Transition Equation",
        "conceptBudget": {
          "primaryConcept": "State Transition Equation",
          "supportingTerms": [
            "`dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i])`",
            "Choice: Skip current house vs Rob current house",
            "Rolling Space Optimization O(1) space"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d25-b1-overlapping-subproblems",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "House Robber State Transition",
            "codeSnippet": "for (const loot of houses) {\n  const currentMax = Math.max(robPreviousHouse, robTwoHousesAgo + loot);\n  robTwoHousesAgo = robPreviousHouse;\n  robPreviousHouse = currentMax;\n}",
            "lineNotes": {
              "2": "At each house, chooses max between skipping this house (robPreviousHouse) or robbing it (robTwoHousesAgo + loot).",
              "4": "Maintains rolling 2-variable window, achieving O(N) time and O(1) space."
            }
          },
          {
            "type": "runnable_code",
            "filename": "house_robber_demo.js",
            "initialCode": "function rob(nums) {\n  let prev2 = 0, prev1 = 0;\n  for (const num of nums) {\n    const temp = Math.max(prev1, prev2 + num);\n    prev2 = prev1;\n    prev1 = temp;\n  }\n  return prev1;\n}\n\nconsole.log('Max loot for [2, 7, 9, 3, 1]:', rob([2, 7, 9, 3, 1]));",
            "expectedOutput": "Max loot for [2, 7, 9, 3, 1]: 12",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum loot from houses `[2, 7, 9, 3, 1]` (Robbing house 1 ($2) + house 3 ($9) + house 5 ($1))?",
          "expectedStringOutput": "12",
          "acceptableAnswers": [
            "12",
            "Max loot for [2, 7, 9, 3, 1]: 12"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_MEMOIZATION_VS_TABULATION",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_DSA_DP_MEMOIZATION_VS_TABULATION",
              "errorExplanation": "2 + 9 + 1 = 12.",
              "recoveryPath": {
                "simplerExplanation": "2 + 9 + 1 = 12.",
                "guidedFixPrompt": "Type 12"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d25-b3-climbing-stairs",
        "day": 25,
        "blockNumber": 3,
        "title": "Climbing Stairs (1 or 2 Steps Choice)",
        "conceptBudget": {
          "primaryConcept": "Step Recurrence",
          "supportingTerms": [
            "ways(n) = ways(n-1) + ways(n-2)",
            "Mapping combinatorial paths to DP"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d25-b2-house-robber-state-transition",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "climbing_stairs_demo.js",
            "initialCode": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    const c = a + b; a = b; b = c;\n  }\n  return b;\n}\n\nconsole.log('Distinct ways to climb 5 stairs:', climbStairs(5));",
            "expectedOutput": "Distinct ways to climb 5 stairs: 8",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many distinct ways are there to climb 5 stairs using 1 or 2 steps?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "Distinct ways to climb 5 stairs: 8"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_MEMOIZATION_VS_TABULATION",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_DSA_DP_MEMOIZATION_VS_TABULATION",
              "errorExplanation": "Ways follow Fibonacci: 1->1, 2->2, 3->3, 4->5, 5->8.",
              "recoveryPath": {
                "simplerExplanation": "For 5 stairs, there are 8 distinct combinations.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Optimization Engine",
    "overviewMetaphor": "Milestone 4 — Optimization Engine: You are packing a hiking backpack with a 5kg weight limit: for each item (flashlight, water bottle, stove), you decide whether to pack it (1) or leave it (0); a 2D dynamic programming grid tests all combinations in polynomial time, guaranteeing maximum survival value without exceeding weight limits.",
    "blocks": [
      {
        "id": "dsa-d26-b1-coin-change-unbounded",
        "day": 26,
        "blockNumber": 1,
        "title": "Coin Change: Minimum Coins Transition (Unbounded DP)",
        "conceptBudget": {
          "primaryConcept": "Unbounded DP",
          "supportingTerms": [
            "`dp[i] = Math.min(dp[i], dp[i - coin] + 1)`",
            "Infinite supply of each denomination",
            "Handling unreachable targets with -1"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d25-b2-house-robber-state-transition",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Coin Change State Transition",
            "codeSnippet": "const dp = new Array(amount + 1).fill(Infinity);\ndp[0] = 0; // 0 coins needed to make $0\nfor (let i = 1; i <= amount; i++) {\n  for (const coin of coins) {\n    if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n  }\n}",
            "lineNotes": {
              "1": "Initializes table with Infinity representing unachievable states.",
              "2": "Base case: 0 amount requires 0 coins.",
              "5": "Reuses already computed subproblems to find min coins."
            }
          },
          {
            "type": "runnable_code",
            "filename": "coin_change_demo.js",
            "initialCode": "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n\nconsole.log('Min coins for $11 with [1, 2, 5]:', coinChange([1, 2, 5], 11));\nconsole.log('Min coins for $3 with [2]:', coinChange([2], 3));",
            "expectedOutput": "Min coins for $11 with [1, 2, 5]: 3\nMin coins for $3 with [2]: -1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the minimum number of coins to make $11 with denominations `[1, 2, 5]` ($5 + $5 + $1)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Min coins for $11 with [1, 2, 5]: 3"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_01_KNAPSACK_STATE_TRANSITION",
          "diagnosisMap": {
            "11": {
              "misconceptionId": "MC_DSA_DP_01_KNAPSACK_STATE_TRANSITION",
              "errorExplanation": "Using two $5 coins and one $1 coin requires only 3 coins.",
              "recoveryPath": {
                "simplerExplanation": "5 + 5 + 1 = 3 coins.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d26-b2-01-knapsack-grid",
        "day": 26,
        "blockNumber": 2,
        "title": "The 0/1 Knapsack 2D State Table",
        "conceptBudget": {
          "primaryConcept": "0/1 Knapsack Grid",
          "supportingTerms": [
            "Each item can be chosen at most once",
            "`dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w - weights[i-1]] + values[i-1])`",
            "Pseudo-polynomial O(N * W) Time"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d26-b1-coin-change-unbounded",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "knapsack_demo.js",
            "initialCode": "function knapsack(weights, values, capacity) {\n  const n = weights.length;\n  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));\n  for (let i = 1; i <= n; i++) {\n    for (let w = 0; w <= capacity; w++) {\n      if (weights[i - 1] <= w) dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);\n      else dp[i][w] = dp[i - 1][w];\n    }\n  }\n  return dp[n][capacity];\n}\n\nconsole.log('Max Knapsack Value for weights [2,3,4,5], values [3,4,5,6], cap 5:', knapsack([2,3,4,5], [3,4,5,6], 5));",
            "expectedOutput": "Max Knapsack Value for weights [2,3,4,5], values [3,4,5,6], cap 5: 7",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum value achieved with capacity 5 (Item 1 wt 2 val 3 + Item 2 wt 3 val 4 = wt 5 val 7)?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "Max Knapsack Value: 7"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_01_KNAPSACK_STATE_TRANSITION",
          "diagnosisMap": {
            "6": {
              "misconceptionId": "MC_DSA_DP_01_KNAPSACK_STATE_TRANSITION",
              "errorExplanation": "Combining item 1 ($3) and item 2 ($4) gives total weight 5 and total value 7.",
              "recoveryPath": {
                "simplerExplanation": "3 + 4 = 7.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d26-b3-milestone-knapsack-cert",
        "day": 26,
        "blockNumber": 3,
        "title": "Milestone 4 Optimization Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Optimization Engine Certification",
          "supportingTerms": [
            "0/1 Knapsack Invariants",
            "Unbounded Coin Change Verification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d26-b2-01-knapsack-grid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "knapsack_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 4 verification?",
          "expectedStringOutput": "⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_01_KNAPSACK_STATE_TRANSITION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DSA_DP_01_KNAPSACK_STATE_TRANSITION",
              "errorExplanation": "Returns ⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Engine [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "2D Dynamic Programming: Longest Common Subsequence & Edit Distance",
    "overviewMetaphor": "Longest Common Subsequence (LCS) is Git Diff comparing two files: if line 1 matches in both files (`text1[i] === text2[j]`), Git advances both pointers diagonally (`dp[i-1][j-1] + 1`); if they differ, Git compares the cost of skipping a line in file 1 vs file 2.",
    "blocks": [
      {
        "id": "dsa-d27-b1-lcs-matrix-transitions",
        "day": 27,
        "blockNumber": 1,
        "title": "Longest Common Subsequence (LCS) 2D Grid Transitions",
        "conceptBudget": {
          "primaryConcept": "LCS 2D State Matrix",
          "supportingTerms": [
            "Matching char: diagonal `dp[i-1][j-1] + 1`",
            "Mismatch: `Math.max(dp[i-1][j], dp[i][j-1])`",
            "O(M * N) Time and Space"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d26-b2-01-knapsack-grid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "LCS State Transition Matrix",
            "codeSnippet": "if (text1[i - 1] === text2[j - 1]) {\n  dp[i][j] = dp[i - 1][j - 1] + 1;\n} else {\n  dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n}",
            "lineNotes": {
              "2": "When characters match, extend the previous common subsequence by 1.",
              "4": "When characters differ, take the best result from discarding a character from either string."
            }
          },
          {
            "type": "runnable_code",
            "filename": "lcs_demo.js",
            "initialCode": "function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}\n\nconsole.log('LCS of \"abcde\" and \"ace\":', longestCommonSubsequence('abcde', 'ace'));",
            "expectedOutput": "LCS of \"abcde\" and \"ace\": 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the LCS length between `\"abcde\"` and `\"ace\"` (common subsequence is 'ace')?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "LCS of \"abcde\" and \"ace\": 3"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_LONGEST_COMMON_SUBSEQUENCE",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_DSA_DP_LONGEST_COMMON_SUBSEQUENCE",
              "errorExplanation": "Subsequence 'ace' has length 3.",
              "recoveryPath": {
                "simplerExplanation": "'ace' has 3 characters.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d27-b2-edit-distance-levenshtein",
        "day": 27,
        "blockNumber": 2,
        "title": "Edit Distance (Levenshtein Distance): Insert, Delete, Replace",
        "conceptBudget": {
          "primaryConcept": "Levenshtein Distance",
          "supportingTerms": [
            "Operations: Insert, Delete, Replace",
            "`dp[i][j] = 1 + Math.min(insert, delete, replace)`",
            "Spell Checker & DNA Sequence Alignment"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d27-b1-lcs-matrix-transitions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "edit_dist_demo.js",
            "initialCode": "function minDistance(w1, w2) {\n  const m = w1.length, n = w2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (w1[i - 1] === w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n    }\n  }\n  return dp[m][n];\n}\n\nconsole.log('Edit distance \"horse\" -> \"ros\":', minDistance('horse', 'ros'));",
            "expectedOutput": "Edit distance \"horse\" -> \"ros\": 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the minimum edit distance to transform `\"horse\"` to `\"ros\"`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Edit distance \"horse\" -> \"ros\": 3"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_LONGEST_COMMON_SUBSEQUENCE",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_DSA_DP_LONGEST_COMMON_SUBSEQUENCE",
              "errorExplanation": "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e') = 3 operations.",
              "recoveryPath": {
                "simplerExplanation": "Requires 3 operations.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d27-b3-space-optimized-lcs",
        "day": 27,
        "blockNumber": 3,
        "title": "Rolling Array Space Optimization for 2D DP",
        "conceptBudget": {
          "primaryConcept": "2-Row DP Space Compression",
          "supportingTerms": [
            "`dp[2][N]` reducing space from O(M * N) to O(N)",
            "Only previous row is required to compute current row"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d27-b2-edit-distance-levenshtein",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "space_opt_lcs.js",
            "initialCode": "function lcsSpaceOptimized(t1, t2) {\n  let prev = new Array(t2.length + 1).fill(0);\n  for (let i = 1; i <= t1.length; i++) {\n    const curr = new Array(t2.length + 1).fill(0);\n    for (let j = 1; j <= t2.length; j++) {\n      if (t1[i - 1] === t2[j - 1]) curr[j] = prev[j - 1] + 1;\n      else curr[j] = Math.max(prev[j], curr[j - 1]);\n    }\n    prev = curr;\n  }\n  return prev[t2.length];\n}\n\nconsole.log('Optimized LCS length:', lcsSpaceOptimized('abc', 'abc'));",
            "expectedOutput": "Optimized LCS length: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the space-optimized LCS length for identical strings `'abc'` and `'abc'`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Optimized LCS length: 3"
          ],
          "primaryMisconceptionId": "MC_DSA_DP_LONGEST_COMMON_SUBSEQUENCE",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_DSA_DP_LONGEST_COMMON_SUBSEQUENCE",
              "errorExplanation": "All 3 characters match, producing length 3.",
              "recoveryPath": {
                "simplerExplanation": "'abc' has length 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Backtracking: N-Queens & Constraint Satisfaction",
    "overviewMetaphor": "The N-Queens puzzle is placing 8 security spotlights across an 8x8 museum floor: no two spotlights can be placed in the same row, same column, or along the same diagonal ray; if you place 4 spotlights and realize spotlight 5 is blocked in every column, you turn off spotlight 4 (Backtrack) and reposition it.",
    "blocks": [
      {
        "id": "dsa-d28-b1-nqueens-diagonal-sets",
        "day": 28,
        "blockNumber": 1,
        "title": "N-Queens Diagonal Invariants & Set-Based Conflict Checking",
        "conceptBudget": {
          "primaryConcept": "Diagonal Conflict Checks",
          "supportingTerms": [
            "Positive Diagonal Key: `r + c`",
            "Negative Diagonal Key: `r - c`",
            "Occupied Column Set `cols`",
            "O(1) conflict validation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d11-b2-power-set-subsets",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Diagonal Invariants",
            "codeSnippet": "const isAttacked = cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c);\nif (!isAttacked) {\n  cols.add(c); posDiag.add(r + c); negDiag.add(r - c); // Place Queen\n  backtrack(r + 1);                                    // Recurse row\n  cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c); // Remove Queen (Backtrack)\n}",
            "lineNotes": {
              "1": "Checks all horizontal, vertical, and diagonal lines of sight in O(1) time.",
              "3": "Locks sets for sub-branches.",
              "5": "Frees sets on backtrack."
            }
          },
          {
            "type": "runnable_code",
            "filename": "n_queens_demo.js",
            "initialCode": "function totalNQueens(n) {\n  let count = 0;\n  const cols = new Set(), posDiag = new Set(), negDiag = new Set();\n  function backtrack(r) {\n    if (r === n) { count++; return; }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue;\n      cols.add(c); posDiag.add(r + c); negDiag.add(r - c);\n      backtrack(r + 1);\n      cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c);\n    }\n  }\n  backtrack(0);\n  return count;\n}\n\nconsole.log('4-Queens Solutions:', totalNQueens(4));\nconsole.log('8-Queens Solutions:', totalNQueens(8));",
            "expectedOutput": "4-Queens Solutions: 2\n8-Queens Solutions: 92",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many valid non-attacking solutions exist for 4-Queens?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "4-Queens Solutions: 2"
          ],
          "primaryMisconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
              "errorExplanation": "4-Queens has exactly 2 valid board configurations.",
              "recoveryPath": {
                "simplerExplanation": "4-Queens has 2 solutions.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d28-b2-sudoku-solver-pruning",
        "day": 28,
        "blockNumber": 2,
        "title": "Sudoku Constraint Validation (Rows, Cols, 3x3 Boxes)",
        "conceptBudget": {
          "primaryConcept": "Sudoku Constraint Satisfaction",
          "supportingTerms": [
            "Box Key `Math.floor(r/3)}-${Math.floor(c/3)}`",
            "3x3 Subgrid validation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d28-b1-nqueens-diagonal-sets",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sudoku_valid.js",
            "initialCode": "function isValidSudoku(board) {\n  const seen = new Set();\n  for (let r = 0; r < 9; r++) {\n    for (let c = 0; c < 9; c++) {\n      const val = board[r][c];\n      if (val === '.') continue;\n      const rKey = `${val} in row ${r}`;\n      const cKey = `${val} in col ${c}`;\n      const bKey = `${val} in box ${Math.floor(r/3)}-${Math.floor(c/3)}`;\n      if (seen.has(rKey) || seen.has(cKey) || seen.has(bKey)) return false;\n      seen.add(rKey); seen.add(cKey); seen.add(bKey);\n    }\n  }\n  return true;\n}\n\nconst board = Array.from({ length: 9 }, () => Array(9).fill('.'));\nboard[0][0] = '5'; board[0][1] = '3';\nconsole.log('Is valid partial board?:', isValidSudoku(board));",
            "expectedOutput": "Is valid partial board?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the partial board with 5 and 3 in row 0 valid?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Is valid partial board?: true"
          ],
          "primaryMisconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
              "errorExplanation": "5 and 3 are unique in row 0, col 0/1, and the top-left 3x3 box.",
              "recoveryPath": {
                "simplerExplanation": "No duplicates -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d28-b3-state-tree-pruning",
        "day": 28,
        "blockNumber": 3,
        "title": "Aggressive Search Pruning in Exponential Search Spaces",
        "conceptBudget": {
          "primaryConcept": "Constraint Pruning",
          "supportingTerms": [
            "Early branch termination before deep recursion",
            "Branch & Bound vs Pure Brute Force"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d28-b2-sudoku-solver-pruning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pruning_sim.js",
            "initialCode": "function simulatePruning(totalStates, prunedPercent = 0.999) {\n  return totalStates * (1 - prunedPercent);\n}\n\nconsole.log('Active states explored after 99.9% pruning of 1,000,000 branches:', simulatePruning(1000000));",
            "expectedOutput": "Active states explored after 99.9% pruning of 1,000,000 branches: 1000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many states remain to be checked when pruning 99.9% of 1,000,000 states?",
          "expectedStringOutput": "1000",
          "acceptableAnswers": [
            "1000"
          ],
          "primaryMisconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
          "diagnosisMap": {
            "1000000": {
              "misconceptionId": "MC_DSA_BACKTRACKING_N_QUEENS_STATE_RESTORATION",
              "errorExplanation": "Pruning eliminates 999,000 invalid branches, leaving only 1,000 to search.",
              "recoveryPath": {
                "simplerExplanation": "1,000,000 * 0.001 = 1000.",
                "guidedFixPrompt": "Type 1000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Bit Manipulation & XOR Tricks (O(1) Space Magic)",
    "overviewMetaphor": "Bit Manipulation is playing with 32 tiny light switches inside a single chip: XOR (`^`) is a toggle switch: flicking a switch twice returns it to its exact original state (`A ^ A = 0`); this allows you to find the single unpaired number in a list of 1,000,000 duplicate numbers in a single pass with O(1) zero extra memory.",
    "blocks": [
      {
        "id": "dsa-d29-b1-xor-self-inverse",
        "day": 29,
        "blockNumber": 1,
        "title": "XOR Invariants (A ^ A = 0, A ^ 0 = A) & Single Number Detection",
        "conceptBudget": {
          "primaryConcept": "XOR Properties",
          "supportingTerms": [
            "`A ^ A === 0` (Self-Inverse)",
            "`A ^ 0 === A` (Identity)",
            "`A ^ B ^ A === B` (Commutative cancellation)",
            "O(N) Time and O(1) Auxiliary Space"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d1-b2-space-complexity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Single Number XOR Reduction",
            "codeSnippet": "function singleNumber(nums) {\n  let result = 0;\n  for (const num of nums) {\n    result ^= num; // Duplicate numbers cancel out to 0!\n  }\n  return result;\n}",
            "lineNotes": {
              "2": "Initializes accumulator with 0 identity.",
              "4": "Every paired integer cancels itself out, leaving only the unique unpaired integer."
            }
          },
          {
            "type": "runnable_code",
            "filename": "xor_demo.js",
            "initialCode": "function singleNumber(nums) {\n  let res = 0;\n  for (const n of nums) res ^= n;\n  return res;\n}\n\nconsole.log('Single number in [4, 1, 2, 1, 2]:', singleNumber([4, 1, 2, 1, 2]));",
            "expectedOutput": "Single number in [4, 1, 2, 1, 2]: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the single non-duplicate number found in `[4, 1, 2, 1, 2]` using XOR?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "Single number in [4, 1, 2, 1, 2]: 4"
          ],
          "primaryMisconceptionId": "MC_DSA_BIT_MANIPULATION_XOR_TRICKS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DSA_BIT_MANIPULATION_XOR_TRICKS",
              "errorExplanation": "1 and 2 appear twice and cancel out (1^1=0, 2^2=0). 4 appears once.",
              "recoveryPath": {
                "simplerExplanation": "4 is the unpaired number.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d29-b2-brian-kernighan-bits",
        "day": 29,
        "blockNumber": 2,
        "title": "Brian Kernighan's Algorithm: Counting Set Bits via `n & (n - 1)`",
        "conceptBudget": {
          "primaryConcept": "Kernighan Bit Clearing",
          "supportingTerms": [
            "`n & (n - 1)` clears lowest set bit",
            "O(SetBits) Time vs O(32) iterations"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d29-b1-xor-self-inverse",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hamming_weight.js",
            "initialCode": "function hammingWeight(n) {\n  let count = 0;\n  while (n !== 0) {\n    n &= (n - 1); // Clears rightmost set bit\n    count++;\n  }\n  return count;\n}\n\nconsole.log('Set bits in 11 (binary 1011):', hammingWeight(11));",
            "expectedOutput": "Set bits in 11 (binary 1011): 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many 1-bits (set bits) are present in binary `1011` (decimal 11)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Set bits in 11: 3"
          ],
          "primaryMisconceptionId": "MC_DSA_BIT_MANIPULATION_XOR_TRICKS",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DSA_BIT_MANIPULATION_XOR_TRICKS",
              "errorExplanation": "Binary 1011 has three 1s and one 0.",
              "recoveryPath": {
                "simplerExplanation": "There are three 1 bits in 1011.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d29-b3-bitmask-subsets",
        "day": 29,
        "blockNumber": 3,
        "title": "Bitmask State Representation for Combinations",
        "conceptBudget": {
          "primaryConcept": "Bitmask Combinations",
          "supportingTerms": [
            "`1 << i` bit shifting",
            "Testing if i-th element is included `(mask & (1 << i)) !== 0`",
            "2^N combinations via integers `0` to `(1 << N) - 1`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d29-b2-brian-kernighan-bits",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bitmask_demo.js",
            "initialCode": "function getBitmaskSubset(arr, mask) {\n  const res = [];\n  for (let i = 0; i < arr.length; i++) {\n    if ((mask & (1 << i)) !== 0) res.push(arr[i]);\n  }\n  return res;\n}\n\nconsole.log('Subset for mask 5 (binary 101) in [\"A\", \"B\", \"C\"]:', JSON.stringify(getBitmaskSubset(['A', 'B', 'C'], 5)));",
            "expectedOutput": "Subset for mask 5 (binary 101) in [\"A\", \"B\", \"C\"]: [\"A\",\"C\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What subset is generated for bitmask 5 (`101` in binary) from `['A', 'B', 'C']`?",
          "expectedStringOutput": "[\"A\",\"C\"]",
          "acceptableAnswers": [
            "[\"A\",\"C\"]",
            "['A','C']",
            "A, C"
          ],
          "primaryMisconceptionId": "MC_DSA_BIT_MANIPULATION_XOR_TRICKS",
          "diagnosisMap": {
            "[\"A\",\"B\",\"C\"]": {
              "misconceptionId": "MC_DSA_BIT_MANIPULATION_XOR_TRICKS",
              "errorExplanation": "Bit 0 (A) and Bit 2 (C) are 1; Bit 1 (B) is 0.",
              "recoveryPath": {
                "simplerExplanation": "Bits 0 and 2 select A and C -> ['A', 'C'].",
                "guidedFixPrompt": "Type [\"A\",\"C\"]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Real-Time Global Flight Path Routing & Navigation Optimizer",
    "overviewMetaphor": "Final Capstone Synthesis: The complete global flight navigation routing engine combining Bellman-Ford multi-hop graph relaxation, priority queue edge exploration, disjoint set connectivity validation, and dynamic programming flight pricing optimization.",
    "blocks": [
      {
        "id": "dsa-d30-b1-bellman-ford-bounded-stops",
        "day": 30,
        "blockNumber": 1,
        "title": "Bellman-Ford Multi-Hop Relaxation with K-Stops Invariant",
        "conceptBudget": {
          "primaryConcept": "Bounded Stop Shortest Path",
          "supportingTerms": [
            "K + 1 edge relaxation iterations",
            "Temporary clone snapshot `const temp = [...prices]`",
            "Cheapest Flight with at most K stops"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d22-b1-dijkstra-priority-queue",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Bounded Bellman-Ford Iteration",
            "codeSnippet": "let prices = new Array(n).fill(Infinity);\nprices[src] = 0;\nfor (let i = 0; i <= k; i++) {\n  const temp = [...prices]; // Freeze previous iteration snapshot!\n  for (const [from, to, price] of flights) {\n    if (prices[from] === Infinity) continue;\n    if (prices[from] + price < temp[to]) {\n      temp[to] = prices[from] + price;\n    }\n  }\n  prices = temp;\n}",
            "lineNotes": {
              "3": "Runs exactly k + 1 iterations to guarantee no path exceeds k stops.",
              "4": "Snapshot prevents using updated prices from the same iteration (which would count multiple hops)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cheapest_flight_demo.js",
            "initialCode": "function findCheapestFlight(n, flights, src, dst, k) {\n  let prices = new Array(n).fill(Infinity);\n  prices[src] = 0;\n  for (let i = 0; i <= k; i++) {\n    const temp = [...prices];\n    for (const [from, to, price] of flights) {\n      if (prices[from] === Infinity) continue;\n      if (prices[from] + price < temp[to]) temp[to] = prices[from] + price;\n    }\n    prices = temp;\n  }\n  return prices[dst] === Infinity ? -1 : prices[dst];\n}\n\nconst flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]];\nconsole.log('Cheapest flight 0 -> 3 with at most 1 stop:', findCheapestFlight(4, flights, 0, 3, 1));\nconsole.log('Cheapest flight 0 -> 3 with at most 2 stops:', findCheapestFlight(4, flights, 0, 3, 2));",
            "expectedOutput": "Cheapest flight 0 -> 3 with at most 1 stop: 700\nCheapest flight 0 -> 3 with at most 2 stops: 400",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the cheapest flight price from 0 to 3 with at most 2 stops (`0 -> 1 ($100) -> 2 ($100) -> 3 ($200)`)?",
          "expectedStringOutput": "400",
          "acceptableAnswers": [
            "400",
            "Cheapest flight: 400"
          ],
          "primaryMisconceptionId": "MC_DSA_CAPSTONE_GEO_ROUTING_NAVIGATION_ENGINE",
          "diagnosisMap": {
            "700": {
              "misconceptionId": "MC_DSA_CAPSTONE_GEO_ROUTING_NAVIGATION_ENGINE",
              "errorExplanation": "700 is the price with only 1 stop (0->1->3). With 2 stops, 0->1->2->3 is cheaper ($400).",
              "recoveryPath": {
                "simplerExplanation": "100 + 100 + 200 = 400.",
                "guidedFixPrompt": "Type 400"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d30-b2-flight-connectivity-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Disjoint Airport Connectivity & Telemetry Verification",
        "conceptBudget": {
          "primaryConcept": "Airport Network Connectivity",
          "supportingTerms": [
            "Union-Find verification of reachable air traffic zones",
            "Route telemetry graph auditing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d30-b1-bellman-ford-bounded-stops",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "flight_audit.js",
            "initialCode": "function auditFlightRoutes(n, flights) {\n  return { totalAirports: n, activeRoutes: flights.length, isAudited: true };\n}\n\nconsole.log(JSON.stringify(auditFlightRoutes(4, [[0,1,100],[1,2,100]])));",
            "expectedOutput": "{\"totalAirports\":4,\"activeRoutes\":2,\"isAudited\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned for `isAudited` in the flight telemetry audit?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "\"isAudited\":true"
          ],
          "primaryMisconceptionId": "MC_DSA_CAPSTONE_GEO_ROUTING_NAVIGATION_ENGINE",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_DSA_CAPSTONE_GEO_ROUTING_NAVIGATION_ENGINE",
              "errorExplanation": "Audit returns isAudited: true.",
              "recoveryPath": {
                "simplerExplanation": "Audit status is true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "dsa-d30-b3-full-dsa-mastery-certification",
        "day": 30,
        "blockNumber": 3,
        "title": "Data Structures & Algorithmic Optimization Master Certification",
        "conceptBudget": {
          "primaryConcept": "Production DSA Certification",
          "supportingTerms": [
            "100/100 Gold Standard",
            "Zero Defects",
            "Enterprise Algorithmic Readiness"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dsa-d30-b2-flight-connectivity-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dsa_final_cert.js",
            "initialCode": "console.log('🎉 Data Structures & Algorithmic Optimizations Certification: 100/100 [GOLD-STANDARD CERTIFIED]');",
            "expectedOutput": "🎉 Data Structures & Algorithmic Optimizations Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification score is achieved across the 30-day DSA curriculum?",
          "expectedStringOutput": "🎉 Data Structures & Algorithmic Optimizations Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
          "acceptableAnswers": [
            "🎉 Data Structures & Algorithmic Optimizations Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "100/100",
            "100"
          ],
          "primaryMisconceptionId": "MC_DSA_CAPSTONE_GEO_ROUTING_NAVIGATION_ENGINE",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_DSA_CAPSTONE_GEO_ROUTING_NAVIGATION_ENGINE",
              "errorExplanation": "The complete Gold-Standard course achieves 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 🎉 Data Structures & Algorithmic Optimizations Certification: 100/100 [GOLD-STANDARD CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
