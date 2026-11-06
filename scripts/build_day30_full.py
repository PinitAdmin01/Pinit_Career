import sys
import pprint

p1_content = """### 1. Enterprise Financial Architecture: Double-Entry Accounting, Immutability & Ledger Systems

In global financial engineering, the architecture of ledger systems represents one of the most critical applications of computer science. Financial institutions, banking cores, payment gateways, and cryptocurrency exchanges process trillions of dollars daily. In these systems, an algorithmic defect or corrupted database record does not merely cause an application error—it results in catastrophic monetary losses, regulatory fines, and legal liability.

To build mathematically sound, unshakeable financial systems, enterprise software adheres to the centuries-old mathematical discipline of **Double-Entry Bookkeeping**, formalized in 1494 by the Franciscan friar and mathematician Luca Pacioli.
The foundational equation of double-entry bookkeeping states:
$$\\mathbf{Assets = Liabilities + Equity}$$
Every financial event is recorded as a **transaction** comprising at least two entries: a **Debit** and a **Credit**. For every transaction, the sum of debits must strictly equal the sum of credits:
$$\\sum \\text{Debits} = \\sum \\text{Credits}$$
If a user transfers \\$100 from Checking to Savings, Checking is credited (decreased by \\$100) and Savings is debited (increased by \\$100). The net change across the entire ledger is identically zero. This closed-system mathematical invariant guarantees that money can never be created or destroyed by algorithmic bugs.

```
+------------------------------------------------------------------------------------+
| ENTERPRISE FINANCIAL LEDGER: IMMUTABLE APPEND-ONLY ARCHITECTURE                    |
+------------------------------------------------------------------------------------+
| TRADITIONAL CRUD DATABASE (FORBIDDEN IN BANKING):                                  |
| UPDATE accounts SET balance = balance - 100 WHERE id = 101;                        |
| Risk: Previous state is destroyed! Zero audit trail of who, why, or when!          |
+------------------------------------------------------------------------------------+
| IMMUTABLE FINANCIAL LEDGER (ENTERPRISE STANDARD):                                  |
| [Tx 1: Credit +$1,000 (Initial Deposit)]                                            |
|    │                                                                               |
|    ▼                                                                               |
| [Tx 2: Debit  -$200 (ATM Withdrawal)]                                              |
|    │                                                                               |
|    ▼                                                                               |
| [Tx 3: Credit +$500 (Payroll Deposit)]                                             |
|    │                                                                               |
|    ▼                                                                               |
| [Tx 4: Debit  -$150 (Utility Bill)]                                                |
|    │                                                                               |
| Current Balance = Initial + Sum of All Transactions = $1,150                       |
| Invariant: Records are NEVER updated or deleted. Corrections append compensatory tx!|
+------------------------------------------------------------------------------------+
```

A paramount architectural invariant in ledger systems is **Append-Only Immutability**. In standard web applications, developers frequently execute SQL `UPDATE` or `DELETE` statements. In enterprise financial ledgers, **`UPDATE` and `DELETE` operations are strictly forbidden!**
Why? Because updating a balance in place erases history, eliminating the forensic audit trail required by regulatory bodies like the SEC, FINRA, SOX (Sarbanes-Oxley), and Basel III. If a bank clerk accidentally debits \\$500 instead of \\$50, the system does not alter the erroneous row. Instead, it appends a new **Compensating Transaction** crediting \\$450. The account balance at any point in history can be deterministically reconstructed by replaying the immutable transaction stream from the beginning of time.

Throughout Month 1 of PinIT Career OS, you have mastered the building blocks required to engineer this architecture:
- **OOP Encapsulation (Days 16–20)** ensures that internal account balances cannot be modified directly from outside classes without passing through defensive validation rules.
- **Interfaces and Contracts (Days 21–22)** decouple payment gateways from business engines.
- **Defensive Preconditions and Exceptions (Days 23–24)** halt illegal states before corrupted data can touch persistent storage.
- **Dynamic Collections and Key-Value Maps (Days 25–26)** enable in-memory transaction accumulation and frequency tracking.
- **Generics and Type Parameterization (Day 27)** eliminate runtime casting crashes.
- **Multithreading and I/O Streams (Days 28–29)** power high-throughput, non-blocking transaction processing.
"""

