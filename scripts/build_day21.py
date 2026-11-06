# Day 21: Interfaces, Abstract Contracts & ⭐ MILESTONE 4: Payment Gateway Engine

DAY_21 = {
    "day": 21,
    "title": "Interfaces, Abstract Contracts & ⭐ MILESTONE 4: Payment Gateway Engine",
    "goal": "Master Java Interfaces and Contract-Driven Architecture. Understand interface declarations, the implements keyword, default/static interface methods, multiple interface implementation, decoupling caller pipelines from concrete implementations, and engineer the Milestone 4 Enterprise Payment Gateway Engine.",
    "minutes": 25,
    "recap": "Yesterday we concluded Block 4 with Polymorphism, dynamic method dispatch, and V-Tables. Today, we step into Block 5 with our Milestone 4 Capstone: discovering how Interfaces decouple enterprise software architecture by defining pure behavioral contracts.",
    "parts": [
        {
            "title": "Interface Architecture: Pure Behavioral Contracts & Multiple Inheritance of Type",
            "content": """In modern enterprise software engineering, building large-scale, multi-team distributed systems requires an architectural discipline known as Contract-Driven Architecture (or Programming to an Interface, Not an Implementation). When software modules depend directly on concrete classes, they become tightly coupled to specific implementation details, making it nearly impossible to swap database providers, upgrade payment processors, or write automated unit test harnesses with mock objects. Java resolves this structural dilemma through one of its most powerful constructs: The Interface.

An Interface in Java is an architectural contract—a pure specification of behavior that declares what operations an entity must support, without specifying how those operations are implemented. Written using the 'interface' keyword, an interface defines method signatures (method name, parameter types, and return type) but provides no method bodies (curly braces) for standard methods. Every method declared in an interface is implicitly 'public' and 'abstract' by default, meaning it represents an open, universal requirement that any implementing class must satisfy. Furthermore, any fields declared in an interface are implicitly 'public static final'—they are compile-time constants stored in Metaspace, not instance variables on the heap!

Crucially, interfaces solve the fundamental limitation of single class inheritance: Multiple Inheritance of Type! Recall from Day 19 that Java strictly prohibits multiple class inheritance ('class A extends B, C') to eliminate the Diamond Problem of state and method conflicts. Interfaces, however, contain NO mutable instance state! Because an interface has no instance fields on the heap, allowing a class to implement multiple interfaces ('class PaymentService implements PaymentGateway, Auditable, Serializable') introduces zero memory collision risk! A class can inherit type contracts from dozens of interfaces simultaneously, allowing it to fulfill multiple architectural roles in the ecosystem.

At the JVM bytecode layer, invocations on interface references are executed through a specialized bytecode instruction: 'invokeinterface'. Unlike 'invokevirtual'—which indexes into a class's linear V-Table at a compile-time fixed offset—an interface method can reside at completely different V-Table indices across unrelated implementing classes! To handle this dynamic variability, the JVM uses Interface Method Tables (ITables). The HotSpot runtime maintains an ITable for each class, performing fast sub-table hashing to resolve the method entry pointer in just a few CPU cycles. In the interactive lab below, we trace interface syntax, explore contract definitions, and verify multiple interface implementation.""",
            "code": """public class InterfaceArchitectureLab {
    // Contract 1: Payment processing capability
    public interface PaymentGateway {
        // Implicitly 'public abstract': Declares what, not how!
        boolean processPayment(double amount);
    }

    // Contract 2: Audit logging capability
    public interface Auditable {
        void logAuditTrail(String action);
    }

    // Concrete Class: Implements MULTIPLE interface contracts simultaneously!
    public static class CryptoGateway implements PaymentGateway, Auditable {
        @Override
        public boolean processPayment(double amount) {
            if (amount > 0) {
                logAuditTrail("Processed Crypto Payment of $" + amount);
                return true;
            }
            logAuditTrail("Rejected Non-Positive Payment: $" + amount);
            return false;
        }

        @Override
        public void logAuditTrail(String action) {
            System.out.println("  [AUDIT-LEDGER] " + action);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== INTERFACE ARCHITECTURE & MULTIPLE CONTRACTS LAB ===");

        // Polymorphic Interface Reference:
        PaymentGateway gateway = new CryptoGateway();

        System.out.println("Testing Payment Valid ($150.0): " + gateway.processPayment(150.0));
        System.out.println("Testing Payment Invalid (-20.0): " + gateway.processPayment(-20.0));

        // Verifying Multiple Contract Types:
        System.out.println("\nType Assertions:");
        System.out.println("gateway instanceof PaymentGateway: " + (gateway instanceof PaymentGateway)); // true
        System.out.println("gateway instanceof Auditable:      " + (gateway instanceof Auditable));      // true
    }
}""",
            "checks": [
                {
                    "question": "What is the primary architectural purpose of an Interface in Java?",
                    "options": [
                        "To define a pure behavioral contract of method signatures without implementation, decoupling callers from concrete classes",
                        "To allocate temporary variables on the GPU",
                        "To speed up compilation times by skipping syntax checks",
                        "To replace the need for the Java Virtual Machine"
                    ],
                    "answer": 0,
                    "explanation": "Interfaces specify behavioral contracts, allowing callers to program to abstractions rather than concrete classes."
                },
                {
                    "question": "What are the implicit modifiers automatically applied to methods and fields declared in a standard Java interface?",
                    "options": [
                        "Methods are implicitly 'public abstract'; fields are implicitly 'public static final'",
                        "Methods are private; fields are protected",
                        "Methods are synchronized; fields are volatile",
                        "Methods are static; fields are transient"
                    ],
                    "answer": 0,
                    "explanation": "Interface methods are public abstract by default; interface variables are public static final constants."
                },
                {
                    "question": "Why does Java permit a class to implement multiple interfaces while forbidding multiple class inheritance?",
                    "options": [
                        "Because interfaces do not maintain mutable instance state on the heap, eliminating the Diamond Problem of state conflict",
                        "Because interfaces only run on weekend batch jobs",
                        "Because interfaces are converted into C++ structs",
                        "Because interfaces use less internet bandwidth"
                    ],
                    "answer": 0,
                    "explanation": "Without mutable instance fields, implementing multiple interfaces carries no state collision risks."
                },
                {
                    "question": "What JVM bytecode instruction is emitted when an interface method is invoked through an interface reference variable?",
                    "options": [
                        "invokeinterface",
                        "invokevirtual",
                        "invokestatic",
                        "invokespecial"
                    ],
                    "answer": 0,
                    "explanation": "invokeinterface is the specialized JVM instruction for dispatching methods declared in interfaces via ITables."
                }
            ]
        },
        {
            "title": "The 'implements' Keyword: Contract Realization & Compiler Enforcement",
            "content": """When a concrete class commits to fulfilling an interface contract, it uses the 'implements' keyword in its class declaration (e.g., 'class CryptoGateway implements PaymentGateway'). The 'implements' keyword creates a binding legal covenant between the class and the Java compiler: the class promises that it will provide concrete method bodies for every single abstract method declared within the interface.

Compiler Enforcement of the Implementation Covenant:
1. Complete Method Realization: If a class claims to implement an interface but fails to implement even a single abstract method declared in that interface, the Java compiler immediately halts compilation with an error: 'CryptoGateway is not abstract and does not override abstract method processPayment(double) in PaymentGateway'. The only legal exception is if the class itself is declared 'abstract'—in which case it defers implementation to its concrete subclasses.
2. Mandatory 'public' Visibility: In Java, an overriding method cannot assign weaker access privileges than the method it overrides. Because all interface methods are implicitly 'public', EVERY implementing method in the concrete class MUST be explicitly declared 'public'! If an engineer forgets 'public' (e.g. writing 'boolean processPayment(double amount) { ... }' with package-private access), javac rejects the code with: 'cannot reduce the visibility of the inherited method from PaymentGateway'.
3. The '@Override' Annotation: While not syntactically mandatory, marking implementing methods with '@Override' is a universal enterprise standard. It confirms to the compiler that the method is fulfilling an interface contract and catches any signature discrepancies immediately.

Why does compiler-enforced contract realization matter in mission-critical software? Because it eliminates runtime surprises. In dynamic languages (such as JavaScript or Python), if a class forgets to implement an expected method, the application crashes at runtime with an 'AttributeError: object has no attribute' when a customer triggers that specific execution path in production! In Java, contract compliance is verified 100% statically at compile time. If a class compiles, you have mathematical certainty that every required method exists, accepts the correct parameter types, and returns the expected return type. In the interactive lab below, we trace contract realization and verify compiler visibility enforcement.""",
            "code": """public class ContractRealizationLab {
    // Interface Contract
    public interface PaymentGateway {
        boolean processPayment(double amount);
    }

    // Concrete Realization: Fulfills contract
    public static class CryptoGateway implements PaymentGateway {
        // MANDATORY 'public' keyword: Cannot reduce interface visibility!
        @Override
        public boolean processPayment(double amount) {
            // Business Rule: Accept positive amounts, reject zero or negative
            if (amount > 0) {
                System.out.println("  [CryptoGateway] Successfully processed crypto transfer: $" + amount);
                return true;
            }
            System.out.println("  [CryptoGateway] Payment rejected: Amount must be positive ($" + amount + ")");
            return false;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== CONTRACT REALIZATION & COMPILER ENFORCEMENT LAB ===");

        PaymentGateway gateway = new CryptoGateway();

        // Testing positive deposit
        boolean test1 = gateway.processPayment(100.0);
        System.out.println("Payment $100.0 Result: " + test1 + " (Expected: true)");

        // Testing zero deposit
        boolean test2 = gateway.processPayment(0.0);
        System.out.println("Payment $0.0 Result:   " + test2 + " (Expected: false)");

        // Testing negative deposit
        boolean test3 = gateway.processPayment(-50.0);
        System.out.println("Payment -$50.0 Result: " + test3 + " (Expected: false)");
    }
}""",
            "checks": [
                {
                    "question": "What access modifier MUST be used when implementing a method from an interface in a concrete class?",
                    "options": [
                        "public",
                        "protected",
                        "package-private (default)",
                        "private"
                    ],
                    "answer": 0,
                    "explanation": "Because interface methods are implicitly public, implementing methods must be declared public to avoid reducing visibility."
                },
                {
                    "question": "What compiler error occurs if a non-abstract class implements an interface but fails to provide a body for one of its methods?",
                    "options": [
                        "The compiler refuses to build, reporting that the class does not override the abstract method",
                        "The compiler generates an empty method automatically",
                        "The class compiles but crashes when launched",
                        "The missing method is replaced by System.out.println()"
                    ],
                    "answer": 0,
                    "explanation": "Concrete classes must implement all abstract methods; failure to do so halts compilation."
                },
                {
                    "question": "What is the only type of class that can implement an interface without providing concrete method bodies for its methods?",
                    "options": [
                        "An abstract class, which defers concrete realization to its subclasses",
                        "A final class",
                        "A singleton class",
                        "A static utility class"
                    ],
                    "answer": 0,
                    "explanation": "Abstract classes can implement interfaces partially or defer implementation to downstream concrete subclasses."
                },
                {
                    "question": "In the Day 21 Challenge, what return value must CryptoGateway.processPayment(double amount) produce for an amount of 100.0 vs -50.0?",
                    "options": [
                        "true for 100.0 (positive amount); false for -50.0 (negative amount)",
                        "false for both",
                        "true for both",
                        "Throws an ArithmeticException"
                    ],
                    "answer": 0,
                    "explanation": "The challenge specification requires processPayment to return true when amount is positive (> 0) and false otherwise."
                }
            ]
        },
        {
            "title": "Decoupled Systems Architecture & Dependency Inversion Principle (DIP)",
            "content": """The supreme architectural value of interfaces is codified in the final principle of the SOLID framework: The Dependency Inversion Principle (DIP). Formulated by Robert C. Martin, the Dependency Inversion Principle states:
1. High-level modules should not depend upon low-level modules. Both should depend upon abstractions (interfaces).
2. Abstractions should not depend upon details. Details (concrete implementations) should depend upon abstractions.

To understand why Dependency Inversion is transformative, consider the disastrous Anti-Pattern of Direct Coupling. Suppose an enterprise OrderCheckoutService directly instantiates and calls 'CryptoGateway gateway = new CryptoGateway();'. Now, the high-level business checkout service is hard-coded to cryptocurrency! If the company signs a partnership with Stripe or PayPal tomorrow, developers must open OrderCheckoutService, delete CryptoGateway, rewrite class fields, and re-test the entire checkout engine. If the cryptocurrency network goes down, the checkout service cannot switch to a backup gateway dynamically.

Under Dependency Inversion, the OrderCheckoutService depends strictly on the abstraction:
'public class OrderCheckoutService {'
'    private final PaymentGateway gateway; // Depends on INTERFACE, not concrete class!'
'    public OrderCheckoutService(PaymentGateway gateway) {'
'        this.gateway = gateway; // Injected via constructor!'
'    }'
'    public boolean checkout(double total) {'
'        return gateway.processPayment(total); // Polymorphic execution!'
'    }'
'}'

Notice the extraordinary architectural superpowers unlocked by this decoupled design:
- Interchangeable Plug-and-Play Implementations: At runtime, the checkout service can be supplied with a 'CryptoGateway', a 'StripeGateway', a 'PayPalGateway', or an 'ApplePayGateway'. The checkout service operates identically without changing a single line of code!
- Lightning-Fast Automated Unit Testing: In automated test suites, testing live credit cards or blockchain networks is slow, expensive, and unreliable. Because the service depends on the interface, test suites can inject a 'MockPaymentGateway' that returns deterministic responses in memory in sub-millisecond time, achieving 100% test coverage with zero external dependencies.

This is the architectural philosophy that underpins all modern enterprise frameworks, including Spring Boot, Micronaut, and Jakarta EE. In the interactive lab below, we trace Dependency Inversion by wiring interchangeable gateways into a unified checkout service.""",
            "code": """public class DependencyInversionLab {
    // Abstraction
    public interface PaymentGateway {
        boolean processPayment(double amount);
    }

    // Concrete Implementation A: Crypto
    public static class CryptoGateway implements PaymentGateway {
        @Override
        public boolean processPayment(double amount) {
            System.out.println("  [Blockchain] Processing $" + amount + " via Crypto network...");
            return amount > 0;
        }
    }

    // Concrete Implementation B: Credit Card (Swappable!)
    public static class StripeGateway implements PaymentGateway {
        @Override
        public boolean processPayment(double amount) {
            System.out.println("  [Stripe] Processing $" + amount + " via Visa/Mastercard network...");
            return amount > 0;
        }
    }

    // High-Level Service: Depends ONLY on PaymentGateway abstraction!
    public static class CheckoutService {
        private final PaymentGateway gateway;

        // Dependency Injection via constructor:
        public CheckoutService(PaymentGateway gateway) {
            this.gateway = gateway;
        }

        public void completeOrder(double total) {
            boolean success = gateway.processPayment(total);
            System.out.println("Order status: " + (success ? "APPROVED" : "DECLINED"));
        }
    }

    public static void main(String[] args) {
        System.out.println("=== DEPENDENCY INVERSION & DECOUPLED ARCHITECTURE LAB ===");

        // Production Setup 1: Running with Crypto
        System.out.println("Deployment 1: Customer selects Crypto Gateway:");
        CheckoutService cryptoCheckout = new CheckoutService(new CryptoGateway());
        cryptoCheckout.completeOrder(250.0);

        // Production Setup 2: Seamlessly swapping to Stripe with ZERO service changes!
        System.out.println("\nDeployment 2: Customer selects Stripe Gateway:");
        CheckoutService stripeCheckout = new CheckoutService(new StripeGateway());
        stripeCheckout.completeOrder(250.0);

        System.out.println("\nDependency Inversion verified: Implementations swapped seamlessly!");
    }
}""",
            "checks": [
                {
                    "question": "What is the core premise of the Dependency Inversion Principle (DIP)?",
                    "options": [
                        "High-level business logic should depend on abstractions (interfaces) rather than concrete implementation classes",
                        "Variables must be declared in reverse alphabetical order",
                        "All methods must invert their boolean return values",
                        "Subclasses must inherit from at least five interfaces"
                    ],
                    "answer": 0,
                    "explanation": "DIP dictates that high-level modules depend on abstractions, decoupling business logic from concrete details."
                },
                {
                    "question": "How does programming to an interface enable efficient automated unit testing?",
                    "options": [
                        "It allows test runners to inject Mock implementations that simulate external services without network calls or fees",
                        "It eliminates the need to compile test code",
                        "It allows tests to run without installing Java",
                        "It automatically writes assertions for the developer"
                    ],
                    "answer": 0,
                    "explanation": "Mock implementations fulfilling the interface contract can be passed into services for isolated, fast unit testing."
                },
                {
                    "question": "What is the primary operational risk of directly hard-coding concrete classes (e.g. 'new CryptoGateway()') inside a high-level service?",
                    "options": [
                        "Tight coupling: swapping payment providers requires editing and retesting the core service, creating high regression risk",
                        "It causes the CPU clock frequency to drop",
                        "It forces all variables to be stored in the Windows Registry",
                        "It prevents Java classes from using for loops"
                    ],
                    "answer": 0,
                    "explanation": "Direct instantiation tightly couples components, preventing seamless replacement and complicating maintenance."
                },
                {
                    "question": "What design pattern is demonstrated when a CheckoutService accepts a PaymentGateway instance through its constructor?",
                    "options": [
                        "Dependency Injection (Constructor Injection)",
                        "Singleton Pattern",
                        "Prototype Pattern",
                        "Flyweight Pattern"
                    ],
                    "answer": 0,
                    "explanation": "Passing dependencies into an object via its constructor is the fundamental Constructor Dependency Injection pattern."
                }
            ]
        },
        {
            "title": "Interface Evolution: Java 8+ Default Methods, Static Methods & Private Helpers",
            "content": """For the first two decades of Java's history (from Java 1.0 through Java 7), interfaces were strictly limited to declaring public abstract methods. While this purity was conceptually elegant, it introduced a severe architectural crisis in enterprise software development known as The Interface Evolution Problem.

Suppose an open-source library publishes an interface called 'PaymentGateway' consumed by thousands of financial institutions worldwide. Five years later, the library maintainers want to add a new method: 'void refundPayment(double amount)'. Under Java 7 rules, adding 'refundPayment' to the interface immediately broke every single implementing class in the world upon upgrading, because non-abstract classes were forced to implement the new method or fail compilation! To avoid breaking the world's codebase, interfaces were effectively frozen in stone once published.

To solve this dilemma, Java 8 introduced a revolutionary capability: Default Methods (also known as Defender Methods or Virtual Extension Methods). By prefixing a method declaration with the 'default' keyword and providing a concrete method body inside the interface, interface authors can evolve their contracts safely:
'public interface PaymentGateway {'
'    boolean processPayment(double amount);'
'    // Default method: Non-breaking extension!'
'    default void refundPayment(double amount) {'
'        System.out.println("Default refund processing: $" + amount);'
'    }'
'}'
Existing classes that implement PaymentGateway compile and run seamlessly without changes, automatically inheriting the default implementation! However, any implementing class retains the freedom to override the default method with a specialized algorithm if desired.

In addition to default methods, modern Java expanded interfaces with:
1. Static Interface Methods (Java 8+): Interfaces can declare 'public static' utility and factory methods (e.g., 'PaymentGateway.ofDefault()'). Static interface methods belong to the interface itself and cannot be overridden by implementing classes.
2. Private Interface Methods (Java 9+): Interfaces can declare 'private' helper methods. These methods cannot be accessed or overridden by implementing classes; their sole purpose is to share common helper logic between multiple default methods within the interface, adhering to DRY principles.

Multiple Default Method Collision Resolution:
What happens if a class implements two interfaces that declare identical default methods ('interface A { default void log() { ... } }' and 'interface B { default void log() { ... } }')? The Java compiler refuses to guess! It halts compilation with a conflict error. The implementing class MUST resolve the ambiguity by explicitly overriding the method and choosing which parent implementation to invoke via 'A.super.log();' or writing a fresh implementation. In the interactive lab below, we trace default methods, static interface methods, and collision resolution.""",
            "code": """public class InterfaceEvolutionLab {
    public interface PaymentGateway {
        // Abstract method: Mandatory contract
        boolean processPayment(double amount);

        // Default method (Java 8+): Non-breaking API evolution!
        default boolean processRefund(double amount) {
            logInternalEvent("Processing default refund: $" + amount);
            return amount > 0;
        }

        // Static factory method (Java 8+):
        static PaymentGateway createDefault() {
            return new CryptoGateway();
        }

        // Private helper method (Java 9+): Shared helper for default methods
        private void logInternalEvent(String msg) {
            System.out.println("  [Interface Private Helper] " + msg);
        }
    }

    public static class CryptoGateway implements PaymentGateway {
        @Override
        public boolean processPayment(double amount) {
            return amount > 0;
        }
        // Inherits default processRefund() without needing to write it!
    }

    public static void main(String[] args) {
        System.out.println("=== INTERFACE EVOLUTION & DEFAULT METHODS LAB ===");

        // Instantiating via static interface factory:
        PaymentGateway gateway = PaymentGateway.createDefault();

        System.out.println("Payment Processed: " + gateway.processPayment(100.0));
        // Calling inherited default method:
        System.out.println("Refund Processed:  " + gateway.processRefund(50.0));
    }
}""",
            "checks": [
                {
                    "question": "What is the primary purpose of Default Methods introduced in Java 8 interfaces?",
                    "options": [
                        "To allow interfaces to evolve with new methods without breaking existing implementing classes (backward compatibility)",
                        "To force all classes to become abstract",
                        "To delete unused methods from binary files",
                        "To enable interfaces to allocate private heap memory"
                    ],
                    "answer": 0,
                    "explanation": "Default methods provide a fallback body, enabling library maintainers to add methods without breaking existing classes."
                },
                {
                    "question": "What must an implementing class do if it implements two interfaces declaring identical default method signatures?",
                    "options": [
                        "It must explicitly override the colliding method to resolve the ambiguity",
                        "The JVM picks the interface that was created first",
                        "The program crashes with an OutOfMemoryError",
                        "The compiler deletes both interfaces"
                    ],
                    "answer": 0,
                    "explanation": "The compiler detects default method collisions and requires the class to explicitly override the conflicting method."
                },
                {
                    "question": "What capability did Java 9 introduce to interfaces to support code reuse between default methods?",
                    "options": [
                        "Private interface methods",
                        "Global thread locks",
                        "Destructors",
                        "Virtual memory pointers"
                    ],
                    "answer": 0,
                    "explanation": "Java 9 added private methods to interfaces, allowing common helper code to be shared across default methods."
                },
                {
                    "question": "Can an implementing class override a 'static' method declared inside an interface?",
                    "options": [
                        "No, static interface methods belong exclusively to the interface type and cannot be overridden",
                        "Yes, by using the @Override annotation",
                        "Only if the class is public",
                        "Only in Android applications"
                    ],
                    "answer": 0,
                    "explanation": "Static interface methods are not inherited by implementing classes; they can only be invoked via InterfaceName.method()."
                }
            ]
        },
        {
            "title": "Milestone 4 Capstone: Engineering the Enterprise Payment Gateway Engine",
            "content": """We culminate Day 21 of our Java curriculum with our Milestone 4 Capstone: The Enterprise Payment Gateway Engine. This capstone synthesizes everything we have mastered—from class blueprints, memory layouts, access encapsulation, inheritance hierarchies, and dynamic polymorphism—into a decoupled, enterprise-grade architecture.

This capstone directly implements the specifications of the Day 21 Milestone 4 Challenge:
1. Define the 'PaymentGateway' Interface:
   - Declares the abstract behavioral contract 'boolean processPayment(double amount);'.
2. Implement the 'CryptoGateway' Realization:
   - Implements 'PaymentGateway' with explicit 'public boolean processPayment(double amount)'.
   - Enforces the business invariant: returns 'true' when amount is strictly positive ('amount > 0'), and returns 'false' when amount is zero or negative ('amount <= 0').
3. Implement the Decoupled Service Entrypoint:
   - In the canonical 'Solution' class, implement 'public static boolean execute(double amt)': instantiates a 'CryptoGateway' through a 'PaymentGateway' interface reference and delegates payment execution:
     'PaymentGateway gw = new CryptoGateway();'
     'return gw.processPayment(amt);'

Furthermore, we implement the Day 21 Assignment specifications:
- Define the 'Printable' Interface with method 'String print();'.
- Implement the 'Document' class fulfilling 'Printable', returning the literal 'Document printed'.
- Implement 'Solution.test()' returning 'Printable p = new Document(); return p.print();'.

In real-world enterprise architectures—such as payment processors handling billions in transaction volume across Visa, Mastercard, and blockchain ledgers—this decoupled interface contract guarantees that new payment modalities can be onboarded, audited, and tested in complete isolation. In our canonical Solution class below, we provide the complete implementation conforming to the Day 21 Challenge and Assignment specifications, accompanied by an exhaustive automated test harness. In the interactive lab below, inspect the implementation, run the verification harness, and certify complete mastery over Milestone 4 and Java interfaces.""",
            "code": """// Production Solution conforming to Day 21 Milestone 4 Challenge Specifications
interface PaymentGateway {
    boolean processPayment(double amount);
}

class CryptoGateway implements PaymentGateway {
    @Override
    public boolean processPayment(double amount) {
        // Invariant: True only when amount > 0
        return amount > 0;
    }
}

// Assignment Domain: Printable Interface and Document
interface Printable {
    String print();
}

class Document implements Printable {
    @Override
    public String print() {
        return "Document printed";
    }
}

public class Solution {
    // Challenge verification entrypoint: Decoupled interface execution
    public static boolean execute(double amt) {
        PaymentGateway gw = new CryptoGateway();
        return gw.processPayment(amt);
    }

    // Assignment verification entrypoint: Decoupled printable execution
    public static String test() {
        Printable p = new Document();
        return p.print();
    }

    public static void main(String[] args) {
        System.out.println("=== DAY 21: MILESTONE 4 PAYMENT GATEWAY ENGINE LAB ===");

        // Test 1: Positive Payment (100.0) -> must return true
        boolean t1 = execute(100.0);
        System.out.println("Test 1 - Execute $100.0 Result: " + t1 + " (Expected: true)");
        if (!t1) throw new AssertionError("Test 1 Failed: Valid 100.0 payment must return true");

        // Test 2: Zero Payment (0.0) -> must return false
        boolean t2 = execute(0.0);
        System.out.println("Test 2 - Execute $0.0 Result:   " + t2 + " (Expected: false)");
        if (t2) throw new AssertionError("Test 2 Failed: 0.0 payment must return false");

        // Test 3: Negative Payment (-50.0) -> must return false
        boolean t3 = execute(-50.0);
        System.out.println("Test 3 - Execute -$50.0 Result: " + t3 + " (Expected: false)");
        if (t3) throw new AssertionError("Test 3 Failed: Negative payment must return false");

        // Test 4: Assignment Verification via Solution.test()
        String docResult = test();
        System.out.println("Test 4 - Solution.test() Result: '" + docResult + "' (Expected: 'Document printed')");
        if (!docResult.equals("Document printed")) throw new AssertionError("Test 4 Failed: Document must print correctly");

        // Test 5: Interface Type Compatibility Assertions
        PaymentGateway directGw = new CryptoGateway();
        if (!(directGw instanceof PaymentGateway) || !(directGw instanceof CryptoGateway)) {
            throw new AssertionError("Test 5 Failed: Type compatibility assertions failed");
        }

        System.out.println("\n>>> ALL MILESTONE 4 TEST HARNESS ASSERTIONS VERIFIED CLEANLY! <<<");
    }
}""",
            "checks": [
                {
                    "question": "In the Day 21 Milestone 4 Solution.execute(double amt) method, what is the return value of execute(100.0) vs execute(-50.0)?",
                    "options": [
                        "true for 100.0; false for -50.0",
                        "false for both",
                        "true for both",
                        "null"
                    ],
                    "answer": 0,
                    "explanation": "CryptoGateway returns amount > 0; 100.0 is positive (true), while -50.0 is negative (false)."
                },
                {
                    "question": "What is the return value of Solution.execute(0.0) in the Day 21 challenge?",
                    "options": [
                        "false, because 0.0 is not strictly greater than 0",
                        "true",
                        "0",
                        "Throws an ArithmeticException"
                    ],
                    "answer": 0,
                    "explanation": "The condition 'amount > 0' evaluates to false when amount is 0.0."
                },
                {
                    "question": "In the Day 21 Assignment, what does Solution.test() return?",
                    "options": [
                        "'Document printed', returned by the Document class implementing Printable",
                        "'Printing...'",
                        "null",
                        "0"
                    ],
                    "answer": 0,
                    "explanation": "Document.print() returns the literal 'Document printed'."
                },
                {
                    "question": "Why is the variable in 'PaymentGateway gw = new CryptoGateway();' typed as PaymentGateway rather than CryptoGateway?",
                    "options": [
                        "To adhere to Dependency Inversion and decoupling, programming to the interface rather than the concrete implementation",
                        "Because Java does not permit variables to be typed as CryptoGateway",
                        "To encrypt the memory address of the object",
                        "To make the garbage collector ignore the variable"
                    ],
                    "answer": 0,
                    "explanation": "Typing variables as interfaces ensures caller code depends only on the abstraction, enabling swappability."
                }
            ]
        }
    ],
    "summary": [
        "Interfaces define pure behavioral contracts with public abstract methods and public static final constants.",
        "Java permits Multiple Interface Implementation because interfaces carry no mutable instance state on the heap.",
        "Concrete classes use 'implements' and MUST implement all abstract methods with explicit 'public' visibility.",
        "The Dependency Inversion Principle (DIP) mandates that high-level modules depend on abstractions, enabling swappable implementations and fast unit testing.",
        "Java 8+ Default Methods allow interfaces to evolve safely without breaking backward compatibility for existing implementing classes.",
        "Milestone 4 Capstone implements PaymentGateway (processPayment), CryptoGateway (amount > 0), and Printable (Document printed)."
    ],
    "projectStep": {
        "title": "Build the Milestone 4 Payment Gateway Engine",
        "steps": [
            "Declare interface PaymentGateway with abstract method 'boolean processPayment(double amount)'.",
            "Author class CryptoGateway implementing PaymentGateway returning 'amount > 0'.",
            "Declare interface Printable with method 'String print()' and class Document returning 'Document printed'.",
            "Implement 'Solution.execute(double amt)' creating a CryptoGateway through a PaymentGateway reference.",
            "Execute the test harness verifying positive amounts, zero/negative rejection, and decoupled interface contracts."
        ]
    }
}
