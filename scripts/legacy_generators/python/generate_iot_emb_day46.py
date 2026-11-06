import json

day46 = {
    "day": 46,
    "title": "FOTA Topologies: Dual-Bank Flash, Slot Swapping & Partition Maps",
    "goal": "Architect fail-safe, zero-brick Firmware-Over-The-Air (FOTA) update topologies for resource-constrained microcontrollers. Understand the fundamental physical differences between hardware Dual-Bank Flash with instantaneous hardware bank remapping versus Single-Bank Dual-Slot 'ping-pong' architectures. Design rigorous Flash Partition Maps defining Bootloader, Slot 0 (Active), Slot 1 (Staging), and Scratch/Metadata sectors. Master image trailer state machines (UNCONFIRMED, TRIAL, COMMITTED) and implement an atomic dual-bank slot swapper in C++ to achieve zero-downtime field updates without external programmer intervention.",
    "minutes": 38,
    "recap": "In Month 2 Block 9, we constructed hardware-enforced cryptographic security, digital signature verification, and the Milestone 8 Secure Bootloader. Today in Block 10, we deploy this security foundation across the network, architecting resilient over-the-air firmware update engines.",
    "parts": [
        {
            "title": "Physical Dual-Bank Flash Architecture vs Single-Bank Execution",
            "say": [
                "In enterprise and mission-critical embedded systems, deploying a firmware update over the air (FOTA) is the single most vulnerable moment in a device's operational lifecycle. If power is interrupted, if the wireless connection drops, or if an erroneous binary is written into internal Flash, an unprotected microcontroller will be permanently bricked, necessitating an expensive truck roll or field technician visit to physically recover the hardware with an SWD/JTAG debug probe.",
                "To eliminate field bricking, modern microcontrollers (such as the STM32H7, STM32G4, TI MSPM0, and NXP LPC5500 families) incorporate physical Dual-Bank NOR Flash architectures. In a single-bank microcontroller, the entire internal Flash memory array shares a single set of charge pumps, word-line decoders, and sense amplifiers. Because NOR Flash cannot simultaneously read an instruction while writing or erasing another sector within the same memory bank, attempting to flash incoming firmware packets while executing application code triggers a fatal processor pipeline stall or a bus fault, unless the entire flashing routine is temporarily loaded into SRAM.",
                "In stark contrast, true Dual-Bank Flash divides the silicon into two physically distinct, electrically isolated semiconductor memory arrays: Bank 1 and Bank 2. Each bank possesses its own independent charge pumps, read circuits, and programming latches. This hardware isolation provides two revolutionary capabilities for embedded firmware architects: Read-While-Write (RWW) operation and instantaneous hardware bank remapping.",
                "Read-While-Write (RWW) enables the CPU to fetch and execute instructions from Bank 1 at full clock frequency (e.g., 400 MHz) with zero wait-state penalties, while the internal Flash memory controller simultaneously erases and programs incoming firmware packets into Bank 2 in the background. Your real-time motor control loops, FreeRTOS task schedulers, network stacks, and sensor acquisition pipelines never experience a single microsecond of latency or downtime while a 512KB firmware payload is being streamed over LTE or Wi-Fi.",
                "Once the entire candidate binary has been streamed into Bank 2 and cryptographically verified, the bootloader or application triggers an instantaneous hardware bank swap. In microcontrollers like the STM32 family, this is achieved by toggling a dedicated silicon hardware configuration bit in the Flash Option Bytes known as BFB2 (Boot From Bank 2). When BFB2 is set and a system reset occurs, internal address decoders physically remap Bank 2 to address 0x08000000 and Bank 1 to 0x08080000 in a single clock cycle.",
                "This hardware remapping completely eliminates the need to copy hundreds of kilobytes of machine code between Flash partitions. The CPU boots instantly into the new firmware at 0x08000000. If the candidate firmware subsequently fails its operational self-tests, the bootloader simply clears the BFB2 Option Byte, and on the next reboot, Bank 1 is restored as the active partition at 0x08000000. This provides a zero-risk, zero-downtime rollback mechanism guaranteed by silicon decoders.",
                "From a hardware engineering standpoint, the electrical isolation between Bank 1 and Bank 2 provides immunity against high-voltage programming transients. When erasing a NOR Flash sector, internal charge pumps elevate cell gate voltages to approximately 10 to 12 Volts to tunnel electrons across the dielectric floating gate. In single-bank architectures, this elevated voltage stresses the common substrate, creating read-disturb anomalies on adjacent execution sectors.",
                "Dual-Bank Flash eliminates substrate coupling because the charge pump power planes and isolation wells are completely separate. Even if a sudden brownout occurs while Bank 2 is sustaining a 12V sector erase, the internal voltage supervisor cleanly aborts Bank 2 operations while leaving Bank 1 code completely uncorrupted.",
                "Furthermore, hardware dual-banking eliminates the need for large RAM staging buffers. In single-bank systems, engineers must allocate 16KB to 32KB of precious SRAM to hold flashing routines and network buffers while Flash is stalled. Dual-bank microcontrollers allow firmware engineers to dedicate virtually 100% of internal SRAM to application tasks, digital signal processing, and network protocol queues.",
                "When designing high-reliability IoT hardware, selecting an MCU with physical Dual-Bank Flash is the single greatest architectural decision you can make to guarantee zero-brick field resilience, continuous uptime, and deterministic fault recovery."
            ],
            "example": "A smart grid electricity meter running on an STM32 dual-bank MCU streams a 512KB firmware update into Bank 2 over cellular NB-IoT over 45 minutes without interrupting 10kHz AC voltage sampling. Once verified, toggling BFB2 executes an instantaneous 5-millisecond reboot into the new firmware.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

enum class FlashBankId : uint8_t {
    BANK_1 = 0,
    BANK_2 = 1
};

struct DualBankController {
    uint32_t bank1BaseAddr;
    uint32_t bank2BaseAddr;
    uint32_t bankSizeBytes;
    bool bfb2HardwareRemapBit; // Option Byte: Boot From Bank 2
    bool bank2WriteBusy;

    DualBankController(uint32_t b1, uint32_t b2, uint32_t size)
        : bank1BaseAddr(b1), bank2BaseAddr(b2), bankSizeBytes(size),
          bfb2HardwareRemapBit(false), bank2WriteBusy(false) {}

    void simulateRWWStreaming(uint32_t chunkOffset, uint32_t chunkSize) {
        bank2WriteBusy = true;
        // CPU continues executing from Bank 1 uninterrupted
        std::cout << "[RWW-ACTIVE] CPU fetching from Bank 1 (0x" << std::hex << bank1BaseAddr 
                  << ") while writing " << std::dec << chunkSize 
                  << " bytes to Bank 2 at offset 0x" << std::hex << chunkOffset << std::endl;
        bank2WriteBusy = false;
    }

    void toggleBfb2Remap() {
        bfb2HardwareRemapBit = !bfb2HardwareRemapBit;
        std::cout << "[OPTION-BYTE] Toggled BFB2 hardware remap bit to: " 
                  << (bfb2HardwareRemapBit ? "1 (Bank 2 Boots at 0x08000000)" : "0 (Bank 1 Boots at 0x08000000)") 
                  << std::endl;
    }

    uint32_t getActiveBootAddress() const {
        // Hardware address decoder remaps base vector
        return bfb2HardwareRemapBit ? bank2BaseAddr : bank1BaseAddr;
    }
};

int main() {
    std::cout << "--- DAY 46 PART 1: DUAL-BANK FLASH & RWW DEMONSTRATION ---" << std::endl;
    DualBankController flash(0x08000000, 0x08080000, 512 * 1024);

    std::cout << "Initial Active Boot Address: 0x" << std::hex << flash.getActiveBootAddress() << std::endl;
    
    // Simulate streaming 3 packets into Bank 2 while executing in Bank 1
    flash.simulateRWWStreaming(0x0000, 1024);
    flash.simulateRWWStreaming(0x0400, 1024);
    flash.simulateRWWStreaming(0x0800, 1024);

    // Swap banks atomically via Option Byte
    flash.toggleBfb2Remap();
    std::cout << "Post-Swap Active Boot Address: 0x" << std::hex << flash.getActiveBootAddress() << std::endl;
    return 0;
}
""",
            "output": """--- DAY 46 PART 1: DUAL-BANK FLASH & RWW DEMONSTRATION ---
Initial Active Boot Address: 0x8000000
[RWW-ACTIVE] CPU fetching from Bank 1 (0x8000000) while writing 1024 bytes to Bank 2 at offset 0x0
[RWW-ACTIVE] CPU fetching from Bank 1 (0x8000000) while writing 1024 bytes to Bank 2 at offset 0x400
[RWW-ACTIVE] CPU fetching from Bank 1 (0x8000000) while writing 1024 bytes to Bank 2 at offset 0x800
[OPTION-BYTE] Toggled BFB2 hardware remap bit to: 1 (Bank 2 Boots at 0x08000000)
Post-Swap Active Boot Address: 0x8080000
""",
            "codeNotes": [
                {
                    "line": 15,
                    "note": "bfb2HardwareRemapBit models silicon Option Byte that dynamically swaps Flash bank address decoding."
                },
                {
                    "line": 23,
                    "note": "simulateRWWStreaming demonstrates Read-While-Write execution without CPU execution stalls."
                },
                {
                    "line": 48,
                    "note": "Post-swap boot address shifts to secondary bank in a single atomic configuration cycle."
                }
            ],
            "tryIt": "Explain how Read-While-Write prevents high-speed industrial motor control loops from failing during over-the-air firmware updates.",
            "check": {
                "question": "What is the primary operational advantage of physical Dual-Bank Flash over Single-Bank Flash during FOTA?",
                "options": [
                    "It permits Read-While-Write (RWW) execution so the CPU continues running real-time tasks from Bank 1 while programming Bank 2, followed by an instantaneous hardware bank remap.",
                    "It doubles the clock frequency of the ARM Cortex-M processor.",
                    "It converts Flash memory into static RAM permanently.",
                    "It eliminates the need for a power supply during programming."
                ],
                "answer": 0,
                "why": "Dual-Bank Flash features electrically isolated memory arrays with separate charge pumps, enabling continuous code execution in Bank 1 while erasing and programming Bank 2 in the background."
            }
        },
        {
            "title": "Single-Bank Dual-Slot 'Ping-Pong' Topologies & Vector Table Relocation",
            "say": [
                "While physical Dual-Bank Flash provides the ideal hardware architecture, many cost-sensitive mass-market IoT microcontrollers (such as Nordic nRF52840, ESP32, and basic STM32F4 models) feature single-bank Flash arrays. On these devices, the silicon does not support hardware bank remapping. To implement safe, unbrickable over-the-air updates on single-bank silicon, embedded architects must implement a Dual-Slot 'Ping-Pong' firmware topology managed purely in software.",
                "In a Dual-Slot software architecture, internal or external Flash memory is partitioned into two equal logical slots: Slot 0 (Active Firmware partition) and Slot 1 (Candidate/Staging partition). A lightweight, immutable Stage 1 Secure Bootloader resides at the origin of Flash (0x08000000) and acts as the gatekeeper. Because the processor always boots at 0x08000000, the bootloader reads a non-volatile boot manifest to determine whether Slot 0 or Slot 1 contains the verified operational image.",
                "There are two primary architectural patterns for executing updates in a single-bank dual-slot environment: In-Place Slot Swapping and Out-of-Place Execution. In an In-Place Swapping model (popularized by MCUboot and Zephyr OS), the application is compiled and linked to execute strictly at the fixed address of Slot 0 (e.g., 0x08010000). During a FOTA update, the candidate binary is downloaded into Slot 1. Once verified, the bootloader copies the contents of Slot 1 into Slot 0, sector by sector.",
                "To prevent bricking if power is lost midway through an in-place swap, MCUboot employs a dedicated 'Scratch Partition'. The bootloader copies a 4KB sector from Slot 0 into Scratch, erases the Slot 0 sector, writes the corresponding 4KB sector from Slot 1 into Slot 0, and updates a persistent transaction status marker. This ping-pong sector swapping is repeated across the entire 512KB image. If power fails at any instant, the bootloader inspects the Scratch sector status trailer upon reboot and resumes the interrupted swap without data loss.",
                "The second pattern is Out-of-Place Execution, where the application binary can run directly from either Slot 0 (0x08010000) or Slot 1 (0x08090000). On ARM Cortex-M3/M4/M7/M33 architectures, this is enabled by the System Control Block Vector Table Offset Register (SCB->VTOR). Before jumping to the application, the bootloader configures SCB->VTOR with the base address of the chosen slot (e.g., SCB->VTOR = 0x08090000), loads the initial Main Stack Pointer (MSP) from slot_base[0], and branches to the Reset_Handler at slot_base[1].",
                "However, Out-of-Place execution introduces a critical linking challenge: standard compiled C/C++ machine code contains absolute memory addresses for global variables (.data, .bss) and literal pool references. If a binary linked for 0x08010000 is booted at 0x08090000, any absolute jump or pointer dereference will corrupt memory or crash the processor. To avoid maintaining two separate binary builds (v1_slot0.bin and v1_slot1.bin), the compiler must generate Position-Independent Code (PIC) with a Global Offset Table (GOT), or the bootloader must perform in-place flash swapping.",
                "Additionally, vector table alignment constraints impose strict hardware rules on slot placement. On ARM Cortex-M microcontrollers, the address loaded into SCB->VTOR must be aligned to a power of two that is greater than or equal to the vector table size. Because a standard Cortex-M4 vector table contains 16 core system exceptions and up to 240 external IRQ vectors (256 vectors * 4 bytes = 1024 bytes), SCB->VTOR must be strictly aligned to a minimum 1KB boundary, and in many implementations, aligned to the underlying Flash sector boundary (typically 4KB or 32KB).",
                "If an engineer attempts to set SCB->VTOR to an unaligned offset, the bottom bits of the register are physically hardwired to zero in hardware. The CPU will fetch interrupt vectors from an incorrect, truncated address, resulting in an unrecoverable HardFault the very instant the first peripheral timer or UART interrupt fires.",
                "Furthermore, during the sector-by-sector swap in an in-place architecture, Flash endurance wear must be carefully managed. Copying 512KB of data requires 128 sector erases on 4KB sectors. By utilizing differential update flags, modern bootloaders only erase and rewrite sectors that have actually changed between versions, extending the operational lifespan of internal NOR Flash.",
                "Understanding these trade-offs between Flash wear, copy time, bootloader complexity, and linker constraints is essential for designing resilient embedded systems that balance cost, Flash lifespan, and recovery speed."
            ],
            "example": "An nRF52840 BLE tracker partitions its 1MB Flash into Bootloader (64KB), Slot 0 (448KB), Slot 1 (448KB), and Scratch (64KB). When updating, the candidate image lands in Slot 1 and the bootloader performs an atomic sector-by-sector swap via the Scratch partition.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <string>

struct FlashSlot {
    std::string name;
    uint32_t baseAddress;
    uint32_t sizeBytes;
    bool isBootable;
    std::string versionString;
};

class PingPongBootloader {
private:
    FlashSlot slot0;
    FlashSlot slot1;
    uint32_t scbVtor;

public:
    PingPongBootloader()
        : slot0{"Slot 0 (Active)", 0x08010000, 448 * 1024, true, "v1.4.2"},
          slot1{"Slot 1 (Staging)", 0x08080000, 448 * 1024, false, "v1.5.0-candidate"},
          scbVtor(0x08010000) {}

    void inspectSlots() const {
        std::cout << "[BOOTLOADER] Current Slot Status:" << std::endl;
        std::cout << "  " << slot0.name << " @ 0x" << std::hex << slot0.baseAddress 
                  << " | Ver: " << slot0.versionString << " | Bootable: " << (slot0.isBootable ? "YES" : "NO") << std::endl;
        std::cout << "  " << slot1.name << " @ 0x" << std::hex << slot1.baseAddress 
                  << " | Ver: " << slot1.versionString << " | Bootable: " << (slot1.isBootable ? "YES" : "NO") << std::endl;
        std::cout << "  Active SCB->VTOR Pointer: 0x" << std::hex << scbVtor << std::endl;
    }

    bool activateSlot1Trial() {
        std::cout << "[FOTA-GATE] Cryptographic validation of Slot 1 PASSED." << std::endl;
        std::cout << "[FOTA-GATE] Setting Slot 1 as Active Boot Target (Trial Mode)..." << std::endl;
        slot1.isBootable = true;
        scbVtor = slot1.baseAddress;
        std::cout << "[VTOR-RELOCATE] SCB->VTOR updated to: 0x" << std::hex << scbVtor << std::endl;
        return true;
    }
};

int main() {
    std::cout << "--- DAY 46 PART 2: DUAL-SLOT PING-PONG BOOTLOADER ---" << std::endl;
    PingPongBootloader bl;
    bl.inspectSlots();

    std::cout << "\\n--- Initiating Firmware Activation ---" << std::endl;
    bl.activateSlot1Trial();
    bl.inspectSlots();
    return 0;
}
""",
            "output": """--- DAY 46 PART 2: DUAL-SLOT PING-PONG BOOTLOADER ---
[BOOTLOADER] Current Slot Status:
  Slot 0 (Active) @ 0x8010000 | Ver: v1.4.2 | Bootable: YES
  Slot 1 (Staging) @ 0x8080000 | Ver: v1.5.0-candidate | Bootable: NO
  Active SCB->VTOR Pointer: 0x8010000

--- Initiating Firmware Activation ---
[FOTA-GATE] Cryptographic validation of Slot 1 PASSED.
[FOTA-GATE] Setting Slot 1 as Active Boot Target (Trial Mode)...
[VTOR-RELOCATE] SCB->VTOR updated to: 0x8080000
[BOOTLOADER] Current Slot Status:
  Slot 0 (Active) @ 0x8010000 | Ver: v1.4.2 | Bootable: YES
  Slot 1 (Staging) @ 0x8080000 | Ver: v1.5.0-candidate | Bootable: YES
  Active SCB->VTOR Pointer: 0x8080000
""",
            "codeNotes": [
                {
                    "line": 15,
                    "note": "scbVtor models the ARM Cortex-M Vector Table Offset Register controlling interrupt vector redirection."
                },
                {
                    "line": 34,
                    "note": "activateSlot1Trial redirects SCB->VTOR to Slot 1 base address for out-of-place execution."
                },
                {
                    "line": 48,
                    "note": "Verification ensures that only cryptographically valid images are promoted to active bootable status."
                }
            ],
            "tryIt": "Describe how a 4KB Scratch partition guarantees atomic sector swapping even if DC power is unplugged midway through.",
            "check": {
                "question": "What is the purpose of the ARM Cortex-M SCB->VTOR register in an Out-of-Place dual-slot FOTA architecture?",
                "options": [
                    "It dynamically relocates the processor interrupt vector table address to point directly to the active application slot (e.g., 0x08010000 or 0x08080000).",
                    "It encrypts the communication bus using AES-256 in hardware.",
                    "It measures the battery voltage during firmware downloads.",
                    "It clears the internal SRAM on every instruction fetch."
                ],
                "answer": 0,
                "why": "SCB->VTOR specifies the memory base address where the ARM Cortex-M core looks for exception handlers and interrupt service routines, allowing the bootloader to hand off control cleanly to an application residing in any slot."
            }
        },
        {
            "title": "Flash Partition Manifests, Slot Headers & Image Trailer State Machines",
            "say": [
                "A robust FOTA system requires a rigorous, non-volatile data structure that tracks the lifecycle, integrity, and trial status of every firmware image stored in Flash. Firmware must never be treated as raw, unformatted machine code; instead, every binary must be packaged with a standardized Image Header at its front and an Image Trailer at its terminus.",
                "Let us analyze the industry-standard image encapsulation model defined by MCUboot and enterprise IoT platforms. An application slot begins with a 32-byte or 64-byte Image Header containing: 1) Magic Number (e.g., 0x96F3B83D, identifying a valid MCUboot image); 2) Load Address (the target execution address); 3) Header Size (offset to the vector table); 4) Image Size (exact length of machine code in bytes); 5) Semantic Version (Major, Minor, Revision, Build); and 6) Cryptographic TLV (Type-Length-Value) offset.",
                "Following the compiled machine code, the end of the Flash slot contains the Image Trailer. The trailer is the beating heart of the FOTA state machine because it persists the operational state across sudden power losses, brownouts, and resets. The trailer defines three critical non-volatile fields: Copy Done (indicating whether an in-place swap completed), Image OK (the permanent confirmation bit), and Swap Status (tracking sector-by-sector copy progress).",
                "The FOTA Update State Machine progresses through five formal states: 1) IDLE / COMMITTED: The active firmware is running stably with Image OK = 1. 2) STAGED: A candidate image has been written to Slot 1, its SHA-256 hash verified, and a trial reboot requested. 3) TRIAL BOOT: The bootloader boots the candidate image, but Image OK remains 0 (unconfirmed). The hardware watchdog is armed, and a probation timer begins.",
                "4) TESTING: The application runs its autonomous hardware self-tests. If the application crashes, enters a HardFault, or fails to communicate with onboard sensors, the watchdog resets the MCU. Because Image OK is still 0, the bootloader recognizes the trial failure and automatically rolls back to the previous firmware. 5) CONFIRMED: If all self-tests pass and cloud connectivity is verified, the application executes a Flash write command setting Image OK = 1. The update is now permanent.",
                "The Golden Rule of Flash Trailer Design: Never write multi-byte state indicators that require erasing Flash sectors. Because NOR Flash bits can only be transitioned from 1 to 0 without an erase cycle (erasing resets bits to 1), trailer state transitions must be monotonic bit flips (e.g., 0xFF -> 0xFE -> 0xFC -> 0x00). This ensures state transitions are atomic and immune to power-cut corruption.",
                "In terms of physical layout, the trailer is positioned in the final 256 or 512 bytes of the Flash slot. By aligning the trailer to the very end of the slot sector, the bootloader can rapidly locate the status records without traversing hundreds of kilobytes of code. In MCUboot, the trailer structure reserves specific 8-byte magic sequences: `BOOT_MAGIC` (0x77883900... in binary format) acts as the sentinel confirming that the trailer itself is formatted and valid.",
                "When a candidate image is downloaded, the network agent writes the firmware payload, calculates the SHA-256 digest over the entire image including the TLV metadata, and finally writes the trailer magic with the state set to STAGED (0xFE). If the network connection drops or power fails before the trailer magic is written, the bootloader treats the slot as incomplete and will never attempt to boot the half-written binary.",
                "Furthermore, modern trailers incorporate a 16-bit or 32-bit CRC checksum across the trailer metadata fields. On every power-on reset, the bootloader calculates the CRC over the trailer bytes. If a brownout occurred during the exact microsecond a bit was being cleared, the CRC check flags the corrupted trailer, enabling the bootloader to revert safely to the known-good primary slot.",
                "Designing deterministic Flash headers and monotonic trailer states is what separates brittle hobbyist projects from enterprise-grade industrial control systems that run unattended for decades."
            ],
            "example": "A candidate firmware image in Slot 1 boots in TRIAL mode. The application attempts to connect to the MQTT broker. If the connection fails within 30 seconds, the device reboots without setting Image OK; the bootloader reverts to Slot 0 automatically.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <cstring>

enum class ImageState : uint8_t {
    STATE_UNSET       = 0xFF, // Freshly erased Flash
    STATE_STAGED      = 0xFE, // Binary downloaded & hash verified
    STATE_TRIAL       = 0xFC, // Booted on probation; Image OK = 0
    STATE_CONFIRMED   = 0xF8, // Self-tests passed; Image OK = 1
    STATE_REJECTED    = 0x00  // Self-test failed; mark invalid
};

struct ImageTrailer {
    uint32_t magic;         // 0x96F3B83D
    ImageState state;       // Monotonic bit-flip state
    uint8_t bootAttempts;   // Incremented on each trial boot
    uint16_t crc16;         // Integrity checksum of trailer

    ImageTrailer() : magic(0x96F3B83D), state(ImageState::STATE_UNSET), bootAttempts(0), crc16(0) {}

    void transitionState(ImageState newState) {
        // Enforce Flash NOR rule: bits can only be cleared from 1 to 0
        uint8_t currentRaw = static_cast<uint8_t>(state);
        uint8_t nextRaw = static_cast<uint8_t>(newState);
        
        if ((currentRaw & nextRaw) != nextRaw) {
            std::cout << "[FLASH-ERR] Illegal transition! Flash requires sector erase to flip 0 to 1." << std::endl;
            return;
        }

        state = newState;
        std::cout << "[TRAILER-UPDATE] State transitioned to: 0x" << std::hex << (int)state 
                  << " (" << getStateName() << ")" << std::endl;
    }

    std::string getStateName() const {
        switch (state) {
            case ImageState::STATE_UNSET: return "UNSET (Erased)";
            case ImageState::STATE_STAGED: return "STAGED";
            case ImageState::STATE_TRIAL: return "TRIAL (Probation)";
            case ImageState::STATE_CONFIRMED: return "CONFIRMED (Permanent)";
            case ImageState::STATE_REJECTED: return "REJECTED (Rollback)";
            default: return "CORRUPT";
        }
    }
};

int main() {
    std::cout << "--- DAY 46 PART 3: FLASH TRAILER MONOTONIC STATE MACHINE ---" << std::endl;
    ImageTrailer trailer;
    std::cout << "Initial Trailer State: " << trailer.getStateName() << std::endl;

    // Simulate standard FOTA lifecycle
    trailer.transitionState(ImageState::STATE_STAGED);
    trailer.transitionState(ImageState::STATE_TRIAL);
    trailer.transitionState(ImageState::STATE_CONFIRMED);

    // Attempt illegal transition without erase (flipping 0 back to 1)
    std::cout << "\\nAttempting illegal transition back to STAGED without sector erase:" << std::endl;
    trailer.transitionState(ImageState::STATE_STAGED);
    return 0;
}
""",
            "output": """--- DAY 46 PART 3: FLASH TRAILER MONOTONIC STATE MACHINE ---
Initial Trailer State: UNSET (Erased)
[TRAILER-UPDATE] State transitioned to: 0xfe (STAGED)
[TRAILER-UPDATE] State transitioned to: 0xfc (TRIAL (Probation))
[TRAILER-UPDATE] State transitioned to: 0xf8 (CONFIRMED (Permanent))

Attempting illegal transition back to STAGED without sector erase:
[FLASH-ERR] Illegal transition! Flash requires sector erase to flip 0 to 1.
""",
            "codeNotes": [
                {
                    "line": 7,
                    "note": "ImageState values (0xFF, 0xFE, 0xFC, 0xF8) exploit NOR Flash physics where bits can only transition from 1 to 0."
                },
                {
                    "line": 26,
                    "note": "Bitwise check ((currentRaw & nextRaw) != nextRaw) strictly enforces one-way flash bit programming."
                },
                {
                    "line": 48,
                    "note": "State transitions persist atomic bootloader decisions without requiring risky sector erase operations."
                }
            ],
            "tryIt": "Explain why performing a Flash sector erase during an active bootloader state transition creates a catastrophic power-cut vulnerability.",
            "check": {
                "question": "Why do production embedded bootloaders use monotonic bit-clearing patterns (0xFF -> 0xFE -> 0xFC) for image trailer states?",
                "options": [
                    "Because NOR Flash bits can be programmed from 1 to 0 without erasing, enabling atomic state updates that survive sudden power cuts without data loss.",
                    "Because the ARM processor only understands even numbers.",
                    "Because bit-clearing increases the wireless signal strength.",
                    "Because compilers refuse to link files that contain odd numbers."
                ],
                "answer": 0,
                "why": "Erasing a Flash sector resets all bits to 1 and takes several milliseconds, during which power loss leaves the sector corrupt. Monotonic bit clearing (1 -> 0) is atomic and requires no erase."
            }
        },
        {
            "title": "Linker Script Partitioning & Position-Independent Code (PIC) Trade-offs",
            "say": [
                "When implementing dual-slot firmware architectures, embedded engineers face a fundamental compilation and linking dilemma: where in memory does the binary expect to live? The GNU ARM toolchain (arm-none-eabi-gcc and arm-none-eabi-ld) resolves symbols, function entry points, and literal pools according to the memory boundaries declared in the GNU Linker Script (*.ld).",
                "Consider a standard linker script with a MEMORY definition: FLASH (rx) : ORIGIN = 0x08010000, LENGTH = 448K. When this script is compiled, the linker binds function addresses and branch targets to specific 32-bit values within the 0x08010000 range. If this binary is written into Slot 1 at 0x08090000 and executed directly via SCB->VTOR relocation, absolute calls like BLX 0x08014520 will branch backward into Slot 0 code! If Slot 0 contains old code or an erased partition, the processor immediately executes an invalid instruction and triggers a UsageFault or HardFault.",
                "To resolve this, embedded architects choose between three engineering strategies: 1) Fixed Dual Builds; 2) Position-Independent Code (PIC / PIE); or 3) In-Place Bootloader Sector Swapping.",
                "Strategy 1: Dual Builds (Symmetric Binaries). The engineering team compiles two separate binaries for every firmware release: firmware_slot0.bin (linked for 0x08010000) and firmware_slot1.bin (linked for 0x08090000). The cloud FOTA server inspects device telemetry, determines which slot is currently passive, and serves the corresponding binary. While simple, this strategy doubles cloud storage costs and creates catastrophic risks if a device accidentally downloads the wrong slot binary.",
                "Strategy 2: Position-Independent Code (PIC) and Position-Independent Executables (PIE). Passing the -fPIC and -msingle-pic-base compiler flags instructs GCC to generate PC-relative addressing for all code branches and access all global variables through a Global Offset Table (GOT) referenced by register R9. A single PIC binary can execute identically at 0x08010000 or 0x08090000.",
                "However, PIC incurs significant performance penalties on Cortex-M: 1) Code size expands by 10% to 25% due to GOT indirection; 2) Register R9 is permanently reserved as the GOT pointer, depriving the compiler of an essential general-purpose register and increasing stack spilling; 3) Memory access latency increases for every global variable read.",
                "Strategy 3: In-Place Sector Swapping (The Gold Standard). In this approach, all binaries are permanently linked to execute exclusively at Slot 0 (0x08010000). Slot 1 acts strictly as an inactive staging area. When an update is verified, the bootloader swaps Slot 1 into Slot 0 sector by sector before execution. This eliminates the code bloat and performance penalties of PIC while ensuring cloud distribution requires only a single universal binary.",
                "From a compiler mechanics perspective, let us analyze why PIC code is so costly on ARM Cortex-M. Without PIC, loading the address of a static C buffer compiles into a single instruction: `LDR r0, =buffer_addr`, which the assembler encodes as a PC-relative load from a nearby literal pool. In PIC mode, however, the address cannot be a constant literal. Instead, the compiler must emit: 1) `LDR r1, [r9, #offset_in_got]`; 2) `LDR r0, [r1]`. Every single access to global state, static structures, and C++ vtables requires an additional memory dereference through SRAM.",
                "In high-speed control systems—such as field-oriented control (FOC) motor drivers or high-frequency SPI sensor samplers—this double indirection increases cycle counts by 15% to 30% inside critical inner loops. Furthermore, reserving register R9 starves the register allocator. The ARM Cortex-M architecture possesses only 14 general-purpose registers (R0-R12 and LR). Losing R9 forces the compiler to spill intermediate variables onto the stack much more frequently, dramatically increasing load/store instruction traffic and SRAM bandwidth saturation.",
                "Consequently, the vast majority of commercial IoT platforms (including MCUboot, AWS FreeRTOS OTA, and Azure RTOS) standardize on In-Place Sector Swapping or physical Dual-Bank hardware. They link all binaries to a single fixed execution origin, entirely bypassing the runtime costs of Position-Independent Code."
            ],
            "example": "A drone flight controller requiring sub-microsecond interrupt handling avoids PIC code-bloat and register penalties by linking strictly to 0x08010000 and using bootloader in-place swapping with a 4KB Scratch sector.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

struct LinkerStrategyEvaluation {
    std::string strategyName;
    double codeSizeOverheadPct;
    double executionLatencyPenaltyPct;
    bool cloudComplexityRequiresTwoBinaries;
    bool requiresScratchPartition;
};

void printStrategyMatrix(const std::vector<LinkerStrategyEvaluation>& matrix) {
    std::cout << "[LINKER-ANALYSIS] FOTA Execution Strategy Trade-Off Matrix:" << std::endl;
    for (const auto& s : matrix) {
        std::cout << "  Strategy: " << std::left << std::setw(28) << s.strategyName
                  << " | Size Overhead: " << std::setw(5) << s.codeSizeOverheadPct << "%"
                  << " | Latency Pen: " << std::setw(4) << s.executionLatencyPenaltyPct << "%"
                  << " | Dual Cloud Binaries: " << (s.cloudComplexityRequiresTwoBinaries ? "YES" : "NO ")
                  << " | Scratch Part: " << (s.requiresScratchPartition ? "YES" : "NO ")
                  << std::endl;
    }
}

int main() {
    std::cout << "--- DAY 46 PART 4: LINKER SCRIPT & PIC ARCHITECTURAL TRADE-OFFS ---" << std::endl;
    std::vector<LinkerStrategyEvaluation> matrix = {
        {"Dual Fixed Builds (Slot0/1)", 0.0,  0.0,  true,  false},
        {"Position-Independent Code", 18.5, 12.0, false, false},
        {"In-Place Sector Swapping",    0.0,  0.0,  false, true}
    };

    printStrategyMatrix(matrix);
    return 0;
}
""",
            "output": """--- DAY 46 PART 4: LINKER SCRIPT & PIC ARCHITECTURAL TRADE-OFFS ---
[LINKER-ANALYSIS] FOTA Execution Strategy Trade-Off Matrix:
  Strategy: Dual Fixed Builds (Slot0/1)  | Size Overhead: 0    % | Latency Pen: 0   % | Dual Cloud Binaries: YES | Scratch Part: NO 
  Strategy: Position-Independent Code    | Size Overhead: 18.5 % | Latency Pen: 12  % | Dual Cloud Binaries: NO  | Scratch Part: NO 
  Strategy: In-Place Sector Swapping     | Size Overhead: 0    % | Latency Pen: 0   % | Dual Cloud Binaries: NO  | Scratch Part: YES
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "LinkerStrategyEvaluation encapsulates hardware and deployment metrics across FOTA execution models."
                },
                {
                    "line": 23,
                    "note": "PIC introduces up to 18.5% code size expansion and 12% execution latency due to Global Offset Table (GOT) indirection."
                },
                {
                    "line": 24,
                    "note": "In-Place Sector Swapping achieves 0% code size and latency overhead at the cost of requiring a 4KB Scratch Flash partition."
                }
            ],
            "tryIt": "Explain why dedicating register R9 to the Global Offset Table in ARM PIC mode degrades interrupt response latency.",
            "check": {
                "question": "What is the primary drawback of using Position-Independent Code (-fPIC) on resource-constrained ARM Cortex-M microcontrollers?",
                "options": [
                    "It increases binary size by 10-25% and incurs execution latency by routing memory accesses through a Global Offset Table (GOT) while permanently reserving register R9.",
                    "It prevents the microcontroller from using hardware timers.",
                    "It causes the Flash memory to overheat and lose data.",
                    "It requires the bootloader to be rewritten in assembly every reboot."
                ],
                "answer": 0,
                "why": "PIC forces all global variable dereferences and constant accesses through a Global Offset Table via register R9, increasing code size, memory access overhead, and register pressure on Cortex-M."
            }
        },
        {
            "title": "Industrial Dual-Bank Slot Swapper Engine: Complete Simulation & Verification",
            "say": [
                "To conclude our study of FOTA Topologies, we synthesize our architectural principles into an industrial-grade, zero-brick Dual-Bank Flash Swapper Engine in C++. This production engine encapsulates the complete Flash partition layout, Option Byte hardware remapping, image header parsing, and trailer lifecycle tracking.",
                "Let us walk through the five operational phases executed by our engine: 1) Partition Initialization: The engine establishes physical memory boundaries for Bootloader (0x08000000, 32KB), Active Bank 1 (0x08008000, 480KB), Secondary Bank 2 (0x08080000, 480KB), and Shared Metadata (0x080FE000, 8KB).",
                "2) Read-While-Write Ingestion: As candidate firmware packets stream in from the network interface, the engine writes them directly into the inactive bank without halting application execution. 3) Cryptographic Pre-Flight Verification: Before modifying any hardware Option Bytes or boot flags, the engine verifies the image magic (0x96F3B83D), image size, and simulated SHA-256 digest against the signed manifest.",
                "4) Atomic Option Byte Remapping: Upon successful verification, the engine triggers the hardware BFB2 Option Byte flip. The active boot vector instantaneously shifts to the secondary bank. 5) Probation Trial & Confirmation: The engine marks the new bank as TRIAL (0xFC). The candidate application boots under probation. Once it verifies hardware peripherals, it flips the confirmation bit to COMMITTED (0xF8). If an error occurs, the engine rolls back BFB2 to the previous known-good bank.",
                "Notice the fault-resilient invariants embedded into this architecture: At no point during the ingestion or verification phase is the active running firmware modified or threatened. If power is severed at any microsecond during the 45-minute cellular download, Bank 1 remains 100% operational and boots normally upon power restoration.",
                "Furthermore, if the downloaded firmware is corrupt or malicious, cryptographic pre-flight checks reject it before the Option Bytes are touched. And if the binary passes cryptographic checks but crashes upon booting, the trial probation state detects the watchdog reset and rolls back the Option Bytes automatically.",
                "Let us analyze the Option Byte programming sequence in silicon. Option Bytes are stored in dedicated non-volatile configuration Flash registers. To modify them, the firmware must execute a strict cryptographic unlock sequence: writing KEY1 (0x45670123) followed by KEY2 (0xCDEF89AB) to the Flash Option Key Register (FLASH->OPTKEYR). Only then does the silicon permit writing to the Option Control Register (FLASH->OPTCR).",
                "Once the BFB2 bit is toggled in FLASH->OPTCR, the firmware sets the Option Start bit (OPTSTRT). The internal state machine programs the silicon latches. Crucially, in STM32 microcontrollers, Option Byte changes do not take effect until an Option Byte Reload (OBL) event is triggered, or the MCU executes a software system reset (NVIC_SystemReset). This two-step process guarantees that address remapping occurs cleanly during core reset, preventing any mid-instruction execution hazard.",
                "In the event that the candidate firmware boots but experiences a watchdog timeout or a HardFault during its initial startup window, the hardware reset vector directs execution back to the Bootloader. The bootloader inspects the trailer state: finding 0xFC (TRIAL) instead of 0xF8 (COMMITTED), it increments a boot failure counter. If failures exceed the threshold (typically 1 or 2), the bootloader unlocks FLASH->OPTKEYR, clears the BFB2 bit, and resets again, restoring Bank 1 with zero data corruption.",
                "To prevent wear leveling issues in metadata Flash sectors, enterprise bootloaders place the shared metadata trailer in a dedicated, ping-pong dual-sector configuration. Each metadata record contains a 32-bit monotonically incrementing sequence number, a timestamp, active bank identifier, and an integrity CRC-32. On boot, the bootloader reads both sectors, selects the record with the highest valid sequence number, and proceeds with deterministic bank assignment.",
                "This guarantees that even if a catastrophic power brownout corrupts the active metadata sector during a write, the previous sector remains completely intact with its valid CRC-32, providing seamless recovery without user intervention.",
                "By mastering physical Dual-Bank Flash topologies, monotonic Flash trailer states, and atomic Option Byte remapping, you have acquired the foundational engineering discipline required to deploy firmware updates to millions of devices across the globe with zero risk of bricking."
            ],
            "example": "An industrial IoT gateway running v2.1.0 streams v2.2.0 into Bank 2. After pre-flight SHA-256 verification passes, the swapper flips BFB2, reboots into v2.2.0 in TRIAL mode, validates the cellular modem, and commits the image permanently.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <string>

struct FotaManifest {
    uint32_t magic;
    uint32_t imageSizeBytes;
    uint32_t expectedHash;
    std::string versionString;
};

class DualBankFotaEngine {
private:
    uint32_t bank1Addr;
    uint32_t bank2Addr;
    bool bfb2RemapBit;
    uint8_t imageTrailerState; // 0xFF=Unset, 0xFE=Staged, 0xFC=Trial, 0xF8=Committed

public:
    DualBankFotaEngine(uint32_t b1, uint32_t b2)
        : bank1Addr(b1), bank2Addr(b2), bfb2RemapBit(false), imageTrailerState(0xFF) {}

    bool ingestAndVerify(const FotaManifest& manifest, uint32_t actualDownloadedHash) {
        std::cout << "[FOTA-INGEST] Streaming " << manifest.versionString 
                  << " (" << manifest.imageSizeBytes << " bytes) into Passive Bank..." << std::endl;
        
        if (manifest.magic != 0x96F3B83D) {
            std::cout << "[FOTA-REJECT] Invalid Magic: 0x" << std::hex << manifest.magic << std::endl;
            return false;
        }

        std::cout << "[FOTA-VERIFY] Checking SHA-256 digest: Expected 0x" << std::hex << manifest.expectedHash
                  << " | Computed 0x" << actualDownloadedHash << std::endl;
        
        if (manifest.expectedHash != actualDownloadedHash) {
            std::cout << "[FOTA-REJECT] Hash mismatch! Downloaded image is corrupted." << std::endl;
            return false;
        }

        imageTrailerState = 0xFE; // STAGED
        std::cout << "[FOTA-SUCCESS] Verification PASSED. Image Staged in Secondary Bank." << std::endl;
        return true;
    }

    void executeAtomicBankSwap() {
        std::cout << "[FOTA-SWAP] Executing atomic Option Byte BFB2 toggle..." << std::endl;
        bfb2RemapBit = !bfb2RemapBit;
        imageTrailerState = 0xFC; // TRIAL mode
        std::cout << "  -> Hardware BFB2 set to: " << (bfb2RemapBit ? "BANK 2" : "BANK 1") << std::endl;
        std::cout << "  -> Active Execution Vector: 0x" << std::hex 
                  << (bfb2RemapBit ? bank2Addr : bank1Addr) << std::endl;
        std::cout << "  -> Boot Mode: TRIAL PROBATION (Watchdog Armed)" << std::endl;
    }

    void commitFirmware() {
        if (imageTrailerState == 0xFC) {
            imageTrailerState = 0xF8; // COMMITTED
            std::cout << "[FOTA-COMMIT] Canary self-tests PASSED. Image permanently COMMITTED (0xF8)!" << std::endl;
        }
    }
};

int main() {
    std::cout << "--- DAY 46 PART 5: INDUSTRIAL DUAL-BANK FOTA SWAPPER ENGINE ---" << std::endl;
    DualBankFotaEngine engine(0x08008000, 0x08080000);

    FotaManifest validManifest{0x96F3B83D, 245760, 0x5A8E12CD, "v2.2.0-Production"};
    
    // Ingest and verify candidate firmware
    if (engine.ingestAndVerify(validManifest, 0x5A8E12CD)) {
        engine.executeAtomicBankSwap();
        // Candidate boots under probation, executes canary self-tests, and commits
        engine.commitFirmware();
    }
    return 0;
}
""",
            "output": """--- DAY 46 PART 5: INDUSTRIAL DUAL-BANK FOTA SWAPPER ENGINE ---
[FOTA-INGEST] Streaming v2.2.0-Production (245760 bytes) into Passive Bank...
[FOTA-VERIFY] Checking SHA-256 digest: Expected 0x5a8e12cd | Computed 0x5a8e12cd
[FOTA-SUCCESS] Verification PASSED. Image Staged in Secondary Bank.
[FOTA-SWAP] Executing atomic Option Byte BFB2 toggle...
  -> Hardware BFB2 set to: BANK 2
  -> Active Execution Vector: 0x8080000
  -> Boot Mode: TRIAL PROBATION (Watchdog Armed)
[FOTA-COMMIT] Canary self-tests PASSED. Image permanently COMMITTED (0xF8)!
""",
            "codeNotes": [
                {
                    "line": 21,
                    "note": "ingestAndVerify enforces pre-flight validation before modifying Option Bytes or boot flags."
                },
                {
                    "line": 40,
                    "note": "executeAtomicBankSwap toggles hardware BFB2 remap and arms watchdog under TRIAL probation."
                },
                {
                    "line": 49,
                    "note": "commitFirmware transitions trailer state monotonically to 0xF8 only after canary self-tests pass."
                }
            ],
            "tryIt": "Describe how the engine behaves if power is severed during the exact millisecond between executeAtomicBankSwap and commitFirmware.",
            "check": {
                "question": "What happens if a device running in TRIAL probation mode (0xFC) experiences a watchdog reset before executing commitFirmware()?",
                "options": [
                    "The bootloader detects that the image was never confirmed (state is 0xFC, not 0xF8), rolls back the Option Byte BFB2 bit, and safely boots the previous known-good firmware in Bank 1.",
                    "The microcontroller permanently erases all Flash memory.",
                    "The device enters DFU mode and waits for a USB connection.",
                    "The processor increases its operating voltage to overcome the crash."
                ],
                "answer": 0,
                "why": "The trial probation mechanism guarantees that if a new firmware binary crashes or freezes before confirming health, the bootloader automatically reverts the swap and restores the stable baseline firmware."
            }
        }
    ],
    "summary": [
        "Physical Dual-Bank Flash divides internal silicon into two independent memory arrays, enabling Read-While-Write (RWW) operation and instantaneous hardware bank swapping via the BFB2 Option Byte.",
        "Single-Bank Dual-Slot architectures utilize software-managed ping-pong slots (Slot 0 and Slot 1) and vector table offset relocation (SCB->VTOR), requiring atomic sector swapping via a Scratch partition.",
        "Image trailers utilize monotonic bit-clearing state machines (0xFF -> 0xFE -> 0xFC -> 0xF8) that survive sudden power cuts without requiring risky Flash sector erases.",
        "Position-Independent Code (-fPIC) allows execution from any address but incurs 10-25% code size expansion and register R9 reservation, making in-place sector swapping the preferred embedded standard.",
        "A zero-brick FOTA engine enforces pre-flight cryptographic verification, atomic Option Byte bank toggling, and probationary trial boots with automatic rollback on watchdog timeouts."
    ],
    "projectStep": {
        "title": "Configuring Dual-Bank Flash & Partition Maps in Linker Scripts",
        "steps": [
            "Partition the internal 1MB Flash memory into Bootloader (32KB), Bank 1 (480KB), Bank 2 (480KB), and Shared Metadata (32KB).",
            "Configure the ARM Cortex-M Vector Table Offset Register (SCB->VTOR) to dynamically track active partition origins.",
            "Implement monotonic trailer state transition functions in C++ adhering strictly to NOR Flash 1-to-0 bit-clearing physics.",
            "Simulate an unexpected power cut during trial probation and verify that the bootloader cleanly rolls back the BFB2 Option Byte."
        ]
    }
}

with open('scripts/iot_emb_day46.json', 'w', encoding='utf-8') as f:
    json.dump(day46, f, indent=2)
print("Wrote scripts/iot_emb_day46.json successfully!")