p2_content = """### 2. Numerical Precision in Financial Computing: Two's Complement Overflows & BigDecimal Architecture

In software engineering, perhaps no mistake has cost financial corporations more money than using binary floating-point numbers (`double` and `float`) for monetary calculations.

To understand why `double` is catastrophic for finance, consider how modern CPUs represent floating-point numbers under the IEEE 754 standard. CPUs represent numbers in binary (base-2). Just as the fraction $1/3$ cannot be represented precisely in decimal (it repeats infinitely as $0.333333\\dots$), common decimal fractions like $0.1$ (one dime) or $0.01$ (one cent) cannot be represented precisely in binary!
```java
double d1 = 0.1;
double d2 = 0.2;
System.out.println(d1 + d2); // Prints: 0.30000000000000004!
```
Notice that tiny trailing `0.00000000000000004`! In a high-frequency trading platform processing one hundred million micro-transactions per second, accumulating these tiny floating-point rounding errors results in thousands of dollars of "phantom money" disappearing or appearing out of thin air!

To achieve absolute mathematical precision, financial software architectures adopt two proven engineering strategies:

```
+------------------------------------------------------------------------------------+
| FINANCIAL COMPUTING NUMERICAL ARCHITECTURES                                        |
+------------------------------------------------------------------------------------+
| STRATEGY 1: PRIMITIVE INTEGER SCALING (CENTS / MICROCENTS ARITHMETIC)             |
| Representation: $15.50 is stored as primitive int/long 1550 (integer cents)       |
| Addition: 1050 + 2025 = 3075 ($30.75)                                              |
| Performance: Blistering single-cycle CPU hardware arithmetic with ZERO heap alloc! |
| Caution: Must guard against 32-bit Two's Complement Integer Overflow!              |
+------------------------------------------------------------------------------------+
| STRATEGY 2: JAVA.MATH.BIGDECIMAL (ARBITRARY PRECISION)                             |
| Representation: Unscaled BigInteger + 32-bit Integer Scale                         |
| Invariant: Preserves exact decimal digits; requires explicit RoundingMode          |
| Performance: Heap-allocated object; ideal for currency conversions and interest   |
+------------------------------------------------------------------------------------+
```

In the first strategy—utilized in our Day 30 milestone challenges—currency is represented using **Primitive Integer Scaling**. Instead of representing \\$100.25 as a floating-point number, it is stored as `10025` integer cents. Because integer addition (`+`) and subtraction (`-`) operate in exact discrete steps, rounding error is mathematically impossible!

However, when accumulating millions of transaction cents in primitive integers, architects must remain vigilant against **Two's Complement Integer Overflow**. In Java, a standard 32-bit signed integer (`int`) has a maximum value of `Integer.MAX_VALUE = 2,147,483,647` (approximately \\$21.4 million in cents). If an accumulator exceeds this threshold, the sign bit flips and the balance wraps around silently into a negative number!
```java
int balance = 2_147_483_640;
balance += 100; // SILENT OVERFLOW: becomes -2,147,483,556!
```
To eliminate overflow hazards in production, Java 8 introduced **Safe Exact Arithmetic** in `java.lang.Math`:
```java
int safeSum = Math.addExact(a, b); // Throws ArithmeticException upon overflow!
```
Alternatively, enterprise systems use 64-bit `long` primitive integers (which support up to 9 quintillion cents / \\$92 quadrillion) or `java.math.BigDecimal` configured with explicit banker's rounding (`RoundingMode.HALF_EVEN`).
"""

