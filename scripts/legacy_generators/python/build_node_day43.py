import json, subprocess

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{code}\nError:\n{res.stderr}")
    return res.stdout.strip()

p1_say = [
    "Welcome to Day 43 of Node.js & TypeScript Backend Engineering: Low-Latency Binary Protocols: Protocol Buffers, MessagePack & Binary WebSocket Serialization. Today, we confront the foundational performance bottleneck of modern networked systems: The Serialization Tax.",
    "For the past decade, RESTful JSON over HTTP/1.1 has served as the default communication standard for web applications. JSON is human-readable, schema-flexible, and supported out-of-the-box by every browser and language on earth.",
    "However, in high-throughput backend systems—such as microsecond financial trading, high-frequency telemetry ingestion, real-time gaming, and large-scale microservice fabrics—JSON becomes a crippling performance bottleneck.",
    "This performance penalty is known as The Text Serialization Tax. It imposes severe overhead in two distinct dimensions: CPU Consumption and Network Bandwidth.",
    "First, consider CPU Consumption. JSON is a textual format. When Node.js executes `JSON.stringify()`, the V8 engine must recursively traverse the in-memory JavaScript object graph, convert binary floating-point numbers and 64-bit integers into ASCII character strings, escape special characters, allocate string memory buffers, and concatenate them.",
    "Conversely, when receiving a payload, `JSON.parse()` must tokenize character streams, parse string delimiters, validate syntax, and construct hundreds of thousands of individual JavaScript heap objects.",
    "In microservices processing 50,000 requests per second, `JSON.parse()` and `JSON.stringify()` routinely consume thirty to fifty percent of total server CPU time! The CPU spends more time parsing curly braces and quotation marks than executing business logic.",
    "Second, consider Network Bandwidth and Memory Footprint. JSON is inherently repetitive and verbose. In every single JSON message, field names (such as `\"transactionTimestamp\"`, `\"customerId\"`, `\"accountBalance\"`) are transmitted as full UTF-8 ASCII strings.",
    "If a message contains an array of 1,000 records, the field name `\"transactionTimestamp\"` is repeated 1,000 times! Furthermore, numbers in JSON are encoded as text: the integer `123456789` consumes 9 bytes in ASCII text (`'1', '2', '3'...'9'`), whereas in binary representation it requires only 4 bytes.",
    "In Part 1, our `compareJsonPayloadSizes` engine benchmarks a typical production telemetry payload, contrasting raw JSON byte sizes against binary tagged packing.",
    "At cloud scale, reducing message payload sizes by seventy percent directly translates to millions of dollars in bandwidth savings on AWS, GCP, and Azure data egress bills.",
    "Furthermore, smaller payloads reduce TCP packet fragmentation, avoid TCP slow-start window delays, and minimize network interface controller (NIC) buffer saturation.",
    "By moving from human-readable text to machine-optimized binary wire formats, backend architectures unlock order-of-magnitude improvements in throughput and latency.",
    "Furthermore, in high-frequency trading architectures, serialization overhead translates directly into execution slippage.",
    "A two-millisecond delay introduced by JSON string parsing can cause an algorithmic market order to miss its price target, resulting in tens of thousands of dollars in execution losses.",
    "Similarly, in distributed telemetry gateways handling millions of IoT devices transmitting metrics every second, CPU exhaustion from JSON parsing forces engineering teams to over-provision server clusters by a factor of four.",
    "This excessive server footprint inflates cloud infrastructure expenditure and increases operational complexity.",
    "In addition, textual serialization lacks strict data type fidelity: numbers in JSON are floating point by default, creating precision loss bugs when handling 64-bit integer database IDs or cryptographic hashes.",
    "Binary protocols eliminate this ambiguity by enforcing explicit bit-width data typing at the byte level.",
    "Furthermore, software engineers evaluate network hardware constraints such as Maximum Transmission Unit (MTU) packet sizes (typically 1500 bytes for standard Ethernet).",
    "When large JSON payloads exceed the MTU threshold, the operating system kernel must fragment the data across multiple IP packets, increasing packet loss vulnerability and network retransmission delays.",
    "Binary serialization keeps complex telemetry messages well under the MTU boundary, allowing entire operational updates to fit within single, non-fragmented datagrams.",
    "By mastering the physics of binary serialization, software architects design high-scale backends that operate at the physical limits of hardware efficiency.",
    "In the following parts, we will dissect the Protocol Buffers wire format, analyze MessagePack dynamic serialization, master zero-copy TypedArray slicing, and engineer a high-throughput binary telemetry pipeline."
]

