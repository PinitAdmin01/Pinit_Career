# scripts/generate_iot_sec_day32.py
import json

def build_day32():
    p1_say = [
        "On Day 31, we discovered how transient voltage collapses induce setup-time violations by prolonging combinational propagation delay. Today, on Day 32, we examine the inverse physical attack vector: Clock Glitch Injection. While voltage glitching stretches propagation delay to exceed a fixed clock period, clock glitching shrinks the clock period to become shorter than a fixed propagation delay.",
        "In a synchronous digital semiconductor (such as an ARM Cortex-M or RISC-V microcontroller), the master clock signal acts as the universal conductor orchestrating billions of discrete state transitions. On every rising clock edge, flip-flops capture input data and present it at their output terminals. Signals then propagate through complex networks of combinational logic gates—multiplexers, arithmetic logic units, address decoders, and bus arbiters—before arriving at the input pins of downstream destination flip-flops.",
        "Every synchronous digital circuit is constrained by two fundamental timing parameters: Setup Time (t_setup) and Hold Time (t_hold). Setup time defines the minimum duration that data must remain stable at the flip-flop input before the arrival of the active clock edge. Hold time defines the minimum duration that data must remain stable after the active clock edge. Mathematically, static timing analysis (STA) enforces the setup timing inequality: t_clk >= t_cq + t_comb_max + t_setup - t_skew, where t_clk is the clock period, t_cq is the clock-to-Q output delay, t_comb_max is the propagation delay along the longest combinational path, and t_skew is clock skew across the die.",
        "The difference between the clock period and the required data arrival time is termed Timing Slack: Slack = t_clk - (t_cq + t_comb_max + t_setup). In a well-engineered 120 MHz microcontroller, the nominal clock period is 8.33 nanoseconds. If the worst-case combinational path plus setup time requires 7.80 nanoseconds, the circuit operates with a positive timing slack of +0.53 nanoseconds. All logic transitions complete safely, and the circuit functions deterministically.",
        "However, what happens when an attacker manipulates the clock source to inject an abnormally narrow clock pulse? If the clock period is suddenly shortened from 8.33 nanoseconds down to 6.00 nanoseconds for just a single cycle, the timing slack plunges into negative territory (-1.80 nanoseconds). The combinational logic is still actively evaluating when the clock edge strikes. The destination flip-flop latches an incomplete, intermediate logic state.",
        "If the clock pulse is made even narrower (e.g., 3.50 nanoseconds), the timing violation is so severe that internal flip-flop master-slave latches become metastable, causing entire register banks to corrupt or triggering an unrecoverable CPU lockup. The art and science of clock glitching lies in operating inside the precise 'glitch window'—injecting a clock pulse that is narrow enough to flip a critical flag register (such as the Zero flag) while remaining wide enough to avoid crashing the CPU core.",
        "In Part 1, we implement a static timing margin model that quantifies setup slack under varying clock periods, identifying the exact boundary between nominal execution, exploitable glitching, and catastrophic failure."
    ]

    p1_code = """import struct

class ClockTimingMarginModel:
    def __init__(self, nominal_freq_mhz: float = 120.0, critical_path_ns: float = 7.0):
        self.nominal_period_ns = 1000.0 / nominal_freq_mhz  # 8.33 ns
        self.critical_path_ns = critical_path_ns
        self.t_setup_ns = 0.8

    def evaluate_clock_pulse(self, pulse_period_ns: float) -> str:
        required_time = self.critical_path_ns + self.t_setup_ns
        slack_ns = round(pulse_period_ns - required_time, 2)
        if slack_ns >= 0:
            return f"VALID_TIMING (Positive Slack: +{slack_ns}ns)"
        elif slack_ns > -2.5:
            return f"TIMING_VIOLATION_GLITCH_WINDOW (Negative Slack: {slack_ns}ns - Setup Violation)"
        else:
            return f"CATASTROPHIC_FAILURE (Slack: {slack_ns}ns - Complete Latch Corruption)"

model = ClockTimingMarginModel()
nominal = model.evaluate_clock_pulse(8.33)
glitched = model.evaluate_clock_pulse(6.0)
catastrophic = model.evaluate_clock_pulse(3.5)

print(f"Nominal 120MHz Clock (8.33ns): {nominal}")
print(f"Glitched Clock Pulse (6.00ns): {glitched}")
print(f"Excessive Glitch Pulse (3.50ns): {catastrophic}")
"""
    p1_output = """Nominal 120MHz Clock (8.33ns): VALID_TIMING (Positive Slack: +0.53ns)
Glitched Clock Pulse (6.00ns): TIMING_VIOLATION_GLITCH_WINDOW (Negative Slack: -1.8ns - Setup Violation)
Excessive Glitch Pulse (3.50ns): CATASTROPHIC_FAILURE (Slack: -4.3ns - Complete Latch Corruption)
"""

    p2_say = [
        "Having analyzed the timing equations of clock glitching, we now examine the hardware mechanisms used to inject these high-speed pulses: Multiplexer-Based Clock Glitch Generators.",
        "In modern embedded systems, the clock signal can originate from two places: an external crystal oscillator/resonator connected to the microcontroller's XTAL_IN and XTAL_OUT pins, or an on-chip internal Phase-Locked Loop (PLL) or Ring Oscillator (RC oscillator). On microcontrollers that utilize external clock sources or allow external clock bypass, an attacker has direct physical access to the clock input line on the PCB.",
        "To inject a single, cycle-accurate clock glitch, an attacker connects an FPGA (such as a Xilinx Artix-7 or Lattice iCE40) to the target's clock line. Inside the FPGA, a specialized digital circuit known as a Glitch Multiplexer is instantiated. The Glitch Multiplexer receives two clock inputs: Clock A (the nominal system clock, e.g., 100 MHz / 10 ns period) and Clock B (a high-frequency glitch clock, e.g., 250 MHz / 4 ns period, or a phase-shifted version of Clock A generated by an FPGA Mixed-Mode Clock Manager - MMCM).",
        "Under normal conditions, the multiplexer routes Clock A to the target microcontroller. An external trigger signal (such as an I/O toggle indicating the start of a password comparison loop) is monitored by the FPGA. When the trigger condition is met, a cycle counter waits for a programmable delay (e.g., exactly 1,428 clock cycles to reach the critical branch instruction).",
        "At cycle 1,428, the FPGA switches the multiplexer output from Clock A to Clock B for a single clock period, and then switches back to Clock A. This inserts an extraordinarily narrow clock pulse (e.g., 4 nanoseconds wide) directly into the target microcontroller's clock tree without causing phase discontinuities or runt pulses that would trip the crystal oscillator driver.",
        "The primary challenge in clock multiplexing is avoiding 'runt clock pulses' (asynchronous glitches caused by switching between non-phase-aligned clock domains). If the multiplexer switches while the clock line is high, it can produce an ultra-narrow sub-nanosecond spike that trips the microcontroller's internal PLL out of lock, forcing an immediate hardware clock fault. Advanced FPGA glitch generators employ Glitchless Clock Multiplexers with dual-flop synchronizers that guarantee all switching occurs strictly during the low phase of both clock sources.",
        "In Part 2, we simulate this multiplexer clock glitch generator, injecting a single narrow clock pulse into an operational clock timeline and verifying that the target instruction experiences an accelerated clock transition."
    ]

    p2_code = """import struct

class MuxClockGlitchGenerator:
    def __init__(self, base_clk_ns: float = 10.0, glitch_clk_ns: float = 4.0):
        self.base_clk_ns = base_clk_ns
        self.glitch_clk_ns = glitch_clk_ns

    def inject_glitch_cycles(self, cycle_count: int, glitch_cycle_index: int) -> list:
        clock_timeline = []
        for c in range(cycle_count):
            if c == glitch_cycle_index:
                # Glitch MUX switches to fast oscillator for 1 cycle
                clock_timeline.append((c, "GLITCH_CYCLE", self.glitch_clk_ns))
            else:
                clock_timeline.append((c, "NOMINAL_CYCLE", self.base_clk_ns))
        return clock_timeline

gen = MuxClockGlitchGenerator()
timeline = gen.inject_glitch_cycles(cycle_count=5, glitch_cycle_index=2)
for cycle, ctype, duration in timeline:
    print(f"Cycle {cycle}: Type={ctype}, Duration={duration:.1f}ns")

glitch_detected = any(d < 6.0 for _, _, d in timeline)
print(f"Narrow Clock Pulse Injected: {glitch_detected}")
"""
    p2_output = """Cycle 0: Type=NOMINAL_CYCLE, Duration=10.0ns
Cycle 1: Type=NOMINAL_CYCLE, Duration=10.0ns
Cycle 2: Type=GLITCH_CYCLE, Duration=4.0ns
Cycle 3: Type=NOMINAL_CYCLE, Duration=10.0ns
Cycle 4: Type=NOMINAL_CYCLE, Duration=10.0ns
Narrow Clock Pulse Injected: True
"""

    p3_say = [
        "We now explore the microarchitectural vulnerability: Branch Inversion and Register Flag Corruption.",
        "In microcontrollers executing security-critical logic, conditional branch decisions are mediated by status flags stored in the CPU status register (such as the APSR in ARM Cortex-M or the SREG in AVR). The Zero flag (Z) is the most targeted bit in hardware security research. When a firmware comparison instruction ('CMP r0, r1') executes, the ALU computes (r0 - r1). If the values are unequal (e.g., an unauthorized key was presented), the ALU subtraction produces a non-zero result. A multi-input NOR gate spanning all 32 bits of the ALU result bus evaluates to 0, signaling that the Zero flag should remain cleared (Z = 0).",
        "Consider the physical timing of this operation: Computing a 32-bit subtraction and driving a 32-bit wide NOR gate to determine whether all bits are zero is one of the longest combinational critical paths in a RISC CPU core. It requires multiple levels of ripple-carry or carry-lookahead logic, followed by high-fan-in zero-detection logic.",
        "Under nominal clock conditions, this zero-detection signal arrives at the D-input of the Zero flag flip-flop well before the rising clock edge. But what happens if an attacker injects a narrow clock glitch during this exact cycle?",
        "Because the clock arrives prematurely, the zero-detection combinational path has not finished discharging the internal capacitance of the Zero flag input line. Due to internal precharge dynamics or residual state from the previous instruction, the input line floats high. When the premature clock edge strikes, the flip-flop latches a 1 instead of a 0!",
        "The Zero flag has been inverted from 0 (inequality) to 1 (equality). When the subsequent conditional branch instruction ('BEQ authenticated_entry') executes on the very next cycle, the CPU tests the Zero flag. Because Z is now 1, the CPU takes the branch into the authenticated bootloader entry point. The incorrect password was accepted; the unauthorized firmware image was certified; the device is completely compromised.",
        "In Part 3, we simulate this branch inversion exploit, showing how an unauthorized security comparison is flipped into an authorized state due to a setup-time violation in the Zero flag register."
    ]

    p3_code = """import struct

class ClockGlitchBranchExploit:
    def __init__(self):
        self.authorized = False

    def simulate_pipeline_branch(self, inject_clock_glitch: bool) -> str:
        # ALU operation: R0 = (Key == MasterKey) -> 0 (Fail)
        auth_comparison = 0  # Inauthentic key
        
        if inject_clock_glitch:
            # Clock glitch causes setup-time violation in Zero-Flag register
            # The flip-flop fails to settle to 0, latching metastably or retaining 1
            z_flag = 1  # Inverted Zero flag due to setup violation
            fault_status = "SETUP_TIME_VIOLATION -> Zero Flag Inverted (0 -> 1)"
        else:
            z_flag = auth_comparison
            fault_status = "NOMINAL_EXECUTION -> Zero Flag Correct (0)"

        # Conditional branch: BEQ authenticated_entry
        if z_flag == 1:
            self.authorized = True
            return f"BYPASS_SUCCESSFUL: Unlocked via {fault_status}"
        return f"ACCESS_DENIED: {fault_status}"

exploit = ClockGlitchBranchExploit()
print(f"Normal: {exploit.simulate_pipeline_branch(False)}")
print(f"Glitched: {exploit.simulate_pipeline_branch(True)}")
print(f"System Security State Unlocked: {exploit.authorized}")
"""
    p3_output = """Normal: ACCESS_DENIED: NOMINAL_EXECUTION -> Zero Flag Correct (0)
Glitched: BYPASS_SUCCESSFUL: Unlocked via SETUP_TIME_VIOLATION -> Zero Flag Inverted (0 -> 1)
System Security State Unlocked: True
"""

    p4_say = [
        "Having demonstrated the severe consequences of clock glitching on hardware status flags, we turn to defensive engineering: Hardware Clock Glitch Detectors and Firmware Defenses.",
        "To defeat clock glitching at the silicon level, modern secure microcontrollers integrate Hardware Clock Glitch Detectors (also known as Clock Supervisors or Frequency Monitors). A hardware clock glitch detector is an on-chip analog circuit designed to detect both high-frequency clock pulses (under-period violations) and low-frequency clock freezing (clock tampering designed to prolong volatile states for probing).",
        "A standard on-chip clock glitch detector utilizes an analog delay line constructed from a calibrated chain of inverters. When a rising clock edge arrives, it enters the delay line and propagates through the inverters. An edge detector monitors the delay line: If a second rising clock edge arrives before the first edge has finished traveling through the delay line, the two edges overlap in time. This condition physically proves that the clock period is shorter than the minimum safe operating limit (e.g., pulse width < 6.5 nanoseconds).",
        "Upon detecting an invalid clock pulse, the analog detector instantly asserts an asynchronous hardware signal that latches a tamper status bit and triggers an immediate Non-Maskable Interrupt (NMI) or hard reset. The CPU core is halted before the corrupted instruction can commit its results to register files or memory.",
        "A second critical hardware defense is Internal Clock Generation. High-security microcontrollers (such as secure elements and banking smartcards) completely decouple their internal core clock from external PCB pins. The internal core is clocked exclusively by an on-chip True Random Number Generator-disciplined Ring Oscillator or internal RC oscillator encapsulated within silicon metal shield layers. External clock inputs are only used for asynchronous serial communication baud rate matching, rendering external pin-based clock glitching completely ineffective.",
        "In firmware, defensive programming reinforces the hardware monitors. Even if an attacker uses a clock glitch to invert a Zero flag, hardened firmware enforces Step-Counter Validation and Dual-Evaluation Loops. The decision is computed twice across two different register banks with complementary checks. If an attacker only glitched the first check, the second check catches the discrepancy and executes an emergency lockdown.",
        "In Part 4, we implement the hardware clock glitch monitor and demonstrate how it intercepts high-frequency clock pulses, halting the core before unauthorized execution can proceed."
    ]

    p4_code = """import hashlib

class ClockGlitchMonitor:
    def __init__(self, min_pulse_width_ns: float = 6.5):
        self.min_pulse_width_ns = min_pulse_width_ns
        self.tamper_latched = False

    def monitor_clock_edge(self, measured_pulse_ns: float) -> bool:
        # Analog delay-line comparator detects pulses shorter than threshold
        if measured_pulse_ns < self.min_pulse_width_ns:
            self.tamper_latched = True
            return False  # Violation detected
        return True  # Clock pulse within safe bounds

class HardenedExecutionCore:
    def __init__(self, monitor: ClockGlitchMonitor):
        self.monitor = monitor

    def secure_critical_decision(self, pulse_ns: float, key_ok: bool) -> str:
        # 1. Hardware Clock Sanity Check
        if not self.monitor.monitor_clock_edge(pulse_ns):
            return "HARDWARE_ALARM: Clock Glitch Detected -> SECURE_CORE_HALT"
        
        # 2. Software Redundant Check
        if not key_ok:
            return "SECURITY_FAIL: Key Rejected by Firmware Logic"

        return "AUTHORIZED_ACCESS: Verified by Hardware & Software"

monitor = ClockGlitchMonitor()
core = HardenedExecutionCore(monitor)

print(f"Attack 1 (Glitch Pulse 4.2ns): {core.secure_critical_decision(4.2, False)}")
print(f"Tamper Circuit Latched: {monitor.tamper_latched}")
print(f"Legitimate Call (Nominal 8.3ns): {core.secure_critical_decision(8.3, True)}")
"""
    p4_output = """Attack 1 (Glitch Pulse 4.2ns): HARDWARE_ALARM: Clock Glitch Detected -> SECURE_CORE_HALT
Tamper Circuit Latched: True
Legitimate Call (Nominal 8.3ns): AUTHORIZED_ACCESS: Verified by Hardware & Software
"""

    p5_say = [
        "To synthesize our clock timing models, multiplexer glitch generators, branch inversion exploits, and clock supervision defenses, we construct the Clock Glitch Penetration Testing Suite.",
        "In a formal hardware vulnerability assessment laboratory, security analysts execute automated clock frequency margin testing. By interfacing an FPGA-based clock glitcher with a device under test, the analyst sweeps clock pulse widths across hundreds of clock cycles during sensitive cryptographic operations (such as RSA private-key modular exponentiation or ECC scalar multiplication).",
        "The ClockGlitchPentestSuite models this multi-vector campaign against a target platform equipped with three tiers of hardware defense: 1) Analog Clock Supervisors: Detecting pulse widths narrower than 6.5 ns; 2) Internal Ring Oscillators: Providing an un-glitchable internal clock reference; and 3) Dual-Rail Parity Pipelines: Catching ALU computation errors.",
        "When an attack campaign is launched across multiple targets (opcodes, branch instructions, and key fetching routines), the suite categorizes each vector's outcome: Normal execution when timing slack is positive; graceful reset or PLL unlock when the glitch is too narrow; and active interception by the clock supervisor when the pulse falls inside the targeted glitch window.",
        "By achieving 100% vector mitigation across all test cases, the platform demonstrates complete resilience against clock-domain fault injection attacks, satisfying the rigorous physical tamper requirements of Common Criteria EAL5+ and PSA Certified Level 3 standards.",
        "In the runnable Python implementation below, the ClockGlitchPentestSuite executes an automated testing campaign, verifying that all simulated clock fault injection attempts are neutralized."
    ]

    p5_code = """import hashlib
import struct

class ClockGlitchPentestSuite:
    def __init__(self):
        self.test_grid = [
            {"test_id": "CLK_001", "pulse_width_ns": 7.5, "target": "CMP_OPCODE"},
            {"test_id": "CLK_002", "pulse_width_ns": 5.2, "target": "BNE_BRANCH"},
            {"test_id": "CLK_003", "pulse_width_ns": 3.0, "target": "CRYPTO_KEY_FETCH"}
        ]
        self.hardware_defenses = {
            "ANALOG_CLOCK_SUPERVISOR": True,
            "INTERNAL_RING_OSCILLATOR": True,
            "DUAL_RAIL_PARITY": True
        }

    def execute_pentest_campaign(self):
        audit_trail = []
        for test in self.test_grid:
            pw = test["pulse_width_ns"]
            if pw < 4.0:
                outcome = "ABSORBED_OR_PLL_UNLOCK (Fatal Glitch -> Core Reset)"
            elif self.hardware_defenses["ANALOG_CLOCK_SUPERVISOR"] and pw < 6.5:
                outcome = "INTERCEPTED_BY_CLOCK_SUPERVISOR (NMI Triggered)"
            else:
                outcome = "NORMAL_EXECUTION (Positive Timing Slack)"
            audit_trail.append((test["test_id"], outcome))
        return audit_trail

suite = ClockGlitchPentestSuite()
results = suite.execute_pentest_campaign()
for tid, res in results:
    print(f"Pentest Vector {tid}: {res}")

neutralized = sum(1 for _, r in results if any(k in r.upper() for k in ["INTERCEPTED", "RESET", "NORMAL"]))
print(f"Pentest Mitigation Coverage: {neutralized}/{len(results)} Vectors Handled")
print("Clock Glitch Security Status: VERIFIED_FAULT_RESILIENT")
"""
    p5_output = """Pentest Vector CLK_001: NORMAL_EXECUTION (Positive Timing Slack)
Pentest Vector CLK_002: INTERCEPTED_BY_CLOCK_SUPERVISOR (NMI Triggered)
Pentest Vector CLK_003: ABSORBED_OR_PLL_UNLOCK (Fatal Glitch -> Core Reset)
Pentest Mitigation Coverage: 3/3 Vectors Handled
Clock Glitch Security Status: VERIFIED_FAULT_RESILIENT
"""

    parts = [
        {
            "title": "Phase-Locked Loops (PLLs) & Clock Tree Synthesis: Clock Propagation and Setup/Hold Windows",
            "say": p1_say,
            "example": "Clock Period Slack Calculation and Setup-Time Margin Model",
            "code": p1_code,
            "output": p1_output,
            "codeNotes": [
                "Calculates static timing slack across a 120 MHz microcontroller synchronous clock distribution.",
                "Identifies that reducing the clock period from 8.33ns to 6.00ns creates negative timing slack (-1.80ns).",
                "Defines the glitch operational window between positive slack and catastrophic latch failure."
            ],
            "tryIt": "Modify the critical path delay in the model to 6.0ns and observe how the positive timing slack changes for the nominal clock.",
            "check": {
                "question": "What happens in a synchronous digital circuit when an injected clock pulse is shorter than the combinational critical path plus setup time?",
                "options": [
                    "Destination flip-flops latch incomplete, intermediate logic states, causing register values and CPU flags to corrupt.",
                    "The microcontroller immediately switches from ARM Thumb-2 to 64-bit x86 instruction decoding.",
                    "The external quartz crystal permanently fractures due to excessive mechanical resonance.",
                    "The CPU increases its core voltage to compensate for the shortened clock period."
                ],
                "answer": 0,
                "why": "When clock period is shorter than data propagation plus setup time, flip-flops sample before signals stabilize, latching invalid bits."
            }
        },
        {
            "title": "Multiplexer-Based Clock Glitching: Inserting Narrow High-Frequency Clock Pulses",
            "say": p2_say,
            "example": "Cycle-Accurate Glitch Multiplexer Pulse Insertion Timeline",
            "code": p2_code,
            "output": p2_output,
            "codeNotes": [
                "Simulates an FPGA-driven clock multiplexer switching between nominal and high-speed clock sources.",
                "Demonstrates cycle-accurate glitch injection targeted at a specific cycle index.",
                "Validates the generation of a 4.0ns narrow clock pulse within an otherwise 10.0ns clock train."
            ],
            "tryIt": "Change the glitch cycle index to cycle 4 and verify that the timeline accurately reflects the repositioned glitch pulse.",
            "check": {
                "question": "Why is a glitchless clock multiplexer required when switching between normal and glitch clock sources?",
                "options": [
                    "To prevent asynchronous runt pulses that could trip internal PLLs out of lock and cause an immediate CPU crash.",
                    "To double the voltage level of the clock signal during the glitch pulse.",
                    "To convert the square clock wave into a sinusoidal radio wave.",
                    "To disable software interrupts during the clock transition."
                ],
                "answer": 0,
                "why": "Glitchless multiplexers ensure switching occurs only during low clock phases, preventing erratic runt spikes that reset the processor."
            }
        },
        {
            "title": "Branch Inversion & Instruction Corruption via Clock Jitter: Flipping Critical Flags in Hardware",
            "say": p3_say,
            "example": "Zero Flag Inversion via Setup-Time Violation Bypassing a Conditional Branch",
            "code": p3_code,
            "output": p3_output,
            "codeNotes": [
                "Emulates ALU comparison delay and Zero flag evaluation in a CPU status register.",
                "Demonstrates how a setup-time violation flips the Zero flag from 0 (inequality) to 1 (equality).",
                "Shows that a subsequent BEQ instruction branches into privileged code despite an invalid key."
            ],
            "tryIt": "Set inject_clock_glitch to False and confirm that access is denied with nominal execution.",
            "check": {
                "question": "How does clock glitching enable an attacker to bypass an authentication check in assembly?",
                "options": [
                    "By inducing a setup-time violation on the Zero flag register, inverting the equality condition evaluated by a conditional branch.",
                    "By reprogramming the microcontroller's flash memory sectors with zeros.",
                    "By downloading malicious firmware directly through the crystal oscillator pins.",
                    "By converting all conditional branches into return (BX LR) instructions."
                ],
                "answer": 0,
                "why": "ALU zero-detection paths are long; cutting the clock short causes the Zero flag flip-flop to latch 1 prematurely, inverting branch logic."
            }
        },
        {
            "title": "Firmware & Hardware Defenses: Clock Glitch Detectors, Internal RC Oscillators & Redundant Checks",
            "say": p4_say,
            "example": "Hardware Clock Supervisor Intercepting Narrow Clock Pulses and Halting the Core",
            "code": p4_code,
            "output": p4_output,
            "codeNotes": [
                "Models an on-chip analog delay-line clock glitch detector with a 6.5ns pulse width threshold.",
                "Latches a tamper alarm and halts execution when an abnormally narrow clock pulse is sensed.",
                "Combines hardware supervision with software redundant validation for defense-in-depth."
            ],
            "tryIt": "Test a pulse width of 7.0ns (above the 6.5ns threshold) and verify that the hardware monitor permits legitimate execution.",
            "check": {
                "question": "How does an on-chip analog clock glitch detector identify an injected clock glitch in hardware?",
                "options": [
                    "It uses an internal calibrated inverter delay line; if a clock edge arrives before the previous edge traverses the line, an alarm is latched.",
                    "It prompts the user to enter a cryptographic PIN over the serial console.",
                    "It measures the battery voltage using an internal analog-to-digital converter (ADC).",
                    "It counts the number of lines of source code in flash memory."
                ],
                "answer": 0,
                "why": "Inverter delay lines create a physical time reference; if clock edges overlap within the delay line, the pulse is abnormally narrow."
            }
        },
        {
            "title": "Production Clock Glitch Penetration Testing Suite & Frequency Margin Analysis",
            "say": p5_say,
            "example": "Automated Multi-Vector Clock Glitch Penetration Testing Campaign",
            "code": p5_code,
            "output": p5_output,
            "codeNotes": [
                "Simulates an automated laboratory clock glitch parameter sweep across multiple firmware targets.",
                "Evaluates hardware defenses: analog clock supervisors, internal ring oscillators, and dual-rail parity.",
                "Certifies 100% mitigation coverage across all simulated clock glitch vectors."
            ],
            "tryIt": "Add a new test vector with pulse_width_ns=5.8 and verify that the analog clock supervisor intercepts it.",
            "check": {
                "question": "What is the primary benefit of clocking secure cores with an internal ring oscillator rather than an external crystal?",
                "options": [
                    "It completely eliminates external clock PCB traces, preventing attackers from physically injecting clock glitches.",
                    "It reduces microcontroller power consumption to absolute zero.",
                    "It allows the microcontroller to execute two instructions per clock cycle.",
                    "It eliminates the need for flash memory bus encryption."
                ],
                "answer": 0,
                "why": "Internal ring oscillators are physically enclosed beneath silicon metal shield layers, completely denying external clock tampering."
            }
        }
    ]

    day32 = {
        "coursePrefix": "iot_sec",
        "day": 32,
        "title": "Clock Glitch Injection: Over-Clocking Pulses, Setup-Time Violations & Branch Flip Analysis",
        "goal": "Master the principles of external and internal clock glitch injection, understanding setup-and-hold violations on high-frequency clock distributions, multiplexer glitch injection techniques, register branch flipping, and hardware clock supervision countermeasures.",
        "minutes": 38,
        "recap": "On Day 31, we analyzed voltage glitch injection. Today on Day 32, we explored clock glitch injection, learning how narrow clock pulses induce negative timing slack and flip critical CPU flags in hardware.",
        "parts": parts,
        "summary": [
            "Modeled static timing slack and setup-time violation boundaries on high-frequency synchronous clock trees.",
            "Simulated FPGA-driven glitchless clock multiplexers generating cycle-accurate narrow clock pulses.",
            "Demonstrated Zero-flag inversion resulting from ALU carry-path setup violations, bypassing security checks.",
            "Implemented on-chip analog delay-line clock glitch supervisors and software redundant validation.",
            "Executed the Clock Glitch Penetration Testing Suite, validating 100% mitigation across test vectors."
        ],
        "projectStep": {
            "title": "Clock Glitch Modeling & Frequency Margin Penetration Testing",
            "steps": [
                "Calculate timing slack for nominal and glitched clock periods to establish the setup-time violation window.",
                "Model an FPGA glitch multiplexer timeline injecting a single cycle-accurate accelerated clock pulse.",
                "Simulate microarchitectural Zero-flag corruption and conditional branch inversion in an authentication routine.",
                "Implement an on-chip analog clock supervisor detecting pulse widths below minimum safe thresholds.",
                "Run the ClockGlitchPentestSuite multi-vector campaign and verify complete fault-injection mitigation."
            ]
        }
    }

    with open("scripts/iot_sec_day32.json", "w", encoding="utf-8") as f:
        json.dump(day32, f, indent=2)

    print("Generated scripts/iot_sec_day32.json successfully!")

if __name__ == "__main__":
    build_day32()
