import json

def generate_day23():
    day23 = {
        "coursePrefix": "iot_sec",
        "day": 23,
        "title": "Hardware-Enforced Anti-Rollback Protection: Monotonic eFuse Counters & Version Fencing",
        "goal": "Master the threat mechanics of firmware downgrade attacks, architect hardware-enforced anti-rollback protection using One-Time Programmable (OTP) eFuses, implement thermometer counter encoding, and enforce atomic version fencing in secure bootloaders.",
        "minutes": 38,
        "recap": "Yesterday we established cryptographic root-of-trust authentication using Ed25519 and ECDSA signatures over multi-segment digest chains. Today we address a devastating vulnerability that bypasses signature checks entirely: cryptographic downgrade attacks.",
        "parts": [
            {
                "title": "The Threat Mechanics of Downgrade Attacks & The Security Version Dilemma",
                "say": [
                    "A pervasive misconception among novice embedded security engineers is the belief that authentic cryptographic signatures completely solve firmware integrity and authorization. If an incoming firmware binary is signed by the legitimate OEM private key using Ed25519 or ECDSA P-256, and the signature validates against the hardware root of trust, naive bootloader logic assumes the binary is safe to boot. This assumption is dangerously flawed.",
                    "Consider the standard lifecycle of commercial connected equipment. In month 1, the OEM ships firmware version 1.0.0, signed with the authentic OEM private key. Six months later, independent security researchers discover a critical vulnerability in version 1.0.0—such as a remote stack buffer overflow in the MQTT parser (e.g., CVE-2026-1001) that allows unauthenticated remote code execution. The OEM promptly patches the flaw and releases firmware version 2.0.0, which is also legitimately signed and deployed across the fleet.",
                    "Now consider the adversary. The attacker cannot forge a valid signature for a custom malicious binary. However, the attacker does not need to forge signatures. The attacker possesses the authentic, legitimately signed binary of version 1.0.0 that was broadcast over the air months earlier. If the attacker transmits this authentic version 1.0.0 binary to an edge device running version 2.0.0, a naive bootloader verifies the digital signature. Because the OEM signed version 1.0.0 in the past, the signature verification succeeds 100%! The bootloader flashes version 1.0.0, reboots, and the device is once again vulnerable to CVE-2026-1001, allowing the attacker to exploit the known buffer overflow and seize root execution control.",
                    "This exploit pattern is known as a Downgrade Attack (or Rollback Attack). Downgrade attacks neutralize modern security patches, resurrect previously eliminated zero-day vulnerabilities, and render software-based security updates ineffective.",
                    "To counteract downgrade attacks, the system must enforce strict Version Fencing. However, architects face a subtle design problem: what constitutes a 'version'? In software engineering, versioning follows Semantic Versioning (SemVer), such as v2.1.4 or v3.0.0-rc1, representing marketing features, minor bug fixes, or breaking API changes. If an engineer binds anti-rollback protection directly to SemVer, critical issues emerge. For example, if a bug fix requires backporting to an older major branch, or if a factory test image needs to be flashed during RMA refurbishment, rigid SemVer checks cause immense friction.",
                    "The industry best practice—codified by Arm PSA Certified and NIST SP 800-193—is to decouple the Software Version (marketing/functional release string) from the Security Version Number (SVN, also known as Anti-Rollback Counter). The SVN is an integer counter that increments monotonically if and only if a security vulnerability has been remediated. Multiple functional software releases (v2.1.1, v2.1.2, v2.1.3) may share the exact same SVN (e.g., SVN=5). But once a critical vulnerability is patched in v2.2.0, the SVN is incremented to 6. Once a device establishes SVN=6, any firmware declaring an SVN less than 6 must be irrevocably rejected, regardless of signature validity."
                ],
                "example": "Let us simulate the vulnerability of a naive bootloader that only checks signatures versus a secure bootloader that enforces an anti-rollback version fence.",
                "code": "# Firmware downgrade attack simulation:\ncurrent_version = 0x020000 # v2.0.0\nincoming_version = 0x010000 # v1.0.0\nsignature_valid = True # OEM signed v1.0.0 in the past!\n\nnaive_accept = signature_valid\nsecure_accept = signature_valid and (incoming_version >= current_version)\n\nprint(f\"Current Version : 0x{current_version:06X} (v2.0.0)\")\nprint(f\"Incoming Version: 0x{incoming_version:06X} (v1.0.0, Authentic Signature)\")\nprint(f\"Naive Bootloader Result : {'ACCEPTED (VULNERABLE!)' if naive_accept else 'REJECTED'}\")\nprint(f\"Secure Anti-Rollback    : {'ACCEPTED' if secure_accept else 'REJECTED (DOWNGRADE BLOCKED)'}\")",
                "output": "Current Version : 0x020000 (v2.0.0)\nIncoming Version: 0x010000 (v1.0.0, Authentic Signature)\nNaive Bootloader Result : ACCEPTED (VULNERABLE!)\nSecure Anti-Rollback    : REJECTED (DOWNGRADE BLOCKED)",
                "codeNotes": [
                    "A naive bootloader validates only cryptographic signatures, accepting vulnerable older OEM binaries.",
                    "The secure bootloader pairs signature verification with an anti-rollback version inequality check.",
                    "Rejects authentic OEM binaries whose security version is lower than the active baseline."
                ],
                "tryIt": "Set incoming_version to 0x020100 (v2.1.0) and verify that Secure Anti-Rollback returns ACCEPTED.",
                "check": {
                    "question": "Why is cryptographic signature verification alone insufficient to prevent firmware downgrade attacks?",
                    "options": [
                        "Older firmware images were signed with authentic OEM private keys, so their cryptographic signatures remain perfectly valid forever.",
                        "Signature verification algorithms stop functioning when a new year begins.",
                        "Asymmetric signatures can only verify images that are smaller than 64 kilobytes.",
                        "The public key in eFuse expires automatically after 30 days."
                    ],
                    "answer": 0,
                    "why": "Because older vulnerable binaries possess authentic, untampered signatures from past releases, a bootloader checking only signatures cannot distinguish a legitimate update from a downgrade attack."
                }
            },
            {
                "title": "Hardware Monotonic Counters: OTP eFuses, Thermometer Coding & Anti-Tamper Physics",
                "say": [
                    "Having identified the necessity of storing a minimum acceptable Security Version Number (SVN), where should this counter be stored? If the bootloader stores the SVN in external SPI flash memory or internal rewritable flash, the security architecture collapses.",
                    "An attacker with physical access to the device can attach an SPI flash programmer (such as a Bus Pirate or Raspberry Pi), read the configuration sector, edit the SVN byte from 6 back to 1, and rewrite the sector. Even without hardware tools, if the device suffers from a memory corruption exploit in the running application, the attacker could issue flash erase commands to reset the counter in software. Flash memory cells are inherently erasable and reprogrammable; they cannot provide an authoritative anti-rollback anchor.",
                    "To guarantee that an anti-rollback counter can never be wound backward, microcontrollers rely on One-Time Programmable (OTP) eFuses. An eFuse is a microscopic microscopic semiconductor structure consisting of a polysilicon or silicided metal link. In its unprogrammed state, the link conducts electricity (representing a logical 0 or 1 depending on circuit design, conventionally 0 in modern SoCs).",
                    "To program (or 'blow') an eFuse, on-chip power management circuitry applies a high programming voltage (typically VDDQ or VPP around 1.8V to 2.5V) and routes a controlled pulse of high-density electrical current through the fuse link. The intense current triggers microscopic Joule heating and electromigration, physically severing the microscopic conductive link. Once an eFuse is physically vaporized or severed, the physical link cannot be rebuilt by software, memory corruption, or external flash programmers. The transition from 0 to 1 is irreversible.",
                    "However, eFuses present a hardware constraint: silicon real estate. An embedded SoC typically provides a finite array of eFuse bits dedicated to security counters (e.g., 32 to 128 bits). If the counter were stored as standard binary integers (e.g., storing the value 5 as 0b00000101), incrementing the counter creates a mathematical paradox. To transition from 5 (0b00000101) to 6 (0b00000110), bit 0 must transition from 1 back to 0. But in physical OTP eFuses, a blown 1 can never be turned back into a 0!",
                    "To overcome this physical law, hardware monotonic counters utilize Thermometer Coding (also known as unary bit-field encoding). In thermometer coding, an integer value N is represented by blowing exactly N consecutive bits in the eFuse word. The value 0 corresponds to 0b00000000 (0 bits blown). The value 1 is 0b00000001 (1 bit blown). The value 3 is 0b00000111 (3 bits blown). To increment from 5 (0b00011111) to 6, the system simply blows the 6th bit, resulting in 0b00111111. Every increment operation only turns 0s into 1s, perfectly respecting the one-way physical irreversibility of the semiconductor fuse."
                ],
                "example": "Let us simulate thermometer coding for an eFuse monotonic counter and verify that incrementing values only sets additional bits.",
                "code": "def decode_thermometer(val: int) -> int:\n    return bin(val).count(\"1\")\n\ndef encode_thermometer(count: int) -> int:\n    return (1 << count) - 1\n\nefuse_raw = 0b00011111 # 5 bits blown\ncurrent_counter = decode_thermometer(efuse_raw)\n\nnew_counter = 6\nupdated_efuse = encode_thermometer(new_counter)\n\nprint(f\"Current eFuse Raw: 0b{efuse_raw:08b} (Security Version: {current_counter})\")\nprint(f\"Updated eFuse Raw: 0b{updated_efuse:08b} (Security Version: {new_counter})\")\nprint(f\"One-Way Increment Valid: {(updated_efuse | efuse_raw) == updated_efuse}\")",
                "output": "Current eFuse Raw: 0b00011111 (Security Version: 5)\nUpdated eFuse Raw: 0b00111111 (Security Version: 6)\nOne-Way Increment Valid: True",
                "codeNotes": [
                    "Thermometer decoding counts the number of set bits (population count) in the eFuse register.",
                    "Thermometer encoding produces an unbroken string of set bits representing the counter value.",
                    "One-way increment validation verifies that the new bitmask is a strict superset of the old bitmask."
                ],
                "tryIt": "Calculate the raw binary representation for security version 7 using encode_thermometer(7).",
                "check": {
                    "question": "Why is thermometer coding preferred over standard binary integer encoding for eFuse anti-rollback counters?",
                    "options": [
                        "Standard binary requires changing 1s back into 0s on certain increments, which is physically impossible in One-Time Programmable (OTP) eFuses.",
                        "Thermometer coding requires 100 times less silicon area than binary integers.",
                        "Binary integers cannot be read by 32-bit ARM processors.",
                        "Thermometer coding automatically encrypts the counter using AES-128."
                    ],
                    "answer": 0,
                    "why": "Because blown eFuses can never be restored to 0, thermometer encoding ensures every counter increment only changes unblown 0s to 1s, which is physically possible."
                }
            },
            {
                "title": "Image Security Version Manifest Parsing & Bootloader Version Fencing",
                "say": [
                    "Now that the hardware monotonic counter mechanism is defined, how does the bootloader parse and compare the declared security version of an incoming firmware image?",
                    "In a production firmware layout, the binary is prepended with an authenticated Image Header (or Manifest). This header contains structured binary metadata packed into fixed-offset fields: 1) Magic signature bytes (e.g., b'APEX' or 0x58455041); 2) Functional Application Version (e.g., 0x020100 for v2.1.0); 3) Security Version Number (SVN, e.g., uint32 integer 7); 4) Binary Payload Size in bytes; and 5) Cryptographic payload SHA-256 digest.",
                    "During the initial stage of the bootloader execution—before copying bytes into execution SRAM or triggering flash erase cycles—the bootloader reads the header from the candidate flash slot (Slot B).",
                    "The bootloader performs a multi-step validation fence: First, it validates the magic signature bytes to confirm the presence of an authorized header structure. Second, it reads the hardware eFuse counter register via dedicated memory-mapped I/O (MMIO) registers. Third, it evaluates the fundamental anti-rollback version fence inequality: Declared SVN in Manifest >= Hardware eFuse SVN.",
                    "If the declared SVN in the manifest is strictly less than the hardware eFuse SVN, the bootloader aborts the boot process immediately. The candidate image in Slot B is marked as 'CORRUPT_ROLLBACK_ATTACK', an audit log event is recorded, and the bootloader falls back to the golden firmware in Slot A. The candidate image is never given CPU execution cycles, preventing any potential exploitation of legacy vulnerabilities.",
                    "Notice that if the declared SVN is greater than or equal to the hardware eFuse SVN, the version fence is satisfied. However, this does not mean the bootloader immediately burns the eFuse! The image must first pass complete cryptographic signature verification, decrypt payload data (if encrypted), and pass runtime self-tests. Burning the eFuse prematurely is a fatal design mistake."
                ],
                "example": "Let us construct a binary firmware image header using Python's struct module and parse the security version number.",
                "code": "import struct\n\nmagic = b\"APEX\"\napp_version = 0x020100 # v2.1.0\nsecurity_version = 7   # Security counter 7\nimage_size = 409600    # 400 KB\n\nheader = struct.pack(\">4sIII\", magic, app_version, security_version, image_size)\n\nm, av, sv, sz = struct.unpack(\">4sIII\", header)\nprint(f\"Image Header: Magic={m.decode()}, AppVer=0x{av:06X}\")\nprint(f\"Declared Security Version: {sv} (Image Size: {sz} bytes)\")",
                "output": "Image Header: Magic=APEX, AppVer=0x020100\nDeclared Security Version: 7 (Image Size: 409600 bytes)",
                "codeNotes": [
                    "Packs header metadata into big-endian binary format with fixed offsets for predictable bootloader parsing.",
                    "Extracts the Security Version Number independently from the application functional version.",
                    "Provides the exact counter value required for hardware eFuse fence comparison."
                ],
                "tryIt": "Unpack a header with security_version set to 10 and print whether it passes a hardware fence of 8.",
                "check": {
                    "question": "What happens if an incoming firmware image declares an SVN of 5 when the device's hardware eFuse counter is 6?",
                    "options": [
                        "The bootloader detects a downgrade attack, rejects the candidate image immediately, and refuses to boot it.",
                        "The bootloader burns an eFuse to decrement the hardware counter to 5.",
                        "The bootloader prompts the user to enter an admin password.",
                        "The bootloader boots the image in safe mode with network access disabled."
                    ],
                    "answer": 0,
                    "why": "When incoming SVN < hardware eFuse SVN, the version fence triggers, rejecting the image to prevent resurrecting patched vulnerabilities."
                }
            },
            {
                "title": "The Atomic Fuse Burning Invariant & Two-Stage Boot Confirmation",
                "say": [
                    "One of the most catastrophic bugs in embedded systems engineering is burning anti-rollback eFuses prematurely. Consider the following failure scenario:",
                    "A device running verified firmware in Slot A (with hardware eFuse counter = 5) downloads an update to Slot B with declared SVN = 6. The bootloader verifies the digital signature over Slot B, confirms that 6 >= 5, and immediately issues the high-voltage command to blow the 6th eFuse bit in silicon. The hardware eFuse counter is now permanently 6.",
                    "The bootloader then jumps to the entry point of Slot B. However, unknown to the OEM, the new firmware contains an unhandled null pointer dereference during cellular modem initialization. Within 200 milliseconds of booting, the candidate firmware crashes into a HardFault exception handler. The hardware watchdog timer expires and resets the microcontroller.",
                    "The bootloader restarts. Following standard dual-bank recovery protocol, the bootloader recognizes that Slot B crashed during its trial boot, so it attempts to revert execution to the proven firmware in Slot A. But when the bootloader checks Slot A, what does it find? Slot A's declared SVN is 5. But the hardware eFuse counter was already blown to 6! Slot A now fails the anti-rollback fence! Slot B crashes, and Slot A is blocked by anti-rollback. The device is permanently and irreversibly bricked.",
                    "To prevent this catastrophic bricking scenario, robust IoT architectures enforce the Atomic Fuse Burning Invariant: eFuses must NEVER be blown during download, staging, or initial trial boot. Physical eFuses may only be blown AFTER the candidate image has successfully booted, executed hardware diagnostics, established network connectivity, and passed comprehensive self-tests.",
                    "The execution sequence follows a strict two-stage confirmation protocol: 1) Staged Trial Boot: The bootloader verifies the signature and validates that Candidate SVN >= eFuse SVN. It boots Slot B in trial mode while leaving eFuses completely untouched; 2) Application Health Self-Test: The application initializes critical peripherals, connects to the cloud backend, and confirms operational stability; 3) Atomic Commit: The application issues an authenticated syscall to the secure bootloader (or Secure Enclave), which verifies that all self-tests succeeded and only then applies the VPP programming voltage to blow the eFuse counter to the candidate SVN."
                ],
                "example": "Let us simulate the fuse burning protocol and verify that failed trial boots safely revert to Slot A without corrupting the eFuse counter.",
                "code": "class FuseBurnProtocol:\n    def __init__(self, hw_efuse_counter: int):\n        self.hw_counter = hw_efuse_counter\n        self.state = \"STAGED\"\n\n    def test_boot(self, trial_passed: bool, candidate_sec_version: int):\n        if not trial_passed:\n            self.state = \"REVERTED_SLOT_A\"\n            return False, f\"Trial failed. Preserved eFuse at {self.hw_counter}\"\n        \n        if candidate_sec_version > self.hw_counter:\n            self.hw_counter = candidate_sec_version\n            self.state = \"FUSE_BLOWN_CONFIRMED\"\n            return True, f\"Burned eFuse counter to {self.hw_counter}\"\n        return True, \"No counter increment needed\"\n\nprotocol = FuseBurnProtocol(hw_efuse_counter=5)\nok, msg = protocol.test_boot(trial_passed=True, candidate_sec_version=6)\nprint(f\"Protocol State: {protocol.state}\")\nprint(f\"Action Result : {msg}\")\nprint(f\"Active Hardware eFuse Counter: {protocol.hw_counter}\")",
                "output": "Protocol State: FUSE_BLOWN_CONFIRMED\nAction Result : Burned eFuse counter to 6\nActive Hardware eFuse Counter: 6",
                "codeNotes": [
                    "Guarantees that hardware eFuses remain completely untouched during initial trial execution.",
                    "If a trial fails, the system reverts to Slot A whose SVN still matches the unblown hardware eFuse counter.",
                    "Permanently blows eFuses only after confirmed successful application self-testing."
                ],
                "tryIt": "Run protocol.test_boot(trial_passed=False, candidate_sec_version=6) and verify state becomes REVERTED_SLOT_A.",
                "check": {
                    "question": "What fatal consequence occurs if an eFuse anti-rollback counter is blown before the candidate firmware passes its trial self-test?",
                    "options": [
                        "If the candidate firmware crashes on boot, the bootloader cannot fall back to Slot A because Slot A now fails the newly blown eFuse counter, bricking the device.",
                        "The candidate firmware automatically formats external SPI flash.",
                        "The cryptographic signature key is erased from memory.",
                        "The device switches into factory DFU mode and broadcasts its Wi-Fi password."
                    ],
                    "answer": 0,
                    "why": "Blowing eFuses before trial confirmation bricks the device if the candidate firmware fails, because the proven fallback slot no longer satisfies the incremented counter."
                }
            },
            {
                "title": "ApexAntiRollbackEngine: End-to-End Downgrade Defense & eFuse Commit",
                "say": [
                    "To synthesize all anti-rollback principles into an industrial-grade implementation, we architect the ApexAntiRollbackEngine. This subsystem coordinates incoming package evaluation, version fencing, staged trial state management, and permanent eFuse commits.",
                    "When an OTA update package arrives, the ApexAntiRollbackEngine inspects the candidate image manifest. It verifies the candidate's declared Security Version Number against the active hardware eFuse counter. If an attacker attempts to inject an older package whose counter is lower than the hardware register, the engine immediately flags a DOWNGRADE_ATTACK_DETECTED event and rejects the package.",
                    "When an authentic upgrade package is received with a higher security counter, the engine grants permission to stage the image into candidate Slot B. However, it preserves the hardware eFuse in its existing state, holding the target counter in a volatile staged register.",
                    "Upon system reboot, the bootloader executes the candidate image under hardware watchdog supervision. If the application crashes, hangs, or fails peripheral self-tests, the watchdog triggers a reboot, and the engine cancels the staged counter, safely reverting to the golden slot with zero eFuse changes.",
                    "Only when the candidate application successfully executes all health checks and confirms cloud communication does the engine execute the permanent commit. It drives the on-chip charge pump, generates the required programming pulse, and permanently blows the hardware eFuse counter to match the new security baseline, locking out all prior versions forever."
                ],
                "example": "Let us execute the ApexAntiRollbackEngine across both a simulated downgrade attack and a legitimate upgrade with atomic commit.",
                "code": "class ApexAntiRollbackEngine:\n    def __init__(self, initial_hw_counter: int):\n        self.hw_counter = initial_hw_counter\n        self.staged_counter = None\n\n    def evaluate_incoming_package(self, pkg_security_version: int):\n        if pkg_security_version < self.hw_counter:\n            return False, f\"DOWNGRADE_ATTACK_DETECTED: Pkg counter {pkg_security_version} < Hardware counter {self.hw_counter}\"\n        self.staged_counter = pkg_security_version\n        return True, f\"VERSION_FENCE_PASSED: Pkg counter {pkg_security_version} >= {self.hw_counter}\"\n\n    def commit_anti_rollback(self, self_test_passed: bool):\n        if not self_test_passed or self.staged_counter is None:\n            self.staged_counter = None\n            return False, \"Self-test failed: Rollback to golden slot (eFuse preserved)\"\n        \n        if self.staged_counter > self.hw_counter:\n            old = self.hw_counter\n            self.hw_counter = self.staged_counter\n            self.staged_counter = None\n            return True, f\"eFuse blown permanently from {old} to {self.hw_counter}\"\n        return True, f\"Counter unchanged at {self.hw_counter}\"\n\nengine = ApexAntiRollbackEngine(initial_hw_counter=10)\n\nres1_ok, res1_msg = engine.evaluate_incoming_package(pkg_security_version=9)\nres2_ok, res2_msg = engine.evaluate_incoming_package(pkg_security_version=11)\nres2_commit, res2_cmsg = engine.commit_anti_rollback(self_test_passed=True)\n\nprint(f\"Package v9  : {res1_msg} (Success: {res1_ok})\")\nprint(f\"Package v11 : {res2_msg} (Success: {res2_ok})\")\nprint(f\"Commit Burn : {res2_cmsg} (Active eFuse: {engine.hw_counter})\")",
                "output": "Package v9  : DOWNGRADE_ATTACK_DETECTED: Pkg counter 9 < Hardware counter 10 (Success: False)\nPackage v11 : VERSION_FENCE_PASSED: Pkg counter 11 >= 10 (Success: True)\nCommit Burn : eFuse blown permanently from 10 to 11 (Active eFuse: 11)",
                "codeNotes": [
                    "Coordinates version fencing during OTA staging and atomic physical commit post self-test.",
                    "Blocks downgrade attacks attempting to flash authentic packages with security counters lower than eFuse.",
                    "Ensures zero eFuses are blown if trial self-tests fail, preserving dual-bank fallback resilience."
                ],
                "tryIt": "Evaluate a package with security version 10 against active counter 10 and verify it passes the fence without requiring an eFuse burn.",
                "check": {
                    "question": "What is the primary role of the ApexAntiRollbackEngine in a secure dual-bank bootloader?",
                    "options": [
                        "Enforce hardware-anchored version fencing against downgrade attacks while atomically timing eFuse burning until after trial self-tests succeed.",
                        "Compress firmware binaries using gzip before saving to flash.",
                        "Transmit GPS coordinates to the cloud backend on every boot.",
                        "Reformat internal flash memory whenever an error occurs."
                    ],
                    "answer": 0,
                    "why": "The engine pairs version fence rejection of vulnerable legacy binaries with delayed, post-trial eFuse burning to prevent bricking during failed updates."
                }
            }
        ],
        "summary": [
            "Downgrade attacks exploit authentic, legitimately signed older firmware images to resurrect patched vulnerabilities, bypassing cryptographic signature verification.",
            "Software versions (SemVer) must be strictly decoupled from Security Version Numbers (SVN), ensuring anti-rollback counters only increment upon security remediations.",
            "One-Time Programmable (OTP) eFuses provide irreversible hardware storage, utilizing thermometer unary coding to increment counters without violating semiconductor physics.",
            "The Atomic Fuse Burning Invariant mandates that eFuses must never be blown until candidate firmware boots, completes diagnostics, and passes comprehensive self-tests."
        ],
        "projectStep": {
            "title": "Hardware eFuse Monotonic Anti-Rollback Subsystem Integration",
            "steps": [
                "Implement binary manifest parsing to extract declared Security Version Numbers from image headers.",
                "Configure MMIO eFuse driver registers to read active thermometer-encoded monotonic counter bitmasks.",
                "Enforce bootloader version fencing logic: reject incoming payloads whose SVN is strictly less than hardware eFuse.",
                "Implement the two-stage commit protocol: stage candidate counters in volatile registers and blow OTP eFuses only after confirmed self-test execution."
            ]
        }
    }
    with open('scripts/iot_sec_day23.json', 'w', encoding='utf-8') as f:
        json.dump(day23, f, indent=2)
    print("Generated base Day 23 in scripts/iot_sec_day23.json")

if __name__ == '__main__':
    generate_day23()
