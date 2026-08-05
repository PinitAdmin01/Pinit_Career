# Python Programming & Backend Systems — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Python Programming & Backend Systems (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🐍 Course Overview
* **Name**: Python Programming & Backend Systems
* **ID**: `course-python-backend`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Absolute Beginners to Intermediate Python Developers
* **Learning Interface**: API request dashboards, network consoles, and database query logs.
* **Evaluation Sandbox**: Backend web containers inspecting Python data structures, operators, loop iterations, file handling, and terminal inputs.

---

## 📅 Detailed Day-by-Day Syllabus

### 🐍 Week 1: Python Basics & Variables (Mini Project: Student Profile Card)

#### 🟢 Day 1: What is Python & Your First Program
* **Lecture Syllabus**:
  - Python execution runtime, compilers vs interpreters
  - Running code in script files
  - Printing text using print() statements
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Variables & Memory Representation
* **Lecture Syllabus**:
  - Variables naming and declarations
  - Stack memory references assignments
  - Intro to basic primitive types
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Numbers, Basic Math & Strings
* **Lecture Syllabus**:
  - Integers vs floats math boundaries
  - String characters boundaries
  - Arithmetic operators precedence
* **Coding Exam**: `py-basics-exam-day-3` (`calculateSum`)
  - **Task**: Write a JS function `calculateSum(a, b)` returning the sum of a and b.
  - **Test**: `calculateSum(5, 10) === 15`.
* **Coding Assignment**: `py-basics-assign-day-3` (`calculateUserAge`)
  - **Task**: Write a JS function `calculateUserAge(birthYear, currentYear)` returning currentYear - birthYear.
  - **Test**: Returns age parameters.

#### 🟢 Day 4: Basic Input & Output
* **Lecture Syllabus**:
  - Input streams parsing rules
  - Type casting string variables to numbers
  - Printing formatted logs
* **Coding Exam**: `py-basics-exam-day-4` (`greetUserProfile`)
  - **Task**: Write a JS function `greetUserProfile(username)` returning string 'Welcome ' + username.
  - **Test**: Checks concatenation formats.
* **Coding Assignment**: `py-basics-assign-day-4` (`isUsernameMatch`)
  - **Task**: Write a JS function `isUsernameMatch(username, storedName)` checking lowercase strings equivalence.
  - **Test**: Returns matching boolean state.

#### 🟢 Day 5: Operators & Invoice Calculations
* **Lecture Syllabus**:
  - Arithmetic operator combinations
  - Logical operations checks
  - Calculating pricing invoice outputs
* **Coding Exam**: `py-basics-exam-day-5` (`applyDiscount`)
  - **Task**: Write a JS function `applyDiscount(total, discountPercent)` calculating discounted totals.
  - **Test**: Subtracts percent margin from values.
* **Coding Assignment**: `py-basics-assign-day-5` (`groceryInvoice`)
  - **Task**: Write a JS function `groceryInvoice(riceQty, sugarQty, milkQty)` mapping rice is $2/kg, sugar is $3/kg, and milk is $4/liter.
  - **Test**: Calculates invoice total sums.

#### 🟢 Day 6: If/Else Conditions & Branching
* **Lecture Syllabus**:
  - Branching statements syntax rules
  - Nested conditions structures
  - Evaluating logic check paths
* **Coding Exam**: `py-basics-exam-day-6` (`isEligibleToVote`)
  - **Task**: Write a JS function `isEligibleToVote(age)` checking age limit boundaries.
  - **Test**: Confirms true if age >= 18.
* **Coding Assignment**: `py-basics-assign-day-6` (`calculateGrade`)
  - **Task**: Write a JS function `calculateGrade(marks)` formatting A/B/C/F grades.
  - **Test**: Evaluates multiple logical boundaries.

#### 🟢 Day 7: Week 1 Revision & Mini Project
* **Lecture Syllabus**:
  - Variables memory lifecycle review
  - Combining operators and logic checks
  - Building structured console outputs
