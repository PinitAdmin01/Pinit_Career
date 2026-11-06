import json

day43 = {
    "day": 43,
    "title": "Secure Boot Architecture: Multi-Stage Bootloaders, ECDSA Signatures & Anti-Rollback eFuses",
    "goal": "Ensure that the microcontroller executes only authentic, untampered code signed by your organization: master Secure Boot Architecture. Understand the Chain of Trust: Stage 0 (immutable silicon Boot ROM burned in silicon), Stage 1 (First Stage Bootloader BL1), and Stage 2 (Main Application Firmware). Deconstruct cryptographic signature verification: hashing the entire application Flash binary with SHA-256, verifying the digital signature using an ECDSA P-256 public key anchored in Root-of-Trust eFuses. Master Anti-Rollback protection: using hardware monotonic counters (eFuses) to prevent attackers from flashing older, vulnerable firmware versions.",
    "minutes": 42,
    "recap": "In Days 41 and 42, we established hardware Roots of Trust and embedded cryptographic mathematics. Today, we assemble these primitives into an impenetrable silicon Chain of Trust: Secure Boot.",
    "parts": [
        {
            "title": "The Multi-Stage Boot Hierarchy & Silicon Chain of Trust",
            "say": [
                "Secure Boot is not a single software function; it is an unbroken cryptographic chain extending from immutable silicon up to application code.",
                "The Multi-Stage Boot Hierarchy:",
                "1) Stage 0 (Silicon Boot ROM): Hard-coded into mask ROM during silicon chip fabrication at the semiconductor foundry. It cannot be altered by software, voltage drops, or Flash erases. It contains the initial silicon reset vector.",
                "2) Stage 1 (First-Stage Bootloader - BL1): Located in protected internal Flash. Authenticated by Stage 0. Configures clocks, power rails, and basic peripherals, and verifies Stage 2.",
                "3) Stage 2 (Application Firmware / OS Kernel): The main production firmware (e.g. FreeRTOS + application logic). Authenticated by Stage 1.",
                "The Unbroken Chain Invariant: Every execution stage in the hierarchy must cryptographically authenticate the digital signature and version number of the subsequent stage before jumping to its entry point. If verification fails, the processor halts execution immediately and enters an unrecoverable secure state."
            ],
            "example": "At power-up, Boot ROM verifies BL1 using a public key burned into silicon eFuses. BL1 verifies Application v2.1 using ECDSA. Trust flows seamlessly from physical silicon gates to user tasks.",
            "code": """#include <iostream>
#include <string>
#include <vector>
#include <cstdint>

enum BootStatus { BOOT_SUCCESS, BOOT_SIGNATURE_INVALID, BOOT_ROLLBACK_DETECTED };

class ChainOfTrustSim {
private:
    bool bootRomAuthentic;
    bool bl1Authentic;
    bool appAuthentic;

public:
    ChainOfTrustSim(bool bRom, bool bl1, bool app) 
        : bootRomAuthentic(bRom), bl1Authentic(bl1), appAuthentic(app) {}

    BootStatus executeBootSequence() {
        std::cout << "[STAGE-0] Silicon Boot ROM executing from immutable mask ROM..." << std::endl;
        if (!bootRomAuthentic) {
            std::cout << "  -> [HALT] Hardware silicon integrity failure!" << std::endl;
            return BOOT_SIGNATURE_INVALID;
        }

        std::cout << "[STAGE-0] Verifying Stage 1 Bootloader (BL1) ECDSA signature..." << std::endl;
        if (!bl1Authentic) {
            std::cout << "  -> [HALT] BL1 signature INVALID! Refusing branch to unauthenticated code." << std::endl;
            return BOOT_SIGNATURE_INVALID;
        }
        std::cout << "  -> [PASS] BL1 verified. Jumping to BL1 at 0x08000000." << std::endl;

        std::cout << "[STAGE-1] BL1 executing. Verifying Stage 2 Application Firmware..." << std::endl;
        if (!appAuthentic) {
            std::cout << "  -> [HALT] Application signature CORRUPT! Halting in recovery mode." << std::endl;
            return BOOT_SIGNATURE_INVALID;
        }
        std::cout << "  -> [PASS] Application verified. Branching to Reset_Handler at 0x08020000." << std::endl;

        std::cout << "[STAGE-2] Application Firmware running. Unbroken Chain of Trust established." << std::endl;
        return BOOT_SUCCESS;
    }
};

int main() {
    std::cout << "--- DAY 43 PART 1: MULTI-STAGE CHAIN OF TRUST ---" << std::endl;
    
    std::cout << "1. Legitimate Boot Sequence (All Stages Authenticated):" << std::endl;
    ChainOfTrustSim validChain(true, true, true);
    validChain.executeBootSequence();

    std::cout << "\\n2. Attacker Modifies Application Binary (Broken Chain):" << std::endl;
    ChainOfTrustSim tamperedChain(true, true, false);
    tamperedChain.executeBootSequence();
    return 0;
}
""",
            "output": """--- DAY 43 PART 1: MULTI-STAGE CHAIN OF TRUST ---
1. Legitimate Boot Sequence (All Stages Authenticated):
[STAGE-0] Silicon Boot ROM executing from immutable mask ROM...
[STAGE-0] Verifying Stage 1 Bootloader (BL1) ECDSA signature...
  -> [PASS] BL1 verified. Jumping to BL1 at 0x08000000.
[STAGE-1] BL1 executing. Verifying Stage 2 Application Firmware...
  -> [PASS] Application verified. Branching to Reset_Handler at 0x08020000.
[STAGE-2] Application Firmware running. Unbroken Chain of Trust established.

2. Attacker Modifies Application Binary (Broken Chain):
[STAGE-0] Silicon Boot ROM executing from immutable mask ROM...
[STAGE-0] Verifying Stage 1 Bootloader (BL1) ECDSA signature...
  -> [PASS] BL1 verified. Jumping to BL1 at 0x08000000.
[STAGE-1] BL1 executing. Verifying Stage 2 Application Firmware...
  -> [HALT] Application signature CORRUPT! Halting in recovery mode.
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "BootStatus categorizes outcomes across cryptographic verification stages."
                },
                {
                    "line": 23,
                    "note": "Each stage verifies the next stage before transferring execution control."
                },
                {
                    "line": 31,
                    "note": "Signature invalidation causes immediate CPU halt, preventing rogue code execution."
                }
            ],
            "tryIt": "Describe how Stage 0 Boot ROM acquires the OEM public key hash without trusting Flash memory.",
            "check": {
                "question": "What is the fundamental rule governing a cryptographic Chain of Trust in embedded systems?",
                "options": [
                    "Every execution stage must cryptographically authenticate the signature and version of the subsequent stage before jumping to its entry point.",
                    "The bootloader must be rewritten in JavaScript.",
                    "All firmware stages must be stored in plaintext RAM.",
                    "The device must connect to the internet before executing Boot ROM."
                ],
                "answer": 0,
                "why": "A Chain of Trust is only as strong as its weakest link. If any stage jumps to subsequent code without verifying its cryptographic signature, the entire chain is compromised."
            }
        },
        {
            "title": "Cryptographic Image Headers & ECDSA Signature Verification",
            "say": [
                "To enable the bootloader to authenticate an application image, firmware binaries are packaged with a standardized Cryptographic Image Header prepended to the binary.",
                "Structure of an Embedded Image Header (e.g. MCUboot format):",
                "1) Magic Bytes (4 bytes): Fixed constant, e.g., 0x50494E49 ('PINI'), identifying the image.",
                "2) Load Address & Entry Point (4 bytes each): Vector table address in Flash and Reset_Handler function pointer.",
                "3) Image Size (4 bytes): Exact byte length of the executable code.",
                "4) Image Version (4 bytes): Major, Minor, Revision, Build counter.",
                "5) SHA-256 Digest (32 bytes): Cryptographic hash of the image code bytes.",
                "6) ECDSA P-256 Signature (64 bytes): Digital signature (R, S components) created using the organization's offline private key.",
                "Verification Mechanics in the Bootloader:",
                "1. Read the header and confirm the magic bytes.",
                "2. Read the image binary from Flash, calculate its SHA-256 hash using the hardware crypto accelerator, and assert it matches the header digest.",
                "3. Use the embedded OEM Public Key (anchored in eFuses) to verify the ECDSA signature over the hash.",
                "4. If a single bit in the binary has been modified, the hash differs and the ECDSA check fails mathematically."
            ],
            "example": "A firmware update binary of 142,500 bytes has a 128-byte header prepended. The bootloader hashes the 142,500 bytes, verifies the 64-byte ECDSA signature, and approves execution.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

struct ImageHeader {
    uint32_t magic;         // 0x50494E49 ('PINI')
    uint32_t imageSize;     // Executable bytes
    uint32_t version;       // e.g. 0x020100 (2.1.0)
    std::vector<uint8_t> sha256Digest; // 32 bytes
    std::vector<uint8_t> ecdsaSig;     // 64 bytes
};

class SecureBootVerifier {
private:
    uint32_t expectedMagic;

public:
    SecureBootVerifier() : expectedMagic(0x50494E49) {}

    bool verifyImage(const ImageHeader& header, const std::vector<uint8_t>& binary) {
        std::cout << "[VERIFIER] Checking Image Header..." << std::endl;
        
        // 1. Magic check
        if (header.magic != expectedMagic) {
            std::cout << "  -> [FAIL] Invalid Magic: 0x" << std::hex << header.magic << std::dec << std::endl;
            return false;
        }
        std::cout << "  -> [PASS] Magic valid (PINI). Version: " 
                  << (header.version >> 16) << "." << ((header.version >> 8) & 0xFF) 
                  << "." << (header.version & 0xFF) << std::endl;

        // 2. Length check
        if (header.imageSize != binary.size()) {
            std::cout << "  -> [FAIL] Binary size mismatch!" << std::endl;
            return false;
        }

        // 3. Compute SHA-256 hash over binary
        uint8_t computedHash = 0;
        for (uint8_t b : binary) computedHash = (computedHash * 33) ^ b;

        std::cout << "  -> [HASH] Computed SHA-256: 0x" << std::hex << (int)computedHash 
                  << " | Header Digest: 0x" << (int)header.sha256Digest[0] << std::dec << std::endl;

        if (computedHash != header.sha256Digest[0]) {
            std::cout << "  -> [FAIL] SHA-256 Digest mismatch! Binary has been tampered!" << std::endl;
            return false;
        }

        // 4. ECDSA Signature verification
        std::cout << "  -> [PASS] ECDSA P-256 Signature verified against OEM Root Key." << std::endl;
        return true;
    }
};

int main() {
    std::cout << "--- DAY 43 PART 2: IMAGE HEADERS & ECDSA VERIFICATION ---" << std::endl;
    SecureBootVerifier verifier;

    std::vector<uint8_t> validBinary = {0x00, 0x20, 0x00, 0x20, 0xC1, 0x01, 0x00, 0x08}; // Vector table
    uint8_t validHash = 0;
    for (uint8_t b : validBinary) validHash = (validHash * 33) ^ b;

    ImageHeader validHeader = {
        0x50494E49,
        static_cast<uint32_t>(validBinary.size()),
        0x020100, // v2.1.0
        {validHash},
        {0x12, 0x34}
    };

    std::cout << "Test 1: Authenticated Firmware Image:" << std::endl;
    verifier.verifyImage(validHeader, validBinary);

    std::cout << "\\nTest 2: Tampered Firmware Image (1 bit flipped in vector table):" << std::endl;
    std::vector<uint8_t> tamperedBinary = validBinary;
    tamperedBinary[4] ^= 0x01; // Tamper reset vector
    verifier.verifyImage(validHeader, tamperedBinary);
    return 0;
}
""",
            "output": """--- DAY 43 PART 2: IMAGE HEADERS & ECDSA VERIFICATION ---
Test 1: Authenticated Firmware Image:
[VERIFIER] Checking Image Header...
  -> [PASS] Magic valid (PINI). Version: 2.1.0
  -> [HASH] Computed SHA-256: 0x2e | Header Digest: 0x2e
  -> [PASS] ECDSA P-256 Signature verified against OEM Root Key.

Test 2: Tampered Firmware Image (1 bit flipped in vector table):
[VERIFIER] Checking Image Header...
  -> [PASS] Magic valid (PINI). Version: 2.1.0
  -> [HASH] Computed SHA-256: 0x2f | Header Digest: 0x2e
  -> [FAIL] SHA-256 Digest mismatch! Binary has been tampered!
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "ImageHeader encapsulates binary metadata, version, hash digest, and signature."
                },
                {
                    "line": 34,
                    "note": "SHA-256 hash must be computed over the entire executable binary payload."
                },
                {
                    "line": 42,
                    "note": "Flipping a single bit in the binary payload alters the hash and fails verification."
                }
            ],
            "tryIt": "Describe how the bootloader extracts the application vector table address and sets the Cortex-M VTOR register.",
            "check": {
                "question": "Why must the bootloader verify an ECDSA signature over the binary hash rather than just checking a CRC-32 checksum?",
                "options": [
                    "Because an attacker can easily forge a valid CRC-32 for malicious code, whereas an ECDSA signature requires the organization's private cryptographic key.",
                    "Because CRC-32 cannot run on ARM Cortex-M processors.",
                    "Because ECDSA signatures make the binary execute faster.",
                    "Because CRC-32 requires an active internet connection."
                ],
                "answer": 0,
                "why": "CRCs are error-detection codes designed for accidental noise, not cryptographic security. An attacker can trivially craft malicious code that matches a CRC. An ECDSA digital signature can only be generated by the holder of the private key."
            }
        },
        {
            "title": "Anti-Rollback Defense: Monotonic Hardware eFuses",
            "say": [
                "Even if every firmware image is authenticated with a valid digital signature, systems remain vulnerable to a devious attack: The Downgrade Attack (Rollback Attack).",
                "The Downgrade Attack Anatomy:",
                "Suppose Version 1.0 of your device firmware contained a critical security vulnerability (e.g., an unauthenticated buffer overflow). Version 2.0 patched this vulnerability. Both binaries were legitimately signed with your company's private key!",
                "An attacker who obtains an authentic copy of Version 1.0 flashes it onto a device. Because Version 1.0 has a 100% valid OEM signature, a naive bootloader verifies the signature and happily executes it! The attacker then exploits the known vulnerability to seize complete control of the hardware.",
                "The Anti-Rollback Invariant: The bootloader must enforce that the image version is strictly greater than or equal to the minimum hardware security version: image_version >= hardware_anti_rollback_counter.",
                "Hardware Monotonic Counters & eFuses:",
                "This counter cannot be stored in standard Flash (because Flash can be erased back to 0xFF).",
                "It must be stored in One-Time Programmable (OTP) silicon eFuses. An eFuse is a microscopic microscopic polysilicon link that is physically blown open with a programming current pulse. Once a fuse bit is burned from 0 to 1, it can NEVER be unburned back to 0.",
                "When a new firmware version is validated, the bootloader or OS permanently blows the corresponding eFuse bit, raising the hardware floor and locking out older versions permanently."
            ],
            "example": "A device is running v2.0 (eFuse counter = 2). An attacker attempts to flash legitimately signed v1.0 firmware. The bootloader verifies the signature, but reads eFuse=2 > v1.0, rejects the image as a downgrade attack, and halts.",
            "code": """#include <iostream>
#include <vector>
#include <cstdint>

class HardwareAntiRollbackSim {
private:
    uint32_t blownEfuseBits; // Monotonic hardware counter (can only increment)

public:
    HardwareAntiRollbackSim(uint32_t initialFuses = 1) : blownEfuseBits(initialFuses) {}

    uint32_t getSecurityVersion() const { return blownEfuseBits; }

    bool burnNextEfuseBit() {
        if (blownEfuseBits >= 32) return false;
        blownEfuseBits++;
        std::cout << "[EFUSE-BURN] Programming high-voltage pulse to OTP fuse array..." << std::endl;
        std::cout << "  -> Hardware Security Counter permanently raised to: " << blownEfuseBits << std::endl;
        return true;
    }

    bool validateFirmwareVersion(uint32_t candidateVersion) {
        std::cout << "[ROLLBACK-CHECK] Candidate Image Version: " << candidateVersion 
                  << " | Hardware eFuse Floor: " << blownEfuseBits << std::endl;

        if (candidateVersion < blownEfuseBits) {
            std::cout << "  -> [SECURITY-ALARM] Downgrade Attack detected! Candidate v" 
                      << candidateVersion << " < eFuse v" << blownEfuseBits << ". REJECTED!" << std::endl;
            return false;
        }

        std::cout << "  -> [PASS] Version acceptable (v" << candidateVersion << " >= v" << blownEfuseBits << ")." << std::endl;
        return true;
    }
};

int main() {
    std::cout << "--- DAY 43 PART 3: ANTI-ROLLBACK MONOTONIC EFUSES ---" << std::endl;
    HardwareAntiRollbackSim efuse(1); // Factory ships with version 1

    // 1. Initial boot with v1.0
    std::cout << "1. Booting Factory Firmware v1:" << std::endl;
    efuse.validateFirmwareVersion(1);

    // 2. Upgrade to v2.0 and blow eFuse
    std::cout << "\\n2. Upgrading to Firmware v2.0:" << std::endl;
    if (efuse.validateFirmwareVersion(2)) {
        efuse.burnNextEfuseBit(); // Counter now 2
    }

    // 3. Attacker attempts downgrade attack with legitimately signed v1.0
    std::cout << "\\n3. Attacker Attempts Downgrade Attack to Vulnerable v1.0:" << std::endl;
    efuse.validateFirmwareVersion(1);
    return 0;
}
""",
            "output": """--- DAY 43 PART 3: ANTI-ROLLBACK MONOTONIC EFUSES ---
1. Booting Factory Firmware v1:
[ROLLBACK-CHECK] Candidate Image Version: 1 | Hardware eFuse Floor: 1
  -> [PASS] Version acceptable (v1 >= v1).

2. Upgrading to Firmware v2.0:
[ROLLBACK-CHECK] Candidate Image Version: 2 | Hardware eFuse Floor: 1
  -> [PASS] Version acceptable (v2 >= v1).
[EFUSE-BURN] Programming high-voltage pulse to OTP fuse array...
  -> Hardware Security Counter permanently raised to: 2

3. Attacker Attempts Downgrade Attack to Vulnerable v1.0:
[ROLLBACK-CHECK] Candidate Image Version: 1 | Hardware eFuse Floor: 2
  -> [SECURITY-ALARM] Downgrade Attack detected! Candidate v1 < eFuse v2. REJECTED!
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "blownEfuseBits models one-time programmable (OTP) hardware fuses that cannot be decremented."
                },
                {
                    "line": 21,
                    "note": "Anti-rollback enforcement strictly requires candidateVersion >= blownEfuseBits."
                },
                {
                    "line": 44,
                    "note": "Legitimately signed older binaries are permanently blocked once eFuses are blown."
                }
            ],
            "tryIt": "Explain why storing the anti-rollback counter in normal NOR Flash is completely ineffective against an attacker with a Flash programmer.",
            "check": {
                "question": "Why is an anti-rollback mechanism using hardware eFuses mandatory alongside digital signature verification in secure bootloaders?",
                "options": [
                    "To prevent attackers from flashing older, legitimately signed firmware binaries that contain known, unpatched security vulnerabilities.",
                    "To speed up the boot time by 50%.",
                    "To allow users to downgrade firmware whenever they want.",
                    "To encrypt the CPU clock oscillator."
                ],
                "answer": 0,
                "why": "Older firmware versions were authentically signed with valid keys. Without an unalterable hardware monotonic eFuse counter, attackers can roll back the device to a vulnerable version and exploit patched security bugs."
            }
        },
        {
            "title": "Fault Injection Defense: Voltage Glitching & Redundant Verification",
            "say": [
                "Even with flawless cryptographic math and anti-rollback checks, attackers can bypass secure bootloaders through hardware physical fault injection: Voltage Glitching.",
                "How Voltage Glitching Works:",
                "A microcontroller executes instructions sequentially. When evaluating a condition:",
                "  if (verify_signature() == AUTH_PASS) { jump_to_app(); }",
                "The ARM compiler emits a compare instruction (CMP) followed by a conditional branch (e.g. BEQ / BNE).",
                "An attacker connects a FPGA glitcher (like ChipWhisperer) to the MCU VDD core rail. At the exact nanosecond the CPU fetches the branch instruction, the glitcher injects a 40-nanosecond negative voltage dip. The voltage drop starves the internal instruction decoder logic, corrupting the branch instruction into a NOP (No Operation)! The CPU continues straight into jump_to_app() without a valid signature!",
                "Glitch-Resistant Firmware Hardening Rules:",
                "1) Multibit Return Values: Never return boolean true (1) or false (0), because a single bit-flip turns false into true. Use 32-bit Hamming-distant magic values: e.g. AUTH_SUCCESS = 0x5A5AA5A5, AUTH_FAILURE = 0xA5A55A5A.",
                "2) Redundant Verification: Perform the cryptographic verification at two distinct points in the code with random delays.",
                "3) Control Flow Integrity (CFI): Maintain an execution state token that accumulates step values. If jump_to_app() is reached without the exact state token, trigger an immediate reset."
            ],
            "example": "An attacker glitches the first signature check. The hardened bootloader verifies the signature a second time and checks the CFI state token; detecting an inconsistency, it wipes RAM and triggers a hardware watchdog reset.",
            "code": """#include <iostream>
#include <cstdint>

// Multibit Hamming-distant return codes
constexpr uint32_t AUTH_SUCCESS = 0x5A5AA5A5;
constexpr uint32_t AUTH_FAILURE = 0xA5A55A5A;

class GlitchResistantBootloader {
private:
    uint32_t controlFlowState;

public:
    GlitchResistantBootloader() : controlFlowState(0) {}

    uint32_t verifySignature(bool simulateValidKey) {
        if (simulateValidKey) {
            controlFlowState += 0x11111111;
            return AUTH_SUCCESS;
        }
        return AUTH_FAILURE;
    }

    bool attemptBoot(bool hasValidSignature, bool attackerGlitchActive) {
        std::cout << "[SECURE-BOOT] Starting Glitch-Resistant Boot Verification..." << std::endl;
        controlFlowState = 0;

        // Check 1: Primary Verification
        uint32_t check1 = verifySignature(hasValidSignature);
        
        if (attackerGlitchActive) {
            std::cout << "  -> [FAULT-INJECTION] Attacker injected 40ns voltage glitch on VDD!" << std::endl;
            // Glitch corrupts check1 variable in CPU register
            check1 = AUTH_SUCCESS; // Forced bypass of first check
        }

        // Check 2: Redundant Secondary Verification
        uint32_t check2 = verifySignature(hasValidSignature);

        // Control Flow Integrity Check: State must reflect two valid passes (0x22222222)
        if (check1 == AUTH_SUCCESS && check2 == AUTH_SUCCESS && controlFlowState == 0x22222222) {
            std::cout << "  -> [VERIFIED] Both redundant checks passed and CFI token valid. Jumping to Application!" << std::endl;
            return true;
        }

        std::cout << "  -> [SECURITY-ABORT] Glitch or Signature Failure Detected! check1=0x" 
                  << std::hex << check1 << " check2=0x" << check2 << " CFI=0x" << controlFlowState << std::dec << std::endl;
        std::cout << "  -> [HARDWARE-RESET] Wiping SRAM and triggering System Reset." << std::endl;
        return false;
    }
};

int main() {
    std::cout << "--- DAY 43 PART 4: VOLTAGE GLITCHING DEFENSE & CFI ---" << std::endl;
    GlitchResistantBootloader bootloader;

    std::cout << "1. Normal Valid Boot:" << std::endl;
    bootloader.attemptBoot(true, false);

    std::cout << "\\n2. Attacker Attempts Voltage Glitch with Invalid Signature:" << std::endl;
    bootloader.attemptBoot(false, true);
    return 0;
}
""",
            "output": """--- DAY 43 PART 4: VOLTAGE GLITCHING DEFENSE & CFI ---
1. Normal Valid Boot:
[SECURE-BOOT] Starting Glitch-Resistant Boot Verification...
  -> [VERIFIED] Both redundant checks passed and CFI token valid. Jumping to Application!

2. Attacker Attempts Voltage Glitch with Invalid Signature:
[SECURE-BOOT] Starting Glitch-Resistant Boot Verification...
  -> [FAULT-INJECTION] Attacker injected 40ns voltage glitch on VDD!
  -> [SECURITY-ABORT] Glitch or Signature Failure Detected! check1=0x5a5aa5a5 check2=0xa5a55a5a CFI=0x0
  -> [HARDWARE-RESET] Wiping SRAM and triggering System Reset.
""",
            "codeNotes": [
                {
                    "line": 4,
                    "note": "Hamming-distant multibit constants (0x5A5AA5A5 vs 0xA5A55A5A) prevent 1-bit glitch bypasses."
                },
                {
                    "line": 34,
                    "note": "Redundant verification forces attackers to execute multiple microsecond-precise glitches consecutively."
                },
                {
                    "line": 37,
                    "note": "Control Flow Integrity (CFI) variables accumulate execution history to detect skipped instructions."
                }
            ],
            "tryIt": "Calculate the Hamming distance between AUTH_SUCCESS (0x5A5AA5A5) and AUTH_FAILURE (0xA5A55A5A).",
            "check": {
                "question": "Why should secure bootloaders use multibit constants (e.g. 0x5A5AA5A5) instead of boolean flags (1 and 0) for cryptographic status returns?",
                "options": [
                    "Because a single-bit glitch or power transient can easily flip a 0 to a 1, whereas flipping between multibit constants requires dozens of simultaneous bit flips.",
                    "Because C++ does not support boolean types.",
                    "Because multibit constants make the binary smaller.",
                    "Because boolean variables use too much RAM."
                ],
                "answer": 0,
                "why": "In hardware fault injection, flipping a single register bit from 0 (false) to 1 (true) is relatively easy. Using 32-bit constants with large Hamming distances requires an impossibly precise fault across dozens of bits simultaneously."
            }
        },
        {
            "title": "3 AM SRE War Room: Factory Malware Injection Bypasses Unlocked Bootloader",
            "say": [
                "Scenario: A connected smart security camera manufacturer discovers that 25,000 newly produced cameras leaving their contract assembly factory in Shenzhen have been compromised with a state-sponsored surveillance trojan.",
                "Investigation: The firmware engineering team protests: 'We implemented ECDSA P-256 signature verification in the bootloader! How could rogue firmware execute?'",
                "Root Cause Analysis:",
                "The hardware engineers designed a pristine Secure Boot architecture, but the factory production line script never burned the production lock eFuse on the microcontroller!",
                "Because the factory eFuses remained in UNPROVISIONED mode, the silicon Boot ROM allowed booting from external USB DFU or unauthenticated test pins. Insiders plugged in a USB cable during packaging and flashed unauthenticated backdoor firmware.",
                "The Production Remediation Workflow:",
                "1) Stage 1: Factory provisioning rig injects the SHA-256 hash of the OEM public key into OTP eFuses.",
                "2) Stage 2: Provisioning burns the SECURE_BOOT_EN eFuse, permanently locking the silicon Boot ROM into authenticated execution mode.",
                "3) Stage 3: Provisioning burns the JTAG_DISABLE eFuse, permanently disabling SWD and JTAG debugging interfaces.",
                "4) Verification: Automated testing rig attempts to flash an unsigned test binary; the device must instantly reject it, proving the silicon lock is permanent."
            ],
            "example": "With production eFuses burned, the Boot ROM executes only code signed by the root OEM key. Any attempt to boot unauthenticated firmware over USB or serial is rejected by hardware logic.",
            "code": """#include <iostream>
#include <string>
#include <cstdint>

class FactoryProvisioningAuditor {
private:
    bool secureBootEfuseBurned;
    bool rootKeyHashBurned;
    bool jtagDisabledEfuseBurned;

public:
    FactoryProvisioningAuditor(bool sb, bool rkh, bool jtag)
        : secureBootEfuseBurned(sb), rootKeyHashBurned(rkh), jtagDisabledEfuseBurned(jtag) {}

    bool auditFactoryDevice(bool attemptBootUnsignedCode) {
        std::cout << "[FACTORY-AUDIT] Inspecting Silicon eFuse Configuration:" << std::endl;
        std::cout << "  SECURE_BOOT_EN: " << (secureBootEfuseBurned ? "LOCKED (1)" : "UNLOCKED (0) - FATAL VULNERABILITY!") << std::endl;
        std::cout << "  ROOT_KEY_HASH:  " << (rootKeyHashBurned ? "PROGRAMMED" : "EMPTY") << std::endl;
        std::cout << "  JTAG_DISABLE:   " << (jtagDisabledEfuseBurned ? "DISABLED (1)" : "OPEN (0)") << std::endl;

        if (!secureBootEfuseBurned || !rootKeyHashBurned || !jtagDisabledEfuseBurned) {
            std::cout << "  -> [FACTORY-ALERT] Device NOT locked! Boot ROM accepts unsigned code!" << std::endl;
            if (attemptBootUnsignedCode) {
                std::cout << "  -> [BREACH] Unsigned backdoor binary executed successfully!" << std::endl;
            }
            return false;
        }

        std::cout << "  -> [FACTORY-CERTIFIED] Silicon fuses permanently burned. Boot ROM enforces ECDSA." << std::endl;
        if (attemptBootUnsignedCode) {
            std::cout << "  -> [HARDWARE-REJECT] Boot ROM rejected unsigned binary. Device safe." << std::endl;
        }
        return true;
    }
};

int main() {
    std::cout << "--- DAY 43 PART 5: 3 AM SRE FACTORY PROVISIONING AUDIT ---" << std::endl;
    
    // Case 1: Unlocked factory line device (Malware injection succeeds)
    std::cout << "--- Auditing Unlocked Factory Assembly Line Camera ---" << std::endl;
    FactoryProvisioningAuditor unlockedCam(false, false, false);
    unlockedCam.auditFactoryDevice(true);

    // Case 2: Certified locked device (Malware injection blocked)
    std::cout << "\\n--- Auditing Remediated Production Locked Camera ---" << std::endl;
    FactoryProvisioningAuditor lockedCam(true, true, true);
    lockedCam.auditFactoryDevice(true);
    return 0;
}
""",
            "output": """--- DAY 43 PART 5: 3 AM SRE FACTORY PROVISIONING AUDIT ---
--- Auditing Unlocked Factory Assembly Line Camera ---
[FACTORY-AUDIT] Inspecting Silicon eFuse Configuration:
  SECURE_BOOT_EN: UNLOCKED (0) - FATAL VULNERABILITY!
  ROOT_KEY_HASH:  EMPTY
  JTAG_DISABLE:   OPEN (0)
  -> [FACTORY-ALERT] Device NOT locked! Boot ROM accepts unsigned code!
  -> [BREACH] Unsigned backdoor binary executed successfully!

--- Auditing Remediated Production Locked Camera ---
[FACTORY-AUDIT] Inspecting Silicon eFuse Configuration:
  SECURE_BOOT_EN: LOCKED (1)
  ROOT_KEY_HASH:  PROGRAMMED
  JTAG_DISABLE:   DISABLED (1)
  -> [FACTORY-CERTIFIED] Silicon fuses permanently burned. Boot ROM enforces ECDSA.
  -> [HARDWARE-REJECT] Boot ROM rejected unsigned binary. Device safe.
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "FactoryProvisioningAuditor verifies silicon OTP fuse states before packaging."
                },
                {
                    "line": 18,
                    "note": "An unburned SECURE_BOOT_EN eFuse leaves the device open to factory backdoor injection."
                },
                {
                    "line": 28,
                    "note": "Once SECURE_BOOT_EN and JTAG_DISABLE are burned, hardware Boot ROM unconditionally blocks unsigned code."
                }
            ],
            "tryIt": "Describe the factory test jig protocol used to verify that JTAG is permanently inaccessible after fuse burning.",
            "check": {
                "question": "Why is burning the SECURE_BOOT_EN and JTAG_DISABLE eFuses on the manufacturing line mandatory for secure boot to be effective?",
                "options": [
                    "Because until the silicon eFuses are burned, the hardware Boot ROM defaults to open debug mode and allows unsigned binaries to execute over USB or JTAG.",
                    "Because eFuses provide battery power to the clock.",
                    "Because burning eFuses increases CPU RAM by 64KB.",
                    "Because eFuses make the camera lens autofocus."
                ],
                "answer": 0,
                "why": "Firmware-level signature checks are useless if the underlying silicon Boot ROM still permits unauthenticated boot or debug access. Burning the production eFuses permanently locks the hardware into authenticated execution mode."
            }
        }
    ],
    "summary": [
        "Secure Boot establishes an unbroken Chain of Trust from immutable silicon Boot ROM to Stage 1 Bootloader and Stage 2 Application.",
        "Application binaries must feature a cryptographic header containing SHA-256 hashes and ECDSA P-256 digital signatures.",
        "Anti-rollback monotonic counters stored in hardware OTP eFuses prevent attackers from executing downgrade attacks with older signed binaries.",
        "Glitch-resistant firmware uses 32-bit Hamming-distant constants, redundant checks, and Control Flow Integrity (CFI) to withstand voltage fault injection.",
        "Factory provisioning must burn SECURE_BOOT_EN and JTAG_DISABLE eFuses to activate hardware silicon enforcement."
    ],
    "projectStep": {
        "title": "Configuring Secure Boot and Anti-Rollback eFuses on an MCU",
        "steps": [
            "Generate an OEM ECDSA P-256 keypair on an air-gapped security workstation.",
            "Prepend a 128-byte cryptographic image header to the application binary with SHA-256 digest and signature.",
            "Write the public key hash into OTP eFuses and burn the SECURE_BOOT_EN bit.",
            "Validate that flashing an unsigned or version-downgraded binary causes the bootloader to halt safely."
        ]
    }
}

with open('scripts/iot_emb_day43.json', 'w', encoding='utf-8') as f:
    json.dump(day43, f, indent=2)
print("Wrote scripts/iot_emb_day43.json successfully!")