p3_content = """### 3. Algorithmic Ledger Auditing & Threshold Filtering: Filtering Large Exposure Transactions

In regulatory compliance and financial risk engineering, financial institutions are legally mandated to detect and isolate transactions that exceed specific risk exposure thresholds. Under anti-money laundering (AML) regulations (such as the Bank Secrecy Act in the United States and EU Anti-Money Laundering Directives), banks must automatically identify all monetary movements that exceed a statutory limit (such as all transactions strictly greater than \\$10,000) and submit Currency Transaction Reports (CTR) to regulatory enforcement networks.

In our Day 30 Capstone Challenge, we construct the core algorithm that powers these audit filters: **`auditLedger(int[] amounts, int limit)`**.

```java
public static int auditLedger(int[] amounts, int limit) {
    if (amounts == null) return 0;
    int sum = 0;
    for (int amt : amounts) {
        if (amt > limit) {
            sum += amt;
        }
    }
    return sum;
}
```

Let us conduct a rigorous algorithmic and hardware-level performance analysis of this auditing engine:

```
+------------------------------------------------------------------------------------+
| AUDIT LEDGER PIPELINE EXECUTION TRACE & MEMORY CACHE LOCALITY                      |
+------------------------------------------------------------------------------------+
| Input: amounts = [5000, 12000, 3000, 25000, 8000], limit = 10000                  |
|                                                                                    |
| CONTIGUOUS HEAP ARRAY (Direct Hardware L1 Cache Prefetching):                      |
| Address:  0x100    0x104    0x108    0x10C    0x110                                |
| Memory:   [ 5000 | 12000  | 3000   | 25000  | 8000  ]                              |
| Iteration:   1        2       3        4        5                                  |
| Condition: 5000>10k 12k>10k 3k>10k  25k>10k  8k>10k                                |
| Branch:     False    TRUE    False    TRUE    False                                |
| Accumulator:  0     12000    12000    37000   37000                                |
|                                                                                    |
| FINAL AUDITED TOTAL: 37,000 (O(N) Time Complexity, O(1) Auxiliary Space)          |
+------------------------------------------------------------------------------------+
```

1. **Time Complexity: Strictly $O(N)$ Linear Time**
   The algorithm visits each transaction amount in the array exactly once. For an array of $N$ transactions, it performs $N$ comparisons and at most $N$ addition instructions. In HotSpot compiled bytecode, the loop is aggressively unrolled and vectorized by the C2 JIT compiler, utilizing SIMD (Single Instruction, Multiple Data) CPU vector registers (AVX-512) to evaluate multiple transactions simultaneously in parallel hardware lanes.
2. **Space Complexity: Strictly $O(1)$ Constant Space**
   Unlike streaming filters that collect results into an intermediate `ArrayList` or allocate wrapper objects, `auditLedger` operates in-place using a single primitive integer register (`sum = 0`). Auxiliary memory consumption is zero bytes regardless of whether the ledger contains ten transactions or ten million transactions.
3. **Hardware CPU Cache Alignment**
   Because `amounts` is a primitive contiguous array (`int[]`), the CPU hardware memory prefetcher detects the sequential memory access pattern and streams contiguous cache lines (64 bytes / 16 integers per cache line) directly into L1 CPU cache ahead of execution. This eliminates memory latency stalls, delivering throughput exceeding tens of millions of transaction audits per second on modern server hardware.
"""

p4_content = """### 4. Balance Reconciliation & Compensating Ledger Pipelines

At the end of every financial business day, banking engines, clearinghouses, and payment settlement networks execute a mission-critical process known as **Ledger Reconciliation**.

In a distributed economy, a bank's internal ledger must continuously reconcile with external payment rails: Visa, Mastercard, ACH, Fedwire, and SWIFT. Due to asynchronous network latencies, offline batch authorizations, network timeouts, and currency exchange fluctuations, discrepancies inevitably arise between the initial opening balance and the processed transaction stream.

The reconciliation engine takes an account's **opening balance** (`initialBalance`) and an array of atomic credits and debits (`transactions`), calculating the true, reconciled net balance:
$$\\mathbf{\\text{Reconciled Balance} = \\text{Initial Balance} + \\sum_{i=1}^N \\text{transaction}_i}$$

In our Day 30 Assignment, we construct this reconciliation core: **`calculateBalance(int initialBalance, int[] transactions)`**.

```java
public static int calculateBalance(int initialBalance, int[] txs) {
    int balance = initialBalance;
    if (txs != null) {
        for (int tx : txs) {
            balance += tx;
        }
    }
    return balance;
}
```

```
+------------------------------------------------------------------------------------+
| RECONCILIATION ENGINE: CREDITS, DEBITS & NET SETTLEMENT                            |
+------------------------------------------------------------------------------------+
| INITIAL OPENING LEDGER BALANCE: $1,000 (100000 cents)                              |
|                                                                                    |
| TRANSACTION SETTLEMENT PIPELINE:                                                   |
| +-------------------+--------------------+--------------------+------------------+ |
| | Credit Tx 1       | Debit Tx 2         | Credit Tx 3        | Debit Tx 4       | |
| | Amount: +$500     | Amount: -$200      | Amount: +$300      | Amount: -$100    | |
| | Running: $1,500   | Running: $1,300    | Running: $1,600    | Running: $1,500  | |
| +-------------------+--------------------+--------------------+------------------+ |
|                                                                                    |
| NET SETTLEMENT DELTA: +$500                                                        |
| FINAL RECONCILED CLOSING BALANCE: $1,500                                           |
+------------------------------------------------------------------------------------+
```

Notice the critical architectural characteristics of the reconciliation engine:
1. **Algebraic Sign Preservation**: In double-entry ledger design, credits (inbound deposits, refunds, salary) are represented as positive numbers (`+500`), while debits (withdrawals, merchant purchases, service fees) are represented as negative numbers (`-200`). By using signed integer arithmetic, the addition operator (`balance += tx;`) automatically applies debits as deductions and credits as additions without requiring complex branching logic!
2. **Defensive Null-Safety**: If an account has no transactions for the business day (or if a network timeout causes a null transaction array payload to arrive), the defensive guard `if (txs != null)` prevents an unhandled `NullPointerException`, preserving the closing balance identically equal to `initialBalance`.
3. **Idempotent Auditability**: Because the transaction array is traversed as an immutable stream, running `calculateBalance` multiple times consecutively against the same inputs will produce the exact same result every time without mutating the input arrays. In distributed systems, this idempotency is vital for automated disaster recovery and retry loops.
"""

