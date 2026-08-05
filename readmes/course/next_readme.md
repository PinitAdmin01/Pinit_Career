# React/Next.js Web Development — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **React/Next.js Web Development (30-Day Masterclass)** course in PinIT Career OS, including every lecture topic, coding challenge, and test suite.

---

## ⚛️ Course Overview
* **Name**: React & Next.js Web Development
* **ID**: `course-react-web`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: SDE-1 / Frontend & Full-Stack Developer Candidates
* **Learning Interface**: Dynamic Slides & Socratic AI Mentor Coaching (`Ms. Divya`)
* **Evaluation Sandbox**: Client-side transpiler and assertion tests validation.

---

## 📅 Detailed Day-by-Day Syllabus

### 🚀 Week 1: Core JavaScript & React UI Foundations

#### 🟢 Day 1: JS Fundamentals: Scopes, Closures & Variables
* **Lecture Syllabus**:
  - let vs const vs var difference configurations
  - Block scopes vs Function scopes execution
  - Hoisting and closures memory allocations
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: JS Fundamentals: Objects & Advanced Arrays
* **Lecture Syllabus**:
  - Reference values vs primitive scopes properties
  - Destructuring, rest/spread parameters mappings
  - Map, filter, and reduce array methods execution
* **Status**: Lecture Only (No coding exams or assignments for Day 2 to build core conceptual memory).

#### 🟢 Day 3: JS Fundamentals: Asynchronous JavaScript & Fetch
* **Lecture Syllabus**:
  - Callbacks and Promise objects declarations
  - Async/Await keyword handlers
  - Event Loop stack and queue execution mechanics
* **Coding Exam**: `react-basics-exam-day-3` (`fetchMockData`)
  - **Task**: Write a JS function `fetchMockData(status)` returning a Promise. If status is 'success', resolve with {data: 'Fetched'}; if 'error', reject with 'Failed'.
  - **Starter**:
    ```javascript
    function fetchMockData(status) {
        // Write your code here
        
    }
    ```
  - **Test**: Resolves success status matching correct object keys.
* **Coding Assignment**: `react-basics-assign-day-3` (`parseUserList`)
  - **Task**: Write a JS function `parseUserList(arr)` mapping objects in arr to return array of user names.
  - **Test**: `parseUserList([{name:'A'}, {name:'B'}]) === ['A', 'B']`.

#### 🟢 Day 4: React UI Basics & JSX
* **Lecture Syllabus**:
  - JSX syntax and differences
  - Component trees and elements
  - Props immutable parameters
* **Coding Exam**: `react-basics-exam-day-4` (`GreetingCard`)
  - **Task**: Write a JS function `GreetingCard(props)` returning a formatted object simulating component rendering: {type: 'div', props: {className: 'card', children: 'Hello ' + props.name}}.
  - **Test**: Verifies children string structure formats correctly.
* **Coding Assignment**: `react-basics-assign-day-4` (`validateCardProps`)
  - **Task**: Write a JS function `validateCardProps(props)` returning true if props.name is non-empty.
  - **Test**: `validateCardProps({name: 'Alice'}) === true`.

#### 🟢 Day 5: React State with useState Hook
* **Lecture Syllabus**:
  - useState signatures
  - State mutations re-render cycles
  - Functional state updates
* **Coding Exam**: `react-basics-exam-day-5` (`createCounterState`)
  - **Task**: Write a JS function `createCounterState(initial)` returning an object with `value()` and `increment()` methods.
  - **Test**: Increments step values.
* **Coding Assignment**: `react-basics-assign-day-5` (`toggleTheme`)
  - **Task**: Write a JS function `toggleTheme(current)` returning current === 'light' ? 'dark' : 'light'.
  - **Test**: Checks key mapping matches.

#### 🟢 Day 6: List Rendering & Conditional Displays
* **Lecture Syllabus**:
  - Array lists mapping in JSX
  - Key prop parameters rules
  - Conditional short circuits &&
* **Coding Exam**: `react-basics-exam-day-6` (`filterUserArray`)
  - **Task**: Write a JS function `filterUserArray(users, query)` returning users where `name` contains query (case-insensitive).
  - **Test**: `filterUserArray([{name:'Alice'}], 'al') === [{name:'Alice'}]`.