* **Coding Exam**: `py-basics-exam-day-7` (`calculateAverage`)
  - **Task**: Write a JS function `calculateAverage(m1, m2, m3)` calculating average.
  - **Test**: Sums and divides three marks inputs.
* **Coding Assignment**: `py-basics-assign-day-7` (`mapStudentInfo`)
  - **Task**: Write a JS function `mapStudentInfo(name, rollNum, grade)` returning string: `Student:[name], Roll:[rollNum], Grade:[grade]`.
  - **Test**: Checks output formatting text.

---

### 🐍 Week 2: Loops, Lists & Collections (Mini Project: Expense Tracker)

#### 🟢 Day 8: Iteration: The While Loop
* **Lecture Syllabus**:
  - While loops execution lifecycle
  - Loop counters and increments
  - Safe exit conditions checks
* **Coding Exam**: `py-basics-exam-day-8` (`sumRange`)
  - **Task**: Write a JS function `sumRange(n)` accumulating numbers 1 to n.
  - **Test**: Loops and sums integers.
* **Coding Assignment**: `py-basics-assign-day-8` (`countEvenNumbers`)
  - **Task**: Write a JS function `countEvenNumbers(limit)` counting even numbers up to limit.
  - **Test**: Evaluates modulo 2 checks.

#### 🟢 Day 9: Iteration: The For Loop & ranges
* **Lecture Syllabus**:
  - For loops syntax models
  - Range step parameters configurations
  - Iterating index values
* **Coding Exam**: `py-basics-exam-day-9` (`repeatMessage`)
  - **Task**: Write a JS function `repeatMessage(msg, times)` repeating strings.
  - **Test**: Checks repeated output values.
* **Coding Assignment**: `py-basics-assign-day-9` (`getMultiplicationTableSum`)
  - **Task**: Write a JS function `getMultiplicationTableSum(num)` summing products 1 to 10.
  - **Test**: Calculates tables values.

#### 🟢 Day 10: Strings Manipulation & Slicing
* **Lecture Syllabus**:
  - String slice indexing configurations
  - Converting case properties (upper, lower)
  - Finding characters segment indices
* **Coding Exam**: `py-basics-exam-day-10` (`getStringLength`)
  - **Task**: Write a JS function `getStringLength(val)` returning string length.
  - **Test**: Evaluates lengths constraints.
* **Coding Assignment**: `py-basics-assign-day-10` (`extractFirstName`)
  - **Task**: Write a JS function `extractFirstName(fullName)` extracting first name.
  - **Test**: Splitting full names to extract first token.

#### 🟢 Day 11: Python Lists Basics
* **Lecture Syllabus**:
  - Python list memory allocation
  - Appending and deleting list values
  - Index lookups boundaries checks
* **Coding Exam**: `py-basics-exam-day-11` (`isCityInList`)
  - **Task**: Write a JS function `isCityInList(cities, city)` checking array presence.
  - **Test**: Returns true if element is present in array.
* **Coding Assignment**: `py-basics-assign-day-11` (`findMax`)
  - **Task**: Write a JS function `findMax(nums)` finding maximum value.
  - **Test**: Locates largest number in array.

#### 🟢 Day 12: Iterating Lists & Aggregates
* **Lecture Syllabus**:
  - Iterating collections elements
  - Filtering records array based on thresholds
  - Summing list numbers
* **Coding Exam**: `py-basics-exam-day-12` (`filterPassingMarks`)
  - **Task**: Write a JS function `filterPassingMarks(marks)` returning marks >= 50.
  - **Test**: Filters numeric list values.
* **Coding Assignment**: `py-basics-assign-day-12` (`calculateTotalBill`)
  - **Task**: Write a JS function `calculateTotalBill(prices)` summing list elements.
  - **Test**: Computes aggregates checks.

#### 🟢 Day 13: Tuples: Immutable Collections
* **Lecture Syllabus**:
  - Tuples immutability properties
  - Accessing values by index positions
  - Comparing tuples vs lists usages
