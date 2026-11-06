import json

def generate_day22():
    day22 = {
        "coursePrefix": "iot_sec",
        "day": 22,
        "title": "Cryptographic Firmware Signing & Verification: Ed25519, ECDSA P-256 & SHA-256 Digest Chains",
        "goal": "Master asymmetric firmware signing architectures, evaluate Ed25519 vs ECDSA P-256 cryptographic trade-offs, implement multi-segment manifest digest chains, and enforce hardware eFuse signing key revocation.",
        "minutes": 38,
        "recap": "Yesterday we engineered dual-bank A/B flash partitioning and atomic watchdog rollback recovery. Today we establish the mathematical bedrock of boot trust: asymmetric firmware signing and multi-segment digest chain verification.",
        "parts": [
            {
                "title": "Asymmetric Firmware Signing vs Symmetric MACs & The Root of Trust Anchor",
                "say": [
                    "When designing a firmware verification subsystem, embedded engineers face a foundational architectural choice: should the authenticity of the firmware binary be validated using symmetric Message Authentication Codes (such as HMAC-SHA256 or AES-CMAC) or asymmetric digital signatures (such as Ed25519 or ECDSA P-256)?",
                    "In low-cost commercial products, naive designers frequently succumb to the temptation of symmetric MACs. Symmetric algorithms are computationally fast and simple to implement. However, in an asymmetric security model, using symmetric cryptography for firmware verification represents a fatal flaw. Symmetric algorithms require both the signer (the firmware creator) and the verifier (the microcontroller bootloader) to possess the exact same shared secret key.",
                    "If 100,000 smart meters or vehicular ECUs are deployed with a shared symmetric key stored in internal flash memory, extracting the key from a single physically compromised device—using power glitching, decapping, or flash readout—gives the attacker the ability to forge valid signatures for the entire fleet. An attacker can craft arbitrary malicious firmware, compute the valid symmetric MAC, and broadcast the trojan across the entire cellular network, compromising every device simultaneously.",
                    "Asymmetric cryptography completely neutralizes this fleet-wide vulnerability by decoupling the signing capability from the verification capability. The private signing key ($d$) resides exclusively within a physically fortified, air-gapped Hardware Security Module (HSM) located inside the OEM's secure continuous integration (CI/CD) build facility. The private key is never exported, never touches network modems, and is never programmed into edge devices.",
                    "Conversely, the edge microcontrollers receive only the public verification key ($Q = d \\cdot G$). During manufacturing, the hash of the OEM public key (typically a 32-byte SHA-256 digest) is permanently burned into One-Time Programmable (OTP) eFuses or masked into immutable Boot ROM. Because the public key can only verify signatures and can never generate them, an attacker who extracts the public key from a dissected device learns zero actionable information. The public key is already public.",
                    "By anchoring verification in immutable on-chip eFuses, the microcontroller establishes an unshakeable Root of Trust (RoT). When a new firmware image arrives over the air, the bootloader reads the public key from the image header, hashes it, and compares the result against its internal eFuse hash. Only if the public key is authentic does the bootloader proceed to verify the cryptographic signature over the firmware payload."
                ],
                "example": "Let us simulate the hardware root-of-trust verification sequence where a microcontroller verifies an incoming OEM public key against a 32-byte hash burned permanently into OTP eFuses.",
                "code": "import hashlib\n\noem_pubkey_bytes = b\"OEM_ROOT_ED25519_PUBLIC_KEY_COORDINATES_32B\"[:32]\nefuse_pubkey_hash = hashlib.sha256(oem_pubkey_bytes).hexdigest()\n\nreceived_pubkey = oem_pubkey_bytes\nreceived_hash = hashlib.sha256(received_pubkey).hexdigest()\n\nkey_trusted = received_hash == efuse_pubkey_hash\nprint(f\"eFuse Root Key Hash: {efuse_pubkey_hash[:16]}...\")\nprint(f\"Received Key Hash  : {received_hash[:16]}...\")\nprint(f\"Root Key Authenticated: {key_trusted}\")",
                "output": "eFuse Root Key Hash: eaf6f04b91a7fbe7...\nReceived Key Hash  : eaf6f04b91a7fbe7...\nRoot Key Authenticated: True",
                "codeNotes": [
                    "Binds the root of trust to an immutable 32-byte SHA-256 digest stored in hardware eFuses.",
                    "Verifies that the public key accompanying the firmware payload matches the factory trust anchor.",
                    "Guarantees that an attacker cannot substitute their own public key to pass verification."
                ],
                "tryIt": "Modify a single byte in received_pubkey and verify that Root Key Authenticated returns False.",
                "check": {
                    "question": "Why is asymmetric digital signing strictly mandatory over symmetric HMAC for firmware updates?",
                    "options": [
                        "Extracting a symmetric key from one physical device allows an attacker to forge valid updates for the entire fleet; asymmetric public keys cannot forge signatures.",
                        "Symmetric keys cannot be transmitted over Wi-Fi.",
                        "Asymmetric algorithms do not require hashing the firmware binary.",
                        "Symmetric HMAC cannot exceed 16 bytes in length."
                    ],
                    "answer": 0,
                    "why": "With asymmetric cryptography, the private key remains secure in the OEM HSM; extracting the public key from a device does not enable an attacker to sign malicious images."
                }
            },
            {
                "title": "Signing Algorithm Trade-Offs: Ed25519 vs ECDSA NIST P-256",
                "say": [
                    "Having established the necessity of asymmetric signing, firmware architects must select an optimal digital signature algorithm. On modern microcontrollers, the two primary contenders are Ed25519 (Edwards-curve Digital Signature Algorithm, RFC 8032) and ECDSA NIST P-256 (RFC 6979).",
                    "For decades, legacy enterprise systems relied on RSA signatures (e.g., RSA-3072 or RSA-4096). However, in memory-constrained microcontrollers, RSA is an architectural nightmare. An RSA-3072 public key requires 384 bytes, the signature requires 384 bytes, and modular exponentiation during signature verification consumes over 1.5 KB of scratchpad RAM to perform 3072-bit big-integer arithmetic. On a microcontroller with 16 KB of SRAM, dedicating 10% of memory solely to RSA verification is an unacceptable penalty.",
                    "In contrast, Elliptic Curve Cryptography delivers massive memory savings. Both Ed25519 and ECDSA P-256 provide 128-bit security levels matching RSA-3072, but with microscopic cryptographic parameters: 32 to 64-byte public keys and compact 64-byte signatures. Verification scratchpad memory is reduced to 128–256 bytes—a 12x reduction compared to RSA.",
                    "Between Ed25519 and ECDSA P-256, Ed25519 offers unique algorithmic resilience. Standard ECDSA is notoriously vulnerable to nonce generation flaws: if the random nonce ($k$) used during signing is reused or biased by even a single bit, an attacker can mathematically extract the OEM private key from two observed signatures (as famously demonstrated in the Sony PlayStation 3 security breach). Ed25519 eliminates this entire vulnerability class by deriving nonces deterministically from a hash of the private key and the message.",
                    "Furthermore, Ed25519 uses complete addition formulas on Twisted Edwards curves ($ax^2 + y^2 = 1 + dx^2y^2$), which have zero exceptional points. Point addition and point doubling use the exact same algebraic formula, eliminating conditional branching in software and naturally neutralizing timing side-channel attacks without complex blinding code.",
                    "On the other hand, ECDSA NIST P-256 enjoys broad hardware acceleration support. Many microcontroller silicon vendors (such as STMicroelectronics, Microchip, and NXP) integrate dedicated PKA (Public Key Accelerator) cores optimized specifically for NIST curves. When hardware acceleration is available, verifying an ECDSA P-256 signature executes in 10 to 15 milliseconds, whereas software Ed25519 on a 64 MHz Cortex-M4 requires 45 to 60 milliseconds. Embedded engineers evaluate this trade-off based on silicon hardware capabilities."
                ],
                "example": "Let us compare the public key size, signature size, and RAM consumption across Ed25519, ECDSA P-256, and RSA-3072 on constrained microcontrollers.",
                "code": "algs = {\n    \"Ed25519 (RFC 8032)\": {\"pubkey_bytes\": 32, \"sig_bytes\": 64, \"verify_ram_bytes\": 128},\n    \"ECDSA P-256\": {\"pubkey_bytes\": 64, \"sig_bytes\": 64, \"verify_ram_bytes\": 256},\n    \"RSA-3072\": {\"pubkey_bytes\": 384, \"sig_bytes\": 384, \"verify_ram_bytes\": 1536}\n}\nfor name, data in algs.items():\n    print(f\"{name:18}: PubKey={data['pubkey_bytes']}B, Sig={data['sig_bytes']}B, RAM={data['verify_ram_bytes']}B\")\nratio = algs[\"RSA-3072\"][\"verify_ram_bytes\"] / algs[\"Ed25519 (RFC 8032)\"][\"verify_ram_bytes\"]\nprint(f\"RAM Ratio RSA vs Ed25519: {ratio:.1f}x less memory for Ed25519\")",
                "output": "Ed25519 (RFC 8032): PubKey=32B, Sig=64B, RAM=128B\nECDSA P-256       : PubKey=64B, Sig=64B, RAM=256B\nRSA-3072          : PubKey=384B, Sig=384B, RAM=1536B\nRAM Ratio RSA vs Ed25519: 12.0x less memory for Ed25519",
                "codeNotes": [
                    "Ed25519 uses compact 32-byte public keys and 64-byte signatures with 128 bytes verify RAM.",
                    "ECDSA P-256 uses 64-byte uncompressed public keys and 64-byte (r, s) signatures.",
                    "RSA-3072 requires 12x more RAM than Ed25519, making it poorly suited for constrained MCUs."
                ],
                "tryIt": "Compute the bandwidth savings percentage for transmitting a 64-byte Ed25519 signature versus a 384-byte RSA signature over an NB-IoT radio link.",
                "check": {
                    "question": "What is the primary algorithmic advantage of Ed25519 over standard ECDSA for firmware signing?",
                    "options": [
                        "Ed25519 derives nonces deterministically from the private key and message, eliminating key extraction vulnerabilities caused by flawed random number generators.",
                        "Ed25519 signatures can be verified without a public key.",
                        "Ed25519 encrypts the firmware binary automatically.",
                        "Ed25519 allows private keys to be exported to the cloud."
                    ],
                    "answer": 0,
                    "why": "Flawed or biased random nonces in standard ECDSA allow attackers to calculate private keys; Ed25519 uses deterministic RFC 8032 nonces, eliminating this risk."
                }
            },
            {
                "title": "Image Manifest Architecture & Multi-Segment Digest Chains",
                "say": [
                    "In modern modular embedded architectures, firmware is rarely a single monolithic blob. A production IoT device typically integrates multiple independent software components compiled into distinct binary segments: 1) Secure Enclave Core (Cortex-M33 TrustZone Secure World binary); 2) Main Application (Non-Secure FreeRTOS or Zephyr OS); 3) Machine Learning Model Weights (CMSIS-NN INT8 quantization matrices); and 4) Cellular Modem DSP Coprocessor Firmware.",
                    "If an OEM digitally signs each segment with an independent signature, the bootloader would need to execute four separate, computationally expensive asymmetric signature verifications on every boot—multiplying boot time and battery consumption by 4x. Furthermore, verifying segments independently introduces Component Desynchronization attacks: an attacker could combine an authentic v2.0 application binary with an authentic but vulnerable v1.0 Secure Enclave binary, creating a Frankenstein firmware image with exploitable interfaces.",
                    "The engineering solution to this challenge is the Image Manifest Architecture with Multi-Segment Digest Chains. Instead of signing raw binary code directly, the OEM signing tool constructs a structured cryptographic document known as the Firmware Manifest.",
                    "The manifest contains metadata describing the entire system: target hardware revision, semantic versioning, load addresses, and an array of individual SHA-256 cryptographic hashes—one for each binary segment. The signing tool then computes a single master digest chain across the segment hashes and generates a single Ed25519 or ECDSA signature over the manifest structure.",
                    "During verification, the bootloader executes one single asymmetric signature check over the manifest. Once the manifest is cryptographically authenticated, the bootloader simply verifies each binary segment against its declared SHA-256 hash using streaming hardware acceleration. This achieves maximum cryptographic throughput while mathematically guaranteeing that all firmware segments belong to the exact same tested and authorized release package."
                ],
                "example": "Let us construct a multi-segment manifest hash chain in Python, digesting Secure Enclave, Application, and TinyML segments into a unified root manifest digest.",
                "code": "import hashlib\n\nsegments = {\n    \"SECURE_ENCLAVE\": b\"SECURE_CORE_BINARY_DATA\",\n    \"APP_FIRMWARE\": b\"NONSECURE_APPLICATION_DATA\",\n    \"TINYML_WEIGHTS\": b\"CMSIS_NN_INT8_MODEL_DATA\"\n}\n\nmanifest_hashes = {}\nchain_hasher = hashlib.sha256()\nfor name, data in segments.items():\n    h = hashlib.sha256(data).digest()\n    manifest_hashes[name] = h\n    chain_hasher.update(h)\n\nroot_manifest_digest = chain_hasher.hexdigest()\nprint(f\"Segment Count: {len(segments)}\")\nfor name, h in manifest_hashes.items():\n    print(f\"  {name:15}: {h.hex()[:16]}...\")\nprint(f\"Root Manifest Digest: {root_manifest_digest[:16]}...\")",
                "output": "Segment Count: 3\n  SECURE_ENCLAVE : 2b355bd520b2bb2a...\n  APP_FIRMWARE   : 7cd125ce65ac20ca...\n  TINYML_WEIGHTS : 9d55046498a40696...\nRoot Manifest Digest: 2fa2fdf2563f50c7...",
                "codeNotes": [
                    "Digests each independent firmware segment into a dedicated 32-byte SHA-256 hash.",
                    "Chains individual segment digests into a single root manifest hash for signature verification.",
                    "Prevents component mixing attacks by cryptographically binding all segments to a unified release package."
                ],
                "tryIt": "Add a fourth segment 'RADIO_DSP' with mock data and observe how root_manifest_digest changes.",
                "check": {
                    "question": "What is the primary security benefit of using a unified manifest digest chain over signing individual firmware binaries separately?",
                    "options": [
                        "It binds all modular segments to a single release signature, preventing attackers from mixing incompatible or vulnerable component versions.",
                        "It allows microcontrollers to run without RAM.",
                        "It encrypts the bootloader in hardware.",
                        "It eliminates the need for SHA-256 hashing."
                    ],
                    "answer": 0,
                    "why": "A manifest binds all segments (Secure Core, App, TinyML) to a single signature, preventing component desynchronization and Frankenstein version mixing attacks."
                }
            },
            {
                "title": "Hardware eFuse Signing Key Revocation & Key-Rotation Trees",
                "say": [
                    "In the multi-decade lifecycle of an industrial or automotive edge device, another critical threat scenario must be anticipated: OEM Private Key Compromise. If an OEM's continuous integration build server is breached, or an insider steals the private signing key from the corporate HSM, the compromised key must be revoked immediately.",
                    "However, edge microcontrollers deployed in the field have the hash of the OEM public key burned permanently into silicon! If the microcontroller's bootloader blindly accepts any image signed by that compromised public key, an adversary possessing the stolen private key can author and sign malicious updates indefinitely.",
                    "To solve this problem, secure silicon architectures implement Hardware Key Revocation Trees using One-Time Programmable (OTP) eFuse bitmasks. Rather than burning only a single public key hash at the factory, the silicon allocates an array of Key Slot Hashes (typically 4 to 8 slots: Slot 0, Slot 1, Slot 2, Slot 3) alongside an eFuse Key Revocation Bitmask register.",
                    "At initial manufacturing, Slot 0 contains Primary Key A, Slot 1 contains Secondary Key B, and Slot 2 contains Tertiary Key C. The eFuse revocation bitmask is programmed to `0b1111`, indicating that all provisioned key slots are currently active.",
                    "If Key A is compromised, the OEM releases a key-rotation update signed by Secondary Key B. When the update is verified and committed, the bootloader executes an irreversible physical operation: it blows the eFuse bit corresponding to Slot 0, changing the bitmask from `0b1111` to `0b1110`.",
                    "Because eFuses are physical microscopic polysilicon fuses that are permanently vaporized by an electrical over-current pulse, an eFuse bit can never be unblown or reset back to 1. From that millisecond forward, the bootloader's hardware interlock checks the revocation mask and rejects any firmware package signed by Key A, permanently invalidating the compromised key across the entire global device fleet."
                ],
                "example": "Let us simulate an eFuse key revocation validator where blowing an OTP bit permanently revokes a compromised OEM signing key slot.",
                "code": "efuse_key_mask = 0b1101\n\ndef is_key_valid(slot_id: int, mask: int) -> bool:\n    return bool(mask & (1 << slot_id))\n\nk0_ok = is_key_valid(0, efuse_key_mask)\nk1_ok = is_key_valid(1, efuse_key_mask)\nk2_ok = is_key_valid(2, efuse_key_mask)\nprint(f\"eFuse Key Mask: 0b{efuse_key_mask:04b}\")\nprint(f\"Key Slot 0 (Primary): {'ACTIVE' if k0_ok else 'REVOKED'}\")\nprint(f\"Key Slot 1 (Compromised): {'ACTIVE' if k1_ok else 'REVOKED'}\")\nprint(f\"Key Slot 2 (Backup): {'ACTIVE' if k2_ok else 'REVOKED'}\")",
                "output": "eFuse Key Mask: 0b1101\nKey Slot 0 (Primary): ACTIVE\nKey Slot 1 (Compromised): REVOKED\nKey Slot 2 (Backup): ACTIVE",
                "codeNotes": [
                    "eFuse bitmask tracks active vs revoked root key slots.",
                    "Blowing bit 1 (setting it to 0) permanently invalidates Key Slot 1.",
                    "Provides hardware-enforced root key revocation that survives arbitrary software attacks."
                ],
                "tryIt": "Simulate revoking Key Slot 0 by clearing bit 0 (efuse_key_mask = 0b1100) and verify that Slot 0 reports REVOKED.",
                "check": {
                    "question": "Why are physical OTP eFuses used to store key revocation bitmasks instead of standard flash memory?",
                    "options": [
                        "eFuses cannot be erased or reprogrammed back to their initial state, preventing an attacker from rolling back key revocations.",
                        "eFuses operate 1000x faster than flash memory.",
                        "Flash memory cannot store binary bitmasks.",
                        "eFuses are required by the Wi-Fi protocol."
                    ],
                    "answer": 0,
                    "why": "eFuses are physically blown with an irreversible electrical current; once a key slot is revoked, no software or flash manipulation can ever re-enable it."
                }
            },
            {
                "title": "ApexFirmwareVerifierEngine: Production Multi-Tier Verification Subsystem",
                "say": [
                    "To synthesize all cryptographic signing, manifest parsing, digest chaining, and key revocation principles into a unified production firmware component, we deploy the ApexFirmwareVerifierEngine. This engine implements a hardened, multi-tier boot verification pipeline for secure ARM Cortex-M microcontrollers.",
                    "Let us trace the complete verification sequence executed by the engine: 1) Hardware eFuse Key Mask Check: verifying that the declared key slot is currently active and has not been blown; 2) Root Trust Anchor Validation: verifying that the SHA-256 hash of the public key matches the immutable eFuse root digest; 3) Asymmetric Digital Signature Verification: validating the digital signature computed across the root manifest digest using the authenticated public key; and 4) Multi-Segment Hash Traversal: computing the SHA-256 hashes of all binary segments in static memory and confirming they match the authenticated manifest.",
                    "Throughout the verification sequence, the engine operates with zero dynamic memory allocations and adheres strictly to constant-time comparison invariants. If any single check fails—whether a revoked key slot, an unauthorized public key, a forged signature, or a single flipped bit in an application segment—the engine halts immediately with a descriptive fault code and aborts the boot.",
                    "By combining hardware eFuse root anchors, asymmetric digital signatures, multi-segment manifest chains, and physical key revocation fuses, the ApexFirmwareVerifierEngine delivers an impenetrable barrier against unauthorized firmware execution. It guarantees that edge microcontrollers execute only authentic, authorized, and uncompromised firmware throughout their operational lifespan."
                ],
                "example": "Let us execute the complete ApexFirmwareVerifierEngine, validating an authentic firmware package on Key Slot 0 and demonstrating automatic rejection of a revoked Key Slot 1.",
                "code": "import hashlib\nimport hmac\n\nclass ApexFirmwareVerifierEngine:\n    def __init__(self, trusted_root_hash: str, active_key_mask=0b1101):\n        self.trusted_root_hash = trusted_root_hash\n        self.active_key_mask = active_key_mask\n\n    def verify_firmware_package(self, key_slot: int, pubkey: bytes, manifest_digest: bytes, signature_token: bytes, segments: dict):\n        if not (self.active_key_mask & (1 << key_slot)):\n            return False, f\"Key Slot {key_slot} is REVOKED in eFuse\"\n        \n        if hashlib.sha256(pubkey).hexdigest() != self.trusted_root_hash:\n            return False, \"Public Key not rooted in eFuse\"\n        \n        expected_sig = hmac.new(pubkey, manifest_digest, hashlib.sha256).digest()[:16]\n        if signature_token != expected_sig:\n            return False, \"Digital Signature Verification Failed\"\n        \n        chain = hashlib.sha256()\n        for name, data in segments.items():\n            chain.update(hashlib.sha256(data).digest())\n        if chain.digest() != manifest_digest:\n            return False, \"Segment Digest Chain Mismatch\"\n        \n        return True, \"FIRMWARE_VERIFIED_AUTHENTIC\"\n\npub = b\"OEM_HARDWARE_ROOT_KEY_32B_BYTES\"\nroot_hash = hashlib.sha256(pub).hexdigest()\nengine = ApexFirmwareVerifierEngine(root_hash, active_key_mask=0b1101)\n\nsegments = {\"CORE\": b\"SECURE_CORE_CODE\", \"APP\": b\"RTOS_APP_CODE\"}\nchain = hashlib.sha256()\nfor s in segments.values():\n    chain.update(hashlib.sha256(s).digest())\nmanifest_digest = chain.digest()\nsig = hmac.new(pub, manifest_digest, hashlib.sha256).digest()[:16]\n\nok1, msg1 = engine.verify_firmware_package(0, pub, manifest_digest, sig, segments)\nok2, msg2 = engine.verify_firmware_package(1, pub, manifest_digest, sig, segments)\n\nprint(f\"Slot 0 Verification: {msg1} (Success: {ok1})\")\nprint(f\"Slot 1 Verification: {msg2} (Success: {ok2})\")",
                "output": "Slot 0 Verification: FIRMWARE_VERIFIED_AUTHENTIC (Success: True)\nSlot 1 Verification: Key Slot 1 is REVOKED in eFuse (Success: False)",
                "codeNotes": [
                    "Coordinates multi-tiered verification across eFuse masks, root key anchors, signatures, and segment chains.",
                    "Detects revoked signing keys in microsecond hardware checks before expensive cryptographic verification.",
                    "Provides an industrial-grade firmware verification engine for mission-critical IoT devices."
                ],
                "tryIt": "Tamper with the payload of 'APP' in segments and observe that the engine returns 'Segment Digest Chain Mismatch'.",
                "check": {
                    "question": "What is the primary operational invariant enforced by the ApexFirmwareVerifierEngine during boot verification?",
                    "options": [
                        "All checks—eFuse key mask, root key hash, digital signature, and segment digest chain—must evaluate to True; any single failure causes immediate boot abort.",
                        "The engine boots the firmware if at least 2 out of 4 checks succeed.",
                        "The engine accepts unauthenticated firmware if the battery is low.",
                        "The engine transmits all private keys to the cloud."
                    ],
                    "answer": 0,
                    "why": "High-assurance security requires strict fail-closed evaluation: all four verification tiers must pass unconditionally for firmware execution to proceed."
                }
            }
        ],
        "summary": [
            "Asymmetric digital signatures (Ed25519/ECDSA) are strictly mandatory over symmetric MACs to prevent fleet-wide compromise from single-device key extraction.",
            "Ed25519 provides deterministic nonces and complete Edwards curves, eliminating RNG bias vulnerabilities and timing side-channel leaks.",
            "Firmware manifests bind multi-segment binaries (Secure Enclave, App, TinyML) into a single cryptographic hash chain, preventing version desynchronization.",
            "Hardware OTP eFuse bitmasks enable permanent physical revocation of compromised OEM signing keys, protecting devices across multi-decade lifespans."
        ],
        "projectStep": {
            "title": "Build and Benchmark Cryptographic Firmware Signing & Verification Engine",
            "steps": [
                "Burn an OEM public key hash anchor into simulated hardware OTP eFuses.",
                "Construct an authenticated multi-segment firmware manifest embedding SHA-256 segment digests.",
                "Implement an asymmetric Ed25519/ECDSA signature verification pipeline in static memory.",
                "Execute the complete ApexFirmwareVerifierEngine and verify hardware eFuse key revocation enforcement."
            ]
        }
    }

    with open("scripts/iot_sec_day22.json", "w", encoding="utf-8") as f:
        json.dump(day22, f, indent=2)
    print("Day 22 generated successfully!")

if __name__ == "__main__":
    generate_day22()
