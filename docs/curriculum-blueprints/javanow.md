# PinIT Java 30-Day Adaptive Curriculum & Micro-Learning Architecture Master Reference (v5.2 — Exhaustive Production Specification)

> **Purpose**: Complete verbatim specification of every day, every lesson slide/block, every analogy, every code sandbox, diagnostic check, proctored exam, and test suite across all 30 days.
> **Target Student Persona**: Beginners with low confidence or cognitive fatigue — taught with zero jargon, 1-concept cognitive budget, everyday physical metaphors, and empathetic 3-step error recovery.
> **Execution Standard**: Isolated Java Judge Backend (`/api/code/run-java`) with 2.5s timeouts, 128MB memory bounds, and multi-case test suites.

---

## 🗺️ 30-Day Milestone Curriculum Progression

| Phase | Days | Focus Area | Embedded Project Milestone |
|:---|:---:|:---|:---|
| **Phase 1** | Days 1–5 | Foundations, Instructions, Scanner Buffer, Variables, Math, Conditionals | **⭐ Milestone 1 (Day 5): Interactive Decision Console** |
| **Phase 2** | Days 6–10 | Switch, While/Do-While Loops, For Loops, Custom Methods, Call Stack & Scope | **⭐ Milestone 2 (Day 10): Modular Financial Utility Engine** |
| **Phase 3** | Days 11–15 | Method Overloading, 1D Arrays, Enhanced For-Each, 2D Matrices, Search Algorithms | **⭐ Milestone 3 (Day 15): Data Ledger & Binary Search Engine** |
| **Phase 4** | Days 16–21 | Classes vs Objects, Constructors & this, Encapsulation, Inheritance, Polymorphism, Interfaces | **⭐ Milestone 4 (Day 21): Enterprise Payment Gateway Interface** |
| **Phase 5** | Days 22–26 | Static State, try-catch Exceptions, Defensive throw, ArrayList<T>, HashMap<K,V> | **⭐ Milestone 5 (Day 26): Word Frequency & Inventory Engine** |
| **Phase 6** | Days 27–30 | Java Generics <T>, Multithreading & Concurrency, Stream I/O, Comprehensive Capstone | **🏆 Capstone (Day 30): Complete Ledger Transaction Auditor** |

---

## 📚 Exhaustive Verbatim Curriculum: Day 1 through Day 30

################################################################################
# 📅 DAY 1: What is a Program? — Writing Your First Java Instructions
################################################################################

**Core Intuitive Metaphor**: A computer program is like a cooking recipe card: it gives the computer a step-by-step list of instructions to follow in exact order.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-1`)
**Total Interactive Micro-Learning Blocks**: 5

--------------------------------------------------------------------------------
#### 🔹 Slide 1: What is an Instruction? (Block ID: `java-d1-b1-instructions`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Instruction`
* **Supporting Terms**: Step, Order

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"A Recipe Card"*
  > Computers are very fast, but they do not know what to do on their own. An instruction is a single step that tells the computer exactly what action to take.
* **⚡ Logic Execution Flowchart**:
  - Step 1 [START]: Step 1: Boil water
  - Step 2 [PROCESS]: Step 2: Add tea leaves
  - Step 3 [END]: Step 3: Pour into cup