* **Coding Exam**: `py-basics-exam-day-13` (`readTupleIndex`)
  - **Task**: Write a JS function `readTupleIndex(tuple, index)` reading tuple element.
  - **Test**: Checks bounds before returning.
* **Coding Assignment**: `py-basics-assign-day-13` (`isTupleIndexSafe`)
  - **Task**: Write a JS function `isTupleIndexSafe(tuple, index)` checking bounds.
  - **Test**: Confirms index is in range.

#### 🟢 Day 14: Week 2 Review & Mini Project
* **Lecture Syllabus**:
  - Nested loops iterations review
  - List modification APIs updates
  - String character loops checks
* **Coding Exam**: `py-basics-exam-day-14` (`convertNamesToUppercase`)
  - **Task**: Write a JS function `convertNamesToUppercase(names)` formatting uppercase lists.
  - **Test**: Maps names to all uppercase.
* **Coding Assignment**: `py-basics-assign-day-14` (`calculateExpenseTracker`)
  - **Task**: Write a JS function `calculateExpenseTracker(expenses, threshold)` summing items.
  - **Test**: Sums expense items above threshold.

---

### 🐍 Week 3: Functions, Dictionaries & Files (Mini Project: Contact Book)

#### 🟢 Day 15: Functions Basics & Parameters
* **Lecture Syllabus**:
  - Defining functions scope parameters
  - Return statements outputs routing
  - Positional input arguments
* **Coding Exam**: `py-basics-exam-day-15` (`greetUser`)
  - **Task**: Write a JS function `greetUser(name)` returning hello message.
  - **Test**: Maps custom greeting.
* **Coding Assignment**: `py-basics-assign-day-15` (`isEven`)
  - **Task**: Write a JS function `isEven(num)` checking even properties.
  - **Test**: Modulo 2 validations.

#### 🟢 Day 16: Multiple Parameters & Default Arguments
* **Lecture Syllabus**:
  - Configuring default parameters bounds
  - Handling multiple input variables
  - Calling arguments keyword mapping
* **Coding Exam**: `py-basics-exam-day-16` (`welcomeCourse`)
  - **Task**: Write a JS function `welcomeCourse(name, course)` setting default course parameter.
  - **Test**: Falls back to Python if course is empty.
* **Coding Assignment**: `py-basics-assign-day-16` (`calculateSimple`)
  - **Task**: Write a JS function `calculateSimple(a, b, op)` processing + and - operators.
  - **Test**: Routes calculations based on operator inputs.

#### 🟢 Day 17: Python Dictionaries Basics
* **Lecture Syllabus**:
  - Key-value dictionary structures
  - Inserting and querying map values
  - Handling missing keys lookup errors
* **Coding Exam**: `py-basics-exam-day-17` (`createStudentMap`)
  - **Task**: Write a JS function `createStudentMap(name, age)` returning objects key-value.
  - **Test**: Initializes dictionary models.
* **Coding Assignment**: `py-basics-assign-day-17` (`getProductPrice`)
  - **Task**: Write a JS function `getProductPrice(catalog, product)` querying product price.
  - **Test**: Looks up values inside catalog maps.

#### 🟢 Day 18: Dictionaries with Loops
* **Lecture Syllabus**:
  - Iterating key arrays keys()
  - Iterating value arrays values()
  - Mapping keys to values loop properties
* **Coding Exam**: `py-basics-exam-day-18` (`getDictionaryKeys`)
  - **Task**: Write a JS function `getDictionaryKeys(dict)` returning list of keys.
  - **Test**: Parses object keys.
* **Coding Assignment**: `py-basics-assign-day-18` (`sumSubjectMarks`)
  - **Task**: Write a JS function `sumSubjectMarks(marksMap)` summing object marks.
  - **Test**: Accumulates numeric parameters.

#### 🟢 Day 19: File Input & Output (I/O)
* **Lecture Syllabus**:
  - Opening files in write ('w') mode
  - Opening files in read ('r') mode
  - Buffer streams flushing procedures
