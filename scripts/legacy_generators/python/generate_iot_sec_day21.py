import json

def generate_day21():
    day21 = {
        "coursePrefix": "iot_sec",
        "day": 21,
        "title": "Secure Firmware Over-The-Air (FOTA) Architecture: A/B Dual-Bank Partitioning & Fallback Recovery",
        "goal": "Master secure Firmware Over-The-Air update architectures on bare-metal microcontrollers, design dual-bank A/B memory maps, and implement atomic bootloader swap state machines with watchdog self-test recovery.",
        "minutes": 38,
        "recap": "In Milestone 4 we unified IEEE 802.1AR device identity, zero-heap DER parsing, and TLS 1.3 into an autonomous transport engine. Today we enter Block 5: securing the firmware lifecycle with dual-bank A/B FOTA and fail-safe rollback recovery.",
        "parts": [
            {
                "title": "Secure FOTA Lifecycle & The Threat Landscape of Remote Firmware Updates",
                "say": [
                    "In the lifecycle of an Internet of Things (IoT) deployment, the ability to remotely update device firmware over-the-air (FOTA) is simultaneously the most critical operational requirement and the single most dangerous remote attack surface. Without reliable FOTA capabilities, deploying patches for newly discovered zero-day security vulnerabilities, fixing logic bugs in field control loops, or introducing new protocol features across geographically distributed fleets requires physical technician intervention—costing thousands of dollars per service call or rendering remote nodes permanently obsolete.",
                    "However, because a firmware update replaces the foundational software controlling the microcontroller, adversaries ruthlessly target the FOTA pipeline. If an attacker can successfully inject a poisoned, malicious firmware image into an industrial PLC, an automotive engine control unit (ECU), or a municipal smart water meter, they achieve permanent, uninhibited root-level control over the physical process. A malicious image can disable safety limiters, sabotage machinery, siphon sensitive sensor readings, or intentionally brick devices across an entire electrical grid in a synchronized blackout attack.",
                    "Beyond active malicious attacks, firmware updates face severe physical and operational hazards in the field. Microcontrollers deployed in industrial environments communicate over volatile, intermittent network links such as cellular LPWAN (NB-IoT/LTE-M), satellite modems, or low-power wireless mesh (Thread/Zigbee). If network connectivity drops midway through downloading a 500 KB firmware payload, a naive system that overwrote its running program memory will be left in a half-written, corrupted state—bricking the device into an unbootable paperweight.",
                    "Similarly, power disruptions present a constant threat. Agricultural sensors, remote environmental monitors, and vehicular telematics nodes operate on battery power or unstable industrial DC buses subject to voltage sags, brownouts, and sudden power cuts. If power fails while the internal flash memory is in the middle of a high-voltage sector erase or write cycle, the firmware image becomes permanently corrupted. A secure FOTA architecture must be physically resilient against arbitrary power failures at any microsecond of the update sequence.",
                    "To achieve resilience against both sophisticated network adversaries and harsh physical field conditions, modern embedded architectures enforce a formal Secure FOTA Invariant: A running, operational firmware image must never be modified or erased in-place; new candidate firmware must be staged into an isolated secondary partition, cryptographically verified in its entirety, and booted under strict self-test supervision with deterministic automatic rollback capabilities."
                ],
                "example": "Let us inspect the binary serialization of a secure FOTA Image Header, embedding magic markers, semantic versioning, image payload sizes, and SHA-256 integrity digests.",
                "code": "import hashlib\nimport struct\n\nmagic = b\"APEX\"\nversion = (2 << 16) | (1 << 8) | 0\npayload = b\"MICROCONTROLLER_FIRMWARE_PAYLOAD_V2_1_0\"\nimage_size = len(payload)\nsha256_hash = hashlib.sha256(payload).digest()\ntarget_slot = 1\n\nheader = struct.pack(\">4sII32sB\", magic, version, image_size, sha256_hash, target_slot)\nprint(f\"Header Magic: {header[:4].decode()}\")\nprint(f\"Firmware Version: {version >> 16}.{(version >> 8) & 0xFF}.{version & 0xFF}\")\nprint(f\"Header Size: {len(header)} bytes, Payload Size: {image_size} bytes\")\nprint(f\"Payload Digest: {sha256_hash.hex()[:16]}...\")",
                "output": "Header Magic: APEX\nFirmware Version: 2.1.0\nHeader Size: 45 bytes, Payload Size: 39 bytes\nPayload Digest: e37573404b683a4b...",
                "codeNotes": [
                    "Magic bytes ('APEX') identify the binary as a valid bootable image before parsing header offsets.",
                    "Encodes major, minor, and patch version bits into a compact 32-bit unsigned integer.",
                    "Embeds a 32-byte SHA-256 digest covering the exact firmware payload bytes."
                ],
                "tryIt": "Modify version to 3.0.4 and observe how the decoded version string changes.",
                "check": {
                    "question": "Why is in-place firmware overwriting strictly prohibited in secure, high-assurance embedded systems?",
                    "options": [
                        "A network drop or sudden power loss during in-place erasing/writing destroys the existing working firmware, permanently bricking the device.",
                        "In-place writing requires 128-bit processors.",
                        "Microcontroller flash memory cannot be rewritten after factory flashing.",
                        "In-place flashing requires transmitting the private key over the cellular network."
                    ],
                    "answer": 0,
                    "why": "If power cuts or data drops during an in-place flash overwrite, the old firmware is already destroyed and the new one is incomplete, leaving the device completely unbootable."
                }
            },
            {
                "title": "Dual-Bank A/B Flash Memory Partitioning Architecture",
                "say": [
                    "To guarantee that an edge device can survive power outages and corrupted downloads without bricking, embedded firmware architectures implement Dual-Bank A/B Flash Partitioning. Rather than allocating the entire non-volatile flash memory to a single monolithic application, the flash address space is divided into distinct, isolated operational zones.",
                    "In a representative 1 Megabyte (1024 KB) internal flash memory microcontroller (such as an ARM Cortex-M4 or M33), the partition map is organized into four primary regions: 1) Immutable Bootloader (typically 32 KB to 64 KB at the base of flash, e.g., 0x08000000); 2) Primary Application Slot (Slot A, 448 KB, e.g., 0x08010000); 3) Secondary Candidate Slot (Slot B, 448 KB, e.g., 0x08080000); and 4) Scratch / Non-Volatile State Storage (64 KB, e.g., 0x080F0000).",
                    "Under this dual-bank layout, the device continuously executes its active production workload from Slot A. When an Over-The-Air update arrives, the application downloads the incoming payload and writes it exclusively into Slot B (the candidate/staging slot). During the entire download process—which may take minutes or hours over an intermittent cellular LPWAN link—Slot A remains completely untouched, executing standard sensor polling and motor control loops without interruption.",
                    "If the download fails, the battery depletes, or the network connection terminates midway, the device suffers zero operational impact. Slot B simply contains an incomplete binary that is discarded on the next boot. The running firmware in Slot A remains fully functional and intact.",
                    "In dual-bank silicon featuring hardware bank-swapping (such as STM32 dual-bank flash or NXP LPC55S69), the microcontroller hardware can remap the physical base addresses of Bank 1 and Bank 2. When the bootloader certifies Bank 2 as valid, a single register write switches the memory map: Bank 2 becomes address 0x08000000 and Bank 1 becomes the secondary bank. On microcontrollers without hardware bank remapping, the bootloader utilizes an atomic sector-swap routine or position-independent code (PIC) execution to transition between slots."
                ],
                "example": "Let us compute and display the memory boundaries and partition allocation for a dual-bank 1024 KB flash layout on an embedded microcontroller.",
                "code": "flash_size_kb = 1024\nbootloader_kb = 64\nslot_a_kb = 448\nslot_b_kb = 448\nscratch_kb = 64\n\nslots = {\n    \"BOOTLOADER\": {\"start\": \"0x08000000\", \"size_kb\": bootloader_kb},\n    \"SLOT_A (ACTIVE)\": {\"start\": \"0x08010000\", \"size_kb\": slot_a_kb},\n    \"SLOT_B (STAGING)\": {\"start\": \"0x08080000\", \"size_kb\": slot_b_kb},\n    \"SCRATCH/STORAGE\": {\"start\": \"0x080F0000\", \"size_kb\": scratch_kb}\n}\nfor name, info in slots.items():\n    print(f\"{name:18}: Start={info['start']} (Size: {info['size_kb']} KB)\")\ntotal = sum(s[\"size_kb\"] for s in slots.values())\nprint(f\"Total Flash Partitioned: {total} KB\")",
                "output": "BOOTLOADER        : Start=0x08000000 (Size: 64 KB)\nSLOT_A (ACTIVE)   : Start=0x08010000 (Size: 448 KB)\nSLOT_B (STAGING)  : Start=0x08080000 (Size: 448 KB)\nSCRATCH/STORAGE   : Start=0x080F0000 (Size: 64 KB)\nTotal Flash Partitioned: 1024 KB",
                "codeNotes": [
                    "Partitions 1024 KB of physical flash into immutable bootloader, dual 448 KB application banks, and scratch space.",
                    "Guarantees Slot A and Slot B have identical capacity for symmetrical firmware upgrades.",
                    "Allocates a dedicated scratch region for atomic swap metadata and rollback state preservation."
                ],
                "tryIt": "Change flash_size_kb to 2048 KB (2 MB) and adjust Slot A and Slot B to 960 KB each.",
                "check": {
                    "question": "What happens if a power failure occurs while a microcontroller is writing an OTA update into Slot B in a dual-bank architecture?",
                    "options": [
                        "Slot A remains completely unaffected, allowing the device to boot cleanly from its existing verified firmware.",
                        "The device enters a permanent factory reset loop.",
                        "The bootloader automatically clears Slot A to prevent version divergence.",
                        "The flash memory fuses blow, permanently destroying the microcontroller."
                    ],
                    "answer": 0,
                    "why": "Because active execution runs from Slot A and updates are written strictly to Slot B, a power loss during staging leaves Slot A intact and fully operational."
                }
            },
            {
                "title": "Chunked Ingestion & Cryptographic Header Integrity Verification",
                "say": [
                    "Constrained microcontrollers operating over LPWAN or wireless mesh networks receive firmware packages in small, fragmented packets. For example, Bluetooth Low Energy (BLE) transmits data in chunks governed by the Maximum Transmission Unit (MTU, typically 23 to 247 bytes), while LTE-M transports packets in 512-byte or 1024-byte TCP segments.",
                    "An edge device with only 32 KB of SRAM cannot buffer a 400 KB firmware binary in memory before verifying its cryptographic hash. Attempting to do so would instantly cause an out-of-memory crash. Therefore, the FOTA ingestion engine must process incoming firmware in a streaming, chunked architecture.",
                    "As each packet arrives over UART, SPI, or network socket, the firmware writes the chunk directly into the candidate flash slot (Slot B) at sequential sector offsets. Simultaneously, the firmware feeds the chunk into the hardware-accelerated SHA-256 engine. By updating the rolling cryptographic hash on-the-fly as chunks are committed to flash, the microcontroller maintains continuous verification state without consuming RAM.",
                    "Once the final chunk is received, the engine finalizes the SHA-256 digest and compares it against the expected hash declared in the cryptographically authenticated image header. If the computed digest fails to match by even a single bit, the candidate image is deemed corrupted. The engine halts the update, marks Slot B as invalid, and refuses to trigger a reboot.",
                    "In addition to SHA-256 payload integrity, the engine parses the image header to verify architectural prerequisites: 1) Magic Number match (confirming valid image format); 2) Vector Table alignment (confirming initial stack pointer and reset handler reside at valid SRAM and Flash addresses); and 3) Target Hardware Architecture ID (confirming the image was compiled for this specific silicon revision, preventing cross-flashing incompatible binaries)."
                ],
                "example": "Let us simulate chunked firmware ingestion, processing 16-byte payloads iteratively and verifying the final rolling SHA-256 digest against the authenticated package header.",
                "code": "import hashlib\n\nfirmware_data = b\"FIRMWARE_CHUNK_1FIRMWARE_CHUNK_2FIRMWARE_CHUNK_3\"\nexpected_digest = hashlib.sha256(firmware_data).hexdigest()\n\nhasher = hashlib.sha256()\nchunk_size = 16\nfor i in range(0, len(firmware_data), chunk_size):\n    chunk = firmware_data[i : i + chunk_size]\n    hasher.update(chunk)\n\nactual_digest = hasher.hexdigest()\nverified = actual_digest == expected_digest\nprint(f\"Chunk Size: {chunk_size} bytes, Chunks Ingested: {len(firmware_data)//chunk_size}\")\nprint(f\"Digest Match: {verified} ({actual_digest[:16]}...)\")",
                "output": "Chunk Size: 16 bytes, Chunks Ingested: 3\nDigest Match: True (f060e715b4b841ad...)",
                "codeNotes": [
                    "Streams incoming data in fixed-size 16-byte chunks simulating constrained network packet MTUs.",
                    "Updates rolling SHA-256 state incrementally without buffering the complete binary in RAM.",
                    "Validates the final computed digest against the expected header hash before certifying the slot."
                ],
                "tryIt": "Introduce a 1-byte corruption into firmware_data and verify that Digest Match reports False.",
                "check": {
                    "question": "How does chunked cryptographic hashing enable firmware verification on a microcontroller with only 16 KB of RAM?",
                    "options": [
                        "It maintains a rolling 32-byte SHA-256 internal state across incoming network chunks, eliminating the need to buffer the entire binary in SRAM.",
                        "It compresses the firmware image by 90% before writing to flash.",
                        "It eliminates the need to verify digital signatures.",
                        "It downloads firmware directly into the CPU instruction cache."
                    ],
                    "answer": 0,
                    "why": "Streaming SHA-256 requires only a fixed 32-byte hash state in memory, allowing gigabyte-scale images to be verified on microcontrollers with tiny RAM footprints."
                }
            },
            {
                "title": "Atomic Bootloader Swap State Machine & Hardware Watchdog Self-Test",
                "say": [
                    "Even when a candidate firmware image passes full cryptographic integrity verification, a catastrophic failure mode remains: Functional Firmware Panic. A firmware image may be cryptographically authentic and intact, but contain a critical software bug—such as an unhandled null pointer dereference, an invalid RTOS priority inversion, or an incorrect clock PLL multiplier that prevents network initialization.",
                    "If the bootloader unconditionally marks a new candidate image as permanent and reboots, a crashing firmware image will trap the device in a permanent boot loop (a HardFault panic loop). Because the device cannot initialize its network drivers or reach the cloud, it cannot receive a subsequent FOTA update to fix the bug, resulting in a bricked device.",
                    "To prevent this, high-assurance embedded systems implement an Atomic Bootloader Swap State Machine governed by hardware watchdog timers and multi-stage boot flags. The boot state is tracked using four formal states: `UNCONFIRMED`, `TESTING`, `CONFIRMED`, and `REVERTED`.",
                    "When candidate firmware in Slot B passes cryptographic verification, the bootloader does not mark it as permanently active. Instead, it sets the boot state to `TESTING` in non-volatile metadata storage and reboots into Slot B. Crucially, before jumping into the candidate firmware, the bootloader arms the Hardware Watchdog Timer (WDT) with a strict safety timeout (e.g., 10 seconds).",
                    "Upon booting, the new firmware must execute a rigorous self-test routine: initializing system peripherals, validating sensor communications, and successfully establishing an encrypted cloud connection. If all tests pass, the application firmware explicitly clears the watchdog and issues a `commit_image()` command, updating the state in metadata flash from `TESTING` to `CONFIRMED`.",
                    "However, if the new firmware crashes, enters a HardFault exception, or hangs in an infinite loop, it fails to kick the watchdog. The hardware watchdog timer expires, asserting a physical reset line to the MCU. When the microcontroller reboots, the bootloader inspects the metadata flag, detects that the image failed in the `TESTING` state, marks the candidate as `REVERTED`, and automatically falls back to the proven golden firmware in Slot A."
                ],
                "example": "Let us trace the state transition of a candidate firmware image executing self-test verification, demonstrating how successful self-tests commit images while panics trigger automatic fallback.",
                "code": "boot_state = \"TESTING\"\nwatchdog_timeout_ms = 5000\nboot_successful = True\n\nif boot_state == \"TESTING\":\n    if boot_successful:\n        boot_state = \"CONFIRMED\"\n        action = \"PERMANENT_ACTIVE\"\n    else:\n        boot_state = \"REVERTED\"\n        action = \"FALLBACK_SLOT_A\"\n\nprint(f\"Bootloader State: {boot_state}\")\nprint(f\"Watchdog Timer: {watchdog_timeout_ms} ms (Status: KICKED)\")\nprint(f\"Final Action: {action}\")",
                "output": "Bootloader State: CONFIRMED\nWatchdog Timer: 5000 ms (Status: KICKED)\nFinal Action: PERMANENT_ACTIVE",
                "codeNotes": [
                    "Candidate image boots in transient TESTING state with armed hardware watchdog.",
                    "Successful execution of application self-test commits the image to CONFIRMED state.",
                    "If boot_successful were False (or watchdog reset occurred), bootloader reverts to Slot A."
                ],
                "tryIt": "Set boot_successful to False and verify that the bootloader state transitions to REVERTED with FALLBACK_SLOT_A.",
                "check": {
                    "question": "What is the primary function of the hardware watchdog timer during a FOTA firmware trial boot?",
                    "options": [
                        "It triggers an automatic hardware reset if the candidate firmware crashes or hangs before confirming successful execution, enabling bootloader rollback.",
                        "It increases the clock frequency of the processor during boot.",
                        "It encrypts the bootloader code in flash memory.",
                        "It measures the temperature of the microcontroller."
                    ],
                    "answer": 0,
                    "why": "If the candidate firmware hangs or crashes, it cannot service the watchdog. The resulting hardware reset allows the bootloader to detect failure and revert to the previous working slot."
                }
            },
            {
                "title": "ApexDualBankFotaEngine: Production A/B Ingestion & Rollback Subsystem",
                "say": [
                    "To synthesize all FOTA principles into a battle-tested embedded software component, we deploy the ApexDualBankFotaEngine. This engine implements an industrial-grade A/B dual-bank firmware update manager designed for mission-critical ARM Cortex-M microcontrollers.",
                    "Let us trace the complete operational sequence within our unified engine: 1) The engine initializes in the `IDLE` state running active firmware v1.0.0 from Slot A; 2) When a new firmware package (v2.0.0) arrives, the engine enters the `DOWNLOADING` state, streaming incoming chunks into candidate Slot B while computing a hardware SHA-256 rolling digest; 3) Upon completion, the engine validates the computed hash against the authenticated package header; 4) If verified, the engine transitions to `STAGED_TESTING` and requests a controlled reboot into Slot B.",
                    "Upon trial boot, the candidate application executes its built-in peripheral and network self-tests. If self-test passes, the engine issues `commit_boot(self_test_passed=True)`, permanently transitioning the active slot to B and marking state as `CONFIRMED_ACTIVE`. If a fault occurs, the engine triggers `commit_boot(self_test_passed=False)`, reverting active execution back to Slot A with zero downtime.",
                    "By combining dual-bank flash isolation, streaming chunked cryptographic verification, atomic boot state tracking, and hardware watchdog fallback recovery, the ApexDualBankFotaEngine guarantees zero-risk remote updates. It turns the traditionally nerve-wracking process of embedded firmware upgrades into a reliable, fully automated, and 100% fail-safe operational asset."
                ],
                "example": "Let us execute the complete ApexDualBankFotaEngine, demonstrating package ingestion, hash verification, candidate staging, and successful self-test commitment.",
                "code": "import hashlib\n\nclass ApexDualBankFotaEngine:\n    def __init__(self):\n        self.slot_a_version = \"1.0.0\"\n        self.slot_b_version = \"None\"\n        self.active_slot = \"A\"\n        self.candidate_slot = \"B\"\n        self.state = \"IDLE\"\n\n    def ingest_package(self, version: str, payload: bytes, expected_hash: str):\n        self.state = \"DOWNLOADING\"\n        actual_hash = hashlib.sha256(payload).hexdigest()\n        if actual_hash != expected_hash:\n            self.state = \"CORRUPT_PAYLOAD\"\n            return False, \"Hash Verification Failed\"\n        \n        self.slot_b_version = version\n        self.state = \"STAGED_TESTING\"\n        return True, f\"Staged version {version} in Slot {self.candidate_slot}\"\n\n    def commit_boot(self, self_test_passed: bool):\n        if self.state != \"STAGED_TESTING\":\n            return False, \"Invalid state\"\n        if self_test_passed:\n            self.active_slot = self.candidate_slot\n            self.state = \"CONFIRMED_ACTIVE\"\n            return True, f\"Active slot permanently switched to Slot {self.active_slot}\"\n        else:\n            self.state = \"REVERTED_ROLLBACK\"\n            return False, f\"Self-test failed: Rolling back to Slot A (v{self.slot_a_version})\"\n\nengine = ApexDualBankFotaEngine()\npayload = b\"NEW_FIRMWARE_V2_0_0\"\ndigest = hashlib.sha256(payload).hexdigest()\n\nok1, msg1 = engine.ingest_package(\"2.0.0\", payload, digest)\nok2, msg2 = engine.commit_boot(self_test_passed=True)\n\nprint(f\"FOTA Ingestion: {msg1} (Success: {ok1})\")\nprint(f\"Boot State: {engine.state}\")\nprint(f\"Active Version: v{engine.slot_b_version} on Slot {engine.active_slot}\")",
                "output": "FOTA Ingestion: Staged version 2.0.0 in Slot B (Success: True)\nBoot State: CONFIRMED_ACTIVE\nActive Version: v2.0.0 on Slot B",
                "codeNotes": [
                    "Coordinates the full A/B update lifecycle from IDLE to DOWNLOADING, STAGED_TESTING, and CONFIRMED_ACTIVE.",
                    "Validates payload integrity using SHA-256 before allowing trial boot execution.",
                    "Guarantees deterministic rollback to Slot A if candidate self-tests fail."
                ],
                "tryIt": "Pass self_test_passed=False to commit_boot() and observe how the engine safely aborts and preserves Slot A.",
                "check": {
                    "question": "What is the certified active slot of the ApexDualBankFotaEngine after successful self-test commitment?",
                    "options": [
                        "Slot B running v2.0.0 in CONFIRMED_ACTIVE state.",
                        "Slot A running v1.0.0 in REVERTED state.",
                        "Bootloader ROM running in DFU recovery mode.",
                        "External SPI flash in ERASE mode."
                    ],
                    "answer": 0,
                    "why": "Successful self-test verification commits the candidate firmware in Slot B as the permanent active image in CONFIRMED_ACTIVE state."
                }
            }
        ],
        "summary": [
            "FOTA is essential for fleet maintenance but represents a high-risk attack surface requiring multi-layered defense-in-depth.",
            "Dual-bank A/B partitioning isolates candidate downloads from running firmware, preventing bricking from power cuts or dropped links.",
            "Chunked SHA-256 ingestion verifies image integrity on-the-fly without buffering large binaries in constrained microcontroller SRAM.",
            "Atomic bootloader state machines combined with hardware watchdog self-tests guarantee automatic rollback if new firmware panics."
        ],
        "projectStep": {
            "title": "Design & Simulate Dual-Bank A/B FOTA Ingestion Engine",
            "steps": [
                "Define a 1024 KB dual-bank flash partition map with isolated Slot A and Slot B boundaries.",
                "Construct an authenticated FOTA image header embedding magic bytes, version metadata, and SHA-256 digests.",
                "Implement streaming chunked ingestion with rolling hardware-accelerated SHA-256 verification.",
                "Execute the complete ApexDualBankFotaEngine state machine and verify automatic rollback under simulated firmware panic."
            ]
        }
    }

    with open("scripts/iot_sec_day21.json", "w", encoding="utf-8") as f:
        json.dump(day21, f, indent=2)
    print("Day 21 generated successfully!")

if __name__ == "__main__":
    generate_day21()
