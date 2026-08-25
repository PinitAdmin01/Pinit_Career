import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const REACT_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "JSX Syntax & Virtual DOM Mechanics",
    desc: "In React, you don't manipulate the real browser DOM directly because updating raw HTML nodes is slow. Instead, React uses JSX—a syntax extension that compiles directly to React.createElement() objects, creating a lightweight JavaScript representation of the UI called the Virtual DOM. When state changes, React's reconciliation engine runs a diffing algorithm comparing the new Virtual DOM with the previous snapshot, calculating the exact minimal DOM mutations needed and updating the browser in a single batch. (Real world: Netflix updates thousands of movie carousel tiles without dropping below 60 frames per second.)",
    syllabus: [
      "JSX compilation: How <div className=\"card\">Hello</div> compiles directly to React.createElement('div', { className: 'card' }, 'Hello').",
      "Virtual DOM Tree Diffing: How React computes tree diffs in O(N) time using element keys and type comparisons.",
      "Reconciliation & Batching: How React commits changes to the real DOM in a single render pass to eliminate layout thrashing."
    ],
    eTitle: "Exam: Virtual DOM Node Constructor",
    eDesc: "Write a JS function `createVNode(type, props, children)` returning a Virtual DOM object: `{ type, props: { ...props, children } }`.",
    eStarter: "function createVNode(type, props, children) {\n    // Write your code here\n    \n}",
    eHint: "Return object combining type and props with children.",
    eTest: "if (typeof createVNode !== 'function') throw new Error('createVNode not found');\nconst node = createVNode('div', { className: 'card' }, 'Hello');\nif (node.type !== 'div' || node.props.className !== 'card' || node.props.children !== 'Hello') throw new Error('VNode construction failed');",
    aTitle: "Assignment: Virtual DOM Equality Comparator",
    aDesc: "Write a JS function `isVNodeEqual(nodeA, nodeB)` returning true if both nodes have identical `type` and `props.id`.",
    aStarter: "function isVNodeEqual(nodeA, nodeB) {\n    // Write your code here\n    \n}",
    aHint: "Compare type and props.id properties.",
    aTest: "if (typeof isVNodeEqual !== 'function') throw new Error('isVNodeEqual not found');\nif (!isVNodeEqual({ type: 'button', props: { id: 'btn1' } }, { type: 'button', props: { id: 'btn1' } })) throw new Error('VNode equality failed');"
  },
  {
    title: "Functional Components & Props Contract",
    desc: "Functional components are pure JavaScript functions that take an immutable props object as an argument and return JSX elements. Props flow strictly unidirectionally from parent to child. React enforces immutability—components must never modify their own props directly. By destructuring props and assigning default values, you create reusable, self-documenting UI building blocks. (Real world: Airbnb uses standardized <ListingCard /> components across search, wishlist, and booking checkout pages.)",
    syllabus: [
      "Pure Functional Components: Deterministic rendering where identical props always produce identical UI output.",
      "Props Destructuring & Default Values: Clean parameter extraction with fallback safety.",
      "Unidirectional Data Flow: Passing read-only data downward and bubbling events upward via callback functions."
    ],
    eTitle: "Exam: Component Props Badge Formatter",
    eDesc: "Write a JS function `formatUserBadge(user, role)` returning `{ id: user.id, displayName: user.name.toUpperCase(), role: role || 'STUDENT', isVerified: Boolean(user.email) }`.",
    eStarter: "function formatUserBadge(user, role) {\n    // Write your code here\n    \n}",
    eHint: "Transform user properties and apply fallback role.",
    eTest: "if (typeof formatUserBadge !== 'function') throw new Error('formatUserBadge not found');\nconst b = formatUserBadge({ id: 1, name: 'alex', email: 'a@pinit.ai' }, 'ADMIN');\nif (b.displayName !== 'ALEX' || b.role !== 'ADMIN' || b.isVerified !== true) throw new Error('Badge formatting failed');",
    aTitle: "Assignment: Component Props Safe Merger",
    aDesc: "Write a JS function `mergeComponentProps(defaultProps, customProps)` returning a merged props object where customProps overrides defaultProps without mutating originals.",
    aStarter: "function mergeComponentProps(defaultProps, customProps) {\n    // Write your code here\n    \n}",
    aHint: "Use object spread syntax.",
    aTest: "if (typeof mergeComponentProps !== 'function') throw new Error('mergeComponentProps not found');\nconst m = mergeComponentProps({ size: 'md', color: 'blue' }, { size: 'lg' });\nif (m.size !== 'lg' || m.color !== 'blue') throw new Error('Props merge failed');"
  },
  {
    title: "State with useState & State Batching",
    desc: "Local component state allows UI to remember data between user interactions. Calling useState(initialValue) returns a state variable and an updater function. When updating state based on previous state, you must pass an updater callback setCount(prev => prev + 1) to prevent race conditions. In React 18, automatic batching groups multiple state updates inside promises, timeouts, and native event handlers into a single re-render. (Real world: Swiggy cart increments update item counts, total price, and delivery fee in a single smooth repaint.)",
    syllabus: [
      "useState Hook Syntax: Initializing primitive and object state with immutability rules.",
      "Functional State Updates: Using prev => next updater functions for concurrent safety.",
      "React 18 Automatic Batching: How React combines multiple state triggers within async callbacks into a single render."
    ],
    eTitle: "Exam: Immutable Cart State Manager",
    eDesc: "Write a JS function `toggleCartItem(cart, itemId)` that returns a new array with `itemId` removed if already present, or added if absent.",
    eStarter: "function toggleCartItem(cart, itemId) {\n    // Write your code here\n    \n}",
    eHint: "Check if cart includes itemId, then filter or append.",
    eTest: "if (typeof toggleCartItem !== 'function') throw new Error('toggleCartItem not found');\nif (toggleCartItem(['item1', 'item2'], 'item2').length !== 1) throw new Error('Remove failed');\nif (toggleCartItem(['item1'], 'item2').length !== 2) throw new Error('Add failed');",
    aTitle: "Assignment: Immutable Nested Profile Updater",
    aDesc: "Write a JS function `updateNestedProfile(profile, field, value)` returning a cloned profile with `profile.settings[field] = value`.",
    aStarter: "function updateNestedProfile(profile, field, value) {\n    // Write your code here\n    \n}",
    aHint: "Clone outer object and nested settings object.",
    aTest: "if (typeof updateNestedProfile !== 'function') throw new Error('updateNestedProfile not found');\nconst p = { name: 'A', settings: { theme: 'light' } };\nconst u = updateNestedProfile(p, 'theme', 'dark');\nif (u.settings.theme !== 'dark' || p.settings.theme !== 'light') throw new Error('Immutability violated');"
  },
  {
    title: "Side Effects with useEffect & Cleanup",
    desc: "Side effects are operations that reach outside the React rendering loop—such as fetching API data, establishing WebSocket connections, setting timers, or listening to window resize events. The useEffect hook runs after the DOM has painted. The dependency array controls execution: omitting it runs on every render; passing [] runs only once on mount; passing [id] runs whenever id changes. Returning a cleanup function prevents memory leaks by removing listeners or clearing intervals. (Real world: Uber driver map tracking listens to GPS coordinates and unsubscribes when the passenger closes the tab.)",
    syllabus: [
      "useEffect Execution Timing: Running side-effects asynchronously after layout paint.",
      "Dependency Array Rules: Preventing infinite re-render loops with strict dependency tracking.",
      "Teardown & Cleanup Function: Disposing timers, event listeners, and open network sockets on unmount."
    ],
    eTitle: "Exam: Event Subscription Manager",
    eDesc: "Write a JS function `createSubscriptionManager()` returning `{ subscribe(fn), unsubscribe(fn), notify(data) }` managing an internal listener list.",
    eStarter: "function createSubscriptionManager() {\n    // Write your code here\n    \n}",
    eHint: "Store listeners in array, invoke on notify.",
    eTest: "if (typeof createSubscriptionManager !== 'function') throw new Error('createSubscriptionManager not found');\nconst mgr = createSubscriptionManager();\nlet val = 0;\nconst fn = d => val = d;\nmgr.subscribe(fn);\nmgr.notify(42);\nif (val !== 42) throw new Error('Notify failed');\nmgr.unsubscribe(fn);\nmgr.notify(100);\nif (val !== 42) throw new Error('Unsubscribe cleanup failed');",
    aTitle: "Assignment: Dependency Array Change Detector",
    aDesc: "Write a JS function `hasDepsChanged(prevDeps, nextDeps)` returning true if arrays differ in length or any element changed via strict inequality (===).",
    aStarter: "function hasDepsChanged(prevDeps, nextDeps) {\n    // Write your code here\n    \n}",
    aHint: "Compare lengths and loop checking prevDeps[i] !== nextDeps[i].",
    aTest: "if (typeof hasDepsChanged !== 'function') throw new Error('hasDepsChanged not found');\nif (!hasDepsChanged([1, 'a'], [1, 'b'])) throw new Error('Diff detect failed');\nif (hasDepsChanged([1, 2], [1, 2])) throw new Error('False positive on identical deps');"
  },
  {
    title: "useMemo & useCallback Performance Optimization",
    desc: "In React, every component re-render re-executes all functions and recalculates all variables inside its body. For heavy calculations (e.g., sorting 10,000 search results) or passing callback functions to memoized child components (React.memo), recalculations cause performance stutter. useMemo caches the calculated return value, while useCallback caches the function reference itself until dependencies change. (Real world: Zerodha live stock search filters 5,000 ticker symbols without blocking the 60fps chart animation.)",
    syllabus: [
      "useMemo for Expensive Computations: Caching computed values between re-renders.",
      "useCallback for Stable Function References: Preserving function identity to prevent child re-renders.",
      "React.memo Integration: Shallow prop comparison to skip rendering unchanged subtrees."
    ],
    eTitle: "Exam: Memoized Search Filter",
    eDesc: "Write a JS function `memoizedFilter(items, query)` that returns matching items case-insensitively. Return all items if query is empty.",
    eStarter: "function memoizedFilter(items, query) {\n    // Write your code here\n    \n}",
    eHint: "Use Array.prototype.filter and String.prototype.includes.",
    eTest: "if (typeof memoizedFilter !== 'function') throw new Error('memoizedFilter not found');\nconst res = memoizedFilter(['Apple', 'Banana', 'Avocado'], 'av');\nif (res.length !== 1 || res[0] !== 'Avocado') throw new Error('Filter failed');",
    aTitle: "Assignment: Shallow Props Comparator",
    aDesc: "Write a JS function `arePropsEqual(prevProps, nextProps)` returning true if all key-value pairs in prevProps strictly equal nextProps.",
    aStarter: "function arePropsEqual(prevProps, nextProps) {\n    // Write your code here\n    \n}",
    aHint: "Compare Object.keys lengths and verify prevProps[k] === nextProps[k].",
    aTest: "if (typeof arePropsEqual !== 'function') throw new Error('arePropsEqual not found');\nif (!arePropsEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })) throw new Error('Props match failed');\nif (arePropsEqual({ a: 1 }, { a: 2 })) throw new Error('Inequality failed');"
  },
  {
    title: "useRef & Direct DOM Manipulation",
    desc: "The useRef hook provides a mutable container object { current: value } whose value persists across renders without triggering a re-render when mutated. It is primarily used for two purposes: (1) storing direct references to real DOM elements (focusing inputs, measuring heights, scrolling to elements), and (2) storing mutable instance variables like timer IDs, WebSocket connections, or previous prop values. (Real world: WhatsApp chat windows automatically scroll to the bottom when a new message arrives.)",
    syllabus: [
      "useRef for DOM Access: Attaching ref={inputRef} and calling .focus() or .scrollIntoView().",
      "useRef as Instance Storage: Storing values that persist across renders without causing re-renders.",
      "Storing Previous State: Tracking previous prop and state values across render cycles."
    ],
    eTitle: "Exam: Render Count & Mutable Ref Tracker",
    eDesc: "Write a JS function `createRefContainer(initialValue)` returning `{ current: initialValue, trackMutations: () => mutationCount }` where mutating `.current` increments count.",
    eStarter: "function createRefContainer(initialValue) {\n    // Write your code here\n    \n}",
    eHint: "Use a getter and setter on current property.",
    eTest: "if (typeof createRefContainer !== 'function') throw new Error('createRefContainer not found');\nconst ref = createRefContainer(10);\nref.current = 20;\nref.current = 30;\nif (ref.current !== 30 || ref.trackMutations() !== 2) throw new Error('Ref tracker failed');",
    aTitle: "Assignment: Bounding Box Dimension Calculator",
    aDesc: "Write a JS function `measureDomDimensions(element)` returning `{ width: element.clientWidth, height: element.clientHeight, area: element.clientWidth * element.clientHeight }`.",
    aStarter: "function measureDomDimensions(element) {\n    // Write your code here\n    \n}",
    aHint: "Read clientWidth and clientHeight from element object.",
    aTest: "if (typeof measureDomDimensions !== 'function') throw new Error('measureDomDimensions not found');\nconst m = measureDomDimensions({ clientWidth: 200, clientHeight: 100 });\nif (m.area !== 20000) throw new Error('Dimension calculation failed');"
  },
  {
    title: "Custom Hooks & Logic Decoupling",
    desc: "Custom hooks are JavaScript functions whose names start with use and that can call other React hooks. They allow you to extract complex stateful logic (such as API data fetching, form handling, local storage synchronization, or media query detection) out of components and share it across your entire application cleanly without duplicating code. (Real world: Stripe payment forms share a reusable useStripeCardValidation() hook across web, mobile, and embedded checkout widgets.)",
    syllabus: [
      "Custom Hook Design Rules: Starting with use, composing existing hooks, and returning clean state/action tuples.",
      "Extracting Stateful Logic: Separating UI rendering from business calculations and data fetching.",
      "Composability: Chaining multiple custom hooks into clean high-level feature modules."
    ],
    eTitle: "Exam: Custom useToggle Hook State Builder",
    eDesc: "Write a JS function `buildUseToggleState(initial)` returning `{ value: Boolean(initial), toggle: () => void, setTrue: () => void, setFalse: () => void }`.",
    eStarter: "function buildUseToggleState(initial) {\n    // Write your code here\n    \n}",
    eHint: "Create closure holding internal boolean flag with modifier methods.",
    eTest: "if (typeof buildUseToggleState !== 'function') throw new Error('buildUseToggleState not found');\nconst t = buildUseToggleState(false);\nt.toggle();\nif (t.value !== true) throw new Error('Toggle failed');\nt.setFalse();\nif (t.value !== false) throw new Error('setFalse failed');",
    aTitle: "Assignment: Local Storage State Serializer",
    aDesc: "Write a JS function `serializeStorageValue(val)` returning JSON string, and `deserializeStorageValue(str, fallback)` parsing JSON or returning fallback on error.",
    aStarter: "function serializeStorageValue(val) {\n    // Write your code here\n    \n}\nfunction deserializeStorageValue(str, fallback) {\n    // Write your code here\n    \n}",
    aHint: "Use JSON.stringify and JSON.parse wrapped in try-catch.",
    aTest: "if (typeof serializeStorageValue !== 'function') throw new Error('serializeStorageValue not found');\nif (serializeStorageValue({ a: 1 }) !== '{\"a\":1}') throw new Error('Serialize failed');\nif (deserializeStorageValue('invalid json', 99) !== 99) throw new Error('Fallback failed');"
  },
  {
    title: "Context API & Global State Sharing",
    desc: "Passing props through 5 or 10 layers of intermediate components that don't need the data—known as prop drilling—makes code fragile and hard to maintain. React Context provides a way to share data globally across a component tree. By wrapping components in a <ThemeContext.Provider value={theme}> and consuming it via useContext(ThemeContext), any deeply nested component can access global state directly. (Real world: Spotify switches between Light and Dark mode globally across 50 nested player and playlist widgets instantly.)",
    syllabus: [
      "createContext & Provider Pattern: Initializing global context and supplying values to subtrees.",
      "useContext Hook Consumption: Accessing context values directly in child components without prop drilling.",
      "Context Optimization: Splitting state and dispatch providers to prevent unnecessary child re-renders."
    ],
    eTitle: "Exam: Context Theme Resolver",
    eDesc: "Write a JS function `resolveUserTheme(contextValue, fallbackTheme)` returning `{ mode: contextValue?.mode || fallbackTheme.mode, primaryColor: contextValue?.color || fallbackTheme.color }`.",
    eStarter: "function resolveUserTheme(contextValue, fallbackTheme) {\n    // Write your code here\n    \n}",
    eHint: "Extract properties with optional chaining and fallback.",
    eTest: "if (typeof resolveUserTheme !== 'function') throw new Error('resolveUserTheme not found');\nconst t = resolveUserTheme(null, { mode: 'dark', color: '#6366f1' });\nif (t.mode !== 'dark' || t.primaryColor !== '#6366f1') throw new Error('Theme fallback failed');",
    aTitle: "Assignment: Context Store Dispatcher",
    aDesc: "Write a JS function `createContextDispatcher(initialState, reducer)` returning `{ getState: () => state, dispatch: (action) => void }`.",
    aStarter: "function createContextDispatcher(initialState, reducer) {\n    // Write your code here\n    \n}",
    aHint: "Apply reducer(state, action) on dispatch.",
    aTest: "if (typeof createContextDispatcher !== 'function') throw new Error('createContextDispatcher not found');\nconst store = createContextDispatcher({ count: 0 }, (s, a) => a.type === 'INC' ? { count: s.count + 1 } : s);\nstore.dispatch({ type: 'INC' });\nif (store.getState().count !== 1) throw new Error('Dispatch failed');"
  },
  {
    title: "React Portals & Modal Management",
    desc: "When creating modal dialogs, tooltips, dropdown menus, or toast notifications, CSS rules on parent containers (like overflow: hidden, z-index: 10, or transform) can clip or misposition the floating element. ReactDOM.createPortal(children, domNode) renders the child element into a completely different part of the DOM tree (such as document.body) while preserving React's normal component hierarchy and event bubbling behavior. (Real world: YouTube floating picture-in-picture video player escapes page container constraints.)",
    syllabus: [
      "createPortal Syntax: Rendering JSX nodes into document.body or external DOM mount points.",
      "CSS Stacking Context Escape: Bypassing parent overflow: hidden and z-index traps.",
      "Event Bubbling through Portals: Handling click and keyboard events that bubble up to React parent trees."
    ],
    eTitle: "Exam: Portal Container Registry Validator",
    eDesc: "Write a JS function `isModalAttached(modalRegistry, modalId)` returning true if `modalRegistry[modalId]?.isMounted === true` and `modalRegistry[modalId]?.target === 'body'`.",
    eStarter: "function isModalAttached(modalRegistry, modalId) {\n    // Write your code here\n    \n}",
    eHint: "Inspect modalRegistry properties with optional chaining.",
    eTest: "if (typeof isModalAttached !== 'function') throw new Error('isModalAttached not found');\nconst reg = { 'auth-modal': { isMounted: true, target: 'body' } };\nif (!isModalAttached(reg, 'auth-modal')) throw new Error('Portal check failed');\nif (isModalAttached(reg, 'nonexistent')) throw new Error('False positive on unmounted modal');",
    aTitle: "Assignment: Modal Focus Trap Traversal",
    aDesc: "Write a JS function `trapModalFocus(elementsCount, currentIndex, isShiftTab)` returning next focus index (loops around bounds).",
    aStarter: "function trapModalFocus(elementsCount, currentIndex, isShiftTab) {\n    // Write your code here\n    \n}",
    aHint: "If isShiftTab: prev index (wrap to count-1 if <0); else next index (wrap to 0 if >= count).",
    aTest: "if (typeof trapModalFocus !== 'function') throw new Error('trapModalFocus not found');\nif (trapModalFocus(3, 2, false) !== 0) throw new Error('Forward wrap failed');\nif (trapModalFocus(3, 0, true) !== 2) throw new Error('Backward wrap failed');"
  },
  {
    title: "Error Boundaries & Fallback UI",
    desc: "In vanilla React, an unhandled JavaScript error inside any component's render cycle unmounts the entire React component tree, resulting in a blank white screen for the user. Error Boundaries are special class components that implement componentDidCatch or static getDerivedStateFromError. They catch errors in child trees, log the telemetry to error trackers like Sentry, and render a graceful fallback UI. (Real world: If a single comment fails to render on Instagram, the post and video still work while showing a retry button for comments.)",
    syllabus: [
      "Error Boundary Mechanics: Catching render, lifecycle, and constructor errors in child components.",
      "Fallback UI Design: Presenting contextual recovery cards with retry actions instead of blank crashes.",
      "Error Telemetry Logging: Sending stack traces and user context to monitoring services."
    ],
    eTitle: "Exam: Safe Component Runner",
    eDesc: "Write a JS function `safeComponentRunner(renderFn, fallbackValue)` that calls `renderFn()`, returning its output, or returns `fallbackValue` if it throws an error.",
    eStarter: "function safeComponentRunner(renderFn, fallbackValue) {\n    // Write your code here\n    \n}",
    eHint: "Wrap renderFn in try-catch block.",
    eTest: "if (typeof safeComponentRunner !== 'function') throw new Error('safeComponentRunner not found');\nif (safeComponentRunner(() => 'Hello', 'Err') !== 'Hello') throw new Error('Normal render failed');\nif (safeComponentRunner(() => { throw new Error('Crash'); }, 'Fallback') !== 'Fallback') throw new Error('Error boundary fallback failed');",
    aTitle: "Assignment: Error Stack Sanitizer",
    aDesc: "Write a JS function `sanitizeErrorStackTrace(error)` returning `{ message: error.message, errorType: error.name, timestamp: Date.now() }`.",
    aStarter: "function sanitizeErrorStackTrace(error) {\n    // Write your code here\n    \n}",
    aHint: "Extract message and name from Error object.",
    aTest: "if (typeof sanitizeErrorStackTrace !== 'function') throw new Error('sanitizeErrorStackTrace not found');\nconst s = sanitizeErrorStackTrace(new TypeError('Invalid prop'));\nif (s.message !== 'Invalid prop' || s.errorType !== 'TypeError') throw new Error('Sanitization failed');"
  },
  {
    title: "Code Splitting & React.lazy / Suspense",
    desc: "In large enterprise applications, shipping a single massive JavaScript bundle (10MB+) causes slow page loads and poor Core Web Vitals. Code splitting breaks the application bundle into smaller chunks that load on demand. With React.lazy(() => import('./HeavyChart')) and <Suspense fallback={<Skeleton />}>, React loads heavy modules only when the user navigates to them, displaying smooth loading skeletons in the interim. (Real world: Google Docs loads the chart editor only when you click 'Insert Chart', keeping the document editor instant.)",
    syllabus: [
      "Dynamic Imports: Using import() syntax to trigger Webpack/Vite chunk splitting.",
      "React.lazy & Suspense: Wrapping dynamic components with fallback loading skeletons.",
      "Bundle Size & TTI Optimization: Reducing initial bundle footprint to improve Time-to-Interactive."
    ],
    eTitle: "Exam: Lazy Chunk Resolver",
    eDesc: "Write a JS function `resolveLazyChunk(chunkMap, chunkName)` that returns a Promise resolving `chunkMap[chunkName]`, or rejecting with `Error('Chunk not found')` if missing.",
    eStarter: "function resolveLazyChunk(chunkMap, chunkName) {\n    // Write your code here\n    \n}",
    eHint: "Return Promise that resolves or rejects based on chunk presence.",
    eTest: "if (typeof resolveLazyChunk !== 'function') throw new Error('resolveLazyChunk not found');\nresolveLazyChunk({ chart: { default: 'ChartComponent' } }, 'chart').then(c => {\n    if (c.default !== 'ChartComponent') throw new Error('Lazy resolve failed');\n});",
    aTitle: "Assignment: Loading Skeleton Slot Generator",
    aDesc: "Write a JS function `generateSkeletonSlots(count, height)` returning array of `{ id: 'slot_' + index, height, animation: 'pulse' }`.",
    aStarter: "function generateSkeletonSlots(count, height) {\n    // Write your code here\n    \n}",
    aHint: "Loop from 0 to count-1 and push slot objects.",
    aTest: "if (typeof generateSkeletonSlots !== 'function') throw new Error('generateSkeletonSlots not found');\nconst s = generateSkeletonSlots(3, 40);\nif (s.length !== 3 || s[0].height !== 40 || s[0].id !== 'slot_0') throw new Error('Slot generator failed');"
  },
  {
    title: "Forms & Controlled vs Uncontrolled Inputs",
    desc: "Managing form state correctly is essential for authentication, checkout, and search workflows. Controlled components bind input value to React state and update it via onChange, making React the single source of truth for immediate validation and formatting. Uncontrolled components store input values in the DOM and retrieve them using useRef or FormData, which is ideal for large complex forms and file uploaders. (Real world: Paytm credit card input automatically formats numbers into 4-digit groups and blocks non-numeric keystrokes.)",
    syllabus: [
      "Controlled Components: Two-way data binding with state-driven value and change handlers.",
      "Uncontrolled Components: Using useRef and new FormData(e.currentTarget) for low-overhead forms.",
      "Form Validation & Debouncing: Validating emails, password strength, and debouncing search queries."
    ],
    eTitle: "Exam: Registration Form Validator",
    eDesc: "Write a JS function `validateRegistrationForm(form)` returning `{ isValid: boolean, errors: { email?: string, password?: string } }`. Email must contain '@'; password must have length >= 8.",
    eStarter: "function validateRegistrationForm(form) {\n    // Write your code here\n    \n}",
    eHint: "Check email includes '@' and password.length >= 8.",
    eTest: "if (typeof validateRegistrationForm !== 'function') throw new Error('validateRegistrationForm not found');\nconst invalid = validateRegistrationForm({ email: 'bademail', password: '123' });\nif (invalid.isValid !== false || !invalid.errors.email || !invalid.errors.password) throw new Error('Validation failed on invalid form');\nconst valid = validateRegistrationForm({ email: 'user@pinit.ai', password: 'secure_password_123' });\nif (valid.isValid !== true) throw new Error('Validation failed on valid form');",
    aTitle: "Assignment: Credit Card Input Formatter",
    aDesc: "Write a JS function `formatCreditCardInput(rawDigits)` that strips non-digits and groups into 4-digit blocks separated by spaces (`XXXX XXXX XXXX XXXX`).",
    aStarter: "function formatCreditCardInput(rawDigits) {\n    // Write your code here\n    \n}",
    aHint: "Replace non-digits with '', match /.{1,4}/g, join with ' '.",
    aTest: "if (typeof formatCreditCardInput !== 'function') throw new Error('formatCreditCardInput not found');\nif (formatCreditCardInput('4111111111111111') !== '4111 1111 1111 1111') throw new Error('Card format failed');"
  },
  {
    title: "React Router v6 Navigation & URL State",
    desc: "Single-Page Applications (SPAs) simulate multi-page website navigation without triggering full browser reloads. React Router v6 provides client-side routing via <BrowserRouter>, <Routes>, and <Route>. It supports nested route layouts, dynamic URL parameters (/profile/:userId), query string management via useSearchParams, and programmatic navigation via useNavigate. (Real world: Amazon product pages allow sharing /product/9942?color=blue&size=L directly to friends.)",
    syllabus: [
      "Client-Side Routing: Intercepting link clicks to update URL and render matching component trees without reload.",
      "Dynamic Params & Query Strings: Reading URL parameters with useParams() and useSearchParams().",
      "Protected Route Guards: Redirecting unauthorized users to /login with return URL state."
    ],
    eTitle: "Exam: Dynamic URL Route Pattern Matcher",
    eDesc: "Write a JS function `matchRoutePattern(pattern, pathname)` matching `/users/:id` against `/users/42` returning `{ isMatch: true, params: { id: '42' } }`, or `{ isMatch: false, params: {} }` if not matching.",
    eStarter: "function matchRoutePattern(pattern, pathname) {\n    // Write your code here\n    \n}",
    eHint: "Split pattern and pathname by '/', match segment by segment.",
    eTest: "if (typeof matchRoutePattern !== 'function') throw new Error('matchRoutePattern not found');\nconst m = matchRoutePattern('/quests/:questId', '/quests/java-101');\nif (!m.isMatch || m.params.questId !== 'java-101') throw new Error('Pattern match failed');\nif (matchRoutePattern('/quests/:id', '/profile').isMatch) throw new Error('False positive match');",
    aTitle: "Assignment: Query String Object Serializer",
    aDesc: "Write a JS function `buildQueryString(params)` returning URL query string (e.g., `?tab=quests&level=2`). Return empty string if object is empty.",
    aStarter: "function buildQueryString(params) {\n    // Write your code here\n    \n}",
    aHint: "Use Object.entries and URLSearchParams or encodeURIComponent.",
    aTest: "if (typeof buildQueryString !== 'function') throw new Error('buildQueryString not found');\nif (buildQueryString({ tab: 'settings', page: '1' }) !== '?tab=settings&page=1') throw new Error('Query serializer failed');"
  },
  {
    title: "Server-Side Rendering (SSR) Principles",
    desc: "Traditional Client-Side Rendered (CSR) SPAs send an empty <div id=\"root\"></div> to the browser, requiring the client to download JavaScript, parse it, and fetch API data before any content appears. Server-Side Rendering (SSR) executes the React component tree on the server on every request, sending fully populated HTML to the browser for instant First Contentful Paint (FCP) and optimal SEO. The browser then downloads the JavaScript bundle and attaches event listeners—a process called Hydration. (Real world: E-commerce product pages render server-side so Googlebot can index prices and titles immediately.)",
    syllabus: [
      "CSR vs SSR Comparison: Analyzing TTFB, FCP, LCP, and SEO indexability tradeoffs.",
      "Server HTML Generation: How React renders component trees to static HTML strings on the server.",
      "Client-Side Hydration: How React binds event handlers to pre-rendered server DOM nodes."
    ],
    eTitle: "Exam: SSR Markup & State Hydrator",
    eDesc: "Write a JS function `hydrateMarkup(serverHtml, clientState)` returning object `{ html: serverHtml, state: clientState, hydrated: true }`.",
    eStarter: "function hydrateMarkup(serverHtml, clientState) {\n    // Write your code here\n    \n}",
    eHint: "Return object combining serverHtml and clientState with hydrated: true.",
    eTest: "if (typeof hydrateMarkup !== 'function') throw new Error('hydrateMarkup not found');\nconst h = hydrateMarkup('<h1>Title</h1>', { user: 'Alex' });\nif (h.html !== '<h1>Title</h1>' || h.state.user !== 'Alex' || !h.hydrated) throw new Error('Hydration failed');",
    aTitle: "Assignment: SSR Performance Health Score Calculator",
    aDesc: "Write a JS function `calculateSSRMetrics(ttfb, fcp, hydrationTime)` returning score (100 - (ttfb*0.05 + fcp*0.02 + hydrationTime*0.03)) clamped between 0 and 100.",
    aStarter: "function calculateSSRMetrics(ttfb, fcp, hydrationTime) {\n    // Write your code here\n    \n}",
    aHint: "Calculate score and use Math.max(0, Math.min(100, score)).",
    aTest: "if (typeof calculateSSRMetrics !== 'function') throw new Error('calculateSSRMetrics not found');\nconst score = calculateSSRMetrics(100, 200, 300);\nif (score !== 82) throw new Error('Metrics score mismatch');"
  },
  {
    title: "Next.js App Router & React Server Components (RSC)",
    desc: "Next.js App Router introduces React Server Components (RSC)—a revolutionary architecture where components execute exclusively on the server by default and ship zero JavaScript to the client bundle. Server Components can fetch data directly from databases, read filesystem files, and access secret API keys securely. When interactivity (like useState, onClick, or useEffect) is needed, you explicitly mark the component with the 'use client' directive at the top of the file. (Real world: Vercel dashboard renders heavy analytics charts on the server with zero client bundle overhead.)",
    syllabus: [
      "App Router Architecture: Folder-based routing inside the app/ directory (page.tsx, layout.tsx).",
      "React Server Components (RSC): Server-only components that fetch data securely and ship 0kb client JS.",
      "'use client' Boundary: Defining the exact line where client-side interactivity begins."
    ],
    eTitle: "Exam: Server Component Metadata Inspector",
    eDesc: "Write a JS function `isServerComponent(componentMetadata)` returning true if `componentMetadata.isServer === true` and `componentMetadata.hasClientDirective === false`.",
    eStarter: "function isServerComponent(componentMetadata) {\n    // Write your code here\n    \n}",
    eHint: "Check isServer is true and hasClientDirective is false.",
    eTest: "if (typeof isServerComponent !== 'function') throw new Error('isServerComponent not found');\nif (!isServerComponent({ isServer: true, hasClientDirective: false })) throw new Error('Server component check failed');\nif (isServerComponent({ isServer: true, hasClientDirective: true })) throw new Error('Client component misidentified');",
    aTitle: "Assignment: Client Props Sanitizer",
    aDesc: "Write a JS function `filterServerProps(props, allowedClientKeys)` returning new object containing only keys listed in allowedClientKeys array.",
    aStarter: "function filterServerProps(props, allowedClientKeys) {\n    // Write your code here\n    \n}",
    aHint: "Reduce allowedClientKeys into output object.",
    aTest: "if (typeof filterServerProps !== 'function') throw new Error('filterServerProps not found');\nconst clean = filterServerProps({ dbSecret: 'xyz', title: 'Home', count: 5 }, ['title', 'count']);\nif (clean.dbSecret !== undefined || clean.title !== 'Home') throw new Error('Props sanitization failed');"
  },
  {
    title: "Next.js Dynamic Routing & Nested Layouts",
    desc: "Next.js App Router provides flexible layout composition. A layout.tsx file wraps child pages, preserving state, scroll position, and navigation headers across page transitions without re-rendering. Nested layouts allow sub-sections (e.g. /dashboard/settings) to have their own sidebars inside the master layout. Dynamic route segments (app/blog/[slug]/page.tsx) and catch-all segments (app/docs/[...slug]/page.tsx) handle variable URL paths effortlessly. (Real world: GitHub dashboard keeps the master top navigation and repository sidebar intact while switching between Code, Issues, and PR tabs.)",
    syllabus: [
      "Nested Layout Hierarchies: Composing app/layout.tsx and app/dashboard/layout.tsx.",
      "Dynamic Route Folders: Using [id] and [...slug] to capture URL segments.",
      "Loading & Error State Files: Using loading.tsx and error.tsx for automated Suspense and Error Boundaries."
    ],
    eTitle: "Exam: Nested Layout Tree Composer",
    eDesc: "Write a JS function `composeLayout(parentLayout, childContent)` returning `{ layoutId: parentLayout.id, wrapped: true, content: childContent }`.",
    eStarter: "function composeLayout(parentLayout, childContent) {\n    // Write your code here\n    \n}",
    eHint: "Return wrapper object containing layoutId, wrapped: true, and content.",
    eTest: "if (typeof composeLayout !== 'function') throw new Error('composeLayout not found');\nconst c = composeLayout({ id: 'dashboard_layout' }, 'ProfilePageContent');\nif (c.layoutId !== 'dashboard_layout' || !c.wrapped || c.content !== 'ProfilePageContent') throw new Error('Layout compose failed');",
    aTitle: "Assignment: Catch-All Slug Breadcrumb Builder",
    aDesc: "Write a JS function `parseCatchAllSegments(slugArray)` returning breadcrumb array of `{ label: segment.toUpperCase(), path: '/' + segment }`.",
    aStarter: "function parseCatchAllSegments(slugArray) {\n    // Write your code here\n    \n}",
    aHint: "Map slugArray elements into label and path objects.",
    aTest: "if (typeof parseCatchAllSegments !== 'function') throw new Error('parseCatchAllSegments not found');\nconst b = parseCatchAllSegments(['docs', 'api']);\nif (b.length !== 2 || b[0].label !== 'DOCS' || b[1].path !== '/api') throw new Error('Breadcrumb parse failed');"
  },
  {
    title: "Static Site Generation (SSG) & ISR",
    desc: "Static Site Generation (SSG) pre-renders pages into static HTML files at build time, serving them directly from global CDN edge networks in under 20 milliseconds. For websites with millions of pages (e.g. news sites, blog platforms, e-commerce catalogs), rebuilding the entire site on every content update is impossible. Incremental Static Regeneration (ISR) solves this by re-rendering individual static pages in the background when requests arrive after a configured revalidate time window. (Real world: Shopify product catalogs serve millions of static pages from CDN edge caches while updating stock counts every 60 seconds via ISR.)",
    syllabus: [
      "Static Site Generation (SSG): Pre-rendering HTML with generateStaticParams.",
      "Incremental Static Regeneration (ISR): Using export const revalidate = 60 for background edge page regeneration.",
      "CDN Edge Caching: Serving pre-built HTML worldwide with sub-50ms latency."
    ],
    eTitle: "Exam: ISR Revalidation Engine Status",
    eDesc: "Write a JS function `calculateRevalidateStatus(lastGeneratedAt, revalidateSeconds, currentTimestamp)` returning `{ isStale: boolean, shouldRegenerate: boolean }`.",
    eStarter: "function calculateRevalidateStatus(lastGeneratedAt, revalidateSeconds, currentTimestamp) {\n    // Write your code here\n    \n}",
    eHint: "Check if (currentTimestamp - lastGeneratedAt) >= (revalidateSeconds * 1000).",
    eTest: "if (typeof calculateRevalidateStatus !== 'function') throw new Error('calculateRevalidateStatus not found');\nconst s = calculateRevalidateStatus(1000, 60, 62000);\nif (s.isStale !== true || s.shouldRegenerate !== true) throw new Error('Stale ISR calculation failed');\nconst fresh = calculateRevalidateStatus(1000, 60, 10000);\nif (fresh.isStale !== false) throw new Error('Fresh ISR calculation failed');",
    aTitle: "Assignment: Static Paths Parameter Generator",
    aDesc: "Write a JS function `generateStaticPathsList(itemIds)` returning array of `{ params: { id: String(id) } }`.",
    aStarter: "function generateStaticPathsList(itemIds) {\n    // Write your code here\n    \n}",
    aHint: "Map itemIds into params wrapper objects.",
    aTest: "if (typeof generateStaticPathsList !== 'function') throw new Error('generateStaticPathsList not found');\nconst p = generateStaticPathsList([101, 102]);\nif (p.length !== 2 || p[0].params.id !== '101') throw new Error('Paths generator failed');"
  },
  {
    title: "Next.js API Routes & Route Handlers",
    desc: "Next.js allows you to build full-stack backend APIs directly inside the app/api/ folder using Route Handlers (route.ts). You export standard async HTTP methods (GET, POST, PUT, DELETE, PATCH). Route Handlers use standard Web APIs (Request and Response) and provide convenience helpers like NextResponse.json(). They run in Node.js or Edge runtimes, enabling database queries, authentication verification, and webhook handling. (Real world: Stripe payment webhook handlers verify digital signatures and credit user accounts.)",
    syllabus: [
      "Route Handler Syntax: Writing export async function POST(request: Request).",
      "Request Payload Parsing: Reading JSON bodies with await request.json() and parsing search parameters.",
      "Response Serialization & Status Codes: Returning NextResponse.json(data, { status: 201 })."
    ],
    eTitle: "Exam: Standardized API Response Builder",
    eDesc: "Write a JS function `buildApiResponse(payload, statusCode, headers)` returning `{ status: statusCode || 200, data: payload, headers: headers || { 'Content-Type': 'application/json' } }`.",
    eStarter: "function buildApiResponse(payload, statusCode, headers) {\n    // Write your code here\n    \n}",
    eHint: "Return object wrapping status, data, and headers.",
    eTest: "if (typeof buildApiResponse !== 'function') throw new Error('buildApiResponse not found');\nconst res = buildApiResponse({ success: true }, 201);\nif (res.status !== 201 || !res.data.success || res.headers['Content-Type'] !== 'application/json') throw new Error('API response builder failed');",
    aTitle: "Assignment: Bearer Authorization Header Parser",
    aDesc: "Write a JS function `parseAuthorizationHeader(authHeader)` returning Bearer token string, or null if header is missing or does not start with 'Bearer '.",
    aStarter: "function parseAuthorizationHeader(authHeader) {\n    // Write your code here\n    \n}",
    aHint: "Check startsWith('Bearer ') and slice(7).",
    aTest: "if (typeof parseAuthorizationHeader !== 'function') throw new Error('parseAuthorizationHeader not found');\nif (parseAuthorizationHeader('Bearer token_xyz_123') !== 'token_xyz_123') throw new Error('Token extract failed');\nif (parseAuthorizationHeader('Basic 123') !== null) throw new Error('Invalid scheme not rejected');"
  },
  {
    title: "Authentication & Protected Middleware",
    desc: "Protecting sensitive dashboard routes requires verifying user authentication before rendering pages. Next.js Edge Middleware (middleware.ts) runs at the CDN edge before a request is completed. It intercepts incoming HTTP requests, verifies JSON Web Tokens (JWT) or session cookies, and either allows the request to proceed via NextResponse.next() or redirects unauthorized users to the /login page with a return URL. (Real world: Banking dashboards check session cookies on every request and redirect expired sessions to biometric re-login.)",
    syllabus: [
      "Edge Middleware Execution: Intercepting requests at the CDN edge before hitting page routes.",
      "Cookie-Based Session Auth: Verifying signed HTTP-only cookies and JWT tokens.",
      "Route Matcher Configuration: Defining route filters via matcher: ['/dashboard/:path*', '/settings/:path*']."
    ],
    eTitle: "Exam: Edge JWT Token Verifier",
    eDesc: "Write a JS function `verifyAuthToken(token, expectedRole)` returning true if `token.role === expectedRole` and `token.exp > Date.now()`.",
    eStarter: "function verifyAuthToken(token, expectedRole) {\n    // Write your code here\n    \n}",
    eHint: "Verify role match and exp is in the future.",
    eTest: "if (typeof verifyAuthToken !== 'function') throw new Error('verifyAuthToken not found');\nconst valid = verifyAuthToken({ role: 'ADMIN', exp: Date.now() + 10000 }, 'ADMIN');\nif (valid !== true) throw new Error('Valid token rejected');\nconst expired = verifyAuthToken({ role: 'ADMIN', exp: Date.now() - 10000 }, 'ADMIN');\nif (expired !== false) throw new Error('Expired token accepted');",
    aTitle: "Assignment: Middleware Protected Route Matcher",
    aDesc: "Write a JS function `matchMiddlewarePath(pathname, protectedRoutes)` returning true if pathname starts with any pattern in protectedRoutes array.",
    aStarter: "function matchMiddlewarePath(pathname, protectedRoutes) {\n    // Write your code here\n    \n}",
    aHint: "Use protectedRoutes.some(route => pathname.startsWith(route)).",
    aTest: "if (typeof matchMiddlewarePath !== 'function') throw new Error('matchMiddlewarePath not found');\nif (!matchMiddlewarePath('/dashboard/settings', ['/dashboard', '/admin'])) throw new Error('Protected route match failed');\nif (matchMiddlewarePath('/about', ['/dashboard'])) throw new Error('Public route misidentified');"
  },
  {
    title: "Optimistic UI Updates & Fast Feedback",
    desc: "Waiting for network latency (200ms–1500ms) before updating the user interface makes applications feel sluggish. Optimistic UI is a design pattern where the client interface updates instantly as if the server request has already succeeded. The application sends the mutation request in the background. If the request succeeds, the local state is finalized; if the request fails, the state automatically rolls back to the previous snapshot and displays an error toast. (Real world: Twitter/X like buttons turn red and increment instantly when clicked.)",
    syllabus: [
      "Optimistic UI Architecture: Instant client state mutation followed by background network sync.",
      "Rollback Mechanisms: Storing state snapshots to undo mutations on network failure.",
      "React 19 useOptimistic: Managing transient optimistic state alongside server data."
    ],
    eTitle: "Exam: Optimistic Item List Manager",
    eDesc: "Write a JS function `applyOptimisticUpdate(list, newItem, tempId)` returning new list with newItem added and flagged with `pending: true, tempId`.",
    eStarter: "function applyOptimisticUpdate(list, newItem, tempId) {\n    // Write your code here\n    \n}",
    eHint: "Return [...list, { ...newItem, tempId, pending: true }].",
    eTest: "if (typeof applyOptimisticUpdate !== 'function') throw new Error('applyOptimisticUpdate not found');\nconst opt = applyOptimisticUpdate([{ id: 1 }], { title: 'New' }, 'temp_99');\nif (opt.length !== 2 || opt[1].tempId !== 'temp_99' || !opt[1].pending) throw new Error('Optimistic append failed');",
    aTitle: "Assignment: Optimistic State Rollback Handler",
    aDesc: "Write a JS function `rollbackState(currentList, snapshotList)` returning snapshotList clone on mutation error.",
    aStarter: "function rollbackState(currentList, snapshotList) {\n    // Write your code here\n    \n}",
    aHint: "Return [...snapshotList].",
    aTest: "if (typeof rollbackState !== 'function') throw new Error('rollbackState not found');\nconst snap = [{ id: 1 }];\nconst roll = rollbackState([{ id: 1 }, { id: 2, pending: true }], snap);\nif (roll.length !== 1 || roll[0].id !== 1) throw new Error('Rollback failed');"
  },
  {
    title: "React 19 Server Actions & useActionState",
    desc: "React 19 introduces Server Actions—asynchronous functions that execute securely on the server and can be invoked directly from client forms or button handlers without writing manual REST API endpoints. Combined with the useActionState hook, React automatically tracks pending submission states (isPending), validation errors, and return payloads, simplifying full-stack data mutation. (Real world: Submitting a job application form sends uploaded resumes directly to S3 and database in a single typed Server Action.)",
    syllabus: [
      "'use server' Directive: Defining server-only execution functions callable from client UI.",
      "useActionState Hook: Managing form mutation state, pending flags, and error responses.",
      "Server-Side Form Validation: Validating FormData on the server and returning typed error messages."
    ],
    eTitle: "Exam: Server Action Form Payload Processor",
    eDesc: "Write a JS function `processServerAction(formData)` returning `{ success: true, recordId: 'REC_' + formData.userId, processedAt: Date.now() }` if `formData.userId` is present; else `{ success: false, error: 'Missing userId' }`.",
    eStarter: "function processServerAction(formData) {\n    // Write your code here\n    \n}",
    eHint: "Check formData.userId, return success or error object.",
    eTest: "if (typeof processServerAction !== 'function') throw new Error('processServerAction not found');\nconst s = processServerAction({ userId: '99' });\nif (!s.success || s.recordId !== 'REC_99') throw new Error('Server action failed');\nconst f = processServerAction({});\nif (f.success !== false) throw new Error('Missing ID not rejected');",
    aTitle: "Assignment: Action State Form Data Extractor",
    aDesc: "Write a JS function `extractFormDataValues(formDataObj, requiredKeys)` returning extracted object if all keys exist, or null if any required key is missing.",
    aStarter: "function extractFormDataValues(formDataObj, requiredKeys) {\n    // Write your code here\n    \n}",
    aHint: "Loop requiredKeys, check presence in formDataObj.",
    aTest: "if (typeof extractFormDataValues !== 'function') throw new Error('extractFormDataValues not found');\nconst res = extractFormDataValues({ name: 'A', email: 'a@b.com' }, ['name', 'email']);\nif (!res || res.name !== 'A') throw new Error('Extract failed');\nif (extractFormDataValues({ name: 'A' }, ['name', 'phone']) !== null) throw new Error('Missing key not caught');"
  },
  {
    title: "Zustand Global State Management",
    desc: "While React Context works well for low-frequency global data (like themes or auth), high-frequency state updates cause all consuming components to re-render. Zustand is a minimalist, high-performance state management library based on the Flux architecture. It creates a centralized store with create(), allows components to subscribe to specific slices of state via selectors (useStore(state => state.cartCount)), and supports middleware for automatic localStorage persistence and DevTools tracking. (Real world: Figma canvas coordinates update at 120 FPS using Zustand without re-rendering the sidebar toolbar.)",
    syllabus: [
      "Zustand Store Creation: Defining state variables and action methods in a unified store.",
      "Selective Subscriptions: Subscribing to specific state slices to prevent unnecessary component re-renders.",
      "Middleware Integration: Adding localStorage persistence with the persist middleware."
    ],
    eTitle: "Exam: Lightweight Zustand Store Core",
    eDesc: "Write a JS function `createZustandStore(initialState)` returning `{ getState: () => state, setState: (fnOrObj) => void, subscribe: (listener) => unsubscribe }`.",
    eStarter: "function createZustandStore(initialState) {\n    // Write your code here\n    \n}",
    eHint: "Maintain internal state and listeners set; notify on setState.",
    eTest: "if (typeof createZustandStore !== 'function') throw new Error('createZustandStore not found');\nconst store = createZustandStore({ pins: 100 });\nstore.setState({ pins: 125 });\nif (store.getState().pins !== 125) throw new Error('Store state update failed');",
    aTitle: "Assignment: Zustand Selector Slice Extractor",
    aDesc: "Write a JS function `extractStoreSlice(storeState, selectorFn)` returning `selectorFn(storeState)`.",
    aStarter: "function extractStoreSlice(storeState, selectorFn) {\n    // Write your code here\n    \n}",
    aHint: "Invoke selectorFn passing storeState.",
    aTest: "if (typeof extractStoreSlice !== 'function') throw new Error('extractStoreSlice not found');\nconst count = extractStoreSlice({ cart: { items: [1, 2, 3] } }, s => s.cart.items.length);\nif (count !== 3) throw new Error('Selector slice extraction failed');"
  },
  {
    title: "TanStack Query (React Query) Caching",
    desc: "Managing asynchronous server state in client React applications (handling loading spinners, caching data, deduping identical requests, and refetching on window focus) requires hundreds of lines of boilerplate with vanilla useEffect. TanStack Query manages server state automatically. Using useQuery({ queryKey: ['users'], queryFn: fetchUsers }), it caches responses in memory, serves cached data instantly, refetches stale data in the background, and invalidates queries after mutations with useMutation. (Real world: Discord channel messages load instantly from cache and refresh in the background.)",
    syllabus: [
      "Server State vs Client State: Understanding why async server data requires specialized caching.",
      "useQuery & Query Keys: Caching responses by key, configuring staleTime and gcTime.",
      "useMutation & Invalidation: Updating data on the server and triggering queryClient.invalidateQueries()."
    ],
    eTitle: "Exam: Query Cache Lookup & Stale Evaluator",
    eDesc: "Write a JS function `queryCacheLookup(cache, queryKey, staleTimeMs, currentTimestamp)` returning `{ data: entry.data, isStale: boolean }` if cached; else `null`.",
    eStarter: "function queryCacheLookup(cache, queryKey, staleTimeMs, currentTimestamp) {\n    // Write your code here\n    \n}",
    eHint: "Check if (currentTimestamp - entry.updatedAt) > staleTimeMs.",
    eTest: "if (typeof queryCacheLookup !== 'function') throw new Error('queryCacheLookup not found');\nconst cache = { 'profile_1': { data: { name: 'Alex' }, updatedAt: 1000 } };\nconst res = queryCacheLookup(cache, 'profile_1', 5000, 2000);\nif (res.data.name !== 'Alex' || res.isStale !== false) throw new Error('Fresh query cache lookup failed');\nconst stale = queryCacheLookup(cache, 'profile_1', 5000, 8000);\nif (stale.isStale !== true) throw new Error('Stale query calculation failed');",
    aTitle: "Assignment: Query Key Invalidation Matcher",
    aDesc: "Write a JS function `invalidateQueryKey(cache, targetPrefix)` deleting all keys in cache starting with targetPrefix; returning count of deleted keys.",
    aStarter: "function invalidateQueryKey(cache, targetPrefix) {\n    // Write your code here\n    \n}",
    aHint: "Loop Object.keys, delete matching keys, count deletions.",
    aTest: "if (typeof invalidateQueryKey !== 'function') throw new Error('invalidateQueryKey not found');\nconst c = { 'users_1': {}, 'users_2': {}, 'posts_1': {} };\nconst count = invalidateQueryKey(c, 'users_');\nif (count !== 2 || c.users_1 !== undefined || c.posts_1 === undefined) throw new Error('Cache invalidation failed');"
  },
  {
    title: "Micro-Frontend Webpack Module Federation",
    desc: "In large enterprise engineering teams with hundreds of developers, building a single monolithic frontend application slows down CI/CD deployment pipelines. Micro-Frontend architecture splits the application into independent micro-apps (e.g. Navbar App, Checkout App, Analytics App). Webpack Module Federation allows one React application to dynamically import and render live components from another deployed application at runtime across different domains with shared dependencies. (Real world: Amazon.com header, search bar, and cart checkout are independently deployed micro-frontends.)",
    syllabus: [
      "Micro-Frontend Concepts: Decomposing frontend monoliths into independently deployed micro-apps.",
      "Webpack Module Federation: Configuring remotes, exposes, and shared singletons (react, react-dom).",
      "Dynamic Remote Loading: Loading external component scripts asynchronously with fallback boundaries."
    ],
    eTitle: "Exam: Module Federation Container Registry",
    eDesc: "Write a JS function `resolveRemoteModule(registry, remoteScope, moduleName)` returning `{ url: registry[remoteScope].url, module: moduleName, loaded: true }` if present; else throw Error.",
    eStarter: "function resolveRemoteModule(registry, remoteScope, moduleName) {\n    // Write your code here\n    \n}",
    eHint: "Verify registry[remoteScope] exists and return resolution object.",
    eTest: "if (typeof resolveRemoteModule !== 'function') throw new Error('resolveRemoteModule not found');\nconst reg = { 'navbar_app': { url: 'https://cdn.pinit.ai/nav.js' } };\nconst res = resolveRemoteModule(reg, 'navbar_app', 'Header');\nif (res.url !== 'https://cdn.pinit.ai/nav.js' || res.module !== 'Header') throw new Error('Remote module resolve failed');",
    aTitle: "Assignment: Shared Dependency Version Compatibility Checker",
    aDesc: "Write a JS function `verifySharedDependencies(hostVersion, remoteVersion)` returning true if major versions match (e.g. '^18.2.0' and '^18.0.0').",
    aStarter: "function verifySharedDependencies(hostVersion, remoteVersion) {\n    // Write your code here\n    \n}",
    aHint: "Extract major version integer (stripping '^', '~') and compare.",
    aTest: "if (typeof verifySharedDependencies !== 'function') throw new Error('verifySharedDependencies not found');\nif (!verifySharedDependencies('^18.2.0', '^18.0.0')) throw new Error('Major version match failed');\nif (verifySharedDependencies('^18.0.0', '^17.0.0')) throw new Error('Mismatched major version allowed');"
  },
  {
    title: "WebSocket & Realtime Live Sync",
    desc: "HTTP requests follow a unidirectional request-response cycle where the client must poll the server for updates. WebSockets establish a persistent, full-duplex TCP connection between client and server, allowing the server to push real-time events to the React application instantly with minimal latency. In React, WebSocket connections are managed inside useEffect with auto-reconnection logic, heartbeat ping/pong cycles, and event dispatcher subscriptions. (Real world: Binance live crypto trading order-books update thousands of bids and asks per second via WebSockets.)",
    syllabus: [
      "Full-Duplex Communication: Comparing HTTP Polling vs Server-Sent Events (SSE) vs WebSockets.",
      "React WebSocket Lifecycle: Managing connection opening, message parsing, and clean socket closure.",
      "Reconnection Strategies: Implementing exponential backoff algorithms for network dropouts."
    ],
    eTitle: "Exam: Real-Time Event Dispatcher",
    eDesc: "Write a JS function `dispatchWebSocketMessage(channelListeners, eventType, payload)` that invokes all callback functions subscribed to `eventType` passing `payload`.",
    eStarter: "function dispatchWebSocketMessage(channelListeners, eventType, payload) {\n    // Write your code here\n    \n}",
    eHint: "Get array from channelListeners[eventType] and forEach fn(payload).",
    eTest: "if (typeof dispatchWebSocketMessage !== 'function') throw new Error('dispatchWebSocketMessage not found');\nlet val = 0;\nconst listeners = { 'PRICE_UPDATE': [p => val = p.price] };\ndispatchWebSocketMessage(listeners, 'PRICE_UPDATE', { price: 500 });\nif (val !== 500) throw new Error('WebSocket event dispatch failed');",
    aTitle: "Assignment: Exponential Backoff Calculator",
    aDesc: "Write a JS function `calculateBackoffDelay(retryAttempt, baseMs, maxMs)` returning `Math.min(maxMs, baseMs * Math.pow(2, retryAttempt))`.",
    aStarter: "function calculateBackoffDelay(retryAttempt, baseMs, maxMs) {\n    // Write your code here\n    \n}",
    aHint: "Calculate baseMs * 2^attempt and clamp to maxMs.",
    aTest: "if (typeof calculateBackoffDelay !== 'function') throw new Error('calculateBackoffDelay not found');\nif (calculateBackoffDelay(3, 1000, 10000) !== 8000) throw new Error('Backoff math mismatch');\nif (calculateBackoffDelay(5, 1000, 10000) !== 10000) throw new Error('Max clamp failed');"
  },
  {
    title: "Tailwind CSS & Component Design Systems",
    desc: "Writing traditional global CSS or fragmented CSS Modules leads to specificity conflicts, unused styles, and large CSS bundles. Tailwind CSS is a utility-first CSS framework that compiles utility classes directly in your JSX. By combining Tailwind with clsx and tailwind-merge (cn helper), you can build scalable, themeable component design systems (Buttons, Cards, Inputs, Modals) with responsive breakpoints and dark mode support with zero runtime CSS overhead. (Real world: Vercel, OpenAI, and GitHub design systems use utility tokens for crisp consistent UI styling.)",
    syllabus: [
      "Utility-First Styling: Writing responsive, pseudo-class (hover:, focus:) styles inline in JSX.",
      "Dynamic Class Merging: Using clsx and tailwind-merge to resolve conflicting Tailwind classes.",
      "Design Tokens & Dark Mode: Configuring color palettes, typography scales, and dark: variant classes."
    ],
    eTitle: "Exam: Tailwind Class Conflict Resolver",
    eDesc: "Write a JS function `mergeTailwindClasses(baseClasses, overrideClasses)` that splits class strings, overrides matching prefixes (e.g. `p-4` replaced by `p-2`), and returns merged class string.",
    eStarter: "function mergeTailwindClasses(baseClasses, overrideClasses) {\n    // Write your code here\n    \n}",
    eHint: "Track prefixes like 'p-', 'bg-', 'text-' and replace matching keys.",
    eTest: "if (typeof mergeTailwindClasses !== 'function') throw new Error('mergeTailwindClasses not found');\nconst m = mergeTailwindClasses('p-4 text-white bg-blue-500', 'p-2 bg-red-500');\nif (m.includes('p-4') || !m.includes('p-2') || !m.includes('bg-red-500') || !m.includes('text-white')) throw new Error('Class conflict merge failed');",
    aTitle: "Assignment: Design Token CSS Variable Compiler",
    aDesc: "Write a JS function `generateThemeTokens(tokensObj)` returning string of CSS variable declarations (`--primary: #6366f1;`).",
    aStarter: "function generateThemeTokens(tokensObj) {\n    // Write your code here\n    \n}",
    aHint: "Map Object.entries into `--key: value;` strings and join.",
    aTest: "if (typeof generateThemeTokens !== 'function') throw new Error('generateThemeTokens not found');\nconst css = generateThemeTokens({ primary: '#6366f1', radius: '8px' });\nif (!css.includes('--primary: #6366f1;') || !css.includes('--radius: 8px;')) throw new Error('Token compiler failed');"
  },
  {
    title: "Web Vitals & Frontend Performance Optimization",
    desc: "Google ranks websites based on Core Web Vitals metrics: Largest Contentful Paint (LCP < 2.5s for loading speed), Interaction to Next Paint (INP < 200ms for input responsiveness), and Cumulative Layout Shift (CLS < 0.1 for visual stability). Optimizing React apps involves next/image responsive compression, font optimization (next/font), eliminating render-blocking scripts, and tree-shaking unused package exports. (Real world: Improving LCP by 1 second increases e-commerce conversion rates by 20%.)",
    syllabus: [
      "Core Web Vitals Metrics: Deep dive into LCP, INP, FID, and CLS measurement and thresholds.",
      "Asset Optimization: Next.js Image component (<Image />), WebP/AVIF formats, and font preloading.",
      "Bundle Analysis & Tree Shaking: Analyzing bundle size with @next/bundle-analyzer and eliminating dead code."
    ],
    eTitle: "Exam: Cumulative Layout Shift (CLS) Accumulator",
    eDesc: "Write a JS function `calculateCLS(shifts)` summing `shift.value` where `shift.hadRecentInput === false` and rounding to 3 decimal places.",
    eStarter: "function calculateCLS(shifts) {\n    // Write your code here\n    \n}",
    eHint: "Filter hadRecentInput === false and sum values.",
    eTest: "if (typeof calculateCLS !== 'function') throw new Error('calculateCLS not found');\nconst cls = calculateCLS([{ value: 0.05, hadRecentInput: false }, { value: 0.10, hadRecentInput: true }, { value: 0.02, hadRecentInput: false }]);\nif (cls !== 0.07) throw new Error('CLS calculation mismatch');",
    aTitle: "Assignment: Core Web Vitals Health Checker",
    aDesc: "Write a JS function `isCoreWebVitalsPassing(metrics)` returning true if `metrics.lcp <= 2500` (ms), `metrics.inp <= 200` (ms), and `metrics.cls <= 0.1`.",
    aStarter: "function isCoreWebVitalsPassing(metrics) {\n    // Write your code here\n    \n}",
    aHint: "Check all three thresholds with boolean AND.",
    aTest: "if (typeof isCoreWebVitalsPassing !== 'function') throw new Error('isCoreWebVitalsPassing not found');\nif (!isCoreWebVitalsPassing({ lcp: 2100, inp: 150, cls: 0.05 })) throw new Error('Passing metrics rejected');\nif (isCoreWebVitalsPassing({ lcp: 3000, inp: 150, cls: 0.05 })) throw new Error('Failing LCP accepted');"
  },
  {
    title: "Storybook & UI Component Isolation",
    desc: "Building UI components inside a massive application requires clicking through login screens and complex page flows just to test a single button variant. Storybook provides an isolated sandbox environment where you can develop, test, and document UI components outside your main application. Each component state (Default, Loading, Disabled, Error) is written as a 'Story', enabling visual regression testing and interactive prop tweaking with controls. (Real world: Airbnb and Shopify design teams maintain Storybook catalogs to preview all UI components across teams.)",
    syllabus: [
      "Component Driven Development (CDD): Building UI from bottom-up in complete isolation.",
      "Writing Stories (.stories.tsx): Defining component stories with default args and template controls.",
      "Visual Regression Testing: Catching unintended CSS and layout regressions across component variants."
    ],
    eTitle: "Exam: Storybook Story Args Resolver",
    eDesc: "Write a JS function `buildStoryArgs(defaultArgs, overrideArgs)` returning merged object `{ ...defaultArgs, ...overrideArgs, isStorybookPreview: true }`.",
    eStarter: "function buildStoryArgs(defaultArgs, overrideArgs) {\n    // Write your code here\n    \n}",
    eHint: "Spread defaultArgs, overrideArgs, and set isStorybookPreview: true.",
    eTest: "if (typeof buildStoryArgs !== 'function') throw new Error('buildStoryArgs not found');\nconst s = buildStoryArgs({ variant: 'primary' }, { variant: 'danger' });\nif (s.variant !== 'danger' || !s.isStorybookPreview) throw new Error('Story args merge failed');",
    aTitle: "Assignment: Story Metadata Schema Validator",
    aDesc: "Write a JS function `validateStoryMetadata(meta)` returning true if `typeof meta.title === 'string'` and `Boolean(meta.component)`.",
    aStarter: "function validateStoryMetadata(meta) {\n    // Write your code here\n    \n}",
    aHint: "Check typeof meta.title and Boolean(meta.component).",
    aTest: "if (typeof validateStoryMetadata !== 'function') throw new Error('validateStoryMetadata not found');\nif (!validateStoryMetadata({ title: 'UI/Button', component: () => {} })) throw new Error('Valid story rejected');\nif (validateStoryMetadata({ title: 123 })) throw new Error('Invalid title accepted');"
  },
  {
    title: "React Testing Library & Vitest",
    desc: "Testing implementation details (like internal state names or private method calls) makes tests brittle and prone to breaking during refactors. React Testing Library enforces testing from the user's perspective: querying elements by accessible roles (screen.getByRole('button', { name: /submit/i })), simulating real user events (userEvent.click()), and asserting visible text output. Vitest provides blazing-fast unit and integration test execution with native TypeScript and ESM support. (Real world: Stripe CI pipelines run 5,000 automated RTL tests on every pull request before deployment.)",
    syllabus: [
      "User-Centric Testing Philosophy: Querying DOM by accessible roles and text rather than class names.",
      "Simulating User Interactions: Triggering clicks, typing, and keyboard navigation with @testing-library/user-event.",
      "Mocking APIs with MSW (Mock Service Worker): Intercepting network requests to test loading and error states cleanly."
    ],
    eTitle: "Exam: DOM Accessibility Role Matcher",
    eDesc: "Write a JS function `assertElementInDocument(domTree, role, name)` that searches an array of DOM nodes and returns true if any node has `node.role === role` and `node.name === name`.",
    eStarter: "function assertElementInDocument(domTree, role, name) {\n    // Write your code here\n    \n}",
    eHint: "Use Array.prototype.some to find matching element.",
    eTest: "if (typeof assertElementInDocument !== 'function') throw new Error('assertElementInDocument not found');\nconst dom = [{ role: 'button', name: 'Submit' }, { role: 'heading', name: 'Dashboard' }];\nif (!assertElementInDocument(dom, 'button', 'Submit')) throw new Error('Button search failed');\nif (assertElementInDocument(dom, 'button', 'Delete')) throw new Error('Nonexistent element found');",
    aTitle: "Assignment: Mock API Response Resolver",
    aDesc: "Write a JS function `mockApiSuccessResponse(data)` returning a Promise resolving `{ ok: true, status: 200, json: () => Promise.resolve(data) }`.",
    aStarter: "function mockApiSuccessResponse(data) {\n    // Write your code here\n    \n}",
    aHint: "Return Promise.resolve with mock fetch response object.",
    aTest: "if (typeof mockApiSuccessResponse !== 'function') throw new Error('mockApiSuccessResponse not found');\nmockApiSuccessResponse({ id: 42 }).then(r => r.json()).then(d => {\n    if (d.id !== 42) throw new Error('Mock json data mismatch');\n});"
  },
  {
    title: "Full-Stack React Capstone Project",
    desc: "In this final capstone day, you integrate everything you have learned over 30 days to architect and audit an enterprise-grade Full-Stack React & Next.js SaaS Application. The capstone features: Next.js App Router with Server Components, Edge Middleware Authentication, TanStack Query data caching, Zustand global state, Optimistic UI task creation, Tailwind CSS design system, Error Boundary recovery, and Vitest test coverage. (Real world: Building and launching a production-ready enterprise dashboard matching Tier-1 tech standards.)",
    syllabus: [
      "End-to-End System Integration: Connecting App Router, Server Actions, Middleware, and Caching layers.",
      "Production Readiness Audit: Auditing Core Web Vitals, security headers, error boundaries, and accessibility.",
      "Continuous Deployment: Automated build verification, environment variables management, and edge deployment."
    ],
    eTitle: "Exam: Production React Architecture Auditor",
    eDesc: "Write a JS function `auditFullStackReactApp(config)` returning `{ isProductionReady: boolean, score: number, checks: string[] }` evaluating if `hasAuth`, `hasSSR`, `hasErrorBoundary`, and `hasCaching` are all true (score 100).",
    eStarter: "function auditFullStackReactApp(config) {\n    // Write your code here\n    \n}",
    eHint: "Verify all 4 boolean flags on config object.",
    eTest: "if (typeof auditFullStackReactApp !== 'function') throw new Error('auditFullStackReactApp not found');\nconst res = auditFullStackReactApp({ hasAuth: true, hasSSR: true, hasErrorBoundary: true, hasCaching: true });\nif (!res.isProductionReady || res.score !== 100) throw new Error('Complete audit rejected');\nconst fail = auditFullStackReactApp({ hasAuth: true });\nif (fail.isProductionReady !== false) throw new Error('Incomplete app passed audit');",
    aTitle: "Assignment: Production Manifest Generator",
    aDesc: "Write a JS function `generateProductionManifest(appName, version)` returning `{ app: appName, version, buildTimestamp: Date.now(), status: 'DEPLOYED' }`.",
    aStarter: "function generateProductionManifest(appName, version) {\n    // Write your code here\n    \n}",
    aHint: "Return object wrapping appName and version.",
    aTest: "if (typeof generateProductionManifest !== 'function') throw new Error('generateProductionManifest not found');\nconst m = generateProductionManifest('CareerOS', '2.4.0');\nif (m.app !== 'CareerOS' || m.version !== '2.4.0' || m.status !== 'DEPLOYED') throw new Error('Manifest generator failed');"
  }
];

export const REACT_30_DAYS_QUESTS = REACT_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('react-basics', i + 1, cfg)
);
