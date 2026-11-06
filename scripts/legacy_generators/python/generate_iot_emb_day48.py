import json

day48 = {
    "day": 48,
    "title": "Resilient Recovery & Watchdog Rollbacks: Self-Testing Firmware & Golden Image Safety",
    "goal": "Guarantee that an updated device never remains trapped in a crash loop: master Resilient Recovery, Autonomous Canary Self-Testing, and Golden Image Safety. Design the complete Self-Testing Verification Harness: upon booting an unconfirmed candidate firmware in trial mode, the application must autonomously verify internal peripherals (internal temperature sensors, Flash filesystems, I2C/SPI sensors, radio networking stack) within a 10-second probation countdown before committing the permanent confirmation bit. Master independent hardware watchdog timers (IWDG) to catch lockups during trial boots, crash-loop detection counters in battery-backed RTC / Flash trailers, and immutable read-only factory Golden Image fallbacks burned in write-protected Flash sectors.",
    "minutes": 38,
    "recap": "In Day 46 and Day 47, we engineered Dual-Bank Flash topologies and ultra-compact differential delta patches. Today, we architect the runtime survival mechanism: self-testing canary harnesses, crash loop counters, and immutable golden image fallbacks.",
    "parts": [
        {
            "title": "The Trial Boot Probation Window: Why Signatures Alone Are Not Enough",
            "say": [
                "A dangerous misconception held by novice embedded engineers is that if an over-the-air firmware binary passes cryptographic SHA-256 and ECDSA signature checks, it is completely safe to run permanently. In reality, cryptographic signature verification provides only mathematical proof of two things: authenticity (the binary originated from the authorized private signing key) and integrity (not a single byte was corrupted in transit).",
                "Signatures provide zero guarantees regarding operational correctness, silicon compatibility, runtime stability, or logical bugs. A firmware binary can be 100% cryptographically authentic and signed by the Chief Technology Officer, yet still contain a catastrophic bug: a null-pointer dereference in an I2C sensor driver, a heap memory exhaustion bug in the TLS stack, or a clock tree misconfiguration that freezes the CPU three seconds after boot.",
                "If a bootloader blindly marks a newly downloaded image as permanently active before verifying that it can actually boot and execute reliably, the microcontroller will enter a permanent, unrecoverable crash loop. Every time the processor resets, the flawed application boots, crashes, triggers a reset, and crashes again forever. In the field, this turns thousands of smart energy meters, industrial telemetry nodes, or medical devices into useless silicon bricks.",
                "To eliminate crash loops, production-grade embedded systems implement a Probationary Trial Boot architecture. When a new firmware candidate is staged, the bootloader boots it in a temporary, unconfirmed 'Probation' state. Under probation, the image is on trial: the hardware independent watchdog is armed with a tight timeout, and a probation countdown timer (typically 10 to 30 seconds) begins running.",
                "During this probation window, the application must autonomously prove that it is fully operational. If the application crashes, enters a HardFault, or hangs, the watchdog resets the MCU. Because the image was never confirmed, the bootloader recognizes the trial failure on the subsequent boot and automatically reverts the boot pointer to the known-good previous firmware.",
                "Only when the candidate firmware has successfully initialized its hardware peripherals, verified communication with onboard sensors, and transmitted a successful 'Canary Heartbeat' packet to the cloud broker does the application execute the permanent confirmation command (setting the Image OK flag in the Flash trailer).",
                "From an architectural standpoint, the confirmation window must be carefully calibrated to balance safety and responsiveness. If the probation window is too short (e.g., 500 milliseconds), the application might confirm health before the cellular modem has finished network registration, missing a latent networking bug. Conversely, if the probation window is too long (e.g., 10 minutes), an unstable device could drain its emergency battery while repeatedly crash-looping.",
                "In industrial telemetry and automotive ECUs, engineers typically partition the probation verification into two distinct phases: 1) Critical Hardware Smoke Test (0 to 3 seconds), verifying power rails, clock trees, and internal RAM integrity; and 2) Functional Cloud Canary Verification (3 to 20 seconds), confirming network stack handshake and bidirectional MQTT ping-pong response.",
                "If any test fails during either phase, the application must never attempt to mask the error or suppress the watchdog. It must deliberately allow the watchdog to expire or trigger a software reset with a failure reason code, handing control back to the bootloader's automated rollback logic.",
                "Additionally, power supply brownout conditions must be actively monitored throughout the probation countdown. If an influx of radio transmission current causes the core voltage to dip near the brownout reset (BOR) threshold, the application must recognize this electrical strain and delay the confirmation until the battery voltage stabilizes.",
                "Furthermore, within a multi-threaded FreeRTOS environment, the trial probation monitor must gather health tokens from every spawned task. If the sensor thread and communication thread report healthy status but the data logging thread has blocked on a mutex, the supervisor refuses to issue the confirmation bit, guaranteeing holistic system qualification.",
                "Understanding the fundamental distinction between cryptographic authenticity and operational health is the bedrock of resilient firmware engineering."
            ],
            "example": "A smart thermostat boots a newly signed firmware update. Within 2 seconds, an unhandled I2C bus error triggers a HardFault. Because the firmware was in Trial Probation, the hardware watchdog trips, the bootloader increments the boot failure counter, and immediately reverts to the previous working firmware.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <string>

enum class BootMode : uint8_t {
    NORMAL_COMMITTED = 0,
    TRIAL_PROBATION  = 1,
    ROLLBACK_REVERT  = 2
};

struct FirmwareImageState {
    std::string version;
    bool isConfirmed;       // Image OK bit
    uint8_t probationTimerSec;
    BootMode activeBootMode;
};

class TrialBootManager {
private:
    FirmwareImageState candidate;
    FirmwareImageState backup;

public:
    TrialBootManager()
        : candidate{"v2.4.0-candidate", false, 10, BootMode::TRIAL_PROBATION},
          backup{"v2.3.1-stable", true, 0, BootMode::NORMAL_COMMITTED} {}

    void simulateProbationLifecycle(bool simulateHardFaultCrash) {
        std::cout << "[BOOT] Starting image in mode: " 
                  << (candidate.activeBootMode == BootMode::TRIAL_PROBATION ? "TRIAL PROBATION" : "COMMITTED") 
                  << " | Version: " << candidate.version << std::endl;
        std::cout << "  -> Hardware Watchdog Armed: 10-second timeout active." << std::endl;

        if (simulateHardFaultCrash) {
            std::cout << "  -> [FATAL ERROR] HardFault detected in sensor task at t=3s!" << std::endl;
            std::cout << "  -> Application halted. Watchdog expired. Triggering system reset..." << std::endl;
            handleWatchdogResetRecovery();
        } else {
            std::cout << "  -> t=4s: All hardware peripherals initialized successfully." << std::endl;
            std::cout << "  -> t=8s: Canary Heartbeat acknowledged by Cloud MQTT broker." << std::endl;
            confirmCandidateFirmware();
        }
    }

    void handleWatchdogResetRecovery() {
        std::cout << "[BOOTLOADER-ROLLBACK] Post-reset evaluation:" << std::endl;
        std::cout << "  Candidate Image OK: " << (candidate.isConfirmed ? "YES" : "NO (Unconfirmed)") << std::endl;
        std::cout << "  -> [ACTION] Reverting boot pointer to Backup: " << backup.version << std::endl;
        candidate.activeBootMode = BootMode::ROLLBACK_REVERT;
        std::cout << "  -> [RESTORED] System running stably on known-good baseline!" << std::endl;
    }

    void confirmCandidateFirmware() {
        candidate.isConfirmed = true;
        candidate.activeBootMode = BootMode::NORMAL_COMMITTED;
        std::cout << "[FIRMWARE-COMMIT] Permanent confirmation bit (Image OK) written to Flash trailer!" << std::endl;
        std::cout << "  -> Firmware " << candidate.version << " promoted to PERMANENT ACTIVE." << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 48 PART 1: TRIAL BOOT PROBATION & ROLLBACK ---" << std::endl;
    TrialBootManager manager;

    std::cout << "\\nScenario A: Candidate Firmware Crashes on Boot (Fault Injected):" << std::endl;
    manager.simulateProbationLifecycle(true);

    std::cout << "\\nScenario B: Candidate Firmware Passes All Checks:" << std::endl;
    TrialBootManager manager2;
    manager2.simulateProbationLifecycle(false);
    return 0;
}
""",
            "output": """--- DAY 48 PART 1: TRIAL BOOT PROBATION & ROLLBACK ---

Scenario A: Candidate Firmware Crashes on Boot (Fault Injected):
[BOOT] Starting image in mode: TRIAL PROBATION | Version: v2.4.0-candidate
  -> Hardware Watchdog Armed: 10-second timeout active.
  -> [FATAL ERROR] HardFault detected in sensor task at t=3s!
  -> Application halted. Watchdog expired. Triggering system reset...
[BOOTLOADER-ROLLBACK] Post-reset evaluation:
  Candidate Image OK: NO (Unconfirmed)
  -> [ACTION] Reverting boot pointer to Backup: v2.3.1-stable
  -> [RESTORED] System running stably on known-good baseline!

Scenario B: Candidate Firmware Passes All Checks:
[BOOT] Starting image in mode: TRIAL PROBATION | Version: v2.4.0-candidate
  -> Hardware Watchdog Armed: 10-second timeout active.
  -> t=4s: All hardware peripherals initialized successfully.
  -> t=8s: Canary Heartbeat acknowledged by Cloud MQTT broker.
[FIRMWARE-COMMIT] Permanent confirmation bit (Image OK) written to Flash trailer!
  -> Firmware v2.4.0-candidate promoted to PERMANENT ACTIVE.
""",
            "codeNotes": [
                {
                    "line": 7,
                    "note": "BootMode tracks whether the active binary is running under temporary probation or permanent commitment."
                },
                {
                    "line": 34,
                    "note": "Watchdog reset during probation triggers automatic rollback because isConfirmed remains false."
                },
                {
                    "line": 49,
                    "note": "confirmCandidateFirmware writes Image OK bit to Flash trailer only after canary health checks pass."
                }
            ],
            "tryIt": "Describe how a battery-operated water meter configures its trial probation window when the cellular radio takes up to 45 seconds to attach to a cell tower.",
            "check": {
                "question": "Why is cryptographic signature verification alone insufficient to guarantee that a new firmware image is safe to run?",
                "options": [
                    "Because signature verification proves authenticity and integrity, but cannot detect logical bugs, null pointers, or hardware incompatibilities that cause runtime crash loops.",
                    "Because signatures expire after 24 hours in Flash memory.",
                    "Because public key cryptography only works in cloud data centers.",
                    "Because signing keys are erased whenever a device reboots."
                ],
                "answer": 0,
                "why": "A firmware binary can be authentic and signed by the OEM, yet still contain a runtime crash or memory bug that hangs the MCU. Only runtime probation and autonomous self-testing can verify operational stability."
            }
        },
        {
            "title": "Autonomous Canary Hardware Self-Testing Suite",
            "say": [
                "To ensure that an updated device does not confirm a malfunctioning firmware binary, modern embedded software architectures incorporate an Autonomous Canary Hardware Self-Testing Suite. This suite is a modular, deterministic testing harness executed by the application immediately upon boot before the main business logic and supervisory loops commence.",
                "The Canary Suite is not a simple unit test; it is an integrated hardware qualification harness that exercises physical silicon peripherals, external serial buses, non-volatile storage, and communication interfaces. The harness tests four fundamental pillars: 1) Memory & Flash Filesystems; 2) Bus Peripherals & Power Rails; 3) Internal Sensors & RTC; and 4) Network Stack & Cloud Handshake.",
                "Pillar 1: Memory & Filesystem Integrity. The canary harness performs a non-destructive walking-ones and walking-zeros test across dynamic SRAM buffers. It then mounts the on-board SPI/QSPI NOR Flash filesystem (such as LittleFS), creates a temporary test file, writes a known pseudo-random pattern, flushes the write cache, reads back the file, verifies data integrity against a CRC-32 checksum, and deletes the test file. This verifies that Flash SPI timings, DMA channels, and file allocation tables are 100% operational.",
                "Pillar 2: Hardware Bus & Sensor Verification. The harness probes internal I2C and SPI buses for essential sensors. For example, in an industrial motor monitor, it reads the WHO_AM_I device identification registers of the tri-axis accelerometer, gyroscope, and pressure transducer. It verifies that returned register IDs match expected silicon values (e.g., 0x6A for LSM6DSO) and validates that sensor analog voltage rails are within +/- 5% of nominal specifications.",
                "Pillar 3: Clock Tree & Internal Telemetry. The canary suite verifies that the Phase-Locked Loop (PLL) is locked to the external high-speed crystal oscillator (HSE) and has not fallen back to the low-accuracy internal RC oscillator (HSI). It reads the internal MCU temperature sensor and ADC bandgap voltage reference (VREFINT) to guarantee operating temperatures are within safe operating limits.",
                "Pillar 4: Network & Cloud Canary Heartbeat. Finally, the harness powers up the radio modem (Wi-Fi, LTE-M, or LoRaWAN), initiates TLS session negotiation with the cloud gateway, and publishes a specialized telemetry message: the 'Canary Boot Report'. The report includes the firmware git commit hash, bootloader version, self-test execution time, and heap memory headroom.",
                "Only when the cloud MQTT broker returns an acknowledgment (PUBACK) within the probation deadline does the Canary Suite issue the verdict: VERDICT_PASSED. The application then writes the permanent confirmation bit to the Flash trailer and proceeds to normal operations.",
                "If any single test in the canary suite fails—for example, if an unhandled LittleFS filesystem corruption prevents mounting, or if the I2C bus hangs due to a missing pull-up resistor configuration in the new GPIO pin multiplexing table—the canary test runner immediately halts.",
                "Instead of allowing the system to operate in a degraded or unsafe state, the runner writes a diagnostic failure record into the non-volatile crash trailer and triggers a software reset (NVIC_SystemReset). On the subsequent boot, the bootloader reads the failure record and reverts to the golden or backup firmware.",
                "In high-speed communication systems, the canary suite also stresses the Direct Memory Access (DMA) controllers. It dispatches a test loopback transfer between two UART channels or an internal memory-to-memory DMA stream, verifying that interrupt flags and buffer transfer complete (TC) events fire deterministically without bus arbitration errors.",
                "Furthermore, the analog power domain is verified by measuring the onboard low-dropout (LDO) regulator outputs via internal ADC channels. If an unexpected circuit board revision has altered the feedback divider resistor values, the canary suite catches the out-of-range voltage before sensitive RF front-end components can suffer electrical overstress.",
                "This rigorous self-testing invariant ensures that a bad firmware release is quarantined and rolled back autonomously without human intervention."
            ],
            "example": "During trial boot of v3.1.0, the canary harness attempts to mount LittleFS on external SPI Flash. The mount fails due to an incompatible superblock format. The canary suite immediately logs ERR_FS_MOUNT_FAIL and resets the MCU, triggering an automatic rollback to v3.0.0.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <string>

enum class CanaryTestStatus : uint8_t {
    NOT_RUN = 0,
    PASSED  = 1,
    FAILED  = 2
};

struct CanaryTestItem {
    std::string testName;
    CanaryTestStatus status;
    uint32_t executionTimeMs;
    std::string details;
};

class CanarySelfTestHarness {
private:
    std::vector<CanaryTestItem> tests;

public:
    CanarySelfTestHarness() {
        tests = {
            {"SRAM Walking Pattern & Heap Integrity", CanaryTestStatus::NOT_RUN, 0, ""},
            {"LittleFS Flash Filesystem Mount & RW", CanaryTestStatus::NOT_RUN, 0, ""},
            {"I2C Bus Sensor Probing (WHO_AM_I)",    CanaryTestStatus::NOT_RUN, 0, ""},
            {"Internal Bandgap ADC & Core Temp",     CanaryTestStatus::NOT_RUN, 0, ""},
            {"MQTT Cloud Canary Heartbeat Handshake", CanaryTestStatus::NOT_RUN, 0, ""}
        };
    }

    bool executeAllTests(bool injectSensorBusHang) {
        std::cout << "[CANARY-HARNESS] Executing Autonomous Hardware Qualification Suite..." << std::endl;
        
        for (size_t i = 0; i < tests.size(); ++i) {
            auto& t = tests[i];
            
            // Simulate sensor failure if injected
            if (i == 2 && injectSensorBusHang) {
                t.status = CanaryTestStatus::FAILED;
                t.executionTimeMs = 120;
                t.details = "I2C SDA line held low by slave; Bus Timeout!";
                std::cout << "  -> [FAIL] " << t.testName << " (" << t.executionTimeMs << "ms): " << t.details << std::endl;
                return false; // Abort self-tests on critical failure
            }

            t.status = CanaryTestStatus::PASSED;
            t.executionTimeMs = 15 + (i * 20);
            t.details = "Nominal OK";
            std::cout << "  -> [PASS] " << std::left << std::setw(40) << t.testName 
                      << " (" << std::setw(3) << t.executionTimeMs << "ms): " << t.details << std::endl;
        }

        std::cout << "[CANARY-HARNESS] All 5 hardware qualification tests PASSED cleanly!" << std::endl;
        return true;
    }
};

int main() {
    std::cout << "--- DAY 48 PART 2: AUTONOMOUS CANARY HARDWARE SELF-TEST SUITE ---" << std::endl;
    
    std::cout << "\\nRun 1: Hardware Qualification with Injected Sensor Bus Fault:" << std::endl;
    CanarySelfTestHarness harness1;
    bool pass1 = harness1.executeAllTests(true);
    std::cout << "Verdict: " << (pass1 ? "PROCEED TO CONFIRM" : "ABORT & TRIGGER ROLLBACK") << std::endl;

    std::cout << "\\nRun 2: Healthy Hardware Qualification Suite:" << std::endl;
    CanarySelfTestHarness harness2;
    bool pass2 = harness2.executeAllTests(false);
    std::cout << "Verdict: " << (pass2 ? "PROCEED TO CONFIRM" : "ABORT & TRIGGER ROLLBACK") << std::endl;
    return 0;
}
""",
            "output": """--- DAY 48 PART 2: AUTONOMOUS CANARY HARDWARE SELF-TEST SUITE ---

Run 1: Hardware Qualification with Injected Sensor Bus Fault:
[CANARY-HARNESS] Executing Autonomous Hardware Qualification Suite...
  -> [PASS] SRAM Walking Pattern & Heap Integrity    ( 15ms): Nominal OK
  -> [PASS] LittleFS Flash Filesystem Mount & RW     ( 35ms): Nominal OK
  -> [FAIL] I2C Bus Sensor Probing (WHO_AM_I) (120ms): I2C SDA line held low by slave; Bus Timeout!
Verdict: ABORT & TRIGGER ROLLBACK

Run 2: Healthy Hardware Qualification Suite:
[CANARY-HARNESS] Executing Autonomous Hardware Qualification Suite...
  -> [PASS] SRAM Walking Pattern & Heap Integrity    ( 15ms): Nominal OK
  -> [PASS] LittleFS Flash Filesystem Mount & RW     ( 35ms): Nominal OK
  -> [PASS] I2C Bus Sensor Probing (WHO_AM_I)        ( 55ms): Nominal OK
  -> [PASS] Internal Bandgap ADC & Core Temp         ( 75ms): Nominal OK
  -> [PASS] MQTT Cloud Canary Heartbeat Handshake    ( 95ms): Nominal OK
[CANARY-HARNESS] All 5 hardware qualification tests PASSED cleanly!
Verdict: PROCEED TO CONFIRM
""",
            "codeNotes": [
                {
                    "line": 7,
                    "note": "CanaryTestStatus enumerates test outcomes for automated diagnostic logging."
                },
                {
                    "line": 39,
                    "note": "A single peripheral test failure immediately halts execution and returns false to prevent false confirmation."
                },
                {
                    "line": 50,
                    "note": "Confirmation bit is only written when all hardware subsystems and network handshake pass cleanly."
                }
            ],
            "tryIt": "Explain why the Canary Heartbeat packet must be acknowledged (PUBACK) by the cloud rather than merely transmitted by the modem.",
            "check": {
                "question": "What is the primary role of an Autonomous Canary Hardware Self-Testing Suite in production firmware updates?",
                "options": [
                    "To rigorously qualify physical peripherals, memory, and cloud communications upon boot, aborting and triggering a rollback before the confirmation bit is written if any subsystem fails.",
                    "To generate random encryption keys for user authentication.",
                    "To reformat the internal Flash memory on every boot.",
                    "To measure the processor clock frequency and double it."
                ],
                "answer": 0,
                "why": "The Canary Self-Test Suite guarantees that a newly booted firmware image is verified operational across all physical subsystems before the bootloader permanently commits the image."
            }
        },
        {
            "title": "Non-Volatile Boot Records & Crash Loop Counters",
            "say": [
                "When a microcontroller experiences an unexpected reset, the volatile CPU registers (R0-R12, SP, PC, LR) and general-purpose SRAM contents are either erased or placed in an indeterminate state. If a system is caught in a rapid reboot cycle, how does the bootloader know how many times the device has rebooted, why it crashed, and whether it has exceeded its allowable retry budget?",
                "To maintain operational continuity across hardware resets, embedded architectures utilize Non-Volatile Boot State Records. These records reside in memory regions that survive processor resets, brownouts, and watchdog trips: 1) Battery-Backed RTC Backup Registers; 2) Uninitialized Retentive SRAM; or 3) Dedicated Non-Volatile Flash Trailer Sectors.",
                "In ARM Cortex-M microcontrollers (such as STM32, NXP LPC, and Microchip SAM), the Real-Time Clock (RTC) domain is powered by a dedicated backup power plane (VBAT) connected to a coin cell or supercapacitor. The RTC peripheral contains a bank of 32-bit Backup Registers (RTC_BKPxR). Unlike main SRAM, which is cleared by the Power-On Reset (POR) circuit, RTC Backup Registers preserve their 32-bit values across all software resets, watchdog timeouts, and system pin resets.",
                "Let us analyze the structure of a production Non-Volatile Boot Record. It contains: 1) Boot Counter (tracks total boot attempts for the current image); 2) Max Boot Attempts (typically set to 2 or 3); 3) Last Reset Reason (captured from the MCU Reset Controller: e.g., IWDG_RESET, WWDG_RESET, PIN_RESET, SOFTWARE_RESET, or HARD_FAULT); 4) Crash Location PC (Program Counter at the moment of HardFault, captured by the crash handler); and 5) CRC-16 Checksum.",
                "The Crash Loop Detection Invariant: Every time the bootloader initializes, it reads the Boot Record. If the active firmware is in TRIAL mode, the bootloader increments the Boot Counter by 1. If the candidate firmware subsequently boots successfully and passes its canary tests, the application resets the Boot Counter back to 0 and commits the image.",
                "However, if the application crashes during startup, the watchdog resets the processor. Upon rebooting, the bootloader inspects the Boot Record: the Boot Counter is now 2. If the counter reaches or exceeds `MAX_BOOT_ATTEMPTS` (e.g., 3), the bootloader recognizes that the candidate firmware is chronically unstable. It declares a Crash Loop Condition, marks the candidate slot as PERMANENTLY_REJECTED, and triggers an automated rollback to the backup firmware or factory Golden Image.",
                "In systems without battery-backed RTC registers, engineers utilize a specialized linker section known as `.noinit` in internal SRAM. By placing the boot record in a `.noinit` section, the C runtime startup code (Reset_Handler) is instructed to skip zeroing or initializing this memory block upon warm reboot.",
                "However, because `.noinit` SRAM loses data during total power removal (cold boot), mission-critical systems mirror the boot record into a dedicated Flash trailer sector using monotonic bit-clearing counters.",
                "To ensure tamper-resistance, the boot record also records an anti-rollback sequence stamp. If an attacker attempts to clear the crash counter by manually resetting the device dozens of times, the monotonic sequence tracking in Flash prevents the counter from ever decrementing.",
                "Moreover, when the HardFault exception handler triggers, it extracts the stacked register frame (R0, R1, R2, R3, R12, LR, PC, xPSR) directly from the Main Stack Pointer (MSP) or Process Stack Pointer (PSP). It writes the exact faulting instruction PC and Link Register (LR) into the RTC backup registers, creating a high-fidelity minidump that is later transmitted to the cloud.",
                "In enterprise microcontrollers, the reset reason register (such as RCC->RSR on STM32 or RSTSRC on Silicon Labs) must be explicitly cleared by the bootloader after reading by asserting the RMVF (Remove Reset Flag) bit. If software neglects to clear the reset flags, an initial power-on reset indicator remains latched across subsequent watchdog trips, blinding the supervisor to new failure events.",
                "By tracking boot attempts and reset reasons across resets, the bootloader makes deterministic, mathematically sound decisions that prevent unattended devices from endlessly thrashing in crash loops."
            ],
            "example": "A candidate firmware enters a HardFault 500ms after boot due to an unhandled divide-by-zero. The bootloader increments the RTC Boot Counter from 1 to 2, reboots, crashes again (counter = 3), and on the 3rd attempt, triggers an immediate rollback to the previous stable release.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <string>

enum class ResetReason : uint8_t {
    POWER_ON_RESET   = 0,
    PIN_RESET        = 1,
    SOFTWARE_RESET   = 2,
    WATCHDOG_TIMEOUT = 3,
    HARD_FAULT_CRASH = 4
};

struct RtcBootRecord {
    uint8_t bootAttempts;
    uint8_t maxAllowedAttempts;
    ResetReason lastReason;
    uint32_t lastFaultingProgramCounter;
    bool isTrialMode;

    RtcBootRecord() 
        : bootAttempts(0), maxAllowedAttempts(3), 
          lastReason(ResetReason::POWER_ON_RESET), lastFaultingProgramCounter(0), isTrialMode(true) {}
};

class BootLoopSupervisor {
private:
    RtcBootRecord rtcDomain;
    std::string activeFirmware;
    std::string goldenBackup;

public:
    BootLoopSupervisor()
        : activeFirmware("v3.2.0-candidate"), goldenBackup("v3.1.0-stable") {}

    bool evaluateBootHealth(ResetReason resetEvent, uint32_t faultPc = 0) {
        rtcDomain.lastReason = resetEvent;
        rtcDomain.lastFaultingProgramCounter = faultPc;

        if (rtcDomain.isTrialMode) {
            rtcDomain.bootAttempts++;
            std::cout << "[SUPERVISOR] Boot attempt " << (int)rtcDomain.bootAttempts 
                      << " of " << (int)rtcDomain.maxAllowedAttempts 
                      << " | Reset Reason: " << getReasonName(resetEvent) << std::endl;

            if (rtcDomain.bootAttempts >= rtcDomain.maxAllowedAttempts) {
                std::cout << "[CRASH-LOOP-DETECTED] Threshold exceeded! Firmware " << activeFirmware 
                          << " is chronically crashing at PC: 0x" << std::hex << faultPc << std::endl;
                triggerAutomatedRollback();
                return false;
            }
        }
        return true;
    }

    void triggerAutomatedRollback() {
        std::cout << "[ROLLBACK-ACTION] Invalidating candidate slot in Flash trailer..." << std::endl;
        std::cout << "  -> Swapping active boot target to Golden Backup: " << goldenBackup << std::endl;
        activeFirmware = goldenBackup;
        rtcDomain.isTrialMode = false;
        rtcDomain.bootAttempts = 0;
        std::cout << "  -> [RECOVERY COMPLETE] Successfully restored stable firmware!" << std::endl;
    }

    std::string getReasonName(ResetReason r) const {
        switch (r) {
            case ResetReason::POWER_ON_RESET: return "POWER_ON_RESET";
            case ResetReason::PIN_RESET: return "PIN_RESET";
            case ResetReason::SOFTWARE_RESET: return "SOFTWARE_RESET";
            case ResetReason::WATCHDOG_TIMEOUT: return "WATCHDOG_TIMEOUT";
            case ResetReason::HARD_FAULT_CRASH: return "HARD_FAULT_CRASH";
            default: return "UNKNOWN";
        }
    }
};

int main() {
    std::cout << "--- DAY 48 PART 3: NON-VOLATILE CRASH LOOP COUNTER SIMULATION ---" << std::endl;
    BootLoopSupervisor supervisor;

    std::cout << "\\nSimulating repeated crash loop under Trial Probation:" << std::endl;
    // Attempt 1: First boot crashes in HardFault
    supervisor.evaluateBootHealth(ResetReason::HARD_FAULT_CRASH, 0x080145A0);

    // Attempt 2: Reboot, watchdog trips
    supervisor.evaluateBootHealth(ResetReason::WATCHDOG_TIMEOUT, 0x08019820);

    // Attempt 3: Third crash triggers automatic rollback
    supervisor.evaluateBootHealth(ResetReason::HARD_FAULT_CRASH, 0x080145A0);
    return 0;
}
""",
            "output": """--- DAY 48 PART 3: NON-VOLATILE CRASH LOOP COUNTER SIMULATION ---

Simulating repeated crash loop under Trial Probation:
[SUPERVISOR] Boot attempt 1 of 3 | Reset Reason: HARD_FAULT_CRASH
[SUPERVISOR] Boot attempt 2 of 3 | Reset Reason: WATCHDOG_TIMEOUT
[SUPERVISOR] Boot attempt 3 of 3 | Reset Reason: HARD_FAULT_CRASH
[CRASH-LOOP-DETECTED] Threshold exceeded! Firmware v3.2.0-candidate is chronically crashing at PC: 0x80145a0
[ROLLBACK-ACTION] Invalidating candidate slot in Flash trailer...
  -> Swapping active boot target to Golden Backup: v3.1.0-stable
  -> [RECOVERY COMPLETE] Successfully restored stable firmware!
""",
            "codeNotes": [
                {
                    "line": 7,
                    "note": "ResetReason maps MCU hardware reset controller flags captured upon reboot."
                },
                {
                    "line": 16,
                    "note": "RtcBootRecord models non-volatile memory in battery-backed RTC registers or uninitialized SRAM."
                },
                {
                    "line": 43,
                    "note": "Exceeding maxAllowedAttempts triggers automated slot rollback to restore operational sanity."
                }
            ],
            "tryIt": "Describe how capturing the faulting Program Counter (PC) in an RTC register accelerates post-mortem root-cause analysis.",
            "check": {
                "question": "Where should crash loop counters and reset reason flags be stored on an ARM Cortex-M microcontroller to survive unexpected watchdog resets?",
                "options": [
                    "In battery-backed RTC Backup Registers or uninitialized .noinit SRAM sections that preserve contents across processor warm resets.",
                    "In standard dynamic C heap memory allocated with malloc().",
                    "In the CPU register R0.",
                    "In the instruction cache controller."
                ],
                "answer": 0,
                "why": "General SRAM and heap memory are reinitialized by startup code during a reset. RTC Backup Registers and .noinit sections retain data across warm resets, preserving crash metrics."
            }
        },
        {
            "title": "Hardware Watchdog (IWDG) Integration & Probation Timeouts",
            "say": [
                "Software-level timers and FreeRTOS software watchdogs are fundamentally incapable of providing true recovery guarantees. If the microcontroller encounters a deadlock in a critical section with interrupts disabled (`__disable_irq()`), if the processor enters a HardFault loop, or if the main clock oscillator (HSE) fails, software timers stop ticking entirely. The only mechanism that can guarantee recovery from a catastrophic software freeze is an Independent Hardware Watchdog (IWDG).",
                "The Independent Watchdog is a dedicated silicon peripheral powered by its own independent, low-speed internal RC oscillator (typically LSI running at 32 kHz to 40 kHz). Crucially, the LSI clock source is electrically separate from the main CPU system clock (HSE/HSI). Even if the main PLL loses lock, the CPU execution pipeline locks up, or the software enters an infinite while(1) loop, the IWDG continues counting down relentlessly.",
                "Let us analyze the IWDG hardware architecture in ARM Cortex-M microcontrollers. The IWDG consists of: 1) Key Register (IWDG_KR); 2) Prescaler Register (IWDG_PR); 3) Reload Register (IWDG_RLR); and 4) Status Register (IWDG_SR).",
                "To prevent rogue software pointers or stack overflows from accidentally reconfiguring or disabling the watchdog, the IWDG is protected by strict hardware key locks: 1) Writing 0xCCCC to IWDG_KR starts the watchdog timer; 2) Writing 0x5555 unlocks access to the PR and RLR registers; 3) Writing 0xAAAA reloads (kicks/feeds) the countdown counter back to the RLR value.",
                "The Silicon Non-Stop Invariant: Once started by writing 0xCCCC, the Independent Watchdog CANNOT be stopped by software under any circumstance until a system reset occurs! Neither the CPU, the debugger, nor any software instruction can disable the timer. If software fails to write 0xAAAA to IWDG_KR before the counter reaches zero, the IWDG hardware asserts a direct reset line to the MCU reset controller, forcing an immediate hardware reset.",
                "During a FOTA Trial Boot, the bootloader or startup code configures the IWDG with a tight probation timeout (e.g., 5 seconds). A dedicated low-priority supervisory task is tasked with kicking the watchdog. However, this task only feeds the watchdog if all high-priority application tasks report healthy execution flags and the canary suite has completed.",
                "If the candidate firmware contains an unhandled exception or hangs waiting for an unresponsive hardware bus, the watchdog is starved of reload keys. Within 5 seconds, the hardware forces a reset, allowing the bootloader to intercept the crash and revert to the backup slot.",
                "Furthermore, modern safety-critical standards (such as IEC 61508 and ISO 26262) mandate the use of Windowed Watchdogs (WWDG). Unlike an independent watchdog that can be kicked at any time before underflow, a Window Watchdog requires software to kick it within a strictly bounded time window (neither too late NOR too early!).",
                "If a corrupted software program enters an uncontrolled infinite loop that continuously executes the watchdog kick function, the Window Watchdog detects the abnormally early kick and immediately triggers a hardware reset! This prevents corrupted code from masquerading as a healthy system.",
                "When calculating watchdog prescalers, engineers must account for wide clock frequency variations in the internal LSI RC oscillator. An on-chip 32 kHz RC oscillator can drift between 26 kHz and 45 kHz across the -40 deg C to +105 deg C industrial temperature range. A nominal 5.0-second timeout must be computed using worst-case maximum frequency bounds (e.g., 45 kHz) to ensure the watchdog never trips prematurely during cold weather starts.",
                "Moreover, in modern automotive microcontrollers, the watchdog circuit can be linked to an external system basis chip (SBC) over SPI. If the MCU watchdog line does not toggle with the expected cryptographic challenge-response sequence, the external SBC physically cuts core power, forcing a hard silicon cold reboot.",
                "Mastering hardware watchdog timers is non-negotiable for embedded engineers building life-critical and mission-critical devices that must never freeze in the field."
            ],
            "example": "A smart pacemaker or automotive braking controller arms an independent hardware watchdog with a 200ms timeout. If a software deadlock halts task scheduling for more than 200ms, the independent LSI oscillator trips a silicon reset, restarting the controller safely.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

class HardwareIwdgSimulator {
private:
    uint16_t reloadValue;
    uint16_t currentCounter;
    bool isRunning;
    bool registersLocked;

public:
    HardwareIwdgSimulator(uint16_t timeoutTicks)
        : reloadValue(timeoutTicks), currentCounter(timeoutTicks),
          isRunning(false), registersLocked(true) {}

    void start() {
        isRunning = true;
        currentCounter = reloadValue;
        std::cout << "[IWDG-HARDWARE] Started independent watchdog with timeout: " 
                  << reloadValue << " ticks (Powered by separate LSI oscillator)." << std::endl;
        std::cout << "  -> Hardware Invariant: Watchdog CANNOT be stopped by software!" << std::endl;
    }

    void reload() {
        if (!isRunning) return;
        currentCounter = reloadValue;
        std::cout << "[IWDG-KICK] Software wrote 0xAAAA to IWDG_KR. Counter refreshed to: " 
                  << reloadValue << std::endl;
    }

    bool tick(uint16_t elapsedTicks) {
        if (!isRunning) return true;

        if (elapsedTicks >= currentCounter) {
            currentCounter = 0;
            std::cout << "[IWDG-TIMEOUT-RESET] Counter underflow! Hardware asserted system reset line!" << std::endl;
            return false; // Hardware Reset Triggered
        }

        currentCounter -= elapsedTicks;
        std::cout << "[IWDG-TICK] Counter decremented to: " << currentCounter << " ticks." << std::endl;
        return true;
    }
};

int main() {
    std::cout << "--- DAY 48 PART 4: HARDWARE INDEPENDENT WATCHDOG (IWDG) ---" << std::endl;
    HardwareIwdgSimulator iwdg(100);

    // Start watchdog during trial probation
    iwdg.start();

    // Normal task execution feeds watchdog
    iwdg.tick(30);
    iwdg.reload();

    // Software hangs in deadlock: fails to kick watchdog
    std::cout << "\\nSimulating software deadlock (watchdog starvation):" << std::endl;
    iwdg.tick(50);
    bool systemAlive = iwdg.tick(60); // 50 + 60 = 110 > 100 -> Timeout!

    if (!systemAlive) {
        std::cout << "-> Bootloader intercepts IWDG_RESET flag upon reboot for rollback handling." << std::endl;
    }
    return 0;
}
""",
            "output": """--- DAY 48 PART 4: HARDWARE INDEPENDENT WATCHDOG (IWDG) ---
[IWDG-HARDWARE] Started independent watchdog with timeout: 100 ticks (Powered by separate LSI oscillator).
  -> Hardware Invariant: Watchdog CANNOT be stopped by software!
[IWDG-TICK] Counter decremented to: 70 ticks.
[IWDG-KICK] Software wrote 0xAAAA to IWDG_KR. Counter refreshed to: 100

Simulating software deadlock (watchdog starvation):
[IWDG-TICK] Counter decremented to: 50 ticks.
[IWDG-TIMEOUT-RESET] Counter underflow! Hardware asserted system reset line!
-> Bootloader intercepts IWDG_RESET flag upon reboot for rollback handling.
""",
            "codeNotes": [
                {
                    "line": 15,
                    "note": "start() models writing 0xCCCC to IWDG_KR, permanently latching the watchdog active until reset."
                },
                {
                    "line": 23,
                    "note": "reload() models writing key 0xAAAA to refresh the hardware down-counter."
                },
                {
                    "line": 34,
                    "note": "Underflow triggers an immediate, unmaskable hardware reset to break deadlocks."
                }
            ],
            "tryIt": "Explain why the Independent Watchdog must use a separate low-speed internal oscillator (LSI) rather than the main CPU PLL clock.",
            "check": {
                "question": "Why can an Independent Hardware Watchdog (IWDG) recover a system from a complete software freeze when a software timer cannot?",
                "options": [
                    "Because the IWDG is clocked by a dedicated, independent on-chip RC oscillator (LSI) and asserts a direct silicon reset line regardless of CPU state, PLL failures, or disabled interrupts.",
                    "Because the IWDG uses AI to predict when code will crash.",
                    "Because the IWDG runs on the cloud server.",
                    "Because the IWDG re-flashes the application every 10 seconds."
                ],
                "answer": 0,
                "why": "The IWDG is electrically and logically independent of the main CPU core and system clock. If the CPU deadlocks or the PLL fails, the independent LSI-powered counter continues running until it asserts a hardware reset."
            }
        },
        {
            "title": "Immutable Golden Factory Image Fallback & Disaster Recovery",
            "say": [
                "What happens in the absolute worst-case scenario: what if both Slot 0 AND Slot 1 contain corrupted or incompatible firmware images? Perhaps an unexpected hardware revision was shipped with a different sensor pinout, causing both candidate and previous firmware builds to fail their canary self-tests; or perhaps severe Flash wear corrupted both application sectors simultaneously.",
                "If both application slots are invalid or crash-looping, a standard dual-slot system will permanently brick. To survive this catastrophic double-fault scenario, mission-critical IoT architectures incorporate an Immutable Golden Factory Image Fallback.",
                "The Golden Image is a minimal, ultra-hardened, self-contained firmware binary burned into a dedicated Flash partition at the factory during end-of-line production testing. Crucially, the Flash sectors containing the Golden Image are permanently locked using hardware Write Protection Option Bytes (WRP). Once locked at the factory, neither the application, the bootloader, nor any remote command can erase or overwrite these sectors without physical JTAG unlock.",
                "The Golden Image possesses a single, singular mission: Emergency Network Recovery. It contains no complex UI, no motor control loops, and no unnecessary features. It contains only: 1) Hardware abstraction layer for basic GPIO and UART/cellular modem; 2) Minimal TLS network stack; and 3) A stripped-down FOTA client capable of connecting to the cloud recovery endpoint and requesting a clean, compatible firmware binary.",
                "Let us analyze the Disaster Recovery Decision Matrix executed by the Stage 1 Bootloader: 1) The bootloader inspects Slot 0: If valid and confirmed, boot Slot 0. 2) If Slot 0 fails or crash-loops, the bootloader checks Slot 1: If valid, boot Slot 1. 3) If Slot 1 also fails validation or crash-loops (double-slot failure), the bootloader triggers the Golden Boot Sequence.",
                "During a Golden Boot, the bootloader sets SCB->VTOR to the Golden Partition address (e.g., 0x080E0000), resets the hardware watchdogs, and jumps into the factory image. The Golden Image powers up the modem, broadcasts an emergency telemetry alert (`ALERT: DOUBLE_SLOT_CORRUPTION_RESTORED_TO_GOLDEN`), connects to the FOTA server, and downloads a fresh build into Slot 0.",
                "This guarantees that under no circumstance can a software update permanently brick the device. Even if an engineer pushes an update that breaks all existing partitions, the immutable silicon-locked Golden Image acts as an unbreakable life raft.",
                "From a supply-chain and lifecycle perspective, the Golden Image should be tested and certified against all planned hardware revisions. When designing the Flash partition map, reserving 128KB or 256KB for a write-protected Golden Image is the ultimate insurance policy against multi-million-dollar hardware recalls.",
                "During automated factory programming, the golden image is written via bed-of-nails pogo pin fixtures. Once written and verified with hardware CRC, the production software issues the command to blow the write-protection fuses in the MCU Option Bytes. Any subsequent in-circuit programming attempt will trigger a bus fault error.",
                "Furthermore, the Golden Image incorporates an emergency backoff timer. When booted, it sends recovery pings every 5 minutes rather than immediately flooding cellular networks, preventing 50,000 devices recovering from a bad fleet update from causing a cellular tower denial-of-service event.",
                "In aerospace and rail infrastructure, the Golden Image is also stored on a physically isolated secondary SPI NOR Flash IC. If internal MCU Flash suffers silicon gate oxide degradation from cosmic radiation, the bootloader copies the Golden Image from external ROM into SRAM, ensuring complete operational survival.",
                "To prevent malicious physical tampering, the Golden Image sector write protection cannot be reversed without performing an Option Byte regression that triggers a mass erase of the entire chip. This silicon invariant guarantees that an attacker with physical access cannot replace the golden image with a trojaned binary while preserving user data.",
                "By integrating Dual-Bank topologies, differential delta patching, canary self-testing, and golden image disaster recovery, you have mastered the complete architectural discipline of enterprise IoT resilience."
            ],
            "example": "A fleet of 5,000 smart water meters suffers a corrupted OTA update that damages both Slot 0 and Slot 1. The bootloader detects the double-fault, activates the immutable Golden Image at 0x080E0000, connects via NB-IoT, and automatically re-downloads a certified factory image.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>
#include <string>

enum class SlotHealth : uint8_t {
    HEALTHY_COMMITTED = 0,
    CORRUPTED_OR_CRASH = 1
};

struct FlashPartitionInfo {
    std::string name;
    uint32_t address;
    uint32_t sizeBytes;
    bool hardwareWriteLocked;
    SlotHealth health;
};

class DisasterRecoveryBootloader {
private:
    FlashPartitionInfo slot0;
    FlashPartitionInfo slot1;
    FlashPartitionInfo goldenImage;

public:
    DisasterRecoveryBootloader()
        : slot0{"Slot 0 (Active)", 0x08010000, 448 * 1024, false, SlotHealth::HEALTHY_COMMITTED},
          slot1{"Slot 1 (Staging)", 0x08080000, 448 * 1024, false, SlotHealth::HEALTHY_COMMITTED},
          goldenImage{"Golden Factory Image", 0x080E0000, 128 * 1024, true, SlotHealth::HEALTHY_COMMITTED} {}

    void setSlotHealth(int slotIdx, SlotHealth health) {
        if (slotIdx == 0) slot0.health = health;
        else if (slotIdx == 1) slot1.health = health;
    }

    void executeBootArbitration() {
        std::cout << "[BOOTLOADER-ARBITRATION] Evaluating Flash Partition Integrity..." << std::endl;
        
        // Step 1: Check Slot 0
        if (slot0.health == SlotHealth::HEALTHY_COMMITTED) {
            std::cout << "  -> [NORMAL BOOT] Booting Slot 0 at 0x" << std::hex << slot0.address << std::dec << std::endl;
            return;
        }
        std::cout << "  -> [WARNING] Slot 0 is CORRUPT or Crash-Looping!" << std::endl;

        // Step 2: Check Slot 1
        if (slot1.health == SlotHealth::HEALTHY_COMMITTED) {
            std::cout << "  -> [RECOVERY BOOT] Reverting to Slot 1 at 0x" << std::hex << slot1.address << std::dec << std::endl;
            return;
        }
        std::cout << "  -> [CRITICAL] Slot 1 is ALSO CORRUPT! Double-slot failure detected!" << std::endl;

        // Step 3: Disaster Recovery Fallback to Golden Image
        triggerGoldenEmergencyBoot();
    }

    void triggerGoldenEmergencyBoot() {
        std::cout << "[DISASTER-RECOVERY] Activating Immutable Golden Factory Image..." << std::endl;
        std::cout << "  Partition: " << goldenImage.name << " @ 0x" << std::hex << goldenImage.address << std::dec << std::endl;
        std::cout << "  Hardware Write-Lock: " << (goldenImage.hardwareWriteLocked ? "LOCKED (Hardware WRP)" : "OPEN") << std::endl;
        std::cout << "  -> [GOLDEN BOOT SUCCESS] Minimal emergency recovery firmware running!" << std::endl;
        std::cout << "  -> Broadcasting Cloud Rescue Alert: 'ALERT: FIELD_RESTORED_TO_GOLDEN'" << std::endl;
        std::cout << "  -> Connecting to recovery FOTA server to download certified factory image." << std::endl;
    }
};

int main() {
    std::cout << "--- DAY 48 PART 5: IMMUTABLE GOLDEN IMAGE RECOVERY SIMULATION ---" << std::endl;
    DisasterRecoveryBootloader bl;

    std::cout << "\\nTest 1: Standard Boot with Healthy Slot 0:" << std::endl;
    bl.executeBootArbitration();

    std::cout << "\\nTest 2: Slot 0 Corrupted; Automatic Reversion to Slot 1:" << std::endl;
    bl.setSlotHealth(0, SlotHealth::CORRUPTED_OR_CRASH);
    bl.executeBootArbitration();

    std::cout << "\\nTest 3: Catastrophic Double-Slot Failure (Slots 0 & 1 Corrupt):" << std::endl;
    bl.setSlotHealth(1, SlotHealth::CORRUPTED_OR_CRASH);
    bl.executeBootArbitration();
    return 0;
}
""",
            "output": """--- DAY 48 PART 5: IMMUTABLE GOLDEN IMAGE RECOVERY SIMULATION ---

Test 1: Standard Boot with Healthy Slot 0:
[BOOTLOADER-ARBITRATION] Evaluating Flash Partition Integrity...
  -> [NORMAL BOOT] Booting Slot 0 at 0x8010000

Test 2: Slot 0 Corrupted; Automatic Reversion to Slot 1:
[BOOTLOADER-ARBITRATION] Evaluating Flash Partition Integrity...
  -> [WARNING] Slot 0 is CORRUPT or Crash-Looping!
  -> [RECOVERY BOOT] Reverting to Slot 1 at 0x8080000

Test 3: Catastrophic Double-Slot Failure (Slots 0 & 1 Corrupt):
[BOOTLOADER-ARBITRATION] Evaluating Flash Partition Integrity...
  -> [WARNING] Slot 0 is CORRUPT or Crash-Looping!
  -> [CRITICAL] Slot 1 is ALSO CORRUPT! Double-slot failure detected!
[DISASTER-RECOVERY] Activating Immutable Golden Factory Image...
  Partition: Golden Factory Image @ 0x80e0000
  Hardware Write-Lock: LOCKED (Hardware WRP)
  -> [GOLDEN BOOT SUCCESS] Minimal emergency recovery firmware running!
  -> Broadcasting Cloud Rescue Alert: 'ALERT: FIELD_RESTORED_TO_GOLDEN'
  -> Connecting to recovery FOTA server to download certified factory image.
""",
            "codeNotes": [
                {
                    "line": 15,
                    "note": "goldenImage is placed in write-protected Flash sectors (hardware WRP) to guarantee recovery."
                },
                {
                    "line": 34,
                    "note": "executeBootArbitration evaluates Slot 0 -> Slot 1 -> Golden Image in strict priority order."
                },
                {
                    "line": 49,
                    "note": "Golden Image provides unbreakable fallback when both primary and secondary slots are corrupted."
                }
            ],
            "tryIt": "Explain why the Golden Image must be write-protected in silicon Option Bytes rather than by software flags.",
            "check": {
                "question": "What is the ultimate purpose of an Immutable Golden Factory Image in enterprise embedded devices?",
                "options": [
                    "To serve as an indestructible, write-protected recovery firmware that boots and connects to the cloud when both Slot 0 and Slot 1 fail, preventing permanent field bricking.",
                    "To make the firmware binary smaller during network transmission.",
                    "To replace the hardware watchdog timer.",
                    "To calibrate the analog-to-digital converter on every boot."
                ],
                "answer": 0,
                "why": "The Golden Image is burned into write-protected Flash sectors at the factory. If both primary and secondary application slots fail or crash-loop, the bootloader falls back to the Golden Image to restore cloud communications."
            }
        }
    ],
    "summary": [
        "Cryptographic signature verification ensures authenticity and integrity but cannot detect runtime bugs, null pointers, or hardware lockups.",
        "Probationary trial booting runs new firmware under tight watchdog supervision until autonomous canary hardware self-tests qualify the build.",
        "The Canary Hardware Self-Testing Suite validates SRAM, Flash filesystems, I2C/SPI sensors, and cloud communication before setting the Image OK confirmation bit.",
        "Non-volatile boot records in battery-backed RTC registers or .noinit SRAM track boot counts across resets, detecting crash loops and triggering automated rollbacks.",
        "An immutable Golden Factory Image burned in hardware write-protected Flash sectors guarantees survival even in catastrophic double-slot corruption scenarios."
    ],
    "projectStep": {
        "title": "Implementing the Self-Testing Canary Harness and Watchdog Supervisor",
        "steps": [
            "Configure the Independent Watchdog (IWDG) to run on the 32 kHz LSI clock with a 5-second timeout during trial boots.",
            "Implement the 5-point Canary Self-Testing Suite in C++ verifying SRAM, LittleFS, sensor IDs, ADC voltages, and MQTT handshake.",
            "Set up RTC Backup Register tracking to increment boot attempt counters and capture the faulting Program Counter on HardFault resets.",
            "Verify that injecting a simulated sensor failure triggers a watchdog reset, causing the bootloader to cleanly fall back to the backup slot."
        ]
    }
}

with open('scripts/iot_emb_day48.json', 'w', encoding='utf-8') as f:
    json.dump(day48, f, indent=2)
print("Wrote scripts/iot_emb_day48.json successfully!")
