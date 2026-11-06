import json

with open('scripts/java_days36_40_outputs.json', 'r', encoding='utf-8') as f:
    outputs = json.load(f)

d37p1_say = [
    "Welcome to Day 37. Today we explore the engine room of object-oriented runtime polymorphism: method overriding, the @Override compiler contract, and the JVM's internal Virtual Method Table (vtable) architecture. Polymorphism—literally \"many forms\"—is what allows high-level enterprise architectures to interact with abstract domain entities without knowing or caring which concrete implementation is executing underneath. In Java, this runtime behavior is not magical; it is driven by a highly optimized, constant-time memory indexing structure known as the vtable.",
    "When the JVM ClassLoader loads a class into Metaspace, it constructs an internal data structure called the Klass mirror. Deep inside this Klass structure resides the Virtual Method Table. The vtable is essentially an array of function pointers pointing directly to the compiled bytecode or JIT-compiled machine code entry points of every non-private, non-static, non-final method available on that class. When class B extends class A, class B inherits all of class A's vtable slots at the exact same numeric array offsets.",
    "If class B overrides a method—say, slot 3, which corresponds to the withdraw() method—the JVM simply overwrites the pointer in slot 3 of B's vtable with the address of B's specialized implementation! Methods that B does not override remain pointing directly to A's original implementation. This constant-offset inheritance invariant is why polymorphic method dispatch in Java executes in O(1) constant time with near-zero overhead.",
    "When your application executes an invokevirtual bytecode instruction—such as acc.withdraw(amount)—the CPU does not perform an expensive linear search or string comparison across the inheritance tree. Instead, it reads the 4-byte Klass pointer from the target object's header on the heap, indexes into that Klass's vtable at the fixed compiled offset (slot 3), and executes an indirect call instruction directly to the target machine code. Whether the object is an Account, SavingsAccount, or CorporateChecking, the dispatch latency is identical.",
    "In high-performance financial systems processing hundreds of thousands of transactions per second, this O(1) vtable dispatch mechanism provides massive throughput advantages. Modern JIT compilers (such as HotSpot's Tier-4 C2 compiler) take this even further through Monomorphic Inline Caching (MIC). If a call site repeatedly encounters the same concrete class, the JIT inlines the method body directly into the calling loop, completely eliminating the vtable lookup and function call overhead.",
    "In our first simulation, we build a diagnostic VTableSimulator that models this exact offset routing. We register an Account parent with slots for withdraw and getBalance, and specialized subclasses for SavingsAccount and CheckingAccount. Notice how an Account reference dynamically resolves to the specialized subtype method when pointed at a SavingsAccount heap instance, proving that runtime dispatch is governed by the actual heap type, not the compile-time variable declaration."
]

d37p2_say = [
    "Now that we understand how the JVM routes method calls at runtime via vtables, let us examine the critical role of the compiler and the indispensable @Override annotation. In Java, method overriding occurs when a subclass declares a method with the EXACT same signature (method name, parameter types, and parameter order) as a method in its superclass, with a compatible (covariant) return type and access modifier that is at least as visible as the parent.",
    "However, human engineers frequently make minute typographical errors. An engineer intending to override public void withdraw(long amount) might accidentally write public void withdraw(int amount), or public void withDraw(long amount) with a capital 'D', or public boolean withdraw(long amount). Without explicit compiler tooling, Java treats this subtle deviation not as an error, but as an entirely legitimate method overload!",
    "When this happens, catastrophic runtime bugs occur. The compiler compiles the class without warnings. But at runtime, when polymorphic code invokes acc.withdraw(amount) on a parent reference, the JVM looks at the parent's vtable slot, sees that the child never overwrote that slot, and silently executes the generic parent method! The specialized child logic—with its custom overdraft boundaries or audit logging—is never called.",
    "This is why the @Override annotation was introduced in Java 5 and remains one of the most vital defensive programming tools in modern enterprise development. @Override is not a runtime decorator; it is a compile-time constraint assertion. When you place @Override above a method, you instruct javac: \"Verify that this method matches an existing signature in my superclass or implemented interface. If it does not, abort compilation immediately with a syntax error.\"",
    "In mission-critical enterprise engineering, leading engineering organizations mandate a strict compiler policy: \"-Werror -Xlint:overrides\". Any subclass method that attempts to override parent behavior without the @Override annotation causes the continuous integration build to fail. This simple zero-cost annotation eliminates an entire class of silent production regressions before a single line of bytecode is ever deployed.",
    "In our second simulation, we demonstrate the @Override compiler guard. We construct a BaseAccount that applies a flat $15.00 maintenance fee, and a PremiumAccount that overrides calculateFee to waive the fee for high-balance clients. Because the signature matches precisely and is guarded by @Override, polymorphic invocation through a BaseAccount reference correctly routes to the premium zero-fee calculation for qualifying accounts."
]

