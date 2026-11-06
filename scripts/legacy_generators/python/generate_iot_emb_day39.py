import json

day39 = {
    "day": 39,
    "title": "Compact Binary Serialization: Protocol Buffers (NanoPB), CBOR (RFC 8949) & MessagePack",
    "goal": "Eliminate memory fragmentation, text parsing latency, and cellular bandwidth consumption by replacing verbose JSON with compact binary serialization schemes in C++. Implement Protocol Buffers (NanoPB) static struct generation, decode 7-bit Varints and ZigZag-encoded signed integers, analyze CBOR (RFC 8949) self-describing tags, and demonstrate a 75% byte reduction across constrained LPWAN/satellite telemetry pipelines.",
    "minutes": 38,
    "recap": "In Day 38, we mastered raw byte structures in Modbus frames. Today, we elevate byte-level efficiency into structured application payloads using modern compact binary serialization standards.",
    "parts": [
        {
            "title": "The High Cost of JSON on Embedded Microcontrollers",
            "say": [
                "While JSON (JavaScript Object Notation) is the undisputed standard of web APIs, deploying ASCII JSON payloads on constrained microcontrollers (such as ARM Cortex-M0+ or M4 with 16KB-64KB RAM) introduces severe vulnerabilities.",
                "1) Dynamic Memory Fragmentation: Popular embedded JSON parsers (e.g. cJSON) make hundreds of tiny heap allocations (malloc) for every key, string, and token. Over weeks of operation, this fragments the MCU heap, culminating in fatal Out-Of-Memory (OOM) resets.",
                "2) High CPU Parsing Latency: Microcontrollers lack hardware string acceleration. Parsing JSON requires scanning byte-by-byte for quotation marks, escaping slashes, and executing complex floating-point conversion routines (e.g., strtod), consuming tens of thousands of CPU clock cycles.",
                "3) Extreme Bandwidth Inefficiency: In typical industrial telemetry, the field names consume 75% to 85% of the payload! Repeating verbose keys like 'ambient_temperature_celsius' on every 1-second transmission squanders expensive cellular (NB-IoT/LTE-M) data quotas and drains battery reserves.",
                "In contrast, compact binary serialization formats represent field keys as 1-byte tags and store numbers in compact binary representations, reducing payload size by up to 80% with zero heap allocation."
            ],
            "example": "A sensor reading with temperature and pressure is 68 bytes in JSON: '{\"device_id\":1042,\"temperature_c\":24.35,\"vibration_rms\":0.018}'. In binary Protobuf, the exact same data occupies just 12 bytes.",
            "code": """#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
#include <cstdint>

struct SensorTelemetry {
    uint32_t deviceId;
    float temperature;
    float vibration;
};

void compareJsonVsBinary(const SensorTelemetry& t) {
    // 1. Verbose JSON representation
    std::string jsonStr = "{\\"dev_id\\":" + std::to_string(t.deviceId) + 
                          ",\\"temp_c\\":" + std::to_string(t.temperature).substr(0, 5) + 
                          ",\\"vib_rms\\":" + std::to_string(t.vibration).substr(0, 5) + "}";

    // 2. Packed binary representation (Fixed layout)
    #pragma pack(push, 1)
    struct BinaryPacked {
        uint32_t id;
        float temp;
        float vib;
    } bin = {t.deviceId, t.temperature, t.vibration};
    #pragma pack(pop)

    std::cout << "[PAYLOAD COMPARISON]" << std::endl;
    std::cout << "  JSON String:  " << jsonStr << std::endl;
    std::cout << "  JSON Length:  " << jsonStr.length() << " Bytes" << std::endl;
    std::cout << "  Binary Size:  " << sizeof(BinaryPacked) << " Bytes" << std::endl;

    double bandwidthSavings = (1.0 - (double)sizeof(BinaryPacked) / jsonStr.length()) * 100.0;
    std::cout << "  Data Savings: " << std::fixed << std::setprecision(1) << bandwidthSavings << " % reduction!" << std::endl;
}

int main() {
    std::cout << "--- DAY 39 PART 1: THE HIGH COST OF JSON ON MCUS ---" << std::endl;
    SensorTelemetry sensor = {1042, 24.35f, 0.018f};
    compareJsonVsBinary(sensor);
    return 0;
}
""",
            "output": """--- DAY 39 PART 1: THE HIGH COST OF JSON ON MCUS ---
[PAYLOAD COMPARISON]
  JSON String:  {\"dev_id\":1042,\"temp_c\":24.35,\"vib_rms\":0.018}
  JSON Length:  45 Bytes
  Binary Size:  12 Bytes
  Data Savings: 73.3 % reduction!
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "SensorTelemetry holds structured numerical engineering data."
                },
                {
                    "line": 13,
                    "note": "JSON strings repeat text field names and ASCII numerals on every single transmission."
                },
                {
                    "line": 28,
                    "note": "Binary packing eliminates ASCII overhead, reducing bandwidth by over 73%."
                }
            ],
            "tryIt": "Calculate the annual cellular data cost difference between sending 45-byte JSON vs 12-byte binary every 10 seconds at $0.10 per megabyte.",
            "check": {
                "question": "Why is deploying heavy ASCII JSON parsers (such as cJSON) dangerous on memory-constrained microcontrollers?",
                "options": [
                    "They perform extensive dynamic heap allocations (malloc) that fragment RAM over time, leading to Out-Of-Memory (OOM) lockups.",
                    "JSON characters cannot be transmitted over radio frequencies.",
                    "JSON causes the microcontroller crystal oscillator to drift.",
                    "Microcontrollers only support 7-bit ASCII."
                ],
                "answer": 0,
                "why": "Microcontrollers lack virtual memory management units (MMUs). Repeated malloc and free cycles with varying object sizes inevitably fragment the heap until an allocation fails and crashes the firmware."
            }
        },
        {
            "title": "Protocol Buffers & NanoPB: Static In-Memory Code Generation",
            "say": [
                "Google Protocol Buffers (Protobuf) is a language-neutral, platform-neutral binary serialization standard based on .proto schema definition files.",
                "The standard Google C++ Protobuf library is heavily dependent on the Standard Template Library (std::string, std::vector), dynamic polymorphism, and C++ RTTI, which require megabytes of flash and heap—unusable on bare-metal microcontrollers.",
                "NanoPB is the industry-standard ANSI C implementation of Protocol Buffers specifically re-engineered for embedded systems.",
                "NanoPB Architecture & Invariants:",
                "1) Static In-Memory Allocation: NanoPB compiles .proto schemas directly into standard C structs with fixed-size arrays or max_size annotations. Zero heap allocation is required during encoding or decoding.",
                "2) Stream-Based Processing: NanoPB uses pb_ostream_from_buffer() and pb_istream_from_buffer() to serialize directly into fixed stack or static buffers.",
                "3) Wire Format Tagging: Each field on the wire is preceded by a 1-byte or multi-byte Tag. The Tag encodes two values: (field_number << 3) | wire_type.",
                "Wire Types: 0 = Varint (int32, int64, uint32, bool), 1 = 64-bit fixed (double), 2 = Length-delimited (string, bytes, submessage), 5 = 32-bit fixed (float)."
            ],
            "example": "A field 'uint32 device_id = 1;' has field_number = 1 and wire_type = 0 (Varint). The wire tag is (1 << 3) | 0 = 0x08.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

enum WireType {
    VARINT = 0,
    FIXED64 = 1,
    LENGTH_DELIMITED = 2,
    FIXED32 = 5
};

uint8_t encodeTag(uint32_t fieldNumber, WireType wireType) {
    return static_cast<uint8_t>((fieldNumber << 3) | (wireType & 0x07));
}

void decodeTag(uint8_t tag, uint32_t& fieldNumber, WireType& wireType) {
    wireType = static_cast<WireType>(tag & 0x07);
    fieldNumber = tag >> 3;
}

int main() {
    std::cout << "--- DAY 39 PART 2: PROTOBUF WIRE TAG MECHANICS ---" << std::endl;
    
    // Simulate field tag encoding for schema:
    // 1: uint32 device_id (Varint)
    // 2: float temperature (Fixed32)
    // 3: string location (Length-delimited)
    
    uint8_t tag1 = encodeTag(1, WireType::VARINT);
    uint8_t tag2 = encodeTag(2, WireType::FIXED32);
    uint8_t tag3 = encodeTag(3, WireType::LENGTH_DELIMITED);

    std::cout << "Field 1 (Varint):            Tag = 0x" << std::hex << std::setw(2) << std::setfill('0') << (int)tag1 << std::dec << std::endl;
    std::cout << "Field 2 (Fixed32 Float):     Tag = 0x" << std::hex << std::setw(2) << std::setfill('0') << (int)tag2 << std::dec << std::endl;
    std::cout << "Field 3 (Length-Delimited):  Tag = 0x" << std::hex << std::setw(2) << std::setfill('0') << (int)tag3 << std::dec << std::endl;

    // Decode Tag 2
    uint32_t decodedField;
    WireType decodedWire;
    decodeTag(tag2, decodedField, decodedWire);
    std::cout << "\\nDecoded Tag 0x" << std::hex << (int)tag2 << std::dec << ": FieldNumber=" << decodedField << ", WireType=" << decodedWire << std::endl;
    return 0;
}
""",
            "output": """--- DAY 39 PART 2: PROTOBUF WIRE TAG MECHANICS ---
Field 1 (Varint):            Tag = 0x08
Field 2 (Fixed32 Float):     Tag = 0x15
Field 3 (Length-Delimited):  Tag = 0x1a

Decoded Tag 0x15: FieldNumber=2, WireType=5
""",
            "codeNotes": [
                {
                    "line": 4,
                    "note": "Standard Protobuf wire types define how subsequent field bytes are parsed."
                },
                {
                    "line": 11,
                    "note": "Field tag packing formula: (field_number << 3) | wire_type."
                },
                {
                    "line": 34,
                    "note": "Tag decoding extracts the exact field ID and wire type using bitwise shifts and masks."
                }
            ],
            "tryIt": "Compute the Protobuf tag byte for field number 4 with WireType FIXED64.",
            "check": {
                "question": "How is a Protocol Buffers field tag computed for field number 2 with wire type 5 (32-bit fixed)?",
                "options": [
                    "By bitwise packing: (2 << 3) | 5 = 16 | 5 = 21 (0x15).",
                    "By adding 2 + 5 = 7.",
                    "By encoding the ASCII string '2:5'.",
                    "By computing the MD5 hash of the field name."
                ],
                "answer": 0,
                "why": "The lower 3 bits of a Protobuf tag always store the wire type (0-7), while the remaining upper bits store the field number: (field_number << 3) | wire_type."
            }
        },
        {
            "title": "Varint 7-Bit Encoding & Wire Format Mechanics",
            "say": [
                "Variable-length quantities (Varints) are the foundational compression mechanism in Protocol Buffers, NanoPB, and CBOR.",
                "Standard 32-bit integers consume 4 bytes regardless of value: the number 1 consumes 0x00000001 (4 bytes).",
                "Varints encode integers using between 1 and 10 bytes, scaling dynamically with the magnitude of the number.",
                "The 7-bit Varint Encoding Rules:",
                "1. Each byte in a Varint has its Most Significant Bit (MSB, bit 7) designated as the Continuation Bit.",
                "2. The remaining 7 lower bits (bits 0-6) carry the actual payload data.",
                "3. If the MSB is 1, it indicates that further Varint bytes follow. If the MSB is 0, this is the final byte of the sequence.",
                "4. Endianness: The 7-bit groups are placed on the wire in Little-Endian order (least significant 7-bit group first).",
                "Efficiency: Any integer between 0 and 127 (0x00 to 0x7F) fits in exactly 1 byte (MSB=0). Values between 128 and 16,383 fit in 2 bytes."
            ],
            "example": "Encoding 300: 300 in binary is 00000001 00101100. Split into 7-bit groups: [0000010] [0101100]. Low group with MSB=1: 10101100 (0xAC). High group with MSB=0: 00000010 (0x02). Result: [0xAC, 0x02].",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

std::vector<uint8_t> encodeVarint(uint64_t value) {
    std::vector<uint8_t> bytes;
    while (value >= 0x80) {
        // Set MSB to 1, store lower 7 bits
        bytes.push_back(static_cast<uint8_t>((value & 0x7F) | 0x80));
        value >>= 7;
    }
    // Final byte has MSB = 0
    bytes.push_back(static_cast<uint8_t>(value & 0x7F));
    return bytes;
}

uint64_t decodeVarint(const std::vector<uint8_t>& bytes) {
    uint64_t result = 0;
    int shift = 0;
    for (uint8_t b : bytes) {
        result |= static_cast<uint64_t>(b & 0x7F) << shift;
        if ((b & 0x80) == 0) {
            break; // Final byte reached
        }
        shift += 7;
    }
    return result;
}

void printVarint(uint64_t value) {
    std::vector<uint8_t> encoded = encodeVarint(value);
    std::cout << "Value: " << std::setw(6) << value << " -> Varint (" << encoded.size() << " B): [ ";
    for (uint8_t b : encoded) {
        std::cout << "0x" << std::hex << std::setw(2) << std::setfill('0') << (int)b << " ";
    }
    std::cout << "]" << std::dec;
    uint64_t decoded = decodeVarint(encoded);
    std::cout << " -> Decoded: " << decoded << std::endl;
}

int main() {
    std::cout << "--- DAY 39 PART 3: 7-BIT VARINT ENCODING & DECODING ---" << std::endl;
    printVarint(1);      // 1 byte (0x01)
    printVarint(127);    // 1 byte (0x7F)
    printVarint(128);    // 2 bytes (0x80, 0x01)
    printVarint(300);    // 2 bytes (0xAC, 0x02)
    printVarint(16384);  // 3 bytes (0x80, 0x80, 0x01)
    return 0;
}
""",
            "output": """--- DAY 39 PART 3: 7-BIT VARINT ENCODING & DECODING ---
Value:      1 -> Varint (1 B): [ 0x01 ] -> Decoded: 1
Value:    127 -> Varint (1 B): [ 0x7f ] -> Decoded: 127
Value:    128 -> Varint (2 B): [ 0x80 0x01 ] -> Decoded: 128
Value:    300 -> Varint (2 B): [ 0xac 0x02 ] -> Decoded: 300
Value:  16384 -> Varint (3 B): [ 0x80 0x80 0x01 ] -> Decoded: 16384
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "encodeVarint loops as long as the value exceeds 7 bits (0x7F)."
                },
                {
                    "line": 9,
                    "note": "MSB continuation bit (0x80) indicates further bytes follow."
                },
                {
                    "line": 21,
                    "note": "decodeVarint accumulates 7-bit groups shifting left by 7 each iteration until MSB is 0."
                }
            ],
            "tryIt": "Manually calculate the Varint byte sequence for the integer 65536.",
            "check": {
                "question": "What is the purpose of the Most Significant Bit (MSB, bit 7) in each byte of a Protobuf Varint?",
                "options": [
                    "It acts as a Continuation Bit: 1 indicates more bytes follow, and 0 indicates the final byte.",
                    "It indicates the parity of the transmission.",
                    "It defines whether the number is signed or unsigned.",
                    "It specifies the encryption algorithm."
                ],
                "answer": 0,
                "why": "Varints use 7 bits for data payload and 1 bit (MSB) as a stream continuation flag, allowing the decoder to recognize the end of the integer without a separate length prefix."
            }
        },
        {
            "title": "ZigZag Integer Encoding: Protecting Small Negative Values",
            "say": [
                "While Varint encoding is brilliantly efficient for positive integers, it exhibits a catastrophic pathology when encoding signed two's-complement negative numbers.",
                "In standard two's-complement representation, -1 in 32-bit is 0xFFFFFFFF (all 32 bits set to 1).",
                "If encoded directly with standard Varint, the MSB is set across all bit groups. Consequently, -1 requires 5 bytes in int32 and 10 full bytes in int64!",
                "Thus, a common temperature reading of -1 C would consume more bandwidth than positive 10,000 C.",
                "The Solution: ZigZag Encoding (sint32 and sint64 in Protobuf).",
                "ZigZag maps signed integers to unsigned integers so that numbers with small absolute values (like -1, 1, -2, 2) have small unsigned values.",
                "32-bit ZigZag Formula: (n << 1) ^ (n >> 31), where >> is an arithmetic right shift.",
                "Mapping table:",
                "  0  -> 0",
                " -1  -> 1",
                "  1  -> 2",
                " -2  -> 3",
                "  2  -> 4",
                "With ZigZag, -1 maps to 1, which encodes into a single Varint byte (0x01) instead of 5 or 10 bytes!"
            ],
            "example": "Encoding -1 with sint32: ZigZag maps -1 to 1. Varint encodes 1 as 0x01 (1 byte). Raw int32 encoding of -1 produces [0xFF, 0xFF, 0xFF, 0xFF, 0x0F] (5 bytes).",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

// 32-bit ZigZag Encoder
uint32_t encodeZigZag32(int32_t n) {
    return static_cast<uint32_t>((n << 1) ^ (n >> 31));
}

// 32-bit ZigZag Decoder
int32_t decodeZigZag32(uint32_t n) {
    return static_cast<int32_t>((n >> 1) ^ -(static_cast<int32_t>(n & 1)));
}

std::vector<uint8_t> encodeVarint(uint64_t value); // Defined previously

void testZigZag(int32_t val) {
    uint32_t zz = encodeZigZag32(val);
    int32_t recovered = decodeZigZag32(zz);
    
    // Compare standard varint bytes vs zigzag varint bytes
    uint64_t rawUnsigned = static_cast<uint32_t>(val); // 2's complement
    
    // Simulate Varint lengths
    size_t rawLen = (val < 0) ? 5 : ((val <= 127) ? 1 : 2);
    size_t zzLen = (zz <= 127) ? 1 : ((zz <= 16383) ? 2 : 3);

    std::cout << "Signed: " << std::setw(4) << val 
              << " | ZigZag: " << std::setw(4) << zz 
              << " | Recovered: " << std::setw(4) << recovered
              << " | Raw Varint: " << rawLen << " B"
              << " | ZigZag Varint: " << zzLen << " B" << std::endl;
}

int main() {
    std::cout << "--- DAY 39 PART 4: ZIGZAG SIGNED ENCODING ---" << std::endl;
    testZigZag(0);
    testZigZag(-1);
    testZigZag(1);
    testZigZag(-2);
    testZigZag(2);
    testZigZag(-15);
    testZigZag(-100);
    return 0;
}
""",
            "output": """--- DAY 39 PART 4: ZIGZAG SIGNED ENCODING ---
Signed:    0 | ZigZag:    0 | Recovered:    0 | Raw Varint: 1 B | ZigZag Varint: 1 B
Signed:   -1 | ZigZag:    1 | Recovered:   -1 | Raw Varint: 5 B | ZigZag Varint: 1 B
Signed:    1 | ZigZag:    2 | Recovered:    1 | Raw Varint: 1 B | ZigZag Varint: 1 B
Signed:   -2 | ZigZag:    3 | Recovered:   -2 | Raw Varint: 5 B | ZigZag Varint: 1 B
Signed:    2 | ZigZag:    4 | Recovered:    2 | Raw Varint: 1 B | ZigZag Varint: 1 B
Signed:  -15 | ZigZag:   29 | Recovered:  -15 | Raw Varint: 5 B | ZigZag Varint: 1 B
Signed: -100 | ZigZag:  199 | Recovered: -100 | Raw Varint: 5 B | ZigZag Varint: 2 B
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "encodeZigZag32 maps negative numbers to odd positive integers and positive numbers to even positive integers."
                },
                {
                    "line": 11,
                    "note": "decodeZigZag32 inverts the mapping using bitwise arithmetic."
                },
                {
                    "line": 34,
                    "note": "Notice -1 consumes only 1 byte with ZigZag Varint, compared to 5 bytes with naive Varint."
                }
            ],
            "tryIt": "Demonstrate what ZigZag unsigned value is produced for -128.",
            "check": {
                "question": "What is the primary benefit of using ZigZag encoding (sint32) for signed integers in Protocol Buffers?",
                "options": [
                    "It maps small negative numbers (like -1 or -5) to small positive numbers, preventing them from blowing up into 5-byte or 10-byte Varints.",
                    "It encrypts the payload with AES-128.",
                    "It converts integers into IEEE-754 floating point.",
                    "It automatically detects parity errors."
                ],
                "answer": 0,
                "why": "In standard two's-complement arithmetic, negative numbers have their MSB set (e.g. 0xFFFFFFFF for -1). Varints interpret this as an enormous number requiring 5 to 10 bytes. ZigZag mapping ensures -1 maps to 1, fitting into a single byte."
            }
        },
        {
            "title": "CBOR (RFC 8949) vs. MessagePack: Schema vs Schema-less Binary Formats",
            "say": [
                "While Protocol Buffers and NanoPB achieve the highest compression and zero-allocation static typing, they require a pre-compiled .proto schema known identically to both sender and receiver.",
                "In dynamic IoT environments where payloads have arbitrary or evolving fields, schema-less binary formats are used: CBOR (Concise Binary Object Representation, RFC 8949) and MessagePack.",
                "CBOR Architecture (RFC 8949):",
                "CBOR is an IETF standard designed specifically for constrained IoT devices and is the native payload format for CoAP.",
                "Each CBOR data item starts with an initial byte encoding:",
                "  - Major Type (top 3 bits, bits 5-7): specifies the data type (0-7).",
                "  - Additional Information (lower 5 bits, bits 0-4): specifies the value or length.",
                "The 8 CBOR Major Types:",
                "  - Major Type 0: Unsigned Integer",
                "  - Major Type 1: Negative Integer",
                "  - Major Type 2: Byte String",
                "  - Major Type 3: Text String (UTF-8)",
                "  - Major Type 4: Array of data items",
                "  - Major Type 5: Map of pairs of data items (key-value dictionary)",
                "  - Major Type 6: Semantic Tag",
                "  - Major Type 7: Floating-point numbers and simple values (true, false, null).",
                "Trade-off Summary: NanoPB provides maximum efficiency (12B, 0 heap) but requires schema compilation. CBOR provides self-describing flexibility (18B, self-contained) without JSON's text parsing overhead."
            ],
            "example": "An unsigned integer 23 in CBOR is represented as Major Type 0 with value 23: binary 000_10111 = 0x17 (1 byte).",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

enum CBORMajorType {
    UINT = 0,
    NEGINT = 1,
    BYTES = 2,
    TEXT = 3,
    ARRAY = 4,
    MAP = 5,
    TAG = 6,
    SIMPLE_FLOAT = 7
};

uint8_t encodeCborInitialByte(CBORMajorType major, uint8_t addInfo) {
    return static_cast<uint8_t>((major << 5) | (addInfo & 0x1F));
}

std::vector<uint8_t> encodeCborUint(uint32_t val) {
    std::vector<uint8_t> out;
    if (val <= 23) {
        // Value fits directly in additional info
        out.push_back(encodeCborInitialByte(CBORMajorType::UINT, static_cast<uint8_t>(val)));
    } else if (val <= 0xFF) {
        // 1-byte integer follows (addInfo = 24)
        out.push_back(encodeCborInitialByte(CBORMajorType::UINT, 24));
        out.push_back(static_cast<uint8_t>(val));
    } else if (val <= 0xFFFF) {
        // 2-byte integer follows (addInfo = 25)
        out.push_back(encodeCborInitialByte(CBORMajorType::UINT, 25));
        out.push_back(static_cast<uint8_t>(val >> 8));
        out.push_back(static_cast<uint8_t>(val & 0xFF));
    }
    return out;
}

void printHex(const std::string& label, const std::vector<uint8_t>& bytes) {
    std::cout << label << " (" << bytes.size() << " B): [ ";
    for (uint8_t b : bytes) {
        std::cout << "0x" << std::hex << std::setw(2) << std::setfill('0') << (int)b << " ";
    }
    std::cout << "]" << std::dec << std::endl;
}

int main() {
    std::cout << "--- DAY 39 PART 5: CBOR (RFC 8949) SERIALIZATION ---" << std::endl;
    // Test CBOR uint encoding
    printHex("CBOR Uint 10 (Direct)", encodeCborUint(10));
    printHex("CBOR Uint 23 (Max direct)", encodeCborUint(23));
    printHex("CBOR Uint 100 (1 byte ext)", encodeCborUint(100));
    printHex("CBOR Uint 1000 (2 byte ext)", encodeCborUint(1000));
    return 0;
}
""",
            "output": """--- DAY 39 PART 5: CBOR (RFC 8949) SERIALIZATION ---
CBOR Uint 10 (Direct) (1 B): [ 0x0a ]
CBOR Uint 23 (Max direct) (1 B): [ 0x17 ]
CBOR Uint 100 (1 byte ext) (2 B): [ 0x18 0x64 ]
CBOR Uint 1000 (2 byte ext) (3 B): [ 0x19 0x03 0xe8 ]
""",
            "codeNotes": [
                {
                    "line": 4,
                    "note": "CBOR defines 8 Major Types occupying the 3 most significant bits of the initial byte."
                },
                {
                    "line": 17,
                    "note": "Values from 0 to 23 fit directly into the lower 5 bits of the initial byte."
                },
                {
                    "line": 23,
                    "note": "Values exceeding 23 use special markers (24 for 1B, 25 for 2B, 26 for 4B, 27 for 8B)."
                }
            ],
            "tryIt": "Describe how CBOR represents a Map of 2 key-value pairs (Major Type 5).",
            "check": {
                "question": "How does CBOR (RFC 8949) structure each encoded data item in its binary format?",
                "options": [
                    "With an initial byte containing a 3-bit Major Type (data type) and a 5-bit Additional Information field (value or length).",
                    "With an ASCII JSON string followed by a null terminator.",
                    "With a 32-bit CRC checksum preceding all data.",
                    "With an XML tag."
                ],
                "answer": 0,
                "why": "CBOR encodes every item starting with an initial byte partitioned into a 3-bit Major Type (specifying unsigned, negative, bytes, string, array, map, tag, or float) and 5 bits of additional information indicating inline value or following byte length."
            }
        }
    ],
    "summary": [
        "ASCII JSON causes severe heap fragmentation, high parsing CPU latency, and 75% bandwidth waste on microcontrollers.",
        "Protocol Buffers and NanoPB compile schemas into fixed-size C structs, achieving zero-allocation encoding and decoding.",
        "Varints compress integers using 7 data bits and 1 MSB continuation bit, representing small integers (0-127) in 1 byte.",
        "ZigZag encoding maps signed integers to unsigned space, preventing small negative values like -1 from expanding to 5 or 10 bytes.",
        "CBOR (RFC 8949) provides a self-describing binary alternative to JSON with 8 Major Types, widely adopted in CoAP IoT systems."
    ],
    "projectStep": {
        "title": "Deploying NanoPB on Bare-Metal ARM Cortex-M Firmware",
        "steps": [
            "Write a telemetry.proto file defining industrial sensor readings with fixed field numbers.",
            "Compile the .proto file with nanobp_generator.py to produce telemetry.pb.h and telemetry.pb.c.",
            "Initialize a pb_ostream_t stream pointing to a static stack buffer.",
            "Invoke pb_encode() and transmit the compact binary payload over cellular or satellite."
        ]
    }
}

with open('scripts/iot_emb_day39.json', 'w', encoding='utf-8') as f:
    json.dump(day39, f, indent=2)
print("Wrote scripts/iot_emb_day39.json successfully!")