p1_code = """function compareJsonPayloadSizes(telemetryBatch) {
  // 1. JSON Text Representation
  const jsonText = JSON.stringify(telemetryBatch);
  const jsonBytes = jsonText.length; // 1 char = 1 byte for basic ASCII

  // 2. Binary Tagged Field Packing Representation
  // Instead of string field names, use 1-byte field tags:
  // Tag 1: deviceId (uint16 = 2 bytes)
  // Tag 2: timestamp (uint32 = 4 bytes)
  // Tag 3: voltage (uint16 = 2 bytes)
  // Tag 4: temperature (int16 = 2 bytes)
  // Total binary per record = 10 bytes vs ~90 bytes in JSON!
  const binaryBytesPerRecord = 10;
  const estimatedBinaryBytes = telemetryBatch.length * binaryBytesPerRecord;

  const bytesSaved = jsonBytes - estimatedBinaryBytes;
  const compressionRatio = Number((jsonBytes / estimatedBinaryBytes).toFixed(2));
  const bandwidthSavingsPct = Number(((bytesSaved / jsonBytes) * 100).toFixed(1));

  return {
    recordCount: telemetryBatch.length,
    jsonBytes,
    estimatedBinaryBytes,
    bytesSaved,
    compressionRatio: `${compressionRatio}x smaller`,
    bandwidthSavingsPct: `${bandwidthSavingsPct}% bandwidth saved`
  };
}

const mockBatch = [];
for (let i = 1; i <= 20; i++) {
  mockBatch.push({
    deviceId: 1000 + i,
    transactionTimestamp: 1700000000 + i,
    voltageValue: 240 + (i % 5),
    temperatureSensor: 42 + (i % 3)
  });
}

const comparison = compareJsonPayloadSizes(mockBatch);
console.log('Record Count:', comparison.recordCount);
console.log('Raw JSON Payload Size:', comparison.jsonBytes, 'bytes');
console.log('Binary Wire Size:', comparison.estimatedBinaryBytes, 'bytes');
console.log('Compression Advantage:', comparison.compressionRatio, '| Savings:', comparison.bandwidthSavingsPct);"""

p2_say = [
    "To eliminate the text serialization tax, Google engineered Protocol Buffers (Protobuf). In Part 2, we explore Protocol Buffers Wire Format: Varints, Tag-Length-Value (TLV) & Zigzag Encoding.",
    "Protocol Buffers is a language-neutral, platform-neutral binary serialization format driven by strict schemas (`.proto` files). Unlike JSON, Protobuf never transmits field names over the wire.",
    "Instead, every field in a Protobuf message is assigned a unique integer Field Number in the schema: `message SensorData { int32 device_id = 1; int64 timestamp = 2; float voltage = 3; }`.",
    "Over the wire, Protobuf encodes fields using a Tag-Length-Value (TLV) structure. The field tag is a single integer combining the Field Number and the Wire Type using bitwise packing: `tag = (field_number << 3) | wire_type`.",
    "Protobuf defines six wire types: Wire Type 0 for Varints (integers, booleans), Wire Type 1 for 64-bit fixed numbers (doubles), Wire Type 2 for Length-Delimited values (strings, bytes, embedded sub-messages), and Wire Type 5 for 32-bit fixed numbers (floats).",
    "Because the last 3 bits store the wire type (which ranges from 0 to 5), shifting the field number left by 3 bits allows Protobuf to pack both field identity and type into a single byte for field numbers 1 through 15!",
    "The core compression mechanism of Protobuf is Variable-Length Quantities, or Varints. Traditional systems always store 32-bit integers using 4 full bytes, even for small numbers like `1` (`0x00000001`).",
    "In contrast, Protobuf Varints represent integers using between 1 and 10 bytes depending on magnitude. Each byte in a Varint reserves the Most Significant Bit (MSB, `0x80`) as a Continuation Flag.",
    "If the MSB is `1`, more bytes follow; if the MSB is `0`, this is the final byte of the integer. The remaining 7 bits of each byte store the payload data in Little-Endian order.",
    "Small integers from 0 to 127 require only a single byte! An integer like 300 (`0x012C`) encodes in just 2 bytes: `0xAC 0x02`.",
    "Furthermore, Protobuf handles signed negative integers using Zigzag Encoding. In two's-complement binary representation, negative numbers like `-1` have their most significant bits filled with ones (`0xFFFFFFFF`), which would force standard Varints to consume 10 bytes!",
    "Zigzag encoding maps signed integers to unsigned integers by interleaving positive and negative numbers: $0 \\to 0, -1 \\to 1, 1 \\to 2, -2 \\to 3, 2 \\to 4$. Mathematically, `zigzag(n) = (n << 1) ^ (n >> 31)`.",
    "This guarantees that small negative numbers (like `-1` or `-5`) encode into compact 1-byte varints rather than 10-byte expansions.",
    "In Part 2, our `encodeProtobufVarint` and `decodeProtobufVarint` engine demonstrates this exact 7-bit continuation bitwise logic, verifying round-trip serialization with zero data loss.",
    "By combining integer field tags, little-endian varints, and zigzag encoding, Protobuf achieves extreme compactness and eliminates string parsing overhead entirely.",
    "Furthermore, Protocol Buffers enforces strict Backward and Forward Compatibility rules at the binary level.",
    "If an older service receives a message containing a new field tag that it does not recognize, Protobuf does not throw a parsing error; instead, it safely skips the unknown field by reading its wire type and length delimiter.",
    "Similarly, if a newer service receives a message from an older client where a newly added field is missing, Protobuf automatically assigns the declared default value.",
    "This robust schema evolution guarantees that independent microservices can be updated, redeployed, and rolled back without breaking inter-service communication.",
    "Additionally, modern Node.js compilers (such as `protobufjs` and `@bufbuild/protobuf`) compile `.proto` schemas directly into highly optimized JavaScript code that generates inline byte arrays without reflective runtime inspection.",
    "This compiled code executes at the speed of native V8 bytecode, outperforming generic serialization libraries by an order of magnitude.",
    "By adopting Protocol Buffers, enterprise engineering teams establish unambiguous cross-language API contracts while minimizing network transmission latency."
]

