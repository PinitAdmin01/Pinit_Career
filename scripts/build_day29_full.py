import sys
import pprint

p1_content = """### 1. The Java I/O Architecture: Byte Streams vs Character Streams

In enterprise software engineering, software applications rarely operate in isolated memory sandboxes. Systems must continuously exchange data with the physical outside world: reading configuration files from disk, ingesting log streams from cloud aggregators, persisting ledger records into relational storage engines, and streaming HTTP payloads across distributed networks. To coordinate this communication, Java provides the **`java.io`** and **`java.nio`** subsystems.

The foundational design of the Java I/O framework is built upon a profound structural duality: the separation between **Byte Streams** and **Character Streams**.

```
+------------------------------------------------------------------------------------+
| THE JAVA I/O DUAL STREAM ARCHITECTURE                                              |
+------------------------------------------------------------------------------------+
|                                  DATA SOURCE / SINK                                |
|                                           │                                        |
|                  ┌────────────────────────┴────────────────────────┐               |
|                  ▼                                                 ▼               |
|            BYTE STREAMS                                    CHARACTER STREAMS       |
|       (Raw 8-bit Binary Data)                           (16-bit Unicode Characters)|
|                  │                                                 │               |
|         ┌────────┴────────┐                               ┌────────┴────────┐      |
|         ▼                 ▼                               ▼                 ▼      |
|   InputStream       OutputStream                       Reader             Writer   |
|   - FileInputStream - FileOutputStream            - FileReader       - FileWriter  |
|   - ByteArrayIS     - ByteArrayOS                 - StringReader     - StringWriter|
|                  │                                                 ▲               |
|                  └────────► [InputStreamReader] ───────────────────┘               |
|                             (Charset Decoding: UTF-8)                              |
+------------------------------------------------------------------------------------+
```

1. **Byte Streams (`java.io.InputStream` & `java.io.OutputStream`)**:
   Byte streams represent the lowest level of stream abstraction, processing raw binary octets (8-bit bytes). Classes like `FileInputStream`, `ByteArrayInputStream`, and `BufferedInputStream` process raw data without interpreting human text semantics. They are ideal for images, video streams, compiled `.class` files, compressed archives, and serialized network packets. When you call `inputStream.read()`, it returns an integer between `0` and `255` representing the unsigned byte read, or `-1` to signal the End of File (EOF).

2. **Character Streams (`java.io.Reader` & `java.io.Writer`)**:
   Character streams process 16-bit Unicode characters (`char`), designed specifically for human-readable text files, CSV files, JSON payloads, and application logs. Classes like `FileReader`, `BufferedReader`, `StringReader`, and `PrintWriter` handle characters, taking into account text encodings like UTF-8, UTF-16, and ISO-8859-1. When you call `reader.read()`, it returns a 16-bit Unicode code point (or `-1` at EOF).

**The Bridge: Character Set Encoding and Decoding**
In the physical hardware universe, files and network sockets contain only bytes, not abstract characters. To bridge the gap, Java provides the **`java.io.InputStreamReader`** and **`java.io.OutputStreamWriter`** adapter classes. An `InputStreamReader` consumes raw bytes from an `InputStream` and decodes them into characters according to a specified `java.nio.charset.Charset`:
```java
Reader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
```
**Critical Invariant**: Always specify an explicit charset like `StandardCharsets.UTF_8`! Never rely on the platform default encoding (`Charset.defaultCharset()`), because software running on a Linux production container might default to UTF-8 while running on a developer's Windows desktop might default to Windows-1252, causing corrupt characters ("mojibake") and broken parser pipelines.

Furthermore, Java I/O extensively implements the **Decorator Pattern**. By wrapping basic streams with specialized decorator streams (e.g. `new BufferedReader(new InputStreamReader(fileInput, StandardCharsets.UTF_8))`), architects dynamically compose high-performance buffering, charset decoding, and line-reading capabilities onto basic byte sources.

In modern Java (Java 7 and later), the classic `java.io` stream hierarchy was supplemented by **Java NIO.2 (New I/O)** under `java.nio.file`. The core entry points of NIO.2 are **`java.nio.file.Path`** and **`java.nio.file.Files`**:
```java
Path logPath = Path.of("logs", "app.log");
try (BufferedReader reader = Files.newBufferedReader(logPath, StandardCharsets.UTF_8)) {
    // High-performance buffered reading with direct OS path integration!
}
```
Notice how `Files.newBufferedReader(Path, Charset)` combines the creation of the underlying byte stream, charset decoding, and 8KB buffering in a single factory call!

Furthermore, when handling massive multi-gigabyte server logs, architects must understand the critical operational difference between **`Files.readAllLines(Path)`** and **`Files.lines(Path)`**:
- **`Files.readAllLines(Path)`**: Reads the ENTIRE file into an in-memory `List<String>`. If your log file is 4GB and your JVM heap is 2GB, invoking this method triggers an unrecoverable `java.lang.OutOfMemoryError: Java heap space`!
- **`Files.lines(Path)`**: Returns a lazy **`Stream<String>`** backed by a `BufferedReader`. Lines are read incrementally off disk one-by-one as the stream pipeline advances. Memory consumption remains constant ($O(1)$) regardless of whether the log file is 10 megabytes or 100 gigabytes, making streaming the mandatory standard for enterprise data pipelines.

"""

