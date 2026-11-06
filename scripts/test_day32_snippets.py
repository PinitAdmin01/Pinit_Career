# scripts/test_day32_snippets.py
import sys
import hashlib
import struct

print("Testing Day 32 Python Snippets...")

# Snippet 1: Clock Period & Setup-Time Violation Margin
s1 = """import struct

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

# Snippet 2: Multiplexer Clock Glitch Pulse Generator
s2 = """import struct

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

# Snippet 3: Branch Inversion via Clock Glitch
s3 = """import struct

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

# Snippet 4: Hardware Clock Glitch Detector & Software Defenses
s4 = """import hashlib

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

# Snippet 5: Production Clock Glitch Penetration Testing Suite
s5 = """import hashlib
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

import subprocess
snippets = [s1, s2, s3, s4, s5]
for i, s in enumerate(snippets):
    res = subprocess.run([sys.executable, "-c", s], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Snippet {i+1} FAILED:\n{res.stderr}")
        sys.exit(1)
    print(f"Snippet {i+1} Output:\n{res.stdout}")

print("All 5 Day 32 snippets tested successfully!")