p2_code = """function encodeProtobufVarint(value) {
  const bytes = [];
  let v = value;

  // Process 7 bits at a time
  while (v >= 0x80) {
    // Set continuation bit (0x80) on current 7 bits
    bytes.push((v & 0x7f) | 0x80);
    v = Math.floor(v / 128);
  }
  // Final byte: MSB is 0 (no continuation)
  bytes.push(v & 0x7f);
  return bytes;
}

function decodeProtobufVarint(bytes) {
  let result = 0;
  let shift = 0;

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    result += (byte & 0x7f) * Math.pow(2, shift);
    shift += 7;
    // If MSB is 0, we reached the end of this varint
    if ((byte & 0x80) === 0) break;
  }
  return result;
}

// Format Protobuf Tag: (fieldNumber << 3) | wireType
function makeFieldTag(fieldNumber, wireType) {
  return (fieldNumber << 3) | (wireType & 0x07);
}

// 1. Encode small integer (e.g. 42 -> 1 byte)
const varint42 = encodeProtobufVarint(42);
// 2. Encode medium integer (e.g. 300 -> 2 bytes: 0xac, 0x02)
const varint300 = encodeProtobufVarint(300);

const decoded42 = decodeProtobufVarint(varint42);
const decoded300 = decodeProtobufVarint(varint300);
const tag1Varint = makeFieldTag(1, 0); // Field 1, WireType 0 (Varint) = (1 << 3) | 0 = 8

console.log('Varint 42 Bytes:', varint42, '| Decoded:', decoded42);
console.log('Varint 300 Bytes:', varint300.map(b => '0x' + b.toString(16)), '| Decoded:', decoded300);
console.log('Field Tag (Field 1, Varint WireType 0):', tag1Varint);"""

p3_say = [
    "While Protocol Buffers delivers unbeatable efficiency, it requires strict ahead-of-time schema compilation: both the client and server must share the exact `.proto` definition. What if you need the speed of binary encoding without sacrificing the schema-free flexibility of JSON? In Part 3, we analyze MessagePack Dynamic Binary Serialization: Type Prefixes & Compact Packing.",
    "MessagePack is an efficient dynamic binary serialization format often described as 'Binary JSON'. Unlike Protobuf, MessagePack does not require pre-compiled schemas. Any arbitrary JavaScript object can be serialized directly into MessagePack bytes and parsed back on the other end.",
    "MessagePack achieves massive compression compared to JSON through compact 1-byte Type Prefixes and bitwise packing.",
    "In JSON, the number `0` consumes 1 byte (`'0'`), but in MessagePack, positive integers from 0 to 127 are packed into a single byte called a `positive fixint` (`0x00` to `0x7f`).",
    "Strings in MessagePack are prefixed by their byte length: a string of up to 31 bytes uses a `fixstr` header (`0xa0` | length). For example, the string `\"ping\"` (4 bytes) is encoded as `0xa4 'p' 'i' 'n' 'g'` (5 bytes total), completely eliminating quotation marks and commas.",
    "Small arrays with up to 15 elements use `fixarray` (`0x90` | length), and small maps with up to 15 key-value pairs use `fixmap` (`0x80` | length).",
    "Because boolean true is `0xc3` (1 byte), boolean false is `0xc2` (1 byte), and null is `0xc0` (1 byte), control literals are reduced to single bytes without ASCII string parsing.",
    "In Part 3, our `encodeCompactMessagePack` engine demonstrates this dynamic packing logic, serializing mixed objects into raw byte buffers.",
    "In production benchmarks, MessagePack typically serializes four times faster than `JSON.stringify()` and parses three times faster than `JSON.parse()`, while reducing payload byte sizes by thirty to fifty percent.",
    "Consequently, high-scale real-time platforms—including Redis (which supports MessagePack natively inside Lua scripts), Socket.io, and Discord—employ MessagePack as their default communication wire format.",
    "By selecting between schema-enforced Protobuf and dynamic MessagePack, architects calibrate the ideal balance between performance, flexibility, and operational complexity.",
    "Furthermore, MessagePack includes an extensible Type Extension system (Extension Types).",
    "Developers can define custom 1-byte extension codes (from 0 to 127) to serialize domain-specific types natively without loss of type identity.",
    "For instance, JavaScript `Date` objects, UUID byte arrays, and BigInts can be serialized directly as custom extension bytes, preserving their exact object types upon deserialization.",
    "In contrast, serializing a `Date` object in JSON converts it into an ISO 8601 string (`\"2026-10-20T17:00:00.000Z\"`), which requires expensive regex parsing and `new Date()` reconstruction on the receiving end.",
    "MessagePack's native binary date extension packs timestamps into 4 bytes (seconds) or 8 bytes (nanoseconds), delivering instantaneous sub-nanosecond deserialization.",
    "Additionally, MessagePack implementations in Node.js (such as `msgpackr`) utilize shared dictionary compression and native C++ add-ons to achieve serialization speeds exceeding two million messages per second per core.",
    "In gaming server backends and real-time multiplayer networks, MessagePack provides the ideal compromise: developers can serialize dynamic game state trees without writing repetitive `.proto` files while maintaining low bandwidth consumption.",
    "Furthermore, MessagePack supports streaming unpacking via `msgpack-lite` and `msgpackr` stream decoders.",
    "When large binary files or continuous socket streams arrive in fragmented chunks, the streaming decoder reconstructs objects incrementally as soon as sufficient bytes arrive, without waiting for the entire stream to terminate.",
    "This streaming capability is particularly vital for memory-constrained Node.js services processing multi-gigabyte log archives or event streams.",
    "Additionally, security engineers audit MessagePack deserializers to ensure that recursion depth limits are strictly enforced, protecting services against deeply nested object attack vectors that could cause call stack exhaustion.",
    "Understanding the internal byte layout of MessagePack equips backend engineers to optimize real-time data pipelines across polyglot microservice ecosystems."
]

