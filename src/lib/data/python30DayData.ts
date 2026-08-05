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

export const PYTHON_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is Python? — Your Very First Program with print() and Comments",
    desc: "Python is one of the most beginner-friendly programming languages in the world — used by Google, Netflix, NASA, Instagram, and Spotify. Unlike languages like Java or C++, Python needs no complicated setup. You type code and it runs. No semicolons at the end of lines. No curly braces around blocks. No type declarations. Just clean, readable instructions that almost read like English. Your very first Python program is just one line: print(\"Hello World\"). Type this in a file called hello.py, run it with 'python hello.py' in your terminal, and Python prints 'Hello World' on your screen. The print() function is how Python shows output. You can print anything: print(\"Hello World\") prints Hello World. print(42) prints the number 42. print(3.14) prints 3.14. print(\"My name is Priya\") prints My name is Priya. You can print multiple values separated by commas: print(\"My age is\", 25) prints 'My age is 25' with a space between them automatically. You can print blank lines with just print(). Comments are lines Python completely ignores — they are notes for you (or other developers reading your code) to understand what is happening. A single-line comment starts with #: # This line is a comment — Python skips this entirely. You can add a comment at the end of a code line too: print(\"Hello\") # This prints Hello. Three important Python rules every beginner must know: (1) Python is CASE-SENSITIVE — print works, Print throws an error, PRINT throws an error. (2) Indentation (spaces at the start of a line) matters in Python — we will see this when we reach if statements and loops. (3) Python runs your code top to bottom, line by line, in order — line 1 first, then line 2, and so on. (Real world: Python is the most popular language for Artificial Intelligence and Data Science. ChatGPT is built with Python. Google, YouTube, and Instagram all use Python in their backends. Data scientists at Amazon and Flipkart use Python to analyse millions of customer records every single day.)",
    syllabus: ["What programming means: you write step-by-step instructions in Python (a .py file) and the computer executes them one by one, top to bottom. Python is an interpreted language — no compilation step needed. Just save your code and run it. print(\"Hello\") on line 1 runs first. print(\"Bye\") on line 2 runs second.", "The print() function: print(\"Hello World\") displays Hello World. print(42) displays 42. print(\"Name:\", \"Alice\") displays 'Name: Alice' (comma adds a space). print() with nothing displays a blank line. You can call print() as many times as you need — each call starts on a new line.", "Comments with #: # This is a comment — Python skips it completely. Add comments ABOVE or AFTER code to explain WHY you wrote it. Case rule: print() works, Print() does not, PRINT() does not — Python is case-sensitive for everything."],
    eTitle: "Exam: Hello World printer",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Welcome banner output",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Getting User Input — The input() Function, Type Conversion and Common Mistakes",
    desc: "Every useful program needs to react to what the user types, not just print the same thing every time. In Python, you use the input() function to read what a user types from the keyboard. It is incredibly simple: name = input(\"Enter your name: \"). When Python reaches this line, it prints 'Enter your name: ' on the screen, then PAUSES and waits. The cursor blinks. The user types something and presses Enter. Whatever they typed gets stored in the variable 'name'. Then your program continues. You can immediately use the variable: print(\"Hello\", name) prints 'Hello Priya' if the user typed Priya. CRITICAL WARNING: input() ALWAYS returns a string, even if the user types a number. If you do age = input(\"Enter your age: \") and the user types 25, Python stores the STRING \"25\" (text) not the NUMBER 25. If you then try age + 5, Python throws a TypeError because you cannot add a number to a string. The fix is type conversion: age = int(input(\"Enter your age: \")). The int() function converts the string \"25\" to the integer 25. Now age + 5 = 30 works correctly. Similarly: price = float(input(\"Enter price: \")) converts the input to a decimal number. The three most important conversion functions are: int(\"25\") converts to integer 25, float(\"3.14\") converts to float 3.14, str(25) converts number 25 to string \"25\". You can check what type any value is using type(): type(25) returns int, type(\"hello\") returns str, type(3.14) returns float, type(True) returns bool. When converting, be careful: int(\"hello\") will throw a ValueError because \"hello\" cannot become a number. Always make sure the user is giving you the right type of input before converting. (Real world: Every form on the internet — sign-up forms on Flipkart, payment forms on Paytm, search on Google — is the web equivalent of input(). The web page waits for you to type, reads your text, converts it to the right type, and processes it.)",
    syllabus: ["input() function: name = input(\"Enter name: \") — Python prints 'Enter name: ' then PAUSES waiting for user to type and press Enter. The typed text is stored in name as a string. You can then print it: print(\"Hello\", name) or use it in an f-string: print(f\"Hello {name}\").", "Type conversion — CRITICAL: input() ALWAYS returns a string. If user types 25, you get string \"25\" not number 25. To do math, convert: age = int(input(\"Enter age: \")) converts to integer. price = float(input(\"Enter price: \")) converts to float. int(\"42\") = 42, float(\"3.14\") = 3.14, str(100) = \"100\".", "TypeError trap: 'input() + 5' throws TypeError because you are adding a number to a string. Always convert input before doing arithmetic. Verify types with type(): type(25) shows int, type(\"25\") shows str — they look the same when printed but behave completely differently in calculations."],
    eTitle: "Exam: Profile variables configuration",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: User profile parameters check",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Numbers, Basic Math & Strings",
    desc: "Master integers, floats, string definitions, and arithmetic expressions. (Real world: Banking software parses numbers, adding inputs representing currency values.)",
    syllabus: ["Integers vs floats math boundaries", "String characters boundaries", "Arithmetic operators precedence"],
    eTitle: "Exam: Numbers Sum Calculator",
    eDesc: "Write a JS function `calculateSum(a, b)` returning the sum of a and b. Return 0 if parameters are negative.",
    eStarter: "function calculateSum(a, b) {\n    // Write your code here\n    \n}",
    eHint: "Add inputs directly, returning values.",
    eTest: "if (typeof calculateSum !== 'function') throw new Error('Method calculateSum not found');\nif (calculateSum(5, 10) !== 15) throw new Error('Basic sum failed');",
    aTitle: "Assignment: Age Calculator",
    aDesc: "Write a JS function `calculateUserAge(birthYear, currentYear)` returning currentYear - birthYear.",
    aStarter: "function calculateUserAge(birthYear, currentYear) {\n    // Write your code here\n    \n}",
    aHint: "Subtract birthYear from currentYear.",
    aTest: "if (typeof calculateUserAge !== 'function') throw new Error('Method calculateUserAge not found');\nif (calculateUserAge(2000, 2026) !== 26) throw new Error('Age calculation failed');"
  },
  {
    title: "Basic Input & Output",
    desc: "Master reading input values, converting input strings to integers, and printing outputs. (Real world: CLI programs block execution, reading client terminal key inputs before resolving routes.)",
    syllabus: ["Input streams parsing rules", "Type casting string variables to numbers", "Printing formatted logs"],
    eTitle: "Exam: Profile Greet Writer",
    eDesc: "Write a JS function `greetUserProfile(username)` returning string 'Welcome ' + username. Return 'Welcome User' if username is empty/null.",
    eStarter: "function greetUserProfile(username) {\n    // Write your code here\n    \n}",
    eHint: "Concatenate string literal with input value, checking null.",
    eTest: "if (typeof greetUserProfile !== 'function') throw new Error('Method greetUserProfile not found');\nif (greetUserProfile('Alice') !== 'Welcome Alice') throw new Error('Greeting failed');",
    aTitle: "Assignment: Username check",
    aDesc: "Write a JS function `isUsernameMatch(username, storedName)` returning true if lowercase username matches lowercase storedName.",
    aStarter: "function isUsernameMatch(username, storedName) {\n    // Write your code here\n    \n}",
    aHint: "Convert strings to lowercase and compare.",
    aTest: "if (typeof isUsernameMatch !== 'function') throw new Error('Method isUsernameMatch not found');"
  },
  {
    title: "Operators & Invoice Calculations",
    desc: "Master arithmetic, relational, and logical checks. (Real world: Retail checkouts sum quantities of products, applying discounts if cart totals exceed rules limits.)",
    syllabus: ["Arithmetic operator combinations", "Logical operations checks", "Calculating pricing invoice outputs"],
    eTitle: "Exam: Invoice Calculator",
    eDesc: "Write a JS function `applyDiscount(total, discountPercent)` returning total - (total * (discountPercent / 100)). Return 0 if negative.",
    eStarter: "function applyDiscount(total, discountPercent) {\n    // Write your code here\n    \n}",
    eHint: "Calculate percentage and subtract.",
    eTest: "if (typeof applyDiscount !== 'function') throw new Error('Method applyDiscount not found');\nif (applyDiscount(100, 10) !== 90) throw new Error('Discount math failed');",
    aTitle: "Assignment: Grocery Invoice Builder",
    aDesc: "Write a JS function `groceryInvoice(riceQty, sugarQty, milkQty)` returning total sum where rice is $2/kg, sugar is $3/kg, and milk is $4/liter.",
    aStarter: "function groceryInvoice(riceQty, sugarQty, milkQty) {\n    // Write your code here\n    \n}",
    aHint: "Multiply quantity by price values and sum.",
    aTest: "if (typeof groceryInvoice !== 'function') throw new Error('Method groceryInvoice not found');\nif (groceryInvoice(2, 1, 1) !== 11) throw new Error('Invoice math failed');"
  },
  {
    title: "If/Else Conditions & Branching",
    desc: "Master conditional logic rules, structural branching, and else-if conditions. (Real world: Security systems check user token scopes, routing traffic to restricted segments or blocking access.)",
    syllabus: ["Branching statements syntax rules", "Nested conditions structures", "Evaluating logic check paths"],
    eTitle: "Exam: Voting eligibility check",
    eDesc: "Write a JS function `isEligibleToVote(age)` returning true if age >= 18. Return false if age is negative or invalid.",
    eStarter: "function isEligibleToVote(age) {\n    // Write your code here\n    \n}",
    eHint: "Evaluate numeric inequality comparison bounds.",
    eTest: "if (typeof isEligibleToVote !== 'function') throw new Error('Method isEligibleToVote not found');\nif (isEligibleToVote(20) !== true) throw new Error('Age check failed');",
    aTitle: "Assignment: Grade Calculator",
    aDesc: "Write a JS function `calculateGrade(marks)` returning 'A' if marks >= 90, 'B' if marks >= 75, 'C' if marks >= 50, and 'F' otherwise.",
    aStarter: "function calculateGrade(marks) {\n    // Write your code here\n    \n}",
    aHint: "Implement multiple conditional branching statements checks.",
    aTest: "if (typeof calculateGrade !== 'function') throw new Error('Method calculateGrade not found');"
  },
  {
    title: "Week 1 Revision & Mini Project",
    desc: "Consolidate Week 1 learning, variables, branching logic, and mathematical operators. (Real world: CLI system menus read inputs, compiling student data profiles summaries.)",
    syllabus: ["Variables memory lifecycle review", "Combining operators and logic checks", "Building structured console outputs"],
    eTitle: "Exam: Marks Average Calculator",
    eDesc: "Write a JS function `calculateAverage(m1, m2, m3)` returning average value of three marks. Return 0 if any input is negative.",
    eStarter: "function calculateAverage(m1, m2, m3) {\n    // Write your code here\n    \n}",
    eHint: "Sum values and divide by 3.",
    eTest: "if (typeof calculateAverage !== 'function') throw new Error('Method calculateAverage not found');\nif (calculateAverage(80, 90, 100) !== 90) throw new Error('Average math failed');",
    aTitle: "Assignment: Student Information system mapper",
    aDesc: "Write a JS function `mapStudentInfo(name, rollNum, grade)` returning string: `Student:[name], Roll:[rollNum], Grade:[grade]`. Return empty string if inputs are empty.",
    aStarter: "function mapStudentInfo(name, rollNum, grade) {\n    // Write your code here\n    \n}",
    aHint: "Concatenate student details string labels.",
    aTest: "if (typeof mapStudentInfo !== 'function') throw new Error('Method mapStudentInfo not found');"
  },
  {
    title: "Iteration: The While Loop",
    desc: "Master loop boundaries, infinite loop preventions, and while loop counters. (Real world: Message queues poll incoming events streams, looping while connection endpoints remain active.)",
    syllabus: ["While loops execution lifecycle", "Loop counters and increments", "Safe exit conditions checks"],
    eTitle: "Exam: Numbers list printer",
    eDesc: "Write a JS function `sumRange(n)` returning sum of numbers 1 to n. Return 0 if n <= 0.",
    eStarter: "function sumRange(n) {\n    // Write your code here\n    \n}",
    eHint: "Loop and accumulate totals.",
    eTest: "if (typeof sumRange !== 'function') throw new Error('Method sumRange not found');\nif (sumRange(5) !== 15) throw new Error('Range sum math failed');",
    aTitle: "Assignment: Even numbers selector",
    aDesc: "Write a JS function `countEvenNumbers(limit)` returning total count of even numbers between 1 and limit.",
    aStarter: "function countEvenNumbers(limit) {\n    // Write your code here\n    \n}",
    aHint: "Iterate up to limit, checking modulo 2 matches.",
    aTest: "if (typeof countEvenNumbers !== 'function') throw new Error('Method countEvenNumbers not found');"
  },
  {
    title: "Iteration: The For Loop & ranges",
    desc: "Master deterministic for loops, range boundary allocations, and collection loop iterations. (Real world: Logs indices parse files directories, processing every record segment sequentially using range indices.)",
    syllabus: ["For loops syntax models", "Range step parameters configurations", "Iterating index values"],
    eTitle: "Exam: Message Repeater",
    eDesc: "Write a JS function `repeatMessage(msg, times)` returning msg repeated times. Return empty string if times <= 0.",
    eStarter: "function repeatMessage(msg, times) {\n    // Write your code here\n    \n}",
    eHint: "Create loop or use string repeat methods.",
    eTest: "if (typeof repeatMessage !== 'function') throw new Error('Method repeatMessage not found');\nif (repeatMessage('A', 3) !== 'AAA') throw new Error('Repeater failed');",
    aTitle: "Assignment: Multiplication Table Generator",
    aDesc: "Write a JS function `getMultiplicationTableSum(num)` returning sum of products: `num * 1` to `num * 10`.",
    aStarter: "function getMultiplicationTableSum(num) {\n    // Write your code here\n    \n}",
    aHint: "Loop from 1 to 10, multiplying and summing.",
    aTest: "if (typeof getMultiplicationTableSum !== 'function') throw new Error('Method getMultiplicationTableSum not found');"
  },
  {
    title: "Strings Manipulation & Slicing",
    desc: "Master string slicing, characters indexing, and built-in methods. (Real world: Telemetry log parsers slice headers strings prefixes, isolating payload contents.)",
    syllabus: ["String slice indexing configurations", "Converting case properties (upper, lower)", "Finding characters segment indices"],
    eTitle: "Exam: String length auditor",
    eDesc: "Write a JS function `getStringLength(val)` returning string length. Return 0 if null/empty.",
    eStarter: "function getStringLength(val) {\n    // Write your code here\n    \n}",
    eHint: "Return string length property.",
    eTest: "if (typeof getStringLength !== 'function') throw new Error('Method getStringLength not found');\nif (getStringLength('hello') !== 5) throw new Error('Length check failed');",
    aTitle: "Assignment: First name extractor",
    aDesc: "Write a JS function `extractFirstName(fullName)` returning first token split by space. Return empty string if input is invalid.",
    aStarter: "function extractFirstName(fullName) {\n    // Write your code here\n    \n}",
    aHint: "Split string by space, return first element.",
    aTest: "if (typeof extractFirstName !== 'function') throw new Error('Method extractFirstName not found');\nif (extractFirstName('John Doe') !== 'John') throw new Error('First name extract failed');"
  },
  {
    title: "Python Lists Basics",
    desc: "Master dynamic list structures, index boundaries, append, and remove. (Real world: Shopping carts store items array, pushing active records during catalog checkouts.)",
    syllabus: ["Python list memory allocation", "Appending and deleting list values", "Index lookups boundaries checks"],
    eTitle: "Exam: City List Manager",
    eDesc: "Write a JS function `isCityInList(cities, city)` returning true if city exists in cities array. Return false if cities is null.",
    eStarter: "function isCityInList(cities, city) {\n    // Write your code here\n    \n}",
    eHint: "Use includes() to check presence.",
    eTest: "if (typeof isCityInList !== 'function') throw new Error('Method isCityInList not found');\nif (isCityInList(['Delhi', 'Mumbai'], 'Delhi') !== true) throw new Error('City lookup failed');",
    aTitle: "Assignment: Max Number Finder",
    aDesc: "Write a JS function `findMax(nums)` returning maximum value in nums array. Return null if empty.",
    aStarter: "function findMax(nums) {\n    // Write your code here\n    \n}",
    aHint: "Find max element using Math.max or loop iterations.",
    aTest: "if (typeof findMax !== 'function') throw new Error('Method findMax not found');\nif (findMax([3, 5, 2]) !== 5) throw new Error('Max finder failed');"
  },
  {
    title: "Iterating Lists & Aggregates",
    desc: "Master list iteration rules, data filter logic, and calculations. (Real world: Billing engines iterate transaction collections, summing amounts to process ledger updates.)",
    syllabus: ["Iterating collections elements", "Filtering records array based on thresholds", "Summing list numbers"],
    eTitle: "Exam: Passing Marks Filter",
    eDesc: "Write a JS function `filterPassingMarks(marks)` returning array of marks >= 50. Return empty array if input is null.",
    eStarter: "function filterPassingMarks(marks) {\n    // Write your code here\n    \n}",
    eHint: "Filter array values using numeric threshold checks.",
    eTest: "if (typeof filterPassingMarks !== 'function') throw new Error('Method filterPassingMarks not found');\nif (filterPassingMarks([45, 60, 50]).length !== 2) throw new Error('Marks filter failed');",
    aTitle: "Assignment: Total Bill Calculator",
    aDesc: "Write a JS function `calculateTotalBill(prices)` returning sum of prices array elements. Return 0 if null.",
    aStarter: "function calculateTotalBill(prices) {\n    // Write your code here\n    \n}",
    aHint: "Sum values using loop or reduce helpers.",
    aTest: "if (typeof calculateTotalBill !== 'function') throw new Error('Method calculateTotalBill not found');"
  },
  {
    title: "Tuples: Immutable Collections",
    desc: "Master tuples arrays, comparing mutable lists vs immutable tuples. (Real world: Routing frameworks store fixed coordinates arrays in tuples, preventing runtime state changes.)",
    syllabus: ["Tuples immutability properties", "Accessing values by index positions", "Comparing tuples vs lists usages"],
    eTitle: "Exam: Fruit Tuple Reader",
    eDesc: "Write a JS function `readTupleIndex(tuple, index)` returning element at index. Return null if index is out of bounds.",
    eStarter: "function readTupleIndex(tuple, index) {\n    // Write your code here\n    \n}",
    eHint: "Verify index boundary limits before returning array index.",
    eTest: "if (typeof readTupleIndex !== 'function') throw new Error('Method readTupleIndex not found');\nif (readTupleIndex(['Apple', 'Banana'], 0) !== 'Apple') throw new Error('Index read failed');",
    aTitle: "Assignment: Tuple bounds checker",
    aDesc: "Write a JS function `isTupleIndexSafe(tuple, index)` returning true if index >= 0 and index < tuple.length.",
    aStarter: "function isTupleIndexSafe(tuple, index) {\n    // Write your code here\n    \n}",
    aHint: "Check bounds comparison.",
    aTest: "if (typeof isTupleIndexSafe !== 'function') throw new Error('Method isTupleIndexSafe not found');"
  },
  {
    title: "Week 2 Review & Mini Project",
    desc: "Consolidate Week 2 loops and list structures. (Real world: Expense managers loop daily data, calculating categories sums.)",
    syllabus: ["Nested loops iterations review", "List modification APIs updates", "String character loops checks"],
    eTitle: "Exam: Names case formatter",
    eDesc: "Write a JS function `convertNamesToUppercase(names)` returning array of names in all uppercase. Return empty array if input is null.",
    eStarter: "function convertNamesToUppercase(names) {\n    // Write your code here\n    \n}",
    eHint: "Map array elements using toUpperCase().",
    eTest: "if (typeof convertNamesToUppercase !== 'function') throw new Error('Method convertNamesToUppercase not found');\nif (convertNamesToUppercase(['alice'])[0] !== 'ALICE') throw new Error('Uppercase map failed');",
    aTitle: "Assignment: Expense Tracker Calculator",
    aDesc: "Write a JS function `calculateExpenseTracker(expenses, threshold)` returning sum of expense items whose value exceeds threshold.",
    aStarter: "function calculateExpenseTracker(expenses, threshold) {\n    // Write your code here\n    \n}",
    aHint: "Loop and check values threshold comparison limits.",
    aTest: "if (typeof calculateExpenseTracker !== 'function') throw new Error('Method calculateExpenseTracker not found');"
  },
  {
    title: "Functions Basics & Parameters",
    desc: "Master function definitions, parameters parameters, and return routing. (Real world: Microservices write helper functions, wrapping business validations in modular blocks.)",
    syllabus: ["Defining functions scope parameters", "Return statements outputs routing", "Positional input arguments"],
    eTitle: "Exam: Greet function creator",
    eDesc: "Write a JS function `greetUser(name)` returning 'Hello ' + name. Return 'Hello Guest' if name is empty/null.",
    eStarter: "function greetUser(name) {\n    // Write your code here\n    \n}",
    eHint: "Concatenate message strings prefix.",
    eTest: "if (typeof greetUser !== 'function') throw new Error('Method greetUser not found');\nif (greetUser('Bob') !== 'Hello Bob') throw new Error('Greeting helper failed');",
    aTitle: "Assignment: Even Indicator Helper",
    aDesc: "Write a JS function `isEven(num)` returning true if num is even. Return false if num is odd or invalid.",
    aStarter: "function isEven(num) {\n    // Write your code here\n    \n}",
    aHint: "Use modulo 2 inequality checks.",
    aTest: "if (typeof isEven !== 'function') throw new Error('Method isEven not found');"
  },
  {
    title: "Multiple Parameters & Default Arguments",
    desc: "Master parameters handling, default parameter bounds, and keyword inputs. (Real world: Telemetry APIs configure default timeout variables, falling back to standard ports if config values are omitted.)",
    syllabus: ["Configuring default parameters bounds", "Handling multiple input variables", "Calling arguments keyword mapping"],
    eTitle: "Exam: Welcome Course Message Builder",
    eDesc: "Write a JS function `welcomeCourse(name, course)` returning string: `Welcome [name] to [course]`. Fallback course to 'Python' if course parameter is empty/null.",
    eStarter: "function welcomeCourse(name, course) {\n    // Write your code here\n    \n}",
    eHint: "Set default string boundaries if variable is falsy.",
    eTest: "if (typeof welcomeCourse !== 'function') throw new Error('Method welcomeCourse not found');\nif (welcomeCourse('Sam', '') !== 'Welcome Sam to Python') throw new Error('Default course fallback failed');",
    aTitle: "Assignment: Simple Calculator router",
    aDesc: "Write a JS function `calculateSimple(a, b, op)` returning a + b if op === '+', and a - b if op === '-'. Return 0 otherwise.",
    aStarter: "function calculateSimple(a, b, op) {\n    // Write your code here\n    \n}",
    aHint: "Evaluate operators strings matching values.",
    aTest: "if (typeof calculateSimple !== 'function') throw new Error('Method calculateSimple not found');"
  },
  {
    title: "Python Dictionaries Basics",
    desc: "Master key-value storage properties, reading keys, and hashing basics. (Real world: Database ORMs fetch records, storing columns in dictionary maps.)",
    syllabus: ["Key-value dictionary structures", "Inserting and querying map values", "Handling missing keys lookup errors"],
    eTitle: "Exam: Student Map Builder",
    eDesc: "Write a JS function `createStudentMap(name, age)` returning object `{ name: name, age: age }`.",
    eStarter: "function createStudentMap(name, age) {\n    // Write your code here\n    \n}",
    eHint: "Build key-value literal objects directly.",
    eTest: "if (typeof createStudentMap !== 'function') throw new Error('Method createStudentMap not found');\nif (createStudentMap('Alice', 20).name !== 'Alice') throw new Error('Map creation failed');",
    aTitle: "Assignment: Product Price Lookup",
    aDesc: "Write a JS function `getProductPrice(catalog, product)` returning catalog[product] value if product exists in catalog. Return 'Not found' otherwise.",
    aStarter: "function getProductPrice(catalog, product) {\n    // Write your code here\n    \n}",
    aHint: "Check key existence in object map.",
    aTest: "if (typeof getProductPrice !== 'function') throw new Error('Method getProductPrice not found');"
  },
  {
    title: "Dictionaries with Loops",
    desc: "Master iterating dictionary maps, reading keys arrays, and accumulating totals. (Real world: Shopping checkouts loop cart inventories, checking stock catalog maps to sum weights.)",
    syllabus: ["Iterating key arrays keys()", "Iterating value arrays values()", "Mapping keys to values loop properties"],
    eTitle: "Exam: Key list exporter",
    eDesc: "Write a JS function `getDictionaryKeys(dict)` returning array of object keys strings. Return empty array if null.",
    eStarter: "function getDictionaryKeys(dict) {\n    // Write your code here\n    \n}",
    eHint: "Use Object.keys() method helper.",
    eTest: "if (typeof getDictionaryKeys !== 'function') throw new Error('Method getDictionaryKeys not found');\nif (getDictionaryKeys({ a: 1 })[0] !== 'a') throw new Error('Key fetch failed');",
    aTitle: "Assignment: Subject Marks accumulator",
    aDesc: "Write a JS function `sumSubjectMarks(marksMap)` returning sum of all subject marks values in object values list.",
    aStarter: "function sumSubjectMarks(marksMap) {\n    // Write your code here\n    \n}",
    aHint: "Loop properties or use Object.values reduce.",
    aTest: "if (typeof sumSubjectMarks !== 'function') throw new Error('Method sumSubjectMarks not found');"
  },
  {
    title: "File Input & Output (I/O)",
    desc: "Master file handles, write operations, read operations, and streams buffer. (Real world: Logging engines write audit trails, appending diagnostic summaries to daily files.)",
    syllabus: ["Opening files in write ('w') mode", "Opening files in read ('r') mode", "Buffer streams flushing procedures"],
    eTitle: "Exam: Write mock file string",
    eDesc: "Write a JS function `writeMockFile(filename, content)` returning string: `File:[filename] saved with [content]`. Return empty string if inputs are empty.",
    eStarter: "function writeMockFile(filename, content) {\n    // Write your code here\n    \n}",
    eHint: "Concatenate file write simulation messages.",
    eTest: "if (typeof writeMockFile !== 'function') throw new Error('Method writeMockFile not found');\nif (writeMockFile('log.txt', 'OK') !== 'File:log.txt saved with OK') throw new Error('File write simulation failed');",
    aTitle: "Assignment: Read mock file content",
    aDesc: "Write a JS function `readMockFile(fileObject)` returning fileObject.content. Return 'Empty' if missing.",
    aStarter: "function readMockFile(fileObject) {\n    // Write your code here\n    \n}",
    aHint: "Query object parameters properties.",
    aTest: "if (typeof readMockFile !== 'function') throw new Error('Method readMockFile not found');"
  },
  {
    title: "Errors & Exception Handling",
    desc: "Master exception loops, try-except routing, and handling division by zero errors. (Real world: Gateway APIs wrap parsing routines in try-catch structures, preventing runtime server crashes on bad inputs.)",
    syllabus: ["Try-catch-finally block operations", "Handling system specific crash error codes", "Safe fallback logic defaults values"],
    eTitle: "Exam: Safe division check",
    eDesc: "Write a JS function `safeDivide(a, b)` returning a / b. Throw an Error('ZeroDivisionError') if b === 0.",
    eStarter: "function safeDivide(a, b) {\n    // Write your code here\n    \n}",
    eHint: "Check denominator limit bounds, throwing error if zero.",
    eTest: "if (typeof safeDivide !== 'function') throw new Error('Method safeDivide not found');\ntry { safeDivide(5, 0); } catch(e) { if(e.message === 'ZeroDivisionError') return; }\nthrow new Error('Zero division exception trace failed');",
    aTitle: "Assignment: Safe file parser",
    aDesc: "Write a JS function `safeParseJson(jsonStr)` returning parsed object. Return null if parsing raises error.",
    aStarter: "function safeParseJson(jsonStr) {\n    // Write your code here\n    \n}",
    aHint: "Wrap JSON.parse calls in try-catch logic.",
    aTest: "if (typeof safeParseJson !== 'function') throw new Error('Method safeParseJson not found');"
  },
  {
    title: "Week 3 Review & Mini Project",
    desc: "Consolidate Week 3 file streams, exception handling loops, and dictionary operations. (Real world: Contact books append names to local maps, writing backups to storage.)",
    syllabus: ["Nested dictionary lookups maps", "Chaining operations with files writes", "Handling runtime exceptions gracefully"],
    eTitle: "Exam: Contact dictionary builder",
    eDesc: "Write a JS function `createContact(name, phone)` returning object `{ name: name, phone: phone }`. Return null if inputs are empty.",
    eStarter: "function createContact(name, phone) {\n    // Write your code here\n    \n}",
    eHint: "Verify input variables values, return literal objects.",
    eTest: "if (typeof createContact !== 'function') throw new Error('Method createContact not found');\nif (createContact('Sam', '999').phone !== '999') throw new Error('Contact map failed');",
    aTitle: "Assignment: Contact Book backup mapper",
    aDesc: "Write a JS function `mapContactsFileBackup(contacts)` returning list of strings formatting: `[name]:[phone]`. Return empty array if null.",
    aStarter: "function mapContactsFileBackup(contacts) {\n    // Write your code here\n    \n}",
    aHint: "Loop array elements, mapping values to strings.",
    aTest: "if (typeof mapContactsFileBackup !== 'function') throw new Error('Method mapContactsFileBackup not found');"
  },
  {
    title: "Menu-Driven Application Structures",
    desc: "Master loop options select, routing user entries, and CLI navigation. (Real world: POS payment screens run infinite menu loops, parsing selections until cashier logs out.)",
    syllabus: ["Infinite loops menu options routing", "Handling user choices evaluations", "Exit status loops breaks"],
    eTitle: "Exam: CLI choice checker",
    eDesc: "Write a JS function `isChoiceExit(choice)` returning true if choice === 'Exit' or choice === '3'. Returns false otherwise.",
    eStarter: "function isChoiceExit(choice) {\n    // Write your code here\n    \n}",
    eHint: "Evaluate values checks case-sensitively.",
    eTest: "if (typeof isChoiceExit !== 'function') throw new Error('Method isChoiceExit not found');\nif (isChoiceExit('3') !== true) throw new Error('Exit choice check failed');",
    aTitle: "Assignment: Menu operation dispatcher",
    aDesc: "Write a JS function `dispatchMenu(choice, a, b)` returning a + b if choice === '1', and a - b if choice === '2'. Return 0 otherwise.",
    aStarter: "function dispatchMenu(choice, a, b) {\n    // Write your code here\n    \n}",
    aHint: "Route calculations based on choice string indices.",
    aTest: "if (typeof dispatchMenu !== 'function') throw new Error('Method dispatchMenu not found');"
  },
  {
    title: "In-Memory Data Processing",
    desc: "Master list record filters, computing statistics averages, and finding extremes. (Real world: Analytics controllers parse metrics objects lists, extracting peak values to detect server overload states.)",
    syllabus: ["Sorting objects list arrays", "Calculating average class scores metrics", "Extracting peak properties from objects"],
    eTitle: "Exam: Class Average Finder",
    eDesc: "Write a JS function `calculateClassAverage(students)` returning average marks of students array. Return 0 if array is null/empty.",
    eStarter: "function calculateClassAverage(students) {\n    // Write your code here\n    \n}",
    eHint: "Iterate students list, sum marks, divide by count.",
    eTest: "if (typeof calculateClassAverage !== 'function') throw new Error('Method calculateClassAverage not found');\nconst s = [{ marks: 80 }, { marks: 90 }];\nif (calculateClassAverage(s) !== 85) throw new Error('Class average failed');",
    aTitle: "Assignment: Top Student Finder",
    aDesc: "Write a JS function `findTopStudent(students)` returning student object containing highest marks. Return null if empty.",
    aStarter: "function findTopStudent(students) {\n    // Write your code here\n    \n}",
    aHint: "Find max element using iteration comparison loops.",
    aTest: "if (typeof findTopStudent !== 'function') throw new Error('Method findTopStudent not found');"
  },
  {
    title: "Randomness & Modules",
    desc: "Master import procedures, using standard math libraries, and generating random ranges. (Real world: Gaming servers load standard random libraries, choosing winning ticket numbers.)",
    syllabus: ["Importing module namespaces", "Using math utility libraries", "Choosing random choices from lists"],
    eTitle: "Exam: Square root selector",
    eDesc: "Write a JS function `getSquareRoot(val)` returning Math.sqrt(val). Return 0 if val is negative.",
    eStarter: "function getSquareRoot(val) {\n    // Write your code here\n    \n}",
    eHint: "Call built-in square root functions.",
    eTest: "if (typeof getSquareRoot !== 'function') throw new Error('Method getSquareRoot not found');\nif (getSquareRoot(9) !== 3) throw new Error('Square root math failed');",
    aTitle: "Assignment: Random list index selector",
    aDesc: "Write a JS function `getRandomItem(items)` returning element at random index: Math.floor(Math.random() * items.length).",
    aStarter: "function getRandomItem(items) {\n    // Write your code here\n    \n}",
    aHint: "Generate random decimals, scale, and floor.",
    aTest: "if (typeof getRandomItem !== 'function') throw new Error('Method getRandomItem not found');"
  },
  {
    title: "Creating Custom Modules",
    desc: "Master creating namespaces, separating concerns, and loading modular files. (Real world: Payment processors encapsulate checkout logic inside custom modules, importing classes to gateway endpoints.)",
    syllabus: ["Structuring custom namespace files", "Importing functions across directories", "Separating concerns in modular APIs"],
    eTitle: "Exam: Module exports checker",
    eDesc: "Write a JS function `isModuleLoaded(moduleObject)` returning true if moduleObject is non-empty object containing a function property 'run'. Returns false otherwise.",
    eStarter: "function isModuleLoaded(moduleObject) {\n    // Write your code here\n    \n}",
    eHint: "Verify properties type validation scopes.",
    eTest: "if (typeof isModuleLoaded !== 'function') throw new Error('Method isModuleLoaded not found');\nif (isModuleLoaded({ run: () => {} }) !== true) throw new Error('Module load verify failed');",
    aTitle: "Assignment: Helper mapper installer",
    aDesc: "Write a JS function `installModuleHelper(moduleObject, helperName, helperFunc)` adding helperFunc to moduleObject.",
    aStarter: "function installModuleHelper(moduleObject, helperName, helperFunc) {\n    // Write your code here\n    \n}",
    aHint: "Assign function properties dynamically.",
    aTest: "if (typeof installModuleHelper !== 'function') throw new Error('Method installModuleHelper not found');"
  },
  {
    title: "Basic Data Analysis",
    desc: "Master list range filters, finding extremes, and filtering indices values. (Real world: Weather dashboards read sensors feeds, alerting operators if records values violate rules bounds.)",
    syllabus: ["Finding temperature boundaries", "Filtering elements violating boundaries limits", "Calculating variance properties"],
    eTitle: "Exam: Temperature Boundary Checker",
    eDesc: "Write a JS function `isTempOutOfRange(temp, minVal, maxVal)` returning true if temp < minVal or temp > maxVal. Returns false otherwise.",
    eStarter: "function isTempOutOfRange(temp, minVal, maxVal) {\n    // Write your code here\n    \n}",
    eHint: "Evaluate inequalities comparisons parameters.",
    eTest: "if (typeof isTempOutOfRange !== 'function') throw new Error('Method isTempOutOfRange not found');\nif (isTempOutOfRange(40, 0, 35) !== true) throw new Error('Range audit failed');",
    aTitle: "Assignment: Extreme Temps Filter",
    aDesc: "Write a JS function `filterExtremeTemps(temps, limit)` returning array of temperatures strictly greater than limit.",
    aStarter: "function filterExtremeTemps(temps, limit) {\n    // Write your code here\n    \n}",
    aHint: "Filter array elements based on limits thresholds.",
    aTest: "if (typeof filterExtremeTemps !== 'function') throw new Error('Method filterExtremeTemps not found');"
  },
  {
    title: "Personal Expense Tracker CLI",
    desc: "Master lists of dictionaries mapping, categorical splits, and ledger totals. (Real world: Financial portals track categories budgets, warning consumers before transaction thresholds checks.)",
    syllabus: ["Lists of dictionaries mapping structures", "Calculating totals grouped by categories", "Validating budget limits bounds"],
    eTitle: "Exam: Category Expense Filter",
    eDesc: "Write a JS function `sumCategoryExpenses(expenses, category)` returning sum of expense amounts matching category. Return 0 if category is missing.",
    eStarter: "function sumCategoryExpenses(expenses, category) {\n    // Write your code here\n    \n}",
    eHint: "Loop elements, check category, accumulate amounts.",
    eTest: "if (typeof sumCategoryExpenses !== 'function') throw new Error('Method sumCategoryExpenses not found');\nconst e = [{ amt: 10, cat: 'food' }, { amt: 20, cat: 'rent' }];\nif (sumCategoryExpenses(e, 'food') !== 10) throw new Error('Category sum failed');",
    aTitle: "Assignment: Add expense record validation",
    aDesc: "Write a JS function `isValidExpenseRecord(record)` returning true if record contains 'amt' > 0 and 'cat' is a non-empty string.",
    aStarter: "function isValidExpenseRecord(record) {\n    // Write your code here\n    \n}",
    aHint: "Verify property types and bounds values.",
    aTest: "if (typeof isValidExpenseRecord !== 'function') throw new Error('Method isValidExpenseRecord not found');"
  },
  {
    title: "Contact Management System CLI",
    desc: "Master file backups, adding contacts dictionary entries, and lookup methods. (Real world: Customer databases append new profiles, mapping phone connections to files records.)",
    syllabus: ["Appending contacts dictionary mappings", "Writing dictionary files backups", "Searching records using key indices"],
    eTitle: "Exam: Contact Lookup Finder",
    eDesc: "Write a JS function `findContactPhone(contacts, name)` returning phone number if name matches. Return 'Not found' otherwise.",
    eStarter: "function findContactPhone(contacts, name) {\n    // Write your code here\n    \n}",
    eHint: "Inspect lowercase keys matching contact name entries.",
    eTest: "if (typeof findContactPhone !== 'function') throw new Error('Method findContactPhone not found');\nconst c = { bob: '999' };\nif (findContactPhone(c, 'Bob') !== '999') throw new Error('Contact lookup failed');",
    aTitle: "Assignment: Add contact to map",
    aDesc: "Write a JS function `addContactToMap(contacts, name, phone)` adding contact mapping. Return modified object.",
    aStarter: "function addContactToMap(contacts, name, phone) {\n    // Write your code here\n    \n}",
    aHint: "Assign property values on key maps.",
    aTest: "if (typeof addContactToMap !== 'function') throw new Error('Method addContactToMap not found');"
  },
  {
    title: "Capstone: Unified Console Suite",
    desc: "Assemble unified menu routers, routing choices to corresponding applications handlers. (Real world: Production servers boot backend applications routing requests to sub-modules selectors.)",
    syllabus: ["Consolidating menu routers controllers", "Forwarding options to sub-modules", "Verifying error-free routing limits"],
    eTitle: "Exam: App Suite Choice Router",
    eDesc: "Write a JS function `routeAppChoice(choice)` returning 'STUDENT_APP' if choice === '1', 'EXPENSE_APP' if choice === '2', and 'CONTACT_APP' if choice === '3'. Return 'UNKNOWN' otherwise.",
    eStarter: "function routeAppChoice(choice) {\n    // Write your code here\n    \n}",
    eHint: "Apply branching check operators matching choice indexes.",
    eTest: "if (typeof routeAppChoice !== 'function') throw new Error('Method routeAppChoice not found');\nif (routeAppChoice('1') !== 'STUDENT_APP') throw new Error('Suite routing failed');",
    aTitle: "Assignment: CLI Welcome message compiler",
    aDesc: "Write a JS function `compileWelcomeMessage(username)` returning string: `System Active: [username]`. Return `System Active: Guest` if name is empty.",
    aStarter: "function compileWelcomeMessage(username) {\n    // Write your code here\n    \n}",
    aHint: "Build output string concatenation formatting.",
    aTest: "if (typeof compileWelcomeMessage !== 'function') throw new Error('Method compileWelcomeMessage not found');"
  },
  {
    title: "Final Review & Refactoring",
    desc: "Refactor repeated operations, analyze code layouts, and verify final build parameters. (Real world: SDEs refactor duplicate loops blocks, improving system scaling performance.)",
    syllabus: ["Refactoring duplicate code blocks", "Structuring modular class models", "Verifying final compliance standards"],
    eTitle: "Exam: Duplicate Code Refactoring Helper",
    eDesc: "Write a JS function `deduplicateNumbers(numbers)` returning array containing unique numbers. Return empty array if input is null.",
    eStarter: "function deduplicateNumbers(numbers) {\n    // Write your code here\n    \n}",
    eHint: "Use Set object helper to extract unique values.",
    eTest: "if (typeof deduplicateNumbers !== 'function') throw new Error('Method deduplicateNumbers not found');\nif (deduplicateNumbers([1, 1, 2]).length !== 2) throw new Error('Deduplicate failed');",
    aTitle: "Assignment: Code verification helper",
    aDesc: "Write a JS function `isCodeStructured(codeStr)` returning true if codeStr is non-empty string and contains 'def ' keyword indicator. Returns false otherwise.",
    aStarter: "function isCodeStructured(codeStr) {\n    // Write your code here\n    \n}",
    aHint: "Check substring presence inside code input.",
    aTest: "if (typeof isCodeStructured !== 'function') throw new Error('Method isCodeStructured not found');"
  }
];

export const PYTHON_30_DAYS_QUESTS = PYTHON_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `py-basics-lecture-day-${dayNum}`,
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
      {
        ...lecture,
        title: `Day 1 (1/3): ${cfg.title}`
      },
      {
        id: `py-basics-lecture2-day-1`,
        title: `Day 1 (2/3): Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `py-basics-lecture3-day-1`,
        title: `Day 1 (3/3): Real-World Industry Context & Visualization Guide`,
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
      {
        ...lecture,
        title: `Day 2 (1/3): ${cfg.title}`
      },
      {
        id: `py-basics-lecture2-day-2`,
        title: `Day 2 (2/3): Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `py-basics-lecture3-day-2`,
        title: `Day 2 (3/3): Practical Code Workshop & Edge Case Pitfall Warnings`,
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
  return buildEnrichedDayQuests('py-basics', dayNum, cfg);
});