p5_content = """### 5. Guided Capstone Coding Lab & Month 1 Certification Verification: Building `auditLedger` and `calculateBalance`

We have reached the culmination of Month 1 of PinIT Career OS! Today, we implement, verify, and certify the two capstone methods that demonstrate complete mastery of foundational Java engineering: **`auditLedger`** and **`calculateBalance`**.

In the primary capstone challenge, we implement `Solution.auditLedger(int[] amounts, int limit)`. The method contract mandates that we iterate through the `amounts` array, identify all transaction values that are **strictly greater than `limit`** (`amt > limit`), compute their cumulative sum, and return the total audited sum. If `amounts` is null or empty, it must return `0`.

```java
// ============================================================================
// DAY 30 CAPSTONE CHALLENGE: LEDGER TRANSACTION AUDITOR
// ============================================================================
public class Solution {
    /**
     * Audits a transaction ledger, returning the sum of all transaction amounts
     * that are strictly greater than the specified limit.
     * Returns 0 if amounts is null or empty.
     */
    public static int auditLedger(int[] amounts, int limit) {
        // Step 1: Defensive guard for null input:
        if (amounts == null) {
            return 0;
        }

        // Step 2: Initialize accumulator register:
        int sum = 0;

        // Step 3: Single-pass linear scan across transactions:
        for (int amount : amounts) {
            // Step 4: Strict threshold comparison:
            if (amount > limit) {
                sum += amount;
            }
        }

        // Step 5: Return audited total sum:
        return sum;
    }
}
```

Let us step through `auditLedger` execution:
- **Trace 1 (Standard Audit)**: `amounts = [5000, 12000, 3000, 25000, 8000]`, `limit = 10000`.
  - 5000: `5000 > 10000` is `false`. Skipped.
  - 12000: `12000 > 10000` is `true`. `sum` becomes `12000`.
  - 3000: `3000 > 10000` is `false`. Skipped.
  - 25000: `25000 > 10000` is `true`. `sum` becomes `12000 + 25000 = 37000`.
  - 8000: `8000 > 10000` is `false`. Skipped.
  - Returns `37000`.
- **Trace 2 (Exact Limit Boundary)**: `amounts = [10000]`, `limit = 10000`. Because $10000 > 10000$ is `false` (strictly greater requirement), the transaction is not included, and `auditLedger` correctly returns `0`.
- **Trace 3 (Null Input)**: `auditLedger(null, 5000)` returns `0` cleanly.

In the final capstone assignment, we implement `SolutionAdv.calculateBalance(int initialBalance, int[] transactions)`. The method initializes the balance to `initialBalance`. If `transactions` is not null, it loops through the array, adds each positive credit or negative debit, and returns the final reconciled balance.

```java
// ============================================================================
// DAY 30 CAPSTONE ASSIGNMENT: ACCOUNT BALANCE RECONCILER
// ============================================================================
public class SolutionAdv {
    /**
     * Calculates the reconciled account balance by applying all transactions
     * (positive credits and negative debits) to the initial starting balance.
     * Returns initialBalance if transactions is null.
     */
    public static int calculateBalance(int initialBalance, int[] transactions) {
        int balance = initialBalance;

        // Defensive check: only iterate if array reference is non-null
        if (transactions != null) {
            for (int tx : transactions) {
                balance += tx;
            }
        }

        return balance;
    }
}
```

Let us trace `calculateBalance` execution:
- **Scenario A (Standard Reconciliation)**:
  `initialBalance = 1000`, `transactions = [500, -200, 300, -100]`.
  - Starts at 1000.
  - +500: `1000 + 500 = 1500`.
  - -200: `1500 + (-200) = 1300`.
  - +300: `1300 + 300 = 1600`.
  - -100: `1600 + (-100) = 1500`.
  - Returns final reconciled balance `1500`.
- **Scenario B (Null Transaction Array)**:
  `calculateBalance(2500, null)`. Returns starting balance `2500` without exception.
- **Scenario C (Empty Transaction Array)**:
  `calculateBalance(500, new int[]{})`. Returns `500`.

In automated verification with JUnit 5:
```java
@Test
void testLedgerAuditor() {
    int[] amounts = {5000, 12000, 3000, 25000, 8000};
    assertEquals(37000, Solution.auditLedger(amounts, 10000));
    assertEquals(0, Solution.auditLedger(amounts, 50000));
    assertEquals(0, Solution.auditLedger(null, 10000));
}

@Test
void testBalanceReconciler() {
    int[] txs = {500, -200, 300, -100};
    assertEquals(1500, SolutionAdv.calculateBalance(1000, txs));
    assertEquals(2500, SolutionAdv.calculateBalance(2500, null));
    assertEquals(500, SolutionAdv.calculateBalance(500, new int[]{}));
}
```

**Month 1 Certification Accomplishment**:
By completing Days 1 through 30, you have built an unbreakable technical foundation in Java: variables, control flow, loops, methods, arrays, binary search, OOP class design, encapsulation, inheritance, polymorphism, interfaces, static class-level memory, exception handling, dynamic collections (ArrayList and HashMap), Generics, Multithreading, and Text Stream I/O. You are 100% prepared to excel in Month 2 Enterprise Architecture!
"""