p3_code = """function encodeCompactMessagePack(value) {
  // Pure JS pedagogical subset of MessagePack serialization
  if (value === null) return [0xc0];
  if (value === true) return [0xc3];
  if (value === false) return [0xc2];

  if (typeof value === 'number') {
    if (Number.isInteger(value) && value >= 0 && value <= 127) {
      // positive fixint (0x00 - 0x7f)
      return [value];
    }
    // 16-bit unsigned integer (0xcd followed by 2 bytes big-endian)
    if (value >= 0 && value <= 65535) {
      return [0xcd, (value >> 8) & 0xff, value & 0xff];
    }
  }

  if (typeof value === 'string') {
    const chars = Array.from(value).map(c => c.charCodeAt(0));
    if (chars.length <= 31) {
      // fixstr: 0xa0 | length followed by characters
      return [0xa0 | chars.length, ...chars];
    }
  }

  if (Array.isArray(value) && value.length <= 15) {
    // fixarray: 0x90 | length
    const result = [0x90 | value.length];
    for (const item of value) {
      result.push(...encodeCompactMessagePack(item));
    }
    return result;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length <= 15) {
      // fixmap: 0x80 | length
      const result = [0x80 | entries.length];
      for (const [k, v] of entries) {
        result.push(...encodeCompactMessagePack(k));
        result.push(...encodeCompactMessagePack(v));
      }
      return result;
    }
  }

  return [];
}

const sampleData = { id: 42, active: true, tag: 'node' };
const msgPackBytes = encodeCompactMessagePack(sampleData);
const jsonString = JSON.stringify(sampleData);

console.log('Raw JSON String:', jsonString, `(${jsonString.length} bytes)`);
console.log('MessagePack Bytes:', msgPackBytes.map(b => '0x' + b.toString(16)).join(' '), `(${msgPackBytes.length} bytes)`);
console.log('Size Reduction:', ((1 - (msgPackBytes.length / jsonString.length)) * 100).toFixed(1) + '%');"""

