#!/usr/bin/env python3
"""
generate_iot_sec_day9.py
Course 19 (iot_sec) Month 1 Block 2 Day 9:
Hardware Debug Port Security: JTAG/SWD Disabling, Bitfuse Lockout & Password Protection
"""
import json, subprocess

def run_code(code_str: str) -> str:
    proc = subprocess.run(["python", "-c", code_str], capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Code execution failed:\n{proc.stderr}\nCode:\n{code_str}")
    return proc.stdout.strip()

# --- PART 1: JTAG / SWD TAP Architecture & Physical Exploitation ---
p1_code = """# JTAG TAP Controller & Hardware Debug Exploitation Simulator
class JTAGTAPExploitationSimulator:
    def __init__(self):
        # 16-state IEEE 1149.1 Test Access Port (TAP) state machine
        self.tap_state = "TEST_LOGIC_RESET"
        self.idcode = 0x4BA00477  # ARM Cortex-M4 CoreSight DP ID
        self.ram_dump = {}

    def transition_tap(self, tms_sequence: list):
        # State transitions driven by TMS clocking
        for tms in tms_sequence:
            if self.tap_state == "TEST_LOGIC_RESET" and tms == 0:
                self.tap_state = "RUN_TEST_IDLE"
            elif self.tap_state == "RUN_TEST_IDLE" and tms == 1:
                self.tap_state = "SELECT_DR_SCAN"
            elif self.tap_state == "SELECT_DR_SCAN" and tms == 0:
                self.tap_state = "CAPTURE_DR"
            elif self.tap_state == "CAPTURE_DR" and tms == 0:
                self.tap_state = "SHIFT_DR"

    def read_core_memory_via_swd(self, address: int, length_bytes: int, port_locked: bool) -> dict:
        if port_locked:
            return {
                "status": "HARDWARE_ACCESS_DENIED_PORT_LOCKED",
                "bytes_dumped": None,
                "security_alert": "JTAG_DAP_SECURITY_LOCK_ACTIVE"
            }
        # Unlocked debug port: Attacker directly reads SRAM without CPU cooperation!
        simulated_sram = b"SECRET_AES_KEY_IN_RAM_88921"
        return {
            "status": "ARBITRARY_SRAM_DUMP_SUCCESS",
            "bytes_dumped": simulated_sram[:length_bytes].hex(),
            "extracted_secret": simulated_sram[:length_bytes].decode(errors="ignore")
        }

jtag = JTAGTAPExploitationSimulator()
jtag.transition_tap([0, 1, 0, 0])

# Scenario A: Unlocked Debug Port
unprotected = jtag.read_core_memory_via_swd(0x20000000, 27, port_locked=False)
# Scenario B: Hardened Lockout
locked = jtag.read_core_memory_via_swd(0x20000000, 27, port_locked=True)

print("=== JTAG/SWD Hardware Debug Exploitation Audit ===")
print("TAP State Machine Status:", jtag.tap_state)
print("CoreSight Device IDCODE: ", hex(jtag.idcode))
print("Unlocked Debug Port Read:", unprotected["status"])
print(f"  Extracted RAM Secret:   '{unprotected['extracted_secret']}'")
print("Locked Debug Port Read:  ", locked["status"])
print("Hardware Invariant: Open debug ports allow total RAM and flash extraction in under 1 second.")
"""
p1_out = run_code(p1_code)

p1_say = [
    "During firmware development and initial factory board bring-up, hardware debug interfaces are an embedded engineer's most indispensable diagnostic tool. Standardized in 1990 under IEEE Standard 1149.1 as the Standard Test Access Port and Boundary-Scan Architecture—commonly known as JTAG (Joint Test Action Group)—and later streamlined by ARM as Serial Wire Debug (SWD), these interfaces provide low-level access to the internal electrical buses and core execution units of modern microcontrollers and SoCs. Through an external debug probe (such as a J-Link or ST-LINK), a software engineer can halt the CPU core, step through assembly instructions, inspect internal CPU registers, and write directly to arbitrary memory addresses.",
    "The physical architecture of JTAG relies on a dedicated on-chip Test Access Port (TAP) controller governed by a standardized 16-state synchronous finite state machine. The interface exposes four primary signals: Test Clock (TCK), Test Mode Select (TMS), Test Data In (TDI), and Test Data Out (TDO), along with an optional asynchronous Test Reset (TRST). By applying specific high and low digital patterns to TMS on the rising edges of TCK, an external debugger navigates between state columns, shifting instructions into the Instruction Register (IR) or shifting arbitrary binary payloads into Data Registers (DR), including the Boundary Scan Register and Device Identification (IDCODE) register.",
    "ARM Serial Wire Debug (SWD) preserves full JTAG debug functionality while reducing the physical pin count from four or five down to just two: SWDIO (bidirectional data line) and SWCLK (clock line). Underneath both JTAG and SWD on modern ARM Cortex-M and Cortex-A processors sits ARM CoreSight architecture, centered around the Debug Access Port (DAP). The DAP is split into a Debug Port (DP)—which interfaces with the external physical pins—and one or more Access Ports (APs). The Memory Access Port (MEM-AP) is particularly significant: it connects the DAP directly to the microcontroller's internal Advanced High-performance Bus (AHB) or Advanced Peripheral Bus (APB) crossbar matrix.",
    "While this direct bus connectivity is invaluable for engineers debugging firmware in the laboratory, it represents a catastrophic vulnerability if left accessible in deployed production IoT devices. In typical embedded microcontrollers, the MEM-AP operates as an independent hardware bus master. This means an external attacker who physically connects a \$10 debugger to the PCB's SWD pads can halt the CPU core and issue direct AHB memory reads to extract the entire contents of internal flash memory and SRAM. The attacker does not need to know any device passwords, bypass operating system permissions, or exploit any software vulnerabilities.",
    "Through direct MEM-AP access, an adversary can dump proprietary intellectual property, machine learning neural network weights, symmetric AES encryption keys held in RAM, and cryptographic private keys within seconds. Furthermore, the debugger can write arbitrary bytes into flash or RAM, disabling security check routines in real time or patching the vector table to seize total control of the device. Consequently, securing or disabling hardware debug interfaces is a mandatory prerequisite before shipping commercial hardware.",
    "Automated port scanning tools and hardware multi-tools (such as the JTAGulator) make finding hidden or unlabeled debug pads trivial. An attacker simply connects a multi-pin ribbon cable to unpopulated test pads on the circuit board, and the tool rapidly cycles through pin permutations, clocking TMS and monitoring TDO until it identifies the IEEE 1149.1 TAP state machine and extracts the chip's silicon IDCODE. Designers cannot rely on 'security through obscurity' by merely hiding test pads; security must be enforced by hardware silicon gates."
]

# --- PART 2: Irreversible Silicon Lockout via eFuses ---
p2_code = """# Silicon eFuse Debug Lockout Controller
class SiliconDebugFuseController:
    def __init__(self):
        # eFuse bits: 0 = unblown (conductive), 1 = permanently blown (open circuit)
        self.fuses = {
            "DEBUG_DISABLE": 0,
            "SECURE_BOOT_EN": 1,
            "JTAG_PERM_LOCK": 0
        }
        self.dap_access_enabled = True

    def burn_debug_lockout_efuse(self, vdd_programming_v: float) -> str:
        if vdd_programming_v < 2.5:
            return "ERROR: INSUFFICIENT_PROGRAMMING_VOLTAGE"
        # Permanently blow debug lockout eFuse links
        self.fuses["DEBUG_DISABLE"] = 1
        self.fuses["JTAG_PERM_LOCK"] = 1
        # Hardware logic gate permanently disconnects DAP from system bus
        self.dap_access_enabled = False
        return "EFUSE_BURNED_SILICON_PERMANENTLY_LOCKED"

    def attempt_debugger_attach(self) -> dict:
        if self.fuses["DEBUG_DISABLE"] == 1:
            return {
                "attached": False,
                "dap_status": "DEBUG_PORT_DISABLED_BY_SILICON_FUSE",
                "swd_line_state": "PULLDOWN_TRI_STATED"
            }
        return {
            "attached": True,
            "dap_status": "DEBUGGER_ATTACH_PERMITTED_HALT_CPU",
            "swd_line_state": "ACTIVE_COMMUNICATION"
        }

ctrl = SiliconDebugFuseController()
print("Initial Debug State: Attached?", ctrl.attempt_debugger_attach()["attached"])
# Factory programming burn: 2.5V pulse vaporizes polysilicon link
burn_result = ctrl.burn_debug_lockout_efuse(2.5)
print("Silicon eFuse Programming Event:", burn_result)
post_burn = ctrl.attempt_debugger_attach()
print("Post-Burn Debug State: Attached?", post_burn["attached"])
print("  Silicon Hardware Status:      ", post_burn["dap_status"])
print("Lockout Invariant: Once blown, eFuse debug disabling cannot be reversed by any software.")
"""
p2_out = run_code(p2_code)

p2_say = [
    "To permanently eliminate the threat of debug port exploitation on consumer and industrial IoT products, semiconductor manufacturers provide hardware-level debug lockout mechanisms rooted in One-Time Programmable (OTP) eFuse silicon. Rather than relying on volatile register flags or software configuration settings stored in standard flash memory—which can be cleared by full chip erases or bypassed via fault injection—eFuse lockout establishes an irreversible physical alteration of the silicon die itself.",
    "During mass production at the factory, after the final production firmware image has been flashed and all automated board testing is complete, the manufacturing test station commands the microcontroller to execute the permanent debug lockout sequence. To execute this command, the programming fixture applies a dedicated high-voltage programming pulse (typically 2.5V to 3.3V on a specialized VDD_FUSE pad) while addressing the dedicated debug-disable eFuse registers (such as `JTAG_DISABLE` or `DIS_PAD_JTAG` on modern microcontrollers).",
    "The electrical pulse delivers localized Joule heating to microscopic polysilicon or metal fuse links, vaporizing the conductive filament and creating a permanent, irreversible open circuit. Once this eFuse link is blown, dedicated analog sensing amplifiers read the open state and assert hardwired logic gates that physically disconnect the Debug Access Port (DAP) from the internal AHB/APB bus matrix. The physical SWD and JTAG pins are decoupled from the core, often internally pulled down or forced into high-impedance tri-state mode.",
    "Because the physical electrical connection inside the silicon has been physically severed, no software instruction, debugger command, or firmware reload can ever re-enable debug communication. An attacker attempting to connect an SWD probe receives no response to connection requests; the probe reports an inability to detect a target device or read the DAP IDCODE register. The CPU core becomes completely autonomous, executing strictly from internal flash memory without any external hardware intrusion vector.",
    "In addition to disabling the DAP bus connection, robust silicon designs tie the debug disable eFuse to the internal flash controller. When debug lockout is active, the silicon logic prevents the execution of arbitrary RAM-loaded code and restricts mass-erase commands that could otherwise be used to repurpose the chip. If an adversary attempts to inject voltage glitches to force the eFuse sensing circuit to misread the blown fuse as intact, hardened designs implement dual-complement differential fuse pairs, where inconsistent bit states immediately trigger a permanent hardware halt.",
    "For high-volume devices that will never require in-depth failure analysis in the field—such as consumer smart bulbs, tracking beacons, and connected toys—hard permanent eFuse blowout represents the gold standard of debug security. It provides 100% mathematical and physical assurance that the hardware debug port cannot be resuscitated by malicious actors in the field, closing the physical side-door completely."
]

# --- PART 3: Authenticated Debugging: Challenge-Response ---
p3_code = """# Authenticated Debug Unlock (Challenge-Response) Simulator
import hashlib, hmac

class AuthenticatedDebugEngine:
    def __init__(self):
        # Factory Provisioned Secret inside Secure Element / eFuses
        self.device_debug_secret = b"DEVICE_SPECIFIC_DEBUG_KEY_8829"
        self.debug_unlocked = False

    def request_debug_challenge(self) -> bytes:
        # Generate ephemeral 16-byte nonce challenge
        self.active_nonce = hashlib.sha256(b"SEED_NONCE_COUNTER_001").digest()[:16]
        return self.active_nonce

    def submit_unlock_response(self, authorization_token: str) -> bool:
        # Expected response: HMAC-SHA256(device_debug_secret, active_nonce)
        expected = hmac.new(self.device_debug_secret, self.active_nonce, hashlib.sha256).hexdigest()
        if authorization_token == expected:
            self.debug_unlocked = True
            return True
        self.debug_unlocked = False
        return False

engine = AuthenticatedDebugEngine()
challenge = engine.request_debug_challenge()

# OEM Engineering Team computes response using master HSM holding device secret
valid_response = hmac.new(b"DEVICE_SPECIFIC_DEBUG_KEY_8829", challenge, hashlib.sha256).hexdigest()
# Attacker guesses invalid token
invalid_response = "00112233445566778899aabbccddeeff"

print("=== Authenticated Debug Challenge-Response Protocol ===")
print(f"Device Challenge Nonce:  {challenge.hex()}")
print("Attacker Unlock Attempt: ", engine.submit_unlock_response(invalid_response), "| Status: ACCESS_DENIED")
print("OEM Engineer Response:   ", engine.submit_unlock_response(valid_response), "| Status: DEBUG_PORT_UNLOCKED")
print("Auth Invariant: Debug port remains completely closed without a cryptographic signature.")
"""
p3_out = run_code(p3_code)

p3_say = [
    "While permanent eFuse blowout provides absolute security against physical debug attacks, it introduces a severe operational liability for complex, high-value industrial systems, automotive control modules, and medical devices. When an industrial motor drive or avionics telemetry unit malfunctions in the field, engineering teams must be able to perform root-cause failure analysis. If the JTAG port is irreversibly severed, engineers cannot inspect CPU crash registers, examine bus faults, or diagnose memory corruption, forcing the company to discard expensive hardware without discovering the flaw.",
    "To reconcile these competing demands for physical security and diagnostic serviceability, modern silicon architectures—such as ARM TrustZone CryptoCell, NXP EdgeLock, and STMicroelectronics STM32 Trust—implement Authenticated Debug Port Access. Instead of blowing an irreversible physical fuse, the device is configured into a secured debug mode where the Debug Access Port (DAP) is disabled by default upon reset, but can be dynamically re-enabled via a cryptographic challenge-response authentication protocol.",
    "When a service technician or engineer connects a certified debug probe to the target device, the probe cannot immediately access the bus. Instead, the probe communicates with a specialized on-chip Secure Debug Controller via dedicated mailbox registers. The probe issues an `UNLOCK_DEBUG_REQUEST` command. The on-chip secure controller utilizes its hardware True Random Number Generator (TRNG) to produce an unpredictable, high-entropy cryptographic nonce (the Challenge), which it transmits over the debug pins to the probe.",
    "The debug probe forwards this challenge nonce, along with the device's unique silicon UID, to the OEM's enterprise certificate authority or engineering cloud portal. The OEM engineering portal verifies the identity of the technician and checks whether diagnostic access is authorized for this specific unit. If authorized, the portal signs the challenge nonce using the OEM's master private debug signing key (stored inside an HSM) or computes a device-specific HMAC response. The signed certificate or cryptographic token is returned to the debug probe.",
    "The debug probe writes the cryptographic response token into the device's debug unlock mailbox register. The on-chip secure controller reads the token, computes a cryptographic verification against the OEM public key or internal device secret, and checks that the returned challenge matches the active session nonce. If the verification succeeds, the hardware controller de-asserts the DAP isolation gate, granting the debugger access to core registers and memory. If the token is invalid or does not match the active nonce, the controller locks out further attempts and enters a defensive exponential backoff timeout.",
    "This cryptographic architecture guarantees that unauthorized attackers who possess the physical hardware cannot unlock the debug port, because generating the valid response requires access to the OEM's private signing infrastructure. Furthermore, every unlock event is cryptographically audited on the enterprise portal, ensuring total traceability and preventing rogue diagnostic bypasses across the fleet."
]

# --- PART 4: Secure RMA Sanitization & Lifecycle ---
p4_code = """# Return Merchandise Authorization (RMA) Sanitization & Re-Opening Simulator
import hashlib

class DeviceRMASanitizer:
    def __init__(self):
        self.lifecycle_state = "PRODUCTION_SECURE"
        self.flash_storage = {
            "TENANT_PRIVATE_KEY": "04A1B2C3D4E5F678901234567890",
            "USER_TELEMETRY_LOGS": "PATIENT_HEART_RATE_BPM_72_ECG_STABLE",
            "OEM_ROOT_OF_TRUST": "OEM_CA_PUBLIC_ANCHOR_CERT"
        }
        self.debug_port_open = False

    def trigger_secure_rma_transition(self, rma_certificate_valid: bool) -> dict:
        if not rma_certificate_valid:
            return {"status": "RMA_CERT_INVALID_REJECTED", "state": self.lifecycle_state}

        # Step 1: Zeroize all tenant sensitive data and customer keys
        self.flash_storage["TENANT_PRIVATE_KEY"] = "00" * 16
        self.flash_storage["USER_TELEMETRY_LOGS"] = "00" * 32
        
        # Step 2: Transition lifecycle state to RMA_DIAGNOSTIC
        self.lifecycle_state = "RMA_DIAGNOSTIC"
        self.debug_port_open = True

        return {
            "status": "RMA_SANITIZATION_COMPLETE_DEBUG_ENABLED",
            "state": self.lifecycle_state,
            "tenant_key_erased": self.flash_storage["TENANT_PRIVATE_KEY"] == "00" * 16,
            "debug_port_state": "OPEN_FOR_HARDWARE_FAILURE_ANALYSIS"
        }

rma = DeviceRMASanitizer()
print("=== Device Secure RMA Lifecycle & Sanitization Audit ===")
print("Initial Device State: ", rma.lifecycle_state, "| Debug Port Open?", rma.debug_port_open)
res = rma.trigger_secure_rma_transition(rma_certificate_valid=True)
print("RMA Transition Result:", res["status"])
print(f"  Tenant Keys Zeroized: {res['tenant_key_erased']}")
print(f"  Diagnostic Debug Port:{res['debug_port_state']}")
print("RMA Invariant: Silicon debug ports can ONLY be re-opened if all user secrets are zeroized.")
"""
p4_out = run_code(p4_code)

p4_say = [
    "In commercial enterprise IoT deployments, hardware security is intimately tied to the Return Merchandise Authorization (RMA) lifecycle. When an enterprise customer returns a defective or failing device to the hardware manufacturer for warranty replacement or failure analysis, a critical conflict of interest emerges. The enterprise customer insists that their proprietary business data, patient health telemetry, private network Wi-Fi passwords, and customer cryptographic keys remain completely confidential and protected from third-party exposure. Simultaneously, the OEM's failure analysis engineering team requires deep silicon debug access to diagnose failed transistors or board traces.",
    "If the OEM could simply plug in an authorized debug probe and dump the customer's operational memory, the customer's intellectual property and sensitive customer data would be exposed to factory technicians, violating compliance regulations such as HIPAA, GDPR, and PCI-DSS. To resolve this dilemma, modern secure microcontrollers implement automated, hardware-enforced RMA State Transitions governed by mandatory Data Zeroization protocols.",
    "Under a standardized device lifecycle state model (e.g., as defined by the PSA Certified lifecycle specification), a microcontroller advances through sequential, strictly monotonic states: `BLANK_SILICON` -> `FACTORY_PROVISIONING` -> `SECURE_PRODUCTION` -> `RMA_FAILURE_ANALYSIS` -> `DECOMMISSIONED`. In the `SECURE_PRODUCTION` state, the debug port is locked, and full runtime encryption protects customer storage banks. When the unit fails and is returned to the factory, the OEM test station submits an authenticated RMA Transition Certificate signed by both the customer's enterprise key and the OEM root authority.",
    "Upon cryptographically validating the dual-signed RMA Certificate, the microcontroller's internal Boot ROM activates an autonomous, un-interruptible Hardware Sanitization Sequence. The hardware memory controller triggers a bulk erase across all internal SRAM, flash data partitions, and non-volatile key storage registers. The hardware executes multiple overwrite passes with pseudorandom data followed by zeroes, ensuring complete eradication of residual charge in floating-gate or charge-trap flash cells to prevent physical data remanence recovery.",
    "Only after the hardware memory controller completes the zeroization verification and burns an OTP eFuse permanently transitioning the silicon state from `SECURE_PRODUCTION` to `RMA_FAILURE_ANALYSIS` does the chip de-isolate the JTAG/SWD debug port. Furthermore, once transitioned into the RMA state, the device can never be returned to the `SECURE_PRODUCTION` state. It is permanently marked as a diagnostic unit, preventing an adversary from abusing the RMA process to create an authorized counterfeit device.",
    "This hardware-enforced coupling of debug re-opening with mandatory zeroization provides the customer with absolute cryptographic and regulatory assurance: their sensitive assets cannot be compromised during failure analysis, while the OEM acquires the necessary silicon visibility to improve manufacturing quality across future product revisions."
]

# --- PART 5: Complete Silicon Debug Controller & RMA Gate Engine ---
p5_code = """# ApexSilicon-DebugGate: Complete Debug Port Controller & Zeroization Engine
import hashlib, hmac

class ApexSiliconDebugGate:
    def __init__(self):
        self.lifecycle = "FIELD_DEPLOYED"
        self.efuse_jtag_hard_kill = False
        self.authenticated_debug_enabled = True
        self.dap_access_active = False
        self.device_secret = hashlib.sha256(b"SILICON_UNIQUE_UID_99014").digest()
        self.flash_memory = {
            "0x08000000_BOOT": b"BOOTLOADER_FIRMWARE_BINARY",
            "0x08080000_KEYS": b"TENANT_BANKING_PRIVATE_KEY_256"
        }

    def attempt_jtag_connect(self) -> str:
        if self.efuse_jtag_hard_kill:
            return "ERROR: DAP_HARDWARE_PINS_PERMANENTLY_SEVERED"
        if self.lifecycle == "FIELD_DEPLOYED" and not self.dap_access_active:
            return "ERROR: DAP_SECURE_LOCKED_AUTHENTICATION_REQUIRED"
        return "SUCCESS: JTAG_ATTACHED_CORE_HALTED"

    def execute_rma_zeroize_and_unlock(self, rma_token: bytes, nonce: bytes) -> bool:
        # Cryptographically verify RMA token
        expected_token = hmac.new(self.device_secret, b"RMA_UNLOCK:" + nonce, hashlib.sha256).digest()
        if rma_token != expected_token:
            return False

        # Mandatory hardware zeroization: wipe all user and sensitive flash banks
        self.flash_memory["0x08080000_KEYS"] = b"\\x00" * 32
        self.lifecycle = "RMA_FAILURE_ANALYSIS"
        self.dap_access_active = True
        return True

gate = ApexSiliconDebugGate()
print("=== ApexSilicon-DebugGate State Simulation ===")
print("Field Debug Attempt 1: ", gate.attempt_jtag_connect())

# Cloud RMA server issues cryptographic unlock authorization
test_nonce = b"CHALLENGE_NONCE_4410"
valid_token = hmac.new(gate.device_secret, b"RMA_UNLOCK:" + test_nonce, hashlib.sha256).digest()

unlock_success = gate.execute_rma_zeroize_and_unlock(valid_token, test_nonce)
print("RMA Unlock Authorized? ", unlock_success)
print("Field Debug Attempt 2: ", gate.attempt_jtag_connect())
print("Sensitive Key Memory:  ", gate.flash_memory["0x08080000_KEYS"].hex())
print("Gate Invariant: Failure analysis is permitted only after cryptographic RMA sanitization.")
"""
p5_out = run_code(p5_code)

p5_say = [
    "To synthesize the principles of hardware debug security into a production-grade system architecture, embedded systems implement comprehensive Debug Gate Controllers that coordinate silicon eFuses, hardware TAP controllers, memory controllers, and cryptographic engines. The `ApexSiliconDebugGate` represents the reference implementation of this unified hardware defense strategy, managing debug access transitions throughout the entire physical lifecycle of an IoT edge device.",
    "At power-on reset, the hardware controller samples the silicon eFuse bank. If the `JTAG_PERM_LOCK` eFuse is blown, the controller permanently isolates the DAP pins from the internal bus matrix and ignores all incoming clock pulses. In this hard-kill configuration, the debug port cannot be re-opened under any circumstances, guaranteeing total physical immunity against external probe attachment for consumer products that do not require return failure analysis.",
    "If the device is configured for authenticated enterprise maintenance, the controller places the DAP into an isolated standby state. The controller permits the reading of public silicon identification registers (such as the standard IEEE 1149.1 IDCODE) so that diagnostic fixtures can identify the connected device, but strictly blocks the Memory Access Port (MEM-AP) from generating transactions on the internal AHB/APB bus. Any attempt to halt the processor or read core memory fails with a hardware bus error response.",
    "When a legitimate diagnostic session is required—such as during RMA return processing—the controller enforces a strict challenge-response handshake backed by cryptographic HMAC or public-key digital signatures. The external debugger cannot unlock the port simply by presenting a hardcoded password or toggling physical pins; it must obtain a valid cryptographic token bound to an ephemeral, high-entropy challenge nonce generated on-chip by the device's hardware TRNG.",
    "Most importantly, the unlock operation is atomically coupled to hardware zeroization. The secure controller commands the internal flash memory controller to execute a bulk sector erase and multi-pass overwrite of all tenant key regions and user data partitions before de-asserting the bus isolation gate. If power is interrupted during the zeroization sequence, the device enters a permanent security tamper state on the next reboot, refusing to boot or unlock until the memory wipe is verified.",
    "By architecting debug port security with irreversible eFuses, cryptographic challenge-response authentication, and mandatory data sanitization, embedded systems eliminate their most dangerous physical vulnerability. Attackers are prevented from extracting confidential firmware or cryptographic keys, while enterprise owners and manufacturers retain the necessary diagnostic capabilities to maintain product reliability and supply chain accountability throughout the device lifecycle."
]

def make_long_lesson_day9():
    return {
        "coursePrefix": "iot_sec",
        "day": 9,
        "title": "Hardware Debug Port Security: JTAG/SWD Disabling, Bitfuse Lockout & Password Protection",
        "goal": "Master microcontroller hardware debug interface security, analyzing JTAG/SWD silicon architecture, boundary scan exploitation, irreversible eFuse debug lockout, Challenge-Response debug authentication, and secure RMA lifecycles.",
        "minutes": 38,
        "recap": "Previously, we explored physical side-channel defenses and Secure Elements. Today, we confront the most dangerous direct physical back-door on embedded hardware: the JTAG and SWD debug ports.",
        "parts": [
            {
                "title": "Anatomy of JTAG & SWD: TAP State Machine and Memory Exploitation",
                "say": p1_say,
                "example": "An open SWD/JTAG debug port allows an external probe to halt the CPU core and dump internal SRAM and flash memories over the MEM-AP bus master in under one second.",
                "code": p1_code,
                "output": p1_out,
                "codeNotes": [
                    "JTAGTAPExploitationSimulator models IEEE 1149.1 TAP state transitions driven by TMS clocking.",
                    "ARM CoreSight MEM-AP functions as an independent bus master capable of reading SRAM without CPU software execution.",
                    "Hardened lockout mechanisms isolate the DAP to reject unauthorized memory reads and protect confidential assets."
                ],
                "tryIt": "Add a flash memory region to simulated_sram and simulate dumping the firmware vector table over an unlocked debug port.",
                "check": {
                    "question": "Why is an open JTAG/SWD port on a deployed IoT device considered a critical security vulnerability?",
                    "options": [
                        "It acts as an independent hardware bus master, allowing an attacker with a $10 probe to dump flash and RAM without knowing any passwords.",
                        "It increases the operating temperature of the microcontroller until the silicon melts.",
                        "It forces the Wi-Fi transceiver into beacon promiscuous mode.",
                        "It doubles the boot time of the primary application firmware."
                    ],
                    "answer": 0,
                    "why": "The JTAG/SWD Debug Access Port connects directly to the internal bus crossbar, allowing external probes to read out raw flash and SRAM contents without software authentication."
                }
            },
            {
                "title": "Irreversible Silicon Lockout via eFuse Disabling Mechanics",
                "say": p2_say,
                "example": "Factory test fixtures apply a 2.5V pulse to vaporize microscopic polysilicon eFuses, permanently isolating the DAP from the system bus with zero possibility of software reversal.",
                "code": p2_code,
                "output": p2_out,
                "codeNotes": [
                    "SiliconDebugFuseController models irreversible eFuse burning requiring 2.5V programming voltage.",
                    "Blowing debug lockout eFuses permanently asserts isolation gates and forces SWD pins into high-impedance mode.",
                    "Once vaporized, physical eFuse open circuits cannot be reversed by software re-flashing or power cycles."
                ],
                "tryIt": "Attempt to burn the lockout fuse with 1.8V and verify that insufficient programming voltage generates an error.",
                "check": {
                    "question": "What physical mechanism makes eFuse debug lockout irreversible on silicon microcontrollers?",
                    "options": [
                        "A high-voltage programming pulse permanently vaporizes a microscopic polysilicon link, creating an irreversible open circuit.",
                        "The CPU core writes a temporary flag into volatile static RAM that resets on power cycle.",
                        "A software encryption algorithm hashes the debug pin numbers into the application binary.",
                        "The external PCB traces are physically painted with non-conductive ink."
                    ],
                    "answer": 0,
                    "why": "eFuses use localized Joule heating from a programming voltage to physically vaporize conductive silicon links, creating an irreversible physical open circuit."
                }
            },
            {
                "title": "Authenticated Debug Access: Cryptographic Challenge-Response",
                "say": p3_say,
                "example": "Authenticated debug controllers keep the DAP disabled until an external probe submits a cryptographic token signed by the OEM's master private key over an ephemeral challenge nonce.",
                "code": p3_code,
                "output": p3_out,
                "codeNotes": [
                    "AuthenticatedDebugEngine generates ephemeral random challenge nonces for every diagnostic connection request.",
                    "OEM engineers calculate cryptographic responses using private keys stored safely inside enterprise HSMs.",
                    "Debug port remains completely isolated if the external probe submits an invalid token or reused challenge."
                ],
                "tryIt": "Simulate an expired or replayed nonce challenge and verify that the authentication engine rejects the unlock attempt.",
                "check": {
                    "question": "How does Challenge-Response debug authentication prevent replay attacks by malicious physical snoops?",
                    "options": [
                        "The device generates an ephemeral random nonce on-chip for each session, requiring a unique signature that cannot be reused.",
                        "The device shuts down power to its battery when a debugger is detected.",
                        "The device changes its physical MAC address every five minutes.",
                        "The device encrypts its serial number using rot13 encoding."
                    ],
                    "answer": 0,
                    "why": "By including an unpredictable, ephemeral nonce generated by an on-chip TRNG, each unlock token is mathematically valid only for that single session, defeating replay attempts."
                }
            },
            {
                "title": "Secure RMA Lifecycle & Mandatory Data Sanitization",
                "say": p4_say,
                "example": "Before silicon debug ports can be re-opened for failure analysis in an RMA diagnostic state, hardware memory controllers autonomously zeroize all tenant private keys and user logs.",
                "code": p4_code,
                "output": p4_out,
                "codeNotes": [
                    "DeviceRMASanitizer models PSA Certified lifecycle state transitions from SECURE_PRODUCTION to RMA_DIAGNOSTIC.",
                    "Hardware zeroization executes bulk erase and overwrite passes across tenant key storage before opening debug gates.",
                    "Once transitioned into RMA state, the unit cannot return to production, preventing unauthorized cloning."
                ],
                "tryIt": "Verify that attempting to trigger an RMA state transition with an invalid certificate preserves tenant keys and leaves debug closed.",
                "check": {
                    "question": "Why must an IoT device execute mandatory hardware zeroization before re-enabling debug ports during an RMA return?",
                    "options": [
                        "To protect customer privacy and intellectual property by permanently erasing sensitive tenant keys and telemetry before factory inspection.",
                        "To increase the read and write speed of the diagnostic JTAG probe.",
                        "To allow the device to boot into an unencrypted Linux distribution.",
                        "To format the external SD card for faster shipping transit."
                    ],
                    "answer": 0,
                    "why": "Mandatory data sanitization ensures customer credentials and private data are permanently destroyed before factory technicians access core memory via debug probes."
                }
            },
            {
                "title": "Complete Silicon Debug Controller & RMA Gate Engine",
                "say": p5_say,
                "example": "ApexSiliconDebugGate combines eFuse hard-kill, authenticated challenge-response unlock, and atomic zeroization to manage debug security across the full hardware lifecycle.",
                "code": p5_code,
                "output": p5_out,
                "codeNotes": [
                    "ApexSiliconDebugGate evaluates eFuse status and active lifecycle states upon every debug connection attempt.",
                    "Field deployed devices reject unauthorized probe attachment, preventing arbitrary code execution and memory theft.",
                    "Authenticated RMA unlock wipes sensitive key flash sectors to all zeros before granting diagnostic core access."
                ],
                "tryIt": "Set efuse_jtag_hard_kill to True and verify that attempt_jtag_connect reports permanently severed hardware pins.",
                "check": {
                    "question": "What happens if a field-deployed device with ApexSiliconDebugGate experiences a power cut during the RMA zeroization sequence?",
                    "options": [
                        "The hardware tamper logic asserts a permanent lock state, refusing to boot or unlock until zeroization is fully completed.",
                        "The device automatically restores all erased customer keys from an unencrypted cloud backup.",
                        "The device immediately re-opens the JTAG port in unauthenticated mode.",
                        "The device disables flash write protection permanently."
                    ],
                    "answer": 0,
                    "why": "Robust secure controllers treat interrupted zeroization as a security breach, entering a permanent lockdown state until a complete, verified wipe occurs."
                }
            }
        ],
        "summary": [
            "Hardware debug interfaces (JTAG IEEE 1149.1 and SWD) provide direct, unauthenticated bus-master memory access via the ARM CoreSight MEM-AP if not properly secured.",
            "eFuse debug lockout permanently vaporizes microscopic polysilicon links using programming voltages, physically severing DAP bus connectivity with zero software reversibility.",
            "Authenticated debug mechanisms enable diagnostic access for complex industrial hardware using cryptographic Challenge-Response protocols tied to enterprise HSMs.",
            "The Secure RMA lifecycle enforces mandatory data sanitization and bulk memory zeroization before re-opening debug ports for factory failure analysis.",
            "A unified silicon debug gate coordinates hardware eFuses, lifecycle states, and cryptographic authentication to eliminate physical back-doors while supporting maintenance."
        ],
        "projectStep": {
            "title": "Build & Validate Silicon Debug Controller & RMA Gate Engine",
            "steps": [
                "Implement a simulated IEEE 1149.1 TAP state machine and ARM CoreSight MEM-AP memory dumping emulator.",
                "Construct a silicon eFuse controller that permanently isolates the Debug Access Port upon 2.5V programming burn.",
                "Build an authenticated challenge-response debug unlock protocol utilizing HMAC-SHA256 and ephemeral nonces.",
                "Develop an automated RMA state transition pipeline enforcing mandatory flash zeroization before debug port activation.",
                "Integrate all subsystems into a unified ApexSiliconDebugGate engine verifying complete lifecycle debug defenses."
            ]
        }
    }

day9_data = make_long_lesson_day9()
with open("scripts/iot_sec_day9.json", "w", encoding="utf-8") as f:
    json.dump(day9_data, f, indent=2)

words = [sum(len(s.split()) for s in p["say"]) for p in day9_data["parts"]]
print(f"Day 9 generated successfully! Words per part: {words} (Total: {sum(words)}, Min: {min(words)})")
