import json

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

DAY_3 = {
  "day": 3,
  "title": "Operators, Mathematical Expressions & String Concatenation",
  "goal": "Master computational expressions and evaluation order: arithmetic operators (+, -, *, /, %), integer division truncation, operator precedence hierarchies, the overloaded String concatenation operator, and type promotion.",
  "minutes": 38,
  "recap": "In Day 2, we mastered memory primitives, variables, and interactive console input with Scanner. Today, we turn raw stored data into dynamic calculations by mastering arithmetic operators, operator precedence trees, string concatenation, and type promotion.",
  "summary": [
    "Arithmetic operators perform mathematical calculations; dividing two integers truncates the decimal remainder.",
    "Operator precedence follows PEMDAS: multiplicative operators evaluate before additive operators unless overridden with parentheses.",
    "The plus operator (+) is overloaded in Java: if either operand is a String, it triggers string concatenation.",
    "Assigning smaller primitive types to larger types undergoes automatic widening conversion, while reverse operations require explicit casting."
  ],
  "projectStep": {
    "title": "Build Dynamic Total Price Calculator with Mixed-Type Expressions",
    "tasks": [
      "Declare an int variable for purchased quantity and double for unit price",
      "Multiply integer and floating-point operands to evaluate totalPrice",
      "Concatenate textual currency symbols with the computed numeric result",
      "Print verified billing output matching Challenge specification"
    ]
  },
  "parts": [
    {
      "title": "Arithmetic Operators: Addition, Subtraction, Multiplication & Integer Truncation",
      "say": [
        "At the core of every software application—from mobile games to high-frequency algorithmic trading platforms—lies the ability to perform mathematical computations. Java provides five primary binary arithmetic operators: addition (+), subtraction (-), multiplication (*), division (/), and modulo (%). These operators take two operands, perform a low-level arithmetic operation inside the CPU's Arithmetic Logic Unit (ALU), and evaluate to a resulting primitive value.",
        "While addition, subtraction, and multiplication behave largely as you would expect from standard high school algebra, the division operator (/) possesses a critical systems behavior that catches thousands of engineers off guard: integer division truncation. In Java, when both operands of a division operation are integer types (such as int, long, short, or byte), Java performs integer division. Integer division does not round to the nearest whole number, nor does it yield a decimal fraction; instead, it completely discards (truncates) the decimal remainder, retaining only the whole integer quotient.",
        "Consider this classic real-world scenario: an engineer writes int result = 5 / 2;. The true mathematical answer is 2.5. However, because both 5 and 2 are 32-bit integers, the fractional .5 is instantly truncated, and result receives the value 2. Even if you assign the calculation to a double variable—such as double result = 5 / 2;—the value of result becomes 2.0! This happens because the right-hand expression 5 / 2 is evaluated completely as integer division first, yielding the integer 2, which is only subsequently converted to a floating-point double during assignment.",
        "To obtain an accurate fractional decimal result, at least one of the operands must be a floating-point type (double or float). For example, writing double result = 5.0 / 2; or double result = (double) 5 / 2; forces the compiler to promote the entire division operation to 64-bit IEEE 754 floating-point arithmetic, correctly yielding 2.5. Understanding operand type promotion is essential when calculating financial interest, percentage discounts, physics velocities, or customer invoice totals.",
        "Another vital architectural distinction in Java arithmetic is how division by zero is handled across data types. If you attempt to divide an integer by literal zero—such as int crash = 10 / 0;—the JVM halts execution immediately and throws an unhandled java.lang.ArithmeticException: / by zero. However, in floating-point arithmetic governed by IEEE 754, dividing a double by zero does not throw an exception! Evaluating double inf = 10.0 / 0.0; produces positive Infinity (Double.POSITIVE_INFINITY), while 0.0 / 0.0 yields Double.NaN (Not a Number). Senior developers guard integer division with defensive zero-checks to prevent service crashes.",
        "In enterprise software architecture, silent integer truncation is a frequent source of severe accounting anomalies. When calculating percentage ratios—such as success rates in distributed network calls—writing int successPercentage = (successfulCalls / totalCalls) * 100; will evaluate to 0 for any scenario where successfulCalls is less than totalCalls, because successfulCalls / totalCalls truncates to 0! Senior engineers guard against this by restructuring the equation to multiply first: (successfulCalls * 100.0) / totalCalls, or by explicitly casting operands to double before division.",
        "For slow and methodical readers: remember that integer divided by integer always produces an integer by throwing away whatever is after the decimal point. If you want decimals, make sure at least one number has a decimal point like 5.0. For fast readers, lock in the arithmetic rule: integer division truncates toward zero; promotion to floating-point requires at least one double operand prior to division evaluation; and integer division by zero throws ArithmeticException while double yields Infinity."
      ],
      "example": "Think of dividing 5 apples between 2 people using integer division as packing apples into standard whole-apple crates. You can only give each person 2 whole crates of apples. The leftover slice is simply discarded on the floor because the crates cannot hold cut fruit.",
      "code": "// Java Integer Division & Floating Point Promotion Simulator\nclass ArithmeticSimulator {\n  computeDivision(a: number, b: number, forceFloat: boolean): {\n    operands: string;\n    result: number;\n    divisionType: string;\n  } {\n    if (!forceFloat && Number.isInteger(a) && Number.isInteger(b)) {\n      const truncated = Math.trunc(a / b);\n      return { operands: `${a} / ${b}`, result: truncated, divisionType: 'INTEGER_TRUNCATED' };\n    }\n    const fullFloat = a / b;\n    return { operands: `${a} / ${b}`, result: fullFloat, divisionType: 'IEEE_754_DOUBLE_PRECISION' };\n  }\n}\n\nconst sim = new ArithmeticSimulator();\nconst intDiv = sim.computeDivision(5, 2, false);\nconst floatDiv = sim.computeDivision(5, 2, true);\nconsole.log(`Int Division (5 / 2):   Result=${intDiv.result} (${intDiv.divisionType})`);\nconsole.log(`Float Division (5.0 / 2): Result=${floatDiv.result} (${floatDiv.divisionType})`);",
      "output": "Int Division (5 / 2):   Result=2 (INTEGER_TRUNCATED)\nFloat Division (5.0 / 2): Result=2.5 (IEEE_754_DOUBLE_PRECISION)",
      "codeNotes": [
        { "line": 8, "note": "Integer division discards fractional remainder via truncation" },
        { "line": 11, "note": "Floating-point promotion retains full IEEE 754 decimal precision" },
        { "line": 19, "note": "Demonstrates why at least one operand must be double to avoid truncation" }
      ],
      "tryIt": "Compute division with 7 / 2 and verify that integer division returns 3 while float division returns 3.5.",
      "check": make_check(
        "What is the value of 'double x = 7 / 2;' in Java?",
        "3.0 (integer division evaluates to 3 first, then widens to double)",
        "3.5 (the double variable forces decimal division automatically)",
        "4.0 (the compiler rounds up to the nearest integer)",
        "A compile-time type mismatch error",
        "Because 7 and 2 are both integer literals, 7 / 2 evaluates to integer 3 via truncation. Assigning 3 to a double variable widens it to 3.0."
      )
    },
    {
      "title": "Operator Precedence & Mathematical Expression Evaluation Trees",
      "say": [
        "When writing complex business calculations that combine multiple operations—such as calculating tax rates, discounts, insurance premiums, and shipping costs—the order in which the Java Virtual Machine evaluates individual operators determines the final computed result. Just as in traditional mathematics, Java adheres to a strict hierarchy of operator precedence. Without this standardized order, expressions like 10 + 5 * 2 could yield either 30 or 20 depending on compiler whim.",
        "In Java, multiplicative operators (*, /, %) possess higher precedence than additive operators (+, -). Therefore, in the expression 10 + 5 * 2, the multiplication 5 * 2 is evaluated first, yielding 10, which is then added to 10 to produce 20. When operators have the exact same precedence level—such as addition and subtraction, or multiplication and division—they are evaluated according to their associativity. In Java, all binary arithmetic operators exhibit left-to-right associativity, meaning an expression like 20 - 5 - 3 evaluates as (20 - 5) - 3 = 12, rather than 20 - (5 - 3) = 18.",
        "The complete precedence ladder in Java extends far beyond simple arithmetic. Unary operators (such as ++, --, +, -, !, and bitwise complement ~) have higher precedence than binary multiplicative operators. Below multiplicative operators sit additive operators, followed by bitwise shift operators (<<, >>, >>>), relational comparison operators (<, <=, >, >=), equality operators (==, !=), logical operators (&&, ||), ternary conditional operators (? :), and finally assignment operators (=, +=, -=), which have the lowest precedence and evaluate with right-to-left associativity.",
        "However, relying solely on natural operator precedence in complex production code is considered an engineering anti-pattern. Enterprise code must be self-documenting and immediately comprehensible to every engineer on a distributed team. To explicitly dictate evaluation order and eliminate ambiguity, engineers utilize parentheses (()). In Java grammar, parentheses carry the highest precedence of any expression operator. Any sub-expression enclosed within parentheses is evaluated first, regardless of the surrounding operators.",
        "For example, if a billing system needs to calculate the total cost for two items before applying a 10% discount, writing double total = itemA + itemB * 0.9; is a catastrophic logic bug: only itemB receives the discount, while itemA is billed at full price! By wrapping the sum in parentheses—double total = (itemA + itemB) * 0.9;—the compiler evaluates itemA + itemB first, correctly discounting the entire order.",
        "Under the hood, the javac compiler transforms nested mathematical expressions into an Abstract Syntax Tree (AST) during the parsing phase. The deeper a node resides in the AST, the earlier it is evaluated. The compiler generates bytecode opcodes—such as iload, imul, iadd, and istore—that manipulate the JVM thread operand stack in exact compliance with this evaluation tree. Parentheses directly reshape the AST structure, forcing the JVM execution engine to prioritize specific branches.",
        "For slow and methodical readers, remember the classic rule: operations inside parentheses always run first; then multiplication, division, and modulo; and finally addition and subtraction. When in doubt, always add parentheses to make your intent obvious. For fast readers, remember: precedence dictates vertical AST node depth, associativity dictates horizontal left-to-right traversal for operators of equal rank, and explicit parentheses override all default precedence rules."
      ],
      "example": "Think of operator precedence as VIP security boarding at an airport. First-class passengers with express boarding passes (parentheses) board the aircraft before anyone else. Next, frequent flyer business travelers (multiplication and division) board. Finally, general economy ticket holders (addition and subtraction) board in order of arrival (left-to-right).",
      "code": "// Expression Precedence & Abstract Syntax Tree Evaluation Simulator\nclass ExpressionTreeSimulator {\n  evaluateWithoutParens(a: number, b: number, factor: number): number {\n    // Natural precedence: multiplication evaluates before addition\n    return a + b * factor;\n  }\n\n  evaluateWithParens(a: number, b: number, factor: number): number {\n    // Parentheses force addition before multiplication\n    return (a + b) * factor;\n  }\n}\n\nconst treeSim = new ExpressionTreeSimulator();\nconst raw = treeSim.evaluateWithoutParens(10, 5, 2);\nconst grouped = treeSim.evaluateWithParens(10, 5, 2);\nconsole.log(`Natural Precedence (10 + 5 * 2):   ${raw}`);\nconsole.log(`Parenthesized Precedence ((10 + 5) * 2): ${grouped}`);",
      "output": "Natural Precedence (10 + 5 * 2):   20\nParenthesized Precedence ((10 + 5) * 2): 30",
      "codeNotes": [
        { "line": 5, "note": "Multiplication evaluates first due to higher natural precedence" },
        { "line": 10, "note": "Parentheses override natural precedence, executing addition first" },
        { "line": 17, "note": "Demonstrates dramatic divergence in output based on evaluation order" }
      ],
      "tryIt": "Compute the difference between 20 - 4 / 2 and (20 - 4) / 2 to observe how parentheses reshape the result.",
      "check": make_check(
        "What is the result of the Java expression '12 + 6 / 2'?",
        "15 (division occurs first: 6 / 2 = 3, then 12 + 3 = 15)",
        "9 (addition occurs first: 12 + 6 = 18, then 18 / 2 = 9)",
        "6 (operators evaluate from right to left)",
        "A compile-time precedence ambiguity error",
        "Multiplication and division have higher precedence than addition. The division 6 / 2 evaluates to 3 first, and 12 + 3 evaluates to 15."
      )
    },
    {
      "title": "String Concatenation: The Dynamic Overloaded '+' Operator & Memory Mechanics",
      "say": [
        "In Java, operators are generally fixed and cannot be overloaded by developers, unlike in C++ or Python. However, the Java language specification carves out one very special, highly privileged exception to this rule: the plus operator (+). When both operands of a plus operator are numeric primitives, + performs mathematical addition. However, if either operand (or both) is an instance of the String class, the plus operator changes its personality entirely, transforming into the String Concatenation Operator.",
        "String concatenation allows engineers to fuse textual messages and numeric variables together into clean human-readable sentences. For example, when you write System.out.println(\"Total: $\" + totalPrice);, Java evaluates the left operand (\"Total: $\") as a String and the right operand (totalPrice) as a numeric double. The compiler automatically converts the numeric double into its string representation and glues the two sequences of characters together into a single unified String object.",
        "However, string concatenation introduces a subtle evaluation trap when combined with mathematical addition. Consider the following statement: System.out.println(\"Result: \" + 10 + 20);. Beginners frequently expect this to print 'Result: 30'. In reality, it prints: 'Result: 1020'! Why? Because the plus operators have equal precedence and evaluate from left to right. First, \"Result: \" is concatenated with the number 10, producing the intermediate String \"Result: 10\". Then, that resulting String is concatenated with the number 20, producing \"Result: 1020\".",
        "To force the mathematical addition to occur before string concatenation, you must wrap the arithmetic inside parentheses: System.out.println(\"Result: \" + (10 + 20));. Because parentheses take precedence, 10 + 20 is evaluated as mathematical addition first, yielding 30. That integer 30 is then concatenated with \"Result: \", yielding the correct output: 'Result: 30'. Mastering this evaluation sequence is essential for authoring bug-free console output and financial reports.",
        "Under the hood, Java Strings are immutable: once a String object is created in memory, its character contents can never be changed. In older versions of Java, chaining multiple + operators inside tight loops allocated dozens of temporary String objects on the heap, triggering severe GC pressure and O(N^2) memory copying costs. For repeated loop modifications, Java engineers utilize the mutable java.lang.StringBuilder class.",
        "However, for single-line concatenation expressions, modern Java 9+ employs the invokedynamic bytecode instruction linked to StringConcatFactory. At runtime, the JVM uses method handles to inspect the argument recipe, pre-allocates an exact contiguous byte array for the final string length, and copies all components into memory in a single ultra-fast pass, rendering single-statement + concatenation both elegant and performant.",
        "For slow readers, remember: if text touches +, it turns into text glue. If you want to do math next to text, put the math in parentheses like (10 + 20). For fast readers, remember the concatenation invariants: + evaluates left-to-right, any String operand triggers string conversion of the adjacent operand, parentheses are mandatory for mixed arithmetic, and modern JVMs optimize concatenation via StringConcatFactory."
      ],
      "example": "Think of the plus operator as a dual-purpose tool. If you feed it two metal coins, it acts as an adding machine, summing up their value. If you hand it a piece of sticky duct tape (a String) and a coin, it glues the coin directly onto the duct tape rather than adding anything.",
      "code": "// Java String Concatenation vs Arithmetic Precedence Simulator\nclass StringConcatSimulator {\n  demonstrateConcatEvaluation(): void {\n    const withoutParens = 'Total: $' + 10 + 20;\n    const withParens = 'Total: $' + (10 + 20);\n    const directProduct = 'Total: $' + (3 * 15.5);\n    \n    console.log('Unparenthesized Concatenation: ' + withoutParens);\n    console.log('Parenthesized Arithmetic:      ' + withParens);\n    console.log('Challenge Output:               ' + directProduct);\n  }\n}\n\nconst concatSim = new StringConcatSimulator();\nconcatSim.demonstrateConcatEvaluation();",
      "output": "Unparenthesized Concatenation: Total: $1020\nParenthesized Arithmetic:      Total: $30\nChallenge Output:               Total: $46.5",
      "codeNotes": [
        { "line": 4, "note": "Left-to-right evaluation converts sequential operands to strings producing '1020'" },
        { "line": 5, "note": "Parentheses force arithmetic evaluation first before string concatenation" },
        { "line": 6, "note": "Multiplication evaluates before concatenation due to higher natural precedence" }
      ],
      "tryIt": "Verify that multiplying quantity (3) by unitPrice (15.5) yields Total: $46.5 as specified in the Day 3 Challenge.",
      "check": make_check(
        "What will the expression '\"Count: \" + 5 + 5' evaluate to in Java?",
        "\"Count: 55\" (evaluated left-to-right, concatenating each 5 as text)",
        "\"Count: 10\" (the two integers are automatically summed first)",
        "\"Count: 5 + 5\" (the literal expression is printed verbatim)",
        "A compile-time type mismatch error",
        "Because evaluation proceeds left-to-right, 'Count: ' is concatenated with 5 to yield 'Count: 5', which is then concatenated with the second 5 to produce 'Count: 55'."
      )
    },
    {
      "title": "Compound Assignment Operators & Unary Increment / Decrement Invariants",
      "say": [
        "In software engineering, modifying the existing value of a variable based on its previous value is an extraordinarily common operation. For example, when incrementing an inventory counter, tracking iterations in a loop, or adding fees to an existing account balance, you frequently write statements like balance = balance + deposit;. To write more concise, expressive, and maintainable code, Java provides two powerful syntactic mechanisms: compound assignment operators and unary increment/decrement operators.",
        "Compound assignment operators combine an arithmetic operation with assignment into a single compact operator. Java provides compound forms for all five arithmetic operations: += (add and assign), -= (subtract and assign), *= (multiply and assign), /= (divide and assign), and %= (modulo and assign). Writing balance += deposit; is semantically equivalent to balance = balance + deposit;, but it is shorter and directly communicates the intent of an in-place accumulation.",
        "However, compound assignment operators hold a hidden, crucial superpower that every systems engineer must understand: automatic implicit casting. In Java, if you add an integer to a byte variable using standard notation—byte b = 10; b = b + 5;—the compiler will reject the code with an error! Why? Because in Java arithmetic, byte values are automatically promoted to 32-bit int during addition, so b + 5 yields an int, which cannot be assigned back to a byte without an explicit cast. But if you write b += 5;, the code compiles cleanly! Java defines compound assignment as b = (byte)(b + 5), automatically casting the result back to the target variable's type.",
        "Next, Java provides unary increment (++) and decrement (--) operators that increase or decrease a variable's value by exactly 1. These operators can be positioned in two distinct orientations: prefix (++x or --x) and postfix (x++ or x--). While both ultimately modify the variable by 1, their return values within enclosing expressions differ fundamentally. In prefix notation (++x), the variable is incremented first, and the new incremented value is returned to the expression. In postfix notation (x++), the current value is returned to the expression first, and the variable is incremented only afterward.",
        "Consider this classic interview question: int a = 5; int b = a++;. Here, because postfix notation is used, b receives the original value 5, while a becomes 6. If instead you wrote int b = ++a;, a would increment to 6 first, and b would receive 6. In enterprise production systems, senior architects generally avoid embedding ++ inside complex expressions to prevent subtle off-by-one errors, preferring to write the increment on its own dedicated statement line.",
        "Furthermore, embedding increment operators inside array indices—such as items[index++] = value;—requires extreme caution. In multithreaded concurrent pipelines or nested function calls, modifying an index as a side effect can lead to race conditions or off-by-one fencepost errors. Senior engineers adhere to the Clean Code guideline: treat increment and decrement as standalone mutation statements rather than inline expression operands.",
        "For slow readers, remember: count += 5 adds 5 to count; count++ adds 1. Keep ++ on its own line so you never get confused by prefix vs postfix. For fast readers, remember: compound operators include implicit type casting: x += y is x = (typeOf(x))(x + y); prefix increments before use, and postfix increments after value resolution."
      ],
      "example": "Think of compound assignment like a loyalty stamp card at a coffee shop. Instead of printing an entirely new card every morning and copying over your previous stamps, the barista takes your existing card and simply punches one additional stamp directly onto it (+1).",
      "code": "// Compound Assignment & Prefix vs Postfix Increment Simulator\nclass CompoundOperatorSimulator {\n  demonstrateIncrementMechanics(): {\n    postfixResult: { assigned: number; finalA: number };\n    prefixResult: { assigned: number; finalA: number };\n  } {\n    // Postfix simulation: assign first, then increment\n    let a1 = 5;\n    const b1 = a1; // captured original value\n    a1 = a1 + 1;\n    \n    // Prefix simulation: increment first, then assign\n    let a2 = 5;\n    a2 = a2 + 1;\n    const b2 = a2; // captured incremented value\n    \n    return {\n      postfixResult: { assigned: b1, finalA: a1 },\n      prefixResult: { assigned: b2, finalA: a2 }\n    };\n  }\n}\n\nconst compSim = new CompoundOperatorSimulator();\nconst results = compSim.demonstrateIncrementMechanics();\nconsole.log(`Postfix (b = a++): Assigned b=${results.postfixResult.assigned}, Final a=${results.postfixResult.finalA}`);\nconsole.log(`Prefix  (b = ++a): Assigned b=${results.prefixResult.assigned}, Final a=${results.prefixResult.finalA}`);",
      "output": "Postfix (b = a++): Assigned b=5, Final a=6\nPrefix  (b = ++a): Assigned b=6, Final a=6",
      "codeNotes": [
        { "line": 8, "note": "Postfix captures previous value prior to incrementing state" },
        { "line": 13, "note": "Prefix increments state first before returning updated value" },
        { "line": 23, "note": "Both variants leave the source variable incremented to 6" }
      ],
      "tryIt": "Trace what happens if a = 10 and you evaluate int c = a++ + ++a.",
      "check": make_check(
        "If 'int x = 10;' and an engineer executes 'int y = x++;', what are the values of x and y?",
        "x = 11, y = 10 (postfix returns original value before incrementing)",
        "x = 11, y = 11 (prefix increments before assignment)",
        "x = 10, y = 11 (x is unchanged, y is incremented)",
        "x = 10, y = 10 (increment operation is ignored)",
        "In postfix notation (x++), the original value of x (10) is assigned to y first, and then x is incremented to 11."
      )
    },
    {
      "title": "Widening vs Narrowing Type Casts & Arithmetic Overflow Prevention",
      "say": [
        "In enterprise Java engineering, applications constantly manipulate data across different primitive types. For instance, calculating the average of a collection of integer sensor counts requires converting whole numbers to decimal floating-point representations; conversely, extracting a discrete pixel coordinate from a continuous physics calculation requires converting decimals back to integers. In Java, transitioning data between different primitive types is known as type conversion or type casting, and it is governed by two strict categories: widening conversions and narrowing conversions.",
        "Widening conversion (also known as implicit casting) occurs automatically whenever a value of a smaller primitive type is assigned to a variable of a larger, more capacious primitive type. Because the destination type has a larger memory footprint than the source type, there is zero possibility of data loss or magnitude corruption. Java supports automatic widening along a strictly defined hierarchy: byte -> short -> int -> long -> float -> double. For example, if you have an int variable int count = 42;, you can assign it directly to a double: double decimalCount = count;. The JVM converts the 32-bit integer into 64-bit floating-point 42.0 with zero compiler warnings.",
        "Narrowing conversion (also known as explicit casting), on the other hand, occurs when you attempt to assign a value from a larger primitive type to a smaller primitive type—such as assigning a double to an int, or a long to a short. Because the destination container cannot safely hold the full range or precision of the source value, data truncation or loss of precision is inevitable. Consequently, the Java compiler refuses to perform narrowing conversions automatically.",
        "To perform a narrowing conversion, the engineer must explicitly write a cast operator, enclosing the target type in parentheses before the expression, such as double price = 49.99; int wholeDollars = (int) price;. Here, the cast operator (int) explicitly acknowledges to the compiler that you accept the consequences of truncation. Notice that casting a double to an int does not round to 50; it ruthlessly chops off the decimal .99, leaving wholeDollars equal to 49. If rounding is required, you must use Math.round(price) first.",
        "A famous trap in Java type promotion involves binary arithmetic on sub-int types (byte and short). According to the Java Language Specification, whenever arithmetic operations (+, -, *, /) are performed on byte or short values, both operands are automatically promoted to 32-bit int before the calculation executes. Consequently, writing short s1 = 10; short s2 = 20; short s3 = s1 + s2; will fail compilation with an incompatible types error! The expression s1 + s2 evaluates to an int, requiring an explicit cast: short s3 = (short)(s1 + s2);. Understanding this binary numeric promotion rule saves engineers hours of compiler troubleshooting.",
        "Furthermore, if a numeric value exceeds the maximum capacity of the destination type during a narrowing cast, binary overflow occurs. For example, casting the integer 130 to a byte: byte b = (byte) 130; results in b becoming -126! Because 130 exceeds the byte maximum of 127, the high-order bits are discarded, wrapping around into negative territory. In mission-critical software, senior engineers validate that numeric values fall within target ranges before applying explicit narrowing casts.",
        "For slow readers, remember: widening goes from small to large containers and happens automatically; narrowing goes from large to small containers, requires (type) parentheses, and chops off decimals. For fast readers, remember the casting invariant: byte -> short -> int -> long -> float -> double is safe and implicit; any reverse step requires an explicit cast and risks truncation or two's-complement overflow; and sub-int arithmetic always promotes to int."
      ],
      "example": "Think of type casting as pouring water between pitchers. Pouring water from a small 1-cup measuring jar into a 1-gallon jug (widening) is completely safe—not a drop will spill. But pouring water from a 1-gallon jug into a small 1-cup jar (narrowing) requires you to accept that excess water will overflow and spill onto the floor.",
      "code": "// Java Widening vs Narrowing Type Cast Simulator\nclass TypeCastingSimulator {\n  demonstrateCasting(): {\n    wideningResult: { original: number; converted: number; type: string };\n    narrowingResult: { original: number; converted: number; type: string };\n    overflowResult: { original: number; converted: number; type: string };\n  } {\n    // Widening: int -> double (safe & automatic)\n    const intVal = 42;\n    const widened = Number(intVal.toFixed(1)); // 42.0\n    \n    // Narrowing: double -> int (truncates decimals)\n    const doubleVal = 49.99;\n    const narrowed = Math.trunc(doubleVal); // 49\n    \n    // Overflow narrowing: 130 -> byte (-128 to 127 range)\n    // (130 - 256) = -126 in 8-bit signed two's complement\n    const overflowVal = 130;\n    const byteOverflow = ((overflowVal + 128) % 256) - 128;\n    \n    return {\n      wideningResult: { original: intVal, converted: widened, type: 'double' },\n      narrowingResult: { original: doubleVal, converted: narrowed, type: 'int' },\n      overflowResult: { original: overflowVal, converted: byteOverflow, type: 'byte' }\n    };\n  }\n}\n\nconst castSim = new TypeCastingSimulator();\nconst res = castSim.demonstrateCasting();\nconsole.log(`Widening  (int 42 -> double):     ${res.wideningResult.converted}`);\nconsole.log(`Narrowing (double 49.99 -> int):   ${res.narrowingResult.converted}`);\nconsole.log(`Overflow  (int 130 -> byte):       ${res.overflowResult.converted}`);",
      "output": "Widening  (int 42 -> double):     42\nNarrowing (double 49.99 -> int):   49\nOverflow  (int 130 -> byte):       -126",
      "codeNotes": [
        { "line": 8, "note": "Widening conversions happen automatically without data loss" },
        { "line": 13, "note": "Narrowing conversions truncate fractional decimal components" },
        { "line": 18, "note": "Narrowing across capacity boundaries causes two's-complement overflow wrapping" }
      ],
      "tryIt": "Cast double 15.75 to int: observe that the result is 15 rather than 16.",
      "check": make_check(
        "What happens when you cast the decimal number 'double rate = 9.85;' to an int using '(int) rate'?",
        "It truncates to 9, discarding the fractional decimal component entirely",
        "It rounds up to 10 because .85 is greater than .5",
        "It triggers a runtime ArithmeticException error",
        "It compiles to 9.85 because ints can store decimals in modern Java",
        "Explicit casting from double to int performs truncation, discarding all digits after the decimal point without rounding."
      )
    }
  ]
}

print("Checking Day 3 word counts:")
for i, part in enumerate(DAY_3['parts']):
    wc = word_count(part['say'])
    print(f"  Part {i+1} ({part['title']}): {wc} words")

total_wc = sum(word_count(p['say']) for p in DAY_3['parts'])
print(f"Total Day 3 words: {total_wc} words (>= 2900 required: {total_wc >= 2900})")

for i, part in enumerate(DAY_3['parts']):
    wc = word_count(part['say'])
    assert wc >= 580, f"Part {i+1} failed word count: {wc} < 580"
assert total_wc >= 2900, f"Total failed: {total_wc} < 2900"
print("Day 3 PASSED ALL INVARIANTS!")
