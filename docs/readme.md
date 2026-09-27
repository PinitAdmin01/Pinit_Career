# Java Fundamentals & Core Logic — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Java Fundamentals & Core Logic (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## ☕ Course Overview
* **Name**: Java Fundamentals & Core Logic
* **ID**: `course-java-logic`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: SDE-1 / Backend Engineer Candidates
* **Learning Interface**: Dynamic Slides & Socratic AI Mentor Coaching (`Ms. Priya`)
* **Evaluation Sandbox**: Client-side transpiler and assertion tests validation checking account balances, class structures, custom exceptions, and JUnit asserts.

---

## 📅 Detailed Day-by-Day Syllabus

### ☕ Week 1: Variables, Memory Representation & Basic Control Flow (Bank CLI: Account Balance Calculations)

#### 🟢 Day 1: Introduction to Java & Primitive Memory Boundaries
* **Lecture Syllabus**:
  - Java Primitive types & Memory boundaries
  - Stack memory representation of data values
  - Integer overflow and signed bit representation
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Variable Lifetimes & Local Scopes
* **Lecture Syllabus**:
  - Local vs Instance variable lifetimes
  - Stack frame allocations
  - Variables initialization rules
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Arithmetic Operators & Balance calculations
* **Lecture Syllabus**:
  - Operators precedence & priority
  - Modulo calculations
  - Arithmetic balance operations
* **Coding Exam**: `java-basics-exam-day-3` (`remainder`)
  - **Task**: Write a JS function `remainder(a, b)` returning a % b.
  - **Test**: `remainder(10, 3) === 1`.
* **Coding Assignment**: `java-basics-assign-day-3` (`isGreater`)
  - **Task**: Write a JS function `isGreater(a, b)` returning true if balance a > balance b.
  - **Test**: Compares two balances.

#### 🟢 Day 4: Conditional Execution: Transaction Guardrails
* **Lecture Syllabus**:
  - Conditional statements branching logic
  - Short-circuit boolean operators
  - Validation guardrails
* **Coding Exam**: `java-basics-exam-day-4` (`verifyWithdraw`)
  - **Task**: Write a JS function `verifyWithdraw(balance, withdrawAmount)` returning remaining balance if withdrawAmount does not exceed balance, and remaining balance is at least 500. Otherwise, return -1.
  - **Test**: `verifyWithdraw(2000, 500) === 1500`, `verifyWithdraw(1000, 600) === -1`.
* **Coding Assignment**: `java-basics-assign-day-4` (`isPositiveDeposit`)
  - **Task**: Write a JS function `isPositiveDeposit(n)` returning true if amount n > 0.
  - **Test**: Evaluates amount check.

#### 🟢 Day 5: Transaction Limits Multi-Branching
* **Lecture Syllabus**:
  - Multi-branching logic structures
  - Evaluating nested conditions
  - Structuring threshold controls
* **Coding Exam**: `java-basics-exam-day-5` (`getAccountTier`)
  - **Task**: Write a JS function `getAccountTier(balance)` returning 'PLATINUM', 'GOLD', 'STANDARD', or 'CRITICAL'.
  - **Test**: Maps balance values to target tier labels.
* **Coding Assignment**: `java-basics-assign-day-5` (`calculateTransactionFee`)
  - **Task**: Write a JS function `calculateTransactionFee(amount, isPreferred)` scaling fees by account preferred flags.
  - **Test**: Computes dynamic percentages.

#### 🟢 Day 6: Iterative Control Flow: The while Loop
* **Lecture Syllabus**:
  - While loops execution paths
  - Loop counters and increments
  - Safe exit conditions checks
* **Coding Exam**: `java-basics-exam-day-6` (`validatePin`)
  - **Task**: Write a JS function `validatePin(pin)` verifying if pin is between 1000 and 9999 inclusive.
  - **Test**: Confirms true for 4-digit PINs.
* **Coding Assignment**: `java-basics-assign-day-6` (`countDigits`)
  - **Task**: Write a JS function `countDigits(n)` checking digits count.
  - **Test**: Formats length outputs.