d37p3_say = [
    "Welcome to the Detective Lab for Day 37. In this forensic investigation, we dissect an incident that cost a fintech payments gateway over $140,000 in uncollected transaction processing fees over a single weekend. The incident stemmed from what appeared to be a harmless pull request touching an interface implementation.",
    "The engineering team maintained an interface BankingEntity defining public boolean withdraw(int cents). A new team member was tasked with implementing AccountWithTypo to handle retail micro-withdrawals. When writing the class, the engineer inadvertently typed public boolean withDraw(int cents), capitalizing the 'D' in accordance with their personal camelCase intuition, and omitted the @Override annotation.",
    "Because @Override was missing, javac compiled the code without complaint. The test suite contained unit tests that instantiated AccountWithTypo directly and called withDraw(2500), which passed! But in production, the core TransactionOrchestrator operated exclusively on BankingEntity interface references. When the orchestrator called client.withdraw(2500), the JVM looked up the interface table, found that the implementing class had only provided a default fallback implementation, and bypassed the specialized fraud scoring logic entirely.",
    "The investigation revealed two catastrophic failure modes: first, the unit tests were biased because they tested concrete classes rather than polymorphic interface contracts; second, the absence of @Override allowed an accidental method overload to masquerade as an override. Had the developer placed @Override above the method, javac would have instantly thrown: \"method does not override or implement a method from a supertype\".",
    "In our simulated Detective Lab repair, we fix the signature typo. We change 'withDraw' to 'withdraw', add the interface contract binding, and verify that invoking the method through the BankingEntity interface reference executes cleanly. The simulation confirms that the withdrawal succeeds and the remaining balance is accurately updated."
]

d37p4_say = [
    "In this Mastery Assignment, you will leverage polymorphic method overriding to construct an enterprise Polymorphic Statement Generator. In commercial banking platforms, different customer segments require radically different financial reporting formats. Retail customers expect simplified monthly summaries featuring rewards points and cash-back balances, while Private Wealth clients demand detailed asset allocation metrics, portfolio risk scores, and dedicated concierge advisory notes.",
    "A junior developer might attempt to handle these formatting variations using a massive, brittle switch statement or a series of instanceof checks: if (acc instanceof RetailAccount) { ... } else if (acc instanceof WealthAccount) { ... }. In senior enterprise architecture, this pattern is considered an egregious anti-pattern. It violates the Open/Closed Principle: every time the bank introduces a new account tier (such as CommercialSME or CryptoCustodial), the centralized statement generator must be modified, re-tested, and redeployed.",
    "With polymorphic method overriding, the architecture becomes open for extension but closed for modification. We define an abstract base class StatementAccount with an abstract method generateStatement(). Each subclass—RetailAccount and WealthAccount—overrides generateStatement() to encapsulate its own product-specific reporting rules.",
    "The client subsystem—such as a batch statement distribution pipeline—holds a simple array of StatementAccount references. It iterates through the array and invokes acc.generateStatement() on each element. The client does not contain a single if-statement or type cast. The JVM's dynamic dispatch automatically invokes RetailAccount's statement logic for retail clients, and WealthAccount's statement logic for private wealth clients.",
    "In our runnable simulation, we assemble this exact architecture. We create a heterogeneous portfolio containing a RetailAccount with a $450.00 balance and a WealthAccount with a $150,000.00 balance. We iterate through the portfolio, and watch the JVM dynamically emit the appropriate high-fidelity statement string for each distinct customer segment."
]