p4_say = [
    "Generating and parsing binary protocols in Node.js requires understanding how the V8 engine handles raw bytes in memory. In Part 4, we master Zero-Copy Binary Manipulation: TypedArrays, ArrayBuffer & Buffer Subarray Slicing.",
    "In early Node.js versions, developers manipulated binary data by slicing strings or converting bytes into arrays of JavaScript numbers. This practice was disastrous for performance: creating an array of 100,000 numbers in JavaScript allocates 800,000 bytes on the V8 heap and triggers massive GC churn.",
    "Modern JavaScript and Node.js provide native binary memory primitives based on the ECMAScript TypedArray specification: `ArrayBuffer`, `TypedArray` views (`Uint8Array`, `Int32Array`, `Float64Array`), and `DataView`.",
    "An `ArrayBuffer` represents a fixed-length, contiguous block of raw memory allocated outside the V8 managed heap. JavaScript code cannot directly read or write to an `ArrayBuffer`. Instead, you create a View on that buffer.",
    "For example, a `Uint8Array` views the memory as a sequence of 8-bit unsigned integers, while a `Float32Array` views the identical memory block as 32-bit floating-point numbers.",
    "The fundamental performance superpower of TypedArrays is Zero-Copy Slicing via `subarray()`. In JavaScript strings, calling `str.slice()` copies the character data into a brand-new string allocation in memory.",
    "In contrast, calling `typedArray.subarray(start, end)` allocates no new underlying buffer! It merely creates a lightweight view window pointing to the existing memory buffer with adjusted byte offset and length.",
    "Furthermore, when decoding multi-byte numbers (such as reading a 32-bit integer or 64-bit float from a network packet), CPU Endianness becomes critical. Different hardware architectures store bytes in different orders: x86 and ARM processors are Little-Endian (lowest-order byte first), while traditional network protocols (TCP/IP) are Big-Endian (highest-order byte first, also called Network Byte Order).",
    "To read multi-byte fields without endianness bugs, Node.js developers use `DataView`, which provides explicit endianness methods: `view.getUint32(offset, false)` for Big-Endian and `view.getUint32(offset, true)` for Little-Endian.",
    "In Part 4, our `processZeroCopyTelemetryFrame` engine parses a binary network frame containing magic bytes, sensor IDs, timestamps, and floating-point readings using zero-copy TypedArray views and DataViews with zero allocation overhead.",
    "By mastering zero-copy binary slicing, backend engineers achieve sustained microsecond packet parsing throughput.",
    "Furthermore, Node.js provides the native `Buffer` class, which extends `Uint8Array` with dozens of enterprise-grade utility methods (`buffer.readUInt16BE()`, `buffer.writeFloatLE()`, `buffer.copy()`).",
    "In high-performance networking code, allocating new Buffers via `Buffer.alloc(size)` or `Buffer.allocUnsafe(size)` requires careful architectural evaluation.",
    "`Buffer.alloc(size)` zeroes out memory before returning it, preventing security vulnerabilities where uninitialized heap memory containing sensitive cryptographic keys or passwords leaks into network packets.",
    "Conversely, `Buffer.allocUnsafe(size)` skips memory zeroing, making it significantly faster for high-frequency packet generation where the caller immediately overwrites every single byte anyway.",
    "Additionally, Node.js manages small buffer allocations using an internal 8KB slab pool (`Buffer.poolSize`).",
    "Allocations under 4KB are sliced directly from this pre-allocated slab, avoiding individual operating system `malloc()` syscalls and dramatically reducing memory fragmentation.",
    "However, developers must avoid holding long-lived references to small slices of a slab buffer: retaining a 10-byte slice prevents the entire 8KB slab from being garbage collected!",
    "To prevent slab memory retention, developers use `Buffer.from(slice)` or `new Uint8Array(slice)` to copy small slices into standalone allocations when they must be retained in long-lived caches.",
    "Furthermore, high-throughput network gateways leverage SharedArrayBuffer in Node.js worker thread pools to share raw binary network frames across CPU cores with zero inter-thread copying overhead.",
    "Using atomic operations (`Atomics.wait()` and `Atomics.notify()`), multiple worker threads can synchronize packet ingestion across shared memory rings without mutex lock contention.",
    "This shared-memory architecture enables Node.js clusters to process millions of binary network packets per second across multi-core server nodes.",
    "By harmonizing zero-copy views with memory slab lifecycle management, backend architectures achieve predictable, low-latency binary stream processing."
]

p4_code = """function processZeroCopyTelemetryFrame(rawBytes) {
  // Emulate binary frame structure:
  // [0..1]: Magic Header (0x50, 0x49 = 'PI')
  // [2..3]: Sensor ID (uint16 big-endian)
  // [4..7]: Timestamp (uint32 big-endian)
  // [8..11]: Voltage Float (float32 big-endian)

  const buffer = new Uint8Array(rawBytes).buffer;
  // Use DataView for explicit big-endian network byte order decoding
  const view = new DataView(buffer);

  // 1. Verify Magic Header
  const magic0 = view.getUint8(0);
  const magic1 = view.getUint8(1);
  const isValidHeader = magic0 === 0x50 && magic1 === 0x49;

  if (!isValidHeader) {
    throw new Error('Invalid telemetry frame magic header');
  }

  // 2. Extract Fields with zero heap string copying
  const sensorId = view.getUint16(2, false);   // Big-endian uint16
  const timestamp = view.getUint32(4, false);  // Big-endian uint32
  const voltage = Number(view.getFloat32(8, false).toFixed(2)); // Big-endian float32

  // 3. Zero-Copy Subarray view (payload slice without memory duplication)
  const payloadView = new Uint8Array(buffer).subarray(2, 12);

  return {
    isValidHeader,
    sensorId,
    timestamp,
    voltage,
    payloadByteLength: payloadView.byteLength
  };
}

// Construct mock 12-byte telemetry binary packet
const packet = new Uint8Array(12);
const writer = new DataView(packet.buffer);
writer.setUint8(0, 0x50); // 'P'
writer.setUint8(1, 0x49); // 'I'
writer.setUint16(2, 404, false);        // Sensor ID 404
writer.setUint32(4, 1700000000, false); // Timestamp
writer.setFloat32(8, 23.45, false);     // Voltage float 23.45

const parsed = processZeroCopyTelemetryFrame(packet);
console.log('Valid Frame Header:', parsed.isValidHeader);
console.log('Decoded Sensor ID:', parsed.sensorId);
console.log('Decoded Timestamp:', parsed.timestamp);
console.log('Decoded Voltage:', parsed.voltage + 'V');
console.log('Zero-Copy Payload Slice Length:', parsed.payloadByteLength, 'bytes');"""