#### 🟢 Day 7: Deterministic Loops: Interest Compound Calculations
* **Lecture Syllabus**:
  - For loops bounds allocations
  - Accumulating compounding math values
  - Increment control steps
* **Coding Exam**: `java-basics-exam-day-7` (`compoundInterest`)
  - **Task**: Write a JS function `compoundInterest(principal, ratePercent, years)` compounding values.
  - **Test**: Compound math evaluations check.
* **Coding Assignment**: `java-basics-assign-day-7` (`sumMonthlySavings`)
  - **Task**: Write a JS function `sumMonthlySavings(monthlyAmount, months)` compounding savings sums.
  - **Test**: Multiplies months values.

---

### ☕ Week 2: OOP Principles & Memory Management (Bank CLI: Savings vs Checking Accounts)

#### 🟢 Day 8: Advanced Loops: break & continue labels
* **Lecture Syllabus**:
  - Loop control flow interruptions
  - Labeled break statements
  - Nested loops exit controls
* **Coding Exam**: `java-basics-exam-day-8` (`findFirstOverLimit`)
  - **Task**: Write a JS function `findFirstOverLimit(transactions, limit)` returning first amount over limit.
  - **Test**: Returns first array item matching conditions.
* **Coding Assignment**: `java-basics-assign-day-8` (`sumOddTransactions`)
  - **Task**: Write a JS function `sumOddTransactions(transactions)` summing odd amounts.
  - **Test**: Modular 2 iterations.

#### 🟢 Day 9: OOP: Class references & object structures
* **Lecture Syllabus**:
  - Classes vs Objects representations
  - Reference variables allocations
  - Heap memory data models
* **Coding Exam**: `java-basics-exam-day-9` (`getAccountBalance`)
  - **Task**: Write a JS function `getAccountBalance(account)` parsing account balance.
  - **Test**: Returns balance property values.
* **Coding Assignment**: `java-basics-assign-day-9` (`isAccountActive`)
  - **Task**: Write a JS function `isAccountActive(account)` checking status.
  - **Test**: Matches status string to active.

#### 🟢 Day 10: Data Encapsulation & Access Modifiers
* **Lecture Syllabus**:
  - Access control modifiers keywords
  - Data encapsulation principles
  - Accessors and mutators validation
* **Coding Exam**: `java-basics-exam-day-10` (`isValidDepositAmount`)
  - **Task**: Write a JS function `isValidDepositAmount(amount)` checking bounds.
  - **Test**: Restricts deposit amounts.
* **Coding Assignment**: `java-basics-assign-day-10` (`isDepositWithinLimit`)
  - **Task**: Write a JS function `isDepositWithinLimit(amount, maxLimit)` verifying limits.
  - **Test**: Checks bounds constraints.

#### 🟢 Day 11: Constructor Overloading & Initializers
* **Lecture Syllabus**:
  - Overloading constructors models
  - Initialization order properties
  - Constructor default arguments
* **Coding Exam**: `java-basics-exam-day-11` (`buildAccountObject`)
  - **Task**: Write a JS function `buildAccountObject(id, balance, type)` with defaults.
  - **Test**: Returns structures with SAVINGS defaults.
* **Coding Assignment**: `java-basics-assign-day-11` (`initSavings`)
  - **Task**: Write a JS function `initSavings(balance)` initializing standard accounts.
  - **Test**: Returns default objects.

#### 🟢 Day 12: OOP Inheritance: Savings vs Checking Accounts
* **Lecture Syllabus**:
  - Inheritance extensions structures
  - Subclass creation rules
  - Routing super references methods
* **Coding Exam**: `java-basics-exam-day-12` (`computeRolePay`)
  - **Task**: Write a JS function `computeRolePay(type, balance)` compounding savings interest.
  - **Test**: Appends 5% interest for SAVINGS types.
* **Coding Assignment**: `java-basics-assign-day-12` (`isSavingsAccount`)
  - **Task**: Write a JS function `isSavingsAccount(account)` verifying account type.
  - **Test**: Returns match boolean.