d37p5_say = [
    "In our final part of Day 37, we analyze a classic Production Incident Lab: The Accidental Overload Outage. This incident highlights a treacherous edge case in Java method resolution involving primitive numeric promotions and method overloading.",
    "In Java, primitive types can be implicitly widened: a byte widens to short, short widens to int, int widens to long, and float widens to double. Suppose a legacy FeeEngine defines public long computeFee(long amountCents). A modernization engineer creates a subclass AdvancedFeeEngine intending to override the fee computation. However, looking at their local variables which are integers, they declare public long computeFee(int amountCents).",
    "Notice the trap: because int differs from long, this is NOT method overriding; it is method OVERLOADING. Now consider what happens at the call site. When a caller passes a long literal—such as engine.computeFee(100000L)—the compiler checks the available methods. The parent method expects long, while the child method expects int. The compiler cannot pass a long into an int without narrowing, so it silently routes the call to the parent method!",
    "Conversely, if a caller passes an int literal, the compiler chooses the most specific match (the child method taking int). As a result, the system behaves erratically: small integer amounts use the new fee engine, while large transaction amounts (which exceed 2 billion cents and are represented as longs) silently fall back to the obsolete legacy engine!",
    "This insidious bug went undetected in a Tier-1 clearing house for months, resulting in millions of dollars in uncalculated fee revenues. The remediation was simple but profound: align the parameter types precisely to computeFee(long amountCents) and lock it with the @Override annotation so that any future signature drift is flagged by the compiler during build time.",
    "In our simulated incident remediation, we observe the corrected FeeEngine v2. We execute fee calculations across both standard and micropayment thresholds, verifying that the dynamic dispatch engine captures the exact 1.5% fee structure across all transaction volumes."
]

