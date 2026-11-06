# Expand scripts/block4_day16.py to strictly >= 580 words per part

expanded_day16 = '''# Day 16: Classes, Objects, Instance Fields & JVM Heap Memory Allocation

DAY_16 = {
    "day": 16,
    "title": "Classes, Objects, Instance Fields & JVM Heap Memory Allocation",
    "goal": "Master Object-Oriented Programming foundations in Java from class blueprints to JVM heap memory allocation. Understand object headers (Mark Word, Klass Pointer), instance fields vs local variables, the new keyword bytecode mechanics (new, dup, invokespecial), reference variables on the stack, dot notation, and implement an enterprise BankAccount state machine.",
    "minutes": 25,
    "recap": "Yesterday we concluded Block 3 with our Milestone 3 Binary Search Ledger, mastering divide-and-conquer search, integer overflow safety, and array algorithms. Today, we step into Block 4 and begin Object-Oriented Programming: discovering how Java models real-world business domains through Classes and Heap Objects.",
    "parts": [
        {
            "title": "Object-Oriented Paradigms: The Class Blueprint vs The Heap Object Instance",
            "content": """In modern enterprise software engineering, complex business applications are not structured as monolithic sequences of procedural instructions; rather, they are engineered through the Object-Oriented Programming (OOP) paradigm. In procedural programming, functions operate on detached, external data structures, often resulting in fragmented state management where data can be modified unpredictably across disparate routines without centralized validation. Object-Oriented Programming resolves this architectural vulnerability by binding state (data attributes) and behavior (computational methods) into cohesive, self-contained domain models. At the heart of this paradigm lies the fundamental distinction between two entities: The Class Blueprint and The Object Instance.

A Class in Java serves as an architectural blueprint, a formal specification, and a type definition. Written in source code using the 'class' keyword and compiled into a '.class' bytecode file, a class defines what attributes an entity will possess and what operations it can perform. However, a class definition by itself consumes no heap memory for storing live business data. Instead, when the Java Virtual Machine (JVM) loads a class, its metadata\u2014such as field descriptors, method bytecodes, constant pool entries, and runtime annotations\u2014is parsed and stored permanently in the JVM Metaspace (an off-heap native memory region dedicated to class metadata). This lifecycle involves three rigorous phases: Loading (where ClassLoaders locate and parse the byte array into memory), Linking (encompassing bytecode verification, static preparation, and symbolic reference resolution), and Initialization (executing static initializers). Think of a class definition as an architect's blueprint for a skyscraper: the blueprint specifies the number of rooms, electrical wiring, and structural load limits, but you cannot physically live inside a paper blueprint.

An Object, in contrast, is the living, physical embodiment of that blueprint instantiated in active memory. When your code executes the 'new' operator (for example, 'BankAccount account = new BankAccount();'), the JVM reads the class blueprint from Metaspace and allocates a concrete, distinct payload of RAM on the JVM Heap. This live heap structure is termed an Object Instance. Every instantiated object possesses its own independent copy of the instance variables defined in the class blueprint. If an application instantiates two hundred thousand separate BankAccount objects, each individual account maintains its own unique account number, ledger balance, and transactional history in heap memory. Mutating the balance of account A does not alter or corrupt the balance of account B, because their states reside at completely disjoint physical memory addresses.

In Domain-Driven Design (DDD) and microservice architectures, classes define domain entities that encapsulate business rules within bounded contexts. By housing business calculations directly within the entity\u2014such as the 'deposit' method enforcing credit limits and positive transaction rules\u2014the application guarantees that invalid states cannot be injected from the outside. Furthermore, because each object instance maintains its own isolated memory footprint on the JVM heap, modern enterprise systems can safely process millions of concurrent user sessions across distributed worker threads without fear of cross-tenant data corruption. In the interactive lab below, we trace this foundational relationship by defining a canonical BankAccount class and observing how the JVM instantiates multiple independent objects with isolated instance states.""",
            "code": """public class BlueprintInstanceLab {
    // Class Blueprint: Defines state fields and operational behaviors
    public static class BankAccount {
        // Instance fields: Each instantiated object gets its own copy in heap RAM
        public String accountNumber;
        public int balance;

        // Instance methods: Operations that act on the specific object instance
        public void deposit(int amount) {
            if (amount > 0) {
                balance += amount;
                System.out.println("Account " + accountNumber + ": Deposited $" + amount + " -> New Balance: $" + balance);
            }
        }

        public int getBalance() {
            return balance;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== CLASS BLUEPRINT VS OBJECT INSTANCE LAB ===");

        // Instantiating Object Instance 1
        BankAccount account1 = new BankAccount();
        account1.accountNumber = "ACC-1001";
        account1.deposit(500);

        // Instantiating Object Instance 2: Completely independent heap allocation
        BankAccount account2 = new BankAccount();
        account2.accountNumber = "ACC-2002";
        account2.deposit(1200);

        // Mutating account1 does NOT impact account2:
        account1.deposit(250);

        System.out.println("\\nFinal State Verification:");
        System.out.println("Account 1 Balance: $" + account1.getBalance() + " (Expected: $750)");
        System.out.println("Account 2 Balance: $" + account2.getBalance() + " (Expected: $1200)");
    }
}""",
            "checks": [
                {
                    "question": "What is the primary architectural difference between a Class and an Object in Java?",
                    "options": [
                        "A Class is a blueprint stored in Metaspace defining fields and methods; an Object is a concrete instance allocated on the Heap holding live state",
                        "A Class holds live runtime state on the stack; an Object is just a text file on disk",
                        "A Class can only exist in C++; Java only uses Objects",
                        "They are identical synonyms for the same compiler construct"
                    ],
                    "answer": 0,
                    "explanation": "A Class is the compile-time type and blueprint loaded into Metaspace; an Object is an instantiated instance residing on the Heap."
                },
                {
                    "question": "Where does the JVM store class metadata (method bytecodes, constant pools, and field descriptors)?",
                    "options": [
                        "In the JVM Metaspace, an off-heap native memory region dedicated to class metadata",
                        "In the thread's local operand stack",
                        "Inside CPU Level 1 cache exclusively",
                        "In temporary swap space on the SSD drive"
                    ],
                    "answer": 0,
                    "explanation": "Starting in Java 8, permanent generation was replaced by Metaspace, which stores class metadata in native off-heap memory."
                },
                {
                    "question": "If an application creates two independent objects 'acc1 = new BankAccount()' and 'acc2 = new BankAccount()', what happens to their instance fields?",
                    "options": [
                        "Each object receives its own independent copy of instance fields in separate heap memory locations",
                        "Both objects share the same single balance variable in memory",
                        "The second object overwrites the memory of the first object",
                        "The JVM throws a DuplicateInstanceException"
                    ],
                    "answer": 0,
                    "explanation": "Instance variables belong to individual object instances; each new allocation creates distinct, isolated storage."
                },
                {
                    "question": "Why is procedural state management considered more vulnerable than Object-Oriented encapsulation in large systems?",
                    "options": [
                        "Procedural state is detached from functions and can be mutated unpredictably anywhere, whereas OOP binds state and behavior together",
                        "Procedural code runs slower because it cannot use 64-bit CPU registers",
                        "Procedural code cannot compile in modern operating systems",
                        "OOP completely eliminates all computer memory usage"
                    ],
                    "answer": 0,
                    "explanation": "Encapsulating data and logic inside classes prevents arbitrary external corruption and establishes clear operational boundaries."
                }
            ]
        },
        {
            "title": "JVM Memory Topologies: Stack Reference Pointers vs Heap Object Payloads",
            "content": """To master Java systems engineering, software developers must develop a crystal-clear mental model of how the Java Virtual Machine manages memory during object creation and method execution. The JVM partitions its runtime data area into two primary memory regions: The Thread Call Stack and The JVM Heap. Every executing thread in a Java application receives its own private Call Stack, which stores active stack frames containing local variables, primitive values, and object reference pointers. In contrast, the JVM Heap is a single, massive, shared memory space shared by all threads in the process, serving as the universal repository for all dynamically allocated objects and arrays.

When an application executes the statement 'BankAccount account = new BankAccount();', memory allocation occurs across both regions simultaneously. On the thread's Call Stack, a 4-byte or 8-byte reference variable named 'account' is pushed onto the current frame. This variable does NOT contain the actual BankAccount object, nor does it contain the balance integer. Instead, it holds a 64-bit (or 32-bit with Compressed OOPs enabled) memory address\u2014a direct reference pointer\u2014pointing to the base address where the physical object payload is stored in Eden space on the JVM Heap. If the reference variable is set to 'null' ('account = null;'), the stack variable contains the null pointer (address zero), signifying that it points to no heap payload. Under modern 64-bit server JVMs with heaps under 32 gigabytes, the HotSpot engine automatically activates Compressed Ordinary Object Pointers (-XX:+UseCompressedOops). Because all objects are aligned to 8-byte boundaries, the low three bits of every heap address are always zero. The JVM exploits this mathematical property by shifting addresses right by three bits, allowing 32-bit pointers to reference up to 32GB of heap space while slashing cache footprint and memory bus pressure by nearly 50 percent!

On the JVM Heap, the physical object payload is laid out with extreme precision according to the JVM Object Layout specification. Every standard Java object allocated on the heap consists of three distinct structural segments:
1. The Object Header: Consisting of two sub-components:
   - The Mark Word (typically 64 bits on a 64-bit architecture): Holds runtime metadata essential for JVM operations, including the object's identity hashcode, garbage collection generation age (a 4-bit field incremented during generational minor GC cycles until reaching the tenuring threshold, usually 15, promoting the object to Old Generation), locking state flags (unlocked, biased, lightweight thin lock, or heavyweight monitor lock pointer), and biased locking thread IDs.
   - The Klass Word (also known as the Class Metadata Pointer, 64 bits, or 32 bits under +XX:+UseCompressedClassPointers): Holds a direct pointer pointing to the Class blueprint metadata residing in Metaspace, allowing the JVM to resolve the object's dynamic type and virtual method table at runtime.
2. The Instance Data Payload: Contains the actual primitive values and reference pointers corresponding to the instance fields declared in the class. In our BankAccount class, the 32-bit 'balance' integer occupies exactly 4 bytes of memory, while the 'accountNumber' reference occupies 4 or 8 bytes.
3. Alignment Padding: The HotSpot JVM memory allocator requires all heap objects to be aligned to multiples of 8 bytes (64 bits) to optimize hardware memory bus bandwidth and CPU cache line transfers. If the sum of the Object Header and Instance Data is not an exact multiple of 8 bytes, the JVM inserts 1 to 7 bytes of dead padding at the end of the object.

Understanding this dual topology is essential. Stack reference variables are ephemeral: when a method returns, its stack frame is instantly popped and discarded with zero latency. The object payload on the heap, however, persists until the Garbage Collector detects that no active reference paths (GC Roots) lead to that object, at which point its memory is reclaimed. In the interactive lab below, we trace this stack-versus-heap relationship and inspect reference address semantics.""",
            "code": """public class MemoryTopologyLab {
    public static class BankAccount {
        public int balance = 1000;
    }

    public static void main(String[] args) {
        System.out.println("=== STACK REFERENCE VS HEAP PAYLOAD LAB ===");

        // Reference variable 'acc1' on the Stack points to Object A on the Heap
        BankAccount acc1 = new BankAccount();
        System.out.println("acc1 initial balance: $" + acc1.balance);

        // Copying reference: 'acc2' on the Stack points to the SAME Object A on the Heap!
        BankAccount acc2 = acc1;
        System.out.println("acc2 copied reference balance: $" + acc2.balance);

        // Mutating through acc2 modifies the underlying Heap object!
        acc2.balance = 2500;
        System.out.println("\\nAfter mutating acc2.balance = 2500:");
        System.out.println("acc1.balance: $" + acc1.balance + " (REFLECTS MUTATION!)");
        System.out.println("acc2.balance: $" + acc2.balance);

        // Demonstrating Reference Equality (==) vs Independent Allocation
        BankAccount acc3 = new BankAccount(); // Distinct Heap Allocation Object B
        acc3.balance = 2500;

        System.out.println("\\nReference Equality Verification:");
        System.out.println("acc1 == acc2: " + (acc1 == acc2) + " (Same Heap Address: true)");
        System.out.println("acc1 == acc3: " + (acc1 == acc3) + " (Different Heap Addresses: false)");
    }
}""",
            "checks": [
                {
                    "question": "What is physically stored in a local object reference variable (e.g., 'BankAccount acc') on the Thread Call Stack?",
                    "options": [
                        "A memory address pointer pointing to the physical object payload residing on the JVM Heap",
                        "The entire class bytecode and all method instructions",
                        "The object's balance integer and all string characters directly",
                        "A permanent file descriptor on the operating system disk"
                    ],
                    "answer": 0,
                    "explanation": "Reference variables on the stack store memory address pointers; the object's instance fields reside on the Heap."
                },
                {
                    "question": "What two critical sub-components constitute the standard 64-bit JVM Object Header on the Heap?",
                    "options": [
                        "The Mark Word (GC age, hashcode, lock state) and the Klass Word (metadata pointer to Metaspace)",
                        "The Stack Frame and the Program Counter Register",
                        "The Thread ID and the CPU core temperature",
                        "The File Name and the Operating System Kernel PID"
                    ],
                    "answer": 0,
                    "explanation": "The Object Header contains the Mark Word (hashcode, GC age, locks) and Klass Word (class pointer to Metaspace)."
                },
                {
                    "question": "Why does the JVM append 1 to 7 bytes of Alignment Padding to heap objects?",
                    "options": [
                        "To ensure the object's total byte size is an exact multiple of 8 bytes for CPU memory bus efficiency",
                        "To hide confidential user passwords from operating system drivers",
                        "To allow backward compatibility with 16-bit MS-DOS computers",
                        "To prevent Java classes from executing more than 8 methods"
                    ],
                    "answer": 0,
                    "explanation": "64-bit processor architectures access memory in 8-byte aligned words; padding aligns object boundaries to 8 bytes."
                },
                {
                    "question": "If 'BankAccount b1 = new BankAccount(); BankAccount b2 = b1;' is executed, what does 'b1 == b2' evaluate to?",
                    "options": [
                        "true, because both reference variables store identical memory addresses pointing to the exact same heap object",
                        "false, because b2 is a new independent copy on the heap",
                        "Compilation error, because '==' cannot compare references in Java",
                        "NullPointerException"
                    ],
                    "answer": 0,
                    "explanation": "Assignment of reference variables copies the memory pointer; both variables point to the same underlying heap object."
                }
            ]
        },
        {
            "title": "The 'new' Keyword Bytecode Anatomy: 'new', 'dup', and 'invokespecial' Execution",
            "content": """To truly understand how Java creates objects, we must peel back the high-level syntax of the Java language and inspect what occurs at the compiled bytecode layer within the JVM Execution Engine. When a software developer writes a seemingly simple line of Java code such as 'BankAccount acc = new BankAccount();', the javac compiler does not emit a single monolithic instruction. Instead, the Java compiler decomposes this instantiation statement into a strictly coordinated sequence of three low-level JVM bytecode instructions: 'new', 'dup', and 'invokespecial'.

Let us examine the exact operational mechanics of this three-stage bytecode sequence:
1. 'new <class-index>' (Heap Allocation & Zero-Initialization): The JVM executes the 'new' instruction with an operand pool index identifying the target class. The memory allocator checks Metaspace to determine the exact byte size of the object (header size + instance field sizes + padding). It allocates an uninitialized block of heap memory from the thread's Thread-Local Allocation Buffer (TLAB) in Eden space. By using thread-local allocation buffers, HotSpot completely eliminates global heap synchronization locks during memory allocation, achieving lock-free bump-the-pointer performance comparable to C/C++ stack allocations! Crucially, the JVM immediately performs Zero-Initialization: every bit of the allocated instance payload is cleared to zero! This is why Java instance variables have deterministic default values before any constructor runs: numeric primitives become 0 or 0.0, booleans become false, and object references become null! Once allocated, the 'new' instruction pushes the memory address pointer of this newly created, uninitialized object onto the thread's Operand Stack.
2. 'dup' (Duplicate Top of Operand Stack): At this exact instant, the operand stack contains a single reference pointer to the newly allocated object. However, the runtime now faces a dilemma: it must invoke the constructor to initialize the object, but invoking the constructor consumes the reference pointer from the stack! If that occurs, there would be no reference left on the stack to assign into the local variable 'acc'! To solve this, the compiler emits the 'dup' instruction, which duplicates the top value of the operand stack. Now, the operand stack holds two identical copies of the object reference pointer.
3. 'invokespecial <init>' (Constructor Initialization): The JVM executes the 'invokespecial' instruction targeting the instance initialization method (internally named '<init>' in bytecode, which corresponds to the constructor). The 'invokespecial' instruction pops the top reference pointer from the operand stack and passes it as the hidden 'this' reference to the constructor method. The constructor executes its constructor body, binding fields and initializing business state.
4. 'astore <index>' (Reference Storage): After '<init>' completes and pops its stack frame, the second copy of the reference pointer (created by 'dup') remains at the top of the calling method's operand stack. The compiler emits an 'astore' instruction (such as 'astore_1'), which pops this remaining reference pointer and stores it into the designated local variable slot on the current call stack frame.

In high-performance JIT compilation under the HotSpot C2 compiler, this sequence undergoes further optimization through Escape Analysis. If C2 proves that the newly created object does not escape the current method or thread context, the compiler can perform Scalar Replacement, dissolving the heap object entirely and mapping its constituent fields directly into CPU registers\u2014eliminating heap allocation and garbage collection overhead altogether! In the interactive lab below, we simulate this low-level lifecycle and verify deterministic zero-initialization.""",
            "code": """public class BytecodeAnatomyLab {
    public static class BankAccount {
        // Instance fields receive default zero-values during the 'new' instruction
        public int uninitializedField; // Defaults to 0
        public boolean flag;           // Defaults to false
        public String referenceField;  // Defaults to null

        // Constructor executes during 'invokespecial <init>'
        public BankAccount() {
            System.out.println("  [Bytecode: invokespecial] Constructor running!");
            System.out.println("  [Bytecode: invokespecial] Inside constructor: uninitializedField=" + uninitializedField);
            // Explicit assignment overwrites zero-initialization:
            this.uninitializedField = 42;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== THE 'NEW' KEYWORD BYTECODE LIFECYCLE LAB ===");
        System.out.println("Simulating: BankAccount acc = new BankAccount();");
        System.out.println("  Step 1: 'new' instruction -> Allocates heap RAM & zeroes memory");
        System.out.println("  Step 2: 'dup' instruction -> Duplicates reference on operand stack");
        System.out.println("  Step 3: 'invokespecial <init>' -> Executes constructor body:");

        BankAccount acc = new BankAccount();

        System.out.println("  Step 4: 'astore' instruction -> Stores heap pointer into local variable 'acc'");
        System.out.println("\\nObject fully initialized in heap memory:");
        System.out.println("acc.uninitializedField: " + acc.uninitializedField);
        System.out.println("acc.flag: " + acc.flag);
        System.out.println("acc.referenceField: " + acc.referenceField);
    }
}""",
            "checks": [
                {
                    "question": "What three low-level JVM bytecode instructions are emitted when 'new ClassName()' is compiled?",
                    "options": [
                        "'new' (allocates heap and zeroes memory), 'dup' (duplicates reference on operand stack), and 'invokespecial' (runs constructor)",
                        "'malloc', 'calloc', and 'free'",
                        "'load', 'store', and 'commit'",
                        "'push', 'pop', and 'swap'"
                    ],
                    "answer": 0,
                    "explanation": "Compilation of object instantiation produces 'new' to allocate RAM, 'dup' to duplicate the pointer, and 'invokespecial' to invoke the constructor."
                },
                {
                    "question": "Why does the Java compiler emit the 'dup' instruction between 'new' and 'invokespecial'?",
                    "options": [
                        "Because 'invokespecial' consumes one reference pointer to run the constructor, requiring a duplicated pointer to remain for local variable assignment",
                        "Because 64-bit CPUs require all memory addresses to be doubled",
                        "To allocate a backup copy of the object on a secondary hard drive",
                        "Because Java does not support single-pointer arithmetic"
                    ],
                    "answer": 0,
                    "explanation": "The constructor call pops the top reference from the stack as 'this'; 'dup' ensures a second pointer remains to be stored in the local variable."
                },
                {
                    "question": "When does the JVM perform zero-initialization (setting int fields to 0, booleans to false, references to null)?",
                    "options": [
                        "During the execution of the 'new' instruction, immediately upon allocating raw memory from the heap/TLAB",
                        "When the class file is first downloaded from GitHub",
                        "Only after the entire Java program exits",
                        "Never; uninitialized fields in Java contain random garbage memory bytes"
                    ],
                    "answer": 0,
                    "explanation": "The 'new' instruction zeroes allocated memory before any constructor executes, guaranteeing safe default values."
                },
                {
                    "question": "What is the internal bytecode method name generated by the compiler for an object constructor?",
                    "options": [
                        "<init>",
                        "<clinit>",
                        "constructor()",
                        "main()"
                    ],
                    "answer": 0,
                    "explanation": "Instance constructors are compiled into methods named '<init>'; static class initializers are named '<clinit>'."
                }
            ]
        },
        {
            "title": "Instance Fields and Methods: State Mutation, Dot Notation & Method Invocations",
            "content": """Once an object is instantiated on the JVM Heap and its memory address is stored in a reference variable on the call stack, your application interacts with the object through Dot Notation (the '.' operator). Dot notation is the primary syntactical mechanism in Java used to dereference an object pointer: it instructs the Java Virtual Machine to navigate from the local reference variable on the stack, follow the memory pointer down to the target object payload on the heap, and read or mutate a specific field or invoke a member method.

Instance fields define the stateful attributes of an object. Unlike local variables declared inside methods\u2014which must be explicitly initialized before use, otherwise failing compilation\u2014instance fields are automatically granted default zero-values during heap allocation:
- byte, short, int, long default to 0
- float and double default to 0.0
- boolean defaults to false
- char defaults to '\\u0000' (null character)
- Any reference type (String, arrays, other objects) defaults to null

When your code reads or writes an instance field using dot notation (such as 'account.balance = 500;'), the compiler emits the 'putfield' or 'getfield' bytecode instruction. The JVM calculates the exact memory offset of 'balance' relative to the base address of the heap object and writes or reads the 32-bit integer directly from that memory slot. In HotSpot memory layout optimization, fields are reordered to minimize padding waste: 64-bit primitives (longs, doubles) are placed first, followed by 32-bit types (ints, floats), 16-bit types (shorts, chars), 8-bit types (bytes, booleans), and finally reference pointers, ensuring natural CPU alignment and peak memory throughput.

However, dot notation comes with a critical operational requirement: The Reference Must Not Be Null! If a local variable holds the null pointer (0x0) and an application attempts to dereference it via dot notation (such as 'BankAccount acc = null; acc.deposit(100);'), the JVM execution engine halts execution instantly and throws a 'java.lang.NullPointerException' (NPE). Rather than executing costly software conditional checks before every instruction, the HotSpot JIT compiler optimizes null dereferences by leveraging hardware memory segmentation: accessing address 0 triggers an OS hardware page fault (SIGSEGV), which HotSpot's signal handler catches and translates seamlessly into a Java NullPointerException\u2014giving zero-cost null checking during normal non-null execution paths!

Instance methods represent the behavioral capabilities of the class. When an instance method is invoked via dot notation ('account.deposit(500);'), the JVM performs a method invocation using the 'invokevirtual' bytecode instruction. Crucially, every instance method in Java possesses an implicit, invisible first parameter named 'this'. When you call 'account.deposit(500)', the JVM passes the reference stored in 'account' as the hidden parameter 'this' into the deposit method frame on the call stack! Inside the deposit method, when you write 'balance += amount;', the JVM resolves 'balance' as 'this.balance', ensuring that the method mutates the exact heap object through which it was invoked. In the interactive lab below, we trace dot notation state mutations, field defaults, and multi-instance independence.""",
            "code": """public class DotNotationLab {
    public static class BankAccount {
        // Instance fields with default zero-initialization
        public int balance; // Default: 0
        public int transactionCount; // Default: 0

        // Instance method: 'this' reference is passed implicitly
        public void deposit(int amount) {
            // 'this.balance' explicitly targets this object's heap payload
            this.balance += amount;
            this.transactionCount++;
        }

        public int getBalance() {
            return this.balance;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== DOT NOTATION & STATE MUTATION LAB ===");

        BankAccount acc = new BankAccount();
        System.out.println("Initial State (Default values):");
        System.out.println("  acc.balance: $" + acc.balance); // 0
        System.out.println("  acc.transactionCount: " + acc.transactionCount); // 0

        // Mutating state via instance method:
        acc.deposit(350);
        acc.deposit(150);

        System.out.println("\\nState After Deposits:");
        System.out.println("  acc.getBalance(): $" + acc.getBalance()); // 500
        System.out.println("  acc.transactionCount: " + acc.transactionCount); // 2

        // Null Dereference Warning Demonstration:
        BankAccount nullAccount = null;
        System.out.println("\\nNull Pointer Simulation:");
        System.out.println("nullAccount reference value: " + nullAccount);
        // Attempting nullAccount.deposit(100) would trigger java.lang.NullPointerException!
    }
}""",
            "checks": [
                {
                    "question": "What does the Dot Notation operator ('.') physically perform in Java?",
                    "options": [
                        "It dereferences the reference pointer, navigating from the stack to the heap object to read/write a field or invoke a method",
                        "It creates a new database connection over the network",
                        "It converts an integer into a floating-point number",
                        "It compiles the class into machine assembly code"
                    ],
                    "answer": 0,
                    "explanation": "Dot notation is the dereference operator, following the pointer stored in a reference variable to access heap object members."
                },
                {
                    "question": "What runtime exception occurs if code attempts to use dot notation on a reference variable that holds 'null'?",
                    "options": [
                        "java.lang.NullPointerException (NPE)",
                        "java.lang.ArrayIndexOutOfBoundsException",
                        "java.lang.ArithmeticException",
                        "java.lang.ClassNotFoundException"
                    ],
                    "answer": 0,
                    "explanation": "Attempting to dereference a null reference triggers an immediate NullPointerException."
                },
                {
                    "question": "What is the default value of an uninitialized instance field of type 'int' on a newly instantiated heap object?",
                    "options": [
                        "0",
                        "null",
                        "undefined",
                        "Random garbage memory from previous programs"
                    ],
                    "answer": 0,
                    "explanation": "During the 'new' instruction, primitive integer fields are zero-initialized to 0."
                },
                {
                    "question": "What implicit parameter is automatically passed by the JVM to every non-static instance method?",
                    "options": [
                        "The 'this' reference, pointing to the specific heap object through which the method was invoked",
                        "A pointer to the operating system kernel",
                        "An array of command-line arguments",
                        "The current CPU clock frequency"
                    ],
                    "answer": 0,
                    "explanation": "Every instance method receives an implicit 'this' reference as parameter 0, pointing to the current object instance."
                }
            ]
        },
        {
            "title": "Production Lab: Engineering the BankAccount Financial State Machine",
            "content": """We culminate Day 16 of our Java Systems curriculum by engineering a production-grade BankAccount financial state machine. This exercise directly prepares you for the Day 16 Challenge: building a BankAccount class with an 'int balance' field, a 'void deposit(int amt)' method, and an 'int getBalance()' getter method that satisfies all strict production requirements.

In financial banking ledgers, ATM processors, and fintech payment backends, an account entity is the fundamental state machine representing a customer's liquid monetary holdings. When constructing this domain entity, production engineers design with rigorous defensive invariants:
1. Field Encapsulation & Initial State: The account state must maintain an 'int balance' field. In a fresh account instance, the balance starts at exactly 0.
2. The deposit(int amt) Mutation Contract: The deposit method accepts an integer parameter representing the incoming funds. When invoked, it mutates the object's instance state by accumulating the deposit amount into 'balance': 'balance += amt'. In real-world enterprise banking, the method must defensively reject non-positive deposits (such as depositing $0 or negative amounts) to prevent accounting anomalies or balance drain vulnerabilities.
3. The getBalance() Accessor Contract: The getter method returns the current value of 'balance' without mutating state, providing a deterministic read operation for audit logs, reporting engines, and downstream settlement pipelines.
4. Independent Instance Verification: Multiple BankAccount objects must operate completely independently in memory. If 'b1.deposit(500)' is called, only b1's balance changes to 500; a separate 'b2' instance created concurrently must retain its initial balance of 0 until deposited into.

In addition to financial accounts, this same object-oriented paradigm governs hardware, automotive, and IoT software engineering. Consider the Day 16 assignment domain: modeling a Car class. A vehicle maintains dynamic telemetry fields such as 'String model' and 'int speed'. When the engine accelerates, the 'speed' state updates. Accessor methods like 'getSpeed()' expose this velocity reading to dashboard displays and anti-lock braking controllers without exposing the raw memory pointers to outside interference.

To guarantee that your implementations conform to enterprise production criteria, we accompany both classes with a comprehensive test suite. The test harness evaluates four distinct execution phases:
- Phase 1 (Baseline Verification): Confirms that upon instantiation, an account has balance 0 and car speed reflects its initial configuration.
- Phase 2 (Sequential State Transitions): Executes multiple sequential deposits (e.g. 500 followed by 250), confirming that state accumulates linearly to 750 rather than overwriting previous values.
- Phase 3 (Multi-Tenant Isolation): Instantiates multiple distinct accounts in parallel (b1 and b2), mutates one instance, and asserts that the sibling instance remains untainted and isolated.
- Phase 4 (Static Verification Entrypoint): Implements 'Solution.testBank()' returning 'acc.getBalance()' after depositing 500, validating contract compliance for automated CI/CD runners.

In the interactive lab below, examine the complete production Solution class, run the verification harness, and establish full mastery over Java class blueprints, instance fields, and heap object lifecycles before tackling Day 17.""",
            "code": """// Production Solution conforming to Day 16 Challenge Specifications
class BankAccount {
    int balance = 0; // Instance field initialized to 0

    // Deposit method: mutates the instance state
    void deposit(int amt) {
        if (amt > 0) {
            balance += amt;
        }
    }

    // Getter method: returns the current balance
    int getBalance() {
        return balance;
    }
}

public class Solution {
    public static int testBank() {
        BankAccount acc = new BankAccount();
        acc.deposit(500);
        return acc.getBalance();
    }

    public static void main(String[] args) {
        System.out.println("=== DAY 16: BANKACCOUNT FINANCIAL STATE MACHINE LAB ===");

        // Verification 1: Initial state must be 0
        BankAccount b1 = new BankAccount();
        System.out.println("Test 1 - Initial Balance: $" + b1.getBalance() + " (Expected: 0)");

        // Verification 2: Sequential deposits on b1
        b1.deposit(500);
        System.out.println("Test 2 - After Deposit $500: $" + b1.getBalance() + " (Expected: 500)");

        b1.deposit(250);
        System.out.println("Test 3 - After Second Deposit $250: $" + b1.getBalance() + " (Expected: 750)");

        // Verification 3: Independent second instance b2
        BankAccount b2 = new BankAccount();
        b2.deposit(100);
        System.out.println("Test 4 - b2 Independent Balance: $" + b2.getBalance() + " (Expected: 100)");
        System.out.println("Test 5 - b1 Balance Unchanged: $" + b1.getBalance() + " (Expected: 750)");

        // Verification 4: Static helper testBank() method
        int result = testBank();
        System.out.println("\\nSolution.testBank() Result: $" + result + " (Expected: 500)");
        if (result == 500 && b1.getBalance() == 750 && b2.getBalance() == 100) {
            System.out.println(">>> ALL DAY 16 TEST ASSERTIONS VERIFIED SUCCESSFULLY! <<<");
        }
    }
}""",
            "checks": [
                {
                    "question": "In the Day 16 BankAccount class, what is the balance of a newly instantiated 'new BankAccount()' before any deposits occur?",
                    "options": [
                        "0, initialized explicitly or via default zero-initialization",
                        "null",
                        "500",
                        "-1"
                    ],
                    "answer": 0,
                    "explanation": "The int balance field starts at 0 upon object creation."
                },
                {
                    "question": "What is the resulting balance of 'b1' after executing 'b1.deposit(500); b1.deposit(250);'?",
                    "options": [
                        "750, because sequential deposits accumulate into the balance instance field (500 + 250)",
                        "250, because the second deposit overwrites the first",
                        "500",
                        "0"
                    ],
                    "answer": 0,
                    "explanation": "The deposit method uses 'balance += amt', accumulating each deposit into the existing balance."
                },
                {
                    "question": "If 'b1' and 'b2' are two separate BankAccount instances, why does calling 'b2.deposit(100)' have no effect on 'b1'?",
                    "options": [
                        "Because each object instance resides at a distinct memory address on the JVM heap with its own private 'balance' field",
                        "Because Java blocks second accounts from modifying balances",
                        "Because b2 runs on a separate operating system process",
                        "Because the balance field is static"
                    ],
                    "answer": 0,
                    "explanation": "Non-static instance fields belong exclusively to their respective heap object instances; modifying one cannot alter another."
                },
                {
                    "question": "What does the Solution.testBank() method return in the Day 16 implementation?",
                    "options": [
                        "500, from creating an account and depositing 500",
                        "0",
                        "750",
                        "null"
                    ],
                    "answer": 0,
                    "explanation": "testBank() creates a BankAccount, deposits 500, and returns acc.getBalance(), which evaluates to 500."
                }
            ]
        }
    ],
    "summary": [
        "A Class is a blueprint loaded into Metaspace; an Object is a concrete instance allocated on the JVM Heap.",
        "Reference variables on the thread Call Stack hold 64-bit/32-bit memory addresses pointing to heap object payloads.",
        "A Heap Object consists of an Object Header (Mark Word + Klass Word), Instance Data, and 8-byte Alignment Padding.",
        "The 'new' keyword compiles to three bytecode instructions: 'new' (allocates & zeroes RAM), 'dup' (duplicates pointer), and 'invokespecial' (runs <init> constructor).",
        "Dot notation dereferences reference pointers to access fields and methods; dereferencing a null pointer throws NullPointerException.",
        "Day 16 Challenge implements BankAccount with int balance, deposit(int amt), and getBalance(), verifying multi-instance isolation."
    ],
    "projectStep": {
        "title": "Build the BankAccount Financial State Machine",
        "steps": [
            "Define the BankAccount class with an instance field 'int balance = 0'.",
            "Implement the 'void deposit(int amt)' method accumulating positive deposits into the balance field.",
            "Implement the 'int getBalance()' getter method returning the current balance.",
            "Implement 'Solution.testBank()' instantiating BankAccount, depositing 500, and returning the balance.",
            "Execute the test harness verifying multi-instance state isolation across independent bank accounts."
        ]
    }
}
'''

with open('scripts/block4_day16.py', 'w', encoding='utf-8') as f:
    f.write(expanded_day16)

print("Wrote expanded block4_day16.py")