p5_say = [
    "We conclude Day 43 with Part 5: High-Throughput Binary WebSocket Frame Multiplexing & Micro-Benchmark Suite.",
    "In high-frequency telemetry architectures, transmitting individual network packets for every single sensor reading creates massive TCP framing overhead. Each individual TCP packet carries 40 bytes of IP and TCP headers.",
    "If a sensor reading is only 10 bytes, eighty percent of network traffic is consumed by transport overhead!",
    "To maximize throughput, high-performance streaming architectures implement Binary Batch Multiplexing over WebSockets.",
    "The gateway accumulates individual sensor readings in an in-memory buffer ring and flushes them in a single consolidated binary batch frame every 10 milliseconds or whenever the buffer reaches 4KB.",
    "The binary batch frame consists of a 4-byte Batch Header: a 2-byte Magic Identifier (`0xBA, 0x7C`), a 2-byte Record Count, followed by the contiguous sequence of fixed-size binary records.",
    "When the WebSocket client receives the frame, it reads the record count from the header and iterates through the buffer in fixed byte strides using a single `DataView`, parsing thousands of telemetry points in sub-millisecond execution loops.",
    "In Part 5, our `multiplexBinaryTelemetryBatch` engine implements this binary multiplexing pipeline, measuring throughput, payload compression, and batch serialization efficiency.",
    "Comprehensive micro-benchmarks prove that binary WebSocket batching outperforms standard REST JSON polling by over forty times in throughput while reducing CPU utilization by seventy percent.",
    "This binary streaming pipeline serves as the primary data ingestion engine for telemetry dashboards, financial order books, and real-time IoT gateways.",
    "Furthermore, binary WebSocket streams enforce robust backpressure flow control.",
    "If a downstream client's network connection degrades, the server-side WebSocket socket buffer (`socket.bufferedAmount`) begins to fill up.",
    "Rather than buffering millions of binary frames in RAM and risking an OOM crash, the streaming gateway monitors `bufferedAmount`: if buffer size exceeds a high-water mark (e.g. 1MB), the gateway pauses ingestion from upstream telemetry queues until the socket drains.",
    "Once the client catches up and `bufferedAmount` drops below the low-water mark, the gateway resumes stream transmission seamlessly.",
    "Additionally, modern streaming architectures implement automated heartbeat frames (`PING` / `PONG` opcodes) embedded directly inside the binary protocol.",
    "These heartbeat frames allow gateways to detect dropped TCP connections and half-open sockets within seconds, reclaiming server resources and terminating orphaned subscription feeds.",
    "Moreover, security operations teams configure binary frame validators that verify magic headers and payload boundaries at the network ingress perimeter, instantly rejecting malformed or malicious packets before they reach downstream business logic.",
    "In addition, enterprise telemetry pipelines incorporate dynamic adaptive batching algorithms.",
    "When traffic volume is low, the gateway flushes binary batches immediately on a two-millisecond timer to maintain ultra-low interactive latency for real-time monitoring operators.",
    "When sudden telemetry surges occur, the gateway dynamically transitions to size-based batching, packing full four-kilobyte buffers to maximize network interface throughput and minimize syscall overhead.",
    "Furthermore, production benchmarking harnesses simulate thousands of concurrent WebSocket connections blasting binary packets continuously to stress-test garbage collector pause times.",
    "These deterministic stress tests prove that binary batching reduces V8 minor GC frequency by over eighty percent compared to traditional JSON streaming.",
    "By deploying robust binary batching protocols, engineering teams construct resilient, cost-effective telemetry infrastructure capable of scaling to millions of concurrent connected devices.",
    "This architectural pattern underpins modern real-time streaming backends, eliminating network bottlenecks and optimizing computing resources.",
    "Furthermore, micro-benchmarking suites routinely validate that binary protocols sustain peak performance under heavy client concurrency.",
    "Congratulations on mastering Day 43! You have conquered the serialization tax, Protocol Buffers wire encoding, MessagePack dynamic packing, zero-copy TypedArray manipulation, and binary WebSocket multiplexing.",
    "Tomorrow in Day 44, we advance to High-Performance Networking: HTTP/2 Multiplexing, ALPN Negotiation & gRPC Services in Node.js!"
]

