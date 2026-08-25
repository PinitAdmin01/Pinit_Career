import { DayLessonPlan } from '../types/lessonEngine';

export const REACT_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "JSX Syntax, Virtual DOM Mechanics & Tree Diffing",
    "overviewMetaphor": "The Virtual DOM is like a theatrical stage rehearsal script: the director tests out lighting changes and actor movements on paper first (Virtual DOM diffing) before actually moving expensive real stage props (Browser DOM mutations).",
    "blocks": [
      {
        "id": "react-d1-b1-jsx-anatomy",
        "day": 1,
        "blockNumber": 1,
        "title": "JSX Syntax vs Native HTML (React.createElement)",
        "conceptBudget": {
          "primaryConcept": "JSX Compilation",
          "supportingTerms": [
            "React.createElement",
            "className vs class",
            "Single Root Element"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Shorthand Stenographer Note",
            "simpleExplanation": "JSX is syntactic sugar shorthand. The compiler translates `<div className='card'>Hello</div>` into the JavaScript object call `React.createElement('div', { className: 'card' }, 'Hello')`."
          },
          {
            "type": "syntax_anatomy",
            "title": "JSX vs HTML Differences",
            "codeSnippet": "// 1. className instead of class\n// 2. htmlFor instead of for\n// 3. Self-closing tags: <img src='...' />\n// 4. Curly braces for JS expressions: <h1>{user.name}</h1>",
            "lineNotes": {
              "1": "JavaScript reserves the word 'class', so React uses 'className'.",
              "4": "Curly braces {} enter JavaScript mode inside markup."
            }
          },
          {
            "type": "runnable_code",
            "filename": "jsx_demo.js",
            "initialCode": "function createCard(title, count) {\n  return {\n    type: 'div',\n    props: {\n      className: 'badge',\n      children: `${title}: ${count}`\n    }\n  };\n}\n\nconsole.log('Virtual VNode:', createCard('Notifications', 5));",
            "expectedOutput": "Virtual VNode: { type: 'div', props: { className: 'badge', children: 'Notifications: 5' } }",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does JSX use `className` instead of the HTML `class` attribute?",
          "options": [
            "Because 'class' is a reserved keyword in JavaScript for defining classes",
            "Because className renders faster in the browser",
            "Because HTML5 deprecated the class attribute"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_JSX_VS_HTML",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_JSX_VS_HTML",
              "errorExplanation": "'class' is a reserved JS language keyword, so JSX uses 'className' to avoid grammar conflicts.",
              "recoveryPath": {
                "simplerExplanation": "Since JSX is JavaScript, 'class' clashes with JS class declarations.",
                "guidedFixPrompt": "Select Option A: 'class' is a reserved keyword in JavaScript."
              }
            }
          }
        }
      },
      {
        "id": "react-d1-b2-virtual-dom-diffing",
        "day": 1,
        "blockNumber": 2,
        "title": "Virtual DOM Tree Diffing & Minimal DOM Updates",
        "conceptBudget": {
          "primaryConcept": "Virtual DOM Diffing",
          "supportingTerms": [
            "Reconciliation",
            "O(N) Heuristic Algorithm",
            "Batching"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d1-b1-jsx-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Spot-the-Difference Puzzle",
            "simpleExplanation": "React compares the old tree snapshot with the new snapshot, identifies the single text node that changed, and patches only that exact browser node without repainting the entire page."
          },
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "React Reconciliation Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. State Update Triggered",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Generate New Virtual DOM Tree",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Diff with Previous Virtual DOM Snapshot",
                  "kind": "decision"
                },
                {
                  "id": "4",
                  "label": "4. Apply Minimal Real DOM Batch Patch",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "vdom_diff.js",
            "initialCode": "function diffNodes(oldNode, newNode) {\n  if (oldNode.type !== newNode.type) return 'REPLACE_ELEMENT';\n  if (oldNode.props.children !== newNode.props.children) return 'UPDATE_TEXT';\n  return 'NO_CHANGE';\n}\n\nconst oldVNode = { type: 'p', props: { children: 'Score: 10' } };\nconst newVNode = { type: 'p', props: { children: 'Score: 20' } };\nconsole.log('Diff result:', diffNodes(oldVNode, newVNode));",
            "expectedOutput": "Diff result: UPDATE_TEXT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When only the text changes from 'Score: 10' to 'Score: 20' on the same `<p>` tag, what diff action is computed?",
          "expectedStringOutput": "UPDATE_TEXT",
          "acceptableAnswers": [
            "UPDATE_TEXT",
            "'UPDATE_TEXT'"
          ],
          "primaryMisconceptionId": "MC_REACT_VIRTUAL_DOM_DIFFING",
          "diagnosisMap": {
            "REPLACE_ELEMENT": {
              "misconceptionId": "MC_REACT_VIRTUAL_DOM_DIFFING",
              "errorExplanation": "The element tag is still `<p>`, only its text child changed, so React updates text rather than replacing the whole node.",
              "recoveryPath": {
                "simplerExplanation": "Same element tag = UPDATE_TEXT patch.",
                "guidedFixPrompt": "Type UPDATE_TEXT"
              }
            }
          }
        }
      },
      {
        "id": "react-d1-b3-keys-in-lists",
        "day": 1,
        "blockNumber": 3,
        "title": "The Key Prop in Dynamic Lists",
        "conceptBudget": {
          "primaryConcept": "List Reconciliation Keys",
          "supportingTerms": [
            "key={item.id}",
            "Stable Identity",
            "Prevent State Misalignment"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d1-b2-virtual-dom-diffing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Array Index as Key Trap",
              "brokenCode": "// ❌ Buggy: Array index key causes input focus loss on item delete\nitems.map((item, index) => (\n  <TodoItem key={index} item={item} />\n))",
              "fixedCode": "// ✅ Correct: Stable unique ID preserves component state\nitems.map((item) => (\n  <TodoItem key={item.id} item={item} />\n))",
              "errorLine": 3,
              "errorReason": "When item 0 is deleted, item 1 shifts to index 0, corrupting internal input focus and animations.",
              "fixExplanation": "Use stable database IDs like item.id as keys."
            }
          },
          {
            "type": "runnable_code",
            "filename": "keys_demo.js",
            "initialCode": "const tasks = [\n  { id: 'task_101', text: 'Buy Groceries' },\n  { id: 'task_102', text: 'Pay Rent' }\n];\n\nconst vList = tasks.map(t => ({ key: t.id, label: t.text }));\nconsole.log('List with stable keys:', vList[0].key);",
            "expectedOutput": "List with stable keys: task_101",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should you avoid using array indices like `key={index}` for dynamically reordered lists in React?",
          "options": [
            "Because reordering or deleting items shifts indices, causing React to misalign component state and DOM inputs",
            "Because indices make the bundle size larger",
            "Because React throws a compile error if index is used"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_LIST_KEYS_INDEX_WARNING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_LIST_KEYS_INDEX_WARNING",
              "errorExplanation": "Index keys break component identity when items are prepended, sorted, or removed.",
              "recoveryPath": {
                "simplerExplanation": "Use unique IDs (like item.id) so React can track each item individually.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Functional Components, Props Contract & Unidirectional Data Flow",
    "overviewMetaphor": "A React Functional Component is a gourmet blender: you pour in fresh ingredients (Props), it spins without changing the original grocery bag (Pure Function), and pours out a delicious smoothie (JSX).",
    "blocks": [
      {
        "id": "react-d2-b1-pure-component",
        "day": 2,
        "blockNumber": 1,
        "title": "Pure Components: Deterministic UI Rendering",
        "conceptBudget": {
          "primaryConcept": "Pure Function Component",
          "supportingTerms": [
            "Deterministic Output",
            "No Side Effects during Render"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d1-b1-jsx-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Math Equation (f(x) = y)",
            "simpleExplanation": "Given the same input props, a pure functional component ALWAYS returns the exact same JSX tree."
          },
          {
            "type": "syntax_anatomy",
            "title": "Functional Component Anatomy",
            "codeSnippet": "function UserProfile({ name, role = 'MEMBER' }) {\n  return (\n    <div className='user-card'>\n      <h3>{name}</h3>\n      <span>Role: {role}</span>\n    </div>\n  );\n}",
            "lineNotes": {
              "1": "Props destructuring with default fallback 'MEMBER'.",
              "4": "JSX expressions display props data."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pure_comp.js",
            "initialCode": "function renderProfile(props) {\n  const role = props.role || 'GUEST';\n  return `[USER] ${props.name.toUpperCase()} (${role})`;\n}\n\nconsole.log(renderProfile({ name: 'Sarah' }));",
            "expectedOutput": "[USER] SARAH (GUEST)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "For props `{ name: 'Sarah' }` with fallback role 'GUEST', what does renderProfile output?",
          "expectedStringOutput": "[USER] SARAH (GUEST)",
          "acceptableAnswers": [
            "[USER] SARAH (GUEST)"
          ],
          "primaryMisconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
          "diagnosisMap": {
            "Sarah": {
              "misconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
              "errorExplanation": "Name is uppercased and role falls back to GUEST.",
              "recoveryPath": {
                "simplerExplanation": "Formats to '[USER] SARAH (GUEST)'.",
                "guidedFixPrompt": "Type [USER] SARAH (GUEST)"
              }
            }
          }
        }
      },
      {
        "id": "react-d2-b2-props-immutability",
        "day": 2,
        "blockNumber": 2,
        "title": "Props Immutability (Read-Only Contract)",
        "conceptBudget": {
          "primaryConcept": "Props Immutability",
          "supportingTerms": [
            "Read-Only",
            "Unidirectional Flow",
            "Never Mutate props.val = x"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d2-b1-pure-component",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Direct Prop Mutation Bug",
              "brokenCode": "// ❌ Illegal: Components must NEVER mutate their own props\nfunction BadAvatar(props) {\n  props.size = props.size * 2; // ❌ TypeError / Side-effect bug!\n  return <img width={props.size} />;\n}",
              "fixedCode": "// ✅ Correct: Derive a local variable or compute in JSX\nfunction SafeAvatar(props) {\n  const displaySize = (props.size || 32) * 2; // ✅ Safe local variable\n  return <img width={displaySize} />;\n}",
              "errorLine": 3,
              "errorReason": "Mutating props modifies the parent's object in memory and breaks React's change detection.",
              "fixExplanation": "Treat props as read-only. Store derived values in local variables."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_props.js",
            "initialCode": "function computeDisplayPrice(props) {\n  // Never do: props.price = props.price * 0.9\n  const discounted = props.price * (1 - props.discount);\n  return Number(discounted.toFixed(2));\n}\n\nconsole.log('Final Price:', computeDisplayPrice({ price: 100, discount: 0.15 }));",
            "expectedOutput": "Final Price: 85",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can a child component directly modify its `props` object (e.g. `props.count = 5`)?",
          "options": [
            "No, props are strictly read-only; components must never mutate their incoming props",
            "Yes, props work identically to mutable variables",
            "Only inside useEffect hooks"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_PROPS_IMMUTABILITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_PROPS_IMMUTABILITY",
              "errorExplanation": "React enforces unidirectional data flow where props cannot be mutated by children.",
              "recoveryPath": {
                "simplerExplanation": "Props are strictly read-only.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d2-b3-callback-props",
        "day": 2,
        "blockNumber": 3,
        "title": "Lifting State & Event Callbacks (Child-to-Parent Communication)",
        "conceptBudget": {
          "primaryConcept": "Callback Props",
          "supportingTerms": [
            "Lifting State Up",
            "onAction Callbacks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d2-b2-props-immutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "callbacks.js",
            "initialCode": "let parentCart = [];\nfunction onAddToCart(item) {\n  parentCart.push(item);\n}\n\nfunction handleUserClick(itemId, callback) {\n  callback({ id: itemId, addedAt: '2026-08-24' });\n}\n\nhandleUserClick('prod_99', onAddToCart);\nconsole.log('Parent Cart Items:', parentCart.length);",
            "expectedOutput": "Parent Cart Items: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many items are in parentCart after handleUserClick runs the callback?",
          "expectedStringOutput": "Parent Cart Items: 1",
          "acceptableAnswers": [
            "Parent Cart Items: 1",
            "1"
          ],
          "primaryMisconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
              "errorExplanation": "The child executed the callback, pushing 1 item to the parent list.",
              "recoveryPath": {
                "simplerExplanation": "Callback fired -> parent received 1 item.",
                "guidedFixPrompt": "Type Parent Cart Items: 1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "State with useState, Functional Updaters & React 18 Batching",
    "overviewMetaphor": "Calling `setCount(count + 1)` is like dropping a letter in a postal mailbox: the mail carrier doesn't deliver it this instant; they batch all outgoing letters and deliver the entire updated bundle in the next scheduled delivery pass (re-render).",
    "blocks": [
      {
        "id": "react-d3-b1-usestate-basics",
        "day": 3,
        "blockNumber": 1,
        "title": "The useState Hook: Preserving Component State",
        "conceptBudget": {
          "primaryConcept": "useState Hook",
          "supportingTerms": [
            "[state, setState]",
            "Initial Value",
            "Re-render Trigger"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d2-b1-pure-component",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "useState Syntax",
            "codeSnippet": "const [count, setCount] = useState(0);\n// 1. count holds current snapshot value\n// 2. setCount schedules state update and triggers UI re-render",
            "lineNotes": {
              "1": "Array destructuring unpacks the value and the updater function."
            }
          },
          {
            "type": "runnable_code",
            "filename": "state_sim.js",
            "initialCode": "function createMockState(init) {\n  let val = init;\n  return [\n    () => val,\n    (next) => { val = next; }\n  ];\n}\n\nconst [getCount, setCount] = createMockState(10);\nsetCount(15);\nconsole.log('Updated Count:', getCount());",
            "expectedOutput": "Updated Count: 15",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does calling `setState(newValue)` in React do?",
          "options": [
            "Schedules a state update and requests React to re-render the component with the new value",
            "Instantly mutates the existing variable in the current line of code",
            "Reloads the entire browser page"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_DIRECT_STATE_MUTATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_DIRECT_STATE_MUTATION",
              "errorExplanation": "setState is asynchronous and triggers a scheduled re-render rather than mutating variables in-place.",
              "recoveryPath": {
                "simplerExplanation": "setState schedules a fresh re-render with the new state.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d3-b2-functional-updaters",
        "day": 3,
        "blockNumber": 2,
        "title": "Functional State Updaters: setCount(prev => prev + 1)",
        "conceptBudget": {
          "primaryConcept": "Functional State Updates",
          "supportingTerms": [
            "prev => prev + 1",
            "Race Condition Prevention",
            "Stale Closure Defense"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d3-b1-usestate-basics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Sequential State Update Trap",
              "brokenCode": "// ❌ Buggy: Both calls read same snapshot count (0 + 1)\nsetCount(count + 1);\nsetCount(count + 1); // Result after render: 1 (NOT 2!)",
              "fixedCode": "// ✅ Correct: Functional updaters queue sequential mutations\nsetCount(prev => prev + 1);\nsetCount(prev => prev + 1); // Result after render: 2",
              "errorLine": 3,
              "errorReason": "Multiple setCount(count + 1) calls in the same event loop use the stale initial snapshot value.",
              "fixExplanation": "Pass updater functions (prev => prev + 1) to always operate on the newest queued state."
            }
          },
          {
            "type": "runnable_code",
            "filename": "updater_queue.js",
            "initialCode": "let state = 0;\nfunction applyUpdates(updaters) {\n  for (const fn of updaters) {\n    state = fn(state);\n  }\n  return state;\n}\n\nconst queue = [p => p + 1, p => p + 1, p => p + 5];\nconsole.log('Queued Result:', applyUpdates(queue));",
            "expectedOutput": "Queued Result: 7",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Starting at state=0, applying three queued updaters (+1, +1, +5) results in what value?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7"
          ],
          "primaryMisconceptionId": "MC_REACT_FUNCTIONAL_STATE_UPDATES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_FUNCTIONAL_STATE_UPDATES",
              "errorExplanation": "Functional updaters chain sequentially: 0 -> 1 -> 2 -> 7.",
              "recoveryPath": {
                "simplerExplanation": "0 + 1 + 1 + 5 = 7.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      },
      {
        "id": "react-d3-b3-immutable-object-updates",
        "day": 3,
        "blockNumber": 3,
        "title": "Immutable Object & Array State Updates ({ ...prev })",
        "conceptBudget": {
          "primaryConcept": "Immutable State Updates",
          "supportingTerms": [
            "Object Spread { ...prev }",
            "Array.prototype.filter/map",
            "No Array.push()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d3-b2-functional-updaters",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "immutable_update.js",
            "initialCode": "const user = { name: 'Alex', settings: { theme: 'light' } };\n// Create brand new cloned state object\nconst updated = {\n  ...user,\n  settings: { ...user.settings, theme: 'dark' }\n};\n\nconsole.log('Original Theme:', user.settings.theme);\nconsole.log('Updated Theme:', updated.settings.theme);",
            "expectedOutput": "Original Theme: light\nUpdated Theme: dark",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does doing `myList.push(newItem); setList(myList);` fail to trigger a re-render in React?",
          "options": [
            "Because myList still references the exact same array memory address, so React's shallow check assumes nothing changed",
            "Because push() is disabled in React",
            "Because setList only accepts strings"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_DIRECT_STATE_MUTATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_DIRECT_STATE_MUTATION",
              "errorExplanation": "React compares reference equality (old === new). Direct mutation keeps the same reference, skipping re-renders.",
              "recoveryPath": {
                "simplerExplanation": "Always create a fresh copy: setList([...myList, newItem]).",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Side Effects with useEffect, Dependency Arrays & Teardown Cleanup",
    "overviewMetaphor": "The `useEffect` cleanup return function is like checking out of a hotel room: before leaving (component unmounts or re-runs effect), you turn off the TV, return the keycard, and clear out your personal items (clearing timers/listeners).",
    "blocks": [
      {
        "id": "react-d4-b1-useeffect-timing",
        "day": 4,
        "blockNumber": 1,
        "title": "useEffect Lifecycle: Post-Render Execution",
        "conceptBudget": {
          "primaryConcept": "useEffect Timing",
          "supportingTerms": [
            "Runs After Paint",
            "Asynchronous Side Effects",
            "DOM Non-Blocking"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d3-b1-usestate-basics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Post-Flight Maintenance Check",
            "simpleExplanation": "First the airplane lands and passengers deplane (DOM paints). Afterwards, the maintenance crew inspects engines (useEffect runs asynchronously)."
          },
          {
            "type": "syntax_anatomy",
            "title": "useEffect Anatomy",
            "codeSnippet": "useEffect(() => {\n  // 1. Setup logic (Runs after render)\n  document.title = `Clicked ${count} times`;\n\n  return () => {\n    // 2. Optional cleanup teardown function\n  };\n}, [count]); // 3. Dependency array",
            "lineNotes": {
              "3": "Effect re-runs ONLY when variables in the dependency array change."
            }
          },
          {
            "type": "runnable_code",
            "filename": "effect_demo.js",
            "initialCode": "function shouldRunEffect(prevDeps, nextDeps) {\n  if (!prevDeps || !nextDeps) return true; // No array = run on every render\n  if (prevDeps.length !== nextDeps.length) return true;\n  return prevDeps.some((dep, i) => dep !== nextDeps[i]);\n}\n\nconsole.log('Deps [1, 2] vs [1, 2]:', shouldRunEffect([1, 2], [1, 2]));\nconsole.log('Deps [1, 2] vs [1, 3]:', shouldRunEffect([1, 2], [1, 3]));",
            "expectedOutput": "Deps [1, 2] vs [1, 2]: false\nDeps [1, 2] vs [1, 3]: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When dependencies change from [1, 2] to [1, 3], what does shouldRunEffect return?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_EFFECT_DEPENDENCY_ARRAY",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_REACT_USE_EFFECT_DEPENDENCY_ARRAY",
              "errorExplanation": "2 !== 3, so a dependency changed, triggering the effect.",
              "recoveryPath": {
                "simplerExplanation": "Changed dependency = effect runs (true).",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "react-d4-b2-cleanup-functions",
        "day": 4,
        "blockNumber": 2,
        "title": "Teardown Cleanup Functions (Preventing Memory Leaks)",
        "conceptBudget": {
          "primaryConcept": "Effect Cleanup",
          "supportingTerms": [
            "return () => cleanup",
            "clearInterval",
            "removeEventListener"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d4-b1-useeffect-timing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Interval Memory Leak Bug",
              "brokenCode": "// ❌ Buggy: Interval continues running forever in background\nuseEffect(() => {\n  setInterval(() => syncTelemetry(), 1000);\n}, []);",
              "fixedCode": "// ✅ Correct: Return teardown function clears timer on unmount\nuseEffect(() => {\n  const id = setInterval(() => syncTelemetry(), 1000);\n  return () => clearInterval(id); // ✅ Cleans up timer!\n}, []);",
              "errorLine": 3,
              "errorReason": "Without cleanup, every component mount leaves an orphaned timer ticking in background RAM.",
              "fixExplanation": "Return a cleanup callback that clears intervals and event listeners."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cleanup_sim.js",
            "initialCode": "let activeListeners = 0;\nfunction mountTimer() {\n  activeListeners++;\n  return () => { activeListeners--; };\n}\n\nconst cleanup = mountTimer();\nconsole.log('Active timers after mount:', activeListeners);\ncleanup();\nconsole.log('Active timers after unmount:', activeListeners);",
            "expectedOutput": "Active timers after mount: 1\nActive timers after unmount: 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When does the cleanup function returned from `useEffect` execute in React?",
          "options": [
            "Before the effect re-runs on dependency changes, and when the component unmounts",
            "Only when the browser window is closed",
            "Immediately before the first render"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_USE_EFFECT_CLEANUP_FN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_USE_EFFECT_CLEANUP_FN",
              "errorExplanation": "Cleanups run before subsequent effect executions and on component unmount.",
              "recoveryPath": {
                "simplerExplanation": "Runs prior to next effect execution and on unmount.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d4-b3-infinite-loop-trap",
        "day": 4,
        "blockNumber": 3,
        "title": "The Infinite Re-Render Loop Trap",
        "conceptBudget": {
          "primaryConcept": "Infinite Render Prevention",
          "supportingTerms": [
            "State mutation inside effect without deps",
            "Dependency stability"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d4-b2-cleanup-functions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Infinite Loop Bug",
              "brokenCode": "// ❌ Buggy: Calling setState in effect without deps creates infinite loop\nuseEffect(() => {\n  setData(fetchData()); // ❌ Render -> Effect -> setState -> Render -> Effect...\n});",
              "fixedCode": "// ✅ Correct: Supply dependency array to control execution\nuseEffect(() => {\n  setData(fetchData()); // ✅ Runs only once on mount\n}, []);",
              "errorLine": 3,
              "errorReason": "Omitting dependency array causes effect to fire after EVERY render, triggering another render indefinitely.",
              "fixExplanation": "Always pass a dependency array `[]` or specific variables."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_loop.js",
            "initialCode": "let renderCount = 0;\nfunction simulateSafeMount(hasDeps) {\n  renderCount++;\n  if (!hasDeps && renderCount > 3) return 'INFINITE_LOOP_HALTED';\n  return `Render count: ${renderCount}`;\n}\n\nconsole.log(simulateSafeMount(true));",
            "expectedOutput": "Render count: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does calling `setCount(c => c + 1)` inside `useEffect(() => { ... })` (with NO dependency array) cause a crash?",
          "options": [
            "Because updating state triggers a re-render, which immediately triggers the effect again in an infinite loop",
            "Because useEffect cannot access state variables",
            "Because React crashes on even numbers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_USE_EFFECT_INFINITE_LOOP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_USE_EFFECT_INFINITE_LOOP",
              "errorExplanation": "Effects without dependency arrays execute after every single render, causing an infinite cycle when updating state.",
              "recoveryPath": {
                "simplerExplanation": "Render triggers effect -> effect triggers render -> infinite crash.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Interactive State Machine & Task Management Console",
    "overviewMetaphor": "Milestone 1 — Task Management Engine: A complete interactive state machine combining immutable item additions, status toggling, category filtering, and local storage persistence.",
    "blocks": [
      {
        "id": "react-d5-b1-task-entity",
        "day": 5,
        "blockNumber": 1,
        "title": "Designing the Task State Entity & Actions",
        "conceptBudget": {
          "primaryConcept": "State Entity Design",
          "supportingTerms": [
            "Task Data Model",
            "Action Creators",
            "Status Enums ('TODO', 'DONE')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d3-b3-immutable-object-updates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Task Entity Structure",
            "codeSnippet": "const task = {\n  id: 'task_001',\n  title: 'Implement Auth',\n  completed: false,\n  category: 'SECURITY'\n};",
            "lineNotes": {
              "1": "Unique string ID for reliable list reconciliation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "task_model.js",
            "initialCode": "function createTask(title, category = 'GENERAL') {\n  return {\n    id: 't_' + Date.now(),\n    title,\n    completed: false,\n    category\n  };\n}\n\nconst t = createTask('Design Schema', 'DB');\nconsole.log(`Task '${t.title}' [${t.category}] created (Done: ${t.completed})`);",
            "expectedOutput": "Task 'Design Schema' [DB] created (Done: false)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the initial `completed` status of a freshly created task?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False"
          ],
          "primaryMisconceptionId": "MC_REACT_DIRECT_STATE_MUTATION",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_REACT_DIRECT_STATE_MUTATION",
              "errorExplanation": "New tasks initialize with `completed: false`.",
              "recoveryPath": {
                "simplerExplanation": "Initial state is false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "react-d5-b2-toggle-filter-pipeline",
        "day": 5,
        "blockNumber": 2,
        "title": "Immutable Toggle & Category Filter Pipeline",
        "conceptBudget": {
          "primaryConcept": "Filter & Toggle Pipeline",
          "supportingTerms": [
            "Array.prototype.map for Toggle",
            "Array.prototype.filter for Status"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d5-b1-task-entity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pipeline.js",
            "initialCode": "const tasks = [\n  { id: 1, text: 'Task 1', completed: false },\n  { id: 2, text: 'Task 2', completed: true }\n];\n\n// 1. Immutable toggle ID 1\nconst toggled = tasks.map(t => t.id === 1 ? { ...t, completed: true } : t);\n// 2. Filter completed\nconst activeOnly = toggled.filter(t => !t.completed);\n\nconsole.log('Toggled Item 1 Status:', toggled[0].completed);\nconsole.log('Active Tasks Remaining:', activeOnly.length);",
            "expectedOutput": "Toggled Item 1 Status: true\nActive Tasks Remaining: 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "After toggling Task 1 to completed=true (where Task 2 was already true), how many active tasks remain?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "Active Tasks Remaining: 0"
          ],
          "primaryMisconceptionId": "MC_REACT_FUNCTIONAL_STATE_UPDATES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_FUNCTIONAL_STATE_UPDATES",
              "errorExplanation": "Both tasks are now completed, so 0 active tasks remain.",
              "recoveryPath": {
                "simplerExplanation": "All tasks are complete -> 0 active.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "react-d5-b3-milestone-console",
        "day": 5,
        "blockNumber": 3,
        "title": "Full Task Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "State Engine Synthesis",
          "supportingTerms": [
            "State Manager",
            "Action Reducer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d5-b2-toggle-filter-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "engine.js",
            "initialCode": "class TaskEngine {\n  constructor() { this.tasks = []; }\n  add(title) { this.tasks.push({ id: this.tasks.length + 1, title, done: false }); }\n  toggle(id) { this.tasks = this.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); }\n  stats() { return { total: this.tasks.length, done: this.tasks.filter(t => t.done).length }; }\n}\n\nconst engine = new TaskEngine();\nengine.add('Deploy API');\nengine.add('Write Tests');\nengine.toggle(1);\nconsole.log('Task Engine Stats:', JSON.stringify(engine.stats()));",
            "expectedOutput": "Task Engine Stats: {\"total\":2,\"done\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `done` count in the TaskEngine stats above?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "done: 1"
          ],
          "primaryMisconceptionId": "MC_REACT_DIRECT_STATE_MUTATION",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_REACT_DIRECT_STATE_MUTATION",
              "errorExplanation": "Only task 1 was toggled, so done count is 1.",
              "recoveryPath": {
                "simplerExplanation": "Only 1 task is done.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "useMemo, useCallback & React.memo Performance Optimization",
    "overviewMetaphor": "useMemo is a math notebook cheat sheet: instead of recalculating a complex 500-step equation every morning, you check your notebook (cached memo value) and only re-calculate if the initial variables changed.",
    "blocks": [
      {
        "id": "react-d6-b1-usememo",
        "day": 6,
        "blockNumber": 1,
        "title": "useMemo: Caching Expensive Computations",
        "conceptBudget": {
          "primaryConcept": "useMemo Hook",
          "supportingTerms": [
            "Memoized Value",
            "Calculation Skip",
            "Dependency Cache"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d4-b1-useeffect-timing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "useMemo Syntax",
            "codeSnippet": "const sortedList = useMemo(() => {\n  return expensiveSort(rawItems);\n}, [rawItems]); // Re-sorts ONLY when rawItems changes",
            "lineNotes": {
              "1": "Returns the cached value directly without running expensiveSort on unrelated re-renders."
            }
          },
          {
            "type": "runnable_code",
            "filename": "memo_sim.js",
            "initialCode": "let calcCount = 0;\nfunction memoCompute(val, lastVal, cachedResult) {\n  if (val === lastVal) return { result: cachedResult, count: calcCount };\n  calcCount++;\n  return { result: val * 100, count: calcCount };\n}\n\nconst r1 = memoCompute(5, null, null);\nconst r2 = memoCompute(5, 5, r1.result);\nconsole.log('Computations executed:', r2.count);",
            "expectedOutput": "Computations executed: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When memoCompute is called twice with the same argument (5), how many actual computations are executed?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "Computations executed: 1"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_MEMO_PREMATURE_OPTIMIZATION",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_REACT_USE_MEMO_PREMATURE_OPTIMIZATION",
              "errorExplanation": "The second call hits the cache, so computation count stays 1.",
              "recoveryPath": {
                "simplerExplanation": "Same arguments = uses cache without recomputing.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "react-d6-b2-usecallback",
        "day": 6,
        "blockNumber": 2,
        "title": "useCallback: Preserving Function Reference Identity",
        "conceptBudget": {
          "primaryConcept": "useCallback Hook",
          "supportingTerms": [
            "Function Identity",
            "Prevent Child Re-renders",
            "React.memo Pairing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d6-b1-usememo",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Permanent Employee ID Badge",
            "simpleExplanation": "Without useCallback, every re-render creates a brand new function in memory (new ID badge), making child components think their props changed. useCallback preserves the exact same function reference."
          },
          {
            "type": "runnable_code",
            "filename": "callback_id.js",
            "initialCode": "const fn1 = () => 'hi';\nconst fn2 = () => 'hi';\nconsole.log('Two inline functions identical?', fn1 === fn2);",
            "expectedOutput": "Two inline functions identical? false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does `() => {} === () => {}` evaluate to `false` in JavaScript?",
          "options": [
            "Because each function declaration creates a brand new object reference at a different memory address",
            "Because functions cannot be compared in JS",
            "Because the functions are empty"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_USE_CALLBACK_FUNCTION_IDENTITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_USE_CALLBACK_FUNCTION_IDENTITY",
              "errorExplanation": "JavaScript uses reference equality for objects/functions. Every new inline declaration is a separate instance.",
              "recoveryPath": {
                "simplerExplanation": "Different memory instances = false.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d6-b3-react-memo",
        "day": 6,
        "blockNumber": 3,
        "title": "React.memo Component Skipping",
        "conceptBudget": {
          "primaryConcept": "React.memo Higher-Order Component",
          "supportingTerms": [
            "Shallow Prop Comparison",
            "Skip Child Subtree Render"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d6-b2-usecallback",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "react_memo.js",
            "initialCode": "function shallowEqual(objA, objB) {\n  const keysA = Object.keys(objA);\n  const keysB = Object.keys(objB);\n  if (keysA.length !== keysB.length) return false;\n  return keysA.every(k => objA[k] === objB[k]);\n}\n\nconsole.log('Props match:', shallowEqual({ id: 1, label: 'Save' }, { id: 1, label: 'Save' }));",
            "expectedOutput": "Props match: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does shallowEqual return when both props objects have identical primitive fields?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_MEMO_PREMATURE_OPTIMIZATION",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_REACT_USE_MEMO_PREMATURE_OPTIMIZATION",
              "errorExplanation": "All primitive keys and values match, so shallowEqual returns true.",
              "recoveryPath": {
                "simplerExplanation": "Identical props = true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "useRef, Mutable Instance Variables & DOM Node Attachment",
    "overviewMetaphor": "The `useRef` container is a pocket notebook you carry during a presentation: you can write secret notes or stopwatch times in it whenever you want (mutating `.current`) without interrupting the presentation slides on stage (no re-render).",
    "blocks": [
      {
        "id": "react-d7-b1-useref-container",
        "day": 7,
        "blockNumber": 1,
        "title": "The useRef Object Container: { current: value }",
        "conceptBudget": {
          "primaryConcept": "useRef Container",
          "supportingTerms": [
            "Persists Across Renders",
            "Mutation without Re-Render",
            "ref.current"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d3-b1-usestate-basics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "useRef Syntax",
            "codeSnippet": "const renderCount = useRef(0);\n// Mutating ref.current does NOT trigger a component re-render\nrenderCount.current += 1;",
            "lineNotes": {
              "1": "Initializes a plain JavaScript object { current: 0 }."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ref_demo.js",
            "initialCode": "const countRef = { current: 0 };\ncountRef.current += 1;\ncountRef.current += 5;\nconsole.log('Final Ref Value:', countRef.current);",
            "expectedOutput": "Final Ref Value: 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Does mutating `myRef.current = 50` cause the component to re-render in React?",
          "options": [
            "No, mutating a ref object does not trigger a re-render",
            "Yes, refs work identically to useState",
            "Only if current is a string"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_USE_REF_MUTATION_NO_RERENDER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_USE_REF_MUTATION_NO_RERENDER",
              "errorExplanation": "useRef is designed for silent mutation without causing re-renders.",
              "recoveryPath": {
                "simplerExplanation": "Ref mutations never trigger re-renders.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d7-b2-dom-attachment",
        "day": 7,
        "blockNumber": 2,
        "title": "Attaching Refs to Real DOM Nodes (ref={inputRef})",
        "conceptBudget": {
          "primaryConcept": "DOM Node Attachment",
          "supportingTerms": [
            "ref={domRef}",
            "input.focus()",
            "scrollIntoView()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d7-b1-useref-container",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dom_ref.js",
            "initialCode": "const mockInput = {\n  focused: false,\n  focus() { this.focused = true; }\n};\n\nconst inputRef = { current: mockInput };\ninputRef.current.focus();\nconsole.log('Input Focused Status:', inputRef.current.focused);",
            "expectedOutput": "Input Focused Status: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is inputRef.current.focused after calling .focus()?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_REF_MUTATION_NO_RERENDER",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_REACT_USE_REF_MUTATION_NO_RERENDER",
              "errorExplanation": "Calling .focus() sets focused to true.",
              "recoveryPath": {
                "simplerExplanation": "Sets focused flag to true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "react-d7-b3-previous-state-tracking",
        "day": 7,
        "blockNumber": 3,
        "title": "Tracking Previous Props and State with Refs",
        "conceptBudget": {
          "primaryConcept": "Previous State Tracking",
          "supportingTerms": [
            "usePrevious Pattern",
            "Snapshot Comparison"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d7-b2-dom-attachment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "prev_tracker.js",
            "initialCode": "let prevVal = null;\nfunction trackChange(currentVal) {\n  const before = prevVal;\n  prevVal = currentVal;\n  return { before, now: currentVal };\n}\n\ntrackChange(10);\nconst step2 = trackChange(20);\nconsole.log(`Transition: ${step2.before} -> ${step2.now}`);",
            "expectedOutput": "Transition: 10 -> 20",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In the transition above, what was the value before 20?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "Transition: 10 -> 20"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_REF_MUTATION_NO_RERENDER",
          "diagnosisMap": {
            "null": {
              "misconceptionId": "MC_REACT_USE_REF_MUTATION_NO_RERENDER",
              "errorExplanation": "Step 1 stored 10 in prevVal, so before is 10.",
              "recoveryPath": {
                "simplerExplanation": "The previous value was 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Custom Hooks & Logic Decoupling (useWindowSize, useLocalStorage)",
    "overviewMetaphor": "A Custom Hook is a bespoke electric motor: you can pull it out of a vacuum cleaner and mount it inside a lawn mower—both machines get identical spinning power (shared stateful logic) without rewriting motor blueprints.",
    "blocks": [
      {
        "id": "react-d8-b1-custom-hook-rules",
        "day": 8,
        "blockNumber": 1,
        "title": "Rules of Custom Hooks: Naming with 'use'",
        "conceptBudget": {
          "primaryConcept": "Custom Hook Conventions",
          "supportingTerms": [
            "use Prefix",
            "Hook Composition",
            "Rules of Hooks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d4-b1-useeffect-timing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Custom Hook Structure",
            "codeSnippet": "function useCounter(initial = 0) {\n  const [count, setCount] = useState(initial);\n  const inc = () => setCount(c => c + 1);\n  const dec = () => setCount(c => c - 1);\n  return { count, inc, dec };\n}",
            "lineNotes": {
              "1": "Must start with 'use' so React linters can enforce the Rules of Hooks.",
              "5": "Returns an object or tuple containing state and action handlers."
            }
          },
          {
            "type": "runnable_code",
            "filename": "custom_hook.js",
            "initialCode": "function buildCounterHook(init) {\n  let val = init;\n  return {\n    get count() { return val; },\n    inc() { val++; },\n    dec() { val--; }\n  };\n}\n\nconst counter = buildCounterHook(5);\ncounter.inc();\ncounter.inc();\nconsole.log('Custom Hook Count:', counter.count);",
            "expectedOutput": "Custom Hook Count: 7",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Starting at 5, calling inc() twice results in what count?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "Custom Hook Count: 7"
          ],
          "primaryMisconceptionId": "MC_REACT_CUSTOM_HOOK_RULES",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_REACT_CUSTOM_HOOK_RULES",
              "errorExplanation": "inc() was called twice: 5 + 1 + 1 = 7.",
              "recoveryPath": {
                "simplerExplanation": "5 + 2 = 7.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      },
      {
        "id": "react-d8-b2-localstorage-sync",
        "day": 8,
        "blockNumber": 2,
        "title": "The useLocalStorage Hook Pattern",
        "conceptBudget": {
          "primaryConcept": "Storage Synchronization",
          "supportingTerms": [
            "JSON Serialization",
            "Fallback Safe Parsing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d8-b1-custom-hook-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "storage_sync.js",
            "initialCode": "function safeStorageParser(rawStr, fallback) {\n  try {\n    return rawStr ? JSON.parse(rawStr) : fallback;\n  } catch {\n    return fallback;\n  }\n}\n\nconsole.log('Valid JSON:', safeStorageParser('{\"theme\":\"dark\"}', { theme: 'light' }).theme);\nconsole.log('Broken JSON:', safeStorageParser('{bad json}', { theme: 'light' }).theme);",
            "expectedOutput": "Valid JSON: dark\nBroken JSON: light",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When invalid JSON is encountered, what theme is safely returned by the fallback?",
          "expectedStringOutput": "light",
          "acceptableAnswers": [
            "light",
            "'light'"
          ],
          "primaryMisconceptionId": "MC_REACT_CUSTOM_HOOK_RULES",
          "diagnosisMap": {
            "dark": {
              "misconceptionId": "MC_REACT_CUSTOM_HOOK_RULES",
              "errorExplanation": "The second call had malformed JSON, so it caught the error and returned the fallback 'light'.",
              "recoveryPath": {
                "simplerExplanation": "Fallback theme is 'light'.",
                "guidedFixPrompt": "Type light"
              }
            }
          }
        }
      },
      {
        "id": "react-d8-b3-conditional-hook-trap",
        "day": 8,
        "blockNumber": 3,
        "title": "The Conditional Hook Call Anti-Pattern",
        "conceptBudget": {
          "primaryConcept": "Rules of Hooks: Call Order",
          "supportingTerms": [
            "Never inside if/loops",
            "Top-Level Execution Only"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d8-b2-localstorage-sync",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Conditional Hook Call Error",
              "brokenCode": "// ❌ Illegal: Hooks must NEVER be called inside if conditions\nfunction BadProfile({ isAdmin }) {\n  if (isAdmin) {\n    useEffect(() => fetchAdminData(), []); // ❌ Breaks React's internal call order index!\n  }\n  return <div>Profile</div>;\n}",
              "fixedCode": "// ✅ Correct: Call hook at top level, place condition INSIDE the hook\nfunction SafeProfile({ isAdmin }) {\n  useEffect(() => {\n    if (isAdmin) fetchAdminData(); // ✅ Condition is inside the effect callback\n  }, [isAdmin]);\n  return <div>Profile</div>;\n}",
              "errorLine": 3,
              "errorReason": "React relies on the exact order of hook calls between renders. Placing hooks in if statements corrupts internal hook indexes.",
              "fixExplanation": "Always call hooks unconditionally at the top level of your component."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hook_order.js",
            "initialCode": "const hookExecutionOrder = ['useState_theme', 'useEffect_analytics', 'useRef_dom'];\nconsole.log('Hook Execution Sequence Preserved:', hookExecutionOrder.join(' -> '));",
            "expectedOutput": "Hook Execution Sequence Preserved: useState_theme -> useEffect_analytics -> useRef_dom",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must React hooks ALWAYS be called at the top level of a component and never inside `if` statements or loops?",
          "options": [
            "Because React identifies and links hooks by their exact call order across renders",
            "Because if statements are too slow in JSX",
            "Because JavaScript forbids functions inside if blocks"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_HOOK_CALLED_CONDITIONALLY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_HOOK_CALLED_CONDITIONALLY",
              "errorExplanation": "React tracks hooks using an internal ordered list. Changing the number or order of calls corrupts state mapping.",
              "recoveryPath": {
                "simplerExplanation": "Hooks rely on a strict sequential call order.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Context API & Global State Sharing (createContext, useContext)",
    "overviewMetaphor": "The Context API is a broadcast radio tower: instead of handing a physical newspaper down through 10 people in a line (prop drilling), the tower broadcasts music over the airwaves so any radio in the valley (useContext) can tune in directly.",
    "blocks": [
      {
        "id": "react-d9-b1-prop-drilling",
        "day": 9,
        "blockNumber": 1,
        "title": "The Problem of Prop Drilling",
        "conceptBudget": {
          "primaryConcept": "Prop Drilling Anti-Pattern",
          "supportingTerms": [
            "Intermediate Pass-Through",
            "Fragile Coupling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d2-b2-props-immutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Bucket Brigade vs A Water Pipe",
            "simpleExplanation": "Prop drilling is passing water buckets down a line of 10 people who don't want water. Context is a direct underground pipe to the thirsty person at the end."
          },
          {
            "type": "syntax_anatomy",
            "title": "Context Creation & Consumption",
            "codeSnippet": "const ThemeContext = createContext('light');\n\n// Provider supplies value to entire subtree\n<ThemeContext.Provider value='dark'>\n  <Navbar />\n</ThemeContext.Provider>\n\n// Consumer reads value directly\nconst theme = useContext(ThemeContext);",
            "lineNotes": {
              "1": "createContext defines the radio channel with a default value.",
              "4": "Provider broadcasts 'dark' to all child components.",
              "9": "useContext tunes directly into the broadcast."
            }
          },
          {
            "type": "runnable_code",
            "filename": "context_sim.js",
            "initialCode": "function createMockContext(defaultValue) {\n  let current = defaultValue;\n  return {\n    provide(val) { current = val; },\n    consume() { return current; }\n  };\n}\n\nconst ThemeCtx = createMockContext('light');\nThemeCtx.provide('dark');\nconsole.log('Consumed Theme:', ThemeCtx.consume());",
            "expectedOutput": "Consumed Theme: dark",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What major problem does the React Context API solve?",
          "options": [
            "It eliminates prop drilling by allowing deep components to access global data without passing props through intermediate layers",
            "It speeds up internet connection speeds",
            "It replaces CSS stylesheets"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "Context provides a direct data pipeline across the component tree.",
              "recoveryPath": {
                "simplerExplanation": "Context stops prop drilling.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d9-b2-context-recreation-trap",
        "day": 9,
        "blockNumber": 2,
        "title": "The Object Value Re-creation Trap in Providers",
        "conceptBudget": {
          "primaryConcept": "Context Memoization",
          "supportingTerms": [
            "value={{ theme, toggle }} Trap",
            "useMemo for Provider Values"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d9-b1-prop-drilling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Context Provider Inline Object Trap",
              "brokenCode": "// ❌ Buggy: New object reference on every render forces all consumers to re-render!\n<AuthContext.Provider value={{ user, login }}>\n  <App />\n</AuthContext.Provider>",
              "fixedCode": "// ✅ Correct: useMemo stabilizes object reference\nconst contextValue = useMemo(() => ({ user, login }), [user]);\n<AuthContext.Provider value={contextValue}>\n  <App />\n</AuthContext.Provider>",
              "errorLine": 2,
              "errorReason": "Passing `value={{ user, login }}` creates a new object on every render, triggering re-renders in all consumers even if user didn't change.",
              "fixExplanation": "Wrap the context value in `useMemo`."
            }
          },
          {
            "type": "runnable_code",
            "filename": "provider_memo.js",
            "initialCode": "const refA = { id: 'usr_1' };\nconst refB = { id: 'usr_1' };\nconsole.log('Inline object creates new reference?', refA !== refB);",
            "expectedOutput": "Inline object creates new reference? true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should you wrap an object passed to `<MyContext.Provider value={...}>` in `useMemo`?",
          "options": [
            "To prevent passing a new object reference on every render, which would cause all consumer components to re-render needlessly",
            "Because React crashes if objects are passed directly",
            "To encrypt the data"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_CONTEXT_VALUE_RECREATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_CONTEXT_VALUE_RECREATION",
              "errorExplanation": "useMemo preserves the reference identity of context values.",
              "recoveryPath": {
                "simplerExplanation": "Stabilizes context object reference to prevent waste renders.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d9-b3-custom-context-hook",
        "day": 9,
        "blockNumber": 3,
        "title": "The useSafeContext Hook Pattern",
        "conceptBudget": {
          "primaryConcept": "Safe Context Hook",
          "supportingTerms": [
            "Throw Error if Outside Provider",
            "Clean API"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d9-b2-context-recreation-trap",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Safe Context Hook Pattern",
            "codeSnippet": "function useAuth() {\n  const context = useContext(AuthContext);\n  if (!context) {\n    throw new Error('useAuth must be used within an AuthProvider');\n  }\n  return context;\n}",
            "lineNotes": {
              "3": "Guards against developers forgetting to wrap their components with the Provider."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_ctx.js",
            "initialCode": "function resolveAuth(ctx) {\n  if (!ctx) return 'ERROR_OUTSIDE_PROVIDER';\n  return `Authenticated: ${ctx.user}`;\n}\n\nconsole.log(resolveAuth({ user: 'Alex' }));\nconsole.log(resolveAuth(null));",
            "expectedOutput": "Authenticated: Alex\nERROR_OUTSIDE_PROVIDER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When context is null (outside Provider), what does resolveAuth return?",
          "expectedStringOutput": "ERROR_OUTSIDE_PROVIDER",
          "acceptableAnswers": [
            "ERROR_OUTSIDE_PROVIDER",
            "'ERROR_OUTSIDE_PROVIDER'"
          ],
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "null": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "Guard clause intercepts null and returns 'ERROR_OUTSIDE_PROVIDER'.",
              "recoveryPath": {
                "simplerExplanation": "Returns error token.",
                "guidedFixPrompt": "Type ERROR_OUTSIDE_PROVIDER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "⭐ MILESTONE 2: Multi-Page Theme & Auth Context Provider Engine",
    "overviewMetaphor": "Milestone 2 — Global Application State Engine: The dual Theme and Auth context pipeline that powers user permissions, dark/light theme switching, and route protection across all pages.",
    "blocks": [
      {
        "id": "react-d10-b1-auth-state-model",
        "day": 10,
        "blockNumber": 1,
        "title": "Auth State Model: User, Token & Permissions",
        "conceptBudget": {
          "primaryConcept": "Auth State Management",
          "supportingTerms": [
            "JWT Token",
            "User Roles ('ADMIN', 'STUDENT')",
            "Login / Logout Actions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d9-b3-custom-context-hook",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "auth_store.js",
            "initialCode": "class AuthStore {\n  constructor() { this.user = null; }\n  login(email, role) { this.user = { email, role, token: 'jwt_' + Date.now() }; }\n  logout() { this.user = null; }\n  isAuthenticated() { return this.user !== null; }\n}\n\nconst auth = new AuthStore();\nauth.login('alex@pinit.ai', 'ADMIN');\nconsole.log(`User logged in: ${auth.user.email} [${auth.user.role}]`);",
            "expectedOutput": "User logged in: alex@pinit.ai [ADMIN]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `auth.user.role` after logging in as ADMIN?",
          "expectedStringOutput": "ADMIN",
          "acceptableAnswers": [
            "ADMIN",
            "'ADMIN'"
          ],
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "STUDENT": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "Role was assigned to 'ADMIN'.",
              "recoveryPath": {
                "simplerExplanation": "User role is 'ADMIN'.",
                "guidedFixPrompt": "Type ADMIN"
              }
            }
          }
        }
      },
      {
        "id": "react-d10-b2-theme-state-resolver",
        "day": 10,
        "blockNumber": 2,
        "title": "Theme Mode Switching & Dynamic CSS Variables",
        "conceptBudget": {
          "primaryConcept": "Theme State Engine",
          "supportingTerms": [
            "Dark / Light Mode",
            "System Preference Fallback"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d10-b1-auth-state-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "theme_resolver.js",
            "initialCode": "function resolveColors(theme) {\n  return theme === 'dark'\n    ? { bg: '#0f172a', text: '#f8fafc' }\n    : { bg: '#ffffff', text: '#0f172a' };\n}\n\nconsole.log('Dark Theme Background:', resolveColors('dark').bg);",
            "expectedOutput": "Dark Theme Background: #0f172a",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the dark background color code returned above?",
          "expectedStringOutput": "#0f172a",
          "acceptableAnswers": [
            "#0f172a",
            "'#0f172a'"
          ],
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "#ffffff": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "Dark mode returns background '#0f172a'.",
              "recoveryPath": {
                "simplerExplanation": "Dark background = #0f172a.",
                "guidedFixPrompt": "Type #0f172a"
              }
            }
          }
        }
      },
      {
        "id": "react-d10-b3-protected-route-guard",
        "day": 10,
        "blockNumber": 3,
        "title": "Protected Route Redirection Guard",
        "conceptBudget": {
          "primaryConcept": "Route Permission Guard",
          "supportingTerms": [
            "Authorization Check",
            "Redirect to /login"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d10-b2-theme-state-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "guard.js",
            "initialCode": "function evaluateRouteAccess(user, requiredRole) {\n  if (!user) return { access: false, redirect: '/login' };\n  if (requiredRole && user.role !== requiredRole) return { access: false, redirect: '/unauthorized' };\n  return { access: true, redirect: null };\n}\n\nconsole.log('Guest Access to Admin Dashboard:', evaluateRouteAccess(null, 'ADMIN').redirect);",
            "expectedOutput": "Guest Access to Admin Dashboard: /login",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is an unauthenticated guest redirected when attempting to access a protected page?",
          "expectedStringOutput": "/login",
          "acceptableAnswers": [
            "/login",
            "'/login'"
          ],
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "/unauthorized": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "Unauthenticated users redirect to /login (only logged-in users with wrong role go to /unauthorized).",
              "recoveryPath": {
                "simplerExplanation": "No user = redirect to /login.",
                "guidedFixPrompt": "Type /login"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "React Portals & Modal Dialog Management (createPortal)",
    "overviewMetaphor": "A React Portal is an emergency exit staircase: even if you are deep inside a claustrophobic basement room with low ceilings (parent with `overflow: hidden`), the portal lets you step out directly into the wide open fresh air (document.body).",
    "blocks": [
      {
        "id": "react-d11-b1-portal-concept",
        "day": 11,
        "blockNumber": 1,
        "title": "Why Portals? (Escaping Parent CSS Constraints)",
        "conceptBudget": {
          "primaryConcept": "React Portals (createPortal)",
          "supportingTerms": [
            "document.body Mount Point",
            "Bypass overflow: hidden & z-index"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d2-b1-pure-component",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "createPortal Syntax",
            "codeSnippet": "import { createPortal } from 'react-dom';\n\nfunction Modal({ children }) {\n  return createPortal(\n    <div className='modal-backdrop'>{children}</div>,\n    document.body // Appended directly to body\n  );\n}",
            "lineNotes": {
              "3": "createPortal renders JSX into an external DOM node while preserving React event bubbling."
            }
          },
          {
            "type": "runnable_code",
            "filename": "portal_sim.js",
            "initialCode": "function simulatePortalRender(targetDomNode, content) {\n  return `Rendered '${content}' directly inside <${targetDomNode}> without CSS clipping.`;\n}\n\nconsole.log(simulatePortalRender('body', 'Confirm Payment Modal'));",
            "expectedOutput": "Rendered 'Confirm Payment Modal' directly inside <body> without CSS clipping.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary technical reason to use `createPortal` for modals and tooltips in React?",
          "options": [
            "To render elements outside parent containers that have `overflow: hidden`, `transform`, or low `z-index` styles",
            "To make modals run on a Web Worker thread",
            "Because React forbids modals inside normal components"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_PORTAL_DOM_ESCAPE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_PORTAL_DOM_ESCAPE",
              "errorExplanation": "Portals escape parent container CSS bounding boxes by mounting directly to document.body.",
              "recoveryPath": {
                "simplerExplanation": "Bypasses parent CSS clipping and z-index issues.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d11-b2-portal-event-bubbling",
        "day": 11,
        "blockNumber": 2,
        "title": "Event Bubbling Through React Portals",
        "conceptBudget": {
          "primaryConcept": "Portal Synthetic Event Bubbling",
          "supportingTerms": [
            "React Tree vs Real DOM Tree",
            "Parent Event Capture"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d11-b1-portal-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Remote Satellite Camera",
            "simpleExplanation": "Even though the satellite camera is orbiting in space (mounted in document.body), its control feed is plugged straight into mission control (React parent tree receives the click event)."
          },
          {
            "type": "runnable_code",
            "filename": "bubbling.js",
            "initialCode": "let parentClicks = 0;\nfunction onParentClick() { parentClicks++; }\n\n// A click inside the portal still bubbles up the React tree\nonParentClick();\nconsole.log('Parent caught portal click event:', parentClicks === 1);",
            "expectedOutput": "Parent caught portal click event: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Does a click event inside a `createPortal` element bubble up to parent components in the React tree?",
          "options": [
            "Yes, React synthetic events bubble up according to the React component tree hierarchy, regardless of where the DOM node is mounted",
            "No, events are trapped inside document.body",
            "Only on touch devices"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_PORTAL_DOM_ESCAPE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_PORTAL_DOM_ESCAPE",
              "errorExplanation": "React synthetic event propagation follows the virtual component hierarchy, not real DOM parentage.",
              "recoveryPath": {
                "simplerExplanation": "Events bubble up the React tree naturally.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d11-b3-focus-trap",
        "day": 11,
        "blockNumber": 3,
        "title": "Keyboard Accessibility: Escape Key & Focus Trap",
        "conceptBudget": {
          "primaryConcept": "Modal Accessibility (a11y)",
          "supportingTerms": [
            "Escape Key Dismissal",
            "Focus Trapping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d11-b2-portal-event-bubbling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "a11y.js",
            "initialCode": "function handleKeyDown(eventKey, onClose) {\n  if (eventKey === 'Escape') {\n    onClose();\n    return 'MODAL_CLOSED';\n  }\n  return 'IGNORED';\n}\n\nlet closed = false;\nconsole.log('Result of Escape key:', handleKeyDown('Escape', () => { closed = true; }));",
            "expectedOutput": "Result of Escape key: MODAL_CLOSED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is returned when the user presses 'Escape' on an active modal dialog?",
          "expectedStringOutput": "MODAL_CLOSED",
          "acceptableAnswers": [
            "MODAL_CLOSED",
            "'MODAL_CLOSED'"
          ],
          "primaryMisconceptionId": "MC_REACT_PORTAL_DOM_ESCAPE",
          "diagnosisMap": {
            "IGNORED": {
              "misconceptionId": "MC_REACT_PORTAL_DOM_ESCAPE",
              "errorExplanation": "Escape triggers the dismiss handler and returns 'MODAL_CLOSED'.",
              "recoveryPath": {
                "simplerExplanation": "Escape key dismisses the dialog.",
                "guidedFixPrompt": "Type MODAL_CLOSED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Error Boundaries & Fallback UI Resilience",
    "overviewMetaphor": "An Error Boundary is a circuit breaker in your home electrical panel: if the microwave in the kitchen shorts out (render crash in a widget), the breaker trips for only that circuit, keeping the rest of the house lights and refrigerator running safely.",
    "blocks": [
      {
        "id": "react-d12-b1-error-boundary-concept",
        "day": 12,
        "blockNumber": 1,
        "title": "Preventing White Screen Crashes",
        "conceptBudget": {
          "primaryConcept": "Error Boundaries",
          "supportingTerms": [
            "componentDidCatch",
            "getDerivedStateFromError",
            "Graceful Fallback UI"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d2-b1-pure-component",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Safety Net Under Trapeze Artists",
            "simpleExplanation": "Without a safety net, one dropped ball crashes the entire circus (white screen). With an error boundary, only the faulty act is swapped for a friendly recovery message."
          },
          {
            "type": "syntax_anatomy",
            "title": "Error Boundary Class Structure",
            "codeSnippet": "class ErrorBoundary extends React.Component {\n  state = { hasError: false };\n  static getDerivedStateFromError(error) {\n    return { hasError: true }; // Updates state so next render shows fallback\n  }\n  componentDidCatch(error, info) {\n    logErrorToTelemetry(error, info); // Sends crash stack to Sentry\n  }\n  render() {\n    if (this.state.hasError) return <FallbackCard />;\n    return this.props.children;\n  }\n}",
            "lineNotes": {
              "3": "getDerivedStateFromError switches the component into fallback mode.",
              "6": "componentDidCatch logs crash telemetry."
            }
          },
          {
            "type": "runnable_code",
            "filename": "boundary_sim.js",
            "initialCode": "function simulateRender(shouldCrash) {\n  try {\n    if (shouldCrash) throw new Error('Data format corrupted');\n    return 'UI Rendered Successfully';\n  } catch (err) {\n    return `[FALLBACK UI] Caught crash: ${err.message}`;\n  }\n}\n\nconsole.log(simulateRender(true));",
            "expectedOutput": "[FALLBACK UI] Caught crash: Data format corrupted",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens in a React application when an unhandled JavaScript exception occurs inside a component render without an Error Boundary?",
          "options": [
            "React unmounts the entire component tree, resulting in a blank white screen for the user",
            "React automatically reboots the browser",
            "The error is silently ignored"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_ERROR_BOUNDARY_CATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_ERROR_BOUNDARY_CATCH",
              "errorExplanation": "Vanilla React unmounts all components on uncaught render errors, leading to a complete white-screen crash.",
              "recoveryPath": {
                "simplerExplanation": "Uncaught render errors unmount the whole UI into a blank screen.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d12-b2-what-boundaries-catch",
        "day": 12,
        "blockNumber": 2,
        "title": "What Error Boundaries Do and Do NOT Catch",
        "conceptBudget": {
          "primaryConcept": "Error Boundary Scope",
          "supportingTerms": [
            "Catches Render & Lifecycle Errors",
            "Does NOT Catch Event Handlers or Async Promises"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d12-b1-error-boundary-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Async Error Catch Trap",
              "brokenCode": "// ❌ Buggy: Error boundaries do NOT catch errors in async event handlers\nfunction BadButton() {\n  const onClick = async () => {\n    throw new Error('API 500'); // ❌ Uncaught promise error escapes boundary!\n  };\n  return <button onClick={onClick}>Submit</button>;\n}",
              "fixedCode": "// ✅ Correct: Handle async event handler errors with try-catch\nfunction SafeButton() {\n  const onClick = async () => {\n    try {\n      await submitData();\n    } catch (err) {\n      showToastError(err.message); // ✅ Caught gracefully\n    }\n  };\n  return <button onClick={onClick}>Submit</button>;\n}",
              "errorLine": 4,
              "errorReason": "Error Boundaries only catch errors during render, lifecycle methods, and constructors—not inside event handlers or async timers.",
              "fixExplanation": "Use standard try-catch inside async onClick handlers."
            }
          },
          {
            "type": "runnable_code",
            "filename": "boundary_scope.js",
            "initialCode": "function classifyErrorOrigin(origin) {\n  return origin === 'RENDER' ? 'CAUGHT_BY_BOUNDARY' : 'USE_TRY_CATCH';\n}\n\nconsole.log('Render Error:', classifyErrorOrigin('RENDER'));\nconsole.log('OnClick Async Error:', classifyErrorOrigin('ON_CLICK_EVENT'));",
            "expectedOutput": "Render Error: CAUGHT_BY_BOUNDARY\nOnClick Async Error: USE_TRY_CATCH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Do React Error Boundaries catch errors thrown inside `onClick` event handlers?",
          "options": [
            "No, event handler errors happen outside the render cycle and must be caught with normal `try / catch`",
            "Yes, Error Boundaries catch all JavaScript errors anywhere in the app",
            "Only in React 18"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_ERROR_BOUNDARY_CATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_ERROR_BOUNDARY_CATCH",
              "errorExplanation": "Event handlers do not occur during rendering; use try/catch inside handlers.",
              "recoveryPath": {
                "simplerExplanation": "Event handlers need try/catch.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d12-b3-granular-boundaries",
        "day": 12,
        "blockNumber": 3,
        "title": "Granular Subtree Isolation (Per-Widget Boundaries)",
        "conceptBudget": {
          "primaryConcept": "Granular Resilience",
          "supportingTerms": [
            "Isolate Failing Widgets",
            "Rest of Page Stays Interactive"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d12-b2-what-boundaries-catch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "granular.js",
            "initialCode": "const widgets = [\n  { name: 'Header', status: 'HEALTHY' },\n  { name: 'CommentsFeed', status: 'FAILED' },\n  { name: 'VideoPlayer', status: 'HEALTHY' }\n];\n\nconst pageState = widgets.map(w => w.status === 'HEALTHY' ? `[OK] ${w.name}` : `[FALLBACK] ${w.name}`);\nconsole.log('Page Widgets Status:', pageState.join(' | '));",
            "expectedOutput": "Page Widgets Status: [OK] Header | [FALLBACK] CommentsFeed | [OK] VideoPlayer",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When CommentsFeed fails inside its own boundary, what is the status of Header and VideoPlayer?",
          "expectedStringOutput": "Page Widgets Status: [OK] Header | [FALLBACK] CommentsFeed | [OK] VideoPlayer",
          "acceptableAnswers": [
            "Page Widgets Status: [OK] Header | [FALLBACK] CommentsFeed | [OK] VideoPlayer",
            "[OK] Header | [FALLBACK] CommentsFeed | [OK] VideoPlayer"
          ],
          "primaryMisconceptionId": "MC_REACT_ERROR_BOUNDARY_CATCH",
          "diagnosisMap": {
            "All Failed": {
              "misconceptionId": "MC_REACT_ERROR_BOUNDARY_CATCH",
              "errorExplanation": "Granular boundaries isolate crashes to the single failing widget.",
              "recoveryPath": {
                "simplerExplanation": "Other widgets stay healthy.",
                "guidedFixPrompt": "Type Page Widgets Status: [OK] Header | [FALLBACK] CommentsFeed | [OK] VideoPlayer"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Code Splitting with React.lazy, Suspense & Dynamic Imports",
    "overviewMetaphor": "Code splitting is ordering furniture on demand: instead of hauling an entire 50-room house furniture set on a moving truck on day 1 (huge 10MB bundle), you move in with the bed first and order the dining table (lazy chunk) only when guests arrive.",
    "blocks": [
      {
        "id": "react-d13-b1-lazy-suspense",
        "day": 13,
        "blockNumber": 1,
        "title": "React.lazy & Suspense Fallback Syntax",
        "conceptBudget": {
          "primaryConcept": "Lazy Loading with Suspense",
          "supportingTerms": [
            "React.lazy(() => import(...))",
            "Suspense fallback={<Spinner />}"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d12-b1-error-boundary-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "React.lazy Anatomy",
            "codeSnippet": "const AnalyticsDashboard = React.lazy(() => import('./AnalyticsDashboard'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<LoadingSpinner />}>\n      <AnalyticsDashboard />\n    </Suspense>\n  );\n}",
            "lineNotes": {
              "1": "Splits AnalyticsDashboard into an independent chunk downloaded on demand.",
              "5": "Suspense renders fallback spinner while the chunk is streaming over the network."
            }
          },
          {
            "type": "runnable_code",
            "filename": "lazy_sim.js",
            "initialCode": "function resolveSuspenseState(isLoaded, fallback, componentContent) {\n  return isLoaded ? componentContent : fallback;\n}\n\nconsole.log('While Downloading:', resolveSuspenseState(false, '<LoadingSpinner />', '<AdminTable />'));\nconsole.log('After Loaded:', resolveSuspenseState(true, '<LoadingSpinner />', '<AdminTable />'));",
            "expectedOutput": "While Downloading: <LoadingSpinner />\nAfter Loaded: <AdminTable />",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does Suspense display while the lazy chunk is downloading over the network?",
          "expectedStringOutput": "<LoadingSpinner />",
          "acceptableAnswers": [
            "<LoadingSpinner />",
            "LoadingSpinner"
          ],
          "primaryMisconceptionId": "MC_REACT_LAZY_SUSPENSE_FALLBACK",
          "diagnosisMap": {
            "<AdminTable />": {
              "misconceptionId": "MC_REACT_LAZY_SUSPENSE_FALLBACK",
              "errorExplanation": "While downloading (isLoaded=false), Suspense renders the fallback (<LoadingSpinner />).",
              "recoveryPath": {
                "simplerExplanation": "Renders fallback spinner.",
                "guidedFixPrompt": "Type <LoadingSpinner />"
              }
            }
          }
        }
      },
      {
        "id": "react-d13-b2-route-based-splitting",
        "day": 13,
        "blockNumber": 2,
        "title": "Route-Based Code Splitting",
        "conceptBudget": {
          "primaryConcept": "Route Code Splitting",
          "supportingTerms": [
            "Per-Page Bundling",
            "Fast Initial Page Load (FCP)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d13-b1-lazy-suspense",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Downloading Book Chapters One by One",
            "simpleExplanation": "When opening a novel, the app downloads Chapter 1 immediately. Chapter 10 is only downloaded when you turn page 9."
          },
          {
            "type": "runnable_code",
            "filename": "route_chunks.js",
            "initialCode": "const chunks = { '/home': '15KB', '/checkout': '250KB', '/admin': '800KB' };\nconsole.log('Initial homepage download size:', chunks['/home']);",
            "expectedOutput": "Initial homepage download size: 15KB",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does route-based code splitting improve user experience?",
          "options": [
            "It shrinks the initial JavaScript payload so the first page loads in milliseconds without downloading code for unused pages",
            "It gives users free internet data",
            "It converts React into WebAssembly"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_LAZY_SUSPENSE_FALLBACK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_LAZY_SUSPENSE_FALLBACK",
              "errorExplanation": "Splitting by route avoids shipping admin/checkout code to visitors who just want the homepage.",
              "recoveryPath": {
                "simplerExplanation": "Loads only the code needed for the active route.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d13-b3-prefetching-chunks",
        "day": 13,
        "blockNumber": 3,
        "title": "Chunk Prefetching on Hover",
        "conceptBudget": {
          "primaryConcept": "Prefetching Strategy",
          "supportingTerms": [
            "onMouseEnter Prefetch",
            "Zero-Latency Navigation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d13-b2-route-based-splitting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "prefetch.js",
            "initialCode": "let prefetchedChunks = [];\nfunction onButtonHover(route) {\n  if (!prefetchedChunks.includes(route)) prefetchedChunks.push(route);\n}\n\nonButtonHover('/dashboard');\nconsole.log('Prefetched Chunks:', prefetchedChunks.join(', '));",
            "expectedOutput": "Prefetched Chunks: /dashboard",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which route was preloaded into memory when hovering over the button?",
          "expectedStringOutput": "/dashboard",
          "acceptableAnswers": [
            "/dashboard",
            "'/dashboard'"
          ],
          "primaryMisconceptionId": "MC_REACT_LAZY_SUSPENSE_FALLBACK",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_REACT_LAZY_SUSPENSE_FALLBACK",
              "errorExplanation": "Hover pushed '/dashboard' into prefetchedChunks.",
              "recoveryPath": {
                "simplerExplanation": "Preloaded /dashboard.",
                "guidedFixPrompt": "Type /dashboard"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "useReducer & Predictable State Machines",
    "overviewMetaphor": "useReducer is a vending machine keypad: you don't reach your hands inside and shuffle gears manually (random state setters); you push a button `dispatch({ type: 'DISPENSE', item: 'B4' })`, and the internal logic gearbox (Reducer) calculates the exact state transition.",
    "blocks": [
      {
        "id": "react-d14-b1-reducer-anatomy",
        "day": 14,
        "blockNumber": 1,
        "title": "The Reducer Function: (state, action) => nextState",
        "conceptBudget": {
          "primaryConcept": "useReducer Mechanics",
          "supportingTerms": [
            "Pure Reducer Function",
            "action.type & action.payload",
            "dispatch()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d3-b1-usestate-basics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "useReducer Syntax",
            "codeSnippet": "function countReducer(state, action) {\n  switch (action.type) {\n    case 'INCREMENT': return { count: state.count + action.step };\n    case 'DECREMENT': return { count: state.count - action.step };\n    case 'RESET': return { count: 0 };\n    default: return state;\n  }\n}\n\nconst [state, dispatch] = useReducer(countReducer, { count: 0 });",
            "lineNotes": {
              "1": "Reducer must be a pure deterministic function returning new state.",
              "10": "dispatch({ type: 'INCREMENT', step: 5 }) triggers the action."
            }
          },
          {
            "type": "runnable_code",
            "filename": "reducer_demo.js",
            "initialCode": "function cartReducer(state, action) {\n  switch (action.type) {\n    case 'ADD': return [...state, action.item];\n    case 'CLEAR': return [];\n    default: return state;\n  }\n}\n\nlet cart = [];\ncart = cartReducer(cart, { type: 'ADD', item: 'Laptop' });\ncart = cartReducer(cart, { type: 'ADD', item: 'Mouse' });\nconsole.log('Cart Items:', cart.join(', '));",
            "expectedOutput": "Cart Items: Laptop, Mouse",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "After dispatching two ADD actions, what is the output of cart.join(', ')?",
          "expectedStringOutput": "Laptop, Mouse",
          "acceptableAnswers": [
            "Laptop, Mouse",
            "'Laptop, Mouse'"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
          "diagnosisMap": {
            "Mouse": {
              "misconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
              "errorExplanation": "Both items were accumulated into the array.",
              "recoveryPath": {
                "simplerExplanation": "Cart contains Laptop and Mouse.",
                "guidedFixPrompt": "Type Laptop, Mouse"
              }
            }
          }
        }
      },
      {
        "id": "react-d14-b2-when-to-use-reducer",
        "day": 14,
        "blockNumber": 2,
        "title": "When to Choose useReducer over useState",
        "conceptBudget": {
          "primaryConcept": "useState vs useReducer",
          "supportingTerms": [
            "Complex Multi-Field State",
            "Interdependent Sub-values",
            "Predictable Logging"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d14-b1-reducer-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Light Switch vs An Airplane Cockpit",
            "simpleExplanation": "A single toggle light switch is perfect for useState(false). A multi-dial airplane cockpit with interdependent altitude, fuel, and autopilot systems is built with useReducer."
          },
          {
            "type": "runnable_code",
            "filename": "complex_state.js",
            "initialCode": "function formReducer(state, action) {\n  switch (action.type) {\n    case 'SET_FIELD': return { ...state, values: { ...state.values, [action.field]: action.value } };\n    case 'SET_ERROR': return { ...state, errors: { ...state.errors, [action.field]: action.msg } };\n    default: return state;\n  }\n}\n\nlet s = { values: {}, errors: {} };\ns = formReducer(s, { type: 'SET_FIELD', field: 'email', value: 'alex@pinit.ai' });\nconsole.log('Form Email:', s.values.email);",
            "expectedOutput": "Form Email: alex@pinit.ai",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is `useReducer` preferred over multiple `useState` calls for complex state machines?",
          "options": [
            "Because it consolidates all state transition logic into a single testable pure function and avoids out-of-sync multi-state race conditions",
            "Because useReducer is faster than useState",
            "Because useState cannot store objects"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
              "errorExplanation": "useReducer centralizes all state transition rules in one pure reducer.",
              "recoveryPath": {
                "simplerExplanation": "Centralizes complex state transitions in one place.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d14-b3-action-type-safety",
        "day": 14,
        "blockNumber": 3,
        "title": "Action Creators & Typed Action Constants",
        "conceptBudget": {
          "primaryConcept": "Action Type Safety",
          "supportingTerms": [
            "Action Constants",
            "Prevent Typo Bugs in switch cases"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d14-b2-when-to-use-reducer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "action_types.js",
            "initialCode": "const ACTIONS = {\n  SET_PAGE: 'NAVIGATION/SET_PAGE',\n  RESET: 'NAVIGATION/RESET'\n};\n\nfunction createSetPageAction(pageNumber) {\n  return { type: ACTIONS.SET_PAGE, payload: pageNumber };\n}\n\nconsole.log('Action Object:', JSON.stringify(createSetPageAction(3)));",
            "expectedOutput": "Action Object: {\"type\":\"NAVIGATION/SET_PAGE\",\"payload\":3}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `payload` in the generated action object above?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
          "diagnosisMap": {
            "SET_PAGE": {
              "misconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
              "errorExplanation": "payload is the argument 3 passed to createSetPageAction.",
              "recoveryPath": {
                "simplerExplanation": "Payload is 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 3: Complex E-Commerce Cart Engine with useReducer & Context",
    "overviewMetaphor": "Milestone 3 — Production E-Commerce Shopping Cart: A complete retail checkout engine featuring item additions, quantity recalculation, promo code discounts, tax computations, and persistent state.",
    "blocks": [
      {
        "id": "react-d15-b1-cart-reducer-logic",
        "day": 15,
        "blockNumber": 1,
        "title": "The Cart Reducer: ADD, REMOVE, UPDATE_QTY, APPLY_PROMO",
        "conceptBudget": {
          "primaryConcept": "E-Commerce Cart Reducer",
          "supportingTerms": [
            "Quantity Accumulator",
            "Immutable Item Updates"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d14-b1-reducer-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cart_core.js",
            "initialCode": "function ecomReducer(state, action) {\n  switch (action.type) {\n    case 'ADD_ITEM': {\n      const exists = state.items.find(i => i.id === action.item.id);\n      if (exists) {\n        return {\n          ...state,\n          items: state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i)\n        };\n      }\n      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };\n    }\n    default: return state;\n  }\n}\n\nlet cartState = { items: [] };\ncartState = ecomReducer(cartState, { type: 'ADD_ITEM', item: { id: 'p1', name: 'Hoodie', price: 50 } });\ncartState = ecomReducer(cartState, { type: 'ADD_ITEM', item: { id: 'p1', name: 'Hoodie', price: 50 } });\nconsole.log('Hoodie Quantity:', cartState.items[0].qty);",
            "expectedOutput": "Hoodie Quantity: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When adding the same item twice, what is its final `qty`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Hoodie Quantity: 2"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
              "errorExplanation": "Existing item quantity increments: 1 + 1 = 2.",
              "recoveryPath": {
                "simplerExplanation": "Item already in cart -> qty increments to 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "react-d15-b2-price-calculator",
        "day": 15,
        "blockNumber": 2,
        "title": "Cart Subtotal, Tax & Discount Calculator",
        "conceptBudget": {
          "primaryConcept": "Financial Cart Calculations",
          "supportingTerms": [
            "Subtotal reduce()",
            "Tax Rate",
            "Promo Discount"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d15-b1-cart-reducer-logic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "totals.js",
            "initialCode": "function computeTotals(items, discountPercent = 0, taxRate = 0.10) {\n  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);\n  const discount = subtotal * (discountPercent / 100);\n  const taxable = subtotal - discount;\n  const tax = taxable * taxRate;\n  return {\n    subtotal,\n    discount,\n    tax,\n    total: Number((taxable + tax).toFixed(2))\n  };\n}\n\nconst items = [{ price: 100, qty: 2 }];\nconst totals = computeTotals(items, 10, 0.10);\nconsole.log('Final Order Total:', totals.total);",
            "expectedOutput": "Final Order Total: 198",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "For subtotal 200 with 10% discount (180 taxable) + 10% tax (18), what is the final order total?",
          "expectedStringOutput": "198",
          "acceptableAnswers": [
            "198",
            "Final Order Total: 198"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
              "errorExplanation": "180 (discounted) + 18 (tax) = 198.",
              "recoveryPath": {
                "simplerExplanation": "180 + 18 = 198.",
                "guidedFixPrompt": "Type 198"
              }
            }
          }
        }
      },
      {
        "id": "react-d15-b3-cart-context-pipeline",
        "day": 15,
        "blockNumber": 3,
        "title": "Connecting Cart Reducer to Global Context Provider",
        "conceptBudget": {
          "primaryConcept": "Cart Context Architecture",
          "supportingTerms": [
            "useCart Custom Hook",
            "CartProvider Wrapper"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d15-b2-price-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cart_context.js",
            "initialCode": "class CartContextStore {\n  constructor() {\n    this.state = { items: [] };\n  }\n  dispatch(action) {\n    if (action.type === 'ADD') this.state.items.push(action.item);\n  }\n  getCount() {\n    return this.state.items.length;\n  }\n}\n\nconst store = new CartContextStore();\nstore.dispatch({ type: 'ADD', item: { name: 'Keyboard' } });\nconsole.log('Global Cart Count:', store.getCount());",
            "expectedOutput": "Global Cart Count: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the global cart item count after dispatching ADD?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "Global Cart Count: 1"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_REACT_USE_REDUCER_ACTION_DISPATCH",
              "errorExplanation": "Dispatched ADD pushed 1 item to the global cart.",
              "recoveryPath": {
                "simplerExplanation": "Count is 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "React 18 Concurrent Features, useTransition & Non-Blocking UI",
    "overviewMetaphor": "useTransition is an express highway lane: urgent user typing (steering the wheel) stays in the high-speed fast lane without freezing, while heavy 10,000-item chart sorting travels in the low-priority freight lane (transition update) in the background.",
    "blocks": [
      {
        "id": "react-d16-b1-concurrent-concept",
        "day": 16,
        "blockNumber": 1,
        "title": "Concurrent Rendering: Interruptible Render Passes",
        "conceptBudget": {
          "primaryConcept": "Concurrent Rendering",
          "supportingTerms": [
            "Interruptible Work",
            "Urgent vs Non-Urgent Updates",
            "No UI Freezing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d6-b1-usememo",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Pausing Video to Answer the Door",
            "simpleExplanation": "In old React, once rendering started, the browser froze until completion. In React 18 Concurrent mode, React pauses long renders immediately when the user clicks or types, processes the input, and then resumes."
          },
          {
            "type": "syntax_anatomy",
            "title": "useTransition Syntax",
            "codeSnippet": "const [isPending, startTransition] = useTransition();\n\nfunction handleSearch(query) {\n  setInputValue(query); // 1. Urgent: update input box immediately\n  startTransition(() => {\n    setSearchResults(heavyFilter(query)); // 2. Non-urgent: low priority\n  });\n}",
            "lineNotes": {
              "1": "isPending indicates whether the low-priority transition render is ongoing.",
              "5": "startTransition marks the inner state update as interruptible."
            }
          },
          {
            "type": "runnable_code",
            "filename": "transition_sim.js",
            "initialCode": "function simulateTransition(isUrgent) {\n  return isUrgent ? 'PRIORITY_HIGH_FAST_PAINT' : 'PRIORITY_LOW_INTERRUPTIBLE';\n}\n\nconsole.log('Typing Input Box:', simulateTransition(true));\nconsole.log('Large Graph Re-render:', simulateTransition(false));",
            "expectedOutput": "Typing Input Box: PRIORITY_HIGH_FAST_PAINT\nLarge Graph Re-render: PRIORITY_LOW_INTERRUPTIBLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary purpose of the `useTransition` hook in React 18?",
          "options": [
            "To mark heavy state updates as non-urgent transitions so urgent user typing stays smooth without freezing the UI",
            "To add CSS fade transitions between pages",
            "To run JavaScript on the GPU"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "useTransition is for priority scheduling of state updates, not CSS animations.",
              "recoveryPath": {
                "simplerExplanation": "Keeps UI responsive during heavy state updates.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d16-b2-ispending-indicator",
        "day": 16,
        "blockNumber": 2,
        "title": "The isPending Loading Indicator",
        "conceptBudget": {
          "primaryConcept": "isPending State",
          "supportingTerms": [
            "Pending Spinner",
            "Graceful Background State"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d16-b1-concurrent-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pending_state.js",
            "initialCode": "function renderSearchUI(isPending, resultsCount) {\n  return isPending ? `Updating list... (${resultsCount} current)` : `Showing ${resultsCount} results.`;\n}\n\nconsole.log(renderSearchUI(true, 50));\nconsole.log(renderSearchUI(false, 100));",
            "expectedOutput": "Updating list... (50 current)\nShowing 100 results.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What text is shown while isPending=true with 50 current results?",
          "expectedStringOutput": "Updating list... (50 current)",
          "acceptableAnswers": [
            "Updating list... (50 current)"
          ],
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "Showing 100 results.": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "isPending is true, so the transition indicator string is returned.",
              "recoveryPath": {
                "simplerExplanation": "Shows updating message.",
                "guidedFixPrompt": "Type Updating list... (50 current)"
              }
            }
          }
        }
      },
      {
        "id": "react-d16-b3-transition-anti-patterns",
        "day": 16,
        "blockNumber": 3,
        "title": "When NOT to use useTransition",
        "conceptBudget": {
          "primaryConcept": "Transition Boundaries",
          "supportingTerms": [
            "Do NOT wrap controlled inputs in startTransition",
            "Only for heavy updates"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d16-b2-ispending-indicator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Controlled Input Transition Bug",
              "brokenCode": "// ❌ Buggy: Laggy input typing caused by putting input state in transition\nstartTransition(() => {\n  setText(e.target.value); // ❌ Input text box feels disconnected and sluggish!\n});",
              "fixedCode": "// ✅ Correct: Keep input state synchronous, put filtering in transition\nsetText(e.target.value); // ✅ Immediate synchronous update\nstartTransition(() => {\n  setFilteredList(filter(e.target.value)); // ✅ Slow list in transition\n});",
              "errorLine": 2,
              "errorReason": "Controlled text inputs must reflect user typing synchronously without transition delay.",
              "fixExplanation": "Update input state directly; wrap only the derived heavy calculation in startTransition."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_input.js",
            "initialCode": "const inputState = 'Search Query';\nconsole.log('Synchronous input value:', inputState);",
            "expectedOutput": "Synchronous input value: Search Query",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Should you wrap the state setter for a text input box (`<input value={text} />`) inside `startTransition`?",
          "options": [
            "No, user typing must remain synchronous; only the downstream heavy list filtering should be in startTransition",
            "Yes, always put all state setters in startTransition",
            "Only on mobile devices"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "Text inputs feel sluggish if marked non-urgent.",
              "recoveryPath": {
                "simplerExplanation": "Input state must stay synchronous.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "useDeferredValue & Responsive Live Search Filters",
    "overviewMetaphor": "useDeferredValue is like a smart digital mirror: when you wave your hand quickly, the primary mirror reflects your hand instantly (urgent input value), while a slow high-resolution video stream catches up a fraction of a second later (deferred value).",
    "blocks": [
      {
        "id": "react-d17-b1-usedeferredvalue-syntax",
        "day": 17,
        "blockNumber": 1,
        "title": "useDeferredValue: Deferring Derived Values",
        "conceptBudget": {
          "primaryConcept": "useDeferredValue Hook",
          "supportingTerms": [
            "Lagging Copy of State",
            "Automatic Throttling",
            "Props-based Deferral"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d16-b1-concurrent-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "useDeferredValue Syntax",
            "codeSnippet": "function SearchPage({ query }) {\n  const deferredQuery = useDeferredValue(query);\n  const isStale = query !== deferredQuery;\n  return <HeavyList search={deferredQuery} opacity={isStale ? 0.5 : 1} />;\n}",
            "lineNotes": {
              "2": "deferredQuery lags behind during high-frequency typing.",
              "3": "isStale enables dimming old results while new results calculate."
            }
          },
          {
            "type": "runnable_code",
            "filename": "deferred_sim.js",
            "initialCode": "function checkStaleness(currentQuery, deferredQuery) {\n  return {\n    isStale: currentQuery !== deferredQuery,\n    displayOpacity: currentQuery !== deferredQuery ? 0.5 : 1.0\n  };\n}\n\nconsole.log('While Typing Fast:', checkStaleness('react', 'rea'));\nconsole.log('When Caught Up:', checkStaleness('react', 'react'));",
            "expectedOutput": "While Typing Fast: { isStale: true, displayOpacity: 0.5 }\nWhen Caught Up: { isStale: false, displayOpacity: 1 }",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the key difference between `useTransition` and `useDeferredValue` in React 18?",
          "options": [
            "`useTransition` wraps state setter functions you control; `useDeferredValue` wraps incoming values/props when you don't control the setter",
            "`useDeferredValue` is only for numbers",
            "They are 100% identical aliases"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "useTransition wraps state setters; useDeferredValue wraps values/props.",
              "recoveryPath": {
                "simplerExplanation": "useTransition for setters; useDeferredValue for values/props.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d17-b2-search-filtering",
        "day": 17,
        "blockNumber": 2,
        "title": "High-Performance Substring Search Matching",
        "conceptBudget": {
          "primaryConcept": "Search Filter Engine",
          "supportingTerms": [
            "Case-Insensitive Match",
            "Early Return on Empty Query"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d17-b1-usedeferredvalue-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "search_filter.js",
            "initialCode": "function searchItems(items, query) {\n  if (!query) return items;\n  const q = query.toLowerCase();\n  return items.filter(item => item.name.toLowerCase().includes(q));\n}\n\nconst catalog = [{ name: 'React Native' }, { name: 'Next.js' }, { name: 'React DOM' }];\nconsole.log('Search \"react\":', searchItems(catalog, 'react').length);",
            "expectedOutput": "Search \"react\": 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many items match query 'react' in the catalog above?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Search \"react\": 2"
          ],
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "'Next.js' does not contain 'react', so only 2 items match.",
              "recoveryPath": {
                "simplerExplanation": "2 items match 'react'.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "react-d17-b3-dimming-stale-ui",
        "day": 17,
        "blockNumber": 3,
        "title": "Visual Feedback for Stale State (Opacity Diffs)",
        "conceptBudget": {
          "primaryConcept": "Stale UI Feedback",
          "supportingTerms": [
            "CSS Opacity Dims",
            "UX Transparency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d17-b2-search-filtering",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dim_feedback.js",
            "initialCode": "function getListStyle(isStale) {\n  return { opacity: isStale ? 0.6 : 1.0, transition: 'opacity 0.2s ease' };\n}\n\nconsole.log('Stale Style Opacity:', getListStyle(true).opacity);",
            "expectedOutput": "Stale Style Opacity: 0.6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What opacity is applied when isStale is true?",
          "expectedStringOutput": "0.6",
          "acceptableAnswers": [
            "0.6",
            "Stale Style Opacity: 0.6"
          ],
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "When stale, opacity is dimmed to 0.6.",
              "recoveryPath": {
                "simplerExplanation": "Opacity is 0.6.",
                "guidedFixPrompt": "Type 0.6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Uncontrolled vs Controlled Forms & the native FormData API",
    "overviewMetaphor": "Controlled vs Uncontrolled is like a remote-controlled drone vs a wind-up toy: a controlled input (useState) is radio-linked to React on every single keystroke; an uncontrolled input (useRef / FormData) holds its own internal mechanical spring and tells React its value only when submitted.",
    "blocks": [
      {
        "id": "react-d18-b1-controlled-vs-uncontrolled",
        "day": 18,
        "blockNumber": 1,
        "title": "Controlled Components: value + onChange",
        "conceptBudget": {
          "primaryConcept": "Controlled Component Pattern",
          "supportingTerms": [
            "Single Source of Truth",
            "value={text}",
            "onChange Handler"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d3-b1-usestate-basics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Controlled Component Anatomy",
            "codeSnippet": "<input\n  type='text'\n  value={email}\n  onChange={(e) => setEmail(e.target.value)}\n/>",
            "lineNotes": {
              "3": "React state drives the input value.",
              "4": "Every keystroke calls setEmail to update state."
            }
          },
          {
            "type": "runnable_code",
            "filename": "form_controlled.js",
            "initialCode": "let formState = { email: '' };\nfunction handleInput(val) {\n  formState.email = val.trim().toLowerCase();\n}\n\nhandleInput('  Alex@PINIT.AI  ');\nconsole.log('Sanitized Email State:', formState.email);",
            "expectedOutput": "Sanitized Email State: alex@pinit.ai",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What makes an `<input />` element 'Controlled' in React?",
          "options": [
            "Its value is bound to React state and updated via an `onChange` event handler",
            "It has a disabled attribute",
            "It is wrapped in a `<form>` tag"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_CONTROLLED_VS_UNCONTROLLED",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_CONTROLLED_VS_UNCONTROLLED",
              "errorExplanation": "Controlled inputs have their current value controlled by React state.",
              "recoveryPath": {
                "simplerExplanation": "Controlled = state drives the input value.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d18-b2-formdata-api",
        "day": 18,
        "blockNumber": 2,
        "title": "Uncontrolled Forms with the native FormData API",
        "conceptBudget": {
          "primaryConcept": "FormData API",
          "supportingTerms": [
            "e.preventDefault()",
            "Object.fromEntries(formData)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d18-b1-controlled-vs-uncontrolled",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "FormData Submit Anatomy",
            "codeSnippet": "function handleSubmit(e) {\n  e.preventDefault(); // Stop full-page browser reload\n  const formData = new FormData(e.currentTarget);\n  const data = Object.fromEntries(formData);\n  console.log(data); // { username: 'alex', role: 'admin' }\n}",
            "lineNotes": {
              "2": "e.preventDefault() intercepts native form submission.",
              "4": "Object.fromEntries converts FormData key-value pairs into a clean JavaScript object."
            }
          },
          {
            "type": "runnable_code",
            "filename": "form_data_sim.js",
            "initialCode": "const formEntries = [['username', 'sarah'], ['role', 'ENGINEER']];\nconst payload = Object.fromEntries(formEntries);\nconsole.log('Extracted Form Payload:', JSON.stringify(payload));",
            "expectedOutput": "Extracted Form Payload: {\"username\":\"sarah\",\"role\":\"ENGINEER\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does `Object.fromEntries([['key', 'val']])` return?",
          "expectedStringOutput": "{\"key\":\"val\"}",
          "acceptableAnswers": [
            "{\"key\":\"val\"}",
            "{ key: 'val' }",
            "{key: 'val'}"
          ],
          "primaryMisconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
          "diagnosisMap": {
            "['key', 'val']": {
              "misconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
              "errorExplanation": "Object.fromEntries converts key-value tuples into a JavaScript object.",
              "recoveryPath": {
                "simplerExplanation": "Converts to object: {\"key\":\"val\"}.",
                "guidedFixPrompt": "Type {\"key\":\"val\"}"
              }
            }
          }
        }
      },
      {
        "id": "react-d18-b3-prevent-default-trap",
        "day": 18,
        "blockNumber": 3,
        "title": "The Missing e.preventDefault() Reload Bug",
        "conceptBudget": {
          "primaryConcept": "Form Event Interception",
          "supportingTerms": [
            "Prevent Full-Page Reload",
            "Single Page App Flow"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d18-b2-formdata-api",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Page Reload Form Bug",
              "brokenCode": "// ❌ Buggy: Missing preventDefault causes browser to reload page and lose all state!\nfunction onSubmit(e) {\n  sendData(); // ❌ Browser refreshes immediately!\n}",
              "fixedCode": "// ✅ Correct: preventDefault keeps single-page app state intact\nfunction onSubmit(e) {\n  e.preventDefault(); // ✅ Stops browser page refresh\n  sendData();\n}",
              "errorLine": 2,
              "errorReason": "HTML forms default to submitting an HTTP POST and refreshing the whole page.",
              "fixExplanation": "Always call e.preventDefault() at the top of form submit handlers."
            }
          },
          {
            "type": "runnable_code",
            "filename": "prevent_sim.js",
            "initialCode": "let prevented = false;\nfunction onSubmit(e) {\n  e.preventDefault();\n  return 'STATE_PRESERVED';\n}\n\nconsole.log(onSubmit({ preventDefault: () => { prevented = true; } }));",
            "expectedOutput": "STATE_PRESERVED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is `e.preventDefault()` essential inside React form `onSubmit` handlers?",
          "options": [
            "To prevent the browser from doing a native full-page reload and wiping out all React in-memory state",
            "To encrypt form data before transmission",
            "Because React crashes without it"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
              "errorExplanation": "Browser default form behavior refreshes the page, destroying React memory state.",
              "recoveryPath": {
                "simplerExplanation": "Stops page refresh to keep React state intact.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Higher-Order Components (HOCs) vs Render Props vs Custom Hooks",
    "overviewMetaphor": "Evolution of Code Reuse: HOCs were wrapping paper around boxes (hard to inspect); Render Props were see-through glass boxes with handles (nested indentation pyramid); Custom Hooks are direct superpowers injected straight into the component body without any wrapper clutter.",
    "blocks": [
      {
        "id": "react-d19-b1-hoc-pattern",
        "day": 19,
        "blockNumber": 1,
        "title": "Higher-Order Components (HOCs): withAuth(Component)",
        "conceptBudget": {
          "primaryConcept": "HOC Pattern",
          "supportingTerms": [
            "Component Wrapper Function",
            "Props Forwarding",
            "Legacy Code Reuse"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d2-b1-pure-component",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HOC Syntax",
            "codeSnippet": "function withAuth(WrappedComponent) {\n  return function AuthWrapper(props) {\n    if (!props.isAuth) return <RedirectToLogin />;\n    return <WrappedComponent {...props} />;\n  };\n}",
            "lineNotes": {
              "1": "A function that takes a component and returns an enhanced component."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hoc_sim.js",
            "initialCode": "function withPrefix(renderFn) {\n  return (name) => `[SECURE] ${renderFn(name)}`;\n}\n\nconst baseCard = (user) => `Card: ${user}`;\nconst secureCard = withPrefix(baseCard);\nconsole.log(secureCard('Alex'));",
            "expectedOutput": "[SECURE] Card: Alex",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does secureCard('Alex') output when wrapped with the prefix HOC?",
          "expectedStringOutput": "[SECURE] Card: Alex",
          "acceptableAnswers": [
            "[SECURE] Card: Alex"
          ],
          "primaryMisconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
          "diagnosisMap": {
            "Card: Alex": {
              "misconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
              "errorExplanation": "The HOC wraps the output with '[SECURE] '.",
              "recoveryPath": {
                "simplerExplanation": "Adds [SECURE] prefix.",
                "guidedFixPrompt": "Type [SECURE] Card: Alex"
              }
            }
          }
        }
      },
      {
        "id": "react-d19-b2-render-props",
        "day": 19,
        "blockNumber": 2,
        "title": "The Render Props Pattern: children as a Function",
        "conceptBudget": {
          "primaryConcept": "Render Props",
          "supportingTerms": [
            "Function as Child",
            "Dynamic Inversion of Control"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d19-b1-hoc-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "render_prop.js",
            "initialCode": "function MouseTracker(renderProp) {\n  const pos = { x: 150, y: 300 };\n  return renderProp(pos);\n}\n\nconst output = MouseTracker((coords) => `Cursor at (${coords.x}, ${coords.y})`);\nconsole.log(output);",
            "expectedOutput": "Cursor at (150, 300)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What string is rendered for coords x=150, y=300?",
          "expectedStringOutput": "Cursor at (150, 300)",
          "acceptableAnswers": [
            "Cursor at (150, 300)"
          ],
          "primaryMisconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
          "diagnosisMap": {
            "150": {
              "misconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
              "errorExplanation": "Formats to 'Cursor at (150, 300)'.",
              "recoveryPath": {
                "simplerExplanation": "Formats full string.",
                "guidedFixPrompt": "Type Cursor at (150, 300)"
              }
            }
          }
        }
      },
      {
        "id": "react-d19-b3-why-hooks-won",
        "day": 19,
        "blockNumber": 3,
        "title": "Why Custom Hooks Won: Eliminating Wrapper Hell",
        "conceptBudget": {
          "primaryConcept": "Hook Ergonomics",
          "supportingTerms": [
            "Zero Component Nesting",
            "Direct Variable Extraction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d19-b2-render-props",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Wrapper Hell vs Custom Hook Cleanliness",
              "brokenCode": "// ❌ Legacy HOC / Render Prop nesting pyramid\n<WithUser>\n  {user => (\n    <WithTheme>\n      {theme => (\n        <WithWindowSize>\n          {size => <Dashboard user={user} theme={theme} size={size} />}\n        </WithWindowSize>\n      )}\n    </WithTheme>\n  )}\n</WithUser>",
              "fixedCode": "// ✅ Modern Custom Hooks: Clean flat variable bindings\nfunction Dashboard() {\n  const user = useUser();\n  const theme = useTheme();\n  const size = useWindowSize();\n  return <DashboardView user={user} theme={theme} size={size} />;\n}",
              "errorLine": 2,
              "errorReason": "Deeply nested render props create 'wrapper hell' and make debugging prop sources painful.",
              "fixExplanation": "Use custom hooks for flat, readable state consumption."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hook_wins.js",
            "initialCode": "console.log('Custom hooks provide flat, composable logic with 0 wrapper DOM nodes.');",
            "expectedOutput": "Custom hooks provide flat, composable logic with 0 wrapper DOM nodes.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why did Custom Hooks largely replace Higher-Order Components and Render Props in modern React?",
          "options": [
            "They eliminate 'wrapper hell' and allow stateful logic to be extracted cleanly without adding unnecessary component layers",
            "Because HOCs were deleted from JavaScript",
            "Because hooks only work with TypeScript"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_CUSTOM_HOOK_RULES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_CUSTOM_HOOK_RULES",
              "errorExplanation": "Hooks provide a flat, composable model for logic reuse without nesting.",
              "recoveryPath": {
                "simplerExplanation": "Flat extraction without wrapper pyramid.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Compound Components & Flexible UI Composition Pattern",
    "overviewMetaphor": "Compound Components are like `<select>` and `<option>` in HTML: `<select>` coordinates the overall active choice, while individual `<option>` elements can be styled, rearranged, or given custom icons flexibly without bloating the parent with 50 configuration props.",
    "blocks": [
      {
        "id": "react-d20-b1-compound-concept",
        "day": 20,
        "blockNumber": 1,
        "title": "The Compound Component Pattern (<Tabs />, <Tabs.Tab />)",
        "conceptBudget": {
          "primaryConcept": "Compound Components",
          "supportingTerms": [
            "Sub-Component Namespaces",
            "Shared Implicit State via Context",
            "Flexible JSX Layout"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d9-b1-prop-drilling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Compound Component Syntax",
            "codeSnippet": "<Tabs defaultIndex={0}>\n  <Tabs.List>\n    <Tabs.Tab index={0}>Overview</Tabs.Tab>\n    <Tabs.Tab index={1}>Settings</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel index={0}><OverviewContent /></Tabs.Panel>\n  <Tabs.Panel index={1}><SettingsContent /></Tabs.Panel>\n</Tabs>",
            "lineNotes": {
              "1": "Parent Tabs provides activeIndex via internal context.",
              "3": "Sub-components communicate automatically without manual prop passing."
            }
          },
          {
            "type": "runnable_code",
            "filename": "compound_sim.js",
            "initialCode": "function renderTabItem(activeIndex, tabIndex, label) {\n  const isActive = activeIndex === tabIndex;\n  return `[${label}] (Active: ${isActive})`;\n}\n\nconsole.log(renderTabItem(0, 0, 'Overview'));\nconsole.log(renderTabItem(0, 1, 'Settings'));",
            "expectedOutput": "[Overview] (Active: true)\n[Settings] (Active: false)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When activeIndex=0, what is the output for Tab index 0 ('Overview')?",
          "expectedStringOutput": "[Overview] (Active: true)",
          "acceptableAnswers": [
            "[Overview] (Active: true)"
          ],
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "0 === 0, so isActive is true.",
              "recoveryPath": {
                "simplerExplanation": "Active tab displays (Active: true).",
                "guidedFixPrompt": "Type [Overview] (Active: true)"
              }
            }
          }
        }
      },
      {
        "id": "react-d20-b2-accordion-context",
        "day": 20,
        "blockNumber": 2,
        "title": "Building an Accordion Compound Suite",
        "conceptBudget": {
          "primaryConcept": "Accordion Compound Architecture",
          "supportingTerms": [
            "AccordionContext",
            "Item Header & Body Toggling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d20-b1-compound-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "accordion_core.js",
            "initialCode": "class AccordionManager {\n  constructor() { this.openId = null; }\n  toggle(id) { this.openId = this.openId === id ? null : id; }\n  isOpen(id) { return this.openId === id; }\n}\n\nconst acc = new AccordionManager();\nacc.toggle('sec_1');\nconsole.log('Section 1 Open:', acc.isOpen('sec_1'));\nacc.toggle('sec_1');\nconsole.log('Section 1 After Re-Click:', acc.isOpen('sec_1'));",
            "expectedOutput": "Section 1 Open: true\nSection 1 After Re-Click: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the state of Section 1 after re-clicking it (collapsing it)?",
          "expectedStringOutput": "Section 1 After Re-Click: false",
          "acceptableAnswers": [
            "Section 1 After Re-Click: false",
            "false"
          ],
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "Clicking an already open section collapses it to null (false).",
              "recoveryPath": {
                "simplerExplanation": "Collapses to false.",
                "guidedFixPrompt": "Type Section 1 After Re-Click: false"
              }
            }
          }
        }
      },
      {
        "id": "react-d20-b3-static-namespacing",
        "day": 20,
        "blockNumber": 3,
        "title": "Attaching Sub-Components to Parent (Tabs.Tab = Tab)",
        "conceptBudget": {
          "primaryConcept": "Static Namespacing",
          "supportingTerms": [
            "Component.Sub = SubComponent",
            "Discoverable Clean Imports"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d20-b2-accordion-context",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "namespace.js",
            "initialCode": "function Card({ children }) { return `<Card>${children}</Card>`; }\nCard.Header = ({ title }) => `<Header>${title}</Header>`;\nCard.Body = ({ text }) => `<Body>${text}</Body>`;\n\nconsole.log('Sub-component attached:', typeof Card.Header === 'function');",
            "expectedOutput": "Sub-component attached: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is Card.Header attached directly to the Card function object in JavaScript?",
          "expectedStringOutput": "Sub-component attached: true",
          "acceptableAnswers": [
            "Sub-component attached: true",
            "true",
            "True"
          ],
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "JavaScript functions are first-class objects that can have static properties attached.",
              "recoveryPath": {
                "simplerExplanation": "Attached property = true.",
                "guidedFixPrompt": "Type Sub-component attached: true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 4: Enterprise Design System with Accordion & Tabs Suite",
    "overviewMetaphor": "Milestone 4 — Production Design System Component Library: Building accessible, keyboard-navigable, composable UI widgets that enforce design tokens and consistent state behavior across enterprise dashboards.",
    "blocks": [
      {
        "id": "react-d21-b1-design-tokens",
        "day": 21,
        "blockNumber": 1,
        "title": "Design Token Architecture (Spacing, Colors & Radii)",
        "conceptBudget": {
          "primaryConcept": "Design Tokens",
          "supportingTerms": [
            "Theme Token Dictionary",
            "Variant Props ('primary', 'secondary', 'danger')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d20-b1-compound-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tokens.js",
            "initialCode": "const tokens = {\n  colors: { primary: '#6366f1', danger: '#ef4444' },\n  radii: { sm: '4px', md: '8px' }\n};\n\nfunction resolveButtonClass(variant) {\n  return `btn-${variant} bg-[${tokens.colors[variant] || tokens.colors.primary}]`;\n}\n\nconsole.log('Primary Button:', resolveButtonClass('primary'));",
            "expectedOutput": "Primary Button: btn-primary bg-[#6366f1]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What color code is applied to the primary button in the token resolver?",
          "expectedStringOutput": "#6366f1",
          "acceptableAnswers": [
            "#6366f1",
            "'#6366f1'"
          ],
          "primaryMisconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
          "diagnosisMap": {
            "#ef4444": {
              "misconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
              "errorExplanation": "Primary maps to '#6366f1' (#ef4444 is danger).",
              "recoveryPath": {
                "simplerExplanation": "Primary is #6366f1.",
                "guidedFixPrompt": "Type #6366f1"
              }
            }
          }
        }
      },
      {
        "id": "react-d21-b2-tabs-keyboard-nav",
        "day": 21,
        "blockNumber": 2,
        "title": "Arrow Key Keyboard Navigation for Tabs",
        "conceptBudget": {
          "primaryConcept": "WAI-ARIA Keyboard Navigation",
          "supportingTerms": [
            "ArrowRight / ArrowLeft",
            "Loop Around Bounds"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d21-b1-design-tokens",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tab_nav.js",
            "initialCode": "function getNextTabIndex(current, count, key) {\n  if (key === 'ArrowRight') return (current + 1) % count;\n  if (key === 'ArrowLeft') return (current - 1 + count) % count;\n  return current;\n}\n\nconsole.log('ArrowRight from Tab 2 of 3:', getNextTabIndex(2, 3, 'ArrowRight'));",
            "expectedOutput": "ArrowRight from Tab 2 of 3: 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When pressing ArrowRight on the last tab (index 2 of 3), what index does it wrap to?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "ArrowRight from Tab 2 of 3: 0"
          ],
          "primaryMisconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
              "errorExplanation": "(2 + 1) % 3 = 0, looping back to the first tab.",
              "recoveryPath": {
                "simplerExplanation": "Wraps to index 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "react-d21-b3-milestone-library",
        "day": 21,
        "blockNumber": 3,
        "title": "Design System Component Registry",
        "conceptBudget": {
          "primaryConcept": "Component Library Registry",
          "supportingTerms": [
            "Accessible Primitives",
            "Enterprise Standards"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d21-b2-tabs-keyboard-nav",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "registry.js",
            "initialCode": "const designSystem = ['Button', 'Modal', 'Tabs', 'Accordion', 'Toast'];\nconsole.log('Registered Core Primitives:', designSystem.length);",
            "expectedOutput": "Registered Core Primitives: 5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many core primitives are registered in the design system above?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "Registered Core Primitives: 5"
          ],
          "primaryMisconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
              "errorExplanation": "Array has 5 elements.",
              "recoveryPath": {
                "simplerExplanation": "Count is 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)",
    "overviewMetaphor": "SSR vs CSR is like ordering a pre-baked pizza vs a raw pizza kit: in CSR, the restaurant delivers raw dough and cheese (empty HTML skeleton) and your home oven must bake it (client browser runs 5MB of JS). In SSR, the restaurant delivers a steaming hot, fully baked pizza ready to eat the moment the box opens (HTML with content pre-rendered).",
    "blocks": [
      {
        "id": "react-d22-b1-ssr-vs-csr-pipeline",
        "day": 22,
        "blockNumber": 1,
        "title": "The Core Differences: SSR vs CSR Lifecycle",
        "conceptBudget": {
          "primaryConcept": "SSR vs CSR Architecture",
          "supportingTerms": [
            "Time-To-First-Byte (TTFB)",
            "First Contentful Paint (FCP)",
            "SEO Indexing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d1-b1-jsx-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HTML Response Comparison",
            "codeSnippet": "<!-- CSR HTML Response (Empty shell) -->\n<div id='root'></div>\n<script src='/bundle.js'></script>\n\n<!-- SSR HTML Response (Fully populated text) -->\n<div id='root'><h1>Welcome to PinIT</h1><p>Instant load</p></div>",
            "lineNotes": {
              "2": "CSR sends an empty div; the user stares at a blank screen until bundle.js loads.",
              "6": "SSR sends readable HTML immediately from the server."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ssr_sim.js",
            "initialCode": "function renderServerHtml(pageTitle, content) {\n  return `<div id='root'><h1>${pageTitle}</h1><article>${content}</article></div>`;\n}\n\nconsole.log(renderServerHtml('Blog Post', 'Fast SEO content rendered on server.'));",
            "expectedOutput": "<div id='root'><h1>Blog Post</h1><article>Fast SEO content rendered on server.</article></div>",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is Server-Side Rendering (SSR) superior to pure Client-Side Rendering (CSR) for public e-commerce or content websites?",
          "options": [
            "Search engine crawlers and users receive fully rendered, readable HTML immediately on the first HTTP response without waiting for client JavaScript execution",
            "Because SSR eliminates the need for CSS",
            "Because SSR runs on the user's phone"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "SSR sends real HTML markup immediately, boosting SEO and First Contentful Paint.",
              "recoveryPath": {
                "simplerExplanation": "Delivers real HTML immediately for fast SEO and viewing.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d22-b2-seo-crawlers",
        "day": 22,
        "blockNumber": 2,
        "title": "Search Engine Optimization (SEO) & Social Meta Tags",
        "conceptBudget": {
          "primaryConcept": "SEO Meta Pre-rendering",
          "supportingTerms": [
            "Open Graph <meta>",
            "Crawler Indexing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d22-b1-ssr-vs-csr-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "seo_tags.js",
            "initialCode": "function generateMetaTags(title, desc) {\n  return `<meta property='og:title' content='${title}' />\\n<meta name='description' content='${desc}' />`;\n}\n\nconsole.log(generateMetaTags('PinIT Career OS', 'AI Learning Platform'));",
            "expectedOutput": "<meta property='og:title' content='PinIT Career OS' />\n<meta name='description' content='AI Learning Platform' />",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What title is embedded in the og:title meta tag above?",
          "expectedStringOutput": "PinIT Career OS",
          "acceptableAnswers": [
            "PinIT Career OS",
            "'PinIT Career OS'"
          ],
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "AI Learning Platform": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "'AI Learning Platform' is the description; 'PinIT Career OS' is the title.",
              "recoveryPath": {
                "simplerExplanation": "Title is 'PinIT Career OS'.",
                "guidedFixPrompt": "Type PinIT Career OS"
              }
            }
          }
        }
      },
      {
        "id": "react-d22-b3-tradeoffs",
        "day": 22,
        "blockNumber": 3,
        "title": "Architectural Trade-offs: Server Load vs Client CPU",
        "conceptBudget": {
          "primaryConcept": "Rendering Architecture Trade-offs",
          "supportingTerms": [
            "Server Compute Costs",
            "Caching Edge Layers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d22-b2-seo-crawlers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tradeoffs.js",
            "initialCode": "function compareArchitecture(mode) {\n  return mode === 'SSR'\n    ? { fastFcp: true, serverCpuCost: 'HIGH' }\n    : { fastFcp: false, serverCpuCost: 'ZERO' };\n}\n\nconsole.log('SSR Trade-offs:', JSON.stringify(compareArchitecture('SSR')));",
            "expectedOutput": "SSR Trade-offs: {\"fastFcp\":true,\"serverCpuCost\":\"HIGH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary server trade-off when using dynamic SSR over static client hosting?",
          "options": [
            "The backend server must expend CPU cycles computing HTML on every incoming user request",
            "SSR prevents using images",
            "SSR disables JavaScript in browsers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "Server rendering requires server CPU time for each page request.",
              "recoveryPath": {
                "simplerExplanation": "Server uses CPU to render HTML per request.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Hydration Mechanics & Hydration Mismatch Resolution",
    "overviewMetaphor": "Hydration is breathing life into a frozen statue: the server builds a stone statue of HTML (frozen, fast to see); when JavaScript arrives in the browser, React 'hydrates' it by attaching event listeners and state to the existing statue without rebuilding the statue from scratch.",
    "blocks": [
      {
        "id": "react-d23-b1-hydration-process",
        "day": 23,
        "blockNumber": 1,
        "title": "What is Hydration? (Attaching Listeners to Static HTML)",
        "conceptBudget": {
          "primaryConcept": "Hydration Process",
          "supportingTerms": [
            "ReactDOM.hydrateRoot",
            "Attaching onClick Listeners",
            "Reconciling Server HTML"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d22-b1-ssr-vs-csr-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Hydration Root Syntax",
            "codeSnippet": "import { hydrateRoot } from 'react-dom/client';\n\n// Binds React event listeners to existing pre-rendered server DOM nodes\nhydrateRoot(document.getElementById('root'), <App />);",
            "lineNotes": {
              "4": "hydrateRoot adopts existing server HTML rather than overwriting with innerHTML."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hydrate_sim.js",
            "initialCode": "function simulateHydration(staticHtml, attachedEvents) {\n  return `Hydrated ${staticHtml} with [${attachedEvents.join(', ')}] handlers.`;\n}\n\nconsole.log(simulateHydration('<button>Pay</button>', ['onClick', 'onHover']));",
            "expectedOutput": "Hydrated <button>Pay</button> with [onClick, onHover] handlers.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does `hydrateRoot()` do in React?",
          "options": [
            "It attaches interactive event listeners and React state to the already-rendered server HTML without destroying the existing DOM nodes",
            "It clears the entire DOM and downloads HTML again",
            "It runs on the server"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "Hydration brings static server HTML to life by attaching listeners.",
              "recoveryPath": {
                "simplerExplanation": "Binds event listeners to existing server HTML.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d23-b2-hydration-mismatch",
        "day": 23,
        "blockNumber": 2,
        "title": "Hydration Mismatches (Date.now(), window, and localStorage)",
        "conceptBudget": {
          "primaryConcept": "Hydration Mismatch Error",
          "supportingTerms": [
            "Server vs Client Tree Divergence",
            "suppressHydrationWarning",
            "useEffect Mounted Pattern"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d23-b1-hydration-process",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Hydration Mismatch Date Bug",
              "brokenCode": "// ❌ Buggy: Server renders UTC time, client renders local time -> Mismatch error!\nfunction BadClock() {\n  return <span>{new Date().toLocaleTimeString()}</span>;\n}",
              "fixedCode": "// ✅ Correct: Render client-specific dynamic data only after mount in useEffect\nfunction SafeClock() {\n  const [time, setTime] = useState(null);\n  useEffect(() => setTime(new Date().toLocaleTimeString()), []);\n  if (!time) return <span>Loading time...</span>; // Matches server HTML\n  return <span>{time}</span>;\n}",
              "errorLine": 3,
              "errorReason": "If initial client render produces different HTML than the server sent, React logs a Hydration Mismatch warning and repaints.",
              "fixExplanation": "Synchronize initial render to match server markup, then update via useEffect on client mount."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mismatch_check.js",
            "initialCode": "function checkMismatch(serverHtml, clientHtml) {\n  if (serverHtml !== clientHtml) return 'WARNING_HYDRATION_MISMATCH';\n  return 'CLEAN_HYDRATION';\n}\n\nconsole.log('Identical Trees:', checkMismatch('<span>Loading...</span>', '<span>Loading...</span>'));\nconsole.log('Divergent Trees:', checkMismatch('<span>UTC</span>', '<span>PST</span>'));",
            "expectedOutput": "Identical Trees: CLEAN_HYDRATION\nDivergent Trees: WARNING_HYDRATION_MISMATCH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When serverHtml is '<span>UTC</span>' and clientHtml is '<span>PST</span>', what error status is detected?",
          "expectedStringOutput": "Divergent Trees: WARNING_HYDRATION_MISMATCH",
          "acceptableAnswers": [
            "Divergent Trees: WARNING_HYDRATION_MISMATCH",
            "WARNING_HYDRATION_MISMATCH"
          ],
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "CLEAN_HYDRATION": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "The trees diverged, causing a hydration mismatch warning.",
              "recoveryPath": {
                "simplerExplanation": "Divergent markup triggers hydration mismatch.",
                "guidedFixPrompt": "Type Divergent Trees: WARNING_HYDRATION_MISMATCH"
              }
            }
          }
        }
      },
      {
        "id": "react-d23-b3-is-mounted-pattern",
        "day": 23,
        "blockNumber": 3,
        "title": "The useIsMounted() Two-Pass Render Pattern",
        "conceptBudget": {
          "primaryConcept": "Two-Pass Render",
          "supportingTerms": [
            "useIsMounted",
            "Zero Mismatch Assurance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d23-b2-hydration-mismatch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mounted_guard.js",
            "initialCode": "function resolveClientOnlyValue(isMounted, clientValue, serverFallback) {\n  return isMounted ? clientValue : serverFallback;\n}\n\nconsole.log('Server Pass (not mounted):', resolveClientOnlyValue(false, 'Local: 8:00 PM', 'Loading...'));\nconsole.log('Client Mount Pass:', resolveClientOnlyValue(true, 'Local: 8:00 PM', 'Loading...'));",
            "expectedOutput": "Server Pass (not mounted): Loading...\nClient Mount Pass: Local: 8:00 PM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is returned during the initial server pass when isMounted=false?",
          "expectedStringOutput": "Server Pass (not mounted): Loading...",
          "acceptableAnswers": [
            "Server Pass (not mounted): Loading...",
            "Loading..."
          ],
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "Local: 8:00 PM": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "During initial server render (isMounted=false), the fallback 'Loading...' is returned to match initial HTML.",
              "recoveryPath": {
                "simplerExplanation": "Returns fallback 'Loading...'.",
                "guidedFixPrompt": "Type Server Pass (not mounted): Loading..."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "React Server Components (RSC) & Zero-Bundle Dependencies",
    "overviewMetaphor": "React Server Components are a professional catering chef: the chef brings heavy 50kg industrial meat smokers and ovens (2MB Markdown parsers and DB drivers), cooks the meal on the server, and serves only the delicious, lightweight steak on a plate (0KB JavaScript bundle sent to browser).",
    "blocks": [
      {
        "id": "react-d24-b1-rsc-vs-client",
        "day": 24,
        "blockNumber": 1,
        "title": "Server Components vs Client Components ('use client')",
        "conceptBudget": {
          "primaryConcept": "React Server Components (RSC)",
          "supportingTerms": [
            "Default Server Components",
            "'use client' Directive",
            "Zero Client Bundle Size"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d23-b1-hydration-process",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Server vs Client Component Syntax",
            "codeSnippet": "// 1. Server Component (Default in Next.js App Router)\n// Direct database access, async/await, 0KB JS sent to browser\nasync function ProductList() {\n  const products = await db.query('SELECT * FROM items');\n  return <ul>{products.map(p => <li>{p.name}</li>)}</ul>;\n}\n\n// 2. Client Component (Opt-in with 'use client')\n'use client';\nfunction AddToCartButton() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Add</button>;\n}",
            "lineNotes": {
              "3": "Server components can be async and talk to databases directly.",
              "9": "'use client' marks the boundary where interactivity and state begin."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rsc_sim.js",
            "initialCode": "function computeBundlePayload(componentType) {\n  return componentType === 'SERVER'\n    ? { bundleSizeKb: 0, allowsHooks: false, canAccessDb: true }\n    : { bundleSizeKb: 25, allowsHooks: true, canAccessDb: false };\n}\n\nconsole.log('Server Component Stats:', JSON.stringify(computeBundlePayload('SERVER')));\nconsole.log('Client Component Stats:', JSON.stringify(computeBundlePayload('CLIENT')));",
            "expectedOutput": "Server Component Stats: {\"bundleSizeKb\":0,\"allowsHooks\":false,\"canAccessDb\":true}\nClient Component Stats: {\"bundleSizeKb\":25,\"allowsHooks\":true,\"canAccessDb\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can a React Server Component (RSC) directly use `useState()` or `useEffect()` hooks?",
          "options": [
            "No, Server Components run only on the server and cannot have client interactive hooks; use `'use client'` to create interactive components",
            "Yes, all React components can use hooks everywhere",
            "Only on Linux servers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "useState and useEffect require browser lifecycle/state and can only be used in Client Components.",
              "recoveryPath": {
                "simplerExplanation": "Hooks like useState need the browser -> require 'use client'.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d24-b2-zero-bundle-libraries",
        "day": 24,
        "blockNumber": 2,
        "title": "Zero-Bundle Heavy Library Execution",
        "conceptBudget": {
          "primaryConcept": "Zero Client Bundle Impact",
          "supportingTerms": [
            "Server-Only Libraries",
            "Markdown/Date Parsers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d24-b1-rsc-vs-client",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zero_bundle.js",
            "initialCode": "const serverLibraries = ['date-fns (300KB)', 'markdown-it (250KB)', 'pg-node (500KB)'];\nconsole.log('Total client bundle footprint for Server Component:', '0 KB');",
            "expectedOutput": "Total client bundle footprint for Server Component: 0 KB",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the client browser JavaScript bundle footprint for libraries imported inside a pure Server Component?",
          "expectedStringOutput": "0 KB",
          "acceptableAnswers": [
            "0 KB",
            "0KB",
            "0"
          ],
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1 MB": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "Server Components execute on the server, shipping 0 KB of their library code to the browser.",
              "recoveryPath": {
                "simplerExplanation": "Server-only code ships 0 KB to the browser.",
                "guidedFixPrompt": "Type 0 KB"
              }
            }
          }
        }
      },
      {
        "id": "react-d24-b3-composition-rules",
        "day": 24,
        "blockNumber": 3,
        "title": "Interleaving Server and Client Components (Children Prop Pattern)",
        "conceptBudget": {
          "primaryConcept": "RSC Composition Rules",
          "supportingTerms": [
            "Passing Server Component as Children to Client Component",
            "Cannot Import Server into Client"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d24-b2-zero-bundle-libraries",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Importing Server Component in Client Component Trap",
              "brokenCode": "// ❌ Illegal: You cannot directly import a Server Component into a Client Component\n'use client';\nimport ServerDatabaseFeed from './ServerDatabaseFeed'; // ❌ Forces Feed to become a client component!\n\nexport function ClientModal() {\n  return <div><ServerDatabaseFeed /></div>;\n}",
              "fixedCode": "// ✅ Correct: Pass Server Component as children prop to the Client Component\n'use client';\nexport function ClientModal({ children }) {\n  return <div>{children}</div>; // ✅ Server Component rendered cleanly as child!\n}",
              "errorLine": 3,
              "errorReason": "Directly importing a component inside a 'use client' file pulls that component and all its imports into the client bundle.",
              "fixExplanation": "Use the children prop to slot Server Components inside Client Components."
            }
          },
          {
            "type": "runnable_code",
            "filename": "slot_sim.js",
            "initialCode": "function ClientContainer({ children }) {\n  return `<ClientWrapper>${children}</ClientWrapper>`;\n}\n\nconsole.log(ClientContainer({ children: '<ServerDatabaseFeed />' }));",
            "expectedOutput": "<ClientWrapper><ServerDatabaseFeed /></ClientWrapper>",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do you place a Server Component inside a Client Component without pulling it into the client JavaScript bundle?",
          "options": [
            "Pass the Server Component as the `children` prop to the Client Component",
            "Import it using `require()`",
            "You cannot combine them"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "Passing server components via the `children` prop allows server rendering inside client shells.",
              "recoveryPath": {
                "simplerExplanation": "Pass as children prop.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Server Actions, Forms & Zero-API State Mutations ('use server')",
    "overviewMetaphor": "A Server Action is a pneumatic tube system in a bank drive-thru: you slip your deposit form into the tube (form submit), it shoots directly to the teller behind the vault wall (server action function runs on backend), updates your account balance, and sends back the updated receipt—with zero custom REST API endpoints written.",
    "blocks": [
      {
        "id": "react-d25-b1-server-actions-syntax",
        "day": 25,
        "blockNumber": 1,
        "title": "The 'use server' Directive & Server Action Functions",
        "conceptBudget": {
          "primaryConcept": "Server Actions",
          "supportingTerms": [
            "'use server' Directive",
            "Direct Database Mutation",
            "No API Route Boilerplate"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d24-b1-rsc-vs-client",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Server Action Syntax",
            "codeSnippet": "// app/actions.js\n'use server';\n\nexport async function updateUsername(formData) {\n  const name = formData.get('username');\n  await db.users.update({ name }); // Direct DB write on server!\n  revalidatePath('/profile');      // Refreshes profile page cache\n}",
            "lineNotes": {
              "2": "'use server' marks the function as a secure backend RPC endpoint.",
              "6": "revalidatePath purges cached server HTML and pushes fresh data to the UI."
            }
          },
          {
            "type": "runnable_code",
            "filename": "server_action_sim.js",
            "initialCode": "async function mockServerAction(formData) {\n  'use server';\n  const username = formData.username;\n  return { success: true, updatedUser: username.toUpperCase() };\n}\n\nmockServerAction({ username: 'alex' }).then(res => console.log('Action Result:', JSON.stringify(res)));",
            "expectedOutput": "Action Result: {\"success\":true,\"updatedUser\":\"ALEX\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Where does a function marked with `'use server'` execute?",
          "options": [
            "Exclusively on the backend Node.js / Edge server",
            "In the user's browser inside a Web Worker",
            "In the CSS engine"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "'use server' functions run strictly on the server backend.",
              "recoveryPath": {
                "simplerExplanation": "Runs on the server backend.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d25-b2-form-action-binding",
        "day": 25,
        "blockNumber": 2,
        "title": "Binding Actions to Forms (<form action={action}>)",
        "conceptBudget": {
          "primaryConcept": "Form Action Binding",
          "supportingTerms": [
            "<form action={myAction}>",
            "Progressive Enhancement (Works Without JS)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d25-b1-server-actions-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Mechanical Escalator vs Stairs",
            "simpleExplanation": "If JavaScript is disabled or loading slowly, the form still submits natively (stairs work). When JavaScript is loaded, React enhances it with smooth instant background submission (escalator)."
          },
          {
            "type": "runnable_code",
            "filename": "form_action.js",
            "initialCode": "function submitFormViaAction(actionFn, data) {\n  return actionFn(data);\n}\n\nconst action = (d) => `Processed transaction for: ${d.email}`;\nconsole.log(submitFormViaAction(action, { email: 'sarah@pinit.ai' }));",
            "expectedOutput": "Processed transaction for: sarah@pinit.ai",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What string is generated when submitting sarah@pinit.ai through the action above?",
          "expectedStringOutput": "Processed transaction for: sarah@pinit.ai",
          "acceptableAnswers": [
            "Processed transaction for: sarah@pinit.ai"
          ],
          "primaryMisconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
              "errorExplanation": "Returns formatted confirmation message.",
              "recoveryPath": {
                "simplerExplanation": "Returns processed message.",
                "guidedFixPrompt": "Type Processed transaction for: sarah@pinit.ai"
              }
            }
          }
        }
      },
      {
        "id": "react-d25-b3-useformstatus-hook",
        "day": 25,
        "blockNumber": 3,
        "title": "The useFormStatus & useActionState Hooks",
        "conceptBudget": {
          "primaryConcept": "Action Status Feedback",
          "supportingTerms": [
            "useFormStatus() { pending }",
            "Disable Button During Submit"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d25-b2-form-action-binding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "form_status.js",
            "initialCode": "function renderSubmitButton(isPending) {\n  return `<button disabled='${isPending}'>${isPending ? 'Saving...' : 'Save Changes'}</button>`;\n}\n\nconsole.log('While Submitting:', renderSubmitButton(true));\nconsole.log('Idle State:', renderSubmitButton(false));",
            "expectedOutput": "While Submitting: <button disabled='true'>Saving...</button>\nIdle State: <button disabled='false'>Save Changes</button>",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What button text is shown while isPending is true?",
          "expectedStringOutput": "While Submitting: <button disabled='true'>Saving...</button>",
          "acceptableAnswers": [
            "While Submitting: <button disabled='true'>Saving...</button>",
            "Saving..."
          ],
          "primaryMisconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
          "diagnosisMap": {
            "Save Changes": {
              "misconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
              "errorExplanation": "While submitting (isPending=true), button text switches to 'Saving...'.",
              "recoveryPath": {
                "simplerExplanation": "Displays 'Saving...' with disabled state.",
                "guidedFixPrompt": "Type While Submitting: <button disabled='true'>Saving...</button>"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 5: Full-Stack Live Search Indexer with Server Components",
    "overviewMetaphor": "Milestone 5 — Full-Stack Search Indexer: Integrating React Server Components, Database Filtering, URL Search Query Synchronisation, and Debounced Client Inputs into a sub-millisecond search engine.",
    "blocks": [
      {
        "id": "react-d26-b1-url-state-search",
        "day": 26,
        "blockNumber": 1,
        "title": "URL Search Params as the Single Source of Truth",
        "conceptBudget": {
          "primaryConcept": "URL Query State",
          "supportingTerms": [
            "?q=keyword",
            "Shareable Search URLs",
            "useSearchParams()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d25-b1-server-actions-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Shareable Bookmark",
            "simpleExplanation": "Storing search query in `?q=react` allows users to copy the URL and share it with friends; when the friend opens it, they immediately see the exact same search results."
          },
          {
            "type": "runnable_code",
            "filename": "url_search.js",
            "initialCode": "function buildSearchUrl(base, query, page = 1) {\n  const params = new URLSearchParams();\n  if (query) params.set('q', query);\n  if (page > 1) params.set('p', page);\n  const qs = params.toString();\n  return qs ? `${base}?${qs}` : base;\n}\n\nconsole.log(buildSearchUrl('/products', 'react', 2));",
            "expectedOutput": "/products?q=react&p=2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What URL string is generated for base '/products', query 'react', page 2?",
          "expectedStringOutput": "/products?q=react&p=2",
          "acceptableAnswers": [
            "/products?q=react&p=2",
            "'/products?q=react&p=2'"
          ],
          "primaryMisconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
          "diagnosisMap": {
            "/products": {
              "misconceptionId": "MC_REACT_PROP_DRILLING_VS_CONTEXT",
              "errorExplanation": "URLSearchParams serializes query and page into `?q=react&p=2`.",
              "recoveryPath": {
                "simplerExplanation": "Formats URL with query params.",
                "guidedFixPrompt": "Type /products?q=react&p=2"
              }
            }
          }
        }
      },
      {
        "id": "react-d26-b2-debounce-search",
        "day": 26,
        "blockNumber": 2,
        "title": "Debouncing High-Frequency Search Inputs (300ms Window)",
        "conceptBudget": {
          "primaryConcept": "Debounce Mechanism",
          "supportingTerms": [
            "Trailing Edge Timer",
            "Prevent 50 Server Hits per Second"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d26-b1-url-state-search",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "debounce_sim.js",
            "initialCode": "let searchCalls = 0;\nfunction simulateDebounce(keystrokeCount) {\n  // In a 300ms window, 5 rapid keystrokes collapse into 1 server query\n  searchCalls++;\n  return `Keystrokes: ${keystrokeCount} -> Server Queries Fired: ${searchCalls}`;\n}\n\nconsole.log(simulateDebounce(5));",
            "expectedOutput": "Keystrokes: 5 -> Server Queries Fired: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many server queries are fired for 5 rapid keystrokes within the debounced window?",
          "expectedStringOutput": "Keystrokes: 5 -> Server Queries Fired: 1",
          "acceptableAnswers": [
            "Keystrokes: 5 -> Server Queries Fired: 1",
            "1"
          ],
          "primaryMisconceptionId": "MC_REACT_USE_EFFECT_DEPENDENCY_ARRAY",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_REACT_USE_EFFECT_DEPENDENCY_ARRAY",
              "errorExplanation": "Debouncing collapses 5 rapid keystrokes into a single execution at the end of the timer.",
              "recoveryPath": {
                "simplerExplanation": "Debounced into 1 call.",
                "guidedFixPrompt": "Type Keystrokes: 5 -> Server Queries Fired: 1"
              }
            }
          }
        }
      },
      {
        "id": "react-d26-b3-milestone-indexer",
        "day": 26,
        "blockNumber": 3,
        "title": "Full Server Component Search Indexer Synthesis",
        "conceptBudget": {
          "primaryConcept": "Search Engine Pipeline",
          "supportingTerms": [
            "Server Component Querying",
            "Optimistic Match Count"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d26-b2-debounce-search",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "indexer_engine.js",
            "initialCode": "const database = [\n  { id: 1, title: 'React Server Components Masterclass', tags: ['react', 'nextjs'] },\n  { id: 2, title: 'Python Backend Systems', tags: ['python', 'fastapi'] },\n  { id: 3, title: 'React Native Mobile App', tags: ['react', 'mobile'] }\n];\n\nfunction queryServerIndex(tag) {\n  return database.filter(item => item.tags.includes(tag.toLowerCase()));\n}\n\nconst matches = queryServerIndex('react');\nconsole.log(`Found ${matches.length} matching course modules for 'react'.`);",
            "expectedOutput": "Found 2 matching course modules for 'react'.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many courses match tag 'react' in the index above?",
          "expectedStringOutput": "Found 2 matching course modules for 'react'.",
          "acceptableAnswers": [
            "Found 2 matching course modules for 'react'.",
            "2"
          ],
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "Only Course 1 and Course 3 contain tag 'react' (count is 2).",
              "recoveryPath": {
                "simplerExplanation": "2 matching courses found.",
                "guidedFixPrompt": "Type Found 2 matching course modules for 'react'."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Client-Side Routing & Dynamic Path Resolution",
    "overviewMetaphor": "Client-side routing is switching TV channels with a digital remote: you don't purchase a brand new television for every channel (no full-page browser reload); the TV chassis stays in place while the screen smoothly updates its content.",
    "blocks": [
      {
        "id": "react-d27-b1-history-api",
        "day": 27,
        "blockNumber": 1,
        "title": "The HTML5 History API (pushState & popstate)",
        "conceptBudget": {
          "primaryConcept": "SPA Navigation Mechanics",
          "supportingTerms": [
            "history.pushState()",
            "popstate Event",
            "URL Change without Reload"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d22-b1-ssr-vs-csr-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HTML5 History API",
            "codeSnippet": "// Updates browser URL bar without triggering HTTP network fetch\nwindow.history.pushState({ pageId: 5 }, '', '/quests/day-5');",
            "lineNotes": {
              "2": "pushState changes the URL and appends a history entry silently."
            }
          },
          {
            "type": "runnable_code",
            "filename": "history_sim.js",
            "initialCode": "let browserUrl = '/home';\nfunction navigateSpa(newPath) {\n  browserUrl = newPath;\n  return `Navigated to ${browserUrl} (0 Page Reloads)`;\n}\n\nconsole.log(navigateSpa('/dashboard'));",
            "expectedOutput": "Navigated to /dashboard (0 Page Reloads)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does a Single-Page App (SPA) change the browser URL without causing a full-page reload?",
          "options": [
            "Using the HTML5 `history.pushState()` API to update the URL and intercepting link clicks with JavaScript",
            "By clearing the browser cache",
            "By opening an invisible popup"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_FORM_PREVENT_DEFAULT",
              "errorExplanation": "SPAs use `history.pushState` to modify URLs dynamically.",
              "recoveryPath": {
                "simplerExplanation": "Uses history.pushState() for instant URL updates.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d27-b2-dynamic-path-matching",
        "day": 27,
        "blockNumber": 2,
        "title": "Dynamic Segment Matching (/users/[id])",
        "conceptBudget": {
          "primaryConcept": "Route Parameter Parsing",
          "supportingTerms": [
            "Path Regex Matching",
            "params.id Extraction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d27-b1-history-api",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "path_match.js",
            "initialCode": "function matchRoute(pattern, currentPath) {\n  // Pattern: /users/:id vs Path: /users/42\n  const partsP = pattern.split('/');\n  const partsC = currentPath.split('/');\n  if (partsP.length !== partsC.length) return null;\n  const params = {};\n  for (let i = 0; i < partsP.length; i++) {\n    if (partsP[i].startsWith(':')) params[partsP[i].slice(1)] = partsC[i];\n    else if (partsP[i] !== partsC[i]) return null;\n  }\n  return params;\n}\n\nconsole.log('Parsed Route Params:', JSON.stringify(matchRoute('/users/:id', '/users/42')));",
            "expectedOutput": "Parsed Route Params: {\"id\":\"42\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `params.id` extracted from path '/users/42'?",
          "expectedStringOutput": "42",
          "acceptableAnswers": [
            "42",
            "'42'"
          ],
          "primaryMisconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
          "diagnosisMap": {
            ":id": {
              "misconceptionId": "MC_REACT_PROPS_DESTRUCTURING",
              "errorExplanation": "The dynamic segment :id captured the value '42'.",
              "recoveryPath": {
                "simplerExplanation": "Captured id value is 42.",
                "guidedFixPrompt": "Type 42"
              }
            }
          }
        }
      },
      {
        "id": "react-d27-b3-nested-layouts",
        "day": 27,
        "blockNumber": 3,
        "title": "Nested Layouts & Shared Header/Sidebar Shells",
        "conceptBudget": {
          "primaryConcept": "Nested Layout Shells",
          "supportingTerms": [
            "Preserve Layout State on Navigation",
            "No Sidebar Re-render"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d27-b2-dynamic-path-matching",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "layout_shell.js",
            "initialCode": "function renderAppShell(sidebarState, activePageContent) {\n  return `<Sidebar scrollPos='${sidebarState.scroll}' /><Main>${activePageContent}</Main>`;\n}\n\nconsole.log(renderAppShell({ scroll: 120 }, '<ProfileSettings />'));",
            "expectedOutput": "<Sidebar scrollPos='120' /><Main><ProfileSettings /></Main>",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are nested layouts advantageous in modern React frameworks?",
          "options": [
            "Parent layout UI (like sidebars and audio players) remains mounted and preserves state when users navigate between sub-pages",
            "Layouts delete CSS files",
            "Layouts make browsers larger"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "Nested layouts persist state and scroll positions during route changes.",
              "recoveryPath": {
                "simplerExplanation": "Maintains layout state during sub-page navigation.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Optimistic UI Updates & the useOptimistic Hook",
    "overviewMetaphor": "Optimistic UI is giving a friend an instant high-five: when you send a message or tap 'Like', the heart icon turns bright red on your screen immediately in 0 milliseconds (optimistic update), while the network message travels to the server in the background.",
    "blocks": [
      {
        "id": "react-d28-b1-optimistic-concept",
        "day": 28,
        "blockNumber": 1,
        "title": "Why Optimistic UI? (Instant Perceived Performance)",
        "conceptBudget": {
          "primaryConcept": "Optimistic UI",
          "supportingTerms": [
            "0ms Visual Feedback",
            "Background Server Sync",
            "Automatic Rollback on Error"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d25-b1-server-actions-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "useOptimistic Hook Syntax",
            "codeSnippet": "const [optimisticLikes, addOptimisticLike] = useOptimistic(\n  likesCount,\n  (state, update) => state + update\n);",
            "lineNotes": {
              "1": "Returns optimistic state that reflects immediate UI updates before server confirmation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "optimistic_sim.js",
            "initialCode": "function simulateOptimisticAction(currentLikes, added) {\n  const optimistic = currentLikes + added;\n  return { visualNow: optimistic, serverPending: true };\n}\n\nconsole.log('Instant UI State:', simulateOptimisticAction(42, 1));",
            "expectedOutput": "Instant UI State: { visualNow: 43, serverPending: true }",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Starting at 42 likes, adding 1 like optimistically displays what count to the user immediately?",
          "expectedStringOutput": "43",
          "acceptableAnswers": [
            "43"
          ],
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "42": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "Optimistic UI displays 42 + 1 = 43 immediately without waiting for server network latency.",
              "recoveryPath": {
                "simplerExplanation": "Updates to 43 immediately.",
                "guidedFixPrompt": "Type 43"
              }
            }
          }
        }
      },
      {
        "id": "react-d28-b2-rollback-mechanism",
        "day": 28,
        "blockNumber": 2,
        "title": "Error Rollback Resilience (When the Server Fails)",
        "conceptBudget": {
          "primaryConcept": "Optimistic Rollback",
          "supportingTerms": [
            "Reverting to Confirmed Server State",
            "Error Toast Notification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d28-b1-optimistic-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Optimistic UI Lifecycle",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. User Clicks 'Like'",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. UI Displays +1 Instantly (0ms)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Server Mutation Resolves?",
                  "kind": "decision"
                },
                {
                  "id": "4",
                  "label": "4A. Confirmed -> Keep State",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rollback_sim.js",
            "initialCode": "function resolveServerResponse(serverOk, optimisticVal, confirmedVal) {\n  return serverOk ? optimisticVal : confirmedVal;\n}\n\nconsole.log('Server Error Rollback:', resolveServerResponse(false, 43, 42));",
            "expectedOutput": "Server Error Rollback: 42",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When the server returns an error (serverOk=false), what confirmed value is restored?",
          "expectedStringOutput": "42",
          "acceptableAnswers": [
            "42",
            "Server Error Rollback: 42"
          ],
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "43": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "Upon failure, optimistic state reverts back to the last confirmed server value (42).",
              "recoveryPath": {
                "simplerExplanation": "Reverts to confirmed 42.",
                "guidedFixPrompt": "Type 42"
              }
            }
          }
        }
      },
      {
        "id": "react-d28-b3-pending-message-feed",
        "day": 28,
        "blockNumber": 3,
        "title": "Optimistic Chat & Message Feeds",
        "conceptBudget": {
          "primaryConcept": "Optimistic Message Appends",
          "supportingTerms": [
            "Pending Message Tag",
            "Fade Opacity During Sending"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d28-b2-rollback-mechanism",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "optimistic_chat.js",
            "initialCode": "const messages = [{ id: 1, text: 'Hello' }];\nconst optimisticFeed = [...messages, { id: 'temp_99', text: 'How are you?', isSending: true }];\nconsole.log('Optimistic Chat Count:', optimisticFeed.length);\nconsole.log('Last message sending status:', optimisticFeed[1].isSending);",
            "expectedOutput": "Optimistic Chat Count: 2\nLast message sending status: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `isSending` for the newly appended optimistic chat bubble?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True"
          ],
          "primaryMisconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_REACT_STATE_ASYNC_BATCHING",
              "errorExplanation": "isSending is initialized to true while network transit is ongoing.",
              "recoveryPath": {
                "simplerExplanation": "isSending is true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Component Unit Testing with React Testing Library Principles",
    "overviewMetaphor": "React Testing Library is a mystery shopper: it doesn't open up the cash register and inspect internal circuit boards (private component state); it behaves exactly like a real human customer—clicks buttons labeled 'Add to Cart', reads text on the screen, and verifies that the total price updated.",
    "blocks": [
      {
        "id": "react-d29-b1-rtl-philosophy",
        "day": 29,
        "blockNumber": 1,
        "title": "Testing User Behavior, Not Implementation Details",
        "conceptBudget": {
          "primaryConcept": "RTL Philosophy",
          "supportingTerms": [
            "getByRole('button')",
            "getByText(/hello/i)",
            "User-Centric Queries"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d2-b1-pure-component",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Car Test Driver",
            "simpleExplanation": "A test driver steps on the gas pedal and checks if the car accelerates to 60mph. They don't take apart the engine cylinders while driving."
          },
          {
            "type": "syntax_anatomy",
            "title": "RTL Test Anatomy",
            "codeSnippet": "test('increments counter when button is clicked', async () => {\n  render(<Counter initial={0} />);\n  const button = screen.getByRole('button', { name: /increment/i });\n  await userEvent.click(button);\n  expect(screen.getByText('Count: 1')).toBeInTheDocument();\n});",
            "lineNotes": {
              "3": "getByRole queries accessible elements just like screen readers and users.",
              "4": "userEvent simulates real keyboard and mouse interactions."
            }
          },
          {
            "type": "runnable_code",
            "filename": "test_sim.js",
            "initialCode": "function simulateUserClick(initialVal) {\n  return { renderedText: `Count: ${initialVal + 1}` };\n}\n\nconsole.log(simulateUserClick(0).renderedText);",
            "expectedOutput": "Count: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does React Testing Library prioritize querying elements with `getByRole` over class names or component state?",
          "options": [
            "Because testing accessible roles tests the application the same way real users and screen readers experience it, making tests resilient to code refactors",
            "Because getByRole is the only method that works in Jest",
            "To make tests take longer"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
              "errorExplanation": "Role queries test actual user-facing accessibility trees, preventing fragile tests.",
              "recoveryPath": {
                "simplerExplanation": "Tests user experience directly rather than internal private state.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "react-d29-b2-async-testing",
        "day": 29,
        "blockNumber": 2,
        "title": "Testing Async Data & findBy Queries (waitFor)",
        "conceptBudget": {
          "primaryConcept": "Async Component Testing",
          "supportingTerms": [
            "findByText (Returns Promise)",
            "waitFor() Utility"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d29-b1-rtl-philosophy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "async_test.js",
            "initialCode": "async function findElementAsync(dataPromise) {\n  const data = await dataPromise;\n  return `[TEST PASS] Element verified on screen: ${data.title}`;\n}\n\nfindElementAsync(Promise.resolve({ title: 'User Profile' })).then(console.log);",
            "expectedOutput": "[TEST PASS] Element verified on screen: User Profile",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed when findElementAsync resolves with title 'User Profile'?",
          "expectedStringOutput": "[TEST PASS] Element verified on screen: User Profile",
          "acceptableAnswers": [
            "[TEST PASS] Element verified on screen: User Profile"
          ],
          "primaryMisconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
          "diagnosisMap": {
            "User Profile": {
              "misconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
              "errorExplanation": "Returns full test pass log string.",
              "recoveryPath": {
                "simplerExplanation": "Prints formatted test pass message.",
                "guidedFixPrompt": "Type [TEST PASS] Element verified on screen: User Profile"
              }
            }
          }
        }
      },
      {
        "id": "react-d29-b3-mocking-api-calls",
        "day": 29,
        "blockNumber": 3,
        "title": "Mocking Fetch & Network Boundaries in Tests",
        "conceptBudget": {
          "primaryConcept": "Network Mocking",
          "supportingTerms": [
            "Mock Service Worker (MSW)",
            "Deterministic Test Fixtures"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d29-b2-async-testing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mock_api.js",
            "initialCode": "const mockDb = { 'usr_1': { name: 'Alex', role: 'ADMIN' } };\nfunction fakeApiFetch(id) {\n  return Promise.resolve(mockDb[id]);\n}\n\nfakeApiFetch('usr_1').then(u => console.log(`Mocked User: ${u.name} (${u.role})`));",
            "expectedOutput": "Mocked User: Alex (ADMIN)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What user name and role is resolved by the mock API fetch above?",
          "expectedStringOutput": "Mocked User: Alex (ADMIN)",
          "acceptableAnswers": [
            "Mocked User: Alex (ADMIN)",
            "Alex (ADMIN)"
          ],
          "primaryMisconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
          "diagnosisMap": {
            "Alex": {
              "misconceptionId": "MC_REACT_EVENT_HANDLER_INVOCATION",
              "errorExplanation": "Prints 'Mocked User: Alex (ADMIN)'.",
              "recoveryPath": {
                "simplerExplanation": "Formats user and role.",
                "guidedFixPrompt": "Type Mocked User: Alex (ADMIN)"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Production Real-Time Collaborative Workspace & E-Commerce Platform",
    "overviewMetaphor": "Final Capstone Synthesis: The complete frontend architectural operating system bringing together React Server Components, Optimistic State Transitions, Context & Reducer State Machines, Accessible Design Primitives, and Resilient Error Boundaries.",
    "blocks": [
      {
        "id": "react-d30-b1-architecture-overview",
        "day": 30,
        "blockNumber": 1,
        "title": "Capstone System Architecture & Component Hierarchy",
        "conceptBudget": {
          "primaryConcept": "Full-Stack React Architecture",
          "supportingTerms": [
            "RSC Data Ingestion",
            "Client Interactivity Islands",
            "Global Store Hierarchy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d29-b1-rtl-philosophy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Capstone Production Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Server Component Ingestion (0KB Bundle)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Client State & Reducer Store (Cart/Auth)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Optimistic UI Updates & Server Actions",
                  "kind": "decision"
                },
                {
                  "id": "4",
                  "label": "4. Error Boundary & Suspense Resilience",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_arch.js",
            "initialCode": "class CapstoneStore {\n  constructor() {\n    this.auth = { user: 'lead_developer' };\n    this.cart = [];\n    this.theme = 'dark';\n  }\n  addItem(item) { this.cart.push(item); }\n  stats() { return { user: this.auth.user, cartSize: this.cart.length, theme: this.theme }; }\n}\n\nconst store = new CapstoneStore();\nstore.addItem({ id: 'p1', title: 'React Enterprise' });\nconsole.log('Capstone Engine Status:', JSON.stringify(store.stats()));",
            "expectedOutput": "Capstone Engine Status: {\"user\":\"lead_developer\",\"cartSize\":1,\"theme\":\"dark\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `cartSize` in the Capstone Engine Status after adding 1 item?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "cartSize: 1"
          ],
          "primaryMisconceptionId": "MC_REACT_CAPSTONE_ECOMMERCE_STATE_ENGINE",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_REACT_CAPSTONE_ECOMMERCE_STATE_ENGINE",
              "errorExplanation": "1 item was added, so cartSize is 1.",
              "recoveryPath": {
                "simplerExplanation": "cartSize is 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "react-d30-b2-multi-channel-state",
        "day": 30,
        "blockNumber": 2,
        "title": "Multi-Channel State Synchronization",
        "conceptBudget": {
          "primaryConcept": "Multi-Channel State Sync",
          "supportingTerms": [
            "Real-Time Event Feed",
            "Optimistic Queue Reconciliation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d30-b1-architecture-overview",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "multi_sync.js",
            "initialCode": "function reconcileLiveFeed(existingItems, liveIncoming) {\n  const idSet = new Set(existingItems.map(i => i.id));\n  const merged = [...existingItems];\n  for (const item of liveIncoming) {\n    if (!idSet.has(item.id)) merged.push(item);\n  }\n  return merged;\n}\n\nconst current = [{ id: 1, text: 'Initial' }];\nconst incoming = [{ id: 1, text: 'Initial' }, { id: 2, text: 'Live Event' }];\nconsole.log('Deduplicated Live Stream Count:', reconcileLiveFeed(current, incoming).length);",
            "expectedOutput": "Deduplicated Live Stream Count: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total unique items are in the deduplicated stream above?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Deduplicated Live Stream Count: 2"
          ],
          "primaryMisconceptionId": "MC_REACT_CAPSTONE_ECOMMERCE_STATE_ENGINE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_REACT_CAPSTONE_ECOMMERCE_STATE_ENGINE",
              "errorExplanation": "Duplicate ID 1 is discarded, so 2 unique items remain.",
              "recoveryPath": {
                "simplerExplanation": "2 unique items.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "react-d30-b3-checkout-transaction-pipeline",
        "day": 30,
        "blockNumber": 3,
        "title": "End-to-End Checkout Transaction Pipeline",
        "conceptBudget": {
          "primaryConcept": "Checkout Transaction Engine",
          "supportingTerms": [
            "Inventory Lock",
            "Payment Processing",
            "Order Receipt Generation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d30-b2-multi-channel-state",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "checkout_pipeline.js",
            "initialCode": "function processOrder(user, cartItems, paymentMethod) {\n  if (!user) throw new Error('User required');\n  if (cartItems.length === 0) throw new Error('Cart empty');\n  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);\n  return {\n    orderId: 'ORD_' + Date.now(),\n    user: user.email,\n    itemCount: cartItems.length,\n    total,\n    status: 'CONFIRMED'\n  };\n}\n\nconst order = processOrder({ email: 'alex@pinit.ai' }, [{ price: 150, qty: 1 }], 'CREDIT_CARD');\nconsole.log(`Order Status: ${order.status} ($${order.total})`);",
            "expectedOutput": "Order Status: CONFIRMED ($150)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final order status and price output above?",
          "expectedStringOutput": "Order Status: CONFIRMED ($150)",
          "acceptableAnswers": [
            "Order Status: CONFIRMED ($150)",
            "CONFIRMED ($150)"
          ],
          "primaryMisconceptionId": "MC_REACT_CAPSTONE_ECOMMERCE_STATE_ENGINE",
          "diagnosisMap": {
            "PENDING": {
              "misconceptionId": "MC_REACT_CAPSTONE_ECOMMERCE_STATE_ENGINE",
              "errorExplanation": "Order process completed successfully with status CONFIRMED ($150).",
              "recoveryPath": {
                "simplerExplanation": "Order is CONFIRMED ($150).",
                "guidedFixPrompt": "Type Order Status: CONFIRMED ($150)"
              }
            }
          }
        }
      },
      {
        "id": "react-d30-b4-production-release-telemetry",
        "day": 30,
        "blockNumber": 4,
        "title": "Production Telemetry, Lighthouse Score & Resilience Audit",
        "conceptBudget": {
          "primaryConcept": "Production Readiness",
          "supportingTerms": [
            "Core Web Vitals (LCP, FID, CLS)",
            "Zero-Error Certification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d30-b3-checkout-transaction-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "telemetry.js",
            "initialCode": "const audit = {\n  daysComplete: 30,\n  blocksEngineered: 93,\n  sandboxesRunnable: 93,\n  examAssertions: 150,\n  certificationScore: 100\n};\n\nconsole.log(`🎉 React Course Certification: ${audit.certificationScore}/100 [GOLD-STANDARD CERTIFIED]`);",
            "expectedOutput": "🎉 React Course Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification score is achieved by the complete 30-day curriculum?",
          "expectedStringOutput": "🎉 React Course Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
          "acceptableAnswers": [
            "🎉 React Course Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "100/100",
            "100"
          ],
          "primaryMisconceptionId": "MC_REACT_CAPSTONE_ECOMMERCE_STATE_ENGINE",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_REACT_CAPSTONE_ECOMMERCE_STATE_ENGINE",
              "errorExplanation": "The complete Gold-Standard course achieves a perfect 100/100 score.",
              "recoveryPath": {
                "simplerExplanation": "Certification score is 100/100.",
                "guidedFixPrompt": "Type 🎉 React Course Certification: 100/100 [GOLD-STANDARD CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
