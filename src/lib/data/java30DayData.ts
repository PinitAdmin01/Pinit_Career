import { buildEnrichedDayQuests, DayConfig, CourseQuest } from './curriculumEnricher';

export const JAVA_30_DAYS_CONFIGS: DayConfig[] = [
  // ── Day 1: Hello World & Program Structure ───────────────────────────────
  {
    title: "What is Java? — Writing Your First Java Instructions",
    desc: "Java is a programming language that tells a computer what to do step by step. Every Java program lives inside a class with a main method entry point: public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }. Every complete instruction ends with a semicolon (;). (Real world: Millions of Android apps, WhatsApp, and Google Maps run on Java instructions.)",
    syllabus: [
      "What programming means: Writing step-by-step instructions in Java.",
      "Anatomy of a Java program: public class is the container; main is the starting door.",
      "The semicolon rule: Every complete instruction ends with a semicolon (;)."
    ],
    eTitle: "Day 1 Challenge: Print Your Introduction",
    eDesc: "Write a Java program that prints 3 lines to the screen: line 1 'Hello!', line 2 'I am learning Java.', and line 3 'Let us build!'.",
    eStarter: "public class Solution {\n    public static void main(String[] args) {\n        // Write your 3 System.out.println lines below:\n        \n    }\n}",
    eHint: "Use System.out.println(\"...\"); for each line.",
    eTest: "import java.io.*;\npublic class Test {\n    public static void main(String[] args) {\n        ByteArrayOutputStream out = new ByteArrayOutputStream();\n        System.setOut(new PrintStream(out));\n        Solution.main(new String[]{});\n        String res = out.toString().trim().replace(\"\\r\\n\", \"\\n\");\n        if (!res.contains(\"Hello!\")) throw new AssertionError(\"Line 1 must contain 'Hello!'\");\n        if (!res.contains(\"I am learning Java.\")) throw new AssertionError(\"Line 2 must contain 'I am learning Java.'\");\n        if (!res.contains(\"Let us build!\")) throw new AssertionError(\"Line 3 must contain 'Let us build!'\");\n        String[] lines = res.split(\"\\n\");\n        if (lines.length != 3) throw new AssertionError(\"Must print exactly 3 lines, got: \" + lines.length);\n    }\n}",
    aTitle: "Day 1 Assignment: Custom Message Output",
    aDesc: "Write a Java program that prints 'Java is awesome!' to the screen.",
    aStarter: "public class Solution {\n    public static void main(String[] args) {\n        // Print 'Java is awesome!':\n        \n    }\n}",
    aHint: "Use System.out.println(\"Java is awesome!\");",
    aTest: "import java.io.*;\npublic class Test {\n    public static void main(String[] args) {\n        ByteArrayOutputStream out = new ByteArrayOutputStream();\n        System.setOut(new PrintStream(out));\n        Solution.main(new String[]{});\n        String res = out.toString().trim();\n        if (!res.equals(\"Java is awesome!\")) throw new AssertionError(\"Expected 'Java is awesome!', got: \" + res);\n    }\n}"
  },

  // ── Day 2: Reading User Input with Scanner ────────────────────────────────
  {
    title: "Reading User Input — The Scanner Class & Buffer Traps",
    desc: "Use the Scanner class to read keyboard input from the user. Step 1: import java.util.Scanner;. Step 2: Scanner sc = new Scanner(System.in);. Step 3: sc.nextInt() for integers, sc.nextLine() for text sentences. Always clear the buffer with sc.nextLine() after reading numbers! (Real world: ATM pinpads and web forms pause and wait for keyboard input.)",
    syllabus: [
      "Scanner 3-Step Lifecycle: Import, create reader, and read input.",
      "Type-Specific Readers: sc.nextInt() for numbers, sc.nextLine() for text.",
      "The Enter-Key Buffer Trap: Flushing leftover newline characters."
    ],
    eTitle: "Day 2 Challenge: Fix the Broken Input Reader",
    eDesc: "Fix the bug in the program below so it reads the user age and then reads their full name without skipping.",
    eStarter: "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        // BUG: Add 1 line here to clear the leftover Enter key buffer:\n        \n        String name = sc.nextLine();\n        System.out.println(\"Name: \" + name + \" | Age: \" + age);\n    }\n}",
    eHint: "Add sc.nextLine(); right after nextInt() to clear the buffer.",
    eTest: "import java.io.*;\npublic class Test {\n    public static void main(String[] args) {\n        String input1 = \"22\\nVinay Kumar\\n\";\n        System.setIn(new ByteArrayInputStream(input1.getBytes()));\n        ByteArrayOutputStream out1 = new ByteArrayOutputStream();\n        System.setOut(new PrintStream(out1));\n        Solution.main(new String[]{});\n        if (!out1.toString().contains(\"Name: Vinay Kumar | Age: 22\")) throw new AssertionError(\"Test 1 failed: Expected 'Name: Vinay Kumar | Age: 22'\");\n        \n        String input2 = \"18\\nSarah Connor\\n\";\n        System.setIn(new ByteArrayInputStream(input2.getBytes()));\n        ByteArrayOutputStream out2 = new ByteArrayOutputStream();\n        System.setOut(new PrintStream(out2));\n        Solution.main(new String[]{});\n        if (!out2.toString().contains(\"Name: Sarah Connor | Age: 18\")) throw new AssertionError(\"Test 2 failed: Expected 'Name: Sarah Connor | Age: 18'\");\n    }\n}",
    aTitle: "Day 2 Assignment: Reading Number Input",
    aDesc: "Write a Java program that reads an integer score using sc.nextInt() and prints 'Score: ' followed by the score.",
    aStarter: "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read score and print it:\n        \n    }\n}",
    aHint: "Use int score = sc.nextInt();",
    aTest: "import java.io.*;\npublic class Test {\n    public static void main(String[] args) {\n        String input = \"88\\n\";\n        System.setIn(new ByteArrayInputStream(input.getBytes()));\n        ByteArrayOutputStream out = new ByteArrayOutputStream();\n        System.setOut(new PrintStream(out));\n        Solution.main(new String[]{});\n        String res = out.toString().trim();\n        if (!res.contains(\"Score: 88\")) throw new AssertionError(\"Expected 'Score: 88', got: \" + res);\n    }\n}"
  },

  // ── Day 3: Variables & Primitive Types ────────────────────────────────────
  {
    title: "Variables & Memory Storage Boxes",
    desc: "A variable is like a labeled storage box in memory that holds a specific type of information. Learn the 4 fundamental types: int for whole numbers, double for decimals, boolean for true/false, and String for text.",
    syllabus: [
      "Whole Numbers (int): Storing integers without decimals.",
      "Decimal Numbers (double): Storing fractional numbers and prices.",
      "True/False (boolean) & Text (String): Storing flags and words."
    ],
    eTitle: "Day 3 Challenge: Declare Variables & Calculate Total",
    eDesc: "Declare an int quantity = 3, a double unitPrice = 15.50, calculate double totalPrice = quantity * unitPrice, and print 'Total: $' + totalPrice.",
    eStarter: "public class Solution {\n    public static void main(String[] args) {\n        // 1. Declare int quantity\n        // 2. Declare double unitPrice\n        // 3. Calculate and print totalPrice\n        \n    }\n}",
    eHint: "Declare each variable on its own line with its type, then multiply quantity by unitPrice to get totalPrice.",
    eTest: "import java.io.*;\npublic class Test {\n    public static void main(String[] args) {\n        ByteArrayOutputStream out = new ByteArrayOutputStream();\n        System.setOut(new PrintStream(out));\n        Solution.main(new String[]{});\n        String res = out.toString().trim();\n        if (!res.contains(\"Total: $46.5\")) throw new AssertionError(\"Expected 'Total: $46.5', got: \" + res);\n        if (!res.contains(\"Total:\")) throw new AssertionError(\"Must format with 'Total:' prefix\");\n    }\n}",
    aTitle: "Day 3 Assignment: Declare Different Types",
    aDesc: "Write a program that declares int age = 20 and boolean isStudent = true and prints them.",
    aStarter: "public class Solution {\n    public static void main(String[] args) {\n        // Declare and print:\n        \n    }\n}",
    aHint: "int age = 20; boolean isStudent = true;",
    aTest: "import java.io.*;\npublic class Test {\n    public static void main(String[] args) {\n        ByteArrayOutputStream out = new ByteArrayOutputStream();\n        System.setOut(new PrintStream(out));\n        Solution.main(new String[]{});\n        String res = out.toString().trim();\n        if (!res.contains(\"20\")) throw new AssertionError(\"Output must contain age 20\");\n        if (!res.contains(\"true\")) throw new AssertionError(\"Output must contain boolean true\");\n    }\n}"
  },

  // ── Day 4: Math Operators ──────────────────────────────────────────────────
  {
    title: "Math Operators & Expressions — Calculations in Java",
    desc: "Perform calculations using +, -, *, /, and %. Master integer division truncation (7 / 2 is 3) and modulo remainder (10 % 3 is 1).",
    syllabus: [
      "Arithmetic Operators: +, -, *, /, %.",
      "Integer Division: Truncating decimals when dividing integers.",
      "Modulo: Finding remainders for even/odd and cycle calculations."
    ],
    eTitle: "Day 4 Challenge: Bill Splitter with Tip",
    eDesc: "Write calculatePerPerson(double bill, double tipPercent, int people) in Solution returning total per person.",
    eStarter: "public class Solution {\n    public static double calculatePerPerson(double bill, double tipPercent, int people) {\n        // Return (bill + (bill * tipPercent)) / people\n        return 0.0;\n    }\n}",
    eHint: "double total = bill + (bill * tipPercent); return total / people;",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Math.abs(Solution.calculatePerPerson(100.0, 0.20, 2) - 60.0) > 0.001) throw new AssertionError(\"100 + 20% / 2 must be 60.0\");\n        if (Math.abs(Solution.calculatePerPerson(200.0, 0.10, 4) - 55.0) > 0.001) throw new AssertionError(\"200 + 10% / 4 must be 55.0\");\n        if (Math.abs(Solution.calculatePerPerson(50.0, 0.0, 1) - 50.0) > 0.001) throw new AssertionError(\"50 + 0% / 1 must be 50.0\");\n    }\n}",
    aTitle: "Day 4 Assignment: Modulo Checker",
    aDesc: "Write isEven(int n) returning true if n is divisible by 2.",
    aStarter: "public class Solution {\n    public static boolean isEven(int n) {\n        // Return true if n % 2 == 0:\n        return false;\n    }\n}",
    aHint: "return n % 2 == 0;",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.isEven(4)) throw new AssertionError(\"4 is even\");\n        if (Solution.isEven(7)) throw new AssertionError(\"7 is odd\");\n        if (!Solution.isEven(0)) throw new AssertionError(\"0 is even\");\n        if (Solution.isEven(-3)) throw new AssertionError(\"-3 is odd\");\n    }\n}"
  },

  // ── Day 5: Conditionals & Milestone 1 ─────────────────────────────────────
  {
    title: "Conditionals & ⭐ MILESTONE 1: Interactive Decision Console",
    desc: "Make decisions with if, else-if, and else branches. (Milestone 1: Build an interactive decision console).",
    syllabus: [
      "if / else Branches: Forking execution based on boolean conditions.",
      "Comparison Operators: ==, !=, <, <=, >, >=.",
      "Logical Operators: && (AND), || (OR), ! (NOT)."
    ],
    eTitle: "Day 5 Milestone 1: Decision Console",
    eDesc: "Write classifyScore(int score) returning 'Pass' if score >= 50, else 'Fail'.",
    eStarter: "public class Solution {\n    public static String classifyScore(int score) {\n        // Return 'Pass' or 'Fail':\n        return \"\";\n    }\n}",
    eHint: "if (score >= 50) return \"Pass\"; else return \"Fail\";",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.classifyScore(75).equals(\"Pass\")) throw new AssertionError(\"75 must be Pass\");\n        if (!Solution.classifyScore(50).equals(\"Pass\")) throw new AssertionError(\"Boundary 50 must be Pass\");\n        if (!Solution.classifyScore(49).equals(\"Fail\")) throw new AssertionError(\"Boundary 49 must be Fail\");\n        if (!Solution.classifyScore(0).equals(\"Fail\")) throw new AssertionError(\"0 must be Fail\");\n        if (!Solution.classifyScore(100).equals(\"Pass\")) throw new AssertionError(\"100 must be Pass\");\n    }\n}",
    aTitle: "Day 5 Assignment: Age Verification",
    aDesc: "Write canVote(int age) returning true if age >= 18.",
    aStarter: "public class Solution {\n    public static boolean canVote(int age) {\n        return false;\n    }\n}",
    aHint: "return age >= 18;",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.canVote(18)) throw new AssertionError(\"18 can vote\");\n        if (!Solution.canVote(25)) throw new AssertionError(\"25 can vote\");\n        if (Solution.canVote(17)) throw new AssertionError(\"17 cannot vote\");\n        if (Solution.canVote(0)) throw new AssertionError(\"0 cannot vote\");\n    }\n}"
  },

  // ── Day 6: Switch Statements ───────────────────────────────────────────────
  {
    title: "Switch Statements & Default Guards",
    desc: "Switch statements jump directly to matching cases. Always include break to prevent fallthrough and default for unhandled cases.",
    syllabus: [
      "switch and case syntax: Direct value matching.",
      "The break statement: Preventing unintentional case fallthrough.",
      "The default branch: Catching all unlisted options."
    ],
    eTitle: "Day 6 Challenge: Day Name Lookup",
    eDesc: "Write getDayName(int day) returning 'Monday' for 1, 'Tuesday' for 2, 'Wednesday' for 3, and 'Unknown' otherwise.",
    eStarter: "public class Solution {\n    public static String getDayName(int day) {\n        // Use a switch statement — case 1 → Monday, 2 → Tuesday, 3 → Wednesday, default → Unknown:\n        \n    }\n}",
    eHint: "Use switch(day) with cases 1, 2, 3 and default.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.getDayName(1).equals(\"Monday\")) throw new AssertionError(\"1 must be Monday\");\n        if (!Solution.getDayName(2).equals(\"Tuesday\")) throw new AssertionError(\"2 must be Tuesday\");\n        if (!Solution.getDayName(3).equals(\"Wednesday\")) throw new AssertionError(\"3 must be Wednesday\");\n        if (!Solution.getDayName(0).equals(\"Unknown\")) throw new AssertionError(\"0 must be Unknown\");\n        if (!Solution.getDayName(99).equals(\"Unknown\")) throw new AssertionError(\"99 must be Unknown\");\n    }\n}",
    aTitle: "Day 6 Assignment: Grade Classifier Switch",
    aDesc: "Write getFeedback(char grade) returning 'Excellent' for 'A', 'Good' for 'B', and 'Retake' otherwise.",
    aStarter: "public class Solution {\n    public static String getFeedback(char grade) {\n        // switch on grade — A → Excellent, B → Good, default → Retake:\n        \n    }\n}",
    aHint: "Use switch (grade) with cases 'A', 'B' and default.",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.getFeedback('A').equals(\"Excellent\")) throw new AssertionError(\"A must be Excellent\");\n        if (!Solution.getFeedback('B').equals(\"Good\")) throw new AssertionError(\"B must be Good\");\n        if (!Solution.getFeedback('F').equals(\"Retake\")) throw new AssertionError(\"F must be Retake\");\n    }\n}"
  },

  // ── Day 7: While Loops ─────────────────────────────────────────────────────
  {
    title: "While & Do-While Loops — Iterative Repetition",
    desc: "Loops repeat instructions while a condition remains true. Always update the loop variable to prevent infinite loops.",
    syllabus: [
      "while loop anatomy: Condition-first iteration.",
      "Loop update step: Advancing the counter to prevent infinite loops.",
      "do-while loop: Executing at least once before checking condition."
    ],
    eTitle: "Day 7 Challenge: Calculate Factorial with While Loop",
    eDesc: "Write factorial(int n) in Solution returning the product of numbers from 1 to n (e.g. 4! = 1*2*3*4 = 24). For n <= 1 return 1.",
    eStarter: "public class Solution {\n    public static int factorial(int n) {\n        // Multiply 1*2*3*...*n using a while loop. Return 1 for n <= 1:\n        \n    }\n}",
    eHint: "Multiply result *= i; inside a while(i <= n) loop.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.factorial(0) != 1) throw new AssertionError(\"0! must be 1\");\n        if (Solution.factorial(1) != 1) throw new AssertionError(\"1! must be 1\");\n        if (Solution.factorial(4) != 24) throw new AssertionError(\"4! must be 24\");\n        if (Solution.factorial(5) != 120) throw new AssertionError(\"5! must be 120\");\n    }\n}",
    aTitle: "Day 7 Assignment: Sum 1 to N While Loop",
    aDesc: "Write sumUpTo(int n) returning 1 + 2 + ... + n.",
    aStarter: "public class Solution {\n    public static int sumUpTo(int n) {\n        // Use a while loop — add i to sum, increment i, until i > n:\n        \n    }\n}",
    aHint: "while (i <= n) { sum += i; i++; }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.sumUpTo(3) != 6) throw new AssertionError(\"1+2+3 must be 6\");\n        if (Solution.sumUpTo(5) != 15) throw new AssertionError(\"Sum to 5 must be 15\");\n        if (Solution.sumUpTo(0) != 0) throw new AssertionError(\"Sum to 0 must be 0\");\n    }\n}"
  },

  // ── Day 8: For Loops ───────────────────────────────────────────────────────
  {
    title: "For Loops & Nested Iteration",
    desc: "The for loop packages initialization, condition, and increment into a single compact header. Perfect for counting and iteration.",
    syllabus: [
      "The 3-part for loop header: (init; condition; update).",
      "Counting Up & Counting Down: Controlling step sizes (i++, i += 2).",
      "Nested for loops: Iterating grids and 2D spaces."
    ],
    eTitle: "Day 8 Challenge: Sum of Even Numbers",
    eDesc: "Write sumEvens(int n) returning sum of all even numbers from 2 up to n.",
    eStarter: "public class Solution {\n    public static int sumEvens(int n) {\n        // Use a for loop starting at 2, stepping by 2, up to n:\n        \n    }\n}",
    eHint: "for (int i = 2; i <= n; i += 2) sum += i;",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.sumEvens(6) != 12) throw new AssertionError(\"2+4+6 must be 12\");\n        if (Solution.sumEvens(10) != 30) throw new AssertionError(\"2+4+6+8+10 must be 30\");\n        if (Solution.sumEvens(1) != 0) throw new AssertionError(\"No evens <= 1 must be 0\");\n        if (Solution.sumEvens(7) != 12) throw new AssertionError(\"Evens <= 7 must be 12\");\n    }\n}",
    aTitle: "Day 8 Assignment: Count Down String",
    aDesc: "Write countDown(int start) returning '3 2 1 ' for start = 3.",
    aStarter: "public class Solution {\n    public static String countDown(int start) {\n        // Loop from start down to 1, appending each number + space to a String:\n        \n    }\n}",
    aHint: "for (int i = start; i >= 1; i--)",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.countDown(3).equals(\"3 2 1 \")) throw new AssertionError(\"Must return '3 2 1 '\");\n        if (!Solution.countDown(1).equals(\"1 \")) throw new AssertionError(\"Must return '1 '\");\n    }\n}"
  },

  // ── Day 9: Custom Methods ──────────────────────────────────────────────────
  {
    title: "Modular Programming — Custom Methods & Reusable Logic",
    desc: "Custom methods package reusable code under a named identifier. Learn return types, parameter passing, and the pass-by-value photocopy rule.",
    syllabus: [
      "The DRY Principle: Writing instructions once and calling them anywhere.",
      "Method Anatomy: Return type, parameter list, method body.",
      "Pass-by-Value: Why modifying primitive parameters never alters caller variables."
    ],
    eTitle: "Day 9 Challenge: Total Price Calculator",
    eDesc: "Write calculateTotal(double price, double taxRate) in Solution returning price + (price * taxRate).",
    eStarter: "public class Solution {\n    public static double calculateTotal(double price, double taxRate) {\n        // Return price plus the tax amount (price * taxRate):\n        \n    }\n}",
    eHint: "Multiply price by taxRate to get the tax amount, then add that amount to the original price.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Math.abs(Solution.calculateTotal(100.0, 0.05) - 105.0) > 0.001) throw new AssertionError(\"100 + 5% tax must be 105.0\");\n        if (Math.abs(Solution.calculateTotal(50.0, 0.10) - 55.0) > 0.001) throw new AssertionError(\"50 + 10% tax must be 55.0\");\n        if (Math.abs(Solution.calculateTotal(200.0, 0.0) - 200.0) > 0.001) throw new AssertionError(\"200 + 0% tax must be 200.0\");\n    }\n}",
    aTitle: "Day 9 Assignment: Max of Two Numbers",
    aDesc: "Write max(int a, int b) returning the larger of the two numbers.",
    aStarter: "public class Solution {\n    public static int max(int a, int b) {\n        // Return the larger of a or b (use if/else or ternary):\n        \n    }\n}",
    aHint: "return (a >= b) ? a : b;",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.max(10, 20) != 20) throw new AssertionError(\"max(10, 20) must be 20\");\n        if (Solution.max(50, 30) != 50) throw new AssertionError(\"max(50, 30) must be 50\");\n        if (Solution.max(-5, -10) != -5) throw new AssertionError(\"max(-5, -10) must be -5\");\n    }\n}"
  },

  // ── Day 10: Call Stack & Milestone 2 ───────────────────────────────────────
  {
    title: "Call Stack, Scopes & ⭐ MILESTONE 2: Financial Utility Engine",
    desc: "Understand how the Call Stack pushes and pops stack frames. (Milestone 2: Modular Financial Utility Engine).",
    syllabus: [
      "The Call Stack: Stack frames, pushing, and popping upon return.",
      "Block Scope: Local visibility within { curly braces }.",
      "Method Composition: Helper methods calling helper methods."
    ],
    eTitle: "Day 10 Milestone 2: Financial Utility Engine",
    eDesc: "Write applyDiscount(double p, double d) and finalPrice(double p, double d, double t) returning discounted price + tax in Solution.",
    eStarter: "public class Solution {\n    public static double applyDiscount(double p, double d) {\n        // Return p minus the discount amount (p * d):\n        \n    }\n    public static double finalPrice(double p, double d, double t) {\n        // Call applyDiscount, then add tax on the discounted price:\n        \n    }\n}",
    eHint: "double disc = applyDiscount(p, d); return disc + (disc * t);",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Math.abs(Solution.applyDiscount(100.0, 0.10) - 90.0) > 0.001) throw new AssertionError(\"100 with 10% disc must be 90.0\");\n        if (Math.abs(Solution.finalPrice(100.0, 0.10, 0.05) - 94.5) > 0.001) throw new AssertionError(\"90 with 5% tax must be 94.5\");\n        if (Math.abs(Solution.finalPrice(200.0, 0.0, 0.08) - 216.0) > 0.001) throw new AssertionError(\"200 with 0% disc and 8% tax must be 216.0\");\n    }\n}",
    aTitle: "Day 10 Assignment: Temperature Converter",
    aDesc: "Write cToF(double celsius) returning (celsius * 9/5) + 32.",
    aStarter: "public class Solution {\n    public static double cToF(double c) {\n        // Celsius to Fahrenheit: multiply by 9/5, then add 32:\n        \n    }\n}",
    aHint: "return (c * 9.0 / 5.0) + 32.0;",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (Math.abs(Solution.cToF(0.0) - 32.0) > 0.001) throw new AssertionError(\"0C must be 32F\");\n        if (Math.abs(Solution.cToF(100.0) - 212.0) > 0.001) throw new AssertionError(\"100C must be 212F\");\n    }\n}"
  },

  // ── Day 11: Method Overloading ─────────────────────────────────────────────
  {
    title: "Method Overloading & Clean Signatures",
    desc: "Overloading allows multiple methods in the same class to share a name if their parameter types or counts differ.",
    syllabus: [
      "Overloading by Type: Handling ints vs doubles.",
      "Overloading by Count: Optional default parameters.",
      "Signature Differentiation: Why return type alone does not overload."
    ],
    eTitle: "Day 11 Challenge: Overloaded Area Calculator",
    eDesc: "Write calculateArea(int side) returning square area, and calculateArea(int l, int w) returning rectangle area.",
    eStarter: "public class Solution {\n    public static int calculateArea(int side) {\n        // Return side squared:\n        \n    }\n    public static int calculateArea(int l, int w) {\n        // Return length * width:\n        \n    }\n}",
    eHint: "Define two calculateArea methods with different parameter lists.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.calculateArea(5) != 25) throw new AssertionError(\"Square 5 must be 25\");\n        if (Solution.calculateArea(0) != 0) throw new AssertionError(\"Square 0 must be 0\");\n        if (Solution.calculateArea(4, 7) != 28) throw new AssertionError(\"Rect 4x7 must be 28\");\n        if (Solution.calculateArea(10, 2) != 20) throw new AssertionError(\"Rect 10x2 must be 20\");\n    }\n}",
    aTitle: "Day 11 Assignment: Overloaded String Multiplier",
    aDesc: "Write repeat(String s) returning s + s, and repeat(String s, int times) repeating s times times.",
    aStarter: "public class Solution {\n    public static String repeat(String s) {\n        // Return s concatenated with itself:\n        \n    }\n    public static String repeat(String s, int n) {\n        // Use a loop to concatenate s exactly n times:\n        \n    }\n}",
    aHint: "Use a loop for repeat(s, n).",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.repeat(\"Hi\").equals(\"HiHi\")) throw new AssertionError(\"Default repeat must be HiHi\");\n        if (!Solution.repeat(\"A\", 3).equals(\"AAA\")) throw new AssertionError(\"A x 3 must be AAA\");\n    }\n}"
  },

  // ── Day 12: 1D Arrays ──────────────────────────────────────────────────────
  {
    title: "1D Arrays — Contiguous Memory Allocation & Indexing",
    desc: "Store multiple values of the same type in a single contiguous array. Master 0-based indexing and the array.length property.",
    syllabus: [
      "Array Allocation: new int[size] and literal { } initialization.",
      "0-Based Indexing: Accessing array[0] through array[length - 1].",
      "ArrayIndexOutOfBoundsException: Preventing off-by-one index crashes."
    ],
    eTitle: "Day 12 Challenge: Find Maximum in Array",
    eDesc: "Write findMax(int[] arr) returning the highest integer in arr.",
    eStarter: "public class Solution {\n    public static int findMax(int[] arr) {\n        // Initialize max = arr[0], then loop from index 1 comparing each element:\n        \n    }\n}",
    eHint: "Initialize max = arr[0] and iterate through the rest.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.findMax(new int[]{ 10, 50, 20, 80, 30 }) != 80) throw new AssertionError(\"Max must be 80\");\n        if (Solution.findMax(new int[]{ 99 }) != 99) throw new AssertionError(\"Single element max must be 99\");\n        if (Solution.findMax(new int[]{ -10, -50, -5, -20 }) != -5) throw new AssertionError(\"Negative max must be -5\");\n        if (Solution.findMax(new int[]{ 100, 20, 30 }) != 100) throw new AssertionError(\"First element max must be 100\");\n    }\n}",
    aTitle: "Day 12 Assignment: Array Sum",
    aDesc: "Write sumArray(int[] arr) returning total sum of elements.",
    aStarter: "public class Solution {\n    public static int sumArray(int[] arr) {\n        // Start sum = 0, loop through arr adding each element:\n        \n    }\n}",
    aHint: "for (int i = 0; i < arr.length; i++) sum += arr[i];",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.sumArray(new int[]{1, 2, 3}) != 6) throw new AssertionError(\"Sum 1+2+3 must be 6\");\n        if (Solution.sumArray(new int[]{}) != 0) throw new AssertionError(\"Empty array sum must be 0\");\n    }\n}"
  },

  // ── Day 13: Enhanced For-Each ──────────────────────────────────────────────
  {
    title: "Enhanced For-Each Loop & Array Traversal",
    desc: "Traverse arrays cleanly with for (Type item : array) without needing manual index counters.",
    syllabus: [
      "for-each loop syntax: Clean item-by-item iteration.",
      "Read-only traversal: When to use for-each vs standard for loop.",
      "Accumulation and filtering patterns."
    ],
    eTitle: "Day 13 Challenge: Count Positive Numbers",
    eDesc: "Write countPositives(int[] arr) using a for-each loop to return the count of numbers > 0.",
    eStarter: "public class Solution {\n    public static int countPositives(int[] arr) {\n        // Use a for-each loop — count++ each time n > 0:\n        \n    }\n}",
    eHint: "Use a for-each loop to visit each element; increment a counter whenever the element is greater than zero.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.countPositives(new int[]{ -5, 10, 0, 20, -1 }) != 2) throw new AssertionError(\"Must find 2 positives (10, 20)\");\n        if (Solution.countPositives(new int[]{ 1, 2, 3 }) != 3) throw new AssertionError(\"All positive must be 3\");\n        if (Solution.countPositives(new int[]{ -1, -2, 0 }) != 0) throw new AssertionError(\"None positive must be 0\");\n        if (Solution.countPositives(new int[]{}) != 0) throw new AssertionError(\"Empty array must return 0\");\n    }\n}",
    aTitle: "Day 13 Assignment: String Array Joiner",
    aDesc: "Write joinStrings(String[] words) returning words concatenated with commas.",
    aStarter: "public class Solution {\n    public static String joinStrings(String[] words) {\n        // Use a for-each loop — append each word + ',' to a result String:\n        \n    }\n}",
    aHint: "for (String w : words) res += w + \",\";",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.joinStrings(new String[]{\"A\", \"B\"}).equals(\"A,B,\")) throw new AssertionError(\"Must return 'A,B,'\");\n    }\n}"
  },

  // ── Day 14: 2D Arrays ──────────────────────────────────────────────────────
  {
    title: "2D Arrays & Grid Traversal",
    desc: "Model grids, matrices, and game boards using 2D arrays (arr[row][col]) and nested loop traversal.",
    syllabus: [
      "2D Array Dimensions: Rows and columns in heap memory.",
      "Nested Loop Traversal: Outer row loop, inner col loop.",
      "Matrix operations: Summing rows, columns, and diagonals."
    ],
    eTitle: "Day 14 Challenge: Matrix Diagonal Sum",
    eDesc: "Write sumDiagonal(int[][] matrix) returning sum of matrix[i][i] across an N x N square matrix.",
    eStarter: "public class Solution {\n    public static int sumDiagonal(int[][] matrix) {\n        // Loop with index i, sum matrix[i][i] for each row:\n        \n    }\n}",
    eHint: "for (int i = 0; i < matrix.length; i++) sum += matrix[i][i];",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        int[][] m1 = { { 1, 2 }, { 3, 4 } };\n        if (Solution.sumDiagonal(m1) != 5) throw new AssertionError(\"Diagonal 1+4 must be 5\");\n        int[][] m2 = { { 5, 0, 0 }, { 0, 10, 0 }, { 0, 0, 15 } };\n        if (Solution.sumDiagonal(m2) != 30) throw new AssertionError(\"Diagonal 5+10+15 must be 30\");\n        int[][] m3 = { { 99 } };\n        if (Solution.sumDiagonal(m3) != 99) throw new AssertionError(\"1x1 matrix diagonal must be 99\");\n    }\n}",
    aTitle: "Day 14 Assignment: Count Total Matrix Elements",
    aDesc: "Write countCells(int[][] grid) returning total number of cells in the 2D grid.",
    aStarter: "public class Solution {\n    public static int countCells(int[][] grid) {\n        // Loop through each row, add grid[r].length to total count:\n        \n    }\n}",
    aHint: "Count rows * cols.",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        int[][] g = { { 1, 2, 3 }, { 4, 5, 6 } };\n        if (Solution.countCells(g) != 6) throw new AssertionError(\"2x3 must have 6 cells\");\n    }\n}"
  },

  // ── Day 15: Binary Search & Milestone 3 ───────────────────────────────────
  {
    title: "Search Algorithms & ⭐ MILESTONE 3: Fast Data Ledger",
    desc: "Linear search vs Binary search. (Milestone 3: Fast Data Ledger & Binary Search Engine).",
    syllabus: [
      "Linear Search: O(N) sequential search.",
      "Binary Search: O(log N) divide-and-conquer on sorted arrays.",
      "The Sorted Invariant: Why binary search requires ascending order."
    ],
    eTitle: "Day 15 Milestone 3: Binary Search Ledger",
    eDesc: "Write binarySearch(int[] arr, int target) in Solution returning index of target in sorted arr, or -1 if not found.",
    eStarter: "public class Solution {\n    public static int binarySearch(int[] arr, int target) {\n        // Set low=0, high=arr.length-1. Loop while low<=high:\n        // Calculate mid, compare arr[mid] to target, adjust low or high:\n        \n    }\n}",
    eHint: "Use while (low <= high) and calculate mid = low + (high - low) / 2.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        int[] arr = { 10, 20, 30, 40, 50, 60, 70 };\n        if (Solution.binarySearch(arr, 10) != 0) throw new AssertionError(\"Target at first index 0 failed\");\n        if (Solution.binarySearch(arr, 40) != 3) throw new AssertionError(\"Target at middle index 3 failed\");\n        if (Solution.binarySearch(arr, 70) != 6) throw new AssertionError(\"Target at last index 6 failed\");\n        if (Solution.binarySearch(arr, 99) != -1) throw new AssertionError(\"Missing element 99 must return -1\");\n        if (Solution.binarySearch(arr, 5) != -1) throw new AssertionError(\"Missing element 5 < min must return -1\");\n        if (Solution.binarySearch(new int[]{ 42 }, 42) != 0) throw new AssertionError(\"Single element match failed\");\n        if (Solution.binarySearch(new int[]{ 42 }, 99) != -1) throw new AssertionError(\"Single element missing failed\");\n    }\n}",
    aTitle: "Day 15 Assignment: Linear Search",
    aDesc: "Write linearSearch(int[] arr, int target) returning index of target or -1.",
    aStarter: "public class Solution {\n    public static int linearSearch(int[] arr, int target) {\n        // Loop through arr — if arr[i] equals target, return i. Return -1 after loop:\n        \n    }\n}",
    aHint: "for (int i = 0; i < arr.length; i++) if (arr[i] == target) return i;",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        int[] arr = { 5, 2, 8, 1 };\n        if (Solution.linearSearch(arr, 8) != 2) throw new AssertionError(\"8 must be at index 2\");\n        if (Solution.linearSearch(arr, 99) != -1) throw new AssertionError(\"99 must return -1\");\n    }\n}"
  },

  // ── Day 16: OOP: Classes vs Objects ────────────────────────────────────────
  {
    title: "Object-Oriented Programming — Classes & Objects",
    desc: "A Class is an architectural blueprint; an Object is the real instance constructed in heap memory using new.",
    syllabus: [
      "Class Blueprint vs Object Instance.",
      "The new Keyword: Allocating RAM on the Heap.",
      "Dot Notation: Accessing instance fields and methods."
    ],
    eTitle: "Day 16 Challenge: BankAccount Class",
    eDesc: "Create class BankAccount with int balance, deposit(int amt), and getBalance().",
    eStarter: "class BankAccount {\n    int balance = 0;\n    void deposit(int amt) {\n        // Add amt to balance:\n        \n    }\n    int getBalance() {\n        // Return the balance field:\n        \n    }\n}\npublic class Solution {\n    public static int testBank() {\n        BankAccount acc = new BankAccount(); acc.deposit(500); return acc.getBalance();\n    }\n}",
    eHint: "class BankAccount { int balance = 0; void deposit(int amt) { balance += amt; } int getBalance() { return balance; } }",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        BankAccount b1 = new BankAccount();\n        if (b1.getBalance() != 0) throw new AssertionError(\"Initial balance must be 0\");\n        b1.deposit(500);\n        if (b1.getBalance() != 500) throw new AssertionError(\"Deposit 500 must produce 500\");\n        b1.deposit(250);\n        if (b1.getBalance() != 750) throw new AssertionError(\"Second deposit must sum to 750\");\n        BankAccount b2 = new BankAccount();\n        b2.deposit(100);\n        if (b2.getBalance() != 100) throw new AssertionError(\"b2 balance must be independent (100)\");\n        if (b1.getBalance() != 750) throw new AssertionError(\"b1 balance must remain 750\");\n    }\n}",
    aTitle: "Day 16 Assignment: Car Class",
    aDesc: "Create Car with String model and int speed, and drive() method returning speed.",
    aStarter: "class Car {\n    String model;\n    int speed;\n    Car(String model, int speed) {\n        // Initialize fields:\n        \n    }\n    int getSpeed() {\n        // Return the speed field:\n        \n    }\n}\npublic class Solution {\n    public static int getSpeed() { return new Car(\"SportX\", 60).getSpeed(); }\n}",
    aHint: "class Car { int speed = 60; int getSpeed() { return speed; } }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.getSpeed() != 60) throw new AssertionError(\"Speed must be 60\");\n    }\n}"
  },

  // ── Day 17: Constructors & this ────────────────────────────────────────────
  {
    title: "Constructors & The this Keyword",
    desc: "Constructors initialize objects atomically the moment they are created in memory. Use this to bind parameters to instance fields.",
    syllabus: [
      "Constructor Anatomy: Matching class name with no return type.",
      "Parameterized Constructors: Passing initial field values.",
      "The this Keyword: Disambiguating field names from parameter names."
    ],
    eTitle: "Day 17 Challenge: User Constructor",
    eDesc: "Create class User with fields String name, int age, and constructor User(String name, int age).",
    eStarter: "class User {\n    String name;\n    int age;\n    User(String name, int age) {\n        // Assign each parameter to the matching field using 'this':\n        \n    }\n}\npublic class Solution {\n    public static User createUser(String name, int age) { return new User(name, age); }\n}",
    eHint: "Assign each constructor parameter to the matching instance field using `this.field = parameter` to distinguish the field from the local name.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        User u1 = Solution.createUser(\"Vinay\", 22);\n        if (!u1.name.equals(\"Vinay\") || u1.age != 22) throw new AssertionError(\"User Vinay 22 failed\");\n        User u2 = Solution.createUser(\"Alice\", 30);\n        if (!u2.name.equals(\"Alice\") || u2.age != 30) throw new AssertionError(\"User Alice 30 failed\");\n    }\n}",
    aTitle: "Day 17 Assignment: Book Constructor",
    aDesc: "Create Book with constructor Book(String title, double price).",
    aStarter: "class Book {\n    String title;\n    double price;\n    Book(String title, double price) {\n        // Assign parameters to instance fields using 'this':\n        \n    }\n}\npublic class Solution {\n    public static String getTitle() { return new Book(\"Java\", 29.99).title; }\n}",
    aHint: "Book(String title, double price) { this.title = title; this.price = price; }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.getTitle().equals(\"Java\")) throw new AssertionError(\"Title must be Java\");\n    }\n}"
  },

  // ── Day 18: Encapsulation ──────────────────────────────────────────────────
  {
    title: "Encapsulation — private Fields, Getters & Setters",
    desc: "Encapsulate class internals with private fields and expose controlled access through getters and validated setters.",
    syllabus: [
      "Data Hiding: The private access modifier.",
      "Getters and Setters: Controlled read/write access.",
      "Defensive Setters: Validating input before mutating fields."
    ],
    eTitle: "Day 18 Challenge: Secure Bank Account",
    eDesc: "Create SecureAccount with private int balance, getBalance(), and deposit(int amt) that ignores negative amounts.",
    eStarter: "class SecureAccount {\n    private int balance = 0;\n    public int getBalance() { return balance; }\n    public void deposit(int amt) {\n        // Only add amt to balance if amt is positive (> 0):\n        \n    }\n}\npublic class Solution {\n    public static int test() { SecureAccount a = new SecureAccount(); a.deposit(200); a.deposit(-50); return a.getBalance(); }\n}",
    eHint: "private int balance; if (amt > 0) balance += amt;",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        SecureAccount acc = new SecureAccount();\n        if (acc.getBalance() != 0) throw new AssertionError(\"Initial balance must be 0\");\n        acc.deposit(300);\n        if (acc.getBalance() != 300) throw new AssertionError(\"Deposit 300 must result in 300\");\n        acc.deposit(-100);\n        if (acc.getBalance() != 300) throw new AssertionError(\"Negative deposit must be rejected and balance remain 300\");\n        acc.deposit(0);\n        if (acc.getBalance() != 300) throw new AssertionError(\"Zero deposit must leave balance unchanged\");\n    }\n}",
    aTitle: "Day 18 Assignment: Student GPA Encapsulation",
    aDesc: "Create Student with private double gpa, setGpa(double g), and getGpa().",
    aStarter: "class Student {\n    private double gpa;\n    public void setGpa(double g) {\n        // Set gpa only if g is between 0.0 and 4.0 inclusive:\n        \n    }\n    public double getGpa() {\n        // Return the gpa field:\n        \n    }\n}\npublic class Solution {\n    public static double test() { Student s = new Student(); s.setGpa(3.8); return s.getGpa(); }\n}",
    aHint: "private double gpa; public void setGpa(double g) { ... }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.test() != 3.8) throw new AssertionError(\"GPA must be 3.8\");\n    }\n}"
  },

  // ── Day 19: Inheritance ────────────────────────────────────────────────────
  {
    title: "Inheritance — Parent-Child Class Hierarchies & extends",
    desc: "Inherit fields and methods from superclasses using extends. Reuse existing code while adding specialized subclass behavior.",
    syllabus: [
      "Class Inheritance: Superclass and subclass relationships.",
      "The extends keyword: Inheriting state and methods.",
      "The super constructor call: Initializing parent state."
    ],
    eTitle: "Day 19 Challenge: Employee & Manager Hierarchy",
    eDesc: "Create Employee with double salary = 50000.0, and Manager extends Employee with double bonus = 10000.0, and getTotalPay() returning salary + bonus.",
    eStarter: "class Employee {\n    double salary = 50000.0;\n}\nclass Manager extends Employee {\n    double bonus = 10000.0;\n    double getTotalPay() {\n        // Return salary (inherited) plus bonus:\n        \n    }\n}\npublic class Solution {\n    public static double getPay() { return new Manager().getTotalPay(); }\n}",
    eHint: "class Manager extends Employee { double bonus = 10000.0; double getTotalPay() { return salary + bonus; } }",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        Manager m = new Manager();\n        if (m.salary != 50000.0) throw new AssertionError(\"Inherited salary must be 50000.0\");\n        if (m.bonus != 10000.0) throw new AssertionError(\"Manager bonus must be 10000.0\");\n        if (m.getTotalPay() != 60000.0) throw new AssertionError(\"Total pay must be 60000.0\");\n    }\n}",
    aTitle: "Day 19 Assignment: Vehicle and Bike Hierarchy",
    aDesc: "Create Vehicle with int wheels = 4, and Bike extends Vehicle with wheels = 2.",
    aStarter: "class Vehicle { int wheels = 4; }\nclass Bike extends Vehicle {\n    Bike() {\n        // Override the inherited wheels field to 2:\n        \n    }\n}\npublic class Solution { public static int getWheels() { return new Bike().wheels; } }",
    aHint: "class Bike extends Vehicle { Bike() { wheels = 2; } }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.getWheels() != 2) throw new AssertionError(\"Bike wheels must be 2\");\n    }\n}"
  },

  // ── Day 20: Polymorphism ───────────────────────────────────────────────────
  {
    title: "Polymorphism & Dynamic Dispatch — @Override",
    desc: "Polymorphism enables treating subclasses through a superclass reference, dynamically executing overridden methods at runtime.",
    syllabus: [
      "Method Overriding: Redefining superclass methods with @Override.",
      "Dynamic Method Dispatch: Runtime method resolution.",
      "Polymorphic Collections: Storing different subclasses in one list."
    ],
    eTitle: "Day 20 Challenge: Polymorphic Payment Fees",
    eDesc: "Create Payment with double getFee(), and CardPayment overriding getFee() returning 2.50.",
    eStarter: "class Payment {\n    double getFee() { return 0.0; }\n}\nclass CardPayment extends Payment {\n    @Override\n    double getFee() {\n        // Return the card payment fee (2.50):\n        \n    }\n}\npublic class Solution {\n    public static double testFee() { Payment p = new CardPayment(); return p.getFee(); }\n}",
    eHint: "Use @Override double getFee() in CardPayment.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        Payment base = new Payment();\n        if (base.getFee() != 0.0) throw new AssertionError(\"Base payment fee must be 0.0\");\n        Payment poly = new CardPayment();\n        if (poly.getFee() != 2.50) throw new AssertionError(\"Polymorphic CardPayment fee must be 2.50\");\n    }\n}",
    aTitle: "Day 20 Assignment: Animal Sounds Polymorphism",
    aDesc: "Create Animal with speak() returning '...', and Cat overriding speak() returning 'Meow'.",
    aStarter: "class Animal { String speak() { return \"...\"; } }\nclass Cat extends Animal {\n    @Override\n    String speak() {\n        // Return \"Meow\":\n        \n    }\n}\npublic class Solution { public static String test() { Animal a = new Cat(); return a.speak(); } }",
    aHint: "@Override String speak() { return \"Meow\"; }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.test().equals(\"Meow\")) throw new AssertionError(\"Cat must speak Meow\");\n    }\n}"
  },

  // ── Day 21: Interfaces & Milestone 4 ───────────────────────────────────────
  {
    title: "Interfaces & ⭐ MILESTONE 4: Enterprise Payment Gateway",
    desc: "Interfaces specify pure contracts that implementing classes must fulfill. (Milestone 4: Enterprise Payment Gateway Interface).",
    syllabus: [
      "Interface Contract: Method signatures without implementation.",
      "The implements keyword: Fulfilling contract requirements.",
      "Decoupled Architecture: Interchanging payment gateways seamlessly."
    ],
    eTitle: "Day 21 Milestone 4: Payment Gateway Interface",
    eDesc: "Create interface PaymentGateway with boolean processPayment(double amount), and class CryptoGateway implementing it.",
    eStarter: "interface PaymentGateway {\n    boolean processPayment(double amount);\n}\nclass CryptoGateway implements PaymentGateway {\n    public boolean processPayment(double amount) {\n        // Return true if amount is positive (> 0):\n        \n    }\n}\npublic class Solution {\n    public static boolean execute(double amt) { PaymentGateway gw = new CryptoGateway(); return gw.processPayment(amt); }\n}",
    eHint: "class CryptoGateway implements PaymentGateway { public boolean processPayment(double amount) { return amount > 0; } }",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        PaymentGateway gw = new CryptoGateway();\n        if (!gw.processPayment(100.0)) throw new AssertionError(\"Valid 100.0 payment must return true\");\n        if (gw.processPayment(0.0)) throw new AssertionError(\"0.0 payment must return false\");\n        if (gw.processPayment(-50.0)) throw new AssertionError(\"Negative payment must return false\");\n    }\n}",
    aTitle: "Day 21 Assignment: Printable Interface",
    aDesc: "Create interface Printable with String print(), and Document implementing it returning 'Document printed'.",
    aStarter: "interface Printable { String print(); }\nclass Document implements Printable {\n    public String print() {\n        // Return \"Document printed\":\n        \n    }\n}\npublic class Solution { public static String test() { Printable p = new Document(); return p.print(); } }",
    aHint: "class Document implements Printable { public String print() { ... } }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (!Solution.test().equals(\"Document printed\")) throw new AssertionError(\"Must print Document printed\");\n    }\n}"
  },

  // ── Day 22: Static State ───────────────────────────────────────────────────
  {
    title: "Static State — Class-Level Variables & Utility Methods",
    desc: "Static fields and methods belong to the Class itself rather than individual instances. Shared memory across all objects.",
    syllabus: [
      "static Variables: A single shared memory copy per class.",
      "static Methods: Utility helpers (Math.max, Solution.add).",
      "Static context rules: Why static methods cannot access this."
    ],
    eTitle: "Day 22 Challenge: Static Instance Counter",
    eDesc: "Create class Counter with static int count = 0, incremented in constructor Counter().",
    eStarter: "class Counter {\n    static int count = 0;\n    Counter() {\n        // Increment the shared static count field each time an instance is created:\n        \n    }\n}\npublic class Solution {\n    public static int testCount() {\n        Counter.count = 0; new Counter(); new Counter(); new Counter(); return Counter.count;\n    }\n}",
    eHint: "Declare the counter with `static` so it belongs to the class rather than any single object; then increment it inside the constructor so every new instance contributes.",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        Counter.count = 0;\n        if (Counter.count != 0) throw new AssertionError(\"Initial static count must be 0\");\n        new Counter();\n        new Counter();\n        if (Counter.count != 2) throw new AssertionError(\"Creating 2 objects must result in count 2\");\n        new Counter();\n        if (Counter.count != 3) throw new AssertionError(\"Creating 3rd object must result in count 3\");\n    }\n}",
    aTitle: "Day 22 Assignment: Static Math Utility",
    aDesc: "Create MathUtil with static int square(int n) returning n * n.",
    aStarter: "class MathUtil {\n    public static int square(int n) {\n        // Return n multiplied by itself:\n        \n    }\n}\npublic class Solution { public static int test() { return MathUtil.square(6); } }",
    aHint: "public static int square(int n) { return n * n; }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        if (MathUtil.square(6) != 36) throw new AssertionError(\"6 squared must be 36\");\n        if (MathUtil.square(-4) != 16) throw new AssertionError(\"-4 squared must be 16\");\n    }\n}"
  },

  // ── Day 23: Exception Handling ─────────────────────────────────────────────
  {
    title: "Robust Exception Handling — try-catch-finally",
    desc: "Catch and recover from runtime exceptions (ArithmeticException, NullPointerException) without crashing the application.",
    syllabus: [
      "try Block: Guarding risky operations.",
      "catch Block: Handling specific exception types gracefully.",
      "finally Block: Guaranteed resource cleanup."
    ],
    eTitle: "Day 23 Challenge: Safe Division Parser",
    eDesc: "Write safeDivide(int a, int b) returning a / b, or returning -1 if ArithmeticException occurs.",
    eStarter: "public class Solution {\n    public static int safeDivide(int a, int b) {\n        // Try to return a / b. If ArithmeticException (division by zero), return -1:\n        \n    }\n}",
    eHint: "try { return a / b; } catch (ArithmeticException e) { return -1; }",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        if (Solution.safeDivide(20, 4) != 5) throw new AssertionError(\"20 / 4 must be 5\");\n        if (Solution.safeDivide(10, 0) != -1) throw new AssertionError(\"10 / 0 must return -1 on catch\");\n        if (Solution.safeDivide(0, 5) != 0) throw new AssertionError(\"0 / 5 must be 0\");\n        if (Solution.safeDivide(-15, 3) != -5) throw new AssertionError(\"-15 / 3 must be -5\");\n    }\n}",
    aTitle: "Day 23 Assignment: Array Index Safe Reader",
    aDesc: "Write safeGet(int[] arr, int index) returning arr[index] or -1 if ArrayIndexOutOfBoundsException.",
    aStarter: "public class Solution {\n    public static int safeGet(int[] arr, int i) {\n        // Try to return arr[i]. If index is out of bounds, return -1:\n        \n    }\n}",
    aHint: "try { return arr[i]; } catch (ArrayIndexOutOfBoundsException e) { return -1; }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        int[] arr = { 10, 20 };\n        if (Solution.safeGet(arr, 0) != 10) throw new AssertionError(\"Index 0 must be 10\");\n        if (Solution.safeGet(arr, 99) != -1) throw new AssertionError(\"Index 99 out of bounds must return -1\");\n    }\n}"
  },

  // ── Day 24: Throwing Exceptions ────────────────────────────────────────────
  {
    title: "Defensive Programming & Custom Exceptions — throw",
    desc: "Validate invariants and reject invalid state early using throw new IllegalArgumentException(...).",
    syllabus: [
      "Defensive Programming: Validating arguments at boundary methods.",
      "The throw statement: Blowing the whistle on illegal state.",
      "Custom Exception Messages: Providing clear diagnostic feedback."
    ],
    eTitle: "Day 24 Challenge: Validate Deposit Amount",
    eDesc: "Write validateDeposit(int amt) throwing IllegalArgumentException if amt <= 0.",
    eStarter: "public class Solution {\n    public static void validateDeposit(int amt) {\n        // If amt is 0 or negative, throw new IllegalArgumentException with a message:\n        \n    }\n}",
    eHint: "if (amt <= 0) throw new IllegalArgumentException(\"Deposit must be positive\");",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        // Test valid deposit does not throw\n        try {\n            Solution.validateDeposit(100);\n        } catch (IllegalArgumentException e) {\n            throw new AssertionError(\"Valid deposit 100 must not throw\");\n        }\n        // Test negative deposit throws\n        boolean caughtNegative = false;\n        try {\n            Solution.validateDeposit(-50);\n        } catch (IllegalArgumentException e) {\n            caughtNegative = true;\n        }\n        if (!caughtNegative) throw new AssertionError(\"Negative deposit must throw IllegalArgumentException\");\n        // Test 0 deposit throws\n        boolean caughtZero = false;\n        try {\n            Solution.validateDeposit(0);\n        } catch (IllegalArgumentException e) {\n            caughtZero = true;\n        }\n        if (!caughtZero) throw new AssertionError(\"Zero deposit must throw IllegalArgumentException\");\n    }\n}",
    aTitle: "Day 24 Assignment: Age Validator",
    aDesc: "Write checkAge(int age) throwing IllegalArgumentException if age < 18.",
    aStarter: "public class Solution {\n    public static void checkAge(int age) {\n        // If age is below 18, throw new IllegalArgumentException(\"Underage\"):\n        \n    }\n}",
    aHint: "if (age < 18) throw new IllegalArgumentException(\"Underage\");",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        boolean caught = false;\n        try { Solution.checkAge(15); } catch (IllegalArgumentException e) { caught = true; }\n        if (!caught) throw new AssertionError(\"Age 15 must throw\");\n    }\n}"
  },

  // ── Day 25: Dynamic ArrayList<T> ───────────────────────────────────────────
  {
    title: "Dynamic Collections — ArrayList<T>",
    desc: "Resizable arrays that grow dynamically. Master add(), get(), set(), remove(), and size().",
    syllabus: [
      "ArrayList vs Fixed Arrays: Resizable heap storage.",
      "CRUD Operations: add, get, set, remove, size.",
      "Wrapper Classes: ArrayList<Integer>, ArrayList<Double>."
    ],
    eTitle: "Day 25 Challenge: Filter High Scores",
    eDesc: "Write filterAbove(int[] scores, int cutoff) in Solution returning an ArrayList<Integer> of all scores > cutoff.",
    eStarter: "import java.util.ArrayList;\n\npublic class Solution {\n    public static ArrayList<Integer> filterAbove(int[] scores, int cutoff) {\n        // Create an ArrayList<Integer>, add each score that is > cutoff, return the list:\n        \n    }\n}",
    eHint: "ArrayList<Integer> list = new ArrayList<>(); for (int s : scores) if (s > cutoff) list.add(s); return list;",
    eTest: "import java.util.ArrayList;\npublic class Test {\n    public static void main(String[] args) {\n        int[] scores = { 45, 90, 78, 95, 60 };\n        ArrayList<Integer> res = Solution.filterAbove(scores, 75);\n        if (res.size() != 3) throw new AssertionError(\"Must find 3 scores above 75 (90, 78, 95)\");\n        if (!res.contains(90) || !res.contains(78) || !res.contains(95)) throw new AssertionError(\"Must contain 90, 78, 95\");\n        ArrayList<Integer> emptyRes = Solution.filterAbove(scores, 100);\n        if (!emptyRes.isEmpty()) throw new AssertionError(\"Scores above 100 must be empty\");\n    }\n}",
    aTitle: "Day 25 Assignment: Add and Get List Elements",
    aDesc: "Write createList(String a, String b) returning ArrayList<String> containing a and b.",
    aStarter: "import java.util.ArrayList;\npublic class Solution {\n    public static ArrayList<String> createList(String a, String b) {\n        // Create an ArrayList<String>, add a then b, and return it:\n        \n    }\n}",
    aHint: "list.add(a); list.add(b);",
    aTest: "import java.util.ArrayList;\npublic class Test {\n    public static void main(String[] args) {\n        ArrayList<String> l = Solution.createList(\"Apple\", \"Banana\");\n        if (l.size() != 2 || !l.get(0).equals(\"Apple\")) throw new AssertionError(\"List must contain Apple, Banana\");\n    }\n}"
  },

  // ── Day 26: HashMap & Milestone 5 ──────────────────────────────────────────
  {
    title: "Key-Value Maps & ⭐ MILESTONE 5: Inventory & Frequency Engine",
    desc: "O(1) dictionary lookups with HashMap<K, V>. (Milestone 5: Word Frequency & Inventory Engine).",
    syllabus: [
      "Key-Value Pair Mechanics: put(), get(), containsKey().",
      "Frequency Tallying: getOrDefault(key, defaultVal) + 1.",
      "Iterating HashMaps: keySet() and entrySet()."
    ],
    eTitle: "Day 26 Milestone 5: Word Frequency Engine",
    eDesc: "Write countFrequency(String[] words) returning a HashMap<String, Integer> counting occurrences of each word in Solution.",
    eStarter: "import java.util.HashMap;\n\npublic class Solution {\n    public static HashMap<String, Integer> countFrequency(String[] words) {\n        // Create a HashMap<String,Integer>, loop through words,\n        // use map.getOrDefault(w, 0) + 1 to tally each word:\n        \n    }\n}",
    eHint: "`getOrDefault(key, 0)` returns the existing count or zero for a word seen for the first time; add 1 and store it back with `put`.",
    eTest: "import java.util.HashMap;\npublic class Test {\n    public static void main(String[] args) {\n        String[] words = { \"java\", \"code\", \"java\", \"test\", \"java\", \"code\" };\n        HashMap<String, Integer> map = Solution.countFrequency(words);\n        if (map.get(\"java\") != 3) throw new AssertionError(\"'java' must occur 3 times\");\n        if (map.get(\"code\") != 2) throw new AssertionError(\"'code' must occur 2 times\");\n        if (map.get(\"test\") != 1) throw new AssertionError(\"'test' must occur 1 time\");\n        if (map.containsKey(\"missing\")) throw new AssertionError(\"Missing word must not be in map\");\n    }\n}",
    aTitle: "Day 26 Assignment: Stock Lookup Map",
    aDesc: "Write getStock(HashMap<String, Integer> map, String item) returning map.getOrDefault(item, 0).",
    aStarter: "import java.util.HashMap;\npublic class Solution {\n    public static int getStock(HashMap<String, Integer> map, String item) {\n        // Return map.getOrDefault(item, 0):\n        \n    }\n}",
    aHint: "return map.getOrDefault(item, 0);",
    aTest: "import java.util.HashMap;\npublic class Test {\n    public static void main(String[] args) {\n        HashMap<String, Integer> m = new HashMap<>();\n        m.put(\"Apples\", 50);\n        if (Solution.getStock(m, \"Apples\") != 50) throw new AssertionError(\"Apples must be 50\");\n        if (Solution.getStock(m, \"Oranges\") != 0) throw new AssertionError(\"Missing Oranges must return 0\");\n    }\n}"
  },

  // ── Day 27: Generics <T> ───────────────────────────────────────────────────
  {
    title: "Java Generics <T> — Compile-Time Type Safety",
    desc: "Parameterize classes and methods with generic type parameters <T> to write type-safe reusable code without casting.",
    syllabus: [
      "Generic Classes: class Box<T> { T item; }.",
      "Multi-type Parameters: class Pair<K, V>.",
      "Compile-time Type Safety: Preventing ClassCastException."
    ],
    eTitle: "Day 27 Challenge: Generic Pair Container",
    eDesc: "Create generic class Pair<K, V> with constructor Pair(K key, V val), getKey(), and getVal().",
    eStarter: "class Pair<K, V> {\n    private K key;\n    private V val;\n    public Pair(K key, V val) {\n        // Assign parameters using 'this':\n        \n    }\n    public K getKey() {\n        // Return the key field:\n        \n    }\n    public V getVal() {\n        // Return the val field:\n        \n    }\n}\npublic class Solution {\n    public static String testPair() {\n        Pair<String, Integer> p = new Pair<>(\"Age\", 22);\n        return p.getKey() + \": \" + p.getVal();\n    }\n}",
    eHint: "class Pair<K, V> { private K key; private V val; public Pair(K key, V val) { ... } }",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        Pair<String, Integer> p1 = new Pair<>(\"Score\", 95);\n        if (!p1.getKey().equals(\"Score\") || p1.getVal() != 95) throw new AssertionError(\"Pair String-Integer failed\");\n        Pair<Integer, Double> p2 = new Pair<>(101, 19.99);\n        if (p2.getKey() != 101 || p2.getVal() != 19.99) throw new AssertionError(\"Pair Integer-Double failed\");\n    }\n}",
    aTitle: "Day 27 Assignment: Generic Box",
    aDesc: "Create generic Box<T> with set(T item) and get().",
    aStarter: "class Box<T> {\n    private T item;\n    public void set(T item) {\n        // Store item in the field:\n        \n    }\n    public T get() {\n        // Return the stored item:\n        \n    }\n}\npublic class Solution { public static String test() { Box<String> b = new Box<>(); b.set(\"Present\"); return b.get(); } }",
    aHint: "class Box<T> { private T item; public void set(T item) { this.item = item; } public T get() { return item; } }",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        Box<String> b = new Box<>();\n        b.set(\"Present\");\n        if (!b.get().equals(\"Present\")) throw new AssertionError(\"Box must return Present\");\n    }\n}"
  },

  // ── Day 28: Concurrency & Threads ──────────────────────────────────────────
  {
    title: "Multithreading & Concurrency — Parallel Execution",
    desc: "Execute tasks concurrently using the Runnable interface and Thread class. Spawn parallel background workers with t.start().",
    syllabus: [
      "The Runnable Interface: Defining parallel units of work.",
      "The Thread Class: Spawning JVM threads with .start().",
      "Concurrency Safety: Understanding shared state race conditions."
    ],
    eTitle: "Day 28 Challenge: Parallel Task Runner",
    eDesc: "Create class Worker implements Runnable with run() printing 'Work Done'.",
    eStarter: "class Worker implements Runnable {\n    public void run() {\n        // Print \"Work Done\" to stdout:\n        \n    }\n}\npublic class Solution {\n    public static void execute() { Worker w = new Worker(); w.run(); }\n}",
    eHint: "class Worker implements Runnable { public void run() { System.out.println(\"Work Done\"); } }",
    eTest: "import java.io.*;\npublic class Test {\n    public static void main(String[] args) {\n        ByteArrayOutputStream out = new ByteArrayOutputStream();\n        System.setOut(new PrintStream(out));\n        Worker w = new Worker();\n        w.run();\n        String res = out.toString().trim();\n        if (!res.contains(\"Work Done\")) throw new AssertionError(\"Worker run() must print 'Work Done'\");\n        if (res.length() < 8) throw new AssertionError(\"Output length must match Work Done\");\n    }\n}",
    aTitle: "Day 28 Assignment: Thread Status Checker",
    aDesc: "Write isRunning(Thread t) returning t.isAlive().",
    aStarter: "public class Solution {\n    public static boolean isRunning(Thread t) {\n        // Return true if t is not null AND t.isAlive():\n        \n    }\n}",
    aHint: "return t != null && t.isAlive();",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        Thread t = new Thread(() -> {});\n        if (Solution.isRunning(t)) throw new AssertionError(\"Unstarted thread is not running\");\n        if (Solution.isRunning(null)) throw new AssertionError(\"Null thread must return false\");\n    }\n}"
  },

  // ── Day 29: Stream & File I/O ──────────────────────────────────────────────
  {
    title: "File & Stream I/O — Data Ingestion & Stream Processing",
    desc: "Process data streams efficiently and parse real multi-line application log records with safe resource cleanup.",
    syllabus: [
      "Stream Pipelines: Byte streams vs Character streams.",
      "Buffered Readers: Reading line-by-line efficiently.",
      "Stream Log Parsing: Filtering error lines safely."
    ],
    eTitle: "Day 29 Challenge: Stream Error Log Parser",
    eDesc: "Write countErrorLines(String streamText) in Solution that uses a BufferedReader / StringReader to count how many lines start with '[ERROR]'.",
    eStarter: "import java.io.*;\n\npublic class Solution {\n    public static int countErrorLines(String streamText) {\n        // Return 0 for null input. Use BufferedReader(new StringReader(streamText)).\n        // Read each line; count++ if it starts with \"[ERROR]\":\n        \n    }\n}",
    eHint: "try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) { String line; while ((line = reader.readLine()) != null) if (line.startsWith(\"[ERROR]\")) count++; }",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        String log1 = \"[INFO] Boot\n[ERROR] Null pointer\n[WARN] High load\n[ERROR] Timeout\";\n        if (Solution.countErrorLines(log1) != 2) throw new AssertionError(\"Expected 2 errors in log1\");\n        String log2 = \"[INFO] Clean run\n[DEBUG] Trace info\";\n        if (Solution.countErrorLines(log2) != 0) throw new AssertionError(\"Expected 0 errors in log2\");\n        String log3 = \"[ERROR] Fatal crash\";\n        if (Solution.countErrorLines(log3) != 1) throw new AssertionError(\"Expected 1 error in log3\");\n        if (Solution.countErrorLines(null) != 0) throw new AssertionError(\"Null stream must return 0\");\n    }\n}",
    aTitle: "Day 29 Assignment: CSV Field Stream Extractor",
    aDesc: "Write extractFirstColumn(String csvText) in Solution returning an ArrayList<String> of the first column in each row.",
    aStarter: "import java.io.*;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static ArrayList<String> extractFirstColumn(String csvText) {\n        // Return empty list for null. Use BufferedReader to read each line.\n        // Split by \",\" and add parts[0].trim() to the result list:\n        \n    }\n}",
    aHint: "BufferedReader with line.split(\",\") adding parts[0] to ArrayList.",
    aTest: "import java.util.ArrayList;\npublic class Test {\n    public static void main(String[] args) {\n        String csv = \"Alice,95,A\nBob,88,B\nCharlie,72,C\";\n        ArrayList<String> names = Solution.extractFirstColumn(csv);\n        if (names.size() != 3) throw new AssertionError(\"Must extract 3 names\");\n        if (!names.get(0).equals(\"Alice\")) throw new AssertionError(\"First name must be Alice\");\n        if (!names.get(2).equals(\"Charlie\")) throw new AssertionError(\"Third name must be Charlie\");\n        if (Solution.extractFirstColumn(null).size() != 0) throw new AssertionError(\"Null CSV must return empty list\");\n    }\n}"
  },

  // ── Day 30: 🏆 CAPSTONE PROJECT ─────────────────────────────────────────────
  {
    title: "🏆 Capstone Project: Ledger Transaction Auditor",
    desc: "Synthesize all 30 days into a unified enterprise financial auditing engine: entities, defensive validation, collections, and balance reconciliation working in harmony.",
    syllabus: [
      "Full System Architecture: Entity design, defensive validation, and collections.",
      "Auditor Calculation Logic: Multi-condition threshold filtering and summation.",
      "Account Balance Reconciliation: End-to-end ledger verification."
    ],
    eTitle: "Day 30 Final Capstone Challenge: Ledger Transaction Auditor",
    eDesc: "Write auditLedger(int[] amounts, int limit) in Solution returning the sum of all transaction amounts strictly greater than limit.",
    eStarter: "public class Solution {\n    public static int auditLedger(int[] amounts, int limit) {\n        // Loop through amounts. If any amount is strictly greater than limit, add it to sum.\n        // Return sum (start at 0):\n        \n    }\n}",
    eHint: "for (int a : amounts) if (a > limit) sum += a; return sum;",
    eTest: "public class Test {\n    public static void main(String[] args) {\n        int[] ledger1 = { 500, 1500, 200, 3000, 800 };\n        if (Solution.auditLedger(ledger1, 1000) != 4500) throw new AssertionError(\"1500 + 3000 must be 4500\");\n        int[] ledger2 = { 100, 200, 300 };\n        if (Solution.auditLedger(ledger2, 500) != 0) throw new AssertionError(\"No amounts over limit must return 0\");\n        int[] ledger3 = { 1000, 2000 };\n        if (Solution.auditLedger(ledger3, 500) != 3000) throw new AssertionError(\"All amounts over limit must sum to 3000\");\n        int[] emptyLedger = {};\n        if (Solution.auditLedger(emptyLedger, 100) != 0) throw new AssertionError(\"Empty ledger must return 0\");\n    }\n}",
    aTitle: "Day 30 Final Capstone Assignment: Account Balance Reconciler",
    aDesc: "Write calculateBalance(int initialBalance, int[] transactions) in Solution returning the net reconciled balance by applying all positive credits and negative debits.",
    aStarter: "public class Solution {\n    public static int calculateBalance(int initialBalance, int[] txs) {\n        // Start at initialBalance. If txs is not null, loop through and add each transaction.\n        // Return the final balance:\n        \n    }\n}",
    aHint: "for (int t : txs) balance += t; return balance;",
    aTest: "public class Test {\n    public static void main(String[] args) {\n        int[] txs1 = { 500, -200, 150 };\n        if (Solution.calculateBalance(1000, txs1) != 1450) throw new AssertionError(\"1000 + 500 - 200 + 150 must be 1450\");\n        int[] txs2 = { -500, -300 };\n        if (Solution.calculateBalance(1000, txs2) != 200) throw new AssertionError(\"1000 - 800 must be 200\");\n        if (Solution.calculateBalance(500, new int[]{}) != 500) throw new AssertionError(\"Empty transactions must preserve initial\");\n        if (Solution.calculateBalance(500, null) != 500) throw new AssertionError(\"Null transactions must preserve initial\");\n    }\n}"
  }
];

export const JAVA_ALL_30_DAYS_QUESTS: CourseQuest[] = JAVA_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('java-basics', i + 1, cfg)
);

export const JAVA_30_DAYS_QUESTS: CourseQuest[] = JAVA_ALL_30_DAYS_QUESTS;
