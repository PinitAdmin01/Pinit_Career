def word_count(text_or_list):
    if isinstance(text_or_list, list):
        full_text = " ".join(text_or_list)
    else:
        full_text = str(text_or_list)
    return len(full_text.strip().split())

def make_check(q, correct, wrong1, wrong2, wrong3, why):
    return {
        "question": q,
        "options": [correct, wrong1, wrong2, wrong3],
        "answer": 0,
        "why": why
    }

DAY_2 = {
  "day": 2,
  "title": "Variables, Primitive Types & Interactive Input: The Scanner Console Engine",
  "goal": "Master Java memory primitives and user interaction: declare and initialize variables across the 8 primitive types, understand memory footprints (int, double, boolean, char), utilize java.util.Scanner for terminal input, and master buffer management to avoid the newline skipping trap.",
  "minutes": 38,
  "recap": "In Day 1, we mastered Java platform architecture, bytecode compilation, class containers, the main method entry point, and terminal output. Today, we bring our programs to life by allocating memory variables and capturing live keyboard input from users.",
  "summary": [
    "Variables are strongly typed, named memory locations allocated on the JVM call stack.",
    "Java features 8 primitive types: byte, short, int, long, float, double, boolean, and char.",
    "The java.util.Scanner class wraps System.in to parse interactive user input streams.",
    "Tokens like sc.nextInt() leave trailing newline characters in the buffer, requiring sc.nextLine() clearing before reading strings."
  ],
  "projectStep": {
    "title": "Build Interactive Input Reader with Scanner Buffer Protection",
    "tasks": [
      "Import java.util.Scanner and bind it to System.in standard input stream",
      "Declare strongly typed variables for numeric age and textual name",
      "Parse integer token and flush stray newline using sc.nextLine()",
      "Format and print verified identity summary back to standard output"
    ]
  },
  "parts": [
    {
      "title": "Computer Memory & Variable Declarations: Type-Safe Labeled Memory Slots",
      "say": [
        "To build meaningful software that processes information, a computer program must have a way to store data temporarily while calculations are taking place. In enterprise systems, this storage occurs within computer memory—specifically inside high-speed Random Access Memory (RAM). When you declare a variable in Java, you are instructing the Java Virtual Machine to allocate a fixed-size, type-safe storage slot on the active execution call stack. A variable is essentially a labeled box in memory: it possesses a specific data type that defines what kind of data can be placed inside it, a unique identifier name so you can reference it in your code, and an assigned value.",
        "Java is a statically typed language. In statically typed languages, the data type of every variable must be explicitly declared at compile time, and once a variable is created with a specific type, it can never hold data of an incompatible type. For example, if you declare int accountBalance = 500;, the variable accountBalance is permanently bound to the int type. If you subsequently attempt to assign a text string like accountBalance = \"five hundred\";, the javac compiler will immediately reject the code with a fatal error: 'incompatible types: String cannot be converted to int'. This compile-time rigidity prevents an entire universe of runtime data corruption bugs before code ever reaches production.",
        "Declaring a variable follows a standardized two-part syntax: type identifier = initialValue;. The type indicates the category of data, such as int for whole integers or double for decimal numbers. The identifier is the variable's name. By universal Java engineering convention, variable names are authored in camelCase—starting with a lowercase letter, with each subsequent concatenated word capitalized, such as customerAge, orderTotalAmount, or isAccountActive. Variable names cannot start with a digit, cannot contain spaces or punctuation other than underscores and dollar signs, and cannot collide with Java reserved keywords like class, public, or return.",
        "When a variable is declared inside a method like public static void main, it is known as a local variable. In Java, local variables are not given default values by the compiler. If you declare int orderCount; without assigning an initial value, and then immediately attempt to print it using System.out.println(orderCount);, the compiler will refuse to build your program, halting with the diagnostic error: 'variable orderCount might not have been initialized'. You must always explicitly initialize local variables before reading their values.",
        "Under the hood, local variables reside within the local variable array of the current thread's stack frame. When a method begins executing, the JVM allocates exact slots for each local variable based on its primitive byte width. When the method finishes executing and returns, its entire stack frame is instantly deallocated, freeing that memory back to the thread stack with zero garbage collection overhead. Unlike objects that live on the garbage-collected heap, stack allocation is virtually instantaneous because it simply advances the CPU's stack pointer register.",
        "Furthermore, variables possess strict lexical scope. A variable declared inside an inner block delimited by curly braces is only visible and accessible within those braces. Attempting to access an inner variable from outside its containing block triggers a compile-time cannot find symbol diagnostic. Managing variable scope tightly minimizes mutable state and prevents accidental data contamination across complex business methods.",
        "For slow and methodical readers, visualize a variable as an Amazon shipping box: the label on the box says 'int', meaning you can only put whole numbers inside; the name tag says 'age'; and the contents inside the box represent the actual number. For fast readers, remember the three immutable rules: Java is statically typed, local variables must be explicitly initialized before reading, and variable names must use camelCase and conform to Java identifier syntax."
      ],
      "example": "Think of a variable as a labeled pigeonhole slot in an executive mailroom. The slot labeled 'Employee ID' has a rigid metal divider that only fits flat employee badge cards (integers). If someone tries to shove a heavy parcel (a complex object or string) into that slot, the mail sorter (the compiler) refuses to accept it.",
      "code": "// Java Variable Declaration & Type Safety Simulator\nclass MemorySlotSimulator {\n  private slots: Map<string, { type: string; value: any }> = new Map();\n\n  allocate(name: string, type: string, value: any): string {\n    if (type === 'int' && !Number.isInteger(value)) {\n      return `COMPILE_ERROR: Incompatible type. Cannot assign ${typeof value} to int ${name}`;\n    }\n    this.slots.set(name, { type, value });\n    return `ALLOCATED: [${type}] ${name} = ${value}`;\n  }\n\n  read(name: string): string {\n    const slot = this.slots.get(name);\n    if (!slot) return `ERROR: Variable ${name} not found`;\n    return `READ: ${name} -> ${slot.value} (${slot.type})`;\n  }\n}\n\nconst memory = new MemorySlotSimulator();\nconsole.log(memory.allocate('userId', 'int', 4201));\nconsole.log(memory.allocate('userEmail', 'String', 'developer@enterprise.com'));\nconsole.log(memory.read('userId'));\nconsole.log(memory.allocate('brokenSlot', 'int', 'not_a_number'));",
      "output": "ALLOCATED: [int] userId = 4201\nALLOCATED: [String] userEmail = developer@enterprise.com\nREAD: userId -> 4201 (int)\nCOMPILE_ERROR: Incompatible type. Cannot assign string to int brokenSlot",
      "codeNotes": [
        { "line": 5, "note": "Type enforcement prevents incompatible values from being placed in storage slots" },
        { "line": 8, "note": "Local variable allocations map to fixed stack frame index offsets" },
        { "line": 20, "note": "Demonstrates compile-time rejection of invalid type assignments" }
      ],
      "tryIt": "Allocate a variable named 'isVerified' with type 'boolean' and value true, and verify it reads cleanly.",
      "check": make_check(
        "What happens if an engineer declares 'int count;' inside a method and tries to print it without assigning a value?",
        "A compile-time error occurs stating that the variable 'count might not have been initialized'",
        "The program prints '0' automatically because all variables default to zero",
        "The computer crashes due to an unhandled null pointer dereference",
        "The program compiles but prints 'null' to the terminal at runtime",
        "In Java, local variables inside methods are not given default values and must be explicitly initialized before being read; otherwise, the compiler rejects the code."
      )
    },
    {
      "title": "Java's Primitive Types: Integers, Decimals, Characters & Booleans",
      "say": [
        "In Java, the data type universe is strictly bifurcated into two foundational categories: primitive types and reference types. Today, we master primitive types. A primitive type is a raw, fundamental value stored directly in the computer's memory bits, without any object header overhead, metadata pointers, or garbage collection tracking. Java provides exactly eight primitive types, meticulously specified with exact bit widths and ranges that remain identical across every operating system on Earth. Let us explore these eight building blocks categorized by their mathematical nature.",
        "First, for storing whole integer numbers without fractional decimal places, Java provides four signed two's-complement types: byte, short, int, and long. A byte occupies 8 bits (1 byte) of memory, representing values from -128 to 127. A short occupies 16 bits (2 bytes), spanning -32,768 to 32,767. The workhorse integer type of the entire Java language is int, occupying 32 bits (4 bytes), with a range from -2,147,483,648 to 2,147,483,647 (roughly plus or minus two billion). For massive quantities that exceed two billion—such as global transaction IDs or nanosecond timestamps—Java provides long, which occupies 64 bits (8 bytes). When authoring long literals, you append an uppercase 'L' to the number, such as long txId = 9876543210L;.",
        "Understanding integer overflow is a critical senior engineering skill. In Java, integer arithmetic does not crash when a value exceeds its maximum boundary; instead, it silently wraps around to the minimum negative value according to binary two's-complement arithmetic. For example, evaluating Integer.MAX_VALUE + 1 yields -2147483648. In modern high-throughput financial systems, engineers use Math.addExact() or Math.multiplyExact(), which automatically throw an ArithmeticException if an overflow occurs, protecting account balances from silent sign reversal.",
        "Second, for storing numbers with fractional decimal points, Java provides two IEEE 754 floating-point types: float and double. A float occupies 32 bits (4 bytes) and provides standard single-precision representation up to approximately 7 decimal digits. When declaring a float literal, you must append an 'f' suffix, such as float taxRate = 0.0825f;, because raw decimal literals default to double. The standard decimal type in enterprise computing is double, occupying 64 bits (8 bytes) and offering double precision up to 15-17 decimal digits. For mission-critical banking and financial ledgers, engineers use BigDecimal, but for scientific calculations and general percentages, double is standard.",
        "Third, for storing textual single characters, Java provides the char type. A char occupies 16 bits (2 bytes) of memory and represents a single 16-bit Unicode UTF-16 character code, ranging from 0 to 65,535. Unlike languages like C where characters are 8-bit ASCII bytes, Java was engineered from inception with internationalization in mind, allowing a char to store accented characters, Greek letters, and Asian glyphs. Character literals must always be enclosed in single quotation marks ('), such as char grade = 'A'; or char symbol = '$';.",
        "Fourth, for logical truth values, Java provides the boolean type. A boolean can only hold one of two literal values: true or false. Unlike C or Python, where integer numbers like 0 or 1 can be implicitly treated as false or true, Java enforces strict boolean purity. In Java, 1 is an integer and true is a boolean; you cannot pass an integer into an if statement or assign an int to a boolean variable. This strict isolation prevents subtle assignment bugs (such as typing if (x = 1) instead of if (x == 1)).",
        "For slow readers, memorize the Big Four used in 95% of software: int for whole numbers, double for decimals, boolean for yes/no conditions, and char for single characters. For fast readers, remember the complete eight-type memory hierarchy: byte (8-bit), short (16-bit), int (32-bit), long (64-bit), float (32-bit), double (64-bit), char (16-bit unsigned Unicode), and boolean (1-bit logical)."
      ],
      "example": "Think of Java's primitive types as standard pre-formed coin wrappers used by banks. A penny wrapper (byte) only fits small change; a dime wrapper (short) fits slightly more; a dollar roll (int) fits substantial sums; and an armored money bag (long) holds fortunes. You cannot pour liquid coffee (double) into a coin wrapper without causing an immediate mess.",
      "code": "// Java Primitive Types Memory Topology & Range Simulator\ninterface PrimitiveSpec {\n  name: string;\n  bits: number;\n  bytes: number;\n  min: string | number | boolean;\n  max: string | number | boolean;\n}\n\nconst PRIMITIVES: PrimitiveSpec[] = [\n  { name: 'byte', bits: 8, bytes: 1, min: -128, max: 127 },\n  { name: 'short', bits: 16, bytes: 2, min: -32768, max: 32767 },\n  { name: 'int', bits: 32, bytes: 4, min: -2147483648, max: 2147483647 },\n  { name: 'long', bits: 64, bytes: 8, min: '-9223372036854775808', max: '9223372036854775807' },\n  { name: 'float', bits: 32, bytes: 4, min: '1.4e-45', max: '3.4e38' },\n  { name: 'double', bits: 64, bytes: 8, min: '4.9e-324', max: '1.8e308' },\n  { name: 'char', bits: 16, bytes: 2, min: 'U+0000', max: 'U+FFFF' },\n  { name: 'boolean', bits: 1, bytes: 1, min: false, max: true }\n];\n\nconsole.log('=== JAVA 8 PRIMITIVE TYPES FOOTPRINT ===');\nPRIMITIVES.forEach(p => {\n  console.log(`${p.name.padEnd(8)} | ${p.bits} bits (${p.bytes}B) | Range: [${p.min} .. ${p.max}]`);\n});",
      "output": "=== JAVA 8 PRIMITIVE TYPES FOOTPRINT ===\nbyte     | 8 bits (1B) | Range: [-128 .. 127]\nshort    | 16 bits (2B) | Range: [-32768 .. 32767]\nint      | 32 bits (4B) | Range: [-2147483648 .. 2147483647]\nlong     | 64 bits (8B) | Range: [-9223372036854775808 .. 9223372036854775807]\nfloat    | 32 bits (4B) | Range: [1.4e-45 .. 3.4e38]\ndouble   | 64 bits (8B) | Range: [4.9e-324 .. 1.8e308]\nchar     | 16 bits (2B) | Range: [U+0000 .. U+FFFF]\nboolean  | 1 bits (1B) | Range: [false .. true]",
      "codeNotes": [
        { "line": 8, "note": "Java specifies exact deterministic bit widths across all CPU architectures" },
        { "line": 11, "note": "int is the canonical default integer primitive across the JVM ecosystem" },
        { "line": 14, "note": "char stores 16-bit Unicode code points rather than 8-bit ASCII" }
      ],
      "tryIt": "Inspect the bit size of long and double: observe that both consume 64 bits (8 bytes) of storage.",
      "check": make_check(
        "Which Java primitive type occupies 32 bits of memory and represents whole numbers from -2 billion to +2 billion?",
        "int",
        "short",
        "double",
        "byte",
        "The int primitive occupies exactly 32 bits (4 bytes) of two's-complement signed storage, with a range of approximately -2.14 billion to +2.14 billion."
      )
    },
    {
      "title": "Interactive Console Input: The java.util.Scanner Lifecycle",
      "say": [
        "A program that only prints hardcoded text is static and limited. To build dynamic systems—such as interactive command-line consoles, automated terminal prompts, and data ingestion scripts—our application must be able to listen to keyboard input typed by a live human user. In Java, reading interactive input from the terminal is accomplished using the java.util.Scanner class. Understanding the architectural lifecycle of Scanner requires understanding how Java interacts with standard input streams.",
        "Just as the JVM provides System.out to write data to standard output (stdout), it provides System.in to read data from standard input (stdin, file descriptor 0). However, System.in is a raw InputStream. If you read directly from System.in, you only receive raw, unparsed byte values (such as byte 65 when the user presses 'A'). Writing code to manually assemble raw bytes into characters, words, integers, and floating-point decimals would require dozens of lines of complex parsing logic. The Scanner class was introduced into the java.util package to act as a high-level lexical scanner that wraps System.in and parses raw byte streams into convenient tokens.",
        "To utilize Scanner in your program, you must follow a disciplined three-step engineering lifecycle. Step 1 is the import statement: import java.util.Scanner;. Because Scanner lives in the java.util package rather than the default java.lang package, you must place this import declaration at the very top of your source file, before your public class declaration. This instructs the compiler to link the Scanner symbol to your class.",
        "Step 2 is instantiation: Scanner sc = new Scanner(System.in);. This statement allocates a new Scanner object in the JVM heap and connects its internal scanning pipeline to the process's standard input stream (System.in). Notice that sc is the variable identifier holding the reference to our Scanner instance. You could name this variable scanner, inputReader, or console, but sc is a widely recognized industry shorthand.",
        "Step 3 is token consumption: you invoke typed reader methods on your Scanner object to capture data. For example, to read a whole number, you call int age = sc.nextInt();. When this method executes, the program pauses execution and waits for the user to type keystrokes into the terminal and hit Enter. Scanner parses the keystrokes, verifies that they represent a valid numeric integer, converts the textual digits into a 32-bit int, and returns that value to be stored in your variable. If the user types non-numeric letters like 'twenty', Scanner raises an InputMismatchException.",
        "Another critical configuration parameter in enterprise systems is localization. When parsing decimal numbers with sc.nextDouble(), Scanner relies on the host operating system's default locale. In the United States and international standard formatting, decimals use a period separator (such as 15.50), whereas in many European nations, decimals use a comma (such as 15,50). If a server boots up in a European locale and attempts to parse 15.50 without explicit configuration, Scanner will throw an InputMismatchException. Senior architects explicitly enforce deterministic locale parsing by configuring sc.useLocale(Locale.US); upon scanner instantiation.",
        "In production software engineering, clean resource management is paramount. A Scanner wraps an underlying operating system input stream. When your program finishes reading all necessary user input, calling sc.close() releases the stream resources cleanly. In modern Java, Scanner implements the AutoCloseable interface, which allows engineers to wrap input reading operations inside try-with-resources blocks to guarantee deterministic stream closure even if an unexpected exception occurs during parsing.",
        "For slow and methodical readers, trace the three steps: import the tool from java.util, instantiate the scanner connected to System.in using the new keyword, and invoke sc.nextInt() or sc.nextLine() to capture user data. For fast readers, remember: System.in supplies raw bytes, Scanner parses them into high-level types, and the three-step lifecycle is import -> instantiate -> read."
      ],
      "example": "Think of System.in as an open water pipe bringing raw river water into your house. You cannot safely drink raw river water. Scanner is an automated high-tech water filtration appliance attached to the pipe that purifies the stream and fills labeled glasses of pure water (integers, strings, decimals) on demand.",
      "code": "// Java Scanner Ingestion Stream Simulator\nclass ScannerSimulator {\n  private tokenStream: string[];\n  private pointer: number = 0;\n\n  constructor(simulatedInput: string) {\n    // Simulates user typing tokens separated by whitespace and newlines\n    this.tokenStream = simulatedInput.trim().split(/\\s+/);\n  }\n\n  hasNext(): boolean {\n    return this.pointer < this.tokenStream.length;\n  }\n\n  nextInt(): number {\n    if (!this.hasNext()) throw new Error('NoSuchElementException');\n    const token = this.tokenStream[this.pointer++];\n    const val = parseInt(token, 10);\n    if (isNaN(val)) throw new Error(`InputMismatchException: ${token} is not an int`);\n    return val;\n  }\n\n  next(): string {\n    if (!this.hasNext()) throw new Error('NoSuchElementException');\n    return this.tokenStream[this.pointer++];\n  }\n}\n\nconst sc = new ScannerSimulator('25 Vinay 100');\nconst age = sc.nextInt();\nconst name = sc.next();\nconst score = sc.nextInt();\nconsole.log(`Scanner Parsed: Name=${name}, Age=${age}, Score=${score}`);",
      "output": "Scanner Parsed: Name=Vinay, Age=25, Score=100",
      "codeNotes": [
        { "line": 9, "note": "Scanner splits standard input into tokens delimited by whitespace" },
        { "line": 16, "note": "nextInt() parses token string into 32-bit signed integer" },
        { "line": 26, "note": "Sequential reader calls ingest tokens in exact first-in first-out order" }
      ],
      "tryIt": "Pass simulated input with '42 Alice' and verify that sc.nextInt() yields 42 and sc.next() yields 'Alice'.",
      "check": make_check(
        "Which package must be imported to utilize the Scanner class in a Java application?",
        "java.util.Scanner",
        "java.lang.Scanner",
        "java.io.Scanner",
        "java.net.Scanner",
        "The Scanner class resides in the java.util utility package and must be explicitly imported using 'import java.util.Scanner;'."
      )
    },
    {
      "title": "Reading Tokens vs Full Lines: nextInt(), nextDouble() vs nextLine()",
      "say": [
        "To become proficient with console input in Java, an engineer must understand the fundamental difference between token-based reading methods and line-based reading methods provided by the Scanner class. Beginners often assume that every method on Scanner reads whatever the user typed until they pressed Enter. In reality, Scanner implements two completely different scanning algorithms depending on which method you invoke.",
        "The first category consists of token-based readers: next(), nextInt(), nextDouble(), nextLong(), and nextBoolean(). These methods operate on whitespace-delimited tokens. In Scanner's grammar, whitespace includes spaces, tabs, and newline carriage returns. When you call sc.nextInt(), Scanner skips past any leading whitespace, scans characters until it encounters the next whitespace character, parses that contiguous cluster of characters as an integer, and returns the result. Crucially, token-based readers stop reading the exact instant they hit whitespace—they do not consume the trailing whitespace or the newline character that followed the number.",
        "The second category is the line-based reader: nextLine(). Unlike nextInt() or next(), which divide input into individual space-separated words, nextLine() reads an entire line of text starting from the current cursor position all the way up to the next newline character (\\n or \\r\\n). When nextLine() encounters the newline character, it consumes that newline character from the stream, discards it, and returns all the preceding text as a single String. This allows you to capture sentences containing spaces, such as 'Dr. Martin Luther King Jr.' or '123 Enterprise Boulevard'.",
        "Understanding this distinction is vital for designing user interfaces. If you prompt a user for their full name using sc.next(), and the user enters 'John Doe', sc.next() will only return 'John'. The remaining word 'Doe' is left sitting unread in the Scanner's internal memory buffer. When your program subsequently prompts for their address or city, the leftover token 'Doe' will be immediately swallowed by the next reader method, creating a confusing and broken user experience.",
        "To prevent runtime crashes caused by malformed user input, senior engineers use Scanner's defensive inspection methods: hasNextInt(), hasNextDouble(), and hasNextLine(). Calling if (sc.hasNextInt()) before invoking sc.nextInt() allows your program to verify that the incoming token is truly an integer. If the user typed an invalid string, your code can gracefully handle the error or display a helpful message instead of crashing with an uncaught InputMismatchException.",
        "In industrial command-line tooling, this defensive pattern is implemented via interactive validation retry loops. When prompting an operator for a numeric port number or database connection timeout, an engineer wraps the read operation in a while loop: while (!sc.hasNextInt()) { System.out.println(\"Invalid integer token entered. Please input a numeric integer:\"); sc.next(); } int port = sc.nextInt();. Notice that inside the loop, invoking sc.next() discards the offending non-numeric token from the stream buffer, preventing an infinite loop and allowing the user to type a valid number on their next attempt.",
        "Furthermore, Scanner allows engineers to customize token boundaries by supplying regular expressions via sc.useDelimiter(\",|\\\\s+\");. This capability transforms Scanner into a lightweight in-memory CSV parser, splitting records on commas or whitespace delimiters interchangeably without pulling in heavy third-party parsing dependencies.",
        "Therefore, professional engineers choose reader methods with architectural intent: use nextInt() for discrete quantities and IDs, use nextDouble() for financial amounts and percentages, use next() when you strictly want a single word without spaces, and use nextLine() whenever you want to capture a complete sentence or multi-word user input.",
        "For slow readers, remember the distinction: next() reads a single word up to a space, nextInt() reads a number up to a space, and nextLine() reads the whole sentence up to the Enter key. For fast readers, remember the parsing mechanism: token readers consume characters until whitespace and leave the delimiter behind; nextLine() consumes everything up to the newline and discards the delimiter."
      ],
      "example": "Think of a token reader (nextInt) as a coin counter at a toll booth that only scoops up the coin and leaves the paper receipt sitting on the counter. A line reader (nextLine) is a street sweeper that sweeps up everything all the way to the end of the curb, including the paper receipt.",
      "code": "// Token Reader vs Line Reader Comparison Simulator\nclass TokenVsLineSimulator {\n  demonstrateTokenSplitting(): void {\n    const rawInput = 'Johnathan Doe 35';\n    const tokens = rawInput.split(' ');\n    \n    // next() only takes the first word\n    const firstName = tokens[0];\n    \n    // nextLine() takes the remainder\n    const remaining = tokens.slice(1).join(' ');\n    \n    console.log(`sc.next() Captured: \"${firstName}\"`);\n    console.log(`Remaining in buffer: \"${remaining}\"`);\n  }\n}\n\nconst demo = new TokenVsLineSimulator();\ndemo.demonstrateTokenSplitting();",
      "output": "sc.next() Captured: \"Johnathan\"\nRemaining in buffer: \"Doe 35\"",
      "codeNotes": [
        { "line": 4, "note": "Demonstrates whitespace boundary splitting on token ingestion" },
        { "line": 8, "note": "next() consumes up to the first space delimiter" },
        { "line": 11, "note": "Remaining words remain buffered in the input stream" }
      ],
      "tryIt": "Simulate what happens if the input is 'SingleWord': verify that next() captures the entire token without leftover words.",
      "check": make_check(
        "If a user enters 'Software Engineer' into the console, what does sc.next() return?",
        "'Software' (only the first token up to the whitespace)",
        "'Software Engineer' (the entire line)",
        "'Engineer' (only the last token)",
        "An InputMismatchException error",
        "The sc.next() method stops reading at the first whitespace delimiter, returning only the first word 'Software'."
      )
    },
    {
      "title": "The Enter-Key Buffer Trap: Flushing Stray Newlines & Safe Console UX",
      "say": [
        "We now arrive at one of the most famous, pervasive, and notorious bugs in the entire Java ecosystem: the Enter-key buffer trap. Virtually every software engineer who learns Java falls into this trap at least once, and understanding the low-level stream mechanics of why it occurs is a rite of passage for every backend developer. Let us analyze this phenomenon step by step so you can diagnose and eliminate it effortlessly in production systems.",
        "Imagine an application that asks a user for their age, and then immediately asks for their full name. The code is written as follows: System.out.print(\"Enter age: \"); int age = sc.nextInt(); System.out.print(\"Enter name: \"); String name = sc.nextLine(); System.out.println(\"Name: \" + name + \" | Age: \" + age);. When you run this program, you type 25 for your age and press Enter. Shockingly, the program never pauses to let you type your name! It instantly prints 'Name:  | Age: 25' and terminates.",
        "Why did this happen? Did the Scanner crash? Did the JVM skip the line? Not at all; the Scanner behaved with 100% mathematical fidelity to its specification. When you typed 25 and pressed the Enter key on your keyboard, your terminal sent three characters into the System.in input buffer: the character '2', the character '5', and the newline character '\\n' produced by the Enter key.",
        "When sc.nextInt() executed, it read the '2' and the '5', parsed them into the integer 25, and stopped reading. Crucially, nextInt() left the trailing newline character '\\n' sitting right at the front of the input stream buffer! Then, execution proceeded to String name = sc.nextLine();. Remember how nextLine() works: it reads characters until it hits a newline character, consumes the newline, and returns all preceding characters.",
        "Because the leftover '\\n' from the Enter key was already sitting right at the front of the buffer, nextLine() immediately saw that newline, consumed it, and returned an empty string \"\"! It never paused for keyboard input because its condition—finding a newline—was satisfied instantly by the leftover keypress. The user's name was assigned to empty text.",
        "The fix for this trap is straightforward and mandatory: whenever you transition from a numeric or token reader (nextInt(), nextDouble(), next()) to a line reader (nextLine()), you must insert an extra, empty sc.nextLine(); statement immediately after the token reader. This extra call acts as a buffer flush: it consumes and discards the leftover Enter key newline, resetting the stream so that subsequent nextLine() calls pause and wait for genuine user input.",
        "In production microservices and CLI tools, seasoned architects encapsulate this logic inside a dedicated console wrapper utility, such as a SafeConsoleReader class. By wrapping raw Scanner operations inside helper methods like readLineWithPrompt() and readIntWithPrompt(), you eliminate buffer corruption at the architectural layer and guarantee that junior engineers on your team never introduce the Enter-key bug into customer-facing terminal tools.",
        "Understanding stream redirection also enables automated testing of Scanner-based programs without manual keyboard entry. In JUnit test suites, engineers mock user interaction by calling System.setIn(new ByteArrayInputStream(\"25\\nAlice Smith\\n\".getBytes())). When the program executes, the Scanner reads from the synthetic byte stream exactly as if a human had typed into the terminal, allowing automated test runners to verify that your buffer flushing logic executes deterministically on headless CI/CD build agents.",
        "For slow readers, memorize the pattern: after sc.nextInt(), always add sc.nextLine(); to clear the ghost Enter key. For fast readers, remember the stream mechanics: nextInt() leaves \\n in the buffer, and the flush call sc.nextLine() consumes it so the subsequent string reader operates on a clean stream."
      ],
      "example": "Think of an old coin-operated laundry machine. You insert two quarters (nextInt), but you also pushed the mechanical coin slot lever in (the Enter key). If you do not pull the lever back out (the buffer flush), the next customer who walks up to insert a ticket (nextLine) will have their ticket swallowed instantly by the jammed lever.",
      "code": "// Java Scanner Buffer Trap Simulator & Safe Flushing Pattern\nclass BufferTrapSimulator {\n  simulateBrokenSequence(input: string): { age: number; name: string } {\n    // Stream contains: '25\\nAlice Smith\\n'\n    const lines = input.split('\\n');\n    const age = parseInt(lines[0], 10); // nextInt leaves leftover newline\n    const name = ''; // Broken: nextLine immediately swallows empty newline\n    return { age, name };\n  }\n\n  simulateFixedSequence(input: string): { age: number; name: string } {\n    const lines = input.split('\\n');\n    const age = parseInt(lines[0], 10); // nextInt()\n    // sc.nextLine() buffer flush consumes lines[0] newline\n    const name = lines[1]; // Correct nextLine() captures actual name\n    return { age, name };\n  }\n}\n\nconst sim = new BufferTrapSimulator();\nconst broken = sim.simulateBrokenSequence('25\\nAlice Smith');\nconsole.log(`Broken Output: Name=\"${broken.name}\" | Age=${broken.age}`);\n\nconst fixed = sim.simulateFixedSequence('25\\nAlice Smith');\nconsole.log(`Fixed Output:  Name=\"${fixed.name}\" | Age=${fixed.age}`);",
      "output": "Broken Output: Name=\"\" | Age=25\nFixed Output:  Name=\"Alice Smith\" | Age=25",
      "codeNotes": [
        { "line": 6, "note": "Broken pattern leaves trailing newline in buffer causing empty string assignment" },
        { "line": 13, "note": "Safe pattern flushes leftover newline before reading textual line" },
        { "line": 23, "note": "Verified fixed output successfully captures user name without skipping" }
      ],
      "tryIt": "Verify that the fixed output matches the Challenge requirement: 'Name: Alice Smith | Age: 25'.",
      "check": make_check(
        "Why does calling sc.nextLine() immediately after sc.nextInt() often return an empty string without waiting for user input?",
        "Because nextInt() leaves the trailing newline character (\\n) in the buffer, which nextLine() immediately consumes",
        "Because the Scanner object automatically closes itself after reading any integer",
        "Because Java requires a five-second sleep pause between integer and string operations",
        "Because the keyboard hardware temporarily disconnects from the operating system",
        "The sc.nextInt() method parses the integer but leaves the trailing newline generated by the Enter key in the buffer. The following sc.nextLine() immediately consumes that newline and returns an empty string."
      )
    }
  ]
}

if __name__ == '__main__':
    print("Checking Day 2 word counts:")
    for i, part in enumerate(DAY_2['parts']):
        wc = word_count(part['say'])
        print(f"  Part {i+1} ({part['title']}): {wc} words")
        assert wc >= 580, f"Part {i+1} failed: {wc} < 580"
    tot = sum(word_count(p['say']) for p in DAY_2['parts'])
    print(f"Total Day 2 words: {tot} (>= 2900 required)")
    assert tot >= 2900
    print("DAY 2 VERIFIED PASS!")
