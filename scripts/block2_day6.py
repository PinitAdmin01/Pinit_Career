# Day 6: Switch Statements, Modern Switch Expressions, Pattern Matching & Sealed State Machines

DAY_6 = {'day': 6,
 'title': 'Switch Statements, Modern Switch Expressions, Pattern Matching & Sealed State Machines',
 'goal': 'Master Java multi-branch decision engines from classic switch statements to modern switch expressions and '
         'Java 21 pattern matching. Understand bytecode-level dispatching via tableswitch and lookupswitch, strict '
         'case fallthrough mechanics, scope isolation, the yield keyword, and exhaustive state evaluation.',
 'minutes': 25,
 'recap': 'In Day 5, we mastered conditional branching with if/else-if/else ladders, boolean logic, and short-circuit '
          'evaluation. While if-statements excel at range checks and compound boolean evaluations, matching a single '
          'expression against dozens of discrete candidate values creates unwieldy cascading code. Today, we step into '
          'the switch engine.',
 'parts': [{'title': 'Classic Switch Statements: Syntax, Direct Value Matching & Bytecode Dispatch',
            'content': 'When developing enterprise software, developers frequently encounter scenarios where execution '
                       'flow must branch based on the discrete value of a single variable—such as an HTTP status code, '
                       'a transaction state enum, or a day of the week identifier. Writing a cascading sequence of '
                       'fifteen if-else branches is not only visually noisy and error-prone, but it also imposes '
                       'sequential evaluation overhead where each condition must be evaluated in order until a true '
                       'match is found. The Java switch statement provides a structured, multi-way branch mechanism '
                       'that compares an incoming selector expression against a list of constant case labels. '
                       'Supported selector types in classic Java include primitive integers (byte, short, char, int), '
                       'their corresponding wrapper classes (Byte, Short, Character, Integer), String literals, and '
                       'enum types. Long, float, double, and boolean primitives are explicitly forbidden as switch '
                       'selectors because floating-point numbers suffer from IEEE 754 precision inaccuracies that make '
                       'exact equality matching hazardous, while 64-bit longs exceed the 32-bit integer indexing '
                       'limits of the JVM instruction set.\n'
                       '\n'
                       'At the JVM bytecode level, the Java compiler (javac) does not compile a switch statement into '
                       'a linear chain of conditional jump instructions. Instead, it inspects the density of the case '
                       'constants and compiles the switch into one of two high-performance bytecode instructions: '
                       'tableswitch or lookupswitch. When the case values are contiguous or densely clustered (for '
                       'example, cases 1, 2, 3, 4, and 5), the compiler emits a tableswitch instruction. A tableswitch '
                       'operates as an O(1) constant-time direct array index lookup table in memory. The JVM takes the '
                       "selector value, subtracts the table's minimum bound to compute an integer offset, and "
                       'immediately jumps to the corresponding target bytecode address in a single CPU instruction! '
                       'Conversely, when the case values are sparse or widely dispersed (for example, matching HTTP '
                       'status codes 200, 404, 500, and 503), generating a dense table would waste memory on empty '
                       'padding slots. In this scenario, the compiler sorts the case values into ascending numerical '
                       'order and emits a lookupswitch instruction, which performs an O(log n) binary search over the '
                       'sorted keys at runtime.\n'
                       '\n'
                       'Understanding this bytecode distinction allows performance-conscious engineers to write '
                       'cache-friendly, highly deterministic routing logic. Modern CPUs feature Branch Target Buffers '
                       '(BTB) and hardware branch predictors that thrive on predictable, aligned jump tables. When '
                       "HotSpot's C2 Just-In-Time compiler compiles a dense tableswitch, it can align the jump target "
                       'addresses to 64-byte CPU cache lines, minimizing instruction cache misses during '
                       'high-throughput packet routing. Furthermore, consider how Java handles String literals in '
                       'switch statements, a feature introduced in Java 7. Because JVM bytecodes only natively '
                       'understand integer dispatch, the Java compiler ingeniously translates a String switch into a '
                       "two-level nested switch! The first level is a lookupswitch that operates on the String's "
                       '32-bit integer hash code (computed via String.hashCode()). Once the hash code matches a '
                       'bucket, the second level executes an explicit String.equals() check within that bucket to '
                       'definitively verify identity and protect against hash collisions. Only after both hash code '
                       'and string equality pass does execution jump to the target business logic!\n'
                       '\n'
                       'When constructing a classic switch statement, the switch keyword is followed by the selector '
                       'expression enclosed in parentheses, followed by a body delimited by curly braces. Inside the '
                       'body, case labels specify the literal constants to match against, followed by a colon. '
                       'Execution jumps directly to the matching case label and proceeds downward. If no case matches '
                       'and a default label is present, execution diverts to the default block. Without proper '
                       'architectural discipline, however, classic switch statements introduce subtle structural '
                       'traps, most notably variable scope leakage and unintentional case fallthrough. In the '
                       'following interactive lab, we inspect how the JVM executes a clean, canonical integer switch '
                       'statement that resolves day identifiers into localized domain strings with O(1) jump table '
                       'efficiency.',
            'code': 'public class SwitchDispatchLab {\n'
                    '    public static String getDayNameClassic(int day) {\n'
                    '        String dayName;\n'
                    '        // The JVM compiles dense integer cases into an O(1) tableswitch instruction\n'
                    '        switch (day) {\n'
                    '            case 1:\n'
                    '                dayName = "Monday";\n'
                    '                break;\n'
                    '            case 2:\n'
                    '                dayName = "Tuesday";\n'
                    '                break;\n'
                    '            case 3:\n'
                    '                dayName = "Wednesday";\n'
                    '                break;\n'
                    '            case 4:\n'
                    '                dayName = "Thursday";\n'
                    '                break;\n'
                    '            case 5:\n'
                    '                dayName = "Friday";\n'
                    '                break;\n'
                    '            case 6:\n'
                    '                dayName = "Saturday";\n'
                    '                break;\n'
                    '            case 7:\n'
                    '                dayName = "Sunday";\n'
                    '                break;\n'
                    '            default:\n'
                    '                dayName = "Unknown";\n'
                    '                break;\n'
                    '        }\n'
                    '        return dayName;\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("Day 1: " + getDayNameClassic(1));\n'
                    '        System.out.println("Day 3: " + getDayNameClassic(3));\n'
                    '        System.out.println("Day 99: " + getDayNameClassic(99));\n'
                    '    }\n'
                    '}',
            'checks': [{'question': 'Which bytecode instruction does the Java compiler emit when switch case values '
                                    'are contiguous integer constants?',
                        'options': ['tableswitch, which provides O(1) constant-time direct array index dispatch',
                                    'lookupswitch, which performs an O(n^2) linear traversal over case labels',
                                    'goto_w, which creates a recursive loop across heap memory',
                                    'invokevirtual, which dynamically allocates a hash table on every evaluation'],
                        'answer': 0,
                        'explanation': 'When case constants are densely packed, javac emits tableswitch, allowing the '
                                       'JVM to index directly into a jump table in O(1) constant time without linear '
                                       'comparisons.'},
                       {'question': 'Why does classic Java prohibit primitive long, float, and double types as switch '
                                    'selectors?',
                        'options': ['Floats suffer from IEEE 754 precision variance making exact matches hazardous, '
                                    'and longs exceed 32-bit table indexing',
                                    'The JVM bytecode verifier crashes if any 64-bit primitive is loaded into memory',
                                    'Floating point numbers can only be compared using native C libraries via JNI',
                                    'Primitive longs require boolean casting before being read by CPU registers'],
                        'answer': 0,
                        'explanation': 'Floating-point values cannot guarantee exact bitwise equality due to rounding, '
                                       'and 64-bit longs exceed the 32-bit integer limits used by the JVM tableswitch '
                                       'and lookupswitch bytecodes.'},
                       {'question': 'How does the Java compiler implement switch statements over String objects under '
                                    'the hood?',
                        'options': ["Via a two-stage translation: switching on the string's 32-bit hashCode() first, "
                                    'followed by an equals() verification to defend against collisions',
                                    'By converting each character of the string into a separate recursive method call',
                                    'By allocating a new java.util.HashMap on the heap during every single switch '
                                    'execution',
                                    'By serializing the String into JSON and transmitting it to a local loopback '
                                    'network socket'],
                        'answer': 0,
                        'explanation': 'String switching uses hashCode() for fast lookup table dispatch, followed by '
                                       'String.equals() to definitively resolve hash collisions.'},
                       {'question': 'What is the time complexity of the lookupswitch instruction used for sparse case '
                                    'constants?',
                        'options': ['O(log n) because the compiler sorts the constants and the JVM conducts a binary '
                                    'search',
                                    'O(1) direct memory indexing regardless of key distribution',
                                    'O(n) linear sequential scanning equivalent to cascading if-else statements',
                                    'O(n!) factorial search through heap permutations'],
                        'answer': 0,
                        'explanation': 'lookupswitch stores case keys in sorted order, enabling the JVM runtime to '
                                       'perform an efficient binary search with O(log n) time complexity.'}],
            'tryIt': 'Try modifying the switch statement to add a case for Sunday (day 7) and verify the returned '
                     'name.'},
           {'title': 'Case Fallthrough, The Break Keyword & Scope Isolation Mechanics',
            'content': 'The defining syntactic quirk of the classic C-style switch statement in Java is fallthrough. '
                       'When the JVM matches the selector expression to a case label, it jumps execution to that '
                       "label's bytecode address. From that entry point, execution flows sequentially downward through "
                       'subsequent instructions across all following cases until it either encounters an explicit '
                       'break statement or reaches the closing curly brace of the switch block! This means that if you '
                       'omit the break keyword at the end of case 1, execution will physically execute case 1, fall '
                       'through into case 2, execute case 2, fall through into case 3, and so on. In commercial '
                       'software engineering, unintentional fallthrough is one of the most notorious sources of '
                       'production bugs, frequently causing silent data corruption, duplicate database transactions, '
                       'or unauthorized permission grants when a junior engineer forgets a single break keyword.\n'
                       '\n'
                       'Historically, this behavior has caused catastrophic security vulnerabilities. In real-world '
                       'CVE audits, multiple critical access control breaches occurred when an authentication router '
                       'checked for an ADMIN role, executed administrative initialization, but lacked a break '
                       'statement, falling through into a GUEST role handler that reset permissions or logged public '
                       'metrics while keeping privileged resources open. Because the JVM bytecode execution model is '
                       'purely sequential within a method frame, the program counter (PC register) simply advances '
                       "from instruction to instruction unless an explicit branch bytecode (such as 'goto') directs it "
                       "elsewhere. The 'break' keyword in Java compiles directly into a 'goto' instruction that jumps "
                       'past the terminal boundary of the switch block, guaranteeing immediate exit. When the C2 JIT '
                       'compiler processes a switch block where every branch concludes with a break, it can recognize '
                       'that each branch is completely isolated and dead code elimination passes can prune unused '
                       'branches aggressively.\n'
                       '\n'
                       'However, fallthrough is not an accidental language defect; it was deliberately retained from C '
                       'and C++ to enable intentional multi-case grouping. When multiple distinct input values must '
                       'execute the exact same business logic, engineers can stack case labels on top of one another '
                       'without break statements between them. For example, if cases 1 through 5 represent business '
                       'days that require standard order processing, while cases 6 and 7 represent weekend days that '
                       "require expedited batch queuing, stacking 'case 1: case 2: case 3: case 4: case 5:' allows all "
                       'five inputs to enter the same processing block, culminating in a single terminating break. In '
                       'modern static analysis pipelines (such as SonarQube, SpotBugs, or Google Error Prone), any '
                       'non-empty case block that falls through without a break or return statement must be explicitly '
                       "marked with a compiler comment such as '/* falls through */' or an annotation like "
                       '\'@SuppressWarnings("fallthrough")\' to prevent automated CI/CD build failures.\n'
                       '\n'
                       'Another critical architectural nuance of the classic switch statement is variable scope. The '
                       'entire body of a switch statement enclosed within the outer curly braces constitutes a single '
                       "unified lexical scope! If you declare a local variable 'int temp = 42;' inside case 1, that "
                       'variable identifier remains declared and visible throughout all subsequent cases, including '
                       'case 2, case 3, and the default block. However, if the selector expression matches case 2, '
                       "execution jumps directly to case 2, completely bypassing the initialization of 'temp' in case "
                       "1! If case 2 attempts to read 'temp', the Java compiler will raise a compilation error: "
                       "'variable temp might not have been initialized'. Conversely, attempting to declare 'int temp = "
                       "99;' inside case 2 will fail with 'variable temp is already defined in scope'. To achieve "
                       'proper variable isolation within a classic switch, you must enclose individual case bodies '
                       "within explicit block braces '{ ... }', creating an isolated nested scope that prevents "
                       'variable name collisions and uninitialized access leaks. Understanding these scope boundaries '
                       'is essential for maintaining clean, modular enterprise routing logic.',
            'code': 'public class SwitchFallthroughLab {\n'
                    '    public static String classifyDayType(int day) {\n'
                    '        String type;\n'
                    '        switch (day) {\n'
                    '            // Intentional fallthrough: stacking cases for common logic\n'
                    '            case 1:\n'
                    '            case 2:\n'
                    '            case 3:\n'
                    '            case 4:\n'
                    '            case 5:\n'
                    '                type = "Weekday (Business Processing)";\n'
                    '                break; // Essential: halts execution and prevents leaking into Weekend!\n'
                    '            case 6:\n'
                    '            case 7:\n'
                    '                type = "Weekend (Batch Ingestion)";\n'
                    '                break;\n'
                    '            default:\n'
                    '                type = "Invalid Day Index";\n'
                    '                break;\n'
                    '        }\n'
                    '        return type;\n'
                    '    }\n'
                    '\n'
                    '    public static void demonstrateScopeTrap(int code) {\n'
                    '        switch (code) {\n'
                    '            case 1: { // Explicit block scoping isolates local variables!\n'
                    '                int calculatedBuffer = 1024;\n'
                    '                System.out.println("Allocated buffer: " + calculatedBuffer);\n'
                    '                break;\n'
                    '            }\n'
                    '            case 2: { // Independent isolated block scope: same variable name is legal!\n'
                    '                int calculatedBuffer = 2048;\n'
                    '                System.out.println("Allocated buffer: " + calculatedBuffer);\n'
                    '                break;\n'
                    '            }\n'
                    '            default:\n'
                    '                System.out.println("Default buffer allocated");\n'
                    '                break;\n'
                    '        }\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("Day 3: " + classifyDayType(3));\n'
                    '        System.out.println("Day 6: " + classifyDayType(6));\n'
                    '        demonstrateScopeTrap(1);\n'
                    '        demonstrateScopeTrap(2);\n'
                    '    }\n'
                    '}',
            'checks': [{'question': 'What occurs when execution enters a classic case block that lacks a terminating '
                                    'break or return statement?',
                        'options': ['Execution continues sequentially into the statements of subsequent cases until a '
                                    'break or the end of the block is reached',
                                    'The JVM immediately throws an UnhandledFallthroughException',
                                    'The switch statement restarts from the first case in an infinite loop',
                                    'The compiler automatically generates return null for all following lines'],
                        'answer': 0,
                        'explanation': 'Classic switch semantics enforce fallthrough: without an explicit break, '
                                       'return, or throw, execution cascades straight down into subsequent case '
                                       'blocks.'},
                       {'question': 'How can an engineer isolate local variable declarations within individual classic '
                                    'switch case blocks to avoid duplicate variable name errors?',
                        'options': ['Enclose the individual case block statements in explicit curly braces { ... } to '
                                    'form a nested lexical scope',
                                    'Declare all variables using the global keyword outside the class',
                                    'Prefix every variable name with the private modifier inside the case',
                                    'Append a semicolon directly after the case label before the colon'],
                        'answer': 0,
                        'explanation': 'Wrapping a case body in curly braces { ... } creates a localized block scope, '
                                       'allowing variables to be declared without colliding with other cases in the '
                                       'switch.'},
                       {'question': 'What underlying bytecode instruction does the Java compiler generate for a break '
                                    'statement within a switch?',
                        'options': ['A goto instruction targeting the bytecode address immediately following the '
                                    'switch block',
                                    'An athrow instruction that pushes an exception to the operand stack',
                                    'A nop instruction that pauses the CPU thread for one clock cycle',
                                    'A monitorexit instruction that releases heap locks'],
                        'answer': 0,
                        'explanation': 'A break keyword simply compiles into a goto jump instruction that bypasses the '
                                       'remainder of the switch body.'},
                       {'question': 'Why will the compiler reject reading a variable declared in case 1 from inside '
                                    'case 2 if no explicit block braces were used?',
                        'options': ["Because jumping directly to case 2 bypasses the variable's initialization, "
                                    "violating Java's definite assignment rules",
                                    'Because variables declared in case 1 are permanently deleted from stack memory '
                                    'when case 2 starts',
                                    'Because Java does not permit variables to live across multiple lines of code',
                                    'Because the JVM converts all uninitialized variables into Boolean.FALSE '
                                    'automatically'],
                        'answer': 0,
                        'explanation': 'Java enforces definite assignment: if execution can reach a variable read '
                                       'without passing through its initialization statement, compilation fails.'}],
            'tryIt': 'Try removing the break statement from case 2 and observe how execution falls through into case '
                     '3.'},
           {'title': 'The Default Guard & Exhaustiveness Invariants in Enterprise Logic',
            'content': 'In mission-critical enterprise systems—such as banking transaction gateways, healthcare '
                       'diagnostic monitors, and aerospace flight computers—software correctness depends upon handling '
                       'every conceivable input state. The default label within a switch statement serves as the '
                       'universal defensive guard clause. It specifies the fallback instructions that must execute '
                       'when the selector expression does not match any of the explicitly listed case constants. While '
                       'the Java language specification permits placing the default label anywhere within the switch '
                       'body (even before or between cases), Staff Engineers enforce the strict convention of placing '
                       'default as the final label at the bottom of the switch block. Placing default at the top or '
                       'middle requires an explicit break to prevent falling through into following cases, introducing '
                       'unnecessary cognitive overhead and risk.\n'
                       '\n'
                       'A prevalent anti-pattern among junior developers is assuming that if the business requirements '
                       'specify only three states (e.g., PENDING, APPROVED, REJECTED), the switch statement needs only '
                       "those three cases, omitting default under the assumption that 'no other input is physically "
                       "possible'. This assumption is catastrophic in real-world distributed architectures. In "
                       'microservice ecosystems, upstream services can be updated independently, introducing new enum '
                       'constants or state codes that the downstream service has not yet compiled against. If a '
                       'message containing an unhandled state arrives at a switch lacking a default branch, the '
                       'statement silently finishes without performing any action, leaving transactions in an '
                       'orphaned, uncommitted limbo state with no audit trail or error alert!\n'
                       '\n'
                       'Therefore, defensive programming dictates that every switch statement that handles state '
                       'transitions must include an exhaustive default guard. If an unhandled or unexpected value '
                       'reaches the switch, the default block should immediately reject the operation by logging a '
                       'high-severity diagnostic alert and throwing an informative unchecked exception—typically an '
                       'IllegalArgumentException or IllegalStateException. By failing fast and loud, the system '
                       'prevents invalid state transitions from propagating through database layers, alerting '
                       'operations teams to protocol mismatches or corrupted payloads before financial losses occur.\n'
                       '\n'
                       'In enterprise microservices, robust systems connect this failure handling to observability '
                       'frameworks. When an unhandled state hits the default branch, the service logs the error using '
                       'SLF4J with a Mapped Diagnostic Context (MDC) correlation ID, pushes a counter metric to '
                       'Prometheus, and diverts the malformed message into a Kafka Dead Letter Queue (DLQ). For '
                       "synchronous REST APIs, this failure translates cleanly into an RFC 7807 'Problem Details for "
                       "HTTP APIs' payload with HTTP status 400 (Bad Request) or 422 (Unprocessable Entity). In "
                       'financial settlement networks adhering to ISO 20022 standards, encountering an unrecognized '
                       'transaction status in a switch router must automatically trigger a compensating transaction '
                       'rollback in the core ledger while transmitting a pacs.002 payment rejection notification back '
                       'to the originating banking node. Furthermore, in multi-tenant cloud microservices, audit '
                       'compliance standards such as SOC 2 and PCI-DSS mandate immutable security logs whenever an '
                       'unexpected branch is entered. A well-designed default branch records the calling user '
                       'identity, IP address, timestamp, and raw payload snippet to secure telemetry pipelines before '
                       'aborting execution. This guarantees that forensic incident response teams can reconstruct the '
                       'exact execution trace and diagnose whether an anomaly was caused by an upstream deployment '
                       'race condition, network payload corruption, or a deliberate injection attack. When evaluating '
                       'enums, modern IDEs and static analysis tools can inspect switch statements for exhaustiveness. '
                       'If an enum declares four constants and your switch only handles three without a default '
                       'branch, static linters issue a warning alerting you to the missing variant. In the next '
                       'section, we will see how Java 14+ switch expressions and Java 21 pattern matching elevate this '
                       'exhaustiveness requirement from an advisory static analysis check to a mandatory '
                       'compiler-enforced invariant.',
            'code': 'public class DefensiveSwitchLab {\n'
                    '    public enum PaymentStatus {\n'
                    '        INITIATED, PENDING_AUTHORIZATION, SETTLED, DECLINED, REFUNDED, FRAUD_HOLD\n'
                    '    }\n'
                    '\n'
                    '    public static String processTransaction(PaymentStatus status) {\n'
                    '        String auditMessage;\n'
                    '        switch (status) {\n'
                    '            case INITIATED:\n'
                    '                auditMessage = "Allocating ledger lock and dispatching gateway handshake.";\n'
                    '                break;\n'
                    '            case PENDING_AUTHORIZATION:\n'
                    '                auditMessage = "Awaiting two-factor biometric confirmation from user.";\n'
                    '                break;\n'
                    '            case SETTLED:\n'
                    '                auditMessage = "Funds cleared: Updating balance ledger and emitting receipt.";\n'
                    '                break;\n'
                    '            case DECLINED:\n'
                    '                auditMessage = "Transaction rejected by issuing bank: Releasing holds.";\n'
                    '                break;\n'
                    '            case REFUNDED:\n'
                    '                auditMessage = "Reversal verified: Crediting customer source account.";\n'
                    '                break;\n'
                    '            case FRAUD_HOLD:\n'
                    '                auditMessage = "Automated risk score exceeded: Freezing funds for compliance '
                    'audit.";\n'
                    '                break;\n'
                    '            default:\n'
                    '                // Defensive fail-fast guard: guarantees zero silent state loss!\n'
                    '                throw new IllegalStateException("FATAL: Unrecognized PaymentStatus variant '
                    'encountered: " + status);\n'
                    '        }\n'
                    '        return auditMessage;\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("Processing SETTLED: " + processTransaction(PaymentStatus.SETTLED));\n'
                    '        System.out.println("Processing FRAUD_HOLD: " + '
                    'processTransaction(PaymentStatus.FRAUD_HOLD));\n'
                    '    }\n'
                    '}',
            'checks': [{'question': 'What is the primary architectural purpose of a defensive default label in '
                                    'enterprise state routing?',
                        'options': ['To capture unexpected or unmapped input values, log diagnostic alerts, and fail '
                                    'fast via an exception',
                                    'To silently suppress errors and set all database records to null',
                                    'To force the JVM to reboot the underlying operating system container',
                                    'To bypass authentication tokens for administrative requests'],
                        'answer': 0,
                        'explanation': 'A defensive default block ensures that unexpected states never pass through '
                                       'silently, throwing an explicit exception to prevent orphaned transactions.'},
                       {'question': 'Why is placing the default label at the very end of a classic switch block '
                                    'considered an enterprise best practice?',
                        'options': ['It matches reader mental models and eliminates the risk of accidental fallthrough '
                                    'into subsequent cases',
                                    'The Java compiler throws a syntax error if default appears anywhere except line '
                                    '10',
                                    'The JVM runtime executes default first regardless of its physical position in '
                                    'code',
                                    'Placing default at the end automatically increases CPU thread priority'],
                        'answer': 0,
                        'explanation': 'Placing default at the end follows standard conventions and avoids the danger '
                                       'of execution unintentionally falling through into subsequent case labels.'},
                       {'question': 'What exception type is most idiomatic to throw inside a default block when an '
                                    'unhandled enum state is encountered?',
                        'options': ['IllegalStateException or IllegalArgumentException with the offending value in the '
                                    'message',
                                    'NullPointerException with an empty message body',
                                    'ArithmeticException indicating a division by zero',
                                    'ClassCastException targeting java.lang.Object'],
                        'answer': 0,
                        'explanation': 'IllegalStateException indicates an invalid system state, while '
                                       'IllegalArgumentException indicates an invalid input argument; both provide '
                                       'clear diagnostic context.'},
                       {'question': 'In a distributed microservice architecture, why is it dangerous to omit a default '
                                    'branch when switching over an enum?',
                        'options': ['Upstream services might be upgraded with new enum constants that the downstream '
                                    'service does not recognize',
                                    'The JVM garbage collector refuses to deallocate enums unless a default branch is '
                                    'present',
                                    'Enums lose their type identity when transmitted across HTTP network sockets',
                                    'Omitting default causes all integer variables in the JVM to be reset to 0'],
                        'answer': 0,
                        'explanation': 'Microservices evolve independently; if an upstream service sends a new enum '
                                       'value, a downstream service lacking default will silently skip processing.'}],
            'tryIt': "Try converting the colon-based switch statement to Java 14+ arrow syntax (case 1 -> 'Monday';)."},
           {'title': 'Modern Java Switch Expressions: Arrow Syntax, Yielding Values & Zero Fallthrough',
            'content': 'Recognizing that classic switch statements were verbose, error-prone due to fallthrough, and '
                       'incapable of directly returning values, the Java platform introduced Switch Expressions as a '
                       'permanent standard language feature in Java 14 (JEP 361). A switch expression transforms the '
                       'switch construct from a procedural statement (which merely executes side effects) into a '
                       'functional expression (which computes and evaluates to a single typed value). Switch '
                       "expressions introduce the arrow operator ('->') between the case label and the case body, "
                       'completely eliminating the concept of fallthrough! When execution enters a branch defined by '
                       "'case VALUE ->', only the expression or block on the right-hand side of the arrow is executed. "
                       'No break statement is required, and execution can never accidentally leak into subsequent '
                       'branches.\n'
                       '\n'
                       'Furthermore, switch expressions allow comma-separated case labels, dramatically streamlining '
                       "multi-value matching. Instead of stacking vertical case statements ('case 1: case 2: case "
                       '3:\'), an engineer can write \'case 1, 2, 3 -> "Result";\'. This drastically reduces '
                       'boilerplate while making business rules immediately readable. Because a switch expression '
                       'produces a value, it can be directly assigned to a variable, passed as an argument to a '
                       "method, or returned directly from an enclosing method body. For example: 'String message = "
                       'switch (statusCode) { case 200 -> "OK"; case 404 -> "Not Found"; default -> "Error"; };\'. '
                       'Notice that because the entire switch expression forms a single variable assignment statement, '
                       "it must conclude with a terminating semicolon (';') after its closing curly brace.\n"
                       '\n'
                       'Under the hood, the Java compiler handles switch expressions with remarkable elegance. Instead '
                       'of generating intermediate variables on the stack that require manual assignment, javac '
                       'compiles the switch expression to place the evaluated result directly onto the JVM operand '
                       'stack. If the switch is used in a return statement, the value on top of the operand stack is '
                       'returned immediately via the appropriate return bytecode (ireturn for integers, areturn for '
                       'reference objects), eliminating unnecessary local variable slots and memory copies. This '
                       'zero-allocation, register-friendly compilation strategy makes switch expressions just as fast '
                       'as hand-tuned low-level assembly jump tables, completely outperforming chained ternary '
                       'operators and dynamic map lookups.\n'
                       '\n'
                       'When a branch in a switch expression requires multi-line execution—such as performing '
                       'preliminary validation, logging metrics, or calculating intermediate results—the arrow can '
                       "point to a full block enclosed in curly braces '{ ... }'. Inside a multi-line switch block, "
                       "you cannot use the return keyword to produce the value for the switch, because 'return' would "
                       'immediately exit the entire enclosing method! Instead, Java 14 introduced the yield keyword. '
                       'The yield statement takes an expression, terminates the switch block, and produces that value '
                       'as the final evaluated result of the switch expression: \'case 500 -> { logger.error("Server '
                       'crash"); yield "Internal Server Error"; }\'. The language designers specifically selected '
                       "'yield' as a context-sensitive keyword rather than reusing 'break value' (which was trialed in "
                       'preview builds) to avoid syntactic ambiguity with labeled breaks in nested loops.\n'
                       '\n'
                       'Most importantly, switch expressions enforce strict compiler-level exhaustiveness! If you use '
                       'a switch expression, the Java compiler verifies that every possible value of the selector type '
                       'is covered. For primitive integers and strings (which have billions of possible permutations), '
                       "you MUST provide a default branch; omitting default results in a compile-time error: 'the "
                       "switch expression does not cover all possible input values'. Additionally, switch expressions "
                       'eliminate common refactoring bugs: because the compiler treats the entire construct as a '
                       'single cohesive unit, removing a case label or altering a returned type triggers immediate '
                       'type-checking errors across all branches simultaneously. For enums, if every declared enum '
                       'constant is explicitly matched in a case branch, the compiler allows you to omit default, '
                       'guaranteeing compile-time safety and total branch coverage across your enterprise codebase!',
            'code': 'public class SwitchExpressionLab {\n'
                    '    public enum GatewayProtocol {\n'
                    '        HTTP_REST, GRPC_PROTOBUF, GRAPHQL, WEBSOCKET, KAFKA_STREAM\n'
                    '    }\n'
                    '\n'
                    '    public static int resolveDefaultPort(GatewayProtocol protocol) {\n'
                    '        // Modern Switch Expression: Evaluates directly to an int value!\n'
                    '        return switch (protocol) {\n'
                    '            case HTTP_REST -> 8080;\n'
                    '            case GRPC_PROTOBUF -> 50051;\n'
                    '            case GRAPHQL -> 4000;\n'
                    '            case WEBSOCKET -> 8081;\n'
                    '            case KAFKA_STREAM -> {\n'
                    "                // Multi-line block: uses 'yield' to produce value without exiting method\n"
                    '                System.out.println("[Audit] Allocating high-throughput streaming port for '
                    'Kafka.");\n'
                    '                int basePort = 9090;\n'
                    '                int sslOffset = 2;\n'
                    '                yield basePort + sslOffset; // Produces 9092\n'
                    '            }\n'
                    '            // Exhaustive: all enum constants are covered, so no default is required!\n'
                    '        };\n'
                    '    }\n'
                    '\n'
                    '    public static String classifyDayModern(int day) {\n'
                    '        // Switch expression with comma-separated multi-label matching\n'
                    '        return switch (day) {\n'
                    '            case 1, 2, 3, 4, 5 -> "Weekday";\n'
                    '            case 6, 7 -> "Weekend";\n'
                    '            default -> "Unknown";\n'
                    '        };\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        System.out.println("REST Port: " + resolveDefaultPort(GatewayProtocol.HTTP_REST));\n'
                    '        System.out.println("Kafka Port: " + resolveDefaultPort(GatewayProtocol.KAFKA_STREAM));\n'
                    '        System.out.println("Day 1: " + classifyDayModern(1));\n'
                    '        System.out.println("Day 6: " + classifyDayModern(6));\n'
                    '        System.out.println("Day 99: " + classifyDayModern(99));\n'
                    '    }\n'
                    '}',
            'checks': [{'question': 'What happens to case fallthrough when using modern Java switch expressions with '
                                    'arrow syntax (case ->)?',
                        'options': ['Fallthrough is completely disabled; only the matched branch executes, and break '
                                    'is never required',
                                    'Fallthrough still occurs unless an explicit break statement is placed after the '
                                    'arrow',
                                    'Fallthrough is converted into an asynchronous background task on the ForkJoinPool',
                                    'The compiler forces the developer to write continue after every arrow'],
                        'answer': 0,
                        'explanation': 'Switch expressions using arrow syntax completely eliminate fallthrough. Only '
                                       'the targeted arrow branch executes, preventing accidental execution of '
                                       'following cases.'},
                       {'question': 'Inside a multi-line block within a switch expression, which keyword is used to '
                                    "produce the branch's evaluated result?",
                        'options': ['yield, which returns a value to the switch expression without exiting the '
                                    'enclosing method',
                                    'return, which produces the value and keeps the method active',
                                    'break, followed by the value in parentheses',
                                    'export, which binds the variable to heap storage'],
                        'answer': 0,
                        'explanation': 'The yield keyword was introduced in Java 14 specifically to yield a value from '
                                       'a multi-line switch block without returning from the outer method.'},
                       {'question': 'How are multiple matching values combined into a single case label in modern '
                                    'switch expressions?',
                        'options': ['By separating constants with commas on a single line (e.g., case 1, 2, 3 ->)',
                                    'By writing the pipe operator between values (e.g., case 1 | 2 | 3 ->)',
                                    'By nesting switch statements inside each case label',
                                    'By passing an array of integers to the case keyword'],
                        'answer': 0,
                        'explanation': 'Modern switch syntax supports comma-separated constants in a single case '
                                       'header, eliminating vertical label stacking.'},
                       {'question': 'What compiler error occurs if a switch expression over an integer lacks a default '
                                    'branch?',
                        'options': ["'the switch expression does not cover all possible input values' (Exhaustiveness "
                                    'error)',
                                    "'cannot find symbol: class default'",
                                    "'incompatible types: int cannot be converted to boolean'",
                                    'No error occurs; the compiler silently supplies null'],
                        'answer': 0,
                        'explanation': 'Switch expressions must be exhaustive. Because an int can hold 2^32 possible '
                                       'values, a default branch is mandatory at compile time.'}],
            'tryIt': 'Try using the yield keyword inside a multi-line arrow block to return a computed value from a '
                     'switch expression.'},
           {'title': 'Java 21 Pattern Matching for Switch: Type Patterns, Guarded When Clauses & Sealed Hierarchies',
            'content': 'The release of Java 21 marked a monumental evolution in the Java language with the official '
                       'finalization of Pattern Matching for Switch (JEP 441) and Record Patterns (JEP 440). '
                       'Historically, Java code that processed polymorphic object hierarchies was forced to rely on '
                       "cumbersome chains of 'if (obj instanceof String) { String s = (String) obj; ... } else if (obj "
                       "instanceof Integer) { ... }'. This idiom suffered from repetitive type tests, redundant "
                       'explicit casts, and total vulnerability to unhandled subclass variants. Pattern matching for '
                       'switch revolutionizes this paradigm by allowing case labels to specify type patterns directly, '
                       'automatically casting the variable into a local pattern identifier upon a successful match!\n'
                       '\n'
                       "With type pattern matching, an engineer can write 'case String s -> s.toUpperCase();' or 'case "
                       "Integer i -> i * 2;'. Inside the branch, the pattern variable 's' is already safely typed as a "
                       "String, and 'i' is typed as an Integer, with zero manual casting overhead! Furthermore, "
                       'pattern matching for switch solves the historical nuisance of NullPointerExceptions. In '
                       'classic switch statements, passing a null selector expression threw an immediate '
                       'NullPointerException before any case was evaluated. In modern Java, you can explicitly handle '
                       'null directly within the switch header via \'case null -> "Payload was null";\', or even '
                       'combine it with default: \'case null, default -> "Unrecognized or empty";\'.\n'
                       '\n'
                       'At the implementation level, the Java compiler achieves pattern matching through invokedynamic '
                       'call sites targeting the java.lang.runtime.SwitchBootstraps class. Rather than generating '
                       'dozens of inefficient sequential instanceof bytecodes, the JVM constructs an optimized '
                       'bootstrap linkage that dispatches type patterns and enum constants with high-performance '
                       'runtime caching. When paired with Java Record Patterns, switch cases can even deconstruct '
                       "complex nested object components inline: 'case Order(OrderId(String id), Customer(String name, "
                       "Email(String address))) -> dispatchOrder(id, address);'. This eliminates hundreds of lines of "
                       'defensive getter unwrapping code while guaranteeing complete type safety.\n'
                       '\n'
                       'To express sophisticated domain validation rules without polluting case bodies with nested '
                       'if-statements, Java 21 introduces Guarded Pattern Clauses using the when keyword. A guarded '
                       "pattern combines a type pattern with a boolean condition: 'case Transaction t when "
                       "t.getAmount() > 10000.0 -> flagLargeTransaction(t);'. The branch matches if and only if the "
                       "incoming object is an instance of Transaction AND the boolean predicate following 'when' "
                       'evaluates to true! The compiler strictly enforces pattern dominance: broader or more general '
                       "patterns must appear AFTER more specific guarded patterns. If you place 'case Transaction t "
                       "->' before 'case Transaction t when t.isUrgent() ->', the compiler will reject the code with a "
                       "'pattern is dominated by a previous pattern' error, because the unguarded case would intercept "
                       'all objects before the guarded case could ever be reached.\n'
                       '\n'
                       'Finally, pattern matching for switch reaches its architectural pinnacle when paired with '
                       'Sealed Interfaces (introduced in Java 17). A sealed interface explicitly enumerates its '
                       "permitted implementing subclasses via the 'permits' keyword (e.g., 'sealed interface "
                       "OrderStatus permits Placed, Shipped, Delivered, Cancelled'). When an engineer switches over a "
                       'sealed hierarchy, the Java compiler knows the complete, immutable set of all possible concrete '
                       'implementations! If your switch expression provides a case for Placed, Shipped, Delivered, and '
                       'Cancelled, the compiler verifies that all cases are covered and allows you to omit the default '
                       "branch entirely! If a future engineer adds a 'Returned' record to the sealed interface, all "
                       'switch expressions across the entire enterprise codebase will immediately fail compilation at '
                       'build time, pointing engineers directly to every single router that requires updating! This '
                       'achieves absolute mathematical domain exhaustiveness, eliminating entire categories of runtime '
                       'bugs in high-velocity microservice platforms.',
            'code': 'public class PatternMatchingSwitchLab {\n'
                    '    // Sealed domain hierarchy: strictly limits possible subtypes!\n'
                    '    public sealed interface DomainEvent permits UserRegistered, PaymentProcessed, OrderCancelled '
                    '{}\n'
                    '\n'
                    '    public record UserRegistered(String userId, String email) implements DomainEvent {}\n'
                    '    public record PaymentProcessed(String transactionId, double amount, boolean isFraudSuspect) '
                    'implements DomainEvent {}\n'
                    '    public record OrderCancelled(String orderId, String reason) implements DomainEvent {}\n'
                    '\n'
                    '    public static String dispatchEvent(DomainEvent event) {\n'
                    '        // Java 21 Pattern Matching for switch: type patterns, guarded when clauses, sealed '
                    'exhaustiveness!\n'
                    '        return switch (event) {\n'
                    '            case null -> "Ignored: Null event payload received.";\n'
                    '            case UserRegistered u -> "Welcome notification dispatched to: " + u.email();\n'
                    '            case PaymentProcessed p when p.isFraudSuspect() -> \n'
                    '                "SECURITY ALERT: Fraud hold placed on tx: " + p.transactionId() + " for $" + '
                    'p.amount();\n'
                    '            case PaymentProcessed p -> \n'
                    '                "Settlement cleared for tx: " + p.transactionId() + " in the amount of $" + '
                    'p.amount();\n'
                    '            case OrderCancelled o -> \n'
                    '                "Inventory restocked for order: " + o.orderId() + " Reason: " + o.reason();\n'
                    '            // Zero default branch needed! The sealed interface guarantees compile-time '
                    'exhaustiveness!\n'
                    '        };\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        DomainEvent e1 = new UserRegistered("U-101", "dev@enterprise.com");\n'
                    '        DomainEvent e2 = new PaymentProcessed("TX-999", 15000.0, true);\n'
                    '        DomainEvent e3 = new PaymentProcessed("TX-100", 450.0, false);\n'
                    '        DomainEvent e4 = new OrderCancelled("ORD-55", "Customer duplicate request");\n'
                    '\n'
                    '        System.out.println(dispatchEvent(e1));\n'
                    '        System.out.println(dispatchEvent(e2));\n'
                    '        System.out.println(dispatchEvent(e3));\n'
                    '        System.out.println(dispatchEvent(e4));\n'
                    '        System.out.println(dispatchEvent(null));\n'
                    '    }\n'
                    '}',
            'checks': [{'question': 'What is the primary benefit of Java 21 pattern matching for switch over '
                                    'traditional instanceof cascading ladders?',
                        'options': ['It matches object types directly, binds them to typed pattern variables without '
                                    'explicit casting, and enforces exhaustiveness',
                                    'It runs each branch in a separate native operating system thread concurrently',
                                    'It converts Java source code into raw GPU machine instructions',
                                    'It automatically encrypts heap objects using AES-256 keys'],
                        'answer': 0,
                        'explanation': 'Type patterns match the object type and automatically bind a casted variable '
                                       'in one atomic, type-safe operation, eliminating tedious manual casting.'},
                       {'question': 'What keyword is used in Java 21 switch case labels to specify a conditional guard '
                                    'clause?',
                        'options': ["when, as in 'case Transaction t when t.getAmount() > 1000 ->'",
                                    "if, as in 'case Transaction t if t.getAmount() > 1000 ->'",
                                    "where, as in 'case Transaction t where t.getAmount() > 1000 ->'",
                                    "guard, as in 'case Transaction t guard t.getAmount() > 1000 ->'"],
                        'answer': 0,
                        'explanation': "Java 21 uses the 'when' keyword to declare guard expressions on pattern "
                                       "matching cases, replacing the preview-era '&&' operator."},
                       {'question': 'What happens if a developer places an unguarded broad type pattern (e.g. case '
                                    'Number n) before a specific pattern (e.g. case Integer i)?',
                        'options': ['The compiler rejects the code with a pattern dominance error because the first '
                                    'pattern intercepts all matches',
                                    'The JVM dynamically prioritizes the more specific pattern at runtime',
                                    'Both branches execute in sequence using automatic fallthrough',
                                    'The Integer case is executed in a background daemon thread'],
                        'answer': 0,
                        'explanation': 'The compiler checks pattern dominance: an earlier broader pattern will '
                                       'dominate and shadow subsequent sub-patterns, resulting in a compilation '
                                       'error.'},
                       {'question': 'Why does a switch expression over a sealed interface hierarchy not require a '
                                    'default branch?',
                        'options': ['The compiler knows every permitted subtype at build time; if all permitted types '
                                    'are handled, the switch is provably exhaustive',
                                    'Sealed interfaces automatically convert missing subclasses into null values',
                                    'The JVM automatically generates stub bytecode classes for unhandled cases at '
                                    'runtime',
                                    'Default branches are prohibited in all Java 21 switch statements'],
                        'answer': 0,
                        'explanation': 'Sealed interfaces define an immutable, closed set of subtypes known to the '
                                       'compiler, enabling mathematical proof of exhaustiveness without a default '
                                       'clause.'}],
            'tryIt': 'Try passing an unhandled integer (e.g. 99) to getDayName and verify that the default branch '
                     "returns 'Unknown'."}],
 'summary': ['Classic switch statements compare a selector against constant case labels, compiling into O(1) '
             'tableswitch or O(log n) lookupswitch bytecodes.',
             'Classic switch cases fall through by default; terminating break or return statements are required to '
             'prevent unintentional cascading execution.',
             "Switch expressions (Java 14+) utilize arrow syntax ('case ->') to eliminate fallthrough, support "
             'comma-separated labels, and directly evaluate to typed values.',
             "Multi-line switch expression blocks use the 'yield' keyword to produce values without exiting the "
             'enclosing method scope.',
             'Defensive programming requires exhaustiveness: primitive and String switch expressions require default '
             'guards, while sealed hierarchies permit compiler-proven exhaustiveness.',
             "Java 21 Pattern Matching for switch introduces type patterns, explicit 'case null' handling, and guarded "
             "'when' clauses, eliminating manual casting ladders."],
 'projectStep': {'title': 'Build a Resilient Multi-Protocol Gateway Router',
                 'steps': ['Implement a classic switch routing method comparing integer status codes and validating '
                           'fallthrough prevention with break.',
                           'Refactor day name resolution into a modern Java 14+ switch expression using arrow syntax '
                           'and comma-separated labels.',
                           'Implement a multi-line switch block utilizing the yield keyword to compute dynamic port '
                           'offsets with logging.',
                           'Author a sealed domain hierarchy representing financial transactions and dispatch events '
                           'using Java 21 pattern matching with guarded when clauses.',
                           'Verify complete compiler exhaustiveness without requiring redundant default fallback '
                           'clauses.']}}
