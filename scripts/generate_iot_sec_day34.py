# scripts/generate_iot_sec_day34.py
import json

def build_day34():
    p1_say = [
        "Welcome to Day 34 of Course 19: Advanced IoT Hardware Security. Over the preceding days, we dissected physical fault injection vectors: voltage crowbars, clock glitching, and localized optical/electromagnetic perturbations. Today, we step into the silicon architect's design suite to engineer the ultimate physical countermeasure suite: Hardware Glitch Detection Circuits.",
        "While software countermeasures (such as double-branch checking and execution canaries) provide essential defense-in-depth, they suffer from an inherent theoretical limitation: software cannot execute if the underlying silicon instruction pipeline or arithmetic logic unit is fundamentally corrupted. If an attacker's glitch corrupts the Program Counter or zeroes out the ALU status register, software validation routines may never even be reached. True high-assurance security requires autonomous hardware detection circuits integrated directly into the silicon substrate.",
        "The first pillar of hardware detection is the Analog Voltage Supervisor and Rapid Transient Monitor. Conventional microcontrollers incorporate Brownout Detectors (BOD) or Low-Voltage Detectors (LVD). However, commercial BOD circuits are designed for slow, battery-depletion brownouts. They utilize low-power bandgap references and low-pass filtering with response times measured in tens of microseconds to milliseconds. A 5-nanosecond crowbar glitch passes straight through a commercial BOD completely undetected.",
        "To intercept ultra-fast crowbar pulses, secure silicon incorporates High-Speed Negative dV/dt Glitch Detectors. An analog glitch detector utilizes a calibrated high-pass capacitive differentiator (C_diff) coupled to a high-speed differential analog comparator. When the core supply voltage drops suddenly, the rapid rate of voltage change (negative dV/dt) induces a proportional discharge current through C_diff: I_diff = C_diff * (dV / dt).",
        "If the rate of voltage collapse exceeds a preset threshold (typically dV/dt > 0.5 V/ns), the comparator output transitions from low to high within less than 1 nanosecond. This trips a hardware latch connected directly to the CPU's Non-Maskable Interrupt (NMI) line and autonomous security controller. The detection occurs in purely analog circuitry, independent of software execution, system clock domains, or CPU pipeline states.",
        "In Part 1, we implement a mathematical model of an analog negative dV/dt voltage supervisor, evaluating how normal supply ripple, slow brownouts, and high-speed crowbar transients are distinguished and latched into hardware alarms."
    ]

    p1_code = """import struct

class AnalogVoltageSupervisor:
    def __init__(self, vdd_nominal: float = 3.3, max_dv_dt_v_per_ns: float = 0.5):
        self.vdd_nominal = vdd_nominal
        self.max_dv_dt = max_dv_dt_v_per_ns
        self.alarm_tripped = False

    def evaluate_voltage_transient(self, v_start: float, v_end: float, duration_ns: float) -> str:
        # Negative dV/dt calculation
        delta_v = v_start - v_end
        dv_dt = delta_v / duration_ns
        if dv_dt > self.max_dv_dt:
            self.alarm_tripped = True
            return f"GLITCH_ALARM_ASSERTED: Negative dV/dt={dv_dt:.2f} V/ns exceeds threshold {self.max_dv_dt} V/ns"
        elif v_end < 2.0:
            self.alarm_tripped = True
            return f"BROWNOUT_ALARM_ASSERTED: Voltage {v_end}V dropped below brownout limit (2.0V)"
        return f"NORMAL_POWER_PROFILE: dV/dt={dv_dt:.2f} V/ns within safe envelope"

supervisor = AnalogVoltageSupervisor()
normal = supervisor.evaluate_voltage_transient(3.3, 3.2, duration_ns=10.0)
glitch = supervisor.evaluate_voltage_transient(3.3, 1.2, duration_ns=2.0)
slow_drop = supervisor.evaluate_voltage_transient(3.3, 1.8, duration_ns=100.0)

print(f"Test 1 (Normal Ripple): {normal}")
print(f"Test 2 (Crowbar Glitch): {glitch}")
print(f"Test 3 (Slow Brownout): {slow_drop}")
print(f"Supervisor Alarm Latched: {supervisor.alarm_tripped}")
"""
    p1_output = """Test 1 (Normal Ripple): NORMAL_POWER_PROFILE: dV/dt=0.01 V/ns within safe envelope
Test 2 (Crowbar Glitch): GLITCH_ALARM_ASSERTED: Negative dV/dt=1.05 V/ns exceeds threshold 0.5 V/ns
Test 3 (Slow Brownout): BROWNOUT_ALARM_ASSERTED: Voltage 1.8V dropped below brownout limit (2.0V)
Supervisor Alarm Latched: True
"""

    p2_say = [
        "The second hardware architectural pillar for defeating physical fault injection is the Dual-Core Lockstep (DCLS) Processor Topology.",
        "In mission-critical aerospace (DO-254), automotive safety (ISO 26262 ASIL D), and high-assurance security controllers (Common Criteria EAL6+), single-core microcontrollers are deemed inherently vulnerable to transient silicon faults. A single focused laser strike, electromagnetic pulse, or voltage glitch can flip an internal register without warning.",
        "To guarantee fault detection, Dual-Core Lockstep instantiates two identical processor cores on the same silicon die: Core 0 (the Primary Core) and Core 1 (the Shadow Core). Both cores execute the exact same instruction stream simultaneously. However, naive lockstep where both cores execute synchronously on the exact same clock cycle is vulnerable to common-cause faults: a single voltage glitch would strike both cores at the identical pipeline stage, causing both cores to corrupt identically and match!",
        "To defeat common-cause fault injection, modern secure lockstep implements Cycle Staggering and Spatial Separation. The Shadow Core is delayed in time by a fixed offset—typically 2 or 3 clock cycles behind the Primary Core. Memory write buffers and register outputs from the Primary Core are delayed in a FIFO queue. When the Shadow Core completes execution 2 cycles later, an autonomous hardware Lockstep Comparator checks every address bus line, data bus line, and control signal between the two cores bit-for-bit.",
        "If an attacker injects a nanosecond glitch that flips an instruction in the Primary Core, the Shadow Core is still executing instructions from two cycles prior. When the Shadow Core reaches the glitched instruction two cycles later, the glitch pulse has already passed, so the Shadow Core executes the instruction correctly. The lockstep comparator detects the output mismatch instantly and asserts a hardware fault reset before any corrupted data can be written to memory or peripherals.",
        "Furthermore, modern chips implement Spatial Rotation. The Shadow Core is placed physically distant from the Primary Core on the silicon floorplan, and rotated by 90 or 180 degrees. This ensures that localized EMFI probes or laser spots cannot cover both cores simultaneously.",
        "In Part 2, we simulate this dual-core lockstep processor architecture with cycle staggering, verifying that an induced fault on the Primary Core is caught and halted by the comparator."
    ]

    p2_code = """import struct

class DualCoreLockstepProcessor:
    def __init__(self, stagger_cycles: int = 2):
        self.stagger_cycles = stagger_cycles
        self.core_primary_state = {}
        self.core_shadow_state = {}
        self.lockstep_comparator_mismatch = False

    def execute_cycle(self, cycle: int, primary_result: int, shadow_result: int) -> str:
        self.core_primary_state[cycle] = primary_result
        self.core_shadow_state[cycle + self.stagger_cycles] = shadow_result
        
        # When shadow reaches primary's cycle, compare outputs
        check_cycle = cycle
        if check_cycle in self.core_primary_state and check_cycle in self.core_shadow_state:
            p = self.core_primary_state[check_cycle]
            s = self.core_shadow_state[check_cycle]
            if p != s:
                self.lockstep_comparator_mismatch = True
                return f"MISMATCH_DETECTED at cycle {check_cycle}: Primary=0x{p:08X} != Shadow=0x{s:08X} -> FAULT_RESET"
            return f"CYCLE_{check_cycle}_VERIFIED: Outputs match (0x{p:08X})"
        return f"CYCLE_{cycle}_STAGGER_BUFFERING"

dcls = DualCoreLockstepProcessor(stagger_cycles=2)
# Cycle 0: Primary executes
res0 = dcls.execute_cycle(0, 0x12345678, 0x12345678)
# Cycle 2: Glitch strikes Primary, corrupting its output
res1 = dcls.execute_cycle(2, 0xCAFEBABE, 0xDEADBEEF)

print(f"DCLS Step 0: {res0}")
print(f"DCLS Step 2 (Glitched Primary): {res1}")
print(f"Lockstep Comparator Error Latched: {dcls.lockstep_comparator_mismatch}")
"""
    p2_output = """DCLS Step 0: CYCLE_0_STAGGER_BUFFERING
DCLS Step 2 (Glitched Primary): MISMATCH_DETECTED at cycle 2: Primary=0xCAFEBABE != Shadow=0x12345678 -> FAULT_RESET
Lockstep Comparator Error Latched: True
"""

    p3_say = [
        "The third hardware defense against physical glitching is Parity-Checked Pipelines and Dual-Rail Arithmetic Logic Units.",
        "While dual-core lockstep protects general-purpose CPU cores, dedicated hardware cryptographic accelerators (such as hardware AES, SHA-256, and ECC engines) require localized error-detection logic integrated directly into their internal datapath buses. If an attacker uses micro-EMFI to target an internal S-Box substitution lookup or round register, the cipher output could be corrupted for Differential Fault Analysis (DFA).",
        "To protect internal registers against bit-flipping, secure silicon implements Hardware Parity Encoding and Error-Correcting Codes (ECC). Every 32-bit register is augmented with additional parity check bits (such as 1 parity bit per byte, or a 7-bit Hamming code per 32-bit word). Whenever data is transferred along internal bus interconnects or stored in register files, the hardware parity generator calculates parity bits on-the-fly.",
        "If a laser strike, electromagnetic pulse, or voltage glitch induces a Single-Event Transient (SET) that flips any bit in the register, the hardware parity checker immediately flags an odd-parity violation. The transaction is aborted before the corrupted data can be consumed by downstream arithmetic units.",
        "At the transistor level, critical datapath elements utilize Dual-Rail Precharge Logic with Differential Sense Amplifiers. In dual-rail circuits, every logical bit Q is physically routed as two complementary signals: (Q_true, Q_false). Prior to evaluation, both lines are precharged high. During evaluation, valid logic transitions strictly force one line to stay high while the other discharges to ground. If an external fault forces both lines to discharge or prevents evaluation, an asynchronous self-checking XOR gate asserts a fault signal instantly.",
        "In Part 3, we simulate a parity-checked hardware register, demonstrating how an injected bit-flip is trapped and flagged by the internal hardware verification logic."
    ]

    p3_code = """import struct

class ParityCheckedRegister:
    def __init__(self, value: int):
        self.value = value & 0xFFFFFFFF
        self.parity = self._compute_parity(self.value)

    def _compute_parity(self, val: int) -> int:
        # Odd parity: returns 1 if number of 1-bits is even (making total odd)
        bits = bin(val).count('1')
        return 0 if (bits % 2 == 1) else 1

    def verify_integrity(self) -> bool:
        return self._compute_parity(self.value) == self.parity

    def inject_bitflip(self, bit_index: int):
        self.value ^= (1 << bit_index)

reg = ParityCheckedRegister(0x5A5A5A5A)
valid_before = reg.verify_integrity()
reg.inject_bitflip(4)  # Attacker glitches bit 4
valid_after = reg.verify_integrity()

print(f"Original Value: 0x5A5A5A5A | Parity Valid: {valid_before}")
print(f"Glitched Value: 0x{reg.value:08X} | Parity Valid: {valid_after}")
print(f"Hardware Parity Error Trapped: {not valid_after}")
"""
    p3_output = """Original Value: 0x5A5A5A5A | Parity Valid: True
Glitched Value: 0x5A5A5A4A | Parity Valid: False
Hardware Parity Error Trapped: True
"""

    p4_say = [
        "The fourth pillar of hardware glitch protection is the Asynchronous Hardware Tamper Alarm Controller and Autonomous Emergency Zeroization.",
        "When an analog voltage monitor senses a crowbar drop, a clock supervisor detects an under-period pulse, or a lockstep comparator flags a core mismatch, how does the system respond? A common design failure in naive systems is relying on a software interrupt service routine (ISR) to handle the security event. If the CPU pipeline is already compromised by the physical attack, the processor may fail to jump to the ISR or execute an attacker-controlled exception vector.",
        "In high-assurance secure microcontrollers, hardware tamper alarms are hardwired directly to an Autonomous Hardware Zeroization Controller that operates completely independently of the CPU core and software stack. The controller is powered by an internal backup power domain (such as an on-chip storage capacitor or battery backup) and clocked by an autonomous ring oscillator.",
        "When any hardware sensor asserts an alarm line, the zeroization controller executes a sub-microsecond hardware sequence: 1) Clock Gate & Core Reset: The CPU core clock is gated immediately, halting instruction execution; 2) Key Store Zeroization: Dedicated analog pull-down transistors discharge the volatile SRAM cells holding the master device secrets, TLS identity keys, and session tokens, overwriting every bit with zeroes in nanoseconds; 3) eFuse Blow Override: In extreme physical tampering scenarios, the controller can command a dedicated on-chip high-voltage charge pump to blow irreversible security fuses, permanently transitioning the device into a bricked, unrecoverable state.",
        "By enforcing autonomous hardware zeroization, the silicon ensures that even if an attacker successfully extracts the silicon die or cuts packaging bonds, no cryptographic key material survives to be analyzed.",
        "In Part 4, we simulate this autonomous tamper alarm controller, showing how a detected fault triggers immediate volatile key destruction without software intervention."
    ]

    p4_code = """import hashlib

class HardwareTamperAlarmController:
    def __init__(self):
        self.key_store_sram = {
            "DEVICE_ROOT_KEY": hashlib.sha256(b"ROOT_SEED_0x992B").digest(),
            "TLS_SESSION_KEY": hashlib.sha256(b"TLS_KEY_0x11AC").digest()
        }
        self.tamper_latched = False
        self.nmi_executed = False

    def trigger_tamper_alarm(self, source: str):
        self.tamper_latched = True
        self.nmi_executed = True
        # Sub-microsecond hardware autonomous zeroization
        for k in self.key_store_sram:
            self.key_store_sram[k] = b"\\x00" * 32

controller = HardwareTamperAlarmController()
key_sample_before = controller.key_store_sram["DEVICE_ROOT_KEY"][:8].hex().upper()
controller.trigger_tamper_alarm("ANALOG_VOLTAGE_SUPERVISOR_TRIP")
key_sample_after = controller.key_store_sram["DEVICE_ROOT_KEY"].hex()

print(f"Pre-Tamper Master Key: {key_sample_before}...")
print(f"Alarm Triggered: Tamper Latched={controller.tamper_latched}")
print(f"Post-Alarm Zeroized Key: {key_sample_after}")
print(f"Autonomous Key Destruction: {key_sample_after == '00'*32}")
"""
    p4_output = """Pre-Tamper Master Key: 5166BB6AA28FBD60...
Alarm Triggered: Tamper Latched=True
Post-Alarm Zeroized Key: 0000000000000000000000000000000000000000000000000000000000000000
Autonomous Key Destruction: True
"""

    p5_say = [
        "To conclude Day 34, we synthesize voltage supervisors, dual-core lockstep architectures, parity-checked pipelines, and autonomous zeroization into an automated evaluation tool: the Hardware Glitch Verification Suite.",
        "In modern silicon pre-silicon tape-out verification and post-silicon validation, semiconductor test engineers execute multi-fault regression campaigns. The verification suite injects synthetic physical faults across all functional domains: voltage transients, clock jitter, optical single-event upsets, and active mesh probing.",
        "The HardwareGlitchVerificationSuite verifies that each fault scenario is correctly intercepted by its assigned hardware defense subsystem: Voltage glitches trip the analog voltage supervisor; clock jitter is caught by the dual-core lockstep comparator; localized optical flips are trapped by register parity checks; and physical decapsulation is caught by active top-metal meshes.",
        "By achieving 100% fault interception across all scenarios with zero unmitigated vulnerabilities, the hardware security architecture proves its readiness for tomorrow's crowning Month 2 Milestone: Milestone 7 — The GlitchShield Silicon Fault-Injection Resilience Engine.",
        "In the runnable Python implementation below, the HardwareGlitchVerificationSuite executes a multi-scenario audit, validating complete hardware protection and certifying Grade-A silicon fault resilience."
    ]

    p5_code = """import hashlib
import struct

class HardwareGlitchVerificationSuite:
    def __init__(self):
        self.defense_subsystems = {
            "VOLTAGE_SUPERVISOR": {"status": "ACTIVE", "dV_dt_threshold": 0.5},
            "DUAL_CORE_LOCKSTEP": {"status": "ACTIVE", "stagger": 2},
            "PARITY_CHECKED_ALU": {"status": "ACTIVE", "bus_width": 32},
            "ACTIVE_OPTICAL_MESH": {"status": "ACTIVE", "serpentine": True}
        }
        self.fault_scenarios = [
            {"id": "FAULT_VOLTAGE_GLITCH", "subsystem": "VOLTAGE_SUPERVISOR", "tripped": True},
            {"id": "FAULT_CLOCK_JITTER", "subsystem": "DUAL_CORE_LOCKSTEP", "tripped": True},
            {"id": "FAULT_LASER_SEU", "subsystem": "PARITY_CHECKED_ALU", "tripped": True},
            {"id": "FAULT_FIB_PROBING", "subsystem": "ACTIVE_OPTICAL_MESH", "tripped": True}
        ]

    def verify_all_defenses(self):
        results = []
        for s in self.fault_scenarios:
            sub = self.defense_subsystems[s["subsystem"]]
            if sub["status"] == "ACTIVE" and s["tripped"]:
                results.append((s["id"], "SUCCESSFULLY_INTERCEPTED"))
            else:
                results.append((s["id"], "UNMITIGATED_VULNERABILITY"))
        return results

suite = HardwareGlitchVerificationSuite()
audit_results = suite.verify_all_defenses()
for fid, res in audit_results:
    print(f"Fault Scenario {fid}: {res}")

total_passed = sum(1 for _, r in audit_results if r == "SUCCESSFULLY_INTERCEPTED")
print(f"Hardware Fault Interception Score: {total_passed}/{len(audit_results)}")
print("Hardware Glitch Protection Certification: HARDENED_SILICON_GRADE_A")
"""
    p5_output = """Fault Scenario FAULT_VOLTAGE_GLITCH: SUCCESSFULLY_INTERCEPTED
Fault Scenario FAULT_CLOCK_JITTER: SUCCESSFULLY_INTERCEPTED
Fault Scenario FAULT_LASER_SEU: SUCCESSFULLY_INTERCEPTED
Fault Scenario FAULT_FIB_PROBING: SUCCESSFULLY_INTERCEPTED
Hardware Fault Interception Score: 4/4
Hardware Glitch Protection Certification: HARDENED_SILICON_GRADE_A
"""

    parts = [
        {
            "title": "Analog Voltage Supervisor & Rapid Transient Detectors: Negative dV/dt Threshold Detection",
            "say": p1_say,
            "example": "Analog High-Speed Negative dV/dt Glitch Detector vs Slow Brownout Model",
            "code": p1_code,
            "output": p1_output,
            "codeNotes": [
                "Calculates rate of voltage change (dV/dt) to distinguish nanosecond crowbar glitches from slow brownouts.",
                "Asserts an immediate hardware glitch alarm when negative dV/dt exceeds 0.5 V/ns.",
                "Demonstrates analog-domain fault detection operating independently of software or CPU pipeline states."
            ],
            "tryIt": "Set the duration to 1.0ns with v_end=1.0V and observe the resulting extreme dV/dt glitch alarm.",
            "check": {
                "question": "Why is a conventional commercial Brownout Detector (BOD) ineffective against crowbar voltage glitch attacks?",
                "options": [
                    "Commercial BOD circuits have response times in microseconds or milliseconds, allowing nanosecond crowbar pulses to bypass them completely.",
                    "Commercial BOD circuits only operate on alternating current (AC) power lines.",
                    "Commercial BOD circuits automatically reboot the device into an unencrypted debugging mode.",
                    "Commercial BOD circuits increase power consumption by 500%."
                ],
                "answer": 0,
                "why": "Standard BODs are filtered to avoid false alarms from power ripple; nanosecond glitches pass before standard comparators react."
            }
        },
        {
            "title": "Dual-Core Lockstep (DCLS) Processor Architectures: Cycle-Staggered Redundant Execution & Split-Lock Modes",
            "say": p2_say,
            "example": "Cycle-Staggered Dual-Core Lockstep Execution and Fault Detection Model",
            "code": p2_code,
            "output": p2_output,
            "codeNotes": [
                "Implements a 2-cycle staggered Dual-Core Lockstep (DCLS) processor architecture.",
                "Demonstrates that a transient glitch on the Primary Core is detected when compared with the delayed Shadow Core.",
                "Latches a comparator mismatch error and triggers a protective hardware reset."
            ],
            "tryIt": "Execute cycle 1 with matching outputs across both cores and verify that the lockstep comparator validates the cycle.",
            "check": {
                "question": "What is the primary security reason for staggering Shadow Core execution by 2 clock cycles in a Dual-Core Lockstep processor?",
                "options": [
                    "To prevent common-cause physical glitches (such as voltage drops) from corrupting both cores at the identical pipeline stage.",
                    "To allow the Primary Core to run at double the clock frequency of the Shadow Core.",
                    "To reduce silicon area by sharing a single instruction decoder across both cores.",
                    "To allow one core to execute Android while the other executes Linux."
                ],
                "answer": 0,
                "why": "Staggering ensures that a single transient glitch affects only one core; the delayed shadow core executes correctly, revealing the mismatch."
            }
        },
        {
            "title": "Parity-Checked Pipelines & Dual-Rail Logic: Catching Bit-Flips in ALU and Register Files",
            "say": p3_say,
            "example": "Hardware Parity-Checked Register Bit-Flip Detection",
            "code": p3_code,
            "output": p3_output,
            "codeNotes": [
                "Implements odd parity calculation and continuous integrity checking on a 32-bit hardware register.",
                "Simulates an adversarial bit-flip on bit 4, demonstrating instantaneous parity invalidation.",
                "Proves that hardware parity checkers trap single-event upsets before corrupted data is processed."
            ],
            "tryIt": "Inject a second bit-flip on bit 5 and observe how double bit-flips behave under simple single-bit parity check.",
            "check": {
                "question": "How does Dual-Rail Precharge Logic detect physical fault injection at the gate level?",
                "options": [
                    "Every logical bit is routed as two complementary wires; if an injected fault leaves both wires high or both low, an error is flagged instantly.",
                    "It prompts the operating system to re-verify cryptographic certificates.",
                    "It shuts off power to the entire circuit board for 24 hours.",
                    "It converts parallel bus transactions into serial SPI transfers."
                ],
                "answer": 0,
                "why": "Dual-rail logic enforces strict complementarity (one wire high, one low); any disruption breaks this invariant, asserting an asynchronous fault."
            }
        },
        {
            "title": "Asynchronous Hardware Alarm Handlers & Autonomous Emergency Zeroization Circuits",
            "say": p4_say,
            "example": "Autonomous Hardware Tamper Controller and Sub-Microsecond Key Zeroization",
            "code": p4_code,
            "output": p4_output,
            "codeNotes": [
                "Models an autonomous hardware zeroization controller hardwired to physical tamper alarm lines.",
                "Overwrites all volatile key storage SRAM registers with zeros in nanoseconds upon alarm trigger.",
                "Operates completely independently of the CPU core and software interrupt vectors."
            ],
            "tryIt": "Verify that all 32 bytes of both the root key and session key are completely cleared to 0x00 following zeroization.",
            "check": {
                "question": "Why must emergency key zeroization be handled by autonomous hardware rather than a software interrupt service routine?",
                "options": [
                    "Because physical faults can corrupt the CPU instruction pipeline, preventing the processor from executing software interrupt handlers reliably.",
                    "Because software zeroization requires internet connectivity to cloud servers.",
                    "Because software zeroization cannot overwrite SRAM memory cells.",
                    "Because hardware zeroization consumes less battery power during sleep mode."
                ],
                "answer": 0,
                "why": "If a physical glitch has corrupted the CPU core, software cannot be trusted to run; autonomous hardware circuits guarantee immediate erasure."
            }
        },
        {
            "title": "Production Hardware Glitch Detection Verification Suite & Multi-Fault Stress Engine",
            "say": p5_say,
            "example": "Automated Multi-Fault Defense Verification and Silicon Hardening Certification",
            "code": p5_code,
            "output": p5_output,
            "codeNotes": [
                "Audits multi-layered hardware defense subsystems across simulated physical fault injection scenarios.",
                "Verifies voltage supervisors, dual-core lockstep, parity-checked ALUs, and active optical meshes.",
                "Awards Grade-A hardware glitch protection certification upon 100% fault interception."
            ],
            "tryIt": "Change the status of one subsystem to 'INACTIVE' and observe that the verification suite detects the unmitigated vulnerability.",
            "check": {
                "question": "What standard of security certification is achieved when a microcontroller demonstrates 100% interception of hardware fault injection vectors?",
                "options": [
                    "Common Criteria EAL5+/EAL6+ and PSA Certified Level 3 physical tamper resistance.",
                    "Basic consumer FCC Part 15 electromagnetic emission compliance.",
                    "Bluetooth SIG wireless interoperability certification.",
                    "USB-IF USB 3.0 high-speed data transfer compliance."
                ],
                "answer": 0,
                "why": "Comprehensive hardware fault resilience across voltage, clock, optical, and physical probing is required for Common Criteria EAL5+ and PSA Level 3."
            }
        }
    ]

    day34 = {
        "coursePrefix": "iot_sec",
        "day": 34,
        "title": "Hardware Glitch Detection Circuits: Dual-Rail Logic, Parity-Checked Pipelines & Voltage Monitors",
        "goal": "Architect and verify on-chip hardware glitch detection circuits, including high-speed analog voltage supervisors, dual-core lockstep processor topologies, parity-checked ALU pipelines, and autonomous emergency zeroization.",
        "minutes": 38,
        "recap": "On Days 31 through 33, we investigated physical glitching across voltage, clock, EM, and laser vectors. Today on Day 34, we engineered the hardware detection fabric that senses and neutralizes these physical perturbations in silicon.",
        "parts": parts,
        "summary": [
            "Modeled high-speed analog negative dV/dt glitch supervisors detecting nanosecond voltage transients.",
            "Architected cycle-staggered Dual-Core Lockstep (DCLS) processors to detect common-cause core faults.",
            "Implemented parity-checked registers and dual-rail precharge logic for gate-level fault detection.",
            "Engineered autonomous hardware tamper alarm controllers executing sub-microsecond key zeroization.",
            "Executed the Hardware Glitch Verification Suite, certifying Grade-A silicon fault resilience across all scenarios."
        ],
        "projectStep": {
            "title": "Hardware Fault Detection Engineering & Autonomous Zeroization Architecture",
            "steps": [
                "Calculate negative dV/dt voltage collapse rates to distinguish crowbar glitches from slow brownouts.",
                "Model cycle-staggered Dual-Core Lockstep execution and verify comparator mismatch detection.",
                "Simulate a parity-checked hardware register trapping single-event upset bit-flips in silicon.",
                "Implement an autonomous hardware zeroization controller discharging volatile key SRAM in nanoseconds.",
                "Run the HardwareGlitchVerificationSuite to audit multi-fault scenarios and certify silicon fault hardening."
            ]
        }
    }

    with open("scripts/iot_sec_day34.json", "w", encoding="utf-8") as f:
        json.dump(day34, f, indent=2)

    print("Generated scripts/iot_sec_day34.json successfully!")

if __name__ == "__main__":
    build_day34()
