import json

def generate_day19():
    day19 = {
        "coursePrefix": "iot_sec",
        "day": 19,
        "title": "Hardware-Enforced TLS 1.3 Client Handshake on MCU: wolfSSL/mbedTLS Optimization",
        "goal": "Master RFC 8446 TLS 1.3 on memory-constrained microcontrollers, optimize embedded TLS stacks (wolfSSL/mbedTLS) with static buffers, and implement hardware-accelerated 1-RTT ECDHE handshakes and HKDF key schedules.",
        "minutes": 38,
        "recap": "Yesterday we tackled certificate revocation bottlenecks using OCSP Stapling and compact Bloom filters. Today we implement the gold standard of secure network transport on microcontrollers: hardware-enforced RFC 8446 TLS 1.3.",
        "parts": [
            {
                "title": "RFC 8446 TLS 1.3 Architecture: Radical Streamlining & Forward Secrecy",
                "say": [
                    "Transport Layer Security (TLS) is the cornerstone of encrypted Internet communications. For over two decades, TLS 1.2 and its predecessors protected client-server data flows. However, TLS 1.2 suffered from accumulated cryptographic debt: fragile RSA key exchanges lacking forward secrecy, vulnerable CBC-mode symmetric ciphers prone to padding oracle attacks (e.g., POODLE, Lucky Thirteen), insecure SHA-1 hashing, and a sluggish 2-RTT (Round Trip Time) handshake negotiation.",
                    "In 2018, the IETF published RFC 8446, standardizing TLS 1.3. Rather than an incremental update, TLS 1.3 is a radical, ground-up architectural overhaul. It ruthlessly pruned obsolete and dangerous cryptographic primitives. Static RSA key exchanges, Diffie-Hellman with custom parameters, stream ciphers like RC4, and CBC-mode ciphers were completely eliminated. In their place, TLS 1.3 mandates strictly Authenticated Encryption with Associated Data (AEAD)—specifically AES-GCM, AES-CCM, and ChaCha20-Poly1305.",
                    "Crucially for IoT edge computing, TLS 1.3 streamlined the handshake from two round trips down to a single round trip (1-RTT). In TLS 1.2, the client sent a ClientHello, waited for the server's ServerHello and Certificate, negotiated a key exchange, and only then derived encryption keys. In TLS 1.3, the client anticipates the server's cipher suite and immediately transmits its ephemeral Diffie-Hellman public key share directly inside the ClientHello message.",
                    "When the server receives the ClientHello, it generates its own ephemeral key share, computes the shared Diffie-Hellman secret, and replies with ServerHello. From that exact instant forward, all subsequent handshake messages (including the server's certificate, certificate verification signature, and finished confirmation) are completely encrypted across the wire.",
                    "This 1-RTT architecture delivers two monumental advantages for embedded microcontrollers: 1) Handshake Latency is cut by 50%, allowing low-power devices to transmit data and shut down cellular/Wi-Fi radios twice as fast; and 2) Handshake Encryption hides server and client certificates from eavesdroppers, preventing network adversaries from fingerprinting edge device identities or firmware capabilities."
                ],
                "example": "Let us inspect the construction of a TLS 1.3 Handshake Transcript Hash, demonstrating how the cryptographic digest is maintained across ClientHello and ServerHello exchanges.",
                "code": "client_random = b\"\\x01\" * 32\nserver_random = b\"\\x02\" * 32\n\ntranscript = hashlib.sha256()\nclient_hello = b\"ClientHello:TLS_AES_128_GCM_SHA256:x25519\" + client_random\nserver_hello = b\"ServerHello:TLS_AES_128_GCM_SHA256:x25519\" + server_random\n\ntranscript.update(client_hello)\ntranscript.update(server_hello)\nthash = transcript.hexdigest()\nprint(f\"Transcript Length: {len(client_hello) + len(server_hello)} bytes\")\nprint(f\"Transcript SHA-256 Digest: {thash[:16]}...\")",
                "output": "Transcript Length: 146 bytes\nTranscript SHA-256 Digest: ba48b0ef81d846b6...",
                "codeNotes": [
                    "ClientHello embeds supported cipher suites and ephemeral key shares.",
                    "ServerHello confirms cipher selection and returns the server's ephemeral public key.",
                    "Transcript hash digests every handshake byte sent and received, binding session keys to the exact communication history."
                ],
                "tryIt": "Append a mock EncryptedExtensions message to the transcript and observe how the rolling SHA-256 digest changes deterministically.",
                "check": {
                    "question": "Why does TLS 1.3 mandate ephemeral Diffie-Hellman key exchanges (ECDHE) over static RSA key exchanges?",
                    "options": [
                        "To guarantee Perfect Forward Secrecy (PFS), ensuring that compromising the server's long-term private key in the future cannot decrypt past recorded sessions.",
                        "Because static RSA keys cannot be transmitted over Wi-Fi networks.",
                        "Because Diffie-Hellman key shares require fewer than 4 bytes of memory.",
                        "Static RSA key exchanges were patented by commercial certificate authorities."
                    ],
                    "answer": 0,
                    "why": "With ephemeral ECDHE, keys are generated afresh for each session and discarded immediately afterward, ensuring Perfect Forward Secrecy."
                }
            },
            {
                "title": "Hardware-Accelerated Ephemeral ECDHE Key Exchange on Edge Silicon",
                "say": [
                    "In RFC 8446, key exchange is governed exclusively by Ephemeral Elliptic Curve Diffie-Hellman (ECDHE). The standard focuses on two primary curve families: Montgomery curves (specifically Curve25519, X25519) and Weierstrass prime curves (NIST P-256 / secp256r1).",
                    "For microcontrollers, the mathematical operations underpinning ECDHE—specifically scalar point multiplication ($Q = d \\cdot G$)—are computationally intensive. Performing a 256-bit point multiplication in software on a 32-bit Cortex-M0+ or M4 core requires tens of millions of CPU clock cycles, causing sluggish multi-second latencies and depleting battery reserves.",
                    "To execute TLS 1.3 handshakes in milliseconds, modern IoT microcontrollers integrate dedicated hardware cryptographic engines (e.g., STM32 PKA, Microchip ATECC608, NXP EdgeLock SE050, or Silicon Labs Secure Vault). When initiating a handshake, the firmware issues a command to the hardware accelerator to generate an ephemeral private scalar ($a$) using on-chip entropy and compute the corresponding public point ($A = a \\cdot G$).",
                    "During the exchange, the edge client transmits its public key point ($A$) in the `key_share` extension of the ClientHello. When the server replies with its ephemeral public key point ($B$), the client firmware loads point $B$ into the hardware co-processor, which executes point multiplication with its internal private scalar: $S = a \\cdot B$.",
                    "Because of the algebraic symmetry of elliptic curves ($a \\cdot (b \\cdot G) = b \\cdot (a \\cdot G) = a \\cdot b \\cdot G$), both client and server arrive at the identical shared secret scalar ($S$). Crucially, the hardware accelerator never exposes the scalar $S$ to firmware memory; instead, it pipes $S$ directly into the on-chip HKDF engine to derive session traffic keys."
                ],
                "example": "Let us simulate the mathematical symmetry of Diffie-Hellman key derivation, showing how both client and server independently compute the identical shared secret scalar.",
                "code": "client_priv = 0x5A5A5A5A\nserver_priv = 0x7B7B7B7B\ngenerator_g = 0x09\nprime_p = 0xFFFFFFFFFFFFFFC5\n\nclient_pub = pow(generator_g, client_priv, prime_p)\nserver_pub = pow(generator_g, server_priv, prime_p)\n\nshared_client = pow(server_pub, client_priv, prime_p)\nshared_server = pow(client_pub, server_priv, prime_p)\nshared_secret_bytes = struct.pack(\">Q\", shared_client)\n\nprint(f\"Client PubKey: 0x{client_pub:016X}\")\nprint(f\"Server PubKey: 0x{server_pub:016X}\")\nprint(f\"Secrets Match: {shared_client == shared_server} (Shared Secret: {shared_secret_bytes.hex().upper()})\")",
                "output": "Client PubKey: 0x05B9DDC22CAE2F9D\nServer PubKey: 0x2E569AC98E7C74DF\nSecrets Match: True (Shared Secret: 6F628255D485F1AC)",
                "codeNotes": [
                    "Client and server exchange only public keys over the unencrypted network.",
                    "Both parties compute the exact same shared secret scalar using their private scalars.",
                    "Hardware crypto accelerators execute this scalar multiplication in dedicated hardware registers with side-channel countermeasures."
                ],
                "tryIt": "Verify that changing client_priv to any other integer still produces matching shared secrets on both sides if recalculated.",
                "check": {
                    "question": "What is the primary benefit of routing the ECDHE shared secret directly into a hardware crypto engine rather than copying it to SRAM?",
                    "options": [
                        "It prevents cold-boot attacks, DMA bus snooping, and memory dump vulnerabilities from exposing master session secrets in plaintext RAM.",
                        "It doubles the CPU clock frequency of the microcontroller.",
                        "It converts the connection from TCP to UDP automatically.",
                        "It allows the device to communicate without an IP address."
                    ],
                    "answer": 0,
                    "why": "Keeping the shared secret inside hardware registers prevents memory inspection and side-channel attacks from compromising session confidentiality."
                }
            },
            {
                "title": "TLS 1.3 HKDF Key Schedule: Hierarchical Key Derivation (RFC 5869)",
                "say": [
                    "Once the ephemeral Diffie-Hellman shared secret is established, TLS 1.3 does not use it directly as an encryption key. Instead, RFC 8446 routes the secret through the HMAC-based Extract-and-Expand Key Derivation Function (HKDF), standardized under RFC 5869.",
                    "The TLS 1.3 key schedule is a deterministic, multi-stage state machine that generates distinct cryptographic keys for different phases of the connection: Early Data, Handshake Traffic, and Application Traffic. The key schedule operates via two core primitives: `HKDF-Extract(salt, IKM)` which condenses input key material into a uniform pseudorandom key (PRK), and `HKDF-Expand-Label(secret, label, context, length)` which derives specific output keys bound to protocol context.",
                    "In the first stage, the HKDF engine produces the Early Secret from external pre-shared keys (or all-zero salt if none). When the server's ephemeral key share arrives, the engine mixes the ECDHE shared secret with the derived early secret to generate the Handshake Secret.",
                    "From the Handshake Secret, the engine invokes `HKDF-Expand-Label` twice to produce two distinct 128-bit or 256-bit AEAD keys: 1) Client Handshake Traffic Key (used by the client to encrypt its handshake messages and Finished verify data); and 2) Server Handshake Traffic Key (used by the server to encrypt its Certificate and Finished message).",
                    "Once the handshake finishes and both sides verify mutual Finished MAC tags, the engine advances to the Master Secret stage. From the Master Secret, it derives the Client Application Traffic Key and Server Application Traffic Key. These keys encrypt all subsequent user telemetry and commands. If an application key is ever compromised, the handshake keys remain mathematically decoupled, preserving strict compartmentalization."
                ],
                "example": "Let us execute a complete TLS 1.3 HKDF key derivation sequence in Python, demonstrating how HKDF-Extract and HKDF-Expand-Label generate isolated Client and Server Handshake Traffic Keys.",
                "code": "def hkdf_extract(salt: bytes, ikm: bytes) -> bytes:\n    if not salt:\n        salt = b\"\\x00\" * 32\n    return hmac.new(salt, ikm, hashlib.sha256).digest()\n\ndef hkdf_expand_label(secret: bytes, label: str, context: bytes, length: int) -> bytes:\n    full_label = b\"tls13 \" + label.encode(\"ascii\")\n    hkdf_label = struct.pack(\">H\", length) + bytes([len(full_label)]) + full_label + bytes([len(context)]) + context\n    info = hkdf_label + b\"\\x01\"\n    return hmac.new(secret, info, hashlib.sha256).digest()[:length]\n\nshared_secret = b\"\\x42\" * 32\nearly_secret = hkdf_extract(b\"\\x00\" * 32, b\"\\x00\" * 32)\nderived_secret = hkdf_expand_label(early_secret, \"derived\", hashlib.sha256(b\"\").digest(), 32)\nhandshake_secret = hkdf_extract(derived_secret, shared_secret)\n\nmock_transcript = hashlib.sha256(b\"handshake_transcript\").digest()\nclient_hs_key = hkdf_expand_label(handshake_secret, \"c hs traffic\", mock_transcript, 16)\nserver_hs_key = hkdf_expand_label(handshake_secret, \"s hs traffic\", mock_transcript, 16)\n\nprint(f\"Handshake Secret: {handshake_secret.hex()[:16]}...\")\nprint(f\"Client HS Traffic Key: {client_hs_key.hex().upper()}\")\nprint(f\"Server HS Traffic Key: {server_hs_key.hex().upper()}\")",
                "output": "Handshake Secret: bb518f061c911017...\nClient HS Traffic Key: 47CEDBEF6AC63489FE20E468A318FE34\nServer HS Traffic Key: 7757C1707A1DC6FF202F5807CA088BD6",
                "codeNotes": [
                    "HKDF-Extract concentrates entropy from the ephemeral shared secret into the Handshake Secret.",
                    "HKDF-Expand-Label formats the RFC 8446 HkdfLabel structure with the 'tls13 ' prefix and transcript hash context.",
                    "Derives distinct keys for client-to-server and server-to-client directions, preventing reflection attacks."
                ],
                "tryIt": "Modify the code to derive a 12-byte initialization vector (IV) using the label 'c hs iv' with length 12.",
                "check": {
                    "question": "Why does TLS 1.3 include the transcript hash inside the HKDF-Expand-Label context when deriving traffic keys?",
                    "options": [
                        "It cryptographically binds the derived traffic keys to the exact history of exchanged handshake messages, preventing man-in-the-middle tampering.",
                        "It compresses the traffic keys so they take up less space in flash memory.",
                        "It allows the router to inspect application payload contents.",
                        "It enables the device to skip certificate validation if the transcript is small."
                    ],
                    "answer": 0,
                    "why": "Binding keys to the transcript hash ensures that if an attacker modified even a single bit of ClientHello or ServerHello, key derivation will diverge and communication will fail."
                }
            },
            {
                "title": "Embedded TLS Optimization: wolfSSL/mbedTLS Static Memory & MFLN",
                "say": [
                    "Standard desktop TLS implementations (such as OpenSSL) are built for servers and personal computers with gigabytes of RAM. In an OpenSSL session, each connection allocates dynamic heap memory for 16 KB input/output record buffers, certificate caches, and session contexts—easily consuming 40 KB to 100 KB of RAM per connection.",
                    "On an embedded microcontroller equipped with only 32 KB or 64 KB of total SRAM, running standard desktop TLS configurations causes immediate heap exhaustion. To deploy TLS 1.3 successfully on bare metal, firmware engineers utilize specialized embedded TLS stacks such as wolfSSL or ARM mbedTLS, configuring them for static memory allocation.",
                    "In wolfSSL, developers enable `#define WOLFSSL_STATIC_MEMORY` and define dedicated static memory pools (`wolfSSL_init_memory()`). This eliminates `malloc()` and `free()` entirely, allocating all handshake buffers, session contexts, and cipher state variables inside fixed `.bss` arrays at compile time.",
                    "The single largest memory consumer in TLS is the TLS Record Layer. By default, the TLS specification allows record fragments up to 16,384 bytes (16 KB). To accommodate this, an endpoint must allocate a 16 KB RX buffer and a 16 KB TX buffer—consuming 32 KB of RAM just for record staging! On a 32 KB MCU, this consumes 100% of available memory.",
                    "Embedded architectures solve this using RFC 6066 Maximum Fragment Length Negotiation (MFLN) or RFC 8449 Record Size Limit. During the ClientHello, the edge device includes the `max_fragment_length` extension, requesting the server to clamp record sizes to 512, 1024, or 2048 bytes. Clamping records to 512 bytes reduces required buffer memory from 32 KB down to just 1 KB—an astounding 94% SRAM reduction that enables full TLS 1.3 compliance on sub-$1 microcontrollers."
                ],
                "example": "Let us compute the memory footprint savings achieved by enabling RFC 6066 Maximum Fragment Length Negotiation (MFLN) on an embedded microcontroller.",
                "code": "standard_record_buffer = 16384\nmfln_512_buffer = 512\nstandard_ram_bytes = (standard_record_buffer * 2) + 1024\nmfln_ram_bytes = (mfln_512_buffer * 2) + 1024\nsavings_percent = (1 - (mfln_ram_bytes / standard_ram_bytes)) * 100\n\nprint(f\"Standard TLS 1.3 Record RAM: {standard_ram_bytes / 1024:.1f} KB\")\nprint(f\"Optimized MFLN-512 Record RAM: {mfln_ram_bytes / 1024:.2f} KB\")\nprint(f\"SRAM Savings: {savings_percent:.1f}%\")",
                "output": "Standard TLS 1.3 Record RAM: 33.0 KB\nOptimized MFLN-512 Record RAM: 2.00 KB\nSRAM Savings: 93.9%",
                "codeNotes": [
                    "Standard TLS requires 33 KB of RAM for full 16 KB record buffers.",
                    "RFC 6066 MFLN-512 clamps records to 512 bytes, shrinking required buffer space to 2 KB.",
                    "Achieves 93.9% SRAM savings, making TLS 1.3 feasible on low-cost 32 KB microcontrollers."
                ],
                "tryIt": "Compute the RAM requirements and savings percentage if MFLN is configured for 1024 bytes instead of 512 bytes.",
                "check": {
                    "question": "What is the primary purpose of RFC 6066 Maximum Fragment Length Negotiation (MFLN) in embedded TLS 1.3?",
                    "options": [
                        "It restricts the maximum size of TLS record fragments to 512-2048 bytes, drastically reducing required RX/TX buffer memory in MCU SRAM.",
                        "It compresses TLS records using GZIP compression.",
                        "It increases the maximum Wi-Fi transmission power.",
                        "It allows microcontrollers to bypass Diffie-Hellman key derivation."
                    ],
                    "answer": 0,
                    "why": "Restricting fragment length allows microcontrollers to allocate tiny 512-byte static buffers instead of massive 16 KB buffers, saving over 90% of RAM."
                }
            },
            {
                "title": "ApexBaremetalTlsEngine: Production 1-RTT Handshake Subsystem",
                "say": [
                    "To synthesize all cryptographic, protocol, and memory principles into a production-grade firmware subsystem, we deploy the ApexBaremetalTlsEngine. This engine implements a robust, deterministic TLS 1.3 client state machine designed specifically for bare-metal ARM Cortex-M microcontrollers.",
                    "The engine guides the edge device through the complete 1-RTT handshake lifecycle: 1) Initializing the rolling SHA-256 transcript hash; 2) Generating an ephemeral ECDHE keypair and transmitting the ClientHello with X25519 key share; 3) Ingesting the ServerHello, computing the shared secret, and advancing the HKDF state to derive Handshake Traffic Keys; 4) Decrypting the encrypted server parameters and verifying the server certificate chain; and 5) Validating the server's Finished message MAC tag before transitioning to the ESTABLISHED operational state.",
                    "Throughout the handshake, the ApexBaremetalTlsEngine operates with zero dynamic memory allocation. All state variables, record buffers, and key schedules are pre-allocated in static memory with strict MPU protection. If any protocol violation occurs—such as a transcript hash mismatch, an unexpected message sequence, or an invalid Finished MAC—the engine transitions immediately to a hard ERROR state, purging all intermediate keys from registers.",
                    "By combining RFC 8446 1-RTT streamlining, hardware-accelerated ECDHE scalar math, HKDF key derivation, and static buffer optimization, the ApexBaremetalTlsEngine delivers impenetrable transport security. It proves that even the most constrained industrial edge nodes can participate in modern zero-trust enterprise networks without sacrificing performance, battery life, or memory safety."
                ],
                "example": "Let us execute the complete ApexBaremetalTlsEngine state machine, walking through ClientHello dispatch, ServerHello processing, key derivation, and Finished verification.",
                "code": "class ApexBaremetalTlsEngine:\n    def __init__(self):\n        self.state = \"START\"\n        self.transcript = hashlib.sha256()\n        self.handshake_secret = None\n\n    def send_client_hello(self):\n        ch_data = b\"ClientHello:TLS_AES_128_GCM_SHA256:ECDHE_X25519\"\n        self.transcript.update(ch_data)\n        self.state = \"WAIT_SERVER_HELLO\"\n        return ch_data\n\n    def process_server_hello(self, sh_data: bytes, shared_secret: bytes):\n        if self.state != \"WAIT_SERVER_HELLO\":\n            raise ValueError(\"Unexpected state\")\n        self.transcript.update(sh_data)\n        thash = self.transcript.digest()\n        self.handshake_secret = hmac.new(b\"derived_early\", shared_secret, hashlib.sha256).digest()\n        client_write_key = hmac.new(self.handshake_secret, b\"tls13 c hs key\" + thash, hashlib.sha256).digest()[:16]\n        self.state = \"HANDSHAKE_ENCRYPTED\"\n        return client_write_key\n\n    def finish_handshake(self, server_finished_mac: bytes):\n        if self.state != \"HANDSHAKE_ENCRYPTED\":\n            raise ValueError(\"Handshake not encrypted\")\n        expected_mac = hmac.new(self.handshake_secret, b\"finished:\" + self.transcript.digest(), hashlib.sha256).digest()[:16]\n        if server_finished_mac != expected_mac:\n            self.state = \"ERROR\"\n            return False\n        self.state = \"ESTABLISHED\"\n        return True\n\nengine = ApexBaremetalTlsEngine()\nch = engine.send_client_hello()\nsh = b\"ServerHello:ECDHE_ACCEPTED\"\nmock_shared = b\"\\x33\" * 32\nclient_key = engine.process_server_hello(sh, mock_shared)\nexpected_mac = hmac.new(engine.handshake_secret, b\"finished:\" + engine.transcript.digest(), hashlib.sha256).digest()[:16]\nsuccess = engine.finish_handshake(expected_mac)\n\nprint(f\"Engine State: {engine.state}\")\nprint(f\"Client Write Key: {client_key.hex().upper()}\")\nprint(f\"Handshake Completed: {success}\")",
                "output": "Engine State: ESTABLISHED\nClient Write Key: 6CB49FE680C453CAC04179132C1CD1E4\nHandshake Completed: True",
                "codeNotes": [
                    "Tracks handshake progress through a formal finite state machine (START -> WAIT_SERVER_HELLO -> HANDSHAKE_ENCRYPTED -> ESTABLISHED).",
                    "Updates rolling transcript hash across every message flight.",
                    "Verifies cryptographic Finished MAC before allowing application data transmission."
                ],
                "tryIt": "Corrupt the server_finished_mac byte string and confirm that the engine transitions to 'ERROR' and returns False.",
                "check": {
                    "question": "What is the security function of the Finished message in the TLS 1.3 handshake?",
                    "options": [
                        "It provides an HMAC over the entire handshake transcript, proving to both parties that no man-in-the-middle tampered with unencrypted handshake parameters.",
                        "It transmits the microcontroller's hardware serial number in plaintext.",
                        "It closes the TCP connection cleanly.",
                        "It requests the server to send an updated firmware binary."
                    ],
                    "answer": 0,
                    "why": "The Finished message contains an HMAC computed over the complete transcript of all prior handshake messages, confirming integrity and preventing downgrade attacks."
                }
            }
        ],
        "summary": [
            "RFC 8446 TLS 1.3 eliminates vulnerable legacy ciphers, mandating AEAD and 1-RTT ephemeral ECDHE handshakes with forward secrecy.",
            "Hardware-accelerated X25519 and P-256 point multiplication enables edge microcontrollers to execute handshakes in milliseconds with side-channel protection.",
            "The HKDF key schedule (RFC 5869) derives cryptographically isolated Early, Handshake, and Application Traffic Keys bound to transcript hashes.",
            "Embedded TLS optimization leverages static memory pools and RFC 6066 MFLN-512 to reduce record buffer SRAM by over 93%, enabling sub-2KB TLS execution."
        ],
        "projectStep": {
            "title": "Build and Benchmark Hardware-Enforced TLS 1.3 Client Handshake Engine",
            "steps": [
                "Configure static memory pools in wolfSSL/mbedTLS to eliminate runtime dynamic heap allocations.",
                "Enable RFC 6066 Maximum Fragment Length Negotiation (MFLN-512) to clamp record buffer memory to 2 KB.",
                "Execute an ephemeral X25519/P-256 key exchange using hardware crypto accelerator registers.",
                "Run the complete ApexBaremetalTlsEngine 1-RTT handshake state machine and benchmark cycle count and memory footprint."
            ]
        }
    }

    with open("scripts/iot_sec_day19.json", "w", encoding="utf-8") as f:
        json.dump(day19, f, indent=2)
    print("Day 19 generated successfully!")

if __name__ == "__main__":
    generate_day19()