* **Coding Assignment**: `react-basics-assign-day-6` (`hasUniqueKeys`)
  - **Task**: Write a JS function `hasUniqueKeys(items)` returning true if all items contain a unique `id` key.
  - **Test**: Validates duplication indexes.

#### 🟢 Day 7: Week 1 Capstone: Todo List App
* **Lecture Syllabus**:
  - Lifting state options
  - Dynamic array mutations
  - Caching state in localStorage
* **Coding Exam**: `react-basics-exam-day-7` (`addTodoItem`)
  - **Task**: Write a JS function `addTodoItem(todos, newText)` returning a new array containing all elements of todos plus a new todo object { id: Date.now(), text: newText, completed: false }.
  - **Test**: Appends items array with correct keys.
* **Coding Assignment**: `react-basics-assign-day-7` (`toggleTodoComplete`)
  - **Task**: Write a JS function `toggleTodoComplete(todos, targetId)` mapping todos to invert `completed` on match.
  - **Test**: Maps target completions correctly.

---

### 📦 Week 2: Component Performance & State Sharing

#### 🟢 Day 8: Side Effects using useEffect Hook
* **Lecture Syllabus**:
  - Mount, update, and unmount lifecycles
  - Dependency arrays rules
  - Listeners cleanup methods
* **Coding Exam**: `react-basics-exam-day-8` (`matchWindowWidth`)
  - **Task**: Write a JS function `matchWindowWidth(width)` returning true if width >= 1024.
  - **Test**: `matchWindowWidth(1200) === true`.
* **Coding Assignment**: `react-basics-assign-day-8` (`clearActiveInterval`)
  - **Task**: Write a JS function `clearActiveInterval(idRef)` calling clearInterval on idRef.current.
  - **Test**: Executes loop timer clear tasks.

#### 🟢 Day 9: Forms & Validations (React Hook Form + Zod)
* **Lecture Syllabus**:
  - Controlled inputs validations
  - React Hook Form integration
  - Zod schema formats
* **Coding Exam**: `react-basics-exam-day-9` (`validateEmailInput`)
  - **Task**: Write a JS function `validateEmailInput(schemaObj, input)` returning true if input contains '@' and schemaObj returns success.
  - **Test**: Matches schema validations.
* **Coding Assignment**: `react-basics-assign-day-9` (`getFormError`)
  - **Task**: Write a JS function `getFormError(errors, field)` returning errors[field]?.message or null.
  - **Test**: Returns error message string keys.

#### 🟢 Day 10: Persistent Values with useRef Hook
* **Lecture Syllabus**:
  - DOM reference hooks
  - Persistent states variables
  - Mutable inputs validations
* **Coding Exam**: `react-basics-exam-day-10` (`triggerInputFocus`)
  - **Task**: Write a JS function `triggerInputFocus(ref)` calling ref.current.focus() if ref.current is valid.
  - **Test**: Focuses elements.
* **Coding Assignment**: `react-basics-assign-day-10` (`didStateUpdate`)
  - **Task**: Write a JS function `didStateUpdate(curr, prevRef)` returning true if curr !== prevRef.current.
  - **Test**: Matches updates check.

#### 🟢 Day 11: Global State with Context API
* **Lecture Syllabus**:
  - createContext setups
  - Provider value distribution
  - useContext subscription bindings
* **Coding Exam**: `react-basics-exam-day-11` (`getActiveTheme`)
  - **Task**: Write a JS function `getActiveTheme(ctx)` returning ctx.theme if it exists, 'light' otherwise.
  - **Test**: Returns active theme labels.
* **Coding Assignment**: `react-basics-assign-day-11` (`isTokenValidInCtx`)
  - **Task**: Write a JS function `isTokenValidInCtx(ctx)` returning true if ctx.token exists.
  - **Test**: Validates context tokens keys.

#### 🟢 Day 12: Custom React Hooks Development
* **Lecture Syllabus**:
  - Custom hook logic extraction
  - Hook composition rules
  - useFetch encapsulation patterns
* **Coding Exam**: `react-basics-exam-day-12` (`buildNetworkHook`)
  - **Task**: Write a JS function `buildNetworkHook(data, loading, error)` returning an array [data, loading, error].
  - **Test**: Bundles values in array format.
* **Coding Assignment**: `react-basics-assign-day-12` (`buildToggleState`)
  - **Task**: Write a JS function `buildToggleState(val)` returning array [val, !val].
  - **Test**: Inverts state parameter values.

