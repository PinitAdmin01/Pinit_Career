import json

def generate_day26():
    day26 = {
        "coursePrefix": "iot_sec",
        "day": 26,
        "title": "Defense-in-Depth Layering & Microcontroller Network Hardening: Port & Protocol Lockdown",
        "goal": "Master bare-metal attack surface minimization, enforce static TCP/UDP port whitelisting, architect token-bucket rate limiting against embedded DoS attacks, and construct memory-safe packet framing parsers on constrained microcontrollers.",
        "minutes": 38,
        "recap": "Yesterday we completed Milestone 5, integrating dual-bank FOTA, eFuse anti-rollback fencing, and TCG DICE attestation. Today we inaugurate Block 6 with network-layer defense-in-depth, locking down bare-metal communication interfaces against remote exploitation.",
        "parts": [
            {
                "title": "Attack Surface Minimization & The Fallacy of the Single Defensive Perimeter",
                "say": [
                    "A dangerous illusion frequently traps embedded systems designers: the belief that implementing a cryptographic Root of Trust and TLS 1.3 transport encryption renders an IoT device completely immune to cyber attacks. This assumption represents a fatal misunderstanding of the layered security model.",
                    "Even if a microcontroller boasts hardware bus encryption, tamper-proof eFuses, and mutual TLS authentication, what happens if the application runtime leaves an unauthenticated Telnet server listening on TCP Port 23 for factory diagnostics? What happens if the cellular modem stack includes an unencrypted FTP server on Port 21, or an embedded HTTP management server on Port 80 containing hardcoded vendor credentials? An attacker does not need to crack AES-256 or break elliptic curve signatures. The attacker connects to Port 23, enters default credentials (or exploits an unauthenticated command injection bug), and executes arbitrary machine instructions inside the microcontroller's memory space, completely bypassing the cryptographic Root of Trust.",
                    "This exact failure mode birthed the catastrophic Mirai, Reaper, and Mozi botnet outbreaks, which commandeered millions of commercial IP cameras, smart routers, and industrial gateways. The infected hardware frequently possessed authentic silicon certificates, but their software configurations exposed legacy listening ports and debugging interfaces to the public internet.",
                    "To counteract this architectural vulnerability, embedded security engineers enforce the Defense-in-Depth principle and Attack Surface Minimization. Defense-in-Depth mandates that security must not depend on any single protective perimeter. If the transport layer is breached, the network layer must restrict access; if the network layer is probed, application parsers must reject malformed inputs; if an application crashes, the memory protection unit must prevent privilege escalation.",
                    "Attack surface minimization begins with a brutal operational rule: If a network port, protocol, or peripheral interface is not strictly required for production telemetry, it must be permanently disabled at compile time. Unused socket listeners, debugging daemons, and legacy plain-text protocols must be purged from the firmware binary, eliminating entire classes of remote exploitation vectors before devices ship to the field."
                ],
                "example": "Let us contrast a vulnerable default device configuration exposing legacy ports against a hardened policy allowing only encrypted communication.",
                "code": "# Attack surface assessment: default vs hardened matrix\ndefault_ports = {21: \"OPEN\", 23: \"OPEN\", 80: \"OPEN\", 443: \"OPEN\", 8883: \"OPEN\"}\n\nallowed_ports = {443, 8883}\nhardened_ports = {p: (\"OPEN\" if p in allowed_ports else \"BLOCKED\") for p in default_ports}\n\ninsecure_open_count = sum(1 for p, s in hardened_ports.items() if s == \"OPEN\" and p not in allowed_ports)\nprint(\"Default Config Ports :\", default_ports)\nprint(\"Hardened Config Ports:\", hardened_ports)\nprint(\"Insecure Ports Open  :\", insecure_open_count)",
                "output": "Default Config Ports : {21: 'OPEN', 23: 'OPEN', 80: 'OPEN', 443: 'OPEN', 8883: 'OPEN'}\nHardened Config Ports: {21: 'BLOCKED', 23: 'BLOCKED', 80: 'BLOCKED', 443: 'OPEN', 8883: 'OPEN'}\nInsecure Ports Open  : 0",
                "codeNotes": [
                    "Audits network attack surface across legacy plaintext services and modern secure protocols.",
                    "Blocks insecure protocols (FTP Port 21, Telnet Port 23, HTTP Port 80) at the network layer.",
                    "Restricts ingress communications strictly to encrypted endpoints (HTTPS Port 443, MQTTS Port 8883)."
                ],
                "tryIt": "Add Port 22 (SSH) to default_ports and verify that it is blocked unless explicitly added to allowed_ports.",
                "check": {
                    "question": "Why is cryptographic Root of Trust alone insufficient to protect a device if legacy listening ports remain open?",
                    "options": [
                        "Attackers can connect to unauthenticated legacy ports (like Telnet) and execute arbitrary code, bypassing cryptographic hardware protections.",
                        "Legacy ports cause the battery to discharge in under ten seconds.",
                        "The Root of Trust cannot function when connected to a Wi-Fi router.",
                        "Open ports cause the silicon crystal oscillator to lose calibration."
                    ],
                    "answer": 0,
                    "why": "Application-layer backdoors or unauthenticated legacy daemons provide direct execution paths for attackers, rendering lower-level hardware security anchors irrelevant."
                }
            },
            {
                "title": "Port Lockdown & Interface Binding: The Static Port Map Invariant",
                "say": [
                    "In bare-metal and RTOS-based microcontrollers utilizing embedded TCP/IP stacks (such as lwIP, FreeRTOS+TCP, or Zephyr Net), network sockets consume valuable volatile memory. Each active TCP Protocol Control Block (PCB) requires 150 to 300 bytes of scarce SRAM. On an MCU with 32 KB of RAM, allocating memory for unused network listeners is both a security hazard and an operational waste.",
                    "To harden the network boundary, the firmware architecture establishes the Static Port Map Invariant. Rather than allowing application tasks to dynamically open arbitrary listening sockets, the network stack is configured with a deterministic ingress whitelist compiled directly into read-only flash memory.",
                    "Furthermore, the engine enforces strict Interface Binding. In modern industrial IoT systems, microcontrollers frequently bridge multiple physical network interfaces: 1) A Public Cellular WAN interface (e.g. LTE-M or NB-IoT); 2) A Local Maintenance Service Port (e.g. USB CDC-ECM or RS-485 serial); and 3) A Low-Power Wireless Mesh interface (e.g. IEEE 802.15.4 Thread).",
                    "A critical vulnerability arises when diagnostic services intended strictly for factory technicians over local USB are accidentally bound to INADDR_ANY (0.0.0.0), exposing the diagnostic shell across the cellular WAN. A remote attacker on the cellular carrier network can probe the device and access internal debugging routines.",
                    "Our hardened ingress engine evaluates incoming packets using a three-tuple filter: Target Port, Protocol Type (TCP/UDP), and Physical Ingress Interface ID. Any packet arriving on an unauthorized interface—or targeting an unlisted port—is discarded at the link layer before socket buffers or protocol state machines allocate memory, ensuring complete isolation."
                ],
                "example": "Let us implement a bare-metal ingress packet filtering table and verify that unlisted ports and unauthorized interfaces are rejected.",
                "code": "whitelist = {\n    8883: {\"proto\": \"TCP\", \"tls\": True, \"iface\": \"WAN\"},\n    443:  {\"proto\": \"TCP\", \"tls\": True, \"iface\": \"WAN\"}\n}\n\ndef evaluate_ingress(port: int, proto: str, iface: str) -> bool:\n    rule = whitelist.get(port)\n    if not rule:\n        return False\n    return rule[\"proto\"] == proto and rule[\"iface\"] == iface\n\ntelnet_ok = evaluate_ingress(23, \"TCP\", \"WAN\")\nmqtts_ok = evaluate_ingress(8883, \"TCP\", \"WAN\")\n\nprint(f\"Ingress Port 23 (Telnet): {'ACCEPTED' if telnet_ok else 'REJECTED (PORT_LOCKED)'}\")\nprint(f\"Ingress Port 8883 (MQTTS): {'ACCEPTED' if mqtts_ok else 'REJECTED'}\")",
                "output": "Ingress Port 23 (Telnet): REJECTED (PORT_LOCKED)\nIngress Port 8883 (MQTTS): ACCEPTED",
                "codeNotes": [
                    "Defines an immutable lookup table binding allowed ports to specific protocols and interfaces.",
                    "Evaluates incoming connections at the driver ingress boundary before allocating socket memory.",
                    "Rejects unauthorized connection attempts with zero state retention to prevent resource exhaustion."
                ],
                "tryIt": "Attempt to evaluate port 8883 on iface 'USB' and confirm that it is rejected due to interface mismatch.",
                "check": {
                    "question": "What security hazard occurs when a diagnostic service binds to INADDR_ANY (0.0.0.0) instead of a specific local interface?",
                    "options": [
                        "The diagnostic service becomes accessible from all network interfaces, exposing local debugging tools to remote WAN attackers.",
                        "The microcontroller's Ethernet MAC address is permanently erased.",
                        "The operating system crashes immediately upon booting.",
                        "The flash memory is reformatted automatically."
                    ],
                    "answer": 0,
                    "why": "Binding to INADDR_ANY binds the socket to all interfaces, exposing internal or local diagnostic tools to untrusted external networks."
                }
            },
            {
                "title": "Rate Limiting & Denial-of-Service (DoS) Shielding on Constrained Stacks",
                "say": [
                    "Even when an IoT device exposes only authenticated ports (such as MQTTS on Port 8883), it remains susceptible to Denial-of-Service (DoS) and Resource Exhaustion attacks. On enterprise servers equipped with 64 GB of RAM, absorbing thousands of incoming connection requests per second is manageable. On a Cortex-M4 microcontroller with 64 KB of total SRAM and an lwIP stack limited to 4 concurrent TCP control blocks, the threat profile is fundamentally different.",
                    "An adversary can launch a simple TCP SYN Flood or rapid-fire connection attempt against Port 8883. Each half-open connection allocates a TCP PCB, consumes a packet buffer (pbuf), and starts retransmission timers. Within milliseconds, the device's socket table is completely exhausted (MEMP_NUM_TCP_PCB reached). Legitimate cloud telemetry tasks fail to allocate sockets, sensor queues overflow, and the device freezes, prompting the hardware watchdog to reset the MCU into an endless reboot loop.",
                    "To prevent resource exhaustion, embedded network architectures implement Token Bucket Rate Limiting. The token bucket algorithm maintains a fixed token capacity and refills tokens at a calibrated, steady-state rate. Each incoming connection attempt consumes one token. If the bucket is empty, the connection attempt is dropped instantly without allocating socket control blocks or CPU execution time.",
                    "Crucially, the rate limiter operates with zero dynamic memory allocation. By updating token levels dynamically using elapsed millisecond timestamps, the limiter calculates available capacity with minimal arithmetic operations, protecting the TCP/IP stack from upstream network flooding."
                ],
                "example": "Let us simulate an embedded Token Bucket Rate Limiter handling a burst of rapid connection requests.",
                "code": "class TokenBucketLimiter:\n    def __init__(self, capacity: int, refill_rate: float):\n        self.capacity = capacity\n        self.tokens = capacity\n        self.refill_rate = refill_rate\n        self.last_check = 0.0\n\n    def allow_connection(self, timestamp: float) -> bool:\n        elapsed = timestamp - self.last_check\n        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)\n        self.last_check = timestamp\n        \n        if self.tokens >= 1.0:\n            self.tokens -= 1.0\n            return True\n        return False\n\nlimiter = TokenBucketLimiter(capacity=3, refill_rate=0.5)\n\nr1 = limiter.allow_connection(0.0)\nr2 = limiter.allow_connection(0.0)\nr3 = limiter.allow_connection(0.0)\nr4 = limiter.allow_connection(0.0)\n\nprint(f\"Req 1 (t=0.0): {'ALLOWED' if r1 else 'RATE_LIMITED'}\")\nprint(f\"Req 2 (t=0.0): {'ALLOWED' if r2 else 'RATE_LIMITED'}\")\nprint(f\"Req 3 (t=0.0): {'ALLOWED' if r3 else 'RATE_LIMITED'}\")\nprint(f\"Req 4 (t=0.0): {'ALLOWED' if r4 else 'RATE_LIMITED'}\")",
                "output": "Req 1 (t=0.0): ALLOWED\nReq 2 (t=0.0): ALLOWED\nReq 3 (t=0.0): ALLOWED\nReq 4 (t=0.0): RATE_LIMITED",
                "codeNotes": [
                    "Maintains a bounded burst capacity to accommodate legitimate network retransmissions.",
                    "Refills available connection tokens at a constant rate based on elapsed system timestamps.",
                    "Rejects connection requests exceeding burst capacity instantly, preventing socket table starvation."
                ],
                "tryIt": "Check allow_connection at timestamp 2.0 and verify that new tokens have accumulated to permit a request.",
                "check": {
                    "question": "Why are resource exhaustion attacks (like SYN floods) particularly devastating to resource-constrained microcontrollers?",
                    "options": [
                        "Microcontrollers have very small socket tables (e.g. 4-8 TCP PCBs); exhausting them halts all network communications and can trigger watchdog reboot loops.",
                        "SYN floods cause the physical microcontroller chip to overheat and melt.",
                        "SYN packets permanently corrupt the internal flash memory bootloader.",
                        "Microcontrollers cannot drop packets without human confirmation."
                    ],
                    "answer": 0,
                    "why": "Constrained memory limits the number of concurrent socket structures; exhausting these blocks causes service failure and potential watchdog resets."
                }
            },
            {
                "title": "Memory-Safe Protocol Parsing & Packet Sanitization Fencing",
                "say": [
                    "Once a packet passes port lockdown and rate limiting filters, it arrives at the protocol parser. In embedded C firmware, protocol parsers represent the single most exploited attack surface. A parser must read binary streams from network buffers, extract header lengths, and copy payloads into application memory.",
                    "Classic parsing bugs abound: 1) Declared Length vs Buffer Boundary Mismatches: An incoming packet declares a payload length of 1024 bytes, but the receiving buffer is only 256 bytes. A naive memcpy overwrites adjacent variables, corrupts stack return pointers, and grants the attacker remote code execution; 2) Integer Overflows: A parser adds a header length (e.g., 6 bytes) to an untrusted 16-bit payload length (e.g., 65535 bytes), wrapping the total to 5 bytes and allocating insufficient memory; 3) Truncated Packet Over-reads: The parser attempts to read fields beyond the end of the received packet buffer, leaking sensitive cryptographic keys from SRAM.",
                    "To prevent these exploits, bare-metal protocol parsers must enforce strict Packet Sanitization Fencing. Every parsing routine must implement defensive boundary assertions: First, verify that the received buffer contains at least the minimum mandatory header size. Second, validate protocol magic bytes to reject arbitrary garbage. Third, verify that the declared payload length is strictly less than or equal to the maximum architectural ceiling. Fourth, assert that the declared payload length plus header does not exceed the total bytes actually received.",
                    "By validating all four invariants before performing memory copies or dispatching message handlers, the parser guarantees memory safety and eliminates buffer overflow vulnerabilities at the network perimeter."
                ],
                "example": "Let us implement a defensive packet header validator that tests magic identifiers, payload length ceilings, and buffer bounds.",
                "code": "import struct\n\nMAX_PAYLOAD = 512\n\ndef validate_packet_header(raw_header: bytes, total_buf_len: int) -> tuple:\n    if len(raw_header) < 6:\n        return False, \"HEADER_TRUNCATED\"\n    magic, payload_len, p_type, _ = struct.unpack(\">HHBB\", raw_header[:6])\n    if magic != 0xAA55:\n        return False, \"INVALID_MAGIC\"\n    if payload_len > MAX_PAYLOAD:\n        return False, f\"PAYLOAD_OVERFLOW: {payload_len} > {MAX_PAYLOAD}\"\n    if total_buf_len < 6 + payload_len:\n        return False, \"PACKET_TRUNCATED\"\n    return True, f\"VALID_FRAME_TYPE_{p_type}_LEN_{payload_len}\"\n\nhdr_good = struct.pack(\">HHBB\", 0xAA55, 128, 1, 0)\nhdr_overflow = struct.pack(\">HHBB\", 0xAA55, 1024, 1, 0)\n\nres1_ok, res1_msg = validate_packet_header(hdr_good, 6 + 128)\nres2_ok, res2_msg = validate_packet_header(hdr_overflow, 6 + 1024)\n\nprint(f\"Frame 1 (128B): {res1_msg} (Passed: {res1_ok})\")\nprint(f\"Frame 2 (1024B): {res2_msg} (Passed: {res2_ok})\")",
                "output": "Frame 1 (128B): VALID_FRAME_TYPE_1_LEN_128 (Passed: True)\nFrame 2 (1024B): PAYLOAD_OVERFLOW: 1024 > 512 (Passed: False)",
                "codeNotes": [
                    "Validates protocol magic identifier (0xAA55) to discard malformed noise packets immediately.",
                    "Enforces hard architectural ceiling (MAX_PAYLOAD=512) on untrusted length headers.",
                    "Verifies that the physical buffer contains all declared bytes before memory operations begin."
                ],
                "tryIt": "Pass a raw_header with magic 0x1234 and verify that INVALID_MAGIC is returned.",
                "check": {
                    "question": "Why must an embedded protocol parser validate that declared payload length is within total buffer length before copying data?",
                    "options": [
                        "To prevent buffer over-read or overflow attacks where untrusted length fields cause memory corruption or leakage of adjacent SRAM data.",
                        "To speed up microcontroller clock frequency.",
                        "To convert binary numbers into ASCII strings.",
                        "To ensure the Wi-Fi antenna remains in phase."
                    ],
                    "answer": 0,
                    "why": "Unvalidated length fields cause buffer overflows or over-reads; bounds checking ensures operations remain strictly within allocated buffer boundaries."
                }
            },
            {
                "title": "ApexNetworkHardeningEngine: Integrated Bare-Metal Defense-in-Depth Subsystem",
                "say": [
                    "To synthesize all network hardening controls into a production-grade bare-metal architecture, we implement the ApexNetworkHardeningEngine. This subsystem acts as the first line of defense for the microcontroller's network stack, sitting directly between the hardware MAC/PHY driver and the upper application services.",
                    "The engine coordinates three defensive layers: 1) Port Lockdown: An ingress filter evaluates the destination port, rejecting all unauthorized or plaintext protocols; 2) Rate Limiting: A token bucket throttle drops excessive connection bursts, safeguarding TCP socket control blocks from exhaustion; 3) Packet Boundary Validation: A framing validator checks protocol magic words and payload size limits before allocating frame buffers.",
                    "When an incoming packet arrives from the Ethernet MAC, Wi-Fi modem, or cellular baseband, it passes through the engine's inspection pipeline. If an attacker attempts to connect to Port 23 (Telnet), the packet is dropped with an immediate security audit counter increment. If an attacker targets the legitimate Port 8883 but injects an oversized frame designed to cause a heap overflow, the boundary validator intercepts the anomaly and safely discards the frame.",
                    "By combining port whitelisting, rate limiting, and defensive parsing, the ApexNetworkHardeningEngine reduces the device's attack surface to the absolute minimum, guaranteeing that only authentic, rate-governed, and well-formed packets reach application execution threads."
                ],
                "example": "Let us execute the ApexNetworkHardeningEngine across port scans, valid telemetry packets, and buffer overflow exploit attempts.",
                "code": "import struct\n\nclass ApexNetworkHardeningEngine:\n    def __init__(self, allowed_ports: set, max_payload: int):\n        self.allowed_ports = allowed_ports\n        self.max_payload = max_payload\n        self.tokens = 5\n        self.rejected_count = 0\n\n    def process_ingress_packet(self, port: int, packet_bytes: bytes) -> tuple:\n        if port not in self.allowed_ports:\n            self.rejected_count += 1\n            return False, f\"BLOCKED_UNAUTHORIZED_PORT_{port}\"\n        \n        if self.tokens <= 0:\n            self.rejected_count += 1\n            return False, \"BLOCKED_RATE_LIMIT_EXCEEDED\"\n        self.tokens -= 1\n        \n        if len(packet_bytes) < 4:\n            self.rejected_count += 1\n            return False, \"BLOCKED_HEADER_MALFORMED\"\n        \n        magic, length = struct.unpack(\">HH\", packet_bytes[:4])\n        if magic != 0x5049: # 'PI' (PinIT)\n            self.rejected_count += 1\n            return False, \"BLOCKED_INVALID_PROTOCOL_MAGIC\"\n        if length > self.max_payload:\n            self.rejected_count += 1\n            return False, f\"BLOCKED_PAYLOAD_SIZE_{length}\"\n        if len(packet_bytes) < 4 + length:\n            self.rejected_count += 1\n            return False, \"BLOCKED_PACKET_TRUNCATION\"\n        \n        return True, f\"ACCEPTED_PORT_{port}_LEN_{length}\"\n\nengine = ApexNetworkHardeningEngine(allowed_ports={8883, 443}, max_payload=256)\n\np1_ok, p1_msg = engine.process_ingress_packet(23, b\"HELLO\")\n\nvalid_pkt = struct.pack(\">HH\", 0x5049, 32) + b\"A\" * 32\np2_ok, p2_msg = engine.process_ingress_packet(8883, valid_pkt)\n\noverflow_pkt = struct.pack(\">HH\", 0x5049, 500) + b\"B\" * 500\np3_ok, p3_msg = engine.process_ingress_packet(8883, overflow_pkt)\n\nprint(f\"Port 23 Access  : {p1_msg} (Success: {p1_ok})\")\nprint(f\"Port 8883 Valid : {p2_msg} (Success: {p2_ok})\")\nprint(f\"Port 8883 Attack: {p3_msg} (Success: {p3_ok})\")\nprint(f\"Total Blocked Attacks: {engine.rejected_count}\")",
                "output": "Port 23 Access  : BLOCKED_UNAUTHORIZED_PORT_23 (Success: False)\nPort 8883 Valid : ACCEPTED_PORT_8883_LEN_32 (Success: True)\nPort 8883 Attack: BLOCKED_PAYLOAD_SIZE_500 (Success: False)\nTotal Blocked Attacks: 2",
                "codeNotes": [
                    "Coordinates port lockdown, rate limiting, and payload boundary sanitization in a unified engine.",
                    "Blocks unauthorized legacy ports and malformed packets before they reach application buffers.",
                    "Tracks total rejected attacks to provide real-time security auditing and anomaly detection."
                ],
                "tryIt": "Drain all 5 tokens and verify that subsequent packets return BLOCKED_RATE_LIMIT_EXCEEDED.",
                "check": {
                    "question": "What is the primary architectural purpose of the ApexNetworkHardeningEngine in bare-metal IoT firmware?",
                    "options": [
                        "Act as a pre-socket network firewall enforcing port lockdown, rate limiting, and buffer boundary sanitization to eliminate remote exploit vectors.",
                        "Compress audio streams for telephone calls.",
                        "Recompile C code into JavaScript.",
                        "Format the device's internal flash memory periodically."
                    ],
                    "answer": 0,
                    "why": "The engine acts as a pre-socket defensive filter, blocking unauthorized ports, throttling flood attacks, and sanitizing frames to prevent memory corruption."
                }
            }
        ],
        "summary": [
            "Hardware roots of trust and cryptographic encryption are rendered useless if devices expose unauthenticated, plaintext listening ports.",
            "Attack surface minimization dictates that all unused ports (FTP, Telnet, HTTP) must be compiled out and disabled permanently.",
            "Token bucket rate limiting protects resource-constrained TCP/IP stacks from socket starvation and denial-of-service reboot loops.",
            "Defensive protocol parsers must enforce strict payload ceilings and buffer bounds to prevent buffer overflow and memory corruption exploits."
        ],
        "projectStep": {
            "title": "Bare-Metal Network Hardening & Attack Surface Minimization Subsystem",
            "steps": [
                "Configure network stack configuration headers (lwipopts.h) to compile out all legacy unencrypted services.",
                "Implement static ingress port and interface binding whitelist tables in read-only memory.",
                "Integrate token-bucket rate limiting into driver packet reception hooks to mitigate DoS flooding.",
                "Implement strict boundary assertions and magic byte verification in application protocol parsers."
            ]
        }
    }
    with open('scripts/iot_sec_day26.json', 'w', encoding='utf-8') as f:
        json.dump(day26, f, indent=2)
    print("Generated base Day 26 in scripts/iot_sec_day26.json")

if __name__ == '__main__':
    generate_day26()