p2_content = """### 2. High-Performance Buffering: `BufferedReader`, `BufferedWriter` & In-Memory String Streams

To appreciate why buffering is mandatory in production Java engineering, one must understand how the operating system communicates with physical hardware devices.

When an application invokes `fileInputStream.read()` on an unbuffered stream, the JVM cannot fulfill the request from RAM. Instead, it must execute a **User-to-Kernel Mode Switch**, issuing a native operating system system call (`read(2)`). The OS kernel halts the user thread, instructs the disk controller or network interface to retrieve a single byte, copies that byte across the kernel-user boundary, and resumes the thread. If a log file contains 1,000,000 bytes, unbuffered reading executes **one million operating system context switches**! This introduces devastating CPU degradation, saturates the system bus, and degrades throughput by orders of magnitude.

To eliminate this bottleneck, Java provides **`java.io.BufferedReader`** and **`java.io.BufferedWriter`**.

```
+------------------------------------------------------------------------------------+
| UNBUFFERED vs BUFFERED I/O ARCHITECTURE                                            |
+------------------------------------------------------------------------------------+
| UNBUFFERED READ (Slow & System-Call Intensive):                                    |
| [JVM Code] ──(1 byte)──► [OS Syscall read()] ──(1 byte)──► [Physical Disk Sector]  |
| Result: 10,000 bytes read = 10,000 OS syscalls and context switches!              |
+------------------------------------------------------------------------------------+
| BUFFERED READ (Blistering Fast Memory-Cache Locality):                             |
| [JVM Code] ◄──(1 char)─── [BufferedReader internal 8KB char[] buffer in RAM]      |
|                                         ▲                                          |
|                       (Bulk 8KB Syscall)│                                          |
|                           [OS Kernel File Cache]                                   |
| Result: 10,000 bytes read = ONLY 2 bulk OS reads! 99.98% of calls served from RAM!|
+------------------------------------------------------------------------------------+
```

Under the hood, `BufferedReader` allocates an internal character array buffer in heap memory (default size 8,192 characters / 8KB). When you request data, `BufferedReader` issues a single bulk read syscall to populate the entire 8KB buffer at once. Subsequent read requests are served directly from fast CPU cache RAM in a single clock cycle, without touching the operating system kernel!

Beyond bulk buffering, `BufferedReader` provides the indispensable **`readLine()`** method. The `readLine()` method scans through the internal buffer, reading characters until it encounters a newline sequence:
- Carriage Return (`\r` - legacy Mac)
- Line Feed (`\n` - Unix/Linux/macOS)
- Carriage Return + Line Feed (`\r\n` - Windows)
It automatically strips the trailing newline delimiters and returns the line content as a `String`. When the end of the stream is reached, `readLine()` returns **`null`**. This establishes the universal idiomatic stream reading loop in Java:
```java
String line;
while ((line = reader.readLine()) != null) {
    // Process line content...
}
```

In addition to file streams, Java provides in-memory stream adapters: **`java.io.StringReader`** and **`java.io.StringWriter`**. A `StringReader` wraps an in-memory Java `String` in the `Reader` interface. This allows software engineers to parse multi-line text strings using `BufferedReader` without writing files to disk:
```java
try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {
    // Stream parsing logic verified in lightning-fast unit tests!
}
```
This enables zero-I/O unit testing, allowing automated test suites to verify log parsers and CSV extractors entirely in memory with sub-millisecond execution times.

At the absolute cutting edge of high-performance Java systems engineering, processing multi-gigabyte files moves beyond stream buffers into **Memory-Mapped I/O** via `java.nio.channels.FileChannel`:
```java
try (FileChannel channel = FileChannel.open(logPath, StandardOpenOption.READ)) {
    MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_ONLY, 0, channel.size());
    // Directly query file bytes from OS page cache memory!
}
```
When a file is memory-mapped, the operating system kernel maps the physical disk sectors directly into the process's virtual memory address space. When your Java code reads from the `MappedByteBuffer`:
1. Zero data is copied into the JVM heap!
2. The read occurs with **Zero-Copy** semantics directly from the host operating system page cache.
3. If pages are not currently in physical RAM, the CPU hardware generates a minor page fault, transparently loading sectors into memory at hardware speeds.
High-throughput distributed event streaming engines like Apache Kafka, Apache Cassandra, and high-frequency trading matching engines rely on memory-mapped files and `BufferedReader` stream pipelines to achieve microsecond-level latency across petabytes of financial transactions.

"""