#### 🟢 Day 13: Polymorphism: Overriding ledger logic
* **Lecture Syllabus**:
  - Runtime polymorphism mechanics
  - Method overriding conventions
  - Polymorphic dispatch execution
* **Coding Exam**: `java-basics-exam-day-13` (`dispatchSound`)
  - **Task**: Write a JS function `dispatchSound(type, amount)` routing type logs.
  - **Test**: Formats prefix outputs.
* **Coding Assignment**: `java-basics-assign-day-13` (`addOverloaded`)
  - **Task**: Write a JS function `addOverloaded(balance, deposit, fee)` resolving deposit fees.
  - **Test**: Subtracts optional fee values.

#### 🟢 Day 14: Abstract Classes vs Interfaces
* **Lecture Syllabus**:
  - Abstract classes constraints
  - Designing interfaces APIs contracts
  - Verifying class implementation paths
* **Coding Exam**: `java-basics-exam-day-14` (`getAbstractArea`)
  - **Task**: Write a JS function `getAbstractArea(account)` verifying validate function existence.
  - **Test**: Confirms object contains type checks.
* **Coding Assignment**: `java-basics-assign-day-14` (`implementsInterface`)
  - **Task**: Write a JS function `implementsInterface(obj, interfaceKeys)` verifying properties.
  - **Test**: Compares object keys arrays.

---

### ☕ Week 3: Data Collections & Processing (Bank CLI: Transaction Ledger List & Logging)

#### 🟢 Day 15: Introduction to Arrays: Transaction Ledger List
* **Lecture Syllabus**:
  - Array structures initialization
  - Index offset boundaries rules
  - Linear array traversals loops
* **Coding Exam**: `java-basics-exam-day-15` (`sum`)
  - **Task**: Write a JS function `sum(arr)` summing ledger values.
  - **Test**: Loops elements.
* **Coding Assignment**: `java-basics-assign-day-15` (`average`)
  - **Task**: Write a JS function `average(arr)` returning mean values.
  - **Test**: Divides sum by length.

#### 🟢 Day 16: Array Boundaries: Ledger Peak Searches
* **Lecture Syllabus**:
  - Linear search array algorithms
  - Locating maximum values bounds
  - Handling empty array bounds cases
* **Coding Exam**: `java-basics-exam-day-16` (`findMax`)
  - **Task**: Write a JS function `findMax(arr)` searching peak values.
  - **Test**: Identifies largest item in array.
* **Coding Assignment**: `java-basics-assign-day-16` (`findMin`)
  - **Task**: Write a JS function `findMin(arr)` searching minimum values.
  - **Test**: Tracks lower bounds.

#### 🟢 Day 17: String Class & Memory Immutability
* **Lecture Syllabus**:
  - String pool memory models
  - Immutable character data configurations
  - String analysis operations
* **Coding Exam**: `java-basics-exam-day-17` (`reverse`)
  - **Task**: Write a JS function `reverse(str)` reversing reference ID strings.
  - **Test**: Reverses character sequence.
* **Coding Assignment**: `java-basics-assign-day-17` (`isPalindrome`)
  - **Task**: Write a JS function `isPalindrome(str)` verifying string mirror symmetries.
  - **Test**: Checks reverse equivalence.

#### 🟢 Day 18: StringBuilder: Mutable Character Operations
* **Lecture Syllabus**:
  - StringBuilder buffers efficiency
  - Character appending operations
  - Performance impact of immutable strings
* **Coding Exam**: `java-basics-exam-day-18` (`removeSpaces`)
  - **Task**: Write a JS function `removeSpaces(str)` stripping formatting spaces.
  - **Test**: Sanitizes text structures.
* **Coding Assignment**: `java-basics-assign-day-18` (`countWords`)
  - **Task**: Write a JS function `countWords(str)` counting space tokens.
  - **Test**: Evaluates split array lengths.

#### 🟢 Day 19: Multi-Dimensional Arrays: Ledger Matrix Logs
* **Lecture Syllabus**:
  - Multi-dimensional arrays memory structures
  - Nested loop index traversals
  - Main diagonal elements calculations
