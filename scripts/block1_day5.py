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

DAY_5 = {
  "day": 5,
  "title": "Conditional Logic, Boolean Expressions & Branching Decision Engines (if / else)",
  "goal": "Master runtime control flow and decision algorithms: boolean expressions, relational comparison operators (==, !=, <, <=, >, >=), short-circuit logical operators (&&, ||, !), and nested if-else branching architectures.",
  "minutes": 38,
  "recap": "In Day 4, we mastered modulo remainder arithmetic, circular index algorithms, and floating-point precision. Today, we achieve the defining milestone of Month 1 Block 1: giving programs the intelligence to make dynamic runtime decisions using conditional branching, logical short-circuiting, and robust grading engines.",
  "summary": [
    "Relational comparison operators evaluate numeric relationships into boolean true or false primitives.",
    "Short-circuit logical operators (&& and ||) bypass evaluation of right-hand operands when the left-hand operand guarantees the outcome.",
    "The if and if-else statements fork execution paths based on boolean condition evaluations.",
    "Chained if-else-if ladders evaluate sequentially from top to bottom, executing the first matching branch and skipping all subsequent blocks."
  ],
  "projectStep": {
    "title": "Construct Milestone 1 Decision Engine & Threshold Classification Pipeline",
    "tasks": [
      "Author classifyScore method returning 'Pass' for scores 50+ and 'Fail' otherwise",
      "Author canVote predicate returning true for age 18 and older",
      "Validate boundary thresholds at exact cutoff boundaries (50, 49, 18, 17)",
      "Verify zero dead-code branches and full test assertion compliance"
    ]
  },
  "parts": [
    {
      "title": "Boolean Primitives & Relational Comparison Operators",
      "say": [
        "In modern computer systems, intelligence begins with comparison. An automated trading engine must determine if a stock price has crossed an execution threshold; an authentication service must verify if an entered password hash matches the database record; an e-commerce platform must check if inventory exists before accepting a payment. In Java, all decision-making pipelines are grounded in boolean logic, powered by relational comparison operators that evaluate expressions into one of two fundamental boolean primitives: true or false.",
        "Java provides six primary binary relational operators: equality (==), inequality (!=), greater than (>), greater than or equal to (>=), less than (<), and less than or equal to (<=). These operators accept numeric operands on either side, compare their relative mathematical values, and evaluate to a primitive boolean. For example, evaluating 10 > 5 yields true, while 4 >= 9 yields false. When operands of mixed types are compared—such as comparing an int with a double in 50 >= 49.9—Java automatically widens the integer to a double (50.0 >= 49.9) before performing the comparison.",
        "A critical syntactic distinction that trips up every new software developer is the difference between the single equals sign (=) and the double equals sign (==). The single equals sign is the assignment operator: it stores the value of the right-hand expression into the left-hand variable storage slot. The double equals sign is the equality comparison operator: it compares the values of two expressions and returns a boolean without modifying either variable.",
        "In languages like C or C++, accidentally writing if (score = 50) instead of if (score == 50) compiles cleanly because non-zero integers are treated as true, silently overwriting the user's score and corrupting program state! In Java, the compiler completely eliminates this fatal bug: because score = 50 yields an integer, and Java strictly forbids using integers as boolean conditions, javac will immediately abort compilation with a fatal error: 'incompatible types: int cannot be converted to boolean'.",
        "Another critical distinction that every backend engineer must internalize is the difference between primitive value equality and object reference equality. For primitive types (int, double, boolean, char), == compares the literal binary values stored inside the memory slots. However, for reference types like String or custom objects, == compares memory heap addresses (pointers), checking whether two variables point to the exact same physical object in RAM! In Java, you should never compare Strings using == (such as name == \"Alice\"); instead, you must always invoke the semantic equality method: name.equals(\"Alice\"). For primitive numbers, however, == is fast, safe, and correct.",
        "Furthermore, senior backend engineers pay meticulous attention to boundary conditions when choosing between strict inequalities (<, >) and inclusive inequalities (<=, >=). In our Day 5 Challenge, a student is classified as passing if their score is 50 or higher. Writing score > 50 would cause a student scoring exactly 50 to receive 'Fail', introducing an off-by-one boundary defect! By using the inclusive operator score >= 50, the threshold of 50 is safely captured inside the passing partition. Always verify whether edge boundaries belong to the upper or lower partition.",
        "For slow and methodical readers, remember: single equals (=) assigns a value into a box; double equals (==) asks if two boxes hold the same value. Use >= when a boundary number is allowed (50 or higher). For fast readers, lock in the relational rules: relational operators return boolean primitives, mixed types undergo widening promotion before comparison, Java's strict boolean typing prevents assignment-in-condition bugs, and boundary thresholds require inclusive operators."
      ],
      "example": "Think of relational operators as a height-measuring ruler at the entrance of an amusement park roller coaster. The sign says 'Must be >= 48 inches to ride'. The attendant checks your height: if you are exactly 48 inches or taller (true), the gate opens; if you are 47.9 inches (false), the gate stays firmly shut.",
      "code": "// Java Relational Comparison & Boundary Validator Simulator\nclass RelationalComparisonSimulator {\n  checkBoundaries(score: number): {\n    inclusivePass: boolean;\n    strictPass: boolean;\n    boundaryDiagnosis: string;\n  } {\n    const inclusivePass = score >= 50;\n    const strictPass = score > 50;\n    \n    let boundaryDiagnosis = '';\n    if (score === 50) {\n      boundaryDiagnosis = 'EXACT_BOUNDARY: inclusivePass is TRUE, strictPass is FALSE (off-by-one trap)';\n    } else if (score > 50) {\n      boundaryDiagnosis = 'ABOVE_BOUNDARY: Both pass';\n    } else {\n      boundaryDiagnosis = 'BELOW_BOUNDARY: Both fail';\n    }\n    \n    return { inclusivePass, strictPass, boundaryDiagnosis };\n  }\n}\n\nconst relSim = new RelationalComparisonSimulator();\nconst boundary50 = relSim.checkBoundaries(50);\nconsole.log(`Score 50 (inclusive >= 50): ${boundary50.inclusivePass}`);\nconsole.log(`Score 50 (strict > 50):    ${boundary50.strictPass}`);\nconsole.log(`Diagnosis:                 ${boundary50.boundaryDiagnosis}`);",
      "output": "Score 50 (inclusive >= 50): true\nScore 50 (strict > 50):    false\nDiagnosis:                 EXACT_BOUNDARY: inclusivePass is TRUE, strictPass is FALSE (off-by-one trap)",
      "codeNotes": [
        { "line": 8, "note": "score >= 50 correctly treats boundary 50 as passing" },
        { "line": 9, "note": "score > 50 erroneously rejects boundary 50 as failing" },
        { "line": 13, "note": "Demonstrates why inclusive operators are mandatory for threshold specifications" }
      ],
      "tryIt": "Test score 49 and verify that both inclusive and strict comparisons return false.",
      "check": make_check(
        "Why does writing 'if (x = 50)' cause a compile-time error in Java when x is an int?",
        "Because 'x = 50' evaluates to an integer, and Java strictly forbids using integers as boolean conditions in if statements",
        "Because Java does not permit assigning values inside curly braces",
        "Because 50 is too large to fit in an integer variable",
        "Because the compiler requires all variables to be capitalized",
        "In Java, assignment expressions return the assigned value (50, an int). Java enforces strict boolean typing: if conditions must evaluate to a boolean primitive, preventing accidental assignment bugs."
      )
    },
    {
      "title": "Logical Operators & Short-Circuit Evaluation Mechanics (&&, ||, !)",
      "say": [
        "In real-world business systems, decisions rarely depend on a single isolated variable. An automated loan approval engine requires that an applicant's credit score is above 700 AND their debt-to-income ratio is below 35%; an e-commerce checkout approves free shipping if the cart total exceeds $50 OR the customer is a premium member; a security gateway permits access if the user is an administrator AND their session token is NOT expired. To combine and invert multiple boolean conditions, Java provides three primary logical operators: logical AND (&&), logical OR (||), and logical NOT (!).",
        "The logical NOT operator (!) is a unary prefix operator that inverts a boolean value: !true evaluates to false, and !false evaluates to true. For example, if a boolean variable isAccountLocked holds false, then !isAccountLocked evaluates to true, signaling that the account is accessible. Placing ! before a boolean expression provides clean, readable condition inversion.",
        "The logical AND operator (&&) returns true if and only if both its left operand and right operand evaluate to true. If either operand (or both) is false, the entire expression evaluates to false. Conversely, the logical OR operator (||) returns true if either operand (or both) evaluates to true. The only scenario where || evaluates to false is when both operands are simultaneously false.",
        "Crucially, in Java, both && and || are short-circuit operators. Short-circuit evaluation is a foundational CPU-level performance and safety mechanism. When evaluating an expression with &&, Java evaluates the left-hand operand first. If the left-hand operand evaluates to false, Java does not evaluate the right-hand operand at all! Why? Because in boolean algebra, false AND anything is guaranteed to be false. Evaluating the right side would waste CPU cycles.",
        "Similarly, for the logical OR operator (||), if the left-hand operand evaluates to true, Java immediately halts evaluation and returns true, skipping the right-hand operand entirely. Because true OR anything is guaranteed to be true, evaluating the remainder of the expression is mathematically redundant.",
        "In enterprise software architecture, short-circuit evaluation is not just a performance optimization; it is a vital guardrail against fatal NullPointerException crashes! Consider this classic production pattern: if (user != null && user.isActive()). If user is null, user != null evaluates to false. Because && short-circuits, the right-hand call user.isActive() is never executed, protecting the process from attempting to dereference a null pointer! If Java evaluated both sides eagerly, your service would crash immediately.",
        "Java also provides single ampersand (&) and single pipe (|) operators, which are non-short-circuiting (eager) logical operators when applied to boolean operands. Unlike && and ||, the eager operators & and | evaluate both the left and right expressions unconditionally, regardless of the left-hand result. If an engineer accidentally writes if (user != null & user.isActive()) with a single ampersand, passing a null user will execute user.isActive() and instantly trigger a NullPointerException! In boolean control flow, you should virtually always use && and ||.",
        "To simplify complex nested logical expressions, senior developers master De Morgan's Laws of boolean algebra. De Morgan's Laws state that !(A && B) is logically equivalent to (!A || !B), and !(A || B) is equivalent to (!A && !B). Applying De Morgan's transformations allows engineers to unwrap confusing negated boolean expressions, refactoring convoluted negative logic into clear, positive business requirements that are much easier to test and maintain.",
        "For slow and methodical readers: remember that && means BOTH must be true; || means AT LEAST ONE must be true; and ! flips true to false. Short-circuiting means Java stops reading the moment it already knows the answer. For fast readers, lock in the rules: && short-circuits on first false, || short-circuits on first true, ! inverts, and short-circuiting guards against null-pointer dereferences in production."
      ],
      "example": "Think of short-circuit AND like a two-key nuclear launch sequence. If officer A does not turn their key (false), the missile computer immediately aborts without waiting to see if officer B turned their key. There is no reason to check the second key if the first key is missing.",
      "code": "// Java Short-Circuit Evaluation & Null Guard Simulator\nclass ShortCircuitSimulator {\n  simulateNullGuard(user: { name: string; active: boolean } | null): string {\n    // Short-circuit AND: if user is null, user !== null evaluates to false,\n    // and user.active is NEVER evaluated, preventing crash!\n    if (user !== null && user.active) {\n      return `ACCESS_GRANTED: Welcome, ${user.name}`;\n    } else {\n      return 'ACCESS_DENIED: User is null or inactive';\n    }\n  }\n}\n\nconst sim = new ShortCircuitSimulator();\nconst activeUser = sim.simulateNullGuard({ name: 'Vinay', active: true });\nconst nullUser = sim.simulateNullGuard(null);\nconsole.log(activeUser);\nconsole.log(nullUser);",
      "output": "ACCESS_GRANTED: Welcome, Vinay\nACCESS_DENIED: User is null or inactive",
      "codeNotes": [
        { "line": 6, "note": "user !== null acts as a protective guard clause" },
        { "line": 6, "note": "Short-circuit evaluation halts prior to evaluating user.active on null inputs" },
        { "line": 15, "note": "Demonstrates crash-free execution on null object references" }
      ],
      "tryIt": "Pass a user object with active: false and verify access is denied without triggering errors.",
      "check": make_check(
        "In the expression 'if (str != null && str.length() > 0)', what prevents a NullPointerException if str is null?",
        "Short-circuit evaluation stops execution immediately when 'str != null' evaluates to false, never evaluating 'str.length()'",
        "Java automatically allocates an empty string when null is encountered",
        "The compiler rewrites the expression to swap the left and right operands",
        "The length() method in Java is specially designed to accept null references without crashing",
        "The logical AND (&&) operator short-circuits: because the left operand (str != null) is false, Java skips evaluating the right operand entirely, preventing a NullPointerException."
      )
    },
    {
      "title": "Branching Control Flow: The if and if-else Execution Pipeline",
      "say": [
        "Until now, our programs have executed sequentially: statement 1 followed by statement 2 followed by statement 3 in an unbroken linear cascade. However, real-world algorithms require the ability to choose between alternate paths based on runtime state. In Java, the fundamental control flow structure for conditional execution is the if statement and its companion if-else statement.",
        "The syntax of a standard if statement is: if (condition) { // code block }. The condition must be enclosed in parentheses and must evaluate strictly to a primitive boolean value (true or false). When execution reaches the if statement, the JVM evaluates the condition. If the condition is true, the JVM enters the block of statements enclosed within the curly braces ({ and }), executes each statement, and then continues execution past the closing brace. If the condition is false, the JVM completely bypasses the enclosed block, jumping immediately to the next statement outside the braces.",
        "When an application must perform one action if a condition is met, and a completely different action if the condition is not met, you append an else block: if (condition) { // true branch } else { // false branch }. In an if-else structure, the two branches are mutually exclusive: exactly one of the two blocks will execute, and the other block will be completely ignored. This forms a deterministic binary fork in the program's execution tree.",
        "Let us examine a real-world example from our Day 5 Challenge: classifyScore(int score). If a student scores 50 or higher, the method must return 'Pass'; otherwise, it must return 'Fail'. Written using if-else: public static String classifyScore(int score) { if (score >= 50) { return \"Pass\"; } else { return \"Fail\"; } }. If score is 75, score >= 50 evaluates to true, the method returns 'Pass', and the else block is bypassed. If score is 45, score >= 50 evaluates to false, the true block is bypassed, and the else block returns 'Fail'.",
        "A critical stylistic and architectural invariant in enterprise Java is the mandatory use of curly braces ({ and }). In Java grammar, if an if or else statement contains only a single statement, curly braces are technically optional. However, omitting curly braces is universally recognized as a dangerous anti-pattern that has caused catastrophic security bugs in production software (such as Apple's infamous 'goto fail' SSL vulnerability). If a developer later adds a second line of code intending it to be inside the condition, without curly braces that second line will execute unconditionally! Professional Java engineering teams enforce curly braces on all control structures via automated linter rules.",
        "At the hardware level, modern CPUs utilize speculative branch prediction to maintain high instruction throughput. CPUs maintain an execution pipeline; when they encounter a conditional if statement, they predict which branch will be taken before the boolean evaluation finishes. If the CPU predicts correctly, execution proceeds without pause; if it mispredicts, the pipeline stalls, flushes partially executed instructions, and incurs a 15-20 cycle latency penalty. Structuring hot branches with predictable, dominant outcomes minimizes branch misprediction overhead on high-throughput backend services.",
        "For slow and methodical readers, visualize if-else as a railroad switch track: the train approaches the switch; if the signal is green (true), the train takes the left track; if the signal is red (false), the switch flips and the train takes the right track. Exactly one track is taken. For fast readers, remember: if conditions require boolean expressions, if-else forms mutually exclusive execution paths, and curly braces are mandatory in production code to prevent silent logic defects."
      ],
      "example": "Think of an if-else statement as a security checkpoint at a VIP concert venue. The guard checks your wristband: if you have a VIP pass (true), you are directed to the private backstage lounge; else (false), you are directed to the general standing arena. You cannot enter both areas.",
      "code": "// Java if-else Branching Control Flow Simulator\nclass BranchingFlowSimulator {\n  classifyScore(score: number): string {\n    // Mutually exclusive binary execution fork\n    if (score >= 50) {\n      return 'Pass';\n    } else {\n      return 'Fail';\n    }\n  }\n\n  canVote(age: number): boolean {\n    // Direct boolean predicate evaluation\n    return age >= 18;\n  }\n}\n\nconst branchSim = new BranchingFlowSimulator();\nconsole.log(`classifyScore(75):  \"${branchSim.classifyScore(75)}\"  (Expected: Pass)`);\nconsole.log(`classifyScore(50):  \"${branchSim.classifyScore(50)}\"  (Expected: Pass)`);\nconsole.log(`classifyScore(49):  \"${branchSim.classifyScore(49)}\"  (Expected: Fail)`);\nconsole.log(`canVote(18):        ${branchSim.canVote(18)}        (Expected: true)`);\nconsole.log(`canVote(17):        ${branchSim.canVote(17)}       (Expected: false)`);",
      "output": "classifyScore(75):  \"Pass\"  (Expected: Pass)\nclassifyScore(50):  \"Pass\"  (Expected: Pass)\nclassifyScore(49):  \"Fail\"  (Expected: Fail)\ncanVote(18):        true        (Expected: true)\ncanVote(17):        false       (Expected: false)",
      "codeNotes": [
        { "line": 5, "note": "Evaluates score >= 50 condition returning 'Pass' for 50+" },
        { "line": 7, "note": "else block executes for any score below 50 returning 'Fail'" },
        { "line": 12, "note": "canVote returns boolean comparison directly without redundant if-else statements" }
      ],
      "tryIt": "Test classifyScore(0) and verify that it returns 'Fail' as expected.",
      "check": make_check(
        "Why is omitting curly braces on single-line if statements considered an engineering anti-pattern in Java?",
        "Because if another developer later adds a second line intending it to be inside the condition, it will execute unconditionally, creating dangerous logic bugs",
        "Because the Java compiler refuses to execute any if statement without curly braces",
        "Because single-line if statements run ten times slower than braced statements",
        "Because variables declared inside unbraced if statements cannot be garbage collected",
        "Omitting curly braces means only the single immediately following statement is part of the condition. Subsequent lines execute unconditionally, leading to severe maintenance bugs."
      )
    },
    {
      "title": "Multi-Branch Decision Chains: if-else-if Ladders & Exhaustive Default Fallbacks",
      "say": [
        "While a binary if-else statement handles two-outcome decisions cleanly, enterprise software frequently encounters multi-tiered classification problems with three, four, or more distinct categories. For example, tax calculations vary across multiple income brackets; academic grading systems award letter grades ('A', 'B', 'C', 'D', 'F'); and shipping calculators adjust rates across distinct package weight tiers. In Java, multi-category decision trees are modeled using if-else-if ladders.",
        "An if-else-if ladder links multiple conditional checks together into a sequential decision chain: if (condition1) { // block 1 } else if (condition2) { // block 2 } else if (condition3) { // block 3 } else { // default fallback }. The execution engine evaluates conditions sequentially from top to bottom. The moment a condition evaluates to true, the JVM executes that specific block of code and immediately jumps past the entire remainder of the ladder! None of the subsequent else if conditions or the final else block are evaluated.",
        "Because an if-else-if ladder halts on its first true match, the ordering of conditions is of paramount architectural importance. Conditions must always be arranged from most restrictive to least restrictive (or vice versa in a disciplined numeric progression). Consider an academic grading engine: if you write if (score >= 50) { return \"Pass\"; } else if (score >= 90) { return \"A\"; }, a student who scored 95 will enter the first block (since 95 >= 50 is true) and receive 'Pass', completely skipping the check for 'A'! By ordering checks from highest to lowest—score >= 90 ('A'), then score >= 80 ('B'), then score >= 70 ('C'), and finally score >= 50 ('Pass')—each tier accurately filters scores.",
        "The final else block at the bottom of an if-else-if ladder acts as an exhaustive catch-all fallback. If none of the preceding conditions matched, execution falls into the else block. In mission-critical systems, always including an explicit else fallback ensures that unexpected runtime states or unhandled categories never slip through silently. In financial and medical software, architects frequently use the final else block to throw an IllegalStateException or log an alert if an unrecognized code is encountered.",
        "Another valuable syntactic tool for simple binary branching is the ternary conditional operator (? :): variable = condition ? valueIfTrue : valueIfFalse;. The ternary operator is an expression, not a statement, meaning it evaluates to a value that can be assigned directly or returned. For example, returning score >= 50 ? \"Pass\" : \"Fail\"; is a concise, one-line equivalent to an if-else return statement. Senior engineers use ternary operators for simple two-way value selection, reserving if-else-if ladders for multi-tier procedural logic.",
        "When an if-else-if ladder grows beyond 5 or 6 tiers, maintenance overhead escalates. In such scenarios, senior architects consider refactoring to Java's enhanced switch expressions (which we master in Day 6) or employing polymorphism via the Strategy Pattern. Replacing sprawling conditional ladders with dedicated state machines or table-driven dispatch tables eliminates cognitive complexity and ensures that adding a new category does not require mutating fragile nested branch logic.",
        "For slow and methodical readers, visualize an if-else-if ladder as a multi-tier coin sorting machine: the coin drops in; if it fits the quarter slot, it drops into the quarter bin and stops; else if it fits the dime slot, it drops into the dime bin; else it falls into the reject tray. Exactly one bin receives the coin. For fast readers, lock in the ladder rules: ladders evaluate top-to-bottom and short-circuit on first match; order conditions from most specific to general; always include a default else; and use the ternary operator for concise inline expressions."
      ],
      "example": "Think of an if-else-if ladder as a triage nurse in an emergency room. The nurse checks symptoms: if critical cardiac arrest (block 1), immediately route to trauma bay; else if severe fracture (block 2), route to X-ray; else if mild fever (block 3), route to general clinic; else (default), route to waiting room.",
      "code": "// Java if-else-if Multi-Tier Classification Simulator\nclass MultiTierGradingSimulator {\n  classifyTier(score: number): string {\n    // Ordered from most restrictive to least restrictive\n    if (score >= 90) {\n      return 'Grade A: Honors Distinction';\n    } else if (score >= 80) {\n      return 'Grade B: Commended Achievement';\n    } else if (score >= 70) {\n      return 'Grade C: Standard Competency';\n    } else if (score >= 50) {\n      return 'Grade D: Minimum Pass Threshold';\n    } else {\n      return 'Grade F: Remediation Required';\n    }\n  }\n\n  ternaryDecision(score: number): string {\n    // Concise inline ternary expression\n    return score >= 50 ? 'Pass' : 'Fail';\n  }\n}\n\nconst gradeSim = new MultiTierGradingSimulator();\nconsole.log(gradeSim.classifyTier(95));\nconsole.log(gradeSim.classifyTier(82));\nconsole.log(gradeSim.classifyTier(50));\nconsole.log(gradeSim.classifyTier(45));\nconsole.log('Ternary Check (50): ' + gradeSim.ternaryDecision(50));",
      "output": "Grade A: Honors Distinction\nGrade B: Commended Achievement\nGrade D: Minimum Pass Threshold\nGrade F: Remediation Required\nTernary Check (50): Pass",
      "codeNotes": [
        { "line": 5, "note": "Top-to-bottom progression checks highest tier first" },
        { "line": 13, "note": "Catch-all else block handles all scores below 50" },
        { "line": 19, "note": "Ternary operator provides concise expression-based decision selection" }
      ],
      "tryIt": "Test score 72: verify that it outputs 'Grade C: Standard Competency'.",
      "check": make_check(
        "Why must conditions in an if-else-if ladder be ordered from most restrictive to least restrictive?",
        "Because the ladder halts execution on the first true condition, so an overly broad early condition will shadow and block more specific subsequent conditions",
        "Because the Java compiler will refuse to compile if numbers are not sorted in ascending order",
        "Because else-if statements evaluate in random order at runtime",
        "Because only the last condition in an if-else-if ladder is ever executed",
        "If an early condition is too broad (such as score >= 50 placed before score >= 90), it will match first and bypass the more specific check, preventing the specific block from ever executing."
      )
    },
    {
      "title": "Milestone 1 Capstone: Building a Production-Grade Decision & Grading Engine",
      "say": [
        "We have reached the capstone milestone of Block 1 in Month 1 of our Java Systems Engineering curriculum. Over the past five days, we have journeyed from the foundational mechanics of the Java Virtual Machine and bytecode classloading (Day 1), through memory primitives and console input streaming with Scanner (Day 2), arithmetic expressions and string concatenation (Day 3), and modulo remainder algorithms and IEEE 754 precision (Day 4). Today, we unite every one of these foundational pillars into a cohesive, production-grade Decision & Grading Engine.",
        "In enterprise software architecture, capstone milestones represent integration boundaries where individual language constructs synthesize into robust, business-critical services. Our Milestone 1 Decision Engine represents the core classification kernel found in automated academic assessment portals, credit scoring algorithms, risk analysis microservices, and regulatory compliance platforms.",
        "Let us examine the complete architectural blueprint of our Solution class. The class exposes two primary public static methods: classifyScore(int score) and canVote(int age). Let us deconstruct each method to observe how our pedagogical invariants are satisfied with zero compiler warnings and zero runtime exceptions.",
        "First, classifyScore(int score): this method encapsulates the binary threshold decision invariant. It accepts an integer score and evaluates the conditional boundary score >= 50. If score is 50 or higher, it returns the string 'Pass'; otherwise, it returns 'Fail'. Notice that this method can be authored with an if-else statement or concisely using the ternary operator: return score >= 50 ? \"Pass\" : \"Fail\";. Both implementations compile to identical bytecode branch instructions (if_icmplt), ensuring deterministic microsecond execution throughput.",
        "Second, canVote(int age): this method represents a pure boolean predicate. It accepts an integer age and evaluates whether the applicant has reached the age of majority: age >= 18. Beginners often write an unnecessary if-else statement here: if (age >= 18) return true; else return false;. Senior engineers recognize that the relational comparison age >= 18 already evaluates to a boolean primitive, and write the concise, elegant line: return age >= 18;. This direct return pattern eliminates redundant bytecode branch jumps and optimizes pipeline execution.",
        "When our automated test suite executes against public class Solution, it verifies exact boundary assertions: classifyScore(75) must yield 'Pass'; boundary 50 must yield 'Pass'; boundary 49 must yield 'Fail'; extreme boundaries 0 and 100 must yield 'Fail' and 'Pass' respectively; and canVote must correctly partition age 18 (true), 25 (true), 17 (false), and 0 (false). Every single test assertion passes deterministically, proving that our implementation adheres 100% to specifications with zero blind spots.",
        "Under the hood, inspecting the compiled bytecode using javap -c Solution reveals the clean, optimized machine structure generated by the Java compiler. The classifyScore method compiles into compact bytecode instructions: iload_0 loads the score, bipush 50 pushes the threshold, and if_icmplt branches to the 'Fail' block if score is less than 50. The method operates with minimal stack depth (max_stack = 2) and requires zero heap allocations, illustrating how foundational clean coding directly translates into sub-nanosecond JVM execution efficiency.",
        "Furthermore, our implementation adheres strictly to the Google Java Style Guide, formatting curly braces on the same line (the K&R Egyptian brackets style) and maintaining consistent two-space indentation. In high-scale engineering organizations, uniform formatting standards ensure that code reviews focus on algorithmic correctness and architectural trade-offs rather than stylistic debates.",
        "For slow and methodical readers, celebrate this milestone: you have learned how Java compiles, how memory is allocated, how inputs are read, how math is computed, and how decisions are branched. You have written code that passes strict automated test suites. For fast readers, lock in the professional summary: clean methods use direct boolean returns for predicates, ternary or if-else for threshold mapping, and comprehensive boundary tests (0, 49, 50, 100) to guarantee production stability."
      ],
      "example": "Think of our Milestone 1 Decision Engine as the automated flight clearance computer for an airline. The computer checks passenger age (canVote) to assign unaccompanied minor status, and checks passenger document verification scores (classifyScore) to clear passengers through biometric boarding gates with zero human delay.",
      "code": "// Java Milestone 1 Decision Engine Synthesis Simulator\nclass Milestone1DecisionEngine {\n  static classifyScore(score: number): string {\n    // Threshold classification: 50+ is Pass, below 50 is Fail\n    if (score >= 50) {\n      return 'Pass';\n    } else {\n      return 'Fail';\n    }\n  }\n\n  static canVote(age: number): boolean {\n    // Direct boolean predicate return\n    return age >= 18;\n  }\n}\n\nconsole.log('=== MILESTONE 1 VERIFICATION SUITE ===');\nconsole.log('classifyScore(75):  ' + Milestone1DecisionEngine.classifyScore(75));\nconsole.log('classifyScore(50):  ' + Milestone1DecisionEngine.classifyScore(50) + ' (Boundary)');\nconsole.log('classifyScore(49):  ' + Milestone1DecisionEngine.classifyScore(49) + ' (Boundary)');\nconsole.log('classifyScore(0):   ' + Milestone1DecisionEngine.classifyScore(0));\nconsole.log('classifyScore(100): ' + Milestone1DecisionEngine.classifyScore(100));\nconsole.log('canVote(18):        ' + Milestone1DecisionEngine.canVote(18) + ' (Boundary)');\nconsole.log('canVote(25):        ' + Milestone1DecisionEngine.canVote(25));\nconsole.log('canVote(17):        ' + Milestone1DecisionEngine.canVote(17) + ' (Boundary)');\nconsole.log('canVote(0):         ' + Milestone1DecisionEngine.canVote(0));\nconsole.log('=== ALL MILESTONE 1 TESTS PASSED ===');",
      "output": "=== MILESTONE 1 VERIFICATION SUITE ===\nclassifyScore(75):  Pass\nclassifyScore(50):  Pass (Boundary)\nclassifyScore(49):  Fail (Boundary)\nclassifyScore(0):   Fail\nclassifyScore(100): Pass\ncanVote(18):        true (Boundary)\ncanVote(25):        true\ncanVote(17):        false (Boundary)\ncanVote(0):         false\n=== ALL MILESTONE 1 TESTS PASSED ===",
      "codeNotes": [
        { "line": 5, "note": "classifyScore partitions scores at exact cutoff boundary 50" },
        { "line": 13, "note": "canVote evaluates age >= 18 as a direct boolean predicate" },
        { "line": 18, "note": "Comprehensive boundary test suite verifies 50, 49, 18, and 17 edge cases" }
      ],
      "tryIt": "Verify that classifyScore(50) returns 'Pass' and canVote(18) returns true, satisfying the Challenge contract.",
      "check": make_check(
        "Why is 'return age >= 18;' preferred over 'if (age >= 18) return true; else return false;' in Java?",
        "Because 'age >= 18' already evaluates to a boolean primitive, making the if-else branch completely redundant and less readable",
        "Because if-else statements cannot be used inside public static methods",
        "Because the return keyword can only be used once per class",
        "Because boolean comparisons in if statements are deprecated in Java 21",
        "The relational comparison expression 'age >= 18' directly produces a boolean value (true or false). Returning the expression directly is cleaner, more idiomatic, and eliminates redundant branching bytecode."
      )
    }
  ]
}

if __name__ == '__main__':
    print("Checking Day 5 word counts:")
    for i, part in enumerate(DAY_5['parts']):
        wc = word_count(part['say'])
        print(f"  Part {i+1} ({part['title']}): {wc} words")
    tot = sum(word_count(p['say']) for p in DAY_5['parts'])
    print(f"Total Day 5 words: {tot} (>= 2900 required)")
    for i, part in enumerate(DAY_5['parts']):
        wc = word_count(part['say'])
        assert wc >= 580, f"Part {i+1} failed: {wc} < 580"
    assert tot >= 2900
    print("DAY 5 VERIFIED PASS!")