p3_content = """### 3. Stream Lifecycle & Deterministic Resource Management: The AutoCloseable Contract

In software engineering, managing physical operating system resources requires a discipline fundamentally different from managing standard Java heap objects. While the Garbage Collector automatically tracks and reclaims unused heap memory, **the Garbage Collector does NOT manage or close operating system file descriptors, network sockets, or database connections!**

When an application opens a file or network stream, the host operating system allocates an entry in the process's **File Descriptor Table**. Operating systems enforce strict limits on the maximum number of concurrent open file descriptors (governed by `ulimit -n` on Unix or handle quotas on Windows, typically 1,024 to 65,536). If an enterprise microservice continuously opens files or sockets without closing them:
1. The process exhausts available file descriptors.
2. The operating system refuses all subsequent file open and socket accept requests, throwing `java.io.IOException: Too many open files`.
3. On Windows, open file handles lock the target file on the NTFS filesystem, preventing other processes from deleting, renaming, or updating the file.
4. The service crashes or enters a zombie state, requiring emergency process restarts.

To guarantee deterministic resource cleanup, the `java.io` framework established the **`java.io.Closeable`** interface, which in Java 7 was retrofitted to extend **`java.lang.AutoCloseable`**:
```java
public interface Closeable extends AutoCloseable {
    void close() throws IOException;
}
```

Prior to Java 7, closing streams required convoluted, error-prone `finally` blocks:
```java
// LEGACY ANTI-PATTERN (Java 6 and earlier):
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("app.log"));
    // Process stream...
} finally {
    if (reader != null) {
        try {
            reader.close(); // May throw IOException itself!
        } catch (IOException e) {
            // Swallowing or logging close exception...
        }
    }
}
```
This legacy pattern was notorious for resource leaks. If `reader.close()` threw an `IOException`, any secondary resource cleanups placed after it were aborted.

Modern Java completely solved this through the **Try-With-Resources** statement:
```java
try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {
    String line;
    while ((line = reader.readLine()) != null) {
        // Safe, clean processing...
    }
} // reader.close() is GUARANTEED to execute here automatically!
```
When using try-with-resources:
- The resource must implement `AutoCloseable` or `Closeable`.
- The JVM guarantees that `close()` is invoked the moment the block terminates—regardless of whether execution completed normally, threw an exception, or executed a `return` statement.
- Furthermore, closing a wrapper stream (like `BufferedReader`) **automatically flushes and closes the underlying wrapped stream** (such as `InputStreamReader` and `FileInputStream`), unwinding the entire decorator chain deterministically.

In networked microservice environments, understanding stream lifecycle extends beyond files to **TCP Network Sockets (`java.net.Socket`)**.
When communicating across a network:
```java
try (Socket socket = new Socket("cluster.prod.internal", 9090);
     BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
     BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8))) {

    // CRITICAL RESILIENCE GUARD: Socket Read Timeout!
    socket.setSoTimeout(5000); // 5-second read timeout

    writer.write("HELO_LEDGER\n");
    writer.flush(); // Force transmission across network stack!

    String response = reader.readLine();
}
```
Notice two vital enterprise invariants:
1. **Explicit Flushing (`writer.flush()`)**: Because `BufferedWriter` buffers output in RAM, failing to call `flush()` leaves data trapped in local memory! The remote server sits waiting forever, causing distributed deadlocks.
2. **Socket Read Timeout (`socket.setSoTimeout(millis)`)**: By default, network socket reads in Java have a timeout of `0` (infinite timeout!). If a remote server freezes or a firewall drops packets silently without sending a TCP FIN/RST packet, the worker thread will hang permanently in the native `SocketInputStream.socketRead0` method, leaking thread pool resources. Always configure explicit socket timeouts.

Furthermore, in multi-threaded microservices, never share a single `BufferedReader` or `InputStream` across multiple concurrent threads without explicit synchronization. Stream pointer offsets (`pos`) and internal character buffers are not thread-safe; concurrent reads will interleave character chunks, corrupt state, or trigger unexpected `IOException` errors. Each worker thread should allocate and manage its own private stream instance, or read from synchronized queue structures.


"""

