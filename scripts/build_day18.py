# Day 18: Encapsulation, Access Modifiers, Defensive Setters & Invariant Protection

DAY_18 = {
    "day": 18,
    "title": "Encapsulation, Access Modifiers, Defensive Setters & Invariant Protection",
    "goal": "Master the first pillar of Object-Oriented Programming: Encapsulation and Information Hiding. Understand the four Java access modifiers (private, package-private, protected, public), the principle of least privilege, accessor/mutator conventions, defensive mutators, domain invariant gates, and implement production SecureAccount and Student GPA models.",
    "minutes": 25,
    "recap": "Yesterday we mastered constructors, atomic object creation, parameter shadowing resolution, and constructor chaining via this(...). Today, we conquer Encapsulation: discovering how to guard internal state against unauthorized mutation through access modifiers and defensive setters.",
    "parts": [
        {
            "title": "Encapsulation Foundations: Information Hiding, Cohesion & The Vulnerability of Public Fields",
            "content": """In enterprise software engineering and high-reliability systems architecture, the most vital and foundational pillar of Object-Oriented Programming is Encapsulation (also formally designated as Information Hiding or Data Abstraction). Encapsulation is the architectural practice of bundling data attributes (state) together with the methods that operate upon that data into a cohesive class unit, while strictly restricting direct external access to the internal representation of that state.

To understand why encapsulation is indispensable, consider what occurs when a software system exposes its domain state through Public Fields. Suppose an enterprise banking class declares 'public int balance;'. Because the field is public, any arbitrary caller from any thread, third-party library, or external service component can directly read and mutate that memory location using dot notation:
'account.balance = -500000; // Catastrophic State Corruption!'
'account.balance = Integer.MAX_VALUE; // Unauthorized Balance Injection!'

Notice the profound architectural vulnerabilities introduced by public fields:
1. Complete Loss of Invariant Control: The BankAccount class has zero ability to intercept, validate, or reject illegal values. A negative balance, a zero deposit, or an integer overflow can be injected directly into heap memory without triggering a single line of defensive validation logic.
2. Complete Bypass of Audit Trails: In regulatory financial systems (governed by Sarbanes-Oxley, PCI-DSS, or banking compliance laws), every state transition must be logged to an immutable audit journal with timestamps and user identifiers. Public fields can be mutated silently without executing any logging, security auditing, or metric emission pipelines.
3. Brittle Architectural Coupling: If internal representation changes—such as migrating 'int balance' to a 64-bit 'long balanceCents' or a BigDecimal object to handle high-precision multi-currency denominations—every external class that accessed 'account.balance' breaks immediately, requiring widespread, error-prone refactoring across hundreds of source files.

Encapsulation permanently eliminates these vulnerabilities by declaring internal fields 'private'. By making fields private, the class establishes a rigid, impermeable membrane around its heap memory. External classes cannot directly manipulate the raw bits; instead, they are forced to interact through well-defined, publicly exposed methods (getters and setters). This allows the class to act as an unyielding Gatekeeper: validating every mutation, enforcing business invariants, logging audit events, and insulating external clients from internal data structure refactoring.

At the JVM bytecode level, accessing a private field from outside its enclosing class is not just a high-level language convention; it is enforced by the JVM Bytecode Verifier. During class linking, the verifier inspects field access instructions ('getfield' and 'putfield') and checks access flags in the target class's Constant Pool. If an external bytecode attempts to execute 'putfield' against a private member, the JVM refuses to execute and throws a fatal 'java.lang.IllegalAccessError', providing rock-solid runtime memory protection. In the interactive lab below, we trace the stark architectural contrast between vulnerable public fields and encapsulated private state.""",
            "code": """public class EncapsulationFoundationsLab {
    // 1. VULNERABLE UNENCAPSULATED CLASS: Public Fields
    public static class VulnerableAccount {
        public int balance; // Anyone can set negative or invalid values!
    }

    // 2. ENCAPSULATED ROBUST CLASS: Private State with Validated Mutators
    public static class EncapsulatedAccount {
        private int balance; // Memory protected from external dot notation!

        public void deposit(int amount) {
            // Defensive Invariant Gate: Reject non-positive amounts
            if (amount <= 0) {
                System.out.println("  [REJECTED] Deposit must be positive. Attempted: $" + amount);
                return;
            }
            this.balance += amount;
            System.out.println("  [AUDIT] Deposited $" + amount + " -> Verified Balance: $" + this.balance);
        }

        public int getBalance() {
            return this.balance; // Controlled read access
        }
    }

    public static void main(String[] args) {
        System.out.println("=== ENCAPSULATION FOUNDATIONS LAB ===");

        // Demonstrating Vulnerability:
        VulnerableAccount vAcc = new VulnerableAccount();
        vAcc.balance = -999999; // Silent, catastrophic corruption!
        System.out.println("VulnerableAccount corrupted balance: $" + vAcc.balance);

        // Demonstrating Encapsulation Protection:
        EncapsulatedAccount eAcc = new EncapsulatedAccount();
        eAcc.deposit(500);
        eAcc.deposit(-200); // Safely intercepted and rejected!
        System.out.println("EncapsulatedAccount final balance: $" + eAcc.getBalance() + " (Protected: $500)");
    }
}""",
            "checks": [
                {
                    "question": "What is the primary architectural purpose of Encapsulation in Object-Oriented Programming?",
                    "options": [
                        "To hide internal object state behind private fields and expose controlled access through validated methods, preventing arbitrary corruption",
                        "To make Java programs run faster than C++ code",
                        "To store all Java classes on external network servers",
                        "To eliminate the need for writing unit tests"
                    ],
                    "answer": 0,
                    "explanation": "Encapsulation restricts direct field access, ensuring all state modifications pass through invariant validation gates."
                },
                {
                    "question": "Why are public fields considered a severe architectural vulnerability in enterprise domain entities?",
                    "options": [
                        "They allow external code to bypass validation rules and audit logging, and tightly couple external code to internal representations",
                        "They cause 64-bit CPUs to overheat during mathematical calculations",
                        "They prevent classes from importing standard library packages",
                        "They force the garbage collector to run continuously"
                    ],
                    "answer": 0,
                    "explanation": "Public fields allow unrestricted modification without validation or auditing, and create brittle coupling."
                },
                {
                    "question": "What runtime error is thrown by the JVM Bytecode Verifier if compiled bytecode attempts to directly access a private field from another class?",
                    "options": [
                        "java.lang.IllegalAccessError",
                        "java.lang.NullPointerException",
                        "java.lang.ArithmeticException",
                        "java.lang.IndexOutOfBoundsException"
                    ],
                    "answer": 0,
                    "explanation": "The JVM enforces accessibility rules at the bytecode layer, throwing IllegalAccessError if access modifiers are violated."
                },
                {
                    "question": "How does encapsulation support safe internal data structure refactoring without breaking external callers?",
                    "options": [
                        "Because external code depends only on public method signatures (getters/setters), the internal fields can be modified freely",
                        "The JVM automatically rewrites all external code on GitHub",
                        "It converts the class into an operating system service",
                        "It saves field values in a temporary JSON file"
                    ],
                    "answer": 0,
                    "explanation": "Hiding internal representation behind methods allows internal fields to change without altering public client contracts."
                }
            ]
        },
        {
            "title": "Java Access Modifiers: The Four Visibility Scopes (private, package-private, protected, public)",
            "content": """To implement encapsulation with granular architectural precision, the Java programming language provides four distinct Access Modifiers. Access modifiers are keywords placed on class declarations, instance fields, constructors, and methods that establish explicit visibility boundaries across packages, classes, and inheritance hierarchies. Understanding the exact visibility matrix of these four modifiers is a mandatory competency for professional Java software engineers.

Let us examine the Four Visibility Scopes in order from most restrictive to least restrictive:
1. 'private' (Class-Only Scope): The member is visible exclusively within the curly braces of the enclosing class in which it is declared. No outside class—not even classes residing in the exact same package, and not even direct subclasses—can see or access a private member. In accordance with the foundational Principle of Least Privilege, all instance variables should be declared 'private' by default unless a compelling architectural reason dictates broader exposure.
2. Package-Private / Default (Package Scope): When no access modifier keyword is specified (e.g., 'int balance;'), the member is granted Package-Private visibility. The member is accessible to all other classes residing within the exact same package directory, but is completely invisible to classes residing in any other package (even subclasses residing in external packages). Package-private visibility is heavily utilized by library authors to expose internal helper classes and package-level state machines while keeping them completely hidden from public API consumers.
3. 'protected' (Package + Inheritance Scope): The member is accessible to all classes residing in the same package, PLUS any subclasses residing in different packages via inheritance. Protected members enable subclasses to inherit and interact with internal state or specialized hook methods while preventing arbitrary external classes from manipulating those members.
4. 'public' (Universal World Scope): The member is accessible to all classes anywhere in the entire application, across all packages and modules. Public visibility should be reserved strictly for the published, stable API surface of a class—such as service interfaces, factory methods, and validated getter/setter accessors.

The Table of Access Visibility can be summarized as follows:
- private: Class = Yes | Package = No | Subclass (outside pkg) = No | World = No
- package-private: Class = Yes | Package = Yes | Subclass (outside pkg) = No | World = No
- protected: Class = Yes | Package = Yes | Subclass (outside pkg) = Yes | World = No
- public: Class = Yes | Package = Yes | Subclass (outside pkg) = Yes | World = Yes

Applying these modifiers correctly enforces clean separation of concerns and prevents architectural erosion over multi-year software lifecycles. In the interactive lab below, we trace these four visibility tiers and demonstrate how access rules are strictly enforced by the Java compiler.""",
            "code": """public class AccessModifiersLab {
    public static class VisibilityDemo {
        private int privateField = 10;       // Tier 1: Class only
        int packagePrivateField = 20;        // Tier 2: Same package only
        protected int protectedField = 30;   // Tier 3: Same package + Subclasses
        public int publicField = 40;         // Tier 4: Universal world access

        public void printInternalState() {
            // All members accessible internally within enclosing class:
            System.out.println("Internal Access:");
            System.out.println("  privateField: " + privateField);
            System.out.println("  packagePrivateField: " + packagePrivateField);
            System.out.println("  protectedField: " + protectedField);
            System.out.println("  publicField: " + publicField);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== JAVA ACCESS MODIFIERS VISIBILITY LAB ===");

        VisibilityDemo demo = new VisibilityDemo();
        demo.printInternalState();

        // Testing access from an external caller in the same package:
        System.out.println("\nExternal Same-Package Access:");
        System.out.println("  demo.packagePrivateField: " + demo.packagePrivateField + " (Accessible)");
        System.out.println("  demo.protectedField: " + demo.protectedField + " (Accessible)");
        System.out.println("  demo.publicField: " + demo.publicField + " (Accessible)");

        // Note: 'demo.privateField' would trigger a compilation error:
        // "privateField has private access in VisibilityDemo"
        System.out.println("  demo.privateField: [COMPILER BLOCKED - Private Access]");
    }
}""",
            "checks": [
                {
                    "question": "Which access modifier restricts member visibility strictly to the enclosing class in which it is declared?",
                    "options": [
                        "private",
                        "protected",
                        "public",
                        "package-private"
                    ],
                    "answer": 0,
                    "explanation": "The 'private' modifier guarantees that a member is visible and accessible only within its declaring class."
                },
                {
                    "question": "What is the visibility scope of a class member when no access modifier keyword is specified?",
                    "options": [
                        "Package-Private (accessible to all classes within the same package, but hidden from external packages)",
                        "Public (accessible everywhere)",
                        "Private (accessible only to that class)",
                        "Protected (accessible only to subclasses)"
                    ],
                    "answer": 0,
                    "explanation": "Omitting an access modifier defaults to package-private visibility, accessible only within the same package."
                },
                {
                    "question": "What is the Principle of Least Privilege as applied to Java class member access modifiers?",
                    "options": [
                        "Every class member should be assigned the most restrictive visibility possible (private by default), exposing only what is strictly necessary",
                        "All fields must be public so they can be easily tested",
                        "Only administrators should be allowed to run Java programs",
                        "Classes should never have more than 3 methods"
                    ],
                    "answer": 0,
                    "explanation": "Least privilege dictates granting the minimum necessary visibility to protect system invariants."
                },
                {
                    "question": "Can a subclass residing in package 'com.corp.billing' access a 'protected' field declared in package 'com.corp.core'?",
                    "options": [
                        "Yes, because protected members are accessible to subclasses even when residing in different packages",
                        "No, protected members can never be accessed outside their package",
                        "Only if the subclass is named Admin",
                        "Only during full moon cycles"
                    ],
                    "answer": 0,
                    "explanation": "Protected visibility explicitly grants access to subclasses across package boundaries."
                }
            ]
        },
        {
            "title": "Accessor and Mutator Mechanics: Controlled Read/Write Contracts via Getters and Setters",
            "content": """Once instance fields are securely encapsulated behind 'private' access modifiers, an application exposes controlled interactions with that state through Accessor Methods (Getters) and Mutator Methods (Setters). In enterprise software engineering, getter and setter methods are not mere mechanical boilerplate; they represent explicit, contractual operational boundaries that govern how external components read and transform internal domain state.

Java enterprise standards—including JavaBeans specifications, Spring Boot data binding, Jackson JSON mapping, and Hibernate ORM entities—mandate strict naming conventions for accessors and mutators:
1. Getter Convention (Accessor):
   - For standard fields (primitives and objects): 'public ReturnType getFieldName()' (e.g., 'public int getBalance()', 'public String getOwner()').
   - For boolean primitive fields: 'public boolean isFieldName()' (e.g., 'public boolean isActive()', 'public boolean isVerified()').
2. Setter Convention (Mutator):
   - 'public void setFieldName(ParameterType param)' (e.g., 'public void setBalance(int balance)', 'public void setOwner(String owner)').

Why are getters and setters vastly superior to direct field access?
- Fine-Grained Access Control: By providing a getter but omitting a setter, an engineer creates a Read-Only Property! The internal field can be initialized inside the constructor and read universally, but cannot be modified by any external caller. Conversely, omitting a getter while providing a setter creates a Write-Only Property (such as setting an encryption password or sensitive API key that should never be echoed back in cleartext).
- Computed (Virtual) Properties: A getter does not even need to map directly to an underlying heap field! For example, a class might maintain 'String firstName' and 'String lastName'. It can provide a computed getter 'public String getFullName() { return firstName + " " + lastName; }'. External callers consume 'fullName' as a clean attribute without the class needing to store redundant, synchronized duplicate strings in heap RAM.
- Logging, Auditing & Interception: Getters and setters provide centralized interception hooks. If a high-frequency trading platform needs to record every time an account balance is queried or adjusted, telemetry counters, distributed Jaeger trace spans, or audit logs can be placed inside the accessor methods without changing a single line of caller code.

In the interactive lab below, we trace standard JavaBeans accessor conventions, demonstrate read-only property design, and explore computed virtual properties.""",
            "code": """public class AccessorMutatorLab {
    public static class BankCustomer {
        // Encapsulated private state
        private String firstName;
        private String lastName;
        private int creditScore; // Read-only property (no setter!)
        private boolean active;

        public BankCustomer(String firstName, String lastName, int creditScore) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.creditScore = creditScore;
            this.active = true;
        }

        // Standard Getters & Setters conforming to JavaBeans standards:
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        // Read-Only Property: Getter provided, NO setter!
        public int getCreditScore() { return creditScore; }

        // Boolean convention: 'is...' instead of 'get...'
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }

        // Computed / Virtual Property: Evaluated dynamically!
        public String getFullName() {
            return firstName + " " + lastName;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== ACCESSOR & MUTATOR MECHANICS LAB ===");

        BankCustomer customer = new BankCustomer("Alice", "Smith", 780);

        System.out.println("Customer Full Name (Computed): " + customer.getFullName());
        System.out.println("Credit Score (Read-Only):      " + customer.getCreditScore());
        System.out.println("Account Active Status:         " + customer.isActive());

        // Modifying state via validated setter:
        customer.setLastName("Johnson");
        System.out.println("
After Name Update via Setter:");
        System.out.println("Customer Full Name (Computed): " + customer.getFullName());
    }
}""",
            "checks": [
                {
                    "question": "What is the standard JavaBeans naming convention for a getter method returning a boolean primitive field named 'active'?",
                    "options": [
                        "public boolean isActive()",
                        "public boolean getActive()",
                        "public boolean checkActive()",
                        "public boolean booleanActive()"
                    ],
                    "answer": 0,
                    "explanation": "The JavaBeans specification explicitly mandates the 'isFieldName()' naming convention for boolean accessors."
                },
                {
                    "question": "How does an engineer create a Read-Only property on an encapsulated class?",
                    "options": [
                        "By declaring the field private and providing a public getter method, but deliberately omitting any public setter method",
                        "By writing the code in read-only mode in VS Code",
                        "By setting the file permissions of the .java file to chmod 444",
                        "By naming the class ReadOnly"
                    ],
                    "answer": 0,
                    "explanation": "Exposing a getter without exposing a setter prevents external modification, establishing a read-only property."
                },
                {
                    "question": "What is a Computed (Virtual) Property in Java class design?",
                    "options": [
                        "A getter method that dynamically calculates and returns a value on the fly without storing it in a dedicated instance field",
                        "A property that runs on a cloud quantum computer",
                        "A property that can only be called from inside a Docker container",
                        "A variable that is deleted by the garbage collector immediately"
                    ],
                    "answer": 0,
                    "explanation": "Computed properties (like getFullName()) compute their return value dynamically from existing state."
                },
                {
                    "question": "In the Day 18 SecureAccount challenge, what getter method must be exposed to read the balance?",
                    "options": [
                        "public int getBalance()",
                        "public int readBalance()",
                        "public int fetch()",
                        "public int balance()"
                    ],
                    "answer": 0,
                    "explanation": "The challenge specifies 'getBalance() getter' returning the private int balance field."
                }
            ]
        },
        {
            "title": "Defensive Mutators & Invariant Protection: Rejecting Illegal State Transitions",
            "content": """The crowning achievement of encapsulation is the ability to author Defensive Mutators. A naive setter that blindly assigns its parameter to an internal field (e.g., 'public void setBalance(int b) { this.balance = b; }') is scarcely better than a public field: it still permits callers to corrupt the object's internal domain state. A true enterprise mutator functions as a Defensive Gatekeeper: it evaluates incoming data against domain invariants, accepting valid state transitions while rejecting or neutralizing illegal mutations.

In systems engineering, there are two primary defensive strategies for handling illegal input inside mutators:
1. The Fail-Fast Exception Strategy: If a parameter violates domain constraints, the mutator immediately throws an unchecked exception (typically 'IllegalArgumentException'). This strategy is strongly preferred in transactional pipelines, user authentication, and financial trading engines:
'public void setGpa(double gpa) {'
'    if (gpa < 0.0 || gpa > 4.0) {'
'        throw new IllegalArgumentException("GPA out of range [0.0, 4.0]: " + gpa);'
'    }'
'    this.gpa = gpa;'
'}'
By failing immediately with an informative exception message, the system prevents invalid data from silently propagating through database tables and analytics engines.
2. The Safe Interception / Rejection Strategy: In event-driven streaming, UI input forms, or ledger deposit operations where rejecting invalid input should not crash the calling thread, the mutator simply ignores illegal inputs or logs a warning, leaving the existing state pristine and uncorrupted:
'public void deposit(int amt) {'
'    if (amt > 0) {'
'        this.balance += amt; // Safely process valid positive deposits'
'    }'
'    // If amt <= 0, silently ignore or log; balance remains untouched!'
'}'

Notice how the Day 18 challenge specifications leverage both strategies:
- In 'SecureAccount': 'deposit(int amt) ignoring negatives'. If a caller attempts to deposit $-100 or $0, the method ignores the input, ensuring balance cannot be diminished or corrupted.
- In 'Student': 'setGpa(double g) within [0.0, 4.0]'. If a caller attempts to set a GPA of 4.5 or -1.0, the setter rejects the value, ensuring GPA strictly remains between 0.0 and 4.0.

By embedding invariant validation directly inside mutators, domain entities become Self-Defending State Machines. Even if a hundred different microservice endpoints or client controllers interact with the entity, the entity guarantees that its internal state remains valid, consistent, and audit-compliant at all times. In the interactive lab below, we trace defensive mutators and verify invariant enforcement across edge cases.""",
            "code": """public class DefensiveMutatorsLab {
    // Self-Defending Student Entity with GPA Invariant [0.0, 4.0]
    public static class Student {
        private String name;
        private double gpa; // Invariant: Must always be between 0.0 and 4.0

        public Student(String name, double initialGpa) {
            this.name = name;
            setGpa(initialGpa); // Route through defensive setter!
        }

        public double getGpa() {
            return this.gpa;
        }

        // Defensive Setter: Strictly enforces range invariant [0.0, 4.0]
        public void setGpa(double g) {
            if (g >= 0.0 && g <= 4.0) {
                this.gpa = g;
                System.out.println("  [VALIDATED] " + name + " GPA updated to: " + this.gpa);
            } else {
                System.out.println("  [REJECTED] Out-of-bounds GPA: " + g + " (State preserved at: " + this.gpa + ")");
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== DEFENSIVE MUTATORS & INVARIANT PROTECTION LAB ===");

        Student student = new Student("Vinay", 3.8);
        System.out.println("Initial GPA: " + student.getGpa()); // 3.8

        // Attempting Out-of-Bounds Mutations:
        student.setGpa(4.5);  // REJECTED: > 4.0
        student.setGpa(-1.2); // REJECTED: < 0.0

        // Invariant Preserved:
        System.out.println("
Final Preserved GPA: " + student.getGpa() + " (Expected: 3.8)");

        // Valid In-Bounds Mutation:
        student.setGpa(3.95); // ACCEPTED
        System.out.println("Updated Valid GPA:   " + student.getGpa() + " (Expected: 3.95)");
    }
}""",
            "checks": [
                {
                    "question": "In the Day 18 Student class, what condition must be true for setGpa(double g) to update the gpa field?",
                    "options": [
                        "g must be between 0.0 and 4.0 inclusive (g >= 0.0 && g <= 4.0)",
                        "g must be strictly greater than 100.0",
                        "g must be an integer",
                        "g must be negative"
                    ],
                    "answer": 0,
                    "explanation": "The assignment specifies that setGpa(g) updates gpa only if g is between 0.0 and 4.0 inclusive."
                },
                {
                    "question": "In the Day 18 SecureAccount challenge, what occurs when 'acc.deposit(-100)' is executed?",
                    "options": [
                        "The negative deposit is ignored, leaving the balance completely unchanged",
                        "The balance is decremented by 100",
                        "The program crashes with an OutOfMemoryError",
                        "The balance becomes zero"
                    ],
                    "answer": 0,
                    "explanation": "SecureAccount's deposit method ignores non-positive values, protecting existing balance state."
                },
                {
                    "question": "What is the primary architectural benefit of routing constructor initialization through defensive setters?",
                    "options": [
                        "It ensures that initial values pass through the exact same invariant validation logic as subsequent runtime updates",
                        "It speeds up database network connections",
                        "It reduces the size of the JVM Metaspace",
                        "It automatically translates Java into JavaScript"
                    ],
                    "answer": 0,
                    "explanation": "Calling setters from constructors centralizes invariant validation, preventing unvalidated state at creation time."
                },
                {
                    "question": "Why is the Safe Interception strategy (ignoring invalid inputs) favored over crashing in UI forms and ledger deposits?",
                    "options": [
                        "It maintains system resilience by preserving valid state without disrupting user workflows or terminating worker threads",
                        "Because throwing exceptions damages the computer CPU",
                        "Because Java does not support exceptions in financial code",
                        "Because exceptions cannot be logged"
                    ],
                    "answer": 0,
                    "explanation": "Safe interception preserves internal state without crashing execution, maximizing system availability."
                }
            ]
        },
        {
            "title": "Production Lab: Engineering SecureAccount and Student GPA Defensive Models",
            "content": """We culminate Day 18 of our Java Systems curriculum by engineering production-grade implementations of the SecureAccount and Student GPA models. This lab directly implements the requirements of the Day 18 Challenge: creating a SecureAccount class with a private 'int balance = 0' field, a 'public int getBalance()' getter method, and a 'public void deposit(int amt)' method that adds 'amt' to balance only when positive (ignoring zero and negative values). Furthermore, we implement the Day 18 Assignment model: creating a Student class with a private 'double gpa' field, a validated 'setGpa(double g)' mutator enforcing the [0.0, 4.0] range invariant, and a 'getGpa()' getter accessor.

In enterprise software engineering—spanning banking backends, academic records registries, and regulatory compliance engines—encapsulated entities like SecureAccount and Student represent the ultimate gold standard of resilient domain modeling. When constructing these entities, production engineers enforce four non-negotiable architectural invariants:
1. Strict Private Field Enclosure: All instance variables ('balance' and 'gpa') must be declared with explicit 'private' visibility. Under no circumstances should package-private or public fields be permitted, guaranteeing that no external class can bypass the invariant gates.
2. Invariant Gate Verification in Mutators:
   - In SecureAccount: 'deposit(int amt)' checks 'if (amt > 0) balance += amt;'. If 'amt' is negative or zero, the method exits cleanly without mutating 'balance'.
   - In Student: 'setGpa(double g)' checks 'if (g >= 0.0 && g <= 4.0) this.gpa = g;'. If 'g' falls outside [0.0, 4.0], the mutation is rejected and 'gpa' remains untouched.
3. Accessor Purity: Getters ('getBalance()' and 'getGpa()') must be pure, non-mutating functions that return the current state without side effects, ensuring idempotent reads for audit trails and monitoring dashboards.
4. Comprehensive Automated Test Harness: Production systems accompany encapsulated entities with exhaustive test suites that deliberately attempt every adversarial input permutation: positive deposits, negative deposits, zero deposits, sequential valid deposits, out-of-bounds high GPAs (4.5), out-of-bounds low GPAs (-0.5), boundary GPAs (0.0 and 4.0), and valid interior GPAs (3.8).

In our canonical Solution class below, we provide the complete implementation conforming to the Day 18 Challenge and Assignment specifications, accompanied by an exhaustive automated test harness. In the interactive lab below, examine the implementation, run the verification harness, and establish complete mastery over Java encapsulation, access modifiers, and defensive mutators before advancing to Inheritance in Day 19.""",
            "code": """// Production Solution conforming to Day 18 Challenge Specifications
class SecureAccount {
    // Encapsulated private state: Cannot be touched directly from outside
    private int balance = 0;

    // Public getter: Controlled read access
    public int getBalance() {
        return balance;
    }

    // Defensive mutator: Adds to balance only when positive (> 0), ignoring negatives/zero
    public void deposit(int amt) {
        if (amt > 0) {
            balance += amt;
        }
    }
}

// Assignment Domain: Student entity with GPA Invariant [0.0, 4.0]
class Student {
    private double gpa = 0.0;

    public double getGpa() {
        return gpa;
    }

    // Defensive mutator: Sets gpa only if between 0.0 and 4.0 inclusive
    public void setGpa(double g) {
        if (g >= 0.0 && g <= 4.0) {
            this.gpa = g;
        }
    }
}

public class Solution {
    // Challenge verification entrypoint: Deposits 200, attempts -50, returns balance
    public static int test() {
        SecureAccount a = new SecureAccount();
        a.deposit(200);
        a.deposit(-50); // Must be safely rejected!
        return a.getBalance(); // Expected: 200
    }

    // Assignment verification entrypoint: Sets GPA to 3.8 and returns it
    public static double testStudent() {
        Student s = new Student();
        s.setGpa(3.8);
        return s.getGpa(); // Expected: 3.8
    }

    public static void main(String[] args) {
        System.out.println("=== DAY 18: SECUREACCOUNT & STUDENT GPA DEFENSIVE LAB ===");

        // Test 1: Solution.test() must return 200
        int bankResult = test();
        System.out.println("Test 1 - Solution.test() Result: $" + bankResult + " (Expected: 200)");
        if (bankResult != 200) throw new AssertionError("Test 1 Failed: Negative deposit was not rejected!");

        // Test 2: SecureAccount thorough boundary testing
        SecureAccount acc = new SecureAccount();
        if (acc.getBalance() != 0) throw new AssertionError("Initial balance must be 0");
        acc.deposit(300);
        if (acc.getBalance() != 300) throw new AssertionError("Deposit 300 must result in 300");
        acc.deposit(-100); // Negative rejection
        if (acc.getBalance() != 300) throw new AssertionError("Negative deposit must leave balance unchanged (300)");
        acc.deposit(0);    // Zero rejection
        if (acc.getBalance() != 300) throw new AssertionError("Zero deposit must leave balance unchanged (300)");

        // Test 3: Student GPA thorough boundary testing
        double studentResult = testStudent();
        System.out.println("Test 2 - Solution.testStudent() Result: " + studentResult + " (Expected: 3.8)");
        if (studentResult != 3.8) throw new AssertionError("Test 2 Failed: GPA 3.8 failed");

        Student s2 = new Student();
        s2.setGpa(4.5); // Out of bounds (> 4.0)
        if (s2.getGpa() != 0.0) throw new AssertionError("Invalid GPA 4.5 must be rejected and remain 0.0");
        s2.setGpa(-0.5); // Out of bounds (< 0.0)
        if (s2.getGpa() != 0.0) throw new AssertionError("Negative GPA -0.5 must be rejected and remain 0.0");
        s2.setGpa(4.0); // Upper boundary
        if (s2.getGpa() != 4.0) throw new AssertionError("Boundary GPA 4.0 must be accepted");

        System.out.println("\n>>> ALL DAY 18 TEST HARNESS ASSERTIONS VERIFIED CLEANLY! <<<");
    }
}""",
            "checks": [
                {
                    "question": "In the Day 18 Solution.test() method, what is the return value of depositing 200 followed by -50?",
                    "options": [
                        "200, because the negative deposit (-50) is safely ignored by the defensive guard clause",
                        "150",
                        "-50",
                        "0"
                    ],
                    "answer": 0,
                    "explanation": "deposit(amt) ignores negative amounts; the balance remains at 200."
                },
                {
                    "question": "What is the initial balance of a newly instantiated SecureAccount() before any deposits?",
                    "options": [
                        "0",
                        "null",
                        "100",
                        "-1"
                    ],
                    "answer": 0,
                    "explanation": "The private int balance field is initialized to 0 upon instantiation."
                },
                {
                    "question": "What happens if a Student object with GPA 0.0 executes 's.setGpa(4.5)' in Day 18?",
                    "options": [
                        "The mutation is rejected because 4.5 > 4.0, and the GPA remains at 0.0",
                        "The GPA is clamped to 4.0",
                        "The GPA becomes 4.5",
                        "An exception crashes the thread"
                    ],
                    "answer": 0,
                    "explanation": "The condition 'g >= 0.0 && g <= 4.0' evaluates to false; the field is not updated and remains 0.0."
                },
                {
                    "question": "Why must the balance field in SecureAccount be declared 'private' rather than 'public'?",
                    "options": [
                        "To prevent outside code from directly assigning negative or arbitrary values without passing through deposit()",
                        "To make the field accessible across different computers",
                        "Because Java does not permit public integers",
                        "To reduce the memory size of the integer from 4 bytes to 2 bytes"
                    ],
                    "answer": 0,
                    "explanation": "Private fields enforce encapsulation, preventing callers from bypassing validation logic."
                }
            ]
        }
    ],
    "summary": [
        "Encapsulation binds state and behavior into a cohesive class while strictly hiding internal state behind access modifiers.",
        "Public fields expose domain entities to arbitrary corruption, bypass audit trails, and create brittle coupling.",
        "Java provides four visibility scopes: private (class), package-private (package), protected (package+subclasses), public (world).",
        "The Principle of Least Privilege mandates declaring all instance variables private by default.",
        "Accessors (getters) and Mutators (setters) establish explicit contracts, enabling read-only properties, virtual properties, and auditing.",
        "Day 18 Challenge implements SecureAccount with private balance and deposit(amt) ignoring negatives, and Student with GPA in [0.0, 4.0]."
    ],
    "projectStep": {
        "title": "Build SecureAccount and Student GPA Defensive Models",
        "steps": [
            "Declare SecureAccount with an encapsulated 'private int balance = 0' field.",
            "Implement 'public int getBalance()' returning the balance field.",
            "Implement 'public void deposit(int amt)' with a defensive guard accumulating only when amt > 0.",
            "Declare Student with 'private double gpa' and validated 'setGpa(double g)' enforcing the [0.0, 4.0] range invariant.",
            "Implement 'Solution.test()' and execute the automated test harness verifying negative rejection and boundary validation."
        ]
    }
}
