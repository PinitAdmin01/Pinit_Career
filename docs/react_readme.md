# Full-Stack React Web Development — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Full-Stack React Web Development (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## ⚛️ Course Overview
* **Name**: Full-Stack React Web Development
* **ID**: `course-react-web`
* **Duration**: 30 Days (6 Weeks)
* **Target Audience**: Frontend Developers / React Engineers
* **Learning Interface**: Interactive DOM inspector, component state controllers, routing paths panels, and state context logs.
* **Evaluation Sandbox**: React test engines checking sidebar open/closed toggles, user array searches, input query formatting, dynamic fetch state indicators, useReducer shopping carts, dynamic route param digit formats, context theme auditors, and dashboard compliance caps.

---

## 📅 Detailed Day-by-Day Syllabus

### ⚛️ Week 1: Monolith vs React, Styling & State Management

#### 🟢 Day 1: Introduction to React, SPA Architecture & JSX
* **Lecture Syllabus**:
  - Single Page Application (SPA) vs MPA architectures
  - Virtual DOM and reconciliation algorithm properties
  - JSX node trees layout structures
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: React Component Lifecycle & Prop Spreading
* **Lecture Syllabus**:
  - Functional component declarations rules
  - Spreading prop attributes keys
  - Immutable property constraints
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: React State & State Mutators (useState Hook)
* **Lecture Syllabus**:
  - useState hook signatures
  - State mutations re-render cycles
  - Functional state updates rules
* **Coding Exam**: `react-basics-exam-day-3` (`toggleSidebarState`)
  - **Task**: Write a JS function `toggleSidebarState(current)` toggling open/closed menu status strings.
  - **Test**: `toggleSidebarState('open') === 'closed'`.
* **Coding Assignment**: `react-basics-assign-day-3` (`updateActiveMenuItem`)
  - **Task**: Write a JS function `updateActiveMenuItem(itemIndex)` generating menu index selection config maps.
  - **Test**: Returns activeId properties.

#### 🟢 Day 4: Dynamic Arrays: Mapping & Reconciliation Keys
* **Lecture Syllabus**:
  - Mapping arrays data structures inside JSX
  - Reconciliation key attribute parameters guidelines
  - Array filter criteria layouts updates
* **Coding Exam**: `react-basics-exam-day-4` (`filterUsersList`)
  - **Task**: Write a JS function `filterUsersList(users, query)` matching array elements.
  - **Test**: Filters list case-insensitively.
* **Coding Assignment**: `react-basics-assign-day-4` (`hasDuplicateIds`)
  - **Task**: Write a JS function `hasDuplicateIds(items)` checking key duplications.
  - **Test**: Returns true if ids overlap.

#### 🟢 Day 5: React Forms: Controlled text field inputs
* **Lecture Syllabus**:
  - Controlled inputs value properties
  - Handling onChange event objects
  - Form submission event prevent default
* **Coding Exam**: `react-basics-exam-day-5` (`formatSearchQuery`)
  - **Task**: Write a JS function `formatSearchQuery(value)` formatting input variables.
  - **Test**: Returns trimmed lowercase strings.
* **Coding Assignment**: `react-basics-assign-day-5` (`isFormSubmitAllowed`)
  - **Task**: Write a JS function `isFormSubmitAllowed(query)` checking form validation parameters.
  - **Test**: Checks minimum length of 3.

#### 🟢 Day 6: Side Effects: Data Fetching (useEffect Hook)
* **Lecture Syllabus**:
  - useEffect hook dependency arrays rules
  - Fetching REST resources data APIs
  - Cleanup functions in useEffect hooks
* **Coding Exam**: `react-basics-exam-day-6` (`getFetchState`)
  - **Task**: Write a JS function `getFetchState(isLoading, error)` mapping fetch state strings.
  - **Test**: Emits LOADING, ERROR, or SUCCESS status.
* **Coding Assignment**: `react-basics-assign-day-6` (`hasDependencyChanged`)
  - **Task**: Write a JS function `hasDependencyChanged(prev, next)` checking changes.
  - **Test**: Simple comparisons.

#### 🟢 Day 7: Advanced Hooks: Custom states (useReducer Hook)
* **Lecture Syllabus**:
  - useReducer dispatch loops architectures
  - Actions types and payloads structures
  - Immutable state reductions calculations
* **Coding Exam**: `react-basics-exam-day-7` (`cartReducer`)
  - **Task**: Write a JS function `cartReducer(state, action)` reducer updating shopping totals.
  - **Test**: Adds item price values.
* **Coding Assignment**: `react-basics-assign-day-7` (`isPayloadPresent`)
  - **Task**: Write a JS function `isPayloadPresent(action)` checking payload structures.
  - **Test**: Confirms key presence.

---

### ⚛️ Week 2: Dynamic Routers, Context API & Dashboard Capstone

#### 🟢 Day 8: React Router: URL Parameters navigation routing
* **Lecture Syllabus**:
  - Client routers dynamic path segments
  - Parsing routing parameter values
  - Imperative programmatic history navigation
* **Coding Exam**: `react-basics-exam-day-8` (`isValidUrlParam`)
  - **Task**: Write a JS function `isValidUrlParam(param)` checking routing variables formats.
  - **Test**: Enforces numeric digit strings.
* **Coding Assignment**: `react-basics-assign-day-8` (`getQueryVal`)
  - **Task**: Write a JS function `getQueryVal(url, key)` parsing url query strings.
  - **Test**: Extracts parameter values.

#### 🟢 Day 9: State Management: Context API Global State Provider
* **Lecture Syllabus**:
  - React Context API architectures
  - Context Provider values updates
  - Consuming context states cleanly
* **Coding Exam**: `react-basics-exam-day-9` (`isThemeValueSafe`)
  - **Task**: Write a JS function `isThemeValueSafe(theme)` checking global preferences.
  - **Test**: Restricts preferences to light or dark.
* **Coding Assignment**: `react-basics-assign-day-9` (`getContextTheme`)
  - **Task**: Write a JS function `getContextTheme(theme, fallback)` selecting values.
  - **Test**: Defaults to fallback if null.

#### 🟢 Day 10: Final Capstone: React Portal Dashboard Audit
* **Lecture Syllabus**:
  - Auditing component render loops counts
  - Evaluating router paths validators
  - Context state parameter compliance reviews
* **Coding Exam**: `react-basics-exam-day-10` (`evaluateDashboardBuild`)
  - **Task**: Write a JS function `evaluateDashboardBuild(report)` auditing application bundles.
  - **Test**: Checks render counts, route validation, and context safety.
* **Coding Assignment**: `react-basics-assign-day-10` (`getRenderRating`)
  - **Task**: Write a JS function `getRenderRating(rendersCount)` scoring component bounds.
  - **Test**: Flags good or poor.

---

### ⚛️ Week 3: Applied React Components & Rendering Optimization

#### 🟢 Day 11: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

---

### ⚛️ Week 4: Applied React Components & Rendering Optimization (Review)

#### 🟢 Day 15: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Reviewing component rendering bounds
  - Assembling release audit checklists
  - Verifying routing paths configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: React Portal Dashboard Audit (Review)
* **Lecture Syllabus**:
  - Assemble final React portal dashboard deployment and components audit report
  - Verify Context API preferences and client routers dynamic URL parameters
  - Confirm useState side effects hooks and dynamic lists reconciliation keys configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