p4_content = """### 4. Production Parsing Strategies: CSV Delimiters, Escaping & Robust Line Tokenization

Parsing structured text streams—such as server access logs, CSV exports, configuration manifests, and financial ledgers—is a foundational duty of enterprise backend systems. However, naive text parsing code written without defensive bounds checking frequently crashes when confronted with real-world production data.

Consider the classic task of parsing Comma-Separated Values (CSV). In a simple scenario, a developer might attempt:
```java
String[] columns = line.split(",");
String firstColumn = columns[0];
```
While this functions on pristine test data, it collapses when encountering standard production variations:
1. **Empty Lines and Whitespace**: Network streams and log files frequently contain trailing blank lines or lines containing only spaces. Calling `line.split(",")` on a blank line produces an array with an empty string, or worse, can lead to out-of-bounds indexing if lines are malformed.
2. **Leading and Trailing Whitespace**: Columns often contain unintended padding spaces (e.g. `" 101 , Vinay , Dev "`). Calling `.trim()` on extracted tokens is essential to prevent whitespace corruption in downstream databases.
3. **Escaped Delimiters and Quotes**: What occurs if a column value contains a comma wrapped in quotation marks (e.g., `"101,\"Acme, Inc.\",Active"`)? Naive `split(",")` erroneously splits the company name into two separate columns, corrupting the entire row! In industrial systems handling complex CSV payloads, architects delegate to dedicated streaming parsers like **Apache Commons CSV** or **Jackson Dataformat CSV**.

```
+------------------------------------------------------------------------------------+
| HIGH-THROUGHPUT TOKENIZATION: REGEX SPLIT vs INDEX-BASED EXTRACTION                |
+------------------------------------------------------------------------------------+
| REGEX line.split(","):                                                             |
| 1. Compiles regex pattern or searches delimiters                                   |
| 2. Allocates String[] array on heap                                                |
| 3. Allocates substring objects for EVERY column, even ones you discard!            |
| Cost: Heavy Garbage Collector allocation pressure on millions of rows.            |
+------------------------------------------------------------------------------------+
| FAST TARGETED PARSING (IndexOf):                                                   |
| int commaIdx = line.indexOf(',');                                                  |
| String firstCol = (commaIdx != -1) ? line.substring(0, commaIdx) : line;          |
| Cost: Allocates ONLY the target token; zero intermediate array churn!              |
+------------------------------------------------------------------------------------+
```

For high-throughput stream processing where only the **first column** is needed (such as extracting transaction IDs or record keys from millions of log lines), using `line.split(",")` is an anti-pattern. If a CSV row contains 50 columns, `split(",")` allocates an array of 50 strings, even though columns 1 through 49 are immediately discarded!
Instead, high-performance engines use `line.indexOf(',')`:
```java
public static String extractFirstColFast(String line) {
    if (line == null) return "";
    int comma = line.indexOf(',');
    return (comma != -1) ? line.substring(0, comma).trim() : line.trim();
}
```
This zero-churn technique finds the first delimiter in a single CPU scan and allocates exactly one substring, reducing garbage collection overhead by over $90\\%$ on high-volume pipelines.


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
By utilizing state-machine scanning, the parser handles complex nested quotes (e.g. "101,Acme Inc,Active") with mathematical correctness and zero heap churn. In production environments where datasets exceed gigabytes, combining state-machine tokenizers with pre-allocated reusable character buffers enables processing gigabytes of financial transactions per second with negligible garbage collection overhead.

"""

p5_content = """### 5. Guided Coding Lab & Milestone Verification: Building `countErrorLines` and `extractFirstColumn`

To conclude Day 29, we implement and verify the two essential stream-parsing algorithms specified in the PinIT Career OS curriculum: the **Stream Error Log Parser (`countErrorLines`)** and the **CSV Field Stream Extractor (`extractFirstColumn`)**.

In the primary challenge, we implement `Solution.countErrorLines(String streamText)`. The specification mandates ingesting a multi-line string `streamText`, wrapping it in a `BufferedReader(new StringReader(streamText))`, reading each line sequentially, and counting how many lines strictly start with the prefix `"[ERROR]"`. If the input string is `null`, it must defensively return `0`.

```java
// ============================================================================
// CHALLENGE 1: STREAM ERROR LOG PARSER
// ============================================================================
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class Solution {
    /**
     * Parses a text stream and counts the number of lines starting with '[ERROR]'.
     * Returns 0 if streamText is null or if an IOException occurs.
     */
    public static int countErrorLines(String streamText) {
        // Step 1: Defensive guard for null input:
        if (streamText == null) {
            return 0;
        }

        int errorCount = 0;

        // Step 2: Use try-with-resources to ensure deterministic stream closure:
        try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {
            String line;

            // Step 3: Sequential line iteration until EOF (null):
            while ((line = reader.readLine()) != null) {
                // Step 4: Verify prefix:
                if (line.startsWith("[ERROR]")) {
                    errorCount++;
                }
            }
        } catch (IOException e) {
            // In-memory StringReader rarely throws IOException, but contract requires handling:
            return 0;
        }

        // Step 5: Return final tally:
        return errorCount;
    }
}
```

Let us trace `countErrorLines` with sample log input:
```
[INFO] Application starting...
[ERROR] Database connection timed out on port 5432
[DEBUG] Retrying pool connection...
[ERROR] Authentication failed for user 'admin'
[INFO] Graceful shutdown initiated
```
1. Line 1: `startsWith("[ERROR]")` is `false`.
2. Line 2: `startsWith("[ERROR]")` is `true` $\to$ `errorCount` becomes `1`.
3. Line 3: `startsWith("[ERROR]")` is `false`.
4. Line 4: `startsWith("[ERROR]")` is `true` $\to$ `errorCount` becomes `2`.
5. Line 5: `startsWith("[ERROR]")` is `false`.
6. Next `readLine()` returns `null` (EOF). Loop terminates. Returns `2`.

In the secondary assignment, we construct `SolutionAdv.extractFirstColumn(String csvText)`. The method parses a CSV text stream and returns an `ArrayList<String>` containing the trimmed value of the first column in each row, ignoring empty lines.

```java
// ============================================================================
// CHALLENGE 2: CSV FIELD STREAM EXTRACTOR
// ============================================================================
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;

public class SolutionAdv {
    /**
     * Extracts the first column from each row of a CSV text stream.
     * Returns an empty ArrayList if csvText is null.
     */
    public static ArrayList<String> extractFirstColumn(String csvText) {
        ArrayList<String> firstColumns = new ArrayList<>();

        // Step 1: Defensive guard for null input:
        if (csvText == null) {
            return firstColumns;
        }

        // Step 2: Stream line reading via try-with-resources:
        try (BufferedReader reader = new BufferedReader(new StringReader(csvText))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // Step 3: Skip blank lines:
                if (line.trim().isEmpty()) {
                    continue;
                }

                // Step 4: Split by comma and extract first column:
                String[] parts = line.split(",");
                if (parts.length > 0) {
                    firstColumns.add(parts[0].trim());
                }
            }
        } catch (IOException e) {
            return firstColumns;
        }

        return firstColumns;
    }
}
```

Let us verify `extractFirstColumn` with CSV sample:
```
ID,Name,Role
101,Vinay,Dev
102,Sarah,Arch
```
- Row 1: `parts[0]` is `"ID"`. Added to list.
- Row 2: `parts[0]` is `"101"`. Added to list.
- Row 3: `parts[0]` is `"102"`. Added to list.
- Returns `["ID", "101", "102"]` with size 3.

In automated test suites with JUnit 5:
```java
@Test
void testStreamErrorLogParser() {
    String logs = "[ERROR] Disk full\\n[INFO] Ok\\n[ERROR] Network drop";
    assertEquals(2, Solution.countErrorLines(logs));
    assertEquals(0, Solution.countErrorLines(null));
}

@Test
void testCsvFieldExtractor() {
    String csv = "Product,Qty,Price\\nLaptop,5,1200\\nMouse,50,25";
    ArrayList<String> cols = SolutionAdv.extractFirstColumn(csv);
    assertEquals(3, cols.size());
    assertEquals("Product", cols.get(0));
    assertEquals("Laptop", cols.get(1));
    assertEquals("Mouse", cols.get(2));
    assertTrue(SolutionAdv.extractFirstColumn(null).isEmpty());
}
```
Both stream implementations deliver robust error tolerance, zero resource leaks, and full compliance with the Day 29 specifications.
"""