* **Coding Exam**: `py-basics-exam-day-19` (`writeMockFile`)
  - **Task**: Write a JS function `writeMockFile(filename, content)` validating writes.
  - **Test**: Checks write output formatting text.
* **Coding Assignment**: `py-basics-assign-day-19` (`readMockFile`)
  - **Task**: Write a JS function `readMockFile(fileObject)` parsing contents.
  - **Test**: Checks file content properties.

#### 🟢 Day 20: Errors & Exception Handling
* **Lecture Syllabus**:
  - Try-catch-finally block operations
  - Handling system specific crash error codes
  - Safe fallback logic defaults values
* **Coding Exam**: `py-basics-exam-day-20` (`safeDivide`)
  - **Task**: Write a JS function `safeDivide(a, b)` raising ZeroDivisionError on b === 0.
  - **Test**: Throws error exceptions on zero.
* **Coding Assignment**: `py-basics-assign-day-20` (`safeParseJson`)
  - **Task**: Write a JS function `safeParseJson(jsonStr)` parsing json strings safely.
  - **Test**: Returns null on syntax failures.

#### 🟢 Day 21: Week 3 Review & Mini Project
* **Lecture Syllabus**:
  - Nested dictionary lookups maps
  - Chaining operations with files writes
  - Handling runtime exceptions gracefully
* **Coding Exam**: `py-basics-exam-day-21` (`createContact`)
  - **Task**: Write a JS function `createContact(name, phone)` building records.
  - **Test**: Returns contact map objects.
* **Coding Assignment**: `py-basics-assign-day-21` (`mapContactsFileBackup`)
  - **Task**: Write a JS function `mapContactsFileBackup(contacts)` converting contacts list.
  - **Test**: Formats outputs strings list.

---

### 🐍 Week 4: Simple Projects & Applied Python (Capstone: CLI App Suite)

#### 🟢 Day 22: Menu-Driven Application Structures
* **Lecture Syllabus**:
  - Infinite loops menu options routing
  - Handling user choices evaluations
  - Exit status loops breaks
* **Coding Exam**: `py-basics-exam-day-22` (`isChoiceExit`)
  - **Task**: Write a JS function `isChoiceExit(choice)` checking exit trigger choice.
  - **Test**: Returns true if user inputs 3 or Exit.
* **Coding Assignment**: `py-basics-assign-day-22` (`dispatchMenu`)
  - **Task**: Write a JS function `dispatchMenu(choice, a, b)` routing operation choices.
  - **Test**: Executes corresponding operation path.

#### 🟢 Day 23: In-Memory Data Processing
* **Lecture Syllabus**:
  - Sorting objects list arrays
  - Calculating average class scores metrics
  - Extracting peak properties from objects
* **Coding Exam**: `py-basics-exam-day-23` (`calculateClassAverage`)
  - **Task**: Write a JS function `calculateClassAverage(students)` finding mean marks.
  - **Test**: Processes marks objects.
* **Coding Assignment**: `py-basics-assign-day-23` (`findTopStudent`)
  - **Task**: Write a JS function `findTopStudent(students)` identifying max student record.
  - **Test**: Checks bounds iterations.

#### 🟢 Day 24: Randomness & Modules
* **Lecture Syllabus**:
  - Importing module namespaces
  - Using math utility libraries
  - Choosing random choices from lists
* **Coding Exam**: `py-basics-exam-day-24` (`getSquareRoot`)
  - **Task**: Write a JS function `getSquareRoot(val)` calling math square roots.
  - **Test**: Returns square root results.
* **Coding Assignment**: `py-basics-assign-day-24` (`getRandomItem`)
  - **Task**: Write a JS function `getRandomItem(items)` picking random elements.
  - **Test**: Scales random indices.

#### 🟢 Day 25: Creating Custom Modules
* **Lecture Syllabus**:
  - Structuring custom namespace files
  - Importing functions across directories
  - Separating concerns in modular APIs
