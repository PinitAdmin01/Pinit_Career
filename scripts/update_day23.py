import sys

# Read current build_day23_full.py
with open("scripts/build_day23_full.py", "r", encoding="utf-8") as f:
    code = f.read()

extra_p3 = """
When multiple resources are managed in a single try-with-resources statement:
```java
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(query);
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        // Process data
    }
}
```
The JVM guarantees deterministic **LIFO (Last-In, First-Out)** cleanup order: `rs` is closed first, followed by `ps`, and finally `conn`. This matches the exact inverse order of allocation, ensuring foreign key locks and socket streams are unwound without orphaned handles. Furthermore, note that while legacy `java.io.Closeable` was restricted to throwing `IOException`, modern `java.lang.AutoCloseable` permits throwing any `Exception`. However, API designers strongly recommend making `close()` implementations idempotent—calling `close()` multiple times consecutively should have no adverse effect.
"""

extra_p4 = """
Finally, avoid the severe anti-pattern of **Using Exceptions for Normal Control Flow**. Some novice developers write loops that increment an index until an `ArrayIndexOutOfBoundsException` is caught, rather than checking `i < array.length`:
```java
// CATASTROPHIC ANTI-PATTERN: Loop termination via exception
try {
    int i = 0;
    while (true) {
        process(array[i++]);
    }
} catch (ArrayIndexOutOfBoundsException e) {
    // Normal loop completion!
}
```
In benchmark evaluations, this antipattern executes up to one hundred times slower than an ordinary indexed loop! The JVM CPU branch predictor and HotSpot loop vectorizer are completely disabled, and the repeated instantiation of exception objects saturates the young-generation garbage collection buffers. Exceptions must be strictly reserved for exceptional occurrences.
"""

# Replace in code
target_p3 = "diagnostic inspection.\n\"\"\""
replacement_p3 = f"diagnostic inspection.\n{extra_p3}\n\"\"\""

target_p4 = "APM traces.\n\"\"\""
replacement_p4 = f"APM traces.\n{extra_p4}\n\"\"\""

code = code.replace(target_p3, replacement_p3).replace(target_p4, replacement_p4)

with open("scripts/build_day23_full.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated build_day23_full.py")
