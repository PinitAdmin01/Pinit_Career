import sys
import pprint

sys.path.insert(0, 'scripts')
import block5_day21
import block5_day22
import block5_day23
import block5_day24
import block5_day25
import block6_day26
import block6_day27
import block6_day28
import block6_day29
import block6_day30

modules = [
    (block5_day21, 'scripts/block5_day21.py', 'DAY_21'),
    (block5_day22, 'scripts/block5_day22.py', 'DAY_22'),
    (block5_day23, 'scripts/block5_day23.py', 'DAY_23'),
    (block5_day24, 'scripts/block5_day24.py', 'DAY_24'),
    (block5_day25, 'scripts/block5_day25.py', 'DAY_25'),
    (block6_day26, 'scripts/block6_day26.py', 'DAY_26'),
    (block6_day27, 'scripts/block6_day27.py', 'DAY_27'),
    (block6_day28, 'scripts/block6_day28.py', 'DAY_28'),
    (block6_day29, 'scripts/block6_day29.py', 'DAY_29'),
    (block6_day30, 'scripts/block6_day30.py', 'DAY_30')
]

tryit_prompts = {
    21: [
        "Try declaring a third interface contract Auditable and implementing both PaymentGateway and Auditable in CryptoGateway.",
        "Try declaring a default method default void printReceipt(double amt) in PaymentGateway and test if implementing classes inherit it.",
        "Try modifying the processPayment method to reject payments exceeding a $10,000 risk limit and verify the returned boolean.",
        "Try implementing a mock payment gateway MockGateway for deterministic unit testing without external network calls.",
        "Try modifying the Milestone 4 engine to record an audit trail entry for every rejected non-positive transaction."
    ],
    22: [
        "Try mutating the static field through an object instance (instance.staticField) and note the compiler warning recommending ClassName.field.",
        "Try accessing an instance variable directly from inside a static method and observe the compile-time non-static field error.",
        "Try initializing a static configuration block static { ... } that validates system environment variables at class load time.",
        "Try adding a private constructor to the Math utility class to enforce that it can never be instantiated as an object.",
        "Try tracking simultaneous active user sessions using an AtomicInteger or synchronized static counter."
    ],
    23: [
        "Try passing a zero divisor to safeDivide and observe how the catch block intercepts ArithmeticException and returns -1.",
        "Try swapping the order of catch blocks to catch Exception before ArithmeticException and observe the unreachable catch block error.",
        "Try adding a finally block that prints 'Resource Cleanup Complete' and verify it executes regardless of whether an exception occurred.",
        "Try accessing an array with a negative index and verify that ArrayIndexOutOfBoundsException is gracefully caught.",
        "Try chaining multiple catch blocks (catch (ArithmeticException | ArrayIndexOutOfBoundsException e)) using Java multi-catch."
    ],
    24: [
        "Try calling validateDeposit with a negative value (-500) and verify that the thrown IllegalArgumentException contains a descriptive message.",
        "Try creating a custom checked exception InsufficientFundsException extending Exception and add a throws clause to the method signature.",
        "Try wrapping an underlying low-level exception in a high-level BankingException using exception chaining (new BankingException('Error', cause)).",
        "Try enforcing defensive validation on a null customer name string using Objects.requireNonNull(name, 'Name cannot be null').",
        "Try testing that validateDeposit completes normally without throwing any exception when passed a positive deposit of $1,000."
    ],
    25: [
        "Try calling list.add(index, element) to insert an item at the head of the ArrayList and note the O(N) array element shifting cost.",
        "Try converting an array to an ArrayList using new ArrayList<>(Arrays.asList(arr)) and verify dynamic resizing capability.",
        "Try removing elements from an ArrayList inside a standard for-each loop and observe the ConcurrentModificationException.",
        "Try safely removing elements matching a predicate using the collection's removeIf(item -> item < cutoff) method.",
        "Try pre-sizing the ArrayList using new ArrayList<>(1000) to eliminate internal array copy overhead during heavy insertions."
    ],
    26: [
        "Try inserting duplicate keys into the HashMap and verify that the new value overwrites the old value while returning the previous value.",
        "Try retrieving a non-existent key with getOrDefault(key, 0) and verify that it returns 0 instead of a dangerous null pointer.",
        "Try iterating through all key-value entries using map.entrySet() and print both the key and value in a single loop traversal.",
        "Try using map.putIfAbsent(key, initialValue) to avoid overwriting existing inventory entries in a concurrent cache.",
        "Try testing countFrequency on a sentence containing punctuation marks and sanitize each word with toLowerCase() before counting."
    ],
    27: [
        "Try instantiating Pair with mismatched types (e.g. Pair<String, Integer>) and verify compile-time type safety on getters.",
        "Try creating a generic swap method <T> void swap(T[] arr, int i, int j) that swaps any two elements in an array of any reference type.",
        "Try implementing a bounded generic class NumericBox<T extends Number> and verify that passing String causes a compiler error.",
        "Try inspecting the decompiled bytecode of Box<T> using javap to observe how type erasure replaces T with Object.",
        "Try demonstrating PECS (Producer Extends, Consumer Super) by reading numbers from List<? extends Number>."
    ],
    28: [
        "Try invoking worker.run() directly instead of thread.start() and observe that it executes synchronously on the main thread.",
        "Try spawning 5 parallel worker threads in a loop and verify that their standard output messages interleave non-deterministically.",
        "Try calling thread.join() from the main thread and verify that the main thread blocks until the background worker finishes.",
        "Try inspecting thread state using thread.getState() before calling start(), while running, and after completion.",
        "Try setting a thread as a daemon thread (thread.setDaemon(true)) and verify that the JVM exits without waiting for it."
    ],
    29: [
        "Try reading a multi-line string using BufferedReader.readLine() in a while ((line = reader.readLine()) != null) loop.",
        "Try using try-with-resources (try (BufferedReader br = ...)) and verify that close() is automatically invoked even on I/O error.",
        "Try counting lines matching different severity levels ([INFO], [WARN], [ERROR]) in a single buffered stream traversal pass.",
        "Try extracting CSV fields with line.split(\",\") and trimming leading/trailing whitespace from each column.",
        "Try handling a null or empty input stream defensively and returning 0 or an empty list without throwing NullPointerException."
    ],
    30: [
        "Try passing a negative limit to auditLedger and verify that all non-negative transactions are properly summed.",
        "Try passing an empty array to calculateBalance and verify that the initial balance is preserved with zero distortion.",
        "Try simulating an integer overflow in transaction auditing by adding Integer.MAX_VALUE and inspect overflow detection.",
        "Try validating that calculateBalance correctly processes both positive credit deposits and negative debit withdrawals.",
        "Try running the Month 1 Capstone audit test suite against a 100,000-transaction benchmark ledger and record execution latency."
    ]
}

for mod, file_path, var_name in modules:
    day_obj = getattr(mod, var_name)
    day_num = day_obj['day']
    prompts = tryit_prompts[day_num]
    for p_idx, part in enumerate(day_obj['parts']):
        part['tryIt'] = prompts[p_idx]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(f"# Day {day_num}: {day_obj['title']}\n\n")
        f.write(f"{var_name} = " + pprint.pformat(day_obj, width=120, sort_dicts=False) + "\n")
    print(f"Updated {file_path} with tryIt prompts.")

print("\nAll Days 21-30 scripts updated with interactive tryIt prompts!")