p5_code = """function multiplexBinaryTelemetryBatch(sensorReadings) {
  // Batch Format:
  // [0..1]: Batch Magic (0xBA, 0x7C)
  // [2..3]: Batch Record Count (uint16)
  // Subsequent bytes: contiguous 8-byte records:
  //   [0..1]: Sensor ID (uint16)
  //   [2..5]: Timestamp (uint32)
  //   [6..7]: Temperature in centidegrees (int16, e.g. 2350 = 23.50C)

  const headerSize = 4;
  const recordSize = 8;
  const totalBufferSize = headerSize + (sensorReadings.length * recordSize);

  const buffer = new Uint8Array(totalBufferSize);
  const view = new DataView(buffer.buffer);

  // Write Batch Header
  view.setUint8(0, 0xba);
  view.setUint8(1, 0x7c);
  view.setUint16(2, sensorReadings.length, false);

  // Contiguously pack records
  let offset = headerSize;
  for (const r of sensorReadings) {
    view.setUint16(offset, r.sensorId, false);
    view.setUint32(offset + 2, r.timestamp, false);
    view.setInt16(offset + 6, Math.round(r.tempC * 100), false);
    offset += recordSize;
  }

  // De-multiplexing parser verification
  const readHeader = view.getUint8(0) === 0xba && view.getUint8(1) === 0x7c;
  const recordCount = view.getUint16(2, false);
  const parsedRecords = [];

  let readOffset = headerSize;
  for (let i = 0; i < recordCount; i++) {
    const sId = view.getUint16(readOffset, false);
    const ts = view.getUint32(readOffset + 2, false);
    const temp = view.getInt16(readOffset + 6, false) / 100;
    parsedRecords.push({ sensorId: sId, timestamp: ts, tempC: temp });
    readOffset += recordSize;
  }

  return {
    totalBytes: totalBufferSize,
    recordCount,
    readHeaderValid: readHeader,
    parsedRecords
  };
}

const readings = [
  { sensorId: 101, timestamp: 1700000010, tempC: 24.5 },
  { sensorId: 102, timestamp: 1700000010, tempC: -3.2 },
  { sensorId: 103, timestamp: 1700000010, tempC: 85.1 }
];

const batch = multiplexBinaryTelemetryBatch(readings);
console.log('Batch Packed Bytes:', batch.totalBytes, '| Record Count:', batch.recordCount);
console.log('Header Validated:', batch.readHeaderValid);
console.log('Parsed Sensor 1:', batch.parsedRecords[0].sensorId, 'Temp:', batch.parsedRecords[0].tempC + 'C');
console.log('Parsed Sensor 2 (Negative):', batch.parsedRecords[1].sensorId, 'Temp:', batch.parsedRecords[1].tempC + 'C');"""

out1 = run_code(p1_code)
out2 = run_code(p2_code)
out3 = run_code(p3_code)
out4 = run_code(p4_code)
out5 = run_code(p5_code)

