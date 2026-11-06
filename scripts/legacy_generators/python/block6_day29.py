# Day 29: Stream & Text I/O: Readers, Writers, Buffered Streams & Data Parsing

DAY_29 = {'day': 29,
 'goal': 'Master Java Stream and Text I/O architecture. Understand Byte Streams vs Character Streams, decode bytes to '
         'characters via InputStreamReader, leverage BufferedReader line-buffering to eliminate operating system '
         'syscall bottlenecks, manage operating system file descriptors using try-with-resources and AutoCloseable, '
         'and implement countErrorLines and extractFirstColumn stream parsers.',
 'minutes': 25,
 'parts': [{'checks': [{'answer': 0,
                        'explanation': 'Byte streams (InputStream/OutputStream) handle raw binary bytes, while '
                                       'Character streams (Reader/Writer) handle decoded Unicode characters.',
                        'options': ['InputStream processes raw 8-bit binary bytes; Reader processes 16-bit Unicode '
                                    'characters with character set decoding',
                                    'InputStream can only read from disk; Reader can only read from memory',
                                    'InputStream is asynchronous; Reader is synchronous',
                                    'InputStream is deprecated; Reader is modern'],
                        'question': 'What is the fundamental difference between an InputStream and a Reader in Java?'},
                       {'answer': 0,
                        'explanation': 'Omitting explicit charsets causes the JVM to fall back to the platform default '
                                       'encoding, leading to bugs across different OS environments.',
                        'options': ['To prevent mojibake and character corruption caused by differing platform default '
                                    'encodings across environments',
                                    'To compress the file by 50%',
                                    'Because Java disallows reading files without UTF-8',
                                    'To convert the stream into a database table'],
                        'question': 'Why should enterprise engineers always specify an explicit charset like '
                                    'StandardCharsets.UTF_8 in InputStreamReader?'},
                       {'answer': 0,
                        'explanation': 'Java I/O uses the Decorator pattern to wrap stream instances and add '
                                       'functionality like buffering or charset decoding.',
                        'options': ['Decorator Pattern',
                                    'Singleton Pattern',
                                    'Observer Pattern',
                                    'Factory Method Pattern'],
                        'question': 'What design pattern is extensively used by Java I/O stream wrappers (e.g. '
                                    'BufferedReader wrapping FileReader)?'},
                       {'answer': 0,
                        'explanation': 'Both InputStream.read() and Reader.read() return the integer -1 to signal that '
                                       'the end of the stream has been reached.',
                        'options': ['-1', '0', 'null', 'Throws an EndOfFileException'],
                        'question': 'What does stream.read() return when the end of a stream (EOF) is reached in '
                                    'Java?'}],
            'code': 'import java.io.ByteArrayInputStream;\n'
                    'import java.io.IOException;\n'
                    'import java.io.InputStreamReader;\n'
                    'import java.io.Reader;\n'
                    'import java.nio.charset.StandardCharsets;\n'
                    '\n'
                    'public class ByteVsCharStreamLab {\n'
                    '    public static void main(String[] args) throws IOException {\n'
                    '        System.out.println("=== BYTE STREAMS vs CHARACTER STREAMS ===");\n'
                    '\n'
                    '        // Raw binary bytes (e.g. UTF-8 encoded text):\n'
                    '        byte[] binaryData = "PinIT Career OS".getBytes(StandardCharsets.UTF_8);\n'
                    '        ByteArrayInputStream byteStream = new ByteArrayInputStream(binaryData);\n'
                    '\n'
                    '        // Bridge byte stream to character stream with explicit UTF-8 decoding:\n'
                    '        Reader charStream = new InputStreamReader(byteStream, StandardCharsets.UTF_8);\n'
                    '\n'
                    '        int charRead;\n'
                    '        System.out.print("Decoded Characters: ");\n'
                    '        while ((charRead = charStream.read()) != -1) {\n'
                    '            System.out.print((char) charRead);\n'
                    '        }\n'
                    '        System.out.println("\n'
                    'Stream reading completed successfully.");\n'
                    '    }\n'
                    '}',
            'content': '### 1. The Java I/O Architecture: Byte Streams vs Character Streams\n'
                       '\n'
                       'In enterprise software engineering, software applications rarely operate in isolated memory '
                       'sandboxes. Systems must continuously exchange data with the physical outside world: reading '
                       'configuration files from disk, ingesting log streams from cloud aggregators, persisting ledger '
                       'records into relational storage engines, and streaming HTTP payloads across distributed '
                       'networks. To coordinate this communication, Java provides the **`java.io`** and **`java.nio`** '
                       'subsystems.\n'
                       '\n'
                       'The foundational design of the Java I/O framework is built upon a profound structural duality: '
                       'the separation between **Byte Streams** and **Character Streams**.\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| THE JAVA I/O DUAL STREAM ARCHITECTURE                                              |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '|                                  DATA SOURCE / SINK                                |\n'
                       '|                                           │                                        |\n'
                       '|                  ┌────────────────────────┴────────────────────────┐               |\n'
                       '|                  ▼                                                 ▼               |\n'
                       '|            BYTE STREAMS                                    CHARACTER STREAMS       |\n'
                       '|       (Raw 8-bit Binary Data)                           (16-bit Unicode Characters)|\n'
                       '|                  │                                                 │               |\n'
                       '|         ┌────────┴────────┐                               ┌────────┴────────┐      |\n'
                       '|         ▼                 ▼                               ▼                 ▼      |\n'
                       '|   InputStream       OutputStream                       Reader             Writer   |\n'
                       '|   - FileInputStream - FileOutputStream            - FileReader       - FileWriter  |\n'
                       '|   - ByteArrayIS     - ByteArrayOS                 - StringReader     - StringWriter|\n'
                       '|                  │                                                 ▲               |\n'
                       '|                  └────────► [InputStreamReader] ───────────────────┘               |\n'
                       '|                             (Charset Decoding: UTF-8)                              |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       '1. **Byte Streams (`java.io.InputStream` & `java.io.OutputStream`)**:\n'
                       '   Byte streams represent the lowest level of stream abstraction, processing raw binary octets '
                       '(8-bit bytes). Classes like `FileInputStream`, `ByteArrayInputStream`, and '
                       '`BufferedInputStream` process raw data without interpreting human text semantics. They are '
                       'ideal for images, video streams, compiled `.class` files, compressed archives, and serialized '
                       'network packets. When you call `inputStream.read()`, it returns an integer between `0` and '
                       '`255` representing the unsigned byte read, or `-1` to signal the End of File (EOF).\n'
                       '\n'
                       '2. **Character Streams (`java.io.Reader` & `java.io.Writer`)**:\n'
                       '   Character streams process 16-bit Unicode characters (`char`), designed specifically for '
                       'human-readable text files, CSV files, JSON payloads, and application logs. Classes like '
                       '`FileReader`, `BufferedReader`, `StringReader`, and `PrintWriter` handle characters, taking '
                       'into account text encodings like UTF-8, UTF-16, and ISO-8859-1. When you call `reader.read()`, '
                       'it returns a 16-bit Unicode code point (or `-1` at EOF).\n'
                       '\n'
                       '**The Bridge: Character Set Encoding and Decoding**\n'
                       'In the physical hardware universe, files and network sockets contain only bytes, not abstract '
                       'characters. To bridge the gap, Java provides the **`java.io.InputStreamReader`** and '
                       '**`java.io.OutputStreamWriter`** adapter classes. An `InputStreamReader` consumes raw bytes '
                       'from an `InputStream` and decodes them into characters according to a specified '
                       '`java.nio.charset.Charset`:\n'
                       '```java\n'
                       'Reader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);\n'
                       '```\n'
                       '**Critical Invariant**: Always specify an explicit charset like `StandardCharsets.UTF_8`! '
                       'Never rely on the platform default encoding (`Charset.defaultCharset()`), because software '
                       "running on a Linux production container might default to UTF-8 while running on a developer's "
                       'Windows desktop might default to Windows-1252, causing corrupt characters ("mojibake") and '
                       'broken parser pipelines.\n'
                       '\n'
                       'Furthermore, Java I/O extensively implements the **Decorator Pattern**. By wrapping basic '
                       'streams with specialized decorator streams (e.g. `new BufferedReader(new '
                       'InputStreamReader(fileInput, StandardCharsets.UTF_8))`), architects dynamically compose '
                       'high-performance buffering, charset decoding, and line-reading capabilities onto basic byte '
                       'sources.\n'
                       '\n'
                       'In modern Java (Java 7 and later), the classic `java.io` stream hierarchy was supplemented by '
                       '**Java NIO.2 (New I/O)** under `java.nio.file`. The core entry points of NIO.2 are '
                       '**`java.nio.file.Path`** and **`java.nio.file.Files`**:\n'
                       '```java\n'
                       'Path logPath = Path.of("logs", "app.log");\n'
                       'try (BufferedReader reader = Files.newBufferedReader(logPath, StandardCharsets.UTF_8)) {\n'
                       '    // High-performance buffered reading with direct OS path integration!\n'
                       '}\n'
                       '```\n'
                       'Notice how `Files.newBufferedReader(Path, Charset)` combines the creation of the underlying '
                       'byte stream, charset decoding, and 8KB buffering in a single factory call!\n'
                       '\n'
                       'Furthermore, when handling massive multi-gigabyte server logs, architects must understand the '
                       'critical operational difference between **`Files.readAllLines(Path)`** and '
                       '**`Files.lines(Path)`**:\n'
                       '- **`Files.readAllLines(Path)`**: Reads the ENTIRE file into an in-memory `List<String>`. If '
                       'your log file is 4GB and your JVM heap is 2GB, invoking this method triggers an unrecoverable '
                       '`java.lang.OutOfMemoryError: Java heap space`!\n'
                       '- **`Files.lines(Path)`**: Returns a lazy **`Stream<String>`** backed by a `BufferedReader`. '
                       'Lines are read incrementally off disk one-by-one as the stream pipeline advances. Memory '
                       'consumption remains constant ($O(1)$) regardless of whether the log file is 10 megabytes or '
                       '100 gigabytes, making streaming the mandatory standard for enterprise data pipelines.',
            'part': 1,
            'title': 'The Java I/O Architecture: Byte Streams vs Character Streams',
            'tryIt': 'Try reading a multi-line string using BufferedReader.readLine() in a while ((line = '
                     'reader.readLine()) != null) loop.'},
           {'checks': [{'answer': 0,
                        'explanation': 'BufferedReader reads large 8KB chunks in single OS syscalls, serving '
                                       'subsequent character requests from fast RAM.',
                        'options': ['By reading 8KB blocks into an internal memory buffer in bulk, serving subsequent '
                                    'reads from RAM and minimizing OS syscalls',
                                    'By running on multiple GPU threads simultaneously',
                                    'By deleting all comments from the file',
                                    'By compressing the data using GZIP in background'],
                        'question': 'How does BufferedReader dramatically improve stream reading performance?'},
                       {'answer': 0,
                        'explanation': 'BufferedReader.readLine() returns the string content of each line, or null to '
                                       'signal that the end of file (EOF) has been reached.',
                        'options': ['null', 'An empty string ("")', '-1', 'Throws an EOFException'],
                        'question': 'What does bufferedReader.readLine() return when it reaches the end of the '
                                    'stream?'},
                       {'answer': 0,
                        'explanation': 'StringReader adapts in-memory strings into the Reader abstraction, making '
                                       'stream parsing utilities easily testable in unit tests.',
                        'options': ['To wrap an in-memory Java String as a Reader, enabling zero-I/O testing of stream '
                                    'parsers without touching disk',
                                    'To print strings directly to physical paper printers',
                                    'To convert strings into JSON format',
                                    'To encrypt strings using AES'],
                        'question': 'What is the primary use case of java.io.StringReader?'},
                       {'answer': 0,
                        'explanation': 'BufferedReader.readLine() strips trailing \\r, \\n, or \\r\\n characters, '
                                       'returning only the text content of the line.',
                        'options': ['No, readLine() automatically strips the terminating newline characters from the '
                                    'returned string',
                                    'Yes, the newline is always appended to the end of the string',
                                    'Only on Windows platforms',
                                    'Only if the line ends with a period'],
                        'question': 'Does readLine() include the newline terminator (\\n or \\r\\n) in the returned '
                                    'String?'}],
            'code': 'import java.io.BufferedReader;\n'
                    'import java.io.IOException;\n'
                    'import java.io.StringReader;\n'
                    '\n'
                    'public class BufferedReaderLab {\n'
                    '    public static void main(String[] args) throws IOException {\n'
                    '        String serverLogs = "[INFO] Gateway initialized\\n[ERROR] Port 8080 collision\\n[INFO] '
                    'Fallback to 8081";\n'
                    '\n'
                    '        // In-memory stream buffering via StringReader and BufferedReader:\n'
                    '        try (BufferedReader reader = new BufferedReader(new StringReader(serverLogs))) {\n'
                    '            String line;\n'
                    '            int lineNum = 1;\n'
                    '            while ((line = reader.readLine()) != null) {\n'
                    '                System.out.println("Line " + lineNum++ + ": " + line);\n'
                    '            }\n'
                    '        }\n'
                    '    }\n'
                    '}',
            'content': '### 2. High-Performance Buffering: `BufferedReader`, `BufferedWriter` & In-Memory String '
                       'Streams\n'
                       '\n'
                       'To appreciate why buffering is mandatory in production Java engineering, one must understand '
                       'how the operating system communicates with physical hardware devices.\n'
                       '\n'
                       'When an application invokes `fileInputStream.read()` on an unbuffered stream, the JVM cannot '
                       'fulfill the request from RAM. Instead, it must execute a **User-to-Kernel Mode Switch**, '
                       'issuing a native operating system system call (`read(2)`). The OS kernel halts the user '
                       'thread, instructs the disk controller or network interface to retrieve a single byte, copies '
                       'that byte across the kernel-user boundary, and resumes the thread. If a log file contains '
                       '1,000,000 bytes, unbuffered reading executes **one million operating system context '
                       'switches**! This introduces devastating CPU degradation, saturates the system bus, and '
                       'degrades throughput by orders of magnitude.\n'
                       '\n'
                       'To eliminate this bottleneck, Java provides **`java.io.BufferedReader`** and '
                       '**`java.io.BufferedWriter`**.\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| UNBUFFERED vs BUFFERED I/O ARCHITECTURE                                            |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| UNBUFFERED READ (Slow & System-Call Intensive):                                    |\n'
                       '| [JVM Code] ──(1 byte)──► [OS Syscall read()] ──(1 byte)──► [Physical Disk Sector]  |\n'
                       '| Result: 10,000 bytes read = 10,000 OS syscalls and context switches!              |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| BUFFERED READ (Blistering Fast Memory-Cache Locality):                             |\n'
                       '| [JVM Code] ◄──(1 char)─── [BufferedReader internal 8KB char[] buffer in RAM]      |\n'
                       '|                                         ▲                                          |\n'
                       '|                       (Bulk 8KB Syscall)│                                          |\n'
                       '|                           [OS Kernel File Cache]                                   |\n'
                       '| Result: 10,000 bytes read = ONLY 2 bulk OS reads! 99.98% of calls served from RAM!|\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       'Under the hood, `BufferedReader` allocates an internal character array buffer in heap memory '
                       '(default size 8,192 characters / 8KB). When you request data, `BufferedReader` issues a single '
                       'bulk read syscall to populate the entire 8KB buffer at once. Subsequent read requests are '
                       'served directly from fast CPU cache RAM in a single clock cycle, without touching the '
                       'operating system kernel!\n'
                       '\n'
                       'Beyond bulk buffering, `BufferedReader` provides the indispensable **`readLine()`** method. '
                       'The `readLine()` method scans through the internal buffer, reading characters until it '
                       'encounters a newline sequence:\n'
                       '- Carriage Return (`\r'
                       '` - legacy Mac)\n'
                       '- Line Feed (`\n'
                       '` - Unix/Linux/macOS)\n'
                       '- Carriage Return + Line Feed (`\r\n'
                       '` - Windows)\n'
                       'It automatically strips the trailing newline delimiters and returns the line content as a '
                       '`String`. When the end of the stream is reached, `readLine()` returns **`null`**. This '
                       'establishes the universal idiomatic stream reading loop in Java:\n'
                       '```java\n'
                       'String line;\n'
                       'while ((line = reader.readLine()) != null) {\n'
                       '    // Process line content...\n'
                       '}\n'
                       '```\n'
                       '\n'
                       'In addition to file streams, Java provides in-memory stream adapters: '
                       '**`java.io.StringReader`** and **`java.io.StringWriter`**. A `StringReader` wraps an in-memory '
                       'Java `String` in the `Reader` interface. This allows software engineers to parse multi-line '
                       'text strings using `BufferedReader` without writing files to disk:\n'
                       '```java\n'
                       'try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {\n'
                       '    // Stream parsing logic verified in lightning-fast unit tests!\n'
                       '}\n'
                       '```\n'
                       'This enables zero-I/O unit testing, allowing automated test suites to verify log parsers and '
                       'CSV extractors entirely in memory with sub-millisecond execution times.\n'
                       '\n'
                       'At the absolute cutting edge of high-performance Java systems engineering, processing '
                       'multi-gigabyte files moves beyond stream buffers into **Memory-Mapped I/O** via '
                       '`java.nio.channels.FileChannel`:\n'
                       '```java\n'
                       'try (FileChannel channel = FileChannel.open(logPath, StandardOpenOption.READ)) {\n'
                       '    MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_ONLY, 0, channel.size());\n'
                       '    // Directly query file bytes from OS page cache memory!\n'
                       '}\n'
                       '```\n'
                       'When a file is memory-mapped, the operating system kernel maps the physical disk sectors '
                       "directly into the process's virtual memory address space. When your Java code reads from the "
                       '`MappedByteBuffer`:\n'
                       '1. Zero data is copied into the JVM heap!\n'
                       '2. The read occurs with **Zero-Copy** semantics directly from the host operating system page '
                       'cache.\n'
                       '3. If pages are not currently in physical RAM, the CPU hardware generates a minor page fault, '
                       'transparently loading sectors into memory at hardware speeds.\n'
                       'High-throughput distributed event streaming engines like Apache Kafka, Apache Cassandra, and '
                       'high-frequency trading matching engines rely on memory-mapped files and `BufferedReader` '
                       'stream pipelines to achieve microsecond-level latency across petabytes of financial '
                       'transactions.',
            'part': 2,
            'title': 'High-Performance Buffering: BufferedReader, BufferedWriter & In-Memory String Streams',
            'tryIt': 'Try using try-with-resources (try (BufferedReader br = ...)) and verify that close() is '
                     'automatically invoked even on I/O error.'},
           {'checks': [{'answer': 0,
                        'explanation': 'File descriptors are operating system kernel handles; failing to close streams '
                                       'leaks handles until the OS runs out of file descriptors.',
                        'options': ['Because the Garbage Collector does not manage operating system file descriptors; '
                                    'unclosed streams cause handle exhaustion and crashes',
                                    'Because open streams automatically delete files after 5 minutes',
                                    'Because the operating system will shut down if more than 5 streams are open',
                                    'Because Java security policies require all streams to be closed within 10 '
                                    'seconds'],
                        'question': 'Why must physical I/O streams and file handles be explicitly closed in Java?'},
                       {'answer': 0,
                        'explanation': 'Try-with-resources requires resources to implement java.lang.AutoCloseable, '
                                       "which defines the 'void close()' method.",
                        'options': ['java.lang.AutoCloseable (or java.io.Closeable)',
                                    'java.io.Serializable',
                                    'java.lang.Runnable',
                                    'java.lang.Cloneable'],
                        'question': 'What interface must a resource implement to be managed by a try-with-resources '
                                    'statement?'},
                       {'answer': 0,
                        'explanation': 'The JVM guarantees that close() is invoked immediately when execution exits '
                                       'the try-with-resources block.',
                        'options': ['Automatically the instant the try block terminates, regardless of whether it '
                                    'completed normally or threw an exception',
                                    'Only when the Garbage Collector runs hours later',
                                    'Only when an unhandled exception occurs',
                                    'Only when the application shuts down'],
                        'question': 'When does try-with-resources invoke close() on declared resources?'},
                       {'answer': 0,
                        'explanation': 'Closing a decorator stream automatically cascades and closes all wrapped '
                                       'underlying streams down the chain.',
                        'options': ['Yes, wrapper stream close() methods automatically flush and close the underlying '
                                    'wrapped stream',
                                    'No, each layer of the decorator chain must be closed with a separate try block',
                                    'Only if explicitly configured in application.properties',
                                    'Only on Linux operating systems'],
                        'question': 'Does closing a BufferedReader also close its underlying wrapped Reader?'}],
            'code': 'import java.io.BufferedReader;\n'
                    'import java.io.IOException;\n'
                    'import java.io.StringReader;\n'
                    '\n'
                    'public class StreamLifecycleLab {\n'
                    '    public static void main(String[] args) {\n'
                    '        String payload = "DataRow1\\nDataRow2\\nDataRow3";\n'
                    '\n'
                    '        // Try-with-resources: Reader is closed deterministically even if exceptions occur!\n'
                    '        try (BufferedReader reader = new BufferedReader(new StringReader(payload))) {\n'
                    '            System.out.println("First line: " + reader.readLine());\n'
                    '        } catch (IOException e) {\n'
                    '            System.out.println("I/O failure: " + e.getMessage());\n'
                    '        }\n'
                    '        // At this point, reader.close() has already completed!\n'
                    '        System.out.println("Resource closed and file descriptors released.");\n'
                    '    }\n'
                    '}',
            'content': '### 3. Stream Lifecycle & Deterministic Resource Management: The AutoCloseable Contract\n'
                       '\n'
                       'In software engineering, managing physical operating system resources requires a discipline '
                       'fundamentally different from managing standard Java heap objects. While the Garbage Collector '
                       'automatically tracks and reclaims unused heap memory, **the Garbage Collector does NOT manage '
                       'or close operating system file descriptors, network sockets, or database connections!**\n'
                       '\n'
                       'When an application opens a file or network stream, the host operating system allocates an '
                       "entry in the process's **File Descriptor Table**. Operating systems enforce strict limits on "
                       'the maximum number of concurrent open file descriptors (governed by `ulimit -n` on Unix or '
                       'handle quotas on Windows, typically 1,024 to 65,536). If an enterprise microservice '
                       'continuously opens files or sockets without closing them:\n'
                       '1. The process exhausts available file descriptors.\n'
                       '2. The operating system refuses all subsequent file open and socket accept requests, throwing '
                       '`java.io.IOException: Too many open files`.\n'
                       '3. On Windows, open file handles lock the target file on the NTFS filesystem, preventing other '
                       'processes from deleting, renaming, or updating the file.\n'
                       '4. The service crashes or enters a zombie state, requiring emergency process restarts.\n'
                       '\n'
                       'To guarantee deterministic resource cleanup, the `java.io` framework established the '
                       '**`java.io.Closeable`** interface, which in Java 7 was retrofitted to extend '
                       '**`java.lang.AutoCloseable`**:\n'
                       '```java\n'
                       'public interface Closeable extends AutoCloseable {\n'
                       '    void close() throws IOException;\n'
                       '}\n'
                       '```\n'
                       '\n'
                       'Prior to Java 7, closing streams required convoluted, error-prone `finally` blocks:\n'
                       '```java\n'
                       '// LEGACY ANTI-PATTERN (Java 6 and earlier):\n'
                       'BufferedReader reader = null;\n'
                       'try {\n'
                       '    reader = new BufferedReader(new FileReader("app.log"));\n'
                       '    // Process stream...\n'
                       '} finally {\n'
                       '    if (reader != null) {\n'
                       '        try {\n'
                       '            reader.close(); // May throw IOException itself!\n'
                       '        } catch (IOException e) {\n'
                       '            // Swallowing or logging close exception...\n'
                       '        }\n'
                       '    }\n'
                       '}\n'
                       '```\n'
                       'This legacy pattern was notorious for resource leaks. If `reader.close()` threw an '
                       '`IOException`, any secondary resource cleanups placed after it were aborted.\n'
                       '\n'
                       'Modern Java completely solved this through the **Try-With-Resources** statement:\n'
                       '```java\n'
                       'try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {\n'
                       '    String line;\n'
                       '    while ((line = reader.readLine()) != null) {\n'
                       '        // Safe, clean processing...\n'
                       '    }\n'
                       '} // reader.close() is GUARANTEED to execute here automatically!\n'
                       '```\n'
                       'When using try-with-resources:\n'
                       '- The resource must implement `AutoCloseable` or `Closeable`.\n'
                       '- The JVM guarantees that `close()` is invoked the moment the block terminates—regardless of '
                       'whether execution completed normally, threw an exception, or executed a `return` statement.\n'
                       '- Furthermore, closing a wrapper stream (like `BufferedReader`) **automatically flushes and '
                       'closes the underlying wrapped stream** (such as `InputStreamReader` and `FileInputStream`), '
                       'unwinding the entire decorator chain deterministically.\n'
                       '\n'
                       'In networked microservice environments, understanding stream lifecycle extends beyond files to '
                       '**TCP Network Sockets (`java.net.Socket`)**.\n'
                       'When communicating across a network:\n'
                       '```java\n'
                       'try (Socket socket = new Socket("cluster.prod.internal", 9090);\n'
                       '     BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), '
                       'StandardCharsets.UTF_8));\n'
                       '     BufferedWriter writer = new BufferedWriter(new '
                       'OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8))) {\n'
                       '\n'
                       '    // CRITICAL RESILIENCE GUARD: Socket Read Timeout!\n'
                       '    socket.setSoTimeout(5000); // 5-second read timeout\n'
                       '\n'
                       '    writer.write("HELO_LEDGER\n'
                       '");\n'
                       '    writer.flush(); // Force transmission across network stack!\n'
                       '\n'
                       '    String response = reader.readLine();\n'
                       '}\n'
                       '```\n'
                       'Notice two vital enterprise invariants:\n'
                       '1. **Explicit Flushing (`writer.flush()`)**: Because `BufferedWriter` buffers output in RAM, '
                       'failing to call `flush()` leaves data trapped in local memory! The remote server sits waiting '
                       'forever, causing distributed deadlocks.\n'
                       '2. **Socket Read Timeout (`socket.setSoTimeout(millis)`)**: By default, network socket reads '
                       'in Java have a timeout of `0` (infinite timeout!). If a remote server freezes or a firewall '
                       'drops packets silently without sending a TCP FIN/RST packet, the worker thread will hang '
                       'permanently in the native `SocketInputStream.socketRead0` method, leaking thread pool '
                       'resources. Always configure explicit socket timeouts.\n'
                       '\n'
                       'Furthermore, in multi-threaded microservices, never share a single `BufferedReader` or '
                       '`InputStream` across multiple concurrent threads without explicit synchronization. Stream '
                       'pointer offsets (`pos`) and internal character buffers are not thread-safe; concurrent reads '
                       'will interleave character chunks, corrupt state, or trigger unexpected `IOException` errors. '
                       'Each worker thread should allocate and manage its own private stream instance, or read from '
                       'synchronized queue structures.',
            'part': 3,
            'title': 'Stream Lifecycle & Deterministic Resource Management: The AutoCloseable Contract',
            'tryIt': 'Try counting lines matching different severity levels ([INFO], [WARN], [ERROR]) in a single '
                     'buffered stream traversal pass.'},
           {'checks': [{'answer': 0,
                        'explanation': "split(',') creates array objects and substrings for every single column; on "
                                       'high-volume pipelines, this creates massive heap allocation churn.',
                        'options': ['It allocates a 50-element String array and 50 substrings per row, causing severe '
                                    'Garbage Collector memory churn',
                                    'Because split() cannot handle commas',
                                    'Because split() is deprecated in Java 8',
                                    'Because split() requires an internet connection'],
                        'question': "Why is using line.split(',') on millions of CSV lines with 50 columns considered "
                                    'an anti-pattern?'},
                       {'answer': 0,
                        'explanation': "indexOf(',') and substring() locate the first token directly, avoiding "
                                       'allocating unused arrays or tokens for subsequent columns.',
                        'options': ["By using line.indexOf(',') to locate the first delimiter and extracting a single "
                                    'substring(0, commaIndex)',
                                    'By converting the string into an XML document',
                                    'By running a background thread for each character',
                                    'By serializing the line to a SQLite database'],
                        'question': 'How can high-throughput parsers extract the first column of a CSV line with '
                                    'minimal heap allocation?'},
                       {'answer': 0,
                        'explanation': 'Text streams frequently contain irregular whitespace; trim() ensures extracted '
                                       'tokens match exact keys without whitespace errors.',
                        'options': ['To eliminate unintended leading and trailing whitespace that could corrupt '
                                    'database keys or numeric conversions',
                                    'To convert text from uppercase to lowercase',
                                    'To encrypt sensitive data',
                                    'To add padding spaces'],
                        'question': 'Why is calling .trim() essential when tokenizing fields from text streams?'},
                       {'answer': 0,
                        'explanation': 'Standard CSV permits commas inside quoted strings; simple delimiter splitting '
                                       'incorrectly splits quoted tokens.',
                        'options': ['Simple split fails when columns contain commas wrapped inside quotation marks '
                                    '(e.g. \'101,"Acme, Inc."\')',
                                    'Java cannot read strings longer than 10 characters',
                                    'Commas cannot be detected by Java',
                                    'Simple split only works on numbers'],
                        'question': 'What limitation exists when parsing complex CSV data using simple comma '
                                    'delimiters?'}],
            'code': 'public class FastCsvTokenizerLab {\n'
                    '    // High-performance tokenization without regex array allocation:\n'
                    '    public static String extractFirstColFast(String csvLine) {\n'
                    '        if (csvLine == null) return "";\n'
                    "        int commaIndex = csvLine.indexOf(',');\n"
                    '        if (commaIndex != -1) {\n'
                    '            return csvLine.substring(0, commaIndex).trim();\n'
                    '        }\n'
                    '        return csvLine.trim();\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        String row1 = "101, Vinay, Lead Architect";\n'
                    '        String row2 = "  202  , Sarah, VP Engineering";\n'
                    '        String row3 = "303_SingleColumnRow";\n'
                    '\n'
                    '        System.out.println("Row 1 First Col: \'" + extractFirstColFast(row1) + "\'");\n'
                    '        System.out.println("Row 2 First Col: \'" + extractFirstColFast(row2) + "\'");\n'
                    '        System.out.println("Row 3 First Col: \'" + extractFirstColFast(row3) + "\'");\n'
                    '    }\n'
                    '}',
            'content': '### 4. Production Parsing Strategies: CSV Delimiters, Escaping & Robust Line Tokenization\n'
                       '\n'
                       'Parsing structured text streams—such as server access logs, CSV exports, configuration '
                       'manifests, and financial ledgers—is a foundational duty of enterprise backend systems. '
                       'However, naive text parsing code written without defensive bounds checking frequently crashes '
                       'when confronted with real-world production data.\n'
                       '\n'
                       'Consider the classic task of parsing Comma-Separated Values (CSV). In a simple scenario, a '
                       'developer might attempt:\n'
                       '```java\n'
                       'String[] columns = line.split(",");\n'
                       'String firstColumn = columns[0];\n'
                       '```\n'
                       'While this functions on pristine test data, it collapses when encountering standard production '
                       'variations:\n'
                       '1. **Empty Lines and Whitespace**: Network streams and log files frequently contain trailing '
                       'blank lines or lines containing only spaces. Calling `line.split(",")` on a blank line '
                       'produces an array with an empty string, or worse, can lead to out-of-bounds indexing if lines '
                       'are malformed.\n'
                       '2. **Leading and Trailing Whitespace**: Columns often contain unintended padding spaces (e.g. '
                       '`" 101 , Vinay , Dev "`). Calling `.trim()` on extracted tokens is essential to prevent '
                       'whitespace corruption in downstream databases.\n'
                       '3. **Escaped Delimiters and Quotes**: What occurs if a column value contains a comma wrapped '
                       'in quotation marks (e.g., `"101,"Acme, Inc.",Active"`)? Naive `split(",")` erroneously splits '
                       'the company name into two separate columns, corrupting the entire row! In industrial systems '
                       'handling complex CSV payloads, architects delegate to dedicated streaming parsers like '
                       '**Apache Commons CSV** or **Jackson Dataformat CSV**.\n'
                       '\n'
                       '```\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| HIGH-THROUGHPUT TOKENIZATION: REGEX SPLIT vs INDEX-BASED EXTRACTION                |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| REGEX line.split(","):                                                             |\n'
                       '| 1. Compiles regex pattern or searches delimiters                                   |\n'
                       '| 2. Allocates String[] array on heap                                                |\n'
                       '| 3. Allocates substring objects for EVERY column, even ones you discard!            |\n'
                       '| Cost: Heavy Garbage Collector allocation pressure on millions of rows.            |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '| FAST TARGETED PARSING (IndexOf):                                                   |\n'
                       "| int commaIdx = line.indexOf(',');                                                  |\n"
                       '| String firstCol = (commaIdx != -1) ? line.substring(0, commaIdx) : line;          |\n'
                       '| Cost: Allocates ONLY the target token; zero intermediate array churn!              |\n'
                       '+------------------------------------------------------------------------------------+\n'
                       '```\n'
                       '\n'
                       'For high-throughput stream processing where only the **first column** is needed (such as '
                       'extracting transaction IDs or record keys from millions of log lines), using `line.split(",")` '
                       'is an anti-pattern. If a CSV row contains 50 columns, `split(",")` allocates an array of 50 '
                       'strings, even though columns 1 through 49 are immediately discarded!\n'
                       "Instead, high-performance engines use `line.indexOf(',')`:\n"
                       '```java\n'
                       'public static String extractFirstColFast(String line) {\n'
                       '    if (line == null) return "";\n'
                       "    int comma = line.indexOf(',');\n"
                       '    return (comma != -1) ? line.substring(0, comma).trim() : line.trim();\n'
                       '}\n'
                       '```\n'
                       'This zero-churn technique finds the first delimiter in a single CPU scan and allocates exactly '
                       'one substring, reducing garbage collection overhead by over $90\\%$ on high-volume pipelines.\n'
                       '\n'
                       '\n'
                       'To contrast parsing approaches in the Java ecosystem, consider `java.util.Scanner` versus '
                       '`BufferedReader`:\n'
                       '```java\n'
                       '// AVOID IN HIGH-THROUGHPUT HOT PATHS:\n'
                       'Scanner scanner = new Scanner(streamText);\n'
                       'while (scanner.hasNextLine()) {\n'
                       '    String line = scanner.nextLine();\n'
                       '}\n'
                       '```\n'
                       'While `Scanner` provides convenient parsing methods like `nextInt()` and `nextDouble()`, it is '
                       'significantly slower than `BufferedReader`. Under the hood, `Scanner` executes regular '
                       'expression pattern matching on every single read operation! In benchmark evaluations, '
                       '`BufferedReader` processes text streams up to four times faster than `Scanner`.\n'
                       '\n'
                       'Furthermore, for mission-critical CSV parsing where fields may contain escaped quotes, commas, '
                       'and multi-line values, software architects use specialized state-machine tokenizers:\n'
                       '```java\n'
                       '// Industrial CSV Parser Invariants:\n'
                       '// 1. Maintain a boolean inQuotes flag\n'
                       '// 2. Scan characters sequentially without allocating temporary arrays\n'
                       '// 3. Toggle inQuotes upon encountering unescaped quote marks\n'
                       '// 4. Split on comma ONLY when inQuotes is false\n'
                       '```\n'
                       'By utilizing state-machine scanning, the parser handles complex nested quotes (e.g. "101,Acme '
                       'Inc,Active") with mathematical correctness and zero heap churn. In production environments '
                       'where datasets exceed gigabytes, combining state-machine tokenizers with pre-allocated '
                       'reusable character buffers enables processing gigabytes of financial transactions per second '
                       'with negligible garbage collection overhead.',
            'part': 4,
            'title': 'Production Parsing Strategies: CSV Delimiters, Escaping & Robust Line Tokenization',
            'tryIt': 'Try extracting CSV fields with line.split(",") and trimming leading/trailing whitespace from '
                     'each column.'},
           {'checks': [{'answer': 0,
                        'explanation': "The null guard 'if (streamText == null) return 0;' intercepts null references "
                                       'safely.',
                        'options': ['0 defensively without throwing NullPointerException',
                                    '-1',
                                    'Throws a NullPointerException',
                                    'Throws an IOException'],
                        'question': 'In the Day 29 countErrorLines challenge, what does countErrorLines(null) return?'},
                       {'answer': 0,
                        'explanation': "String.startsWith('[ERROR]') efficiently tests whether the line begins with "
                                       'the target prefix.',
                        'options': ["line.startsWith('[ERROR]')",
                                    "line.equals('[ERROR]')",
                                    "line.indexOf('[ERROR]') == line.length()",
                                    "line.matches('.*')"],
                        'question': 'In countErrorLines, what method is used to verify if a line starts with '
                                    "'[ERROR]'?"},
                       {'answer': 0,
                        'explanation': "The parser extracts parts[0].trim() from each row, returning ['ID', '101'].",
                        'options': ["An ArrayList containing ['ID', '101']",
                                    "An ArrayList containing ['ID', 'Name']",
                                    "A single concatenated string 'ID101'",
                                    'An empty list'],
                        'question': 'In the Day 29 extractFirstColumn assignment, what does '
                                    "extractFirstColumn('ID,Name\\n101,Vinay') return?"},
                       {'answer': 0,
                        'explanation': 'BufferedReader.readLine() abstracts cross-platform newline variations and '
                                       'processes lines sequentially.',
                        'options': ['To handle arbitrary platform newline sequences (\\n, \\r\\n) uniformly '
                                    'line-by-line',
                                    'Because strings cannot be split without a reader',
                                    'To convert characters to integers',
                                    'To lock the memory bus'],
                        'question': 'Why does SolutionAdv.extractFirstColumn use BufferedReader instead of scanning '
                                    'the whole string?'}],
            'code': 'import java.io.BufferedReader;\n'
                    'import java.io.IOException;\n'
                    'import java.io.StringReader;\n'
                    'import java.util.ArrayList;\n'
                    '\n'
                    'public class SolutionLab {\n'
                    '    // Challenge 1: Stream Error Log Parser\n'
                    '    public static class Solution {\n'
                    '        public static int countErrorLines(String streamText) {\n'
                    '            if (streamText == null) return 0;\n'
                    '            int count = 0;\n'
                    '            try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {\n'
                    '                String line;\n'
                    '                while ((line = reader.readLine()) != null) {\n'
                    '                    if (line.startsWith("[ERROR]")) {\n'
                    '                        count++;\n'
                    '                    }\n'
                    '                }\n'
                    '            } catch (IOException e) {\n'
                    '                return 0;\n'
                    '            }\n'
                    '            return count;\n'
                    '        }\n'
                    '    }\n'
                    '\n'
                    '    // Challenge 2: CSV Field Stream Extractor\n'
                    '    public static class SolutionAdv {\n'
                    '        public static ArrayList<String> extractFirstColumn(String csvText) {\n'
                    '            ArrayList<String> list = new ArrayList<>();\n'
                    '            if (csvText == null) return list;\n'
                    '            try (BufferedReader reader = new BufferedReader(new StringReader(csvText))) {\n'
                    '                String line;\n'
                    '                while ((line = reader.readLine()) != null) {\n'
                    '                    if (line.trim().isEmpty()) continue;\n'
                    '                    String[] parts = line.split(",");\n'
                    '                    list.add(parts[0].trim());\n'
                    '                }\n'
                    '            } catch (IOException e) {\n'
                    '                return list;\n'
                    '            }\n'
                    '            return list;\n'
                    '        }\n'
                    '    }\n'
                    '\n'
                    '    public static void main(String[] args) {\n'
                    '        String logs = "[INFO] Start\\n[ERROR] DB failure\\n[DEBUG] Retry\\n[ERROR] Auth reject";\n'
                    '        int errors = Solution.countErrorLines(logs);\n'
                    '        System.out.println("Total error lines counted: " + errors); // 2\n'
                    '\n'
                    '        String csv = "ID,Name,Role\\n101,Vinay,Dev\\n102,Sarah,Arch";\n'
                    '        ArrayList<String> firstCols = SolutionAdv.extractFirstColumn(csv);\n'
                    '        System.out.println("Extracted first columns:   " + firstCols); // [ID, 101, 102]\n'
                    '    }\n'
                    '}',
            'content': '### 5. Guided Coding Lab & Milestone Verification: Building `countErrorLines` and '
                       '`extractFirstColumn`\n'
                       '\n'
                       'To conclude Day 29, we implement and verify the two essential stream-parsing algorithms '
                       'specified in the PinIT Career OS curriculum: the **Stream Error Log Parser '
                       '(`countErrorLines`)** and the **CSV Field Stream Extractor (`extractFirstColumn`)**.\n'
                       '\n'
                       'In the primary challenge, we implement `Solution.countErrorLines(String streamText)`. The '
                       'specification mandates ingesting a multi-line string `streamText`, wrapping it in a '
                       '`BufferedReader(new StringReader(streamText))`, reading each line sequentially, and counting '
                       'how many lines strictly start with the prefix `"[ERROR]"`. If the input string is `null`, it '
                       'must defensively return `0`.\n'
                       '\n'
                       '```java\n'
                       '// ============================================================================\n'
                       '// CHALLENGE 1: STREAM ERROR LOG PARSER\n'
                       '// ============================================================================\n'
                       'import java.io.BufferedReader;\n'
                       'import java.io.IOException;\n'
                       'import java.io.StringReader;\n'
                       '\n'
                       'public class Solution {\n'
                       '    /**\n'
                       "     * Parses a text stream and counts the number of lines starting with '[ERROR]'.\n"
                       '     * Returns 0 if streamText is null or if an IOException occurs.\n'
                       '     */\n'
                       '    public static int countErrorLines(String streamText) {\n'
                       '        // Step 1: Defensive guard for null input:\n'
                       '        if (streamText == null) {\n'
                       '            return 0;\n'
                       '        }\n'
                       '\n'
                       '        int errorCount = 0;\n'
                       '\n'
                       '        // Step 2: Use try-with-resources to ensure deterministic stream closure:\n'
                       '        try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {\n'
                       '            String line;\n'
                       '\n'
                       '            // Step 3: Sequential line iteration until EOF (null):\n'
                       '            while ((line = reader.readLine()) != null) {\n'
                       '                // Step 4: Verify prefix:\n'
                       '                if (line.startsWith("[ERROR]")) {\n'
                       '                    errorCount++;\n'
                       '                }\n'
                       '            }\n'
                       '        } catch (IOException e) {\n'
                       '            // In-memory StringReader rarely throws IOException, but contract requires '
                       'handling:\n'
                       '            return 0;\n'
                       '        }\n'
                       '\n'
                       '        // Step 5: Return final tally:\n'
                       '        return errorCount;\n'
                       '    }\n'
                       '}\n'
                       '```\n'
                       '\n'
                       'Let us trace `countErrorLines` with sample log input:\n'
                       '```\n'
                       '[INFO] Application starting...\n'
                       '[ERROR] Database connection timed out on port 5432\n'
                       '[DEBUG] Retrying pool connection...\n'
                       "[ERROR] Authentication failed for user 'admin'\n"
                       '[INFO] Graceful shutdown initiated\n'
                       '```\n'
                       '1. Line 1: `startsWith("[ERROR]")` is `false`.\n'
                       '2. Line 2: `startsWith("[ERROR]")` is `true` $\to$ `errorCount` becomes `1`.\n'
                       '3. Line 3: `startsWith("[ERROR]")` is `false`.\n'
                       '4. Line 4: `startsWith("[ERROR]")` is `true` $\to$ `errorCount` becomes `2`.\n'
                       '5. Line 5: `startsWith("[ERROR]")` is `false`.\n'
                       '6. Next `readLine()` returns `null` (EOF). Loop terminates. Returns `2`.\n'
                       '\n'
                       'In the secondary assignment, we construct `SolutionAdv.extractFirstColumn(String csvText)`. '
                       'The method parses a CSV text stream and returns an `ArrayList<String>` containing the trimmed '
                       'value of the first column in each row, ignoring empty lines.\n'
                       '\n'
                       '```java\n'
                       '// ============================================================================\n'
                       '// CHALLENGE 2: CSV FIELD STREAM EXTRACTOR\n'
                       '// ============================================================================\n'
                       'import java.io.BufferedReader;\n'
                       'import java.io.IOException;\n'
                       'import java.io.StringReader;\n'
                       'import java.util.ArrayList;\n'
                       '\n'
                       'public class SolutionAdv {\n'
                       '    /**\n'
                       '     * Extracts the first column from each row of a CSV text stream.\n'
                       '     * Returns an empty ArrayList if csvText is null.\n'
                       '     */\n'
                       '    public static ArrayList<String> extractFirstColumn(String csvText) {\n'
                       '        ArrayList<String> firstColumns = new ArrayList<>();\n'
                       '\n'
                       '        // Step 1: Defensive guard for null input:\n'
                       '        if (csvText == null) {\n'
                       '            return firstColumns;\n'
                       '        }\n'
                       '\n'
                       '        // Step 2: Stream line reading via try-with-resources:\n'
                       '        try (BufferedReader reader = new BufferedReader(new StringReader(csvText))) {\n'
                       '            String line;\n'
                       '            while ((line = reader.readLine()) != null) {\n'
                       '                // Step 3: Skip blank lines:\n'
                       '                if (line.trim().isEmpty()) {\n'
                       '                    continue;\n'
                       '                }\n'
                       '\n'
                       '                // Step 4: Split by comma and extract first column:\n'
                       '                String[] parts = line.split(",");\n'
                       '                if (parts.length > 0) {\n'
                       '                    firstColumns.add(parts[0].trim());\n'
                       '                }\n'
                       '            }\n'
                       '        } catch (IOException e) {\n'
                       '            return firstColumns;\n'
                       '        }\n'
                       '\n'
                       '        return firstColumns;\n'
                       '    }\n'
                       '}\n'
                       '```\n'
                       '\n'
                       'Let us verify `extractFirstColumn` with CSV sample:\n'
                       '```\n'
                       'ID,Name,Role\n'
                       '101,Vinay,Dev\n'
                       '102,Sarah,Arch\n'
                       '```\n'
                       '- Row 1: `parts[0]` is `"ID"`. Added to list.\n'
                       '- Row 2: `parts[0]` is `"101"`. Added to list.\n'
                       '- Row 3: `parts[0]` is `"102"`. Added to list.\n'
                       '- Returns `["ID", "101", "102"]` with size 3.\n'
                       '\n'
                       'In automated test suites with JUnit 5:\n'
                       '```java\n'
                       '@Test\n'
                       'void testStreamErrorLogParser() {\n'
                       '    String logs = "[ERROR] Disk full\\n[INFO] Ok\\n[ERROR] Network drop";\n'
                       '    assertEquals(2, Solution.countErrorLines(logs));\n'
                       '    assertEquals(0, Solution.countErrorLines(null));\n'
                       '}\n'
                       '\n'
                       '@Test\n'
                       'void testCsvFieldExtractor() {\n'
                       '    String csv = "Product,Qty,Price\\nLaptop,5,1200\\nMouse,50,25";\n'
                       '    ArrayList<String> cols = SolutionAdv.extractFirstColumn(csv);\n'
                       '    assertEquals(3, cols.size());\n'
                       '    assertEquals("Product", cols.get(0));\n'
                       '    assertEquals("Laptop", cols.get(1));\n'
                       '    assertEquals("Mouse", cols.get(2));\n'
                       '    assertTrue(SolutionAdv.extractFirstColumn(null).isEmpty());\n'
                       '}\n'
                       '```\n'
                       'Both stream implementations deliver robust error tolerance, zero resource leaks, and full '
                       'compliance with the Day 29 specifications.',
            'part': 5,
            'title': 'Guided Coding Lab & Milestone Verification: Building countErrorLines and extractFirstColumn',
            'tryIt': 'Try handling a null or empty input stream defensively and returning 0 or an empty list without '
                     'throwing NullPointerException.'}],
 'projectStep': {'steps': ['Author Solution.countErrorLines(String streamText) using BufferedReader and StringReader.',
                           'Inspect each line via while ((line = reader.readLine()) != null) and count lines starting '
                           "with '[ERROR]'.",
                           'Author SolutionAdv.extractFirstColumn(String csvText) returning ArrayList<String> of '
                           'trimmed first columns.',
                           'Enforce try-with-resources on all streams to guarantee deterministic resource management.',
                           'Verify countErrorLines returns correct error counts and extractFirstColumn correctly '
                           'isolates record identifiers.'],
                 'title': 'Build the Stream Error Log Parser and CSV Extractor'},
 'recap': 'Yesterday we explored Multithreading, Runnable task decoupling, and thread lifecycles. Today, we delve into '
          'Java I/O architecture, learning how BufferedReaders and text streams process logs and CSV payloads with '
          'maximum throughput and zero resource leaks.',
 'summary': ['Java I/O bifurcates into 8-bit binary Byte Streams (InputStream/OutputStream) and 16-bit Unicode '
             'Character Streams (Reader/Writer).',
             'InputStreamReader bridges byte sources to character decoders, and must always specify explicit charsets '
             'like UTF-8.',
             'BufferedReader eliminates costly OS syscall context switches by buffering 8KB in RAM and providing '
             'line-by-line readLine() iteration.',
             'StringReader wraps in-memory strings into the Reader abstraction, enabling lightning-fast zero-I/O unit '
             'testing.',
             'Operating system file descriptors must be deterministically released using try-with-resources to prevent '
             'socket and handle exhaustion.',
             'The countErrorLines and extractFirstColumn challenges demonstrate robust defensive stream processing for '
             'server logs and CSV data.'],
 'title': 'Stream & Text I/O: Readers, Writers, Buffered Streams & Data Parsing'}