#### 🟢 Day 13: Performance Optimization (useMemo & useCallback)
* **Lecture Syllabus**:
  - Calculation memoization setups
  - Reference caching useCallback
  - React.memo performance guides
* **Coding Exam**: `react-basics-exam-day-13` (`getMemoizedIndex`)
  - **Task**: Write a JS function `getMemoizedIndex(arr, query)` returning the index of query in arr (case-insensitive).
  - **Test**: Matches query parameters correctly.
* **Coding Assignment**: `react-basics-assign-day-13` (`areCallbacksIdentical`)
  - **Task**: Write a JS function `areCallbacksIdentical(cb1, cb2)` returning true if cb1 === cb2.
  - **Test**: Compares callback scopes references.

#### 🟢 Day 14: Week 2 Capstone: Interactive Shopping Cart
* **Lecture Syllabus**:
  - useReducer setups in context
  - State optimization bounds
  - Discount code validations
* **Coding Exam**: `react-basics-exam-day-14` (`computeCartTotal`)
  - **Task**: Write a JS function `computeCartTotal(items, discountCode)` returning total price. Apply 10% discount if discountCode is 'SAVE10'.
  - **Test**: Computes sums and discounts.
* **Coding Assignment**: `react-basics-assign-day-14` (`updateQuantityInState`)
  - **Task**: Write a JS function `updateQuantityInState(items, targetId, qty)` mapping items to update quantity on match.
  - **Test**: Updates target item count index.

---

### 🌐 Week 3: Next.js App Router & Server Interactions

#### 🟢 Day 15: Introduction to Next.js App Router
* **Lecture Syllabus**:
  - App Router folder layouts
  - Root layouts and metadata configurations
  - Routing and dynamic metadata APIs
* **Coding Exam**: `react-basics-exam-day-15` (`generateStaticParamsList`)
  - **Task**: Write a JS function `generateStaticParamsList(slugs)` mapping array slugs to objects array [{slug: val}].
  - **Test**: Returns formatted dynamic router targets.
* **Coding Assignment**: `react-basics-assign-day-15` (`buildPageMetadata`)
  - **Task**: Write a JS function `buildPageMetadata(title)` returning metadata object: {title: title + ' | PinIT'}.
  - **Test**: Compiles template string metadata tags.

#### 🟢 Day 16: Next.js Routing & Navigation
* **Lecture Syllabus**:
  - Dynamic folder parameters routes
  - Navigation routing Link components
  - useRouter hook parameters redirect rules
* **Coding Exam**: `react-basics-exam-day-16` (`extractPathId`)
  - **Task**: Write a JS function `extractPathId(params)` returning parseInt(params.id) if present, -1 otherwise.
  - **Test**: Evaluates parsed dynamic IDs.
* **Coding Assignment**: `react-basics-assign-day-16` (`isRouteActive`)
  - **Task**: Write a JS function `isRouteActive(pathname, target)` returning true if pathname starts with target.
  - **Test**: Matches paths prefixes.

#### 🟢 Day 17: React Server Components (RSC) vs Client Components
* **Lecture Syllabus**:
  - RSC server-first architectures
  - use client hydration boundaries
  - Database direct fetching rules
* **Coding Exam**: `react-basics-exam-day-17` (`resolveServerPayload`)
  - **Task**: Write an async JS function `resolveServerPayload(promise)` returning resolved payload data from promise.
  - **Test**: Awaits static promise tasks.
* **Coding Assignment**: `react-basics-assign-day-17` (`isClientBoundary`)
  - **Task**: Write a JS function `isClientBoundary(compProps)` returning true if compProps.useClient is true.
  - **Test**: Validates client boundaries attributes.

#### 🟢 Day 18: Next.js Route Handlers (API Routes)
* **Lecture Syllabus**:
  - App Router route handlers
  - REST GET and POST endpoints
  - Response parameters envelopes
* **Coding Exam**: `react-basics-exam-day-18` (`buildRouteHandlerResponse`)
  - **Task**: Write a JS function `buildRouteHandlerResponse(status, payload)` returning { status: status, data: payload }.
  - **Test**: Packs status and payloads structures.
* **Coding Assignment**: `react-basics-assign-day-18` (`isMethodSupported`)
  - **Task**: Write a JS function `isMethodSupported(reqMethod)` returning true if reqMethod is 'GET' or 'POST'.
  - **Test**: Filters API method strings.