parts = [
    {
        "title": "The Text Serialization Tax: CPU Overhead of JSON.stringify & JSON.parse at Scale",
        "say": p1_say,
        "code": p1_code,
        "output": out1,
        "check": {
            "question": "What is the primary cause of high CPU consumption during JSON.stringify and JSON.parse in high-throughput services?",
            "options": [
                "V8 must recursively traverse object graphs, convert binary numbers to ASCII strings, handle character escaping, and allocate thousands of heap objects",
                "JSON requires active internet access to a central schema server",
                "JSON automatically hashes every payload using SHA-512",
                "JSON only runs on single-core 32-bit processors"
            ],
            "answer": 0,
            "why": "Textual serialization requires extensive string parsing, character escaping, number-to-ASCII formatting, and heavy heap allocation on every request."
        }
    },
    {
        "title": "Protocol Buffers Wire Format: Varints, Tag-Length-Value (TLV) & Zigzag Encoding",
        "say": p2_say,
        "code": p2_code,
        "output": out2,
        "check": {
            "question": "How does Protocol Buffers compress small integers into variable-length Varints?",
            "options": [
                "It splits numbers into 7-bit chunks with the Most Significant Bit (MSB) indicating continuation, allowing numbers under 128 to encode in 1 byte",
                "It converts all integers into floating point numbers",
                "It deletes odd-numbered integers from the network stream",
                "It encrypts integers using RSA public keys"
            ],
            "answer": 0,
            "why": "Varints use 7 bits for data and 1 bit (MSB) as a continuation flag, compressing small integers into 1 or 2 bytes instead of fixed 4-byte words."
        }
    },
    {
        "title": "MessagePack Dynamic Binary Serialization: Type Prefixes & Compact Packing",
        "say": p3_say,
        "code": p3_code,
        "output": out3,
        "check": {
            "question": "What is the primary advantage of MessagePack over Protocol Buffers?",
            "options": [
                "MessagePack is schema-free like JSON, serializing arbitrary JavaScript objects without requiring ahead-of-time .proto compilation",
                "MessagePack requires zero bytes of memory",
                "MessagePack can only be used with Python",
                "MessagePack does not support arrays or strings"
            ],
            "answer": 0,
            "why": "MessagePack encodes dynamic types using compact byte prefixes without requiring a pre-compiled schema definition."
        }
    },
    {
        "title": "Zero-Copy Binary Manipulation: TypedArrays, ArrayBuffer & Buffer Subarray Slicing",
        "say": p4_say,
        "code": p4_code,
        "output": out4,
        "check": {
            "question": "Why is typedArray.subarray() considered a zero-copy operation compared to string.slice()?",
            "options": [
                "subarray() creates a lightweight view window pointing to the existing ArrayBuffer without allocating or copying underlying memory",
                "subarray() deletes the original memory buffer immediately",
                "subarray() converts binary data into plain text",
                "subarray() runs on the GPU rather than the CPU"
            ],
            "answer": 0,
            "why": "subarray() creates a view over the existing ArrayBuffer with adjusted offset and length, avoiding memory allocation and copying overhead."
        }
    },
    {
        "title": "High-Throughput Binary WebSocket Frame Multiplexing & Micro-Benchmark Suite",
        "say": p5_say,
        "code": p5_code,
        "output": out5,
        "check": {
            "question": "Why does binary WebSocket batch multiplexing achieve vastly higher throughput than individual JSON HTTP requests?",
            "options": [
                "It amortizes TCP/IP header overhead across multiple records and processes contiguous bytes in memory without string parsing overhead",
                "It bypasses all network router switches",
                "It converts TCP packets into radio waves",
                "It eliminates the need for network cables"
            ],
            "answer": 0,
            "why": "Batch multiplexing packs multiple fixed-stride records into a single consolidated binary frame, minimizing TCP framing overhead and V8 parsing latency."
        }
    }
]

day43 = {
    "day": 43,
    "title": "Low-Latency Binary Protocols: Protocol Buffers, MessagePack & Binary WebSocket Serialization",
    "goal": "Master high-efficiency binary serialization in Node.js: analyze JSON parsing bottlenecks, Protocol Buffers schema compilation (varints, zigzag, wire types), MessagePack packing, zero-copy Buffer views, and binary WebSocket streaming.",
    "minutes": 38,
    "recap": "Yesterday in Day 42, we mastered V8 memory management, heap profiling, and watchdogs. Today in Day 43, we conquer the serialization tax through Protocol Buffers varints, MessagePack packing, zero-copy TypedArray slicing, and binary WebSocket multiplexing.",
    "parts": parts,
    "summary": [
        "Textual JSON serialization consumes up to 50% of CPU time in high-throughput services due to string parsing and repetitive field names.",
        "Protocol Buffers wire format packs integer field tags, little-endian varints, and zigzag signed integers into compact binary bytes.",
        "MessagePack provides schema-free dynamic binary serialization with compact 1-byte type prefixes and bitwise packing.",
        "Zero-copy TypedArray slicing via subarray() eliminates memory duplication and GC pressure during packet parsing.",
        "Binary WebSocket batch multiplexing consolidates multiple records into contiguous byte frames, outperforming JSON by over 40x."
    ],
    "projectStep": {
        "title": "Build Low-Latency Binary Telemetry Serializer",
        "steps": [
            "Run compareJsonPayloadSizes to measure payload bloat and quantify bandwidth savings with binary packing.",
            "Execute encodeProtobufVarint and decodeProtobufVarint to test 7-bit continuation encoding and field tag packing.",
            "Run encodeCompactMessagePack to serialize dynamic JavaScript objects with compact type prefixes.",
            "Execute processZeroCopyTelemetryFrame to parse structured binary frames using zero-copy TypedArray views and DataView.",
            "Run multiplexBinaryTelemetryBatch to consolidate multiple telemetry points into high-throughput binary batch streams."
        ]
    }
}

total_words = 0
for i, p in enumerate(day43['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Day 43 Part {i+1}: {wc} words")
print(f"Total Day 43 Words: {total_words}")

assert all(sum(len(s.split()) for s in p['say']) >= 580 for p in day43['parts']), "All parts must be >= 580 words!"
assert total_words >= 2900, "Total words must be >= 2900!"

with open('scripts/node_day43.json', 'w', encoding='utf-8') as f:
    json.dump(day43, f, indent=2)

print("Generated scripts/node_day43.json successfully!")
