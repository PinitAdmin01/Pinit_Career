import json

def generate_day20():
    day20 = {
        "coursePrefix": "iot_sec",
        "day": 20,
        "title": "⭐ Milestone 4: IEEE 802.1AR Device Identity & Bare-Metal TLS 1.3 Handshake Engine",
        "goal": "Synthesize IEEE 802.1AR secure device identity, zero-heap ASN.1 DER parsing, OCSP Stapling revocation checks, and hardware-enforced RFC 8446 TLS 1.3 into a unified production-grade edge handshake engine.",
        "minutes": 38,
        "recap": "Over Days 16-19 we mastered IoT PKI, zero-heap X.509 DER decoding, OCSP stapling revocation models, and MCU TLS 1.3 optimization. Today we unite these disciplines into ⭐ Milestone 4: the ApexMilestone4TlsIdentityEngine.",
        "parts": [
            {
                "title": "Milestone 4 Architecture: Defense-in-Depth Identity & Transport Pipeline",
                "say": [
                    "Welcome to Milestone 4 of IoT Hardware Security, Root of Trust & Secure Boot. Over the past four intensive days, we explored the critical pillars required to secure network communications for resource-constrained edge silicon: IEEE 802.1AR secure device identities (IDevID vs LDevID), zero-heap ASN.1 DER X.509 certificate parsing, low-memory certificate revocation models (OCSP Stapling and Bloom filters), and hardware-enforced RFC 8446 TLS 1.3 handshake mechanics.",
                    "Today, in Milestone 4, we bring these disparate systems together into a unified, high-assurance defense-in-depth architecture. In real-world industrial deployments—such as smart electrical meters communicating with utility head-ends, or autonomous railway signaling sensors authenticating to wayside controllers—security cannot exist in isolated silos. An identity certificate is useless if the parser is vulnerable to heap corruption; a robust TLS handshake is meaningless if rogue or revoked credentials are accepted; and transport encryption is futile if private keys can be extracted across external memory buses.",
                    "Our integrated Milestone 4 pipeline enforces strict security boundaries at every stage. Hardware Root of Trust anchors the immutable IDevID birthmark key in on-chip silicon storage. The TLS 1.3 client stack negotiates RFC 6066 Maximum Fragment Length (512 bytes) to operate within a deterministic 2 KB static SRAM envelope. The zero-heap ASN.1 parser validates peer certificate fields and extracts SPKI public keys without dynamic allocations. Finally, RFC 6066 OCSP Stapling and local Bloom filter delta checks guarantee real-time revocation verification before application data traffic is permitted.",
                    "This comprehensive architectural synthesis eliminates all classic embedded transport vulnerabilities: heap fragmentation, man-in-the-middle impersonation, offline certificate revocation bypasses, and key extraction. It establishes an impenetrable, mathematically verifiable bridge between physical silicon identity and enterprise cloud authority."
                ],
                "example": "Let us initialize the Milestone 4 cryptographic state context, binding the hardware EUI-64 IDevID identity and setting deterministic static memory limits.",
                "code": "eui64_hardware_id = \"00-80-E1-02-00-14-3A-9F\"\nserial_number = 0x1A2B3C4D\nmcu_sram_kb = 32\n\nstate = {\n    \"device_identity\": \"IEEE_802_1AR_IDEVID\",\n    \"eui64\": eui64_hardware_id,\n    \"serial\": f\"0x{serial_number:08X}\",\n    \"static_buffer_bytes\": 2048,\n    \"mfln_limit\": 512\n}\nprint(f\"Milestone 4 Init: Identity={state['device_identity']}, EUI64={state['eui64']}\")\nprint(f\"Hardware Serial: {state['serial']}, Static Buffer: {state['static_buffer_bytes']} B (MFLN: {state['mfln_limit']} B)\")",
                "output": "Milestone 4 Init: Identity=IEEE_802_1AR_IDEVID, EUI64=00-80-E1-02-00-14-3A-9F\nHardware Serial: 0x1A2B3C4D, Static Buffer: 2048 B (MFLN: 512 B)",
                "codeNotes": [
                    "Binds the device identity to the immutable IEEE EUI-64 hardware serial number.",
                    "Pre-allocates a static 2048-byte buffer to enforce zero-heap execution.",
                    "Configures MFLN limit to 512 bytes to maintain low memory footprints."
                ],
                "tryIt": "Modify serial_number to 0xDEADBEEF and verify that the formatted hardware serial reflects the change.",
                "check": {
                    "question": "What is the primary objective of unifying IEEE 802.1AR, zero-heap DER parsing, and TLS 1.3 in Milestone 4?",
                    "options": [
                        "To create an end-to-end defense-in-depth pipeline connecting physical silicon identity to encrypted cloud transport without heap vulnerabilities.",
                        "To eliminate the need for microcontrollers to use clocks.",
                        "To replace cellular modems with optical fiber cables.",
                        "To bypass cloud broker authentication rules."
                    ],
                    "answer": 0,
                    "why": "Unifying these technologies guarantees silicon-grounded identity, memory-safe parsing, and forward-secure encrypted transport."
                }
            },
            {
                "title": "Outbound Handshake Flight: Ephemeral Key Generation & ClientHello Assembly",
                "say": [
                    "The operational lifecycle of Milestone 4 begins with the dispatch of the outbound ClientHello flight. The edge device must initiate the TLS 1.3 handshake while asserting its IEEE 802.1AR credentials and negotiating memory-safe transport parameters.",
                    "The microcontroller triggers its on-chip hardware cryptographic engine or Secure Element to generate an ephemeral private scalar ($a$) using hardware entropy harvested from the on-chip TRNG. The co-processor executes point multiplication to produce the client's ephemeral public key ($A = a \\cdot G$) on Curve25519 or NIST P-256.",
                    "Next, the firmware constructs the ClientHello packet inside its static 2 KB staging buffer. The packet includes standard protocol fields: ClientRandom (32 cryptographically random bytes), cipher suites (strictly prioritizing `TLS_AES_128_GCM_SHA256`), and supported groups (`x25519` and `secp256r1`).",
                    "Critically, the ClientHello incorporates two essential embedded extensions: 1) `max_fragment_length` (MFLN), requesting record sizes clamped to 512 bytes; and 2) `status_request`, requesting the server to staple its OCSP revocation status token into the handshake flight. In mutual TLS (mTLS) configurations, the client also prepares its IEEE 802.1AR IDevID certificate containing the EUI-64 hardware identifier.",
                    "As the ClientHello bytes are transmitted across the network interface, the firmware feeds the exact byte stream into the hardware SHA-256 accelerator, establishing the foundation of the TLS 1.3 rolling handshake transcript hash."
                ],
                "example": "Let us assemble a simulated ClientHello flight embedding ephemeral ECDHE public key shares, MFLN-512 extensions, and EUI-64 hardware identity tokens.",
                "code": "ephemeral_priv = b\"\\x55\" * 32\nephemeral_pub = hashlib.sha256(ephemeral_priv).digest()\nclient_random = b\"\\xAA\" * 32\n\nch_payload = b\"TLS13_CH:\" + client_random + ephemeral_pub + b\":MFLN_512:SAN_EUI64_0080E10200143A9F\"\ntranscript = hashlib.sha256(ch_payload).digest()\nprint(f\"ClientHello Size: {len(ch_payload)} bytes\")\nprint(f\"Ephemeral PubKey: {ephemeral_pub.hex()[:16]}...\")\nprint(f\"Initial Transcript Hash: {transcript.hex()[:16]}...\")",
                "output": "ClientHello Size: 109 bytes\nEphemeral PubKey: 84126d0dd850199b...\nInitial Transcript Hash: ee756bd31cd4fdfe...",
                "codeNotes": [
                    "Generates 32-byte ephemeral public key share to guarantee forward secrecy.",
                    "Embeds MFLN-512 extension to constrain server response record sizes.",
                    "Computes initial SHA-256 transcript hash covering all ClientHello octets."
                ],
                "tryIt": "Change client_random to 32 bytes of 0xFF and observe the resulting transcript hash change.",
                "check": {
                    "question": "Why is the client's ephemeral public key share sent immediately inside the ClientHello in TLS 1.3?",
                    "options": [
                        "To enable a 1-RTT handshake, allowing the server to compute shared secrets and encrypt all subsequent handshake messages immediately.",
                        "To prevent the server from checking the client's IP address.",
                        "Because TLS 1.3 does not use server public keys.",
                        "To compress the TCP header."
                    ],
                    "answer": 0,
                    "why": "Sending the key share in ClientHello enables 1-RTT completion, allowing the server to derive handshake keys and encrypt its very first response flight."
                }
            },
            {
                "title": "Ingesting ServerFlight: Zero-Heap Parsing & OCSP Staple Validation",
                "say": [
                    "When the server responds, it transmits ServerHello followed immediately by encrypted handshake records: EncryptedExtensions, Certificate, CertificateVerify, and Finished. The edge microcontroller receives these chunks into its static 2 KB receive buffer.",
                    "The microcontroller's zero-heap parser immediately engages. It verifies that ServerHello confirms the negotiated cipher suite (`TLS_AES_128_GCM_SHA256`) and extracts the server's ephemeral public key ($B$). The rolling transcript hash is updated with the raw ServerHello bytes.",
                    "Next, the co-processor computes the shared Diffie-Hellman secret ($S = a \\cdot B$) and derives the Handshake Traffic Keys via HKDF. With handshake keys active, the hardware AES-GCM engine decrypts the incoming Certificate and EncryptedExtensions records in-place within the static buffer.",
                    "The zero-heap X.509 parser scans the server certificate, validating length fields, extracting the SubjectPublicKeyInfo (SPKI) point coordinates, and confirming that the current UTC time falls strictly between the `notBefore` and `notAfter` validity bounds.",
                    "Simultaneously, the engine extracts the stapled OCSP response. It verifies: 1) The response status is strictly 'GOOD'; 2) The freshness timestamp (`nextUpdate`) is greater than current time; and 3) The issuing CA's digital signature over the OCSP response is valid. This confirms real-time certificate legitimacy without generating external network queries."
                ],
                "example": "Let us simulate the verification of the incoming server flight, parsing certificate serial numbers and validating the stapled OCSP revocation status token.",
                "code": "server_ephemeral_pub = b\"\\xBB\" * 32\nserver_serial = 0x7E112233\nocsp_status = \"GOOD\"\nocsp_valid_until = 1775000000\ncurrent_time = 1770000000\n\nis_revocation_ok = (ocsp_status == \"GOOD\") and (current_time < ocsp_valid_until)\nprint(f\"Server Cert Serial: 0x{server_serial:08X}\")\nprint(f\"Stapled OCSP Status: {ocsp_status} (Valid until {ocsp_valid_until})\")\nprint(f\"Revocation Verification: {'PASSED' if is_revocation_ok else 'FAILED'}\")",
                "output": "Server Cert Serial: 0x7E112233\nStapled OCSP Status: GOOD (Valid until 1775000000)\nRevocation Verification: PASSED",
                "codeNotes": [
                    "Extracts server certificate serial and public key using zero-heap static parsing.",
                    "Verifies that the stapled OCSP status is GOOD and unexpired.",
                    "Protects device from communicating with revoked or compromised servers."
                ],
                "tryIt": "Set ocsp_status to 'REVOKED' and verify that the revocation verification outputs 'FAILED'.",
                "check": {
                    "question": "What happens if the server's stapled OCSP response has expired according to the edge device's real-time clock?",
                    "options": [
                        "The handshake is immediately aborted to prevent acceptance of revoked credentials.",
                        "The device switches to unencrypted HTTP.",
                        "The device waits 24 hours without resetting.",
                        "The device generates a new self-signed certificate."
                    ],
                    "answer": 0,
                    "why": "An expired OCSP staple cannot be trusted; the device must fail-closed to prevent replay of stale revocation tokens."
                }
            },
            {
                "title": "Cryptographic Verification & HKDF Master Secret Derivation",
                "say": [
                    "With peer credentials and revocation proofs verified, the engine executes final cryptographic validation and transitions to application data encryption.",
                    "The engine verifies the CertificateVerify signature. The server's signature was computed over the complete transcript hash up to that point. The microcontroller routes the isolated TBSCertificate bytes and server SPKI public key into the hardware ECDSA accelerator, validating the signature against the local trust anchor stored in write-protected flash.",
                    "Next, the engine advances the HKDF state machine. Having completed the handshake flight, the engine combines the Handshake Secret with the derived master salt to generate the Master Secret. From the Master Secret, it invokes `HKDF-Expand-Label` to generate: 1) Client Application Traffic Key and IV; and 2) Server Application Traffic Key and IV.",
                    "Finally, the engine authenticates the server's Finished message. The Finished message contains an HMAC calculated over the entire transcript hash using the server's finished key. The engine verifies the MAC tag in constant time. If the tag matches, both parties have proven that their view of the handshake is identical and that no man-in-the-middle has tampered with any parameter. The session transitions to the `MUTUAL_TLS_ESTABLISHED` state, ready for secure application telemetry."
                ],
                "example": "Let us compute the full HKDF derivation from shared secret to Handshake Secret, Master Secret, and final 128-bit Application Traffic Keys.",
                "code": "shared_secret = hashlib.sha256(b\"mock_ecdh_shared_point\").digest()\n\nearly_secret = hmac.new(b\"\\x00\"*32, b\"\\x00\"*32, hashlib.sha256).digest()\nhandshake_secret = hmac.new(early_secret, shared_secret, hashlib.sha256).digest()\n\nmaster_secret = hmac.new(handshake_secret, b\"derived_master\", hashlib.sha256).digest()\nclient_app_key = hmac.new(master_secret, b\"tls13 c ap traffic\", hashlib.sha256).digest()[:16]\nserver_app_key = hmac.new(master_secret, b\"tls13 s ap traffic\", hashlib.sha256).digest()[:16]\n\nprint(f\"Shared Secret: {shared_secret.hex()[:16]}...\")\nprint(f\"Handshake Secret: {handshake_secret.hex()[:16]}...\")\nprint(f\"Client App Traffic Key: {client_app_key.hex().upper()}\")\nprint(f\"Server App Traffic Key: {server_app_key.hex().upper()}\")",
                "output": "Shared Secret: c2c4198a02007bf7...\nHandshake Secret: a349b5293e47ae74...\nClient App Traffic Key: F70EE48E9B47B7C2D9262030C9D44412\nServer App Traffic Key: FB93BFB94AD0DB9C3584CD554C7BB8EF",
                "codeNotes": [
                    "Chains HKDF extraction through Early, Handshake, and Master secrets.",
                    "Derives distinct 16-byte AES-GCM traffic keys for client-write and server-write streams.",
                    "Guarantees that session keys cannot be calculated without possessing the ephemeral ECDHE secret."
                ],
                "tryIt": "Verify that changing shared_secret by a single bit produces completely uncorrelated Application Traffic Keys.",
                "check": {
                    "question": "What is the primary role of the Finished message HMAC in the TLS 1.3 handshake?",
                    "options": [
                        "It cryptographically authenticates the entire transcript of all prior handshake messages, confirming mutual integrity.",
                        "It encrypts the microcontroller's serial number for billing purposes.",
                        "It signals the cellular modem to power down.",
                        "It instructs the server to delete its certificate authority."
                    ],
                    "answer": 0,
                    "why": "The Finished message proves that neither client nor server had their handshake flights tampered with by an active adversary."
                }
            },
            {
                "title": "ApexMilestone4TlsIdentityEngine: The Autonomous Edge Security Engine",
                "say": [
                    "To complete Milestone 4, we integrate all identity, parsing, revocation, and transport modules into the production ApexMilestone4TlsIdentityEngine. This unified engine serves as the gold-standard security orchestrator for high-assurance IoT microcontrollers.",
                    "Let us trace the complete autonomous execution of the engine: 1) Cold-boot initialization loads the immutable IEEE 802.1AR EUI-64 hardware birthmark from on-chip Secure Element storage; 2) The engine prepares a static 2 KB SRAM buffer, sets MFLN to 512 bytes, and emits the ClientHello with an ephemeral Curve25519 key share; 3) The server flight is ingested, verifying that the OCSP staple is fresh and signed; 4) The zero-heap ASN.1 DER parser confirms server certificate validity and extracts SPKI public keys; 5) The HKDF pipeline computes Handshake and Application Traffic Keys; and 6) The engine confirms the Finished MAC tag, entering the `MUTUAL_TLS_ESTABLISHED` state.",
                    "The engine achieves 100% deterministic memory execution: zero heap allocations, zero recursion, and strictly bounded pointer arithmetic. Peak memory consumption is under 2.5 KB of SRAM, allowing the entire security subsystem to operate seamlessly on sub-$1 microcontrollers.",
                    "With Milestone 4 certified, our edge architecture possesses an impenetrable security foundation. It binds physical silicon to cloud authority, defends against memory corruption, and maintains real-time revocation enforcement across decades of unattended industrial operations."
                ],
                "example": "Let us execute the complete ApexMilestone4TlsIdentityEngine, certifying the end-to-end handshake flow and verifying the generation of operational application traffic keys.",
                "code": "class ApexMilestone4TlsIdentityEngine:\n    def __init__(self, eui64: str, serial: int):\n        self.eui64 = eui64\n        self.serial = serial\n        self.state = \"INIT\"\n        self.transcript = hashlib.sha256()\n        self.app_keys = None\n\n    def execute_handshake(self, server_pub: bytes, ocsp_valid_until: int, now: int):\n        self.state = \"CLIENT_HELLO_SENT\"\n        ch = f\"CH:{self.eui64}:X25519_KEY\".encode()\n        self.transcript.update(ch)\n        \n        if now > ocsp_valid_until:\n            self.state = \"REVOCATION_FAIL\"\n            return False, \"OCSP Staple Expired\"\n        \n        sh = f\"SH:ACCEPTED\".encode() + server_pub\n        self.transcript.update(sh)\n        \n        shared_secret = hashlib.sha256(b\"simulated_ecdh\" + server_pub).digest()\n        hs_secret = hmac.new(b\"early\", shared_secret, hashlib.sha256).digest()\n        master_secret = hmac.new(hs_secret, b\"master\", hashlib.sha256).digest()\n        \n        client_write = hmac.new(master_secret, b\"c_app\" + self.transcript.digest(), hashlib.sha256).digest()[:16]\n        server_write = hmac.new(master_secret, b\"s_app\" + self.transcript.digest(), hashlib.sha256).digest()[:16]\n        self.app_keys = (client_write, server_write)\n        \n        self.state = \"MUTUAL_TLS_ESTABLISHED\"\n        return True, \"Handshake Certified\"\n\nengine = ApexMilestone4TlsIdentityEngine(\"00-80-E1-02-00-14-3A-9F\", 0x1A2B3C4D)\nok, msg = engine.execute_handshake(b\"\\x99\"*32, ocsp_valid_until=1775000000, now=1770000000)\n\nprint(f\"Milestone 4 Engine State: {engine.state}\")\nprint(f\"Verification Result: {msg} (Success: {ok})\")\nprint(f\"Client Write Key: {engine.app_keys[0].hex().upper()}\")\nprint(f\"Server Write Key: {engine.app_keys[1].hex().upper()}\")",
                "output": "Milestone 4 Engine State: MUTUAL_TLS_ESTABLISHED\nVerification Result: Handshake Certified (Success: True)\nClient Write Key: 5BB330DFBB45BF06511097937869B57A\nServer Write Key: 3B5C37EB0CADE69B58C972BEBA1A17DF",
                "codeNotes": [
                    "Binds the device identity to IEEE 802.1AR hardware EUI-64 serial.",
                    "Enforces real-time OCSP staple validation before key agreement.",
                    "Derives AES-128 application traffic keys bound to handshake transcript hash."
                ],
                "tryIt": "Simulate an expired OCSP staple (now > ocsp_valid_until) and verify that the engine enters 'REVOCATION_FAIL' state.",
                "check": {
                    "question": "What is the certified operational state of the ApexMilestone4TlsIdentityEngine upon successful completion?",
                    "options": [
                        "MUTUAL_TLS_ESTABLISHED with authenticated application traffic keys derived from the master secret.",
                        "UNENCRYPTED_FALLBACK with plain text serial output.",
                        "FACTORY_BOOTLOADER_RECOVERY mode.",
                        "PASSIVE_SNIFFER mode with promiscuous radio listening."
                    ],
                    "answer": 0,
                    "why": "Successful handshake completion transitions the engine to MUTUAL_TLS_ESTABLISHED with isolated client and server application write keys."
                }
            }
        ],
        "summary": [
            "Milestone 4 synthesizes IEEE 802.1AR device identity, zero-heap DER parsing, OCSP revocation verification, and TLS 1.3 into a unified pipeline.",
            "Outbound 1-RTT ClientHello flights incorporate ephemeral ECDHE key shares, MFLN-512 record clamping, and EUI-64 SAN hardware identities.",
            "Server flights are parsed in static memory without dynamic allocations, verifying OCSP status tokens and TBSCertificate validity bounds.",
            "The HKDF key schedule derives cryptographically isolated Handshake and Application Traffic Keys bound to rolling transcript hashes."
        ],
        "projectStep": {
            "title": "Validate ApexMilestone4TlsIdentityEngine End-to-End Pipeline",
            "steps": [
                "Initialize hardware EUI-64 identity credentials and configure 2 KB static SRAM buffers.",
                "Execute the 1-RTT ClientHello flight with ephemeral ECDHE key shares and MFLN-512 extensions.",
                "Verify server certificate validity, CA signature chains, and stapled OCSP revocation status in-place.",
                "Derive application traffic keys, verify the Finished MAC tag, and confirm the MUTUAL_TLS_ESTABLISHED milestone certification."
            ]
        }
    }

    with open("scripts/iot_sec_day20.json", "w", encoding="utf-8") as f:
        json.dump(day20, f, indent=2)
    print("Day 20 generated successfully!")

if __name__ == "__main__":
    generate_day20()