#### 🟢 Day 19: Next.js Server Actions & Mutations
* **Lecture Syllabus**:
  - Server actions form updates
  - Database direct mutations rules
  - revalidatePath update triggers
* **Coding Exam**: `react-basics-exam-day-19` (`verifyActionInput`)
  - **Task**: Write a JS function `verifyActionInput(input)` returning true if input.title has length >= 3 and input.price > 0.
  - **Test**: Matches payload validations.
* **Coding Assignment**: `react-basics-assign-day-19` (`hasMutationError`)
  - **Task**: Write a JS function `hasMutationError(res)` returning true if res.error is present.
  - **Test**: Validates error flags responses.

#### 🟢 Day 20: Next.js Caching & Revalidation
* **Lecture Syllabus**:
  - Static vs Dynamic rendering limits
  - Next.js fetch cache parameter configurations
  - revalidateTag updates routines
* **Coding Exam**: `react-basics-exam-day-20` (`getCacheOptions`)
  - **Task**: Write a JS function `getCacheOptions(isStatic)` returning { next: { revalidate: isStatic ? 3600 : 0 } }.
  - **Test**: Configures fetch parameters options.
* **Coding Assignment**: `react-basics-assign-day-20` (`buildRevalidateOptions`)
  - **Task**: Write a JS function `buildRevalidateOptions(tags)` returning { next: { tags: tags } }.
  - **Test**: Packages tags arrays values.

#### 🟢 Day 21: Week 3 Capstone: Blog App with App Router
* **Lecture Syllabus**:
  - Layout routing setups
  - Server action blog creation
  - revalidatePath updates guides
* **Coding Exam**: `react-basics-exam-day-21` (`formatBlogSlug`)
  - **Task**: Write a JS function `formatBlogSlug(title)` returning title.toLowerCase().replace(/\s+/g, '-').
  - **Test**: Matches formatted slugs.
* **Coding Assignment**: `react-basics-assign-day-21` (`isSlugValid`)
  - **Task**: Write a JS function `isSlugValid(slug)` returning true if slug matches alphanumeric patterns.
  - **Test**: Matches URL alphanumeric format boundaries.

---

### ⚙️ Week 4: Enterprise State, Testing & Deployment

#### 🟢 Day 22: Redux Toolkit (RTK) Global State
* **Lecture Syllabus**:
  - configureStore setup
  - State slice structures
  - Dispatcher and reducer rules
* **Coding Exam**: `react-basics-exam-day-22` (`executeCounterReducer`)
  - **Task**: Write a JS function `executeCounterReducer(state, action)` returning state + (action.payload || 1) if type is 'add', otherwise state.
  - **Test**: Increments state values based on action payloads.
* **Coding Assignment**: `react-basics-assign-day-22` (`pushItemToRedux`)
  - **Task**: Write a JS function `pushItemToRedux(items, payload)` returning a new array containing all elements of items plus payload.
  - **Test**: Appends items payload safely.

#### 🟢 Day 23: Next.js Middleware & Route Guards
* **Lecture Syllabus**:
  - Request redirects configurations
  - Authentication cookies checks
  - Protected paths rules
* **Coding Exam**: `react-basics-exam-day-23` (`matchRouteMiddleware`)
  - **Task**: Write a JS function `matchRouteMiddleware(token, path)` returning '/login' if token is missing and path is '/dashboard'. Otherwise, return '/dashboard'.
  - **Test**: Redirects unauthenticated access.
* **Coding Assignment**: `react-basics-assign-day-23` (`isMiddlewarePath`)
  - **Task**: Write a JS function `isMiddlewarePath(path, rules)` returning true if rules array contains path.
  - **Test**: Maps match lists parameters.

#### 🟢 Day 24: Next.js Error Handling & Loading UI
* **Lecture Syllabus**:
  - error.tsx fallback files
  - loading.tsx layout configurations
  - not-found.tsx route handlers
* **Coding Exam**: `react-basics-exam-day-24` (`isRecoveryPossible`)
  - **Task**: Write a JS function `isRecoveryPossible(err)` returning true if err.digest is present.
  - **Test**: Checks digest hashes keys.
* **Coding Assignment**: `react-basics-assign-day-24` (`isNotFoundCode`)
  - **Task**: Write a JS function `isNotFoundCode(statusCode)` returning true if statusCode === 404.
  - **Test**: Matches boundary status values.