DAY_29 = {
    "day": 29,
    "title": "Stream & Text I/O: Readers, Writers, Buffered Streams & Data Parsing",
    "goal": "Master Java Stream and Text I/O architecture. Understand Byte Streams vs Character Streams, decode bytes to characters via InputStreamReader, leverage BufferedReader line-buffering to eliminate operating system syscall bottlenecks, manage operating system file descriptors using try-with-resources and AutoCloseable, and implement countErrorLines and extractFirstColumn stream parsers.",
    "minutes": 25,
    "recap": "Yesterday we explored Multithreading, Runnable task decoupling, and thread lifecycles. Today, we delve into Java I/O architecture, learning how BufferedReaders and text streams process logs and CSV payloads with maximum throughput and zero resource leaks.",
    "summary": [
        "Java I/O bifurcates into 8-bit binary Byte Streams (InputStream/OutputStream) and 16-bit Unicode Character Streams (Reader/Writer).",
        "InputStreamReader bridges byte sources to character decoders, and must always specify explicit charsets like UTF-8.",
        "BufferedReader eliminates costly OS syscall context switches by buffering 8KB in RAM and providing line-by-line readLine() iteration.",
        "StringReader wraps in-memory strings into the Reader abstraction, enabling lightning-fast zero-I/O unit testing.",
        "Operating system file descriptors must be deterministically released using try-with-resources to prevent socket and handle exhaustion.",
        "The countErrorLines and extractFirstColumn challenges demonstrate robust defensive stream processing for server logs and CSV data."
    ],
    "projectStep": {
        "title": "Build the Stream Error Log Parser and CSV Extractor",
        "steps": [
            "Author Solution.countErrorLines(String streamText) using BufferedReader and StringReader.",
            "Inspect each line via while ((line = reader.readLine()) != null) and count lines starting with '[ERROR]'.",
            "Author SolutionAdv.extractFirstColumn(String csvText) returning ArrayList<String> of trimmed first columns.",
            "Enforce try-with-resources on all streams to guarantee deterministic resource management.",
            "Verify countErrorLines returns correct error counts and extractFirstColumn correctly isolates record identifiers."
        ]
    },
    "parts": [
        {
            "part": 1,
            "title": "The Java I/O Architecture: Byte Streams vs Character Streams",
            "content": p1_content.strip(),
            "code": """import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

public class ByteVsCharStreamLab {
    public static void main(String[] args) throws IOException {
        System.out.println("=== BYTE STREAMS vs CHARACTER STREAMS ===");

        // Raw binary bytes (e.g. UTF-8 encoded text):
        byte[] binaryData = "PinIT Career OS".getBytes(StandardCharsets.UTF_8);
        ByteArrayInputStream byteStream = new ByteArrayInputStream(binaryData);

        // Bridge byte stream to character stream with explicit UTF-8 decoding:
        Reader charStream = new InputStreamReader(byteStream, StandardCharsets.UTF_8);

        int charRead;
        System.out.print("Decoded Characters: ");
        while ((charRead = charStream.read()) != -1) {
            System.out.print((char) charRead);
        }
        System.out.println("\nStream reading completed successfully.");
    }
}""",
            "checks": [
                {
                    "question": "What is the fundamental difference between an InputStream and a Reader in Java?",
                    "options": [
                        "InputStream processes raw 8-bit binary bytes; Reader processes 16-bit Unicode characters with character set decoding",
                        "InputStream can only read from disk; Reader can only read from memory",
                        "InputStream is asynchronous; Reader is synchronous",
                        "InputStream is deprecated; Reader is modern"
                    ],
                    "answer": 0,
                    "explanation": "Byte streams (InputStream/OutputStream) handle raw binary bytes, while Character streams (Reader/Writer) handle decoded Unicode characters."
                },
                {
                    "question": "Why should enterprise engineers always specify an explicit charset like StandardCharsets.UTF_8 in InputStreamReader?",
                    "options": [
                        "To prevent mojibake and character corruption caused by differing platform default encodings across environments",
                        "To compress the file by 50%",
                        "Because Java disallows reading files without UTF-8",
                        "To convert the stream into a database table"
                    ],
                    "answer": 0,
                    "explanation": "Omitting explicit charsets causes the JVM to fall back to the platform default encoding, leading to bugs across different OS environments."
                },
                {
                    "question": "What design pattern is extensively used by Java I/O stream wrappers (e.g. BufferedReader wrapping FileReader)?",
                    "options": [
                        "Decorator Pattern",
                        "Singleton Pattern",
                        "Observer Pattern",
                        "Factory Method Pattern"
                    ],
                    "answer": 0,
                    "explanation": "Java I/O uses the Decorator pattern to wrap stream instances and add functionality like buffering or charset decoding."
                },
                {
                    "question": "What does stream.read() return when the end of a stream (EOF) is reached in Java?",
                    "options": [
                        "-1",
                        "0",
                        "null",
                        "Throws an EndOfFileException"
                    ],
                    "answer": 0,
                    "explanation": "Both InputStream.read() and Reader.read() return the integer -1 to signal that the end of the stream has been reached."
                }
            ]
        },
        {
            "part": 2,
            "title": "High-Performance Buffering: BufferedReader, BufferedWriter & In-Memory String Streams",
            "content": p2_content.strip(),
            "code": """import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class BufferedReaderLab {
    public static void main(String[] args) throws IOException {
        String serverLogs = "[INFO] Gateway initialized\\n[ERROR] Port 8080 collision\\n[INFO] Fallback to 8081";

        // In-memory stream buffering via StringReader and BufferedReader:
        try (BufferedReader reader = new BufferedReader(new StringReader(serverLogs))) {
            String line;
            int lineNum = 1;
            while ((line = reader.readLine()) != null) {
                System.out.println("Line " + lineNum++ + ": " + line);
            }
        }
    }
}""",
            "checks": [
                {
                    "question": "How does BufferedReader dramatically improve stream reading performance?",
                    "options": [
                        "By reading 8KB blocks into an internal memory buffer in bulk, serving subsequent reads from RAM and minimizing OS syscalls",
                        "By running on multiple GPU threads simultaneously",
                        "By deleting all comments from the file",
                        "By compressing the data using GZIP in background"
                    ],
                    "answer": 0,
                    "explanation": "BufferedReader reads large 8KB chunks in single OS syscalls, serving subsequent character requests from fast RAM."
                },
                {
                    "question": "What does bufferedReader.readLine() return when it reaches the end of the stream?",
                    "options": [
                        "null",
                        "An empty string (\"\")",
                        "-1",
                        "Throws an EOFException"
                    ],
                    "answer": 0,
                    "explanation": "BufferedReader.readLine() returns the string content of each line, or null to signal that the end of file (EOF) has been reached."
                },
                {
                    "question": "What is the primary use case of java.io.StringReader?",
                    "options": [
                        "To wrap an in-memory Java String as a Reader, enabling zero-I/O testing of stream parsers without touching disk",
                        "To print strings directly to physical paper printers",
                        "To convert strings into JSON format",
                        "To encrypt strings using AES"
                    ],
                    "answer": 0,
                    "explanation": "StringReader adapts in-memory strings into the Reader abstraction, making stream parsing utilities easily testable in unit tests."
                },
                {
                    "question": "Does readLine() include the newline terminator (\\n or \\r\\n) in the returned String?",
                    "options": [
                        "No, readLine() automatically strips the terminating newline characters from the returned string",
                        "Yes, the newline is always appended to the end of the string",
                        "Only on Windows platforms",
                        "Only if the line ends with a period"
                    ],
                    "answer": 0,
                    "explanation": "BufferedReader.readLine() strips trailing \\r, \\n, or \\r\\n characters, returning only the text content of the line."
                }
            ]
        },
        {
            "part": 3,
            "title": "Stream Lifecycle & Deterministic Resource Management: The AutoCloseable Contract",
            "content": p3_content.strip(),
            "code": """import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class StreamLifecycleLab {
    public static void main(String[] args) {
        String payload = "DataRow1\\nDataRow2\\nDataRow3";

        // Try-with-resources: Reader is closed deterministically even if exceptions occur!
        try (BufferedReader reader = new BufferedReader(new StringReader(payload))) {
            System.out.println("First line: " + reader.readLine());
        } catch (IOException e) {
            System.out.println("I/O failure: " + e.getMessage());
        }
        // At this point, reader.close() has already completed!
        System.out.println("Resource closed and file descriptors released.");
    }
}""",
            "checks": [
                {
                    "question": "Why must physical I/O streams and file handles be explicitly closed in Java?",
                    "options": [
                        "Because the Garbage Collector does not manage operating system file descriptors; unclosed streams cause handle exhaustion and crashes",
                        "Because open streams automatically delete files after 5 minutes",
                        "Because the operating system will shut down if more than 5 streams are open",
                        "Because Java security policies require all streams to be closed within 10 seconds"
                    ],
                    "answer": 0,
                    "explanation": "File descriptors are operating system kernel handles; failing to close streams leaks handles until the OS runs out of file descriptors."
                },
                {
                    "question": "What interface must a resource implement to be managed by a try-with-resources statement?",
                    "options": [
                        "java.lang.AutoCloseable (or java.io.Closeable)",
                        "java.io.Serializable",
                        "java.lang.Runnable",
                        "java.lang.Cloneable"
                    ],
                    "answer": 0,
                    "explanation": "Try-with-resources requires resources to implement java.lang.AutoCloseable, which defines the 'void close()' method."
                },
                {
                    "question": "When does try-with-resources invoke close() on declared resources?",
                    "options": [
                        "Automatically the instant the try block terminates, regardless of whether it completed normally or threw an exception",
                        "Only when the Garbage Collector runs hours later",
                        "Only when an unhandled exception occurs",
                        "Only when the application shuts down"
                    ],
                    "answer": 0,
                    "explanation": "The JVM guarantees that close() is invoked immediately when execution exits the try-with-resources block."
                },
                {
                    "question": "Does closing a BufferedReader also close its underlying wrapped Reader?",
                    "options": [
                        "Yes, wrapper stream close() methods automatically flush and close the underlying wrapped stream",
                        "No, each layer of the decorator chain must be closed with a separate try block",
                        "Only if explicitly configured in application.properties",
                        "Only on Linux operating systems"
                    ],
                    "answer": 0,
                    "explanation": "Closing a decorator stream automatically cascades and closes all wrapped underlying streams down the chain."
                }
            ]
        },
        {
            "part": 4,
            "title": "Production Parsing Strategies: CSV Delimiters, Escaping & Robust Line Tokenization",
            "content": p4_content.strip(),
            "code": """public class FastCsvTokenizerLab {
    // High-performance tokenization without regex array allocation:
    public static String extractFirstColFast(String csvLine) {
        if (csvLine == null) return "";
        int commaIndex = csvLine.indexOf(',');
        if (commaIndex != -1) {
            return csvLine.substring(0, commaIndex).trim();
        }
        return csvLine.trim();
    }

    public static void main(String[] args) {
        String row1 = "101, Vinay, Lead Architect";
        String row2 = "  202  , Sarah, VP Engineering";
        String row3 = "303_SingleColumnRow";

        System.out.println("Row 1 First Col: '" + extractFirstColFast(row1) + "'");
        System.out.println("Row 2 First Col: '" + extractFirstColFast(row2) + "'");
        System.out.println("Row 3 First Col: '" + extractFirstColFast(row3) + "'");
    }
}""",
            "checks": [
                {
                    "question": "Why is using line.split(',') on millions of CSV lines with 50 columns considered an anti-pattern?",
                    "options": [
                        "It allocates a 50-element String array and 50 substrings per row, causing severe Garbage Collector memory churn",
                        "Because split() cannot handle commas",
                        "Because split() is deprecated in Java 8",
                        "Because split() requires an internet connection"
                    ],
                    "answer": 0,
                    "explanation": "split(',') creates array objects and substrings for every single column; on high-volume pipelines, this creates massive heap allocation churn."
                },
                {
                    "question": "How can high-throughput parsers extract the first column of a CSV line with minimal heap allocation?",
                    "options": [
                        "By using line.indexOf(',') to locate the first delimiter and extracting a single substring(0, commaIndex)",
                        "By converting the string into an XML document",
                        "By running a background thread for each character",
                        "By serializing the line to a SQLite database"
                    ],
                    "answer": 0,
                    "explanation": "indexOf(',') and substring() locate the first token directly, avoiding allocating unused arrays or tokens for subsequent columns."
                },
                {
                    "question": "Why is calling .trim() essential when tokenizing fields from text streams?",
                    "options": [
                        "To eliminate unintended leading and trailing whitespace that could corrupt database keys or numeric conversions",
                        "To convert text from uppercase to lowercase",
                        "To encrypt sensitive data",
                        "To add padding spaces"
                    ],
                    "answer": 0,
                    "explanation": "Text streams frequently contain irregular whitespace; trim() ensures extracted tokens match exact keys without whitespace errors."
                },
                {
                    "question": "What limitation exists when parsing complex CSV data using simple comma delimiters?",
                    "options": [
                        "Simple split fails when columns contain commas wrapped inside quotation marks (e.g. '101,\"Acme, Inc.\"')",
                        "Java cannot read strings longer than 10 characters",
                        "Commas cannot be detected by Java",
                        "Simple split only works on numbers"
                    ],
                    "answer": 0,
                    "explanation": "Standard CSV permits commas inside quoted strings; simple delimiter splitting incorrectly splits quoted tokens."
                }
            ]
        },
        {
            "part": 5,
            "title": "Guided Coding Lab & Milestone Verification: Building countErrorLines and extractFirstColumn",
            "content": p5_content.strip(),
            "code": """import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;

public class SolutionLab {
    // Challenge 1: Stream Error Log Parser
    public static class Solution {
        public static int countErrorLines(String streamText) {
            if (streamText == null) return 0;
            int count = 0;
            try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.startsWith("[ERROR]")) {
                        count++;
                    }
                }
            } catch (IOException e) {
                return 0;
            }
            return count;
        }
    }

    // Challenge 2: CSV Field Stream Extractor
    public static class SolutionAdv {
        public static ArrayList<String> extractFirstColumn(String csvText) {
            ArrayList<String> list = new ArrayList<>();
            if (csvText == null) return list;
            try (BufferedReader reader = new BufferedReader(new StringReader(csvText))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.trim().isEmpty()) continue;
                    String[] parts = line.split(",");
                    list.add(parts[0].trim());
                }
            } catch (IOException e) {
                return list;
            }
            return list;
        }
    }

    public static void main(String[] args) {
        String logs = "[INFO] Start\\n[ERROR] DB failure\\n[DEBUG] Retry\\n[ERROR] Auth reject";
        int errors = Solution.countErrorLines(logs);
        System.out.println("Total error lines counted: " + errors); // 2

        String csv = "ID,Name,Role\\n101,Vinay,Dev\\n102,Sarah,Arch";
        ArrayList<String> firstCols = SolutionAdv.extractFirstColumn(csv);
        System.out.println("Extracted first columns:   " + firstCols); // [ID, 101, 102]
    }
}""",
            "checks": [
                {
                    "question": "In the Day 29 countErrorLines challenge, what does countErrorLines(null) return?",
                    "options": [
                        "0 defensively without throwing NullPointerException",
                        "-1",
                        "Throws a NullPointerException",
                        "Throws an IOException"
                    ],
                    "answer": 0,
                    "explanation": "The null guard 'if (streamText == null) return 0;' intercepts null references safely."
                },
                {
                    "question": "In countErrorLines, what method is used to verify if a line starts with '[ERROR]'?",
                    "options": [
                        "line.startsWith('[ERROR]')",
                        "line.equals('[ERROR]')",
                        "line.indexOf('[ERROR]') == line.length()",
                        "line.matches('.*')"
                    ],
                    "answer": 0,
                    "explanation": "String.startsWith('[ERROR]') efficiently tests whether the line begins with the target prefix."
                },
                {
                    "question": "In the Day 29 extractFirstColumn assignment, what does extractFirstColumn('ID,Name\\n101,Vinay') return?",
                    "options": [
                        "An ArrayList containing ['ID', '101']",
                        "An ArrayList containing ['ID', 'Name']",
                        "A single concatenated string 'ID101'",
                        "An empty list"
                    ],
                    "answer": 0,
                    "explanation": "The parser extracts parts[0].trim() from each row, returning ['ID', '101']."
                },
                {
                    "question": "Why does SolutionAdv.extractFirstColumn use BufferedReader instead of scanning the whole string?",
                    "options": [
                        "To handle arbitrary platform newline sequences (\\n, \\r\\n) uniformly line-by-line",
                        "Because strings cannot be split without a reader",
                        "To convert characters to integers",
                        "To lock the memory bus"
                    ],
                    "answer": 0,
                    "explanation": "BufferedReader.readLine() abstracts cross-platform newline variations and processes lines sequentially."
                }
            ]
        }
    ]
}

with open("scripts/block6_day29.py", "w", encoding="utf-8") as f:
    f.write("# Day 29: Stream & Text I/O: Readers, Writers, Buffered Streams & Data Parsing\n\nDAY_29 = ")
    f.write(pprint.pformat(DAY_29, indent=4, width=120))
    f.write("\n")

print("Wrote scripts/block6_day29.py successfully")
