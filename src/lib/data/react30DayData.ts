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

export const REACT_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is React? — Components, SPA and Creating Your First App with Vite",
    desc: "React is a JavaScript library created by Facebook in 2013 that completely changed how developers build websites. Before React, when a user clicked a button or liked a post, you had to manually write JavaScript to find the HTML element and update it. With hundreds or thousands of elements on a page (think a Facebook feed with 200 posts, each with likes, comments, shares), this became a nightmare. React solved this with COMPONENTS. A component is a small, self-contained piece of UI. Instead of one giant HTML page, you break your UI into pieces: Header is a component, Footer is a component, each Post is a component, each Like button is a component. Components are just JavaScript functions that return JSX (which looks like HTML). When data changes, React automatically figures out which components need to update and updates ONLY those parts without refreshing the entire page. This is called the Virtual DOM. Your entire React app is a tree: App is the root component, inside it are Header, Main, Footer. Inside Main are Post components. Inside each Post is an Avatar, Text, and LikeButton. This organised tree makes code reusable, maintainable, and fast. To create your first React app using Vite (the modern recommended way): run npm create vite@latest my-app -- --template react, then cd my-app, then npm install, then npm run dev. Your app opens at http://localhost:5173. The two files you will edit most are src/App.jsx (the root component) and the src/components/ folder where you create your own components. Vite watches your files and hot-reloads the browser the instant you save a file. (Real world: Netflix, Instagram, Airbnb, WhatsApp Web, Facebook, Twitter/X and thousands of production apps are all built with React. When you scroll Instagram and new posts appear, React adds just the new Post components to the existing tree without refreshing the page.)",
    syllabus: ["What React solves: before React, updating a webpage meant manually finding HTML elements with JavaScript and changing them one by one. React uses COMPONENTS — small reusable pieces of UI (Header, Post, LikeButton). When data changes, React updates only the affected components automatically, not the whole page.", "Create your first app (Vite): run npm create vite@latest my-app -- --template react, then cd my-app, then npm install, then npm run dev. Opens at http://localhost:5173. Key files: src/App.jsx is the root component you edit, src/main.jsx is the entry point. Vite hot-reloads instantly on every file save.", "React app as a component tree: App is the root. Inside App you nest Header, Main, Footer. Inside Main you nest ProductCard, ProductCard, ProductCard. Each component is its own .jsx file. This tree replaces one massive messy HTML file with organised, reusable, independently-testable pieces."],
    eTitle: "Exam: Virtual DOM Node Checker",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: First Component Mockup",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Props — Sending Data from Parent to Child Components with 10 Examples",
    desc: "When you break your UI into components, you immediately need a way for a parent component to send data to a child component. The answer is props (short for properties). Props work exactly like function arguments: the parent passes data in, and the child receives and uses it. Here is the simplest example: function Greeting({ name }) { return <h1>Hello, {name}!</h1>; }. Use it in App: <Greeting name=\"Priya\" />. React passes { name: \"Priya\" } to Greeting. Inside Greeting, name is \"Priya\", so it displays 'Hello, Priya!'. Use it again: <Greeting name=\"Rahul\" /> shows 'Hello, Rahul!'. Same component, different data, different output — this is what makes components reusable. Props can be any type: string (<Button label=\"Click me\" />), number (<Counter start={0} />), boolean (<Button disabled={true} /> or shorthand <Button disabled />), array (<List items={[\"a\",\"b\",\"c\"]} />), object (<User data={{name:\"Alice\",age:25}} />), or even a function (<Button onClick={handleClick} />). IMPORTANT: string props use plain quotes. All other types use curly braces { }. The GOLDEN RULE of props: NEVER modify props inside a component. Props are READ-ONLY. The parent owns the data; the child only reads it. If you need to change a value, that is what useState is for (Day 3). Props flow in ONE direction: parent to child only. This one-way data flow makes React apps predictable and easy to debug — when you see a bug, you always know data flows downward. (Real world: On Amazon, a ProductCard component receives props: title, price, imageUrl, rating, inStock. The same ProductCard is reused hundreds of times in the search results with different props for each product.)",
    syllabus: ["Props are like function arguments for components: function Greeting({ name }) { return <h1>Hello {name}</h1>; }. Use it: <Greeting name=\"Priya\" />. Destructuring in the parameter { name } is cleaner than using props.name. The parent passes data, the child receives it. Same component + different props = different output.", "Props types: string name=\"Alice\" (plain quotes), number age={25} (curly braces), boolean isActive={true} or shorthand isActive (no value = true), array items={[1,2,3]}, object user={{name:\"Alice\"}} (double curly: outer is JSX, inner is JS object), function onClick={handleClick}. RULE: strings use quotes, everything else uses { }.", "One-way data flow: props go from PARENT to CHILD only. Child components CANNOT modify props — they are read-only. Reading props.name is fine. Writing props.name = \"Bob\" is WRONG and breaks React. If you need to change data, use useState (Day 3). One-way flow means bugs are predictable: data only comes from above."],
    eTitle: "Exam: Prop Spreader Auditor",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Avatar Card Props Check",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "React State & State Mutators (useState Hook)",
    desc: "Master the useState hook, state batching updates, and component re-render loops. (Real world: Sidebar menus trigger state mutators on toggle commands, redrawing navigation frames.)",
    syllabus: ["useState hook signatures", "State mutations re-render cycles", "Functional state updates rules"],
    eTitle: "Exam: Sidebar State Toggle Handler",
    eDesc: "Write a JS function `toggleSidebarState(current)` returning string: current === 'open' ? 'closed' : 'open'. Return 'open' if current is null.",
    eStarter: "function toggleSidebarState(current) {\n    // Write your code here\n    \n}",
    eHint: "Compare input status directly, inverting state string.",
    eTest: "if (typeof toggleSidebarState !== 'function') throw new Error('Method toggleSidebarState not found.');\nif (toggleSidebarState('open') !== 'closed') throw new Error('Toggle state transition failed');",
    aTitle: "Assignment: Active menu item updater",
    aDesc: "Write a JS function `updateActiveMenuItem(itemIndex)` returning object `{ activeId: itemIndex }`.",
    aStarter: "function updateActiveMenuItem(itemIndex) {\n    // Write your code here\n    \n}",
    aHint: "Return state object configuration.",
    aTest: "if (typeof updateActiveMenuItem !== 'function') throw new Error('Method updateActiveMenuItem not found.');"
  },
  {
    title: "Dynamic Arrays: Mapping & Reconciliation Keys",
    desc: "Master map loops inside JSX. (Real world: Dashboard tables map records arrays, forcing unique key attributes so React's reconciliation engine shifts unchanged rows without re-renders.)",
    syllabus: ["Mapping arrays data structures inside JSX", "Reconciliation key attribute parameters guidelines", "Array filter criteria layouts updates"],
    eTitle: "Exam: User Array Search filter",
    eDesc: "Write a JS function `filterUsersList(users, query)` returning array of users where user.name contains query string (case-insensitive). Return users if query is empty.",
    eStarter: "function filterUsersList(users, query) {\n    // Write your code here\n    \n}",
    eHint: "Use users.filter() checking lowercased name matching query. Check query.",
    eTest: "if (typeof filterUsersList !== 'function') throw new Error('Method filterUsersList not found');\nif (filterUsersList([{name: 'Admin'}, {name: 'Guest'}], 'ad')[0].name !== 'Admin') throw new Error('User search filter failed');",
    aTitle: "Assignment: Key index validator",
    aDesc: "Write a JS function `hasDuplicateIds(items)` returning true if items array contains duplicate id values.",
    aStarter: "function hasDuplicateIds(items) {\n    // Write your code here\n    \n}",
    aHint: "Track elements inside a Set object, comparing sizes.",
    aTest: "if (typeof hasDuplicateIds !== 'function') throw new Error('Method hasDuplicateIds not found');"
  },
  {
    title: "React Forms: Controlled text field inputs",
    desc: "Master controlled inputs bindings. (Real world: Search feeds bind input values to component state keys, updating queries list on every change keystroke.)",
    syllabus: ["Controlled inputs value properties", "Handling onChange event objects", "Form submission event prevent default"],
    eTitle: "Exam: Input Change Formatter",
    eDesc: "Write a JS function `formatSearchQuery(value)` returning the string trimmed of trailing spaces and converted to lowercase.",
    eStarter: "function formatSearchQuery(value) {\n    // Write your code here\n    \n}",
    eHint: "Use String.trim() and String.toLowerCase() directly.",
    eTest: "if (typeof formatSearchQuery !== 'function') throw new Error('Method formatSearchQuery not found');\nif (formatSearchQuery('  React  ') !== 'react') throw new Error('Query formatting failed');",
    aTitle: "Assignment: Form submission validation",
    aDesc: "Write a JS function `isFormSubmitAllowed(query)` returning true if query.trim().length >= 3.",
    aStarter: "function isFormSubmitAllowed(query) {\n    // Write your code here\n    \n}",
    aHint: "Trim input and evaluate length limits.",
    aTest: "if (typeof isFormSubmitAllowed !== 'function') throw new Error('Method isFormSubmitAllowed not found');"
  },
  {
    title: "Side Effects: Data Fetching (useEffect Hook)",
    desc: "Master side effects execution. (Real world: Admin consoles trigger API queries inside useEffect blocks, updating dashboard cards after network returns.)",
    syllabus: ["useEffect hook dependency arrays rules", "Fetching REST resources data APIs", "Cleanup functions in useEffect hooks"],
    eTitle: "Exam: Fetch Status Categorizer",
    eDesc: "Write a JS function `getFetchState(isLoading, error)` returning 'LOADING' if isLoading is true, 'ERROR' if error is non-null, and 'SUCCESS' otherwise.",
    eStarter: "function getFetchState(isLoading, error) {\n    // Write your code here\n    \n}",
    eHint: "Evaluate boolean flags returning matching status string.",
    eTest: "if (typeof getFetchState !== 'function') throw new Error('Method getFetchState not found');\nif (getFetchState(false, 'Network Err') !== 'ERROR') throw new Error('Fetch categorizer failed');",
    aTitle: "Assignment: Dependency change tracker",
    aDesc: "Write a JS function `hasDependencyChanged(prev, next)` returning true if prev !== next.",
    aStarter: "function hasDependencyChanged(prev, next) {\n    // Write your code here\n    \n}",
    aHint: "Compare input variables directly.",
    aTest: "if (typeof hasDependencyChanged !== 'function') throw new Error('Method hasDependencyChanged not found');"
  },
  {
    title: "Advanced Hooks: Custom states (useReducer Hook)",
    desc: "Master complex state transitions. (Real world: E-commerce shopping baskets route actions to reducer loops, updating totals, counts, and items states.)",
    syllabus: ["useReducer dispatch loops architectures", "Actions types and payloads structures", "Immutable state reductions calculations"],
    eTitle: "Exam: Cart Action Reducer",
    eDesc: "Write a JS function `cartReducer(state, action)` where action is `{ type: 'ADD', item: { price: P } }` returning new state `{ total: state.total + action.item.price }`. Return state if type is not matched.",
    eStarter: "function cartReducer(state, action) {\n    // Write your code here\n    \n}",
    eHint: "Inspect action type property key, updating total value metrics.",
    eTest: "if (typeof cartReducer !== 'function') throw new Error('Method cartReducer not found');\nif (cartReducer({ total: 10 }, { type: 'ADD', item: { price: 5 } }).total !== 15) throw new Error('Cart reducer failed');",
    aTitle: "Assignment: Action payload checker",
    aDesc: "Write a JS function `isPayloadPresent(action)` returning true if action.payload is non-null.",
    aStarter: "function isPayloadPresent(action) {\n    // Write your code here\n    \n}",
    aHint: "Verify property existence.",
    aTest: "if (typeof isPayloadPresent !== 'function') throw new Error('Method isPayloadPresent not found');"
  },
  {
    title: "React Router: URL Parameters navigation routing",
    desc: "Master dynamic page routing parameters. (Real world: Admin systems parse URL paths, loading details for card item IDs on page route transitions.)",
    syllabus: ["Client routers dynamic path segments", "Parsing routing parameter values", "Imperative programmatic history navigation"],
    eTitle: "Exam: Route Parameter Validator",
    eDesc: "Write a JS function `isValidUrlParam(param)` returning true if param is numeric string (only digits) and length > 0. Returns false otherwise.",
    eStarter: "function isValidUrlParam(param) {\n    // Write your code here\n    \n}",
    eHint: "Evaluate characters regex: /^[0-9]+$/.",
    eTest: "if (typeof isValidUrlParam !== 'function') throw new Error('Method isValidUrlParam not found');\nif (isValidUrlParam('105') !== true) throw new Error('Route param checks failed');",
    aTitle: "Assignment: Query param parser",
    aDesc: "Write a JS function `getQueryVal(url, key)` returning value of key parameter from search string.",
    aStarter: "function getQueryVal(url, key) {\n    // Write your code here\n    \n}",
    aHint: "Use URLSearchParams constructor to parse url search parts.",
    aTest: "if (typeof getQueryVal !== 'function') throw new Error('Method getQueryVal not found');"
  },
  {
    title: "State Management: Context API Global State Provider",
    desc: "Master global context state sharing. (Real world: Enterprise portals wrap app clusters inside global Context Providers, fetching theme preferences without prop-drilling.)",
    syllabus: ["React Context API architectures", "Context Provider values updates", "Consuming context states cleanly"],
    eTitle: "Exam: Context Values Auditor",
    eDesc: "Write a JS function `isThemeValueSafe(theme)` returning true if theme === 'light' or theme === 'dark'. Returns false otherwise.",
    eStarter: "function isThemeValueSafe(theme) {\n    // Write your code here\n    \n}",
    eHint: "Verify theme value conforms to allowed configurations.",
    eTest: "if (typeof isThemeValueSafe !== 'function') throw new Error('Method isThemeValueSafe not found');\nif (isThemeValueSafe('dark') !== true) throw new Error('Theme value auditor failed');",
    aTitle: "Assignment: Context fallback selector",
    aDesc: "Write a JS function `getContextTheme(theme, fallback)` returning theme || fallback.",
    aStarter: "function getContextTheme(theme, fallback) {\n    // Write your code here\n    \n}",
    aHint: "Return first value if present, else fallback.",
    aTest: "if (typeof getContextTheme !== 'function') throw new Error('Method getContextTheme not found');"
  },
  {
    title: "Final Capstone: React Portal Dashboard Audit",
    desc: "Perform evaluations of component re-render loops count, check props validation maps, verify router parameters compliance checks, and evaluate context states. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Auditing component render loops counts", "Evaluating router paths validators", "Context state parameter compliance reviews"],
    eTitle: "Exam: Dashboard Compliance Auditor",
    eDesc: "Write a JS function `evaluateDashboardBuild(report)` returning true if report.rendersCount <= 3 and report.routesValid === true and report.contextSafe === true.",
    eStarter: "function evaluateDashboardBuild(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.rendersCount, report.routesValid, and report.contextSafe boolean properties in report.",
    eTest: "if (typeof evaluateDashboardBuild !== 'function') throw new Error('Method evaluateDashboardBuild not found');\nconst rep = { rendersCount: 2, routesValid: true, contextSafe: true };\nif (evaluateDashboardBuild(rep) !== true) throw new Error('Dashboard compliance verification failed');",
    aTitle: "Assignment: Performance rating selector",
    aDesc: "Write a JS function `getRenderRating(rendersCount)` returning 'good' if rendersCount <= 2, 'poor' otherwise.",
    aStarter: "function getRenderRating(rendersCount) {\n    // Write your code here\n    \n}",
    aHint: "Verify count values.",
    aTest: "if (typeof getRenderRating !== 'function') throw new Error('Method getRenderRating not found');"
  },
  {
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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
    title: "Final Capstone: React Portal Dashboard Audit (Review)",
    desc: "Review React dashboard builds parameters, component rendering counts, Context API configurations, and route parameters validators. (Real world: Core developers audit React codebases, checking bundle weights and render counts.)",
    syllabus: ["Reviewing component rendering bounds", "Assembling release audit checklists", "Verifying routing paths configurations"],
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

export const REACT_30_DAYS_QUESTS = REACT_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `react-basics-lecture-day-${dayNum}`,
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
        id: `react-basics-lecture2-day-1`,
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
        id: `react-basics-lecture3-day-1`,
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
        id: `react-basics-lecture2-day-2`,
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
        id: `react-basics-lecture3-day-2`,
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
  return buildEnrichedDayQuests('react-basics', dayNum, cfg);
});