* **Coding Exam**: `py-basics-exam-day-25` (`isModuleLoaded`)
  - **Task**: Write a JS function `isModuleLoaded(moduleObject)` validating loaded modules.
  - **Test**: Checks properties functions formats.
* **Coding Assignment**: `py-basics-assign-day-25` (`installModuleHelper`)
  - **Task**: Write a JS function `installModuleHelper(moduleObject, helperName, helperFunc)` injecting helpers.
  - **Test**: Assigns properties dynamically.

#### 🟢 Day 26: Basic Data Analysis
* **Lecture Syllabus**:
  - Finding temperature boundaries
  - Filtering elements violating boundaries limits
  - Calculating variance properties
* **Coding Exam**: `py-basics-exam-day-26` (`isTempOutOfRange`)
  - **Task**: Write a JS function `isTempOutOfRange(temp, minVal, maxVal)` auditing values.
  - **Test**: Evaluates comparisons.
* **Coding Assignment**: `py-basics-assign-day-26` (`filterExtremeTemps`)
  - **Task**: Write a JS function `filterExtremeTemps(temps, limit)` extracting values.
  - **Test**: Checks limits bounds.

#### 🟢 Day 27: Personal Expense Tracker CLI
* **Lecture Syllabus**:
  - Lists of dictionaries mapping structures
  - Calculating totals grouped by categories
  - Validating budget limits bounds
* **Coding Exam**: `py-basics-exam-day-27` (`sumCategoryExpenses`)
  - **Task**: Write a JS function `sumCategoryExpenses(expenses, category)` summing category values.
  - **Test**: Deducts category items.
* **Coding Assignment**: `py-basics-assign-day-27` (`isValidExpenseRecord`)
  - **Task**: Write a JS function `isValidExpenseRecord(record)` validating record structures.
  - **Test**: Checks amount and category types.

#### 🟢 Day 28: Contact Management System CLI
* **Lecture Syllabus**:
  - Appending contacts dictionary mappings
  - Writing dictionary files backups
  - Searching records using key indices
* **Coding Exam**: `py-basics-exam-day-28` (`findContactPhone`)
  - **Task**: Write a JS function `findContactPhone(contacts, name)` looking up contact entries.
  - **Test**: Searches matching names in dict keys.
* **Coding Assignment**: `py-basics-assign-day-28` (`addContactToMap`)
  - **Task**: Write a JS function `addContactToMap(contacts, name, phone)` adding records.
  - **Test**: Returns updated maps.

#### 🟢 Day 29: Capstone: Unified Console Suite
* **Lecture Syllabus**:
  - Consolidating menu routers controllers
  - Forwarding options to sub-modules
  - Verifying error-free routing limits
* **Coding Exam**: `py-basics-exam-day-29` (`routeAppChoice`)
  - **Task**: Write a JS function `routeAppChoice(choice)` routing selection indexes.
  - **Test**: Routes choices to STUDENT, EXPENSE, or CONTACT applications.
* **Coding Assignment**: `py-basics-assign-day-29` (`compileWelcomeMessage`)
  - **Task**: Write a JS function `compileWelcomeMessage(username)` greeting active users.
  - **Test**: Formats logging titles.

#### 🟢 Day 30: Final Review & Refactoring
* **Lecture Syllabus**:
  - Refactoring duplicate code blocks
  - Structuring modular class models
  - Verifying final compliance standards
* **Coding Exam**: `py-basics-exam-day-30` (`deduplicateNumbers`)
  - **Task**: Write a JS function `deduplicateNumbers(numbers)` extracting unique elements.
  - **Test**: Filters duplicate numbers list values.
* **Coding Assignment**: `py-basics-assign-day-30` (`isCodeStructured`)
  - **Task**: Write a JS function `isCodeStructured(codeStr)` validating custom script headers.
  - **Test**: Searches def statements presence.

---
*Created by Antigravity*
