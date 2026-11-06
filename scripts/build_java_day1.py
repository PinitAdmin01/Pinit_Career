import json
import hashlib

def word_count(text_or_list):
    if isinstance(text_or_list, list):
        full_text = " ".join(text_or_list)
    else:
        full_text = str(text_or_list)
    return len(full_text.strip().split())

day1 = {
  "day": 1,
  "title": "Java Platform Architecture & First Program: Hello World, Classes and System.out",
  "goal": "Master the Java runtime environment: understand how Java source code compiles to platform-independent bytecode, how the JVM executes class files, the container architecture of classes, the public static void main starting door, and terminal output using System.out.println.",
  "minutes": 38,
  "recap": "Welcome to Java Systems Engineering. Today we begin our journey into one of the world's most resilient enterprise backend programming platforms by writing and deconstructing our very first executable program.",
  "summary": [
    "Java source code (.java) is compiled by javac into platform-neutral bytecode (.class) rather than machine instructions.",
    "The Java Virtual Machine (JVM) loads and verifies bytecode, providing write-once run-anywhere execution.",
    "Every Java statement resides within a class, and execution commences at public static void main(String[] args).",
    "System.out.println streams textual data to standard output (file descriptor 1) and appends a line break."
  ],
  "projectStep": {
    "title": "Compile and Execute Hello World Terminal Invariant",
    "tasks": [
      "Define public class Solution matching source file declaration rules",
      "Declare the canonical public static void main entry point signature",
      "Emit three deterministic status lines to System.out using println",
      "Verify zero syntax warnings and zero runtime exceptions"
    ]
  },
  "parts": [
    {
      "title": "Java Execution Lifecycle: Source Code, Javac Bytecode & The JVM Virtual Machine",
      "say": [
        "To write high-performance enterprise software in Java, you must first understand the fundamental engineering architecture of the Java platform.",
        "Unlike languages such as C or C++, which compile directly into native operating system machine instructions tied to an x86 or ARM CPU, Java was designed from day one around the concept of architectural neutrality.",
        "When you create a file named Solution.java, you write human-readable source code conforming to the Java language specification.",
        "When you invoke the Java compiler using the javac command, the compiler does not produce an executable binary file for Windows or Linux.",
        "Instead, javac parses your code, checks its static types, verifies syntax boundaries, and translates the logic into an intermediate representation known as Java Bytecode.",
        "This bytecode is stored inside binary files with the .class extension, containing compact, highly structured 8-bit opcodes designed for an idealized abstract computing machine called the Java Virtual Machine (JVM).",
        "The JVM is an execution engine implemented natively for each target operating system, whether it is 64-bit Linux running inside an Amazon Web Services EC2 container, macOS running on Apple Silicon, or Windows Server on an enterprise blade.",
        "Because every JVM implementation adheres strictly to the exact same Java Virtual Machine Specification, the identical .class file compiled on a developer laptop will execute identically on a high-throughput production server cluster halfway around the globe.",
        "This powerful paradigm is summarized by the classic industry principle: Write Once, Run Anywhere (WORA).",
        "When the JVM launches, a specialized subsystem called the ClassLoader reads your .class files from disk or network streams and loads the binary bytecode into memory.",
        "Before a single instruction is executed, a crucial security layer called the Bytecode Verifier inspects every byte sequence.",
        "The Bytecode Verifier ensures that the code does not perform illegal memory access, does not forge pointer addresses, does not violate access modifier boundaries, and maintains strict stack operand type safety.",
        "Once verified, the JVM execution engine begins running the instructions using a tiered execution strategy.",
        "In the beginning, an interpreter translates bytecode instructions one by one into native CPU instructions, ensuring instant application startup.",
        "As your application runs, the JVM continuously profiles runtime execution metrics, tracking which loops and methods execute most frequently—these hot execution paths are referred to as hot spots.",
        "The Just-In-Time (JIT) compiler then dynamically translates these frequently executed bytecode sequences into hyper-optimized native machine code directly in memory.",
        "This tiered architecture gives Java the rapid startup of an interpreted runtime combined with the raw throughput of a natively compiled language like C++.",
        "For slow and methodical readers, visualize this process as a two-stage rocket: stage one transforms human text into universal bytecode, and stage two launches the bytecode inside the protected environment of the JVM.",
        "For fast readers, remember the core invariant: javac produces .class bytecode, the ClassLoader loads it, the Bytecode Verifier validates memory safety, and the JIT compiler accelerates hot paths into native CPU instructions."
      ],
      "example": "Think of Java bytecode as a universal architectural blueprint written in international metric standards. A construction crew in Tokyo (Linux JVM), London (macOS JVM), or New York (Windows JVM) can read the exact same blueprint and construct the identical skyscraper using their local native building materials.",
      "code": "// Java Platform Compilation & Execution Architecture Simulator\nclass JavaPlatformSimulator {\n  executePipeline(sourceFile: string): {\n    compiler: string;\n    artifact: string;\n    targetRuntime: string;\n    safetyStatus: string;\n    executionMode: string;\n  } {\n    const artifact = sourceFile.replace('.java', '.class');\n    return {\n      compiler: 'javac 21.0.2',\n      artifact: artifact,\n      targetRuntime: 'Java Virtual Machine (JVM)',\n      safetyStatus: 'BYTECODE_VERIFIED_SECURE',\n      executionMode: 'INTERPRETED_WITH_TIERED_JIT_PROFILING'\n    };\n  }\n}\n\nconst sim = new JavaPlatformSimulator();\nconst result = sim.executePipeline('Solution.java');\nconsole.log('Source Compiler: ' + result.compiler);\nconsole.log('Generated Bytecode: ' + result.artifact);\nconsole.log('Target Runtime: ' + result.targetRuntime);\nconsole.log('Verification Status: ' + result.safetyStatus);\nconsole.log('Execution Mode: ' + result.executionMode);",
      "output": "Source Compiler: javac 21.0.2\nGenerated Bytecode: Solution.class\nTarget Runtime: Java Virtual Machine (JVM)\nVerification Status: BYTECODE_VERIFIED_SECURE\nExecution Mode: INTERPRETED_WITH_TIERED_JIT_PROFILING",
      "codeNotes": [
        { "line": 5, "note": "javac translates human-readable .java source into portable .class bytecode" },
        { "line": 10, "note": "The JVM acts as the abstract hardware machine executing bytecode" },
        { "line": 11, "note": "Bytecode verifier enforces type safety and prevents memory corruption" },
        { "line": 12, "note": "Execution engine employs tiered JIT compilation to optimize hot execution paths" }
      ],
      "tryIt": "Modify the source file argument to 'PaymentGateway.java' and verify that the compiled bytecode artifact becomes 'PaymentGateway.class'.",
      "check": {
        "question": "What is the primary output generated by the Java compiler (javac) when compiling source code?",
        "options": [
          "Platform-independent bytecode stored in .class files that run on the Java Virtual Machine (JVM)",
          "Direct x86-64 machine code that can only execute on Windows operating systems",
          "An encrypted zip archive containing minified JavaScript and HTML files",
          "A plain text configuration file interpreted directly by the operating system kernel"
        ],
        "answer": 0,
        "why": "The javac compiler produces platform-neutral bytecode stored in .class files, which the JVM subsequently interprets and JIT-compiles into native instructions."
      }
    },
    {
      "title": "The Class Blueprint: Public Class Containers & Source File Naming Invariants",
      "say": [
        "In the Java programming language, encapsulation is not optional—it is a mandatory foundational rule of the grammar.",
        "Unlike languages like Python, JavaScript, or C where you can declare functions and instructions at the root level of a file, every single line of executable Java code must reside inside a class container.",
        "A class is a structural blueprint that groups related state fields and executable behaviors together into a cohesive, organized unit.",
        "When declaring a top-level class that forms the entry point of your program, you use the public class syntax, such as public class Solution.",
        "Here, the public keyword is an access modifier that signals to the Java compiler and the external runtime environment that this class can be accessed, loaded, and invoked from anywhere, including from the JVM launcher itself.",
        "The class keyword instructs the compiler to define a new reference type.",
        "The identifier following class is the name of your class, which by universal Java convention is written in PascalCase (also known as UpperCamelCase), starting with a capital letter.",
        "There is a strict, non-negotiable architectural invariant in the Java language specification regarding file naming: if a class is declared as public, the source file containing it must match the class name character-for-character, including exact casing, followed by the .java extension.",
        "For example, if your code declares public class Solution, the file on disk must be named Solution.java.",
        "If you name the file solution.java with a lowercase 's', or Main.java while declaring public class Solution, the javac compiler will immediately abort compilation and emit a fatal diagnostic error stating: 'class Solution is public, should be declared in a file named Solution.java'.",
        "Why did Java architects impose such an uncompromising restriction?",
        "In massive enterprise codebases containing tens of thousands of classes, locating which file defines which class could quickly become an intractable maintenance nightmare if filenames did not match type names.",
        "By enforcing a deterministic 1-to-1 correspondence between public class identifiers and file paths, the JVM ClassLoader can instantly map any fully qualified class name directly to a file on disk without scanning the contents of the entire filesystem.",
        "Inside the class definition, open and closed curly braces ({ and }) delineate the class body.",
        "Everything that belongs to that class—its methods, its variables, its constants—must be nested neatly between these curly braces.",
        "For slow and methodical readers, visualize the class as a secure vault: the public keyword unlocks the exterior door, the class name gives the vault its official street address, and the curly braces mark the structural walls containing all inner operations.",
        "For fast readers, lock in the core rules: every program requires a class, a public class must match its source filename exactly, and all executable logic lives within curly braces."
      ],
      "example": "Think of a class as an official government passport office. The name on the building outside (Solution.java) must match the official registered title on the deed inside (public class Solution), otherwise citizens and delivery trucks cannot locate the building.",
      "code": "// Java Class Container & Source File Invariant Validator\nclass ClassNamingValidator {\n  validateClassFile(className: string, fileName: string, isPublic: boolean): {\n    isValid: boolean;\n    statusMessage: string;\n  } {\n    const expectedFile = className + '.java';\n    if (isPublic && fileName !== expectedFile) {\n      return {\n        isValid: false,\n        statusMessage: `ERROR: class ${className} is public, should be declared in a file named ${expectedFile}`\n      };\n    }\n    return {\n      isValid: true,\n      statusMessage: `SUCCESS: ${className} matches ${fileName}. Class container verified.`\n    };\n  }\n}\n\nconst validator = new ClassNamingValidator();\nconst matchCase = validator.validateClassFile('Solution', 'Solution.java', true);\nconst mismatchCase = validator.validateClassFile('Solution', 'solution.java', true);\nconsole.log('Exact Match: ' + matchCase.statusMessage);\nconsole.log('Case Mismatch: ' + mismatchCase.statusMessage);",
      "output": "Exact Match: SUCCESS: Solution matches Solution.java. Class container verified.\nCase Mismatch: ERROR: class Solution is public, should be declared in a file named Solution.java",
      "codeNotes": [
        { "line": 8, "note": "Expected filename is deterministically derived from class name with .java extension" },
        { "line": 9, "note": "Public classes require strict case-sensitive match with disk filename" },
        { "line": 15, "note": "Mismatches produce fatal javac compile-time diagnostic errors" }
      ],
      "tryIt": "Test what happens when the class name is 'OrderProcessor' and the file name is 'OrderProcessor.java'.",
      "check": {
        "question": "If a source file contains the declaration 'public class BankLedger', what must the file name be on disk?",
        "options": [
          "BankLedger.java (matching exact casing and spelling)",
          "bankledger.java (casing does not matter in Java source filenames)",
          "Solution.java (any valid filename is acceptable as long as it ends in .java)",
          "BankLedger.class (source code files must be saved with .class extension)"
        ],
        "answer": 0,
        "why": "The Java compiler strictly requires that a public class match the filename on disk exactly, including case sensitivity, followed by .java."
      }
    },
    {
      "title": "The Starting Door: public static void main(String[] args) Entry Point",
      "say": [
        "Once you have defined your class container, how does the Java Virtual Machine know where to begin executing your instructions?",
        "Unlike a script that simply executes from line 1 downwards, a compiled Java application requires a standardized, universally recognized entry point.",
        "In Java, that starting door is the main method, declared with the exact signature: public static void main(String[] args).",
        "Every single keyword in this iconic signature was chosen with deliberate architectural purpose, and understanding each token transforms it from a piece of boilerplate magic into clear systems engineering.",
        "First, the public keyword ensures that the method has universal accessibility.",
        "When you run java Solution from your operating system command line, the JVM launcher process starts outside your class and package.",
        "If main were declared private or protected, the JVM launcher would be forbidden by Java's security invariants from accessing it, and execution would abort with an error.",
        "Second, the static keyword is perhaps the most critical architectural decision.",
        "Normally in object-oriented programming, to call a method on a class, you must first create an instance of that class in memory using the new operator.",
        "However, at the very instant a program starts, no objects exist in the JVM heap.",
        "By marking main as static, the method belongs to the class itself rather than to any specific object instance.",
        "This allows the JVM to invoke Solution.main() directly upon loading the class, without needing to allocate an instance or guess which constructor parameters to pass.",
        "Third, the void return type specifies that this method does not return a value back to its caller.",
        "In languages like C or C++, the main function returns an integer exit code (such as return 0) to signal success to the operating system.",
        "Java separates application return values from operating system exit codes: if a Java application needs to signal an error code to the OS, it explicitly calls System.exit(statusCode).",
        "Therefore, main returns void.",
        "Fourth, the identifier main is the canonical entry point name hardcoded into the JVM specification.",
        "Finally, the parameter list (String[] args) represents an array of String objects that captures any command-line arguments passed to the program when it was launched.",
        "For instance, running java Solution order_9901 prod passes an array containing two strings: args[0] is 'order_9901' and args[1] is 'prod'.",
        "Even if your program does not take any command-line parameters, the (String[] args) parameter must still be present for the JVM launcher to recognize the signature.",
        "For slow and methodical readers, repeat the mantra: public means open to JVM launcher, static means callable without creating an object, void means no return value, main is the designated door, and String[] args receives startup arguments.",
        "For fast readers, remember that omitting static or misspelling main means the compiler will succeed, but the JVM runtime will fail with: 'Main method not found in class Solution'."
      ],
      "example": "Think of public static void main as the master power switch on a commercial electrical generator. The switch is mounted on the outside panel (public), can be flipped without turning on individual interior appliances (static), powers up the generator without returning a receipt (void), is labeled 'MAIN POWER' (main), and has input sockets for external power cords (String[] args).",
      "code": "// Java main Method Entry Point Signature Simulator\nclass JvmLauncherSimulator {\n  attemptLaunch(classDefinition: {\n    isPublic: boolean;\n    isStatic: boolean;\n    returnType: string;\n    methodName: string;\n    hasStringArrayParam: boolean;\n  }): {\n    canLaunch: boolean;\n    status: string;\n  } {\n    if (!classDefinition.isPublic) {\n      return { canLaunch: false, status: 'LAUNCH_ERROR: main must be declared public' };\n    }\n    if (!classDefinition.isStatic) {\n      return { canLaunch: false, status: 'LAUNCH_ERROR: main must be declared static to invoke without instance' };\n    }\n    if (classDefinition.returnType !== 'void') {\n      return { canLaunch: false, status: 'LAUNCH_ERROR: main must have void return type' };\n    }\n    if (classDefinition.methodName !== 'main') {\n      return { canLaunch: false, status: `LAUNCH_ERROR: Entry point must be named \"main\", not \"${classDefinition.methodName}\"` };\n    }\n    if (!classDefinition.hasStringArrayParam) {\n      return { canLaunch: false, status: 'LAUNCH_ERROR: main must accept String[] args parameter' };\n    }\n    return { canLaunch: true, status: 'LAUNCH_SUCCESS: Canonical entry point verified. Starting execution.' };\n  }\n}\n\nconst launcher = new JvmLauncherSimulator();\nconst validLaunch = launcher.attemptLaunch({\n  isPublic: true,\n  isStatic: true,\n  returnType: 'void',\n  methodName: 'main',\n  hasStringArrayParam: true\n});\nconsole.log(validLaunch.status);",
      "output": "LAUNCH_SUCCESS: Canonical entry point verified. Starting execution.",
      "codeNotes": [
        { "line": 13, "note": "public modifier allows external JVM launcher to access the entry point" },
        { "line": 16, "note": "static modifier allows invocation before any heap objects are constructed" },
        { "line": 19, "note": "void return type signals completion without returning an in-memory primitive" },
        { "line": 25, "note": "String[] args parameter captures external CLI flags and tokens" }
      ],
      "tryIt": "Simulate what happens if isStatic is set to false: verify that the launcher fails with an explicit error.",
      "check": {
        "question": "Why must the main method in Java be declared with the 'static' keyword?",
        "options": [
          "It allows the JVM to invoke the entry point directly on the class without needing to construct an instance in heap memory",
          "It prevents the program from using more than one megabyte of RAM during execution",
          "It ensures that variables declared inside main cannot be modified by any other thread",
          "It converts the Java method into native C code automatically at compile time"
        ],
        "answer": 0,
        "why": "The static keyword allows the JVM execution launcher to invoke the main method without having to instantiate an object of the containing class first."
      }
    },
    {
      "title": "Terminal Standard Output: System.out.println, Streams & Semicolon Terminators",
      "say": [
        "Now that our program has entered the main method, we need a way to communicate results to the outside world.",
        "In Java, terminal output is handled by a standard stream pipeline: System.out.println().",
        "To truly master this statement, let us deconstruct its three constituent parts and understand how they interact with the operating system.",
        "First, System is a built-in class residing in the standard java.lang package, which is automatically imported into every Java source file without requiring an explicit import statement.",
        "The System class provides access to system-level facilities such as standard input, standard output, environment variables, and the system clock.",
        "Second, out is a public static final field inside the System class.",
        "Notice that out is an instance of the PrintStream class, pre-initialized by the JVM when your program boots up.",
        "Under the hood, this PrintStream is bound directly to the standard output stream of your process—known in Unix and POSIX operating systems as file descriptor 1 (stdout).",
        "Third, println() is an overloaded method on the PrintStream class.",
        "The name println is short for 'print line'.",
        "When you invoke System.out.println(\"Hello!\"), the PrintStream writes the characters 'H', 'e', 'l', 'l', 'o', '!' to the output buffer, flushes the stream so the characters appear on the user screen immediately, and automatically appends a platform-specific newline terminator (a line break).",
        "If you want to print text without appending a newline—so that the next output continues on the very same line—you use System.out.print() instead.",
        "Notice that every complete instruction in Java ends with a semicolon (;).",
        "In Java grammar, the semicolon is not an optional separator as in modern JavaScript, nor is it absent as in Python.",
        "It is a mandatory statement terminator.",
        "Because Java is a free-format language—meaning spaces, tabs, and line breaks are treated as interchangeable whitespace by the compiler—the compiler relies entirely on semicolons to know where one instruction ends and the next begins.",
        "If you forget a semicolon at the end of a println statement, the compiler will attempt to merge that line with the following statement, resulting in a fatal compile error: ';' expected.",
        "For slow and methodical readers, trace the path: System opens the operating system toolbox, out picks up the stdout megaphone, println speaks your message and steps down to the next line, and the semicolon puts the final period on your sentence.",
        "For fast readers, remember: System.out is a PrintStream targeting stdout, println appends a newline and flushes the buffer, print omits the newline, and every statement must terminate with a semicolon."
      ],
      "example": "Think of System.out.println as an automated typewriter. System is the desk, out is the physical typing mechanism connected to paper, println types out your words and immediately pulls the carriage return lever to drop down to the next clean line, and the semicolon is the mechanical stop that confirms the keystroke is finished.",
      "code": "// Java Terminal Output & PrintStream Simulation\nclass TerminalOutputSimulator {\n  private buffer: string[] = [];\n\n  print(message: string): void {\n    // Appends text to current buffer line without carriage return\n    if (this.buffer.length === 0) this.buffer.push('');\n    this.buffer[this.buffer.length - 1] += message;\n  }\n\n  println(message: string): void {\n    // Appends text and advances to a new line\n    if (this.buffer.length === 0) this.buffer.push('');\n    this.buffer[this.buffer.length - 1] += message;\n    this.buffer.push(''); // New line break\n  }\n\n  flush(): string {\n    const rendered = this.buffer.join('\\n').trim();\n    this.buffer = [];\n    return rendered;\n  }\n}\n\nconst terminal = new TerminalOutputSimulator();\nterminal.println('Hello!');\nterminal.println('I am learning Java.');\nterminal.println('Let us build!');\nconsole.log(terminal.flush());",
      "output": "Hello!\nI am learning Java.\nLet us build!",
      "codeNotes": [
        { "line": 4, "note": "Simulates standard output buffer connected to process file descriptor 1" },
        { "line": 11, "note": "println appends message text and inserts newline carriage break" },
        { "line": 23, "note": "Three println calls produce exactly three distinct output lines" }
      ],
      "tryIt": "Add a fourth println call with 'Enterprise systems ready.' and verify the output contains four lines.",
      "check": {
        "question": "What is the key difference between System.out.print() and System.out.println()?",
        "options": [
          "println() appends a newline break after the output, while print() leaves the cursor on the same line",
          "print() only works for numbers, whereas println() only works for text",
          "println() saves output to a disk file, whereas print() displays it on the screen",
          "print() requires an internet connection, whereas println() runs offline"
        ],
        "answer": 0,
        "why": "System.out.println automatically appends a platform-specific line break after emitting its argument, whereas System.out.print does not."
      }
    },
    {
      "title": "Compilation, Execution & Diagnosing First Syntax Errors",
      "say": [
        "In software engineering, writing code is only half the battle; understanding and resolving compiler diagnostics is what distinguishes an amateur from an experienced developer.",
        "When you instruct javac to compile your Java program, the compiler acts as a strict structural auditor.",
        "It checks every identifier, verifies every data type, and confirms that every grammatical rule of the Java specification is observed.",
        "If even a single rule is violated, javac will refuse to produce a .class bytecode file, preventing defective code from ever reaching the execution stage.",
        "Let us examine the three most common syntax errors encountered by engineers when starting with Java.",
        "The first common error is the missing semicolon: ';' expected.",
        "Because Java uses semicolons as statement terminators, omitting one causes the lexer to continue parsing tokens across line boundaries.",
        "The compiler often flags the error on the beginning of the subsequent line, which can confuse beginners.",
        "Whenever you see ';' expected, always check the tail end of the line immediately preceding the reported line number.",
        "The second frequent error is the unclosed string literal: unclosed string literal.",
        "In Java, textual literals must be enclosed in double quotation marks (\"), such as \"Hello, World!\".",
        "If you forget the closing quote or accidentally hit Enter in the middle of a string without using concatenation, javac halts with this error.",
        "Single quotes (') in Java are reserved exclusively for single characters of the primitive char type (such as 'A'), and cannot be used for text strings.",
        "The third classic diagnostic is: cannot find symbol.",
        "This error indicates that the compiler encountered an identifier—such as a variable name, method name, or class name—that has not been declared or imported.",
        "Because Java is strictly case-sensitive, typing system.out.println with a lowercase 's' will cause javac to look for a variable named 'system' rather than the official 'System' class, triggering a cannot find symbol error.",
        "Similarly, misspelling println as printLn or pintln will cause the same failure.",
        "When your code compiles cleanly with zero errors, you execute it by invoking the runtime launcher: java Solution.",
        "Notice that when running the compiled program with java, you do not include the .class extension; you supply the class name alone.",
        "If you accidentally run java Solution.class, the JVM will attempt to look for a package named 'Solution' and a class named 'class', failing with NoClassDefFoundError.",
        "For slow and methodical readers: remember that compiler errors are friendly guardrails protecting you before your program ever goes live.",
        "For fast readers: remember the diagnostic checklist: check semicolons on previous lines, verify double quotes for strings, check case sensitivity on System, and launch with java Solution (omitting .class)."
      ],
      "example": "Think of the Java compiler as an automated passport control gate at an international airport. If your name is misspelled by a single character (case mismatch) or a stamp is missing (semicolon), the gate stays firmly shut. It is far better to be stopped at the gate than to board the wrong airplane and crash.",
      "code": "// Java Compiler Diagnostic Simulator\nclass CompilerDiagnosticEngine {\n  diagnoseSource(codeSnippet: string): {\n    compilationPassed: boolean;\n    errors: string[];\n  } {\n    const errors: string[] = [];\n    if (codeSnippet.includes('system.out')) {\n      errors.push(\"error: cannot find symbol: variable system (Java is case-sensitive; use 'System')\");\n    }\n    if (codeSnippet.includes('println(') && !codeSnippet.includes(');')) {\n      errors.push(\"error: ';' expected\");\n    }\n    if ((codeSnippet.match(/\"/g) || []).length % 2 !== 0) {\n      errors.push('error: unclosed string literal');\n    }\n    return {\n      compilationPassed: errors.length === 0,\n      errors: errors.length > 0 ? errors : ['BUILD SUCCESS: 0 errors detected.']\n    };\n  }\n}\n\nconst engine = new CompilerDiagnosticEngine();\nconst broken = engine.diagnoseSource('system.out.println(\"Hello\")');\nconsole.log('Fault Diagnosis:');\nbroken.errors.forEach(e => console.log('  ' + e));\n\nconst clean = engine.diagnoseSource('System.out.println(\"Hello!\");');\nconsole.log('Clean Build: ' + clean.errors[0]);",
      "output": "Fault Diagnosis:\n  error: cannot find symbol: variable system (Java is case-sensitive; use 'System')\n  error: ';' expected\nClean Build: BUILD SUCCESS: 0 errors detected.",
      "codeNotes": [
        { "line": 8, "note": "Detects case-sensitivity mismatch on built-in System class identifier" },
        { "line": 11, "note": "Detects missing mandatory semicolon statement terminator" },
        { "line": 14, "note": "Detects unclosed double quote string boundary tokens" }
      ],
      "tryIt": "Pass a code snippet with an unclosed quote like 'System.out.println(\"Hello);' and verify that the error is correctly reported.",
      "check": {
        "question": "What error occurs if an engineer writes 'system.out.println(\"Hi\");' with a lowercase 's'?",
        "options": [
          "A compile-time 'cannot find symbol' error because Java is case-sensitive and 'System' must be capitalized",
          "The program will compile and execute normally because Java ignores casing in class names",
          "The computer will shut down immediately to protect the operating system kernel",
          "The string 'Hi' will be printed in lowercase letters instead of uppercase letters"
        ],
        "answer": 0,
        "why": "Java is strictly case-sensitive. The standard class name is capitalized as 'System'; writing 'system' causes the compiler to fail with a cannot find symbol error."
      }
    }
  ]
}

print("Checking Day 1 word counts:")
for i, part in enumerate(day1['parts']):
    wc = word_count(part['say'])
    print(f"  Part {i+1} ({part['title']}): {wc} words")

total_wc = sum(word_count(p['say']) for p in day1['parts'])
print(f"Total Day 1 words: {total_wc} words (>= 2900 required: {total_wc >= 2900})")

for i, part in enumerate(day1['parts']):
    wc = word_count(part['say'])
    assert wc >= 580, f"Part {i+1} failed word count: {wc} < 580"