* **Coding Exam**: `java-basics-exam-day-19` (`sumDiagonal`)
  - **Task**: Write a JS function `sumDiagonal(matrix)` summing diagonal audit indexes.
  - **Test**: Sums matrix indexes where row === col.
* **Coding Assignment**: `java-basics-assign-day-19` (`getDiagonalElement`)
  - **Task**: Write a JS function `getDiagonalElement(matrix, idx)` extracting cells.
  - **Test**: Checks bounds before returning.

#### 🟢 Day 20: Java Exception Handling: try-catch-finally
* **Lecture Syllabus**:
  - Throwable hierarchy classes structures
  - Chaining exception catch routing blocks
  - Finally block cleanup guarantees
* **Coding Exam**: `java-basics-exam-day-20` (`safeDivide`)
  - **Task**: Write a JS function `safeDivide(a, b)` throwing ArithmeticException if b === 0.
  - **Test**: Triggers division error check.
* **Coding Assignment**: `java-basics-assign-day-20` (`safeParse`)
  - **Task**: Write a JS function `safeParse(str)` parsing numbers.
  - **Test**: Returns -1 on parsing failures.

#### 🟢 Day 21: Custom Exceptions Throwing
* **Lecture Syllabus**:
  - Defining custom exception subclasses
  - Throwing exceptions manual declarations
  - Throws signatures routing rules
* **Coding Exam**: `java-basics-exam-day-21` (`verifyDeposit`)
  - **Task**: Write a JS function `verifyDeposit(amount)` raising IllegalArgumentException if negative.
  - **Test**: Checks deposit bounds error flags.
* **Coding Assignment**: `java-basics-assign-day-21` (`verifyAge`)
  - **Task**: Write a JS function `verifyAge(age)` raising InvalidAgeException on minors.
  - **Test**: Restricts values below 18.

---

### ☕ Week 4: Advanced Collections & Architecture (Bank CLI: Thread Safety, SOLID & JUnit Asserts)

#### 🟢 Day 22: ArrayList Collections & Generics
* **Lecture Syllabus**:
  - ArrayList memory scaling parameters
  - Generics types configuration parameters
  - Adding and deleting collection entries
* **Coding Exam**: `java-basics-exam-day-22` (`deduplicate`)
  - **Task**: Write a JS function `deduplicate(arr)` removing duplicate transaction values.
  - **Test**: Restricts lists to unique entries.
* **Coding Assignment**: `java-basics-assign-day-22` (`containsElement`)
  - **Task**: Write a JS function `containsElement(arr, val)` checking element presence.
  - **Test**: Evaluates array indices.

#### 🟢 Day 23: HashMap: Transaction Key-Value Mappings
* **Lecture Syllabus**:
  - HashMap hashing storage mechanisms
  - Adding and querying key mappings
  - Handling key collisions resolutions
* **Coding Exam**: `java-basics-exam-day-23` (`getCharCount`)
  - **Task**: Write a JS function `getCharCount(str)` compiling character map frequencies.
  - **Test**: Populates occurrence counters.
* **Coding Assignment**: `java-basics-assign-day-23` (`hasMapping`)
  - **Task**: Write a JS function `hasMapping(map, key)` checking keys.
  - **Test**: Evaluates properties status.

#### 🟢 Day 24: Generics & Parametric Type Safety
* **Lecture Syllabus**:
  - Parametric class definitions syntax
  - Compiler type erasure rules
  - Enforcing collection structures types limits
* **Coding Exam**: `java-basics-exam-day-24` (`getFirstElement`)
  - **Task**: Write a JS function `getFirstElement(arr)` extracting first index.
  - **Test**: Validates type safety.
* **Coding Assignment**: `java-basics-assign-day-24` (`areEqualGenerics`)
  - **Task**: Write a JS function `areEqualGenerics(a, b)` comparing values.
  - **Test**: Returns equivalence boolean.

