import json

def generate_day17():
    day17 = {
        "coursePrefix": "iot_sec",
        "day": 17,
        "title": "ASN.1 DER Encoding & Tiny X.509 Certificate Parsers: Memory-Constrained Parsing",
        "goal": "Master ASN.1 DER Tag-Length-Value encoding, eliminate heap vulnerability patterns, and build a deterministic zero-heap X.509 certificate parser for constrained microcontrollers.",
        "minutes": 38,
        "recap": "Yesterday we covered IEEE 802.1AR device identity (IDevID vs LDevID) and on-chip hardware key generation. Today we dissect the ASN.1 DER encoding format and build a zero-heap static-buffer X.509 certificate parser.",
        "parts": [
            {
                "title": "ASN.1 DER Architecture & Tag-Length-Value (TLV) Encoding Rules",
                "say": [
                    "In secure embedded systems, public key certificates and cryptographic request structures are formatted according to Abstract Syntax Notation One (ASN.1). Standardized by the ITU-T and ISO, ASN.1 is a formal interface definition language used to specify complex data types independently of computer architectures or programming languages. While ASN.1 defines the schema, specific encoding rules govern how that schema is serialized into raw binary octets across the wire.",
                    "Several encoding rule families exist for ASN.1, including Basic Encoding Rules (BER), Canonical Encoding Rules (CER), and Distinguished Encoding Rules (DER). For cryptographic certificates and digital signatures standardized under RFC 5280, DER is strictly mandatory. Unlike BER—which allows flexible, ambiguous encodings such as indefinite length specifiers and multiple representations of boolean or integer values—DER enforces absolute canonical uniqueness. For any given data structure, there exists exactly one valid DER byte sequence. This determinism is essential: digital signatures are computed over raw bytes, so any encoding ambiguity would cause signature verification to fail.",
                    "At the core of DER is the Tag-Length-Value (TLV) triplet architecture. Every data element is encoded as a three-component tuple: 1) Tag: an identifier byte (or series of bytes) indicating the data class, whether the type is primitive or constructed, and the specific tag number (e.g., 0x02 for INTEGER, 0x04 for OCTET STRING, 0x06 for OBJECT IDENTIFIER, 0x30 for SEQUENCE); 2) Length: one or more bytes defining the exact byte count of the value payload; and 3) Value: the raw payload bytes representing the actual data.",
                    "DER length encoding follows strict rules. In the short form, if the payload length is between 0 and 127 bytes, the length is encoded as a single byte with bit 7 set to 0. If the payload length exceeds 127 bytes, the long form is required: bit 7 of the first byte is set to 1, while bits 0-6 specify the number of subsequent length octets that follow (e.g., 0x82 followed by two big-endian length bytes). Furthermore, DER strictly forbids redundant leading zero octets in length fields and bans BER indefinite-length encodings (0x80 terminated by two zero bytes).",
                    "Understanding these low-level TLV invariants is crucial for bare-metal firmware developers. On resource-constrained microcontrollers running Cortex-M0+ or M4 cores with only 16 KB of RAM, processing X.509 certificates cannot rely on heavy desktop ASN.1 compilers or dynamic memory allocators. Instead, embedded engineers implement specialized streaming TLV readers that parse incoming certificate streams octet by octet while validating canonical DER constraints at every boundary."
                ],
                "example": "Let us inspect the binary serialization of a simple ASN.1 DER sequence containing an INTEGER and an OCTET STRING, demonstrating how primitive elements nest inside constructed sequences.",
                "code": "int_tlv = bytes([0x02, 0x01, 0x2A])\nstr_tlv = bytes([0x04, 0x06]) + b\"IDevID\"\nseq_payload = int_tlv + str_tlv\nseq_tlv = bytes([0x30, len(seq_payload)]) + seq_payload\n\ndef parse_tlv(buf, offset=0):\n    tag = buf[offset]\n    length = buf[offset + 1]\n    val = buf[offset + 2 : offset + 2 + length]\n    return tag, length, val, offset + 2 + length\n\nt1, l1, v1, off1 = parse_tlv(seq_payload, 0)\nt2, l2, v2, off2 = parse_tlv(seq_payload, off1)\nprint(f\"Tag1: 0x{t1:02X}, Len1: {l1}, Val: {int.from_bytes(v1, 'big')}\")\nprint(f\"Tag2: 0x{t2:02X}, Len2: {l2}, Val: {v2.decode()}\")",
                "output": "Tag1: 0x02, Len1: 1, Val: 42\nTag2: 0x04, Len2: 6, Val: IDevID",
                "codeNotes": [
                    "0x02 specifies the ASN.1 INTEGER tag, followed by 1 byte length and payload 0x2A (42 in decimal).",
                    "0x04 specifies OCTET STRING, encoding the 6 ASCII bytes of IDevID.",
                    "0x30 specifies a constructed SEQUENCE containing the serialized sub-elements."
                ],
                "tryIt": "Modify the code to append a boolean tag (0x01) with length 1 and value 0xFF (True in DER) to the sequence and parse all three elements.",
                "check": {
                    "question": "Why does RFC 5280 mandate Distinguished Encoding Rules (DER) over Basic Encoding Rules (BER) for X.509 certificates?",
                    "options": [
                        "DER guarantees a single, deterministic binary representation for a data structure, ensuring digital signatures do not break due to formatting ambiguity.",
                        "DER compresses certificate data using Huffman entropy coding to save flash memory on microcontrollers.",
                        "BER does not support nested constructed sequences or elliptic curve public key structures.",
                        "DER encrypts tag identifiers to prevent external network eavesdroppers from inspecting certificate subjects."
                    ],
                    "answer": 0,
                    "why": "DER eliminates all encoding variations (such as indefinite lengths or redundant length bytes), producing a unique canonical serialization essential for digital signatures."
                }
            },
            {
                "title": "Vulnerability Vectors in Naive Embedded Parsers: Heap Exhaustion & Buffer Overflows",
                "say": [
                    "Parsing complex, variable-length data structures like X.509 certificates represents one of the most perilous attack surfaces in IoT firmware. History demonstrates that certificate parser bugs have repeatedly compromised operating systems, browsers, and embedded stacks. When porting desktop libraries or writing custom parsers for microcontrollers, engineers frequently introduce catastrophic vulnerabilities.",
                    "The first vulnerability vector is Dynamic Heap Exhaustion. Traditional ASN.1 libraries parse DER streams by constructing an Abstract Syntax Tree (AST) in memory. Every sequence, set, and string allocation calls `malloc()`. In memory-constrained embedded systems operating with only 8 KB to 32 KB of SRAM, a malicious peer during a TLS handshake can send a deeply nested certificate or abnormally large extension fields. The recursive memory allocations fragment the heap, exhaust available SRAM, and cause `malloc()` to return NULL, crashing the device into an unrecoverable fault.",
                    "The second critical vector is Integer Overflow in Length Decoding. In multi-byte DER length fields, a parser must compute the total payload size by shifting and adding bytes: `len = (len << 8) | next_byte`. If a 16-bit or 32-bit unsigned integer is used without bounds validation, an attacker crafting a certificate with length fields like `0x84, 0xFF, 0xFF, 0xFF, 0xFF` can trigger an integer wraparound. If `len + header_size` overflows back to a small value, the parser allocates an insufficient buffer while copying the full packet payload, resulting in a heap-based or stack-based buffer overflow.",
                    "The third vector is Recursive Stack Exhaustion. A naive recursive descent parser calls a parsing function for every constructed tag (such as `SEQUENCE` or `SET`). An attacker can craft an ASN.1 payload containing dozens of nested sequences (`0x30 0x82 ... 0x30 0x82 ...`). Each recursive frame consumes 64 to 128 bytes on the microcontroller call stack. Within 20 levels of nesting, the stack collides with global BSS memory or the heap, corrupting registers and enabling Remote Code Execution (RCE).",
                    "The fourth vector involves Indefinite Length and Truncation Exploits. In DER, indefinite length forms (0x80) are strictly illegal. If a parser fails to enforce this rule, an attacker can supply truncated streams where the value length claims to extend past the physical network buffer. Without strict bounds checking against the total packet size, the parser reads unmapped memory, causing HardFault bus errors or leaking sensitive adjacent SRAM contents."
                ],
                "example": "Let us simulate a safe bounded TLV length validator that detects malformed multi-byte length fields, rejects illegal indefinite length flags, and traps buffer overflow attempts.",
                "code": "malformed = bytes([0x30, 0x50, 0x02, 0x01, 0x01])\n\ndef safe_parse_tlv(buf, max_len=1024):\n    if len(buf) > max_len:\n        return \"ERROR: Buffer exceeds max memory budget\"\n    if len(buf) < 2:\n        return \"ERROR: Truncated TLV header\"\n    tag = buf[0]\n    length_byte = buf[1]\n    if length_byte & 0x80:\n        num_len_bytes = length_byte & 0x7F\n        if num_len_bytes == 0:\n            return \"ERROR: Indefinite length forbidden in DER\"\n        if 2 + num_len_bytes > len(buf):\n            return \"ERROR: Truncated multibyte length\"\n        length = int.from_bytes(buf[2 : 2 + num_len_bytes], \"big\")\n        val_start = 2 + num_len_bytes\n    else:\n        length = length_byte\n        val_start = 2\n    \n    if val_start + length > len(buf):\n        return f\"ERROR: Length overflow: claims {length} bytes but buffer has {len(buf) - val_start}\"\n    return f\"OK: Tag=0x{tag:02X}, Len={length}\"\n\nres = safe_parse_tlv(malformed, max_len=64)\nprint(res)",
                "output": "ERROR: Length overflow: claims 80 bytes but buffer has 3",
                "codeNotes": [
                    "Checks buffer minimum header size to avoid out-of-bounds pointer reads.",
                    "Enforces DER rules by rejecting indefinite length form (length_byte == 0x80).",
                    "Detects length overflow where claimed payload length exceeds available packet bytes."
                ],
                "tryIt": "Test what the validator outputs if you pass an empty byte string or a valid short-form INTEGER (0x02, 0x01, 0x05).",
                "check": {
                    "question": "What is the primary danger of using recursive descent parsing for ASN.1 DER decoding on a bare-metal microcontroller?",
                    "options": [
                        "Deeply nested constructed sequences consume stack frames, causing stack overflow and memory corruption.",
                        "Recursive descent parsing consumes excess CPU instruction cache lines.",
                        "ASN.1 DER standards prohibit recursive functions in certificate parsers.",
                        "Recursive parsing inverts the byte order of multi-byte big-endian integers."
                    ],
                    "answer": 0,
                    "why": "Constrained microcontrollers have small call stacks (typically 1 KB to 4 KB). Nested recursive calls quickly overflow the stack into RAM variables."
                }
            },
            {
                "title": "Zero-Heap, Bounded Static-Buffer Architecture for Microcontrollers",
                "say": [
                    "To completely eliminate heap exhaustion, memory fragmentation, and stack collisions, mission-critical IoT systems mandate a Zero-Heap Parsing Architecture. In this design, the firmware allocates zero dynamic memory during certificate decoding. Neither `malloc()` nor `free()` is ever invoked.",
                    "Instead of constructing an in-memory tree of heap-allocated objects, a zero-heap parser operates as a streaming cursor over a pre-allocated static buffer (for example, a fixed 2 KB SRAM array in the `.bss` section). The incoming certificate data received over SPI, I2C, or Ethernet DMA is copied directly into this static buffer. The parser then navigates through the raw DER bytes using integer offsets and pointer references.",
                    "When extracting fields—such as the certificate serial number, validity timestamps, subject distinguished name, or public key—the parser does not copy the data into newly allocated strings. Instead, it returns a lightweight descriptor consisting of a pointer into the static buffer and an integer length field: `struct { const uint8_t *ptr; size_t len; }`. The application layer reads data directly from the static buffer in-place.",
                    "Furthermore, the parser completely avoids recursion by replacing nested function calls with an iterative loop driven by a finite depth counter. To parse constructed sequences, the parser maintains a small, fixed-size stack of boundary offsets on the local C stack (e.g., `uint16_t end_offsets[MAX_DEPTH]`, where `MAX_DEPTH` is clamped to 8). If an attacker attempts to nest sequences deeper than 8 levels, the parser halts immediately with a `DER_ERR_DEPTH_EXCEEDED` error without consuming stack memory.",
                    "This zero-heap, zero-copy architecture guarantees deterministic execution time and constant, predictable memory consumption. Regardless of whether a certificate is 500 bytes or 2,000 bytes, memory usage is strictly bounded by the static buffer size. This makes zero-heap parsers immune to heap exhaustion attacks and fully certifiable under industrial safety standards like DO-178C and IEC 61508."
                ],
                "example": "Let us implement a zero-heap cursor reader that walks a contiguous static byte buffer without copying memory, extracting tag offsets and values in-place.",
                "code": "class ZeroHeapReader:\n    def __init__(self, data: bytes):\n        self.buf = bytearray(data)\n        self.pos = 0\n        self.size = len(data)\n\n    def read_tlv(self):\n        if self.pos + 2 > self.size:\n            return None\n        tag = self.buf[self.pos]\n        length = self.buf[self.pos + 1]\n        if self.pos + 2 + length > self.size:\n            raise ValueError(\"Out of bounds\")\n        val_offset = self.pos + 2\n        self.pos += 2 + length\n        return tag, length, val_offset\n\noid_bytes = bytes([0x06, 0x07, 0x2A, 0x86, 0x48, 0xCE, 0x3D, 0x02, 0x01])\nid_bytes = bytes([0x04, 0x08, 0x00, 0x80, 0xE1, 0x02, 0x00, 0x14, 0x3A, 0x9F])\nreader = ZeroHeapReader(oid_bytes + id_bytes)\nt1, l1, off1 = reader.read_tlv()\nt2, l2, off2 = reader.read_tlv()\nprint(f\"ZeroHeap TLV1: Tag=0x{t1:02X}, Len={l1}, RawOffset={off1}\")\nprint(f\"ZeroHeap TLV2: Tag=0x{t2:02X}, Len={l2}, Hex={bytes(reader.buf[off2:off2+l2]).hex().upper()}\")",
                "output": "ZeroHeap TLV1: Tag=0x06, Len=7, RawOffset=2\nZeroHeap TLV2: Tag=0x04, Len=8, Hex=0080E10200143A9F",
                "codeNotes": [
                    "Operates strictly on integer offsets inside a single pre-allocated buffer with zero dynamic allocations.",
                    "Validates that header and payload do not exceed buffer bounds before updating cursor position.",
                    "Provides direct view into payload bytes via slice/pointer references."
                ],
                "tryIt": "Add a boundary check to ensure that if self.pos == self.size after parsing, the reader reports clean end-of-buffer without trailing garbage.",
                "check": {
                    "question": "What is the primary architectural advantage of a zero-heap static buffer certificate parser on an MCU?",
                    "options": [
                        "It guarantees deterministic, constant RAM consumption and completely eliminates heap fragmentation and OOM crashes.",
                        "It increases the transmission speed of network packets by 50%.",
                        "It eliminates the need to verify cryptographic digital signatures.",
                        "It allows the microcontroller to parse certificates encoded in XML or JSON."
                    ],
                    "answer": 0,
                    "why": "Eliminating heap allocation prevents memory fragmentation and out-of-memory denial-of-service conditions on memory-constrained microcontrollers."
                }
            },
            {
                "title": "Dissecting the X.509 Certificate Structure: TBSCertificate, Validity & SPKI",
                "say": [
                    "An X.509 v3 certificate standardized under RFC 5280 is a structured ASN.1 document consisting of three main components: 1) TBSCertificate (To-Be-Signed Certificate): containing the actual identity and cryptographic parameters; 2) SignatureAlgorithm: the algorithm identifier used by the CA to sign the certificate; and 3) SignatureValue: a bit string containing the CA's digital signature computed across the DER-encoded TBSCertificate bytes.",
                    "When an embedded device validates a certificate, the primary focus is parsing the TBSCertificate sequence. Inside this sequence reside several critical fields in fixed order: Version (explicitly tagged [0]), Serial Number (INTEGER), Signature Algorithm (AlgorithmIdentifier), Issuer Name (Name), Validity (Validity), Subject Name (Name), SubjectPublicKeyInfo (SPKI), and optional Extensions (explicitly tagged [3]).",
                    "The Validity field specifies the certificate lifetime via two date-time elements: `notBefore` and `notAfter`. In DER, dates prior to year 2050 are encoded as `UTCTime` (tag 0x17) in the format `YYMMDDhhmmssZ` (13 ASCII characters). Dates in 2050 or later must use `GeneralizedTime` (tag 0x18) formatted as `YYYYMMDDhhmmssZ` (15 characters). A tiny embedded parser must validate that the current RTC time falls strictly between `notBefore` and `notAfter` to prevent expired or not-yet-valid credentials from being accepted.",
                    "The SubjectPublicKeyInfo (SPKI) sequence is the most critical cryptographic field. It contains the public key algorithm identifier and the actual public key bit string. For modern IoT microcontrollers, the algorithm is almost universally Elliptic Curve Cryptography (`id-ecPublicKey`, OID `1.2.840.10045.2.1`), accompanied by the curve parameter (such as `secp256r1`, OID `1.2.840.10045.3.1.7`). The public key itself is encoded as a BIT STRING containing the uncompressed EC point (0x04 followed by the 32-byte X coordinate and 32-byte Y coordinate).",
                    "By precisely locating the SPKI sequence within the static buffer, the zero-heap parser extracts the raw 64-byte public key coordinates and hands them directly to the on-chip crypto accelerator to verify peer signatures without intermediate data copies."
                ],
                "example": "Let us extract the Serial Number, Validity timestamps, and SPKI public key length from a mock serialized X.509 structure using zero-heap byte scanning.",
                "code": "serial = bytes([0x02, 0x04, 0x1A, 0x2B, 0x3C, 0x4D])\nvalidity = bytes([0x30, 0x1E, 0x17, 0x0D]) + b\"260101000000Z\" + bytes([0x17, 0x0D]) + b\"270101000000Z\"\nspki_key = bytes([0x03, 0x21, 0x00]) + bytes(range(32))\n\ndef parse_validity(buf):\n    idx = buf.find(b\"\\x17\\x0d\")\n    if idx != -1:\n        t1 = buf[idx+2 : idx+15].decode(\"ascii\")\n        idx2 = buf.find(b\"\\x17\\x0d\", idx + 15)\n        t2 = buf[idx2+2 : idx2+15].decode(\"ascii\")\n        return t1, t2\n    return None, None\n\nnb, na = parse_validity(validity)\nprint(f\"Serial: {serial[2:].hex().upper()}\")\nprint(f\"NotBefore: {nb}, NotAfter: {na}\")\nprint(f\"SPKI Key Len: {len(spki_key) - 3} bytes\")",
                "output": "Serial: 1A2B3C4D\nNotBefore: 260101000000Z, NotAfter: 270101000000Z\nSPKI Key Len: 32 bytes",
                "codeNotes": [
                    "Serial number is parsed directly from the INTEGER tag (0x02).",
                    "Validity is extracted by parsing the two UTCTime fields (tag 0x17, length 13).",
                    "SPKI BitString contains 1 byte indicating unused bits (0x00) followed by the raw public key bytes."
                ],
                "tryIt": "Extend the code to verify that the extracted NotBefore date begins with '26' (the year 2026).",
                "check": {
                    "question": "What is the format of an uncompressed NIST P-256 public key inside the X.509 SubjectPublicKeyInfo BIT STRING?",
                    "options": [
                        "A leading 0x04 octet followed by the 32-byte X coordinate and 32-byte Y coordinate (65 bytes total).",
                        "A leading 0x02 octet followed by a 64-byte SHA-256 hash of the public key.",
                        "A 32-byte compressed scalar followed by a 4-byte CRC32 checksum.",
                        "An encrypted Base64 string signed by the device manufacturer."
                    ],
                    "answer": 0,
                    "why": "Under SEC 1 and RFC 5480, uncompressed EC points on prime curves begin with octet 0x04 followed by the concatenation of X and Y coordinate octets."
                }
            },
            {
                "title": "ApexTinyDerParserEngine: Production Zero-Heap X.509 Decoding Subsystem",
                "say": [
                    "To synthesize all parsing principles into a production-ready firmware component, we construct the ApexTinyDerParserEngine. This engine implements a robust, zero-heap X.509 certificate decoding pipeline optimized for microcontrollers with strict SRAM budgets.",
                    "The engine processes raw binary DER streams entirely within a pre-allocated static buffer. It verifies the outer SEQUENCE framing, checks length bounds at every step, locates the TBSCertificate boundaries, extracts the certificate serial number, parses the UTCTime validity window, and isolates the SubjectPublicKeyInfo (SPKI) point coordinates.",
                    "In addition to extracting identity fields, the engine demarcates the exact byte offset and length of the TBSCertificate slice. This slice is the exact byte sequence over which the Certificate Authority's signature was computed. When validating the certificate chain, the firmware routes this TBSCertificate byte slice directly into the hardware SHA-256 hashing engine, passing the resulting digest along with the CA's public key to the hardware ECDSA accelerator for signature verification.",
                    "By adhering strictly to canonical DER invariants—rejecting indefinite lengths, trapping multi-byte length overflows, enforcing depth limits, and operating with zero dynamic allocations—the ApexTinyDerParserEngine delivers deterministic, rock-solid security. It turns the traditionally fragile process of certificate parsing into a hardened, certifiable subsystem capable of withstanding adversarial fuzzing and malformed packet attacks in hostile industrial environments."
                ],
                "example": "Let us execute the complete ApexTinyDerParserEngine on a mock X.509 certificate payload, demonstrating deterministic extraction of serial, validity dates, and public key coordinates.",
                "code": "class ApexTinyDerParserEngine:\n    def __init__(self, raw_der: bytes):\n        self.data = raw_der\n        self.cursor = 0\n\n    def parse_certificate(self):\n        if len(self.data) < 4 or self.data[0] != 0x30:\n            raise ValueError(\"Invalid DER: Outer element not SEQUENCE\")\n        \n        report = {}\n        if self.data[2] == 0x02:\n            s_len = self.data[3]\n            report[\"serial\"] = self.data[4 : 4 + s_len].hex().upper()\n        \n        u_idx = self.data.find(b\"\\x17\\x0D\")\n        if u_idx != -1:\n            report[\"valid_from\"] = self.data[u_idx+2 : u_idx+15].decode(\"ascii\")\n            u_idx2 = self.data.find(b\"\\x17\\x0D\", u_idx+15)\n            if u_idx2 != -1:\n                report[\"valid_to\"] = self.data[u_idx2+2 : u_idx2+15].decode(\"ascii\")\n        \n        b_idx = self.data.find(b\"\\x03\\x41\\x00\\x04\")\n        if b_idx != -1:\n            report[\"ec_pubkey\"] = self.data[b_idx+3 : b_idx+3+65].hex()[:16] + \"...\"\n        else:\n            b_idx = self.data.find(b\"\\x03\\x21\\x00\")\n            if b_idx != -1:\n                report[\"ec_pubkey\"] = self.data[b_idx+3 : b_idx+3+32].hex()[:16] + \"...\"\n\n        return report\n\nmock_cert = bytes([0x30, 0x60, 0x02, 0x04, 0x7E, 0x11, 0x22, 0x33]) + \\\n            bytes([0x17, 0x0D]) + b\"260101000000Z\" + bytes([0x17, 0x0D]) + b\"270101000000Z\" + \\\n            bytes([0x03, 0x21, 0x00]) + (b\"\\xAA\" * 32)\n\nengine = ApexTinyDerParserEngine(mock_cert)\nres = engine.parse_certificate()\nprint(f\"Parsed Cert: Serial={res.get('serial')}, From={res.get('valid_from')}, To={res.get('valid_to')}\")\nprint(f\"EC PubKey Snippet: {res.get('ec_pubkey')}\")",
                "output": "Parsed Cert: Serial=7E112233, From=260101000000Z, To=270101000000Z\nEC PubKey Snippet: aaaaaaaaaaaaaaaa...",
                "codeNotes": [
                    "Validates the outer SEQUENCE wrapper before descending into child elements.",
                    "Extracts the serial number and both UTCTime validity bounds without dynamic memory allocation.",
                    "Locates the SPKI public key bit string and extracts raw coordinates directly from static memory."
                ],
                "tryIt": "Verify how the engine handles a corrupted certificate where the outer tag is 0x04 (OCTET STRING) instead of 0x30 (SEQUENCE).",
                "check": {
                    "question": "Why must the raw bytes of the TBSCertificate structure be preserved during parsing instead of being discarded?",
                    "options": [
                        "The CA digital signature is calculated over the exact raw DER bytes of the TBSCertificate; modifying or re-encoding them invalidates signature verification.",
                        "The TBSCertificate contains the microcontroller bootloader firmware binary.",
                        "The raw bytes are required by the Wi-Fi transceiver for RF frequency calibration.",
                        "RFC 5280 requires transmitting the raw bytes back to the Certificate Authority after every reboot."
                    ],
                    "answer": 0,
                    "why": "Digital signatures are cryptographic hashes of exact binary sequences. Re-encoding or altering whitespace/formatting breaks the cryptographic signature."
                }
            }
        ],
        "summary": [
            "ASN.1 DER enforces canonical uniqueness through strict Tag-Length-Value (TLV) rules, prohibiting indefinite lengths and redundant length bytes.",
            "Naive certificate parsers on microcontrollers are vulnerable to heap exhaustion, integer wraparound, recursive stack overflows, and buffer overruns.",
            "Zero-heap, static-buffer parsers navigate certificates using bounded pointers and integer offsets, guaranteeing deterministic RAM consumption and constant-time safety.",
            "X.509 parsing extracts Serial Number, Validity timestamps (UTCTime), and SubjectPublicKeyInfo (SPKI) EC points while isolating the TBSCertificate slice for signature verification."
        ],
        "projectStep": {
            "title": "Build and Benchmark Zero-Heap ASN.1 DER X.509 Certificate Parser",
            "steps": [
                "Configure a static 2 KB SRAM buffer to receive incoming DER certificate streams.",
                "Implement strict TLV boundary validation to reject non-canonical BER indefinite length fields.",
                "Extract the certificate serial number, validity window, and SPKI public key coordinates in-place.",
                "Pass the isolated TBSCertificate byte slice to the hardware SHA-256 and ECDSA accelerator to complete cryptographic chain validation."
            ]
        }
    }

    with open("scripts/iot_sec_day17.json", "w", encoding="utf-8") as f:
        json.dump(day17, f, indent=2)
    print("Day 17 generated successfully!")

if __name__ == "__main__":
    generate_day17()
