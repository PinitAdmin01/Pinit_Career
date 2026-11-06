with open("scripts/build_day29_full.py", "r", encoding="utf-8") as f:
    text = f.read()

extra_p3_more = """
Furthermore, in multi-threaded microservices, never share a single `BufferedReader` or `InputStream` across multiple concurrent threads without explicit synchronization. Stream pointer offsets (`pos`) and internal character buffers are not thread-safe; concurrent reads will interleave character chunks, corrupt state, or trigger unexpected `IOException` errors. Each worker thread should allocate and manage its own private stream instance, or read from synchronized queue structures.
"""

extra_p4_full = """
To contrast parsing approaches in the Java ecosystem, consider `java.util.Scanner` versus `BufferedReader`:
```java
// AVOID IN HIGH-THROUGHPUT HOT PATHS:
Scanner scanner = new Scanner(streamText);
while (scanner.hasNextLine()) {
    String line = scanner.nextLine();
}
```
While `Scanner` provides convenient parsing methods like `nextInt()` and `nextDouble()`, it is significantly slower than `BufferedReader`. Under the hood, `Scanner` executes regular expression pattern matching on every single read operation! In benchmark evaluations, `BufferedReader` processes text streams up to four times faster than `Scanner`.

Furthermore, for mission-critical CSV parsing where fields may contain escaped quotes, commas, and multi-line values, software architects use specialized state-machine tokenizers:
```java
// Industrial CSV Parser Invariants:
// 1. Maintain a boolean inQuotes flag
// 2. Scan characters sequentially without allocating temporary arrays
// 3. Toggle inQuotes upon encountering unescaped quote marks
// 4. Split on comma ONLY when inQuotes is false
```
By utilizing state-machine scanning, the parser handles complex nested quotes (e.g. \"101,Acme Inc,Active\") with mathematical correctness and zero heap churn. In production environments where datasets exceed gigabytes, combining state-machine tokenizers with pre-allocated reusable character buffers enables processing gigabytes of financial transactions per second with negligible garbage collection overhead.
"""

# Replace in p3
target_p3 = "Alway configure explicit socket timeouts.\n"
if target_p3 not in text:
    target_p3 = "Always configure explicit socket timeouts.\n"
text = text.replace(target_p3, target_p3 + extra_p3_more + "\n")

# Replace in p4
p5_idx = text.find('p5_content =')
p4_end_idx = text.rfind('"""', 0, p5_idx)
text = text[:p4_end_idx] + "\n" + extra_p4_full + "\n" + text[p4_end_idx:]

with open("scripts/build_day29_full.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Directly enriched p3 and p4 in build_day29_full.py")