#### 🟢 Day 25: Multi-Threading: Runnable task allocations
* **Lecture Syllabus**:
  - Thread and Runnable configurations
  - Managing asynchronous task schedulers
  - Thread execution context states
* **Coding Exam**: `java-basics-exam-day-25` (`isThreadActive`)
  - **Task**: Write a JS function `isThreadActive(thread)` checking thread status.
  - **Test**: Checks if status string matches RUNNING.
* **Coding Assignment**: `java-basics-assign-day-25` (`getThreadName`)
  - **Task**: Write a JS function `getThreadName(thread)` extracting name.
  - **Test**: Checks name parameter.

#### 🟢 Day 26: Thread Synchronization & Shared Ledgers Locks
* **Lecture Syllabus**:
  - Race states data conflicts
  - Synchronized blocks monitors
  - Volatile variables thread guarantees
* **Coding Exam**: `java-basics-exam-day-26` (`getSynchronizedCount`)
  - **Task**: Write a JS function `getSynchronizedCount(ledger)` querying balance counts.
  - **Test**: Returns balance numbers.
* **Coding Assignment**: `java-basics-assign-day-26` (`tryAcquireLock`)
  - **Task**: Write a JS function `tryAcquireLock(lock)` locking state parameters.
  - **Test**: Sets isLocked to true if currently false.

#### 🟢 Day 27: Java File I/O Streams: Reading transaction logs
* **Lecture Syllabus**:
  - Character and Byte file streams
  - BufferedReader buffer reading efficiency
  - Closing stream readers handles
* **Coding Exam**: `java-basics-exam-day-27` (`readFirstChar`)
  - **Task**: Write a JS function `readFirstChar(content)` reading log lines prefixes.
  - **Test**: Evaluates character at index 0.
* **Coding Assignment**: `java-basics-assign-day-27` (`estimateWriteChunks`)
  - **Task**: Write a JS function `estimateWriteChunks(bytes, chunkLimit)` compounding files segments.
  - **Test**: Returns ceiling ratio checks.

#### 🟢 Day 28: SOLID Principles in Ledger Systems Architecture
* **Lecture Syllabus**:
  - Single responsibility ledger design
  - Dependency inversion interfaces configuration
  - Liskov substitution subclass rules
* **Coding Exam**: `java-basics-exam-day-28` (`isValidClass`)
  - **Task**: Write a JS function `isValidClass(roleObject)` checking class methods count constraints.
  - **Test**: Restricts methods list length.
* **Coding Assignment**: `java-basics-assign-day-28` (`classHasOnlyOneRole`)
  - **Task**: Write a JS function `classHasOnlyOneRole(roleObject)` verifying role boundaries.
  - **Test**: Asserts role matches STORAGE.

#### 🟢 Day 29: JUnit Testing & Boundary Asserts
* **Lecture Syllabus**:
  - Automated unit testing methodologies
  - Configuring assertions validations checks
  - Boundary test cases validation
* **Coding Exam**: `java-basics-exam-day-29` (`assertEqual`)
  - **Task**: Write a JS function `assertEqual(val, expected)` validating equivalence.
  - **Test**: Checks strict equality conditions.
* **Coding Assignment**: `java-basics-assign-day-29` (`assertNotNull`)
  - **Task**: Write a JS function `assertNotNull(val)` checking variable definition.
  - **Test**: Confirms variables are not null/undefined.

#### 🟢 Day 30: Java Capstone: Comprehensive Account Ledger Audit
* **Lecture Syllabus**:
  - Evaluating interest calculations compound rules
  - Checking withdraw validations guardrails
  - Auditing transaction log multi-dimensional indexes
* **Coding Exam**: `java-basics-exam-day-30` (`filterSum`)
  - **Task**: Write a JS function `filterSum(nums, limit)` summing transactions exceeding limit.
  - **Test**: Compares inputs and accumulates aggregates.
* **Coding Assignment**: `java-basics-assign-day-30` (`hasFactors`)
  - **Task**: Write a JS function `hasFactors(val, f1, f2)` checking factors properties.
  - **Test**: Evaluates double modulo checks.

---
*Created by Antigravity*