* **💻 Runnable Interactive Java Code Sandbox** (`Recipe.java` | Editable: No):
  ```java
  public class Recipe {
      public static void main(String[] args) {
          System.out.println("Step 1: Boil water");
          System.out.println("Step 2: Add tea leaves");
          System.out.println("Step 3: Pour into cup");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Step 1: Boil water
    Step 2: Add tea leaves
    Step 3: Pour into cup
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: If a computer follows instructions strictly from top to bottom, which step runs first?
* **Correct Answer**: `Step 1` (Variants: step 1, 1, first step)
* **Targeted Misconception ID**: `MC_JAVA_EXECUTION_ORDER`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong_order]** ➔ Diagnosed: `MC_JAVA_EXECUTION_ORDER`
    + 🔍 **What Went Wrong**: Computers always execute instructions in sequential order from top to bottom without skipping.
    + 💡 **Simpler Everyday Picture**: Think of reading a book: you read line 1 before line 2.
    + 🚀 **Guided Retry Prompt**: Identify the very first line at the top.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Your First Print Statement (Block ID: `java-d1-b2-println`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `System.out.println`
* **Supporting Terms**: Screen, Text
* **Prerequisites Required**: `java-d1-b1-instructions` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Writing on a Chalkboard"*
  > In Java, when you want the computer to display words on the screen, you use System.out.println("Your text here");.
* **📐 Syntax Anatomy Breakdown**:
  ```java
  System.out.println("Hello, World!");
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: System.out.println tells Java to print text on a new line. Quotes hold the exact message.
* **💻 Runnable Interactive Java Code Sandbox** (`Hello.java` | Editable: No):
  ```java
  public class Hello {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Hello, World!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: What will this command display on screen: System.out.println("Welcome!");
* **Correct Answer**: `Welcome!` (Variants: welcome!, Welcome!)
* **Targeted Misconception ID**: `MC_JAVA_CASE_SENSITIVITY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [system_error]** ➔ Diagnosed: `MC_JAVA_CASE_SENSITIVITY`
    + 🔍 **What Went Wrong**: System.out.println prints whatever exact text is written inside the double quotation marks.
    + 💡 **Simpler Everyday Picture**: Look inside the quotes: whatever text is inside is printed to the screen.
    + 🚀 **Guided Retry Prompt**: Type the exact word inside the quotes: Welcome!

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Changing What Gets Printed (Block ID: `java-d1-b3-changing-messages`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Custom Message`
* **Supporting Terms**: Quotes, Output
* **Prerequisites Required**: `java-d1-b2-println` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Customizing a Greeting Card"*
  > You can change the message to say anything you want by replacing the text inside the double quotation marks.
* **💻 Runnable Interactive Java Code Sandbox** (`MyGreeting.java` | Editable: No):
  ```java
  public class MyGreeting {
      public static void main(String[] args) {
          System.out.println("My name is Java!");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    My name is Java!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: What is printed by: System.out.println("Good morning!");
* **Correct Answer**: `Good morning!` (Variants: good morning!, Good morning!)
* **Targeted Misconception ID**: `MC_JAVA_QUOTES_ON_NUMBERS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong_text]** ➔ Diagnosed: `MC_JAVA_QUOTES_ON_NUMBERS`
    + 🔍 **What Went Wrong**: The computer prints the exact characters placed inside the double quotation marks.
    + 💡 **Simpler Everyday Picture**: The words inside quotes are delivered directly to the terminal output.
    + 🚀 **Guided Retry Prompt**: Write: Good morning!

--------------------------------------------------------------------------------
#### 🔹 Slide 4: The Semicolon Rule (Block ID: `java-d1-b4-semicolon`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Semicolon Delimiter`
* **Supporting Terms**: Statement, Period
* **Prerequisites Required**: `java-d1-b3-changing-messages` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Full Stop at End of a Sentence"*
  > Just like every sentence in English ends with a period (.), every complete instruction in Java MUST end with a semicolon (;).
* **🔍 Broken vs Fixed Visual Diff**:
  - ❌ **Broken Code**: `System.out.println("Hello") // ❌ Error: missing semicolon`
  - ✅ **Fixed Code**: `System.out.println("Hello"); // ✅ Correct!`
  - **Why it Broke**: Java does not know where the instruction ends without a semicolon.
  - **How to Fix**: Add a semicolon ; at the very end of the line.
* **💻 Runnable Interactive Java Code Sandbox** (`SemicolonDemo.java` | Editable: No):
  ```java
  public class SemicolonDemo {
      public static void main(String[] args) {
          System.out.println("Sentence 1 ends with semicolon;");
          System.out.println("Sentence 2 ends with semicolon;");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Sentence 1 ends with semicolon;
    Sentence 2 ends with semicolon;
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `fix_line`
* **Question Asked**: Fix the missing semicolon in this command: System.out.println("Done")
* **Correct Answer**: `System.out.println("Done");` (Variants: System.out.println("Done");, System.out.println("Done"); )
* **Targeted Misconception ID**: `MC_JAVA_MISSING_SEMICOLON`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [missing_semicolon]** ➔ Diagnosed: `MC_JAVA_MISSING_SEMICOLON`
    + 🔍 **What Went Wrong**: Every statement must terminate with a semicolon ; in Java.
    + 💡 **Simpler Everyday Picture**: Put a ; at the very end of the instruction.
    + 🚀 **Guided Retry Prompt**: Add ; to the end of the line.

--------------------------------------------------------------------------------
#### 🔹 Slide 5: The Program Container (Class & Main) (Block ID: `java-d1-b5-container`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Java Program Container`
* **Supporting Terms**: Class, Main Entry Point
* **Prerequisites Required**: `java-d1-b4-semicolon` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"A Labeled Folder with a Front Door"*
  > Java requires all code to live inside a labeled folder (class) with a front door (main). For now, memorize this outer shell as Java standard starting structure.
* **📐 Syntax Anatomy Breakdown**:
  ```java
  public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Ready!");
      }
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: public class HelloWorld creates the outer container.
    + **Line 2**: public static void main(String[] args) is the starting front door where Java starts running.
    + **Line 3**: Your actual instructions go inside the main door.
* **💻 Runnable Interactive Java Code Sandbox** (`ProgramShell.java` | Editable: No):
  ```java
  public class ProgramShell {
      public static void main(String[] args) {
          System.out.println("Program container active!");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Program container active!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Where do your starting instructions go in a basic Java program?
* **Selectable Options**:
  - [x] **Option A**: Inside the main method: public static void main(String[] args) { ... }
  - [ ] **Option B**: Above the public class line
  - [ ] **Option C**: Outside all curly braces
* **Targeted Misconception ID**: `MC_JAVA_CODE_OUTSIDE_CLASS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_CODE_OUTSIDE_CLASS`
    + 🔍 **What Went Wrong**: Instructions must be inside the main method body.
    + 💡 **Simpler Everyday Picture**: Java starts reading inside the main { } block.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-1`)
* **Exam Title**: Day 1 Challenge: Print Your Introduction
* **Problem Statement**: Write a Java program that prints 3 lines to the screen: line 1 'Hello!', line 2 'I am learning Java.', and line 3 'Let us build!'.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static void main(String[] args) {
        // Write your 3 System.out.println lines below:
        
    }
}
```
* **Socratic Hint**: Use System.out.println("..."); for each line.
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        Solution.main(new String[]{});
        String res = out.toString().trim().replace("\r\n", "\n");
        if (!res.contains("Hello!")) throw new AssertionError("Line 1 must contain 'Hello!'");
        if (!res.contains("I am learning Java.")) throw new AssertionError("Line 2 must contain 'I am learning Java.'");
        if (!res.contains("Let us build!")) throw new AssertionError("Line 3 must contain 'Let us build!'");
        String[] lines = res.split("\n");
        if (lines.length != 3) throw new AssertionError("Must print exactly 3 lines, got: " + lines.length);
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-1`)
* **Assignment Title**: Day 1 Assignment: Custom Message Output
* **Problem Statement**: Write a Java program that prints 'Java is awesome!' to the screen.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static void main(String[] args) {
        // Print 'Java is awesome!':
        
    }
}
```
* **Socratic Hint**: Use System.out.println("Java is awesome!");
* **Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        Solution.main(new String[]{});
        String res = out.toString().trim();
        if (!res.equals("Java is awesome!")) throw new AssertionError("Expected 'Java is awesome!', got: " + res);
    }
}
```


################################################################################
# 📅 DAY 2: Interactive Programs — Reading User Input with Scanner
################################################################################

**Core Intuitive Metaphor**: Scanner is like a microphone for your program: it listens to what the user types on the keyboard and hands the words to your code.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-2`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: What is User Input? (Block ID: `java-d2-b1-scanner-intro`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `User Input`
* **Supporting Terms**: Keyboard, Interactive
* **Prerequisites Required**: `java-d1-b5-container` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Ordering Window at a Fast Food Drive-Through"*
  > Instead of printing the same fixed text every time, interactive programs pause and wait for the user to type their name or age.
* **💻 Runnable Interactive Java Code Sandbox** (`InputDemo.java` | Editable: No):
  ```java
  public class InputDemo {
      public static void main(String[] args) {
          String simulatedInput = "Alex";
          System.out.println("Welcome, " + simulatedInput + "!");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Welcome, Alex!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why do programs need user input?
* **Selectable Options**:
  - [x] **Option A**: To make programs interactive and respond to dynamic user information
  - [ ] **Option B**: To make the computer screen turn on
  - [ ] **Option C**: To delete old files from the hard drive
* **Targeted Misconception ID**: `MC_JAVA_INPUT_MISMATCH`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_INPUT_MISMATCH`
    + 🔍 **What Went Wrong**: User input allows software to handle different data dynamically.
    + 💡 **Simpler Everyday Picture**: Input lets the user talk to the program.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Importing & Creating Scanner (Block ID: `java-d2-b2-import-scanner`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Scanner Initialization`
* **Supporting Terms**: import java.util.Scanner, System.in
* **Prerequisites Required**: `java-d2-b1-scanner-intro` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  
  
  Scanner sc = new Scanner(System.in);
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: import java.util.Scanner tells Java to bring in the Scanner tool from its standard toolbox.
    + **Line 3**: new Scanner(System.in) connects the Scanner to the keyboard.
* **💻 Runnable Interactive Java Code Sandbox** (`ScannerSetup.java` | Editable: No):
  ```java
  
  
  public class ScannerSetup {
      public static void main(String[] args) {
          Scanner sc = new Scanner("42");
          int val = sc.nextInt();
          System.out.println("Scanner read integer: " + val);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Scanner read integer: 42
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Where must  be placed in your Java file?
* **Selectable Options**:
  - [x] **Option A**: At the very top of the file, before public class
  - [ ] **Option B**: Inside the main method
  - [ ] **Option C**: At the very bottom after the last brace
* **Targeted Misconception ID**: `MC_JAVA_FORGOT_SCANNER_IMPORT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_FORGOT_SCANNER_IMPORT`
    + 🔍 **What Went Wrong**: Imports must be at the top level of the file before any class declaration.
    + 💡 **Simpler Everyday Picture**: Put all imports at line 1 before the class.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Reading Text with nextLine() (Block ID: `java-d2-b3-nextline`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `sc.nextLine()`
* **Supporting Terms**: String Input, Line Reader
* **Prerequisites Required**: `java-d2-b2-import-scanner` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`GreetingApp.java` | Editable: No):
  ```java
  
  
  public class GreetingApp {
      public static void main(String[] args) {
          // Simulated reading from input stream
          String name = "Vinay";
          System.out.println("Hello, " + name + "!");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Hello, Vinay!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Which Scanner method reads an entire line of text as a String?
* **Selectable Options**:
  - [x] **Option A**: sc.nextLine()
  - [ ] **Option B**: sc.nextInt()
  - [ ] **Option C**: sc.nextDouble()
* **Targeted Misconception ID**: `MC_JAVA_INPUT_MISMATCH`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_INPUT_MISMATCH`
    + 🔍 **What Went Wrong**: sc.nextLine() reads text lines, while sc.nextInt() reads whole numbers.
    + 💡 **Simpler Everyday Picture**: nextLine reads text lines. nextInt reads integers.
    + 🚀 **Guided Retry Prompt**: Select sc.nextLine().

--------------------------------------------------------------------------------
#### 🔹 Slide 4: The Newline Trap (nextInt followed by nextLine) (Block ID: `java-d2-b4-nextint-newline-trap`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Scanner Newline Mechanics`
* **Supporting Terms**: Buffer Remainder, sc.nextLine() Clearing
* **Prerequisites Required**: `java-d2-b3-nextline` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Leftover Enter Key"*
  > When you type 22 and press ENTER, nextInt() reads only the 22. The ENTER key character (\n) stays behind on the line. If you call nextLine() right after, it instantly reads that leftover ENTER and thinks the user typed an empty string!
* **🔍 Broken vs Fixed Visual Diff**:
  - ❌ **Broken Code**: `int age = sc.nextInt(); String name = sc.nextLine(); // ❌ Skips! Reads leftover newline`
  - ✅ **Fixed Code**: `int age = sc.nextInt(); sc.nextLine(); // ✅ Consumes leftover newline String name = sc.nextLine(); // ✅ Reads real name`
  - **Why it Broke**: nextInt() does not consume the trailing newline character.
  - **How to Fix**: Call sc.nextLine() once immediately after nextInt() to clear the leftover newline.
* **💻 Runnable Interactive Java Code Sandbox** (`BufferFixDemo.java` | Editable: No):
  ```java
  
  
  public class BufferFixDemo {
      public static void main(String[] args) {
          Scanner sc = new Scanner("25\nSarah Connor");
          int age = sc.nextInt();
          sc.nextLine(); // Discard newline
          String name = sc.nextLine();
          System.out.println("User: " + name + " (Age " + age + ")");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    User: Sarah Connor (Age 25)
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why does nextLine() appear to get skipped when called immediately after nextInt()?
* **Selectable Options**:
  - [x] **Option A**: Because nextInt() reads the number but leaves the ENTER newline in the buffer, which nextLine() immediately reads
  - [ ] **Option B**: Because Java runs out of memory
  - [ ] **Option C**: Because Scanner only works once per program
* **Targeted Misconception ID**: `MC_JAVA_SCANNER_BUFFER_SKIP`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_SCANNER_BUFFER_SKIP`
    + 🔍 **What Went Wrong**: nextInt() leaves the newline character in the stream buffer.
    + 💡 **Simpler Everyday Picture**: The leftover ENTER key is consumed by nextLine. Add sc.nextLine() to discard it.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-2`)
* **Exam Title**: Day 2 Challenge: Fix the Broken Input Reader
* **Problem Statement**: Fix the bug in the program below so it reads the user age and then reads their full name without skipping.
* **Starter Code (`Solution.java`)**:
```java


public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        // BUG: Add 1 line here to clear the leftover Enter key buffer:
        
        String name = sc.nextLine();
        System.out.println("Name: " + name + " | Age: " + age);
    }
}
```
* **Socratic Hint**: Add sc.nextLine(); right after nextInt() to clear the buffer.
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        String input1 = "22\nVinay Kumar\n";
        System.setIn(new ByteArrayInputStream(input1.getBytes()));
        ByteArrayOutputStream out1 = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out1));
        Solution.main(new String[]{});
        if (!out1.toString().contains("Name: Vinay Kumar | Age: 22")) throw new AssertionError("Test 1 failed: Expected 'Name: Vinay Kumar | Age: 22'");
        
        String input2 = "18\nSarah Connor\n";
        System.setIn(new ByteArrayInputStream(input2.getBytes()));
        ByteArrayOutputStream out2 = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out2));
        Solution.main(new String[]{});
        if (!out2.toString().contains("Name: Sarah Connor | Age: 18")) throw new AssertionError("Test 2 failed: Expected 'Name: Sarah Connor | Age: 18'");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-2`)
* **Assignment Title**: Day 2 Assignment: Reading Number Input
* **Problem Statement**: Write a Java program that reads an integer score using sc.nextInt() and prints 'Score: ' followed by the score.
* **Starter Code (`Solution.java`)**:
```java


public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read score and print it:
        
    }
}
```
* **Socratic Hint**: Use int score = sc.nextInt();
* **Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        String input = "88\n";
        System.setIn(new ByteArrayInputStream(input.getBytes()));
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        Solution.main(new String[]{});
        String res = out.toString().trim();
        if (!res.contains("Score: 88")) throw new AssertionError("Expected 'Score: 88', got: " + res);
    }
}
```


################################################################################
# 📅 DAY 3: Variables & Data Types — Storing Information in Memory
################################################################################

**Core Intuitive Metaphor**: A variable is like a labeled storage box in memory that holds a specific type of information.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-3`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Whole Numbers (int) (Block ID: `java-d3-b1-int`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `int Type`
* **Supporting Terms**: Variable, Whole Number
* **Prerequisites Required**: `java-d1-b5-container` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"A Labeled Storage Box for Counters"*
  > In Java, an int is a box that holds whole numbers like 1, 10, or 250 (no decimals).
* **📦 Memory Box Diagram**:
  - **Variable**: `score` | **Type**: `int` | **Value**: `100` (*32-bit integer*)
* **💻 Runnable Interactive Java Code Sandbox** (`Score.java` | Editable: No):
  ```java
  public class Score {
      public static void main(String[] args) {
          int score = 100;
          System.out.println("Score: " + score);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Score: 100
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `trace_value`
* **Question Asked**: If you write int score = 50; score = 75; what is the final value of score?
* **Correct Answer**: `75` (Variants: 75, seventy five)
* **Targeted Misconception ID**: `MC_JAVA_VARIABLE_REASSIGNMENT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [50]** ➔ Diagnosed: `MC_JAVA_VARIABLE_REASSIGNMENT`
    + 🔍 **What Went Wrong**: Assigning a new value overwrites whatever was in the box previously.
    + 💡 **Simpler Everyday Picture**: When you put 75 in the box, the old 50 is replaced.
    + 🚀 **Guided Retry Prompt**: The final value is 75.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Decimal Numbers (double) (Block ID: `java-d3-b2-double`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `double Type`
* **Supporting Terms**: Decimals, Precision
* **Prerequisites Required**: `java-d3-b1-int` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"A Price Tag Box"*
  > When you need numbers with fractional cents or decimals (like 9.99), use double.
* **📦 Memory Box Diagram**:
  - **Variable**: `price` | **Type**: `double` | **Value**: `19.99` (*64-bit floating point*)
* **💻 Runnable Interactive Java Code Sandbox** (`DoubleDemo.java` | Editable: No):
  ```java
  public class DoubleDemo {
      public static void main(String[] args) {
          double price = 19.99;
          double tax = 1.50;
          System.out.println("Total: $" + (price + tax));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Total: $21.49
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Which variable type is best for storing a product price like $4.50?
* **Selectable Options**:
  - [x] **Option A**: double price = 4.50;
  - [ ] **Option B**: int price = 4.50;
  - [ ] **Option C**: boolean price = 4.50;
* **Targeted Misconception ID**: `MC_JAVA_WRONG_DATA_TYPE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_WRONG_DATA_TYPE`
    + 🔍 **What Went Wrong**: int cannot hold decimal places; double is required for decimals.
    + 💡 **Simpler Everyday Picture**: Decimals require double.
    + 🚀 **Guided Retry Prompt**: Select double price = 4.50;.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: True/False Flags (boolean) (Block ID: `java-d3-b3-boolean`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `boolean Type`
* **Supporting Terms**: true, false, Condition Flag
* **Prerequisites Required**: `java-d3-b1-int` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"A Light Switch"*
  > A boolean holds only two possible values: true (ON) or false (OFF).
* **💻 Runnable Interactive Java Code Sandbox** (`FlagDemo.java` | Editable: No):
  ```java
  public class FlagDemo {
      public static void main(String[] args) {
          boolean isPass = true;
          System.out.println("Passed: " + isPass);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Passed: true
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Which of the following is a valid boolean value in Java?
* **Selectable Options**:
  - [x] **Option A**: true (lowercase without quotes)
  - [ ] **Option B**: "true" (in double quotes)
  - [ ] **Option C**: YES
* **Targeted Misconception ID**: `MC_JAVA_BOOLEAN_QUOTES`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_BOOLEAN_QUOTES`
    + 🔍 **What Went Wrong**: boolean values true and false must not be surrounded by quotes.
    + 💡 **Simpler Everyday Picture**: Quotes make it text (String), not a boolean flag.
    + 🚀 **Guided Retry Prompt**: Select true without quotes.

--------------------------------------------------------------------------------
#### 🔹 Slide 4: Text Sequences (String) (Block ID: `java-d3-b4-string`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `String Type`
* **Supporting Terms**: Text Sequence, Double Quotes
* **Prerequisites Required**: `java-d3-b1-int` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"A Bead Necklace of Characters"*
  > A String stores a sequence of characters chained together inside double quotes.
* **📐 Syntax Anatomy Breakdown**:
  ```java
  String city = "New York";
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: String begins with a capital S because it is a reference object type in Java.
* **💻 Runnable Interactive Java Code Sandbox** (`StringDemo.java` | Editable: No):
  ```java
  public class StringDemo {
      public static void main(String[] args) {
          String greeting = "Hello";
          String user = "Student";
          System.out.println(greeting + ", " + user + "!");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Hello, Student!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why does String start with an uppercase S while int starts with lowercase i?
* **Selectable Options**:
  - [x] **Option A**: String is a class type in Java, whereas int is a primitive type
  - [ ] **Option B**: It is a spelling error in Java
  - [ ] **Option C**: Uppercase means it is private
* **Targeted Misconception ID**: `MC_JAVA_CASING_SYSTEM`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_CASING_SYSTEM`
    + 🔍 **What Went Wrong**: In Java, standard reference class types start with uppercase (String), while primitives start lowercase (int, double, boolean).
    + 💡 **Simpler Everyday Picture**: String is a Class object, int is a primitive number.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-3`)
* **Exam Title**: Day 3 Challenge: Declare Variables & Calculate Total
* **Problem Statement**: Declare an int quantity = 3, a double unitPrice = 15.50, calculate double totalPrice = quantity * unitPrice, and print 'Total: $' + totalPrice.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static void main(String[] args) {
        // 1. Declare int quantity
        // 2. Declare double unitPrice
        // 3. Calculate and print totalPrice
        
    }
}
```
* **Socratic Hint**: double totalPrice = quantity * unitPrice;
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        Solution.main(new String[]{});
        String res = out.toString().trim();
        if (!res.contains("Total: $46.5")) throw new AssertionError("Expected 'Total: $46.5', got: " + res);
        if (!res.contains("Total:")) throw new AssertionError("Must format with 'Total:' prefix");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-3`)
* **Assignment Title**: Day 3 Assignment: Declare Different Types
* **Problem Statement**: Write a program that declares int age = 20 and boolean isStudent = true and prints them.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static void main(String[] args) {
        // Declare and print:
        
    }
}
```
* **Socratic Hint**: int age = 20; boolean isStudent = true;
* **Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        Solution.main(new String[]{});
        String res = out.toString().trim();
        if (!res.contains("20")) throw new AssertionError("Output must contain age 20");
        if (!res.contains("true")) throw new AssertionError("Output must contain boolean true");
    }
}
```


################################################################################
# 📅 DAY 4: Math Operators & Expressions — Performing Calculations in Java
################################################################################

**Core Intuitive Metaphor**: Math operators in Java are like a pocket calculator: they perform arithmetic (+, -, *, /, %) on numbers.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-4`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Addition & Subtraction (+ and -) (Block ID: `java-d4-b1-add-sub`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Addition & Subtraction`
* **Supporting Terms**: Operand, Result
* **Prerequisites Required**: `java-d3-b1-int` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`AddSub.java` | Editable: No):
  ```java
  public class AddSub {
      public static void main(String[] args) {
          int sum = 10 + 5;
          int diff = 10 - 3;
          System.out.println("Sum: " + sum + ", Diff: " + diff);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Sum: 15, Diff: 7
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: What will int total = 20 + 30; System.out.println(total); display?
* **Correct Answer**: `50` (Variants: 50, fifty)
* **Targeted Misconception ID**: `MC_JAVA_OPERATOR_PRECEDENCE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_OPERATOR_PRECEDENCE`
    + 🔍 **What Went Wrong**: 20 + 30 evaluates to 50.
    + 💡 **Simpler Everyday Picture**: Add the two numbers together.
    + 🚀 **Guided Retry Prompt**: Type 50.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Multiplication & Integer Division (* and /) (Block ID: `java-d4-b2-mult-div`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Integer Division Truncation`
* **Supporting Terms**: Integer Division, Truncation
* **Prerequisites Required**: `java-d4-b1-add-sub` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Chopping off the Decimal Tail"*
  > When dividing two integers in Java (like 7 / 2), Java drops the decimal remainder completely and gives you 3 (not 3.5).
* **💻 Runnable Interactive Java Code Sandbox** (`DivisionDemo.java` | Editable: No):
  ```java
  public class DivisionDemo {
      public static void main(String[] args) {
          int intDiv = 7 / 2; // drops .5
          double decDiv = 7.0 / 2.0; // preserves .5
          System.out.println("Integer div: " + intDiv);
          System.out.println("Decimal div: " + decDiv);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Integer div: 3
    Decimal div: 3.5
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In Java, what does the expression 9 / 2 evaluate to?
* **Correct Answer**: `4` (Variants: 4, four)
* **Targeted Misconception ID**: `MC_JAVA_INTEGER_TRUNCATION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [4.5]** ➔ Diagnosed: `MC_JAVA_INTEGER_TRUNCATION`
    + 🔍 **What Went Wrong**: Integer division chops off the decimal portion.
    + 💡 **Simpler Everyday Picture**: Both 9 and 2 are integers, so 9 / 2 produces 4.
    + 🚀 **Guided Retry Prompt**: Enter 4.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: The Modulo Remainder Operator (%) (Block ID: `java-d4-b3-modulo`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Modulo Operator`
* **Supporting Terms**: Remainder, Even/Odd Check
* **Prerequisites Required**: `java-d4-b2-mult-div` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Leftover Slices of Pizza"*
  > If you have 10 slices of pizza and 3 people each take 3 slices, 1 slice is left over in the box. 10 % 3 = 1.
* **💻 Runnable Interactive Java Code Sandbox** (`ModuloDemo.java` | Editable: No):
  ```java
  public class ModuloDemo {
      public static void main(String[] args) {
          int remainder = 10 % 3;
          System.out.println("10 % 3 = " + remainder);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    10 % 3 = 1
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: What is 14 % 5 in Java?
* **Correct Answer**: `4` (Variants: 4, four)
* **Targeted Misconception ID**: `MC_JAVA_MODULO_REMAINDER`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [2]** ➔ Diagnosed: `MC_JAVA_MODULO_REMAINDER`
    + 🔍 **What Went Wrong**: 14 divided by 5 is 2 with a remainder of 4. % calculates the remainder (4).
    + 💡 **Simpler Everyday Picture**: 5 goes into 14 twice (10), leaving 4 leftover.
    + 🚀 **Guided Retry Prompt**: Type 4.

--------------------------------------------------------------------------------
#### 🔹 Slide 4: Operator Precedence (Order of Operations) (Block ID: `java-d4-b4-precedence`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Math Precedence`
* **Supporting Terms**: PEMDAS, Parentheses Priority
* **Prerequisites Required**: `java-d4-b3-modulo` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"VIP Priority Line"*
  > Multiplication (*) and Division (/) have VIP priority over Addition (+) and Subtraction (-). Always use (parentheses) to force addition first.
* **💻 Runnable Interactive Java Code Sandbox** (`PrecedenceDemo.java` | Editable: No):
  ```java
  public class PrecedenceDemo {
      public static void main(String[] args) {
          int res1 = 2 + 3 * 4;     // 2 + 12 = 14
          int res2 = (2 + 3) * 4;   // 5 * 4 = 20
          System.out.println("res1: " + res1 + ", res2: " + res2);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    res1: 14, res2: 20
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: What is the result of 10 - 2 * 3 in Java?
* **Correct Answer**: `4` (Variants: 4, four)
* **Targeted Misconception ID**: `MC_JAVA_OPERATOR_PRECEDENCE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [24]** ➔ Diagnosed: `MC_JAVA_OPERATOR_PRECEDENCE`
    + 🔍 **What Went Wrong**: Multiplication runs before subtraction: 2 * 3 = 6, then 10 - 6 = 4.
    + 💡 **Simpler Everyday Picture**: Do 2 * 3 first (6), then 10 - 6.
    + 🚀 **Guided Retry Prompt**: Type 4.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-4`)
* **Exam Title**: Day 4 Challenge: Bill Splitter with Tip
* **Problem Statement**: Write calculatePerPerson(double bill, double tipPercent, int people) in Solution returning total per person.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static double calculatePerPerson(double bill, double tipPercent, int people) {
        // Return (bill + (bill * tipPercent)) / people
        return 0.0;
    }
}
```
* **Socratic Hint**: double total = bill + (bill * tipPercent); return total / people;
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Math.abs(Solution.calculatePerPerson(100.0, 0.20, 2) - 60.0) > 0.001) throw new AssertionError("100 + 20% / 2 must be 60.0");
        if (Math.abs(Solution.calculatePerPerson(200.0, 0.10, 4) - 55.0) > 0.001) throw new AssertionError("200 + 10% / 4 must be 55.0");
        if (Math.abs(Solution.calculatePerPerson(50.0, 0.0, 1) - 50.0) > 0.001) throw new AssertionError("50 + 0% / 1 must be 50.0");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-4`)
* **Assignment Title**: Day 4 Assignment: Modulo Checker
* **Problem Statement**: Write isEven(int n) returning true if n is divisible by 2.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static boolean isEven(int n) {
        // Return true if n % 2 == 0:
        return false;
    }
}
```
* **Socratic Hint**: return n % 2 == 0;
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.isEven(4)) throw new AssertionError("4 is even");
        if (Solution.isEven(7)) throw new AssertionError("7 is odd");
        if (!Solution.isEven(0)) throw new AssertionError("0 is even");
        if (Solution.isEven(-3)) throw new AssertionError("-3 is odd");
    }
}
```


################################################################################
# 📅 DAY 5: Conditionals & ⭐ MILESTONE 1: Interactive Decision Console
################################################################################

**Core Intuitive Metaphor**: Milestone 1 — Interactive Decision Console: Conditionals are like railway switch tracks that guide trains onto different paths based on track signals.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-5`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Making a Decision (if Statement) (Block ID: `java-d5-b1-if-basic`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `if Statement`
* **Supporting Terms**: Condition, Branch
* **Prerequisites Required**: `java-d3-b3-boolean` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Toll Booth Gate"*
  > If you pay the toll (condition is true), the gate opens and you drive through. If not, the gate stays closed.
* **💻 Runnable Interactive Java Code Sandbox** (`TollGate.java` | Editable: No):
  ```java
  public class TollGate {
      public static void main(String[] args) {
          int balance = 50;
          if (balance >= 20) {
              System.out.println("Gate Open!");
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Gate Open!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: When does the code inside an if (condition) { ... } block execute?
* **Selectable Options**:
  - [x] **Option A**: Only when the condition inside parentheses evaluates to true
  - [ ] **Option B**: Every time the program runs regardless of the condition
  - [ ] **Option C**: Only when the computer reboots
* **Targeted Misconception ID**: `MC_JAVA_IF_CONDITION_EXECUTION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_IF_CONDITION_EXECUTION`
    + 🔍 **What Went Wrong**: if blocks execute only when the boolean condition evaluates to true.
    + 💡 **Simpler Everyday Picture**: if true -> execute. if false -> skip.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The Fallback Path (else Statement) (Block ID: `java-d5-b2-else-branch`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `else Branch`
* **Supporting Terms**: Alternative Path, Exclusivity
* **Prerequisites Required**: `java-d5-b1-if-basic` (understood)

**2. Media & Conceptual Scaffolding**:
* **⚡ Logic Execution Flowchart**:
  - Step 1 [DECISION]: Condition Check: score >= 50
  - Step 2 [PROCESS]: True: Print "Pass!"
  - Step 3 [PROCESS]: False: Print "Try Again!"
* **💻 Runnable Interactive Java Code Sandbox** (`PassFail.java` | Editable: No):
  ```java
  public class PassFail {
      public static void main(String[] args) {
          int score = 45;
          if (score >= 50) {
              System.out.println("Status: Pass");
          } else {
              System.out.println("Status: Retry");
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Status: Retry
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In int score = 40; if (score >= 50) System.out.println("Pass"); else System.out.println("Retry"); what is printed?
* **Correct Answer**: `Retry` (Variants: retry, Retry)
* **Targeted Misconception ID**: `MC_JAVA_ELSE_BRANCH_LOGIC`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [pass]** ➔ Diagnosed: `MC_JAVA_ELSE_BRANCH_LOGIC`
    + 🔍 **What Went Wrong**: 40 is not >= 50, so execution falls into the else branch.
    + 💡 **Simpler Everyday Picture**: 40 < 50 is false, so else runs.
    + 🚀 **Guided Retry Prompt**: Write Retry.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Multi-Way Decisions (else-if Ladders) (Block ID: `java-d5-b3-elseif-ladder`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `else-if Ladder`
* **Supporting Terms**: Multi-Way Branch, Sequential Evaluation
* **Prerequisites Required**: `java-d5-b2-else-branch` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Sizing Sieve"*
  > Check size in order: if score >= 90 (Grade A), else if score >= 80 (Grade B), else (Grade C). As soon as one branch matches, Java skips all remaining branches.
* **💻 Runnable Interactive Java Code Sandbox** (`GradeLadder.java` | Editable: No):
  ```java
  public class GradeLadder {
      public static void main(String[] args) {
          int score = 85;
          if (score >= 90) System.out.println("Grade: A");
          else if (score >= 80) System.out.println("Grade: B");
          else System.out.println("Grade: C");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Grade: B
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: With score = 85 in the GradeLadder above, what is output?
* **Correct Answer**: `Grade: B` (Variants: Grade: B, grade: b, B)
* **Targeted Misconception ID**: `MC_JAVA_ASSIGNMENT_IN_CONDITION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [Grade: A]** ➔ Diagnosed: `MC_JAVA_ASSIGNMENT_IN_CONDITION`
    + 🔍 **What Went Wrong**: 85 is not >= 90, so the first condition is false; it falls to score >= 80 (Grade B).
    + 💡 **Simpler Everyday Picture**: 85 is less than 90, so it matches Grade B.
    + 🚀 **Guided Retry Prompt**: Write Grade: B.

--------------------------------------------------------------------------------
#### 🔹 Slide 4: ⭐ MILESTONE 1: Interactive Decision Console (Block ID: `java-d5-b4-milestone-1`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Decision Engine`
* **Supporting Terms**: Validation Guard, Console Menu
* **Prerequisites Required**: `java-d5-b3-elseif-ladder` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`DecisionConsole.java` | Editable: No):
  ```java
  public class DecisionConsole {
      public static String evaluateAdmission(int score, boolean hasPrereq) {
          if (score >= 80 && hasPrereq) return "Direct Admit";
          else if (score >= 60) return "Interview Required";
          else return "Application Rejected";
      }
      public static void main(String[] args) {
          System.out.println("Result: " + evaluateAdmission(85, true));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Result: Direct Admit
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: In Milestone 1, what does evaluateAdmission(85, false) return?
* **Selectable Options**:
  - [x] **Option A**: "Interview Required" (Score >= 60 even though prereq is false)
  - [ ] **Option B**: "Direct Admit"
  - [ ] **Option C**: "Application Rejected"
* **Targeted Misconception ID**: `MC_JAVA_LOGICAL_AND_SHORT_CIRCUIT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_LOGICAL_AND_SHORT_CIRCUIT`
    + 🔍 **What Went Wrong**: hasPrereq is false, so && fails on direct admit; it falls to else if score >= 60.
    + 💡 **Simpler Everyday Picture**: && requires both to be true. Since prereq is false, it matches the second branch.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-5`)
* **Exam Title**: Day 5 Milestone 1: Decision Console
* **Problem Statement**: Write classifyScore(int score) returning 'Pass' if score >= 50, else 'Fail'.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static String classifyScore(int score) {
        // Return 'Pass' or 'Fail':
        return "";
    }
}
```
* **Socratic Hint**: if (score >= 50) return "Pass"; else return "Fail";
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.classifyScore(75).equals("Pass")) throw new AssertionError("75 must be Pass");
        if (!Solution.classifyScore(50).equals("Pass")) throw new AssertionError("Boundary 50 must be Pass");
        if (!Solution.classifyScore(49).equals("Fail")) throw new AssertionError("Boundary 49 must be Fail");
        if (!Solution.classifyScore(0).equals("Fail")) throw new AssertionError("0 must be Fail");
        if (!Solution.classifyScore(100).equals("Pass")) throw new AssertionError("100 must be Pass");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-5`)
* **Assignment Title**: Day 5 Assignment: Age Verification
* **Problem Statement**: Write canVote(int age) returning true if age >= 18.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static boolean canVote(int age) {
        return false;
    }
}
```
* **Socratic Hint**: return age >= 18;
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.canVote(18)) throw new AssertionError("18 can vote");
        if (!Solution.canVote(25)) throw new AssertionError("25 can vote");
        if (Solution.canVote(17)) throw new AssertionError("17 cannot vote");
        if (Solution.canVote(0)) throw new AssertionError("0 cannot vote");
    }
}
```


################################################################################
# 📅 DAY 6: Switch Statements & Default Guards
################################################################################

**Core Intuitive Metaphor**: A switch statement is like an elevator panel: you press floor 3 (case 3), and the elevator jumps directly to floor 3 without stopping at floors 1 and 2.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-6`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: The Switch & Case Structure (Block ID: `java-d6-b1-switch-syntax`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `switch and case`
* **Supporting Terms**: Direct Jump, break Keyword
* **Prerequisites Required**: `java-d5-b2-else-branch` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`Elevator.java` | Editable: No):
  ```java
  public class Elevator {
      public static void main(String[] args) {
          int floor = 2;
          switch (floor) {
              case 1:
                  System.out.println("Lobby");
                  break;
              case 2:
                  System.out.println("Offices");
                  break;
              default:
                  System.out.println("Roof");
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Offices
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What happens if you omit the break statement after a matching case in a switch block?
* **Selectable Options**:
  - [x] **Option A**: Execution falls through and runs subsequent cases until a break or switch end is reached
  - [ ] **Option B**: The compiler throws an unrecoverable syntax error
  - [ ] **Option C**: The computer skips the rest of the file
* **Targeted Misconception ID**: `MC_JAVA_MISSING_BREAK`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_MISSING_BREAK`
    + 🔍 **What Went Wrong**: Without a break statement, Java continues executing the next case (fallthrough).
    + 💡 **Simpler Everyday Picture**: break stops fallthrough to other cases.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The Default Fallback Guard (Block ID: `java-d6-b2-default-guard`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `default Guard`
* **Supporting Terms**: Catch-All, Unlisted Option
* **Prerequisites Required**: `java-d6-b1-switch-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The General Inquiries Desk"*
  > If none of the specific case numbers match the input, the default branch catches the execution.
* **💻 Runnable Interactive Java Code Sandbox** (`DefaultGuardDemo.java` | Editable: No):
  ```java
  public class DefaultGuardDemo {
      public static void main(String[] args) {
          int option = 99;
          switch (option) {
              case 1: System.out.println("Profile"); break;
              case 2: System.out.println("Settings"); break;
              default: System.out.println("Unknown Menu Option");
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Unknown Menu Option
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Which keyword acts as the catch-all fallback for unlisted switch values?
* **Selectable Options**:
  - [x] **Option A**: default
  - [ ] **Option B**: fallback
  - [ ] **Option C**: else
* **Targeted Misconception ID**: `MC_JAVA_MISSING_DEFAULT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_MISSING_DEFAULT`
    + 🔍 **What Went Wrong**: In Java switch statements, default: handles unmatched cases.
    + 💡 **Simpler Everyday Picture**: default is the fallback keyword.
    + 🚀 **Guided Retry Prompt**: Select default.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Switch vs if-else (When to Use Which) (Block ID: `java-d6-b3-switch-vs-if`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Control Flow Choice`
* **Supporting Terms**: Discrete Values, Range Checking
* **Prerequisites Required**: `java-d6-b2-default-guard` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Menu Button vs Thermometer Range"*
  > Use switch when matching exact fixed choices (Menu option 1, 2, 3). Use if-else when testing ranges (temperature > 75 and temperature < 90).
* **💻 Runnable Interactive Java Code Sandbox** (`MenuChoice.java` | Editable: No):
  ```java
  public class MenuChoice {
      public static void main(String[] args) {
          char grade = 'B';
          switch (grade) {
              case 'A': System.out.println("Excellent"); break;
              case 'B': System.out.println("Good Job"); break;
              default: System.out.println("Keep Practicing");
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Good Job
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Which structure is cleaner for checking if an integer menuOption is exactly 1, 2, 3, or 4?
* **Selectable Options**:
  - [x] **Option A**: A switch statement with case 1, 2, 3, 4
  - [ ] **Option B**: A 10-line while loop
  - [ ] **Option C**: A try-catch block
* **Targeted Misconception ID**: `MC_JAVA_SWITCH_VS_IF_DISCRETE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_SWITCH_VS_IF_DISCRETE`
    + 🔍 **What Went Wrong**: switch statements are specifically designed for exact discrete value matching.
    + 💡 **Simpler Everyday Picture**: switch is ideal for exact menu choices.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-6`)
* **Exam Title**: Day 6 Challenge: Day Name Lookup
* **Problem Statement**: Write getDayName(int day) returning 'Monday' for 1, 'Tuesday' for 2, 'Wednesday' for 3, and 'Unknown' otherwise.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static String getDayName(int day) {
        switch (day) {
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            default: return "Unknown";
        }
    }
}
```
* **Socratic Hint**: Use switch(day) with cases 1, 2, 3 and default.
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.getDayName(1).equals("Monday")) throw new AssertionError("1 must be Monday");
        if (!Solution.getDayName(2).equals("Tuesday")) throw new AssertionError("2 must be Tuesday");
        if (!Solution.getDayName(3).equals("Wednesday")) throw new AssertionError("3 must be Wednesday");
        if (!Solution.getDayName(0).equals("Unknown")) throw new AssertionError("0 must be Unknown");
        if (!Solution.getDayName(99).equals("Unknown")) throw new AssertionError("99 must be Unknown");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-6`)
* **Assignment Title**: Day 6 Assignment: Grade Classifier Switch
* **Problem Statement**: Write getFeedback(char grade) returning 'Excellent' for 'A', 'Good' for 'B', and 'Retake' otherwise.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static String getFeedback(char grade) {
        switch (grade) {
            case 'A': return "Excellent";
            case 'B': return "Good";
            default: return "Retake";
        }
    }
}
```
* **Socratic Hint**: Use switch (grade) with cases 'A', 'B' and default.
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.getFeedback('A').equals("Excellent")) throw new AssertionError("A must be Excellent");
        if (!Solution.getFeedback('B').equals("Good")) throw new AssertionError("B must be Good");
        if (!Solution.getFeedback('F').equals("Retake")) throw new AssertionError("F must be Retake");
    }
}
```


################################################################################
# 📅 DAY 7: While & Do-While Loops — Iterative Repetition
################################################################################

**Core Intuitive Metaphor**: A loop is like a Ferris wheel: as long as the ride light is GREEN (condition is true), the wheel spins another round.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-7`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: The While Loop (Condition-First Iteration) (Block ID: `java-d7-b1-while-syntax`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `while Loop`
* **Supporting Terms**: Loop Guard, Condition Check
* **Prerequisites Required**: `java-d5-b1-if-basic` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`Counter.java` | Editable: No):
  ```java
  public class Counter {
      public static void main(String[] args) {
          int count = 1;
          while (count <= 3) {
              System.out.println("Count: " + count);
              count++;
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Count: 1
    Count: 2
    Count: 3
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What happens if you forget to increment count++ inside a while (count <= 3) loop?
* **Selectable Options**:
  - [x] **Option A**: The loop runs forever (Infinite Loop) because count never exceeds 3
  - [ ] **Option B**: The program automatically exits
  - [ ] **Option C**: The computer deletes the variable
* **Targeted Misconception ID**: `MC_JAVA_INFINITE_LOOP`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_INFINITE_LOOP`
    + 🔍 **What Went Wrong**: Without updating loop variables, the condition stays true forever.
    + 💡 **Simpler Everyday Picture**: Count stays 1 forever, so the loop never stops spinning.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The Accumulator Pattern (Summing Inside Loops) (Block ID: `java-d7-b2-loop-accumulator`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Accumulator Variable`
* **Supporting Terms**: Running Total, sum += val
* **Prerequisites Required**: `java-d7-b1-while-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Piggy Bank"*
  > An accumulator variable (int total = 0;) sits outside the loop. Each time the loop spins, it drops another coin into the bank (total += coin;).
* **💻 Runnable Interactive Java Code Sandbox** (`PiggyBank.java` | Editable: No):
  ```java
  public class PiggyBank {
      public static void main(String[] args) {
          int total = 0;
          int coin = 1;
          while (coin <= 4) {
              total += coin;
              coin++;
          }
          System.out.println("Total saved: " + total);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Total saved: 10
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: What is the value of total saved after 1 + 2 + 3 + 4 in PiggyBank?
* **Correct Answer**: `10` (Variants: 10, ten)
* **Targeted Misconception ID**: `MC_JAVA_ACCUMULATOR_SCOPE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_ACCUMULATOR_SCOPE`
    + 🔍 **What Went Wrong**: 1 + 2 + 3 + 4 = 10.
    + 💡 **Simpler Everyday Picture**: Add 1+2+3+4 = 10.
    + 🚀 **Guided Retry Prompt**: Type 10.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: The Do-While Loop (Execute At Least Once) (Block ID: `java-d7-b3-dowhile`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `do-while Loop`
* **Supporting Terms**: Post-Condition Check, Guaranteed First Run
* **Prerequisites Required**: `java-d7-b2-loop-accumulator` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Restaurant Menu Order"*
  > The waiter always presents the menu at least once (do). You only ask to see the menu again if you are still hungry (while hungry).
* **📐 Syntax Anatomy Breakdown**:
  ```java
  do {
      System.out.println("Action executed!");
  } while (false);
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: do runs the block immediately before checking the condition at line 3.
* **💻 Runnable Interactive Java Code Sandbox** (`DoWhileDemo.java` | Editable: No):
  ```java
  public class DoWhileDemo {
      public static void main(String[] args) {
          int count = 10;
          do {
              System.out.println("Runs at least once even if false! Count: " + count);
          } while (count < 5);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Runs at least once even if false! Count: 10
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: How does a do-while loop differ from a standard while loop?
* **Selectable Options**:
  - [x] **Option A**: A do-while loop always executes its body at least once before checking the condition
  - [ ] **Option B**: A do-while loop can only count to 10
  - [ ] **Option C**: A do-while loop cannot use variables
* **Targeted Misconception ID**: `MC_JAVA_INFINITE_LOOP`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_INFINITE_LOOP`
    + 🔍 **What Went Wrong**: do-while evaluates its condition at the bottom, guaranteeing at least one execution.
    + 💡 **Simpler Everyday Picture**: do runs first, checks condition second.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-7`)
* **Exam Title**: Day 7 Challenge: Calculate Factorial with While Loop
* **Problem Statement**: Write factorial(int n) in Solution returning the product of numbers from 1 to n (e.g. 4! = 1*2*3*4 = 24). For n <= 1 return 1.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int factorial(int n) {
        int result = 1;
        int i = 1;
        while (i <= n) {
            result *= i;
            i++;
        }
        return result;
    }
}
```
* **Socratic Hint**: Multiply result *= i; inside a while(i <= n) loop.
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.factorial(0) != 1) throw new AssertionError("0! must be 1");
        if (Solution.factorial(1) != 1) throw new AssertionError("1! must be 1");
        if (Solution.factorial(4) != 24) throw new AssertionError("4! must be 24");
        if (Solution.factorial(5) != 120) throw new AssertionError("5! must be 120");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-7`)
* **Assignment Title**: Day 7 Assignment: Sum 1 to N While Loop
* **Problem Statement**: Write sumUpTo(int n) returning 1 + 2 + ... + n.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int sumUpTo(int n) {
        int sum = 0, i = 1;
        while (i <= n) { sum += i; i++; }
        return sum;
    }
}
```
* **Socratic Hint**: while (i <= n) { sum += i; i++; }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.sumUpTo(3) != 6) throw new AssertionError("1+2+3 must be 6");
        if (Solution.sumUpTo(5) != 15) throw new AssertionError("Sum to 5 must be 15");
        if (Solution.sumUpTo(0) != 0) throw new AssertionError("Sum to 0 must be 0");
    }
}
```


################################################################################
# 📅 DAY 8: For Loops & Nested Iteration — Deterministic Counting
################################################################################

**Core Intuitive Metaphor**: A for loop is like a lap counter with 3 dials: 1) Start at lap 1, 2) Stop after lap 5, 3) Add 1 lap every time you cross the finish line.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-8`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: The For Loop 3-Part Header (Block ID: `java-d8-b1-for-syntax`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `for Loop Structure`
* **Supporting Terms**: Init, Condition, Update
* **Prerequisites Required**: `java-d7-b1-while-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  for (int i = 0; i < 3; i++) {
      System.out.println("Lap: " + i);
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: int i = 0 (Init once), i < 3 (Check condition every lap), i++ (Update counter after each lap).
* **💻 Runnable Interactive Java Code Sandbox** (`LapCounter.java` | Editable: No):
  ```java
  public class LapCounter {
      public static void main(String[] args) {
          for (int i = 0; i < 3; i++) {
              System.out.println("Lap: " + i);
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Lap: 0
    Lap: 1
    Lap: 2
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: How many times will for (int i = 0; i < 4; i++) execute?
* **Selectable Options**:
  - [x] **Option A**: 4 times (for i = 0, 1, 2, 3)
  - [ ] **Option B**: 5 times
  - [ ] **Option C**: 3 times
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: Starting at 0 and checking < 4 runs 4 iterations (0, 1, 2, 3).
    + 💡 **Simpler Everyday Picture**: Count: 0, 1, 2, 3 = 4 total laps.
    + 🚀 **Guided Retry Prompt**: Select 4 times.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Custom Step Sizes & Counting Backwards (Block ID: `java-d8-b2-step-counting`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Loop Step Modification`
* **Supporting Terms**: i += 2, i--, Countdown
* **Prerequisites Required**: `java-d8-b1-for-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`StepDemo.java` | Editable: No):
  ```java
  public class StepDemo {
      public static void main(String[] args) {
          // Counting by 2s:
          for (int i = 2; i <= 6; i += 2) {
              System.out.print(i + " ");
          }
          System.out.println();
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    2 4 6 
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: What is printed by for (int i = 3; i >= 1; i--) System.out.print(i + " "); ?
* **Correct Answer**: `3 2 1 ` (Variants: 3 2 1 , 3 2 1, 3 2 1 )
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: The loop decrements i by 1 each step: 3, then 2, then 1.
    + 💡 **Simpler Everyday Picture**: 3, 2, 1.
    + 🚀 **Guided Retry Prompt**: Write: 3 2 1 

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Nested For Loops (Rows & Columns Grid) (Block ID: `java-d8-b3-nested-loops`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Nested Loops`
* **Supporting Terms**: Outer Loop (Row), Inner Loop (Col)
* **Prerequisites Required**: `java-d8-b2-step-counting` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Wall Calendar (Weeks & Days)"*
  > For each week (outer loop), you visit all 7 days of that week (inner loop). The inner loop finishes completely for every single step of the outer loop.
* **💻 Runnable Interactive Java Code Sandbox** (`GridDemo.java` | Editable: No):
  ```java
  public class GridDemo {
      public static void main(String[] args) {
          for (int row = 1; row <= 2; row++) {
              for (int col = 1; col <= 3; col++) {
                  System.out.print("[" + row + "," + col + "] ");
              }
              System.out.println();
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    [1,1] [1,2] [1,3] 
    [2,1] [2,2] [2,3] 
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: If an outer loop runs 3 times and an inner loop runs 4 times, how many total times does the inner loop body execute?
* **Selectable Options**:
  - [x] **Option A**: 12 times (3 rows * 4 columns)
  - [ ] **Option B**: 7 times (3 + 4)
  - [ ] **Option C**: 4 times
* **Targeted Misconception ID**: `MC_JAVA_NESTED_LOOP_MULTIPLICATION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_NESTED_LOOP_MULTIPLICATION`
    + 🔍 **What Went Wrong**: Nested loops multiply: 3 * 4 = 12 total executions.
    + 💡 **Simpler Everyday Picture**: Outer count * Inner count = 3 * 4 = 12.
    + 🚀 **Guided Retry Prompt**: Select 12 times.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-8`)
* **Exam Title**: Day 8 Challenge: Sum of Even Numbers
* **Problem Statement**: Write sumEvens(int n) returning sum of all even numbers from 2 up to n.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int sumEvens(int n) {
        int sum = 0;
        for (int i = 2; i <= n; i += 2) {
            sum += i;
        }
        return sum;
    }
}
```
* **Socratic Hint**: for (int i = 2; i <= n; i += 2) sum += i;
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.sumEvens(6) != 12) throw new AssertionError("2+4+6 must be 12");
        if (Solution.sumEvens(10) != 30) throw new AssertionError("2+4+6+8+10 must be 30");
        if (Solution.sumEvens(1) != 0) throw new AssertionError("No evens <= 1 must be 0");
        if (Solution.sumEvens(7) != 12) throw new AssertionError("Evens <= 7 must be 12");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-8`)
* **Assignment Title**: Day 8 Assignment: Count Down String
* **Problem Statement**: Write countDown(int start) returning '3 2 1 ' for start = 3.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static String countDown(int start) {
        String res = "";
        for (int i = start; i >= 1; i--) { res += i + " "; }
        return res;
    }
}
```
* **Socratic Hint**: for (int i = start; i >= 1; i--)
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.countDown(3).equals("3 2 1 ")) throw new AssertionError("Must return '3 2 1 '");
        if (!Solution.countDown(1).equals("1 ")) throw new AssertionError("Must return '1 '");
    }
}
```


################################################################################
# 📅 DAY 9: Modular Programming — Custom Methods & Reusable Logic
################################################################################

**Core Intuitive Metaphor**: A custom method is like a microwave preset button (e.g. Popcorn): instead of typing 50 lines of instructions every time, you package them under a named button and press it whenever you need it.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-9`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Methods? (The DRY Principle) (Block ID: `java-d9-b1-why-methods`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Method Packaging`
* **Supporting Terms**: DRY Principle, Code Reusability
* **Prerequisites Required**: `java-d8-b1-for-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Microwave Popcorn Button"*
  > Without a method, if you calculate sales tax across 10 checkout screens, you have to copy-paste the formula 10 times. A method packages that formula so you write it once and reuse it everywhere.
* **🔍 Broken vs Fixed Visual Diff**:
  - ❌ **Broken Code**: `// Copy-pasting tax formula everywhere: double t1 = price1 * 0.08; double t2 = price2 * 0.08;`
  - ✅ **Fixed Code**: `// Define once in a method: public static double calculateTax(double price) {     return price * 0.08; }`
  - **Why it Broke**: Duplicate code is difficult to update and prone to bugs.
  - **How to Fix**: Define calculateTax() once and call calculateTax(price1) whenever needed.
* **💻 Runnable Interactive Java Code Sandbox** (`DryMethods.java` | Editable: No):
  ```java
  public class DryMethods {
      public static double computeTax(double price) {
          return price * 0.08;
      }
      public static void main(String[] args) {
          System.out.println("Tax 1: $" + computeTax(100.0));
          System.out.println("Tax 2: $" + computeTax(50.0));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Tax 1: $8.0
    Tax 2: $4.0
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the primary purpose of writing custom methods in Java?
* **Selectable Options**:
  - [x] **Option A**: Packaging reusable logic so you do not duplicate code across your application
  - [ ] **Option B**: Allowing Java code to run without requiring memory
  - [ ] **Option C**: Deleting old variables permanently from disk
* **Targeted Misconception ID**: `MC_JAVA_METHOD_PURPOSE_DRY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_METHOD_PURPOSE_DRY`
    + 🔍 **What Went Wrong**: Methods are structural tools designed for code reusability.
    + 💡 **Simpler Everyday Picture**: Methods let you write instructions once and reuse them anywhere.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Method Anatomy (Return Types & Parameters) (Block ID: `java-d9-b2-anatomy`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Method Signatures`
* **Supporting Terms**: Return Type, Parameter Inputs
* **Prerequisites Required**: `java-d9-b1-why-methods` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  public static int add(int a, int b) {
      return a + b;
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: int is the return type (the calculated answer sent back). (int a, int b) are the input parameters.
    + **Line 2**: return a + b calculates the sum and hands the value back to the caller.
* **💻 Runnable Interactive Java Code Sandbox** (`Calculator.java` | Editable: No):
  ```java
  public class Calculator {
      public static int add(int a, int b) {
          return a + b;
      }
      public static void main(String[] args) {
          int answer = add(10, 25);
          System.out.println("Answer: " + answer);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Answer: 35
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In public static int multiply(int x, int y) { return x * y; }, what does multiply(4, 5) return?
* **Correct Answer**: `20` (Variants: 20, twenty)
* **Targeted Misconception ID**: `MC_JAVA_METHOD_RETURN_TYPE_MISMATCH`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong_math]** ➔ Diagnosed: `MC_JAVA_METHOD_RETURN_TYPE_MISMATCH`
    + 🔍 **What Went Wrong**: multiply(4, 5) computes 4 * 5 = 20.
    + 💡 **Simpler Everyday Picture**: Multiply 4 by 5 to calculate 20.
    + 🚀 **Guided Retry Prompt**: Type 20.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Pass-by-Value (The Photocopy Rule) (Block ID: `java-d9-b3-pass-by-value`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Pass-by-Value Primitives`
* **Supporting Terms**: Parameter Copy, Caller Isolation
* **Prerequisites Required**: `java-d9-b2-anatomy` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Photocopy Rule"*
  > When you pass an int into a method, Java gives the method a photocopy of the number. If the method writes all over its photocopy, your original number remains completely untouched.
* **💻 Runnable Interactive Java Code Sandbox** (`PhotocopyDemo.java` | Editable: No):
  ```java
  public class PhotocopyDemo {
      public static void modifyNumber(int n) {
          n = n + 50; // Only changes local photocopy!
      }
      public static void main(String[] args) {
          int score = 100;
          modifyNumber(score);
          System.out.println("Original score: " + score);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Original score: 100
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: If you pass int score = 100 into modifyNumber(int n) { n = 999; }, what is score in main() afterwards?
* **Selectable Options**:
  - [x] **Option A**: 100 (Primitives are passed by copy; original variable is unchanged)
  - [ ] **Option B**: 999 (The original variable is overwritten)
  - [ ] **Option C**: 0 (The variable is reset to default)
* **Targeted Misconception ID**: `MC_JAVA_PASS_BY_VALUE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_PASS_BY_VALUE`
    + 🔍 **What Went Wrong**: In Java, primitive variables are passed by value (copy). Changing the parameter does not alter the caller variable.
    + 💡 **Simpler Everyday Picture**: Remember the photocopy rule: changing the photocopy never changes the original document.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 4: Void Methods (Actions Without Return Values) (Block ID: `java-d9-b4-void-methods`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `void Return Type`
* **Supporting Terms**: Action-Only, No Return Value
* **Prerequisites Required**: `java-d9-b3-pass-by-value` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  public static void printReceipt(double total) {
      System.out.println("Total Due: $" + total);
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: void means this method executes an action (printing) but does not return any calculated answer back.
* **💻 Runnable Interactive Java Code Sandbox** (`VoidDemo.java` | Editable: No):
  ```java
  public class VoidDemo {
      public static void printBanner(String msg) {
          System.out.println("=== " + msg + " ===");
      }
      public static void main(String[] args) {
          printBanner("SYSTEM READY");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    === SYSTEM READY ===
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What does the void keyword mean in a method signature?
* **Selectable Options**:
  - [x] **Option A**: The method does not return any value to the caller
  - [ ] **Option B**: The method cannot take any input parameters
  - [ ] **Option C**: The method is empty and will not run
* **Targeted Misconception ID**: `MC_JAVA_PASS_BY_VALUE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_PASS_BY_VALUE`
    + 🔍 **What Went Wrong**: void indicates that the method performs side effects without returning data.
    + 💡 **Simpler Everyday Picture**: void = performs an action without handing back an answer.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-9`)
* **Exam Title**: Day 9 Challenge: Total Price Calculator
* **Problem Statement**: Write calculateTotal(double price, double taxRate) in Solution returning price + (price * taxRate).
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static double calculateTotal(double price, double taxRate) {
        return price + (price * taxRate);
    }
}
```
* **Socratic Hint**: return price + (price * taxRate);
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Math.abs(Solution.calculateTotal(100.0, 0.05) - 105.0) > 0.001) throw new AssertionError("100 + 5% tax must be 105.0");
        if (Math.abs(Solution.calculateTotal(50.0, 0.10) - 55.0) > 0.001) throw new AssertionError("50 + 10% tax must be 55.0");
        if (Math.abs(Solution.calculateTotal(200.0, 0.0) - 200.0) > 0.001) throw new AssertionError("200 + 0% tax must be 200.0");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-9`)
* **Assignment Title**: Day 9 Assignment: Max of Two Numbers
* **Problem Statement**: Write max(int a, int b) returning the larger of the two numbers.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int max(int a, int b) {
        return (a >= b) ? a : b;
    }
}
```
* **Socratic Hint**: return (a >= b) ? a : b;
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.max(10, 20) != 20) throw new AssertionError("max(10, 20) must be 20");
        if (Solution.max(50, 30) != 50) throw new AssertionError("max(50, 30) must be 50");
        if (Solution.max(-5, -10) != -5) throw new AssertionError("max(-5, -10) must be -5");
    }
}
```


################################################################################
# 📅 DAY 10: Call Stack, Variable Scopes & ⭐ MILESTONE 2: Financial Utility Engine
################################################################################

**Core Intuitive Metaphor**: Milestone 2 — Modular Financial Utility Engine: The Call Stack is like a stack of cafeteria trays: every time you call a method, a new tray is placed on top. When the method finishes, its tray is popped off and local variables vanish.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-10`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: The Call Stack (Stack Frames in Action) (Block ID: `java-d10-b1-call-stack`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Call Stack Frames`
* **Supporting Terms**: Push, Pop, Active Frame
* **Prerequisites Required**: `java-d9-b2-anatomy` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Stack of Cafeteria Trays"*
  > When main() calls calculateTax(), Java places calculateTax on top of the stack. main() pauses and waits. When calculateTax finishes, its tray is popped off and main() resumes.
* **⚡ Logic Execution Flowchart**:
  - Step 1 [START]: 1. main() pushes frame
  - Step 2 [PROCESS]: 2. main() calls calculateTax(100)
  - Step 3 [PROCESS]: 3. calculateTax frame placed on top
  - Step 4 [PROCESS]: 4. calculateTax returns 8.0 & pops off
  - Step 5 [END]: 5. main() receives 8.0 & resumes
* **💻 Runnable Interactive Java Code Sandbox** (`StackTraceDemo.java` | Editable: No):
  ```java
  public class StackTraceDemo {
      public static void stepTwo() {
          System.out.println("Step 2: Top of Stack");
      }
      public static void stepOne() {
          System.out.println("Step 1: Calling stepTwo");
          stepTwo();
          System.out.println("Step 1: Resumed after pop");
      }
      public static void main(String[] args) {
          stepOne();
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Step 1: Calling stepTwo
    Step 2: Top of Stack
    Step 1: Resumed after pop
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What happens to a method stack frame when the method finishes executing?
* **Selectable Options**:
  - [x] **Option A**: It is popped off the call stack and its local variables vanish from memory
  - [ ] **Option B**: It stays in memory permanently and blocks other methods
  - [ ] **Option C**: It is copied to the hard drive
* **Targeted Misconception ID**: `MC_JAVA_VARIABLE_REASSIGNMENT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_VARIABLE_REASSIGNMENT`
    + 🔍 **What Went Wrong**: When a method returns, its stack frame is popped and cleaned up automatically.
    + 💡 **Simpler Everyday Picture**: Method ends = tray removed from stack = local variables vanish.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Block Scope ({ Curly Brace } Boundaries) (Block ID: `java-d10-b2-scope`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Variable Scope`
* **Supporting Terms**: Curly Braces, Local Visibility
* **Prerequisites Required**: `java-d10-b1-call-stack` (understood)

**2. Media & Conceptual Scaffolding**:
* **🔍 Broken vs Fixed Visual Diff**:
  - ❌ **Broken Code**: `if (true) {     int discount = 15; } System.out.println(discount); // ❌ Error: Cannot find symbol discount`
  - ✅ **Fixed Code**: `int discount = 0; if (true) {     discount = 15; } System.out.println(discount); // ✅ Correct! Prints 15`
  - **Why it Broke**: Variables declared inside { } only exist inside those braces.
  - **How to Fix**: Declare the variable outside the block before the if statement if you need to use it later.
* **💻 Runnable Interactive Java Code Sandbox** (`ScopeDemo.java` | Editable: No):
  ```java
  public class ScopeDemo {
      public static void main(String[] args) {
          int globalVar = 100;
          if (true) {
              int localVar = 50;
              System.out.println("Inside block: " + (globalVar + localVar));
          }
          System.out.println("Outside block: " + globalVar);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Inside block: 150
    Outside block: 100
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Where can a variable declared inside an if { ... } block be accessed?
* **Selectable Options**:
  - [x] **Option A**: Only inside that specific { ... } block
  - [ ] **Option B**: Anywhere in the entire Java file
  - [ ] **Option C**: Only after main finishes
* **Targeted Misconception ID**: `MC_JAVA_VARIABLE_REASSIGNMENT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_VARIABLE_REASSIGNMENT`
    + 🔍 **What Went Wrong**: Variables declared inside braces are limited to that block scope.
    + 💡 **Simpler Everyday Picture**: Curly braces are private rooms: variables created inside stay inside.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Helper Method Composition (Block ID: `java-d10-b3-helper-methods`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Helper Methods`
* **Supporting Terms**: Method Calling Method, Modular Step
* **Prerequisites Required**: `java-d10-b2-scope` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Assembly Line Station"*
  > Station 1 stamps the metal (applyDiscount). Station 2 paints it (applyTax). Each helper method does one simple job perfectly.
* **💻 Runnable Interactive Java Code Sandbox** (`AssemblyLine.java` | Editable: No):
  ```java
  public class AssemblyLine {
      public static double applyTax(double amount, double rate) {
          return amount + (amount * rate);
      }
      public static double processOrder(double price, double taxRate) {
          return applyTax(price, taxRate);
      }
      public static void main(String[] args) {
          System.out.println("Final: " + processOrder(50.0, 0.10));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Final: 55.0
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In AssemblyLine above, what is the output of processOrder(50.0, 0.10)?
* **Correct Answer**: `Final: 55.0` (Variants: Final: 55.0, 55.0, 55)
* **Targeted Misconception ID**: `MC_JAVA_METHOD_CALL_COMPOSITION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_METHOD_CALL_COMPOSITION`
    + 🔍 **What Went Wrong**: 50 + (50 * 0.10) = 55.0.
    + 💡 **Simpler Everyday Picture**: 50 + 5 = 55.0.
    + 🚀 **Guided Retry Prompt**: Type Final: 55.0

--------------------------------------------------------------------------------
#### 🔹 Slide 4: ⭐ MILESTONE 2: Multi-Method Financial Engine (Block ID: `java-d10-b4-milestone-2`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Method Composition`
* **Supporting Terms**: Helper Methods, Modular Architecture
* **Prerequisites Required**: `java-d10-b3-helper-methods` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`FinancialEngine.java` | Editable: No):
  ```java
  public class FinancialEngine {
      public static double applyDiscount(double p, double d) {
          return p - (p * d);
      }
      public static double finalPrice(double p, double d, double t) {
          double disc = applyDiscount(p, d);
          return disc + (disc * t);
      }
      public static void main(String[] args) {
          System.out.println("Final: " + finalPrice(100.0, 0.10, 0.05));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Final: 94.5
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: In Milestone 2, how do applyDiscount and finalPrice connect?
* **Selectable Options**:
  - [x] **Option A**: finalPrice calls applyDiscount and uses its return value to calculate tax
  - [ ] **Option B**: They share a single global variable that cannot be changed
  - [ ] **Option C**: They must be in two separate files
* **Targeted Misconception ID**: `MC_JAVA_METHOD_RETURN_FEEDTHROUGH`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_METHOD_RETURN_FEEDTHROUGH`
    + 🔍 **What Went Wrong**: Methods return values that can be passed into other methods.
    + 💡 **Simpler Everyday Picture**: Method output feeds into another method as input.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-10`)
* **Exam Title**: Day 10 Milestone 2: Financial Utility Engine
* **Problem Statement**: Write applyDiscount(double p, double d) and finalPrice(double p, double d, double t) returning discounted price + tax in Solution.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static double applyDiscount(double p, double d) {
        return p - (p * d);
    }
    public static double finalPrice(double p, double d, double t) {
        double disc = applyDiscount(p, d);
        return disc + (disc * t);
    }
}
```
* **Socratic Hint**: double disc = applyDiscount(p, d); return disc + (disc * t);
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Math.abs(Solution.applyDiscount(100.0, 0.10) - 90.0) > 0.001) throw new AssertionError("100 with 10% disc must be 90.0");
        if (Math.abs(Solution.finalPrice(100.0, 0.10, 0.05) - 94.5) > 0.001) throw new AssertionError("90 with 5% tax must be 94.5");
        if (Math.abs(Solution.finalPrice(200.0, 0.0, 0.08) - 216.0) > 0.001) throw new AssertionError("200 with 0% disc and 8% tax must be 216.0");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-10`)
* **Assignment Title**: Day 10 Assignment: Temperature Converter
* **Problem Statement**: Write cToF(double celsius) returning (celsius * 9/5) + 32.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static double cToF(double c) {
        return (c * 9.0 / 5.0) + 32.0;
    }
}
```
* **Socratic Hint**: return (c * 9.0 / 5.0) + 32.0;
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Math.abs(Solution.cToF(0.0) - 32.0) > 0.001) throw new AssertionError("0C must be 32F");
        if (Math.abs(Solution.cToF(100.0) - 212.0) > 0.001) throw new AssertionError("100C must be 212F");
    }
}
```


################################################################################
# 📅 DAY 11: Method Overloading & Clean Signatures
################################################################################

**Core Intuitive Metaphor**: Method overloading is like a universal TV remote with a Power button: pressing Power turns on the TV; pressing Power while holding Shift turns on the soundbar. Same button name, different inputs.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-11`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Overload? (Intuitive Naming) (Block ID: `java-d11-b1-why-overload`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Method Overloading Concept`
* **Supporting Terms**: Clean API, Shared Intent
* **Prerequisites Required**: `java-d9-b2-anatomy` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Universal Remote"*
  > Instead of memorizing calculateAreaSquare(4) and calculateAreaRectangle(4, 5), you simply name both calculateArea. Java looks at the arguments you pass and runs the matching version.
* **💻 Runnable Interactive Java Code Sandbox** (`OverloadConcept.java` | Editable: No):
  ```java
  public class OverloadConcept {
      public static String format(int num) { return "Number: " + num; }
      public static String format(String text) { return "Text: " + text; }
      public static void main(String[] args) {
          System.out.println(format(42));
          System.out.println(format("Hello"));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Number: 42
    Text: Hello
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why do developers overload methods instead of creating different names like addInt and addDouble?
* **Selectable Options**:
  - [x] **Option A**: It creates cleaner, intuitive APIs so callers use one consistent method name for the same conceptual action
  - [ ] **Option B**: It makes the compiler faster
  - [ ] **Option C**: Java only permits 10 method names per class
* **Targeted Misconception ID**: `MC_JAVA_OVERLOAD_PURPOSE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OVERLOAD_PURPOSE`
    + 🔍 **What Went Wrong**: Overloading provides intuitive, unified naming for the same logical operation.
    + 💡 **Simpler Everyday Picture**: Same name = same conceptual action with different inputs.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Overloading by Parameter Types (Block ID: `java-d11-b2-overload-types`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Type Overloading`
* **Supporting Terms**: Type Signature, Int vs Double
* **Prerequisites Required**: `java-d11-b1-why-overload` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`OverloadDemo.java` | Editable: No):
  ```java
  public class OverloadDemo {
      public static int add(int a, int b) {
          return a + b;
      }
      public static double add(double a, double b) {
          return a + b;
      }
      public static void main(String[] args) {
          System.out.println("Int: " + add(2, 3));
          System.out.println("Double: " + add(2.5, 3.5));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Int: 5
    Double: 6.0
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Can two methods in the same class have the exact same name?
* **Selectable Options**:
  - [x] **Option A**: Yes, provided their parameter types or counts are different
  - [ ] **Option B**: No, Java throws a compile error whenever two methods share a name
  - [ ] **Option C**: Only if one method is private
* **Targeted Misconception ID**: `MC_JAVA_OVERLOAD_PARAMETER_SIGNATURE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OVERLOAD_PARAMETER_SIGNATURE`
    + 🔍 **What Went Wrong**: Java supports method overloading when parameter signatures differ.
    + 💡 **Simpler Everyday Picture**: Same name is allowed if inputs are different.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Overloading by Parameter Count (Block ID: `java-d11-b3-overload-count`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Count Overloading`
* **Supporting Terms**: Optional Arguments, Arity
* **Prerequisites Required**: `java-d11-b2-overload-types` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  public static double calculateTotal(double price) {
      return calculateTotal(price, 0.05); // Default 5% tax
  }
  public static double calculateTotal(double price, double taxRate) {
      return price + (price * taxRate);
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: The 1-parameter version delegates to the 2-parameter version with a default tax rate of 0.05.
* **💻 Runnable Interactive Java Code Sandbox** (`OverloadCountDemo.java` | Editable: No):
  ```java
  public class OverloadCountDemo {
      public static double priceWithTax(double p) {
          return priceWithTax(p, 0.05);
      }
      public static double priceWithTax(double p, double tax) {
          return p + (p * tax);
      }
      public static void main(String[] args) {
          System.out.println("Default: " + priceWithTax(100.0));
          System.out.println("Custom: " + priceWithTax(100.0, 0.10));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Default: 105.0
    Custom: 110.0
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In the code above, what does calculateTotal(100.0) return?
* **Correct Answer**: `105.0` (Variants: 105.0, 105)
* **Targeted Misconception ID**: `MC_JAVA_OVERLOAD_ARITY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_OVERLOAD_ARITY`
    + 🔍 **What Went Wrong**: calculateTotal(100.0) calls calculateTotal(100.0, 0.05) = 105.0.
    + 💡 **Simpler Everyday Picture**: 100 + (100 * 0.05) = 105.0.
    + 🚀 **Guided Retry Prompt**: Type 105.0.

--------------------------------------------------------------------------------
#### 🔹 Slide 4: The Return Type Trap (Signature Match Rules) (Block ID: `java-d11-b4-signature-rules`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Signature Match Rules`
* **Supporting Terms**: Return Type Excluded, Compiler Ambiguity
* **Prerequisites Required**: `java-d11-b3-overload-count` (understood)

**2. Media & Conceptual Scaffolding**:
* **🔍 Broken vs Fixed Visual Diff**:
  - ❌ **Broken Code**: `public static int getNum() { return 5; } public static double getNum() { return 5.0; } // ❌ Error: duplicate method`
  - ✅ **Fixed Code**: `public static int getIntNum() { return 5; } public static double getDoubleNum() { return 5.0; } // ✅ Correct!`
  - **Why it Broke**: Java cannot decide which getNum() to call when you write getNum(). Changing return type alone is not overloading.
  - **How to Fix**: Change the parameter list (types or count) to create a valid overload.
* **💻 Runnable Interactive Java Code Sandbox** (`SignatureRulesDemo.java` | Editable: No):
  ```java
  public class SignatureRulesDemo {
      public static int multiply(int a, int b) { return a * b; }
      public static double multiply(double a, double b) { return a * b; }
      public static void main(String[] args) {
          System.out.println("Int: " + multiply(4, 5));
          System.out.println("Double: " + multiply(2.5, 4.0));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Int: 20
    Double: 10.0
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why does changing only the return type (int vs double) fail to overload a method?
* **Selectable Options**:
  - [x] **Option A**: Because Java identifies which method to call based on input arguments, not what it returns
  - [ ] **Option B**: Because return types cannot be numbers
  - [ ] **Option C**: Because double takes more memory
* **Targeted Misconception ID**: `MC_JAVA_OVERLOAD_RETURN_TYPE_ONLY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OVERLOAD_RETURN_TYPE_ONLY`
    + 🔍 **What Went Wrong**: Overload resolution is based entirely on parameter list signatures.
    + 💡 **Simpler Everyday Picture**: The caller only passes inputs: Java picks based on inputs.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-11`)
* **Exam Title**: Day 11 Challenge: Overloaded Area Calculator
* **Problem Statement**: Write calculateArea(int side) returning square area, and calculateArea(int l, int w) returning rectangle area.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int calculateArea(int side) { return side * side; }
    public static int calculateArea(int l, int w) { return l * w; }
}
```
* **Socratic Hint**: Define two calculateArea methods with different parameter lists.
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.calculateArea(5) != 25) throw new AssertionError("Square 5 must be 25");
        if (Solution.calculateArea(0) != 0) throw new AssertionError("Square 0 must be 0");
        if (Solution.calculateArea(4, 7) != 28) throw new AssertionError("Rect 4x7 must be 28");
        if (Solution.calculateArea(10, 2) != 20) throw new AssertionError("Rect 10x2 must be 20");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-11`)
* **Assignment Title**: Day 11 Assignment: Overloaded String Multiplier
* **Problem Statement**: Write repeat(String s) returning s + s, and repeat(String s, int times) repeating s times times.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static String repeat(String s) { return s + s; }
    public static String repeat(String s, int n) {
        String r = ""; for (int i=0; i<n; i++) r += s; return r;
    }
}
```
* **Socratic Hint**: Use a loop for repeat(s, n).
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.repeat("Hi").equals("HiHi")) throw new AssertionError("Default repeat must be HiHi");
        if (!Solution.repeat("A", 3).equals("AAA")) throw new AssertionError("A x 3 must be AAA");
    }
}
```


################################################################################
# 📅 DAY 12: 1D Arrays — Contiguous Memory Allocation & Indexing
################################################################################

**Core Intuitive Metaphor**: An array is like an egg carton with numbered slots: slot 0 holds the first egg, slot 1 holds the second. Counting always starts at 0!

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-12`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Arrays? (The Numbered Egg Carton) (Block ID: `java-d12-b1-why-arrays`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `1D Arrays Concept`
* **Supporting Terms**: Indexed Collection, Uniform Type
* **Prerequisites Required**: `java-d8-b1-for-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Numbered Egg Carton"*
  > Instead of creating 50 separate variables for 50 student scores (score1, score2, ... score50), an array packages all 50 scores inside one indexed container scores[i].
* **💻 Runnable Interactive Java Code Sandbox** (`ArrayEggCarton.java` | Editable: No):
  ```java
  public class ArrayEggCarton {
      public static void main(String[] args) {
          int[] carton = { 10, 20, 30, 40 };
          System.out.println("Carton size: " + carton.length);
          System.out.println("Slot 0: " + carton[0]);
          System.out.println("Slot 3: " + carton[3]);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Carton size: 4
    Slot 0: 10
    Slot 3: 40
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the main benefit of using an array instead of individual variables?
* **Selectable Options**:
  - [x] **Option A**: Grouping multiple values of the same type under one name with indexed access
  - [ ] **Option B**: Allowing Java to delete unused files
  - [ ] **Option C**: Running code without requiring a main method
* **Targeted Misconception ID**: `MC_JAVA_ARRAY_INDEX_PURPOSE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_ARRAY_INDEX_PURPOSE`
    + 🔍 **What Went Wrong**: Arrays store ordered collections of elements accessible by index.
    + 💡 **Simpler Everyday Picture**: One array variable replaces 50 separate variables.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Array Creation & 0-Based Indexing (Block ID: `java-d12-b2-array-creation`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `0-Based Indexing`
* **Supporting Terms**: Index 0, Array Length
* **Prerequisites Required**: `java-d12-b1-why-arrays` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`ArrayDemo.java` | Editable: No):
  ```java
  public class ArrayDemo {
      public static void main(String[] args) {
          int[] scores = { 85, 92, 78, 90 };
          System.out.println("First score: " + scores[0]);
          System.out.println("Total items: " + scores.length);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    First score: 85
    Total items: 4
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: In int[] nums = { 10, 20, 30 }, what is nums[0]?
* **Selectable Options**:
  - [x] **Option A**: 10 (The first item is always at index 0)
  - [ ] **Option B**: 20 (Index 0 is the second item)
  - [ ] **Option C**: 30 (Index 0 is the last item)
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: In programming, indices start at 0. nums[0] is the first element.
    + 💡 **Simpler Everyday Picture**: First item = index 0. Second item = index 1.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: The Out-of-Bounds Trap (Index >= length) (Block ID: `java-d12-b3-array-bounds`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `ArrayIndexOutOfBoundsException`
* **Supporting Terms**: Last Index (length - 1), Index Safety
* **Prerequisites Required**: `java-d12-b2-array-creation` (understood)

**2. Media & Conceptual Scaffolding**:
* **🔍 Broken vs Fixed Visual Diff**:
  - ❌ **Broken Code**: `int[] arr = { 10, 20, 30 }; int last = arr[3]; // ❌ Crash! ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3`
  - ✅ **Fixed Code**: `int[] arr = { 10, 20, 30 }; int last = arr[arr.length - 1]; // ✅ Correct! Reads index 2 (value 30)`
  - **Why it Broke**: An array of length 3 has valid indices 0, 1, 2 only.
  - **How to Fix**: Always access the last element at arr[arr.length - 1].
* **💻 Runnable Interactive Java Code Sandbox** (`SafeBoundsDemo.java` | Editable: No):
  ```java
  public class SafeBoundsDemo {
      public static void main(String[] args) {
          int[] arr = { 100, 200, 300 };
          int lastIndex = arr.length - 1;
          System.out.println("Safe last element at index " + lastIndex + ": " + arr[lastIndex]);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Safe last element at index 2: 300
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: For an array of length 5, what is the valid index of the very last element?
* **Selectable Options**:
  - [x] **Option A**: 4 (length - 1)
  - [ ] **Option B**: 5
  - [ ] **Option C**: 0
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: Indices run from 0 to length - 1 (0, 1, 2, 3, 4).
    + 💡 **Simpler Everyday Picture**: 5 items: 0, 1, 2, 3, 4. The last index is 4.
    + 🚀 **Guided Retry Prompt**: Select 4.

--------------------------------------------------------------------------------
#### 🔹 Slide 4: Iterating Arrays with For Loops (Block ID: `java-d12-b4-array-traversal`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Array For-Loop Traversal`
* **Supporting Terms**: arr[i], Loop Scanning
* **Prerequisites Required**: `java-d12-b3-array-bounds` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`ArrayScan.java` | Editable: No):
  ```java
  public class ArrayScan {
      public static void main(String[] args) {
          int[] values = { 10, 20, 30 };
          int sum = 0;
          for (int i = 0; i < values.length; i++) {
              sum += values[i];
          }
          System.out.println("Sum: " + sum);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Sum: 60
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In ArrayScan above, what is printed as the final Sum?
* **Correct Answer**: `Sum: 60` (Variants: Sum: 60, 60)
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: 10 + 20 + 30 = 60.
    + 💡 **Simpler Everyday Picture**: Summing all 3 items gives 60.
    + 🚀 **Guided Retry Prompt**: Type Sum: 60

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-12`)
* **Exam Title**: Day 12 Challenge: Find Maximum in Array
* **Problem Statement**: Write findMax(int[] arr) returning the highest integer in arr.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int findMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        return max;
    }
}
```
* **Socratic Hint**: Initialize max = arr[0] and iterate through the rest.
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.findMax(new int[]{ 10, 50, 20, 80, 30 }) != 80) throw new AssertionError("Max must be 80");
        if (Solution.findMax(new int[]{ 99 }) != 99) throw new AssertionError("Single element max must be 99");
        if (Solution.findMax(new int[]{ -10, -50, -5, -20 }) != -5) throw new AssertionError("Negative max must be -5");
        if (Solution.findMax(new int[]{ 100, 20, 30 }) != 100) throw new AssertionError("First element max must be 100");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-12`)
* **Assignment Title**: Day 12 Assignment: Array Sum
* **Problem Statement**: Write sumArray(int[] arr) returning total sum of elements.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int sumArray(int[] arr) {
        int sum = 0;
        for (int i=0; i<arr.length; i++) sum += arr[i];
        return sum;
    }
}
```
* **Socratic Hint**: for (int i = 0; i < arr.length; i++) sum += arr[i];
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.sumArray(new int[]{1, 2, 3}) != 6) throw new AssertionError("Sum 1+2+3 must be 6");
        if (Solution.sumArray(new int[]{}) != 0) throw new AssertionError("Empty array sum must be 0");
    }
}
```


################################################################################
# 📅 DAY 13: Enhanced For-Each Loop & Array Traversal
################################################################################

**Core Intuitive Metaphor**: The for-each loop is like an airport luggage conveyor belt: each item in the array slides right into your hands one by one without needing a manual counter index (i++).

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-13`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: The For-Each Loop (Clean Traversal) (Block ID: `java-d13-b1-foreach-syntax`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Enhanced For-Each Loop`
* **Supporting Terms**: Read-Only Iteration, Cleaner Syntax
* **Prerequisites Required**: `java-d12-b1-why-arrays` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Airport Luggage Belt"*
  > The for-each loop slides every element directly to you: for (int score : scores) inspects each score automatically from left to right.
* **💻 Runnable Interactive Java Code Sandbox** (`ForEachDemo.java` | Editable: No):
  ```java
  public class ForEachDemo {
      public static void main(String[] args) {
          int[] prices = { 10, 20, 30 };
          int sum = 0;
          for (int p : prices) {
              sum += p;
          }
          System.out.println("Total: " + sum);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Total: 60
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the syntax for iterating through int[] nums using for-each?
* **Selectable Options**:
  - [x] **Option A**: for (int n : nums)
  - [ ] **Option B**: for (int n in nums)
  - [ ] **Option C**: for (nums : int n)
* **Targeted Misconception ID**: `MC_JAVA_FOREACH_COLON_SYNTAX`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_FOREACH_COLON_SYNTAX`
    + 🔍 **What Went Wrong**: In Java, the for-each syntax uses a colon (:): for (Type var : array).
    + 💡 **Simpler Everyday Picture**: Type colon Array: for (int x : list).
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Read-Only Iteration (The Photocopy in For-Each) (Block ID: `java-d13-b2-readonly-rule`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `For-Each Read-Only Nature`
* **Supporting Terms**: Value Copy, Non-Mutating
* **Prerequisites Required**: `java-d13-b1-foreach-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Inspecting Luggage Tags"*
  > When you inspect a luggage tag on the conveyor belt, reading the tag does not change what is inside the suitcase. Modifying the loop variable p = 999 does NOT change the array.
* **💻 Runnable Interactive Java Code Sandbox** (`ReadOnlyDemo.java` | Editable: No):
  ```java
  public class ReadOnlyDemo {
      public static void main(String[] args) {
          int[] nums = { 10, 20 };
          for (int n : nums) {
              n = 999; // Modifies local copy only!
          }
          System.out.println("nums[0] remains: " + nums[0]);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    nums[0] remains: 10
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Can you modify the original array elements by reassigning the loop variable in a for-each loop?
* **Selectable Options**:
  - [x] **Option A**: No, the loop variable is a local copy; modifying it does not alter the array
  - [ ] **Option B**: Yes, it automatically updates the array
  - [ ] **Option C**: Only if the array is double
* **Targeted Misconception ID**: `MC_JAVA_PASS_BY_VALUE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_PASS_BY_VALUE`
    + 🔍 **What Went Wrong**: for-each delivers values by copy; use indexed for (int i=0; i<arr.length; i++) if you need to mutate elements.
    + 💡 **Simpler Everyday Picture**: for-each is for reading, standard for loop is for modifying.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Filtering & Counting Elements (Block ID: `java-d13-b3-filtering-pattern`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Conditional Accumulation`
* **Supporting Terms**: Filter Condition, Count Match
* **Prerequisites Required**: `java-d13-b2-readonly-rule` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`FilterDemo.java` | Editable: No):
  ```java
  public class FilterDemo {
      public static void main(String[] args) {
          int[] scores = { 45, 88, 92, 50, 75 };
          int passing = 0;
          for (int s : scores) {
              if (s >= 70) passing++;
          }
          System.out.println("Passing students: " + passing);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Passing students: 3
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In FilterDemo above, how many scores are >= 70 (88, 92, 75)?
* **Correct Answer**: `Passing students: 3` (Variants: Passing students: 3, 3)
* **Targeted Misconception ID**: `MC_JAVA_FILTER_COUNT_LOGIC`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_FILTER_COUNT_LOGIC`
    + 🔍 **What Went Wrong**: 88, 92, and 75 meet the condition, giving 3 passing students.
    + 💡 **Simpler Everyday Picture**: Count: 88 (1), 92 (2), 75 (3). Total is 3.
    + 🚀 **Guided Retry Prompt**: Type Passing students: 3

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-13`)
* **Exam Title**: Day 13 Challenge: Count Positive Numbers
* **Problem Statement**: Write countPositives(int[] arr) using a for-each loop to return the count of numbers > 0.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int countPositives(int[] arr) {
        int count = 0;
        for (int n : arr) {
            if (n > 0) count++;
        }
        return count;
    }
}
```
* **Socratic Hint**: for (int n : arr) if (n > 0) count++;
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.countPositives(new int[]{ -5, 10, 0, 20, -1 }) != 2) throw new AssertionError("Must find 2 positives (10, 20)");
        if (Solution.countPositives(new int[]{ 1, 2, 3 }) != 3) throw new AssertionError("All positive must be 3");
        if (Solution.countPositives(new int[]{ -1, -2, 0 }) != 0) throw new AssertionError("None positive must be 0");
        if (Solution.countPositives(new int[]{}) != 0) throw new AssertionError("Empty array must return 0");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-13`)
* **Assignment Title**: Day 13 Assignment: String Array Joiner
* **Problem Statement**: Write joinStrings(String[] words) returning words concatenated with commas.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static String joinStrings(String[] words) {
        String res = "";
        for (String w : words) res += w + ",";
        return res;
    }
}
```
* **Socratic Hint**: for (String w : words) res += w + ",";
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.joinStrings(new String[]{"A", "B"}).equals("A,B,")) throw new AssertionError("Must return 'A,B,'");
    }
}
```


################################################################################
# 📅 DAY 14: 2D Arrays & Grid Traversal
################################################################################

**Core Intuitive Metaphor**: A 2D array is like a Tic-Tac-Toe board or spreadsheet: you specify a row and a column coordinate like matrix[row][col].

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-14`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: 2D Arrays (Row & Column Coordinates) (Block ID: `java-d14-b1-matrix-grid`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `2D Matrices`
* **Supporting Terms**: Row Index, Column Index
* **Prerequisites Required**: `java-d12-b1-why-arrays` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Spreadsheet Grid"*
  > matrix[0][1] means Row 0, Column 1. To visit every cell, you use a nested loop: outer loop for rows, inner loop for columns.
* **💻 Runnable Interactive Java Code Sandbox** (`MatrixDemo.java` | Editable: No):
  ```java
  public class MatrixDemo {
      public static void main(String[] args) {
          int[][] grid = {
              { 1, 2 },
              { 3, 4 }
          };
          System.out.println("Top right: " + grid[0][1]);
          System.out.println("Bottom left: " + grid[1][0]);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Top right: 2
    Bottom left: 3
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: In int[][] grid = { {1,2}, {3,4} }, which coordinate accesses the number 4?
* **Selectable Options**:
  - [x] **Option A**: grid[1][1] (Row 1, Column 1)
  - [ ] **Option B**: grid[2][2] (Row 2, Column 2)
  - [ ] **Option C**: grid[0][0] (Row 0, Column 0)
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: Indices start at 0. Row 1, Col 1 is the bottom right corner (4).
    + 💡 **Simpler Everyday Picture**: First row is 0, second row is 1. grid[1][1] is 4.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Nested Loop Grid Traversal (Block ID: `java-d14-b2-matrix-nested-traversal`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Nested Matrix Traversal`
* **Supporting Terms**: grid[r][c], Row Scan
* **Prerequisites Required**: `java-d14-b1-matrix-grid` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  for (int r = 0; r < grid.length; r++) {
      for (int c = 0; c < grid[r].length; c++) {
          System.out.print(grid[r][c] + " ");
      }
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: grid.length is the number of rows.
    + **Line 2**: grid[r].length is the number of columns in row r.
* **💻 Runnable Interactive Java Code Sandbox** (`NestedMatrixScan.java` | Editable: No):
  ```java
  public class NestedMatrixScan {
      public static void main(String[] args) {
          int[][] table = { { 1, 2 }, { 3, 4 } };
          int total = 0;
          for (int r = 0; r < table.length; r++) {
              for (int c = 0; c < table[r].length; c++) {
                  total += table[r][c];
              }
          }
          System.out.println("Matrix Sum: " + total);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Matrix Sum: 10
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: In a 2D array grid, what does grid.length represent?
* **Selectable Options**:
  - [x] **Option A**: The number of rows in the matrix
  - [ ] **Option B**: The total number of all cells combined
  - [ ] **Option C**: The number of columns in the first row only
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: grid.length gives the outer array length (rows).
    + 💡 **Simpler Everyday Picture**: grid.length = rows. grid[0].length = columns.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Square Matrix Diagonals (grid[i][i]) (Block ID: `java-d14-b3-diagonal-sum`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Matrix Diagonal Scan`
* **Supporting Terms**: Single Loop Optimization, r == c
* **Prerequisites Required**: `java-d14-b2-matrix-nested-traversal` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`DiagonalDemo.java` | Editable: No):
  ```java
  public class DiagonalDemo {
      public static void main(String[] args) {
          int[][] square = {
              { 5, 0 },
              { 0, 8 }
          };
          int diagonalSum = 0;
          for (int i = 0; i < square.length; i++) {
              diagonalSum += square[i][i]; // [0][0] + [1][1]
          }
          System.out.println("Diagonal Sum: " + diagonalSum);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Diagonal Sum: 13
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In DiagonalDemo above, what is 5 + 8?
* **Correct Answer**: `Diagonal Sum: 13` (Variants: Diagonal Sum: 13, 13)
* **Targeted Misconception ID**: `MC_JAVA_MATRIX_DIAGONAL_INDEX`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_MATRIX_DIAGONAL_INDEX`
    + 🔍 **What Went Wrong**: 5 + 8 = 13.
    + 💡 **Simpler Everyday Picture**: Add the diagonal cells 5 + 8 = 13.
    + 🚀 **Guided Retry Prompt**: Type Diagonal Sum: 13

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-14`)
* **Exam Title**: Day 14 Challenge: Matrix Diagonal Sum
* **Problem Statement**: Write sumDiagonal(int[][] matrix) returning sum of matrix[i][i] across an N x N square matrix.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int sumDiagonal(int[][] matrix) {
        int sum = 0;
        for (int i = 0; i < matrix.length; i++) {
            sum += matrix[i][i];
        }
        return sum;
    }
}
```
* **Socratic Hint**: for (int i = 0; i < matrix.length; i++) sum += matrix[i][i];
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        int[][] m1 = { { 1, 2 }, { 3, 4 } };
        if (Solution.sumDiagonal(m1) != 5) throw new AssertionError("Diagonal 1+4 must be 5");
        int[][] m2 = { { 5, 0, 0 }, { 0, 10, 0 }, { 0, 0, 15 } };
        if (Solution.sumDiagonal(m2) != 30) throw new AssertionError("Diagonal 5+10+15 must be 30");
        int[][] m3 = { { 99 } };
        if (Solution.sumDiagonal(m3) != 99) throw new AssertionError("1x1 matrix diagonal must be 99");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-14`)
* **Assignment Title**: Day 14 Assignment: Count Total Matrix Elements
* **Problem Statement**: Write countCells(int[][] grid) returning total number of cells in the 2D grid.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int countCells(int[][] grid) {
        int count = 0;
        for (int r=0; r<grid.length; r++) count += grid[r].length;
        return count;
    }
}
```
* **Socratic Hint**: Count rows * cols.
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        int[][] g = { { 1, 2, 3 }, { 4, 5, 6 } };
        if (Solution.countCells(g) != 6) throw new AssertionError("2x3 must have 6 cells");
    }
}
```


################################################################################
# 📅 DAY 15: Search Algorithms & ⭐ MILESTONE 3: Fast Data Ledger
################################################################################

**Core Intuitive Metaphor**: Milestone 3 — Fast Data Ledger: Linear search is like checking every page of a book one by one. Binary search is like opening a dictionary in the exact middle and cutting your search area in half with every step.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-15`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Linear Search (Sequential Scan) (Block ID: `java-d15-b1-linear-search`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Linear Search`
* **Supporting Terms**: Sequential Check, Unsorted Search
* **Prerequisites Required**: `java-d12-b4-array-traversal` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Flipping Every Card One by One"*
  > Linear search inspects index 0, then index 1, then index 2. It works on any unsorted list, but takes O(N) steps.
* **💻 Runnable Interactive Java Code Sandbox** (`LinearDemo.java` | Editable: No):
  ```java
  public class LinearDemo {
      public static int search(int[] arr, int target) {
          for (int i = 0; i < arr.length; i++) {
              if (arr[i] == target) return i;
          }
          return -1;
      }
      public static void main(String[] args) {
          int[] items = { 40, 10, 30, 20 };
          System.out.println("Found 30 at index: " + search(items, 30));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Found 30 at index: 2
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In LinearDemo with items { 40, 10, 30, 20 }, what index is returned for target 30?
* **Correct Answer**: `Found 30 at index: 2` (Variants: Found 30 at index: 2, 2)
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: 30 is at index 2 (40 is at 0, 10 is at 1, 30 is at 2).
    + 💡 **Simpler Everyday Picture**: Count: 0, 1, 2. Index 2 holds 30.
    + 🚀 **Guided Retry Prompt**: Type Found 30 at index: 2

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Binary Search (The Dictionary Halving Trick) (Block ID: `java-d15-b2-binary-search-concept`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Binary Search Divide & Conquer`
* **Supporting Terms**: Halving Steps, low, mid, high
* **Prerequisites Required**: `java-d15-b1-linear-search` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Dictionary Halving Trick"*
  > If an array is sorted, check the middle item. If your target is larger, throw away the left half. If smaller, throw away the right half. You find any item in a 1,000,000-item array in just 20 steps!
* **⚡ Logic Execution Flowchart**:
  - Step 1 [START]: 1. Sorted Array: [10, 20, 30, 40, 50]
  - Step 2 [DECISION]: 2. Check mid (30) vs target (40)
  - Step 3 [PROCESS]: 3. 40 > 30 -> discard left half [10, 20, 30]
  - Step 4 [END]: 4. Search remaining right half [40, 50]
* **💻 Runnable Interactive Java Code Sandbox** (`HalvingDemo.java` | Editable: No):
  ```java
  public class HalvingDemo {
      public static void main(String[] args) {
          int[] sorted = { 10, 20, 30, 40, 50, 60, 70 };
          int low = 0, high = sorted.length - 1;
          int mid = low + (high - low) / 2;
          System.out.println("Middle element of sorted array: " + sorted[mid]);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Middle element of sorted array: 40
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the critical prerequisite for Binary Search to function correctly?
* **Selectable Options**:
  - [x] **Option A**: The array MUST be sorted in ascending order
  - [ ] **Option B**: The array must contain only positive numbers
  - [ ] **Option C**: The array must have an even number of elements
* **Targeted Misconception ID**: `MC_JAVA_BINARY_SEARCH_UNSORTED`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_BINARY_SEARCH_UNSORTED`
    + 🔍 **What Went Wrong**: Binary search relies on sorted ordering to eliminate half the items.
    + 💡 **Simpler Everyday Picture**: You can only cut in half if the list is sorted in order.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: ⭐ MILESTONE 3: Fast Binary Search Ledger (Block ID: `java-d15-b3-milestone-3`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Binary Search Implementation`
* **Supporting Terms**: mid Calculation, O(log N) Efficiency
* **Prerequisites Required**: `java-d15-b2-binary-search-concept` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`BinarySearchDemo.java` | Editable: No):
  ```java
  public class BinarySearchDemo {
      public static int search(int[] arr, int target) {
          int low = 0, high = arr.length - 1;
          while (low <= high) {
              int mid = low + (high - low) / 2;
              if (arr[mid] == target) return mid;
              if (arr[mid] < target) low = mid + 1;
              else high = mid - 1;
          }
          return -1;
      }
      public static void main(String[] args) {
          int[] sorted = { 10, 20, 30, 40, 50 };
          System.out.println("Index of 40: " + search(sorted, 40));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Index of 40: 3
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What does binarySearch return if the target element is NOT present in the array?
* **Selectable Options**:
  - [x] **Option A**: -1
  - [ ] **Option B**: 0
  - [ ] **Option C**: Throws an exception
* **Targeted Misconception ID**: `MC_JAVA_OFF_BY_ONE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_OFF_BY_ONE`
    + 🔍 **What Went Wrong**: Standard Java search convention returns -1 when a target is not found.
    + 💡 **Simpler Everyday Picture**: -1 indicates "not found".
    + 🚀 **Guided Retry Prompt**: Select -1.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-15`)
* **Exam Title**: Day 15 Milestone 3: Binary Search Ledger
* **Problem Statement**: Write binarySearch(int[] arr, int target) in Solution returning index of target in sorted arr, or -1 if not found.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}
```
* **Socratic Hint**: Use while (low <= high) and calculate mid = low + (high - low) / 2.
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        int[] arr = { 10, 20, 30, 40, 50, 60, 70 };
        if (Solution.binarySearch(arr, 10) != 0) throw new AssertionError("Target at first index 0 failed");
        if (Solution.binarySearch(arr, 40) != 3) throw new AssertionError("Target at middle index 3 failed");
        if (Solution.binarySearch(arr, 70) != 6) throw new AssertionError("Target at last index 6 failed");
        if (Solution.binarySearch(arr, 99) != -1) throw new AssertionError("Missing element 99 must return -1");
        if (Solution.binarySearch(arr, 5) != -1) throw new AssertionError("Missing element 5 < min must return -1");
        if (Solution.binarySearch(new int[]{ 42 }, 42) != 0) throw new AssertionError("Single element match failed");
        if (Solution.binarySearch(new int[]{ 42 }, 99) != -1) throw new AssertionError("Single element missing failed");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-15`)
* **Assignment Title**: Day 15 Assignment: Linear Search
* **Problem Statement**: Write linearSearch(int[] arr, int target) returning index of target or -1.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int linearSearch(int[] arr, int target) {
        for (int i=0; i<arr.length; i++) if (arr[i] == target) return i;
        return -1;
    }
}
```
* **Socratic Hint**: for (int i = 0; i < arr.length; i++) if (arr[i] == target) return i;
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        int[] arr = { 5, 2, 8, 1 };
        if (Solution.linearSearch(arr, 8) != 2) throw new AssertionError("8 must be at index 2");
        if (Solution.linearSearch(arr, 99) != -1) throw new AssertionError("99 must return -1");
    }
}
```


################################################################################
# 📅 DAY 16: Object-Oriented Programming — Classes, Objects & Memory Instances
################################################################################

**Core Intuitive Metaphor**: A Class is an architectural blueprint of a house drawn on paper; an Object is the real brick-and-mortar house constructed on the lot (in heap memory).

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-16`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: What is a Class? (The Blueprint) (Block ID: `java-d16-b1-blueprint`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Class Definition`
* **Supporting Terms**: Blueprint, Field Template
* **Prerequisites Required**: `java-d12-b1-why-arrays` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Cookie Cutter"*
  > A class is the metal cookie cutter: it has the shape and fields (name, age), but it is not a cookie you can eat. An object is the delicious cookie stamped out of dough in RAM.
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class Student {
      String name;
      int age;
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: class Student defines the template for all student objects.
    + **Line 2**: String name and int age are the state fields every student will possess.
* **💻 Runnable Interactive Java Code Sandbox** (`CarBlueprint.java` | Editable: No):
  ```java
  class Car {
      String model = "Sedan";
      int speed = 60;
  }
  public class CarBlueprint {
      public static void main(String[] args) {
          Car myCar = new Car();
          System.out.println("Car model: " + myCar.model + ", Speed: " + myCar.speed + " mph");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Car model: Sedan, Speed: 60 mph
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the relationship between a Class and an Object in Java?
* **Selectable Options**:
  - [x] **Option A**: A Class is the blueprint template; an Object is a real concrete instance created in memory
  - [ ] **Option B**: They are identical words for the same thing
  - [ ] **Option C**: An Object is the blueprint; a Class is the instance
* **Targeted Misconception ID**: `MC_JAVA_CLASS_VS_OBJECT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_CLASS_VS_OBJECT`
    + 🔍 **What Went Wrong**: Classes define structure; objects are the memory instances stamped out using new.
    + 💡 **Simpler Everyday Picture**: Class = blueprint on paper. Object = real house in memory.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The new Keyword (Heap Allocation) (Block ID: `java-d16-b2-new-keyword`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `new Operator`
* **Supporting Terms**: Heap Allocation, Object Instance
* **Prerequisites Required**: `java-d16-b1-blueprint` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Pouring Foundation Concrete"*
  > Writing new Student() commands Java to allocate a brand-new chunk of RAM on the Heap to hold this specific student fields.
* **📦 Memory Box Diagram**:
  - **Variable**: `s1` | **Type**: `Student reference` | **Value**: `Heap Storage: { name: "Alice", score: 95 }` (*Heap Object*)
* **💻 Runnable Interactive Java Code Sandbox** (`HeapAllocDemo.java` | Editable: No):
  ```java
  class Item {
      String label;
      double cost;
  }
  public class HeapAllocDemo {
      public static void main(String[] args) {
          Item item = new Item();
          item.label = "Laptop";
          item.cost = 899.99;
          System.out.println("Created on Heap: " + item.label + " for $" + item.cost);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Created on Heap: Laptop for $899.99
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Which keyword tells Java to construct a brand-new object instance in heap memory?
* **Selectable Options**:
  - [x] **Option A**: new
  - [ ] **Option B**: create
  - [ ] **Option C**: make
* **Targeted Misconception ID**: `MC_JAVA_NEW_KEYWORD_HEAP`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_NEW_KEYWORD_HEAP`
    + 🔍 **What Went Wrong**: In Java, the new keyword allocates object memory on the heap.
    + 💡 **Simpler Everyday Picture**: new = allocate new memory.
    + 🚀 **Guided Retry Prompt**: Select new.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Dot Notation (Accessing Fields & Methods) (Block ID: `java-d16-b3-dot-notation`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Dot Operator`
* **Supporting Terms**: Field Access, Method Invocation
* **Prerequisites Required**: `java-d16-b2-new-keyword` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  Student s = new Student();
  s.name = "Alice";
  s.age = 20;
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 2**: s.name uses the dot operator (.) to reach inside object s and set its name field.
* **💻 Runnable Interactive Java Code Sandbox** (`DotNotationDemo.java` | Editable: No):
  ```java
  class Player {
      String tag;
      int rank;
      public void levelUp() { rank++; }
  }
  public class DotNotationDemo {
      public static void main(String[] args) {
          Player p = new Player();
          p.tag = "Shadow";
          p.rank = 1;
          p.levelUp();
          System.out.println("Player: " + p.tag + " (Rank " + p.rank + ")");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Player: Shadow (Rank 2)
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: How do you access a field or method on an object reference s in Java?
* **Selectable Options**:
  - [x] **Option A**: Using the dot operator: s.fieldName
  - [ ] **Option B**: Using an arrow: s->fieldName
  - [ ] **Option C**: Using brackets: s[fieldName]
* **Targeted Misconception ID**: `MC_JAVA_DOT_NOTATION_ACCESS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_DOT_NOTATION_ACCESS`
    + 🔍 **What Went Wrong**: Java uses dot notation (.) for member access.
    + 💡 **Simpler Everyday Picture**: Use dot: object.field.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 4: Multiple Independent Instances (Block ID: `java-d16-b4-multiple-instances`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Independent Object State`
* **Supporting Terms**: Isolated Heap Boxes, No Interference
* **Prerequisites Required**: `java-d16-b3-dot-notation` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`StudentDemo.java` | Editable: No):
  ```java
  class Student {
      String name;
      int age;
  }
  public class StudentDemo {
      public static void main(String[] args) {
          Student s1 = new Student();
          s1.name = "Alice";
          Student s2 = new Student();
          s2.name = "Bob";
          System.out.println("s1: " + s1.name + ", s2: " + s2.name);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    s1: Alice, s2: Bob
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: If you change s1.name = "Charlie", what happens to s2.name?
* **Selectable Options**:
  - [x] **Option A**: s2.name remains "Bob" (s1 and s2 are completely independent objects in memory)
  - [ ] **Option B**: s2.name also changes to "Charlie"
  - [ ] **Option C**: s2 is deleted
* **Targeted Misconception ID**: `MC_JAVA_VARIABLE_REASSIGNMENT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_VARIABLE_REASSIGNMENT`
    + 🔍 **What Went Wrong**: Each object instance occupies its own independent memory space.
    + 💡 **Simpler Everyday Picture**: Two separate houses: painting House 1 does not change House 2.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-16`)
* **Exam Title**: Day 16 Challenge: BankAccount Class
* **Problem Statement**: Create class BankAccount with int balance, deposit(int amt), and getBalance().
* **Starter Code (`Solution.java`)**:
```java
class BankAccount {
    int balance = 0;
    void deposit(int amt) { balance += amt; }
    int getBalance() { return balance; }
}
public class Solution {
    public static int testBank() {
        BankAccount acc = new BankAccount();
        acc.deposit(500);
        return acc.getBalance();
    }
}
```
* **Socratic Hint**: class BankAccount { int balance = 0; void deposit(int amt) { balance += amt; } int getBalance() { return balance; } }
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        BankAccount b1 = new BankAccount();
        if (b1.getBalance() != 0) throw new AssertionError("Initial balance must be 0");
        b1.deposit(500);
        if (b1.getBalance() != 500) throw new AssertionError("Deposit 500 must produce 500");
        b1.deposit(250);
        if (b1.getBalance() != 750) throw new AssertionError("Second deposit must sum to 750");
        BankAccount b2 = new BankAccount();
        b2.deposit(100);
        if (b2.getBalance() != 100) throw new AssertionError("b2 balance must be independent (100)");
        if (b1.getBalance() != 750) throw new AssertionError("b1 balance must remain 750");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-16`)
* **Assignment Title**: Day 16 Assignment: Car Class
* **Problem Statement**: Create Car with String model and int speed, and drive() method returning speed.
* **Starter Code (`Solution.java`)**:
```java
class Car {
    String model;
    int speed = 60;
    int getSpeed() { return speed; }
}
public class Solution {
    public static int getSpeed() { return new Car().getSpeed(); }
}
```
* **Socratic Hint**: class Car { int speed = 60; int getSpeed() { return speed; } }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.getSpeed() != 60) throw new AssertionError("Speed must be 60");
    }
}
```


################################################################################
# 📅 DAY 17: Constructors & The `this` Keyword — Initializing Object State
################################################################################

**Core Intuitive Metaphor**: A Constructor is like a birth certificate filled out at the moment a baby is born: it sets the initial name and date so the baby never exists in an uninitialized, blank state.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-17`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Constructors? (Instant Initialization) (Block ID: `java-d17-b1-why-constructors`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Constructors`
* **Supporting Terms**: Initialization, No Return Type
* **Prerequisites Required**: `java-d16-b1-blueprint` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Factory Birth Certificate"*
  > Instead of creating a blank car and then setting car.color and car.doors line by line, a constructor lets you create the car fully configured in one step: new Car("Red", 4).
* **💻 Runnable Interactive Java Code Sandbox** (`ConstructorIntro.java` | Editable: No):
  ```java
  class Device {
      String name;
      public Device(String name) {
          this.name = name;
      }
  }
  public class ConstructorIntro {
      public static void main(String[] args) {
          Device d = new Device("Phone");
          System.out.println("Initialized Device: " + d.name);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Initialized Device: Phone
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is a key syntactic requirement of a Java constructor?
* **Selectable Options**:
  - [x] **Option A**: It MUST have the EXACT same name as the class and has NO return type (not even void)
  - [ ] **Option B**: It must be named initialize() and return int
  - [ ] **Option C**: It must be private
* **Targeted Misconception ID**: `MC_JAVA_CONSTRUCTOR_NAME_MISMATCH`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_CONSTRUCTOR_NAME_MISMATCH`
    + 🔍 **What Went Wrong**: Constructors must match the class name exactly and have no return type.
    + 💡 **Simpler Everyday Picture**: Constructor name = Class name. No return type.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The `this` Keyword (Disambiguation) (Block ID: `java-d17-b2-this-keyword`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `this Keyword`
* **Supporting Terms**: Current Instance, Shadowing
* **Prerequisites Required**: `java-d17-b1-why-constructors` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class User {
      String name;
      public User(String name) {
          this.name = name; // this.name is the object field; name is the parameter
      }
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 4**: this.name refers to the instance field belonging to the object; name refers to the incoming parameter.
* **💻 Runnable Interactive Java Code Sandbox** (`UserDemo.java` | Editable: No):
  ```java
  class User {
      String name;
      public User(String name) {
          this.name = name;
      }
  }
  public class UserDemo {
      public static void main(String[] args) {
          User u = new User("Alice");
          System.out.println("User: " + u.name);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    User: Alice
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: In this.name = name;, what does this.name refer to?
* **Selectable Options**:
  - [x] **Option A**: The instance variable (field) belonging to the object currently being constructed
  - [ ] **Option B**: The local parameter passed into the method
  - [ ] **Option C**: A global system setting
* **Targeted Misconception ID**: `MC_JAVA_VARIABLE_REASSIGNMENT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_VARIABLE_REASSIGNMENT`
    + 🔍 **What Went Wrong**: this refers to the current object instance.
    + 💡 **Simpler Everyday Picture**: this.name = my object field. name = parameter.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Default vs Custom Constructors (Block ID: `java-d17-b3-default-constructors`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Default Constructor Mechanics`
* **Supporting Terms**: No-Arg Constructor, Compiler Insertion
* **Prerequisites Required**: `java-d17-b2-this-keyword` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Automatic Starter Key"*
  > If you write zero constructors, Java gives you a hidden blank constructor for free: new User(). But the second you write a custom constructor like User(String name), the free blank one disappears!
* **💻 Runnable Interactive Java Code Sandbox** (`DefaultConstructorDemo.java` | Editable: No):
  ```java
  class Light {
      boolean isOn = false;
      // Implicit default constructor Light() is used
  }
  public class DefaultConstructorDemo {
      public static void main(String[] args) {
          Light l = new Light();
          System.out.println("Default light state: " + l.isOn);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Default light state: false
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What happens to the default no-argument constructor when you define a custom constructor with parameters?
* **Selectable Options**:
  - [x] **Option A**: Java no longer provides the automatic default constructor; you must declare it explicitly if you still want it
  - [ ] **Option B**: Java keeps both automatically
  - [ ] **Option C**: Java throws an error
* **Targeted Misconception ID**: `MC_JAVA_CONSTRUCTOR_NAME_MISMATCH`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_CONSTRUCTOR_NAME_MISMATCH`
    + 🔍 **What Went Wrong**: Defining any custom constructor removes the implicit default constructor.
    + 💡 **Simpler Everyday Picture**: Writing your own constructor disables the free default one.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 4: Constructor Overloading (Multiple Options) (Block ID: `java-d17-b4-overloaded-constructors`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Constructor Overloading`
* **Supporting Terms**: Multiple Ways to Build, Constructor Chaining
* **Prerequisites Required**: `java-d17-b3-default-constructors` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`ProductDemo.java` | Editable: No):
  ```java
  class Product {
      String name;
      double price;
      public Product(String name) {
          this(name, 0.0); // Chains to 2-arg constructor
      }
      public Product(String name, double price) {
          this.name = name;
          this.price = price;
      }
  }
  public class ProductDemo {
      public static void main(String[] args) {
          Product p = new Product("Book", 19.99);
          System.out.println("Product: " + p.name + " ($" + p.price + ")");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Product: Book ($19.99)
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In ProductDemo above, what is printed for Product p = new Product("Book", 19.99)?
* **Correct Answer**: `Product: Book ($19.99)` (Variants: Product: Book ($19.99), Book ($19.99))
* **Targeted Misconception ID**: `MC_JAVA_CONSTRUCTOR_OVERLOADING`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_CONSTRUCTOR_OVERLOADING`
    + 🔍 **What Went Wrong**: p.name is "Book" and p.price is 19.99.
    + 💡 **Simpler Everyday Picture**: Prints "Product: Book ($19.99)".
    + 🚀 **Guided Retry Prompt**: Type Product: Book ($19.99)

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-17`)
* **Exam Title**: Day 17 Challenge: User Constructor
* **Problem Statement**: Create class User with fields String name, int age, and constructor User(String name, int age).
* **Starter Code (`Solution.java`)**:
```java
class User {
    String name;
    int age;
    User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
public class Solution {
    public static User createUser(String name, int age) {
        return new User(name, age);
    }
}
```
* **Socratic Hint**: this.name = name; this.age = age;
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        User u1 = Solution.createUser("Vinay", 22);
        if (!u1.name.equals("Vinay") || u1.age != 22) throw new AssertionError("User Vinay 22 failed");
        User u2 = Solution.createUser("Alice", 30);
        if (!u2.name.equals("Alice") || u2.age != 30) throw new AssertionError("User Alice 30 failed");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-17`)
* **Assignment Title**: Day 17 Assignment: Book Constructor
* **Problem Statement**: Create Book with constructor Book(String title, double price).
* **Starter Code (`Solution.java`)**:
```java
class Book {
    String title; double price;
    Book(String title, double price) { this.title = title; this.price = price; }
}
public class Solution {
    public static String getTitle() { return new Book("Java", 29.99).title; }
}
```
* **Socratic Hint**: Book(String title, double price) { this.title = title; this.price = price; }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.getTitle().equals("Java")) throw new AssertionError("Title must be Java");
    }
}
```


################################################################################
# 📅 DAY 18: Encapsulation & Data Hiding — Getters, Setters & Private Fields
################################################################################

**Core Intuitive Metaphor**: Encapsulation is like a Bank ATM machine: you cannot reach your arm inside the physical vault to grab cash directly (private); you must use the verified keypad buttons (public deposit/withdraw methods) that check your PIN and balance.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-18`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: The Danger of Public Fields (Block ID: `java-d18-b1-danger-public-fields`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Data Corruption Risk`
* **Supporting Terms**: Uncontrolled Mutation, Public Fields
* **Prerequisites Required**: `java-d16-b1-blueprint` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Unlocked Cash Register on the Sidewalk"*
  > If you make bank account balance public (public int balance;), any rogue code can write account.balance = -999999; and corrupt your entire bank system.
* **💻 Runnable Interactive Java Code Sandbox** (`PublicDangerDemo.java` | Editable: No):
  ```java
  class BadVault {
      public int cash = 1000;
  }
  public class PublicDangerDemo {
      public static void main(String[] args) {
          BadVault v = new BadVault();
          v.cash = -9999; // Corrupted easily!
          System.out.println("Corrupted cash: " + v.cash);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Corrupted cash: -9999
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why should class fields generally NOT be declared public?
* **Selectable Options**:
  - [x] **Option A**: Because any outside code can directly modify and corrupt the internal state without validation
  - [ ] **Option B**: Because public variables take double the memory
  - [ ] **Option C**: Because Java only allows 2 public variables
* **Targeted Misconception ID**: `MC_JAVA_DIRECT_PRIVATE_ACCESS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_DIRECT_PRIVATE_ACCESS`
    + 🔍 **What Went Wrong**: Public fields allow uncontrolled external mutation bypassing business rules.
    + 💡 **Simpler Everyday Picture**: Public fields let anyone break your rules.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The private Modifier (The Locked Vault) (Block ID: `java-d18-b2-private-modifier`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `private Modifier`
* **Supporting Terms**: Access Control, Data Hiding
* **Prerequisites Required**: `java-d18-b1-danger-public-fields` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class Account {
      private double balance; // 🔒 Locked! Invisible to outside classes
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 2**: private means only methods inside class Account can read or modify balance.
* **💻 Runnable Interactive Java Code Sandbox** (`PrivateVaultDemo.java` | Editable: No):
  ```java
  class SafeVault {
      private int cash = 500;
      public int getCash() { return cash; }
  }
  public class PrivateVaultDemo {
      public static void main(String[] args) {
          SafeVault v = new SafeVault();
          System.out.println("Protected cash read via getter: $" + v.getCash());
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Protected cash read via getter: $500
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What happens if an external class tries to access a private field directly via acc.balance?
* **Selectable Options**:
  - [x] **Option A**: The Java compiler halts with a compilation error: balance has private access
  - [ ] **Option B**: The value 0 is returned silently
  - [ ] **Option C**: The variable becomes public automatically
* **Targeted Misconception ID**: `MC_JAVA_DIRECT_PRIVATE_ACCESS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_DIRECT_PRIVATE_ACCESS`
    + 🔍 **What Went Wrong**: private members are inaccessible outside their declaring class.
    + 💡 **Simpler Everyday Picture**: private prevents outside code from compiling.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Getters & Validation Setters (Block ID: `java-d18-b3-getters-setters`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Encapsulated Accessors`
* **Supporting Terms**: Getter, Setter Validation
* **Prerequisites Required**: `java-d18-b2-private-modifier` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`SecureAccountDemo.java` | Editable: No):
  ```java
  class SecureAccount {
      private double balance;
      public double getBalance() { return balance; }
      public void deposit(double amount) {
          if (amount > 0) {
              balance += amount;
          }
      }
  }
  public class SecureAccountDemo {
      public static void main(String[] args) {
          SecureAccount acc = new SecureAccount();
          acc.deposit(100);
          acc.deposit(-50); // Ignored by validation guard!
          System.out.println("Balance: " + acc.getBalance());
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Balance: 100.0
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In SecureAccountDemo, what is the final balance after acc.deposit(100) and acc.deposit(-50)?
* **Correct Answer**: `Balance: 100.0` (Variants: Balance: 100.0, 100.0, 100)
* **Targeted Misconception ID**: `MC_JAVA_DIRECT_PRIVATE_ACCESS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [50]** ➔ Diagnosed: `MC_JAVA_DIRECT_PRIVATE_ACCESS`
    + 🔍 **What Went Wrong**: amount > 0 rejects negative deposits, leaving balance at 100.0.
    + 💡 **Simpler Everyday Picture**: -50 is blocked by the if (amount > 0) guard.
    + 🚀 **Guided Retry Prompt**: Type Balance: 100.0

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-18`)
* **Exam Title**: Day 18 Challenge: Secure Bank Account
* **Problem Statement**: Create SecureAccount with private int balance, getBalance(), and deposit(int amt) that ignores negative amounts.
* **Starter Code (`Solution.java`)**:
```java
class SecureAccount {
    private int balance = 0;
    public int getBalance() { return balance; }
    public void deposit(int amt) {
        if (amt > 0) balance += amt;
    }
}
public class Solution {
    public static int test() {
        SecureAccount a = new SecureAccount();
        a.deposit(200);
        a.deposit(-50);
        return a.getBalance();
    }
}
```
* **Socratic Hint**: private int balance; if (amt > 0) balance += amt;
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        SecureAccount acc = new SecureAccount();
        if (acc.getBalance() != 0) throw new AssertionError("Initial balance must be 0");
        acc.deposit(300);
        if (acc.getBalance() != 300) throw new AssertionError("Deposit 300 must result in 300");
        acc.deposit(-100);
        if (acc.getBalance() != 300) throw new AssertionError("Negative deposit must be rejected and balance remain 300");
        acc.deposit(0);
        if (acc.getBalance() != 300) throw new AssertionError("Zero deposit must leave balance unchanged");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-18`)
* **Assignment Title**: Day 18 Assignment: Student GPA Encapsulation
* **Problem Statement**: Create Student with private double gpa, setGpa(double g), and getGpa().
* **Starter Code (`Solution.java`)**:
```java
class Student {
    private double gpa;
    public void setGpa(double g) { if (g >= 0.0 && g <= 4.0) this.gpa = g; }
    public double getGpa() { return gpa; }
}
public class Solution {
    public static double test() { Student s = new Student(); s.setGpa(3.8); return s.getGpa(); }
}
```
* **Socratic Hint**: private double gpa; public void setGpa(double g) { ... }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.test() != 3.8) throw new AssertionError("GPA must be 3.8");
    }
}
```


################################################################################
# 📅 DAY 19: Inheritance & Subclassing — Reusing Class Hierarchies
################################################################################

**Core Intuitive Metaphor**: Inheritance is like genetic traits passed from Parent to Child: a Dog inherits generic Animal traits (breathing, eating) and adds specific traits (barking).

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-19`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Inheritance? (The Parent-Child Hierarchy) (Block ID: `java-d19-b1-why-inheritance`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Inheritance Concept`
* **Supporting Terms**: Superclass (Parent), Subclass (Child)
* **Prerequisites Required**: `java-d16-b1-blueprint` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Smartphone Family"*
  > A BasicPhone can make phone calls. A SmartPhone inherits makeCall() from BasicPhone and adds browseWeb() and takePhoto(). It does not reinvent calling from scratch.
* **💻 Runnable Interactive Java Code Sandbox** (`InheritanceConcept.java` | Editable: No):
  ```java
  class Phone {
      public void call() { System.out.println("Making phone call..."); }
  }
  class SmartPhone extends Phone {
      public void browse() { System.out.println("Browsing web..."); }
  }
  public class InheritanceConcept {
      public static void main(String[] args) {
          SmartPhone sp = new SmartPhone();
          sp.call();   // Inherited
          sp.browse(); // Added
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Making phone call...
    Browsing web...
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the primary benefit of class inheritance in Java?
* **Selectable Options**:
  - [x] **Option A**: Subclasses automatically inherit fields and methods from parent classes, avoiding code duplication
  - [ ] **Option B**: Subclasses delete the parent class
  - [ ] **Option C**: Inheritance stops programs from using RAM
* **Targeted Misconception ID**: `MC_JAVA_INHERITANCE_CODE_REUSE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_INHERITANCE_CODE_REUSE`
    + 🔍 **What Went Wrong**: Inheritance allows code reuse across class hierarchies.
    + 💡 **Simpler Everyday Picture**: Child classes inherit all parent capabilities.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The `extends` Keyword (Block ID: `java-d19-b2-extends-keyword`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `extends Keyword`
* **Supporting Terms**: Subclassing, Inherited Methods
* **Prerequisites Required**: `java-d19-b1-why-inheritance` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class Animal {
      public void eat() { System.out.println("Eating..."); }
  }
  class Dog extends Animal {
      public void bark() { System.out.println("Woof!"); }
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 4**: class Dog extends Animal establishes Dog as a subclass of Animal. Dog has BOTH eat() and bark().
* **💻 Runnable Interactive Java Code Sandbox** (`AnimalDemo.java` | Editable: No):
  ```java
  class Animal {
      public void eat() { System.out.println("Eating..."); }
  }
  class Dog extends Animal {
      public void bark() { System.out.println("Woof!"); }
  }
  public class AnimalDemo {
      public static void main(String[] args) {
          Dog d = new Dog();
          d.eat();
          d.bark();
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Eating...
    Woof!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Which keyword is used in Java to inherit from a parent class?
* **Selectable Options**:
  - [x] **Option A**: extends
  - [ ] **Option B**: inherits
  - [ ] **Option C**: implements
* **Targeted Misconception ID**: `MC_JAVA_EXTENDS_KEYWORD`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_EXTENDS_KEYWORD`
    + 🔍 **What Went Wrong**: Java uses extends for class inheritance.
    + 💡 **Simpler Everyday Picture**: Class Child extends Parent.
    + 🚀 **Guided Retry Prompt**: Select extends.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: The `super` Keyword (Calling Parent Constructor) (Block ID: `java-d19-b3-super-constructor`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `super() Chaining`
* **Supporting Terms**: Parent Initialization, First Line Rule
* **Prerequisites Required**: `java-d19-b2-extends-keyword` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Building the First Floor Before the Attic"*
  > Before a Child object can initialize its own fields, the Parent foundation must be built first using super(...).
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class Employee extends Person {
      double salary;
      public Employee(String name, double salary) {
          super(name); // Must be first line in constructor!
          this.salary = salary;
      }
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 4**: super(name) calls Person(name) to initialize the inherited name field.
* **💻 Runnable Interactive Java Code Sandbox** (`SuperConstructorDemo.java` | Editable: No):
  ```java
  class Person {
      String name;
      public Person(String name) { this.name = name; }
  }
  class Student extends Person {
      int grade;
      public Student(String name, int grade) {
          super(name); // Call parent constructor
          this.grade = grade;
      }
  }
  public class SuperConstructorDemo {
      public static void main(String[] args) {
          Student s = new Student("Emily", 10);
          System.out.println("Student: " + s.name + ", Grade: " + s.grade);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Student: Emily, Grade: 10
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Where must super(...) be called inside a subclass constructor?
* **Selectable Options**:
  - [x] **Option A**: On the very first line of the subclass constructor body
  - [ ] **Option B**: At the very end of the constructor
  - [ ] **Option C**: Anywhere outside the class
* **Targeted Misconception ID**: `MC_JAVA_CONSTRUCTOR_NAME_MISMATCH`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_CONSTRUCTOR_NAME_MISMATCH`
    + 🔍 **What Went Wrong**: Java requires super() to be the first statement in a constructor.
    + 💡 **Simpler Everyday Picture**: Parent must initialize first on Line 1: super().
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-19`)
* **Exam Title**: Day 19 Challenge: Employee & Manager Hierarchy
* **Problem Statement**: Create Employee with double salary = 50000.0, and Manager extends Employee with double bonus = 10000.0, and getTotalPay() returning salary + bonus.
* **Starter Code (`Solution.java`)**:
```java
class Employee {
    double salary = 50000.0;
}
class Manager extends Employee {
    double bonus = 10000.0;
    double getTotalPay() { return salary + bonus; }
}
public class Solution {
    public static double getPay() {
        return new Manager().getTotalPay();
    }
}
```
* **Socratic Hint**: class Manager extends Employee { double bonus = 10000.0; double getTotalPay() { return salary + bonus; } }
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        Manager m = new Manager();
        if (m.salary != 50000.0) throw new AssertionError("Inherited salary must be 50000.0");
        if (m.bonus != 10000.0) throw new AssertionError("Manager bonus must be 10000.0");
        if (m.getTotalPay() != 60000.0) throw new AssertionError("Total pay must be 60000.0");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-19`)
* **Assignment Title**: Day 19 Assignment: Vehicle and Bike Hierarchy
* **Problem Statement**: Create Vehicle with int wheels = 4, and Bike extends Vehicle with wheels = 2.
* **Starter Code (`Solution.java`)**:
```java
class Vehicle { int wheels = 4; }
class Bike extends Vehicle { Bike() { wheels = 2; } }
public class Solution { public static int getWheels() { return new Bike().wheels; } }
```
* **Socratic Hint**: class Bike extends Vehicle { Bike() { wheels = 2; } }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.getWheels() != 2) throw new AssertionError("Bike wheels must be 2");
    }
}
```


################################################################################
# 📅 DAY 20: Polymorphism & Dynamic Method Dispatch
################################################################################

**Core Intuitive Metaphor**: Polymorphism means "many shapes" (like a universal Play button): whether you press Play on a CD player, DVD player, or Streaming app, they all respond to play() in their own specific way.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-20`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: What is Polymorphism? (Many Shapes) (Block ID: `java-d20-b1-what-is-polymorphism`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Polymorphism Concept`
* **Supporting Terms**: Parent Reference, Child Instance
* **Prerequisites Required**: `java-d19-b2-extends-keyword` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Universal Remote Play Button"*
  > A parent reference Animal a can hold a Dog, a Cat, or a Bird. When you call a.makeSound(), Java dynamically executes the sound of the real animal in memory.
* **💻 Runnable Interactive Java Code Sandbox** (`PolyIntro.java` | Editable: No):
  ```java
  class Speaker {
      public void speak() { System.out.println("Generic sound"); }
  }
  class Radio extends Speaker {
      public void speak() { System.out.println("Playing music stream"); }
  }
  public class PolyIntro {
      public static void main(String[] args) {
          Speaker s = new Radio();
          s.speak();
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Playing music stream
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Can a parent class variable hold a reference to a child subclass object in Java?
* **Selectable Options**:
  - [x] **Option A**: Yes (e.g. Animal a = new Dog(); is completely valid polymorphism)
  - [ ] **Option B**: No, types must always match identically on both sides
  - [ ] **Option C**: Only if the class is static
* **Targeted Misconception ID**: `MC_JAVA_POLYMORPHISM_PARENT_REF`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_POLYMORPHISM_PARENT_REF`
    + 🔍 **What Went Wrong**: Subclasses are substitutable for their superclasses (Liskov principle).
    + 💡 **Simpler Everyday Picture**: A Dog IS AN Animal, so Animal a = new Dog() is valid.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The `@Override` Annotation & Dynamic Dispatch (Block ID: `java-d20-b2-override-annotation`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `@Override Annotation`
* **Supporting Terms**: Dynamic Dispatch, Runtime Polymorphism
* **Prerequisites Required**: `java-d20-b1-what-is-polymorphism` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`PolyDemo.java` | Editable: No):
  ```java
  class Shape {
      public void draw() { System.out.println("Drawing shape"); }
  }
  class Circle extends Shape {
      @Override
      public void draw() { System.out.println("Drawing circle"); }
  }
  public class PolyDemo {
      public static void main(String[] args) {
          Shape s = new Circle();
          s.draw(); // Dynamic dispatch calls Circle.draw()!
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Drawing circle
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In PolyDemo above, what is printed when s.draw() is called on Shape s = new Circle()?
* **Correct Answer**: `Drawing circle` (Variants: Drawing circle, drawing circle)
* **Targeted Misconception ID**: `MC_JAVA_DYNAMIC_METHOD_DISPATCH`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [Drawing shape]** ➔ Diagnosed: `MC_JAVA_DYNAMIC_METHOD_DISPATCH`
    + 🔍 **What Went Wrong**: Java uses runtime dynamic dispatch: it executes the overridden method of the actual object in memory (Circle).
    + 💡 **Simpler Everyday Picture**: The real object is a Circle, so Circle.draw() runs.
    + 🚀 **Guided Retry Prompt**: Type Drawing circle

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Polymorphic Collections (Arrays of Parent Type) (Block ID: `java-d20-b3-polymorphic-collections`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Polymorphic Array Processing`
* **Supporting Terms**: Heterogeneous Collection, Uniform Invocation
* **Prerequisites Required**: `java-d20-b2-override-annotation` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  Shape[] shapes = { new Circle(), new Rectangle() };
  for (Shape s : shapes) {
      s.draw(); // Each shape draws itself uniquely
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: An array of type Shape can hold any subclass of Shape.
* **💻 Runnable Interactive Java Code Sandbox** (`PolyCollectionDemo.java` | Editable: No):
  ```java
  class Animal { public void sound() { System.out.println("Noise"); } }
  class Cat extends Animal { public void sound() { System.out.println("Meow"); } }
  class Dog extends Animal { public void sound() { System.out.println("Woof"); } }
  public class PolyCollectionDemo {
      public static void main(String[] args) {
          Animal[] zoo = { new Cat(), new Dog() };
          for (Animal a : zoo) {
              a.sound();
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Meow
    Woof
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why are polymorphic collections so powerful in enterprise software?
* **Selectable Options**:
  - [x] **Option A**: You can iterate through a list of diverse objects and invoke common methods without needing if-else type checks
  - [ ] **Option B**: They bypass memory bounds
  - [ ] **Option C**: They make all code run on GPU
* **Targeted Misconception ID**: `MC_JAVA_POLYMORPHIC_ARRAY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_POLYMORPHIC_ARRAY`
    + 🔍 **What Went Wrong**: Polymorphism allows uniform processing of heterogeneous object types.
    + 💡 **Simpler Everyday Picture**: Treat all items as their shared parent and let dynamic dispatch do the work.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-20`)
* **Exam Title**: Day 20 Challenge: Polymorphic Payment Fees
* **Problem Statement**: Create Payment with double getFee(), and CardPayment overriding getFee() returning 2.50.
* **Starter Code (`Solution.java`)**:
```java
class Payment {
    double getFee() { return 0.0; }
}
class CardPayment extends Payment {
    @Override
    double getFee() { return 2.50; }
}
public class Solution {
    public static double testFee() {
        Payment p = new CardPayment();
        return p.getFee();
    }
}
```
* **Socratic Hint**: Use @Override double getFee() in CardPayment.
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        Payment base = new Payment();
        if (base.getFee() != 0.0) throw new AssertionError("Base payment fee must be 0.0");
        Payment poly = new CardPayment();
        if (poly.getFee() != 2.50) throw new AssertionError("Polymorphic CardPayment fee must be 2.50");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-20`)
* **Assignment Title**: Day 20 Assignment: Animal Sounds Polymorphism
* **Problem Statement**: Create Animal with speak() returning '...', and Cat overriding speak() returning 'Meow'.
* **Starter Code (`Solution.java`)**:
```java
class Animal { String speak() { return "..."; } }
class Cat extends Animal { @Override String speak() { return "Meow"; } }
public class Solution { public static String test() { Animal a = new Cat(); return a.speak(); } }
```
* **Socratic Hint**: @Override String speak() { return "Meow"; }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.test().equals("Meow")) throw new AssertionError("Cat must speak Meow");
    }
}
```


################################################################################
# 📅 DAY 21: Interfaces & ⭐ MILESTONE 4: Enterprise Payment Gateway Interface
################################################################################

**Core Intuitive Metaphor**: Milestone 4 — Enterprise Payment Gateway Interface: An interface is like a standard 3-prong electrical wall outlet: the outlet guarantees a standard contract (120V power), regardless of whether you plug in a lamp, a toaster, or a laptop.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-21`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: What is an Interface? (The Pure Contract) (Block ID: `java-d21-b1-what-is-interface`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Interface Definition`
* **Supporting Terms**: Contract, Method Signature Only
* **Prerequisites Required**: `java-d20-b1-what-is-polymorphism` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The 3-Prong Wall Outlet"*
  > An interface specifies what methods a class MUST provide, but provides zero implementation code itself. It is 100% contract.
* **📐 Syntax Anatomy Breakdown**:
  ```java
  interface PaymentMethod {
      boolean processPayment(double amount);
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: interface keyword defines the contract.
    + **Line 2**: processPayment has no curly braces {} body—only a signature ending in semicolon ;.
* **💻 Runnable Interactive Java Code Sandbox** (`InterfaceConceptDemo.java` | Editable: No):
  ```java
  interface Printable {
      void print();
  }
  class Document implements Printable {
      public void print() { System.out.println("Printing Document content"); }
  }
  public class InterfaceConceptDemo {
      public static void main(String[] args) {
          Printable p = new Document();
          p.print();
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Printing Document content
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Can you directly instantiate an interface in Java using new PaymentMethod()?
* **Selectable Options**:
  - [x] **Option A**: No, interfaces cannot be instantiated directly because they contain no method bodies
  - [ ] **Option B**: Yes, with default values
  - [ ] **Option C**: Only if you have 1 method
* **Targeted Misconception ID**: `MC_JAVA_INTERFACE_INSTANTIATION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_INTERFACE_INSTANTIATION`
    + 🔍 **What Went Wrong**: Interfaces are abstract contracts that must be implemented by concrete classes.
    + 💡 **Simpler Everyday Picture**: You cannot make an instance of a contract. You instantiate a class that implements it.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The `implements` Keyword (Block ID: `java-d21-b2-implements-keyword`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `implements Keyword`
* **Supporting Terms**: Contract Fulfillment, Concrete Implementation
* **Prerequisites Required**: `java-d21-b1-what-is-interface` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`PaymentDemo.java` | Editable: No):
  ```java
  interface PaymentMethod {
      boolean processPayment(double amount);
  }
  class CreditCard implements PaymentMethod {
      public boolean processPayment(double amount) {
          System.out.println("Processing credit card: $" + amount);
          return true;
      }
  }
  public class PaymentDemo {
      public static void main(String[] args) {
          PaymentMethod pm = new CreditCard();
          pm.processPayment(50.0);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Processing credit card: $50.0
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Which keyword connects a concrete Java class to an interface contract?
* **Selectable Options**:
  - [x] **Option A**: implements
  - [ ] **Option B**: extends
  - [ ] **Option C**: uses
* **Targeted Misconception ID**: `MC_JAVA_INTERFACE_INSTANTIATION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_INTERFACE_INSTANTIATION`
    + 🔍 **What Went Wrong**: Classes implement interfaces using the implements keyword.
    + 💡 **Simpler Everyday Picture**: class Name implements Interface.
    + 🚀 **Guided Retry Prompt**: Select implements.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: ⭐ MILESTONE 4: Enterprise Payment Gateway Interface (Block ID: `java-d21-b3-milestone-4`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Decoupled Architecture`
* **Supporting Terms**: Interface Decoupling, Pluggable Providers
* **Prerequisites Required**: `java-d21-b2-implements-keyword` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Universal Payment Gateway"*
  > Your CheckoutEngine accepts any PaymentMethod. Today you pass CreditCard; tomorrow you pass PayPal without changing a single line of checkout code.
* **💻 Runnable Interactive Java Code Sandbox** (`GatewayDemo.java` | Editable: No):
  ```java
  interface PaymentProcessor {
      boolean pay(double amount);
  }
  class PayPal implements PaymentProcessor {
      public boolean pay(double amount) {
          return amount > 0;
      }
  }
  public class GatewayDemo {
      public static boolean executeCheckout(PaymentProcessor p, double amount) {
          return p.pay(amount);
      }
      public static void main(String[] args) {
          System.out.println("Payment Success: " + executeCheckout(new PayPal(), 75.0));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Payment Success: true
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In GatewayDemo, what is output for executeCheckout(new PayPal(), 75.0)?
* **Correct Answer**: `Payment Success: true` (Variants: Payment Success: true, true)
* **Targeted Misconception ID**: `MC_JAVA_INTERFACE_DECOUPLING`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_INTERFACE_DECOUPLING`
    + 🔍 **What Went Wrong**: 75.0 > 0 is true, so pay returns true.
    + 💡 **Simpler Everyday Picture**: PayPal confirms valid amount > 0.
    + 🚀 **Guided Retry Prompt**: Type Payment Success: true

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-21`)
* **Exam Title**: Day 21 Milestone 4: Payment Gateway Interface
* **Problem Statement**: Create interface PaymentGateway with boolean processPayment(double amount), and class CryptoGateway implementing it.
* **Starter Code (`Solution.java`)**:
```java
interface PaymentGateway {
    boolean processPayment(double amount);
}
class CryptoGateway implements PaymentGateway {
    public boolean processPayment(double amount) {
        return amount > 0;
    }
}
public class Solution {
    public static boolean execute(double amt) {
        PaymentGateway gw = new CryptoGateway();
        return gw.processPayment(amt);
    }
}
```
* **Socratic Hint**: class CryptoGateway implements PaymentGateway { public boolean processPayment(double amount) { return amount > 0; } }
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        PaymentGateway gw = new CryptoGateway();
        if (!gw.processPayment(100.0)) throw new AssertionError("Valid 100.0 payment must return true");
        if (gw.processPayment(0.0)) throw new AssertionError("0.0 payment must return false");
        if (gw.processPayment(-50.0)) throw new AssertionError("Negative payment must return false");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-21`)
* **Assignment Title**: Day 21 Assignment: Printable Interface
* **Problem Statement**: Create interface Printable with String print(), and Document implementing it returning 'Document printed'.
* **Starter Code (`Solution.java`)**:
```java
interface Printable { String print(); }
class Document implements Printable { public String print() { return "Document printed"; } }
public class Solution { public static String test() { Printable p = new Document(); return p.print(); } }
```
* **Socratic Hint**: class Document implements Printable { public String print() { ... } }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (!Solution.test().equals("Document printed")) throw new AssertionError("Must print Document printed");
    }
}
```


################################################################################
# 📅 DAY 22: Static State vs Instance State — Shared Class Memory
################################################################################

**Core Intuitive Metaphor**: Instance variables are like student personal notebooks (each student has their own); static variables are like the shared classroom chalkboard on the front wall (everyone reads and writes to the exact same board).

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-22`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: The Classroom Chalkboard (Static Memory) (Block ID: `java-d22-b1-chalkboard-analogy`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `static Keyword`
* **Supporting Terms**: Class-Level Storage, Shared State
* **Prerequisites Required**: `java-d16-b4-multiple-instances` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Classroom Chalkboard"*
  > If Student A writes on the front chalkboard (static int studentCount), Student B and Student C immediately see the updated count because only ONE chalkboard exists for the entire class.
* **💻 Runnable Interactive Java Code Sandbox** (`CounterDemo.java` | Editable: No):
  ```java
  class Counter {
      static int totalCount = 0;
      int myCount = 0;
      public void increment() {
          totalCount++;
          myCount++;
      }
  }
  public class CounterDemo {
      public static void main(String[] args) {
          Counter c1 = new Counter();
          Counter c2 = new Counter();
          c1.increment();
          c2.increment();
          System.out.println("Total: " + Counter.totalCount + ", c1: " + c1.myCount + ", c2: " + c2.myCount);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Total: 2, c1: 1, c2: 1
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: How many copies of a static variable exist in memory regardless of how many objects are instantiated?
* **Selectable Options**:
  - [x] **Option A**: Exactly ONE shared copy per class
  - [ ] **Option B**: One copy per object instance
  - [ ] **Option C**: Zero copies until main exits
* **Targeted Misconception ID**: `MC_JAVA_STATIC_ON_INSTANCE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_STATIC_ON_INSTANCE`
    + 🔍 **What Went Wrong**: static variables belong to the class itself and exist as a single shared copy.
    + 💡 **Simpler Everyday Picture**: static = 1 shared copy on the classroom wall.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Static Utility Methods (Math.max, Helper Functions) (Block ID: `java-d22-b2-static-methods`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `static Methods`
* **Supporting Terms**: No Instance Needed, Utility Functions
* **Prerequisites Required**: `java-d22-b1-chalkboard-analogy` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class MathUtils {
      public static int square(int n) {
          return n * n;
      }
  }
  // Call directly on Class without new:
  int res = MathUtils.square(5);
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 2**: static methods can be called directly using ClassName.method() without writing new MathUtils().
* **💻 Runnable Interactive Java Code Sandbox** (`StaticUtilsDemo.java` | Editable: No):
  ```java
  class MathHelper {
      public static int cube(int n) { return n * n * n; }
  }
  public class StaticUtilsDemo {
      public static void main(String[] args) {
          System.out.println("Cube of 3: " + MathHelper.cube(3));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Cube of 3: 27
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why can you call Math.abs(-10) without writing Math m = new Math()?
* **Selectable Options**:
  - [x] **Option A**: Because abs() is a static utility method attached directly to the Math class
  - [ ] **Option B**: Because Java creates a hidden instance automatically in the background
  - [ ] **Option C**: Because negative numbers are special
* **Targeted Misconception ID**: `MC_JAVA_STATIC_ON_INSTANCE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_STATIC_ON_INSTANCE`
    + 🔍 **What Went Wrong**: static methods are invoked directly on the class identifier.
    + 💡 **Simpler Everyday Picture**: static methods do not require object instantiation.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: The Non-Static Field in Static Context Trap (Block ID: `java-d22-b3-static-access-rules`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Static Context Rules`
* **Supporting Terms**: Cannot Access this, Static vs Instance Boundary
* **Prerequisites Required**: `java-d22-b2-static-methods` (understood)

**2. Media & Conceptual Scaffolding**:
* **🔍 Broken vs Fixed Visual Diff**:
  - ❌ **Broken Code**: `class App {     int count = 0;     public static void main(String[] args) {         System.out.println(count); // ❌ Error: non-static variable count cannot be referenced from a static context     } }`
  - ✅ **Fixed Code**: `class App {     static int count = 0; // Or create App app = new App();     public static void main(String[] args) {         System.out.println(count); // ✅ Correct!     } }`
  - **Why it Broke**: A static method runs without an object instance, so it does not know which object count to read.
  - **How to Fix**: Make count static, or instantiate an App object to read app.count.
* **💻 Runnable Interactive Java Code Sandbox** (`StaticBoundaryDemo.java` | Editable: No):
  ```java
  class Config {
      static String appVersion = "5.3.0";
      public static void showVersion() {
          System.out.println("Running Version: " + appVersion);
      }
  }
  public class StaticBoundaryDemo {
      public static void main(String[] args) {
          Config.showVersion();
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Running Version: 5.3.0
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why can a static method NOT directly read an instance variable (non-static)?
* **Selectable Options**:
  - [x] **Option A**: Because a static method runs on the class itself and has no specific object instance (this) to read from
  - [ ] **Option B**: Because variables are deleted in static methods
  - [ ] **Option C**: Because static methods only allow Strings
* **Targeted Misconception ID**: `MC_JAVA_STATIC_ON_INSTANCE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_STATIC_ON_INSTANCE`
    + 🔍 **What Went Wrong**: Static context has no this reference to resolve instance fields.
    + 💡 **Simpler Everyday Picture**: No object instance = no instance variables available.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-22`)
* **Exam Title**: Day 22 Challenge: Static Instance Counter
* **Problem Statement**: Create class Counter with static int count = 0, incremented in constructor Counter().
* **Starter Code (`Solution.java`)**:
```java
class Counter {
    static int count = 0;
    Counter() { count++; }
}
public class Solution {
    public static int testCount() {
        Counter.count = 0;
        new Counter();
        new Counter();
        new Counter();
        return Counter.count;
    }
}
```
* **Socratic Hint**: static int count = 0; Counter() { count++; }
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        Counter.count = 0;
        if (Counter.count != 0) throw new AssertionError("Initial static count must be 0");
        new Counter();
        new Counter();
        if (Counter.count != 2) throw new AssertionError("Creating 2 objects must result in count 2");
        new Counter();
        if (Counter.count != 3) throw new AssertionError("Creating 3rd object must result in count 3");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-22`)
* **Assignment Title**: Day 22 Assignment: Static Math Utility
* **Problem Statement**: Create MathUtil with static int square(int n) returning n * n.
* **Starter Code (`Solution.java`)**:
```java
class MathUtil { public static int square(int n) { return n * n; } }
public class Solution { public static int test() { return MathUtil.square(6); } }
```
* **Socratic Hint**: public static int square(int n) { return n * n; }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (MathUtil.square(6) != 36) throw new AssertionError("6 squared must be 36");
        if (MathUtil.square(-4) != 16) throw new AssertionError("-4 squared must be 16");
    }
}
```


################################################################################
# 📅 DAY 23: Exception Handling — Defensive Programming with try-catch-finally
################################################################################

**Core Intuitive Metaphor**: A try-catch block is like a trapeze safety net: the gymnast attempts a risky stunt in the try block; if they slip and fall (exception), the catch net catches them safely so the circus show does not crash to a halt.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-23`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Programs Crash (Runtime Exceptions) (Block ID: `java-d23-b1-why-exceptions`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Runtime Exceptions`
* **Supporting Terms**: Abrupt Termination, Crash Prevention
* **Prerequisites Required**: `java-d4-b2-mult-div` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Trapeze Safety Net"*
  > When code divides by zero (10 / 0) or accesses an invalid array index (arr[99]), Java throws an Exception. Without a safety net, the whole application crashes.
* **💻 Runnable Interactive Java Code Sandbox** (`CrashDemo.java` | Editable: No):
  ```java
  public class CrashDemo {
      public static void main(String[] args) {
          System.out.println("Handling crash safely with try-catch:");
          try {
              int val = 10 / 0;
          } catch (ArithmeticException e) {
              System.out.println("Crash intercepted: " + e.getClass().getSimpleName());
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Handling crash safely with try-catch:
    Crash intercepted: ArithmeticException
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What happens when an unhandled ArithmeticException occurs during program execution?
* **Selectable Options**:
  - [x] **Option A**: The JVM immediately halts program execution and prints a stack trace crash report
  - [ ] **Option B**: The program ignores the error and prints 0
  - [ ] **Option C**: The computer restarts
* **Targeted Misconception ID**: `MC_JAVA_DIVIDE_BY_ZERO`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_DIVIDE_BY_ZERO`
    + 🔍 **What Went Wrong**: Unhandled exceptions terminate program execution abruptly.
    + 💡 **Simpler Everyday Picture**: Unhandled exception = instant crash.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The try-catch Block (Catching Errors) (Block ID: `java-d23-b2-try-catch-syntax`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `try-catch Syntax`
* **Supporting Terms**: Risky Code, Catch Block
* **Prerequisites Required**: `java-d23-b1-why-exceptions` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  try {
      int result = 10 / 0; // Risky code
  } catch (ArithmeticException e) {
      System.out.println("Caught division by zero!");
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: try { } encloses the code that might fail.
    + **Line 3**: catch (ArithmeticException e) intercept the crash and runs recovery logic.
* **💻 Runnable Interactive Java Code Sandbox** (`SafeDivide.java` | Editable: No):
  ```java
  public class SafeDivide {
      public static int divide(int a, int b) {
          try {
              return a / b;
          } catch (ArithmeticException e) {
              return -1; // Fallback error code
          }
      }
      public static void main(String[] args) {
          System.out.println("Result: " + divide(10, 0));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Result: -1
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What does divide(10, 0) return in SafeDivide above?
* **Selectable Options**:
  - [x] **Option A**: -1 (The catch block caught ArithmeticException and returned -1)
  - [ ] **Option B**: 0
  - [ ] **Option C**: Crashes with an error
* **Targeted Misconception ID**: `MC_JAVA_DIVIDE_BY_ZERO`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_DIVIDE_BY_ZERO`
    + 🔍 **What Went Wrong**: 10 / 0 triggers ArithmeticException, which is caught and returns -1.
    + 💡 **Simpler Everyday Picture**: The catch block safely handles the crash and returns -1.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: The `finally` Block (Guaranteed Cleanup) (Block ID: `java-d23-b3-finally-block`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `finally Block`
* **Supporting Terms**: Guaranteed Execution, Resource Cleanup
* **Prerequisites Required**: `java-d23-b2-try-catch-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Locking the Door When Leaving"*
  > Whether your trip outside went smoothly or you got rained on, you ALWAYS lock the front door when you leave. The finally block ALWAYS runs, even if errors occurred.
* **💻 Runnable Interactive Java Code Sandbox** (`FinallyDemo.java` | Editable: No):
  ```java
  public class FinallyDemo {
      public static void main(String[] args) {
          try {
              int x = 5 / 1;
          } catch (Exception e) {
              System.out.println("Error");
          } finally {
              System.out.println("Always executed!");
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Always executed!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Under what circumstances does code in a finally block execute?
* **Selectable Options**:
  - [x] **Option A**: ALWAYS, regardless of whether an exception was thrown, caught, or not thrown at all
  - [ ] **Option B**: Only when an error occurs
  - [ ] **Option C**: Only when no errors occur
* **Targeted Misconception ID**: `MC_JAVA_FINALLY_GUARANTEED_RUN`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_FINALLY_GUARANTEED_RUN`
    + 🔍 **What Went Wrong**: finally blocks are guaranteed to execute in all control flow paths.
    + 💡 **Simpler Everyday Picture**: finally = ALWAYS runs.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-23`)
* **Exam Title**: Day 23 Challenge: Safe Division Parser
* **Problem Statement**: Write safeDivide(int a, int b) returning a / b, or returning -1 if ArithmeticException occurs.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int safeDivide(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException e) {
            return -1;
        }
    }
}
```
* **Socratic Hint**: try { return a / b; } catch (ArithmeticException e) { return -1; }
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        if (Solution.safeDivide(20, 4) != 5) throw new AssertionError("20 / 4 must be 5");
        if (Solution.safeDivide(10, 0) != -1) throw new AssertionError("10 / 0 must return -1 on catch");
        if (Solution.safeDivide(0, 5) != 0) throw new AssertionError("0 / 5 must be 0");
        if (Solution.safeDivide(-15, 3) != -5) throw new AssertionError("-15 / 3 must be -5");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-23`)
* **Assignment Title**: Day 23 Assignment: Array Index Safe Reader
* **Problem Statement**: Write safeGet(int[] arr, int index) returning arr[index] or -1 if ArrayIndexOutOfBoundsException.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int safeGet(int[] arr, int i) {
        try { return arr[i]; } catch (ArrayIndexOutOfBoundsException e) { return -1; }
    }
}
```
* **Socratic Hint**: try { return arr[i]; } catch (ArrayIndexOutOfBoundsException e) { return -1; }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        int[] arr = { 10, 20 };
        if (Solution.safeGet(arr, 0) != 10) throw new AssertionError("Index 0 must be 10");
        if (Solution.safeGet(arr, 99) != -1) throw new AssertionError("Index 99 out of bounds must return -1");
    }
}
```


################################################################################
# 📅 DAY 24: Throwing Exceptions & Defensive Programming
################################################################################

**Core Intuitive Metaphor**: The throw keyword is like a soccer referee whistle: when a player commits an illegal foul (e.g. passing a negative deposit amount), the referee blows the whistle (throw new IllegalArgumentException()) to halt play immediately.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-24`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Throw Exceptions? (The Referee Whistle) (Block ID: `java-d24-b1-why-throw`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `throw Keyword`
* **Supporting Terms**: Validation Guard, Active Enforcement
* **Prerequisites Required**: `java-d23-b2-try-catch-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Referee Whistle"*
  > Instead of quietly corrupting data with a negative price (price = -50), your code blows the whistle with throw new IllegalArgumentException("Price cannot be negative") to stop the violation immediately.
* **💻 Runnable Interactive Java Code Sandbox** (`ThrowWhistleDemo.java` | Editable: No):
  ```java
  public class ThrowWhistleDemo {
      public static void checkPositive(int n) {
          if (n <= 0) throw new IllegalArgumentException("Number must be positive!");
      }
      public static void main(String[] args) {
          try {
              checkPositive(-10);
          } catch (IllegalArgumentException e) {
              System.out.println("Referee whistle blown: " + e.getMessage());
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Referee whistle blown: Number must be positive!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why should a method throw an IllegalArgumentException when receiving invalid input?
* **Selectable Options**:
  - [x] **Option A**: To explicitly halt invalid operations and notify the caller of a rule violation
  - [ ] **Option B**: To automatically fix the number
  - [ ] **Option C**: To speed up calculations
* **Targeted Misconception ID**: `MC_JAVA_THROW_PURPOSE_HALT`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_THROW_PURPOSE_HALT`
    + 🔍 **What Went Wrong**: Throwing exceptions prevents corrupt state by signaling contract violations.
    + 💡 **Simpler Everyday Picture**: Blow the whistle to stop illegal data from being saved.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The `throw` Syntax with Custom Messages (Block ID: `java-d24-b2-throw-syntax`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `throw new Exception`
* **Supporting Terms**: Error Message, Instant Halt
* **Prerequisites Required**: `java-d24-b1-why-throw` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  if (amount <= 0) {
      throw new IllegalArgumentException("Amount must be positive");
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 2**: throw new IllegalArgumentException(...) constructs and throws an exception object.
* **💻 Runnable Interactive Java Code Sandbox** (`ValidatorDemo.java` | Editable: No):
  ```java
  public class ValidatorDemo {
      public static void validateAge(int age) {
          if (age < 0) {
              throw new IllegalArgumentException("Age cannot be negative");
          }
      }
      public static void main(String[] args) {
          try {
              validateAge(-5);
          } catch (IllegalArgumentException e) {
              System.out.println("Caught: " + e.getMessage());
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Caught: Age cannot be negative
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In ValidatorDemo above, what is printed by e.getMessage()?
* **Correct Answer**: `Caught: Age cannot be negative` (Variants: Caught: Age cannot be negative, Age cannot be negative)
* **Targeted Misconception ID**: `MC_JAVA_THROW_EXCEPTION_CONSTRUCTOR`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_THROW_EXCEPTION_CONSTRUCTOR`
    + 🔍 **What Went Wrong**: e.getMessage() returns the string passed to the exception constructor: "Age cannot be negative".
    + 💡 **Simpler Everyday Picture**: Returns the exact error message.
    + 🚀 **Guided Retry Prompt**: Type Caught: Age cannot be negative

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Defensive Guard Clauses in Enterprise Methods (Block ID: `java-d24-b3-defensive-guards`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Guard Clauses`
* **Supporting Terms**: Early Exit, Input Sanitization
* **Prerequisites Required**: `java-d24-b2-throw-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **⚡ Logic Execution Flowchart**:
  - Step 1 [START]: 1. Method called: deposit(amount)
  - Step 2 [DECISION]: 2. Guard Check: amount <= 0?
  - Step 3 [PROCESS]: 3. True: throw IllegalArgumentException
  - Step 4 [END]: 4. False: balance += amount (Success)
* **💻 Runnable Interactive Java Code Sandbox** (`GuardClauseDemo.java` | Editable: No):
  ```java
  public class GuardClauseDemo {
      public static int transfer(int balance, int amount) {
          if (amount <= 0) throw new IllegalArgumentException("Transfer must be > 0");
          if (amount > balance) throw new IllegalArgumentException("Insufficient funds");
          return balance - amount;
      }
      public static void main(String[] args) {
          System.out.println("Remaining: $" + transfer(100, 40));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Remaining: $60
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Where should defensive guard clauses be placed inside a method?
* **Selectable Options**:
  - [x] **Option A**: At the very beginning of the method before any business calculations run
  - [ ] **Option B**: At the very end of the method after changes are already saved
  - [ ] **Option C**: Outside the class
* **Targeted Misconception ID**: `MC_JAVA_GUARD_CLAUSE_ORDER`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_GUARD_CLAUSE_ORDER`
    + 🔍 **What Went Wrong**: Guard clauses protect the method by validating inputs on Line 1.
    + 💡 **Simpler Everyday Picture**: Check inputs at the door before doing any work.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-24`)
* **Exam Title**: Day 24 Challenge: Validate Deposit Amount
* **Problem Statement**: Write validateDeposit(int amt) throwing IllegalArgumentException if amt <= 0.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static void validateDeposit(int amt) {
        if (amt <= 0) throw new IllegalArgumentException("Deposit must be positive");
    }
}
```
* **Socratic Hint**: if (amt <= 0) throw new IllegalArgumentException("Deposit must be positive");
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        // Test valid deposit does not throw
        try {
            Solution.validateDeposit(100);
        } catch (IllegalArgumentException e) {
            throw new AssertionError("Valid deposit 100 must not throw");
        }
        // Test negative deposit throws
        boolean caughtNegative = false;
        try {
            Solution.validateDeposit(-50);
        } catch (IllegalArgumentException e) {
            caughtNegative = true;
        }
        if (!caughtNegative) throw new AssertionError("Negative deposit must throw IllegalArgumentException");
        // Test 0 deposit throws
        boolean caughtZero = false;
        try {
            Solution.validateDeposit(0);
        } catch (IllegalArgumentException e) {
            caughtZero = true;
        }
        if (!caughtZero) throw new AssertionError("Zero deposit must throw IllegalArgumentException");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-24`)
* **Assignment Title**: Day 24 Assignment: Age Validator
* **Problem Statement**: Write checkAge(int age) throwing IllegalArgumentException if age < 18.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static void checkAge(int age) {
        if (age < 18) throw new IllegalArgumentException("Underage");
    }
}
```
* **Socratic Hint**: if (age < 18) throw new IllegalArgumentException("Underage");
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        boolean caught = false;
        try { Solution.checkAge(15); } catch (IllegalArgumentException e) { caught = true; }
        if (!caught) throw new AssertionError("Age 15 must throw");
    }
}
```


################################################################################
# 📅 DAY 25: Dynamic Collections — ArrayList<T> & Resizable Arrays
################################################################################

**Core Intuitive Metaphor**: An ArrayList is like an expanding accordion folder: standard Java arrays have a fixed size that can never change; an ArrayList automatically expands whenever you add new items and shrinks when you remove them.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-25`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why ArrayList? (The Expanding Accordion) (Block ID: `java-d25-b1-arraylist-concept`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `ArrayList Dynamic Resizing`
* **Supporting Terms**: Dynamic Capacity, Auto-Growing
* **Prerequisites Required**: `java-d12-b1-why-arrays` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Accordion Folder"*
  > If you create int[] arr = new int[3], it can only hold 3 numbers forever. ArrayList<Integer> list = new ArrayList<>(); can hold 3 numbers, 300 numbers, or 3,000 numbers dynamically.
* **💻 Runnable Interactive Java Code Sandbox** (`AccordionListDemo.java` | Editable: No):
  ```java
  
  
  public class AccordionListDemo {
      public static void main(String[] args) {
          ArrayList<Integer> list = new ArrayList<>();
          list.add(10);
          list.add(20);
          list.add(30);
          System.out.println("List auto-expanded to size: " + list.size());
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    List auto-expanded to size: 3
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the main advantage of ArrayList over a standard Java array?
* **Selectable Options**:
  - [x] **Option A**: ArrayList automatically resizes dynamically as elements are added or removed
  - [ ] **Option B**: ArrayList cannot store numbers
  - [ ] **Option C**: ArrayList does not use memory
* **Targeted Misconception ID**: `MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS`
    + 🔍 **What Went Wrong**: ArrayLists provide dynamic resizing unlike fixed-length arrays.
    + 💡 **Simpler Everyday Picture**: ArrayList grows and shrinks automatically.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: ArrayList CRUD: add(), get(), and size() (Block ID: `java-d25-b2-crud-operations`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `ArrayList Methods`
* **Supporting Terms**: add(), get(i), size()
* **Prerequisites Required**: `java-d25-b1-arraylist-concept` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  
  
  ArrayList<String> list = new ArrayList<>();
  list.add("Apple"); // Append item
  String item = list.get(0); // Read index 0
  int count = list.size(); // Total count
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 4**: list.get(0) reads index 0 (NOT list[0]).
    + **Line 5**: list.size() returns element count (NOT list.length).
* **💻 Runnable Interactive Java Code Sandbox** (`ListDemo.java` | Editable: No):
  ```java
  
  
  public class ListDemo {
      public static void main(String[] args) {
          ArrayList<String> fruits = new ArrayList<>();
          fruits.add("Apple");
          fruits.add("Banana");
          System.out.println("First fruit: " + fruits.get(0));
          System.out.println("Total: " + fruits.size());
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    First fruit: Apple
    Total: 2
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: How do you read the item at index 0 in an ArrayList named list?
* **Selectable Options**:
  - [x] **Option A**: list.get(0)
  - [ ] **Option B**: list[0]
  - [ ] **Option C**: list.first()
* **Targeted Misconception ID**: `MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS`
    + 🔍 **What Went Wrong**: In Java ArrayLists, use the .get(index) method, not square brackets [].
    + 💡 **Simpler Everyday Picture**: Use list.get(0) for ArrayLists.
    + 🚀 **Guided Retry Prompt**: Select list.get(0).

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Removing & Modifying Elements (Index Shifting) (Block ID: `java-d25-b3-modifying-removing`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `ArrayList remove & shift`
* **Supporting Terms**: Index Shifting, remove(index)
* **Prerequisites Required**: `java-d25-b2-crud-operations` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Line at the Bank Teller"*
  > When person 0 finishes and leaves the line (list.remove(0)), everyone behind them steps forward one step. Person 1 is now Person 0!
* **💻 Runnable Interactive Java Code Sandbox** (`RemoveDemo.java` | Editable: No):
  ```java
  
  
  public class RemoveDemo {
      public static void main(String[] args) {
          ArrayList<String> queue = new ArrayList<>();
          queue.add("Alice");
          queue.add("Bob");
          queue.remove(0); // Alice leaves
          System.out.println("New first in line: " + queue.get(0));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    New first in line: Bob
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In RemoveDemo above, who is at index 0 after removing index 0?
* **Correct Answer**: `New first in line: Bob` (Variants: New first in line: Bob, Bob)
* **Targeted Misconception ID**: `MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [Alice]** ➔ Diagnosed: `MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS`
    + 🔍 **What Went Wrong**: Alice was removed; Bob shifted to index 0.
    + 💡 **Simpler Everyday Picture**: Bob steps into index 0.
    + 🚀 **Guided Retry Prompt**: Type New first in line: Bob

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-25`)
* **Exam Title**: Day 25 Challenge: Filter High Scores
* **Problem Statement**: Write filterAbove(int[] scores, int cutoff) in Solution returning an ArrayList<Integer> of all scores > cutoff.
* **Starter Code (`Solution.java`)**:
```java


public class Solution {
    public static ArrayList<Integer> filterAbove(int[] scores, int cutoff) {
        ArrayList<Integer> list = new ArrayList<>();
        for (int s : scores) {
            if (s > cutoff) list.add(s);
        }
        return list;
    }
}
```
* **Socratic Hint**: ArrayList<Integer> list = new ArrayList<>(); for (int s : scores) if (s > cutoff) list.add(s); return list;
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        int[] scores = { 45, 90, 78, 95, 60 };
        ArrayList<Integer> res = Solution.filterAbove(scores, 75);
        if (res.size() != 3) throw new AssertionError("Must find 3 scores above 75 (90, 78, 95)");
        if (!res.contains(90) || !res.contains(78) || !res.contains(95)) throw new AssertionError("Must contain 90, 78, 95");
        ArrayList<Integer> emptyRes = Solution.filterAbove(scores, 100);
        if (!emptyRes.isEmpty()) throw new AssertionError("Scores above 100 must be empty");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-25`)
* **Assignment Title**: Day 25 Assignment: Add and Get List Elements
* **Problem Statement**: Write createList(String a, String b) returning ArrayList<String> containing a and b.
* **Starter Code (`Solution.java`)**:
```java

public class Solution {
    public static ArrayList<String> createList(String a, String b) {
        ArrayList<String> l = new ArrayList<>(); l.add(a); l.add(b); return l;
    }
}
```
* **Socratic Hint**: list.add(a); list.add(b);
* **Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        ArrayList<String> l = Solution.createList("Apple", "Banana");
        if (l.size() != 2 || !l.get(0).equals("Apple")) throw new AssertionError("List must contain Apple, Banana");
    }
}
```


################################################################################
# 📅 DAY 26: HashMaps & ⭐ MILESTONE 5: Word Frequency & Inventory Engine
################################################################################

**Core Intuitive Metaphor**: Milestone 5 — Word Frequency & Inventory Engine: A HashMap is like a Coat Check Room: you hand the attendant your ticket number (Key), and they instantly hand you back your exact winter coat (Value) in O(1) time without searching coat by coat.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-26`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Key-Value? (The Coat Check Ticket) (Block ID: `java-d26-b1-hashmap-concept`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `HashMap Key-Value Pairing`
* **Supporting Terms**: Key (Unique), Value (Data), O(1) Lookup
* **Prerequisites Required**: `java-d25-b1-arraylist-concept` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Coat Check Ticket"*
  > Instead of searching through an entire array of names one by one, a HashMap matches a unique Key (e.g. Student ID) directly to a Value (e.g. Grade) in instant O(1) time.
* **💻 Runnable Interactive Java Code Sandbox** (`CoatCheckDemo.java` | Editable: No):
  ```java
  
  
  public class CoatCheckDemo {
      public static void main(String[] args) {
          HashMap<Integer, String> coatCheck = new HashMap<>();
          coatCheck.put(101, "Black Leather Jacket");
          System.out.println("Ticket 101 retrieves: " + coatCheck.get(101));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Ticket 101 retrieves: Black Leather Jacket
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the primary relationship in a Java HashMap<K, V>?
* **Selectable Options**:
  - [x] **Option A**: Each unique Key maps directly to an associated Value
  - [ ] **Option B**: All items are stored in numerical index order only
  - [ ] **Option C**: Keys and values must always be integers
* **Targeted Misconception ID**: `MC_JAVA_HASHMAP_NULL_KEY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_HASHMAP_NULL_KEY`
    + 🔍 **What Went Wrong**: HashMaps store key-value associations where keys are unique identifiers.
    + 💡 **Simpler Everyday Picture**: Unique Key -> Associated Value.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: HashMap Operations: put(), get(), and containsKey() (Block ID: `java-d26-b2-put-get-operations`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `HashMap Methods`
* **Supporting Terms**: put(k,v), get(k), containsKey(k)
* **Prerequisites Required**: `java-d26-b1-hashmap-concept` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  
  
  HashMap<String, Integer> map = new HashMap<>();
  map.put("Alice", 95); // Insert pair
  int score = map.get("Alice"); // Retrieve 95
  boolean hasBob = map.containsKey("Bob"); // false
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 4**: map.put(key, value) saves the association.
    + **Line 5**: map.get(key) retrieves the value for that key.
* **💻 Runnable Interactive Java Code Sandbox** (`GradeMap.java` | Editable: No):
  ```java
  
  
  public class GradeMap {
      public static void main(String[] args) {
          HashMap<String, Integer> grades = new HashMap<>();
          grades.put("Alice", 95);
          grades.put("Bob", 88);
          System.out.println("Alice score: " + grades.get("Alice"));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Alice score: 95
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In GradeMap above, what is output for grades.get("Alice")?
* **Correct Answer**: `Alice score: 95` (Variants: Alice score: 95, 95)
* **Targeted Misconception ID**: `MC_JAVA_HASHMAP_NULL_KEY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_HASHMAP_NULL_KEY`
    + 🔍 **What Went Wrong**: grades.get("Alice") returns the mapped value 95.
    + 💡 **Simpler Everyday Picture**: Alice is associated with 95.
    + 🚀 **Guided Retry Prompt**: Type Alice score: 95

--------------------------------------------------------------------------------
#### 🔹 Slide 3: ⭐ MILESTONE 5: Word Frequency Counter (Block ID: `java-d26-b3-milestone-5`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Frequency Counting with getOrDefault`
* **Supporting Terms**: map.getOrDefault, Tallying Pattern
* **Prerequisites Required**: `java-d26-b2-put-get-operations` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`WordCounter.java` | Editable: No):
  ```java
  
  
  public class WordCounter {
      public static void main(String[] args) {
          String[] words = { "java", "code", "java", "cool" };
          HashMap<String, Integer> counts = new HashMap<>();
          for (String w : words) {
              counts.put(w, counts.getOrDefault(w, 0) + 1);
          }
          System.out.println("Java count: " + counts.get("java"));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Java count: 2
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In WordCounter above, how many times does "java" appear in {"java", "code", "java", "cool"}?
* **Correct Answer**: `Java count: 2` (Variants: Java count: 2, 2)
* **Targeted Misconception ID**: `MC_JAVA_HASHMAP_NULL_KEY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_HASHMAP_NULL_KEY`
    + 🔍 **What Went Wrong**: "java" appears twice.
    + 💡 **Simpler Everyday Picture**: Count: "java" (1), "java" (2). Total is 2.
    + 🚀 **Guided Retry Prompt**: Type Java count: 2

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-26`)
* **Exam Title**: Day 26 Milestone 5: Word Frequency Engine
* **Problem Statement**: Write countFrequency(String[] words) returning a HashMap<String, Integer> counting occurrences of each word in Solution.
* **Starter Code (`Solution.java`)**:
```java


public class Solution {
    public static HashMap<String, Integer> countFrequency(String[] words) {
        HashMap<String, Integer> map = new HashMap<>();
        for (String w : words) {
            map.put(w, map.getOrDefault(w, 0) + 1);
        }
        return map;
    }
}
```
* **Socratic Hint**: map.put(w, map.getOrDefault(w, 0) + 1);
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        String[] words = { "java", "code", "java", "test", "java", "code" };
        HashMap<String, Integer> map = Solution.countFrequency(words);
        if (map.get("java") != 3) throw new AssertionError("'java' must occur 3 times");
        if (map.get("code") != 2) throw new AssertionError("'code' must occur 2 times");
        if (map.get("test") != 1) throw new AssertionError("'test' must occur 1 time");
        if (map.containsKey("missing")) throw new AssertionError("Missing word must not be in map");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-26`)
* **Assignment Title**: Day 26 Assignment: Stock Lookup Map
* **Problem Statement**: Write getStock(HashMap<String, Integer> map, String item) returning map.getOrDefault(item, 0).
* **Starter Code (`Solution.java`)**:
```java

public class Solution {
    public static int getStock(HashMap<String, Integer> map, String item) {
        return map.getOrDefault(item, 0);
    }
}
```
* **Socratic Hint**: return map.getOrDefault(item, 0);
* **Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        HashMap<String, Integer> m = new HashMap<>();
        m.put("Apples", 50);
        if (Solution.getStock(m, "Apples") != 50) throw new AssertionError("Apples must be 50");
        if (Solution.getStock(m, "Oranges") != 0) throw new AssertionError("Missing Oranges must return 0");
    }
}
```


################################################################################
# 📅 DAY 27: Java Generics — Compile-Time Type Safety (<T>)
################################################################################

**Core Intuitive Metaphor**: Generics are like transparent shipping crates with custom molded inserts: a crate molded for Bicycles (<Bicycle>) guarantees at compile-time that no one can accidentally pack a Microwave inside it.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-27`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Generics? (The Transparent Shipping Crate) (Block ID: `java-d27-b1-why-generics`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Generics Type Safety`
* **Supporting Terms**: Type Parameter <T>, Compile-Time Check
* **Prerequisites Required**: `java-d25-b1-arraylist-concept` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Labeled Shipping Crate"*
  > Without generics, a Box could hold any random Object, requiring dangerous type casts (String) box.get() that crash at runtime. Generics Box<T> enforce compile-time safety.
* **💻 Runnable Interactive Java Code Sandbox** (`GenericsIntroDemo.java` | Editable: No):
  ```java
  class Storage<T> {
      T data;
      public void save(T d) { this.data = d; }
      public T load() { return data; }
  }
  public class GenericsIntroDemo {
      public static void main(String[] args) {
          Storage<String> s = new Storage<>();
          s.save("Verified Safe");
          System.out.println("Loaded: " + s.load());
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Loaded: Verified Safe
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is the primary benefit of using Generics (<T>) in Java?
* **Selectable Options**:
  - [x] **Option A**: Catching type mismatch errors at compile-time instead of crashing at runtime with ClassCastException
  - [ ] **Option B**: Making variables global
  - [ ] **Option C**: Allowing Java code to bypass memory boundaries
* **Targeted Misconception ID**: `MC_JAVA_GENERICS_TYPE_SAFETY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_GENERICS_TYPE_SAFETY`
    + 🔍 **What Went Wrong**: Generics provide strong compile-time type validation.
    + 💡 **Simpler Everyday Picture**: Generics catch bugs before your code even runs.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Creating a Generic Class (`Box<T>`) (Block ID: `java-d27-b2-generic-class-box`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Generic Class Definition`
* **Supporting Terms**: Placeholder T, Parametric Type
* **Prerequisites Required**: `java-d27-b1-why-generics` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class Box<T> {
      private T item;
      public void set(T item) { this.item = item; }
      public T get() { return item; }
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 1**: Box<T> declares T as a generic placeholder type that will be replaced when instantiated (e.g. Box<String>).
* **💻 Runnable Interactive Java Code Sandbox** (`GenericBoxDemo.java` | Editable: No):
  ```java
  class Box<T> {
      private T item;
      public void set(T item) { this.item = item; }
      public T get() { return item; }
  }
  public class GenericBoxDemo {
      public static void main(String[] args) {
          Box<String> strBox = new Box<>();
          strBox.set("Hello Generics!");
          System.out.println("Box contents: " + strBox.get());
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Box contents: Hello Generics!
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In GenericBoxDemo, what is output by strBox.get()?
* **Correct Answer**: `Box contents: Hello Generics!` (Variants: Box contents: Hello Generics!, Hello Generics!)
* **Targeted Misconception ID**: `MC_JAVA_GENERIC_CLASS_TYPE_PARAM`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_GENERIC_CLASS_TYPE_PARAM`
    + 🔍 **What Went Wrong**: strBox.get() returns the string "Hello Generics!".
    + 💡 **Simpler Everyday Picture**: Box holds "Hello Generics!".
    + 🚀 **Guided Retry Prompt**: Type Box contents: Hello Generics!

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Multi-Type Generics (`Pair<K, V>`) (Block ID: `java-d27-b3-generic-pair`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Multi-Parameter Generics`
* **Supporting Terms**: Pair<K,V>, Two Type Variables
* **Prerequisites Required**: `java-d27-b2-generic-class-box` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`PairDemo.java` | Editable: No):
  ```java
  class Pair<K, V> {
      K key;
      V value;
      public Pair(K k, V v) { this.key = k; this.value = v; }
  }
  public class PairDemo {
      public static void main(String[] args) {
          Pair<String, Integer> p = new Pair<>("Age", 25);
          System.out.println(p.key + ": " + p.value);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Age: 25
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Can a generic class accept multiple type parameters like Pair<K, V>?
* **Selectable Options**:
  - [x] **Option A**: Yes, classes can specify multiple comma-separated type parameters like <K, V>
  - [ ] **Option B**: No, Java only supports 1 generic type per class
  - [ ] **Option C**: Only if both types are identical
* **Targeted Misconception ID**: `MC_JAVA_GENERIC_MULTI_TYPE_PARAMS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_GENERIC_MULTI_TYPE_PARAMS`
    + 🔍 **What Went Wrong**: Java supports multiple generic type parameters separated by commas.
    + 💡 **Simpler Everyday Picture**: Pair<K, V> accepts two distinct types.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-27`)
* **Exam Title**: Day 27 Challenge: Generic Pair Container
* **Problem Statement**: Create generic class Pair<K, V> with constructor Pair(K key, V val), getKey(), and getVal().
* **Starter Code (`Solution.java`)**:
```java
class Pair<K, V> {
    private K key;
    private V val;
    public Pair(K key, V val) { this.key = key; this.val = val; }
    public K getKey() { return key; }
    public V getVal() { return val; }
}
public class Solution {
    public static String testPair() {
        Pair<String, Integer> p = new Pair<>("Age", 22);
        return p.getKey() + ": " + p.getVal();
    }
}
```
* **Socratic Hint**: class Pair<K, V> { private K key; private V val; public Pair(K key, V val) { ... } }
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        Pair<String, Integer> p1 = new Pair<>("Score", 95);
        if (!p1.getKey().equals("Score") || p1.getVal() != 95) throw new AssertionError("Pair String-Integer failed");
        Pair<Integer, Double> p2 = new Pair<>(101, 19.99);
        if (p2.getKey() != 101 || p2.getVal() != 19.99) throw new AssertionError("Pair Integer-Double failed");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-27`)
* **Assignment Title**: Day 27 Assignment: Generic Box
* **Problem Statement**: Create generic Box<T> with set(T item) and get().
* **Starter Code (`Solution.java`)**:
```java
class Box<T> { private T item; public void set(T item) { this.item = item; } public T get() { return item; } }
public class Solution { public static String test() { Box<String> b = new Box<>(); b.set("Present"); return b.get(); } }
```
* **Socratic Hint**: class Box<T> { private T item; public void set(T item) { this.item = item; } public T get() { return item; } }
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        Box<String> b = new Box<>();
        b.set("Present");
        if (!b.get().equals("Present")) throw new AssertionError("Box must return Present");
    }
}
```


################################################################################
# 📅 DAY 28: Multithreading & Concurrency — Parallel Execution
################################################################################

**Core Intuitive Metaphor**: Concurrency is like having two chefs in a restaurant kitchen: Chef 1 cooks the soup on Stove A while Chef 2 bakes the bread in Oven B at the exact same time. Parallel work gets the meal finished twice as fast!

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-28`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Why Threads? (Two Chefs in the Kitchen) (Block ID: `java-d28-b1-why-threads`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Parallel Threads`
* **Supporting Terms**: Concurrent Workers, Background Tasks
* **Prerequisites Required**: `java-d21-b1-what-is-interface` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Two Chefs in the Kitchen"*
  > Without threads, your app freezes while downloading a large file. With threads, a background worker downloads the file while the main thread keeps the UI smooth and responsive.
* **💻 Runnable Interactive Java Code Sandbox** (`ParallelChefsDemo.java` | Editable: No):
  ```java
  public class ParallelChefsDemo {
      public static void main(String[] args) {
          Thread chef1 = new Thread(() -> System.out.println("Chef 1: Soup simmering"));
          Thread chef2 = new Thread(() -> System.out.println("Chef 2: Bread baking"));
          chef1.start();
          chef2.start();
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Chef 1: Soup simmering
    Chef 2: Bread baking
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why do software applications use multithreading?
* **Selectable Options**:
  - [x] **Option A**: To perform long-running background tasks in parallel without freezing the user interface
  - [ ] **Option B**: To make the computer use zero memory
  - [ ] **Option C**: To automatically fix syntax bugs
* **Targeted Misconception ID**: `MC_JAVA_THREAD_RUN_VS_START`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_THREAD_RUN_VS_START`
    + 🔍 **What Went Wrong**: Threads allow parallel background task execution.
    + 💡 **Simpler Everyday Picture**: Background workers do tasks without freezing the main screen.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The Runnable Interface & `.start()` vs `.run()` (Block ID: `java-d28-b2-runnable-start`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Thread.start() Mechanics`
* **Supporting Terms**: Runnable Interface, .start() vs .run()
* **Prerequisites Required**: `java-d28-b1-why-threads` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class Task implements Runnable {
      public void run() {
          System.out.println("Background worker running!");
      }
  }
  // Spawning the parallel thread:
  Thread t = new Thread(new Task());
  t.start(); // 🚀 Spawns a NEW independent JVM thread!
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 7**: t.start() asks the JVM OS scheduler to spawn a brand-new parallel thread. If you accidentally call t.run(), it runs sequentially on the current thread!
* **💻 Runnable Interactive Java Code Sandbox** (`ThreadDemo.java` | Editable: No):
  ```java
  class Worker implements Runnable {
      public void run() {
          System.out.println("Worker thread active");
      }
  }
  public class ThreadDemo {
      public static void main(String[] args) {
          Thread t = new Thread(new Worker());
          t.start();
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Worker thread active
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What happens if you call t.run() directly instead of t.start()?
* **Selectable Options**:
  - [x] **Option A**: It executes sequentially on the main thread like a normal method call without spawning a new background thread
  - [ ] **Option B**: It spawns two threads
  - [ ] **Option C**: It crashes the computer
* **Targeted Misconception ID**: `MC_JAVA_THREAD_RUN_VS_START`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_THREAD_RUN_VS_START`
    + 🔍 **What Went Wrong**: t.run() executes on the caller thread. Only t.start() spawns a new thread of execution.
    + 💡 **Simpler Everyday Picture**: Always call .start() to spawn a new parallel worker.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Shared State & Race Conditions (Block ID: `java-d28-b3-race-conditions`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Race Condition Awareness`
* **Supporting Terms**: Shared Variable Conflict, Thread Safety
* **Prerequisites Required**: `java-d28-b2-runnable-start` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"Two People Writing on the Same Chalkboard at the Same Second"*
  > If Chef 1 and Chef 2 try to write on the exact same chalkboard line simultaneously, their chalk marks collide and produce scrambled text. Shared state requires thread safety.
* **💻 Runnable Interactive Java Code Sandbox** (`ThreadSafetyDemo.java` | Editable: No):
  ```java
  public class ThreadSafetyDemo {
      public static void main(String[] args) {
          System.out.println("Multithreading requires thread coordination for shared data.");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Multithreading requires thread coordination for shared data.
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What is a race condition in multithreaded programming?
* **Selectable Options**:
  - [x] **Option A**: A bug occurring when multiple threads concurrently modify shared data without coordination, causing unpredictable results
  - [ ] **Option B**: When one computer runs faster than another
  - [ ] **Option C**: A loop that finishes too quickly
* **Targeted Misconception ID**: `MC_JAVA_THREAD_RUN_VS_START`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_THREAD_RUN_VS_START`
    + 🔍 **What Went Wrong**: Race conditions occur when uncoordinated concurrent writes corrupt shared state.
    + 💡 **Simpler Everyday Picture**: Two threads colliding on the same variable.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-28`)
* **Exam Title**: Day 28 Challenge: Parallel Task Runner
* **Problem Statement**: Create class Worker implements Runnable with run() printing 'Work Done'.
* **Starter Code (`Solution.java`)**:
```java
class Worker implements Runnable {
    public void run() {
        System.out.println("Work Done");
    }
}
public class Solution {
    public static void execute() {
        Worker w = new Worker();
        w.run();
    }
}
```
* **Socratic Hint**: class Worker implements Runnable { public void run() { System.out.println("Work Done"); } }
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));
        Worker w = new Worker();
        w.run();
        String res = out.toString().trim();
        if (!res.contains("Work Done")) throw new AssertionError("Worker run() must print 'Work Done'");
        if (res.length() < 8) throw new AssertionError("Output length must match Work Done");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-28`)
* **Assignment Title**: Day 28 Assignment: Thread Status Checker
* **Problem Statement**: Write isRunning(Thread t) returning t.isAlive().
* **Starter Code (`Solution.java`)**:
```java
public class Solution { public static boolean isRunning(Thread t) { return t != null && t.isAlive(); } }
```
* **Socratic Hint**: return t != null && t.isAlive();
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        Thread t = new Thread(() -> {});
        if (Solution.isRunning(t)) throw new AssertionError("Unstarted thread is not running");
        if (Solution.isRunning(null)) throw new AssertionError("Null thread must return false");
    }
}
```


################################################################################
# 📅 DAY 29: File & Stream I/O — Data Ingestion & Stream Processing
################################################################################

**Core Intuitive Metaphor**: A data stream is like a water pipe: data flows through the pipe byte-by-byte or line-by-line; when you are finished, you MUST close the valve (close stream) so you do not leak operating system resources.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-29`)
**Total Interactive Micro-Learning Blocks**: 3

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Streams as Plumbing Pipes (Block ID: `java-d29-b1-stream-concept`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Stream Pipelines`
* **Supporting Terms**: InputStream / Reader, Sequential Byte/Char Flow
* **Prerequisites Required**: `java-d23-b2-try-catch-syntax` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Water Pipe"*
  > Instead of loading a massive 10GB file into RAM all at once (which would crash your computer), a stream lets you drink from the pipe one sip (or line) at a time.
* **💻 Runnable Interactive Java Code Sandbox** (`StreamPipeDemo.java` | Editable: No):
  ```java
  
  
  
  public class StreamPipeDemo {
      public static void main(String[] args) {
          Scanner pipe = new Scanner(new StringReader("Chunk1\nChunk2"));
          while (pipe.hasNextLine()) {
              System.out.println("Stream Flow: " + pipe.nextLine());
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Stream Flow: Chunk1
    Stream Flow: Chunk2
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why do applications process files using Streams rather than loading entire giant files at once?
* **Selectable Options**:
  - [x] **Option A**: To process data line-by-line using minimal constant memory without exhausting RAM
  - [ ] **Option B**: Because Java cannot open files larger than 1MB
  - [ ] **Option C**: Streams delete the hard drive
* **Targeted Misconception ID**: `MC_JAVA_STREAM_PIPELINE_MEMORY`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_STREAM_PIPELINE_MEMORY`
    + 🔍 **What Went Wrong**: Streams allow efficient sequential processing of arbitrary data sizes.
    + 💡 **Simpler Everyday Picture**: Read line-by-line without running out of RAM.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: Line-by-Line Reading with BufferedReader / Scanner (Block ID: `java-d29-b2-buffered-reader`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Stream Line Reading`
* **Supporting Terms**: readLine(), null Termination
* **Prerequisites Required**: `java-d29-b1-stream-concept` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  
  
  
  BufferedReader reader = new BufferedReader(new StringReader("Line 1\nLine 2"));
  String line;
  while ((line = reader.readLine()) != null) {
      System.out.println("Read: " + line);
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 5**: reader.readLine() returns the next line as a String, or null when end-of-stream is reached.
* **💻 Runnable Interactive Java Code Sandbox** (`StreamDemo.java` | Editable: No):
  ```java
  
  
  
  public class StreamDemo {
      public static void main(String[] args) throws Exception {
          BufferedReader reader = new BufferedReader(new StringReader("LOG: Server Started\nLOG: User Login"));
          String line;
          while ((line = reader.readLine()) != null) {
              System.out.println("Processing -> " + line);
          }
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Processing -> LOG: Server Started
    Processing -> LOG: User Login
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What does reader.readLine() return when it reaches the end of the file/stream?
* **Selectable Options**:
  - [x] **Option A**: null
  - [ ] **Option B**: An empty string ""
  - [ ] **Option C**: -1
* **Targeted Misconception ID**: `MC_JAVA_BUFFERED_READER_EOF_NULL`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_BUFFERED_READER_EOF_NULL`
    + 🔍 **What Went Wrong**: readLine() returns null when no further lines exist in the stream.
    + 💡 **Simpler Everyday Picture**: null signals end of stream.
    + 🚀 **Guided Retry Prompt**: Select null.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Try-with-Resources (Automatic Stream Valve Closing) (Block ID: `java-d29-b3-try-with-resources`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `try-with-resources`
* **Supporting Terms**: AutoCloseable, No Resource Leak
* **Prerequisites Required**: `java-d29-b2-buffered-reader` (understood)

**2. Media & Conceptual Scaffolding**:
* **🔍 Broken vs Fixed Visual Diff**:
  - ❌ **Broken Code**: `BufferedReader r = new BufferedReader(...); // If error happens here, r is NEVER closed (Resource Leak!) r.close();`
  - ✅ **Fixed Code**: `try (BufferedReader r = new BufferedReader(...)) {     // Automatically closes r when block finishes, even on errors! }`
  - **Why it Broke**: Manual close() is skipped if an exception is thrown inside the method.
  - **How to Fix**: Use try (Resource r = ...) so Java guarantees automatic closure.
* **💻 Runnable Interactive Java Code Sandbox** (`AutoCloseDemo.java` | Editable: No):
  ```java
  
  
  
  public class AutoCloseDemo {
      public static void main(String[] args) {
          try (BufferedReader br = new BufferedReader(new StringReader("Resource Safe Data"))) {
              System.out.println("Read: " + br.readLine());
          } catch (Exception e) {}
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Read: Resource Safe Data
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why is try (BufferedReader r = ...) preferred over manual r.close()?
* **Selectable Options**:
  - [x] **Option A**: Java automatically closes the stream resource in all situations, even if exceptions occur
  - [ ] **Option B**: It makes reading 10x faster
  - [ ] **Option C**: It deletes temporary files
* **Targeted Misconception ID**: `MC_JAVA_TRY_WITH_RESOURCES_AUTOCLOSE`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_TRY_WITH_RESOURCES_AUTOCLOSE`
    + 🔍 **What Went Wrong**: try-with-resources guarantees resource cleanup preventing file descriptor leaks.
    + 💡 **Simpler Everyday Picture**: Java closes the stream automatically.
    + 🚀 **Guided Retry Prompt**: Select Option A.

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-29`)
* **Exam Title**: Day 29 Challenge: Stream Error Log Parser
* **Problem Statement**: Write countErrorLines(String streamText) in Solution that uses a BufferedReader / StringReader to count how many lines start with '[ERROR]'.
* **Starter Code (`Solution.java`)**:
```java


public class Solution {
    public static int countErrorLines(String streamText) {
        if (streamText == null) return 0;
        int count = 0;
        try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().startsWith("[ERROR]")) count++;
            }
        } catch (Exception e) {}
        return count;
    }
}
```
* **Socratic Hint**: try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) { String line; while ((line = reader.readLine()) != null) if (line.startsWith("[ERROR]")) count++; }
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        String log1 = "[INFO] Boot
[ERROR] Null pointer
[WARN] High load
[ERROR] Timeout";
        if (Solution.countErrorLines(log1) != 2) throw new AssertionError("Expected 2 errors in log1");
        String log2 = "[INFO] Clean run
[DEBUG] Trace info";
        if (Solution.countErrorLines(log2) != 0) throw new AssertionError("Expected 0 errors in log2");
        String log3 = "[ERROR] Fatal crash";
        if (Solution.countErrorLines(log3) != 1) throw new AssertionError("Expected 1 error in log3");
        if (Solution.countErrorLines(null) != 0) throw new AssertionError("Null stream must return 0");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-29`)
* **Assignment Title**: Day 29 Assignment: CSV Field Stream Extractor
* **Problem Statement**: Write extractFirstColumn(String csvText) in Solution returning an ArrayList<String> of the first column in each row.
* **Starter Code (`Solution.java`)**:
```java



public class Solution {
    public static ArrayList<String> extractFirstColumn(String csvText) {
        ArrayList<String> res = new ArrayList<>();
        if (csvText == null) return res;
        try (BufferedReader reader = new BufferedReader(new StringReader(csvText))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length > 0 && !parts[0].trim().isEmpty()) res.add(parts[0].trim());
            }
        } catch (Exception e) {}
        return res;
    }
}
```
* **Socratic Hint**: BufferedReader with line.split(",") adding parts[0] to ArrayList.
* **Multi-Case Test Suite (`Test.java`)**:
```java

public class Test {
    public static void main(String[] args) {
        String csv = "Alice,95,A
Bob,88,B
Charlie,72,C";
        ArrayList<String> names = Solution.extractFirstColumn(csv);
        if (names.size() != 3) throw new AssertionError("Must extract 3 names");
        if (!names.get(0).equals("Alice")) throw new AssertionError("First name must be Alice");
        if (!names.get(2).equals("Charlie")) throw new AssertionError("Third name must be Charlie");
        if (Solution.extractFirstColumn(null).size() != 0) throw new AssertionError("Null CSV must return empty list");
    }
}
```


################################################################################
# 📅 DAY 30: 🏆 Comprehensive Capstone Project: Ledger Transaction Auditor
################################################################################

**Core Intuitive Metaphor**: The Capstone synthesizes your entire 30-day journey into a complete enterprise financial auditing engine: object entities, validation guards, collections, and threshold summation working in harmony.

### 🎓 Quest 1: Socratic Adaptive Lesson (`java-basics-lecture1-day-30`)
**Total Interactive Micro-Learning Blocks**: 4

--------------------------------------------------------------------------------
#### 🔹 Slide 1: Capstone System Architecture (Block ID: `java-d30-b1-architecture`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Full System Integration`
* **Supporting Terms**: Domain Entity, Ledger Collection, Audit Engine
* **Prerequisites Required**: `java-d26-b1-hashmap-concept` (understood)

**2. Media & Conceptual Scaffolding**:
* **💡 Everyday Real-World Analogy**: *"The Enterprise Banking Auditor"*
  > You are building the transaction auditor for a major financial bank: it processes ledger records, filters high-value transactions above a threshold, rejects negative corruption, and computes total balances.
* **⚡ Logic Execution Flowchart**:
  - Step 1 [START]: 1. Raw Transaction Stream Array
  - Step 2 [DECISION]: 2. Defensive Guard: Reject invalid amounts (<= 0)
  - Step 3 [PROCESS]: 3. Threshold Filter: amount > limit?
  - Step 4 [PROCESS]: 4. Summation Accumulator: sum += amount
  - Step 5 [END]: 5. Return Audited Balance
* **💻 Runnable Interactive Java Code Sandbox** (`ArchitectureDemo.java` | Editable: No):
  ```java
  public class ArchitectureDemo {
      public static void main(String[] args) {
          System.out.println("Capstone Auditor: Domain Entities + Validation + Aggregation");
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Capstone Auditor: Domain Entities + Validation + Aggregation
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: What are the core components synthesized in the Ledger Auditor capstone?
* **Selectable Options**:
  - [x] **Option A**: Domain classes, defensive validation, loop traversal, threshold filtering, and summation
  - [ ] **Option B**: Only print statements
  - [ ] **Option C**: Only while loops
* **Targeted Misconception ID**: `MC_JAVA_CAPSTONE_SYSTEM_SYNTHESIS`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_CAPSTONE_SYSTEM_SYNTHESIS`
    + 🔍 **What Went Wrong**: The capstone unifies OOP, collections, validation, and algorithmic traversal.
    + 💡 **Simpler Everyday Picture**: All major course concepts synthesized into 1 project.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 2: The Transaction Domain Entity (Block ID: `java-d30-b2-transaction-entity`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Domain Entity Modeling`
* **Supporting Terms**: Encapsulated Fields, Validation Constructor
* **Prerequisites Required**: `java-d30-b1-architecture` (understood)

**2. Media & Conceptual Scaffolding**:
* **📐 Syntax Anatomy Breakdown**:
  ```java
  class Transaction {
      private String id;
      private int amount;
      public Transaction(String id, int amount) {
          if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
          this.id = id;
          this.amount = amount;
      }
      public int getAmount() { return amount; }
  }
  ```
  - *Line-by-Line Technical Notes*:
    + **Line 4**: Defensive validation in constructor ensures no corrupt transactions can ever exist in memory.
* **💻 Runnable Interactive Java Code Sandbox** (`TransactionEntityDemo.java` | Editable: No):
  ```java
  class Transaction {
      int amount;
      public Transaction(int amt) {
          if (amt <= 0) throw new IllegalArgumentException("Amount must be > 0");
          this.amount = amt;
      }
  }
  public class TransactionEntityDemo {
      public static void main(String[] args) {
          Transaction tx = new Transaction(250);
          System.out.println("Valid Transaction created: $" + tx.amount);
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Valid Transaction created: $250
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `choose_answer`
* **Question Asked**: Why does the Transaction constructor throw IllegalArgumentException when amount <= 0?
* **Selectable Options**:
  - [x] **Option A**: To guarantee that no invalid or negative transaction object can ever be instantiated in memory
  - [ ] **Option B**: To make the object static
  - [ ] **Option C**: To format the output as CSV
* **Targeted Misconception ID**: `MC_JAVA_ENTITY_INVARIANT_VALIDATION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [1]** ➔ Diagnosed: `MC_JAVA_ENTITY_INVARIANT_VALIDATION`
    + 🔍 **What Went Wrong**: Constructor validation guarantees invariant state for domain objects.
    + 💡 **Simpler Everyday Picture**: Prevent bad data from entering the system.
    + 🚀 **Guided Retry Prompt**: Select Option A.

--------------------------------------------------------------------------------
#### 🔹 Slide 3: Auditor Aggregation & Threshold Filter (Block ID: `java-d30-b3-auditor-aggregation`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Threshold Filter & Accumulation`
* **Supporting Terms**: for-each scan, summation
* **Prerequisites Required**: `java-d30-b2-transaction-entity` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`AuditorDemo.java` | Editable: No):
  ```java
  public class AuditorDemo {
      public static int auditLedger(int[] amounts, int threshold) {
          int sum = 0;
          for (int a : amounts) {
              if (a > threshold) {
                  sum += a;
              }
          }
          return sum;
      }
      public static void main(String[] args) {
          int[] ledger = { 100, 500, 200, 1200, 4500 };
          System.out.println("High Value Sum: $" + auditLedger(ledger, 1000));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    High Value Sum: $5700
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: In AuditorDemo with amounts { 100, 500, 200, 1200, 4500 } and threshold 1000, what is 1200 + 4500?
* **Correct Answer**: `High Value Sum: $5700` (Variants: High Value Sum: $5700, 5700, $5700)
* **Targeted Misconception ID**: `MC_JAVA_AUDITOR_THRESHOLD_FILTER`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_AUDITOR_THRESHOLD_FILTER`
    + 🔍 **What Went Wrong**: Only 1200 and 4500 are > 1000; their sum is 5700.
    + 💡 **Simpler Everyday Picture**: 1200 + 4500 = 5700.
    + 🚀 **Guided Retry Prompt**: Type High Value Sum: $5700

--------------------------------------------------------------------------------
#### 🔹 Slide 4: Category Filtering & Balance Reconciliation (Block ID: `java-d30-b4-category-filter`)

**1. Cognitive Budget (1 Primary Concept Rule)**:
* **Primary Target Concept**: `Category Reconciliation`
* **Supporting Terms**: Record Parsing, Category Matching
* **Prerequisites Required**: `java-d30-b3-auditor-aggregation` (understood)

**2. Media & Conceptual Scaffolding**:
* **💻 Runnable Interactive Java Code Sandbox** (`CategoryAuditor.java` | Editable: No):
  ```java
  public class CategoryAuditor {
      public static int calculateBalance(int initialBalance, int[] transactions) {
          int balance = initialBalance;
          for (int tx : transactions) {
              balance += tx;
          }
          return balance;
      }
      public static void main(String[] args) {
          int[] txs = { 500, -200, 150 };
          System.out.println("Reconciled Balance: $" + calculateBalance(1000, txs));
      }
  }
  ```
  - *Actual Terminal Output*:
    ```
    Reconciled Balance: $1450
    ```

**3. Socratic Diagnostic & Empathetic Recovery Ladder**:
* **Diagnostic Format**: `predict_output`
* **Question Asked**: What is 1000 + 500 - 200 + 150?
* **Correct Answer**: `Reconciled Balance: $1450` (Variants: Reconciled Balance: $1450, 1450, $1450)
* **Targeted Misconception ID**: `MC_JAVA_BALANCE_RECONCILIATION`
* **Empathetic 3-Step Recovery Path**:
  - **If Student Answers [wrong]** ➔ Diagnosed: `MC_JAVA_BALANCE_RECONCILIATION`
    + 🔍 **What Went Wrong**: 1000 + 500 - 200 + 150 = 1450.
    + 💡 **Simpler Everyday Picture**: Reconciled balance is 1450.
    + 🚀 **Guided Retry Prompt**: Type Reconciled Balance: $1450

### ⚡ Quest 2: Proctored Coding Exam (`java-basics-exam-day-30`)
* **Exam Title**: Day 30 Final Capstone Challenge: Ledger Transaction Auditor
* **Problem Statement**: Write auditLedger(int[] amounts, int limit) in Solution returning the sum of all transaction amounts strictly greater than limit.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int auditLedger(int[] amounts, int limit) {
        int sum = 0;
        for (int a : amounts) {
            if (a > limit) sum += a;
        }
        return sum;
    }
}
```
* **Socratic Hint**: for (int a : amounts) if (a > limit) sum += a; return sum;
* **Proctored Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        int[] ledger1 = { 500, 1500, 200, 3000, 800 };
        if (Solution.auditLedger(ledger1, 1000) != 4500) throw new AssertionError("1500 + 3000 must be 4500");
        int[] ledger2 = { 100, 200, 300 };
        if (Solution.auditLedger(ledger2, 500) != 0) throw new AssertionError("No amounts over limit must return 0");
        int[] ledger3 = { 1000, 2000 };
        if (Solution.auditLedger(ledger3, 500) != 3000) throw new AssertionError("All amounts over limit must sum to 3000");
        int[] emptyLedger = {};
        if (Solution.auditLedger(emptyLedger, 100) != 0) throw new AssertionError("Empty ledger must return 0");
    }
}
```

### 🛠️ Quest 3: Practical Java Assignment (`java-basics-assign-day-30`)
* **Assignment Title**: Day 30 Final Capstone Assignment: Account Balance Reconciler
* **Problem Statement**: Write calculateBalance(int initialBalance, int[] transactions) in Solution returning the net reconciled balance by applying all positive credits and negative debits.
* **Starter Code (`Solution.java`)**:
```java
public class Solution {
    public static int calculateBalance(int initialBalance, int[] txs) {
        int balance = initialBalance;
        if (txs != null) {
            for (int t : txs) balance += t;
        }
        return balance;
    }
}
```
* **Socratic Hint**: for (int t : txs) balance += t; return balance;
* **Multi-Case Test Suite (`Test.java`)**:
```java
public class Test {
    public static void main(String[] args) {
        int[] txs1 = { 500, -200, 150 };
        if (Solution.calculateBalance(1000, txs1) != 1450) throw new AssertionError("1000 + 500 - 200 + 150 must be 1450");
        int[] txs2 = { -500, -300 };
        if (Solution.calculateBalance(1000, txs2) != 200) throw new AssertionError("1000 - 800 must be 200");
        if (Solution.calculateBalance(500, new int[]{}) != 500) throw new AssertionError("Empty transactions must preserve initial");
        if (Solution.calculateBalance(500, null) != 500) throw new AssertionError("Null transactions must preserve initial");
    }
}
```