day37 = {
  "day": 37,
  "title": "Method Overriding, @Override, Virtual Method Tables (vtable) & Dynamic Dispatch",
  "goal": "Master method overriding, the @Override annotation, and understand runtime dynamic method dispatch via vtables.",
  "minutes": 35,
  "recap": "Yesterday we mastered inheritance hierarchies and constructor chaining. Today we conquer runtime polymorphism: how the JVM uses Virtual Method Tables (vtables) to dynamically dispatch overridden methods in constant O(1) time.",
  "parts": [
    {
      "title": "Virtual Method Table (vtable) Mechanics & O(1) Dynamic Dispatch Offsets",
      "say": d37p1_say,
      "example": "Like a speed-dial directory on an executive desk: regardless of which secretary answers the phone, pressing button #3 instantly dials the chief risk officer's line at the exact same physical wire connection.",
      "code": """class VTableSimulator {
  private vtables: Record<string, Record<string, string>> = {
    "Account": { "withdraw": "Account#withdraw", "getBalance": "Account#getBalance" },
    "SavingsAccount": { "withdraw": "SavingsAccount#withdraw", "getBalance": "Account#getBalance" },
    "CheckingAccount": { "withdraw": "CheckingAccount#withdraw", "getBalance": "Account#getBalance" }
  };

  resolveMethod(runtimeClass: string, methodSlot: string): string {
    const table = this.vtables[runtimeClass];
    return table ? table[methodSlot] : "UNKNOWN_METHOD";
  }
}

const vtable = new VTableSimulator();
console.log("VTable Offset Slot 0 (withdraw) on Account reference pointing to SavingsAccount heap instance:");
console.log("Resolved target:", vtable.resolveMethod("SavingsAccount", "withdraw"));
console.log("Resolved target on CheckingAccount:", vtable.resolveMethod("CheckingAccount", "withdraw"));""",
      "output": outputs["d37p1"],
      "codeNotes": [
        { "line": 3, "note": "Base Account vtable maps slots to parent method entry points" },
        { "line": 4, "note": "SavingsAccount overwrites withdraw slot with its specialized entry point" },
        { "line": 15, "note": "Dynamic lookup resolves target in O(1) time based on runtime heap type" }
      ],
      "tryIt": "Add a new method 'applyInterest' to the vtable mapping and query its resolution.",
      "check": {
        "question": "How does the Java Virtual Machine achieve O(1) constant-time dynamic method dispatch when invoking overridden methods?",
        "options": [
          "By indexing a pre-computed array of function pointers (vtable) at fixed numeric array offsets in Metaspace",
          "By performing a runtime string comparison across all class names in the package",
          "By recompiling the entire application every time a method is called",
          "By converting all method calls into HTTP network requests"
        ],
        "answer": 0,
        "why": "The JVM HotSpot engine maintains an internal Virtual Method Table (vtable) for each loaded class, indexing overridden methods at identical array offsets for instantaneous pointer dispatch.",
        "answerIndex": 0,
        "explanation": "The JVM HotSpot engine maintains an internal Virtual Method Table (vtable) for each loaded class, indexing overridden methods at identical array offsets for instantaneous pointer dispatch."
      }
    },
    {
      "title": "The @Override Compiler Guard & Preventing Silent Accidental Overloading",
      "say": d37p2_say,
      "example": "Like an inspector's official seal on a replacement airplane engine: it formally certifies that the new part perfectly matches every bolt hole and pressure specification of the original blueprint.",
      "code": """class BaseAccount {
  calculateFee(balanceCents: number): number {
    return 1500; // Flat $15 fee
  }
}

class PremiumAccount extends BaseAccount {
  // Verified @Override: Exactly matches parent signature
  calculateFee(balanceCents: number): number {
    return balanceCents > 1000000 ? 0 : 500; // $0 if > $10k, else $5
  }
}

const acc: BaseAccount = new PremiumAccount();
console.log("Dynamic dispatch fee calculation for $25,000 balance:", acc.calculateFee(2500000));
console.log("Dynamic dispatch fee calculation for $500 balance:", acc.calculateFee(50000));""",
      "output": outputs["d37p2"],
      "codeNotes": [
        { "line": 2, "note": "Base class defines default maintenance fee calculation" },
        { "line": 8, "note": "Subclass overrides method with exact matching signature" },
        { "line": 14, "note": "Invocation via parent reference routes dynamically to PremiumAccount" }
      ],
      "tryIt": "Change the balance threshold from 1,000,000 to 5,000,000 to observe fee adjustments for medium accounts.",
      "check": {
        "question": "What is the primary architectural purpose of the @Override annotation in Java?",
        "options": [
          "To instruct the compiler to verify that the method actually overrides an existing method in a supertype, catching signature typos at compile time",
          "To speed up database connection pooling",
          "To allow private methods to be accessed from outside the package",
          "To make the class serializable across network sockets"
        ],
        "answer": 0,
        "why": "@Override acts as a compile-time assertion. If the annotated method does not match a supertype signature (due to a typo or parameter mismatch), javac halts compilation immediately.",
        "answerIndex": 0,
        "explanation": "@Override acts as a compile-time assertion. If the annotated method does not match a supertype signature (due to a typo or parameter mismatch), javac halts compilation immediately."
      }
    },
    {
      "title": "Detective Lab: The Silent Signature Typo",
      "say": d37p3_say,
      "example": "Like ordering key blanks cut with a 0.5mm misalignment: the key slides into the lock cylinder smoothly but fails to engage the tumblers when turned.",
      "code": """interface BankingEntity {
  withdraw(cents: number): boolean;
}

class AccountWithTypo implements BankingEntity {
  private balance: number = 10000;
  // Typo bug resolved: was 'withDraw', now correctly 'withdraw'
  withdraw(cents: number): boolean {
    if (cents <= this.balance) {
      this.balance -= cents;
      console.log(`Successfully withdrew $${(cents / 100).toFixed(2)}. Remaining: $${(this.balance / 100).toFixed(2)}`);
      return true;
    }
    return false;
  }
}

const client: BankingEntity = new AccountWithTypo();
const success = client.withdraw(2500);
console.log("Method invocation via interface contract succeeded:", success);""",
      "output": outputs["d37p3"],
      "codeNotes": [
        { "line": 2, "note": "Interface contract declares canonical withdraw signature" },
        { "line": 8, "note": "Corrected method signature satisfies interface contract exactly" },
        { "line": 18, "note": "Polymorphic client invocation routes cleanly to implementation" }
      ],
      "tryIt": "Attempt to withdraw an amount exceeding 10000 cents to verify the boundary guard returns false.",
      "check": {
        "question": "If a developer writes 'public void withDraw(int amount)' intending to override 'public void withdraw(int amount)', what does the Java compiler do if @Override is omitted?",
        "options": [
          "It compiles without error, creating an accidental overload, but the method will never be invoked polymorphically via a parent reference",
          "It automatically renames the method to the correct casing",
          "It throws a NullPointerException during compilation",
          "It deletes the subclass file from disk"
        ],
        "answer": 0,
        "why": "Without @Override, Java treats the misspelled method as a completely new, unrelated method. Code calling the parent method will continue calling the parent version, silently bypassing the child logic.",
        "answerIndex": 0,
        "explanation": "Without @Override, Java treats the misspelled method as a completely new, unrelated method. Code calling the parent method will continue calling the parent version, silently bypassing the child logic."
      }
    },
    {
      "title": "Mastery Assignment: Polymorphic Statement Generator",
      "say": d37p4_say,
      "example": "Like universal electrical sockets at an international airport: travelers plug in hair dryers, laptops, and phone chargers, and each device consumes power according to its internal circuitry without modifying the wall outlet.",
      "code": """abstract class StatementAccount {
  constructor(public readonly id: string, protected balance: number) {}
  abstract generateStatement(): string;
}

class RetailAccount extends StatementAccount {
  generateStatement(): string {
    return `[Retail Statement] Account: ${this.id} | Balance: $${(this.balance / 100).toFixed(2)} | Rewards: Tier 1`;
  }
}

class WealthAccount extends StatementAccount {
  generateStatement(): string {
    return `[Private Wealth] Account: ${this.id} | Balance: $${(this.balance / 100).toFixed(2)} | Advisory: Concierge Active`;
  }
}

const portfolio: StatementAccount[] = [
  new RetailAccount("RET-019", 45000),
  new WealthAccount("WTH-882", 15000000)
];

portfolio.forEach(acc => console.log(acc.generateStatement()));""",
      "output": outputs["d37p4"],
      "codeNotes": [
        { "line": 3, "note": "Abstract base class establishes the polymorphic statement contract" },
        { "line": 7, "note": "RetailAccount encapsulates retail-specific rewards and formatting" },
        { "line": 13, "note": "WealthAccount encapsulates concierge advisory metrics" },
        { "line": 22, "note": "Iteration over base references dynamically dispatches to correct subtype logic" }
      ],
      "tryIt": "Add a third subtype 'CorporateAccount' with custom tax withholding formatting and add it to the portfolio.",
      "check": {
        "question": "Which object-oriented design principle is directly upheld by using polymorphic method overriding instead of a switch statement with instanceof checks?",
        "options": [
          "The Open/Closed Principle: open for extension with new account types, closed for modification of existing billing loops",
          "The Single Memory Allocation Rule",
          "The Database Normalization Rule",
          "The Static Typing Elimination Principle"
        ],
        "answer": 0,
        "why": "Polymorphism allows new subclasses to be introduced without modifying existing client code, satisfying the Open/Closed Principle (OCP).",
        "answerIndex": 0,
        "explanation": "Polymorphism allows new subclasses to be introduced without modifying existing client code, satisfying the Open/Closed Principle (OCP)."
      }
    },
    {
      "title": "Production Incident Lab: The Accidental Overload Outage",
      "say": d37p5_say,
      "example": "Like a coin-sorting machine designed for standard quarters: if a foreign coin with identical diameter but slightly different thickness is inserted, it drops through the bypass slot into the reject tray.",
      "code": """class FeeEngine {
  // In Java, calculateFee(int) vs calculateFee(long) causes accidental overload if not marked @Override
  computeFee(amountCents: number): number {
    const fee = Math.max(100, Math.round(amountCents * 0.015));
    console.log(`[Fee Engine v2] Computed 1.5% fee on $${(amountCents / 100).toFixed(2)}: $${(fee / 100).toFixed(2)}`);
    return fee;
  }
}

const engine = new FeeEngine();
const fee1 = engine.computeFee(100000);
const fee2 = engine.computeFee(2500);
console.log(`Audit Total Fees Captured: $${((fee1 + fee2) / 100).toFixed(2)}`);""",
      "output": outputs["d37p5"],
      "codeNotes": [
        { "line": 3, "note": "Canonical computeFee method handles all transaction amounts uniformly" },
        { "line": 4, "note": "Applies a minimum $1.00 fee floor or 1.5% processing fee" },
        { "line": 12, "note": "Audit log confirms accurate cumulative revenue capture across batch" }
      ],
      "tryIt": "Increase the percentage fee from 0.015 to 0.025 and re-run to inspect updated fee yield.",
      "check": {
        "question": "What occurs when a subclass declares 'long calculateFee(int amount)' while the superclass declares 'long calculateFee(long amount)'?",
        "options": [
          "The method is an accidental overload; callers passing long values will execute the superclass method, while callers passing int values will execute the subclass method",
          "The Java compiler automatically converts the superclass method parameter to int",
          "The JVM refuses to start the application",
          "The subclass method replaces the superclass method unconditionally"
        ],
        "answer": 0,
        "why": "Because parameter types differ (int vs long), Java treats this as method overloading rather than overriding. The compiler resolves the target based on the argument's static type, creating erratic split behavior.",
        "answerIndex": 0,
        "explanation": "Because parameter types differ (int vs long), Java treats this as method overloading rather than overriding. The compiler resolves the target based on the argument's static type, creating erratic split behavior."
      }
    }
  ],
  "summary": [
    "Method overriding allows a subclass to provide a specialized implementation of a method defined in its superclass or interface.",
    "The JVM executes dynamic method dispatch in O(1) constant time by looking up pre-computed function pointers in Virtual Method Tables (vtables).",
    "Runtime dispatch is governed by the actual object instance on the heap, NOT the compile-time type of the reference variable.",
    "The @Override annotation is a crucial compile-time assertion that prevents silent, catastrophic accidental overloading bugs caused by signature typos.",
    "Polymorphic hierarchies uphold the Open/Closed Principle (OCP), eliminating fragile, unmaintainable switch statements and instanceof chains.",
    "Iron Rule: Never declare methods with slightly different parameter types (e.g., int vs long) without explicit @Override verification."
  ],
  "projectStep": {
    "title": "Implement the Polymorphic Account Hierarchy with vtable Dynamic Dispatch",
    "steps": [
      "Define abstract StatementAccount declaring polymorphic generateStatement() signature.",
      "Implement RetailAccount and WealthAccount with @Override annotations enforcing exact signature matching.",
      "Verify that method dispatch routes dynamically based on runtime heap instance type rather than reference type.",
      "Construct the polymorphic batch reporting loop iterating heterogeneous account portfolios without instanceof checks.",
      "Execute compiler verification ensuring 100% of overridden methods are locked with @Override annotations."
    ]
  }
}

words = sum(sum(len(s.split()) for s in p['say']) for p in day37['parts'])
print(f"Day 37 Total Words: {words}")
for i, p in enumerate(day37['parts']):
    w = sum(len(s.split()) for s in p['say'])
    print(f"  Part {i+1}: {w} words")

with open('scripts/day37_data.py', 'w', encoding='utf-8') as f:
    f.write("# Day 37: Method Overriding, @Override, Virtual Method Tables (vtable) & Dynamic Dispatch\n")
    f.write("import json\n\n")
    f.write(f"day37 = {json.dumps(day37, indent=2, ensure_ascii=False)}\n")
print("Saved scripts/day37_data.py")
