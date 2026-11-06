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

DAY_4 = {
  "day": 4,
  "title": "Arithmetic Algorithms, Modulo Arithmetic & Computational Logic",
  "goal": "Master algorithm design with mathematical primitives: remainder arithmetic with the modulo operator (%), even/odd parity partitioning, circular buffer wrapping, floating-point precision caveats with double, and the java.lang.Math utility library.",
  "minutes": 38,
  "recap": "In Day 3, we mastered arithmetic operators, operator precedence trees, string concatenation, and type casting. Today, we advance into foundational algorithm engineering: remainder math with the modulo operator, circular queue wrapping, IEEE 754 precision caveats, and building an enterprise expense and tip calculation engine.",
  "summary": [
    "The modulo operator (%) computes the integer remainder of division and forms the basis for cyclic indexing and parity tests.",
    "An integer n is even if n % 2 == 0; negative integers require careful handling because in Java the remainder retains the dividend's sign.",
    "IEEE 754 floating-point arithmetic (double) cannot represent all base-10 fractions exactly, requiring tolerance comparisons or BigDecimal in financial domains.",
    "The java.lang.Math class provides static numerical algorithms including abs, max, min, pow, and round."
  ],
  "projectStep": {
    "title": "Implement Resilient Expense Allocation & Modulo Parity Algorithms",
    "tasks": [
      "Author calculatePerPerson method computing total bill with tip divided across party size",
      "Author isEven predicate utilizing the modulo remainder operator",
      "Verify mathematical boundary cases including zero remainder and floating-point divisions",
      "Confirm test assertions pass across multiple party and tip configurations"
    ]
  },
  "parts": [
    {
      "title": "The Modulo Operator (%): Remainder Invariants & Cyclic Indexing",
      "say": [
        "In enterprise software engineering, many computational problems require cyclical repetition rather than infinite linear progression. For example, when rotating worker threads across a fixed thread pool, assigning web requests across a cluster of server nodes using round-robin load balancing, or converting total elapsed seconds into minutes and hours, you need an operation that wraps numbers back into a bounded range. In computer science and mathematics, this operation is remainder arithmetic, powered in Java by the modulo operator (%).",
        "The modulo operator—represented by the percent sign (%)—evaluates the remainder left over after dividing one integer by another. For example, evaluating 7 % 3 yields 1, because 3 goes into 7 exactly twice (producing 6), with 1 remaining as the integer residue. Similarly, 10 % 4 yields 2, and 12 % 4 yields 0 because 4 divides 12 evenly with zero remainder. When the remainder is zero, it proves that the left operand is an exact multiple of the right operand.",
        "A profound architectural property of the modulo operator is its ability to constrain numbers within a fixed interval: [0, divisor - 1]. If you calculate number % 5 for any positive integer from zero to infinity, the result will always cycle strictly through the integers 0, 1, 2, 3, 4, and then immediately wrap back to 0. This cyclic behavior is known as modular arithmetic or clock arithmetic. Just as a 12-hour analog clock wraps from 12 back to 1 (because 13 % 12 is 1), modulo wraps programmatic counters within array boundaries.",
        "In high-throughput systems, circular buffers (ring buffers) rely entirely on this cyclic indexing invariant. For example, in the LMAX Disruptor architecture—used by high-frequency foreign exchange trading engines to process millions of transactions per second—events are placed into a fixed-size array of capacity N. The index for placing each event is computed as sequenceNumber % N. As the sequence number climbs into the billions, sequenceNumber % N deterministically maps every transaction to a valid slot inside the array without requiring expensive bounds-checking conditional branches.",
        "Furthermore, high-performance runtime libraries—including java.util.HashMap—exploit a brilliant mathematical optimization when the divisor is a power of 2. In binary arithmetic, if capacity is a power of 2 (such as 16, 64, or 1024), computing n % capacity is mathematically identical to computing the bitwise AND: n & (capacity - 1). Because bitwise AND executes in a single CPU clock cycle while integer division requires up to 20 to 30 CPU cycles, HotSpot JVM compilers automatically replace modulo operations with bitwise masks whenever capacity powers of two are provable at compile time.",
        "However, Java's modulo operator possesses a critical algebraic rule that every senior backend engineer must know: the sign of the result is always determined by the sign of the left-hand dividend, not the divisor. In Java, evaluating -7 % 3 yields -1, not +2! Many mathematical definitions of modulo produce non-negative remainders, but in Java, the remainder operator follows the truncating integer division rule: (a / b) * b + (a % b) == a. If your algorithm requires a strictly non-negative cyclic index when handling negative inputs, you must adjust the equation: ((n % m) + m) % m or utilize Math.floorMod(n, m).",
        "For slow and methodical readers, visualize modulo as measuring water into equal buckets: if you have 7 cups of water and your buckets hold 3 cups each, you fill 2 complete buckets and have 1 cup left over in your measuring pitcher. That leftover 1 cup is the modulo. For fast readers, remember: a % b yields the division remainder; positive modulo cycles strictly in [0, b - 1]; in Java, the remainder inherits the dividend's sign; and circular indexing uses Math.floorMod for guaranteed positive bounds."
      ],
      "example": "Think of the modulo operator as the second hand on an analog watch. Every 60 seconds, the second hand reaches the top and starts over at 0 (seconds % 60). Even if 10,000 seconds pass, the second hand can never point to 61—it cycles endlessly between 0 and 59.",
      "code": "// Java Modulo Cyclic Indexing & Ring Buffer Simulator\nclass ModuloRingBufferSimulator {\n  distributeLoad(totalRequests: number, workerNodes: number): number[] {\n    const nodeDistribution: number[] = new Array(workerNodes).fill(0);\n    \n    // Distribute incoming requests using round-robin modulo indexing\n    for (let reqId = 0; reqId < totalRequests; reqId++) {\n      const targetNode = reqId % workerNodes;\n      nodeDistribution[targetNode]++;\n    }\n    return nodeDistribution;\n  }\n}\n\nconst sim = new ModuloRingBufferSimulator();\nconst cluster = sim.distributeLoad(10, 3);\nconsole.log(`Modulo Load Balancing (10 requests across 3 nodes):`);\ncluster.forEach((count, node) => {\n  console.log(`  Node ${node}: ${count} requests`);\n});\nconsole.log(`Sign Invariant: (-7 % 3 in Java) = ${(-7 % 3)}`);",
      "output": "Modulo Load Balancing (10 requests across 3 nodes):\n  Node 0: 4 requests\n  Node 1: 3 requests\n  Node 2: 3 requests\nSign Invariant: (-7 % 3 in Java) = -1",
      "codeNotes": [
        { "line": 8, "note": "reqId % workerNodes maps any positive integer into valid array index range" },
        { "line": 16, "note": "Evenly distributes 10 requests: node 0 gets 4, nodes 1 and 2 get 3 each" },
        { "line": 19, "note": "Demonstrates Java remainder sign inheritance from negative dividend" }
      ],
      "tryIt": "Compute 14 % 5 and 15 % 5: observe that 14 % 5 yields 4 while 15 % 5 yields 0.",
      "check": make_check(
        "What is the result of evaluating '17 % 5' in Java?",
        "2 (5 goes into 17 three times with 2 remaining)",
        "3 (17 divided by 5 is 3.4)",
        "0 (17 divides evenly)",
        "5 (the divisor is returned)",
        "The integer 5 divides into 17 three times (producing 15), leaving a remainder of 2."
      )
    },
    {
      "title": "Even/Odd Parity Partitioning & Mathematical Boundary Invariants",
      "say": [
        "One of the most frequent foundational algorithmic tasks in software engineering is determining the parity of an integer—specifically, whether a number is even or odd. Parity testing appears throughout computer science: in striped UI tables that alternate row background colors for readability, in sharding algorithms that divide database keys across two data centers, in round-based game engines, and in cryptographic error-detection algorithms like parity bits.",
        "In mathematical terms, an integer n is classified as even if it is divisible by 2 with zero remainder; conversely, it is classified as odd if dividing by 2 leaves a remainder. In Java, this mathematical relationship translates directly into a clean boolean expression using the modulo operator: n % 2 == 0. If n % 2 evaluates to 0, the number is guaranteed to be even; if n % 2 does not equal 0, the number is odd.",
        "However, writing a robust parity checking algorithm in production software requires addressing a critical edge case that trips up countless engineers: negative numbers. Many developers write the check as: public static boolean isOdd(int n) { return n % 2 == 1; }. While this code works flawlessly for positive numbers like 1, 3, and 5, it fails catastrophically for negative odd numbers like -1, -3, or -5! Why? Because, as we mastered in Part 1, the Java remainder operator inherits the sign of the dividend. For -3, evaluating -3 % 2 yields -1, not 1! Therefore, -3 % 2 == 1 evaluates to false, incorrectly reporting that -3 is not odd.",
        "To write a bulletproof even/odd predicate, experienced Java engineers use one of two robust patterns. Pattern 1 tests for evenness directly: public static boolean isEven(int n) { return n % 2 == 0; }. Because zero has no sign (+0 and -0 are identical in two's complement integers), n % 2 == 0 correctly returns true for both positive and negative even numbers (-4, -2, 0, 2, 4) and false for all odd numbers. If you need to test for oddness, you write: public static boolean isOdd(int n) { return n % 2 != 0; }, which safely handles both +1 and -1 remainders.",
        "Pattern 2 leverages low-level bitwise operations. In binary representation, all even numbers end with a least-significant bit of 0, while all odd numbers end with a least-significant bit of 1. By applying the bitwise AND operator with mask 1—(n & 1) == 0—you extract the lowest bit directly. Bitwise operations execute in a single CPU clock cycle and operate identically across positive and negative numbers in two's complement representation, making it a favorite optimization in high-performance computing libraries.",
        "Testing parity functions thoroughly requires designing exhaustive boundary test suites. Senior QA automation engineers test extreme integers including Integer.MIN_VALUE (-2,147,483,648), -1, 0, 1, and Integer.MAX_VALUE (2,147,483,647). A legendary boundary quirk in Java is that Math.abs(Integer.MIN_VALUE) actually returns Integer.MIN_VALUE as a negative number! Because two's complement representation has one more negative number than positive numbers, the positive equivalent of -2,147,483,648 cannot fit in a 32-bit signed int, silently overflowing back to negative. Understanding these edge cases ensures your arithmetic algorithms never produce unexpected behavior in production.",
        "For slow and methodical readers: remember that an even number divided by 2 has zero remainder. Always write return n % 2 == 0; for isEven, and return n % 2 != 0; for isOdd. Never compare against positive 1 unless you are 100% certain the input can never be negative. For fast readers, lock in the parity rules: n % 2 == 0 is safe across all integer signs; n % 2 == 1 fails on negative odd numbers; and (n & 1) == 0 provides ultra-fast bitwise parity extraction."
      ],
      "example": "Think of dividing a group of students into pairs. If everyone has an exact partner with zero people standing alone (remainder == 0), the group count is even. If one student is left standing alone without a partner, the group count is odd.",
      "code": "// Java Parity Checking & Negative Integer Boundary Simulator\nclass ParityAlgorithmSimulator {\n  isEven(n: number): boolean {\n    // Safe parity check: works identically for positive, negative, and zero\n    return n % 2 === 0;\n  }\n\n  isOddBuggy(n: number): boolean {\n    // Buggy implementation: fails on negative odd numbers\n    return n % 2 === 1;\n  }\n\n  isOddFixed(n: number): boolean {\n    // Robust implementation: handles both +1 and -1 remainders\n    return n % 2 !== 0;\n  }\n}\n\nconst parity = new ParityAlgorithmSimulator();\nconsole.log(`isEven(4):  ${parity.isEven(4)}  (Expected: true)`);\nconsole.log(`isEven(7):  ${parity.isEven(7)}  (Expected: false)`);\nconsole.log(`isEven(0):  ${parity.isEven(0)}  (Expected: true)`);\nconsole.log(`isEven(-3): ${parity.isEven(-3)} (Expected: false)`);\nconsole.log(`isOddBuggy(-3): ${parity.isOddBuggy(-3)} (BROKEN: yields false because -3 % 2 is -1)`);\nconsole.log(`isOddFixed(-3): ${parity.isOddFixed(-3)} (CORRECT: yields true via n % 2 !== 0)`);",
      "output": "isEven(4):  true  (Expected: true)\nisEven(7):  false  (Expected: false)\nisEven(0):  true  (Expected: true)\nisEven(-3): false (Expected: false)\nisOddBuggy(-3): false (BROKEN: yields false because -3 % 2 is -1)\nisOddFixed(-3): true (CORRECT: yields true via n % 2 !== 0)",
      "codeNotes": [
        { "line": 4, "note": "n % 2 === 0 correctly handles positive, negative, and zero inputs" },
        { "line": 9, "note": "Buggy pattern fails because negative odd modulo yields -1" },
        { "line": 14, "note": "n % 2 !== 0 safely captures both positive and negative odd numbers" }
      ],
      "tryIt": "Verify that isEven(0) returns true, satisfying the mathematical invariant that zero is an even integer.",
      "check": make_check(
        "Why is 'return n % 2 != 0;' preferred over 'return n % 2 == 1;' when checking if an integer is odd?",
        "Because for negative odd integers (like -3), n % 2 evaluates to -1 in Java, causing n % 2 == 1 to incorrectly return false",
        "Because Java does not support comparing numbers with the equal operator",
        "Because the number 1 is not a valid integer literal in modern Java",
        "Because the compiler refuses to optimize expressions containing the digit 1",
        "In Java, the modulo operator retains the sign of the dividend. For negative odd numbers, n % 2 evaluates to -1. Testing n % 2 != 0 correctly identifies all odd numbers regardless of sign."
      )
    },
    {
      "title": "Floating-Point Precision Caveats: IEEE 754 Representation & Financial Rounding",
      "say": [
        "In commercial software development, handling decimal numbers—such as invoice totals, product prices, transaction fees, and account interest—is an everyday requirement. In Java, decimal numbers default to the 64-bit primitive type double. While double is fast, versatile, and ideal for scientific computations, physics engines, and graphics simulations, it carries a deep mathematical idiosyncrasy that every backend engineer must master: binary floating-point representation error.",
        "Computers operate entirely in binary (base-2), using combinations of 0s and 1s. In our human decimal system (base-10), fractions whose denominators are prime factors of 10 (2 and 5) can be represented cleanly with finite decimal places: 1/2 is 0.5, and 1/5 is 0.2. However, a fraction like 1/3 cannot be represented with finite decimal digits in base-10; it repeats endlessly as 0.333333... Similarly, in binary base-2, the only fractional denominators that can be represented cleanly with finite bits are powers of 2 (such as 1/2, 1/4, 1/8, 1/16).",
        "Fractions like 1/10 (0.1) or 2/10 (0.2) have denominators with a factor of 5, which cannot be represented with finite bits in binary! In binary, 0.1 repeats endlessly: 0.0001100110011... Because a double has a finite capacity of 64 bits (governed by the IEEE 754 standard: 1 sign bit, 11 exponent bits, and 52 mantissa bits), the number must be rounded off at the 52nd bit. As a result, writing double sum = 0.1 + 0.2; in Java does not produce 0.3; it produces: 0.30000000000000004!",
        "This microscopic precision anomaly has profound consequences for program logic. If you write if (sum == 0.3), the condition evaluates to false, even though mathematically it seems it should be true. If this check governs whether an automated payment ledger reconciles or an e-commerce checkout approves, your application will fail with mysterious, hard-to-reproduce bugs. You should never compare floating-point primitives using exact equality (==).",
        "In unit testing and scientific algorithms, floating-point comparisons must always be conducted using a tolerance threshold, commonly referred to in engineering as epsilon (ε). Instead of testing if (a == b), you test whether the absolute difference between the two numbers is smaller than an acceptable tolerance: if (Math.abs(a - b) < 0.0001). This pattern is why Java unit tests and coding judges evaluate floating-point results with delta thresholds (such as Math.abs(result - 60.0) < 0.001 in our Day 4 Challenge test).",
        "Additionally, Java provides the Double.compare(d1, d2) static method to establish a total ordering across floating-point values. Standard relational operators (<, ==, >) struggle with special floating-point values: for instance, Double.NaN == Double.NaN evaluates to false, because by IEEE 754 definition, NaN is never equal to anything, including itself! To check for NaN, you must invoke Double.isNaN(value). Furthermore, Double.compare treats -0.0 as strictly less than +0.0, and considers Double.NaN equal to itself, providing deterministic sorting behavior in collections.",
        "For financial systems where penny-exact accounting is legally mandated (such as banks, payroll, and stock exchanges), engineers never use double or float. Instead, they use java.math.BigDecimal, which represents numbers in arbitrary-precision decimal format, or they store financial amounts entirely as integer cents (such as $10.50 stored as int cents = 1050;). Furthermore, regulatory bodies require Banker's Rounding (RoundingMode.HALF_EVEN), which rounds to the nearest even number on tiebreaks, eliminating systematic upward statistical bias across millions of transactions.",
        "For slow readers, remember: computers do math in binary, so decimals like 0.1 + 0.2 have tiny rounding leftovers; always compare decimals with Math.abs(a - b) < epsilon. For fast readers, lock in the IEEE 754 rules: binary mantissa truncation causes rounding errors, exact == on double is an anti-pattern, and finance requires BigDecimal or integer cents."
      ],
      "example": "Think of trying to pay someone exactly one-third of a dollar using physical coins. You can give them 33 cents, but you are still missing one-third of a penny. No matter how many pennies you use, physical coins cannot represent 1/3 cleanly. Binary floating-point has the exact same problem with numbers like 0.1 and 0.2.",
      "code": "// IEEE 754 Floating-Point Precision & Epsilon Comparison Simulator\nclass FloatingPointSimulator {\n  demonstratePrecisionAnomaly(): {\n    rawSum: number;\n    exactEquality: boolean;\n    epsilonEquality: boolean;\n  } {\n    const a = 0.1;\n    const b = 0.2;\n    const sum = a + b; // 0.30000000000000004 in IEEE 754\n    \n    const exactEquality = (sum === 0.3);\n    const epsilon = 0.0001;\n    const epsilonEquality = Math.abs(sum - 0.3) < epsilon;\n    \n    return { rawSum: sum, exactEquality, epsilonEquality };\n  }\n}\n\nconst floatSim = new FloatingPointSimulator();\nconst results = floatSim.demonstratePrecisionAnomaly();\nconsole.log(`Evaluated 0.1 + 0.2:            ${results.rawSum}`);\nconsole.log(`Exact Equality (sum == 0.3):    ${results.exactEquality} (BROKEN)`);\nconsole.log(`Epsilon Check (abs(diff) < eps): ${results.epsilonEquality} (CORRECT)`);",
      "output": "Evaluated 0.1 + 0.2:            0.30000000000000004\nExact Equality (sum == 0.3):    false (BROKEN)\nEpsilon Check (abs(diff) < eps): true (CORRECT)",
      "codeNotes": [
        { "line": 8, "note": "0.1 + 0.2 produces microscopic precision artifact 0.30000000000000004" },
        { "line": 10, "note": "Direct equality comparison (==) fails unexpectedly on floating-point values" },
        { "line": 12, "note": "Tolerance comparison using Math.abs delta reliably confirms equivalence" }
      ],
      "tryIt": "Compute Math.abs(100.0 * 0.2 - 20.0) < 0.001 to confirm that tolerance checking passes for billing computations.",
      "check": make_check(
        "Why is testing 'doubleSum == 0.3' considered an engineering anti-pattern in Java?",
        "Because binary IEEE 754 floating-point representation cannot store 0.1 and 0.2 exactly, resulting in 0.30000000000000004",
        "Because Java does not permit the double equals (==) operator on decimal numbers",
        "Because double numbers are automatically rounded to the nearest integer before comparison",
        "Because 0.3 is an invalid floating-point literal in Java",
        "Due to base-2 binary floating-point representation in IEEE 754, fractions like 0.1 and 0.2 contain infinite repeating bits that cause slight rounding artifacts, making direct == comparisons unreliable."
      )
    },
    {
      "title": "The java.lang.Math Utility Engine: abs, max, min, pow & Mathematical Constants",
      "say": [
        "While basic arithmetic operators (+, -, *, /, %) cover primary numerical calculations, advanced application engineering requires access to standard mathematical functions such as calculating powers, taking square roots, finding extremes between values, and computing absolute distances. In Java, these essential algorithms are provided by the standard java.lang.Math utility class. Like the System and String classes, java.lang.Math is automatically imported into every Java source file, making its functions universally available without import overhead.",
        "The java.lang.Math class is designed as a utility class with private constructors, meaning it cannot be instantiated with the new operator. All of its methods and constants are declared as public static, meaning you invoke them directly on the class name: Math.methodName(arguments). Furthermore, Math exposes two fundamental mathematical constants: Math.PI (the ratio of a circle's circumference to its diameter, approximately 3.141592653589793) and Math.E (the base of the natural logarithms, approximately 2.718281828459045).",
        "Let us examine the four most widely used static methods in enterprise development. First is Math.abs(). The abs method computes the absolute value of a number, stripping any negative sign and returning its positive magnitude. For example, Math.abs(-15.5) yields 15.5, and Math.abs(42) yields 42. As we explored in Part 3, Math.abs is the standard tool for delta threshold comparisons in floating-point unit tests: Math.abs(actual - expected) < tolerance.",
        "Second and third are Math.max() and Math.min(). These overloaded methods take two numbers and return the larger or smaller value, respectively. For example, Math.max(10, 25) yields 25, while Math.min(10, 25) yields 10. In backend systems, Math.min and Math.max are frequently combined to clamp values within bounded operational ranges. For instance, to ensure a user's discount percentage never drops below 0% and never exceeds 50%, an engineer writes: double clamped = Math.max(0.0, Math.min(discount, 0.50));. This single line cleanly replaces complex nested if-else ladders.",
        "Fourth is Math.pow(). The pow method calculates exponentiation: Math.pow(base, exponent) raises the base to the specified power, returning a double. For example, Math.pow(2, 3) computes 2 cubed, yielding 8.0. For square roots, Math provides Math.sqrt(value), such as Math.sqrt(16.0) yielding 4.0. Additionally, Math provides three distinct rounding methods: Math.floor() rounds down toward negative infinity, Math.ceil() rounds up toward positive infinity, and Math.round() rounds to the nearest whole integer.",
        "In addition to basic algebra, java.lang.Math provides a complete suite of trigonometric and logarithmic functions, including Math.sin(), Math.cos(), Math.tan(), Math.log(), and Math.log10(). When generating pseudorandom numbers for simulations, Math.random() returns a pseudorandom double greater than or equal to 0.0 and less than 1.0. In multithreaded enterprise architectures, high-concurrency systems replace Math.random() with java.util.concurrent.ThreadLocalRandom to eliminate lock contention on shared random seeds.",
        "Under the hood, modern 64-bit HotSpot JVM compilers translate calls to java.lang.Math methods into hardware-accelerated CPU instructions called intrinsics. For instance, when your code invokes Math.sqrt() or Math.min(), the JIT compiler does not perform a normal function call frame dispatch; instead, it emits direct x86 SSE/AVX vector assembly instructions (such as SQRTSD or MINSD), executing complex mathematical operations in a fraction of a nanosecond.",
        "For geometric calculations, java.lang.Math provides specialized numerical algorithms designed to prevent intermediate arithmetic overflow. A prime example is Math.hypot(x, y), which computes the hypotenuse sqrt(x^2 + y^2) without causing intermediate overflow if x or y is near Double.MAX_VALUE. Calling Math.hypot protects coordinate geometry algorithms in graphics and physics engines from crashing on extreme spatial dimensions.",
        "For slow and methodical readers, remember that Math is your built-in scientific calculator: call Math.abs() for positive distances, Math.max() for upper bounds, Math.min() for lower bounds, and Math.pow() for exponents. For fast readers, lock in the architecture: Math is an uninstantiable utility class of pure static functions, Math.PI and Math.E provide high-precision constants, and combining max/min provides elegant numerical clamping."
      ],
      "example": "Think of java.lang.Math as a high-precision Swiss Army knife in your tool belt. You do not need to build a new knife every time you need to measure an angle or cut a wire; the knife is already manufactured, permanently sharpened, and ready to use whenever you call its name.",
      "code": "// java.lang.Math Static Utility Simulator\nclass MathUtilitySimulator {\n  demonstrateMathUtilities(): {\n    absVal: number;\n    clamped: number;\n    powerVal: number;\n    sqrtVal: number;\n  } {\n    const absVal = Math.abs(-42.75);\n    \n    // Clamping simulation: enforce range [0.0 .. 50.0]\n    const rawDiscount = 75.0;\n    const clamped = Math.max(0.0, Math.min(rawDiscount, 50.0));\n    \n    const powerVal = Math.pow(2, 8); // 2^8 = 256\n    const sqrtVal = Math.sqrt(144);  // sqrt(144) = 12\n    \n    return { absVal, clamped, powerVal, sqrtVal };\n  }\n}\n\nconst mathSim = new MathUtilitySimulator();\nconst res = mathSim.demonstrateMathUtilities();\nconsole.log(`Math.abs(-42.75):           ${res.absVal}`);\nconsole.log(`Clamped Discount (75 -> 50): ${res.clamped}`);\nconsole.log(`Math.pow(2, 8):             ${res.powerVal}`);\nconsole.log(`Math.sqrt(144):             ${res.sqrtVal}`);",
      "output": "Math.abs(-42.75):           42.75\nClamped Discount (75 -> 50): 50\nMath.pow(2, 8):             256\nMath.sqrt(144):             12",
      "codeNotes": [
        { "line": 8, "note": "Math.abs converts negative magnitude into positive distance" },
        { "line": 12, "note": "Nested Math.max and Math.min clamp values within safe thresholds" },
        { "line": 14, "note": "Math.pow evaluates exponential growth formulas" }
      ],
      "tryIt": "Compute Math.max(15, 28) and Math.min(15, 28) to verify extreme boundary selection.",
      "check": make_check(
        "Which java.lang.Math method is used to compute the non-negative magnitude of a negative number?",
        "Math.abs()",
        "Math.ceil()",
        "Math.max()",
        "Math.pow()",
        "The Math.abs() method computes the absolute value, stripping negative signs to return the positive magnitude."
      )
    },
    {
      "title": "Real-World Algorithm: Multi-Party Expense & Tip Division Engine",
      "say": [
        "Now that we have mastered arithmetic operations, operator precedence, type promotion, and mathematical utilities, let us synthesize these concepts into a production-grade algorithmic function: a multi-party expense and tip allocation engine. In consumer fintech applications like Splitwise, Venmo, Uber, and point-of-sale restaurant terminals, calculating fair bill shares with percentage tips is a core feature that touches millions of users daily.",
        "Let us examine the problem statement for our Day 4 Challenge: author a method calculatePerPerson(double bill, double tipPercent, int people) in public class Solution. The method takes three inputs: the base bill amount as a double (such as 100.0), the tip percentage represented as a decimal fraction (such as 0.20 for 20%), and the total number of people splitting the expense as an int (such as 2). The method must calculate the total bill including tip, divide that sum equally among the party members, and return the exact per-person share as a double.",
        "Let us trace the mathematical and systems architecture of this calculation. Step 1 is computing the tip amount: double tipAmount = bill * tipPercent;. Because bill and tipPercent are both double primitives, multiplication executes with 64-bit floating-point precision. For a $100 bill with a 0.20 tip, tipAmount evaluates to 20.0.",
        "Step 2 is computing the gross total: double totalBill = bill + tipAmount;, or equivalently: double totalBill = bill + (bill * tipPercent);. Notice how parentheses explicitly group the multiplication, guaranteeing that the tip is computed first before addition occurs, even though natural precedence would achieve the same result. For our example, totalBill becomes 120.0.",
        "Step 3 is dividing the total bill by the party size: double perPerson = totalBill / people;. Here, we observe Java's automatic type promotion in action: totalBill is a 64-bit double, while people is a 32-bit int. When a double is divided by an int, Java automatically promotes the integer people to a double before executing the division! Therefore, 120.0 / 2 is evaluated as 120.0 / 2.0, yielding the floating-point result 60.0. The decimal precision is fully preserved with zero truncation.",
        "In production enterprise systems, defensive validations are added at the beginning of the method to enforce domain invariants. For example, if people <= 0, dividing by zero would yield Infinity or throw an error. A production-ready method includes guard clauses: if (people <= 0) throw new IllegalArgumentException(\"Party size must be at least 1\");. Similarly, bill and tipPercent must be non-negative numbers. Combining business validation guards with clean arithmetic pipelines produces rock-solid backend services.",
        "Another real-world operational challenge in expense allocation is handling indivisible fractional pennies. For example, if a gross bill of $100.00 is split among 3 people, each person's exact share is 33.3333... cents. In commercial billing engines, truncating to $33.33 results in a total collection of $99.99, leaving a 1-cent reconciliation deficit in the general ledger! Enterprise billing engines implement penny distribution algorithms that allocate the leftover fractional cent (computed via integer modulo) to the primary account holder, ensuring double-entry bookkeeping balance invariants are permanently maintained.",
        "In modern test-driven development (TDD), engineers author automated unit test suites using frameworks like JUnit 5 to verify billing routines under varied inputs. When verifying calculatePerPerson(100.0, 0.20, 2), a test asserts: assertEquals(60.0, Solution.calculatePerPerson(100.0, 0.20, 2), 0.001);. Supplying an explicit delta tolerance of 0.001 guarantees that minor IEEE 754 floating-point variations do not cause false test failures on different continuous integration architectures.",
        "For slow and methodical readers, trace the three steps: calculate tip with bill * tipPercent, add to bill to get total, and divide by people to find each person's share. For fast readers, remember the formula: return (bill + (bill * tipPercent)) / people; and observe how automatic mixed-type promotion elevates the int party count to double during division."
      ],
      "example": "Think of splitting a restaurant bill among friends as cutting a pizza. First, the kitchen adds extra cheese (the tip) to the base pizza (the bill). Then, the server cuts the enlarged pizza into equal slices based on the number of friends at the table. Everyone gets an identical slice containing their share of both pizza and cheese.",
      "code": "// Multi-Party Expense & Tip Allocation Engine Simulator\nclass ExpenseAllocationEngine {\n  calculatePerPerson(bill: number, tipPercent: number, people: number): number {\n    // Guard against non-positive party sizes\n    if (people <= 0) throw new Error('Party size must be at least 1');\n    \n    // 1. Calculate tip amount\n    const tipAmount = bill * tipPercent;\n    \n    // 2. Sum gross total\n    const totalWithTip = bill + tipAmount;\n    \n    // 3. Divide equally across party size with float promotion\n    const perPerson = totalWithTip / people;\n    return perPerson;\n  }\n}\n\nconst engine = new ExpenseAllocationEngine();\nconst test1 = engine.calculatePerPerson(100.0, 0.20, 2);\nconst test2 = engine.calculatePerPerson(200.0, 0.10, 4);\nconst test3 = engine.calculatePerPerson(50.0, 0.0, 1);\nconsole.log(`Test 1 ($100 + 20% / 2):  $${test1.toFixed(1)} (Expected: 60.0)`);\nconsole.log(`Test 2 ($200 + 10% / 4):  $${test2.toFixed(1)} (Expected: 55.0)`);\nconsole.log(`Test 3 ($50  + 0%  / 1):  $${test3.toFixed(1)} (Expected: 50.0)`);",
      "output": "Test 1 ($100 + 20% / 2):  $60.0 (Expected: 60.0)\nTest 2 ($200 + 10% / 4):  $55.0 (Expected: 55.0)\nTest 3 ($50  + 0%  / 1):  $50.0 (Expected: 50.0)",
      "codeNotes": [
        { "line": 8, "note": "Multiplies bill by tip percentage to evaluate absolute tip amount" },
        { "line": 11, "note": "Computes gross total by combining base bill with tip amount" },
        { "line": 14, "note": "Divides gross total across party size with automatic type promotion" },
        { "line": 23, "note": "Exact outputs match Challenge test assertions across all three test cases" }
      ],
      "tryIt": "Calculate the per-person share for a $150 bill with an 18% tip split among 3 people.",
      "check": make_check(
        "In the formula 'double perPerson = (bill + (bill * tipPercent)) / people;', why does dividing by an int variable 'people' preserve decimal places?",
        "Because Java automatically promotes the int 'people' to double when dividing a double by an int",
        "Because all variables in Java are automatically converted to strings before division",
        "Because the compiler rewrites the division to use integer remainder logic",
        "Because division in Java never performs integer truncation under any circumstances",
        "In mixed-type binary operations between a double and an int, Java automatically widens the integer operand to a double, performing full floating-point division."
      )
    }
  ]
}

if __name__ == '__main__':
    print("Checking Day 4 word counts:")
    for i, part in enumerate(DAY_4['parts']):
        wc = word_count(part['say'])
        print(f"  Part {i+1} ({part['title']}): {wc} words")
    tot = sum(word_count(p['say']) for p in DAY_4['parts'])
    print(f"Total Day 4 words: {tot} (>= 2900 required)")
    for i, part in enumerate(DAY_4['parts']):
        wc = word_count(part['say'])
        assert wc >= 580, f"Part {i+1} failed: {wc} < 580"
    assert tot >= 2900
    print("DAY 4 VERIFIED PASS!")

