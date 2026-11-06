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

DAY_1 = {
  "day": 1,
  "title": "Java Platform Architecture & First Program: Hello World, Classes and System.out",
  "goal": "Master the Java runtime environment: understand how Java source code compiles to platform-independent bytecode, how the JVM executes class files, the container architecture of classes, the public static void main starting door, and terminal output using System.out.println.",
  "minutes": 38,
  "recap": "Welcome to Java Systems Engineering. Today we begin our journey into one of the world's most resilient enterprise backend programming platforms by writing and deconstructing our very first executable program.",
  "summary": [
    "Java source code (.java) is compiled by javac into platform-neutral bytecode (.class) rather than machine instructions.",
    "The Java Virtual Machine (JVM) loads and verifies bytecode, providing write-once run-anywhere execution across operating systems.",
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
        "To write high-performance enterprise software in Java, you must look past the code editor and understand the low-level virtual machine executing your instructions. Unlike languages like C or C++, which compile directly into native operating system machine instructions tied to an x86 or ARM CPU architecture, Java was engineered around the concept of architectural neutrality. When you create a file named Solution.java, you author human-readable source text conforming to the strict Java Language Specification. When you invoke the Java compiler using the javac command, the compiler does not emit native assembly code for Windows or Linux. Instead, javac parses your code, checks static type safety, verifies access boundaries, and translates the logic into an intermediate representation known as Java Bytecode.",
        "Java Bytecode is stored inside binary files with the .class extension, containing compact, highly structured 8-bit opcodes designed for an idealized abstract computing machine called the Java Virtual Machine (JVM). The JVM is an execution engine implemented natively for each target operating system, whether it is 64-bit Linux running inside an Amazon Web Services EC2 container, macOS running on Apple Silicon, or Windows Server on an enterprise blade. Because every JVM implementation adheres strictly to the exact same Java Virtual Machine Specification, the identical .class file compiled on a developer laptop will execute identically on a high-throughput production server cluster halfway around the globe. This powerful paradigm is summarized by the classic industry principle: Write Once, Run Anywhere.",
        "When the JVM launches, a specialized subsystem called the ClassLoader reads your .class files from disk, jar archives, or network streams and loads the binary bytecode into memory. Before a single instruction is executed, a crucial security layer called the Bytecode Verifier inspects every byte sequence. The Bytecode Verifier ensures that the code does not perform illegal memory access, does not forge pointer addresses, does not violate access modifier boundaries, and maintains strict stack operand type safety. This architectural boundary prevents malicious or corrupted bytecode from crashing the host process, providing a robust sandbox environment that has powered mission-critical enterprise workloads across global banking and logistics infrastructure for decades.",
        "Once verified, the JVM execution engine begins running the instructions using a tiered execution strategy. In the beginning, an interpreter translates bytecode instructions one by one into native CPU instructions, ensuring instant application startup without waiting for an expensive upfront compilation phase. As your application runs, the JVM continuously profiles runtime execution metrics, tracking which loops and methods execute most frequently—these hot execution paths are referred to as hot spots. The HotSpot JVM utilizes tiered compilation to profile execution frequencies, identifying performance bottlenecks in real time.",
        "When a method crosses predefined execution thresholds, the Just-In-Time (JIT) C1 compiler compiles it with basic client optimizations. If execution frequency remains exceptionally high, the JIT C2 server compiler aggressively translates the bytecode into hyper-optimized native machine code directly in memory. The C2 compiler performs sophisticated optimizations including loop unrolling, dead code elimination, constant folding, and inlining small methods directly into the calling frame. This native machine code executes directly on the bare metal CPU, delivering throughput comparable to compiled languages like C++ or Rust while retaining the memory safety and portability of an abstracted virtual machine runtime.",
        "Finally, understanding the JVM lifecycle is essential for designing production cloud deployments. In containerized environments orchestrated by Kubernetes, freshly booted pods immediately receiving live traffic can experience transient latency spikes because critical execution paths are still running under the unoptimized interpreter loop. Senior infrastructure engineers configure warmup traffic routines and monitor tiered compilation telemetry using JVM flags such as -XX:+TieredCompilation and -XX:CICompilerCount. For slow readers, remember that Java code is compiled to bytecode first, loaded into the JVM, verified for safety, and JIT-compiled into native speed. For fast readers, remember the pipeline: .java source -> javac -> .class bytecode -> ClassLoader -> Bytecode Verifier -> Interpreter -> Tiered JIT (C1/C2) -> Native CPU."
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
      "check": make_check(
        "What is the primary output generated by the Java compiler (javac) when compiling source code?",
        "Platform-independent bytecode stored in .class files that run on the Java Virtual Machine (JVM)",
        "Direct x86-64 machine code that can only execute on Windows operating systems",
        "An encrypted zip archive containing minified JavaScript and HTML files",
        "A plain text configuration file interpreted directly by the operating system kernel",
        "The javac compiler produces platform-neutral bytecode stored in .class files, which the JVM subsequently interprets and JIT-compiles into native instructions."
      )
    },
    {
      "title": "The Class Blueprint: Public Class Containers & Source File Naming Invariants",
      "say": [
        "In the Java programming language, encapsulation and type safety are foundational rules of the language grammar. Unlike scripting languages like Python or JavaScript where you can freely declare standalone global functions and loose statements at the root level of a file, every single line of executable Java code must reside strictly within a class container. A class serves as an architectural blueprint that binds related state fields and executable behaviors together into a cohesive, organized unit. When declaring a top-level class that forms the main entry point of your application, you declare it using the public class syntax, such as public class Solution.",
        "Here, the public keyword is an access modifier that signals to both the compiler and the external runtime environment that this class can be accessed, loaded, and invoked from anywhere, including from the external JVM launcher. The class keyword instructs the Java compiler that you are defining a new reference type. The identifier immediately following class is the name of your class, which by universal Java convention is written in PascalCase (also known as UpperCamelCase), beginning with a capital letter. Naming conventions in Java carry profound significance for code readability across massive engineering organizations.",
        "There is a strict, non-negotiable architectural invariant in the Java language specification regarding file naming: if a class is declared as public, the source file containing it must match the class name character-for-character, including exact casing, followed by the .java extension. For example, if your code declares public class Solution, the file on disk must be named Solution.java. If you name the file solution.java with a lowercase 's', or App.java while declaring public class Solution, the javac compiler will immediately abort compilation with a fatal diagnostic error stating: 'class Solution is public, should be declared in a file named Solution.java'.",
        "Why did the architects of the Java platform impose such an uncompromising restriction on developers? In massive enterprise codebases containing tens of thousands of individual classes, locating which file defines which class could quickly become an intractable maintenance nightmare if filenames did not match type names. By enforcing a deterministic 1-to-1 correspondence between public class identifiers and file paths, the JVM ClassLoader and IDE build tools can instantly map any fully qualified class name directly to a file on disk without scanning the contents of the entire filesystem.",
        "This structural rule extends directly into Java's packaging system. When an enterprise application groups classes into logical namespaces using packages—such as package com.enterprise.trading;—the compiled .class files and source .java files must reside in matching directory hierarchies on the storage drive, such as com/enterprise/trading/Solution.java. This synchronization between namespace declarations, class identifiers, and filesystem directory hierarchies enables the Java ClassPath and module system to resolve dependencies with sub-millisecond deterministic predictability during application startup.",
        "Inside the class definition, open and closed curly braces ({ and }) delineate the class body. Everything that belongs to that class—its methods, its member variables, its constants, and its inner classes—must be nested neatly between these curly braces. Indentation inside the braces is typically set to four spaces or two spaces by organizational formatting rules. Semicolons are not used after the closing curly brace of a class definition, unlike in C++ where a class definition must terminate with a semicolon. The compiler recognizes the closing curly brace as the natural end of the class scope.",
        "For slow and methodical readers, visualize the class container as a secure corporate headquarters building: the public keyword unlocks the front entrance, the class name gives the building its official street address, the package specifies the postal city, and the curly braces represent the outer walls that contain all internal business operations. For fast readers, lock in the essential invariants: every program requires a class, a public class must match its source filename exactly including case sensitivity, packages mirror folder trees, and all executable logic lives strictly inside the class's curly braces."
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
      "check": make_check(
        "If a source file contains the declaration 'public class BankLedger', what must the file name be on disk?",
        "BankLedger.java (matching exact casing and spelling)",
        "bankledger.java (casing does not matter in Java source filenames)",
        "Solution.java (any valid filename is acceptable as long as it ends in .java)",
        "BankLedger.class (source code files must be saved with .class extension)",
        "The Java compiler strictly requires that a public class match the filename on disk exactly, including case sensitivity, followed by .java."
      )
    },
    {
      "title": "The Starting Door: public static void main(String[] args) Entry Point",
      "say": [
        "Once you have defined your class container, how does the Java Virtual Machine know where to begin executing your instructions? Unlike a simple script that evaluates from the first line downwards, a compiled Java application requires a standardized, universally recognized entry point. In Java, that starting door is the main method, declared with the exact signature: public static void main(String[] args). Every single keyword in this iconic signature was chosen with deliberate systems architecture in mind, and understanding each token transforms it from an intimidating piece of boilerplate magic into crystal-clear engineering.",
        "First, the public keyword ensures that the method has universal accessibility across package and process boundaries. When you execute java Solution from your operating system command line, the JVM launcher process starts outside your class and outside your package structure. If main were declared private or protected, the JVM launcher would be forbidden by Java's access control invariants from invoking it, and execution would abort immediately with an access violation error. The entry point must be accessible to the entire world.",
        "Second, the static keyword is the most critical architectural mechanism of the signature. Normally in object-oriented programming, to invoke a method on a class, you must first construct an instance of that class in memory using the new operator. However, at the very millisecond a program boots up, no objects exist anywhere in the JVM heap. By declaring main as static, the method belongs to the class type itself rather than to any individual object instance. This allows the JVM launcher to call Solution.main() directly upon loading the class into memory, without needing to allocate an instance or guess what constructor arguments to supply.",
        "Third, the void return type specifies that this method does not return a value back to its caller. In procedural languages like C or C++, the main function returns an integer status code (such as return 0) to communicate success or failure to the operating system shell. Java deliberately separates application return values from operating system process exit codes. If a Java application needs to terminate and pass an explicit exit status code to the operating system, it invokes System.exit(statusCode). Therefore, main returns void, keeping the method signature clean and focused.",
        "Fourth, the identifier main is the designated method name hardcoded into the JVM specification. When the host operating system spawns the Java process, the JVM creates the initial application thread named 'main'. This main thread is allocated its own private call stack frame governed by the -Xss memory tuning flag. The JVM places the activation record for public static void main at the very foundation of this thread stack, establishing the root execution context from which all subsequent object allocations, calculations, and child threads originate.",
        "Finally, the parameter list (String[] args) represents an array of String objects that captures any command-line arguments passed to the program when it was launched. For example, running java Solution 8080 prod passes two strings: args[0] is '8080' and args[1] is 'prod'. Even if your program does not take any command-line parameters, the (String[] args) parameter must still be present for the JVM launcher to recognize the signature. You may also see it written as (String... args) using varargs syntax in modern codebases.",
        "For slow readers, repeat the core mantra: public means open to the JVM launcher, static means callable without creating an object, void means no return value, main is the designated root thread door, and String[] args receives startup flags. For fast readers, remember that omitting static or misspelling main results in a successful javac compilation, but a fatal runtime failure stating: 'Main method not found in class Solution'."
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
      "check": make_check(
        "Why must the main method in Java be declared with the 'static' keyword?",
        "It allows the JVM to invoke the entry point directly on the class without needing to construct an instance in heap memory",
        "It prevents the program from using more than one megabyte of RAM during execution",
        "It ensures that variables declared inside main cannot be modified by any other thread",
        "It converts the Java method into native C code automatically at compile time",
        "The static keyword allows the JVM execution launcher to invoke the main method without having to instantiate an object of the containing class first."
      )
    },
    {
      "title": "Terminal Standard Output: System.out.println, Streams & Semicolon Terminators",
      "say": [
        "Now that our program has entered the main method, we need a reliable way to communicate data and status results to the outside world. In Java, terminal output is handled by a standard stream pipeline: System.out.println(). To truly master this fundamental statement, let us deconstruct its three constituent parts and trace how they interact with the host operating system. First, System is a core built-in class residing in the standard java.lang package. The java.lang package is uniquely privileged: it is automatically imported into every single Java source file by the compiler, without requiring an explicit import java.lang.* statement.",
        "The System class provides access to process-level facilities, including standard input streams, standard error streams, environment variables, garbage collection hooks, and high-precision system timers. Second, out is a public static final field hosted directly inside the System class. This out variable holds a reference to a PrintStream object that is instantiated and configured by the JVM runtime during initial bootstrap. Under the hood, this PrintStream is bound directly to the standard output stream of your running operating system process—known in Unix, Linux, and Windows as file descriptor 1 (stdout).",
        "Third, println() is an overloaded method provided by the PrintStream class. The name println is a concatenation of the words 'print' and 'line'. When you invoke System.out.println(\"Hello!\"), the PrintStream writes the character sequence 'H', 'e', 'l', 'l', 'o', '!' into its internal stream buffer, flushes the stream so that the characters appear on the user terminal immediately, and automatically appends a platform-specific newline character sequence. On Linux and macOS, this newline is the line feed character (\\n), whereas on Windows, the JVM outputs a carriage return and line feed pair (\\r\\n).",
        "In contrast, Java also exposes System.err, which is a companion PrintStream connected to file descriptor 2 (stderr). While System.out is intended for normal business information and user output, System.err is designated for fault diagnostics and error reports. Crucially, in many operating environments, standard output is line-buffered for maximum throughput, while standard error is typically unbuffered to guarantee that critical crash messages are written to disk logs even if the process terminates abruptly.",
        "If an engineer wants to output text to the terminal without advancing the cursor to a new line—allowing subsequent output statements to continue printing on the exact same row—they invoke System.out.print() instead. Furthermore, for formatted tabular output, Java provides System.out.printf(), which supports format specifiers like %d for integers, %f for decimals, and %s for strings. Understanding when to use println versus print is essential for creating clean command-line interfaces and clear diagnostic logs.",
        "Notice that every complete statement in Java must terminate with a semicolon (;). In Java grammar, the semicolon is not an optional suggestion or an aesthetic convention; it is a mandatory statement terminator. Because Java is a free-format language where arbitrary whitespace, tabs, and newlines are ignored by the compiler lexer, the compiler relies entirely on semicolons to know where one instruction ends and the next begins. If you omit a semicolon after a println statement, the compiler will attempt to merge the current statement with the following line, producing a fatal compile-time syntax error: ';' expected.",
        "For slow and methodical readers, trace the path: System accesses the operating system layer, out references the stdout stream, println outputs your message and steps down to the next row, and the semicolon seals the statement. For fast readers, remember the four key facts: System.out is a PrintStream targeting stdout (file descriptor 1), println appends a newline and flushes the buffer, print omits the newline, System.err targets stderr, and every complete instruction must end with a semicolon."
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
      "check": make_check(
        "What is the key difference between System.out.print() and System.out.println()?",
        "println() appends a newline break after the output, while print() leaves the cursor on the same line",
        "print() only works for numbers, whereas println() only works for text",
        "println() saves output to a disk file, whereas print() displays it on the screen",
        "print() requires an internet connection, whereas println() runs offline",
        "System.out.println automatically appends a platform-specific line break after emitting its argument, whereas System.out.print does not."
      )
    },
    {
      "title": "Compilation, Execution & Diagnosing First Syntax Errors",
      "say": [
        "In enterprise software engineering, writing code is only the initial step; mastering compiler diagnostics and debugging builds is what separates an amateur from a professional engineer. When you run javac Solution.java, the Java compiler acts as an unyielding structural auditor. It evaluates every token, verifies every identifier, confirms type boundaries, and ensures that every rule of the Java Language Specification is observed. If even a single grammatical violation exists, javac refuses to emit a .class file, preventing defective or unsafe binaries from ever running on your system.",
        "Let us examine the three most common compiler diagnostics encountered when starting Java development. The first frequent diagnostic is: ';' expected. Because Java requires semicolons as statement terminators, omitting one causes the parser to consume tokens past the intended end of the line. Often, the compiler reports the error on the beginning of the subsequent line, which can initially mislead new engineers. Whenever you encounter ';' expected, always inspect the tail end of the line immediately preceding the reported line number to locate the missing terminator.",
        "The second common diagnostic is: unclosed string literal. In Java, textual string literals must be enclosed in double quotation marks (\"), such as \"Hello, World!\". If you omit the closing double quote or accidentally insert a raw line break in the middle of a string without using concatenation (+), javac immediately halts compilation. Note that single quotes (') in Java are reserved exclusively for single characters of the primitive char type (such as 'A' or '9'), and enclosing words or phrases in single quotes will cause a compiler failure: 'too many characters in character literal'.",
        "The third classic error is: cannot find symbol. This error means the compiler encountered an identifier—such as a variable name, class name, or method name—that has not been declared or imported. Because Java is strictly case-sensitive, typing system.out.println with a lowercase 's' will cause the compiler to look for a variable named 'system' rather than the official 'System' class, triggering a cannot find symbol error. Similarly, misspelling println as printLn or printline will produce the exact same diagnostic failure.",
        "As codebases grow across enterprise repositories, compilation involves multiple files and third-party libraries. You use javac with the ClassPath flag (-cp or -classpath) to specify where external dependencies and compiled modules reside, such as javac -cp lib/*:. Solution.java. In modern production environments, manual javac invocations are typically automated by build orchestration tools like Apache Maven or Gradle, which enforce strict dependency trees and reproducible compilation lifecycles across continuous integration pipelines.",
        "Modern Integrated Development Environments (IDEs) such as IntelliJ IDEA, Eclipse, and VS Code utilize internal incremental compilers that parse and analyze your code as you type. When you see red wavy underlines beneath an identifier or a missing semicolon in your editor, the IDE's Language Server Protocol (LSP) background service is essentially running a live javac abstract syntax tree audit in memory. Learning to read both raw CLI compiler output and IDE telemetry ensures you can debug code seamlessly on headless remote Linux servers where graphical IDEs are not available.",
        "Once your program compiles with zero errors, you launch it using the Java execution command: java Solution. Notice that when invoking the runtime with java, you supply the class name alone, never including the .class extension. If you accidentally run java Solution.class, the JVM interprets 'Solution.class' as a class named 'class' inside a package named 'Solution', failing with a confusing NoClassDefFoundError. Understanding the distinct roles of the compiler command (which expects a filename with .java) and the runtime launcher (which expects a class identifier) is essential.",
        "For slow readers, remember that compiler diagnostics are protective shields that catch errors before your program touches production. For fast readers, keep the mental debugging checklist ready: check the line above for missing semicolons, ensure double quotes surround all text strings, verify exact capital letters on System and String, and launch applications with java Solution without typing .class."
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
      "check": make_check(
        "What error occurs if an engineer writes 'system.out.println(\"Hi\");' with a lowercase 's'?",
        "A compile-time 'cannot find symbol' error because Java is case-sensitive and 'System' must be capitalized",
        "The program will compile and execute normally because Java ignores casing in class names",
        "The computer will shut down immediately to protect the operating system kernel",
        "The string 'Hi' will be printed in lowercase letters instead of uppercase letters",
        "Java is strictly case-sensitive. The standard class name is capitalized as 'System'; writing 'system' causes the compiler to fail with a cannot find symbol error."
      )
    }
  ]
}

if __name__ == '__main__':
    print("Checking Day 1 word counts:")
    for i, part in enumerate(DAY_1['parts']):
        wc = word_count(part['say'])
        print(f"  Part {i+1} ({part['title']}): {wc} words")
        assert wc >= 580, f"Part {i+1} failed: {wc} < 580"
    tot = sum(word_count(p['say']) for p in DAY_1['parts'])
    print(f"Total Day 1 words: {tot} (>= 2900 required)")
    assert tot >= 2900
    print("DAY 1 VERIFIED PASS!")