DAY_30 = {
    "day": 30,
    "title": "Month 1 Capstone: Enterprise Ledger Audit & Financial Transaction Engine",
    "goal": "Synthesize all Month 1 foundational Java engineering disciplines into a production-grade enterprise ledger audit and reconciliation engine. Understand double-entry bookkeeping, append-only immutability, numerical precision hazards (IEEE 754 floating point vs integer cents scaling), L1 CPU cache prefetching during array auditing, and implement auditLedger and calculateBalance.",
    "minutes": 25,
    "recap": "Yesterday we mastered Stream and Text I/O, BufferedReaders, and CSV data extraction. Today, we celebrate the Month 1 Capstone: synthesizing all 30 days of foundational Java into an enterprise-grade financial ledger audit and balance reconciliation engine.",
    "summary": [
        "Enterprise financial systems rely on double-entry bookkeeping where assets strictly equal liabilities plus equity.",
        "Ledgers are strictly append-only; records are never updated or deleted in place to preserve a tamper-evident audit trail.",
        "Floating-point numbers (double/float) are strictly forbidden in finance due to binary rounding errors; use integer cents scaling.",
        "The auditLedger algorithm achieves O(N) linear time and O(1) space, maximizing L1 CPU cache line prefetching.",
        "The calculateBalance algorithm processes signed credits and debits to reconcile opening balances with zero allocation churn.",
        "Month 1 Java Basics is 100% complete, fully verified, and ready for Month 2 Advanced Enterprise Architecture."
    ],
    "projectStep": {
        "title": "Build the Final Month 1 Financial Ledger Capstone Engine",
        "steps": [
            "Author Solution.auditLedger(int[] amounts, int limit) returning the sum of amounts strictly greater than limit.",
            "Author SolutionAdv.calculateBalance(int initialBalance, int[] transactions) reconciling net balance from signed transactions.",
            "Incorporate defensive null guards returning 0 for null amounts and initialBalance for null transactions.",
            "Verify auditLedger correctly filters multi-thousand-dollar transactions and calculateBalance applies positive credits and negative debits flawlessly."
        ]
    },
    "parts": [
        {
            "part": 1,
            "title": "Enterprise Financial Architecture: Double-Entry Accounting, Immutability & Ledger Systems",
            "content": p1_content.strip(),
            "code": """public class LedgerArchitectureLab {
    // Immutable financial transaction record:
    public static class Transaction {
        private final String txId;
        private final int amountCents; // Positive for Credit, Negative for Debit
        private final long timestamp;

        public Transaction(String id, int cents) {
            this.txId = id;
            this.amountCents = cents;
            this.timestamp = System.currentTimeMillis();
        }

        public String getTxId() { return txId; }
        public int getAmountCents() { return amountCents; }
        public long getTimestamp() { return timestamp; }
    }

    public static void main(String[] args) {
        System.out.println("=== ENTERPRISE IMMUTABLE LEDGER LAB ===");
        Transaction t1 = new Transaction("TX-001", 100000); // +$1,000.00
        Transaction t2 = new Transaction("TX-002", -20000);  // -$200.00
        System.out.println("Tx 1: " + t1.getTxId() + " -> " + t1.getAmountCents() + " cents");
        System.out.println("Tx 2: " + t2.getTxId() + " -> " + t2.getAmountCents() + " cents");
    }
}""",
            "checks": [
                {
                    "question": "What is the foundational mathematical invariant of double-entry bookkeeping?",
                    "options": [
                        "Assets = Liabilities + Equity, and the sum of all debits must strictly equal the sum of all credits",
                        "Assets must always be zero at the end of every hour",
                        "Debits must exceed credits by at least 10%",
                        "Accounts must be cleared to zero every midnight"
                    ],
                    "answer": 0,
                    "explanation": "Double-entry accounting requires that every transaction balances perfectly: total debits equal total credits."
                },
                {
                    "question": "Why are UPDATE and DELETE database operations strictly forbidden in financial ledger systems?",
                    "options": [
                        "They destroy historical records, violating legal and regulatory compliance requirements for an immutable audit trail",
                        "Because modern databases no longer support the UPDATE keyword",
                        "Because updating numbers causes CPU overheating",
                        "Because SQL queries can only be run once per day"
                    ],
                    "answer": 0,
                    "explanation": "Ledgers must be immutable and append-only so that full forensic audit trails are preserved for regulatory compliance."
                },
                {
                    "question": "How do enterprise ledger systems correct an erroneous transaction?",
                    "options": [
                        "By appending a new compensating transaction that offsets the error while preserving the historical record",
                        "By manually deleting the database row using administrator tools",
                        "By rebooting the server to clear memory",
                        "By writing a negative number over the previous balance"
                    ],
                    "answer": 0,
                    "explanation": "Financial systems never modify past rows; they append a new compensating transaction to offset the previous entry."
                },
                {
                    "question": "What architectural principle ensures that internal ledger balances cannot be corrupted by external code?",
                    "options": [
                        "Object-Oriented Encapsulation with private state and defensive validation methods",
                        "Running all code in public static methods",
                        "Storing all variables as global strings",
                        "Disabling garbage collection"
                    ],
                    "answer": 0,
                    "explanation": "Encapsulating fields as private and providing defensive mutator methods protects invariants from external tampering."
                }
            ]
        },
        {
            "part": 2,
            "title": "Numerical Precision in Financial Computing: Two's Complement Overflows & BigDecimal Architecture",
            "content": p2_content.strip(),
            "code": """public class FinancialPrecisionLab {
    public static void main(String[] args) {
        System.out.println("=== FINANCIAL NUMERICAL PRECISION LAB ===");

        // The Floating-Point Catastrophe in Finance:
        double d1 = 0.1;
        double d2 = 0.2;
        System.out.println("Double addition (0.1 + 0.2): " + (d1 + d2)); // 0.30000000000000004!

        // Primitive Integer Scaling (Integer Cents):
        int cents1 = 10; // $0.10
        int cents2 = 20; // $0.20
        int sumCents = cents1 + cents2; // Exactly 30 ($0.30)!
        System.out.println("Integer cents addition (10 + 20): " + sumCents + " cents ($0." + sumCents + ")");

        // Safe exact arithmetic with overflow detection:
        try {
            int safe = Math.addExact(Integer.MAX_VALUE, 1);
        } catch (ArithmeticException e) {
            System.out.println("Math.addExact prevented silent two's complement overflow!");
        }
    }
}""",
            "checks": [
                {
                    "question": "Why are floating-point types (double and float) strictly forbidden for monetary calculations in finance?",
                    "options": [
                        "Binary IEEE 754 floating-point cannot precisely represent decimal fractions like 0.1, accumulating rounding errors",
                        "Because double cannot store positive numbers",
                        "Because double variables are limited to 4 digits",
                        "Because float requires an external GPU"
                    ],
                    "answer": 0,
                    "explanation": "Floating-point numbers in base-2 produce fractional inaccuracies (e.g. 0.1 + 0.2 = 0.30000000000000004) that corrupt ledger balances."
                },
                {
                    "question": "How does primitive integer scaling represent monetary values with 100% precision?",
                    "options": [
                        "By storing values as integer cents or microcents (e.g. $15.50 is stored as integer 1550 cents)",
                        "By storing each digit as an ASCII character",
                        "By rounding every balance to the nearest $100",
                        "By converting numbers into strings"
                    ],
                    "answer": 0,
                    "explanation": "Integer scaling represents currency in its smallest discrete unit (e.g. cents), enabling exact hardware integer arithmetic."
                },
                {
                    "question": "What happens if a standard integer addition exceeds Integer.MAX_VALUE without overflow checks?",
                    "options": [
                        "The sign bit flips and the number wraps around silently into a negative number in two's complement",
                        "The JVM throws an OutOfMemoryError",
                        "The value clamps at Integer.MAX_VALUE automatically",
                        "The program halts with exit code 1"
                    ],
                    "answer": 0,
                    "explanation": "32-bit signed two's complement integers wrap around silently to negative values upon overflow without throwing an error."
                },
                {
                    "question": "What method from java.lang.Math detects and rejects integer overflow in Java 8+?",
                    "options": [
                        "Math.addExact(a, b)",
                        "Math.max(a, b)",
                        "Math.abs(a)",
                        "Math.round(a)"
                    ],
                    "answer": 0,
                    "explanation": "Math.addExact throws an ArithmeticException if the mathematical result overflows a standard primitive integer."
                }
            ]
        },
        {
            "part": 3,
            "title": "Algorithmic Ledger Auditing & Threshold Filtering: Filtering Large Exposure Transactions",
            "content": p3_content.strip(),
            "code": """public class AuditFilterLab {
    public static void main(String[] args) {
        System.out.println("=== LEDGER AUDIT THRESHOLD FILTER LAB ===");

        int[] ledger = {5000, 12000, 3000, 25000, 8000};
        int reportingLimit = 10000;

        int auditedSum = 0;
        for (int amount : ledger) {
            if (amount > reportingLimit) {
                System.out.println("  [AML FLAGGED] High exposure transaction: $" + amount);
                auditedSum += amount;
            }
        }

        System.out.println("Total cumulative large exposure sum: $" + auditedSum); // 37000
    }
}""",
            "checks": [
                {
                    "question": "What is the time complexity of the auditLedger algorithm on an array of N transactions?",
                    "options": [
                        "O(N) Linear time because each transaction is inspected exactly once in a single sequential pass",
                        "O(N^2) Quadratic time due to nested looping",
                        "O(log N) Logarithmic time",
                        "O(1) Constant time"
                    ],
                    "answer": 0,
                    "explanation": "The algorithm visits each element of the array once, executing in linear O(N) time."
                },
                {
                    "question": "What is the auxiliary space complexity of auditLedger(int[] amounts, int limit)?",
                    "options": [
                        "O(1) Constant space because it maintains a single integer accumulator register without allocating heap arrays",
                        "O(N) Linear space to store the results",
                        "O(N^2) Quadratic space",
                        "O(log N) Logarithmic stack space"
                    ],
                    "answer": 0,
                    "explanation": "auditLedger operates in-place using a single primitive integer accumulator, requiring zero auxiliary heap allocation."
                },
                {
                    "question": "Why does sequential array traversal in auditLedger maximize CPU memory throughput?",
                    "options": [
                        "Contiguous primitive array memory allows hardware CPU prefetchers to stream 64-byte cache lines into L1 cache seamlessly",
                        "Because arrays disable the CPU clock",
                        "Because the JVM converts the array into a Red-Black tree",
                        "Because array loops do not use electricity"
                    ],
                    "answer": 0,
                    "explanation": "Contiguous memory layout triggers hardware prefetchers, loading subsequent elements into CPU cache lines ahead of execution."
                },
                {
                    "question": "In auditLedger, if an amount is exactly equal to the limit (amount == limit), is it added to the sum?",
                    "options": [
                        "No, the specification requires amounts strictly greater than limit (amount > limit)",
                        "Yes, amounts greater than or equal to limit are added",
                        "It depends on the operating system",
                        "It throws an IllegalArgumentException"
                    ],
                    "answer": 0,
                    "explanation": "The contract explicitly mandates strictly greater than limit (>), so amount == limit is excluded."
                }
            ]
        },
        {
            "part": 4,
            "title": "Balance Reconciliation & Compensating Ledger Pipelines",
            "content": p4_content.strip(),
            "code": """public class ReconciliationLab {
    public static void main(String[] args) {
        System.out.println("=== DAILY BALANCE RECONCILIATION LAB ===");

        int initialBalance = 1000;
        int[] dailyTransactions = {500, -200, 300, -100};

        int reconciledBalance = initialBalance;
        for (int tx : dailyTransactions) {
            reconciledBalance += tx;
            System.out.println("  Applied tx (" + (tx >= 0 ? "+" : "") + tx + ") -> Current: $" + reconciledBalance);
        }

        System.out.println("Final Reconciled Closing Balance: $" + reconciledBalance); // 1500
    }
}""",
            "checks": [
                {
                    "question": "Why does signed arithmetic (balance += tx) automatically apply both credits and debits correctly?",
                    "options": [
                        "Because adding a positive number increases the balance (credit) while adding a negative number decreases it (debit)",
                        "Because Java converts all numbers to positive before addition",
                        "Because the JVM uses two separate CPUs for credits and debits",
                        "Because addition is only permitted on positive integers"
                    ],
                    "answer": 0,
                    "explanation": "In signed integer arithmetic, adding a negative number naturally subtracts its absolute value, applying debits seamlessly."
                },
                {
                    "question": "What does calculateBalance(1000, null) return when protected by defensive guards?",
                    "options": [
                        "1000 (the initial balance unchanged)",
                        "0",
                        "Throws a NullPointerException",
                        "-1"
                    ],
                    "answer": 0,
                    "explanation": "If no transactions occurred (null array), the account balance remains untouched at its opening balance."
                },
                {
                    "question": "What is meant by Idempotency in ledger reconciliation pipelines?",
                    "options": [
                        "Re-running the reconciliation calculation multiple times against the same immutable inputs always produces the exact same balance",
                        "The calculation runs only once and can never be executed again",
                        "Transactions are deleted after being reconciled",
                        "Balances are multiplied by two on every run"
                    ],
                    "answer": 0,
                    "explanation": "Idempotent pipelines produce identical results regardless of how many times they are executed, enabling safe retries."
                },
                {
                    "question": "What happens if calculateBalance is invoked with an empty array of transactions (new int[]{})?",
                    "options": [
                        "It returns initialBalance with zero modifications",
                        "Throws an ArrayIndexOutOfBoundsException",
                        "Returns 0",
                        "Returns -1"
                    ],
                    "answer": 0,
                    "explanation": "An empty array performs zero iterations through the loop, cleanly returning the initial balance."
                }
            ]
        },
        {
            "part": 5,
            "title": "Guided Capstone Coding Lab & Month 1 Certification Verification: Building auditLedger and calculateBalance",
            "content": p5_content.strip(),
            "code": """public class SolutionLab {
    // Capstone Challenge 1: Ledger Transaction Auditor
    public static class Solution {
        public static int auditLedger(int[] amounts, int limit) {
            if (amounts == null) return 0;
            int sum = 0;
            for (int amount : amounts) {
                if (amount > limit) {
                    sum += amount;
                }
            }
            return sum;
        }
    }

    // Capstone Challenge 2: Account Balance Reconciler
    public static class SolutionAdv {
        public static int calculateBalance(int initialBalance, int[] transactions) {
            int balance = initialBalance;
            if (transactions != null) {
                for (int tx : transactions) {
                    balance += tx;
                }
            }
            return balance;
        }
    }

    public static void main(String[] args) {
        // Test auditLedger:
        int[] amounts = {5000, 12000, 3000, 25000, 8000};
        int auditedTotal = Solution.auditLedger(amounts, 10000);
        System.out.println("auditLedger result:     $" + auditedTotal); // 37000

        // Test calculateBalance:
        int[] txs = {500, -200, 300, -100};
        int reconciled = SolutionAdv.calculateBalance(1000, txs);
        System.out.println("calculateBalance result: $" + reconciled);   // 1500
    }
}""",
            "checks": [
                {
                    "question": "In the Day 30 auditLedger challenge, what does auditLedger(new int[]{5000, 12000, 3000, 25000, 8000}, 10000) return?",
                    "options": [
                        "37000 (sum of 12000 and 25000)",
                        "53000 (sum of all elements)",
                        "25000",
                        "0"
                    ],
                    "answer": 0,
                    "explanation": "Only 12000 and 25000 are strictly greater than 10000; their sum evaluates to 37000."
                },
                {
                    "question": "In the Day 30 calculateBalance assignment, what does calculateBalance(1000, new int[]{500, -200, 300, -100}) return?",
                    "options": [
                        "1500 (1000 + 500 - 200 + 300 - 100)",
                        "1000",
                        "2100",
                        "500"
                    ],
                    "answer": 0,
                    "explanation": "Starting at 1000, applying +500, -200, +300, and -100 results in 1500."
                },
                {
                    "question": "What does Solution.auditLedger(null, 10000) return?",
                    "options": [
                        "0 cleanly without throwing NullPointerException",
                        "-1",
                        "Throws a NullPointerException",
                        "Throws an IllegalArgumentException"
                    ],
                    "answer": 0,
                    "explanation": "The null guard 'if (amounts == null) return 0;' intercepts null references safely."
                },
                {
                    "question": "What does SolutionAdv.calculateBalance(2500, null) return?",
                    "options": [
                        "2500 (the initial balance unchanged)",
                        "0",
                        "Throws a NullPointerException",
                        "-1"
                    ],
                    "answer": 0,
                    "explanation": "When the transactions array is null, the initial balance of 2500 is returned untouched."
                }
            ]
        }
    ]
}

with open("scripts/block6_day30.py", "w", encoding="utf-8") as f:
    f.write("# Day 30: Month 1 Capstone: Enterprise Ledger Audit & Financial Transaction Engine\n\nDAY_30 = ")
    f.write(pprint.pformat(DAY_30, indent=4, width=120))
    f.write("\n")

print("Wrote scripts/block6_day30.py successfully")