#### 🟢 Day 25: Image, Font, & SEO Optimization
* **Lecture Syllabus**:
  - next/image styling parameters
  - Google Fonts class loader layouts
  - Meta API optimization properties
* **Coding Exam**: `react-basics-exam-day-25` (`isImagePropValid`)
  - **Task**: Write a JS function `isImagePropValid(props)` returning true if props contains width, height, and src properties.
  - **Test**: Checks metadata parameters properties.
* **Coding Assignment**: `react-basics-assign-day-25` (`formatAssetPath`)
  - **Task**: Write a JS function `formatAssetPath(src)` replacing '.png' with '.webp'.
  - **Test**: Replaces static image formats.

#### 🟢 Day 26: Component Testing with Jest & RTL
* **Lecture Syllabus**:
  - Testing layouts render cycles
  - Simulating user event triggers
  - DOM assertions checking structures
* **Coding Exam**: `react-basics-exam-day-26` (`verifyClickCount`)
  - **Task**: Write a JS function `verifyClickCount(expected, actual)` returning true if expected === actual.
  - **Test**: Matches click mock events.
* **Coding Assignment**: `react-basics-assign-day-26` (`isValidationErrorShown`)
  - **Task**: Write a JS function `isValidationErrorShown(errorElement)` returning true if errorElement is present.
  - **Test**: Asserts validation error text rendering.

#### 🟢 Day 27: Web App Performance & Bundle Analysis
* **Lecture Syllabus**:
  - React.lazy dynamic module loading
  - Bundle code splitting chunk boundaries
  - Bundle analyzer tools guides
* **Coding Exam**: `react-basics-exam-day-27` (`isDynamicRouteRequired`)
  - **Task**: Write a JS function `isDynamicRouteRequired(size)` returning true if size > 50000 (meaning bundle exceeds 50KB and requires chunk splitting).
  - **Test**: Matches bundle optimization limits.
* **Coding Assignment**: `react-basics-assign-day-27` (`isThresholdExceeded`)
  - **Task**: Write a JS function `isThresholdExceeded(val, max)` returning true if val > max.
  - **Test**: Evaluates numeric metrics properties.

#### 🟢 Day 28: Deployment & Environment Configuration
* **Lecture Syllabus**:
  - Vercel builds process environments
  - Build log error diagnostics
  - process.env security variables
* **Coding Exam**: `react-basics-exam-day-28` (`validateSecretKey`)
  - **Task**: Write a JS function `validateSecretKey(key)` returning true if key starts with 'SEC_' and key.length >= 8.
  - **Test**: Filters secure prefix strings.
* **Coding Assignment**: `react-basics-assign-day-28` (`isProductionServer`)
  - **Task**: Write a JS function `isProductionServer(env)` returning true if env === 'production'.
  - **Test**: Matches environment configuration strings.

#### 🟢 Day 29: Advanced State: Zustand (Elective)
* **Lecture Syllabus**:
  - Zustand store creators setups
  - Select reactive states loops
  - Actions definitions in stores
* **Coding Exam**: `react-basics-exam-day-29` (`modifyZustandState`)
  - **Task**: Write a JS function `modifyZustandState(store, value)` returning { ...store, data: value }.
  - **Test**: Updates store keys with shallow copying.
* **Coding Assignment**: `react-basics-assign-day-29` (`isStoreReady`)
  - **Task**: Write a JS function `isStoreReady(store)` returning true if store.ready === true.
  - **Test**: Returns status variables boolean values.

#### 🟢 Day 30: Final Capstone: Full-Stack Admin Dashboard
* **Lecture Syllabus**:
  - Full-stack UI layout designs
  - Server action data updates
  - Client components chart rendering
* **Coding Exam**: `react-basics-exam-day-30` (`aggregateMetrics`)
  - **Task**: Write a JS function `aggregateMetrics(data)` returning sum of all metric.value elements in array. Return 0 if empty.
  - **Test**: Aggregates dashboard counts arrays.
* **Coding Assignment**: `react-basics-assign-day-30` (`isReadyForBuild`)
  - **Task**: Write a JS function `isReadyForBuild(status)` returning true if status.errors === 0.
  - **Test**: Matches build readiness flags.

---
*Created by Antigravity*
